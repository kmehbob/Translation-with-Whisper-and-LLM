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
        inputModeRecord: "Record",
        inputModeUpload: "Upload",
        recordCardTitle: "Record audio",
        startRecordingLabel: "Start recording",
        visualizerIdleHint: "Audio levels will appear here",
        maxRecordingLengthReached: "Maximum recording length reached — recording stopped automatically.",
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
        renameAudioAria: "Rename",
        closeAria: "Close",
        openAria: "Open",
        deleteAria: "Delete",
        selectAllAria: "Select all",
        selectRecordingAria: "Select recording",
        modalCancel: "Cancel",
        modalConfirm: "OK",
        modalConfirmTitle: "Confirm",
        modalDeleteTitle: "Delete recording",
        modalDeleteConfirm: "Delete",
        renamePrompt: "Rename this recording",
        renameSuccess: "Recording renamed.",
        renameError: "Could not rename: {msg}",
        restoreForPeriod: "Restore deleted for this period",
        restoreSuccess: "{n} recording(s) restored.",
        restoreNone: "No deleted recordings found in that period.",
        restoreError: "Could not restore: {msg}",
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
        copyErrorToast: "Could not copy text.",
        modeEdit: "Edit",
        modeCopy: "Copy",
        copyModeHint: "Click the text to copy it",
        fieldCopiedToast: "Copied to clipboard.",
        timeJustNow: "Just now",
        timeMinuteAgo: "1 minute ago",
        timeMinutesAgo: "{n} minutes ago",
        timeHourAgo: "1 hour ago",
        timeHoursAgo: "{n} hours ago",
        timeDayAgo: "1 day ago",
        timeDaysAgo: "{n} days ago",
        timeWeekAgo: "1 week ago",
        timeWeeksAgo: "{n} weeks ago",
        timeMonthAgo: "1 month ago",
        timeMonthsAgo: "{n} months ago",
        timeYearAgo: "1 year ago",
        timeYearsAgo: "{n} years ago",
        autoDetectOption: "Auto-detect",
        autoLangLabel: "Auto",
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
        untitled: "(untitled)",
        exportHistoryEmpty: "No recordings to export.",
        bulkSelectedCount: "{n} selected",
        bulkClearSelection: "Clear selection",
        bulkDeleteSelected: "Delete selected",
        bulkDeleteConfirm: "Delete {n} selected recording(s)? This cannot be undone.",
        bulkDeleteSuccess: "{n} recording(s) deleted.",
        bulkDeletePartial: "{succeeded} deleted, {failed} failed.",
        downloadAudioAria: "Download audio",
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
        inputModeRecord: "ریکارڈ",
        inputModeUpload: "اپ لوڈ",
        recordCardTitle: "ریکارڈنگ",
        startRecordingLabel: "ریکارڈنگ شروع کریں",
        visualizerIdleHint: "آڈیو لیول یہاں ظاہر ہوں گے",
        maxRecordingLengthReached: "ریکارڈنگ کی زیادہ سے زیادہ حد مکمل ہو گئی — ریکارڈنگ خودکار طور پر رک گئی۔",
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
        renameAudioAria: "نام تبدیل کریں",
        closeAria: "بند کریں",
        openAria: "کھولیں",
        deleteAria: "حذف کریں",
        selectAllAria: "سب منتخب کریں",
        selectRecordingAria: "ریکارڈنگ منتخب کریں",
        modalCancel: "منسوخ کریں",
        modalConfirm: "ٹھیک ہے",
        modalConfirmTitle: "تصدیق کریں",
        modalDeleteTitle: "ریکارڈنگ حذف کریں",
        modalDeleteConfirm: "حذف کریں",
        renamePrompt: "اس ریکارڈنگ کا نام تبدیل کریں",
        renameSuccess: "ریکارڈنگ کا نام تبدیل کر دیا گیا۔",
        renameError: "نام تبدیل نہیں ہو سکا: {msg}",
        restoreForPeriod: "اس مدت کی حذف شدہ ریکارڈنگز بحال کریں",
        restoreSuccess: "{n} ریکارڈنگز بحال کر دی گئیں۔",
        restoreNone: "اس مدت میں کوئی حذف شدہ ریکارڈنگ نہیں ملی۔",
        restoreError: "بحال نہیں ہو سکا: {msg}",
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
        copyErrorToast: "متن کاپی کرنے میں خرابی۔",
        modeEdit: "ترمیم",
        modeCopy: "کاپی",
        copyModeHint: "کاپی کرنے کے لیے متن پر کلک کریں",
        fieldCopiedToast: "کلپ بورڈ پر کاپی ہو گیا۔",
        timeJustNow: "ابھی ابھی",
        timeMinuteAgo: "1 منٹ پہلے",
        timeMinutesAgo: "{n} منٹ پہلے",
        timeHourAgo: "1 گھنٹہ پہلے",
        timeHoursAgo: "{n} گھنٹے پہلے",
        timeDayAgo: "1 دن پہلے",
        timeDaysAgo: "{n} دن پہلے",
        timeWeekAgo: "1 ہفتہ پہلے",
        timeWeeksAgo: "{n} ہفتے پہلے",
        timeMonthAgo: "1 مہینہ پہلے",
        timeMonthsAgo: "{n} مہینے پہلے",
        timeYearAgo: "1 سال پہلے",
        timeYearsAgo: "{n} سال پہلے",
        autoDetectOption: "خودکار شناخت",
        autoLangLabel: "خودکار",
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
        untitled: "(بلا عنوان)",
        exportHistoryEmpty: "ایکسپورٹ کے لیے کوئی ریکارڈنگ نہیں۔",
        bulkSelectedCount: "{n} منتخب",
        bulkClearSelection: "انتخاب صاف کریں",
        bulkDeleteSelected: "منتخب حذف کریں",
        bulkDeleteConfirm: "کیا آپ {n} منتخب ریکارڈنگز حذف کرنا چاہتے ہیں؟ اسے واپس نہیں لیا جا سکتا۔",
        bulkDeleteSuccess: "{n} ریکارڈنگز حذف کر دی گئیں۔",
        bulkDeletePartial: "{succeeded} حذف ہوئیں، {failed} ناکام رہیں۔",
        downloadAudioAria: "آڈیو ڈاؤن لوڈ کریں",
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
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
    });

    document.getElementById("uiLangEnBtn").classList.toggle("active", interfaceLang === "en");
    document.getElementById("uiLangEnBtn").setAttribute("aria-pressed", String(interfaceLang === "en"));
    document.getElementById("uiLangUrBtn").classList.toggle("active", interfaceLang === "ur");
    document.getElementById("uiLangUrBtn").setAttribute("aria-pressed", String(interfaceLang === "ur"));

    // The [data-i18n] sweep above always writes the idle "Transcribe audio"
    // label, even mid-transcription - restore the busy label immediately
    // after if a transcription is still running.
    if (transcribing) {
        transcribeManualBtn.querySelector("span[data-i18n], span:not([aria-hidden])").textContent = t("transcribingBtn");
    }

    renderMicBadge();
    updateLangPillsAndTitles();
    updateTranslateButtonLabel();
    renderWorkspaceTabLabels();
    updateTranscriptionWordCount();
    updateTranslationWordCount();

    // Table/card rows bake translated text (source, status, relative time)
    // in at build time, so a language switch while History is already open
    // needs a rebuild - otherwise rows stay in whatever language they were
    // last rendered in until the next unrelated refresh.
    if (!tabHistory.classList.contains("hidden")) {
        loadHistory();
    }
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
const inputModeRecordBtn = document.getElementById("inputModeRecordBtn");
const inputModeUploadBtn = document.getElementById("inputModeUploadBtn");
const recordModePanel = document.getElementById("recordModePanel");
const uploadModePanel = document.getElementById("uploadModePanel");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const pauseBtnLabel = document.getElementById("pauseBtnLabel");
const pauseBtnIcon = document.getElementById("pauseBtnIcon");
const stopBtn = document.getElementById("stopBtn");
const urduText = document.getElementById("urduText");
const englishText = document.getElementById("englishText");
const copyUrduBtn = document.getElementById("copyUrduBtn");
const copyEnglishBtn = document.getElementById("copyEnglishBtn");
const transcriptionModeEditBtn = document.getElementById("transcriptionModeEditBtn");
const transcriptionModeCopyBtn = document.getElementById("transcriptionModeCopyBtn");
const transcriptionCopyHint = document.getElementById("transcriptionCopyHint");
const translationCopyHint = document.getElementById("translationCopyHint");
const saveAudioBtn = document.getElementById("saveAudioBtn");
const translateBtn = document.getElementById("translateBtn");
const translateBtnLabel = document.getElementById("translateBtnLabel");
const translateError = document.getElementById("translateError");
const translateErrorText = document.getElementById("translateErrorText");
const staleNotice = document.getElementById("staleNotice");
const recordingStatus = document.getElementById("recordingStatus");
const recordingTime = document.getElementById("recordingTime");
const recordProgress = document.getElementById("recordProgress");
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
// Modal dialogs (replaces native window.confirm/window.prompt)
// ============================================================================
const appModalOverlay = document.getElementById("appModalOverlay");
const appModal = document.getElementById("appModal");
const appModalTitle = document.getElementById("appModalTitle");
const appModalMessage = document.getElementById("appModalMessage");
const appModalInputWrap = document.getElementById("appModalInputWrap");
const appModalInput = document.getElementById("appModalInput");
const appModalInputLabel = document.getElementById("appModalInputLabel");
const appModalCancelBtn = document.getElementById("appModalCancelBtn");
const appModalConfirmBtn = document.getElementById("appModalConfirmBtn");

