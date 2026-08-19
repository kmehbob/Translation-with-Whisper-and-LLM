const express = require("express");

const config = require("../lib/config");
const logger = require("../lib/logger");
const concurrencyGuard = require("../lib/concurrencyGuard");
const { translateLimiter } = require("../lib/rateLimiters");
const { requireClientApiKey } = require("../middleware/auth");
const { createServiceClient, callService } = require("../lib/serviceClient");
const recordingsRepo = require("../lib/recordingsRepo");
const noStoreCache = require("../middleware/noStoreCache");

const router = express.Router();
router.use(noStoreCache);

const translationClient = createServiceClient(config.translationServiceUrl, config.translateTimeoutMs);

router.post(
    "/",
    requireClientApiKey,
    translateLimiter,
    concurrencyGuard(config.maxConcurrentTranslateRequests, "Translation service is busy, please try again shortly"),
    async (req, res, next) => {
        const startedAt = Date.now();
        const text = typeof req.body?.text === "string" ? req.body.text : "";
        const sourceLanguage = (req.body?.sourceLanguage || config.defaultSourceLanguage || "ur").trim();
        const targetLanguage = (req.body?.targetLanguage || config.defaultTargetLanguage || "en").trim();
        // Optional: attaches the translation to an existing audio-originated
        // history entry (see routes/transcribe.js). A translation of typed-only
        // text (no recordingId) is never persisted - see docs/AI_FEATURE.md
        // for the scope of what "history" covers.
        const recordingId = typeof req.body?.recordingId === "string" ? req.body.recordingId : null;

        if (!text.trim()) {
            return res.status(400).json({ error: "Text must not be empty", requestId: req.id });
        }
        if (text.length > config.maxTranslateTextLength) {
            return res.status(413).json({
                error: `Text exceeds the maximum allowed length of ${config.maxTranslateTextLength} characters`,
                requestId: req.id,
            });
        }

        let recording = null;
        if (recordingId) {
            // getVisibleById (not getById) so a "deleted" (hidden) recording
            // can't be silently re-translated via a replayed/guessed id.
            recording = recordingsRepo.getVisibleById(recordingId);
            if (!recording) {
                return res.status(404).json({ error: "Recording not found", requestId: req.id });
            }
            recordingsRepo.update(recordingId, { status: "translating", target_language: targetLanguage });
        }

        try {
            const result = await callService({
                client: translationClient,
                req,
                method: "post",
                url: "/v1/translate",
                data: { text, sourceLanguage, targetLanguage },
                serviceLabel: "Translation service",
            });

            if (recording) {
                recordingsRepo.update(recordingId, {
                    status: "completed",
                    target_language: targetLanguage,
                    translation_text: result.translation || "",
                });
            }

            logger.info("translation_completed", {
                requestId: req.id,
                recordingId,
                durationMs: Date.now() - startedAt,
                inputLength: text.length,
            });

            res.json({ translation: result.translation || "", requestId: req.id, recordingId });
        } catch (err) {
            if (recording) {
                recordingsRepo.update(recordingId, {
                    status: "failed",
                    error_message: err.publicMessage || "Translation failed",
                });
            }
            next(err);
        }
    }
);

module.exports = router;
