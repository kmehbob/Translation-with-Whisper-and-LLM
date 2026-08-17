"""Structure-aware, token-budget-bounded splitting for long translation
input. Paragraphs (and the blank-line separators between them) are never
split unless a single paragraph alone exceeds the per-chunk token budget, in
which case it falls back to sentence-level splitting - and, if a single
"sentence" is itself still over budget (e.g. a long comma-separated list or
run-on text with no sentence punctuation), to word-level splitting. Every
unit ever handed to the model is guaranteed to be within max_tokens_per_chunk.

Separators (paragraph breaks, inter-sentence whitespace, inter-word
whitespace) are always carried through as their own untranslated pieces, so
reassembly reproduces the original text's exact whitespace - it never
depends on the model reproducing formatting, and never hardcodes a
substitute separator like a single space.

`count_tokens` is injected as a plain callable so this module has no
dependency on any ML library and can be unit-tested with a trivial stand-in
(e.g. word count) instead of a real tokenizer.
"""
import re

PARAGRAPH_SPLIT_RE = re.compile(r"(\n\s*\n+)")
SENTENCE_SPLIT_RE = re.compile(r"((?<=[۔!؟.?])\s+)")
WORD_SPLIT_RE = re.compile(r"(\s+)")


def _split_with_separators(text, pattern):
    """Splits `text` with a capturing-group regex so the separators
    themselves are preserved in the output, tagged as such."""
    parts = pattern.split(text)
    pieces = []
    for i, part in enumerate(parts):
        if part == "":
            continue
        pieces.append({"is_sep": i % 2 == 1, "text": part})
    return pieces


def _split_oversized_unit(text, count_tokens, max_tokens_per_chunk):
    """Splits a unit of text that exceeds the token budget on its own: first
    by sentence punctuation, then - only for any resulting piece that is
    STILL over budget - by whitespace, so no piece handed to the model can
    ever exceed max_tokens_per_chunk regardless of how it's punctuated."""
    pieces = _split_with_separators(text, SENTENCE_SPLIT_RE)
    if len(pieces) == 1 and not pieces[0]["is_sep"]:
        # No sentence-ending punctuation at all - nothing to gain from the
        # sentence pass, go straight to word-level splitting.
        return _split_with_separators(text, WORD_SPLIT_RE)

    result = []
    for piece in pieces:
        if piece["is_sep"] or count_tokens(piece["text"]) <= max_tokens_per_chunk:
            result.append(piece)
        else:
            result.extend(_split_with_separators(piece["text"], WORD_SPLIT_RE))
    return result


def build_batches(text, count_tokens, max_tokens_per_chunk):
    """Returns an ordered list of batches:
      {"kind": "verbatim", "text": str}                    - copy through untouched
      {"kind": "model", "text": str}                        - send to the model as one unit
      {"kind": "sentence_join", "pieces": [{"is_sep", "text"}, ...]}
          - translate only the non-separator pieces; separators are copied
            through untouched (never translated, never replaced)
    Concatenating the raw *inputs* of each batch in order reproduces `text` exactly.
    """
    parts = PARAGRAPH_SPLIT_RE.split(text)
    segments = []
    for i, part in enumerate(parts):
        if part == "":
            continue
        segments.append({"is_sep": i % 2 == 1, "text": part})

    batches = []
    current = []
    current_tokens = 0

    def flush():
        nonlocal current, current_tokens
        if current:
            joined = "".join(current)
            if joined.strip() == "":
                batches.append({"kind": "verbatim", "text": joined})
            else:
                batches.append({"kind": "model", "text": joined})
        current = []
        current_tokens = 0

    for seg in segments:
        if seg["is_sep"]:
            current.append(seg["text"])
            continue

        tokens = count_tokens(seg["text"])
        if tokens <= max_tokens_per_chunk:
            if current_tokens + tokens > max_tokens_per_chunk and current:
                flush()
            current.append(seg["text"])
            current_tokens += tokens
            continue

        # A single paragraph exceeds the budget on its own.
        flush()
        pieces = _split_oversized_unit(seg["text"], count_tokens, max_tokens_per_chunk)
        batches.append({"kind": "sentence_join", "pieces": pieces})

    flush()
    return batches


def reassemble(translated_batches):
    return "".join(translated_batches)
