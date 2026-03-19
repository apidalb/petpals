'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

const DEMO_USERS = [
  { email: 'admin@petpals.id', password: 'admin123', name: 'Admin PetPALS', role: 'admin'    as const },
  { email: 'budi@gmail.com',   password: 'user123',  name: 'Budi Santoso',  role: 'adopter' as const },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
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
    if (!found) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }

    login({ name: found.name, email: found.email, role: found.role })
    showToast(`Selamat datang, ${found.name.split(' ')[0]}! 👋`, 'ok')
    router.push(found.role === 'admin' ? '/admin' : '/')
  }

  return (
    <div className="auth-layout">
      {/* Left visual */}
      <div className="auth-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=85" alt="" />
        <div className="auth-visual-ov auth-left-ov">
          <div className="al-brand">🐾 PetPALS</div>
          <h2>Every animal deserves a loving home</h2>
          <p>Join thousands of adopters who have found their perfect companion through our platform.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link href="/">
            <button className="auth-back">← Back</button>
          </Link>
          <h1 className="auth-h">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>

          {error && <div className="alert alert-err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="f-group">
              <label className="f-label">Email address</label>
              <input className="f-input" type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="f-group">
              <label className="f-label">Password</label>
              <div className="f-row-rel">
                <input className="f-input" type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••" required />
                <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don&apos;t have an account? <Link href="/register">Sign up →</Link>
          </div>

          {/* Demo credentials */}
          <div style={{ background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.15)', borderRadius: '8px', padding: '12px 14px', marginTop: '16px', fontSize: '.78rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--text)' }}>Demo accounts:</strong><br />
            Admin: <code style={{ color: 'var(--teal)', background: 'rgba(74,222,128,.1)', padding: '1px 5px', borderRadius: '4px' }}>admin@petpals.id</code> / <code style={{ color: 'var(--teal)', background: 'rgba(74,222,128,.1)', padding: '1px 5px', borderRadius: '4px' }}>admin123</code><br />
            User: <code style={{ color: 'var(--teal)', background: 'rgba(74,222,128,.1)', padding: '1px 5px', borderRadius: '4px' }}>budi@gmail.com</code> / <code style={{ color: 'var(--teal)', background: 'rgba(74,222,128,.1)', padding: '1px 5px', borderRadius: '4px' }}>user123</code>
          </div>
        </div>
      </div>
    </div>
  )
}
