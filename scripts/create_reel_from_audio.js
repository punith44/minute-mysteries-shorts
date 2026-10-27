#!/usr/bin/env node
/**
 * Automated End-to-End Reel Generator
 *
 * Takes ANY voiceover audio (or video) file and automatically:
 * 1. Transcribes it with local Whisper to get exact word timestamps.
 * 2. Normalizes audio to -15.0 LUFS broadcast loudness.
 * 3. Partitions the script into 6-8s scenes, with 1-to-3 word captions (maxWordsPerChunk: 3).
 * 4. Inserts 1.5s-2.5s visual beat cuts with camera zoom punches and presenter pose shifts.
 * 5. Generates src/topics/<topicName>.reel.ts and registers it in src/Composition.tsx.
 *
 * Usage:
 *   npm run reel:create <audio_path> [TopicName]
 *   node scripts/create_reel_from_audio.js public/audio/my_voice.mp3 QuantumMystery
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node scripts/create_reel_from_audio.js <audio_or_video_file> [TopicName]");
  console.log("Example: node scripts/create_reel_from_audio.js public/audio/sample.mp3 QuantumComputing");
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
if (!fs.existsSync(inputPath)) {
  console.error(`Error: File '${inputPath}' does not exist.`);
  process.exit(1);
}

const rawName = args[1] || path.basename(inputPath, path.extname(inputPath));
const topicName = rawName.charAt(0).toLowerCase() + rawName.slice(1).replace(/[^a-zA-Z0-9]/g, "");
const pascalName = topicName.charAt(0).toUpperCase() + topicName.slice(1);
const compositionId = `${pascalName}Short`;

const pythonBin = fs.existsSync(path.join(process.env.HOME, ".local/edit-tools/.venv/bin/python"))
  ? path.join(process.env.HOME, ".local/edit-tools/.venv/bin/python")
  : "python3";

const ffmpegBin = fs.existsSync(path.join(process.env.HOME, ".local/bin/ffmpeg"))
  ? path.join(process.env.HOME, ".local/bin/ffmpeg")
  : "ffmpeg";

console.log(`\n🎬 Creating automated Reel for '${pascalName}'...`);
console.log(`   Source audio: ${inputPath}`);

// 1. Transcribe with Whisper
const tmpTranscript = path.join("/tmp", `_transcript_${Date.now()}.json`);
console.log("\n1. Running local Whisper transcription with exact word timestamps...");
execSync(`"${pythonBin}" "${path.join(__dirname, "transcribe.py")}" "${inputPath}" --model base --out "${tmpTranscript}"`, { stdio: "inherit" });

const words = JSON.parse(fs.readFileSync(tmpTranscript, "utf-8"));
fs.unlinkSync(tmpTranscript);

if (!words || words.length === 0) {
  console.error("Error: Whisper did not detect any speech in the audio.");
  process.exit(1);
}

const totalDuration = words[words.length - 1].end;
console.log(`\n2. Audio duration: ${totalDuration.toFixed(2)}s (${words.length} words detected)`);

// 2. Normalize and copy audio to public/audio/<topicName>_narration.mp3
const publicAudioDir = path.join(__dirname, "../public/audio");
fs.mkdirSync(publicAudioDir, { recursive: true });
const targetAudioFile = `${topicName}_narration.mp3`;
const targetAudioPath = path.join(publicAudioDir, targetAudioFile);

console.log(`\n3. Mastering audio to -15.0 LUFS -> public/audio/${targetAudioFile}...`);
execSync(`"${ffmpegBin}" -y -i "${inputPath}" -af "highpass=f=85,loudnorm=I=-15:TP=-1.5:LRA=9" -ar 44100 -ac 1 -b:a 192k "${targetAudioPath}"`, { stdio: "ignore" });

// 3. Partition words into 6.0s - 8.5s Scenes
const scenes = [];
let currentSceneWords = [];
let sceneStartSec = words[0].start;

for (let i = 0; i < words.length; i++) {
  const w = words[i];
  currentSceneWords.push(w);

  const sceneElapsed = w.end - sceneStartSec;
  const isPunctuation = /[.!?]$/.test(w.text);
  const nextWord = words[i + 1];
  const isLastWord = i === words.length - 1;

  if ((isPunctuation && sceneElapsed >= 6.0) || sceneElapsed >= 9.0 || isLastWord) {
    const rawSceneDuration = w.end - sceneStartSec;
    const sceneDuration = Number(Math.max(6.0, rawSceneDuration + 0.4).toFixed(1));

    // Re-offset word timestamps relative to scene start
    const relativeWords = currentSceneWords.map((tw) => {
      const isAccent = tw.text.length >= 6 || /^[0-9]+/.test(tw.text);
      return {
        text: isAccent ? `*${tw.text}*` : tw.text,
        at: Number((tw.start - sceneStartSec).toFixed(2)),
        end: Number((tw.end - sceneStartSec).toFixed(2)),
        ...(isAccent ? { accent: true, zoomKick: 1.055 } : {}),
      };
    });

    scenes.push({
      startSec: sceneStartSec,
      duration: sceneDuration,
      words: relativeWords,
    });

    currentSceneWords = [];
    if (nextWord) sceneStartSec = nextWord.start;
  }
}

console.log(`\n4. Partitioned speech into ${scenes.length} dynamic scenes.`);

// 4. Generate TypeScript Configuration
const widgetTypes = ["metric_counter", "checklist", "comparison_grid", "chart_trend", "physics_diagram"];
const gestures = ["point_up_left", "open_palm", "shocked_hands", "thumbs_up"];
const ambientEffects = ["halftone_rays", "radar_rings", "orbital_grid", "speed_lines"];

const sceneConfigs = scenes.map((sc, idx) => {
  const num = (idx + 1).toString().padStart(2, "0");
  const widgetType = widgetTypes[idx % widgetTypes.length];
  const ambient = ambientEffects[idx % ambientEffects.length];
  const gesture = gestures[idx % gestures.length];

  // 1.5s - 2.5s cut velocity beats
  const beats = [];
  const beatCount = Math.floor(sc.duration / 2.2);
  for (let b = 1; b <= beatCount; b++) {
    const at = Number((b * 2.1).toFixed(1));
    if (at < sc.duration - 0.6) {
      beats.push({
        at,
        cameraZoom: 1.04 + (b % 2) * 0.03,
        cameraPanX: (b % 2 === 0 ? 10 : -10),
        presenterGesture: gestures[(idx + b) % gestures.length],
      });
    }
  }

  // Construct sensible widget specs
  let widgetCode = "";
  if (widgetType === "metric_counter") {
    widgetCode = `{
        type: "metric_counter",
        windowTitle: "data.metric.counter",
        theme: "dark",
        from: 0,
        to: ${Math.round((idx + 1) * 240)},
        unit: "POINTS",
        sublabel: "LIVE TELEMETRY READOUT",
        directionIcon: "up",
        circleHighlightAt: 2.0,
      }`;
  } else if (widgetType === "checklist") {
    widgetCode = `{
        type: "checklist",
        title: "Key Takeaways // Step ${idx + 1}",
        badgeProgress: "3/3",
        enterAt: 0.12,
        items: [
          { number: "01", text: "Direct attention hook", checkedAt: 1.8 },
          { number: "02", text: "1-to-3 word kinetic captions", checkedAt: 3.6 },
          { number: "03", text: "Sub-scene cut velocity", checkedAt: 5.2, highlight: true },
        ],
      }`;
  } else if (widgetType === "comparison_grid") {
    widgetCode = `{
        type: "comparison_grid",
        windowTitle: "comparison.analysis",
        theme: "paper",
        enterAt: 0.12,
        columns: [
          { icon: "⚡", title: "TRADITIONAL", subtitle: "SLOW EDITS", statusText: "LOW RETENTION", tone: "bad" },
          { icon: "🚀", title: "PROGRAMMATIC", subtitle: "HIGH VELOCITY", statusText: "MAX RETENTION", tone: "good" },
        ],
        stamp: { text: "VERIFIED", slamAt: 4.2 },
      }`;
  } else if (widgetType === "chart_trend") {
    widgetCode = `{
        type: "chart_trend",
        title: "// views · retention curve",
        metricValue: "+84%",
        metricLabel: "retention",
        liveBadge: true,
        points: [12, 18, 28, 44, 62, 75, 88, 98],
      }`;
  } else {
    widgetCode = `{
        type: "physics_diagram",
        variant: "verdict_summary",
        windowTitle: "system.verdict",
        theme: "dark",
        ctaBanner: "FOLLOW FOR MORE",
      }`;
  }

  return `    {
      id: "scene_${num}",
      number: "${num}",
      label: "scene ${num}",
      duration: ${sc.duration},
      topRightCounter: { label: "SECTION", staticValue: "${num}/${scenes.length.toString().padStart(2, "0")}" },
      ambientEffect: "${ambient}",
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        styleVariant: "editorial_kinetic",
        activeHighlightColor: "#E8402A",
        words: ${JSON.stringify(sc.words, null, 8).replace(/\n/g, "\n        ")},
      },
      beats: ${JSON.stringify(beats, null, 8).replace(/\n/g, "\n      ")},
      widget: ${widgetCode},
      presenter: {
        character: "png_cutout",
        gesture: "${gesture}",
        eyeGlanceAtCard: true,
        speakingWindow: [0.1, ${Math.max(0.5, sc.duration - 0.4).toFixed(1)}],
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 2.0, type: "click" },
        { at: 4.2, type: "ding" },
      ],
      transitionOut: "halftone_wipe",
    }`;
}).join(",\n\n");

const reelTsContent = `import type { ReelConfig } from "../schema/reelSchema";

export const ${topicName}Reel: ReelConfig = {
  id: "${compositionId}",
  title: "${pascalName} Short",
  genre: "tech_explainer",
  fps: 30,
  width: 1080,
  height: 1920,
  defaultCharacter: "png_cutout",
  springOvershoot: 0.45,
  backgroundMusicSrc: "audio/bgm_ducked.mp3",
  backgroundMusicVolume: 0.5,
  scenes: [
${sceneConfigs}
  ],
};
`;

const topicsDir = path.join(__dirname, "../src/topics");
const targetReelPath = path.join(topicsDir, `${topicName}.reel.ts`);
fs.writeFileSync(targetReelPath, reelTsContent);
console.log(`\n5. ✓ Created ${path.relative(process.cwd(), targetReelPath)}`);

// 5. Register in src/Composition.tsx if missing
const compPath = path.join(__dirname, "../src/Composition.tsx");
let compSrc = fs.readFileSync(compPath, "utf-8");

if (!compSrc.includes(`${topicName}Reel`)) {
  console.log(`\n6. Registering '${compositionId}' in src/Composition.tsx...`);
  // Add import
  compSrc = `import { ${topicName}Reel } from "./topics/${topicName}.reel";\n` + compSrc;
  
  // Add Component definition
  const componentSnippet = `
export const ${pascalName}Short: React.FC = () => {
  return <ReelEngine config={${topicName}Reel} enableVoiceover={false} />;
};
`;
  compSrc = compSrc.replace("export const VideoComposition: React.FC", `${componentSnippet}\nexport const VideoComposition: React.FC`);

  // Add Composition entry
  const entrySnippet = `
      {/* ${pascalName} Automated Short */}
      <Composition
        id={${topicName}Reel.id}
        component={${pascalName}Short}
        durationInFrames={getReelDurationInFrames(${topicName}Reel)}
        fps={${topicName}Reel.fps ?? 30}
        width={${topicName}Reel.width ?? 1080}
        height={${topicName}Reel.height ?? 1920}
      />
    </>`;
  compSrc = compSrc.replace("</>", entrySnippet);
  fs.writeFileSync(compPath, compSrc);
  console.log(`   ✓ Registered Composition ID: '${compositionId}'`);
}

// 6. Verify lint
console.log("\n7. Verifying TypeScript & ESLint...");
execSync("npm run lint", { stdio: "inherit" });

console.log(`\n🎉 SUCCESS! Your new reel '${compositionId}' is completely ready.`);
console.log(`\nPreview in Studio:`);
console.log(`  npm run dev`);
console.log(`\nRender MP4 Video:`);
console.log(`  npx remotion render src/index.ts ${compositionId} out/${topicName}.mp4`);
