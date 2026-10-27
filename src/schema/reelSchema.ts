import type { ReelGenre } from "../theme/genres";

export type PresenterCharacter = "png_cutout" | "bearded_human" | "pip_mascot" | "none";

export type PresenterGesture =
  | "point_up_left"
  | "open_palm"
  | "shocked_hands"
  | "thumbs_up";

export interface WordToken {
  /** Word text. Wrap in *asterisks* or set accent: true for high-contrast emphasis */
  text: string;
  /** Exact word start time in seconds (relative to scene start) */
  at: number;
  /** Optional exact word end time in seconds (from forced alignment / WhisperX) */
  end?: number;
  /** Render as emphasized keyword with spring overshoot */
  accent?: boolean;
  /** Optional custom highlight color override for this word (e.g. "#FFFF00", "#00FF66", "#E8402A") */
  highlightColor?: string;
  /** Trigger a camera zoom kick when this word lands */
  zoomKick?: number;
}

export interface TopTagCounter {
  label: string;
  from?: number;
  to?: number;
  staticValue?: string;
  prefix?: string;
  suffix?: string;
}

export interface SfxCue {
  /** Time in seconds relative to scene start */
  at: number;
  type:
    | "whoosh"
    | "stamp"
    | "click"
    | "pop"
    | "riser"
    | "sub_impact"
    | "turbine"
    | "thruster"
    | "ding";
  volume?: number;
  durationInFrames?: number;
}

export interface CalloutBubbleSpec {
  tag: string;       // e.g. "1 FIRST"
  sublabel?: string; // e.g. "you might think"
  text: string;      // e.g. "they won't go viral"
  icon?: string;     // e.g. "?"
  enterAt?: number;  // seconds
}

/**
 * 1.5s to 2.5s Sub-Scene Visual Micro-Cut Beat
 * Ensures continuous high-velocity visual engagement without static shots.
 */
export interface SceneBeat {
  /** Time in seconds when this micro-cut triggers (every 1.5s - 2.5s) */
  at: number;
  /** Camera punch/target zoom for this beat (e.g. 1.06) */
  cameraZoom?: number;
  /** Camera horizontal pan offset in px */
  cameraPanX?: number;
  /** Camera vertical pan offset in px */
  cameraPanY?: number;
  /** Switch presenter pose on this beat */
  presenterGesture?: PresenterGesture;
  /** Optional kinetic banner or badge that slams in on this beat (like Video-34923 "UNLIMITED REELS") */
  bannerText?: string;
  bannerAccentWord?: string;
  /** Optional top-left sub-tag override (like Video-1328 `// b02 · the hand-off`) */
  subTagOverride?: string;
}

/**
 * Topic-agnostic Visual Widget Union
 */
