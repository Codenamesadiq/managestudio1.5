import React, { useState, useEffect } from 'react';
import StatCards from '../components/StatCards.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import { Plus, Search, Check } from 'lucide-react';

export default function DashboardView({ 
  onOpenCreateModal, 
  onOpenAlbum, 
  onPreviewMobile,
  albums,
  stats,
  onRefreshAlbums
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCopyLink = (album) => {
    const shareUrl = `${window.location.origin}?token=${album.clientToken}`;
    navigator.clipboard.writeText(shareUrl);
    showToast(`Private link for "${album.name}" copied to clipboard!`);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm('Are you sure you want to delete this album and its photos?')) return;
    try {
      const res = await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Album deleted successfully');
        if (onRefreshAlbums) onRefreshAlbums();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredAlbums = albums.filter((alb) => {
    const matchesSearch = 
      alb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alb.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'IN_PROGRESS' ? alb.status === 'IN_PROGRESS' :
      statusFilter === 'WAITING' ? alb.status === 'WAITING' :
      statusFilter === 'COMPLETED' ? alb.status === 'COMPLETED' : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-viewport">
      {/* Title & Action Row */}
      <div className="dashboard-hero-row">
        <div className="dashboard-title-area">
          <h1>Your Photo Selection Albums</h1>
          <p>Create, manage and share photo selection albums with your clients.</p>
        </div>

        <button className="btn-primary" onClick={onOpenCreateModal}>
          <Plus size={16} />
          <span>Create Album</span>
        </button>
      </div>

      {/* Stat Cards */}
      <StatCards stats={stats} />

      {/* Search & Filter Toolbar */}
      <div className="filter-row">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search albums or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="status-dropdown"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="IN_PROGRESS">Selection In Progress</option>
          <option value="WAITING">Waiting for Selection</option>
          <option value="COMPLETED">Selection Completed</option>
        </select>
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div style={{
          padding: '80px 20px',
          textAlign: 'center',
          backgroundColor: '#F9FAFB',
          border: '1px dashed #E5E5E7',
          borderRadius: '16px',
          marginTop: '20px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111111', marginBottom: '6px' }}>
            No albums found
          </h3>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px' }}>
            {searchQuery ? 'Try changing your search query or status filter.' : 'Create your first wedding selection album.'}
          </p>
          <button className="btn-gold" onClick={onOpenCreateModal}>
            <Plus size={15} />
            <span>Create New Album</span>
          </button>
        </div>
      ) : (
        <div className="albums-grid">
          {filteredAlbums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onOpenAlbum={onOpenAlbum}
              onPreviewMobile={onPreviewMobile}
              onCopyLink={handleCopyLink}
              onDeleteAlbum={handleDeleteAlbum}
            />
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} color="#DFC794" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
