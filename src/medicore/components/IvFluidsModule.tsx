import React, { useState, useMemo } from 'react';
import {
  Droplets,
  Syringe,
  Activity,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';
import { IV_FLUIDS_DATA, CANNULA_SPECS, INJECTION_ANGLES } from '../data/ivFluidsData';
import { IvFluidItem, CannulaSpec, InjectionAngleSpec } from '../types';

export const IvFluidsModule: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'fluids' | 'cannula' | 'injections' | 'calculator'>('fluids');
  const [selectedFluidId, setSelectedFluidId] = useState<string>('rl');

  // IV Drip Calculator States
  const [volumeMl, setVolumeMl] = useState<number>(500);
  const [timeUnit, setTimeUnit] = useState<'hours' | 'minutes'>('hours');
  const [timeValue, setTimeValue] = useState<number>(4); // 4 hours
  const [dropFactor, setDropFactor] = useState<number>(20); // 20 drops/mL standard macro

  // Calculation logic
  const dripCalculation = useMemo(() => {
    const totalMinutes = timeUnit === 'hours' ? Math.max(timeValue * 60, 1) : Math.max(timeValue, 1);
    const totalVolume = Math.max(volumeMl, 1);
    // Formula: Drops/min = (Volume in mL * Drop Factor) / Time in minutes
    const dropsPerMin = Math.round((totalVolume * dropFactor) / totalMinutes);
    const mlPerHour = Math.round((totalVolume / (totalMinutes / 60)) * 10) / 10;
    const secondsPerDrop = dropsPerMin > 0 ? Math.round((60 / dropsPerMin) * 10) / 10 : 0;

    return {
      dropsPerMin,
      mlPerHour,
      secondsPerDrop,
      totalMinutes
    };
  }, [volumeMl, timeUnit, timeValue, dropFactor]);

  const activeFluid = IV_FLUIDS_DATA.find((f) => f.id === selectedFluidId) || IV_FLUIDS_DATA[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Droplets className="w-3 h-3" />
            <span>Module 3 · Intravenous Therapy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            IV Fluids &amp; Injection Masterclass
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Electrolyte osmolar compositions, color-coded cannula flow rates, injection angles, and
            real-time infusion drip rate calculator.
          </p>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedSubTab('fluids')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedSubTab === 'fluids'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IV Fluids
          </button>
          <button
            onClick={() => setSelectedSubTab('cannula')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedSubTab === 'cannula'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cannula Guide
          </button>
          <button
            onClick={() => setSelectedSubTab('injections')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedSubTab === 'injections'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Injection Angles
          </button>
          <button
            onClick={() => setSelectedSubTab('calculator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              selectedSubTab === 'calculator'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-teal-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Drip Calculator</span>
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: IV FLUIDS COMPOSITION & INDICATIONS --- */}
      {selectedSubTab === 'fluids' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {IV_FLUIDS_DATA.map((fluid) => (
              <button
                key={fluid.id}
                onClick={() => setSelectedFluidId(fluid.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedFluidId === fluid.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {fluid.name}
              </button>
            ))}
          </div>

          {/* Active Fluid Detail Card */}
          <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{activeFluid.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      activeFluid.tonicity === 'Isotonic'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : activeFluid.tonicity === 'Hypertonic'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-blue-950 text-blue-300 border-blue-800'
                    }`}
                  >
                    {activeFluid.tonicity} ({activeFluid.type})
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Calculated Osmolarity:{' '}
                  <strong className="text-white font-mono">
                    {activeFluid.composition.osmolarity_mOsm_L} mOsm/L
                  </strong>
                </span>
              </div>
            </div>

            {/* Electrolyte Breakdown Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                Electrolyte &amp; Carbohydrate Composition (per Litre):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Sodium (Na⁺)</span>
                  <p className="text-base font-mono font-bold text-white mt-0.5">
                    {activeFluid.composition.na_mEq ? `${activeFluid.composition.na_mEq} mEq` : '0'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Chloride (Cl⁻)</span>
                  <p className="text-base font-mono font-bold text-white mt-0.5">
                    {activeFluid.composition.cl_mEq ? `${activeFluid.composition.cl_mEq} mEq` : '0'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Potassium (K⁺)</span>
                  <p className="text-base font-mono font-bold text-white mt-0.5">
                    {activeFluid.composition.k_mEq ? `${activeFluid.composition.k_mEq} mEq` : '0'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Calcium (Ca⁺⁺)</span>
                  <p className="text-base font-mono font-bold text-white mt-0.5">
                    {activeFluid.composition.ca_mEq ? `${activeFluid.composition.ca_mEq} mEq` : '0'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Lactate</span>
                  <p className="text-base font-mono font-bold text-white mt-0.5">
                    {activeFluid.composition.lactate_mEq ? `${activeFluid.composition.lactate_mEq} mEq` : '0'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Dextrose</span>
                  <p className="text-base font-mono font-bold text-amber-300 mt-0.5">
                    {activeFluid.composition.dextrose_g_L ? `${activeFluid.composition.dextrose_g_L} g/L` : '0'}
                  </p>
                </div>
              </div>
            </div>

            {/* Indications & Contraindications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-900/30 space-y-2">
                <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Indications:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeFluid.indications.map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/30 space-y-2">
                <span className="text-xs uppercase font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Contraindications:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-rose-200">
                  {activeFluid.contraindications.map((ci, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{ci}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nursing Alerts */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1.5">
              <span className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Critical Administration &amp; Nursing Alerts:</span>
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {activeFluid.nursingAlerts.map((na, idx) => (
                  <li key={idx}>• {na}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: IV CANNULA GAUGE & COLOR CODE GUIDE --- */}
      {selectedSubTab === 'cannula' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CANNULA_SPECS.map((cannula) => (
              <div
                key={cannula.gauge}
                className="rounded-3xl p-5 bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Gauge & Color Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full shadow-md"
                        style={{ backgroundColor: cannula.hexColor }}
                      />
                      <h4 className="text-lg font-black text-white">{cannula.gauge}</h4>
                      <span className="text-xs text-slate-400 font-medium">({cannula.colorName})</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-950 text-cyan-400 border border-slate-800">
                      {cannula.maxFlowRate}
                    </span>
                  </div>

                  {/* Dimension Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Outer Diameter:</span>
                      <span className="font-mono font-bold text-white">{cannula.outerDiameter}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Needle Length:</span>
                      <span className="font-mono font-bold text-white">{cannula.length}</span>
                    </div>
                  </div>

                  {/* Primary Indications */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Primary Clinical Use:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {cannula.primaryIndications.map((ind, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-tight">
                          <span className="text-teal-400 font-bold">•</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-500 block text-[10px] uppercase">Best Vein Selection:</span>
                  <span className="text-slate-300">{cannula.recommendedVeins}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: INJECTION ANGLES & TECHNIQUES --- */}
      {selectedSubTab === 'injections' && (
        <div className="space-y-6 animate-fade-in">
          {/* Visual Angle Schematic */}
          <div className="rounded-3xl p-6 bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Syringe className="w-4 h-4 text-cyan-400" />
              <span>Standard Injection Angulations &amp; Anatomical Depths</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INJECTION_ANGLES.map((inj) => (
                <div
                  key={inj.type}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 relative overflow-hidden"
                >
                  <div className="text-3xl font-mono font-black text-cyan-400">
                    {inj.angle}°
                  </div>
                  <h4 className="text-xs font-bold text-white">{inj.type}</h4>
                  <span className="text-[10px] text-slate-400 block">{inj.targetTissue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Technique Dossiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INJECTION_ANGLES.map((inj) => (
              <div
                key={inj.type}
                className="rounded-3xl p-5 bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-black text-cyan-400">{inj.angle}°</span>
                    <h4 className="font-bold text-white text-base">{inj.type}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                    {inj.gaugeRange}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Recommended Anatomical Sites:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {inj.commonSites.map((site, idx) => (
                      <li key={idx}>• {site}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Common Medications Administered:
                  </span>
                  <p className="text-slate-300">{inj.medications.join(', ')}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs text-slate-300">
                  <span className="text-[10px] uppercase font-bold text-teal-400 block">
                    Clinical Best Practice Notes:
                  </span>
                  <ul className="space-y-1">
                    {inj.techniqueNotes.map((note, idx) => (
                      <li key={idx}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: INTERACTIVE IV DRIP RATE CALCULATOR --- */}
      {selectedSubTab === 'calculator' && (
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 border border-teal-500/30 shadow-2xl space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Calculator className="w-3 h-3" />
                <span>Interactive Math Engine</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                IV Infusion Drip Rate Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Formula:{' '}
                <code className="text-teal-300 font-mono">
                  Drops/min = (Volume in mL × Drop Factor) ÷ Time in minutes
                </code>
              </p>
            </div>

            <button
              onClick={() => {
                setVolumeMl(500);
                setTimeUnit('hours');
                setTimeValue(4);
                setDropFactor(20);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Parameters */}
            <div className="space-y-5">
              {/* Volume (mL) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Total Fluid Volume:</span>
                  <span className="font-mono text-teal-400 font-bold">{volumeMl} mL</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(parseInt(e.target.value) || 500)}
                    className="flex-1 accent-teal-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-20 px-2 py-1 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono font-bold text-white"
                  />
                </div>
                {/* Preset Volume Quick Buttons */}
                <div className="flex gap-1.5 pt-1">
                  {[100, 250, 500, 1000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setVolumeMl(v)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        volumeMl === v
                          ? 'bg-teal-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {v} mL
                    </button>
                  ))}
                </div>
              </div>

              {/* Infusion Time */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Target Infusion Duration:</span>
                  <span className="font-mono text-teal-400 font-bold">
                    {timeValue} {timeUnit} ({dripCalculation.totalMinutes} mins)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={timeValue}
                    onChange={(e) => setTimeValue(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-white"
                  />
                  <button
                    onClick={() => setTimeUnit(timeUnit === 'hours' ? 'minutes' : 'hours')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    {timeUnit === 'hours' ? 'Hours' : 'Minutes'}
                  </button>
                </div>
                {/* Preset Time Buttons */}
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 4, 8, 12, 24].map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        setTimeUnit('hours');
                        setTimeValue(h);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        timeUnit === 'hours' && timeValue === h
                          ? 'bg-teal-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop Factor Selector */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 font-medium block">
                  IV Infusion Set Drop Factor:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { factor: 15, label: '15 gtt/mL (Macro Standard)' },
                    { factor: 20, label: '20 gtt/mL (Macro Adult)' },
                    { factor: 60, label: '60 gtt/mL (Micro/Pediatric)' }
                  ].map((df) => (
                    <button
                      key={df.factor}
                      onClick={() => setDropFactor(df.factor)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        dropFactor === df.factor
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm font-mono font-bold text-white block">
                        {df.factor} gtt/mL
                      </span>
                      <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                        {df.label.split(' ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output Display */}
            <div className="flex flex-col justify-between p-6 rounded-3xl bg-slate-950 border border-teal-500/40 shadow-inner space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-teal-400 block mb-1">
                  Required IV Drip Rate:
                </span>

                <div className="flex items-baseline gap-3 my-2">
                  <span className="text-5xl font-mono font-black text-white tracking-tight">
                    {dripCalculation.dropsPerMin}
                  </span>
                  <span className="text-lg font-bold text-teal-400">drops / min (gtt/min)</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Flow Rate (mL/h)</span>
                    <span className="text-lg font-mono font-bold text-white">
                      {dripCalculation.mlPerHour} mL / hr
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Interval Between Drops</span>
                    <span className="text-lg font-mono font-bold text-white">
                      1 drop every ~{dripCalculation.secondsPerDrop}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Drip Simulation chamber */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center animate-pulse">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Visual Chamber Cadence</span>
                    <span className="text-slate-400">
                      Set IV roller clamp so 1 drop falls every {dripCalculation.secondsPerDrop} seconds.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
