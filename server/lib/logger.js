// Minimal structured JSON logger. Deliberately does NOT accept free-form
// blobs of user content: callers pass an event name plus a metadata object,
// which keeps sensitive fields (audio bytes, transcribed/translated text,
// tokens, API keys) out of logs by construction rather than by remembering
// to redact them each time.
const config = require("./config");

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[config.logLevel] ?? LEVELS.info;

const SENSITIVE_KEYS = new Set([
    "text", "translation", "transcript", "urduText", "englishText",
    "audio", "buffer", "authorization", "apiKey", "token", "password",
]);

function sanitize(meta) {
    if (!meta || typeof meta !== "object") return meta;
    const out = {};
    for (const [key, value] of Object.entries(meta)) {
        if (SENSITIVE_KEYS.has(key)) {
            out[key] = "[redacted]";
        } else if (typeof value === "string" && value.length > 200) {
            out[key] = `[string:${value.length}chars]`;
        } else {
            out[key] = value;
        }
    }
    return out;
}

function log(level, event, meta) {
    if (LEVELS[level] > currentLevel) return;
    const entry = {
        ts: new Date().toISOString(),
        level,
        event,
        ...sanitize(meta),
    };
    const line = JSON.stringify(entry);
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
}

module.exports = {
    error: (event, meta) => log("error", event, meta),
    warn: (event, meta) => log("warn", event, meta),
    info: (event, meta) => log("info", event, meta),
    debug: (event, meta) => log("debug", event, meta),
};
