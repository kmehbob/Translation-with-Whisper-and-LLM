jest.mock("axios");
const axios = require("axios");
const request = require("supertest");

const mockRequest = jest.fn();
axios.create.mockReturnValue({ request: mockRequest, get: jest.fn() });

const app = require("../serve.js");

const SECRET_URDU = "یہ ایک نہایت خفیہ اور ذاتی جملہ ہے جسے لاگ نہیں ہونا چاہیے";
const SECRET_ENGLISH = "This is a highly confidential sentence that must never be logged";

test("translating text never writes the Urdu input or English output to the logs", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockRequest.mockResolvedValue({ status: 200, data: { translation: SECRET_ENGLISH } });

    try {
        const res = await request(app).post("/api/v1/translate").send({ text: SECRET_URDU });
        expect(res.status).toBe(200);

        const allLoggedText = logSpy.mock.calls.map((call) => call.join(" ")).join("\n");
        expect(allLoggedText).not.toContain(SECRET_URDU);
        expect(allLoggedText).not.toContain(SECRET_ENGLISH);
    } finally {
        logSpy.mockRestore();
    }
});
