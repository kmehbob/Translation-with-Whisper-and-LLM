process.env.RATE_LIMIT_TRANSLATE_MAX = "2";
process.env.RATE_LIMIT_WINDOW_MS = "60000";

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

test("trips the rate limiter after the configured number of requests from one client", async () => {
    const first = await request(app).post("/api/v1/translate").send({ text: "سلام" });
    const second = await request(app).post("/api/v1/translate").send({ text: "سلام" });
    const third = await request(app).post("/api/v1/translate").send({ text: "سلام" });

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    expect(third.body.error).toMatch(/too many/i);
});
