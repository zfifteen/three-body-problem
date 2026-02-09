// src/types.ts
// Data types for three-body problem scenarios

export interface ScenarioData {
  name: string;
  description: string;
  masses: [number, number, number]; // Masses of the three bodies
  time: number[]; // Time array (seconds or units)
  positions: [number[], number[], number[]][]; // Positions for each body: [body0[x,y,z], body1[x,y,z], body2[x,y,z]] per time step
  velocities?: [number[], number[], number[]][]; // Optional velocities
  scalars: {
    I: number[]; // Moment of inertia
    dIdt: number[]; // dI/dt
    Z: number[]; // Z diagnostic
    D_min: number[]; // Minimum distance
    V_max: number[]; // Maximum velocity
  };
  ejectionTime: number; // Time when ejection occurs
  firstCrossings: {
    Z: number;
    dIdt: number;
    D_min: number;
    V_max: number;
  };
  thresholds: {
    Z: number;
    dIdt: number;
    D_min: number;
    V_max: number;
  };
  placeholder: boolean; // True if this is synthetic/placeholder data
}