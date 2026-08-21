const { randomUUID } = require("crypto");
const db = require("./db");

const ALLOWED_SORT = new Set(["created_at", "updated_at", "duration_seconds", "file_size_bytes"]);
const ALLOWED_STATUS = new Set(["pending", "transcribing", "transcribed", "translating", "completed", "failed"]);
const ALLOWED_SOURCE_TYPE = new Set(["recorded", "uploaded"]);

function nowIso() {
    return new Date().toISOString();
}

// `dateTo` typically arrives as a bare "YYYY-MM-DD" from an <input
// type="date">, but created_at is a full ISO timestamp - compared as-is, a
// bare date would exclude everything from that day except exact midnight.
// Expanding it to the end of that day makes "to <today>" actually include
// today, matching what a user picking that date expects.
function endOfDayIso(dateTo) {
    if (!dateTo) return dateTo;
    return /^\d{4}-\d{2}-\d{2}$/.test(dateTo) ? `${dateTo}T23:59:59.999Z` : dateTo;
}

function create({ sourceType, originalFilename, storedFilename, mimeType, fileSizeBytes, sourceLanguage }) {
    const id = randomUUID();
    const ts = nowIso();
    db.prepare(
        `INSERT INTO recordings
            (id, source_type, original_filename, stored_filename, mime_type, file_size_bytes,
             source_language, status, created_at, updated_at)
         VALUES (@id, @sourceType, @originalFilename, @storedFilename, @mimeType, @fileSizeBytes,
                 @sourceLanguage, 'pending', @ts, @ts)`
    ).run({ id, sourceType, originalFilename, storedFilename, mimeType, fileSizeBytes, sourceLanguage, ts });
    return getById(id);
}

function update(id, fields) {
    const allowed = [
        "duration_seconds",
        "source_language",
        "target_language",
        "transcription_text",
        "translation_text",
        "status",
        "error_message",
        "original_filename",
        "hidden",
    ];
    const setClauses = [];
    const params = { id, updatedAt: nowIso() };
    for (const [key, value] of Object.entries(fields)) {
        if (!allowed.includes(key)) continue;
        setClauses.push(`${key} = @${key}`);
        params[key] = value;
    }
    if (setClauses.length === 0) return getById(id);
    db.prepare(`UPDATE recordings SET ${setClauses.join(", ")}, updated_at = @updatedAt WHERE id = @id`).run(params);
    return getById(id);
}

function getById(id) {
    return db.prepare("SELECT * FROM recordings WHERE id = ?").get(id) || null;
}

// A hidden (user-"deleted") recording is treated as gone everywhere a single
// recordingId is looked up directly - not just list() - so a client that
// still holds (or replays) a deleted recording's id can't keep transcribing/
// translating/renaming/exporting it after the user believed it was deleted.
function getVisibleById(id) {
    const recording = getById(id);
    return recording && !recording.hidden ? recording : null;
}

function remove(id) {
    const result = db.prepare("DELETE FROM recordings WHERE id = ?").run(id);
    return result.changes > 0;
}

// List with search/filter/pagination. `q` matches filename or transcription/
// translation text (simple substring search - fine at this scale; a
// dedicated search index would be overkill for a self-hosted history log).
function list({ q, sourceType, status, dateFrom, dateTo, includeHidden = false, sort = "created_at", order = "desc", page = 1, pageSize = 20 } = {}) {
    const clauses = [];
    const params = {};

    if (!includeHidden) {
        clauses.push("hidden = 0");
    }
    if (q) {
        clauses.push(
            "(original_filename LIKE @q OR stored_filename LIKE @q OR transcription_text LIKE @q OR translation_text LIKE @q)"
        );
        params.q = `%${q}%`;
    }
    if (sourceType && ALLOWED_SOURCE_TYPE.has(sourceType)) {
        clauses.push("source_type = @sourceType");
        params.sourceType = sourceType;
    }
    if (status && ALLOWED_STATUS.has(status)) {
        clauses.push("status = @status");
        params.status = status;
    }
    if (dateFrom) {
        clauses.push("created_at >= @dateFrom");
        params.dateFrom = dateFrom;
    }
    if (dateTo) {
        clauses.push("created_at <= @dateTo");
        params.dateTo = endOfDayIso(dateTo);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const sortCol = ALLOWED_SORT.has(sort) ? sort : "created_at";
    const sortDir = order === "asc" ? "ASC" : "DESC";
    const safePageSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (safePage - 1) * safePageSize;

    const total = db.prepare(`SELECT COUNT(*) AS count FROM recordings ${where}`).get(params).count;
    const items = db
        .prepare(`SELECT * FROM recordings ${where} ORDER BY ${sortCol} ${sortDir} LIMIT @limit OFFSET @offset`)
        .all({ ...params, limit: safePageSize, offset });

    return { items, total, page: safePage, pageSize: safePageSize };
}

function pruneExpired(retentionDays) {
    if (!retentionDays || retentionDays <= 0) return [];
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
    const expired = db.prepare("SELECT * FROM recordings WHERE created_at < ?").all(cutoff);
    db.prepare("DELETE FROM recordings WHERE created_at < ?").run(cutoff);
    return expired;
}

module.exports = { create, update, getById, getVisibleById, remove, list, pruneExpired };
