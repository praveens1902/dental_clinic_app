import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Calendar, Hash, FileText, CheckCircle2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { DentalHistoryFormSchemaType } from '../schemas'

export const PreviousTreatmentSection: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<DentalHistoryFormSchemaType>()
  const treatments = useWatch({ control, name: 'treatments' })

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Previous Dental Treatments Checklist
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Check any procedures the patient has undergone previously and record relevant tooth numbers and dates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {treatments?.map((treatment, idx) => {
          const isChecked = treatment.hasTreatment
          const hasError = errors.treatments?.[idx]

          return (
            <div
              key={treatment.id}
              className={`border rounded-xl p-4 transition-all duration-200 ${
                isChecked
                  ? 'bg-primary-light/5 border-primary/20 shadow-sm'
                  : 'bg-background/20 border-border/60 hover:border-border'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Yes/No Checklist trigger */}
                <div className="flex-1 min-w-0">
                  <Checkbox
                    label={
                      <span className="flex items-center gap-2">
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                        <span className={`text-sm font-bold ${isChecked ? 'text-primary' : 'text-text-primary'}`}>
                          {treatment.treatmentName}
                        </span>
                      </span>
                    }
                    {...register(`treatments.${idx}.hasTreatment` as const)}
                  />
                </div>

                {/* Subform, visible only when Yes/Checked */}
                {isChecked && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-[2] w-full animate-fadeIn">
                    <Input
                      label="Treatment Date"
                      type="date"
                      leftIcon={<Calendar className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.treatmentDate?.message}
                      {...register(`treatments.${idx}.treatmentDate` as const)}
                    />
                    <Input
                      label="Tooth Number(s)"
                      placeholder="e.g. 14, 18 or 36"
                      leftIcon={<Hash className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.toothNumber?.message}
                      {...register(`treatments.${idx}.toothNumber` as const)}
                    />
                    <Input
                      label="Clinical Notes"
                      placeholder="e.g. Completed elsewhere"
                      leftIcon={<FileText className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.notes?.message}
                      {...register(`treatments.${idx}.notes` as const)}
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
export default PreviousTreatmentSection
