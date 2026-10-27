import React from "react";
import { CardContainer } from "../CardContainer";
import { FeltPenCircle } from "../FeltPenAnnotation";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, easeOutCubic, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type PhysicsDiagramSpec = Extract<WidgetSpec, { type: "physics_diagram" }>;

interface DiagramCardProps {
  spec: PhysicsDiagramSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * Reusable Poly Lab Style Side-Profile Roadster Vector Component
 */
const PolyRoadsterSvg: React.FC<{
  showTanks?: boolean;
  showFans?: boolean;
  wheelSpinDeg?: number;
}> = ({ showTanks = false, showFans = false, wheelSpinDeg = 0 }) => (
  <g>
    {/* Rear Wing */}
    <path
      d="M 28,62 L 28,36 M 12,36 L 52,38"
      stroke="#1E2022"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Sleek Silver-Grey Body Shell */}
    <path
      d="M 20,76 L 45,56 L 135,54 C 185,22 285,22 348,54 L 445,66 L 462,92 L 448,104 L 22,104 Z"
      fill="#9AA3AD"
      stroke="#1E2022"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Upper Body Highlight */}
    <path
      d="M 55,58 L 138,56 C 185,27 282,27 344,56 L 432,67"
      fill="none"
      stroke="#C5CCD4"
      strokeWidth="4"
    />
    {/* Dark Canopy Glass */}
    <path
      d="M 146,54 C 188,30 276,30 332,54 Z"
      fill="#4A5568"
      stroke="#1E2022"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Optional Internal Blue Compressed Air COPV Tanks */}
    {showTanks && (
      <g>
        <rect
          x="152"
          y="66"
          width="178"
          height="28"
          rx="14"
          fill="#93C5FD"
          stroke="#1E2022"
          strokeWidth="3.5"
        />
        <line x1="210" y1="66" x2="210" y2="94" stroke="#1E2022" strokeWidth="3" />
        <line x1="270" y1="66" x2="270" y2="94" stroke="#1E2022" strokeWidth="3" />
      </g>
    )}
    {/* Optional Underbody Suction Fans */}
    {showFans && (
      <g>
        <rect
          x="166"
          y="102"
          width="148"
          height="14"
          rx="4"
          fill="#E2E8F0"
          stroke="#1E2022"
          strokeWidth="3"
        />
        <ellipse
          cx="204"
          cy="109"
          rx="28"
          ry="5"
          fill="#64748B"
          stroke="#1E2022"
          strokeWidth="2.5"
        />
        <ellipse
          cx="276"
          cy="109"
          rx="28"
          ry="5"
          fill="#64748B"
          stroke="#1E2022"
          strokeWidth="2.5"
        />
      </g>
    )}
    {/* Rear Wheel */}
    <g transform={`translate(98, 98) rotate(${wheelSpinDeg})`}>
      <circle cx="0" cy="0" r="34" fill="#1E2022" />
      <circle cx="0" cy="0" r="18" fill="#CBD5E1" stroke="#1E2022" strokeWidth="3" />
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#1E2022" strokeWidth="3" />
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#1E2022" strokeWidth="3" />
    </g>
    {/* Front Wheel */}
    <g transform={`translate(378, 98) rotate(${wheelSpinDeg})`}>
      <circle cx="0" cy="0" r="34" fill="#1E2022" />
      <circle cx="0" cy="0" r="18" fill="#CBD5E1" stroke="#1E2022" strokeWidth="3" />
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#1E2022" strokeWidth="3" />
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#1E2022" strokeWidth="3" />
    </g>
  </g>
);

/**
 * Reusable Poly Lab Style Architectural Leaning Tower of Pisa SVG
 * Origin (0,0) is at the center of the foundation base.
 */
const PolyPisaTowerSvg: React.FC<{
  tiers?: number;
  tiltDeg?: number;
  scale?: number;
}> = ({ tiers = 8, tiltDeg = 5.5, scale = 1 }) => {
  return (
    <g transform={`scale(${scale}) rotate(${tiltDeg})`}>
      {/* Concrete Foundation Plinth */}
      <rect
        x="-148"
        y="-24"
        width="296"
        height="24"
        rx="3"
        fill="#CBD5E1"
        stroke="#1E2022"
        strokeWidth="3"
      />
      {/* Tier 1: Ground Blind Arcade */}
      {tiers >= 1 && (
        <g transform="translate(0, -164)">
          <rect
            x="-126"
            y="0"
            width="252"
            height="140"
            fill="#E5E4DF"
            stroke="#1E2022"
            strokeWidth="3"
          />
          <rect x="20" y="2" width="104" height="136" fill="#C4C3BC" opacity="0.55" />
          {[-95, -57, -19, 19, 57, 95].map((ax, idx) => (
            <g key={idx}>
              <path
                d={`M ${ax - 14},140 L ${ax - 14},38 A 14,14 0 0 1 ${ax + 14},38 L ${ax + 14},140`}
                fill="#B8B7B0"
                stroke="#1E2022"
                strokeWidth="2.2"
              />
            </g>
          ))}
          <rect
            x="-132"
            y="-8"
            width="264"
            height="10"
            fill="#F5F3EE"
            stroke="#1E2022"
            strokeWidth="2.5"
          />
        </g>
      )}
      {/* Tiers 2 to 7: Colonnaded Galleries */}
      {[2, 3, 4, 5, 6, 7].map((tNum) => {
        if (tiers < tNum) return null;
        const yTop = -164 - (tNum - 1) * 86;
        return (
          <g key={tNum} transform={`translate(0, ${yTop})`}>
            <rect
              x="-122"
              y="0"
              width="244"
              height="78"
              fill="#E5E4DF"
              stroke="#1E2022"
              strokeWidth="2.8"
            />
            <rect x="18" y="2" width="102" height="74" fill="#BDBCAF" opacity="0.55" />
            {[-98, -70, -42, -14, 14, 42, 70, 98].map((cx, cIdx) => (
              <path
                key={cIdx}
                d={`M ${cx - 9},78 L ${cx - 9},24 A 9,9 0 0 1 ${cx + 9},24 L ${cx + 9},78 Z`}
                fill="#52524E"
                stroke="#1E2022"
                strokeWidth="2"
              />
            ))}
            <rect
              x="-128"
              y="-8"
              width="256"
              height="10"
              fill="#F5F3EE"
              stroke="#1E2022"
              strokeWidth="2.5"
            />
          </g>
        );
      })}
      {/* Tier 8: Top Bell Chamber */}
      {tiers >= 8 && (
        <g transform="translate(0, -766)">
          <rect
            x="-92"
            y="0"
            width="184"
            height="86"
            fill="#E5E4DF"
            stroke="#1E2022"
            strokeWidth="2.8"
          />
          <rect x="12" y="2" width="78" height="82" fill="#BDBCAF" opacity="0.55" />
          {[-64, -32, 0, 32, 64].map((bx, bIdx) => (
            <path
              key={bIdx}
              d={`M ${bx - 10},86 L ${bx - 10},26 A 10,10 0 0 1 ${bx + 10},26 L ${bx + 10},86 Z`}
              fill="#52524E"
              stroke="#1E2022"
              strokeWidth="2"
            />
          ))}
          <rect
            x="-98"
            y="-8"
            width="196"
            height="10"
            fill="#F5F3EE"
            stroke="#1E2022"
            strokeWidth="2.5"
          />
        </g>
      )}
    </g>
  );
};

/**
 * Reusable Poly Lab Protractor Lean-Angle Arc Meter (0° to 10°)
 */
const PolyProtractorGauge: React.FC<{
  angleDeg: number;
  x?: number;
  y?: number;
}> = ({ angleDeg, x = 135, y = 785 }) => {
  const rad = 195;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer Protractor Arc from 0 deg (up) to 90 deg (right) */}
      <path
        d={`M 0,${-rad} A ${rad},${rad} 0 0 1 ${rad},0`}
        fill="none"
        stroke="#1E2022"
        strokeWidth="3"
      />
      {/* Tick Marks (0° to 10° mapped across 0..75 deg visual arc for clarity) */}
      {Array.from({ length: 11 }).map((_, idx) => {
        const aDeg = idx * 7.5;
        const aRad = (aDeg * Math.PI) / 180;
        const rInner = idx % 5 === 0 ? rad - 22 : rad - 12;
        const x1 = Math.sin(aRad) * rInner;
        const y1 = -Math.cos(aRad) * rInner;
        const x2 = Math.sin(aRad) * (rad + 4);
        const y2 = -Math.cos(aRad) * (rad + 4);
        const lx = Math.sin(aRad) * (rad + 32);
        const ly = -Math.cos(aRad) * (rad + 32);
        return (
          <g key={idx}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1E2022" strokeWidth={idx % 5 === 0 ? 3 : 2} />
            {idx % 5 === 0 && (
              <text
                x={lx}
                y={ly + 8}
                textAnchor="middle"
                fontFamily={FONTS.sans}
                fontWeight="800"
                fontSize="24"
                fill="#1E2022"
              >
                {idx}°
              </text>
            )}
          </g>
        );
      })}
      {/* Animated Orange Angle Pointer */}
      {(() => {
        const needleVisualDeg = angleDeg * 7.5;
        const nRad = (needleVisualDeg * Math.PI) / 180;
        const nx = Math.sin(nRad) * (rad - 6);
        const ny = -Math.cos(nRad) * (rad - 6);
        return (
          <g>
            <line
              x1="0"
              y1="0"
              x2={nx}
              y2={ny}
              stroke="#ED8A33"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="11" fill="#ED8A33" stroke="#FFFFFF" strokeWidth="3" />
          </g>
        );
      })()}
    </g>
  );
};

/**
 * Reusable Layered Subsurface Soil Cross-Section (Grass + Topsoil + Dark Lagoon Clay & Silt)
 */
