# DevOps Requirements

Configuration/deployment checklist for this project: an Express gateway
serving the browser UI, plus two self-hosted GPU AI services (Urdu
transcription via faster-whisper, Urdu→English translation via Qwen2.5).
No third-party AI API is called at runtime (see `docs/AI_FEATURE.md` §0 for
the full rationale).

```
Browser  --HTTPS-->  [reverse-proxy: Caddy, optional]  --HTTP-->  gateway (Node/Express, :3000)
                                                                     |  mTLS, internal Docker network only
                                                                     |--> transcription service (Python/FastAPI, :8001, GPU)
                                                                     |--> translation service   (Python/FastAPI, :8002, GPU)
```

Only the gateway (or the optional reverse proxy in front of it) is ever
publicly reachable. The AI services are never exposed to the internet.

## 1. Host prerequisites

- **OS**: Linux host recommended for the GPU services (matches the CUDA
  base images below). The Node gateway alone is cross-platform.
- **Docker Engine** + **Docker Compose v2** (`docker compose`, not the
  standalone `docker-compose` v1 binary).
- **NVIDIA GPU driver** installed on the host, compatible with **CUDA 12.4**
  (both AI service Dockerfiles use `nvidia/cuda:12.4.1-runtime-ubuntu22.04`).
- **NVIDIA Container Toolkit** on the host, so `docker compose`'s
  `deploy.resources.reservations.devices` GPU passthrough works
  (https://github.com/NVIDIA/nvidia-container-toolkit).
- **OpenSSL** available on whatever machine runs
  `scripts/generate-internal-certs.sh` (for the internal mTLS certs).
- Outbound internet access **once**, at first `docker compose up`, so the
  transcription/translation containers can download model weights from
  Hugging Face into their cache volumes. Not required for steady-state
  inference (the `internal` Docker network stays reachable from the host
  for this but does not need to be internet-facing beyond this initial
  pull — see the network comment in `docker-compose.yml`).
- If running the gateway natively instead of in Docker: **Node.js 20**
  (matches the `node:20-alpine` base image) and `npm`.
- If running either Python service natively: **Python 3.11+** (Dockerfiles
  use Ubuntu 22.04's `python3`; the committed `.pyc` cache is built against
  3.13, so 3.11–3.13 are all known-good).

## 2. GPU sizing

Pick a GPU based on the VRAM tier needed for both services running
concurrently on the same host (the default Compose setup colocates them):

| Tier | GPU examples | `WHISPER_MODEL_SIZE` | Translation model / precision |
|---|---|---|---|
| Low (6–8GB) | T4 (shared), RTX 3060 | `small` | `Qwen2.5-1.5B-Instruct` or `3B`, `int4` |
| Medium (12–16GB) | T4, L4, RTX 4080 | `medium` (default) | `Qwen2.5-7B-Instruct` (default), `int4` |
| High (24GB+) | A100, RTX 4090 | `large-v3` | `Qwen2.5-14B`/`32B-Instruct`, `int8`/`bf16` or AWQ/GPTQ |

Full rationale and benchmarking targets: `docs/AI_FEATURE.md` §2, §6.
Neither model tier was benchmarked against real production hardware as
part of this build (no GPU server was available) — treat `docs/AI_FEATURE.md`
§6's performance targets as what to validate once real hardware is
provisioned, and retune `MAX_CONCURRENT_TRANSCRIPTIONS`/
`MAX_CONCURRENT_TRANSLATIONS` accordingly.

Example cloud shape (GCP, see `docs/AI_FEATURE.md` §5 for the full walkthrough):
`n1-standard-8` + T4 for the medium tier, `a2-highgpu-1g` (A100) for the high
tier, `g2-standard-*` (L4) as a cost-effective mid-tier option.

## 3. Secrets to generate before first deploy

1. **`INTERNAL_SERVICE_TOKEN`** — shared bearer secret between the gateway
   and both AI services. Generate with `openssl rand -hex 32` and put the
   same value in `.env` (the single `.env` file is loaded by all three
   containers via `env_file:` in `docker-compose.yml`).
2. **Internal mTLS certificates** — run `./scripts/generate-internal-certs.sh`
   once before `docker compose up` (writes a CA + one server cert per AI
   service + one gateway client cert into `./certs`, mounted read-only into
   all three containers). Re-run any time to rotate all certs. Not committed
   to git — treat `./certs` as secret material.
3. **`CLIENT_API_KEY`** — only needed if you set `REQUIRE_CLIENT_API_KEY=true`
   to lock down the public transcribe/translate endpoints for an
   internal/enterprise deployment (off by default; this ships as an
   unauthenticated public tool otherwise).
4. **TLS certificate for the public domain** — handled automatically by the
   bundled Caddy reverse-proxy profile via Let's Encrypt (see §6) if you use
   it; bring your own otherwise (load balancer, existing proxy, etc.).

Never commit a real `.env` or the `./certs` directory — copy
`.env.example` to `.env` and fill in real values locally/in your secrets
manager.

## 4. Environment variables

Every variable is documented inline in `.env.example` (categorized:
gateway, transcription service, translation service, reverse proxy,
tests) — copy it to `.env` and fill in real values. Key ones DevOps should
explicitly decide on, beyond the generated secrets in §3:

| Variable | Default | Notes |
|---|---|---|
| `ENABLE_AI_FEATURES` | `true` | Instant kill-switch — set `false` + restart gateway to 503 the AI routes without touching anything else (fastest rollback lever). |
| `ALLOWED_ORIGINS` | empty (same-origin only) | Comma-separated list for cross-origin API consumers. |
| `INTERNAL_TLS_ENABLED` | `false` | `docker-compose.yml` forces this to `true`; native/bare-metal runs default it off. |
| `RECORDINGS_RETENTION_DAYS` | `0` (keep forever) | Set a real number for a data-retention policy — auto-deletes audio + transcript + translation older than this. |
| `MAX_AUDIO_UPLOAD_MB` / `MAX_TRANSLATE_TEXT_LENGTH` | `100` / `20000` | Input caps enforced at the gateway. |
| `MAX_CONCURRENT_TRANSCRIBE_REQUESTS` / `MAX_CONCURRENT_TRANSLATE_REQUESTS` | `4` / `8` | Gateway-side concurrency guard, defense-in-depth on top of the per-service semaphores (`MAX_CONCURRENT_TRANSCRIPTIONS`/`MAX_CONCURRENT_TRANSLATIONS`, both `2`) — retune all four once real GPU throughput is known. |
| `RATE_LIMIT_*` | window `60000`ms, transcribe `10`, translate `20`, general `60` | Per-client-IP rate limits. |
| `WHISPER_MODEL_SIZE` / `TRANSLATION_MODEL_NAME` / `TRANSLATION_PRECISION` | `medium` / `Qwen/Qwen2.5-7B-Instruct` / `auto` | Set per the GPU tier chosen in §2. |
| `PUBLIC_DOMAIN` | `localhost` | Real DNS-resolving domain needed for Caddy to obtain a trusted Let's Encrypt cert (§6). |
| `LOG_LEVEL` | `info` | Structured JSON logs; never logs raw transcript/translation text or audio (privacy-by-design, see `docs/AI_FEATURE.md`). |

Note on Docker Compose specifically: `SERVICE_PORT` and `MODEL_CACHE_DIR`
are overridden per-service directly in `docker-compose.yml` (not just
`.env`), since both AI containers share the same `.env` file but need
different ports (`8001`/`8002`) and cache paths (`/models/whisper`/
`/models/translation`).

## 5. Networking / firewall

- **Only publish 443** (and 80, for Let's Encrypt's HTTP-01 challenge if
  using the bundled Caddy profile) on any public-facing firewall.
- **Never expose** 3000 (gateway), 8001 (transcription), or 8002
  (translation) to the public internet. In the default Compose file the
  gateway's port mapping is already loopback-bound
  (`127.0.0.1:3000:3000`) for local testing only; the two AI services
  publish no host port at all and are reachable only from other containers
  on the `internal` Docker network.
- Every gateway↔AI-service call is mutual TLS plus a shared bearer token —
  defense in depth even though the network is already private.
- If terminating TLS with your own load balancer instead of the bundled
  Caddy profile, point it at the gateway container's `:3000` and skip
  opening 80/443 on this host entirely.

## 6. Public HTTPS (optional bundled reverse proxy)

`docker compose --profile proxy up -d` starts a Caddy container
(`deploy/Caddyfile`) that automatically obtains and renews a Let's Encrypt
certificate for `PUBLIC_DOMAIN`, as long as:

1. `PUBLIC_DOMAIN` is set in `.env` to a real domain.
2. DNS A/AAAA record for that domain already points at this host's public
   IP.
3. Ports 80 and 443 are reachable from the internet on this host.

Leaving `PUBLIC_DOMAIN=localhost` (the default) makes Caddy serve its own
locally-trusted cert instead — fine for internal/testing use, not for a
real public deployment.

## 7. Persistent storage

Named Docker volumes (already declared in `docker-compose.yml` — put these
on a **persistent disk**, not ephemeral/local-SSD storage, in any cloud
deployment):

| Volume | Contents | Loss impact |
|---|---|---|
| `whisper-model-cache` | Downloaded Whisper model weights | Re-downloaded on next start (slow, not data loss) |
| `translation-model-cache` | Downloaded Qwen2.5 weights | Same |
| `gateway-data` | SQLite recording-history DB (`data/app.db`) | **Real data loss** — all recording history/metadata |
| `gateway-recordings` | Permanent MP3 audio files | **Real data loss** — all stored audio |
| `gateway-uploads` | Transient multipart-upload staging | Safe to lose (in-flight uploads only) |
| `caddy-data` / `caddy-config` | Caddy's own state, incl. obtained TLS certs | Re-obtains cert from Let's Encrypt on loss (rate-limited — avoid unnecessary resets) |

Back up `gateway-data` and `gateway-recordings` per your organization's data
policy — nothing else in this stack holds data that isn't safely
re-derivable.

## 8. Build & deploy

```bash
cp .env.example .env                        # fill in real secrets (§3)
./scripts/generate-internal-certs.sh        # one-time, before first `up`
docker compose up -d --build                # gateway + transcription + translation
docker compose --profile proxy up -d        # add the public HTTPS proxy, if wanted
```

First startup will be slow while the AI containers download model weights
into their cache volumes (one-time; cached on subsequent restarts).

Resource limits already set per container in `docker-compose.yml`:
gateway 1 CPU / 512MB, transcription 8GB memory + 1 GPU, translation 24GB
memory + 1 GPU (adjust the memory ceilings to match the actual model size
chosen in §2 — these defaults assume the medium/default tier).

## 9. Health checks / readiness

- Gateway: `GET /health` (liveness; used by its own Docker `HEALTHCHECK`
  and any external uptime monitor). `GET /api/v1/ready` additionally pings
  both AI services with a short timeout.
- Each AI service: its own `/health` exposed via `healthcheck.sh`,
  Docker-native `HEALTHCHECK` in each service's Dockerfile (note the long
  `start_period`s — 120s transcription, 300s translation — to allow for
  model load time on cold start).
