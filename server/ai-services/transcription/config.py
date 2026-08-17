import os


def _bool(value, default):
    if value is None or value == "":
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


def _int(value, default):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


SERVICE_PORT = _int(os.environ.get("SERVICE_PORT"), 8001)
INTERNAL_SERVICE_TOKEN = os.environ.get("INTERNAL_SERVICE_TOKEN", "")

# "auto" resolves to cuda if available at startup, else cpu.
WHISPER_MODEL_SIZE = os.environ.get("WHISPER_MODEL_SIZE", "medium")
WHISPER_DEVICE = os.environ.get("WHISPER_DEVICE", "auto")
WHISPER_COMPUTE_TYPE = os.environ.get("WHISPER_COMPUTE_TYPE", "auto")
WHISPER_BEAM_SIZE = _int(os.environ.get("WHISPER_BEAM_SIZE"), 5)
WHISPER_LANGUAGE = os.environ.get("WHISPER_LANGUAGE", "ur")
WHISPER_VAD_FILTER = _bool(os.environ.get("WHISPER_VAD_FILTER"), True)

MODEL_CACHE_DIR = os.environ.get("MODEL_CACHE_DIR", "/models/whisper")

MAX_AUDIO_UPLOAD_MB = _int(os.environ.get("MAX_AUDIO_UPLOAD_MB"), 100)
MAX_CONCURRENT_TRANSCRIPTIONS = _int(os.environ.get("MAX_CONCURRENT_TRANSCRIPTIONS"), 2)

ALLOWED_CONTENT_TYPES = {
    "audio/webm",
    "audio/mp3",
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    "audio/x-m4a",
    "application/octet-stream",  # some mobile browsers omit/garble the type
}

EXTENSION_BY_CONTENT_TYPE = {
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
    "audio/webm": "webm",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
}
