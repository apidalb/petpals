'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import type { Adoption } from '@/types'
import { createClient } from '@/lib/supabase/client'

function statusClass(s: string) {
  if (s === 'Approved') return 'st-ok'
  if (s === 'Rejected') return 'st-no'
  return 'st-wait'
}

function statusLabel(s: string) {
  if (s === 'Approved') return '✅ Approved'
  if (s === 'Rejected') return '❌ Rejected'
  return '⏳ Pending'
}

export default function MyApplicationsPage() {
  const { user, authReady } = useAuth()
  const [apps, setApps] = useState<Adoption[]>([])

  useEffect(() => {
    const loadApps = async () => {
      if (!user?.id) {
        try {
          const stored = JSON.parse(localStorage.getItem('pp_apps') || '[]') as Adoption[]
          setApps(stored)
        } catch {}
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('adoptions')
        .select('id, pet_id, status, note, created_at, pets(name, breed, image_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error || !data) {
        try {
          const stored = JSON.parse(localStorage.getItem('pp_apps') || '[]') as Adoption[]
          setApps(stored)
        } catch {}
        return
      }

      const mapped: Adoption[] = data.map((row: {
        id: string
        pet_id: string
        status: 'Pending' | 'Approved' | 'Rejected'
        note: string | null
        created_at: string
        pets: { name: string; breed: string; image_url: string | null } | Array<{ name: string; breed: string; image_url: string | null }> | null
      }) => {
        const pet = Array.isArray(row.pets) ? row.pets[0] : row.pets
        return {
          id: row.id,
          petId: row.pet_id,
          petName: pet?.name || 'Pet',
          petImg: pet?.image_url || '/login-dog.png',
          petBreed: pet?.breed || '-',
          housing: '-',
          otherPets: '-',
          motivation: row.note || '-',
          status: row.status,
          date: row.created_at,
        }
      })

      setApps(mapped)
    }

    loadApps()
  }, [user?.id])

  if (!authReady) return null

  if (!user) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="empty" style={{ paddingTop: '120px' }}>
          <span className="empty-icon">🔒</span>
          <h3>Login diperlukan</h3>
          <p>Kamu perlu login untuk melihat pengajuan adopsimu.</p>
          <Link href="/login">
            <button className="btn btn-primary" style={{ marginTop: '16px' }}>Sign In</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div className="page-banner">
        <div className="page-banner-inner">
          <h1>My Applications</h1>
          <p>Track the status of your adoption requests.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          {apps.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">📋</span>
              <h3>No applications yet</h3>
              <p>You haven&apos;t submitted any adoption requests. Browse available animals and start the process!</p>
              <Link href="/pets">
                <button className="btn btn-primary" style={{ marginTop: '8px' }}>Find a Pet</button>
              </Link>
            </div>
          ) : (
            <div className="app-list">
              {apps.map(app => (
                <div key={app.id} className="app-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={app.petImg} alt={app.petName} className="app-img" />
                  <div>
                    <div className="app-name">{app.petName}</div>
                    <div className="app-meta">{app.petBreed} • Housing: {app.housing}</div>
                    <div className="app-date">
                      Submitted: {new Date(app.date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                  </div>
                  <span className={`app-status ${statusClass(app.status)}`}>
                    {statusLabel(app.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
