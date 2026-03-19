'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PETS } from '@/lib/data'
import PetCard from '@/components/ui/PetCard'
import Footer from '@/components/layout/Footer'
import type { PetType } from '@/types'
import { useEffect } from 'react'

type Filter = 'All' | PetType

const FILTERS: { label: string; value: Filter; icon?: string }[] = [
  { label: 'All',     value: 'All'     },
  { label: 'Dog',     value: 'Dog',     icon: '🐕' },
  { label: 'Cat',     value: 'Cat',     icon: '🐈' },
  { label: 'Bird',    value: 'Bird',    icon: '🐦' },
  { label: 'Reptile', value: 'Reptile', icon: '🦎' },
]

export default function PetsPage() {
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<Filter>('All')

  useEffect(() => {
    const type = searchParams.get('type') as Filter | null
    if (type && FILTERS.some(f => f.value === type)) {
      setActiveFilter(type)
    }
  }, [searchParams])

  const filtered = activeFilter === 'All'
    ? PETS
    : PETS.filter(p => p.type === activeFilter)

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-inner">
          <h1>Find a Pet</h1>
          <p>Browse our available animals and find your perfect companion.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="filter-row">
            <div className="filter-pills">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  className={`pill ${activeFilter === f.value ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.value)}
                >
                  {f.icon ? `${f.icon} ${f.label}` : f.label}
                </button>
              ))}
            </div>
            <span className="filter-count">
              <strong>{filtered.length}</strong> animals
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">🐾</span>
              <h3>No animals found</h3>
              <p>Try a different category.</p>
            </div>
          ) : (
            <div className="pets-grid">
              {filtered.map(p => <PetCard key={p.id} pet={p} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
