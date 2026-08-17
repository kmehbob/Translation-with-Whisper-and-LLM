// Global variables
let mediaRecorder = null;
let audioChunks = [];
let recordingStream = null;
let recordingStartTime = 0;
let recordingTimer = null;
let translateInFlight = false;
let transcribing = false;

// UI Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const instructions = document.getElementById('instructions');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const urduText = document.getElementById('urduText');
const englishText = document.getElementById('englishText');
const debug = document.getElementById('debug');
const copyUrduBtn = document.getElementById('copyUrduBtn');
const copyEnglishBtn = document.getElementById('copyEnglishBtn');
const translateBtn = document.getElementById('translateBtn');
const translateStatus = document.getElementById('translateStatus');
const translateError = document.getElementById('translateError');
const staleNotice = document.getElementById('staleNotice');
const recordingStatus = document.getElementById('recordingStatus');
const recordingTime = document.getElementById('recordingTime');
const clearBtn = document.getElementById('clearBtn');
const audioFileInput = document.getElementById('audioFileInput');

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

const permissionBtn = document.getElementById('permissionBtn');
if (permissionBtn) permissionBtn.addEventListener('click', requestMicPermission);
if (startBtn) startBtn.addEventListener('click', startRecording);
if (stopBtn) stopBtn.addEventListener('click', stopRecording);

function requestMicPermission() {
    errorMsg.classList.add('hidden');

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            stream.getTracks().forEach(track => track.stop());
            logDebug('Permission granted');

            step1.classList.add('hidden');
            step2.classList.remove('hidden');
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

// --- Urdu text / translation state -----------------------------------

function markTranslationStale() {
    if (englishText.value.trim() !== '') {
        staleNotice.classList.remove('hidden');
    }
    copyEnglishBtn.disabled = true;
}

function clearTranslationState() {
    englishText.value = '';
    staleNotice.classList.add('hidden');
    copyEnglishBtn.disabled = true;
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
            translateError.textContent = 'متن کاپی کرنے میں خرابی۔';
            translateError.classList.remove('hidden');
        });
}

copyUrduBtn.addEventListener('click', function () {
    copyToClipboard(urduText.value, copyUrduBtn, 'کاپی ہو گیا!');
});

copyEnglishBtn.addEventListener('click', function () {
    if (copyEnglishBtn.disabled) return;
    copyToClipboard(englishText.value, copyEnglishBtn, 'Copied!');
});

translateBtn.addEventListener('click', function () {
    const text = urduText.value.trim();

    // Never send a translation request for empty input, and never allow a
    // second request to start while one is already in flight.
    if (!text || translateInFlight) return;

    translateInFlight = true;
    updateTranslateButtonState();
    translateBtn.setAttribute('aria-busy', 'true');
    translateBtn.innerHTML = 'ترجمہ ہو رہا ہے... <span class="spinner"></span>';
    translateStatus.textContent = 'انگریزی ترجمہ تیار کیا جا رہا ہے...';
    translateError.classList.add('hidden');

    fetch('/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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
                translateStatus.textContent = 'ترجمہ مکمل ہوگیا۔';
                englishText.focus();
            } else {
                // The Urdu text was edited while this request was still in
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
        })
        .finally(function () {
            translateInFlight = false;
            translateBtn.removeAttribute('aria-busy');
            translateBtn.textContent = '🌐 انگریزی میں ترجمہ کریں';
            updateTranslateButtonState();
        });
});

clearBtn.addEventListener('click', function () {
    urduText.value = '';
    clearTranslationState();
    updateTranslateButtonState();
    translateError.classList.add('hidden');
    translateStatus.textContent = '';
});

// --- Recording ----------------------------------------------------------

function startRecording() {
    urduText.value = '';
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
            };

            mediaRecorder.start(1000);
            logDebug('Recording started');

            startBtn.disabled = true;
            stopBtn.disabled = false;
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

            sendAudioToServer(audioFile);
        }
    };

    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
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

        sendAudioToServer(audioFile);
    } catch (error) {
        logDebug('Error creating iOS audio file: ' + error.message);
        urduText.value = "آڈیو فائل بنانے میں خرابی: " + error.message;
        recordingStatus.textContent = "ریکارڈنگ تیار ہے";
    }
}

function sendAudioToServer(file) {
    urduText.value = "ٹرانسکرپشن ہو رہی ہے...";
    transcribing = true;
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

    // The server reads the "device" field while it is still streaming the
    // "file" part, so it must be appended first - multipart fields are read
    // in append order, and a device hint that arrives after the file is
    // already too late to affect how that file gets validated.
    if (isIOS) {
        formData.append("device", "ios");
    } else if (isMacOS) {
        formData.append("device", "macos");
    } else if (isAndroid) {
        formData.append("device", "android");
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
            recordingStatus.textContent = "ریکارڈنگ تیار ہے";
            if (!data.text || !data.text.trim()) {
                urduText.placeholder = "کوئی متن نہیں ملا۔ دوبارہ کوشش کریں یا خود ٹائپ کریں۔";
            }
        })
        .catch(function (error) {
            logDebug('Transcription error: ' + error.message);
            urduText.value = "";
            translateError.textContent = "ٹرانسکرپشن میں خرابی: " + error.message;
            translateError.classList.remove('hidden');
            recordingStatus.textContent = "ریکارڈنگ تیار ہے";
        })
        .finally(function () {
            transcribing = false;
            updateTranslateButtonState();
        });
}

if (audioFileInput) {
    audioFileInput.addEventListener('change', function () {
        const file = audioFileInput.files && audioFileInput.files[0];
        if (file) {
            sendAudioToServer(file);
            audioFileInput.value = '';
        }
    });
}

if (isIOS) {
    document.addEventListener('touchstart', function () {
        // This empty handler helps initialize audio on iOS
    }, { once: true });
}

updateTranslateButtonState();
