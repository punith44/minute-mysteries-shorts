import React from "react";
import { CardContainer } from "../CardContainer";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, easeOutCubic, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type ChartTrendSpec = Extract<WidgetSpec, { type: "chart_trend" }>;

interface ChartTrendCardProps {
  spec: ChartTrendSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * Animated Trend Line / Curve Chart Card
 * Matches Video-1328 (0:10 "Right now, AI-animated reels") and Video-34923 (0:10 "11 views" chart).
 */
export const ChartTrendCard: React.FC<ChartTrendCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  const enterAt = spec.enterAt ?? 0.12;
  const lineProgress = easeOutCubic((currentTimeSec - (enterAt + 0.15)) / 1.4);

  const w = 820;
  const h = 340;
  const pts = spec.points.map((val, idx) => {
    const x = (idx / Math.max(1, spec.points.length - 1)) * w;
    const y = h - (clamp(val, 0, 100) / 100) * (h - 40) - 20;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const polylineStr = pts.join(" ");

  const badgeSpring = evaluateSpring(
    clamp((currentTimeSec - (enterAt + 0.35)) / 0.5, 0, 1),
    springOvershoot
  );

  return (
    <CardContainer
      theme="paper"
      windowTitle={spec.title}
      headerRight={
        spec.liveBadge ? (
          <div
            style={{
              backgroundColor: "#EFECE6",
              padding: "6px 18px",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONTS.mono,
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.ink,
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: COLORS.signalRed,
              }}
            />
            <span>LIVE</span>
          </div>
        ) : undefined
      }
      enterAt={enterAt}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={640}
    >
      {/* Top Floating Red Pill Banner if provided */}
      {spec.pillBanner && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: `translateX(-50%) scale(${badgeSpring.toFixed(
              3
            )}) rotate(-2deg)`,
            backgroundColor: COLORS.signalRed,
            color: "#FFFFFF",
            fontFamily: FONTS.sans,
            fontSize: 32,
            fontWeight: 800,
            padding: "10px 32px",
            borderRadius: 28,
            border: `3px solid ${COLORS.ink}`,
            boxShadow: "6px 8px 0px rgba(17,17,17,0.22)",
            zIndex: 20,
            whiteSpace: "nowrap",
          }}
        >
          {spec.pillBanner}
        </div>
      )}

      {/* Big Metric Readout */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 82,
            fontWeight: 800,
            color: COLORS.ink,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {spec.metricValue}
        </span>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontSize: 38,
            fontWeight: 600,
            color: "#71717A",
          }}
        >
          {spec.metricLabel}
        </span>
      </div>

      {/* SVG Grid & Animated Trend Curve */}
      <div style={{ position: "relative", width: w, height: h, margin: "0 auto" }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
          {/* Subtle Graph Grid Lines */}
          {[0.2, 0.4, 0.6, 0.8].map((r, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={h * r}
              x2={w}
              y2={h * r}
              stroke="#E4E4E7"
              strokeWidth="2"
            />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((c, i) => (
            <line
              key={`v-${i}`}
              x1={w * c}
              y1={0}
              x2={w * c}
              y2={h}
              stroke="#E4E4E7"
              strokeWidth="2"
            />
          ))}

          {/* Axes */}
          <line
            x1={0}
            y1={h - 10}
            x2={w}
            y2={h - 10}
            stroke={COLORS.ink}
            strokeWidth="4"
          />
          <line
            x1={4}
            y1={10}
            x2={4}
            y2={h - 10}
            stroke={COLORS.ink}
            strokeWidth="4"
          />

          {/* Trend Polyline */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke={COLORS.signalRed}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1600"
            strokeDashoffset={(1 - lineProgress) * 1600}
          />
        </svg>

        {/* Optional NOW Marker Pill at Bottom Left */}
        {spec.nowMarkerLabel && (
          <div
            style={{
              position: "absolute",
              bottom: -14,
              left: 90,
              backgroundColor: COLORS.ink,
              color: "#FFFFFF",
              padding: "8px 24px",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: FONTS.mono,
              fontSize: 22,
              fontWeight: 800,
              transform: `scale(${badgeSpring.toFixed(3)})`,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: COLORS.signalRed,
              }}
            />
            <span>{spec.nowMarkerLabel}</span>
          </div>
        )}
      </div>
    </CardContainer>
  );
};
