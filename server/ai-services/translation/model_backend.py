"""Thin wrapper around the transformers-based translation model, kept
separate from app.py so unit tests can substitute a fake backend without
installing torch/transformers (multi-GB GPU-oriented dependencies).
"""
import threading
import time

import config
import prompt as prompt_module
from logging_utils import get_logger, log

logger = get_logger("translation.model_backend")

_tokenizer = None
_model = None
_device = None
# BoundedConcurrency in app.py caps how many requests are admitted, but a
# plain transformers .generate() call on one shared model instance is not a
# documented-safe pattern for concurrent calls from multiple threads (unlike
# faster-whisper's CTranslate2 backend, which is). Each admitted request
# runs translate_one() in its own worker thread via asyncio.to_thread, so
# this lock serializes the actual generate() calls without limiting how many
# requests can be admitted/queued at once.
_generate_lock = threading.Lock()


def resolve_device():
    if config.TRANSLATION_DEVICE != "auto":
        return config.TRANSLATION_DEVICE
    try:
        import torch

        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"


VALID_PRECISIONS = {"auto", "fp32", "fp16", "bf16", "int8", "int4"}
# int4/int8 need bitsandbytes CUDA kernels - not meaningfully usable on CPU,
# so a CPU deployment requesting either falls back to fp32 with a warning
# rather than silently doing something the operator didn't ask for.
CUDA_ONLY_PRECISIONS = {"int4", "int8"}


def resolve_precision(device):
    if config.TRANSLATION_PRECISION == "auto":
        return "int4" if device == "cuda" else "fp32"
    if device == "cpu" and config.TRANSLATION_PRECISION in CUDA_ONLY_PRECISIONS:
        log(
            logger,
            "warning",
            "unsupported_precision_for_device",
            requested=config.TRANSLATION_PRECISION,
            device=device,
            using="fp32",
        )
        return "fp32"
    return config.TRANSLATION_PRECISION


def load_model():
    global _tokenizer, _model, _device
    if _model is not None:
        return _model

    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    _device = resolve_device()
    precision = resolve_precision(_device)

    started = time.monotonic()
    log(
        logger,
        "info",
        "loading_translation_model",
        model=config.TRANSLATION_MODEL_NAME,
        device=_device,
        precision=precision,
    )

    _tokenizer = AutoTokenizer.from_pretrained(config.TRANSLATION_MODEL_NAME, cache_dir=config.MODEL_CACHE_DIR)

    model_kwargs = {"cache_dir": config.MODEL_CACHE_DIR}
    if _device == "cuda":
        model_kwargs["device_map"] = "auto"
        if precision == "int4":
            from transformers import BitsAndBytesConfig

            model_kwargs["quantization_config"] = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.float16,
            )
        elif precision == "int8":
            from transformers import BitsAndBytesConfig

            model_kwargs["quantization_config"] = BitsAndBytesConfig(load_in_8bit=True)
        elif precision == "bf16":
            model_kwargs["torch_dtype"] = torch.bfloat16
        elif precision == "fp32":
            model_kwargs["torch_dtype"] = torch.float32
        else:
            model_kwargs["torch_dtype"] = torch.float16
    else:
        # int4/int8 are already redirected to fp32 by resolve_precision() above.
        model_kwargs["torch_dtype"] = torch.bfloat16 if precision == "bf16" else torch.float32

    _model = AutoModelForCausalLM.from_pretrained(config.TRANSLATION_MODEL_NAME, **model_kwargs)
    if _device == "cpu":
        _model = _model.to("cpu")
    _model.eval()

    log(logger, "info", "translation_model_loaded", load_ms=round((time.monotonic() - started) * 1000))

    if config.WARMUP_ON_STARTUP:
        try:
            translate_one("سلام")
            log(logger, "info", "translation_warmup_complete")
        except Exception as exc:  # pragma: no cover - exercised only with real deps installed
            log(logger, "warning", "translation_warmup_failed", error_type=type(exc).__name__)

    return _model


def is_ready():
    return _model is not None


def count_tokens(text):
    if _tokenizer is None:
        raise RuntimeError("Tokenizer not loaded")
    if not text:
        return 0
    return len(_tokenizer.encode(text, add_special_tokens=False))


def translate_one(text, source_language="ur", target_language="en"):
    """Translates a single bounded chunk of text (already within
    MAX_INPUT_TOKENS_PER_CHUNK) and returns only the translated text."""
    import torch

    if _model is None or _tokenizer is None:
        raise RuntimeError("Model not loaded")

    messages = prompt_module.build_messages(text, source_language, target_language)

    generation_kwargs = dict(max_new_tokens=config.MAX_NEW_TOKENS, do_sample=config.DO_SAMPLE)
    if config.DO_SAMPLE:
        generation_kwargs["temperature"] = config.TEMPERATURE
        generation_kwargs["top_p"] = config.TOP_P

    # Serialize the actual inference call against the shared model/tokenizer
    # instance - see the _generate_lock comment above.
    with _generate_lock:
        input_ids = _tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(
            _model.device
        )
        with torch.no_grad():
            output_ids = _model.generate(input_ids, **generation_kwargs)
        new_tokens = output_ids[0][input_ids.shape[-1] :]
        decoded = _tokenizer.decode(new_tokens, skip_special_tokens=True)

    return decoded.strip()
