// Every response behind this middleware can contain private audio,
// transcript, or translation content - browsers and any intermediate proxy
// (including the bundled Caddy reverse-proxy profile) must never cache it.
function noStoreCache(req, res, next) {
    res.setHeader("Cache-Control", "private, no-store");
    next();
}

module.exports = noStoreCache;
