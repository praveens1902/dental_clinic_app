import React, { forwardRef, useId } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, className = '', rows = 4, ...props }, ref) => {
    const id = useId()

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-primary flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-danger font-bold text-sm leading-3">*</span>}
          </label>
        )}

        <textarea
          id={id}
          ref={ref}
          rows={rows}
          required={required}
          className={`w-full bg-surface border rounded-input text-sm font-medium py-3 px-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary placeholder:text-text-secondary/40 ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/10'
              : 'border-border/80 focus:border-primary'
          } disabled:bg-background disabled:opacity-60 disabled:cursor-not-allowed resize-y`}
          {...props}
        />

        {error && (
          <span className="text-xs font-semibold text-danger animate-fadeIn">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span className="text-xs text-text-secondary/80">
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'