import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Select } from '@/components/ui/Select'
import { DentalHistoryFormSchemaType } from '../schemas'

export const OralHygieneSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<DentalHistoryFormSchemaType>()

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Oral Hygiene Assessment
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Record the patient&apos;s daily dental hygiene practices and equipment choices.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Brushing Frequency"
          placeholder="Select frequency..."
          options={[
            { value: 'Once Daily', label: 'Once Daily' },
            { value: 'Twice Daily', label: 'Twice Daily' },
            { value: 'More Than Twice', label: 'More Than Twice' },
          ]}
          error={errors.oralHygiene?.brushingFrequency?.message}
          {...register('oralHygiene.brushingFrequency' as const)}
        />

        <Select
          label="Brushing Method"
          placeholder="Select brushing method..."
          options={[
            { value: 'Manual Brush', label: 'Manual Brush' },
            { value: 'Electric Brush', label: 'Electric Brush' },
          ]}
          error={errors.oralHygiene?.brushingMethod?.message}
          {...register('oralHygiene.brushingMethod' as const)}
        />

        <Select
          label="Floss Usage"
          placeholder="Select flossing frequency..."
          options={[
            { value: 'Daily', label: 'Daily' },
            { value: 'Occasionally', label: 'Occasionally' },
            { value: 'Never', label: 'Never' },
          ]}
          error={errors.oralHygiene?.flossUsage?.message}
          {...register('oralHygiene.flossUsage' as const)}
        />

        <Select
          label="Mouthwash Usage"
          placeholder="Select mouthwash frequency..."
          options={[
            { value: 'Daily', label: 'Daily' },
            { value: 'Occasionally', label: 'Occasionally' },
            { value: 'Never', label: 'Never' },
          ]}
          error={errors.oralHygiene?.mouthwashUsage?.message}
          {...register('oralHygiene.mouthwashUsage' as const)}
        />
      </div>
    </div>
  )
}
export default OralHygieneSection
