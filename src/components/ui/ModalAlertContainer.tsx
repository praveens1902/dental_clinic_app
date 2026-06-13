import React from 'react'
import { AlertTriangle, CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useAlertStore, AlertType } from '@/store/alertStore'
import { Button } from './Button'

const OVERLAY_ICONS: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle2 className="w-12 h-12 text-success" />,
  warning: <AlertTriangle className="w-12 h-12 text-warning" />,
  error: <XCircle className="w-12 h-12 text-danger" />,
  info: <Info className="w-12 h-12 text-info" />,
}

export const ModalAlertContainer: React.FC = () => {
  const { modalAlert, hideModalAlert } = useAlertStore()

  if (!modalAlert || !modalAlert.isOpen) return null

  const { type, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel } = modalAlert

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    hideModalAlert()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    hideModalAlert()
  }

  return (
    <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-surface border border-border w-full max-w-md rounded-modal shadow-modal p-6 flex flex-col items-center text-center animate-zoomIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss trigger */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border hover:bg-background text-text-secondary hover:text-text-primary transition-all"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Circular Icon Accent */}
        <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center mb-5">
          {OVERLAY_ICONS[type]}
        </div>

        {/* Header Title */}
        <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
          {title}
        </h3>

        {/* Dialog Description */}
        <p className="text-sm font-medium text-text-secondary leading-relaxed mb-6">
          {message}
        </p>

        {/* Primary and cancel triggers */}
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 font-bold py-3 text-sm rounded-xl"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={type === 'error' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            className="flex-1 font-bold py-3 text-sm rounded-xl"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}