import { useState, useEffect } from 'react'
import './App.css'
import { ScenarioData } from './types'
import { SpatialView } from './SpatialView'
import { ScenarioSelector } from './ScenarioSelector'
import { DiagnosticsPanel } from './DiagnosticsPanel'
import { scenarios } from './scenarios'

function App() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0)
  const [selectedScenarioId, setSelectedScenarioId] = useState('equal-mass-ejecting')

  useEffect(() => {
    const selectedScenario = scenarios.find(s => s.id === selectedScenarioId)
    if (!selectedScenario) return

    setLoading(true)
    fetch(`/data/${selectedScenario.file}`)
      .then(response => response.json())
      .then((data: ScenarioData) => {
        setScenario(data)
        setLoading(false)
        setCurrentTimeIndex(0) // Reset time index when changing scenario
      })
      .catch(error => {
        console.error('Error loading scenario:', error)
        setLoading(false)
      })
  }, [selectedScenarioId])

  if (loading) {
    return <div>Loading scenario...</div>
  }

  if (!scenario) {
    return <div>Error loading scenario.</div>
  }

  return (
    <div>
      <ScenarioSelector
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onScenarioChange={setSelectedScenarioId}
      />
      <h1>{scenario.scenario}</h1>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flex: 1 }}>
          <SpatialView scenario={scenario} currentTimeIndex={currentTimeIndex} />
        </div>
        <div style={{ flex: 1 }}>
          <DiagnosticsPanel scenario={scenario} currentTimeIndex={currentTimeIndex} />
        </div>
      </div>
      <div className="card">
        <p>Masses: {scenario.masses.join(', ')}</p>
        <p>Ejection time: {scenario.ejectionTime}</p>
        <p>Placeholder: {scenario.placeholder ? 'Yes' : 'No'}</p>
        <div>
          <label htmlFor="time-scrub">Time: {scenario.time[currentTimeIndex]?.toFixed(2)}</label>
          <input
            id="time-scrub"
            type="range"
            min={0}
            max={scenario.time.length - 1}
            value={currentTimeIndex}
            onChange={(e) => setCurrentTimeIndex(parseInt(e.target.value))}
          />
        </div>
        <p>Current time index: {currentTimeIndex}</p>
      </div>
    </div>
  )
}

export default App