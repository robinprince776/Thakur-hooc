import React, { useState, useMemo } from "react";

export const ClinicalCalculatorsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bmi-bsa" | "paediatric" | "crcl" | "iv-drip">("bmi-bsa");

  // BMI & BSA state
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(68);

  // Paediatric dose state
  const [adultDose, setAdultDose] = useState<number>(500);
  const [childAgeYears, setChildAgeYears] = useState<number>(5);
  const [childAgeMonths, setChildAgeMonths] = useState<number>(60);
  const [childWeightKg, setChildWeightKg] = useState<number>(18);

  // CrCl state
  const [patientAge, setPatientAge] = useState<number>(55);
  const [patientWeight, setPatientWeight] = useState<number>(65);
  const [serumCr, setSerumCr] = useState<number>(1.1);
  const [patientGender, setPatientGender] = useState<"male" | "female">("male");

  // IV Drip state
  const [ivVolumeMl, setIvVolumeMl] = useState<number>(500);
  const [ivHours, setIvHours] = useState<number>(4);
  const [dropFactor, setDropFactor] = useState<number>(20);

  // Calculations
  const bmiData = useMemo(() => {
    const heightM = heightCm / 100;
    if (heightM <= 0 || weightKg <= 0) return { bmi: 0, category: "N/A", color: "text-slate-400" };
    const bmiVal = weightKg / (heightM * heightM);
    let category = "Normal";
    let color = "text-emerald-400";

    if (bmiVal < 18.5) {
      category = "Underweight";
      color = "text-amber-400";
    } else if (bmiVal < 23.0) {
      category = "Normal (Asian WHO Criteria)";
      color = "text-emerald-400";
    } else if (bmiVal < 27.5) {
      category = "Overweight (Increased Risk)";
      color = "text-amber-400";
    } else if (bmiVal < 32.5) {
      category = "Obese Class I (High Risk)";
      color = "text-rose-400";
    } else {
      category = "Obese Class II / Severe (Very High Risk)";
      color = "text-rose-500";
    }

    const bsaMosteller = Math.sqrt((heightCm * weightKg) / 3600);
    const bsaDuBois = 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);

    return {
      bmi: parseFloat(bmiVal.toFixed(1)),
      category,
      color,
      bsaMosteller: parseFloat(bsaMosteller.toFixed(2)),
      bsaDuBois: parseFloat(bsaDuBois.toFixed(2))
    };
  }, [heightCm, weightKg]);

  // Paediatric calculations
  const paediatricDoses = useMemo(() => {
    const youngs = (childAgeYears / (childAgeYears + 12)) * adultDose;
    const clarks = (childWeightKg / 70) * adultDose;
    const dillings = (childAgeYears / 20) * adultDose;
    const frieds = (childAgeMonths / 150) * adultDose;

    return {
      youngs: parseFloat(youngs.toFixed(1)),
      clarks: parseFloat(clarks.toFixed(1)),
      dillings: parseFloat(dillings.toFixed(1)),
      frieds: parseFloat(frieds.toFixed(1))
    };
  }, [adultDose, childAgeYears, childAgeMonths, childWeightKg]);

  // CrCl Cockcroft-Gault calculation
  const crclData = useMemo(() => {
    if (serumCr <= 0 || patientWeight <= 0) return { crcl: 0, stage: "N/A", color: "text-slate-400" };
    let val = ((140 - patientAge) * patientWeight) / (72 * serumCr);
    if (patientGender === "female") {
      val = val * 0.85;
    }
    const crclVal = parseFloat(val.toFixed(1));

    let stage = "Normal Renal Function (CrCl > 90 mL/min)";
    let color = "text-emerald-400";

    if (crclVal < 15) {
      stage = "End-Stage Renal Disease (CrCl < 15 mL/min) - Severe restriction";
      color = "text-rose-500";
    } else if (crclVal < 30) {
      stage = "Severe Impairment (CrCl 15-29 mL/min) - Avoid Metformin/NSAIDs";
      color = "text-rose-400";
    } else if (crclVal < 60) {
      stage = "Moderate Impairment (CrCl 30-59 mL/min) - 50% dose reduction for many antibiotics";
      color = "text-amber-400";
    } else if (crclVal < 90) {
      stage = "Mild Impairment (CrCl 60-89 mL/min)";
      color = "text-teal-400";
    }

    return { crcl: crclVal, stage, color };
  }, [patientAge, patientWeight, serumCr, patientGender]);

  // IV Drip calculation
  const ivDripResult = useMemo(() => {
    const totalMinutes = ivHours * 60;
    if (totalMinutes <= 0) return { dropsPerMin: 0, mlPerHour: 0 };
    const drops = (ivVolumeMl * dropFactor) / totalMinutes;
    const mlPerHour = ivVolumeMl / ivHours;
    return {
      dropsPerMin: Math.round(drops),
      mlPerHour: parseFloat(mlPerHour.toFixed(1))
    };
  }, [ivVolumeMl, ivHours, dropFactor]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
              <span>🧮 Module 5</span>
              <span>•</span>
              <span>Clinical Pharmacokinetics &amp; Calculators</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Clinical &amp; Paediatric Dose Calculators
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Precision clinical formulas for daily clinic, hospital, and dispensary practice. BMI, BSA (Mosteller), Paediatric dosing rules, Creatinine Clearance (Cockcroft-Gault), and IV infusion drip rate.
            </p>
          </div>

          {/* Sub-nav */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
            {[
              { id: "bmi-bsa", label: "BMI & BSA", icon: "⚖️" },
              { id: "paediatric", label: "Paediatric Dose", icon: "👶" },
              { id: "crcl", label: "Renal CrCl", icon: "🩺" },
              { id: "iv-drip", label: "IV Drip Rate", icon: "💧" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
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

      {/* CALCULATOR 1: BMI & BSA */}
      {activeTab === "bmi-bsa" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📏</span> Patient Parameters
            </h3>

            {/* Height Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Height (cm)</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{heightCm} cm ({(heightCm / 30.48).toFixed(1)} ft)</span>
              </div>
              <input
                type="range"
                min="90"
                max="220"
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>90 cm</span>
                <span>160 cm</span>
                <span>180 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Weight (kg)</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{weightKg} kg ({(weightKg * 2.20462).toFixed(1)} lbs)</span>
              </div>
              <input
                type="range"
                min="20"
                max="160"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>20 kg</span>
                <span>50 kg</span>
                <span>70 kg</span>
                <span>160 kg</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400">
              💡 <strong>Clinical Pearl:</strong> Body Surface Area (BSA) is clinically superior to body weight alone when dosing narrow therapeutic index agents (e.g. Methotrexate, Paclitaxel, Aminoglycosides) because cardiac output and renal filtration correlate tightly with BSA.
            </div>
          </div>

          {/* Results display */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/90 border border-teal-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4">
                Clinical Metrics Computed
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <span className="text-[11px] text-slate-400 font-medium block mb-1">Body Mass Index (BMI)</span>
                  <span className="text-3xl font-black text-white">{bmiData.bmi}</span>
                  <span className="text-xs text-slate-500 ml-1">kg/m²</span>
                  <div className={`mt-1.5 text-xs font-bold ${bmiData.color}`}>
                    {bmiData.category}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <span className="text-[11px] text-slate-400 font-medium block mb-1">BSA (Mosteller Formula)</span>
                  <span className="text-3xl font-black text-cyan-400">{bmiData.bsaMosteller}</span>
                  <span className="text-xs text-slate-500 ml-1">m²</span>
                  <div className="mt-1.5 text-xs text-slate-400">
                    DuBois: <strong className="text-slate-300">{bmiData.bsaDuBois} m²</strong>
                  </div>
                </div>
              </div>

              {/* BMI Scale Bar */}
              <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-300 block mb-2">Asian Indian WHO Classification Reference:</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Underweight (&lt; 18.5)</span>
                    <span className="font-mono text-slate-400">Malnutrition risk</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Normal Range (18.5 - 22.9)</span>
                    <span className="font-mono">Lowest morbidity</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Overweight (23.0 - 24.9)</span>
                    <span className="font-mono">Metabolic syndrome warning</span>
                  </div>
                  <div className="flex justify-between text-rose-400 font-semibold">
                    <span>Obesity (≥ 25.0)</span>
                    <span className="font-mono">Cardiovascular &amp; T2D risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: PAEDIATRIC DOSE */}
      {activeTab === "paediatric" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>👶</span> Paediatric Parameters
              </h3>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Adult Standard Dose (mg)
                </label>
                <input
                  type="number"
                  value={adultDose}
                  onChange={e => setAdultDose(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">e.g. Paracetamol = 500 mg, Amoxicillin = 500 mg</span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Child Age (Years)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="18"
                    value={childAgeYears}
                    onChange={e => {
                      const yr = Number(e.target.value);
                      setChildAgeYears(yr);
                      setChildAgeMonths(yr * 12);
                    }}
                    className="flex-1 accent-teal-500"
                  />
                  <span className="text-cyan-400 font-mono font-bold text-sm w-16 text-right">{childAgeYears} yrs</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Child Weight (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="3"
                    max="60"
                    value={childWeightKg}
                    onChange={e => setChildWeightKg(Number(e.target.value))}
                    className="flex-1 accent-teal-500"
                  />
                  <span className="text-cyan-400 font-mono font-bold text-sm w-16 text-right">{childWeightKg} kg</span>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-600/30 rounded-xl p-3 text-xs text-amber-200/90">
                ⚠️ <strong>Clinical Golden Rule:</strong> Weight-based dosing (mg/kg) is ALWAYS preferred over age-based rules (Young&apos;s/Dilling&apos;s). In children with obesity or edema, calculate according to ideal body weight.
              </div>
            </div>

            {/* Dose Comparison Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Youngs Rule */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/40 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                    Young&apos;s Rule (Age 1 - 12 Yrs)
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {paediatricDoses.youngs} <span className="text-xs font-normal text-slate-400">mg</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2 bg-slate-950/70 p-2 rounded-lg">
                    Formula: [Age / (Age + 12)] × Adult Dose
                  </div>
                </div>

                {/* Clarks Rule */}
                <div className="bg-slate-900/90 border-2 border-teal-500/50 rounded-2xl p-5 shadow-lg shadow-teal-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      Clark&apos;s Rule (By Weight - Recommended)
                    </span>
                    <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-bold">Gold Std</span>
                  </div>
                  <div className="text-2xl font-black text-cyan-300 font-mono">
                    {paediatricDoses.clarks} <span className="text-xs font-normal text-slate-400">mg</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2 bg-slate-950/70 p-2 rounded-lg">
                    Formula: [Weight (kg) / 70] × Adult Dose
                  </div>
                </div>

                {/* Dillings Rule */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Dilling&apos;s Rule (Age 4 - 20 Yrs)
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {paediatricDoses.dillings} <span className="text-xs font-normal text-slate-400">mg</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2 bg-slate-950/70 p-2 rounded-lg">
                    Formula: [Age / 20] × Adult Dose
                  </div>
                </div>

                {/* Frieds Rule */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Fried&apos;s Rule (Infants &lt; 1 Yr / Months)
                  </span>
                  <div className="text-2xl font-black text-white font-mono">
                    {paediatricDoses.frieds} <span className="text-xs font-normal text-slate-400">mg</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2 bg-slate-950/70 p-2 rounded-lg">
                    Formula: [Age (Months) / 150] × Adult Dose
                  </div>
                </div>
              </div>

              {/* Common Paediatric Quick Reference Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <span>💊</span> High-Frequency Paediatric Formulations Reference (OTC/Dispensary)
                </h4>
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1.5 px-2">Drug</th>
                      <th className="py-1.5 px-2">Paediatric Dose</th>
                      <th className="py-1.5 px-2">Frequency</th>
                      <th className="py-1.5 px-2">Common Drops / Syrup Form</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-1.5 px-2 font-semibold text-white">Paracetamol</td>
                      <td className="py-1.5 px-2 text-teal-300">10 - 15 mg/kg/dose</td>
                      <td className="py-1.5 px-2">Every 4-6 hrs (Max 60 mg/kg/day)</td>
                      <td className="py-1.5 px-2 font-mono">Drops 100mg/mL; Susp 120mg/5mL or 250mg/5mL</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-semibold text-white">Amoxicillin</td>
                      <td className="py-1.5 px-2 text-teal-300">25 - 45 mg/kg/day</td>
                      <td className="py-1.5 px-2">Divided in 2 to 3 doses</td>
                      <td className="py-1.5 px-2 font-mono">Dry Syrup 125mg/5mL or 250mg/5mL</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-semibold text-white">Ibuprofen</td>
                      <td className="py-1.5 px-2 text-amber-300">5 - 10 mg/kg/dose</td>
                      <td className="py-1.5 px-2">Every 6-8 hrs (Avoid in &lt; 3 mo)</td>
                      <td className="py-1.5 px-2 font-mono">Syrup 100mg/5mL</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-semibold text-white">Cetirizine</td>
                      <td className="py-1.5 px-2 text-teal-300">0.25 mg/kg/day</td>
                      <td className="py-1.5 px-2">Once daily (OD) or BD</td>
                      <td className="py-1.5 px-2 font-mono">Syrup 5mg/5mL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: RENAL CrCl */}
      {activeTab === "crcl" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🩺</span> Renal Function Parameters (Cockcroft-Gault)
            </h3>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Patient Age (Years)</label>
              <input
                type="number"
                value={patientAge}
                onChange={e => setPatientAge(Math.max(18, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Patient Weight (kg)</label>
              <input
                type="number"
                value={patientWeight}
                onChange={e => setPatientWeight(Math.max(20, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Serum Creatinine (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={serumCr}
                onChange={e => setSerumCr(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Normal range: 0.6 - 1.2 mg/dL</span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Biological Sex</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPatientGender("male")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    patientGender === "male"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  Male (x 1.0)
                </button>
                <button
                  onClick={() => setPatientGender("female")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    patientGender === "female"
                      ? "bg-pink-500/20 border-pink-400 text-pink-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  Female (x 0.85)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/90 border border-teal-500/40 rounded-2xl p-6 shadow-xl">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Calculated Estimated Creatinine Clearance (eCrCl)
              </span>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-white font-mono">{crclData.crcl}</span>
                <span className="text-sm font-semibold text-slate-400">mL/min</span>
              </div>

              <div className={`text-xs font-bold p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${crclData.color}`}>
                {crclData.stage}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white text-xs">Critical Pharmacist Drug Adjustments based on CrCl:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <strong className="text-rose-400 block mb-0.5">Metformin:</strong>
                    Contraindicated if CrCl &lt; 30 mL/min (Lactic acidosis risk). Max 1000 mg if CrCl 30-45 mL/min.
                  </div>
                  <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">Ciprofloxacin:</strong>
                    Reduce dose by 50% if CrCl &lt; 30 mL/min to prevent neurotoxicity &amp; tendonitis.
                  </div>
                  <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <strong className="text-amber-400 block mb-0.5">Enoxaparin (LMWH):</strong>
                    Reduce therapeutic dose from 1 mg/kg BD to 1 mg/kg OD if CrCl &lt; 30 mL/min.
                  </div>
                  <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <strong className="text-cyan-400 block mb-0.5">Amoxicillin/Clav:</strong>
                    If CrCl &lt; 30 mL/min, avoid 875/125 mg tab; switch to 500/125 mg BD or OD.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 4: IV DRIP RATE */}
      {activeTab === "iv-drip" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>💧</span> Infusion Setting
            </h3>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Total Infusion Volume (mL)
              </label>
              <input
                type="number"
                value={ivVolumeMl}
                onChange={e => setIvVolumeMl(Math.max(10, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">e.g. 500 mL pint, 1000 mL pint, or 100 mL mini-bag</span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Infusion Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={ivHours}
                onChange={e => setIvHours(Math.max(0.2, Number(e.target.value)))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                IV Tubing Drop Factor (gtt/mL)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { factor: 15, label: "15 gtt/mL", note: "Standard Macro" },
                  { factor: 20, label: "20 gtt/mL", note: "Routine Adult" },
                  { factor: 60, label: "60 gtt/mL", note: "Micro / Paed" }
                ].map(item => (
                  <button
                    key={item.factor}
                    onClick={() => setDropFactor(item.factor)}
                    className={`p-2 rounded-xl text-center border transition-colors ${
                      dropFactor === item.factor
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[9px] text-slate-500">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/90 border border-teal-500/40 rounded-2xl p-6 shadow-xl">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Required Drip Cadence
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-950/90 border border-teal-500/30 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">Flow Rate in Drops</span>
                  <div className="text-4xl font-black text-cyan-400 font-mono">
                    {ivDripResult.dropsPerMin}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">drops / minute (gtt/min)</span>
                  <div className="text-[11px] text-teal-400 mt-2">
                    ≈ {(ivDripResult.dropsPerMin / 4).toFixed(0)} drops per 15 seconds
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">Volumetric Infusion Pump Rate</span>
                  <div className="text-4xl font-black text-white font-mono">
                    {ivDripResult.mlPerHour}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">mL / hour</span>
                </div>
              </div>

              {/* Drip timing formula */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 font-mono text-xs text-slate-400">
                Formula: <span className="text-cyan-300">Drops/min = [Volume (mL) × Drop Factor] / [Time in Minutes ({ivHours * 60} mins)]</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
