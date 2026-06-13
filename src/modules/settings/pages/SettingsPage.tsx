import React, { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Building,
  Key,
  Bell,
  History,
  Users,
} from 'lucide-react'

import { settingsService } from '../services/settingsService'
import {
  UserRecord,
  RoleSummary,
  PermissionRow,
  BranchRecord,
  ClinicSettings,
  NotificationChannelSetting,
  AuditLogRecord,
  SettingsDashboardSummary,
  SystemConfig,
  AdminRole,
} from '../types'
import { UserRecordFormSchemaType } from '../schemas'
import { useAlertStore } from '@/store/alertStore'

import { SettingsSkeleton } from '../components/SettingsSkeleton'
import { SettingsDashboardKPIs } from '../components/SettingsDashboardKPIs'
import { SystemConfiguration } from '../components/SystemConfiguration'
import { UserManagement } from '../components/UserManagement'
import { RolePermissionMatrix } from '../components/RolePermissionMatrix'
import { BranchManagement } from '../components/BranchManagement'
import { ClinicSettingsPanel, ProfileSettingsPanel, NotificationSettingsPanel } from '../components/OtherSettingsPanels'
import { AuditLogsTable } from '../components/AuditLogsTable'

import { PageHeader, ContentContainer, CardContainer } from '@/components/layout/LayoutComponents'
import { Button } from '@/components/ui/Button'

