import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import { ScenarioData } from './types'
import { ScenarioSelector } from './ScenarioSelector'
import { DefinitionsPanel } from './DefinitionsPanel'
import { scenarios } from './scenarios'

function OnboardingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to the Three-Body Problem Visualizer</h2>
        <p>This app demonstrates how the Z diagnostic provides early warnings for ejection events in three-body systems.</p>
        <ul>
          <li>Select a scenario from the dropdown.</li>
          <li>Use the time scrubber to explore trajectories.</li>
          <li>Watch Z (red curve) cross its threshold first.</li>
          <li>Check lead times in the footer.</li>
        </ul>
        <button onClick={onClose}>Get Started</button>
      </div>
    </div>
  )
}

const SpatialView = lazy(() => import('./SpatialView').then(module => ({ default: module.SpatialView })))
const DiagnosticsPanel = lazy(() => import('./DiagnosticsPanel').then(module => ({ default: module.DiagnosticsPanel })))

function App() {
  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [loading, setLoading] = useState(true)
     const [currentTimeIndex, setCurrentTimeIndex] = useState(0)
     const [selectedScenarioId, setSelectedScenarioId] = useState('equal-mass-ejecting')
     const [playing, setPlaying] = useState(false)
     const [speed, setSpeed] = useState(1)
     const [viewMode, setViewMode] = useState<'physical' | 'triangle'>('physical')
     const [showOnboarding, setShowOnboarding] = useState(() => {
       const hasSeen = localStorage.getItem('hasSeenOnboarding')
       return !hasSeen
     })

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

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  return (
    <div className="app-container">
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      <header className="app-header">
        <ScenarioSelector
          scenarios={scenarios}
          selectedScenarioId={selectedScenarioId}
          onScenarioChange={setSelectedScenarioId}
        />
        <h1 className="app-title">{scenario.scenario}</h1>
        <div className="app-controls">
           <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
           <div>
             <label htmlFor="speed-select">Speed:</label>
             <select id="speed-select" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}>
               <option value={0.25}>0.25x</option>
               <option value={0.5}>0.5x</option>
               <option value={1}>1x</option>
               <option value={2}>2x</option>
               <option value={4}>4x</option>
             </select>
           </div>
           <div>
             <label htmlFor="view-mode-select">View:</label>
             <select id="view-mode-select" value={viewMode} onChange={(e) => setViewMode(e.target.value as 'physical' | 'triangle')}>
               <option value="physical">Physical</option>
               <option value="triangle">Triangle</option>
             </select>
           </div>
          <div className="app-time-control">
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
        </div>
        <div className="app-tip">
          <strong>Tip:</strong> Use the time scrubber to explore the trajectory. Z (red) often crosses its threshold first, signaling ejection early.
        </div>
      </header>
      <main className="app-main">
        <div className="app-spatial-view">
           <Suspense fallback={<div>Loading 3D view...</div>}>
             <SpatialView scenario={scenario} currentTimeIndex={currentTimeIndex} viewMode={viewMode} setViewMode={setViewMode} />
           </Suspense>
         </div>
        <div className="app-diagnostics-panel">
          <Suspense fallback={<div>Loading diagnostics...</div>}>
            <DiagnosticsPanel scenario={scenario} currentTimeIndex={currentTimeIndex} />
          </Suspense>
        </div>
      </main>
      <footer className="app-footer">
        <div className="lead-times">
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