import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { CommandPalette } from './CommandPalette'
import { useUIStore } from '@/store/uiStore'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarExpanded } = useUIStore()

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans selection:bg-primary-light selection:text-primary">
      
      {/* Sidebar - Desktop/Laptop */}
      <Sidebar />

      {/* Main Container */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarExpanded ? 'md:pl-64' : 'md:pl-20'
        }`}
      >
        {/* Global Header */}
        <Header />

        {/* Dynamic Page Content with responsive grid padding */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-x-hidden pb-24 md:pb-8">
          <div className="max-w-[1600px] mx-auto w-full animate-fadeIn">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation (Bottom Nav + Slide-out Drawer) */}
      <MobileNav />

      {/* Command Palette / Ctrl+K Global Search Console */}
      <CommandPalette />
    </div>
  )
}