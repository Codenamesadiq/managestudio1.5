import React, { useState } from 'react';
import { MoreVertical, Copy, Smartphone, ExternalLink, Trash2, Eye } from 'lucide-react';

export default function AlbumCard({ album, onOpenAlbum, onPreviewMobile, onCopyLink, onDeleteAlbum }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Status badge styling & text
  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="status-pill progress">Selection In Progress</span>;
      case 'COMPLETED':
        return <span className="status-pill completed">Selection Completed</span>;
      case 'WAITING':
      default:
        return <span className="status-pill waiting">Waiting for Selection</span>;
    }
  };

  // Avatar photos for collaborator bubbles
  const avatarList = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
  ];

  return (
    <div className="album-card">
      <div 
        className="album-cover-container" 
        onClick={() => onOpenAlbum(album)}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={album.coverPhotoUrl} 
          alt={album.name} 
          className="album-cover-img" 
          loading="lazy"
        />
        <div className="photo-count-badge">
          {(album.photoCount || 1245).toLocaleString()} photos
        </div>
      </div>

      <div className="album-card-body">
        <div className="album-card-header">
          <div className="album-title-group">
            <h3 
              className="album-name"
              onClick={() => onOpenAlbum(album)}
              style={{ cursor: 'pointer' }}
            >
              {album.name}
            </h3>
            <span className="album-date">{album.weddingDate || '12 Jan 2026'}</span>
          </div>
          {getStatusBadge(album.status)}
        </div>

        <div className="album-card-footer">
          <div className="client-avatars-stack">
            {avatarList.map((url, i) => (
              <div key={i} className="avatar-bubble">
                <img src={url} alt="client" />
              </div>
            ))}
            <span className="avatar-count">+2</span>
          </div>

          <div className="album-actions-group" style={{ position: 'relative' }}>
            <button 
              className="action-icon-btn" 
              title="Copy Private Client Link"
              onClick={(e) => {
                e.stopPropagation();
                onCopyLink(album);
              }}
            >
              <Copy size={16} />
            </button>

            <button 
              className="action-icon-btn" 
              title="Client Mobile Preview (iPhone)"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewMobile(album);
              }}
              style={{ color: '#C8A96B' }}
            >
              <Smartphone size={16} />
            </button>

            <button 
              className="action-icon-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              title="Options"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: '100%',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  border: '1px solid #E5E5E7',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  width: '180px',
                  overflow: 'hidden',
                  padding: '4px'
                }}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    color: '#111111',
                    borderRadius: '6px'
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAlbum(album);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Eye size={14} /> Open Selection
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    color: '#111111',
                    borderRadius: '6px'
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    const portalUrl = `${window.location.origin}?token=${album.clientToken}`;
                    window.open(portalUrl, '_blank');
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <ExternalLink size={14} /> Open in New Tab
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    color: '#DC2626',
                    borderRadius: '6px'
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteAlbum(album.id);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={14} /> Delete Album
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
