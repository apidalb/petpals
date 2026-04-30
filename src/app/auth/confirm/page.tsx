'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'

export default function AuthConfirmPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = '/login?confirmed=1'
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="auth-layout">
        <div className="auth-form-side">
          <div className="auth-form-wrap">
            <div className="auth-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-petpals-black.png" alt="PetPals" style={{ height: '52px', width: 'auto', mixBlendMode: 'multiply' }} />
            </div>

            <h1 className="auth-h" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
              Email confirmed
            </h1>
            <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', marginBottom: '22px', lineHeight: '1.7' }}>
              Your email address has been verified. You can now log in to continue.
            </p>

            <div className="alert alert-ok" style={{ marginBottom: '18px' }}>
              Verification complete. Redirecting you to the login page...
            </div>

            <Link href="/login" className="btn btn-dark btn-full" style={{ display: 'inline-flex', justifyContent: 'center' }}>
              Go to login
            </Link>
          </div>
        </div>

        <div className="auth-img-side">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/login-dog.png" alt="Dog" />
        </div>
      </div>

      <Footer />
    </>
  )
}