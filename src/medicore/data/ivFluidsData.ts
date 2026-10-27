import { IvFluidItem, CannulaSpec, InjectionAngleSpec } from '../types';

export const IV_FLUIDS_DATA: IvFluidItem[] = [
  {
    id: 'ns-09',
    name: 'Normal Saline (0.9% NaCl)',
    type: 'Crystalloid',
    tonicity: 'Isotonic',
    composition: {
      na_mEq: 154,
      cl_mEq: 154,
      osmolarity_mOsm_L: 308
    },
    indications: [
      'Acute hypovolemia, hemorrhagic shock, fluid resuscitation',
      'Hyponatremia and hypochloremic metabolic alkalosis (vomiting)',
      'Vehicle for intravenous drug infusions and blood transfusions (only fluid compatible with packed red blood cells)'
    ],
    contraindications: [
      'Severe congestive heart failure and pulmonary edema',
      'Hypernatremia and fluid overload states',
      'Severe chronic renal failure (risk of hyperchloremic metabolic acidosis with large volumes)'
    ],
    nursingAlerts: [
      'Infusing large volumes (> 3-4 Litres) causes hyperchloremic non-anion gap metabolic acidosis and renal vasoconstriction.',
      'Check lungs for basal crepitations to detect early pulmonary edema.'
    ]
  },
  {
    id: 'rl',
    name: "Ringer's Lactate (RL / Hartmann's Solution)",
    type: 'Crystalloid',
    tonicity: 'Isotonic',
    composition: {
      na_mEq: 130,
      k_mEq: 4,
      cl_mEq: 109,
      ca_mEq: 3,
      lactate_mEq: 28,
      osmolarity_mOsm_L: 273
    },
    indications: [
      'GOLD STANDARD for acute hypovolemic burn resuscitation (Parkland Formula)',
      'Intraoperative and postoperative fluid replacement',
      'Acute dehydration from diarrhea, cholera, and major trauma resuscitation',
      'Metabolic acidosis associated with dehydration (lactate is converted to bicarbonate in healthy liver)'
    ],
    contraindications: [
      'Severe acute hepatic failure (inability to metabolize lactate into bicarbonate -> worsens lactic acidosis)',
      'Severe hyperkalemia (contains potassium 4 mEq/L)',
      'Severe renal failure with anuria',
      'CANNOT be co-infused with blood products through same line (contains Calcium which chelates citrate anticoagulant -> triggers clots)'
    ],
    nursingAlerts: [
      'Most physiological fluid; closely mimics human plasma electrolyte composition.',
      'Always verify liver function before prolonged high-volume infusion.'
    ]
  },
  {
    id: 'dns',
    name: 'Dextrose Normal Saline (DNS - 5% Dextrose in 0.9% NaCl)',
    type: 'Crystalloid',
    tonicity: 'Hypertonic',
    composition: {
      na_mEq: 154,
      cl_mEq: 154,
      dextrose_g_L: 50,
      osmolarity_mOsm_L: 560
    },
    indications: [
      'Maintenance fluid providing sodium and chloride alongside calories (approx 170 kcal/L)',
      'Hypovolemia accompanied by mild hypoglycemia or ketosis (starvation ketosis, post-op)',
      'Heat exhaustion with sodium depletion'
    ],
    contraindications: [
      'Uncontrolled Diabetes Mellitus with severe hyperglycemia',
      'Acute neurotrauma or head injury (dextrose solutions increase cerebral edema)',
      'Congestive heart failure'
    ],
    nursingAlerts: [
      'Hypertonic in the bottle, but once dextrose is rapidly metabolized by insulin, becomes isotonic in circulation.',
      'Monitor capillary blood glucose in diabetic patients.'
    ]
  },
  {
    id: 'd5w',
    name: '5% Dextrose in Water (D5W)',
    type: 'Crystalloid',
    tonicity: 'Isotonic',
    composition: {
      dextrose_g_L: 50,
      osmolarity_mOsm_L: 252
    },
    indications: [
      'Treatment of acute hypernatremia (provides pure free water without electrolyte load)',
      'Insulin-induced hypoglycemia and initial replenishment of glycogen stores',
      'Diluent for IV medications that precipitate in saline (e.g., Amiodarone)'
    ],
    contraindications: [
      'Resuscitation in acute hypovolemic shock (dextrose rapidly enters cells, leaving only 1/12th volume in intravascular space)',
      'Acute head injury / intracranial hypertension (precipitates cerebral edema)',
      'Hyperglycemia and diabetic ketoacidosis'
    ],
    nursingAlerts: [
      'Physiologically behaves as hypotonic free water inside the body.',
      'Rapid large infusions can trigger water intoxication and severe hyponatremia.'
    ]
  },
  {
    id: 'd10w',
    name: '10% Dextrose in Water (D10W / D25 / D50)',
    type: 'Crystalloid',
    tonicity: 'Hypertonic',
    composition: {
      dextrose_g_L: 100,
      osmolarity_mOsm_L: 505
    },
    indications: [
      'Acute emergency management of severe symptomatic hypoglycemia (< 50 mg/dL)',
      'Hyperkalemia management (co-administered with regular insulin to shift K+ into cells)',
      'Neonatal hypoglycemia and TPN (Total Parenteral Nutrition) regimens'
    ],
    contraindications: [
      'Hyperglycemia, diabetic coma, anuria',
      'Intracranial hemorrhage or active cerebral edema'
    ],
    nursingAlerts: [
      'Highly hypertonic; causes venous endothelial irritation and thrombophlebitis if infused through peripheral small veins for extended periods.',
      'Recheck capillary blood sugar 15 minutes post-infusion.'
    ]
  },
  {
    id: 'mannitol',
    name: 'Mannitol 20% IV Infusion',
    type: 'Osmotic Diuretic',
    tonicity: 'Hypertonic',
    composition: {
      osmolarity_mOsm_L: 1098
    },
    indications: [
      'Acute reduction of elevated Intracranial Pressure (ICP) in traumatic brain injury or brain tumor edema',
      'Reduction of high Intraocular Pressure (IOP) in acute angle-closure glaucoma crisis',
      'Promoting diuresis in prevention of acute renal failure in rhabdomyolysis / crush injuries'
    ],
    contraindications: [
      'Anuria due to severe established acute tubular necrosis',
      'Severe pulmonary edema or congestive heart failure (initially pulls fluid into vascular compartment -> triggers pulmonary flash edema)',
      'Active intracranial bleeding (except during craniotomy)',
      'Severe dehydration'
    ],
    nursingAlerts: [
      'Inspect bottle carefully before infusion; if crystals are present, warm in warm water bath to dissolve before administration.',
      'Must infuse through an in-line filter. Monitor urine output hourly with Foley catheter.'
    ]
  }
];

