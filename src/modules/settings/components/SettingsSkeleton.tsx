import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metrics KPIs skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="h-16 rounded-xl" />
        ))}
      </div>

      {/* Main split display: Left navigation sidebar list, Right settings form workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left navigation sidebar list */}
        <div className="space-y-2 bg-white border border-border/80 rounded-xl p-3 shadow-premium select-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-10 rounded-lg" />
          ))}
        </div>

        {/* Right settings form workspace */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium space-y-4">
            <Skeleton variant="rectangular" className="h-5 w-1/3 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
export default SettingsSkeleton
