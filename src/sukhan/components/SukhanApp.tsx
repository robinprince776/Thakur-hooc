import React, { useState } from 'react';
import {
  Compass,
  PenTool,
  BookOpen,
  BookMarked,
  Palette,
  Layers,
  Home,
  ArrowLeft,
  Grid,
  Menu,
  X,
  Sparkles,
  Heart,
  Activity,
  Music,
  HelpCircle,
  Award
} from 'lucide-react';
import { SukhanAppTab, PoetryDraft } from '../types';
import { SukhanPenIcon } from './SukhanPenIcon';
import { SukhanHome } from './SukhanHome';
import { SukhanWritingStudio } from './SukhanWritingStudio';
import { SukhanPoetsLibrary } from './SukhanPoetsLibrary';
import { SukhanMoodExplorer } from './SukhanMoodExplorer';
import { SukhanPersonalVault } from './SukhanPersonalVault';
import { SukhanCardDesigner } from './SukhanCardDesigner';
import { SukhanResources } from './SukhanResources';
import { SukhanShayariLibrary } from './SukhanShayariLibrary';
import { SukhanLughat } from './SukhanLughat';
import { SukhanMeterAnalyzer } from './SukhanMeterAnalyzer';
import { SukhanTarannumStudio } from './SukhanTarannumStudio';
import { SukhanQuiz } from './SukhanQuiz';

export interface SukhanAppProps {
  onBackToSuite?: () => void;
  onBackToBca?: () => void;
  onOpenCalcVault?: () => void;
  onOpenBcaVerse?: () => void;
  onOpenCompiler?: () => void;
  onOpenCyber?: () => void;
  onOpenAppSwitcher?: () => void;
}

