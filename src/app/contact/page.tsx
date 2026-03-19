'use client'

import { useState, type FormEvent } from 'react'
import Footer from '@/components/layout/Footer'
import { useToast } from '@/context/ToastContext'

export default function ContactPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false);
    (e.target as HTMLFormElement).reset()
    showToast('Pesan berhasil dikirim! Kami akan segera menghubungi kamu.', 'ok')
  }

  return (
    <>
      <div className="page-banner">
        <div className="page-banner-inner">
          <h1>Contact Us</h1>
          <p>Have a question or want to get involved? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <div className="c-item">
                <span className="c-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>Jl. Prof. Soedarto, SH, Tembalang<br />Semarang, Jawa Tengah 50275</p>
                </div>
              </div>
              <div className="c-item">
                <span className="c-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>hello@petpals.id<br />admin@petpals.id</p>
                </div>
              </div>
              <div className="c-item">
                <span className="c-icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+62 24 7460 0000<br />Mon–Fri, 09:00 – 17:00 WIB</p>
                </div>
              </div>
              <div className="c-item">
                <span className="c-icon">🕐</span>
                <div>
                  <strong>Shelter Hours</strong>
                  <p>Monday – Friday: 09:00 – 17:00<br />Saturday: 09:00 – 13:00<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              <h3>Send a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="f-row">
                  <div className="f-group">
                    <label className="f-label">Full Name *</label>
                    <input className="f-input" type="text" name="name" placeholder="Your name" required />
                  </div>
                  <div className="f-group">
                    <label className="f-label">Email *</label>
                    <input className="f-input" type="email" name="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="f-group">
                  <label className="f-label">Subject *</label>
                  <input className="f-input" type="text" name="subject" placeholder="How can we help?" required />
                </div>
                <div className="f-group">
                  <label className="f-label">Message *</label>
                  <textarea className="f-textarea" name="message" rows={6} placeholder="Tell us more…" required />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
