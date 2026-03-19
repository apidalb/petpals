import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">🐾 PetPALS</div>
            <p>Connecting caring people with animals in need. Every adoption saves a life and creates a bond that lasts forever.</p>
            <div className="footer-social">
              <a title="Facebook">f</a>
              <a title="Twitter">t</a>
              <a title="Instagram">in</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/pets">Find a Pet</Link></li>
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
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PetPALS. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
