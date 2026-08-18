#!/usr/bin/env bash
# Generates a private internal CA plus one server cert per AI service and one
# client cert for the gateway, for mutual TLS between the Express gateway and
# the transcription/translation services.
#
# This is for INTERNAL service-to-service traffic only. The public-facing
# endpoint (browser -> gateway) still needs a certificate a browser trusts -
# see deploy/Caddyfile (automatic public HTTPS) or your own reverse proxy.
#
# Usage: ./scripts/generate-internal-certs.sh [output-dir]
# Re-run any time to rotate all certs (this always regenerates everything).
set -euo pipefail

# Git Bash/MSYS on Windows otherwise mangles "/CN=..." style openssl -subj
# arguments into Windows paths. Harmless no-op on real Linux/macOS shells.
export MSYS_NO_PATHCONV=1

OUT_DIR="${1:-$(dirname "$0")/../certs}"
DAYS="${CERT_DAYS:-825}"

mkdir -p "$OUT_DIR"
# Resolve to an absolute path before `cd`-ing in, so a relative $OUT_DIR
# (e.g. "./certs") doesn't break the final `ls "$OUT_DIR"` below.
OUT_DIR="$(cd "$OUT_DIR" && pwd)"
cd "$OUT_DIR"

echo "Generating internal mTLS certs into: $OUT_DIR"

# --- Certificate authority -------------------------------------------------
openssl genrsa -out ca.key 4096 2>/dev/null
openssl req -x509 -new -nodes -key ca.key -sha256 -days "$DAYS" \
    -subj "/CN=urdu-voice-pipeline-internal-ca" \
    -out ca.crt

issue_cert() {
    local name="$1"
    local cn="$2"
    local sans="$3" # e.g. "DNS:transcription,DNS:localhost,IP:127.0.0.1"

    openssl genrsa -out "${name}.key" 2048 2>/dev/null
    openssl req -new -key "${name}.key" -subj "/CN=${cn}" -out "${name}.csr"

    cat > "${name}.ext" <<EOF
subjectAltName = ${sans}
EOF

    openssl x509 -req -in "${name}.csr" -CA ca.crt -CAkey ca.key -CAcreateserial \
        -out "${name}.crt" -days "$DAYS" -sha256 -extfile "${name}.ext"

    rm -f "${name}.csr" "${name}.ext"
}

# Server certs - one per AI service, SAN must match how the gateway reaches it.
issue_cert transcription-server transcription \
    "DNS:transcription,DNS:localhost,IP:127.0.0.1"
issue_cert translation-server translation \
    "DNS:translation,DNS:localhost,IP:127.0.0.1"

# Client cert - presented by the gateway when calling either AI service, and
# reused by each service's own Docker healthcheck to call itself over TLS.
issue_cert gateway-client gateway-client "DNS:gateway-client"

chmod 600 ./*.key
chmod 644 ./*.crt

echo "Done. Files written to $OUT_DIR:"
ls -1 "$OUT_DIR"
echo
echo "Set these in docker-compose.yml / .env (already wired in docker-compose.yml):"
echo "  INTERNAL_TLS_ENABLED=true"
echo "  INTERNAL_TLS_CA_FILE=/certs/ca.crt"
echo "  INTERNAL_TLS_CLIENT_CERT_FILE=/certs/gateway-client.crt"
echo "  INTERNAL_TLS_CLIENT_KEY_FILE=/certs/gateway-client.key"
echo "  TLS_ENABLED=true (per AI service)"
echo "  TLS_CERT_FILE / TLS_KEY_FILE=/certs/<service>-server.crt / .key"
echo "  TLS_CLIENT_CA_FILE=/certs/ca.crt (per AI service)"
