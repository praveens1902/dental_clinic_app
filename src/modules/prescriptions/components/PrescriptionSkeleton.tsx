import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const PrescriptionSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metric banner skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main form column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Medication template triggers */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-3">
            <Skeleton variant="rectangular" className="h-4 w-1/3 rounded-lg" />
            <div className="flex gap-2 py-1 overflow-x-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-8 w-24 rounded-lg shrink-0" />
              ))}
            </div>
          </div>

          {/* Form details */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/4 rounded-lg" />
            <Skeleton variant="rectangular" className="h-40 rounded-xl" />
          </div>

        </div>

        {/* Right sidebar column */}
        <div className="space-y-6">
          {/* PDF preview layout */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <Skeleton variant="rectangular" className="h-72 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  )
}
export default PrescriptionSkeleton
