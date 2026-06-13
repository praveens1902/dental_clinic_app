import React, { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  required?: boolean
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, required, placeholder, className = '', ...props }, ref) => {
    const id = useId()

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-primary flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-danger font-bold text-sm leading-3">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <select
            id={id}
            ref={ref}
            required={required}
            className={`w-full bg-surface border rounded-input text-sm font-medium py-3 pl-4 pr-10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary appearance-none cursor-pointer ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/10'
                : 'border-border/80 focus:border-primary'
            } disabled:bg-background disabled:opacity-60 disabled:cursor-not-allowed`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

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

Select.displayName = 'Select'