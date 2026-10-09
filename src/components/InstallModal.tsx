import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Smartphone } from 'lucide-react';

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const appUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';

  useEffect(() => {
    if (appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 220,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code error:', err));
    }
  }, [appUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Install App</h3>
            <p className="text-xs text-zinc-400">Phone pe native app ki tarah chalaein</p>
          </div>
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="flex flex-col items-center justify-center my-3 p-3 bg-white rounded-2xl shadow-inner">
            <img src={qrDataUrl} alt="App QR Code" className="w-44 h-44 object-contain" />
            <p className="text-[11px] text-zinc-700 font-mono mt-1 font-semibold">
              Scan with phone camera
            </p>
          </div>
        )}

        {/* URL Box & Copy */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 mb-3">
          <input
            type="text"
            readOnly
            value={appUrl}
            className="w-full bg-transparent px-2 text-xs text-zinc-300 font-mono outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-[11px] text-zinc-400 bg-zinc-900/60 rounded-xl p-3 border border-zinc-800/80 space-y-1.5">
          <p className="font-semibold text-zinc-300 flex items-center gap-1">
            📱 Phone pe Real App ki tarah install karein:
          </p>
          <p>• <strong>Chrome (Android):</strong> 3-dots (⋮) dabayein &gt; <em>"Add to Home screen"</em> / <em>"Install App"</em>.</p>
          <p>• <strong>Safari (iPhone):</strong> 3-dots ya menu dabayein &gt; <em>"Add to Home Screen"</em>.</p>
        </div>
      </div>
    </div>
  );
};
