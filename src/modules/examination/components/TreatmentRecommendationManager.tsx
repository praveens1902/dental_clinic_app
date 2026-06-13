import React, { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, IndianRupee, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { examinationService } from '../services/examinationService'
import { ExaminationFormSchemaType } from '../schemas'
import { RecommendationItem, RecommendationPriority } from '../types'

export const TreatmentRecommendationManager: React.FC = () => {
  const { control } = useFormContext<ExaminationFormSchemaType>()
  
  // Field Array for Recommendations
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recommendations',
  })

  // Local inputs state
  const [tooth, setTooth] = useState('')
  const [treatment, setTreatment] = useState('')
  const [priority, setPriority] = useState<RecommendationPriority>('Medium')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [localError, setLocalError] = useState('')

  const suggestions = examinationService.getTreatmentSuggestions()

  const handleAddRecommendation = () => {
    if (!tooth.trim()) {
      setLocalError('Tooth reference is required (use tooth numbers, e.g. 14, or All).')
      return
    }
    if (!treatment.trim()) {
      setLocalError('Treatment selection or description is required.')
      return
    }

    const estimatedCost = parseFloat(cost) || 0
    if (estimatedCost < 0) {
      setLocalError('Cost cannot be a negative value.')
      return
    }

    setLocalError('')
    append({
      id: Math.random().toString(36).substring(2, 9),
      toothNumber: tooth.trim(),
      treatmentName: treatment.trim(),
      priority,
      estimatedCost,
      notes: notes.trim(),
    })

    // Reset local inputs
    setTooth('')
    setTreatment('')
    setPriority('Medium')
    setCost('')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      {/* 1. Add Recommendation Subform card */}
      <div className="bg-background/20 border border-border/60 rounded-xl p-4.5 space-y-4">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-primary" />
          <span>Add Treatment Recommendation</span>
        </h4>

        {localError && (
          <span className="text-xs font-semibold text-danger block animate-fadeIn">
            {localError}
          </span>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <Input
            label="Tooth Reference"
            placeholder="e.g. 14, 36 or All"
            value={tooth}
            onChange={(e) => setTooth(e.target.value)}
          />

          {/* Autocomplete treatment name input */}
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-semibold text-text-primary">Treatment Proposed</span>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Root Canal, Scaling..."
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-input text-sm font-medium py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
                list="treatment-suggestions"
              />
              <datalist id="treatment-suggestions">
                {suggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as RecommendationPriority)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />

          <Input
            label="Estimated Cost (INR)"
            placeholder="e.g. 6500"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full text-left">
            <Input
              label="Treatment Notes"
              placeholder="e.g. Recommended premium zirconia crown"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleAddRecommendation}
            className="w-full sm:w-auto font-bold border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-2.5 px-5 h-auto shrink-0"
          >
            Add Treatment
          </Button>
        </div>
      </div>

      {/* 2. List of Added Treatment Recommendations */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          Proposed Treatments ({fields.length})
        </h4>

        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
            No treatments proposed yet. Use the card above to register recommendations.
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const rec = field as unknown as RecommendationItem
              return (
                <div
                  key={field.id}
                  className="bg-background/20 border border-border/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all hover:shadow-premium"
                >
                  <div className="flex items-start gap-3.5 text-left min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex flex-col items-center justify-center shrink-0 border border-primary/10">
                      <span className="text-[9px] text-text-secondary font-black uppercase">Tooth</span>
                      <span className="text-xs text-primary font-black leading-none">{rec.toothNumber}</span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rec.priority === 'Urgent' ? 'bg-danger/15 text-danger' :
                          rec.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          rec.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rec.priority}
                        </span>
                        <span className="text-xs font-black text-text-primary">
                          {rec.treatmentName}
                        </span>
                      </div>

                      {rec.notes && (
                        <p className="text-[10px] text-text-secondary leading-normal italic truncate">
                          Note: {rec.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4.5 justify-between sm:justify-end shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text-secondary uppercase">Est. Cost</p>
                      <p className="text-sm font-black text-text-primary flex items-center justify-end gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                        <span>{rec.estimatedCost.toLocaleString()}</span>
                      </p>
                    </div>

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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
export default TreatmentRecommendationManager
