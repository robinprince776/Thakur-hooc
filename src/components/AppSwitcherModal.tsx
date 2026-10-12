import React from 'react';
import {
  X,
  Cpu,
  Terminal,
  Calculator as CalcIcon,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Heart,
  Grid
} from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';

export type CurrentAppType = 'bca' | 'calc' | 'sukhan';

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: CurrentAppType;
  onSelectApp: (app: CurrentAppType) => void;
}

export const AppSwitcherModal: React.FC<AppSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentApp,
  onSelectApp
}) => {
  if (!isOpen) return null;

  const apps = [
    {
      id: 'bca' as CurrentAppType,
      title: 'BCA Verse',
      subtitle: 'Academic Suite & Solvers',
      tagline: 'Logic Systems · 45+ C Programs · Fundamentals',
      description:
        'Complete academic portal for BCA students with step-by-step number system converters, tested C code, and full notes.',
      badge: 'Academic App 1',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      borderHover: 'hover:border-indigo-500/60',
      accentGlow: 'bg-indigo-500/10',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Cpu className="w-6 h-6" />
        </div>
      )
    },
    {
      id: 'calc' as CurrentAppType,
      title: 'CalcVault',
      subtitle: 'Calculator & Stealth Chat',
      tagline: 'Standard & Scientific · Secret Passcode Vault',
      description:
        'Authentic mathematical calculator with tactile haptics and sounds. Hidden PIN trigger opens a private direct P2P messaging lounge.',
      badge: 'Utility App 2',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      gradient: 'from-amber-600 via-orange-600 to-amber-700',
      borderHover: 'hover:border-amber-500/60',
      accentGlow: 'bg-amber-500/10',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-zinc-900 border border-amber-500/40 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
          <CalcIcon className="w-6 h-6 text-amber-300" />
        </div>
      )
    },
    {
      id: 'sukhan' as CurrentAppType,
      title: 'SUKHAN',
      subtitle: 'Alfaaz, Ehsaas Aur Adab',
      tagline: 'Writing Studio · 12 Master Poets · Card Designer',
      description:
        'Premium literary universe for shayari, ghazals, and songwriting. Features verified poet archives, mood discovery, and Sher Card art.',
      badge: 'Premium App 3',
      badgeColor: 'bg-[#59263C] text-[#C6A66B] border-[#C6A66B]/40',
      gradient: 'from-[#59263C] via-[#3C1425] to-[#0B0B0F]',
      borderHover: 'hover:border-[#C6A66B]',
      accentGlow: 'bg-[#59263C]/30',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#59263C] via-[#3C1425] to-[#15151C] border border-[#C6A66B]/50 flex items-center justify-center text-[#C6A66B] shadow-lg shadow-[#59263C]/40">
          <SukhanPenIcon size={26} />
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-[#0B0B0F] border border-[#C6A66B]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#59263C]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#59263C]/40 text-[#C6A66B] border border-[#C6A66B]/30 uppercase">
                Triple App Experience
              </span>
              <span className="text-[11px] text-zinc-400">Created by Prince Thakur</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#FFF5EA]">
              Choose Your App Experience
            </h2>
            <p className="text-xs text-zinc-400">
              Kisi bhi app ko chunein — sabhi teen apps poori tarah functional aur offline chalte hain.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-[#15151C] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Apps Cards List */}
        <div className="relative z-10 py-5 space-y-3.5 overflow-y-auto max-h-[60vh] pr-1">
          {apps.map((app) => {
            const isCurrent = currentApp === app.id;
            return (
              <div
                key={app.id}
                onClick={() => {
                  onSelectApp(app.id);
                  onClose();
                }}
                className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-[#15151C] border-[#C6A66B] ring-1 ring-[#C6A66B]/40 shadow-xl'
                    : `bg-[#15151C]/70 border-zinc-800/90 ${app.borderHover} hover:bg-[#1a1722]`
                }`}
              >
                <div className="flex items-start gap-4">
                  {app.icon}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
                        {app.title}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${app.badgeColor}`}>
                        {app.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-serif italic text-[#C6A66B]">
                      {app.subtitle}
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed max-w-md pt-0.5">
                      {app.description}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#C6A66B] text-slate-950 shadow-md'
                        : 'bg-[#0B0B0F] border border-zinc-800 text-zinc-300 group-hover:border-[#C6A66B] group-hover:text-[#C6A66B]'
                    }`}
                  >
                    <span>{isCurrent ? 'Current App' : 'Launch'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Creator Watermark */}
        <div className="relative z-10 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#C6A66B] fill-[#C6A66B]" />
            <span className="font-semibold text-[#FFF5EA]">Made by Prince Thakur</span>
          </div>

          <span className="text-[11px] text-zinc-500">
            Switch anytime via header icon or URL hash (#sukhan, #bca, #calc)
          </span>
        </div>
      </div>
    </div>
  );
};
