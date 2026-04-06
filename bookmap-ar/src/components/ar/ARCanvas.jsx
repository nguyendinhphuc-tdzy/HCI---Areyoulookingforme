import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { DeviceOrientationControls, Dodecahedron, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../lib/store'

// A placeholder for The Little Prince character & beacon
function WaypointIndicator({ position }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5
    }
  })

  return (
    <group position={position}>
      {/* Bobbing magical crystal */}
      <mesh ref={meshRef}>
        <Dodecahedron args={[1.5, 0]}>
          <MeshDistortMaterial color="#ff6b3d" speed={2} distort={0.4} />
        </Dodecahedron>
      </mesh>
      
      {/* Light beam pointing up */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.2, 1.5, 15, 16]} />
        <meshBasicMaterial color="#5cc3ba" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Stand-in for Little Prince model */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  )
}

function Scene() {
  const targetBooth = useAppStore(state => state.targetBooth)
  
  // Calculate relative bearing. For now, we mock a bearing relative to North.
  const targetPosition = useMemo(() => {
    if (!targetBooth) return [0, 0, -10] // Default 10m ahead
    // Mock mapping: Distribute booths in 30 deg increments to simulate real directions
    const idx = parseInt(targetBooth.id.replace('B', '')) || 1
    const angle = (idx * 30) * Math.PI / 180 
    const distance = 15 // 15 meters away
    return [Math.sin(angle) * distance, 0, -Math.cos(angle) * distance]
  }, [targetBooth])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* DeviceOrientationControls syncs the camera with phone's gyroscope/compass */}
      <DeviceOrientationControls />
      
      {/* Target Marker beacon */}
      <WaypointIndicator position={targetPosition} />
      
      {/* A simple ground grid to ground the AR objects below the camera */}
      <gridHelper args={[100, 100, '#5cc3ba', '#ccc']} position={[0, -3, 0]} />
    </>
  )
}

export default function ARCanvas() {
  const viewMode = useAppStore(state => state.viewMode)
  const cameraPermission = useAppStore(state => state.cameraPermission)

  if (viewMode !== 'AR' || cameraPermission !== 'granted') return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 1.6, 0], fov: 70 }} 
        style={{ pointerEvents: 'none' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