let activeModalResolve = null;
let modalPreviousFocus = null;

function openModal({ title, message, danger = false, showInput = false, inputValue = "", confirmLabel, cancelLabel }) {
    return new Promise((resolve) => {
        activeModalResolve = resolve;
        modalPreviousFocus = document.activeElement;

        appModalTitle.textContent = title || "";
        appModalMessage.textContent = message || "";
        appModal.classList.toggle("is-danger", !!danger);
        appModalInputWrap.classList.toggle("hidden", !showInput);
        appModalInput.value = showInput ? inputValue || "" : "";
        appModalConfirmBtn.textContent = confirmLabel || t("modalConfirm");
        appModalCancelBtn.textContent = cancelLabel || t("modalCancel");

        appModalOverlay.classList.remove("hidden");
        document.addEventListener("keydown", handleModalKeydown, true);

        if (showInput) {
            appModalInput.focus();
            appModalInput.select();
        } else {
            appModalConfirmBtn.focus();
        }
    });
}

function closeModal(result) {
    appModalOverlay.classList.add("hidden");
    document.removeEventListener("keydown", handleModalKeydown, true);
    const resolve = activeModalResolve;
    activeModalResolve = null;
    if (modalPreviousFocus && typeof modalPreviousFocus.focus === "function") {
        modalPreviousFocus.focus();
    }
    modalPreviousFocus = null;
    if (resolve) resolve(result);
}

