# Gemini / Antigravity Agent Rules — AirDraw Pro

> Single Source of Truth: [PROJECT_RULES.md](PROJECT_RULES.md)
> Gemini Adapter: [adapters/GEMINI.md](adapters/GEMINI.md)
> Mission Control: [.gemini/GEMINI.md](.gemini/GEMINI.md)

## Core Commands
- **Local Dev Server**: `npm start` (serves at `http://localhost:3000`)
- **Auto-Sync Engine**: `npm run sync`
- **Validation**: `bash scripts/validate-all.sh`

## Workflow Integration
- Use GSD workflows (`/plan`, `/execute`, `/verify`, `/progress`, `/map`, `/debug`).
- Keep `.gsd/STATE.md` and `progress.txt` updated across sessions.
- Enforce the 1-finger drawing invariant (☝️) and 60 FPS canvas performance.
