import { ScenarioOption } from './scenarios';

interface ScenarioSelectorProps {
  scenarios: ScenarioOption[];
  selectedScenarioId: string;
  onScenarioChange: (scenarioId: string) => void;
}

export function ScenarioSelector({ scenarios, selectedScenarioId, onScenarioChange }: ScenarioSelectorProps) {
  return (
    <div>
      <label htmlFor="scenario-select">Select Scenario:</label>
      <select
        id="scenario-select"
        value={selectedScenarioId}
        onChange={(e) => onScenarioChange(e.target.value)}
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
    </div>
  );
}