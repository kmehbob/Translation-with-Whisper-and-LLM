// ============================================================================
// i18n (interface chrome only - transcription/translation content language is
// controlled separately via the source/target language selects)
// ============================================================================
const UI_STRINGS = {
    en: {
        appTitle: "Audio Transcription & Translation",
        tabLive: "Live",
        tabHistory: "History",
        micAllowed: "Microphone access: Allowed",
        micNotAllowed: "Microphone access: Not allowed",
        micInfoGranted: "Your browser has granted this page access to your microphone for recording.",
        micInfoNotGranted: "Grant microphone access below to record audio directly in the browser.",
        micCardTitle: "Microphone access required",
        micCardDesc: "Allow access to record audio. You can still upload a file or type text without it.",
        allowMicBtn: "Allow microphone",
        micGranted: "Microphone access granted!",
        micErrorGeneric: "Microphone access was not granted. Please try again.",
        micErrorIOS: " On iPhone, go to Settings > Safari > Site permissions.",
        instructionsTitle: "If you weren't shown a permission dialog:",
        instructionsStep1: "Click the icon in your browser's address bar",
        instructionsStep2: "Set microphone permission to \"Allow\"",
        instructionsStep3: "Refresh the page and try again",
        recordCardTitle: "Record audio",
        startRecordingLabel: "Start recording",
        statusReady: "Ready",
        statusRecording: "Recording",
        statusPaused: "Paused",
        statusReadyToTranscribe: "Recording ready — press Transcribe audio",
        statusNoAudio: "No audio was recorded",
        pauseBtn: "Pause",
        resumeBtn: "Resume",
        stopBtn: "Stop",
        clearBtn: "Clear",
        uploadCardTitle: "Upload audio file",
        dropHint: "Drag & drop an audio file here, or click to browse",
        uploadFormats: "MP3, WAV, M4A, FLAC, WebM, OGG",
        uploadMaxPrefix: "Max",
        chooseFileLabel: "Choose an audio file",
        downloadRecordingAria: "Download this recording",
        removeFileAria: "Remove",
        mp3ConvertFailed: "Could not convert this recording to MP3.",
        mp3DownloadError: "MP3 download failed: {msg}",
        sourceLabel: "Source language",
        targetLabel: "Target language",
        transcribeBtn: "Transcribe audio",
        transcribingBtn: "Transcribing…",
        workspaceTitle: "Transcription workspace",
        workspaceSubtitleIdle: "Results will appear below",
        workspaceSubtitleBusy: "Processing your audio…",
        statusIdle: "Idle",
        statusBusy: "Processing",
        transcriptionTextareaLabel: "Transcription text, editable",
        translationTextareaLabel: "Translation, read only",
        staleNotice: "Outdated — translate again",
        translateBtnWithLang: "Translate to {lang}",
        translatingBtn: "Translating…",
        saveAudioBtn: "Save MP3",
        downloadBtn: "Download",
        retryBtn: "Retry",
        techDetailsToggle: "Technical details",
        wordCountLabel: "Word count: {n}",
        copiedLabel: "Copied!",
        copyErrorToast: "Could not copy text.",
        transcriptionPanelTitleTpl: "{lang} transcription",
        translationPanelTitleTpl: "{lang} translation",
        transcribingStatus: "Transcribing…",
        transcriptionCompleteToast: "Transcription complete.",
        transcriptionErrorToast: "Transcription error.",
        noSpeechPlaceholder: "No speech detected. Try again or type it yourself.",
        translatingStatus: "Preparing your translation…",
        translationCompleteToast: "Translation complete.",
        translationErrorToast: "Translation error.",
        translationStaleAfterArrival: "Translation finished, but the text has changed — translate again.",
        swapCannotAuto: "Choose a specific source language before swapping.",
        historyTitle: "Recording history",
        historySubtitle: "Search, review and manage your transcriptions",
        exportHistoryBtn: "Export history",
        statRecordings: "Recordings",
        statCompletedLabel: "Completed",
        statFailedLabel: "Failed",
        searchLabel: "Search recordings",
        searchPlaceholder: "Search recordings",
        sourceTypeLabel: "Source",
        allSources: "All sources",
        sourceRecorded: "Recorded",
        sourceUploaded: "Uploaded",
        statusFieldLabel: "Status",
        allStatuses: "All statuses",
        statusPending: "Pending",
        statusTranscribing: "Transcribing",
        statusTranscribed: "Transcribed",
        statusTranslating: "Translating",
        statusCompleted: "Completed",
        statusFailed: "Failed",
        fromDateLabel: "From date",
        toDateLabel: "To date",
        searchBtn: "Search",
        clearFiltersBtn: "Clear filters",
        filtersToggle: "Filters",
        colRecording: "Recording",
        colSource: "Source",
        colDuration: "Duration",
        colLanguages: "Languages",
        colCreated: "Created",
        colStatus: "Status",
        colTranscription: "Transcription",
        colTranslation: "Translation",
        emptyState: "No recordings found.",
        historyLoading: "Loading…",
        historyLoadError: "Could not load history: {msg}",
        showingRangeTpl: "Showing {from}–{to} of {total} recordings",
        showingNone: "No recordings",
        prevBtn: "Previous",
        nextBtn: "Next",
        detailTitle: "Recording detail",
        detailLoadError: "Could not load recording detail: {msg}",
        deleteBtn: "Delete",
        deleteConfirm: "Are you sure you want to delete this recording?",
        deletedToast: "Recording deleted.",
        deleteError: "Could not delete recording: {msg}",
        noAudioAvailable: "(no filename)",
        untitled: "(untitled)",
        exportHistoryEmpty: "No recordings to export.",
    },
    ur: {
        appTitle: "آڈیو ٹرانسکرپشن اور ترجمہ",
        tabLive: "لائیو",
        tabHistory: "ہسٹری",
        micAllowed: "مائیکروفون کی اجازت: ملی ہوئی ہے",
        micNotAllowed: "مائیکروفون کی اجازت: نہیں ملی",
        micInfoGranted: "آپ کے براؤزر نے اس صفحے کو ریکارڈنگ کے لیے مائیکروفون تک رسائی دی ہے۔",
        micInfoNotGranted: "براؤزر میں براہِ راست آڈیو ریکارڈ کرنے کے لیے نیچے مائیکروفون کی اجازت دیں۔",
        micCardTitle: "مائیکروفون کی اجازت درکار ہے",
        micCardDesc: "ریکارڈنگ کے لیے مائیکروفون کی اجازت درکار ہے۔ آپ اجازت کے بغیر بھی فائل اپ لوڈ کر سکتے ہیں یا متن ٹائپ کر سکتے ہیں۔",
        allowMicBtn: "مائیکروفون کی اجازت دیں",
        micGranted: "مائیکروفون کی اجازت مل گئی!",
        micErrorGeneric: "مائیکروفون کی اجازت نہیں ملی۔ براہ کرم دوبارہ کوشش کریں۔",
        micErrorIOS: " آئی فون پر، آپ کو سیٹنگز > سفاری > سائٹ کے اجازت نامے میں جانا ہوگا۔",
        instructionsTitle: "اگر آپ کو اجازت ڈائیلاگ نہیں دکھایا گیا:",
        instructionsStep1: "براؤزر کے ایڈریس بار میں آئیکن پر کلک کریں",
        instructionsStep2: "مائیکروفون کی اجازت کو \"اجازت دیں\" پر سیٹ کریں",
        instructionsStep3: "صفحہ کو ریفریش کریں اور دوبارہ کوشش کریں",
        recordCardTitle: "ریکارڈنگ",
        startRecordingLabel: "ریکارڈنگ شروع کریں",
        statusReady: "تیار ہے",
        statusRecording: "ریکارڈنگ جاری ہے",
        statusPaused: "ریکارڈنگ رکی ہوئی ہے",
        statusReadyToTranscribe: "ریکارڈنگ تیار ہے — ٹرانسکرائب کا بٹن دبائیں",
        statusNoAudio: "کوئی آڈیو ڈیٹا ریکارڈ نہیں ہوا",
        pauseBtn: "روکیں",
        resumeBtn: "جاری رکھیں",
        stopBtn: "ختم کریں",
        clearBtn: "صاف کریں",
        uploadCardTitle: "فائل اپ لوڈ کریں",
        dropHint: "فائل یہاں گھسیٹیں یا کلک کر کے منتخب کریں",
        uploadFormats: "MP3, WAV, M4A, FLAC, WebM, OGG",
        uploadMaxPrefix: "زیادہ سے زیادہ",
        chooseFileLabel: "آڈیو فائل منتخب کریں",
        downloadRecordingAria: "یہ ریکارڈنگ ڈاؤن لوڈ کریں",
        removeFileAria: "ہٹا دیں",
        mp3ConvertFailed: "اس ریکارڈنگ کو MP3 میں تبدیل نہیں کیا جا سکا۔",
        mp3DownloadError: "MP3 ڈاؤن لوڈ ناکام: {msg}",
        sourceLabel: "ماخذ زبان",
        targetLabel: "ہدف زبان",
        transcribeBtn: "آڈیو ٹرانسکرائب کریں",
        transcribingBtn: "ٹرانسکرائب ہو رہا ہے…",
        workspaceTitle: "ٹرانسکرپشن ورک اسپیس",
        workspaceSubtitleIdle: "نتائج نیچے ظاہر ہوں گے",
        workspaceSubtitleBusy: "آپ کا آڈیو پروسیس ہو رہا ہے…",
        statusIdle: "خالی",
        statusBusy: "پروسیسنگ",
        transcriptionTextareaLabel: "ماخذ متن، قابلِ ترمیم",
        translationTextareaLabel: "ترجمہ، صرف پڑھنے کے لیے",
        staleNotice: "پرانا ہو گیا — دوبارہ ترجمہ کریں",
        translateBtnWithLang: "{lang} میں ترجمہ کریں",
        translatingBtn: "ترجمہ ہو رہا ہے…",
        saveAudioBtn: "آڈیو محفوظ کریں (MP3)",
        downloadBtn: "ڈاؤن لوڈ",
        retryBtn: "دوبارہ کوشش کریں",
        techDetailsToggle: "تکنیکی تفصیلات",
        wordCountLabel: "الفاظ کی تعداد: {n}",
        copiedLabel: "کاپی ہو گیا!",
        copyErrorToast: "متن کاپی کرنے میں خرابی۔",
        transcriptionPanelTitleTpl: "{lang} ٹرانسکرپشن",
        translationPanelTitleTpl: "{lang} ترجمہ",
        transcribingStatus: "ٹرانسکرائب ہو رہا ہے…",
        transcriptionCompleteToast: "ٹرانسکرپشن مکمل ہوگئی۔",
        transcriptionErrorToast: "ٹرانسکرپشن میں خرابی۔",
        noSpeechPlaceholder: "کوئی متن نہیں ملا۔ دوبارہ کوشش کریں یا خود ٹائپ کریں۔",
        translatingStatus: "ترجمہ تیار کیا جا رہا ہے…",
        translationCompleteToast: "ترجمہ مکمل ہوگیا۔",
        translationErrorToast: "ترجمہ کرنے میں خرابی۔",
        translationStaleAfterArrival: "ترجمہ مکمل ہوگیا، لیکن متن تبدیل ہو چکا ہے — دوبارہ ترجمہ کریں۔",
        swapCannotAuto: "زبانیں تبدیل کرنے سے پہلے ایک مخصوص ماخذ زبان منتخب کریں۔",
        historyTitle: "ریکارڈنگ ہسٹری",
        historySubtitle: "اپنی ٹرانسکرپشنز تلاش، جائزہ اور منظم کریں",
        exportHistoryBtn: "ہسٹری ایکسپورٹ کریں",
        statRecordings: "ریکارڈنگز",
        statCompletedLabel: "مکمل",
        statFailedLabel: "ناکام",
        searchLabel: "ریکارڈنگز تلاش کریں",
        searchPlaceholder: "فائل کا نام یا متن...",
        sourceTypeLabel: "ذریعہ",
        allSources: "سب",
        sourceRecorded: "ریکارڈ شدہ",
        sourceUploaded: "اپ لوڈ شدہ",
        statusFieldLabel: "حالت",
        allStatuses: "سب",
        statusPending: "زیر التوا",
        statusTranscribing: "ٹرانسکرائب ہو رہا ہے",
        statusTranscribed: "ٹرانسکرائب شدہ",
        statusTranslating: "ترجمہ ہو رہا ہے",
        statusCompleted: "مکمل",
        statusFailed: "ناکام",
        fromDateLabel: "تاریخ سے",
        toDateLabel: "تاریخ تک",
        searchBtn: "تلاش کریں",
        clearFiltersBtn: "فلٹرز صاف کریں",
        filtersToggle: "فلٹرز",
        colRecording: "ریکارڈنگ",
        colSource: "ذریعہ",
        colDuration: "دورانیہ",
        colLanguages: "زبانیں",
        colCreated: "تاریخ",
        colStatus: "حالت",
        colTranscription: "ماخذ متن",
        colTranslation: "ترجمہ",
        emptyState: "کوئی ریکارڈنگ نہیں ملی۔",
        historyLoading: "لوڈ ہو رہا ہے…",
        historyLoadError: "ہسٹری لوڈ کرنے میں خرابی: {msg}",
        showingRangeTpl: "{total} میں سے {from}–{to} ریکارڈنگز دکھائی جا رہی ہیں",
        showingNone: "کوئی ریکارڈنگ نہیں",
        prevBtn: "پچھلا",
        nextBtn: "اگلا",
        detailTitle: "ریکارڈنگ کی تفصیل",
        detailLoadError: "تفصیل لوڈ کرنے میں خرابی: {msg}",
        deleteBtn: "حذف کریں",
        deleteConfirm: "کیا آپ واقعی اس ریکارڈنگ کو حذف کرنا چاہتے ہیں؟",
        deletedToast: "ریکارڈنگ حذف کر دی گئی۔",
        deleteError: "حذف کرنے میں خرابی: {msg}",
        noAudioAvailable: "(بغیر نام)",
        untitled: "(بلا عنوان)",
        exportHistoryEmpty: "ایکسپورٹ کے لیے کوئی ریکارڈنگ نہیں۔",
    },
};

