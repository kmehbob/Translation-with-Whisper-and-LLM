# CUDA runtime (not "devel") is enough because ctranslate2's pip wheel
# bundles the CUDA libraries it needs.
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home --uid 10001 appuser \
    && mkdir -p /models/whisper \
    && chown -R appuser:appuser /app /models/whisper
USER appuser

ENV MODEL_CACHE_DIR=/models/whisper

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
    CMD python3 -c "import os,urllib.request; urllib.request.urlopen(f'http://localhost:{os.environ.get(\"SERVICE_PORT\",\"8001\")}/health', timeout=3)" || exit 1

ENV SERVICE_PORT=8001
# `exec` replaces the shell with uvicorn (PID 1) so SIGTERM reaches it
# directly for graceful shutdown, while still expanding $SERVICE_PORT.
CMD ["sh", "-c", "exec uvicorn app:app --host 0.0.0.0 --port ${SERVICE_PORT}"]
