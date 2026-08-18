import model_backend
import config


class FakeSegment:
    def __init__(self, text):
        self.text = text


class FakeInfo:
    def __init__(self, language):
        self.language = language


class FakeModel:
    def __init__(self):
        self.last_language_kwarg = "not-called"

    def transcribe(self, file_path, language=None, beam_size=None, vad_filter=None):
        self.last_language_kwarg = language
        return [FakeSegment("hello")], FakeInfo(language or "ur")


def test_no_override_uses_configured_default_language(monkeypatch):
    fake = FakeModel()
    monkeypatch.setattr(model_backend, "load_model", lambda: fake)
    monkeypatch.setattr(config, "WHISPER_LANGUAGE", "ur")

    model_backend.transcribe_file("fake.mp3")
    assert fake.last_language_kwarg == "ur"


def test_auto_override_disables_forced_language(monkeypatch):
    fake = FakeModel()
    monkeypatch.setattr(model_backend, "load_model", lambda: fake)

    model_backend.transcribe_file("fake.mp3", language_override="auto")
    assert fake.last_language_kwarg is None


def test_explicit_override_takes_precedence_over_configured_default(monkeypatch):
    fake = FakeModel()
    monkeypatch.setattr(model_backend, "load_model", lambda: fake)
    monkeypatch.setattr(config, "WHISPER_LANGUAGE", "ur")

    model_backend.transcribe_file("fake.mp3", language_override="fr")
    assert fake.last_language_kwarg == "fr"


def test_result_shape_and_text_joining(monkeypatch):
    class MultiSegModel(FakeModel):
        def transcribe(self, file_path, language=None, beam_size=None, vad_filter=None):
            return [FakeSegment("hello "), FakeSegment(""), FakeSegment("world")], FakeInfo("en")

    monkeypatch.setattr(model_backend, "load_model", lambda: MultiSegModel())
    result = model_backend.transcribe_file("fake.mp3", language_override="en")
    assert result["text"] == "hello world"
    assert result["language"] == "en"
