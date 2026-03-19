'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/',        label: 'Home'    },
    { href: '/pets',    label: 'Pets'    },
    { href: '/about',   label: 'About'   },
    { href: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    showToast('Berhasil logout. Sampai jumpa!', 'ok')
    router.push('/')
  }

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() ?? '?'

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-icon">🐾</span> PetPALS
        </Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links" style={{ display: 'flex' }}>
          {navLinks.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`nav-link ${pathname === l.href ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link
                href="/my-applications"
                className={`nav-link ${pathname === '/my-applications' ? 'active' : ''}`}
              >
                My Applications
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link
                href="/admin"
                className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Area */}
        <div className="nav-auth">
          {user ? (
            <div
              className={`nav-user-wrap ${dropOpen ? 'open' : ''}`}
              onBlur={() => setTimeout(() => setDropOpen(false), 150)}
            >
              <button
                className="nav-user-pill"
                onClick={() => setDropOpen(v => !v)}
              >
                <div className="u-av">{initials}</div>
                <span>{user.name.split(' ')[0]}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: '.7rem' }}>▾</span>
              </button>
              {dropOpen && (
                <div className="nav-drop">
                  <div style={{ padding: '9px 12px 5px', fontSize: '.75rem', color: 'var(--text-dim)' }}>
                    {user.email}
                  </div>
                  <hr className="drop-sep" />
                  <Link href="/my-applications" className="drop-item" onClick={() => setDropOpen(false)}>
                    📋 My Applications
                  </Link>
                  <hr className="drop-sep" />
                  <button className="drop-item danger" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-signin">Sign In</Link>
              <Link href="/register" className="btn-signup">Sign Up</Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            className="mob-toggle"
            onClick={() => setMobileOpen(v => !v)}
            style={{ display: 'none' }}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
