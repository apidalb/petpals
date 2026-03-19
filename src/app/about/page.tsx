import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <>
      <div className="page-wrapper">
        <div style={{ background: 'var(--bg)', padding: '0 24px 48px' }}>
          <div style={{ background: 'var(--bg-gray)', borderRadius: '16px', padding: '24px' }}>
            <div className="about-card">
              <div className="about-header">
                <h1>About Us</h1>
                <p>PetPals is a web platform that connects people who want to adopt pets with animal shelters. Our goal is to make the adoption process easier, more organized, and accessible for everyone.</p>
              </div>
              <div className="about-cols">
                <div className="about-col">
                  <h2>Mission</h2>
                  <ul>
                    <li>Make pet adoption easier</li>
                    <li>Connect adopters with shelters</li>
                    <li>Provide clear information about pets</li>
                    <li>Support responsible adoption</li>
                  </ul>
                </div>
                <div className="about-col">
                  <h2>Location</h2>
                  <p>Computer Engineering,<br />Universitas Diponegoro,<br />Semarang, Indonesia.</p>
                </div>
                <div className="about-col">
                  <h2>Our Team</h2>
                  <ul>
                    <li>Fransiskus F. Sinaga</li>
                    <li>Chatrine Denora Sihaloho</li>
                    <li>Kevin Novantino Hindiarto</li>
                    <li>Muhammad Hafizh Albanthany</li>
                  </ul>
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