export const SettingsPage: React.FC = () => {
  const { addToast, showModalAlert } = useAlertStore()

  // 1. Data States
  const [summary, setSummary] = useState<SettingsDashboardSummary | null>(null)
  const [users, setUsers] = useState<UserRecord[]>([])
  const [roles, setRoles] = useState<RoleSummary[]>([])
  const [branches, setBranches] = useState<BranchRecord[]>([])
  const [clinic, setClinic] = useState<ClinicSettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationChannelSetting[]>([])
  const [audits, setAudits] = useState<AuditLogRecord[]>([])
  const [system, setSystem] = useState<SystemConfig | null>(null)

  // 2. Active Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'clinic' | 'users' | 'permissions' | 'branches' | 'notifications' | 'audits'>('dashboard')
  
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setHasError(false)
    try {
      const [sum, usrs, rls, brs, cl, nots, auds] = await Promise.all([
        settingsService.getDashboardSummary(),
        settingsService.getUsers(),
        settingsService.getRoles(),
        settingsService.getBranches(),
        settingsService.getClinicSettings(),
        settingsService.getNotificationSettings(),
        settingsService.getAuditLogs(),
      ])

      setSummary(sum)
      setUsers(usrs)
      setRoles(rls)
      setBranches(brs)
      setClinic(cl)
      setNotifications(nots)
      setAudits(auds)
      setSystem(settingsService.getSystemConfig())
    } catch (err) {
      setHasError(true)
      addToast({
        type: 'error',
        title: 'Clearance Rejected',
        message: 'Administrative data files are locked or offline.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 3. User Actions
  const handleSaveUser = async (data: UserRecordFormSchemaType) => {
    try {
      await settingsService.saveUser({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        role: data.role,
        branchName: data.branchName,
        status: data.status,
      })
      addToast({
        type: 'success',
        title: 'User Onboarded',
        message: `Successfully onboarded credentials for ${data.firstName} ${data.lastName}.`,
      })
      await loadData()
    } catch (err) {
      addToast({ type: 'error', title: 'Onboarding Rejected', message: 'Could not write user record.' })
    }
  }

  const handleToggleUserStatus = async (id: string) => {
    try {
      await settingsService.toggleUserStatus(id)
      addToast({
        type: 'success',
        title: 'Account status updated',
        message: 'Practitioner status toggled successfully.',
      })
      await loadData()
    } catch (err) {
      addToast({ type: 'error', title: 'Action Rejected', message: 'Could not modify account clearance.' })
    }
  }

  const handleResetAccess = (_id: string, name: string) => {
    showModalAlert({
      type: 'warning',
      title: 'Reset Password & Access?',
      message: `Are you sure you want to trigger an access reset link for "${name}"? Sirona will lock temporary credentials and email instructions.`,
      confirmLabel: 'Issue Reset Protocol',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        addToast({
          type: 'success',
          title: 'Access Protocol Issued',
          message: `Instructions successfully dispatched to ${name}'s verified mailbox.`,
        })
      },
    })
  }

  // 4. Role Permissions matrix actions
  const handleSavePermissionMatrix = async (role: AdminRole, rows: PermissionRow[]) => {
    try {
      await settingsService.savePermissionMatrix(role, rows)
      addToast({
        type: 'success',
        title: 'Matrix Updated',
        message: `Successfully updated authorization levels for ${role}.`,
      })
      await loadData()
    } catch (err) {
      addToast({ type: 'error', title: 'Write Rejected', message: 'Could not lock permission grid.' })
    }
  }

  // 5. Branch Actions
  const handleSaveBranch = async (branchData: Omit<BranchRecord, 'id'>) => {
    try {
      await settingsService.saveBranch(branchData)
      addToast({
        type: 'success',
        title: 'Branch Registered',
        message: `Successfully registered clinical branch office: ${branchData.branchCode}.`,
      })
      await loadData()
    } catch (err) {
      addToast({ type: 'error', title: 'Registration Failed', message: 'Could not register branch office.' })
    }
  }

  const handleToggleBranchStatus = (_id: string, currentStatus: 'Active' | 'Inactive') => {
    const statusLabel = currentStatus === 'Active' ? 'Disabled' : 'Enabled'
    showModalAlert({
      type: 'error',
      title: `${statusLabel} Branch Office?`,
      message: `Toggling status of this branch will restrict practitioners and patient calendars linked to this assignment node.`,
      confirmLabel: `Proceed with ${statusLabel}`,
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        addToast({
          type: 'success',
          title: 'Branch Node Updated',
          message: `Clinics operational status modified to ${currentStatus === 'Active' ? 'Disabled' : 'Active'}.`,
        })
      },
    })
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <SettingsSkeleton />
      </ContentContainer>
    )
  }

  if (hasError) {
    return (
      <ContentContainer className="py-8 animate-fadeIn">
        <CardContainer className="text-center max-w-lg mx-auto py-8">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger mx-auto mb-4 animate-bounce">
            <Settings className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary mb-2">Workspace Config Offline</h3>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            Sirona Administration settings, permissions grids, and clinical branch nodes are currently un-clearable.
          </p>
          <Button variant="primary" onClick={loadData}>Reconnect Workspace</Button>
        </CardContainer>
      </ContentContainer>
    )
  }

  const NAV_TABS = [
    { id: 'dashboard' as const, label: 'Settings Home', icon: <Settings className="w-4 h-4" /> },
    { id: 'profile' as const, label: 'Profile Management', icon: <User className="w-4 h-4" /> },
    { id: 'clinic' as const, label: 'Clinic Information', icon: <Building className="w-4 h-4" /> },
    { id: 'users' as const, label: 'Users Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'permissions' as const, label: 'Permissions Grid', icon: <Key className="w-4 h-4" /> },
    { id: 'branches' as const, label: 'Branches Office', icon: <Building className="w-4 h-4" /> },
    { id: 'notifications' as const, label: 'Notification Settings', icon: <Bell className="w-4 h-4" /> },
    { id: 'audits' as const, label: 'System Audit Logs', icon: <History className="w-4 h-4" /> },
  ]

  return (
    <ContentContainer className="space-y-6 animate-fadeIn pb-12">
      
      {/* Page Header */}
      <PageHeader
        title="Administration &amp; Workspaces Settings"
        subtitle="Manage clinic systems configurations, practitioner onboarding folders, security clearance grids, and audit ledger logs."
      />

      {/* Settings KPI Stat board */}
      <SettingsDashboardKPIs summary={summary} />

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left column navigation bar list */}
        <div className="flex flex-col bg-white border border-border/80 rounded-xl p-2.5 shadow-premium gap-1.5 select-none shrink-0">
          {NAV_TABS.map((tab) => {
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow shadow-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right main workspace viewport */}
        <div className="lg:col-span-3">
          <CardContainer className="p-6 md:p-8">
            
            {/* TAB SECTION 1: Settings dashboard / System specs */}
            {activeTab === 'dashboard' && system && (
              <SystemConfiguration config={system} />
            )}

            {/* TAB SECTION 2: Practitioner profile updates */}
            {activeTab === 'profile' && (
              <ProfileSettingsPanel />
            )}

            {/* TAB SECTION 3: Clinic parameters settings */}
            {activeTab === 'clinic' && clinic && (
              <ClinicSettingsPanel settings={clinic} onSave={async (s) => { await settingsService.saveClinicSettings(s) }} />
            )}

            {/* TAB SECTION 4: User directories manager */}
            {activeTab === 'users' && (
              <UserManagement
                users={users}
                onSaveUser={handleSaveUser}
                onToggleUserStatus={handleToggleUserStatus}
                onResetAccess={handleResetAccess}
              />
            )}

            {/* TAB SECTION 5: Roles and Permissions Matrix */}
            {activeTab === 'permissions' && (
              <RolePermissionMatrix roles={roles} onSaveMatrix={handleSavePermissionMatrix} />
            )}

            {/* TAB SECTION 6: Branches management */}
            {activeTab === 'branches' && (
              <BranchManagement
                branches={branches}
                onSaveBranch={handleSaveBranch}
                onToggleBranchStatus={handleToggleBranchStatus}
              />
            )}

            {/* TAB SECTION 7: Notifications Channels */}
            {activeTab === 'notifications' && (
              <NotificationSettingsPanel settings={notifications} onSave={async (n) => { await settingsService.saveNotificationSettings(n) }} />
            )}

            {/* TAB SECTION 8: Audit Logs History Table */}
            {activeTab === 'audits' && (
              <AuditLogsTable data={audits} />
            )}

          </CardContainer>
        </div>

      </div>

    </ContentContainer>
  )
}
export default SettingsPage
