import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";
import { SPRING_PRESETS } from "../theme/transitions";

interface KineticCaptionProps {
  text: string;
  subtext?: string;
  startFrame?: number;
  badge?: string;
  style?: React.CSSProperties;
}

/**
 * Renders bold, kinetic editorial captions.
 * Any word enclosed in asterisks (e.g. *UPSIDE DOWN*)
 * is automatically rendered in Instrument Serif, italic, and Signal Red.
 */
export const KineticCaption: React.FC<KineticCaptionProps> = ({
  text,
  subtext,
  startFrame = 0,
  badge,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);

  // Snappy card entrance
  const entrance = spring({
    frame: relFrame,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  const translateY = (1 - entrance) * 35;
  const opacity = Math.min(1, entrance * 1.5);

  // Parse text for *italic red emphasis*
  const renderFormattedText = (raw: string) => {
    const parts = raw.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const keyword = part.slice(1, -1);
        return (
          <span
            key={index}
            style={{
              fontFamily: FONTS.serif,
              fontStyle: "italic",
              fontWeight: 400,
              color: COLORS.signalRed,
              padding: "0 4px",
              margin: "0 4px",
              display: "inline-block",
              transform: "scale(1.08)",
            }}
          >
            {keyword}
          </span>
        );
      }
      return (
        <span
          key={index}
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 700,
            color: COLORS.ink,
          }}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: 940,
        margin: "0 auto",
        ...style,
      }}
    >
      {/* Optional Top Category Badge */}
      {badge && (
        <div
          style={{
            backgroundColor: COLORS.ink,
            color: COLORS.paper,
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "6px 18px",
            borderRadius: 4,
            marginBottom: 16,
            boxShadow: `4px 4px 0px ${COLORS.signalRed}`,
          }}
        >
          {badge}
        </div>
      )}

      {/* Main Kinetic Headline Card */}
      <div
        style={{
          backgroundColor: COLORS.paperCard,
          border: `3.5px solid ${COLORS.ink}`,
          borderRadius: 12,
          padding: "24px 36px",
          boxShadow: `8px 8px 0px ${COLORS.ink}`,
          fontSize: 48,
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {renderFormattedText(text)}

        {subtext && (
          <div
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 500,
              fontSize: 24,
              color: COLORS.inkMuted,
              marginTop: 14,
              lineHeight: 1.4,
              borderTop: `1.5px dashed ${COLORS.inkLight}`,
              paddingTop: 12,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
