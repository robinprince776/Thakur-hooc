import React, { useState } from 'react';
import {
  PenTool,
  BookOpen,
  Compass,
  BookMarked,
  Sparkles,
  ArrowRight,
  Palette,
  Copy,
  Check,
  Heart,
  Quote,
  Feather,
  Music,
  Flame,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SukhanAppTab } from '../types';
import { SukhanPenIcon } from './SukhanPenIcon';
import { POETS_DATA } from '../data/poetsData';
import { MOODS_DATA } from '../data/moodsData';

interface SukhanHomeProps {
  onNavigateTab: (tab: SukhanAppTab) => void;
  onOpenCardDesigner: (text: string, attribution: string) => void;
  onSelectPoet: (poetId: string) => void;
  onSelectMood: (moodName: string) => void;
}

export const SukhanHome: React.FC<SukhanHomeProps> = ({
  onNavigateTab,
  onOpenCardDesigner,
  onSelectPoet,
  onSelectMood
}) => {
  const [copiedDailySher, setCopiedDailySher] = useState(false);

  // Daily Couplet (Aaj Ka Sher)
  const dailySher = {
    lines: [
      'Hazaron khwahishen aisi ki har khwahish pe dam nikle,',
      'Bohat nikle mere armaan lekin phir bhi kam nikle.'
    ],
    poet: 'Mirza Ghalib',
    tashreeh:
      'Insaan ki khwahishein be-inteha hain, har khwahish par jaan nikalti hai. Bahut armaan poore hue par phir bhi dil ki pyaas adhoori rahi.',
    mood: 'Falsafa'
  };

  const handleCopyDailySher = () => {
    navigator.clipboard.writeText(
      `${dailySher.lines.join('\n')}\n— ${dailySher.poet}\n(Aaj Ka Sher · Sukhan · Made by Prince Thakur)`
    );
    setCopiedDailySher(true);
    setTimeout(() => setCopiedDailySher(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Editorial Luxury Hero Banner */}
      <section className="relative rounded-3xl p-6 sm:p-10 md:p-12 overflow-hidden bg-gradient-to-br from-[#15151C] via-[#0B0B0F] to-[#25101a] border border-[#C6A66B]/30 shadow-2xl">
        {/* Ambient velvet & gold lighting orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#59263C]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0B0F]/80 border border-[#C6A66B]/40 text-xs font-semibold text-[#C6A66B]">
              <SukhanPenIcon size={14} />
              <span>Alfaaz, Ehsaas Aur Adab</span>
              <span className="w-1 h-1 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] text-zinc-400 font-normal">Made by Prince Thakur</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFF5EA] tracking-wide leading-tight">
              Aapka Digital <br />
              <span className="italic text-[#C6A66B]">Adabi Lounge</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
              Shayari, ghazals aur punjabi song lyrics likhne ka intelligent studio, aur tareekh ke azeem shayaron ka verified kalam.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigateTab('studio')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C6A66B] to-[#8C6F38] text-slate-950 font-bold text-xs shadow-xl shadow-[#C6A66B]/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>Apni Shayari Likho</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('library')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#59263C]/60 hover:bg-[#59263C] border border-[#C6A66B]/50 hover:border-[#C6A66B] text-xs font-bold text-[#FFF5EA] transition-all cursor-pointer shadow-lg shadow-[#59263C]/20"
              >
                <Sparkles className="w-4 h-4 text-[#C6A66B]" />
                <span>Mood Shayari Library</span>
              </button>

              <button
                onClick={() => onNavigateTab('poets')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#0B0B0F]/80 hover:bg-[#15151C] border border-[#C6A66B]/30 hover:border-[#C6A66B] text-xs font-semibold text-[#F2E9DC] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#C6A66B]" />
                <span>Shayaron Ki Duniya</span>
              </button>
            </div>
          </div>

          {/* Designer Credit Plaque */}
          <div className="bg-[#0B0B0F]/90 border border-[#C6A66B]/40 p-5 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-xs shrink-0 self-stretch md:self-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#59263C] to-[#15151C] border border-[#C6A66B]/40 flex items-center justify-center mb-2 shadow-inner">
              <SukhanPenIcon size={26} />
            </div>
            <span className="text-[10px] tracking-widest uppercase text-[#C6A66B] font-mono font-bold">
              Product Architect
            </span>
            <div className="text-base font-serif font-bold text-[#FFF5EA] mt-0.5">
              Prince Thakur
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Crafted with Obsidian Glass luxury &amp; classical aesthetic.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE SPOTLIGHT 1: AAJ KA SHER */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-[#15151C]/90 border border-[#C6A66B]/30 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#C6A66B]/20 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#59263C] text-[#C6A66B] flex items-center justify-center">
              <Quote className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#F2E9DC] uppercase tracking-wider">
                Aaj Ka Sher (Daily Couplet)
              </h2>
              <span className="text-[11px] text-zinc-400">Har roz ka muntakhab sher</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCardDesigner(dailySher.lines.join('\n'), dailySher.poet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0B0F] border border-[#C6A66B]/30 text-xs font-semibold text-[#F2E9DC] hover:border-[#C6A66B] transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span className="hidden sm:inline">Design Card</span>
            </button>

            <button
              onClick={handleCopyDailySher}
              className="p-1.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Copy Sher"
            >
              {copiedDailySher ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Couplet Typography */}
        <div className="py-6 text-center max-w-2xl mx-auto space-y-3">
          <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#FFF5EA] leading-loose">
            "{dailySher.lines[0]}"
            <br />
            "{dailySher.lines[1]}"
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => onSelectPoet('ghalib')}
              className="text-xs sm:text-sm font-serif font-bold tracking-widest text-[#C6A66B] uppercase hover:underline cursor-pointer"
            >
              — {dailySher.poet}
            </button>
            <span className="text-zinc-500">·</span>
            <span className="text-[11px] text-zinc-400 bg-[#0B0B0F] px-2 py-0.5 rounded border border-zinc-800">
              #{dailySher.mood}
            </span>
          </div>

          <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed pt-1">
            <strong className="text-zinc-300">Tashreeh: </strong>
            {dailySher.tashreeh}
          </p>
        </div>
      </section>

      {/* CORE PORTAL CARDS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 0: Shayari Library (Mood Ke Hisaab Se) */}
        <div
          onClick={() => onNavigateTab('library')}
          className="md:col-span-2 group cursor-pointer rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#59263C]/40 via-[#1C1724] to-[#15151C]/90 hover:from-[#59263C]/60 border border-[#C6A66B]/50 hover:border-[#C6A66B] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#59263C] to-[#C6A66B]/30 border border-[#C6A66B]/60 flex items-center justify-center text-[#C6A66B] shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-serif text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
                  Shayari Ki Dastgah &amp; Library
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C6A66B]/20 text-[#C6A66B] border border-[#C6A66B]/30">
                  New Feature
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                Ishq, Judai, Dard, Yaadein, Khuddaari aur Falsafa ke 60+ verified sher. Real-time search, audio pronunciation, aur Sher Card export ke sath.
              </p>
            </div>
          </div>
          <div className="self-end sm:self-center shrink-0">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C6A66B] hover:bg-[#D4B87D] text-slate-950 text-xs font-bold transition-all shadow-md">
              <span>Shayari Padhein</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* CARD 1: Writing Studio */}
        <div
          onClick={() => onNavigateTab('studio')}
          className="group cursor-pointer rounded-3xl p-6 sm:p-7 bg-[#15151C]/90 hover:bg-[#1a1721] border border-[#C6A66B]/25 hover:border-[#C6A66B] transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#59263C] to-[#15151C] border border-[#C6A66B]/40 flex items-center justify-center text-[#C6A66B] group-hover:scale-105 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
              Writing Studio (Likhein)
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Ghazal, Shayari, Nazm aur Punjabi song lyrics likhein. Radif-Qafiya guidance, rhyme dictionary, aur Sukhan AI assistance ke saath.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-[#C6A66B]">
            <span>Studio Kholein</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 2: Shayaron Ki Duniya */}
        <div
          onClick={() => onNavigateTab('poets')}
          className="group cursor-pointer rounded-3xl p-6 sm:p-7 bg-[#15151C]/90 hover:bg-[#1a1721] border border-[#C6A66B]/25 hover:border-[#C6A66B] transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3C1425] to-[#15151C] border border-[#C6A66B]/40 flex items-center justify-center text-[#C6A66B] group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
              Shayaron Ki Duniya (Library)
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Mirza Ghalib, Jaun Elia, Mir Taqi Mir, Faiz, Sahir, Faraz, Parveen Shakir, Kabir aur Bulleh Shah ka verified kalam aur mushkil lafzon ke maani.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-[#C6A66B]">
            <span>Library Dekhein</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Mood Ke Hisaab Se */}
        <div
          onClick={() => onNavigateTab('moods')}
          className="group cursor-pointer rounded-3xl p-6 sm:p-7 bg-[#15151C]/90 hover:bg-[#1a1721] border border-[#C6A66B]/25 hover:border-[#C6A66B] transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#59263C] to-[#15151C] border border-[#C6A66B]/40 flex items-center justify-center text-[#C6A66B] group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
              Mood Ke Hisaab Se (Ehsaas)
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Ishq, Judai, Tanhai, Yaadein, Dard, Umeed, Gussa aur Khuddaari ke 10 alag jazbaat par aadharit kalam aur writing prompts.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-[#C6A66B]">
            <span>Moods Explore Karein</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 4: Meri Diary (Personal Vault) */}
        <div
          onClick={() => onNavigateTab('vault')}
          className="group cursor-pointer rounded-3xl p-6 sm:p-7 bg-[#15151C]/90 hover:bg-[#1a1721] border border-[#C6A66B]/25 hover:border-[#C6A66B] transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3C1425] to-[#15151C] border border-[#C6A66B]/40 flex items-center justify-center text-[#C6A66B] group-hover:scale-105 transition-transform">
              <BookMarked className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-serif text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
              Meri Diary (Personal Vault)
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Aapke saved drafts, pasandeeda sher aur revision history. 100% offline, private aur phone ke storage me mahfooz.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-[#C6A66B]">
            <span>Diary Kholein</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* QUICK MOOD PILLS CAROUSEL */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6A66B]">
            Mood Ke Hisaab Se Chunein:
          </h3>
          <button
            onClick={() => onNavigateTab('moods')}
            className="text-xs text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer"
          >
            Sabhi 10 Moods Dekhein ➔
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOODS_DATA.slice(0, 7).map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMood(m.nameRoman)}
              className="px-4 py-2 rounded-xl bg-[#15151C] border border-zinc-800 hover:border-[#C6A66B]/50 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
              <span>{m.nameRoman}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED POETS HIGHLIGHT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif text-[#F2E9DC]">Shayar-e-Aazam</h3>
            <p className="text-xs text-zinc-400">Tareekh ke azeem shayar jinki shayari ne dunya badal di</p>
          </div>
          <button
            onClick={() => onNavigateTab('poets')}
            className="text-xs font-semibold text-[#C6A66B] hover:underline cursor-pointer"
          >
            Saare 12 Shayar ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {POETS_DATA.slice(0, 4).map((poet) => (
            <div
              key={poet.id}
              onClick={() => onSelectPoet(poet.id)}
              className="group cursor-pointer p-4 rounded-2xl bg-[#15151C]/80 border border-zinc-800 hover:border-[#C6A66B]/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#C6A66B] px-2 py-0.5 rounded bg-[#0B0B0F] border border-zinc-800">
                  {poet.era.split(' ')[0]}
                </span>
                <span className="text-[10px] text-zinc-500">{poet.eraDates}</span>
              </div>

              <div>
                <h4 className="text-base font-serif font-bold text-[#F2E9DC] group-hover:text-[#C6A66B] transition-colors">
                  {poet.nameRoman}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  "{poet.signatureCouplet[0]}"
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-[#C6A66B] font-semibold flex items-center justify-between">
                <span>Profile &amp; Kalam</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW LUXURY FEATURE HUBS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#C6A66B]/20 pb-2">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#FFF5EA]">
              Naye Shahi Features &amp; Adabi Tools
            </h3>
            <p className="text-xs text-zinc-400">
              Shayaron aur shauqeenon ke liye exclusive mauseeqi aur arooz tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Lughat */}
          <div
            onClick={() => onNavigateTab('dictionary')}
            className="group cursor-pointer p-5 rounded-2xl bg-[#15151C] border border-[#C6A66B]/30 hover:border-[#C6A66B] hover:shadow-xl hover:shadow-[#C6A66B]/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#59263C]/60 text-[#C6A66B] flex items-center justify-center border border-[#C6A66B]/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#FFF5EA] group-hover:text-[#C6A66B] transition-colors">
                Lughat (Dictionary)
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2">
                Urdu, Farsi aur Punjabi ke anmol alfaaz ke maani, talaffuz aur ash'aar.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-[#C6A66B] flex items-center gap-1">
              <span>Lughat Kholein</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Bahr & Arooz */}
          <div
            onClick={() => onNavigateTab('meter')}
            className="group cursor-pointer p-5 rounded-2xl bg-[#15151C] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#FFF5EA] group-hover:text-cyan-300 transition-colors">
                Bahr &amp; Arooz Analyzer
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2">
                Live Syllable Scansion (Taqti) tool jo aapke misre ka wazan aur Bahr match karta hai.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
              <span>Meter Janchein</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Tarannum Studio */}
          <div
            onClick={() => onNavigateTab('tarannum')}
            className="group cursor-pointer p-5 rounded-2xl bg-[#15151C] border border-amber-500/30 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#FFF5EA] group-hover:text-amber-300 transition-colors">
                Tarannum &amp; Tanpura
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2">
                Pure client-side acoustic Tanpura drone, Hindustani Taal metronome aur voice recorder.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
              <span>Riyaz Shuru Karein</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Quiz */}
          <div
            onClick={() => onNavigateTab('quiz')}
            className="group cursor-pointer p-5 rounded-2xl bg-[#15151C] border border-rose-500/30 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/10 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center border border-rose-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#FFF5EA] group-hover:text-rose-300 transition-colors">
                Pehchano Shayar Quiz
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-2">
                Ash'aar padhein, shayar pehchanein aur streak banakar XP points kamayein.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-rose-400 flex items-center gap-1">
              <span>Khel Shuru Karein</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ADAB GUIDE / WRITING RESOURCES BANNER */}
      <section className="rounded-3xl p-6 bg-gradient-to-r from-[#59263C]/20 via-[#15151C] to-[#C6A66B]/10 border border-[#C6A66B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B0B0F] border border-[#C6A66B]/40 text-[#C6A66B] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-serif font-bold text-[#FFF5EA]">
              Radif, Qafiya Aur Beher Guidance
            </h4>
            <p className="text-xs text-zinc-400">
              Shayari ke paimane aur Punjabi song structure ke niyam aasan Hinglish me samjhein.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('resources')}
          className="px-4 py-2 rounded-xl bg-[#C6A66B] text-slate-950 font-bold text-xs hover:brightness-110 transition-all shrink-0 cursor-pointer"
        >
          Adab Guide Kholein ➔
        </button>
      </section>
    </div>
  );
};
