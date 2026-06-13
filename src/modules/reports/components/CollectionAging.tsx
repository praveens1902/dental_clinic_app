import React from 'react'
import { AlertCircle, IndianRupee } from 'lucide-react'
import { AgingAnalysisRow } from '../types'

interface CollectionAgingProps {
  data: AgingAnalysisRow[]
}

export const CollectionAging: React.FC<CollectionAgingProps> = ({ data }) => {
  return (
    <div className="bg-white border border-border/80 rounded-xl p-5 shadow-premium space-y-4 text-left select-none">
      
      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5 border-b border-border/40 pb-3">
        <AlertCircle className="w-4.5 h-4.5 text-danger shrink-0" />
        <span>Outstanding Debtors Aging Analysis</span>
      </h4>

      <div className="grid grid-cols-1 gap-3.5">
        {data.map((row) => (
          <div key={row.ageGroup} className="border border-border/60 rounded-xl p-3 bg-background/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-border">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black text-danger uppercase bg-danger/5 border border-danger/10 px-2 py-0.5 rounded-full select-none">
                {row.ageGroup}
              </span>
              <p className="text-xs font-bold text-text-secondary">Outstanding bracket duration</p>
            </div>

            {/* Slider bar and value */}
            <div className="flex items-center gap-4 flex-1 justify-end max-w-md">
              <div className="hidden sm:block flex-1 bg-border/40 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger rounded-full"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>

              <div className="text-right shrink-0">
                <p className="text-[9px] font-bold text-text-secondary uppercase">Balance Due</p>
                <p className="text-sm font-black text-text-primary flex items-center justify-end gap-0.5 leading-none">
                  <IndianRupee className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                  <span>{row.amount.toLocaleString()}</span>
                  <span className="text-[10px] text-text-secondary/70 font-semibold ml-1">({row.percentage}%)</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default CollectionAging
