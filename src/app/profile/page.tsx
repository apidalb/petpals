'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import UserSidebar from '@/components/ui/UserSidebar'
import Footer from '@/components/layout/Footer'
import { PETS } from '@/lib/data'

export default function ProfilePage() {
  const { user, authReady } = useAuth()
  const router   = useRouter()

  useEffect(() => {
    if (!authReady) return
    if (!user) router.replace('/login')
  }, [authReady, user, router])

  if (!authReady) return null
  if (!user) return null

  // Mock favourites — 2 pets preview
  const favPets = PETS.slice(0, 2)

  const initials = user.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()

  return (
    <>
      <div className="page-wrapper">
        <div style={{ padding: '0 40px 48px' }}>
          <div style={{
            background: 'var(--bg-gray)', borderRadius: '16px',
            padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start',
          }}>
            <UserSidebar />

            {/* Main Content */}
            <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Profile Page</h2>

              {/* Profile Card */}
              <div style={{ background: 'var(--bg-gray)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: '#2d3748', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 800, flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>{user.name}</h3>
                    <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{user.email}</p>
                    {(user as { phone?: string }).phone && (
                      <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{(user as { phone?: string }).phone}</p>
                    )}
                    <p style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>Semarang, Jawa Tengah</p>
                  </div>
                  <Link href="/profile/edit">
                    <button className="btn btn-primary">Edit Profile</button>
                  </Link>
                </div>
              </div>

              {/* My Favourites Preview */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>My Favourites</h3>
                  <Link href="/profile/favourites" style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                    &gt; see all
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {favPets.map(p => (
                    <Link key={p.id} href={`/pets/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ width: '130px', cursor: 'pointer' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.img} alt={p.name} style={{ width: '130px', height: '120px', objectFit: 'cover', borderRadius: '10px', marginBottom: '8px' }} />
                        <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{p.age} · {p.location}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
