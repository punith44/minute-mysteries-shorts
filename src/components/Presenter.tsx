import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type PresenterPose = "pointing" | "gesturing" | "shocked";

interface PresenterProps {
  pose?: PresenterPose;
  x?: number;        // horizontal offset (0 = standard bottom right)
  y?: number;        // vertical offset
  scale?: number;    // size multiplier
  flip?: boolean;    // mirror horizontally
}

export const Presenter: React.FC<PresenterProps> = ({
  pose = "pointing",
  x = 0,
  y = 0,
  scale = 1.0,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth entrance spring
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Natural subtle breathing bob (approx 3 second cycle)
  const breath = Math.sin((frame / fps) * Math.PI * 0.7) * 6;

  // Subtle conversational hand/head gesture sway
  const gestureBob = Math.sin((frame / fps) * Math.PI * 1.4) * 4;

  const translateY = interpolate(enterSpring, [0, 1], [350, 0]) + breath + gestureBob + y;

  const imageSrc =
    pose === "gesturing"
      ? staticFile("presenter_gesturing.png")
      : pose === "shocked"
      ? staticFile("presenter_shocked.png")
      : staticFile("presenter_pointing.png");

  return (
    <div
      style={{
        position: "absolute",
        bottom: -20,
        right: 10 + x,
        width: 620 * scale,
        height: 720 * scale,
        transform: `translateY(${translateY}px) scaleX(${flip ? -1 : 1})`,
        transformOrigin: "bottom center",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <Img
        src={imageSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "bottom right",
        }}
      />
    </div>
  );
};
