import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { FeltPenCircle, SpeechBubble } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene4TwinTurbines: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spinSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const rpm = Math.round(interpolate(spinSpring, [0, 1], [0, 25000]));
  const impellerAngle = (frame * 36) % 360;

  return (
    <ReferenceLayout
      stageNumber="04"
      stageCategory="turbine drive"
      badgeLabel="FANS"
      badgeValue="25,000 RPM"
      headlineRegular="Twin fans spin at 25,000 RPM,"
      headlineEmphasis="pulling 7,600 lbs of suction."
      windowTitle="fans.turbine.suction.rpm"
      cardHeight={740}
      presenter={<Presenter pose="pointing" x={0} y={0} scale={1.08} />}
    >
      <SpeechBubble
        tag="3 DOWNFORCE"
        text="2.0 G locks the car upside down."
        icon="🌪️"
        delay={4}
        style={{ top: 20, left: 24, zIndex: 10 }}
      />

      {/* Twin Turbines Visual Stage */}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 40px",
          overflow: "hidden",
        }}
      >
        {/* Left Turbine Chamber */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="82" fill="#1E222D" stroke="#3A404D" strokeWidth="6" />
            <circle cx="90" cy="90" r="74" fill="#0D0E12" />
            {/* Spinning Blades */}
            <g transform={`rotate(${impellerAngle} 90 90)`}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <path
                  key={ang}
                  d="M 90,90 Q 110,60 145,55 L 140,45 Q 105,50 90,90 Z"
                  fill="#00D2FF"
                  opacity="0.9"
                  transform={`rotate(${ang} 90 90)`}
                />
              ))}
              <circle cx="90" cy="90" r="22" fill="#252A36" stroke="#00D2FF" strokeWidth="3" />
            </g>
          </svg>
          <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594", marginTop: 12 }}>
            LEFT FAN // IMP-01
          </div>
        </div>

        {/* Center Tachometer Metric */}
        <div style={{ textAlign: "center", position: "relative" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 52, fontWeight: 800, color: "#00D2FF" }}>
            {rpm.toLocaleString()}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: "#FFFFFF", fontWeight: 700 }}>
            RPM ROTATION SPEED
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 28, color: "#E8402A", fontWeight: 800, marginTop: 12 }}>
            7,600 LBS
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#7E8594" }}>
            TOTAL DOWNWARD SUCTION
          </div>

          <FeltPenCircle
            delay={12}
            width={240}
            height={85}
            style={{ top: 70, left: -20 }}
          />
        </div>

        {/* Right Turbine Chamber */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="82" fill="#1E222D" stroke="#3A404D" strokeWidth="6" />
            <circle cx="90" cy="90" r="74" fill="#0D0E12" />
            {/* Counter-Spinning Blades */}
            <g transform={`rotate(${-impellerAngle} 90 90)`}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <path
                  key={ang}
                  d="M 90,90 Q 70,60 35,55 L 40,45 Q 75,50 90,90 Z"
                  fill="#00D2FF"
                  opacity="0.9"
                  transform={`rotate(${ang} 90 90)`}
                />
              ))}
              <circle cx="90" cy="90" r="22" fill="#252A36" stroke="#00D2FF" strokeWidth="3" />
            </g>
          </svg>
          <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594", marginTop: 12 }}>
            RIGHT FAN // IMP-02
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
          NET SUCTION LOAD: <b style={{ color: "#E8402A" }}>2.0 G (DEFIEST GRAVITY)</b>
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: "#7E8594" }}>
          POWER DRAW: <b style={{ color: "#00D2FF" }}>180 kW MOTOR DRIVE</b>
        </span>
      </div>
    </ReferenceLayout>
  );
};
