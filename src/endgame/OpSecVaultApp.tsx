import React, { useState, useRef } from 'react';
import {
  KeyRound,
  ImageOff,
  Shield,
  CheckSquare,
  Square,
  ArrowLeft,
  LayoutGrid,
  Lock,
  Unlock,
  FileSignature,
  Upload,
  Download,
  Award,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useGamificationStore } from '../store/useGamificationStore';

interface OpSecVaultAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher: () => void;
}

type OpSecTab = 'pgp' | 'scrubber' | 'burner' | 'threatmodel';

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function formatPem(b64: string, label: string): string {
  const lines = b64.match(/.{1,64}/g)?.join('\n') || b64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

const BURNER_BLUEPRINT_STEPS = [
  {
    layer: '01 · Dedicated Research VM',
    tool: 'VirtualBox / QEMU / Whonix / Snapshot Rollback',
    rule: 'Never open untrusted PDFs, suspicious links, or bug bounty artifacts on your daily host OS.',
    steps: [
      'Disable shared clipboard and host-folder auto-mount during analysis.',
      'Take a clean baseline VM snapshot so you can revert in 5 seconds after each session.',
      'Keep personal banking, passwords, and family photos strictly outside research VMs.',
    ],
  },
  {
    layer: '02 · Email & Handle Compartmentalization',
    tool: 'Alias Forwarding (SimpleLogin / Addy.io) + Unique Handle',
    rule: 'Zero overlap between your public security research handle and private legal identity.',
    steps: [
      'Use a dedicated research email alias for HackerOne, GitHub labs, and mailing lists.',
      'Configure Git with a GitHub noreply commit email so personal addresses never leak in git log.',
      'Never reuse profile avatars or usernames across personal and research personas.',
    ],
  },
  {
    layer: '03 · Network & DNS Hygiene',
    tool: 'Trusted Audited VPN + DNS-over-HTTPS + WebRTC Leak Check',
    rule: 'Prevent accidental home IP correlation when testing authorized public assets.',
    steps: [
      'Enable Kill-Switch on your VPN client and verify DNS resolves via encrypted DoH/DoT.',
      'Run separate Firefox Multi-Account Containers or dedicated browser profiles per project.',
      'Turn off third-party telemetry and auto-sync on research browser profiles.',
    ],
  },
  {
    layer: '04 · Secrets & Hardware Keys',
    tool: 'Password Manager (KeePassXC / Bitwarden) + FIDO2 Passkey',
    rule: 'Assume every password reused twice will eventually appear in a breach corpus.',
    steps: [
      'Generate unique 20+ character random passwords for every account.',
      'Protect primary email and GitHub with hardware FIDO2 / Passkeys over SMS OTP.',
      'Store encrypted recovery codes offline in two physical safe locations.',
    ],
  },
];

const PERSONAL_THREAT_ITEMS = [
  { id: 'tm-1', domain: 'Identity', weight: 15, text: 'Phishing-resistant MFA (Passkey or Authenticator App) enabled on primary email & GitHub' },
  { id: 'tm-2', domain: 'Passwords', weight: 15, text: 'Unique password-manager generated credentials on all financial & cloud accounts' },
  { id: 'tm-3', domain: 'Social Media', weight: 10, text: 'Phone number, home address, and birthdate hidden from public social bios' },
  { id: 'tm-4', domain: 'Photos', weight: 10, text: 'Camera GPS tagging disabled or EXIF stripped before posting photos publicly' },
  { id: 'tm-5', domain: 'Cloud', weight: 15, text: 'Zero sensitive documents or recovery keys stored unencrypted in public cloud links' },
  { id: 'tm-6', domain: 'Devices', weight: 15, text: 'Full-disk encryption (FileVault / BitLocker / LUKS) and auto-lock screen enabled' },
  { id: 'tm-7', domain: 'Browser', weight: 10, text: 'Audited browser extensions monthly and removed unused permissions' },
  { id: 'tm-8', domain: 'Backups', weight: 10, text: 'Offline encrypted backup tested within the last 90 days' },
];

export const OpSecVaultApp: React.FC<OpSecVaultAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const { addXp, unlockBadge, xp } = useGamificationStore();
  const [activeTab, setActiveTab] = useState<OpSecTab>('pgp');
  const [xpNotice, setXpNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // TAB 1: Real Web Crypto Playground
  const [isGenerating, setIsGenerating] = useState(false);
  const [encKeyPair, setEncKeyPair] = useState<CryptoKeyPair | null>(null);
  const [sigKeyPair, setSigKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyPem, setPublicKeyPem] = useState<string>('');
  const [keyFingerprint, setKeyFingerprint] = useState<string>('');
  const [plaintext, setPlaintext] = useState<string>(
    'Meet at 18:00 UTC to review the Q3 security audit report.'
  );
  const [ciphertext, setCiphertext] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [signatureB64, setSignatureB64] = useState<string>('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // TAB 2: Client-Side EXIF Scrubber
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [scrubResult, setScrubResult] = useState<{
    originalName: string;
    originalSizeKb: number;
    cleanedSizeKb: number;
    width: number;
    height: number;
    exifHeaderDetected: boolean;
    cleanedDataUrl: string;
  } | null>(null);

  // TAB 4: Personal Threat Model Checklist
  const [checkedThreats, setCheckedThreats] = useState<Record<string, boolean>>({});

  const awardOpSecXp = (amount: number, label: string, activityId: string) => {
    const res = addXp(amount, label, activityId);
    if (res.added) {
      setXpNotice(`+${amount} XP · ${label}`);
      window.setTimeout(() => setXpNotice(null), 2600);
    }
  };

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      const rsaPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );
      const ecdsaPair = await window.crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: 'P-256' },
        true,
        ['sign', 'verify']
      );
      const spki = await window.crypto.subtle.exportKey('spki', rsaPair.publicKey);
      const pem = formatPem(arrayBufferToBase64(spki), 'PUBLIC KEY');
      const digest = await window.crypto.subtle.digest('SHA-256', spki);
      const fpHex = Array.from(new Uint8Array(digest).slice(0, 10))
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(':');

      setEncKeyPair(rsaPair);
      setSigKeyPair(ecdsaPair);
      setPublicKeyPem(pem);
      setKeyFingerprint(fpHex);
      setCiphertext('');
      setDecryptedText('');
      setSignatureB64('');
      setVerifyStatus('idle');
      awardOpSecXp(100, 'Generated Web Crypto RSA-2048 & ECDSA Keypairs', 'opsec_keygen');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEncrypt = async () => {
    if (!encKeyPair) return;
    const encoded = new TextEncoder().encode(plaintext);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      encKeyPair.publicKey,
      encoded
    );
    setCiphertext(arrayBufferToBase64(encrypted));
    setDecryptedText('');
  };

  const handleDecrypt = async () => {
    if (!encKeyPair || !ciphertext) return;
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        encKeyPair.privateKey,
        base64ToArrayBuffer(ciphertext)
      );
      setDecryptedText(new TextDecoder().decode(decrypted));
    } catch {
      setDecryptedText('Decryption failed: ciphertext modified or key mismatch.');
    }
  };

  const handleSignMessage = async () => {
    if (!sigKeyPair) return;
    const encoded = new TextEncoder().encode(plaintext);
    const sig = await window.crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      sigKeyPair.privateKey,
      encoded
    );
    setSignatureB64(arrayBufferToBase64(sig));
    setVerifyStatus('idle');
  };

  const handleVerifySignature = async () => {
    if (!sigKeyPair || !signatureB64) return;
    try {
      const encoded = new TextEncoder().encode(plaintext);
      const ok = await window.crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        sigKeyPair.publicKey,
        base64ToArrayBuffer(signatureB64),
        encoded
      );
      setVerifyStatus(ok ? 'valid' : 'invalid');
      if (ok) unlockBadge('opsec_ghost');
    } catch {
      setVerifyStatus('invalid');
    }
  };

  // Detect JPEG EXIF APP1 marker (0xFF 0xE1 "Exif") and scrub by re-encoding on Canvas
  const handleFileUpload = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let exifDetected = false;
    for (let i = 0; i < Math.min(bytes.length - 6, 4096); i++) {
      if (
        bytes[i] === 0xff &&
        bytes[i + 1] === 0xe1 &&
        bytes[i + 4] === 0x45 && // E
        bytes[i + 5] === 0x78    // x
      ) {
        exifDetected = true;
        break;
      }
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const cleanedDataUrl = canvas.toDataURL('image/png');
        const cleanedSizeBytes = Math.round((cleanedDataUrl.length * 3) / 4);
        setScrubResult({
          originalName: file.name,
          originalSizeKb: Math.max(1, Math.round(file.size / 1024)),
          cleanedSizeKb: Math.max(1, Math.round(cleanedSizeBytes / 1024)),
          width: img.naturalWidth,
          height: img.naturalHeight,
          exifHeaderDetected: exifDetected,
          cleanedDataUrl,
        });
        awardOpSecXp(90, 'Scrubbed Image Metadata Locally', 'opsec_exif_scrub');
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  };

  const handleLoadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, 640, 360);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('SAMPLE PHOTO · METADATA SCRUBBED', 64, 175);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px monospace';
    ctx.fillText('GPS: REMOVED · CAMERA MODEL: REMOVED · TIMESTAMP: REMOVED', 64, 212);
    const cleanedDataUrl = canvas.toDataURL('image/png');
    setScrubResult({
      originalName: 'demo_vacation_photo.jpg',
      originalSizeKb: 428,
      cleanedSizeKb: 38,
      width: 640,
      height: 360,
      exifHeaderDetected: true,
      cleanedDataUrl,
    });
    awardOpSecXp(90, 'Scrubbed Image Metadata Locally', 'opsec_exif_scrub');
  };

  const handleCopy = (key: string, text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {}
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1600);
  };

  const postureScore = PERSONAL_THREAT_ITEMS.reduce(
    (sum, item) => (checkedThreats[item.id] ? sum + item.weight : sum),
    0
  );

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 relative overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 14% 12%, rgba(139, 92, 246, 0.14), transparent 36%), radial-gradient(circle at 86% 18%, rgba(16, 185, 129, 0.13), transparent 38%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/75 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-violet-300">
              <Shield className="w-4 h-4" />
              <span>OPSEC &amp; PRIVACY VAULT · 100% CLIENT-SIDE CRYPTOGRAPHY</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Operational Security, Web Crypto PGP &amp; EXIF Metadata Scrubber
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Protect your personal and researcher identity with local RSA/ECDSA encryption, browser-side EXIF scrubbing, compartmentalization blueprints, and threat modeling.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-violet-300 tabular-nums">
              <Award className="w-3.5 h-3.5" />
              <span>{xp.toLocaleString()} XP</span>
            </div>
            <button
              type="button"
              onClick={onOpenAppSwitcher}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-violet-300" />
              Apps
            </button>
            <button
              type="button"
              onClick={onBackToBca}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/35 text-xs font-semibold text-violet-100 flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </header>

        {xpNotice && (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{xpNotice}</span>
          </div>
        )}

        {/* Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'pgp', label: 'PGP & Web Crypto Lab', icon: KeyRound },
            { id: 'scrubber', label: 'EXIF Metadata Scrubber', icon: ImageOff },
            { id: 'burner', label: 'Research Identity Blueprint', icon: Shield },
            { id: 'threatmodel', label: 'Personal Threat Model', icon: CheckSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as OpSecTab)}
                className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-violet-500/20 border-violet-400/50 text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-violet-300' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: PGP & WEB CRYPTO PLAYGROUND */}
        {activeTab === 'pgp' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Keypair Generation */}
            <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">1. Generate Asymmetric Keypairs</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uses native browser Web Crypto API (RSA-OAEP 2048-bit + ECDSA P-256). Private keys never leave memory.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateKeys}
                disabled={isGenerating}
                className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/45 text-violet-100 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                {isGenerating ? 'Generating 2048-bit Keypair...' : 'Generate Fresh Keypair'}
              </button>

              {publicKeyPem ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-300">SHA-256 Fingerprint</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('pem', publicKeyPem)}
                      className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'pem' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'pem' ? 'Copied PEM' : 'Copy Public Key'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/25 font-mono text-[11px] text-emerald-200 break-all">
                    {keyFingerprint}
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-white/10 font-mono text-[10px] text-slate-300 max-h-44 overflow-y-auto whitespace-pre-wrap break-all">
                    {publicKeyPem}
                  </pre>
                </div>
              ) : (
                <div className="p-5 rounded-xl border border-dashed border-white/10 bg-slate-950/50 text-xs text-slate-400 text-center">
                  Click <strong className="text-violet-300">Generate Fresh Keypair</strong> to create your local public/private keys.
                </div>
              )}
            </div>

            {/* Encrypt / Decrypt & Sign / Verify Flow */}
            <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <h2 className="text-base font-bold text-white">2. Encrypt, Decrypt &amp; Digitally Sign</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Plaintext Message
                </label>
                <textarea
                  rows={3}
                  value={plaintext}
                  onChange={(e) => {
                    setPlaintext(e.target.value);
                    setVerifyStatus('idle');
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-white/15 p-3 text-xs text-white focus:border-violet-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleEncrypt}
                  disabled={!encKeyPair}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-200 text-xs font-semibold inline-flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Encrypt (Public Key)
                </button>
                <button
                  type="button"
                  onClick={handleDecrypt}
                  disabled={!encKeyPair || !ciphertext}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 text-xs font-semibold inline-flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Decrypt (Private Key)
                </button>
                <button
                  type="button"
                  onClick={handleSignMessage}
                  disabled={!sigKeyPair}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 text-xs font-semibold inline-flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Sign (ECDSA)
                </button>
                <button
                  type="button"
                  onClick={handleVerifySignature}
                  disabled={!sigKeyPair || !signatureB64}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/35 text-violet-200 text-xs font-semibold inline-flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verify Signature
                </button>
              </div>

              {ciphertext && (
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-cyan-300">RSA-OAEP Ciphertext (Base64)</span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-[10.5px] text-slate-300 break-all max-h-24 overflow-y-auto">
                    {ciphertext}
                  </div>
                </div>
              )}

              {decryptedText && (
                <div className="p-3 rounded-xl bg-emerald-950/35 border border-emerald-500/30 text-xs text-emerald-100">
                  <span className="font-mono text-[10px] text-emerald-300 block mb-0.5">
                    DECRYPTED OUTPUT
                  </span>
                  {decryptedText}
                </div>
              )}

              {signatureB64 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-300">ECDSA P-256 Signature</span>
                    {verifyStatus !== 'idle' && (
                      <span
                        className={`text-xs font-mono font-bold ${
                          verifyStatus === 'valid' ? 'text-emerald-300' : 'text-rose-400'
                        }`}
                      >
                        {verifyStatus === 'valid'
                          ? 'SIGNATURE VALID (Authentic & Untampered)'
                          : 'SIGNATURE INVALID (Plaintext Changed!)'}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/20 font-mono text-[10.5px] text-slate-300 break-all">
                    {signatureB64}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Tip: Edit even 1 character in the Plaintext box and tap Verify Signature again to see cryptographic tamper detection.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: METADATA SCRUBBER */}
        {activeTab === 'scrubber' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">Local EXIF Metadata Scrubber</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Smartphone photos often embed GPS coordinates, camera model, lens serial, and timestamps. This tool re-renders pure pixels on an offscreen HTML5 Canvas so 100% of EXIF headers are stripped locally — nothing is ever uploaded.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/45 text-violet-100 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Select Local Image (JPEG / PNG / WebP)
                </button>
                <button
                  type="button"
                  onClick={handleLoadSampleImage}
                  className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Test with Sample Photo
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              {scrubResult ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{scrubResult.originalName}</h3>
                      <p className="text-xs font-mono text-slate-400 tabular-nums">
                        {scrubResult.width}×{scrubResult.height}px · Original {scrubResult.originalSizeKb} KB → Clean PNG {scrubResult.cleanedSizeKb} KB
                      </p>
                    </div>
                    <a
                      href={scrubResult.cleanedDataUrl}
                      download={`clean-${scrubResult.originalName.replace(/\.[^.]+$/, '')}.png`}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold inline-flex items-center gap-2 transition whitespace-nowrap shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download Clean Image
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/25">
                      <span className="font-mono text-[10px] text-amber-300 block">BEFORE SCRUB</span>
                      <p className="text-slate-200 mt-1">
                        {scrubResult.exifHeaderDetected
                          ? 'EXIF APP1 metadata block detected (GPS/Device tags stripped).'
                          : 'Container headers inspected and purged via fresh pixel re-encode.'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/35 border border-emerald-500/30">
                      <span className="font-mono text-[10px] text-emerald-300 block">AFTER SCRUB</span>
                      <p className="text-emerald-100 mt-1">
                        0 EXIF tags · 0 GPS coordinates · 0 camera identifiers remaining.
                      </p>
                    </div>
                  </div>

                  <img
                    src={scrubResult.cleanedDataUrl}
                    alt="Metadata-scrubbed preview"
                    className="w-full max-h-64 object-contain rounded-xl bg-slate-950 border border-white/10"
                  />
                </>
              ) : (
                <div className="h-56 rounded-xl border border-dashed border-white/10 bg-slate-950/50 flex flex-col items-center justify-center text-center px-6 gap-2">
                  <ImageOff className="w-7 h-7 text-slate-500" />
                  <p className="text-xs text-slate-400">
                    Choose an image or click <strong className="text-white">Test with Sample Photo</strong> to strip EXIF metadata completely inside your browser.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 3: BURNER IDENTITY BLUEPRINT */}
        {activeTab === 'burner' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BURNER_BLUEPRINT_STEPS.map((bp) => (
              <article
                key={bp.layer}
                className="bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-violet-300">{bp.layer}</span>
                  <span className="text-slate-400 truncate ml-2">{bp.tool}</span>
                </div>
                <p className="text-sm font-bold text-white leading-snug">{bp.rule}</p>
                <ul className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-slate-300">
                  {bp.steps.map((st, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        )}

        {/* TAB 4: PERSONAL DIGITAL THREAT MODEL */}
        {activeTab === 'threatmodel' && (
          <section className="bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white">Personal Digital Threat Model Audit</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check each control you actively enforce in your daily digital life to calculate your OpSec resilience score.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono text-slate-400 block">OPSEC POSTURE SCORE</span>
                <span
                  className={`text-2xl font-black font-mono tabular-nums ${
                    postureScore >= 80
                      ? 'text-emerald-400'
                      : postureScore >= 50
                      ? 'text-amber-300'
                      : 'text-rose-400'
                  }`}
                >
                  {postureScore}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERSONAL_THREAT_ITEMS.map((item) => {
                const checked = !!checkedThreats[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const next = { ...checkedThreats, [item.id]: !checked };
                      setCheckedThreats(next);
                      const nextScore = PERSONAL_THREAT_ITEMS.reduce(
                        (s, it) => (next[it.id] ? s + it.weight : s),
                        0
                      );
                      if (nextScore >= 80) {
                        awardOpSecXp(100, 'Achieved 80+ Personal OpSec Posture', 'opsec_threat_model');
                        unlockBadge('opsec_ghost');
                      }
                    }}
                    className={`text-left p-3.5 rounded-xl border flex items-start gap-3 transition cursor-pointer ${
                      checked
                        ? 'bg-emerald-500/10 border-emerald-400/40'
                        : 'bg-slate-950/75 border-white/10 hover:border-white/25'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-violet-300 uppercase">
                        {item.domain} · +{item.weight} pts
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">{item.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
export default OpSecVaultApp;
