import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Search,
  AlertTriangle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Activity,
  CheckCircle2,
  FileText,
  ShieldAlert,
  Flame,
  Info
} from 'lucide-react';
import { DISEASES_DATA } from '../data/diseaseData';
import { DiseaseItem } from '../types';

interface DiseaseMatrixModuleProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  initialSearchQuery?: string;
}

export const DiseaseMatrixModule: React.FC<DiseaseMatrixModuleProps> = ({
  favorites,
  onToggleFavorite,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string | null>('dengue');

  const categories = [
    'All',
    'Viral & Bacterial',
    'Respiratory',
    'Gastrointestinal',
    'Metabolic & Blood',
    'Pain & Dermatology'
  ];

  const filteredDiseases = useMemo(() => {
    return DISEASES_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.clinicalSymptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Module Intro Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Stethoscope className="w-3 h-3" />
            <span>Module 1 · Clinical Pathology</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Disease &amp; Symptom Matrix
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Etiology, clinical manifestations, OTC supportive guidelines, and life-saving red flags
            for high-risk referral.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-3 shrink-0">
          <div className="text-center px-2">
            <span className="block text-xl font-mono font-black text-teal-400">
              {DISEASES_DATA.length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Conditions</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="block text-xl font-mono font-black text-rose-400">
              {DISEASES_DATA.reduce((acc, d) => acc + d.redFlags.length, 0)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Red Flags</span>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filter Chips */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disease, symptom, or pathogen (e.g. Platelets, Wheeze, Melena, Dengue)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-teal-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease List Cards */}
      <div className="space-y-4">
        {filteredDiseases.map((disease) => {
          const isExpanded = expandedDiseaseId === disease.id;
          const isFav = favorites.includes(disease.id);

          return (
            <div
              key={disease.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-teal-500/50 shadow-xl shadow-teal-500/5 ring-1 ring-teal-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Strip */}
              <div
                onClick={() => setExpandedDiseaseId(isExpanded ? null : disease.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isExpanded
                        ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        {disease.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-teal-400 border border-slate-700">
                        {disease.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {disease.definition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(disease.id);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isFav
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                    title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                  >
                    <Bookmark className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Clinical Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-fade-in text-xs sm:text-sm">
                  {/* Definition & Etiology */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Clinical Definition:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">{disease.definition}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Etiology &amp; Risk Causes:</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {disease.causes.map((c, idx) => (
                          <li key={idx} className="leading-snug">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Clinical Symptoms */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Clinical Manifestations &amp; Symptoms:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {disease.clinicalSymptoms.map((sym, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                          <span>{sym}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CRITICAL: RED FLAGS (EMERGENCY REFERRAL WARNINGS) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950 border-2 border-rose-500/50 shadow-lg shadow-rose-950/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-black tracking-widest text-rose-400 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                        <span>RED FLAGS (Immediate Hospital / ER Referral Signs):</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Urgent Attention
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {disease.redFlags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-200 text-xs font-medium"
                        >
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OTC & Supportive Care & Lifestyle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>OTC Care &amp; Supportive Therapy:</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {disease.otcCareAndSupportive.map((care, idx) => (
                          <li
                            key={idx}
                            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800"
                          >
                            {care}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Recommended Lab Investigations:</span>
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {disease.investigations.map((inv, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{inv}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                          Lifestyle &amp; Prevention Advice:
                        </span>
                        <div className="space-y-1 text-xs text-slate-400">
                          {disease.lifestyleAdvice.map((adv, idx) => (
                            <p key={idx} className="leading-tight">
                              • {adv}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
