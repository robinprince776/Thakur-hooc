import React, { useState, useMemo } from 'react';
import {
  Gauge,
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Globe,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

export interface WebPerfLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const WebPerfLabApp: React.FC<WebPerfLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'assets' | 'caching'>('vitals');

  // Core Web Vitals Simulator State
  const [useNextGenImages, setUseNextGenImages] = useState(true); // WebP/AVIF
  const [hasServerSideRender, setHasServerSideRender] = useState(true);
  const [bundleSizeKb, setBundleSizeKb] = useState(350); // 350 KB JS
  const [fontDisplaySwap, setFontDisplaySwap] = useState(true);
  const [hasDynamicLayoutShift, setHasDynamicLayoutShift] = useState(false); // Unsized images/banners

  const vitals = useMemo(() => {
    // TTFB (Time to First Byte)
    const ttfb = hasServerSideRender ? 180 : 350;

    // LCP (Largest Contentful Paint)
    let lcp = ttfb + (bundleSizeKb * 2.2);
    if (!useNextGenImages) lcp += 900;
    if (!fontDisplaySwap) lcp += 400;

    // INP (Interaction to Next Paint)
    let inp = Math.round(50 + (bundleSizeKb * 0.4));

    // CLS (Cumulative Layout Shift)
    const cls = hasDynamicLayoutShift ? 0.35 : 0.02;

    // Lighthouse Performance Score (0-100)
    let score = 100;
    if (lcp > 2500) score -= 30;
    else if (lcp > 1500) score -= 15;

    if (inp > 200) score -= 25;
    else if (inp > 100) score -= 10;

    if (cls > 0.1) score -= 25;
    else if (cls > 0.05) score -= 10;

    return {
      ttfb: Math.round(ttfb),
      lcp: (lcp / 1000).toFixed(2),
      inp,
      cls,
      score: Math.max(10, Math.min(100, Math.round(score)))
    };
  }, [useNextGenImages, hasServerSideRender, bundleSizeKb, fontDisplaySwap, hasDynamicLayoutShift]);

  // Asset Calculator State
  const [originalImageMb, setOriginalImageMb] = useState(4.2);
  const [selectedFormat, setSelectedFormat] = useState<'avif' | 'webp' | 'jpeg'>('avif');

  const assetSavings = useMemo(() => {
    const factor = selectedFormat === 'avif' ? 0.15 : selectedFormat === 'webp' ? 0.28 : 0.65;
    const optimizedSizeMb = (originalImageMb * factor).toFixed(2);
    const savedPct = Math.round((1 - factor) * 100);
    return { optimizedSizeMb, savedPct };
  }, [originalImageMb, selectedFormat]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">WebPerf Lab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  #webperf · App #38
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Core Web Vitals (LCP, INP, CLS, TTFB) Simulator, AVIF/WebP Compression & Cache-Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-all shadow"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            { id: 'vitals', label: 'Core Web Vitals & Lighthouse', icon: Gauge },
            { id: 'assets', label: 'AVIF / WebP Asset Optimizer', icon: Zap },
            { id: 'caching', label: 'HTTP Cache-Control Guide', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {activeTab === 'vitals' && (
          <div className="space-y-6">
            {/* Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl items-center">
              <div className="flex items-center gap-4 border-r border-slate-800 pr-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl font-mono border-4 shadow-lg ${
                    vitals.score >= 90
                      ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                      : vitals.score >= 50
                      ? 'border-amber-500 text-amber-400 bg-amber-950/30'
                      : 'border-rose-500 text-rose-400 bg-rose-950/30'
                  }`}
                >
                  {vitals.score}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Lighthouse Perf</span>
                  <span className="text-[11px] text-slate-400">
                    {vitals.score >= 90 ? '🟢 Fast (Passing Core Web Vitals)' : '🟠 Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* LCP */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Largest Contentful Paint</span>
                <div className={`text-xl font-bold font-mono ${Number(vitals.lcp) <= 2.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {vitals.lcp}s
                </div>
                <div className="text-[10px] text-slate-400">Target: &lt; 2.5s</div>
              </div>

              {/* INP */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Interaction to Next Paint</span>
                <div className={`text-xl font-bold font-mono ${vitals.inp <= 200 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {vitals.inp}ms
                </div>
                <div className="text-[10px] text-slate-400">Target: &lt; 200ms</div>
              </div>

              {/* CLS */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Cumulative Layout Shift</span>
                <div className={`text-xl font-bold font-mono ${vitals.cls <= 0.1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {vitals.cls}
                </div>
                <div className="text-[10px] text-slate-400">Target: &lt; 0.1</div>
              </div>
            </div>

            {/* Knobs / Toggles */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Configure Web Page Architecture</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    JavaScript Bundle Size: {bundleSizeKb} KB
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={1200}
                    step={50}
                    value={bundleSizeKb}
                    onChange={(e) => setBundleSizeKb(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>50KB (Vite Tree-shaken)</span>
                    <span>1200KB (Heavy Monolith)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-xs text-slate-200">Modern Next-Gen Images (AVIF / WebP)</span>
                    <button
                      onClick={() => setUseNextGenImages(!useNextGenImages)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        useNextGenImages ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {useNextGenImages ? 'Enabled' : 'Disabled (PNG/JPEG)'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-xs text-slate-200">font-display: swap (Prevent FOIT)</span>
                    <button
                      onClick={() => setFontDisplaySwap(!fontDisplaySwap)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        fontDisplaySwap ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {fontDisplaySwap ? 'swap Active' : 'block (Flash of Invisible Text)'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-xs text-slate-200">Dynamic Banner / Ads Without Explicit Dimensions</span>
                    <button
                      onClick={() => setHasDynamicLayoutShift(!hasDynamicLayoutShift)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        hasDynamicLayoutShift ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {hasDynamicLayoutShift ? 'Causes CLS Jitter' : 'aspect-ratio Defined'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Next-Gen Image Format Comparison</h3>
              <p className="text-xs text-slate-400">
                Modern formats like AVIF compress up to 85% smaller than legacy JPEG with identical visual fidelity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Original Hero Image Size: {originalImageMb} MB
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={originalImageMb}
                    onChange={(e) => setOriginalImageMb(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">Target Compression Format</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'avif', label: 'AVIF (Next-Gen 85%)' },
                      { id: 'webp', label: 'WebP (Google 72%)' },
                      { id: 'jpeg', label: 'MozJPEG (35%)' }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedFormat(fmt.id as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedFormat === fmt.id
                            ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
                <span className="text-xs text-slate-400 uppercase font-mono">Optimized Payload Size</span>
                <div className="text-4xl font-bold font-mono text-emerald-400">
                  {assetSavings.optimizedSizeMb} MB
                </div>
                <div className="text-xs text-emerald-400/90 font-medium">
                  🚀 Saved {assetSavings.savedPct}% bandwidth · Reduces mobile data & battery drain!
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'caching' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                header: 'Cache-Control: public, max-age=31536000, immutable',
                type: 'Vite / Webpack Hashed Static Bundles',
                explanation: 'Used for assets with content hashes (e.g. index-d8e7c1.js). Safe to cache for 1 entire year without checking the server.',
                risk: 'Never use this on index.html, otherwise users will never receive your updates!'
              },
              {
                header: 'Cache-Control: no-cache, no-store, must-revalidate',
                type: 'Dynamic HTML & Authentication Endpoints',
                explanation: 'Browser must never store or cache this response. Guarantees latest user credentials and page state.',
                risk: 'Increased server load since every hit touches the application server.'
              },
              {
                header: 'ETag: "686897696a7c76"',
                type: 'Conditional Requests (304 Not Modified)',
                explanation: 'Browser sends If-None-Match header. If the file has not changed, server returns HTTP 304 with zero body transfer.',
                risk: 'Requires minimal CPU on server to compute or lookup ETag hash.'
              },
              {
                header: 'Stale-While-Revalidate: max-age=60, stale-while-revalidate=600',
                type: 'SWR Pattern (Social Feeds / News)',
                explanation: 'Returns cached content instantly to user, while asynchronously fetching the fresh update in the background.',
                risk: 'Initial page visit might briefly display data that is a few minutes old.'
              }
            ].map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-amber-400 font-bold block">{c.type}</span>
                <code className="text-xs font-mono text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 block">
                  {c.header}
                </code>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{c.explanation}</p>
                <div className="text-[11px] text-slate-400">💡 <strong>Note:</strong> {c.risk}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