- `WARMUP_ON_STARTUP=true` (default) runs one real inference at translation
  service startup so the *first real user request* isn't the one paying
  cold-start latency.

## 10. Rollback

1. **Fastest, zero-deploy**: set `ENABLE_AI_FEATURES=false`, restart the
   gateway only. All AI routes 503 immediately; static UI and `/health`
   keep working.
2. **Full rollback**: `docker compose stop transcription translation`, or
   redeploy the gateway from an earlier image — it has no required runtime
   dependency on the AI services beyond routing to them.
3. **Disable mTLS** (debugging only, not recommended beyond that): set
   `INTERNAL_TLS_ENABLED=false` / `TLS_ENABLED=false` and switch service
   URLs back to `http://`. Re-enable as soon as possible — this reopens an
   encryption-in-transit gap.

## 11. Testing DevOps should know about

- `npm test` — Node/Jest suite (mocked AI-service calls, real SQLite via a
  temp DB per test file). No GPU needed. Runs in CI.
- `npm run test:integration` — gated real-GPU integration tests, skipped
  unless `RUN_GPU_INTEGRATION_TESTS=1` and the real services are up
  (`SAMPLE_URDU_AUDIO_PATH` must point at a real `.wav` for the
  transcription integration test).
- Python side: `ai-services/{transcription,translation}/tests/` (pytest),
  same gate via `RUN_GPU_INTEGRATION_TESTS`; unit tests stub the model
  backend so they don't need torch/faster-whisper installed to run.

