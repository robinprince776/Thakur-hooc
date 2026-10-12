export interface PoeticTermInfo {
  term: string;
  pronunciation: string;
  shortDesc: string;
  hinglishExplanation: string;
  example: [string, string];
  exampleBreakdown: string;
}

export const POETIC_TERMS: PoeticTermInfo[] = [
  {
    term: 'Misra',
    pronunciation: 'Mis-raa',
    shortDesc: 'Shayari ki ek line',
    hinglishExplanation:
      'Shayari ki har ek single line ko \'Misra\' kehte hain. Do Misron ko jod kar ek mukammal \'Sher\' banta hai.',
    example: [
      'Hazaron khwahishen aisi ki har khwahish pe dam nikle (Misra-e-Ula / Pehla Misra)',
      'Bohat nikle mere armaan lekin phir bhi kam nikle (Misra-e-Sani / Dusra Misra)'
    ],
    exampleBreakdown: 'Pehle misre ko Misra-e-Ula aur dusre ko Misra-e-Sani kaha jata hai.'
  },
  {
    term: 'Sher (Couplet)',
    pronunciation: 'She-r',
    shortDesc: 'Do misron ka mukammal shakhsiat wala joda',
    hinglishExplanation:
      'Ghazal ya nazm ka do-line ka aisa hissa jo apne aap me ek poora khayal, dastaan ya falsafa bayan kar deta hai. Ek achhe sher ko samajhne ke liye aage ya peeche ke sher ki zaroorat nahi padti.',
    example: [
      'Dil-e-nadaan tujhe hua kya hai,',
      'Aakhir is dard ki dawa kya hai.'
    ],
    exampleBreakdown: 'Yeh Ghalib ka ek mustaqil aur mukammal Sher hai.'
  },
  {
    term: 'Qafiya (Rhyme)',
    pronunciation: 'Qaa-fi-yaa',
    shortDesc: 'Rhyming words jo Radif se pehle aate hain',
    hinglishExplanation:
      'Har sher me jo lafz aapas me aawaz aur tamm se milte hain unhe Qafiya kehte hain. Ghazal ke pehle sher (Matla) ke dono misron me qafiya aana zaroori hai.',
    example: [
      'Yeh na thi hamari qismat ki VISAAL-e-yaar hota,',
      'Agar aur jeete rehte yahi INTEZAAR hota.'
    ],
    exampleBreakdown: 'Yahan "Visaal" aur "Intezaar" Qafiya hain jinki aakhri aawaz (aal / aar) milti hai.'
  },
  {
    term: 'Radif (Refrain)',
    pronunciation: 'Ra-deef',
    shortDesc: 'Repeat hone wala aakhri lafz ya jumla',
    hinglishExplanation:
      'Qafiya ke theek baad jo lafz ya lafzon ka joda har sher ke aakhir me bilkul bina badle repeat hota hai, use Radif kehte hain.',
    example: [
      'Yeh na thi hamari qismat ki visaal-e-yaar HOTA,',
      'Agar aur jeete rehte yahi intezaar HOTA.'
    ],
    exampleBreakdown: 'Yahan "Hota" lafz Radif hai jo har sher ke aakhir me aayega.'
  },
  {
    term: 'Matla (Opening Couplet)',
    pronunciation: 'Mat-laa',
    shortDesc: 'Ghazal ka pehla shuruati sher',
    hinglishExplanation:
      'Matla ka matlab hota hai tulu hona (suraj ka nikalna). Ghazal ka pehla sher Matla kehlata hai. Iske dono misron me Radif aur Qafiya dono ka aana lazmi hota hai.',
    example: [
      'Dil-e-nadaan tujhe hua kya hai,',
      'Aakhir is dard ki dawa kya hai.'
    ],
    exampleBreakdown: 'Dono misron me "kya hai" Radif hai aur "hua/dawa" Qafiya hai.'
  },
  {
    term: 'Maqta (Closing Couplet)',
    pronunciation: 'Maq-taa',
    shortDesc: 'Ghazal ka aakhri sher jisme Takhallus hota hai',
    hinglishExplanation:
      'Maqta ka matlab hai katna ya khatam hona. Ghazal ka aakhri sher jisme shayar apna takhallus (pen name) istemal karta hai.',
    example: [
      'Hum ko maloom hai jannat ki haqeeqat lekin,',
      'Dil ke khush rakhne ko GHALIB ye khayal achha hai.'
    ],
    exampleBreakdown: 'Yahan "Ghalib" shayar ka naam (Takhallus) aya hai.'
  },
  {
    term: 'Beher aur Wazn (Meter & Rhythm)',
    pronunciation: 'Beh-r / Waz-n',
    shortDesc: 'Shayari ki sur, laya aur meter ka paimana',
    hinglishExplanation:
      'Har sher me lafzon ka wazan ek khas tarranum aur paimane me hona chahiye taaki wo gaane ya padhne me ek sangeet ki tarah behtar lage. Agar wazan toot jaye toh use \'Kharij az Beher\' kehte hain.',
    example: [
      'Fa-i-laa-tun Fa-i-laa-tun Faa-i-lun',
      'Short aur Long syllables ki rhythmic tarteeb.'
    ],
    exampleBreakdown: 'Geet aur Ghazal me behtar rhythm ke liye dono misron ki lambaai aur bolne ka waqt barabar hona chahiye.'
  }
];

