import React, { useState, useRef } from 'react';
import './ContactPage.css';
import './HomepageBottomSections.css';
import SharedNavbar from './SharedNavbar.jsx';
import ManageStudioModals from './ManageStudioModals.jsx';
import { 
  MessageSquare, 
  Headphones, 
  Tag, 
  Handshake, 
  ArrowRight, 
  Layers, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ContactPage({ onNavigate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    studioName: '',
    email: '',
    enquiryType: 'General Enquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > 1000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSelectTopic = (enquiryType) => {
    setFormData((prev) => ({ ...prev, enquiryType }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!formData.studioName.trim()) {
      newErrors.studioName = 'Studio name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a message.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Failed to send your message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setSubmitError('Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      studioName: '',
      email: '',
      enquiryType: 'General Enquiry',
      message: ''
    });
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
  };

  const handleOpenLegal = (title) => {
    setModalData({ title });
    setActiveModal('legal');
  };

  const topicCards = [
    {
      type: 'Technical Support',
      title: 'Support',
      desc: 'Need help with your account or facing an issue? Let us know and we’ll help you.',
      icon: <Headphones size={22} strokeWidth={2.2} />
    },
    {
      type: 'Pricing',
      title: 'Pricing Questions',
      desc: 'Want to know more about our plans or storage options? Send us your questions.',
      icon: <Tag size={22} strokeWidth={2.2} />
    },
    {
      type: 'Partnership',
      title: 'Partnership',
      desc: 'Interested in partnering with ManageStudio? We’d love to discuss opportunities.',
      icon: <Handshake size={22} strokeWidth={2.2} />
    },
    {
      type: 'General Enquiry',
      title: 'General Enquiry',
      desc: 'Have a different question? Feel free to reach out. We’re happy to help.',
      icon: <MessageSquare size={22} strokeWidth={2.2} />
    }
  ];

  return (
    <div className="ms-contact-page">
      {/* 1. Unified Navigation Bar */}
      <SharedNavbar
        activePage="contact"
        onNavigate={onNavigate}
        onOpenLogin={() => { window.location.href = 'https://app.managestudio.io/'; }}
        onOpenGetStarted={() => setActiveModal('get-started')}
      />

      {/* 2. Hero Section */}
      <section className="ms-contact-hero">
        <div className="ms-contact-container">
          <div className="ms-contact-hero-grid">
            <div className="ms-contact-hero-left">
              <span className="ms-contact-eyebrow">CONTACT MANAGESTUDIO</span>
              <h1 className="ms-contact-headline">
                Let’s talk about<br />your studio.
              </h1>
              <p className="ms-contact-description">
                Have questions about ManageStudio, need help choosing modules, or want to discuss your studio’s workflow? Send us a message.
              </p>
            </div>

            <div className="ms-contact-hero-card">
              <div className="ms-contact-hero-card-header">
                <div className="ms-contact-card-icon">
                  <MessageSquare size={22} strokeWidth={2.2} />
                </div>
                <div className="ms-contact-card-title">We’re here to help</div>
              </div>
              <p className="ms-contact-card-desc">
                Whether you’re just exploring or ready to get started, our team will get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Form & Topics Grid */}
      <main className="ms-contact-main-section" ref={formRef}>
        <div className="ms-contact-container">
          <div className="ms-contact-content-grid">
            {/* Left: Contact Form Card */}
            <div className="ms-contact-form-card">
              {submitted ? (
                <div className="ms-success-card">
                  <div className="ms-success-icon-wrap">
                    <CheckCircle2 size={34} strokeWidth={2.2} />
                  </div>
                  <h2 className="ms-success-title">Message Sent!</h2>
                  <p className="ms-success-desc">
                    Thank you for reaching out, <strong>{formData.fullName}</strong>. Your message regarding <strong>{formData.enquiryType}</strong> has been received. Our team will get back to you at <strong>{formData.email}</strong> within 1–2 business days.
                  </p>
                  <button
                    type="button"
                    className="ms-success-reset-btn"
                    onClick={handleResetForm}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="ms-form-header">
                    <h2 className="ms-form-title">Send us a message</h2>
                    <p className="ms-form-subtitle">Fill in the details below and we’ll get back to you soon.</p>
                  </div>

                  {submitError && (
                    <div className="ms-alert-box ms-alert-error" role="alert">
                      <AlertCircle size={20} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>{submitError}</div>
                    </div>
                  )}

                  <form className="ms-contact-form" onSubmit={handleSubmit} noValidate>
                    {/* Row 1: Full Name & Studio Name */}
                    <div className="ms-form-row">
                      <div className="ms-form-group">
                        <label className="ms-form-label" htmlFor="fullName">
                          Full Name <span className="ms-required-star">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          className={`ms-form-input ${errors.fullName ? 'has-error' : ''}`}
                          placeholder="Your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        />
                        {errors.fullName && <div className="ms-form-error-msg">{errors.fullName}</div>}
                      </div>

                      <div className="ms-form-group">
                        <label className="ms-form-label" htmlFor="studioName">
                          Studio Name <span className="ms-required-star">*</span>
                        </label>
                        <input
                          id="studioName"
                          type="text"
                          name="studioName"
                          className={`ms-form-input ${errors.studioName ? 'has-error' : ''}`}
                          placeholder="Your studio name"
                          value={formData.studioName}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        />
                        {errors.studioName && <div className="ms-form-error-msg">{errors.studioName}</div>}
                      </div>
                    </div>

                    {/* Row 2: Work Email & Enquiry Type */}
                    <div className="ms-form-row">
                      <div className="ms-form-group">
                        <label className="ms-form-label" htmlFor="email">
                          Work Email <span className="ms-required-star">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          className={`ms-form-input ${errors.email ? 'has-error' : ''}`}
                          placeholder="you@studio.com"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        />
                        {errors.email && <div className="ms-form-error-msg">{errors.email}</div>}
                      </div>

                      <div className="ms-form-group">
                        <label className="ms-form-label" htmlFor="enquiryType">
                          Enquiry Type <span className="ms-required-star">*</span>
                        </label>
                        <select
                          id="enquiryType"
                          name="enquiryType"
                          className="ms-form-select"
                          value={formData.enquiryType}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        >
                          <option value="General Enquiry">General Enquiry</option>
                          <option value="Pricing">Pricing</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Partnership">Partnership</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Message */}
                    <div className="ms-form-group">
                      <label className="ms-form-label" htmlFor="message">
                        Message <span className="ms-required-star">*</span>
                      </label>
                      <div className="ms-form-textarea-wrap">
                        <textarea
                          id="message"
                          name="message"
                          className={`ms-form-textarea ${errors.message ? 'has-error' : ''}`}
                          placeholder="Tell us about your enquiry..."
                          value={formData.message}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength={1000}
                          required
                        />
                        <span className="ms-char-counter">{formData.message.length}/1000</span>
                      </div>
                      {errors.message && <div className="ms-form-error-msg">{errors.message}</div>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="ms-form-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight size={17} strokeWidth={2.2} />
                        </>
                      )}
                    </button>

                    <p className="ms-form-footer-note">
                      We’ll usually get back to you within 1–2 business days.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Right: 4 Topic Cards */}
            <div className="ms-contact-topics-stack">
              {topicCards.map((topic) => (
                <div
                  key={topic.type}
                  className={`ms-topic-card ${formData.enquiryType === topic.type ? 'is-active-type' : ''}`}
                  onClick={() => handleSelectTopic(topic.type)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectTopic(topic.type);
                    }
                  }}
                  aria-label={`Select ${topic.title} enquiry topic`}
                >
                  <div className="ms-topic-icon-wrap">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="ms-topic-title">{topic.title}</h3>
                    <p className="ms-topic-desc">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 4. Quick Links Banner ("Explore before you contact") */}
      <section className="ms-contact-quicklinks-section">
        <div className="ms-contact-container">
          <div className="ms-quicklinks-banner">
            <div className="ms-quicklinks-left">
              <span className="ms-quicklinks-eyebrow">QUICK LINKS</span>
              <h2 className="ms-quicklinks-title">Explore before you contact</h2>
              <p className="ms-quicklinks-desc">
                Learn more about ManageStudio and find answers to common questions.
              </p>
            </div>

            <div className="ms-quicklinks-actions">
              <button
                type="button"
                className="ms-ql-btn-primary"
                onClick={() => onNavigate && onNavigate('marketing', 'album-selection')}
              >
                <Layers size={17} strokeWidth={2.2} />
                <span>View All Modules</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>

              <button
                type="button"
                className="ms-ql-btn-secondary"
                onClick={() => onNavigate && onNavigate('pricing')}
              >
                <CreditCard size={17} strokeWidth={2.2} />
                <span>View Pricing</span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions ("Quick answers") */}
      <section className="ms-contact-faq-section">
        <div className="ms-contact-container">
          <div className="ms-faq-header">
            <div>
              <span className="ms-faq-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="ms-faq-title">Quick answers</h2>
            </div>
            <button
              type="button"
              className="ms-faq-view-all-link"
              onClick={() => onNavigate && onNavigate('pricing')}
            >
              <span>View all FAQs</span>
              <ArrowRight size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div className="ms-faq-cards-grid">
            <div className="ms-faq-card">
              <div className="ms-faq-icon-wrap">
                <FileText size={22} strokeWidth={2.2} />
              </div>
              <h3 className="ms-faq-card-title">What is ManageStudio?</h3>
              <p className="ms-faq-card-desc">
                ManageStudio is a complete studio management platform for wedding studios. It helps you manage photos, albums, songs, bookings, invoices and more, all in one place.
              </p>
            </div>

            <div className="ms-faq-card">
              <div className="ms-faq-icon-wrap">
                <CreditCard size={22} strokeWidth={2.2} />
              </div>
              <h3 className="ms-faq-card-title">How does pricing work?</h3>
              <p className="ms-faq-card-desc">
                We offer simple monthly plans with module access and storage. You can start with the modules you need and upgrade anytime.
              </p>
            </div>

            <div className="ms-faq-card">
              <div className="ms-faq-icon-wrap">
                <Headphones size={22} strokeWidth={2.2} />
              </div>
              <h3 className="ms-faq-card-title">Do you offer support?</h3>
              <p className="ms-faq-card-desc">
                Yes, we provide support for all our customers. You can contact us through this form and our team will get back to you soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer (Reused Brand Footer) */}
      <footer className="ms-footer-section">
        <div className="ms-footer-container">
          <div className="ms-footer-main">
            {/* Left: Brand & Tagline */}
            <div className="ms-footer-brand">
              <a
                href="/"
                className="ms-footer-logo-link"
                aria-label="ManageStudio Home"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate && onNavigate('marketing');
                }}
              >
                <img
                  src="/managestudio-logo-white.png"
                  alt="ManageStudio"
                  className="ms-footer-logo-img"
                />
              </a>
              <p className="ms-footer-tagline">
                The all-in-one studio management platform designed for wedding photographers and filmmakers. Powerful tools to organize, deliver, and grow.
              </p>
            </div>

            {/* Right: Columns */}
            <div className="ms-footer-links-grid">
              <div className="ms-footer-col">
                <div className="ms-footer-col-title">Modules</div>
                <ul className="ms-footer-links-list">
                  <li><a href="#album-selection" className="ms-footer-link" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('marketing', 'album-selection'); }}>Album Selection</a></li>
                  <li><a href="#guest-ai" className="ms-footer-link" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('marketing', 'guest-ai'); }}>Guest Photo AI</a></li>
                  <li><a href="#song-selection" className="ms-footer-link" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('marketing', 'song-selection'); }}>Song Selection</a></li>
                  <li><a href="#camera-ingest" className="ms-footer-link" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('marketing', 'camera-ingest'); }}>Camera Ingest</a></li>
                  <li><a href="#gallery" className="ms-footer-link" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('marketing', 'gallery'); }}>Client Gallery</a></li>
                </ul>
              </div>

              <div className="ms-footer-col">
                <div className="ms-footer-col-title">Company</div>
                <ul className="ms-footer-links-list">
                  <li>
                    <button
                      type="button"
                      className="ms-footer-link"
                      onClick={() => onNavigate && onNavigate('about')}
                    >
                      About ManageStudio
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="ms-footer-link"
                      onClick={() => onNavigate && onNavigate('pricing')}
                    >
                      Pricing Plans
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="ms-footer-link"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <a
                      href="https://app.managestudio.io/"
                      className="ms-footer-link"
                    >
                      Log In
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="ms-footer-bottom">
            <div>
              © 2026 ManageStudio.io. All rights reserved. Built for wedding photography studios.
            </div>
            <div className="ms-footer-bottom-links">
              <button
                type="button"
                className="ms-footer-bottom-link"
                onClick={() => handleOpenLegal('Privacy Policy')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="ms-footer-bottom-link"
                onClick={() => handleOpenLegal('Terms of Service')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Terms of Service
              </button>
              <button
                type="button"
                className="ms-footer-bottom-link"
                onClick={() => handleOpenLegal('Security')}
                style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              >
                Security
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Central Modal Manager */}
      <ManageStudioModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        modalData={modalData}
        onOpenGetStarted={() => setActiveModal('get-started')}
      />
    </div>
  );
}
