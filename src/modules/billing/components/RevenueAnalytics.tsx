import React from 'react'
import { BillingDashboardSummary } from '../types'
import { billingService } from '../services/billingService'
import { Percent, TrendingUp, AlertTriangle } from 'lucide-react'

interface RevenueAnalyticsProps {
  summary: BillingDashboardSummary | null
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ summary }) => {
  if (!summary) return null

  const chartData = billingService.getRevenueChartData()

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Branch Revenue Breakdown Custom CSS Bar chart */}
      <div className="bg-white border border-border/80 rounded-xl p-5 shadow-premium space-y-4 select-none">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-border/40 pb-2">
          <TrendingUp className="w-4.5 h-4.5 text-primary shrink-0" />
          <span>Branch Revenue Share</span>
        </h4>

        <div className="space-y-4">
          {chartData.map((b) => {
            // Find max to scale height/width relative
            const pct = Math.round((b.collections / 95000) * 100)
            return (
              <div key={b.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span className="font-extrabold">{b.label}</span>
                  <span className="text-text-secondary/70">₹{b.collections.toLocaleString()} / ₹{b.revenue.toLocaleString()}</span>
                </div>
                {/* Visual bar */}
                <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-500"
                    style={{ width: `${pct}%` }}
                    title={`Collection Rate: ${pct}%`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Collection vs Outstanding rates gauge */}
      <div className="grid grid-cols-2 gap-4 select-none">
        
        {/* Collection rate card */}
        <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-success/5 border border-success/15 text-success flex items-center justify-center mx-auto">
            <Percent className="w-5 h-5 text-success shrink-0" />
          </div>
          <span className="text-[9px] text-text-secondary font-bold uppercase block">
            Collection Efficiency
          </span>
          <p className="text-xl font-black text-success leading-none">
            {summary.collectionRate}%
          </p>
          <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full"
              style={{ width: `${summary.collectionRate}%` }}
            />
          </div>
        </div>

        {/* Outstanding rate card */}
        <div className="bg-white border border-border/80 rounded-xl p-4.5 shadow-premium text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-danger/5 border border-danger/15 text-danger flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          </div>
          <span className="text-[9px] text-text-secondary font-bold uppercase block">
            Uncollected Deficit
          </span>
          <p className="text-xl font-black text-danger leading-none">
            {summary.outstandingRate}%
          </p>
          <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-danger rounded-full"
              style={{ width: `${summary.outstandingRate}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  )
}
export default RevenueAnalytics
