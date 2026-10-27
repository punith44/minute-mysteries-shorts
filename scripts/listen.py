#!/usr/bin/env python3
"""
Ears for Sounds: Finds sound events in reference videos/audio and classifies them (LAION CLAP).
Adapted from Kapa (@kappa.ai) for the minute-mysteries-shorts Remotion pipeline.

Usage:
    ~/.local/edit-tools/.venv/bin/python scripts/listen.py events <video_or_audio> [--out events.json] [--sensitivity 1.6]
    ~/.local/edit-tools/.venv/bin/python scripts/listen.py match <piece.wav> <sfx_folder>
    ~/.local/edit-tools/.venv/bin/python scripts/listen.py label <file_or_folder>
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import numpy as np

# Ensure ~/.local/bin is in PATH for static ffmpeg
local_bin = os.path.expanduser("~/.local/bin")
if local_bin not in os.environ.get("PATH", ""):
    os.environ["PATH"] = f"{local_bin}:{os.environ.get('PATH', '')}"

FFMPEG = (
    os.environ.get("FFMPEG")
    or shutil.which("ffmpeg")
    or os.path.expanduser("~/.local/bin/ffmpeg")
)
SR = 48000
MODEL = "laion/clap-htsat-unfused"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

LABELS = {
    "mouse click": "click",
    "pop": "pop",
    "bubble pop": "pop",
    "whoosh": "whoosh",
    "fast swipe": "whoosh",
    "riser sweep going up": "riser",
    "deep bass hit": "sub_impact",
    "stamp or slam": "stamp",
    "bell ding": "ding",
    "chime sparkle": "ding",
    "notification sound": "ding",
    "camera shutter": "click",
    "paper rustle": "whoosh",
    "checkmark tick": "click",
    "gas thruster": "thruster",
    "jet engine turbine": "turbine",
}

def load_audio(path, start=None, end=None):
    cmd = [FFMPEG, "-nostdin", "-v", "error"]
    if start is not None:
        cmd += ["-ss", str(start)]
    if end is not None:
        cmd += ["-to", str(end)]
    cmd += ["-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def find_onsets(x, min_gap=0.12, sensitivity=1.6):
    n, hop = 2048, 480
    win = np.hanning(n).astype(np.float32)
    frames = 1 + max(0, (len(x) - n) // hop)
    mags = np.empty((frames, n // 2 + 1), dtype=np.float32)
    for i in range(frames):
        mags[i] = np.abs(np.fft.rfft(x[i * hop : i * hop + n] * win))
    logm = np.log1p(40 * mags)
    flux = np.maximum(0, np.diff(logm, axis=0)).sum(axis=1)
    flux = np.concatenate([[0], flux])
    k = 30
    thr = np.array([np.median(flux[max(0, i - k) : i + k + 1]) for i in range(len(flux))])
    cand = []
    for i in range(1, len(flux) - 1):
        if flux[i] > thr[i] * sensitivity + 1e-6 and flux[i] >= flux[i - 1] and flux[i] > flux[i + 1]:
            cand.append((i, flux[i] / (thr[i] + 1e-6)))
    onsets = []
    for i, strength in cand:
        t = (i * hop + n / 2) / SR
        if onsets and t - onsets[-1][0] < min_gap:
            if strength > onsets[-1][1]:
                onsets[-1] = (t, strength)
            continue
        onsets.append((t, strength))
    return onsets

class Ears:
    def __init__(self):
        import torch
        from transformers import ClapModel, ClapProcessor

        self.torch = torch
        print(f"Loading CLAP sound classification model '{MODEL}'...")
        self.model = ClapModel.from_pretrained(MODEL).eval()
        self.proc = ClapProcessor.from_pretrained(MODEL)
        self.label_keys = list(LABELS)
        with torch.no_grad():
            t = self.proc(
                text=[f"the sound of a {k}" for k in self.label_keys],
                return_tensors="pt",
                padding=True,
            )
            te = self.model.get_text_features(**t)
            self.text_emb = te / te.norm(dim=-1, keepdim=True)

    def embed(self, clips):
        torch = self.torch
        out = []
        for i in range(0, len(clips), 8):
            batch = [
                c if len(c) > 4800 else np.pad(c, (0, 4800 - len(c)))
                for c in clips[i : i + 8]
            ]
            with torch.no_grad():
                a = self.proc(audios=batch, sampling_rate=SR, return_tensors="pt")
                ae = self.model.get_audio_features(**a)
                out.append(ae / ae.norm(dim=-1, keepdim=True))
        return torch.cat(out)

    def name(self, emb, top=3):
        sims = (emb @ self.text_emb.T) * 20
        probs = sims.softmax(dim=-1)
        res = []
        for row in probs:
            idx = row.argsort(descending=True)[:top]
            res.append(
                [(LABELS[self.label_keys[j]], round(float(row[j]), 2)) for j in idx]
            )
        return res

def cmd_events(args):
    print(f"Analyzing audio events in '{args.media}'...")
    x = load_audio(args.media)
    total = len(x) / SR
    onsets = find_onsets(x, sensitivity=args.sensitivity)
    print(f"Found {len(onsets)} onset sound events. Classifying...")
    ears = Ears()
    clips, rows = [], []
    for k, (t, strength) in enumerate(onsets):
        nxt = onsets[k + 1][0] if k + 1 < len(onsets) else total
        a = max(0, t - 0.03)
        b = min(total, max(t + 0.25, min(t + 1.0, nxt)))
        seg = x[int(a * SR) : int(b * SR)]
        clips.append(seg)
        rows.append({"time": round(t, 2), "strength": round(float(strength), 1)})
    names = ears.name(ears.embed(clips)) if clips else []
    for r, nm in zip(rows, names):
        r["type"] = nm[0][0]
        r["confidence"] = nm[0][1]
        print(f"  t={r['time']:5.2f}s  ->  {r['type']:10s} (score: {r['confidence']:.2f})")
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        print(f"✓ Saved {len(rows)} classified sound events to {args.out}")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    e = sub.add_parser("events")
    e.add_argument("media")
    e.add_argument("--out")
    e.add_argument("--sensitivity", type=float, default=1.6)
    a = ap.parse_args()
    if a.cmd == "events":
        cmd_events(a)
