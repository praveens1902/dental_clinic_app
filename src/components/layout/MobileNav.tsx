import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  Menu, 
  X,
  MapPin,
  BarChart3,
  Settings,
  Layers,
  Sparkles,
  LogOut
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

export const MobileNav: React.FC = () => {
  const { mobileNavOpen, setMobileNavOpen, activeBranch, availableBranches, setActiveBranch } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const bottomNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Appts', path: '/appointments', icon: Calendar },
    { name: 'Billing', path: '/billing', icon: CreditCard },
  ]

  const handleBranchChange = (branchId: string) => {
    setActiveBranch(branchId)
  }

  return (
    <>
      {/* 1. BOTTOM NAVIGATION (Mobile Viewport: 320px - 767px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-40 shadow-lg">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          )
        })}

        {/* Menu Toggle button triggers slide-out panel */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            mobileNavOpen ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
          }`}
          aria-label="More Menu"
        >
          <Menu className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>

      {/* 2. DRAWER NAVIGATION (Slide-out Overlay for Tablet & Mobile) */}
      <div 
        className={`fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileNavOpen(false)}
      >
        <div 
          className={`fixed top-0 bottom-0 right-0 w-80 max-w-[85vw] bg-surface shadow-2xl transition-transform duration-300 ease-out flex flex-col z-50 ${
            mobileNavOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-primary">
                Sirona Menu
              </span>
            </div>
            <button 
              onClick={() => setMobileNavOpen(false)}
              className="p-1.5 rounded-lg border border-border hover:bg-background text-text-secondary hover:text-text-primary transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
            
            {/* Quick Navigation */}
            <div className="space-y-1">
              <p className="px-3.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Navigation</p>
              {[
                { name: 'Dashboard', path: '/', icon: LayoutDashboard },
                { name: 'Patients', path: '/patients', icon: Users },
                { name: 'Appointments', path: '/appointments', icon: Calendar },
                { name: 'Billing & Invoices', path: '/billing', icon: CreditCard },
                { name: 'Reports', path: '/reports', icon: BarChart3 },
                { name: 'Settings', path: '/settings', icon: Settings },
                { name: 'Foundation Demo', path: '/demo', icon: Layers },
              ].map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-button text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-premium' 
                        : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Branch Switcher section in Mobile Drawer */}
            <div className="space-y-2 border-t border-border pt-6">
              <p className="px-3.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Active Branch</p>
              <div className="grid grid-cols-1 gap-2 px-1">
                {availableBranches.map((branch) => {
                  const isSelected = activeBranch.id === branch.id
                  return (
                    <button
                      key={branch.id}
                      onClick={() => handleBranchChange(branch.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-primary-light/50 border-primary text-primary font-semibold' 
                          : 'border-border bg-white text-text-primary hover:bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
                        <span className="text-xs font-semibold truncate">{branch.name}</span>
                      </div>
                      <span className="text-[10px] text-text-secondary block truncate ml-5">{branch.address}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Simulated Active User */}
            {user && (
              <div className="border-t border-border pt-6 px-1 space-y-3">
                <div className="bg-background rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-border bg-white" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-text-primary truncate">{user.name}</span>
                      <span className="text-[10px] font-bold text-primary">{user.role}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false)
                      logout()
                    }}
                    className="p-2 rounded-xl bg-white border border-border hover:bg-background text-text-secondary hover:text-danger transition-colors cursor-pointer"
                    title="Log Out Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}