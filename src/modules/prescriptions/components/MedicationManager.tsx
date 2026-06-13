import React, { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Edit2, Copy, Sparkles, Pill } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  INITIAL_PRESCRIPTION_TEMPLATES,
  DRUG_DATABASE_SUGGESTIONS,
  PrescriptionFormSchemaType,
} from '../schemas'
import { MedicineItem } from '../types'

export const MedicationManager: React.FC = () => {
  const { control, setValue } = useFormContext<PrescriptionFormSchemaType>()

  // Field Array for Medications
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'medications',
  })

  // Local sandbox inputs
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [instructions, setInstructions] = useState('')
  const [localError, setLocalError] = useState('')

  // Insert template course
  const handleApplyTemplate = (tpl: typeof INITIAL_PRESCRIPTION_TEMPLATES[number]) => {
    // Overwrite medications array with templates or append! Let's append so we don't destroy their current list, or let them decide. Appending is standard and safe!
    tpl.medications.forEach((med) => {
      append({
        id: Math.random().toString(36).substring(2, 9),
        medicineName: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
      })
    })

    // If template has generic notes, populate them in additional notes!
    if (tpl.notes) {
      setValue('notes', tpl.notes, { shouldDirty: true })
    }
  }

  const handleAddMedicine = () => {
    if (!name.trim()) {
      setLocalError('Medicine name is required.')
      return
    }
    if (!dosage.trim()) {
      setLocalError('Dosage is required (e.g. 500 mg).')
      return
    }
    if (!frequency.trim()) {
      setLocalError('Frequency is required (e.g. Twice Daily).')
      return
    }
    if (!duration.trim()) {
      setLocalError('Duration is required (e.g. 5 Days).')
      return
    }

    setLocalError('')
    append({
      id: Math.random().toString(36).substring(2, 9),
      medicineName: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      instructions: instructions.trim(),
    })

    // Reset local inputs
    setName('')
    setDosage('')
    setFrequency('')
    setDuration('')
    setInstructions('')
  }

  // Duplicate a medicine directly in the list
  const handleDuplicate = (item: MedicineItem, idx: number) => {
    insert(idx + 1, {
      id: Math.random().toString(36).substring(2, 9),
      medicineName: item.medicineName,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      instructions: item.instructions || '',
    })
  }

  // Edit triggers: loads fields back to inputs so they can adjust, and removes from the list
  const handleEdit = (item: MedicineItem, idx: number) => {
    setName(item.medicineName)
    setDosage(item.dosage)
    setFrequency(item.frequency)
    setDuration(item.duration)
    setInstructions(item.instructions || '')
    remove(idx)
  }

  return (
    <div className="space-y-6">
      {/* Templates Quick Add */}
      <div className="space-y-2 pt-1 text-left">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span>Apply Quick Medication Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INITIAL_PRESCRIPTION_TEMPLATES.map((tpl) => (
            <button
              key={tpl.category}
              type="button"
              onClick={() => handleApplyTemplate(tpl)}
              className="text-[10px] font-semibold text-text-primary bg-background/40 hover:bg-primary-light/10 hover:text-primary hover:border-primary/30 border border-border/85 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-left"
            >
              {tpl.category}
            </button>
          ))}
        </div>
      </div>

      {/* Adding subform */}
      <div className="bg-background/20 border border-border/60 rounded-xl p-4.5 space-y-4">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-primary" />
          <span>Add Medicine details</span>
        </h4>

        {localError && (
          <span className="text-xs font-semibold text-danger block animate-fadeIn">
            {localError}
          </span>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end text-left">
          {/* Autocomplete drug search input */}
          <div className="space-y-1.5 text-left md:col-span-2">
            <span className="text-xs font-semibold text-text-primary">Medicine Name</span>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Amoxicillin, Paracetamol..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-input text-sm font-medium py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
                list="drug-suggestions"
              />
              <datalist id="drug-suggestions">
                {DRUG_DATABASE_SUGGESTIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
          </div>

          <Select
            label="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 500 mg"
            options={[
              { value: '250 mg', label: '250 mg' },
              { value: '500 mg', label: '500 mg' },
              { value: '625 mg', label: '625 mg' },
              { value: '650 mg', label: '650 mg' },
              { value: '1 Tablet', label: '1 Tablet' },
              { value: '2 Tablets', label: '2 Tablets' },
              { value: '10 ml', label: '10 ml' },
              { value: '15 ml', label: '15 ml' },
            ]}
          />

          <Select
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="e.g. Twice Daily"
            options={[
              { value: 'Once Daily', label: 'Once Daily (1-0-0)' },
              { value: 'Twice Daily', label: 'Twice Daily (1-0-1)' },
              { value: 'Three Times Daily', label: 'Three Times Daily (1-1-1)' },
              { value: 'Every 6 Hours', label: 'Every 6 Hours (QID)' },
              { value: 'Every 8 Hours', label: 'Every 8 Hours' },
              { value: 'As Needed', label: 'As Needed (SOS)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-left">
          <Select
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 5 Days"
            options={[
              { value: '3 Days', label: '3 Days' },
              { value: '5 Days', label: '5 Days' },
              { value: '7 Days', label: '7 Days' },
              { value: '14 Days', label: '14 Days' },
              { value: '1 Month', label: '1 Month' },
              { value: 'Custom', label: 'Custom' },
            ]}
          />

          <div className="sm:col-span-2">
            <Input
              label="Intake Instructions"
              placeholder="e.g. Take after meals. Complete full course."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddMedicine}
          className="w-full sm:w-auto font-bold border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-2.5 px-5 h-auto shrink-0"
        >
          Add Medication
        </Button>
      </div>

      {/* Added medicines cards */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider text-left">
          Medications Prescribed ({fields.length})
        </h4>

        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
            No medications added to this prescription yet. Use the card above or apply quick templates.
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const med = field as unknown as MedicineItem
              return (
                <div
                  key={field.id}
                  className="bg-white border border-border/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 hover:shadow-premium transition-all text-left"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0 border border-primary/10">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h5 className="text-xs font-black text-text-primary leading-tight truncate">
                        {med.medicineName}
                      </h5>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-bold text-text-secondary/80">
                        <span>Dosage: {med.dosage}</span>
                        <span>•</span>
                        <span>Frequency: {med.frequency}</span>
                        <span>•</span>
                        <span>Duration: {med.duration}</span>
                      </div>
                      {med.instructions && (
                        <p className="text-[10px] text-text-secondary leading-normal italic truncate" title={med.instructions}>
                          Instructions: {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Operational actions: Edit, Duplicate, Remove */}
                  <div className="flex items-center gap-2 justify-end pt-3 border-t border-border/30 sm:border-0 sm:pt-0 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => handleEdit(med, idx)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />}
                      className="px-2 py-1.5 h-auto text-[10px] font-bold hover:bg-primary-light/10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDuplicate(med, idx)}
                      leftIcon={<Copy className="w-3.5 h-3.5 text-text-secondary hover:text-primary" />}
                      className="px-2 py-1.5 h-auto text-[10px] font-bold hover:bg-primary-light/10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => remove(idx)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-text-secondary hover:text-danger" />}
                      className="px-2 py-1.5 h-auto text-[10px] font-bold hover:bg-danger/5"
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
export default MedicationManager
