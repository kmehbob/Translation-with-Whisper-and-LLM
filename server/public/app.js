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

// Visualizer state
let audioContext = null;
let analyser = null;
let visualizerRafId = null;

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

// UI Elements
const step1 = document.getElementById('step1');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const instructions = document.getElementById('instructions');
const recordSection = document.getElementById('recordSection');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const urduText = document.getElementById('urduText');
const englishText = document.getElementById('englishText');
const debug = document.getElementById('debug');
const copyUrduBtn = document.getElementById('copyUrduBtn');
const copyEnglishBtn = document.getElementById('copyEnglishBtn');
const saveAudioBtn = document.getElementById('saveAudioBtn');
const translateBtn = document.getElementById('translateBtn');
const translateStatus = document.getElementById('translateStatus');
const translateError = document.getElementById('translateError');
const staleNotice = document.getElementById('staleNotice');
const recordingStatus = document.getElementById('recordingStatus');
const recordingTime = document.getElementById('recordingTime');
const clearBtn = document.getElementById('clearBtn');
const audioFileInput = document.getElementById('audioFileInput');
const dropZone = document.getElementById('dropZone');
const visualizerCanvas = document.getElementById('visualizer');
const sourceLanguageSelect = document.getElementById('sourceLanguage');
const targetLanguageSelect = document.getElementById('targetLanguage');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const exportDocxBtn = document.getElementById('exportDocxBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Device detection
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isMacOS = /Macintosh/.test(navigator.userAgent);
const isAppleDevice = isIOS || isMacOS;
const isAndroid = /Android/.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isMacSafari = isMacOS && isSafari;

function logDebug(message) {
    if (debug) {
        debug.innerHTML += message + '<br>';
        debug.classList.remove('hidden');
    }
    console.log(message);
}

logDebug('Device info: ' +
    (isIOS ? 'iOS' : 'Not iOS') + ', ' +
    (isAndroid ? 'Android' : 'Not Android') + ', ' +
    (isSafari ? 'Safari' : 'Not Safari') + ', ' +
    'UA: ' + navigator.userAgent);

// ============================================================================
// Toasts
// ============================================================================
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ` toast-${type}` : '');
    toast.textContent = message;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4500);
}

// ============================================================================
// Tabs
// ============================================================================
const tabBtnCreate = document.getElementById('tabBtnCreate');
const tabBtnHistory = document.getElementById('tabBtnHistory');
const tabCreate = document.getElementById('tabCreate');
const tabHistory = document.getElementById('tabHistory');

function activateTab(name) {
    const creating = name === 'create';
    tabCreate.classList.toggle('hidden', !creating);
    tabHistory.classList.toggle('hidden', creating);
    tabBtnCreate.classList.toggle('active', creating);
    tabBtnHistory.classList.toggle('active', !creating);
    tabBtnCreate.setAttribute('aria-selected', String(creating));
    tabBtnHistory.setAttribute('aria-selected', String(!creating));
    if (!creating) loadHistory();
}

tabBtnCreate.addEventListener('click', () => activateTab('create'));
tabBtnHistory.addEventListener('click', () => activateTab('history'));

// ============================================================================
// Language selectors
// ============================================================================
function populateLanguageSelects() {
    const autoOption = document.createElement('option');
    autoOption.value = 'auto';
    autoOption.textContent = 'Auto-detect';
    sourceLanguageSelect.appendChild(autoOption);

    for (const [code, label] of LANGUAGES) {
        const src = document.createElement('option');
        src.value = code;
        src.textContent = label;
        sourceLanguageSelect.appendChild(src);

        const tgt = document.createElement('option');
        tgt.value = code;
        tgt.textContent = label;
        targetLanguageSelect.appendChild(tgt);
    }
    sourceLanguageSelect.value = 'ur';
    targetLanguageSelect.value = 'en';
}
populateLanguageSelects();

// ============================================================================
// Mic permission
// ============================================================================
const permissionBtn = document.getElementById('permissionBtn');
if (permissionBtn) permissionBtn.addEventListener('click', requestMicPermission);
if (startBtn) startBtn.addEventListener('click', startRecording);
if (stopBtn) stopBtn.addEventListener('click', stopRecording);
if (pauseBtn) pauseBtn.addEventListener('click', togglePauseRecording);

