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


def _float(value, default):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


SERVICE_PORT = _int(os.environ.get("SERVICE_PORT"), 8002)
INTERNAL_SERVICE_TOKEN = os.environ.get("INTERNAL_SERVICE_TOKEN", "")

# Model / hardware. See docs/AI_FEATURE.md for the VRAM-tiered alternatives.
TRANSLATION_MODEL_NAME = os.environ.get("TRANSLATION_MODEL_NAME", "Qwen/Qwen2.5-7B-Instruct")
TRANSLATION_DEVICE = os.environ.get("TRANSLATION_DEVICE", "auto")  # auto | cuda | cpu
# fp32 | fp16 | bf16 | int8 | int4  ("auto" -> int4 on cuda, fp32 on cpu)
TRANSLATION_PRECISION = os.environ.get("TRANSLATION_PRECISION", "auto")

MAX_CONTEXT_TOKENS = _int(os.environ.get("MAX_CONTEXT_TOKENS"), 4096)
MAX_NEW_TOKENS = _int(os.environ.get("MAX_NEW_TOKENS"), 1024)
MAX_INPUT_TOKENS_PER_CHUNK = _int(os.environ.get("MAX_INPUT_TOKENS_PER_CHUNK"), 700)
MAX_CONCURRENT_TRANSLATIONS = _int(os.environ.get("MAX_CONCURRENT_TRANSLATIONS"), 2)

# Deterministic / low-temperature generation, appropriate for translation.
TEMPERATURE = _float(os.environ.get("TEMPERATURE"), 0.1)
TOP_P = _float(os.environ.get("TOP_P"), 0.9)
DO_SAMPLE = _bool(os.environ.get("DO_SAMPLE"), False)

# Defense in depth: the gateway already enforces this, the service enforces
# it again so it is never reachable directly without the same protection.
MAX_TRANSLATE_TEXT_LENGTH = _int(os.environ.get("MAX_TRANSLATE_TEXT_LENGTH"), 20000)

MODEL_CACHE_DIR = os.environ.get("MODEL_CACHE_DIR", "/models/translation")

WARMUP_ON_STARTUP = _bool(os.environ.get("WARMUP_ON_STARTUP"), True)
