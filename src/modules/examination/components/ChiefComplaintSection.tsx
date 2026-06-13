import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Lightbulb } from 'lucide-react'
import { Textarea } from '@/components/ui/Textarea'
import { examinationService } from '../services/examinationService'
import { ExaminationFormSchemaType } from '../schemas'

export const ChiefComplaintSection: React.FC = () => {
  const { register, setValue, formState: { errors } } = useFormContext<ExaminationFormSchemaType>()
  const templates = examinationService.getChiefComplaintTemplates()

  const handleApplyTemplate = (text: string) => {
    setValue('chiefComplaint', text, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Chief Complaint
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Record the primary symptoms or dental concerns stated by the patient in their own words.
        </p>
      </div>

      <Textarea
        label="Symptoms Description"
        placeholder="e.g., Throbbing pain in upper right premolar..."
        rows={4}
        error={errors.chiefComplaint?.message}
        required
        {...register('chiefComplaint')}
      />

      {/* Suggestion templates */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Quick Clinical Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="text-[10px] font-semibold text-text-primary bg-background/40 hover:bg-primary-light/10 hover:text-primary hover:border-primary/30 border border-border/85 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
            >
              {tpl}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ChiefComplaintSection
