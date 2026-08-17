const crypto = require("crypto");

// Attaches a request ID to every request (reusing one supplied by an
// upstream proxy if present) and echoes it back on the response so client
// and server logs can be correlated without ever logging request bodies.
function requestId(req, res, next) {
    const incoming = req.headers["x-request-id"];
    req.id = (typeof incoming === "string" && incoming.trim()) || crypto.randomUUID();
    res.setHeader("X-Request-Id", req.id);
    next();
}

module.exports = requestId;
