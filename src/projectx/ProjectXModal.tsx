import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, Sparkles, X, Key, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProjectXModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export const ProjectXModal: React.FC<ProjectXModalProps> = ({
  isOpen,
  onClose,
  onUnlocked
}) => {
  const [code1, setCode1] = useState<string>('');
  const [code2, setCode2] = useState<string>('');
  const [code3, setCode3] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const c1 = code1.trim().toUpperCase();
    const c2 = code2.trim().toUpperCase();
    const c3 = code3.trim().toUpperCase();

    const validC1 = c1 === 'OMNITRIX' || c1 === 'BEN10' || c1 === 'PRINCE';
    const validC2 = c2 === 'ALGORITHM' || c2 === 'RECIPE' || c2 === 'CPU';
    const validC3 = c3 === 'BYTE' || c3 === 'AARAV' || c3 === '1307';

    if (validC1 && validC2 && validC3) {
      setIsSuccess(true);
      try {
        localStorage.setItem('projectx_unlocked', 'true');
      } catch {}
      setTimeout(() => {
        onUnlocked();
        onClose();
      }, 1000);
    } else {
      const wrongFields: string[] = [];
      if (!validC1) wrongFields.push('Cipher 1');
      if (!validC2) wrongFields.push('Cipher 2');
      if (!validC3) wrongFields.push('Cipher 3');
      setErrorMessage(`❌ Incorrect: ${wrongFields.join(', ')}. Check hints below!`);
    }
  };

  const fillCheatCodes = () => {
    setCode1('OMNITRIX');
    setCode2('ALGORITHM');
    setCode3('BYTE');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.25)] space-y-6 relative overflow-hidden text-slate-100"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>PROJECT-X: THE HIDDEN VAULT</span>
              </h2>
              <p className="text-xs text-slate-400">Classified Cyber Lab &amp; Terminal Simulator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Story Prompt */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-xs space-y-2">
          <span className="font-mono text-emerald-400 font-bold uppercase block">
            🔒 Security Protocol 3-Key Challenge:
          </span>
          <p className="text-slate-300 leading-relaxed font-sans">
            TechNagar story aur BCA Verse me 3 secret words chhupaaye gaye hain. Vault unlock karne ke liye teeno ciphers enter karein:
          </p>
          <ul className="text-slate-400 space-y-1 text-[11px] font-mono">
            <li>• <strong>Cipher 1:</strong> The alien watch emblem logo on the top navbar.</li>
            <li>• <strong>Cipher 2:</strong> Chapter 5 ke according computer ki step-by-step recipe.</li>
            <li>• <strong>Cipher 3:</strong> Aarav ke intelligent AI guide ka naam (0 aur 1 se bana).</li>
          </ul>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Cipher 1 (Logo Key):
              </label>
              <input
                type="text"
                placeholder="E.g. OMNITRIX"
                value={code1}
                onChange={(e) => setCode1(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs uppercase focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Cipher 2 (Recipe Key):
              </label>
              <input
                type="text"
                placeholder="E.g. ALGORITHM"
                value={code2}
                onChange={(e) => setCode2(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs uppercase focus:outline-hidden focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Cipher 3 (AI Companion Key):
              </label>
              <input
                type="text"
                placeholder="E.g. BYTE"
                value={code3}
                onChange={(e) => setCode3(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs uppercase focus:outline-hidden focus:border-emerald-400"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 font-mono bg-rose-950/60 p-2.5 rounded-xl border border-rose-800">
              {errorMessage}
            </p>
          )}

          {isSuccess && (
            <p className="text-xs text-emerald-300 font-mono bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-500/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ACCESS GRANTED! Launching Project-X Cyber Lab...</span>
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={fillCheatCodes}
              className="text-[11px] text-slate-500 hover:text-emerald-400 underline font-mono cursor-pointer"
            >
              Fill Cipher Answers (Hint)
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Unlock Secret Lab 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
