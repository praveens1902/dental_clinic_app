import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const ClinicalNotesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column main inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* History table skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <Skeleton variant="rectangular" className="h-40 rounded-xl" />
          </div>

          {/* Today's clinical notes skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
          </div>
        </div>

        {/* Right Sidebar skeleton */}
        <div className="space-y-6">
          {/* Progress gauge skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <Skeleton variant="rectangular" className="h-36 rounded-xl" />
          </div>

          {/* Timeline list skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <div className="space-y-3.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default ClinicalNotesSkeleton
