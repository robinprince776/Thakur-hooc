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
  showRays = false
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
      className={`relative inline-flex items-center justify-center select-none group ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      {/* Ambient Radial Green Energy Aura behind the dial */}
      {glow && (
        <div
          className={`absolute inset-0 rounded-full bg-lime-500/25 blur-md transform -translate-z-0 pointer-events-none transition-all duration-500 group-hover:bg-lime-400/40 group-hover:blur-lg ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ transform: 'scale(1.15)' }}
        />
      )}

      {/* SVG Omnitrix Emblem */}
      <svg
        viewBox="0 0 200 200"
        width={dimension}
        height={dimension}
        className={`w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-300 ${
          animated ? 'group-hover:scale-105' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radioactive Green Core Gradient */}
          <linearGradient id={`green-core-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BEF264" />
            <stop offset="25%" stopColor="#A3E635" />
            <stop offset="65%" stopColor="#65A30D" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>

          {/* Electric Neon Glow Accent Gradient */}
          <radialGradient
            id={`radioactive-glow-${uniqueId}`}
            cx="50%"
            cy="50%"
            r="50%"
            fx="45%"
            fy="45%"
          >
            <stop offset="0%" stopColor="#F7FEE7" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#BEF264" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#84CC16" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4D7C0F" stopOpacity="0.95" />
          </radialGradient>

          {/* Gunmetal Outer Bezel Metallic Gradient */}
          <linearGradient id={`bezel-metal-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="20%" stopColor="#374151" />
            <stop offset="50%" stopColor="#1F2937" />
            <stop offset="80%" stopColor="#111827" />
            <stop offset="100%" stopColor="#0B0F17" />
          </linearGradient>

          {/* Deep Charcoal Dial Core Gradient */}
          <linearGradient id={`charcoal-face-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A303C" />
            <stop offset="45%" stopColor="#1E232B" />
            <stop offset="100%" stopColor="#12151B" />
          </linearGradient>

          {/* 3D Wedge Bevel Highlights */}
          <linearGradient id={`wedge-bevel-left-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3F4756" />
            <stop offset="60%" stopColor="#252A34" />
            <stop offset="100%" stopColor="#14181F" />
          </linearGradient>

          <linearGradient id={`wedge-bevel-right-${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3F4756" />
            <stop offset="60%" stopColor="#252A34" />
            <stop offset="100%" stopColor="#14181F" />
          </linearGradient>

          {/* Power Node Glowing Bead Gradient */}
          <radialGradient id={`node-glow-${uniqueId}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#F7FEE7" />
            <stop offset="30%" stopColor="#BEF264" />
            <stop offset="75%" stopColor="#65A30D" />
            <stop offset="100%" stopColor="#14532D" />
          </radialGradient>

          {/* Glowing Green Filter Effect */}
          <filter id={`neon-filter-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Diagonal Glass Sheen Clip Path */}
          <clipPath id={`dial-circle-clip-${uniqueId}`}>
            <circle cx="100" cy="100" r="54" />
          </clipPath>
        </defs>

        {/* 1. OUTER HOUSING: Dark Titanium / Gunmetal Rim */}
        <circle
          cx="100"
          cy="100"
          r="84"
          fill={`url(#bezel-metal-${uniqueId})`}
          stroke="#4B5563"
          strokeWidth="3.5"
        />

        {/* Subtle Outer Bezel Groove Ring */}
        <circle
          cx="100"
          cy="100"
          r="77"
          fill="none"
          stroke="#1F2937"
          strokeWidth="3"
          strokeDasharray="28 8"
        />

        {/* Intermediate Recessed Dark Casing */}
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="#0B0F17"
          stroke="#374151"
          strokeWidth="2.5"
        />

        {/* Inner Dial Beveled Retainer Ring */}
        <circle
          cx="100"
          cy="100"
          r="62"
          fill={`url(#charcoal-face-${uniqueId})`}
          stroke="#1F242D"
          strokeWidth="2"
        />

        {/* 2. THE CORE HOURGLASS: Glowing Neon Green Glass Plate */}
        <g clipPath={`url(#dial-circle-clip-${uniqueId})`}>
          {/* Base full luminous green disc */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill={`url(#radioactive-glow-${uniqueId})`}
            filter={`url(#neon-filter-${uniqueId})`}
          />

          {/* Micro-circuit tech grid inside the green glass (subtle futuristic detail) */}
          <circle cx="100" cy="100" r="42" fill="none" stroke="#bef264" strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="28" fill="none" stroke="#bef264" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="4 4" />

          {/* LEFT DARK CHARCOAL TRIANGULAR WEDGE */}
          {/* Points from (46, 54) down to (100, 100) and (46, 146) */}
          <path
            d="M 46 46 L 100 97.5 L 46 154 L 38 100 Z"
            fill={`url(#wedge-bevel-left-${uniqueId})`}
            stroke="#111827"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Left Wedge 3D Bevel Top Highlight */}
          <path
            d="M 46 46 L 100 97.5"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Left Wedge 3D Bevel Bottom Shadow */}
          <path
            d="M 100 97.5 L 46 154"
            stroke="#030712"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* RIGHT DARK CHARCOAL TRIANGULAR WEDGE */}
          {/* Points from (154, 46) down to (100, 102.5) and (154, 154) */}
          <path
            d="M 154 46 L 100 102.5 L 154 154 L 162 100 Z"
            fill={`url(#wedge-bevel-right-${uniqueId})`}
            stroke="#111827"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Right Wedge 3D Bevel Bottom Shadow */}
          <path
            d="M 154 46 L 100 102.5"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right Wedge 3D Bevel Top Highlight */}
          <path
            d="M 100 102.5 L 154 154"
            stroke="#030712"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* CENTER PINCH ACCENT (The iconic junction) */}
          <path
            d="M 98 96 L 102 96 L 102 104 L 98 104 Z"
            fill="#111827"
          />

          {/* DIAGONAL GLASS SPECULAR REFLECTION STREAKS (Enhanced Modern Touch) */}
          <polygon
            points="68,40 84,40 120,160 104,160"
            fill="#FFFFFF"
            fillOpacity="0.22"
          />
          <polygon
            points="88,40 94,40 134,160 128,160"
            fill="#FFFFFF"
            fillOpacity="0.32"
          />
          <polygon
            points="102,40 105,40 142,160 139,160"
            fill="#FFFFFF"
            fillOpacity="0.18"
          />
        </g>

        {/* Inner Bezel Ring Frame Overlay (Sharp Clean Border around dial) */}
        <circle
          cx="100"
          cy="100"
          r="54"
          fill="none"
          stroke="#1F2937"
          strokeWidth="3"
        />

        {/* 3. FOUR LUMINOUS POWER NODES (12, 3, 6, 9 O'clock on outer bezel) */}
        {/* Node Pod 1: TOP (12 o'clock) */}
        <g id="node-top">
          {/* Metallic Collar */}
          <circle cx="100" cy="18" r="14" fill="#1F2937" stroke="#4B5563" strokeWidth="2.5" />
          <circle cx="100" cy="18" r="10" fill="#0B0F17" />
          {/* Glowing Green Lens */}
          <circle
            cx="100"
            cy="18"
            r="8"
            fill={`url(#node-glow-${uniqueId})`}
            filter={`url(#neon-filter-${uniqueId})`}
          />
          {/* Specular White Spark */}
          <circle cx="98" cy="16" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Node Pod 2: RIGHT (3 o'clock) */}
        <g id="node-right">
          {/* Metallic Collar */}
          <circle cx="182" cy="100" r="14" fill="#1F2937" stroke="#4B5563" strokeWidth="2.5" />
          <circle cx="182" cy="100" r="10" fill="#0B0F17" />
          {/* Glowing Green Lens */}
          <circle
            cx="182"
            cy="100"
            r="8"
            fill={`url(#node-glow-${uniqueId})`}
            filter={`url(#neon-filter-${uniqueId})`}
          />
          {/* Specular White Spark */}
          <circle cx="180" cy="98" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Node Pod 3: BOTTOM (6 o'clock) */}
        <g id="node-bottom">
          {/* Metallic Collar */}
          <circle cx="100" cy="182" r="14" fill="#1F2937" stroke="#4B5563" strokeWidth="2.5" />
          <circle cx="100" cy="182" r="10" fill="#0B0F17" />
          {/* Glowing Green Lens */}
          <circle
            cx="100"
            cy="182"
            r="8"
            fill={`url(#node-glow-${uniqueId})`}
            filter={`url(#neon-filter-${uniqueId})`}
          />
          {/* Specular White Spark */}
          <circle cx="98" cy="180" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
        </g>

        {/* Node Pod 4: LEFT (9 o'clock) */}
        <g id="node-left">
          {/* Metallic Collar */}
          <circle cx="18" cy="100" r="14" fill="#1F2937" stroke="#4B5563" strokeWidth="2.5" />
          <circle cx="18" cy="100" r="10" fill="#0B0F17" />
          {/* Glowing Green Lens */}
          <circle
            cx="18"
            cy="100"
            r="8"
            fill={`url(#node-glow-${uniqueId})`}
            filter={`url(#neon-filter-${uniqueId})`}
          />
          {/* Specular White Spark */}
          <circle cx="16" cy="98" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
        </g>
      </svg>
    </div>
  );
};
