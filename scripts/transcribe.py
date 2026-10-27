#!/usr/bin/env python3
"""
Speech-to-Text with exact word-level timestamps using local OpenAI Whisper.
Adapted from Kapa (@kappa.ai) for the minute-mysteries-shorts Remotion pipeline.

Usage:
    ~/.local/edit-tools/.venv/bin/python scripts/transcribe.py <audio_or_video> [--model base] [--out transcript.json]

Outputs a clean JSON array of word tokens:
    [
        {"text": "Can", "start": 0.12, "end": 0.35},
        {"text": "Tesla's", "start": 0.35, "end": 0.68},
        {"text": "Roadster", "start": 0.68, "end": 1.15}
    ]
"""

import argparse
import json
import os
import sys

# Ensure ~/.local/bin (where static ffmpeg lives) is in PATH
local_bin = os.path.expanduser("~/.local/bin")
if local_bin not in os.environ.get("PATH", ""):
    os.environ["PATH"] = f"{local_bin}:{os.environ.get('PATH', '')}"

import whisper

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ap = argparse.ArgumentParser(description="Extract word-level timestamps using Whisper")
ap.add_argument("media", help="Path to audio or video file")
ap.add_argument("--model", default="base", help="Model size: tiny, base, small, medium, large-v3")
ap.add_argument("--language", default=None, help="Language code (e.g. en, es, hi). Omit to auto-detect")
ap.add_argument("--out", default="transcript.json", help="Output JSON path")
ap.add_argument("--prompt", default="Minute Mysteries, Remotion, physics, science, AI", help="Initial prompt hint")
a = ap.parse_args()

print(f"Loading Whisper model '{a.model}'...")
model = whisper.load_model(a.model)

print(f"Transcribing '{a.media}' with exact word-level alignment...")
result = model.transcribe(
    a.media,
    word_timestamps=True,
    language=a.language,
    initial_prompt=a.prompt,
    fp16=False,
)

words = []
for seg in result.get("segments", []):
    for w in seg.get("words", []):
        txt = w["word"].strip()
        if txt:
            words.append({
                "text": txt,
                "start": round(float(w["start"]), 3),
                "end": round(float(w["end"]), 3),
            })

with open(a.out, "w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print(f"✓ Extracted {len(words)} aligned words -> {a.out}")
if words:
    print(f"  Duration: {words[-1]['end']:.2f}s")
    preview = " ".join(w["text"] for w in words[:15])
    print(f"  Sample: \"{preview}...\"")
