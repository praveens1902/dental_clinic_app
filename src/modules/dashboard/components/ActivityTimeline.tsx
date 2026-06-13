import React from 'react'
import { Users, Calendar, CreditCard, FileSpreadsheet, Activity, HelpCircle, Clock } from 'lucide-react'
import { DashboardActivity } from '../types'

interface ActivityTimelineProps {
  activities: DashboardActivity[]
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getCategoryStyles = (type: string) => {
    return {
      clinical: {
        icon: <Activity className="w-3.5 h-3.5" />,
        bg: 'bg-primary-light text-primary border-primary/20',
      },
      patient: {
        icon: <Users className="w-3.5 h-3.5" />,
        bg: 'bg-success/10 text-success border-success/20',
      },
      billing: {
        icon: <CreditCard className="w-3.5 h-3.5" />,
        bg: 'bg-info/10 text-info border-info/20',
      },
      prescription: {
        icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
        bg: 'bg-warning/10 text-warning border-warning/20',
      },
      system: {
        icon: <Calendar className="w-3.5 h-3.5" />,
        bg: 'bg-text-secondary/15 text-text-secondary border-border',
      },
    }[type] || {
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      bg: 'bg-background text-text-secondary border-border/80',
    }
  }

  return (
    <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-5">
      <div>
        <h3 className="text-base font-bold font-heading text-text-primary">Clinical Audit Activity Timeline</h3>
        <p className="text-[10px] font-semibold text-text-secondary">Chronological feed of patient check-ins, procedural edits, and checkout sessions.</p>
      </div>

      <div className="relative pl-4 border-l border-border/85 space-y-6 pt-1 ml-2">
        {activities.map((act) => {
          const style = getCategoryStyles(act.type)
          return (
            <div key={act.id} className="relative text-left">
              
              {/* Circular Dot Anchor */}
              <div className={`absolute -left-[25px] top-0 w-6.5 h-6.5 rounded-full border flex items-center justify-center bg-white ${style.bg}`}>
                {style.icon}
              </div>

              {/* Text Block */}
              <div className="min-w-0 pl-1.5 space-y-1">
                <p className="text-xs font-bold text-text-primary leading-tight">
                  {act.user} <span className="text-text-secondary/90 font-medium">{act.action}</span>
                </p>
                <div className="flex items-center gap-1 text-[9px] text-text-secondary/50 font-bold">
                  <Clock className="w-3 h-3 text-text-secondary/40" />
                  <span>{act.timestamp}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ActivityTimeline
