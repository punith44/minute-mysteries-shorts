import React from "react";
import { CardContainer } from "../CardContainer";
import { FeltPenCircle } from "../FeltPenAnnotation";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, easeOutCubic, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type MetricCounterSpec = Extract<WidgetSpec, { type: "metric_counter" }>;

interface MetricCounterCardProps {
  spec: MetricCounterSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

export const MetricCounterCard: React.FC<MetricCounterCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  const enterAt = spec.enterAt ?? 0.12;
  const countProgress = easeOutCubic((currentTimeSec - (enterAt + 0.1)) / 1.4);
  const currentVal = Math.round(spec.from + (spec.to - spec.from) * countProgress);
  const isDark = (spec.theme ?? "dark") === "dark";

  const arrowSpring = evaluateSpring(
    clamp((currentTimeSec - (enterAt + 0.12)) / 0.5, 0, 1),
    springOvershoot
  );
  const arrowY = (1 - arrowSpring) * -80 + Math.sin(currentTimeSec * 6) * 6;

  return (
    <CardContainer
      theme={spec.theme ?? "dark"}
      windowTitle={spec.windowTitle ?? "physics.telemetry.loadcell"}
      enterAt={enterAt}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={680}
    >
      {/* Main Metric Stage */}
      <div
        style={{
          height: spec.footerMetrics ? 420 : "100%",
          backgroundColor: isDark ? "#1A1D24" : "#F8F6F1",
          borderRadius: 24,
          border: isDark
            ? "1.5px solid rgba(255, 255, 255, 0.08)"
            : "2.5px solid #111111",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Optional Directional Force Vector Icon */}
        {spec.directionIcon && spec.directionIcon !== "none" && (
          <div
            style={{
              transform: `translateY(${arrowY.toFixed(1)}px)`,
              marginBottom: 12,
            }}
          >
            <svg width="110" height="130" viewBox="0 0 120 150" fill="none">
              {spec.directionIcon === "down" ? (
                <>
                  <line
                    x1="60"
                    y1="10"
                    x2="60"
                    y2="105"
                    stroke={COLORS.signalRed}
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <polygon points="60,145 15,95 105,95" fill={COLORS.signalRed} />
                </>
              ) : (
                <>
                  <line
                    x1="60"
                    y1="140"
                    x2="60"
                    y2="45"
                    stroke="#00D2FF"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <polygon points="60,5 15,55 105,55" fill="#00D2FF" />
                </>
              )}
            </svg>
          </div>
        )}

        {/* Numerical Counter Readout */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 76,
              fontWeight: 800,
              color: isDark ? "#FFFFFF" : COLORS.ink,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
              transform: `scale(${(1.0 + Math.sin(currentTimeSec * 4.5) * 0.012).toFixed(3)})`,
              transformOrigin: "center center",
            }}
          >
            {currentVal.toLocaleString()}{" "}
            <span style={{ fontSize: 38, color: COLORS.signalRed }}>
              {spec.unit}
            </span>
          </div>

          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              fontWeight: 600,
              color: isDark ? "#9CA3AF" : "#52525B",
              marginTop: 6,
            }}
          >
            {spec.sublabel}
          </div>

          {/* Live Telemetry Activity Indicator Bars */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 5,
              height: 24,
              marginTop: 12,
            }}
          >
            {[0.2, 0.6, 0.9, 0.4, 0.8, 0.3, 0.7, 0.5, 0.85, 0.35, 0.65].map((_, idx) => {
              const barH = 5 + Math.abs(Math.sin(currentTimeSec * 6 + idx * 0.75)) * 18;
              return (
                <div
                  key={idx}
                  style={{
                    width: 4,
                    height: `${barH.toFixed(1)}px`,
                    borderRadius: 2,
                    backgroundColor: isDark
                      ? idx === 2 || idx === 8
                        ? COLORS.signalRed
                        : "#00D2FF"
                      : "#111111",
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>

          {spec.circleHighlightAt !== undefined && (
            <FeltPenCircle
              delay={Math.round(spec.circleHighlightAt * 30)}
              width={320}
              height={105}
              style={{ top: -8, left: "50%", transform: "translateX(-50%)" }}
            />
          )}
        </div>
      </div>

      {/* Optional Footer Metrics Grid */}
      {spec.footerMetrics && spec.footerMetrics.length > 0 && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: `repeat(${spec.footerMetrics.length}, 1fr)`,
            gap: 18,
          }}
        >
          {spec.footerMetrics.map((m, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: isDark ? "#191B22" : "#F3F0E8",
                borderRadius: 18,
                padding: "18px 22px",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "2px solid #111111",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  color: isDark ? "#9CA3AF" : "#52525B",
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  fontWeight: 800,
                  color: m.accent
                    ? "#00D2FF"
                    : isDark
                    ? "#FFFFFF"
                    : COLORS.ink,
                  marginTop: 4,
                }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContainer>
  );
};
