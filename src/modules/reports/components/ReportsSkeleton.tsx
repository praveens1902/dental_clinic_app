import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const ReportsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Global filters bar skeleton */}
      <Skeleton variant="rectangular" className="h-14 rounded-xl" />

      {/* KPI stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-16 rounded-xl" />
        ))}
      </div>

      {/* Main split display: Dual large chart boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
          <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
          <Skeleton variant="rectangular" className="h-72 rounded-xl" />
        </div>

        <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
          <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
          <Skeleton variant="rectangular" className="h-72 rounded-xl" />
        </div>
      </div>

      {/* Leaderboard table skeleton */}
      <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
        <Skeleton variant="rectangular" className="h-5 w-1/4 rounded-lg" />
        <Skeleton variant="rectangular" className="h-40 rounded-xl" />
      </div>
    </div>
  )
}
export default ReportsSkeleton
