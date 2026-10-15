import React, { useState, useRef, useEffect } from 'react';
import './SharedNavbar.css';

export default function SharedNavbar({
  activePage = 'home',
  onNavigate,
  onOpenLogin,
  onOpenGetStarted,
  isHomepage = false
}) {
  const [modulesOpen, setModulesOpen] = useState(false);
  const dropdownTimerRef = useRef(null);

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setModulesOpen(true);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    dropdownTimerRef.current = setTimeout(() => {
      setModulesOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  const handleHomeClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activePage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('marketing');
    }
  };

  const handlePricingClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activePage === 'pricing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('pricing');
    }
  };

  const handleAboutClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activePage === 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('about');
    }
  };

  const handleContactClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (activePage === 'contact') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('contact');
    }
  };

  const handleModuleItemClick = (e, targetId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    setModulesOpen(false);

    if (activePage === 'home') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (onNavigate) {
      onNavigate('marketing', targetId);
    }
  };

  const modules = [
    {
      id: 'gallery',
      title: 'Gallery',
      desc: 'High-resolution wedding delivery & proofing',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      id: 'album-selection',
      title: 'Album Selection',
      desc: 'Couple selections, limits & approvals',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      id: 'guest-ai',
      title: 'Guest Photo AI',
      desc: 'Face recognition photo lookup for wedding guests',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )
    },
    {
      id: 'song-selection',
      title: 'Song Selection',
      desc: 'Cinematic track curation for highlight films',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    },
    {
      id: 'camera-ingest',
      title: 'Camera Ingest',
      desc: 'Fast card dump and automated studio backup',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )
    }
  ];

  return (
    <header className={`ms-shared-nav-header ${isHomepage || activePage === 'home' ? 'is-homepage' : ''}`}>
      <div className="ms-shared-nav-inner">
        {/* Brand Logo (Far Left) */}
        <a
          href="/"
          className="ms-nav-brand-logo"
          aria-label="ManageStudio Home"
          onClick={handleHomeClick}
        >
          <img
            src="/managestudio-logo-white.png"
            alt="ManageStudio"
            className="ms-nav-brand-logo-img"
          />
        </a>

        {/* Navigation Center (Links 1-4) */}
        <nav className="ms-nav-center" aria-label="Main Navigation">
          {/* 1. Home */}
          <button
            type="button"
            className={`ms-nav-link ${activePage === 'home' ? 'active' : ''}`}
            onClick={handleHomeClick}
          >
            Home
          </button>

          {/* 2. Modules with dropdown */}
          <div
            className="ms-nav-dropdown-trigger"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              className="ms-nav-link ms-nav-dropdown-btn"
              onClick={() => {
                if (modulesOpen) {
                  if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
                  setModulesOpen(false);
                } else {
                  handleDropdownEnter();
                }
              }}
              aria-expanded={modulesOpen}
            >
              <span>Modules</span>
              <svg
                className={`ms-nav-dropdown-chevron ${modulesOpen ? 'open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {modulesOpen && (
              <div
                className="ms-nav-dropdown-menu"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="ms-nav-dropdown-header">STUDIO MODULES</div>
                {modules.map((mod) => (
                  <a
                    key={mod.id}
                    href={`#${mod.id}`}
                    role="button"
                    className="ms-nav-dropdown-item"
                    onClick={(e) => handleModuleItemClick(e, mod.id)}
                  >
                    <div className="ms-nav-dropdown-icon">
                      {mod.icon}
                    </div>
                    <div>
                      <div className="ms-nav-dropdown-title">{mod.title}</div>
                      <div className="ms-nav-dropdown-desc">{mod.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pricing */}
          <button
            type="button"
            className={`ms-nav-link ${activePage === 'pricing' ? 'active' : ''}`}
            onClick={handlePricingClick}
          >
            Pricing
          </button>

          {/* 4. About */}
          <button
            type="button"
            className={`ms-nav-link ${activePage === 'about' ? 'active' : ''}`}
            onClick={handleAboutClick}
          >
            About
          </button>

          {/* 5. Contact */}
          <button
            type="button"
            className={`ms-nav-link ${activePage === 'contact' ? 'active' : ''}`}
            onClick={handleContactClick}
          >
            Contact
          </button>
        </nav>

        {/* Navigation Actions (Far Right: Log In, Get Started) */}
        <div className="ms-nav-actions">
          <a
            href="https://app.managestudio.io/"
            className="ms-nav-login-btn"
            onClick={(e) => {
              if (onOpenLogin) {
                e.preventDefault();
                onOpenLogin();
              }
            }}
          >
            Log In
          </a>

          <a
            href="https://github.com/Codenamesadiq/managestudio1.5/releases/download/Managestudio1.5/ManageStudio-Setup.exe"
            className="ms-nav-cta-btn"
            download="ManageStudio-Setup.exe"
            target="_self"
            rel="noopener noreferrer"
            title="Download ManageStudio for Windows"
          >
            <span>Download</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: '4px' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
