import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers,
  Heart,
  Stethoscope,
  Activity,
  FolderOpen,
  ClipboardList,
  FileSpreadsheet,
  LogOut
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

export interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, permission: 'view_dashboard' },
  { name: 'Patients', path: '/patients', icon: Users, permission: 'view_patients' },
  { name: 'Appointments', path: '/appointments', icon: Calendar, permission: 'view_appointments' },
  { name: 'Medical History', path: '/medical-history', icon: Heart, permission: 'view_clinical_notes' },
  { name: 'Dental History', path: '/dental-history', icon: Stethoscope, permission: 'view_clinical_notes' },
  { name: 'Examination', path: '/examination', icon: Activity, permission: 'view_clinical_notes' },
  { name: 'Investigations', path: '/investigations', icon: FolderOpen, permission: 'view_clinical_notes' },
  { name: 'Clinical Notes', path: '/clinical-notes', icon: ClipboardList, permission: 'view_clinical_notes' },
  { name: 'Prescriptions', path: '/prescriptions', icon: FileSpreadsheet, permission: 'view_prescriptions' },
  { name: 'Billing & Invoices', path: '/billing', icon: CreditCard, permission: 'view_billing' },
  { name: 'Reports', path: '/reports', icon: BarChart3, permission: 'view_reports' },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Foundation Demo', path: '/demo', icon: Layers }, 
]

export const Sidebar: React.FC = () => {
  const { sidebarExpanded, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  // Filter items by user permissions
  const filteredItems = SIDEBAR_ITEMS.filter((item) => {
    if (!item.permission) return true
    if (!user) return false
    if (user.permissions.includes('all')) return true
    return user.permissions.includes(item.permission)
  })

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-surface border-r border-border transition-all duration-300 z-30 ${
        sidebarExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-b-border/80 shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          {sidebarExpanded && (
            <span className="font-heading text-xl font-bold tracking-tight text-primary transition-opacity duration-300">
              Sirona
            </span>
          )}
        </Link>
        {sidebarExpanded && (
          <span className="hidden lg:inline bg-primary-light text-primary text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
            SaaS
          </span>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          // Check if active or parent is active
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-button transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary text-white shadow-premium' 
                  : 'text-text-secondary hover:bg-background hover:text-text-primary'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-primary transition-colors'}`} />
              
              {sidebarExpanded ? (
                <span className="text-xs font-semibold tracking-wide transition-opacity duration-300">
                  {item.name}
                </span>
              ) : (
                <div className="absolute left-16 bg-text-primary text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Quick Profile Info at bottom with Logout */}
      {user && (
        <div className="p-4 border-t border-border bg-background/40 shrink-0">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-full border border-border bg-white"
              />
              {sidebarExpanded && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-text-primary truncate">{user.name}</span>
                  <span className="text-[10px] font-bold text-text-secondary truncate mt-0.5">{user.role}</span>
                </div>
              )}
            </div>
            
            {sidebarExpanded && (
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg border border-border hover:bg-background text-text-secondary hover:text-danger transition-colors cursor-pointer shrink-0"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collapse/Expand Floating Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-primary shadow-sm hover:shadow z-50 transition-all cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        {sidebarExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>
    </aside>
  )
}
export default Sidebar
