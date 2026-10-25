# Claude Code Instructions — AirDraw Pro

> Single Source of Truth: [PROJECT_RULES.md](PROJECT_RULES.md)
> Adapter: [adapters/CLAUDE.md](adapters/CLAUDE.md)

## Quick Start & Verification Commands
- **Start Local Server**: `npm start` (or `npx serve -l 3000 .`) -> Open `http://localhost:3000`
- **GitHub Auto-Sync**: `npm run sync` (runs `node auto-sync.js`)
- **Validate GSD & Agents**: `bash scripts/validate-all.sh`

## Project Architecture & Core Rules
- **AirDraw Pro** is a touchless spatial air-drawing application built with Google MediaPipe Hands, HTML5 Canvas, and Vanilla JavaScript.
- **Strict Single-Finger Drawing**: Only the index fingertip draws (`☝️`). Peace sign (`✌️`) is pen-up hover navigation. Pinch (`🤏`) triggers spatial clicks. Palm (`🖐️`) is eraser.
- **Search-First Discipline**: Always use grep/search before reading entire files.
- **Atomic Commits**: One task per commit with format: `type(scope): description`.
- **State Management**: Keep `.gsd/STATE.md` and `progress.txt` updated when executing tasks.
