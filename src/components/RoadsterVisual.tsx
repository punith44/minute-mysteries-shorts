import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme/colors";

interface RoadsterVisualProps {
  inverted?: boolean;
  showSuctionVectors?: boolean;
  showThrusters?: boolean;
  scale?: number;
  vacuumIntensity?: number; // 0 to 1
  style?: React.CSSProperties;
}

export const RoadsterVisual: React.FC<RoadsterVisualProps> = ({
  inverted = false,
  showSuctionVectors = true,
  showThrusters = false,
  scale = 1.0,
  vacuumIntensity = 0.8,
  style,
}) => {
  const frame = useCurrentFrame();

  // Floating micro-vibration when turbines are spinning
  const vibration = (Math.sin(frame * 1.5) * 1.2 * vacuumIntensity);
  const arrowPulse = (frame * 3) % 40;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale}) ${inverted ? "rotate(180deg)" : ""} translateY(${vibration}px)`,
        transformOrigin: "center center",
        position: "relative",
        ...style,
      }}
    >
      <svg
        width="760"
        height="320"
        viewBox="0 0 760 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Runway / Ceiling Surface when inverted */}
        {inverted && (
          <g id="surface">
            <line
              x1="-40"
              y1="287"
              x2="800"
              y2="287"
              stroke={COLORS.ink}
              strokeWidth="6"
            />
            {/* Surface diagonal hatch marks extending into ceiling */}
            {[-20, 40, 100, 160, 220, 280, 340, 400, 460, 520, 580, 640, 700, 760].map(
              (x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1="287"
                  x2={x + 30}
                  y2="317"
                  stroke={COLORS.inkLight}
                  strokeWidth="3"
                />
              )
            )}
          </g>
        )}

        {/* --- ACTIVE UNDERBODY VACUUM FIELD --- */}
        {showSuctionVectors && (
          <g id="vacuum-field" opacity={vacuumIntensity}>
            {/* Suction zone highlight */}
            <rect
              x="180"
              y="235"
              width="400"
              height="35"
              fill={COLORS.signalRed}
              opacity="0.18"
              rx="4"
            />
            <line
              x1="180"
              y1="250"
              x2="580"
              y2="250"
              stroke={COLORS.signalRed}
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />

            {/* Suction arrows pulling toward the car chassis */}
            {[220, 290, 360, 430, 500, 550].map((x, i) => {
              const yOffset = (arrowPulse + i * 8) % 30;
              return (
                <g key={i} transform={`translate(${x}, ${265 - yOffset})`}>
                  <line
                    x1="0"
                    y1="18"
                    x2="0"
                    y2="0"
                    stroke={COLORS.signalRed}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <polygon
                    points="-5,6 0,0 5,6"
                    fill={COLORS.signalRed}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* --- CAR BODY SILHOUETTE --- */}
        <g id="car-chassis">
          {/* Main Aerodynamic Body Contour */}
          <path
            d="M 60 230 C 90 230 110 200 160 190 C 230 170 340 110 440 110 C 530 110 590 150 670 195 C 710 210 730 225 730 235 C 730 245 700 250 650 250 L 110 250 C 70 250 55 240 60 230 Z"
            fill={COLORS.paperCard}
            stroke={COLORS.ink}
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Roof & Cockpit Glass Sheen */}
          <path
            d="M 330 170 L 430 120 C 500 120 540 145 610 185 L 340 185 Z"
            fill={COLORS.ink}
          />
          <path
            d="M 370 165 L 435 128 C 475 128 505 145 545 170 Z"
            fill="rgba(255, 255, 255, 0.3)"
          />

          {/* Aerodynamic Side Character Lines */}
          <path
            d="M 170 200 C 260 205 380 215 520 205 C 600 200 660 210 680 220"
            fill="none"
            stroke={COLORS.ink}
            strokeWidth="3.5"
          />

          {/* Signal Red Accent Stripe */}
          <path
            d="M 180 228 L 580 228"
            stroke={COLORS.signalRed}
            strokeWidth="4"
          />

          {/* Underbody Ground-Sealing Flexible Skirt */}
          <rect
            x="200"
            y="246"
            width="360"
            height="12"
            fill="#2A2A2A"
            stroke={COLORS.ink}
            strokeWidth="2.5"
            rx="2"
          />

          {/* Front Wheel */}
          <g id="wheel-front" transform="translate(160, 245)">
            <circle cx="0" cy="0" r="42" fill={COLORS.ink} />
            <circle cx="0" cy="0" r="26" fill={COLORS.paperDeep} stroke={COLORS.ink} strokeWidth="3" />
            <circle cx="0" cy="0" r="10" fill={COLORS.signalRed} />
            {/* Brake rotor spokes */}
            <line x1="-20" y1="0" x2="20" y2="0" stroke={COLORS.ink} strokeWidth="2.5" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke={COLORS.ink} strokeWidth="2.5" />
          </g>

          {/* Rear Wheel */}
          <g id="wheel-rear" transform="translate(600, 245)">
            <circle cx="0" cy="0" r="42" fill={COLORS.ink} />
            <circle cx="0" cy="0" r="26" fill={COLORS.paperDeep} stroke={COLORS.ink} strokeWidth="3" />
            <circle cx="0" cy="0" r="10" fill={COLORS.signalRed} />
            <line x1="-20" y1="0" x2="20" y2="0" stroke={COLORS.ink} strokeWidth="2.5" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke={COLORS.ink} strokeWidth="2.5" />
          </g>

          {/* Front Headlight LED strip */}
          <path
            d="M 70 226 L 110 218 L 95 228 Z"
            fill={COLORS.signalRed}
          />

          {/* Rear Taillight signature */}
          <path
            d="M 720 220 L 690 218 L 715 228 Z"
            fill={COLORS.signalRed}
          />
        </g>

        {/* --- SPACEX COLD-GAS THRUSTERS (REAR NOZZLE JET) --- */}
        {showThrusters && (
          <g id="thruster-burst" transform="translate(50, 225)">
            {/* Thruster Nozzle Port */}
            <rect
              x="-15"
              y="-10"
              width="15"
              height="20"
              fill={COLORS.ink}
              rx="2"
            />
            {/* Cold Gas Expansion Plume */}
            <polygon
              points="-15,-5 -80,-25 -70,-5 -95,0 -70,5 -80,25 -15,5"
              fill="rgba(2, 132, 199, 0.35)"
              stroke={COLORS.techCyan}
              strokeWidth="2.5"
            />
            <polygon
              points="-15,-2 -55,-12 -65,0 -55,12 -15,2"
              fill="#FFFFFF"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
