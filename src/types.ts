// src/types.ts
// Data types for three-body problem scenarios

export interface ScenarioData {
  scenario: string; // Name/description of the scenario
  masses: [number, number, number]; // Masses of the three bodies
  time: number[]; // Time array (seconds or units)
  positions: [number[], number[], number[]][]; // Positions for each body: [body0[x,y,z], body1[x,y,z], body2[x,y,z]] per time step
  velocities?: [number[], number[], number[]][]; // Optional velocities
  scalars: {
    I: number[]; // Moment of inertia
    dIdt: number[]; // dI/dt
    Z: number[]; // Z diagnostic
    Dmin: number[]; // Minimum distance
    Vmax: number[]; // Maximum velocity
  };
  ejectionTime: number; // Time when ejection occurs
  firstCrossingTimes: {
    Z: number;
    dIdt: number;
    Dmin: number;
    Vmax: number;
  };
  thresholds: {
    Z: number;
    dIdt: number;
    Dmin: number;
    Vmax: number;
  };
  placeholder: boolean; // True if this is synthetic/placeholder data
}