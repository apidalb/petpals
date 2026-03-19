'use client'

import Link from 'next/link'
import { PETS } from '@/lib/data'
import Footer from '@/components/layout/Footer'

// Simple card for home page — NO heart icon
function HomePetCard({ pet }: { pet: { id: number; name: string; age: string; location: string; img: string } }) {
  return (
    <Link href={`/pets/${pet.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        border: '1px solid #e5e7eb', cursor: 'pointer',
        transition: 'all .2s', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', marginBottom: '4px' }}>{pet.name}</div>
          <div style={{ fontSize: '.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pet.age} · 📍 {pet.location}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const featured = PETS.filter(p => p.status === 'Available').slice(0, 4)

  return (
    <>
      <div className="page-wrapper">

        {/* ── HERO ── */}
        <div className="hero fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1537204696486-967f1b7198c8?w=1600&q=85"
            alt="Hero"
            className="hero-img"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Find your perfect<br />pet today</h1>
            <Link href="/pets">
              <button className="hero-cta">See pets</button>
            </Link>
          </div>
        </div>

        {/* ── FEATURED PETS ── */}
        <section className="section">
          <div className="container">
            <h2 className="section-title">Friends who looking for a home</h2>
            <div style={{ background: 'var(--bg-gray)', borderRadius: '16px', padding: '28px' }}>
              <div className="pets-grid">
                {featured.map(p => <HomePetCard key={p.id} pet={p} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '28px' }}>
                <Link href="/pets">
                  <button className="btn btn-primary btn-lg">See others</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── BROWSE BY TYPE ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title">Browse by pets type</h2>
            <div className="cat-grid">
              {[
                { label: 'Cat',    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80', type: 'Cat'  },
                { label: 'Dog',    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80', type: 'Dog'  },
                { label: 'Others', img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&q=80',    type: 'Bird' },
              ].map(c => (
                <Link key={c.label} href={`/pets?type=${c.type}`}>
                  <div className="cat-card">
                    <div className="cat-circle">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.img} alt={c.label} />
                    </div>
                    <span className="cat-label">{c.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY ADOPT ── */}
        <div className="why-section">
          <h2 className="section-title" style={{ marginBottom: '48px' }}>Why adopt from us?</h2>
          <div className="why-inner">
            <div className="why-col" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
              <div className="why-item">Healthy &amp; vaccinated pets</div>
              <div className="why-item">Trusted adoption process</div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80"
              alt="Why adopt"
              className="why-img"
            />
            <div className="why-col">
              <div className="why-item">Support animal welfare</div>
              <div className="why-item">Easy online adoption</div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  )
}
