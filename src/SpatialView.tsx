import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { ScenarioData } from './types'

interface SpatialViewProps {
  scenario: ScenarioData
  currentTimeIndex: number
}

export function SpatialView({ scenario, currentTimeIndex }: SpatialViewProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()

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

    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)

      // Update positions
      const positions = scenario.positions[currentTimeIndex]
      if (positions) {
        bodies.forEach((body, i) => {
          body.position.set(positions[i][0], positions[i][1], positions[i][2])
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [scenario, currentTimeIndex])

  return <div ref={mountRef} style={{ width: '50%', height: '50%' }} />
}