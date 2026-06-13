import { z } from 'zod'

export const loginSchema = z.object({
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'Verification code is required')
    .regex(/^[0-9]{6}$/, 'OTP must be exactly 6 digits'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
export type OtpSchemaType = z.infer<typeof otpSchema>
