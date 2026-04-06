import React, { useMemo } from 'react'
import { useAppStore } from '../../lib/store'
import { KIOSK_LOCATION } from '../../lib/mockData'
import { calculateDistance } from '../../lib/utils'
import { Map, Glasses, Navigation } from 'lucide-react'

export default function NavigationOverlay() {
  const targetBooth = useAppStore(state => state.targetBooth)
  const viewMode = useAppStore(state => state.viewMode)
  const setViewMode = useAppStore(state => state.setViewMode)
  const currentLocation = useAppStore(state => state.currentLocation) || KIOSK_LOCATION

  const distance = useMemo(() => {
    if (!targetBooth) return 0
    return calculateDistance(currentLocation.lat, currentLocation.lng, targetBooth.lat, targetBooth.lng)
  }, [currentLocation, targetBooth])

  if (!targetBooth) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-40 p-4 sm:p-6 pointer-events-none flex flex-col gap-4">
      
      {/* Target Info Panel */}
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 pointer-events-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#ff6b3d]">
            <Navigation size={24} className="animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Navigating To</p>
            <h3 className="text-xl font-black text-slate-800 leading-tight">{targetBooth.name}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Left</p>
          <p className="text-2xl font-black text-[#5cc3ba] leading-tight">{distance}<span className="text-sm font-semibold">m</span></p>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex gap-3 w-full pointer-events-auto bg-white/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-white/50">
        <button 
          onClick={() => setViewMode('2D')}
          className={`flex-1 py-3 px-4 rounded-[1.2rem] font-bold flex items-center justify-center gap-2 transition-all duration-300
            ${viewMode === '2D' ? 'bg-white text-[#5cc3ba] shadow-sm scale-100' : 'bg-transparent text-slate-500 hover:text-slate-700 scale-95'}`}
        >
          <Map size={18} strokeWidth={2.5} />
          2D Map
        </button>
        <button 
          onClick={() => setViewMode('AR')}
          className={`flex-1 py-3 px-4 rounded-[1.2rem] font-bold flex items-center justify-center gap-2 transition-all duration-300
            ${viewMode === 'AR' ? 'bg-white text-[#ff6b3d] shadow-sm scale-100' : 'bg-transparent text-slate-500 hover:text-slate-700 scale-95'}`}
        >
          <Glasses size={18} strokeWidth={2.5} />
          AR View
        </button>
      </div>
      
    </div>
  )
}