let interfaceLang = "en";

function t(key, vars) {
    const dict = UI_STRINGS[interfaceLang] || UI_STRINGS.en;
    let str = dict[key] !== undefined ? dict[key] : (UI_STRINGS.en[key] !== undefined ? UI_STRINGS.en[key] : key);
    if (vars) {
        for (const k in vars) {
            str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
        }
    }
    return str;
}

function applyI18n() {
    document.documentElement.lang = interfaceLang;
    document.documentElement.dir = interfaceLang === "ur" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });

    document.getElementById("uiLangEnBtn").classList.toggle("active", interfaceLang === "en");
    document.getElementById("uiLangEnBtn").setAttribute("aria-pressed", String(interfaceLang === "en"));
    document.getElementById("uiLangUrBtn").classList.toggle("active", interfaceLang === "ur");
    document.getElementById("uiLangUrBtn").setAttribute("aria-pressed", String(interfaceLang === "ur"));

    renderMicBadge();
    updateLangPillsAndTitles();
    updateTranslateButtonLabel();
    renderWorkspaceTabLabels();
    updateTranscriptionWordCount();
    updateTranslationWordCount();
}

function setInterfaceLanguage(lang) {
    interfaceLang = lang === "ur" ? "ur" : "en";
    try { localStorage.setItem("urduapp.uiLang", interfaceLang); } catch (e) { /* ignore */ }
    applyI18n();
}

// ============================================================================
// Theme
// ============================================================================
function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function renderThemeToggle() {
    const dark = currentTheme() === "dark";
    document.getElementById("themeIconSun").classList.toggle("hidden", !dark);
    document.getElementById("themeIconMoon").classList.toggle("hidden", dark);
    document.getElementById("themeToggleBtn").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("urduapp.theme", theme); } catch (e) { /* ignore */ }
    renderThemeToggle();
}

document.getElementById("themeToggleBtn").addEventListener("click", () => {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
});

