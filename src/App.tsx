import { useState, useEffect } from 'react'
import './App.css'
import { ScenarioData } from './types'
import { SpatialView } from './SpatialView'

function App() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0)

  useEffect(() => {
    fetch('/data/scenario-1-1-1.json')
      .then(response => response.json())
      .then((data: ScenarioData) => {
        setScenario(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading scenario:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading scenario...</div>
  }

  if (!scenario) {
    return <div>Error loading scenario.</div>
  }

  return (
    <>
      <div>
        <h1>{scenario.scenario}</h1>
        <SpatialView scenario={scenario} currentTimeIndex={currentTimeIndex} />
        <div className="card">
          <p>Masses: {scenario.masses.join(', ')}</p>
          <p>Ejection time: {scenario.ejectionTime}</p>
          <p>Placeholder: {scenario.placeholder ? 'Yes' : 'No'}</p>
          <button onClick={() => setCurrentTimeIndex((prev) => Math.min(prev + 1, scenario.time.length - 1))}>
            Next Time Step
          </button>
          <p>Current time index: {currentTimeIndex}</p>
        </div>
      </div>
    </>
  )
}

export default App