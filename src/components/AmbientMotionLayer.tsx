import React from "react";

interface AmbientMotionLayerProps {
  effect:
    | "halftone_rays"
    | "radar_rings"
    | "orbital_grid"
    | "hypnotic_pulse"
    | "speed_lines";
  currentTimeSec: number;
  accentColor?: string;
  inkColor?: string;
}

/**
 * Dynamic Ambient B-Roll & Parallax Background Layer
 * Recreates the rotating halftone sunburst rays (Video-1328 0:05),
 * concentric radar target rings (Video-76790 0:16), and continuous parallax motion.
 */
export const AmbientMotionLayer: React.FC<AmbientMotionLayerProps> = ({
  effect,
  currentTimeSec,
  accentColor = "#E8402A",
  inkColor = "#111111",
}) => {
  if (effect === "halftone_rays") {
    // Rotating Halftone Sunburst Rays (Matches Video-1328_05s.png)
    const rotDeg = currentTimeSec * 8;
    const rays = [0, 60, 120, 180, 240, 300];
    return (
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.48,
        }}
      >
        <g transform={`translate(540, 910) rotate(${rotDeg.toFixed(2)})`}>
          {rays.map((ang) => (
            <polygon
              key={ang}
              points="0,0 -115,-1200 115,-1200"
              fill="url(#halftone-dots)"
              transform={`rotate(${ang})`}
            />
          ))}
        </g>
      </svg>
    );
  }

  if (effect === "radar_rings") {
    // Expanding Target / Telemetry Radar Rings (Matches Video-76790_16s.png)
    const pulseOffset = (currentTimeSec * 90) % 240;
    return (
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.42,
        }}
      >
        <g transform="translate(540, 920)">
          {[180, 340, 500].map((baseR, idx) => {
            const r = baseR + pulseOffset * 0.45;
            return (
              <circle
                key={idx}
                cx="0"
                cy="0"
                r={r}
                fill="none"
                stroke={accentColor}
                strokeWidth={idx === 0 ? "4" : "2.5"}
                strokeDasharray={idx === 1 ? "14 10" : undefined}
                opacity={Math.max(0.12, 0.65 - idx * 0.18)}
              />
            );
          })}
          {/* Radial tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-280"
              x2="0"
              y2="-310"
              stroke={accentColor}
              strokeWidth="4"
              transform={`rotate(${i * 30 + currentTimeSec * 12})`}
              opacity="0.55"
            />
          ))}
        </g>
      </svg>
    );
  }

  if (effect === "speed_lines") {
    return (
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0.25,
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 80 + i * 72;
          const yOffset = ((currentTimeSec * 900 + i * 230) % 2200) - 200;
          return (
            <line
              key={i}
              x1={x}
              y1={yOffset}
              x2={x}
              y2={yOffset + 240}
              stroke={i % 3 === 0 ? accentColor : inkColor}
              strokeWidth={i % 3 === 0 ? "4" : "2"}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    );
  }

  // Default orbital_grid / hypnotic_pulse
  const shiftY = (currentTimeSec * 45) % 120;
  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.18,
      }}
    >
      <g transform={`translate(0, ${shiftY.toFixed(1)})`}>
        {Array.from({ length: 18 }).map((_, r) => (
          <line
            key={r}
            x1="0"
            y1={r * 120}
            x2="1080"
            y2={r * 120}
            stroke={inkColor}
            strokeWidth="1.5"
            strokeDasharray="8 8"
          />
        ))}
      </g>
    </svg>
  );
};
