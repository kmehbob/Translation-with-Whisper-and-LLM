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
});
