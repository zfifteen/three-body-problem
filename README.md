# Three-Body Problem Visualization

An interactive web application for visualizing the gravitational three-body problem, demonstrating early-warning diagnostics for ejection events.

## Overview

This app loads precomputed three-body trajectories and lets you explore how the "Z diagnostic" provides earlier warnings of ejection events compared to traditional metrics like minimum distance (D_min) or maximum velocity (V_max).

## Features

- **3D Spatial View**: Interactive 3D visualization of three bodies with orbit trails. Use mouse to rotate, zoom, and pan.
- **Diagnostic Time-Series**: Plots of four metrics over time:
  - **Z** (red): Normalized velocity dispersion - the hero metric that rises early during ejections
  - **dI/dt** (blue): Rate of change of moment of inertia
  - **D_min** (green): Minimum pairwise distance
  - **V_max** (orange): Maximum body speed
- **Thresholds & Markers**: Dashed lines show thresholds; symbols mark first crossings.
- **Ejection Annotation**: Vertical line at ejection time.
- **Time Synchronization**: Scrubber controls both spatial view and plots.
- **Scenario Selector**: Switch between different mass ratios and ejection scenarios.
- **Playback Controls**: Play/pause, variable speed, time scrubbing.
- **Lead-Time Summary**: Quantifies how much lead time each metric provides.
- **Definitions Panel**: Mathematical formulas with hover explanations.

## The Z Diagnostic

Z₃(t) = σ_v(t) / ⟨|v|(t)⟩

Z measures how uneven the speeds of the three bodies are, normalized to the average speed. It tends to rise sharply when one body is being flung out, often providing 20-30% more lead time than geometric indicators.

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## Usage

1. Select a scenario from the dropdown (e.g., equal-mass ejecting system).
2. Use the time scrubber to explore the trajectory.
3. Watch how Z (red curve) crosses its threshold first, signaling ejection early.
4. Hover over markers in the plot for crossing times and thresholds.
5. Check the lead-time summary in the footer.

## Data Format

Scenarios are stored as JSON files in `public/data/`. Each file contains precomputed positions, velocities, and diagnostic scalars. See `src/types.ts` for the complete schema.

Example structure:
```json
{
  "scenario": "Equal-mass chaotic ejecting system (1:1:1)",
  "masses": [1, 1, 1],
  "time": [0, 0.1, 0.2, ...],
  "positions": [[[x0,y0,z0], [x1,y1,z1], [x2,y2,z2]], ...],
  "scalars": {
    "Z": [...],
    "dIdt": [...],
    "Dmin": [...],
    "Vmax": [...]
  },
  "ejectionTime": 25.3,
  "firstCrossingTimes": { "Z": 18.7, ... },
  "thresholds": { "Z": 0.8, ... },
  "placeholder": false
}
```

## Tech Stack

- **Frontend**: React + TypeScript
- **3D Graphics**: Three.js
- **Plotting**: Plotly.js
- **Build**: Vite
- **Styling**: CSS-in-JS (inline styles for simplicity)

## Contributing

This is a research visualization tool. The core logic is in `src/`; data files are in `public/data/`. Ensure builds pass with `npm run build` before committing.

## License

See repository for license information.