function requestMicPermission() {
    errorMsg.classList.add('hidden');

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            stream.getTracks().forEach(track => track.stop());
            logDebug('Permission granted');

            step1.classList.add('hidden');
            recordSection.classList.remove('hidden');
            successMsg.classList.remove('hidden');
        })
        .catch(function (err) {
            logDebug('Permission error: ' + err.message);
            errorMsg.textContent = "مائیکروفون کی اجازت نہیں ملی۔ براہ کرم دوبارہ کوشش کریں۔";
            errorMsg.classList.remove('hidden');
            instructions.classList.remove('hidden');

            if (isIOS) {
                errorMsg.textContent += " آئی فون پر، آپ کو سیٹنگز > سفاری > سائٹ کے اجازت نامے میں جانا ہوگا۔";
            }
        });
}

// ============================================================================
// Recording timer / pause
// ============================================================================
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateRecordingTime() {
    if (!recordingStartTime) return;
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    recordingTime.textContent = formatTime(elapsedSeconds);
}

function togglePauseRecording() {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        clearInterval(recordingTimer);
        recordingPausedAt = Date.now();
        pauseBtn.textContent = '▶ جاری رکھیں';
        recordingStatus.textContent = 'ریکارڈنگ رکی ہوئی ہے';
        stopVisualizer();
    } else if (mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        recordingStartTime += Date.now() - recordingPausedAt;
        recordingTimer = setInterval(updateRecordingTime, 1000);
        pauseBtn.textContent = '⏸ روکیں';
        recordingStatus.textContent = 'ریکارڈنگ جاری ہے';
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

        const ctx = visualizerCanvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            visualizerRafId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const width = visualizerCanvas.width;
            const height = visualizerCanvas.height;
            ctx.fillStyle = '#11182a';
            ctx.fillRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height;
                ctx.fillStyle = `hsl(${200 + (i / bufferLength) * 80}, 90%, 60%)`;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }
        draw();
    } catch (e) {
        logDebug('Visualizer unavailable: ' + e.message);
    }
}

function stopVisualizer() {
    if (visualizerRafId) cancelAnimationFrame(visualizerRafId);
    visualizerRafId = null;
    if (visualizerCanvas) {
        const ctx = visualizerCanvas.getContext('2d');
        ctx.fillStyle = '#11182a';
        ctx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    }
}

// ============================================================================
// Urdu text / translation state
// ============================================================================
function markTranslationStale() {
    if (englishText.value.trim() !== '') {
        staleNotice.classList.remove('hidden');
    }
    copyEnglishBtn.disabled = true;
    setExportButtonsEnabled(false);
}

function clearTranslationState() {
    englishText.value = '';
    staleNotice.classList.add('hidden');
    copyEnglishBtn.disabled = true;
    setExportButtonsEnabled(false);
}

function setExportButtonsEnabled(enabled) {
    exportTxtBtn.disabled = !enabled;
    exportDocxBtn.disabled = !enabled;
    exportPdfBtn.disabled = !enabled;
}

function updateTranslateButtonState() {
    translateBtn.disabled = translateInFlight || transcribing || urduText.value.trim() === '';
}

urduText.addEventListener('input', function () {
    markTranslationStale();
    updateTranslateButtonState();
});

function copyToClipboard(text, button, busyLabel) {
    if (!text || !text.trim()) return;
    navigator.clipboard.writeText(text)
        .then(function () {
            const original = button.textContent;
            button.textContent = busyLabel;
            button.classList.add('copy-success');
            setTimeout(function () {
                button.textContent = original;
                button.classList.remove('copy-success');
            }, 2000);
        })
        .catch(function (err) {
            logDebug('Error copying text: ' + err);
            showToast('متن کاپی کرنے میں خرابی۔', 'error');
        });
}

copyUrduBtn.addEventListener('click', function () {
    copyToClipboard(urduText.value, copyUrduBtn, 'کاپی ہو گیا!');
});

copyEnglishBtn.addEventListener('click', function () {
    if (copyEnglishBtn.disabled) return;
    copyToClipboard(englishText.value, copyEnglishBtn, 'Copied!');
});

