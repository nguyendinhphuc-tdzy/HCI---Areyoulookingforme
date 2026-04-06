import React, { useRef, useEffect } from 'react'
import { useAppStore } from '../../lib/store'

export default function CameraFeed() {
  const videoRef = useRef(null)
  const cameraPermission = useAppStore(state => state.cameraPermission)
  const viewMode = useAppStore(state => state.viewMode)

  useEffect(() => {
    let stream = null;
    
    // Only turn on camera if we have permission AND we are in AR mode
    if (cameraPermission === 'granted' && viewMode === 'AR') {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      .then(s => {
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(err => console.error("Could not start camera:", err))
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraPermission, viewMode])

  if (cameraPermission !== 'granted' || viewMode !== 'AR') return null;

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover scale-[1.05]"
      />
    </div>
  )
}
