import React from 'react'
import { Clock, History } from 'lucide-react'
import { InvestigationTimelineItem } from '../types'
import { EmptyState } from '@/components/ui/EmptyState'

interface InvestigationTimelineProps {
  timeline: InvestigationTimelineItem[]
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  timeline,
}) => {
  if (timeline.length === 0) {
    return (
      <EmptyState
        title="No Timeline Logged"
        description="Chronological log entries will appear here once radiographs or clinical snapshots are added."
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
            <p className="font-bold text-text-primary">{item.activity}</p>
            <span className="text-[9px] text-text-secondary/60 block mt-1 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-text-secondary/50" />
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
export default InvestigationTimeline
