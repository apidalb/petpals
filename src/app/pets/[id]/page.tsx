'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PETS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'

function hasApplied(petId: number): boolean {
  if (typeof window === 'undefined') return false
  try {
    const apps = JSON.parse(localStorage.getItem('pp_apps') || '[]')
    return apps.some((a: { petId: number }) => a.petId === petId)
  } catch { return false }
}

export default function PetDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const pet = PETS.find(p => p.id === Number(id))

  if (!pet) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="empty" style={{ paddingTop: '120px' }}>
          <span className="empty-icon">🐾</span>
          <h3>Hewan tidak ditemukan</h3>
          <p>Mungkin sudah diadopsi atau ID tidak valid.</p>
          <Link href="/pets">
            <button className="btn btn-primary" style={{ marginTop: '16px' }}>← Kembali ke Daftar</button>
          </Link>
        </div>
      </div>
    )
  }

  const applied = hasApplied(pet.id)

  const specs = [
    ['Age',      pet.age],
    ['Gender',   pet.gender],
    ['Breed',    pet.breed],
    ['Weight',   pet.weight],
    ['Location', pet.location],
    ['Status',   pet.status],
  ]

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div style={{ padding: '32px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <button className="back-link" onClick={() => router.back()}>← Back to Pets</button>
      </div>

      <div className="detail-container">
        {/* Image */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pet.img} alt={pet.name} className="detail-img" />
        </div>

        {/* Info */}
        <div>
          {/* Badges */}
          <div className="detail-badges">
            <span className="d-badge">{pet.type}</span>
            <span className={`d-badge ${pet.status === 'Adopted' ? 'muted' : pet.status === 'In Process' ? 'yellow' : ''}`}>
              {pet.status}
            </span>
            {pet.vaccinated && <span className="d-badge">💉 Vaccinated</span>}
            {pet.neutered   && <span className="d-badge">✂️ Neutered</span>}
          </div>

          <h1 className="detail-name">{pet.name}</h1>
          <p className="detail-sub">{pet.breed} • {pet.age} • {pet.location}</p>
          <p className="detail-desc">{pet.desc}</p>

          {/* Specs Grid */}
          <div className="detail-grid-specs">
            {specs.map(([k, v]) => (
              <div key={k} className="spec-row">
                <div className="spec-key">{k}</div>
                <div className="spec-val">{v}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {pet.status === 'Available' && !applied && (
            user ? (
              <Link href={`/adopt/${pet.id}`}>
                <button className="btn btn-primary btn-lg btn-full">
                  Apply to Adopt {pet.name}
                </button>
              </Link>
            ) : (
              <div>
                <Link href="/login">
                  <button className="btn btn-primary btn-lg btn-full">Sign In to Adopt</button>
                </Link>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8rem', marginTop: '8px' }}>
                  You need an account to apply
                </p>
              </div>
            )
          )}

          {applied && (
            <div className="alert alert-ok">
              ✅ You&apos;ve already applied for {pet.name}.{' '}
              <Link href="/my-applications" style={{ textDecoration: 'underline' }}>
                View your applications →
              </Link>
            </div>
          )}

          {pet.status === 'In Process' && !applied && (
            <div className="alert" style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.2)', color: 'var(--yellow)', padding: '12px 16px', borderRadius: '8px', fontSize: '.875rem' }}>
              ⏳ This animal is currently being processed for adoption.
            </div>
          )}

          {pet.status === 'Adopted' && (
            <div className="alert" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--border-2)', color: 'var(--text-muted)', padding: '12px 16px', borderRadius: '8px', fontSize: '.875rem' }}>
              ✓ {pet.name} has already been adopted. See other available animals.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
