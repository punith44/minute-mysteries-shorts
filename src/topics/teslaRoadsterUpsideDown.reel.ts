import type { ReelConfig } from "../schema/reelSchema";

type CaptionWord = {
  text: string;
  at: number;
  end?: number;
  accent?: boolean;
  zoomKick?: number;
};

const START = 0.16;
const STEP = 0.31;
const pauseAfter = (w: string) =>
  /[.!?]$/.test(w) ? 0.14 : /[,:;]$/.test(w) ? 0.06 : 0;

/**
 * Poly Lab 1-to-3 Word Pill-Highlighted Caption Builder
 * Matches Reference Video: "How did the Tesla Roadster drive upside down and fly"
 * - 1 to 3 words centered at the bottom of the 9:16 stage (`position: "bottom"`)
 * - Active spoken word highlighted inside a warm orange rounded pill (`#ED8A33`)
 */
function cap(text: string) {
  let t = START;
  let inAccent = false;
  const words: CaptionWord[] = text.split(/\s+/).map((raw) => {
    const stars = (raw.match(/\*/g) || []).length;
    const opens = raw.startsWith("*");
    if (opens) inAccent = true;
    const accent = inAccent;
    if (stars >= 2 || (!opens && stars === 1)) inAccent = false;
    const clean = raw.replace(/\*/g, "");
    const dur = +(STEP * Math.max(0.75, Math.min(1.35, clean.length / 5.0))).toFixed(2);
    const w: CaptionWord = {
      text: clean,
      at: +t.toFixed(2),
      end: +(t + dur).toFixed(2),
      ...(accent ? { accent: true, zoomKick: 1.045 } : {}),
    };
    t += dur + pauseAfter(clean);
    return w;
  });
  return {
    keyWordLead: 0.08,
    maxWordsPerChunk: 3,
    position: "bottom" as const,
    styleVariant: "poly_pill" as const,
    activeHighlightColor: "#ED8A33",
    words,
  };
}

const c1 = cap(
  "On October fifteenth, a Tesla *Roadster* drove *upside down*. Then it took off. How is that even *possible?*"
);
const c2 = cap(
  "To cling to a *ceiling,* a car needs *downforce* bigger than its own weight. Gravity *pulls* it down at one G."
);
const c3 = cap(
  "Take an airplane *wing,* and flip it *upside down*. Instead of lift, air pushes it down into *downforce.*"
);
const c4 = cap(
  "Normal wings need *speed,* so Tesla put *fans* underneath. They *suck* the air out, like a *vacuum* cleaner!"
);
const c5 = cap(
  "To fly, SpaceX tanks hold *250 kilos* of compressed air. Ten *nozzles* blast air down so the car goes *up!*"
);
const c6 = cap(
  "For the *landing,* Falcon 9 *boosters* use cold gas jets to *flip* in space. The Roadster uses the *same* jets!"
);
const c7 = cap(
  "It levels out *mid-air,* slows its fall, and lands on its *wheels.* Subscribe for tomorrow's *mystery.*"
);

