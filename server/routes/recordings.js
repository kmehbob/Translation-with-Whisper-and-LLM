const express = require("express");
const fs = require("fs");

const logger = require("../lib/logger");
const recordingsRepo = require("../lib/recordingsRepo");
const audioStorage = require("../lib/audioStorage");
const { exportRecording, SUPPORTED_FORMATS } = require("../lib/exporters");
const { requireClientApiKey } = require("../middleware/auth");

const router = express.Router();

router.use(requireClientApiKey);

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
