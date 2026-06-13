import React, { useState, useEffect } from 'react'
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form'
import { Plus, Trash2, Calendar, IndianRupee, ClipboardList, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { examinationService } from '@/modules/examination/services/examinationService'
import { ClinicalNotesFormSchemaType } from '../schemas'
import { PlannedTreatmentItem, TreatmentStatus, TreatmentPriority } from '../types'

export const TreatmentPlanningManager: React.FC = () => {
  const { control, setValue } = useFormContext<ClinicalNotesFormSchemaType>()

  // Field Array for Planned Treatments
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plannedTreatments',
  })

  // Local inputs state
  const [tooth, setTooth] = useState('')
  const [name, setName] = useState('')
  const [priority, setPriority] = useState<TreatmentPriority>('Medium')
  const [sessions, setSessions] = useState(1)
  const [targetDate, setTargetDate] = useState('')
  const [status, setStatus] = useState<TreatmentStatus>('Planned')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [localError, setLocalError] = useState('')

  const suggestions = examinationService.getTreatmentSuggestions()

  const handleAddPlannedTreatment = () => {
    if (!tooth.trim()) {
      setLocalError('Tooth reference is required (e.g. 14, 36 or All).')
      return
    }
    if (!name.trim()) {
      setLocalError('Planned treatment name is required.')
      return
    }
    if (!targetDate) {
      setLocalError('Please select a targeted date.')
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
      treatmentName: name.trim(),
      priority,
      estimatedSessions: Number(sessions),
      targetDate,
      status,
      estimatedCost,
      notes: notes.trim(),
    })

    // Clear local inputs
    setTooth('')
    setName('')
    setPriority('Medium')
    setSessions(1)
    setTargetDate('')
    setStatus('Planned')
    setCost('')
    setNotes('')
  }

  // Watch the planned treatments to build a real-time visual progress card!
  const watchedPlans = useWatch({ control, name: 'plannedTreatments' }) || []
  
  useEffect(() => {}, [watchedPlans]) // trigger render on watch plans change

  const stats = React.useMemo(() => {
    const total = watchedPlans.length
    const completed = watchedPlans.filter((p: any) => p.status === 'Completed').length
    const inProgress = watchedPlans.filter((p: any) => p.status === 'In Progress').length
    const planned = watchedPlans.filter((p: any) => p.status === 'Planned' || p.status === 'Approved').length
    const remaining = total - completed
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, planned, remaining, pct }
  }, [watchedPlans])

  const ALL_STATUS_OPTIONS = [
    { value: 'Planned', label: 'Planned' },
    { value: 'Approved', label: 'Approved' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      
      {/* 1. VISUAL PROGRESS TRACKER GAUGE */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-5 justify-between shadow-premium select-none">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">
            <BarChart2 className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-text-secondary uppercase">Treatment Path Completion</span>
            <h4 className="text-base font-black text-text-primary flex items-center gap-1.5">
              <span>{stats.pct}% Completed</span>
              <span className="text-xs font-semibold text-text-secondary/70">({stats.completed}/{stats.total} Procedures done)</span>
            </h4>
            <p className="text-[10px] text-text-secondary leading-tight font-medium">
              {stats.remaining > 0 ? `${stats.remaining} planned dental actions remaining.` : 'All planned treatment courses have been completed!'}
            </p>
          </div>
        </div>

        {/* Counts indicators */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 text-center text-xs font-bold w-full md:w-auto justify-between sm:justify-end">
          <div className="px-2.5 py-1.5 bg-white border border-border/80 rounded-xl min-w-[70px]">
            <span className="text-[9px] text-text-secondary font-bold uppercase block mb-0.5">Planned</span>
            <span className="text-sm font-black text-text-primary">{stats.planned}</span>
          </div>
          <div className="px-2.5 py-1.5 bg-white border border-border/80 rounded-xl min-w-[70px]">
            <span className="text-[9px] text-text-secondary font-bold uppercase block mb-0.5">Progress</span>
            <span className="text-sm font-black text-warning-dark">{stats.inProgress}</span>
          </div>
          <div className="px-2.5 py-1.5 bg-white border border-border/80 rounded-xl min-w-[70px]">
            <span className="text-[9px] text-text-secondary font-bold uppercase block mb-0.5">Completed</span>
            <span className="text-sm font-black text-success">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* 2. ADD PLAN SUBFORM CARD */}
      <div className="bg-background/20 border border-border/60 rounded-xl p-4.5 space-y-4">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-primary animate-pulse" />
          <span>Formulate Treatment Plan</span>
        </h4>

        {localError && (
          <span className="text-xs font-semibold text-danger block animate-fadeIn">
            {localError}
          </span>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end text-left">
          <Input
            label="Tooth Reference"
            placeholder="e.g. 14, 36, All"
            value={tooth}
            onChange={(e) => setTooth(e.target.value)}
          />

          <div className="space-y-1.5 text-left">
            <span className="text-xs font-semibold text-text-primary">Planned Procedure</span>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Zirconia Crown, RCT..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-border/80 rounded-input text-sm font-medium py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary"
                list="planned-suggestions"
              />
              <datalist id="planned-suggestions">
                {suggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TreatmentPriority)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />

          <Input
            label="Est. Cost (INR)"
            placeholder="e.g. 6500"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-left">
          <Input
            label="Est. Sessions"
            type="number"
            value={sessions}
            onChange={(e) => setSessions(Number(e.target.value))}
          />

          <Input
            label="Target Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <Select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TreatmentStatus)}
            options={ALL_STATUS_OPTIONS}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full text-left">
            <Input
              label="Procedural Notes"
              placeholder="e.g. Prep scheduled after RCT core obturation"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleAddPlannedTreatment}
            className="w-full sm:w-auto font-bold border-primary/20 text-primary hover:bg-primary-light/10 text-xs py-2.5 px-5 h-auto shrink-0"
          >
            Plan Treatment
          </Button>
        </div>
      </div>

      {/* 3. FUTURE TREATMENT PLANS LIST */}
      <div className="space-y-3 text-left">
        <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          Proposed Future Plan Courses ({fields.length})
        </h4>

        {fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-xl text-xs text-text-secondary/50 font-semibold bg-background/5">
            No future treatment courses planned yet. Add plans using the form above.
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const plan = field as unknown as PlannedTreatmentItem

              return (
                <div
                  key={field.id}
                  className="bg-white border border-border/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/20 hover:shadow-premium transition-all"
                >
                  <div className="flex items-start gap-3 text-left min-w-0">
                    {/* Tooth identifier box */}
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex flex-col items-center justify-center border border-primary/10 shrink-0">
                      <span className="text-[8px] text-text-secondary font-black uppercase leading-none">Tooth</span>
                      <span className="text-xs text-primary font-black mt-0.5">{plan.toothNumber}</span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          plan.priority === 'Urgent' ? 'bg-danger/15 text-danger' :
                          plan.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          plan.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {plan.priority} Priority
                        </span>
                        
                        <h5 className="text-xs font-black text-text-primary leading-tight truncate">
                          {plan.treatmentName}
                        </h5>
                      </div>

                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[10px] text-text-secondary font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-text-secondary/50" />
                          <span>Target: {new Date(plan.targetDate).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
                        </span>
                        <span>Sessions: {plan.estimatedSessions}</span>
                      </div>

                      {plan.notes && (
                        <p className="text-[10px] text-text-secondary font-medium leading-normal italic truncate" title={plan.notes}>
                          Note: {plan.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Operational Status Selector Workflow and Costs */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-4 shrink-0 border-t border-border/30 pt-3 md:border-t-0 md:pt-0">
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[10px] font-bold text-text-secondary uppercase">Est. Cost</p>
                      <p className="text-sm font-black text-text-primary flex items-center sm:justify-end gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5 text-text-secondary" />
                        <span>{plan.estimatedCost.toLocaleString()}</span>
                      </p>
                    </div>

                    {/* Operational workflow status toggle */}
                    <div className="w-36 shrink-0">
                      <Select
                        value={plan.status}
                        onChange={(e) => {
                          setValue(`plannedTreatments.${idx}.status` as any, e.target.value as TreatmentStatus, { shouldDirty: true })
                        }}
                        options={ALL_STATUS_OPTIONS}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => remove(idx)}
                      leftIcon={<Trash2 className="w-4 h-4 text-text-secondary hover:text-danger animate-fadeIn" />}
                      className="hover:bg-danger/5 px-2 py-1.5 h-auto self-center shrink-0 hidden sm:flex"
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
export default TreatmentPlanningManager
