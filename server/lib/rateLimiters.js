const rateLimit = require("express-rate-limit");
const config = require("./config");

function makeLimiter(max, message) {
    return rateLimit({
        windowMs: config.rateLimitWindowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: message },
        handler: (req, res, _next, options) => {
            res.status(options.statusCode).json(options.message);
        },
    });
}

module.exports = {
    transcribeLimiter: makeLimiter(config.rateLimitTranscribeMax, "Too many transcription requests, please slow down"),
    translateLimiter: makeLimiter(config.rateLimitTranslateMax, "Too many translation requests, please slow down"),
    generalLimiter: makeLimiter(config.rateLimitGeneralMax, "Too many requests, please slow down"),
};
