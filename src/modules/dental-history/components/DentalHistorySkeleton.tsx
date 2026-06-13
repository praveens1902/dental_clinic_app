import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const DentalHistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dental Score Card Skeleton */}
      <Skeleton variant="rectangular" className="h-24 rounded-xl" />

      {/* Main Grid: Form Left, Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Previous Dental Treatment Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-14 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Oral Hygiene Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Summary Card Skeleton */}
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <Skeleton variant="rectangular" className="h-40 rounded-xl" />
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
export default DentalHistorySkeleton
