import React from 'react';
import './PixiesetFeatureCards.css';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Send,
  MoreVertical
} from 'lucide-react';

function AnimatedNumber({ target, duration = 750 }) {
  const [count, setCount] = React.useState(0);
  const elementRef = React.useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let startTime = null;
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(easeProgress * target));
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.15 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={elementRef}>{count}</span>;
}

export default function PixiesetFeatureCards({ onLearnMore }) {

  return (
    <section className="ms-suite-section" id="platform-suite">
      {/* 1. Header / Eyebrow */}
      <div className="ms-suite-header">
        <div className="ms-suite-eyebrow">
          ALL IN ONE PLATFORM
        </div>
        <h2 className="ms-suite-headline">
          Everything you need. All in one place.
        </h2>
        <p className="ms-suite-subtitle">
          A complete suite of tools to manage your wedding photography studio. Powerful on their own. Magical together.
        </p>
      </div>

      {/* 2. 5 Feature Cards Grid */}
      <div className="ms-suite-container">
        <div className="ms-suite-grid">
          
          {/* ====================================================================
              CARD 1: BOOKING (Full Width Spanning 2 Columns)
              ==================================================================== */}
          <div className="ms-card ms-card-booking" id="booking">
            <div className="ms-card-header">
              <div className="ms-card-title-row">
                <div className="ms-card-icon" style={{ background: 'var(--apple-primary, #0066cc)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="ms-card-title">Booking</h3>
              </div>
              <p className="ms-card-desc">
                Manage client bookings, shoot schedules, payments, and the complete wedding workflow with automated client reminders.
              </p>
              <a 
                href="#booking" 
                className="ms-card-link" 
                onClick={(e) => {
                  e.preventDefault();
                  onLearnMore && onLearnMore({
                    title: 'Booking & Shoot Management',
                    category: 'BOOKINGS & CALENDAR',
                    description: 'Manage client bookings, shoot schedules, payments, and the complete wedding workflow with automated client reminders.',
                    highlights: [
                      'Inquiry capture and calendar date reservation',
                      'Automated shoot schedule timelines and shot list sharing',
                      'Deposit and milestone payment tracking',
                      'Automated SMS & email client reminders'
                    ]
                  });
                }}
              >
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="ms-card-visual">
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
                      <span className="ms-bk-metric-val">
                        <AnimatedNumber target={24} duration={700} />
                      </span>
                      <span className="ms-bk-metric-label">Total Bookings</span>
                    </div>
                  </div>

                  {/* Card 2: Confirmed */}
                  <div className="ms-bk-metric-card metric-green">
                    <div className="ms-bk-metric-icon-box">
                      <CheckCircle2 size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">
                        <AnimatedNumber target={18} duration={750} />
                      </span>
                      <span className="ms-bk-metric-label">Confirmed</span>
                    </div>
                  </div>

                  {/* Card 3: Pending */}
                  <div className="ms-bk-metric-card metric-amber">
                    <div className="ms-bk-metric-icon-box">
                      <Clock size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">
                        <AnimatedNumber target={4} duration={600} />
                      </span>
                      <span className="ms-bk-metric-label">Pending</span>
                    </div>
                  </div>

                  {/* Card 4: Needs Follow Up */}
                  <div className="ms-bk-metric-card metric-red">
                    <div className="ms-bk-metric-icon-box">
                      <AlertCircle size={15} />
                    </div>
                    <div className="ms-bk-metric-info">
                      <span className="ms-bk-metric-val">
                        <AnimatedNumber target={2} duration={500} />
                      </span>
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
          <div className="ms-card ms-card-square" id="album-selection">
            <div className="ms-card-header">
              <div className="ms-card-title-row">
                <div className="ms-card-icon" style={{ background: '#2563EB' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <h3 className="ms-card-title">Album Selection</h3>
              </div>
              <p className="ms-card-desc">
                Clients select their favourite wedding photos for printed albums, solving the challenge of choosing the best images.
              </p>
              <a 
                href="#album-selection" 
                className="ms-card-link" 
                onClick={(e) => {
                  e.preventDefault();
                  onLearnMore && onLearnMore({
                    id: 'album-selection',
                    title: 'Album Selection',
                    category: 'PROOFING & PRINTS',
                    description: 'Let your clients select the best photos for their wedding album design. No more manually collecting photo selections through WhatsApp.'
                  });
                }}
              >
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="ms-card-visual">
              <div className="ms-album-mockup-card">
                <img 
                  src="/products/album-selection-mockup.png" 
                  alt="Album Selection: 48 / 80 Selected photo selection interface with 3-column wedding photo grid and submit button" 
                  className="ms-album-mockup-img"
                />
              </div>
            </div>
          </div>

          {/* ====================================================================
              CARD 3: GUEST PHOTO AI (Row 2, Right)
              ==================================================================== */}
          <div className="ms-card ms-card-square" id="guest-ai">
            <div className="ms-card-header">
              <div className="ms-card-title-row">
                <div className="ms-card-icon" style={{ background: '#10B981' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h3 className="ms-card-title">Guest Photo AI</h3>
              </div>
              <p className="ms-card-desc">
                Let guests find and download their own photos using a selfie. AI automatically finds their photos from your wedding.
              </p>
              <a 
                href="#guest-ai" 
                className="ms-card-link" 
                onClick={(e) => {
                  e.preventDefault();
                  onLearnMore && onLearnMore({
                    id: 'guest-ai',
                    title: 'Guest Photo AI',
                    category: 'AI GUEST EXPERIENCES',
                    description: 'Let guests find and download their own photos using a selfie. AI finds their photos from your wedding.'
                  });
                }}
              >
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="ms-card-visual">
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
          <div className="ms-card ms-card-square" id="song-selection">
            <div className="ms-card-header">
              <div className="ms-card-title-row">
                <div className="ms-card-icon" style={{ background: '#F43F5E' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <h3 className="ms-card-title">Song Selection</h3>
              </div>
              <p className="ms-card-desc">
                Let clients choose music for every wedding moment. Share a private selection link where they can add YouTube or Spotify songs for each scene and submit their choices to your studio.
              </p>
              <a 
                href="#song-selection" 
                className="ms-card-link" 
                onClick={(e) => {
                  e.preventDefault();
                  onLearnMore && onLearnMore({
                    id: 'song-selection',
                    title: 'Song Selection',
                    category: 'CINEMATIC SOUNDTRACKS',
                    description: 'Let clients choose music for every wedding moment. Share a private selection link where they can add YouTube or Spotify songs for each scene and submit their choices to your studio.'
                  });
                }}
              >
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="ms-card-visual">
              <div className="ms-song-workflow-card">
                <img 
                  src="/products/song-selection-workflow.png" 
                  alt="Song Selection: Wedding client choosing songs for moments on phone with subtle wedding photo background" 
                  className="ms-song-workflow-img"
                />
              </div>
            </div>
          </div>

          {/* ====================================================================
              CARD 5: CAMERA INGEST (Row 3, Right)
              ==================================================================== */}
          <div className="ms-card ms-card-square" id="camera-ingest">
            <div className="ms-card-header">
              <div className="ms-card-title-row">
                <div className="ms-card-icon" style={{ background: '#A855F7' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h3 className="ms-card-title">Camera Ingest</h3>
              </div>
              <p className="ms-card-desc">
                Import photos and videos directly from your cameras as you shoot. Files are automatically organized and ready for editing, client delivery, and AI features.
              </p>
              <a 
                href="#camera-ingest" 
                className="ms-card-link" 
                onClick={(e) => {
                  e.preventDefault();
                  onLearnMore && onLearnMore({
                    id: 'camera-ingest',
                    title: 'Camera Ingest',
                    category: 'IMPORT & STUDIO STORAGE',
                    description: 'Transfer photos and videos directly from supported cameras to ManageStudio using FTP, FTPS, or SFTP. Files are securely stored in the cloud and organized for gallery delivery and AI features.'
                  });
                }}
              >
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3L11 8L6 13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="ms-card-visual">
              <div className="ms-ingest-workflow-card">
                <img 
                  src="/products/camera-ingest-workflow.png" 
                  alt="Camera Ingest: Wedding photographer shooting with direct auto uploading to ingest software" 
                  className="ms-ingest-workflow-img"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