function getModalFocusable() {
    const items = [appModalCancelBtn, appModalConfirmBtn];
    if (!appModalInputWrap.classList.contains("hidden")) items.unshift(appModalInput);
    return items;
}

function handleModalKeydown(event) {
    if (event.key === "Escape") {
        event.preventDefault();
        closeModal(appModalInputWrap.classList.contains("hidden") ? false : null);
        return;
    }
    // Trap Tab inside the dialog - aria-modal="true" implies background
    // content is inert, but without this a sighted keyboard user could still
    // Tab straight past the dialog into it.
    if (event.key === "Tab") {
        const focusable = getModalFocusable();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
        return;
    }
    if (event.key === "Enter" && document.activeElement !== appModalCancelBtn) {
        event.preventDefault();
        appModalConfirmBtn.click();
    }
}

appModalCancelBtn.addEventListener("click", () => {
    closeModal(appModalInputWrap.classList.contains("hidden") ? false : null);
});
appModalConfirmBtn.addEventListener("click", () => {
    if (!appModalInputWrap.classList.contains("hidden")) {
        closeModal(appModalInput.value);
    } else {
        closeModal(true);
    }
});
appModalOverlay.addEventListener("click", (event) => {
    if (event.target === appModalOverlay) {
        closeModal(appModalInputWrap.classList.contains("hidden") ? false : null);
    }
});

function confirmDialog(message, { title, danger = false, confirmLabel, cancelLabel } = {}) {
    return openModal({
        title: title || t("modalConfirmTitle"),
        message,
        danger,
        showInput: false,
        confirmLabel,
        cancelLabel,
    }).then((result) => result === true);
}

function promptDialog(message, defaultValue = "", { title, label } = {}) {
    appModalInputLabel.textContent = label || message || "";
    return openModal({
        title: title || t("modalConfirmTitle"),
        message,
        showInput: true,
        inputValue: defaultValue,
    }).then((result) => (typeof result === "string" ? result : null));
}

// ============================================================================
// Tabs
// ============================================================================
// Roving tabindex for role="tablist" widgets per the WAI-ARIA tabs pattern:
// only the active tab is in the Tab order (tabindex 0), the rest are -1, and
// arrow/Home/End keys move focus *and* activate (this app's tabs already
// activate on click, so keyboard nav matches that same immediate behavior).
function syncTabIndexes(tabs) {
    tabs.forEach((tab) => { tab.tabIndex = tab.classList.contains("active") ? 0 : -1; });
}

function wireRovingTablist(tabs, activateFn) {
    syncTabIndexes(tabs);
    tabs.forEach((tab, index) => {
        tab.addEventListener("keydown", (e) => {
            const rtl = document.documentElement.dir === "rtl";
            const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
            const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
            let newIndex = null;
            if (e.key === nextKey || e.key === "ArrowDown") newIndex = (index + 1) % tabs.length;
            else if (e.key === prevKey || e.key === "ArrowUp") newIndex = (index - 1 + tabs.length) % tabs.length;
            else if (e.key === "Home") newIndex = 0;
            else if (e.key === "End") newIndex = tabs.length - 1;
            if (newIndex === null) return;
            e.preventDefault();
            tabs[newIndex].focus();
            activateFn(tabs[newIndex]);
            syncTabIndexes(tabs);
        });
    });
}

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
    syncTabIndexes([tabBtnCreate, tabBtnHistory]);
    if (!creating) {
        loadHistory();
        loadStats();
    }
}

tabBtnCreate.addEventListener("click", () => activateTab("create"));
tabBtnHistory.addEventListener("click", () => activateTab("history"));
wireRovingTablist([tabBtnCreate, tabBtnHistory], (tab) => activateTab(tab === tabBtnCreate ? "create" : "history"));

const brandHomeBtn = document.getElementById("brandHomeBtn");
brandHomeBtn.addEventListener("click", () => activateTab("create"));
brandHomeBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateTab("create");
    }
});

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
    autoOption.setAttribute("data-i18n", "autoDetectOption");
    autoOption.textContent = t("autoDetectOption");
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

    transcriptionPanelTitle.textContent = t("transcriptionPanelTitleTpl", { lang: src ? languageName(src) : t("autoLangLabel") });
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
    // Guard against applyI18n() (called on every interface-language switch)
    // clobbering the "Translating…" busy label back to the idle one while a
    // translation is still in flight.
    translateBtnLabel.textContent = translateInFlight
        ? t("translatingBtn")
        : t("translateBtnWithLang", { lang: languageName(targetLanguageSelect.value) });
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
// Record/Upload input-method switch - upload is hidden until the user
// deliberately asks for it.
// ============================================================================
function setInputMode(mode) {
    const recordMode = mode !== "upload";
    recordModePanel.classList.toggle("hidden", !recordMode);
    uploadModePanel.classList.toggle("hidden", recordMode);
    inputModeRecordBtn.classList.toggle("active", recordMode);
    inputModeUploadBtn.classList.toggle("active", !recordMode);
    inputModeRecordBtn.setAttribute("aria-selected", String(recordMode));
    inputModeUploadBtn.setAttribute("aria-selected", String(!recordMode));
    syncTabIndexes([inputModeRecordBtn, inputModeUploadBtn]);
}
inputModeRecordBtn.addEventListener("click", () => setInputMode("record"));
inputModeUploadBtn.addEventListener("click", () => setInputMode("upload"));
wireRovingTablist([inputModeRecordBtn, inputModeUploadBtn], (tab) => setInputMode(tab === inputModeRecordBtn ? "record" : "upload"));

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
const MAX_RECORDING_SECONDS = 600; // matches the "10:00" shown next to the timer
const RECORDING_WARNING_SECONDS = 30; // last 30s before the cap: timer/progress turn amber

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateRecordingTime() {
    if (!recordingStartTime) return;
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    recordingTime.textContent = formatTime(elapsedSeconds);
    recordProgress.value = Math.min(elapsedSeconds, MAX_RECORDING_SECONDS);

    const nearingLimit = elapsedSeconds >= MAX_RECORDING_SECONDS - RECORDING_WARNING_SECONDS;
    recordingTime.classList.toggle("time-warning", nearingLimit);
    recordProgress.classList.toggle("time-warning", nearingLimit);

    if (elapsedSeconds >= MAX_RECORDING_SECONDS) {
        showToast(t("maxRecordingLengthReached"));
        stopRecording();
    }
}

