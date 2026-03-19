import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ marginBottom: '14px' }}>
              {/* mix-blend-mode:multiply removes black background on white footer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="PetPals"
                style={{ height: '44px', width: 'auto', mixBlendMode: 'multiply' }}
              />
            </div>
            <p>PetPals is a pet adoption platform designed to help people find and adopt pets in need of loving homes. Through an easy and safe process, PetPals connects animals with caring adopters and supports responsible pet adoption.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/contact">Contacs</Link></li>
              <li><Link href="/pets">Search</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect to Us</h4>
            <div className="footer-social" style={{ marginTop: '4px' }}>
              <a title="Instagram">📷</a>
              <a title="Facebook">f</a>
              <a title="X/Twitter">𝕏</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Petpals. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
