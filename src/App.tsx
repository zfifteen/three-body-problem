import { useState, useEffect } from 'react'
import './App.css'
import { ScenarioData } from './types'

function App() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [loading, setLoading] = useState(true)

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
        <div className="card">
          <p>Masses: {scenario.masses.join(', ')}</p>
          <p>Ejection time: {scenario.ejectionTime}</p>
          <p>Placeholder: {scenario.placeholder ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </>
  )
}

export default App