const axios = require("axios");
const config = require("./config");

// Thrown for any failure talking to an internal AI service. `status` is the
// HTTP status the gateway should return to the client; `publicMessage` is
// safe to show externally (never includes upstream URLs/stack traces).
class AiServiceError extends Error {
    constructor(publicMessage, status, cause) {
        super(publicMessage);
        this.name = "AiServiceError";
        this.publicMessage = publicMessage;
        this.status = status;
        this.cause = cause;
    }
}

function createServiceClient(baseURL, timeoutMs) {
    return axios.create({
        baseURL,
        timeout: timeoutMs,
        maxContentLength: 200 * 1024 * 1024,
        maxBodyLength: 200 * 1024 * 1024,
        headers: config.internalServiceToken
            ? { Authorization: `Bearer ${config.internalServiceToken}` }
            : {},
        validateStatus: () => true, // we classify status ourselves below
    });
}

// Performs a request that is aborted if the originating client disconnects,
// and normalizes any failure into an AiServiceError with a safe message.
async function callService({ client, req, method, url, data, axiosOpts, serviceLabel }) {
    const controller = new AbortController();
    const onClose = () => controller.abort();
    if (req) req.on("close", onClose);

    try {
        const response = await client.request({
            method,
            url,
            data,
            signal: controller.signal,
            ...axiosOpts,
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        if (response.status === 401 || response.status === 403) {
            throw new AiServiceError(`${serviceLabel} rejected the request`, 502);
        }
        if (response.status === 429 || response.status === 503) {
            throw new AiServiceError(`${serviceLabel} is busy, please try again shortly`, 503);
        }
        if (response.status >= 400 && response.status < 500) {
            const detail = response.data && typeof response.data.error === "string" ? response.data.error : null;
            throw new AiServiceError(detail || `Invalid request to ${serviceLabel}`, 400);
        }
        throw new AiServiceError(`${serviceLabel} failed to process the request`, 502);
    } catch (err) {
        if (err instanceof AiServiceError) throw err;
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
            throw new AiServiceError("Request cancelled", 499);
        }
        if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
            throw new AiServiceError(`${serviceLabel} timed out`, 504);
        }
        if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.code === "EHOSTUNREACH") {
            throw new AiServiceError(`${serviceLabel} is currently unavailable`, 503);
        }
        throw new AiServiceError(`${serviceLabel} failed to process the request`, 502, err);
    } finally {
        if (req) req.removeListener("close", onClose);
    }
}

module.exports = { createServiceClient, callService, AiServiceError };
