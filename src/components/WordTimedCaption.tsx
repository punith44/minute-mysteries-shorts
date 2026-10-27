import React from "react";
import { COLORS } from "../theme/colors";
import { FONTS } from "../theme/fonts";
import { clamp, evaluateSpring } from "../engine/motionPhysics";
import type { WordToken } from "../schema/reelSchema";

interface WordTimedCaptionProps {
  words: WordToken[];
  currentTimeSec: number;
  keyWordLead?: number;
  springOvershoot?: number;
  maxWordsPerChunk?: number;
  styleVariant?: "editorial_kinetic" | "viral_bold" | "poly_pill";
  activeHighlightColor?: string;
  ghostUnrevealed?: boolean;
  inkColor?: string;
  centerAlign?: boolean;
}

interface WordChunk {
  tokens: Array<WordToken & { globalIdx: number; computedEnd: number }>;
  startSec: number;
  endSec: number;
}

/**
 * Dynamic Word-by-Word Highlighted Caption Engine (1 to 3 Words at a Time)
 *
 * Supports 3 Reference Benchmark Styles:
 * 1. "editorial_kinetic" (Video-1328, Video-28363, Video-4247, Video-59353):
 *    Space Grotesk 700 + Instrument Serif Italic (#E8402A or #38BDF8 on dark stage) + ghost lookahead.
 * 2. "poly_pill" (Poly Lab Tesla Roadster, Video-70654, Video-85034):
 *    1 to 3 words centered at the bottom; the currently spoken word pops inside a solid
 *    high-contrast rounded pill (#ED8A33 orange / #E8402A red) with bold white text.
 * 3. "viral_bold":
 *    Montserrat Black 900 with glowing stroke & neon active word highlight.
 */
