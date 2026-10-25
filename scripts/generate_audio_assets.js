const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const audioDir = path.join(__dirname, "../public/audio");
fs.mkdirSync(audioDir, { recursive: true });

function makeWav(samples, sampleRate = 44100) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7FFF, 44 + i * 2);
  }
  return buffer;
}

const sr = 44100;

// 1. Whoosh (aerodynamic transition sweep)
{
  const dur = 0.55;
  const samples = new Float32Array(Math.floor(sr * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / sr;
    const progress = t / dur;
    const env = Math.sin(Math.PI * progress);
    const noise = (Math.random() * 2 - 1);
    const sweep = Math.sin(2 * Math.PI * (250 + progress * 600) * t);
    samples[i] = (noise * 0.6 + sweep * 0.4) * env * 0.9;
  }
  const wavPath = path.join(audioDir, "whoosh.wav");
  fs.writeFileSync(wavPath, makeWav(samples));
  execSync(`npx remotion ffmpeg -y -i "${wavPath}" "${path.join(audioDir, "whoosh.mp3")}"`);
  fs.unlinkSync(wavPath);
}

// 2. Stamp (mechanical heavy thud)
{
  const dur = 0.35;
  const samples = new Float32Array(Math.floor(sr * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 22);
    const thud = Math.sin(2 * Math.PI * 90 * (1 - t * 2) * t);
    const click = (Math.random() * 2 - 1) * Math.exp(-t * 80);
    samples[i] = (thud * 0.85 + click * 0.35) * env;
  }
  const wavPath = path.join(audioDir, "stamp.wav");
  fs.writeFileSync(wavPath, makeWav(samples));
  execSync(`npx remotion ffmpeg -y -i "${wavPath}" "${path.join(audioDir, "stamp.mp3")}"`);
  fs.unlinkSync(wavPath);
}

// 3. Click (sharp UI tap)
{
  const dur = 0.08;
  const samples = new Float32Array(Math.floor(sr * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 70);
    const click = Math.sin(2 * Math.PI * 1800 * t) * (Math.random() * 0.5 + 0.5);
    samples[i] = click * env * 0.9;
  }
  const wavPath = path.join(audioDir, "click.wav");
  fs.writeFileSync(wavPath, makeWav(samples));
  execSync(`npx remotion ffmpeg -y -i "${wavPath}" "${path.join(audioDir, "click.mp3")}"`);
  fs.unlinkSync(wavPath);
}

// 4. Turbine (dual turbine fan whine & spinup)
{
  const dur = 2.4;
  const samples = new Float32Array(Math.floor(sr * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / sr;
    const ramp = Math.min(1, t / 0.8);
    const fadeOut = Math.max(0, 1 - (t - 1.8) / 0.6);
    const freq1 = 180 + 320 * (t / dur);
    const freq2 = 360 + 640 * (t / dur);
    const tone = Math.sin(2 * Math.PI * freq1 * t) * 0.5 + Math.sin(2 * Math.PI * freq2 * t) * 0.3;
    const hiss = (Math.random() * 2 - 1) * 0.25;
    samples[i] = (tone + hiss) * ramp * (t > 1.8 ? fadeOut : 1) * 0.7;
  }
  const wavPath = path.join(audioDir, "turbine.wav");
  fs.writeFileSync(wavPath, makeWav(samples));
  execSync(`npx remotion ffmpeg -y -i "${wavPath}" "${path.join(audioDir, "turbine.mp3")}"`);
  fs.unlinkSync(wavPath);
}

// 5. Thruster (SpaceX cold-gas jet blast)
{
  const dur = 1.6;
  const samples = new Float32Array(Math.floor(sr * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / sr;
    const env = Math.sin(Math.min(1, t / 0.1) * Math.PI / 2) * Math.exp(-t * 2.2);
    const noise = (Math.random() * 2 - 1);
    const subBass = Math.sin(2 * Math.PI * 65 * t);
    samples[i] = (noise * 0.7 + subBass * 0.4) * env * 0.95;
  }
  const wavPath = path.join(audioDir, "thruster.wav");
  fs.writeFileSync(wavPath, makeWav(samples));
  execSync(`npx remotion ffmpeg -y -i "${wavPath}" "${path.join(audioDir, "thruster.mp3")}"`);
  fs.unlinkSync(wavPath);
}

// 6. Ding (Outro chime)
{
  const dur = 1.2;
  const samples = new Float32Array(Math.floor(sr * dur));
  for (let i = 0; i < samples.length; i++) {
    const t = i / sr;
    const env = Math.exp(-t * 4);
    samples[i] = (Math.sin(2 * Math.PI * 1760 * t) * 0.7 + Math.sin(2 * Math.PI * 3520 * t) * 0.3) * env * 0.8;
  }
  const wavPath = path.join(audioDir, "ding.wav");
  fs.writeFileSync(wavPath, makeWav(samples));
  execSync(`npx remotion ffmpeg -y -i "${wavPath}" "${path.join(audioDir, "ding.mp3")}"`);
  fs.unlinkSync(wavPath);
}

console.log("SFX successfully generated!");

// 7. Generate Narration Lines using macOS say (voice: Daniel)
const scenes = [
  { id: "scene1", text: "Can Tesla's Roadster really drive upside down? A viral demonstration claimed to defy gravity." },
  { id: "scene2", text: "The problem? A sports car weighs thirty-eight hundred pounds. Gravity pulls it down with one G." },
  { id: "scene3", text: "Normal wings require high speeds. Tesla used active ground-sealing skirts, turning the car into a giant suction cup." },
  { id: "scene4", text: "Twin turbine fans spin at twenty-five thousand RPM, generating seventy-six hundred pounds of downforce. That is two Gs." },
  { id: "scene5", text: "To maneuver and flip mid-air, SpaceX cold-gas thrusters fire compressed gas bursts at ten thousand PSI." },
  { id: "scene6", text: "Can you drive this on public streets? No. Potholes break the seal instantly, and fans shoot gravel like shrapnel." },
  { id: "scene7", text: "It is not science fiction. It is aerospace suction. Subscribe to Minute Mysteries for more engineering breakdowns!" }
];

scenes.forEach((s) => {
  const wav = path.join(audioDir, `${s.id}_narration.wav`);
  const mp3 = path.join(audioDir, `${s.id}_narration.mp3`);
  execSync(`say -v Daniel --file-format=WAVE --data-format=LEI16@44100 "${s.text}" -o "${wav}"`);
  execSync(`npx remotion ffmpeg -y -i "${wav}" "${mp3}"`);
  fs.unlinkSync(wav);
  console.log(`Generated ${s.id}_narration.mp3`);
});

// Full Master Narration
const fullScript = scenes.map(s => s.text).join(" [[slnc 400]] ");
const masterWav = path.join(audioDir, "narration.wav");
const masterMp3 = path.join(audioDir, "narration.mp3");
execSync(`say -v Daniel --file-format=WAVE --data-format=LEI16@44100 "${fullScript}" -o "${masterWav}"`);
execSync(`npx remotion ffmpeg -y -i "${masterWav}" "${masterMp3}"`);
fs.unlinkSync(masterWav);
console.log("Master narration.mp3 successfully generated!");
