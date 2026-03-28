'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Adoption } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboardPage() {
  const [apps, setApps] = useState<Adoption[]>([])
  const [totalAnimals, setTotalAnimals] = useState(0)
  const [available, setAvailable] = useState(0)
  const [adopted, setAdopted] = useState(0)

  useEffect(() => {
    try { setApps(JSON.parse(localStorage.getItem('pp_apps') || '[]')) } catch {}
  }, [])

  useEffect(() => {
    const fetchPetStats = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('status')

      if (error || !data) {
        setTotalAnimals(0)
        setAvailable(0)
        setAdopted(0)
        return
      }

      setTotalAnimals(data.length)
      setAvailable(data.filter(p => p.status === 'Available').length)
      setAdopted(data.filter(p => p.status === 'Adopted').length)
    }

    fetchPetStats()
  }, [])

  const pending       = apps.filter(a => a.status === 'Pending').length

  const stats = [
    { icon: '🐾', label: 'Total Animals',     value: totalAnimals, color: 'var(--teal)'   },
    { icon: '✅', label: 'Available',          value: available,    color: '#4ade80'       },
    { icon: '🏡', label: 'Adopted',            value: adopted,      color: 'var(--yellow)' },
    { icon: '📋', label: 'Pending Requests',   value: pending,      color: 'var(--red)'    },
  ]

  const recentApps = apps.slice(0, 5)

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.03em', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>Overview platform PetPALS</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '32px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Adoptions */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em' }}>Recent Adoption Requests</h2>
          <Link href="/admin/adoptions" style={{ fontSize: '.8rem', color: 'var(--teal)' }}>View All →</Link>
        </div>

        {recentApps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '.875rem' }}>
            📋 Belum ada pengajuan adopsi.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentApps.map(app => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: '10px', background: 'var(--bg-card-2)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.petImg} alt={app.petName} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--white)' }}>{app.petName}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>
                    {new Date(app.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '.72rem', fontWeight: 700,
                  background: app.status === 'Approved' ? 'var(--teal-pale)' : app.status === 'Rejected' ? 'rgba(248,113,113,.1)' : 'rgba(251,191,36,.1)',
                  color: app.status === 'Approved' ? 'var(--teal)' : app.status === 'Rejected' ? 'var(--red)' : 'var(--yellow)',
                  border: `1px solid ${app.status === 'Approved' ? 'rgba(74,222,128,.2)' : app.status === 'Rejected' ? 'rgba(248,113,113,.2)' : 'rgba(251,191,36,.2)'}`,
                }}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
