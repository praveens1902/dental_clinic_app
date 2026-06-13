import { create } from 'zustand'

export interface OverlayConfig {
  id: string
  isOpen: boolean
  title: string
  content: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  onClose?: () => void
}

interface OverlayState {
  modals: Record<string, OverlayConfig>
  drawers: Record<string, OverlayConfig>
  
  openModal: (config: Omit<OverlayConfig, 'isOpen'>) => void
  closeModal: (id: string) => void
  
  openDrawer: (config: Omit<OverlayConfig, 'isOpen'>) => void
  closeDrawer: (id: string) => void
}

export const useOverlayStore = create<OverlayState>((set) => ({
  modals: {},
  drawers: {},

  openModal: (config) => set((state) => ({
    modals: {
      ...state.modals,
      [config.id]: { ...config, isOpen: true },
    },
  })),

  closeModal: (id) => set((state) => {
    const modal = state.modals[id]
    if (!modal) return {}
    
    // Call onClose callback if defined
    if (modal.onClose) modal.onClose()
    
    const updatedModals = { ...state.modals }
    delete updatedModals[id]
    
    return { modals: updatedModals }
  }),

  openDrawer: (config) => set((state) => ({
    drawers: {
      ...state.drawers,
      [config.id]: { ...config, isOpen: true },
    },
  })),

  closeDrawer: (id) => set((state) => {
    const drawer = state.drawers[id]
    if (!drawer) return {}
    
    // Call onClose callback if defined
    if (drawer.onClose) drawer.onClose()
    
    const updatedDrawers = { ...state.drawers }
    delete updatedDrawers[id]
    
    return { drawers: updatedDrawers }
  }),
}))