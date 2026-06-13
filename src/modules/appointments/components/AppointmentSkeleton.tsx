import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const AppointmentSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI banner skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Main split display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main list/calendar area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" className="h-8 w-20 rounded-lg" />
                <Skeleton variant="rectangular" className="h-8 w-20 rounded-lg" />
              </div>
            </div>
            <Skeleton variant="rectangular" className="h-64 rounded-xl" />
          </div>
        </div>

        {/* Sidebar analytics */}
        <div className="space-y-6">
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
          </div>

          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/2 rounded-lg" />
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
export default AppointmentSkeleton
