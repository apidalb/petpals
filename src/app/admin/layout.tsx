'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { href: '/admin',            icon: '📊', label: 'Dashboard'    },
  { href: '/admin/animals',    icon: '🐾', label: 'Animals'      },
  { href: '/admin/adoptions',  icon: '📋', label: 'Adoptions'    },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user && user.role !== 'admin') router.replace('/')
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  return (
    <div style={{ paddingTop: 'var(--nav-h)', display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0, background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)', padding: '24px 12px',
        position: 'sticky', top: 'var(--nav-h)', height: 'calc(100vh - var(--nav-h))',
      }}>
        <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '0 12px', marginBottom: '8px' }}>
          Admin Panel
        </div>
        <nav>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', marginBottom: '2px',
                fontSize: '.875rem', fontWeight: 500, cursor: 'pointer',
                background: pathname === n.href ? 'rgba(74,222,128,.1)' : 'transparent',
                color: pathname === n.href ? 'var(--teal)' : 'var(--text-muted)',
                transition: 'all .15s',
              }}>
                <span>{n.icon}</span> {n.label}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px', overflowX: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
