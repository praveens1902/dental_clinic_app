import React, { useState, useEffect } from 'react'
import { Key, Save, RotateCcw } from 'lucide-react'
import { RoleSummary, PermissionRow, AdminRole } from '../types'
import { Button } from '@/components/ui/Button'
import { settingsService } from '../services/settingsService'

interface RolePermissionMatrixProps {
  roles: RoleSummary[]
  onSaveMatrix: (role: AdminRole, rows: PermissionRow[]) => Promise<void>
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  roles,
  onSaveMatrix,
}) => {

  // Selected role tab state
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Doctor')
  const [permissions, setPermissions] = useState<PermissionRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Load permission rows when selected role changes
  const loadMatrix = async () => {
    setIsLoading(true)
    try {
      const rows = await settingsService.getPermissionsByRole(selectedRole)
      setPermissions(JSON.parse(JSON.stringify(rows))) // deep clone
      setIsDirty(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMatrix()
  }, [selectedRole])

  const activeRoleDetails = roles.find((r) => r.roleName === selectedRole) || {
    roleName: selectedRole,
    usersCount: 0,
    description: 'System access role definition.',
  }

  // Toggle cell checkbox
  const handleCheckboxToggle = (moduleIdx: number, action: keyof Omit<PermissionRow, 'moduleName'>) => {
    setPermissions((prev) => {
      const updated = [...prev]
      updated[moduleIdx] = {
        ...updated[moduleIdx],
        [action]: !updated[moduleIdx][action],
      }
      return updated
    })
    setIsDirty(true)
  }

  const handleSave = async () => {
    await onSaveMatrix(selectedRole, permissions)
    setIsDirty(false)
  }

  const ACTIONS_COLS: { key: keyof Omit<PermissionRow, 'moduleName'>; label: string }[] = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'export', label: 'Export' },
  ]

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Role details header card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-border/40 pb-4">
        <div className="space-y-1 md:col-span-2">
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wide">
            Dynamic Permissions Matrix
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-text-primary uppercase tracking-wide">
              Selected Role:
            </span>
            <div className="w-48 shrink-0">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                className="px-2.5 py-1.5 bg-white border border-border/80 rounded-xl text-xs font-semibold text-primary focus:outline-none"
              >
                {roles.map((r) => (
                  <option key={r.roleName} value={r.roleName}>
                    {r.roleName} ({r.usersCount} users)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Role summary card */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4.5 space-y-1.5 leading-normal">
        <h5 className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Key className="w-4 h-4 text-primary" />
          <span>Role Summary Details</span>
        </h5>
        <p className="text-xs text-text-primary font-bold">{activeRoleDetails.description}</p>
        <p className="text-[10px] text-text-secondary/70 font-semibold">
          Active Users matching this role folder: {activeRoleDetails.usersCount} members
        </p>
      </div>

      {/* Permission Grid matrix table */}
      {isLoading ? (
        <p className="text-xs font-semibold text-text-secondary/50 animate-pulse text-center py-6">
          Synchronizing role permission grid...
        </p>
      ) : (
        <div className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-premium">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-background/40 text-[9px] font-bold text-text-secondary uppercase tracking-wider select-none">
                  <th className="p-3.5 pl-4">Workspace Module</th>
                  {ACTIONS_COLS.map((col) => (
                    <th key={col.key} className="p-3.5 text-center">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((row, moduleIdx) => (
                  <tr key={row.moduleName} className="border-b border-border/30 last:border-b-0 font-semibold text-text-primary hover:bg-background/10 transition-colors">
                    <td className="p-3.5 pl-4 font-black">{row.moduleName}</td>
                    
                    {/* Interactive checkboxes */}
                    {ACTIONS_COLS.map((col) => {
                      const isChecked = row[col.key]
                      return (
                        <td key={col.key} className="p-3.5 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxToggle(moduleIdx, col.key)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer transition-all border-border"
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions footer */}
      {isDirty && (
        <div className="flex items-center gap-2.5 justify-end pt-3 border-t border-border/30 animate-fadeIn">
          <Button
            type="button"
            variant="outline"
            size="xs"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadMatrix}
            className="bg-white border border-border/80 text-text-secondary font-bold"
          >
            Revert
          </Button>
          <Button
            type="button"
            variant="primary"
            size="xs"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
            className="font-bold shadow-sm"
          >
            Save Permission Matrix
          </Button>
        </div>
      )}

    </div>
  )
}
export default RolePermissionMatrix
