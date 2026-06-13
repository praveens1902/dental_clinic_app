import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'card' | 'table-row' | 'rectangular'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  // Base shimmering animate-pulse style
  const baseStyle = 'bg-border/60 animate-pulse rounded-md'

  const styles = {
    text: 'h-3 w-3/4 rounded',
    circle: 'rounded-full h-10 w-10 shrink-0',
    rectangular: 'h-24 w-full',
    card: 'h-48 w-full rounded-card border border-border/40 p-5 flex flex-col gap-4',
    'table-row': 'h-14 w-full flex items-center justify-between border-b border-border/40 px-4 gap-4',
  }

  if (variant === 'card') {
    return (
      <div className={`${baseStyle} ${styles.card} ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-border/90 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-border/90 w-1/3 rounded"></div>
            <div className="h-2.5 bg-border/80 w-1/4 rounded"></div>
          </div>
        </div>
        <div className="flex-1 space-y-3.5 pt-4">
          <div className="h-3 bg-border/85 w-full rounded"></div>
          <div className="h-3 bg-border/85 w-5/6 rounded"></div>
          <div className="h-3 bg-border/85 w-2/3 rounded"></div>
        </div>
      </div>
    )
  }

  if (variant === 'table-row') {
    return (
      <div className={`${styles['table-row']} ${className}`}>
        <div className="w-6 h-6 bg-border/80 rounded animate-pulse"></div>
        <div className="w-1/4 h-3 bg-border/85 rounded animate-pulse"></div>
        <div className="w-1/5 h-3 bg-border/80 rounded animate-pulse"></div>
        <div className="w-1/6 h-3 bg-border/80 rounded animate-pulse"></div>
        <div className="w-12 h-6 bg-border/80 rounded-full animate-pulse"></div>
      </div>
    )
  }

  return <div className={`${baseStyle} ${styles[variant]} ${className}`} />
}

// Composite Loading State layout to match typical dentist SaaS pages
export const PageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton variant="rectangular" className="h-8 w-1/4 rounded-lg" />
        <Skeleton variant="rectangular" className="h-4 w-1/3 rounded-md" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>

      {/* Primary Table Skeleton */}
      <div className="bg-white border border-border/80 rounded-card p-5 space-y-4">
        {/* Table Toolbar Skeleton */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton variant="rectangular" className="h-10 w-1/3 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
            <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-1">
          <Skeleton variant="table-row" />
          <Skeleton variant="table-row" />
          <Skeleton variant="table-row" />
          <Skeleton variant="table-row" />
          <Skeleton variant="table-row" />
        </div>
      </div>
    </div>
  )
}