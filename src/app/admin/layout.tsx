'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { href: '/admin',           icon: '📊', label: 'Dashboard'  },
  { href: '/admin/animals',   icon: '🐾', label: 'Animals'    },
  { href: '/admin/adoptions', icon: '📋', label: 'Adoptions'  },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!authReady) return
    if (user && user.role !== 'admin') router.replace('/')
    if (!user) router.replace('/login')
  }, [authReady, user, router])

  if (!authReady) return null
  if (!user || user.role !== 'admin') return null

  return (
    <div className="page-wrapper">
      <div className="admin-wrapper">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">Admin Panel</div>
          <nav>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className={`admin-nav-item ${pathname === n.href ? 'active' : ''}`}>
                <span>{n.icon}</span> {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
