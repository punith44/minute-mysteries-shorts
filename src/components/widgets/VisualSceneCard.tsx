import React from "react";
import { Img, staticFile } from "remotion";
import { CardContainer } from "../CardContainer";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { clamp, evaluateSpring } from "../../engine/motionPhysics";
import type { WidgetSpec } from "../../schema/reelSchema";

type VisualSceneSpec = Extract<WidgetSpec, { type: "visual_scene" }>;

interface VisualSceneCardProps {
  spec: VisualSceneSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * Script-Driven Visual Scene Card (Opus 5.5 + AI Scene Illustration Hybrid)
 *
 * Combines:
 * 1. Bespoke AI-generated scene illustration matching the exact spoken sentence
 * 2. Smooth 3D Ken Burns camera motion & depth grading
 * 3. Live frame-deterministic SVG/Canvas procedural animations synced to the script
 */
export const VisualSceneCard: React.FC<VisualSceneCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  const enterAt = spec.enterAt ?? 0.08;
  const isDark = (spec.theme ?? "dark") === "dark";
  const imgSrc = spec.imageSrc.startsWith("http")
    ? spec.imageSrc
    : staticFile(spec.imageSrc);

  // Smooth Ken Burns zoom & subtle pan
  const zoomScale = (1.03 + Math.min(currentTimeSec * 0.018, 0.14)).toFixed(3);
  const panX = (Math.sin(currentTimeSec * 0.75) * 10).toFixed(1);
  const panY = (Math.cos(currentTimeSec * 0.55) * 6).toFixed(1);

  // Optional rubber stamp slam
  const showStamp = spec.stamp && currentTimeSec >= spec.stamp.slamAt;
  const stampDt = spec.stamp ? currentTimeSec - spec.stamp.slamAt : -1;
  const stampProg = clamp(stampDt / 0.35, 0, 1);
  const stampSpring = evaluateSpring(stampProg, springOvershoot + 0.2);
  const stampProgress = 2.4 - 1.4 * stampSpring;

