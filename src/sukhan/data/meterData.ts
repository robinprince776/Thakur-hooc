import { BahrPattern } from '../types';

export const BAHR_PATTERNS: BahrPattern[] = [
  {
    id: 'b1',
    name: 'Bahr-e-Mutaqaarib (Musamman Saalim)',
    arooziPattern: "Fa'oolun Fa'oolun Fa'oolun Fa'oolun",
    weightPattern: '122 122 122 122',
    cadence: 'Darmiyani Bahr (Balanced/Lyrical)',
    descriptionHinglish:
      'Ye Bahr ghazlon aur dastaan-goi me sabse zyada maqbool hai. Iski rawani aisi hai jaise dariya behta ho. Shahnama-e-Firdausi aur Ghalib ke kayi sher is Bahr me hain.',
    popularExample: [
      'Dil-e-nadaan tujhe hua kya hai,',
      'Aakhir is dard ki dawa kya hai.'
    ],
    poet: 'Mirza Ghalib'
  },
  {
    id: 'b2',
    name: 'Bahr-e-Hazaj (Musamman Saalim)',
    arooziPattern: "Mafaa'eelun Mafaa'eelun Mafaa'eelun Mafaa'eelun",
    weightPattern: '1222 1222 1222 1222',
    cadence: 'Lambi Bahr (Grand/Majestic)',
    descriptionHinglish:
      'Lambi aur pur-shikoh Bahr jisme jazbaat ko poori wus\'at (space) milti hai. Tarannum me gaate waqt iska ghumaav behad meetha lagta hai.',
    popularExample: [
      'Hazaron khwahishen aisi ki har khwahish pe dam nikle,',
      'Bohat nikle mere armaan lekin phir bhi kam nikle.'
    ],
    poet: 'Mirza Ghalib'
  },
  {
    id: 'b3',
    name: 'Bahr-e-Ramal (Musaddas Mahzoof)',
    arooziPattern: "Faa'ilaatun Faa'ilaatun Faa'ilun",
    weightPattern: '2122 2122 212',
    cadence: 'Chhoti Bahr (Fast/Intense)',
    descriptionHinglish:
      'Chhoti Bahr jo seedhe teer ki tarah dil me utar jaati hai. Jaun Elia aur Mir Taqi Mir ne is bahr me hairat-angez taaseer paida ki hai.',
    popularExample: [
      'Kaun is ghar ki dekh-bhaal kare,',
      'Roz ek cheez toot jaati hai.'
    ],
    poet: 'Jaun Elia'
  },
  {
    id: 'b4',
    name: 'Bahr-e-Khafeef (Musaddas Makhboon Mahzoof)',
    arooziPattern: "Faa'ilaatun Mafaa'ilun Fa'ilun",
    weightPattern: '2122 1212 112',
    cadence: 'Darmiyani Bahr (Balanced/Lyrical)',
    descriptionHinglish:
      'Nazaakat aur soz-o-gudaz ki mashhoor bahr. Ahmad Faraz ki azeem tareen ghazal "Ranjish hi sahi" is hi bahr par qayam hai.',
    popularExample: [
      'Ranjish hi sahi dil hi dukhane ke liye aa,',
      'Aa phir se mujhe chhod ke jaane ke liye aa.'
    ],
    poet: 'Ahmad Faraz'
  },
  {
    id: 'b5',
    name: 'Bahr-e-Rajaz (Musamman Saalim)',
    arooziPattern: "Mustaf'ilun Mustaf'ilun Mustaf'ilun Mustaf'ilun",
    weightPattern: '2212 2212 2212 2212',
    cadence: 'Lambi Bahr (Grand/Majestic)',
    descriptionHinglish:
      'Josh, inqilaab aur fauji march jaisi dhun peda karne wali taaqatwar bahr. Rahat Indori aur Sahir Ludhianvi ne isme aag bhari hai.',
    popularExample: [
      'Sabhi ka khoon shamil hai yahan ki mitti mein,',
      'Kisi ke baap ka Hindustan thodi hai.'
    ],
    poet: 'Rahat Indori'
  },
  {
    id: 'b6',
    name: 'Bahr-e-Kaamil (Musaddas Saalim)',
    arooziPattern: "Mutafaa'ilun Mutafaa'ilun Mutafaa'ilun",
    weightPattern: '11212 11212 11212',
    cadence: 'Darmiyani Bahr (Balanced/Lyrical)',
    descriptionHinglish:
      'Iski jhankar me ek alag tarah ki taranum hoti hai jo dheere-dheere sune wale par asar karti hai.',
    popularExample: [
      'Kabhi kisi ko mukammal jahan nahi milta,',
      'Kahin zameen to kahin aasmaan nahi milta.'
    ],
    poet: 'Nida Fazli'
  }
];

export const AROOZ_RULES = [
  {
    title: 'Harkat (1 - Laghu / Short Syllable)',
    description: 'Zabar (a), Zer (i), Pesh (u) wale akele harf ko 1 (Short) count kiya jata hai. Jaise "Di-l" ka "Di" = 1.'
  },
  {
    title: 'Sukoon / Jazm (2 - Guru / Long Syllable)',
    description: 'Bada vowel (Aa, Ee, Oo, Ai, Au) ya do harf milkar (jaise "Dil" ka poora lafz jab akele bola jaye) = 2.'
  },
  {
    title: 'Taqti Ka Buniyadi Qanoon (Aawaz Ka Asar)',
    description: 'Arooz me likhavat nahi balki Aawaz (Pronunciation) count hoti hai. Jo lafz bolte waqt saaf sunayi deta hai sirf wahi wazan me aata hai; khamosh (silent) harf drop ho jaate hain.'
  },
  {
    title: 'Alif-e-Wasl (Do Lafzon Ka Milna)',
    description: 'Jab do lafz aapas me judte hain jaise "Dil-e-nadaan" toh "Dil" + "e" = Di-le (1 2) ban jata hai.'
  }
];
