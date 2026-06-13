import React, { forwardRef, useId } from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId()

    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        <div className="flex items-start gap-2.5 cursor-pointer">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className="w-5 h-5 rounded-md border border-border/80 text-primary focus:ring-primary/20 focus:ring-2 bg-surface cursor-pointer mt-0.5 accent-primary transition-all disabled:opacity-50"
            {...props}
          />
          {label && (
            <label htmlFor={id} className="text-sm font-semibold text-text-primary select-none cursor-pointer leading-tight">
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <span className="text-xs font-semibold text-danger animate-fadeIn ml-7">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'