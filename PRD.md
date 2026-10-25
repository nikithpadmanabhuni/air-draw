# PRD: AirDraw Pro — Product Requirements & Task Matrix

> **Source of Truth Specification**: [.gsd/SPEC.md](.gsd/SPEC.md)
> **Canonical Methodology**: [PROJECT_RULES.md](PROJECT_RULES.md)
> **Progress Log**: [progress.txt](progress.txt)

## Overview
AirDraw Pro is an AI-powered touchless air drawing web application that operates through hand tracking and gesture recognition via Google MediaPipe Hands.

## Actionable Task Matrix for Autonomous Agents

### Milestone 1: Core System & Gestures (Status: COMPLETE)
- [x] **TASK-01**: Initialize HTML5 dual canvas layout and video element with mirror flipping.
- [x] **TASK-02**: Integrate MediaPipe Hands CDN scripts and establish webcam stream loop.
- [x] **TASK-03**: Implement 1-Euro adaptive filter for index fingertip sub-pixel stabilization.
- [x] **TASK-04**: Implement single-finger drawing rule (☝️ Index fingertip draws, ✌️ Peace hovers).
- [x] **TASK-05**: Implement open-palm eraser gesture (🖐️) with circular spatial brush.
- [x] **TASK-06**: Implement multi-finger gesture commands: Undo (3️⃣), Redo (4️⃣), Clear Canvas (🤟), Quick Save (👍).

### Milestone 2: Spatial Touchless UI & Audio (Status: COMPLETE)
- [x] **TASK-07**: Build glassmorphism control panel with color swatches, brush sizing, and clear controls.
- [x] **TASK-08**: Implement Pinch-to-Click (🤏) spatial raycaster for in-air button taps.
- [x] **TASK-09**: Implement mid-air slider scrubber for brush thickness and opacity adjustments.
- [x] **TASK-10**: Integrate Web Audio synthesizer for tactile sound feedback on drawing, clicking, and erasing.
- [x] **TASK-11**: Create draggable gesture cheatsheet window.

### Milestone 3: Unified AI Extension Ecosystem (Status: IN-PROGRESS)
- [x] **TASK-12**: Normalize file line endings to LF and strip BOM across all GSD scripts and agents.
- [x] **TASK-13**: Establish `.vscode/settings.json` and `.vscode/extensions.json` binding all extensions.
- [x] **TASK-14**: Create `.coderabbit.yaml` with custom review instructions for single-finger air drawing.
- [x] **TASK-15**: Create `.clinerules` for Roo Code integration.
- [x] **TASK-16**: Create root `CLAUDE.md` and `GEMINI.md` bridging adapter protocols.
- [x] **TASK-17**: Author `PRD.md`, `progress.txt`, and `prompt.md` for Ralph Loop execution.
- [ ] **TASK-18**: Execute full verification suite (`bash scripts/validate-all.sh`) and stage clean commit.

### Milestone 4: Performance & Quality Polish (Status: BACKLOG)
- [ ] **TASK-19**: Profile low-light webcam performance and add automatic exposure/contrast compensation.
- [ ] **TASK-20**: Add stroke export formats (SVG vector export alongside PNG).
- [ ] **TASK-21**: Add service worker for offline PWA capabilities.
