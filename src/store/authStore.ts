import { create } from 'zustand'

export type UserRole = 'Super Admin' | 'Clinic Admin' | 'Doctor' | 'Receptionist' | 'Accountant'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  permissions: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loginAs: (role: UserRole) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Super Admin': ['all'],
  'Clinic Admin': [
    'view_dashboard',
    'manage_users',
    'manage_branches',
    'view_patients',
    'edit_patients',
    'view_appointments',
    'edit_appointments',
    'view_billing',
    'manage_billing',
    'view_reports',
    'view_logs',
  ],
  'Doctor': [
    'view_dashboard',
    'view_patients',
    'edit_patients',
    'view_clinical_notes',
    'manage_clinical_notes',
    'view_odontogram',
    'manage_odontogram',
    'view_prescriptions',
    'manage_prescriptions',
    'view_appointments',
    'edit_appointments',
  ],
  'Receptionist': [
    'view_dashboard',
    'view_patients',
    'edit_patients',
    'view_appointments',
    'edit_appointments',
    'view_billing',
    'manage_billing',
  ],
  'Accountant': [
    'view_dashboard',
    'view_billing',
    'manage_billing',
    'view_reports',
  ],
}

const MOCK_USERS: Record<UserRole, User> = {
  'Super Admin': {
    id: 'u1',
    name: 'Dr. Vivek Sirona',
    email: 'superadmin@sironadental.com',
    role: 'Super Admin',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vivek',
    permissions: ROLE_PERMISSIONS['Super Admin'],
  },
  'Clinic Admin': {
    id: 'u2',
    name: 'Sarah Connor',
    email: 'admin.cp@sironadental.com',
    role: 'Clinic Admin',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah',
    permissions: ROLE_PERMISSIONS['Clinic Admin'],
  },
  'Doctor': {
    id: 'u3',
    name: 'Dr. Ananya Iyer',
    email: 'dr.ananya@sironadental.com',
    role: 'Doctor',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ananya',
    permissions: ROLE_PERMISSIONS['Doctor'],
  },
  'Receptionist': {
    id: 'u4',
    name: 'Rahul Sharma',
    email: 'rahul.reception@sironadental.com',
    role: 'Receptionist',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rahul',
    permissions: ROLE_PERMISSIONS['Receptionist'],
  },
  'Accountant': {
    id: 'u5',
    name: 'Meera Patel',
    email: 'meera.finance@sironadental.com',
    role: 'Accountant',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=meera',
    permissions: ROLE_PERMISSIONS['Accountant'],
  },
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: MOCK_USERS['Super Admin'], // Default to Super Admin for robust prototyping
  isAuthenticated: true,

  loginAs: (role) => {
    set({
      user: MOCK_USERS[role],
      isAuthenticated: true,
    })
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    })
  },

  hasPermission: (permission) => {
    const { user } = get()
    if (!user) return false
    if (user.permissions.includes('all')) return true
    return user.permissions.includes(permission)
  },
}))