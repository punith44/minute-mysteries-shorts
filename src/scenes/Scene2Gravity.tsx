import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { FeltPenCircle, SpeechBubble } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene2Gravity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gravity arrow downward slam animation
  const dropSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const arrowY = interpolate(dropSpring, [0, 1], [-60, 0]);
  const counterVal = Math.round(interpolate(dropSpring, [0, 1], [0, 3800]));

  return (
    <ReferenceLayout
      stageNumber="02"
      stageCategory="the physics"
      badgeLabel="FORCE"
      badgeValue="1.0G"
      headlineRegular="The problem? A sports car weighs"
      headlineEmphasis="3,800 pounds."
      windowTitle="physics.gravity.loadcell"
      cardHeight={740}
      presenter={<Presenter pose="pointing" x={0} y={0} scale={1.08} />}
    >
      {/* Speech Bubble Tag at Top Left */}
      <SpeechBubble
        tag="1 GRAVITY"
        text="Gravity violently pulls down."
        icon="↓"
        delay={4}
        style={{ top: 20, left: 24, zIndex: 10 }}
      />

      {/* Main Force Balance Visual */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 24,
          right: 24,
          height: 380,
          backgroundColor: "#1A1D24",
          borderRadius: 24,
          border: "1.5px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Giant Downward Gravity Arrow in Signal Red */}
        <div
          style={{
            transform: `translateY(${arrowY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg width="120" height="150" viewBox="0 0 120 150" fill="none">
            <line x1="60" y1="10" x2="60" y2="105" stroke="#E8402A" strokeWidth="18" strokeLinecap="round" />
            <polygon points="60,145 15,95 105,95" fill="#E8402A" />
          </svg>
        </div>

        {/* Counter Display */}
        <div style={{ marginTop: 12, textAlign: "center", position: "relative" }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 64,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-2px",
            }}
          >
            {counterVal.toLocaleString()} <span style={{ fontSize: 32, color: "#E8402A" }}>LBS</span>
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              color: "#7E8594",
              marginTop: 4,
            }}
          >
            DOWNWARD GRAVITATIONAL LOAD (1.0 G)
          </div>

          {/* Felt-Pen Circle around the 3,800 lbs number */}
          <FeltPenCircle
            delay={14}
            width={260}
            height={90}
            style={{ top: -8, left: -10 }}
          />
        </div>
      </div>

      {/* Lower Telemetry Strip */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <div
          style={{
            backgroundColor: "#191B22",
            borderRadius: 16,
            padding: "16px 20px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: "#7E8594" }}>CURB WEIGHT</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
            1,723 KG
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#191B22",
            borderRadius: 16,
            padding: "16px 20px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: "#7E8594" }}>REQUIRED COUNTERFORCE</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 700, color: "#00D2FF", marginTop: 4 }}>
            &gt; 3,800 LBS
          </div>
        </div>
      </div>
    </ReferenceLayout>
  );
};
