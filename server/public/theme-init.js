// Runs before first paint (loaded in <head>) to avoid a flash of the wrong
// theme. Kept as its own tiny external file because the gateway's CSP has no
// 'unsafe-inline' for script-src.
(function () {
    try {
        var stored = localStorage.getItem("urduapp.theme");
        var theme = stored === "light" || stored === "dark"
            ? stored
            : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
        document.documentElement.setAttribute("data-theme", "light");
    }
})();