saveAudioBtn.addEventListener('click', function () {
    if (!currentRecordingId) return;
    const link = document.createElement('a');
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
exportTxtBtn.addEventListener('click', () => exportCurrent('txt'));
exportDocxBtn.addEventListener('click', () => exportCurrent('docx'));
exportPdfBtn.addEventListener('click', () => exportCurrent('pdf'));

translateBtn.addEventListener('click', function () {
    const text = urduText.value.trim();

    // Never send a translation request for empty input, and never allow a
    // second request to start while one is already in flight.
    if (!text || translateInFlight) return;

    translateInFlight = true;
    updateTranslateButtonState();
    translateBtn.setAttribute('aria-busy', 'true');
    translateBtn.innerHTML = 'ترجمہ ہو رہا ہے... <span class="spinner"></span>';
    translateStatus.textContent = 'ترجمہ تیار کیا جا رہا ہے...';
    translateError.classList.add('hidden');

    fetch('/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            recordingId: currentRecordingId || undefined,
            sourceLanguage: sourceLanguageSelect.value === 'auto' ? undefined : sourceLanguageSelect.value,
            targetLanguage: targetLanguageSelect.value,
        }),
    })
        .then(function (response) {
            return response.json().then(function (data) {
                if (!response.ok) {
                    throw new Error(data.error || 'ترجمہ کرنے میں خرابی');
                }
                return data;
            });
        })
        .then(function (data) {
            englishText.value = data.translation || '';

            if (urduText.value.trim() === text) {
                staleNotice.classList.add('hidden');
                copyEnglishBtn.disabled = !englishText.value.trim();
                setExportButtonsEnabled(Boolean(currentRecordingId && englishText.value.trim()));
                translateStatus.textContent = 'ترجمہ مکمل ہوگیا۔';
                englishText.focus();
                showToast('ترجمہ مکمل ہوگیا۔', 'success');
            } else {
                // The source text was edited while this request was still in
                // flight - the result that just arrived is already outdated,
                // so don't present it (or let it be copied) as current.
                markTranslationStale();
                translateStatus.textContent = 'ترجمہ مکمل ہوگیا، لیکن متن تبدیل ہو چکا ہے — دوبارہ ترجمہ کریں۔';
            }
        })
        .catch(function (err) {
            logDebug('Translation error: ' + err.message);
            translateError.textContent = 'ترجمہ کرنے میں خرابی: ' + err.message;
            translateError.classList.remove('hidden');
            translateStatus.textContent = '';
            showToast('ترجمہ کرنے میں خرابی۔', 'error');
        })
        .finally(function () {
            translateInFlight = false;
            translateBtn.removeAttribute('aria-busy');
            translateBtn.textContent = '🌐 ترجمہ کریں';
            updateTranslateButtonState();
        });
});

clearBtn.addEventListener('click', function () {
    urduText.value = '';
    currentRecordingId = null;
    saveAudioBtn.disabled = true;
    clearTranslationState();
    updateTranslateButtonState();
    translateError.classList.add('hidden');
    translateStatus.textContent = '';
});

