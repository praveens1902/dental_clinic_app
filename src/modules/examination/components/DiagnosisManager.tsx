import React, { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { examinationService } from '../services/examinationService'
import { ExaminationFormSchemaType } from '../schemas'
import { DiagnosisItem, DiagnosisSeverity } from '../types'

export const DiagnosisManager: React.FC = () => {
  const { control } = useFormContext<ExaminationFormSchemaType>()
  
  // Field Array for Diagnoses
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'diagnoses',
  })

  // Local inputs state for adding a new diagnosis
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState<DiagnosisSeverity>('Mild')
  const [notes, setNotes] = useState('')
  const [localError, setLocalError] = useState('')

  const categories = examinationService.getDiagnosisCategories()
  const suggestions = examinationService.getDiagnosisSuggestions()

  const handleAddDiagnosis = () => {
    if (!name.trim()) {
      setLocalError('Diagnosis name is required.')
      return
    }
    if (!category) {
      setLocalError('Please select a clinical category.')
      return
    }

    setLocalError('')
    append({
      id: Math.random().toString(36).substring(2, 9),
      diagnosisName: name.trim(),
      category,
      severity,
      notes: notes.trim(),
    })

    // Reset inputs
    setName('')
    setCategory('')
    setSeverity('Mild')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      {/* 1. Add Diagnosis Card Subform */}
      <div className="bg-background/20 border border-border/60 rounded-xl p-4.5 space-y-4">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
          <FolderPlus className="w-4 h-4 text-primary" />
          <span>Add Clinical Diagnosis</span>
        </h4>

        {localError && (
          <span className="text-xs font-semibold text-danger block animate-fadeIn">
            {localError}
          </span>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Autocomplete / Selection for Diagnosis Name */}
          <div className="md:col-span-2 space-y-1.5 text-left">
            <span className="text-xs font-semibold text-text-primary">Diagnosis Name</span>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Irreversible Pulpitis, Caries..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-input text-sm font-medium py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
                list="diagnosis-suggestions"
              />
              <datalist id="diagnosis-suggestions">
                {suggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          <Select
            label="Clinical Category"
            placeholder="Select category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />

          <Select
            label="Clinical Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as DiagnosisSeverity)}
            options={[
              { value: 'Mild', label: 'Mild' },
              { value: 'Moderate', label: 'Moderate' },
              { value: 'Severe', label: 'Severe' },
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full text-left">
            <Input
              label="Diagnosis Notes"
              placeholder="e.g. Tooth #14 shows tender to percussion"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleAddDiagnosis}
            className="w-full sm:w-auto font-bold border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-2.5 px-5 h-auto shrink-0"
          >
            Add to List
          </Button>
        </div>
      </div>

      {/* 2. Added Diagnoses List */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          Diagnosis Checklist ({fields.length})
        </h4>

        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
            No clinical diagnoses logged yet. Use the card above to register a diagnosis.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, idx) => {
              const diag = field as unknown as DiagnosisItem
              return (
                <div
                  key={field.id}
                  className={`border rounded-xl p-4.5 flex justify-between items-start gap-4 transition-all hover:shadow-premium ${
                    diag.severity === 'Severe'
                      ? 'bg-danger/5 border-danger/25'
                      : diag.severity === 'Moderate'
                      ? 'bg-warning/5 border-warning/25'
                      : 'bg-primary-light/5 border-primary/10'
                  }`}
                >
                  <div className="space-y-1.5 text-left min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        diag.severity === 'Severe' ? 'bg-danger/15 text-danger' :
                        diag.severity === 'Moderate' ? 'bg-warning/15 text-warning-dark' : 'bg-primary-light text-primary'
                      }`}>
                        {diag.severity}
                      </span>
                      <span className="text-[10px] font-bold text-text-secondary uppercase">
                        {diag.category}
                      </span>
                    </div>
                    
                    <h5 className="text-xs font-extrabold text-text-primary leading-tight truncate">
                      {diag.diagnosisName}
                    </h5>

                    {diag.notes && (
                      <p className="text-[10px] text-text-secondary leading-normal italic">
                        &ldquo;{diag.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => remove(idx)}
                    leftIcon={<Trash2 className="w-4 h-4 text-text-secondary hover:text-danger" />}
                    className="hover:bg-danger/5 px-2 py-1.5 h-auto mt-0.5"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
export default DiagnosisManager
