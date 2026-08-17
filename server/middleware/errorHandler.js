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

    logger.error("unhandled_error", { requestId, path: req.path, name: err?.name });
    res.status(500).json({ error: "Internal server error", requestId });
}

module.exports = errorHandler;