// ============================================================================
// Recording
// ============================================================================
function startRecording() {
    urduText.value = '';
    currentRecordingId = null;
    saveAudioBtn.disabled = true;
    clearTranslationState();
    updateTranslateButtonState();
    audioChunks = [];

    recordingStatus.textContent = "ریکارڈنگ شروع ہو رہی ہے...";

    navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
            channelCount: 1
        }
    })
        .then(function (stream) {
            recordingStream = stream;

            try {
                const mimeType = getSupportedMimeType();
                const options = {
                    mimeType: mimeType || '',
                    audioBitsPerSecond: 128000
                };
                mediaRecorder = new MediaRecorder(stream, options);
            } catch (e) {
                logDebug('Error creating MediaRecorder with options: ' + e.message);
                mediaRecorder = new MediaRecorder(stream);
            }

            mediaRecorder.ondataavailable = function (event) {
                if (event.data && event.data.size > 0) {
                    logDebug('Received chunk: ' + event.data.size + ' bytes');
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstart = function () {
                recordingStartTime = Date.now();
                recordingTime.classList.remove('hidden');
                recordingTimer = setInterval(updateRecordingTime, 1000);
                recordingStatus.textContent = "ریکارڈنگ جاری ہے";
                document.body.classList.add('recording-active');
                startBtn.classList.add('recording');
                startVisualizer(stream);
            };

            mediaRecorder.start(1000);
            logDebug('Recording started');

            startBtn.disabled = true;
            stopBtn.disabled = false;
            pauseBtn.disabled = false;
            pauseBtn.textContent = '⏸ روکیں';
        })
        .catch(function (err) {
            logDebug('Error starting recording: ' + err.message);
            urduText.value = "ریکارڈنگ شروع کرنے میں خرابی: " + err.message;
            recordingStatus.textContent = "ریکارڈنگ تیار ہے";
        });
}

function stopRecording() {
    if (!mediaRecorder) return;

    logDebug('Stopping recording');
    recordingStatus.textContent = "ریکارڈنگ رک گئی، ٹرانسکرپشن ہو رہا ہے...";

    clearInterval(recordingTimer);
    recordingTime.classList.add('hidden');
    stopVisualizer();

    document.body.classList.remove('recording-active');
    startBtn.classList.remove('recording');

    mediaRecorder.onstop = function () {
        if (recordingStream) {
            recordingStream.getTracks().forEach(track => track.stop());
            recordingStream = null;
        }

        if (audioChunks.length === 0) {
            logDebug('No audio data recorded');
            urduText.value = "کوئی آڈیو ڈیٹا ریکارڈ نہیں ہوا۔";
            startBtn.disabled = false;
            stopBtn.disabled = true;
            pauseBtn.disabled = true;
            recordingStatus.textContent = "ریکارڈنگ تیار ہے";
            return;
        }

        logDebug('Recording stopped, processing ' + audioChunks.length + ' chunks');

        if (isIOS) {
            createAndSendAudioForIOS();
        } else {
            const audioType = "audio/webm";
            const fileExt = "webm";
            const audioBlob = new Blob(audioChunks, { type: audioType });

            logDebug('Created blob: ' + audioBlob.size + ' bytes, type: ' + audioType);

            const audioFile = new File([audioBlob], `audio.${fileExt}`, {
                type: audioType,
                lastModified: Date.now()
            });

            sendAudioToServer(audioFile, 'recorded');
        }
    };

    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    pauseBtn.disabled = true;
}

function getSupportedMimeType() {
    if (isMacSafari) {
        logDebug('macOS Safari detected, forcing audio/mp3');
        return 'audio/mp3';
    }
    if (isAppleDevice) {
        const types = ['audio/aac', 'audio/mp3', 'audio/mpeg', 'audio/mp4'];
        for (let type of types) {
            if (MediaRecorder.isTypeSupported(type)) return type;
        }
        return 'audio/mp3';
    }

    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus';
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/mp3')) return 'audio/mp3';
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';

    logDebug('No specific MIME type supported, using browser default');
    return '';
}

function createAndSendAudioForIOS() {
    const audioType = "audio/mp3";
    const fileExt = "mp3";

    try {
        const audioBlob = new Blob(audioChunks, { type: audioType });
        logDebug('Created iOS blob: ' + audioBlob.size + ' bytes, type: ' + audioType);

        const audioFile = new File([audioBlob], `audio.${fileExt}`, {
            type: audioType,
            lastModified: Date.now()
        });

        sendAudioToServer(audioFile, 'recorded');
    } catch (error) {
        logDebug('Error creating iOS audio file: ' + error.message);
        urduText.value = "آڈیو فائل بنانے میں خرابی: " + error.message;
        recordingStatus.textContent = "ریکارڈنگ تیار ہے";
    }
}

// ============================================================================
// Upload (file picker + drag & drop)
// ============================================================================
if (audioFileInput) {
    audioFileInput.addEventListener('change', function () {
        const file = audioFileInput.files && audioFileInput.files[0];
        if (file) {
            sendAudioToServer(file, 'uploaded');
            audioFileInput.value = '';
        }
    });
}

if (dropZone) {
    ['dragenter', 'dragover'].forEach((evt) => {
        dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
    });
    ['dragleave', 'drop'].forEach((evt) => {
        dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });
    });
    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) sendAudioToServer(file, 'uploaded');
    });
    dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            audioFileInput.click();
        }
    });
}

