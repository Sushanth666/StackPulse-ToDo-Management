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
      className={`brand-ribbon-svg ${className}`}
      style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.35))' }}
    >
      <defs>
        {/* Main Ribbon Gradient: Deep Violet to Vibrant Electric Indigo & Sky */}
        <linearGradient id="tf-ribbon-body" x1="4" y1="28" x2="32" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="35%" stopColor="#7c3aed" />
          <stop offset="70%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* 3D Under-Fold Shadow */}
        <linearGradient id="tf-ribbon-shadow" x1="10" y1="18" x2="22" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>

        {/* Left Wing Facet */}
        <linearGradient id="tf-ribbon-wing" x1="4" y1="12" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="45%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        {/* Specular Highlight along top ridge */}
        <linearGradient id="tf-ribbon-shine" x1="12" y1="26" x2="32" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <g>
        {/* 3D Dimensional Rear Fold */}
        <path
          d="M11.5 20.8L15.6 24.9C16.8 26.1 18.7 25.8 19.5 24.3L30.2 7.2C30.8 6.2 29.8 5.1 28.8 5.7L14.8 14.8L11.5 20.8Z"
          fill="url(#tf-ribbon-shadow)"
          opacity="0.9"
        />

        {/* Main Sweeping Velocity Ribbon */}
        <path
          d="M5.2 16.8C4.1 15.5 5.2 13.5 6.8 14.2L12.6 18.1C13.6 18.7 14.8 18.5 15.6 17.6L28.8 3.8C29.9 2.7 31.6 3.8 31.1 5.2L24.8 22.8C24.1 24.7 22.4 26.1 20.4 26.5L13.8 27.8C12.1 28.1 10.4 27.3 9.4 25.9L5.2 16.8Z"
          fill="url(#tf-ribbon-body)"
        />

        {/* Left Wing Front Curved Facet */}
        <path
          d="M5.2 16.8C4.2 15.6 5.1 13.8 6.6 14.3L13.2 18.5C14.4 19.3 14.8 20.8 14.1 22.1L12.5 24.8C11.5 26.5 9.2 26.8 7.8 25.3L5.2 16.8Z"
          fill="url(#tf-ribbon-wing)"
        />

        {/* Top Edge Specular Reflection */}
        <path
          d="M6.6 14.3L13.2 18.5C14.2 19.1 15.5 18.9 16.3 18.1L29.2 4.6C29.8 4 30.7 4.5 30.5 5.3L24.5 22.2C23.9 23.8 22.5 25.0 20.8 25.4L14.2 26.7L6.6 14.3Z"
          fill="url(#tf-ribbon-shine)"
          opacity="0.45"
        />
      </g>
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
