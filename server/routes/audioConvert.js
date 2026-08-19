const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const config = require("../lib/config");
const logger = require("../lib/logger");
const concurrencyGuard = require("../lib/concurrencyGuard");
const { transcribeLimiter } = require("../lib/rateLimiters");
const { requireClientApiKey } = require("../middleware/auth");
const audioStorage = require("../lib/audioStorage");
const { deleteTransientFile } = require("../lib/tempFile");
const noStoreCache = require("../middleware/noStoreCache");

const router = express.Router();
router.use(noStoreCache);

const ALLOWED_MIMES = [
    "audio/webm",
    "audio/mp3",
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/x-wav",
    "audio/ogg",
    "audio/aac",
    "audio/flac",
    "audio/x-flac",
    "audio/x-m4a",
];

const EXT_BY_MIME = {
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
    "audio/webm": "webm",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/flac": "flac",
    "audio/x-flac": "flac",
};

const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        // Never derive the extension from client-controlled data - same
        // path-traversal guard as routes/transcribe.js.
        const ext = EXT_BY_MIME[file.mimetype] || "bin";
        cb(null, `convert-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
    },
});

function fileFilter(req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) return cb(null, true);
    if (req.body.device === "ios") {
        // iOS Safari often reports inaccurate/missing MIME types for recorded audio.
        return cb(null, true);
    }
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: config.maxAudioUploadMb * 1024 * 1024 },
});

// Pure format-normalization utility: converts whatever audio format the
// browser recorded/uploaded into MP3 and streams it straight back.
// Deliberately does NOT transcribe it or create a persistent recording -
// this lets a user save their raw recording as a real MP3 file immediately,
// without waiting on (or even needing) the AI pipeline, so it stays
// available even when ENABLE_AI_FEATURES=false.
router.post(
    "/mp3",
    requireClientApiKey,
    transcribeLimiter,
    concurrencyGuard(config.maxConcurrentTranscribeRequests, "Server is busy converting audio, please try again shortly"),
    (req, res, next) => {
        upload.single("file")(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                    return res.status(413).json({ error: "Audio file exceeds the maximum allowed size", requestId: req.id });
                }
                return res.status(400).json({ error: "Invalid or unsupported audio upload", requestId: req.id });
            }
            next();
        });
    },
    async (req, res, next) => {
        const uploadedPath = req.file?.path;

        try {
            if (!req.file) {
                return res.status(400).json({ error: "No audio file was provided", requestId: req.id });
            }

            const converted = await audioStorage.convertToMp3(uploadedPath, uploadsDir);

            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Content-Disposition", 'attachment; filename="recording.mp3"');
            fs.createReadStream(converted.storedPath)
                .on("close", () => deleteTransientFile(converted.storedPath, "temp_convert_file_delete_failed"))
                .on("error", (err) => {
                    logger.error("mp3_convert_stream_failed", { requestId: req.id });
                    deleteTransientFile(converted.storedPath, "temp_convert_file_delete_failed");
                    if (!res.headersSent) next(err);
                })
                .pipe(res);
        } catch (err) {
            next(err);
        } finally {
            await deleteTransientFile(uploadedPath, "temp_convert_file_delete_failed");
        }
    }
);

module.exports = router;
