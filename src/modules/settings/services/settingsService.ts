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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// --- INITIAL MOCK DATA ---
const INITIAL_MOCK_USERS: UserRecord[] = [
  { id: 'usr-1', firstName: 'Ananya', lastName: 'Iyer', mobileNumber: '9810234567', email: 'ananya.iyer@sirona.com', role: 'Doctor', branchName: 'Saket - New Delhi', status: 'Active', lastLogin: '2026-06-12 09:30' },
  { id: 'usr-2', firstName: 'Vikram', lastName: 'Seth', mobileNumber: '9910543210', email: 'vikram.seth@sirona.com', role: 'Doctor', branchName: 'Vasant Vihar - New Delhi', status: 'Active', lastLogin: '2026-06-11 10:15' },
  { id: 'usr-3', firstName: 'Rahul', lastName: 'Sharma', mobileNumber: '9710345123', email: 'rahul.reception@sirona.com', role: 'Receptionist', branchName: 'Saket - New Delhi', status: 'Active', lastLogin: '2026-06-12 08:00' },
  { id: 'usr-4', firstName: 'Anita', lastName: 'Desai', mobileNumber: '9510123456', email: 'anita.accounts@sirona.com', role: 'Accountant', branchName: 'Saket - New Delhi', status: 'Active', lastLogin: '2026-06-12 08:30' },
  { id: 'usr-5', firstName: 'Aarav', lastName: 'Malhotra', mobileNumber: '9810098765', email: 'aarav.admin@sirona.com', role: 'Super Admin', branchName: 'Saket - New Delhi', status: 'Active', lastLogin: '2026-06-12 07:45' },
]

const INITIAL_MOCK_ROLES: RoleSummary[] = [
  { roleName: 'Super Admin', usersCount: 1, description: 'Complete system authorization. Controls clinic setups, security clears, and audit ledgers.' },
  { roleName: 'Clinic Admin', usersCount: 0, description: 'Manages user directories, clinics schedules, templates, and billing rates.' },
  { roleName: 'Doctor', usersCount: 2, description: 'Clinical practitioner. Manages patient examinations, clinical notes, charting, and Rx writing.' },
  { roleName: 'Receptionist', usersCount: 1, description: 'Front desk coordinator. Performs patient intakes, schedules appointment slots, and checks-in patients.' },
  { roleName: 'Accountant', usersCount: 1, description: 'Financial ledger operator. Records bills, issues tax invoices, and clears collections.' },
]

const INITIAL_MOCK_PERMISSIONS: Record<AdminRole, PermissionRow[]> = {
  'Super Admin': [
    { moduleName: 'Patients', view: true, create: true, edit: true, delete: true, export: true },
    { moduleName: 'Examination', view: true, create: true, edit: true, delete: true, export: true },
    { moduleName: 'Billing', view: true, create: true, edit: true, delete: true, export: true },
    { moduleName: 'Settings', view: true, create: true, edit: true, delete: true, export: true },
  ],
  'Clinic Admin': [
    { moduleName: 'Patients', view: true, create: true, edit: true, delete: false, export: true },
    { moduleName: 'Examination', view: true, create: true, edit: true, delete: false, export: true },
    { moduleName: 'Billing', view: true, create: true, edit: true, delete: false, export: true },
    { moduleName: 'Settings', view: true, create: true, edit: true, delete: false, export: false },
  ],
  'Doctor': [
    { moduleName: 'Patients', view: true, create: true, edit: true, delete: false, export: true },
    { moduleName: 'Examination', view: true, create: true, edit: true, delete: true, export: true },
    { moduleName: 'Billing', view: true, create: false, edit: false, delete: false, export: false },
    { moduleName: 'Settings', view: false, create: false, edit: false, delete: false, export: false },
  ],
  'Receptionist': [
    { moduleName: 'Patients', view: true, create: true, edit: true, delete: false, export: false },
    { moduleName: 'Examination', view: false, create: false, edit: false, delete: false, export: false },
    { moduleName: 'Billing', view: true, create: false, edit: false, delete: false, export: false },
    { moduleName: 'Settings', view: false, create: false, edit: false, delete: false, export: false },
  ],
  'Accountant': [
    { moduleName: 'Patients', view: true, create: false, edit: false, delete: false, export: false },
    { moduleName: 'Examination', view: false, create: false, edit: false, delete: false, export: false },
    { moduleName: 'Billing', view: true, create: true, edit: true, delete: false, export: true },
    { moduleName: 'Settings', view: false, create: false, edit: false, delete: false, export: false },
  ],
}

