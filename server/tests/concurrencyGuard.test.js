const concurrencyGuard = require("../lib/concurrencyGuard");

function fakeRes() {
    const listeners = {};
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        },
        once(event, cb) {
            listeners[event] = cb;
        },
        finish() {
            if (listeners.finish) listeners.finish();
        },
        close() {
            if (listeners.close) listeners.close();
        },
    };
}

test("admits requests up to the limit, then returns 503", () => {
    const middleware = concurrencyGuard(1, "busy");
    const next = jest.fn();

    const res1 = fakeRes();
    middleware({}, res1, next);
    expect(next).toHaveBeenCalledTimes(1);

    const res2 = fakeRes();
    middleware({}, res2, next);
    expect(res2.statusCode).toBe(503);
    expect(res2.body).toEqual({ error: "busy" });
    expect(next).toHaveBeenCalledTimes(1);
});

test("frees a slot once the response finishes", () => {
    const middleware = concurrencyGuard(1, "busy");
    const next = jest.fn();

    const res1 = fakeRes();
    middleware({}, res1, next);
    res1.finish();

    const res2 = fakeRes();
    middleware({}, res2, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(res2.statusCode).toBeNull();
});

test("a single completed request only frees one slot, even though both 'finish' and 'close' fire for it", () => {
    // Regression test: Node emits 'close' for every completed response, not
    // just aborted ones, so a non-idempotent release would free two slots
    // per one actual request and silently double the effective concurrency limit.
    const middleware = concurrencyGuard(2, "busy");
    const next = jest.fn();

    const a = fakeRes();
    middleware({}, a, next); // inFlight: 1 (A)
    const b = fakeRes();
    middleware({}, b, next); // inFlight: 2 (A, B)

    a.finish();
    a.close(); // both fire for A's normal completion; must only free ONE slot

    const c = fakeRes();
    middleware({}, c, next); // should be admitted: inFlight now B, C = 2
    const d = fakeRes();
    middleware({}, d, next); // should be rejected: B, C already at the limit

    expect(c.statusCode).toBeNull();
    expect(d.statusCode).toBe(503);
});