export const CANNULA_SPECS: CannulaSpec[] = [
  {
    gauge: '14G',
    colorName: 'Orange',
    hexColor: '#EA580C',
    outerDiameter: '2.1 mm',
    length: '45 mm',
    maxFlowRate: '300 mL/min',
    primaryIndications: ['Massive trauma resuscitation', 'Rapid blood / colloid transfusion', 'Major cardiovascular and transplant surgery'],
    recommendedVeins: 'Large proximal veins: Antecubital fossa, Median basilic, External jugular'
  },
  {
    gauge: '16G',
    colorName: 'Grey',
    hexColor: '#4B5563',
    outerDiameter: '1.8 mm',
    length: '45 mm',
    maxFlowRate: '200 mL/min',
    primaryIndications: ['Emergency major trauma', 'High-volume fluid resuscitation in burns/septic shock', 'Obstetric hemorrhage and major surgery'],
    recommendedVeins: 'Antecubital fossa, large forearm cephalic or basilic vein'
  },
  {
    gauge: '18G',
    colorName: 'Green',
    hexColor: '#16A34A',
    outerDiameter: '1.3 mm',
    length: '32-45 mm',
    maxFlowRate: '90-105 mL/min',
    primaryIndications: ['Standard blood and blood product transfusions', 'Major medical emergencies and surgical admissions', 'Viscous fluid infusions (TPN)'],
    recommendedVeins: 'Forearm veins (cephalic, accessory cephalic), Antecubital fossa'
  },
  {
    gauge: '20G',
    colorName: 'Pink',
    hexColor: '#DB2777',
    outerDiameter: '1.1 mm',
    length: '32 mm',
    maxFlowRate: '60-65 mL/min',
    primaryIndications: ['MOST COMMON ADULT CANNULA in routine hospital/clinic wards', 'Routine IV medications, antibiotics, and hydration', 'Elective surgeries'],
    recommendedVeins: 'Dorsal venous arch of hand, forearm cephalic/basilic veins'
  },
  {
    gauge: '22G',
    colorName: 'Blue',
    hexColor: '#2563EB',
    outerDiameter: '0.9 mm',
    length: '25 mm',
    maxFlowRate: '36 mL/min',
    primaryIndications: ['Elderly patients with fragile, sclerosed or small veins', 'Pediatric patients (> 1 year)', 'Standard non-rapid IV infusions'],
    recommendedVeins: 'Dorsum of hand, distal forearm'
  },
  {
    gauge: '24G',
    colorName: 'Yellow',
    hexColor: '#CA8A04',
    outerDiameter: '0.7 mm',
    length: '19 mm',
    maxFlowRate: '20-22 mL/min',
    primaryIndications: ['Neonates, infants, and young children', 'Extremely fragile, fragile cancer veins in oncology', 'Slow syringe-pump infusions'],
    recommendedVeins: 'Hand dorsum, saphenous vein at ankle, scalp veins in neonates'
  }
];

