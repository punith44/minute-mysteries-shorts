import React from "react";
import { CardContainer } from "../CardContainer";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type ChecklistSpec = Extract<WidgetSpec, { type: "checklist" }>;

interface ChecklistCardProps {
  spec: ChecklistSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * Animated Checklist Widget (Matches Video-27458 "Before launch 0/4" reference)
 */
export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  return (
    <CardContainer
      theme="paper"
      enterAt={spec.enterAt ?? 0.12}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={640}
    >
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid rgba(17,17,17,0.08)",
          paddingBottom: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 54,
            fontWeight: 700,
            color: COLORS.ink,
            letterSpacing: "-0.03em",
          }}
        >
          {spec.title}
        </div>

        {spec.badgeProgress && (
          <div
            style={{
              backgroundColor: "#EFECE6",
              padding: "10px 28px",
              borderRadius: 32,
              fontFamily: FONTS.mono,
              fontSize: 32,
              fontWeight: 600,
              color: "#7C7870",
            }}
          >
            {spec.badgeProgress}
          </div>
        )}
      </div>

      {/* Checklist Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {spec.items.map((item, idx) => {
          const rowStart = (spec.enterAt ?? 0.12) + 0.18 + idx * 0.25;
          const dt = currentTimeSec - rowStart;
          const prog = clamp(dt / 0.45, 0, 1);
          const s = evaluateSpring(prog, springOvershoot);
          const isChecked =
            item.checkedAt !== undefined && currentTimeSec >= item.checkedAt;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                paddingBottom: 20,
                borderBottom:
                  idx < spec.items.length - 1
                    ? "1.5px solid rgba(17,17,17,0.06)"
                    : "none",
                transform: `translateX(${((1 - s) * -45).toFixed(1)}px)`,
                opacity: clamp(dt / 0.1, 0.15, 1),
              }}
            >
              {/* Checkbox Square */}
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  border: `3.5px solid ${
                    isChecked ? COLORS.signalRed : COLORS.ink
                  }`,
                  backgroundColor: isChecked ? COLORS.signalRed : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 34,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {isChecked ? "✓" : ""}
              </div>

              {/* Italic Red Number */}
              <span
                style={{
                  fontFamily: FONTS.serif,
                  fontStyle: "italic",
                  fontSize: 58,
                  color: COLORS.signalRed,
                  lineHeight: 1,
                  minWidth: 36,
                }}
              >
                {item.number}
              </span>

              {/* Item Label */}
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 42,
                  fontWeight: 700,
                  color: COLORS.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </CardContainer>
  );
};
