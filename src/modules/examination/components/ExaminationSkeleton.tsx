import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const ExaminationSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Metric Skeleton */}
      <Skeleton variant="rectangular" className="h-20 rounded-xl" />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chief Complaint Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/4 rounded-lg" />
            <Skeleton variant="rectangular" className="h-24 rounded-xl" />
          </div>

          {/* Odontogram Card Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
              <Skeleton variant="rectangular" className="h-8 w-32 rounded-lg" />
            </div>
            {/* Upper Jaw Teeth row */}
            <div className="flex justify-between gap-2 overflow-x-auto py-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="w-10 h-16 rounded-lg shrink-0" />
              ))}
            </div>
            {/* Lower Jaw Teeth row */}
            <div className="flex justify-between gap-2 overflow-x-auto py-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="w-10 h-16 rounded-lg shrink-0" />
              ))}
            </div>
          </div>

          {/* Clinical Findings Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-16 rounded-xl" />
              ))}
            </div>
          </div>

        </div>

        {/* Right sidebar column */}
        <div className="space-y-6">
          
          {/* Summary Card Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
          </div>

          {/* Timeline Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-12 rounded-xl" />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
export default ExaminationSkeleton
