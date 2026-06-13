import React from 'react'
import { AlertOctagon, WifiOff, ShieldAlert, ArrowLeft, RotateCw } from 'lucide-react'
import { Button } from './Button'
import { useNavigate } from 'react-router-dom'

export type ErrorType = 'general' | 'offline' | 'permission-denied'

interface ErrorStateProps {
  type?: ErrorType
  title?: string
  description?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'general',
  title,
  description,
  onRetry,
}) => {
  const navigate = useNavigate()

  // Content configurations
  const config = {
    general: {
      title: title || 'Something went wrong',
      description: description || 'Our servers encountered an unexpected issue. Please reload or try again shortly.',
      icon: <AlertOctagon className="w-8 h-8 text-danger" />,
      bg: 'bg-danger/10',
    },
    offline: {
      title: title || 'You are offline',
      description: description || 'No internet connection detected. Please verify your network and connection, and try again.',
      icon: <WifiOff className="w-8 h-8 text-warning" />,
      bg: 'bg-warning/10',
    },
    'permission-denied': {
      title: title || 'Access Denied',
      description: description || 'You do not have the required permissions to view this secure medical resource.',
      icon: <ShieldAlert className="w-8 h-8 text-danger" />,
      bg: 'bg-danger/10',
    },
  }

  const active = config[type]

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-card border border-border/80 shadow-premium max-w-lg mx-auto w-full animate-fadeIn my-4">
      {/* Visual Accent */}
      <div className={`w-16 h-16 rounded-full ${active.bg} flex items-center justify-center mb-5 shrink-0`}>
        {active.icon}
      </div>

      {/* Info texts */}
      <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
        {active.title}
      </h3>
      <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 max-w-xs">
        {active.description}
      </p>

      {/* Button Triggers */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        {type === 'permission-denied' ? (
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/')}
            className="flex-1 font-bold rounded-xl"
          >
            Dashboard
          </Button>
        ) : (
          onRetry && (
            <Button
              variant="primary"
              leftIcon={<RotateCw className="w-4 h-4" />}
              onClick={onRetry}
              className="flex-1 font-bold rounded-xl"
            >
              Retry
            </Button>
          )
        )}
      </div>
    </div>
  )
}