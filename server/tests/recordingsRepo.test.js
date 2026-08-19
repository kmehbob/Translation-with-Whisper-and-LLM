const recordingsRepo = require("../lib/recordingsRepo");
const db = require("../lib/db");

function makeRecording(overrides = {}) {
    return recordingsRepo.create({
        sourceType: "recorded",
        originalFilename: "audio.webm",
        storedFilename: "abc.mp3",
        mimeType: "audio/mpeg",
        fileSizeBytes: 1000,
        sourceLanguage: "ur",
        ...overrides,
    });
}

test("create returns a full row with sensible defaults", () => {
    const rec = makeRecording();
    expect(rec.id).toBeTruthy();
    expect(rec.status).toBe("pending");
    expect(rec.source_type).toBe("recorded");
    expect(rec.created_at).toBe(rec.updated_at);
});

test("update only touches allowed columns and bumps updated_at", async () => {
    const rec = makeRecording();
    await new Promise((r) => setTimeout(r, 5));
    const updated = recordingsRepo.update(rec.id, {
        status: "completed",
        transcription_text: "hello",
        not_a_real_column: "ignored",
    });
    expect(updated.status).toBe("completed");
    expect(updated.transcription_text).toBe("hello");
    expect(updated.updated_at).not.toBe(rec.updated_at);
});

test("getById returns null for an unknown id", () => {
    expect(recordingsRepo.getById("does-not-exist")).toBeNull();
});

test("remove deletes the row and reports success/failure correctly", () => {
    const rec = makeRecording();
    expect(recordingsRepo.remove(rec.id)).toBe(true);
    expect(recordingsRepo.getById(rec.id)).toBeNull();
    expect(recordingsRepo.remove(rec.id)).toBe(false);
});

describe("list", () => {
    test("filters by source type and status", () => {
        makeRecording({ sourceType: "recorded" });
        const uploaded = makeRecording({ sourceType: "uploaded" });
        recordingsRepo.update(uploaded.id, { status: "completed" });

        const result = recordingsRepo.list({ sourceType: "uploaded", status: "completed" });
        expect(result.items.every((r) => r.source_type === "uploaded" && r.status === "completed")).toBe(true);
        expect(result.items.some((r) => r.id === uploaded.id)).toBe(true);
    });

    test("q searches filename and transcription/translation text", () => {
        const match = makeRecording({ originalFilename: "very-unique-name-xyz.webm" });
        recordingsRepo.update(match.id, { transcription_text: "unrelated content" });
        makeRecording({ originalFilename: "something-else.webm" });

        const result = recordingsRepo.list({ q: "unique-name-xyz" });
        expect(result.items.map((r) => r.id)).toContain(match.id);
    });

    test("paginates and clamps page size", () => {
        for (let i = 0; i < 5; i++) makeRecording();
        const result = recordingsRepo.list({ page: 1, pageSize: 2 });
        expect(result.items.length).toBe(2);
        expect(result.pageSize).toBe(2);
        expect(result.total).toBeGreaterThanOrEqual(5);

        const clamped = recordingsRepo.list({ pageSize: 99999 });
        expect(clamped.pageSize).toBe(100);
    });

    test("ignores unknown sort columns and status/sourceType values rather than erroring", () => {
        makeRecording();
        expect(() =>
            recordingsRepo.list({ sort: "'; DROP TABLE recordings; --", status: "not-a-real-status", sourceType: "nope" })
        ).not.toThrow();
    });
});

test("pruneExpired removes only rows older than the retention window and returns them", async () => {
    const rec = makeRecording();
    // Simulate an old row by writing created_at directly via update-adjacent SQL is not exposed,
    // so instead verify the zero/negative retention no-op behavior, and that a very large
    // retention window prunes nothing (the row is "now", not older than N days).
    expect(recordingsRepo.pruneExpired(0)).toEqual([]);
    expect(recordingsRepo.pruneExpired(365)).toEqual([]);
    expect(recordingsRepo.getById(rec.id)).not.toBeNull();
});

test("pruneExpired actually deletes rows older than the retention window, and only those", () => {
    const old = makeRecording();
    const recent = makeRecording();

    const oldIso = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("UPDATE recordings SET created_at = ? WHERE id = ?").run(oldIso, old.id);

    const expired = recordingsRepo.pruneExpired(5);

    expect(expired.map((r) => r.id)).toEqual([old.id]);
    expect(recordingsRepo.getById(old.id)).toBeNull();
    expect(recordingsRepo.getById(recent.id)).not.toBeNull();
});
