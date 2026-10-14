import React, { useState, useEffect } from 'react';
import './ManageStudioModals.css';
import { 
  X, 
  Check, 
  ArrowRight, 
  Calendar, 
  Camera, 
  Music, 
  Sparkles, 
  BookOpen, 
  Download, 
  ShieldCheck, 
  Lock,
  Layers,
  CheckCircle2,
  Receipt,
  Eye,
  Image as ImageIcon,
  Users,
  Clock,
  Folder,
  Zap,
  User,
  Search,
  Headphones,
  ArrowDown,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Copy,
  Link as LinkIcon
} from 'lucide-react';

export default function ManageStudioModals({ 
  activeModal, 
  onClose, 
  modalData, 
  onOpenGetStarted 
}) {
  const [formData, setFormData] = useState({
    name: '',
    studioName: '',
    email: '',
    focus: 'Wedding Photography'
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (activeModal === 'login') {
      window.location.href = 'https://app.managestudio.io/';
    }
  }, [activeModal]);

  if (!activeModal || activeModal === 'login') return null;

  const isAlbumSelection = activeModal === 'album-selection' || 
    (activeModal === 'feature-details' && (modalData?.id === 'album-selection' || modalData?.title === 'Album Selection'));

  const isGuestAi = activeModal === 'guest-ai' || 
    (activeModal === 'feature-details' && (modalData?.id === 'guest-ai' || modalData?.title === 'Guest Photo AI'));

  const isSongSelection = activeModal === 'song-selection' || 
    (activeModal === 'feature-details' && (modalData?.id === 'song-selection' || modalData?.title?.toLowerCase().includes('song selection')));

  const isCameraIngest = activeModal === 'camera-ingest' || 
    (activeModal === 'feature-details' && (modalData?.id === 'camera-ingest' || modalData?.title?.toLowerCase().includes('camera ingest')));

  const handleSubmitGetStarted = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="ms-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`ms-modal-window ${(isAlbumSelection || isGuestAi || isSongSelection || isCameraIngest) ? 'ms-modal-window-album-selection ms-modal-window-wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ms-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* 1. GET STARTED / FREE TRIAL MODAL */}
        {activeModal === 'get-started' && (
          <div className="ms-modal-body">
            {!submitted ? (
              <>
                <div className="ms-modal-header">
                  <div className="ms-modal-badge">MANAGESTUDIO 1.5</div>
                  <h3 className="ms-modal-title">Get Started with ManageStudio</h3>
                  <p className="ms-modal-desc">
                    The all-in-one platform built for wedding photography studios. Start your 14-day free trial or request studio onboarding.
                  </p>
                </div>

                <form className="ms-modal-form" onSubmit={handleSubmitGetStarted}>
                  <div className="ms-form-group">
                    <label htmlFor="ms-name" className="ms-form-label">Your Name</label>
                    <input 
                      type="text" 
                      id="ms-name" 
                      className="ms-form-input" 
                      required 
                      placeholder="e.g. Liam Parker"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="ms-form-group">
                    <label htmlFor="ms-studio" className="ms-form-label">Studio Name</label>
                    <input 
                      type="text" 
                      id="ms-studio" 
                      className="ms-form-input" 
                      required 
                      placeholder="e.g. Apex Wedding Films"
                      value={formData.studioName}
                      onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                    />
                  </div>

                  <div className="ms-form-group">
                    <label htmlFor="ms-email" className="ms-form-label">Work Email</label>
                    <input 
                      type="email" 
                      id="ms-email" 
                      className="ms-form-input" 
                      required 
                      placeholder="studio@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="ms-form-group">
                    <label htmlFor="ms-focus" className="ms-form-label">Studio Type</label>
                    <select 
                      id="ms-focus" 
                      className="ms-form-select"
                      value={formData.focus}
                      onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                    >
                      <option value="Wedding Photography">Wedding Photography</option>
                      <option value="Cinematic Wedding Films">Cinematic Wedding Films</option>
                      <option value="Photo + Cinema Full Production">Photo + Cinema Full Production</option>
                      <option value="Destination Weddings">Destination Weddings</option>
                    </select>
                  </div>

                  <button type="submit" className="ms-modal-submit-btn">
                    <span>Start Free Trial</span>
                    <ArrowRight size={15} />
                  </button>

                  <p className="ms-form-footer-note">
                    No credit card required. Includes 14 days of full studio access.
                  </p>
                </form>
              </>
            ) : (
              <div className="ms-modal-success-state">
                <div className="ms-success-icon-wrap">
                  <CheckCircle2 size={36} color="#0066cc" />
                </div>
                <h3 className="ms-modal-title">Welcome to ManageStudio!</h3>
                <p className="ms-modal-desc">
                  Thank you, <strong>{formData.name || 'Studio Owner'}</strong>. Your free trial request for <strong>{formData.studioName || 'your studio'}</strong> has been registered.
                </p>
                <div className="ms-success-tip-box">
                  <p>Check your email (<strong>{formData.email}</strong>) for your temporary studio access pass and setup guide.</p>
                </div>
                <button type="button" className="ms-modal-submit-btn" onClick={onClose}>
                  Got It, Close
                </button>
              </div>
            )}
          </div>
        )}


        {/* 3. PRICING MODAL */}
        {activeModal === 'pricing' && (
          <div className="ms-modal-body ms-modal-pricing-body">
            <div className="ms-modal-header">
              <div className="ms-modal-badge">TRANSPARENT PRICING</div>
              <h3 className="ms-modal-title">Simple Studio Pricing</h3>
              <p className="ms-modal-desc">
                Everything your studio needs to organize, deliver, and grow. Cancel or change anytime.
              </p>
            </div>

            <div className="ms-pricing-cards-grid">
              {/* Plan 1 */}
              <div className="ms-pricing-card">
                <div className="ms-plan-name">Starter</div>
                <div className="ms-plan-price">Free <span>/ forever</span></div>
                <p className="ms-plan-desc">For emerging wedding photographers getting started.</p>
                <ul className="ms-plan-features">
                  <li><Check size={13} color="#0066cc" /> 10 GB Cloud Storage</li>
                  <li><Check size={13} color="#0066cc" /> 2 Active Client Galleries</li>
                  <li><Check size={13} color="#0066cc" /> High-Res Photo Delivery</li>
                  <li><Check size={13} color="#0066cc" /> Mobile Client View</li>
                </ul>
                <button 
                  type="button" 
                  className="ms-plan-btn ms-plan-btn-outline"
                  onClick={() => onOpenGetStarted && onOpenGetStarted()}
                >
                  Start Free
                </button>
              </div>

              {/* Plan 2: Pro */}
              <div className="ms-pricing-card ms-pricing-card-featured">
                <div className="ms-popular-pill">MOST POPULAR</div>
                <div className="ms-plan-name">Studio Pro</div>
                <div className="ms-plan-price">$29 <span>/ month</span></div>
                <p className="ms-plan-desc">The complete operating system for active wedding studios.</p>
                <ul className="ms-plan-features">
                  <li><Check size={13} color="#0066cc" /> 500 GB Fast Cloud Storage</li>
                  <li><Check size={13} color="#0066cc" /> Unlimited Weddings &amp; Events</li>
                  <li><Check size={13} color="#0066cc" /> Album Selection &amp; Proofing</li>
                  <li><Check size={13} color="#0066cc" /> Song Selection Tool</li>
                  <li><Check size={13} color="#0066cc" /> Invoices &amp; Billing Tracker</li>
                </ul>
                <button 
                  type="button" 
                  className="ms-plan-btn ms-plan-btn-primary"
                  onClick={() => onOpenGetStarted && onOpenGetStarted()}
                >
                  Get Studio Pro
                </button>
              </div>

              {/* Plan 3: Ultimate */}
              <div className="ms-pricing-card">
                <div className="ms-plan-name">Studio Studio</div>
                <div className="ms-plan-price">$59 <span>/ month</span></div>
                <p className="ms-plan-desc">For high-volume photo &amp; cinema production houses.</p>
                <ul className="ms-plan-features">
                  <li><Check size={13} color="#0066cc" /> Unlimited Storage</li>
                  <li><Check size={13} color="#0066cc" /> 4K Cinematic Video Streaming</li>
                  <li><Check size={13} color="#0066cc" /> Guest Photo AI (Face Match)</li>
                  <li><Check size={13} color="#0066cc" /> Direct Camera Ingest Pipeline</li>
                  <li><Check size={13} color="#0066cc" /> Custom Studio Domain</li>
                </ul>
                <button 
                  type="button" 
                  className="ms-plan-btn ms-plan-btn-outline"
                  onClick={() => onOpenGetStarted && onOpenGetStarted()}
                >
                  Select Ultimate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. FEATURE DETAILS MODAL */}
        {((activeModal === 'feature-details' && modalData) || activeModal === 'album-selection' || activeModal === 'guest-ai') && (
          isAlbumSelection ? (
            <div className="ms-as-body">
              {/* Header */}
              <div className="ms-as-header">
                <div className="ms-as-icon-box">
                  <ImageIcon size={26} color="#2563EB" strokeWidth={2.2} />
                </div>
                <div className="ms-as-header-text">
                  <h3 className="ms-as-title">Album Selection</h3>
                  <p className="ms-as-desc">
                    Let your clients select the best photos for their wedding album design.<br />
                    No more manually collecting photo selections through WhatsApp.
                  </p>
                </div>
              </div>

              {/* Four Benefits Grid */}
              <div className="ms-as-benefits-grid">
                <div className="ms-as-benefit-card">
                  <div className="ms-as-benefit-icon">
                    <Users size={18} color="#2563EB" strokeWidth={2.2} />
                  </div>
                  <h4 className="ms-as-benefit-title">Easy for Clients</h4>
                  <p className="ms-as-benefit-desc">
                    Clients browse wedding photos and select their favourites on any device.
                  </p>
                </div>

                <div className="ms-as-benefit-card">
                  <div className="ms-as-benefit-icon">
                    <ImageIcon size={18} color="#2563EB" strokeWidth={2.2} />
                  </div>
                  <h4 className="ms-as-benefit-title">Best Photos for Album</h4>
                  <p className="ms-as-benefit-desc">
                    Clients choose the exact images they want in their printed wedding album.
                  </p>
                </div>

                <div className="ms-as-benefit-card">
                  <div className="ms-as-benefit-icon">
                    <Clock size={18} color="#2563EB" strokeWidth={2.2} />
                  </div>
                  <h4 className="ms-as-benefit-title">Saves Time</h4>
                  <p className="ms-as-benefit-desc">
                    No manual selection lists or back and forth messages.
                  </p>
                </div>

                <div className="ms-as-benefit-card">
                  <div className="ms-as-benefit-icon">
                    <Folder size={18} color="#2563EB" strokeWidth={2.2} />
                  </div>
                  <h4 className="ms-as-benefit-title">Organized Workflow</h4>
                  <p className="ms-as-benefit-desc">
                    All selected photos are submitted and organized for the studio.
                  </p>
                </div>
              </div>

              {/* How It Works Section */}
              <div className="ms-as-how-section">
                <h4 className="ms-as-how-title">How It Works</h4>

                <div className="ms-as-how-content">
                  {/* Stepper (1 to 5) */}
                  <div className="ms-as-stepper">
                    <div className="ms-as-step-item">
                      <div className="ms-as-step-badge">1</div>
                      <div className="ms-as-step-body">
                        <div className="ms-as-step-name">Upload Photos</div>
                        <div className="ms-as-step-text">
                          Import wedding photos into ManageStudio and create an album selection gallery.
                        </div>
                      </div>
                    </div>

                    <div className="ms-as-step-item">
                      <div className="ms-as-step-badge">2</div>
                      <div className="ms-as-step-body">
                        <div className="ms-as-step-name">Share with Client</div>
                        <div className="ms-as-step-text">
                          Generate a private selection link and send it to the client.
                        </div>
                      </div>
                    </div>

                    <div className="ms-as-step-item">
                      <div className="ms-as-step-badge">3</div>
                      <div className="ms-as-step-body">
                        <div className="ms-as-step-name">Client Selects Photos</div>
                        <div className="ms-as-step-text">
                          The client opens the link, browses the photos, selects their favourites, and submits the final selection.
                        </div>
                      </div>
                    </div>

                    <div className="ms-as-step-item">
                      <div className="ms-as-step-badge">4</div>
                      <div className="ms-as-step-body">
                        <div className="ms-as-step-name">Receive Final Selection</div>
                        <div className="ms-as-step-text">
                          The studio receives the submitted selection in ManageStudio.
                        </div>
                      </div>
                    </div>

                    <div className="ms-as-step-item">
                      <div className="ms-as-step-badge">5</div>
                      <div className="ms-as-step-body">
                        <div className="ms-as-step-name">Export Selected Images</div>
                        <div className="ms-as-step-text">
                          ManageStudio creates a new folder named “Album Selection” inside your output location and copies only the final selected original images into this folder, ready for album design.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Workflow Graphic (HTML & CSS Responsive Component) */}
                  <div className="ms-as-visual-pane">
                    <div className="ms-as-diagram-card">
                      {/* Top Pill: Client selects photos on any device */}
                      <div className="ms-as-diagram-badge">
                        <span>Client selects photos on any device</span>
                      </div>

                      {/* Device Previews (Laptop + Phone) */}
                      <div className="ms-as-devices-wrapper">
                        {/* Laptop Preview */}
                        <div className="ms-as-laptop">
                          <div className="ms-as-laptop-screen">
                            <div className="ms-as-laptop-camera" />
                            <div className="ms-as-laptop-inner">
                              <div className="ms-as-laptop-toolbar">
                                <span className="ms-as-selection-pill">
                                  <Check size={8} strokeWidth={3.2} /> 48 / 80 Selected
                                </span>
                                <span className="ms-as-submit-pill">
                                  Submit Selection
                                </span>
                              </div>

                              <div className="ms-as-laptop-grid">
                                {[
                                  { url: 'https://images.pexels.com/photos/30497750/pexels-photo-30497750.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/39625024/pexels-photo-39625024.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/32923331/pexels-photo-32923331.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/33417236/pexels-photo-33417236.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false },
                                  { url: 'https://images.pexels.com/photos/32060316/pexels-photo-32060316.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false },
                                  { url: 'https://images.pexels.com/photos/35328204/pexels-photo-35328204.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false },
                                  { url: 'https://images.pexels.com/photos/38526712/pexels-photo-38526712.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false },
                                  { url: 'https://images.pexels.com/photos/35263458/pexels-photo-35263458.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/38259809/pexels-photo-38259809.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                  { url: 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false }
                                ].map((photo, i) => (
                                  <div key={i} className={`ms-as-photo-thumb ${photo.selected ? 'selected' : ''}`}>
                                    <img src={photo.url} alt="Wedding moment" loading="lazy" />
                                    <span className={`ms-as-check-badge ${photo.selected ? 'checked' : 'unchecked'}`}>
                                      {photo.selected && <Check size={7} strokeWidth={3.2} />}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="ms-as-laptop-base">
                            <div className="ms-as-laptop-notch" />
                          </div>
                        </div>

                        {/* Mobile Phone Preview */}
                        <div className="ms-as-phone">
                          <div className="ms-as-phone-notch" />
                          <div className="ms-as-phone-inner">
                            <div className="ms-as-phone-header">
                              <span>Our Wedding</span>
                              <span className="ms-as-phone-star">★</span>
                            </div>
                            <div className="ms-as-phone-counter">
                              <Check size={6} strokeWidth={3} /> 48 / 80 Selected
                            </div>
                            <div className="ms-as-phone-grid">
                              {[
                                { url: 'https://images.pexels.com/photos/30497750/pexels-photo-30497750.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                { url: 'https://images.pexels.com/photos/39625024/pexels-photo-39625024.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                { url: 'https://images.pexels.com/photos/33417236/pexels-photo-33417236.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                { url: 'https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false },
                                { url: 'https://images.pexels.com/photos/35263458/pexels-photo-35263458.jpeg?auto=compress&cs=tinysrgb&w=250', selected: true },
                                { url: 'https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=250', selected: false }
                              ].map((photo, i) => (
                                <div key={i} className={`ms-as-phone-thumb ${photo.selected ? 'selected' : ''}`}>
                                  <img src={photo.url} alt="Mobile thumbnail" loading="lazy" />
                                  <span className={`ms-as-check-badge small ${photo.selected ? 'checked' : 'unchecked'}`}>
                                    {photo.selected && <Check size={5} strokeWidth={3.2} />}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="ms-as-phone-submit">
                              Submit Selection
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Flow Step: Down Arrow + Pill */}
                      <div className="ms-as-flow-step">
                        <div className="ms-as-down-arrow">
                          <ArrowDown size={14} strokeWidth={2.6} />
                        </div>
                        <div className="ms-as-diagram-badge badge-secondary">
                          <span>Selected images exported to folder</span>
                        </div>
                      </div>

                      {/* Bottom Export Card -> Folder Workflow */}
                      <div className="ms-as-export-workflow">
                        {/* Export Card */}
                        <div className="ms-as-export-card">
                          <div className="ms-as-export-title-row">
                            <CheckCircle2 size={13} className="ms-as-blue-icon" />
                            <span className="ms-as-export-title">Album Selection</span>
                          </div>
                          <div className="ms-as-export-sub">
                            <Check size={8} strokeWidth={2.5} className="ms-as-check-blue" /> Client submitted 48 photos
                          </div>
                          <div className="ms-as-export-btn">
                            Export Selected Images
                          </div>
                        </div>

                        {/* Blue Flow Arrow */}
                        <div className="ms-as-export-arrow">
                          <ArrowRight size={16} strokeWidth={2.5} />
                        </div>

                        {/* Yellow Folder with Peeking Photos */}
                        <div className="ms-as-folder-target">
                          <div className="ms-as-folder-icon-wrapper">
                            <div className="ms-as-peeking-photo photo-left">
                              <img src="https://images.pexels.com/photos/30497750/pexels-photo-30497750.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Selected 1" />
                            </div>
                            <div className="ms-as-peeking-photo photo-right">
                              <img src="https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Selected 2" />
                            </div>
                            <svg className="ms-as-folder-svg" width="50" height="38" viewBox="0 0 54 42" fill="none">
                              <path d="M2 10C2 7.79086 3.79086 6 6 6H18.2792C19.4216 6 20.5106 6.48835 21.2721 7.34005L23.7279 10.0881C24.4894 10.9398 25.5784 11.4281 26.7208 11.4281H48C50.2091 11.4281 52 13.219 52 15.4281V36C52 38.2091 50.2091 40 48 40H6C3.79086 40 2 38.2091 2 36V10Z" fill="#F59E0B" />
                              <path d="M0 16C0 13.7909 1.79086 12 4 12H50C52.2091 12 54 13.7909 54 16V38C54 40.2091 52.2091 42 50 42H4C1.79086 42 0 40.2091 0 38V16Z" fill="#FBBF24" />
                            </svg>
                          </div>
                          <div className="ms-as-folder-label">Album Selection</div>
                          <div className="ms-as-folder-count">48 images</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Highlight Banner */}
              <div className="ms-as-bottom-banner">
                <div className="ms-as-banner-icon-box">
                  <Folder size={20} color="#2563EB" strokeWidth={2.2} />
                </div>
                <div className="ms-as-banner-text">
                  <h5 className="ms-as-banner-title">Ready for Album Design</h5>
                  <p className="ms-as-banner-sub">
                    Your client's final selected photos are organized in one folder, ready for your album designer.
                  </p>
                </div>
              </div>
            </div>
          ) : isGuestAi ? (
            <div className="ms-gp-body">
              {/* 1. Header */}
              <div className="ms-gp-header">
                <div className="ms-gp-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <div className="ms-gp-header-text">
                  <h3 className="ms-gp-title">Guest Photo AI</h3>
                  <p className="ms-gp-desc">
                    Let guests find and download their own photos using a selfie.<br />
                    AI finds their photos from your wedding.
                  </p>
                </div>
              </div>

              {/* 2. Four Benefits Grid */}
              <div className="ms-gp-benefits-grid">
                <div className="ms-gp-benefit-card">
                  <div className="ms-gp-benefit-icon">
                    <Zap size={16} color="#ffffff" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-gp-benefit-title">Find Your Photos Fast</h4>
                  <p className="ms-gp-benefit-desc">
                    Guests can quickly find their wedding photos using a selfie.
                  </p>
                </div>

                <div className="ms-gp-benefit-card">
                  <div className="ms-gp-benefit-icon">
                    <User size={16} color="#ffffff" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-gp-benefit-title">Private Personal Results</h4>
                  <p className="ms-gp-benefit-desc">
                    Each guest only sees photos where they appear.
                  </p>
                </div>

                <div className="ms-gp-benefit-card">
                  <div className="ms-gp-benefit-icon">
                    <Search size={16} color="#ffffff" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-gp-benefit-title">No Manual Searching</h4>
                  <p className="ms-gp-benefit-desc">
                    No need to scroll through hundreds of photos.
                  </p>
                </div>

                <div className="ms-gp-benefit-card">
                  <div className="ms-gp-benefit-icon">
                    <Download size={16} color="#ffffff" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-gp-benefit-title">Easy Downloads</h4>
                  <p className="ms-gp-benefit-desc">
                    Guests can preview and download their photos on any device.
                  </p>
                </div>
              </div>

              {/* 3. How It Works Section */}
              <div className="ms-gp-how-section">
                <h4 className="ms-gp-how-title">How It Works</h4>

                {/* 6 Steps Grid Headers */}
                <div className="ms-gp-steps-grid">
                  <div className="ms-gp-step-col">
                    <div className="ms-gp-step-head">
                      <span className="ms-gp-step-num">1</span>
                      <span className="ms-gp-step-name">Upload Photos</span>
                    </div>
                    <p className="ms-gp-step-desc">
                      Studio uploads wedding photos to ManageStudio.
                    </p>
                  </div>

                  <div className="ms-gp-step-col">
                    <div className="ms-gp-step-head">
                      <span className="ms-gp-step-num">2</span>
                      <span className="ms-gp-step-name">Create QR Code</span>
                    </div>
                    <p className="ms-gp-step-desc">
                      Studio generates a QR code and private guest link.
                    </p>
                  </div>

                  <div className="ms-gp-step-col">
                    <div className="ms-gp-step-head">
                      <span className="ms-gp-step-num">3</span>
                      <span className="ms-gp-step-name">Guest Scans or Opens Link</span>
                    </div>
                    <p className="ms-gp-step-desc">
                      Guest scans the QR code or opens the link on their phone.
                    </p>
                  </div>

                  <div className="ms-gp-step-col">
                    <div className="ms-gp-step-head">
                      <span className="ms-gp-step-num">4</span>
                      <span className="ms-gp-step-name">Guest Takes a Selfie</span>
                    </div>
                    <p className="ms-gp-step-desc">
                      Guest takes a clear selfie using their phone.
                    </p>
                  </div>

                  <div className="ms-gp-step-col">
                    <div className="ms-gp-step-head">
                      <span className="ms-gp-step-num">5</span>
                      <span className="ms-gp-step-name">AI Finds Photos</span>
                    </div>
                    <p className="ms-gp-step-desc">
                      AI matches the selfie and finds photos containing the guest.
                    </p>
                  </div>

                  <div className="ms-gp-step-col">
                    <div className="ms-gp-step-head">
                      <span className="ms-gp-step-num">6</span>
                      <span className="ms-gp-step-name">Preview &amp; Download</span>
                    </div>
                    <p className="ms-gp-step-desc">
                      Guest can preview their matched photos and download them.
                    </p>
                  </div>
                </div>

                {/* 6 Steps Visual Workflow (Real HTML & CSS Component) */}
                <div className="ms-gp-workflow-stage-container">
                  {/* Stage 1: Upload Photos (Laptop) */}
                  <div className="ms-gp-stage-item ms-gp-stage-laptop">
                    <div className="ms-gp-laptop-wrap">
                      <div className="ms-gp-laptop-screen">
                        <div className="ms-gp-laptop-cam" />
                        <div className="ms-gp-laptop-inner">
                          <div className="ms-gp-laptop-bar">
                            <img
                              src="/managestudio-logo-black.png"
                              alt="ManageStudio"
                              className="ms-gp-laptop-logo-img"
                            />
                            <div className="ms-gp-laptop-window-dots">
                              <span /><span /><span />
                            </div>
                          </div>
                          <div className="ms-gp-laptop-grid">
                            <div className="ms-gp-laptop-thumb"><img src="https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Wedding guest moment" loading="lazy" /></div>
                            <div className="ms-gp-laptop-thumb"><img src="https://images.pexels.com/photos/39625024/pexels-photo-39625024.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Wedding ceremony" loading="lazy" /></div>
                            <div className="ms-gp-laptop-thumb"><img src="https://images.pexels.com/photos/35328204/pexels-photo-35328204.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Dance celebration" loading="lazy" /></div>
                            <div className="ms-gp-laptop-thumb"><img src="https://images.pexels.com/photos/32923331/pexels-photo-32923331.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Reception ritual" loading="lazy" /></div>
                            <div className="ms-gp-laptop-thumb"><img src="https://images.pexels.com/photos/33417236/pexels-photo-33417236.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Mandap floral decor" loading="lazy" /></div>
                            <div className="ms-gp-laptop-thumb"><img src="https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Haldi candid moment" loading="lazy" /></div>
                          </div>
                          <div className="ms-gp-upload-overlay">
                            <div className="ms-gp-upload-badge">
                              <UploadCloud size={15} strokeWidth={2.5} color="#ffffff" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ms-gp-laptop-base">
                        <div className="ms-gp-laptop-notch" />
                      </div>
                    </div>
                  </div>

                  <div className="ms-gp-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 2: Create QR Code (Framed Event Table Stand) */}
                  <div className="ms-gp-stage-item ms-gp-stage-sign">
                    <div className="ms-gp-sign-frame">
                      <div className="ms-gp-sign-inner">
                        <div className="ms-gp-sign-header">
                          <span className="ms-gp-sign-eyebrow">Find Your</span>
                          <span className="ms-gp-sign-title">Wedding Photos</span>
                        </div>
                        <div className="ms-gp-qr-box">
                          <svg className="ms-gp-qr-svg" viewBox="0 0 33 33" width="46" height="46" fill="#0f172a">
                            {/* Top-Left Finder */}
                            <rect x="2" y="2" width="7" height="7" rx="1" fill="#0f172a" />
                            <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
                            <rect x="4" y="4" width="3" height="3" rx="0.5" fill="#0f172a" />
                            {/* Top-Right Finder */}
                            <rect x="24" y="2" width="7" height="7" rx="1" fill="#0f172a" />
                            <rect x="25" y="3" width="5" height="5" fill="#ffffff" />
                            <rect x="26" y="4" width="3" height="3" rx="0.5" fill="#0f172a" />
                            {/* Bottom-Left Finder */}
                            <rect x="2" y="24" width="7" height="7" rx="1" fill="#0f172a" />
                            <rect x="3" y="25" width="5" height="5" fill="#ffffff" />
                            <rect x="4" y="26" width="3" height="3" rx="0.5" fill="#0f172a" />
                            {/* Timing & Data Cells */}
                            <rect x="10" y="4" width="1.5" height="1.5" /><rect x="13" y="4" width="1.5" height="1.5" /><rect x="16" y="4" width="1.5" height="1.5" /><rect x="19" y="4" width="1.5" height="1.5" />
                            <rect x="4" y="10" width="1.5" height="1.5" /><rect x="4" y="13" width="1.5" height="1.5" /><rect x="4" y="16" width="1.5" height="1.5" /><rect x="4" y="19" width="1.5" height="1.5" />
                            <rect x="11" y="11" width="2" height="2" /><rect x="15" y="10" width="2" height="1.5" /><rect x="18" y="11" width="1.5" height="2" /><rect x="21" y="10" width="2" height="2" />
                            <rect x="10" y="14" width="2.5" height="2" /><rect x="14" y="13" width="2.5" height="2" rx="0.4" /><rect x="18" y="14" width="2" height="1.5" /><rect x="21" y="13" width="1.5" height="2.5" />
                            <rect x="11" y="17" width="2" height="1.5" /><rect x="15" y="16" width="2" height="2.5" /><rect x="18" y="17" width="2" height="2" /><rect x="21" y="17" width="2" height="1.5" />
                            <rect x="10" y="20" width="2.5" height="1.5" /><rect x="14" y="20" width="1.5" height="2" /><rect x="18" y="20" width="2.5" height="2" />
                            <rect x="12" y="24" width="2" height="2" /><rect x="16" y="24" width="2" height="1.5" /><rect x="20" y="24" width="2" height="2" />
                            <rect x="24" y="12" width="2" height="2" /><rect x="27" y="11" width="1.5" height="2.5" /><rect x="25" y="16" width="2.5" height="2" /><rect x="24" y="19" width="2" height="2" />
                            <rect x="12" y="27" width="2" height="2" /><rect x="16" y="27" width="2.5" height="2" /><rect x="21" y="27" width="2" height="1.5" /><rect x="25" y="24" width="2" height="2.5" />
                          </svg>
                        </div>
                        <div className="ms-gp-sign-footer">
                          <span className="ms-gp-sign-action">Scan &amp; Take a Selfie</span>
                          <Camera size={8} strokeWidth={2.4} color="#059669" />
                        </div>
                      </div>
                      <div className="ms-gp-sign-floral">
                        <svg viewBox="0 0 120 16" width="100%" height="14" fill="none">
                          <path d="M5 12 Q 25 5, 45 10 Q 65 14, 85 8 Q 105 13, 115 11" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" />
                          <circle cx="20" cy="8" r="3" fill="#f43f5e" />
                          <circle cx="38" cy="10" r="2.5" fill="#fde047" />
                          <circle cx="60" cy="7" r="3.5" fill="#fb7185" />
                          <circle cx="80" cy="8" r="3" fill="#ffffff" stroke="#f43f5e" strokeWidth="0.8" />
                          <circle cx="98" cy="10" r="2.5" fill="#fbbf24" />
                          <ellipse cx="14" cy="11" rx="3.5" ry="1.8" fill="#22c55e" transform="rotate(-15 14 11)" />
                          <ellipse cx="48" cy="11" rx="3.5" ry="1.8" fill="#16a34a" transform="rotate(18 48 11)" />
                          <ellipse cx="72" cy="10" rx="3.5" ry="1.8" fill="#22c55e" transform="rotate(-12 72 10)" />
                          <ellipse cx="90" cy="11" rx="3.5" ry="1.8" fill="#16a34a" transform="rotate(20 90 11)" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="ms-gp-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 3: Guest Scans or Opens Link (Phone Viewfinder) */}
                  <div className="ms-gp-stage-item ms-gp-stage-scan">
                    <div className="ms-gp-phone-wrap">
                      <div className="ms-gp-phone-notch" />
                      <div className="ms-gp-phone-inner scan-screen">
                        <div className="ms-gp-phone-topbar">
                          <span>10:25</span>
                          <div className="ms-gp-phone-status-icons">
                            <span className="ms-gp-status-dot" />
                            <span className="ms-gp-status-dot" />
                          </div>
                        </div>
                        <div className="ms-gp-viewfinder-box">
                          <div className="ms-gp-reticle reticle-tl" />
                          <div className="ms-gp-reticle reticle-tr" />
                          <div className="ms-gp-reticle reticle-bl" />
                          <div className="ms-gp-reticle reticle-br" />
                          <div className="ms-gp-scan-laser" />
                          <svg className="ms-gp-qr-svg" viewBox="0 0 33 33" width="34" height="34" fill="#0f172a">
                            <rect x="2" y="2" width="7" height="7" rx="1" fill="#0f172a" />
                            <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
                            <rect x="4" y="4" width="3" height="3" rx="0.5" fill="#0f172a" />
                            <rect x="24" y="2" width="7" height="7" rx="1" fill="#0f172a" />
                            <rect x="25" y="3" width="5" height="5" fill="#ffffff" />
                            <rect x="26" y="4" width="3" height="3" rx="0.5" fill="#0f172a" />
                            <rect x="2" y="24" width="7" height="7" rx="1" fill="#0f172a" />
                            <rect x="3" y="25" width="5" height="5" fill="#ffffff" />
                            <rect x="4" y="26" width="3" height="3" rx="0.5" fill="#0f172a" />
                            <rect x="11" y="11" width="3" height="3" /><rect x="16" y="10" width="3" height="2" /><rect x="21" y="11" width="2" height="3" />
                            <rect x="11" y="16" width="2" height="3" /><rect x="15" y="15" width="3" height="3" /><rect x="20" y="16" width="3" height="2" />
                            <rect x="12" y="21" width="3" height="2" /><rect x="17" y="21" width="2" height="3" />
                          </svg>
                        </div>
                        <div className="ms-gp-scan-text">
                          <span>Scan the QR code</span>
                          <span>or open the link</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-gp-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 4: Guest Takes a Selfie (Phone Camera) */}
                  <div className="ms-gp-stage-item ms-gp-stage-selfie">
                    <div className="ms-gp-phone-wrap">
                      <div className="ms-gp-phone-notch" />
                      <div className="ms-gp-phone-inner selfie-screen">
                        <div className="ms-gp-screen-nav">
                          <ChevronLeft size={9} strokeWidth={2.8} />
                          <span>Take a Selfie</span>
                        </div>
                        <div className="ms-gp-selfie-frame">
                          <div className="ms-gp-face-corner corner-tl" />
                          <div className="ms-gp-face-corner corner-tr" />
                          <div className="ms-gp-face-corner corner-bl" />
                          <div className="ms-gp-face-corner corner-br" />
                          <img 
                            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=350" 
                            alt="Guest selfie photo" 
                            className="ms-gp-selfie-img" 
                            loading="lazy"
                          />
                        </div>
                        <div className="ms-gp-selfie-instruction">
                          Take a selfie to find your photos
                        </div>
                        <div className="ms-gp-shutter-row">
                          <div className="ms-gp-shutter-btn">
                            <div className="ms-gp-shutter-inner" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-gp-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 5: AI Finds Photos (Phone Matching) */}
                  <div className="ms-gp-stage-item ms-gp-stage-matching">
                    <div className="ms-gp-phone-wrap">
                      <div className="ms-gp-phone-notch" />
                      <div className="ms-gp-phone-inner matching-screen">
                        <div className="ms-gp-matching-header">
                          Finding Your Photos...
                        </div>
                        <div className="ms-gp-matching-avatar-wrap">
                          <div className="ms-gp-matching-ring" />
                          <img 
                            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=350" 
                            alt="Matched guest avatar" 
                            className="ms-gp-matching-avatar" 
                            loading="lazy"
                          />
                        </div>
                        <div className="ms-gp-matching-icon-badge">
                          <Sparkles size={11} color="#059669" strokeWidth={2.5} />
                        </div>
                        <div className="ms-gp-matching-progress-bar">
                          <div className="ms-gp-matching-progress-fill" />
                        </div>
                        <div className="ms-gp-matching-sub">
                          Searching wedding photos for matches...
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-gp-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 6: Preview and Download (Phone Gallery) */}
                  <div className="ms-gp-stage-item ms-gp-stage-results">
                    <div className="ms-gp-phone-wrap">
                      <div className="ms-gp-phone-notch" />
                      <div className="ms-gp-phone-inner results-screen">
                        <div className="ms-gp-results-header">
                          Your Photos
                        </div>
                        <div className="ms-gp-results-grid">
                          <div className="ms-gp-result-thumb hero-thumb">
                            <img src="https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=350" alt="Matched guest wedding portrait" loading="lazy" />
                          </div>
                          <div className="ms-gp-result-thumb">
                            <img src="https://images.pexels.com/photos/35328204/pexels-photo-35328204.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Matched guest dance moment" loading="lazy" />
                          </div>
                          <div className="ms-gp-result-thumb">
                            <img src="https://images.pexels.com/photos/32923331/pexels-photo-32923331.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Matched guest reception celebration" loading="lazy" />
                          </div>
                          <div className="ms-gp-result-thumb">
                            <img src="https://images.pexels.com/photos/39625024/pexels-photo-39625024.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Matched guest garland moment" loading="lazy" />
                          </div>
                          <div className="ms-gp-result-thumb">
                            <img src="https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=250" alt="Matched guest haldi ritual" loading="lazy" />
                          </div>
                        </div>
                        <div className="ms-gp-download-btn">
                          <Download size={8} strokeWidth={2.6} />
                          <span>Download My Photos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Bottom Highlight Banner */}
              <div className="ms-gp-bottom-banner">
                <div className="ms-gp-banner-icon-box">
                  <Camera size={20} color="#059669" strokeWidth={2.2} />
                </div>
                <div className="ms-gp-banner-text">
                  <h5 className="ms-gp-banner-title">Your wedding photos, found in seconds.</h5>
                  <p className="ms-gp-banner-sub">
                    Give your guests a simple and enjoyable way to find and download their own photos.
                  </p>
                </div>
              </div>
            </div>
          ) : isSongSelection ? (
            <div className="ms-ss-body">
              {/* 1. Header */}
              <div className="ms-ss-header">
                <div className="ms-ss-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div className="ms-ss-header-text">
                  <h3 className="ms-ss-title">Song Selection</h3>
                  <p className="ms-ss-desc">
                    Let clients choose music for every wedding moment. Share a private selection link where they can add YouTube or Spotify songs for each scene and submit their choices to your studio.
                  </p>
                </div>
              </div>

              {/* 2. Four Benefits Grid */}
              <div className="ms-ss-benefits-grid">
                <div className="ms-ss-benefit-card">
                  <div className="ms-ss-benefit-icon ms-ss-benefit-icon-pink">
                    <Music size={16} color="#ffffff" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ss-benefit-title">Personalized Music</h4>
                  <p className="ms-ss-benefit-desc">
                    Clients can choose songs for each wedding moment and scene.
                  </p>
                </div>

                <div className="ms-ss-benefit-card">
                  <div className="ms-ss-benefit-icon-brands">
                    <div className="ms-ss-yt-badge">
                      <svg width="22" height="16" viewBox="0 0 24 17" fill="none">
                        <rect width="24" height="17" rx="4" fill="#FF0000" />
                        <polygon points="9.5,4.5 16.5,8.5 9.5,12.5" fill="#FFFFFF" />
                      </svg>
                    </div>
                    <div className="ms-ss-sp-badge">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
                        <circle cx="12" cy="12" r="12" fill="#1DB954"/>
                        <path d="M17.485 16.94a.75.75 0 0 1-1.03.25c-2.825-1.727-6.381-2.118-10.57-1.16a.75.75 0 1 1-.334-1.462c4.582-1.047 8.513-.6 11.684 1.341a.75.75 0 0 1 .25 1.031zm1.385-3.084a.938.938 0 0 1-1.288.31c-3.233-1.988-8.163-2.564-11.988-1.402a.938.938 0 1 1-.549-1.794c4.372-1.33 9.807-.687 13.515 1.597a.938.938 0 0 1 .31 1.289zm.12-3.214c-3.878-2.302-10.278-2.515-13.985-1.388a1.125 1.125 0 0 1-.659-2.152c4.256-1.293 11.33-1.047 15.795 1.603a1.125 1.125 0 0 1-1.151 1.937z" fill="#FFFFFF"/>
                      </svg>
                    </div>
                  </div>
                  <h4 className="ms-ss-benefit-title">Add from YouTube or Spotify</h4>
                  <p className="ms-ss-benefit-desc">
                    Clients can search and add songs using YouTube or Spotify links.
                  </p>
                </div>

                <div className="ms-ss-benefit-card">
                  <div className="ms-ss-benefit-icon ms-ss-benefit-icon-soft">
                    <Clock size={16} color="#E11D48" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ss-benefit-title">Saves Time</h4>
                  <p className="ms-ss-benefit-desc">
                    No more long discussions or manual song lists.
                  </p>
                </div>

                <div className="ms-ss-benefit-card">
                  <div className="ms-ss-benefit-icon ms-ss-benefit-icon-soft">
                    <Users size={16} color="#E11D48" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ss-benefit-title">Organized Selections</h4>
                  <p className="ms-ss-benefit-desc">
                    All song selections are submitted and organized for your studio.
                  </p>
                </div>
              </div>

              {/* 3. How It Works Section */}
              <div className="ms-ss-how-section">
                <h4 className="ms-ss-how-title">How It Works</h4>

                {/* 6 Steps Grid Headers */}
                <div className="ms-ss-steps-grid">
                  <div className="ms-ss-step-col">
                    <div className="ms-ss-step-head">
                      <span className="ms-ss-step-num">1</span>
                      <span className="ms-ss-step-name">Generate Song Link</span>
                    </div>
                    <p className="ms-ss-step-desc">
                      Create a private song selection link in ManageStudio.
                    </p>
                  </div>

                  <div className="ms-ss-step-col">
                    <div className="ms-ss-step-head">
                      <span className="ms-ss-step-num">2</span>
                      <span className="ms-ss-step-name">Share with Client</span>
                    </div>
                    <p className="ms-ss-step-desc">
                      Send the private song selection link to the client via WhatsApp or message.
                    </p>
                  </div>

                  <div className="ms-ss-step-col">
                    <div className="ms-ss-step-head">
                      <span className="ms-ss-step-num">3</span>
                      <span className="ms-ss-step-name">Client Adds Songs</span>
                    </div>
                    <p className="ms-ss-step-desc">
                      Client opens the link and adds YouTube or Spotify songs for each scene.
                    </p>
                  </div>

                  <div className="ms-ss-step-col">
                    <div className="ms-ss-step-head">
                      <span className="ms-ss-step-num">4</span>
                      <span className="ms-ss-step-name">Client Submits</span>
                    </div>
                    <p className="ms-ss-step-desc">
                      Client reviews their song list and submits the final selection.
                    </p>
                  </div>

                  <div className="ms-ss-step-col">
                    <div className="ms-ss-step-head">
                      <span className="ms-ss-step-num">5</span>
                      <span className="ms-ss-step-name">View in ManageStudio</span>
                    </div>
                    <p className="ms-ss-step-desc">
                      Studio receives the submitted song selections scene wise.
                    </p>
                  </div>

                  <div className="ms-ss-step-col">
                    <div className="ms-ss-step-head">
                      <span className="ms-ss-step-num">6</span>
                      <span className="ms-ss-step-name">Use in Editing</span>
                    </div>
                    <p className="ms-ss-step-desc">
                      Use the selected songs in your video editing software for the final wedding films.
                    </p>
                  </div>
                </div>

                {/* 6 Steps Visual Workflow (Real HTML & CSS Component) */}
                <div className="ms-ss-workflow-stage-container">
                  {/* Stage 1: Generate Song Link (Laptop) */}
                  <div className="ms-ss-stage-item ms-ss-stage-laptop">
                    <div className="ms-ss-laptop-wrap">
                      <div className="ms-ss-laptop-screen">
                        <div className="ms-ss-laptop-cam" />
                        <div className="ms-ss-laptop-inner">
                          <div className="ms-ss-card-box">
                            <h5 className="ms-ss-card-title">Generate Song Link</h5>
                            <p className="ms-ss-card-sub">Create a private link and share it with your client.</p>
                            <div className="ms-ss-input-box">
                              <span className="ms-ss-url-text">https://managestudio.io/song/abc123</span>
                              <Copy size={9} className="ms-ss-copy-icon" />
                            </div>
                            <div className="ms-ss-primary-btn">
                              <LinkIcon size={8} strokeWidth={2.4} />
                              <span>Generate Song Link</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ms-ss-laptop-base">
                        <div className="ms-ss-laptop-notch" />
                      </div>
                    </div>
                  </div>

                  <div className="ms-ss-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 2: Share with Client (WhatsApp Phone Screen) */}
                  <div className="ms-ss-stage-item ms-ss-stage-chat">
                    <div className="ms-ss-phone-wrap">
                      <div className="ms-ss-phone-notch" />
                      <div className="ms-ss-phone-inner chat-screen">
                        <div className="ms-ss-chat-header">
                          <ChevronLeft size={8} strokeWidth={2.8} />
                          <div className="ms-ss-chat-user-info">
                            <span className="ms-ss-chat-user-name">Client</span>
                            <span className="ms-ss-chat-status">Online</span>
                          </div>
                        </div>
                        <div className="ms-ss-chat-body">
                          <div className="ms-ss-chat-bubble">
                            <p className="ms-ss-bubble-text">Here is your song selection link for our wedding.</p>
                            <div className="ms-ss-bubble-link-box">
                              <span className="ms-ss-bubble-link">https://managestudio.io/song/abc123</span>
                            </div>
                            <div className="ms-ss-bubble-meta">
                              <span>10:30 AM</span>
                              <span className="ms-ss-checks">✓✓</span>
                            </div>
                          </div>
                        </div>
                        <div className="ms-ss-chat-footer">
                          <div className="ms-ss-chat-input-pill">
                            <span>Message</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-ss-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 3: Client Adds Songs (Mobile App Screen) */}
                  <div className="ms-ss-stage-item ms-ss-stage-songs">
                    <div className="ms-ss-phone-wrap">
                      <div className="ms-ss-phone-notch" />
                      <div className="ms-ss-phone-inner songs-screen">
                        <div className="ms-ss-screen-head">
                          <span>Song Selection</span>
                        </div>
                        <div className="ms-ss-scene-section">
                          <div className="ms-ss-scene-title">Mehendi</div>
                          <div className="ms-ss-song-row">
                            <div className="ms-ss-song-info">
                              <span className="ms-ss-song-name">Kesariya</span>
                              <span className="ms-ss-song-artist">Arijit Singh</span>
                            </div>
                            <div className="ms-ss-yt-badge-sm">
                              <svg width="15" height="11" viewBox="0 0 24 17" fill="none">
                                <rect width="24" height="17" rx="4" fill="#FF0000" />
                                <polygon points="9.5,4.5 16.5,8.5 9.5,12.5" fill="#FFFFFF" />
                              </svg>
                            </div>
                          </div>
                          <div className="ms-ss-add-prompt">
                            + Add from YouTube or Spotify
                          </div>
                        </div>
                        <div className="ms-ss-scene-section">
                          <div className="ms-ss-scene-title">Sangeet</div>
                          <div className="ms-ss-song-row">
                            <div className="ms-ss-song-info">
                              <span className="ms-ss-song-name">Aaj Ki Raat</span>
                              <span className="ms-ss-song-artist">Madhubanti Bagchi</span>
                            </div>
                            <div className="ms-ss-sp-badge-sm">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#1DB954">
                                <circle cx="12" cy="12" r="12" fill="#1DB954"/>
                                <path d="M17.485 16.94a.75.75 0 0 1-1.03.25c-2.825-1.727-6.381-2.118-10.57-1.16a.75.75 0 1 1-.334-1.462c4.582-1.047 8.513-.6 11.684 1.341a.75.75 0 0 1 .25 1.031zm1.385-3.084a.938.938 0 0 1-1.288.31c-3.233-1.988-8.163-2.564-11.988-1.402a.938.938 0 1 1-.549-1.794c4.372-1.33 9.807-.687 13.515 1.597a.938.938 0 0 1 .31 1.289zm.12-3.214c-3.878-2.302-10.278-2.515-13.985-1.388a1.125 1.125 0 0 1-.659-2.152c4.256-1.293 11.33-1.047 15.795 1.603a1.125 1.125 0 0 1-1.151 1.937z" fill="#FFFFFF"/>
                              </svg>
                            </div>
                          </div>
                          <div className="ms-ss-add-prompt">
                            + Add from YouTube or Spotify
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-ss-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 4: Client Submits (Mobile Success Screen) */}
                  <div className="ms-ss-stage-item ms-ss-stage-submit">
                    <div className="ms-ss-phone-wrap">
                      <div className="ms-ss-phone-notch" />
                      <div className="ms-ss-phone-inner submit-screen">
                        <div className="ms-ss-submit-content">
                          <div className="ms-ss-submit-check-circle">
                            <Check size={14} strokeWidth={3} color="#ffffff" />
                          </div>
                          <h5 className="ms-ss-submit-title">Song Selection Submitted!</h5>
                          <p className="ms-ss-submit-desc">Your song choices have been sent to the studio.</p>
                          <div className="ms-ss-submit-btn">
                            Go Back
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-ss-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 5: View in ManageStudio (Studio Panel Laptop) */}
                  <div className="ms-ss-stage-item ms-ss-stage-panel">
                    <div className="ms-ss-laptop-wrap">
                      <div className="ms-ss-laptop-screen">
                        <div className="ms-ss-laptop-cam" />
                        <div className="ms-ss-laptop-inner studio-panel-inner">
                          <div className="ms-ss-panel-header">
                            <span>Client Selections</span>
                          </div>
                          <div className="ms-ss-scenes-list">
                            <div className="ms-ss-scene-item">
                              <div className="ms-ss-scene-left">
                                <Music size={7} className="ms-ss-scene-icon icon-rose" />
                                <span className="ms-ss-scene-name">Mehendi</span>
                              </div>
                              <div className="ms-ss-scene-right">
                                <span className="ms-ss-scene-count">3 songs</span>
                                <ChevronRight size={7} />
                              </div>
                            </div>
                            <div className="ms-ss-scene-item">
                              <div className="ms-ss-scene-left">
                                <Music size={7} className="ms-ss-scene-icon icon-purple" />
                                <span className="ms-ss-scene-name">Sangeet</span>
                              </div>
                              <div className="ms-ss-scene-right">
                                <span className="ms-ss-scene-count">5 songs</span>
                                <ChevronRight size={7} />
                              </div>
                            </div>
                            <div className="ms-ss-scene-item">
                              <div className="ms-ss-scene-left">
                                <Music size={7} className="ms-ss-scene-icon icon-amber" />
                                <span className="ms-ss-scene-name">Haldi</span>
                              </div>
                              <div className="ms-ss-scene-right">
                                <span className="ms-ss-scene-count">4 songs</span>
                                <ChevronRight size={7} />
                              </div>
                            </div>
                            <div className="ms-ss-scene-item">
                              <div className="ms-ss-scene-left">
                                <Music size={7} className="ms-ss-scene-icon icon-pink" />
                                <span className="ms-ss-scene-name">Wedding Entry</span>
                              </div>
                              <div className="ms-ss-scene-right">
                                <span className="ms-ss-scene-count">6 songs</span>
                                <ChevronRight size={7} />
                              </div>
                            </div>
                            <div className="ms-ss-scene-item">
                              <div className="ms-ss-scene-left">
                                <Music size={7} className="ms-ss-scene-icon icon-blue" />
                                <span className="ms-ss-scene-name">Reception</span>
                              </div>
                              <div className="ms-ss-scene-right">
                                <span className="ms-ss-scene-count">4 songs</span>
                                <ChevronRight size={7} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ms-ss-laptop-base">
                        <div className="ms-ss-laptop-notch" />
                      </div>
                    </div>
                  </div>

                  <div className="ms-ss-stage-arrow">
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </div>

                  {/* Stage 6: Use in Editing (NLE Video Timeline Preview) */}
                  <div className="ms-ss-stage-item ms-ss-stage-editing">
                    <div className="ms-ss-editing-wrap">
                      <div className="ms-ss-editing-monitor">
                        {/* Top Video Preview Thumbnail */}
                        <div className="ms-ss-video-player">
                          <img 
                            src="https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=350" 
                            alt="Wedding Video Film Preview" 
                            className="ms-ss-video-thumb"
                            loading="lazy"
                          />
                        </div>
                        {/* Bottom NLE Editing Timeline */}
                        <div className="ms-ss-timeline-box">
                          <div className="ms-ss-timeline-playhead" />
                          <div className="ms-ss-timeline-track track-purple">
                            <Music size={6} className="ms-ss-track-icon" />
                            <span className="ms-ss-track-label">Mehendi Kesariya.mp3</span>
                            <div className="ms-ss-waveform" />
                          </div>
                          <div className="ms-ss-timeline-track track-teal">
                            <Music size={6} className="ms-ss-track-icon" />
                            <span className="ms-ss-track-label">Sangeet AajKiRaat.mp3</span>
                            <div className="ms-ss-waveform" />
                          </div>
                          <div className="ms-ss-timeline-track track-amber">
                            <Music size={6} className="ms-ss-track-icon" />
                            <span className="ms-ss-track-label">Wedding Film Master.wav</span>
                            <div className="ms-ss-waveform" />
                          </div>
                        </div>
                      </div>
                      <div className="ms-ss-editing-stand">
                        <div className="ms-ss-stand-base" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Bottom Highlight Banner */}
              <div className="ms-ss-bottom-banner">
                <div className="ms-ss-banner-icon-box">
                  <Headphones size={20} color="#E11D48" strokeWidth={2.2} />
                </div>
                <div className="ms-ss-banner-text">
                  <h5 className="ms-ss-banner-title">Perfect Music for Every Moment</h5>
                  <p className="ms-ss-banner-sub">
                    Get your client's song selections organized in one place, ready for your wedding videos.
                  </p>
                </div>
              </div>
            </div>
          ) : isCameraIngest ? (
            <div className="ms-ci-body">
              {/* 1. Header */}
              <div className="ms-ci-header">
                <div className="ms-ci-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div className="ms-ci-header-text">
                  <h3 className="ms-ci-title">Camera Ingest</h3>
                  <p className="ms-ci-desc">
                    Transfer photos and videos directly from supported cameras to ManageStudio using FTP, FTPS, or SFTP. Files are securely stored in the cloud and organized for gallery delivery and AI features.
                  </p>
                </div>
              </div>

              {/* 2. Four Benefits Grid */}
              <div className="ms-ci-benefits-grid">
                <div className="ms-ci-benefit-card">
                  <div className="ms-ci-benefit-icon ms-ci-benefit-icon-purple">
                    <Zap size={16} color="#ffffff" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ci-benefit-title">Direct from Camera</h4>
                  <p className="ms-ci-benefit-desc">
                    Receive photos and videos directly from your cameras via FTP, FTPS or SFTP.
                  </p>
                </div>

                <div className="ms-ci-benefit-card">
                  <div className="ms-ci-benefit-icon ms-ci-benefit-icon-soft">
                    <Folder size={16} color="#7c3aed" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ci-benefit-title">Automatic Organization</h4>
                  <p className="ms-ci-benefit-desc">
                    Files are automatically sorted by date, event and camera.
                  </p>
                </div>

                <div className="ms-ci-benefit-card">
                  <div className="ms-ci-benefit-icon ms-ci-benefit-icon-soft">
                    <Clock size={16} color="#7c3aed" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ci-benefit-title">Saves Time</h4>
                  <p className="ms-ci-benefit-desc">
                    No manual copying or renaming files.
                  </p>
                </div>

                <div className="ms-ci-benefit-card">
                  <div className="ms-ci-benefit-icon ms-ci-benefit-icon-soft">
                    <Camera size={16} color="#7c3aed" strokeWidth={2.4} />
                  </div>
                  <h4 className="ms-ci-benefit-title">Ready for Workflow</h4>
                  <p className="ms-ci-benefit-desc">
                    Files are ready for editing, client delivery, and AI features.
                  </p>
                </div>
              </div>

              {/* 3. How It Works Section */}
              <div className="ms-ci-how-section">
                <h4 className="ms-ci-how-title">How It Works</h4>

                {/* 5 Steps Grid Headers */}
                <div className="ms-ci-steps-grid">
                  <div className="ms-ci-step-col">
                    <div className="ms-ci-step-head">
                      <span className="ms-ci-step-num">1</span>
                      <span className="ms-ci-step-name">Connect Camera</span>
                    </div>
                    <p className="ms-ci-step-desc">
                      Configure your camera to send files via FTP, FTPS or SFTP.
                    </p>
                  </div>

                  <div className="ms-ci-step-col">
                    <div className="ms-ci-step-head">
                      <span className="ms-ci-step-num">2</span>
                      <span className="ms-ci-step-name">Send Files Automatically</span>
                    </div>
                    <p className="ms-ci-step-desc">
                      Photos and videos transfer as they are captured, when supported by the camera.
                    </p>
                  </div>

                  <div className="ms-ci-step-col">
                    <div className="ms-ci-step-head">
                      <span className="ms-ci-step-num">3</span>
                      <span className="ms-ci-step-name">Cloud Storage</span>
                    </div>
                    <p className="ms-ci-step-desc">
                      Files are securely received and stored in the cloud.
                    </p>
                  </div>

                  <div className="ms-ci-step-col">
                    <div className="ms-ci-step-head">
                      <span className="ms-ci-step-num">4</span>
                      <span className="ms-ci-step-name">Auto Organization</span>
                    </div>
                    <p className="ms-ci-step-desc">
                      Organize files by date, event, and camera.
                    </p>
                  </div>

                  <div className="ms-ci-step-col">
                    <div className="ms-ci-step-head">
                      <span className="ms-ci-step-num">5</span>
                      <span className="ms-ci-step-name">Ready for Use</span>
                    </div>
                    <p className="ms-ci-step-desc">
                      Files are prepared for supported gallery, editing, and AI workflows.
                    </p>
                  </div>
                </div>

                {/* 5 Steps Visual Workflow Graphic */}
                <div className="ms-ci-workflow-graphic-wrap">
                  <img 
                    src="/products/camera-ingest-workflow-steps.png" 
                    alt="Camera Ingest 5-Step Visual Workflow: Connect Camera via FTP/FTPS/SFTP, Send Files Automatically, Cloud Storage, Auto Organization by Date and Camera, and Ready for Gallery Delivery and AI Features" 
                    className="ms-ci-workflow-img"
                  />
                </div>
              </div>

              {/* 4. Bottom Highlight Banner */}
              <div className="ms-ci-bottom-banner">
                <div className="ms-ci-banner-icon-box">
                  <Camera size={20} color="#7c3aed" strokeWidth={2.2} />
                </div>
                <div className="ms-ci-banner-text">
                  <h5 className="ms-ci-banner-title">Seamless Ingest for a Smoother Workflow</h5>
                  <p className="ms-ci-banner-sub">
                    Get your camera files into ManageStudio quickly and stay organized from the start.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="ms-modal-body">
              <div className="ms-modal-header">
                <div className="ms-modal-badge">{modalData.category || 'STUDIO MODULE'}</div>
                <h3 className="ms-modal-title">{modalData.title}</h3>
                <p className="ms-modal-desc">{modalData.description}</p>
              </div>

              <div className="ms-feature-highlights-box">
                <h4 className="ms-highlights-title">Key Capabilities:</h4>
                <ul className="ms-highlights-list">
                  {modalData.highlights?.map((h, i) => (
                    <li key={i}>
                      <Check size={14} color="#0066cc" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ms-feature-modal-actions">
                <button 
                  type="button" 
                  className="ms-modal-submit-btn"
                  onClick={() => onOpenGetStarted && onOpenGetStarted()}
                >
                  <span>Get Started with {modalData.title}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )
        )}

        {/* 5. STUDIO DASHBOARD INFO MODAL */}
        {activeModal === 'dashboard-info' && (
          <div className="ms-modal-body">
            <div className="ms-modal-header">
              <div className="ms-modal-badge">STUDIO WORKSPACE</div>
              <h3 className="ms-modal-title">ManageStudio Dashboard</h3>
              <p className="ms-modal-desc">
                Your centralized command center for wedding client shoots, album proofing deadlines, and studio cash flow.
              </p>
            </div>

            <div className="ms-feature-highlights-box">
              <ul className="ms-highlights-list">
                <li><Check size={14} color="#0066cc" /> <strong>Active Bookings:</strong> View upcoming shoots, locations, and shot lists.</li>
                <li><Check size={14} color="#0066cc" /> <strong>Album Proofing:</strong> Track couple selections and print approval statuses.</li>
                <li><Check size={14} color="#0066cc" /> <strong>Invoices &amp; Payments:</strong> Issue GST/tax invoices and monitor receivables.</li>
                <li><Check size={14} color="#0066cc" /> <strong>Multi-Staff Access:</strong> Assign lead photographers and editors per wedding.</li>
              </ul>
            </div>

            <button 
              type="button" 
              className="ms-modal-submit-btn"
              onClick={() => onOpenGetStarted && onOpenGetStarted()}
            >
              <span>Explore Dashboard via Trial</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* 6. CLIENT PORTAL INFO MODAL */}
        {activeModal === 'client-portal-info' && (
          <div className="ms-modal-body">
            <div className="ms-modal-header">
              <div className="ms-modal-badge">CLIENT EXPERIENCE</div>
              <h3 className="ms-modal-title">Private Wedding Client Portal</h3>
              <p className="ms-modal-desc">
                Couples access their private wedding gallery via direct, branded links without needing complicated account passwords.
              </p>
            </div>

            <div className="ms-feature-highlights-box">
              <ul className="ms-highlights-list">
                <li><Check size={14} color="#0066cc" /> <strong>Zero Friction:</strong> One-tap access from WhatsApp or email invitations.</li>
                <li><Check size={14} color="#0066cc" /> <strong>Interactive Selections:</strong> Couples pick favorite album photos on mobile or desktop.</li>
                <li><Check size={14} color="#0066cc" /> <strong>Soundtrack Picker:</strong> Add YouTube / Spotify tracks for ceremony highlight films.</li>
                <li><Check size={14} color="#0066cc" /> <strong>Guest Photo Finder:</strong> Guests take a selfie to immediately get their photos.</li>
              </ul>
            </div>

            <button 
              type="button" 
              className="ms-modal-submit-btn"
              onClick={() => onOpenGetStarted && onOpenGetStarted()}
            >
              <span>Set Up Client Portals for Your Studio</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* 7. LEGAL / PRIVACY MODAL */}
        {activeModal === 'legal' && (
          <div className="ms-modal-body">
            <div className="ms-modal-header">
              <div className="ms-modal-badge">SECURITY &amp; PRIVACY</div>
              <h3 className="ms-modal-title">{modalData?.title || 'Studio Privacy & Security'}</h3>
              <p className="ms-modal-desc">
                How ManageStudio protects high-resolution wedding photography and client deliverables.
              </p>
            </div>

            <div className="ms-feature-highlights-box">
              <ul className="ms-highlights-list">
                <li><ShieldCheck size={14} color="#0066cc" /> <strong>End-to-End Encryption:</strong> Photos and videos encrypted at rest and in transit (TLS 1.3).</li>
                <li><ShieldCheck size={14} color="#0066cc" /> <strong>Studio Ownership:</strong> You retain 100% copyright and ownership of all media assets.</li>
                <li><ShieldCheck size={14} color="#0066cc" /> <strong>Private Guest AI:</strong> Guest selfies are used solely for in-event matching and never sold or trained on.</li>
                <li><ShieldCheck size={14} color="#0066cc" /> <strong>Enterprise Reliability:</strong> 99.99% uptime with multi-region backup storage.</li>
              </ul>
            </div>

            <button type="button" className="ms-modal-submit-btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
