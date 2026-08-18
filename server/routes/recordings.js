const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const config = require("../lib/config");
const logger = require("../lib/logger");
const recordingsRepo = require("../lib/recordingsRepo");
const audioStorage = require("../lib/audioStorage");
const { exportRecording, SUPPORTED_FORMATS } = require("../lib/exporters");
const { requireClientApiKey } = require("../middleware/auth");
const { transcribeLimiter } = require("../lib/rateLimiters");

const router = express.Router();

router.use(requireClientApiKey);

// Same allow-list/naming guard as routes/transcribe.js - kept duplicated
// rather than shared, so this route can't accidentally regress if that
// file's upload handling changes independently.
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
        const ext = EXT_BY_MIME[file.mimetype] || "bin";
        cb(null, `save-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
    },
});

function fileFilter(req, file, cb) {
    if (ALLOWED_MIMES.includes(file.mimetype)) return cb(null, true);
    if (req.body.device === "ios") return cb(null, true);
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: config.maxAudioUploadMb * 1024 * 1024 },
});

async function deleteTransientFile(filePath) {
    if (!filePath) return;
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await fs.promises.unlink(filePath);
            return;
        } catch (err) {
            if (err.code === "ENOENT") return;
            const retryable = err.code === "EBUSY" || err.code === "EPERM";
            if (!retryable || attempt === maxAttempts) {
                logger.warn("temp_recording_save_delete_failed", { code: err.code });
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
        }
    }
}

// Publicly-safe projection - never leak the on-disk stored filename/path.
function toPublicShape(recording) {
    return {
        id: recording.id,
        sourceType: recording.source_type,
        originalFilename: recording.original_filename,
        mimeType: recording.mime_type,
        fileSizeBytes: recording.file_size_bytes,
        durationSeconds: recording.duration_seconds,
        sourceLanguage: recording.source_language,
        targetLanguage: recording.target_language,
        transcriptionText: recording.transcription_text,
        translationText: recording.translation_text,
        status: recording.status,
        errorMessage: recording.error_message,
        createdAt: recording.created_at,
        updatedAt: recording.updated_at,
    };
}

router.get("/", (req, res) => {
    const { q, sourceType, status, dateFrom, dateTo, sort, order, page, pageSize } = req.query;
    const result = recordingsRepo.list({ q, sourceType, status, dateFrom, dateTo, sort, order, page, pageSize });
    res.json({
        items: result.items.map(toPublicShape),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
    });
});

// Persists a completed recording/upload to history WITHOUT transcribing it -
// so it shows up (correctly tagged recorded/uploaded, status "pending")
// even if the user never presses "Transcribe audio". routes/transcribe.js
// accepts this row's id afterwards and transcribes the already-stored audio
// in place instead of creating a second, duplicate row.
router.post(
    "/",
    transcribeLimiter,
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

            const sourceType = req.body.source === "uploaded" ? "uploaded" : "recorded";
            const sourceLanguage = (req.body.language || config.defaultSourceLanguage || "auto").trim();

            const converted = await audioStorage.convertToMp3(uploadedPath);
            const durationSeconds = await audioStorage.probeDurationSeconds(converted.storedPath);

            const recording = recordingsRepo.create({
                sourceType,
                originalFilename: req.file.originalname || null,
                storedFilename: converted.storedFilename,
                mimeType: "audio/mpeg",
                fileSizeBytes: converted.fileSizeBytes,
                sourceLanguage,
            });
            recordingsRepo.update(recording.id, { duration_seconds: durationSeconds });

            logger.info("recording_saved_pending", { requestId: req.id, recordingId: recording.id, sourceType });
            res.status(201).json(toPublicShape(recordingsRepo.getById(recording.id)));
        } catch (err) {
            next(err);
        } finally {
            await deleteTransientFile(uploadedPath);
        }
    }
);

router.get("/:id", (req, res) => {
    const recording = recordingsRepo.getById(req.params.id);
    if (!recording) return res.status(404).json({ error: "Recording not found", requestId: req.id });
    res.json(toPublicShape(recording));
});

router.get("/:id/audio", (req, res) => {
    const recording = recordingsRepo.getById(req.params.id);
    if (!recording) return res.status(404).json({ error: "Recording not found", requestId: req.id });

    const filePath = audioStorage.storedFilePath(recording.stored_filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Audio file is no longer available", requestId: req.id });
    }
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename="${recording.id}.mp3"`);
    fs.createReadStream(filePath).pipe(res);
});

router.get("/:id/export", async (req, res, next) => {
    const format = String(req.query.format || "txt").toLowerCase();
    if (!SUPPORTED_FORMATS.includes(format)) {
        return res.status(400).json({ error: `Unsupported export format. Use one of: ${SUPPORTED_FORMATS.join(", ")}`, requestId: req.id });
    }

    const recording = recordingsRepo.getById(req.params.id);
    if (!recording) return res.status(404).json({ error: "Recording not found", requestId: req.id });
    if (!recording.transcription_text && !recording.translation_text) {
        return res.status(409).json({ error: "Nothing to export yet for this recording", requestId: req.id });
    }

    try {
        const { buffer, mimeType } = await exportRecording(recording, format);
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${recording.id}.${format}"`);
        res.send(buffer);
    } catch (err) {
        logger.error("export_failed", { requestId: req.id, format });
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const recording = recordingsRepo.getById(req.params.id);
        if (!recording) return res.status(404).json({ error: "Recording not found", requestId: req.id });

        await audioStorage.deleteStoredFile(recording.stored_filename);
        recordingsRepo.remove(req.params.id);
        logger.info("recording_deleted", { requestId: req.id, recordingId: req.params.id });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
