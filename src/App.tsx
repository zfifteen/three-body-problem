import { useState, useEffect } from 'react'
import './App.css'
import { ScenarioData } from './types'
import { SpatialView } from './SpatialView'
import { ScenarioSelector } from './ScenarioSelector'
import { DiagnosticsPanel } from './DiagnosticsPanel'
import { DefinitionsPanel } from './DefinitionsPanel'
import { scenarios } from './scenarios'

function App() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [loading, setLoading] = useState(true)
   const [currentTimeIndex, setCurrentTimeIndex] = useState(0)
   const [selectedScenarioId, setSelectedScenarioId] = useState('equal-mass-ejecting')
   const [playing, setPlaying] = useState(false)
   const [speed, setSpeed] = useState(1)

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
    }, 100 / speed) // Adjust speed as needed

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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <ScenarioSelector
          scenarios={scenarios}
          selectedScenarioId={selectedScenarioId}
          onScenarioChange={setSelectedScenarioId}
        />
        <h1 style={{ margin: '5px 0', fontSize: '1.5em' }}>{scenario.scenario}</h1>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => setPlaying(!playing)} style={{ marginRight: '10px', padding: '5px 10px' }}>{playing ? 'Pause' : 'Play'}</button>
          <label htmlFor="speed-select" style={{ marginRight: '5px' }}>Speed:</label>
          <select id="speed-select" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} style={{ marginRight: '20px' }}>
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
          <label htmlFor="time-scrub" style={{ marginRight: '5px' }}>Time: {scenario.time[currentTimeIndex]?.toFixed(2)}</label>
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
            style={{ width: '200px' }}
          />
        </div>
        <div style={{ fontSize: '0.9em', color: '#666' }}>
          <strong>Tip:</strong> Use the time scrubber to explore the trajectory. Z (red) often crosses its threshold first, signaling ejection early.
        </div>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SpatialView scenario={scenario} currentTimeIndex={currentTimeIndex} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <DiagnosticsPanel scenario={scenario} currentTimeIndex={currentTimeIndex} />
        </div>
      </main>
      <footer style={{ padding: '10px', backgroundColor: '#f9f9f9', borderTop: '1px solid #ccc', fontSize: '0.9em' }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>Lead Times:</strong> In this scenario, ejection occurs at t = {scenario.ejectionTime}.<br />
          Z crosses its threshold at t = {scenario.firstCrossingTimes.Z} ({leadTimes.Z}% lead),<br />
          dI/dt at t = {scenario.firstCrossingTimes.dIdt} ({leadTimes.dIdt}% lead),<br />
          D_min at t = {scenario.firstCrossingTimes.Dmin} ({leadTimes.Dmin}% lead),<br />
          V_max at t = {scenario.firstCrossingTimes.Vmax} ({leadTimes.Vmax}% lead).
        </div>
        <DefinitionsPanel />
      </footer>
    </div>
  )
}

export default App