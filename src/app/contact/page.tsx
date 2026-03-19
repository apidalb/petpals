import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <>
      <div className="page-wrapper">
        <div style={{ padding: '0 24px 48px' }}>
          <div style={{ background: 'var(--bg-gray)', borderRadius: '16px', padding: '24px' }}>
            <div className="contact-card">
              {/* Hero */}
              <div className="contact-hero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80"
                  alt="Contact"
                />
                <div className="contact-hero-overlay">
                  <h1>Contac Us</h1>
                  <p>Have questions or want to help? Reach out to us and be part of making a difference for animals in need.</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="contact-info-icon">🏠</div>
                  <h3>Visit Us</h3>
                  <p>Computer Engineering,<br />Universitas Diponegoro,<br />Semarang, Indonesia.</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">✉️</div>
                  <h3>Contac Us</h3>
                  <p>hello@petpals.id</p>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon">📞</div>
                  <h3>Call Us</h3>
                  <p>+62 24 7460 0000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
