import React from 'react'
import { Clock, History } from 'lucide-react'
import { PrescriptionTimelineItem } from '../types'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'

interface PrescriptionTimelineProps {
  timeline: PrescriptionTimelineItem[]
  isLoading?: boolean
}

export const PrescriptionTimeline: React.FC<PrescriptionTimelineProps> = ({
  timeline,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-start">
            <Skeleton variant="circle" className="w-8 h-8 mt-0.5" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton variant="text" className="w-1/3" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (timeline.length === 0) {
    return (
      <EmptyState
        title="No Activity Events"
        description="Prescription timeline activities will appear here once prescriptions are saved or printed."
        icon={History}
      />
    )
  }

  return (
    <div className="relative pl-4 border-l border-border/80 space-y-5 pt-1 ml-2">
      {timeline.map((item) => (
        <div key={item.id} className="relative text-left">
          {/* Connector Bullet */}
          <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
          <div className="text-xs font-semibold text-text-primary">
            <p className="font-bold text-text-primary leading-snug">{item.activity}</p>
            <span className="text-[9px] text-text-secondary/60 block mt-1.5 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-text-secondary/50" />
              {new Date(item.createdAt).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              {' • By '}{item.performedBy}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
export default PrescriptionTimeline
