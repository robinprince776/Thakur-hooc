export type MediCoreTab =
  | 'overview'
  | 'diseases'
  | 'drugs'
  | 'iv-fluids'
  | 'pharmacy'
  | 'calculators'
  | 'anatomy'
  | 'favorites';

export interface DiseaseItem {
  id: string;
  name: string;
  category: 'Viral & Bacterial' | 'Respiratory' | 'Gastrointestinal' | 'Metabolic & Blood' | 'Pain & Dermatology';
  definition: string;
  causes: string[];
  clinicalSymptoms: string[];
  redFlags: string[]; // Urgent hospital referral signs
  otcCareAndSupportive: string[];
  lifestyleAdvice: string[];
  investigations: string[];
  tags: string[];
}

export interface DrugItem {
  id: string;
  genericName: string;
  commonIndianBrands: string[];
  drugClass:
    | 'Analgesics (NSAIDs / Antipyretic)'
    | 'Antibiotics'
    | 'Antacids & Anti-ulcer'
    | 'Antihistamines'
    | 'Antidiabetics'
    | 'Cardiovascular & Antihypertensive'
    | 'Vitamins & Supplements';
  mechanism: string;
  standardAdultDosage: string; // Reference only
  pregnancyCategory: 'A' | 'B' | 'C' | 'D' | 'X';
  contraindications: string[];
  commonSideEffects: string[];
  seriousAdverseEffects: string[];
  drugInteractions: { drug: string; risk: string; severity: 'High' | 'Moderate' }[];
  foodInteractions: string[];
  scheduleClass: 'Over The Counter (OTC)' | 'Schedule H' | 'Schedule H1' | 'Schedule X';
  storageInstructions: string;
}

export interface IvFluidItem {
  id: string;
  name: string;
  type: 'Crystalloid' | 'Colloid' | 'Osmotic Diuretic';
  composition: {
    na_mEq?: number;
    k_mEq?: number;
    cl_mEq?: number;
    ca_mEq?: number;
    lactate_mEq?: number;
    dextrose_g_L?: number;
    osmolarity_mOsm_L: number;
  };
  tonicity: 'Isotonic' | 'Hypotonic' | 'Hypertonic';
  indications: string[];
  contraindications: string[];
  nursingAlerts: string[];
}

export interface CannulaSpec {
  gauge: string;
  colorName: string;
  hexColor: string;
  outerDiameter: string;
  length: string;
  maxFlowRate: string; // ml/min
  primaryIndications: string[];
  recommendedVeins: string;
}

export interface InjectionAngleSpec {
  type: 'Intramuscular (IM)' | 'Subcutaneous (SC)' | 'Intravenous (IV)' | 'Intradermal (ID)';
  angle: number;
  targetTissue: string;
  gaugeRange: string;
  needleLength: string;
  commonSites: string[];
  medications: string[];
  techniqueNotes: string[];
}

export interface RxTerm {
  abbreviation: string;
  latinTerm?: string;
  englishMeaning: string;
  hinglishMeaning: string;
  exampleRx: string;
  category: 'Frequency' | 'Timing' | 'Route' | 'Quantity & Special';
}

export interface PharmacyRuleTopic {
  id: string;
  title: string;
  subtitle: string;
  category: 'Inventory & Storage' | 'Drug Law & Schedules' | 'Emergency Kit' | 'Prescription Dispensing';
  keyRules: string[];
  clinicalSignificance: string;
  checklistOrSteps: string[];
}
