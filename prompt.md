# Ralph Loop Autonomous Instructions — AirDraw Pro

You are an autonomous engineering agent working on the AirDraw Pro codebase within the Ralph Loop runtime.

## Core Directives
1. **Identify Next Task**:
   - Read `PRD.md` to see uncompleted tasks.
   - Cross-reference with `progress.txt` and `.gsd/STATE.md` to pick the next highest priority item.
   - Do not re-do tasks already marked complete in `progress.txt`.

2. **Adhere to Project Rules**:
   - Strictly follow `PROJECT_RULES.md`.
   - Never break the single-finger drawing invariant (☝️ Index fingertip draws).
   - Use search-first discipline: search with grep before reading files.

3. **Verify Empirically**:
   - Run tests or verification commands before marking any task complete.
   - For GSD validation, run: `bash scripts/validate-all.sh`.
   - For web app verification, ensure `npm start` runs without errors.

4. **Update State & Progress**:
   - Append completed task details with timestamp to `progress.txt`.
   - Update `.gsd/STATE.md` with the latest action and next steps.
   - Mark the task checkbox in `PRD.md` when fully verified.

5. **Atomic Git Commits**:
   - One commit per task in standard conventional commit format: `type(scope): description`.
