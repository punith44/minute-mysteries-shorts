import React from "react";
import { Composition } from "remotion";
import { ReelEngine, getReelDurationInFrames } from "./engine/ReelEngine";
import { teslaRoadsterReel } from "./topics/teslaRoadster.reel";
import { aiGrowthPlaybookReel } from "./topics/aiGrowthPlaybook.reel";
import { whyF1DriversLoseNinePounds } from "./topics/whyF1DriversLoseNinePounds.reel";
import { teslaRoadsterUpsideDownReel } from "./topics/teslaRoadsterUpsideDown.reel";
import { electricBathReel } from "./topics/electricBath.reel";
import { leaningTowerPisaReel } from "./topics/leaningTowerPisa.reel";

export const MinuteMysteriesShort: React.FC = () => {
  return <ReelEngine config={teslaRoadsterReel} />;
};

export const AIGrowthPlaybookShort: React.FC = () => {
  return <ReelEngine config={aiGrowthPlaybookReel} enableVoiceover={false} />;
};

export const WhyF1DriversLoseNinePoundsShort: React.FC = () => {
  return <ReelEngine config={whyF1DriversLoseNinePounds} enableVoiceover={true} />;
};

export const TeslaRoadsterUpsideDownShort: React.FC = () => {
  return <ReelEngine config={teslaRoadsterUpsideDownReel} enableVoiceover={true} />;
};

export const ElectricBathShort: React.FC = () => {
  return <ReelEngine config={electricBathReel} enableVoiceover={true} />;
};

export const LeaningTowerPisaShort: React.FC = () => {
  return <ReelEngine config={leaningTowerPisaReel} enableVoiceover={true} />;
};

export const VideoComposition: React.FC = () => {
  return (
    <>
      {/* Primary Explainer Short: Tesla Roadster Inversion Physics */}
      <Composition
        id={teslaRoadsterReel.id}
        component={MinuteMysteriesShort}
        durationInFrames={getReelDurationInFrames(teslaRoadsterReel)}
        fps={teslaRoadsterReel.fps ?? 30}
        width={teslaRoadsterReel.width ?? 1080}
        height={teslaRoadsterReel.height ?? 1920}
      />

      {/* Second Topic Showcase: AI-Animated Reels Playbook (Adilet Reference Style) */}
      <Composition
        id={aiGrowthPlaybookReel.id}
        component={AIGrowthPlaybookShort}
        durationInFrames={getReelDurationInFrames(aiGrowthPlaybookReel)}
        fps={aiGrowthPlaybookReel.fps ?? 30}
        width={aiGrowthPlaybookReel.width ?? 1080}
        height={aiGrowthPlaybookReel.height ?? 1920}
      />

      {/* F1 9-Pounds Weight Loss Explainer */}
      <Composition
        id={whyF1DriversLoseNinePounds.id}
        component={WhyF1DriversLoseNinePoundsShort}
        durationInFrames={getReelDurationInFrames(whyF1DriversLoseNinePounds)}
        fps={whyF1DriversLoseNinePounds.fps ?? 30}
        width={whyF1DriversLoseNinePounds.width ?? 1080}
        height={whyF1DriversLoseNinePounds.height ?? 1920}
      />

      {/* Tesla Roadster Upside Down Explainer */}
      <Composition
        id={teslaRoadsterUpsideDownReel.id}
        component={TeslaRoadsterUpsideDownShort}
        durationInFrames={getReelDurationInFrames(teslaRoadsterUpsideDownReel)}
        fps={teslaRoadsterUpsideDownReel.fps ?? 30}
        width={teslaRoadsterUpsideDownReel.width ?? 1080}
        height={teslaRoadsterUpsideDownReel.height ?? 1920}
      />

      {/* The Electric Bath That People Actually Used */}
      <Composition
        id={electricBathReel.id}
        component={ElectricBathShort}
        durationInFrames={getReelDurationInFrames(electricBathReel)}
        fps={electricBathReel.fps ?? 30}
        width={electricBathReel.width ?? 1080}
        height={electricBathReel.height ?? 1920}
      />

      {/* Why Didn't the Leaning Tower of Pisa Fall Over? (Poly Lab Benchmark) */}
      <Composition
        id={leaningTowerPisaReel.id}
        component={LeaningTowerPisaShort}
        durationInFrames={getReelDurationInFrames(leaningTowerPisaReel)}
        fps={leaningTowerPisaReel.fps ?? 30}
        width={leaningTowerPisaReel.width ?? 1080}
        height={leaningTowerPisaReel.height ?? 1920}
      />
    </>
  );
};
