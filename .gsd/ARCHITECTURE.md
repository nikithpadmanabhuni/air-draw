# System Architecture — AirDraw Pro

## High-Level Pipeline

```
  ┌─────────────────┐
  │  Webcam Video   │
  └────────┬────────┘
           │
           ▼
  ┌────────────────────────────────────────┐
  │  MediaPipe Hands Wasm (21 Landmarks)   │
  └────────┬───────────────────────────────┘
           │
           ▼
  ┌────────────────────────────────────────┐
  │  1-Euro Adaptive Low-Pass Filter       │
  │  (Noise removal + subpixel accuracy)   │
  └────────┬───────────────────────────────┘
           │
           ├───────────────────────────────┐
           ▼                               ▼
  ┌──────────────────────┐      ┌─────────────────────────┐
  │ Gesture Classifier   │      │ Spatial Collision Ray   │
  │ (☝️, ✌️, 🤏, 🖐️, 🤟) │      │ (Buttons, UI elements)  │
  └────────┬─────────────┘      └──────────┬──────────────┘
           │                               │
           ▼                               ▼
  ┌──────────────────────┐      ┌─────────────────────────┐
  │ Canvas Stroke Engine │      │ Web Audio & UI State    │
  │ (Dual-layer Canvas)  │      │ (DOM, sound feedback)   │
  └──────────────────────┘      └─────────────────────────┘
```

## Module Boundaries
1. **Video & Tracking**: Encapsulated in `index.html` inline MediaPipe controller.
2. **Smoothing Filter**: Dynamic cutoff frequency calculated per frame to eliminate hand tremors without introducing perceptible lag.
3. **Gesture Classifier**: Geometric vector angles between MCP, PIP, DIP, and TIP landmarks to determine extended fingers and gestures.
4. **Collision Engine**: Screen-space bounding box tests triggered on pinch distance threshold (`norm(thumb_tip - index_tip) < 0.05`).
5. **State & Sync**: Managed locally by browser localStorage and synced to GitHub via `auto-sync.js`.
