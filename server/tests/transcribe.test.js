const fs = require("fs");
const path = require("path");

jest.mock("axios");
// Audio conversion (real ffmpeg) is exercised for real in
// tests/audioStorage.test.js; route tests mock it so they exercise routing/
// persistence/error-handling logic without needing real audio bytes.
jest.mock("../lib/audioStorage");

const axios = require("axios");
const request = require("supertest");
const audioStorage = require("../lib/audioStorage");

const mockRequest = jest.fn();
axios.create.mockReturnValue({ request: mockRequest, get: jest.fn() });

const app = require("../serve.js");

let convertedCounter = 0;

beforeEach(() => {
    mockRequest.mockReset();
    convertedCounter += 1;
    audioStorage.convertToMp3.mockReset().mockImplementation(async () => ({
        storedFilename: `stored-${convertedCounter}.mp3`,
        storedPath: path.join(__dirname, "..", "recordings", `stored-${convertedCounter}.mp3`),
        fileSizeBytes: 1234,
    }));
    audioStorage.probeDurationSeconds.mockReset().mockResolvedValue(3.5);
    audioStorage.deleteStoredFile.mockReset();
    audioStorage.storedFilePath.mockReset().mockImplementation((name) => path.join(__dirname, "..", "recordings", name));
});

describe("POST /api/v1/transcribe", () => {
    test("transcribes a supported audio upload", async () => {
        mockRequest.mockResolvedValue({ status: 200, data: { text: "یہ ایک ٹیسٹ ہے", language: "ur" } });

        const res = await request(app)
            .post("/api/v1/transcribe")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "audio.webm", contentType: "audio/webm" });

        expect(res.status).toBe(200);
        expect(res.body.text).toBe("یہ ایک ٹیسٹ ہے");
        expect(res.body.language).toBe("ur");
        expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    test("the legacy /transcribe alias still works", async () => {
        mockRequest.mockResolvedValue({ status: 200, data: { text: "پرانا راستہ", language: "ur" } });

        const res = await request(app)
            .post("/transcribe")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "audio.webm", contentType: "audio/webm" });

        expect(res.status).toBe(200);
        expect(res.body.text).toBe("پرانا راستہ");
    });

    test("rejects requests with no audio file", async () => {
        const res = await request(app).post("/api/v1/transcribe");
        expect(res.status).toBe(400);
        expect(mockRequest).not.toHaveBeenCalled();
    });

    test("rejects unsupported/invalid audio formats", async () => {
        const res = await request(app)
            .post("/api/v1/transcribe")
            .attach("file", Buffer.from("not audio"), { filename: "malware.exe", contentType: "application/x-msdownload" });

        expect(res.status).toBe(400);
        expect(mockRequest).not.toHaveBeenCalled();
    });

    const uploadsDir = require("path").join(__dirname, "..", "uploads");

    function listUploadedFiles() {
        return fs.readdirSync(uploadsDir).filter((name) => name !== ".gitkeep");
    }

    async function waitForEmptyUploadsDir(maxWaitMs = 500) {
        const start = Date.now();
        while (Date.now() - start < maxWaitMs) {
            if (listUploadedFiles().length === 0) return true;
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        return listUploadedFiles().length === 0;
    }

    test("deletes the uploaded temp file after a successful transcription", async () => {
        mockRequest.mockResolvedValue({ status: 200, data: { text: "ok", language: "ur" } });

        await request(app)
            .post("/api/v1/transcribe")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "audio.webm", contentType: "audio/webm" });

        expect(await waitForEmptyUploadsDir()).toBe(true);
    });

    test("deletes the uploaded temp file even when the transcription service fails", async () => {
        mockRequest.mockRejectedValue(Object.assign(new Error("boom"), { code: "ECONNREFUSED" }));

        const res = await request(app)
            .post("/api/v1/transcribe")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "audio.webm", contentType: "audio/webm" });

        expect(res.status).toBe(503);
        expect(await waitForEmptyUploadsDir()).toBe(true);
    });

    test("returns a safe error when the transcription service itself fails", async () => {
        mockRequest.mockResolvedValue({ status: 500, data: { error: "internal model crash with stack trace" } });

        const res = await request(app)
            .post("/api/v1/transcribe")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "audio.webm", contentType: "audio/webm" });

        expect(res.status).toBe(502);
        expect(JSON.stringify(res.body)).not.toMatch(/stack trace/);
    });

    test("the iOS bypass accepts an unrecognized mimetype when device precedes the file field", async () => {
        mockRequest.mockResolvedValue({ status: 200, data: { text: "ok", language: "ur" } });

        const res = await request(app)
            .post("/api/v1/transcribe")
            .field("device", "ios")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "recording", contentType: "application/octet-stream" });

        expect(res.status).toBe(200);
    });

    test("never writes an uploaded file outside the uploads directory, even with a crafted filename via the iOS bypass", async () => {
        const path = require("path");
        const publicDir = path.join(__dirname, "..", "public");
        const filesBefore = fs.readdirSync(publicDir);

        let observedFilename;
        mockRequest.mockImplementation(async () => {
            // Inspect what's actually on disk while the request is in flight
            // (before the route's `finally` cleanup deletes it).
            observedFilename = listUploadedFiles()[0];
            return { status: 200, data: { text: "ok", language: "ur" } };
        });

        const res = await request(app)
            .post("/api/v1/transcribe")
            .field("device", "ios")
            .attach("file", Buffer.from("fake-audio-bytes"), {
                filename: "../../public/evil.html",
                contentType: "application/x-not-a-real-type",
            });

        expect(res.status).toBe(200);
        // The generated filename must only ever come from the fixed
        // mimetype allow-list (or "bin"), never from the client-controlled
        // original filename/mimetype.
        expect(observedFilename).toMatch(/^audio-\d+-\d+\.(mp3|m4a|webm|wav|ogg|aac|bin)$/);
        expect(fs.readdirSync(publicDir)).toEqual(filesBefore);
        expect(await waitForEmptyUploadsDir()).toBe(true);
    });
});
