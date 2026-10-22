import React, { useState } from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Building, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignUpPage({ onNavigate }) {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!studioName.trim()) {
      setError('Please enter your studio name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both passwords.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, fullName, studioName);
      // Seamlessly navigate to pricing so they can select modules and checkout
      if (onNavigate) {
        onNavigate('pricing');
      }
    } catch (err) {
      console.warn('Signup error:', err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please use a stronger password.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <SharedNavbar 
        activePage="signup" 
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
        <div className="auth-card auth-card-wide">
          <div className="auth-header">
            <span className="auth-brand-badge">NEW STUDIO ONBOARDING</span>
            <h1 className="auth-title">Create your Studio Account</h1>
            <p className="auth-subtitle">Get started with ManageStudio 1.5. Set up your workspace in 60 seconds.</p>
          </div>

          {error && (
            <div className="auth-error-alert" role="alert" style={{ marginBottom: '18px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form-row">
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="su-fullname">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="su-fullname"
                    type="text"
                    autoComplete="name"
                    className="auth-input"
                    placeholder="Liam Parker"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label" htmlFor="su-studioname">Studio Name</label>
                <div className="auth-input-wrap">
                  <Building size={16} className="auth-input-icon" />
                  <input
                    id="su-studioname"
                    type="text"
                    autoComplete="organization"
                    className="auth-input"
                    placeholder="Apex Wedding Cinema"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="su-email">Work Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  className="auth-input"
                  placeholder="contact@apexweddingcinema.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-row">
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="su-password">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="su-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="auth-input"
                    placeholder="At least 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-input-toggle-pwd"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-label" htmlFor="su-confirmpassword">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="su-confirmpassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="auth-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <label className="auth-checkbox-row">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>
                I agree to ManageStudio's{' '}
                <button type="button" className="auth-link" onClick={() => onNavigate && onNavigate('terms')}>
                  Terms of Service
                </button>
                ,{' '}
                <button type="button" className="auth-link" onClick={() => onNavigate && onNavigate('privacy')}>
                  Privacy Policy
                </button>
                , and{' '}
                <button type="button" className="auth-link" onClick={() => onNavigate && onNavigate('refund-policy')}>
                  Refund Policy
                </button>.
              </span>
            </label>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'Create Studio Account & Choose Modules'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-footer-links">
            <div>
              Already have an account?{' '}
              <button 
                type="button" 
                className="auth-link"
                onClick={() => onNavigate && onNavigate('login')}
              >
                Sign in to your Studio
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
