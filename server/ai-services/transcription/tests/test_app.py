import pytest
from fastapi.testclient import TestClient

import app as app_module
import config
import model_backend


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr(model_backend, "load_model", lambda: None)
    monkeypatch.setattr(model_backend, "is_ready", lambda: True)
    monkeypatch.setattr(
        model_backend,
        "transcribe_file",
        lambda path, language_override=None: {"text": "یہ ایک ٹیسٹ ہے", "language": "ur", "duration_seconds": 1.2},
    )
    monkeypatch.setattr(config, "INTERNAL_SERVICE_TOKEN", "")
    with TestClient(app_module.app) as c:
        yield c


def auth_headers():
    return {"Authorization": f"Bearer {config.INTERNAL_SERVICE_TOKEN}"} if config.INTERNAL_SERVICE_TOKEN else {}


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_ready_when_model_loaded(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"


def test_ready_when_model_not_loaded(client, monkeypatch):
    monkeypatch.setattr(model_backend, "is_ready", lambda: False)
    response = client.get("/ready")
    assert response.status_code == 503


def test_transcribe_success(client):
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["text"] == "یہ ایک ٹیسٹ ہے"
    assert body["language"] == "ur"


def test_transcribe_rejects_unauthorized(client, monkeypatch):
    monkeypatch.setattr(config, "INTERNAL_SERVICE_TOKEN", "secret-token")
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
        headers={"Authorization": "Bearer wrong-token"},
    )
    assert response.status_code == 401


def test_transcribe_accepts_correct_token(client, monkeypatch):
    monkeypatch.setattr(config, "INTERNAL_SERVICE_TOKEN", "secret-token")
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
        headers={"Authorization": "Bearer secret-token"},
    )
    assert response.status_code == 200


def test_transcribe_rejects_unsupported_format(client):
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.exe", b"not-audio", "application/x-msdownload")},
    )
    assert response.status_code == 400


def test_transcribe_rejects_empty_file(client):
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"", "audio/webm")},
    )
    assert response.status_code == 400


def test_transcribe_rejects_oversized_audio(client, monkeypatch):
    monkeypatch.setattr(config, "MAX_AUDIO_UPLOAD_MB", 0)  # anything > 0 bytes now exceeds the limit
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"some-bytes-that-are-too-big", "audio/webm")},
    )
    assert response.status_code == 413


def test_transcribe_busy_returns_503(client, monkeypatch):
    async def never_acquire():
        return False

    monkeypatch.setattr(app_module.guard, "try_acquire", never_acquire)
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
    )
    assert response.status_code == 503


def test_transcribe_passes_through_a_language_override(client, monkeypatch):
    received = {}

    def spying_transcribe(path, language_override=None):
        received["language_override"] = language_override
        return {"text": "hello", "language": "en", "duration_seconds": 1.0}

    monkeypatch.setattr(model_backend, "transcribe_file", spying_transcribe)
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
        data={"language": "en"},
    )
    assert response.status_code == 200
    assert received["language_override"] == "en"
    assert response.json()["language"] == "en"


def test_transcribe_omits_language_override_when_not_provided(client, monkeypatch):
    received = {}

    def spying_transcribe(path, language_override=None):
        received["language_override"] = language_override
        return {"text": "ok", "language": "ur", "duration_seconds": 1.0}

    monkeypatch.setattr(model_backend, "transcribe_file", spying_transcribe)
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
    )
    assert response.status_code == 200
    assert received["language_override"] is None


def test_transcribe_deletes_temp_file(client, monkeypatch):
    created_paths = []

    def spying_transcribe(path, language_override=None):
        created_paths.append(path)
        return {"text": "ok", "language": "ur", "duration_seconds": 0.5}

    monkeypatch.setattr(model_backend, "transcribe_file", spying_transcribe)

    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
    )
    assert response.status_code == 200
    assert len(created_paths) == 1

    import os
    assert not os.path.exists(created_paths[0])


def test_transcribe_returns_500_on_backend_failure(client, monkeypatch):
    def failing_transcribe(path, language_override=None):
        raise RuntimeError("boom")

    monkeypatch.setattr(model_backend, "transcribe_file", failing_transcribe)
    response = client.post(
        "/v1/transcribe",
        files={"file": ("audio.webm", b"fake-audio-bytes", "audio/webm")},
    )
    assert response.status_code == 500
    assert "boom" not in response.text
