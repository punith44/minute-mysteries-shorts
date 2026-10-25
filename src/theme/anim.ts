import { Easing, interpolate, random, spring } from "remotion";
import { SPRING_PRESETS } from "./transitions";

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export type SpringPreset = keyof typeof SPRING_PRESETS;

export const springAt = (
  frame: number,
  fps: number,
  delay = 0,
  preset: SpringPreset = "snappy",
) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRING_PRESETS[preset],
  });

export const ramp = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => interpolate(frame, [start, end], [from, to], { ...CLAMP, easing });

export type CamKey = { f: number; s?: number; x?: number; y?: number; r?: number };

export const cameraAt = (frame: number, keys: CamKey[]) => {
  const full: Required<CamKey>[] = [];
  let prev: Required<CamKey> = { f: 0, s: 1, x: 0, y: 0, r: 0 };
  for (const k of keys) {
    prev = {
      f: k.f,
      s: k.s ?? prev.s,
      x: k.x ?? prev.x,
      y: k.y ?? prev.y,
      r: k.r ?? prev.r,
    };
    full.push(prev);
  }
  if (full.length === 0) return { s: 1, x: 0, y: 0, r: 0 };
  if (full.length === 1) return full[0];
  const frames = full.map((k) => k.f);
  const at = (p: "s" | "x" | "y" | "r") =>
    interpolate(
      frame,
      frames,
      full.map((k) => k[p]),
      { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
    );
  return { s: at("s"), x: at("x"), y: at("y"), r: at("r") };
};

export type ShakeEvent = { at: number; dur?: number; amp?: number };

export const shakeAt = (frame: number, events: ShakeEvent[]) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const e of events) {
    const dur = e.dur ?? 14;
    const amp = e.amp ?? 8;
    const t = (frame - e.at) / dur;
    if (t < 0 || t >= 1) continue;
    const decay = (1 - t) * (1 - t);
    x += (random(`sx-${e.at}-${frame}`) - 0.5) * 2 * amp * decay;
    y += (random(`sy-${e.at}-${frame}`) - 0.5) * 2 * amp * decay;
    r += (random(`sr-${e.at}-${frame}`) - 0.5) * amp * 0.08 * decay;
  }
  return { x, y, r };
};
