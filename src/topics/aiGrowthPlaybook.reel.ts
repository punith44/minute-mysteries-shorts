import type { ReelConfig } from "../schema/reelSchema";

/**
 * Topic 2: "AI-Animated Reels Playbook" (Reference Benchmark Showcase)
 * Directly demonstrates 1-to-3 word chunking, 1.5s–2.5s beat cuts, rotating halftone rays,
 * 3D-shaded cutout presenter poses, and multi-card notification stacks.
 */
export const aiGrowthPlaybookReel: ReelConfig = {
  id: "AIGrowthPlaybookShort",
  title: "How Programmatic AI Reels Grow to 40,000 Followers",
  genre: "tech_explainer",
  fps: 30,
  width: 1080,
  height: 1920,
  defaultCharacter: "png_cutout",
  springOvershoot: 0.45,
  backgroundMusicSrc: "audio/bgm_ducked.mp3",
  backgroundMusicVolume: 0.85,
  scenes: [
    // SCENE 01: Exact recreation of Video-1328 (0:00-0:04)
    {
      id: "01_the_account",
      number: "01",
      label: "the account",
      duration: 4.0,
      ambientEffect: "halftone_rays",
      topRightCounter: {
        label: "FOLLOWERS",
        from: 2283,
        to: 39535,
      },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: [
          { text: "I", at: 0.1, end: 0.25 },
          { text: "grew", at: 0.25, end: 0.42 },
          { text: "this", at: 0.42, end: 0.6 },
          { text: "account", at: 0.6, end: 0.84 },
          { text: "to", at: 0.84, end: 1.05 },
          { text: "*40,000*", at: 1.05, end: 1.5, accent: true, zoomKick: 1.06 },
          { text: "followers", at: 1.5, end: 1.82 },
          { text: "in", at: 1.82, end: 1.98 },
          { text: "the", at: 1.98, end: 2.14 },
          { text: "past", at: 2.14, end: 2.38 },
          { text: "*35 days,*", at: 2.38, end: 3.1, accent: true, zoomKick: 1.065 },
        ],
      },
      beats: [
        { at: 0.0, cameraZoom: 1.0, presenterGesture: "point_up_left" },
        {
          at: 1.85,
          cameraZoom: 1.06,
          cameraPanY: -10,
          presenterGesture: "shocked_hands",
          subTagOverride: "viral spike",
        },
      ],
      widget: {
        type: "notification_stack",
        enterAt: 0.1,
        profileHandle: "adilet.fndr",
        postsCount: 26,
        followersFrom: 2283,
        followersTo: 39535,
        followingCount: 625,
        bioLine: "Digital creator · Tech & AI Education",
        toastIncrement: 38,
        calendarDay: {
          dayNumber: 35,
          label: "of posting",
          enterAt: 2.3,
        },
        notifications: [
          { init: "P", color: "#7B3FE4", user: "pri•••mk", time: "2s", btn: "Follow", enterAt: 0.25 },
          { init: "L", color: "#65A30D", user: "luk•••tz", time: "1s", btn: "Follow", enterAt: 0.52 },
          { init: "D", color: "#52525B", user: "dev•••am", time: "now", btn: "Following", enterAt: 0.8 },
          { init: "N", color: "#059669", user: "nor•••im", time: "2s", btn: "Follow", enterAt: 1.1 },
          { init: "J", color: "#D97706", user: "jtc•••es", time: "1s", btn: "Follow", enterAt: 1.4 },
        ],
      },
      presenter: {
        gesture: "shocked_hands",
        eyeGlanceAtCard: true,
        speakingWindow: [0.1, 3.2],
      },
      sfx: [
        { at: 0.1, type: "whoosh", volume: 0.7 },
        { at: 1.0, type: "click", volume: 0.6 },
        { at: 2.15, type: "stamp", volume: 0.85 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 02: Exact recreation of Video-27458 Checklist ("Before launch 0/4")
    {
      id: "02_before_launch",
      number: "02",
      label: "before launch",
      duration: 4.0,
      ambientEffect: "radar_rings",
      topRightCounter: { label: "STEP", staticValue: "2/4" },
      progressDock: {
        title: "// your editing skill",
        progressText: "2/4",
        activeStepIndex: 2,
        steps: ["01 · Measure", "02 · Skill", "03 · Build"],
      },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: [
          { text: "until", at: 0.1, end: 0.42 },
          { text: "you've", at: 0.42, end: 0.75 },
          { text: "done", at: 0.75, end: 1.15 },
          { text: "*these*", at: 1.15, end: 1.65, accent: true, zoomKick: 1.055 },
          { text: "*four*", at: 1.65, end: 2.1, accent: true },
          { text: "steps.", at: 2.1, end: 2.75 },
        ],
      },
      beats: [
        { at: 0.0, cameraZoom: 1.0, presenterGesture: "point_up_left" },
        {
          at: 1.9,
          cameraZoom: 1.055,
          cameraPanX: 10,
          presenterGesture: "open_palm",
          subTagOverride: "launch checklist",
        },
      ],
      widget: {
        type: "checklist",
        title: "Before launch",
        badgeProgress: "2/4",
        enterAt: 0.1,
        items: [
          { number: "1", text: "Know your rivals", checkedAt: 0.9 },
          { number: "2", text: "A page that takes money", checkedAt: 1.6 },
          { number: "3", text: "Programmatic motion reels" },
          { number: "4", text: "Daily feedback loop" },
        ],
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.1, 3.2],
      },
      sfx: [
        { at: 0.9, type: "click", volume: 0.7 },
        { at: 1.6, type: "click", volume: 0.7 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 03: Exact recreation of Video-1328 / Video-34923 / Video-59353 Dark Stage Shift + Progress Dock
    {
      id: "03_early_wave",
      number: "03",
      label: "early wave",
      duration: 4.0,
      stageTheme: "dark",
      ambientEffect: "halftone_rays",
      topRightCounter: {
        label: "VIEWS",
        from: 11,
        to: 142000,
      },
      progressDock: {
        title: "// your editing skill",
        progressText: "3/4",
        activeStepIndex: 3,
        steps: ["01 · Measure", "02 · Skill", "03 · Build"],
      },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: [
          { text: "Right", at: 0.1, end: 0.35 },
          { text: "now,", at: 0.35, end: 0.68 },
          { text: "*AI-animated*", at: 0.68, end: 1.2, accent: true, zoomKick: 1.06 },
          { text: "reels", at: 1.2, end: 1.55 },
          { text: "are", at: 1.55, end: 1.8 },
          { text: "still", at: 1.8, end: 2.1 },
          { text: "*early.*", at: 2.1, end: 2.8, accent: true, zoomKick: 1.06 },
        ],
      },
      beats: [
        { at: 0.0, cameraZoom: 1.0, presenterGesture: "point_up_left" },
        {
          at: 1.9,
          cameraZoom: 1.06,
          presenterGesture: "thumbs_up",
          bannerAccentWord: "UNLIMITED",
          bannerText: "REELS",
          subTagOverride: "4.9M views",
        },
      ],
      calloutBubble: {
        tag: "1 FIRST",
        sublabel: "you might think",
        text: "they won't go viral",
        icon: "?",
        enterAt: 0.18,
      },
      widget: {
        type: "chart_trend",
        title: "// views · since posting",
        metricValue: "142K",
        metricLabel: "views",
        liveBadge: true,
        pillBanner: "AI-animated reels",
        nowMarkerLabel: "NOW",
        points: [8, 9, 12, 10, 14, 18, 26, 42, 68, 95],
        enterAt: 0.1,
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.1, 3.2],
      },
      sfx: [
        { at: 0.12, type: "whoosh", volume: 0.65 },
        { at: 1.9, type: "ding", volume: 0.88 },
      ],
      transitionOut: "none",
    },
  ],
};
