import React from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MedicalVitals } from '../types'

const BLOOD_GROUP_OPTIONS = [
  { value: '', label: 'Select Blood Group' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
]

interface MedicalVitalsSectionProps {
  vitals: MedicalVitals
  onChange: (vitals: MedicalVitals) => void
}

export const MedicalVitalsSection: React.FC<MedicalVitalsSectionProps> = ({
  vitals,
  onChange,
}) => {
  const handleChange = (field: keyof MedicalVitals, value: string) => {
    onChange({ ...vitals, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide">
        Vital Information
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          label="BP Reading"
          placeholder="120/80"
          helperText="Format: systolic/diastolic"
          value={vitals.bpReading}
          onChange={(e) => handleChange('bpReading', e.target.value)}
        />
        <Input
          label="Blood Sugar Level"
          placeholder="95"
          helperText="mg/dL (fasting)"
          value={vitals.bloodSugarLevel}
          onChange={(e) => handleChange('bloodSugarLevel', e.target.value)}
        />
        <Input
          label="Height"
          placeholder="170"
          helperText="cm"
          value={vitals.height}
          onChange={(e) => handleChange('height', e.target.value)}
        />
        <Input
          label="Weight"
          placeholder="70"
          helperText="kg"
          value={vitals.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
        />
        <Input
          label="BMI"
          placeholder="Auto-calculated"
          helperText="Body Mass Index"
          readOnly
          value={vitals.bmi}
        />
        <Select
          label="Blood Group"
          options={BLOOD_GROUP_OPTIONS}
          value={vitals.bloodGroup}
          onChange={(e) => handleChange('bloodGroup', e.target.value)}
        />
      </div>
    </div>
  )
}
