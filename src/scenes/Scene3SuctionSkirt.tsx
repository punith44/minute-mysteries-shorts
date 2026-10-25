import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { FeltPenCircle, SpeechBubble } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene3SuctionSkirt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sealSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const skirtY = interpolate(sealSpring, [0, 1], [-20, 0]);

  return (
    <ReferenceLayout
      stageNumber="03"
      stageCategory="aerodynamics"
      badgeLabel="SEAL"
      badgeValue="14.7 PSI"
      headlineRegular="Tesla used active ground skirts,"
      headlineEmphasis="creating a giant vacuum."
      windowTitle="underbody.vacuum.cutaway"
      cardHeight={740}
      presenter={<Presenter pose="gesturing" x={0} y={0} scale={1.08} />}
    >
      <SpeechBubble
        tag="2 VACUUM"
        text="Airtight seal traps low pressure."
        icon="⚡"
        delay={4}
        style={{ top: 20, left: 24, zIndex: 10 }}
      />

      {/* Technical Underbody Cutaway Graphic */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 24,
          right: 24,
          height: 380,
          backgroundColor: "#16181F",
          borderRadius: 24,
          border: "1.5px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
          padding: 24,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 840 330" fill="none">
          {/* Ceiling track surface */}
          <rect x="40" y="30" width="760" height="20" fill="#252A36" stroke="#3A404D" strokeWidth="2" />

          {/* Flexible composite skirts sealing against ceiling */}
          <g transform={`translate(0, ${skirtY})`}>
            {/* Left Skirt Seal */}
            <path d="M 120,80 L 140,50 L 160,50 L 140,80 Z" fill="#00D2FF" opacity="0.9" />
            <line x1="140" y1="50" x2="160" y2="50" stroke="#E8402A" strokeWidth="4" />

            {/* Right Skirt Seal */}
            <path d="M 680,80 L 660,50 L 640,50 L 660,80 Z" fill="#00D2FF" opacity="0.9" />
            <line x1="640" y1="50" x2="660" y2="50" stroke="#E8402A" strokeWidth="4" />

            {/* Car Underbody Undertray */}
            <rect x="140" y="80" width="520" height="30" rx="8" fill="#E8402A" />

            {/* Negative Pressure Vacuum Cavity (Glowing Cyan Flow) */}
            <rect x="160" y="50" width="480" height="30" fill="rgba(0, 210, 255, 0.12)" />
            <text x="400" y="70" textAnchor="middle" fill="#00D2FF" fontFamily={FONTS.mono} fontSize="14" fontWeight="700">
              LOW PRESSURE ZONE (0.2 ATM VACUUM)
            </text>
          </g>

          {/* Atmospheric pressure downward vectors (14.7 PSI) */}
          <g transform="translate(0, 140)">
            <line x1="250" y1="0" x2="250" y2="50" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="6 4" />
            <line x1="400" y1="0" x2="400" y2="50" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="6 4" />
            <line x1="550" y1="0" x2="550" y2="50" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="6 4" />
            <text x="400" y="85" textAnchor="middle" fill="#FFFFFF" fontFamily={FONTS.mono} fontSize="16" fontWeight="700">
              ATMOSPHERIC PRESSURE: 14.7 PSI
            </text>
          </g>
        </svg>

        {/* Felt-Pen Circle around the active skirt seal */}
        <FeltPenCircle
          delay={12}
          width={180}
          height={75}
          style={{ top: 25, left: 110 }}
        />
      </div>

      {/* Bottom Summary Pill */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1A1D24",
          borderRadius: 18,
          padding: "16px 24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594" }}>
          SEAL TYPE: <b style={{ color: "#FFFFFF" }}>ACTIVE FLEXIBLE COMPOSITE</b>
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594" }}>
          AIR INFILTRATION: <b style={{ color: "#00D2FF" }}>&lt; 0.05%</b>
        </span>
      </div>
    </ReferenceLayout>
  );
};
