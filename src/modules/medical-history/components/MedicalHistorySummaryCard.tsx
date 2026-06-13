import React from 'react'
import { MedicalHistorySummary, MedicalHistory } from '../types'
import { MedicalRiskIndicator } from './MedicalRiskIndicator'
import { HeartPulse, Pill, Leaf, Scissors, Clock, User } from 'lucide-react'

interface MedicalHistorySummaryCardProps {
  summary: MedicalHistorySummary | null
  history: MedicalHistory | null
  isLoading?: boolean
}

export const MedicalHistorySummaryCard: React.FC<MedicalHistorySummaryCardProps> = ({
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
          <HeartPulse className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-text-secondary/60">No Summary Available</h3>
          <p className="text-[10px] text-text-secondary/40 mt-1">
            Medical history has not been recorded for this patient yet.
          </p>
        </div>
      </div>
    )
  }

  const conditionLabels = [
    { key: 'bloodPressure', label: 'Blood Pressure' },
    { key: 'diabetes', label: 'Diabetes' },
    { key: 'heartDisease', label: 'Heart Disease' },
    { key: 'asthma', label: 'Asthma' },
    { key: 'cholesterol', label: 'Cholesterol' },
    { key: 'thyroidDisease', label: 'Thyroid Disease' },
    { key: 'kidneyDisease', label: 'Kidney Disease' },
    { key: 'liverDisease', label: 'Liver Disease' },
    { key: 'pregnancy', label: 'Pregnancy' },
    { key: 'medicineAllergies', label: 'Medicine Allergies' },
  ]

  const activeConditions = conditionLabels.filter(
    (c) => history.conditions[c.key as keyof typeof history.conditions]
  )

  return (
    <div className="space-y-4">
      {/* Risk Indicator */}
      <MedicalRiskIndicator riskLevel={summary.riskLevel} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary-light border border-primary/10 rounded-xl p-3 flex flex-col items-center text-center">
          <HeartPulse className="w-4 h-4 text-primary mb-1" />
          <span className="text-lg font-bold text-text-primary">{summary.activeConditionsCount}</span>
          <span className="text-[10px] font-semibold text-text-secondary">Active Conditions</span>
        </div>
        <div className="bg-info/5 border border-info/10 rounded-xl p-3 flex flex-col items-center text-center">
          <Pill className="w-4 h-4 text-info mb-1" />
          <span className="text-lg font-bold text-text-primary">{summary.medicationsCount}</span>
          <span className="text-[10px] font-semibold text-text-secondary">Medications</span>
        </div>
        <div className="bg-warning/5 border border-warning/10 rounded-xl p-3 flex flex-col items-center text-center">
          <Leaf className="w-4 h-4 text-warning mb-1" />
          <span className="text-lg font-bold text-text-primary">{summary.allergiesCount}</span>
          <span className="text-[10px] font-semibold text-text-secondary">Allergies</span>
        </div>
        <div className="bg-success/5 border border-success/10 rounded-xl p-3 flex flex-col items-center text-center">
          <Scissors className="w-4 h-4 text-success mb-1" />
          <span className="text-lg font-bold text-text-primary">{summary.surgeriesCount}</span>
          <span className="text-[10px] font-semibold text-text-secondary">Surgeries</span>
        </div>
      </div>

      {/* Active Conditions Tags */}
      {activeConditions.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-[10px] font-bold text-text-secondary uppercase">Active Conditions</h5>
          <div className="flex flex-wrap gap-1.5">
            {activeConditions.map((c) => (
              <span
                key={c.key}
                className="inline-flex text-[10px] font-bold text-danger bg-danger/5 border border-danger/10 px-2 py-0.5 rounded-full"
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-[10px] text-text-secondary/60 pt-1 border-t border-border/40">
        <Clock className="w-3 h-3" />
        <span>
          Last updated {new Date(summary.lastUpdated).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <User className="w-3 h-3" />
          {summary.updatedBy}
        </span>
      </div>
    </div>
  )
}
