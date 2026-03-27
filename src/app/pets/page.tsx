'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PETS } from '@/lib/data'
import PetCard from '@/components/ui/PetCard'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'
import type { Pet, PetType } from '@/types'

export default function PetsPage() {
  return (
    <Suspense fallback={<PetsPageLoading />}>
      <PetsPageContent />
    </Suspense>
  )
}

function PetsPageLoading() {
  return (
    <>
      <div className="page-wrapper">
        <div style={{ background: 'var(--bg)', padding: '0 60px 48px' }}>
          <div className="pets-layout">
            <div className="empty">
              <span className="empty-icon">⏳</span>
              <h3>Loading pets...</h3>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

function PetsPageContent() {
  const searchParams = useSearchParams()
  const [pets,      setPets]      = useState<Pet[]>(PETS)
  const [search,    setSearch]    = useState('')
  const [species,   setSpecies]   = useState('')
  const [ageFilter, setAgeFilter] = useState('')
  const [adoption,  setAdoption]  = useState('')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) setSpecies(type)
  }, [searchParams])

  useEffect(() => {
    const fetchPets = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, type, breed, age_years, status, description, image_url')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) return

      const numericIds = PETS
        .map(p => (typeof p.id === 'number' ? p.id : NaN))
        .filter(Number.isFinite)
      const maxLocalId = Math.max(...numericIds, 0)

      const mapped: Pet[] = data.map((row, idx) => {
        const localMatch = PETS.find(
          p => p.name.toLowerCase() === String(row.name || '').toLowerCase()
            && p.type === row.type
        )

        const fallback = localMatch ?? PETS.find(p => p.type === row.type) ?? PETS[0]
        const normalizedType =
          row.type === 'Dog' || row.type === 'Cat' || row.type === 'Bird' || row.type === 'Reptile'
            ? row.type
            : 'Reptile'

        return {
          id: localMatch?.id ?? (maxLocalId + idx + 1),
          name: row.name ?? fallback.name,
          type: normalizedType as PetType,
          breed: row.breed ?? fallback.breed,
          age: row.age_years ? `${row.age_years} years` : fallback.age,
          gender: fallback.gender,
          weight: fallback.weight,
          location: fallback.location,
          status: row.status === 'Adopted' ? 'Adopted' : 'Available',
          vaccinated: fallback.vaccinated,
          neutered: fallback.neutered,
          img: row.image_url ?? fallback.img,
          desc: row.description ?? fallback.desc,
        }
      })

      setPets(mapped)
    }

    fetchPets()
  }, [])

  const filtered = pets.filter(p => {
    const matchSearch  = !search   || p.name.toLowerCase().includes(search.toLowerCase()) || p.breed.toLowerCase().includes(search.toLowerCase())
    const matchSpecies = !species  || p.type === species
    const ageYears = parseInt(p.age, 10)
    const matchAge =
      !ageFilter
      || (ageFilter === 'lt1' && ageYears < 1)
      || (ageFilter === '1-2' && ageYears >= 1 && ageYears <= 2)
      || (ageFilter === '2-3' && ageYears >= 2 && ageYears <= 3)
      || (ageFilter === '3-4' && ageYears >= 3 && ageYears <= 4)
      || (ageFilter === 'gt4' && ageYears > 4)
    const matchAdopt   = !adoption || p.status === adoption
    return matchSearch && matchSpecies && matchAge && matchAdopt
  })

  return (
    <>
      <div className="page-wrapper">
        <div style={{ background: 'var(--bg)', padding: '0 60px 48px' }}>
        
        <div className="pets-layout">
          {/* ── Sidebar ── */}
          <aside className="pets-sidebar">
            <div className="pets-search-wrap">
              <span className="pets-search-icon">🔍</span>
              <input
                className="pets-search"
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={species} onChange={e => setSpecies(e.target.value)}>
              <option value="">Species</option>
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Reptile">Others</option>
            </select>
            <select className="filter-select" value={ageFilter} onChange={e => setAgeFilter(e.target.value)}>
              <option value="">Age</option>
              <option value="lt1">&lt;1 years</option>
              <option value="1-2">1-2 years</option>
              <option value="2-3">2-3 years</option>
              <option value="3-4">3-4 years</option>
              <option value="gt4">&gt;4 years</option>
            </select>
            <select className="filter-select" value={adoption} onChange={e => setAdoption(e.target.value)}>
              <option value="">Adoption</option>
              <option value="Available">Available</option>
              <option value="Adopted">Adopted</option>
            </select>
          </aside>

          {/* ── Grid ── */}
          <div>
            {filtered.length === 0 ? (
              <div className="empty">
                <span className="empty-icon">🐾</span>
                <h3>No animals found</h3>
                <p>Try changing the filter or search term.</p>
              </div>
            ) : (
              <div className="pets-grid">
                {filtered.map(p => <PetCard key={p.id} pet={p} />)}
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
