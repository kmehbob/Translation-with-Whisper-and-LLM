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
const audioStorage = require("../lib/audioStorage");
const recordingsRepo = require("../lib/recordingsRepo");

const router = express.Router();

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

const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

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

async function deleteTransientFile(filePath) {
    if (!filePath) return;
    // On some platforms (notably Windows) a file can't be unlinked while a
    // read stream against it is still releasing its handle, so a transient
    // EBUSY/EPERM right after use is expected - retry briefly before giving
    // up and logging. This is the short-lived upload/conversion staging
    // file, not the permanent recording (see docs/AI_FEATURE.md for the
    // data-retention policy: uploads/ is always transient, recordings/ persists).
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
        const sourceType = req.body.source === "uploaded" ? "uploaded" : "recorded";
        const sourceLanguage = (req.body.language || config.defaultSourceLanguage || "auto").trim();
        const existingRecordingId = req.body.recordingId ? String(req.body.recordingId) : null;

        let recording = null;

        try {
            if (existingRecordingId) {
                // The audio was already saved to history (POST /api/v1/recordings,
                // e.g. as soon as a recording/upload completed, before the user
                // ever pressed "Transcribe audio") - reuse that stored MP3
                // in place instead of uploading and converting it a second time.
                recording = recordingsRepo.getById(existingRecordingId);
                if (!recording) {
                    return res.status(404).json({ error: "Recording not found", requestId: req.id });
                }
                if (!fs.existsSync(audioStorage.storedFilePath(recording.stored_filename))) {
                    return res.status(409).json({ error: "This recording's audio is no longer available", requestId: req.id });
                }
                recordingsRepo.update(recording.id, { status: "transcribing" });
            } else {
                if (!req.file) {
                    return res.status(400).json({ error: "No audio file was provided", requestId: req.id });
                }

                // Every recording is normalized to MP3 for permanent storage,
                // regardless of the format it arrived in (webm from the
                // browser recorder, or any of the uploadable formats above).
                const converted = await audioStorage.convertToMp3(uploadedPath);
                const durationSeconds = await audioStorage.probeDurationSeconds(converted.storedPath);

                recording = recordingsRepo.create({
                    sourceType,
                    originalFilename: req.file.originalname || null,
                    storedFilename: converted.storedFilename,
                    mimeType: "audio/mpeg",
                    fileSizeBytes: converted.fileSizeBytes,
                    sourceLanguage,
                });
                recordingsRepo.update(recording.id, { status: "transcribing", duration_seconds: durationSeconds });
            }

            const storedPath = audioStorage.storedFilePath(recording.stored_filename);
            const formData = new FormData();
            formData.append("file", fs.createReadStream(storedPath), {
                filename: recording.stored_filename,
                contentType: "audio/mpeg",
            });
            if (sourceLanguage && sourceLanguage !== "auto") {
                formData.append("language", sourceLanguage);
            }

            const result = await callService({
                client: transcriptionClient,
                req,
                method: "post",
                url: "/v1/transcribe",
                data: formData,
                serviceLabel: "Transcription service",
                axiosOpts: { headers: formData.getHeaders() },
            });

            const detectedLanguage = result.language || sourceLanguage;
            recordingsRepo.update(recording.id, {
                status: "transcribed",
                source_language: detectedLanguage,
                transcription_text: result.text || "",
            });

            logger.info("transcription_completed", {
                requestId: req.id,
                recordingId: recording.id,
                durationMs: Date.now() - startedAt,
                audioBytes: recording.file_size_bytes,
            });

            res.json({
                requestId: req.id,
                recordingId: recording.id,
                text: result.text || "",
                language: detectedLanguage,
                durationMs: Date.now() - startedAt,
            });
        } catch (err) {
            if (recording) {
                recordingsRepo.update(recording.id, {
                    status: "failed",
                    error_message: err.publicMessage || "Transcription failed",
                });
            }
            next(err);
        } finally {
            await deleteTransientFile(uploadedPath);
        }
    }
);

module.exports = router;
