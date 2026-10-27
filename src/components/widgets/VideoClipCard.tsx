import React from "react";
import { OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { CardContainer } from "../CardContainer";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import type { WidgetSpec } from "../../schema/reelSchema";

type VideoClipSpec = Extract<WidgetSpec, { type: "video_clip" }>;

interface VideoClipCardProps {
  spec: VideoClipSpec;
  currentTimeSec: number;
  springOvershoot?: number;
}

/**
 * High-Octane Live Video / B-Roll Player Card
 * Renders real MP4 footage inside a technical telemetry HUD frame with:
 * - Live animated telemetry overlay (speed, gear, heart-rate, G-force)
 * - Pulsing "REC" indicator and running mil-spec timecode
 * - Cyan/Red telemetry crosshairs and active radar sweep
 */
export const VideoClipCard: React.FC<VideoClipCardProps> = ({
  spec,
  currentTimeSec,
  springOvershoot = 0.45,
}) => {
  const { fps } = useVideoConfig();
  const enterAt = spec.enterAt ?? 0.12;
  const isDark = (spec.theme ?? "dark") === "dark";

  const videoSrc = spec.src.startsWith("http")
    ? spec.src
    : staticFile(spec.src);

  const startFromFrames = Math.round((spec.startFromSec ?? 0) * fps);

  // Live telemetry micro-fluctuations (keeps HUD alive and breathing)
  const speedPulse = Math.round(
    320 + Math.sin(currentTimeSec * 5.2) * 8 + Math.cos(currentTimeSec * 11) * 3
  );
  const heartRatePulse = Math.round(168 + Math.sin(currentTimeSec * 3.8) * 5);
  const gForcePulse = (3.8 + Math.sin(currentTimeSec * 4.4) * 0.4).toFixed(1);

  // Running military timecode
  const minutes = Math.floor(currentTimeSec / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(currentTimeSec % 60)
    .toString()
    .padStart(2, "0");
  const frames = Math.floor((currentTimeSec * fps) % fps)
    .toString()
    .padStart(2, "0");

  const scanlineY = ((currentTimeSec * 240) % 520).toFixed(1);

  return (
    <CardContainer
      theme={spec.theme ?? "dark"}
      windowTitle={spec.windowTitle ?? "telemetry.onboard.live_cam"}
      enterAt={enterAt}
      tilt={spec.tilt ?? 0}
      currentTimeSec={currentTimeSec}
      springOvershoot={springOvershoot}
      height={680}
      headerRight={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(232, 64, 42, 0.18)",
            border: "1px solid rgba(232, 64, 42, 0.5)",
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: COLORS.signalRed,
              boxShadow: "0 0 10px #E8402A",
              animation: "none",
              opacity: Math.sin(currentTimeSec * 7) > 0 ? 1 : 0.25,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 16,
              fontWeight: 800,
              color: COLORS.signalRed,
              letterSpacing: "0.08em",
            }}
          >
            LIVE REC
          </span>
        </div>
      }
      footerLeft={spec.footerLeft ?? `CH-01 // TC ${minutes}:${seconds}:${frames}`}
      footerRight={spec.footerRight ?? (spec.caption ?? "1080P · 60FPS TELEMETRY")}
    >
      <div
        style={{
          width: "100%",
          height: 520,
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#0B0E14",
          border: isDark
            ? "1.5px solid rgba(255, 255, 255, 0.12)"
            : "2.5px solid #111111",
        }}
      >
        {/* Real MP4 Video Layer with Continuous Ken Burns Zoom/Pan */}
        <OffthreadVideo
          src={videoSrc}
          startFrom={startFromFrames}
          playbackRate={spec.playbackRate ?? 1.0}
          muted={spec.muted ?? true}
          volume={spec.volume ?? 0.8}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${(1.03 + Math.min(currentTimeSec * 0.015, 0.14)).toFixed(3)}) translate(${(Math.sin(currentTimeSec * 0.9) * 8).toFixed(1)}px, ${(Math.cos(currentTimeSec * 0.7) * 5).toFixed(1)}px)`,
            filter: "contrast(1.08) brightness(0.96) saturate(1.15)",
          }}
        />

        {/* Ambient CRT Scanline Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none",
            zIndex: 10,
            opacity: 0.65,
          }}
        />

        {/* Moving Laser Scanline Sweep */}
        <div
          style={{
            position: "absolute",
            top: `${scanlineY}px`,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #00D2FF 30%, #FFFFFF 50%, #00D2FF 70%, transparent)",
            boxShadow: "0 0 12px #00D2FF",
            pointerEvents: "none",
            zIndex: 12,
            opacity: 0.85,
          }}
        />

        {/* Corner HUD Reticles */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontFamily: FONTS.mono,
            fontSize: 20,
            fontWeight: 800,
            color: "#FFFFFF",
            textShadow: "0 2px 8px rgba(0,0,0,0.85)",
            zIndex: 15,
          }}
        >
          <div style={{ color: "#00D2FF", fontSize: 16, letterSpacing: "0.06em" }}>
            ONBOARD SENSORS
          </div>
          <div>
            SPEED: <span style={{ color: "#FFE600" }}>{spec.overlayTelemetry?.speed ?? `${speedPulse} KM/H`}</span>
          </div>
          <div>
            GEAR: <span style={{ color: "#FFFFFF" }}>{spec.overlayTelemetry?.gear ?? "7"}</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontFamily: FONTS.mono,
            fontSize: 20,
            fontWeight: 800,
            color: "#FFFFFF",
            textShadow: "0 2px 8px rgba(0,0,0,0.85)",
            zIndex: 15,
          }}
        >
          <div style={{ color: COLORS.signalRed, fontSize: 16, letterSpacing: "0.06em" }}>
            DRIVER VITALS
          </div>
          <div>
            HEART: <span style={{ color: "#FF4D4D" }}>{spec.overlayTelemetry?.heartRate ?? `${heartRatePulse} BPM`}</span>
          </div>
          <div>
            G-FORCE: <span style={{ color: "#00D2FF" }}>{spec.overlayTelemetry?.gForce ?? `+${gForcePulse} G`}</span>
          </div>
        </div>

        {/* Bottom Banner Tag */}
        {spec.caption && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 16,
              right: 16,
              backgroundColor: "rgba(11, 14, 20, 0.78)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 8,
              padding: "6px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: FONTS.mono,
              fontSize: 18,
              color: "#E2E8F0",
              zIndex: 15,
            }}
          >
            <span style={{ fontWeight: 700, color: "#FFE600" }}>
              {spec.caption}
            </span>
            <span style={{ color: "#94A3B8" }}>
              TEMP: <strong style={{ color: COLORS.signalRed }}>{spec.overlayTelemetry?.heatTemp ?? "122°F"}</strong>
            </span>
          </div>
        )}
      </div>
    </CardContainer>
  );
};
