import React, { useState } from 'react'
import { Plus, Building, Phone, MapPin, Power, Save } from 'lucide-react'
import { BranchRecord } from '../types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface BranchManagementProps {
  branches: BranchRecord[]
  onSaveBranch: (branch: Omit<BranchRecord, 'id'>) => Promise<void>
  onToggleBranchStatus: (id: string, currentStatus: 'Active' | 'Inactive') => void
}

export const BranchManagement: React.FC<BranchManagementProps> = ({
  branches,
  onSaveBranch,
  onToggleBranchStatus,
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [code, setBranchCode] = useState('')
  const [address, setAddress] = useState('')
  const [contact, setContact] = useState('')
  const [localError, setLocalError] = useState('')

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !code.trim() || !address.trim() || !contact.trim()) {
      setLocalError('All fields are required to register a branch office.')
      return
    }

    setLocalError('')
    await onSaveBranch({
      branchName: name.trim() + ' - New Delhi',
      branchCode: code.trim().toUpperCase(),
      address: address.trim(),
      contactNumber: contact.trim(),
      status: 'Active',
    })

    // Reset
    setName('')
    setBranchCode('')
    setAddress('')
    setContact('')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6 text-left select-none animate-fadeIn">
      
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <div>
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
            Clinic Branches Office Manager
          </p>
          <p className="text-xs text-text-secondary/70 mt-1">
            Activate, disable, or register clinical operating branch locations.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="xs"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddForm(!showAddForm)}
          className="font-bold py-1.5 px-3 h-auto bg-white border border-border/80 text-text-primary"
        >
          {showAddForm ? 'View Branches' : 'Add Branch'}
        </Button>
      </div>

      {showAddForm ? (
        /* CREATION SUBFORM CARD */
        <form onSubmit={handleCreateSubmit} className="space-y-4 max-w-xl mx-auto animate-fadeIn">
          <div className="bg-background/25 border border-border/60 rounded-xl p-4.5 space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
              <Building className="w-4.5 h-4.5 text-primary" />
              <span>Register New Branch Office</span>
            </h4>

            {localError && (
              <span className="text-xs font-semibold text-danger block">
                {localError}
              </span>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Branch Name"
                placeholder="e.g. Rohini"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Branch Code"
                placeholder="e.g. SDC-ROHINI"
                value={code}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Clinic Address"
                placeholder="e.g. Sector 8, Rohini, Delhi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                label="Branch Contact Number"
                placeholder="e.g. +91 11 4050 3020"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 select-none">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="font-bold text-xs bg-white border border-border/80 text-text-secondary hover:bg-background"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              className="font-bold text-xs shadow-premium"
            >
              Issue Branch Record
            </Button>
          </div>
        </form>
      ) : (
        /* REGISTERED BRANCHES CARDS LIST */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((b) => {
            const isActive = b.status === 'Active'
            return (
              <div
                key={b.id}
                className={`border rounded-xl p-4.5 flex flex-col justify-between hover:shadow-premium hover:border-primary/20 transition-all gap-4 ${
                  isActive ? 'bg-white border-border/80' : 'bg-gray-100/50 border-border/40 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border/30 pb-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4.5 h-4.5 text-primary shrink-0" />
                      <h5 className="text-xs font-black text-text-primary leading-none">{b.branchName.split(' - ')[0]}</h5>
                    </div>
                    <span className={`inline-flex text-[8px] font-black uppercase px-2 py-0.5 border rounded-full ${
                      isActive ? 'bg-success/10 text-success border-success/15' : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-text-secondary leading-normal font-semibold">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-text-secondary/50 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{b.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-bold">
                      <Phone className="w-3.5 h-3.5 text-text-secondary/50 shrink-0" />
                      <span>{b.contactNumber}</span>
                    </p>
                  </div>
                </div>

                {/* operational toggles */}
                <div className="flex justify-end pt-2 border-t border-border/30 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    leftIcon={<Power className="w-3.5 h-3.5" />}
                    onClick={() => onToggleBranchStatus(b.id, b.status)}
                    className={`text-[9px] font-black uppercase border py-1.5 px-3 h-auto ${
                      isActive
                        ? 'text-danger border-danger/15 bg-danger/5 hover:bg-danger/10'
                        : 'text-success border-success/15 bg-success/5 hover:bg-success/10'
                    }`}
                  >
                    {isActive ? 'Disable Branch' : 'Enable Branch'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
export default BranchManagement
