import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { FeltPenCircle, SpeechBubble } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene5ColdGasThrusters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * Math.PI * 4) > 0 ? 1 : 0.4;
  const gaugeSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const psi = Math.round(interpolate(gaugeSpring, [0, 1], [0, 10000]));

  return (
    <ReferenceLayout
      stageNumber="05"
      stageCategory="space package"
      badgeLabel="PRESSURE"
      badgeValue="10,000 PSI"
      headlineRegular="To flip mid-air, SpaceX thrusters fire"
      headlineEmphasis="compressed cold gas."
      windowTitle="spacex.copv.thrusters.telemetry"
      cardHeight={740}
      presenter={<Presenter pose="pointing" x={0} y={0} scale={1.08} />}
    >
      <SpeechBubble
        tag="4 SPACEX TECH"
        text="Cryogenic gas stabilization."
        icon="🚀"
        delay={4}
        style={{ top: 20, left: 24, zIndex: 10 }}
      />

      {/* Thruster Stage Visual */}
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
          {/* Carbon Overwrapped Pressure Vessel (COPV) Tank */}
          <rect x="80" y="80" width="280" height="140" rx="36" fill="#1C212B" stroke="#00D2FF" strokeWidth="4" />
          <path d="M 120,80 L 120,220 M 180,80 L 180,220 M 240,80 L 240,220 M 300,80 L 300,220" stroke="#252D3D" strokeWidth="3" />
          <text x="220" y="145" textAnchor="middle" fill="#FFFFFF" fontFamily={FONTS.mono} fontSize="20" fontWeight="800">
            COPV TANK
          </text>
          <text x="220" y="175" textAnchor="middle" fill="#00D2FF" fontFamily={FONTS.mono} fontSize="14" fontWeight="600">
            COMPRESSED NITROGEN
          </text>

          {/* Manifold feed pipe */}
          <path d="M 360,150 L 520,150 L 520,80 L 580,80" stroke="#7E8594" strokeWidth="8" fill="none" strokeLinecap="round" />

          {/* Rocket Thruster Nozzle */}
          <g transform="translate(580, 50)">
            <polygon points="0,20 60,0 60,60 0,40" fill="#2A3040" stroke="#FFFFFF" strokeWidth="3" />
            {/* High-Velocity Gas Jet Plume */}
            <path
              d="M 60,10 L 210,-10 L 230,30 L 210,70 L 60,50 Z"
              fill="rgba(0, 210, 255, 0.45)"
              opacity={pulse}
            />
            <path
              d="M 60,20 L 150,15 L 170,30 L 150,45 L 60,40 Z"
              fill="#FFFFFF"
              opacity={pulse}
            />
          </g>
        </svg>

        {/* Digital Pressure Metric Tag */}
        <div style={{ position: "absolute", bottom: 24, left: 36, textAlign: "left" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 44, fontWeight: 800, color: "#E8402A" }}>
            {psi.toLocaleString()} <span style={{ fontSize: 24, color: "#FFFFFF" }}>PSI</span>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: "#7E8594" }}>
            INTERNAL STORAGE PRESSURE
          </div>

          <FeltPenCircle
            delay={10}
            width={240}
            height={80}
            style={{ top: -8, left: -14 }}
          />
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
          THRUSTER PROPULSION: <b style={{ color: "#FFFFFF" }}>COLD-GAS NITROGEN</b>
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594" }}>
          ATTITUDE CONTROL: <b style={{ color: "#00D2FF" }}>3-AXIS GYRO STABILIZED</b>
        </span>
      </div>
    </ReferenceLayout>
  );
};
