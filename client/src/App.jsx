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

// Native Customer Account & Billing Pages
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.jsx';
import CheckoutFailurePage from './pages/CheckoutFailurePage.jsx';
import LegalPage from './pages/LegalPage.jsx';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientToken = urlParams.get('token');

  const getInitialView = () => {
    const pageParam = urlParams.get('page');
    const path = window.location.pathname.replace(/^\/|\/$/g, '');

    if (pageParam === 'login' || path === 'login') return 'login';
    if (pageParam === 'signup' || pageParam === 'register' || path === 'signup') return 'signup';
    if (pageParam === 'forgot-password' || path === 'forgot-password') return 'forgot-password';
    if (pageParam === 'account' || path === 'account') return 'account';
    if (pageParam === 'pricing' || path === 'pricing') return 'pricing';
    if (pageParam === 'checkout-success' || path === 'checkout-success') return 'checkout-success';
    if (pageParam === 'checkout-failure' || path === 'checkout-failure') return 'checkout-failure';
    if (pageParam === 'terms' || path === 'terms') return 'terms';
    if (pageParam === 'privacy' || path === 'privacy') return 'privacy';
    if (pageParam === 'refund-policy' || path === 'refund-policy') return 'refund-policy';
    if (pageParam === 'about' || path === 'about') return 'about';
    if (pageParam === 'contact' || path === 'contact') return 'contact';

    return urlParams.get('view') || 'marketing';
  };

  const [viewMode, setViewMode] = useState(getInitialView);
  const [checkoutPayload, setCheckoutPayload] = useState(null);
  const [checkoutErrorMsg, setCheckoutErrorMsg] = useState(null);

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [albums, setAlbums] = useState([]);
  const [stats, setStats] = useState(null);
  const [studioInfo, setStudioInfo] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [mobilePreviewAlbum, setMobilePreviewAlbum] = useState(null);

  const handleNavigate = (page, payload) => {
    setViewMode(page);

    if (page === 'checkout-success') {
      setCheckoutPayload(payload);
    } else if (page === 'checkout-failure') {
      setCheckoutErrorMsg(typeof payload === 'string' ? payload : payload?.errorMessage || null);
    }

    // Push clean search query to browser URL
    const knownPages = [
      'login', 'signup', 'forgot-password', 'account', 'pricing', 
      'checkout-success', 'checkout-failure', 'terms', 'privacy', 
      'refund-policy', 'about', 'contact'
    ];

    if (knownPages.includes(page)) {
      window.history.pushState({}, '', `?page=${page}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'marketing') {
      window.history.pushState({}, '', '/');
      if (typeof payload === 'string') {
        setTimeout(() => {
          const el = document.getElementById(payload);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const path = window.location.pathname.replace(/^\/|\/$/g, '');

      if (pageParam === 'login' || path === 'login') setViewMode('login');
      else if (pageParam === 'signup' || path === 'signup') setViewMode('signup');
      else if (pageParam === 'forgot-password' || path === 'forgot-password') setViewMode('forgot-password');
      else if (pageParam === 'account' || path === 'account') setViewMode('account');
      else if (pageParam === 'pricing' || path === 'pricing') setViewMode('pricing');
      else if (pageParam === 'checkout-success' || path === 'checkout-success') setViewMode('checkout-success');
      else if (pageParam === 'checkout-failure' || path === 'checkout-failure') setViewMode('checkout-failure');
      else if (pageParam === 'terms' || path === 'terms') setViewMode('terms');
      else if (pageParam === 'privacy' || path === 'privacy') setViewMode('privacy');
      else if (pageParam === 'refund-policy' || path === 'refund-policy') setViewMode('refund-policy');
      else if (pageParam === 'about' || path === 'about') setViewMode('about');
      else if (pageParam === 'contact' || path === 'contact') setViewMode('contact');
      else if (params.get('view')) setViewMode(params.get('view'));
      else setViewMode('marketing');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Scroll Reveal Observer: Triggers each section animation as it enters viewport
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
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

  // 1. Native Login Page
  if (viewMode === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // 2. Native Sign Up Page
  if (viewMode === 'signup') {
    return <SignUpPage onNavigate={handleNavigate} />;
  }

  // 3. Native Forgot Password Page
  if (viewMode === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }

  // 4. Native Account / Profile Page
  if (viewMode === 'account') {
    return <AccountPage onNavigate={handleNavigate} />;
  }

  // 5. Dedicated Pricing Page with Razorpay Checkout
  if (viewMode === 'pricing') {
    return <PricingPage onNavigate={handleNavigate} />;
  }

  // 6. Checkout Success Confirmation Page
  if (viewMode === 'checkout-success') {
    return <CheckoutSuccessPage onNavigate={handleNavigate} checkoutDetails={checkoutPayload} />;
  }

  // 7. Checkout Failure / Cancelled Page
  if (viewMode === 'checkout-failure') {
    return <CheckoutFailurePage onNavigate={handleNavigate} errorMessage={checkoutErrorMsg} />;
  }

  // 8. Legal Pages (Terms, Privacy, Refund Policy)
  if (viewMode === 'terms' || viewMode === 'privacy' || viewMode === 'refund-policy') {
    const initialTab = viewMode === 'refund-policy' ? 'refund' : viewMode;
    return <LegalPage initialTab={initialTab} onNavigate={handleNavigate} />;
  }

  // 9. Dedicated About Page
  if (viewMode === 'about') {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  // 10. Dedicated Contact Page
  if (viewMode === 'contact') {
    return <ContactPage onNavigate={handleNavigate} />;
  }

  // 11. Default marketing landing view
  if (viewMode === 'marketing') {
    return (
      <ManageStudioHero 
        onNavigate={handleNavigate}
        onNavigatePricing={() => handleNavigate('pricing')} 
        onNavigateAbout={() => handleNavigate('about')}
      />
    );
  }

  // 12. Internal studio dashboard (fallback)
  return (
    <div className="app-container">
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

      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAlbumCreated={() => fetchData()}
        onOpenAlbum={(newAlbum) => {
          setIsCreateModalOpen(false);
          setSelectedAlbumId(newAlbum.id);
        }}
      />

      <MobilePreviewModal
        album={mobilePreviewAlbum}
        isOpen={Boolean(mobilePreviewAlbum)}
        onClose={() => setMobilePreviewAlbum(null)}
      />
    </div>
  );
}
