import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { HelpCircle, AlertTriangle, MessageSquare } from 'lucide-react'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { DentalHistoryFormSchemaType } from '../schemas'

export const HabitsRiskFactorsSection: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<DentalHistoryFormSchemaType>()
  const habits = useWatch({ control, name: 'habits' })

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
          Habits & Risk Factors
        </p>
        <p className="text-xs text-text-secondary/70 mt-1">
          Monitor lifestyle factors and anatomical habits that directly impact dental health and bone density.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits?.map((habit, idx) => {
          const isChecked = habit.hasHabit
          const hasError = errors.habits?.[idx]

          return (
            <div
              key={habit.id}
              className={`border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between ${
                isChecked
                  ? 'bg-danger/5 border-danger/20 shadow-sm'
                  : 'bg-background/20 border-border/60 hover:border-border'
              }`}
            >
              <div className="space-y-3">
                <Checkbox
                  label={
                    <span className="flex items-center gap-2">
                      {isChecked && <AlertTriangle className="w-4 h-4 text-danger shrink-0" />}
                      <span className={`text-sm font-bold ${isChecked ? 'text-danger' : 'text-text-primary'}`}>
                        {habit.habitName}
                      </span>
                    </span>
                  }
                  {...register(`habits.${idx}.hasHabit` as const)}
                />

                {isChecked && (
                  <div className="space-y-2.5 pt-2 border-t border-danger/10 animate-fadeIn">
                    <Input
                      label="Frequency"
                      placeholder="e.g. 5 cigarettes/day, Nightly"
                      leftIcon={<HelpCircle className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.frequency?.message}
                      {...register(`habits.${idx}.frequency` as const)}
                    />
                    <Input
                      label="Notes"
                      placeholder="e.g. Triggered by stress"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5 text-text-secondary" />}
                      error={hasError?.notes?.message}
                      {...register(`habits.${idx}.notes` as const)}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default HabitsRiskFactorsSection