// ============================================================================
// Shared state & small utilities
// ============================================================================
let mediaRecorder = null;
let audioChunks = [];
let recordingStream = null;
let recordingStartTime = 0;
let recordingPausedAt = 0;
let recordingTimer = null;
let translateInFlight = false;
let transcribing = false;
let currentRecordingId = null;
let pendingFile = null; // { file, source } staged locally, not yet sent to the server
let lastFailedAction = null; // { type: 'transcribe' | 'translate' }
let lastErrorDetails = "";

let audioContext = null;
let analyser = null;
let visualizerRafId = null;
let visualizerColors = null;

const RTL_LANGS = new Set(["ur", "ar", "fa", "ps", "ku", "he", "sd", "ug"]);

const LANGUAGES = [
    ["ur", "Urdu (اردو)"],
    ["en", "English"],
    ["ar", "Arabic (العربية)"],
    ["hi", "Hindi (हिन्दी)"],
    ["fa", "Persian (فارسی)"],
    ["fr", "French"],
    ["es", "Spanish"],
    ["de", "German"],
    ["zh", "Chinese"],
    ["ru", "Russian"],
    ["pt", "Portuguese"],
    ["it", "Italian"],
    ["tr", "Turkish"],
    ["bn", "Bengali"],
    ["pa", "Punjabi"],
    ["ja", "Japanese"],
    ["ko", "Korean"],
    ["nl", "Dutch"],
    ["pl", "Polish"],
    ["id", "Indonesian"],
    ["vi", "Vietnamese"],
    ["th", "Thai"],
];

function isRtl(code) { return RTL_LANGS.has(code); }

function languageName(code) {
    const found = LANGUAGES.find(([c]) => c === code);
    if (!found) return (code || "").toUpperCase();
    return found[1].replace(/\s*\(.*\)$/, "");
}

function langPillText(code) {
    if (!code) return "—";
    return `${code.toUpperCase()} · ${isRtl(code) ? "RTL" : "LTR"}`;
}

function wordCount(str) {
    return ((str || "").trim().match(/\S+/g) || []).length;
}

// UI Elements
const step1 = document.getElementById("step1");
const instructions = document.getElementById("instructions");
const recordSection = document.getElementById("recordSection");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const pauseBtnLabel = document.getElementById("pauseBtnLabel");
const stopBtn = document.getElementById("stopBtn");
const urduText = document.getElementById("urduText");
const englishText = document.getElementById("englishText");
const copyUrduBtn = document.getElementById("copyUrduBtn");
const copyEnglishBtn = document.getElementById("copyEnglishBtn");
const saveAudioBtn = document.getElementById("saveAudioBtn");
const translateBtn = document.getElementById("translateBtn");
const translateBtnLabel = document.getElementById("translateBtnLabel");
const translateError = document.getElementById("translateError");
const translateErrorText = document.getElementById("translateErrorText");
const staleNotice = document.getElementById("staleNotice");
const recordingStatus = document.getElementById("recordingStatus");
const recordingTime = document.getElementById("recordingTime");
const clearBtn = document.getElementById("clearBtn");
const audioFileInput = document.getElementById("audioFileInput");
const dropZone = document.getElementById("dropZone");
const visualizerCanvas = document.getElementById("visualizer");
const sourceLanguageSelect = document.getElementById("sourceLanguage");
const targetLanguageSelect = document.getElementById("targetLanguage");
const swapLangBtn = document.getElementById("swapLangBtn");
const transcribeManualBtn = document.getElementById("transcribeManualBtn");
const uploadFileList = document.getElementById("uploadFileList");
const recordFileList = document.getElementById("recordFileList");
const transcriptionPanelTitle = document.getElementById("transcriptionPanelTitle");
const translationPanelTitle = document.getElementById("translationPanelTitle");
const transcriptionLangPill = document.getElementById("transcriptionLangPill");
const translationLangPill = document.getElementById("translationLangPill");
const transcriptionWordCount = document.getElementById("transcriptionWordCount");
const translationWordCount = document.getElementById("translationWordCount");
const workspaceStatusBadge = document.getElementById("workspaceStatusBadge");
const workspaceSubtitle = document.getElementById("workspaceSubtitle");
const retryBtn = document.getElementById("retryBtn");
const dismissErrorBtn = document.getElementById("dismissErrorBtn");
const techDetailsToggle = document.getElementById("techDetailsToggle");
const techDetails = document.getElementById("techDetails");

// Device detection
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isMacOS = /Macintosh/.test(navigator.userAgent);
const isAppleDevice = isIOS || isMacOS;
const isAndroid = /Android/.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMacSafari = isMacOS && isSafari;

// Console-only diagnostic log (device/mimetype/permission quirks across
// iOS/Android/Safari). Deliberately not rendered in the page - real errors
// surface through the error banner's "Technical details" instead.
function logDebug(message) {
    console.log(message);
}

logDebug("Device info: " +
    (isIOS ? "iOS" : "Not iOS") + ", " +
    (isAndroid ? "Android" : "Not Android") + ", " +
    (isSafari ? "Safari" : "Not Safari") + ", " +
    "UA: " + navigator.userAgent);

// ============================================================================
// Toasts
// ============================================================================
function showToast(message, type) {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast" + (type ? ` toast-${type}` : "");
    toast.textContent = message;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
}

// ============================================================================
// Tabs
// ============================================================================
const tabBtnCreate = document.getElementById("tabBtnCreate");
const tabBtnHistory = document.getElementById("tabBtnHistory");
const tabCreate = document.getElementById("tabCreate");
const tabHistory = document.getElementById("tabHistory");

function activateTab(name) {
    const creating = name === "create";
    tabCreate.classList.toggle("hidden", !creating);
    tabHistory.classList.toggle("hidden", creating);
    tabBtnCreate.classList.toggle("active", creating);
    tabBtnHistory.classList.toggle("active", !creating);
    tabBtnCreate.setAttribute("aria-selected", String(creating));
    tabBtnHistory.setAttribute("aria-selected", String(!creating));
    if (!creating) {
        loadHistory();
        loadStats();
    }
}

tabBtnCreate.addEventListener("click", () => activateTab("create"));
tabBtnHistory.addEventListener("click", () => activateTab("history"));

// ============================================================================
// Interface language toggle
// ============================================================================
document.getElementById("uiLangEnBtn").addEventListener("click", () => setInterfaceLanguage("en"));
document.getElementById("uiLangUrBtn").addEventListener("click", () => setInterfaceLanguage("ur"));

// ============================================================================
// Mic badge
// ============================================================================
let micGranted = false;

function renderMicBadge() {
    const badge = document.getElementById("micBadge");
    const text = document.getElementById("micBadgeText");
    const icon = document.getElementById("micBadgeIcon");
    text.textContent = t(micGranted ? "micAllowed" : "micNotAllowed");
    badge.classList.toggle("success", micGranted);
    badge.classList.toggle("neutral", !micGranted);
    icon.innerHTML = micGranted
        ? '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="8" x2="12" y2="8"/>';
}

document.getElementById("micInfoBtn").addEventListener("click", () => {
    showToast(t(micGranted ? "micInfoGranted" : "micInfoNotGranted"));
});

// ============================================================================
// Language selectors
// ============================================================================
function populateLanguageSelects() {
    const autoOption = document.createElement("option");
    autoOption.value = "auto";
    autoOption.textContent = "Auto-detect";
    sourceLanguageSelect.appendChild(autoOption);

    for (const [code, label] of LANGUAGES) {
        const src = document.createElement("option");
        src.value = code;
        src.textContent = label;
        sourceLanguageSelect.appendChild(src);

        const tgt = document.createElement("option");
        tgt.value = code;
        tgt.textContent = label;
        targetLanguageSelect.appendChild(tgt);
    }
    sourceLanguageSelect.value = "ur";
    targetLanguageSelect.value = "en";
}
populateLanguageSelects();