## 12. Monitoring

- Structured JSON logs to stdout (`LOG_LEVEL`), one line per request with a
  request ID; `transcription_completed.duration_ms` /
  `translation_completed.duration_ms` logged per-request for latency
  tracking against the performance targets in `docs/AI_FEATURE.md` §6.
- Never logs raw transcript/translation text or audio content — only
  operational metadata (sizes, durations, status codes).
- Recommended: `nvidia-smi`/DCGM exporter on the GPU host for
  VRAM/utilization, plus whatever log/metrics pipeline your org standardizes
  on ingesting the gateway's stdout JSON lines.

## 13. Security checklist before going live

- [ ] Real `INTERNAL_SERVICE_TOKEN` generated (not the `change-me...`
      placeholder).
- [ ] `./scripts/generate-internal-certs.sh` run, `./certs` kept out of git
      and off any public volume/backup.
- [ ] `INTERNAL_TLS_ENABLED=true` (Compose already forces this).
- [ ] Only 443 (+80 for ACME) open on the public firewall; 3000/8001/8002
      never exposed.
- [ ] `PUBLIC_DOMAIN` set to a real domain with DNS already pointing here,
      if using the bundled Caddy profile.
- [ ] `REQUIRE_CLIENT_API_KEY=true` + a real `CLIENT_API_KEY`, if this is an
      internal/enterprise deployment rather than a public anonymous tool.
- [ ] `RECORDINGS_RETENTION_DAYS` set per your org's data-retention policy
      (default is "keep forever").
- [ ] `gateway-data`/`gateway-recordings` volumes on backed-up, persistent
      (non-ephemeral) storage.
- [ ] Rate limits (`RATE_LIMIT_*`) and concurrency caps
      (`MAX_CONCURRENT_*`) reviewed against expected real traffic/GPU
      throughput, not left at their conservative development defaults.

## Reference

Full architecture rationale, model-selection reasoning, prompt-injection
defenses, compliance notes, and the GCP deployment walkthrough referenced
above all live in `docs/AI_FEATURE.md`.
