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
    id: 'scenario-1-1-1',
    name: 'Equal-mass chaotic ejecting system (1:1:1) - Short',
    file: 'scenario-1-1-1.json',
  },
];