export type WidgetSpec =
  | {
      type: "checklist";
      title: string;
      badgeProgress?: string;
      enterAt?: number;
      tilt?: number;
      items: Array<{
        number: string;
        text: string;
        checkedAt?: number;
        highlight?: boolean;
      }>;
    }
  | {
      type: "metric_counter";
      title?: string;
      windowTitle?: string;
      theme?: "paper" | "dark";
      from: number;
      to: number;
      unit: string;
      sublabel: string;
      directionIcon?: "down" | "up" | "bolt" | "none";
      enterAt?: number;
      tilt?: number;
      circleHighlightAt?: number;
      footerMetrics?: Array<{ label: string; value: string; accent?: boolean }>;
    }
  | {
      type: "notification_stack";
      enterAt?: number;
      profileHandle: string;
      postsCount: number;
      followersFrom: number;
      followersTo: number;
      followingCount: number;
      bioLine: string;
      toastIncrement: number;
      calendarDay?: {
        dayNumber: number;
        label: string;
        enterAt: number;
      };
      notifications: Array<{
        init: string;
        color: string;
        user: string;
        time: string;
        btn: "Follow" | "Following";
        enterAt: number;
      }>;
    }
  | {
      type: "comparison_grid";
      title?: string;
      windowTitle?: string;
      theme?: "paper" | "dark";
      enterAt?: number;
      tilt?: number;
      columns: Array<{
        icon?: string;
        badge?: string;
        title: string;
        subtitle: string;
        statusText: string;
        tone: "good" | "bad" | "neutral";
      }>;
      stamp?: {
        text: string;
        slamAt: number; // seconds
        color?: string;
      };
      footerLeft?: string;
      footerRight?: string;
    }
  | {
      type: "chart_trend";
      title: string;
      metricValue: string;
      metricLabel: string;
      liveBadge?: boolean;
      xAxisLabel?: string;
      yAxisLabel?: string;
      pillBanner?: string;
      nowMarkerLabel?: string;
      points: number[]; // Normalized 0..100 y-values
      enterAt?: number;
      tilt?: number;
    }
  | {
      type: "physics_diagram";
      variant:
        | "inverted_car_claim"
        | "vacuum_skirt_seal"
        | "twin_turbines"
        | "cold_gas_thrusters"
        | "verdict_summary"
        | "poly_loop_ramp"
        | "poly_beat_gravity"
        | "poly_inverted_wing"
        | "poly_suction_fans"
        | "poly_copv_flight"
        | "poly_rocket_landing"
        | "poly_pisa_hook"
        | "poly_pisa_lagoon"
        | "poly_pisa_mussolini"
        | "poly_pisa_pavia"
        | "poly_pisa_lead"
        | "poly_pisa_drills"
        | "poly_pisa_table"
        | "poly_pisa_reopen"
        | "poly_outro_card";
      windowTitle?: string;
      theme?: "paper" | "dark";
      enterAt?: number;
      tilt?: number;
      stampText?: string;
      stampAt?: number;
      circleAt?: number;
      ctaBanner?: string;
      footerLeft?: string;
      footerRight?: string;
    }
  | {
      type: "video_clip";
      src: string;
      windowTitle?: string;
      caption?: string;
      theme?: "paper" | "dark";
      enterAt?: number;
      tilt?: number;
      startFromSec?: number;
      playbackRate?: number;
      muted?: boolean;
      volume?: number;
      footerLeft?: string;
      footerRight?: string;
      overlayTelemetry?: {
        speed?: string;
        gear?: string;
        heartRate?: string;
        gForce?: string;
        heatTemp?: string;
      };
    }
  | {
      type: "visual_scene";
      /** Path inside public/ to the script-matched AI image (e.g. "visuals/electricBath/scene_01.png") */
      imageSrc: string;
      windowTitle?: string;
      theme?: "paper" | "dark";
      enterAt?: number;
      tilt?: number;
      /** Top badge pill text inside the scene frame */
      badgeText?: string;
      /** Bottom headline caption inside the scene frame */
      headlineText?: string;
      /** Sublabel or historical note */
      subtext?: string;
      /** Opus 5.5-style procedural SVG/Canvas animation layered over the visual */
      overlayAnimation?:
        | "electric_arcs"
        | "victorian_receipt"
        | "era_timeline"
        | "nerve_pulses"
        | "tub_circuit"
        | "danger_meter"
        | "miracle_hype"
        | "modern_ecg";
      /** Optional rubber stamp slam */
      stamp?: {
        text: string;
        slamAt: number;
        color?: string;
      };
      footerLeft?: string;
      footerRight?: string;
    };

