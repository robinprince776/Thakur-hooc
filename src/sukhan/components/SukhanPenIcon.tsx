import React from 'react';

interface SukhanPenIconProps {
  className?: string;
  size?: number;
}

export const SukhanPenIcon: React.FC<SukhanPenIconProps> = ({ className = 'w-6 h-6', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Luxury Gold Gradient */}
        <linearGradient id="sukhanGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFD0B8" />
          <stop offset="45%" stopColor="#C6A66B" />
          <stop offset="100%" stopColor="#8C6F38" />
        </linearGradient>

        {/* Burgundy Velvet Accent */}
        <linearGradient id="sukhanBurgundy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7E3756" />
          <stop offset="100%" stopColor="#3C1425" />
        </linearGradient>

        {/* Ink Glow */}
        <filter id="sukhanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C6A66B" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer Obsidian Shield / Drop Base */}
      <path
        d="M24 4C24 4 11 20 11 29.5C11 36.4 16.8 42 24 42C31.2 42 37 36.4 37 29.5C37 20 24 4 24 4Z"
        fill="url(#sukhanBurgundy)"
        stroke="url(#sukhanGold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Fountain Pen Nib Body Inside the Ink Drop */}
      <path
        d="M24 10L30.5 24C30.5 24 28.5 28 24 28C19.5 28 17.5 24 17.5 24L24 10Z"
        fill="#0B0B0F"
        stroke="url(#sukhanGold)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />

      {/* Central Ink Breather Hole */}
      <circle cx="24" cy="22" r="1.6" fill="url(#sukhanGold)" />

      {/* Central Slit Line (Ink Channel) */}
      <line x1="24" y1="10" x2="24" y2="20.4" stroke="url(#sukhanGold)" strokeWidth="1" strokeLinecap="round" />

      {/* Lower Decorative Nib Arc */}
      <path
        d="M20 32C22 33.5 26 33.5 28 32"
        stroke="url(#sukhanGold)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Tip Sparkle */}
      <circle cx="24" cy="9.5" r="1" fill="#FFF5EA" filter="url(#sukhanGlow)" />
    </svg>
  );
};
