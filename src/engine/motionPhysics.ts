/**
 * Core Physics & Animation Math Engine
 * Implements Hooke's Law damped harmonic spring overshoot (F = -kx),
 * camera zoom kicks, impact shakes, and easing curves matching the reference reels.
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

/**
 * Damped harmonic oscillator (Hooke's law F = -kx) with configurable overshoot (0..0.85)
 */
export function evaluateSpring(progress: number, overshootAmount = 0.45): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const damping = 7.2 - clamp(overshootAmount, 0, 0.9) * 4.5;
  const angularFreq = 11.5;
  return 1 - Math.exp(-damping * progress) * Math.cos(angularFreq * progress);
}

/**
 * Camera zoom punch-in (0.06s attack + smooth sinusoidal settle over 0.38s)
 */
export function evaluateZoomKick(
  currentTimeSec: number,
  triggers: Array<{ at: number; peakScale: number; duration?: number }>
): number {
  let scale = 1.0;
  for (const trig of triggers) {
    const dur = trig.duration ?? 0.38;
    const dt = currentTimeSec - trig.at;
    if (dt > 0 && dt < dur) {
      const punch = Math.sin((dt / dur) * Math.PI);
      scale = Math.max(scale, 1 + (trig.peakScale - 1) * punch);
    }
  }
  return scale;
}

/**
 * Deterministic impact camera shake (for heavy rubber stamps & slams)
 */
export function evaluateImpactShake(
  currentTimeSec: number,
  triggers: Array<{ at: number; duration?: number; amplitude?: number }>
): { x: number; y: number; rot: number } {
  let x = 0;
  let y = 0;
  let rot = 0;
  for (const trig of triggers) {
    const dur = trig.duration ?? 0.28;
    const amp = trig.amplitude ?? 10;
    const dt = currentTimeSec - trig.at;
    if (dt > 0 && dt < dur) {
      const progress = dt / dur;
      const decay = Math.pow(1 - progress, 2);
      x += Math.sin(dt * 95) * amp * decay;
      y += Math.cos(dt * 115) * amp * 0.75 * decay;
      rot += Math.sin(dt * 80) * (amp * 0.08) * decay;
    }
  }
  return { x, y, rot };
}
