'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { PETS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'
import type { Adoption, Pet, PetType } from '@/types'

export default function AdoptPage() {
  const { id }   = useParams()
  const router   = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [pet, setPet] = useState<Pet | null>(null)

  const [loading,    setLoading]    = useState(false)
  const [motivation, setMotivation] = useState('')
  const [expLevel,   setExpLevel]   = useState('')

  useEffect(() => {
    const routeId = String(id)
    const local = PETS.find(p => String(p.id) === routeId)
    if (local) {
      setPet(local)
      return
    }

    const fetchPet = async () => {
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

      const fallback = PETS.find(p => p.type === data.type) ?? PETS[0]
      const normalizedType =
        data.type === 'Dog' || data.type === 'Cat' || data.type === 'Bird' || data.type === 'Reptile'
          ? data.type
          : 'Reptile'

      setPet({
        id: data.id,
        name: data.name ?? fallback.name,
        type: normalizedType as PetType,
        breed: data.breed ?? fallback.breed,
        age: data.age_years ? `${data.age_years} years` : fallback.age,
        gender: fallback.gender,
        weight: fallback.weight,
        location: fallback.location,
        status: data.status === 'Adopted' ? 'Adopted' : 'Available',
        vaccinated: fallback.vaccinated,
        neutered: fallback.neutered,
        img: data.image_url ?? fallback.img,
        desc: data.description ?? fallback.desc,
      })
    }

    fetchPet()
  }, [id])

  if (!pet) return (
    <div className="page-wrapper">
      <div className="empty" style={{ paddingTop: '80px' }}>
        <span className="empty-icon">🐾</span>
        <h3>Pet not found</h3>
        <Link href="/pets"><button className="btn btn-primary" style={{ marginTop: '16px' }}>← Back</button></Link>
      </div>
    </div>
  )

  if (!user) { router.replace('/login'); return null }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form       = e.currentTarget
    const fullName   = (form.elements.namedItem('fullName') as HTMLInputElement).value
    const email      = (form.elements.namedItem('email') as HTMLInputElement).value
    const phone      = (form.elements.namedItem('phone') as HTMLInputElement).value
    const homeType   = (form.elements.namedItem('homeType') as HTMLSelectElement).value
    const yard       = (form.querySelector('input[name="yard"]:checked') as HTMLInputElement)?.value
    const houseSize  = (form.elements.namedItem('houseSize') as HTMLInputElement).value
    const ownedBefore = (form.querySelector('input[name="ownedBefore"]:checked') as HTMLInputElement)?.value
    const currentPets = (form.querySelector('input[name="currentPets"]:checked') as HTMLInputElement)?.value

    if (!homeType) { showToast('Pilih tipe rumah.', 'err'); return }
    if (motivation.trim().length < 10) { showToast('Isi motivasi adopsi kamu.', 'err'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const newApp: Adoption = {
      id: Date.now(), petId: pet.id, petName: pet.name, petImg: pet.img, petBreed: pet.breed,
      housing: homeType, otherPets: currentPets || 'no', motivation, experience: expLevel,
      status: 'Pending', date: new Date().toISOString(),
    }

    const supabase = createClient()
    const userId = user.id
    const canInsertSupabase = Boolean(userId && typeof pet.id === 'string')

    if (canInsertSupabase) {
      const { error } = await supabase
        .from('adoptions')
        .insert({
          user_id: userId,
          pet_id: pet.id,
          status: 'Pending',
          note: motivation,
        })

      if (!error) {
        showToast(`Pengajuan adopsi ${pet.name} berhasil! 🎉`, 'ok')
        router.push('/my-applications')
        return
      }
    }

    try {
      const existing = JSON.parse(localStorage.getItem('pp_apps') || '[]')
      localStorage.setItem('pp_apps', JSON.stringify([newApp, ...existing]))
    } catch {}

    showToast(`Pengajuan adopsi ${pet.name} disimpan lokal (auth Supabase belum aktif).`, 'ok')
    router.push('/my-applications')
  }

  return (
    <>
      <div className="page-wrapper">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 12px' }}>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Apply for Adoption</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>Apply for Adoption 🐾</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '.9rem' }}>Give a loving home to your new friend</p>
        </div>

        <div className="adopt-layout">
          {/* Sidebar */}
          <div>
            <div className="adopt-pet-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pet.img} alt={pet.name} className="adopt-pet-img" />
              <div className="adopt-pet-body">
                <div className="adopt-pet-name">Name: <strong>{pet.name}</strong></div>
                <div className="adopt-pet-name">Location: <strong>{pet.location}</strong></div>
                <div className="adopt-pet-name">Status: <strong>{pet.status}</strong></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="adopt-form-card" onSubmit={handleSubmit}>

            {/* Personal Info */}
            <div className="adopt-section">
              <div className="adopt-section-title">Personal Information</div>
              <div className="f-group">
                <label className="f-label">Full Name *</label>
                <input className="f-input" name="fullName" defaultValue={user.name} required />
              </div>
              <div className="f-group">
                <label className="f-label">Email *</label>
                <input className="f-input" name="email" type="email" defaultValue={user.email} required />
              </div>
              <div className="f-group">
                <label className="f-label">Phone Number *</label>
                <input className="f-input" name="phone" type="tel" placeholder="+62..." required />
              </div>
            </div>

            {/* Home Info */}
            <div className="adopt-section">
              <div className="adopt-section-title">Home Information</div>
              <div className="f-group">
                <label className="f-label">Type of Home *</label>
                <select className="f-select" name="homeType">
                  <option value="">Choose one</option>
                  <option value="House">House</option>
                  <option value="Apartement">Apartement</option>
                  <option value="Kos">Kos</option>
                  <option value="Shared House">Shared House</option>
                  <option value="Dormitory/Asrama">Dormitory/Asrama</option>
                </select>
              </div>
              <div className="f-group">
                <label className="f-label">Have a Yard? *</label>
                <div className="radio-group">
                  <label className="radio-chip"><input type="radio" name="yard" value="yes" /> Yes</label>
                  <label className="radio-chip"><input type="radio" name="yard" value="no"  /> No</label>
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Household Size</label>
                <input className="f-input" name="houseSize" type="number" min="1" placeholder="e.g. 3" />
              </div>
            </div>

            {/* Pet Experience */}
            <div className="adopt-section">
              <div className="adopt-section-title">Pet Experience</div>
              <div className="f-group">
                <label className="f-label">Owned a pet before?</label>
                <div className="radio-group">
                  <label className="radio-chip"><input type="radio" name="ownedBefore" value="yes" /> Yes</label>
                  <label className="radio-chip"><input type="radio" name="ownedBefore" value="no"  /> No</label>
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Current pets?</label>
                <div className="radio-group">
                  <label className="radio-chip"><input type="radio" name="currentPets" value="yes" /> Yes</label>
                  <label className="radio-chip"><input type="radio" name="currentPets" value="no"  /> No</label>
                </div>
              </div>
              <div className="f-group">
                <label className="f-label">Experience Level</label>
                <div className="exp-btns">
                  {['Beginner', 'Intermediate', 'Expert'].map(l => (
                    <button key={l} type="button" className={`exp-btn ${expLevel === l ? 'active' : ''}`} onClick={() => setExpLevel(l)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="adopt-section">
              <div className="adopt-section-title">Motivation</div>
              <div className="f-group">
                <textarea
                  className="f-textarea" rows={4}
                  placeholder="Why do you want to adopt this pet?"
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                />
              </div>
              <div className="f-check">
                <input type="checkbox" id="agree1" required />
                <label htmlFor="agree1">I agree to take full responsibility for this pet</label>
              </div>
              <div className="f-check">
                <input type="checkbox" id="agree2" required />
                <label htmlFor="agree2">I agree to the adoption terms and conditions</label>
              </div>
            </div>

            <div className="adopt-actions">
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => router.back()}>Cancel</button>
              <button type="submit" className="btn btn-dark btn-lg" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
