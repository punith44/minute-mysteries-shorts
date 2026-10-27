import type { ReelConfig } from "../schema/reelSchema";
import alignment from "./teslaRoadster.alignment.json";

/**
 * Topic 1: "Can Tesla's Roadster Drive Upside Down?"
 * High-retention 44.0s (1,320 frames @ 30fps) explainer short with:
 * - Exact acoustic word-level alignment (1-to-3 words on screen at a time)
 * - 1.5s–2.5s visual beat cuts (`beats`) with camera zoom punches & pose changes
 * - Authentic 3D-shaded cutout presenter (`png_cutout`)
 * - -15.0 LUFS normalized voiceover + -20dB sidechain-ducked background music
 */
export const teslaRoadsterReel: ReelConfig = {
  id: "MinuteMysteriesShort",
  title: "Can Tesla's Roadster Drive Upside Down?",
  genre: "tech_explainer",
  fps: 30,
  width: 1080,
  height: 1920,
  defaultCharacter: "png_cutout",
  springOvershoot: 0.45,
  backgroundMusicSrc: "audio/bgm_ducked.mp3",
  backgroundMusicVolume: 0.85,
  scenes: [
    // SCENE 01: Hook & Ceiling Claim (6.0s -> 3 visual beats @ 0.0s, 1.9s, 3.8s = 1.9s avg cut velocity)
    {
      id: "01_the_claim",
      number: "01",
      label: "the mystery",
      duration: 6.0,
      ambientEffect: "halftone_rays",
      topRightCounter: { label: "DEMO", staticValue: "1/7" },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene1.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "point_up_left",
        },
        {
          at: 1.85,
          cameraZoom: 1.06,
          cameraPanY: -12,
          presenterGesture: "shocked_hands",
          bannerAccentWord: "INVERTED",
          bannerText: "CEILING RIG",
          subTagOverride: "ceiling test",
        },
        {
          at: 3.8,
          cameraZoom: 1.05,
          cameraPanX: 10,
          presenterGesture: "open_palm",
          bannerAccentWord: "GRAVITY",
          bannerText: "DEFIED?",
          subTagOverride: "viral claim",
        },
      ],
      widget: {
        type: "physics_diagram",
        variant: "inverted_car_claim",
        windowTitle: "rig.telemetry.inversion",
        theme: "dark",
        enterAt: 0.08,
        footerLeft: "INVERTED EQUILIBRIUM: LOCKED",
        footerRight: "VERTICAL LOAD: +2.0 G",
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 5.21],
      },
      voiceoverSrc: "audio/scene1_narration.mp3",
      sfx: [
        { at: 0.08, type: "whoosh", volume: 0.72 },
        { at: 1.0, type: "riser", volume: 0.55 },
        { at: 1.85, type: "stamp", volume: 0.8 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 02: The Problem — 3,800 lbs Gravity Load (6.0s -> 3 visual beats @ 0.0s, 1.95s, 3.8s)
    {
      id: "02_the_problem",
      number: "02",
      label: "the physics",
      duration: 6.0,
      ambientEffect: "radar_rings",
      topRightCounter: {
        label: "WEIGHT",
        from: 0,
        to: 3800,
        suffix: " LBS",
      },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene2.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "open_palm",
        },
        {
          at: 1.95,
          cameraZoom: 1.065,
          cameraPanY: -14,
          presenterGesture: "shocked_hands",
          subTagOverride: "curb mass",
        },
        {
          at: 3.8,
          cameraZoom: 1.055,
          cameraPanX: -10,
          presenterGesture: "point_up_left",
          subTagOverride: "1.0G pull",
        },
      ],
      calloutBubble: {
        tag: "1 GRAVITY",
        sublabel: "downward pull",
        text: "Gravity violently pulls down at 1.0 G",
        icon: "↓",
        enterAt: 0.18,
      },
      widget: {
        type: "metric_counter",
        windowTitle: "physics.gravity.loadcell",
        theme: "dark",
        from: 0,
        to: 3800,
        unit: "LBS",
        sublabel: "DOWNWARD GRAVITATIONAL LOAD (1.0 G)",
        directionIcon: "down",
        enterAt: 0.1,
        circleHighlightAt: 0.65,
        footerMetrics: [
          { label: "CURB MASS", value: "1,723 KG" },
          { label: "REQUIRED SUCTION", value: "> 3,800 LBS", accent: true },
        ],
      },
      presenter: {
        gesture: "open_palm",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 5.85],
      },
      voiceoverSrc: "audio/scene2_narration.mp3",
      sfx: [
        { at: 0.45, type: "stamp", volume: 0.8 },
        { at: 1.95, type: "click", volume: 0.65 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 03: Active Ground-Sealing Skirts (6.5s -> 3 visual beats @ 0.0s, 2.1s, 4.2s)
    {
      id: "03_the_seal",
      number: "03",
      label: "aerodynamics",
      duration: 6.5,
      ambientEffect: "halftone_rays",
      topRightCounter: { label: "SEAL", staticValue: "14.7 PSI" },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene3.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "point_up_left",
        },
        {
          at: 2.1,
          cameraZoom: 1.055,
          cameraPanY: -10,
          presenterGesture: "open_palm",
          subTagOverride: "active skirts",
        },
        {
          at: 4.2,
          cameraZoom: 1.065,
          cameraPanX: 12,
          presenterGesture: "thumbs_up",
          subTagOverride: "vacuum lock",
        },
      ],
      calloutBubble: {
        tag: "2 VACUUM",
        sublabel: "airtight undertray",
        text: "Composite skirts trap low pressure",
        icon: "⚡",
        enterAt: 0.18,
      },
      widget: {
        type: "physics_diagram",
        variant: "vacuum_skirt_seal",
        windowTitle: "underbody.vacuum.cutaway",
        theme: "dark",
        enterAt: 0.1,
        footerLeft: "SEAL: ACTIVE FLEXIBLE COMPOSITE",
        footerRight: "LEAKAGE: < 0.05%",
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 5.18],
      },
      voiceoverSrc: "audio/scene3_narration.mp3",
      sfx: [
        { at: 0.1, type: "whoosh", volume: 0.68 },
        { at: 2.1, type: "stamp", volume: 0.78 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 04: Twin 25,000 RPM Turbine Fans (6.5s -> 3 visual beats @ 0.0s, 2.0s, 4.0s)
    {
      id: "04_the_fans",
      number: "04",
      label: "turbine drive",
      duration: 6.5,
      ambientEffect: "radar_rings",
      topRightCounter: {
        label: "FANS",
        from: 1000,
        to: 25000,
        suffix: " RPM",
      },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene4.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "point_up_left",
        },
        {
          at: 1.95,
          cameraZoom: 1.06,
          cameraPanY: -12,
          presenterGesture: "shocked_hands",
          subTagOverride: "25,000 rpm",
        },
        {
          at: 4.0,
          cameraZoom: 1.065,
          cameraPanX: -12,
          presenterGesture: "thumbs_up",
          subTagOverride: "2.0G suction",
        },
      ],
      calloutBubble: {
        tag: "3 DOWNFORCE",
        sublabel: "brute force",
        text: "2.0 G locks the car upside down",
        icon: "2G",
        enterAt: 0.2,
      },
      widget: {
        type: "physics_diagram",
        variant: "twin_turbines",
        windowTitle: "fans.turbine.suction.rpm",
        theme: "dark",
        enterAt: 0.1,
        footerLeft: "NET SUCTION: 2.0 G (DEFIES GRAVITY)",
        footerRight: "DRIVE: 180 kW ELECTRIC",
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 6.31],
      },
      voiceoverSrc: "audio/scene4_narration.mp3",
      sfx: [
        { at: 0.1, type: "turbine", volume: 0.65, durationInFrames: 75 },
        { at: 1.95, type: "stamp", volume: 0.8 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 05: SpaceX Cold-Gas Thrusters (6.0s -> 3 visual beats @ 0.0s, 1.9s, 4.1s)
    {
      id: "05_the_flip",
      number: "05",
      label: "space package",
      duration: 6.0,
      ambientEffect: "halftone_rays",
      topRightCounter: {
        label: "PRESSURE",
        from: 500,
        to: 10000,
        suffix: " PSI",
      },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene5.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "open_palm",
        },
        {
          at: 1.9,
          cameraZoom: 1.055,
          cameraPanX: 12,
          presenterGesture: "point_up_left",
          subTagOverride: "copv tank",
        },
        {
          at: 4.1,
          cameraZoom: 1.065,
          cameraPanY: -12,
          presenterGesture: "shocked_hands",
          subTagOverride: "10,000 psi",
        },
      ],
      calloutBubble: {
        tag: "4 SPACEX TECH",
        sublabel: "attitude control",
        text: "10,000 PSI COPV nitrogen thrusters",
        icon: "🚀",
        enterAt: 0.18,
      },
      widget: {
        type: "physics_diagram",
        variant: "cold_gas_thrusters",
        windowTitle: "spacex.copv.thrusters.telemetry",
        theme: "dark",
        enterAt: 0.1,
        footerLeft: "PROPULSION: COLD-GAS NITROGEN",
        footerRight: "3-AXIS GYRO STABILIZED",
      },
      presenter: {
        gesture: "open_palm",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 5.51],
      },
      voiceoverSrc: "audio/scene5_narration.mp3",
      sfx: [
        { at: 0.15, type: "thruster", volume: 0.85, durationInFrames: 48 },
        { at: 3.4, type: "riser", volume: 0.55 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 06: Reality Check — Public Streets & Slamming Stamp (6.5s -> 3 visual beats @ 0.0s, 2.2s, 4.1s)
    {
      id: "06_reality_check",
      number: "06",
      label: "reality check",
      duration: 6.5,
      ambientEffect: "radar_rings",
      topRightCounter: { label: "ROAD LEGAL", staticValue: "0/1" },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene6.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "open_palm",
        },
        {
          at: 2.25,
          cameraZoom: 1.07,
          cameraPanY: -10,
          presenterGesture: "shocked_hands",
          subTagOverride: "street illegal",
        },
        {
          at: 4.1,
          cameraZoom: 1.055,
          cameraPanX: -10,
          presenterGesture: "point_up_left",
          subTagOverride: "seal failure",
        },
      ],
      calloutBubble: {
        tag: "5 DANGER",
        sublabel: "public roads",
        text: "One pothole shatters the vacuum seal",
        icon: "⚠️",
        enterAt: 0.18,
      },
      widget: {
        type: "comparison_grid",
        windowTitle: "compliance.dot.regulation.v1",
        theme: "dark",
        enterAt: 0.1,
        columns: [
          {
            icon: "✨",
            title: "CONTROLLED RIG",
            subtitle: "SMOOTH STEEL TRACK",
            statusText: "AIRTIGHT SEAL LOCKED",
            tone: "good",
          },
          {
            icon: "🕳️",
            title: "PUBLIC HIGHWAY",
            subtitle: "POTHOLES & GRAVEL",
            statusText: "VACUUM SHATTERS",
            tone: "bad",
          },
        ],
        stamp: {
          text: "STREET ILLEGAL",
          slamAt: 2.25,
        },
        footerLeft: "STATUS: NON-COMPLIANT ON ROADS",
        footerRight: "HAZARD: 25K RPM GRAVEL SHRAPNEL",
      },
      presenter: {
        gesture: "open_palm",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 6.0],
      },
      voiceoverSrc: "audio/scene6_narration.mp3",
      sfx: [
        { at: 0.1, type: "whoosh", volume: 0.65 },
        { at: 1.4, type: "riser", volume: 0.6 },
        { at: 2.25, type: "stamp", volume: 0.92 },
      ],
      transitionOut: "halftone_wipe",
    },

    // SCENE 07: The Verdict & Outro CTA (6.5s -> 3 visual beats @ 0.0s, 1.8s, 3.6s)
    {
      id: "07_the_verdict",
      number: "07",
      label: "case resolved",
      duration: 6.5,
      ambientEffect: "halftone_rays",
      topRightCounter: { label: "VERDICT", staticValue: "CONFIRMED" },
      caption: {
        keyWordLead: 0.1,
        maxWordsPerChunk: 3,
        ghostUnrevealed: true,
        words: alignment.scene7.words,
      },
      beats: [
        {
          at: 0.0,
          cameraZoom: 1.0,
          presenterGesture: "point_up_left",
        },
        {
          at: 1.75,
          cameraZoom: 1.06,
          cameraPanY: -10,
          presenterGesture: "open_palm",
          bannerAccentWord: "AEROSPACE",
          bannerText: "ENGINEERING",
          subTagOverride: "proven tech",
        },
        {
          at: 3.5,
          cameraZoom: 1.065,
          presenterGesture: "thumbs_up",
          bannerAccentWord: "SUBSCRIBE",
          bannerText: "FOR MORE",
          subTagOverride: "join the lab",
        },
      ],
      widget: {
        type: "physics_diagram",
        variant: "verdict_summary",
        windowTitle: "verdict.minute.mysteries",
        theme: "dark",
        enterAt: 0.1,
        ctaBanner: "SUBSCRIBE // MINUTE MYSTERIES",
      },
      presenter: {
        gesture: "point_up_left",
        eyeGlanceAtCard: true,
        speakingWindow: [0.12, 6.08],
      },
      voiceoverSrc: "audio/scene7_narration.mp3",
      sfx: [
        { at: 0.1, type: "whoosh", volume: 0.65 },
        { at: 3.4, type: "ding", volume: 0.92, durationInFrames: 36 },
      ],
      transitionOut: "none",
    },
  ],
};
