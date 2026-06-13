import { LoginRequest, VerifyOtpRequest, AuthResponse, SelectableBranch, AuthUser } from '../types'

// Delay simulator to mimic network calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const MOCK_USER_DENTIST: AuthUser = {
  id: 'u-d1',
  name: 'Dr. Vivek Sirona',
  email: 'dr.vivek@sironadental.com',
  role: 'Super Admin',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vivek',
  permissions: ['all'],
}

export const MOCK_BRANCHES: SelectableBranch[] = [
  {
    id: 'b1',
    branchCode: 'DEL-CP-01',
    branchName: 'Sirona Elite - New Delhi',
    address: 'E-Block, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
    phoneNumber: '+91 11 4567 8901',
    email: 'cp.elite@sironadental.com',
    isActive: true,
  },
  {
    id: 'b2',
    branchCode: 'GUR-DLF-02',
    branchName: 'Sirona Prime - Gurugram',
    address: 'Floor 3, Cyber Hub, DLF Phase 3, Gurugram, Haryana 122002',
    phoneNumber: '+91 124 567 8902',
    email: 'gurugram.prime@sironadental.com',
    isActive: true,
  },
  {
    id: 'b3',
    branchCode: 'NOI-SEC-03',
    branchName: 'Sirona Care - Noida',
    address: 'Block C, Stellar IT Park, Sector 62, Noida, Uttar Pradesh 201301',
    phoneNumber: '+91 120 456 8903',
    email: 'noida.care@sironadental.com',
    isActive: true,
  },
]

export const authService = {
  // 1. Send OTP Mock Endpoint
  sendOtp: async (data: LoginRequest): Promise<boolean> => {
    await delay(1000)
    
    // Simulate API fail for empty number or special triggers if needed (for prototyping)
    if (data.mobileNumber.startsWith('000')) {
      throw new Error('OTP Service Failed. Please verify your mobile provider.')
    }
    
    console.log(`[Mock API] OTP sent successfully to: +91 ${data.mobileNumber}. Valid OTP code: 123456`)
    return true
  },

  // 2. Verify OTP Mock Endpoint
  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    await delay(1000)
    
    // Simulate correct verification check
    if (data.otp !== '123456') {
      throw new Error('Invalid verification code. Please try again with code 123456.')
    }
    
    return {
      token: 'sirona_jwt_token_sample_abc123',
      refreshToken: 'sirona_refresh_token_sample_xyz789',
      user: MOCK_USER_DENTIST,
    }
  },

  // 3. Get Branches Mock Endpoint
  getBranches: async (): Promise<SelectableBranch[]> => {
    await delay(800)
    return MOCK_BRANCHES
  },
}
