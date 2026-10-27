import { RxTerm, PharmacyRuleTopic } from '../types';

export const RX_DECODER_DATA: RxTerm[] = [
  // --- FREQUENCY ---
  {
    abbreviation: 'OD',
    latinTerm: 'Omni Die',
    englishMeaning: 'Once a day',
    hinglishMeaning: 'Din me ek baar',
    exampleRx: 'Tab. Telmisartan 40 mg OD morning',
    category: 'Frequency'
  },
  {
    abbreviation: 'BD / BID',
    latinTerm: 'Bis In Die',
    englishMeaning: 'Twice a day (approx every 12 hrs)',
    hinglishMeaning: 'Din me do baar (subah aur shaam)',
    exampleRx: 'Tab. Amox-Clav 625 mg BD PC',
    category: 'Frequency'
  },
  {
    abbreviation: 'TDS / TID',
    latinTerm: 'Ter Die Sumendum / Ter In Die',
    englishMeaning: 'Three times a day (approx every 8 hrs)',
    hinglishMeaning: 'Din me teen baar (subah, dopahar, raat)',
    exampleRx: 'Tab. Metronidazole 400 mg TDS',
    category: 'Frequency'
  },
  {
    abbreviation: 'QID',
    latinTerm: 'Quater In Die',
    englishMeaning: 'Four times a day (approx every 6 hrs)',
    hinglishMeaning: 'Din me chaar baar',
    exampleRx: 'Syp. Sucralfate 10 ml QID',
    category: 'Frequency'
  },
  {
    abbreviation: 'SOS',
    latinTerm: 'Si Opus Sit',
    englishMeaning: 'In emergency / As needed only when required',
    hinglishMeaning: 'Zaroorat padne par / jab dard ya takleef ho',
    exampleRx: 'Tab. Paracetamol 650 mg SOS for fever > 100°F',
    category: 'Frequency'
  },
  {
    abbreviation: 'PRN',
    latinTerm: 'Pro Re Nata',
    englishMeaning: 'As the circumstance arises / when necessary',
    hinglishMeaning: 'Jab zaroorat ho (pain/nausea)',
    exampleRx: 'Tab. Ondansetron 4 mg PRN for vomiting',
    category: 'Frequency'
  },
  {
    abbreviation: 'STAT',
    latinTerm: 'Statim',
    englishMeaning: 'Immediately / At once (Emergency single dose)',
    hinglishMeaning: 'Turant / isi waqt ek baar',
    exampleRx: 'Tab. Aspirin 300 mg STAT chewed for chest pain',
    category: 'Frequency'
  },

  // --- TIMING ---
  {
    abbreviation: 'AC',
    latinTerm: 'Ante Cibum',
    englishMeaning: 'Before meals (30-45 minutes before food)',
    hinglishMeaning: 'Khana khane se pehle (empty stomach)',
    exampleRx: 'Cap. Pantoprazole 40 mg AC breakfast',
    category: 'Timing'
  },
  {
    abbreviation: 'PC',
    latinTerm: 'Post Cibum',
    englishMeaning: 'After meals (after food)',
    hinglishMeaning: 'Khana khane ke baad',
    exampleRx: 'Tab. Ibuprofen 400 mg PC',
    category: 'Timing'
  },
  {
    abbreviation: 'HS',
    latinTerm: 'Hora Somni',
    englishMeaning: 'At bedtime (before sleep)',
    hinglishMeaning: 'Raat ko sone se pehle',
    exampleRx: 'Tab. Atorvastatin 20 mg HS',
    category: 'Timing'
  },
  {
    abbreviation: 'BBF',
    latinTerm: 'Before Breakfast',
    englishMeaning: 'Before breakfast in morning',
    hinglishMeaning: 'Subah naashte se pehle',
    exampleRx: 'Tab. Levothyroxine 50 mcg BBF with glass of water',
    category: 'Timing'
  },

  // --- ROUTE ---
  {
    abbreviation: 'PO',
    latinTerm: 'Per Os',
    englishMeaning: 'By mouth / Orally',
    hinglishMeaning: 'Munh ke zariye / peena ya nigalna',
    exampleRx: 'Tab. Metformin 500 mg PO with meals',
    category: 'Route'
  },
  {
    abbreviation: 'SL',
    latinTerm: 'Sub Lingua',
    englishMeaning: 'Sublingual (under the tongue)',
    hinglishMeaning: 'Jeebh ke neeche rakh kar chusna',
    exampleRx: 'Tab. Sorbitrate 5 mg SL for angina',
    category: 'Route'
  },
  {
    abbreviation: 'PR',
    latinTerm: 'Per Rectum',
    englishMeaning: 'Rectally (suppository or enema)',
    hinglishMeaning: 'Guda marg (rectum) ke zariye',
    exampleRx: 'Supp. Paracetamol 170 mg PR in febrile child',
    category: 'Route'
  },
  {
    abbreviation: 'IM',
    latinTerm: 'Intra Muscular',
    englishMeaning: 'Intramuscular injection (into muscle 90°)',
    hinglishMeaning: 'Manspeshi me injection',
    exampleRx: 'Inj. TT 0.5 ml IM stat',
    category: 'Route'
  },
  {
    abbreviation: 'IV',
    latinTerm: 'Intra Venous',
    englishMeaning: 'Intravenous injection / infusion (into vein 25°)',
    hinglishMeaning: 'Nas (vein) ke andar direct injection',
    exampleRx: 'Inj. Ceftriaxone 1g IV BD in NS',
    category: 'Route'
  },
  {
    abbreviation: 'SC / SubQ',
    latinTerm: 'Sub Cutis',
    englishMeaning: 'Subcutaneous injection (fat layer 45°)',
    hinglishMeaning: 'Chhamdi ke neeche fat layer me injection',
    exampleRx: 'Inj. Regular Insulin 8 Units SC 15 mins before meals',
    category: 'Route'
  },

  // --- SPECIAL LATIN TERMS ---
  {
    abbreviation: 'q.s.',
    latinTerm: 'Quantum Sufficit',
    englishMeaning: 'As much as is sufficient / enough quantity to make up volume',
    hinglishMeaning: 'Jitni zaroorat ho utna paryapt matra me milayein',
    exampleRx: 'Aqua destillata q.s. ad 100 mL',
    category: 'Quantity & Special'
  },
  {
    abbreviation: 'ad lib.',
    latinTerm: 'Ad Libitum',
    englishMeaning: 'Freely, at pleasure, as much as desired',
    hinglishMeaning: 'Jitni marzi chahe utna lene ki ijaazat',
    exampleRx: 'Fluids ad libitum in mild dehydration',
    category: 'Quantity & Special'
  },
  {
    abbreviation: 'gtt.',
    latinTerm: 'Gutta / Guttae',
    englishMeaning: 'Drops',
    hinglishMeaning: 'Boond / boondein (eye/ear drops)',
    exampleRx: 'Gtt. Moxifloxacin ii in right eye TDS',
    category: 'Quantity & Special'
  },
  {
    abbreviation: 'm.d.u.',
    latinTerm: 'More Dicto Utendus',
    englishMeaning: 'To be used as directed by physician',
    hinglishMeaning: 'Doctor ke bataye anusaar istemaal karein',
    exampleRx: 'Ointment m.d.u.',
    category: 'Quantity & Special'
  }
];

