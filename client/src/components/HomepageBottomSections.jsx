import React from 'react';
import './HomepageBottomSections.css';

export default function HomepageBottomSections({
  onGetStarted,
  onLogin,
  onPricing,
  onAbout,
  onContact,
  onDashboardInfo,
  onClientPortalInfo,
  onLegal,
  onMockupAction
}) {
  const testimonials = [
    {
      name: 'Aarav Mehta',
      studio: 'Aarav Mehta Films',
      badge: '(Beta Studio Partner)',
      avatar: '/products/reviewer-aarav.jpg',
      text: 'Album Selection solved our biggest bottleneck. Clients used to take months to select photos for their print albums—now they finish in one weekend with built-in selection limits.'
    },
    {
      name: 'Sophie Chen',
      studio: 'Lumina Wedding Stories',
      badge: '(Pilot Studio Member)',
      avatar: '/products/reviewer-sophie.jpg',
      text: 'Having client booking contracts, shoot schedules, and payment milestones right next to the image galleries completely changed how our studio coordinates wedding season.'
    },
    {
      name: 'Zayd & Mariam',
      studio: 'Noor Cinematic Weddings',
      badge: '(Early Studio Partner)',
      avatar: '/products/reviewer-zayd.jpg',
      text: 'The Song Selection module organized by Shaadi, Valima, and Haldi made soundtrack curation effortless for our cinematic highlight films and couple teasers.'
    },
    {
      name: 'Marcus Vance',
      studio: 'Vance Photography Co.',
      badge: '(Beta Studio Partner)',
      avatar: '/products/reviewer-marcus.jpg',
      text: 'Guest Photo AI was an absolute hit at our recent grand weddings. Guests loved scanning the QR code and watching their photos automatically organize with smart face lookup.'
    },
    {
      name: 'Priya Patel',
      studio: 'Saffron Moments Studio',
      badge: '(Pilot Studio Member)',
      avatar: '/products/reviewer-priya.jpg',
      text: 'The One Link delivery experience feels ultra premium. Clients get a gorgeous personalized presentation without confusing logins or cumbersome zip file transfers.'
    },
    {
      name: 'Liam Gallagher',
      studio: 'Apex Wedding Media',
      badge: '(Early Studio Partner)',
      avatar: '/products/reviewer-liam.jpg',
      text: 'Direct camera ingest with checksum verification and automated directory structures saved our assistants hours of tedious manual card dumps after long 14-hour shoot days.'
    }
  ];

  return (
    <>
      {/* ======================================================================
          1. STUDIO HIGHLIGHTS (PIXIESET STATS & PRODUCT HIGHLIGHTS SECTION)
          ====================================================================== */}
      <section className="ms-highlights-section" id="highlights">
        <div className="ms-highlights-container">
          <div className="ms-highlights-left">
            <div className="ms-highlights-eyebrow">
              STUDIO HIGHLIGHTS
            </div>
            <h2 className="ms-highlights-heading">
              Everything your studio needs. <span className="ms-highlights-blue">In one place.</span>
            </h2>
            <p className="ms-highlights-desc">
              Manage your wedding studio from one workspace, with tools to organize bookings, manage creative workflows, track billing, and control expenses.
            </p>
          </div>

          <div className="ms-highlights-features-grid">
            <div className="ms-feature-cell ms-feature-tl">
              <span className="ms-feature-badge">01</span>
              <h3 className="ms-feature-title">Bookings</h3>
              <p className="ms-feature-desc">
                Manage clients, wedding events, shoot schedules, and booking details.
              </p>
            </div>

            <div className="ms-feature-cell ms-feature-tr">
              <span className="ms-feature-badge">02</span>
              <h3 className="ms-feature-title">Modules</h3>
              <p className="ms-feature-desc">
                Handle galleries, album selections, guest photo AI, song selections, and camera ingest.
              </p>
            </div>

            <div className="ms-feature-cell ms-feature-bl">
              <span className="ms-feature-badge">03</span>
              <h3 className="ms-feature-title">Invoices &amp; Billing</h3>
              <p className="ms-feature-desc">
                Keep track of client invoices, payments, and outstanding balances.
              </p>
            </div>

            <div className="ms-feature-cell ms-feature-br">
              <span className="ms-feature-badge">04</span>
              <h3 className="ms-feature-title">Studio Expenses</h3>
              <p className="ms-feature-desc">
                Record and organize your studio’s business expenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          2. TESTIMONIALS (6 CARDS IN 3x2 GRID)
          ====================================================================== */}
      <section className="ms-testimonials-section" id="testimonials">
        <div className="ms-testimonials-header">
          <div className="ms-testimonials-eyebrow">
            TESTIMONIALS
          </div>
          <h2 className="ms-testimonials-title">
            Loved by wedding photographers.
          </h2>
          <p className="ms-testimonials-subtitle">
            Early feedback from wedding photographers and studio owners testing ManageStudio 1.5.
          </p>
        </div>

        <div className="ms-testimonials-container">
          <div className="ms-testimonials-grid">
            {testimonials.map((item, index) => (
              <div className="ms-testimonial-card" key={index}>
                <div className="ms-testimonial-top">
                  <div className="ms-stars-row">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="ms-testimonial-text">
                    "{item.text}"
                  </p>
                </div>

                <div className="ms-testimonial-author">
                  <div className="ms-avatar-circle">
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      className="ms-avatar-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="ms-author-details">
                    <div className="ms-author-name">{item.name}</div>
                    <div className="ms-author-studio">
                      <span>{item.studio}</span>
                    </div>
                    <div>
                      <span className="ms-placeholder-badge">{item.badge}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. FOOTER (NEAR BLACK #0A0D12)
          ====================================================================== */}
      <footer className="ms-footer-section">
        <div className="ms-footer-container">
          <div className="ms-footer-main">
            {/* Left Column: Logo, Description & Socials */}
            <div className="ms-footer-brand">
              <a href="/" className="ms-footer-logo-link" aria-label="ManageStudio Home">
                <img 
                  src="/managestudio-logo-white.png" 
                  alt="ManageStudio" 
                  className="ms-footer-logo-img" 
                />
              </a>
              <p className="ms-footer-tagline">
                The all-in-one studio management platform designed for wedding photographers and filmmakers. Powerful tools to organize, deliver, and grow.
              </p>
              <div className="ms-footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ms-social-icon" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="ms-social-icon" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/managestudio" target="_blank" rel="noopener noreferrer" className="ms-social-icon" aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ms-social-icon" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side: Link Columns */}
            <div className="ms-footer-links-grid">
              {/* Column 1: Modules */}
              <div className="ms-footer-col">
                <div className="ms-footer-col-title">Modules</div>
                <ul className="ms-footer-links-list">
                  <li><a href="#booking" className="ms-footer-link">Booking</a></li>
                  <li><a href="#album-selection" className="ms-footer-link">Album Selection</a></li>
                  <li><a href="#guest-ai" className="ms-footer-link">Guest Photo AI</a></li>
                  <li><a href="#song-selection" className="ms-footer-link">Song Selection</a></li>
                  <li><a href="#camera-ingest" className="ms-footer-link">Camera Ingest</a></li>
                  <li><a href="#gallery" className="ms-footer-link">Client Gallery</a></li>
                </ul>
              </div>

              {/* Column 2: Company */}
              <div className="ms-footer-col">
                <div className="ms-footer-col-title">Company</div>
                <ul className="ms-footer-links-list">
                  <li>
                    <button 
                      type="button" 
                      className="ms-footer-link"
                      onClick={onAbout}
                    >
                      About ManageStudio
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className="ms-footer-link"
                      onClick={onContact}
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className="ms-footer-link"
                      onClick={onLogin}
                    >
                      Log In
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright and Legal */}
          <div className="ms-footer-bottom">
            <div>
              © 2026 ManageStudio.io. All rights reserved. Built for wedding photography studios.
            </div>
            <div className="ms-footer-bottom-links">
              <button 
                type="button" 
                className="ms-footer-bottom-link" 
                onClick={() => onLegal && onLegal('Privacy Policy')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Privacy Policy
              </button>
              <button 
                type="button" 
                className="ms-footer-bottom-link" 
                onClick={() => onLegal && onLegal('Terms of Service')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Terms of Service
              </button>
              <button 
                type="button" 
                className="ms-footer-bottom-link" 
                onClick={() => onLegal && onLegal('Security')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Security
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