export const SukhanApp: React.FC<SukhanAppProps> = ({
  onBackToSuite,
  onBackToBca,
  onOpenCalcVault,
  onOpenBcaVerse,
  onOpenCompiler: _onOpenCompiler,
  onOpenCyber: _onOpenCyber,
  onOpenAppSwitcher
}) => {
  const [activeTab, setActiveTab] = useState<SukhanAppTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cross-feature states
  const [cardDesignerPrefill, setCardDesignerPrefill] = useState<{
    text: string;
    attribution: string;
  }>({
    text: 'Hazaron khwahishen aisi ki har khwahish pe dam nikle,\nBohat nikle mere armaan lekin phir bhi kam nikle.',
    attribution: 'Mirza Ghalib'
  });

  const [studioPrefill, setStudioPrefill] = useState<{
    draft?: PoetryDraft | null;
    mood?: string;
    prompt?: string;
  }>({});

  const [selectedPoetId, setSelectedPoetId] = useState<string>('ghalib');

  const navItems = [
    { id: 'home' as SukhanAppTab, label: 'Lounge', icon: Home },
    { id: 'library' as SukhanAppTab, label: 'Shayari Library', icon: Sparkles },
    { id: 'studio' as SukhanAppTab, label: 'Writing Studio', icon: PenTool },
    { id: 'poets' as SukhanAppTab, label: 'Shayaron Ki Duniya', icon: BookOpen },
    { id: 'dictionary' as SukhanAppTab, label: 'Lughat (Dictionary)', icon: BookOpen },
    { id: 'meter' as SukhanAppTab, label: 'Bahr & Arooz', icon: Activity },
    { id: 'tarannum' as SukhanAppTab, label: 'Tarannum & Riyaz', icon: Music },
    { id: 'quiz' as SukhanAppTab, label: 'Pehchano Shayar', icon: Award },
    { id: 'moods' as SukhanAppTab, label: 'Mood Explorer', icon: Compass },
    { id: 'vault' as SukhanAppTab, label: 'Meri Diary', icon: BookMarked },
    { id: 'card-designer' as SukhanAppTab, label: 'Card Designer', icon: Palette },
    { id: 'resources' as SukhanAppTab, label: 'Adab Guide', icon: Layers }
  ];

  const handleOpenCardDesigner = (text: string, attribution: string) => {
    setCardDesignerPrefill({ text, attribution });
    setActiveTab('card-designer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMoodForStudio = (moodName: string, prompt?: string) => {
    setStudioPrefill({ mood: moodName, prompt: prompt || '' });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDraftInStudio = (draft: PoetryDraft) => {
    setStudioPrefill({ draft });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPoet = (poetId: string) => {
    setSelectedPoetId(poetId);
    setActiveTab('poets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMood = (moodName: string) => {
    setActiveTab('moods');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = (draft: PoetryDraft) => {
    try {
      const saved = localStorage.getItem('sukhan_personal_vault_v1');
      const parsed: PoetryDraft[] = saved ? JSON.parse(saved) : [];
      const updated = [draft, ...parsed.filter((d) => d.id !== draft.id)];
      localStorage.setItem('sukhan_personal_vault_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F2E9DC] flex flex-col font-sans select-none antialiased">
      {/* Top Luxury Obsidian Glass Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0B0B0F]/90 backdrop-blur-xl border-b border-[#C6A66B]/25 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 group text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#59263C] via-[#3C1425] to-[#15151C] border border-[#C6A66B]/50 flex items-center justify-center text-[#C6A66B] shadow-lg shadow-[#59263C]/30 group-hover:scale-105 transition-transform">
                  <SukhanPenIcon size={22} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-serif font-bold tracking-widest text-[#FFF5EA]">
                      SUKHAN
                    </span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#59263C]/40 text-[#C6A66B] border border-[#C6A66B]/30">
                      By Prince Thakur
                    </span>
                  </div>
                  <span className="text-[11px] font-serif italic text-zinc-400 hidden xs:block">
                    Alfaaz, Ehsaas Aur Adab
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#59263C]/30 text-[#C6A66B] border border-[#C6A66B]/40 shadow-xs'
                        : 'text-zinc-400 hover:text-[#F2E9DC] hover:bg-[#15151C]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6A66B]' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: App Switcher & Mobile Menu Trigger */}
            <div className="flex items-center gap-2">
              {/* Suite Switcher Button */}
              {onOpenAppSwitcher && (
                <button
                  onClick={onOpenAppSwitcher}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15151C] hover:bg-[#1f1b26] border border-[#C6A66B]/30 hover:border-[#C6A66B] text-xs font-semibold text-[#F2E9DC] transition-all cursor-pointer shadow-xs"
                  title="Switch between BCA Verse, CalcVault, SUKHAN & C Compiler"
                >
                  <Grid className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span className="hidden sm:inline">4-Apps Suite</span>
                </button>
              )}

              {/* Direct Quick Return to BCA Verse */}
              {onOpenBcaVerse && (
                <button
                  onClick={onOpenBcaVerse}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#15151C] border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-all cursor-pointer"
                  title="Return to BCA Verse study suite"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BCA Verse</span>
                </button>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#15151C] transition-colors cursor-pointer"
                aria-label="Open Sukhan mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#C6A66B]/20 bg-[#0B0B0F]/98 backdrop-blur-2xl px-4 py-4 space-y-1.5 shadow-2xl">
            <div className="pb-2 mb-2 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-serif italic">Alfaaz, Ehsaas Aur Adab</span>
              <span className="font-bold text-[#C6A66B]">Made by Prince Thakur</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#59263C]/30 text-[#C6A66B] border border-[#C6A66B]/40'
                      : 'text-zinc-400 hover:text-white hover:bg-[#15151C]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C6A66B]' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Quick Suite Jump in Mobile Menu */}
            <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
              {onOpenAppSwitcher && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAppSwitcher();
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#59263C] to-[#15151C] border border-[#C6A66B]/30 text-xs font-bold text-[#FFF5EA] text-center cursor-pointer"
                >
                  Switch App (3-Apps Suite)
                </button>
              )}

              {onOpenBcaVerse && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBcaVerse();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#15151C] border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                >
                  BCA Verse
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <SukhanHome
            onNavigateTab={setActiveTab}
            onOpenCardDesigner={handleOpenCardDesigner}
            onSelectPoet={handleSelectPoet}
            onSelectMood={handleSelectMood}
          />
        )}

        {activeTab === 'library' && (
          <SukhanShayariLibrary
            onOpenCardDesigner={handleOpenCardDesigner}
            onSelectMoodForStudio={handleSelectMoodForStudio}
          />
        )}

        {activeTab === 'studio' && (
          <SukhanWritingStudio
            initialDraft={studioPrefill.draft}
            initialMood={studioPrefill.mood}
            initialPrompt={studioPrefill.prompt}
            onSaveDraftToVault={handleSaveDraft}
            onOpenCardDesigner={handleOpenCardDesigner}
          />
        )}

        {activeTab === 'poets' && (
          <SukhanPoetsLibrary
            initialPoetId={selectedPoetId}
            onOpenCardDesigner={handleOpenCardDesigner}
            onSelectMood={handleSelectMood}
          />
        )}

        {activeTab === 'moods' && (
          <SukhanMoodExplorer
            onSelectMoodForStudio={handleSelectMoodForStudio}
            onOpenCardDesigner={handleOpenCardDesigner}
            onSelectPoet={handleSelectPoet}
          />
        )}

        {activeTab === 'vault' && (
          <SukhanPersonalVault
            onOpenDraftInStudio={handleOpenDraftInStudio}
            onOpenCardDesigner={handleOpenCardDesigner}
          />
        )}

        {activeTab === 'card-designer' && (
          <SukhanCardDesigner
            initialText={cardDesignerPrefill.text}
            initialAttribution={cardDesignerPrefill.attribution}
          />
        )}

        {activeTab === 'dictionary' && (
          <SukhanLughat
            onInsertIntoStudio={(word) => {
              setStudioPrefill((prev) => ({
                ...prev,
                prompt: prev.prompt ? `${prev.prompt} ${word}` : word
              }));
              setActiveTab('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCardDesigner={handleOpenCardDesigner}
          />
        )}

        {activeTab === 'meter' && (
          <SukhanMeterAnalyzer
            onInsertTemplateIntoStudio={(meterName, pattern) => {
              setStudioPrefill((prev) => ({
                ...prev,
                prompt: `// Bahr: ${meterName} (${pattern})\n\n`
              }));
              setActiveTab('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCardDesigner={handleOpenCardDesigner}
          />
        )}

        {activeTab === 'tarannum' && <SukhanTarannumStudio />}

        {activeTab === 'quiz' && (
          <SukhanQuiz onOpenCardDesigner={handleOpenCardDesigner} />
        )}

        {activeTab === 'resources' && <SukhanResources />}
      </main>

      {/* Luxury Obsidian Footer */}
      <footer className="border-t border-[#C6A66B]/20 bg-[#0B0B0F] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-serif font-bold text-[#F2E9DC] tracking-wider">
              SUKHAN
            </span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span className="italic font-serif">Alfaaz, Ehsaas Aur Adab</span>
            <span className="hidden sm:inline text-zinc-700">·</span>
            <span className="text-[#C6A66B] font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#C6A66B] fill-[#C6A66B]" />
              <span>Made by Prince Thakur</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('studio')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Writing Studio
            </button>
            <button
              onClick={() => setActiveTab('poets')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Shayaron Ki Duniya
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Lughat
            </button>
            <button
              onClick={() => setActiveTab('meter')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Bahr & Arooz
            </button>
            <button
              onClick={() => setActiveTab('tarannum')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Tarannum
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className="hover:text-[#C6A66B] transition-colors cursor-pointer"
            >
              Meri Diary
            </button>
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="text-[#C6A66B] font-bold hover:underline cursor-pointer"
              >
                App Suite (42 Apps)
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
