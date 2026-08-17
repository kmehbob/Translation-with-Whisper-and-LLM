// MAX_AUDIO_UPLOAD_MB must be set before requiring the app, since multer's
// upload limit is computed once when routes/transcribe.js is first loaded.
process.env.MAX_AUDIO_UPLOAD_MB = "0"; // anything > 0 bytes now exceeds the limit

jest.mock("axios");
const axios = require("axios");
const request = require("supertest");

const mockRequest = jest.fn();
axios.create.mockReturnValue({ request: mockRequest, get: jest.fn() });

const app = require("../serve.js");

test("rejects oversized audio uploads with 413 before contacting the transcription service", async () => {
    const res = await request(app)
        .post("/api/v1/transcribe")
        .attach("file", Buffer.from("this-is-more-than-zero-bytes"), {
            filename: "audio.webm",
            contentType: "audio/webm",
        });

    expect(res.status).toBe(413);
    expect(mockRequest).not.toHaveBeenCalled();
});
