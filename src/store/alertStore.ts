import { create } from 'zustand'

export type AlertType = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id: string
  type: AlertType
  title: string
  message?: string
  duration?: number // ms
}

export interface Banner {
  id: string
  type: AlertType
  message: string
  dismissible?: boolean
}

export interface ModalAlert {
  isOpen: boolean
  type: AlertType
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

interface AlertState {
  toasts: Toast[]
  banners: Banner[]
  modalAlert: ModalAlert | null
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  
  // Banner actions
  addBanner: (banner: Omit<Banner, 'id'>) => string
  removeBanner: (id: string) => void
  
  // Modal Alert actions
  showModalAlert: (alert: Omit<ModalAlert, 'isOpen'>) => void
  hideModalAlert: () => void
}

export const useAlertStore = create<AlertState>((set) => ({
  toasts: [],
  banners: [],
  modalAlert: null,

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))
    
    // Auto-dismiss if duration specified or defaults to 4000ms
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
    
    return id
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),

  addBanner: (banner) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newBanner = { ...banner, id }
    set((state) => ({ banners: [...state.banners, newBanner] }))
    return id
  },

  removeBanner: (id) => set((state) => ({
    banners: state.banners.filter((b) => b.id !== id),
  })),

  showModalAlert: (alert) => set({
    modalAlert: { ...alert, isOpen: true },
  }),

  hideModalAlert: () => set((state) => ({
    modalAlert: state.modalAlert ? { ...state.modalAlert, isOpen: false } : null,
  })),
}))