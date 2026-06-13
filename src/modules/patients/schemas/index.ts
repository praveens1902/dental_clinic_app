import { z } from 'zod'

export const patientFormSchema = z.object({
  patientName: z
    .string()
    .min(1, 'Patient Name is required')
    .min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of Birth is required')
    .refine((date) => {
      const dob = new Date(date)
      return dob < new Date()
    }, 'Date of Birth must be in the past'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Please select a gender option' }),
  }),
  mobileNumber: z
    .string()
    .min(1, 'Mobile Number is required')
    .regex(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),
  email: z
    .string()
    .email('Invalid email address')
    .or(z.literal(''))
    .optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  referralSource: z.string().optional(),
  branchId: z.string().min(1, 'Please assign a clinic branch'),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Emergency Contact Number must be exactly 10 digits')
    .or(z.literal(''))
    .optional(),
  relationship: z.string().optional(),
})

export type PatientFormSchemaType = z.infer<typeof patientFormSchema>
