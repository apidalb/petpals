import Link from 'next/link'
import { PETS } from '@/lib/data'
import PetCard from '@/components/ui/PetCard'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  const featured = PETS.filter(p => p.status === 'Available').slice(0, 4)

  const categories = [
    { icon: '🐕', label: 'Dog',     filter: 'Dog'     },
    { icon: '🐈', label: 'Cat',     filter: 'Cat'     },
    { icon: '🐦', label: 'Bird',    filter: 'Bird'    },
    { icon: '🦎', label: 'Reptile', filter: 'Reptile' },
  ]

  const helpCards = [
    { icon: '💰', title: 'Donate',    desc: 'Your generosity helps us provide essential care, medical treatment, and find loving homes for animals.', link: 'Give Today →' },
    { icon: '🙌', title: 'Volunteer', desc: 'Lend your time and skills to make a difference in the lives of our animals. Every hour helps!',             link: 'Join Our Team →' },
    { icon: '🏡', title: 'Foster',    desc: 'Open your home temporarily to an animal in need, providing them with a nurturing environment.',             link: 'Learn to Foster →' },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content fade-in">
          <h1>Find your perfect<br />pet today</h1>
          <Link href="/pets">
            <button className="hero-cta">See Pets →</button>
          </Link>
        </div>
      </section>

      {/* ── FEATURED PETS ── */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="section-inner">
          <div className="section-header-row">
            <h2 className="section-title">Friends Awaiting a Home</h2>
            <Link href="/pets" className="section-link">View All Our Animals →</Link>
          </div>
          <div className="pets-grid">
            {featured.map(p => <PetCard key={p.id} pet={p} />)}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Browse by Category</h2>
          <div className="cat-grid">
            {categories.map(c => (
              <Link key={c.label} href={`/pets?type=${c.filter}`}>
                <div className="cat-card">
                  <span className="cat-icon">{c.icon}</span>
                  <div className="cat-label">{c.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO HELP ── */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="section-inner">
          <h2 className="section-title">How You Can Help</h2>
          <div className="help-grid">
            {helpCards.map(h => (
              <div key={h.title} className="help-card">
                <span className="help-icon">{h.icon}</span>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
                <Link href="/contact">
                  <button className="help-link">{h.link}</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
