# Minute Mysteries — 60-Second YouTube Shorts Engine

A high-performance, programmatic video production template built with **Remotion**, **React**, and **TypeScript**. Designed for editorial, graphic-heavy documentary shorts with snappy spring physics, halftone-dot transitions, live telemetry counters, and an original illustrated host.

---

## Visual Design Specification
* **Format:** 9:16 Vertical Video (1080 × 1920)
* **Frame Rate:** 60 FPS (Ultra-smooth playback)
* **Duration:** Exactly 60.00 seconds (3,600 frames)
* **Palette:**
  * Warm Tactile Paper: `#EFEBE4`
  * Rich Black Ink: `#111111`
  * Signal Red Keyword Accent: `#E8402A`
* **Typography:**
  * Technical Sans: **Space Grotesk**
  * Expressive Keyword Emphasis: **Instrument Serif (Italic)**
* **Character Host:** Original vector illustrated host with black beanie, round wireframe spectacles, trimmed dark beard, and olive utility jacket.

---

## Episode 084 Storyline & Scene Breakdown
* **Topic:** *How Does Tesla's Roadster Hang Upside Down?*

| Scene | Frame Range | Time | Content |
| :--- | :--- | :--- | :--- |
| **01: The Inversion Hook** | `0 – 420` | `0s – 7s` | The viral ceiling stunt claim; inverted Roadster clinging against gravity. |
| **02: The Gravity Trap** | `420 – 900` | `7s – 15s` | Curb weight live counter (3,820 lbs) vs 1.0 G gravitational pull. |
| **03: The Vacuum Skirt** | `900 – 1440` | `15s – 24s` | Secret #1: Ground-sealing flexible composite skirts act as a suction cup. |
| **04: Twin Turbines** | `1440 – 2040` | `24s – 34s` | 25,000 RPM fans evacuate air; 7,640 lbs downforce = 2.0 G holding force. |
| **05: Cold-Gas Thrusters**| `2040 – 2640` | `34s – 44s` | Secret #2: SpaceX 10,000 PSI COPV compressed gas thrusters for mid-air flips. |
| **06: The Reality Check** | `2640 – 3180` | `44s – 53s` | Asphalt seams break vacuum; 25k RPM fans turn pebbles into shrapnel. |
| **07: The Verdict & CTA** | `3180 – 3600` | `53s – 60s` | Case closed: Brute-force aerospace suction. Animated subscribe button. |

---

## Quickstart Commands

### 1. Launch Remotion Studio (Interactive Live Preview)
```bash
npm run dev
```
Opens the Remotion Studio in your browser at `http://localhost:3000`. You can scrub through every individual frame (0 to 3600), play at real-time 60fps, and edit React code with hot reloading.

### 2. Render Full 60-Second 1080×1920 MP4 Video
```bash
npm run render
```
Exports the production-ready MP4 file directly to `out/minute-mysteries-roadster.mp4`.

### 3. Fast 5-Second Test Render (Quick Check)
```bash
npm run render:fast
```
Renders frames 0–300 (~5 seconds) to `out/preview-5s.mp4` in just a few seconds.

---

## Audio & Voiceover Integration

### Adding Your Narration:
1. Record your voiceover script (timed to approximately 56–58 seconds).
2. Save the audio file as:
   ```
   public/audio/narration.mp3
   ```
3. In `src/Composition.tsx`, toggle the voiceover switch:
   ```tsx
   <AudioLayer hasVoiceover={true} hasSfx={true} />
   ```

### Adding UI Sound Effects:
Drop any desired `.mp3` files into `public/audio/`:
* `public/audio/whoosh.mp3` — Transition wipes
* `public/audio/stamp.mp3` — Ink stamp drop
* `public/audio/turbine.mp3` — Fan spinup
* `public/audio/thruster.mp3` — Cold-gas blast
* `public/audio/ding.mp3` — Outro bell

---

## Google Flow AI Asset Generation
Refer to [`src/assets/google-flow-prompts.md`](./src/assets/google-flow-prompts.md) for tailored prompts to generate cinematic photorealistic b-roll using Google Flow.
