import React from 'react';

interface JarvisArcReactorProps {
  isThinking?: boolean;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const JarvisArcReactor: React.FC<JarvisArcReactorProps> = ({
  isThinking = false,
  isSpeaking = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36'
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center select-none`}>
      {/* Outer ambient glow */}
      <div
        className={`absolute inset-0 rounded-full bg-cyan-500/20 blur-xl transition-all duration-700 ${
          isThinking || isSpeaking ? 'scale-125 bg-cyan-400/40 animate-pulse' : 'scale-100'
        }`}
      />

      {/* Outer rotating ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 ${
          isThinking ? 'animate-spin' : isSpeaking ? 'animate-[spin_4s_linear_infinite]' : 'animate-[spin_12s_linear_infinite]'
        }`}
      />

      {/* Middle gold/cyan tech ring */}
      <div className="absolute inset-2 rounded-full border border-cyan-300/60 bg-gradient-to-tr from-cyan-950/80 via-[#0a192f]/90 to-blue-950/80 shadow-inner flex items-center justify-center">
        {/* Arc reactor segments */}
        <div className="absolute inset-1 rounded-full border border-cyan-500/30 flex items-center justify-center">
          <div className="w-full h-0.5 bg-cyan-400/30 absolute rotate-0" />
          <div className="w-full h-0.5 bg-cyan-400/30 absolute rotate-45" />
          <div className="w-full h-0.5 bg-cyan-400/30 absolute rotate-90" />
          <div className="w-full h-0.5 bg-cyan-400/30 absolute rotate-[135deg]" />
        </div>

        {/* Inner Glowing Core */}
        <div
          className={`relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-300 via-sky-100 to-white flex items-center justify-center shadow-lg shadow-cyan-400/80 transition-all ${
            isSpeaking ? 'scale-110 shadow-cyan-300' : 'scale-100'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-cyan-600/60" />
        </div>
      </div>
    </div>
  );
};
