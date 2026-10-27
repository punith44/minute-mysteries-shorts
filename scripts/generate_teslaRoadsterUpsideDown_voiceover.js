#!/usr/bin/env node
/**
 * Synthesizes per-scene narration with macOS `say`, then encodes to MP3 with
 * Remotion's bundled ffmpeg. Each MP3 is padded/trimmed to its scene duration.
 *
 *   node scripts/generate_teslaRoadsterUpsideDown_voiceover.js
 *   VOICE=Alex RATE=170 node scripts/generate_teslaRoadsterUpsideDown_voiceover.js
 *
 * Run from the project root. List voices with: say -v '?'
 */
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

if (process.platform !== "darwin") {
    console.error("This script needs macOS (`say`). Run it on a Mac and commit the MP3s.");
    process.exit(1);
}

const TOPIC = "teslaRoadsterUpsideDown";
const VOICE = process.env.VOICE || "Daniel";
const RATE = process.env.RATE || "175"; // words per minute
const MAX_TEMPO = 1.3; // never speed speech up more than this
const TAIL_PAD = 0.25; // seconds of silence left before the scene ends
const OUT_DIR = path.join(__dirname, "..", "public", "audio");

// Text is the narration with TTS-friendly spellings (numbers/acronyms spelled out).
// `duration` must match the scene durations in src/topics/teslaRoadsterUpsideDown.reel.ts.
const SCENES = [
    { n: 1, duration: 8.0, text: "On October fifteenth, a Tesla Roadster drove upside down. Then it took off. No wings. No propellers. How?" },
    { n: 2, duration: 8.0, text: "To cling to a ceiling, a car needs downforce bigger than its own weight. Tyres alone can't. Gravity wins." },
    { n: 3, duration: 9.0, text: "Tesla's trick: fans under the car. They suck air out from beneath it, pinning it down with up to two gees." },
    { n: 4, duration: 9.0, text: "Then Space X tech takes over. Cold-gas thrusters blast compressed air, not fire. They flip the car mid-air and cushion the landing." },
    { n: 5, duration: 9.0, text: "Next, the stress test. It leapt over a Cybertruck and a Semi, twisting mid-air. Zero to sixty: a claimed zero point eight one seconds." },
    { n: 6, duration: 8.0, text: "But it was a controlled demo on a custom ramp. Road use, safety and twenty twenty-eight production? Still unproven." },
    { n: 7, duration: 9.0, text: "So here's the answer. Suction fans glue it to the ramp. Thrusters do the flying. Subscribe for tomorrow's mystery." },
];

const ffmpeg = (args) => spawnSync("npx", ["remotion", "ffmpeg", "-hide_banner", ...args], { encoding: "utf8" });

function probeSeconds(file) {
    // ffmpeg prints "Duration: HH:MM:SS.xx" to stderr (and exits 1 with no output file).
    const { stderr } = ffmpeg(["-i", file]);
    const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(stderr || "");
    if (!m) throw new Error(`Could not read duration of ${file}\n${stderr}`);
    return +m[1] * 3600 + +m[2] * 60 + +m[3];
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${TOPIC}-`));
let failed = false;

try {
    for (const { n, duration, text } of SCENES) {
        const wav = path.join(tmp, `scene${n}.wav`);
        const mp3 = path.join(OUT_DIR, `${TOPIC}_scene${n}.mp3`);

        execFileSync("say", [
            "-v", VOICE,
            "-r", RATE,
            "--file-format=WAVE",
            "--data-format=LEI16@44100",
            "-o", wav,
            text,
        ]);

        const speech = probeSeconds(wav);
        const budget = duration - TAIL_PAD;
        const tempo = speech > budget ? Math.min(speech / budget, MAX_TEMPO) : 1;

        const filters = ["highpass=f=85", "loudnorm=I=-15:TP=-1.5:LRA=9"];
        if (tempo > 1) filters.push(`atempo=${tempo.toFixed(3)}`);
        filters.push("apad"); // pad with silence, then -t trims to exact scene length

        const r = ffmpeg(["-y", "-i", wav, "-af", filters.join(","), "-t", String(duration), "-ar", "44100", "-ac", "1", "-b:a", "128k", mp3]);
        if (r.status !== 0) throw new Error(`ffmpeg failed for scene ${n}:\n${r.stderr}`);

        const final = speech / tempo;
        const over = final > budget + 0.01;
        if (over) failed = true;
        console.log(
            `scene ${n}: speech ${speech.toFixed(2)}s${tempo > 1 ? ` (tempo x${tempo.toFixed(2)} -> ${final.toFixed(2)}s)` : ""} / ${duration.toFixed(1)}s` +
            `${over ? "  !! TOO LONG: shorten the line" : ""}  -> ${path.relative(process.cwd(), mp3)}`
        );
    }
} finally {
    fs.rmSync(tmp, { recursive: true, force: true });
}

if (failed) {
    console.error("\nSome scenes overrun their duration. Shorten the narration (here and in the .reel.ts caption), then re-run.");
    process.exit(1);
}
console.log(`\nDone. ${SCENES.length} files in public/audio/`);