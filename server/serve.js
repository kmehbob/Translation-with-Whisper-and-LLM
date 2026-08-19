const express = require("express");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const config = require("./lib/config");
const logger = require("./lib/logger");
const requestId = require("./lib/requestId");
const errorHandler = require("./middleware/errorHandler");
const { generalLimiter } = require("./lib/rateLimiters");
const transcribeRouter = require("./routes/transcribe");
const translateRouter = require("./routes/translate");
const healthRouter = require("./routes/health");
const recordingsRouter = require("./routes/recordings");
const audioConvertRouter = require("./routes/audioConvert");
const recordingsRepo = require("./lib/recordingsRepo");
const audioStorage = require("./lib/audioStorage");

const app = express();

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"],
            },
        },
    })
);

// Cross-origin calls are denied by default (the UI is same-origin); list
// trusted origins via ALLOWED_ORIGINS for embedding/API consumers.
app.use(
    cors({
        origin: config.allowedOrigins.length ? config.allowedOrigins : false,
    })
);

app.use(requestId);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

app.use((req, res, next) => {
    logger.info("request_received", { requestId: req.id, method: req.method, path: req.path });
    next();
});

app.use(generalLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// New self-hosted AI feature routes (transcription + translation).
// ENABLE_AI_FEATURES=false is the rollback lever: it disables these routes
// without touching anything else in the app.
if (config.enableAiFeatures) {
    app.use("/api/v1/transcribe", transcribeRouter);
    app.use("/api/v1/translate", translateRouter);
    app.use("/transcribe", transcribeRouter); // backward-compatible alias
} else {
    app.use(["/api/v1/transcribe", "/api/v1/translate", "/transcribe"], (req, res) => {
        res.status(503).json({ error: "AI features are currently disabled", requestId: req.id });
    });
}

app.use("/api/v1/recordings", recordingsRouter);
// Plain ffmpeg format conversion (no transcription/AI, no persistence) so a
// recording can be saved as MP3 immediately - kept independent of
// ENABLE_AI_FEATURES since it never touches the AI services.
app.use("/api/v1/audio", audioConvertRouter);
app.use("/api/v1", healthRouter);

// Legacy health check endpoint (preserved for existing monitoring)
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// 404 for anything unmatched under /api, or under the legacy /transcribe
// alias (kept consistent with the versioned route's JSON error shape).
app.use(["/api", "/transcribe"], (req, res) => {
    res.status(404).json({ error: "Not found", requestId: req.id });
});

// Central error handler (must be last)
app.use(errorHandler);

async function pruneExpiredRecordings() {
    if (!config.recordingsRetentionDays) return; // 0 = keep forever
    try {
        const expired = recordingsRepo.pruneExpired(config.recordingsRetentionDays);
        for (const recording of expired) {
            await audioStorage.deleteStoredFile(recording.stored_filename);
        }
        if (expired.length > 0) {
            logger.info("recordings_retention_pruned", { count: expired.length });
        }
    } catch (err) {
        logger.error("recordings_retention_prune_failed", { errorName: err?.name });
    }
}

function start() {
    const server = app.listen(config.port, () => {
        logger.info("server_started", { port: config.port, aiFeaturesEnabled: config.enableAiFeatures });
    });

    // Harden against slow-loris style connections holding the server open.
    server.requestTimeout = 5 * 60 * 1000;
    server.headersTimeout = 65 * 1000;

    pruneExpiredRecordings();
    const retentionInterval = setInterval(pruneExpiredRecordings, 24 * 60 * 60 * 1000);
    retentionInterval.unref();

    let shuttingDown = false;
    function shutdown(signal) {
        if (shuttingDown) return;
        shuttingDown = true;
        logger.info("server_shutting_down", { signal });
        server.close(() => {
            logger.info("server_shutdown_complete");
            process.exit(0);
        });
        // Force-exit if connections don't drain in time.
        setTimeout(() => process.exit(1), 10000).unref();
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    return server;
}

if (require.main === module) {
    start();
}

module.exports = app;
module.exports.start = start;
