import hmac
import os
import tempfile
import time
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

import config
import model_backend
from concurrency import BoundedConcurrency
from logging_utils import get_logger, log

logger = get_logger("transcription.app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not config.INTERNAL_SERVICE_TOKEN:
        # No token configured: service is only safe to run this way on a
        # fully isolated internal network (see docs/AI_FEATURE.md).
        log(logger, "warning", "internal_service_token_not_set")
    try:
        model_backend.load_model()
    except Exception as exc:  # pragma: no cover - exercised only with real deps installed
        log(logger, "error", "model_load_failed", error_type=type(exc).__name__)
    yield


app = FastAPI(title="Urdu Transcription Service", version="1.0.0", lifespan=lifespan)

guard = BoundedConcurrency(config.MAX_CONCURRENT_TRANSCRIPTIONS)


def verify_token(authorization: str = Header(default="")):
    if not config.INTERNAL_SERVICE_TOKEN:
        return
    # Constant-time comparison - a plain != leaks timing information about
    # how many leading characters of the secret the caller guessed correctly.
    if not hmac.compare_digest(authorization, f"Bearer {config.INTERNAL_SERVICE_TOKEN}"):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ready")
def ready():
    if not model_backend.is_ready():
        return JSONResponse(status_code=503, content={"status": "not_ready"})
    return {"status": "ready"}


@app.post("/v1/transcribe")
async def transcribe(
    request: Request,
    file: UploadFile = File(...),
    language: str = Form(default=""),
    _: None = Depends(verify_token),
):
    if not model_backend.is_ready():
        raise HTTPException(status_code=503, detail="Model is not loaded yet")

    acquired = await guard.try_acquire()
    if not acquired:
        raise HTTPException(status_code=503, detail="Transcription service is busy, please try again shortly")

    tmp_path = None
    try:
        content_type = file.content_type or "application/octet-stream"
        if content_type not in config.ALLOWED_CONTENT_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported audio format: {content_type}")

        if await request.is_disconnected():
            raise HTTPException(status_code=499, detail="Client disconnected")

        ext = config.EXTENSION_BY_CONTENT_TYPE.get(content_type, "bin")
        max_bytes = config.MAX_AUDIO_UPLOAD_MB * 1024 * 1024

        fd, tmp_path = tempfile.mkstemp(suffix=f".{ext}", prefix="urdu-audio-")
        total_bytes = 0
        with os.fdopen(fd, "wb") as tmp_file:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    raise HTTPException(status_code=413, detail="Audio file exceeds the maximum allowed size")
                tmp_file.write(chunk)

        if total_bytes == 0:
            raise HTTPException(status_code=400, detail="Uploaded audio file is empty")

        started = time.monotonic()
        result = await run_transcription(tmp_path, language.strip() or None)
        log(
            logger,
            "info",
            "transcription_completed",
            duration_ms=round((time.monotonic() - started) * 1000),
            audio_bytes=total_bytes,
        )
        return JSONResponse(result)
    except HTTPException:
        raise
    except Exception as exc:
        log(logger, "error", "transcription_failed", error_type=type(exc).__name__)
        raise HTTPException(status_code=500, detail="Failed to process audio")
    finally:
        await guard.release()
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError as exc:
                log(logger, "warning", "temp_file_cleanup_failed", error_type=type(exc).__name__)


async def run_transcription(tmp_path, language_override):
    import asyncio

    return await asyncio.to_thread(model_backend.transcribe_file, tmp_path, language_override)
