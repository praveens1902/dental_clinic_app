import React, { useState, useEffect } from 'react'

interface OtpTimerProps {
  initialSeconds?: number
  onResend: () => void
}

export const OtpTimer: React.FC<OtpTimerProps> = ({
  initialSeconds = 30,
  onResend,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds])

  const handleResendClick = () => {
    setSeconds(initialSeconds)
    onResend()
  }

  const formatTime = (sec: number) => {
    const s = sec % 60
    return `00:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="flex items-center justify-between text-xs font-semibold">
      {seconds > 0 ? (
        <span className="text-text-secondary">
          Resend code in <span className="text-primary font-bold">{formatTime(seconds)}</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResendClick}
          className="text-primary hover:text-primary-hover font-bold hover:underline transition-all cursor-pointer"
        >
          Resend OTP Code
        </button>
      )}
    </div>
  )
}
export default OtpTimer