export interface SceneConfig {
  id: string;
  /** Scene number tag, e.g. "01" */
  number: string;
  /** Scene category tag, e.g. "the claim" */
  label: string;
  /** Duration in seconds */
  duration: number;
  /** Top-right counter or badge in the header row */
  topRightCounter: TopTagCounter;
  /** Optional per-scene stage theme override ("light" paper vs "dark" midnight mode shift, like Video-28363/4247/59353) */
  stageTheme?: "light" | "dark";
  /** Optional Poly Lab / Editorial Top Headline + Pill Badges (used when captions are at the bottom) */
  topHeadline?: {
    text: string;
    align?: "center" | "left";
    underlineBrush?: boolean;
    typewriter?: boolean;
    /** Optional 12-tick radial clock / year burst behind the top-left year headline (matches Leaning Tower of Pisa reference) */
    radialClockBurst?: boolean;
    pills?: Array<{
      text: string;
      enterAt?: number;
      filled?: boolean;
      fillColor?: string;
    }>;
  };
  /** Optional Poly Lab mid-reel engagement toast ("Want to see more videos like this? Please hit FOLLOW...") */
  followToast?: {
    enterAt: number;
    exitAt?: number;
    title?: string;
    subtitle?: string;
  };
  /** Optional persistent bottom-left mini progress dock (like Video-28363 `// 5 free repos 3/5` or Video-59353 `Your editing skill 2/4`) */
  progressDock?: {
    title: string;
    progressText: string;
    activeStepIndex: number; // 1-based index
    steps: string[];
  };
  /** Word-timed kinetic caption configuration */
  caption: {
    /** Seconds by which *accent* words land early before their spoken timestamp (default 0.12s) */
    keyWordLead?: number;
    /** Maximum words displayed on screen at once (default: 3 for 1-to-3 word high-velocity chunks) */
    maxWordsPerChunk?: number;
    /** Vertical placement of captions: "top" (8%-22% Y) or "bottom" (80%-88% Y, like Poly Lab / MadeToScale / PromptMaster) */
    position?: "top" | "bottom";
    /** Caption styling mode: "editorial_kinetic" (Space Grotesk + Red Instrument Serif), "viral_bold" (Montserrat Black + Neon Pill), or "poly_pill" (Clean Sans + Orange/Red Rounded Pill on every active word) */
    styleVariant?: "editorial_kinetic" | "viral_bold" | "poly_pill";
    /** Active spoken word highlight color (e.g. "#ED8A33", "#E8402A", "#FFFF00", "#00FF66", "#38BDF8") */
    activeHighlightColor?: string;
    /** Show unrevealed words in the active 3-word chunk at low ghost opacity (default: true) */
    ghostUnrevealed?: boolean;
    words: WordToken[];
  };
  /** Optional 1.5s-2.5s visual micro-cut beats within this scene */
  beats?: SceneBeat[];
  /** Optional ambient background motion layer override */
  ambientEffect?:
    | "halftone_rays"
    | "radar_rings"
    | "orbital_grid"
    | "hypnotic_pulse"
    | "speed_lines";
  /** Optional floating speech-bubble callout above the main card */
  calloutBubble?: CalloutBubbleSpec;
  /** Hero visual widget(s) rendered in the 26%-68% stage zone */
  widget: WidgetSpec;
  /** Presenter configuration */
  presenter: {
    character?: PresenterCharacter;
    gesture: PresenterGesture;
    eyeGlanceAtCard?: boolean;
    speakingWindow?: [number, number]; // [startSec, endSec]
    scale?: number;
    xOffset?: number;
  };
  /** Scene voiceover audio file path inside public/ (e.g. "audio/scene1_narration.mp3") */
  voiceoverSrc?: string;
  /** Scene-local SFX cues */
  sfx?: SfxCue[];
  /** Transition at the end of the scene */
  transitionOut?: "halftone_wipe" | "blur_rack" | "punch_cut" | "none";
}

export interface ReelConfig {
  id: string;
  title: string;
  genre?: ReelGenre;
  fps?: number;
  width?: number;
  height?: number;
  defaultCharacter?: PresenterCharacter;
  springOvershoot?: number; // Default 0.45 (45%)
  /** Optional continuous voiceover track for the whole reel in public/ (e.g. "audio/electricBath_narration.mp3") */
  masterVoiceoverSrc?: string;
  /** Optional master ducked background music track in public/ (e.g. "audio/bgm_ducked.mp3") */
  backgroundMusicSrc?: string;
  backgroundMusicVolume?: number;
  scenes: SceneConfig[];
}
