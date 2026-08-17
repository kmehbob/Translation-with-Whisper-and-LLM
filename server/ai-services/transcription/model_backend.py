"""Thin wrapper around faster-whisper so app.py never imports it directly.

Keeping the heavy import (and the module-level model singleton) behind this
small surface lets unit tests substitute a fake backend via
`sys.modules['model_backend'] = fake` without installing faster-whisper/
ctranslate2, which are multi-GB GPU-oriented dependencies.
"""
import time

import config
from logging_utils import get_logger, log

logger = get_logger("transcription.model_backend")

_model = None
_resolved_device = None
_resolved_compute_type = None


def resolve_device():
    if config.WHISPER_DEVICE != "auto":
        return config.WHISPER_DEVICE
    try:
        import ctranslate2

        return "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
    except Exception:
        return "cpu"


def resolve_compute_type(device):
    if config.WHISPER_COMPUTE_TYPE != "auto":
        return config.WHISPER_COMPUTE_TYPE
    return "float16" if device == "cuda" else "int8"


def load_model():
    """Loads the faster-whisper model once. Safe to call multiple times."""
    global _model, _resolved_device, _resolved_compute_type
    if _model is not None:
        return _model

    from faster_whisper import WhisperModel

    _resolved_device = resolve_device()
    _resolved_compute_type = resolve_compute_type(_resolved_device)

    started = time.monotonic()
    log(
        logger,
        "info",
        "loading_whisper_model",
        model_size=config.WHISPER_MODEL_SIZE,
        device=_resolved_device,
        compute_type=_resolved_compute_type,
    )
    _model = WhisperModel(
        config.WHISPER_MODEL_SIZE,
        device=_resolved_device,
        compute_type=_resolved_compute_type,
        download_root=config.MODEL_CACHE_DIR,
    )
    log(logger, "info", "whisper_model_loaded", load_ms=round((time.monotonic() - started) * 1000))
    return _model


def is_ready():
    return _model is not None


def transcribe_file(file_path):
    """Runs transcription on a local file path. Forces WHISPER_LANGUAGE so
    occasional English words in otherwise-Urdu speech are transcribed inline
    rather than triggering language auto-switching mid-utterance."""
    model = load_model()

    segments, info = model.transcribe(
        file_path,
        language=config.WHISPER_LANGUAGE,
        beam_size=config.WHISPER_BEAM_SIZE,
        vad_filter=config.WHISPER_VAD_FILTER,
    )

    text_parts = [segment.text.strip() for segment in segments if segment.text and segment.text.strip()]

    return {
        "text": " ".join(text_parts).strip(),
        "language": getattr(info, "language", None) or config.WHISPER_LANGUAGE,
        "duration_seconds": getattr(info, "duration", None),
    }
