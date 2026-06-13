import React, { useRef, useState, useEffect } from 'react'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  error = false,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<HTMLInputElement[]>([])

  // Sync state with incoming value
  useEffect(() => {
    const arr = value.split('').slice(0, length)
    while (arr.length < length) arr.push('')
    setDigits(arr)
  }, [value, length])

  const handleDigitsChange = (newDigits: string[]) => {
    setDigits(newDigits)
    onChange(newDigits.join(''))
  }

  // Handle Input typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '') // only allow digits
    if (!val) return

    const newDigits = [...digits]
    // Get only the last character if typed
    newDigits[idx] = val[val.length - 1]
    handleDigitsChange(newDigits)

    // Move to next input box if present
    if (idx < length - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  // Handle Backspaces and Left/Right navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...digits]
      
      if (digits[idx]) {
        // If has value, clear it
        newDigits[idx] = ''
        handleDigitsChange(newDigits)
      } else if (idx > 0) {
        // If empty, clear and move focus back
        newDigits[idx - 1] = ''
        handleDigitsChange(newDigits)
        inputRefs.current[idx - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault()
      inputRefs.current[idx - 1]?.focus()
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      e.preventDefault()
      inputRefs.current[idx + 1]?.focus()
    }
  }

  // Support Pasting codes (e.g. 123456)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text/plain').trim()
    const codeDigits = pastedText.replace(/[^0-9]/g, '').split('').slice(0, length)
    
    if (codeDigits.length > 0) {
      const newDigits = [...digits]
      codeDigits.forEach((char, idx) => {
        newDigits[idx] = char
      })
      handleDigitsChange(newDigits)
      
      // Focus the last filled input, or the very last input box
      const targetIdx = Math.min(codeDigits.length - 1, length - 1)
      inputRefs.current[targetIdx]?.focus()
    }
  }

  return (
    <div className="flex gap-2.5 sm:gap-4.5 justify-between">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            if (el) inputRefs.current[idx] = el
          }}
          type="text"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          value={digits[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className={`w-11 h-12 sm:w-13 sm:h-14 bg-surface text-center font-heading text-lg sm:text-xl font-bold border rounded-input focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/10 text-danger'
              : 'border-border/80 focus:border-primary text-text-primary'
          } disabled:bg-background disabled:cursor-not-allowed`}
          aria-label={`Digit ${idx + 1} of ${length}`}
          autoFocus={idx === 0}
        />
      ))}
    </div>
  )
}
export default OtpInput
