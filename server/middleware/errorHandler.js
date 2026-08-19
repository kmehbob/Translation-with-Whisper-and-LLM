const logger = require("../lib/logger");
const { AiServiceError } = require("../lib/serviceClient");

// Central error handler. Never forwards stack traces, file paths, or
// upstream service details to the client - only a safe message + status.
function errorHandler(err, req, res, _next) {
    if (res.headersSent) return;

    const requestId = req.id;

    if (err instanceof AiServiceError) {
        logger.warn("ai_service_error", { requestId, path: req.path, status: err.status });
        return res.status(err.status).json({ error: err.publicMessage, requestId });
    }

    if (err && err.type === "entity.too.large") {
        return res.status(413).json({ error: "Request payload too large", requestId });
    }

    // body-parser (express.json/urlencoded) reports malformed request bodies
    // as a generic Error with a `status`/`statusCode` in the 400s and a
    // `type` like "entity.parse.failed" - without this check they fell
    // through to the generic 500 branch below, misreporting a client error
    // as a server error.
    if (err && (err.type === "entity.parse.failed" || (err.status >= 400 && err.status < 500) || (err.statusCode >= 400 && err.statusCode < 500))) {
        const status = err.status || err.statusCode;
        return res.status(status).json({ error: "Malformed request body", requestId });
    }

    logger.error("unhandled_error", { requestId, path: req.path, name: err?.name });
    res.status(500).json({ error: "Internal server error", requestId });
}

module.exports = errorHandler;
