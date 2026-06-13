import React, { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Sparkles, FileEdit, Clock, Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { CLINICAL_TEMPLATES, ClinicalNotesFormSchemaType } from '../schemas'
import { TodayTreatmentItem } from '../types'

export const TreatmentDoneTodayManager: React.FC = () => {
  const { control } = useFormContext<ClinicalNotesFormSchemaType>()
  
  // Field Array for Today's treatments
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'todayTreatments',
  })

  // Local input sandboxes
  const [tooth, setTooth] = useState('')
  const [name, setName] = useState('')
  const [materials, setMaterials] = useState('')
  const [notes, setNotes] = useState('')
  const [duration, setDuration] = useState('30 mins')
  const [localError, setLocalError] = useState('')

  // Insert template handler
  const handleApplyTemplate = (tpl: typeof CLINICAL_TEMPLATES[number]) => {
    setName(tpl.name)
    setMaterials(tpl.materials)
    setNotes(tpl.notes)
    setDuration(tpl.duration)
    setLocalError('')
  }

  const handleAddTodayTreatment = () => {
    if (!tooth.trim()) {
      setLocalError('Tooth reference is required (e.g. 14, 36, All).')
      return
    }
    if (!name.trim()) {
      setLocalError('Treatment name is required.')
      return
    }
    if (!notes.trim()) {
      setLocalError('Please write treatment clinical notes for this procedure.')
      return
    }

    setLocalError('')
    append({
      id: Math.random().toString(36).substring(2, 9),
      toothNumber: tooth.trim(),
      treatmentName: name.trim(),
      materialsUsed: materials.trim(),
      notes: notes.trim(),
      duration: duration.trim(),
    })

    // Clear local inputs
    setTooth('')
    setName('')
    setMaterials('')
    setNotes('')
    setDuration('30 mins')
  }

  return (
    <div className="space-y-6">
      {/* Templates Row */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span>Insert Clinical Procedure Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CLINICAL_TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="text-[10px] font-semibold text-text-primary bg-background/40 hover:bg-primary-light/10 hover:text-primary hover:border-primary/30 border border-border/85 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form block */}
      <div className="bg-background/20 border border-border/60 rounded-xl p-4.5 space-y-4">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
          <FileEdit className="w-4 h-4 text-primary" />
          <span>Record Procedure Completed Today</span>
        </h4>

        {localError && (
          <span className="text-xs font-semibold text-danger block animate-fadeIn">
            {localError}
          </span>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Tooth Reference"
            placeholder="e.g. 14, 36, All"
            value={tooth}
            onChange={(e) => setTooth(e.target.value)}
          />

          <Input
            label="Procedure Done"
            placeholder="e.g. Composite Restoration Filling"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Duration"
            placeholder="e.g. 45 mins"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <Input
          label="Materials Used"
          placeholder="e.g. Composite resin, bonding agent"
          value={materials}
          onChange={(e) => setMaterials(e.target.value)}
          leftIcon={<Layers className="w-3.5 h-3.5 text-text-secondary" />}
        />

        <Textarea
          label="Procedure Clinical Notes"
          placeholder="Enter thorough treatment notes detailing local anesthetics, excavation depths, biomechanical settings..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button
          type="button"
          variant="outline"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddTodayTreatment}
          className="w-full sm:w-auto font-bold border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-2.5 px-5 h-auto self-end shrink-0"
        >
          Add Procedure
        </Button>
      </div>

      {/* Added treatments list */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          Completed Today ({fields.length})
        </h4>

        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
            No active treatments logged for today. Use the form above to add procedures.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, idx) => {
              const item = field as unknown as TodayTreatmentItem

              return (
                <div
                  key={field.id}
                  className="bg-white border border-border/80 rounded-xl p-4.5 space-y-3 relative hover:border-primary/20 hover:shadow-premium transition-all text-left"
                >
                  <div className="flex items-start justify-between pb-2 border-b border-border/40 gap-4">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="inline-flex text-[9px] font-black text-primary bg-primary-light px-2.5 py-0.5 rounded-full uppercase shrink-0">
                        Tooth {item.toothNumber}
                      </span>
                      <h5 className="text-xs font-black text-text-primary leading-tight truncate">
                        {item.treatmentName}
                      </h5>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                        <Clock className="w-3.5 h-3.5 text-text-secondary/50" />
                        <span>{item.duration}</span>
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => remove(idx)}
                        leftIcon={<Trash2 className="w-4 h-4 text-text-secondary hover:text-danger" />}
                        className="hover:bg-danger/5 px-2 py-1.5 h-auto"
                      />
                    </div>
                  </div>

                  {item.materialsUsed && (
                    <div className="space-y-0.5 text-xs font-medium">
                      <span className="text-[9px] text-text-secondary uppercase">Materials Used</span>
                      <p className="text-text-primary">{item.materialsUsed}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[9px] text-text-secondary uppercase">Clinical Notes</span>
                    <p className="text-xs text-text-primary/90 leading-relaxed font-semibold">
                      {item.notes}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
export default TreatmentDoneTodayManager
