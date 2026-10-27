import React, { useState } from "react";

export const AnatomyVisualizer: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<"injections" | "cardio" | "digestive" | "skeletal">("injections");
  const [activeSite, setActiveSite] = useState<string>("deltoid");

  const injectionSites = [
    {
      id: "deltoid",
      name: "Deltoid Muscle (IM - Upper Arm)",
      route: "Intramuscular (90°)",
      maxVolume: "1.0 - 2.0 mL",
      needleSpec: "22G - 25G (1.0 inch)",
      landmarks: "2 to 3 finger-breadths (3-5 cm) below the acromion process, in the center of the inverted triangle.",
      commonMeds: "Hepatitis B, Tetanus Toxoid (TT), Rabies vaccine, COVID-19, Ondansetron, Diclofenac (max 1 mL, prefer gluteal).",
      risks: "Radial nerve injury, brachial artery perforation, subacromial bursitis if injected too high.",
      aspirationRule: "Aspiration not strictly required for vaccines per CDC/WHO, but recommended for other IM drugs in clinical practice."
    },
    {
      id: "ventrogluteal",
      name: "Ventrogluteal Site (IM - Hip / Gluteus Medius)",
      route: "Intramuscular (90°)",
      maxVolume: "2.5 - 4.0 mL",
      needleSpec: "20G - 22G (1.5 inch)",
      landmarks: "Place palm over greater trochanter, index finger toward anterior superior iliac spine (ASIS), middle finger spread along iliac crest. Inject in the V-shaped triangle.",
      commonMeds: "Iron sucrose/dextran, Diclofenac, Ceftriaxone, Haloperidol decanoate, oily depot suspensions.",
      risks: "GOLD STANDARD SAFEST SITE in adults: No major blood vessels or nerves (completely avoids sciatic nerve).",
      aspirationRule: "Always aspirate for 5 seconds before injection. If blood appears, withdraw and discard."
    },
    {
      id: "dorsogluteal",
      name: "Dorsogluteal Site (IM - Upper Outer Quadrant)",
      route: "Intramuscular (90°)",
      maxVolume: "2.0 - 3.0 mL",
      needleSpec: "20G - 22G (1.5 inch)",
      landmarks: "Divide buttock into 4 equal quadrants; inject strictly in the UPPER OUTER quadrant (near iliac crest).",
      commonMeds: "Analgesic injections (Diclofenac), Anti-emetics (Pheniramine), Antibiotics.",
      risks: "HIGH RISK of Sciatic Nerve palsy, superior gluteal artery injury, or subcutaneous deposition in obese patients.",
      aspirationRule: "Mandatory aspiration. Many international guidelines deprecate this site in favor of Ventrogluteal."
    },
    {
      id: "vastus_lateralis",
      name: "Vastus Lateralis (IM - Anterolateral Thigh)",
      route: "Intramuscular (90°)",
      maxVolume: "Paediatric: 0.5 - 1.0 mL | Adult: up to 3.0 mL",
      needleSpec: "22G - 25G (5/8 to 1.0 inch)",
      landmarks: "Divide anterolateral thigh into 3 horizontal thirds; inject in the middle third on the outer side.",
      commonMeds: "Adrenaline 1:1000 in acute anaphylaxis (fastest vascular uptake), all paediatric infant vaccines.",
      risks: "Extremely safe in infants & children because no major nerve runs through middle vastus lateralis.",
      aspirationRule: "Recommended standard technique."
    },
    {
      id: "subcutaneous_abdomen",
      name: "Periumbilical Abdomen (Subcutaneous - 45° or 90°)",
      route: "Subcutaneous (SC)",
      maxVolume: "0.5 - 1.5 mL",
      needleSpec: "27G - 31G (4mm to 8mm)",
      landmarks: "At least 2 inches (5 cm) away from the umbilicus, pinch skin fold to isolate subcutaneous adipose layer.",
      commonMeds: "Insulin (Regular, NPH, Glargine), Low Molecular Weight Heparin (Enoxaparin / Clexane).",
      risks: "Avoid scar tissue, stretch marks, bruises. Do NOT massage after Heparin injection (prevents hematoma).",
      aspirationRule: "Do NOT aspirate for subcutaneous insulin or heparin injections."
    },
    {
      id: "forearm_intradermal",
      name: "Volar Forearm (Intradermal - 10° to 15°)",
      route: "Intradermal (ID)",
      maxVolume: "0.05 - 0.1 mL",
      needleSpec: "26G - 27G (3/8 inch)",
      landmarks: "Inner surface of forearm, 3 to 4 fingerbreadths below the antecubital fossa in hairless area.",
      commonMeds: "Mantoux Test (PPD tuberculin), Antibiotic sensitivity test (AST for Penicillins / Cephalosporins).",
      risks: "Ensure discrete wheal (bleb) forms. If no bleb appears, needle is too deep (subcutaneous).",
      aspirationRule: "Do not aspirate. Bevel facing up at 10°-15° angle."
    }
  ];

  const currentInjection = injectionSites.find(s => s.id === activeSite) || injectionSites[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
              <span>🫀 Interactive Anatomy &amp; Sites</span>
              <span>•</span>
              <span>Visual Clinical Atlas</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Human Anatomy &amp; Injection Landmarks Explorer
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visual schematics for clinical pharmacology, organ drug clearance, arterial pulses, and safe intramuscular / subcutaneous injection landmarks.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
            {[
              { id: "injections", label: "Injection Sites", icon: "💉" },
              { id: "cardio", label: "Cardiovascular", icon: "🫀" },
              { id: "digestive", label: "Digestive / Liver", icon: "🧪" },
              { id: "skeletal", label: "Skeletal Joints", icon: "🦴" }
            ].map(sys => (
              <button
                key={sys.id}
                onClick={() => setSelectedSystem(sys.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedSystem === sys.id
                    ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{sys.icon}</span>
                <span>{sys.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: INJECTION SITES VISUALIZER */}
      {selectedSystem === "injections" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
            <h3 className="text-sm font-bold text-white mb-2 self-start flex items-center gap-2">
              <span>📍</span> Clinical Injection Sites Map
            </h3>
            <p className="text-xs text-slate-400 mb-4 self-start">
              Click any anatomical landmark to view needle gauge, depth, landmarking rules, and danger zones.
            </p>

            <div className="relative w-full max-w-[280px] h-[400px] bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
              <svg viewBox="0 0 200 360" className="w-full h-full text-slate-700">
                <circle cx="100" cy="30" r="18" fill="currentColor" opacity="0.4" />
                <rect x="94" y="48" width="12" height="12" rx="2" fill="currentColor" opacity="0.4" />
                <path d="M 65 60 L 135 60 L 125 170 L 75 170 Z" fill="currentColor" opacity="0.4" />
                <path d="M 65 62 L 40 140 L 48 145 L 70 80 Z" fill="currentColor" opacity="0.4" />
                <path d="M 135 62 L 160 140 L 152 145 L 130 80 Z" fill="currentColor" opacity="0.4" />
                <path d="M 40 140 L 32 200 L 40 202 L 48 145 Z" fill="currentColor" opacity="0.4" />
                <path d="M 160 140 L 168 200 L 160 202 L 152 145 Z" fill="currentColor" opacity="0.4" />
                <path d="M 75 170 L 125 170 L 130 210 L 70 210 Z" fill="currentColor" opacity="0.4" />
                <path d="M 72 210 L 68 290 L 85 290 L 96 210 Z" fill="currentColor" opacity="0.4" />
                <path d="M 128 210 L 132 290 L 115 290 L 104 210 Z" fill="currentColor" opacity="0.4" />
                <path d="M 68 290 L 65 350 L 78 350 L 85 290 Z" fill="currentColor" opacity="0.4" />
                <path d="M 132 290 L 135 350 L 122 350 L 115 290 Z" fill="currentColor" opacity="0.4" />
              </svg>

              <button
                onClick={() => setActiveSite("deltoid")}
                className={`absolute top-[90px] left-[42px] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-transform shadow-lg ${
                  activeSite === "deltoid"
                    ? "bg-teal-400 text-slate-950 ring-4 ring-teal-400/30 scale-125 z-20"
                    : "bg-slate-800 text-teal-300 border border-teal-500/50 hover:scale-110"
                }`}
                title="Deltoid Muscle (IM)"
              >
                1
              </button>

              <button
                onClick={() => setActiveSite("subcutaneous_abdomen")}
                className={`absolute top-[135px] left-[90px] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-transform shadow-lg ${
                  activeSite === "subcutaneous_abdomen"
                    ? "bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 scale-125 z-20"
                    : "bg-slate-800 text-cyan-300 border border-cyan-500/50 hover:scale-110"
                }`}
                title="Abdomen / Periumbilical (SC)"
              >
                2
              </button>

              <button
                onClick={() => setActiveSite("ventrogluteal")}
                className={`absolute top-[180px] left-[55px] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-transform shadow-lg ${
                  activeSite === "ventrogluteal"
                    ? "bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30 scale-125 z-20"
                    : "bg-slate-800 text-emerald-300 border border-emerald-500/50 hover:scale-110"
                }`}
                title="Ventrogluteal (IM Hip - Safest)"
              >
                3
              </button>

              <button
                onClick={() => setActiveSite("dorsogluteal")}
                className={`absolute top-[185px] right-[55px] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-transform shadow-lg ${
                  activeSite === "dorsogluteal"
                    ? "bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-125 z-20"
                    : "bg-slate-800 text-amber-300 border border-amber-500/50 hover:scale-110"
                }`}
                title="Dorsogluteal (IM Buttock)"
              >
                4
              </button>

              <button
                onClick={() => setActiveSite("vastus_lateralis")}
                className={`absolute top-[245px] left-[52px] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-transform shadow-lg ${
                  activeSite === "vastus_lateralis"
                    ? "bg-teal-400 text-slate-950 ring-4 ring-teal-400/30 scale-125 z-20"
                    : "bg-slate-800 text-teal-300 border border-teal-500/50 hover:scale-110"
                }`}
                title="Vastus Lateralis (IM Thigh)"
              >
                5
              </button>

              <button
                onClick={() => setActiveSite("forearm_intradermal")}
                className={`absolute top-[170px] right-[30px] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-transform shadow-lg ${
                  activeSite === "forearm_intradermal"
                    ? "bg-purple-400 text-slate-950 ring-4 ring-purple-400/30 scale-125 z-20"
                    : "bg-slate-800 text-purple-300 border border-purple-500/50 hover:scale-110"
                }`}
                title="Volar Forearm (ID Mantoux/AST)"
              >
                6
              </button>
            </div>

            <div className="w-full mt-4 grid grid-cols-2 gap-2 text-[11px]">
              {injectionSites.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSite(s.id)}
                  className={`p-1.5 rounded-lg text-left truncate transition-colors ${
                    activeSite === s.id
                      ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <span className="font-mono text-cyan-400 mr-1.5">{idx + 1}.</span>
                  {s.name.split(" ")[0]} ({s.route.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {currentInjection.route}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Max Vol: <strong className="text-white">{currentInjection.maxVolume}</strong>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {currentInjection.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                    Recommended Needle Spec
                  </span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {currentInjection.needleSpec}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                    Aspiration Protocol
                  </span>
                  <span className="text-xs font-medium text-amber-300">
                    {currentInjection.aspirationRule}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-teal-400 block mb-1">📐 Landmarking &amp; Anatomical Identification:</strong>
                  <p className="text-slate-300 leading-relaxed">{currentInjection.landmarks}</p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-cyan-400 block mb-1">💊 Typical Medications &amp; Vaccines Administered:</strong>
                  <p className="text-slate-300 leading-relaxed">{currentInjection.commonMeds}</p>
                </div>

                <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-800/40">
                  <strong className="text-rose-400 block mb-1">⚠️ Clinical Risks &amp; Danger Zones:</strong>
                  <p className="text-rose-200/90 leading-relaxed">{currentInjection.risks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CARDIOVASCULAR SYSTEM */}
      {selectedSystem === "cardio" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🫀</span> Cardiovascular Anatomy &amp; Arterial Pulse Landmarks
            </h3>
            <span className="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              Mean Arterial Pressure (MAP) = DBP + 1/3 (SBP - DBP)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-rose-400 block mb-1">Carotid Artery Pulse</span>
              <p className="text-xs text-slate-300 mb-2">
                Medial to sternocleidomastoid muscle in anterior neck groove. First pulse checked in CPR / cardiac arrest.
              </p>
              <div className="text-[11px] text-amber-300/90 font-mono">
                ⚠️ Never palpate both carotids simultaneously (vagal syncope risk).
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-rose-400 block mb-1">Brachial Artery Pulse</span>
              <p className="text-xs text-slate-300 mb-2">
                Medial to biceps tendon in antecubital fossa. Standard stethoscope placement site for manual blood pressure measurement.
              </p>
              <div className="text-[11px] text-teal-300 font-mono">
                Primary pulse checked in infants &lt; 1 yr during resuscitation.
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-rose-400 block mb-1">Radial Artery Pulse</span>
              <p className="text-xs text-slate-300 mb-2">
                Lateral aspect of the anterior wrist, flexor carpi radialis tendon. Routine clinical pulse check point.
              </p>
              <div className="text-[11px] text-cyan-300 font-mono">
                Allen&apos;s test required before radial ABG cannulation to ensure ulnar collateral supply.
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-rose-400 block mb-1">Femoral &amp; Dorsalis Pedis</span>
              <p className="text-xs text-slate-300 mb-2">
                Femoral: Mid-inguinal point. Dorsalis Pedis: Dorsum of foot between 1st &amp; 2nd metatarsals.
              </p>
              <div className="text-[11px] text-purple-300 font-mono">
                Assesses peripheral arterial disease (PAD) &amp; diabetic microvascular perfusion.
              </div>
            </div>
          </div>

          <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🩺</span> Hypertensive Urgency vs Emergency in Pharmacy Triage
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg">
                <strong className="text-amber-300 block mb-1">Hypertensive Urgency (BP &gt; 180/120 without TOD):</strong>
                <p className="text-slate-300">
                  Elevated BP without acute end-organ damage. DO NOT give sublingual nifedipine (causes catastrophic stroke / MI from precipitous drop). Initiate oral antihypertensives (Amlodipine 5-10mg, Telmisartan 40mg) and refer for outpatient physician review.
                </p>
              </div>
              <div className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-lg">
                <strong className="text-rose-400 block mb-1">Hypertensive Emergency (BP &gt; 180/120 WITH TOD):</strong>
                <p className="text-slate-300">
                  Accompanied by papilledema, acute pulmonary edema (frothy pink sputum), chest pain (aortic dissection/ACS), or neurological deficits (stroke). Immediate ambulance referral required for IV Labetalol or Nitroglycerin infusion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DIGESTIVE & LIVER SYSTEM */}
      {selectedSystem === "digestive" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🧪</span> Gastrointestinal Tract &amp; Hepatic Drug Metabolism (CYP450)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Stomach (pH 1.5 - 2.5)</h4>
              <p className="text-xs text-slate-300 mb-2">
                Acidic environment activates pepsin. Weakly acidic drugs (Aspirin) are non-ionized and partially absorbed.
              </p>
              <div className="text-[11px] text-teal-300 bg-slate-900 p-2 rounded">
                PPIs (Pantoprazole, Omeprazole) irreversibly inhibit H+/K+ ATPase on parietal cells. Best taken 30-60 mins BEFORE breakfast.
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold mb-2">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Small Intestine (Duodenum &amp; Jejunum)</h4>
              <p className="text-xs text-slate-300 mb-2">
                Immense surface area (microvilli, ~250 m²). Primary site of oral drug absorption through passive diffusion and active transport.
              </p>
              <div className="text-[11px] text-cyan-300 bg-slate-900 p-2 rounded">
                Antacids and dairy chelators (Ca++, Mg++) bind Tetracyclines &amp; Fluoroquinolones in the gut lumen, blocking absorption.
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold mb-2">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Liver (First-Pass Metabolism)</h4>
              <p className="text-xs text-slate-300 mb-2">
                Portal vein delivers absorbed drugs directly to hepatocytes before systemic circulation.
              </p>
              <div className="text-[11px] text-rose-300 bg-slate-900 p-2 rounded">
                CYP3A4 metabolizes ~50% of prescription drugs (Statins, CCBs). Inhibited by Grapefruit juice and Erythromycin.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SKELETAL JOINTS */}
      {selectedSystem === "skeletal" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🦴</span> Skeletal Framework &amp; Rheumatologic Pain Sites
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-teal-400 text-sm">Osteoarthritis (OA) - Degenerative Wear &amp; Tear</h4>
              <p className="text-slate-300">
                Loss of articular cartilage in weight-bearing joints (Knees, Hips, Lumbar Spine, DIP joints - Heberden&apos;s nodes).
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Pain worsens with movement and evening fatigue; improves with rest.</li>
                <li>Morning stiffness lasts &lt; 30 minutes.</li>
                <li>First-line OTC: Topical Diclofenac gel + Paracetamol; oral NSAIDs with PPI cover.</li>
              </ul>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-amber-400 text-sm">Rheumatoid Arthritis (RA) - Autoimmune Synovitis</h4>
              <p className="text-slate-300">
                Symmetric inflammatory synovitis targeting small joints of hands and feet (MCP, PIP joints, Wrists).
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Prolonged morning stiffness (&gt; 1 hour); eases with joint activity.</li>
                <li>Systemic manifestations: fatigue, rheumatoid nodules, elevated ESR/CRP.</li>
                <li>Requires DMARD referral (Methotrexate, Hydroxychloroquine); NSAIDs provide only symptomatic relief.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
