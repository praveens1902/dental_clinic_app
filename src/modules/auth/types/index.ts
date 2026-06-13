import { UserRole } from '@/store/authStore'

export interface LoginRequest {
  mobileNumber: string
}

export interface VerifyOtpRequest {
  mobileNumber: string
  otp: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  permissions: string[]
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: AuthUser
}

export interface SelectableBranch {
  id: string
  branchCode: string
  branchName: string
  address: string
  phoneNumber: string
  email: string
  isActive: boolean
}
