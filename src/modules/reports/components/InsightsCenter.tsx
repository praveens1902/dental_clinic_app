import React from 'react'
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { InsightCardItem } from '../types'

interface InsightsCenterProps {
  insights: InsightCardItem[]
}

export const InsightsCenter: React.FC<InsightsCenterProps> = ({ insights }) => {
  return (
    <div className="bg-white border border-border/80 rounded-xl p-5 shadow-premium space-y-4 text-left select-none">
      
      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-border/40 pb-3">
        <Sparkles className="w-4.5 h-4.5 text-primary shrink-0 animate-pulse" />
        <span>Sirona AI Clinical Insights</span>
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => {
          let style = 'bg-primary-light/5 border-primary/10 text-primary'
          let Icon = Info
          if (ins.type === 'success') {
            style = 'bg-success/5 border-success/10 text-success'
            Icon = CheckCircle2
          } else if (ins.type === 'warning') {
            style = 'bg-warning/5 border-warning/15 text-warning-dark'
            Icon = AlertTriangle
          }

          return (
            <div
              key={ins.id}
              className={`border rounded-xl p-4 flex gap-3.5 items-start ${style} hover:shadow-premium transition-all`}
            >
              <div className="p-1.5 bg-white rounded-full shadow-sm shrink-0">
                <Icon className="w-4.5 h-4.5 shrink-0" />
              </div>
              <div className="space-y-1 min-w-0">
                <h5 className="text-xs font-black text-text-primary leading-tight truncate">
                  {ins.title}
                </h5>
                <p className="text-[10px] text-text-secondary leading-normal font-semibold">
                  {ins.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default InsightsCenter
