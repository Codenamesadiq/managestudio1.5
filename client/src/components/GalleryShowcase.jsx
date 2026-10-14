import React, { useState } from 'react';
import './GalleryShowcase.css';
import { 
  Download, 
  LayoutGrid, 
  List as ListIcon, 
  Cloud, 
  Share2, 
  Play, 
  Volume2, 
  Maximize2, 
  Link2, 
  Smartphone,
  Copy,
  Check
} from 'lucide-react';

export default function GalleryShowcase() {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = urlParams?.get('tab') || 'photos';
  const [activeTab, setActiveTab] = useState(initialTab); // 'photos' | 'videos' | 'onelink'
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeFilmIndex, setActiveFilmIndex] = useState(0);

  const handleDownloadSample = (url, filename) => {
    try {
      const link = document.createElement('a');
      link.href = url || '/showcase/photos-grid.jpg';
      link.download = filename || 'sample.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // silent execution - no popup
    }
  };

  React.useEffect(() => {
    if (window.location.hash === '#gallery' || urlParams?.get('tab') || urlParams?.get('gallery') === '1') {
      setTimeout(() => {
        const el = document.getElementById('gallery');
        if (el) {
          window.scrollTo(0, el.offsetTop);
        }
      }, 50);
    }
  }, []);

  const playlistFilms = [
    {
      id: 'shaadi',
      title: 'Wedding Film (Shaadi)',
      description: 'A beautiful cinematic edit capturing the highlights of the wedding day.',
      duration: '12:34',
      badge: 'Main Feature',
      thumb: '/showcase/video-cover-clean.jpg'
    },
    {
      id: 'haldi',
      title: 'Haldi Film',
      description: 'Colorful moments from the Haldi ceremony.',
      duration: '08:21',
      thumb: '/showcase/thumb-haldi-clean.jpg'
    },
    {
      id: 'valima',
      title: 'Valima Film',
      description: 'Elegant moments from the Valima reception.',
      duration: '10:45',
      thumb: '/showcase/thumb-valima-clean.jpg'
    },
    {
      id: 'reception',
      title: 'Reception Highlights',
      description: 'Best moments from the reception night.',
      duration: '06:18',
      thumb: '/showcase/thumb-reception-clean.jpg'
    }
  ];

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://ms.link/ayesha-sameer');
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <section className="gallery-showcase-section" id="gallery">
      <div className="showcase-container">
        {/* Section Header: Changes based on active tab */}
        <div className="showcase-header">
          {activeTab === 'photos' && (
            <>
              <h2 className="showcase-headline">
                The wedding gallery,<br />
                made for effortless sharing.
              </h2>
              <p className="showcase-subtitle">
                Deliver every wedding photo in a beautiful, private gallery your clients can open anywhere.
              </p>
            </>
          )}

          {activeTab === 'videos' && (
            <>
              <h2 className="showcase-headline">
                Share your wedding videos<br />
                in a beautiful gallery.
              </h2>
              <p className="showcase-subtitle">
                Share final wedding films like Shaadi, Valima, Haldi and more in a private gallery your clients can watch and download anytime, on any device.
              </p>
            </>
          )}

          {activeTab === 'onelink' && (
            <>
              <h2 className="showcase-headline">
                One link for your clients.<br />
                Easy downloads.
              </h2>
              <p className="showcase-subtitle">
                Share a single link with your clients to give them quick and easy access to all their wedding photos and videos — no app download required.
              </p>
            </>
          )}

          {/* Interactive Three-Tab Switcher Pills */}
          <div className="showcase-tabs-nav" role="tablist" aria-label="Showcase Gallery Views">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'photos'}
              className={`showcase-tab-pill ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Share Photos
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'videos'}
              className={`showcase-tab-pill ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              Share Final Videos
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'onelink'}
              className={`showcase-tab-pill ${activeTab === 'onelink' ? 'active' : ''}`}
              onClick={() => setActiveTab('onelink')}
            >
              One Link. Easy Downloads
            </button>
          </div>
        </div>

        {/* Showcase Main Stage (Ambient backdrop card) */}
        <div className="showcase-stage">
          {/* ========================================================
              TAB 1: SHARE PHOTOS (Masonry gallery preview)
              ======================================================== */}
          {activeTab === 'photos' && (
            <div className="mac-window-card photos-window-preview" key="tab-photos">
              {/* Mac Window Chrome Bar */}
              <div className="mac-window-header">
                <div className="mac-traffic-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>

                <div className="mac-brand-breadcrumbs">
                  <span className="mac-brand-title">
                    <img
                      src="/managestudio-logo-black.png"
                      alt="ManageStudio"
                      className="mac-brand-logo-img"
                    />
                    <span className="mac-brand-version">1.5</span>
                  </span>
                  <span className="mac-breadcrumbs">
                    Albums <span className="chevron-sep">›</span> Ayesha & Sameer <span className="chevron-sep">›</span> Wedding Day
                  </span>
                </div>

                <div className="mac-actions">
                  <button type="button" className="mac-action-icon active" title="Grid View" aria-label="Grid view">
                    <LayoutGrid size={15} />
                  </button>
                  <button type="button" className="mac-action-icon" title="List View" aria-label="List view">
                    <ListIcon size={15} />
                  </button>
                  <button type="button" className="mac-action-icon" title="Cloud Sync" aria-label="Cloud sync">
                    <Cloud size={15} />
                  </button>
                  <button type="button" className="mac-action-icon" title="Share" aria-label="Share">
                    <Share2 size={15} />
                  </button>
                  <button 
                    type="button" 
                    className="mac-teal-btn"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Photo Masonry Collage Showcase */}
              <div className="photos-gallery-viewport">
                <div className="photos-masonry-grid" role="region" aria-label="Indian Wedding Photo Gallery">
                  {/* Column 1: Bride portrait, couple outdoors, ceremony */}
                  <div className="photos-masonry-col col-1">
                    <div className="photos-tile tile-1">
                      <img 
                        src="https://images.pexels.com/photos/30497750/pexels-photo-30497750.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Traditional Indian bride portrait in red lehenga with jewelry"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-2">
                      <img 
                        src="https://images.pexels.com/photos/39625024/pexels-photo-39625024.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Indian wedding couple smiling together with garland"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-3">
                      <img 
                        src="https://images.pexels.com/photos/32923331/pexels-photo-32923331.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Traditional Indian wedding ceremony rituals and offerings"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Column 2: Couple embracing, couple attire */}
                  <div className="photos-masonry-col col-2">
                    <div className="photos-tile tile-4">
                      <img 
                        src="https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Bride and groom embracing in traditional wedding attire outdoors"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-5">
                      <img 
                        src="https://images.pexels.com/photos/32060316/pexels-photo-32060316.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Indian couple portrait in traditional sherwani and lehenga"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Column 3: Mandap floral decor, sangeet dance, haldi ceremony */}
                  <div className="photos-masonry-col col-3">
                    <div className="photos-tile tile-6">
                      <img 
                        src="https://images.pexels.com/photos/33417236/pexels-photo-33417236.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Traditional Indian wedding mandap decorated with fresh flowers"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-7">
                      <img 
                        src="https://images.pexels.com/photos/35328204/pexels-photo-35328204.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Vibrant Indian wedding dance and celebration"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-8">
                      <img 
                        src="https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Joyful haldi ceremony candid moment with smiling bride and family"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Column 4: Bride in historic setting, mehendi details, sacred ritual */}
                  <div className="photos-masonry-col col-4">
                    <div className="photos-tile tile-9">
                      <img 
                        src="https://images.pexels.com/photos/38526712/pexels-photo-38526712.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Indian bride portrait in historic wedding setting"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-10">
                      <img 
                        src="https://images.pexels.com/photos/35263458/pexels-photo-35263458.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Intricate mehendi and bridal jewelry on bride's hand"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-11">
                      <img 
                        src="https://images.pexels.com/photos/38259809/pexels-photo-38259809.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Traditional Indian wedding ritual with mehendi and holy water"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Column 5: Mirror reflection, groom portrait, bride attire, family celebration */}
                  <div className="photos-masonry-col col-5">
                    <div className="photos-tile tile-12">
                      <img 
                        src="https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Elegant Indian bride mirror reflection portrait"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-13">
                      <img 
                        src="https://images.pexels.com/photos/33049965/pexels-photo-33049965.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Elegant Indian groom in traditional sherwani and safa turban"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-14">
                      <img 
                        src="https://images.pexels.com/photos/29370687/pexels-photo-29370687.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Beautiful Indian bride in traditional wedding attire"
                        loading="lazy"
                      />
                    </div>
                    <div className="photos-tile tile-15">
                      <img 
                        src="https://images.pexels.com/photos/7686002/pexels-photo-7686002.jpeg?auto=compress&cs=tinysrgb&w=800" 
                        alt="Indian family and guests wedding celebration gathering"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: SHARE FINAL VIDEOS (Video player + playlist)
              ======================================================== */}
          {activeTab === 'videos' && (
            <div className="mac-window-card videos-window-preview" key="tab-videos">
              {/* Mac Window Chrome Bar */}
              <div className="mac-window-header">
                <div className="mac-traffic-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>

                <div className="mac-brand-breadcrumbs">
                  <span className="mac-brand-title">
                    <img
                      src="/managestudio-logo-black.png"
                      alt="ManageStudio"
                      className="mac-brand-logo-img"
                    />
                    <span className="mac-brand-version">1.5</span>
                  </span>
                  <span className="mac-breadcrumbs">
                    Videos <span className="chevron-sep">›</span> Ayesha & Sameer <span className="chevron-sep">›</span> Wedding Films
                  </span>
                </div>

                <div className="mac-actions">
                  <button type="button" className="mac-action-icon" title="Grid View" aria-label="Grid view">
                    <LayoutGrid size={15} />
                  </button>
                  <button type="button" className="mac-action-icon" title="List View" aria-label="List view">
                    <ListIcon size={15} />
                  </button>
                  <button type="button" className="mac-action-icon" title="Cloud Sync" aria-label="Cloud sync">
                    <Cloud size={15} />
                  </button>
                  <button type="button" className="mac-action-icon" title="Share" aria-label="Share">
                    <Share2 size={15} />
                  </button>
                  <button 
                    type="button" 
                    className="mac-teal-btn with-icon"
                  >
                    Download All <Download size={13} style={{ marginLeft: 5 }} />
                  </button>
                </div>
              </div>

              {/* Video Player & Playlist Layout */}
              <div className="videos-stage-body">
                {/* Left: Featured Video Player */}
                <div className="featured-video-pane">
                  <div className="cinematic-player-box">
                    <img 
                      src="/showcase/video-cover-clean.jpg" 
                      alt="Wedding Film Shaadi Cinematic Edit" 
                      className="player-cover-image" 
                    />
                    
                    {/* Centered Play Button overlay */}
                    <div className="player-center-play">
                      <div className="play-circle-glow">
                        <Play size={22} fill="#ffffff" stroke="none" style={{ marginLeft: 3 }} />
                      </div>
                    </div>

                    {/* Bottom Video Progress Bar */}
                    <div className="player-controls-bar">
                      <div className="controls-left">
                        <Play size={13} fill="#ffffff" stroke="none" className="mini-play" />
                        <span className="video-timer">0:00 / 12:34</span>
                      </div>
                      <div className="scrubber-track">
                        <div className="scrubber-progress" style={{ width: '0%' }}>
                          <div className="scrubber-thumb" />
                        </div>
                      </div>
                      <div className="controls-right">
                        <Volume2 size={13} className="volume-icon" />
                        <Maximize2 size={13} className="fullscreen-icon" />
                      </div>
                    </div>
                  </div>

                  {/* Video Metadata & Download Video CTA */}
                  <div className="featured-video-meta">
                    <div className="meta-info">
                      <h3 className="meta-title">Wedding Film (Shaadi)</h3>
                      <p className="meta-desc">A beautiful cinematic edit capturing the highlights of the wedding day.</p>
                    </div>
                    <button 
                      type="button" 
                      className="video-download-btn" 
                      onClick={() => handleDownloadSample('/videos/hero.mp4', 'shaadi-film-highlights.mp4')}
                    >
                      <Download size={13} />
                      <span>Download Video</span>
                    </button>
                  </div>
                </div>

                {/* Right: Playlist Cards (Haldi, Valima, Reception) */}
                <div className="playlist-sidebar-pane">
                  {/* Item 1: Haldi Film */}
                  <div className="playlist-card-item">
                    <div className="playlist-thumb-wrapper">
                      <img 
                        src="/showcase/thumb-haldi-clean.jpg" 
                        alt="Haldi Film" 
                        className="playlist-thumb-img" 
                      />
                      <div className="thumb-mini-play">
                        <Play size={11} fill="#ffffff" stroke="none" style={{ marginLeft: 1 }} />
                      </div>
                      <span className="duration-pill">08:21</span>
                    </div>
                    <div className="playlist-card-content">
                      <h4 className="playlist-card-title">Haldi Film</h4>
                      <p className="playlist-card-desc">Colorful moments from the Haldi ceremony.</p>
                      <button 
                        type="button" 
                        className="playlist-dl-btn" 
                        onClick={() => handleDownloadSample('/videos/hero.mp4', 'haldi-film.mp4')}
                      >
                        <Download size={11} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Item 2: Valima Film */}
                  <div className="playlist-card-item">
                    <div className="playlist-thumb-wrapper">
                      <img 
                        src="/showcase/thumb-valima-clean.jpg" 
                        alt="Valima Film" 
                        className="playlist-thumb-img" 
                      />
                      <div className="thumb-mini-play">
                        <Play size={11} fill="#ffffff" stroke="none" style={{ marginLeft: 1 }} />
                      </div>
                      <span className="duration-pill">10:45</span>
                    </div>
                    <div className="playlist-card-content">
                      <h4 className="playlist-card-title">Valima Film</h4>
                      <p className="playlist-card-desc">Elegant moments from the Valima reception.</p>
                      <button 
                        type="button" 
                        className="playlist-dl-btn" 
                        onClick={() => handleDownloadSample('/videos/hero.mp4', 'valima-film.mp4')}
                      >
                        <Download size={11} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Item 3: Reception Highlights */}
                  <div className="playlist-card-item">
                    <div className="playlist-thumb-wrapper">
                      <img 
                        src="/showcase/thumb-reception-clean.jpg" 
                        alt="Reception Highlights" 
                        className="playlist-thumb-img" 
                      />
                      <div className="thumb-mini-play">
                        <Play size={11} fill="#ffffff" stroke="none" style={{ marginLeft: 1 }} />
                      </div>
                      <span className="duration-pill">06:18</span>
                    </div>
                    <div className="playlist-card-content">
                      <h4 className="playlist-card-title">Reception Highlights</h4>
                      <p className="playlist-card-desc">Best moments from the reception night.</p>
                      <button 
                        type="button" 
                        className="playlist-dl-btn" 
                        onClick={() => handleDownloadSample('/videos/hero.mp4', 'reception-highlights.mp4')}
                      >
                        <Download size={11} />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: ONE LINK. EASY DOWNLOADS (Link & Device showcase)
              ======================================================== */}
          {activeTab === 'onelink' && (
            <div className="onelink-showcase-card" key="tab-onelink">
              {/* Left Column: Interactive Desktop + Mobile Device Mockups */}
              <div className="onelink-mockup-col">
                <img 
                  src="/showcase/onelink-mockup.png" 
                  alt="One link shared on desktop browser and mobile device" 
                  className="onelink-mockup-graphic"
                />
              </div>

              {/* Right Column: Features & Benefits */}
              <div className="onelink-content-col">
                <span className="onelink-eyebrow">SHARE LINK</span>
                <h3 className="onelink-title">A simple link to everything.</h3>
                <p className="onelink-description">
                  Create a shareable link and let your clients download photos and videos anytime, on any device — no app download required.
                </p>

                <div className="onelink-feature-list">
                  {/* Feature 1 */}
                  <div className="onelink-feature-item">
                    <div className="feature-icon-badge">
                      <Link2 size={18} />
                    </div>
                    <div className="feature-text">
                      <h4 className="feature-heading">One Link Access</h4>
                      <p className="feature-sub">Share a single link with your clients.</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="onelink-feature-item">
                    <div className="feature-icon-badge">
                      <Download size={18} />
                    </div>
                    <div className="feature-text">
                      <h4 className="feature-heading">Easy Downloads</h4>
                      <p className="feature-sub">Photos and videos, all in one place.</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="onelink-feature-item">
                    <div className="feature-icon-badge">
                      <Smartphone size={18} />
                    </div>
                    <div className="feature-text">
                      <h4 className="feature-heading">Works on Any Device</h4>
                      <p className="feature-sub">No app download required.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
