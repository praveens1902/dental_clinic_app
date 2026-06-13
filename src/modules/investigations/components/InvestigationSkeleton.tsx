import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const InvestigationSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metrics Banner skeleton */}
      <Skeleton variant="rectangular" className="h-20 rounded-xl" />

      {/* Main Grid: Left Upload/Search, Right Gallery/List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Upload manager and filters */}
        <div className="space-y-6">
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
            <Skeleton variant="rectangular" className="h-10 rounded-lg" />
            <Skeleton variant="rectangular" className="h-10 rounded-lg" />
          </div>

          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-3">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <Skeleton variant="rectangular" className="h-10 rounded-lg" />
          </div>
        </div>

        {/* Right Side: Main Gallery and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton variant="rectangular" className="h-5 w-1/4 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" className="h-8 w-16 rounded-lg" />
                <Skeleton variant="rectangular" className="h-8 w-16 rounded-lg" />
              </div>
            </div>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="rectangular" className="h-32 rounded-xl" />
                  <Skeleton variant="text" className="w-2/3" />
                  <Skeleton variant="text" className="w-1/3" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/4 rounded-lg" />
            <div className="space-y-3">
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
export default InvestigationSkeleton
