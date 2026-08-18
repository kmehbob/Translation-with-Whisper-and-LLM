jest.mock("axios");
const axios = require("axios");
axios.create.mockReturnValue({ request: jest.fn(), get: jest.fn() });

const request = require("supertest");
const app = require("../serve.js");
const recordingsRepo = require("../lib/recordingsRepo");
const audioStorage = require("../lib/audioStorage");

function seedRecording(overrides = {}) {
    const rec = recordingsRepo.create({
        sourceType: "uploaded",
        originalFilename: "call.wav",
        storedFilename: `${overrides.id || "seed"}.mp3`,
        mimeType: "audio/mpeg",
        fileSizeBytes: 4096,
        sourceLanguage: "ur",
        ...overrides,
    });
    return recordingsRepo.update(rec.id, {
        status: "completed",
        target_language: "en",
        transcription_text: "یہ ایک ٹیسٹ ہے",
        translation_text: "This is a test",
        ...overrides,
    });
}

describe("GET /api/v1/recordings", () => {
    test("lists recordings and never leaks the internal stored filename", async () => {
        const rec = seedRecording();
        const res = await request(app).get("/api/v1/recordings");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        const found = res.body.items.find((r) => r.id === rec.id);
        expect(found).toBeDefined();
        expect(found.storedFilename).toBeUndefined();
        expect(found.originalFilename).toBe("call.wav");
        expect(found.sourceType).toBe("uploaded");
    });

    test("supports filtering by q", async () => {
        seedRecording({ originalFilename: "totally-unique-search-target.wav" });
        const res = await request(app).get("/api/v1/recordings").query({ q: "unique-search-target" });
        expect(res.status).toBe(200);
        expect(res.body.items.every((r) => r.originalFilename.includes("unique-search-target"))).toBe(true);
    });
});

describe("GET /api/v1/recordings/:id", () => {
    test("returns 404 for an unknown id", async () => {
        const res = await request(app).get("/api/v1/recordings/does-not-exist");
        expect(res.status).toBe(404);
    });

    test("returns the full public shape for a known id", async () => {
        const rec = seedRecording();
        const res = await request(app).get(`/api/v1/recordings/${rec.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(rec.id);
        expect(res.body.transcriptionText).toBe("یہ ایک ٹیسٹ ہے");
    });
});

describe("GET /api/v1/recordings/:id/export", () => {
    test("rejects an unsupported format", async () => {
        const rec = seedRecording();
        const res = await request(app).get(`/api/v1/recordings/${rec.id}/export`).query({ format: "exe" });
        expect(res.status).toBe(400);
    });

    test("404s for an unknown recording", async () => {
        const res = await request(app).get("/api/v1/recordings/nope/export").query({ format: "txt" });
        expect(res.status).toBe(404);
    });

    test("409s when there is nothing to export yet", async () => {
        const rec = recordingsRepo.create({
            sourceType: "recorded",
            originalFilename: null,
            storedFilename: "empty.mp3",
            mimeType: "audio/mpeg",
            fileSizeBytes: 10,
            sourceLanguage: "ur",
        });
        const res = await request(app).get(`/api/v1/recordings/${rec.id}/export`).query({ format: "txt" });
        expect(res.status).toBe(409);
    });

    test("exports a completed recording as txt", async () => {
        const rec = seedRecording();
        const res = await request(app).get(`/api/v1/recordings/${rec.id}/export`).query({ format: "txt" });
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/text\/plain/);
        expect(res.text).toContain("This is a test");
    });
});

describe("GET /api/v1/recordings/:id/audio", () => {
    test("404s when the recording exists but the audio file is gone", async () => {
        const rec = seedRecording();
        jest.spyOn(audioStorage, "storedFilePath").mockReturnValue("/nonexistent/path.mp3");
        const res = await request(app).get(`/api/v1/recordings/${rec.id}/audio`);
        expect(res.status).toBe(404);
        audioStorage.storedFilePath.mockRestore();
    });
});

describe("DELETE /api/v1/recordings/:id", () => {
    test("deletes a recording and its stored file, then 404s on re-fetch", async () => {
        const rec = seedRecording();
        const deleteSpy = jest.spyOn(audioStorage, "deleteStoredFile").mockImplementation(() => {});

        const res = await request(app).delete(`/api/v1/recordings/${rec.id}`);
        expect(res.status).toBe(204);
        expect(deleteSpy).toHaveBeenCalledWith(rec.stored_filename);

        const followUp = await request(app).get(`/api/v1/recordings/${rec.id}`);
        expect(followUp.status).toBe(404);
        deleteSpy.mockRestore();
    });

    test("404s when deleting an unknown id", async () => {
        const res = await request(app).delete("/api/v1/recordings/does-not-exist");
        expect(res.status).toBe(404);
    });
});
