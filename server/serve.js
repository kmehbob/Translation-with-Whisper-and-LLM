const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
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

const app = express();

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
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

// Create audio-cache directory for TTS files
const ttsCacheDir = path.join(__dirname, "audio-cache");
if (!fs.existsSync(ttsCacheDir)) {
    fs.mkdirSync(ttsCacheDir, { recursive: true });
}

// Utility function to clean up old cache files
function cleanupCache() {
    try {
        const files = fs.readdirSync(ttsCacheDir);

        // If cache has fewer than 100 files, don't clean up yet
        if (files.length < 100) return;

        console.log(`Cache cleanup started. Current files: ${files.length}`);

        // Get file stats to sort by last accessed time
        const fileStats = files.map((file) => {
            const filePath = path.join(ttsCacheDir, file);
            return {
                file: filePath,
                stats: fs.statSync(filePath),
            };
        });

        // Sort by access time (oldest first)
        fileStats.sort((a, b) => a.stats.atime.getTime() - b.stats.atime.getTime());

        // Delete oldest 20% of files
        const deleteCount = Math.floor(files.length * 0.2);
        for (let i = 0; i < deleteCount; i++) {
            try {
                fs.unlinkSync(fileStats[i].file);
            } catch (e) {
                console.error(`Failed to delete cache file: ${fileStats[i].file}`, e);
            }
        }

        console.log(`Cache cleanup complete. Deleted ${deleteCount} files.`);
    } catch (error) {
        console.error("Error during cache cleanup:", error);
    }
}

// API Route for text-to-speech using OpenAI TTS API
// NOTE: this is pre-existing functionality, preserved as-is. It is a
// separate integration from the new self-hosted transcription/translation
// feature below and is out of scope for the "no external AI providers"
// requirement, which targets only the new feature. See docs/AI_FEATURE.md.
app.post("/speak", async (req, res) => {
    try {
        const { text, voice, speed } = req.body;

        if (!text) {
            return res.status(400).json({ error: "کوئی متن نہیں دیا گیا" });
        }

        const voiceMap = {
            "ur-female": "nova",
            "ur-male": "onyx",
            default: "nova",
        };

        const openaiVoices = ["onyx", "nova"];
        const openaiVoice = openaiVoices.includes(voice) ? voice : voiceMap[voice] || voiceMap["default"];

        const ttsModel = "tts-1";

        const hash = require("crypto")
            .createHash("md5")
            .update(`${text}-${openaiVoice}-${speed}-${ttsModel}`)
            .digest("hex");

        const cacheFilePath = path.join(ttsCacheDir, `${hash}.mp3`);

        if (fs.existsSync(cacheFilePath)) {
            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Content-Disposition", 'attachment; filename="speech.mp3"');

            const fileStream = fs.createReadStream(cacheFilePath);
            fileStream.pipe(res);
            return;
        }

        const response = await axios({
            method: "post",
            url: "https://api.openai.com/v1/audio/speech",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            data: {
                model: ttsModel,
                input: text,
                voice: openaiVoice,
                response_format: "mp3",
                speed: parseFloat(speed),
            },
            responseType: "arraybuffer",
        });

        fs.writeFileSync(cacheFilePath, response.data);
        cleanupCache();

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Disposition", 'attachment; filename="speech.mp3"');
        res.send(response.data);
    } catch (error) {
        logger.error("tts_error", { requestId: req.id, status: error.response?.status });

        let errorMessage = "متن کو آواز میں تبدیل کرنے میں خرابی";

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = "API کی رسائی میں خرابی - API کلید غلط یا غیر موجود ہے";
            } else if (error.response.status === 429) {
                errorMessage = "API کی حد تک پہنچ گئے ہیں - براہ کرم کچھ دیر بعد کوشش کریں";
            }
        }

        res.status(500).json({ error: errorMessage });
    }
});

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

function start() {
    const server = app.listen(config.port, () => {
        logger.info("server_started", { port: config.port, aiFeaturesEnabled: config.enableAiFeatures });
    });

    // Harden against slow-loris style connections holding the server open.
    server.requestTimeout = 5 * 60 * 1000;
    server.headersTimeout = 65 * 1000;

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
