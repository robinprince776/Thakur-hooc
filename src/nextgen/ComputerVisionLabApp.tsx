import React, { useState } from 'react';
import {
  Eye,
  Scan,
  Sparkles,
  HelpCircle,
  X,
  Layers,
  Sliders,
  CheckCircle2,
  FileText,
  Camera
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface ComputerVisionLabProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

type KernelType = 'sobelX' | 'sobelY' | 'blur' | 'sharpen' | 'ridge';

const KERNELS: Record<KernelType, { name: string; matrix: number[][]; desc: string }> = {
  sobelX: {
    name: 'Sobel Horizontal Edge Detection',
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    desc: 'Calculates horizontal pixel gradient intensity changes'
  },
  sobelY: {
    name: 'Sobel Vertical Edge Detection',
    matrix: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ],
    desc: 'Calculates vertical pixel gradient intensity changes'
  },
  blur: {
    name: 'Gaussian Box Blur (Smoothing)',
    matrix: [
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9]
    ],
    desc: 'Averages neighboring pixel intensities to remove high-frequency noise'
  },
  sharpen: {
    name: 'Laplacian Sharpening Filter',
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ],
    desc: 'Boosts high-frequency local contrast across boundaries'
  },
  ridge: {
    name: 'Ridge / Outline Extractor',
    matrix: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1]
    ],
    desc: 'Highlights all 2D boundary contours equally'
  }
};

