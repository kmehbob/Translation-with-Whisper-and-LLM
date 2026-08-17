const logger = require("../lib/logger");

describe("logger redaction", () => {
    let logSpy;

    beforeEach(() => {
        logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        logSpy.mockRestore();
    });

    test("redacts known-sensitive fields by key name", () => {
        logger.info("translation_completed", { text: "یہ ایک خفیہ جملہ ہے", requestId: "abc-123" });

        const line = logSpy.mock.calls[0][0];
        expect(line).not.toMatch(/خفیہ/);
        expect(line).toContain("[redacted]");
        expect(line).toContain("abc-123");
    });

    test("truncates long free-form string values instead of logging them verbatim", () => {
        const longValue = "x".repeat(500);
        logger.info("some_event", { note: longValue });

        const line = logSpy.mock.calls[0][0];
        expect(line).not.toContain(longValue);
        expect(line).toMatch(/string:500chars/);
    });

    test("passes through small operational metadata untouched", () => {
        logger.info("request_received", { method: "POST", path: "/api/v1/translate", durationMs: 42 });

        const parsed = JSON.parse(logSpy.mock.calls[0][0]);
        expect(parsed.method).toBe("POST");
        expect(parsed.path).toBe("/api/v1/translate");
        expect(parsed.durationMs).toBe(42);
    });
});
