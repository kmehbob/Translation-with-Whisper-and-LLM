#!/bin/sh
# Docker HEALTHCHECK entrypoint. When mTLS is enabled the server requires a
# client certificate for every connection (including this loopback check),
# so this reuses the gateway's client cert - mounted read-only into this
# container purely for that purpose, it grants no inbound access rights.
set -e

PORT="${SERVICE_PORT:-8001}"

if [ "${TLS_ENABLED:-false}" = "true" ]; then
    curl --fail --silent --show-error \
        --cert "${INTERNAL_TLS_CLIENT_CERT_FILE:-/certs/gateway-client.crt}" \
        --key "${INTERNAL_TLS_CLIENT_KEY_FILE:-/certs/gateway-client.key}" \
        --cacert "${TLS_CLIENT_CA_FILE:-/certs/ca.crt}" \
        "https://localhost:${PORT}/health"
else
    curl --fail --silent --show-error "http://localhost:${PORT}/health"
fi
