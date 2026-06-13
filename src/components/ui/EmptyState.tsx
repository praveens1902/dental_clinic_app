import React from 'react'
import { FolderOpen, SearchX, Plus, LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  variant?: 'no-data' | 'no-results'
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  variant = 'no-data',
}) => {
  // Use default icons depending on variant if none provided
  const DefaultIcon = variant === 'no-results' ? SearchX : FolderOpen

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-card border border-border/80 shadow-premium max-w-lg mx-auto w-full animate-fadeIn my-4">
      {/* Circle Icon Accent */}
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mb-5 shrink-0 pulse-medical">
        {Icon ? <Icon className="w-7 h-7" /> : <DefaultIcon className="w-7 h-7" />}
      </div>

      {/* Header and subtitle */}
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 max-w-sm">
        {description}
      </p>

      {/* Optional CTA */}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAction}
          className="font-bold py-2.5 rounded-xl"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}