'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import Footer from '@/components/layout/Footer'

const DEMO_USERS = [
  { email: 'admin@petpals.id', password: 'admin123', name: 'Admin PetPALS', role: 'admin'    as const },
  { email: 'budi@gmail.com',   password: 'user123',  name: 'Budi Santoso',  role: 'adopter' as const },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form  = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const pass  = (form.elements.namedItem('password') as HTMLInputElement).value
    await new Promise(r => setTimeout(r, 600))
    const found = DEMO_USERS.find(u => u.email === email && u.password === pass)
    if (!found) { setError('Email atau password salah.'); setLoading(false); return }
    login({ name: found.name, email: found.email, role: found.role })
    showToast(`Selamat datang, ${found.name.split(' ')[0]}! 👋`, 'ok')
    router.push(found.role === 'admin' ? '/admin' : '/')
  }

  return (
    <>
    <div className="auth-layout">
    <div className="auth-form-side">
      <div className="container">
        <div className="auth-form-wrap">
      {/* Form side */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PetPals" style={{ height: '52px', width: 'auto', mixBlendMode: 'multiply' }} />
          </div>
          </div>
          </div>
          </div>
          <h1 className="auth-h">Sign in to your account</h1>

          {error && <div className="alert alert-err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="f-group">
              <input className="f-input" type="email" name="email" placeholder="Email" required autoComplete="email" />
            </div>
            <div className="f-group">
              <div className="f-row-rel">
                <input className="f-input" type={showPass ? 'text' : 'password'} name="password" placeholder="Password" required />
                <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-dark btn-full" style={{ marginBottom: '14px' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Log In'}
            </button>
            <div className="f-check" style={{ justifyContent: 'flex-start' }}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>
          </form>

          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <Link href="/forgot-password" style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>Forgot Password?</Link>
          </div>
          <div className="auth-switch">
            You do not have account yet? <Link href="/register">Sign In</Link>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-gray)', borderRadius: '8px', fontSize: '.75rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text-2)' }}>Demo:</strong><br />
            Admin: admin@petpals.id / admin123<br />
            User: budi@gmail.com / user123
          </div>
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
