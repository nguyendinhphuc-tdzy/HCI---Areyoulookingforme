import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../lib/store'
import { KIOSK_LOCATION } from '../../lib/mockData'
import { Navigation } from 'lucide-react'

export default function Map2D() {
  const targetBooth = useAppStore(state => state.targetBooth)
  const currentLocation = useAppStore(state => state.currentLocation) || KIOSK_LOCATION
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#f4f3ec] z-10 flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full max-w-md mx-auto shadow-2xl bg-[#fdfdfc] border-x border-[#5cc3ba]/20 overflow-hidden">
        {/* Soft Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#5cc3ba 1px, transparent 1px), linear-gradient(90deg, #5cc3ba 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        ></div>
        
        {/* Draw a dashed line from current (mocked center) to target (mocked offset) */}
        {targetBooth && (
          <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            {/* Soft shadow line */}
            <line x1="50%" y1="70%" x2="50%" y2="25%" stroke="#ff6b3d" strokeWidth="6" strokeDasharray="12 12" strokeLinecap="round" className="opacity-20 translate-y-2" />
            {/* Main dashed line */}
            <line x1="50%" y1="70%" x2="50%" y2="25%" stroke="#ff6b3d" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" className="animate-[dash_20s_linear_infinite]" />
            <style>
              {`@keyframes dash { to { stroke-dashoffset: -1000; } }`}
            </style>
          </svg>
        )}

        {/* User Marker */}
        <div className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-5 h-5 bg-[#5cc3ba] rounded-full border-[3px] border-white shadow-lg relative z-10">
            <div className="absolute -inset-6 border-2 border-[#5cc3ba] rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="mt-3 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md border border-[#5cc3ba]/20 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#5cc3ba] animate-pulse"></div>
             <p className="text-[11px] font-black text-slate-700 tracking-wider uppercase">You are here</p>
          </div>
        </div>

        {/* Target Marker */}
        {targetBooth && (
          <motion.div 
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="absolute left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
          >
            <div className="w-14 h-14 bg-gradient-to-tr from-[#ff6b3d] to-[#ff8c6b] rounded-full flex items-center justify-center shadow-lg mb-3 border-4 border-white relative z-10 text-white shadow-[0_4px_15px_rgba(255,107,61,0.5)]">
               <Navigation size={24} className="fill-white" />
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl border border-[#ff6b3d]/10 text-center max-w-[160px]">
              <p className="text-[10px] font-bold text-[#ff6b3d] uppercase tracking-widest leading-none mb-1">Destination</p>
              <p className="text-sm font-black text-slate-800 leading-tight">{targetBooth.name}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
