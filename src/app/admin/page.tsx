'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Adoption } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AdminDashboardPage() {
  const [apps, setApps] = useState<Adoption[]>([])
  const [totalAnimals, setTotalAnimals] = useState(0)
  const [available, setAvailable] = useState(0)
  const [adopted, setAdopted] = useState(0)
  const { user, authReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
  if (!authReady) return

  if (!user || user.role !== 'admin') {
    router.replace('/') 
  }
}, [user, authReady, router])

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
  <div className="admin-content fade-in">
    
    <div className="dashboard-header">
      <h1>Dashboard</h1>
      <p>Overview platform PetPALS</p>
    </div>

    
    <div className="stats-grid">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-value" style={{ color: s.color }}>
            {s.value}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>

    
    <div className="card">
      <div className="card-header">
        <h2>Recent Adoption Requests</h2>
        <Link href="/admin/adoptions">See all →</Link>
      </div>

      {recentApps.length === 0 ? (
        <div className="empty">📋 Belum ada pengajuan adopsi</div>
      ) : (
        <div className="adoption-list">
          {recentApps.map((app) => (
            <div key={app.id} className="adoption-item">
              <img src={app.petImg} alt={app.petName} />

              <div className="info">
                <div className="name">{app.petName}</div>
                <div className="meta">
                  {new Date(app.date).toLocaleDateString("id-ID")}
                </div>
              </div>

              <span className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

)
}
