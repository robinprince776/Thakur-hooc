import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  FileText,
  Shield,
  Layers,
  HardDrive,
  Cpu,
  Eye,
  CheckCircle2,
  Trash2,
  Lock
} from 'lucide-react';

export interface DigitalForensicsAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const DigitalForensicsApp: React.FC<DigitalForensicsAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'magic-bytes' | 'exif' | 'memory' | 'stego'>('magic-bytes');

  // Simulated EXIF Data
  const [exifSample, setExifSample] = useState<{
    camera: string;
    lens: string;
    dateTime: string;
    gps: string;
    software: string;
    scrubbed: boolean;
  }>({
    camera: 'Apple iPhone 15 Pro Max',
    lens: 'iPhone 15 Pro Max back triple camera 24mm f/1.78',
    dateTime: '2026-09-14 18:24:10',
    gps: '28°36\'49.2"N 77°12\'31.8"E (New Delhi, India)',
    software: 'iOS 18.0.1',
    scrubbed: false
  });

  const MAGIC_BYTES = [
    { type: 'JPEG Image', hex: 'FF D8 FF E0 / E1', ascii: 'ÿØÿà', ext: '.jpg, .jpeg' },
    { type: 'PNG Image', hex: '89 50 4E 47 0D 0A 1A 0A', ascii: '.PNG....', ext: '.png' },
    { type: 'PDF Document', hex: '25 50 44 46 2D', ascii: '%PDF-', ext: '.pdf' },
    { type: 'ZIP Archive', hex: '50 4B 03 04', ascii: 'PK..', ext: '.zip, .docx, .xlsx' },
    { type: 'Windows Executable', hex: '4D 5A', ascii: 'MZ (Mark Zbikowski)', ext: '.exe, .dll' },
    { type: 'ELF Linux Binary', hex: '7F 45 4C 46', ascii: '.ELF', ext: 'executable' },
    { type: 'GIF Image', hex: '47 49 46 38 39 61', ascii: 'GIF89a', ext: '.gif' },
    { type: 'GZIP Compressed', hex: '1F 8B 08', ascii: '...', ext: '.gz' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                      Digital Forensics Lab
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      DFIR &amp; Evidence
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    File carving magic bytes, metadata scrubbers, memory dumps &amp; steganography
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite Apps</span>
            </button>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'magic-bytes', label: '1. 🗃️ File Carving & Magic Bytes', icon: FileText },
              { id: 'exif', label: '2. 📷 EXIF Metadata Scrubber', icon: Eye },
              { id: 'memory', label: '3. 🧠 Memory Forensics (RAM)', icon: Cpu },
              { id: 'stego', label: '4. 🕵️ Steganography Analysis', icon: Lock }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: MAGIC BYTES */}
        {activeTab === 'magic-bytes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">File Signature Table (Magic Bytes)</h2>
            <p className="text-xs text-slate-400">
              Operating systems and forensic file carving tools (e.g. Scalpel, Foremost) rely on header bytes to reconstruct deleted files, ignoring file extensions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {MAGIC_BYTES.map((mb, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-white font-bold">
                    <span className="font-sans">{mb.type}</span>
                    <span className="text-cyan-400 font-normal">{mb.ext}</span>
                  </div>
                  <div className="text-emerald-400">Hex: {mb.hex}</div>
                  <div className="text-slate-400 text-[11px]">ASCII Representation: {mb.ascii}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EXIF SCRUBBER */}
        {activeTab === 'exif' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">EXIF Metadata Inspector &amp; Privacy Scrubber</h2>
                <p className="text-xs text-slate-400 mt-1">Photos taken on mobile phones often embed exact GPS coordinates and device serials.</p>
              </div>
              <button
                onClick={() => setExifSample((prev) => ({ ...prev, scrubbed: !prev.scrubbed }))}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  exifSample.scrubbed ? 'bg-slate-800 text-slate-300' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                }`}
              >
                {exifSample.scrubbed ? 'Restore Metadata' : 'Scrub & Anonymize Metadata'}
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-slate-500 pb-2 border-b border-slate-800 font-bold uppercase">
                {exifSample.scrubbed ? '🛡️ Metadata Scrubbed Clean (Safe to Publish)' : '⚠️ Sensitive Unsanitized EXIF Tags Found:'}
              </div>
              {exifSample.scrubbed ? (
                <div className="text-emerald-400 py-4 text-center italic">
                  All GPS tags, serial numbers, camera model and timestamps have been zeroed out.
                </div>
              ) : (
                <div className="space-y-2 text-slate-300">
                  <div>Device: <span className="text-cyan-400">{exifSample.camera}</span></div>
                  <div>Lens Specs: <span className="text-white">{exifSample.lens}</span></div>
                  <div>Capture Time: <span className="text-white">{exifSample.dateTime}</span></div>
                  <div>Exact Location: <span className="text-rose-400 font-bold">{exifSample.gps}</span></div>
                  <div>OS Software: <span className="text-white">{exifSample.software}</span></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MEMORY FORENSICS */}
        {activeTab === 'memory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Volatility Memory Dump Analysis Workflow</h2>
            <div className="space-y-3 text-xs font-mono">
              {[
                { cmd: 'volatility -f mem.raw imageinfo', desc: 'Identifies OS profile (e.g. Win10x64_19041) and suggested KDBG address.' },
                { cmd: 'volatility -f mem.raw --profile=Win10 pslist', desc: 'Enumerates running processes by walking active process link (EPROCESS).' },
                { cmd: 'volatility -f mem.raw --profile=Win10 pstree', desc: 'Displays parent-child process tree to reveal rogue cmd.exe or powershell.exe spawns.' },
                { cmd: 'volatility -f mem.raw --profile=Win10 malfind', desc: 'Detects in-memory DLL injections, hollowed processes, and executable memory segments.' }
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                  <div className="text-cyan-300 font-bold">{c.cmd}</div>
                  <div className="text-slate-400 font-sans text-[11px]">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STEGO */}
        {activeTab === 'stego' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">Steganography: Least Significant Bit (LSB) Principle</h2>
            <p className="text-slate-300 leading-relaxed">
              In 24-bit RGB images, altering the Least Significant Bit (LSB) of each pixel byte changes the color value by at most 1/256th (imperceptible to human eyes). 
              Attackers or privacy researchers embed secret binary flags into these bits without altering visual appearance. Forensics analysts detect this using chi-square analysis and zsteg!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
