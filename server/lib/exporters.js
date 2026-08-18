// Generates downloadable TXT/DOCX/PDF exports of a recording's transcription
// and translation.
//
// The PDF path deliberately does NOT use a Nastaliq-style Urdu font or any
// pre-shaping library (arabic-reshaper/bidi-js were tried and removed): both
// produced either missing glyphs or reproducible crashes deep in fontkit's
// Arabic GPOS mark-attachment code on ordinary Urdu text (verified against
// real rendered output, not just "it didn't throw"). Noto Naskh Arabic - a
// simpler, non-ligature-heavy style - has full glyph coverage and never
// crashed the same font/library combination, so it's the font used here.
// PDFKit/fontkit still don't do bidi or cross-font shaping across a script
// boundary, so mixed Urdu+Latin lines (code-switching, digits) are split
// into script-homogeneous runs and positioned manually in visual (RTL)
// order - see renderRtlParagraph below.
const path = require("path");
const { Document, Packer, Paragraph, HeadingLevel } = require("docx");
const PDFDocument = require("pdfkit");

const NASKH_FONT_PATH = path.join(__dirname, "..", "assets", "fonts", "NotoNaskhArabic-Regular.ttf");
const ARABIC_SCRIPT_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
// Only whitespace attaches to the current run without forcing a split.
// ASCII punctuation (: , . etc.) is deliberately NOT included here: the
// Arabic-only font subset has no glyphs for it (verified - every ASCII
// punctuation mark is glyph 0/.notdef in it), so it must fall through to
// being classified as its own non-Arabic run and render with the Latin
// font, even when it appears right next to Urdu text.
const NEUTRAL_ATTACH_RE = /\s/;

function isArabicScript(text) {
    return ARABIC_SCRIPT_RE.test(text);
}

// Splits text into runs that are internally single-script, so each can be
// shaped/rendered with the font that actually has glyphs for it. Neutral
// characters (spaces, common punctuation) stick to the current run rather
// than forcing a split, to avoid fragmenting text unnecessarily.
function splitScriptRuns(text) {
    const runs = [];
    let current = "";
    let currentIsArabic = null;
    for (const ch of text) {
        if (NEUTRAL_ATTACH_RE.test(ch) && currentIsArabic !== null) {
            current += ch;
            continue;
        }
        const isArabic = ARABIC_SCRIPT_RE.test(ch);
        if (currentIsArabic === null || isArabic === currentIsArabic) {
            current += ch;
            currentIsArabic = currentIsArabic === null ? isArabic : currentIsArabic;
        } else {
            runs.push({ text: current, arabic: currentIsArabic });
            current = ch;
            currentIsArabic = isArabic;
        }
    }
    if (current) runs.push({ text: current, arabic: currentIsArabic });
    return runs;
}

// Splits runs further into whitespace-delimited tokens (script tag
// preserved) so a paragraph can be word-wrapped to the page width.
function tokenize(text) {
    const tokens = [];
    for (const run of splitScriptRuns(text)) {
        let buffer = "";
        for (const ch of run.text) {
            buffer += ch;
            if (ch === " ") {
                tokens.push({ text: buffer, arabic: run.arabic });
                buffer = "";
            }
        }
        if (buffer) tokens.push({ text: buffer, arabic: run.arabic });
    }
    return tokens;
}

