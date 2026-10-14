import React from 'react';

/**
 * BrandLogo Component
 * Renders the official ManageStudio logo asset.
 * - Uses black transparent logo on light backgrounds (default)
 * - Uses white transparent logo on dark backgrounds (variant="white")
 */
export default function BrandLogo({ 
  variant = 'black', 
  size = 'default', 
  showBadge = false,
  className = '',
  style = {} 
}) {
  const isSmall = size === 'small';
  const logoSrc = variant === 'white' 
    ? '/managestudio-logo-white.png' 
    : '/managestudio-logo-black.png';

  const defaultHeight = isSmall ? '24px' : '30px';

  return (
    <div 
      className={`ms-brand-logo-container ${className}`}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px',
        userSelect: 'none',
        ...style 
      }}
    >
      <img
        src={logoSrc}
        alt="ManageStudio"
        style={{
          height: defaultHeight,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
      {showBadge && (
        <span 
          style={{
            fontSize: isSmall ? '10px' : '11px',
            fontWeight: 700,
            color: variant === 'white' ? 'rgba(255, 255, 255, 0.7)' : '#64748b',
            backgroundColor: variant === 'white' ? 'rgba(255, 255, 255, 0.12)' : '#f1f5f9',
            padding: '2px 6px',
            borderRadius: '4px',
            letterSpacing: '0.04em',
            lineHeight: 1
          }}
        >
          1.5
        </span>
      )}
    </div>
  );
}
