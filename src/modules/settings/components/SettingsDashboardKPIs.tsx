import React from 'react'
import { Users, UserCheck, Building, Key, Bell, ShieldAlert } from 'lucide-react'
import { SettingsDashboardSummary } from '../types'

interface SettingsDashboardKPIsProps {
  summary: SettingsDashboardSummary | null
}

export const SettingsDashboardKPIs: React.FC<SettingsDashboardKPIsProps> = ({ summary }) => {
  if (!summary) return null

  const CARDS = [
    { label: 'Total Users', value: summary.totalUsers, icon: <Users className="w-4.5 h-4.5 text-primary" />, bgClass: 'bg-primary/5 border-primary/10', textClass: 'text-primary' },
    { label: 'Active Sessions', value: summary.activeUsers, icon: <UserCheck className="w-4.5 h-4.5 text-success" />, bgClass: 'bg-success/5 border-success/10', textClass: 'text-success' },
    { label: 'Active Branches', value: summary.totalBranches, icon: <Building className="w-4.5 h-4.5 text-blue-500" />, bgClass: 'bg-blue-50/50 border-blue-100', textClass: 'text-blue-600' },
    { label: 'System Roles', value: summary.rolesConfigured, icon: <Key className="w-4.5 h-4.5 text-indigo-500" />, bgClass: 'bg-indigo-50/50 border-indigo-100', textClass: 'text-indigo-600' },
    { label: 'Queue Alerts', value: summary.pendingNotifications, icon: <Bell className="w-4.5 h-4.5 text-warning-dark" />, bgClass: 'bg-warning/5 border-warning/15', textClass: 'text-warning-dark' },
    { label: 'Audit Logs today', value: summary.auditEventsToday, icon: <ShieldAlert className="w-4.5 h-4.5 text-danger" />, bgClass: 'bg-danger/5 border-danger/10', textClass: 'text-danger' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-premium transition-all hover:scale-[1.01] select-none ${card.bgClass}`}
        >
          <div className="p-2 bg-white rounded-full shadow-sm mb-1.5 shrink-0">
            {card.icon}
          </div>
          <span className="text-[9px] font-bold text-text-secondary uppercase">
            {card.label}
          </span>
          <p className={`text-lg font-black mt-1 leading-none ${card.textClass}`}>
            {card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
export default SettingsDashboardKPIs
