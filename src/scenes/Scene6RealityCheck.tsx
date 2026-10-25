import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { SpeechBubble } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene6RealityCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rubber stamp slam impact
  const stampSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  const stampScale = interpolate(stampSpring, [0, 1], [3.2, 1]);
  const stampOpacity = interpolate(stampSpring, [0, 1], [0, 1]);

  return (
    <ReferenceLayout
      stageNumber="06"
      stageCategory="reality check"
      badgeLabel="ROAD LEGAL"
      badgeValue="0/1"
      headlineRegular="Can you drive this on public streets?"
      headlineEmphasis="Definitely not."
      windowTitle="compliance.dot.regulation.v1"
      cardHeight={740}
      presenter={<Presenter pose="gesturing" x={0} y={0} scale={1.08} />}
    >
      <SpeechBubble
        tag="5 DANGER"
        text="Gravel becomes deadly projectiles."
        icon="⚠️"
        delay={4}
        style={{ top: 20, left: 24, zIndex: 10 }}
      />

      {/* Split Comparison Stage */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 24,
          right: 24,
          height: 380,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* Left: Controlled Rig */}
        <div
          style={{
            backgroundColor: "#16181F",
            borderRadius: 24,
            border: "1.5px solid rgba(0, 210, 255, 0.25)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 44 }}>✨</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginTop: 8 }}>
            CONTROLLED RIG
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#00D2FF", marginTop: 4 }}>
            PERFECT STEEL SURFACE
          </div>
          <div
            style={{
              marginTop: 18,
              backgroundColor: "rgba(0, 210, 255, 0.12)",
              color: "#00D2FF",
              fontFamily: FONTS.mono,
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 12,
            }}
          >
            AIRTIGHT SEAL MAINTAINED
          </div>
        </div>

        {/* Right: Public Highway */}
        <div
          style={{
            backgroundColor: "#16181F",
            borderRadius: 24,
            border: "1.5px solid rgba(232, 64, 42, 0.25)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 44 }}>🕳️</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginTop: 8 }}>
            PUBLIC HIGHWAY
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#E8402A", marginTop: 4 }}>
            POTHOLES &amp; CRACKS
          </div>
          <div
            style={{
              marginTop: 18,
              backgroundColor: "rgba(232, 64, 42, 0.12)",
              color: "#E8402A",
              fontFamily: FONTS.mono,
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 14px",
              borderRadius: 12,
            }}
          >
            VACUUM SHATTERS INSTANTLY
          </div>
        </div>

        {/* Slamming Red Rubber Stamp: STREET ILLEGAL */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: "50%",
            transform: `translate(-50%, -50%) scale(${stampScale}) rotate(-12deg)`,
            opacity: stampOpacity,
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              border: "8px solid #E8402A",
              borderRadius: 24,
              padding: "16px 36px",
              backgroundColor: "rgba(232, 64, 42, 0.15)",
              color: "#E8402A",
              fontFamily: FONTS.mono,
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "4px",
              textTransform: "uppercase",
              boxShadow: "0 0 40px rgba(232, 64, 42, 0.5)",
            }}
          >
            STREET ILLEGAL
          </div>
        </div>
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
          REGULATORY STATUS: <b style={{ color: "#E8402A" }}>NON-COMPLIANT ON ROADS</b>
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594" }}>
          SHRAPNEL HAZARD: <b style={{ color: "#FFFFFF" }}>25,000 RPM GRAVEL EJECTION</b>
        </span>
      </div>
    </ReferenceLayout>
  );
};
