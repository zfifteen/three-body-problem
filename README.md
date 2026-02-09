# Three-Body Problem Visualization

An interactive web application for visualizing the gravitational three-body problem, demonstrating early-warning diagnostics for ejection events.

## Features

- **3D Spatial View**: Watch three bodies move with orbit trails, camera controls (rotate, zoom, pan).
- **Diagnostic Plots**: Time-series plots of Z, dI/dt, D_min, V_max with thresholds and crossing markers.
- **Time Synchronization**: Scrub through time with shared controls.
- **Scenario Selection**: Choose from curated ejecting and non-ejecting scenarios.
- **Playback Controls**: Play/pause, speed control, time scrubbing.
- **Lead-Time Analysis**: Displays how early each metric predicts ejection.

## Z Diagnostic

Z measures normalized velocity dispersion: Z₃(t) = σ_v(t) / ⟨|v|(t)⟩  
It rises early when one body is being ejected, providing cleaner warnings than geometric baselines.

## Running Locally

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173

## Build for Production

`npm run build && npm run preview`

## Data Format

Scenarios are JSON files in `public/data/` with precomputed trajectories and diagnostics. See `src/types.ts` for schema.