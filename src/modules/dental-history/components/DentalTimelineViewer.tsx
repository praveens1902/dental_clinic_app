import React from 'react'
import { DentalHistoryTimelineItem } from '../types'
import { Clock, Activity } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'

interface DentalTimelineViewerProps {
  timeline: DentalHistoryTimelineItem[]
  isLoading?: boolean
}

export const DentalTimelineViewer: React.FC<DentalTimelineViewerProps> = ({
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
        title="No Dental Timeline Events"
        description="Timeline changes will appear here once dental history records are registered or adjusted."
        icon={Activity}
      />
    )
  }

  return (
    <div className="relative pl-4 border-l border-border/80 space-y-5 pt-1 ml-2">
      {timeline.map((item) => (
        <div key={item.id} className="relative text-left">
          {/* Connector Bullet */}
          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
          <div className="text-xs font-semibold text-text-primary">
            <p className="font-bold text-text-primary">{item.action}</p>
            <p className="text-[10px] text-text-secondary leading-normal mt-0.5">
              {item.description}
            </p>
            <span className="text-[9px] text-text-secondary/60 block mt-1.5 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
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
export default DentalTimelineViewer
