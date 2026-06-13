import React from 'react'
import { Building } from 'lucide-react'
import { BranchPerformanceRow } from '../types'

interface BranchComparisonProps {
  data: BranchPerformanceRow[]
}

export const BranchComparison: React.FC<BranchComparisonProps> = ({ data }) => {
  return (
    <div className="bg-white border border-border/80 rounded-xl p-5 shadow-premium space-y-4 text-left select-none">
      
      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-border/40 pb-3">
        <Building className="w-4.5 h-4.5 text-primary shrink-0" />
        <span>Multi-Branch Operating Stats</span>
      </h4>

      <div className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-sm text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-background/40 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              <th className="p-3 pl-4">Branch Office</th>
              <th className="p-3 text-center">Appointments</th>
              <th className="p-3 text-center">Active Patients</th>
              <th className="p-3 text-right">Collections (INR)</th>
              <th className="p-3 pr-4 text-right">Gross Billing (INR)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((b, idx) => (
              <tr key={idx} className="border-b border-border/30 last:border-b-0 font-semibold text-text-primary">
                <td className="p-3 pl-4 font-black">{b.branchName.split(' - ')[0]}</td>
                <td className="p-3 text-center font-bold">{b.appointments}</td>
                <td className="p-3 text-center font-bold">{b.activePatients}</td>
                <td className="p-3 text-right text-success font-black">₹{b.collections.toLocaleString()}</td>
                <td className="p-3 pr-4 text-right font-black">₹{b.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default BranchComparison
