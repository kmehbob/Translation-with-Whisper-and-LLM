const { exportRecording, isArabicScript, SUPPORTED_FORMATS } = require("../lib/exporters");

const recording = {
    source_language: "ur",
    target_language: "en",
    transcription_text: "کل ۵ بجے میٹنگ ہے۔ یہ project deadline کل ہے۔\nدوسری سطر یہ ہے۔",
    translation_text: "The meeting is at 5 o'clock.\nSecond line here.",
};

test("isArabicScript detects Urdu/Arabic text and rejects plain Latin text", () => {
    expect(isArabicScript("یہ اردو ہے")).toBe(true);
    expect(isArabicScript("This is English")).toBe(false);
    expect(isArabicScript("")).toBe(false);
});

test("SUPPORTED_FORMATS lists exactly the three documented export formats", () => {
    expect(SUPPORTED_FORMATS.sort()).toEqual(["docx", "pdf", "txt"]);
});

test("exportRecording rejects an unsupported format", async () => {
    await expect(exportRecording(recording, "xlsx")).rejects.toThrow(/Unsupported export format/);
});

describe("txt export", () => {
    test("includes both sections with headings and exact body text", async () => {
        const { buffer, mimeType } = await exportRecording(recording, "txt");
        const text = buffer.toString("utf-8");
        expect(mimeType).toMatch(/text\/plain/);
        expect(text).toContain(`Transcription (${recording.source_language})`);
        expect(text).toContain(`Translation (${recording.target_language})`);
        expect(text).toContain(recording.transcription_text);
        expect(text).toContain(recording.translation_text);
    });

    test("omits a section entirely when its text is empty", async () => {
        const { buffer } = await exportRecording({ ...recording, translation_text: "" }, "txt");
        expect(buffer.toString("utf-8")).not.toContain("Translation");
    });
});

describe("docx export", () => {
    test("produces a non-empty, validly-zipped docx buffer", async () => {
        const { buffer, mimeType } = await exportRecording(recording, "docx");
        expect(mimeType).toMatch(/wordprocessingml/);
        // A .docx is a zip archive - real docx files start with the PK signature.
        expect(buffer.slice(0, 2).toString("latin1")).toBe("PK");
        expect(buffer.length).toBeGreaterThan(500);
    });
});

describe("pdf export", () => {
    test("produces a well-formed PDF for mixed Urdu/English/digit content without throwing", async () => {
        const { buffer, mimeType } = await exportRecording(recording, "pdf");
        expect(mimeType).toBe("application/pdf");
        expect(buffer.slice(0, 5).toString("latin1")).toBe("%PDF-");
        expect(buffer.length).toBeGreaterThan(500);
    });

    test("handles a long paragraph that must wrap across multiple lines", async () => {
        const longParagraph = "یہ ایک بہت لمبا جملہ ہے جو کئی الفاظ پر مشتمل ہے اور اسے کئی سطروں میں لپیٹنا پڑے گا تاکہ صفحے پر صحیح طرح سے فٹ ہو سکے۔ ".repeat(4);
        const { buffer } = await exportRecording({ ...recording, transcription_text: longParagraph, translation_text: "" }, "pdf");
        expect(buffer.slice(0, 5).toString("latin1")).toBe("%PDF-");
    });

    test("handles text with no Arabic-script content at all", async () => {
        const { buffer } = await exportRecording({ source_language: "en", target_language: "fr", transcription_text: "Hello world", translation_text: "Bonjour le monde" }, "pdf");
        expect(buffer.slice(0, 5).toString("latin1")).toBe("%PDF-");
    });
});
