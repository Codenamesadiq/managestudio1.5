import React, { useState } from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(cleanEmail, password);
      // Redirect to pricing or account
      if (onNavigate) {
        onNavigate('pricing');
      }
    } catch (err) {
      console.warn('Login error:', err.code, err.message);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please reset your password or try again later.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
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
            <span className="auth-brand-badge">MANAGESTUDIO ACCOUNT</span>
            <h1 className="auth-title">Sign in to your Studio</h1>
            <p className="auth-subtitle">Access your studio management workspace, modules, and subscriptions.</p>
          </div>

          {error && (
            <div className="auth-error-alert" role="alert" style={{ marginBottom: '18px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="login-email">Studio / Work Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="login-email"
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

            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label" htmlFor="login-password">Password</label>
                <button
                  type="button"
                  className="auth-link"
                  style={{ fontSize: '12px' }}
                  onClick={() => onNavigate && onNavigate('forgot-password')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="auth-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-footer-links">
            <div>
              Don't have an account yet?{' '}
              <button 
                type="button" 
                className="auth-link"
                onClick={() => onNavigate && onNavigate('signup')}
              >
                Create Studio Account
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#52525B', marginTop: '4px' }}>
              Protected by ManageStudio security. By signing in you agree to our{' '}
              <button type="button" className="auth-link" style={{ fontSize: '11px' }} onClick={() => onNavigate && onNavigate('terms')}>
                Terms
              </button>{' '}
              and{' '}
              <button type="button" className="auth-link" style={{ fontSize: '11px' }} onClick={() => onNavigate && onNavigate('privacy')}>
                Privacy Policy
              </button>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
