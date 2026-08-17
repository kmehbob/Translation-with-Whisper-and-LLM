"""Integration test against the REAL faster-whisper model on a real GPU.
Skipped unless RUN_GPU_INTEGRATION_TESTS=1. Requires requirements.txt (the
full ML deps, not requirements-dev.txt) to be installed.
"""
import os

import pytest

RUN_INTEGRATION = os.environ.get("RUN_GPU_INTEGRATION_TESTS") == "1"


@pytest.mark.skipif(not RUN_INTEGRATION, reason="set RUN_GPU_INTEGRATION_TESTS=1 to run against the real model")
def test_real_model_loads_and_transcribes(tmp_path):
    import model_backend

    model_backend.load_model()
    assert model_backend.is_ready()

    sample_path = os.environ.get("SAMPLE_URDU_AUDIO_PATH")
    if not sample_path or not os.path.exists(sample_path):
        pytest.fail("Set SAMPLE_URDU_AUDIO_PATH to a real Urdu .wav file to run this test")

    result = model_backend.transcribe_file(sample_path)
    assert result["language"] == "ur"
    assert len(result["text"]) > 0
