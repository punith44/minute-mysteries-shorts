import React from "react";
import { staticFile, Audio, Sequence } from "remotion";

/**
 * AudioLayer handles voiceover narration and crisp UI sound effects.
 * All sound files have been synthesized and verified in public/audio/!
 */

interface AudioLayerProps {
  hasVoiceover?: boolean;
  hasSfx?: boolean;
}

export const AudioLayer: React.FC<AudioLayerProps> = ({
  hasVoiceover = true,
  hasSfx = true,
}) => {
  return (
    <>
      {/* Scene-local narration prevents the master track drifting ahead of the visuals. */}
      {hasVoiceover && (
        <>
          <Audio src={staticFile("audio/scene1_narration.mp3")} volume={1.0} />
          <Sequence from={180}><Audio src={staticFile("audio/scene2_narration.mp3")} volume={1.0} /></Sequence>
          <Sequence from={420}><Audio src={staticFile("audio/scene3_narration.mp3")} volume={1.0} /></Sequence>
          <Sequence from={660}><Audio src={staticFile("audio/scene4_narration.mp3")} volume={1.0} /></Sequence>
          <Sequence from={930}><Audio src={staticFile("audio/scene5_narration.mp3")} volume={1.0} /></Sequence>
          <Sequence from={1200}><Audio src={staticFile("audio/scene6_narration.mp3")} volume={1.0} /></Sequence>
          <Sequence from={1470}><Audio src={staticFile("audio/scene7_narration.mp3")} volume={1.0} /></Sequence>
        </>
      )}

      {/* Synchronized Sound Effects */}
      {hasSfx && (
        <>
          {/* Scene 1: Opening Swoosh */}
          <Sequence from={5} durationInFrames={17}>
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.7} />
          </Sequence>

          {/* Scene 2: Gravity Stamp Drop */}
          <Sequence from={195} durationInFrames={10}>
            <Audio src={staticFile("audio/stamp.mp3")} volume={0.8} />
          </Sequence>
          <Sequence from={208} durationInFrames={5}>
            <Audio src={staticFile("audio/click.mp3")} volume={0.5} />
          </Sequence>

          {/* Scene 3: Halftone Transition Swoosh */}
          <Sequence from={420} durationInFrames={17}>
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.65} />
          </Sequence>
          <Sequence from={435} durationInFrames={12}>
            <Audio src={staticFile("audio/stamp.mp3")} volume={0.75} />
          </Sequence>

          {/* Scene 4: Dual Turbine Fans Whine & Spinup */}
          <Sequence from={660} durationInFrames={75}>
            <Audio src={staticFile("audio/turbine.mp3")} volume={0.65} />
          </Sequence>
          <Sequence from={690} durationInFrames={12}>
            <Audio src={staticFile("audio/stamp.mp3")} volume={0.8} />
          </Sequence>

          {/* Scene 5: SpaceX Cold-Gas Thruster Blast */}
          <Sequence from={930} durationInFrames={48}>
            <Audio src={staticFile("audio/thruster.mp3")} volume={0.85} />
          </Sequence>

          {/* Scene 6: Pothole Alert & Stamp */}
          <Sequence from={1200} durationInFrames={17}>
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
          </Sequence>
          <Sequence from={1220} durationInFrames={12}>
            <Audio src={staticFile("audio/stamp.mp3")} volume={0.85} />
          </Sequence>

          {/* Scene 7: Grand Finale Subscribe Bell Chime */}
          <Sequence from={1470} durationInFrames={17}>
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
          </Sequence>
          <Sequence from={1500} durationInFrames={36}>
            <Audio src={staticFile("audio/ding.mp3")} volume={0.9} />
          </Sequence>
        </>
      )}
    </>
  );
};
