import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

// --- 1. PAGE HEADER (Title, Subtitle, Actions, Breadcrumbs) ---
interface Breadcrumb {
  label: string
  path?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5 mb-6 animate-fadeIn">
      
      {/* Title block */}
      <div className="space-y-1.5 min-w-0">
        
        {/* Dynamic Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-text-secondary/70 text-[11px] font-semibold tracking-wide uppercase mb-1">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
            </Link>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-text-secondary/40 shrink-0" />
                {b.path ? (
                  <Link to={b.path} className="hover:text-primary transition-colors truncate max-w-[120px]">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-text-secondary font-bold truncate max-w-[120px]">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-2xl md:text-3.5xl font-heading font-bold text-text-primary tracking-tight leading-none">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xs md:text-sm font-medium text-text-secondary leading-relaxed max-w-2xl truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action block */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  )
}

// --- 2. CONTENT CONTAINER ---
interface ContentContainerProps {
  children: React.ReactNode
  className?: string
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`max-w-[1600px] mx-auto w-full px-1 ${className}`}>
      {children}
    </div>
  )
}

// --- 3. PAGE SECTION ---
interface PageSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-0.5">
          {title && <h3 className="text-base font-bold text-text-primary font-heading">{title}</h3>}
          {description && <p className="text-xs text-text-secondary font-medium">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

// --- 4. PREMIUM CARD CONTAINER (Cards: 20px radius, soft shadows) ---
interface CardContainerProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-border/80 rounded-card p-5 md:p-6 shadow-premium transition-all duration-200 ${
        hoverable ? 'hover:shadow-premium-hover hover:border-text-secondary/20 cursor-pointer' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// --- 5. EMPTY CONTAINER PLACEHOLDER ---
interface EmptyContainerProps {
  message: string
  className?: string
}

export const EmptyContainer: React.FC<EmptyContainerProps> = ({
  message,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center bg-background/50 border border-dashed border-border rounded-card text-text-secondary/60 text-xs font-semibold ${className}`}>
      {message}
    </div>
  )
}

// --- 6. DASHBOARD LAYOUT GRID ---
interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 ${className}`}>
      {children}
    </div>
  )
}
