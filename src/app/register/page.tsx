'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { showToast } = useToast()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass,  setShowPass]  = useState(false)
  const [showPass2, setShowPass2] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const name  = (form.elements.namedItem('uname') as HTMLInputElement).value.trim()
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const pass  = (form.elements.namedItem('password') as HTMLInputElement).value
    const pass2 = (form.elements.namedItem('password2') as HTMLInputElement).value

    if (pass !== pass2) { setError('Password tidak cocok.'); return }
    if (pass.length < 6)  { setError('Password minimal 6 karakter.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))

    const user = { name, email, role: 'adopter' as const, phone }
    login(user)
    showToast(`Akun berhasil dibuat! Selamat datang, ${name.split(' ')[0]} 🎉`, 'ok')
    router.push('/')
  }

  return (
    <div className="auth-layout">
      {/* Left visual */}
      <div className="auth-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=900&q=85" alt="" />
        <div className="auth-visual-ov auth-left-ov">
          <div className="al-brand">🐾 PetPALS</div>
          <h2>Give an animal a second chance</h2>
          <p>Create a free account and start your adoption journey today.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <Link href="/">
            <button className="auth-back">← Back</button>
          </Link>
          <h1 className="auth-h">Create account</h1>
          <p className="auth-sub">Join our community of animal lovers</p>

          {error && <div className="alert alert-err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Full name *</label>
                <input className="f-input" type="text" name="uname" placeholder="Your name" required />
              </div>
              <div className="f-group">
                <label className="f-label">Phone</label>
                <input className="f-input" type="tel" name="phone" placeholder="+62..." />
              </div>
            </div>
            <div className="f-group">
              <label className="f-label">Email address *</label>
              <input className="f-input" type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Password *</label>
                <div className="f-row-rel">
                  <input className="f-input" type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 chars" required minLength={6} />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁'}</button>
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Confirm password *</label>
                <div className="f-row-rel">
                  <input className="f-input" type={showPass2 ? 'text' : 'password'} name="password2" placeholder="Repeat" required />
                  <button type="button" className="eye-btn" onClick={() => setShowPass2(v => !v)}>{showPass2 ? '🙈' : '👁'}</button>
                </div>
              </div>
            </div>
            <div className="f-check">
              <input type="checkbox" id="agree" required />
              <label htmlFor="agree">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link href="/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
