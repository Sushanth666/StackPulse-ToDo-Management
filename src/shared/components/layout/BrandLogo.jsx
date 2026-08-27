import React from 'react';

/**
 * BrandLogo — Modern 3D Geometric Ribbon Checkmark (Option 1)
 * Sleek, dimensional violet-to-electric-blue ribbon checkmark without buggy SVG filters.
 */
export const BrandLogo = ({ size = 26, showContainer = false, className = '' }) => {
  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-logo-svg ${className}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="brand-lightning-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFB020" />
          <stop offset="35%" stopColor="#FF7A00" />
          <stop offset="70%" stopColor="#FF4838" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
        <filter id="brand-lightning-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF5722" floodOpacity="0.4" />
        </filter>
      </defs>

      <path
        d="M21 4 L8 19 H17 L15 32 L28 17 H19 L21 4 Z"
        fill="url(#brand-lightning-gradient)"
        filter="url(#brand-lightning-glow)"
        stroke="#FFA726"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );

  if (showContainer) {
    return (
      <div className="brand-logo">
        {svg}
      </div>
    );
  }

  return svg;
};

export default BrandLogo;
