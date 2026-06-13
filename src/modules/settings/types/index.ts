export type AdminRole =
  | 'Super Admin'
  | 'Clinic Admin'
  | 'Doctor'
  | 'Receptionist'
  | 'Accountant'

export type UserStatus = 'Active' | 'Inactive'

export interface UserRecord {
  id: string
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  role: AdminRole
  branchName: string
  status: UserStatus
  lastLogin: string
}

export interface RoleSummary {
  roleName: AdminRole
  usersCount: number
  description: string
}

export interface PermissionRow {
  moduleName: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  export: boolean
}

export interface BranchRecord {
  id: string
  branchName: string
  branchCode: string
  address: string
  contactNumber: string
  status: 'Active' | 'Inactive'
}

export interface ClinicSettings {
  clinicName: string
  logoUrl?: string
  address: string
  phoneNumber: string
  email: string
  website: string
  taxNumber: string
  registrationNumber: string
}

export interface NotificationChannelSetting {
  channel: 'SMS' | 'WhatsApp' | 'Email'
  apptReminders: boolean
  followUpReminders: boolean
  billingReminders: boolean
}

export interface AuditLogRecord {
  id: string
  module: string
  user: string
  action: string
  timestamp: string
}

export interface SettingsDashboardSummary {
  totalUsers: number
  activeUsers: number
  totalBranches: number
  rolesConfigured: number
  pendingNotifications: number
  auditEventsToday: number
}

export interface SystemConfig {
  appVersion: string
  environment: 'Production' | 'Staging' | 'Development'
  backupStatus: 'Healthy' | 'Pending' | 'Failed'
  storageUsedPct: number
}