function updateLangPillsAndTitles() {
    const src = sourceLanguageSelect.value === "auto" ? "" : sourceLanguageSelect.value;
    const tgt = targetLanguageSelect.value;

    transcriptionLangPill.textContent = src ? langPillText(src) : "AUTO";
    translationLangPill.textContent = langPillText(tgt);

    transcriptionPanelTitle.textContent = t("transcriptionPanelTitleTpl", { lang: src ? languageName(src) : "Auto" });
    translationPanelTitle.textContent = t("translationPanelTitleTpl", { lang: languageName(tgt) });

    const srcRtl = src ? isRtl(src) : true;
    urduText.dir = srcRtl ? "rtl" : "ltr";
    urduText.classList.toggle("script-rtl", srcRtl);
    urduText.classList.toggle("script-ltr", !srcRtl);

    const tgtRtl = isRtl(tgt);
    englishText.dir = tgtRtl ? "rtl" : "ltr";
    englishText.classList.toggle("script-rtl", tgtRtl);
    englishText.classList.toggle("script-ltr", !tgtRtl);
}

function updateTranslateButtonLabel() {
    translateBtnLabel.textContent = t("translateBtnWithLang", { lang: languageName(targetLanguageSelect.value) });
}

sourceLanguageSelect.addEventListener("change", () => { updateLangPillsAndTitles(); });
targetLanguageSelect.addEventListener("change", () => { updateLangPillsAndTitles(); updateTranslateButtonLabel(); });

swapLangBtn.addEventListener("click", () => {
    if (sourceLanguageSelect.value === "auto") {
        showToast(t("swapCannotAuto"), "error");
        return;
    }
    const src = sourceLanguageSelect.value;
    const tgt = targetLanguageSelect.value;
    if (![...targetLanguageSelect.options].some((o) => o.value === src)) return;
    sourceLanguageSelect.value = tgt;
    targetLanguageSelect.value = src;
    updateLangPillsAndTitles();
    updateTranslateButtonLabel();
});

function updateTranscriptionWordCount() {
    transcriptionWordCount.textContent = t("wordCountLabel", { n: wordCount(urduText.value) });
}

function updateTranslationWordCount() {
    translationWordCount.textContent = t("wordCountLabel", { n: wordCount(englishText.value) });
}

// ============================================================================
// Mic permission
// ============================================================================
const permissionBtn = document.getElementById("permissionBtn");
permissionBtn.addEventListener("click", requestMicPermission);
startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);
pauseBtn.addEventListener("click", togglePauseRecording);

function requestMicPermission() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            stream.getTracks().forEach((track) => track.stop());
            logDebug("Permission granted");

            step1.classList.add("hidden");
            recordSection.classList.remove("hidden");
            showToast(t("micGranted"), "success");
            micGranted = true;
            renderMicBadge();
        })
        .catch(function (err) {
            logDebug("Permission error: " + err.message);
            let msg = t("micErrorGeneric");
            if (isIOS) msg += t("micErrorIOS");
            showToast(msg, "error");
            instructions.classList.remove("hidden");
            micGranted = false;
            renderMicBadge();
        });
}

// ============================================================================
// Recording timer / pause
// ============================================================================
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateRecordingTime() {
    if (!recordingStartTime) return;
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    recordingTime.textContent = formatTime(elapsedSeconds);
}

function togglePauseRecording() {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
        clearInterval(recordingTimer);
        recordingPausedAt = Date.now();
        pauseBtnLabel.textContent = t("resumeBtn");
        recordingStatus.textContent = t("statusPaused");
        stopVisualizer();
    } else if (mediaRecorder.state === "paused") {
        mediaRecorder.resume();
        recordingStartTime += Date.now() - recordingPausedAt;
        recordingTimer = setInterval(updateRecordingTime, 1000);
        pauseBtnLabel.textContent = t("pauseBtn");
        recordingStatus.textContent = t("statusRecording");
        startVisualizer(recordingStream);
    }
}

// ============================================================================
// Audio level visualizer (Web Audio API + canvas)
// ============================================================================
function startVisualizer(stream) {
    if (!visualizerCanvas || !stream) return;
    try {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const styles = getComputedStyle(document.documentElement);
        visualizerColors = {
            bg: styles.getPropertyValue("--surface-alt").trim() || "#eef1f8",
            bar: styles.getPropertyValue("--accent-teal").trim() || "#0ea5a4",
        };

        const ctx = visualizerCanvas.getContext("2d");
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            visualizerRafId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const width = visualizerCanvas.width;
            const height = visualizerCanvas.height;
            ctx.fillStyle = visualizerColors.bg;
            ctx.fillRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height;
                ctx.fillStyle = visualizerColors.bar;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
        draw();
    } catch (e) {
        logDebug("Visualizer unavailable: " + e.message);
    }
}

function stopVisualizer() {
    if (visualizerRafId) cancelAnimationFrame(visualizerRafId);
    visualizerRafId = null;
    if (visualizerCanvas) {
        const ctx = visualizerCanvas.getContext("2d");
        const bg = visualizerColors ? visualizerColors.bg : "#eef1f8";
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    }
}

// ============================================================================
// Workspace status badge
// ============================================================================
function setWorkspaceBusy(busy) {
    workspaceStatusBadge.textContent = t(busy ? "statusBusy" : "statusIdle");
    workspaceStatusBadge.classList.toggle("warning", busy);
    workspaceStatusBadge.classList.toggle("neutral", !busy);
    workspaceSubtitle.textContent = t(busy ? "workspaceSubtitleBusy" : "workspaceSubtitleIdle");
}

// ============================================================================
// Translation state
// ============================================================================
function markTranslationStale() {
    if (englishText.value.trim() !== "") {
        staleNotice.classList.remove("hidden");
    }
    copyEnglishBtn.disabled = true;
    setExportButtonsEnabled(false);
}

function clearTranslationState() {
    englishText.value = "";
    updateTranslationWordCount();
    staleNotice.classList.add("hidden");
    copyEnglishBtn.disabled = true;
    setExportButtonsEnabled(false);
}

function setExportButtonsEnabled(enabled) {
    document.getElementById("exportTxtBtn").disabled = !enabled;
    document.getElementById("exportDocxBtn").disabled = !enabled;
    document.getElementById("exportPdfBtn").disabled = !enabled;
    document.getElementById("downloadToggleBtn").disabled = !enabled;
}

function updateTranslateButtonState() {
    translateBtn.disabled = translateInFlight || transcribing || urduText.value.trim() === "";
}

urduText.addEventListener("input", function () {
    markTranslationStale();
    updateTranslateButtonState();
    updateTranscriptionWordCount();
});

// ============================================================================
// Copy buttons
// ============================================================================
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function copyToClipboard(text, button) {
    if (!text || !text.trim()) return;
    navigator.clipboard.writeText(text)
        .then(function () {
            const original = button.innerHTML;
            button.innerHTML = CHECK_ICON;
            button.classList.add("copy-success");
            setTimeout(function () {
                button.innerHTML = original;
                button.classList.remove("copy-success");
            }, 1800);
        })
        .catch(function (err) {
            logDebug("Error copying text: " + err);
            showToast(t("copyErrorToast"), "error");
        });
}

copyUrduBtn.addEventListener("click", function () {
    copyToClipboard(urduText.value, copyUrduBtn);
});

copyEnglishBtn.addEventListener("click", function () {
    if (copyEnglishBtn.disabled) return;
    copyToClipboard(englishText.value, copyEnglishBtn);
});

saveAudioBtn.addEventListener("click", function () {
    if (!currentRecordingId) return;
    const link = document.createElement("a");
    link.href = `/api/v1/recordings/${currentRecordingId}/audio`;
    link.download = `${currentRecordingId}.mp3`;
    document.body.appendChild(link);
    link.click();
    link.remove();
});

function exportCurrent(format) {
    if (!currentRecordingId) return;
    window.location.href = `/api/v1/recordings/${currentRecordingId}/export?format=${format}`;
}

// ============================================================================
// Dropdown menus (generic, works for the Live "Download" menu and the
// History detail "Download" menu)
// ============================================================================
function wireDropdown(wrapperId, toggleId, menuId, onSelectFormat) {
    const wrapper = document.getElementById(wrapperId);
    const toggle = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);

    function close() {
        menu.classList.add("hidden");
        wrapper.removeAttribute("data-open");
        toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
        if (toggle.disabled) return;
        menu.classList.remove("hidden");
        wrapper.setAttribute("data-open", "true");
        toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (menu.classList.contains("hidden")) open(); else close();
    });
    menu.querySelectorAll("button[data-format]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            close();
            onSelectFormat(btn.getAttribute("data-format"));
        });
    });
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) close();
    });
    return { close };
}

