import React from 'react';
import { X, ExternalLink, RotateCcw } from 'lucide-react';
import ClientPortal from './ClientPortal.jsx';

export default function MobilePreviewModal({ album, isOpen, onClose }) {
  if (!isOpen || !album) return null;

  const clientUrl = `${window.location.origin}?token=${album.clientToken}`;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          animation: 'scaleUp 0.25s ease'
        }}
      >
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#111111',
          padding: '8px 18px',
          borderRadius: '999px',
          color: 'white',
          fontSize: '12px'
        }}>
          <span style={{ fontWeight: 600, color: '#DFC794' }}>
            iPhone 16 Pro Preview
          </span>
          <span style={{ color: '#4B5563' }}>|</span>
          <span>{album.name}</span>
          <button 
            onClick={() => window.open(clientUrl, '_blank')} 
            style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Open real URL in new browser tab"
          >
            <ExternalLink size={13} />
            <span>Open in Tab</span>
          </button>
          <button onClick={onClose} style={{ color: '#9CA3AF', marginLeft: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* iPhone Device Frame */}
        <div style={{
          width: '390px',
          height: '780px',
          backgroundColor: '#000000',
          borderRadius: '52px',
          border: '10px solid #2B2A27',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.45), 0 0 0 1px #4A4742',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Dynamic Island / Speaker Notch */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '110px',
            height: '28px',
            backgroundColor: '#000000',
            borderRadius: '20px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px'
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1A1A1A' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0D2B45', opacity: 0.6 }} />
          </div>

          {/* Time & Battery Status Bar */}
          <div style={{
            height: '44px',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: '#111111',
            backgroundColor: '#FFFFFF',
            zIndex: 90
          }}>
            <span>9:41</span>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px' }}>5G</span>
              <div style={{ width: '18px', height: '9px', border: '1px solid #111', borderRadius: '2px', padding: '1px' }}>
                <div style={{ height: '100%', width: '80%', backgroundColor: '#111' }} />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
            <ClientPortal 
              token={album.clientToken} 
              isEmbeddedPreview={true} 
              onClosePreview={onClose} 
            />
          </div>

          {/* iOS Home Bar Indicator */}
          <div style={{
            height: '20px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 90
          }}>
            <div style={{
              width: '120px',
              height: '4px',
              backgroundColor: '#111111',
              borderRadius: '999px',
              opacity: 0.6
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
