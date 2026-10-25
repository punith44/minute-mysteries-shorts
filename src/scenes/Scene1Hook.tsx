import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ReferenceLayout } from "../components/ReferenceLayout";
import { Presenter } from "../components/Presenter";
import { FeltPenCircle } from "../components/FeltPenAnnotation";
import { FONTS } from "../theme/fonts";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Car entrance drive-in along the inverted ceiling track
  const driveSpring = spring({
    frame: frame - 2,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const carX = interpolate(driveSpring, [0, 1], [-650, 110]);
  const wheelRotation = interpolate(driveSpring, [0, 1], [0, 720]);

  return (
    <ReferenceLayout
      stageNumber="01"
      stageCategory="the mystery"
      badgeLabel="DEMO"
      badgeValue="1/7"
      headlineRegular="Can Tesla's Roadster really"
      headlineEmphasis="drive upside down?"
      windowTitle="rig.telemetry.inversion"
      cardHeight={680}
      presenter={<Presenter pose="pointing" x={0} y={0} scale={1.05} />}
    >
      {/* 1. Inverted Ceiling Track with Warning Hazard Stripes */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 20,
          right: 20,
          height: 38,
          backgroundColor: "#1F232B",
          borderRadius: 8,
          border: "1.5px solid #3A404D",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, #E5A93C, #E5A93C 14px, #1F232B 14px, #1F232B 28px)",
            opacity: 0.28,
          }}
        />
        <span
          style={{
            position: "relative",
            fontFamily: FONTS.mono,
            fontSize: 14,
            fontWeight: 700,
            color: "#E5A93C",
            letterSpacing: "1px",
          }}
        >
          // STEEL REACTION CEILING RAIL · INVERTED LOAD
        </span>
        <span
          style={{
            position: "relative",
            fontFamily: FONTS.mono,
            fontSize: 13,
            color: "#7E8594",
          }}
        >
          TEST CHAMBER 04
        </span>
      </div>

      {/* 2. Inverted Tesla Roadster Driving Along Ceiling */}
      <div
        style={{
          position: "absolute",
          top: 74,
          left: carX,
          width: 720,
          height: 340,
        }}
      >
        <svg width="720" height="340" viewBox="0 0 720 340" fill="none">
          {/* Wheels contacting ceiling track */}
          {/* Front Wheel */}
          <g transform="translate(170, 42)">
            <circle cx="0" cy="0" r="42" fill="#18191D" stroke="#3A404D" strokeWidth="6" />
            <circle cx="0" cy="0" r="24" fill="#2A2D35" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#7E8594" strokeWidth="3" transform={`rotate(${wheelRotation})`} />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#7E8594" strokeWidth="3" transform={`rotate(${wheelRotation})`} />
          </g>

          {/* Rear Wheel */}
          <g transform="translate(560, 42)">
            <circle cx="0" cy="0" r="42" fill="#18191D" stroke="#3A404D" strokeWidth="6" />
            <circle cx="0" cy="0" r="24" fill="#2A2D35" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#7E8594" strokeWidth="3" transform={`rotate(${wheelRotation})`} />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#7E8594" strokeWidth="3" transform={`rotate(${wheelRotation})`} />
          </g>

          {/* Inverted Car Chassis (Metallic Signal Red Body) */}
          <path
            d="M 60,40 
               L 120,40 
               C 140,55 190,55 210,40 
               L 520,40 
               C 540,55 580,55 600,40 
               L 670,40 
               C 685,75 670,110 630,125 
               L 470,140 
               L 330,195 
               L 200,190 
               L 110,140 
               L 65,110 
               Z"
            fill="#E8402A"
            stroke="#111111"
            strokeWidth="5"
          />

          {/* Aerodynamic highlight reflection streak */}
          <path
            d="M 120,70 L 620,70 L 590,85 L 140,85 Z"
            fill="#FFFFFF"
            opacity="0.18"
          />

          {/* Glass Canopy (Tinted Dark Inverted Cockpit) */}
          <path
            d="M 215,140 L 330,185 L 450,135 L 230,135 Z"
            fill="#0F1115"
            stroke="#E8402A"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Underbody ground suction skirt (in this inverted view, facing the ceiling track) */}
          <rect x="220" y="34" width="300" height="12" rx="4" fill="#00D2FF" opacity="0.85" />

          {/* Suction direction arrows pulling UP into ceiling */}
          <path d="M 270,30 L 270,12 M 265,18 L 270,12 L 275,18" stroke="#00D2FF" strokeWidth="3" strokeLinecap="round" />
          <path d="M 370,30 L 370,12 M 365,18 L 370,12 L 375,18" stroke="#00D2FF" strokeWidth="3" strokeLinecap="round" />
          <path d="M 470,30 L 470,12 M 465,18 L 470,12 L 475,18" stroke="#00D2FF" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Red Felt-Pen Circle drawing around the inverted tire contact */}
        <FeltPenCircle
          delay={12}
          width={180}
          height={110}
          style={{ top: -15, left: 80 }}
        />
      </div>

      {/* 3. Live Telemetry Readout Pill at bottom of card */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 28,
          right: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1A1D24",
          borderRadius: 18,
          padding: "16px 24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#27C93F",
              boxShadow: "0 0 10px #27C93F",
            }}
          />
          <span style={{ fontFamily: FONTS.mono, fontSize: 18, color: "#FFFFFF", fontWeight: 700 }}>
            INVERTED EQUILIBRIUM: <span style={{ color: "#00D2FF" }}>LOCKED</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, fontFamily: FONTS.mono, fontSize: 16 }}>
          <span style={{ color: "#7E8594" }}>DOWNWARD SLIP: <b style={{ color: "#FFFFFF" }}>0.00 mm</b></span>
          <span style={{ color: "#7E8594" }}>VERTICAL LOAD: <b style={{ color: "#E8402A" }}>+2.0 G</b></span>
        </div>
      </div>
    </ReferenceLayout>
  );
};
