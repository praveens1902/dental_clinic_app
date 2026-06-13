import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Users, 
  Calendar, 
  CreditCard, 
  FileText, 
  Command, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react'
import { useAlertStore } from '@/store/alertStore'

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'patients' | 'appointments' | 'invoices' | 'prescriptions'
  link: string
}

const MOCK_SEARCH_POOL: SearchItem[] = [
  // Patients
  { id: 'p1', title: 'Kabir Malhotra', subtitle: 'Age 34 • +91 98765 43210 • Patient ID: PAT-CP-101', category: 'patients', link: '/patients' },
  { id: 'p2', title: 'Riya Sen', subtitle: 'Age 28 • +91 87654 32109 • Patient ID: PAT-CP-102', category: 'patients', link: '/patients' },
  { id: 'p3', title: 'Dr. John Miller', subtitle: 'Age 45 • +91 76543 21098 • Patient ID: PAT-CP-103', category: 'patients', link: '/patients' },
  { id: 'p4', title: 'Aanya Gupta', subtitle: 'Age 22 • +91 95432 10987 • Patient ID: PAT-CP-104', category: 'patients', link: '/patients' },
  { id: 'p5', title: 'Vikram Singh', subtitle: 'Age 58 • +91 94321 09876 • Patient ID: PAT-CP-105', category: 'patients', link: '/patients' },
  
  // Appointments
  { id: 'a1', title: 'Root Canal Treatment', subtitle: 'Scheduled with Dr. Ananya Iyer • Today, 02:30 PM', category: 'appointments', link: '/appointments' },
  { id: 'a2', title: 'Teeth Scaling & Polishing', subtitle: 'Completed • Yesterday, 11:00 AM', category: 'appointments', link: '/appointments' },
  { id: 'a3', title: 'Initial Consultation', subtitle: 'Scheduled with Dr. Vivek Sirona • June 15, 10:00 AM', category: 'appointments', link: '/appointments' },
  
  // Invoices
  { id: 'i1', title: 'Invoice CP-9018', subtitle: 'Kabir Malhotra • Total: ₹4,500 • Unpaid balance: ₹1,500', category: 'invoices', link: '/billing' },
  { id: 'i2', title: 'Invoice CP-8923', subtitle: 'Riya Sen • Total: ₹12,000 • Fully Paid', category: 'invoices', link: '/billing' },
  
  // Prescriptions
  { id: 'rx1', title: 'Amoxicillin 500mg (Antibiotic)', subtitle: 'Aanya Gupta • 3 times daily for 5 days', category: 'prescriptions', link: '/patients' },
  { id: 'rx2', title: 'Paracetamol 650mg (Painkiller)', subtitle: 'Kabir Malhotra • Post root canal extraction care', category: 'prescriptions', link: '/patients' },
]

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useAlertStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen to keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Simple Debounced Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase()
      const matched = MOCK_SEARCH_POOL.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
      setResults(matched)
      setSelectedIndex(0)
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  // Handle keyboard traversal inside search matches
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      triggerNavigation(results[selectedIndex])
    }
  }

  const triggerNavigation = (item: SearchItem) => {
    setIsOpen(false)
    addToast({
      type: 'info',
      title: 'Command Navigated',
      message: `Navigated to ${item.title} (${item.category})`,
    })
    navigate(item.link)
  }

  if (!isOpen) {
    // Hidden CTA Floating help button to display trigger
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 md:bottom-6 md:right-6 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover shadow-lg hover:scale-105 transition-all z-30 group cursor-pointer"
        title="Open Command Palette (Ctrl+K)"
      >
        <Command className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </button>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-text-primary/45 backdrop-blur-sm z-[200] flex items-start justify-center p-4 md:pt-28 animate-fadeIn"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-surface w-full max-w-2xl rounded-modal border border-border shadow-modal overflow-hidden animate-zoomIn flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Row */}
        <div className="flex items-center px-5 py-4 border-b border-border/80 bg-background/25">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type command, patient, invoice code to query... (Use ↑↓ arrows)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm font-semibold text-text-primary pl-3.5 focus:outline-none placeholder:text-text-secondary/50 h-10"
          />
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-bold text-text-secondary pr-2 shadow-sm mr-4">
            ESC
          </kbd>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg border border-border hover:bg-background text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-4">
          {results.length === 0 ? (
            query.trim() ? (
              <div className="py-12 text-center text-xs font-semibold text-text-secondary">
                No matched medical archives found for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div className="py-6 space-y-3.5">
                <div className="flex items-center gap-1.5 px-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  <span>Interactive Quick Commands</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Register New Patient Profile', link: '/patients', icon: <Users className="w-4 h-4 text-primary" /> },
                    { label: 'Schedule Appointment Seat', link: '/appointments', icon: <Calendar className="w-4 h-4 text-info" /> },
                    { label: 'Verify Gross Clinic Revenue', link: '/billing', icon: <CreditCard className="w-4 h-4 text-success" /> },
                    { label: 'Browse Foundation UI Library', link: '/demo', icon: <FileText className="w-4 h-4 text-text-secondary" /> },
                  ].map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsOpen(false)
                        navigate(cmd.link)
                      }}
                      className="flex items-center gap-3 p-3.5 bg-background/50 hover:bg-primary-light/40 border border-border/60 hover:border-primary/20 rounded-xl text-left text-xs font-semibold text-text-primary transition-all"
                    >
                      <div className="p-1.5 bg-white rounded-lg border border-border/80">{cmd.icon}</div>
                      <span>{cmd.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Search Match Records ({results.length})</p>
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx
                const categoryIcon = {
                  patients: <Users className="w-4 h-4 text-primary" />,
                  appointments: <Calendar className="w-4 h-4 text-info" />,
                  invoices: <CreditCard className="w-4 h-4 text-success" />,
                  prescriptions: <FileText className="w-4 h-4 text-text-secondary" />,
                }[item.category]

                return (
                  <button
                    key={item.id}
                    onClick={() => triggerNavigation(item)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-primary-light/50 border-primary shadow-sm'
                        : 'bg-white border-border/40 hover:bg-background/40 hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2 rounded-lg border shrink-0 ${
                        isSelected ? 'bg-white border-primary/20' : 'bg-background border-border/80'
                      }`}>
                        {categoryIcon}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate">{item.title}</p>
                        <p className="text-[10px] font-semibold text-text-secondary truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-primary animate-fadeIn shrink-0">
                        <span>Select</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer command panel */}
        <div className="px-5 py-3 border-t border-border/85 bg-background/25 flex items-center justify-between text-[10px] text-text-secondary/70 font-semibold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="border bg-white px-1 rounded">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="border bg-white px-1 rounded">Enter</kbd> Select</span>
          </div>
          <span>Sirona Command System</span>
        </div>

      </div>
    </div>
  )
}
export default CommandPalette
