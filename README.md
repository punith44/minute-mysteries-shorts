# Minute Mysteries — Programmatic Reel Engine

A modular, data-driven programmatic video generation engine built with **Remotion**, **React**, and **TypeScript**. 

Designed to render high-retention 9:16 vertical shorts (YouTube Shorts, Instagram Reels, TikTok) with real MP4 video clips & B-roll, editorial tactile aesthetics, Hooke's law spring physics, word-timed kinetic captions, articulated vector presenter rigs with eye-blinks, continuous cinematic camera drift, and halftone dot-matrix transitions matching top programmatic explainer reels (e.g., Adilet / Minute Mysteries).

---

## 🤖 Instructions for AI Agents & LLMs

> **Prompt Context for LLMs:** If you are an AI assistant (Claude, GPT, Gemini, Cursor, Copilot, etc.) asked to **"create a new reel / video"** on any topic, read this section and [`docs/LLM_REEL_PROMPT_FRAMEWORK.md`](./docs/LLM_REEL_PROMPT_FRAMEWORK.md) first! You only need to touch **TWO** files.

### The 2-File Recipe to Generate Any New Video:

1. **Create the Topic Configuration File:**  
   Create `src/topics/<topicName>.reel.ts` exporting a `ReelConfig` object typed by `import type { ReelConfig } from "../schema/reelSchema";`.  
   *(Follow the complete schema reference below in [LLM Schema Specification](#llm-schema-specification-reelconfig)).*

2. **Register the Composition:**  
   In `src/Composition.tsx`, import your config and register a new `<Composition>` entry:
   ```tsx
   import { myNewTopicReel } from "./topics/myNewTopic.reel";

   export const MyNewTopicShort: React.FC = () => {
     return <ReelEngine config={myNewTopicReel} />;
   };

   // Inside VideoComposition:
   <Composition
     id={myNewTopicReel.id}
     component={MyNewTopicShort}
     durationInFrames={getReelDurationInFrames(myNewTopicReel)}
     fps={myNewTopicReel.fps ?? 30}
     width={myNewTopicReel.width ?? 1080}
     height={myNewTopicReel.height ?? 1920}
   />
   ```

3. **Verify & Render:**  
   - Type check: `npm run lint`
   - Render still frame: `npx remotion still src/index.ts <ReelId> out/test.png --frame=45`
   - Render video: `npx remotion render src/index.ts <ReelId> out/<topicName>.mp4`

**You do NOT need to write any new React animation components, CSS, or canvas code!** The engine (`ReelEngine`, `SceneRenderer`, `WidgetRegistry`, `RiggedPresenter`, `WordTimedCaption`) handles all 60fps spring math, transitions, mouth sync, and rendering automatically.

---

## Table of Contents
1. [LLM Schema Specification (ReelConfig)](#llm-schema-specification-reelconfig)
2. [Visual Widget Library (Cheat Sheet)](#visual-widget-library-cheat-sheet)
3. [Quickstart Guide for Humans](#quickstart-guide-for-humans)
   - [Interactive Studio Preview](#1-interactive-studio-preview-npm-run-dev)
   - [Exporting MP4 Videos](#2-exporting-mp4-videos)
   - [Sound Effects & Voiceovers](#3-sound-effects--voiceovers)
4. [Visual Architecture & Physics Breakdown](#visual-architecture--physics-breakdown)
   - [The 4-Zone Vertical Grid (1080×1920)](#the-4-zone-vertical-grid-10801920)
   - [Kinetic Captioning Rules](#kinetic-captioning-rules)
   - [Presenter Rigs & Syncing](#presenter-rigs--syncing)
5. [Complete Working Example Config](#complete-working-example-config)
6. [Directory Structure](#directory-structure)
7. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## LLM Schema Specification (`ReelConfig`)

Every video is completely defined by TypeScript interfaces exported from [`src/schema/reelSchema.ts`](./src/schema/reelSchema.ts):

```typescript
export interface ReelConfig {
  id: string;                     // Unique PascalCase ID, e.g. "QuantumComputingShort"
  title: string;                  // Human-readable title
  genre?: "tech_explainer" | "scientific_breakdown" | "historical_mystery" | "dark_psychology" | "motivational";
  fps?: number;                   // Default: 30
  width?: number;                 // Default: 1080
  height?: number;                // Default: 1920
  defaultCharacter?: "png_cutout" | "bearded_human" | "pip_mascot"; // Default: "png_cutout" (3D reference poses)
  springOvershoot?: number;       // Default: 0.45 (0.0 to 0.85 Hooke's law bounce)
  backgroundMusicSrc?: string;    // Default: "audio/bgm_ducked.mp3" (-20dB sidechain ducked)
  backgroundMusicVolume?: number; // Default: 0.52
  scenes: SceneConfig[];          // Array of sequential scenes
}

export interface SceneConfig {
  id: string;                     // e.g. "01_hook"
  number: string;                 // e.g. "01"
  label: string;                  // e.g. "the mystery", "the problem", "the verdict"
  duration: number;               // Duration in seconds (e.g. 6.0). Total frames = duration * fps
  topRightCounter: {
    label: string;                // e.g. "FOLLOWERS", "WEIGHT", "TEMP", "STEP"
    from?: number;                // Interpolate from number (optional)
    to?: number;                  // Interpolate to number (optional)
    staticValue?: string;         // OR static text like "1/7", "CONFIRMED", "150M °C"
    suffix?: string;              // e.g. " LBS", " RPM"
  };
  caption: {
    keyWordLead?: number;         // Seconds accent words pop early (default: 0.12s)
    maxWordsPerChunk?: number;    // 1 to 3 words on screen at once (default: 3)
    styleVariant?: "editorial_kinetic" | "viral_bold"; // Typography preset
    activeHighlightColor?: string;// Active word accent color (e.g. "#E8402A", "#FFFF00", "#00FF66")
    ghostUnrevealed?: boolean;    // If true, lookahead words in the 3-word chunk show at 15% opacity
    words: Array<{
      text: string;               // Word text. Use *asterisks* (e.g. "*40,000*") for red serif emphasis
      at: number;                 // Exact spoken start time in seconds from start of this scene
      end?: number;               // Optional exact spoken end time in seconds
      accent?: boolean;           // If true (or asterisk wrapped), renders with kinetic emphasis
      zoomKick?: number;          // Camera punch scale when landed (e.g. 1.06)
    }>;
  };
  beats?: Array<{                 // 1.5s to 2.5s visual micro-cuts within the scene
    at: number;                   // Trigger time in seconds (every 1.5s - 2.5s)
    cameraZoom?: number;          // Target zoom punch (e.g. 1.07)
    cameraPanX?: number;          // Horizontal camera pan in px
    cameraPanY?: number;          // Vertical camera pan in px
    presenterGesture?: "point_up_left" | "open_palm" | "shocked_hands" | "thumbs_up";
    bannerText?: string;          // Kinetic impact banner (e.g. "UNLIMITED REELS")
    bannerAccentWord?: string;    // Highlighted word inside banner
    subTagOverride?: string;      // Top-left sub-tag update (e.g. "// b02 · the hand-off")
  }>;
  ambientEffect?: "halftone_rays" | "radar_rings" | "orbital_grid" | "hypnotic_pulse" | "speed_lines";
  calloutBubble?: {               // Optional floating speech bubble above hero card
    tag: string;                  // e.g. "1 FIRST", "1 GRAVITY", "2 VACUUM"
    sublabel?: string;            // e.g. "you might think"
    text: string;                 // e.g. "Gravity violently pulls down"
    icon?: string;                // e.g. "↓", "⚡", "🚀", "?"
    enterAt?: number;             // Seconds into scene (e.g. 0.2)
  };
  widget: WidgetSpec;             // The hero visual widget (see Widget Library below)
  presenter: {
    character?: "bearded_human" | "pip_mascot" | "png_cutout";
    gesture: "point_up_left" | "open_palm" | "shocked_hands" | "thumbs_up";
    eyeGlanceAtCard?: boolean;    // Default: true (pupils look toward upper-left card)
    speakingWindow?: [number, number]; // [startSec, endSec] when mouth moves
    scale?: number;               // Multiplier (default: 1.0)
    xOffset?: number;             // Offset in px
  };
  voiceoverSrc?: string;          // Optional audio file in public/ (e.g. "audio/scene1_narration.mp3")
  sfx?: Array<{
    at: number;                   // Trigger time in seconds
    type: "whoosh" | "stamp" | "click" | "turbine" | "thruster" | "ding";
    volume?: number;              // 0.0 to 1.0
  }>;
  transitionOut?: "halftone_wipe" | "none"; // Default: "halftone_wipe"
}
```

---

## Visual Widget Library (Cheat Sheet)

Use any of these 7 declarative widget types in your scene's `widget` field:

### 1. `checklist`
Renders an animated card with numbered checkboxes that check off at specified timestamps.
```typescript
widget: {
  type: "checklist",
  title: "Before launch",
  badgeProgress: "2/4",
  enterAt: 0.12,
  items: [
    { number: "1", text: "Know your rivals", checkedAt: 0.9 },
    { number: "2", text: "A page that takes money", checkedAt: 1.6 },
    { number: "3", text: "Programmatic motion reels" },
    { number: "4", text: "Daily feedback loop" },
  ]
}
```

### 2. `metric_counter`
Renders a large animated numerical counter, direction force vector arrow, and felt-pen circle.
```typescript
widget: {
  type: "metric_counter",
  windowTitle: "physics.gravity.loadcell",
  theme: "dark", // "dark" | "paper"
  from: 0,
  to: 3800,
  unit: "LBS",
  sublabel: "DOWNWARD GRAVITATIONAL LOAD (1.0 G)",
  directionIcon: "down", // "down" | "up" | "bolt" | "none"
  enterAt: 0.14,
  circleHighlightAt: 0.55, // Draws a red felt-pen circle around the value at 0.55s
  footerMetrics: [
    { label: "CURB MASS", value: "1,723 KG" },
    { label: "REQUIRED FORCE", value: "> 3,800 LBS", accent: true }
  ]
}
```

### 3. `notification_stack`
Recreates the viral social notification stack with tilted iPhone card, profile counter, red toast pill, and optional day flip calendar.
```typescript
widget: {
  type: "notification_stack",
  enterAt: 0.12,
  profileHandle: "adilet.fndr",
  postsCount: 26,
  followersFrom: 2283,
  followersTo: 39535,
  followingCount: 625,
  bioLine: "Digital creator · Tech & AI Education",
  toastIncrement: 38,
  calendarDay: { dayNumber: 35, label: "of posting", enterAt: 2.3 },
  notifications: [
    { init: "P", color: "#7B3FE4", user: "pri•••mk", time: "2s", btn: "Follow", enterAt: 0.28 },
    { init: "L", color: "#65A30D", user: "luk•••tz", time: "1s", btn: "Follow", enterAt: 0.55 },
    { init: "D", color: "#52525B", user: "dev•••am", time: "now", btn: "Following", enterAt: 0.85 }
  ]
}
```

### 4. `comparison_grid`
Renders side-by-side comparison columns with an optional slamming rubber stamp (`FULL`, `STREET ILLEGAL`, `BUSTED`, `CONFIRMED`).
```typescript
widget: {
  type: "comparison_grid",
  windowTitle: "compliance.dot.regulation.v1",
  theme: "dark",
  enterAt: 0.12,
  columns: [
    { icon: "✨", title: "CONTROLLED RIG", subtitle: "STEEL SURFACE", statusText: "SEAL LOCKED", tone: "good" },
    { icon: "🕳️", title: "PUBLIC HIGHWAY", subtitle: "POTHOLES & CRACKS", statusText: "SEAL SHATTERS", tone: "bad" }
  ],
  stamp: { text: "STREET ILLEGAL", slamAt: 1.75 }, // Automatically triggers camera zoom kick & impact shake!
  footerLeft: "STATUS: NON-COMPLIANT",
  footerRight: "HAZARD: GRAVEL SHRAPNEL"
}
```

### 5. `chart_trend`
Renders an animated SVG polyline graph with live badge and optional "NOW" marker.
```typescript
widget: {
  type: "chart_trend",
  title: "// views · since posting",
  metricValue: "142K",
  metricLabel: "views",
  liveBadge: true,
  pillBanner: "AI-animated reels",
  nowMarkerLabel: "NOW",
  points: [8, 9, 12, 10, 14, 18, 26, 42, 68, 95], // Normalized 0-100 values
  enterAt: 0.14
}
```

### 6. `physics_diagram`
Renders technical engineering schematics and cutaways:
- `"inverted_car_claim"` — Car driving upside down along a reaction rail.
- `"vacuum_skirt_seal"` — Negative pressure chamber & aerodynamic arrows.
- `"twin_turbines"` — Counter-rotating impellers spinning up to 25,000 RPM.
- `"cold_gas_thrusters"` — SpaceX COPV nitrogen tank with high-velocity exhaust plume.
- `"verdict_summary"` — Final engineering checklist with a pulsing subscribe pill button.

### 7. `video_clip`
Renders real MP4 video clips & B-roll inside a dark telemetry HUD frame with animated telemetry readouts, running timecode, glowing `● LIVE REC` indicator, and laser scanline sweeps.
```typescript
widget: {
  type: "video_clip",
  src: "videos/f1_cockpit.mp4", // Drop MP4 file into public/videos/
  windowTitle: "f1.onboard.cockpit.cam",
  caption: "COCKPIT ONBOARD CAM — 122°F",
  theme: "dark",
  enterAt: 0.12,
  startFromSec: 0, // Seek offset in seconds
  playbackRate: 1.0,
  loop: true,
  overlayTelemetry: {
    speed: "324 KM/H",
    gear: "7",
    heartRate: "172 BPM",
    gForce: "+4.2 G",
    heatTemp: "122°F",
  },
  footerLeft: "LIVE ONBOARD // CH-01",
  footerRight: "COCKPIT AMBIENT: 122°F",
}
```

---

## Quickstart Guide for Humans

### 1. Interactive Studio Preview (`npm run dev`)
```bash
npm run dev
```
- Opens Remotion Studio at `http://localhost:3000`.
- Scrub the timeline frame by frame, inspect layers, and test changes live with hot reloading.

### 2. Exporting MP4 Videos
- **Quick 5-Second Test Render:**
  ```bash
  npm run render:fast
  ```
  *(Exports `out/preview-5s.mp4`)*
- **Full Video Render (Tesla Roadster):**
  ```bash
  npm run render
  ```
  *(Exports `out/minute-mysteries-roadster.mp4`)*
- **Full Video Render (AI Playbook):**
  ```bash
  npm run render:playbook
  ```
  *(Exports `out/ai-growth-playbook.mp4`)*
- **Full Video Render (F1 Drivers Weight Loss):**
  ```bash
  npm run render:f1
  ```
  *(Exports `out/why-f1-drivers-lose-9-pounds.mp4`)*
- **Render Any Custom Video:**
  ```bash
  npx remotion render src/index.ts <YourReelId> out/<outputFileName>.mp4
  ```

### 3. Automated Reel Generator (Voice to Ready Video)
Generate a complete, ready-to-render reel with 1-to-3 word captions and beat cuts from any audio/video file with one command:
```bash
npm run reel:create <audio_or_video_file> [TopicName]
# Example:
npm run reel:create public/audio/my_voice.mp3 QuantumComputing
```
This automatically:
1. Runs local Whisper to get exact word-level start/end timestamps.
2. Masters voiceover audio to broadcast `-15.0 LUFS`.
3. Partitions speech into 6-8s scenes with 1-to-3 word dynamic captions (`maxWordsPerChunk: 3`).
4. Generates `src/topics/<topicName>.reel.ts` with 1.5s-2.5s cut velocity `beats` and registers it in `src/Composition.tsx`.

### 4. AI Transcription & SFX Classification Tools
- **Transcribe Any Audio/Video (Local Whisper with Word Timings):**
  ```bash
  npm run transcribe <audio_or_video_path>
  # Example:
  npm run transcribe public/audio/f1_scene1.mp3 --out transcript.json
  ```
- **Detect & Classify Sound Effects in Reference Videos (Local CLAP):**
  ```bash
  npm run listen events <reference_video.mp4>
  ```
  Identifies exact timestamps for whooshes, clicks, pops, and dings so you can paste them into your reel.

### 5. Sound Effects & Voiceovers
Run the procedural audio synthesizer:
```bash
npm run sfx:generate
```
This generates crisp WebAudio PCM sound effects into `public/audio/`: `whoosh.mp3`, `stamp.mp3`, `click.mp3`, `turbine.mp3`, `thruster.mp3`, and `ding.mp3`.

### 4. Adding Real Videos & B-Roll Footage
1. Drop your `.mp4` video clips into `public/videos/` (e.g. `public/videos/f1_cockpit.mp4`).
2. Reference them in any scene config using the `video_clip` widget:
   ```typescript
   widget: {
     type: "video_clip",
     src: "videos/f1_cockpit.mp4",
     caption: "ONBOARD TELEMETRY // 122°F",
     overlayTelemetry: { speed: "324 KM/H", gear: "7", heartRate: "172 BPM", gForce: "+4.2 G" }
   }
   ```
   The engine automatically adds running timecode, glowing `● LIVE REC` indicators, and laser scanline sweeps over your footage.

---

## Visual Architecture & Physics Breakdown

### The 4-Zone Vertical Grid (1080×1920)

```
┌────────────────────────────────────────────────────────┐
│ 1. TOP TAG ROW (0% – 6%)                               │
│    // 01 · the mystery              DEMO 1/7 (Counter) │
├────────────────────────────────────────────────────────┤
│ 2. KINETIC CAPTION ZONE (8% – 22%)                     │
│    Can Tesla's Roadster really                         │
│    drive upside down?                                  │
├────────────────────────────────────────────────────────┤
│ 3. HERO CARD ZONE (25% – 68%)                          │
│    [ Floating Speech Bubble: 1 FIRST ]                 │
│    ┌──────────────────────────────────────────────┐    │
│    │ Interactive Card / Diagram / Chart / Stack   │    │
│    └──────────────────────────────────────────────┘    │
├────────────────────────────────────────────────────────┤
│ 4. BOTTOM PRESENTER ZONE (66% – 100%)                  │
│                                  ┌──────────────┐      │
│                                  │ Rigged Host  │      │
│                                  │ (Mouth Sync) │      │
│                                  └──────────────┘      │
└────────────────────────────────────────────────────────┘
```

### Kinetic Captioning Rules
- **Font:** Space Grotesk 700 (`#111111`) for standard speech.
- **Emphasis Words:** Wrap in `*asterisks*` (e.g. `*40,000*` or `*upside down?*`). The engine renders them in **Instrument Serif Italic** (`#E8402A`) at 120% scale.
- **Timing:** Accent words automatically trigger `-0.15s` before their spoken timestamp, creating the signature early visual punch.

### Presenter Rigs & Syncing
- **`bearded_human`**: Vector SVG host with black beanie, red patch, wireframe glasses, and olive jacket. Includes:
  - 3 mouth sync phases (closed, half, wide + tongue) synced to the scene's `speakingWindow`.
  - Natural periodic eye-blinking (every ~2.7s) and conversational head-tilting.
  - Automatic pupil side-glance looking toward the hero card.
- **`pip_mascot`**: Orange pixel-emoji mascot with animated arm and pixel eyes.
- **`png_cutout`**: High-resolution photographic PNG fallback.

### Continuous Living Motion ("Nothing Still > 1.2s")
Modeled after the benchmark rule decoded from the reference reels (`Video-1328`, `Video-34923`), scenes never freeze into static flat images:
- **Cinematic Camera Drift:** Continuous subtle Ken Burns push-in (`1.00 -> 1.04`) and slow micro-pan (`Math.sin(currentTimeSec * 0.7) * 4.5px`) keep the entire 9:16 canvas alive.
- **2.5D Card Hover & Scanlines:** Cards gently breathe in 2.5D space (`Math.sin(currentTimeSec * 2.8) * 3.5px`) with sweeping cyan/white laser scanlines on dark technical frames.
- **Presenter Dynamics:** Hosts blink naturally and tilt their head while speaking so they never look like flat cardboard stickers.
- **Active Telemetry Bars:** Metrics and diagrams feature live oscillating signal activity bars and scale pulsing.
- **Real Video Support:** Embed real 60fps MP4 video footage and B-roll clips directly inside cards via the `video_clip` widget.

---

## Complete Working Example Config

Save this as `src/topics/spaceStation.reel.ts`:

```typescript
import type { ReelConfig } from "../schema/reelSchema";

export const spaceStationReel: ReelConfig = {
  id: "SpaceStationShort",
  title: "How the ISS Creates Fake Gravity",
  fps: 30,
  width: 1080,
  height: 1920,
  defaultCharacter: "bearded_human",
  springOvershoot: 0.45,
  scenes: [
    {
      id: "01_gravity_hook",
      number: "01",
      label: "the physics",
      duration: 5.0,
      topRightCounter: { label: "SPEED", staticValue: "17,500 MPH" },
      caption: {
        keyWordLead: 0.15,
        words: [
          { text: "Humans", at: 0.1 },
          { text: "can't", at: 0.3 },
          { text: "survive", at: 0.5 },
          { text: "without", at: 0.8 },
          { text: "*gravity.*", at: 1.1, accent: true, zoomKick: 1.055 },
        ],
      },
      calloutBubble: {
        tag: "1 CENTRIFUGAL",
        sublabel: "rotational force",
        text: "Spinning rings simulate 1.0 Earth G",
        icon: "⚡",
        enterAt: 0.2,
      },
      widget: {
        type: "metric_counter",
        from: 0,
        to: 1,
        unit: "G",
        sublabel: "ARTIFICIAL CENTRIFUGAL FORCE",
        directionIcon: "up",
        enterAt: 0.14,
        footerMetrics: [
          { label: "RING DIAMETER", value: "220 METERS" },
          { label: "ROTATION SPEED", value: "4.2 RPM", accent: true },
        ],
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.1, 4.2],
      },
      sfx: [
        { at: 0.1, type: "whoosh" },
        { at: 1.1, type: "stamp" },
      ],
      transitionOut: "halftone_wipe",
    },
  ],
};
```

---

## Directory Structure

```text
minute-mysteries-shorts/
├── remotion.config.ts          # Remotion render settings (PNG frames, H.264 CRF 16, Rspack)
├── package.json                # Project dependencies & npm scripts
├── tsconfig.json               # TypeScript compiler options
├── public/                     # Static assets & audio files
│   └── audio/                  # whoosh.mp3, stamp.mp3, click.mp3, turbine.mp3, thruster.mp3, ding.mp3
├── scripts/
│   └── generate_audio_assets.js# Procedural WebAudio/Tone synthesizer
├── src/
│   ├── index.ts                # Remotion entry point
│   ├── Root.tsx                # Remotion root registering VideoComposition
│   ├── Composition.tsx         # Registers all compositions into Remotion
│   ├── schema/
│   │   └── reelSchema.ts       # TypeScript interfaces (ReelConfig, SceneConfig, WidgetSpec, etc.)
│   ├── engine/
│   │   ├── motionPhysics.ts    # Harmonic spring math (F=-kx), zoom kicks, and impact shakes
│   │   ├── ReelEngine.tsx      # Master sequencer, audio binder, and duration calculator
│   │   └── SceneRenderer.tsx   # 4-zone vertical stage renderer (1080×1920)
│   ├── components/
│   │   ├── CardContainer.tsx   # Paper/Dark card surface with halftone dot drop shadow
│   │   ├── WordTimedCaption.tsx# Word-by-word kinetic typography with early arrival pop
│   │   ├── RiggedPresenter.tsx # Articulated vector SVG presenter (3-state mouth sync, eye glance)
│   │   ├── HalftoneWipe.tsx    # Radial wave halftone dot-matrix transition
│   │   ├── HalftoneShadow.tsx  # SVG pattern definitions (#halftone-dots, #halftone-dense)
│   │   ├── FeltPenAnnotation.tsx # Animated circle draw & speech bubbles
│   │   └── widgets/
│   │       ├── WidgetRegistry.tsx       # Widget dispatcher
│   │       ├── ChecklistCard.tsx        # Animated step-by-step checklist
│   │       ├── MetricCounterCard.tsx    # Live counter with direction vector arrow
│   │       ├── NotificationStackCard.tsx# Phone notifications, profile card & calendar slam
│   │       ├── ComparisonGridCard.tsx   # 2-column comparison with slamming rubber stamp
│   │       ├── ChartTrendCard.tsx       # Animated trend polyline chart
│   │       └── DiagramCard.tsx          # Technical cutaways & schematics
│   ├── theme/
│   │   ├── colors.ts           # Tactical paper (#EFEBE4), Ink (#111111), Signal Red (#E8402A)
│   │   ├── fonts.ts            # Space Grotesk, Instrument Serif Italic, JetBrains Mono
│   │   └── transitions.ts      # Spring presets
│   └── topics/
│       ├── teslaRoadster.reel.ts      # Topic 1: Tesla Roadster physics breakdown
│       └── aiGrowthPlaybook.reel.ts   # Topic 2: AI reels growth playbook
```

---

## FAQ & Troubleshooting

### Q: Does an LLM need to write any CSS or React animation hooks?
**No.** All animation curves, easing, spring overshoot, camera zoom kicks, and transitions are built into the engine. The LLM only provides the content data inside a `ReelConfig` file.

### Q: How do I change how long a scene stays on screen?
Modify `duration` on the scene object (in seconds). The engine automatically recalculates frame counts and realigns audio tracks without desynchronization.

### Q: Why do accent words appear in italic red?
Any word with `accent: true` or wrapped in `*asterisks*` automatically uses the `#E8402A` Signal Red color and *Instrument Serif Italic* font, arriving 0.15s early with a spring bounce.

---

## License
UNLICENSED — Private project repository.