export const ComputerVisionLabApp: React.FC<ComputerVisionLabProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'cnn' | 'landmarks' | 'ocr'>('cnn');
  const [showExplainModal, setShowExplainModal] = useState(false);

  // CNN Kernel State
  const [selectedKernel, setSelectedKernel] = useState<KernelType>('sobelX');

  // Face Landmark State
  const [showFaceMesh, setShowFaceMesh] = useState(true);
  const [detectedExpression, setDetectedExpression] = useState<'Focused / Neutral' | 'Smile / Happy' | 'Surprised'>('Focused / Neutral');

  // OCR Simulator State
  const [ocrStep, setOcrStep] = useState(2); // 0=Raw, 1=Grayscale, 2=Binarized, 3=Extracted

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🚀 Next-Gen Labs' },
          { label: 'Computer Vision & Biometrics Lab' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Scan className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Computer Vision & Biometrics Lab
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CNN & DLIB 68-PTS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Convolutional 3x3 kernel math, 68-point facial landmark landmark mesh detection, and OCR pixel binarization pipelines.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplainModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Explain this Lab</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'cnn', name: 'CNN Convolution Matrix', icon: Layers },
          { id: 'landmarks', name: '68-Point Face Landmark Mesh', icon: Eye },
          { id: 'ocr', name: 'OCR Pixel Extraction Pipeline', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CNN MATRIX CONVOLUTION */}
      {activeTab === 'cnn' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>3x3 Convolution Kernel: {KERNELS[selectedKernel].name}</span>
              </h3>
            </div>

            {/* Visual Kernel Matrix */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center font-mono font-bold text-sm">
              {KERNELS[selectedKernel].matrix.map((row, rIdx) =>
                row.map((val, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`p-3 rounded-xl border ${
                      val > 0
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : val < 0
                        ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                        : 'bg-slate-950 border-white/5 text-slate-500'
                    }`}
                  >
                    {typeof val === 'number' && val % 1 !== 0 ? val.toFixed(2) : val}
                  </div>
                ))
              )}
            </div>

            <p className="text-xs text-slate-300 text-center max-w-md mx-auto">
              {KERNELS[selectedKernel].desc}
            </p>

            {/* Convolution Math Pipeline Graphic */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row items-center justify-around gap-4 text-center font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] block">Input Image Patch</span>
                <span className="text-cyan-400 font-bold">[3 x 3 Pixels]</span>
              </div>
              <span className="text-amber-400 font-bold text-base">⊗ Dot Product</span>
              <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                <span className="text-slate-400 text-[10px] block">Kernel Weights</span>
                <span className="text-purple-400 font-bold">[3 x 3 Matrix]</span>
              </div>
              <span className="text-amber-400 font-bold text-base">=</span>
              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30">
                <span className="text-slate-400 text-[10px] block">Output Feature Map</span>
                <span className="text-emerald-400 font-bold">1 Filtered Pixel</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Select Filter Matrix
            </span>

            {(['sobelX', 'sobelY', 'blur', 'sharpen', 'ridge'] as KernelType[]).map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKernel(k)}
                className={`w-full p-3 rounded-xl text-left border cursor-pointer transition-all ${
                  selectedKernel === k
                    ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{KERNELS[k].name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 68-POINT FACE LANDMARKS */}
      {activeTab === 'landmarks' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Dlib 68-Point Facial Landmark Biometric Estimator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Coordinates mapping facial geometry for face recognition, eye gaze tracking, and sentiment analysis.
              </p>
            </div>
            <button
              onClick={() => setShowFaceMesh(!showFaceMesh)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-cyan-300 cursor-pointer"
            >
              {showFaceMesh ? 'Hide Mesh' : 'Show Mesh'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* SVG Face Diagram with 68 Dots */}
            <div className="relative p-6 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 240 260" className="w-56 h-64">
                {/* Face Silhouette */}
                <path
                  d="M 60 70 C 60 20, 180 20, 180 70 C 180 150, 160 220, 120 230 C 80 220, 60 150, 60 70 Z"
                  fill="rgba(15, 23, 42, 0.7)"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="2"
                />

                {showFaceMesh && (
                  <>
                    {/* Jawline Points (0 to 16) */}
                    {[65, 70, 75, 82, 92, 105, 120, 135, 148, 158, 165, 170, 175].map((x, i) => (
                      <circle key={`jaw-${i}`} cx={x} cy={120 + Math.abs(x - 120) * 0.9} r="2.5" fill="#38bdf8" />
                    ))}

                    {/* Left Eyebrow (17-21) */}
                    {[78, 86, 94, 102, 110].map((x, i) => (
                      <circle key={`lbrow-${i}`} cx={x} cy={72 - Math.sin(i * 0.6) * 4} r="2.5" fill="#10b981" />
                    ))}

                    {/* Right Eyebrow (22-26) */}
                    {[130, 138, 146, 154, 162].map((x, i) => (
                      <circle key={`rbrow-${i}`} cx={x} cy={72 - Math.sin(i * 0.6) * 4} r="2.5" fill="#10b981" />
                    ))}

                    {/* Left Eye (36-41) */}
                    <circle cx="86" cy="90" r="3" fill="#f43f5e" />
                    <circle cx="102" cy="90" r="3" fill="#f43f5e" />
                    <ellipse cx="94" cy="90" rx="8" ry="4" fill="none" stroke="#f43f5e" strokeWidth="1.5" />

                    {/* Right Eye (42-47) */}
                    <circle cx="138" cy="90" r="3" fill="#f43f5e" />
                    <circle cx="154" cy="90" r="3" fill="#f43f5e" />
                    <ellipse cx="146" cy="90" rx="8" ry="4" fill="none" stroke="#f43f5e" strokeWidth="1.5" />

                    {/* Nose Bridge & Tip (27-35) */}
                    {[98, 108, 118, 128].map((y, i) => (
                      <circle key={`nose-${i}`} cx="120" cy={y} r="2.5" fill="#f59e0b" />
                    ))}

                    {/* Mouth Contour (48-67) */}
                    <path
                      d="M 98 165 Q 120 180 142 165 Q 120 172 98 165 Z"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>

            {/* Expression Biometric Classification */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Classified Facial Pose</span>
                <span className="text-xl font-bold text-white block">{detectedExpression}</span>
                <span className="text-xs text-emerald-400 font-mono">Confidence: 98.4% Match</span>
              </div>

              <div className="flex gap-2">
                {(['Focused / Neutral', 'Smile / Happy', 'Surprised'] as const).map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setDetectedExpression(exp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      detectedExpression === exp
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OCR EXTRACTION */}
      {activeTab === 'ocr' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Optical Character Recognition (OCR) Pixel Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400">
              Steps taken by Tesseract OCR: Image Ingestion &rarr; Otsu's Binarization &rarr; Baseline Line Finding &rarr; Glyph Matrix Matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            <div className={`p-4 rounded-2xl border ${ocrStep >= 0 ? 'bg-cyan-950/40 border-cyan-500/40 text-white' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
              <span className="text-xs font-bold block">1. Raw Pixel Scan</span>
              <span className="text-[10px] text-slate-400 font-mono">RGB 24-bit input</span>
            </div>
            <div className={`p-4 rounded-2xl border ${ocrStep >= 1 ? 'bg-cyan-950/40 border-cyan-500/40 text-white' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
              <span className="text-xs font-bold block">2. Grayscale Conversion</span>
              <span className="text-[10px] text-slate-400 font-mono">0.299R + 0.587G</span>
            </div>
            <div className={`p-4 rounded-2xl border ${ocrStep >= 2 ? 'bg-cyan-950/40 border-cyan-500/40 text-white' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
              <span className="text-xs font-bold block">3. Otsu Binarization</span>
              <span className="text-[10px] text-slate-400 font-mono">Black & White 1-bit</span>
            </div>
            <div className={`p-4 rounded-2xl border ${ocrStep >= 3 ? 'bg-emerald-950/40 border-emerald-500/40 text-white' : 'bg-slate-900 border-white/5 text-slate-600'}`}>
              <span className="text-xs font-bold block">4. UTF-8 Extracted</span>
              <span className="text-[10px] text-emerald-400 font-mono">Character Token</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-emerald-400 text-center">
            Extracted Text Result: "BCA VERSE: NEXT-GENERATION COMPUTER VISION PIPELINE 2026"
          </div>
        </div>
      )}

      {/* EXPLAIN MODAL */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Computer Vision Principles</span>
              </h2>
              <button
                onClick={() => setShowExplainModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>Convolution:</strong> The foundational operation of Convolutional Neural Networks (CNNs). Sliding a small filter across pixels extracts hierarchical features: edges &rarr; textures &rarr; object parts &rarr; full classes.
              </p>
              <p>
                • <strong>Sobel Filter:</strong> Computes the image gradient vector at each pixel, pointing in the direction of largest possible increase from light to dark.
              </p>
              <p>
                • <strong>Landmarks:</strong> Biometric facial matching compares the relative distances between fixed points (e.g., Euclidean distance between eyes / nose bridge) to identify unique individuals across variable lighting.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
