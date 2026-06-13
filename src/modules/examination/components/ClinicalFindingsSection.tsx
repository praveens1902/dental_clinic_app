import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Eye } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { ExaminationFormSchemaType } from '../schemas'

export const ClinicalFindingsSection: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<ExaminationFormSchemaType>()

  const FINDINGS_FIELDS = [
    { key: 'softTissue' as const, label: 'Soft Tissue Findings', placeholder: 'e.g. Normal lips, tongue, mucosa, palate...' },
    { key: 'gingival' as const, label: 'Gingival Findings', placeholder: 'e.g. Mild inflammation, localized bleeding...' },
    { key: 'periodontal' as const, label: 'Periodontal Findings', placeholder: 'e.g. Calculus deposits, pocket depths...' },
    { key: 'oralHygiene' as const, label: 'Oral Hygiene Findings', placeholder: 'e.g. Good, fair, plaque indices...' },
    { key: 'occlusion' as const, label: 'Occlusion Findings', placeholder: 'e.g. Class I molar relationship, normal overbite...' },
    { key: 'tmj' as const, label: 'TMJ Findings', placeholder: 'e.g. No clicking, tenderness or deviation...' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          General Clinical Findings
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Perform a thorough examination of the intraoral soft tissues, gums, bite pattern, and TM joint.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FINDINGS_FIELDS.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            leftIcon={<Eye className="w-3.5 h-3.5 text-text-secondary" />}
            error={errors.findings?.[field.key]?.message}
            {...register(`findings.${field.key}` as const)}
          />
        ))}
      </div>
    </div>
  )
}
export default ClinicalFindingsSection
