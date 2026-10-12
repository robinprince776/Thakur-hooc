import { MoodCategory } from '../types';

export const MOODS_DATA: MoodCategory[] = [
  {
    id: 'ishq',
    nameRoman: 'Ishq',
    tagline: 'Mohabbat, Deewangi Aur Junoon',
    descriptionHinglish:
      'Dil ka pehla aur aakhri jazba. Mehboob ki aankhon me doob jane ki chahat, be-sabri, aur be-panaah ibadat.',
    color: '#C6A66B',
    bgGradient: 'from-amber-950/40 via-[#59263C]/30 to-[#0B0B0F]',
    borderGlow: 'border-amber-500/40 hover:border-amber-400',
    relatedPoetIds: ['ghalib', 'faraz', 'parveen', 'bulleh'],
    writingPrompts: [
      'Mehboob ki pehli nazar ya muskuraahat par ek Sher likhein.',
      'Aisi mohabbat jisme khamoshi hi sabse badi guftagu ban gayi ho.',
      'Ishq aur ibadat ke beech ka nazuk rishta bayaan karein.'
    ],
    associatedAlfaaz: [
      { word: 'Deedaar', meaning: 'Nazar bharke dekhna' },
      { word: 'Junoon', meaning: 'Pagalpan ya deewangi' },
      { word: 'Ulfath', meaning: 'Sacchi lagan aur chahat' },
      { word: 'Tabassum', meaning: 'Halki muskaan' },
      { word: 'Qurbaani', meaning: 'Samarpan' }
    ]
  },
  {
    id: 'judai',
    nameRoman: 'Judai',
    tagline: 'Hijr, Firaaq Aur Doori Ka Zehar',
    descriptionHinglish:
      'Mehboob se door hone ka dukh. Lambi sunehri raatein, intezaar ki be-chaini, aur aakhri mulaqaat ka ehsaas.',
    color: '#59263C',
    bgGradient: 'from-rose-950/50 via-[#15151C] to-[#0B0B0F]',
    borderGlow: 'border-rose-900/50 hover:border-rose-700',
    relatedPoetIds: ['ghalib', 'faraz', 'jaun', 'sahir'],
    writingPrompts: [
      'Aakhri baar jab tum dono mile the uss raste ki dastaan likhein.',
      'Un-kahe lafzon ka bojh jo alvida kehte waqt gale me atak gaya tha.',
      'Raat ke 3 baje phone ki purani tasweeron ko dekh kar ek misra shuru karein.'
    ],
    associatedAlfaaz: [
      { word: 'Hijr', meaning: 'Judai ka daur' },
      { word: 'Firaaq', meaning: 'Bichhadne ki be-chaini' },
      { word: 'Alvida', meaning: 'Aakhri rukhsati' },
      { word: 'Ranjish', meaning: 'Narazgi aur dukh' },
      { word: 'Kasak', meaning: 'Dil me rehne wali meethi chubhan' }
    ]
  },
  {
    id: 'tanhai',
    nameRoman: 'Tanhai',
    tagline: 'Khaali Kamra, Khamoshi Aur Apne Saath Guftagu',
    descriptionHinglish:
      'Bheed ke beech me akelapan. Khud se baatein karna, cigarette ka dhuaan, aur deewaron se takraati khamoshi.',
    color: '#8C6F38',
    bgGradient: 'from-[#15151C] via-[#0B0B0F] to-[#1a121d]',
    borderGlow: 'border-zinc-700/50 hover:border-zinc-500',
    relatedPoetIds: ['jaun', 'ghalib', 'parveen', 'firaq'],
    writingPrompts: [
      'Jab sab so jayein aur dunya sooni ho jaye, tab dil me aane wali aawaz.',
      'Apne saaye se shikwa karte hue do misre likhein.',
      'Shayari jo bata sake ki akele rehne me dard aur azaadi dono hain.'
    ],
    associatedAlfaaz: [
      { word: 'Khalwat', meaning: 'Akela-pan / Solitude' },
      { word: 'Gumaan', meaning: 'Shak ya veham' },
      { word: 'Khamoshi', meaning: 'Sannata' },
      { word: 'Shab-e-Tanha', meaning: 'Akelepan ki raat' },
      { word: 'Guraiz', meaning: 'Bach kar nikalna' }
    ]
  },
  {
    id: 'yaadein',
    nameRoman: 'Yaadein',
    tagline: 'Maazi Ka Dhuwan, Purane Khat Aur Bitee Shaamein',
    descriptionHinglish:
      'Guzre hue zamane ki meethi-kadwi yaadein jo achanak kisi khushboo ya purani dhun se zinda ho uthti hain.',
    color: '#C6A66B',
    bgGradient: 'from-amber-950/30 via-[#15151C] to-[#0B0B0F]',
    borderGlow: 'border-amber-600/30 hover:border-amber-500',
    relatedPoetIds: ['parveen', 'faraz', 'sahir', 'mir'],
    writingPrompts: [
      'Koi aisi purani gali jahan ab tumhara koi nahi rehta.',
      'Pehli baar jab unhone tumhara naam pukara tha.',
      'College ke din ya wo chai ki dukaan jahan waqt thehar jata tha.'
    ],
    associatedAlfaaz: [
      { word: 'Maazi', meaning: 'Past / Bita hua kal' },
      { word: 'Tasawwur', meaning: 'Kalpana ya khayal' },
      { word: 'Khatoot', meaning: 'Purani chitthiyan' },
      { word: 'Dhoondli', meaning: 'Faded memories' },
      { word: 'Sada', meaning: 'Pukaar ya aawaz' }
    ]
  },
  {
    id: 'dard',
    nameRoman: 'Dard',
    tagline: 'Dil-e-Muztar, Zakhm Aur Soz-e-Jigar',
    descriptionHinglish:
      'Aisa gham jo cheekhta nahi balki aahista aahista andar hi andar pighalta hai. Mir Taqi Mir ki tarah ashkon ka silsila.',
    color: '#59263C',
    bgGradient: 'from-rose-950/60 via-[#3C1425] to-[#0B0B0F]',
    borderGlow: 'border-rose-800/40 hover:border-rose-600',
    relatedPoetIds: ['mir', 'ghalib', 'jaun', 'faraz'],
    writingPrompts: [
      'Aisa zakhm jo bahar se dikhta nahi magar har saans me chubhta hai.',
      'Dard jab dawa ban jaye aur insaan use jeena seekh le.',
      'Aansu jo palkon par aa kar ruk gaye, unki dastaan.'
    ],
    associatedAlfaaz: [
      { word: 'Soz', meaning: 'Jalan ya andar ki aag' },
      { word: 'Bismil', meaning: 'Ghayal ya tadapta hua' },
      { word: 'Gardan-e-Waqt', meaning: 'Waqt ka sitam' },
      { word: 'Marham', meaning: 'Ilaaj ya lepa' },
      { word: 'Chashm-e-Nam', meaning: 'Bheegi hui aankhein' }
    ]
  },
  {
    id: 'umeed',
    nameRoman: 'Umeed',
    tagline: 'Seher Ka Noor, Nayi Subah Aur Zindagi Ka Jazba',
    descriptionHinglish:
      'Ghanghor andhere ke baad subah ki pehli kiran. Faiz aur Iqbal ki tarah himmat aur naye aasmaan ki justuju.',
    color: '#C6A66B',
    bgGradient: 'from-amber-700/30 via-emerald-950/20 to-[#0B0B0F]',
    borderGlow: 'border-emerald-700/40 hover:border-amber-400',
    relatedPoetIds: ['faiz', 'iqbal', 'bulleh'],
    writingPrompts: [
      'Girte hue patte ke baad nayi shaakh nikalne ki umeed.',
      'Har haar ke baad uthne wale hosle par geet ya sher.',
      'Andheri raat se kaho ki meri subah ka suraj taiyyar hai.'
    ],
    associatedAlfaaz: [
      { word: 'Seher', meaning: 'Bhor / Subah ki pehli kiran' },
      { word: 'Justuju', meaning: 'Talash aur koshish' },
      { word: 'Noor', meaning: 'Roshni aur chamatkaar' },
      { word: 'Hausla', meaning: 'Himmat' },
      { word: 'Parwaz', meaning: 'Udaan' }
    ]
  },
  {
    id: 'gussa',
    nameRoman: 'Gussa',
    tagline: 'Aag, Baghaawat, Tanz Aur Mazloom Ki Cheekh',
    descriptionHinglish:
      'Na-insafi, jhooth aur riwayaton ke khilaf khara gussa. Rahat Indori aur Sahir Ludhianvi jaisa aag ugalta tevar.',
    color: '#9E2A2B',
    bgGradient: 'from-red-950/60 via-[#15151C] to-[#0B0B0F]',
    borderGlow: 'border-red-800/50 hover:border-red-600',
    relatedPoetIds: ['rahat', 'sahir', 'jaun', 'faiz'],
    writingPrompts: [
      'Satta aur hukumat ke jhooth par kadi chot karta hua sher.',
      'Jab chup rehna jurm ban jaye aur awaaz uthana laazmi ho.',
      'Apne aatmasamman ke liye har rishta thukra dene ka gussa.'
    ],
    associatedAlfaaz: [
      { word: 'Baghaawat', meaning: 'Rebellion / Vidroh' },
      { word: 'Sitam', meaning: 'Zulm aur atyachar' },
      { word: 'Aatish', meaning: 'Aag' },
      { word: 'Zanjeer', meaning: 'Bhediyaan' },
      { word: 'Inqilaab', meaning: 'Kranthi' }
    ]
  },
  {
    id: 'zindagi',
    nameRoman: 'Zindagi',
    tagline: 'Safarnama, Dhoop-Chhaon Aur Kirdar',
    descriptionHinglish:
      'Zindagi ka safar jisme khushi, gham, safar aur manzil sab shamil hain. Jeene ka saleeqa aur har rang ko qubool karna.',
    color: '#8C6F38',
    bgGradient: 'from-amber-950/30 via-[#15151C] to-[#0B0B0F]',
    borderGlow: 'border-amber-700/40 hover:border-amber-500',
    relatedPoetIds: ['ghalib', 'kabir', 'faiz', 'bulleh'],
    writingPrompts: [
      'Zindagi ek mela hai jahan har shakhs apna tamasha dekh raha hai.',
      'Safar aur manzil ke beech ki khoobsurti par nazm.',
      'Kayi baar gir kar sambhalne ka tazurba.'
    ],
    associatedAlfaaz: [
      { word: 'Hayaat', meaning: 'Life / Zindagi' },
      { word: 'Rasta', meaning: 'Safar ka marg' },
      { word: 'Tazurba', meaning: 'Experience' },
      { word: 'Mukaam', meaning: 'Manzil ya thehraav' },
      { word: 'Saans', meaning: 'Jeevan ki dor' }
    ]
  },
  {
    id: 'khuddaari',
    nameRoman: 'Khuddaari',
    tagline: 'Ana, Aatmasamman, Jhukne Se Inkaar Aur Guroor',
    descriptionHinglish:
      'Sir utha kar jeene ka naaz. Chahe bhookhe so jayein par kisi ke aage haath na failayein. Rahat, Jaun aur Sahir ka tevar.',
    color: '#C6A66B',
    bgGradient: 'from-amber-800/40 via-[#15151C] to-[#0B0B0F]',
    borderGlow: 'border-amber-500/40 hover:border-amber-300',
    relatedPoetIds: ['rahat', 'jaun', 'sahir', 'iqbal'],
    writingPrompts: [
      'Mera sar jahan jhukega wahan sirf rab hoga, koi shakhs nahi.',
      'Kangaali me bhi shehanshahon jaisa dil rakhne par sher.',
      'Jo meri qadar na kare uske raste par wapas na jane ka ahed.'
    ],
    associatedAlfaaz: [
      { word: 'Ana', meaning: 'Ego / Swabhiman' },
      { word: 'Ghairat', meaning: 'Self-respect / Izzat' },
      { word: 'Inkaar', meaning: 'Mana karne ki himmat' },
      { word: 'Shaukat', meaning: 'Shaan aur rutba' },
      { word: 'Buland', meaning: 'Uncha' }
    ]
  },
  {
    id: 'falsafa',
    nameRoman: 'Falsafa',
    tagline: 'Wujoodi Sawaal, Roohaniyat Aur Haqeeqat',
    descriptionHinglish:
      'Hum kahan se aaye hain aur kahan ja rahe hain? Kabir, Bulleh Shah aur Ghalib ke falsafiyana andaz me dunya ki haqeeqat.',
    color: '#C6A66B',
    bgGradient: 'from-purple-950/40 via-[#15151C] to-[#0B0B0F]',
    borderGlow: 'border-purple-800/40 hover:border-amber-400',
    relatedPoetIds: ['ghalib', 'kabir', 'bulleh', 'iqbal'],
    writingPrompts: [
      'Insaan aur khuda ke darmiyaan ka sachcha rishta.',
      'Maut aur zindagi ke dorahe par khada fankaar.',
      'Maya, dunya aur rooh ka anokha khel.'
    ],
    associatedAlfaaz: [
      { word: 'Wujood', meaning: 'Existence' },
      { word: 'Tasawwuf', meaning: 'Mysticism / Sufism' },
      { word: 'Marifat', meaning: 'Supreme Divine Knowledge' },
      { word: 'Fana', meaning: 'Khuda me mit jana' },
      { word: 'Baqa', meaning: 'Hamesha ke liye zinda rehna' }
    ]
  }
];
