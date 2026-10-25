import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";
import { SPRING_PRESETS } from "../theme/transitions";

interface LiveCounterProps {
  label: string;
  from?: number;
  to: number;
  unit?: string;
  decimals?: number;
  startFrame?: number;
  durationInFrames?: number;
  color?: string;
  gaugeMax?: number;
  style?: React.CSSProperties;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  label,
  from = 0,
  to,
  unit = "",
  decimals = 0,
  startFrame = 0,
  durationInFrames = 45,
  color = COLORS.signalRed,
  gaugeMax,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Card entrance spring
  const entrance = spring({
    frame: relFrame,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  // Numerical count interpolation
  const countProgress = interpolate(
    relFrame,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const currentValue = from + (to - from) * countProgress;
  const formattedNumber = currentValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Gauge bar calculation
  const max = gaugeMax ?? Math.max(to, 1);
  const gaugePercent = Math.min(100, Math.max(0, (currentValue / max) * 100));

  return (
    <div
      style={{
        backgroundColor: COLORS.paperCard,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 8,
        padding: "16px 24px",
        boxShadow: `6px 6px 0px ${COLORS.ink}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transform: `scale(${entrance})`,
        transformOrigin: "center center",
        opacity: entrance,
        ...style,
      }}
    >
      {/* Metric Label */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: COLORS.inkMuted,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{label}</span>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      </div>

      {/* Numerical Counter Display */}
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 44,
          fontWeight: 800,
          color: COLORS.ink,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span style={{ color }}>{formattedNumber}</span>
        {unit && (
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: COLORS.inkMuted,
              letterSpacing: "0.02em",
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Progress Gauge Bar */}
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: COLORS.paperDeep,
          borderRadius: 4,
          overflow: "hidden",
          border: `1.5px solid ${COLORS.ink}`,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${gaugePercent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
