import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme/colors";

interface HalftoneTransitionProps {
  /**
   * Relative frame in the transition sequence (e.g. 0 to duration)
   */
  startFrame: number;
  durationInFrames?: number;
  color?: string;
  variant?: "wipe" | "flash" | "radial";
}

export const HalftoneTransition: React.FC<HalftoneTransitionProps> = ({
  startFrame,
  durationInFrames = 24,
  color = COLORS.ink,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > durationInFrames) {
    return null;
  }

  // Phase 1 (0 -> duration/2): Expand dots to 100% fill
  // Phase 2 (duration/2 -> duration): Contract dots down to 0
  const progress = interpolate(
    relFrame,
    [0, durationInFrames * 0.45, durationInFrames * 0.55, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const dotSize = 48; // Spacing of dot matrix
  const maxRadius = dotSize * 0.85; // When dots overlap and cover screen
  const currentRadius = progress * maxRadius;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 999,
        pointerEvents: "none",
        opacity: progress > 0.01 ? 1 : 0,
      }}
    >
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <pattern
            id={`halftone-pattern-${startFrame}`}
            x="0"
            y="0"
            width={dotSize}
            height={dotSize}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={dotSize / 2}
              cy={dotSize / 2}
              r={currentRadius}
              fill={color}
            />
          </pattern>
        </defs>

        {/* Backdrop flash during mid-transition */}
        {progress > 0.85 && (
          <rect
            width="100%"
            height="100%"
            fill={color}
            opacity={interpolate(progress, [0.85, 1], [0, 0.4])}
          />
        )}

        <rect
          width="100%"
          height="100%"
          fill={`url(#halftone-pattern-${startFrame})`}
        />
      </svg>
    </div>
  );
};
