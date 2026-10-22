import React, { useState } from 'react';
import '../styles/Auth.css';
import SharedNavbar from '../components/SharedNavbar.jsx';

export default function LegalPage({ initialTab = 'terms', onNavigate }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="auth-page-wrapper">
      <SharedNavbar activePage="legal" onNavigate={onNavigate} />

      <div className="auth-page-backdrop">
        <div className="auth-page-mosaic" />
        <div className="auth-page-gradient" />
      </div>

      <main className="legal-content-container">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="account-btn-secondary"
            style={{ 
              background: activeTab === 'terms' ? 'rgba(26, 188, 156, 0.15)' : 'rgba(255,255,255,0.04)',
              borderColor: activeTab === 'terms' ? '#1ABC9C' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'terms' ? '#1ABC9C' : '#A1A1AA'
            }}
            onClick={() => setActiveTab('terms')}
          >
            Terms &amp; Conditions
          </button>

          <button
            type="button"
            className="account-btn-secondary"
            style={{ 
              background: activeTab === 'privacy' ? 'rgba(26, 188, 156, 0.15)' : 'rgba(255,255,255,0.04)',
              borderColor: activeTab === 'privacy' ? '#1ABC9C' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'privacy' ? '#1ABC9C' : '#A1A1AA'
            }}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>

          <button
            type="button"
            className="account-btn-secondary"
            style={{ 
              background: activeTab === 'refund' ? 'rgba(26, 188, 156, 0.15)' : 'rgba(255,255,255,0.04)',
              borderColor: activeTab === 'refund' ? '#1ABC9C' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'refund' ? '#1ABC9C' : '#A1A1AA'
            }}
            onClick={() => setActiveTab('refund')}
          >
            Refund &amp; Cancellation Policy
          </button>
        </div>

        {/* 1. TERMS & CONDITIONS */}
        {activeTab === 'terms' && (
          <article>
            <h1>Terms and Conditions</h1>
            <div className="legal-meta">Last updated: October 2026 • Effective for all ManageStudio users</div>

            <section className="legal-section">
              <h2>1. Agreement to Terms</h2>
              <p>
                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("Studio", "Customer", or "you") and ManageStudio ("we", "us", or "our"), concerning your access to and use of the ManageStudio website (managestudio.io), the ManageStudio web applications, and the ManageStudio desktop software suite.
              </p>
              <p>
                By registering for an account, subscribing to any paid module, or accessing our services, you agree that you have read, understood, and agree to be bound by all of these Terms and Conditions.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Description of Services</h2>
              <p>
                ManageStudio provides an operating system designed for modern wedding photography and cinematography studios, encompassing:
              </p>
              <ul>
                <li><strong>Album Selection:</strong> Client photo proofing, selection limits, star ratings, and Lightroom export.</li>
                <li><strong>Song Selection:</strong> Curated soundtrack library and NLE timeline export for wedding video editors.</li>
                <li><strong>Guest Photo AI:</strong> Selfie-based face recognition search for wedding attendees.</li>
                <li><strong>Gallery, Camera Ingest &amp; Studio Files:</strong> Full-resolution client delivery, multi-card checksum ingest engine, and studio asset storage.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Subscriptions, Pricing and Payments</h2>
              <p>
                Paid modules and additional cloud storage add-ons are billed on a monthly subscription cycle in Indian Rupees (INR). Pricing is as stated on the official pricing page:
              </p>
              <ul>
                <li>Album Selection: ₹499 per month (includes Gallery and 5 GB storage).</li>
                <li>Song Selection: ₹499 per month (includes Gallery and 5 GB storage).</li>
                <li>Guest Photo AI: ₹699 per month (includes Gallery and 5 GB storage).</li>
                <li>Additional storage tiers: 50 GB (₹299/mo), 200 GB (₹599/mo), 500 GB (₹999/mo), and 1 TB (₹1,499/mo).</li>
              </ul>
              <p>
                Payments are securely processed via Razorpay. We do not store credit card or banking details directly on our servers. All subscription activations require verified payment authorization.
              </p>
            </section>

            <section className="legal-section">
              <h2>4. User Accounts and Content Ownership</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and passwords. You retain full ownership and copyright of all photographic imagery, cinematographic footage, and assets uploaded to your studio account. ManageStudio claims no intellectual property rights over your media.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Prohibited Uses</h2>
              <p>
                You agree not to upload content that infringes upon third-party rights, transmit malicious code, attempt unauthorized access to another studio's data, or misuse facial recognition features in violation of applicable data privacy laws.
              </p>
            </section>
          </article>
        )}

        {/* 2. PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <article>
            <h1>Privacy Policy</h1>
            <div className="legal-meta">Last updated: October 2026 • Commitment to Customer Data Protection</div>

            <section className="legal-section">
              <h2>1. Information We Collect</h2>
              <p>We collect information that you directly provide to us during account registration and service usage:</p>
              <ul>
                <li><strong>Account Information:</strong> Full name, studio name, business email address, and encrypted credentials via Firebase Authentication.</li>
                <li><strong>Subscription Data:</strong> Selected modules, storage quota, payment identifiers, and order transaction records processed via Razorpay.</li>
                <li><strong>Studio Content:</strong> Album titles, client names, event dates, photo selections, and uploaded media files required for proofing and gallery presentation.</li>
                <li><strong>Face Recognition Embeddings (Guest Photo AI):</strong> When enabled, vector facial embeddings are generated strictly to match attendee selfies with event photographs. Raw biometric profiles are not sold, shared, or utilized for advertising.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the collected information exclusively to:</p>
              <ul>
                <li>Provide, operate, and maintain the ManageStudio platform.</li>
                <li>Process subscriptions, calculate storage entitlements, and prevent fraudulent billing.</li>
                <li>Enable client selection portals and guest lookup experiences.</li>
                <li>Send transactional notifications, such as password resets, order confirmations, and security alerts.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Data Storage and Security</h2>
              <p>
                Customer account records are secured using industry-standard Firebase Authentication and Cloud Firestore databases with strict tenant isolation. Media assets are stored in dedicated cloud buckets with signed access URLs. We implement rate limiting, cryptographic signature verification for payment callbacks, and encrypted network transmission (TLS 1.3).
              </p>
            </section>

            <section className="legal-section">
              <h2>4. Third-Party Service Providers</h2>
              <p>We partner with vetted infrastructure providers for essential platform functionality:</p>
              <ul>
                <li><strong>Razorpay:</strong> Payment processing and invoice generation.</li>
                <li><strong>Google Cloud / Firebase:</strong> Authentication, database services, and identity management.</li>
              </ul>
            </section>
          </article>
        )}

        {/* 3. REFUND & CANCELLATION POLICY */}
        {activeTab === 'refund' && (
          <article>
            <h1>Refund and Cancellation Policy</h1>
            <div className="legal-meta">Last updated: October 2026 • Transparent Billing Terms</div>

            <section className="legal-section">
              <h2>1. Cancellation Policy</h2>
              <p>
                You may cancel your ManageStudio subscription or any individual paid module at any time directly through your Account dashboard (managestudio.io/account) or by contacting our support team.
              </p>
              <p>
                Upon cancellation, your subscription will remain active until the end of your current 30-day billing cycle. You will not be billed for subsequent billing periods following the scheduled cancellation date.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Refund Policy</h2>
              <p>
                ManageStudio provides access to digital cloud services, storage allocations, and downloadable desktop tools:
              </p>
              <ul>
                <li><strong>Monthly Module Subscriptions:</strong> If you experience technical errors preventing the use of your subscribed modules, or if you were erroneously charged due to a gateway duplicate, you may request a full refund within <strong>7 days</strong> of the billing transaction.</li>
                <li><strong>Storage Add-ons:</strong> Additional storage tiers already consumed for media hosting during high-volume periods are non-refundable for previously elapsed billing cycles.</li>
                <li><strong>Failed or Duplicate Transactions:</strong> Any charges resulting from duplicate orders or failed payment handshakes will be automatically investigated and refunded to the original payment method within 5–7 business days.</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. How to Request a Refund</h2>
              <p>
                To request a refund or dispute a charge, submit a request via our <button type="button" className="auth-link" onClick={() => onNavigate && onNavigate('contact')}>Contact Page</button> with your Order ID, Razorpay Payment ID, and registered studio email address. Our billing team reviews all requests within 24 to 48 hours.
              </p>
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
