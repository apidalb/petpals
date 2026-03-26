'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/layout/Footer'

export default function VerifyCodePage() {
  const router   = useRouter()
  const [otp, setOtp]       = useState(['', '', '', '', ''])
  const [timer, setTimer]   = useState(58)
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 4) inputs.current[i + 1]?.focus()
  }

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    router.push('/forgot-password/new-password')
  }

  const formatTime = (s: number) => `0:${s.toString().padStart(2, '0')}`

  return (
    <>
      <div className="auth-layout">
        {/* Form side */}
        <div className="auth-form-side">
          <div className="auth-form-wrap">

            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '10px' }}>
              Code Verificaction
            </h1>
            <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.6' }}>
              Enter the verification code we just sent on your email address.
            </p>

            {/* Success message */}
            <p className="otp-success">The email was sent succesfuly.</p>

            {/* OTP Inputs */}
            <div className="otp-wrap">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el }}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Timer */}
            <p className="otp-timer">
              {timer > 0
                ? `The email will be resent in ${formatTime(timer)}`
                : <span style={{ color: 'var(--green)', cursor: 'pointer' }} onClick={() => setTimer(58)}>Resend email</span>
              }
            </p>

            <button
              className="btn btn-outline-dark btn-full"
              onClick={handleSubmit}
              disabled={loading || otp.some(v => !v)}
            >
              {loading ? 'Verifying…' : 'Send Code'}
            </button>

          </div>
        </div>

        {/* Image side */}
        <div className="auth-img-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/login-dog.png" alt="Dog" />
        </div>
      </div>

      <Footer />
    </>
  )
}
