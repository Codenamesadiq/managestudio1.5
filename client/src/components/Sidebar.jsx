import React from 'react';
import BrandLogo from './BrandLogo.jsx';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Users, 
  HardDrive, 
  Settings 
} from 'lucide-react';

export default function Sidebar({ currentTab, onSelectTab, storageStats }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'albums', label: 'Albums', icon: ImageIcon },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="studio-sidebar">
      <div className="brand-header">
        <BrandLogo />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-storage-card">
        <div className="storage-labels">
          <span>Storage Used</span>
          <span>{storageStats?.used || '125 GB'}</span>
        </div>
        <div className="storage-bar-track">
          <div 
            className="storage-bar-fill" 
            style={{ width: '25%' }}
          />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10.5px', color: '#9CA3AF', textAlign: 'right' }}>
          {storageStats?.used || '125 GB'} / {storageStats?.limit || '500 GB'}
        </div>
      </div>
    </aside>
  );
}