wireDropdown("downloadDropdown", "downloadToggleBtn", "downloadMenu", exportCurrent);

// ============================================================================
// Error banner / retry / technical details
// ============================================================================
function showErrorBanner(message, details) {
    translateErrorText.textContent = message;
    translateError.classList.remove("hidden");
    lastErrorDetails = details || "";
    if (lastErrorDetails) {
        techDetailsToggle.classList.remove("hidden");
        techDetails.textContent = lastErrorDetails;
    } else {
        techDetailsToggle.classList.add("hidden");
        techDetails.classList.add("hidden");
    }
}

function hideErrorBanner() {
    translateError.classList.add("hidden");
    techDetailsToggle.classList.add("hidden");
    techDetails.classList.add("hidden");
    techDetailsToggle.setAttribute("aria-expanded", "false");
    lastErrorDetails = "";
}

dismissErrorBtn.addEventListener("click", hideErrorBanner);

techDetailsToggle.addEventListener("click", () => {
    const expanded = techDetailsToggle.getAttribute("aria-expanded") === "true";
    techDetailsToggle.setAttribute("aria-expanded", String(!expanded));
    techDetails.classList.toggle("hidden", expanded);
});

retryBtn.addEventListener("click", () => {
    if (!lastFailedAction) return;
    hideErrorBanner();
    if (lastFailedAction.type === "transcribe") {
        runTranscription();
    } else if (lastFailedAction.type === "translate") {
        triggerTranslate();
    }
});

// ============================================================================
// Translate
// ============================================================================
function triggerTranslate() {
    const text = urduText.value.trim();
    if (!text || translateInFlight) return;

    translateInFlight = true;
    updateTranslateButtonState();
    translateBtn.setAttribute("aria-busy", "true");
    translateBtnLabel.textContent = t("translatingBtn");
    showToast(t("translatingStatus"));
    hideErrorBanner();

    fetch("/api/v1/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text,
            recordingId: currentRecordingId || undefined,
            sourceLanguage: sourceLanguageSelect.value === "auto" ? undefined : sourceLanguageSelect.value,
            targetLanguage: targetLanguageSelect.value,
        }),
    })
        .then(function (response) {
            return response.json().then(function (data) {
                if (!response.ok) {
                    const err = new Error(data.error || t("translationErrorToast"));
                    err.requestId = data.requestId;
                    throw err;
                }
                return data;
            });
        })
        .then(function (data) {
            englishText.value = data.translation || "";
            updateTranslationWordCount();

            if (urduText.value.trim() === text) {
                staleNotice.classList.add("hidden");
                copyEnglishBtn.disabled = !englishText.value.trim();
                setExportButtonsEnabled(Boolean(currentRecordingId && englishText.value.trim()));
                englishText.focus();
                showToast(t("translationCompleteToast"), "success");
            } else {
                markTranslationStale();
                showToast(t("translationStaleAfterArrival"));
            }
        })
        .catch(function (err) {
            logDebug("Translation error: " + err.message);
            lastFailedAction = { type: "translate" };
            showErrorBanner(t("translationErrorToast") + " " + err.message, err.requestId ? `requestId: ${err.requestId}\n${err.message}` : err.message);
            showToast(t("translationErrorToast"), "error");
        })
        .finally(function () {
            translateInFlight = false;
            translateBtn.removeAttribute("aria-busy");
            updateTranslateButtonLabel();
            updateTranslateButtonState();
        });
}

translateBtn.addEventListener("click", triggerTranslate);

// ============================================================================
// Clear
// ============================================================================
function resetWorkspaceState() {
    urduText.value = "";
    updateTranscriptionWordCount();
    currentRecordingId = null;
    saveAudioBtn.disabled = true;
    clearTranslationState();
    updateTranslateButtonState();
    hideErrorBanner();
    setWorkspaceBusy(false);
}

clearBtn.addEventListener("click", function () {
    resetWorkspaceState();
    clearPendingFile();
});

// ============================================================================
// Recording
// ============================================================================
function startRecording() {
    resetWorkspaceState();
    clearPendingFile();
    audioChunks = [];

    recordingStatus.textContent = t("statusRecording");

    navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
            channelCount: 1,
        },
    })
        .then(function (stream) {
            recordingStream = stream;

            try {
                const mimeType = getSupportedMimeType();
                const options = {
                    mimeType: mimeType || "",
                    audioBitsPerSecond: 128000,
                };
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                logDebug("Error creating MediaRecorder with options: " + e.message);
                mediaRecorder = new MediaRecorder(stream);
            }

            mediaRecorder.ondataavailable = function (event) {
                if (event.data && event.data.size > 0) {
                    logDebug("Received chunk: " + event.data.size + " bytes");
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstart = function () {
                recordingStartTime = Date.now();
                recordingTime.classList.remove("hidden");
                recordingTimer = setInterval(updateRecordingTime, 1000);
                recordingStatus.textContent = t("statusRecording");
                document.body.classList.add("recording-active");
                startBtn.classList.add("recording");
                startVisualizer(stream);
            };

            mediaRecorder.start(1000);
            logDebug("Recording started");

            startBtn.disabled = true;
            stopBtn.disabled = false;
            pauseBtn.disabled = false;
            pauseBtnLabel.textContent = t("pauseBtn");
        })
        .catch(function (err) {
            logDebug("Error starting recording: " + err.message);
            showErrorBanner(t("micErrorGeneric") + " " + err.message);
            recordingStatus.textContent = t("statusReady");
        });
}

function stopRecording() {
    if (!mediaRecorder) return;

    logDebug("Stopping recording");

    clearInterval(recordingTimer);
    recordingTime.classList.add("hidden");
    stopVisualizer();

    document.body.classList.remove("recording-active");
    startBtn.classList.remove("recording");

    mediaRecorder.onstop = function () {
        if (recordingStream) {
            recordingStream.getTracks().forEach((track) => track.stop());
            recordingStream = null;
        }

        if (audioChunks.length === 0) {
            logDebug("No audio data recorded");
            recordingStatus.textContent = t("statusNoAudio");
            startBtn.disabled = false;
            stopBtn.disabled = true;
            pauseBtn.disabled = true;
            return;
        }

        logDebug("Recording stopped, processing " + audioChunks.length + " chunks");

        if (isIOS) {
            createPendingAudioForIOS();
        } else {
            const audioType = "audio/webm";
            const fileExt = "webm";
            const audioBlob = new Blob(audioChunks, { type: audioType });

            logDebug("Created blob: " + audioBlob.size + " bytes, type: " + audioType);

            const audioFile = new File([audioBlob], `recording.${fileExt}`, {
                type: audioType,
                lastModified: Date.now(),
            });

            addPendingFile(audioFile, "recorded");
        }

        recordingStatus.textContent = t("statusReadyToTranscribe");
    };

    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    pauseBtn.disabled = true;
}

function getSupportedMimeType() {
    if (isMacSafari) {
        logDebug("macOS Safari detected, forcing audio/mp3");
        return "audio/mp3";
    }
    if (isAppleDevice) {
        const types = ["audio/aac", "audio/mp3", "audio/mpeg", "audio/mp4"];
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) return type;
        }
        return "audio/mp3";
    }

    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/mp3")) return "audio/mp3";
    if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";

    logDebug("No specific MIME type supported, using browser default");
    return "";
}

function createPendingAudioForIOS() {
    const audioType = "audio/mp3";
    const fileExt = "mp3";

    try {
        const audioBlob = new Blob(audioChunks, { type: audioType });
        logDebug("Created iOS blob: " + audioBlob.size + " bytes, type: " + audioType);

        const audioFile = new File([audioBlob], `recording.${fileExt}`, {
            type: audioType,
            lastModified: Date.now(),
        });

        addPendingFile(audioFile, "recorded");
    } catch (error) {
        logDebug("Error creating iOS audio file: " + error.message);
        showErrorBanner("Error creating the audio file: " + error.message);
    }
}

