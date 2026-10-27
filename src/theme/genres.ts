export type ReelGenre =
  | "tech_explainer"
  | "scientific_breakdown"
  | "historical_mystery"
  | "dark_psychology"
  | "motivational";

export interface GenreThemeSpec {
  id: ReelGenre;
  background: string;
  cardLight: string;
  cardDark: string;
  ink: string;
  inkMuted: string;
  primaryAccent: string;       // Editorial / primary highlight (#E8402A, etc.)
  activeWordHighlight: string; // High-contrast active spoken word highlight (#FFFF00, #00FF66, etc.)
  secondaryAccent: string;     // Telemetry / vector accent (#00D2FF, etc.)
  ambientEffect: "halftone_rays" | "radar_rings" | "orbital_grid" | "hypnotic_pulse" | "speed_lines";
}

export const GENRE_THEMES: Record<ReelGenre, GenreThemeSpec> = {
  tech_explainer: {
    id: "tech_explainer",
    background: "#EFEBE4",
    cardLight: "#FFFFFF",
    cardDark: "#141519",
    ink: "#111111",
    inkMuted: "#52525B",
    primaryAccent: "#E8402A",
    activeWordHighlight: "#E8402A",
    secondaryAccent: "#00D2FF",
    ambientEffect: "halftone_rays",
  },
  scientific_breakdown: {
    id: "scientific_breakdown",
    background: "#EFEBE4",
    cardLight: "#FFFFFF",
    cardDark: "#12151E",
    ink: "#111111",
    inkMuted: "#4B5563",
    primaryAccent: "#E8402A",
    activeWordHighlight: "#00FF66",
    secondaryAccent: "#00D2FF",
    ambientEffect: "radar_rings",
  },
  historical_mystery: {
    id: "historical_mystery",
    background: "#EAE2D3",
    cardLight: "#FBF8F1",
    cardDark: "#181512",
    ink: "#141210",
    inkMuted: "#5C5449",
    primaryAccent: "#C83228",
    activeWordHighlight: "#FFFF00",
    secondaryAccent: "#E5A93C",
    ambientEffect: "halftone_rays",
  },
  dark_psychology: {
    id: "dark_psychology",
    background: "#0E0F14",
    cardLight: "#181A22",
    cardDark: "#12131A",
    ink: "#F4F4F6",
    inkMuted: "#9CA3AF",
    primaryAccent: "#FF2A4B",
    activeWordHighlight: "#FFFF00",
    secondaryAccent: "#00FF66",
    ambientEffect: "hypnotic_pulse",
  },
  motivational: {
    id: "motivational",
    background: "#111217",
    cardLight: "#1B1D26",
    cardDark: "#14161D",
    ink: "#FFFFFF",
    inkMuted: "#A1A1AA",
    primaryAccent: "#00FF66",
    activeWordHighlight: "#FFFF00",
    secondaryAccent: "#00D2FF",
    ambientEffect: "speed_lines",
  },
};