export const RHYME_DICTIONARY: Record<string, string[]> = {
  ana: ['Jaana', 'Deewana', 'Afsaana', 'Pehchaana', 'Thikaana', 'Puraana', 'Begaana', 'Zamaana', 'Parwaana', 'Nazaana', 'Khaana', 'Gaana'],
  ar: ['Yaar', 'Deedaar', 'Gulkhaar', 'Bahaar', 'Pyaar', 'Intezaar', 'Qaraar', 'Be-qaraar', 'Dushwaar', 'Izhaar', 'Takraar', 'Sarkaar'],
  at: ['Raat', 'Baat', 'Mulaqaat', 'Jazbaat', 'Hayaat', 'Zaat', 'Aafaat', 'Barsaat', 'Saughaat', 'Najaat'],
  am: ['Jaam', 'Shaam', 'Naam', 'Pehgaam', 'Anjaam', 'Ilzaam', 'Badnaam', 'Aaraam', 'Kalaam', 'Maqaam'],
  el: ['Dil', 'Manzil', 'Saahil', 'Mehfil', 'Qaabil', 'Mushkil', 'Haasil', 'Kaamil', 'Qaatil', 'Ghaafil'],
  oor: ['Door', 'Noor', 'Suroor', 'Guroor', 'Huzoor', 'Majboor', 'Dastoor', 'Mashhoor', 'Mastoor'],
  an: ['Jahaan', 'Makaan', 'Aasmaan', 'Nishaan', 'Bayaan', 'Armaan', 'Kahaan', 'Jawaan', 'Gumaan', 'Kaarwaan'],
  ish: ['Khwahish', 'Aazmaayish', 'Farmaayish', 'Nawaazish', 'Aaraayish', 'Ranjish', 'Sazish'],
  ab: ['Khwaab', 'Shabaab', 'Aftaab', 'Gulaab', 'Jawaab', 'Hisaab', 'Azaab', 'Kitaab', 'Sairaab']
};

export const PUNJABI_SONG_RESOURCES = {
  structures: [
    {
      id: 'punjabi_romantic_ballad',
      title: 'Romantic Punjabi Sufi/Soul Ballad',
      description: 'Dheemi aawaz, roohani ehsaas, akhiyan aur vichhode ka dard.',
      sections: [
        { label: 'Sthai / Mukhda (2-4 Lines)', hint: 'Hook line jo baar baar gunje gi (e.g. Akhiyan udeek diyan, dil nu chain na aave).' },
        { label: 'Drop / Tagline', hint: 'Catchy 1 line jo audience repeat karegi.' },
        { label: 'Antra 1 (Verse)', hint: 'Kahani aage badhao: Raatan di tanhai aur yaadan da dhuwan.' },
        { label: 'Chorus Repetition', hint: 'Mukhda wapas aayega full energy ke saath.' },
        { label: 'Antra 2 (Peak Emotion)', hint: 'Gehra ehsaas: Tere bina jind adhoori, sajjna mud aaja.' },
        { label: 'Outro (Thehraav)', hint: 'Halki gungunahat par gaana khatam hoga.' }
      ]
    },
    {
      id: 'modern_hindi_pop_acoustic',
      title: 'Hindi Acoustic Indie Pop',
      description: 'Chai, barish, dosti aur nazuk mohabbat ka modern indie format.',
      sections: [
        { label: 'Intro & Verse 1', hint: 'Atmospheric opening: Shaam dhali, hawa chali.' },
        { label: 'Pre-Chorus', hint: 'Tension aur excitement badhana.' },
        { label: 'Chorus / Main Hook', hint: 'Gaane ka sabse yaadgaar hissa (Lyrical hook).' },
        { label: 'Verse 2', hint: 'Details aur memories bayaan karein.' },
        { label: 'Bridge', hint: 'Sur aur soch me sudden badlav.' },
        { label: 'Final Chorus & Outro', hint: 'Aakhri baar dil se gaana.' }
      ]
    }
  ],
  vocabulary: [
    { word: 'Akhiyan', meaning: 'Aankhein / Eyes' },
    { word: 'Vichhoda', meaning: 'Judai / Separation' },
    { word: 'Sajjna', meaning: 'Pyaar / Beloved partner' },
    { word: 'Chann', meaning: 'Chaand / Moon' },
    { word: 'Jind / Jindri', meaning: 'Zindagi aur jaan' },
    { word: 'Mahiya', meaning: 'Mehboob' },
    { word: 'Taare', meaning: 'Stars' },
    { word: 'Kamli', meaning: 'Deewani / Crazy in love' },
    { word: 'Kallam-kalla', meaning: 'Bilkul akela' },
    { word: 'Haal-e-Dil', meaning: 'Dil ki dastaan' },
    { word: 'Saanjh', meaning: 'Dosti ya shaam ka rishta' },
    { word: 'Dholna', meaning: 'Pyara saathi' }
  ]
};

export const METAPHOR_SUGGESTIONS = [
  {
    theme: 'Mehboob Ki Aankhein',
    imagery: 'May-khana (Sharab-khana) / Gehra Samundar / Katora-e-Zehar',
    hinglishExplanation: 'Aankhon ko nasha dene wali sharaab ya aisi gehrai jisme doobna sukoon deta hai.'
  },
  {
    theme: 'Judai Ki Raat',
    imagery: 'Kaali Naagin / Be-panah Sehra (Desert) / Thanda Shola',
    hinglishExplanation: 'Hijr ki raat aisi lambi lagti hai jaise koi registan ho jiska koi kinar na ho.'
  },
  {
    theme: 'Toota Hua Dil',
    imagery: 'Seeshe Ka Tukda / Veeran Khandar / Kaghaz Ki Kashti',
    hinglishExplanation: 'Aisa toota hua wujood jise dobara jodna namumkin lagta hai.'
  },
  {
    theme: 'Zindagi Ka Safar',
    imagery: 'Musafir-khana / Dhoop-Chhaon / Ret Par Banti Imaarat',
    hinglishExplanation: 'Zindagi bas chand dinon ka mela hai jahan har shakhs rukaawat par khada hai.'
  }
];
