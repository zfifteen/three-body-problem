export interface ScenarioOption {
  id: string;
  name: string;
  file: string;
}

export const scenarios: ScenarioOption[] = [
  {
    id: 'equal-mass-ejecting',
    name: 'Equal-mass chaotic ejecting system (1:1:1)',
    file: 'equal-mass-ejecting.json',
  },
  {
    id: 'moderate-hierarchy-ejecting',
    name: 'Moderate hierarchy ejecting system (1:2:5)',
    file: 'moderate-hierarchy-ejecting.json',
  },
  {
    id: 'extreme-hierarchy-ejecting',
    name: 'Extreme hierarchy ejecting system (10:1:1)',
    file: 'extreme-hierarchy-ejecting.json',
  },
  {
    id: 'scenario-1-1-1',
    name: 'Equal-mass chaotic ejecting system (1:1:1) - Short',
    file: 'scenario-1-1-1.json',
  },
  {
    id: 'long-lived-hierarchical',
    name: 'Long-lived hierarchical control (non-ejecting)',
    file: 'long-lived-hierarchical.json',
  },
];