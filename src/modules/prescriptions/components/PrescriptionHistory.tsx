import React from 'react'
import { Printer, Eye, Calendar, User, Pill, ArrowRight } from 'lucide-react'
import { Prescription } from '../types'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

interface PrescriptionHistoryProps {
  data: Prescription[]
  onView: (prescription: Prescription) => void
  onReprint: (prescription: Prescription) => void
}

export const PrescriptionHistory: React.FC<PrescriptionHistoryProps> = ({
  data,
  onView,
  onReprint,
}) => {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No Prescription History"
        description="Historic dental prescriptions and antibiotic packets will appear here once saved."
        icon={Pill}
      />
    )
  }

  return (
    <div className="space-y-3.5">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide text-left">
          Prescription History Log
        </p>
        <p className="text-xs text-text-secondary/70 mt-1 text-left">
          Track previous prescriptions, review dosages, or reprint official copies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((pres) => (
          <div
            key={pres.id}
            className="bg-white border border-border/80 rounded-xl p-4.5 space-y-3.5 hover:border-primary/20 hover:shadow-premium transition-all flex flex-col justify-between text-left"
          >
            {/* Header metadata */}
            <div className="flex items-start justify-between pb-2 border-b border-border/40 gap-4">
              <div className="space-y-0.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                  <Calendar className="w-3.5 h-3.5 text-text-secondary/50" />
                  <span>
                    {new Date(pres.prescriptionDate).toLocaleDateString([], {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <p className="text-xs font-black text-text-primary flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-text-secondary/40 shrink-0" />
                  <span>{pres.doctorName}</span>
                </p>
              </div>

              <span className="inline-flex text-[9px] font-black text-success bg-success/10 border border-success/15 px-2.5 py-0.5 rounded-full uppercase shrink-0">
                {pres.status}
              </span>
            </div>

            {/* Medicines List summary */}
            <div className="space-y-1.5 flex-1">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">
                Prescribed Medicines ({pres.medications.length})
              </span>
              <div className="space-y-1">
                {pres.medications.slice(0, 2).map((med) => (
                  <div key={med.id} className="text-xs font-semibold text-text-primary flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="font-extrabold truncate">{med.medicineName}</span>
                    <span className="text-[10px] text-text-secondary/80">({med.dosage} - {med.duration})</span>
                  </div>
                ))}
                {pres.medications.length > 2 && (
                  <p className="text-[10px] font-bold text-primary pl-3 flex items-center gap-0.5">
                    <span>and {pres.medications.length - 2} more medications</span>
                    <ArrowRight className="w-3 h-3" />
                  </p>
                )}
              </div>
            </div>

            {/* Follow-up info */}
            {pres.followUp && pres.followUp.followUpDate && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 flex items-center justify-between text-[10px] font-bold text-text-secondary leading-none shrink-0 select-none">
                <span>Next Suture / Checkup:</span>
                <span className="text-primary">
                  {new Date(pres.followUp.followUpDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                </span>
              </div>
            )}

            {/* Reprint triggers */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="xs"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => onView(pres)}
                className="flex-1 font-bold text-[10px] bg-white border-border/80 hover:bg-background"
              >
                Inspect
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => onReprint(pres)}
                className="font-bold text-[10px] bg-white border-border/80 hover:bg-background text-text-secondary hover:text-primary px-2.5"
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
export default PrescriptionHistory
