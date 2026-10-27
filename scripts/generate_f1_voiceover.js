const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const audioDir = path.join(__dirname, "../public/audio");
fs.mkdirSync(audioDir, { recursive: true });
const SR = 44100;

function readWavMonoFloat32(wavPath) {
  const buf = fs.readFileSync(wavPath);
  let offset = 12;
  while (offset < buf.length - 8) {
    const chunkId = buf.toString("ascii", offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    if (chunkId === "data") {
      const count = Math.floor(chunkSize / 2);
      const out = new Float32Array(count);
      const start = offset + 8;
      for (let i = 0; i < count && start + i * 2 + 1 < buf.length; i++) {
        out[i] = buf.readInt16LE(start + i * 2) / 32768.0;
      }
      return out;
    }
    offset += 8 + chunkSize;
  }
  throw new Error(`No data chunk found in ${wavPath}`);
}

function makeWavMono(samples, sampleRate = SR) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, 44 + i * 2);
  }
  return buffer;
}

function normalizeSpeechToLUFS(samples, targetLUFS = -15.0, maxTruePeakDB = -1.5) {
  const out = new Float32Array(samples.length);
  const rc = 1.0 / (2.0 * Math.PI * 85.0);
  const dt = 1.0 / SR;
  const alpha = rc / (rc + dt);
  let prevIn = 0;
  let prevOut = 0;
  for (let i = 0; i < samples.length; i++) {
    const x = samples[i];
    const y = alpha * (prevOut + x - prevIn);
    prevIn = x;
    prevOut = y;
    const diff = i > 0 ? x - samples[i - 1] : 0;
    out[i] = y + diff * 0.35;
  }
  const blockSize = Math.floor(SR * 0.1);
  let activeEnergySum = 0;
  let activeSampleCount = 0;
  for (let b = 0; b < out.length; b += blockSize) {
    const end = Math.min(out.length, b + blockSize);
    let blockSum = 0;
    for (let i = b; i < end; i++) blockSum += out[i] * out[i];
    if (Math.sqrt(blockSum / (end - b)) > 0.0056) {
      activeEnergySum += blockSum;
      activeSampleCount += end - b;
    }
  }
  const meanSquare = activeSampleCount > 0 ? activeEnergySum / activeSampleCount : 1e-6;
  const currentLUFS = -0.691 + 10.0 * Math.log10(Math.max(1e-9, meanSquare));
  const linearGain = Math.pow(10.0, (targetLUFS - currentLUFS) / 20.0);
  const maxPeakLinear = Math.pow(10.0, maxTruePeakDB / 20.0);
  for (let i = 0; i < out.length; i++) {
    let v = out[i] * linearGain;
    if (Math.abs(v) > maxPeakLinear) {
      const sign = v < 0 ? -1 : 1;
      v = sign * (maxPeakLinear + Math.tanh((Math.abs(v) - maxPeakLinear) * 3.0) * (0.98 - maxPeakLinear));
    }
    out[i] = v;
  }
  return out;
}

const scenes = [
  {
    name: "f1_scene1.mp3",
    duration: 8.0,
    text: "Some F1 drivers finish a race up to nine pounds lighter. Not fat. In under two hours. Where does it go?",
  },
  {
    name: "f1_scene2.mp3",
    duration: 8.0,
    text: "The cockpit hits 122 degrees. Fireproof suit. Helmet. Humid air. Heart rate averaging 170 beats a minute. Nonstop. For two hours.",
  },
  {
    name: "f1_scene3.mp3",
    duration: 9.0,
    text: "Sweat is the main cooling system. Up to two litres an hour. And one litre of water weighs one kilo. Do the math.",
  },
  {
    name: "f1_scene4.mp3",
    duration: 9.0,
    text: "But the drink bottle can't keep up. There's no water stop, and no toilet break. So drivers sweat out far more than they drink.",
  },
  {
    name: "f1_scene5.mp3",
    duration: 9.0,
    text: "Qatar, 2023. Extreme heat and humidity. One driver was sick in his helmet. Another retired from heat exhaustion. Some reported losing four kilos.",
  },
  {
    name: "f1_scene6.mp3",
    duration: 8.0,
    text: "The twist? It's not fat. It's water. Drivers rehydrate after the flag, and the weight returns within about a day.",
  },
  {
    name: "f1_scene7.mp3",
    duration: 9.0,
    text: "So that nine pounds is sweat, not fat. The price of racing at 170 beats a minute. Follow and subscribe for tomorrow's mystery.",
  },
];

console.log("Generating & mastering F1 narration audio tracks (-15 LUFS)...");

function compactLongSilences(samples, maxPauseSec = 0.14, threshold = 0.009) {
  const maxSilentSamples = Math.floor(SR * maxPauseSec);
  const kept = [];
  let silentRun = 0;
  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) < threshold) {
      silentRun++;
      if (silentRun <= maxSilentSamples) kept.push(samples[i]);
    } else {
      silentRun = 0;
      kept.push(samples[i]);
    }
  }
  return new Float32Array(kept);
}

for (const sc of scenes) {
  const wavPath = path.join(audioDir, sc.name.replace(".mp3", ".wav"));
  const mp3Path = path.join(audioDir, sc.name);

  execSync(
    `say -v Samantha -r 205 "${sc.text.replace(/"/g, '\\"')}" --file-format=WAVE --data-format=LEI16@44100 -o "${wavPath}"`
  );

  const rawSamples = compactLongSilences(readWavMonoFloat32(wavPath), 0.13);
  const masteredSamples = normalizeSpeechToLUFS(rawSamples, -15.0, -1.5);
  fs.writeFileSync(wavPath, makeWavMono(masteredSamples));

  execSync(`npx remotion ffmpeg -y -i "${wavPath}" -b:a 192k "${mp3Path}"`, { stdio: "ignore" });
  fs.unlinkSync(wavPath);

  console.log(`✓ Generated & Normalized ${sc.name} (${(masteredSamples.length / SR).toFixed(2)}s / ${sc.duration}s, -15.0 LUFS)`);
}

console.log("All F1 voice tracks mastered successfully!");