function resetRecordingProgress() {
    recordProgress.value = 0;
    recordingTime.classList.remove("time-warning");
    recordProgress.classList.remove("time-warning");
}

const PAUSE_ICON_PATHS = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
const PLAY_TRIANGLE_ICON_PATHS = '<polygon points="6 3 20 12 6 21 6 3"/>';

function togglePauseRecording() {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
        mediaRecorder.pause();
        clearInterval(recordingTimer);
        recordingPausedAt = Date.now();
        pauseBtnLabel.textContent = t("resumeBtn");
        pauseBtnIcon.innerHTML = PLAY_TRIANGLE_ICON_PATHS;
        recordingStatus.textContent = t("statusPaused");
        stopVisualizer();
    } else if (mediaRecorder.state === "paused") {
        mediaRecorder.resume();
        recordingStartTime += Date.now() - recordingPausedAt;
        recordingTimer = setInterval(updateRecordingTime, 1000);
        pauseBtnLabel.textContent = t("pauseBtn");
        pauseBtnIcon.innerHTML = PAUSE_ICON_PATHS;
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
    updateTranslationCopyHint();
    setExportButtonsEnabled(false);
}

function clearTranslationState() {
    englishText.value = "";
    updateTranslationWordCount();
    staleNotice.classList.add("hidden");
    copyEnglishBtn.disabled = true;
    updateTranslationCopyHint();
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

// ============================================================================
// Edit / Copy mode - lets the whole transcription field become a single
// "click anywhere to copy" target instead of requiring a manual drag-select,
// which is fiddly for RTL/mixed text and long transcripts. The translation
// field is always read-only, so it's always click-to-copy with no toggle.
// ============================================================================
function copyFieldToClipboard(textarea) {
    const text = textarea.value;
    if (!text || !text.trim()) return;
    navigator.clipboard.writeText(text)
        .then(function () {
            textarea.classList.remove("just-copied");
            void textarea.offsetWidth; // restart the flash animation on repeat clicks
            textarea.classList.add("just-copied");
            showToast(t("fieldCopiedToast"), "success");
        })
        .catch(function (err) {
            logDebug("Error copying text: " + err);
            showToast(t("copyErrorToast"), "error");
        });
}

function setTranscriptionMode(mode) {
    const isCopyMode = mode === "copy";
    transcriptionModeEditBtn.classList.toggle("active", !isCopyMode);
    transcriptionModeEditBtn.setAttribute("aria-pressed", String(!isCopyMode));
    transcriptionModeCopyBtn.classList.toggle("active", isCopyMode);
    transcriptionModeCopyBtn.setAttribute("aria-pressed", String(isCopyMode));
    urduText.classList.toggle("copy-mode", isCopyMode);
    urduText.readOnly = isCopyMode;
    transcriptionCopyHint.classList.toggle("hidden", !isCopyMode);
}

transcriptionModeEditBtn.addEventListener("click", function () { setTranscriptionMode("edit"); });
transcriptionModeCopyBtn.addEventListener("click", function () { setTranscriptionMode("copy"); });
setTranscriptionMode("copy");

urduText.addEventListener("click", function () {
    if (!urduText.classList.contains("copy-mode")) return;
    urduText.select();
    copyFieldToClipboard(urduText);
});

function updateTranslationCopyHint() {
    translationCopyHint.classList.toggle("hidden", !englishText.value.trim());
}

englishText.addEventListener("click", function () {
    if (!englishText.value.trim()) return;
    englishText.select();
    copyFieldToClipboard(englishText);
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
                updateTranslationCopyHint();
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
            const fullMessage = t("translationErrorToast") + " " + err.message;
            showErrorBanner(fullMessage, err.requestId ? `requestId: ${err.requestId}\n${err.message}` : err.message);
            showToast(fullMessage, "error");
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
    resetRecordingProgress();
    pauseBtnIcon.innerHTML = PAUSE_ICON_PATHS;

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
            const fullMessage = t("micErrorGeneric") + " " + err.message;
            showErrorBanner(fullMessage);
            showToast(fullMessage, "error");
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

            const audioFile = new File([audioBlob], timestampedRecordingName(fileExt), {
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

        const audioFile = new File([audioBlob], timestampedRecordingName(fileExt), {
            type: audioType,
            lastModified: Date.now(),
        });

        addPendingFile(audioFile, "recorded");
    } catch (error) {
        logDebug("Error creating iOS audio file: " + error.message);
        const fullMessage = "Error creating the audio file: " + error.message;
        showErrorBanner(fullMessage);
        showToast(fullMessage, "error");
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

function timestampedRecordingName(ext) {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
    return `recording-${stamp}.${ext}`;
}

function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Every recording/upload is normalized to MP3 for storage regardless of the
// format it started as (see lib/audioStorage.js) - so anything shown to the
// user (staged file name, history filename, format label) should say MP3
// too, not the browser's raw recording format (webm) or whatever the
// original upload happened to be.
const STORED_AUDIO_FORMAT_LABEL = "MP3";

function toMp3DisplayName(name, fallback) {
    const base = name ? name.replace(/\.[^./]+$/, "") : (fallback || "recording");
    return `${base}.mp3`;
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

// Persists a just-completed recording/upload to the History tab immediately
// (status "pending", correctly source-tagged) so it's visible there even if
// the user never presses "Transcribe audio". Fire-and-forget from the
// caller's point of view; runTranscription() awaits pendingFile.savePromise
// so it can reuse the resulting recordingId instead of uploading the audio
// a second time.
function saveRecordingToHistory(file, source) {
    const formData = new FormData();
    if (isIOS) formData.append("device", "ios");
    else if (isMacOS) formData.append("device", "macos");
    else if (isAndroid) formData.append("device", "android");
    formData.append("source", source);
    if (sourceLanguageSelect.value) formData.append("language", sourceLanguageSelect.value);
    formData.append("file", file);

    return fetch("/api/v1/recordings", { method: "POST", body: formData })
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || "Could not save recording to history");
            return data;
        }))
        .then((data) => {
            if (pendingFile && pendingFile.file === file) {
                pendingFile.recordingId = data.id;
            }
            return data.id;
        })
        .catch((err) => {
            logDebug("Save-to-history error: " + err.message);
            return null;
        });
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
    pendingFile = { file, source, recordingId: null };
    pendingFile.savePromise = saveRecordingToHistory(file, source);
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
    item.querySelector(".upload-file-name").textContent = toMp3DisplayName(file.name);
    item.querySelector(".upload-file-meta").textContent = `${formatBytes(file.size)} • ${STORED_AUDIO_FORMAT_LABEL}`;
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
function uploadRecordingXHR(file, source, recordingId, onProgress) {
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
        if (recordingId) {
            // Already saved to history (see saveRecordingToHistory) - the
            // server reuses that stored audio instead of re-uploading it.
            formData.append("recordingId", recordingId);
            onProgress(100);
        } else {
            formData.append("file", file);
        }

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

    const capturedPendingFile = pendingFile;
    // The recording/upload was already sent to the server once, in the
    // background, as soon as it was staged (see saveRecordingToHistory) -
    // wait for that to resolve so the recordingId can be reused instead of
    // uploading the same audio a second time. If it hasn't resolved yet (or
    // failed), fall back to a normal fresh upload rather than blocking.
    Promise.resolve(capturedPendingFile.savePromise)
        .catch(() => null)
        .then(() => uploadRecordingXHR(file, source, capturedPendingFile.recordingId, (pct) => setFileItemProgress(currentFileItemEl, pct)))
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
            const fullMessage = t("transcriptionErrorToast") + " " + error.message;
            showErrorBanner(fullMessage, error.requestId ? `requestId: ${error.requestId}\nstatus: ${error.status}\n${error.message}` : error.message);
            setFileItemError(currentFileItemEl);
            showToast(fullMessage, "error");
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
const historyTable = document.getElementById("historyTable");
const historyTableBody = document.getElementById("historyTableBody");
const historyCardList = document.getElementById("historyCardList");
const historyEmpty = document.getElementById("historyEmpty");
const historyPrevBtn = document.getElementById("historyPrevBtn");
const historyNextBtn = document.getElementById("historyNextBtn");
const historyPageInfo = document.getElementById("historyPageInfo");
const historyPageNumbers = document.getElementById("historyPageNumbers");
const historyDetailOverlay = document.getElementById("historyDetailOverlay");
const historyDetail = document.getElementById("historyDetail");
const historyDetailClose = document.getElementById("historyDetailClose");
const historyDetailRenameBtn = document.getElementById("historyDetailRenameBtn");
const historyAudioPlayer = document.getElementById("historyAudioPlayer");
const historyTranscriptionText = document.getElementById("historyTranscriptionText");
const historyTranslationText = document.getElementById("historyTranslationText");
const historyDeleteBtn = document.getElementById("historyDeleteBtn");
const filtersToggleBtn = document.getElementById("filtersToggleBtn");
const filtersCollapse = document.getElementById("filtersCollapse");
const filtersBadge = document.getElementById("filtersBadge");
const filtersCount = document.getElementById("filtersCount");
const historyClearBtn = document.getElementById("historyClearBtn");
const historyRestoreBtn = document.getElementById("historyRestoreBtn");
const exportHistoryBtn = document.getElementById("exportHistoryBtn");
const historySelectAllCheckbox = document.getElementById("historySelectAllCheckbox");
const historyBulkBar = document.getElementById("historyBulkBar");
const historyBulkCount = document.getElementById("historyBulkCount");
const historyBulkDeleteBtn = document.getElementById("historyBulkDeleteBtn");
const historyBulkClearBtn = document.getElementById("historyBulkClearBtn");

let selectedRecordingIds = new Set();
let currentPageItems = [];

function updateBulkBar() {
    const n = selectedRecordingIds.size;
    historyBulkBar.classList.toggle("hidden", n === 0);
    historyBulkCount.textContent = t("bulkSelectedCount", { n });
    if (currentPageItems.length > 0) {
        historySelectAllCheckbox.checked = currentPageItems.every((item) => selectedRecordingIds.has(item.id));
        historySelectAllCheckbox.indeterminate = n > 0 && !historySelectAllCheckbox.checked;
    } else {
        historySelectAllCheckbox.checked = false;
        historySelectAllCheckbox.indeterminate = false;
    }
}

function toggleRowSelection(id, checked) {
    if (checked) selectedRecordingIds.add(id);
    else selectedRecordingIds.delete(id);
    document.querySelectorAll(`input.row-checkbox[data-id="${id}"], input.card-checkbox[data-id="${id}"]`)
        .forEach((el) => { el.checked = checked; });
    updateBulkBar();
}

historySelectAllCheckbox.addEventListener("change", () => {
    const checked = historySelectAllCheckbox.checked;
    for (const item of currentPageItems) {
        if (checked) selectedRecordingIds.add(item.id);
        else selectedRecordingIds.delete(item.id);
    }
    document.querySelectorAll("input.row-checkbox, input.card-checkbox").forEach((el) => { el.checked = checked; });
    updateBulkBar();
});

historyBulkClearBtn.addEventListener("click", () => {
    selectedRecordingIds.clear();
    document.querySelectorAll("input.row-checkbox, input.card-checkbox").forEach((el) => { el.checked = false; });
    updateBulkBar();
});

historyBulkDeleteBtn.addEventListener("click", () => {
    const ids = [...selectedRecordingIds];
    if (ids.length === 0) return;

    confirmDialog(t("bulkDeleteConfirm", { n: ids.length }), { title: t("modalDeleteTitle"), danger: true, confirmLabel: t("modalDeleteConfirm") })
        .then((ok) => {
            if (!ok) return;

            return Promise.allSettled(ids.map((id) => deleteRecording(id)))
                .then((results) => {
                    const failed = results.filter((r) => r.status === "rejected").length;
                    const succeeded = results.length - failed;
                    selectedRecordingIds.clear();
                    if (failed === 0) {
                        showToast(t("bulkDeleteSuccess", { n: succeeded }), "success");
                    } else {
                        showToast(t("bulkDeletePartial", { succeeded, failed }), "error");
                    }
                    loadHistory();
                    loadStats();
                });
        });
});

function downloadRecordingAudio(id, originalFilename) {
    const link = document.createElement("a");
    link.href = `/api/v1/recordings/${id}/audio`;
    link.download = toMp3DisplayName(originalFilename, id);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

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
    updateFiltersBadge();
    const params = currentFilterParams({ page: historyPage, pageSize: historyPageSize });

    fetch("/api/v1/recordings?" + params.toString())
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || "Error");
            return data;
        }))
        .then((data) => renderHistory(data))
        .catch((err) => {
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
const EDIT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';

// Renames only ever touch the display name shown to the user
// (originalFilename server-side) - never the stored audio file itself.
function renameRecording(id, currentName) {
    promptDialog(t("renamePrompt"), currentName || "").then((proposed) => {
        if (proposed == null) return; // cancelled
        const nextName = proposed.trim();
        if (!nextName || nextName === currentName) return;

        fetch(`/api/v1/recordings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ originalFilename: nextName }),
        })
            .then((res) => res.json().then((data) => {
                if (!res.ok) throw new Error(data.error || "Rename failed");
                return data;
            }))
            .then(() => {
                showToast(t("renameSuccess"), "success");
                loadHistory();
            })
            .catch((err) => showToast(t("renameError", { msg: err.message }), "error"));
    });
}
const FILE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
const STATUS_ICONS = {
    completed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    failed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return "—";
    return formatTime(Math.round(seconds));
}

function formatLanguagesCell(item) {
    const src = item.sourceLanguage ? item.sourceLanguage.toUpperCase() : "?";
    const tgt = item.targetLanguage ? item.targetLanguage.toUpperCase() : "—";
    return `${src} → ${tgt}`;
}

// "August 19, 2026, 4:14 PM" - built manually rather than via a single
// toLocaleString() call since Intl's combined date+time output varies by
// engine (some insert "at" instead of a comma).
function formatReadableDateTime(dateInput) {
    const date = new Date(dateInput);
    const datePart = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${datePart}, ${timePart}`;
}

function formatRelativeTime(dateInput) {
    const diffSec = Math.round((Date.now() - new Date(dateInput).getTime()) / 1000);
    if (diffSec < 60) return t("timeJustNow");

    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) return t(diffMin === 1 ? "timeMinuteAgo" : "timeMinutesAgo", { n: diffMin });

    const diffHour = Math.round(diffMin / 60);
    if (diffHour < 24) return t(diffHour === 1 ? "timeHourAgo" : "timeHoursAgo", { n: diffHour });

    const diffDay = Math.round(diffHour / 24);
    if (diffDay < 7) return t(diffDay === 1 ? "timeDayAgo" : "timeDaysAgo", { n: diffDay });

    const diffWeek = Math.round(diffDay / 7);
    if (diffWeek < 5) return t(diffWeek === 1 ? "timeWeekAgo" : "timeWeeksAgo", { n: diffWeek });

    const diffMonth = Math.round(diffDay / 30);
    if (diffMonth < 12) return t(diffMonth === 1 ? "timeMonthAgo" : "timeMonthsAgo", { n: diffMonth });

    const diffYear = Math.round(diffDay / 365);
    return t(diffYear === 1 ? "timeYearAgo" : "timeYearsAgo", { n: diffYear });
}

function renderHistory(data) {
    historyTableBody.innerHTML = "";
    historyCardList.innerHTML = "";
    selectedRecordingIds.clear();
    currentPageItems = data.items || [];
    updateBulkBar();

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
    const name = item.originalFilename ? toMp3DisplayName(item.originalFilename) : t("untitled");
    tr.innerHTML = `
        <td class="col-select"><input type="checkbox" class="row-checkbox" data-id="${item.id}" aria-label="${t("selectRecordingAria")}"></td>
        <td>
            <div class="rec-file-cell">
                <span class="rec-file-icon" aria-hidden="true">${FILE_ICON}</span>
                <div>
                    <div class="rec-file-name"></div>
                    <div class="rec-file-meta">${STORED_AUDIO_FORMAT_LABEL}${item.fileSizeBytes ? " • " + formatBytes(item.fileSizeBytes) : ""}</div>
                </div>
            </div>
        </td>
        <td><span class="source-pill ${item.sourceType}">${t(item.sourceType === "recorded" ? "sourceRecorded" : "sourceUploaded")}</span></td>
        <td>${formatDuration(item.durationSeconds)}</td>
        <td>${formatLanguagesCell(item)}</td>
        <td><span title="${formatReadableDateTime(item.createdAt)}">${formatRelativeTime(item.createdAt)}</span></td>
        <td><span class="status-pill ${item.status}">${STATUS_ICONS[item.status] || ""}${statusLabel(item.status)}</span></td>
        <td>
            <div class="row-actions">
                <button type="button" class="icon-btn row-play-btn" aria-label="${t("openAria")}">${PLAY_ICON}</button>
                <button type="button" class="icon-btn row-rename-btn" aria-label="${t("renameAudioAria")}">${EDIT_ICON}</button>
                <button type="button" class="icon-btn row-download-btn" aria-label="${t("downloadAudioAria")}">${DOWNLOAD_ICON}</button>
                <button type="button" class="icon-btn row-delete-btn" aria-label="${t("deleteAria")}">${TRASH_ICON}</button>
            </div>
        </td>
    `;
    tr.querySelector(".rec-file-name").textContent = name;
    tr.addEventListener("click", () => openHistoryDetail(item.id));
    tr.addEventListener("keydown", (e) => { if (e.key === "Enter") openHistoryDetail(item.id); });
    tr.querySelector(".row-checkbox").addEventListener("click", (e) => e.stopPropagation());
    tr.querySelector(".row-checkbox").addEventListener("change", (e) => toggleRowSelection(item.id, e.target.checked));
    tr.querySelector(".row-play-btn").addEventListener("click", (e) => { e.stopPropagation(); openHistoryDetail(item.id); });
    tr.querySelector(".row-rename-btn").addEventListener("click", (e) => { e.stopPropagation(); renameRecording(item.id, name); });
    tr.querySelector(".row-download-btn").addEventListener("click", (e) => { e.stopPropagation(); downloadRecordingAudio(item.id, item.originalFilename); });
    tr.querySelector(".row-delete-btn").addEventListener("click", (e) => { e.stopPropagation(); quickDelete(item.id); });
    return tr;
}

function buildCard(item) {
    const card = document.createElement("div");
    card.className = "history-item-card";
    const name = item.originalFilename ? toMp3DisplayName(item.originalFilename) : t("untitled");
    card.innerHTML = `
        <div class="history-item-top">
            <input type="checkbox" class="card-checkbox" data-id="${item.id}" aria-label="${t("selectRecordingAria")}">
            <span class="rec-file-icon" aria-hidden="true">${FILE_ICON}</span>
            <div class="history-item-info">
                <div class="history-item-name"></div>
                <div class="history-item-meta">${STORED_AUDIO_FORMAT_LABEL}${item.fileSizeBytes ? " • " + formatBytes(item.fileSizeBytes) : ""}</div>
            </div>
            <div class="row-actions">
                <button type="button" class="icon-btn row-play-btn" aria-label="${t("openAria")}">${PLAY_ICON}</button>
                <button type="button" class="icon-btn row-rename-btn" aria-label="${t("renameAudioAria")}">${EDIT_ICON}</button>
                <button type="button" class="icon-btn row-download-btn" aria-label="${t("downloadAudioAria")}">${DOWNLOAD_ICON}</button>
                <button type="button" class="icon-btn row-delete-btn" aria-label="${t("deleteAria")}">${TRASH_ICON}</button>
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
            <span title="${formatReadableDateTime(item.createdAt)}">${formatRelativeTime(item.createdAt)}</span>
        </div>
    `;
    card.querySelector(".history-item-name").textContent = name;
    card.addEventListener("click", () => openHistoryDetail(item.id));
    card.querySelector(".card-checkbox").addEventListener("click", (e) => e.stopPropagation());
    card.querySelector(".card-checkbox").addEventListener("change", (e) => toggleRowSelection(item.id, e.target.checked));
    card.querySelector(".row-play-btn").addEventListener("click", (e) => { e.stopPropagation(); openHistoryDetail(item.id); });
    card.querySelector(".row-rename-btn").addEventListener("click", (e) => { e.stopPropagation(); renameRecording(item.id, name); });
    card.querySelector(".row-download-btn").addEventListener("click", (e) => { e.stopPropagation(); downloadRecordingAudio(item.id, item.originalFilename); });
    card.querySelector(".row-delete-btn").addEventListener("click", (e) => { e.stopPropagation(); quickDelete(item.id); });
    return card;
}

// Shared by every single-recording delete call site so a real server-side
// error message (permission, not-found, etc.) always reaches the user
// instead of a generic "Delete failed" string.
function deleteRecording(id) {
    return fetch(`/api/v1/recordings/${id}`, { method: "DELETE" }).then((res) => {
        if (res.status === 204) return;
        return res.json().then((data) => {
            throw new Error(data.error || "Delete failed");
        });
    });
}

function quickDelete(id) {
    confirmDialog(t("deleteConfirm"), { title: t("modalDeleteTitle"), danger: true, confirmLabel: t("modalDeleteConfirm") }).then((ok) => {
        if (!ok) return;
        deleteRecording(id)
            .then(() => {
                showToast(t("deletedToast"), "success");
                loadHistory();
                loadStats();
            })
            .catch((err) => showToast(t("deleteError", { msg: err.message }), "error"));
    });
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

// "Deleting" a recording only ever hides it server-side - it's never
// actually removed. This brings back everything hidden within the
// currently-selected date range (an empty from/to means "any time").
historyRestoreBtn.addEventListener("click", () => {
    const dateFrom = historyDateFrom.value || undefined;
    const dateTo = historyDateTo.value || undefined;

    fetch("/api/v1/recordings/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFrom, dateTo }),
    })
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || "Restore failed");
            return data;
        }))
        .then((data) => {
            if (data.restored > 0) {
                showToast(t("restoreSuccess", { n: data.restored }), "success");
                loadHistory();
                loadStats();
            } else {
                showToast(t("restoreNone"));
            }
        })
        .catch((err) => showToast(t("restoreError", { msg: err.message }), "error"));
});
historyPrevBtn.addEventListener("click", () => { historyPage = Math.max(1, historyPage - 1); loadHistory(); });
historyNextBtn.addEventListener("click", () => { historyPage += 1; loadHistory(); });

let openRecordingId = null;
let openRecordingName = "";
let historyDetailPreviousFocus = null;

function openHistoryDetail(id) {
    historyDetailPreviousFocus = document.activeElement;
    fetch(`/api/v1/recordings/${id}`)
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || "Error");
            return data;
        }))
        .then((rec) => {
            openRecordingId = rec.id;
            openRecordingName = rec.originalFilename ? toMp3DisplayName(rec.originalFilename) : t("untitled");
            historyAudioPlayer.src = `/api/v1/recordings/${rec.id}/audio`;
            historyTranscriptionText.value = rec.transcriptionText || "";
            historyTranslationText.value = rec.translationText || "";
            historyDetailOverlay.classList.remove("hidden");
            document.addEventListener("keydown", handleHistoryDetailKeydown, true);
            historyDetailClose.focus();
        })
        .catch((err) => showToast(t("detailLoadError", { msg: err.message }), "error"));
}

