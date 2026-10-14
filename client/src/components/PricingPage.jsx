import React, { useState } from 'react';
import './PricingPage.css';
import SharedNavbar from './SharedNavbar.jsx';
import { 
  Image as ImageIcon, 
  Music, 
  Users, 
  Database, 
  Check, 
  Plus, 
  Equal, 
  Info, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Film,
  Camera
} from 'lucide-react';
import ManageStudioModals from './ManageStudioModals.jsx';

export default function PricingPage({ onNavigate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Selected Modules for Interactive Storage & Price Calculator
  // By default, show all 3 modules active as in the reference design
  const [selectedModules, setSelectedModules] = useState({
    album: true,
    song: true,
    guestAi: true
  });

  // Selected Additional Storage (null or '50gb' | '200gb' | '500gb' | '1tb')
  const [selectedStorage, setSelectedStorage] = useState(null);

  // FAQ Accordion Open States (all closed or openable)
  const [openFaq, setOpenFaq] = useState({});

  const toggleFaq = (index) => {
    setOpenFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleToggleModule = (key) => {
    setSelectedModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    handleShowToast(`Updated selection for ${key === 'album' ? 'Album Selection' : key === 'song' ? 'Song Selection' : 'Guest Photo AI'}`);
  };

  const handleSelectStorage = (key, label) => {
    setSelectedStorage(prev => (prev === key ? null : key));
    handleShowToast(selectedStorage === key ? 'Removed extra storage' : `Added ${label} extra storage`);
  };

  const handleShowToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Calculate dynamic storage totals based on selections
  const selectedCount = Object.values(selectedModules).filter(Boolean).length;
  const baseStorageGB = selectedCount * 5;

  const storageAddonMap = {
    '50gb': 50,
    '200gb': 200,
    '500gb': 500,
    '1tb': 1000
  };
  const addonGB = selectedStorage ? storageAddonMap[selectedStorage] || 0 : 0;
  const totalStorageGB = baseStorageGB + addonGB;

  // Calculate total monthly price
  let totalPrice = 0;
  if (selectedModules.album) totalPrice += 499;
  if (selectedModules.song) totalPrice += 499;
  if (selectedModules.guestAi) totalPrice += 699;
  if (selectedStorage === '50gb') totalPrice += 299;
  if (selectedStorage === '200gb') totalPrice += 599;
  if (selectedStorage === '500gb') totalPrice += 999;
  if (selectedStorage === '1tb') totalPrice += 1499;

  const faqs = [
    {
      q: 'Is Gallery included with every paid module?',
      a: 'Yes! Every paid module (Album Selection, Song Selection, or Guest Photo AI) includes full access to the Client Gallery with 5 GB of high-speed cloud storage.'
    },
    {
      q: 'Can I change or cancel my modules?',
      a: 'Yes, you have complete flexibility. You can add, swap, or remove individual modules at any time with no long-term lock-in or cancellation penalties.'
    },
    {
      q: 'How is storage calculated?',
      a: 'Storage from all your active modules is combined at the account level. For example, 1 module gives you 5 GB, 2 modules give you 10 GB, and 3 modules give you 15 GB of shared storage.'
    },
    {
      q: 'Do you offer yearly plans?',
      a: 'Yes, annual subscriptions are available with 2 months free (equivalent to 17% savings). Reach out to our studio onboarding team for annual invoicing.'
    },
    {
      q: 'Can I buy additional storage later?',
      a: 'Absolutely. You can add extra storage plans (50 GB, 200 GB, 500 GB, or 1 TB) at any time from your studio account settings as your wedding season expands.'
    },
    {
      q: 'Is there any setup fee?',
      a: 'No. There are zero onboarding fees or hidden platform charges. You only pay the listed monthly price for the modules and storage you choose.'
    }
  ];

  return (
    <div className="pricing-page-wrapper">
      {/* ======================================================================
          TOP HERO BANNER WITH INTEGRATED NAVBAR & COLLAGE BACKGROUND
          ====================================================================== */}
      <section className="pricing-hero-section">
        {/* Dark Wedding Photography Backdrop */}
        <div className="pricing-hero-backdrop" aria-hidden="true">
          <div className="pricing-hero-mosaic" />
          <div className="pricing-hero-gradient" />
        </div>

        {/* Unified Top Navigation */}
        <SharedNavbar
          activePage="pricing"
          onNavigate={onNavigate}
          onOpenLogin={() => { window.location.href = 'https://app.managestudio.io/'; }}
          onOpenGetStarted={() => setActiveModal('get-started')}
        />

        {/* Hero Content Area */}
        <div className="pricing-hero-container">
          <div className="pricing-eyebrow">PRICING</div>
          <h1 className="pricing-main-headline">
            Your modules. Your storage.
          </h1>
          <p className="pricing-hero-description">
            Choose the modules you need. Each paid module includes Gallery and 5 GB storage. Storage gets added with every module you purchase. Upgrade storage anytime.
          </p>
        </div>
      </section>

      {/* ======================================================================
          WHITE MAIN BODY CONTENT CONTAINER
          ====================================================================== */}
      <main className="pricing-main-content">
        <div className="pricing-body-container">

          {/* ==================================================================
              SECTION 1: PAID MODULES
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge">1</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Paid Modules</h2>
                <p className="pricing-step-subtitle">
                  Choose the modules you need. Each module includes Gallery access and 5 GB storage.
                </p>
              </div>
            </div>

            {/* 3 Module Cards Grid */}
            <div className="pricing-modules-grid">
              {/* Card 1: Album Selection */}
              <div className={`pricing-module-card ${selectedModules.album ? 'is-selected' : ''}`}>
                <div className="pm-card-top">
                  <div className="pm-card-icon-wrap pm-icon-blue">
                    <ImageIcon size={20} />
                  </div>
                  <div className="pm-card-badges">
                    <span className="pm-badge-green">Includes Gallery</span>
                    <span className="pm-badge-blue">+ 5 GB Storage</span>
                  </div>
                </div>

                <div className="pm-card-header-row">
                  <div className="pm-card-info">
                    <h3 className="pm-card-title">Album Selection</h3>
                    <p className="pm-card-desc">
                      Fast and easy photo selection portal with client star ratings and feedback.
                    </p>
                  </div>
                  <div className="pm-card-price-box">
                    <div className="pm-price-val">₹499</div>
                    <div className="pm-price-period">/ month</div>
                  </div>
                </div>

                <ul className="pm-features-list">
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Client photo selection portal</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Star ratings and feedback</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Selection tracking</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Watermark protection</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Multiple export formats</span>
                  </li>
                </ul>

                <button 
                  type="button" 
                  className={`pm-action-btn ${selectedModules.album ? 'pm-btn-active' : ''}`}
                  onClick={() => handleToggleModule('album')}
                >
                  {selectedModules.album ? 'Selected (Added)' : 'Add Module'}
                </button>
              </div>

              {/* Card 2: Song Selection */}
              <div className={`pricing-module-card ${selectedModules.song ? 'is-selected' : ''}`}>
                <div className="pm-card-top">
                  <div className="pm-card-icon-wrap pm-icon-blue">
                    <Music size={20} />
                  </div>
                  <div className="pm-card-badges">
                    <span className="pm-badge-green">Includes Gallery</span>
                    <span className="pm-badge-blue">+ 5 GB Storage</span>
                  </div>
                </div>

                <div className="pm-card-header-row">
                  <div className="pm-card-info">
                    <h3 className="pm-card-title">Song Selection</h3>
                    <p className="pm-card-desc">
                      Music library and soundtrack selection for wedding cinematographers.
                    </p>
                  </div>
                  <div className="pm-card-price-box">
                    <div className="pm-price-val">₹499</div>
                    <div className="pm-price-period">/ month</div>
                  </div>
                </div>

                <ul className="pm-features-list">
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Curated wedding song library</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Client song selection portal</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Audio waveform preview</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Custom playlists</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Premiere Pro direct export</span>
                  </li>
                </ul>

                <button 
                  type="button" 
                  className={`pm-action-btn ${selectedModules.song ? 'pm-btn-active' : ''}`}
                  onClick={() => handleToggleModule('song')}
                >
                  {selectedModules.song ? 'Selected (Added)' : 'Add Module'}
                </button>
              </div>

              {/* Card 3: Guest Photo AI */}
              <div className={`pricing-module-card ${selectedModules.guestAi ? 'is-selected' : ''}`}>
                <div className="pm-card-top">
                  <div className="pm-card-icon-wrap pm-icon-blue">
                    <Users size={20} />
                  </div>
                  <div className="pm-card-badges">
                    <span className="pm-badge-green">Includes Gallery</span>
                    <span className="pm-badge-blue">+ 5 GB Storage</span>
                  </div>
                </div>

                <div className="pm-card-header-row">
                  <div className="pm-card-info">
                    <h3 className="pm-card-title">Guest Photo AI</h3>
                    <p className="pm-card-desc">
                      AI-driven face matching portal for wedding and event guests.
                    </p>
                  </div>
                  <div className="pm-card-price-box">
                    <div className="pm-price-val">₹699</div>
                    <div className="pm-price-period">/ month</div>
                  </div>
                </div>

                <ul className="pm-features-list">
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Selfie based face recognition</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Instant attendee photo matching</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Automated QR code sharing</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Dedicated guest download page</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Privacy and watermark options</span>
                  </li>
                </ul>

                <button 
                  type="button" 
                  className={`pm-action-btn ${selectedModules.guestAi ? 'pm-btn-active' : ''}`}
                  onClick={() => handleToggleModule('guestAi')}
                >
                  {selectedModules.guestAi ? 'Selected (Added)' : 'Add Module'}
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================================
              SECTION 2: HOW STORAGE WORKS (Equation Breakdown)
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge">2</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">How Storage Works</h2>
                <p className="pricing-step-subtitle">
                  Every paid module includes 5 GB storage. Storage from multiple modules is added together in your account.
                </p>
              </div>
            </div>

            {/* Visual Storage Equation Row */}
            <div className="storage-equation-container">
              {/* Item 1: Album Selection */}
              <div className={`equation-card ${selectedModules.album ? 'eq-card-active' : 'eq-card-muted'}`}>
                <div className="eq-card-icon-wrap">
                  <ImageIcon size={20} />
                </div>
                <div className="eq-card-details">
                  <div className="eq-card-label">Album Selection</div>
                  <div className="eq-card-value">5 GB</div>
                  <div className="eq-card-sub">
                    <Check size={12} />
                    <span>Includes Gallery</span>
                  </div>
                </div>
              </div>

              <div className="equation-symbol">+</div>

              {/* Item 2: Song Selection */}
              <div className={`equation-card ${selectedModules.song ? 'eq-card-active' : 'eq-card-muted'}`}>
                <div className="eq-card-icon-wrap">
                  <Music size={20} />
                </div>
                <div className="eq-card-details">
                  <div className="eq-card-label">Song Selection</div>
                  <div className="eq-card-value">5 GB</div>
                  <div className="eq-card-sub">
                    <Check size={12} />
                    <span>Includes Gallery</span>
                  </div>
                </div>
              </div>

              <div className="equation-symbol">+</div>

              {/* Item 3: Guest Photo AI */}
              <div className={`equation-card ${selectedModules.guestAi ? 'eq-card-active' : 'eq-card-muted'}`}>
                <div className="eq-card-icon-wrap">
                  <Users size={20} />
                </div>
                <div className="eq-card-details">
                  <div className="eq-card-label">Guest Photo AI</div>
                  <div className="eq-card-value">5 GB</div>
                  <div className="eq-card-sub">
                    <Check size={12} />
                    <span>Includes Gallery</span>
                  </div>
                </div>
              </div>

              <div className="equation-symbol">=</div>

              {/* Result Box: Total Storage */}
              <div className="equation-result-box">
                <div className="eq-result-icon-wrap">
                  <Database size={24} />
                </div>
                <div className="eq-result-text">
                  <div className="eq-result-value">{baseStorageGB} GB</div>
                  <div className="eq-result-label">
                    Total Storage<br />
                    <span>({selectedCount} {selectedCount === 1 ? 'module' : 'modules'})</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================================
              SECTION 3: ADDITIONAL CLOUD STORAGE
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge badge-warm">3</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Additional Cloud Storage</h2>
                <p className="pricing-step-subtitle">
                  Need more space? Purchase additional storage. This is shared across your entire studio account.
                </p>
              </div>
            </div>

            <div className="storage-split-layout">
              {/* Left Column: 4 Storage Cards */}
              <div className="storage-cards-grid">
                {/* 50 GB Card */}
                <div className={`storage-plan-card ${selectedStorage === '50gb' ? 'storage-plan-selected' : ''}`}>
                  <div className="storage-plan-icon">
                    <Database size={20} />
                  </div>
                  <div className="storage-plan-size">50 GB</div>
                  <div className="storage-plan-price">
                    <span className="sp-price-amount">₹299</span>
                    <span className="sp-price-period">/ month</span>
                  </div>
                  <div className="storage-plan-photos">
                    Approx. 10,000 photos
                  </div>
                  <button 
                    type="button" 
                    className={`storage-plan-btn ${selectedStorage === '50gb' ? 'btn-storage-active' : ''}`}
                    onClick={() => handleSelectStorage('50gb', '50 GB')}
                  >
                    {selectedStorage === '50gb' ? 'Added ✓' : 'Add Storage'}
                  </button>
                </div>

                {/* 200 GB Card */}
                <div className={`storage-plan-card ${selectedStorage === '200gb' ? 'storage-plan-selected' : ''}`}>
                  <div className="storage-plan-icon">
                    <Database size={20} />
                  </div>
                  <div className="storage-plan-size">200 GB</div>
                  <div className="storage-plan-price">
                    <span className="sp-price-amount">₹599</span>
                    <span className="sp-price-period">/ month</span>
                  </div>
                  <div className="storage-plan-photos">
                    Approx. 40,000 photos
                  </div>
                  <button 
                    type="button" 
                    className={`storage-plan-btn ${selectedStorage === '200gb' ? 'btn-storage-active' : ''}`}
                    onClick={() => handleSelectStorage('200gb', '200 GB')}
                  >
                    {selectedStorage === '200gb' ? 'Added ✓' : 'Add Storage'}
                  </button>
                </div>

                {/* 500 GB Card */}
                <div className={`storage-plan-card ${selectedStorage === '500gb' ? 'storage-plan-selected' : ''}`}>
                  <div className="storage-plan-icon">
                    <Database size={20} />
                  </div>
                  <div className="storage-plan-size">500 GB</div>
                  <div className="storage-plan-price">
                    <span className="sp-price-amount">₹999</span>
                    <span className="sp-price-period">/ month</span>
                  </div>
                  <div className="storage-plan-photos">
                    Approx. 100,000 photos
                  </div>
                  <button 
                    type="button" 
                    className={`storage-plan-btn ${selectedStorage === '500gb' ? 'btn-storage-active' : ''}`}
                    onClick={() => handleSelectStorage('500gb', '500 GB')}
                  >
                    {selectedStorage === '500gb' ? 'Added ✓' : 'Add Storage'}
                  </button>
                </div>

                {/* 1 TB Card */}
                <div className={`storage-plan-card ${selectedStorage === '1tb' ? 'storage-plan-selected' : ''}`}>
                  <div className="storage-plan-icon">
                    <Database size={20} />
                  </div>
                  <div className="storage-plan-size">1 TB</div>
                  <div className="storage-plan-price">
                    <span className="sp-price-amount">₹1,499</span>
                    <span className="sp-price-period">/ month</span>
                  </div>
                  <div className="storage-plan-photos">
                    Approx. 200,000 photos
                  </div>
                  <button 
                    type="button" 
                    className={`storage-plan-btn ${selectedStorage === '1tb' ? 'btn-storage-active' : ''}`}
                    onClick={() => handleSelectStorage('1tb', '1 TB')}
                  >
                    {selectedStorage === '1tb' ? 'Added ✓' : 'Add Storage'}
                  </button>
                </div>
              </div>

              {/* Right Column: Important Note Card */}
              <div className="storage-note-card">
                <div className="note-card-header">
                  <div className="note-icon-wrap">
                    <Info size={18} />
                  </div>
                  <h3 className="note-card-title">Important Note</h3>
                </div>
                <p className="note-card-desc">
                  The 5 GB included with each module is account-level storage, not 5 GB per feature. Storage from all purchased modules is combined in one shared pool.
                </p>
                <ul className="note-checklist">
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>Gallery is included with every paid module</span>
                  </li>
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>Storage adds up automatically</span>
                  </li>
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>You can upgrade storage anytime</span>
                  </li>
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>All features use the same shared storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ==================================================================
              SECTION 4: FREQUENTLY ASKED QUESTIONS (2-Column Grid)
              ================================================================== */}
          <section className="pricing-section-block faq-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge badge-faq">?</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Frequently asked questions</h2>
              </div>
            </div>

            <div className="faq-two-col-grid">
              {/* Column 1 */}
              <div className="faq-col">
                {faqs.slice(0, 3).map((item, idx) => {
                  const isOpen = openFaq[idx];
                  return (
                    <div key={idx} className={`faq-item-card ${isOpen ? 'is-open' : ''}`}>
                      <button 
                        type="button" 
                        className="faq-question-btn"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-q-text">{item.q}</span>
                        <span className="faq-plus-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer-panel">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Column 2 */}
              <div className="faq-col">
                {faqs.slice(3, 6).map((item, idx) => {
                  const realIdx = idx + 3;
                  const isOpen = openFaq[realIdx];
                  return (
                    <div key={realIdx} className={`faq-item-card ${isOpen ? 'is-open' : ''}`}>
                      <button 
                        type="button" 
                        className="faq-question-btn"
                        onClick={() => toggleFaq(realIdx)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-q-text">{item.q}</span>
                        <span className="faq-plus-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer-panel">
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Interactive Floating Summary Bar when items are selected */}
          {selectedCount > 0 && (
            <div className="pricing-floating-summary" role="region" aria-label="Cart Summary">
              <div className="summary-info-wrap">
                <div className="summary-breakdown">
                  <span className="summary-modules-count">
                    <strong>{selectedCount}</strong> {selectedCount === 1 ? 'Module' : 'Modules'} Selected
                  </span>
                  <span className="summary-dot">•</span>
                  <span className="summary-storage-val">
                    <strong>{totalStorageGB} GB</strong> Shared Storage
                  </span>
                </div>
                <div className="summary-total-price">
                  <span className="summary-price-lbl">Total:</span>
                  <span className="summary-price-num">₹{totalPrice.toLocaleString()}</span>
                  <span className="summary-price-period">/ month</span>
                </div>
              </div>
              <button 
                type="button" 
                className="summary-checkout-btn"
                onClick={() => setActiveModal('get-started')}
              >
                <span>Continue to Free Trial</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ======================================================================
          FOOTER (Matching ManageStudio 1.5 style)
          ====================================================================== */}
      <footer className="pricing-page-footer">
        <div className="pricing-footer-inner">
          <div className="pricing-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <img 
                src="/managestudio-logo-black.png" 
                alt="ManageStudio" 
                style={{ height: '24px', width: 'auto', display: 'block' }} 
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                1.5
              </span>
            </div>
            <span className="footer-tagline">Built exclusively for wedding photography and cinema studios.</span>
          </div>
          <div className="pricing-footer-links">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                onNavigate && onNavigate('marketing');
              }}
            >
              Back to Home
            </a>
            <a 
              href="https://app.managestudio.io/"
            >
              Log In
            </a>
            <button 
              type="button" 
              onClick={() => onNavigate && onNavigate('contact')}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            >
              Contact Us
            </button>
            <button type="button" onClick={() => setActiveModal('legal')}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => setActiveModal('legal')}>
              Terms of Service
            </button>
            <button type="button" onClick={() => setActiveModal('legal')}>
              Security
            </button>
          </div>
        </div>
      </footer>

      {/* Central Modal Manager */}
      <ManageStudioModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        modalData={null}
        onOpenGetStarted={() => setActiveModal('get-started')}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="ms-toast-container" role="status" aria-live="polite">
          <div className="ms-toast-item">
            <div className="ms-toast-icon-wrap">
              <Check size={16} />
            </div>
            <div className="ms-toast-text">{toastMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}