export const WordTimedCaption: React.FC<WordTimedCaptionProps> = ({
  words,
  currentTimeSec,
  keyWordLead = 0.1,
  springOvershoot = 0.45,
  maxWordsPerChunk = 3,
  styleVariant = "editorial_kinetic",
  activeHighlightColor = COLORS.signalRed,
  ghostUnrevealed = true,
  inkColor = COLORS.ink,
  centerAlign = false,
}) => {
  if (!words || words.length === 0) return null;

  // 1. Enrich tokens with computed end times
  const enriched = words.map((w, idx) => {
    const nextAt = idx < words.length - 1 ? words[idx + 1].at : w.at + 0.55;
    const computedEnd = w.end ?? Math.max(w.at + 0.18, nextAt);
    return { ...w, globalIdx: idx, computedEnd };
  });

  // 2. Partition into 1-to-3 word high-velocity chunks
  const chunks: WordChunk[] = [];
  let currentBucket: typeof enriched = [];

  for (let i = 0; i < enriched.length; i++) {
    const tok = enriched[i];
    currentBucket.push(tok);

    const clean = tok.text.replace(/\*/g, "");
    const endsWithPunct = /[?!.:,;]$/.test(clean);
    const nextTok = enriched[i + 1];
    const longPauseAhead = nextTok ? nextTok.at - tok.computedEnd > 0.22 : true;

    if (
      currentBucket.length >= maxWordsPerChunk ||
      endsWithPunct ||
      longPauseAhead ||
      i === enriched.length - 1
    ) {
      const startSec = Math.max(0, currentBucket[0].at - keyWordLead);
      const lastTok = currentBucket[currentBucket.length - 1];
      const endSec = nextTok
        ? Math.max(lastTok.computedEnd, nextTok.at - 0.04)
        : lastTok.computedEnd + 0.8;

      chunks.push({
        tokens: currentBucket,
        startSec,
        endSec,
      });
      currentBucket = [];
    }
  }

  // 3. Find the active 1-to-3 word chunk for `currentTimeSec`
  let activeChunk = chunks[0];
  for (let c = 0; c < chunks.length; c++) {
    if (currentTimeSec >= chunks[c].startSec) {
      activeChunk = chunks[c];
    } else {
      break;
    }
  }

  const isViralBold = styleVariant === "viral_bold";
  const isPolyPill = styleVariant === "poly_pill";

  // Determine which single token inside `activeChunk` is the active spoken word right now
  let activeSpokenGlobalIdx = activeChunk.tokens[0].globalIdx;
  for (const tok of activeChunk.tokens) {
    const tStart = tok.accent ? Math.max(0, tok.at - keyWordLead * 0.5) : tok.at;
    if (currentTimeSec >= tStart - 0.04) {
      activeSpokenGlobalIdx = tok.globalIdx;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent:
          centerAlign || isViralBold || isPolyPill ? "center" : "flex-start",
        columnGap: isPolyPill ? 14 : 20,
        rowGap: 10,
        fontSize: isPolyPill ? 64 : isViralBold ? 84 : 82,
        lineHeight: 1.12,
        letterSpacing: isPolyPill
          ? "-0.025em"
          : isViralBold
          ? "-0.02em"
          : "-0.035em",
        fontFamily:
          isViralBold || isPolyPill ? FONTS.display : FONTS.sans,
        fontWeight: isViralBold || isPolyPill ? 900 : 700,
        color: inkColor,
        minHeight: isPolyPill ? 96 : 175,
      }}
    >
      {activeChunk.tokens.map((token) => {
        const isAsteriskWrapped =
          token.text.startsWith("*") && token.text.endsWith("*");
        const cleanText = isAsteriskWrapped
          ? token.text.slice(1, -1)
          : token.text;
        const isAccent = Boolean(token.accent || isAsteriskWrapped);

        const triggerTime = isAccent
          ? Math.max(0.01, token.at - keyWordLead)
          : token.at;
        const dt = currentTimeSec - triggerTime;

        const isCurrentlySpoken = token.globalIdx === activeSpokenGlobalIdx;

        // In "poly_pill" mode, all 1-to-3 words in the active chunk are visible immediately,
        // and the orange/red pill jumps from word to word as each word is spoken!
        if (isPolyPill) {
          const chunkDt = Math.max(0, currentTimeSec - activeChunk.startSec);
          const chunkEnter = evaluateSpring(clamp(chunkDt / 0.25, 0, 1), 0.35);
          const wordDt = Math.max(0, currentTimeSec - token.at);
          const pillPop = isCurrentlySpoken
            ? 1.0 + 0.06 * Math.sin(clamp(wordDt / 0.18, 0, 1) * Math.PI)
            : 1.0;

          const pillBg = token.highlightColor ?? activeHighlightColor ?? "#ED8A33";

          return (
            <span
              key={token.globalIdx}
              style={{
                display: "inline-block",
                transform: `translateY(${((1 - chunkEnter) * 14).toFixed(
                  1
                )}px) scale(${pillPop.toFixed(3)})`,
                backgroundColor: isCurrentlySpoken ? pillBg : "transparent",
                color: isCurrentlySpoken ? "#FFFFFF" : inkColor,
                padding: isCurrentlySpoken ? "4px 18px" : "4px 4px",
                borderRadius: 12,
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: 62,
                letterSpacing: "-0.02em",
                boxShadow: isCurrentlySpoken
                  ? "0 6px 18px rgba(0, 0, 0, 0.14)"
                  : "none",
              }}
            >
              {cleanText}
            </span>
          );
        }

        let opacity = 0;
        let translateY = 24;
        let scale = 0.78;

        if (dt < 0) {
          if (ghostUnrevealed) {
            opacity = 0.15;
            translateY = 4;
            scale = 0.96;
          } else {
            opacity = 0;
            translateY = 24;
            scale = 0.78;
          }
        } else {
          const progress = clamp(dt / 0.32, 0, 1);
          const s = evaluateSpring(
            progress,
            isAccent ? springOvershoot + 0.16 : springOvershoot * 0.65
          );
          opacity = clamp(dt / 0.06, ghostUnrevealed ? 0.15 : 0, 1);
          translateY = (1 - s) * 24;

          const activeBoost = isCurrentlySpoken ? 1.08 : 1.0;
          const baseScale = isAccent ? 0.75 + 0.3 * s : 0.88 + 0.12 * s;
          scale = baseScale * activeBoost;
        }

        const wordHighlightColor =
          token.highlightColor ?? activeHighlightColor;

        const wordColor =
          dt < 0
            ? inkColor
            : isAccent
            ? wordHighlightColor
            : isCurrentlySpoken && isViralBold
            ? "#FFFF00"
            : inkColor;

        return (
          <span
            key={token.globalIdx}
            style={{
              position: "relative",
              display: "inline-block",
              transformOrigin: "bottom center",
              transform: `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(
                3
              )})`,
              opacity,
              fontFamily:
                isAccent && !isViralBold
                  ? FONTS.serif
                  : isViralBold
                  ? FONTS.display
                  : FONTS.sans,
              fontStyle: isAccent && !isViralBold ? "italic" : "normal",
              fontWeight: isAccent && !isViralBold ? 400 : isViralBold ? 900 : 700,
              fontSize: isAccent && !isViralBold ? 102 : isViralBold ? 84 : 82,
              textTransform: isViralBold ? "uppercase" : "none",
              color: wordColor,
              padding: isAccent ? "0 6px" : "0 2px",
              textShadow: isViralBold
                ? "0 6px 0 #111111, 0 12px 28px rgba(0,0,0,0.45)"
                : isCurrentlySpoken && isAccent
                ? "0 6px 22px rgba(232, 64, 42, 0.22)"
                : "none",
              WebkitTextStroke: isViralBold ? "3px #111111" : undefined,
            }}
          >
            {cleanText}

            {/* Active spoken word kinetic underline bar */}
            {isCurrentlySpoken && dt >= 0 && (
              <span
                style={{
                  position: "absolute",
                  left: 4,
                  right: 4,
                  bottom: -6,
                  height: 6,
                  borderRadius: 4,
                  backgroundColor: wordHighlightColor,
                  opacity: 0.9,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
};
