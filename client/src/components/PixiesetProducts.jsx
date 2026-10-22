import React, { useState, useRef, useEffect } from 'react';
import './PixiesetProducts.css';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Send,
  MoreVertical
} from 'lucide-react';

export default function PixiesetProducts() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState('Shaadi');
  const dropdownTimerRef = useRef(null);

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    dropdownTimerRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  const handleItemClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setDropdownOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pixieset-page-wrapper">
      {/* --------------------------------------------------------------------------
          1. HEADER / NAVBAR (Exact Pixieset layout with ManageStudio logo)
          -------------------------------------------------------------------------- */}
      <header className="pixieset-nav-header">
        <div className="pixieset-nav-inner">
          {/* Logo on Left */}
          <a href="/" className="pixieset-brand-logo" aria-label="ManageStudio Home">
            <img 
              src="/managestudio-logo-black.png" 
              alt="ManageStudio" 
              className="pixieset-brand-logo-img" 
            />
          </a>

          {/* Center Links */}
          <nav className="pixieset-nav-center" aria-label="Main Navigation">
            <div 
              className="pixieset-nav-dropdown-trigger"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                type="button" 
                className="pixieset-nav-link"
                onClick={() => {
                  if (dropdownOpen) {
                    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
                    setDropdownOpen(false);
                  } else {
                    handleDropdownEnter();
                  }
                }}
                aria-expanded={dropdownOpen}
              >
                <span>Products</span>
                <svg 
                  className={`pixieset-dropdown-chevron ${dropdownOpen ? 'open' : ''}`}
                  width="10" 
                  height="10" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {dropdownOpen && (
                <div 
                  className="pixieset-nav-dropdown-menu"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <a href="#booking" role="button" className="pixieset-dropdown-item" onClick={(e) => handleItemClick(e, 'booking')}>
                    Booking
                  </a>
                  <a href="#album-selection" role="button" className="pixieset-dropdown-item" onClick={(e) => handleItemClick(e, 'album-selection')}>
                    Album Selection
                  </a>
                  <a href="#guest-ai" role="button" className="pixieset-dropdown-item" onClick={(e) => handleItemClick(e, 'guest-ai')}>
                    Guest Photo AI
                  </a>
                  <a href="#song-selection" role="button" className="pixieset-dropdown-item" onClick={(e) => handleItemClick(e, 'song-selection')}>
                    Song Selection
                  </a>
                  <a href="#camera-ingest" role="button" className="pixieset-dropdown-item" onClick={(e) => handleItemClick(e, 'camera-ingest')}>
                    Camera Ingest
                  </a>
                </div>
              )}
            </div>

            <a href="#pricing" className="pixieset-nav-link">Pricing</a>
          </nav>

          {/* Right Actions */}
          <div className="pixieset-nav-actions">
            <a 
              href="/#login" 
              className="pixieset-login-link"
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.hash = '#login'; 
              }}
            >
              Log In
            </a>
            <a 
              href="https://github.com/Codenamesadiq/managestudio1.5/releases/download/Managestudio1.5/ManageStudio-Setup.exe" 
              className="pixieset-get-started-btn"
              download="ManageStudio-Setup.exe"
              target="_self"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              Download
            </a>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------------
          2. HERO SECTION
          -------------------------------------------------------------------------- */}
      <section className="pixieset-hero-section">
        <div className="pixieset-hero-eyebrow">
          ALL IN ONE PLATFORM
        </div>
        <h1 className="pixieset-hero-headline">
          Everything you need. All in one place.
        </h1>
        <p className="pixieset-hero-subtitle">
          A complete suite of tools to manage your wedding photography studio. Powerful on their own. Magical together.
        </p>
      </section>

      {/* --------------------------------------------------------------------------
          3. FEATURE CARDS GRID (Exact Pixieset layout: 1 full-width + 4 two-column cards)
          -------------------------------------------------------------------------- */}
      <main className="pixieset-products-container">
        <div className="pixieset-products-grid">
          
          {/* ====================================================================
              CARD 1: BOOKING (Full Width Spanning 2 Columns)
              ==================================================================== */}
          <div className="pixieset-card card-booking" id="booking">
            <div className="pixieset-card-header">
              <div className="pixieset-card-title-row">
                <div className="pixieset-card-icon" style={{ background: '#00B69B' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h2 className="pixieset-card-title">Booking</h2>
              </div>
              <p className="pixieset-card-desc">
                Manage client bookings, shoot schedules, payments, and the complete wedding workflow with automated client reminders.
              </p>
              <a href="#booking" className="pixieset-card-link">
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="pixieset-card-visual">
              <div className="ms-booking-mockup">
                {/* 1. Top Controls Bar: Tabs on left, Search & + New Booking on right */}
                <div className="ms-bk-topbar">
                  <div className="ms-bk-tabs">
                    <button type="button" className="ms-bk-tab active">
                      Bookings (24)
                    </button>
                    <button type="button" className="ms-bk-tab">
                      Schedule
                    </button>
                    <button type="button" className="ms-bk-tab">
                      Payments
                    </button>
                    <button type="button" className="ms-bk-tab">
                      Workflow
                    </button>
                  </div>
                  <div className="ms-bk-actions">
                    <div className="ms-bk-search">
                      <Search size={13} className="ms-bk-search-icon" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        readOnly
                        aria-label="Search bookings"
                      />
                    </div>
                    <button type="button" className="ms-bk-btn-new">
                      + New Booking
                    </button>
                  </div>
                </div>

                {/* 2. 4 Metric Cards */}
                <div className="ms-bk-metrics-grid">
                  {/* Card 1: Total Bookings */}
                  <div className="ms-bk-metric-card metric-blue">
                    <div className="ms-bk-metric-icon-box">
                      <Calendar size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">24</span>
                      <span className="ms-bk-metric-label">Total Bookings</span>
                    </div>
                  </div>

                  {/* Card 2: Confirmed */}
                  <div className="ms-bk-metric-card metric-green">
                    <div className="ms-bk-metric-icon-box">
                      <CheckCircle2 size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">18</span>
                      <span className="ms-bk-metric-label">Confirmed</span>
                    </div>
                  </div>

                  {/* Card 3: Pending */}
                  <div className="ms-bk-metric-card metric-amber">
                    <div className="ms-bk-metric-icon-box">
                      <Clock size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">4</span>
                      <span className="ms-bk-metric-label">Pending</span>
                    </div>
                  </div>

                  {/* Card 4: Needs Follow Up */}
                  <div className="ms-bk-metric-card metric-red">
                    <div className="ms-bk-metric-icon-box">
                      <AlertCircle size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">2</span>
                      <span className="ms-bk-metric-label">Needs Follow Up</span>
                    </div>
                  </div>
                </div>

                {/* 3. Bookings Table */}
                <div className="ms-bk-table-container">
                  <table className="ms-bk-table">
                    <thead>
                      <tr>
                        <th className="th-check">
                          <input type="checkbox" readOnly className="ms-bk-checkbox" aria-label="Select all" />
                        </th>
                        <th>Client / Event</th>
                        <th>Event Date</th>
                        <th>Shoot Schedule</th>
                        <th>Payment</th>
                        <th>Workflow</th>
                        <th>Reminders</th>
                        <th className="th-actions">···</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1 */}
                      <tr>
                        <td className="td-check">
                          <input type="checkbox" readOnly className="ms-bk-checkbox" aria-label="Select row" />
                        </td>
                        <td>
                          <div className="ms-bk-client-cell">
                            <span className="ms-bk-avatar">SD</span>
                            <div className="ms-bk-client-meta">
                              <span className="ms-bk-client-name">Sarah & David</span>
                              <span className="ms-bk-client-sub">Full Day Coverage</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-date-meta">
                            <span className="ms-bk-date-main">Oct 24, 2026</span>
                            <span className="ms-bk-badge-urgent">2 days left</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-shoot-meta">
                            <span className="ms-bk-shoot-title">Main Shoot</span>
                            <span className="ms-bk-shoot-sub">Oct 24, 2026 · 10:00 AM</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-payment-meta">
                            <span className="ms-bk-pill pill-paid">● Paid</span>
                            <span className="ms-bk-amount">$4,500</span>
                          </div>
                        </td>
                        <td>
                          <span className="ms-bk-pill pill-editing">● Editing</span>
                        </td>
                        <td>
                          <div className="ms-bk-reminder-cell">
                            <Send size={12} className="ms-bk-reminder-icon" />
                            <div className="ms-bk-reminder-meta">
                              <span className="ms-bk-remind-title">Reminder sent</span>
                              <span className="ms-bk-remind-sub">2 days ago</span>
                            </div>
                          </div>
                        </td>
                        <td className="td-actions">
                          <button type="button" className="ms-bk-more-btn" aria-label="More actions">
                            <MoreVertical size={13} />
                          </button>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr>
                        <td className="td-check">
                          <input type="checkbox" readOnly className="ms-bk-checkbox" aria-label="Select row" />
                        </td>
                        <td>
                          <div className="ms-bk-client-cell">
                            <span className="ms-bk-avatar">PR</span>
                            <div className="ms-bk-client-meta">
                              <span className="ms-bk-client-name">Priya & Rohan</span>
                              <span className="ms-bk-client-sub">Photo + Cinema</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-date-meta">
                            <span className="ms-bk-date-main">Nov 08, 2026</span>
                            <span className="ms-bk-date-sub">15 days left</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-shoot-meta">
                            <span className="ms-bk-shoot-title">Pre-Wedding</span>
                            <span className="ms-bk-shoot-sub">Nov 06, 2026 · 5:00 PM</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-payment-meta">
                            <span className="ms-bk-pill pill-partial">● 50% Paid</span>
                            <span className="ms-bk-amount">$3,800</span>
                          </div>
                        </td>
                        <td>
                          <span className="ms-bk-pill pill-scheduled">● Shoot Scheduled</span>
                        </td>
                        <td>
                          <div className="ms-bk-reminder-cell">
                            <Send size={12} className="ms-bk-reminder-icon" />
                            <div className="ms-bk-reminder-meta">
                              <span className="ms-bk-remind-title">Reminder in 5 days</span>
                              <span className="ms-bk-remind-sub">Nov 03, 2026</span>
                            </div>
                          </div>
                        </td>
                        <td className="td-actions">
                          <button type="button" className="ms-bk-more-btn" aria-label="More actions">
                            <MoreVertical size={13} />
                          </button>
                        </td>
                      </tr>

                      {/* Row 3 */}
                      <tr>
                        <td className="td-check">
                          <input type="checkbox" readOnly className="ms-bk-checkbox" aria-label="Select row" />
                        </td>
                        <td>
                          <div className="ms-bk-client-cell">
                            <span className="ms-bk-avatar">AZ</span>
                            <div className="ms-bk-client-meta">
                              <span className="ms-bk-client-name">Ayesha & Zain</span>
                              <span className="ms-bk-client-sub">Pre-Wedding Shoot</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-date-meta">
                            <span className="ms-bk-date-main">Dec 02, 2026</span>
                            <span className="ms-bk-date-sub">39 days left</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-shoot-meta">
                            <span className="ms-bk-shoot-title">Pre-Wedding</span>
                            <span className="ms-bk-shoot-sub">Dec 02, 2026 · 6:00 AM</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-payment-meta">
                            <span className="ms-bk-pill pill-pending">● Pending</span>
                            <span className="ms-bk-amount">$2,400</span>
                          </div>
                        </td>
                        <td>
                          <span className="ms-bk-pill pill-planning">● Planning</span>
                        </td>
                        <td>
                          <div className="ms-bk-reminder-cell">
                            <Send size={12} className="ms-bk-reminder-icon" />
                            <div className="ms-bk-reminder-meta">
                              <span className="ms-bk-remind-title">Reminder sent</span>
                              <span className="ms-bk-remind-sub">1 week ago</span>
                            </div>
                          </div>
                        </td>
                        <td className="td-actions">
                          <button type="button" className="ms-bk-more-btn" aria-label="More actions">
                            <MoreVertical size={13} />
                          </button>
                        </td>
                      </tr>

                      {/* Row 4 */}
                      <tr>
                        <td className="td-check">
                          <input type="checkbox" readOnly className="ms-bk-checkbox" aria-label="Select row" />
                        </td>
                        <td>
                          <div className="ms-bk-client-cell">
                            <span className="ms-bk-avatar">AK</span>
                            <div className="ms-bk-client-meta">
                              <span className="ms-bk-client-name">Alia & Kabir</span>
                              <span className="ms-bk-client-sub">Grand Ballroom</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-date-meta">
                            <span className="ms-bk-date-main">Dec 18, 2026</span>
                            <span className="ms-bk-date-sub">55 days left</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-shoot-meta">
                            <span className="ms-bk-shoot-title">Main Shoot</span>
                            <span className="ms-bk-shoot-sub">Dec 18, 2026 · 11:00 AM</span>
                          </div>
                        </td>
                        <td>
                          <div className="ms-bk-payment-meta">
                            <span className="ms-bk-pill pill-paid">● Paid</span>
                            <span className="ms-bk-amount">$5,200</span>
                          </div>
                        </td>
                        <td>
                          <span className="ms-bk-pill pill-active">● Active Workflow</span>
                        </td>
                        <td>
                          <div className="ms-bk-reminder-cell">
                            <Send size={12} className="ms-bk-reminder-icon" />
                            <div className="ms-bk-reminder-meta">
                              <span className="ms-bk-remind-title">Reminder in 10 days</span>
                              <span className="ms-bk-remind-sub">Dec 08, 2026</span>
                            </div>
                          </div>
                        </td>
                        <td className="td-actions">
                          <button type="button" className="ms-bk-more-btn" aria-label="More actions">
                            <MoreVertical size={13} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
              CARD 2: ALBUM SELECTION (Row 2, Left)
              ==================================================================== */}
          <div className="pixieset-card card-square" id="album-selection">
            <div className="pixieset-card-header">
              <div className="pixieset-card-title-row">
                <div className="pixieset-card-icon" style={{ background: '#1ABC9C' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <h2 className="pixieset-card-title">Album Selection</h2>
              </div>
              <p className="pixieset-card-desc">
                Clients select their favourite wedding photos for printed albums, solving the challenge of choosing the best images.
              </p>
              <a href="#album-selection" className="pixieset-card-link">
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="pixieset-card-visual">
              <div className="album-selection-mockup">
                <div className="album-selection-bar">
                  <div className="album-counter-pill">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 8.5L6.5 12L13 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>48 / 80 Selected</span>
                  </div>
                  <button type="button" className="album-submit-btn">Submit Selection</button>
                </div>

                <div className="album-photos-grid">
                  <div className="album-photo-item selected">
                    <img src="/products/wedding-1.jpg" alt="Selected wedding photo 1" />
                    <div className="album-check-badge">
                      <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 7.5 5.5 10.5 11.5 3.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="album-photo-item selected">
                    <img src="/products/wedding-2.jpg" alt="Selected wedding photo 2" />
                    <div className="album-check-badge">
                      <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 7.5 5.5 10.5 11.5 3.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="album-photo-item selected">
                    <img src="/products/wedding-3.jpg" alt="Selected wedding photo 3" />
                    <div className="album-check-badge">
                      <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 7.5 5.5 10.5 11.5 3.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="album-photo-item">
                    <img src="/products/wedding-4.jpg" alt="Wedding photo 4" />
                  </div>
                  <div className="album-photo-item">
                    <img src="/products/wedding-5.jpg" alt="Wedding photo 5" />
                  </div>
                  <div className="album-photo-item selected">
                    <img src="/products/wedding-6.jpg" alt="Selected wedding photo 6" />
                    <div className="album-check-badge">
                      <svg width="9" height="9" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 7.5 5.5 10.5 11.5 3.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
              CARD 3: GUEST PHOTO AI (Row 2, Right)
              ==================================================================== */}
          <div className="pixieset-card card-square" id="guest-ai">
            <div className="pixieset-card-header">
              <div className="pixieset-card-title-row">
                <div className="pixieset-card-icon" style={{ background: '#10B981' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h2 className="pixieset-card-title">Guest Photo AI</h2>
              </div>
              <p className="pixieset-card-desc">
                Let guests find and download their own photos using a selfie. AI automatically finds their photos from your wedding.
              </p>
              <a href="#guest-ai" className="pixieset-card-link">
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="pixieset-card-visual">
              <div className="ms-guest-workflow-card">
                <img 
                  src="/products/guest-photo-ai-workflow.png" 
                  alt="Guest Photo AI Workflow: Wedding guest selfie beside QR sign, phone face detection, and matched photos results with Download All Photos button" 
                  className="ms-guest-workflow-img"
                />
              </div>
            </div>
          </div>

          {/* ====================================================================
              CARD 4: SONG SELECTION (Row 3, Left)
              ==================================================================== */}
          <div className="pixieset-card card-square" id="song-selection">
            <div className="pixieset-card-header">
              <div className="pixieset-card-title-row">
                <div className="pixieset-card-icon" style={{ background: '#F43F5E' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <h2 className="pixieset-card-title">Song Selection</h2>
              </div>
              <p className="pixieset-card-desc">
                Select suitable songs for wedding films, organized by occasions such as Shaadi, Valima, Haldi, and Mehndi.
              </p>
              <a href="#song-selection" className="pixieset-card-link">
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="pixieset-card-visual">
              <div className="song-selection-mockup">
                {/* Occasions Pills */}
                <div className="song-occasion-pills">
                  <span 
                    className={`occasion-pill ${activeOccasion === 'Shaadi' ? 'active' : 'shaadi'}`}
                    onClick={() => setActiveOccasion('Shaadi')}
                    style={{ cursor: 'pointer' }}
                  >
                    Shaadi
                  </span>
                  <span 
                    className={`occasion-pill ${activeOccasion === 'Valima' ? 'active' : 'valima'}`}
                    onClick={() => setActiveOccasion('Valima')}
                    style={{ cursor: 'pointer' }}
                  >
                    Valima
                  </span>
                  <span 
                    className={`occasion-pill ${activeOccasion === 'Haldi' ? 'active' : 'haldi'}`}
                    onClick={() => setActiveOccasion('Haldi')}
                    style={{ cursor: 'pointer' }}
                  >
                    Haldi
                  </span>
                  <span 
                    className={`occasion-pill ${activeOccasion === 'Mehndi' ? 'active' : 'mehndi'}`}
                    onClick={() => setActiveOccasion('Mehndi')}
                    style={{ cursor: 'pointer' }}
                  >
                    Mehndi
                  </span>
                </div>

                {/* Track List */}
                <div className="song-tracks-list">
                  <div className="song-track-item playing">
                    <div className="song-left-info">
                      <div className="song-play-btn green">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="#FFFFFF">
                          <polygon points="5 3 13 8 5 13 5 3" />
                        </svg>
                      </div>
                      <div>
                        <div className="song-title">Din Shagna Da (Acoustic)</div>
                        <div className="song-artist">Jasleen Royal · 3:45</div>
                      </div>
                    </div>
                    <span className="song-occasion-badge" style={{ background: '#FFF1F2', color: '#E11D48' }}>
                      Shaadi ✓
                    </span>
                  </div>

                  <div className="song-track-item">
                    <div className="song-left-info">
                      <div className="song-play-btn">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="#FFFFFF">
                          <polygon points="5 3 13 8 5 13 5 3" />
                        </svg>
                      </div>
                      <div>
                        <div className="song-title">Afreen Afreen (Sufi Mix)</div>
                        <div className="song-artist">Rahat Fateh Ali Khan · 4:12</div>
                      </div>
                    </div>
                    <span className="song-occasion-badge" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                      Valima
                    </span>
                  </div>

                  <div className="song-track-item">
                    <div className="song-left-info">
                      <div className="song-play-btn">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="#FFFFFF">
                          <polygon points="5 3 13 8 5 13 5 3" />
                        </svg>
                      </div>
                      <div>
                        <div className="song-title">Galla Goriyan (Upbeat)</div>
                        <div className="song-artist">Kanika Kapoor · 3:10</div>
                      </div>
                    </div>
                    <span className="song-occasion-badge" style={{ background: '#FEFCE8', color: '#CA8A04' }}>
                      Haldi
                    </span>
                  </div>

                  <div className="song-track-item">
                    <div className="song-left-info">
                      <div className="song-play-btn">
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="#FFFFFF">
                          <polygon points="5 3 13 8 5 13 5 3" />
                        </svg>
                      </div>
                      <div>
                        <div className="song-title">London Thumakda</div>
                        <div className="song-artist">Labh Janjua · 3:50</div>
                      </div>
                    </div>
                    <span className="song-occasion-badge" style={{ background: '#ECFEFF', color: '#0891B2' }}>
                      Mehndi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
              CARD 5: CAMERA INGEST (Row 3, Right)
              ==================================================================== */}
          <div className="pixieset-card card-square" id="camera-ingest">
            <div className="pixieset-card-header">
              <div className="pixieset-card-title-row">
                <div className="pixieset-card-icon" style={{ background: '#A855F7' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h2 className="pixieset-card-title">Camera Ingest</h2>
              </div>
              <p className="pixieset-card-desc">
                Import wedding photos and videos directly from cameras, organize files, and prepare them for editing.
              </p>
              <a href="#camera-ingest" className="pixieset-card-link">
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="pixieset-card-visual">
              <div className="camera-ingest-mockup">
                <div className="ingest-top-device">
                  <div className="ingest-device-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00B69B" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>Sony FX3 · Slot A (160GB)</span>
                  </div>
                  <div className="ingest-status-indicator">
                    <span className="ingest-status-dot" />
                    <span>280 MB/s</span>
                  </div>
                </div>

                <div className="ingest-progress-box">
                  <div className="ingest-stats-row">
                    <span>Importing RAW footages...</span>
                    <span>78% (1,420 / 1,820 files)</span>
                  </div>
                  <div className="ingest-progress-bar-bg">
                    <div className="ingest-progress-bar-fill" />
                  </div>
                </div>

                <div className="ingest-filmstrip">
                  <div className="ingest-thumb-box">
                    <img src="/products/wedding-2.jpg" alt="Ingest RAW 1" />
                    <span className="ingest-thumb-format">RAW</span>
                    <span className="ingest-thumb-check">✓</span>
                  </div>
                  <div className="ingest-thumb-box">
                    <img src="/products/wedding-3.jpg" alt="Ingest RAW 2" />
                    <span className="ingest-thumb-format">4K</span>
                    <span className="ingest-thumb-check">✓</span>
                  </div>
                  <div className="ingest-thumb-box">
                    <img src="/products/wedding-4.jpg" alt="Ingest RAW 3" />
                    <span className="ingest-thumb-format">RAW</span>
                    <span className="ingest-thumb-check">✓</span>
                  </div>
                  <div className="ingest-thumb-box">
                    <img src="/products/wedding-5.jpg" alt="Ingest RAW 4" />
                    <span className="ingest-thumb-format">4K</span>
                    <span className="ingest-thumb-check">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
