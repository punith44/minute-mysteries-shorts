import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../theme/fonts";
import { GENRE_THEMES, type ReelGenre } from "../theme/genres";
import { HalftonePattern } from "../components/HalftoneShadow";
import { AmbientMotionLayer } from "../components/AmbientMotionLayer";
import { WordTimedCaption } from "../components/WordTimedCaption";
import { RiggedPresenter } from "../components/RiggedPresenter";
import { HalftoneWipe } from "../components/HalftoneWipe";
import { WidgetRegistry } from "../components/widgets/WidgetRegistry";
import {
  clamp,
  easeOutCubic,
  evaluateImpactShake,
  evaluateSpring,
  evaluateZoomKick,
} from "./motionPhysics";
import type {
  PresenterCharacter,
  SceneBeat,
  SceneConfig,
} from "../schema/reelSchema";

interface SceneRendererProps {
  scene: SceneConfig;
  genre?: ReelGenre;
  defaultCharacter?: PresenterCharacter;
  springOvershoot?: number;
}

/**
 * High-Velocity Scene Renderer (1080×1920 9:16 Vertical Stage)
 *
 * Supports Both Reference Layout Archetypes:
 * - Archetype A ("Poly Lab / MadeToScale / PromptMaster"):
 *   Top Typewriter Headline + Pill Badges, Center Full-Stage Physics/Flow Illustration,
 *   Bottom 1-to-3 Word Pill-Highlighted Captions (`caption.position: "bottom"`, `styleVariant: "poly_pill"`),
 *   and Gaussian Rack-Focus Blur transitions (`transitionOut: "blur_rack"`).
 * - Archetype B ("Adilet / Creator Host + Progress Dock"):
 *   Top Tag Row, Top 1-to-3 Word Kinetic Captions, Center Hero Card, Bottom-Right Presenter,
 *   Bottom-Left Persistent Progress Dock (`scene.progressDock`), and Mid-Reel Light-to-Dark Mode Shift (`scene.stageTheme`).
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  genre = "tech_explainer",
  defaultCharacter = "png_cutout",
  springOvershoot = 0.45,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;
  const keyWordLead = scene.caption.keyWordLead ?? 0.1;
  const baseTheme = GENRE_THEMES[genre];

  // Support per-scene Light <-> Dark stage flip (Reference Video-28363, Video-4247, Video-59353)
  const isDarkStage =
    scene.stageTheme === "dark" ||
    (!scene.stageTheme && genre === "dark_psychology");
  const stageBg = isDarkStage
    ? "#0A0D14"
    : scene.stageTheme === "light"
    ? "#EBE5D9"
    : baseTheme.background;
  const stageInk = isDarkStage ? "#F8FAFC" : "#161616";
  const stageInkMuted = isDarkStage ? "#94A3B8" : baseTheme.inkMuted;
  const stageAccent = isDarkStage ? "#38BDF8" : baseTheme.primaryAccent;

  // 1. Determine Active 1.5s-2.5s Visual Beat
  let activeBeat: SceneBeat | undefined;
  if (scene.beats && scene.beats.length > 0) {
    for (const b of scene.beats) {
      if (currentTimeSec >= b.at) {
        activeBeat = b;
      } else {
        break;
      }
    }
  }

  // 2. Collect Zoom Kick Triggers from Accent Words, Beats & Widget Events
  const zoomTriggers: Array<{ at: number; peakScale: number; duration?: number }> =
    [];
  for (const w of scene.caption.words) {
    const isAccent =
      w.accent || (w.text.startsWith("*") && w.text.endsWith("*"));
    if (w.zoomKick) {
      zoomTriggers.push({
        at: Math.max(0.02, w.at - (isAccent ? keyWordLead : 0)),
        peakScale: w.zoomKick,
      });
    } else if (isAccent) {
      zoomTriggers.push({
        at: Math.max(0.02, w.at - keyWordLead),
        peakScale: 1.045,
      });
    }
  }

  if (scene.beats) {
    for (const b of scene.beats) {
      if (b.at > 0.1) {
        zoomTriggers.push({
          at: b.at,
          peakScale: b.cameraZoom ?? 1.055,
          duration: 0.34,
        });
      }
    }
  }

  const shakeTriggers: Array<{ at: number; duration?: number; amplitude?: number }> =
    [];
  if (
    (scene.widget.type === "comparison_grid" ||
      scene.widget.type === "visual_scene") &&
    scene.widget.stamp
  ) {
    zoomTriggers.push({
      at: scene.widget.stamp.slamAt,
      peakScale: 1.065,
    });
    shakeTriggers.push({
      at: scene.widget.stamp.slamAt,
      duration: 0.28,
      amplitude: 12,
    });
  }
  if (scene.widget.type === "notification_stack" && scene.widget.calendarDay) {
    zoomTriggers.push({
      at: scene.widget.calendarDay.enterAt - keyWordLead,
      peakScale: 1.06,
    });
  }

  // Continuous Ken Burns slow camera drift + beat pan + zoom kicks
  const isPolyMode =
    scene.caption.position === "bottom" ||
    (scene.presenter.character ?? defaultCharacter) === "none";
  const kenBurnsScale =
    1.0 + (currentTimeSec / Math.max(1, scene.duration)) * (isPolyMode ? 0.028 : 0.042);
  const kenBurnsPanX =
    Math.sin(currentTimeSec * 1.4) * (isPolyMode ? 3.5 : 6) +
    (activeBeat?.cameraPanX ?? 0);
  const kenBurnsPanY =
    Math.cos(currentTimeSec * 1.1) * (isPolyMode ? 3.0 : 5) +
    (activeBeat?.cameraPanY ?? 0);

  const kickScale = evaluateZoomKick(currentTimeSec, zoomTriggers);
  const totalCamScale = kenBurnsScale * kickScale;
  const camShake = evaluateImpactShake(currentTimeSec, shakeTriggers);

  // Gaussian Rack-Focus Blur Transition (Matches Poly Lab Roadster t=14.4s, 17.1s, 34.8s, 52.5s)
  let rackBlurPx = 0;
  if (scene.transitionOut === "blur_rack") {
    if (currentTimeSec < 0.24) {
      rackBlurPx = (1 - currentTimeSec / 0.24) * 16;
    } else if (currentTimeSec > scene.duration - 0.26) {
      rackBlurPx =
        ((currentTimeSec - (scene.duration - 0.26)) / 0.26) * 18;
    }
  }

  // 3. Top-Right Counter Interpolation
  const counterCfg = scene.topRightCounter;
  let formattedCounterValue = counterCfg.staticValue ?? "";
  if (counterCfg.from !== undefined && counterCfg.to !== undefined) {
    const prog = easeOutCubic((currentTimeSec - 0.2) / (scene.duration * 0.65));
    const val = Math.round(
      counterCfg.from + (counterCfg.to - counterCfg.from) * prog
    );
    formattedCounterValue = `${counterCfg.prefix ?? ""}${val.toLocaleString()}${
      counterCfg.suffix ?? ""
    }`;
  }

  // 4. Optional Floating Speech-Bubble Callout
  const bubble = scene.calloutBubble;
  const bubbleStart = bubble?.enterAt ?? 0.2;
  const bubbleDt = currentTimeSec - bubbleStart;
  const bubbleSpring = evaluateSpring(
    clamp(bubbleDt / 0.42, 0, 1),
    springOvershoot
  );

  // 5. Optional Beat Banner
  const beatBannerText = activeBeat?.bannerText;
  const beatBannerDt = activeBeat ? currentTimeSec - activeBeat.at : -1;
  const beatBannerSpring = evaluateSpring(
    clamp(beatBannerDt / 0.38, 0, 1),
    springOvershoot + 0.15
  );

  const effectiveGesture =
    activeBeat?.presenterGesture ?? scene.presenter.gesture;
  const effectiveLabel = activeBeat?.subTagOverride ?? scene.label;
  const captionAtBottom = scene.caption.position === "bottom";

  // Typewriter reveal for Top Headline (Poly Lab style)
  const headlineSpec = scene.topHeadline;
  const headlineChars = headlineSpec
    ? headlineSpec.typewriter
      ? Math.max(
          1,
          Math.floor(
            clamp(currentTimeSec / 0.45, 0, 1) * headlineSpec.text.length
          )
        )
      : headlineSpec.text.length
    : 0;
  const visibleHeadline = headlineSpec
    ? headlineSpec.text.slice(0, headlineChars)
    : "";
  const showCursor =
    headlineSpec?.typewriter &&
    currentTimeSec < 1.1 &&
    Math.floor(currentTimeSec * 8) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: stageBg,
        color: stageInk,
        overflow: "hidden",
        fontFamily: FONTS.sans,
      }}
    >
      <HalftonePattern />

      {/* Reference Paper / Dark Grid Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isDarkStage
            ? `
              linear-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.04) 1px, transparent 1px),
              radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.11), transparent 65%)
            `
            : `
              radial-gradient(rgba(17, 17, 17, 0.075) 1.5px, transparent 1.5px),
              radial-gradient(circle at 50% 45%, transparent 58%, rgba(20, 18, 14, 0.08) 100%)
            `,
          backgroundSize: isDarkStage ? "48px 48px, 48px 48px, 100% 100%" : "14px 14px, 100% 100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Dynamic Ambient B-Roll / Sunburst / Radar Layer */}
      {!isPolyMode && (
        <AmbientMotionLayer
          effect={scene.ambientEffect ?? baseTheme.ambientEffect}
          currentTimeSec={currentTimeSec}
          accentColor={stageAccent}
          inkColor={stageInk}
        />
      )}

      {/* Left & Right Subtle Halftone Edge Borders (Editorial Mode) */}
      {!isPolyMode && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 32,
              height: "100%",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <svg width="100%" height="100%">
              <rect width="100%" height="100%" fill="url(#halftone-dots)" opacity="0.35" />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 32,
              height: "100%",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <svg width="100%" height="100%">
              <rect width="100%" height="100%" fill="url(#halftone-dots)" opacity="0.35" />
            </svg>
          </div>
        </>
      )}

      {/* CAMERA STAGE */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformOrigin: "center center",
          transform: `translate(${(camShake.x + kenBurnsPanX).toFixed(1)}px, ${(
            camShake.y + kenBurnsPanY
          ).toFixed(1)}px) scale(${totalCamScale.toFixed(
            4
          )}) rotate(${camShake.rot.toFixed(2)}deg)`,
          filter:
            rackBlurPx > 0.2 ? `blur(${rackBlurPx.toFixed(1)}px)` : undefined,
        }}
      >
        {/* 1A. TOP TAG ROW (Shown only in Editorial Mode, hidden in Poly Lab full-stage mode) */}
        {!headlineSpec && !isPolyMode && (
          <div
            style={{
              position: "absolute",
              top: 68,
              left: 68,
              right: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: FONTS.mono,
              fontSize: 30,
              letterSpacing: "-0.02em",
              color: stageInkMuted,
              zIndex: 20,
            }}
          >
            <span>
              // {scene.number} ·{" "}
              <strong style={{ color: stageInk, fontWeight: 700 }}>
                {effectiveLabel}
              </strong>
            </span>
            <span style={{ fontWeight: 600 }}>
              {counterCfg.label}{" "}
              <strong style={{ color: stageAccent, fontWeight: 800 }}>
                {formattedCounterValue}
              </strong>
            </span>
          </div>
        )}

        {/* 1B. POLY LAB / EDITORIAL TOP HEADLINE + PILL BADGES */}
        {headlineSpec && (
          <div
            style={{
              position: "absolute",
              top: headlineSpec.align === "left" ? 135 : 148,
              left: 84,
              right: 84,
              display: "flex",
              flexDirection: "column",
              alignItems:
                headlineSpec.align === "left" ? "flex-start" : "center",
              gap: 18,
              zIndex: 25,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: headlineSpec.align === "left" ? 96 : 64,
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                color: stageInk,
                textAlign: headlineSpec.align ?? "center",
                whiteSpace: "pre-line",
              }}
            >
              {headlineSpec.radialClockBurst && currentTimeSec < 1.8 && (
                <svg
                  width="240"
                  height="240"
                  viewBox="-120 -120 240 240"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-35%, -50%)",
                    pointerEvents: "none",
                  }}
                >
                  {Array.from({ length: 12 }).map((_, tickIdx) => {
                    const angleDeg = tickIdx * 30;
                    const burstProg = clamp(currentTimeSec / 1.4, 0, 1);
                    const r1 = 54 + burstProg * 28;
                    const r2 = 76 + burstProg * 42;
                    return (
                      <line
                        key={tickIdx}
                        x1={0}
                        y1={-r1}
                        x2={0}
                        y2={-r2}
                        stroke={stageInk}
                        strokeWidth={2.5}
                        opacity={(1 - burstProg) * 0.7}
                        transform={`rotate(${angleDeg})`}
                      />
                    );
                  })}
                </svg>
              )}
              {visibleHeadline}
              {showCursor && (
                <span style={{ fontWeight: 400, color: stageInk }}>|</span>
              )}
            </div>

            {headlineSpec.underlineBrush && (
              <div
                style={{
                  width: 195,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: "#ED8A33",
                  marginTop: -6,
                }}
              />
            )}

            {headlineSpec.pills && headlineSpec.pills.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 6,
                }}
              >
                {headlineSpec.pills.map((pill, pIdx) => {
                  const pDt = currentTimeSec - (pill.enterAt ?? 0.25 + pIdx * 0.35);
                  if (pDt < 0) return null;
                  const pSpring = evaluateSpring(clamp(pDt / 0.35, 0, 1), 0.4);
                  return (
                    <div
                      key={pIdx}
                      style={{
                        transform: `scale(${(0.75 + 0.25 * pSpring).toFixed(3)})`,
                        backgroundColor: pill.filled
                          ? pill.fillColor ?? "#ED8A33"
                          : "#FFFFFF",
                        color: "#161616",
                        border: "2.5px solid #161616",
                        borderRadius: 999,
                        padding: "6px 26px",
                        fontFamily: FONTS.display,
                        fontWeight: 800,
                        fontSize: 28,
                        letterSpacing: "0.02em",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                      }}
                    >
                      {pill.text}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. DYNAMIC 1-TO-3 WORD CAPTION ZONE (Top OR Bottom Position) */}
        <div
          style={{
            position: "absolute",
            ...(captionAtBottom
              ? { bottom: 175, left: 68, right: 68 }
              : { top: 154, left: 68, right: 68 }),
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <WordTimedCaption
            words={scene.caption.words}
            currentTimeSec={currentTimeSec}
            keyWordLead={keyWordLead}
            springOvershoot={springOvershoot}
            maxWordsPerChunk={scene.caption.maxWordsPerChunk ?? 3}
            styleVariant={
              scene.caption.styleVariant ??
              (captionAtBottom ? "poly_pill" : "editorial_kinetic")
            }
            activeHighlightColor={
              scene.caption.activeHighlightColor ?? stageAccent
            }
            ghostUnrevealed={scene.caption.ghostUnrevealed ?? true}
            inkColor={stageInk}
            centerAlign={captionAtBottom}
          />
        </div>

        {/* 3A. OPTIONAL BEAT IMPACT BANNER */}
        {beatBannerText && beatBannerDt >= 0 && !captionAtBottom && (
          <div
            style={{
              position: "absolute",
              top: 375,
              left: 68,
              right: 68,
              display: "flex",
              justifyContent: "center",
              zIndex: 38,
              transform: `scale(${(0.7 + 0.3 * beatBannerSpring).toFixed(3)})`,
              opacity: clamp(beatBannerDt / 0.06, 0, 1),
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: 64,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: stageInk,
                textShadow: "6px 6px 0px rgba(17, 17, 17, 0.16)",
                display: "flex",
                gap: 16,
              }}
            >
              {activeBeat?.bannerAccentWord && (
                <span
                  style={{
                    color: stageAccent,
                    borderBottom: `6px solid ${stageAccent}`,
                  }}
                >
                  {activeBeat.bannerAccentWord}
                </span>
              )}
              <span>{beatBannerText}</span>
            </div>
          </div>
        )}

        {/* 3B. OPTIONAL FLOATING SPEECH-BUBBLE CALLOUT */}
        {bubble && bubbleDt >= 0 && !beatBannerText && (
          <div
            style={{
              position: "absolute",
              top: 390,
              left: 88,
              zIndex: 35,
              backgroundColor: "#FFFFFF",
              color: "#111111",
              borderRadius: 28,
              padding: "20px 32px",
              border: "3.5px solid #111111",
              boxShadow: "10px 12px 0px rgba(17, 17, 17, 0.18)",
              transform: `scale(${(0.65 + 0.35 * bubbleSpring).toFixed(
                3
              )}) rotate(-1.5deg)`,
              opacity: clamp(bubbleDt / 0.08, 0, 1),
              minWidth: 520,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                left: 24,
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontFamily: FONTS.mono,
                fontSize: 20,
                fontWeight: 800,
                padding: "4px 16px",
                borderRadius: 10,
                letterSpacing: "0.06em",
              }}
            >
              {bubble.tag}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
              }}
            >
              <div>
                {bubble.sublabel && (
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 18,
                      color: "#71717A",
                      marginBottom: 2,
                    }}
                  >
                    {bubble.sublabel}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 30,
                    fontWeight: 800,
                    color: "#111111",
                  }}
                >
                  {bubble.text}
                </div>
              </div>
              {bubble.icon && (
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 900,
                    color: "#D4D4D8",
                  }}
                >
                  {bubble.icon}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 3C. OPTIONAL POLY LAB FOLLOW TOAST (Matches Leaning Tower of Pisa t=24s) */}
        {scene.followToast &&
          currentTimeSec >= scene.followToast.enterAt &&
          currentTimeSec <= (scene.followToast.exitAt ?? scene.duration - 0.2) && (
            <div
              style={{
                position: "absolute",
                top: 390,
                left: 68,
                right: 68,
                zIndex: 45,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {(() => {
                const tToast = currentTimeSec - scene.followToast.enterAt;
                const toastSpring = evaluateSpring(
                  clamp(tToast / 0.38, 0, 1),
                  0.45
                );
                return (
                  <div
                    style={{
                      width: 890,
                      backgroundColor: "#FBF8F1",
                      border: "3px solid #1E2022",
                      borderRadius: 28,
                      padding: "24px 34px",
                      display: "flex",
                      alignItems: "center",
                      gap: 28,
                      boxShadow: "0 18px 36px rgba(0, 0, 0, 0.22)",
                      transform: `scale(${(0.75 + 0.25 * toastSpring).toFixed(3)})`,
                      opacity: clamp(tToast / 0.08, 0, 1),
                      position: "relative",
                    }}
                  >
                    {/* Red 3D 'P' Block Logo */}
                    <div
                      style={{
                        width: 78,
                        height: 78,
                        borderRadius: 18,
                        backgroundColor: "#A93226",
                        border: "2.5px solid #1E2022",
                        boxShadow: "4px 6px 0px #5B1912",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontFamily: FONTS.display,
                        fontWeight: 900,
                        fontSize: 46,
                        flexShrink: 0,
                      }}
                    >
                      P
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div
                        style={{
                          fontFamily: FONTS.sans,
                          fontWeight: 800,
                          fontSize: 34,
                          color: "#161616",
                        }}
                      >
                        {scene.followToast.title ?? "Want to see more videos like this?"}
                      </div>
                      <div
                        style={{
                          fontFamily: FONTS.sans,
                          fontWeight: 600,
                          fontSize: 30,
                          color: "#3F3F46",
                        }}
                      >
                        {scene.followToast.subtitle ? (
                          scene.followToast.subtitle
                        ) : (
                          <>
                            Please hit{" "}
                            <strong style={{ color: "#ED8A33", fontWeight: 900 }}>
                              FOLLOW
                            </strong>
                            , it really helps us
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 18,
                        right: 24,
                        fontSize: 22,
                        color: "#71717A",
                        fontWeight: 700,
                      }}
                    >
                      ✕
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        {/* 4. HERO WIDGET ZONE */}
        <div
          style={{
            position: "absolute",
            top: captionAtBottom
              ? 355
              : bubble || beatBannerText
              ? 520
              : 455,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <WidgetRegistry
            widget={scene.widget}
            currentTimeSec={currentTimeSec}
            springOvershoot={springOvershoot}
          />
        </div>

        {/* 5A. PERSISTENT BOTTOM-LEFT PROGRESS DOCK (Matches Video-28363 / Video-59353) */}
        {scene.progressDock && (
          <div
            style={{
              position: "absolute",
              bottom: 110,
              left: 56,
              width: 450,
              backgroundColor: isDarkStage
                ? "rgba(15, 23, 42, 0.9)"
                : "#FFFFFF",
              border: isDarkStage
                ? "2px solid rgba(56, 189, 248, 0.35)"
                : "2.5px solid #111111",
              borderRadius: 22,
              padding: "16px 20px",
              boxShadow: isDarkStage
                ? "0 12px 30px rgba(0, 0, 0, 0.5)"
                : "8px 10px 0px rgba(17, 17, 17, 0.14)",
              zIndex: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: FONTS.mono,
                fontSize: 18,
                fontWeight: 700,
                color: stageInkMuted,
                marginBottom: 12,
              }}
            >
              <span>{scene.progressDock.title}</span>
              <span style={{ color: stageAccent, fontWeight: 800 }}>
                {scene.progressDock.progressText}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(
                  3,
                  scene.progressDock.steps.length
                )}, 1fr)`,
                gap: 8,
              }}
            >
              {scene.progressDock.steps.map((stepName, sIdx) => {
                const isCompletedOrActive =
                  sIdx + 1 <= scene.progressDock!.activeStepIndex;
                return (
                  <div
                    key={sIdx}
                    style={{
                      backgroundColor: isCompletedOrActive
                        ? isDarkStage
                          ? "#1E293B"
                          : "#111111"
                        : isDarkStage
                        ? "rgba(255,255,255,0.04)"
                        : "#F4F4F5",
                      color: isCompletedOrActive
                        ? "#FFFFFF"
                        : stageInkMuted,
                      border:
                        sIdx + 1 === scene.progressDock!.activeStepIndex
                          ? `2px solid ${stageAccent}`
                          : "1px solid transparent",
                      borderRadius: 10,
                      padding: "8px 10px",
                      fontFamily: FONTS.mono,
                      fontSize: 15,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {isCompletedOrActive ? stepName : `0${sIdx + 1} · ?`}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5B. BOTTOM RIGGED PRESENTER ZONE */}
        <RiggedPresenter
          character={scene.presenter.character ?? defaultCharacter}
          gesture={effectiveGesture}
          eyeGlanceAtCard={scene.presenter.eyeGlanceAtCard ?? true}
          speakingWindow={scene.presenter.speakingWindow}
          currentTimeSec={currentTimeSec}
          sceneDurationSec={scene.duration}
          beatTriggerTimeSec={activeBeat?.at ?? 0}
          scale={scene.presenter.scale ?? 1.0}
          xOffset={scene.presenter.xOffset ?? 0}
          springOvershoot={springOvershoot}
        />
      </div>

      {/* 6. SIGNATURE RADIAL HALFTONE DOT WIPE OUT */}
      {scene.transitionOut === "halftone_wipe" && (
        <HalftoneWipe
          currentTimeSec={currentTimeSec}
          sceneDurationSec={scene.duration}
        />
      )}
    </AbsoluteFill>
  );
};
