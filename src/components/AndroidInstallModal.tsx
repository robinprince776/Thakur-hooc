import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Download, Check, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pwabuilderUrl = `https://www.pwabuilder.com?site=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    if (appUrl) {
      QRCode.toDataURL(appUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((e) => console.error('QR code error:', e));
    }
  }, [appUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Android App Installation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Install as standalone Android App on your phone
            </p>
          </div>
        </div>

        {/* Option 1: 1-Click Native Android Install (WebAPK) */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-950/40 dark:to-indigo-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
              <Zap size={12} />
              Recommended (Direct)
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
              Instant on Android
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Install Direct Android App
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            Chrome / Android aapke phone par real <strong>WebAPK</strong> app install kar dega. Phone ke app drawer aur home screen par standalone app icon ban jayega (bina URL bar ke).
          </p>

          {deferredPrompt ? (
            <button
              onClick={() => {
                onTriggerInstall();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/30 cursor-pointer active:scale-98"
            >
              <Download size={16} />
              <span>Install Now on This Phone</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Android phone me Chrome kholiye
                </p>
                <p className="pl-6 text-[11px] text-slate-500 dark:text-slate-400">
                  Top right me <strong>3-dots (⋮)</strong> dabayein aur <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par click karein.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Option 2: Scan QR from PC to Phone */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Open on your Android Phone
          </h4>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {qrCodeUrl && (
              <div className="p-2 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                <img src={qrCodeUrl} alt="App QR Code" className="w-28 h-28 object-contain" />
              </div>
            )}
            <div className="flex-1 space-y-2 text-left">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Phone ke camera se QR code scan karein aur direct phone me install karein:
              </p>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="w-full bg-transparent px-2 text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Option 3: Generate Signed APK / AAB for Play Store */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-indigo-500" />
              Generate Standalone .APK / .AAB (PWABuilder)
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Agar aapko Google Play Store ke liye raw <strong>.apk</strong> ya <strong>.aab</strong> file package chahiye, toh PWABuilder (official Google/Microsoft PWA packager) se 1-click me generate kar sakte hain:
          </p>
          <a
            href={pwabuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span>Open PWABuilder for APK</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};
