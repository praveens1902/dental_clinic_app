import { create } from 'zustand'

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
}

interface UIState {
  sidebarExpanded: boolean
  toggleSidebar: () => void
  setSidebarExpanded: (expanded: boolean) => void
  
  mobileNavOpen: boolean
  toggleMobileNav: () => void
  setMobileNavOpen: (open: boolean) => void

  activeBranch: Branch
  availableBranches: Branch[]
  setActiveBranch: (branchId: string) => void
}

const MOCK_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Sirona Elite - New Delhi', address: 'Connaught Place, New Delhi', phone: '+91 11 4567 8901' },
  { id: 'b2', name: 'Sirona Prime - Gurugram', address: 'DLF Phase 3, Gurugram', phone: '+91 124 567 8902' },
  { id: 'b3', name: 'Sirona Care - Noida', address: 'Sector 62, Noida', phone: '+91 120 456 8903' },
]

export const useUIStore = create<UIState>((set) => ({
  sidebarExpanded: true,
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  
  mobileNavOpen: false,
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  activeBranch: MOCK_BRANCHES[0],
  availableBranches: MOCK_BRANCHES,
  setActiveBranch: (branchId) => set((state) => {
    const branch = state.availableBranches.find((b) => b.id === branchId)
    return branch ? { activeBranch: branch } : {}
  }),
}))