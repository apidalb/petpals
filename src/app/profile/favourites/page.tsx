'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import UserSidebar from '@/components/ui/UserSidebar'
import Footer from '@/components/layout/Footer'
import { PETS } from '@/lib/data'
import type { Pet } from '@/types'

export default function FavouritesPage() {
  const { user, authReady } = useAuth()
  const router   = useRouter()
  const [favs, setFavs] = useState<Pet[]>([])

  useEffect(() => {
    if (!authReady) return
    if (!user) { router.replace('/login'); return }
    // Mock: show first 3 pets as favourites
    setFavs(PETS.slice(0, 3))
  }, [authReady, user, router])

  if (!authReady) return null
  if (!user) return null

  return (
    <>
      <div className="page-wrapper">
        <div style={{ padding: '0 40px 48px' }}>
          <div style={{
            background: 'var(--bg-gray)', borderRadius: '16px',
            padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start',
          }}>
            <UserSidebar />

            {/* Content */}
            <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid var(--border)', padding: '28px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>My Favourites</h2>

              {favs.length === 0 ? (
                <div className="empty">
                  <span className="empty-icon">🤍</span>
                  <h3>No favourites yet</h3>
                  <p>Browse pets and click the heart icon to save your favourites.</p>
                  <Link href="/pets"><button className="btn btn-primary" style={{ marginTop: '8px' }}>Browse Pets</button></Link>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {favs.map(p => (
                    <Link key={p.id} href={`/pets/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ width: '150px', cursor: 'pointer' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.img} alt={p.name}
                          style={{ width: '150px', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }}
                        />
                        <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '3px' }}>{p.name}</div>
                        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{p.age} · {p.location}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
