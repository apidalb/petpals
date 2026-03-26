'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/layout/Footer'

export default function ForgotPasswordPage() {
  const router    = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    router.push('/forgot-password/verify')
  }

  return (
    <>
      <div className="auth-layout">
        {/* Form side */}
        <div className="auth-form-side">
          <div className="auth-form-wrap">

            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '10px' }}>
              Reset your password
            </h1>
            <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: '1.6' }}>
              Don&apos;t worry! It occurs. Please enter the email address linked with your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="f-group">
                <input
                  className="f-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-dark btn-full"
                style={{ marginTop: '8px' }}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send Code'}
              </button>
            </form>

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
