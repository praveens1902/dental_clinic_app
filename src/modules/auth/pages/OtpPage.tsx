import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import { authService } from '../services/authService'
import { AuthLayout } from '../components/AuthLayout'
import { OtpInput } from '../components/OtpInput'
import { OtpTimer } from '../components/OtpTimer'
import { Button } from '@/components/ui/Button'
import { useAlertStore } from '@/store/alertStore'
import { useAuthStore } from '@/store/authStore'

export const OtpPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useAlertStore()
  const { loginAs } = useAuthStore() // Using our global authStore to finalize session
  
  const [mobileNumber, setMobileNumber] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  // Retrieve mobile number passed from LoginPage
  useEffect(() => {
    if (location.state && location.state.mobileNumber) {
      setMobileNumber(location.state.mobileNumber)
    } else {
      // Fallback if accessed directly without login state
      addToast({
        type: 'warning',
        title: 'Direct Access Restricted',
        message: 'Please initiate login from the phone number verification screen.',
      })
      navigate('/login')
    }
  }, [location, navigate, addToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length !== 6) {
      setErrorText('Please enter the full 6-digit code.')
      return
    }

    setIsLoading(true)
    setErrorText('')

    try {
      const response = await authService.verifyOtp({
        mobileNumber,
        otp: otpValue,
      })

      if (response && response.user) {
        addToast({
          type: 'success',
          title: 'Verification Successful',
          message: `Welcome back, ${response.user.name}!`,
        })
        
        // Simulating writing JWT tokens to storage
        localStorage.setItem('sirona_token', response.token)
        localStorage.setItem('sirona_refresh_token', response.refreshToken)

        // Propagate authenticated user context to global store
        loginAs(response.user.role) 

        // Navigate to Branch Selection page
        navigate('/select-branch')
      }
    } catch (err: any) {
      setErrorText(err.message || 'Verification failed. Please try again.')
      addToast({
        type: 'error',
        title: 'Verification Failed',
        message: err.message || 'The OTP entered is invalid.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setErrorText('')
    setOtpValue('')
    try {
      await authService.sendOtp({ mobileNumber })
      addToast({
        type: 'success',
        title: 'New Code Dispatched',
        message: 'A fresh 6-digit mock code has been sent to your device.',
      })
    } catch (err: any) {
      setErrorText(err.message || 'Failed to resend. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Secure Verification"
      subtitle={`We have dispatched a 6-digit verification OTP code to +91 ${mobileNumber}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core OTP Fields */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-text-primary flex items-center gap-1">
            <span>Enter OTP Code</span>
            <span className="text-danger">*</span>
          </label>
          <OtpInput
            value={otpValue}
            onChange={(val) => {
              setOtpValue(val)
              setErrorText('')
            }}
            error={!!errorText}
          />
          {errorText && (
            <span className="text-xs font-semibold text-danger block animate-fadeIn">
              {errorText}
            </span>
          )}
        </div>

        {/* Cooldown Timer */}
        <OtpTimer onResend={handleResendOtp} />

        {/* Quick Demo Assist */}
        <div className="bg-background rounded-xl p-3.5 border border-border/60 flex items-start gap-3">
          <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-text-primary">Demo OTP Assist</p>
            <p className="text-[10px] font-medium text-text-secondary leading-normal">
              Type the standard passcode: <span className="font-bold text-primary">123456</span> to bypass authentication checks.
            </p>
          </div>
        </div>

        {/* Triggers */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full font-bold py-3 text-sm rounded-xl"
            isLoading={isLoading}
          >
            Verify Credentials & Login
          </Button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center justify-center gap-1.5 py-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change mobile number</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
export default OtpPage
