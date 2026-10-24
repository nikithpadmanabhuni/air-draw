# ✨ AirDraw Pro — Advanced Contactless AI Air Drawing System

AirDraw Pro transforms your webcam into an interactive spatial drawing tablet using **Google MediaPipe Hands** for real-time 21-landmark 3D hand tracking, gesture classification, and buttery-smooth stroke synthesis.

---

## 🚀 Quick Start

### Run with Local Web Server
Because modern web browsers restrict webcam access (`getUserMedia`) to **Secure Contexts** (`localhost` or `https://`), run via the local server:

```bash
npm start
# OR
npx serve -l 3000 .
```
Then open **[http://localhost:3000](http://localhost:3000)** in Google Chrome, Microsoft Edge, or Safari.

---

## ✋ Hand Gestures Reference

| Gesture | Hand Pose | Action |
| :--- | :--- | :--- |
| **Draw** | ☝️ Index finger only | Draws smooth glowing lines on screen |
| **Navigate** | ✌️ Two fingers (Index + Middle) | Moves cursor without drawing |
| **Laser Pointer** | ✨ In Laser Mode (`L`) | Creates temporary decaying presentation trails |
| **Eraser** | 🖐️ Open Hand (All 5 fingers) | Erases drawing under palm/fingertips |
| **Select Color / Tool** | 👆 Point finger at top bar | Hovers and selects any color or tool directly with finger |
| **Pen Up / Pause** | 👌 Pinch or ✊ Fist | Lifts pen / pauses drawing (colors never change automatically) |
| **Clear Canvas** | 🤟 Rock (Index + Pinky) | Wipes all active strokes from the canvas |
| **Quick Save** | 👍 Thumbs Up | Exports current drawing to PNG |
| **Undo** | 3️⃣ Three fingers (Index + Middle + Ring) | Reverts the last stroke |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `P` | Switch to **Pen Mode** |
| `H` | Switch to **Highlighter Mode** |
| `L` | Switch to **Laser Pointer Mode** |
| `E` | Switch to **Eraser Mode** |
| `R` | Toggle **Rainbow Neon Mode** |
| `S` | Toggle **Hand Skeleton Wireframe** |
| `1` – `8` | Quick-select 8 Neon Preset Colors |
| `Ctrl + Z` / `Cmd + Z` | Undo last stroke |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo stroke |
| `C` | Open Clear Confirmation Modal |
| `Ctrl + S` / `Cmd + S` | Open Export Modal (Transparent, Dark, or Camera Snapshot) |
| `M` | Mute / Unmute Sci-Fi Synthesizer Sound Effects |
| `F` | Toggle Fullscreen |
| `?` | Open Gesture & Keyboard Help Cheatsheet |

---

## 🛠️ Architecture & Technical Highlights

- **Exact Video-to-Screen Coordinate Mapping**: Normalizes camera aspect ratio with `object-fit: cover` so your drawn strokes and hand skeleton align with millimeter precision to your physical fingers on any screen size.
- **Direct MediaPipe Video Pipeline**: Eliminates double `getUserMedia` calls, dropped frames, and camera conflicts by employing a native `requestAnimationFrame` frame dispatcher.
- **High-DPI Retina Sub-Pixel Antialiasing**: Automatically scales canvas buffers by `devicePixelRatio` to render razor-sharp lines on Retina displays.
- **Orientation-Independent Finger Extension**: Detects finger states regardless of hand tilt using Euclidean distance ratios from wrist and metacarpal joints.
- **Dynamic Hand-Scale Normalized Pinch**: Thumb-to-index pinch threshold scales proportionally to palm size for consistent pen-up and drawing pause (colors are selected by pointing at toolbar swatches with your finger, never automatically).
- **Multi-Camera Input Selector**: Dynamically detects and switches between all attached cameras (FaceTime camera, Continuity Camera, external USB cams).
- **Multiple Canvas Backdrops**: Switch between live camera overlay, Dark Space studio (`#06070a`), Slate Blackboard (`#141a24`), or Pure Whiteboard (`#f5f7fa`).
- **Tactile Web Audio Synthesizer**: Zero-dependency synthetic audio chimes for tactile feedback.
- **Dual-Input Fallback**: Direct mouse and touchscreen drawing support when camera is unavailable.
