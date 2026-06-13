import React, { useState } from 'react'
import { Leaf, Plus, Trash2, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { MedicalHistoryFormSchemaType } from '../schemas'

type AllergyItem = MedicalHistoryFormSchemaType['allergies'][number]

const SEVERITY_OPTIONS = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' },
  { value: 'Life-Threatening', label: 'Life-Threatening' },
]

interface AllergyManagerProps {
  allergies: AllergyItem[]
  onChange: (allergies: AllergyItem[]) => void
}

export const AllergyManager: React.FC<AllergyManagerProps> = ({
  allergies,
  onChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<AllergyItem>({
    allergyName: '', severity: 'Mild', reaction: '', notes: '',
  })

  const handleAdd = () => {
    setEditingIndex(-1)
    setDraft({ allergyName: '', severity: 'Mild', reaction: '', notes: '' })
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setDraft({ ...allergies[index] })
  }

  const handleSave = () => {
    if (!draft.allergyName.trim() || !draft.reaction.trim()) return
    if (editingIndex === -1) {
      onChange([...allergies, draft])
    } else if (editingIndex !== null) {
      const updated = [...allergies]
      updated[editingIndex] = draft
      onChange(updated)
    }
    setEditingIndex(null)
  }

  const handleRemove = (index: number) => {
    const updated = [...allergies]
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
          Allergies ({allergies.length})
        </h4>
        <Button
          type="button"
          variant="secondary"
          size="xs"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAdd}
          disabled={editingIndex !== null}
        >
          Add Allergy
        </Button>
      </div>

      {allergies.length === 0 && editingIndex === null ? (
        <div className="bg-background/40 border border-dashed border-border/60 rounded-xl p-6">
          <EmptyState
            title="No Allergies Recorded"
            description="Patient has no documented allergies. Add any known allergies."
            icon={Leaf}
            actionLabel="Add First Allergy"
            onAction={handleAdd}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {allergies.map((allergy, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="bg-background/30 border border-primary/30 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Allergy Name"
                      placeholder="e.g. Penicillin"
                      value={draft.allergyName}
                      onChange={(e) => setDraft({ ...draft, allergyName: e.target.value })}
                    />
                    <Select
                      label="Severity"
                      options={SEVERITY_OPTIONS}
                      value={draft.severity}
                      onChange={(e) => setDraft({ ...draft, severity: e.target.value as AllergyItem['severity'] })}
                    />
                  </div>
                  <Input
                    label="Reaction"
                    placeholder="e.g. Rash, difficulty breathing, swelling"
                    value={draft.reaction}
                    onChange={(e) => setDraft({ ...draft, reaction: e.target.value })}
                  />
                  <Input
                    label="Notes"
                    placeholder="Additional notes or precautions"
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
                        <span className="text-sm font-bold text-text-primary">{allergy.allergyName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          allergy.severity === 'Life-Threatening' ? 'bg-danger/10 text-danger' :
                          allergy.severity === 'Severe' ? 'bg-orange-500/10 text-orange-500' :
                          allergy.severity === 'Moderate' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }`}>
                          {allergy.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5">Reaction: {allergy.reaction}</p>
                      {allergy.notes && <p className="text-[10px] text-text-secondary/70 mt-0.5">{allergy.notes}</p>}
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
                  label="Allergy Name"
                  placeholder="e.g. Penicillin"
                  value={draft.allergyName}
                  onChange={(e) => setDraft({ ...draft, allergyName: e.target.value })}
                />
                <Select
                  label="Severity"
                  options={SEVERITY_OPTIONS}
                  value={draft.severity}
                  onChange={(e) => setDraft({ ...draft, severity: e.target.value as AllergyItem['severity'] })}
                />
              </div>
              <Input
                label="Reaction"
                placeholder="e.g. Rash, difficulty breathing, swelling"
                value={draft.reaction}
                onChange={(e) => setDraft({ ...draft, reaction: e.target.value })}
              />
              <Input
                label="Notes"
                placeholder="Additional notes or precautions"
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
