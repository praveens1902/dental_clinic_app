import React from 'react'
import { MedicalHistory, MedicalRiskLevel } from '../types'
import { AlertTriangle, ShieldCheck, HeartPulse, AlertOctagon } from 'lucide-react'

interface MedicalRiskIndicatorProps {
  riskLevel: MedicalRiskLevel
  className?: string
}

const RISK_CONFIG: Record<
  MedicalRiskLevel,
  {
    label: string
    color: string
    bg: string
    border: string
    icon: React.ReactNode
    description: string
  }
> = {
  Low: {
    label: 'Low Risk',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    icon: <ShieldCheck className="w-5 h-5" />,
    description: 'Patient presents minimal systemic risk factors.',
  },
  Medium: {
    label: 'Medium Risk',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Patient has moderate risk factors requiring monitoring.',
  },
  High: {
    label: 'High Risk',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: <HeartPulse className="w-5 h-5" />,
    description: 'Patient has significant risk factors. Exercise caution.',
  },
  Critical: {
    label: 'Critical Risk',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    icon: <AlertOctagon className="w-5 h-5" />,
    description: 'Patient has critical risk factors. Immediate attention required.',
  },
}

export const MedicalRiskIndicator: React.FC<MedicalRiskIndicatorProps> = ({
  riskLevel,
  className = '',
}) => {
  const config = RISK_CONFIG[riskLevel]

  return (
    <div
      className={`p-4 rounded-xl border ${config.bg} ${config.border} ${className}`}
      role="status"
      aria-label={`Medical risk level: ${config.label}`}
    >
      <div className="flex items-center gap-3">
        <div className={`${config.color} shrink-0`}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold ${config.color}`}>{config.label}</h4>
          <p className="text-[11px] text-text-secondary font-medium leading-relaxed mt-0.5">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper to calculate risk level from history data
export const calculateRiskFromHistory = (history: MedicalHistory | null): MedicalRiskLevel => {
  if (!history) return 'Low'
  const { conditions } = history
  let riskScore = 0

  if (conditions.heartDisease) riskScore += 4
  if (conditions.kidneyDisease) riskScore += 4
  if (conditions.liverDisease) riskScore += 3
  if (conditions.pregnancy) riskScore += 3
  if (conditions.diabetes) riskScore += 3
  if (conditions.bloodPressure) riskScore += 2
  if (conditions.asthma) riskScore += 2
  if (conditions.thyroidDisease) riskScore += 2
  if (conditions.cholesterol) riskScore += 1
  if (conditions.medicineAllergies) riskScore += 1

  if (history.surgeries.length > 0) riskScore += 1
  if (history.medications.length > 2) riskScore += 1

  if (riskScore >= 7) return 'Critical'
  if (riskScore >= 4) return 'High'
  if (riskScore >= 2) return 'Medium'
  return 'Low'
}
