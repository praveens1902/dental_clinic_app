import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import { AlertType } from '@/store/alertStore'

interface InlineAlertProps {
  type?: AlertType
  title?: string
  message: React.ReactNode
  className?: string
}

const INLINE_STYLES: Record<AlertType, string> = {
  success: 'bg-success/5 border-success/20 text-text-primary',
  warning: 'bg-warning/5 border-warning/20 text-text-primary',
  error: 'bg-danger/5 border-danger/20 text-text-primary',
  info: 'bg-info/5 border-info/20 text-text-primary',
}

const INLINE_ICONS: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
  error: <XCircle className="w-5 h-5 text-danger shrink-0" />,
  info: <Info className="w-5 h-5 text-info shrink-0" />,
}

export const InlineAlert: React.FC<InlineAlertProps> = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  return (
    <div
      className={`flex gap-3.5 p-4 rounded-card border ${
        INLINE_STYLES[type]
      } ${className}`}
      role="alert"
    >
      <div className="mt-0.5">{INLINE_ICONS[type]}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-xs font-bold text-text-primary mb-1">{title}</h4>}
        <div className="text-xs text-text-secondary font-medium leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  )
}