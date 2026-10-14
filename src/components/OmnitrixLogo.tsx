import React from 'react';

interface OmnitrixLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  isGlowing?: boolean;
  isHoverable?: boolean;
  animated?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

export const OmnitrixLogo: React.FC<OmnitrixLogoProps> = ({
  size = 'md',
  className = '',
  isGlowing = true,
  isHoverable = true,
  animated = false,
  onClick,
  title = 'Ben 10 Alien Force Omnitrix'
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    hero: 'w-32 h-32 sm:w-40 sm:h-40'
  };

  return (
    <div
      onClick={onClick}
      title={title}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        isHoverable ? 'cursor-pointer group' : ''
      } ${className}`}
      role={onClick ? 'button' : 'img'}
      aria-label="Ben 10 Omnitrix Emblem"
    >
      {/* Outer Holographic Glow Aura (Alien Force Emerald) */}
      {isGlowing && (
        <div
          className={`absolute inset-0 rounded-full bg-[#00FF66] blur-md opacity-40 transition-all duration-300 pointer-events-none ${
            isHoverable ? 'group-hover:opacity-80 group-hover:scale-110' : ''
          } ${animated ? 'animate-omnitrix-glow' : ''}`}
        />
      )}

      {/* Outer Rotating / Pulsing Cybernetic Ring */}
      <div
        className={`absolute -inset-1 rounded-full border border-[#00FF66]/30 border-dashed pointer-events-none ${
          animated ? 'animate-spin' : ''
        }`}
        style={{ animationDuration: '28s' }}
      />

      {/* Main SVG Emblem */}
      <svg
        viewBox="0 0 120 120"
        className={`w-full h-full relative z-10 filter transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,255,102,0.6)] ${
          isHoverable ? 'group-hover:scale-105 group-hover:rotate-12' : ''
        }`}
      >
        <defs>
          {/* Metallic Dial Ring Gradient */}
          <linearGradient id="omniBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="25%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="75%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Alien Force Emerald Radial Core Glow */}
          <radialGradient id="omniGreenCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B6FFCE" />
            <stop offset="35%" stopColor="#00FF66" />
            <stop offset="70%" stopColor="#00C853" />
            <stop offset="100%" stopColor="#004D20" />
          </radialGradient>

          {/* Deep Obsidian Black Hourglass Inset */}
          <linearGradient id="omniObsidian" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#151b17" />
            <stop offset="50%" stopColor="#080d09" />
            <stop offset="100%" stopColor="#020402" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="omniNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Dark Casing */}
        <circle cx="60" cy="60" r="58" fill="#030805" stroke="#00FF66" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* 2. Metallic Recalibrated Bezel */}
        <circle cx="60" cy="60" r="53" fill="url(#omniBezelGrad)" stroke="#10b981" strokeWidth="1" />

        {/* 3. Outer Ring Notches / 4 Alignment Conduits (Alien Force Style) */}
        {/* Top Notch */}
        <rect x="57" y="2" width="6" height="7" rx="1.5" fill="#00FF66" />
        {/* Bottom Notch */}
        <rect x="57" y="111" width="6" height="7" rx="1.5" fill="#00FF66" />
        {/* Left Notch */}
        <rect x="2" y="57" width="7" height="6" rx="1.5" fill="#00FF66" />
        {/* Right Notch */}
        <rect x="111" y="57" width="7" height="6" rx="1.5" fill="#00FF66" />

        {/* 4 Corner Alien Force Button Accent Dots */}
        <circle cx="28" cy="28" r="3" fill="#00FF66" opacity="0.8" />
        <circle cx="92" cy="28" r="3" fill="#00FF66" opacity="0.8" />
        <circle cx="28" cy="92" r="3" fill="#00FF66" opacity="0.8" />
        <circle cx="92" cy="92" r="3" fill="#00FF66" opacity="0.8" />

        {/* 4. Inner Dark Bezel Rim */}
        <circle cx="60" cy="60" r="44" fill="#020402" stroke="#00FF66" strokeWidth="1.2" />

        {/* 5. Glowing Alien Force Emerald Core Dial */}
        <circle cx="60" cy="60" r="40" fill="url(#omniGreenCore)" filter="url(#omniNeonGlow)" />

        {/* 6. Iconic Alien Force Hourglass Cutouts (Top and Bottom Inverted Obsidian Wings) */}
        {/* Top Wing */}
        <path
          d="M 28 28 C 38 42, 48 54, 60 55 C 72 54, 82 42, 92 28 C 82 23, 38 23, 28 28 Z"
          fill="url(#omniObsidian)"
          stroke="#00FF66"
          strokeWidth="0.8"
        />
        {/* Bottom Wing */}
        <path
          d="M 28 92 C 38 78, 48 66, 60 65 C 72 66, 82 78, 92 92 C 82 97, 38 97, 28 92 Z"
          fill="url(#omniObsidian)"
          stroke="#00FF66"
          strokeWidth="0.8"
        />

        {/* Hourglass Side Pillars / Flank Triangles forming the classic Ben 10 Hourglass */}
        <path
          d="M 24 29 L 58 59 L 24 91 Z"
          fill="url(#omniGreenCore)"
        />
        <path
          d="M 96 29 L 62 59 L 96 91 Z"
          fill="url(#omniGreenCore)"
        />

        {/* 7. Center Interlocking Diamond / Nucleus */}
        <polygon
          points="60,49 68,60 60,71 52,60"
          fill="#FFFFFF"
          filter="drop-shadow(0 0 4px #00FF66)"
        />
        <circle cx="60" cy="60" r="3" fill="#00FF66" />

        {/* 8. Subtle Glass Reflection Arc */}
        <path
          d="M 32 36 A 38 38 0 0 1 88 36"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
          fill="none"
        />
      </svg>
    </div>
  );
};
