import React from "react";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";

interface BackgroundProps {
  episodeNumber?: string;
  topic?: string;
}

export const Background: React.FC<BackgroundProps> = ({
  episodeNumber = "MM-084",
  topic = "TESLA ROADSTER // INVERSION PHYSICS",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: COLORS.paper,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Subtle Technical Grid Lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="blueprint-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={COLORS.ink}
              strokeWidth="1.2"
            />
            {/* Inner micro-grid */}
            <circle cx="30" cy="30" r="1.5" fill={COLORS.ink} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>

      {/* Top Dossier Header Bar */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: FONTS.sans,
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.inkMuted,
          letterSpacing: "0.15em",
          borderBottom: `2px solid ${COLORS.ink}`,
          paddingBottom: 16,
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: COLORS.signalRed,
              borderRadius: "50%",
            }}
          />
          <span>MINUTE MYSTERIES</span>
          <span style={{ color: COLORS.signalRed }}>//</span>
          <span>{episodeNumber}</span>
        </div>

        <div style={{ fontSize: 16, color: COLORS.inkLight }}>
          {topic}
        </div>
      </div>

      {/* Outer Technical Registration Crosses */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {/* Top-Left */}
        <path
          d="M 40 50 L 60 50 M 50 40 L 50 60"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        {/* Top-Right */}
        <path
          d="M 1020 50 L 1040 50 M 1030 40 L 1030 60"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        {/* Bottom-Left */}
        <path
          d="M 40 1870 L 60 1870 M 50 1860 L 50 1880"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        {/* Bottom-Right */}
        <path
          d="M 1020 1870 L 1040 1870 M 1030 1860 L 1030 1880"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
