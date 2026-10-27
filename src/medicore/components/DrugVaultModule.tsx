import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  AlertTriangle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Zap,
  Info,
  Layers,
  UtensilsCrossed,
  Clock,
  Sparkles
} from 'lucide-react';
import { DRUGS_DATA } from '../data/drugData';
import { DrugItem } from '../types';

interface DrugVaultModuleProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  initialSearchQuery?: string;
}

export const DrugVaultModule: React.FC<DrugVaultModuleProps> = ({
  favorites,
  onToggleFavorite,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [expandedDrugId, setExpandedDrugId] = useState<string | null>('amox-clav');

  const drugClasses = [
    'All',
    'Analgesics (NSAIDs / Antipyretic)',
    'Antibiotics',
    'Antacids & Anti-ulcer',
    'Antihistamines',
    'Antidiabetics',
    'Cardiovascular & Antihypertensive'
  ];

  const filteredDrugs = useMemo(() => {
    return DRUGS_DATA.filter((drug) => {
      const matchesClass = selectedClass === 'All' || drug.drugClass === selectedClass;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        drug.genericName.toLowerCase().includes(q) ||
        drug.commonIndianBrands.some((b) => b.toLowerCase().includes(q)) ||
        drug.drugClass.toLowerCase().includes(q) ||
        drug.mechanism.toLowerCase().includes(q) ||
        drug.drugInteractions.some((i) => i.drug.toLowerCase().includes(q) || i.risk.toLowerCase().includes(q));

      return matchesClass && matchesSearch;
    });
  }, [searchQuery, selectedClass]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Pill className="w-3 h-3" />
            <span>Module 2 · Pharmacopeia Database</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Drug Vault (Indian Formulary)
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Mechanisms of action, standard adult reference dosages, schedule laws, and life-critical
            drug-drug and food-drug interaction alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-3 shrink-0">
          <div className="text-center px-2">
            <span className="block text-xl font-mono font-black text-blue-400">
              {DRUGS_DATA.length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Molecules</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center px-2">
            <span className="block text-xl font-mono font-black text-amber-400">
              {DRUGS_DATA.reduce((acc, d) => acc + d.commonIndianBrands.length, 0)}+
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Top Brands</span>
          </div>
        </div>
      </div>

      {/* Search & Class Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search generic name, Indian brand (e.g. Dolo 650, Augmentin, Pan-D, Ciplox)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {drugClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cls.replace(' (NSAIDs / Antipyretic)', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Drug Cards Accordion */}
      <div className="space-y-4">
        {filteredDrugs.map((drug) => {
          const isExpanded = expandedDrugId === drug.id;
          const isFav = favorites.includes(drug.id);

          return (
            <div
              key={drug.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-blue-500/50 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header Strip */}
              <div
                onClick={() => setExpandedDrugId(isExpanded ? null : drug.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isExpanded
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        {drug.genericName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-blue-400 border border-slate-700">
                        {drug.drugClass}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          drug.scheduleClass === 'Schedule H1'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : drug.scheduleClass === 'Schedule H'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {drug.scheduleClass}
                      </span>
                    </div>

                    {/* Common Indian Brands */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-400">
                      <span className="text-slate-500 font-semibold text-[11px]">Popular Brands:</span>
                      {drug.commonIndianBrands.map((brand, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700/60 text-[11px] font-medium"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Pregnancy Category Badge */}
                  <span
                    className={`hidden sm:inline-flex px-2 py-1 rounded-xl text-xs font-mono font-bold border ${
                      drug.pregnancyCategory === 'A' || drug.pregnancyCategory === 'B'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : drug.pregnancyCategory === 'C'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                    }`}
                    title={`Pregnancy Safety Category ${drug.pregnancyCategory}`}
                  >
                    Preg: Cat {drug.pregnancyCategory}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(drug.id);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isFav
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Drug Dossier */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-fade-in text-xs sm:text-sm">
                  {/* Mechanism & Standard Dosage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Mechanism of Action (Pharmacodynamics):</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">{drug.mechanism}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Standard Adult Dosage (Reference Only):</span>
                      </span>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {drug.standardAdultDosage}
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        *Strictly for clinical reference. Tailor according to renal/hepatic clearance.
                      </p>
                    </div>
                  </div>

                  {/* Contraindications & Side Effects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/30 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Contraindications (Do NOT Dispense):</span>
                      </span>
                      <ul className="space-y-1 text-xs text-rose-200">
                        {drug.contraindications.map((ci, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{ci}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Adverse Reactions &amp; Side Effects:</span>
                      </span>
                      <div className="space-y-1 text-xs text-slate-300">
                        <p>
                          <strong className="text-slate-400">Common:</strong>{' '}
                          {drug.commonSideEffects.join(', ')}
                        </p>
                        <p className="text-rose-300">
                          <strong className="text-rose-400">Serious:</strong>{' '}
                          {drug.seriousAdverseEffects.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ⚠️ CRITICAL: DRUG-DRUG INTERACTIONS */}
                  <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/40 space-y-2">
                    <span className="text-xs uppercase font-black tracking-widest text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Major Drug-Drug Interactions (Clinical Hazards):</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {drug.drugInteractions.map((inter, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{inter.drug}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                inter.severity === 'High'
                                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {inter.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-tight">{inter.risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ⚠️ FOOD-DRUG INTERACTIONS & STORAGE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Food &amp; Beverage Interactions:</span>
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {drug.foodInteractions.map((fi, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {fi}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Storage &amp; Dispensing Law:</span>
                      </span>
                      <p className="text-xs text-slate-300">{drug.storageInstructions}</p>
                      <p className="text-xs text-slate-400 pt-1">
                        Schedule:{' '}
                        <span className="text-white font-semibold">{drug.scheduleClass}</span>{' '}
                        (Requires verified doctor prescription &amp; entry in register where applicable).
                      </p>
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
