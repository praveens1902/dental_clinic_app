import React from 'react'

interface KPICardProps {
  title: string
  value: string | number
  trend: string
  icon: React.ReactNode
  color: string // Tailwind bg class, e.g. "bg-primary-light"
  trendType?: 'positive' | 'negative' | 'neutral'
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  icon,
  color,
  trendType = 'positive',
}) => {
  const trendColorClass = {
    positive: 'text-primary font-bold bg-primary-light/50 border border-primary/10',
    negative: 'text-danger font-bold bg-danger/10 border border-danger/10',
    neutral: 'text-text-secondary font-bold bg-background border border-border',
  }[trendType]

  return (
    <div className="bg-white border border-border/80 rounded-card p-5 shadow-premium flex items-start justify-between relative group hover:shadow-premium-hover transition-all duration-200">
      <div className="space-y-3.5 min-w-0">
        <p className="text-xs font-semibold text-text-secondary truncate">{title}</p>
        <div className="space-y-1.5">
          <h3 className="text-2.5xl font-bold font-heading text-text-primary leading-none tracking-tight">
            {value}
          </h3>
          <div className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-full ${trendColorClass}`}>
            {trend}
          </div>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ${color}`}>
        {icon}
      </div>
    </div>
  )
}
export default KPICard
