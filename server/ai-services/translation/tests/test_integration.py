"""Integration test against the REAL Qwen2.5-Instruct model on a real GPU.
Skipped unless RUN_GPU_INTEGRATION_TESTS=1. Requires requirements.txt (the
full ML deps, not requirements-dev.txt) to be installed.
"""
import os

import pytest

RUN_INTEGRATION = os.environ.get("RUN_GPU_INTEGRATION_TESTS") == "1"


@pytest.mark.skipif(not RUN_INTEGRATION, reason="set RUN_GPU_INTEGRATION_TESTS=1 to run against the real model")
def test_real_model_loads_and_translates():
    import model_backend

    model_backend.load_model()
    assert model_backend.is_ready()

    translation = model_backend.translate_one("میرا نام علی ہے۔")
    assert "ali" in translation.lower()