// Renders one paragraph (which may mix Urdu/Arabic-script and Latin/digit
// text - code-switching, embedded numbers) word-wrapped to fit between
// leftX/rightX. Each visual line is assembled right-to-left: tokens are
// measured left-to-right in logical order, then drawn in reverse order
// starting from the right margin, which is the correct visual result for
// an RTL paragraph without needing a full bidi/shaping pass PDFKit doesn't
// reliably provide across mixed scripts.
function renderRtlParagraph(doc, text, { leftX, rightX, y, arabicFont, latinFont, fontSize, lineHeight }) {
    const maxWidth = rightX - leftX;
    const tokens = tokenize(text);
    let lineTokens = [];
    let lineWidth = 0;
    let cursorY = y;

    function flushLine() {
        if (lineTokens.length === 0) return;
        // Re-group consecutive same-script tokens before reordering, so a
        // multi-word same-script phrase (e.g. an embedded English phrase)
        // keeps its own internal left-to-right word order - only the
        // groups themselves get reordered for the RTL line.
        const groups = [];
        for (const tok of lineTokens) {
            const last = groups[groups.length - 1];
            if (last && last.arabic === tok.arabic) {
                last.tokens.push(tok);
            } else {
                groups.push({ arabic: tok.arabic, tokens: [tok] });
            }
        }

        let x = rightX - lineWidth;
        for (const group of [...groups].reverse()) {
            for (const tok of group.tokens) {
                doc.font(tok.arabic ? arabicFont : latinFont)
                    .fontSize(fontSize)
                    .text(tok.text, x, cursorY, { lineBreak: false });
                x += tok.width;
            }
        }
        cursorY += lineHeight;
        lineTokens = [];
        lineWidth = 0;
    }

    for (const tok of tokens) {
        doc.font(tok.arabic ? arabicFont : latinFont).fontSize(fontSize);
        const width = doc.widthOfString(tok.text);
        if (lineWidth + width > maxWidth && lineTokens.length > 0) flushLine();
        lineTokens.push({ ...tok, width });
        lineWidth += width;
    }
    flushLine();
    return cursorY;
}

function buildSections(recording) {
    const sections = [];
    if (recording.transcription_text) {
        sections.push({ heading: `Transcription (${recording.source_language})`, body: recording.transcription_text });
    }
    if (recording.translation_text) {
        sections.push({
            heading: `Translation (${recording.target_language || "?"})`,
            body: recording.translation_text,
        });
    }
    return sections;
}

function toTxt(recording) {
    const sections = buildSections(recording);
    return sections.map((s) => `${s.heading}\n${"-".repeat(s.heading.length)}\n${s.body}`).join("\n\n");
}

async function toDocx(recording) {
    const sections = buildSections(recording);
    const children = [];
    for (const section of sections) {
        children.push(new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_2 }));
        for (const line of section.body.split("\n")) {
            const rtl = isArabicScript(line);
            // Word/LibreOffice do their own Arabic shaping and bidi, so
            // (unlike the PDF path) plain paragraphs are correct as-is.
            children.push(new Paragraph({ text: line, bidirectional: rtl, alignment: rtl ? "right" : "left" }));
        }
    }
    const doc = new Document({ sections: [{ children }] });
    return Packer.toBuffer(doc);
}

function toPdf(recording) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        doc.registerFont("Naskh", NASKH_FONT_PATH);

        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        const leftX = doc.page.margins.left;
        const rightX = doc.page.width - doc.page.margins.right;
        let y = doc.page.margins.top;
        const pageBottom = doc.page.height - doc.page.margins.bottom;

        function ensureSpace(needed) {
            if (y + needed > pageBottom) {
                doc.addPage();
                y = doc.page.margins.top;
            }
        }

        for (const section of buildSections(recording)) {
            ensureSpace(30);
            // Headings are always app-generated English labels, regardless
            // of the content's language - always Latin, never the Arabic font.
            doc.font("Helvetica-Bold").fontSize(14).text(section.heading, leftX, y, { underline: true });
            y += 24;

            for (const line of section.body.split("\n")) {
                ensureSpace(20);
                if (isArabicScript(line)) {
                    y = renderRtlParagraph(doc, line, {
                        leftX,
                        rightX,
                        y,
                        arabicFont: "Naskh",
                        latinFont: "Helvetica",
                        fontSize: 13,
                        lineHeight: 19,
                    });
                } else {
                    doc.font("Helvetica").fontSize(11).text(line, leftX, y, { width: rightX - leftX, align: "left" });
                    y = doc.y + 4;
                }
            }
            y += 20;
        }
        doc.end();
    });
}

const MIME_BY_FORMAT = {
    txt: "text/plain; charset=utf-8",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
};

async function exportRecording(recording, format) {
    if (format === "txt") return { buffer: Buffer.from(toTxt(recording), "utf-8"), mimeType: MIME_BY_FORMAT.txt };
    if (format === "docx") return { buffer: await toDocx(recording), mimeType: MIME_BY_FORMAT.docx };
    if (format === "pdf") return { buffer: await toPdf(recording), mimeType: MIME_BY_FORMAT.pdf };
    throw new Error(`Unsupported export format: ${format}`);
}

module.exports = { exportRecording, SUPPORTED_FORMATS: Object.keys(MIME_BY_FORMAT), isArabicScript };