const INITIAL_MOCK_BRANCHES: BranchRecord[] = [
  { id: 'b-1', branchName: 'Saket - New Delhi', branchCode: 'SDC-SAKET', address: 'Metro Corporate Plaza, Saket, New Delhi', contactNumber: '+91 11 4056 9901', status: 'Active' },
  { id: 'b-2', branchName: 'Vasant Vihar - New Delhi', branchCode: 'SDC-VASANT', address: 'Market complex, Vasant Vihar, Delhi', contactNumber: '+91 11 4110 5020', status: 'Active' },
  { id: 'b-3', branchName: 'Indiranagar - Bengaluru', branchCode: 'SDC-INDRA', address: '100ft Road, Indiranagar, Bengaluru', contactNumber: '+91 80 4912 3040', status: 'Active' },
  { id: 'b-4', branchName: 'Koregaon Park - Pune', branchCode: 'SDC-KOREG', address: 'Lane 5, Koregaon Park, Pune', contactNumber: '+91 20 4050 6070', status: 'Active' },
]

const INITIAL_MOCK_CLINIC_SETTINGS: ClinicSettings = {
  clinicName: 'Sirona Dental Clinics & Research Center',
  logoUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?auto=format&fit=crop&q=80&w=200',
  address: 'Metro Corporate Plaza, Saket, New Delhi, 110017',
  phoneNumber: '+91 11 4056 9901',
  email: 'central.desk@sironadental.com',
  website: 'https://sironadental.com',
  taxNumber: 'DEL-TAX-910284A',
  registrationNumber: 'MCD-HEALTH-11082-A',
}

const INITIAL_MOCK_NOTIFICATIONS: NotificationChannelSetting[] = [
  { channel: 'WhatsApp', apptReminders: true, followUpReminders: true, billingReminders: false },
  { channel: 'SMS', apptReminders: true, followUpReminders: false, billingReminders: false },
  { channel: 'Email', apptReminders: true, followUpReminders: true, billingReminders: true },
]

const INITIAL_MOCK_AUDIT_LOGS: AuditLogRecord[] = [
  { id: 'aud-1', module: 'Patients', user: 'Front Desk Rahul', action: 'Registered patient Aarav Mehta (PAT-CP-101)', timestamp: '2026-06-12 10:15' },
  { id: 'aud-2', module: 'Billing', user: 'Anita Accounts', action: 'Recorded UPI payment collection of ₹1,000 for INV-2026-002', timestamp: '2026-06-12 10:30' },
  { id: 'aud-3', module: 'Examination', user: 'Dr. Ananya Iyer', action: 'Finalized interactive odontogram chart for Aarav Mehta', timestamp: '2026-06-12 11:15' },
  { id: 'aud-4', module: 'Settings', user: 'Aarav Malhotra', action: 'Updated SMS dispatch template configurations', timestamp: '2026-06-12 09:00' },
]

// --- LOCAL STORAGE DATA SYNC ---
const getUsers = (): UserRecord[] => {
  const data = localStorage.getItem('sirona_users')
  return data ? JSON.parse(data) : INITIAL_MOCK_USERS
}

const saveUsers = (list: UserRecord[]) => {
  localStorage.setItem('sirona_users', JSON.stringify(list))
}

const getBranches = (): BranchRecord[] => {
  const data = localStorage.getItem('sirona_branches')
  return data ? JSON.parse(data) : INITIAL_MOCK_BRANCHES
}

const saveBranches = (list: BranchRecord[]) => {
  localStorage.setItem('sirona_branches', JSON.stringify(list))
}

const getAuditLogs = (): AuditLogRecord[] => {
  const data = localStorage.getItem('sirona_audit_logs')
  return data ? JSON.parse(data) : INITIAL_MOCK_AUDIT_LOGS
}

const saveAuditLogs = (list: AuditLogRecord[]) => {
  localStorage.setItem('sirona_audit_logs', JSON.stringify(list))
}

