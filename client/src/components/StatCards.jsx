import React from 'react';
import { Folder, Check, Image as ImageIcon, Database } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'Total Albums',
      value: stats?.totalAlbums ?? 12,
      icon: Folder,
      badgeType: 'folder'
    },
    {
      title: 'Active Albums',
      value: stats?.activeAlbums ?? 8,
      badgeType: 'active',
      badgeValue: '8'
    },
    {
      title: 'Completed',
      value: stats?.completedAlbums ?? 4,
      icon: Check,
      badgeType: 'check'
    },
    {
      title: 'Total Photos',
      value: (stats?.totalPhotos ?? 8245).toLocaleString(),
      icon: ImageIcon,
      badgeType: 'photos'
    },
    {
      title: 'Storage Used',
      value: stats?.storageUsed ?? '125 GB',
      icon: Database,
      badgeType: 'storage'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="stat-card">
            {card.badgeType === 'active' ? (
              <div className="stat-icon-wrap active-badge">
                8
              </div>
            ) : card.badgeType === 'check' ? (
              <div className="stat-icon-wrap check-badge">
                <Check size={18} strokeWidth={2.6} />
              </div>
            ) : (
              <div className="stat-icon-wrap">
                {Icon && <Icon size={18} strokeWidth={1.8} />}
              </div>
            )}

            <div className="stat-details">
              <span className="stat-title">{card.title}</span>
              <span className="stat-number">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