export const PHARMACY_RULES_DATA: PharmacyRuleTopic[] = [
  {
    id: 'fefo-fifo',
    title: 'FEFO vs FIFO Inventory Protocols',
    subtitle: 'Expiry Management in Community Pharmacy',
    category: 'Inventory & Storage',
    keyRules: [
      'FEFO (First Expiry, First Out): Products with the closest expiration date MUST be placed in front and dispensed FIRST, regardless of when they arrived in stock.',
      'FIFO (First In, First Out): The earliest batch purchased is dispensed first (only safe if expiration dates are identical).',
      'GOLD RULE: In pharmaceuticals, FEFO ALWAYS overrides FIFO. A newer delivery with a 6-month expiry must be dispensed before an older delivery with a 2-year expiry.'
    ],
    clinicalSignificance:
      'Prevents dispensing expired medications which have degraded chemical potency, altered bioavailability, or formed toxic degradation products (e.g., degraded Tetracyclines cause severe Fanconi renal syndrome).',
    checklistOrSteps: [
      '1. Monthly Expiry Audit: Tag medicines expiring within 3 to 6 months with brightly colored stickers ("Short Expiry Alert").',
      '2. Physical Placement: Always push new incoming cartons to the back of the shelf and pull existing stock with nearer expiry to the front.',
      '3. Near-Expiry Return: Return stock to pharmaceutical distributor 60-90 days before expiry date as per vendor agreement.',
      '4. Segregation: Expired stock must be immediately removed from active sales racks and kept in a locked, clearly labeled "EXPIRED GOODS - NOT FOR SALE" box.'
    ]
  },
  {
    id: 'cold-chain',
    title: 'Cold Chain Management (2°C to 8°C)',
    subtitle: 'Preserving Heat-Sensitive Biologicals',
    category: 'Inventory & Storage',
    keyRules: [
      'Temperature Range: Strict 2.0°C to 8.0°C at all times. Never allow biologicals to freeze (< 0°C) or overheat (> 8°C).',
      'What belongs in Cold Chain: All Insulins, Vaccines (TT, Rabies, Hep B, Polio), Immunoglobulins (Rabies, Tetanus), Oxytocin, Erythropoietin, Monoclonal antibodies, reconstituted probiotic drops.',
      'Do NOT store items in the refrigerator door shelves (frequent opening causes severe temperature fluctuations). Place in the center/middle rack.'
    ],
    clinicalSignificance:
      'Protein and peptide molecules undergo irreversible thermal denaturation when exposed to ambient heat or freezing. Frozen vaccines break emulsion and lose immunogenicity completely; spoiled insulin precipitates and causes severe diabetic ketoacidosis due to loss of bio-potency.',
    checklistOrSteps: [
      '1. Dedicated Pharmaceutical Refrigerator (No food or drink permitted inside).',
      '2. Calibrated Digital Minimum-Maximum Thermometer with data logger.',
      '3. Twice-daily temperature recording (9:00 AM and 6:00 PM) signed in temperature log register.',
      '4. Power Backup: Mandatory Inverter or Generator support for power outages.',
      '5. Ice packs conditioning: Keep conditioned frozen ice packs in deep freezer for emergency transfer to vaccine carriers.'
    ]
  },
  {
    id: 'schedule-h-h1',
    title: 'Schedule H & H1 Drug Compliance',
    subtitle: 'Drugs and Cosmetics Rules, 1945 (India)',
    category: 'Drug Law & Schedules',
    keyRules: [
      'Schedule H: Prescription drugs. Must be sold by retail ONLY against the prescription of a Registered Medical Practitioner (RMP). Dispensing without prescription is a criminal offense under Section 18/27.',
      'Schedule H1 (Introduced 2013): 46 restricted high-potency drugs including third/fourth-generation cephalosporins (Cefixime, Cefpodoxime), Fluoroquinolones (Levofloxacin, Ciprofloxacin, Moxifloxacin), Carbapenems (Meropenem), Anti-TB drugs (Rifampicin, Isoniazid), and habit-forming Zolpidem, Alprazolam.',
      'Schedule H1 Mandatory Register: Every retail sale of Schedule H1 drugs MUST be entered into a separate dedicated register.'
    ],
    clinicalSignificance:
      'Prevents rampant antimicrobial resistance (AMR), multidrug-resistant tuberculosis (MDR-TB), and widespread substance abuse/dependence of psychotropic sedative-hypnotics.',
    checklistOrSteps: [
      '1. Verify Registered Medical Practitioner credentials & date on prescription.',
      '2. Enter in Schedule H1 Register: Date of dispensing, Patient name & full address, Prescribing Doctor name & address, Name of drug, Batch number, and Quantity supplied.',
      '3. Retain Schedule H1 registers and physical/digital prescription records for minimum 3 YEARS.',
      '4. Ensure packaging has the mandatory warning: Red box with symbol "Rx" and red vertical warning band.'
    ]
  },
  {
    id: 'anaphylaxis-kit',
    title: 'Clinic Emergency Anaphylaxis Kit',
    subtitle: 'Life-Saving Drugs for Severe Allergic Reactions',
    category: 'Emergency Kit',
    keyRules: [
      'Anaphylaxis is an acute, life-threatening multi-system allergic reaction developing within minutes of drug injection (penicillins, NSAIDs, contrast media) or insect stings.',
      'FIRST-LINE DRUG OF CHOICE IS ALWAYS INTRAMUSCULAR ADRENALINE (EPINEPHRINE). There is NO absolute contraindication to adrenaline in anaphylaxis.',
      'Never give adrenaline subcutaneously in anaphylaxis (subcutaneous vasoconstriction delays absorption; IM deltoid/vastus lateralis is fastest).'
    ],
    clinicalSignificance:
      'Adrenaline stimulates alpha-1 (reverses vasodilation and mucosal angioedema), beta-1 (increases cardiac contractility and BP), and beta-2 receptors (potent bronchodilation and inhibits further mast cell degranulation).',
    checklistOrSteps: [
      '1. Inj. Adrenaline (Epinephrine) 1:1000 (1 mg/mL) ampoules: Adult dose 0.5 mg (0.5 mL) IM into anterolateral thigh immediately; repeat every 5-15 mins if no response.',
      '2. Inj. Hydrocortisone Sodium Succinate 100 mg / 200 mg IV (prevents biphasic / late-phase anaphylaxis).',
      '3. Inj. Pheniramine Maleate (Avil) 22.75 mg (2 mL) IV/IM (H1-receptor antagonist for urticaria).',
      '4. Inj. Dexamethasone 4 mg / 8 mg IV/IM.',
      '5. Normal Saline (0.9% NaCl) 500 mL IV bottles with blood infusion/macro set (rapid IV fluid bolus 1-2 Litres for anaphylactic shock).',
      '6. IV Cannulas (16G, 18G Green) & Tourniquet.',
      '7. High-flow Oxygen with non-rebreather mask (10-15 L/min).',
      '8. Bag-Valve-Mask (Ambu Bag) & Guedel Oral Airways (Sizes 2, 3, 4).'
    ]
  }
];
