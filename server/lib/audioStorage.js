const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static").path;
const config = require("./config");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const recordingsDir = config.recordingsDir || path.join(__dirname, "..", "recordings");
fs.mkdirSync(recordingsDir, { recursive: true });

// Converts any supported input audio format to MP3 and returns the output
// path + metadata. The source file is left untouched - callers decide
// whether to delete it. Writes into recordingsDir (permanent storage) by
// default; callers that only need a throwaway MP3 (e.g. a plain
// convert-and-download utility) can pass a different, transient destDir.
function convertToMp3(sourcePath, destDir = recordingsDir) {
    return new Promise((resolve, reject) => {
        const storedFilename = `${randomUUID()}.mp3`;
        const destPath = path.join(destDir, storedFilename);

        ffmpeg(sourcePath)
            .audioCodec("libmp3lame")
            .audioBitrate("128k")
            .format("mp3")
            .on("error", (err) => reject(new Error(`Audio conversion failed: ${err.message}`)))
            .on("end", () => {
                const fileSizeBytes = fs.statSync(destPath).size;
                resolve({ storedFilename, storedPath: destPath, fileSizeBytes });
            })
            .save(destPath);
    });
}

function probeDurationSeconds(filePath) {
    return new Promise((resolve) => {
        ffmpeg.ffprobe(filePath, (err, data) => {
            if (err || !data?.format?.duration) return resolve(null);
            resolve(Number(data.format.duration));
        });
    });
}

function storedFilePath(storedFilename) {
    return path.join(recordingsDir, storedFilename);
}

async function deleteStoredFile(storedFilename) {
    if (!storedFilename) return;
    await fs.promises.rm(storedFilePath(storedFilename), { force: true });
}

module.exports = { recordingsDir, convertToMp3, probeDurationSeconds, storedFilePath, deleteStoredFile };
