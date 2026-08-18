const fs = require("fs");
const os = require("os");
const path = require("path");

// Real ffmpeg conversion is exercised for real in tests/audioStorage.test.js;
// this route test mocks it so it only exercises routing/streaming/cleanup.
jest.mock("../lib/audioStorage");

const request = require("supertest");
const audioStorage = require("../lib/audioStorage");

const app = require("../serve.js");

const uploadsDir = path.join(__dirname, "..", "uploads");

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

// The route's own cleanup runs from the read stream's "close" handler, which
// can fire slightly after supertest already sees the full HTTP response - so
// deletion must be polled for, not checked immediately.
async function waitUntilGone(filePath, maxWaitMs = 500) {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
        if (!fs.existsSync(filePath)) return true;
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return !fs.existsSync(filePath);
}

// Deliberately NOT inside uploadsDir - it's a stand-in for what real ffmpeg
// would have produced, not a file the route's own upload-cleanup should ever
// need to touch, and it must not count against the "uploads dir emptied out"
// assertions for tests where conversion never gets far enough to consume it.
const fixturesDir = fs.mkdtempSync(path.join(os.tmpdir(), "audio-convert-test-"));

let fakeMp3Path;
let counter = 0;

beforeEach(() => {
    counter += 1;
    fakeMp3Path = path.join(fixturesDir, `fake-converted-${counter}.mp3`);
    fs.writeFileSync(fakeMp3Path, Buffer.from("fake-mp3-bytes"));

    audioStorage.convertToMp3.mockReset().mockImplementation(async () => ({
        storedFilename: path.basename(fakeMp3Path),
        storedPath: fakeMp3Path,
        fileSizeBytes: 14,
    }));
});

afterEach(() => {
    // Tests that never reach (or deliberately fail before) the route's own
    // stream-then-delete step would otherwise leave this fixture file behind
    // and break later tests' "uploads dir is empty" assertions.
    fs.rmSync(fakeMp3Path, { force: true });
});

describe("POST /api/v1/audio/mp3", () => {
    test("converts an uploaded recording and streams back real MP3 bytes", async () => {
        const res = await request(app)
            .post("/api/v1/audio/mp3")
            .field("source", "recorded")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "recording.webm", contentType: "audio/webm" });

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toBe("audio/mpeg");
        expect(res.headers["content-disposition"]).toMatch(/attachment/);
        expect(res.headers["content-disposition"]).toMatch(/recording\.mp3/);
        expect(res.body.toString()).toBe("fake-mp3-bytes");
        expect(audioStorage.convertToMp3).toHaveBeenCalledTimes(1);
    });

    test("does not transcribe or persist a recording - it's a pure conversion utility", async () => {
        await request(app)
            .post("/api/v1/audio/mp3")
            .field("source", "uploaded")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "clip.mp3", contentType: "audio/mp3" });

        const listRes = await request(app).get("/api/v1/recordings");
        expect(listRes.body.items.every((item) => item.originalFilename !== "clip.mp3")).toBe(true);
    });

    test("rejects requests with no audio file", async () => {
        const res = await request(app).post("/api/v1/audio/mp3");
        expect(res.status).toBe(400);
        expect(audioStorage.convertToMp3).not.toHaveBeenCalled();
    });

    test("rejects unsupported/invalid audio formats", async () => {
        const res = await request(app)
            .post("/api/v1/audio/mp3")
            .attach("file", Buffer.from("not audio"), { filename: "malware.exe", contentType: "application/x-msdownload" });

        expect(res.status).toBe(400);
        expect(audioStorage.convertToMp3).not.toHaveBeenCalled();
    });

    test("deletes both the transient upload and the converted temp file after streaming", async () => {
        await request(app)
            .post("/api/v1/audio/mp3")
            .field("source", "recorded")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "recording.webm", contentType: "audio/webm" });

        expect(await waitForEmptyUploadsDir()).toBe(true);
        expect(await waitUntilGone(fakeMp3Path)).toBe(true);
    });

    test("still cleans up the transient upload when conversion fails", async () => {
        audioStorage.convertToMp3.mockReset().mockRejectedValue(new Error("ffmpeg exploded"));

        const res = await request(app)
            .post("/api/v1/audio/mp3")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "recording.webm", contentType: "audio/webm" });

        expect(res.status).toBeGreaterThanOrEqual(500);
        expect(await waitForEmptyUploadsDir()).toBe(true);
    });
});
