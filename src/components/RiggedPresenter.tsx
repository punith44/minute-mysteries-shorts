import React from "react";
import { Img, staticFile } from "remotion";
import { clamp, evaluateSpring } from "../engine/motionPhysics";
import type { PresenterCharacter, PresenterGesture } from "../schema/reelSchema";

interface RiggedPresenterProps {
  character?: PresenterCharacter;
  gesture?: PresenterGesture;
  eyeGlanceAtCard?: boolean;
  speakingWindow?: [number, number];
  currentTimeSec: number;
  sceneDurationSec: number;
  beatTriggerTimeSec?: number;
  scale?: number;
  xOffset?: number;
  springOvershoot?: number;
}

/**
 * Rigged Presenter Component
 * - Default ("png_cutout"): Uses the 4 authentic 3D-shaded reference presenter cutouts
 *   (presenter_pointing.png, presenter_gesturing.png, presenter_shocked.png, presenter_celebrating.png)
 *   with dynamic speech-cadence bounce, beat pose-switch pop, and parallax motion.
 * - Also supports "bearded_human" (vector SVG rig) and "pip_mascot" (pixel mascot rig).
 */
export const RiggedPresenter: React.FC<RiggedPresenterProps> = ({
  character = "png_cutout",
  gesture = "point_up_left",
  eyeGlanceAtCard = true,
  speakingWindow,
  currentTimeSec,
  sceneDurationSec,
  beatTriggerTimeSec = 0,
  scale = 1.0,
  xOffset = 0,
  springOvershoot = 0.45,
}) => {
  if (character === "none") return null;

  const enterProgress = clamp(currentTimeSec / 0.5, 0, 1);
  const enterSpring = evaluateSpring(enterProgress, springOvershoot * 0.85);
  const enterTranslateY = (1 - enterSpring) * 260;

  // Speech state
  const [speakStart, speakEnd] = speakingWindow ?? [
    0.08,
    Math.max(0.5, sceneDurationSec - 0.3),
  ];
  const isSpeaking = currentTimeSec >= speakStart && currentTimeSec <= speakEnd;

  // Conversational speech-cadence bounce + natural breathing
  const breathY = Math.sin(currentTimeSec * 3.8) * 6;
  const speechBounceY = isSpeaking ? Math.sin(currentTimeSec * 15.5) * 4.5 : 0;
  const speechTiltDeg = isSpeaking ? Math.sin(currentTimeSec * 7.5) * 1.4 : 0;

  // Micro-pop when switching poses on a 1.5s-2.5s beat
  const beatDt = currentTimeSec - beatTriggerTimeSec;
  const beatPop =
    beatTriggerTimeSec > 0.05 && beatDt >= 0 && beatDt < 0.35
      ? 1 + 0.055 * Math.sin((beatDt / 0.35) * Math.PI)
      : 1.0;

  if (character === "png_cutout") {
    const imgFile =
      gesture === "shocked_hands"
        ? staticFile("presenter_shocked.png")
        : gesture === "open_palm"
        ? staticFile("presenter_gesturing.png")
        : gesture === "thumbs_up"
        ? staticFile("presenter_celebrating.png")
        : staticFile("presenter_pointing.png");

    return (
      <div
        style={{
          position: "absolute",
          bottom: -16,
          right: 12 + xOffset,
          width: 635 * scale,
          height: 730 * scale,
          transform: `translateY(${(
            enterTranslateY +
            breathY +
            speechBounceY
          ).toFixed(1)}px) scale(${beatPop.toFixed(3)}) rotate(${speechTiltDeg.toFixed(
            2
          )}deg)`,
          transformOrigin: "bottom center",
          zIndex: 50,
          pointerEvents: "none",
          filter: "drop-shadow(0px 14px 28px rgba(17, 17, 17, 0.22))",
        }}
      >
        <Img
          src={imgFile}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom right",
            translate: "85.1px -39px"
          }}
          hidden
        />
      </div>
    );
  }

  // Vector / Mascot Rigs (3-state mouth sync)
  const mouthPhase = isSpeaking ? Math.floor((currentTimeSec * 14) % 3) : 0;
  const armWave = Math.sin(currentTimeSec * 4.5) * 6.5;
  const shouldGlance =
    eyeGlanceAtCard &&
    currentTimeSec > 0.2 &&
    currentTimeSec < sceneDurationSec - 0.3;
  const glanceX = shouldGlance ? -3.0 : 0;
  const glanceY = shouldGlance ? -2.4 : 0;
  const baseArmAngle =
    gesture === "point_up_left"
      ? -14
      : gesture === "open_palm"
      ? -24
      : gesture === "shocked_hands"
      ? -38
      : -8;
  const leftArmAngle = baseArmAngle + armWave;

  if (character === "pip_mascot") {
    const pipMouthHeight = mouthPhase === 0 ? 5 : mouthPhase === 1 ? 10 : 15;
    return (
      <div
        style={{
          position: "absolute",
          bottom: -18,
          right: 45 + xOffset,
          width: 560 * scale,
          height: 520 * scale,
          transform: `translateY(${(enterTranslateY + breathY).toFixed(1)}px)`,
          transformOrigin: "bottom center",
          zIndex: 50,
          pointerEvents: "none",
          filter:
            "drop-shadow(10px 10px 0px rgba(17, 17, 17, 0.18)) drop-shadow(0px 18px 26px rgba(17, 17, 17, 0.2))",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 220 205" fill="none">
          <g
            style={{
              transform: `rotate(${leftArmAngle.toFixed(1)}deg)`,
              transformOrigin: "58px 135px",
            }}
          >
            <rect
              x="18"
              y="96"
              width="44"
              height="22"
              rx="11"
              transform="rotate(-28 18 96)"
              fill="#F28A2E"
              stroke="#111111"
              strokeWidth="3.2"
            />
          </g>
          <rect
            x="158"
            y="122"
            width="40"
            height="22"
            rx="11"
            transform="rotate(25 158 122)"
            fill="#F28A2E"
            stroke="#111111"
            strokeWidth="3.2"
          />
          <rect x="58" y="36" width="18" height="18" rx="6" fill="#F28A2E" stroke="#111111" strokeWidth="3.2" />
          <rect x="144" y="36" width="18" height="18" rx="6" fill="#F28A2E" stroke="#111111" strokeWidth="3.2" />
          <rect x="46" y="48" width="128" height="158" rx="34" fill="#F28A2E" stroke="#111111" strokeWidth="3.4" />
          <rect x="68" y="134" width="84" height="72" rx="22" fill="#FBD3A7" stroke="#111111" strokeWidth="2.6" />
          <rect x="62" y="98" width="14" height="8" fill="#E8402A" opacity="0.65" />
          <rect x="144" y="98" width="14" height="8" fill="#E8402A" opacity="0.65" />
          <g>
            <rect x="76" y="76" width="18" height="18" rx="3" fill="#111111" />
            <rect x={80 + glanceX} y={79 + glanceY} width="5" height="5" fill="#FFFFFF" />
            <rect x="126" y="76" width="18" height="18" rx="3" fill="#111111" />
            <rect x={130 + glanceX} y={79 + glanceY} width="5" height="5" fill="#FFFFFF" />
          </g>
          <rect x="101" y="102" width="18" height={pipMouthHeight} rx="2" fill="#111111" />
        </svg>
      </div>
    );
  }

  const mouthHeight = mouthPhase === 0 ? 4 : mouthPhase === 1 ? 8.5 : 13;
  const mouthRx = mouthPhase === 0 ? 2 : mouthPhase === 1 ? 4 : 6;
  const showTongue = mouthPhase === 2;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -22,
        right: 28 + xOffset,
        width: 620 * scale,
        height: 595 * scale,
        transform: `translateY(${(enterTranslateY + breathY).toFixed(1)}px)`,
        transformOrigin: "bottom center",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 240 230"
        fill="none"
        style={{
          position: "relative",
          zIndex: 1,
          filter: "drop-shadow(0px 10px 16px rgba(17, 17, 17, 0.18))",
        }}
      >
        <g
          style={{
            transform: `rotate(${leftArmAngle.toFixed(1)}deg)`,
            transformOrigin: "78px 158px",
          }}
        >
          <path
            d="M35 108 C32 100, 41 96, 44 104 L47 114 L54 112 C58 112, 59 118, 55 121 L44 128 L33 122 Z"
            fill="#F1C9A5"
            stroke="#111111"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            d="M36 123 L68 175 L88 162 L52 115 Z"
            fill="#8C8275"
            stroke="#111111"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M62 148 C62 138, 178 138, 178 148 L192 230 L48 230 Z"
          fill="#8C8275"
          stroke="#111111"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M95 144 L145 144 L140 230 L100 230 Z"
          fill="#F7F5F0"
          stroke="#111111"
          strokeWidth="2.5"
        />
        <path
          d="M174 150 L202 215 L180 225 L162 168 Z"
          fill="#8C8275"
          stroke="#111111"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <rect x="106" y="122" width="28" height="26" rx="8" fill="#E6BC98" stroke="#111111" strokeWidth="2.6" />
        <rect x="76" y="38" width="88" height="94" rx="42" fill="#F1C9A5" stroke="#111111" strokeWidth="2.8" />
        <circle cx="74" cy="88" r="8" fill="#F1C9A5" stroke="#111111" strokeWidth="2.6" />
        <circle cx="166" cy="88" r="8" fill="#F1C9A5" stroke="#111111" strokeWidth="2.6" />
        <path
          d="M76 86 C76 118, 92 135, 120 135 C148 135, 164 118, 164 86 L156 86 C153 102, 142 108, 120 108 C98 108, 87 102, 84 86 Z"
          fill="#3B3026"
          stroke="#111111"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M96 98 C106 93, 134 93, 144 98 C138 105, 102 105, 96 98 Z"
          fill="#3B3026"
          stroke="#111111"
          strokeWidth="2.2"
        />
        <g>
          <rect x="109" y="101" width="22" height={mouthHeight} rx={mouthRx} fill="#111111" />
          {showTongue && (
            <path d="M113 110 Q120 106 127 110" stroke="#E8402A" strokeWidth="3.2" strokeLinecap="round" />
          )}
        </g>
        <g>
          <circle cx="102" cy="80" r="13.5" fill="#FFFFFF" fillOpacity="0.35" stroke="#111111" strokeWidth="2.8" />
          <circle cx="138" cy="80" r="13.5" fill="#FFFFFF" fillOpacity="0.35" stroke="#111111" strokeWidth="2.8" />
          <line x1="115.5" y1="80" x2="124.5" y2="80" stroke="#111111" strokeWidth="2.8" />
          <g transform={`translate(${glanceX}, ${glanceY})`}>
            <circle cx="102" cy="80" r="3.5" fill="#111111" />
            <circle cx="138" cy="80" r="3.5" fill="#111111" />
          </g>
        </g>
        <path d="M91 63 Q102 59 112 63" stroke="#27272A" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M128 63 Q138 59 149 63" stroke="#27272A" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M75 60 C75 30, 165 30, 165 60 Z" fill="#232326" stroke="#111111" strokeWidth="2.8" />
        <rect x="71" y="48" width="98" height="16" rx="6" fill="#2D2D30" stroke="#111111" strokeWidth="2.8" />
        <rect x="86" y="53" width="13" height="6.5" rx="1.5" fill="#E8402A" stroke="#111111" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
