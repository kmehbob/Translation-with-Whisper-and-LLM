// Central environment configuration with sensible defaults.
// All AI-service / GPU-related knobs live here so they can be tuned per
// deployment (low/medium/high VRAM) without touching code. See
// docs/AI_FEATURE.md for guidance on each value.

function bool(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function int(value, fallback) {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
}

function list(value, fallback) {
    if (!value) return fallback;
    return value.split(",").map((s) => s.trim()).filter(Boolean);
}

const config = {
    port: int(process.env.PORT, 3000),
    nodeEnv: process.env.NODE_ENV || "development",

    // Feature flag: set to false to fully disable the new transcribe/translate
    // routes and revert to the pre-existing static app (rollback lever).
    enableAiFeatures: bool(process.env.ENABLE_AI_FEATURES, true),

    // Public-facing access control
    allowedOrigins: list(process.env.ALLOWED_ORIGINS, []),
    requireClientApiKey: bool(process.env.REQUIRE_CLIENT_API_KEY, false),
    clientApiKey: process.env.CLIENT_API_KEY || "",

    // Service-to-service auth shared with the Python AI services
    internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || "",

    // AI service endpoints (internal network in production)
    transcriptionServiceUrl: process.env.TRANSCRIPTION_SERVICE_URL || "http://localhost:8001",
    translationServiceUrl: process.env.TRANSLATION_SERVICE_URL || "http://localhost:8002",

    // Timeouts
    transcribeTimeoutMs: int(process.env.TRANSCRIBE_TIMEOUT_MS, 120000),
    translateTimeoutMs: int(process.env.TRANSLATE_TIMEOUT_MS, 30000),
    aiHealthTimeoutMs: int(process.env.AI_HEALTH_TIMEOUT_MS, 3000),

    // Input limits
    maxAudioUploadMb: int(process.env.MAX_AUDIO_UPLOAD_MB, 100),
    maxTranslateTextLength: int(process.env.MAX_TRANSLATE_TEXT_LENGTH, 20000),

    // Gateway-side concurrency guards (defense in depth, GPU services also
    // enforce their own semaphores)
    maxConcurrentTranscribeRequests: int(process.env.MAX_CONCURRENT_TRANSCRIBE_REQUESTS, 4),
    maxConcurrentTranslateRequests: int(process.env.MAX_CONCURRENT_TRANSLATE_REQUESTS, 8),

    // Rate limiting
    rateLimitWindowMs: int(process.env.RATE_LIMIT_WINDOW_MS, 60000),
    rateLimitTranscribeMax: int(process.env.RATE_LIMIT_TRANSCRIBE_MAX, 10),
    rateLimitTranslateMax: int(process.env.RATE_LIMIT_TRANSLATE_MAX, 20),
    rateLimitGeneralMax: int(process.env.RATE_LIMIT_GENERAL_MAX, 60),

    logLevel: process.env.LOG_LEVEL || "info",
};

module.exports = config;