export const teslaRoadsterUpsideDownReel: ReelConfig = {
  id: "TeslaRoadsterUpsideDown",
  title: "How Did the Tesla Roadster Drive Upside Down and Fly?",
  genre: "scientific_breakdown",
  fps: 30,
  width: 1080,
  height: 1920,
  defaultCharacter: "none",
  springOvershoot: 0.45,
  backgroundMusicSrc: "audio/bgm_ducked.mp3",
  backgroundMusicVolume: 0.48,
  scenes: [
    // ── 01 · FLYING CAR LOOP RAMP · 8.0s ─────────────────────────────
    {
      id: "01_hook",
      number: "01",
      label: "flying car?",
      duration: 8.0,
      stageTheme: "light",
      topRightCounter: { label: "UNVEILED", staticValue: "OCT 15" },
      topHeadline: {
        text: "Flying\ncar?",
        align: "left",
        underlineBrush: true,
      },
      caption: c1,
      presenter: { character: "none", gesture: "shocked_hands" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene1.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_loop_ramp",
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 2.7, type: "turbine" },
        { at: 4.6, type: "ding" },
      ],
      transitionOut: "blur_rack",
    },

    // ── 02 · BEAT GRAVITY (CEILING FORCES) · 8.0s ────────────────────
    {
      id: "02_problem",
      number: "02",
      label: "beat gravity",
      duration: 8.0,
      stageTheme: "light",
      topRightCounter: { label: "GRAVITY", staticValue: "1 G" },
      topHeadline: {
        text: "BEAT GRAVITY",
        align: "center",
        typewriter: true,
      },
      caption: c2,
      presenter: { character: "none", gesture: "point_up_left" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene2.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_beat_gravity",
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 0.5, type: "stamp" },
        { at: 2.3, type: "ding" },
      ],
      transitionOut: "blur_rack",
    },

    // ── 03 · INVERTED AIRFOIL WING · 9.0s ────────────────────────────
    {
      id: "03_wing",
      number: "03",
      label: "upside down wing",
      duration: 9.0,
      stageTheme: "light",
      topRightCounter: { label: "AIRFOIL", staticValue: "INVERTED" },
      topHeadline: {
        text: "...UPSIDE DOWN",
        align: "center",
        typewriter: true,
      },
      caption: c3,
      presenter: { character: "none", gesture: "open_palm" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene3.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_inverted_wing",
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 0.8, type: "whoosh" },
        { at: 4.5, type: "click" },
      ],
      transitionOut: "blur_rack",
    },

    // ── 04 · FANS UNDERNEATH (VACUUM SUCTION) · 9.0s ─────────────────
    {
      id: "04_suction_fans",
      number: "04",
      label: "fans underneath",
      duration: 9.0,
      stageTheme: "light",
      topRightCounter: { label: "SUCTION", staticValue: "2.0 G" },
      topHeadline: {
        text: "FANS UNDERNEATH",
        align: "center",
        typewriter: true,
        pills: [
          { text: "NEEDS SPEED", enterAt: 0.35 },
          {
            text: "UP TO 2 G OF GRIP",
            enterAt: 6.5,
            filled: true,
            fillColor: "#F4A259",
          },
        ],
      },
      caption: c4,
      presenter: { character: "none", gesture: "open_palm" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene4.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_suction_fans",
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 1.2, type: "turbine" },
        { at: 6.8, type: "stamp" },
      ],
      transitionOut: "blur_rack",
    },

    // ── 05 · HOW IT FLIES (250KG COMPRESSED AIR + 10 NOZZLES) · 9.0s ─
    {
      id: "05_how_it_flies",
      number: "05",
      label: "how it flies",
      duration: 9.0,
      stageTheme: "light",
      topRightCounter: { label: "THRUST", staticValue: "10 NOZZLES" },
      caption: c5,
      presenter: { character: "none", gesture: "shocked_hands" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene5.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_copv_flight",
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 2.1, type: "thruster" },
        { at: 4.2, type: "ding" },
      ],
      transitionOut: "blur_rack",
    },

    // ── 06 · ROCKET LANDING (FALCON 9 VS ROADSTER SPLIT) · 8.0s ──────
    {
      id: "06_rocket_landing",
      number: "06",
      label: "rocket landing",
      duration: 8.0,
      stageTheme: "light",
      topRightCounter: { label: "SPACEX", staticValue: "COLD GAS" },
      caption: c6,
      presenter: { character: "none", gesture: "open_palm" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene6.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_rocket_landing",
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 1.8, type: "thruster" },
        { at: 5.2, type: "click" },
      ],
      transitionOut: "blur_rack",
    },

    // ── 07 · MID-AIR LEVELING & WHEEL TOUCHDOWN · 9.0s ───────────────
    {
      id: "07_verdict",
      number: "07",
      label: "touchdown",
      duration: 9.0,
      stageTheme: "light",
      topRightCounter: { label: "LANDING", staticValue: "LAND ✓" },
      caption: c7,
      presenter: { character: "none", gesture: "thumbs_up" },
      voiceoverSrc: "audio/teslaRoadsterUpsideDown_scene7.mp3",
      widget: {
        type: "physics_diagram",
        variant: "poly_rocket_landing",
        enterAt: -6.0, // Starts directly in the full-width mid-air flip & wheel touchdown phase
      },
      sfx: [
        { at: 0.0, type: "whoosh" },
        { at: 1.5, type: "thruster" },
        { at: 4.2, type: "stamp" },
        { at: 6.8, type: "ding" },
      ],
      transitionOut: "blur_rack",
    },
  ],
};

// Build-time duration guard
const total = teslaRoadsterUpsideDownReel.scenes.reduce(
  (s, sc) => s + sc.duration,
  0
);
if (Math.abs(total - 60) > 1e-6) {
  throw new Error(`Reel duration is ${total}s, expected exactly 60.0s`);
}
