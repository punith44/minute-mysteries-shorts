import React from "react";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";
import { clamp, evaluateSpring } from "../engine/motionPhysics";

interface CardContainerProps {
  theme?: "paper" | "dark";
  windowTitle?: string;
  headerRight?: React.ReactNode;
  enterAt?: number;
  tilt?: number;
  width?: number;
  height?: number;
  footerLeft?: string;
  footerRight?: string;
  currentTimeSec: number;
  springOvershoot?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Reusable Hero Card Container with Halftone Dot-Matrix Shadow,
 * Hooke's Law Spring Entrance, and Paper/Dark Theme Variants.
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  theme = "paper",
  windowTitle,
  headerRight,
  enterAt = 0.12,
  tilt = 0,
  width = 948,
  height = 670,
  footerLeft,
  footerRight,
  currentTimeSec,
  springOvershoot = 0.45,
  style,
  children,
}) => {
  const dt = currentTimeSec - enterAt;
  const progress = clamp(dt / 0.55, 0, 1);
  const s = evaluateSpring(progress, springOvershoot);
  const opacity = clamp(dt / 0.08, 0, 1);
  
  // Continuous living motion: subtle 2.5D hover breathing after entrance
  const isSettled = progress >= 0.95;
  const ambientBob = isSettled ? Math.sin(currentTimeSec * 2.8) * 3.5 : 0;
  const ambientTilt = isSettled ? Math.sin(currentTimeSec * 2.2) * 0.45 : 0;

  const translateY = (1 - s) * 140 + ambientBob;
  const scale = 0.72 + 0.28 * s;
  const rotate = tilt * s + ambientTilt;

  const isDark = theme === "dark";
  const scanlineY = ((currentTimeSec * 140) % (height - 60)).toFixed(1);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`,
        opacity,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {/* Offset Halftone Dot-Matrix Drop Shadow (Matches Reference Videos) */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: "100%",
          height: "100%",
          borderRadius: 32,
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#halftone-dots)" />
        </svg>
      </div>

      {/* Main Card Surface */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: isDark ? "#141519" : "#FFFFFF",
          color: isDark ? "#FFFFFF" : COLORS.ink,
          borderRadius: 32,
          border: `3.5px solid ${COLORS.ink}`,
          boxShadow: "0 24px 48px -12px rgba(17, 17, 17, 0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Optional Window / Technical Header */}
        {(windowTitle || headerRight) && (
          <div
            style={{
              height: 58,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.04)"
                : "rgba(17, 17, 17, 0.03)",
              borderBottom: isDark
                ? "1.5px solid rgba(255, 255, 255, 0.1)"
                : "2px solid rgba(17, 17, 17, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {isDark && (
                <div style={{ display: "flex", gap: 9, marginRight: 8 }}>
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      backgroundColor: "#FF5F56",
                    }}
                  />
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      backgroundColor: "#FFBD2E",
                    }}
                  />
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      backgroundColor: "#27C93F",
                    }}
                  />
                </div>
              )}
              {windowTitle && (
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 21,
                    fontWeight: 600,
                    color: isDark ? "#9CA3AF" : "#374151",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {windowTitle.startsWith("//")
                    ? windowTitle
                    : `// ${windowTitle}`}
                </span>
              )}
            </div>

            {headerRight && <div>{headerRight}</div>}
          </div>
        )}

        {/* Card Content Body */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            padding: 32,
          }}
        >
          {isDark && (
            <div
              style={{
                position: "absolute",
                top: `${scanlineY}px`,
                left: 0,
                right: 0,
                height: 1.5,
                background:
                  "linear-gradient(90deg, transparent, rgba(0, 210, 255, 0.4) 30%, rgba(255, 255, 255, 0.7) 50%, rgba(0, 210, 255, 0.4) 70%, transparent)",
                boxShadow: "0 0 8px rgba(0, 210, 255, 0.5)",
                pointerEvents: "none",
                zIndex: 4,
                opacity: 0.55,
              }}
            />
          )}
          {children}
        </div>

        {/* Optional Footer Row */}
        {(footerLeft || footerRight) && (
          <div
            style={{
              height: 44,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(17, 17, 17, 0.02)",
              borderTop: isDark
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1.5px solid rgba(17, 17, 17, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              fontFamily: FONTS.mono,
              fontSize: 16,
              color: isDark ? "#64748B" : "#6B7280",
              letterSpacing: "0.02em",
              flexShrink: 0,
            }}
          >
            <span>{footerLeft ?? ""}</span>
            <span>{footerRight ?? ""}</span>
          </div>
        )}
      </div>
    </div>
  );
};
