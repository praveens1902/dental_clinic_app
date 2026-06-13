import React, { useState } from 'react'
import { Scissors, Plus, Trash2, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { MedicalHistoryFormSchemaType } from '../schemas'

type SurgeryItem = MedicalHistoryFormSchemaType['surgeries'][number]

interface SurgeryManagerProps {
  surgeries: SurgeryItem[]
  onChange: (surgeries: SurgeryItem[]) => void
}

export const SurgeryManager: React.FC<SurgeryManagerProps> = ({
  surgeries,
  onChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<SurgeryItem>({
    surgeryName: '', date: '', hospital: '', notes: '',
  })

  const handleAdd = () => {
    setEditingIndex(-1)
    setDraft({ surgeryName: '', date: '', hospital: '', notes: '' })
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setDraft({ ...surgeries[index] })
  }

  const handleSave = () => {
    if (!draft.surgeryName.trim() || !draft.date.trim()) return
    if (editingIndex === -1) {
      onChange([...surgeries, draft])
    } else if (editingIndex !== null) {
      const updated = [...surgeries]
      updated[editingIndex] = draft
      onChange(updated)
    }
    setEditingIndex(null)
  }

  const handleRemove = (index: number) => {
    const updated = [...surgeries]
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
          Previous Surgeries ({surgeries.length})
        </h4>
        <Button
          type="button"
          variant="secondary"
          size="xs"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleAdd}
          disabled={editingIndex !== null}
        >
          Add Surgery
        </Button>
      </div>

      {surgeries.length === 0 && editingIndex === null ? (
        <div className="bg-background/40 border border-dashed border-border/60 rounded-xl p-6">
          <EmptyState
            title="No Surgeries Recorded"
            description="Patient has no documented surgical history. Add any previous surgeries if applicable."
            icon={Scissors}
            actionLabel="Add First Surgery"
            onAction={handleAdd}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {surgeries.map((surgery, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="bg-background/30 border border-primary/30 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Surgery Name"
                      placeholder="e.g. Appendectomy"
                      value={draft.surgeryName}
                      onChange={(e) => setDraft({ ...draft, surgeryName: e.target.value })}
                    />
                    <Input
                      label="Date"
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Hospital / Medical Center"
                    placeholder="e.g. Max Super Speciality Hospital"
                    value={draft.hospital || ''}
                    onChange={(e) => setDraft({ ...draft, hospital: e.target.value })}
                  />
                  <Input
                    label="Notes"
                    placeholder="Additional details about the surgery"
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
                        <span className="text-sm font-bold text-text-primary">{surgery.surgeryName}</span>
                        <span className="text-[10px] font-bold text-text-secondary bg-background/60 px-2 py-0.5 rounded-full">
                          {new Date(surgery.date).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {surgery.hospital && <p className="text-[11px] text-text-secondary mt-0.5">{surgery.hospital}</p>}
                      {surgery.notes && <p className="text-[10px] text-text-secondary/70 mt-0.5">{surgery.notes}</p>}
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
                  label="Surgery Name"
                  placeholder="e.g. Appendectomy"
                  value={draft.surgeryName}
                  onChange={(e) => setDraft({ ...draft, surgeryName: e.target.value })}
                />
                <Input
                  label="Date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </div>
              <Input
                label="Hospital / Medical Center"
                placeholder="e.g. Max Super Speciality Hospital"
                value={draft.hospital || ''}
                onChange={(e) => setDraft({ ...draft, hospital: e.target.value })}
              />
              <Input
                label="Notes"
                placeholder="Additional details about the surgery"
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
