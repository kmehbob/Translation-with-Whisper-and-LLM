const fs = require("fs");
const logger = require("./logger");

// On some platforms (notably Windows) a file can't be unlinked while a read
// stream against it is still releasing its handle, so a transient
// EBUSY/EPERM right after use is expected - retry briefly before giving up
// and logging. Used for short-lived upload/conversion staging files, never
// the permanent recording (see docs/AI_FEATURE.md for the data-retention
// policy: uploads/ is always transient, recordings/ persists).
async function deleteTransientFile(filePath, logEvent = "temp_file_delete_failed") {
    if (!filePath) return;
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await fs.promises.unlink(filePath);
            return;
        } catch (err) {
            if (err.code === "ENOENT") return;
            const retryable = err.code === "EBUSY" || err.code === "EPERM";
            if (!retryable || attempt === maxAttempts) {
                logger.warn(logEvent, { code: err.code });
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
        }
    }
}

module.exports = { deleteTransientFile };
