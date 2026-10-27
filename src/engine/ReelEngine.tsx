import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { COLORS } from "../theme/colors";
import { SceneRenderer } from "./SceneRenderer";
import type { ReelConfig, SfxCue } from "../schema/reelSchema";

interface ReelEngineProps {
  config: ReelConfig;
  enableVoiceover?: boolean;
  enableSfx?: boolean;
  enableBackgroundMusic?: boolean;
}

const SFX_FILE_MAP: Record<SfxCue["type"], string> = {
  whoosh: "audio/whoosh.mp3",
  stamp: "audio/stamp.mp3",
  click: "audio/click.mp3",
  pop: "audio/pop.mp3",
  riser: "audio/riser.mp3",
  sub_impact: "audio/sub_impact.mp3",
  turbine: "audio/turbine.mp3",
  thruster: "audio/thruster.mp3",
  ding: "audio/ding.mp3",
};

/**
 * Master Topic-Agnostic Reel Engine
 * Automatically sequences scenes, calculates exact frame offsets from `duration` (in seconds),
 * binds -15 LUFS voiceovers, sidechain-ducked background music, and high-retention SFX cues.
 */
export const ReelEngine: React.FC<ReelEngineProps> = ({
  config,
  enableVoiceover = true,
  enableSfx = true,
  enableBackgroundMusic = true,
}) => {
  const { fps } = useVideoConfig();

  let runningFrameOffset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      {/* Master Sidechain-Ducked Background Soundtrack */}
      {enableBackgroundMusic && config.backgroundMusicSrc && (
        <Audio
          src={staticFile(config.backgroundMusicSrc)}
          volume={config.backgroundMusicVolume ?? 0.85}
        />
      )}

      {/* Master Continuous Voiceover (if provided for whole reel) */}
      {enableVoiceover && config.masterVoiceoverSrc && (
        <Audio src={staticFile(config.masterVoiceoverSrc)} volume={1.0} />
      )}

      {config.scenes.map((scene) => {
        const startFrame = runningFrameOffset;
        const durationInFrames = Math.round(scene.duration * fps);
        runningFrameOffset += durationInFrames;

        // Collect explicit SFX + automatic text-pop ticks on accent words & beat cuts
        const combinedSfx: SfxCue[] = [...(scene.sfx ?? [])];
        for (const w of scene.caption.words) {
          if (w.accent || (w.text.startsWith("*") && w.text.endsWith("*"))) {
            const lead = scene.caption.keyWordLead ?? 0.1;
            const popAt = Math.max(0.02, w.at - lead);
            combinedSfx.push({
              at: popAt,
              type: "pop",
              volume: 0.42,
              durationInFrames: 6,
            });
          }
        }
        if (scene.beats) {
          for (const b of scene.beats) {
            if (b.at > 0.2) {
              combinedSfx.push({
                at: b.at,
                type: "sub_impact",
                volume: 0.55,
                durationInFrames: 20,
              });
            }
          }
        }

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationInFrames}
            name={`${scene.number}_${scene.label}`}
          >
            <SceneRenderer
              scene={scene}
              genre={config.genre ?? "tech_explainer"}
              defaultCharacter={config.defaultCharacter ?? "png_cutout"}
              springOvershoot={config.springOvershoot ?? 0.45}
            />

            {/* Scene-Local Voiceover (-15.0 LUFS Broadcast Normalized) */}
            {enableVoiceover && !config.masterVoiceoverSrc && scene.voiceoverSrc && (
              <Audio src={staticFile(scene.voiceoverSrc)} volume={1.0} />
            )}

            {/* Scene-Local & Auto-Synced SFX Cues */}
            {enableSfx &&
              combinedSfx.map((cue, idx) => {
                const cueFrame = Math.max(0, Math.round(cue.at * fps));
                if (cueFrame >= durationInFrames) return null;
                return (
                  <Sequence
                    key={`sfx-${idx}`}
                    from={cueFrame}
                    durationInFrames={cue.durationInFrames ?? 30}
                  >
                    <Audio
                      src={staticFile(SFX_FILE_MAP[cue.type])}
                      volume={cue.volume ?? 0.72}
                    />
                  </Sequence>
                );
              })}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Helper to compute total duration in frames for any ReelConfig
 */
export function getReelDurationInFrames(config: ReelConfig): number {
  const fps = config.fps ?? 30;
  return config.scenes.reduce(
    (sum, s) => sum + Math.round(s.duration * fps),
    0
  );
}
