import { DrugItem } from '../types';

export const DRUGS_DATA: DrugItem[] = [
  // --- ANALGESICS & ANTIPYRETICS ---
  {
    id: 'paracetamol',
    genericName: 'Paracetamol (Acetaminophen)',
    commonIndianBrands: ['Dolo 650', 'Calpol 500/650', 'Crocin 650', 'Pacimol', 'P-650'],
    drugClass: 'Analgesics (NSAIDs / Antipyretic)',
    mechanism: 'Inhibits central prostaglandin synthesis via COX enzyme inhibition in CNS; acts on hypothalamic heat-regulating center to produce antipyresis via peripheral vasodilation and sweating.',
    standardAdultDosage: '500 mg to 650 mg orally every 4 to 6 hours as needed. Maximum daily dose: 4,000 mg (4 g) in healthy adults; reduce to 2,000 mg in chronic liver disease or alcoholics.',
    pregnancyCategory: 'B',
    contraindications: ['Severe active hepatic impairment or acute liver failure', 'Known hypersensitivity to paracetamol'],
    commonSideEffects: ['Nausea', 'Mild epigastric discomfort', 'Rash / allergic pruritus (rare)'],
    seriousAdverseEffects: ['Hepatotoxicity / Centrilobular hepatic necrosis (in overdose > 10-15 g)', 'Stevens-Johnson Syndrome (rare)'],
    drugInteractions: [
      { drug: 'Warfarin / Blood Thinners', risk: 'Prolonged high-dose paracetamol (> 2g/day for > 4 days) can enhance hypoprothrombinemic response and increase INR/bleeding risk.', severity: 'Moderate' },
      { drug: 'Alcohol (Ethanol)', risk: 'Chronic heavy alcohol consumption induces CYP2E1, converting paracetamol into hepatotoxic metabolite NAPQI rapidly.', severity: 'High' },
      { drug: 'Isoniazid (Anti-TB)', risk: 'Significantly potentiates paracetamol hepatotoxicity.', severity: 'High' }
    ],
    foodInteractions: ['High-carbohydrate or high-pectin meals can delay paracetamol absorption speed, though total bioavailability is unchanged.'],
    scheduleClass: 'Over The Counter (OTC)',
    storageInstructions: 'Store below 25°C in a dry place protected from direct sunlight.'
  },
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofen',
    commonIndianBrands: ['Brufen 400', 'Ibugesic', 'Combiflam (with Paracetamol)'],
    drugClass: 'Analgesics (NSAIDs / Antipyretic)',
    mechanism: 'Non-selective reversible inhibition of Cyclooxygenase (COX-1 and COX-2) enzymes, halting synthesis of pro-inflammatory prostaglandins and thromboxane.',
    standardAdultDosage: '400 mg orally every 6 to 8 hours with or after meals. Maximum daily dose: 2,400 mg/day for anti-inflammatory effect; OTC analgesic max: 1,200 mg/day.',
    pregnancyCategory: 'D',
    contraindications: [
      'Active peptic ulcer disease or GI bleeding history',
      'Severe heart failure (NYHA Class IV)',
      'Severe renal impairment (eGFR < 30 mL/min)',
      'Third trimester of pregnancy (causes premature closure of ductus arteriosus & oligohydramnios)',
      'Aspirin-induced asthma / triad (cross-reactivity bronchospasm)'
    ],
    commonSideEffects: ['Dyspepsia, heartburn, nausea', 'Fluid retention, peripheral ankle edema', 'Dizziness, headache'],
    seriousAdverseEffects: ['Gastrointestinal ulceration and perforation', 'Acute kidney injury (prerenal azotemia via renal afferent arteriolar constriction)', 'Increased cardiovascular thrombotic risk (MI, stroke)'],
    drugInteractions: [
      { drug: 'Aspirin / Clopidogrel / Blood Thinners', risk: 'Synergistic damage to gastric mucosa and platelet inhibition -> catastrophic GI bleeding.', severity: 'High' },
      { drug: 'ACE Inhibitors / ARBs (e.g. Telmisartan, Ramipril)', risk: 'Blunts antihypertensive action and precipitates acute hyperkalemic renal failure (The "Triple Whammy" with Diuretics).', severity: 'High' },
      { drug: 'Lithium', risk: 'Reduces renal lithium clearance, causing toxic lithium accumulation.', severity: 'High' }
    ],
    foodInteractions: ['Always take with milk or after food to minimize direct gastric mucosal irritation.'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store at room temperature (15-30°C) away from moisture.'
  },
  {
    id: 'diclofenac',
    genericName: 'Diclofenac Sodium / Potassium',
    commonIndianBrands: ['Voveran 50/SR 100', 'Dynapar AQ (Injection)', 'Diclogesic', 'Volini (Topical)'],
    drugClass: 'Analgesics (NSAIDs / Antipyretic)',
    mechanism: 'Potent non-steroidal anti-inflammatory drug inhibiting COX-1 and COX-2; reduces intracellular arachidonic acid availability.',
    standardAdultDosage: '50 mg orally 2-3 times daily or 75-100 mg sustained release (SR) once daily after meals. IM: 75 mg deep intragluteal injection.',
    pregnancyCategory: 'D',
    contraindications: [
      'Established ischemic heart disease, peripheral arterial disease, cerebrovascular disease',
      'Active gastric/peptic ulceration or active bleeding',
      'Third trimester of pregnancy',
      'Severe hepatic or renal failure'
    ],
    commonSideEffects: ['Epigastric pain, nausea, bloating', 'Headache, transient dizziness', 'Injection site pain and sterile abscess risk if injected superficially'],
    seriousAdverseEffects: ['Significantly higher cardiovascular thrombotic risk compared to other non-selective NSAIDs', 'Severe GI ulceration & hemorrhage', 'Idiosyncratic hepatotoxicity (check LFTs in chronic use)'],
    drugInteractions: [
      { drug: 'Anticoagulants (Heparin, Warfarin, Apixaban)', risk: 'Severe GI and systemic hemorrhage.', severity: 'High' },
      { drug: 'Methotrexate', risk: 'Inhibits renal tubular clearance of methotrexate -> life-threatening bone marrow suppression.', severity: 'High' },
      { drug: 'Cyclosporine / Tacrolimus', risk: 'Additive nephrotoxicity.', severity: 'High' }
    ],
    foodInteractions: ['Take immediately after meals to reduce gastric contact. Avoid alcohol as it compounds gastric bleeding risk.'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store below 30°C in an airtight container.'
  },

  // --- ANTIBIOTICS ---
  {
    id: 'amox-clav',
    genericName: 'Amoxicillin + Clavulanic Acid (Co-Amoxiclav)',
    commonIndianBrands: ['Augmentin 625', 'Moxikind-CV 625', 'Clavam 625', 'Mega-CV'],
    drugClass: 'Antibiotics',
    mechanism: 'Amoxicillin inhibits bacterial cell wall peptidoglycan synthesis (bactericidal); Clavulanic acid acts as a suicide inhibitor of bacterial beta-lactamase enzymes, restoring amoxicillin potency against resistant organisms.',
    standardAdultDosage: '625 mg (500mg Amox + 125mg Clav) orally twice daily (every 12 hrs) or three times daily for severe infections, taken at the start of a meal.',
    pregnancyCategory: 'B',
    contraindications: [
      'History of penicillin or beta-lactam allergy (anaphylaxis, angioedema)',
      'History of amoxicillin/clavulanate-associated cholestatic jaundice or hepatic dysfunction'
    ],
    commonSideEffects: ['Diarrhea (clavulanate accelerates gut motility)', 'Nausea, vomiting', 'Candidiasis / oral thrush or vaginal yeast infection'],
    seriousAdverseEffects: ['Anaphylactic shock', 'Pseudomembranous colitis (Clostridioides difficile overgrowth)', 'Cholestatic jaundice / acute hepatitis'],
    drugInteractions: [
      { drug: 'Allopurinol', risk: 'Substantially increases incidence of generalized erythematous maculopapular rash.', severity: 'Moderate' },
      { drug: 'Oral Contraceptives (Birth control pills)', risk: 'May reduce enterohepatic recirculation of estrogen, potentially decreasing contraceptive efficacy.', severity: 'Moderate' },
      { drug: 'Methotrexate', risk: 'Decreases renal tubular excretion of methotrexate, increasing toxicity.', severity: 'High' }
    ],
    foodInteractions: ['Administer at the start of a meal to optimize absorption of clavulanic acid and minimize GI intolerance/nausea.'],
    scheduleClass: 'Schedule H1',
    storageInstructions: 'Tablets: Store in moisture-proof blister below 25°C. Reconstituted pediatric dry syrup: Store in refrigerator (2-8°C) and use within 7 days.'
  },
  {
    id: 'azithromycin',
    genericName: 'Azithromycin',
    commonIndianBrands: ['Azithral 250/500', 'Azee 500', 'Zady', 'Azax'],
    drugClass: 'Antibiotics',
    mechanism: 'Macrolide antibiotic that reversibly binds to the 50S ribosomal subunit of susceptible microorganisms, inhibiting RNA-dependent protein synthesis (bacteriostatic). Accumulates in high concentrations within phagocytes and tissues.',
    standardAdultDosage: '500 mg orally once daily for 3 consecutive days, OR 500 mg on Day 1 followed by 250 mg once daily on Days 2 to 5 (total 1.5 g course).',
    pregnancyCategory: 'B',
    contraindications: [
      'Hypersensitivity to azithromycin, erythromycin, or any macrolide',
      'History of cholestatic jaundice/hepatic impairment with prior azithromycin use',
      'Congenital long QT syndrome or concurrent use of QT-prolonging drugs'
    ],
    commonSideEffects: ['Abdominal cramping, loose motions, nausea', 'Flatulence, metallic taste', 'Headache'],
    seriousAdverseEffects: ['QT prolongation and Torsades de Pointes ventricular arrhythmia', 'Hepatotoxicity / acute cholestatic hepatitis', 'Severe C. difficile-associated colitis'],
    drugInteractions: [
      { drug: 'Antacids containing Aluminum or Magnesium (e.g., Gelusil, Digene)', risk: 'Reduces peak serum concentration of azithromycin by ~24%. Take azithromycin at least 1 hr before or 2 hrs after antacids.', severity: 'Moderate' },
      { drug: 'Antiarrhythmics (Amiodarone, Sotalol) & Antipsychotics', risk: 'Additive QT interval prolongation and fatal cardiac arrhythmia risk.', severity: 'High' },
      { drug: 'Digoxin', risk: 'Elevates serum digoxin levels by altering gut flora and P-glycoprotein transport.', severity: 'High' }
    ],
    foodInteractions: ['Can be taken with or without food. However, taking with food reduces GI discomfort.'],
    scheduleClass: 'Schedule H1',
    storageInstructions: 'Store below 30°C in a dry place.'
  },
  {
    id: 'ciprofloxacin',
    genericName: 'Ciprofloxacin',
    commonIndianBrands: ['Ciplox 500', 'Cifran 500', 'Zoxan'],
    drugClass: 'Antibiotics',
    mechanism: 'Fluoroquinolone antibiotic that inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, preventing bacterial DNA replication, transcription, and repair (rapidly bactericidal).',
    standardAdultDosage: '250 mg to 500 mg orally twice daily (every 12 hrs) for 5-14 days depending on infection type and severity.',
    pregnancyCategory: 'C',
    contraindications: [
      'Concurrent administration of Tizanidine (causes severe hypotension)',
      'Known hypersensitivity to fluoroquinolones',
      'History of tendon disorders or tendinitis related to quinolone use',
      'Myasthenia gravis (exacerbates muscle weakness)'
    ],
    commonSideEffects: ['Nausea, diarrhea, dyspepsia', 'Dizziness, insomnia, restlessness', 'Cutaneous photosensitivity'],
    seriousAdverseEffects: [
      'Black Box Warning: Tendinitis and tendon rupture (especially Achilles tendon; risk elevated in elderly & concurrent steroids)',
      'Peripheral neuropathy (burning pain, numbness, paresthesia - can be permanent)',
      'Central nervous system toxicities (seizures, psychosis, toxic confusion)',
      'Aortic aneurysm rupture or dissection risk'
    ],
    drugInteractions: [
      { drug: 'Theophylline', risk: 'Ciprofloxacin inhibits CYP1A2, elevating theophylline serum levels into toxic ranges (seizures, arrhythmias).', severity: 'High' },
      { drug: 'Oral Antidiabetics (Sulfonylureas / Insulin)', risk: 'Severe refractory hypoglycemia or hyperglycemia.', severity: 'High' },
      { drug: 'NSAIDs (e.g. Ibuprofen)', risk: 'Concurrent use increases risk of CNS stimulation and epileptic convulsive seizures.', severity: 'High' }
    ],
    foodInteractions: [
      'CRITICAL: Dairy products (milk, yogurt, cheese) and calcium-fortified beverages chelate ciprofloxacin in the gut lumen, reducing absorption by up to 80%! Take ciprofloxacin 2 hours before or 6 hours after dairy or calcium supplements.'
    ],
    scheduleClass: 'Schedule H1',
    storageInstructions: 'Store below 25°C away from direct sunlight.'
  },

  // --- ANTACIDS & ANTI-ULCER ---
  {
    id: 'pantoprazole',
    genericName: 'Pantoprazole',
    commonIndianBrands: ['Pan 40', 'Pantocid 40', 'Pantodac', 'Pan-D (with Domperidone)'],
    drugClass: 'Antacids & Anti-ulcer',
    mechanism: 'Substituted benzimidazole proton pump inhibitor (PPI). Accumulates in the acidic secretory canaliculi of gastric parietal cells and irreversibly inhibits the H+/K+-ATPase enzyme system, blocking the final common pathway of gastric acid secretion.',
    standardAdultDosage: '40 mg orally once daily in the morning, 30 to 60 minutes before breakfast. In severe reflux or Zollinger-Ellison, 40 mg twice daily.',
    pregnancyCategory: 'B',
    contraindications: ['Known hypersensitivity to pantoprazole or other PPIs', 'Concurrent use with Rilpivirine (HIV medication)'],
    commonSideEffects: ['Headache', 'Diarrhea or mild constipation', 'Flatulence, abdominal pain', 'Dry mouth'],
    seriousAdverseEffects: [
      'Long-term use (> 1 year): Hypomagnesemia (tetany, arrhythmias)',
      'Increased risk of osteoporosis and bone fractures (due to decreased intestinal calcium carbonate ionization)',
      'Vitamin B12 deficiency (reduced acid-dependent protein cleavage)',
      'Increased susceptibility to C. difficile colitis and community-acquired pneumonia'
    ],
    drugInteractions: [
      { drug: 'Clopidogrel', risk: 'Pantoprazole has minimal CYP2C19 interaction compared to omeprazole, but potential slight attenuation of antiplatelet activation remains debated.', severity: 'Moderate' },
      { drug: 'Ketoconazole / Itraconazole', risk: 'Markedly reduces gastric absorption of azole antifungals requiring acidic pH.', severity: 'High' },
      { drug: 'Methotrexate', risk: 'Can inhibit renal BCRP transporter, leading to toxic methotrexate accumulation.', severity: 'High' }
    ],
    foodInteractions: ['Must be swallowed whole without crushing or chewing, ideally 30-45 minutes before the first meal of the day for maximal H+/K+-ATPase suppression.'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store in blister packs below 30°C protected from moisture.'
  },

  // --- ANTIHISTAMINES ---
  {
    id: 'levocetirizine',
    genericName: 'Levocetirizine Dihydrochloride',
    commonIndianBrands: ['Vozet', 'L-Hist', 'Levocet', 'Monticope (with Montelukast)'],
    drugClass: 'Antihistamines',
    mechanism: 'Active R-enantiomer of cetirizine; selective, high-affinity peripheral H1-receptor antagonist. Blocks histamine-mediated vascular dilation, capillary permeability, and sensory nerve ending stimulation with minimal CNS penetration.',
    standardAdultDosage: '5 mg orally once daily in the evening / bedtime. Reduce to 2.5 mg or every other day in moderate-to-severe renal impairment (eGFR 30-50 mL/min).',
    pregnancyCategory: 'B',
    contraindications: [
      'End-stage renal disease (ESRD / eGFR < 10 mL/min) or patients undergoing hemodialysis',
      'Children 6 months to 11 years with renal impairment'
    ],
    commonSideEffects: ['Mild somnolence / drowsiness', 'Fatigue, dry mouth', 'Nasopharyngitis'],
    seriousAdverseEffects: ['Severe hypersensitivity / angioedema (rare)', 'Urinary retention in patients with benign prostatic hyperplasia (BPH)'],
    drugInteractions: [
      { drug: 'Alcohol & CNS Depressants (Sedatives, Benzodiazepines)', risk: 'Additive central nervous system depression, marked psychomotor impairment.', severity: 'High' },
      { drug: 'Theophylline', risk: 'Slight decrease (16%) in levocetirizine clearance.', severity: 'Moderate' }
    ],
    foodInteractions: ['Food does not affect the extent of absorption, but delays the time to peak concentration (Tmax).'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store below 25°C in a dry place.'
  },

  // --- ANTIDIABETICS ---
  {
    id: 'metformin',
    genericName: 'Metformin Hydrochloride',
    commonIndianBrands: ['Glycomet 500/850/1000', 'Glucophage', 'Obimet', 'Cetapin'],
    drugClass: 'Antidiabetics',
    mechanism: 'Biguanide antihyperglycemic agent. Activates AMP-activated protein kinase (AMPK), suppresses hepatic gluconeogenesis, increases peripheral insulin sensitivity in skeletal muscle, and slows intestinal glucose absorption. Does NOT stimulate pancreatic beta cells, hence does not cause hypoglycemia as monotherapy.',
    standardAdultDosage: 'Initial: 500 mg orally with breakfast or dinner. Titrate weekly by 500 mg increments. Maintenance: 1,500 mg to 2,000 mg/day in divided doses. Max: 2,550 mg/day (or 2,000 mg for SR formulation).',
    pregnancyCategory: 'B',
    contraindications: [
      'Severe renal impairment: eGFR < 30 mL/min/1.73m² (risk of lactic acidosis)',
      'Acute or chronic metabolic acidosis (including Diabetic Ketoacidosis)',
      'Severe hypoxemic conditions: Acute decompensated heart failure, cardiogenic/septic shock, severe hepatic failure',
      'Patients undergoing iodinated radiocontrast procedures (withhold 48h prior & post)'
    ],
    commonSideEffects: ['Gastrointestinal disturbance: Metallic taste, anorexia, nausea, abdominal bloating, watery diarrhea (often transient)'],
    seriousAdverseEffects: [
      'Lactic Acidosis (rare but 50% mortality; presents with malaise, myalgia, Kussmaul breathing, hypothermia, hypotension)',
      'Long-term Vitamin B12 deficiency / peripheral neuropathy due to malabsorption at terminal ileum'
    ],
    drugInteractions: [
      { drug: 'Iodinated Radiographic Contrast Media', risk: 'Acute contrast-induced nephropathy leading to massive metformin accumulation and fatal lactic acidosis. Withhold 48 hrs before and after scan.', severity: 'High' },
      { drug: 'Alcohol', risk: 'Potentiates metformin effect on lactate metabolism and increases lactic acidosis risk exponentially.', severity: 'High' },
      { drug: 'Cimetidine / Dolutegravir', risk: 'Inhibits organic cation transporter (OCT2), elevating metformin serum levels.', severity: 'Moderate' }
    ],
    foodInteractions: ['Always administer with or immediately after meals to buffer gastrointestinal irritation.'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store at 20°C to 25°C protected from light and moisture.'
  },

  // --- CARDIOVASCULAR & ANTIHYPERTENSIVE ---
  {
    id: 'amlodipine',
    genericName: 'Amlodipine Besylate',
    commonIndianBrands: ['Amlong 2.5/5/10', 'Stamlo', 'Amlopin', 'Amlokind'],
    drugClass: 'Cardiovascular & Antihypertensive',
    mechanism: 'Long-acting third-generation dihydropyridine calcium channel blocker (CCB). Inhibits transmembrane influx of extracellular calcium ions into vascular smooth muscle cells and cardiac muscle through L-type channels, causing marked peripheral arterial vasodilation and reduction in systemic vascular resistance (afterload).',
    standardAdultDosage: 'Initial: 5 mg orally once daily. May be increased to a maximum of 10 mg once daily after 1-2 weeks based on blood pressure response. Initial 2.5 mg in frail elderly or hepatic impairment.',
    pregnancyCategory: 'C',
    contraindications: [
      'Severe hypotension (systolic BP < 90 mmHg)',
      'Cardiogenic shock',
      'Severe obstructive aortic stenosis',
      'Unstable angina (except vasospastic / Prinzmetal angina)'
    ],
    commonSideEffects: ['Dose-dependent peripheral ankle / pedal edema (due to precapillary arteriolar dilation without venous dilation)', 'Facial flushing, sensation of warmth', 'Dizziness, fatigue, palpitations'],
    seriousAdverseEffects: ['Severe reflex tachycardia / hypotension', 'Gingival hyperplasia (gum enlargement after chronic use)'],
    drugInteractions: [
      { drug: 'Simvastatin', risk: 'Amlodipine increases simvastatin exposure (CYP3A4 inhibition). Limit simvastatin dose to maximum 20 mg/day when co-administered.', severity: 'High' },
      { drug: 'CYP3A4 Inhibitors (Ketoconazole, Itraconazole, Clarithromycin)', risk: 'Markedly increases amlodipine plasma levels and causes profound hypotension.', severity: 'High' }
    ],
    foodInteractions: ['Grapefruit and grapefruit juice can inhibit intestinal CYP3A4, increasing bioavailability and hypotension risk.'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store below 25°C protected from light.'
  },
  {
    id: 'telmisartan',
    genericName: 'Telmisartan',
    commonIndianBrands: ['Telma 40/80', 'Telmikind', 'Telsar', 'Telma-H (with Hydrochlorothiazide)'],
    drugClass: 'Cardiovascular & Antihypertensive',
    mechanism: 'Potent, non-peptide Angiotensin II Receptor Blocker (ARB) with highest affinity for AT1 receptors and longest elimination half-life (~24 hours). Selectively blocks angiotensin II vasoconstriction and aldosterone release. Also acts as a partial agonist of PPAR-gamma, conferring favorable metabolic profiles.',
    standardAdultDosage: '40 mg orally once daily. Can be increased to 80 mg once daily if BP target is not attained. Cardiovascular risk reduction: 80 mg once daily.',
    pregnancyCategory: 'D',
    contraindications: [
      'BLACK BOX: Pregnancy (teratogenic; causes fetal renal failure, oligohydramnios, skeletal deformations, fetal death)',
      'Bilateral renal artery stenosis (causes precipitous drop in glomerular filtration pressure and acute anuria)',
      'Concurrent use with Aliskiren in diabetic patients',
      'Biliary obstructive disorders / severe hepatic failure'
    ],
    commonSideEffects: ['Dizziness, lightheadedness', 'Sinusitis, back pain, diarrhea', 'Mild asymptomatic hyperkalemia'],
    seriousAdverseEffects: ['Acute kidney injury in volume-depleted patients', 'Severe Hyperkalemia (serum K+ > 5.5 mEq/L)', 'Angioedema (rare compared to ACE inhibitors)'],
    drugInteractions: [
      { drug: 'Potassium Supplements & Potassium-Sparing Diuretics (Spironolactone)', risk: 'Life-threatening hyperkalemia. Avoid concurrent dispensing without strict serum potassium monitoring.', severity: 'High' },
      { drug: 'NSAIDs (Diclofenac, Ibuprofen)', risk: 'Blunts antihypertensive efficacy and triggers acute prerenal renal failure.', severity: 'High' },
      { drug: 'Lithium', risk: 'Increases serum lithium concentrations and lithium neurotoxicity.', severity: 'High' }
    ],
    foodInteractions: ['Can be taken with or without food. Avoid potassium-based salt substitutes without physician consultation.'],
    scheduleClass: 'Schedule H',
    storageInstructions: 'Store in original aluminum blister pack below 30°C to protect from moisture.'
  }
];

export const DRUG_DATA = DRUGS_DATA;