export const INJECTION_ANGLES: InjectionAngleSpec[] = [
  {
    type: 'Intramuscular (IM)',
    angle: 90,
    targetTissue: 'Deep Muscle layer below subcutaneous fat',
    gaugeRange: '21G to 23G (green / blue hub)',
    needleLength: '1 to 1.5 inches (25-38 mm)',
    commonSites: [
      'Deltoid muscle (upper arm, 2-3 fingerbreadths below acromion process; max 1-2 mL volume)',
      'Ventrogluteal site (preferred safe site; palm on greater trochanter, index on anterior superior iliac spine)',
      'Dorsogluteal site (upper outer quadrant of buttock; caution to avoid Sciatic nerve)',
      'Vastus Lateralis (anterolateral middle third of thigh; preferred in infants & toddlers)'
    ],
    medications: ['Vaccines (TT, Hepatitis B)', 'Diclofenac sodium', 'Ceftriaxone', 'Vitamin B12 / Neurobion', 'Haloperidol'],
    techniqueNotes: [
      'Always aspirate plunger gently for 5 seconds before injection (if blood appears, discard needle and do NOT inject).',
      'Use Z-track technique for irritating medications to prevent tracking into subcutaneous fat.',
      'Inject at steady rate (10 seconds per 1 mL), wait 10 seconds before smooth withdrawal.'
    ]
  },
  {
    type: 'Subcutaneous (SC)',
    angle: 45,
    targetTissue: 'Adipose (fat) tissue between dermis and muscle',
    gaugeRange: '25G to 27G (orange/grey hub)',
    needleLength: '3/8 to 5/8 inch (9.5 to 16 mm)',
    commonSites: [
      'Abdomen (periumbilical area, leaving 2 inches around umbilicus; fastest and most consistent absorption)',
      'Posterior aspect of upper arm',
      'Anterior aspect of thighs'
    ],
    medications: ['Insulin (Short, Intermediate, Long-acting)', 'Low Molecular Weight Heparins (Enoxaparin / Clexane)', 'Erythropoietin', 'Liraglutide / Semaglutide'],
    techniqueNotes: [
      'Pinch 2-inch skin fold between thumb and forefinger; insert needle at 45° angle (or 90° if using short 4-6mm insulin needle).',
      'Do NOT aspirate for Enoxaparin or Insulin.',
      'Do NOT rub or massage injection site after Enoxaparin (prevents subcutaneous hematoma and bruising).',
      'Rotate injection sites systematically in a grid to avoid lipodystrophy.'
    ]
  },
  {
    type: 'Intravenous (IV)',
    angle: 25,
    targetTissue: 'Venous lumen (Direct blood circulation)',
    gaugeRange: '18G to 24G Cannula / Butterfly needle',
    needleLength: '0.75 to 1.75 inches',
    commonSites: [
      'Cephalic vein of forearm',
      'Basilic vein of forearm',
      'Dorsal venous network on back of hand',
      'Median cubital vein in antecubital fossa'
    ],
    medications: ['Emergency resuscitative drugs (Adrenaline, Atropine)', 'Antibiotics (Piperacillin-Tazobactam, Ceftriaxone)', 'Analgesics (Paracetamol IV, Tramadol)', 'PPIs (Pantoprazole IV)'],
    techniqueNotes: [
      'Apply tourniquet 4-6 inches proximal to chosen site.',
      'Enter skin bevel up at 15-30° angle; watch for flash of blood in cannula flashback chamber.',
      'Lower angle parallel to skin, advance plastic cannula 2-3 mm, slide sheath into vein while keeping needle still.',
      'Release tourniquet before flushing with normal saline.'
    ]
  },
  {
    type: 'Intradermal (ID)',
    angle: 15,
    targetTissue: 'Dermis layer directly beneath epidermis',
    gaugeRange: '26G to 27G tuberculin syringe',
    needleLength: '3/8 to 0.5 inch (10-13 mm)',
    commonSites: [
      'Ventral (inner) surface of forearm (3-4 fingerbreadths below antecubital space)',
      'Upper back under scapula'
    ],
    medications: ['Mantoux test (Tuberculin PPD)', 'Antibiotic Sensitivity Testing (AST / Skin sensitivity test for Penicillin)', 'Rabies intradermal vaccine', 'BCG vaccine'],
    techniqueNotes: [
      'Stretch skin taut; insert needle bevel UP at very shallow 5° to 15° angle.',
      'Inject 0.05 to 0.1 mL slowly; a distinct raised pale bleb or wheal (6-10 mm) MUST appear.',
      'If wheal does not form, injection is too deep into subcutaneous tissue and must be repeated at another site.',
      'Do not massage or apply pressure to wheal.'
    ]
  }
];
