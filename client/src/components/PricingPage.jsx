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
  Sparkles,
  CreditCard,
  Lock,
  AlertCircle
} from 'lucide-react';
import ManageStudioModals from './ManageStudioModals.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { calculatePlanSummary, PAID_MODULES, INCLUDED_MODULES, STORAGE_ADDONS } from '../config/pricingConfig.js';
import { API_BASE_URL } from '../config/apiConfig.js';

export default function PricingPage({ onNavigate }) {
  const { currentUser, userProfile, studio, getIdToken } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Selected Modules for Interactive Storage & Price Calculator
  // By default, show all 3 paid modules active
  const [selectedModules, setSelectedModules] = useState({
    album: true,
    song: true,
    guestAi: true
  });

  // Selected Additional Storage (null or '50gb' | '200gb' | '500gb' | '1tb')
  const [selectedStorage, setSelectedStorage] = useState(null);

  // Coupon Discount State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  const handleApplyCoupon = () => {
    const clean = (couponInput || '').trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const testSummary = calculatePlanSummary(selectedModuleIds, selectedStorage, clean);
    if (testSummary.couponError) {
      setCouponError(testSummary.couponError);
      return;
    }
    if (!testSummary.couponCode) {
      setCouponError(`Invalid coupon code "${clean}". Please verify and try again.`);
      return;
    }
    setAppliedCoupon(clean);
    setCouponError(null);
    handleShowToast(`Coupon ${clean} applied!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
    handleShowToast('Coupon removed');
  };

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

  // Convert UI state to module IDs array
  const selectedModuleIds = [];
  if (selectedModules.album) selectedModuleIds.push('album-selection');
  if (selectedModules.song) selectedModuleIds.push('song-selection');
  if (selectedModules.guestAi) selectedModuleIds.push('guest-photo-ai');

  // Authoritative calculation via shared config with applied coupon
  const planSummary = calculatePlanSummary(selectedModuleIds, selectedStorage, appliedCoupon);
  const selectedCount = planSummary.selectedCount;
  const baseStorageGB = planSummary.baseStorageGb;
  const totalStorageGB = planSummary.totalStorageGb;
  const totalPrice = planSummary.totalPrice;

  // Razorpay Checkout Handler
  const handleCheckout = async () => {
    if (!currentUser) {
      if (onNavigate) onNavigate('login');
      return;
    }

    if (selectedCount === 0) {
      alert('Please select at least one paid module to subscribe.');
      return;
    }

    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const token = await getIdToken();

      // Module mapping for compatibility between web frontend and backend services
      const moduleKeyMap = {
        'album-selection': 'photoSelection',
        'song-selection': 'songSelection',
        'guest-photo-ai': 'guestFinder'
      };
      let storageGbNumber = 0;
      if (selectedStorage === '1tb') storageGbNumber = 1000;
      else if (selectedStorage === '500gb') storageGbNumber = 500;
      else if (selectedStorage === '200gb') storageGbNumber = 200;
      else if (selectedStorage === '50gb') storageGbNumber = 50;

      // Clean authoritative module payload (never include free 'gallery' as a billable module)
      const orderPayload = {
        modules: selectedModuleIds,
        selectedModules: selectedModuleIds,
        storageGb: totalStorageGB,
        selectedStorageGb: storageGbNumber,
        selectedStorageId: selectedStorage,
        storageId: selectedStorage,
        couponCode: appliedCoupon || null,
        studioId: studio?.studioId || `std_${currentUser.uid.slice(0, 8)}`
      };

      // 1. Create Order on backend
      const targetUrl = `${API_BASE_URL}/api/payments/create-order`;
      const orderRes = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const contentType = orderRes.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await orderRes.text();
        throw new Error(`The payment gateway returned an unexpected response (${orderRes.status}). Please try again in a few moments.`);
      }

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || orderData.message || 'Failed to create payment order');
      }

      // Authoritative pricing check: Ensure Razorpay order matches final payable amount exactly
      if (orderData.amount && orderData.amount !== planSummary.amountInPaise) {
        console.error(`[Checkout Pricing Mismatch]: Gateway returned ${orderData.amount} paise, expected ${planSummary.amountInPaise} paise.`);
        throw new Error(`Pricing mismatch detected: Gateway returned ₹${(orderData.amount / 100).toFixed(2)}, expected ₹${(planSummary.amountInPaise / 100).toFixed(2)}. Please contact support.`);
      }

      // 2. Dynamically load Razorpay SDK
      const loadScript = () => new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const loaded = await loadScript();
      if (!loaded) {
        throw new Error('Failed to load Razorpay checkout script from CDN. Please check your internet connection.');
      }

      // If in sandbox mock mode without live keys:
      if (orderData.keyId === 'rzp_test_placeholder') {
        const verifyPayload = {
          orderId: orderData.orderId,
          razorpay_order_id: orderData.orderId,
          paymentId: `pay_test_${Date.now()}`,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          signature: 'test_sandbox_signature',
          razorpay_signature: 'test_sandbox_signature',
          studioId: studio?.studioId || `std_${currentUser.uid.slice(0, 8)}`,
          modules: selectedModuleIds,
          storageGb: totalStorageGB
        };

        const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-authorization': `Bearer ${token}`
          },
          body: JSON.stringify(verifyPayload)
        });

        const verifyContentType = verifyRes.headers.get('content-type') || '';
        let verifyData = {};
        if (verifyContentType.includes('application/json')) {
          verifyData = await verifyRes.json();
        }

        if (verifyRes.ok && verifyData.success !== false) {
          if (onNavigate) {
            onNavigate('checkout-success', {
              orderId: orderData.orderId,
              paymentId: verifyPayload.paymentId,
              planSummary
            });
          }
          return;
        }
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ManageStudio 1.5',
        description: `${selectedCount} Studio Modules (${totalStorageGB} GB Shared Storage)`,
        order_id: orderData.orderId,
        prefill: {
          name: currentUser.displayName || userProfile?.displayName || '',
          email: currentUser.email || ''
        },
        theme: {
          color: '#D4AF7C'
        },
        handler: async function (response) {
          try {
            const verifyPayload = {
              orderId: response.razorpay_order_id || orderData.orderId,
              razorpay_order_id: response.razorpay_order_id || orderData.orderId,
              paymentId: response.razorpay_payment_id,
              razorpay_payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              razorpay_signature: response.razorpay_signature,
              studioId: studio?.studioId || `std_${currentUser.uid.slice(0, 8)}`,
              modules: selectedModuleIds,
              storageGb: totalStorageGB
            };

            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-authorization': `Bearer ${token}`
              },
              body: JSON.stringify(verifyPayload)
            });

            const verifyContentType = verifyRes.headers.get('content-type') || '';
            let verifyData = {};
            if (verifyContentType.includes('application/json')) {
              verifyData = await verifyRes.json();
            }

            if (verifyRes.ok && verifyData.success !== false) {
              if (onNavigate) {
                onNavigate('checkout-success', {
                  orderId: response.razorpay_order_id || orderData.orderId,
                  paymentId: response.razorpay_payment_id,
                  planSummary
                });
              }
            } else {
              if (onNavigate) {
                onNavigate('checkout-failure', {
                  errorMessage: verifyData.error || verifyData.message || 'Payment signature verification failed'
                });
              }
            }
          } catch (vErr) {
            if (onNavigate) {
              onNavigate('checkout-failure', { errorMessage: vErr.message });
            }
          }
        },
        modal: {
          ondismiss: function () {
            setCheckingOut(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        if (onNavigate) {
          onNavigate('checkout-failure', {
            errorMessage: resp.error?.description || 'Payment cancelled or failed'
          });
        }
      });
      rzp.open();
    } catch (err) {
      setCheckoutError(err.message || 'Payment initiation failed.');
      setCheckingOut(false);
    }
  };

  const faqs = [
    {
      q: 'How do I purchase a membership or subscribe?',
      a: 'Select your desired creative modules and storage tier directly on this page, then click Proceed to Checkout. Payment is processed securely via Razorpay in Indian Rupees (INR). Upon verified payment, your subscription entitlements activate instantly across both the web app and the desktop software.'
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
      a: 'Yes, absolutely. You can add additional storage plans (50 GB for ₹299/mo, 200 GB for ₹599/mo, 500 GB for ₹999/mo, or 1 TB for ₹1,499/mo) anytime directly from your studio account dashboard or on this page.'
    },
    {
      q: 'Can I change or cancel my subscribed modules?',
      a: 'Yes, you have complete flexibility. You can add, upgrade, or cancel individual modules month-to-month directly within your Account profile or settings.'
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
          onOpenLogin={() => { onNavigate && onNavigate('login'); }}
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
              DYNAMIC ACCOUNT & CHECKOUT NOTICE
              ================================================================== */}
          <div className="pricing-membership-notice-card" role="region" aria-label="Subscription Notice">
            <div className="pricing-notice-icon-box">
              <CreditCard size={26} className="pricing-notice-icon" color="#D4AF7C" />
            </div>
            <div className="pricing-notice-content">
              <span className="pricing-notice-pill">INSTANT ONLINE ACTIVATION</span>
              <h2 className="pricing-notice-title">
                {currentUser 
                  ? `Welcome, ${currentUser.displayName || studio?.studioName || 'Studio Owner'}! You're ready to subscribe.`
                  : 'Subscribe online with verified Razorpay checkout & instant cloud activation.'
                }
              </h2>
              <p className="pricing-notice-description">
                {currentUser ? (
                  <>
                    Logged in as <strong>{currentUser.email}</strong>. Select your desired creative modules and optional cloud storage add-on below. Your subscription entitlements will activate immediately upon verified checkout.
                  </>
                ) : (
                  <>
                    Choose the tools your studio needs below. Sign in to your account or create one during checkout to activate your subscription instantly across the web platform and desktop software suite.
                  </>
                )}
              </p>
            </div>
            <div className="pricing-notice-action">
              {currentUser ? (
                <button
                  type="button"
                  className="pricing-notice-download-btn"
                  style={{ background: 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)', color: '#FFFFFF', border: 'none' }}
                  onClick={() => onNavigate && onNavigate('account')}
                >
                  <ShieldCheck size={16} />
                  <span>View Account Status</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="pricing-notice-download-btn"
                  onClick={() => onNavigate && onNavigate('signup')}
                >
                  <Sparkles size={16} />
                  <span>Create Account First</span>
                </button>
              )}
              <span className="pricing-notice-platform">Secured by Razorpay</span>
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

                {/* Coupon Code Section */}
                <div className="summary-coupon-container">
                  <div className="summary-coupon-input-wrap">
                    <input 
                      type="text" 
                      className="summary-coupon-input"
                      placeholder="Enter coupon"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (appliedCoupon) handleRemoveCoupon();
                          else handleApplyCoupon();
                        }
                      }}
                      disabled={Boolean(appliedCoupon)}
                    />
                    {appliedCoupon ? (
                      <button type="button" className="summary-coupon-btn btn-remove" onClick={handleRemoveCoupon}>
                        Remove
                      </button>
                    ) : (
                      <button type="button" className="summary-coupon-btn btn-apply" onClick={handleApplyCoupon}>
                        Apply
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <span className="summary-coupon-err">
                      <AlertCircle size={12} /> {couponError}
                    </span>
                  )}
                  {appliedCoupon && planSummary.coupon && (
                    <span className="summary-coupon-success">
                      <Sparkles size={12} /> {planSummary.coupon.code}: {planSummary.coupon.discountPercent}% off applied!
                    </span>
                  )}
                </div>

                <div className="summary-total-price">
                  <span className="summary-price-lbl">Monthly Total:</span>
                  {planSummary.discountAmount > 0 && (
                    <span className="summary-original-price">
                      ₹{planSummary.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="summary-price-num">₹{totalPrice.toLocaleString()}</span>
                  <span className="summary-price-period">/ month</span>
                  {planSummary.discountAmount > 0 && (
                    <span className="summary-discount-pill">
                      Save ₹{planSummary.discountAmount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="summary-actions-wrap">
                {checkoutError && (
                  <span style={{ fontSize: '12px', color: '#EF4444', marginRight: '8px' }}>
                    {checkoutError}
                  </span>
                )}
                <span className="summary-software-note">
                  {currentUser ? 'Instant activation on web & desktop' : 'Sign in or create account to complete purchase'}
                </span>
                <button
                  type="button"
                  className="summary-checkout-btn"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  style={{ cursor: checkingOut ? 'wait' : 'pointer' }}
                >
                  <Lock size={15} />
                  <span>
                    {checkingOut 
                      ? 'Initializing Razorpay...' 
                      : currentUser 
                        ? `Proceed to Checkout • ₹${totalPrice.toLocaleString()}`
                        : 'Sign In & Subscribe'
                    }
                  </span>
                </button>
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
            <button 
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            >
              Log In
            </button>
            <button 
              type="button" 
              onClick={() => onNavigate && onNavigate('contact')}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            >
              Contact Us
            </button>
            <button type="button" onClick={() => onNavigate && onNavigate('privacy')}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => onNavigate && onNavigate('terms')}>
              Terms of Service
            </button>
            <button type="button" onClick={() => onNavigate && onNavigate('refund-policy')}>
              Refund Policy
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
