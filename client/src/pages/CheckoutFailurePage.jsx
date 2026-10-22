import React from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';
import { XCircle, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';

export default function CheckoutFailurePage({ onNavigate, errorMessage }) {
  return (
    <div className="auth-page-wrapper">
      <SharedNavbar activePage="pricing" onNavigate={onNavigate} />

      <div className="auth-page-backdrop">
        <div className="auth-page-mosaic" />
        <div className="auth-page-gradient" />
      </div>

      <main className="auth-main-container">
        <div className="checkout-status-card">
          <div className="status-icon-bubble failure">
            <XCircle size={40} />
          </div>

          <h1 className="auth-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
            Checkout Unsuccessful
          </h1>
          <p className="auth-subtitle">
            {errorMessage || 'The payment transaction could not be completed, or was dismissed. No charges were made to your account.'}
          </p>

          <div className="status-receipt-box">
            <div className="srb-row">
              <span>Reason:</span>
              <strong style={{ color: '#FCA5A5' }}>Transaction Incomplete / Cancelled</strong>
            </div>
            <div className="srb-row">
              <span>Next Step:</span>
              <span>Review module selections and retry checkout</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              className="auth-submit-btn"
              onClick={() => onNavigate && onNavigate('pricing')}
            >
              <RefreshCw size={16} />
              <span>Retry Plan Selection &amp; Checkout</span>
            </button>

            <button
              type="button"
              className="account-btn-secondary"
              style={{ justifyContent: 'center', padding: '12px 20px' }}
              onClick={() => onNavigate && onNavigate('contact')}
            >
              <HelpCircle size={16} />
              <span>Contact Support for Assistance</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
