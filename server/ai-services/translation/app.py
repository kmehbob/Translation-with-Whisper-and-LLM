import asyncio
import time
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

import config
import model_backend
from chunker import build_batches, reassemble
from concurrency import BoundedConcurrency
from logging_utils import get_logger, log

logger = get_logger("translation.app")


def _check_context_budget():
    # Rough sanity check, not an exact token count: the prompt template and
    # delimiters add a small, fairly constant overhead beyond the chunk of
    # user text itself, so leave some headroom rather than requiring an
    # exact accounting.
    prompt_overhead_estimate = 200
    required = config.MAX_INPUT_TOKENS_PER_CHUNK + config.MAX_NEW_TOKENS + prompt_overhead_estimate
    if required > config.MAX_CONTEXT_TOKENS:
        log(
            logger,
            "warning",
            "context_budget_misconfigured",
            max_input_tokens_per_chunk=config.MAX_INPUT_TOKENS_PER_CHUNK,
            max_new_tokens=config.MAX_NEW_TOKENS,
            max_context_tokens=config.MAX_CONTEXT_TOKENS,
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not config.INTERNAL_SERVICE_TOKEN:
        log(logger, "warning", "internal_service_token_not_set")
    _check_context_budget()
    try:
        model_backend.load_model()
    except Exception as exc:  # pragma: no cover - exercised only with real deps installed
        log(logger, "error", "model_load_failed", error_type=type(exc).__name__)
    yield


app = FastAPI(title="Urdu-to-English Translation Service", version="1.0.0", lifespan=lifespan)

guard = BoundedConcurrency(config.MAX_CONCURRENT_TRANSLATIONS)


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=0)


def verify_token(authorization: str = Header(default="")):
    if not config.INTERNAL_SERVICE_TOKEN:
        return
    if authorization != f"Bearer {config.INTERNAL_SERVICE_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ready")
def ready():
    if not model_backend.is_ready():
        return JSONResponse(status_code=503, content={"status": "not_ready"})
    return {"status": "ready"}


@app.post("/v1/translate")
async def translate(request: Request, payload: TranslateRequest, _: None = Depends(verify_token)):
    if not model_backend.is_ready():
        raise HTTPException(status_code=503, detail="Model is not loaded yet")

    text = payload.text
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty")
    if len(text) > config.MAX_TRANSLATE_TEXT_LENGTH:
        raise HTTPException(
            status_code=413,
            detail=f"Text exceeds the maximum allowed length of {config.MAX_TRANSLATE_TEXT_LENGTH} characters",
        )

    acquired = await guard.try_acquire()
    if not acquired:
        raise HTTPException(status_code=503, detail="Translation service is busy, please try again shortly")

    try:
        started = time.monotonic()
        translation = await run_translation(request, text)
        log(
            logger,
            "info",
            "translation_completed",
            duration_ms=round((time.monotonic() - started) * 1000),
            input_length=len(text),
        )
        return JSONResponse({"translation": translation})
    except HTTPException:
        raise
    except Exception as exc:
        log(logger, "error", "translation_failed", error_type=type(exc).__name__)
        raise HTTPException(status_code=500, detail="Failed to translate text")
    finally:
        await guard.release()


async def run_translation(request: Request, text: str):
    batches = build_batches(text, model_backend.count_tokens, config.MAX_INPUT_TOKENS_PER_CHUNK)

    translated = []
    for batch in batches:
        if await request.is_disconnected():
            raise HTTPException(status_code=499, detail="Client disconnected")

        if batch["kind"] == "verbatim":
            translated.append(batch["text"])
        elif batch["kind"] == "model":
            translated.append(await asyncio.to_thread(model_backend.translate_one, batch["text"]))
        elif batch["kind"] == "sentence_join":
            translated_pieces = []
            for piece in batch["pieces"]:
                if piece["is_sep"]:
                    translated_pieces.append(piece["text"])
                else:
                    translated_pieces.append(await asyncio.to_thread(model_backend.translate_one, piece["text"]))
            translated.append("".join(translated_pieces))
        else:  # pragma: no cover - defensive, chunker only emits the kinds above
            raise RuntimeError(f"Unknown batch kind: {batch['kind']}")

    return reassemble(translated)