function sendAudioToServer(file, source) {
    urduText.value = "ٹرانسکرپشن ہو رہی ہے...";
    transcribing = true;
    currentRecordingId = null;
    saveAudioBtn.disabled = true;
    clearTranslationState();
    updateTranslateButtonState();

    logDebug('Sending file to server: ' + file.name + ', size: ' + file.size + ' bytes, type: ' + file.type);
    if (isMacSafari && file.type === 'audio/webm') {
        const newFileName = file.name.replace('.webm', '.mp3');
        const newFile = new File([file], newFileName, {
            type: 'audio/mp3',
            lastModified: Date.now()
        });

        logDebug('Converting webm to mp3 for macOS Safari');
        file = newFile;
    }

    const formData = new FormData();

    // The server reads "device"/"source"/"language" fields while it is still
    // streaming the "file" part, so they must be appended first - multipart
    // fields are read in append order.
    if (isIOS) {
        formData.append("device", "ios");
    } else if (isMacOS) {
        formData.append("device", "macos");
    } else if (isAndroid) {
        formData.append("device", "android");
    }
    formData.append("source", source);
    if (sourceLanguageSelect.value) {
        formData.append("language", sourceLanguageSelect.value);
    }

    formData.append("file", file);

    fetch('/api/v1/transcribe', {
        method: "POST",
        body: formData
    })
        .then(function (response) {
            logDebug('Server response status: ' + response.status);

            return response.json().then(function (data) {
                if (!response.ok) {
                    logDebug('Server error: ' + JSON.stringify(data));
                    throw new Error(data.error || "سرور خرابی");
                }
                return data;
            });
        })
        .then(function (data) {
            logDebug('Transcription successful');
            urduText.value = data.text || "";
            currentRecordingId = data.recordingId || null;
            saveAudioBtn.disabled = !currentRecordingId;
            if (data.language) {
                sourceLanguageSelect.value = data.language;
            }
            recordingStatus.textContent = "ریکارڈنگ تیار ہے";
            if (!data.text || !data.text.trim()) {
                urduText.placeholder = "کوئی متن نہیں ملا۔ دوبارہ کوشش کریں یا خود ٹائپ کریں۔";
            } else {
                showToast('ٹرانسکرپشن مکمل ہوگئی۔', 'success');
            }
        })
        .catch(function (error) {
            logDebug('Transcription error: ' + error.message);
            urduText.value = "";
            translateError.textContent = "ٹرانسکرپشن میں خرابی: " + error.message;
            translateError.classList.remove('hidden');
            recordingStatus.textContent = "ریکارڈنگ تیار ہے";
            showToast('ٹرانسکرپشن میں خرابی۔', 'error');
        })
        .finally(function () {
            transcribing = false;
            updateTranslateButtonState();
        });
}

if (isIOS) {
    document.addEventListener('touchstart', function () {
        // This empty handler helps initialize audio on iOS
    }, { once: true });
}

// ============================================================================
// History
// ============================================================================
let historyPage = 1;
const historyPageSize = 10;

const historyFiltersForm = document.getElementById('historyFilters');
const historyQuery = document.getElementById('historyQuery');
const historySourceType = document.getElementById('historySourceType');
const historyStatusFilter = document.getElementById('historyStatus');
const historyDateFrom = document.getElementById('historyDateFrom');
const historyDateTo = document.getElementById('historyDateTo');
const historyStatusText = document.getElementById('historyStatus2');
const historyTable = document.getElementById('historyTable');
const historyTableBody = document.getElementById('historyTableBody');
const historyEmpty = document.getElementById('historyEmpty');
const historyPrevBtn = document.getElementById('historyPrevBtn');
const historyNextBtn = document.getElementById('historyNextBtn');
const historyPageInfo = document.getElementById('historyPageInfo');
const historyDetail = document.getElementById('historyDetail');
const historyDetailClose = document.getElementById('historyDetailClose');
const historyAudioPlayer = document.getElementById('historyAudioPlayer');
const historyTranscriptionText = document.getElementById('historyTranscriptionText');
const historyTranslationText = document.getElementById('historyTranslationText');
const historyDeleteBtn = document.getElementById('historyDeleteBtn');

const STATUS_LABELS = {
    pending: 'زیر التوا',
    transcribing: 'ٹرانسکرائب ہو رہا ہے',
    transcribed: 'ٹرانسکرائب شدہ',
    translating: 'ترجمہ ہو رہا ہے',
    completed: 'مکمل',
    failed: 'ناکام',
};

function loadHistory() {
    historyStatusText.textContent = 'لوڈ ہو رہا ہے...';
    const params = new URLSearchParams({ page: historyPage, pageSize: historyPageSize });
    if (historyQuery.value.trim()) params.set('q', historyQuery.value.trim());
    if (historySourceType.value) params.set('sourceType', historySourceType.value);
    if (historyStatusFilter.value) params.set('status', historyStatusFilter.value);
    if (historyDateFrom.value) params.set('dateFrom', historyDateFrom.value);
    if (historyDateTo.value) params.set('dateTo', historyDateTo.value);

    fetch('/api/v1/recordings?' + params.toString())
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || 'ہسٹری لوڈ کرنے میں خرابی');
            return data;
        }))
        .then((data) => renderHistory(data))
        .catch((err) => {
            historyStatusText.textContent = '';
            showToast('ہسٹری لوڈ کرنے میں خرابی: ' + err.message, 'error');
        });
}

