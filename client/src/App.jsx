import React, { useState, useEffect } from 'react';
import ManageStudioHero from './components/ManageStudioHero.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import DashboardView from './pages/DashboardView.jsx';
import StudioAlbumView from './components/StudioAlbumView.jsx';
import CreateAlbumModal from './components/CreateAlbumModal.jsx';
import MobilePreviewModal from './components/MobilePreviewModal.jsx';
import ClientPortal from './components/ClientPortal.jsx';

import PricingPage from './components/PricingPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import ContactPage from './components/ContactPage.jsx';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientToken = urlParams.get('token');
  
  const getInitialView = () => {
    if (urlParams.get('page') === 'login' || window.location.pathname === '/login' || urlParams.get('view') === 'login') {
      window.location.replace('https://app.managestudio.io/');
      return 'marketing';
    }
    if (urlParams.get('page') === 'pricing' || window.location.pathname === '/pricing') {
      return 'pricing';
    }
    if (urlParams.get('page') === 'about' || window.location.pathname === '/about') {
      return 'about';
    }
    if (urlParams.get('page') === 'contact' || window.location.pathname === '/contact') {
      return 'contact';
    }
    return urlParams.get('view') || 'marketing';
  };

  const [viewMode, setViewMode] = useState(getInitialView);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [albums, setAlbums] = useState([]);
  const [stats, setStats] = useState(null);
  const [studioInfo, setStudioInfo] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [mobilePreviewAlbum, setMobilePreviewAlbum] = useState(null);

  const handleNavigate = (page, targetId) => {
    if (page === 'login') {
      window.location.href = 'https://app.managestudio.io/';
      return;
    }
    setViewMode(page);
    if (page === 'pricing') {
      window.history.pushState({}, '', '?page=pricing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'about') {
      window.history.pushState({}, '', '?page=about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'contact') {
      window.history.pushState({}, '', '?page=contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'marketing') {
      window.history.pushState({}, '', window.location.pathname === '/pricing' || window.location.pathname === '/about' || window.location.pathname === '/contact' ? '/' : window.location.pathname);
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('page') === 'login' || window.location.pathname === '/login' || params.get('view') === 'login') {
        window.location.replace('https://app.managestudio.io/');
        return;
      }
      if (params.get('page') === 'pricing' || window.location.pathname === '/pricing') {
        setViewMode('pricing');
      } else if (params.get('page') === 'about' || window.location.pathname === '/about') {
        setViewMode('about');
      } else if (params.get('page') === 'contact' || window.location.pathname === '/contact') {
        setViewMode('contact');
      } else if (params.get('view')) {
        setViewMode(params.get('view'));
      } else {
        setViewMode('marketing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Scroll Reveal Observer: Triggers each section animation only once as it enters the viewport
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target); // Trigger only once
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      });

      const targets = document.querySelectorAll(
        '.ms-card, .ms-suite-header, .mac-window-card, .ms-highlights-left, .ms-highlights-features-grid, .os-headline-group, .os-features-grid, .portal-content-col, .portal-visual-col, .storage-header-group, .storage-cards-grid, .bottom-cta-inner, .pricing-header, .pricing-plans-grid, .pricing-faq-section, .about-hero-section, .about-values-grid, .contact-hero-content, .contact-form-card, .contact-info-card'
      );

      targets.forEach(el => {
        if (!el.classList.contains('ms-scroll-reveal')) {
          el.classList.add('ms-scroll-reveal');
        }
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 60);

    return () => clearTimeout(timeoutId);
  }, [viewMode]);

  const fetchData = async () => {
    try {
      const [statsRes, albumsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/albums')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setStudioInfo(statsData.studio);
      }

      if (albumsRes.ok) {
        const albumsData = await albumsRes.json();
        setAlbums(albumsData);
      }
    } catch (err) {
      console.error('Failed to load studio data:', err);
    }
  };

  useEffect(() => {
    if (!clientToken) {
      fetchData();
    }
  }, [clientToken]);

  // If opening via direct private client link, render the standalone Client Portal
  if (clientToken) {
    return (
      <div style={{ backgroundColor: '#F5F5F7', minHeight: '100vh', padding: '0' }}>
        <ClientPortal token={clientToken} />
      </div>
    );
  }


  // Dedicated Pricing Page
  if (viewMode === 'pricing') {
    return <PricingPage onNavigate={handleNavigate} />;
  }

  // Dedicated About Page
  if (viewMode === 'about') {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  // Dedicated Contact Page
  if (viewMode === 'contact') {
    return <ContactPage onNavigate={handleNavigate} />;
  }

  // Default marketing landing view matching the Manage Studio 1.5 website
  if (viewMode === 'marketing') {
    return (
      <ManageStudioHero 
        onNavigate={handleNavigate}
        onNavigatePricing={() => handleNavigate('pricing')} 
        onNavigateAbout={() => handleNavigate('about')}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Studio Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedAlbumId(null);
        }}
        storageStats={{
          used: stats?.storageUsed || '125 GB',
          limit: stats?.storageLimit || '500 GB'
        }}
      />

      {/* Main Studio Work Area */}
      <div className="main-content">
        <Header studioInfo={studioInfo} />

        {selectedAlbumId ? (
          <StudioAlbumView
            albumId={selectedAlbumId}
            onBack={() => {
              setSelectedAlbumId(null);
              fetchData();
            }}
            onPreviewMobile={(album) => setMobilePreviewAlbum(album)}
          />
        ) : (
          <DashboardView
            albums={albums}
            stats={stats}
            onRefreshAlbums={fetchData}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenAlbum={(album) => setSelectedAlbumId(album.id)}
            onPreviewMobile={(album) => setMobilePreviewAlbum(album)}
          />
        )}
      </div>

      {/* Modal 1: 3-step Create Album Wizard */}
      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAlbumCreated={() => fetchData()}
        onOpenAlbum={(newAlbum) => {
          setIsCreateModalOpen(false);
          setSelectedAlbumId(newAlbum.id);
        }}
      />

      {/* Modal 2: Mobile iPhone Preview Modal */}
      <MobilePreviewModal
        album={mobilePreviewAlbum}
        isOpen={Boolean(mobilePreviewAlbum)}
        onClose={() => setMobilePreviewAlbum(null)}
      />
    </div>
  );
}
