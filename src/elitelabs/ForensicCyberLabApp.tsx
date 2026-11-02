import React, { useState } from 'react';
import {
  Shield,
  FileSearch,
  Binary,
  Eye,
  Camera,
  MapPin,
  Calendar,
  Lock,
  Sparkles,
  HelpCircle,
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  FileCode
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface ForensicCyberLabProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

interface MagicSignature {
  name: string;
  bytes: string;
  ext: string;
  mime: string;
  desc: string;
}

const MAGIC_DB: MagicSignature[] = [
  { name: 'PNG Image', bytes: '89 50 4E 47 0D 0A 1A 0A', ext: '.png', mime: 'image/png', desc: 'Portable Network Graphics lossless bitmap' },
  { name: 'JPEG Photo', bytes: 'FF D8 FF E0 / FF D8 FF E1', ext: '.jpg', mime: 'image/jpeg', desc: 'Joint Photographic Experts Group lossy picture' },
  { name: 'PDF Document', bytes: '25 50 44 46', ext: '.pdf', mime: 'application/pdf', desc: 'Adobe Portable Document Format' },
  { name: 'ZIP / DOCX / APK', bytes: '50 4B 03 04', ext: '.zip', mime: 'application/zip', desc: 'PKZIP compressed archive or modern Office doc' },
  { name: 'Windows PE Executable', bytes: '4D 5A (MZ)', ext: '.exe', mime: 'application/x-dosexec', desc: 'Microsoft Windows PE / DOS binary executable' },
  { name: 'Linux ELF Binary', bytes: '7F 45 4C 46 (ELF)', ext: '.elf', mime: 'application/x-executable', desc: 'Executable and Linkable Format binary' },
  { name: 'GIF Animation', bytes: '47 49 46 38 39 61', ext: '.gif', mime: 'image/gif', desc: 'Graphics Interchange Format 89a' }
];

const SAMPLE_HEX_DUMP = `00000000: 89 50 4E 47 0D 0A 1A 0A 00 00 00 0D 49 48 44 52  .PNG........IHDR
00000010: 00 00 07 80 00 00 04 38 08 06 00 00 00 48 E1 7C  .......8.....H.|
00000020: 00 00 00 01 73 52 47 42 00 AE CE 1C E9 00 00 00  ....sRGB........
00000030: 04 67 41 4D 41 00 00 B1 8F 0B FC 61 05 00 00 00  .gAMA......a....
00000040: 09 70 48 59 73 00 00 0E C3 00 00 0E C3 01 C7 6F  .pHYs..........o
00000050: A8 64 00 00 20 00 49 44 41 54 78 5E ED 9D 07 7C  .d.. .IDATx^...|
00000060: 54 D5 99 2F 7E 33 E7 CE BD 79 BE DE BD 3D 7B B7  T../~3...y...={.`;

export const ForensicCyberLabApp: React.FC<ForensicCyberLabProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'magic' | 'stego' | 'hex'>('metadata');
  const [showConceptModal, setShowConceptModal] = useState(false);

  // Sample or uploaded metadata state
  const [sampleMeta, setSampleMeta] = useState({
    fileName: 'suspect_evidence_IMG_2026.jpg',
    fileSize: '4.2 MB',
    camera: 'Sony Alpha a7 IV (ILCE-7M4)',
    lens: 'FE 24-70mm F2.8 GM II',
    focalLength: '35.0 mm (35mm equivalent: 35mm)',
    aperture: 'f/2.8',
    shutter: '1/250 sec',
    iso: 'ISO 400',
    dateTime: '2026-10-24 14:32:19 IST',
    gpsLat: '28° 36\' 50.4" N (28.613939)',
    gpsLong: '77° 12\' 32.1" E (77.208922)',
    gpsAlt: '216 meters above sea level',
    software: 'Adobe Photoshop 2026 (Windows) - Edited',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  });

  // Magic bytes checker state
  const [magicInput, setMagicInput] = useState('89 50 4E 47');
  const [magicResult, setMagicResult] = useState<MagicSignature | null>(MAGIC_DB[0]);

  // Stego LSB decoder state
  const [stegoBits, setStegoBits] = useState(8);
  const [decodedMessage, setDecodedMessage] = useState(
    'FLAG{LSB_St3g0_P4ssw0rd_D3c0d3d_2026}'
  );
  const [isDecoding, setIsDecoding] = useState(false);

  const handleMagicCheck = (hexStr: string) => {
    setMagicInput(hexStr);
    const cleaned = hexStr.replace(/\s+/g, '').toUpperCase();
    const match = MAGIC_DB.find((sig) => {
      const sigClean = sig.bytes.replace(/\s+/g, '').replace(/[^0-9A-F]/g, '');
      return cleaned.startsWith(sigClean.slice(0, 4));
    });
    setMagicResult(match || null);
  };

  const handleRunStegoDecode = () => {
    setIsDecoding(true);
    setTimeout(() => {
      setIsDecoding(false);
      setDecodedMessage(
        'CONFIDENTIAL: Project-X key shard #3 recovered from Red channel 0th bitplane.'
      );
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: '🧪 Elite Labs' },
          { label: 'Forensic Cyber Lab' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Forensic Cyber Lab
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                DFIR TOOLKIT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Digital Forensics & Incident Response: EXIF parser, magic byte signature analyzer & LSB steganography decoder.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConceptModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Learn Concept</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'metadata', name: 'File Metadata & EXIF', icon: Camera },
          { id: 'magic', name: 'Magic Bytes Checker', icon: Binary },
          { id: 'stego', name: 'Steganography Decoder', icon: Eye },
          { id: 'hex', name: 'Hex Stream Viewer', icon: FileCode }
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

      {/* TAB 1: METADATA & EXIF VIEWER */}
      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Extracted EXIF & Forensic Evidence</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  Integrity Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Evidence File</span>
                  <p className="text-xs font-mono font-bold text-white truncate">{sampleMeta.fileName}</p>
                  <span className="text-[11px] text-slate-400">{sampleMeta.fileSize}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Capture Date & Time</span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{sampleMeta.dateTime}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Camera Hardware</span>
                  <p className="text-xs font-bold text-white">{sampleMeta.camera}</p>
                  <p className="text-[11px] text-slate-400">{sampleMeta.lens}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Exposure Settings</span>
                  <p className="text-xs font-mono text-cyan-300">
                    {sampleMeta.aperture} · {sampleMeta.shutter} · {sampleMeta.iso}
                  </p>
                </div>
              </div>

              {/* GPS Geolocation Coordinates */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Embedded GPS Triangulation
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">High Precision Fix</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div>Latitude: <span className="text-white font-bold">{sampleMeta.gpsLat}</span></div>
                  <div>Longitude: <span className="text-white font-bold">{sampleMeta.gpsLong}</span></div>
                  <div className="sm:col-span-2 text-slate-400 text-[11px]">
                    Altitude: {sampleMeta.gpsAlt}
                  </div>
                </div>
              </div>

              {/* Editing & Hashes */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">SHA-256 Hash Digest</span>
                  <span className="text-rose-400 font-medium text-[11px]">Tamper Marker: {sampleMeta.software}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-300 break-all bg-slate-950 p-2 rounded-xl border border-white/5">
                  {sampleMeta.sha256}
                </p>
              </div>
            </div>
          </div>

          {/* Upload / Inspector Controls */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Evidence Ingestion
              </h3>
              <div className="border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-all bg-slate-900/40">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs font-bold text-white">Drop suspicious image here</p>
                <p className="text-[11px] text-slate-400">Extracts EXIF, IPTC, and XMP metadata without server upload (Client-side privacy)</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Preset Test Evidence</span>
                <button
                  onClick={() => setSampleMeta({
                    fileName: 'drone_recon_surveillance.png',
                    fileSize: '8.7 MB',
                    camera: 'DJI Matrice 300 RTK Payload',
                    lens: 'Zenmuse H20T Thermal Tele',
                    focalLength: '135mm Optical',
                    aperture: 'f/4.0',
                    shutter: '1/1000 sec',
                    iso: 'ISO 100',
                    dateTime: '2026-11-01 09:14:02 UTC',
                    gpsLat: '19° 04\' 33.2" N (19.0760)',
                    gpsLong: '72° 52\' 39.8" E (72.8777)',
                    gpsAlt: '450 meters AGL',
                    software: 'Autopilot DJI DroneOS v4.1',
                    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
                  })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-left font-medium text-cyan-300 border border-white/5 cursor-pointer"
                >
                  📡 Load DJI Drone Thermal Aerial Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAGIC BYTES CHECKER */}
      {activeTab === 'magic' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Magic Bytes (File Header Signature) Inspector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Attackers disguise malicious .exe or .elf files by renaming them to .jpg or .png. The OS determines actual content by reading the initial magic byte sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">
                  Enter First Hex Bytes (e.g. 89 50 4E 47 or 4D 5A):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={magicInput}
                    onChange={(e) => handleMagicCheck(e.target.value)}
                    placeholder="e.g. 89 50 4E 47"
                    className="flex-1 px-4 py-2.5 rounded-xl os-glass-input text-xs font-mono"
                  />
                  <button
                    onClick={() => handleMagicCheck(magicInput)}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer"
                  >
                    Analyze
                  </button>
                </div>
              </div>

              {/* Sample quick picks */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {MAGIC_DB.map((sig) => (
                  <button
                    key={sig.name}
                    onClick={() => handleMagicCheck(sig.bytes.split(' ')[0] + ' ' + sig.bytes.split(' ')[1])}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-white/5 cursor-pointer"
                  >
                    {sig.ext}
                  </button>
                ))}
              </div>

              {/* Result card */}
              {magicResult ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>File Signature Identified: {magicResult.name}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 space-y-1">
                    <div>Canonical Extension: <span className="text-emerald-400 font-bold">{magicResult.ext}</span></div>
                    <div>MIME Type: <span className="text-slate-200">{magicResult.mime}</span></div>
                    <div>Standard Bytes: <span className="text-cyan-300">{magicResult.bytes}</span></div>
                    <div className="text-[11px] text-slate-400 pt-1">{magicResult.desc}</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Unknown or Spoofed Byte Pattern</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Byte sequence doesn't match standard safe headers. Could be raw binary, polyglot file, or encrypted payload.
                  </p>
                </div>
              )}
            </div>

            {/* Signature Database Table */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Standard Forensic Magic Byte Signatures
              </span>
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar text-xs font-mono">
                {MAGIC_DB.map((sig) => (
                  <div key={sig.name} className="p-2 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{sig.ext}</span>
                      <span className="text-slate-400 ml-2 text-[11px]">{sig.name}</span>
                    </div>
                    <span className="text-cyan-400 text-[10px] font-bold">{sig.bytes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STEGANOGRAPHY DECODER */}
      {activeTab === 'stego' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>LSB (Least Significant Bit) Steganography Extractor</span>
            </h3>
            <p className="text-xs text-slate-400">
              Steganography hides secret messages within the least significant bit of color channels (RGB) without causing human-perceptible pixel distortion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Bitplane Extraction Settings
              </span>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bitplane Depth:</span>
                  <span className="font-mono text-cyan-400 font-bold">{stegoBits} Bits / Byte</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={stegoBits}
                  onChange={(e) => setStegoBits(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunStegoDecode}
                  disabled={isDecoding}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/30"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDecoding ? 'animate-spin' : ''}`} />
                  <span>{isDecoding ? 'Decoding Bitplanes...' : 'Extract Hidden Payload'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Recovered Payload Stream:</span>
                <p className="text-emerald-400 font-bold break-all">{decodedMessage}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                How LSB Steganography Works
              </span>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  1. A standard 24-bit pixel consists of Red (8 bits), Green (8 bits), Blue (8 bits).
                </p>
                <p>
                  2. For pixel color <code className="text-cyan-300">#FF00A4</code>:
                  <br />
                  Red: <code className="text-amber-300">1111111<span className="text-rose-400 font-bold underline">0</span></code>
                </p>
                <p>
                  3. Flipping the 0th bit from 1 to 0 alters the shade from 255 to 254 (imperceptible to human eyes, but readable by software).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HEX DUMP VIEWER */}
      {activeTab === 'hex' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Raw Byte Stream Hexdump Inspector</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Offset | Hex Stream | ASCII Dump</span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed no-scrollbar shadow-inner">
            {SAMPLE_HEX_DUMP}
          </pre>
        </div>
      )}

      {/* LEARN CONCEPT MODAL */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Forensic Cyber Principles</span>
              </h2>
              <button
                onClick={() => setShowConceptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>Chain of Custody:</strong> Preserving the chronological provenance of digital evidence to ensure admissibility in court.
              </p>
              <p>
                • <strong>Hashing (SHA-256):</strong> Calculating cryptographic hashes before and after analysis to prove the original media was never altered.
              </p>
              <p>
                • <strong>Magic Bytes:</strong> Never rely on file extensions (.jpg, .pdf) because threat actors spoof extensions to bypass email filters.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
