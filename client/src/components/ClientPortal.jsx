import React, { useState, useEffect } from 'react';
import BrandLogo from './BrandLogo.jsx';
import { 
  Check, 
  ArrowRight, 
  Image as ImageIcon, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X,
  CheckCircle,
  MoreVertical,
  Heart,
  MessageSquare
} from 'lucide-react';

export default function ClientPortal({ token, isEmbeddedPreview = false, onClosePreview }) {
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SELECTED'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Selection state
  const [selectedPhotoIds, setSelectedPhotoIds] = useState(new Set());
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch album and photos via secure token
  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/portal/${token}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load album');

      setAlbum(data.album);
      setPhotos(data.photos || []);

      // Initialize selected set from database
      const initialSelected = new Set(
        (data.photos || []).filter(p => p.isSelected).map(p => p.id)
      );
      setSelectedPhotoIds(initialSelected);

      if (data.album.status === 'COMPLETED') {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortalData();
    }
  }, [token]);

  // Handle Photo Selection Toggle with instant DB persistence
  const toggleSelectPhoto = async (photoId, e) => {
    if (e) e.stopPropagation();
    if (isSubmitted || album?.status === 'COMPLETED') return;

    const newSet = new Set(selectedPhotoIds);
    const willBeSelected = !newSet.has(photoId);

    if (willBeSelected) {
      newSet.add(photoId);
    } else {
      newSet.delete(photoId);
    }
    setSelectedPhotoIds(newSet);

    // Update in local photos list state for fast UI response
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, isSelected: willBeSelected } : p));

    // Persist to server
    try {
      await fetch(`/api/portal/${token}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, isSelected: willBeSelected })
      });
    } catch (err) {
      console.error('Failed to sync selection to server:', err);
    }
  };

  // Final Submit Action
  const handleSubmitSelection = async () => {
    if (selectedPhotoIds.size === 0) {
      alert('Please select at least 1 photo before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/portal/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientNotes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit selection');

      setIsSubmitted(true);
      setShowSubmitModal(false);
      if (album) {
        setAlbum({ ...album, status: 'COMPLETED', submittedAt: data.submittedAt });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="client-portal-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #C8A96B',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px'
          }} />
          <p style={{ fontSize: '13px', fontWeight: 500 }}>Loading your wedding collection...</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="client-portal-wrapper" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>
          Album Not Found
        </h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          {error || 'This selection link may be invalid or has expired.'}
        </p>
        {isEmbeddedPreview && (
          <button className="btn-secondary" onClick={onClosePreview}>
            Close Preview
          </button>
        )}
      </div>
    );
  }

  const selectedPhotos = photos.filter(p => selectedPhotoIds.has(p.id));
  const displayedPhotos = activeTab === 'SELECTED' ? selectedPhotos : photos;

  return (
    <div className="client-portal-wrapper">
      {/* Top Mobile Bar */}
      <header className="client-header">
        <BrandLogo size="small" showBadge={false} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isEmbeddedPreview && (
            <button 
              onClick={onClosePreview}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                backgroundColor: '#F5F5F7',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              Exit Preview
            </button>
          )}
          <button style={{ color: '#111111' }}>
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Hero Cover Banner */}
      <section className="client-hero-cover">
        <img 
          src={album.coverPhotoUrl} 
          alt={album.name} 
        />
        <div className="client-hero-gradient">
          <h1 className="client-hero-title">{album.name}</h1>
          <p className="client-hero-sub">Wedding Collection</p>
          <div className="client-hero-badges">
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ImageIcon size={13} /> {photos.length} Photos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={13} /> {album.weddingDate || '12 Jan 2026'}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs Bar */}
      <div className="client-tabs-bar">
        <button 
          className={`client-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Photos ({photos.length})
        </button>
        <button 
          className={`client-tab-btn ${activeTab === 'SELECTED' ? 'active' : ''}`}
          onClick={() => setActiveTab('SELECTED')}
        >
          Selected ({selectedPhotoIds.size})
        </button>
      </div>

      {/* Submitted Banner if already completed */}
      {isSubmitted && (
        <div style={{
          margin: '12px 16px',
          padding: '14px 16px',
          backgroundColor: '#F7FAF7',
          border: '1px solid #D1E7DD',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle size={20} color="#166534" style={{ flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#166534', display: 'block' }}>
              Selection Submitted
            </span>
            <span style={{ fontSize: '11.5px', color: '#4B5563' }}>
              Your {selectedPhotoIds.size} selected photos have been sent to the studio.
            </span>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {displayedPhotos.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
          <p style={{ fontSize: '13.5px' }}>No photos selected yet.</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Browse "All Photos" and tap the circle checkmark on your favorites!
          </p>
        </div>
      ) : (
        <div className="client-photo-grid">
          {displayedPhotos.map((photo, index) => {
            const isSelected = selectedPhotoIds.has(photo.id);
            return (
              <div 
                key={photo.id}
                className={`client-photo-thumb ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setLightboxIndex(index)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.originalName} 
                  loading="lazy" 
                />

                {/* Selection Circle in top right */}
                <button 
                  className="selection-check-circle"
                  onClick={(e) => toggleSelectPhoto(photo.id, e)}
                  title={isSelected ? 'Deselect photo' : 'Select photo'}
                >
                  <Check size={14} strokeWidth={3} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Selection Bar (Dock) */}
      {!isSubmitted && selectedPhotoIds.size > 0 && (
        <div className="floating-selection-dock">
          {/* Mini thumbnails strip */}
          <div className="dock-preview-strip">
            {selectedPhotos.slice(0, 3).map((p) => (
              <img 
                key={p.id} 
                src={p.url} 
                alt="thumb" 
                className="dock-mini-thumb" 
              />
            ))}
          </div>

          <span className="dock-count-label">
            {selectedPhotoIds.size} photos selected
          </span>

          <button 
            className="dock-submit-btn"
            onClick={() => setShowSubmitModal(true)}
          >
            <span>Submit Selection</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Submit Photo Selection</h3>
              <button className="modal-close-btn" onClick={() => setShowSubmitModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#FAF5EA',
                  color: '#C8A96B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  border: '1px solid #EAD8B3'
                }}>
                  <Check size={24} strokeWidth={2.5} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>
                  Confirm Your {selectedPhotoIds.size} Selections
                </h4>
                <p style={{ fontSize: '12.5px', color: '#6B7280' }}>
                  Once submitted, your final selections will be sent directly to the studio for processing and retouching.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '12px' }}>
                  Notes for Photographer (Optional)
                </label>
                <textarea
                  className="form-input"
                  style={{ height: '70px', padding: '10px', fontSize: '12.5px' }}
                  placeholder="e.g. Please retouch photo #4, warm color preference..."
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
              >
                Keep Reviewing
              </button>
              <button 
                type="button" 
                className="btn-gold"
                onClick={handleSubmitSelection}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxIndex !== null && displayedPhotos[lightboxIndex] && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-topbar" onClick={e => e.stopPropagation()}>
            <span style={{ fontSize: '13px', opacity: 0.9 }}>
              {lightboxIndex + 1} of {displayedPhotos.length}
            </span>

            <button 
              onClick={() => setLightboxIndex(null)}
              style={{ color: 'white', padding: '6px' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="lightbox-content">
            {lightboxIndex > 0 && (
              <button 
                className="lightbox-nav-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img 
              src={displayedPhotos[lightboxIndex].url} 
              alt="fullscreen" 
              className="lightbox-img"
              onClick={e => e.stopPropagation()} 
            />

            {lightboxIndex < displayedPhotos.length - 1 && (
              <button 
                className="lightbox-nav-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Controls */}
          <div className="lightbox-bottombar" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => toggleSelectPhoto(displayedPhotos[lightboxIndex].id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: selectedPhotoIds.has(displayedPhotos[lightboxIndex].id) ? '#C8A96B' : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '13.5px',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Check size={16} strokeWidth={2.8} />
              <span>
                {selectedPhotoIds.has(displayedPhotos[lightboxIndex].id) ? 'Selected' : 'Select Photo'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
