import React, { useState } from 'react';
import './AboutPage.css';
import './HomepageBottomSections.css';
import SharedNavbar from './SharedNavbar.jsx';
import { 
  Camera, 
  Image as ImageIcon, 
  Layers, 
  Users, 
  Music, 
  Calendar, 
  FileText, 
  Wallet,
  Check, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import ManageStudioModals from './ManageStudioModals.jsx';

export default function AboutPage({ onNavigate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const handleOpenLegal = (title) => {
    setModalData({ title });
    setActiveModal('legal');
  };

  const modulesData = [
    {
      num: "01",
      id: "camera-ingest",
      name: "Camera Ingest",
      icon: <Camera size={24} strokeWidth={2} />,
      desc: "Automatically transfer and organize camera files so your team can focus on editing and delivery instead of manual file management.",
      problem: {
        heading: "Manually transferring and organizing camera files takes time.",
        body: "Copying files, managing folders and preparing files for editing or delivery adds repetitive steps after every wedding."
      },
      solution: {
        heading: "Streamline camera file transfers.",
        body: "Configure supported cameras to send files through FTP, FTPS or SFTP workflows, with cloud storage integration where available."
      }
    },
    {
      num: "02",
      id: "gallery",
      name: "Gallery",
      icon: <ImageIcon size={24} strokeWidth={2} />,
      desc: "Share wedding photos and final videos through a private, client friendly gallery.",
      problem: {
        heading: "Delivering wedding photos can be difficult to manage.",
        body: "Sharing hundreds or thousands of photos through scattered links and folders makes it hard for clients to browse and download."
      },
      solution: {
        heading: "One organized gallery for every wedding.",
        body: "Share photos and final videos through a private client friendly gallery, making it easier for clients to browse and download their memories."
      }
    },
    {
      num: "03",
      id: "album-selection",
      name: "Album Selection",
      icon: <Layers size={24} strokeWidth={2} />,
      desc: "Let clients select their favourite photos for albums through a simple and organized workflow.",
      problem: {
        heading: "Collecting favourite photos is confusing and time consuming.",
        body: "Clients often send WhatsApp messages, screenshots and filenames to share their selections."
      },
      solution: {
        heading: "Let clients select their favourite photos.",
        body: "Share a private selection link, let clients choose images for their album, and review their submitted selections in an organized workflow."
      }
    },
    {
      num: "04",
      id: "guest-photo-ai",
      name: "Guest Photo AI",
      icon: <Users size={24} strokeWidth={2} />,
      desc: "Help guests find their own photos using selfie based face matching, without manual searching.",
      problem: {
        heading: "Guests frequently ask for their photos.",
        body: "Searching manually through large wedding galleries takes time and interrupts other work."
      },
      solution: {
        heading: "Help guests find their own photos.",
        body: "Guest Photo AI uses selfie based face matching to help guests discover matching wedding photos through the supported workflow."
      }
    },
    {
      num: "05",
      id: "song-selection",
      name: "Song Selection",
      icon: <Music size={24} strokeWidth={2} />,
      desc: "Collect music preferences for different wedding moments in one place.",
      problem: {
        heading: "Collecting music choices can be confusing and unorganized.",
        body: "Clients share song preferences for the Mehendi, Sangeet, wedding entry and other moments through separate messages."
      },
      solution: {
        heading: "Collect song choices in one place.",
        body: "Send clients a private link where they can add supported YouTube or Spotify links for different wedding moments and submit their choices."
      }
    },
    {
      num: "06",
      id: "bookings",
      name: "Bookings",
      icon: <Calendar size={24} strokeWidth={2} />,
      desc: "Keep wedding dates, client details and event information organized in one place.",
      problem: {
        heading: "Keeping track of wedding bookings can be challenging.",
        body: "Wedding dates, client details, event information and commitments spread across diaries and messages can be difficult to manage."
      },
      solution: {
        heading: "Keep studio bookings organized.",
        body: "Maintain booking information and event details in one place so you can review upcoming work more easily."
      }
    },
    {
      num: "07.",
      id: "invoices-billing",
      name: "Invoices & Billing",
      icon: <FileText size={24} strokeWidth={2} />,
      desc: "Manage invoices, track payments and keep billing records organized.",
      problem: {
        heading: "Managing invoices and payments manually creates extra work.",
        body: "Preparing invoices, tracking amounts and keeping payment records organized can be time consuming."
      },
      solution: {
        heading: "Keep billing records together.",
        body: "Manage studio invoices and billing information in one organized place, using the billing features available in your software."
      }
    },
    {
      num: "08.",
      id: "studio-expenses",
      name: "Studio Expenses",
      icon: <Wallet size={24} strokeWidth={2} />,
      desc: "Track studio expenses such as equipment rentals, travel costs and other business expenses.",
      problem: {
        heading: "Studio expenses can be easily missed or scattered.",
        body: "Small purchases, travel costs, equipment rentals and other business expenses can be forgotten or spread across receipts and notes."
      },
      solution: {
        heading: "Track studio expenses systematically.",
        body: "Record and organize business expenses so you can review your studio spending more easily."
      }
    }
  ];

  return (
    <div className="ms-about-page-wrapper">
      {/* ======================================================================
          1. TOP NAVBAR (CLEAN WHITE)
          ====================================================================== */}
      {/* Unified Top Navigation */}
      <SharedNavbar
        activePage="about"
        onNavigate={onNavigate}
        onOpenLogin={() => { window.location.href = 'https://app.managestudio.io/'; }}
        onOpenGetStarted={() => setActiveModal('get-started')}
      />

      {/* ======================================================================
          2. HERO SECTION
          ====================================================================== */}
      <section className="ms-about-hero-section">
        <div className="ms-about-container">
          <div className="ms-about-hero-grid">
            <div className="ms-about-hero-left">
              <span className="ms-about-eyebrow">ABOUT MANAGESTUDIO</span>
              <h1 className="ms-about-headline">
                Real solutions for real<br />studio challenges.
              </h1>
              <p className="ms-about-subtitle">
                Running a wedding studio means managing much more than photography.<br />
                Here are the everyday challenges studios face and how ManageStudio helps solve them.
              </p>
            </div>

            <div className="ms-about-hero-badge-card">
              <div className="ms-about-badge-top">
                <div className="ms-about-badge-icon">
                  <Users size={20} />
                </div>
                <div className="ms-about-badge-title">
                  <span>Built for</span>
                  <strong>Wedding Studios</strong>
                </div>
              </div>
              <p className="ms-about-badge-desc">
                From creative workflows to business operations, ManageStudio brings everything together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. MODULES COMPARISON LIST (ALL 8 MODULES)
          ====================================================================== */}
      <main className="ms-about-main-content">
        <div className="ms-about-container">
          <div className="ms-about-modules-list">
            {modulesData.map((module) => (
              <div key={module.id} className="ms-about-module-row" id={module.id}>
                {/* Left Column: Number, Icon, Name, Description */}
                <div className="ms-about-mod-left">
                  <div className="ms-about-mod-number">{module.num}</div>
                  <div className="ms-about-mod-header">
                    <div className="ms-about-mod-icon-wrap">
                      {module.icon}
                    </div>
                    <div className="ms-about-mod-meta">
                      <h2 className="ms-about-mod-title">{module.name}</h2>
                      <p className="ms-about-mod-desc">{module.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Problem Box above, Solution Box below */}
                <div className="ms-about-mod-right">
                  {/* Problem Box */}
                  <div className="ms-about-problem-box">
                    <div className="ms-about-status-icon-circle ms-about-circle-red" aria-hidden="true">
                      !
                    </div>
                    <div className="ms-about-box-content">
                      <span className="ms-about-box-label ms-about-label-red">The Problem</span>
                      <h3 className="ms-about-box-heading">{module.problem.heading}</h3>
                      <p className="ms-about-box-text">{module.problem.body}</p>
                    </div>
                  </div>

                  {/* Solution Box */}
                  <div className="ms-about-solution-box">
                    <div className="ms-about-status-icon-circle ms-about-circle-green" aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <div className="ms-about-box-content">
                      <span className="ms-about-box-label ms-about-label-green">The Solution</span>
                      <h3 className="ms-about-box-heading">{module.solution.heading}</h3>
                      <p className="ms-about-box-text">{module.solution.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==================================================================
              4. BOTTOM CTA SECTION
              ================================================================== */}
          <div className="ms-about-cta-card">
            <div className="ms-about-cta-text">
              <span className="ms-about-cta-eyebrow">GET STARTED</span>
              <h3 className="ms-about-cta-heading">Spend less time managing the details.</h3>
              <p className="ms-about-cta-desc">
                Manage your wedding studio workflows in one place, from client selections and photo delivery to bookings, billing and expenses.
              </p>
            </div>
            <div className="ms-about-cta-actions">
              <button 
                type="button" 
                className="ms-about-btn-primary"
                onClick={() => onNavigate && onNavigate('marketing', 'gallery')}
              >
                <span>Explore Modules</span>
                <ArrowRight size={16} />
              </button>
              <button 
                type="button" 
                className="ms-about-btn-secondary"
                onClick={() => onNavigate && onNavigate('pricing')}
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================================
          5. REUSED MANAGESTUDIO FOOTER
          ====================================================================== */}
      <footer className="ms-footer-section">
        <div className="ms-footer-container">
          <div className="ms-footer-main">
            {/* Left Column: Logo, Tagline & Social Icons */}
            <div className="ms-footer-brand">
              <a 
                href="/" 
                className="ms-footer-logo-link" 
                aria-label="ManageStudio Home"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate && onNavigate('marketing');
                }}
              >
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
                  <li><a href="#booking" className="ms-footer-link" onClick={(e) => handleModuleClick(e, 'booking')}>Booking</a></li>
                  <li><a href="#album-selection" className="ms-footer-link" onClick={(e) => handleModuleClick(e, 'album-selection')}>Album Selection</a></li>
                  <li><a href="#guest-ai" className="ms-footer-link" onClick={(e) => handleModuleClick(e, 'guest-ai')}>Guest Photo AI</a></li>
                  <li><a href="#song-selection" className="ms-footer-link" onClick={(e) => handleModuleClick(e, 'song-selection')}>Song Selection</a></li>
                  <li><a href="#camera-ingest" className="ms-footer-link" onClick={(e) => handleModuleClick(e, 'camera-ingest')}>Camera Ingest</a></li>
                  <li><a href="#gallery" className="ms-footer-link" onClick={(e) => handleModuleClick(e, 'gallery')}>Client Gallery</a></li>
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
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                    >
                      About ManageStudio
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className="ms-footer-link"
                      onClick={() => onNavigate && onNavigate('contact')}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <a 
                      href="https://app.managestudio.io/" 
                      className="ms-footer-link"
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
                onClick={() => handleOpenLegal('Privacy Policy')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Privacy Policy
              </button>
              <button 
                type="button" 
                className="ms-footer-bottom-link" 
                onClick={() => handleOpenLegal('Terms of Service')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Terms of Service
              </button>
              <button 
                type="button" 
                className="ms-footer-bottom-link" 
                onClick={() => handleOpenLegal('Security')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Security
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Central Modal Manager */}
      <ManageStudioModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        modalData={modalData}
        onOpenGetStarted={() => setActiveModal('get-started')}
      />
    </div>
  );
}
