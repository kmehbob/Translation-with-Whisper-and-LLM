// Utility-classes-only setup, deliberately layered alongside the existing
// hand-written public/style.css rather than replacing it: Preflight (Tailwind's
// CSS reset) is disabled so it can't clash with the app's own reset/theme/dark
// mode/RTL rules already in style.css. This gives Tailwind utility classes
// (flex, gap, spacing, etc.) without touching how any existing component looks.
module.exports = {
    content: ["./public/**/*.html", "./public/**/*.js"],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {},
    },
    plugins: [],
};
