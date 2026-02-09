# AGENTS.md

## Project Overview

This is a research and visualization project for the gravitational three-body problem.
It contains two major components:

1. **Experiments** -- precomputed numerical studies of early-warning diagnostics for three-body ejection events.
2. **Web app** -- a browser-based viewer for precomputed trajectories that demonstrates the Z diagnostic provides earlier ejection warnings than geometric baselines.

The project owner is `zfifteen` on GitHub.

---

## Repository Structure

    three-body-problem/
    ├── AGENTS.md                  <- You are here
    ├── daily_z3_app.sh            <- Loop script that invokes this agent
    ├── prompts/
    │   └── z3-app.md              <- Detailed app specification (read this first)
    ├── experiments/
    │   └── z-metric-vs-dIdt-early-warning/
    │       ├── README.md
    │       ├── EXPERIMENT_SPEC.md
    │       ├── RESULTS_SUMMARY.md
    │       ├── experiment_results.json
    │       └── early_warning_analysis.png
    ├── src/                       <- App source code (TypeScript + React)
    ├── public/                    <- Static assets and precomputed data bundles
    └── ...

---

## Primary Task

You are being called in a loop by `daily_z3_app.sh` to **incrementally build the web app** described in `prompts/z3-app.md`. Read that file for the full specification.

Each invocation, you should:

1. Inspect the current state of the repo.
2. Identify the next small, coherent increment toward the finished app.
3. Implement it cleanly.
4. Ensure the project builds without errors.
5. Stage and commit with a clear message.

The external script handles `git push`. Do not push yourself.

---

## Tech Stack

- **Language:** TypeScript
- **Framework:** React (functional components, hooks)
- **3D rendering:** three.js
- **Plotting:** Plotly.js, D3, or similar browser-friendly charting library
- **Build tool:** Vite (preferred) or Create React App
- **Package manager:** npm
- **Hosting target:** Static site (no server-side dependencies)

---

## Build and Run Commands

    npm install
    npm run dev          # Local dev server
    npm run build        # Production build
    npm run preview      # Preview production build locally

If these commands do not exist yet, create the project scaffolding so they work.

---

## Code Style

- Prefer clear, well-typed TypeScript. Avoid `any`.
- Use functional React components and hooks exclusively.
- Keep components small and composable:
  - `ScenarioSelector`
  - `SpatialView`
  - `DiagnosticsPanel`
  - `DefinitionsPanel`
  - `PlaybackControls`
- Use descriptive variable names. Minimal but meaningful comments.
- Never use em dashes in code comments, commit messages, or generated text. Use commas, semicolons, or parentheses instead.

---

## Commit Conventions

- Use Conventional Commits (https://www.conventionalcommits.org/):
  - `feat: add scenario loader and JSON schema`
  - `fix: correct time sync between panels`
  - `chore: update dependencies`
  - `docs: add inline formula tooltips`
- One logical change per commit.
- The build must pass before committing.

---

## Testing

- If a test framework is set up, run `npm test` before committing.
- At minimum, ensure `npm run build` succeeds with zero errors.
- Do not break the app between commits.

---

## Data Files

- Precomputed trajectory bundles go in `public/data/` as JSON files.
- The JSON schema for a scenario bundle is defined in `prompts/z3-app.md`.
- Do not generate synthetic data that claims to be research-grade. If placeholder data is needed for development, label it clearly as `"placeholder": true` in the JSON.
- The `experiments/` folder contains prior research results. **Do not modify those files.**

---

## Domain Context

### What is the Z diagnostic?

Z measures normalized velocity dispersion across the three bodies. It tends to rise early when the system is approaching ejection, before geometric indicators like minimum distance (D_min) or maximum velocity (V_max) react.

### Metrics the app must display

| Metric | What it measures |
|--------|-----------------|
| Z(t)   | Normalized velocity dispersion (hero metric) |
| dI/dt  | Rate of change of moment of inertia |
| D_min  | Minimum pairwise distance |
| V_max  | Maximum body speed |

### Key formulas (for UI rendering)

- I(t) = sum_i m_i |r_i(t) - R_cm(t)|^2
- Z_3(t) = sigma_v(t) / mean(|v|(t))
- D_min(t) = min over i,j of |r_i - r_j|
- V_max(t) = max over i of |v_i|

---

## Things to Avoid

- Do not add a backend or database.
- Do not add real-time N-body integration in the browser. The app is a viewer for precomputed data.
- Do not modify anything in `experiments/`.
- Do not use em dashes anywhere (code, comments, UI text, commit messages).
- Do not introduce heavy dependencies without clear justification.
- Do not add authentication, analytics, or tracking.

---

## Development Priorities (in order)

1. Project scaffolding (Vite + React + TypeScript, buildable).
2. Data schema and example scenario bundle.
3. Scenario loading and front-end state management.
4. 3D/2D spatial view with time scrubbing.
5. Diagnostic time-series panel with four curves.
6. Time synchronization between spatial view and diagnostics.
7. Thresholds, ejection marker, and first-crossing markers.
8. Lead-time summary text per scenario.
9. Definitions/help panel with formulas and tooltips.
10. Polish: README, onboarding hint, responsive layout.

Work through these in order. Do not skip ahead.
