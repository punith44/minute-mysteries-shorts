import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { FeltPenCircle } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene7VerdictOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bellBob = Math.sin((frame / fps) * Math.PI * 3) * 6;
  const pulseScale = 1.0 + Math.sin((frame / fps) * Math.PI * 2) * 0.03;

  return (
    <ReferenceLayout
      stageNumber="07"
      stageCategory="case resolved"
      badgeLabel="VERDICT"
      badgeValue="CONFIRMED"
      headlineRegular="Not magic."
      headlineEmphasis="Just brute-force aerospace."
      windowTitle="verdict.minute.mysteries"
      cardHeight={740}
      presenter={<Presenter pose="pointing" x={0} y={0} scale={1.08} />}
    >
      {/* Engineering Summary Checklist */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {[
          { label: "GROUND SUCTION", value: "2.0 G DOWNFORCE", status: "PHYSICALLY PROVEN" },
          { label: "SPACEX COPV THRUST", value: "10,000 PSI NITROGEN", status: "REAL AEROSPACE TECH" },
          { label: "STREET CAPABILITY", value: "TRACK ONLY", status: "REQUIRES AIRTIGHT SURFACE" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#191B22",
              borderRadius: 18,
              padding: "18px 24px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: "#7E8594" }}>{item.label}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
                {item.value}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "rgba(0, 210, 255, 0.12)",
                color: "#00D2FF",
                fontFamily: FONTS.mono,
                fontSize: 13,
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: 12,
              }}
            >
              {item.status}
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Subscribe Call-to-Action Pill Button */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${pulseScale})`,
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: "#E8402A",
            color: "#FFFFFF",
            borderRadius: 100,
            padding: "20px 48px",
            boxShadow: "0 15px 40px rgba(232, 64, 42, 0.4)",
            border: "2px solid #FFFFFF",
            position: "relative",
          }}
        >
          <span style={{ fontSize: 32, transform: `translateY(${bellBob}px)`, display: "inline-block" }}>
            🔔
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            SUBSCRIBE // MINUTE MYSTERIES
          </span>

          <FeltPenCircle
            delay={8}
            width={340}
            height={90}
            color="#FFFFFF"
            style={{ top: -10, left: 10 }}
          />
        </div>

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 15,
            color: "#7E8594",
            marginTop: 16,
          }}
        >
          What engineering mystery should we decode next?
        </div>
      </div>
    </ReferenceLayout>
  );
};