// --- SYSTEM SERVICES ---
export const settingsService = {
  // Fetch lists
  getUsers: async (): Promise<UserRecord[]> => {
    await delay(400)
    return getUsers()
  },

  saveUser: async (user: Omit<UserRecord, 'id' | 'lastLogin'> & { id?: string }): Promise<UserRecord> => {
    await delay(600)
    const list = getUsers()
    
    if (user.id) {
      const idx = list.findIndex((u) => u.id === user.id)
      if (idx >= 0) {
        const updated = { ...list[idx], ...user }
        list[idx] = updated
        saveUsers(list)
        return updated
      }
    }

    const newUser: UserRecord = {
      id: Math.random().toString(36).substring(2, 9),
      ...user,
      lastLogin: 'Never logged',
    }
    saveUsers([newUser, ...list])

    // Log audit
    const audits = getAuditLogs()
    audits.unshift({
      id: Math.random().toString(36).substring(2, 9),
      module: 'Settings',
      user: 'Super Admin',
      action: `Created user record: ${user.firstName} ${user.lastName} (${user.role})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    })
    saveAuditLogs(audits)

    return newUser
  },

  toggleUserStatus: async (id: string): Promise<UserRecord | null> => {
    const list = getUsers()
    const idx = list.findIndex((u) => u.id === id)
    if (idx === -1) return null

    const current = list[idx]
    const updatedStatus = current.status === 'Active' ? 'Inactive' : 'Active'
    const updated = { ...current, status: updatedStatus as any }
    list[idx] = updated
    saveUsers(list)

    // Log audit
    const audits = getAuditLogs()
    audits.unshift({
      id: Math.random().toString(36).substring(2, 9),
      module: 'Settings',
      user: 'Super Admin',
      action: `Toggled user status for ${current.firstName} ${current.lastName} to ${updatedStatus}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    })
    saveAuditLogs(audits)

    return updated
  },

  // Roles Summaries
  getRoles: async (): Promise<RoleSummary[]> => {
    await delay(300)
    const users = getUsers()
    return INITIAL_MOCK_ROLES.map((r) => ({
      ...r,
      usersCount: users.filter((u) => u.role === r.roleName).length,
    }))
  },

  // Permission Matrix
  getPermissionsByRole: async (role: AdminRole): Promise<PermissionRow[]> => {
    await delay(300)
    const data = localStorage.getItem('sirona_permission_matrix')
    const matrix = data ? JSON.parse(data) : INITIAL_MOCK_PERMISSIONS
    return matrix[role] || []
  },

  savePermissionMatrix: async (role: AdminRole, rows: PermissionRow[]): Promise<boolean> => {
    await delay(500)
    const data = localStorage.getItem('sirona_permission_matrix')
    const matrix = data ? JSON.parse(data) : { ...INITIAL_MOCK_PERMISSIONS }
    matrix[role] = rows
    localStorage.setItem('sirona_permission_matrix', JSON.stringify(matrix))

    // Log audit
    const audits = getAuditLogs()
    audits.unshift({
      id: Math.random().toString(36).substring(2, 9),
      module: 'Settings',
      user: 'Super Admin',
      action: `Updated permission grid modifications for Role: ${role}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    })
    saveAuditLogs(audits)

    return true
  },

  // Branches
  getBranches: async (): Promise<BranchRecord[]> => {
    await delay(400)
    return getBranches()
  },

  saveBranch: async (branch: Omit<BranchRecord, 'id'> & { id?: string }): Promise<BranchRecord> => {
    await delay(600)
    const list = getBranches()

    if (branch.id) {
      const idx = list.findIndex((b) => b.id === branch.id)
      if (idx >= 0) {
        const updated = { ...list[idx], ...branch }
        list[idx] = updated
        saveBranches(list)
        return updated
      }
    }

    const newBranch: BranchRecord = {
      id: Math.random().toString(36).substring(2, 9),
      ...branch,
    }
    saveBranches([...list, newBranch])
    return newBranch
  },

  // Clinic configurations
  getClinicSettings: async (): Promise<ClinicSettings> => {
    await delay(400)
    const data = localStorage.getItem('sirona_clinic_settings')
    return data ? JSON.parse(data) : INITIAL_MOCK_CLINIC_SETTINGS
  },

  saveClinicSettings: async (settings: ClinicSettings): Promise<boolean> => {
    await delay(500)
    localStorage.setItem('sirona_clinic_settings', JSON.stringify(settings))
    return true
  },

  // Notification channels
  getNotificationSettings: async (): Promise<NotificationChannelSetting[]> => {
    await delay(300)
    const data = localStorage.getItem('sirona_notification_settings')
    return data ? JSON.parse(data) : INITIAL_MOCK_NOTIFICATIONS
  },

  saveNotificationSettings: async (settings: NotificationChannelSetting[]): Promise<boolean> => {
    await delay(400)
    localStorage.setItem('sirona_notification_settings', JSON.stringify(settings))
    return true
  },

  // Profile Management
  getProfileSettings: async (): Promise<{ name: string; mobileNumber: string; email: string; profileImageUrl?: string }> => {
    await delay(300)
    return {
      name: 'Aarav Malhotra',
      mobileNumber: '9810098765',
      email: 'aarav.admin@sironadental.com',
      profileImageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e9053?auto=format&fit=crop&q=80&w=200',
    }
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLogRecord[]> => {
    await delay(400)
    return getAuditLogs()
  },

  // Dashboard summary kpi
  getDashboardSummary: async (): Promise<SettingsDashboardSummary> => {
    await delay(400)
    const users = getUsers()
    const branches = getBranches()
    const audits = getAuditLogs()

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'Active').length,
      totalBranches: branches.length,
      rolesConfigured: INITIAL_MOCK_ROLES.length,
      pendingNotifications: 4,
      auditEventsToday: audits.length,
    }
  },

  // System Configuration details
  getSystemConfig: (): SystemConfig => ({
    appVersion: 'v1.4.2-Sirona-LTS',
    environment: 'Production',
    backupStatus: 'Healthy',
    storageUsedPct: 14.5, // 14.5% storage utilized
  }),
}

export default settingsService
