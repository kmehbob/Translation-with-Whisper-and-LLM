// Shared test env setup. Must run before any app module is required so
// lib/config.js picks these values up.
const os = require("os");
const path = require("path");
const fs = require("fs");

process.env.NODE_ENV = "test";
process.env.INTERNAL_SERVICE_TOKEN = "test-internal-token";
process.env.RATE_LIMIT_TRANSCRIBE_MAX = "1000";
process.env.RATE_LIMIT_TRANSLATE_MAX = "1000";
process.env.RATE_LIMIT_GENERAL_MAX = "1000";
process.env.MAX_TRANSLATE_TEXT_LENGTH = "20000";
process.env.MAX_AUDIO_UPLOAD_MB = "100";

// Each test FILE gets a fresh module registry (and thus a fresh require of
// lib/db.js), so a unique DB/recordings location per file avoids one test
// file's data leaking into another or fighting over the same SQLite file.
const testDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "urdu-app-test-"));
process.env.DB_PATH = path.join(testDataDir, "app.db");
process.env.RECORDINGS_DIR = path.join(testDataDir, "recordings");
