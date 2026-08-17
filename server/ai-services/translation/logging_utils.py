import json
import logging
import sys
import time

# Structured JSON logging. Callers pass only operational metadata (token
# counts, durations, status codes) - never raw Urdu/English text - so there
# is nothing sensitive to redact by construction.


class JsonFormatter(logging.Formatter):
    def format(self, record):
        payload = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created)),
            "level": record.levelname.lower(),
            "event": record.getMessage(),
        }
        if hasattr(record, "meta"):
            payload.update(record.meta)
        return json.dumps(payload)


def get_logger(name):
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        logger.propagate = False
    return logger


def log(logger, level, event, **meta):
    getattr(logger, level)(event, extra={"meta": meta})
