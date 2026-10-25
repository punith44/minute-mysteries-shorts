import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";
import { SPRING_PRESETS } from "../theme/transitions";

interface IsometricCardProps {
  title?: string;
  badge?: string;
  stamp?: string;
  stampColor?: string;
  rotateDeg?: number;
  startFrame?: number;
  width?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const IsometricCard: React.FC<IsometricCardProps> = ({
  title,
  badge,
  stamp,
  stampColor = COLORS.signalRed,
  rotateDeg = 0,
  startFrame = 0,
  width = 860,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  const entrance = spring({
    frame: relFrame,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  const stampEntrance = spring({
    frame: Math.max(0, relFrame - 15),
    fps,
    config: SPRING_PRESETS.heavy,
  });

  return (
    <div
      style={{
        width,
        backgroundColor: COLORS.paperCard,
        border: `3.5px solid ${COLORS.ink}`,
        borderRadius: 12,
        padding: "28px 32px",
        boxShadow: `10px 10px 0px ${COLORS.ink}`,
        transform: `translateY(${(1 - entrance) * 60}px) rotate(${rotateDeg}deg) scale(${entrance})`,
        transformOrigin: "center center",
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Top Header Row if title or badge provided */}
      {(title || badge) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `2px solid ${COLORS.ink}`,
            paddingBottom: 14,
            marginBottom: 20,
          }}
        >
          {title && (
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 22,
                fontWeight: 800,
                color: COLORS.ink,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
          )}

          {badge && (
            <div
              style={{
                backgroundColor: COLORS.ink,
                color: COLORS.paper,
                fontFamily: FONTS.sans,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.15em",
                padding: "4px 10px",
                borderRadius: 4,
              }}
            >
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Main Card Content */}
      {children}

      {/* Red Stamp Overlay if specified */}
      {stamp && stampEntrance > 0 && (
        <div
          style={{
            position: "absolute",
            top: title ? 70 : 20,
            right: 28,
            backgroundColor: "rgba(248, 245, 238, 0.96)",
            border: `4px solid ${stampColor}`,
            color: stampColor,
            fontFamily: FONTS.sans,
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "6px 18px",
            borderRadius: 6,
            transform: `rotate(-8deg) scale(${stampEntrance})`,
            transformOrigin: "center center",
            pointerEvents: "none",
            boxShadow: `4px 4px 0px ${COLORS.ink}, 0px 0px 12px rgba(232, 64, 42, 0.15)`,
            zIndex: 10,
          }}
        >
          {stamp}
        </div>
      )}
    </div>
  );
};
