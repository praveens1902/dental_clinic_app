import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Calendar, MapPin, Layers, FileText } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { DentalHistoryFormSchemaType } from '../schemas'

export const SpecialtyHistorySection: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<DentalHistoryFormSchemaType>()
  
  // Dynamic Implant array manager
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'implants',
  })

  return (
    <div className="space-y-8 divide-y divide-border/40">
      {/* 1. ORTHODONTIC HISTORY */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide">
            Orthodontic History
          </h4>
          <p className="text-xs text-text-secondary/70 mt-1">
            Record current or historical orthodontic interventions like braces or retainers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Previous Braces"
              {...register('orthodontic.previousBraces' as const)}
            />
          </div>
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Current Braces"
              {...register('orthodontic.currentBraces' as const)}
            />
          </div>
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Retainers"
              {...register('orthodontic.retainers' as const)}
            />
          </div>
        </div>

        <Input
          label="Orthodontic Notes"
          placeholder="e.g. Completed 2-year treatment in 2021"
          leftIcon={<FileText className="w-3.5 h-3.5 text-text-secondary" />}
          error={errors.orthodontic?.notes?.message}
          {...register('orthodontic.notes' as const)}
        />
      </div>

      {/* 2. IMPLANT HISTORY */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide">
              Implant History
            </h4>
            <p className="text-xs text-text-secondary/70 mt-1">
              Add details for any existing dental implants. Supports multiple implant records.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => append({ id: Math.random().toString(36).substring(2, 9), location: '', date: '', implantType: '', notes: '' })}
            className="font-bold border border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-1.5"
          >
            Add Implant
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
            No implants recorded in patient history. Click &quot;Add Implant&quot; to log one.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, idx) => {
              const hasError = errors.implants?.[idx]
              return (
                <div key={field.id} className="bg-background/10 border border-border/60 rounded-xl p-4 space-y-3 relative group">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary-light px-2.5 py-0.5 rounded-full">
                      Implant #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => remove(idx)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-text-secondary group-hover:text-danger" />}
                      className="text-text-secondary hover:text-danger hover:bg-danger/5 px-2 py-1 h-auto"
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Location / Tooth Number"
                      placeholder="e.g. 18, 36"
                      leftIcon={<MapPin className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.location?.message}
                      {...register(`implants.${idx}.location` as const)}
                    />
                    <Input
                      label="Date of Placement"
                      type="date"
                      leftIcon={<Calendar className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.date?.message}
                      {...register(`implants.${idx}.date` as const)}
                    />
                    <Input
                      label="Implant Type / Brand"
                      placeholder="e.g. Nobel Biocare, Straumann"
                      leftIcon={<Layers className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.implantType?.message}
                      {...register(`implants.${idx}.implantType` as const)}
                    />
                  </div>

                  <Input
                    label="Notes"
                    placeholder="e.g. Bone grafting done prior"
                    leftIcon={<FileText className="w-3.5 h-3.5 text-text-secondary" />}
                    error={hasError?.notes?.message}
                    {...register(`implants.${idx}.notes` as const)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 3. DENTURE HISTORY */}
      <div className="space-y-4 pt-6">
        <div>
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide">
            Denture History
          </h4>
          <p className="text-xs text-text-secondary/70 mt-1">
            Record details of upper, lower, partial or full dentures used by the patient.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Upper Denture"
              {...register('dentures.upperDenture' as const)}
            />
          </div>
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Lower Denture"
              {...register('dentures.lowerDenture' as const)}
            />
          </div>
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Partial Denture"
              {...register('dentures.partialDenture' as const)}
            />
          </div>
          <div className="bg-background/20 border border-border/60 rounded-xl p-3.5 flex items-center hover:border-primary/20 transition-colors">
            <Checkbox
              label="Full Denture"
              {...register('dentures.fullDenture' as const)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date of Placement"
            type="date"
            leftIcon={<Calendar className="w-3.5 h-3.5 text-text-secondary" />}
            error={errors.dentures?.dateOfPlacement?.message}
            {...register('dentures.dateOfPlacement' as const)}
          />
          <Input
            label="Denture Notes"
            placeholder="e.g. Upper acrylic partial plate"
            leftIcon={<FileText className="w-3.5 h-3.5 text-text-secondary" />}
            error={errors.dentures?.notes?.message}
            {...register('dentures.notes' as const)}
          />
        </div>
      </div>
    </div>
  )
}
export default SpecialtyHistorySection
