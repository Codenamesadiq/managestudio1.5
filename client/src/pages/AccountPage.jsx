import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Building, 
  User, 
  Mail, 
  ShieldCheck, 
  Database, 
  CreditCard, 
  Download, 
  LogOut, 
  Check, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function AccountPage({ onNavigate }) {
  const { 
    currentUser, 
    userProfile, 
    studio, 
    logout, 
    resendVerification,
    getIdToken,
    refreshStudioProfile
  } = useAuth();

  const [verificationSent, setVerificationSent] = useState(false);
  const [subData, setSubData] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  // Fetch subscription & order history from server
  useEffect(() => {
    let isMounted = true;
    async function fetchSubStatus() {
      try {
        const token = await getIdToken();
        if (!token) return;

        const res = await fetch('/api/subscription/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (isMounted) setSubData(data);
        }
      } catch (err) {
        console.warn('Failed to load subscription status:', err.message);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    }

    if (currentUser) {
      fetchSubStatus();
    }
    return () => { isMounted = false; };
  }, [currentUser]);

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (e) {
      alert('Could not resend email: ' + e.message);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your ManageStudio subscription? You will retain access until the end of the current billing cycle.')) {
      return;
    }

    setCancelling(true);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const contentType = res.headers.get('content-type') || '';
      let data = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      }
      if (res.ok && data.success) {
        setCancelMessage('Subscription will cancel at the end of the current period.');
        if (refreshStudioProfile) refreshStudioProfile();
      } else {
        alert(data.error || 'Failed to cancel subscription.');
      }
    } catch (e) {
      alert(e.message || 'Error communicating with server.');
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    if (onNavigate) {
      onNavigate('marketing');
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-page-wrapper">
        <SharedNavbar activePage="account" onNavigate={onNavigate} />
        <div className="auth-page-backdrop">
          <div className="auth-page-mosaic" />
          <div className="auth-page-gradient" />
        </div>
        <main className="auth-main-container">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <h2 className="auth-title">Authentication Required</h2>
            <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
              Please sign in to view your ManageStudio account and subscription entitlements.
            </p>
            <button
              type="button"
              className="auth-submit-btn"
              onClick={() => onNavigate && onNavigate('login')}
            >
              <span>Sign In to your Studio</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const studioName = studio?.studioName || userProfile?.displayName || 'My Wedding Studio';
  const ownerName = userProfile?.displayName || currentUser.displayName || 'Studio Owner';
  const email = currentUser.email;
  const isEmailVerified = currentUser.emailVerified;

  // Determine active subscription & modules
  const localSub = subData?.subscription;
  const isActive = (studio?.status === 'active' || studio?.subscription?.status === 'active' || localSub?.status === 'active');
  const activeModules = localSub?.modules || [];
  const quotaGb = localSub?.storageQuotaGb || studio?.storage?.quotaGb || 15;

  return (
    <div className="auth-page-wrapper">
      <SharedNavbar 
        activePage="account" 
        onNavigate={onNavigate}
        onOpenLogin={() => onNavigate('login')}
        onOpenGetStarted={() => onNavigate('signup')}
      />

      {/* Cinematic Background Backdrop */}
      <div className="auth-page-backdrop">
        <div className="auth-page-mosaic" />
        <div className="auth-page-gradient" />
      </div>

      <div className="account-page-container">
        {/* Email Verification Banner if unverified */}
        {!isEmailVerified && (
          <div className="auth-error-alert" style={{ marginBottom: '20px', background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.35)', color: '#FCD34D' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#F59E0B' }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span>Please verify your email address (<strong>{email}</strong>) to secure your account.</span>
              <button
                type="button"
                className="auth-link"
                style={{ color: '#FBBF24', textDecoration: 'underline' }}
                onClick={handleResendVerification}
                disabled={verificationSent}
              >
                {verificationSent ? 'Verification Email Dispatched ✓' : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        )}

        {cancelMessage && (
          <div className="auth-success-alert" style={{ marginBottom: '20px' }}>
            <Check size={18} />
            <span>{cancelMessage}</span>
          </div>
        )}

        {/* Hero Header */}
        <div className="account-hero-card">
          <div className="account-studio-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1>{studioName}</h1>
              {isActive ? (
                <span className="account-badge-active">
                  <ShieldCheck size={13} /> Active Subscription
                </span>
              ) : (
                <span className="account-badge-pending">
                  <Clock size={13} /> Pending Activation
                </span>
              )}
            </div>

            <div className="account-meta-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} /> {ownerName}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} /> {email}
              </span>
            </div>
          </div>

          <div className="account-actions-group">
            <button 
              type="button" 
              className="account-btn-secondary"
              onClick={() => onNavigate && onNavigate('pricing')}
            >
              <Sparkles size={15} color="#D4AF7C" />
              <span>{isActive ? 'Upgrade / Add Modules' : 'Choose Modules & Subscribe'}</span>
            </button>

            <button 
              type="button" 
              className="account-btn-secondary"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="account-grid">
          {/* Left Column: Modules & Entitlements */}
          <div className="account-panel">
            <h2 className="panel-title">
              <Sparkles size={18} color="#D4AF7C" />
              <span>Subscribed Studio Modules</span>
            </h2>

            <div className="account-modules-list">
              <div className={`account-module-item ${isActive && (activeModules.includes('album-selection') || studio?.modules?.photoSelection) ? 'active' : ''}`}>
                <div>
                  <div className="ami-name">Album Selection</div>
                  <div style={{ fontSize: '11px', color: '#71717A' }}>Proofing &amp; Star Selection</div>
                </div>
                <span className="ami-status">
                  {isActive && (activeModules.includes('album-selection') || studio?.modules?.photoSelection) ? 'Active ✓' : 'Inactive'}
                </span>
              </div>

              <div className={`account-module-item ${isActive && (activeModules.includes('song-selection') || studio?.modules?.songs) ? 'active' : ''}`}>
                <div>
                  <div className="ami-name">Song Selection</div>
                  <div style={{ fontSize: '11px', color: '#71717A' }}>Music Library &amp; NLE Export</div>
                </div>
                <span className="ami-status">
                  {isActive && (activeModules.includes('song-selection') || studio?.modules?.songs) ? 'Active ✓' : 'Inactive'}
                </span>
              </div>

              <div className={`account-module-item ${isActive && (activeModules.includes('guest-photo-ai') || studio?.modules?.guestFinder) ? 'active' : ''}`}>
                <div>
                  <div className="ami-name">Guest Photo AI</div>
                  <div style={{ fontSize: '11px', color: '#71717A' }}>Face Recognition &amp; QR Finder</div>
                </div>
                <span className="ami-status">
                  {isActive && (activeModules.includes('guest-photo-ai') || studio?.modules?.guestFinder) ? 'Active ✓' : 'Inactive'}
                </span>
              </div>

              <div className="account-module-item active">
                <div>
                  <div className="ami-name">Client Gallery</div>
                  <div style={{ fontSize: '11px', color: '#71717A' }}>Included with all subscriptions</div>
                </div>
                <span className="ami-status" style={{ color: '#1ABC9C' }}>Included Free ✓</span>
              </div>

              <div className="account-module-item active">
                <div>
                  <div className="ami-name">Camera Ingest Engine</div>
                  <div style={{ fontSize: '11px', color: '#71717A' }}>Included with all subscriptions</div>
                </div>
                <span className="ami-status" style={{ color: '#1ABC9C' }}>Included Free ✓</span>
              </div>

              <div className="account-module-item active">
                <div>
                  <div className="ami-name">Studio Files</div>
                  <div style={{ fontSize: '11px', color: '#71717A' }}>Included with all subscriptions</div>
                </div>
                <span className="ami-status" style={{ color: '#1ABC9C' }}>Included Free ✓</span>
              </div>
            </div>

            {/* Storage Quota */}
            <div className="account-storage-meter">
              <div className="asm-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={15} color="#1ABC9C" /> Total Shared Cloud Storage
                </span>
                <strong>{quotaGb} GB Allowance</strong>
              </div>
              <div className="asm-bar-bg">
                <div className="asm-bar-fill" style={{ width: isActive ? '12%' : '0%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#71717A', marginTop: '6px' }}>
                <span>Shared across all galleries, proofing and guest lookups</span>
                <span>Combined Pool</span>
              </div>
            </div>

            {/* Desktop Software Connection */}
            <div style={{ padding: '18px', background: 'rgba(212, 175, 124, 0.04)', border: '1px solid rgba(212, 175, 124, 0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#FFFFFF', marginBottom: '2px' }}>
                  ManageStudio 1.5 Desktop Application
                </strong>
                <span style={{ fontSize: '12px', color: '#A1A1AA' }}>
                  Sign in with this account in the desktop app to access high-speed ingest and local sync.
                </span>
              </div>
              <a 
                href="https://github.com/Codenamesadiq/managestudio1.5/releases/download/Managestudio1.5/ManageStudio-Setup.exe"
                className="account-btn-secondary"
                style={{ background: 'linear-gradient(135deg, #D4AF7C 0%, #B89255 100%)', color: '#08080A', border: 'none' }}
                download="ManageStudio-Setup.exe"
              >
                <Download size={15} />
                <span>Download Windows App</span>
              </a>
            </div>
          </div>

          {/* Right Column: Billing History & Actions */}
          <div className="account-panel">
            <h2 className="panel-title">
              <CreditCard size={18} color="#1ABC9C" />
              <span>Billing &amp; Subscription</span>
            </h2>

            <div style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: '1.6' }}>
              {isActive ? (
                <>
                  <p style={{ margin: '0 0 10px' }}>
                    Your subscription is <strong>Active</strong>. Billing occurs monthly via verified Razorpay checkout.
                  </p>
                  <button
                    type="button"
                    className="account-btn-secondary"
                    style={{ color: '#FCA5A5', borderColor: 'rgba(239, 68, 68, 0.25)', width: '100%', justifyContent: 'center' }}
                    onClick={handleCancelSubscription}
                    disabled={cancelling}
                  >
                    <span>{cancelling ? 'Processing...' : 'Cancel Subscription'}</span>
                  </button>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 12px' }}>
                    You do not currently have an active module subscription. Choose your creative modules and storage tier to unlock all studio features.
                  </p>
                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={() => onNavigate && onNavigate('pricing')}
                  >
                    <span>Choose Plan &amp; Subscribe</span>
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Recent Orders List */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#D4D4D8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>
                Recent Order History
              </span>

              {loadingOrders ? (
                <div style={{ fontSize: '12px', color: '#71717A' }}>Loading orders...</div>
              ) : subData?.recentOrders?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {subData.recentOrders.map(order => (
                    <div key={order.orderId} style={{ padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>
                        <span>₹{order.amount.toLocaleString()}</span>
                        <span style={{ color: order.status === 'VERIFIED' ? '#1ABC9C' : '#F59E0B' }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ color: '#71717A', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{order.orderId}</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#71717A' }}>No billing orders recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
