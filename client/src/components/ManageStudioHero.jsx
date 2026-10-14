import React, { useState } from 'react';
import './ManageStudioHero.css';
import SharedNavbar from './SharedNavbar.jsx';
import GalleryShowcase from './GalleryShowcase.jsx';
import PixiesetFeatureCards from './PixiesetFeatureCards.jsx';
import HomepageBottomSections from './HomepageBottomSections.jsx';
import ManageStudioModals from './ManageStudioModals.jsx';
import {
  Camera,
  Users,
  TrendingUp,
  ArrowRight,
  Play,
  Zap,
  ShieldCheck,
  Cloud,
  X
} from 'lucide-react';

export default function ManageStudioHero({ onNavigatePricing, onNavigateAbout, onNavigate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleOpenGetStarted = () => {
    setActiveModal('get-started');
  };

  const handleOpenLogin = () => {
    window.location.href = 'https://app.managestudio.io/';
  };

  const handleOpenWatchVideo = () => {
    setVideoModalOpen(true);
  };

  const handleOpenPricing = () => {
    if (onNavigate) {
      onNavigate('pricing');
    } else if (onNavigatePricing) {
      onNavigatePricing();
    } else {
      setActiveModal('pricing');
    }
  };

  const handleOpenAbout = () => {
    if (onNavigate) {
      onNavigate('about');
    } else if (onNavigateAbout) {
      onNavigateAbout();
    }
  };

  const handleOpenContact = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  const handleOpenFeature = (data) => {
    setModalData(data);
    setActiveModal('feature-details');
  };

  const handleOpenDashboardInfo = () => {
    setActiveModal('dashboard-info');
  };

  const handleOpenClientPortalInfo = () => {
    setActiveModal('client-portal-info');
  };

  const handleOpenLegal = (title) => {
    setModalData({ title });
    setActiveModal('legal');
  };

  return (
    <div className="managestudio-landing">
      {/* ======================================================================
          1. HERO SECTION (Dark cinematic background, eyebrow, headline, 3 badges, CTAs)
          ====================================================================== */}
      <section className="hero-section" id="hero">
        {/* Full width cinematic background video */}
        <div className="video-background-wrapper">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video"
            poster="/hero-poster.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {/* Dark gradient overlay for text readability */}
          <div className="hero-gradient-overlay" />
        </div>

        {/* Unified Top Navigation */}
        <SharedNavbar
          activePage="home"
          onNavigate={(page, id) => {
            if (onNavigate) {
              onNavigate(page, id);
            } else if (page === 'pricing' && onNavigatePricing) {
              onNavigatePricing();
            } else if (page === 'about' && onNavigateAbout) {
              onNavigateAbout();
            } else if (page === 'marketing' && id) {
              const el = document.getElementById(id);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onOpenLogin={handleOpenLogin}
          onOpenGetStarted={handleOpenGetStarted}
          isHomepage={true}
        />

        {/* Hero Content (Left-aligned) */}
        <div className="hero-content-container">
          <div className="hero-text-block">
            {/* Eyebrow */}
            <div className="hero-eyebrow">
              ALL IN ONE SOLUTION FOR WEDDING STUDIOS
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              Everything your studio needs.<br />
              In one place.
            </h1>

            {/* Description */}
            <p className="hero-description">
              ManageStudio brings wedding photography workflows together, from camera ingest and photo delivery to client selections, bookings, billing, and expenses.
            </p>

            {/* 3 Compact Benefit Items with primary green icons */}
            <div className="hero-benefits-row">
              <div className="hero-benefit-item">
                <div className="hero-benefit-icon-box">
                  <Camera size={18} strokeWidth={2.2} />
                </div>
                <div className="hero-benefit-text">
                  <span className="hero-benefit-title">Manage</span>
                  <span className="hero-benefit-sub">Your Work</span>
                </div>
              </div>

              <div className="hero-benefit-item">
                <div className="hero-benefit-icon-box">
                  <Users size={18} strokeWidth={2.2} />
                </div>
                <div className="hero-benefit-text">
                  <span className="hero-benefit-title">Delight</span>
                  <span className="hero-benefit-sub">Your Clients</span>
                </div>
              </div>

              <div className="hero-benefit-item">
                <div className="hero-benefit-icon-box">
                  <TrendingUp size={18} strokeWidth={2.2} />
                </div>
                <div className="hero-benefit-text">
                  <span className="hero-benefit-title">Grow</span>
                  <span className="hero-benefit-sub">Your Business</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Subtext */}
            <div className="hero-cta-group">
              <div className="hero-actions">
                <button 
                  type="button" 
                  className="hero-primary-btn"
                  onClick={handleOpenGetStarted}
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} strokeWidth={2.4} />
                </button>

                <button 
                  type="button" 
                  className="hero-secondary-btn"
                  onClick={handleOpenWatchVideo}
                >
                  <Play size={14} fill="#1ABC9C" stroke="#1ABC9C" />
                  <span>Watch Video</span>
                </button>
              </div>
              <div className="hero-subtext">No credit card required</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          2. BOTTOM BENEFITS STRIP (Horizontal strip directly below hero)
          ====================================================================== */}
      <section className="ms-hero-benefits-strip" aria-label="Key Platform Benefits">
        <div className="ms-benefits-strip-container">
          <div className="ms-benefit-strip-item">
            <div className="ms-benefit-strip-icon">
              <Zap size={26} strokeWidth={2.2} />
            </div>
            <div className="ms-benefit-strip-info">
              <div className="ms-benefit-strip-title">All Key Workflows</div>
              <div className="ms-benefit-strip-subtitle">In One Platform</div>
            </div>
          </div>

          <div className="ms-benefit-strip-divider" />

          <div className="ms-benefit-strip-item">
            <div className="ms-benefit-strip-icon">
              <ShieldCheck size={26} strokeWidth={2.2} />
            </div>
            <div className="ms-benefit-strip-info">
              <div className="ms-benefit-strip-title">Organized Client Selections</div>
              <div className="ms-benefit-strip-subtitle">Fast Approvals & Proofing</div>
            </div>
          </div>

          <div className="ms-benefit-strip-divider" />

          <div className="ms-benefit-strip-item">
            <div className="ms-benefit-strip-icon">
              <Cloud size={26} strokeWidth={2.2} />
            </div>
            <div className="ms-benefit-strip-info">
              <div className="ms-benefit-strip-title">Cloud Storage</div>
              <div className="ms-benefit-strip-subtitle">Access Anywhere</div>
            </div>
          </div>

          <div className="ms-benefit-strip-divider" />

          <div className="ms-benefit-strip-item ms-benefit-strip-quote-item">
            <div className="ms-benefit-strip-quote-mark">“</div>
            <p className="ms-benefit-strip-quote-text">
              A simpler, more organized way to manage your entire wedding workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Video Walkthrough Modal */}
      {videoModalOpen && (
        <div 
          className="ms-video-modal-backdrop" 
          onClick={() => setVideoModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="ms-video-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="ms-video-modal-close" 
              onClick={() => setVideoModalOpen(false)}
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            <div className="ms-video-modal-content">
              <video
                autoPlay
                controls
                playsInline
                className="ms-video-player"
                poster="/hero-poster.jpg"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
                <source src="/videos/hero.webm" type="video/webm" />
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          2. CLIENT GALLERY SHOWCASE SECTION (Functional 3-Tab System)
          ====================================================================== */}
      <GalleryShowcase />

      {/* ======================================================================
          3. PIXIESET FEATURE CARDS SECTION (Placed below Gallery Showcase)
          ====================================================================== */}
      <PixiesetFeatureCards 
        onLearnMore={handleOpenFeature}
      />

      {/* ======================================================================
          4. FOUR HOMEPAGE SECTIONS:
             1. Studio Highlights (Stats & product metrics)
             2. Testimonials (6 cards in 3x2 grid)
             3. Final Call to Action (spacious with showcase image)
             4. Footer (near black matching Pixieset proportions)
          ====================================================================== */}
      <HomepageBottomSections 
        onGetStarted={handleOpenGetStarted}
        onLogin={handleOpenLogin}
        onPricing={handleOpenPricing}
        onAbout={handleOpenAbout}
        onContact={handleOpenContact}
        onDashboardInfo={handleOpenDashboardInfo}
        onClientPortalInfo={handleOpenClientPortalInfo}
        onLegal={handleOpenLegal}
      />

      {/* Central Modal Manager */}
      <ManageStudioModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        modalData={modalData}
        onOpenGetStarted={handleOpenGetStarted}
      />
    </div>
  );
}
