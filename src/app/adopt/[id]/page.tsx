'use client'

import { useState, type FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PETS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import type { Adoption } from '@/types'

export default function AdoptPage() {
  const { id } = useParams()
  const router  = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()

  const pet = PETS.find(p => p.id === Number(id))

  const [motivation, setMotivation] = useState('')
  const [loading, setLoading]       = useState(false)

  if (!pet) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="empty" style={{ paddingTop: '120px' }}>
          <span className="empty-icon">🐾</span>
          <h3>Hewan tidak ditemukan</h3>
          <Link href="/pets"><button className="btn btn-primary" style={{ marginTop: '16px' }}>← Kembali</button></Link>
        </div>
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (motivation.trim().length < 50) {
      showToast('Motivasi minimal 50 karakter.', 'err')
      return
    }

    const form    = e.currentTarget
    const housing   = (form.elements.namedItem('housing') as HTMLInputElement)?.value
    const otherPets = (form.elements.namedItem('other_pets') as HTMLInputElement)?.value
    const experience = (document.getElementById('experience') as HTMLTextAreaElement)?.value

    if (!housing)   { showToast('Pilih tipe hunian terlebih dahulu.', 'err'); return }
    if (!otherPets) { showToast('Pilih apakah kamu memiliki hewan lain.', 'err'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const newApp: Adoption = {
      id:         Date.now(),
      petId:      pet.id,
      petName:    pet.name,
      petImg:     pet.img,
      petBreed:   pet.breed,
      housing,
      otherPets,
      motivation,
      experience,
      status:     'Pending',
      date:       new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem('pp_apps') || '[]')
      localStorage.setItem('pp_apps', JSON.stringify([newApp, ...existing]))
    } catch {}

    showToast(`Pengajuan adopsi ${pet.name} berhasil dikirim! 🎉`, 'ok')
    router.push('/my-applications')
  }

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <div style={{ padding: '28px 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <button className="back-link" onClick={() => router.back()}>← Back to pet profile</button>
      </div>

      <div className="adopt-layout">
        {/* Sidebar */}
        <div className="adopt-sidebar">
          <div className="adopt-pet-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pet.img} alt={pet.name} className="adopt-pet-img" />
            <div className="adopt-pet-body">
              <div className="adopt-pet-name">{pet.name}</div>
              <div className="adopt-pet-meta">
                {pet.breed}<br />
                {pet.age} • {pet.gender}<br />
                {pet.location}
              </div>
            </div>
          </div>
          <div className="adopt-notice">
            ⚠️ After submitting, the animal&apos;s status will change to <strong>In Process</strong>. Our team will contact you within 1–3 business days.
          </div>
        </div>

        {/* Form */}
        <div className="adopt-form-wrap">
          <h1>Adoption Application</h1>
          <p>Please complete this form honestly so we can find the best match.</p>

          <form onSubmit={handleSubmit}>
            {/* Housing */}
            <div className="f-section">
              <div className="f-section-title">Housing Information</div>
              <div className="f-group">
                <label className="f-label">Type of housing *</label>
                <div className="radio-set">
                  {['House', 'Apartment', 'Boarding', 'Other'].map((h, i) => {
                    const icons = ['🏡', '🏢', '🛏', '🏠']
                    return (
                      <label key={h} className="radio-chip">
                        <input type="radio" name="housing" value={h} />
                        {icons[i]} {h}
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Do you have other pets? *</label>
                <div className="radio-set">
                  <label className="radio-chip"><input type="radio" name="other_pets" value="yes" /> ✅ Yes</label>
                  <label className="radio-chip"><input type="radio" name="other_pets" value="no"  /> ❌ No</label>
                </div>
              </div>
            </div>

            {/* About you */}
            <div className="f-section">
              <div className="f-section-title">About You</div>
              <div className="f-group">
                <label className="f-label">
                  Why do you want to adopt <strong>{pet.name}</strong>? *{' '}
                  <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(min. 50 characters)</span>
                </label>
                <textarea
                  className="f-textarea"
                  id="motivation"
                  rows={5}
                  placeholder="Tell us your reasons and plans for caring for this animal..."
                  maxLength={1000}
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                />
                <div className={`char-note ${motivation.length < 50 && motivation.length > 0 ? 'warn' : ''}`}>
                  {motivation.length} / 1000 {motivation.length < 50 && motivation.length > 0 && `— need ${50 - motivation.length} more`}
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">
                  Previous experience with pets{' '}
                  <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea className="f-textarea" id="experience" rows={3} placeholder="Share any previous experience..." maxLength={500} />
              </div>
            </div>

            <div className="f-check">
              <input type="checkbox" id="adoptAgree" required />
              <label htmlFor="adoptAgree">
                I understand that adoption is a long-term commitment and I am fully prepared to care for this animal.
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
