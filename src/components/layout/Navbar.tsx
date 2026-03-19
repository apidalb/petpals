'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuth()
  const { showToast }    = useToast()
  const [dropOpen,  setDropOpen]  = useState(false)
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true)
      } else {
        setNavHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/',        label: 'Home'     },
    { href: '/pets',    label: 'Pets'     },
    { href: '/about',   label: 'About'    },
    { href: '/contact', label: 'Contacts' },
  ]

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    showToast('Berhasil logout!', 'ok')
    router.push('/')
  }

  const initials = user?.name
    ?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() ?? '?'

  return (
    <nav className={`navbar${navHidden ? ' hidden' : ''}`}>
      <div className="nav-inner">

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PetPals" style={{ height: '48px', width: 'auto', display: 'block' }} />
        </Link>

        {/* Nav Links */}
        <ul className="nav-links" style={{ display: 'flex' }}>
          {navLinks.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`nav-link ${pathname === l.href ? 'active' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link href="/my-applications" className={`nav-link ${pathname === '/my-applications' ? 'active' : ''}`}>
                My Apps
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link href="/admin" className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}>
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* Auth */}
        <div className="nav-auth">
          {user ? (
            <div className="nav-user-wrap" onBlur={() => setTimeout(() => setDropOpen(false), 150)}>
              <button className="nav-user-pill" onClick={() => setDropOpen(v => !v)}>
                <div className="u-av">{initials}</div>
                <span>{user.name.split(' ')[0]}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '.7rem' }}>▾</span>
              </button>
              {dropOpen && (
                <div className="nav-drop">
                  <div style={{ padding: '8px 12px 4px', fontSize: '.75rem', color: 'var(--text-dim)' }}>
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
              <Link href="/login"    className="btn-login">Login</Link>
              <Link href="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
