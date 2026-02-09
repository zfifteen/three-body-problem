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
  const [playing, setPlaying] = useState(false)

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
        setPlaying(false) // Stop playing when changing scenario
      })
      .catch(error => {
        console.error('Error loading scenario:', error)
        setLoading(false)
      })
  }, [selectedScenarioId])

  useEffect(() => {
    if (!playing || !scenario) return

    const interval = setInterval(() => {
      setCurrentTimeIndex((prev) => {
        const next = prev + 1
        if (next >= scenario.time.length) {
          setPlaying(false)
          return prev
        }
        return next
      })
    }, 100) // Adjust speed as needed

    return () => clearInterval(interval)
  }, [playing, scenario])

  if (loading) {
    return <div>Loading scenario...</div>
  }

  if (!scenario) {
    return <div>Error loading scenario.</div>
  }

  const leadTimes = {
    Z: ((scenario.ejectionTime - scenario.firstCrossingTimes.Z) / scenario.ejectionTime * 100).toFixed(1),
    dIdt: ((scenario.ejectionTime - scenario.firstCrossingTimes.dIdt) / scenario.ejectionTime * 100).toFixed(1),
    Dmin: ((scenario.ejectionTime - scenario.firstCrossingTimes.Dmin) / scenario.ejectionTime * 100).toFixed(1),
    Vmax: ((scenario.ejectionTime - scenario.firstCrossingTimes.Vmax) / scenario.ejectionTime * 100).toFixed(1),
  };

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
        <p>
          In this scenario, ejection occurs at t = {scenario.ejectionTime}.<br />
          Z crosses its threshold at t = {scenario.firstCrossingTimes.Z} ({leadTimes.Z}% lead),<br />
          dI/dt at t = {scenario.firstCrossingTimes.dIdt} ({leadTimes.dIdt}% lead),<br />
          D_min at t = {scenario.firstCrossingTimes.Dmin} ({leadTimes.Dmin}% lead),<br />
          V_max at t = {scenario.firstCrossingTimes.Vmax} ({leadTimes.Vmax}% lead).
        </p>
        <p>Masses: {scenario.masses.join(', ')}</p>
        <p>Placeholder: {scenario.placeholder ? 'Yes' : 'No'}</p>
        <div>
          <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
          <label htmlFor="time-scrub">Time: {scenario.time[currentTimeIndex]?.toFixed(2)}</label>
          <input
            id="time-scrub"
            type="range"
            min={0}
            max={scenario.time.length - 1}
            value={currentTimeIndex}
            onChange={(e) => {
              setCurrentTimeIndex(parseInt(e.target.value))
              setPlaying(false) // Pause when scrubbing
            }}
          />
        </div>
        <p>Current time index: {currentTimeIndex}</p>
      </div>
    </div>
  )
}

export default App