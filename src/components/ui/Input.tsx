import React, { forwardRef, useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, leftIcon, rightIcon, className = '', type = 'text', ...props }, ref) => {
    const id = useId()
    
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-primary flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-danger font-bold text-sm leading-3">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-text-secondary flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            id={id}
            ref={ref}
            type={type}
            required={required}
            className={`w-full bg-surface border rounded-input text-sm font-medium py-3 px-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary placeholder:text-text-secondary/40 ${
              leftIcon ? 'pl-11' : ''
            } ${rightIcon ? 'pr-11' : ''} ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/10'
                : 'border-border/80 focus:border-primary'
            } disabled:bg-background disabled:opacity-60 disabled:cursor-not-allowed`}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3.5 text-text-secondary flex items-center justify-center pointer-events-none">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input'