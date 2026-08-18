const fs = require("fs");
const path = require("path");

jest.mock("axios");
// Real ffmpeg conversion is exercised in tests/audioStorage.test.js; this
// route test mocks it so it only exercises the persist-without-transcribing
// behavior itself.
jest.mock("../lib/audioStorage");

const axios = require("axios");
const request = require("supertest");
const audioStorage = require("../lib/audioStorage");

axios.create.mockReturnValue({ request: jest.fn(), get: jest.fn() });

const app = require("../serve.js");
const recordingsRepo = require("../lib/recordingsRepo");

let counter = 0;

beforeEach(() => {
    counter += 1;
    audioStorage.convertToMp3.mockReset().mockImplementation(async () => ({
        storedFilename: `save-${counter}.mp3`,
        storedPath: path.join(__dirname, "..", "recordings", `save-${counter}.mp3`),
        fileSizeBytes: 2048,
    }));
    audioStorage.probeDurationSeconds.mockReset().mockResolvedValue(4.2);
});

describe("POST /api/v1/recordings (save without transcribing)", () => {
    test("creates a pending, correctly-tagged recording for a recorded clip, without calling any AI service", async () => {
        const res = await request(app)
            .post("/api/v1/recordings")
            .field("source", "recorded")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "recording-2026-01-01_10-00-00.webm", contentType: "audio/webm" });

        expect(res.status).toBe(201);
        expect(res.body.sourceType).toBe("recorded");
        expect(res.body.status).toBe("pending");
        expect(res.body.transcriptionText).toBeNull();
        expect(res.body.id).toBeTruthy();

        const stored = recordingsRepo.getById(res.body.id);
        expect(stored.status).toBe("pending");
        expect(stored.source_type).toBe("recorded");
    });

    test("tags an uploaded file as 'uploaded', not 'recorded'", async () => {
        const res = await request(app)
            .post("/api/v1/recordings")
            .field("source", "uploaded")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "clip.mp3", contentType: "audio/mp3" });

        expect(res.status).toBe(201);
        expect(res.body.sourceType).toBe("uploaded");
    });

    test("rejects requests with no audio file", async () => {
        const res = await request(app).post("/api/v1/recordings").field("source", "recorded");
        expect(res.status).toBe(400);
        expect(audioStorage.convertToMp3).not.toHaveBeenCalled();
    });

    test("rejects unsupported/invalid audio formats", async () => {
        const res = await request(app)
            .post("/api/v1/recordings")
            .attach("file", Buffer.from("not audio"), { filename: "malware.exe", contentType: "application/x-msdownload" });

        expect(res.status).toBe(400);
        expect(audioStorage.convertToMp3).not.toHaveBeenCalled();
    });

    test("the new recording is immediately visible in the history list", async () => {
        const createRes = await request(app)
            .post("/api/v1/recordings")
            .field("source", "recorded")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "recording-2026-01-01_11-00-00.webm", contentType: "audio/webm" });

        const listRes = await request(app).get("/api/v1/recordings");
        const found = listRes.body.items.find((item) => item.id === createRes.body.id);
        expect(found).toBeDefined();
        expect(found.status).toBe("pending");
        expect(found.sourceType).toBe("recorded");
    });
});
