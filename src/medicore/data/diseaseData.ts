import { DiseaseItem } from '../types';

export const DISEASES_DATA: DiseaseItem[] = [
  // --- VIRAL & BACTERIAL ---
  {
    id: 'dengue',
    name: 'Dengue Fever (Breakbone Fever)',
    category: 'Viral & Bacterial',
    definition: 'Acute mosquito-borne viral infection caused by Dengue virus (DENV 1-4) transmitted via female Aedes aegypti mosquitoes. Critical phase typically occurs around defervescence (day 3-7).',
    causes: ['Dengue Virus (Flavivirus family, serotypes 1, 2, 3, 4)', 'Bite of infected female Aedes aegypti / albopictus mosquito (daytime biter)'],
    clinicalSymptoms: [
      'Sudden high-grade fever (103°-105°F) with saddleback curve',
      'Severe retro-orbital (behind eye) pain aggravated by eye movements',
      'Intense arthralgia and myalgia (breakbone pain)',
      'Maculopapular rash appearing 3-5 days after fever onset',
      'Nausea, vomiting, extreme fatigue and metallic taste'
    ],
    redFlags: [
      'CRITICAL: Platelet count dropping rapidly (< 50,000 / µL) or sudden hematocrit rise > 20%',
      'Mucosal bleeding (epistaxis, bleeding gums, melena / black tarry stools)',
      'Severe persistent abdominal pain and tenderness',
      'Persistent vomiting (> 3 episodes in 24 hours)',
      'Lethargy, restlessness, cold clammy extremities, rapid weak pulse (Dengue Shock Syndrome)',
      'Difficulty breathing or fluid accumulation (ascites, pleural effusion)'
    ],
    otcCareAndSupportive: [
      'Paracetamol 500-650 mg (Max 3-4 g/24h) for fever control',
      '⚠️ STRICT CONTRAINDICATION: Avoid Aspirin, Ibuprofen, Diclofenac (NSAIDs increase catastrophic bleeding risk)',
      'Aggressive oral rehydration: ORS (WHO formula), coconut water, fresh lime juice (minimum 2.5 - 3 Litres/day)',
      'Bed rest and mosquito netting to prevent secondary transmission'
    ],
    lifestyleAdvice: ['Eliminate stagnant water around home', 'Use DEET mosquito repellents and full-sleeve light-colored clothing', 'Monitor daily CBC (Complete Blood Count) from Day 3 onwards'],
    investigations: ['Dengue NS1 Antigen (Positive on Day 1-5)', 'Dengue IgM/IgG ELISA (Positive after Day 5)', 'CBC with daily Platelet count & Packed Cell Volume (Hematocrit)'],
    tags: ['dengue', 'platelets', 'aedes', 'fever', 'ns1', 'mosquito']
  },
  {
    id: 'typhoid',
    name: 'Typhoid (Enteric Fever)',
    category: 'Viral & Bacterial',
    definition: 'Systemic bacterial infection caused by Salmonella enterica serotype Typhi, transmitted via contaminated food and water.',
    causes: ['Salmonella enterica serovar Typhi & Paratyphi A/B', 'Fecal-oral transmission via contaminated food, water, or unhygienic ice'],
    clinicalSymptoms: [
      'Step-ladder fever pattern rising gradually over 1 week',
      'Coated tongue with red margins, severe frontal headache',
      'Relative bradycardia (Faget sign - heart rate slower than expected for fever degree)',
      'Abdominal discomfort, pea-soup diarrhea or constipation',
      'Faint salmon-colored rose spots on trunk (Day 7-10)',
      'Hepatosplenomegaly'
    ],
    redFlags: [
      'Intestinal perforation (sudden severe abdominal pain, guarding, rigidity, shock)',
      'Severe GI bleeding (massive dark blood in stool)',
      'Typhoid encephalopathy (confusion, delirium, muttering, coma)',
      'Hypothermia with persistent hypotension'
    ],
    otcCareAndSupportive: [
      'Supportive Paracetamol for temperature spikes',
      'ORS and frequent small-volume bland fluid meals (khichdi, curd-rice, dalia)',
      'Requires prescription antibiotic therapy (e.g., Ceftriaxone, Azithromycin as per physician/culture)'
    ],
    lifestyleAdvice: ['Drink only boiled or purified RO water', 'Strict handwashing before meals and after toilet', 'Avoid raw street food and unpasteurized milk'],
    investigations: ['Blood Culture (Gold standard in 1st week)', 'TyphiDot IgM / Widal Test (after 7-10 days, pair titers)', 'Stool & Urine culture in 2nd-3rd week'],
    tags: ['typhoid', 'salmonella', 'widal', 'step-ladder', 'enteric']
  },
  {
    id: 'malaria',
    name: 'Malaria',
    category: 'Viral & Bacterial',
    definition: 'Life-threatening protozoal infection caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.',
    causes: ['Plasmodium vivax (most common in India), P. falciparum (malignant / cerebral), P. malariae, P. ovale'],
    clinicalSymptoms: [
      'Classic paroxysmal fever triad: Cold stage (shivering/rigors, 15-60 min) -> Hot stage (high fever 104°F, burning skin, 2-6 hrs) -> Sweating stage (profuse sweat, temp drop, exhaustion)',
      'Severe headache, nausea, vomiting, muscle ache',
      'Hepatosplenomegaly, mild jaundice in falciparum'
    ],
    redFlags: [
      'Cerebral Malaria (altered sensorium, seizures, confusion, coma)',
      'Severe normocytic anemia (Hb < 5 g/dL)',
      'Acute renal failure (oliguria, dark cola-colored urine - Blackwater fever)',
      'Respiratory distress / pulmonary edema',
      'Spontaneous bleeding / DIC'
    ],
    otcCareAndSupportive: [
      'Paracetamol for fever during hot stage',
      'Strict prescription Antimalarials needed: ACT (Artemisinin Combination Therapy) for Falciparum; Chloroquine + Primaquine (14 days, check G6PD) for Vivax radical cure',
      'Tepid sponging during high fever phase'
    ],
    lifestyleAdvice: ['Use insecticide-treated bed nets (ITNs)', 'Clear stagnant drains and puddles', 'Screen windows and apply mosquito repellents'],
    investigations: ['Peripheral Blood Smear (Thick & Thin smear Giemsa stain)', 'Rapid Diagnostic Test (RDT for Pf-HRP2 and Pv-LDH)', 'Complete Blood Count, G6PD enzyme level'],
    tags: ['malaria', 'plasmodium', 'anopheles', 'rigors', 'cerebral']
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection (UTI / Cystitis)',
    category: 'Viral & Bacterial',
    definition: 'Infection of the urinary system (bladder, urethra, or kidneys), predominantly caused by uropathogenic Escherichia coli.',
    causes: ['Escherichia coli (80-85% cases), Klebsiella, Proteus mirabilis, Enterococcus', 'Poor perineal hygiene, urinary retention, catheterization, sexual activity in females'],
    clinicalSymptoms: [
      'Dysuria (burning sensation during urination)',
      'Urgency and frequency (frequent urge with small void volume)',
      'Suprapubic discomfort / lower pelvic ache',
      'Cloudy, foul-smelling or blood-tinged urine (hematuria)'
    ],
    redFlags: [
      'High fever with chills & rigors (indicates Pyelonephritis / upper UTI)',
      'Severe flank pain / costovertebral angle tenderness',
      'Persistent vomiting and inability to retain fluids',
      'UTI in pregnant women, elderly, or diabetic patients (sepsis risk)'
    ],
    otcCareAndSupportive: [
      'Urinary alkalinizers (Disodium Hydrogen Citrate syrup, 1-2 tsp in water TDS for symptom relief)',
      'High fluid intake (minimum 3-3.5 Litres water daily)',
      'Paracetamol for pelvic cramps',
      'Prescription antibiotics required (Nitrofurantoin, Fosfomycin, Cefixime as per culture)'
    ],
    lifestyleAdvice: ['Wipe front to back after bowel movements', 'Urinate soon after intercourse', 'Avoid holding urine for prolonged periods'],
    investigations: ['Urine Routine & Microscopy (Pus cells > 5/HPF, RBCs, bacteria)', 'Urine Culture & Sensitivity (Gold standard)', 'Serum Creatinine & Blood Sugar in recurrent cases'],
    tags: ['uti', 'cystitis', 'dysuria', 'pyelonephritis', 'e-coli']
  },
  {
    id: 'viral-fever',
    name: 'Acute Viral Fever & Influenza',
    category: 'Viral & Bacterial',
    definition: 'Self-limiting generalized viral infection characterized by sudden pyrexia, body ache, and upper respiratory catarrh.',
    causes: ['Influenza A & B, Adenovirus, Rhinovirus, Parainfluenza, Coronavirus'],
    clinicalSymptoms: [
      'Moderate to high fever with general malaise',
      'Generalized body ache, sore throat, mild dry cough',
      'Runny nose, nasal congestion, mild conjunctival suffusion'
    ],
    redFlags: [
      'Fever lasting > 5 consecutive days without defervescence',
      'Stridor, wheezing, shortness of breath, SpO2 < 94%',
      'Chest pain, productive rust-colored sputum',
      'Inability to swallow liquids or extreme drowsiness'
    ],
    otcCareAndSupportive: [
      'Paracetamol 650 mg SOS for fever and body ache',
      'Warm saline gargles TDS for throat irritation',
      'Steam inhalation and Saline nasal drops',
      'Vitamin C & Zinc supportive supplements',
      '⚠️ DO NOT dispense prophylactic antibiotics for simple viral fever'
    ],
    lifestyleAdvice: ['Complete bed rest for 48-72 hours', 'Warm fluids (soups, herbal tea, warm water)', 'Masking to prevent family transmission'],
    investigations: ['CBC (typically shows normal/low WBC count with lymphocytosis)', 'Chest X-ray if respiratory symptoms worsen'],
    tags: ['viral', 'influenza', 'fever', 'flu', 'rhinovirus']
  },

  // --- RESPIRATORY ---
  {
    id: 'asthma',
    name: 'Bronchial Asthma (Acute & Chronic)',
    category: 'Respiratory',
    definition: 'Chronic inflammatory disorder of airways characterized by reversible bronchial hyper-responsiveness, bronchospasm, and excessive mucus.',
    causes: ['Allergen triggers (dust mites, pollen, pet dander)', 'Cold air, exercise, viral infections, NSAIDs / Beta-blockers, smoking'],
    clinicalSymptoms: [
      'Episodic wheezing (expiratory whistling sound)',
      'Shortness of breath, chest tightness, nocturnal cough (especially 3-4 AM)',
      'Prolonged expiratory phase on auscultation'
    ],
    redFlags: [
      'Silent chest on auscultation (extreme bronchoconstriction, no air movement)',
      'Inability to complete full sentences in one breath',
      'Accessory muscle use (intercostal & sternocleidomastoid retractions)',
      'Central cyanosis (bluish discoloration of lips/tongue)',
      'SpO2 < 90% on room air, peak expiratory flow < 50% predicted',
      'Paradoxical pulse or exhaustion / drowsiness'
    ],
    otcCareAndSupportive: [
      'Emergency reliever: Salbutamol (SABA) MDI 2-4 puffs via spacer (Prescription drug)',
      'Maintenance: Inhaled Corticosteroid (ICS) + LABA (e.g., Budesonide + Formoterol)',
      'Keep patient in high-Fowler (upright sitting) position; do not lay flat',
      'Administer supplemental oxygen if available'
    ],
    lifestyleAdvice: ['Identify and eliminate personal triggers', 'Always carry reliever inhaler everywhere', 'Use peak flow meter at home for monitoring'],
    investigations: ['Spirometry (FEV1/FVC < 0.70 with > 12% & 200 ml post-bronchodilator reversibility)', 'Chest X-ray (usually normal or hyperinflated)', 'Serum IgE & Absolute Eosinophil Count'],
    tags: ['asthma', 'wheeze', 'inhaler', 'salbutamol', 'budesonide', 'spO2']
  },
  {
    id: 'copd',
    name: 'Chronic Obstructive Pulmonary Disease (COPD)',
    category: 'Respiratory',
    definition: 'Progressive, largely irreversible airflow limitation caused by chronic bronchitis and emphysema, predominantly related to noxious particle exposure.',
    causes: ['Cigarette / bidi smoking (> 20 pack-years)', 'Biomass fuel / chulha smoke in poorly ventilated kitchens', 'Occupational dust (silica, coal, grain)'],
    clinicalSymptoms: [
      'Chronic productive cough with grey-white sputum for > 3 months in 2 consecutive years',
      'Progressive exertional dyspnea (breathlessness on climbing stairs/walking)',
      'Barrel-shaped chest, pursed-lip breathing, coarse crackles and rhonchi'
    ],
    redFlags: [
      'Acute exacerbation with marked increase in sputum purulence and volume',
      'Acute confusion, asterixis (flapping tremor due to CO2 retention / hypercapnia)',
      'Peripheral edema (cor pulmonale / right heart failure)',
      'SpO2 dropping below patient baseline (< 88%)'
    ],
    otcCareAndSupportive: [
      'Prescription Bronchodilators: LAMA (Tiotropium) + LABA (Formoterol/Salmeterol)',
      'Controlled low-flow Oxygen therapy (maintain SpO2 between 88-92% to prevent loss of hypoxic respiratory drive)',
      'Immediate referral for acute infective exacerbation'
    ],
    lifestyleAdvice: ['Complete cessation of smoking/bidi', 'Use clean cooking fuel (LPG over wood/cow dung)', 'Pneumococcal & annual Influenza vaccination'],
    investigations: ['Spirometry (Post-bronchodilator FEV1/FVC < 0.70 without complete reversibility)', 'Chest X-ray (flat diaphragm, tubular heart, emphysematous bullae)', 'Arterial Blood Gas (ABG)'],
    tags: ['copd', 'emphysema', 'bronchitis', 'smoking', 'tiotropium', 'oxygen']
  },
  {
    id: 'pneumonia',
    name: 'Community-Acquired Pneumonia (CAP)',
    category: 'Respiratory',
    definition: 'Acute infection of the pulmonary parenchymal tissue causing alveolar consolidation, exudate accumulation, and impaired gas exchange.',
    causes: ['Streptococcus pneumoniae (Pneumococcus), Mycoplasma pneumoniae, Klebsiella pneumoniae, Viral pathogens'],
    clinicalSymptoms: [
      'High fever with chills and pleuritic (sharp, stabbing) chest pain on deep breathing',
      'Productive cough with rusty or green mucopurulent sputum',
      'Tachypnea (respiratory rate > 24/min), tachycardia',
      'Localized bronchial breathing and fine inspiratory crepitations (crackles) on auscultation'
    ],
    redFlags: [
      'CURB-65 Criteria: Confusion, Blood Urea > 7 mmol/L, Respiratory rate ≥ 30/min, BP < 90/60 mmHg, Age ≥ 65',
      'SpO2 < 92% on room air',
      'Multilobar consolidation on chest X-ray',
      'Hemoptysis (coughing up blood)'
    ],
    otcCareAndSupportive: [
      'Urgent prescription antibiotic therapy required (e.g., Amoxicillin-Clavulanate, Azithromycin, or Ceftriaxone)',
      'Paracetamol for pleuritic discomfort and fever',
      'Adequate hydration and supplemental oxygen'
    ],
    lifestyleAdvice: ['Complete full course of prescribed antibiotics', 'Avoid lying flat on back; practice incentive spirometry', 'Annual influenza and pneumococcal vaccines in elderly'],
    investigations: ['Chest X-ray PA view (Lobar or patchy consolidation, air bronchograms)', 'Sputum Gram stain & Culture', 'CBC with differential (marked leukocytosis with left shift)'],
    tags: ['pneumonia', 'consolidation', 'crepitations', 'curb65', 'rusty-sputum']
  },
  {
    id: 'gerd',
    name: 'Gastroesophageal Reflux Disease (GERD / Acidity)',
    category: 'Gastrointestinal',
    definition: 'Condition developing when retrograde flow of gastric contents causes troublesome symptoms (heartburn, acid regurgitation) or mucosal damage.',
    causes: ['Transient lower esophageal sphincter (LES) relaxation', 'Hiatal hernia, delayed gastric emptying, obesity, smoking, pregnancy, high-fat spicy food'],
    clinicalSymptoms: [
      'Pyrosis (retrosternal burning sensation radiating upwards to throat)',
      'Acid regurgitation (sour or bitter taste in mouth)',
      'Water brash (sudden reflex salivation), epigastric discomfort after heavy meals',
      'Atypical: Chronic non-productive nocturnal cough, laryngitis / morning hoarseness'
    ],
    redFlags: [
      'Dysphagia (difficulty swallowing) or Odynophagia (painful swallowing)',
      'Persistent vomiting or hematemesis (vomiting blood / coffee ground emesis)',
      'Unexplained significant weight loss',
      'New onset heartburn in patient > 45-50 years (requires ruling out malignancy/cardiac ischemia)'
    ],
    otcCareAndSupportive: [
      'Proton Pump Inhibitors (PPIs: Pantoprazole 40 mg or Omeprazole 20 mg once daily 30-45 mins before breakfast)',
      'H2-Receptor Antagonists (Famotidine 20-40 mg at bedtime)',
      'Antacids with Alginate (e.g., Sodium alginate + Magnesium hydroxide) for instant breakthrough heartburn relief'
    ],
    lifestyleAdvice: ['Elevate head of bed by 6-8 inches', 'Do not lie down within 2-3 hours after meals', 'Avoid trigger foods: chocolate, mint, caffeine, citrus, fried fatty foods', 'Eat small frequent meals'],
    investigations: ['Upper GI Endoscopy (EGD) if red flags or refractory symptoms', '24-hour ambulatory esophageal pH impedance monitoring (gold standard)'],
    tags: ['gerd', 'acidity', 'heartburn', 'pantoprazole', 'ppi', 'regurgitation']
  },
  {
    id: 'peptic-ulcer',
    name: 'Peptic Ulcer Disease (PUD - Gastric & Duodenal)',
    category: 'Gastrointestinal',
    definition: 'Focal mucosal break in the stomach or proximal duodenum extending through the muscularis mucosae, caused by acid-peptic injury.',
    causes: ['Helicobacter pylori bacterial colonization (70-90% cases)', 'Chronic use of NSAIDs (Ibuprofen, Diclofenac, Aspirin)', 'Smoking, severe physiological stress'],
    clinicalSymptoms: [
      'Duodenal Ulcer: Hunger pain (epigastric burning 2-3 hours after meals and at 2-3 AM), relieved by food or antacids',
      'Gastric Ulcer: Pain precipitated immediately by food intake, leads to food avoidance & weight loss',
      'Bloating, belching, early satiety, epigastric tenderness'
    ],
    redFlags: [
      'Acute perforation: Sudden, catastrophic, knife-like epigastric pain with board-like abdominal rigidity',
      'Hematemesis (vomiting fresh or altered blood)',
      'Melena (jet-black, foul-smelling sticky tarry stools indicating upper GI bleed)',
      'Gastric outlet obstruction (projectile vomiting of undigested food ingested hours earlier)'
    ],
    otcCareAndSupportive: [
      'PPI therapy (Pantoprazole / Rabeprazole 40 mg BD) for 4-8 weeks',
      'Sucralfate suspension 1 g QID (taken 1 hr before meals and bedtime as mucosal protectant)',
      'H. pylori eradication regimen (Triple therapy: PPI + Amoxicillin 1g + Clarithromycin 500mg BD for 14 days) under prescription'
    ],
    lifestyleAdvice: ['Complete cessation of NSAIDs; use Paracetamol for pain', 'Avoid alcohol and smoking', 'Avoid spicy/acidic foods'],
    investigations: ['Upper GI Endoscopy with biopsy', 'H. pylori stool antigen test or Urea Breath Test (UBT)', 'Complete Blood Count (check for microcytic hypochromic iron deficiency anemia)'],
    tags: ['ulcer', 'pud', 'h-pylori', 'melena', 'sucralfate', 'duodenal']
  },
  {
    id: 'diarrhea',
    name: 'Acute Gastroenteritis & Diarrhea',
    category: 'Gastrointestinal',
    definition: 'Sudden onset of frequent loose, watery stools (> 3 episodes in 24 hours) with or without vomiting, fever, or abdominal cramping.',
    causes: ['Viral: Rotavirus, Norovirus', 'Bacterial: E. coli (ETEC, EPEC), Shigella, Campylobacter, Salmonella, Vibrio cholerae', 'Protozoal: Entamoeba histolytica, Giardia lamblia'],
    clinicalSymptoms: [
      'Watery stools, cramping periumbilical abdominal pain',
      'Nausea, vomiting, low to moderate grade fever',
      'Signs of mild-moderate dehydration: thirst, dry buccal mucosa, sunken eyes, reduced urine output'
    ],
    redFlags: [
      'Severe dehydration: Anuria (> 8 hrs without urine), lethargy, sunken fontanelle in infants, loss of skin turgor (tenting)',
      'Dysentery: Macroscopic blood, pus, and mucus in stools with tenesmus (straining)',
      'High fever (> 102°F) with toxic appearance',
      'Cholera-like rice-water stools with rapid hypovolemic shock'
    ],
    otcCareAndSupportive: [
      'CORNERSTONE: WHO-formula Low-Osmolarity Oral Rehydration Salts (ORS) - 1 packet in 1 Litre boiled cooled water, consumed sip-by-sip',
      'Zinc supplementation (20 mg/day for 14 days, 10 mg in infants < 6 months) to regenerate gut mucosa',
      'Probiotics (Lactobacillus, Saccharomyces boulardii)',
      '⚠️ DO NOT give antimotility agents (Loperamide) in children or if blood/fever is present'
    ],
    lifestyleAdvice: ['Continue feeding: khichdi, banana, curd, boiled potatoes, rice kanji', 'Wash hands with soap before handling food and feeding', 'Avoid commercial sugary sodas, fruit juices (worsen osmotic diarrhea)'],
    investigations: ['Stool Routine & Microscopy (check for RBCs, pus cells, amoebic cysts, Giardia trophozoites)', 'Stool Culture if dysentery or severe systemic symptoms', 'Serum Electrolytes (Na+, K+, HCO3-) in severe dehydration'],
    tags: ['diarrhea', 'ors', 'dehydration', 'zinc', 'gastroenteritis', 'loperamide']
  },
  {
    id: 'piles',
    name: 'Hemorrhoids (Piles) & Anal Fissure',
    category: 'Gastrointestinal',
    definition: 'Swollen, inflamed vascular cushions in the lower rectum and anus (internal or external), frequently triggered by chronic straining.',
    causes: ['Chronic constipation, prolonged straining at defecation, low-fiber diet', 'Pregnancy (elevated pelvic venous pressure), heavy weightlifting, sedentary lifestyle'],
    clinicalSymptoms: [
      'Internal Hemorrhoids: Painless bright-red bleeding coating the stool or dripping into pan at end of defecation (splash-in-the-pan)',
      'External Hemorrhoids: Painful lump around anal verge, pruritus ani (itching)',
      'Anal Fissure: Intense burning/cutting pain during and lasting hours after passing hard stool'
    ],
    redFlags: [
      'Strangulated or thrombosed hemorrhoids (excruciating, severe, unrelenting anal pain with dark bluish irreducible lump)',
      'Profuse, continuous rectal bleeding causing postural dizziness or anemia',
      'Foul-smelling purulent discharge with perianal fever (perianal abscess / fistula)',
      'Alternating bowel habits or blood mixed within stool in patients > 50 yrs (exclude colorectal carcinoma)'
    ],
    otcCareAndSupportive: [
      'Stool softeners / bulk laxatives: Ispaghula (Psyllium husk 1-2 tsp at bedtime with 2 glasses of water) or Lactulose syrup',
      'Warm sitz bath (soaking anal region in warm water for 15 minutes 2-3 times/day)',
      'Topical anesthetic & soothing ointment (Lignocaine + Zinc oxide + Hydrocortisone short-term)',
      'Calcium Dobesilate or Flavonoid venotonic capsules (Daflon 500mg) under medical advice'
    ],
    lifestyleAdvice: ['High-fiber diet (green vegetables, whole grains, fruits)', 'Drink 3-4 Litres of water daily', 'Never strain on the toilet; avoid sitting on toilet seat > 5 minutes', 'Avoid spicy, deep-fried foods'],
    investigations: ['Digital Rectal Examination (DRE)', 'Proctoscopy & Anoscopy', 'Colonoscopy in patients > 50 with unexplained rectal bleeding'],
    tags: ['piles', 'hemorrhoids', 'fissure', 'sitz-bath', 'constipation', 'daflon']
  },

  // --- METABOLIC & BLOOD ---
  {
    id: 'diabetes',
    name: 'Diabetes Mellitus (Type 1 & Type 2)',
    category: 'Metabolic & Blood',
    definition: 'Chronic metabolic disorder characterized by persistent hyperglycemia resulting from defects in insulin secretion, insulin action, or both.',
    causes: [
      'Type 1 DM: Autoimmune destruction of pancreatic beta cells -> absolute insulin deficiency (usually childhood/adolescent onset)',
      'Type 2 DM: Progressive insulin resistance combined with secretory defect (obesity, sedentary lifestyle, genetic predisposition)'
    ],
    clinicalSymptoms: [
      'The Classic 3 Ps: Polyuria (excess urination), Polydipsia (excess thirst), Polyphagia (excess hunger)',
      'Unexplained weight loss despite eating well',
      'Non-healing skin ulcers, recurrent fungal/yeast infections (balanitis, vulvovaginitis)',
      'Blurry vision, tingling/numbness in toes (diabetic peripheral neuropathy)'
    ],
    redFlags: [
      'Diabetic Ketoacidosis (DKA - primarily T1DM): Kussmaul deep rapid breathing, fruity acetone breath, abdominal pain, vomiting, lethargy, blood glucose > 250 mg/dL with ketones',
      'Hyperosmolar Hyperglycemic State (HHS - T2DM): Extreme hyperglycemia (> 600 mg/dL), severe dehydration, confusion, coma without significant ketosis',
      'Acute Hypoglycemia: Blood glucose < 70 mg/dL with diaphoresis (cold sweats), tremors, palpitations, hunger, dizziness, neuroglycopenic coma (requires immediate 15-20g oral glucose or IV Dextrose)'
    ],
    otcCareAndSupportive: [
      'Requires tailored prescription pharmacotherapy: Metformin (first-line for T2DM), Glimepiride, Teneligliptin, SGLT2 inhibitors (Dapagliflozin), Insulin',
      'Home blood glucose monitoring (Glucometer with fasting & post-prandial records)',
      'Emergency Hypo Kit: Always carry 3-4 sugar candies, glucose powder, or fruit juice'
    ],
    lifestyleAdvice: ['Low glycemic index diet (avoid refined sugar, maida, white rice, sweet beverages)', '30-45 minutes brisk walk 5 days/week', 'Daily foot inspection for cuts/blisters (never walk barefoot)'],
    investigations: ['Fasting Plasma Glucose (FPG ≥ 126 mg/dL)', 'Post-prandial Glucose (PPBG ≥ 200 mg/dL)', 'HbA1c (≥ 6.5% diagnostic, target < 7.0%)', 'Urine microalbumin / creatinine ratio'],
    tags: ['diabetes', 'hyperglycemia', 'metformin', 'insulin', 'hba1c', 'hypoglycemia']
  },
  {
    id: 'hypertension',
    name: 'Hypertension (High Blood Pressure)',
    category: 'Metabolic & Blood',
    definition: 'Persistent elevation of systemic arterial pressure (Systolic BP ≥ 140 mmHg and/or Diastolic BP ≥ 90 mmHg on repeated clinic measurements).',
    causes: ['Essential / Primary HTN (90-95%): aging, high dietary sodium, obesity, family history, chronic stress', 'Secondary HTN (5-10%): renal artery stenosis, chronic kidney disease, pheochromocytoma, Cushing syndrome'],
    clinicalSymptoms: [
      'Often completely asymptomatic ("The Silent Killer")',
      'Occipital morning headache, dizziness / vertigo, tinnitus',
      'Epistaxis (nosebleed), palpitations, fatigue'
    ],
    redFlags: [
      'Hypertensive Emergency (BP > 180/120 mmHg WITH acute target organ damage):',
      '-> Neurological: Hypertensive encephalopathy, acute ischemic stroke, intracranial hemorrhage',
      '-> Cardiovascular: Acute myocardial infarction, aortic dissection (tearing chest/back pain), acute pulmonary edema',
      '-> Renal / Ocular: Acute kidney injury, papilledema / retinal hemorrhages'
    ],
    otcCareAndSupportive: [
      'Requires physician-prescribed antihypertensives: CCBs (Amlodipine), ACEi/ARBs (Telmisartan, Ramipril), Beta-blockers (Metoprolol), Diuretics (Chlorthalidone)',
      'Home BP apparatus (digital oscillometric arm cuff; measure after 5 mins seated rest)'
    ],
    lifestyleAdvice: ['DASH diet (Dietary Approaches to Stop Hypertension): rich in fruits, vegetables, low-fat dairy', 'Strict salt restriction (< 5 grams / 1 level teaspoon per day)', 'Maintain BMI between 18.5 - 24.9 kg/m²', 'Avoid tobacco and limit alcohol'],
    investigations: ['Serial BP measurements (ambulatory 24h monitoring is gold standard)', 'Serum Creatinine & eGFR, Serum Electrolytes', '12-lead ECG, Lipid Profile, Urine Albumin'],
    tags: ['hypertension', 'blood-pressure', 'amlodipine', 'telmisartan', 'stroke', 'dash-diet']
  },
  {
    id: 'anemia',
    name: 'Iron Deficiency Anemia (IDA)',
    category: 'Metabolic & Blood',
    definition: 'Decrease in total circulating red blood cell mass and hemoglobin concentration below physiological norms (< 13 g/dL in men, < 12 g/dL in non-pregnant women, < 11 g/dL in pregnancy).',
    causes: ['Chronic occult blood loss (heavy menstruation / menorrhagia, bleeding piles, peptic ulcers, hookworm infestation)', 'Inadequate dietary iron intake, poor intestinal absorption (celiac disease, post-gastrectomy)'],
    clinicalSymptoms: [
      'Easy fatigability, generalized lethargy, weakness, lightheadedness',
      'Pallor of lower palpebral conjunctiva, tongue, nail beds, and palms',
      'Exertional dyspnea, palpitations',
      'Koilonychia (spoon-shaped brittle nails), atrophic glossitis, angular cheilitis, pica (craving ice, chalk, clay)'
    ],
    redFlags: [
      'Severe symptomatic anemia (Hb < 7 g/dL) with high-output cardiac failure',
      'Chest pain (angina pectoris triggered by low oxygen carrying capacity)',
      'Syncope (fainting), acute confusion in elderly',
      'Gross GI bleeding (hematemesis, frank melena)'
    ],
    otcCareAndSupportive: [
      'Oral elemental iron (Ferrous ascorbate / Ferrous sulfate 60-100 mg elemental iron daily)',
      'Folic acid 5 mg + Vitamin B12 co-supplementation',
      'Take iron tablet with Vitamin C (lemon water / orange juice) to enhance non-heme absorption',
      '⚠️ Take on empty stomach if tolerated; avoid taking with milk, tea, coffee, or antacids (binds iron)'
    ],
    lifestyleAdvice: ['Dietary iron: green leafy vegetables (spinach, methi), jaggery (gur), dates, pomegranate, liver, eggs', 'Deworming: Albendazole 400 mg single dose twice yearly in endemic areas'],
    investigations: ['CBC with Red Cell Indices (Microcytic hypochromic: MCV < 80 fL, MCH < 27 pg)', 'Serum Ferritin (Gold standard for iron stores: < 30 ng/mL diagnostic)', 'Serum Iron & Total Iron Binding Capacity (TIBC)'],
    tags: ['anemia', 'hemoglobin', 'iron', 'ferrous-ascorbate', 'pallor', 'koilonychia']
  },

  // --- PAIN & DERMATOLOGY ---
  {
    id: 'migraine',
    name: 'Migraine (With & Without Aura)',
    category: 'Pain & Dermatology',
    definition: 'Neurovascular primary headache disorder characterized by recurrent attacks of moderate to severe pulsating, predominantly unilateral head pain.',
    causes: ['Trigeminal nerve activation with CGRP release and neurogenic inflammation', 'Triggers: sleep deprivation, skipping meals, sensory overload (bright lights, loud noise), hormonal shifts, stress, MSG/aged cheese'],
    clinicalSymptoms: [
      'Unilateral (one-sided) throbbing / pulsating headache lasting 4 to 72 hours',
      'Severe photophobia (sensitivity to light) and phonophobia (sensitivity to sound)',
      'Nausea, vomiting, osmophobia (sensitivity to smells)',
      'Aura in 20-30%: Visual scintillating scotomas, zigzag lines (fortification spectra), tingling numbness'
    ],
    redFlags: [
      'SNOOP Criteria (Systemic symptoms, Neurological deficit, Onset sudden / "Thunderclap", Older age onset, Progression):',
      'Thunderclap headache (worst headache of life reaching peak in < 1 minute - rule out subarachnoid hemorrhage)',
      'Focal neurological deficits (weakness, speech difficulty, facial droop)',
      'Headache with fever and neck stiffness (meningitis)',
      'New onset headache in patient > 50 yrs (rule out temporal arteritis)'
    ],
    otcCareAndSupportive: [
      'Acute abortive therapy: Paracetamol 1000 mg + Caffeine or Naproxen 500 mg taken at very earliest onset of attack',
      'Antiemetic: Domperidone 10 mg or Ondansetron 4 mg for associated nausea',
      'Prescription triptans (Sumatriptan 50 mg, Zolmitriptan) for severe attacks',
      'Rest in a quiet, pitch-dark, cool room with cold forehead compress'
    ],
    lifestyleAdvice: ['Maintain regular sleep-wake schedule', 'Never skip meals; drink adequate water', 'Maintain a headache diary to identify and avoid personal triggers'],
    investigations: ['Clinical diagnosis (ICHD-3 criteria)', 'Brain MRI / CT only if red flags (SNOOP criteria) or abnormal neurological exam'],
    tags: ['migraine', 'headache', 'aura', 'sumatriptan', 'photophobia', 'naproxen']
  },
  {
    id: 'fungal-infection',
    name: 'Dermatophytosis (Ringworm / Tinea)',
    category: 'Pain & Dermatology',
    definition: 'Superficial fungal infection of keratinized tissues (skin, hair, nails) caused by dermatophyte fungi (Trichophyton, Microsporum, Epidermophyton).',
    causes: ['Trichophyton rubrum, T. mentagrophytes', 'Hot and humid climate, tight synthetic clothing, excessive sweating, sharing towels/bedding'],
    clinicalSymptoms: [
      'Tinea Corporis / Cruris (Jock itch): Annular (ring-shaped) erythematous plaque with central clearing and raised, scaly, vesicular active advancing border',
      'Tinea Pedis (Athlete’s foot): Maceration, scaling, and fissures in interdigital toe webs',
      'Intense, aggravating pruritus (itching), especially when sweating'
    ],
    redFlags: [
      'Tinea Incognito: Severe atypical fungal infection caused by steroid abuse (e.g., Quadriderm, Betnovate, Panderm creams misused)',
      'Secondary bacterial infection with cellulitis (spreading warmth, redness, pus, lymphangitis)',
      'Extensive dermatophytosis in immunocompromised or uncontrolled diabetic patients'
    ],
    otcCareAndSupportive: [
      'Topical Antifungal creams: Clotrimazole 1%, Terbinafine 1%, Luliconazole 1%, or Sertaconazole applied BD for 2-4 weeks (extend 2 cm beyond visible border)',
      'Oral Antihistamines (Levocetirizine 5 mg at night) to control nocturnal itching',
      '⚠️ STRICT WARNING: Never dispense combination steroid-antifungal-antibacterial creams for ringworm',
      'Systemic oral antifungals (Itraconazole / Terbinafine) under doctor’s prescription for extensive tinea'
    ],
    lifestyleAdvice: ['Keep infected areas dry; use antifungal dusting powder (Clotrimazole powder)', 'Wear loose cotton undergarments; change twice daily', 'Wash clothes separately in hot water and iron inside out'],
    investigations: ['KOH 10-20% wet mount of skin scrapings (shows septate branching fungal hyphae)', 'Fungal culture on Sabouraud Dextrose Agar (SDA) in refractory cases'],
    tags: ['fungal', 'tinea', 'ringworm', 'luliconazole', 'terbinafine', 'steroid-abuse']
  },
  {
    id: 'scabies',
    name: 'Scabies (Sarcoptic Mange)',
    category: 'Pain & Dermatology',
    definition: 'Intensely pruritic, contagious parasitic skin infestation caused by the microscopic itch mite Sarcoptes scabiei var. hominis.',
    causes: ['Infestation by Sarcoptes scabiei mite burrowing into stratum corneum', 'Close skin-to-skin contact, sharing infested bedding, towels, or clothing in crowded living conditions'],
    clinicalSymptoms: [
      'Severe, intractable generalized itching, markedly worse at NIGHT (nocturnal pruritus)',
      'Pathognomonic burrows (short, wavy, dirty-grey microscopic tunnels in stratum corneum)',
      'Erythematous papules and vesicles in predilection sites: finger web spaces, flexor wrists, axillae, periumbilical, genitalia, and buttocks',
      'Circle of Hebra distribution (spares face and neck in adults)'
    ],
    redFlags: [
      'Crusted Scabies (Norwegian Scabies): Highly contagious, hyperkeratotic psoriasiform crusts teeming with millions of mites, common in immunocompromised/HIV',
      'Severe secondary bacterial impetigo / cellulitis from scratching (risk of post-streptococcal glomerulonephritis in children)'
    ],
    otcCareAndSupportive: [
      'Gold standard treatment: Permethrin 5% cream applied thoroughly from neck down to soles of feet, left for 8-14 hours, then washed off. Repeat after 7 days to kill newly hatched nymphs',
      'Oral Ivermectin (200 mcg/kg single dose, repeated after 1-2 weeks) under physician prescription',
      'Oral Antihistamine (Hydroxyzine 25 mg or Levocetirizine 5 mg) at bedtime for severe itch'
    ],
    lifestyleAdvice: [
      'CRITICAL: Treat ALL household members and intimate contacts simultaneously, even if asymptomatic',
      'Wash all clothes, bed linens, and towels used in past 3 days in hot water (> 60°C) and hot cycle dry',
      'Items that cannot be washed should be sealed in an airtight plastic bag for at least 72 hours (mites die away from host skin)'
    ],
    investigations: ['Clinical diagnosis based on nocturnal itch and typical web space lesions', 'Microscopic identification of mites, eggs, or scybala (feces) from mineral oil skin scrapings'],
    tags: ['scabies', 'permethrin', 'nocturnal-itch', 'burrows', 'sarcoptes']
  }
];

export const DISEASE_DATA = DISEASES_DATA;
