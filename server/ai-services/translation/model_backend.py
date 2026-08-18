"""Thin wrapper around the transformers-based translation model, kept
separate from app.py so unit tests can substitute a fake backend without
installing torch/transformers (multi-GB GPU-oriented dependencies).
"""
import time

import config
import prompt as prompt_module
from logging_utils import get_logger, log

logger = get_logger("translation.model_backend")

_tokenizer = None
_model = None
_device = None


def resolve_device():
    if config.TRANSLATION_DEVICE != "auto":
        return config.TRANSLATION_DEVICE
    try:
        import torch

        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"


def resolve_precision(device):
    if config.TRANSLATION_PRECISION != "auto":
        return config.TRANSLATION_PRECISION
    return "int4" if device == "cuda" else "fp32"


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
        else:
            model_kwargs["torch_dtype"] = torch.float16
    else:
        model_kwargs["torch_dtype"] = torch.float32

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
    input_ids = _tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(
        _model.device
    )

    generation_kwargs = dict(max_new_tokens=config.MAX_NEW_TOKENS, do_sample=config.DO_SAMPLE)
    if config.DO_SAMPLE:
        generation_kwargs["temperature"] = config.TEMPERATURE
        generation_kwargs["top_p"] = config.TOP_P

    with torch.no_grad():
        output_ids = _model.generate(input_ids, **generation_kwargs)

    new_tokens = output_ids[0][input_ids.shape[-1] :]
    decoded = _tokenizer.decode(new_tokens, skip_special_tokens=True)
    return decoded.strip()
