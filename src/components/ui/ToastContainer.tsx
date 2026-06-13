import React from 'react'
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X 
} from 'lucide-react'
import { useAlertStore, AlertType } from '@/store/alertStore'

const TYPE_ICONS: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
  error: <XCircle className="w-5 h-5 text-danger shrink-0" />,
  info: <Info className="w-5 h-5 text-info shrink-0" />,
}

const TYPE_BORDER_BG: Record<AlertType, string> = {
  success: 'bg-white border-success/30 shadow-lg shadow-success/5',
  warning: 'bg-white border-warning/30 shadow-lg shadow-warning/5',
  error: 'bg-white border-danger/30 shadow-lg shadow-danger/5',
  info: 'bg-white border-info/30 shadow-lg shadow-info/5',
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAlertStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex gap-3 p-4 rounded-xl border ${
            TYPE_BORDER_BG[toast.type]
          } transition-all duration-300 animate-slideIn`}
          role="alert"
        >
          <div className="mt-0.5">{TYPE_ICONS[toast.type]}</div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-text-primary">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-text-secondary font-medium mt-1 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="text-text-secondary/50 hover:text-text-primary p-0.5 rounded-lg hover:bg-background transition-colors self-start shrink-0"
            aria-label="Close Toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}