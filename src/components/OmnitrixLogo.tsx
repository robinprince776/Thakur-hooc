import React from 'react';

interface OmnitrixLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero' | number;
  className?: string;
  glow?: boolean;
  animated?: boolean;
  showRays?: boolean;
}

export const OmnitrixLogo: React.FC<OmnitrixLogoProps> = ({
  size = 'md',
  className = '',
  glow = true,
  animated = true,
}) => {
  // Dimension mapping
  let dimension = 40;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 20;
        break;
      case 'sm':
        dimension = 28;
        break;
      case 'md':
        dimension = 40;
        break;
      case 'lg':
        dimension = 56;
        break;
      case 'xl':
        dimension = 72;
        break;
      case '2xl':
        dimension = 96;
        break;
      case 'hero':
        dimension = 140;
        break;
    }
  }

  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
      style={{ width: dimension, height: dimension }}
      title="Omni-Engine Core"
    >
      {/* Outer Radioactive Neon Halo */}
      {glow && (
        <div
          className={`absolute inset-0 rounded-full bg-lime-400/30 blur-md pointer-events-none transition-all duration-500 group-hover:bg-lime-400/60 group-hover:blur-xl ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      {/* High-Fidelity Vector Ben 10 Omnitrix Dial */}
      <svg
        viewBox="0 0 200 200"
        width={dimension}
        height={dimension}
        className={`w-full h-full relative z-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] transition-transform duration-300 ${
          animated ? 'group-hover:scale-105 active:scale-95' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Bezel Metallic Outer Gradient */}
          <linearGradient id={`outer-bezel-rim-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A525D" />
            <stop offset="30%" stopColor="#2D333B" />
            <stop offset="70%" stopColor="#1E232A" />
            <stop offset="100%" stopColor="#12161C" />
          </linearGradient>

          {/* Deep Charcoal Dial Ring Gradient */}
          <linearGradient id={`inner-bezel-ring-${uniqueId}`} x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#252A32" />
            <stop offset="50%" stopColor="#181C22" />
            <stop offset="100%" stopColor="#0D1014" />
          </linearGradient>

          {/* Luminous Core Emerald / Radioactive Lime Green Gradient */}
          <linearGradient id={`omni-green-gradient-${uniqueId}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#E2FF66" />
            <stop offset="35%" stopColor="#B6F829" />
            <stop offset="70%" stopColor="#8BE307" />
            <stop offset="100%" stopColor="#64B000" />
          </linearGradient>

          {/* Glow filter for the neon elements */}
          <filter id={`omni-glow-${uniqueId}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Charcoal Hourglass Flange Gradient */}
          <linearGradient id={`wedge-dark-l-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3A404A" />
            <stop offset="60%" stopColor="#262C34" />
            <stop offset="100%" stopColor="#1A1F26" />
          </linearGradient>

          <linearGradient id={`wedge-dark-r-${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3A404A" />
            <stop offset="60%" stopColor="#262C34" />
            <stop offset="100%" stopColor="#1A1F26" />
          </linearGradient>

          {/* Node Glow Gradient */}
          <radialGradient id={`node-core-${uniqueId}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E3FF70" />
            <stop offset="60%" stopColor="#9DE715" />
            <stop offset="100%" stopColor="#4F8200" />
          </radialGradient>

          {/* Dial Circular Clip for Glass & Reflection */}
          <clipPath id={`dial-core-clip-${uniqueId}`}>
            <circle cx="100" cy="100" r="54" />
          </clipPath>
        </defs>

        {/* 1. OUTER GUNMETAL BEZEL */}
        {/* Outer metallic shadow lip */}
        <circle
          cx="100"
          cy="100"
          r="84"
          fill={`url(#outer-bezel-rim-${uniqueId})`}
          stroke="#55606E"
          strokeWidth="3.5"
        />

        {/* Segmented Bezel Groove Ring (like the Ben 10 dial) */}
        <circle
          cx="100"
          cy="100"
          r="75"
          fill="none"
          stroke="#12161C"
          strokeWidth="3"
          strokeDasharray="26 12"
        />

        {/* Recessed Matte Charcoal Ring */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill={`url(#inner-bezel-ring-${uniqueId})`}
          stroke="#2D333B"
          strokeWidth="2"
        />

        {/* 2. INNER DIAL: THE LUMINOUS HOURGLASS CORE */}
        <g clipPath={`url(#dial-core-clip-${uniqueId})`}>
          {/* Base Neon Green Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill={`url(#omni-green-gradient-${uniqueId})`}
            filter={`url(#omni-glow-${uniqueId})`}
          />

          {/* Micro cyber circuits inside the glowing green glass */}
          <circle cx="100" cy="100" r="42" fill="none" stroke="#D9FF66" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="28" fill="none" stroke="#D9FF66" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="3 3" />

          {/* LEFT DARK CHARCOAL TRIANGULAR WEDGE */}
          {/* In the reference image, triangles touch near center with small blunt flat edge */}
          <path
            d="M 44 48 L 97 97 L 97 103 L 44 152 Z"
            fill={`url(#wedge-dark-l-${uniqueId})`}
            stroke="#12161C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Left Wedge Top 3D Highlight */}
          <line x1="44" y1="48" x2="97" y2="97" stroke="#606C7D" strokeWidth="2" strokeLinecap="round" />
          {/* Left Wedge Bottom Shadow */}
          <line x1="44" y1="152" x2="97" y2="103" stroke="#0A0D11" strokeWidth="2.5" strokeLinecap="round" />

          {/* RIGHT DARK CHARCOAL TRIANGULAR WEDGE */}
          <path
            d="M 156 48 L 103 97 L 103 103 L 156 152 Z"
            fill={`url(#wedge-dark-r-${uniqueId})`}
            stroke="#12161C"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Wedge Bottom 3D Shadow */}
          <line x1="103" y1="103" x2="156" y2="152" stroke="#0A0D11" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right Wedge Top Highlight */}
          <line x1="103" y1="97" x2="156" y2="48" stroke="#606C7D" strokeWidth="2" strokeLinecap="round" />

          {/* CENTER FLAT NOTCH PINCH */}
          <rect x="97" y="97" width="6" height="6" fill="#12161C" />

          {/* ICONIC DIAGONAL GLASS SHEEN SPECULAR BANDS (exactly as in the reference picture) */}
          <polygon
            points="66,35 84,35 124,165 106,165"
            fill="#FFFFFF"
            fillOpacity="0.25"
          />
          <polygon
            points="88,35 94,35 136,165 130,165"
            fill="#FFFFFF"
            fillOpacity="0.4"
          />
        </g>

        {/* Inner Retaining Ring with sharp bevel */}
        <circle
          cx="100"
          cy="100"
          r="54"
          fill="none"
          stroke="#12161C"
          strokeWidth="3.5"
        />
        <circle
          cx="100"
          cy="100"
          r="52.5"
          fill="none"
          stroke="#3A424E"
          strokeWidth="1"
          strokeOpacity="0.6"
        />

        {/* 3. FOUR RAISED METALLIC CYLINDRICAL POWER NODES (Top, Right, Bottom, Left) */}
        {/* Node 1: TOP (12 o'clock) */}
        <g id={`node-top-${uniqueId}`}>
          {/* Dark metallic socket flange */}
          <circle cx="100" cy="18" r="14" fill="#20252C" stroke="#485361" strokeWidth="2.5" />
          <circle cx="100" cy="18" r="10" fill="#0D1014" />
          {/* Glowing neon green core */}
          <circle cx="100" cy="18" r="7.5" fill={`url(#node-core-${uniqueId})`} filter={`url(#omni-glow-${uniqueId})`} />
          <circle cx="98" cy="16" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
        </g>

        {/* Node 2: RIGHT (3 o'clock) */}
        <g id={`node-right-${uniqueId}`}>
          <circle cx="182" cy="100" r="14" fill="#20252C" stroke="#485361" strokeWidth="2.5" />
          <circle cx="182" cy="100" r="10" fill="#0D1014" />
          <circle cx="182" cy="100" r="7.5" fill={`url(#node-core-${uniqueId})`} filter={`url(#omni-glow-${uniqueId})`} />
          <circle cx="180" cy="98" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
        </g>

        {/* Node 3: BOTTOM (6 o'clock) */}
        <g id={`node-bottom-${uniqueId}`}>
          <circle cx="100" cy="182" r="14" fill="#20252C" stroke="#485361" strokeWidth="2.5" />
          <circle cx="100" cy="182" r="10" fill="#0D1014" />
          <circle cx="100" cy="182" r="7.5" fill={`url(#node-core-${uniqueId})`} filter={`url(#omni-glow-${uniqueId})`} />
          <circle cx="98" cy="180" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
        </g>

        {/* Node 4: LEFT (9 o'clock) */}
        <g id={`node-left-${uniqueId}`}>
          <circle cx="18" cy="100" r="14" fill="#20252C" stroke="#485361" strokeWidth="2.5" />
          <circle cx="18" cy="100" r="10" fill="#0D1014" />
          <circle cx="18" cy="100" r="7.5" fill={`url(#node-core-${uniqueId})`} filter={`url(#omni-glow-${uniqueId})`} />
          <circle cx="16" cy="98" r="2.2" fill="#FFFFFF" fillOpacity="0.85" />
        </g>
      </svg>
    </div>
  );
};
