# Technology Stack — AirDraw Pro

## Frontend & Runtime
- **Core**: Vanilla HTML5, CSS3, Modern JavaScript (ES6+ Modules)
- **Computer Vision**: Google MediaPipe Hands (`@mediapipe/camera_utils`, `@mediapipe/hands` v0.4+) via WebAssembly
- **Smoothing Engine**: 1-Euro Filter adaptive exponential smoothing (sub-pixel precision)
- **Rendering**: Dual HTML5 2D Canvases (Background live video mirror, foreground drawing and glow layer)
- **Audio Synthesis**: Web Audio API oscillator synthesis for touchless gesture feedback

## Local Development & Sync
- **Local Dev Server**: Node.js `serve` (`npm start` -> `http://localhost:3000`)
- **Auto-Sync Engine**: Node.js `child_process` + `fs.watch` (`auto-sync.js` debounced Git sync)
- **Tunneling**: Cloudflare Tunnel for quick external/mobile testing (`cloudflare.log`)

## AI Extension Ecosystem
- **Get Shit Done (GSD)**: Spec-driven lifecycle protocol (`.agent/`, `.agents/`, `.gsd/`)
- **Ralph Loop**: Iterative autonomous agent execution (`PRD.md`, `progress.txt`, `prompt.md`)
- **CodeRabbit**: Automated inline and commit code reviews (`.coderabbit.yaml`)
- **Roo Code**: Autonomous agent rules (`.clinerules`)
- **Claude Code**: Anthropic CLI and IDE runner (`CLAUDE.md`, `adapters/CLAUDE.md`)
- **Gemini / Antigravity**: Antigravity native assistant integration (`GEMINI.md`, `.gemini/GEMINI.md`)
