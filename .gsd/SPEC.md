# SPEC.md — AirDraw Pro Specification

> **Status**: `FINALIZED`
>
> ⚠️ **Planning Lock**: Status is FINALIZED. Implementation and iterative improvements unlocked.

## Vision
AirDraw Pro transforms any standard webcam into a high-precision spatial air-drawing tablet. Using Google MediaPipe Hands 21-landmark 3D tracking, adaptive 1-Euro sub-pixel filtering, and real-time gesture synthesis, users can draw, navigate, color, and control the entire application without touching the physical keyboard, mouse, or screen.

## Goals
1. **Single-Finger Air Drawing** — Provide buttery-smooth, jitter-free drawing using only the index fingertip (☝️).
2. **Touchless Spatial Control** — Full UI interaction (color selection, brush sizing, toolbars, modal windows) operable entirely via mid-air gestures and pinch taps (🤏).
3. **Multi-Assistant Integration** — Harmonize GSD, Ralph Loop, CodeRabbit, Roo Code, Claude Code, and Gemini toolchains across the codebase.
4. **Instant Zero-Config Run** — Run locally via standard lightweight HTTP server (`npm start`) with full HTTPS/localhost camera permissions.

## Non-Goals (Out of Scope)
- Heavy native desktop binaries requiring specialized hardware (e.g., Leap Motion or Kinect).
- Server-side video stream processing (all computer vision runs 100% clientside in WebAssembly).
- Mandatory cloud account login or telemetry paywalls.

## Constraints
- Must run in modern Chromium, WebKit, and Gecko browsers supporting WebAssembly and `navigator.mediaDevices.getUserMedia`.
- Camera requires secure context (`localhost` or `https://`).
- Target 60 FPS rendering latency (< 16ms frame budget).

## Success Criteria
- [x] Web camera stream activates with video mirror and guide overlays.
- [x] Single-finger drawing (☝️) accurately generates continuous glowing strokes.
- [x] Peace sign (✌️) hovers pointer without drawing.
- [x] Open palm (🖐️) activates spatial eraser.
- [x] Pinch (🤏) triggers touchless button clicks and slider scrubbing.
- [x] Three fingers (3️⃣) triggers Undo; four fingers (4️⃣) triggers Redo.
- [x] Local server and GitHub auto-sync scripts operational.
- [x] All AI extensions (GSD, Ralph Loop, CodeRabbit, Roo Code, Claude Code) connected with consistent rules.

---

*Last updated: 2026-10-25*
