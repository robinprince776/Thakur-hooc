import React, { useState, useMemo } from "react";
import { RX_DECODER_DATA, PHARMACY_RULES_DATA } from "../data/pharmacyRulesData";
import { RxTerm, PharmacyRuleTopic } from "../types";

export const PharmacyMgmtModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"rx" | "rules" | "anaphylaxis" | "coldchain">("rx");
  const [rxSearch, setRxSearch] = useState("");
  const [selectedRxCat, setSelectedRxCat] = useState<string>("All");
  const [checkedChecklist, setCheckedChecklist] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRx = useMemo(() => {
    return RX_DECODER_DATA.filter(term => {
      const matchCat = selectedRxCat === "All" || term.category === selectedRxCat;
      const q = rxSearch.toLowerCase();
      const matchSearch =
        term.abbreviation.toLowerCase().includes(q) ||
        term.englishMeaning.toLowerCase().includes(q) ||
        term.hinglishMeaning.toLowerCase().includes(q) ||
        (term.latinTerm && term.latinTerm.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [rxSearch, selectedRxCat]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
              <span>🏪 Module 4</span>
              <span>•</span>
              <span>Pharmacy & Clinic Operations</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Pharmacy & Dispensary Management Masterclass
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Practical operational handbook for D-Pharma professionals, medical stores, and clinic setups. Rx abbreviations, schedule compliances, FEFO protocols, cold-chain safety, and emergency crash cart.
            </p>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
            {[
              { id: "rx", label: "Rx Decoder", icon: "📝" },
              { id: "rules", label: "Schedules & FEFO", icon: "⚖️" },
              { id: "coldchain", label: "Cold Chain 2-8°C", icon: "❄️" },
              { id: "anaphylaxis", label: "Emergency Kit", icon: "🚨" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeSubTab === tab.id
                    ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: RX DECODER */}
      {activeSubTab === "rx" && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search prescription abbreviation (e.g., OD, BD, SOS, Stat, AC)..."
                value={rxSearch}
                onChange={e => setRxSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
              <span className="absolute left-3.5 top-3 text-slate-500 text-sm">🔍</span>
              {rxSearch && (
                <button
                  onClick={() => setRxSearch("")}
                  className="absolute right-3.5 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["All", "Frequency", "Timing", "Route", "Quantity & Special"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedRxCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedRxCat === cat
                      ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-semibold"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick clinical tip banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-l-4 border-amber-500 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="text-xs text-slate-300">
              <strong className="text-amber-400 font-bold block mb-0.5">High-Alert Safety Rule (Do-Not-Use List):</strong>
              Never confuse <strong>QD (every day)</strong> with <strong>QOD (every other day)</strong> or <strong>U (units)</strong> with <strong>0 (zero)</strong>. Always verify unclear handwritings with the prescribing physician before dispensing.
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredRx.map(item => (
              <div
                key={item.abbreviation}
                className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black font-mono text-teal-400 tracking-wider group-hover:text-cyan-300 transition-colors">
                      {item.abbreviation}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      {item.category}
                    </span>
                  </div>

                  {item.latinTerm && (
                    <p className="text-[11px] text-slate-400 italic mb-1.5">
                      Latin: <span className="text-slate-300">{item.latinTerm}</span>
                    </p>
                  )}

                  <div className="text-sm font-semibold text-white mb-1">
                    {item.englishMeaning}
                  </div>

                  <div className="text-xs text-teal-300/90 font-medium bg-teal-950/40 border border-teal-800/40 rounded-lg p-2 mb-2">
                    💬 <span className="italic">{item.hinglishMeaning}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span className="text-slate-500">Example:</span>
                  <span className="text-cyan-400 font-medium">{item.exampleRx}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredRx.length === 0 && (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-slate-400 text-sm">No matching Rx terms found for &quot;{rxSearch}&quot;</p>
              <button
                onClick={() => { setRxSearch(""); setSelectedRxCat("All"); }}
                className="mt-3 text-xs text-teal-400 underline hover:text-teal-300"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: RULES, SCHEDULES & FEFO */}
      {activeSubTab === "rules" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PHARMACY_RULES_DATA.map(rule => (
              <div
                key={rule.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-teal-500/20">
                      {rule.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Rule ID: {rule.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{rule.title}</h3>
                  <p className="text-xs text-teal-300/80 mb-3">{rule.subtitle}</p>

                  <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 mb-3">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Key Mandates & Protocols:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {rule.keyRules.map((k, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-teal-400 text-[10px] mt-0.5">▶</span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-400 mb-3">
                    <strong className="text-slate-200">Clinical Impact:</strong> {rule.clinicalSignificance}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Operational Checklist:
                  </span>
                  <div className="space-y-1.5">
                    {rule.checklistOrSteps.map((step, idx) => {
                      const checkKey = `${rule.id}-${idx}`;
                      const isChecked = !!checkedChecklist[checkKey];
                      return (
                        <label
                          key={idx}
                          onClick={() => toggleCheck(checkKey)}
                          className={`flex items-start gap-2 p-1.5 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                            isChecked ? "bg-teal-950/40 text-teal-300 line-through" : "text-slate-300 hover:bg-slate-800/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded accent-teal-500"
                          />
                          <span>{step}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule H & H1 Comparison Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>⚖️</span> Schedule H vs Schedule H1: Regulatory Distinction (India D&C Act)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Under the Drugs & Cosmetics Rules, 1945, dispensing without a registered medical practitioner&apos;s prescription is a punishable offense.
            </p>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-950/60 text-slate-300">
                  <th className="py-2.5 px-3 font-semibold">Parameter</th>
                  <th className="py-2.5 px-3 font-semibold text-amber-300">Schedule H</th>
                  <th className="py-2.5 px-3 font-semibold text-rose-300">Schedule H1 (High Resistance/Abuse)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Warning Label</td>
                  <td className="py-2.5 px-3">Rx symbol in red box; &quot;To be sold by retail on prescription only&quot;</td>
                  <td className="py-2.5 px-3 text-rose-300 font-semibold">Rx with distinct RED vertical line on left border &amp; box warning</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Register Mandate</td>
                  <td className="py-2.5 px-3">Standard sales bill record</td>
                  <td className="py-2.5 px-3 text-amber-200">Mandatory separate Schedule H1 Register kept for 3 years</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Log Details Required</td>
                  <td className="py-2.5 px-3">Patient name, Doctor name, quantity</td>
                  <td className="py-2.5 px-3">Patient name, address, Doctor name & reg no, Batch no, quantity, date</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Typical Drug Classes</td>
                  <td className="py-2.5 px-3">Standard antibiotics, antihypertensives, NSAIDs (e.g. Paracetamol combinations, Amoxicillin)</td>
                  <td className="py-2.5 px-3">3rd/4th Gen Cephalosporins (Cefixime, Cefpodoxime), Carbapenems (Meropenem), Zolpidem, Alprazolam, Tramadol</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COLD CHAIN SAFETY */}
      {activeSubTab === "coldchain" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl text-cyan-300">
                ❄️
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cold Chain Management (2°C to 8°C)</h3>
                <p className="text-xs text-cyan-300/80">Maintaining thermodynamic stability of thermolabile biologics</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Biologics, insulins, vaccines, and monoclonal antibodies lose tertiary protein structures irreversibly when exposed to temperatures &gt; 8°C or freezing (&lt; 0°C). Pharmacists must guarantee temperature maintenance from manufacturer to customer hands.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Target Storage Zone</span>
                <span className="text-2xl font-black text-cyan-400">+2°C to +8°C</span>
                <p className="text-xs text-slate-400 mt-2">
                  Never freeze insulins or tetanus toxoids. Freezing precipitates proteins and destroys adjuvant lattice.
                </p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Logging Protocol</span>
                <span className="text-2xl font-black text-teal-400">Twice Daily (Bid)</span>
                <p className="text-xs text-slate-400 mt-2">
                  Morning (09:00 AM) and Evening (06:00 PM) calibrated digital thermometer readings logged in physical/digital ledger.
                </p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <span className="text-xs text-slate-400 font-semibold block mb-1">Dispensing Packaging</span>
                <span className="text-2xl font-black text-amber-400">Gel Ice Packs</span>
                <p className="text-xs text-slate-400 mt-2">
                  Wrap insulin with bubble wrap; never place directly touching frozen ice packs to prevent accidental contact freezing.
                </p>
              </div>
            </div>

            {/* Storage Placement diagram */}
            <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span>🧊</span> ILR (Ice Lined Refrigerator) Shelf Hierarchy
              </h4>
              <div className="space-y-2.5">
                <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-300 block">Top Shelf / Freeze-Resistant Tier</span>
                    <span className="text-xs text-slate-300">OPV (Oral Polio Vaccine), Measles / MMR, Yellow Fever</span>
                  </div>
                  <span className="text-xs text-blue-400 font-mono">-15°C to -25°C or +2°C to +8°C</span>
                </div>
                <div className="p-3 bg-teal-950/30 border border-teal-800/40 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-300 block">Middle Shelf / Stable Cold Tier</span>
                    <span className="text-xs text-slate-300">Insulins (Regular, NPH, Glargine), Rabies Vaccine, Hepatitis B, Tetanus (TT)</span>
                  </div>
                  <span className="text-xs text-teal-400 font-mono">+2°C to +8°C (Ideal)</span>
                </div>
                <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-300 block">Bottom / Floor Warning Zone</span>
                    <span className="text-xs text-slate-300">Diluents &amp; water bottles to stabilize thermal inertia during power cuts</span>
                  </div>
                  <span className="text-xs text-rose-400 font-mono">NEVER on door racks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ANAPHYLAXIS & EMERGENCY KIT */}
      {activeSubTab === "anaphylaxis" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-xl text-rose-400">
                🚨
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Clinic Emergency Anaphylaxis Crash Box</h3>
                <p className="text-xs text-rose-300/80">Immediate life-saving protocol for severe drug or vaccine allergy</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Severe anaphylaxis causes sudden airway edema, bronchospasm, and distributive shock within minutes of injection or drug administration. Every dispensary and clinic must maintain a dedicated, unexpired emergency tray.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critical Drug 1: Adrenaline */}
              <div className="bg-slate-950/90 border-2 border-rose-500/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-rose-400 font-black text-sm uppercase tracking-wide">First-Line Lifesaver</span>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                    NO CONTRAINDICATION IN ANAPHYLAXIS
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">Adrenaline (Epinephrine) 1:1000 (1 mg/mL)</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p><strong className="text-slate-100">Adult Dose:</strong> 0.5 mg (0.5 mL of 1:1000) IM into anterolateral thigh.</p>
                  <p><strong className="text-slate-100">Paediatric Dose:</strong> 0.01 mg/kg (max 0.3 mg) IM.</p>
                  <p><strong className="text-slate-100">Repeat:</strong> Every 5 to 15 minutes if no clinical response.</p>
                  <p><strong className="text-rose-400">Mechanism:</strong> Alpha-1 vasoconstriction (reverses shock/edema) + Beta-2 bronchodilation.</p>
                </div>
              </div>

              {/* Critical Drug 2: Hydrocortisone */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wide block mb-1">Second-Line / Biphasic Prevention</span>
                <h4 className="text-base font-bold text-white">Hydrocortisone Sodium Succinate (100 mg / 200 mg)</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p><strong className="text-slate-100">Route:</strong> Slow IV or IM injection.</p>
                  <p><strong className="text-slate-100">Adult Dose:</strong> 100 mg to 200 mg stat.</p>
                  <p><strong className="text-slate-100">Onset:</strong> 4 to 6 hours (does NOT replace Adrenaline for acute airway compromise).</p>
                  <p><strong className="text-slate-400">Purpose:</strong> Prevents delayed recurrence (biphasic anaphylaxis) 6-12 hours later.</p>
                </div>
              </div>

              {/* Critical Drug 3: Antihistamines */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                <span className="text-teal-400 font-bold text-xs uppercase tracking-wide block mb-1">H1 / H2 Blocker</span>
                <h4 className="text-base font-bold text-white">Chlorpheniramine (10 mg) / Pheniramine (Avil)</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p><strong className="text-slate-100">Route:</strong> Slow IV or IM.</p>
                  <p><strong className="text-slate-100">Purpose:</strong> Relieves cutaneous symptoms (urticaria, itching, angioedema).</p>
                  <p><strong className="text-slate-400">Caution:</strong> Rapid IV push may cause hypotension.</p>
                </div>
              </div>

              {/* Airway & Fluids */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                <span className="text-cyan-400 font-bold text-xs uppercase tracking-wide block mb-1">Airway &amp; Circulation</span>
                <h4 className="text-base font-bold text-white">High Flow Oxygen + Normal Saline 0.9% IV</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p><strong className="text-slate-100">Oxygen:</strong> 10-15 L/min via Non-rebreather mask (NRBM).</p>
                  <p><strong className="text-slate-100">IV Fluid Bolus:</strong> 500 mL - 1000 mL Normal Saline rapidly to support vascular collapse.</p>
                  <p><strong className="text-slate-100">Positioning:</strong> Lie flat with legs elevated (Trendelenburg). Do not stand patient up.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
