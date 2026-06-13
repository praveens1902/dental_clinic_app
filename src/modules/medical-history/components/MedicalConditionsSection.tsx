import React from 'react'
import { Checkbox } from '@/components/ui/Checkbox'
import { MedicalConditions } from '../types'

const CONDITIONS_LIST = [
  { key: 'bloodPressure' as const, label: 'Blood Pressure' },
  { key: 'diabetes' as const, label: 'Diabetes' },
  { key: 'asthma' as const, label: 'Asthma' },
  { key: 'cholesterol' as const, label: 'Cholesterol' },
  { key: 'thyroidDisease' as const, label: 'Thyroid Disease' },
  { key: 'heartDisease' as const, label: 'Heart Disease' },
  { key: 'kidneyDisease' as const, label: 'Kidney Disease' },
  { key: 'liverDisease' as const, label: 'Liver Disease' },
  { key: 'pregnancy' as const, label: 'Pregnancy' },
  { key: 'medicineAllergies' as const, label: 'Medicine Allergies' },
]

interface MedicalConditionsSectionProps {
  conditions: MedicalConditions
  onChange: (conditions: MedicalConditions) => void
}

export const MedicalConditionsSection: React.FC<MedicalConditionsSectionProps> = ({
  conditions,
  onChange,
}) => {
  const handleToggle = (key: keyof MedicalConditions) => {
    onChange({ ...conditions, [key]: !conditions[key] })
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide">
        Medical Conditions
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONDITIONS_LIST.map((condition) => (
          <div
            key={condition.key}
            className="bg-background/30 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors"
          >
            <Checkbox
              label={condition.label}
              checked={conditions[condition.key]}
              onChange={() => handleToggle(condition.key)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
