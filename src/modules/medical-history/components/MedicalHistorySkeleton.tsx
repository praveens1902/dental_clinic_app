import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const MedicalHistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Risk Indicator Skeleton */}
      <Skeleton variant="rectangular" className="h-20 rounded-xl" />

      {/* Conditions Grid Skeleton */}
      <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
        <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-12 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Vitals Grid Skeleton */}
      <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
        <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-12 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Two Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
          <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
          <Skeleton variant="rectangular" className="h-32 rounded-xl" />
        </div>
        <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
          <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
          <Skeleton variant="rectangular" className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
