import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { MediCoreDisclaimerModal } from "./components/MediCoreDisclaimerModal";
import { DiseaseMatrixModule } from "./components/DiseaseMatrixModule";
import { DrugVaultModule } from "./components/DrugVaultModule";
import { IvFluidsModule } from "./components/IvFluidsModule";
import { PharmacyMgmtModule } from "./components/PharmacyMgmtModule";
import { ClinicalCalculatorsModule } from "./components/ClinicalCalculatorsModule";
import { AnatomyVisualizer } from "./components/AnatomyVisualizer";
import { MediCoreTab } from "./types";
import { DISEASE_DATA } from "./data/diseaseData";
import { DRUG_DATA } from "./data/drugData";
import { IV_FLUIDS_DATA } from "./data/ivFluidsData";
import { RX_DECODER_DATA } from "./data/pharmacyRulesData";

export const MediCoreApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediCoreTab>("overview");
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("medicore_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check initial disclaimer modal acknowledgment
  useEffect(() => {
    const accepted = localStorage.getItem("medicore_disclaimer_accepted");
    if (!accepted) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("medicore_disclaimer_accepted", "true");
    setShowDisclaimer(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem("medicore_favorites", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Global search filtering across all catalogs
  const searchResults = useMemo(() => {
    if (!globalSearch.trim()) return null;
    const q = globalSearch.toLowerCase().trim();

    const matchedDiseases = DISEASE_DATA.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.definition.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedDrugs = DRUG_DATA.filter(
      dr =>
        dr.genericName.toLowerCase().includes(q) ||
        dr.commonIndianBrands.some(b => b.toLowerCase().includes(q)) ||
        dr.drugClass.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedFluids = IV_FLUIDS_DATA.filter(
      f =>
        f.name.toLowerCase().includes(q) ||
        f.indications.some(i => i.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedRx = RX_DECODER_DATA.filter(
      r =>
        r.abbreviation.toLowerCase().includes(q) ||
        r.englishMeaning.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      total: matchedDiseases.length + matchedDrugs.length + matchedFluids.length + matchedRx.length,
      diseases: matchedDiseases,
      drugs: matchedDrugs,
      fluids: matchedFluids,
      rx: matchedRx
    };
  }, [globalSearch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Compulsory Disclaimer Modal */}
      {showDisclaimer && (
        <MediCoreDisclaimerModal isOpen={showDisclaimer} onAccept={handleAcceptDisclaimer} />
      )}

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-teal-500/20 px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Clinical Title */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-xl">🩺</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    MediCore <span className="text-teal-400">Pro</span>
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    D-Pharma Clinical Desk
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Practical Reference &bull; Drug Vault &bull; IV Masterclass &bull; Clinic Ops
                </p>
              </div>
            </div>

            {/* Mobile Disclaimer & Ecosystem trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setShowDisclaimer(true)}
                className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-1 rounded-lg"
              >
                ⚠️ Notice
              </button>
              <a
                href="#"
                className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 hover:text-white"
              >
                Apps ⊞
              </a>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Quick search disease, brand, generic, IV fluid, or Rx..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs bg-slate-800 rounded px-1.5 py-0.5"
              >
                ✕
              </button>
            )}

            {/* Global Search Autocomplete Dropdown */}
            {searchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-teal-500/40 rounded-xl shadow-2xl p-3 z-50 max-h-96 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>Found {searchResults.total} matches</span>
                  <button onClick={() => setGlobalSearch("")} className="hover:text-white text-[10px]">Close</button>
                </div>

                {searchResults.diseases.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                      Diseases &amp; Conditions ({searchResults.diseases.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.diseases.map(d => (
                        <button
                          key={d.id}
                          onClick={() => {
                            setActiveTab("diseases");
                            setGlobalSearch("");
                          }}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-slate-800/80 text-xs flex justify-between items-center transition-colors"
                        >
                          <span className="text-slate-200 font-medium">{d.name}</span>
                          <span className="text-[10px] text-slate-400">{d.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.drugs.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      Drug Vault Formularies ({searchResults.drugs.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.drugs.map(dr => (
                        <button
                          key={dr.id}
                          onClick={() => {
                            setActiveTab("drugs");
                            setGlobalSearch("");
                          }}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-slate-800/80 text-xs flex justify-between items-center transition-colors"
                        >
                          <div>
                            <span className="text-white font-semibold">{dr.genericName}</span>
                            <span className="text-[10px] text-teal-300/80 ml-2">({dr.commonIndianBrands[0]})</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{dr.scheduleClass}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.fluids.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                      IV Fluids ({searchResults.fluids.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.fluids.map(f => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setActiveTab("iv-fluids");
                            setGlobalSearch("");
                          }}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-slate-800/80 text-xs flex justify-between items-center transition-colors"
                        >
                          <span className="text-white font-medium">{f.name}</span>
                          <span className="text-[10px] text-slate-400">{f.tonicity}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.rx.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Rx Abbreviations ({searchResults.rx.length})
                    </span>
                    <div className="space-y-1">
                      {searchResults.rx.map(r => (
                        <button
                          key={r.abbreviation}
                          onClick={() => {
                            setActiveTab("pharmacy");
                            setGlobalSearch("");
                          }}
                          className="w-full text-left p-1.5 rounded-lg hover:bg-slate-800/80 text-xs flex justify-between items-center transition-colors"
                        >
                          <span className="text-amber-300 font-mono font-bold">{r.abbreviation}</span>
                          <span className="text-[11px] text-slate-300">{r.englishMeaning}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Disclaimer badge & Ecosystem link */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setShowDisclaimer(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 transition-colors flex items-center gap-1.5"
            >
              <span>⚠️</span>
              <span>Clinical Disclaimer</span>
            </button>
            <a
              href="#"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>⊞</span>
              <span>All 42+ Apps</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-1">
          {[
            { id: "overview", label: "Overview & Triage", icon: "🏠" },
            { id: "diseases", label: "Diseases & Red Flags", icon: "🩺" },
            { id: "drugs", label: "Drug Vault", icon: "💊" },
            { id: "iv-fluids", label: "IV Fluids & Injections", icon: "💧" },
            { id: "pharmacy", label: "Dispensary & Schedules", icon: "🏪" },
            { id: "calculators", label: "Clinical Calculators", icon: "🧮" },
            { id: "anatomy", label: "Anatomy & Sites", icon: "🫀" },
            { id: "favorites", label: "Saved Bookmarks", icon: "⭐", count: favorites.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MediCoreTab)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === tab.id ? "bg-slate-950 text-teal-300" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* OVERVIEW & FAST TRIAGE TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-500/5 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
                  <span>MediCore Pro v2.4</span>
                  <span>•</span>
                  <span>100% Offline Clinical Reference Engine</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                  The Complete Clinical Companion for D-Pharma &amp; Primary Dispensary Care
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Engineered specifically for certified pharmacy owners, dispensary officers, and primary healthcare practitioners. Rapid access to disease red flags, Indian branded drugs, IV fluid osmolarity, Schedule H/H1 records, and emergency anaphylaxis protocols.
                </p>

                {/* Quick module launch buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab("diseases")}
                    className="p-3 bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xl block mb-1">🩺</span>
                    <span className="text-xs font-bold text-white group-hover:text-teal-300 block">Disease Matrix</span>
                    <span className="text-[10px] text-slate-400">15 Conditions &amp; Red Flags</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("drugs")}
                    className="p-3 bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xl block mb-1">💊</span>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">Drug Vault</span>
                    <span className="text-[10px] text-slate-400">Indian Brands &amp; Interactions</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("iv-fluids")}
                    className="p-3 bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xl block mb-1">💧</span>
                    <span className="text-xs font-bold text-white group-hover:text-blue-300 block">IV Masterclass</span>
                    <span className="text-[10px] text-slate-400">NS, RL, DNS &amp; Cannula</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("calculators")}
                    className="p-3 bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xl block mb-1">🧮</span>
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 block">Calculators</span>
                    <span className="text-[10px] text-slate-400">Paediatric, CrCl &amp; BSA</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Fast Emergency Triage & Red Flags Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🚨</span> Immediate Hospital Referral Red Flags (Pharmacy Triage)
                </h3>
                <span className="text-xs text-rose-400 font-semibold">Immediate Emergency Action</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-rose-500/40 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase">Dengue Hemorrhagic</span>
                    <span className="text-[10px] font-mono text-slate-400">Platelet &lt; 20,000/μL</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Sudden Bleeding or Severe Abdominal Pain</h4>
                  <p className="text-xs text-slate-300">
                    Epistaxis, melena (black tarry stool), hematemesis, or persistent vomiting. High risk of plasma leakage syndrome and Dengue Shock Syndrome (DSS).
                  </p>
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900 text-[11px] text-rose-300">
                    ⚠️ DO NOT give Aspirin, Brufen, or any NSAID. Immediate hospitalization for IV crystalloids (RL/NS) &amp; platelet monitoring.
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-rose-500/40 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase">Cardiac / ACS</span>
                    <span className="text-[10px] font-mono text-slate-400">Time = Myocardium</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Substernal Chest Pressure &gt; 15 mins</h4>
                  <p className="text-xs text-slate-300">
                    Crushing central retrosternal tightness radiating to left jaw or inner left arm, accompanied by diaphoresis (cold sweats) and nausea.
                  </p>
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900 text-[11px] text-rose-300">
                    🚨 Stat: Soluble Aspirin 300 mg chewable + Sorbitrate (if SBP &gt; 100) + Call 108 / Emergency EMS.
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-rose-500/40 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase">Respiratory Crisis</span>
                    <span className="text-[10px] font-mono text-slate-400">SpO2 &lt; 90%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Silent Chest / Inability to Complete Sentences</h4>
                  <p className="text-xs text-slate-300">
                    Severe asthma attack where wheezing ceases due to extreme airway bronchoconstriction (Silent Chest). Central cyanosis and sternal indrawing.
                  </p>
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900 text-[11px] text-rose-300">
                    🚨 Stat Salbutamol nebulization + High flow Oxygen + IV Hydrocortisone 100mg + Emergency transfer.
                  </div>
                </div>
              </div>
            </div>

            {/* Vital Signs Reference Desk */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span>📊</span> Clinical Normal Vital Signs Reference Range
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Baseline physiologic values for adult patients at rest in ambulatory care.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Blood Pressure</span>
                  <span className="text-lg font-black text-white font-mono">120/80</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">mmHg (Optimal)</span>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Pulse Rate</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">60 - 100</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">bpm (Regular)</span>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Respiratory Rate</span>
                  <span className="text-lg font-black text-teal-400 font-mono">12 - 20</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">breaths/min</span>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Oxygen Saturation</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">95 - 100%</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">SpO2 on room air</span>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Body Temperature</span>
                  <span className="text-lg font-black text-white font-mono">98.6°F</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">36.5 - 37.5°C</span>
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Random Blood Sugar</span>
                  <span className="text-lg font-black text-amber-300 font-mono">70 - 140</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">mg/dL (Normal)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 1: DISEASE MATRIX */}
        {activeTab === "diseases" && (
          <DiseaseMatrixModule
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* MODULE 2: DRUG VAULT */}
        {activeTab === "drugs" && (
          <DrugVaultModule
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* MODULE 3: IV FLUIDS & INJECTIONS */}
        {activeTab === "iv-fluids" && (
          <IvFluidsModule />
        )}

        {/* MODULE 4: PHARMACY & CLINIC MANAGEMENT */}
        {activeTab === "pharmacy" && <PharmacyMgmtModule />}

        {/* MODULE 5: CLINICAL CALCULATORS */}
        {activeTab === "calculators" && <ClinicalCalculatorsModule />}

        {/* MODULE 6: ANATOMY VISUALIZER */}
        {activeTab === "anatomy" && <AnatomyVisualizer />}

        {/* FAVORITES / BOOKMARKS TAB */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⭐</span> Saved Clinical Bookmarks ({favorites.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Quick access to diseases, drugs, and IV fluids you have pinned for everyday dispensary reference.
                  </p>
                </div>
                {favorites.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Clear all bookmarks?")) {
                        setFavorites([]);
                        localStorage.removeItem("medicore_favorites");
                      }
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-xl"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <span className="text-4xl block mb-2">📌</span>
                <p className="text-slate-300 font-medium text-sm">No bookmarked items yet</p>
                <p className="text-slate-500 text-xs mt-1">
                  Click the star icon (⭐) on any disease, drug, or IV fluid card to pin it here for instant offline access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map(id => {
                  const disease = DISEASE_DATA.find(d => d.id === id);
                  if (disease) {
                    return (
                      <div key={id} className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-teal-400 uppercase">Disease</span>
                          <button
                            onClick={() => toggleFavorite(id)}
                            className="text-amber-400 text-sm hover:scale-110"
                          >
                            ⭐
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">{disease.name}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2 mb-3">{disease.definition}</p>
                        <button
                          onClick={() => setActiveTab("diseases")}
                          className="text-xs text-cyan-400 hover:underline font-semibold"
                        >
                          View in Disease Matrix →
                        </button>
                      </div>
                    );
                  }

                  const drug = DRUG_DATA.find(dr => dr.id === id);
                  if (drug) {
                    return (
                      <div key={id} className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase">Drug</span>
                          <button
                            onClick={() => toggleFavorite(id)}
                            className="text-amber-400 text-sm hover:scale-110"
                          >
                            ⭐
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">{drug.genericName}</h4>
                        <div className="text-xs text-teal-300 mb-2">Brands: {drug.commonIndianBrands.join(", ")}</div>
                        <button
                          onClick={() => setActiveTab("drugs")}
                          className="text-xs text-teal-400 hover:underline font-semibold"
                        >
                          View in Drug Vault →
                        </button>
                      </div>
                    );
                  }

                  const fluid = IV_FLUIDS_DATA.find(f => f.id === id);
                  if (fluid) {
                    return (
                      <div key={id} className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-blue-400 uppercase">IV Fluid</span>
                          <button
                            onClick={() => toggleFavorite(id)}
                            className="text-amber-400 text-sm hover:scale-110"
                          >
                            ⭐
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">{fluid.name}</h4>
                        <p className="text-xs text-slate-300 mb-2">Tonicity: {fluid.tonicity}</p>
                        <button
                          onClick={() => setActiveTab("iv-fluids")}
                          className="text-xs text-blue-400 hover:underline font-semibold"
                        >
                          View in IV Masterclass →
                        </button>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-6 text-center text-xs text-slate-500">
        <p className="max-w-3xl mx-auto leading-relaxed">
          MediCore Pro is strictly an educational clinical reference and pharmacological decision-support guide for certified pharmacy and clinical professionals. Does NOT auto-prescribe or substitute individualized medical diagnosis.
        </p>
        <p className="mt-2 text-slate-600">
          MediCore Pro &bull; Ultimate Tech &amp; Clinical Ecosystem
        </p>
      </footer>
    </div>
  );
};