function closeHistoryDetail() {
    historyDetailOverlay.classList.add("hidden");
    document.removeEventListener("keydown", handleHistoryDetailKeydown, true);
    historyAudioPlayer.pause();
    historyAudioPlayer.src = "";
    openRecordingId = null;
    openRecordingName = "";
    if (historyDetailPreviousFocus && typeof historyDetailPreviousFocus.focus === "function") {
        historyDetailPreviousFocus.focus();
    }
    historyDetailPreviousFocus = null;
}

function getFocusableWithin(container) {
    const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(container.querySelectorAll(selector)).filter((el) => el.offsetParent !== null);
}

function handleHistoryDetailKeydown(event) {
    if (event.key === "Escape") {
        event.preventDefault();
        closeHistoryDetail();
        return;
    }
    // Same Tab trap as the generic confirm/prompt modal (appModal) - this
    // dialog's content is more varied (audio player, export dropdown,
    // textareas), so the focusable set is computed live rather than
    // hardcoded.
    if (event.key === "Tab") {
        const focusable = getFocusableWithin(historyDetail);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
}

historyDetailRenameBtn.addEventListener("click", () => {
    if (!openRecordingId) return;
    renameRecording(openRecordingId, openRecordingName);
});

historyDetailClose.addEventListener("click", closeHistoryDetail);
historyDetailOverlay.addEventListener("click", (e) => {
    if (e.target === historyDetailOverlay) closeHistoryDetail();
});

wireDropdown("historyExportDropdown", "historyExportToggleBtn", "historyExportMenu", (format) => {
    if (openRecordingId) window.location.href = `/api/v1/recordings/${openRecordingId}/export?format=${format}`;
});

historyDeleteBtn.addEventListener("click", () => {
    if (!openRecordingId) return;
    confirmDialog(t("deleteConfirm"), { title: t("modalDeleteTitle"), danger: true, confirmLabel: t("modalDeleteConfirm") }).then((ok) => {
        if (!ok) return;

        deleteRecording(openRecordingId)
            .then(() => {
                showToast(t("deletedToast"), "success");
                closeHistoryDetail();
                loadHistory();
                loadStats();
            })
            .catch((err) => showToast(t("deleteError", { msg: err.message }), "error"));
    });
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
    syncTabIndexes([workspaceTabTranscription, workspaceTabTranslation]);
}
workspaceTabTranscription.addEventListener("click", () => setWorkspaceTab("transcription"));
workspaceTabTranslation.addEventListener("click", () => setWorkspaceTab("translation"));
wireRovingTablist(
    [workspaceTabTranscription, workspaceTabTranslation],
    (tab) => setWorkspaceTab(tab === workspaceTabTranscription ? "transcription" : "translation")
);

function renderWorkspaceTabLabels() {
    const src = sourceLanguageSelect.value === "auto" ? "" : sourceLanguageSelect.value;
    const tgt = targetLanguageSelect.value;
    workspaceTabTranscription.textContent = t("transcriptionPanelTitleTpl", { lang: src ? languageName(src) : t("autoLangLabel") });
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
