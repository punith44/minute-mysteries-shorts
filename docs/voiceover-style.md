# Minute Mysteries — Voiceover Style & Google AI Studio Generation Guide

## 1. Reference Audio Acoustic Analysis

Based on acoustic signal analysis of the reference shorts (`Video-1328.mp4`, `Video-27458.mp4`, `Video-34923.mp4`, `Video-76790.mp4`):

- **Fundamental Frequency ($F_0$)**: Median ~**129.7 Hz** (25th percentile: 110.2 Hz, 75th percentile: 173.6 Hz).
  - *Vocal Register*: Youthful adult male baritone-tenor transition. Not an artificially deep radio/movie-trailer baritone (~85 Hz), nor nasal or high-pitched.
  - *Dynamic Inflection*: Wide pitch excursions spiking up to **306 Hz** on curiosity questions, surprising numbers, and reveals.
- **Pacing & Cadence**:
  - *Speaking Rate*: ~**165 – 178 words per minute**.
  - *Voice Activity Ratio*: **77.0% active speech / 23.0% pauses**.
  - *Pause Structure*: Micro-pauses average **0.14s** between short clauses; intentional curiosity pauses average **0.35s – 0.45s** immediately before a key reveal.
- **Articulation & Presence**:
  - Crisp, forward consonants (plosives /t/, /k/, /p/ and sibilants /s/ are sharp and distinct).
  - Dry, close-miked studio acoustic with zero room reverb or slapback.
  - Frequency balance: clean midrange clarity (1 kHz – 4 kHz boost) for phone speaker intelligibility, with high-pass filtered low-end below 80 Hz to prevent muddiness.

---

## 2. Voice Persona Profile

- **Name/Archetype**: The Curious Engineer / Tech Detective.
- **Tone**: Bright, intelligent, conversational, confident, and genuinely fascinated.
- **Delivery**: Fast-paced yet effortless; ideas are linked smoothly without sluggish pauses.
- **Phone Intelligibility**: High vocal projection without shouting; crisp transient consonants.

---

## 3. Approved Narration Script: "How Does Tesla's Roadster Hang Upside Down?"

*Total Word Count: ~145 words (estimated runtime: 50–52 seconds at 170 WPM).*
*Rule: Do NOT read bracketed scene tags aloud.*

```text
Can Tesla's Roadster really drive upside down? A viral demonstration claimed to defy gravity.

Here's the problem. A sports car weighs thirty-eight hundred pounds. Gravity is violently pulling it down at one G.

Normal racecars need two hundred miles an hour for their wings to work. But Tesla used active ground-sealing skirts, turning the entire underbody into an airtight vacuum chamber.

Twin turbine fans spin at twenty-five thousand RPM, pulling seventy-six hundred pounds of downward suction. That's two times Earth's gravity.

And to flip or stabilize mid-air, SpaceX cold-gas thrusters fire compressed nitrogen bursts at ten thousand PSI.

So can you drive this on everyday highways? Absolutely not. A single pothole shatters the vacuum seal, and those fans would blast road gravel like shrapnel.

It's not science fiction. It's brute-force aerospace engineering.
```

---

## 4. Google AI Studio Setup & Generation Prompt

### Step 1: Open Google AI Studio
1. Navigate to [Google AI Studio](https://aistudio.google.com/).
2. Select the latest multimodal speech-capable model (e.g. **Gemini 2.0 Flash** / **Gemini Multimodal Live** with audio output, or the **Cloud Text-to-Speech / Speech Synthesis** tool).

### Step 2: System / Voice-Direction Prompt
Paste this exact prompt into the **System Instructions** or generation prompt window:

```text
You are a professional voiceover narrator for "Minute Mysteries", an educational tech and engineering YouTube Shorts channel.

Vocal Characteristics:
- Tone: Youthful, bright, conversational, and energetic. Not a deep radio DJ or dramatic movie-trailer voice.
- Register: Clear male tenor/baritone with a crisp forward presence and natural American English pronunciation.
- Pacing: Fast-paced (~170 WPM), agile, and punchy, maintaining continuous momentum while keeping every syllable razor-sharp.
- Delivery: Sound genuinely intrigued by what you are explaining. Connect thoughts smoothly with minimal 0.1s micro-pauses. Take a brief, suspenseful 0.3s pause before major reveals ("Here's the problem.", "Twin turbine fans...", "It's brute-force aerospace engineering.").
- Dynamics: Punch important numbers ("thirty-eight hundred pounds", "twenty-five thousand RPM", "ten thousand PSI") and key nouns with natural, controlled vocal emphasis.
- Acoustics: Dry, studio-quality, close-proximity microphone sound. Completely clean without background music, echo, or distortion.

Deliver the script below naturally without adding any extra words, commentary, or greetings.
```

### Step 3: Input the Narration Text
Paste the script from Section 3 into the prompt input box and generate the audio.

### Step 4: Recommended Google Cloud TTS Voices (If using Cloud Text-to-Speech Console)
If selecting a pre-built neural voice in Google Cloud Text-to-Speech:
- **`en-US-Journey-F`** or **`en-US-Journey-D`**: Expressive conversational style with natural sentence flow.
- **`en-US-Neural2-J`** or **`en-US-Neural2-A`**: Crisp, forward, youthful clarity.
- **Speaking Rate**: `1.10x` (to achieve the target 170 WPM rhythm).
- **Pitch**: `+0.5 semitones` (matches the 130 Hz energetic register).

---

## 5. Integrating the Generated Audio into Remotion

Once you download the generated voiceover file:

1. Save or rename the file to:
   ```bash
   public/audio/narration.mp3
   ```
   *(in `/Users/punithr/Documents/Reels/antigravity-ide/scratch/minute-mysteries-shorts/public/audio/narration.mp3`)*

2. Remotion automatically picks up `public/audio/narration.mp3` via `AudioLayer.tsx`.

3. Re-render the MP4 short with verified audio:
   ```bash
   npx remotion render src/index.ts MinuteMysteriesShort out/minute-mysteries-roadster.mp4 --port=3050
   ```

4. Verify the audio stream:
   ```bash
   npx remotion ffprobe -i out/minute-mysteries-roadster.mp4
   ```
