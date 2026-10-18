import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Share2,
  Heart,
  Palette
} from 'lucide-react';
import { CardDesignerConfig, CardDesignerTheme } from '../types';

interface SukhanCardDesignerProps {
  initialText?: string;
  initialAttribution?: string;
  onBack?: () => void;
}

const THEMES: Record<string, CardDesignerTheme> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Glass',
    containerBg: 'bg-[#0B0B0F]/95 border-[#C6A66B]/40 shadow-2xl backdrop-blur-2xl',
    textColor: 'text-[#F2E9DC]',
    accentColor: 'text-[#C6A66B]',
    subtextColor: 'text-[#C6A66B]/80',
    borderColor: 'border-[#C6A66B]/30',
    watermarkColor: 'text-[#C6A66B]/50'
  },
  burgundy: {
    id: 'burgundy',
    name: 'Burgundy Velvet',
    containerBg: 'bg-gradient-to-br from-[#59263C] via-[#3C1425] to-[#0B0B0F] border-[#7E3756]/60 shadow-2xl',
    textColor: 'text-[#FFF5EA]',
    accentColor: 'text-[#E6C280]',
    subtextColor: 'text-[#DFD0B8]/80',
    borderColor: 'border-[#E6C280]/30',
    watermarkColor: 'text-[#E6C280]/50'
  },
  paper: {
    id: 'paper',
    name: 'Antique Paper',
    containerBg: 'bg-[#F2E9DC] border-[#D4C3A3] shadow-xl',
    textColor: 'text-[#1A1815]',
    accentColor: 'text-[#7A3626]',
    subtextColor: 'text-[#4A4238]',
    borderColor: 'border-[#7A3626]/30',
    watermarkColor: 'text-[#7A3626]/60'
  },
  gold: {
    id: 'gold',
    name: 'Minimal Gold',
    containerBg: 'bg-[#0B0B0F] border-[#C6A66B] shadow-2xl ring-1 ring-[#C6A66B]/50',
    textColor: 'text-[#C6A66B]',
    accentColor: 'text-[#FFF5EA]',
    subtextColor: 'text-[#C6A66B]/70',
    borderColor: 'border-[#C6A66B]/50',
    watermarkColor: 'text-[#C6A66B]/40'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Monochrome',
    containerBg: 'bg-[#15151C] border-zinc-700/60 shadow-2xl',
    textColor: 'text-zinc-100',
    accentColor: 'text-zinc-400',
    subtextColor: 'text-zinc-400',
    borderColor: 'border-zinc-700',
    watermarkColor: 'text-zinc-500'
  }
};