// ============================================================================
// Upload (file picker + drag & drop) - staged locally, not sent until the
// user presses "Transcribe audio"
// ============================================================================
audioFileInput.addEventListener("change", function () {
    const file = audioFileInput.files && audioFileInput.files[0];
    if (file) {
        addPendingFile(file, "uploaded");
        audioFileInput.value = "";
    }
});

["dragenter", "dragover"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
    });
});
["dragleave", "drop"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
    });
});
dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) addPendingFile(file, "uploaded");
});
dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        audioFileInput.click();
    }
});

function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatLabelFromFile(file) {
    const ext = (file.name.split(".").pop() || "").toUpperCase();
    return ext || (file.type.split("/")[1] || "").toUpperCase();
}

const MUSIC_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
const X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
const DOWNLOAD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

// Converts the given (possibly webm/ogg/whatever-the-browser-recorded) file
// to a real MP3 via the server's ffmpeg pipeline and downloads the result -
// no transcription, no persistence, just a format-normalized local save.
async function downloadAsMp3(file, source, button) {
    const originalHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span>';

    try {
        const formData = new FormData();
        if (isIOS) formData.append("device", "ios");
        else if (isMacOS) formData.append("device", "macos");
        else if (isAndroid) formData.append("device", "android");
        formData.append("source", source);
        formData.append("file", file);

        const response = await fetch("/api/v1/audio/mp3", { method: "POST", body: formData });
        if (!response.ok) {
            let message = t("mp3ConvertFailed");
            try {
                const data = await response.json();
                if (data.error) message = data.error;
            } catch (e) { /* non-JSON error body, keep the generic message */ }
            throw new Error(message);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = (file.name ? file.name.replace(/\.[^./]+$/, "") : "recording") + ".mp3";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (err) {
        logDebug("MP3 download error: " + err.message);
        showToast(t("mp3DownloadError", { msg: err.message }), "error");
    } finally {
        button.disabled = false;
        button.innerHTML = originalHtml;
    }
}

let currentFileItemEl = null;

function clearPendingFile() {
    pendingFile = null;
    // Only one of the two ever holds content at a time (recording vs.
    // upload are mutually exclusive pending states), so clearing both is
    // simpler and just as correct as tracking which one was used.
    uploadFileList.innerHTML = "";
    recordFileList.innerHTML = "";
    currentFileItemEl = null;
    transcribeManualBtn.disabled = true;
}

function addPendingFile(file, source) {
    resetWorkspaceState();
    pendingFile = { file, source };
    uploadFileList.innerHTML = "";
    recordFileList.innerHTML = "";

    // A recording's result belongs in the Record card, right where it was
    // made; an uploaded file's result belongs in the Upload card.
    const targetList = source === "recorded" ? recordFileList : uploadFileList;

    const item = document.createElement("div");
    item.className = "upload-file-item";
    item.innerHTML = `
        <span class="upload-file-icon" aria-hidden="true">${MUSIC_ICON}</span>
        <span class="upload-file-info">
            <span class="upload-file-name"></span>
            <span class="upload-file-meta"></span>
        </span>
        <progress class="upload-progress" value="0" max="100"></progress>
        <span class="upload-percent">0%</span>
        <button type="button" class="icon-btn-tiny upload-download" aria-label="${t("downloadRecordingAria")}">${DOWNLOAD_ICON}</button>
        <button type="button" class="icon-btn-tiny upload-remove" aria-label="${t("removeFileAria")}">${X_ICON}</button>
    `;
    item.querySelector(".upload-file-name").textContent = file.name;
    item.querySelector(".upload-file-meta").textContent = `${formatBytes(file.size)} • ${formatLabelFromFile(file)}`;
    targetList.appendChild(item);
    currentFileItemEl = item;

    item.querySelector(".upload-download").addEventListener("click", (e) => {
        downloadAsMp3(file, source, e.currentTarget);
    });

    item.querySelector(".upload-remove").addEventListener("click", () => {
        clearPendingFile();
        resetWorkspaceState();
    });

    animateFileItemProgress(item, 0, 100, 350, () => {
        item.classList.add("is-done");
    });

    transcribeManualBtn.disabled = false;
}

function animateFileItemProgress(item, from, to, durationMs, onDone) {
    const progressEl = item.querySelector(".upload-progress");
    const percentEl = item.querySelector(".upload-percent");
    const start = performance.now();
    function step(now) {
        const elapsed = now - start;
        const pct = Math.min(to, from + ((to - from) * Math.min(1, elapsed / durationMs)));
        progressEl.value = pct;
        percentEl.textContent = `${Math.round(pct)}%`;
        if (pct < to) {
            requestAnimationFrame(step);
        } else if (onDone) {
            onDone();
        }
    }
    requestAnimationFrame(step);
}

function setFileItemProgress(item, pct) {
    if (!item) return;
    const progressEl = item.querySelector(".upload-progress");
    const percentEl = item.querySelector(".upload-percent");
    progressEl.value = pct;
    percentEl.textContent = `${Math.round(pct)}%`;
}

function setFileItemError(item) {
    if (!item) return;
    item.classList.remove("is-done");
    item.classList.add("is-error");
}

// ============================================================================
// Transcription (real network call, triggered by "Transcribe audio")
// ============================================================================
function uploadRecordingXHR(file, source, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1/transcribe");
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            let data = {};
            try { data = JSON.parse(xhr.responseText); } catch (e) { /* ignore parse error, handled below */ }
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(data);
            } else {
                const err = new Error(data.error || `Server error (${xhr.status})`);
                err.requestId = data.requestId;
                err.status = xhr.status;
                reject(err);
            }
        };
        xhr.onerror = () => reject(new Error("Network error while uploading."));

        const formData = new FormData();
        if (isIOS) formData.append("device", "ios");
        else if (isMacOS) formData.append("device", "macos");
        else if (isAndroid) formData.append("device", "android");
        formData.append("source", source);
        if (sourceLanguageSelect.value) formData.append("language", sourceLanguageSelect.value);
        formData.append("file", file);

        xhr.send(formData);
    });
}

function runTranscription() {
    if (!pendingFile || transcribing) return;
    let { file, source } = pendingFile;

    if (isMacSafari && file.type === "audio/webm") {
        const newFileName = file.name.replace(".webm", ".mp3");
        file = new File([file], newFileName, { type: "audio/mp3", lastModified: Date.now() });
    }

    transcribing = true;
    hideErrorBanner();
    transcribeManualBtn.disabled = true;
    transcribeManualBtn.querySelector("span[data-i18n], span:not([aria-hidden])").textContent = t("transcribingBtn");
    setWorkspaceBusy(true);
    showToast(t("transcribingStatus"));

    if (currentFileItemEl) {
        currentFileItemEl.classList.remove("is-done", "is-error");
        setFileItemProgress(currentFileItemEl, 0);
    }

    uploadRecordingXHR(file, source, (pct) => setFileItemProgress(currentFileItemEl, pct))
        .then(function (data) {
            urduText.value = data.text || "";
            updateTranscriptionWordCount();
            currentRecordingId = data.recordingId || null;
            saveAudioBtn.disabled = !currentRecordingId;
            if (data.language) {
                sourceLanguageSelect.value = data.language;
                updateLangPillsAndTitles();
            }
            if (currentFileItemEl) {
                setFileItemProgress(currentFileItemEl, 100);
                currentFileItemEl.classList.add("is-done");
            }
            if (!data.text || !data.text.trim()) {
                urduText.placeholder = t("noSpeechPlaceholder");
            } else {
                showToast(t("transcriptionCompleteToast"), "success");
            }
        })
        .catch(function (error) {
            logDebug("Transcription error: " + error.message);
            lastFailedAction = { type: "transcribe" };
            showErrorBanner(t("transcriptionErrorToast") + " " + error.message, error.requestId ? `requestId: ${error.requestId}\nstatus: ${error.status}\n${error.message}` : error.message);
            setFileItemError(currentFileItemEl);
            showToast(t("transcriptionErrorToast"), "error");
        })
        .finally(function () {
            transcribing = false;
            setWorkspaceBusy(false);
            transcribeManualBtn.disabled = !pendingFile;
            transcribeManualBtn.querySelector("span[data-i18n], span:not([aria-hidden])").textContent = t("transcribeBtn");
            updateTranslateButtonState();
        });
}

