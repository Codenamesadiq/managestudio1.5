import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export default function Header({ studioInfo }) {
  return (
    <header className="top-header">
      <div className="header-welcome">
        <span className="header-welcome-sub">Welcome back</span>
      </div>

      <div className="header-actions">
        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} />
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            SK
          </div>
          <div className="user-info">
            <span className="user-name">{studioInfo?.ownerName || 'Shaik Sadiq'}</span>
            <span className="user-role">Studio Owner</span>
          </div>
          <ChevronDown size={14} color="#6B7280" />
        </div>
      </div>
    </header>
  );
}
