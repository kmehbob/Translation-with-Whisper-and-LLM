const crypto = require("crypto");
const config = require("../lib/config");

function safeEqual(a, b) {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    // timingSafeEqual throws on mismatched lengths, so pad instead of
    // short-circuiting on length (which would itself leak length via timing).
    if (bufA.length !== bufB.length) {
        crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

// Optional API-key gate for the transcribe/translate endpoints. Off by
// default because the existing app is an unauthenticated public tool with
// no accounts/sessions; set REQUIRE_CLIENT_API_KEY=true and CLIENT_API_KEY
// to lock these endpoints down for an internal/enterprise deployment
// (e.g. behind a reverse proxy that also enforces SSO).
function requireClientApiKey(req, res, next) {
    if (!config.requireClientApiKey) return next();

    const provided = req.headers["x-api-key"];
    if (!config.clientApiKey || typeof provided !== "string" || !safeEqual(provided, config.clientApiKey)) {
        return res.status(401).json({ error: "Unauthorized", requestId: req.id });
    }
    next();
}

module.exports = { requireClientApiKey };
