import React from 'react'
import { Stethoscope, Sparkles, AlertTriangle, AlertCircle, Clock, User, Heart } from 'lucide-react'
import { DentalHistorySummary, DentalHistory } from '../types'

interface DentalHistorySummaryCardProps {
  summary: DentalHistorySummary | null
  history: DentalHistory | null
  isLoading?: boolean
}

export const DentalHistorySummaryCard: React.FC<DentalHistorySummaryCardProps> = ({
  summary,
  history,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium animate-pulse space-y-4">
        <div className="h-4 bg-border/60 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-border/60 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!summary || !history) {
    return (
      <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium">
        <div className="text-center py-8">
          <Heart className="w-8 h-8 text-text-secondary/40 mx-auto mb-2 animate-pulse" />
          <h3 className="text-sm font-bold text-text-secondary/60">No Summary Available</h3>
          <p className="text-[10px] text-text-secondary/40 mt-1">
            Dental history has not been recorded for this patient yet.
          </p>
        </div>
      </div>
    )
  }

  const activeComplaints = history.complaints.filter((c) => c.hasComplaint)
  const activeHabits = history.habits.filter((h) => h.hasHabit)

  return (
    <div className="space-y-4">
      {/* Visual Header / Score Gauge */}
      <div className="p-3 rounded-xl border flex items-center justify-between bg-primary-light/10 border-primary/10">
        <div className="flex items-center gap-2">
          <Heart className="w-4.5 h-4.5 text-primary" />
          <span className="text-xs font-bold text-text-primary">Oral Score Rating</span>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
          summary.overallOralHealthRating === 'Excellent' ? 'bg-success/15 text-success' :
          summary.overallOralHealthRating === 'Good' ? 'bg-primary-light text-primary' :
          summary.overallOralHealthRating === 'Fair' ? 'bg-warning/15 text-warning-dark' : 'bg-danger/15 text-danger'
        }`}>
          {summary.overallOralHealthRating} ({summary.overallOralHealthScore})
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary-light border border-primary/10 rounded-xl p-3 flex flex-col items-center text-center">
          <Stethoscope className="w-4 h-4 text-primary mb-1" />
          <span className="text-base font-extrabold text-text-primary">{summary.previousTreatmentsCount}</span>
          <span className="text-[9px] font-bold text-text-secondary uppercase">Treatments</span>
        </div>
        <div className="bg-success/5 border border-success/10 rounded-xl p-3 flex flex-col items-center text-center">
          <Sparkles className="w-4 h-4 text-success mb-1" />
          <span className="text-base font-extrabold text-text-primary">{summary.oralHygieneRating}</span>
          <span className="text-[9px] font-bold text-text-secondary uppercase">Hygiene</span>
        </div>
        <div className="bg-danger/5 border border-danger/10 rounded-xl p-3 flex flex-col items-center text-center">
          <AlertTriangle className="w-4 h-4 text-danger mb-1" />
          <span className="text-base font-extrabold text-text-primary">{summary.riskFactorsCount}</span>
          <span className="text-[9px] font-bold text-text-secondary uppercase">Risk Factors</span>
        </div>
        <div className="bg-warning/5 border border-warning/10 rounded-xl p-3 flex flex-col items-center text-center">
          <AlertCircle className="w-4 h-4 text-warning mb-1" />
          <span className="text-base font-extrabold text-text-primary">{summary.complaintsCount}</span>
          <span className="text-[9px] font-bold text-text-secondary uppercase">Complaints</span>
        </div>
      </div>

      {/* Active Complaints */}
      {activeComplaints.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <h5 className="text-[10px] font-bold text-text-secondary uppercase">Active Complaints</h5>
          <div className="flex flex-wrap gap-1">
            {activeComplaints.map((c) => (
              <span
                key={c.id}
                className="inline-flex text-[9px] font-bold text-warning-dark bg-warning/5 border border-warning/10 px-2 py-0.5 rounded-full"
              >
                {c.complaintName} {c.severity && `(${c.severity})`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active Habits */}
      {activeHabits.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <h5 className="text-[10px] font-bold text-text-secondary uppercase">Lifestyle Risk Factors</h5>
          <div className="flex flex-wrap gap-1">
            {activeHabits.map((h) => (
              <span
                key={h.id}
                className="inline-flex text-[9px] font-bold text-danger bg-danger/5 border border-danger/10 px-2 py-0.5 rounded-full"
              >
                {h.habitName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orthodontic & Denture Flag Indicators */}
      {(history.orthodontic.currentBraces || history.dentures.upperDenture || history.dentures.lowerDenture) && (
        <div className="space-y-1.5 pt-1">
          <h5 className="text-[10px] font-bold text-text-secondary uppercase">Specialty Records</h5>
          <div className="flex flex-wrap gap-1">
            {history.orthodontic.currentBraces && (
              <span className="inline-flex text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                Has Braces
              </span>
            )}
            {(history.dentures.upperDenture || history.dentures.lowerDenture) && (
              <span className="inline-flex text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                Has Dentures
              </span>
            )}
            {history.implants.length > 0 && (
              <span className="inline-flex text-[9px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                Has Implants ({history.implants.length})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-[9px] text-text-secondary/60 pt-2 border-t border-border/40">
        <Clock className="w-3 h-3" />
        <span>
          Updated {new Date(summary.lastUpdated).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <User className="w-3 h-3" />
          {summary.updatedBy}
        </span>
      </div>
    </div>
  )
}
export default DentalHistorySummaryCard
