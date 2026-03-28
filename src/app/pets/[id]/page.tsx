'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'
import type { Pet, PetType } from '@/types'

const MOCK_COMMENTS = [
  { id: 1, author: 'Ralph Edwards', avatar: 'https://i.pravatar.cc/36?img=3', date: 'Aug 19, 2021', text: 'Such a cute pet! I hope they find a good home soon.', likes: 5, replies: 3 },
]

export default function PetDetailPage() {
  const { id }   = useParams()
  const { user } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)

  const [activeImg, setActiveImg]     = useState(0)
  const [comment, setComment]         = useState('')

  useEffect(() => {
    const fetchPet = async () => {
      const routeId = String(id)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, type, breed, age_years, status, description, image_url')
        .eq('id', routeId)
        .single()

      if (error || !data) {
        setPet(null)
        return
      }

      const normalizedType =
        data.type === 'Dog' || data.type === 'Cat' || data.type === 'Bird' || data.type === 'Reptile'
          ? data.type
          : 'Reptile'
      const status =
        data.status === 'Adopted' || data.status === 'In Process' || data.status === 'Available'
          ? data.status
          : 'Available'

      setPet({
        id: data.id,
        name: data.name ?? 'Unnamed Pet',
        type: normalizedType as PetType,
        breed: data.breed ?? '-',
        age: data.age_years != null ? `${data.age_years} years` : '-',
        gender: 'Unknown',
        weight: '-',
        location: 'Unknown',
        status,
        vaccinated: false,
        neutered: false,
        img: data.image_url ?? '/login-dog.png',
        desc: data.description ?? 'No description yet.',
      })
    }

    fetchPet()
  }, [id])

  // Use same image 4x as thumbnails (in real app, pet would have multiple photos)
  const images = [pet?.img, pet?.img, pet?.img, pet?.img].filter(Boolean) as string[]

  if (!pet) return (
    <div className="page-wrapper">
      <div className="empty" style={{ paddingTop: '80px' }}>
        <span className="empty-icon">🐾</span>
        <h3>Pet not found</h3>
        <Link href="/pets"><button className="btn btn-primary" style={{ marginTop: '16px' }}>← Back</button></Link>
      </div>
    </div>
  )

  const hasApplied = () => {
    try {
      return JSON.parse(localStorage.getItem('pp_apps') || '[]')
        .some((a: { petId: number | string }) => String(a.petId) === String(pet.id))
    } catch {
      return false
    }
  }

  return (
    <>
      <div className="page-wrapper">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div className="detail-layout">
            {/* ── Gallery ── */}
            <div className="detail-gallery">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[activeImg]} alt={pet.name} className="detail-main-img" />
              <div className="detail-thumbs">
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i} src={img} alt=""
                    className={`detail-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            </div>

            {/* ── Info ── */}
            <div className="detail-info">
              <div className="detail-name-row">
                <h1 className="detail-name">{pet.name}</h1>
                <span className={`detail-badge ${pet.status === 'Adopted' ? 'adopted' : pet.status === 'In Process' ? 'process' : ''}`}>
                  {pet.status}
                </span>
              </div>
              <div className="detail-location">📍 {pet.location}</div>
              <hr className="detail-divider" />

              <div className="detail-section-title">Details</div>
              <div className="detail-specs">
                <div className="detail-spec">Age: <strong>{pet.age}</strong></div>
                <div className="detail-spec">Gender: <strong>{pet.gender}</strong></div>
                <div className="detail-spec">Breed: <strong>{pet.breed}</strong></div>
                <div className="detail-spec">Health: <strong>{pet.vaccinated ? 'Vaccinated' : 'Not vaccinated'}</strong></div>
              </div>
              <hr className="detail-divider" />

              <div className="detail-section-title">About</div>
              <p className="detail-desc">{pet.desc}</p>

              {/* CTA */}
              {pet.status === 'Available' && !hasApplied() && (
                user
                  ? <Link href={`/adopt/${pet.id}`}><button className="btn btn-primary btn-lg btn-full">Adopt Now</button></Link>
                  : <Link href="/login"><button className="btn btn-primary btn-lg btn-full">Sign In to Adopt</button></Link>
              )}
              {hasApplied() && (
                <div className="alert alert-ok">✅ You&apos;ve already applied! <Link href="/my-applications" style={{textDecoration:'underline'}}>View status →</Link></div>
              )}
              {pet.status === 'Adopted' && (
                <div className="alert" style={{background:'var(--bg-gray)',color:'var(--text-muted)',border:'1px solid var(--border)',padding:'12px 16px',borderRadius:'8px',fontSize:'.875rem'}}>
                  ✓ {pet.name} has already been adopted.
                </div>
              )}

              <hr className="detail-divider" />

              {/* Comments */}
              <div className="comment-section">
                <div className="detail-section-title">Comment</div>
                <div className="comment-input-wrap">
                  <input
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </div>
                {MOCK_COMMENTS.map(c => (
                  <div key={c.id} className="comment-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.avatar} alt={c.author} className="comment-avatar" />
                    <div style={{ flex: 1 }}>
                      <div className="comment-meta">
                        <span className="comment-author">{c.author}</span>
                        <span className="comment-date">{c.date}</span>
                      </div>
                      <p className="comment-text">{c.text}</p>
                      <div className="comment-actions">
                        <button className="comment-action">👍 {c.likes}</button>
                        <button className="comment-action">💬 {c.replies}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
