const express = require("express");
const config = require("../lib/config");
const { createServiceClient } = require("../lib/serviceClient");

const router = express.Router();

const transcriptionClient = createServiceClient(config.transcriptionServiceUrl, config.aiHealthTimeoutMs);
const translationClient = createServiceClient(config.translationServiceUrl, config.aiHealthTimeoutMs);

// Liveness: process is up and can respond. No upstream calls, so this stays
// fast and cheap for orchestrator liveness probes.
router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Readiness: also confirms the AI services are reachable and report ready.
// Used for orchestrator readiness probes / load-balancer draining.
router.get("/ready", async (req, res) => {
    const [transcription, translation] = await Promise.all([
        pingService(transcriptionClient),
        pingService(translationClient),
    ]);

    const ready = config.enableAiFeatures ? transcription.ok && translation.ok : true;
    res.status(ready ? 200 : 503).json({
        status: ready ? "ready" : "not_ready",
        aiFeaturesEnabled: config.enableAiFeatures,
        services: { transcription: transcription.ok, translation: translation.ok },
    });
});

async function pingService(client) {
    try {
        const response = await client.get("/ready");
        return { ok: response.status >= 200 && response.status < 300 };
    } catch {
        return { ok: false };
    }
}

module.exports = router;