  return (
    <CardContainer
      theme={spec.theme ?? "dark"}
      windowTitle={spec.windowTitle ?? "historical.archive.visual"}
      enterAt={enterAt}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={1100}
      headerRight={
        spec.badgeText ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: isDark
                ? "rgba(56, 189, 248, 0.16)"
                : "rgba(232, 64, 42, 0.12)",
              border: isDark
                ? "1.5px solid rgba(56, 189, 248, 0.55)"
                : "1.5px solid rgba(232, 64, 42, 0.45)",
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: isDark ? "#38BDF8" : COLORS.signalRed,
                boxShadow: isDark ? "0 0 8px #38BDF8" : "0 0 8px #E8402A",
              }}
            />
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 15,
                fontWeight: 800,
                color: isDark ? "#38BDF8" : COLORS.signalRed,
                letterSpacing: "0.06em",
              }}
            >
              {spec.badgeText}
            </span>
          </div>
        ) : undefined
      }
      footerLeft={spec.footerLeft ?? "ARCHIVE VISUAL // SYNCED"}
      footerRight={spec.footerRight ?? "MINUTE MYSTERIES"}
    >
      <div
        style={{
          width: "100%",
          height: 935,
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#090D16",
          border: isDark
            ? "2px solid rgba(255, 255, 255, 0.15)"
            : "2.5px solid #141413",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* 1. Script-Accurate AI Scene Image with Ken Burns Camera Drift */}
        <Img
          src={imgSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
            filter: "contrast(1.06) saturate(1.1)",
          }}
        />

        {/* Subtle Cinematic Gradient Vignette for Text/HUD Legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,12,20,0.55) 0%, rgba(8,12,20,0.08) 38%, rgba(8,12,20,0.22) 68%, rgba(8,12,20,0.88) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* 2. Opus 5.5-Style Procedural SVG Overlay Animations */}
        <svg
          viewBox="0 0 800 935"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* OVERLAY 1: Live Electric Arcs & Water Ripples (Scene 1) */}
          {spec.overlayAnimation === "electric_arcs" && (
            <g>
              {[0, 1, 2].map((i) => {
                const phase = (currentTimeSec * 1.4 + i * 0.33) % 1;
                const rx = 60 + phase * 220;
                const ry = 22 + phase * 70;
                const alpha = Math.max(0, (1 - phase) * 0.75);
                return (
                  <ellipse
                    key={`ripple-${i}`}
                    cx={400}
                    cy={330}
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    opacity={alpha}
                  />
                );
              })}
              {/* Dynamic procedural lightning arcs */}
              {[0, 1, 2].map((boltIdx) => {
                const seed = Math.floor(currentTimeSec * 12) + boltIdx * 7;
                const yBase = 285 + boltIdx * 34;
                const points = Array.from({ length: 8 }, (_, k) => {
                  const x = 180 + k * 62;
                  const jitter =
                    k === 0 || k === 7
                      ? 0
                      : Math.sin(seed * 3.7 + k * 2.3) * 26;
                  return `${x},${(yBase + jitter).toFixed(1)}`;
                }).join(" ");
                return (
                  <polyline
                    key={`bolt-${boltIdx}`}
                    points={points}
                    fill="none"
                    stroke={boltIdx === 1 ? "#FDE047" : "#38BDF8"}
                    strokeWidth={boltIdx === 1 ? 3.5 : 2.5}
                    filter="url(#glow-cyan)"
                    opacity={0.85}
                  />
                );
              })}
            </g>
          )}

          {/* OVERLAY 2: Victorian Paid Spa Ticket / Ledger (Scene 2) */}
          {spec.overlayAnimation === "victorian_receipt" && (
            <g transform="translate(46, 36)">
              <rect
                x={0}
                y={0}
                width={310}
                height={104}
                rx={14}
                fill="rgba(20, 17, 13, 0.84)"
                stroke="#F59E0B"
                strokeWidth={2.5}
              />
              <text
                x={20}
                y={34}
                fill="#FDE68A"
                fontFamily={FONTS.mono}
                fontSize={15}
                fontWeight={800}
                letterSpacing="0.08em"
              >
                ROYAL ELECTRO-SPA · 1894
              </text>
              <text
                x={20}
                y={64}
                fill="#FFFFFF"
                fontFamily={FONTS.display}
                fontSize={24}
                fontWeight={900}
              >
                THE ELECTRIC BATH
              </text>
              <text
                x={20}
                y={88}
                fill="#34D399"
                fontFamily={FONTS.mono}
                fontSize={15}
                fontWeight={700}
              >
                ✓ ADMISSION PAID BY PATIENT
              </text>
            </g>
          )}

          {/* OVERLAY 3: 19th-to-20th Century Timeline Gauge (Scene 3) */}
          {spec.overlayAnimation === "era_timeline" && (
            <g transform="translate(50, 42)">
              <rect
                x={0}
                y={0}
                width={700}
                height={88}
                rx={16}
                fill="rgba(12, 16, 24, 0.82)"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={1.5}
              />
              <line
                x1={40}
                y1={52}
                x2={660}
                y2={52}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={6}
                strokeLinecap="round"
              />
              <line
                x1={40}
                y1={52}
                x2={40 + Math.min(1, currentTimeSec / 4.2) * 620}
                y2={52}
                stroke="#F59E0B"
                strokeWidth={6}
                strokeLinecap="round"
              />
              {[
                { x: 40, yr: "1880s" },
                { x: 245, yr: "1890s" },
                { x: 455, yr: "1900s" },
                { x: 660, yr: "1920s" },
              ].map((pt, idx) => {
                const active =
                  40 + Math.min(1, currentTimeSec / 4.2) * 620 >= pt.x;
                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={52}
                      r={active ? 10 : 6}
                      fill={active ? "#F59E0B" : "#475569"}
                      stroke="#FFF"
                      strokeWidth={2}
                    />
                    <text
                      x={pt.x}
                      y={30}
                      textAnchor="middle"
                      fill={active ? "#FDE68A" : "#94A3B8"}
                      fontFamily={FONTS.mono}
                      fontSize={16}
                      fontWeight={800}
                    >
                      {pt.yr}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* OVERLAY 4: Bio-Electric Nerve Pulses (Scene 4) */}
          {spec.overlayAnimation === "nerve_pulses" && (
            <g>
              {[0, 1, 2, 3].map((idx) => {
                const progress = (currentTimeSec * 0.9 + idx * 0.25) % 1;
                const r = 30 + progress * 170;
                return (
                  <circle
                    key={idx}
                    cx={400}
                    cy={255}
                    r={r}
                    fill="none"
                    stroke="#FDE047"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    opacity={Math.max(0, (1 - progress) * 0.7)}
                  />
                );
              })}
            </g>
          )}

          {/* OVERLAY 5: Tub Circuit Schematic (+ Anode / - Cathode) (Scene 5) */}
          {spec.overlayAnimation === "tub_circuit" && (
            <g>
              {/* Left Electrode Badge */}
              <rect
                x={36}
                y={195}
                width={150}
                height={54}
                rx={10}
                fill="rgba(232, 64, 42, 0.88)"
                stroke="#FFF"
                strokeWidth={2}
              />
              <text
                x={111}
                y={228}
                textAnchor="middle"
                fill="#FFF"
                fontFamily={FONTS.mono}
                fontSize={17}
                fontWeight={800}
              >
                + ANODE PLATE
              </text>

              {/* Right Electrode Badge */}
              <rect
                x={614}
                y={195}
                width={150}
                height={54}
                rx={10}
                fill="rgba(56, 189, 248, 0.88)"
                stroke="#FFF"
                strokeWidth={2}
              />
              <text
                x={689}
                y={228}
                textAnchor="middle"
                fill="#090D16"
                fontFamily={FONTS.mono}
                fontSize={17}
                fontWeight={800}
              >
                - CATHODE
              </text>

              {/* Animated Electron Particles Flowing Across Water */}
              {Array.from({ length: 7 }).map((_, i) => {
                const t = (currentTimeSec * 0.65 + i / 7) % 1;
                const cx = 200 + t * 400;
                const cy = 290 + Math.sin(t * Math.PI * 3 + i) * 24;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={7}
                    fill="#38BDF8"
                    filter="url(#glow-cyan)"
                  />
                );
              })}
            </g>
          )}

          {/* OVERLAY 6: Spiking Danger / Quackery Meter (Scene 6) */}
          {spec.overlayAnimation === "danger_meter" && (
            <g transform="translate(530, 32)">
              <rect
                x={0}
                y={0}
                width={230}
                height={125}
                rx={16}
                fill="rgba(15, 18, 28, 0.88)"
                stroke="#EF4444"
                strokeWidth={2.5}
              />
              <text
                x={115}
                y={28}
                textAnchor="middle"
                fill="#FCA5A5"
                fontFamily={FONTS.mono}
                fontSize={14}
                fontWeight={800}
              >
                SCIENTIFIC PROOF
              </text>
              {/* Gauge Arc */}
              <path
                d="M 45 100 A 70 70 0 0 1 185 100"
                fill="none"
                stroke="#334155"
                strokeWidth={12}
                strokeLinecap="round"
              />
              <path
                d="M 125 32 A 70 70 0 0 1 185 100"
                fill="none"
                stroke="#EF4444"
                strokeWidth={12}
                strokeLinecap="round"
              />
              {/* Animated Needle */}
              {(() => {
                const angleDeg =
                  -75 +
                  Math.min(1, currentTimeSec / 1.8) * 145 +
                  Math.sin(currentTimeSec * 14) * 6;
                const rad = (angleDeg * Math.PI) / 180;
                const nx = 115 + Math.sin(rad) * 58;
                const ny = 100 - Math.cos(rad) * 58;
                return (
                  <>
                    <line
                      x1={115}
                      y1={100}
                      x2={nx}
                      y2={ny}
                      stroke="#FDE047"
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                    <circle cx={115} cy={100} r={7} fill="#FFF" />
                  </>
                );
              })()}
            </g>
          )}

          {/* OVERLAY 7: Hype vs Science Curve (Scene 7) */}
          {spec.overlayAnimation === "miracle_hype" && (
            <g transform="translate(50, 34)">
              <rect
                x={0}
                y={0}
                width={350}
                height={118}
                rx={14}
                fill="rgba(15, 18, 28, 0.86)"
                stroke="#F59E0B"
                strokeWidth={2}
              />
              <text
                x={20}
                y={30}
                fill="#FDE68A"
                fontFamily={FONTS.mono}
                fontSize={14}
                fontWeight={800}
              >
                TECH HYPE vs REAL MEDICINE
              </text>
              <polyline
                points="20,95 90,42 155,34 220,75 320,98"
                fill="none"
                stroke="#EF4444"
                strokeWidth={4}
                strokeLinecap="round"
              />
              <text
                x={140}
                y={28}
                fill="#FCA5A5"
                fontFamily={FONTS.mono}
                fontSize={12}
                fontWeight={700}
              >
                &quot;MIRACLE CURE&quot; ILLUSION
              </text>
            </g>
          )}

          {/* OVERLAY 8: Live Modern Hospital ECG Waveform (Scene 8) */}
          {spec.overlayAnimation === "modern_ecg" && (
            <g>
              <rect
                x={415}
                y={30}
                width={345}
                height={95}
                rx={14}
                fill="rgba(6, 22, 30, 0.86)"
                stroke="#10B981"
                strokeWidth={2}
              />
              <text
                x={435}
                y={56}
                fill="#34D399"
                fontFamily={FONTS.mono}
                fontSize={14}
                fontWeight={800}
              >
                MODERN ICU · SAFETY ISOLATED
              </text>
              {(() => {
                const pts = Array.from({ length: 44 }, (_, i) => {
                  const x = 435 + i * 7.2;
                  const cycle = (i + Math.floor(currentTimeSec * 18)) % 14;
                  let yOffset = 0;
                  if (cycle === 5) yOffset = -8;
                  if (cycle === 6) yOffset = 10;
                  if (cycle === 7) yOffset = -28;
                  if (cycle === 8) yOffset = 16;
                  if (cycle === 10) yOffset = -6;
                  return `${x.toFixed(1)},${(94 + yOffset).toFixed(1)}`;
                }).join(" ");
                return (
                  <polyline
                    points={pts}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })()}
            </g>
          )}
        </svg>

        {/* 3. Bottom Narrative Context Banner Inside Visual Frame */}
        {(spec.headlineText || spec.subtext) && (
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 20,
              padding: "16px 22px",
              borderRadius: 16,
              backgroundColor: "rgba(10, 14, 23, 0.86)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              zIndex: 15,
            }}
          >
            {spec.headlineText && (
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {spec.headlineText}
              </div>
            )}
            {spec.subtext && (
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#38BDF8",
                  letterSpacing: "0.05em",
                }}
              >
                {spec.subtext}
              </div>
            )}
          </div>
        )}

        {/* 4. Optional Rubber Stamp Slam */}
        {showStamp && spec.stamp && (
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(-9deg) scale(${Math.max(
                0.1,
                stampProgress
              ).toFixed(3)})`,
              border: `6px solid ${spec.stamp.color ?? COLORS.signalRed}`,
              backgroundColor: "rgba(12, 14, 20, 0.90)",
              padding: "12px 32px",
              borderRadius: 14,
              boxShadow: "0 18px 40px rgba(0,0,0,0.65)",
              whiteSpace: "nowrap",
              zIndex: 25,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.display,
                fontSize: 46,
                fontWeight: 900,
                color: spec.stamp.color ?? COLORS.signalRed,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {spec.stamp.text}
            </span>
          </div>
        )}
      </div>
    </CardContainer>
  );
};
