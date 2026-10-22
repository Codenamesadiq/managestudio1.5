import React, { useState } from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage({ onNavigate }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide your studio account email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(cleanEmail);
      setSuccess(true);
    } catch (err) {
      console.warn('Password reset error:', err.code, err.message);
      if (err.code === 'auth/user-not-found') {
        setError('No studio account found with this email address.');
      } else {
        setError(err.message || 'Failed to send password reset email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <SharedNavbar 
        activePage="login" 
        onNavigate={onNavigate}
        onOpenLogin={() => onNavigate('login')}
        onOpenGetStarted={() => onNavigate('signup')}
      />

      {/* Cinematic Background Backdrop */}
      <div className="auth-page-backdrop">
        <div className="auth-page-mosaic" />
        <div className="auth-page-gradient" />
      </div>

      <main className="auth-main-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-brand-badge">ACCOUNT RECOVERY</span>
            <h1 className="auth-title">Reset your Password</h1>
            <p className="auth-subtitle">
              Enter your registered studio email address and we will send you a secure link to reset your password.
            </p>
          </div>

          {error && (
            <div className="auth-error-alert" role="alert" style={{ marginBottom: '18px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="auth-success-alert" role="status" style={{ flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="#1ABC9C" />
                <strong style={{ color: '#FFFFFF' }}>Password Reset Email Sent!</strong>
              </div>
              <p style={{ margin: 0, fontSize: '13px' }}>
                We have dispatched a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
              <button
                type="button"
                className="auth-submit-btn"
                style={{ marginTop: '8px' }}
                onClick={() => onNavigate && onNavigate('login')}
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="reset-email">Studio Email</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    className="auth-input"
                    placeholder="name@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                <span>{loading ? 'Sending Link...' : 'Send Password Reset Link'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          <div className="auth-footer-links">
            <div>
              Remembered your password?{' '}
              <button 
                type="button" 
                className="auth-link"
                onClick={() => onNavigate && onNavigate('login')}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