transcribeManualBtn.addEventListener("click", runTranscription);

if (isIOS) {
    document.addEventListener("touchstart", function () {
        // Empty handler; helps initialize audio playback/recording on iOS.
    }, { once: true });
}

// ============================================================================
// History
// ============================================================================
let historyPage = 1;
const historyPageSize = 10;

const historyFiltersForm = document.getElementById("historyFilters");
const historyQuery = document.getElementById("historyQuery");
const historySourceType = document.getElementById("historySourceType");
const historyStatusFilter = document.getElementById("historyStatus");
const historyDateFrom = document.getElementById("historyDateFrom");
const historyDateTo = document.getElementById("historyDateTo");
const historyStatusText = document.getElementById("historyStatus2");
const historyTable = document.getElementById("historyTable");
const historyTableBody = document.getElementById("historyTableBody");
const historyCardList = document.getElementById("historyCardList");
const historyEmpty = document.getElementById("historyEmpty");
const historyPrevBtn = document.getElementById("historyPrevBtn");
const historyNextBtn = document.getElementById("historyNextBtn");
const historyPageInfo = document.getElementById("historyPageInfo");
const historyPageNumbers = document.getElementById("historyPageNumbers");
const historyDetailOverlay = document.getElementById("historyDetailOverlay");
const historyDetailClose = document.getElementById("historyDetailClose");
const historyAudioPlayer = document.getElementById("historyAudioPlayer");
const historyTranscriptionText = document.getElementById("historyTranscriptionText");
const historyTranslationText = document.getElementById("historyTranslationText");
const historyDeleteBtn = document.getElementById("historyDeleteBtn");
const filtersToggleBtn = document.getElementById("filtersToggleBtn");
const filtersCollapse = document.getElementById("filtersCollapse");
const filtersBadge = document.getElementById("filtersBadge");
const filtersCount = document.getElementById("filtersCount");
const historyClearBtn = document.getElementById("historyClearBtn");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");

function statusLabel(status) {
    return t("status" + status.charAt(0).toUpperCase() + status.slice(1));
}

function activeFilterCount() {
    let n = 0;
    if (historySourceType.value) n++;
    if (historyStatusFilter.value) n++;
    if (historyDateFrom.value) n++;
    if (historyDateTo.value) n++;
    return n;
}

function updateFiltersBadge() {
    const n = activeFilterCount();
    filtersCount.textContent = String(n);
    filtersBadge.classList.toggle("hidden", n === 0);
}

filtersToggleBtn.addEventListener("click", () => {
    const open = filtersCollapse.classList.toggle("open");
    filtersToggleBtn.setAttribute("aria-expanded", String(open));
});

function currentFilterParams(extra) {
    const params = new URLSearchParams(extra || {});
    if (historyQuery.value.trim()) params.set("q", historyQuery.value.trim());
    if (historySourceType.value) params.set("sourceType", historySourceType.value);
    if (historyStatusFilter.value) params.set("status", historyStatusFilter.value);
    if (historyDateFrom.value) params.set("dateFrom", historyDateFrom.value);
    if (historyDateTo.value) params.set("dateTo", historyDateTo.value);
    return params;
}

function loadHistory() {
    historyStatusText.textContent = t("historyLoading");
    updateFiltersBadge();
    const params = currentFilterParams({ page: historyPage, pageSize: historyPageSize });

    fetch("/api/v1/recordings?" + params.toString())
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || "Error");
            return data;
        }))
        .then((data) => renderHistory(data))
        .catch((err) => {
            historyStatusText.textContent = "";
            showToast(t("historyLoadError", { msg: err.message }), "error");
        });
}

function loadStats() {
    const base = currentFilterParams({ page: 1, pageSize: 1 });
    const completed = currentFilterParams({ page: 1, pageSize: 1 });
    completed.set("status", "completed");
    const failed = currentFilterParams({ page: 1, pageSize: 1 });
    failed.set("status", "failed");

    Promise.all([
        fetch("/api/v1/recordings?" + base.toString()).then((r) => r.json()),
        fetch("/api/v1/recordings?" + completed.toString()).then((r) => r.json()),
        fetch("/api/v1/recordings?" + failed.toString()).then((r) => r.json()),
    ]).then(([totalData, completedData, failedData]) => {
        document.getElementById("statTotal").textContent = totalData.total || 0;
        document.getElementById("statCompleted").textContent = completedData.total || 0;
        document.getElementById("statFailed").textContent = failedData.total || 0;
    }).catch(() => { /* stats are a nice-to-have; ignore failures silently */ });
}

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>';
const TRASH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';
const FILE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
const STATUS_ICONS = {
    completed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    failed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
}

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return "—";
    return formatTime(Math.round(seconds));
}

function formatLanguagesCell(item) {
    const src = item.sourceLanguage ? item.sourceLanguage.toUpperCase() : "?";
    const tgt = item.targetLanguage ? item.targetLanguage.toUpperCase() : "—";
    return `${src} → ${tgt}`;
}

function renderHistory(data) {
    historyStatusText.textContent = "";
    historyTableBody.innerHTML = "";
    historyCardList.innerHTML = "";

    if (!data.items || data.items.length === 0) {
        historyTable.classList.add("hidden");
        historyCardList.classList.add("hidden");
        historyEmpty.classList.remove("hidden");
    } else {
        historyEmpty.classList.add("hidden");
        historyTable.classList.remove("hidden");
        historyCardList.classList.remove("hidden");

        for (const item of data.items) {
            historyTableBody.appendChild(buildTableRow(item));
            historyCardList.appendChild(buildCard(item));
        }
    }

    const total = data.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / data.pageSize));
    const from = total === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
    const to = Math.min(total, data.page * data.pageSize);
    historyPageInfo.textContent = total === 0 ? t("showingNone") : t("showingRangeTpl", { from, to, total });
    historyPrevBtn.disabled = data.page <= 1;
    historyNextBtn.disabled = data.page >= totalPages;
    renderPageNumbers(data.page, totalPages);
}

function renderPageNumbers(current, total) {
    historyPageNumbers.innerHTML = "";
    const pages = [];
    const push = (p) => { if (!pages.includes(p)) pages.push(p); };
    push(1);
    for (let p = current - 1; p <= current + 1; p++) if (p > 1 && p < total) push(p);
    if (total > 1) push(total);
    pages.sort((a, b) => a - b);

    let prev = 0;
    for (const p of pages) {
        if (p - prev > 1) {
            const gap = document.createElement("span");
            gap.textContent = "…";
            historyPageNumbers.appendChild(gap);
        }
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = String(p);
        if (p === current) btn.classList.add("active");
        btn.addEventListener("click", () => { historyPage = p; loadHistory(); });
        historyPageNumbers.appendChild(btn);
        prev = p;
    }
}

function buildTableRow(item) {
    const tr = document.createElement("tr");
    tr.tabIndex = 0;
    tr.setAttribute("role", "button");
    const name = item.originalFilename || t("untitled");
    tr.innerHTML = `
        <td>
            <div class="rec-file-cell">
                <span class="rec-file-icon" aria-hidden="true">${FILE_ICON}</span>
                <div>
                    <div class="rec-file-name"></div>
                    <div class="rec-file-meta">${escapeHtml((item.mimeType || "").split("/")[1] || "")}${item.fileSizeBytes ? " • " + formatBytes(item.fileSizeBytes) : ""}</div>
                </div>
            </div>
        </td>
        <td><span class="source-pill ${item.sourceType}">${t(item.sourceType === "recorded" ? "sourceRecorded" : "sourceUploaded")}</span></td>
        <td>${formatDuration(item.durationSeconds)}</td>
        <td>${formatLanguagesCell(item)}</td>
        <td>${new Date(item.createdAt).toLocaleString()}</td>
        <td><span class="status-pill ${item.status}">${STATUS_ICONS[item.status] || ""}${statusLabel(item.status)}</span></td>
        <td>
            <div class="row-actions">
                <button type="button" class="icon-btn row-play-btn" aria-label="Open">${PLAY_ICON}</button>
                <button type="button" class="icon-btn row-delete-btn" aria-label="Delete">${TRASH_ICON}</button>
            </div>
        </td>
    `;
    tr.querySelector(".rec-file-name").textContent = name;
    tr.addEventListener("click", () => openHistoryDetail(item.id));
    tr.addEventListener("keydown", (e) => { if (e.key === "Enter") openHistoryDetail(item.id); });
    tr.querySelector(".row-play-btn").addEventListener("click", (e) => { e.stopPropagation(); openHistoryDetail(item.id); });
    tr.querySelector(".row-delete-btn").addEventListener("click", (e) => { e.stopPropagation(); quickDelete(item.id); });
    return tr;
}

