import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Calendar, Clock, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { PrescriptionFormSchemaType } from '../schemas'

export const FollowUpPlanner: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<PrescriptionFormSchemaType>()

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide text-left">
          Follow-Up Session Scheduler
        </p>
        <p className="text-xs text-text-secondary/70 mt-1 text-left">
          Schedule the patient&apos;s next evaluation milestone. Coordinates with follows-up indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <Input
          label="Follow-Up Date"
          type="date"
          leftIcon={<Calendar className="w-3.5 h-3.5 text-text-secondary" />}
          error={errors.followUp?.followUpDate?.message}
          {...register('followUp.followUpDate' as const)}
        />

        <Input
          label="Follow-Up Time"
          type="time"
          leftIcon={<Clock className="w-3.5 h-3.5 text-text-secondary" />}
          error={errors.followUp?.followUpTime?.message}
          {...register('followUp.followUpTime' as const)}
        />
      </div>

      <Input
        label="Suture Check / Care Remarks"
        placeholder="e.g. Call client for suture checks"
        leftIcon={<MessageSquare className="w-3.5 h-3.5 text-text-secondary" />}
        error={errors.followUp?.remarks?.message}
        {...register('followUp.remarks' as const)}
      />
    </div>
  )
}
export default FollowUpPlanner
