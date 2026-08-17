FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models/translation

RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the CUDA-matched torch build first (adjust the index URL to match
# the driver/CUDA version on the target GPU server), then the rest.
RUN pip3 install --no-cache-dir torch==2.5.1 --index-url https://download.pytorch.org/whl/cu121

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home --uid 10001 appuser \
    && mkdir -p /models/translation \
    && chown -R appuser:appuser /app /models/translation
USER appuser

EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=5s --start-period=300s --retries=3 \
    CMD python3 -c "import os,urllib.request; urllib.request.urlopen(f'http://localhost:{os.environ.get(\"SERVICE_PORT\",\"8002\")}/health', timeout=3)" || exit 1

ENV SERVICE_PORT=8002
# `exec` replaces the shell with uvicorn (PID 1) so SIGTERM reaches it
# directly for graceful shutdown, while still expanding $SERVICE_PORT.
CMD ["sh", "-c", "exec uvicorn app:app --host 0.0.0.0 --port ${SERVICE_PORT}"]
