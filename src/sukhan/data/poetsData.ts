import { PoetProfile } from '../types';

export const POETS_DATA: PoetProfile[] = [
  {
    id: 'ghalib',
    nameRoman: 'Mirza Ghalib',
    takhallus: 'Ghalib / Asad',
    era: 'Classical Mughal Era',
    eraDates: '1797 – 1869',
    languages: ['Urdu'],
    birthPlace: 'Agra (Kala Mahal), Delhi',
    bioHinglish:
      'Urdu aur Farsi ke azeem tareen shayar. Inhone traditional tasawwuf aur ishq ko aisi falsafiyana gehrai di jo aaj 200 saal baad bhi har dil ki aawaz lagti hai. Dilli ki Gali Qasim Jan me inka mazaar-e-adab aaj bhi zinda hai.',
    historicalContextHinglish:
      'Bahadur Shah Zafar ke daur me Mughal sultanat ke aakhri saalon aur 1857 ke ghadar ke dauran inka kalam likha gaya. Uss tootte hue zamane ki udaasi inke ash\'aar me saaf jhalakti hai.',
    majorThemes: ['Falsafa-e-Zindagi', 'Gham-e-Rozgaar', 'Ishq Aur Junoon', 'Khuddaari', 'Tanhai'],
    signatureCouplet: [
      'Hazaron khwahishen aisi ki har khwahish pe dam nikle,',
      'Bohat nikle mere armaan lekin phir bhi kam nikle.'
    ],
    signatureMeaning:
      'Insaan ki khwahishein be-inteha hain, har khwahish poori hone ki tamanna me jaan chali jati hai. Bahut si tamannayein poori hui, phir bhi dil ki pyas adhuri hi rahi.',
    verifiedWorksCount: 350,
    accentColor: '#C6A66B',
    portraitGradient: 'from-amber-700/40 via-[#59263C]/30 to-[#0B0B0F]',
    sourceReferences: ['Diwan-e-Ghalib (Urdu)', 'Kulliyat-e-Farsi Ghalib', 'Dastambu Historical Diary'],
    relatedPoetIds: ['mir', 'iqbal', 'jaun'],
    popularCouplets: [
      {
        id: 'ghalib_1',
        poetId: 'ghalib',
        poetName: 'Mirza Ghalib',
        linesRoman: [
          'Dil-e-nadaan tujhe hua kya hai,',
          'Aakhir is dard ki dawa kya hai.'
        ],
        hinglishMeaning:
          'Shayar apne hi bhole dil se mukhatib ho kar poochta hai ki tujhe aakhir kya rog laga hai, aur is la-ilaj dard ka elaaj kya hai.',
        moods: ['Dard', 'Ishq', 'Falsafa'],
        form: 'Sher',
        tags: ['classic', 'dil', 'dard'],
        difficultWords: [
          { word: 'Dil-e-nadaan', meaning: 'Bina samjh ka dil / Innocent heart' },
          { word: 'Dawa', meaning: 'Ilaaj ya cure' }
        ]
      },
      {
        id: 'ghalib_2',
        poetId: 'ghalib',
        poetName: 'Mirza Ghalib',
        linesRoman: [
          'Ishq par zor nahi hai ye wo aatish Ghalib,',
          'Ki lagaye na lage aur bujhaye na bane.'
        ],
        hinglishMeaning:
          'Mohabbat kisi ke qaboo me nahi hoti; ye aisi aag hai jo na toh jaan-boojh kar lagayi ja sakti hai aur na hi lagne ke baad bujhai ja sakti hai.',
        moods: ['Ishq', 'Junoon'],
        form: 'Sher',
        tags: ['aatish', 'ishq', 'dil'],
        difficultWords: [
          { word: 'Aatish', meaning: 'Aag / Fire' },
          { word: 'Zor', meaning: 'Control ya Ikhtiyar' }
        ]
      },
      {
        id: 'ghalib_3',
        poetId: 'ghalib',
        poetName: 'Mirza Ghalib',
        linesRoman: [
          'Hum ko maloom hai jannat ki haqeeqat lekin,',
          'Dil ke khush rakhne ko Ghalib ye khayal achha hai.'
        ],
        hinglishMeaning:
          'Hum jaante hain jannat ki sacchayi kya hai, par dil ko behlaane aur tassali dene ke liye ye khushfehmi bura khayal nahi hai.',
        moods: ['Falsafa', 'Khuddaari'],
        form: 'Sher',
        tags: ['jannat', 'falsafa', 'tanz'],
        difficultWords: [
          { word: 'Haqeeqat', meaning: 'Reality / Sacchayi' },
          { word: 'Khayal', meaning: 'Soch / Thought' }
        ]
      }
    ],
    poems: [
      {
        id: 'ghalib_ghazal_1',
        poetId: 'ghalib',
        poetName: 'Mirza Ghalib',
        titleRoman: 'Yeh Na Thi Hamari Qismat',
        form: 'Ghazal',
        language: 'Urdu',
        radif: 'hona',
        qafiya: 'visaal, saal, haal',
        beherName: 'Ramal Musamman Makhboon',
        couplets: [
          ['Yeh na thi hamari qismat ki visaal-e-yaar hota,', 'Agar aur jeete rehte yahi intezaar hota.'],
          ['Tere vaade par jiye hum toh yeh jaan jhooth jaana,', 'Ki khushi se mar na jaate agar eitbaar hota.'],
          ['Kaho kis se main ki kya hai shab-e-gham buri bala hai,', 'Mujhe kya bura tha marna agar ek baar hota.']
        ],
        hinglishSummary:
          'Ghalib ki sabse mashhoor ghazal jisme mehboob ke milne ki na-umeedi, vaadon par shak, aur hijr ki lambi raaton ke azaab ko byan kiya gaya hai.',
        difficultWords: [
          { word: 'Visaal-e-yaar', meaning: 'Mehboob se milan (Union with beloved)' },
          { word: 'Shab-e-gham', meaning: 'Gham ki raat / Dark night of grief' },
          { word: 'Eitbaar', meaning: 'Bharosa / Trust' }
        ],
        moods: ['Judai', 'Tanhai', 'Dard']
      }
    ]
  },
  {
    id: 'jaun',
    nameRoman: 'Jaun Elia',
    takhallus: 'Jaun',
    era: 'Modern Nihilist Era',
    eraDates: '1931 – 2002',
    languages: ['Urdu'],
    birthPlace: 'Amroha (UP), Karachi',
    bioHinglish:
      'Jaun Elia 20th century ke sabse baaghi aur dil-soz shayar hain. Falsafa, tanhai, be-zaari aur khud-kalaami inki pehchan hai. Inke andaz-e-bayan me aam aashique nahi balki wujoodi sawal aur khuddari bhara dard milta hai.',
    historicalContextHinglish:
      'Taqseem-e-Hind ke baad Amroha chhodkar Karachi basne ka dukh inke har sher me rota hai. Mehboob se narazgi aur khud se bezaari inke kalam ka sabse gehra rang hai.',
    majorThemes: ['Be-zaari (Existential Nihilism)', 'Tanhai', 'Judai', 'Gussa', 'Khuddaari'],
    signatureCouplet: [
      'Shayad mujhe kisi se mohabbat nahi hui,',
      'Lekin yaqeen sab ko dilata raha hoon main.'
    ],
    signatureMeaning:
      'Jaun yahan insaani rishton ki banawati fitrat aur apne andar ke akelepan ka sach bayaan karte hain ki shayad unhone kabhi sachcha ishq mehsoos hi nahi kiya, bas zamane ko dhoka dete rahe.',
    verifiedWorksCount: 220,
    accentColor: '#59263C',
    portraitGradient: 'from-rose-950/50 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Shayad (1991)', 'Yaani (2003)', 'Gumaan (2004)', 'Lekin (2006)'],
    relatedPoetIds: ['ghalib', 'mir', 'faraz'],
    popularCouplets: [
      {
        id: 'jaun_1',
        poetId: 'jaun',
        poetName: 'Jaun Elia',
        linesRoman: [
          'Jo guzaari na ja saki hum se,',
          'Hum ne wo zindagi guzaari hai.'
        ],
        hinglishMeaning:
          'Aisi zindagi jo jeene ke laayak nahi thi, jisme har lamha azab tha, humne wahi zindagi majboori me kaati hai.',
        moods: ['Dard', 'Zindagi', 'Tanhai'],
        form: 'Sher',
        tags: ['zindagi', 'dard', 'dard-e-dil'],
        difficultWords: [
          { word: 'Guzaari', meaning: 'Spent / Jeena' }
        ]
      },
      {
        id: 'jaun_2',
        poetId: 'jaun',
        poetName: 'Jaun Elia',
        linesRoman: [
          'Kaun is ghar ki dekh-bhaal kare,',
          'Roz ek cheez toot jaati hai.'
        ],
        hinglishMeaning:
          'Ghar yahan insaan ke dil aur wujood ka isti\'ara (metaphor) hai; roz koi na koi ummeed, ehsaas ya rishta toot-ta rehta hai.',
        moods: ['Judai', 'Dard', 'Tanhai'],
        form: 'Sher',
        tags: ['tootna', 'tanhai', 'dil'],
        difficultWords: [
          { word: 'Dekh-bhaal', meaning: 'Care / Hifazat' }
        ]
      },
      {
        id: 'jaun_3',
        poetId: 'jaun',
        poetName: 'Jaun Elia',
        linesRoman: [
          'Be-dili kya yoon hi din guzar jayenge,',
          'Sirf zinda rahe hum to mar jayenge.'
        ],
        hinglishMeaning:
          'Bina kisi shauq, maqsad ya jazbe ke sirf saans lena zindagi nahi; agar aise hi zinda rahe toh rooh pehle hi mar jayegi.',
        moods: ['Falsafa', 'Zindagi'],
        form: 'Sher',
        tags: ['zindagi', 'bedili', 'maut'],
        difficultWords: [
          { word: 'Be-dili', meaning: 'Bina dil ke / Lack of enthusiasm / Apathy' }
        ]
      }
    ],
    poems: [
      {
        id: 'jaun_ghazal_1',
        poetId: 'jaun',
        poetName: 'Jaun Elia',
        titleRoman: 'Kya Takalluf Karein Ye Kehne Mein',
        form: 'Ghazal',
        language: 'Urdu',
        radif: 'mein',
        qafiya: 'kehne, rehne, sehne',
        beherName: 'Khafeef Musaddas',
        couplets: [
          ['Kya takalluf karein yeh kehne mein,', 'Jo bhi khush hai hum us se jalte hain.'],
          ['Hum ko yaaron ne yaad bhi na rakha,', 'Jaun yaaron ki baat hi kya thi.']
        ],
        hinglishSummary:
          'Jaun Elia ka khalis be-baak andaz jisme wo insani hasad aur doston ki bewafai ko bina kisi parde ke seedha qubool karte hain.',
        difficultWords: [
          { word: 'Takalluf', meaning: 'Hesitation / Formal sharam' },
          { word: 'Hasad', meaning: 'Jalan / Envy' }
        ],
        moods: ['Gussa', 'Khuddaari', 'Tanhai']
      }
    ]
  },
  {
    id: 'mir',
    nameRoman: 'Mir Taqi Mir',
    takhallus: 'Mir (Khuda-e-Sukhan)',
    era: 'Golden Mughal Era',
    eraDates: '1723 – 1810',
    languages: ['Urdu'],
    birthPlace: 'Agra, Delhi, Lucknow',
    bioHinglish:
      'Urdu shayari ke \'Khuda-e-Sukhan\' (Poetry ke Shahenshah). Inke kalam me jo soz, saadgi aur dard-e-dil hai wo poori tareekh me kisi ke paas nahi. Mirza Ghalib ne khud kaha tha: "Rehte ke tumhi ustaad nahi ho Ghalib, kehte hain agle zamaane mein koi Mir bhi tha."',
    historicalContextHinglish:
      'Nadir Shah aur Ahmad Shah Abdali ke Dilli par hamlon ke chashm-deed gawah the. Dilli ki barbadi aur unke shakhsi dukh mil kar aisi shayari bane jo aansuon me doobi lagti hai.',
    majorThemes: ['Soz-o-Gudaz (Heartache)', 'Dard-e-Dil', 'Ishq-e-Haqeeqi', 'Falsafa-e-Dunya'],
    signatureCouplet: [
      'Patta patta boota boota haal hamara jaane hai,',
      'Jaane na jaane gul hi na jaane baagh toh saara jaane hai.'
    ],
    signatureMeaning:
      'Baagh ka har patta aur tinka hamare dard-o-ishq ki dastaan jaanta hai; bas wahi ek phool (mehboob) be-khabar hai jiske liye hum tadap rahe hain.',
    verifiedWorksCount: 400,
    accentColor: '#C6A66B',
    portraitGradient: 'from-amber-900/30 via-[#3C1425] to-[#0B0B0F]',
    sourceReferences: ['Kulliyat-e-Mir', 'Nukat-ush-Shu\'ara', 'Zikr-e-Mir'],
    relatedPoetIds: ['ghalib', 'faiz', 'parveen'],
    popularCouplets: [
      {
        id: 'mir_1',
        poetId: 'mir',
        poetName: 'Mir Taqi Mir',
        linesRoman: [
          'Ibtida-e-ishq hai rota hai kya,',
          'Aage aage dekhiye hota hai kya.'
        ],
        hinglishMeaning:
          'Abhi toh mohabbat ki shuruat hui hai aur abhi se ro rahe ho; aage chal kar dekho kaisa tufan aur imtehan aana baaqi hai.',
        moods: ['Ishq', 'Dard', 'Zindagi'],
        form: 'Sher',
        tags: ['ibtida', 'ishq', 'dard'],
        difficultWords: [
          { word: 'Ibtida', meaning: 'Beginning / Shuruat' }
        ]
      },
      {
        id: 'mir_2',
        poetId: 'mir',
        poetName: 'Mir Taqi Mir',
        linesRoman: [
          'Dillagi thi kabhi jo ab jee ka rog thehri,',
          'Hum toh samjhe the aasan hai ishq ka daawa karna.'
        ],
        hinglishMeaning:
          'Jo shuru me bas ek hansi-mazaak ya dillagi lagti thi, wahi aage chal kar jaan lewa rog ban gayi.',
        moods: ['Ishq', 'Judai'],
        form: 'Sher',
        tags: ['dillagi', 'ishq'],
        difficultWords: [{ word: 'Dillagi', meaning: 'Halka mazaak / Flirtation' }]
      }
    ],
    poems: []
  },
  {
    id: 'faiz',
    nameRoman: 'Faiz Ahmed Faiz',
    takhallus: 'Faiz',
    era: 'Progressive Writers Era',
    eraDates: '1911 – 1984',
    languages: ['Urdu', 'Punjabi'],
    birthPlace: 'Sialkot (Punjab), Lahore',
    bioHinglish:
      'Taraqqi-pasand tehreek (Progressive Writers) ke sabse unche sitare. Inhone ishq aur inqilaab (revolution) ko ek hi dhaage me piro diya. Mehboob ki aankhon ke husn ke saath mazloom awaam ki cheekhon ko awaz di.',
    historicalContextHinglish:
      'Rawalpindi saazish case me jail kaati, jila-watani (exile) jheli, magar inki qalam ne aam logon ki azaadi aur aman ke geet gaana kabhi band nahi kiya. Lenin Peace Prize se nawaze gaye.',
    majorThemes: ['Inqilaab (Revolution)', 'Ishq Aur Samaj', 'Umeed', 'Gussa', 'Judai'],
    signatureCouplet: [
      'Mujh se pehli si mohabbat mere mehboob na maang,',
      'Maine samjha tha ki tu hai toh darakhshan hai hayat.'
    ],
    signatureMeaning:
      'Mehboob se uzr karte hain ki ab mai sirf tere husn ki pooja nahi kar sakta; dunya me bhookh, laachaari aur zulm ke dukh mere mehboob ke gham se bhi bade hain.',
    verifiedWorksCount: 180,
    accentColor: '#8C6F38',
    portraitGradient: 'from-emerald-950/40 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Naqsh-e-Faryadi (1941)', 'Dast-e-Saba (1952)', 'Zindan-Nama (1956)'],
    relatedPoetIds: ['sahir', 'faraz', 'ghalib'],
    popularCouplets: [
      {
        id: 'faiz_1',
        poetId: 'faiz',
        poetName: 'Faiz Ahmed Faiz',
        linesRoman: [
          'Dil na-ummeed toh nahi nakaam hi toh hai,',
          'Lambi hai gham ki shaam magar shaam hi toh hai.'
        ],
        hinglishMeaning:
          'Umeed abhi zinda hai, sirf koshish nakaam hui hai; dukh ki raat kitni bhi lambi ho, aakhirkar dhal hi jaegi aur subah zaroor aayegi.',
        moods: ['Umeed', 'Falsafa', 'Zindagi'],
        form: 'Sher',
        tags: ['umeed', 'subah', 'hausla'],
        difficultWords: [
          { word: 'Na-ummeed', meaning: 'Hopeless' },
          { word: 'Gham ki shaam', meaning: 'Evening of sorrow' }
        ]
      },
      {
        id: 'faiz_2',
        poetId: 'faiz',
        poetName: 'Faiz Ahmed Faiz',
        linesRoman: [
          'Bol ki lab azaad hain tere,',
          'Bol zabaan ab tak teri hai.'
        ],
        hinglishMeaning:
          'Zulm aur khamoshi ke khilaf lalkaar hai ki jab tak bolne ki taaqat aur zabaan bachi hai, sach bolne se mat daro.',
        moods: ['Gussa', 'Khuddaari', 'Umeed'],
        form: 'Sher',
        tags: ['bol', 'azaadi', 'inqilaab'],
        difficultWords: [{ word: 'Lab', meaning: 'Honth / Lips' }]
      }
    ],
    poems: []
  },
  {
    id: 'sahir',
    nameRoman: 'Sahir Ludhianvi',
    takhallus: 'Sahir',
    era: 'Golden Cinema & Progressive Era',
    eraDates: '1921 – 1980',
    languages: ['Urdu', 'Hindi'],
    birthPlace: 'Ludhiana (Punjab), Mumbai',
    bioHinglish:
      'Cinema aur adabi dunya ke azeem shayar. Inke alfaaz me Taj Mahal jaisi aalishaan imaaraton par sawaal uthane ki jurrat thi aur "Kabhi Kabhie Mere Dil Mein" jaisi nazuk shayrana meethi lehar bhi.',
    historicalContextHinglish:
      'Azaadi ke baad cinema ke zariye unhone gareeb, mazdoor aur aurat ke haq ke liye aisi aawaz buland ki jo har aam Hindustani ke dilon me bas gayi.',
    majorThemes: ['Samaji Barabari', 'Taj Mahal Tanz', 'Ishq-e-Nakaam', 'Khuddaari', 'Falsafa'],
    signatureCouplet: [
      'Ek shehanshah ne daulat ka sahara le kar,',
      'Hum ghareebon ki mohabbat ka udaya hai mazaaq.'
    ],
    signatureMeaning:
      'Taj Mahal ke husn par tanz karte hain ki ghareebon ke paas aisi aalishaan maqbare banane ki daulat nahi hoti, iska matlab ye nahi ki unki mohabbat kamtar hai.',
    verifiedWorksCount: 260,
    accentColor: '#C6A66B',
    portraitGradient: 'from-amber-950/40 via-[#59263C]/30 to-[#0B0B0F]',
    sourceReferences: ['Talkhiyan (1944)', 'Parchhaiyan (1955)', 'Aao Ke Koi Khwab Bunein (1971)'],
    relatedPoetIds: ['faiz', 'faraz', 'rahat'],
    popularCouplets: [
      {
        id: 'sahir_1',
        poetId: 'sahir',
        poetName: 'Sahir Ludhianvi',
        linesRoman: [
          'Chalo ek baar phir se ajnabi ban jayein hum dono,',
          'Na main tumse koi ummeed rakhun dil-nawazi ki.'
        ],
        hinglishMeaning:
          'Jab rishta tootte hue mod par aa jaye toh ladai aur ruswayi se behtar hai ki dono izzat ke saath ek dusre ke liye ajnabi ho jayein.',
        moods: ['Judai', 'Khuddaari', 'Yaadein'],
        form: 'Sher',
        tags: ['ajnabi', 'judai', 'khuddari'],
        difficultWords: [{ word: 'Dil-nawazi', meaning: 'Meherbani ya dulaar' }]
      }
    ],
    poems: []
  },
  {
    id: 'faraz',
    nameRoman: 'Ahmad Faraz',
    takhallus: 'Faraz',
    era: 'Romantic Resistance Era',
    eraDates: '1931 – 2008',
    languages: ['Urdu'],
    birthPlace: 'Kohat (KPK), Islamabad',
    bioHinglish:
      '20th century ke sabse maqbool romantic aur inqilabi shayar. Faraz ke sheron ki layaat aur narmi seedhi dil me utar jaati hai. "Ranjish hi sahi" aur "Suna hai log use aankh bhar ke dekhte hain" inki aisi ghazlen hain jo hamesha amar rahengi.',
    historicalContextHinglish:
      'General Zia-ul-Haq ke aamirana daur me inqilabi nazmein likhne ki wajah se jail gaye aur jila-watan hue, magar mohabbat aur haqeeqat ke tarane gaate rahe.',
    majorThemes: ['Romantic Longing', 'Ranjish', 'Bewafai', 'Inqilaab', 'Judai'],
    signatureCouplet: [
      'Ranjish hi sahi dil hi dukhane ke liye aa,',
      'Aa phir se mujhe chhod ke jaane ke liye aa.'
    ],
    signatureMeaning:
      'Mehboob chahe nafrat se aaye ya dil todne aaye, bas ek baar saamne aa jaye; aashiq uski judai ki keemat par bhi uski jhalak chahta hai.',
    verifiedWorksCount: 310,
    accentColor: '#59263C',
    portraitGradient: 'from-rose-950/40 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Tanha Tanha', 'Dard-e-Aashob', 'Jana Jana', 'Khab-e-Gul Pareshan Hai'],
    relatedPoetIds: ['jaun', 'faiz', 'parveen'],
    popularCouplets: [
      {
        id: 'faraz_1',
        poetId: 'faraz',
        poetName: 'Ahmad Faraz',
        linesRoman: [
          'Suna hai log use aankh bhar ke dekhte hain,',
          'So uske shehar mein kuch din thehar ke dekhte hain.'
        ],
        hinglishMeaning:
          'Mehboob ki khubsurti ki itni charcha suni hai ki ab uske shehar me thoda ruk kar khud apni aankhon se dekhna chahte hain.',
        moods: ['Ishq', 'Yaadein'],
        form: 'Sher',
        tags: ['husn', 'deedaar', 'ishq'],
        difficultWords: [{ word: 'Aankh bhar ke', meaning: 'Gaur se / Admiringly' }]
      }
    ],
    poems: []
  },
  {
    id: 'iqbal',
    nameRoman: 'Allama Iqbal',
    takhallus: 'Iqbal (Mufakkir-e-Mashriq)',
    era: 'Philosophical Awakening Era',
    eraDates: '1877 – 1938',
    languages: ['Urdu'],
    birthPlace: 'Sialkot, Lahore',
    bioHinglish:
      'Mufakkir-e-Mashriq aur \'Shayar-e-Mashriq\'. Inhone \'Khudi\' (Self-realization) ka falsafa dunya ko diya. Inka kalam insaan ko aasmaan ki bulandiyan chhoone aur shaheen ban kar udaan bharne ka sabaq deta hai.',
    historicalContextHinglish:
      'Bartanwi hukumat (British Raj) ke zamaane me ghulami ki zanjeeron me jakdi quom ko azaadi, aatmasamman aur khud-shanaasi ka jazba dene ke liye likha.',
    majorThemes: ['Falsafa-e-Khudi', 'Shaheen ki Udaan', 'Jazba-e-Haq', 'Umeed', 'Ruhaniyat'],
    signatureCouplet: [
      'Khudi ko kar buland itna ki har taqdeer se pehle,',
      'Khuda bande se khud pooche bata teri raza kya hai.'
    ],
    signatureMeaning:
      'Apne aatmasamman, kirdar aur salahiyat ko itna buland kar lo ki qismat likhte waqt bhagwan/khuda khud tumse pooche ki bata tu kya chahta hai.',
    verifiedWorksCount: 450,
    accentColor: '#C6A66B',
    portraitGradient: 'from-amber-900/40 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Bang-e-Dra (1924)', 'Bal-e-Jibril (1935)', 'Zarb-e-Kaleem (1936)'],
    relatedPoetIds: ['ghalib', 'kabir', 'bulleh'],
    popularCouplets: [
      {
        id: 'iqbal_1',
        poetId: 'iqbal',
        poetName: 'Allama Iqbal',
        linesRoman: [
          'Sitaron se aage jahan aur bhi hain,',
          'Abhi ishq ke imtehan aur bhi hain.'
        ],
        hinglishMeaning:
          'Zindagi aur manzilein yahin khatam nahi hoti; in sitaron ke paar bhi nayi dunyaaein aur nayi manzilayein intezar kar rahi hain.',
        moods: ['Umeed', 'Falsafa', 'Khuddaari'],
        form: 'Sher',
        tags: ['sitare', 'parwaz', 'bulandi'],
        difficultWords: [
          { word: 'Jahan', meaning: 'Dunya / Universe' },
          { word: 'Imtehan', meaning: 'Exams / Trials' }
        ]
      }
    ],
    poems: []
  },
  {
    id: 'parveen',
    nameRoman: 'Parveen Shakir',
    takhallus: 'Parveen',
    era: 'Modern Feminist Romantic Era',
    eraDates: '1952 – 1994',
    languages: ['Urdu'],
    birthPlace: 'Karachi, Islamabad',
    bioHinglish:
      'Urdu shayari me ek aurat ke ehsaasaat, khushboo, barish aur nazuk jazbaat ko aazadi se awaz dene wali pehli azeem shaira. Inki pehli hi kitaab "Khushboo" ne adabi dunya me toofan la diya tha.',
    historicalContextHinglish:
      'Aik aisi riwayati dunya me jahan mardana shayar aurat ke husn par sher kehte the, Parveen ne aurat ki apni khwahish, pukaar aur dard ko adab ka markaz banaya.',
    majorThemes: ['Khushboo-e-Jazbaat', 'Nazuk Ishq', 'Tanhai', 'Dard-e-Aurat', 'Yaadein'],
    signatureCouplet: [
      'Woh toh khushboo hai hawaon mein bikhar jaayega,',
      'Masla phool ka hai phool kidhar jaayega.'
    ],
    signatureMeaning:
      'Mehboob toh khushboo jaisa azaad hai jo udd kar nikal jayega; dukh us phool (aashiq aurat) ka hai jiska wujood uske jane ke baad murjha kar reh jayega.',
    verifiedWorksCount: 190,
    accentColor: '#C6A66B',
    portraitGradient: 'from-pink-950/40 via-[#59263C]/30 to-[#0B0B0F]',
    sourceReferences: ['Khushboo (1976)', 'Sad-barg (1980)', 'Khud-Kalami (1990)', 'Inkar (1990)'],
    relatedPoetIds: ['faraz', 'jaun', 'ghalib'],
    popularCouplets: [
      {
        id: 'parveen_1',
        poetId: 'parveen',
        poetName: 'Parveen Shakir',
        linesRoman: [
          'Koo-ba-koo phail gayi baat shanaasai ki,',
          'Usne khushboo ki tarah meri paziraai ki.'
        ],
        hinglishMeaning:
          'Gali-gali me hamari dosti aur mulaqaat ki charcha fail gayi, kyunki usne mujhe itni shiddat aur aadar ke saath apna banaya tha.',
        moods: ['Ishq', 'Yaadein'],
        form: 'Sher',
        tags: ['khushboo', 'ishq', 'shanaasai'],
        difficultWords: [
          { word: 'Koo-ba-koo', meaning: 'Gali-gali / Everywhere' },
          { word: 'Paziraai', meaning: 'Istaqbaal / Welcoming with honor' }
        ]
      }
    ],
    poems: []
  },
  {
    id: 'firaq',
    nameRoman: 'Firaq Gorakhpuri',
    takhallus: 'Firaq',
    era: 'Classical Modern Era',
    eraDates: '1896 – 1982',
    languages: ['Urdu', 'Hindi'],
    birthPlace: 'Gorakhpur (UP), Allahabad',
    bioHinglish:
      'Raghupati Sahay \'Firaq\' Urdu ke azeem shayar the jinhone Hindustani sanskriti aur Urdu nazaakat ko aapas me aisi khoobsurti se joda jiska koi saani nahi. Jnanpith Award paane wale pehle Urdu shayar the.',
    historicalContextHinglish:
      'Allahabad University me English literature ke professor the. Inhone Western thought aur Hindustani classical aesthetic ko Urdu ghazal ke husn me piro diya.',
    majorThemes: ['Raat Aur Chandni', 'Husn-o-Ishq', 'Falsafa-e-Ghazal', 'Tanhai'],
    signatureCouplet: [
      'Aane wali naslein tum par fakhr karengi hum-asro,',
      'Jab bhi unko dhyan aayega tumne Firaq ko dekha hai.'
    ],
    signatureMeaning:
      'Firaq ka mashhoor fakhr-bhara sher jisme wo aane wali peedhiyon ke samne apni shayeri ki azeem meeras ki dastaar baandhte hain.',
    verifiedWorksCount: 210,
    accentColor: '#8C6F38',
    portraitGradient: 'from-amber-950/40 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Gul-e-Naghma (1959)', 'Roop (1961)', 'Shabnamistan'],
    relatedPoetIds: ['ghalib', 'mir', 'sahir'],
    popularCouplets: [
      {
        id: 'firaq_1',
        poetId: 'firaq',
        poetName: 'Firaq Gorakhpuri',
        linesRoman: [
          'Sar mein sauda bhi nahi dil mein tamanna bhi nahi,',
          'Lekin is tark-e-mohabbat ka bharosa bhi nahi.'
        ],
        hinglishMeaning:
          'Ab na toh dimaag me junoon hai na dil me koi aashiqui bachi hai, par is mohabbat chhodne ke faisle par bhi dil ko koi bharosa nahi.',
        moods: ['Falsafa', 'Tanhai', 'Dard'],
        form: 'Sher',
        tags: ['sauda', 'tark-e-mohabbat'],
        difficultWords: [{ word: 'Tark-e-mohabbat', meaning: 'Renouncing love / Mohabbat chhod dena' }]
      }
    ],
    poems: []
  },
  {
    id: 'bulleh',
    nameRoman: 'Bulleh Shah',
    takhallus: 'Bullah',
    era: 'Sufi Bhakti Era',
    eraDates: '1680 – 1757',
    languages: ['Punjabi'],
    birthPlace: 'Uch Sharif / Kasur (Punjab)',
    bioHinglish:
      'Punjab ke sabse buland-paaya Sufi shayar aur darvesh. Inhone dharam ke dikhawe, jaat-paat aur kando-rivaaz ko thukra kar khalis roohani ishq aur barabari ka danka bajaya. "Bullah Ki Jaana Main Kaun" inki aisi kafi hai jo aalam-e-arwah ko hila deti hai.',
    historicalContextHinglish:
      'Mughal hukumat ke zawal aur mazhabi ta\'assub ke daur me Shah Inayat Qadiri ko murshid maana aur raste ke har bandhan ko tod kar ishq-e-haqeeqi ka raag chheda.',
    majorThemes: ['Ishq-e-Haqeeqi', 'Kafian', 'Khud-Shanaasi (Who Am I)', 'Mazhabi Azadgi', 'Barabari'],
    signatureCouplet: [
      'Bullah ki jaana main kaun,',
      'Na main momin vich maseetan, na main vich kufr diyan reetan.'
    ],
    signatureMeaning:
      'Main khud nahi jaanta ki main kaun hoon; na main masjidon me baithne wala pakka namazi hoon aur na hi kufr aur bhed-bhav ke riwaazon me phasne wala. Main bas ek azaad aashiq rooh hoon.',
    verifiedWorksCount: 150,
    accentColor: '#C6A66B',
    portraitGradient: 'from-amber-800/40 via-[#3C1425] to-[#0B0B0F]',
    sourceReferences: ['Kulliyat-e-Bulleh Shah', 'Kafian Bulleh Shah'],
    relatedPoetIds: ['kabir', 'iqbal', 'ghalib'],
    popularCouplets: [
      {
        id: 'bulleh_1',
        poetId: 'bulleh',
        poetName: 'Bulleh Shah',
        linesRoman: [
          'Masjid dha de mandir dha de, dha de jo kujh dhenda,',
          'Par kise da dil na dhawein, rab dilaan vich rehnda.'
        ],
        hinglishMeaning:
          'Mandir aur masjid girane se bada paap kisi masoom ka dil todna hai; kyunki khuda pattharon me nahi balki insaan ke saaf dil me basta hai.',
        moods: ['Falsafa', 'Zindagi', 'Ishq'],
        form: 'Kafi',
        tags: ['punjabi', 'dil', 'sufi'],
        difficultWords: [
          { word: 'Dha de', meaning: 'Gira de / Break' },
          { word: 'Dilaan vich', meaning: 'Dilon ke andar' }
        ]
      }
    ],
    poems: []
  },
  {
    id: 'kabir',
    nameRoman: 'Sant Kabir Das',
    takhallus: 'Kabir',
    era: 'Bhakti Movement Era',
    eraDates: '1398 – 1518',
    languages: ['Hindi'],
    birthPlace: 'Varanasi (Kashi / Maghar)',
    bioHinglish:
      'Bhakti kaal ke sabse nidar aur krantikari kavi. Dohe ke zariye unhone bina kisi laag-lapat ke aam bhasha me jeevan ka sabse bada gyan aur pakhand par seedha prahaar kiya. "Pothi Padh Padh Jag Mua" har generation ke dil par asar karti hai.',
    historicalContextHinglish:
      'Madhyakaal ke aam dharmi bhedbhav, chhuachhoot aur pakhandi karmakand ko todne ke liye unhone suta-soot sacchayi ki bhasha boli jo Banaras se lekar poore Bharat me goonji.',
    majorThemes: ['Prem Ka Dhai Aakhar', 'Satya Aur Sadhna', 'Pakhand Par Chot', 'Nirgun Bhakti', 'Doha'],
    signatureCouplet: [
      'Pothi padh padh jag mua, pandit bhaya na koye,',
      'Dhai aakhar prem ka, padhe so pandit hoye.'
    ],
    signatureMeaning:
      'Moti kitabein aur shastra padh-padh kar duniya mar gayi par koi sachcha gyaani na ban saka; jo insaan prem aur karuna ke dhai akshar ko samajh leta hai wahi asli vidwaan hai.',
    verifiedWorksCount: 300,
    accentColor: '#C6A66B',
    portraitGradient: 'from-amber-900/40 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Kabir Bijak', 'Sakhi Granth', 'Guru Granth Sahib Ji (Kabir Bani)'],
    relatedPoetIds: ['bulleh', 'iqbal', 'mir'],
    popularCouplets: [
      {
        id: 'kabir_1',
        poetId: 'kabir',
        poetName: 'Sant Kabir Das',
        linesRoman: [
          'Bura jo dekhan main chala, bura na milya koye,',
          'Jo dil khoja aapna, mujhse bura na koye.'
        ],
        hinglishMeaning:
          'Main dunya me bure logon ki khoj karne nikla toh mujhe koi bura nahi dikha; par jab maine apne andar jhaank kar dekha toh pata chala mujhse bada paapi koi nahi tha.',
        moods: ['Falsafa', 'Zindagi', 'Khuddaari'],
        form: 'Doha',
        tags: ['doha', 'gyan', 'aatma'],
        difficultWords: [{ word: 'Khoja', meaning: 'Dhoondha / Searched' }]
      }
    ],
    poems: []
  },
  {
    id: 'rahat',
    nameRoman: 'Rahat Indori',
    takhallus: 'Rahat',
    era: 'Contemporary Mushaira Legend',
    eraDates: '1950 – 2020',
    languages: ['Urdu', 'Hindi'],
    birthPlace: 'Indore (MP)',
    bioHinglish:
      'Mushairon ke be-taaj baadshah aur aawaz ke jadugar. Inke sher me aam aawam ka gussa, inqilabi tevar aur jazbaat ka jwala-mukhi tha. Inka har sher stadium aur hall me aag laga deta tha.',
    historicalContextHinglish:
      'Modern daur me jab shayari kitabon me qaid hone lagi thi, Rahat Indori ne use aam galliyon, dharne-pradarshan aur naye yuvak-yuvatiyon ke lahu me zinda kar diya.',
    majorThemes: ['Inqilabi Tevar', 'Aag Aur Lahu', 'Hindustaniat', 'Mushaira Energy', 'Gussa'],
    signatureCouplet: [
      'Sabhi ka khoon shamil hai yahan ki mitti mein,',
      'Kisi ke baap ka Hindustan thodi hai.'
    ],
    signatureMeaning:
      'Is mulk ki azaadi aur mitti me har biradari aur mazhab ke logon ka paseena aur lahu baha hai; ye kisi ek ka baapouti nahi balki sabka barabar watan hai.',
    verifiedWorksCount: 200,
    accentColor: '#59263C',
    portraitGradient: 'from-rose-950/40 via-[#15151C] to-[#0B0B0F]',
    sourceReferences: ['Do Kadam Aur Sahi (1995)', 'Maujood (2005)', 'Naraz (2018)'],
    relatedPoetIds: ['sahir', 'jaun', 'faiz'],
    popularCouplets: [
      {
        id: 'rahat_1',
        poetId: 'rahat',
        poetName: 'Rahat Indori',
        linesRoman: [
          'Bulati hai magar jaane ka nahi,',
          'Ye duniya hai idhar jaane ka nahi.'
        ],
        hinglishMeaning:
          'Zindagi aur dunya me kayi lalach aur fareb bulayenge, magar apne aatmasamman aur hosh ko khokar un raaston par bhatakne ka nahi.',
        moods: ['Khuddaari', 'Falsafa', 'Zindagi'],
        form: 'Sher',
        tags: ['bulati-hai', 'khuddari', 'rahat'],
        difficultWords: [{ word: 'Fareb', meaning: 'Dhoka / Illusion' }]
      },
      {
        id: 'rahat_2',
        poetId: 'rahat',
        poetName: 'Rahat Indori',
        linesRoman: [
          'Lagegi aag toh aayenge ghar kayi zad mein,',
          'Yahan pe sirf hamara makaan thodi hai.'
        ],
        hinglishMeaning:
          'Nafrat ki aag jab lagti hai toh kisi ek ko nahi sabko barbad karti hai; isliye aag lagane walon ko hoshiyaar rehna chahiye.',
        moods: ['Gussa', 'Falsafa'],
        form: 'Sher',
        tags: ['inqilaab', 'aag'],
        difficultWords: [{ word: 'Zad mein', meaning: 'In the range of danger / Lapete mein' }]
      }
    ],
    poems: []
  }
];
