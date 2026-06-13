import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { IndianRupee, CreditCard } from 'lucide-react'
import { ClinicalNotesFormSchemaType } from '../schemas'

export const CostEstimationSection: React.FC = () => {
  const { control } = useFormContext<ClinicalNotesFormSchemaType>()
  const plannedTreatments = useWatch({ control, name: 'plannedTreatments' }) || []

  // Calculate sum totals
  const totals = React.useMemo(() => {
    let grandTotal = 0
    let completedTotal = 0
    let pendingTotal = 0

    plannedTreatments.forEach((p: any) => {
      const cost = Number(p.estimatedCost) || 0
      grandTotal += cost
      
      if (p.status === 'Completed') {
        completedTotal += cost
      } else if (p.status !== 'Cancelled') {
        pendingTotal += cost
      }
    })

    return { grandTotal, completedTotal, pendingTotal }
  }, [plannedTreatments])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Treatment Cost Estimation
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Synchronized cost projections generated automatically from the patient&apos;s treatment plan courses.
        </p>
      </div>

      {plannedTreatments.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
          No cost estimates available. Cost projections appear once treatment courses are added.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Detailed tabular cost sheet */}
          <div className="border border-border/60 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-background/40 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="p-3.5 pl-4">Treatment Proposed</th>
                    <th className="p-3.5">Tooth</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-4 text-right">Est. Cost (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {plannedTreatments.map((p: any, idx: number) => (
                    <tr key={p.id || idx} className="border-b border-border/30 last:border-b-0 text-xs font-semibold text-text-primary">
                      <td className="p-3.5 pl-4 font-bold">{p.treatmentName}</td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-black text-primary bg-primary-light px-2 py-0.5 rounded-full uppercase">
                          {p.toothNumber === 'All' ? 'Full Arch' : `#${p.toothNumber}`}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[9px] font-bold ${
                          p.priority === 'Urgent' ? 'text-danger' :
                          p.priority === 'High' ? 'text-orange-600' : 'text-text-secondary'
                        }`}>
                          {p.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[9px] font-black uppercase ${
                          p.status === 'Completed' ? 'text-success' :
                          p.status === 'In Progress' ? 'text-warning-dark' : 'text-text-secondary/70'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-4 text-right font-black flex items-center justify-end gap-0.5 mt-0.5">
                        <IndianRupee className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                        <span>{(Number(p.estimatedCost) || 0).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand summary financial card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Total Completed */}
            <div className="bg-success/5 border border-success/15 rounded-xl p-4 text-left space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Completed Revenue</span>
              <p className="text-xl font-black text-success flex items-center gap-0.5">
                <IndianRupee className="w-4.5 h-4.5 shrink-0" />
                <span>{totals.completedTotal.toLocaleString()}</span>
              </p>
              <p className="text-[9px] text-text-secondary/70 font-bold">Successfully finalized procedures.</p>
            </div>

            {/* Total Pending */}
            <div className="bg-warning/5 border border-warning/15 rounded-xl p-4 text-left space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Pending Estimation</span>
              <p className="text-xl font-black text-warning-dark flex items-center gap-0.5">
                <IndianRupee className="w-4.5 h-4.5 shrink-0" />
                <span>{totals.pendingTotal.toLocaleString()}</span>
              </p>
              <p className="text-[9px] text-text-secondary/70 font-bold">Scheduled future treatments.</p>
            </div>

            {/* Grand estimate */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-left space-y-1">
              <span className="text-[10px] font-bold text-text-secondary uppercase">Total Package Value</span>
              <p className="text-xl font-black text-primary flex items-center gap-0.5">
                <IndianRupee className="w-4.5 h-4.5 shrink-0" />
                <span>{totals.grandTotal.toLocaleString()}</span>
              </p>
              <p className="text-[9px] text-text-secondary/70 font-bold">Combined package cost forecast.</p>
            </div>

          </div>

          {/* Billing helper indicator */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex items-start gap-2.5 text-[10px] text-text-secondary leading-normal text-left">
            <CreditCard className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-primary mb-0.5">Future Billing &amp; Ledger Integration Ready:</p>
              <p className="font-medium">Completed treatments will automatically populate ledger invoices, ready for claim approvals or checkout payments.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default CostEstimationSection
