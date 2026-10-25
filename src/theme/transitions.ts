import { spring, interpolate } from "remotion";

/**
 * Reusable Spring configuration presets for crisp, tactile motion.
 */
export const SPRING_PRESETS = {
  // Snappy entrance with minimal overshoot (good for cards & stamps)
  snappy: { damping: 14, mass: 0.6, stiffness: 140 },
  // Bouncy entrance with expressive settle (good for illustrations & badges)
  bouncy: { damping: 10, mass: 0.8, stiffness: 110 },
  // Heavy, mechanical punch (good for dials & heavy counters)
  heavy: { damping: 18, mass: 1.2, stiffness: 90 },
  // Gentle breath or drift
  gentle: { damping: 20, mass: 1.0, stiffness: 60 },
};

export const getSpringValue = ({
  frame,
  fps,
  delay = 0,
  preset = "snappy",
  from = 0,
  to = 1,
}: {
  frame: number;
  fps: number;
  delay?: number;
  preset?: keyof typeof SPRING_PRESETS;
  from?: number;
  to?: number;
}) => {
  const spr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_PRESETS[preset],
  });
  return interpolate(spr, [0, 1], [from, to]);
};
