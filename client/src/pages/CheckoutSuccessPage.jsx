import React from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';
import { CheckCircle2, ArrowRight, Download, ShieldCheck, Database } from 'lucide-react';

export default function CheckoutSuccessPage({ onNavigate, checkoutDetails }) {
  const orderId = checkoutDetails?.orderId || 'ord_' + Date.now();
  const paymentId = checkoutDetails?.paymentId || 'pay_' + Date.now();
  const planSummary = checkoutDetails?.planSummary;

  return (
    <div className="auth-page-wrapper">
      <SharedNavbar activePage="account" onNavigate={onNavigate} />

      <div className="auth-page-backdrop">
        <div className="auth-page-mosaic" />
        <div className="auth-page-gradient" />
      </div>

      <main className="auth-main-container">
        <div className="checkout-status-card">
          <div className="status-icon-bubble success">
            <CheckCircle2 size={40} />
          </div>

          <h1 className="auth-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
            Payment Verified &amp; Activated!
          </h1>
          <p className="auth-subtitle">
            Welcome to ManageStudio 1.5! Your subscription entitlements have been cryptographically verified and attached to your studio account.
          </p>

          <div className="status-receipt-box">
            <div className="srb-row">
              <span>Order ID:</span>
              <strong>{orderId}</strong>
            </div>
            <div className="srb-row">
              <span>Razorpay Payment ID:</span>
              <strong>{paymentId}</strong>
            </div>
            <div className="srb-row">
              <span>Status:</span>
              <strong style={{ color: '#1ABC9C' }}>Active ✓</strong>
            </div>
            {planSummary && (
              <>
                <div className="srb-row">
                  <span>Selected Modules:</span>
                  <strong>{planSummary.selectedCount} Paid Modules</strong>
                </div>
                <div className="srb-row">
                  <span>Total Cloud Storage:</span>
                  <strong>{planSummary.totalStorageGb} GB Shared</strong>
                </div>
                <div className="srb-row">
                  <span>Amount Paid:</span>
                  <strong>₹{planSummary.totalPrice?.toLocaleString()} / mo</strong>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="auth-submit-btn"
              onClick={() => onNavigate && onNavigate('account')}
            >
              <span>View Account &amp; Entitlements</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="https://github.com/Codenamesadiq/managestudio1.5/releases/download/Managestudio1.5/ManageStudio-Setup.exe"
              className="account-btn-secondary"
              style={{ justifyContent: 'center', padding: '12px 20px', background: 'rgba(255,255,255,0.08)' }}
              download="ManageStudio-Setup.exe"
            >
              <Download size={16} />
              <span>Download ManageStudio for Windows</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
