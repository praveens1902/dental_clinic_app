import React from 'react'
import { MapPin } from 'lucide-react'
import { BranchSummary } from '../types'

interface BranchPerformanceProps {
  branches: BranchSummary[]
}

export const BranchPerformance: React.FC<BranchPerformanceProps> = ({ branches }) => {
  // Shorthand currency formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-5">
      <div>
        <h3 className="text-base font-bold font-heading text-text-primary">Branch Operations Hub</h3>
        <p className="text-[10px] font-semibold text-text-secondary">Comparing total revenue allocations across physical locations.</p>
      </div>

      <div className="space-y-4">
        {branches.map((branch) => {
          // Calculate arbitrary performance percentage relative to a mock target (e.g. ₹5,00,000)
          const target = 500000
          const performancePercentage = Math.min(100, Math.round((branch.revenue / target) * 100))
          
          return (
            <div 
              key={branch.id} 
              className="p-3.5 bg-background/30 border border-border/40 rounded-xl space-y-3.5 hover:border-primary/20 transition-all"
            >
              {/* Branch Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <h4 className="text-xs font-bold text-text-primary truncate">{branch.branchName}</h4>
                </div>
                <span className="text-[9px] font-bold text-text-secondary bg-white border border-border px-2 py-0.5 rounded-full shrink-0">
                  {branch.branchCode}
                </span>
              </div>

              {/* Multi metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-text-secondary uppercase">Revenue</p>
                  <p className="text-xs font-bold text-primary">{formatCurrency(branch.revenue)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-text-secondary uppercase">Patients</p>
                  <p className="text-xs font-bold text-text-primary">{branch.activePatients}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-text-secondary uppercase">Appts</p>
                  <p className="text-xs font-bold text-info">{branch.appointments}</p>
                </div>
              </div>

              {/* Progress target indicator */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-text-secondary">
                  <span>Monthly Goal Target: {formatCurrency(target)}</span>
                  <span>{performancePercentage}%</span>
                </div>
                <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500" 
                    style={{ width: `${performancePercentage}%` }}
                  />
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
export default BranchPerformance