const PolySubsurfaceSoilSvg: React.FC<{
  groundY?: number;
  tiltSouth?: boolean;
}> = ({ groundY = 560, tiltSouth = false }) => (
  <g>
    {/* Top Green Lawn Strip */}
    <polygon
      points={`0,${groundY} 980,${groundY + (tiltSouth ? 16 : 0)} 980,${groundY + 45} 0,${groundY + 45}`}
      fill="#8CB369"
      stroke="#1E2022"
      strokeWidth="3"
    />
    {/* Upper Brownish-Olive Silt Layer */}
    <polygon
      points={`0,${groundY + 42} 980,${groundY + (tiltSouth ? 58 : 42)} 980,${groundY + 175} 0,${groundY + 150}`}
      fill="#6B654B"
      stroke="#1E2022"
      strokeWidth="3"
    />
    {/* Deep Dark Blue-Slate Lagoon Clay Layer */}
    <polygon
      points={`0,${groundY + 150} 980,${groundY + 175} 980,${groundY + 345} 0,${groundY + 325}`}
      fill="#37414A"
      stroke="#1E2022"
      strokeWidth="3"
    />
    {/* Lower Olive-Grey Sand Stratum */}
    <polygon
      points={`0,${groundY + 325} 980,${groundY + 345} 980,1150 0,1150`}
      fill="#52523E"
      stroke="#1E2022"
      strokeWidth="3"
    />
  </g>
);

