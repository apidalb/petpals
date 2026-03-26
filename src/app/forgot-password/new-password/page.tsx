'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/context/ToastContext'
import Footer from '@/components/layout/Footer'

export default function NewPasswordPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass,  setShowPass]  = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const form  = e.currentTarget
    const pass  = (form.elements.namedItem('password') as HTMLInputElement).value
    const pass2 = (form.elements.namedItem('confirm')  as HTMLInputElement).value

    if (pass.length < 6)  { setError('Password minimal 6 karakter.'); return }
    if (pass !== pass2)   { setError('Password tidak cocok.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    showToast('Password berhasil direset! Silakan login.', 'ok')
    router.push('/login')
  }

  return (
    <>
      <div className="auth-layout">
        {/* Form side */}
        <div className="auth-form-side">
          <div className="auth-form-wrap">

            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '10px' }}>
              Create a New Password
            </h1>
            <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: '1.6' }}>
              Your new password must be unique from those previously used.
            </p>

            {error && <div className="alert alert-err">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="f-group">
                <div className="f-row-rel">
                  <input
                    className="f-input"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="New Password"
                    required
                    minLength={6}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="f-group">
                <div className="f-row-rel">
                  <input
                    className="f-input"
                    type={showPass2 ? 'text' : 'password'}
                    name="confirm"
                    placeholder="Confirm Password"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass2(v => !v)}>
                    {showPass2 ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-outline-dark btn-full"
                style={{ marginTop: '8px' }}
                disabled={loading}
              >
                {loading ? 'Resetting…' : 'Reset Password'}
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
