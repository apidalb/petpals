import Footer from '@/components/layout/Footer'

const TEAM = [
  { name: 'Chatrine Denora S.',    nim: '21120124120005', role: 'Frontend Dev'  },
  { name: 'Fransiskus F. Sinaga', nim: '21120124000035', role: 'Backend Dev'   },
  { name: 'Kevin N. Hindiarto',   nim: '21120124140109', role: 'UI/UX Designer' },
  { name: 'M. Hafizh Albanthany', nim: '21120122140148', role: 'Full Stack Dev' },
]

const KPIS = [
  { num: '200+', label: 'Animals Helped' },
  { num: '150+', label: 'Successful Adoptions' },
  { num: '50+',  label: 'Partner Shelters' },
  { num: '1K+',  label: 'Registered Users' },
]

const METHODS = [
  { step: 'Step 01', name: 'Requirements Analysis', desc: 'Collecting and defining functional & non-functional requirements based on user needs.' },
  { step: 'Step 02', name: 'System Design',          desc: 'Designing database schemas, DFD, ERD, use cases, and UI wireframes.' },
  { step: 'Step 03', name: 'Development',            desc: 'Building the system using Node.js, Next.js, Tailwind CSS, and Supabase.' },
  { step: 'Step 04', name: 'Testing',                desc: 'Functional testing of all features including API connections and UI flows.' },
  { step: 'Step 05', name: 'Deployment',             desc: 'Publishing the platform and monitoring for issues or performance concerns.' },
  { step: 'Step 06', name: 'Maintenance',            desc: 'Ongoing updates and fixes based on user feedback and system monitoring.' },
]

export default function AboutPage() {
  return (
    <>
      <div className="page-banner">
        <div className="page-banner-inner">
          <h1>About PetPALS</h1>
          <p>A platform built to connect animals in need with caring families.</p>
        </div>
      </div>

      {/* Mission */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="section-inner">
          <div className="about-split">
            <div className="about-text">
              <h2>Our Mission</h2>
              <p>PetPALS is a web-based adoption platform developed as part of a software engineering project at Universitas Diponegoro. Our goal is to streamline the pet adoption process between prospective adopters and shelters.</p>
              <p>The system provides features for users to browse available animals, submit adoption requests, and track their application status — while giving admins full control over animal data and adoption approvals.</p>
              <p>Built with a focus on usability, transparency, and efficiency, PetPALS aims to give every animal a second chance at a loving home.</p>
            </div>
            <div className="kpi-grid">
              {KPIS.map(k => (
                <div key={k.label} className="kpi-box">
                  <span className="kpi-num">{k.num}</span>
                  <span className="kpi-label">{k.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">Our Team</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '.9rem' }}>
            Kelompok 24 — Departemen Teknik Komputer, Fakultas Teknik, Universitas Diponegoro
          </p>
          <div className="team-grid">
            {TEAM.map(m => {
              const initials = m.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
              return (
                <div key={m.nim} className="team-card">
                  <div className="team-av">{initials}</div>
                  <div className="team-name">{m.name}</div>
                  <div className="team-nim">{m.nim}</div>
                  <span className="team-role">{m.role}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="section-inner">
          <h2 className="section-title">Development Methodology</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
            We follow the <strong style={{ color: 'var(--white)' }}>Iterative Waterfall</strong> model — a structured approach that allows us to revisit each phase if issues are discovered during later stages.
          </p>
          <div className="method-grid">
            {METHODS.map(m => (
              <div key={m.step} className="method-step">
                <div className="step-num">{m.step}</div>
                <div className="step-name">{m.name}</div>
                <div className="step-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
