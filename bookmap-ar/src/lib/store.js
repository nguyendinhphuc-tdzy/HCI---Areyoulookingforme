import { create } from 'zustand'
import { supabase } from './supabaseClient'

export const useAppStore = create((set) => ({
  targetBooth: null,
  setTargetBooth: (booth) => set({ targetBooth: booth }),
  
  currentLocation: null,
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
  
  viewMode: '2D', // '2D' or 'AR'
  setViewMode: (mode) => set({ viewMode: mode }),
  
  cameraPermission: 'prompt', // 'prompt', 'granted', 'denied'
  setCameraPermission: (status) => set({ cameraPermission: status }),

  booths: [],
  isFetchingBooths: false,
  fetchBooths: async () => {
    set({ isFetchingBooths: true })
    try {
      // Connect to backend API via environment variable
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/booths`)
      const data = await response.json()

      set({ booths: data, isFetchingBooths: false })
    } catch (error) {
      console.error('Failed to fetch booths:', error)
      // Fallback dummy data if backend fails
      const fallbackData = [
        { id: 'B1', name: 'Kim Đồng', category: 'Truyện Tranh', location: { x: 10, y: 0, z: 15 }, description: 'Nhà xuất bản Kim Đồng' },
      ];
      set({ booths: fallbackData, isFetchingBooths: false })
    }
  }
}))
