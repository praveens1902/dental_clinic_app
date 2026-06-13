import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Clock, MessageSquare, AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DentalHistoryFormSchemaType } from '../schemas'

export const ComplaintHistorySection: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<DentalHistoryFormSchemaType>()
  const complaints = useWatch({ control, name: 'complaints' })

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Dental Complaint History
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Trace current active symptoms or frequent dental discomfort reported by the patient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complaints?.map((complaint, idx) => {
          const isChecked = complaint.hasComplaint
          const hasError = errors.complaints?.[idx]

          return (
            <div
              key={complaint.id}
              className={`border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between ${
                isChecked
                  ? 'bg-warning/5 border-warning/30 shadow-sm'
                  : 'bg-background/20 border-border/60 hover:border-border'
              }`}
            >
              <div className="space-y-3">
                <Checkbox
                  label={
                    <span className="flex items-center gap-2">
                      {isChecked && <AlertCircle className="w-4 h-4 text-warning shrink-0" />}
                      <span className={`text-sm font-bold ${isChecked ? 'text-warning-dark font-black' : 'text-text-primary'}`}>
                        {complaint.complaintName}
                      </span>
                    </span>
                  }
                  {...register(`complaints.${idx}.hasComplaint` as const)}
                />

                {isChecked && (
                  <div className="space-y-2.5 pt-2 border-t border-warning/10 animate-fadeIn">
                    <Select
                      label="Severity"
                      placeholder="Select severity..."
                      options={[
                        { value: 'Mild', label: 'Mild' },
                        { value: 'Moderate', label: 'Moderate' },
                        { value: 'Severe', label: 'Severe' },
                      ]}
                      error={hasError?.severity?.message}
                      {...register(`complaints.${idx}.severity` as const)}
                    />
                    <Input
                      label="Duration"
                      placeholder="e.g. 3 days, 1 month"
                      leftIcon={<Clock className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.duration?.message}
                      {...register(`complaints.${idx}.duration` as const)}
                    />
                    <Input
                      label="Notes"
                      placeholder="e.g. Sharp pain when biting"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.notes?.message}
                      {...register(`complaints.${idx}.notes` as const)}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default ComplaintHistorySection
