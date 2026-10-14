import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  UploadCloud, 
  Copy, 
  Smartphone, 
  Download, 
  Check, 
  FileText, 
  CheckCircle,
  Eye,
  Calendar,
  User,
  Sparkles
} from 'lucide-react';

export default function StudioAlbumView({ albumId, onBack, onPreviewMobile }) {
  const [albumData, setAlbumData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SELECTED' | 'UNSELECTED'
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedLightroom, setCopiedLightroom] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/albums/${albumId}`);
      const data = await res.json();
      if (res.ok) {
        setAlbumData(data.album);
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Error fetching album:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const handleCopyLink = () => {
    if (!albumData?.clientToken) return;
    const url = `${window.location.origin}?token=${albumData.clientToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportLightroom = async () => {
    try {
      const res = await fetch(`/api/albums/${albumId}/export`);
      const data = await res.json();
      if (data.lightroomQuery) {
        navigator.clipboard.writeText(data.lightroomQuery);
        setCopiedLightroom(true);
        setTimeout(() => setCopiedLightroom(false), 3000);
      } else {
        alert('No photos have been selected yet.');
      }
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleUploadMore = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('photos', f));

    try {
      const res = await fetch(`/api/albums/${albumId}/photos`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchAlbum();
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
        <p>Loading album details...</p>
      </div>
    );
  }

  if (!albumData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Album not found.</p>
        <button className="btn-secondary" onClick={onBack} style={{ marginTop: '12px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const selectedPhotos = photos.filter(p => p.isSelected);
  const unselectedPhotos = photos.filter(p => !p.isSelected);

  const displayedPhotos = activeTab === 'SELECTED' 
    ? selectedPhotos 
    : activeTab === 'UNSELECTED' 
    ? unselectedPhotos 
    : photos;

  return (
    <div style={{ padding: '32px 40px 80px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Top Breadcrumb & Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#6B7280',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#F5F5F7'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ fontSize: '13px', color: '#111111', fontWeight: 600 }}>{albumData.name}</span>
      </div>

      {/* Album Summary Banner */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #E5E5E7',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>
                {albumData.name}
              </h1>
              {albumData.status === 'COMPLETED' ? (
                <span className="status-pill completed">Selection Completed</span>
              ) : albumData.status === 'IN_PROGRESS' ? (
                <span className="status-pill progress">Selection In Progress</span>
              ) : (
                <span className="status-pill waiting">Waiting for Selection</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '18px', color: '#6B7280', fontSize: '13px', marginBottom: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} /> {albumData.clientName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} /> {albumData.weddingDate || 'Date not specified'}
              </span>
            </div>

            {albumData.description && (
              <p style={{ fontSize: '13.5px', color: '#4B5563', maxWidth: '720px' }}>
                {albumData.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              <UploadCloud size={16} />
              <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleUploadMore} 
                style={{ display: 'none' }} 
                disabled={isUploading}
              />
            </label>

            <button className="btn-secondary" onClick={handleCopyLink}>
              {copiedLink ? <Check size={16} color="#166534" /> : <Copy size={16} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Private Link'}</span>
            </button>

            <button 
              className="btn-secondary" 
              onClick={handleExportLightroom}
              title="Copy selected filenames formatted for Adobe Lightroom or Capture One"
            >
              <Download size={16} />
              <span>{copiedLightroom ? 'Lightroom Query Copied!' : 'Export for Lightroom'}</span>
            </button>

            <button 
              className="btn-gold" 
              onClick={() => onPreviewMobile(albumData)}
            >
              <Smartphone size={16} />
              <span>Client Mobile Preview</span>
            </button>
          </div>
        </div>

        {/* Client Submission Alert Banner if completed */}
        {albumData.status === 'COMPLETED' && (
          <div style={{
            marginTop: '20px',
            padding: '16px 20px',
            backgroundColor: '#F7FAF7',
            border: '1px solid #D1E7DD',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={22} color="#166534" />
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#166534' }}>
                  Client Submitted {selectedPhotos.length} Selections
                </h4>
                {albumData.clientNotes && (
                  <p style={{ fontSize: '12.5px', color: '#374151', marginTop: '2px' }}>
                    <strong>Client Note:</strong> "{albumData.clientNotes}"
                  </p>
                )}
              </div>
            </div>

            <button 
              className="btn-secondary"
              onClick={handleExportLightroom}
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              {copiedLightroom ? 'Copied!' : 'Copy Filenames'}
            </button>
          </div>
        )}

        {/* Selection Metric Progress */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E5E7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#111111' }}>
              Selection Progress: {selectedPhotos.length} of {photos.length} photos selected
            </span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>
              {photos.length > 0 ? Math.round((selectedPhotos.length / photos.length) * 100) : 0}% selected
            </span>
          </div>

          <div style={{ height: '8px', backgroundColor: '#F3F4F6', borderRadius: '999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${photos.length > 0 ? (selectedPhotos.length / photos.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #C8A96B, #9E7D3F)',
                borderRadius: '999px',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Gallery Tabs Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn-secondary ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
            style={{
              backgroundColor: activeTab === 'ALL' ? '#111111' : 'white',
              color: activeTab === 'ALL' ? 'white' : '#111111',
              borderColor: activeTab === 'ALL' ? '#111111' : '#E5E5E7'
            }}
          >
            All Photos ({photos.length})
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'SELECTED' ? 'active' : ''}`}
            onClick={() => setActiveTab('SELECTED')}
            style={{
              backgroundColor: activeTab === 'SELECTED' ? '#C8A96B' : 'white',
              color: activeTab === 'SELECTED' ? 'white' : '#111111',
              borderColor: activeTab === 'SELECTED' ? '#C8A96B' : '#E5E5E7'
            }}
          >
            <Check size={14} /> Selected ({selectedPhotos.length})
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'UNSELECTED' ? 'active' : ''}`}
            onClick={() => setActiveTab('UNSELECTED')}
            style={{
              backgroundColor: activeTab === 'UNSELECTED' ? '#111111' : 'white',
              color: activeTab === 'UNSELECTED' ? 'white' : '#111111',
              borderColor: activeTab === 'UNSELECTED' ? '#111111' : '#E5E5E7'
            }}
          >
            Unselected ({unselectedPhotos.length})
          </button>
        </div>

        <span style={{ fontSize: '13px', color: '#6B7280' }}>
          Showing {displayedPhotos.length} photos
        </span>
      </div>

      {/* Photo Gallery Grid */}
      {displayedPhotos.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          border: '1px dashed #D1D5DB'
        }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
            No photos found in this view.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {displayedPhotos.map((photo) => (
            <div 
              key={photo.id}
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#F5F5F7',
                border: photo.isSelected ? '2px solid #C8A96B' : '1px solid #E5E5E7',
                aspectRatio: '4 / 3',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setLightboxPhoto(photo)}
            >
              <img 
                src={photo.url} 
                alt={photo.originalName} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />

              {/* Selection Checkmark Badge */}
              {photo.isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#C8A96B',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                  <Check size={14} strokeWidth={2.8} />
                </div>
              )}

              {/* Bottom filename overlay on hover */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                insetInline: 0,
                padding: '6px 10px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                color: 'white',
                fontSize: '11px',
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {photo.originalName}
                </span>
                {photo.isSelected && (
                  <span style={{ fontSize: '10px', color: '#DFC794', fontWeight: 600 }}>Selected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox for Studio Inspection */}
      {lightboxPhoto && (
        <div className="lightbox-overlay" onClick={() => setLightboxPhoto(null)}>
          <div className="lightbox-topbar" onClick={e => e.stopPropagation()}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>
              {lightboxPhoto.originalName} {lightboxPhoto.isSelected && '• (Selected by Client)'}
            </span>
            <button 
              onClick={() => setLightboxPhoto(null)} 
              style={{ color: 'white', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>
          <div className="lightbox-content">
            <img 
              src={lightboxPhoto.url} 
              alt={lightboxPhoto.originalName} 
              className="lightbox-img" 
              onClick={e => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
