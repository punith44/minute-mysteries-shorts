import React from "react";
import { CardContainer } from "../CardContainer";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type ComparisonGridSpec = Extract<WidgetSpec, { type: "comparison_grid" }>;

interface ComparisonGridCardProps {
  spec: ComparisonGridSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

export const ComparisonGridCard: React.FC<ComparisonGridCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  const isDark = (spec.theme ?? "dark") === "dark";
  const enterAt = spec.enterAt ?? 0.12;

  // Optional rubber stamp slam
  const stamp = spec.stamp;
  const stampDt = stamp ? currentTimeSec - stamp.slamAt : -1;
  const stampProg = clamp(stampDt / 0.35, 0, 1);
  const stampSpring = evaluateSpring(stampProg, springOvershoot + 0.2);
  const stampScale = 2.8 - 1.8 * stampSpring;
  const stampOpacity = clamp(stampDt / 0.06, 0, 1);

  return (
    <CardContainer
      theme={spec.theme ?? "dark"}
      windowTitle={spec.windowTitle ?? "comparison.matrix"}
      enterAt={enterAt}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={680}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${spec.columns.length}, 1fr)`,
          gap: 20,
          height: spec.footerLeft || spec.footerRight ? 430 : "100%",
          position: "relative",
        }}
      >
        {spec.columns.map((col, idx) => {
          const colDt = currentTimeSec - (enterAt + 0.12 + idx * 0.14);
          const colSpring = evaluateSpring(
            clamp(colDt / 0.45, 0, 1),
            springOvershoot
          );
          const toneColor =
            col.tone === "good"
              ? "#00D2FF"
              : col.tone === "bad"
              ? COLORS.signalRed
              : "#A1A1AA";

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isDark ? "#181B22" : "#141416",
                color: "#FFFFFF",
                borderRadius: 24,
                border: `2px solid ${
                  col.tone === "good"
                    ? "rgba(0, 210, 255, 0.35)"
                    : col.tone === "bad"
                    ? "rgba(232, 64, 42, 0.4)"
                    : "rgba(255,255,255,0.1)"
                }`,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                transform: `translateY(${((1 - colSpring) * 40).toFixed(
                  1
                )}px) scale(${(0.85 + 0.15 * colSpring).toFixed(3)})`,
                opacity: clamp(colDt / 0.08, 0, 1),
              }}
            >
              {col.icon && <div style={{ fontSize: 52 }}>{col.icon}</div>}
              {col.badge && (
                <div
                  style={{
                    fontFamily: FONTS.serif,
                    fontStyle: "italic",
                    fontSize: 52,
                    color: COLORS.signalRed,
                    marginBottom: 8,
                  }}
                >
                  {col.badge}
                </div>
              )}

              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginTop: 10,
                }}
              >
                {col.title}
              </div>

              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  color: toneColor,
                  marginTop: 6,
                }}
              >
                {col.subtitle}
              </div>

              <div
                style={{
                  marginTop: 22,
                  backgroundColor:
                    col.tone === "good"
                      ? "rgba(0, 210, 255, 0.14)"
                      : col.tone === "bad"
                      ? "rgba(232, 64, 42, 0.16)"
                      : "rgba(255,255,255,0.08)",
                  color: toneColor,
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "8px 16px",
                  borderRadius: 12,
                }}
              >
                {col.statusText}
              </div>
            </div>
          );
        })}

        {/* Slamming Rubber Stamp Overlay */}
        {stamp && stampDt >= 0 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${stampScale.toFixed(
                3
              )}) rotate(-10deg)`,
              opacity: stampOpacity,
              zIndex: 40,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                border: `8px solid ${stamp.color ?? COLORS.signalRed}`,
                borderRadius: 24,
                padding: "16px 42px",
                backgroundColor: COLORS.signalRed,
                color: "#FFFFFF",
                fontFamily: FONTS.sans,
                fontSize: 54,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow:
                  "0 24px 50px rgba(17, 17, 17, 0.45), 0 0 0 4px #111111",
                whiteSpace: "nowrap",
              }}
            >
              {stamp.text}
            </div>
          </div>
        )}
      </div>

      {/* Optional Footer Telemetry Bar */}
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
          <span style={{ color: isDark ? "#D4D4D8" : COLORS.ink }}>
            {spec.footerLeft}
          </span>
          <span style={{ color: COLORS.signalRed }}>{spec.footerRight}</span>
        </div>
      )}
    </CardContainer>
  );
};
