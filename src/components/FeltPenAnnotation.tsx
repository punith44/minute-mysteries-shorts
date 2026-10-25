import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FeltPenCircleProps {
  delay?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const FeltPenCircle: React.FC<FeltPenCircleProps> = ({
  delay = 8,
  width = 160,
  height = 70,
  color = "#E8402A",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const dashoffset = interpolate(drawSpring, [0, 1], [400, 0]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 70"
      style={{
        position: "absolute",
        pointerEvents: "none",
        overflow: "visible",
        ...style,
      }}
    >
      <ellipse
        cx="80"
        cy="35"
        rx="72"
        ry="28"
        fill="none"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="400"
        strokeDashoffset={dashoffset}
        transform="rotate(-2 80 35)"
      />
    </svg>
  );
};

interface SpeechBubbleProps {
  tag: string;             // e.g. "1 FIRST"
  text: string;            // e.g. "you might think they won't go viral"
  icon?: string;           // e.g. "?"
  delay?: number;
  style?: React.CSSProperties;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  tag,
  text,
  icon,
  delay = 10,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  const scale = interpolate(popSpring, [0, 1], [0.6, 1]);
  const opacity = interpolate(popSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "#FFFFFF",
        color: "#111111",
        borderRadius: 20,
        padding: "16px 22px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
        border: "2px solid #111111",
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "bottom left",
        ...style,
      }}
    >
      {/* Top Black Tag */}
      <div
        style={{
          position: "absolute",
          top: -14,
          left: 18,
          backgroundColor: "#111111",
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 800,
          padding: "2px 10px",
          borderRadius: 8,
          letterSpacing: "0.5px",
        }}
      >
        {tag}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.25 }}>{text}</span>
        {icon && (
          <span style={{ fontSize: 26, fontWeight: 900, color: "#AAAAAA" }}>{icon}</span>
        )}
      </div>
    </div>
  );
};
