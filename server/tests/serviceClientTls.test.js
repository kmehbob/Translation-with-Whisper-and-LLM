const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

let certDir;

beforeAll(() => {
    // Real (throwaway) certs, not fixture strings - https.Agent should be
    // exercised the same way it would be with the certs the ops script
    // actually generates.
    certDir = fs.mkdtempSync(path.join(os.tmpdir(), "mtls-test-"));
    const key = path.join(certDir, "client.key");
    const cert = path.join(certDir, "client.crt");
    const ca = path.join(certDir, "ca.crt");

    execFileSync(
        "openssl",
        ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", cert, "-days", "1", "-subj", "/CN=test-client"],
        { env: { ...process.env, MSYS_NO_PATHCONV: "1" } } // avoid Git Bash/MSYS mangling "/CN=..." into a path
    );
    fs.copyFileSync(cert, ca);
});

afterAll(() => {
    fs.rmSync(certDir, { recursive: true, force: true });
});

function loadServiceClient(envOverrides) {
    jest.resetModules();
    Object.assign(process.env, envOverrides);
    return require("../lib/serviceClient");
}

afterEach(() => {
    delete process.env.INTERNAL_TLS_ENABLED;
    delete process.env.INTERNAL_TLS_CLIENT_CERT_FILE;
    delete process.env.INTERNAL_TLS_CLIENT_KEY_FILE;
    delete process.env.INTERNAL_TLS_CA_FILE;
});

test("returns no https agent when INTERNAL_TLS_ENABLED is unset (plaintext, local/dev default)", () => {
    const { getInternalHttpsAgent } = loadServiceClient({});
    expect(getInternalHttpsAgent()).toBeUndefined();
});

test("builds a real mTLS https.Agent from the configured cert/key/ca files when enabled", () => {
    const { getInternalHttpsAgent } = loadServiceClient({
        INTERNAL_TLS_ENABLED: "true",
        INTERNAL_TLS_CLIENT_CERT_FILE: path.join(certDir, "client.crt"),
        INTERNAL_TLS_CLIENT_KEY_FILE: path.join(certDir, "client.key"),
        INTERNAL_TLS_CA_FILE: path.join(certDir, "ca.crt"),
    });

    const agent = getInternalHttpsAgent();
    expect(agent).toBeDefined();
    expect(agent.options.cert).toBeDefined();
    expect(agent.options.key).toBeDefined();
    expect(agent.options.ca).toBeDefined();
    expect(agent.options.rejectUnauthorized).toBe(true);
});

test("caches the agent instead of re-reading the cert files on every call", () => {
    const { getInternalHttpsAgent } = loadServiceClient({
        INTERNAL_TLS_ENABLED: "true",
        INTERNAL_TLS_CLIENT_CERT_FILE: path.join(certDir, "client.crt"),
        INTERNAL_TLS_CLIENT_KEY_FILE: path.join(certDir, "client.key"),
        INTERNAL_TLS_CA_FILE: path.join(certDir, "ca.crt"),
    });

    expect(getInternalHttpsAgent()).toBe(getInternalHttpsAgent());
});

test("fails fast at startup if enabled without all three cert paths set", () => {
    const { getInternalHttpsAgent } = loadServiceClient({
        INTERNAL_TLS_ENABLED: "true",
        INTERNAL_TLS_CLIENT_CERT_FILE: path.join(certDir, "client.crt"),
        // key/ca intentionally omitted
    });

    expect(() => getInternalHttpsAgent()).toThrow(/INTERNAL_TLS_ENABLED/);
});

test("createServiceClient wires the mTLS agent into the axios instance", () => {
    const { createServiceClient } = loadServiceClient({
        INTERNAL_TLS_ENABLED: "true",
        INTERNAL_TLS_CLIENT_CERT_FILE: path.join(certDir, "client.crt"),
        INTERNAL_TLS_CLIENT_KEY_FILE: path.join(certDir, "client.key"),
        INTERNAL_TLS_CA_FILE: path.join(certDir, "ca.crt"),
    });

    const client = createServiceClient("https://transcription:8001", 5000);
    expect(client.defaults.httpsAgent).toBeDefined();
    expect(client.defaults.httpsAgent.options.rejectUnauthorized).toBe(true);
});