export const SukhanCardDesigner: React.FC<SukhanCardDesignerProps> = ({
  initialText = 'Hazaron khwahishen aisi ki har khwahish pe dam nikle,\nBohat nikle mere armaan lekin phir bhi kam nikle.',
  initialAttribution = 'Mirza Ghalib',
  onBack
}) => {
  const [config, setConfig] = useState<CardDesignerConfig>({
    theme: 'obsidian',
    font: 'serif',
    alignment: 'center',
    fontSize: 'md',
    showAttribution: true,
    attribution: initialAttribution,
    showWatermark: true,
    watermarkText: 'SUKHAN · Made by Prince Thakur',
    poetryText: initialText
  });

  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES[config.theme] || THEMES.obsidian;

  const fontClass =
    config.font === 'serif'
      ? 'font-serif italic tracking-wide'
      : config.font === 'cinzel'
      ? 'font-["Cinzel"] tracking-widest'
      : 'font-sans font-medium';

  const alignClass =
    config.alignment === 'center'
      ? 'text-center'
      : config.alignment === 'left'
      ? 'text-left'
      : 'text-right';

  const sizeClass =
    config.fontSize === 'sm'
      ? 'text-sm sm:text-base leading-relaxed'
      : config.fontSize === 'md'
      ? 'text-base sm:text-lg md:text-xl leading-loose'
      : config.fontSize === 'lg'
      ? 'text-lg sm:text-xl md:text-2xl leading-loose'
      : 'text-xl sm:text-2xl md:text-3xl leading-loose font-normal';

  const handleCopyText = () => {
    const fullText = `${config.poetryText}\n\n— ${config.attribution || 'Sukhan'}\n(Made with SUKHAN · By Prince Thakur)`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background based on active theme
    if (config.theme === 'burgundy') {
      const grad = ctx.createLinearGradient(0, 0, 1200, 750);
      grad.addColorStop(0, '#59263C');
      grad.addColorStop(0.5, '#3C1425');
      grad.addColorStop(1, '#0B0B0F');
      ctx.fillStyle = grad;
    } else if (config.theme === 'paper') {
      ctx.fillStyle = '#F2E9DC';
    } else if (config.theme === 'gold') {
      ctx.fillStyle = '#0B0B0F';
    } else if (config.theme === 'midnight') {
      ctx.fillStyle = '#15151C';
    } else {
      // Obsidian default
      const grad = ctx.createRadialGradient(600, 375, 50, 600, 375, 700);
      grad.addColorStop(0, '#1a1829');
      grad.addColorStop(1, '#0B0B0F');
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, 1200, 750);

    // Outer & Inner Borders
    const borderColor =
      config.theme === 'paper'
        ? '#7A3626'
        : config.theme === 'midnight'
        ? '#52525b'
        : '#C6A66B';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 1120, 670);

    ctx.strokeStyle =
      config.theme === 'paper'
        ? 'rgba(122, 54, 38, 0.3)'
        : config.theme === 'midnight'
        ? 'rgba(113, 113, 122, 0.3)'
        : 'rgba(198, 166, 107, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 50, 1100, 650);

    // Decorative corner dots
    ctx.fillStyle = borderColor;
    [
      [40, 40],
      [1160, 40],
      [40, 710],
      [1160, 710]
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Brand Crest
    ctx.fillStyle = borderColor;
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦   S U K H A N   ✦', 600, 95);

    // Decorative Quote mark
    ctx.font = 'italic 70px Georgia, serif';
    ctx.fillStyle =
      config.theme === 'paper' ? 'rgba(122, 54, 38, 0.2)' : 'rgba(198, 166, 107, 0.25)';
    ctx.fillText('“', 600, 170);

    // Poetry Content Lines
    const lines = config.poetryText.split('\n').filter(Boolean);
    const textColor =
      config.theme === 'paper'
        ? '#1A1815'
        : config.theme === 'gold'
        ? '#C6A66B'
        : '#FFF5EA';

    ctx.fillStyle = textColor;
    const fontChoice =
      config.font === 'cinzel'
        ? 'Cinzel, Georgia, serif'
        : config.font === 'sans'
        ? 'system-ui, sans-serif'
        : 'Georgia, serif';

    const fontSizePx =
      config.fontSize === 'xl' ? 36 : config.fontSize === 'lg' ? 32 : config.fontSize === 'sm' ? 24 : 28;

    ctx.font = `italic ${fontSizePx}px ${fontChoice}`;
    ctx.textAlign = config.alignment;

    const startX = config.alignment === 'left' ? 120 : config.alignment === 'right' ? 1080 : 600;
    const lineHeight = fontSizePx + 20;
    const totalTextHeight = lines.length * lineHeight;
    const startY = 320 - totalTextHeight / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), startX, startY + index * lineHeight);
    });

    // Attribution
    if (config.showAttribution && config.attribution) {
      ctx.font = `bold 24px Georgia, serif`;
      ctx.fillStyle = borderColor;
      ctx.textAlign = config.alignment;
      ctx.fillText(`— ${config.attribution}`, startX, startY + lines.length * lineHeight + 40);
    }

    // Watermark
    if (config.showWatermark && config.watermarkText) {
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle =
        config.theme === 'paper' ? 'rgba(74, 66, 56, 0.7)' : 'rgba(198, 166, 107, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(config.watermarkText, 600, 680);
    }

    // Export image as PNG
    const a = document.createElement('a');
    a.download = `sukhan-card-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const handleDownloadCard = () => {
    handleDownloadPng();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C6A66B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#C6A66B]">
              Luxury Feature
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
            <span className="text-xs text-zinc-400">Shareable Poetry Art</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#F2E9DC] tracking-wide mt-0.5">
            Sher Card Designer
          </h2>
          <p className="text-xs text-zinc-400">
            Apne pasandeeda sheron ko luxury Obsidian Glass aur Velvet aesthetic me design karein.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15151C] border border-[#C6A66B]/30 hover:border-[#C6A66B] text-xs font-semibold text-[#F2E9DC] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C6A66B]" />}
            <span>{copied ? 'Copied' : 'Copy Card'}</span>
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#8C6F38] text-slate-950 font-bold text-xs shadow-lg shadow-[#C6A66B]/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Card</span>
          </button>
        </div>
      </div>

      {/* Grid: Preview (Left) + Customizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Card Visual Preview (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full relative group">
            {/* Ambient luxury glow aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#59263C]/30 via-[#C6A66B]/20 to-[#59263C]/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* THE CARD ITSELF */}
            <div
              ref={cardRef}
              className={`relative w-full rounded-2xl p-8 sm:p-12 border transition-all duration-300 min-h-[340px] flex flex-col justify-between overflow-hidden ${activeTheme.containerBg}`}
            >
              {/* Corner Ornamental Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C6A66B]/50 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C6A66B]/50 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C6A66B]/50 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C6A66B]/50 pointer-events-none" />

              {/* Card Top Nib Icon Badge */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-8 h-8 rounded-full border border-[#C6A66B]/40 bg-[#0B0B0F]/60 flex items-center justify-center">
                  <span className="text-[#C6A66B] text-xs">✒</span>
                </div>
              </div>

              {/* Main Poetry Text */}
              <div className={`my-auto py-2 ${alignClass}`}>
                <p className={`${fontClass} ${sizeClass} ${activeTheme.textColor} whitespace-pre-line`}>
                  {config.poetryText || 'Yahan apni shayari likhein...'}
                </p>
              </div>

              {/* Divider & Attribution Footer */}
              <div className="mt-8 pt-4 border-t border-dashed border-[#C6A66B]/30 flex flex-col items-center gap-2">
                {config.showAttribution && (
                  <span className={`text-xs sm:text-sm font-serif tracking-widest font-semibold uppercase ${activeTheme.subtextColor}`}>
                    — {config.attribution || 'Anjaan Shayar'}
                  </span>
                )}

                {config.showWatermark && (
                  <span className={`text-[10px] tracking-widest uppercase font-mono ${activeTheme.watermarkColor}`}>
                    {config.watermarkText}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 mt-3 text-center">
            Tap &amp; copy or download this card to share on Instagram, WhatsApp, or Twitter.
          </p>
        </div>

        {/* Customization Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-[#15151C]/90 border border-[#C6A66B]/20 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#C6A66B]/20 pb-3">
            <span className="text-xs font-bold text-[#F2E9DC] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Design Controls</span>
            </span>
            <button
              onClick={() =>
                setConfig({
                  theme: 'obsidian',
                  font: 'serif',
                  alignment: 'center',
                  fontSize: 'md',
                  showAttribution: true,
                  attribution: 'Mirza Ghalib',
                  showWatermark: true,
                  watermarkText: 'SUKHAN · Made by Prince Thakur',
                  poetryText: initialText
                })
              }
              className="text-[11px] text-zinc-400 hover:text-[#C6A66B] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-[#C6A66B]" />
              <span>Card Palette &amp; Theme:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((th) => (
                <button
                  key={th.id}
                  onClick={() => setConfig({ ...config, theme: th.id as any })}
                  className={`p-2 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    config.theme === th.id
                      ? 'border-[#C6A66B] bg-[#C6A66B]/15 text-[#FFF5EA]'
                      : 'border-zinc-800 bg-[#0B0B0F] text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-[#F2E9DC]">{th.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Poetry Content */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400">
              Sher / Poetry Text:
            </label>
            <textarea
              rows={3}
              value={config.poetryText}
              onChange={(e) => setConfig({ ...config, poetryText: e.target.value })}
              className="w-full bg-[#0B0B0F] border border-zinc-800 rounded-xl p-3 text-xs text-[#F2E9DC] focus:outline-none focus:border-[#C6A66B] resize-y font-serif leading-relaxed"
              placeholder="Yahan sher likhein..."
            />
          </div>

          {/* Attribution */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
              <span>Shayar / Writer Attribution:</span>
              <label className="flex items-center gap-1 cursor-pointer text-xs text-[#C6A66B]">
                <input
                  type="checkbox"
                  checked={config.showAttribution}
                  onChange={(e) => setConfig({ ...config, showAttribution: e.target.checked })}
                  className="rounded border-zinc-700 text-[#C6A66B]"
                />
                <span>Show</span>
              </label>
            </div>
            <input
              type="text"
              value={config.attribution}
              onChange={(e) => setConfig({ ...config, attribution: e.target.value })}
              placeholder="e.g. Mirza Ghalib ya Apna Takhallus"
              className="w-full bg-[#0B0B0F] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-[#F2E9DC] focus:outline-none focus:border-[#C6A66B]"
            />
          </div>

          {/* Font & Alignment Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Font Style:</label>
              <select
                value={config.font}
                onChange={(e) => setConfig({ ...config, font: e.target.value as any })}
                className="w-full bg-[#0B0B0F] border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-[#F2E9DC] focus:outline-none focus:border-[#C6A66B]"
              >
                <option value="serif">Editorial Serif</option>
                <option value="cinzel">Cinzel Classical</option>
                <option value="sans">Modern Sans</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Alignment:</label>
              <div className="flex items-center bg-[#0B0B0F] border border-zinc-800 rounded-xl p-0.5">
                <button
                  onClick={() => setConfig({ ...config, alignment: 'left' })}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center cursor-pointer ${
                    config.alignment === 'left' ? 'bg-[#C6A66B] text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfig({ ...config, alignment: 'center' })}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center cursor-pointer ${
                    config.alignment === 'center' ? 'bg-[#C6A66B] text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfig({ ...config, alignment: 'right' })}
                  className={`flex-1 py-1 rounded-lg flex items-center justify-center cursor-pointer ${
                    config.alignment === 'right' ? 'bg-[#C6A66B] text-black font-bold' : 'text-zinc-400'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Watermark toggle */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Watermark:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#C6A66B]">
              <input
                type="checkbox"
                checked={config.showWatermark}
                onChange={(e) => setConfig({ ...config, showWatermark: e.target.checked })}
                className="rounded border-zinc-700 text-[#C6A66B]"
              />
              <span className="text-[11px]">Made by Prince Thakur</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
