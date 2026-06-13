import React from 'react'
import { AppointmentAnalytics } from '../types'
import { Percent, UserCheck, AlertTriangle } from 'lucide-react'

interface AnalyticsWidgetsProps {
  analytics: AppointmentAnalytics | null
}

export const AnalyticsWidgets: React.FC<AnalyticsWidgetsProps> = ({ analytics }) => {
  if (!analytics) return null

  return (
    <div className="space-y-6 text-left">
      {/* 1. Doctor Utilization rates list */}
      <div className="bg-white border border-border/80 rounded-xl p-5 shadow-premium space-y-4 select-none">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-border/40 pb-2">
          <UserCheck className="w-4.5 h-4.5 text-primary shrink-0" />
          <span>Doctor Chair Utilization</span>
        </h4>

        <div className="space-y-3.5">
          {Object.entries(analytics.doctorUtilization).map(([docName, rate]) => (
            <div key={docName} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-text-primary">
                <span>{docName}</span>
                <span className="font-extrabold text-primary">{rate}%</span>
              </div>
              <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Cancellation and No-Show Circular Progress widgets */}
      <div className="grid grid-cols-2 gap-4 select-none">
        {/* Cancellation card */}
        <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-danger/5 border border-danger/10 text-danger flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          </div>
          <span className="text-[9px] text-text-secondary font-bold uppercase block">
            Cancellation Rate
          </span>
          <p className="text-xl font-black text-danger leading-none">
            {analytics.cancellationRate}%
          </p>
          <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-danger rounded-full"
              style={{ width: `${analytics.cancellationRate}%` }}
            />
          </div>
        </div>

        {/* No-Show Card */}
        <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-warning/5 border border-warning/15 text-warning-dark flex items-center justify-center mx-auto">
            <Percent className="w-5 h-5 text-warning-dark shrink-0" />
          </div>
          <span className="text-[9px] text-text-secondary font-bold uppercase block">
            No-Show Rate
          </span>
          <p className="text-xl font-black text-warning-dark leading-none">
            {analytics.noShowRate}%
          </p>
          <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-warning-dark rounded-full"
              style={{ width: `${analytics.noShowRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default AnalyticsWidgets
