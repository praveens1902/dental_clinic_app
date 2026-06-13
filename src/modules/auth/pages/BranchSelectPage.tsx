import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Phone, ArrowRight, Building2, CheckCircle2 } from 'lucide-react'
import { authService } from '../services/authService'
import { SelectableBranch } from '../types'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUIStore } from '@/store/uiStore'
import { useAlertStore } from '@/store/alertStore'

export const BranchSelectPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useAlertStore()
  const { activeBranch, setActiveBranch } = useUIStore() // Global branch store
  
  const [branches, setBranches] = useState<SelectableBranch[]>([])
  const [selectedBranchId, setSelectedBranchId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorText, setErrorText] = useState('')

  // Load Branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const list = await authService.getBranches()
        setBranches(list)
        
        // Auto-highlight first branch or existing global branch
        if (activeBranch) {
          const matched = list.find((b) => b.id === activeBranch.id)
          if (matched) setSelectedBranchId(matched.id)
        } else if (list.length > 0) {
          setSelectedBranchId(list[0].id)
        }
      } catch (err: any) {
        setErrorText(err.message || 'Failed to fetch active clinic branches.')
        addToast({
          type: 'error',
          title: 'Retrieval Error',
          message: 'Could not load dental branches.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchBranches()
  }, [activeBranch, addToast])

  // Filter Branches by search query
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const q = searchQuery.toLowerCase()
      return (
        b.branchName.toLowerCase().includes(q) ||
        b.branchCode.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
      )
    })
  }, [branches, searchQuery])

  const handleContinue = () => {
    const chosen = branches.find((b) => b.id === selectedBranchId)
    if (!chosen) {
      addToast({
        type: 'warning',
        title: 'Selection Required',
        message: 'Please click on a branch card to assign your active session.',
      })
      return
    }

    // Save Selected Branch to global UIStore state
    setActiveBranch(chosen.id)

    addToast({
      type: 'success',
      title: 'Branch Established',
      message: `Active clinic scope configured to: ${chosen.branchName}`,
    })

    // Secure route redirection to main app Dashboard
    navigate('/')
  }

  return (
    <AuthLayout
      title="Clinic Environment"
      subtitle="Select the active medical branch workspace for your current session."
    >
      {/* 1. SEARCH INPUT */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search clinic branches or codes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-text-primary placeholder:text-text-secondary/50"
        />
      </div>

      {/* 2. MAIN CONTENT (LOADING/ERROR OR LIVE TILES) */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
          <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
          <Skeleton variant="rectangular" className="h-28 w-full rounded-2xl" />
        </div>
      ) : errorText ? (
        <div className="p-6 text-center text-xs font-bold text-danger bg-danger/5 border border-danger/20 rounded-xl animate-fadeIn">
          {errorText}
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="py-12 text-center text-xs font-semibold text-text-secondary animate-fadeIn">
          No branches matched your search parameter.
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1.5 custom-scrollbar">
          {filteredBranches.map((branch) => {
            const isSelected = selectedBranchId === branch.id
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranchId(branch.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary-light/45 shadow shadow-primary/5'
                    : 'border-border/80 bg-white hover:border-text-secondary/30 hover:bg-background/25'
                }`}
              >
                {/* Branch Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-text-secondary'}`} />
                    <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      {branch.branchName}
                    </h4>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-primary text-white' : 'bg-background text-text-secondary border border-border'
                  }`}>
                    {branch.branchCode}
                  </span>
                </div>

                {/* Info block */}
                <div className="mt-2.5 space-y-1 text-[10px] text-text-secondary font-medium pl-6">
                  <div className="flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3 h-3 shrink-0 text-text-secondary/60 mt-0.5" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Phone className="w-3 h-3 shrink-0 text-text-secondary/60" />
                    <span>{branch.phoneNumber}</span>
                  </div>
                </div>

                {/* Selection Overlay Indicator */}
                {isSelected && (
                  <div className="absolute right-3.5 bottom-3.5 text-primary animate-scaleIn">
                    <CheckCircle2 className="w-5 h-5 fill-primary-light" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* 3. CONTINUE TRIGGER */}
      {!isLoading && !errorText && (
        <Button
          type="button"
          onClick={handleContinue}
          variant="primary"
          className="w-full font-bold py-3 text-sm rounded-xl mt-6"
          rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
        >
          Enter Active Clinic Scope
        </Button>
      )}
    </AuthLayout>
  )
}
export default BranchSelectPage
