process.env.ENABLE_AI_FEATURES = "false";

jest.mock("axios");
const axios = require("axios");
const request = require("supertest");

axios.create.mockReturnValue({ request: jest.fn(), get: jest.fn() });

const app = require("../serve.js");

test("rollback: ENABLE_AI_FEATURES=false disables the new routes with a clear error", async () => {
    const translateRes = await request(app).post("/api/v1/translate").send({ text: "سلام" });
    expect(translateRes.status).toBe(503);

    const transcribeRes = await request(app).post("/api/v1/transcribe");
    expect(transcribeRes.status).toBe(503);
});

test("rollback: static app and legacy /health still work when AI features are disabled", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);

    const page = await request(app).get("/");
    expect(page.status).toBe(200);
});
