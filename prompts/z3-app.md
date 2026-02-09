You are an autonomous coding agent tasked with incrementally building an interactive web application for the gravitational three-body problem.

## High-level goal

Build a research-faithful, browser-based viewer for precomputed three-body trajectories that demonstrates that the diagnostic \(Z_3\) provides earlier, cleaner ejection warnings than simple geometric baselines (D_min and V_max) and the raw moment-of-inertia rate dI/dt.

The app is **not** a toy integrator. It is a front-end that loads precomputed data bundles and lets the user:

- Watch the three bodies move in a 2D/3D view.
- See four diagnostics plotted over time: Z, dI/dt, D_min, V_max.
- See clearly, with annotations and numbers, that Z “fires” first in most scenarios.

Target users are technically fluent STEM folks, not full celestial mechanics experts.

## Tech stack constraints

- Use a standard, modern web stack that can be served as a static site:
    - Front-end: TypeScript + React (preferred) or vanilla JS + a small framework if necessary.
    - 3D / 2D view: three.js or a lightweight wrapper for the spatial view of the three bodies.
    - Plotting: a browser-friendly plotting library (e.g., Plotly, D3, or similar) for time-series curves.
- The repo is a normal git repo at:
    - `/Users/velocityworks/IdeaProjects/three-body-problem`
- All code must live inside this repo, in a conventional structure (e.g., `src/`, `public/`, etc.).
- The app must be easy to run locally via a single command (e.g., `npm install && npm run dev` or similar).
- Do not introduce heavy server-side dependencies; assume static hosting is fine.

If you need to choose between libraries, prefer those that are widely used and well-documented.

## Core user experience

### Layout

Use a two-panel layout:

1. **Top panel: spatial view**
    - Displays three bodies as colored spheres with orbit trails.
    - Camera controls: rotate, zoom, pan (via mouse).
    - Shows current simulation time, e.g., `t = 18.7`.
    - Optional: simple toggle between:
        - Physical space view (actual positions).
        - Configuration triangle view (triangle formed by the three bodies, appropriately normalized).

2. **Bottom panel: diagnostic plot**
    - Shared time axis.
    - Four curves:
        - Z(t) (hero curve, visually emphasized).
        - dI/dt(t).
        - D_min(t).
        - V_max(t).
    - A vertical cursor line synchronized with the top panel.
    - Horizontal threshold lines for each metric.
    - Markers at the first threshold crossing for each metric.

### Scenarios

Implement a scenario dropdown with **3–5 curated presets**:

1. Equal-mass chaotic ejecting system (1:1:1).
2. Moderate hierarchy ejecting system (1:2:5).
3. Extreme hierarchy ejecting system (10:1:1).
4. Long-lived hierarchical control (non-ejecting).
5. Optional binary-formation showcase (if time permits).

Each scenario should be loaded from a **precomputed data bundle**. For now, you can:

- Define a clean JSON schema for one or more example scenarios.
- Provide a small example dataset in the repo that is easy to swap out later.
- The schema must support:
    - Time array.
    - Positions of each body over time.
    - Optional velocities.
    - Scalars over time: I(t), dI/dt(t), Z(t), D_min(t), V_max(t).
    - Ejection time.
    - First-crossing times for each metric (Z, dI/dt, D_min, V_max).
    - Threshold values for each metric.

### Interaction

- **Play / pause**: starts and stops time evolution.
- **Time scrubber**: dragging the scrubber updates both:
    - the spatial view (positions, trails),
    - the vertical cursor in the diagnostic plot.
- **Speed control**: simple multiplier (e.g., 0.25x, 1x, 4x).
- **Scenario dropdown**: selecting a scenario loads its data bundle and resets the view.

### Coaching the “Z early warning” insight

This app should strongly highlight the early-warning advantage of Z:

- Display text above the plot like:

  > In this scenario, ejection occurs at t = 30.2.  
  > Z crosses its threshold at t = 21.4 (28% lead),  
  > dI/dt at t = 24.1 (20% lead),  
  > D_min at t = 27.6 (9% lead),  
  > V_max at t = 28.3 (6% lead).

- This text should update when the scenario changes.
- On the diagnostic plot:
    - Draw a vertical line at t_eject labeled “Ejection.”
    - Mark each metric’s first threshold crossing with a distinct symbol and a tooltip.
    - Tooltips show metric name, crossing time, and normalized lead time.

### Mathematical definitions in the UI

Include a small “Definitions” area or help panel that shows:

- \(I(t) = \sum_i m_i \, |\mathbf{r}_i(t) - \mathbf{R}_{\text{cm}}(t)|^2\)
- \(\dot{I}(t) = \frac{dI}{dt}\)
- \(|E| = |T + V|\)
- \(Z_3(t) = \frac{\sigma_v(t)}{\langle |v|(t) \rangle}\)
- \(D_{\min}(t) = \min_{i \neq j} |\mathbf{r}_i(t) - \mathbf{r}_j(t)|\)
- \(V_{\max}(t) = \max_i |\mathbf{v}_i(t)|\)

Each definition should have a hover tooltip with a plain-language explanation. For example:

- Z: “Measures how uneven the speeds of the three bodies are, normalized to the average speed. It tends to rise early when one body is being flung out.”
- dI/dt: “Measures how quickly the overall size of the system is growing.”

## Agent behavior and workflow

You are being called in a loop from a bash script. For each invocation:

1. **Inspect the current state of the repo** at `/Users/velocityworks/IdeaProjects/three-body-problem`.
2. Plan a small, coherent increment toward the full app described above.
3. Implement that increment:
    - Create or modify files as needed.
    - Keep the codebase buildable and runnable at all times.
4. If appropriate, run basic checks:
    - For a Node/React app, ensure that `npm test` or `npm run build` (if present) does not fail.
5. Write clear commit messages:
    - Example: `feat: add basic scenario loader and data schema`
    - Example: `feat: implement time-synchronized diagnostic plot`
6. Stage and commit your changes:
    - `git add ...`
    - `git commit -m "..."`

The external script will handle pushing to GitHub using `gh` or `git push`. Do not assume network access inside the app itself beyond what is needed to load static assets.

## Development priorities (in order)

1. Basic project scaffolding (buildable app, simple “Hello three-body” page).
2. Data schema and example scenario bundle(s).
3. Scenario loading and storage in front-end state.
4. 3D/2D spatial view of bodies over time with time scrub.
5. Diagnostic time-series panel with four curves and shared time axis.
6. Time synchronization between spatial view and diagnostics.
7. Thresholds, ejection marker, and first-crossing markers.
8. Lead-time summary text per scenario.
9. Definitions/help panel with formulas and tooltips.
10. Polish and documentation (README, how to run, brief explanation of Z).

## Style and code quality

- Prefer clear, well-typed code (if TypeScript is used).
- Use functional React components and hooks if using React.
- Keep components small and composable (e.g., `ScenarioSelector`, `SpatialView`, `DiagnosticsPanel`).
- Document key design decisions in comments or a short `docs/` note.

Your objective is to iteratively converge on a clean, maintainable implementation of the app described here.