function buildCard(item) {
    const card = document.createElement("div");
    card.className = "history-item-card";
    const name = item.originalFilename || t("untitled");
    card.innerHTML = `
        <div class="history-item-top">
            <span class="rec-file-icon" aria-hidden="true">${FILE_ICON}</span>
            <div class="history-item-info">
                <div class="history-item-name"></div>
                <div class="history-item-meta">${escapeHtml((item.mimeType || "").split("/")[1] || "")}${item.fileSizeBytes ? " • " + formatBytes(item.fileSizeBytes) : ""}</div>
            </div>
            <div class="row-actions">
                <button type="button" class="icon-btn row-play-btn" aria-label="Open">${PLAY_ICON}</button>
                <button type="button" class="icon-btn row-delete-btn" aria-label="Delete">${TRASH_ICON}</button>
            </div>
        </div>
        <div class="history-item-badges">
            <span class="source-pill ${item.sourceType}">${t(item.sourceType === "recorded" ? "sourceRecorded" : "sourceUploaded")}</span>
            <span class="status-pill ${item.status}">${STATUS_ICONS[item.status] || ""}${statusLabel(item.status)}</span>
        </div>
        <div class="history-item-bottom">
            <span>${formatDuration(item.durationSeconds)}</span>
            <span class="sep">•</span>
            <span>${formatLanguagesCell(item)}</span>
            <span class="sep">•</span>
            <span>${new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
    `;
    card.querySelector(".history-item-name").textContent = name;
    card.addEventListener("click", () => openHistoryDetail(item.id));
    card.querySelector(".row-play-btn").addEventListener("click", (e) => { e.stopPropagation(); openHistoryDetail(item.id); });
    card.querySelector(".row-delete-btn").addEventListener("click", (e) => { e.stopPropagation(); quickDelete(item.id); });
    return card;
}

function quickDelete(id) {
    if (!window.confirm(t("deleteConfirm"))) return;
    fetch(`/api/v1/recordings/${id}`, { method: "DELETE" })
        .then((res) => {
            if (!res.ok && res.status !== 204) throw new Error("Delete failed");
            showToast(t("deletedToast"), "success");
            loadHistory();
            loadStats();
        })
        .catch((err) => showToast(t("deleteError", { msg: err.message }), "error"));
}

historyFiltersForm.addEventListener("submit", (e) => {
    e.preventDefault();
    historyPage = 1;
    loadHistory();
    loadStats();
});
historyClearBtn.addEventListener("click", () => {
    historyQuery.value = "";
    historySourceType.value = "";
    historyStatusFilter.value = "";
    historyDateFrom.value = "";
    historyDateTo.value = "";
    historyPage = 1;
    loadHistory();
    loadStats();
});
historyPrevBtn.addEventListener("click", () => { historyPage = Math.max(1, historyPage - 1); loadHistory(); });
historyNextBtn.addEventListener("click", () => { historyPage += 1; loadHistory(); });

let openRecordingId = null;

function openHistoryDetail(id) {
    fetch(`/api/v1/recordings/${id}`)
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || "Error");
            return data;
        }))
        .then((rec) => {
            openRecordingId = rec.id;
            historyAudioPlayer.src = `/api/v1/recordings/${rec.id}/audio`;
            historyTranscriptionText.value = rec.transcriptionText || "";
            historyTranslationText.value = rec.translationText || "";
            historyDetailOverlay.classList.remove("hidden");
        })
        .catch((err) => showToast(t("detailLoadError", { msg: err.message }), "error"));
}

function closeHistoryDetail() {
    historyDetailOverlay.classList.add("hidden");
    historyAudioPlayer.pause();
    historyAudioPlayer.src = "";
    openRecordingId = null;
}

historyDetailClose.addEventListener("click", closeHistoryDetail);
historyDetailOverlay.addEventListener("click", (e) => {
    if (e.target === historyDetailOverlay) closeHistoryDetail();
});

wireDropdown("historyExportDropdown", "historyExportToggleBtn", "historyExportMenu", (format) => {
    if (openRecordingId) window.location.href = `/api/v1/recordings/${openRecordingId}/export?format=${format}`;
});

historyDeleteBtn.addEventListener("click", () => {
    if (!openRecordingId) return;
    if (!window.confirm(t("deleteConfirm"))) return;

    fetch(`/api/v1/recordings/${openRecordingId}`, { method: "DELETE" })
        .then((res) => {
            if (!res.ok && res.status !== 204) throw new Error("Delete failed");
            showToast(t("deletedToast"), "success");
            closeHistoryDetail();
            loadHistory();
            loadStats();
        })
        .catch((err) => showToast(t("deleteError", { msg: err.message }), "error"));
});

// Export the currently filtered history as a CSV (client-side; no server
// endpoint needed since it's just the already-visible metadata).
exportHistoryBtn.addEventListener("click", () => {
    const params = currentFilterParams({ page: 1, pageSize: 1000 });
    fetch("/api/v1/recordings?" + params.toString())
        .then((res) => res.json())
        .then((data) => {
            if (!data.items || data.items.length === 0) {
                showToast(t("exportHistoryEmpty"), "error");
                return;
            }
            const header = ["ID", "Filename", "Source", "Duration (s)", "Source language", "Target language", "Status", "Created at"];
            const rows = data.items.map((item) => [
                item.id,
                item.originalFilename || "",
                item.sourceType,
                item.durationSeconds != null ? item.durationSeconds.toFixed(1) : "",
                item.sourceLanguage || "",
                item.targetLanguage || "",
                item.status,
                item.createdAt,
            ]);
            const csv = [header, ...rows]
                .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                .join("\r\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "recording-history.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        })
        .catch((err) => showToast(t("historyLoadError", { msg: err.message }), "error"));
});

// ============================================================================
// Workspace mobile tab switcher (Urdu transcription / English translation)
// ============================================================================
const workspacePanels = document.getElementById("workspacePanels");
const workspaceTabTranscription = document.getElementById("workspaceTabTranscription");
const workspaceTabTranslation = document.getElementById("workspaceTabTranslation");

function setWorkspaceTab(name) {
    workspacePanels.setAttribute("data-active", name);
    workspaceTabTranscription.classList.toggle("active", name === "transcription");
    workspaceTabTranslation.classList.toggle("active", name === "translation");
    workspaceTabTranscription.setAttribute("aria-selected", String(name === "transcription"));
    workspaceTabTranslation.setAttribute("aria-selected", String(name === "translation"));
}
workspaceTabTranscription.addEventListener("click", () => setWorkspaceTab("transcription"));
workspaceTabTranslation.addEventListener("click", () => setWorkspaceTab("translation"));

function renderWorkspaceTabLabels() {
    const src = sourceLanguageSelect.value === "auto" ? "" : sourceLanguageSelect.value;
    const tgt = targetLanguageSelect.value;
    workspaceTabTranscription.textContent = t("transcriptionPanelTitleTpl", { lang: src ? languageName(src) : "Auto" });
    workspaceTabTranslation.textContent = t("translationPanelTitleTpl", { lang: languageName(tgt) });
}
sourceLanguageSelect.addEventListener("change", renderWorkspaceTabLabels);
targetLanguageSelect.addEventListener("change", renderWorkspaceTabLabels);

// ============================================================================
// Init
// ============================================================================
(function init() {
    try {
        const savedLang = localStorage.getItem("urduapp.uiLang");
        interfaceLang = savedLang === "ur" ? "ur" : "en";
    } catch (e) { interfaceLang = "en"; }

    applyI18n();
    renderThemeToggle();
    renderWorkspaceTabLabels();
    updateTranscriptionWordCount();
    updateTranslationWordCount();
    updateTranslateButtonState();
})();
