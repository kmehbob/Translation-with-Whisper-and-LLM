const express = require("express");

const config = require("../lib/config");
const logger = require("../lib/logger");
const concurrencyGuard = require("../lib/concurrencyGuard");
const { translateLimiter } = require("../lib/rateLimiters");
const { requireClientApiKey } = require("../middleware/auth");
const { createServiceClient, callService } = require("../lib/serviceClient");

const router = express.Router();

const translationClient = createServiceClient(config.translationServiceUrl, config.translateTimeoutMs);

router.post(
    "/",
    translateLimiter,
    requireClientApiKey,
    concurrencyGuard(config.maxConcurrentTranslateRequests, "Translation service is busy, please try again shortly"),
    async (req, res, next) => {
        const startedAt = Date.now();
        const text = typeof req.body?.text === "string" ? req.body.text : "";

        if (!text.trim()) {
            return res.status(400).json({ error: "Urdu text must not be empty", requestId: req.id });
        }
        if (text.length > config.maxTranslateTextLength) {
            return res.status(413).json({
                error: `Text exceeds the maximum allowed length of ${config.maxTranslateTextLength} characters`,
                requestId: req.id,
            });
        }

        try {
            const result = await callService({
                client: translationClient,
                req,
                method: "post",
                url: "/v1/translate",
                data: { text },
                serviceLabel: "Translation service",
            });

            logger.info("translation_completed", {
                requestId: req.id,
                durationMs: Date.now() - startedAt,
                inputLength: text.length,
            });

            res.json({ translation: result.translation || "", requestId: req.id });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
