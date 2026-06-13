import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, CalendarPlus, FileText, FilePlus } from 'lucide-react'
import { useAlertStore } from '@/store/alertStore'

export const QuickActions: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useAlertStore()

  const actions = [
    { label: 'Register Patient', desc: 'Add new client chart', icon: <UserPlus className="w-5 h-5 text-primary" />, link: '/patients', color: 'bg-primary-light/80 text-primary border-primary/10' },
    { label: 'Book Appointment', desc: 'Assign doctor seat slot', icon: <CalendarPlus className="w-5 h-5 text-info" />, link: '/appointments', color: 'bg-info/10 text-info border-info/10' },
    {label: 'Collect Billing', desc: 'Itemize procedural checkout', icon: <FileText className="w-5 h-5 text-success" />, link: '/billing', color: 'bg-success/10 text-success border-success/10' },
    { label: 'Add Prescription', desc: 'Draft Rx medicament dosages', icon: <FilePlus className="w-5 h-5 text-text-secondary" />, link: '/prescriptions', color: 'bg-text-secondary/15 text-text-secondary border-border/80' },
  ]

  const handleAction = (label: string, link: string) => {
    addToast({
      type: 'success',
      title: 'Action Triggered',
      message: `Opened quick action console: ${label}`,
    })
    navigate(link)
  }

  return (
    <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-5">
      <div>
        <h3 className="text-base font-bold font-heading text-text-primary">Clinical Quick Commands</h3>
        <p className="text-[10px] font-semibold text-text-secondary">Perform rapid, backend-ready operational tasks with a single click.</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {actions.map((act) => (
          <button
            key={act.label}
            onClick={() => handleAction(act.label, act.link)}
            className="flex flex-col text-left p-3.5 border hover:border-primary/30 rounded-xl transition-all hover:bg-primary-light/5 hover:shadow-sm cursor-pointer group space-y-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${act.color}`}>
              {act.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{act.label}</h4>
              <p className="text-[9px] font-semibold text-text-secondary/80 mt-1 leading-normal">{act.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
export default QuickActions
