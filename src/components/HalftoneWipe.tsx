import React from "react";
import { clamp } from "../engine/motionPhysics";

interface HalftoneWipeProps {
  currentTimeSec: number;
  sceneDurationSec: number;
  wipeDurationSec?: number;
  color?: string;
}

/**
 * Signature Radial Halftone Dot Wipe Transition
 * Expands a radial wave of halftone dots across the 1080×1920 stage
 * during the final `wipeDurationSec` (default 0.42s) of a scene.
 */
export const HalftoneWipe: React.FC<HalftoneWipeProps> = ({
  currentTimeSec,
  sceneDurationSec,
  wipeDurationSec = 0.42,
  color = "#111111",
}) => {
  const triggerStart = sceneDurationSec - wipeDurationSec;
  if (currentTimeSec < triggerStart) {
    return null;
  }

  const wipeProgress = clamp((currentTimeSec - triggerStart) / wipeDurationSec, 0, 1);
  const spacing = 54;
  const cols = Math.ceil(1080 / spacing) + 1;
  const rows = Math.ceil(1920 / spacing) + 1;
  const centerX = 540;
  const centerY = 960;
  const maxDist = Math.hypot(centerX, centerY);

  const circles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * spacing;
      const y = r * spacing;
      const distRatio = Math.hypot(x - centerX, y - centerY) / maxDist;
      const localProgress = clamp(wipeProgress * 1.45 - distRatio * 0.45, 0, 1);
      if (localProgress > 0.01) {
        const radius = localProgress * (spacing * 0.78);
        circles.push(
          <circle key={`${r}-${c}`} cx={x} cy={y} r={radius.toFixed(1)} fill={color} />
        );
      }
    }
  }

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 999,
        pointerEvents: "none",
      }}
    >
      {circles}
    </svg>
  );
};
