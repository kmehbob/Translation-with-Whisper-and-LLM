process.env.REQUIRE_CLIENT_API_KEY = "true";
process.env.CLIENT_API_KEY = "test-client-key";

jest.mock("axios");
const axios = require("axios");
const request = require("supertest");

const mockRequest = jest.fn();
axios.create.mockReturnValue({ request: mockRequest, get: jest.fn() });

const app = require("../serve.js");

beforeEach(() => {
    mockRequest.mockReset();
    mockRequest.mockResolvedValue({ status: 200, data: { translation: "Hello" } });
});

describe("client API key enforcement (REQUIRE_CLIENT_API_KEY=true)", () => {
    test("rejects translate requests with no API key", async () => {
        const res = await request(app).post("/api/v1/translate").send({ text: "سلام" });
        expect(res.status).toBe(401);
        expect(mockRequest).not.toHaveBeenCalled();
    });

    test("rejects translate requests with the wrong API key", async () => {
        const res = await request(app)
            .post("/api/v1/translate")
            .set("x-api-key", "wrong-key")
            .send({ text: "سلام" });
        expect(res.status).toBe(401);
    });

    test("accepts translate requests with the correct API key", async () => {
        const res = await request(app)
            .post("/api/v1/translate")
            .set("x-api-key", "test-client-key")
            .send({ text: "سلام" });
        expect(res.status).toBe(200);
    });

    test("rejects transcribe requests with no API key", async () => {
        const res = await request(app)
            .post("/api/v1/transcribe")
            .attach("file", Buffer.from("fake-audio-bytes"), { filename: "audio.webm", contentType: "audio/webm" });
        expect(res.status).toBe(401);
    });

    describe("recordings router", () => {
        const recordingsRepo = require("../lib/recordingsRepo");

        function seedRecording() {
            return recordingsRepo.create({
                sourceType: "recorded",
                originalFilename: "call.wav",
                storedFilename: "seed.mp3",
                mimeType: "audio/mpeg",
                fileSizeBytes: 4096,
                sourceLanguage: "ur",
            });
        }

        test("rejects list with no API key", async () => {
            const res = await request(app).get("/api/v1/recordings");
            expect(res.status).toBe(401);
        });

        test("rejects get-by-id with no API key", async () => {
            const rec = seedRecording();
            const res = await request(app).get(`/api/v1/recordings/${rec.id}`);
            expect(res.status).toBe(401);
        });

        test("rejects rename with no API key", async () => {
            const rec = seedRecording();
            const res = await request(app).patch(`/api/v1/recordings/${rec.id}`).send({ originalFilename: "x.mp3" });
            expect(res.status).toBe(401);
        });

        test("rejects delete with no API key", async () => {
            const rec = seedRecording();
            const res = await request(app).delete(`/api/v1/recordings/${rec.id}`);
            expect(res.status).toBe(401);
        });

        test("rejects restore with no API key", async () => {
            const res = await request(app).post("/api/v1/recordings/restore").send({});
            expect(res.status).toBe(401);
        });

        test("accepts list with the correct API key", async () => {
            const res = await request(app).get("/api/v1/recordings").set("x-api-key", "test-client-key");
            expect(res.status).toBe(200);
        });
    });
});
