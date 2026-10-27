import type { ReelConfig } from "../schema/reelSchema";

/**
 * Builds word-timed captions at ~198 WPM with syllable/length weighting & punctuation pauses.
 * Displays 1 to 3 words at a time (`maxWordsPerChunk: 3`) with active keyword highlight.
 */
const cap = (text: string, start = 0.14, baseStep = 0.27) => {
  let cursor = start;
  const words = text.split(/\s+/).map((raw) => {
    const clean = raw.replace(/\*/g, "");
    const charWeight = Math.max(0.75, Math.min(1.45, clean.length / 5.2));
    const dur = +(baseStep * charWeight).toFixed(3);
    const pause = /[.!?]$/.test(clean) ? 0.14 : /[,:;]$/.test(clean) ? 0.06 : 0;
    const token = {
      text: raw.includes("*") ? `*${clean}*` : clean,
      at: +cursor.toFixed(2),
      end: +(cursor + dur).toFixed(2),
      ...(raw.includes("*") ? { accent: true, zoomKick: 1.06 } : {}),
    };
    cursor += dur + pause;
    return token;
  });
  return {
    keyWordLead: 0.12,
    maxWordsPerChunk: 3,
    styleVariant: "editorial_kinetic" as const,
    activeHighlightColor: "#E8402A",
    words,
  };
};

