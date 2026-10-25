import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../theme/fonts";
import { HalftonePattern } from "./HalftoneShadow";

interface ReferenceLayoutProps {
  stageNumber: string;         // e.g. "01"
  stageCategory: string;       // e.g. "the mystery"
  badgeLabel: string;          // e.g. "DEMO"
  badgeValue: string;          // e.g. "1/7"
  headlineRegular: string;     // e.g. "Can Tesla's Roadster really"
  headlineEmphasis: string;    // e.g. "drive upside down?"
  windowTitle?: string;        // e.g. "rig.telemetry.inversion"
  children: React.ReactNode;   // Main card contents
  presenter?: React.ReactNode; // Presenter placed in front of everything
  cardHeight?: number;         // Card height in px (default 680)
}

export const ReferenceLayout: React.FC<ReferenceLayoutProps> = ({
  stageNumber,
  stageCategory,
  badgeLabel,
  badgeValue,
  headlineRegular,
  headlineEmphasis,
  windowTitle = "telemetry.system",
  children,
  presenter,
  cardHeight = 680,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for headline
  const headlineSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Card slide-up & scale spring
  const cardSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 15, stiffness: 110 },
  });

  const cardTranslateY = interpolate(cardSpring, [0, 1], [60, 0]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.94, 1.0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        backgroundColor: "#EFEBE4",
        color: "#111111",
        overflow: "hidden",
        fontFamily: FONTS.sans,
      }}
    >
      <HalftonePattern />

      {/* Procedural Fine Paper Stipple Dot Matrix Pattern */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <defs>
          <pattern id="paper-stipple" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.75" fill="#111111" opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#paper-stipple)" />
      </svg>

      {/* Halftone Vignette / Dot-Matrix borders along left, right, and bottom edges */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 36,
          height: "100%",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#halftone-dots)" opacity="0.4" />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 36,
          height: "100%",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#halftone-dots)" opacity="0.4" />
        </svg>
      </div>

      {/* 1. TOP HEADER BAR */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONTS.mono,
          fontSize: 28,
          letterSpacing: "-0.5px",
          color: "#444444",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#777777" }}>// {stageNumber} ·</span>
          <span style={{ textTransform: "lowercase", color: "#111111", fontWeight: 700 }}>
            {stageCategory}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
          <span>{badgeLabel}</span>
          <span style={{ color: "#E8402A" }}>{badgeValue}</span>
        </div>
      </div>

      {/* 2. KINETIC HEADLINE (Upper Third directly on paper canvas) */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 64,
          right: 64,
          zIndex: 20,
          transform: `translateY(${interpolate(headlineSpring, [0, 1], [25, 0])}px)`,
          opacity: headlineSpring,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 68,
            lineHeight: 1.15,
            fontWeight: 800,
            color: "#111111",
            letterSpacing: "-1.8px",
          }}
        >
          {headlineRegular}{" "}
          <span
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#E8402A",
              letterSpacing: "-0.5px",
              display: "inline-block",
            }}
          >
            {headlineEmphasis}
          </span>
        </h1>
      </div>

      {/* 3. MAIN CONTENT CARD WITH HALFTONE DROP SHADOW */}
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 64,
          width: 952,
          height: cardHeight,
          zIndex: 30,
          transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        {/* Halftone Dot Drop Shadow layer (Offset by +18px, +18px) */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            width: "100%",
            height: "100%",
            borderRadius: 32,
            overflow: "hidden",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#halftone-dots)" />
          </svg>
        </div>

        {/* Foreground Dark Card Surface */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "#141519",
            borderRadius: 32,
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          {/* macOS Window Chrome Header */}
          <div
            style={{
              height: 54,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              justifyContent: "space-between",
            }}
          >
            {/* Traffic Light Dots */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#27C93F" }} />
            </div>

            {/* Window title */}
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                color: "#7E8594",
                letterSpacing: "-0.2px",
              }}
            >
              // {windowTitle}
            </div>

            <div style={{ width: 44 }} />
          </div>

          {/* Card Body */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", padding: 28 }}>
            {children}
          </div>
        </div>
      </div>

      {/* 4. PRESENTER IN FRONT OF EVERYTHING AT BOTTOM RIGHT */}
      {presenter}
    </div>
  );
};