export const DiagramCard: React.FC<DiagramCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  const enterAt = spec.enterAt ?? 0.12;
  const dt = Math.max(0, currentTimeSec - enterAt);
  const animSpring = evaluateSpring(clamp(dt / 0.65, 0, 1), springOvershoot);
  const isDark = (spec.theme ?? "dark") === "dark";

  // ── POLY LAB ILLUSTRATED PHYSICS STAGE VARIANTS (Reference Video 1) ──
  if (spec.variant.startsWith("poly_")) {
    const spin = currentTimeSec * 420;

    // 1. POLY LOOP RAMP ("Flying car?")
    if (spec.variant === "poly_loop_ramp") {
      // Animate car driving along the C-loop ramp and hanging upside down
      const tLoop = clamp((currentTimeSec - 0.3) / 4.2, 0, 1);
      // Angle along the C-loop from bottom (90 deg) -> right (0 deg) -> top-left (-115 deg)
      const angleRad = (Math.PI / 2) - tLoop * (Math.PI * 1.12);
      const loopCx = 460;
      const loopCy = 520;
      const loopR = 340;
      const carX = loopCx + Math.cos(angleRad) * loopR;
      const carY = loopCy + Math.sin(angleRad) * loopR;
      const carRotDeg = (angleRad * 180) / Math.PI - 90;

      const showQuestion = currentTimeSec > 4.6;
      const qSpring = evaluateSpring(clamp((currentTimeSec - 4.6) / 0.4, 0, 1), 0.5);

      return (
        <div style={{ width: 980, height: 1020, position: "relative" }}>
          <svg width="980" height="1020" viewBox="0 0 980 1020" fill="none">
            {/* Vertical Support Pillar on Right */}
            <rect
              x="815"
              y="155"
              width="32"
              height="745"
              fill="#F5F3EE"
              stroke="#1E2022"
              strokeWidth="3"
            />
            {/* Top Horizontal Ceiling Beam */}
            <rect
              x="160"
              y="155"
              width="687"
              height="16"
              fill="#F4A259"
              stroke="#1E2022"
              strokeWidth="3"
            />
            {/* Curved Orange C-Loop Track */}
            <path
              d="M 20,884 L 460,884 A 362,362 0 0 0 460,160 L 165,160"
              stroke="#F4A259"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 20,884 L 460,884 A 362,362 0 0 0 460,160 L 165,160"
              stroke="#1E2022"
              strokeWidth="3.5"
              fill="none"
            />
            {/* Ground Hatching */}
            <line x1="0" y1="900" x2="980" y2="900" stroke="#1E2022" strokeWidth="3.5" />

            {/* Moving Roadster on the Loop (or parked at bottom with '?' after 4.6s) */}
            {!showQuestion ? (
              <g
                transform={`translate(${carX.toFixed(1)}, ${carY.toFixed(
                  1
                )}) rotate(${carRotDeg.toFixed(1)}) scale(0.55) translate(-240, -132)`}
              >
                <PolyRoadsterSvg wheelSpinDeg={spin} />
              </g>
            ) : (
              <g>
                <g transform="translate(185, 810) scale(0.58)">
                  <PolyRoadsterSvg wheelSpinDeg={0} />
                </g>
                {/* Giant Bouncing '?' Icon */}
                <g
                  transform={`translate(320, 680) scale(${(
                    0.5 +
                    0.5 * qSpring
                  ).toFixed(3)})`}
                >
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    fontFamily={FONTS.display}
                    fontWeight="900"
                    fontSize="190"
                    fill="#F4A259"
                    stroke="#FFFFFF"
                    strokeWidth="12"
                    paintOrder="stroke"
                  >
                    ?
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 2. POLY BEAT GRAVITY ("BEAT GRAVITY")
    if (spec.variant === "poly_beat_gravity") {
      const arrowGrow = easeOutCubic(clamp((currentTimeSec - 0.3) / 0.6, 0, 1));
      const pushGrow = easeOutCubic(clamp((currentTimeSec - 2.2) / 0.6, 0, 1));

      return (
        <div style={{ width: 980, height: 960, position: "relative" }}>
          <svg width="980" height="960" viewBox="0 0 980 960" fill="none">
            <text
              x="490"
              y="195"
              textAnchor="middle"
              fontFamily={FONTS.display}
              fontWeight="800"
              fontSize="26"
              letterSpacing="0.08em"
              fill="#1E2022"
            >
              CEILING
            </text>
            {/* Hatched Ceiling Beam */}
            <rect x="60" y="215" width="860" height="24" fill="#D6D1C4" />
            <line x1="60" y1="239" x2="920" y2="239" stroke="#1E2022" strokeWidth="4" />
            {Array.from({ length: 28 }).map((_, i) => (
              <line
                key={i}
                x1={75 + i * 30}
                y1="215"
                x2={60 + i * 30}
                y2="239"
                stroke="#1E2022"
                strokeWidth="2"
              />
            ))}

            {/* Upside-Down Roadster Clinging to Ceiling */}
            <g transform="translate(215, 392) scale(1.18, -1.18)">
              <PolyRoadsterSvg wheelSpinDeg={spin * 0.4} />
            </g>

            {/* Red Downward GRAVITY · 1G Arrow */}
            {arrowGrow > 0.02 && (
              <g>
                <rect
                  x="302"
                  y="320"
                  width="18"
                  height={240 * arrowGrow}
                  fill="#D93829"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <polygon
                  points={`284,${320 + 240 * arrowGrow} 329,${
                    320 + 240 * arrowGrow
                  } 311,${362 + 240 * arrowGrow}`}
                  fill="#D93829"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <text
                  x="311"
                  y={435 + 240 * arrowGrow}
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="30"
                  letterSpacing="0.06em"
                  fill="#D93829"
                >
                  GRAVITY · 1G
                </text>
              </g>
            )}

            {/* Green Upward PUSH Arrow */}
            {pushGrow > 0.02 && (
              <g>
                <rect
                  x="660"
                  y={610 - 250 * pushGrow}
                  width="18"
                  height={250 * pushGrow}
                  fill="#659B5E"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <polygon
                  points={`642,${610 - 250 * pushGrow} 687,${
                    610 - 250 * pushGrow
                  } 669,${568 - 250 * pushGrow}`}
                  fill="#659B5E"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <text
                  x="669"
                  y="665"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="30"
                  letterSpacing="0.06em"
                  fill="#659B5E"
                >
                  PUSH
                </text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 3. POLY INVERTED WING ("...UPSIDE DOWN")
    if (spec.variant === "poly_inverted_wing") {
      const flipProgress = easeOutCubic(clamp((currentTimeSec - 0.6) / 0.8, 0, 1));
      const wingScaleY = 1 - 2 * flipProgress; // Flips from +1 (airplane lift) to -1 (inverted downforce)
      const dashOffset = -(currentTimeSec * 180) % 48;

      return (
        <div style={{ width: 980, height: 960, position: "relative" }}>
          <svg width="980" height="960" viewBox="0 0 980 960" fill="none">
            {/* Flowing Dashed Blue Streamlines */}
            {[160, 225, 290, 480, 545, 610].map((y, idx) => (
              <path
                key={idx}
                d={`M 90,${y} Q 490,${
                  y + (idx < 3 ? -18 : 18) * wingScaleY
                } 890,${y}`}
                stroke="#6488A8"
                strokeWidth="3"
                strokeDasharray="16 12"
                strokeDashoffset={dashOffset}
                fill="none"
              />
            ))}

            {/* Airfoil Wing Cross-Section */}
            <g
              transform={`translate(490, 385) scale(1, ${wingScaleY.toFixed(
                3
              )}) translate(-260, -35)`}
            >
              <path
                d="M 0,45 C 40,-15 210,-10 520,45 C 340,52 120,52 0,45 Z"
                fill="#FFFFFF"
                stroke="#1E2022"
                strokeWidth="4.5"
              />
            </g>

            {/* Red Downforce / Lift Arrow */}
            {flipProgress > 0.5 && (
              <g>
                <rect
                  x="488"
                  y="400"
                  width="18"
                  height="165"
                  fill="#D93829"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <polygon
                  points="470,565 524,565 497,605"
                  fill="#D93829"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <text
                  x="355"
                  y="565"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="28"
                  fill="#D93829"
                >
                  DOWNFORCE ↓
                </text>
              </g>
            )}

            {/* Small Roadster Below */}
            <g transform="translate(335, 665) scale(0.66)">
              <PolyRoadsterSvg wheelSpinDeg={spin} />
            </g>
          </svg>
        </div>
      );
    }

    // 4. POLY SUCTION FANS ("FANS UNDERNEATH")
    if (spec.variant === "poly_suction_fans") {
      const showPressure = currentTimeSec > 2.2;
      const invertedOnCeiling = currentTimeSec > 6.8;

      return (
        <div style={{ width: 980, height: 960, position: "relative" }}>
          <svg width="980" height="960" viewBox="0 0 980 960" fill="none">
            {!invertedOnCeiling ? (
              <g>
                {/* Road Surface */}
                <rect x="40" y="520" width="900" height="36" fill="#BDB8AC" />
                <line x1="40" y1="520" x2="940" y2="520" stroke="#1E2022" strokeWidth="3.5" />
                <line
                  x1="40"
                  y1="538"
                  x2="940"
                  y2="538"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeDasharray="36 28"
                />

                {/* Blue Low-Pressure Underbody Suction Glow */}
                {showPressure && (
                  <g>
                    <ellipse
                      cx="490"
                      cy="515"
                      rx="185"
                      ry="18"
                      fill="#60A5FA"
                      opacity="0.55"
                    />
                    <text
                      x="490"
                      y="618"
                      textAnchor="middle"
                      fontFamily={FONTS.display}
                      fontWeight="900"
                      fontSize="30"
                      letterSpacing="0.05em"
                      fill="#1E2022"
                    >
                      LOW PRESSURE
                    </text>
                  </g>
                )}

                {/* Green Downward "AIR PUSHES DOWN" Arrows */}
                {currentTimeSec > 3.6 && (
                  <g>
                    <text
                      x="490"
                      y="175"
                      textAnchor="middle"
                      fontFamily={FONTS.display}
                      fontWeight="900"
                      fontSize="30"
                      letterSpacing="0.06em"
                      fill="#659B5E"
                    >
                      AIR PUSHES DOWN
                    </text>
                    {[355, 490, 625].map((x, idx) => (
                      <g key={idx}>
                        <rect
                          x={x - 6}
                          y="210"
                          width="12"
                          height="115"
                          fill="#659B5E"
                          stroke="#1E2022"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${x - 18},325 ${x + 18},325 ${x},352`}
                          fill="#659B5E"
                          stroke="#1E2022"
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}
                  </g>
                )}

                {/* Roadster with Underbody Fans & Exhaust Airflow */}
                <g transform="translate(210, 365) scale(1.2)">
                  <PolyRoadsterSvg showFans wheelSpinDeg={spin * 0.5} />
                </g>

                {/* Animated Dashed Suction & Rear Exhaust Streamlines */}
                {showPressure && (
                  <path
                    d="M 195,505 C 140,495 110,460 95,415"
                    stroke="#1E2022"
                    strokeWidth="4"
                    strokeDasharray="12 10"
                    fill="none"
                  />
                )}
              </g>
            ) : (
              /* Flipped onto the Ceiling with UP TO 2G OF GRIP */
              <g>
                <rect x="60" y="340" width="860" height="24" fill="#D6D1C4" />
                <line x1="60" y1="364" x2="920" y2="364" stroke="#1E2022" strokeWidth="4" />
                <g transform="translate(215, 515) scale(1.18, -1.18)">
                  <PolyRoadsterSvg showFans wheelSpinDeg={spin * 0.5} />
                </g>
                {[360, 490, 620].map((x, idx) => (
                  <g key={idx}>
                    <rect
                      x={x - 6}
                      y="540"
                      width="12"
                      height="135"
                      fill="#659B5E"
                      stroke="#1E2022"
                      strokeWidth="2.5"
                    />
                    <polygon
                      points={`${x - 18},540 ${x + 18},540 ${x},512`}
                      fill="#659B5E"
                      stroke="#1E2022"
                      strokeWidth="2.5"
                    />
                  </g>
                ))}
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 5. POLY COPV FLIGHT CARD ("HOW IT FLIES" Framed Poster Card)
    if (spec.variant === "poly_copv_flight") {
      const liftOff = easeOutCubic(clamp((currentTimeSec - 2.2) / 1.4, 0, 1));
      const carLiftY = liftOff * -115;

      return (
        <div
          style={{
            width: 820,
            height: 980,
            backgroundColor: "#EFECE6",
            border: "6px solid #FFFFFF",
            outline: "2px solid #BDB7AA",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.10)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Poster Card Header + Pill Tags */}
          <div
            style={{
              marginTop: 42,
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 60,
              letterSpacing: "-0.02em",
              color: "#161616",
            }}
          >
            HOW IT FLIES
          </div>
          <div
            style={{
              marginTop: 14,
              backgroundColor: "#FFFFFF",
              border: "2.5px solid #161616",
              borderRadius: 999,
              padding: "6px 26px",
              fontFamily: FONTS.display,
              fontWeight: 800,
              fontSize: 25,
              color: "#161616",
            }}
          >
            =250 kg OF COMPRESSED AIR
          </div>
          {currentTimeSec > 1.2 && (
            <div
              style={{
                marginTop: 12,
                backgroundColor: "#FFFFFF",
                border: "2.5px solid #161616",
                borderRadius: 999,
                padding: "6px 26px",
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: 25,
                color: "#161616",
              }}
            >
              10 NOZZLES
            </div>
          )}

          {/* SVG Stage Inside Framed Card */}
          <svg
            width="820"
            height="680"
            viewBox="0 0 820 680"
            fill="none"
            style={{ position: "absolute", bottom: 0, left: 0 }}
          >
            {/* Ground Floor */}
            <rect x="0" y="555" width="820" height="125" fill="#E5DFD3" />
            <line x1="0" y1="555" x2="820" y2="555" stroke="#1E2022" strokeWidth="3" />

            {/* Expanding Compressed Air Puff Clouds Under Front & Rear */}
            {[210, 610].map((cloudX, cIdx) =>
              [0, 1, 2, 3].map((pIdx) => {
                const y = 390 + pIdx * 42;
                const r = 24 + pIdx * 11 + Math.sin(currentTimeSec * 12 + pIdx) * 3;
                return (
                  <g key={`${cIdx}-${pIdx}`}>
                    <circle
                      cx={cloudX - pIdx * 10}
                      cy={y}
                      r={r}
                      fill="#E5E4DF"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cloudX + pIdx * 12}
                      cy={y + 8}
                      r={r * 0.9}
                      fill="#E5E4DF"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                    />
                  </g>
                );
              })
            )}

            {/* Orange Upward CAR ↑ Arrow & Blue Downward AIR ↓ Arrow */}
            {liftOff > 0.1 && (
              <g>
                {/* Orange CAR ↑ */}
                <rect
                  x="505"
                  y={255 + carLiftY}
                  width="14"
                  height="95"
                  fill="#F4A259"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                <polygon
                  points={`491,${255 + carLiftY} 533,${255 + carLiftY} 512,${
                    225 + carLiftY
                  }`}
                  fill="#F4A259"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                <text
                  x="575"
                  y={295 + carLiftY}
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="26"
                  fill="#1E2022"
                >
                  CAR ↑
                </text>

                {/* Blue AIR ↓ */}
                <rect
                  x="403"
                  y="375"
                  width="14"
                  height="150"
                  fill="#93C5FD"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                <polygon
                  points="389,525 431,525 410,552"
                  fill="#93C5FD"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                <text
                  x="410"
                  y="590"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="26"
                  fill="#1E2022"
                >
                  AIR ↓
                </text>
              </g>
            )}

            {/* Hovering Roadster with Blue Internal COPV Tanks */}
            <g
              transform={`translate(115, ${(330 + carLiftY).toFixed(
                1
              )}) scale(1.25)`}
            >
              <PolyRoadsterSvg showTanks wheelSpinDeg={0} />
            </g>
          </svg>

          {/* Bottom Pill: NEWTON'S 3RD LAW */}
          {currentTimeSec > 4.2 && (
            <div
              style={{
                position: "absolute",
                bottom: 22,
                backgroundColor: "#FFFFFF",
                border: "2.5px solid #161616",
                borderRadius: 999,
                padding: "6px 28px",
                fontFamily: FONTS.display,
                fontWeight: 800,
                fontSize: 26,
                color: "#161616",
              }}
            >
              NEWTON'S 3RD LAW
            </div>
          )}
        </div>
      );
    }

    // 6. POLY ROCKET LANDING ("ROCKET LANDING" Framed Split Sky-Blue Card)
    if (spec.variant === "poly_rocket_landing") {
      const showSplit = currentTimeSec < 6.0;
      const landingProgress = easeOutCubic(
        clamp((currentTimeSec - 6.0) / 4.2, 0, 1)
      );
      // Car rotates from upside-down (175 deg) to level (0 deg) and descends to the ground
      const carAngle =
        currentTimeSec < 6.0
          ? 168 + Math.sin(currentTimeSec * 2.5) * 6
          : (1 - landingProgress) * 168;
      const carY =
        currentTimeSec < 6.0 ? 450 : 390 + landingProgress * 225;

      return (
        <div
          style={{
            width: 820,
            height: 980,
            backgroundColor: "#D5E3E8",
            border: "6px solid #FFFFFF",
            outline: "2px solid #B5C4CA",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.10)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginTop: 40,
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: 58,
              letterSpacing: "-0.02em",
              color: "#161616",
              zIndex: 5,
            }}
          >
            ROCKET LANDING
          </div>
          <div
            style={{
              marginTop: 12,
              backgroundColor: "#FFFFFF",
              border: "2.5px solid #161616",
              borderRadius: 999,
              padding: "5px 26px",
              fontFamily: FONTS.display,
              fontWeight: 800,
              fontSize: 24,
              color: "#161616",
              zIndex: 5,
            }}
          >
            BUILT WITH SPACEX
          </div>

          {/* Sub-pills: FALCON 9 | ROADSTER or ROADSTER | SLOWS / LAND ✓ */}
          <div
            style={{
              display: "flex",
              gap: 28,
              marginTop: 16,
              zIndex: 5,
            }}
          >
            {showSplit ? (
              <>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2.5px solid #161616",
                    borderRadius: 999,
                    padding: "4px 24px",
                    fontFamily: FONTS.display,
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  FALCON 9
                </div>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2.5px solid #161616",
                    borderRadius: 999,
                    padding: "4px 24px",
                    fontFamily: FONTS.display,
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  ROADSTER
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2.5px solid #161616",
                    borderRadius: 999,
                    padding: "4px 24px",
                    fontFamily: FONTS.display,
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  ROADSTER
                </div>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2.5px solid #161616",
                    borderRadius: 999,
                    padding: "4px 24px",
                    fontFamily: FONTS.display,
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  {landingProgress > 0.85 ? "LAND ✓" : "SLOWS"}
                </div>
              </>
            )}
          </div>

          <svg
            width="820"
            height="980"
            viewBox="0 0 820 980"
            fill="none"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Ground Pad */}
            <rect x="0" y="885" width="820" height="95" fill="#DFD9CE" />
            <line x1="0" y1="885" x2="820" y2="885" stroke="#1E2022" strokeWidth="3" />

            {showSplit ? (
              <g>
                {/* Vertical Split Divider */}
                <line x1="410" y1="210" x2="410" y2="885" stroke="#1E2022" strokeWidth="3" />

                {/* Left Side: Falcon 9 Booster Firing Cold-Gas Attitude Jets */}
                <g transform="translate(205, 515) rotate(-8)">
                  <rect
                    x="-170"
                    y="-18"
                    width="290"
                    height="36"
                    fill="#FFFFFF"
                    stroke="#1E2022"
                    strokeWidth="3.5"
                  />
                  <rect x="85" y="-22" width="38" height="44" fill="#1E2022" />
                  {/* Cold-Gas White Puff Jet */}
                  <path
                    d="M 105,-22 L 85,-95 L 125,-95 Z"
                    fill="#FFFFFF"
                    opacity="0.85"
                  />
                </g>

                {/* Right Side: Upside-Down Roadster Firing Cold-Gas Flip Jets */}
                <g transform="translate(615, 515) rotate(172) scale(0.76) translate(-240, -70)">
                  <PolyRoadsterSvg />
                </g>
              </g>
            ) : (
              /* Full-Width Roadster Flipping Upright & Landing on Wheels */
              <g>
                {/* Landing Thruster Puff Clouds when slowing descent */}
                {landingProgress > 0.25 && landingProgress < 0.9 && (
                  <g opacity="0.8">
                    <circle cx="285" cy={carY + 120} r="36" fill="#E5E4DF" stroke="#9CA3AF" strokeWidth="2" />
                    <circle cx="535" cy={carY + 120} r="36" fill="#E5E4DF" stroke="#9CA3AF" strokeWidth="2" />
                  </g>
                )}
                <g
                  transform={`translate(410, ${carY.toFixed(
                    1
                  )}) rotate(${carAngle.toFixed(
                    1
                  )}) scale(1.12) translate(-240, -75)`}
                >
                  <PolyRoadsterSvg />
                </g>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // ── LEANING TOWER OF PISA POLY LAB SCHEMATICS (Reference Video 2) ──

    // 7. POLY PISA HOOK (1990 · 5.5° Lean + Italy Inset Map + Protractor Gauge)
    if (spec.variant === "poly_pisa_hook") {
      const show55 = currentTimeSec > 2.6;
      const showMap = currentTimeSec > 1.8 && currentTimeSec < 7.2;
      const showProtractor = currentTimeSec > 2.7;
      const fallTip = easeOutCubic(clamp((currentTimeSec - 6.8) / 1.4, 0, 1));
      const tilt = 5.5 + fallTip * 2.2;
      const gaugeAngle = easeOutCubic(clamp((currentTimeSec - 2.7) / 0.8, 0, 1)) * 5.5;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            {/* Green Piazza del Duomo Lawn */}
            <rect x="0" y="545" width="980" height="535" fill="#89AC6B" />
            <line x1="0" y1="545" x2="980" y2="545" stroke="#1E2022" strokeWidth="2.5" />

            {/* Background Baptistery & Cathedral Silhouette */}
            <g transform="translate(45, 290)" opacity="0.88">
              <path
                d="M 20,140 A 95,85 0 0 1 210,140 Z"
                fill="#D6D3CB"
                stroke="#1E2022"
                strokeWidth="2.2"
              />
              <path
                d="M 285,155 A 85,75 0 0 1 445,155 Z"
                fill="#D6D3CB"
                stroke="#1E2022"
                strokeWidth="2.2"
              />
              <rect
                x="0"
                y="140"
                width="490"
                height="115"
                fill="#E5E4DF"
                stroke="#1E2022"
                strokeWidth="2.2"
              />
              {Array.from({ length: 12 }).map((_, i) => (
                <rect
                  key={i}
                  x={18 + i * 38}
                  y="165"
                  width="20"
                  height="88"
                  rx="10"
                  fill="#B8B7B0"
                  stroke="#1E2022"
                  strokeWidth="1.5"
                />
              ))}
            </g>

            {/* Leaning Tower of Pisa */}
            <g transform="translate(650, 745)">
              {/* Ground Shadow */}
              <ellipse cx="140" cy="4" rx="185" ry="18" fill="rgba(0,0,0,0.22)" />
              <PolyPisaTowerSvg tiers={8} tiltDeg={tilt} scale={0.94} />
            </g>

            {/* Vertical Dashed Plumb Line Showing Overhang */}
            {showProtractor && (
              <g>
                <line
                  x1="862"
                  y1="38"
                  x2="862"
                  y2="745"
                  stroke="#1E2022"
                  strokeWidth="3"
                  strokeDasharray="12 10"
                />
                <circle cx="862" cy="745" r="7" fill="#1E2022" stroke="#FFFFFF" strokeWidth="2.5" />
              </g>
            )}

            {/* Italian Flag on Lawn */}
            <g transform="translate(495, 650)">
              <line x1="0" y1="0" x2="0" y2="120" stroke="#1E2022" strokeWidth="3" />
              <rect x="0" y="6" width="28" height="52" fill="#009246" stroke="#1E2022" strokeWidth="1.5" />
              <rect x="28" y="6" width="28" height="52" fill="#FFFFFF" stroke="#1E2022" strokeWidth="1.5" />
              <rect x="56" y="6" width="28" height="52" fill="#CE2B37" stroke="#1E2022" strokeWidth="1.5" />
            </g>

            {/* Tiny Pedestrian Scale Figures */}
            {[310, 345, 580, 685].map((px, idx) => (
              <g key={idx} transform={`translate(${px}, ${765 + (idx % 2) * 14})`}>
                <circle cx="0" cy="-18" r="5" fill="#1E2022" />
                <rect x="-4" y="-12" width="8" height="16" rx="3" fill="#1E2022" />
              </g>
            ))}

            {/* Left Badge: 1990 -> 5.5° */}
            <g transform="translate(55, 225)">
              <rect
                x="0"
                y="0"
                width="265"
                height="135"
                rx="14"
                fill="#FBF8F1"
                stroke="#1E2022"
                strokeWidth="3.5"
              />
              <text
                x="132"
                y="94"
                textAnchor="middle"
                fontFamily={FONTS.display}
                fontWeight="900"
                fontSize="82"
                fill={show55 ? "#ED8A33" : "#161616"}
              >
                {show55 ? "5.5°" : "1990"}
              </text>
            </g>

            {/* Framed Inset Map of Italy with PISA Pin */}
            {showMap && (
              <g transform="translate(335, 195)">
                <rect
                  x="0"
                  y="0"
                  width="190"
                  height="195"
                  rx="8"
                  fill="#EDE6D6"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                />
                <rect
                  x="0"
                  y="0"
                  width="190"
                  height="195"
                  rx="8"
                  fill="none"
                  stroke="#1E2022"
                  strokeWidth="2"
                />
                {/* Simplified Boot of Italy */}
                <path
                  d="M 35,30 L 85,25 L 105,55 L 155,125 L 145,155 L 118,135 L 95,165 L 68,110 L 45,65 Z"
                  fill="#FBF8F1"
                  stroke="#1E2022"
                  strokeWidth="2"
                />
                <circle cx="66" cy="72" r="6" fill="#ED8A33" />
                <text
                  x="108"
                  y="78"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="22"
                  fill="#1E2022"
                >
                  PISA
                </text>
              </g>
            )}

            {/* Protractor Gauge */}
            {showProtractor && (
              <PolyProtractorGauge angleDeg={gaugeAngle} x={105} y={765} />
            )}
          </svg>
        </div>
      );
    }

    // 8. POLY PISA LAGOON CLAY + SILT (1173 -> 1272 Soil Cross-Section)
    if (spec.variant === "poly_pisa_lagoon") {
      const showSoilCards = currentTimeSec > 2.2 && currentTimeSec < 6.4;
      const showSofterSouth = currentTimeSec >= 6.0;
      const secondPhase = currentTimeSec >= 8.2;
      const builtTiers = secondPhase ? 6 : currentTimeSec > 1.2 ? 3 : 1;
      const tilt = secondPhase
        ? easeOutCubic(clamp((currentTimeSec - 8.5) / 2.2, 0, 1)) * 3.8
        : 0;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            <PolySubsurfaceSoilSvg groundY={440} tiltSouth={showSofterSouth} />

            {/* Tower Rising on Foundation */}
            <g transform="translate(490, 445)">
              <PolyPisaTowerSvg tiers={builtTiers} tiltDeg={tilt} scale={0.95} />
            </g>

            {/* LAGOON CLAY + SILT Callout & Twin Texture Inset Cards */}
            {showSoilCards && (
              <g>
                <text
                  x="490"
                  y="515"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="42"
                  letterSpacing="0.04em"
                  fill="#FBF8F1"
                  stroke="#1E2022"
                  strokeWidth="6"
                  paintOrder="stroke"
                >
                  LAGOON CLAY + SILT
                </text>
                {/* Left Card: Wet Lagoon Clay */}
                <g transform="translate(115, 595) rotate(-2)">
                  <rect
                    x="0"
                    y="0"
                    width="310"
                    height="290"
                    rx="18"
                    fill="#2D4A53"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                  />
                  <path
                    d="M 25,85 Q 150,65 285,95 M 35,165 Q 160,185 275,155 M 45,235 Q 170,215 265,245"
                    stroke="#5C808B"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <text
                    x="155"
                    y="255"
                    textAnchor="middle"
                    fontFamily={FONTS.mono}
                    fontWeight="800"
                    fontSize="22"
                    fill="#E2E8F0"
                  >
                    SOFT LAGOON CLAY
                  </text>
                </g>
                {/* Right Card: Fine Lagoon Silt */}
                <g transform="translate(555, 615) rotate(4)">
                  <rect
                    x="0"
                    y="0"
                    width="265"
                    height="255"
                    rx="18"
                    fill="#C2B8A3"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                  />
                  <path
                    d="M 120,20 L 145,235 M 80,65 L 210,185"
                    stroke="#7D725D"
                    strokeWidth="5"
                  />
                  <text
                    x="132"
                    y="225"
                    textAnchor="middle"
                    fontFamily={FONTS.mono}
                    fontWeight="800"
                    fontSize="22"
                    fill="#1E2022"
                  >
                    FINE SILT
                  </text>
                </g>
              </g>
            )}

            {/* SOFTER -> SOUTH Subsidence Label */}
            {showSofterSouth && (
              <g transform="translate(540, 525)">
                <text
                  x="0"
                  y="0"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="38"
                  fill="#FBF8F1"
                  stroke="#1E2022"
                  strokeWidth="5"
                  paintOrder="stroke"
                >
                  SOFTER
                </text>
                <line x1="-85" y1="42" x2="-15" y2="42" stroke="#1E2022" strokeWidth="4" />
                <polygon points="-15,33 2,42 -15,51" fill="#1E2022" />
                <text
                  x="14"
                  y="54"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="38"
                  fill="#FBF8F1"
                  stroke="#1E2022"
                  strokeWidth="5"
                  paintOrder="stroke"
                >
                  SOUTH
                </text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 9. POLY PISA MUSSOLINI 1934 (361 Grout Holes -> Jolts Further South)
    if (spec.variant === "poly_pisa_mussolini") {
      const showDrills = currentTimeSec > 2.6;
      const groutFill = easeOutCubic(clamp((currentTimeSec - 4.5) / 1.8, 0, 1));
      const joltSouth = easeOutCubic(clamp((currentTimeSec - 6.8) / 0.8, 0, 1));
      const tilt = 4.2 + joltSouth * 1.3;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            <PolySubsurfaceSoilSvg groundY={520} tiltSouth />

            {/* Mussolini's Italy Portrait Card (Before Zoom) */}
            {currentTimeSec < 3.4 && (
              <g transform="translate(105, 145)">
                <rect
                  x="0"
                  y="0"
                  width="245"
                  height="265"
                  rx="18"
                  fill="#3A2E21"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                />
                {/* Stylized Faceless Uniform Bust */}
                <circle cx="122" cy="95" r="32" fill="#E5DFD3" stroke="#1E2022" strokeWidth="2.5" />
                <path
                  d="M 82,78 C 82,52 162,52 162,78 Z"
                  fill="#1E2022"
                />
                <path
                  d="M 55,245 C 55,155 190,155 190,245 Z"
                  fill="#27241D"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                <text
                  x="122"
                  y="305"
                  textAnchor="middle"
                  fontFamily={FONTS.sans}
                  fontWeight="800"
                  fontSize="24"
                  fill="#1E2022"
                >
                  MUSSOLINI&apos;S ITALY
                </text>
              </g>
            )}

            {/* Leaning Tower + Foundation Cross-Section with 361 Drilled Holes */}
            <g transform="translate(560, 525)">
              <PolyPisaTowerSvg tiers={8} tiltDeg={tilt} scale={0.95} />
              {showDrills && (
                <g transform={`rotate(${tilt})`}>
                  <rect
                    x="-158"
                    y="-38"
                    width="316"
                    height="46"
                    fill="#D6D3CB"
                    stroke="#1E2022"
                    strokeWidth="3"
                  />
                  {/* Criss-Crossed Boreholes */}
                  {Array.from({ length: 10 }).map((_, hIdx) => {
                    const hx = -132 + hIdx * 28;
                    const isGrouted = hIdx / 10 < groutFill;
                    return (
                      <g key={hIdx}>
                        <line
                          x1={hx}
                          y1="-32"
                          x2={hx - 10}
                          y2="4"
                          stroke={isGrouted ? "#ED8A33" : "#1E2022"}
                          strokeWidth="4"
                        />
                        <line
                          x1={hx + 6}
                          y1="-32"
                          x2={hx + 16}
                          y2="4"
                          stroke={isGrouted ? "#ED8A33" : "#1E2022"}
                          strokeWidth="4"
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </g>

            {/* Orange Dashed Reference Line Showing Extra South Jolt */}
            {joltSouth > 0.05 && (
              <line
                x1="445"
                y1="25"
                x2="395"
                y2="525"
                stroke="#ED8A33"
                strokeWidth="4"
                strokeDasharray="14 10"
              />
            )}

            {/* Glowing "361 HOLES" Center Impact Text */}
            {showDrills && currentTimeSec < 7.2 && (
              <text
                x="490"
                y="705"
                textAnchor="middle"
                fontFamily={FONTS.display}
                fontWeight="900"
                fontSize="68"
                fill="#ED8A33"
                stroke="#FFFFFF"
                strokeWidth="4"
                paintOrder="stroke"
              >
                361 HOLES
              </text>
            )}
          </svg>
        </div>
      );
    }

    // 10. POLY PISA PAVIA COLLAPSE 1989 & 1990 BARRICADES (Torre Civica Collapse -> 4 DEAD -> Closed)
    if (spec.variant === "poly_pisa_pavia") {
      const collapseProg = easeOutCubic(clamp((currentTimeSec - 2.6) / 1.4, 0, 1));
      const show4Dead = currentTimeSec > 4.2 && currentTimeSec < 6.8;
      const showClosedPisa = currentTimeSec >= 6.8;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            {!showClosedPisa ? (
              <g>
                {/* Ground Shadow */}
                <ellipse
                  cx="675"
                  cy="765"
                  rx={140 + collapseProg * 140}
                  ry={24 + collapseProg * 36}
                  fill="rgba(0,0,0,0.28)"
                />

                {/* Torre Civica Label */}
                <text
                  x="560"
                  y="65"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="38"
                  fill="#1E2022"
                >
                  Torre Civica
                </text>
                {currentTimeSec > 2.2 && (
                  <text
                    x="560"
                    y="108"
                    textAnchor="middle"
                    fontFamily={FONTS.sans}
                    fontWeight="800"
                    fontSize="26"
                    letterSpacing="0.06em"
                    fill="#1E2022"
                  >
                    PAVIA
                  </text>
                )}

                {/* Brick Medieval Tower (Intact -> Shattering into Rubble Cubes) */}
                {collapseProg < 0.35 ? (
                  <g transform={`translate(615, ${125 + collapseProg * 180})`}>
                    <polygon points="-10,0 60,-32 130,0" fill="#8C4A32" stroke="#1E2022" strokeWidth="3" />
                    <rect
                      x="0"
                      y="0"
                      width="120"
                      height="640"
                      fill="#A4634B"
                      stroke="#1E2022"
                      strokeWidth="3"
                    />
                    <rect x="68" y="2" width="50" height="636" fill="#7D4632" opacity="0.6" />
                  </g>
                ) : (
                  /* Shattered Brick Rubble Pile + Dust Cloud */
                  <g transform="translate(675, 735)">
                    <ellipse
                      cx="0"
                      cy="-45"
                      rx={220 * collapseProg}
                      ry={125 * collapseProg}
                      fill="#CFCBC2"
                      opacity={0.75}
                    />
                    {[
                      { x: -145, y: 10, r: -18, s: 58 },
                      { x: -85, y: -25, r: 12, s: 66 },
                      { x: -20, y: -55, r: -8, s: 72 },
                      { x: 48, y: -30, r: 22, s: 64 },
                      { x: 115, y: 5, r: -14, s: 54 },
                      { x: -55, y: 20, r: 8, s: 52 },
                      { x: 25, y: 18, r: -16, s: 58 },
                    ].map((b, bIdx) => (
                      <rect
                        key={bIdx}
                        x={b.x}
                        y={b.y}
                        width={b.s}
                        height={b.s * 0.78}
                        fill="#A4634B"
                        stroke="#1E2022"
                        strokeWidth="2.8"
                        transform={`rotate(${b.r} ${b.x + 25} ${b.y + 25})`}
                      />
                    ))}
                  </g>
                )}

                {/* 4 DEAD Orange Callout */}
                {show4Dead && (
                  <text
                    x="92"
                    y="385"
                    fontFamily={FONTS.display}
                    fontWeight="900"
                    fontSize="68"
                    fill="#ED8A33"
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    4 DEAD
                  </text>
                )}
              </g>
            ) : (
              /* 1990: Pisa Closed to Visitors with Red-and-White Barricade Fence */
              <g>
                <rect x="0" y="545" width="980" height="535" fill="#89AC6B" />
                <line x1="0" y1="545" x2="980" y2="545" stroke="#1E2022" strokeWidth="2.5" />
                <g transform="translate(650, 745)">
                  <PolyPisaTowerSvg tiers={8} tiltDeg={5.5} scale={0.94} />
                </g>
                {/* Red & White Safety Barricade Fence Across Foreground */}
                <g transform="translate(0, 735)">
                  {Array.from({ length: 16 }).map((_, fIdx) => (
                    <g key={fIdx} transform={`translate(${fIdx * 62}, 0)`}>
                      <line x1="8" y1="-8" x2="8" y2="48" stroke="#1E2022" strokeWidth="3" />
                      <rect
                        x="0"
                        y="0"
                        width="62"
                        height="26"
                        fill={fIdx % 2 === 0 ? "#D93829" : "#FFFFFF"}
                        stroke="#1E2022"
                        strokeWidth="2.2"
                      />
                    </g>
                  ))}
                </g>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 11. POLY PISA 600t LEAD + JOHN BURLAND (Counterweights Stacked on North Side)
    if (spec.variant === "poly_pisa_lead") {
      const stackProg = easeOutCubic(clamp((currentTimeSec - 0.3) / 1.6, 0, 1));
      const showBurland = currentTimeSec > 4.2;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            <PolySubsurfaceSoilSvg groundY={520} tiltSouth />

            {/* Leaning Tower */}
            <g transform="translate(650, 525)">
              <PolyPisaTowerSvg tiers={8} tiltDeg={5.4} scale={0.94} />
            </g>

            {/* 600 Tonnes of Lead Ingots Stacked on High North Side */}
            <g transform="translate(455, 420)">
              {Array.from({ length: Math.max(1, Math.round(stackProg * 8)) }).map((_, rowIdx) => (
                <rect
                  key={rowIdx}
                  x="0"
                  y={80 - rowIdx * 12}
                  width="96"
                  height="11"
                  fill="#94A3B8"
                  stroke="#1E2022"
                  strokeWidth="2"
                />
              ))}
              {/* Downward Orange Force Arrow on North Side */}
              {currentTimeSec < 4.2 && (
                <g transform="translate(48, -95)">
                  <line x1="0" y1="0" x2="0" y2="62" stroke="#ED8A33" strokeWidth="6" />
                  <polygon points="-12,55 12,55 0,76" fill="#ED8A33" />
                </g>
              )}
            </g>

            {!showBurland ? (
              <g>
                {/* 600 t LEAD White Card */}
                <g transform="translate(82, 235)">
                  <rect
                    x="0"
                    y="0"
                    width="345"
                    height="108"
                    rx="14"
                    fill="#FBF8F1"
                    stroke="#1E2022"
                    strokeWidth="3.5"
                  />
                  <text
                    x="172"
                    y="72"
                    textAnchor="middle"
                    fontFamily={FONTS.display}
                    fontWeight="900"
                    fontSize="58"
                    fill="#ED8A33"
                  >
                    600 t LEAD
                  </text>
                </g>
                <PolyProtractorGauge angleDeg={5.4} x={105} y={645} />
              </g>
            ) : (
              /* John Burland, Engineer Portrait Card */
              <g transform="translate(105, 165)">
                <rect
                  x="0"
                  y="0"
                  width="265"
                  height="285"
                  rx="18"
                  fill="#4A3B2C"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                />
                {/* Stylized Faceless Engineer in Suit Holding White Hardhat */}
                <circle cx="132" cy="88" r="32" fill="#E5DFD3" stroke="#1E2022" strokeWidth="2.5" />
                <path
                  d="M 58,265 C 58,160 206,160 206,265 Z"
                  fill="#6B5E52"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                {/* White Hardhat Under Arm */}
                <path
                  d="M 135,215 A 36,32 0 0 1 205,215 Z"
                  fill="#F8FAFC"
                  stroke="#1E2022"
                  strokeWidth="2.5"
                />
                <text
                  x="132"
                  y="328"
                  textAnchor="middle"
                  fontFamily={FONTS.sans}
                  fontWeight="800"
                  fontSize="24"
                  fill="#1E2022"
                >
                  JOHN BURLAND, ENGINEER
                </text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 12. POLY PISA SLANTED DRILLS & STEEL SAFETY CABLES (Soil Extraction Under North Side)
    if (spec.variant === "poly_pisa_drills") {
      const settleProg = easeOutCubic(clamp((currentTimeSec - 4.2) / 2.4, 0, 1));
      const tilt = 5.5 - settleProg * 1.5; // Rolls back from 5.5° toward 4.0°
      const showCables = currentTimeSec > 6.2;
      const augerSpin = (currentTimeSec * 40) % 24;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            <PolySubsurfaceSoilSvg groundY={440} tiltSouth />

            {/* Protractor Gauge Rolling Back */}
            <PolyProtractorGauge angleDeg={tilt} x={115} y={325} />

            {/* Leaning Tower Rolling Back Toward Vertical */}
            <g transform="translate(715, 445)">
              <PolyPisaTowerSvg tiers={8} tiltDeg={tilt} scale={0.95} />
            </g>

            {/* Lead Ingot Stack on North Plinth */}
            <g transform="translate(520, 342)">
              {Array.from({ length: 8 }).map((_, rIdx) => (
                <rect
                  key={rIdx}
                  x="0"
                  y={80 - rIdx * 11}
                  width="88"
                  height="10"
                  fill="#94A3B8"
                  stroke="#1E2022"
                  strokeWidth="2"
                />
              ))}
            </g>

            {/* Slanted Helical Auger Drills Extracting Soil Under North Side */}
            <g transform="translate(155, 425)">
              <text
                x="65"
                y="-36"
                textAnchor="middle"
                fontFamily={FONTS.display}
                fontWeight="900"
                fontSize="28"
                fill="#1E2022"
              >
                SOIL OUT
              </text>
              {[0, 18, 36].map((yOff, dIdx) => (
                <g key={dIdx} transform={`translate(${dIdx * 24}, ${yOff}) rotate(16)`}>
                  <rect
                    x="0"
                    y="0"
                    width="420"
                    height="14"
                    rx="6"
                    fill="#F8FAFC"
                    stroke="#1E2022"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="10"
                    y1="7"
                    x2="410"
                    y2="7"
                    stroke="#1E2022"
                    strokeWidth="8"
                    strokeDasharray="8 10"
                    strokeDashoffset={augerSpin}
                  />
                </g>
              ))}
              <text
                x="85"
                y="225"
                textAnchor="middle"
                fontFamily={FONTS.display}
                fontWeight="900"
                fontSize="32"
                fill="#FBF8F1"
                stroke="#1E2022"
                strokeWidth="5"
                paintOrder="stroke"
              >
                NORTH SIDE
              </text>
            </g>

            {/* Steel Safety Cables Anchored to Tower */}
            {showCables && (
              <g>
                <line
                  x1="215"
                  y1="440"
                  x2="585"
                  y2="255"
                  stroke="#F8FAFC"
                  strokeWidth="6"
                />
                <line
                  x1="215"
                  y1="440"
                  x2="585"
                  y2="255"
                  stroke="#1E2022"
                  strokeWidth="2"
                  strokeDasharray="10 8"
                />
                <text
                  x="435"
                  y="245"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="28"
                  fill="#1E2022"
                >
                  STEEL CABLES
                </text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 13. POLY PISA WOBBLY TABLE ANALOGY (Shortening the Long Leg)
    if (spec.variant === "poly_pisa_table") {
      const cutMade = currentTimeSec > 2.0;
      const levelProg = easeOutCubic(clamp((currentTimeSec - 2.1) / 0.5, 0, 1));
      const wobbleDeg = cutMade
        ? (1 - levelProg) * 4.5
        : 4.5 + Math.sin(currentTimeSec * 10) * 1.8;

      return (
        <div style={{ width: 980, height: 960, position: "relative" }}>
          <svg width="980" height="960" viewBox="0 0 980 960" fill="none">
            {/* Hatched Floor Line */}
            <line x1="70" y1="680" x2="910" y2="680" stroke="#1E2022" strokeWidth="4" />
            {Array.from({ length: 32 }).map((_, i) => (
              <line
                key={i}
                x1={90 + i * 26}
                y1="680"
                x2={74 + i * 26}
                y2="708"
                stroke="#1E2022"
                strokeWidth="2"
              />
            ))}

            {/* Wooden Table + Water Glass */}
            <g
              transform={`translate(490, 680) rotate(${wobbleDeg.toFixed(
                2
              )}) translate(-490, -680)`}
            >
              {/* Left Leg (Long Leg that gets shortened) */}
              <polygon
                points={`205,360 245,360 232,${cutMade ? 680 : 704} 195,${
                  cutMade ? 680 : 704
                }`}
                fill="#C89D66"
                stroke="#1E2022"
                strokeWidth="4"
              />
              {/* Inner Back Left Leg */}
              <polygon
                points="265,375 295,375 288,675 260,675"
                fill="#A87E4B"
                stroke="#1E2022"
                strokeWidth="3.5"
              />
              {/* Right Leg */}
              <polygon
                points="735,360 775,360 785,680 748,680"
                fill="#C89D66"
                stroke="#1E2022"
                strokeWidth="4"
              />
              {/* Tabletop Apron & Surface */}
              <rect
                x="185"
                y="340"
                width="610"
                height="36"
                fill="#B88B54"
                stroke="#1E2022"
                strokeWidth="4"
              />
              <rect
                x="155"
                y="314"
                width="670"
                height="28"
                rx="4"
                fill="#D7AE79"
                stroke="#1E2022"
                strokeWidth="4"
              />

              {/* Glass of Water on Right */}
              <g transform="translate(625, 204)">
                <rect
                  x="0"
                  y="42"
                  width="64"
                  height="68"
                  fill="#BAE6FD"
                  opacity="0.85"
                />
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="110"
                  rx="4"
                  fill="none"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
              </g>
            </g>

            {/* Ejected Orange Wood Block From Shortened Left Leg + Checkmark */}
            {cutMade && (
              <g>
                <rect
                  x={195 - levelProg * 95}
                  y="654"
                  width="38"
                  height="26"
                  fill="#ED8A33"
                  stroke="#1E2022"
                  strokeWidth="3.5"
                />
                <g transform="translate(490, 175)">
                  <path
                    d="M -38,0 L -10,28 L 44,-28"
                    fill="none"
                    stroke="#1E2022"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M -38,0 L -10,28 L 44,-28"
                    fill="none"
                    stroke="#ED8A33"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 14. POLY PISA REOPENED 2001 (45 cm Magnifier + 200 YEARS Safe Forecast)
    if (spec.variant === "poly_pisa_reopen") {
      const showMagnifier = currentTimeSec > 0.8 && currentTimeSec < 4.5;
      const showProtractor = currentTimeSec >= 4.5;
      const show200Years = currentTimeSec > 7.8;

      return (
        <div style={{ width: 980, height: 1080, position: "relative" }}>
          <svg width="980" height="1080" viewBox="0 0 980 1080" fill="none">
            {/* Green Piazza Lawn */}
            <rect x="0" y="545" width="980" height="535" fill="#89AC6B" />
            <line x1="0" y1="545" x2="980" y2="545" stroke="#1E2022" strokeWidth="2.5" />

            {/* Stabilized Leaning Tower at 4.0° */}
            <g transform="translate(585, 745)">
              <ellipse cx="120" cy="4" rx="175" ry="16" fill="rgba(0,0,0,0.2)" />
              <PolyPisaTowerSvg tiers={8} tiltDeg={4.0} scale={0.94} />
            </g>

            {/* Circular Zoom Magnifier Showing 45 cm Shift Back */}
            {showMagnifier && (
              <g>
                <circle
                  cx="265"
                  cy="275"
                  r="175"
                  fill="#EDE6D6"
                  stroke="#1E2022"
                  strokeWidth="4"
                />
                {/* Zoomed Belfry Shift Diagram Inside Magnifier */}
                <g transform="translate(155, 205)">
                  {/* Dashed Old Position (45 cm further right) */}
                  <rect
                    x="32"
                    y="0"
                    width="195"
                    height="120"
                    fill="none"
                    stroke="#1E2022"
                    strokeWidth="2.5"
                    strokeDasharray="8 8"
                  />
                  {/* Solid New Position */}
                  <rect
                    x="0"
                    y="0"
                    width="195"
                    height="120"
                    fill="#E5E4DF"
                    stroke="#1E2022"
                    strokeWidth="3.5"
                  />
                  {/* Orange 45 cm Shift Indicator */}
                  <line x1="0" y1="-22" x2="32" y2="-22" stroke="#ED8A33" strokeWidth="5" />
                </g>
                {/* Connector Lines to Top of Tower */}
                <line x1="415" y1="195" x2="565" y2="62" stroke="#1E2022" strokeWidth="2.5" />
                <line x1="425" y1="345" x2="585" y2="115" stroke="#1E2022" strokeWidth="2.5" />
                <text
                  x="265"
                  y="525"
                  textAnchor="middle"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="68"
                  fill="#ED8A33"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  paintOrder="stroke"
                >
                  45 cm
                </text>
              </g>
            )}

            {/* Protractor Gauge & 200 YEARS Callout */}
            {showProtractor && (
              <g>
                <PolyProtractorGauge angleDeg={4.0} x={105} y={765} />
                <line
                  x1="775"
                  y1="42"
                  x2="775"
                  y2="745"
                  stroke="#1E2022"
                  strokeWidth="3"
                  strokeDasharray="12 10"
                />
              </g>
            )}

            {show200Years && (
              <g transform="translate(88, 355)">
                <text
                  x="0"
                  y="0"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="74"
                  fill="#ED8A33"
                >
                  200
                </text>
                <text
                  x="0"
                  y="62"
                  fontFamily={FONTS.display}
                  fontWeight="900"
                  fontSize="44"
                  letterSpacing="0.06em"
                  fill="#1E2022"
                >
                  YEARS
                </text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 15. POLY LAB BRANDED OUTRO END-CARD (3D 'P' Cube + Hand-Drawn Ring + Subscribe Cursor Click)
    if (spec.variant === "poly_outro_card") {
      const clicked = currentTimeSec > 1.35;
      const ringProgress = easeOutCubic(clamp((currentTimeSec - 0.25) / 0.8, 0, 1));
      const cursorMove = easeOutCubic(clamp((currentTimeSec - 0.4) / 0.9, 0, 1));
      const cursorX = 680 - cursorMove * 135;
      const cursorY = 820 - cursorMove * 165;

      return (
        <div
          style={{
            width: 980,
            height: 1080,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="980" height="900" viewBox="0 0 980 900" fill="none">
            {/* Hand-Drawn Double Orange Circle Ring Around Logo */}
            <circle
              cx="490"
              cy="265"
              r="142"
              fill="none"
              stroke="#ED8A33"
              strokeWidth="6"
              strokeDasharray={900}
              strokeDashoffset={900 * (1 - ringProgress)}
              strokeLinecap="round"
            />
            <circle
              cx="496"
              cy="260"
              r="148"
              fill="none"
              stroke="#ED8A33"
              strokeWidth="3.5"
              strokeDasharray={930}
              strokeDashoffset={930 * (1 - ringProgress)}
              opacity="0.7"
            />

            {/* 3D Isometric Red 'P' Block Logo */}
            <g transform="translate(415, 190)">
              <rect
                x="14"
                y="18"
                width="150"
                height="150"
                rx="28"
                fill="#5B1912"
                stroke="#1E2022"
                strokeWidth="4"
              />
              <rect
                x="0"
                y="0"
                width="150"
                height="150"
                rx="28"
                fill="#A93226"
                stroke="#1E2022"
                strokeWidth="4"
              />
              <text
                x="75"
                y="106"
                textAnchor="middle"
                fontFamily={FONTS.display}
                fontWeight="900"
                fontSize="92"
                fill="#FFFFFF"
              >
                P
              </text>
            </g>

            {/* THE POLY LAB Title + Serif Italic Subtitle */}
            <text
              x="490"
              y="495"
              textAnchor="middle"
              fontFamily={FONTS.display}
              fontWeight="900"
              fontSize="58"
              letterSpacing="0.06em"
              fill="#1E2022"
            >
              {spec.windowTitle ?? "THE POLY LAB"}
            </text>
            <text
              x="490"
              y="558"
              textAnchor="middle"
              fontFamily={FONTS.serif}
              fontStyle="italic"
              fontSize="46"
              fill="#ED8A33"
            >
              {spec.ctaBanner ?? "how things get made."}
            </text>

            {/* Subscribe -> Subscribed Button */}
            <g
              transform={`translate(490, 645) scale(${
                clicked ? 0.96 : 1.0
              }) translate(-155, -36)`}
            >
              <rect
                x="0"
                y="0"
                width="310"
                height="72"
                rx="36"
                fill={clicked ? "#ED8A33" : "#1E2022"}
              />
              <text
                x="155"
                y="46"
                textAnchor="middle"
                fontFamily={FONTS.sans}
                fontWeight="800"
                fontSize="32"
                fill="#FFFFFF"
              >
                {clicked ? "subscribed" : "subscribe"}
              </text>
            </g>

            {/* Handle Below Button */}
            {clicked && (
              <text
                x="490"
                y="742"
                textAnchor="middle"
                fontFamily={FONTS.mono}
                fontWeight="700"
                fontSize="24"
                letterSpacing="0.14em"
                fill="#1E2022"
              >
                {spec.footerLeft ?? "@POLYBLE"}
              </text>
            )}

            {/* Animated Mouse Pointer Cursor */}
            <g transform={`translate(${cursorX.toFixed(1)}, ${cursorY.toFixed(1)})`}>
              <polygon
                points="0,0 0,42 12,32 22,50 30,45 20,28 34,28"
                fill="#1E2022"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
            </g>
          </svg>
        </div>
      );
    }
  }

  return (
    <CardContainer
      theme={spec.theme ?? "dark"}
      windowTitle={spec.windowTitle ?? "engineering.schematic"}
      enterAt={enterAt}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={680}
    >
      {/* 1. INVERTED CAR CEILING CLAIM */}
      {spec.variant === "inverted_car_claim" && (
        <>
          <div
            style={{
              height: 44,
              backgroundColor: "#1F232B",
              borderRadius: 12,
              border: "1.5px solid #3A404D",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, #E5A93C, #E5A93C 14px, #1F232B 14px, #1F232B 28px)",
                opacity: 0.25,
              }}
            />
            <span
              style={{
                position: "relative",
                fontFamily: FONTS.mono,
                fontSize: 16,
                fontWeight: 700,
                color: "#E5A93C",
              }}
            >
              // STEEL REACTION CEILING RAIL · INVERTED LOAD
            </span>
            <span
              style={{
                position: "relative",
                fontFamily: FONTS.mono,
                fontSize: 15,
                color: "#9CA3AF",
              }}
            >
              TEST CHAMBER 04
            </span>
          </div>

          <div
            style={{
              position: "relative",
              height: 360,
              marginTop: 8,
              transform: `translateX(${((1 - animSpring) * -420).toFixed(1)}px)`,
            }}
          >
            <svg width="860" height="320" viewBox="0 0 720 320" fill="none">
              <g transform="translate(170, 42)">
                <circle cx="0" cy="0" r="42" fill="#18191D" stroke="#3A404D" strokeWidth="6" />
                <circle cx="0" cy="0" r="24" fill="#2A2D35" />
                <line
                  x1="-20"
                  y1="0"
                  x2="20"
                  y2="0"
                  stroke="#9CA3AF"
                  strokeWidth="3"
                  transform={`rotate(${currentTimeSec * 360})`}
                />
                <line
                  x1="0"
                  y1="-20"
                  x2="0"
                  y2="20"
                  stroke="#9CA3AF"
                  strokeWidth="3"
                  transform={`rotate(${currentTimeSec * 360})`}
                />
              </g>
              <g transform="translate(560, 42)">
                <circle cx="0" cy="0" r="42" fill="#18191D" stroke="#3A404D" strokeWidth="6" />
                <circle cx="0" cy="0" r="24" fill="#2A2D35" />
                <line
                  x1="-20"
                  y1="0"
                  x2="20"
                  y2="0"
                  stroke="#9CA3AF"
                  strokeWidth="3"
                  transform={`rotate(${currentTimeSec * 360})`}
                />
                <line
                  x1="0"
                  y1="-20"
                  x2="0"
                  y2="20"
                  stroke="#9CA3AF"
                  strokeWidth="3"
                  transform={`rotate(${currentTimeSec * 360})`}
                />
              </g>
              <path
                d="M 60,40 L 120,40 C 140,55 190,55 210,40 L 520,40 C 540,55 580,55 600,40 L 670,40 C 685,75 670,110 630,125 L 470,140 L 330,195 L 200,190 L 110,140 L 65,110 Z"
                fill={COLORS.signalRed}
                stroke="#111111"
                strokeWidth="5"
              />
              <path
                d="M 120,70 L 620,70 L 590,85 L 140,85 Z"
                fill="#FFFFFF"
                opacity="0.2"
              />
              <path
                d="M 215,140 L 330,185 L 450,135 L 230,135 Z"
                fill="#0F1115"
                stroke={COLORS.signalRed}
                strokeWidth="2"
              />
              <rect x="220" y="34" width="300" height="12" rx="4" fill="#00D2FF" />
              {[270, 370, 470].map((x) => (
                <path
                  key={x}
                  d={`M ${x},30 L ${x},10 M ${x - 6},17 L ${x},10 L ${x + 6},17`}
                  stroke="#00D2FF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <FeltPenCircle
              delay={12}
              width={200}
              height={110}
              style={{ top: -10, left: 105 }}
            />
          </div>
        </>
      )}

      {/* 2. VACUUM SKIRT SEAL CUTAWAY */}
      {spec.variant === "vacuum_skirt_seal" && (
        <div
          style={{
            height: 410,
            backgroundColor: "#181B22",
            borderRadius: 24,
            border: "1.5px solid rgba(255,255,255,0.08)",
            padding: 20,
            position: "relative",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 840 330" fill="none">
            <rect
              x="40"
              y="30"
              width="760"
              height="22"
              fill="#252A36"
              stroke="#3A404D"
              strokeWidth="2"
            />
            <g transform={`translate(0, ${((1 - animSpring) * 35).toFixed(1)})`}>
              <path d="M 120,85 L 140,52 L 164,52 L 144,85 Z" fill="#00D2FF" />
              <path d="M 680,85 L 660,52 L 636,52 L 656,85 Z" fill="#00D2FF" />
              <rect x="140" y="85" width="520" height="32" rx="8" fill={COLORS.signalRed} />
              <rect
                x="164"
                y="52"
                width="472"
                height="33"
                fill="rgba(0, 210, 255, 0.16)"
              />
              <text
                x="400"
                y="74"
                textAnchor="middle"
                fill="#00D2FF"
                fontFamily={FONTS.mono}
                fontSize="16"
                fontWeight="800"
              >
                LOW PRESSURE VACUUM CHAMBER (0.2 ATM)
              </text>
            </g>
            <g transform="translate(0, 150)">
              {[250, 400, 550].map((x) => (
                <g key={x}>
                  <line
                    x1={x}
                    y1="55"
                    x2={x}
                    y2="0"
                    stroke="#FFFFFF"
                    strokeWidth="4.5"
                    strokeDasharray="7 5"
                  />
                  <polygon points={`${x},0 ${x - 8},14 ${x + 8},14`} fill="#FFFFFF" />
                </g>
              ))}
              <text
                x="400"
                y="95"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily={FONTS.mono}
                fontSize="18"
                fontWeight="700"
              >
                ATMOSPHERIC PRESSURE LOCKS CAR UPWARD (14.7 PSI)
              </text>
            </g>
          </svg>
          <FeltPenCircle
            delay={12}
            width={190}
            height={80}
            style={{ top: 28, left: 100 }}
          />
        </div>
      )}

      {/* 3. TWIN TURBINES 25,000 RPM */}
      {spec.variant === "twin_turbines" && (
        <div
          style={{
            height: 410,
            backgroundColor: "#181B22",
            borderRadius: 24,
            border: "1.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 30px",
            position: "relative",
          }}
        >
          {[1, -1].map((dir, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <svg width="190" height="190" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="82"
                  fill="#1E222D"
                  stroke="#3A404D"
                  strokeWidth="6"
                />
                <circle cx="90" cy="90" r="74" fill="#0D0E12" />
                <g transform={`rotate(${(currentTimeSec * 720 * dir) % 360} 90 90)`}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                    <path
                      key={ang}
                      d="M 90,90 Q 110,60 145,55 L 140,45 Q 105,50 90,90 Z"
                      fill="#00D2FF"
                      transform={`rotate(${ang} 90 90)`}
                    />
                  ))}
                  <circle
                    cx="90"
                    cy="90"
                    r="22"
                    fill="#252A36"
                    stroke="#00D2FF"
                    strokeWidth="3"
                  />
                </g>
              </svg>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  color: "#9CA3AF",
                  marginTop: 10,
                }}
              >
                {i === 0 ? "LEFT FAN // IMP-01" : "RIGHT FAN // IMP-02"}
              </div>
            </div>
          ))}

          {/* Center RPM & Suction Counter */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 54,
                fontWeight: 800,
                color: "#00D2FF",
              }}
            >
              {Math.round(
                easeOutCubic(dt / 1.2) * 25000
              ).toLocaleString()}
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                color: "#FFFFFF",
                fontWeight: 700,
              }}
            >
              RPM TURBINE SPEED
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 34,
                color: COLORS.signalRed,
                fontWeight: 800,
                marginTop: 14,
              }}
            >
              7,600 LBS
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#9CA3AF" }}>
              2.0 G DOWNFORCE
            </div>
            <FeltPenCircle
              delay={14}
              width={235}
              height={85}
              style={{ top: 78, left: -12 }}
            />
          </div>
        </div>
      )}

      {/* 4. SPACEX COLD-GAS THRUSTERS */}
      {spec.variant === "cold_gas_thrusters" && (
        <div
          style={{
            height: 410,
            backgroundColor: "#181B22",
            borderRadius: 24,
            border: "1.5px solid rgba(255,255,255,0.08)",
            padding: 24,
            position: "relative",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 840 330" fill="none">
            <rect
              x="70"
              y="70"
              width="290"
              height="145"
              rx="38"
              fill="#1C212B"
              stroke="#00D2FF"
              strokeWidth="4"
            />
            {[115, 175, 235, 295].map((x) => (
              <line
                key={x}
                x1={x}
                y1="70"
                x2={x}
                y2="215"
                stroke="#252D3D"
                strokeWidth="3"
              />
            ))}
            <text
              x="215"
              y="138"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily={FONTS.mono}
              fontSize="22"
              fontWeight="800"
            >
              SPACEX COPV TANK
            </text>
            <text
              x="215"
              y="168"
              textAnchor="middle"
              fill="#00D2FF"
              fontFamily={FONTS.mono}
              fontSize="15"
              fontWeight="700"
            >
              COMPRESSED NITROGEN
            </text>
            <path
              d="M 360,142 L 510,142 L 510,80 L 575,80"
              stroke="#9CA3AF"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <g transform="translate(575, 50)">
              <polygon
                points="0,20 60,0 60,60 0,40"
                fill="#2A3040"
                stroke="#FFFFFF"
                strokeWidth="3"
              />
              <path
                d="M 60,10 L 225,-12 L 245,30 L 225,72 L 60,50 Z"
                fill="rgba(0, 210, 255, 0.48)"
                opacity={Math.sin(currentTimeSec * 28) > 0 ? 1 : 0.45}
              />
              <path
                d="M 60,20 L 160,14 L 180,30 L 160,46 L 60,40 Z"
                fill="#FFFFFF"
                opacity={Math.sin(currentTimeSec * 28) > 0 ? 1 : 0.5}
              />
            </g>
          </svg>
          <div style={{ position: "absolute", bottom: 26, left: 40 }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 48,
                fontWeight: 800,
                color: COLORS.signalRed,
              }}
            >
              {Math.round(easeOutCubic(dt / 1.1) * 10000).toLocaleString()}{" "}
              <span style={{ fontSize: 26, color: "#FFFFFF" }}>PSI</span>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 15, color: "#9CA3AF" }}>
              INTERNAL THRUSTER STORAGE PRESSURE
            </div>
            <FeltPenCircle
              delay={10}
              width={250}
              height={85}
              style={{ top: -10, left: -14 }}
            />
          </div>
        </div>
      )}

      {/* 5. VERDICT SUMMARY + SUBSCRIBE CTA */}
      {spec.variant === "verdict_summary" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            {
              label: "GROUND SUCTION",
              value: "2.0 G DOWNFORCE",
              status: "PHYSICALLY PROVEN",
            },
            {
              label: "SPACEX COPV THRUST",
              value: "10,000 PSI NITROGEN",
              status: "REAL AEROSPACE TECH",
            },
            {
              label: "STREET CAPABILITY",
              value: "TRACK ONLY",
              status: "REQUIRES SEALED SURFACE",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#191B22",
                borderRadius: 18,
                padding: "18px 24px",
                border: "1.5px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: "#9CA3AF" }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    marginTop: 4,
                  }}
                >
                  {item.value}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(0, 210, 255, 0.14)",
                  color: "#00D2FF",
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: 12,
                }}
              >
                {item.status}
              </div>
            </div>
          ))}

          {spec.ctaBanner && (
            <div
              style={{
                marginTop: 12,
                alignSelf: "center",
                backgroundColor: COLORS.signalRed,
                color: "#FFFFFF",
                borderRadius: 100,
                padding: "20px 48px",
                border: "3px solid #FFFFFF",
                boxShadow: "0 16px 40px rgba(232, 64, 42, 0.45)",
                fontFamily: FONTS.mono,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "0.06em",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transform: `scale(${(
                  1 +
                  Math.sin(currentTimeSec * 6) * 0.03
                ).toFixed(3)})`,
              }}
            >
              <span>🔔</span>
              <span>{spec.ctaBanner}</span>
            </div>
          )}
        </div>
      )}

      {/* Optional Bottom Telemetry Pill */}
      {(spec.footerLeft || spec.footerRight) && (
        <div
          style={{
            marginTop: 22,
            backgroundColor: isDark ? "#1A1D24" : "#F3F0E8",
            borderRadius: 18,
            padding: "18px 26px",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "2px solid #111111",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: FONTS.mono,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          <span style={{ color: isDark ? "#FFFFFF" : COLORS.ink }}>
            {spec.footerLeft}
          </span>
          <span style={{ color: "#00D2FF" }}>{spec.footerRight}</span>
        </div>
      )}
    </CardContainer>
  );
};
