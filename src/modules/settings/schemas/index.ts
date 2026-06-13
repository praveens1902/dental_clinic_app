import { z } from 'zod'

// 1. User Creation Form Schema
export const userRecordFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
  email: z.string().email('Invalid email address format'),
  role: z.enum(['Super Admin', 'Clinic Admin', 'Doctor', 'Receptionist', 'Accountant'] as const, {
    errorMap: () => ({ message: 'Please select a system role' }),
  }),
  branchName: z.string().min(1, 'Branch assignment is required'),
  status: z.enum(['Active', 'Inactive'] as const),
})

export type UserRecordFormSchemaType = z.infer<typeof userRecordFormSchema>

// 2. Clinic Settings Form Schema
export const clinicSettingsFormSchema = z.object({
  clinicName: z.string().min(1, 'Clinic name is required'),
  logoUrl: z.string().optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid clinic email'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxNumber: z.string().min(1, 'Tax number is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
})

export type ClinicSettingsFormSchemaType = z.infer<typeof clinicSettingsFormSchema>

// 3. Profile Settings Form Schema
export const profileSettingsFormSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  mobileNumber: z.string().min(10, 'Mobile must be at least 10 digits'),
  email: z.string().email('Invalid profile email'),
  profileImageUrl: z.string().optional().or(z.literal('')),
})

export type ProfileSettingsFormSchemaType = z.infer<typeof profileSettingsFormSchema>

export const getEmptyUserRecordForm = (): UserRecordFormSchemaType => ({
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  role: 'Doctor',
  branchName: 'Saket - New Delhi',
  status: 'Active',
})
