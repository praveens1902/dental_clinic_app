import React from 'react'
import { Sparkles, ShieldCheck, HeartPulse } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-sans selection:bg-primary-light selection:text-primary">
      
      {/* 1. LEFT BRANDING PANEL (Desktop/Laptop split layout) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-white flex-col justify-between p-16 relative overflow-hidden">
        
        {/* Ambient Medical Graphic background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,245,238,0.12),transparent_50%)]" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-primary-hover/30 blur-2xl" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-warning animate-pulse" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight">Sirona</span>
          <span className="bg-white/15 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">ENTERPRISE</span>
        </div>

        {/* Mid Branding Content */}
        <div className="space-y-6 max-w-lg relative z-10 my-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-[1.15] tracking-tight text-white">
            Clinical Excellence. <br />
            <span className="text-primary-light">Automated & Scalable.</span>
          </h1>
          <p className="text-base text-white/85 font-medium leading-relaxed">
            Empower your multi-branch dental network with diagnostic charting, interactive SVG odontograms, real-time invoicing, and patient communications in a single, secure medical-grade SaaS environment.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary-light shrink-0" />
              <span className="text-xs font-semibold text-white/90">HIPAA & GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-5 h-5 text-primary-light shrink-0" />
              <span className="text-xs font-semibold text-white/90">32-Tooth Chart Mapping</span>
            </div>
          </div>
        </div>

        {/* Left Footer branding */}
        <div className="relative z-10 text-xs font-medium text-white/65 flex justify-between items-center">
          <span>© 2026 Sirona Dental SaaS Ltd.</span>
          <span className="hover:underline cursor-pointer">Privacy & HIPAA Security standard</span>
        </div>
      </div>

      {/* 2. RIGHT AUTHENTICATION PANEL (Responsive card workspace) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-12 md:py-20 max-w-md mx-auto lg:max-w-none w-full bg-background">
        <div className="lg:max-w-[440px] lg:mx-auto w-full space-y-8">
          
          {/* Mobile/Tablet branding banner */}
          <div className="flex lg:hidden flex-col items-center text-center space-y-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-primary">Sirona</span>
          </div>

          {/* Page Headers */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
              {title}
            </h2>
            <p className="text-sm text-text-secondary font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Children Form Cards */}
          <div className="bg-white border border-border/80 rounded-card p-6 sm:p-8 shadow-premium animate-fadeIn relative overflow-hidden">
            {children}
          </div>

          {/* Footer controls */}
          <div className="text-center text-xs font-medium text-text-secondary/60">
            Need support onboarding? Contact Sirona Help Desk <br />
            <span className="text-primary font-bold hover:underline cursor-pointer">support@sironadental.com</span>
          </div>

        </div>
      </div>

    </div>
  )
}
