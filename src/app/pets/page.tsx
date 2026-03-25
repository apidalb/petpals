'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PETS } from '@/lib/data'
import PetCard from '@/components/ui/PetCard'
import Footer from '@/components/layout/Footer'
import type { PetType } from '@/types'

export default function PetsPage() {
  const searchParams = useSearchParams()
  const [search,    setSearch]    = useState('')
  const [species,   setSpecies]   = useState('')
  const [ageFilter, setAgeFilter] = useState('')
  const [adoption,  setAdoption]  = useState('')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) setSpecies(type)
  }, [searchParams])

  const filtered = PETS.filter(p => {
    const matchSearch  = !search   || p.name.toLowerCase().includes(search.toLowerCase()) || p.breed.toLowerCase().includes(search.toLowerCase())
    const matchSpecies = !species  || p.type === species
    const matchAdopt   = !adoption || p.status === adoption
    return matchSearch && matchSpecies && matchAdopt
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
