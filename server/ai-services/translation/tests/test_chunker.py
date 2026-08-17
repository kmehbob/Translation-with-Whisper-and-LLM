from chunker import build_batches, reassemble


def word_count(text):
    return len(text.split())


def test_single_short_paragraph_is_one_model_batch():
    text = "یہ ایک مختصر جملہ ہے۔"
    batches = build_batches(text, word_count, max_tokens_per_chunk=50)
    assert len(batches) == 1
    assert batches[0]["kind"] == "model"
    assert batches[0]["text"] == text


def test_multiple_paragraphs_within_budget_are_grouped_and_reassemble_exactly():
    text = "پہلا پیراگراف۔\n\nدوسرا پیراگراف۔\n\nتیسرا پیراگراف۔"
    batches = build_batches(text, word_count, max_tokens_per_chunk=50)
    assert len(batches) == 1
    assert batches[0]["kind"] == "model"
    # Reassembling an identity "translation" must reproduce the input exactly.
    identity_translations = [batches[0]["text"]]
    assert reassemble(identity_translations) == text


def test_paragraphs_split_across_multiple_batches_when_budget_is_tight():
    text = "پہلا پیراگراف ہے۔\n\nدوسرا پیراگراف ہے۔"
    # Budget only fits one paragraph's worth of "tokens" at a time.
    batches = build_batches(text, word_count, max_tokens_per_chunk=3)
    assert len(batches) >= 2
    kinds = [b["kind"] for b in batches]
    assert "model" in kinds
    # Concatenating the raw batch inputs must still reproduce the original text.
    raw_concat = "".join(b["text"] for b in batches)
    assert raw_concat == text


def test_oversized_single_paragraph_falls_back_to_sentence_split():
    long_sentence_paragraph = "پہلا جملہ۔ دوسرا جملہ۔ تیسرا جملہ۔ چوتھا جملہ۔"
    # Budget fits one sentence (2 words) but not the whole paragraph (8 words).
    batches = build_batches(long_sentence_paragraph, word_count, max_tokens_per_chunk=2)
    assert len(batches) == 1
    assert batches[0]["kind"] == "sentence_join"
    non_sep = [p for p in batches[0]["pieces"] if not p["is_sep"]]
    assert len(non_sep) == 4
    # Every unit actually respects the token budget - the thing the bug fix guarantees.
    assert all(word_count(p["text"]) <= 2 for p in non_sep)
    # Raw inputs (separators included) must still reassemble to the original text exactly.
    raw_concat = "".join(p["text"] for p in batches[0]["pieces"])
    assert raw_concat == long_sentence_paragraph


def test_sentence_fallback_still_over_budget_falls_back_to_word_split():
    # No sentence-ending punctuation at all, and too long for the budget as
    # one unit - every "sentence" is the whole text, so it must cascade to
    # word-level splitting rather than handing the model an oversized chunk.
    long_list = "ایک دو تین چار پانچ چھ سات آٹھ نو دس"
    batches = build_batches(long_list, word_count, max_tokens_per_chunk=1)
    assert len(batches) == 1
    assert batches[0]["kind"] == "sentence_join"
    non_sep = [p for p in batches[0]["pieces"] if not p["is_sep"]]
    assert len(non_sep) == 10
    assert all(word_count(p["text"]) <= 1 for p in non_sep)
    raw_concat = "".join(p["text"] for p in batches[0]["pieces"])
    assert raw_concat == long_list


def test_sentence_join_reassembly_preserves_irregular_whitespace():
    # Two sentences separated by a double space and a stray newline inside a
    # single oversized paragraph - the separator must be carried through
    # verbatim, not normalized to a single space.
    paragraph = "پہلا جملہ۔  \nدوسرا جملہ۔"
    batches = build_batches(paragraph, word_count, max_tokens_per_chunk=2)
    assert batches[0]["kind"] == "sentence_join"
    raw_concat = "".join(p["text"] for p in batches[0]["pieces"])
    assert raw_concat == paragraph


def test_whitespace_only_input_is_verbatim():
    batches = build_batches("\n\n\n", word_count, max_tokens_per_chunk=50)
    assert len(batches) == 1
    assert batches[0]["kind"] == "verbatim"


def test_empty_input_produces_no_batches():
    assert build_batches("", word_count, max_tokens_per_chunk=50) == []


def test_reassemble_joins_in_order():
    assert reassemble(["Hello", " ", "World"]) == "Hello World"
