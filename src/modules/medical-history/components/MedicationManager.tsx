import React, { useState } from 'react'
import { Pill, Plus, Trash2, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { MedicalHistoryFormSchemaType } from '../schemas'

type MedicationItem = MedicalHistoryFormSchemaType['medications'][number]

interface MedicationManagerProps {
  medications: MedicationItem[]
  onChange: (medications: MedicationItem[]) => void
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({
  medications,
  onChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<MedicationItem>({
    medicineName: '', dosage: '', frequency: '', duration: '', notes: '',
  })

  const handleAdd = () => {
    setEditingIndex(-1)
    setDraft({ medicineName: '', dosage: '', frequency: '', duration: '', notes: '' })
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setDraft({ ...medications[index] })
  }

  const handleSave = () => {
    if (!draft.medicineName.trim() || !draft.dosage.trim() || !draft.frequency.trim() || !draft.duration.trim()) return
    if (editingIndex === -1) {
      onChange([...medications, draft])
    } else if (editingIndex !== null) {
      const updated = [...medications]
      updated[editingIndex] = draft
      onChange(updated)
    }
    setEditingIndex(null)
  }

  const handleRemove = (index: number) => {
    const updated = [...medications]
    updated.splice(index, 1)
    onChange(updated)
  }

  const handleCancel = () => {
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide">
          Current Medications ({medications.length})
        </h4>
        <Button
          type="button"
          variant="secondary"
          size="xs"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAdd}
          disabled={editingIndex !== null}
        >
          Add Medication
        </Button>
      </div>

      {medications.length === 0 && editingIndex === null ? (
        <div className="bg-background/40 border border-dashed border-border/60 rounded-xl p-6">
          <EmptyState
            title="No Medications"
            description="Patient is not currently on any medications. Add medications if applicable."
            icon={Pill}
            actionLabel="Add First Medication"
            onAction={handleAdd}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="bg-background/30 border border-primary/30 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Medicine Name"
                      placeholder="e.g. Amlodipine"
                      value={draft.medicineName}
                      onChange={(e) => setDraft({ ...draft, medicineName: e.target.value })}
                    />
                    <Input
                      label="Dosage"
                      placeholder="e.g. 5mg"
                      value={draft.dosage}
                      onChange={(e) => setDraft({ ...draft, dosage: e.target.value })}
                    />
                    <Input
                      label="Frequency"
                      placeholder="e.g. Once daily"
                      value={draft.frequency}
                      onChange={(e) => setDraft({ ...draft, frequency: e.target.value })}
                    />
                    <Input
                      label="Duration"
                      placeholder="e.g. 7 days / Ongoing"
                      value={draft.duration}
                      onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Notes"
                    placeholder="Additional instructions or notes"
                    value={draft.notes || ''}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="primary" size="xs" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={handleSave}>
                      Save
                    </Button>
                    <Button type="button" variant="outline" size="xs" leftIcon={<X className="w-3.5 h-3.5" />} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-background/30 border border-border/60 rounded-xl p-4 space-y-1.5 relative group hover:border-primary/20 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-text-primary">{med.medicineName}</span>
                        <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">{med.dosage}</span>
                        <span className="text-[10px] font-bold text-text-secondary bg-background/60 px-2 py-0.5 rounded-full">{med.frequency}</span>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5">Duration: {med.duration}</p>
                      {med.notes && <p className="text-[10px] text-text-secondary/70 mt-0.5">{med.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button type="button" variant="ghost" size="xs" onClick={() => handleEdit(index)} className="text-[10px]">Edit</Button>
                      <Button type="button" variant="ghost" size="xs" onClick={() => handleRemove(index)} className="text-danger hover:bg-danger/5 text-[10px]">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {editingIndex === -1 && (
            <div className="bg-background/30 border border-primary/30 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Medicine Name"
                  placeholder="e.g. Amlodipine"
                  value={draft.medicineName}
                  onChange={(e) => setDraft({ ...draft, medicineName: e.target.value })}
                />
                <Input
                  label="Dosage"
                  placeholder="e.g. 5mg"
                  value={draft.dosage}
                  onChange={(e) => setDraft({ ...draft, dosage: e.target.value })}
                />
                <Input
                  label="Frequency"
                  placeholder="e.g. Once daily"
                  value={draft.frequency}
                  onChange={(e) => setDraft({ ...draft, frequency: e.target.value })}
                />
                <Input
                  label="Duration"
                  placeholder="e.g. 7 days / Ongoing"
                  value={draft.duration}
                  onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                />
              </div>
              <Input
                label="Notes"
                placeholder="Additional instructions or notes"
                value={draft.notes || ''}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <Button type="button" variant="primary" size="xs" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={handleSave}>
                  Add
                </Button>
                <Button type="button" variant="outline" size="xs" leftIcon={<X className="w-3.5 h-3.5" />} onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