function renderHistory(data) {
    historyStatusText.textContent = '';
    historyTableBody.innerHTML = '';

    if (!data.items || data.items.length === 0) {
        historyTable.classList.add('hidden');
        historyEmpty.classList.remove('hidden');
    } else {
        historyEmpty.classList.add('hidden');
        historyTable.classList.remove('hidden');
        for (const item of data.items) {
            const tr = document.createElement('tr');
            tr.tabIndex = 0;
            tr.setAttribute('role', 'button');
            tr.setAttribute('aria-label', 'تفصیل دیکھیں: ' + (item.originalFilename || item.id));
            tr.innerHTML = `
                <td>${new Date(item.createdAt).toLocaleString()}</td>
                <td>${escapeHtml(item.originalFilename || '(بغیر نام)')}</td>
                <td>${item.sourceType === 'recorded' ? 'ریکارڈ شدہ' : 'اپ لوڈ شدہ'}</td>
                <td>${item.durationSeconds ? item.durationSeconds.toFixed(1) + 's' : '—'}</td>
                <td><span class="status-pill ${item.status}">${STATUS_LABELS[item.status] || item.status}</span></td>
                <td><button type="button" class="row-open-btn">دیکھیں</button></td>
            `;
            tr.addEventListener('click', () => openHistoryDetail(item.id));
            tr.querySelector('.row-open-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openHistoryDetail(item.id);
            });
            tr.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') openHistoryDetail(item.id);
            });
            historyTableBody.appendChild(tr);
        }
    }

    const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
    historyPageInfo.textContent = `صفحہ ${data.page} از ${totalPages}`;
    historyPrevBtn.disabled = data.page <= 1;
    historyNextBtn.disabled = data.page >= totalPages;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

historyFiltersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    historyPage = 1;
    loadHistory();
});
historyPrevBtn.addEventListener('click', () => { historyPage = Math.max(1, historyPage - 1); loadHistory(); });
historyNextBtn.addEventListener('click', () => { historyPage += 1; loadHistory(); });

let openRecordingId = null;

function openHistoryDetail(id) {
    fetch(`/api/v1/recordings/${id}`)
        .then((res) => res.json().then((data) => {
            if (!res.ok) throw new Error(data.error || 'تفصیل لوڈ کرنے میں خرابی');
            return data;
        }))
        .then((rec) => {
            openRecordingId = rec.id;
            historyAudioPlayer.src = `/api/v1/recordings/${rec.id}/audio`;
            historyTranscriptionText.value = rec.transcriptionText || '';
            historyTranslationText.value = rec.translationText || '';
            historyDetail.classList.remove('hidden');
            historyDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch((err) => showToast('تفصیل لوڈ کرنے میں خرابی: ' + err.message, 'error'));
}

historyDetailClose.addEventListener('click', () => {
    historyDetail.classList.add('hidden');
    historyAudioPlayer.pause();
    historyAudioPlayer.src = '';
    openRecordingId = null;
});

document.getElementById('historyExportTxtBtn').addEventListener('click', () => {
    if (openRecordingId) window.location.href = `/api/v1/recordings/${openRecordingId}/export?format=txt`;
});
document.getElementById('historyExportDocxBtn').addEventListener('click', () => {
    if (openRecordingId) window.location.href = `/api/v1/recordings/${openRecordingId}/export?format=docx`;
});
document.getElementById('historyExportPdfBtn').addEventListener('click', () => {
    if (openRecordingId) window.location.href = `/api/v1/recordings/${openRecordingId}/export?format=pdf`;
});

historyDeleteBtn.addEventListener('click', () => {
    if (!openRecordingId) return;
    if (!window.confirm('کیا آپ واقعی اس ریکارڈنگ کو حذف کرنا چاہتے ہیں؟')) return;

    fetch(`/api/v1/recordings/${openRecordingId}`, { method: 'DELETE' })
        .then((res) => {
            if (!res.ok && res.status !== 204) throw new Error('حذف کرنے میں خرابی');
            showToast('ریکارڈنگ حذف کر دی گئی۔', 'success');
            historyDetailClose.click();
            loadHistory();
        })
        .catch((err) => showToast(err.message, 'error'));
});

updateTranslateButtonState();
