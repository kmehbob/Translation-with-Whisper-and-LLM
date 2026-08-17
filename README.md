# Translation-with-Whisper-and-LLM

Private, GPU-accelerated Urdu speech transcription and Urdu-to-English translation. Record or type Urdu, transcribe it locally with [faster-whisper](https://github.com/SYSTRAN/faster-whisper), edit the text, then translate it to fluent English with a self-hosted LLM (Qwen2.5-Instruct by default) — no OpenAI, Anthropic, Google, or other third-party inference API involved in either step.

All application code lives in [`server/`](server/).

## Quick start (local, CPU or small GPU)

```bash
cd server
npm install
cp .env.example .env    # set INTERNAL_SERVICE_TOKEN

# gateway
npm start                # http://localhost:3000

# transcription service (separate shell)
cd ai-services/transcription
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001

# translation service (separate shell)
cd ai-services/translation
pip install torch==2.5.1 --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8002
```

## Production (Docker Compose + GPU)

```bash
cd server
cp .env.example .env
docker compose build
docker compose up -d
curl http://localhost:3000/api/v1/ready
```

Requires the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) on the GPU host.

## Documentation

- [`server/docs/AI_FEATURE.md`](server/docs/AI_FEATURE.md) — architecture, model selection rationale, VRAM tiers, env var reference, privacy/data lifecycle, rollback, monitoring, QA checklist.
- [`server/docs/urdu-voice-pipeline.html`](server/docs/urdu-voice-pipeline.html) — the same material as a standalone, diagram-illustrated visual reference (open directly in a browser).

## Testing

```bash
cd server
npm test                                    # Node unit tests
cd ai-services/transcription && pytest      # Python unit tests (heavy ML deps not required)
cd ai-services/translation && pytest
```

Gated integration tests that exercise the real models require `RUN_GPU_INTEGRATION_TESTS=1` and a running GPU deployment — see `npm run test:integration` and the docs above.
