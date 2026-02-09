# Design Decisions

## Architecture

The app is built with React and TypeScript for type safety and maintainability. Components are kept small and composable:

- `App`: Main state management and layout
- `ScenarioSelector`: Dropdown for scenario selection
- `SpatialView`: 3D visualization with Three.js
- `DiagnosticsPanel`: Plotting with Plotly.js
- `DefinitionsPanel`: Mathematical definitions with tooltips

## State Management

State is managed at the App level with React hooks:
- `scenario`: Current loaded scenario data
- `currentTimeIndex`: Shared time index for synchronization
- `playing`: Playback state
- `speed`: Playback speed multiplier
- `selectedScenarioId`: For scenario switching

## Data Loading

Scenarios are loaded asynchronously from JSON files in `public/data/`. The schema is defined in `types.ts` and supports all required fields.

## Performance

- Lazy loading for heavy components (SpatialView, DiagnosticsPanel)
- Suspense fallbacks for loading states
- Efficient updates only when time index changes

## Styling

CSS is used with responsive design breakpoints for mobile support. Layout uses Flexbox for adaptability.

## Plotting

Plotly.js provides rich interactivity but results in a large bundle. Future optimization could involve switching to D3.js for smaller size.