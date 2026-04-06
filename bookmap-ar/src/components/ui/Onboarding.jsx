import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../lib/store'
import { Camera } from 'lucide-react'

export default function Onboarding() {
  const setCameraPermission = useAppStore(state => state.setCameraPermission)

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      // Permission granted, stop stream immediately. ARCanvas will request it later
      stream.getTracks().forEach(track => track.stop())
      setCameraPermission('granted')
    } catch (err) {
      console.error('Camera access denied:', err)
      setCameraPermission('denied')
      alert('Camera access is required for the AR experience. Using 2D map mode instead.')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/40 backdrop-blur-xl"
    >
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center border overflow-hidden relative">
        {/* Soft Background decorations */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="w-24 h-24 bg-[#5cc3ba]/10 rounded-full flex items-center justify-center mb-6 text-[#5cc3ba] relative z-10 shadow-inner">
          <Camera size={44} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-3 font-sans relative z-10">
          Welcome to <span className="text-[#ff6b3d]">BookMap AR</span>!
        </h2>
        
        <p className="text-slate-500 mb-8 leading-relaxed font-medium relative z-10">
          To help The Little Prince guide you, please allow camera access to show directions in the real world.
        </p>
        
        <button 
          onClick={requestPermission}
          className="w-full py-4 rounded-2xl bg-[#5cc3ba] text-white font-bold text-lg shadow-[0_8px_20px_-6px_rgba(92,195,186,0.6)] hover:scale-105 transition-all active:scale-95 relative z-10"
        >
          Enable Camera
        </button>
      </div>
    </motion.div>
  )
}
