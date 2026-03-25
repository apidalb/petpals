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
    <nav className="navbar">
      <div className="nav-inner">

        {/* LEFT - LOGO */}
        <div className="nav-left">
          <Link href="/">
            <img src="/logo.png" alt="PetPals" />
          </Link>
        </div>

        {/* CENTER - MENU */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-link ${pathname === link.href || pathname.startsWith(link.href + '/')
                ? 'active'
                : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT - AUTH */}
        <div className="nav-auth">
          {user ? (
            <div className="nav-user-wrap">
              <button
                className="nav-user-pill"
                onClick={() => setDropOpen(prev => !prev)}
              >
                <div className="u-av">{initials}</div>
                <span>{user.name.split(' ')[0]}</span>
                <span className="arrow">▾</span>
              </button>

              {dropOpen && (
                <div className="nav-drop">
                  <div className="drop-email">{user.email}</div>

                  <Link href="/my-applications" className="drop-item">
                    📋 My Applications
                  </Link>

                  <button className="drop-item danger" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-login">
                Login
              </Link>
              <Link href="/register" className="btn-register">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