export const whyF1DriversLoseNinePounds: ReelConfig = {
  id: "WhyF1DriversLoseNinePoundsShort",
  title: "Why F1 Drivers Lose 9 Pounds in Two Hours",
  genre: "scientific_breakdown",
  fps: 30,
  width: 1080,
  height: 1920,
  defaultCharacter: "png_cutout",
  springOvershoot: 0.45,
  backgroundMusicSrc: "audio/bgm_ducked.mp3",
  backgroundMusicVolume: 0.52,
  scenes: [
    // ── Scene 1 · HOOK · 8.0s ─────────────────────────────────────────
    {
      id: "01_hook",
      number: "01",
      label: "the mystery",
      duration: 8.0,
      topRightCounter: { label: "WEIGHT", staticValue: "-9 LBS" },
      ambientEffect: "halftone_rays",
      caption: cap(
        "Some F1 drivers finish a race up to *nine* pounds lighter. Not fat. In under *two* hours. Where does it go?"
      ),
      beats: [
        { at: 2.0, cameraZoom: 1.05, cameraPanX: -12, presenterGesture: "point_up_left", subTagOverride: "// b02 · fluid loss" },
        { at: 4.2, cameraZoom: 1.09, cameraPanX: 10, cameraPanY: -10, presenterGesture: "shocked_hands", bannerText: "9 POUNDS", bannerAccentWord: "9 POUNDS" },
        { at: 6.2, cameraZoom: 1.03, cameraPanX: 0, presenterGesture: "open_palm" },
      ],
      widget: {
        type: "metric_counter",
        windowTitle: "telemetry.driver.weightloss",
        theme: "dark",
        from: 0,
        to: 9,
        unit: "LBS",
        sublabel: "RACE WEIGHT LOSS (FLUID)",
        directionIcon: "down",
        circleHighlightAt: 3.0,
        footerMetrics: [
          { label: "RACE TIME", value: "< 2 HRS" },
          { label: "WHERE DID IT GO?", value: "???" },
        ],
      },
      presenter: {
        gesture: "shocked_hands",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 7.6],
      },
      voiceoverSrc: "audio/f1_scene1.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "ding", at: 3.0 },
        { type: "click", at: 6.5 },
      ],
      transitionOut: "halftone_wipe",
    },

    // ── Scene 2 · BASELINE · 8.0s ─────────────────────────────────────
    {
      id: "02_baseline",
      number: "02",
      label: "cockpit heat",
      duration: 8.0,
      topRightCounter: { label: "COCKPIT", staticValue: "122°F" },
      caption: cap(
        "The cockpit hits *122* degrees. Fireproof suit. Helmet. Humid air. Heart rate averaging *170* beats a minute. Nonstop. For two hours."
      ),
      widget: {
        type: "video_clip",
        src: "videos/f1_cockpit.mp4",
        windowTitle: "f1.onboard.cockpit.cam",
        caption: "COCKPIT ONBOARD CAM — 122°F",
        theme: "dark",
        enterAt: 0.12,
        overlayTelemetry: {
          speed: "324 KM/H",
          gear: "7",
          heartRate: "172 BPM",
          gForce: "+4.2 G",
          heatTemp: "122°F",
        },
        footerLeft: "LIVE ONBOARD // CH-01",
        footerRight: "COCKPIT AMBIENT: 122°F",
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 7.6],
      },
      voiceoverSrc: "audio/f1_scene2.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "ding", at: 1.6 },
        { type: "click", at: 5.1 },
      ],
      transitionOut: "halftone_wipe",
    },

    // ── Scene 3 · MECHANISM 1 · 9.0s ──────────────────────────────────
    {
      id: "03_sweat_engine",
      number: "03",
      label: "sweat rate",
      duration: 9.0,
      topRightCounter: { label: "SWEAT", staticValue: "2 L/HR" },
      caption: cap(
        "Sweat is the main cooling system. Up to *two* litres an hour. And one litre of water weighs one *kilo*. Do the math."
      ),
      widget: {
        type: "metric_counter",
        windowTitle: "physiology.sweat.cooling",
        theme: "dark",
        from: 0,
        to: 2,
        unit: "L / HR",
        sublabel: "EVAPORATIVE COOLING RATE",
        directionIcon: "up",
        circleHighlightAt: 3.0,
        footerMetrics: [
          { label: "1 LITER SWEAT", value: "= 1.0 KG" },
          { label: "2 HOURS RACING", value: "≈ 4.0 KG", accent: true },
        ],
      },
      presenter: {
        gesture: "open_palm",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 8.6],
      },
      voiceoverSrc: "audio/f1_scene3.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "ding", at: 3.0 },
        { type: "ding", at: 6.9 },
      ],
      transitionOut: "halftone_wipe",
    },

    // ── Scene 4 · MECHANISM 2 · 9.0s ──────────────────────────────────
    {
      id: "04_hydration_deficit",
      number: "04",
      label: "fluid deficit",
      duration: 9.0,
      topRightCounter: { label: "DRINK", staticValue: "0.5 L" },
      caption: cap(
        "But the drink bottle can't keep up. There's no water stop, and no toilet break. So drivers *sweat* out far more than they *drink*."
      ),
      widget: {
        type: "checklist",
        title: "Hydration deficit",
        badgeProgress: "4/4",
        enterAt: 0.12,
        items: [
          { number: "1", text: "Small onboard drink bottle", checkedAt: 2.0 },
          { number: "2", text: "Zero water stops allowed", checkedAt: 3.4 },
          { number: "3", text: "No pit stop toilet breaks", checkedAt: 5.1 },
          { number: "4", text: "Net sweat loss: ~4 kg (~9 lbs)", checkedAt: 6.2, highlight: true },
        ],
      },
      presenter: {
        gesture: "open_palm",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 8.6],
      },
      voiceoverSrc: "audio/f1_scene4.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "click", at: 2.0 },
        { type: "click", at: 3.4 },
        { type: "click", at: 5.1 },
        { type: "ding", at: 6.2 },
      ],
      transitionOut: "halftone_wipe",
    },

    // ── Scene 5 · STRESS TEST · 9.0s ──────────────────────────────────
    {
      id: "05_qatar_2023",
      number: "05",
      label: "stress test",
      duration: 9.0,
      topRightCounter: { label: "HEAT", staticValue: "QATAR" },
      caption: cap(
        "Qatar, 2023. Extreme heat and humidity. One driver was sick in his helmet. Another retired from heat *exhaustion*. Some reported losing *four* kilos."
      ),
      widget: {
        type: "comparison_grid",
        windowTitle: "fia.medical.stress_test",
        theme: "dark",
        enterAt: 0.12,
        columns: [
          {
            icon: "❄️",
            title: "NORMAL GP",
            subtitle: "COOL / DRY AIR",
            statusText: "~2 KG LOST",
            tone: "neutral",
          },
          {
            icon: "🔥",
            title: "QATAR 2023",
            subtitle: "122°F + HUMIDITY",
            statusText: "4 KG / COLLAPSE",
            tone: "bad",
          },
        ],
        stamp: { text: "DANGEROUS", slamAt: 6.2 },
        footerLeft: "SURVIVAL: SEVERE DEHYDRATION",
        footerRight: "FATIGUE: CRITICAL",
      },
      presenter: {
        gesture: "shocked_hands",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 8.6],
      },
      voiceoverSrc: "audio/f1_scene5.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "click", at: 2.2 },
        { type: "stamp", at: 6.2 },
        { type: "ding", at: 7.6 },
      ],
      transitionOut: "halftone_wipe",
    },

    // ── Scene 6 · THE TWIST · 8.0s ────────────────────────────────────
    {
      id: "06_the_twist",
      number: "06",
      label: "the twist",
      duration: 8.0,
      topRightCounter: { label: "TWIST", staticValue: "H2O" },
      caption: cap(
        "The twist? It's not fat. It's *water*. Drivers rehydrate after the flag, and the weight returns within about a *day*."
      ),
      widget: {
        type: "comparison_grid",
        windowTitle: "physiology.recovery.matrix",
        theme: "paper",
        enterAt: 0.12,
        columns: [
          {
            icon: "🥩",
            title: "FAT BURNED",
            subtitle: "CALORIC EXPENDITURE",
            statusText: "~0.3 LBS",
            tone: "neutral",
          },
          {
            icon: "💧",
            title: "WATER LOST",
            subtitle: "REHYDRATION IN 24H",
            statusText: "+9.0 LBS RESTORED",
            tone: "good",
          },
        ],
        stamp: { text: "WATER ONLY", slamAt: 4.8 },
        footerLeft: "RECOVERY: 24-48 HOURS",
        footerRight: "RESTORED WITH ELECTROLYTES",
      },
      presenter: {
        gesture: "open_palm",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 7.2],
      },
      voiceoverSrc: "audio/f1_scene6.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "click", at: 0.8 },
        { type: "click", at: 3.0 },
        { type: "stamp", at: 4.8 },
        { type: "ding", at: 6.2 },
      ],
      transitionOut: "halftone_wipe",
    },

    // ── Scene 7 · VERDICT + CTA · 9.0s ────────────────────────────────
    {
      id: "07_verdict",
      number: "07",
      label: "the verdict",
      duration: 9.0,
      topRightCounter: { label: "VERDICT", staticValue: "100%" },
      caption: cap(
        "So that nine pounds is *sweat*, not fat. The price of racing at *170* beats a minute. Follow and subscribe for tomorrow's *mystery*."
      ),
      widget: {
        type: "physics_diagram",
        variant: "verdict_summary",
        windowTitle: "minute.mysteries.verdict",
        theme: "dark",
        enterAt: 0.12,
        stampText: "MYSTERY SOLVED",
        stampAt: 2.1,
        ctaBanner: "FOLLOW FOR TOMORROW'S MYSTERY",
      },
      presenter: {
        gesture: "thumbs_up",
        eyeGlanceAtCard: true,
        speakingWindow: [0.2, 8.7],
      },
      voiceoverSrc: "audio/f1_scene7.mp3",
      sfx: [
        { type: "whoosh", at: 0.0 },
        { type: "stamp", at: 2.1 },
        { type: "ding", at: 6.3 },
        { type: "click", at: 8.0 },
      ],
      transitionOut: "halftone_wipe",
    },
  ],
};

// Build-time guard: total runtime must be exactly 60.0s (1800 frames @ 30fps)
const total = whyF1DriversLoseNinePounds.scenes.reduce((s, sc) => s + sc.duration, 0);
if (Math.abs(total - 60) > 1e-6) {
  throw new Error(`Reel duration is ${total}s, expected 60.0s`);
}