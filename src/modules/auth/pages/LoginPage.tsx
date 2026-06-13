import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import { loginSchema, LoginSchemaType } from '../schemas'
import { authService } from '../services/authService'
import { AuthLayout } from '../components/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlertStore } from '@/store/alertStore'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useAlertStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobileNumber: '',
    },
  })

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true)
    try {
      const success = await authService.sendOtp(data)
      if (success) {
        addToast({
          type: 'success',
          title: 'OTP Code Dispatched',
          message: `A mock verification code was sent to +91 ${data.mobileNumber}`,
        })
        navigate('/verify-otp', { state: { mobileNumber: data.mobileNumber } })
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message || 'OTP service failed. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Clinic Staff Portal"
      subtitle="Enter your 10-digit registered mobile number to log in."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Mobile Number"
          placeholder="98765 43210"
          required
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.mobileNumber?.message}
          disabled={isLoading}
          {...register('mobileNumber')}
        />

        <div className="bg-background rounded-xl p-3.5 border border-border/60 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-text-primary">Demo Mobile Coordinates</p>
            <p className="text-[10px] font-medium text-text-secondary leading-normal">
              Enter any valid 10-digit mobile number (e.g. <span className="font-bold text-primary">9876543210</span>). Valid OTP: <span className="font-bold text-primary">123456</span>
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full font-bold py-3 text-sm rounded-xl"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
        >
          Send Verification OTP
        </Button>
      </form>
    </AuthLayout>
  )
}
export default LoginPage
