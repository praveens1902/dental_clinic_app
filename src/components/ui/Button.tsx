import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'info' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Style base definitions
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-40 rounded-button cursor-pointer'
    
    // Variant styles conforming to premium medical-grade requirements
    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-premium hover:shadow-premium-hover border border-transparent',
      secondary: 'bg-primary-light text-primary hover:bg-primary/15 border border-transparent font-semibold',
      outline: 'bg-white border border-border text-text-primary hover:bg-background hover:border-text-secondary/30',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-background border border-transparent',
      danger: 'bg-danger text-white hover:bg-danger/90 hover:shadow-md border border-transparent shadow-sm',
      info: 'bg-info/10 text-info hover:bg-info/20 border border-transparent font-semibold',
      success: 'bg-success/10 text-success hover:bg-success/20 border border-transparent font-semibold',
    }

    // Size definitions
    const sizeStyles = {
      xs: 'text-xs px-2.5 py-1.5 gap-1.5',
      sm: 'text-xs px-3.5 py-2 gap-1.5',
      md: 'text-sm px-5 py-3 gap-2',
      lg: 'text-base px-6 py-4 gap-2.5',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        )}
        
        {!isLoading && leftIcon && (
          <span className="shrink-0 flex items-center justify-center">{leftIcon}</span>
        )}
        
        <span>{children}</span>
        
        {!isLoading && rightIcon && (
          <span className="shrink-0 flex items-center justify-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'