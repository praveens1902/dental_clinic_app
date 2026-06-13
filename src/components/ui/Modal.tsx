import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  footer?: React.ReactNode
}

const SIZE_STYLES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full h-full rounded-none',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-text-primary/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto custom-scrollbar animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full bg-surface border border-border shadow-modal rounded-modal flex flex-col max-h-[90vh] overflow-hidden animate-zoomIn ${
          SIZE_STYLES[size]
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/80">
          <h3 className="text-lg font-heading font-bold text-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border hover:bg-background text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-sm font-medium text-text-primary/90 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border/80 bg-background/30 flex items-center justify-end gap-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}