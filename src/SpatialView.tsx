import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ScenarioData } from './types'

interface SpatialViewProps {
  scenario: ScenarioData
  currentTimeIndex: number
}

export function SpatialView({ scenario, currentTimeIndex }: SpatialViewProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const bodiesRef = useRef<THREE.Mesh[]>([])
  const trailsRef = useRef<THREE.Line[]>([])
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize scene once
    if (!sceneRef.current) {
      const scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000)
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer()
      rendererRef.current = renderer
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
      mountRef.current.appendChild(renderer.domElement)

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)

      // Add bodies
      const bodies: THREE.Mesh[] = []
      const colors = [0xff0000, 0x00ff00, 0x0000ff] // Red, green, blue

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32)
        const material = new THREE.MeshLambertMaterial({ color: colors[i] })
        const sphere = new THREE.Mesh(geometry, material)
        bodies.push(sphere)
        scene.add(sphere)
      }
      bodiesRef.current = bodies

      // Add orbit trails
      const trails: THREE.Line[] = []
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry()
        const material = new THREE.LineBasicMaterial({ color: colors[i], transparent: true, opacity: 0.7 })
        const line = new THREE.Line(geometry, material)
        trails.push(line)
        scene.add(line)
      }
      trailsRef.current = trails

      camera.position.z = 5

      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05

      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }
      animate()
    }

    // Update trails up to current time
    const trails = trailsRef.current
    for (let i = 0; i < 3; i++) {
      const trailPoints: THREE.Vector3[] = []
      for (let t = 0; t <= currentTimeIndex; t++) {
        const pos = scenario.positions[t]
        if (pos) {
          trailPoints.push(new THREE.Vector3(pos[i][0], pos[i][1], pos[i][2]))
        }
      }
      trails[i].geometry.setFromPoints(trailPoints)
    }

    // Update positions
    const positions = scenario.positions[currentTimeIndex]
    if (positions && bodiesRef.current) {
      bodiesRef.current.forEach((body, i) => {
        body.position.set(positions[i][0], positions[i][1], positions[i][2])
      })
    }

    return () => {
      // Cleanup on unmount
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [scenario, currentTimeIndex])

  return (
    <div style={{ position: 'relative', width: '50%', height: '50%' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        t = {scenario.time[currentTimeIndex]?.toFixed(2)}
      </div>
    </div>
  )
}