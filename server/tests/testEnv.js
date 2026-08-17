// Shared test env setup. Must run before any app module is required so
// lib/config.js picks these values up.
process.env.NODE_ENV = "test";
process.env.INTERNAL_SERVICE_TOKEN = "test-internal-token";
process.env.RATE_LIMIT_TRANSCRIBE_MAX = "1000";
process.env.RATE_LIMIT_TRANSLATE_MAX = "1000";
process.env.RATE_LIMIT_GENERAL_MAX = "1000";
process.env.MAX_TRANSLATE_TEXT_LENGTH = "20000";
process.env.MAX_AUDIO_UPLOAD_MB = "100";
