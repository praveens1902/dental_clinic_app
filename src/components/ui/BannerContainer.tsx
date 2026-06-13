import React from 'react'
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import { useAlertStore, AlertType } from '@/store/alertStore'

const BANNER_STYLES: Record<AlertType, string> = {
  success: 'bg-success/10 border-success/20 text-success',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  error: 'bg-danger/10 border-danger/20 text-danger',
  info: 'bg-info/10 border-info/20 text-info',
}

const BANNER_ICONS: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
  error: <XCircle className="w-4 h-4 shrink-0" />,
  info: <Info className="w-4 h-4 shrink-0" />,
}

export const BannerContainer: React.FC = () => {
  const { banners, removeBanner } = useAlertStore()

  if (banners.length === 0) return null

  return (
    <div className="w-full flex flex-col gap-2 mb-6">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-semibold ${
            BANNER_STYLES[banner.type]
          } animate-fadeIn`}
          role="status"
        >
          <div className="flex items-center gap-2.5">
            {BANNER_ICONS[banner.type]}
            <span>{banner.message}</span>
          </div>
          {banner.dismissible !== false && (
            <button
              onClick={() => removeBanner(banner.id)}
              className="hover:opacity-80 p-0.5 rounded-md hover:bg-black/5"
              aria-label="Dismiss Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}