const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("./config");

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = config.dbPath || path.join(dataDir, "app.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Recordings history: one row per audio-originated item (recorded or
// uploaded). Purely-typed translate requests (no audio) are never persisted
// here - see docs/AI_FEATURE.md for the scope of what "history" covers.
db.exec(`
  CREATE TABLE IF NOT EXISTS recordings (
    id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL CHECK (source_type IN ('recorded', 'uploaded')),
    original_filename TEXT,
    stored_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    duration_seconds REAL,
    source_language TEXT NOT NULL DEFAULT 'ur',
    target_language TEXT,
    transcription_text TEXT,
    translation_text TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'transcribing', 'transcribed', 'translating', 'completed', 'failed')),
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON recordings(created_at);
  CREATE INDEX IF NOT EXISTS idx_recordings_status ON recordings(status);
  CREATE INDEX IF NOT EXISTS idx_recordings_source_type ON recordings(source_type);
`);

module.exports = db;
