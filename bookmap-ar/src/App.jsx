import React, { useEffect } from 'react'
import { useAppStore } from './lib/store'
import { BOOTHS } from './lib/mockData'
import Onboarding from './components/ui/Onboarding'
import NavigationOverlay from './components/ui/NavigationOverlay'
import Map2D from './components/ui/Map2D'
import CameraFeed from './components/ar/CameraFeed'
import ARCanvas from './components/ar/ARCanvas'
import ARFlowDemo from './components/demo/ARFlowDemo'

function App() {
  const setTargetBooth = useAppStore(state => state.setTargetBooth)

  useEffect(() => {
    // Parse URL parameters, e.g., ?booth=B2
    const params = new URLSearchParams(window.location.search)
    const boothId = params.get('booth') || 'B1' // Default demo booth
    
    const booth = BOOTHS.find(b => b.id === boothId)
    if (booth) setTargetBooth(booth)
      
  }, [setTargetBooth])

  return (
    <ARFlowDemo />
  )
}

export default App
