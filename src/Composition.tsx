import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { ReferenceStyleScene, type ReferenceSceneData } from "./scenes/ReferenceStyleScene";
import { AudioLayer } from "./components/AudioLayer";

const scenes: Array<ReferenceSceneData & {duration: number}> = [
  {number:"01", label:"the claim", counter:"CEILING TEST", title:<>Can a Roadster drive <em style={{fontFamily:"Instrument Serif",color:"#E8402A",fontWeight:400}}>upside down?</em></>, visual:"claim", pose:"pointing", duration:180},
  {number:"02", label:"the problem", counter:"GRAVITY 1.0 G", title:<>It weighs <span style={{color:"#E8402A"}}>3,820 pounds.</span></>, visual:"weight", pose:"shocked", duration:240},
  {number:"03", label:"the seal", counter:"SECRET 1/2", title:<>First, it needs an <em style={{fontFamily:"Instrument Serif",color:"#E8402A",fontWeight:400}}>airtight seal.</em></>, visual:"seal", pose:"gesturing", duration:240},
  {number:"04", label:"the fans", counter:"FORCE 2.0 G", title:<>Then fans create <em style={{fontFamily:"Instrument Serif",color:"#E8402A",fontWeight:400}}>brute force.</em></>, visual:"fans", pose:"shocked", duration:270},
  {number:"05", label:"the flip", counter:"SECRET 2/2", title:<>Thrusters control the <em style={{fontFamily:"Instrument Serif",color:"#E8402A",fontWeight:400}}>mid-air roll.</em></>, visual:"thruster", pose:"pointing", duration:270},
  {number:"06", label:"reality check", counter:"NOT STREET SAFE", title:<>But a pothole makes it <em style={{fontFamily:"Instrument Serif",color:"#E8402A",fontWeight:400}}>dangerous.</em></>, visual:"warning", pose:"gesturing", duration:270},
  {number:"07", label:"the verdict", counter:"CASE CLOSED", title:<>Not magic. Just <em style={{fontFamily:"Instrument Serif",color:"#E8402A",fontWeight:400}}>active suction.</em></>, visual:"verdict", pose:"pointing", duration:330},
];

export const MinuteMysteriesShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#EFEBE4" }}>
      {scenes.map((scene, index) => (
        <Sequence key={scene.number} from={scenes.slice(0, index).reduce((total, item) => total + item.duration, 0)} durationInFrames={scene.duration} name={`${scene.number}_${scene.label}`}>
          <ReferenceStyleScene data={scene} />
        </Sequence>
      ))}

      {/* Audio Layer: Voiceover and SFX integration */}
      <AudioLayer hasVoiceover={true} hasSfx={true} />
    </AbsoluteFill>
  );
};

export const VideoComposition: React.FC = () => {
  return (
    <Composition
      id="MinuteMysteriesShort"
      component={MinuteMysteriesShort}
      durationInFrames={1800}
      fps={30}
      width={720}
      height={1280}
    />
  );
};
