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
          3. FINAL CALL TO ACTION (CENTERED WITH LARGE SHOWCASE IMAGE)
          ====================================================================== */}
      {/* ======================================================================
          3. FINAL CALL TO ACTION (CENTERED WITH 3-DEVICE OVERLAPPING SHOWCASE)
          ====================================================================== */}
      <section className="ms-final-cta-section" id="get-started-cta">
        <div className="ms-cta-content-wrapper">
          <h2 className="ms-cta-headline">
            Everything your studio needs. In one place.
          </h2>
          <p className="ms-cta-description">
            Manage bookings, track payments, and deliver a seamless wedding studio experience.
          </p>
          <div className="ms-cta-btn-box">
            <button 
              type="button" 
              className="ms-cta-button"
              onClick={onGetStarted}
            >
              Get Started
            </button>
          </div>

          {/* 3-Device Overlapping Showcase Composition */}
          <div className="ms-trio-showcase-wrapper">
            <div className="ms-trio-showcase-container">
              {/* 1. Center Card: ManageStudio Desktop Dashboard */}
              <div className="ms-trio-desktop-window">
                {/* Desktop Chrome Bar */}
                <div className="ms-trio-desktop-chrome">
                  <div className="ms-trio-chrome-dots">
                    <span className="ms-chrome-dot ms-dot-red" />
                    <span className="ms-chrome-dot ms-dot-yellow" />
                    <span className="ms-chrome-dot ms-dot-green" />
                  </div>
                  <div className="ms-trio-chrome-brand">
                    <img 
                      src="/managestudio-logo-black.png" 
                      alt="ManageStudio" 
                      className="ms-trio-logo-black"
                    />
                  </div>
                  <div className="ms-trio-chrome-title">
                    <span className="ms-chrome-title-bold">Dashboard</span>
                    <span className="ms-chrome-title-sub">— Live wedding productions, couple shoots &amp; media selections</span>
                  </div>
                  <div className="ms-trio-chrome-search">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Search bookings, clients, songs...</span>
                  </div>
                  <div className="ms-trio-chrome-actions">
                    <button 
                      type="button" 
                      className="ms-trio-new-booking-btn"
                      onClick={() => onMockupAction && onMockupAction('Interactive Demo: "New Booking" wizard opened')}
                    >
                      <span>+ New Booking</span>
                    </button>
                    <button type="button" className="ms-trio-bell-btn" aria-label="Notifications">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                      <span className="ms-trio-bell-dot" />
                    </button>
                    <div className="ms-trio-avatar-badge">S</div>
                  </div>
                </div>

                {/* Desktop Workspace Body */}
                <div className="ms-trio-desktop-body">
                  {/* Left Sidebar */}
                  <aside className="ms-trio-desktop-sidebar">
                    <div className="ms-trio-sidebar-nav-label">STUDIO NAVIGATION</div>
                    
                    <div className="ms-trio-nav-link ms-trio-nav-active">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span>Dashboard</span>
                    </div>

                    <div className="ms-trio-nav-link">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Bookings</span>
                      <span className="ms-trio-count-pill">8</span>
                    </div>

                    {/* Modules Accordion */}
                    <div className="ms-trio-modules-group">
                      <div className="ms-trio-modules-header">
                        <div className="ms-trio-modules-header-left">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                          </svg>
                          <span>Modules</span>
                        </div>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>

                      <div className="ms-trio-subnav-list">
                        <div className="ms-trio-subnav-item">
                          <span>1. Gallery</span>
                          <span className="ms-trio-count-pill">1</span>
                        </div>
                        <div className="ms-trio-subnav-item">
                          <span>2. Album Selection</span>
                          <span className="ms-trio-count-pill">1</span>
                        </div>
                        <div className="ms-trio-subnav-item">
                          <span>3. Guest Photo AI</span>
                          <span className="ms-trio-count-pill ms-pill-ai">AI</span>
                        </div>
                        <div className="ms-trio-subnav-item">
                          <span>4. Song Selection</span>
                          <span className="ms-trio-count-pill">4</span>
                        </div>
                        <div className="ms-trio-subnav-item">
                          <span>5. Camera Ingest</span>
                          <span className="ms-trio-count-pill ms-pill-ftp">FTP</span>
                        </div>
                      </div>
                    </div>

                    <div className="ms-trio-nav-link">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <span>Invoices &amp; Billing</span>
                      <span className="ms-trio-count-pill">14</span>
                    </div>

                    <div className="ms-trio-nav-link">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                        <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                        <line x1="18" y1="12" x2="18" y2="16" />
                      </svg>
                      <span>Studio Expenses</span>
                    </div>

                    <div className="ms-trio-nav-link">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span>Subscription</span>
                    </div>

                    <div className="ms-trio-nav-link">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>Settings</span>
                    </div>

                    {/* Bottom User Card */}
                    <div className="ms-trio-sidebar-footer">
                      <div className="ms-trio-user-profile">
                        <img 
                          src="/showcase/reviewer-aarav.jpg" 
                          alt="Sadiq" 
                          className="ms-trio-user-avatar"
                        />
                        <div className="ms-trio-user-meta">
                          <span className="ms-trio-user-name">SD STUDIO</span>
                          <span className="ms-trio-user-role">Sadiq</span>
                        </div>
                      </div>
                      <button type="button" className="ms-trio-user-switch-btn" aria-label="Switch studio">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </aside>

                  {/* Main Work Area */}
                  <main className="ms-trio-desktop-main">
                    {/* Hero Banner Card */}
                    <div className="ms-trio-hero-banner">
                      <div className="ms-trio-banner-bg-wrap">
                        <img 
                          src="/showcase/silk-rings-bg.jpg" 
                          alt="Golden wedding rings on luxury silk" 
                          className="ms-trio-banner-rings-img"
                        />
                        <div className="ms-trio-banner-gradient-fade" />
                      </div>

                      <div className="ms-trio-banner-content">
                        <div className="ms-trio-banner-eyebrow">
                          ALL-IN-ONE SOLUTION FOR WEDDING STUDIOS
                        </div>
                        <h2 className="ms-trio-banner-headline">
                          Manage.<br />
                          Deliver.<br />
                          <span className="ms-headline-gold">Grow.</span>
                        </h2>
                        <p className="ms-trio-banner-desc">
                          ManageStudio is the complete software solution for modern wedding photography and cinematography studios.
                        </p>
                        <div className="ms-trio-banner-ctas">
                          <button 
                            type="button" 
                            className="ms-trio-banner-primary-btn"
                            onClick={() => onMockupAction && onMockupAction('Interactive Demo: "New Booking" wizard opened')}
                          >
                            <span>+ New Booking</span>
                          </button>
                          <button 
                            type="button" 
                            className="ms-trio-banner-sec-btn"
                            onClick={() => onMockupAction && onMockupAction('Interactive Demo: Shoot Calendar opened')}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>Shoot Calendar</span>
                          </button>
                        </div>
                      </div>

                      {/* Next 1 Shoot Floating Widget */}
                      <div className="ms-trio-next-shoot-card">
                        <div className="ms-trio-next-shoot-header">
                          <span className="ms-next-shoot-label">NEXT 1 SHOOT</span>
                          <span className="ms-next-shoot-badge">✓ Confirmed</span>
                        </div>
                        <div className="ms-next-shoot-client">shaik sadiq</div>
                        <div className="ms-next-shoot-meta-row">
                          <div className="ms-next-shoot-city">
                            <span className="ms-city-dot" />
                            <span>Hyderabad</span>
                          </div>
                          <div className="ms-next-shoot-icons">
                            <span>1</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                          </div>
                        </div>
                        <div className="ms-next-shoot-footer">
                          <div className="ms-next-shoot-date-box">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span className="ms-date-number">25</span>
                          </div>
                          <a href="#shoot-details" className="ms-next-shoot-details-link" onClick={(e) => { e.preventDefault(); onMockupAction && onMockupAction('Interactive Demo: Shaik Sadiq shoot details'); }}>
                            <span>Details &gt;</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Shoot Calendar & Schedule Section */}
                    <div className="ms-trio-calendar-card">
                      <div className="ms-trio-calendar-header">
                        <div className="ms-trio-calendar-title-wrap">
                          <div className="ms-trio-cal-heading-row">
                            <h3 className="ms-trio-cal-title">Shoot Calendar &amp; Schedule</h3>
                            <span className="ms-trio-cal-events-badge">8 Events</span>
                          </div>
                          <p className="ms-trio-cal-sub">Live wedding shoot dates, times, and venue crew schedule.</p>
                        </div>
                        <div className="ms-trio-cal-controls">
                          <div className="ms-trio-cal-nav-arrows">
                            <button type="button" className="ms-cal-arrow-btn" aria-label="Previous month">&lt;</button>
                            <button type="button" className="ms-cal-arrow-btn" aria-label="Next month">&gt;</button>
                          </div>
                          <div className="ms-trio-cal-month-select">
                            <span>October 2026</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                          </div>
                          <button type="button" className="ms-cal-today-btn">Today</button>
                          <button 
                            type="button" 
                            className="ms-cal-add-shoot-btn"
                            onClick={() => onMockupAction && onMockupAction('Interactive Demo: "Add Shoot" dialog opened')}
                          >
                            <span>+ Add Shoot</span>
                          </button>
                        </div>
                      </div>

                      {/* Calendar Grid Table */}
                      <div className="ms-trio-calendar-table">
                        <div className="ms-trio-cal-weekdays">
                          <span>SUN</span>
                          <span>MON</span>
                          <span>TUE</span>
                          <span>WED</span>
                          <span>THU</span>
                          <span>FRI</span>
                          <span>SAT</span>
                        </div>

                        {/* Calendar Day Rows */}
                        <div className="ms-trio-cal-days-grid">
                          {/* Row 1 */}
                          <div className="ms-cal-cell ms-cell-past"><span className="ms-cal-date-num">27</span></div>
                          <div className="ms-cal-cell ms-cell-past"><span className="ms-cal-date-num">28</span></div>
                          <div className="ms-cal-cell ms-cell-past"><span className="ms-cal-date-num">29</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num">30</span>
                            <div className="ms-cal-event-pill ms-event-cream-amber">
                              <span className="ms-event-name">Ayesha &amp; Sameer</span>
                              <span className="ms-event-tag">Pre-Wedding</span>
                              <span className="ms-event-time">10:00 AM • Hitech City</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">1</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-red">2</span>
                            <div className="ms-cal-event-pill ms-event-soft-red">
                              <span className="ms-event-name">Imran &amp; Sara</span>
                              <span className="ms-event-tag">Wedding</span>
                              <span className="ms-event-time">9:00 AM • Falaknuma</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">3</span></div>

                          {/* Row 2 */}
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">4</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-red">5</span>
                            <div className="ms-cal-event-pill ms-event-soft-red">
                              <span className="ms-event-name">Rehan &amp; Zoya</span>
                              <span className="ms-event-tag">Couple Shoot</span>
                              <span className="ms-event-time">4:00 PM • Necklace Road</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">6</span></div>
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">7</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-green">8</span>
                            <div className="ms-cal-event-pill ms-event-mint-green">
                              <span className="ms-event-name">Studio Meeting</span>
                              <span className="ms-event-tag">Team Discussion</span>
                              <span className="ms-event-time">11:00 AM • Office</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">9</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-purple">10</span>
                            <div className="ms-cal-event-pill ms-event-indigo-purple">
                              <span className="ms-event-name">Sania &amp; Faiz</span>
                              <span className="ms-event-tag">Wedding</span>
                              <span className="ms-event-time">7:00 PM • Taj Krishna</span>
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">11</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-blue">12</span>
                            <div className="ms-cal-event-pill ms-event-soft-blue">
                              <span className="ms-event-name">Ahmed &amp; Noor</span>
                              <span className="ms-event-tag">Engagement</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-amber">13</span>
                            <div className="ms-cal-event-pill ms-event-soft-amber">
                              <span className="ms-event-name">Content Shoot</span>
                              <span className="ms-event-tag">Studio Promo</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-purple">14</span>
                            <div className="ms-cal-event-pill ms-event-soft-purple">
                              <span className="ms-event-name">Ali &amp; Hina</span>
                              <span className="ms-event-tag">Reception</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-cyan">15</span>
                            <div className="ms-cal-event-pill ms-event-soft-cyan">
                              <span className="ms-event-name">Edit Delivery</span>
                              <span className="ms-event-tag">Client Review</span>
                            </div>
                          </div>
                          <div className="ms-cal-cell"><span className="ms-cal-date-num">16</span></div>
                          <div className="ms-cal-cell ms-cell-active">
                            <span className="ms-cal-date-num ms-date-gold">17</span>
                            <div className="ms-cal-event-pill ms-event-soft-gold">
                              <span className="ms-event-name">Zahid &amp; Khadija</span>
                              <span className="ms-event-tag">Wedding</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>

              {/* 2. Left Screen: Phone Screen (Song Selection Mobile UI) */}
              <div className="ms-trio-phone-mockup">
                <div className="ms-phone-outer-chassis">
                  {/* Dynamic Island & Speaker */}
                  <div className="ms-phone-dynamic-island" />

                  {/* Status Bar */}
                  <div className="ms-phone-status-bar">
                    <span className="ms-phone-clock">14:44</span>
                    <div className="ms-phone-status-icons">
                      <svg width="11" height="9" viewBox="0 0 17 11" fill="currentColor">
                        <path d="M1 9h2v2H1V9zm4-3h2v5H5V6zm4-3h2v8H9V3zm4-3h2v11h-2V0z" />
                      </svg>
                      <svg width="10" height="8" viewBox="0 0 16 12" fill="currentColor">
                        <path d="M8 2c2.8 0 5.3 1.1 7.1 2.9l-1.4 1.4C12.3 4.9 10.3 4 8 4s-4.3.9-5.7 2.3L.9 4.9C2.7 3.1 5.2 2 8 2zm0 4c1.7 0 3.2.7 4.2 1.8l-1.4 1.4c-.7-.7-1.7-1.2-2.8-1.2s-2.1.5-2.8 1.2L3.8 7.8C4.8 6.7 6.3 6 8 6zm0 4c.8 0 1.5.3 2.1.9L8 13 5.9 10.9c.6-.6 1.3-.9 2.1-.9z" />
                      </svg>
                      <div className="ms-phone-battery">
                        <div className="ms-phone-battery-fill" />
                      </div>
                    </div>
                  </div>

                  {/* Phone Header Navigation */}
                  <div className="ms-phone-header-row">
                    <button type="button" className="ms-phone-back-btn" aria-label="Go back">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <div className="ms-phone-client-chip">
                      <span>Kayadu Lohar | Kayadu Lohar We...</span>
                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className="ms-phone-content-body">
                    <div className="ms-phone-title-row">
                      <h4 className="ms-phone-heading">Song Selection</h4>
                      <div className="ms-phone-moments-pill">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ms-sparkle-icon">
                          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                        </svg>
                        <span>0 Moments Added</span>
                      </div>
                    </div>

                    {/* Instruction Callout */}
                    <div className="ms-phone-instruction-box">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="ms-instruction-link-icon">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <div className="ms-phone-instruction-text">
                        <strong>Instruction:</strong> Paste YouTube, Spotify or any song link.
                      </div>
                    </div>

                    {/* Song Cards List */}
                    <div className="ms-phone-song-cards">
                      {/* Song 1 */}
                      <div className="ms-phone-song-card">
                        <div className="ms-song-card-top">
                          <div className="ms-song-card-icon ms-song-icon-gold">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M9 18V5l12-2v13" />
                              <circle cx="6" cy="18" r="3" />
                              <circle cx="18" cy="16" r="3" />
                            </svg>
                          </div>
                          <div className="ms-song-card-info">
                            <div className="ms-song-card-title-row">
                              <span className="ms-song-num">01</span>
                              <span className="ms-song-title">Entry Song</span>
                            </div>
                            <span className="ms-song-sub">Grand &amp; Celebratory Opening</span>
                          </div>
                          <span className="ms-song-badge-not-added">Not Added</span>
                        </div>
                        <div className="ms-song-input-row">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                          <span className="ms-song-input-placeholder">Paste YouTube, Spotify or any song link...</span>
                        </div>
                        <button type="button" className="ms-song-paste-btn">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                          </svg>
                          <span>Paste Link</span>
                        </button>
                      </div>

                      {/* Song 2 */}
                      <div className="ms-phone-song-card">
                        <div className="ms-song-card-top">
                          <div className="ms-song-card-icon ms-song-icon-pink">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </div>
                          <div className="ms-song-card-info">
                            <div className="ms-song-card-title-row">
                              <span className="ms-song-num">02</span>
                              <span className="ms-song-title">Bride Entry</span>
                            </div>
                            <span className="ms-song-sub">Royal, Emotional &amp; Magical Walk</span>
                          </div>
                          <span className="ms-song-badge-not-added">Not Added</span>
                        </div>
                        <div className="ms-song-input-row">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                          <span className="ms-song-input-placeholder">Paste YouTube, Spotify or any song link...</span>
                        </div>
                        <button type="button" className="ms-song-paste-btn">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                          </svg>
                          <span>Paste Link</span>
                        </button>
                      </div>

                      {/* Song 3 */}
                      <div className="ms-phone-song-card">
                        <div className="ms-song-card-top">
                          <div className="ms-song-card-icon ms-song-icon-amber">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                          </div>
                          <div className="ms-song-card-info">
                            <div className="ms-song-card-title-row">
                              <span className="ms-song-num">03</span>
                              <span className="ms-song-title">Groom Entry</span>
                            </div>
                            <span className="ms-song-sub">High Energy, Swag &amp; Celebration</span>
                          </div>
                          <span className="ms-song-badge-not-added">Not Added</span>
                        </div>
                        <div className="ms-song-input-row">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                          <span className="ms-song-input-placeholder">Paste YouTube, Spotify or any song link...</span>
                        </div>
                        <button type="button" className="ms-song-paste-btn">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                          </svg>
                          <span>Paste Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Submit Action */}
                    <div className="ms-phone-submit-section">
                      <button 
                        type="button" 
                        className="ms-phone-submit-btn"
                        onClick={() => onMockupAction && onMockupAction('Interactive Demo: Song selection submitted')}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        <span>Submit My Song Selection</span>
                      </button>
                      <div className="ms-phone-submit-note">
                        Note: Customer can return later and update/add links
                      </div>
                    </div>
                  </div>

                  {/* iOS Home Indicator */}
                  <div className="ms-phone-home-indicator" />
                </div>
              </div>

              {/* 3. Right Screen: Tablet Screen (ManageStudio Client Gallery) */}
              <div className="ms-trio-tablet-mockup">
                <div className="ms-tablet-outer-chassis">
                  {/* Tablet Top Header Bar */}
                  <div className="ms-tablet-header-bar">
                    <div className="ms-tablet-brand">
                      <img 
                        src="/managestudio-logo-white.png" 
                        alt="ManageStudio" 
                        className="ms-tablet-logo-white"
                      />
                    </div>
                    <div className="ms-tablet-header-actions">
                      <button 
                        type="button" 
                        className="ms-tablet-download-btn"
                        onClick={() => onMockupAction && onMockupAction('Interactive Demo: Download selected album photos')}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download Selected</span>
                      </button>
                      <button type="button" className="ms-tablet-share-btn" aria-label="Share album">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Hero Cover Image & Couple Name */}
                  <div className="ms-tablet-hero-cover">
                    <img 
                      src="/showcase/gallery-bride-cover.jpg" 
                      alt="Ayesha &amp; Sameer Wedding Album" 
                      className="ms-tablet-cover-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="ms-tablet-cover-gradient" />
                    <div className="ms-tablet-cover-meta">
                      <h4 className="ms-tablet-couple-name">Ayesha &amp; Sameer</h4>
                      <p className="ms-tablet-album-subtitle">Wedding Album • 2,846 Photos</p>
                    </div>
                  </div>

                  {/* Gallery Navigation Tabs */}
                  <div className="ms-tablet-tabs-row">
                    <button type="button" className="ms-tablet-tab ms-tablet-tab-active">
                      <span>Albums</span>
                      <span className="ms-tablet-tab-indicator" />
                    </button>
                    <button type="button" className="ms-tablet-tab">
                      <span>Photos</span>
                    </button>
                    <button type="button" className="ms-tablet-tab">
                      <span>Videos</span>
                    </button>
                  </div>

                  {/* 2x2 Album Cards Grid */}
                  <div className="ms-tablet-albums-grid">
                    {/* Card 1: Wedding Day */}
                    <div 
                      className="ms-tablet-album-card"
                      onClick={() => onMockupAction && onMockupAction('Interactive Demo: Wedding Day album selected')}
                    >
                      <div className="ms-tablet-thumb-wrap">
                        <img 
                          src="/showcase/album-wedding-day.jpg" 
                          alt="Wedding Day floral mandap ceremony" 
                          className="ms-tablet-album-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.pexels.com/photos/33417236/pexels-photo-33417236.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                      </div>
                      <div className="ms-tablet-album-footer">
                        <div className="ms-tablet-album-info">
                          <span className="ms-tablet-album-title">Wedding Day</span>
                          <span className="ms-tablet-album-count">642 Photos</span>
                        </div>
                        <span className="ms-tablet-card-arrow">→</span>
                      </div>
                    </div>

                    {/* Card 2: Haldi */}
                    <div 
                      className="ms-tablet-album-card"
                      onClick={() => onMockupAction && onMockupAction('Interactive Demo: Haldi album selected')}
                    >
                      <div className="ms-tablet-thumb-wrap">
                        <img 
                          src="/showcase/album-haldi.jpg" 
                          alt="Haldi yellow ceremony celebration" 
                          className="ms-tablet-album-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                      </div>
                      <div className="ms-tablet-album-footer">
                        <div className="ms-tablet-album-info">
                          <span className="ms-tablet-album-title">Haldi</span>
                          <span className="ms-tablet-album-count">320 Photos</span>
                        </div>
                        <span className="ms-tablet-card-arrow">→</span>
                      </div>
                    </div>

                    {/* Card 3: Mehendi */}
                    <div 
                      className="ms-tablet-album-card"
                      onClick={() => onMockupAction && onMockupAction('Interactive Demo: Mehendi album selected')}
                    >
                      <div className="ms-tablet-thumb-wrap">
                        <img 
                          src="/showcase/album-mehendi.jpg" 
                          alt="Mehendi intricate henna hands ceremony" 
                          className="ms-tablet-album-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.pexels.com/photos/30497750/pexels-photo-30497750.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                      </div>
                      <div className="ms-tablet-album-footer">
                        <div className="ms-tablet-album-info">
                          <span className="ms-tablet-album-title">Mehendi</span>
                          <span className="ms-tablet-album-count">416 Photos</span>
                        </div>
                        <span className="ms-tablet-card-arrow">→</span>
                      </div>
                    </div>

                    {/* Card 4: Sangeet */}
                    <div 
                      className="ms-tablet-album-card"
                      onClick={() => onMockupAction && onMockupAction('Interactive Demo: Sangeet dance celebration')}
                    >
                      <div className="ms-tablet-thumb-wrap">
                        <img 
                          src="/showcase/album-sangeet.jpg" 
                          alt="Sangeet vibrant dance celebration" 
                          className="ms-tablet-album-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.pexels.com/photos/35328204/pexels-photo-35328204.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                      </div>
                      <div className="ms-tablet-album-footer">
                        <div className="ms-tablet-album-info">
                          <span className="ms-tablet-album-title">Sangeet</span>
                          <span className="ms-tablet-album-count">380 Photos</span>
                        </div>
                        <span className="ms-tablet-card-arrow">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          4. FOOTER (NEAR BLACK #0A0D12 MATCHING PIXIESET PROPORTIONS)
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
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                    >
                      About ManageStudio
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className="ms-footer-link"
                      onClick={onContact}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <a 
                      href="https://app.managestudio.io/" 
                      className="ms-footer-link"
                      onClick={(e) => {
                        if (onLogin) {
                          e.preventDefault();
                          onLogin();
                        }
                      }}
                    >
                      Log In
                    </a>
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
