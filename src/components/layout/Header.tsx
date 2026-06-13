import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Check, 
  MapPin,
  ShieldCheck,
  User,
  Settings as SettingsIcon,
  LogOut,
  Clock
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore, UserRole } from '@/store/authStore'
import { useAlertStore } from '@/store/alertStore'
import { useNotificationStore } from '@/store/notificationStore'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { toggleMobileNav, activeBranch, availableBranches, setActiveBranch } = useUIStore()
  const { user, loginAs, logout } = useAuthStore()
  const { addToast } = useAlertStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [branchSearch, setBranchSearch] = useState('')

  const handleBranchChange = (branchId: string) => {
    setActiveBranch(branchId)
    setBranchDropdownOpen(false)
    const newBranch = availableBranches.find(b => b.id === branchId)
    if (newBranch) {
      addToast({
        type: 'success',
        title: 'Branch Workspace Switched',
        message: `Now accessing Sirona clinic scope: ${newBranch.name}`,
      })
    }
  }

  const handleRoleChange = (role: UserRole) => {
    loginAs(role)
    setRoleDropdownOpen(false)
    addToast({
      type: 'info',
      title: 'Active SaaS Role Adjusted',
      message: `You are now interacting as an active ${role}`,
    })
  }

  // Auto-generate high-quality Breadcrumb based on URL pathname
  const generateBreadcrumb = () => {
    const path = location.pathname
    if (path === '/') return 'Home / Dashboard'
    
    const parts = path.split('/').filter(Boolean)
    const formatted = parts.map((part) => {
      // Decode and replace hyphens
      const name = decodeURIComponent(part).replace(/-/g, ' ')
      return name.charAt(0).toUpperCase() + name.slice(1)
    })
    
    return `Home / ${formatted.join(' / ')}`
  }

  const filteredBranches = availableBranches.filter((b) =>
    b.name.toLowerCase().includes(branchSearch.toLowerCase())
  )

  return (
    <header className="h-20 bg-surface border-b border-border/80 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
      
      {/* 1. LEFT HEADER PANEL: Mobile Menu Trigger + Dynamic Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileNav}
          className="md:hidden p-2 rounded-xl text-text-secondary hover:bg-background hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs and page context */}
        <div className="hidden sm:block space-y-0.5">
          <p className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest font-sans">
            {generateBreadcrumb()}
          </p>
          <h2 className="text-sm font-bold text-text-primary capitalize">
            {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).split('/')[0].replace(/-/g, ' ')}
          </h2>
        </div>
      </div>

      {/* 2. RIGHT HEADER ACTIONS */}
      <div className="flex items-center gap-3">
        
        {/* Search Command Palette floating trigger */}
        <button
          onClick={() => {
            // Emulate triggering Ctrl+K globally
            const event = new KeyboardEvent('keydown', {
              key: 'k',
              ctrlKey: true,
              bubbles: true,
              cancelable: true
            })
            window.dispatchEvent(event)
          }}
          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-background hover:bg-primary-light/30 border border-border/75 hover:border-primary/20 rounded-xl text-xs font-semibold text-text-secondary/70 transition-all cursor-pointer"
          title="Open Search Overlay (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-text-secondary shrink-0" />
          <span className="hidden lg:inline">Search console...</span>
          <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-white px-1.5 font-mono text-[9px] font-bold text-text-secondary/60">
            ⌘K
          </kbd>
        </button>

        {/* Dynamic Branch Switcher Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setBranchDropdownOpen(!branchDropdownOpen)
              setProfileDropdownOpen(false)
              setNotifDropdownOpen(false)
              setRoleDropdownOpen(false)
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 border rounded-xl transition-all cursor-pointer ${
              branchDropdownOpen ? 'bg-primary-light/50 border-primary text-primary font-bold' : 'bg-background hover:bg-background/80 border-border/70 text-text-primary text-xs font-semibold'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="truncate max-w-[140px]">{activeBranch.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          
          {branchDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-modal z-50 py-1.5">
              <div className="px-3.5 py-2 border-b border-border mb-2">
                <p className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Select Clinic Branch</p>
              </div>
              <div className="px-2.5 pb-2 mb-1.5">
                <input
                  type="text"
                  placeholder="Filter branch..."
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  className="w-full bg-background border border-border/80 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold focus:outline-none focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/10 text-text-primary"
                />
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {filteredBranches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchChange(branch.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-background text-left transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-semibold text-text-primary truncate">{branch.name}</span>
                      <span className="text-[9px] text-text-secondary truncate mt-0.5">{branch.address}</span>
                    </div>
                    {activeBranch.id === branch.id && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Multi-Role Prototyping Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen)
              setProfileDropdownOpen(false)
              setNotifDropdownOpen(false)
              setBranchDropdownOpen(false)
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 bg-primary-light border rounded-xl transition-all cursor-pointer ${
              roleDropdownOpen ? 'border-primary ring-2 ring-primary/10' : 'border-primary/20 hover:border-primary/50'
            } text-primary text-xs font-bold`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Role: {user?.role}</span>
            <span className="sm:hidden">{user?.role.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-modal z-50 py-1">
              <div className="px-3.5 py-2 border-b border-border">
                <p className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Simulate SaaS Role</p>
              </div>
              {(['Super Admin', 'Clinic Admin', 'Doctor', 'Receptionist', 'Accountant'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-background text-left transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-text-primary">{role}</span>
                  {user?.role === role && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Center Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen)
              setProfileDropdownOpen(false)
              setBranchDropdownOpen(false)
              setRoleDropdownOpen(false)
            }}
            className={`p-2.5 rounded-xl transition-all relative shrink-0 cursor-pointer ${
              notifDropdownOpen ? 'bg-primary-light text-primary' : 'bg-background text-text-secondary hover:text-primary hover:bg-primary-light'
            }`}
            aria-label="Toggle Notification Feed"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount() > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-surface animate-pulse"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-modal z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between bg-background/20">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-text-primary">Inbox Feed</span>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount()} new</span>
                </div>
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-border/40">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-text-secondary/50">
                    No system messages logged.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        markAsRead(n.id)
                        addToast({
                          type: 'info',
                          title: n.title,
                          message: n.message,
                        })
                      }}
                      className={`p-3.5 text-left hover:bg-background/30 transition-colors cursor-pointer relative ${
                        !n.isRead ? 'bg-primary-light/10' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          {
                            clinical: 'bg-primary-light text-primary',
                            billing: 'bg-success/10 text-success',
                            appointment: 'bg-info/10 text-info',
                            system: 'bg-text-secondary/15 text-text-secondary'
                          }[n.type]
                        }`}>
                          {n.type}
                        </span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-text-primary mt-1.5">{n.title}</h4>
                      <p className="text-[10px] font-medium text-text-secondary/80 mt-1 leading-normal line-clamp-2">{n.message}</p>
                      
                      <div className="flex items-center gap-1 text-[9px] text-text-secondary/60 mt-2 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen)
                setNotifDropdownOpen(false)
                setBranchDropdownOpen(false)
                setRoleDropdownOpen(false)
              }}
              className="flex items-center gap-2 p-1 bg-background hover:bg-background/80 rounded-full border border-border/70 transition-all cursor-pointer"
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-border" />
              <ChevronDown className="w-4 h-4 text-text-secondary pr-1 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-modal z-50 py-1.5">
                <div className="px-4 py-2 border-b border-border/80">
                  <p className="text-xs font-bold text-text-primary">{user.name}</p>
                  <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{user.email}</p>
                  <span className="inline-block mt-2 bg-primary-light text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {user.role}
                  </span>
                </div>
                <div className="py-1 border-b border-border/40">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      navigate('/profile')
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-text-primary hover:bg-background transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-text-secondary" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      navigate('/settings')
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-text-primary hover:bg-background transition-colors cursor-pointer"
                  >
                    <SettingsIcon className="w-4 h-4 text-text-secondary" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-danger hover:bg-background transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  )
}
export default Header
