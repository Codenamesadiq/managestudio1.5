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
  Download,
  Laptop,
  Eye,
  Camera,
  FolderKanban,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import ManageStudioModals from './ManageStudioModals.jsx';

export default function PricingPage({ onNavigate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Selected Modules for Interactive Storage & Price Calculator
  // By default, show all 3 paid modules active
  const [selectedModules, setSelectedModules] = useState({
    album: true,
    song: true,
    guestAi: true
  });

  // Selected Additional Storage (null or '50gb' | '200gb' | '500gb' | '1tb')
  const [selectedStorage, setSelectedStorage] = useState(null);

  // FAQ Accordion Open States
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

  // Calculate dynamic storage totals based on selections:
  // 1 paid module = 5 GB
  // 2 paid modules = 10 GB
  // All 3 paid modules = 15 GB
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
  // Paid modules:
  // - Album Selection: ₹499/month
  // - Song Selection: ₹499/month
  // - Guest Photo AI: ₹699/month
  // Additional storage plans:
  // - 50 GB: ₹299/month
  // - 200 GB: ₹599/month
  // - 500 GB: ₹999/month
  // - 1 TB: ₹1,499/month
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
      q: 'How do I purchase a membership or subscribe?',
      a: 'To purchase a membership, download ManageStudio and subscribe directly within the software. The website allows you to explore features and calculate prices, but all membership purchases and subscriptions are handled securely directly inside the desktop application.'
    },
    {
      q: 'Is Gallery included with every paid module?',
      a: 'Yes! Every paid module (Album Selection, Song Selection, or Guest Photo AI) includes full access to the Client Gallery with 5 GB of high-speed cloud storage automatically included.'
    },
    {
      q: 'How does combined storage work when buying multiple modules?',
      a: 'Every purchased paid module includes 5 GB of shared cloud storage. When multiple modules are purchased, your storage combines automatically into one shared account pool: 1 module = 5 GB, 2 modules = 10 GB, and all 3 modules = 15 GB. All modules share this total capacity.'
    },
    {
      q: 'What modules are included free?',
      a: 'Gallery, Camera Ingest, and Studio Files are included automatically at no extra cost whenever you subscribe to any paid module in ManageStudio.'
    },
    {
      q: 'Can I add extra storage later?',
      a: 'Yes, absolutely. You can add additional storage plans (50 GB for ₹299/mo, 200 GB for ₹599/mo, 500 GB for ₹999/mo, or 1 TB for ₹1,499/mo) anytime directly from your studio software settings.'
    },
    {
      q: 'Can I change or cancel my subscribed modules?',
      a: 'Yes, you have complete flexibility. You can add, upgrade, or remove individual modules month-to-month directly within the desktop software.'
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
        />

        {/* Hero Content Area */}
        <div className="pricing-hero-container">
          <div className="pricing-eyebrow">PRICING &amp; PLANS</div>
          <h1 className="pricing-main-headline">
            Transparent modular pricing.
          </h1>
          <p className="pricing-hero-description">
            Choose the modules your wedding studio needs. Every purchased paid module includes Gallery access and 5 GB storage. Combine modules for larger shared storage or add cloud tiers anytime.
          </p>
        </div>
      </section>

      {/* ======================================================================
          WHITE MAIN BODY CONTENT CONTAINER
          ====================================================================== */}
      <main className="pricing-main-content">
        <div className="pricing-body-container">

          {/* ==================================================================
              REQUIREMENT 3: MANDATORY NOTICE FOR MEMBERSHIP PURCHASE
              ================================================================== */}
          <div className="pricing-membership-notice-card" role="region" aria-label="Membership Purchase Notice">
            <div className="pricing-notice-icon-box">
              <Laptop size={26} className="pricing-notice-icon" />
            </div>
            <div className="pricing-notice-content">
              <span className="pricing-notice-pill">DESKTOP SOFTWARE SUBSCRIPTION</span>
              <h2 className="pricing-notice-title">
                To purchase a membership, download ManageStudio and subscribe directly within the software.
              </h2>
              <p className="pricing-notice-description">
                You can view and calculate all module prices and storage options here on our website. However, membership purchases and subscription activations must be completed inside the desktop software. No payments or checkouts are processed on the website.
              </p>
            </div>
            <div className="pricing-notice-action">
              <a 
                href="https://github.com/Codenamesadiq/managestudio1.5/releases/download/Managestudio1.5/ManageStudio-Setup.exe"
                className="pricing-notice-download-btn"
                download="ManageStudio-Setup.exe"
                target="_self"
                rel="noopener noreferrer"
              >
                <Download size={16} />
                <span>Download ManageStudio</span>
              </a>
              <span className="pricing-notice-platform">Windows 10 / 11 Installer</span>
            </div>
          </div>

          {/* ==================================================================
              SECTION 1: PAID MODULES
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge">1</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Paid Modules</h2>
                <p className="pricing-step-subtitle">
                  Select the creative tools your studio requires. Every purchased paid module includes Gallery access and 5 GB storage.
                </p>
              </div>
            </div>

            {/* 3 Module Cards Grid */}
            <div className="pricing-modules-grid">
              {/* Card 1: Album Selection */}
              <div className={`pricing-module-card ${selectedModules.album ? 'is-selected' : ''}`}>
                <div className="pm-card-top">
                  <div className="pm-card-icon-wrap pm-icon-teal">
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
                      Client photo proofing portal with selection limits, couple comments, and star ratings.
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
                    <span>Star ratings, favorites &amp; comments</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Automated selection limits &amp; approvals</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Watermark protection &amp; security</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>CSV &amp; Lightroom filename export</span>
                  </li>
                  <li className="pm-feature-highlight">
                    <Check size={15} className="pm-check-icon" />
                    <strong>Includes Gallery access &amp; 5 GB storage</strong>
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
                  <div className="pm-card-icon-wrap pm-icon-teal">
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
                      Curated soundtrack selection library for wedding teasers and cinematic highlight films.
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
                    <span>Client song curation portal</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Audio waveform preview &amp; BPM info</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Occasion playlists (Shaadi, Haldi, Sangeet)</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Premiere Pro &amp; FCPXML timeline export</span>
                  </li>
                  <li className="pm-feature-highlight">
                    <Check size={15} className="pm-check-icon" />
                    <strong>Includes Gallery access &amp; 5 GB storage</strong>
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
                  <div className="pm-card-icon-wrap pm-icon-teal">
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
                      Selfie-based face recognition for instant guest photo lookups and QR downloads.
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
                    <span>Selfie-based AI face matching</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Instant wedding guest photo lookup</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Event QR code sharing &amp; mobile portal</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Dedicated attendee download page</span>
                  </li>
                  <li>
                    <Check size={15} className="pm-check-icon" />
                    <span>Privacy controls &amp; watermark security</span>
                  </li>
                  <li className="pm-feature-highlight">
                    <Check size={15} className="pm-check-icon" />
                    <strong>Includes Gallery access &amp; 5 GB storage</strong>
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
              REQUIREMENT 2: INCLUDED MODULES (Gallery, Camera Ingest, Studio Files)
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge badge-included">
                <Check size={16} strokeWidth={2.8} />
              </div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Included Modules</h2>
                <p className="pricing-step-subtitle">
                  These essential studio modules are automatically included with ManageStudio at ₹0 when you purchase any paid module:
                </p>
              </div>
            </div>

            <div className="included-modules-grid">
              {/* Included 1: Gallery */}
              <div className="included-module-card">
                <div className="inc-card-top">
                  <div className="inc-icon-wrap">
                    <Eye size={22} />
                  </div>
                  <span className="inc-badge">Included Free</span>
                </div>
                <h3 className="inc-title">Gallery</h3>
                <p className="inc-desc">
                  Stunning, high-resolution client proofing and final wedding delivery with one-link sharing.
                </p>
                <ul className="inc-features">
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Full-resolution photo &amp; video presentation</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>One-link private client galleries</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Single-click high-speed zip downloads</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Custom studio branding &amp; dark mode</span>
                  </li>
                </ul>
              </div>

              {/* Included 2: Camera Ingest */}
              <div className="included-module-card">
                <div className="inc-card-top">
                  <div className="inc-icon-wrap">
                    <Camera size={22} />
                  </div>
                  <span className="inc-badge">Included Free</span>
                </div>
                <h3 className="inc-title">Camera Ingest</h3>
                <p className="inc-desc">
                  High-speed multi-card dump engine with strict checksum verification for flawless data transfers.
                </p>
                <ul className="inc-features">
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Multi-card parallel memory card ingest</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Checksum verification (zero corrupted RAWs)</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Automated date &amp; camera body directory structuring</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Live ingest progress and speed monitoring</span>
                  </li>
                </ul>
              </div>

              {/* Included 3: Studio Files */}
              <div className="included-module-card">
                <div className="inc-card-top">
                  <div className="inc-icon-wrap">
                    <FolderKanban size={22} />
                  </div>
                  <span className="inc-badge">Included Free</span>
                </div>
                <h3 className="inc-title">Studio Files</h3>
                <p className="inc-desc">
                  Centralized local &amp; cloud asset management for client contracts, invoices, and deliverables.
                </p>
                <ul className="inc-features">
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Centralized shoot &amp; project file organization</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Contract, receipt &amp; booking attachments</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Fast studio-wide search and tagging</span>
                  </li>
                  <li>
                    <Check size={14} className="inc-check" />
                    <span>Offline-first local file caching &amp; backup</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ==================================================================
              SECTION 2: STORAGE INCLUDED WITH PAID MODULES
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge">2</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Storage Included with Paid Modules</h2>
                <p className="pricing-step-subtitle">
                  Every purchased paid module includes Gallery access and 5 GB storage. When you purchase multiple modules, your storage combines automatically into one shared account pool.
                </p>
              </div>
            </div>

            {/* Storage Allowance Tier Rule Box */}
            <div className="storage-tier-rules-card">
              <div className="tier-rules-header">
                <span className="tier-rules-badge">COMBINED STORAGE ALLOWANCE</span>
                <h3 className="tier-rules-title">How Combined Storage Works</h3>
                <p className="tier-rules-desc">
                  Storage is shared across your entire studio workspace, rather than restricted per-module. Gallery access is always included with every paid module.
                </p>
              </div>

              <div className="storage-tiers-grid">
                <div className={`storage-tier-item ${selectedCount === 1 ? 'is-tier-active' : ''}`}>
                  <div className="tier-count">1 Paid Module</div>
                  <div className="tier-arrow">→</div>
                  <div className="tier-storage">5 GB Shared Storage</div>
                  <div className="tier-note">Includes Gallery access</div>
                </div>

                <div className={`storage-tier-item ${selectedCount === 2 ? 'is-tier-active' : ''}`}>
                  <div className="tier-count">2 Paid Modules</div>
                  <div className="tier-arrow">→</div>
                  <div className="tier-storage">10 GB Shared Storage</div>
                  <div className="tier-note">5 GB + 5 GB combined</div>
                </div>

                <div className={`storage-tier-item ${selectedCount === 3 ? 'is-tier-active' : ''}`}>
                  <div className="tier-count">All 3 Paid Modules</div>
                  <div className="tier-arrow">→</div>
                  <div className="tier-storage">15 GB Shared Storage</div>
                  <div className="tier-note">Maximum included tier</div>
                </div>
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
                    Total Included Storage<br />
                    <span>({selectedCount} {selectedCount === 1 ? 'module' : 'modules'} selected)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================================
              SECTION 3: ADDITIONAL CLOUD STORAGE PLANS
              ================================================================== */}
          <section className="pricing-section-block">
            <div className="pricing-section-header">
              <div className="pricing-step-badge badge-warm">3</div>
              <div className="pricing-step-text">
                <h2 className="pricing-step-title">Additional Storage Plans</h2>
                <p className="pricing-step-subtitle">
                  Need extra capacity for high-volume wedding seasons? Add additional cloud storage plans at any time.
                </p>
              </div>
            </div>

            <div className="storage-split-layout">
              {/* Left Column: 4 Storage Cards */}
              <div className="storage-cards-grid">
                {/* 50 GB Card: ₹299/month */}
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

                {/* 200 GB Card: ₹599/month */}
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

                {/* 500 GB Card: ₹999/month */}
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

                {/* 1 TB Card: ₹1,499/month */}
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
                  <h3 className="note-card-title">Shared Storage Pool</h3>
                </div>
                <p className="note-card-desc">
                  All storage in ManageStudio is account-level. The 5 GB per paid module automatically aggregates into one single quota shared across all galleries, proofing sessions, and client selections.
                </p>
                <ul className="note-checklist">
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>Gallery access is included with every paid module</span>
                  </li>
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>1 module = 5 GB, 2 modules = 10 GB, 3 modules = 15 GB</span>
                  </li>
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>Additional plans expand your total account storage</span>
                  </li>
                  <li>
                    <Check size={14} className="note-check-icon" />
                    <span>Manage subscriptions directly inside ManageStudio</span>
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
            <div className="pricing-floating-summary" role="region" aria-label="Calculated Plan Summary">
              <div className="summary-info-wrap">
                <div className="summary-breakdown">
                  <span className="summary-modules-count">
                    <strong>{selectedCount}</strong> {selectedCount === 1 ? 'Paid Module' : 'Paid Modules'} Selected
                  </span>
                  <span className="summary-dot">•</span>
                  <span className="summary-storage-val">
                    <strong>{totalStorageGB} GB</strong> Total Shared Storage
                  </span>
                </div>
                <div className="summary-total-price">
                  <span className="summary-price-lbl">Estimated Price:</span>
                  <span className="summary-price-num">₹{totalPrice.toLocaleString()}</span>
                  <span className="summary-price-period">/ month</span>
                </div>
              </div>

              <div className="summary-actions-wrap">
                <span className="summary-software-note">Subscribe inside software after download</span>
                <a 
                  href="https://github.com/Codenamesadiq/managestudio1.5/releases/download/Managestudio1.5/ManageStudio-Setup.exe"
                  className="summary-checkout-btn"
                  download="ManageStudio-Setup.exe"
                  target="_self"
                  rel="noopener noreferrer"
                  title="Download ManageStudio for Windows"
                >
                  <Download size={16} />
                  <span>Download ManageStudio</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ======================================================================
          FOOTER
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
