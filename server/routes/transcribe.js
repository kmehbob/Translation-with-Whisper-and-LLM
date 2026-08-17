const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const config = require("../lib/config");
const logger = require("../lib/logger");
const concurrencyGuard = require("../lib/concurrencyGuard");
const { transcribeLimiter } = require("../lib/rateLimiters");
const { requireClientApiKey } = require("../middleware/auth");
const { createServiceClient, callService } = require("../lib/serviceClient");

const router = express.Router();

const ALLOWED_MIMES = [
    "audio/webm",
    "audio/mp3",
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
];

const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const EXT_BY_MIME = {
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/webm": "webm",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        // Never derive the extension from client-controlled data (mimetype is
        // looked up against a fixed allow-list; originalname is never used)
        // so a crafted filename/mimetype can't be turned into a path traversal
        // or arbitrary-write via the generated filename.
        const ext = EXT_BY_MIME[file.mimetype] || "bin";
        cb(null, `audio-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
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

const transcriptionClient = createServiceClient(config.transcriptionServiceUrl, config.transcribeTimeoutMs);

async function deleteUploadedFile(filePath) {
    if (!filePath) return;
    // On some platforms (notably Windows) a file can't be unlinked while the
    // read stream we forwarded it with is still releasing its handle, so a
    // transient EBUSY/EPERM right after the request completes is expected -
    // retry briefly before giving up and logging.
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await fs.promises.unlink(filePath);
            return;
        } catch (err) {
            if (err.code === "ENOENT") return;
            const retryable = err.code === "EBUSY" || err.code === "EPERM";
            if (!retryable || attempt === maxAttempts) {
                logger.warn("temp_audio_delete_failed", { code: err.code });
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
        }
    }
}

router.post(
    "/",
    transcribeLimiter,
    requireClientApiKey,
    concurrencyGuard(config.maxConcurrentTranscribeRequests, "Transcription service is busy, please try again shortly"),
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
        const startedAt = Date.now();
        const uploadedPath = req.file?.path;

        try {
            if (!req.file) {
                return res.status(400).json({ error: "No audio file was provided", requestId: req.id });
            }

            const formData = new FormData();
            formData.append("file", fs.createReadStream(uploadedPath), {
                filename: req.file.filename,
                contentType: req.file.mimetype,
            });

            const result = await callService({
                client: transcriptionClient,
                req,
                method: "post",
                url: "/v1/transcribe",
                data: formData,
                serviceLabel: "Transcription service",
                axiosOpts: { headers: formData.getHeaders() },
            });

            logger.info("transcription_completed", {
                requestId: req.id,
                durationMs: Date.now() - startedAt,
                audioBytes: req.file.size,
            });

            res.json({
                requestId: req.id,
                text: result.text || "",
                language: result.language || "ur",
                durationMs: Date.now() - startedAt,
            });
        } catch (err) {
            next(err);
        } finally {
            await deleteUploadedFile(uploadedPath);
        }
    }
);

module.exports = router;
