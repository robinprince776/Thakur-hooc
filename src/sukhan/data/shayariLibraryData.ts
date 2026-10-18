export interface LibrarySher {
  id: string;
  linesRoman: [string, string];
  originalScript?: [string, string];
  poetName: string;
  poetId: string;
  mood: string;
  subMood?: string;
  hinglishMeaning: string;
  difficultWords: { word: string; meaning: string }[];
  tags: string[];
}

export const SHAYARI_LIBRARY_DATA: LibrarySher[] = [
  // ==========================================
  // --- ISHQ & MOHABBAT (Romantic & Love) ---
  // ==========================================
  {
    id: 'ishq-1',
    linesRoman: [
      'Tere aane ki jab khabar mehke,',
      'Teri khushboo se sara ghar mehke.'
    ],
    originalScript: ['تیرے آنے کی جب خبر مہکے', 'تیری خوشبو سے سارا گھر مہکے'],
    poetName: 'Ahmad Faraz',
    poetId: 'faraz',
    mood: 'Ishq',
    subMood: 'Mohabbat',
    hinglishMeaning: 'Jab tumhare aane ki umeed ya khabar milti hai, to poora ghar tumhari mehak se roshan ho uthta hai.',
    difficultWords: [
      { word: 'Mehke', meaning: 'Khushboo bikhar jana' },
      { word: 'Khabar', meaning: 'Sandesh ya aamad ki soochana' }
    ],
    tags: ['ishq', 'mohabbat', 'khushboo', 'faraz']
  },
  {
    id: 'ishq-2',
    linesRoman: [
      'Hazaron khwahishen aisi ki har khwahish pe dam nikle,',
      'Bohat nikle mere armaan lekin phir bhi kam nikle.'
    ],
    originalScript: ['ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے', 'بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے'],
    poetName: 'Mirza Ghalib',
    poetId: 'ghalib',
    mood: 'Ishq',
    subMood: 'Hasrat',
    hinglishMeaning: 'Dil me itni be-panah khwahishein hain ki har ek par jaan nikalti hai; bohat se armaan poore hue magar phir bhi dil ki pyaas baaqi rahi.',
    difficultWords: [
      { word: 'Dam nikle', meaning: 'Jaan nikal jana' },
      { word: 'Armaan', meaning: 'Dil ki tamanna' }
    ],
    tags: ['ghalib', 'ishq', 'hasrat', 'armaan']
  },
  {
    id: 'ishq-3',
    linesRoman: [
      'Mohabbat me nahi hai farq jeene aur marne ka,',
      'Usi ko dekh kar jeete hain jis kaafir pe dam nikle.'
    ],
    poetName: 'Mirza Ghalib',
    poetId: 'ghalib',
    mood: 'Ishq',
    subMood: 'Deewangi',
    hinglishMeaning: 'Ishq me jeena aur marna ek barabar ho jata hai; hum usi mehboob ko dekh kar zinda hain jiske liye har pal jaan dene ko tayyar hain.',
    difficultWords: [
      { word: 'Farq', meaning: 'Antar ya bhed' },
      { word: 'Kaafir', meaning: 'Yahan pyara mehboob jo dil chura le' }
    ],
    tags: ['ishq', 'ghalib', 'deewangi', 'mohabbat']
  },
  {
    id: 'ishq-4',
    linesRoman: [
      'Wo aaye bazm me itna to Mir ne dekha,',
      'Phir uske baad chiragon me raushni na rahi.'
    ],
    poetName: 'Mir Taqi Mir',
    poetId: 'mir',
    mood: 'Ishq',
    subMood: 'Deedar',
    hinglishMeaning: 'Mehboob ki noorani jhalak aate hi duniya ke saare chirag pheeke pad gaye; unke aage kisi aur ki chamak bachi hi nahi.',
    difficultWords: [
      { word: 'Bazm', meaning: 'Mehfil ya sabha' },
      { word: 'Deedar', meaning: 'Aankhon se dekhna' }
    ],
    tags: ['ishq', 'mir', 'roshni', 'noor']
  },
  {
    id: 'ishq-5',
    linesRoman: [
      'Aankhon me haya, honton pe tabassum ka tabassum,',
      'Tum samne baithe ho to lagta hai zamaana tham gaya.'
    ],
    poetName: 'Parveen Shakir',
    poetId: 'parveen',
    mood: 'Ishq',
    subMood: 'Haya & Husn',
    hinglishMeaning: 'Aankhon me sharmana aur honton par halki muskaan; tumhare aage duniya ki har daud thehar jaati hai.',
    difficultWords: [
      { word: 'Haya', meaning: 'Sharm ya maryada' },
      { word: 'Tabassum', meaning: 'Muskurahat' }
    ],
    tags: ['ishq', 'parveen', 'khoobsurti', 'haya']
  },
  {
    id: 'ishq-6',
    linesRoman: [
      'Kuch to baat hai teri aashiqui me ae sanam,',
      'Warna pathar ke dil ko mom hote nahi dekha.'
    ],
    poetName: 'Dagh Dehlvi',
    poetId: 'dagh',
    mood: 'Ishq',
    subMood: 'Jadoo',
    hinglishMeaning: 'Tumhari mohabbat me itna asar hai ki sangdil shakhs bhi pighal kar meherban ho jata hai.',
    difficultWords: [
      { word: 'Mom', meaning: 'Wax / pighalne wali cheez' },
      { word: 'Sanam', meaning: 'Mehboob' }
    ],
    tags: ['ishq', 'dagh', 'dil', 'asrat']
  },

  // ==========================================
  // --- DARD & GHAM (Sad, Melancholy & Pain) ---
  // ==========================================
  {
    id: 'dard-1',
    linesRoman: [
      'Dil-e-nadaan tujhe hua kya hai,',
      'Aakhir is dard ki dawa kya hai.'
    ],
    originalScript: ['دلِ ناداں تجھے ہوا کیا ہے', 'آخر اس درد کی دوا کیا ہے'],
    poetName: 'Mirza Ghalib',
    poetId: 'ghalib',
    mood: 'Dard',
    subMood: 'Be-basi',
    hinglishMeaning: 'Aye nadaan dil, aakhir tujhe kaisa rog lag gaya hai jiska is duniya me koi ilaaj nazar nahi aata.',
    difficultWords: [
      { word: 'Dil-e-nadaan', meaning: 'Masoom ya behka hua dil' },
      { word: 'Dawa', meaning: 'Ilaaj ya upchar' }
    ],
    tags: ['dard', 'ghalib', 'dil', 'gham']
  },
  {
    id: 'dard-2',
    linesRoman: [
      'Patta patta boota boota haal humara jaane hai,',
      'Jaane na jaane gul hi na jaane baagh to sara jaane hai.'
    ],
    poetName: 'Mir Taqi Mir',
    poetId: 'mir',
    mood: 'Dard',
    subMood: 'Bekhabari',
    hinglishMeaning: 'Bagh ka har patta aur tinka mere dard se waqif hai, bas wahi ek phool (mehboob) anjan bana rehta hai jiske liye hum tadap rahe hain.',
    difficultWords: [
      { word: 'Boota', meaning: 'Chhota paudha' },
      { word: 'Gul', meaning: 'Phool / Mehboob' }
    ],
    tags: ['dard', 'mir', 'mehboob', 'khamoshi']
  },
  {
    id: 'dard-3',
    linesRoman: [
      'Dard jab hadd se guzarta hai to gaa leta hu,',
      'Aankh jab num ho to aaine se chhupa leta hu.'
    ],
    poetName: 'Jaun Elia',
    poetId: 'jaun',
    mood: 'Dard',
    subMood: 'Khamosh Cheekh',
    hinglishMeaning: 'Jab dil ka gham bardasht se bahar ho jata hai to alfaaz banakar gunguna leta hu, aur apne aansu duniya se chhipa leta hu.',
    difficultWords: [
      { word: 'Num', meaning: 'Bheegi hui ya geeli' }
    ],
    tags: ['dard', 'jaun', 'aansoo', 'zakhm']
  },
  {
    id: 'dard-4',
    linesRoman: [
      'Rone se aur ishq me be-baak ho gaye,',
      'Dhoye gaye hum aise ki bas paak ho gaye.'
    ],
    poetName: 'Mirza Ghalib',
    poetId: 'ghalib',
    mood: 'Dard',
    subMood: 'Tasalli',
    hinglishMeaning: 'Gham ke aansu bahane se humare dil ka saara mail dho gaya aur ishq me hum be-khauf aur paak-saaf ho gaye.',
    difficultWords: [
      { word: 'Be-baak', meaning: 'Nidar ya khul ke samne aana' },
      { word: 'Paak', meaning: 'Pavitra aur nirmal' }
    ],
    tags: ['dard', 'ghalib', 'aansoo', 'shifa']
  },
  {
    id: 'dard-5',
    linesRoman: [
      'Humko maloom hai jannat ki haqeeqat lekin,',
      'Dil ke khush rakhne ko Ghalib ye khayal achha hai.'
    ],
    poetName: 'Mirza Ghalib',
    poetId: 'ghalib',
    mood: 'Dard',
    subMood: 'Tanziya Tasalli',
    hinglishMeaning: 'Humein acchi tarah pata hai ki asliyat kya hai, magar toote dil ko behlane ke liye ye meethi tasalli bhi buri nahi.',
    difficultWords: [
      { word: 'Haqeeqat', meaning: 'Sachhai / Reality' }
    ],
    tags: ['dard', 'ghalib', 'falsafa', 'dil']
  },

  // ==========================================
  // --- JUDAI & BEWAFAI (Separation & Heartbreak) ---
  // ==========================================
  {
    id: 'judai-1',
    linesRoman: [
      'Ranjish hi sahi dil hi dukhane ke liye aa,',
      'Aa phir se mujhe chhod ke jaane ke liye aa.'
    ],
    originalScript: ['رنجش ہی سہی دل ہی دکھانے کے لیے آ', 'آ پھر سے مجھے چھوڑ کے جانے کے لیے آ'],
    poetName: 'Ahmad Faraz',
    poetId: 'faraz',
    mood: 'Judai',
    subMood: 'Shikwa',
    hinglishMeaning: 'Chahe nafrat ya narazgi hi kyu na ho, bas ek baar laut aao; chahe mujhe fir se chhod kar chale jana magar ek baar deedar to kara do.',
    difficultWords: [
      { word: 'Ranjish', meaning: 'Khadwahat ya narazgi' }
    ],
    tags: ['judai', 'faraz', 'bewafai', 'intezar']
  },
  {
    id: 'judai-2',
    linesRoman: [
      'Suna hai log use aankh bhar ke dekhte hain,',
      'So uske shahar me kuch din thehar ke dekhte hain.'
    ],
    poetName: 'Ahmad Faraz',
    poetId: 'faraz',
    mood: 'Judai',
    subMood: 'Talaash',
    hinglishMeaning: 'Suna hai uske husn aur wafa ki tareefein aam hain; to chalo uske shehar me thodi der thehar kar uski haqeeqat dekhte hain.',
    difficultWords: [
      { word: 'Aankh bhar ke', meaning: 'Puri nazar se jee bhar ke' }
    ],
    tags: ['judai', 'faraz', 'shahar', 'tamanna']
  },
  {
    id: 'judai-3',
    linesRoman: [
      'Ab ke hum bichhde to shayad kabhi khwabon me milein,',
      'Jis tarah sookhe hue phool kitaabon me milein.'
    ],
    poetName: 'Ahmad Faraz',
    poetId: 'faraz',
    mood: 'Judai',
    subMood: 'Faasla',
    hinglishMeaning: 'Is baar ki judai aisi lagti hai ki aage hum sirf yaadon ya khwabon me hi mil sakenge, jaise kitabon me sookhe phool chhupe reh jaate hain.',
    difficultWords: [
      { word: 'Bichhde', meaning: 'Alag ho jana' }
    ],
    tags: ['judai', 'faraz', 'khwab', 'kitaab']
  },
  {
    id: 'judai-4',
    linesRoman: [
      'Tum jab aana to khizan ban ke na aana ae dost,',
      'Hum ne pehle hi baharon ka janaaza dekha hai.'
    ],
    poetName: 'Sahir Ludhianvi',
    poetId: 'sahir',
    mood: 'Judai',
    subMood: 'Khauf-e-Zawaal',
    hinglishMeaning: 'Agar lautna ho to nayi umeed bankar aana, dard aur judai bankar nahi; kyunki humne pehle hi khushiyon ko khatam hote dekha hai.',
    difficultWords: [
      { word: 'Khizan', meaning: 'Patjhad ya andhera mausam' },
      { word: 'Janaaza', meaning: 'Aakhri vidaai' }
    ],
    tags: ['judai', 'sahir', 'bewafai', 'bahar']
  },
  {
    id: 'judai-5',
    linesRoman: [
      'Wo shakhs jo mera kabhi hoke bhi na ho saka,',
      'Usi ke naam meri saari umr ki wafayein thin.'
    ],
    poetName: 'Faiz Ahmad Faiz',
    poetId: 'faiz',
    mood: 'Judai',
    subMood: 'Be-inteha Wafa',
    hinglishMeaning: 'Wo insaan jo mera hokar bhi kabhi mera na ban saka, meri kismat dekho ki maine apni saari wafa usi ke naam kar di.',
    difficultWords: [
      { word: 'Shakhs', meaning: 'Vyakti ya insaan' },
      { word: 'Wafayein', meaning: 'Nishtha aur sachha pyar' }
    ],
    tags: ['judai', 'faiz', 'wafa', 'bewafai']
  },

  // ==========================================
  // --- TANHAI & RAAT (Solitude & Midnight) ---
  // ==========================================
  {
    id: 'tanhai-1',
    linesRoman: [
      'Phir baithe baithe waada-e-farda pe hans pade,',
      'Hum log bhi ajeeb the tanhai dekh kar.'
    ],
    poetName: 'Jaun Elia',
    poetId: 'jaun',
    mood: 'Tanhai',
    subMood: 'Khud-Kalami',
    hinglishMeaning: 'Akele kamre me baithe-baithe aane wale kal ke jhoothe waadon par hansi aa gayi; tanhai me insaan khud se baatein karne lagta hai.',
    difficultWords: [
      { word: 'Waada-e-farda', meaning: 'Kal milne ka jhootha waada' },
      { word: 'Khud-kalami', meaning: 'Apne aap se baat karna' }
    ],
    tags: ['tanhai', 'jaun', 'raat', 'sukoon']
  },
  {
    id: 'tanhai-2',
    linesRoman: [
      'Raat aati hai to taaron se ulajh jaata hu,',
      'Din me aawaz-e-zamaana mujhe sonp deti hai gham.'
    ],
    poetName: 'Nasir Kazmi',
    poetId: 'nasir',
    mood: 'Tanhai',
    subMood: 'Shab-e-Gham',
    hinglishMeaning: 'Jab raat dhalti hai to akele aakash ke taaron ko takta rehta hu; din ka shor gham deta hai aur raat ki tanhai saari yaadein le aati hai.',
    difficultWords: [
      { word: 'Aawaz-e-zamaana', meaning: 'Duniya ka shor-sharaba' }
    ],
    tags: ['tanhai', 'nasir', 'taare', 'raat']
  },
  {
    id: 'tanhai-3',
    linesRoman: [
      'Chirag bujhne lage shaam dhal gayi kab ki,',
      'Ye kiski yaad hai jo dil me deep jalaaye baithi hai.'
    ],
    poetName: 'Parveen Shakir',
    poetId: 'parveen',
    mood: 'Tanhai',
    subMood: 'Yaad Ka Ujaala',
    hinglishMeaning: 'Duniya me andhera chha gaya aur chirag bujh gaye, magar dil ki gehrayiyon me ab bhi kisi ki yaadon ka meetha ujaala roshan hai.',
    difficultWords: [
      { word: 'Deep', meaning: 'Diyas ya roshni' }
    ],
    tags: ['tanhai', 'parveen', 'shaam', 'deep']
  },
  {
    id: 'tanhai-4',
    linesRoman: [
      'Maine har raat ko apna bana liya aakhir,',
      'Koi to tha jo tanhai me bhi sath chala.'
    ],
    poetName: 'Jaun Elia',
    poetId: 'jaun',
    mood: 'Tanhai',
    subMood: 'Yaarana-e-Tanhai',
    hinglishMeaning: 'Duniya sath chhod gayi to maine andheri raaton ko apna sathi bana liya; aakhir tanhai ne to kabhi daaga nahi diya.',
    difficultWords: [
      { word: 'Daaga', meaning: 'Dhoka ya vishwasghat' }
    ],
    tags: ['tanhai', 'jaun', 'wafa', 'sathi']
  },

  // ==========================================
  // --- JOSH, JUNOON & INQUILAB (Motivation & Fire) ---
  // ==========================================
  {
    id: 'josh-1',
    linesRoman: [
      'Khudi ko kar buland itna ki har taqdeer se pehle,',
      'Khuda bande se khud pooche bata teri raza kya hai.'
    ],
    originalScript: ['خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے', 'خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے'],
    poetName: 'Allama Iqbal',
    poetId: 'iqbal',
    mood: 'Josh',
    subMood: 'Inquilab',
    hinglishMeaning: 'Apne andar ke aatma-vishwas aur mehnat ko itni oonchai par le jao ki bhagwan khud tumse pooche ki bata teri marzi kya hai.',
    difficultWords: [
      { word: 'Khudi', meaning: 'Atma-samman aur inner strength' },
      { word: 'Raza', meaning: 'Ichha ya marzi' },
      { word: 'Buland', meaning: 'Ooncha aur shaktishali' }
    ],
    tags: ['josh', 'iqbal', 'motivation', 'junoon', 'taqdeer']
  },
  {
    id: 'josh-2',
    linesRoman: [
      'Tu shaheen hai parwaaz hai kaam tera,',
      'Tere samne aasmaan aur bhi hain.'
    ],
    originalScript: ['تو شاہیں ہے پرواز ہے کام تیرا', 'تیرے سامنے آسماں اور بھی ہیں'],
    poetName: 'Allama Iqbal',
    poetId: 'iqbal',
    mood: 'Josh',
    subMood: 'Parwaaz',
    hinglishMeaning: 'Tum baaz (eagle) ki tarah ho jiska maqsad sirf oonchi udaan bharna hai; kisi ek manzil pe mat ruko, aage aur aakash baaqi hain.',
    difficultWords: [
      { word: 'Shaheen', meaning: 'Baaz / Eagle (symbol of high ambition)' },
      { word: 'Parwaaz', meaning: 'Udaan' }
    ],
    tags: ['josh', 'iqbal', 'udaan', 'aasmaan', 'focus']
  },
  {
    id: 'josh-3',
    linesRoman: [
      'Sarfaroshi ki tamanna ab humare dil me hai,',
      'Dekhna hai zor kitna baazu-e-qaatil me hai.'
    ],
    poetName: 'Bismil Azimabadi',
    poetId: 'bismil',
    mood: 'Josh',
    subMood: 'Krantikari',
    hinglishMeaning: 'Apna sar katane aur desh ke liye ladne ka jazba ab humare dil me hai; dekhte hain zulm karne wale me kitna dum hai.',
    difficultWords: [
      { word: 'Sarfaroshi', meaning: 'Kurbani dene ki iccha' },
      { word: 'Baazu-e-qaatil', meaning: 'Dushman ki taaqat' }
    ],
    tags: ['josh', 'inquilab', 'azadi', 'bismil', 'junoon']
  },
  {
    id: 'josh-4',
    linesRoman: [
      'Manzil mile na mile ye to muqaddar ki baat hai,',
      'Hum koshish bhi na karein ye to galat baat hai.'
    ],
    poetName: 'Shakeel Badayuni',
    poetId: 'shakeel',
    mood: 'Josh',
    subMood: 'Koshish',
    hinglishMeaning: 'Kamiyabi milna ya na milna kismat ke haath me ho sakta hai, magar hum mehnat hi na karein aur haar maan lein, ye sabse badi galti hai.',
    difficultWords: [
      { word: 'Muqaddar', meaning: 'Kismat ya bhagya' }
    ],
    tags: ['josh', 'koshish', 'mehnat', 'student', 'focus']
  },
  {
    id: 'josh-5',
    linesRoman: [
      'Jo toofan me bhi kashtiyan nikaal lein,',
      'Zamana unhi ke naamon ka danka bajata hai.'
    ],
    poetName: 'Rahat Indori',
    poetId: 'rahat',
    mood: 'Josh',
    subMood: 'Himmat',
    hinglishMeaning: 'Aasaniyon me to sab chal lete hain, magar jo andhiyon aur toofan se ladkar paar lagayein, itihaas unka naam yaad rakhta hai.',
    difficultWords: [
      { word: 'Kashti', meaning: 'Naav / Boat' },
      { word: 'Danka', meaning: 'Shanka-naad ya dabdaba' }
    ],
    tags: ['josh', 'rahat', 'toofan', 'himmat']
  },

  // ==========================================
  // --- DOSTI & YAARI (Friendship & Loyalty) ---
  // ==========================================
  {
    id: 'dosti-1',
    linesRoman: [
      'Dosti aam hai lekin ae dost,',
      'Dost milta hai badi mushkil se.'
    ],
    poetName: 'Hafeez Jalandhari',
    poetId: 'hafeez',
    mood: 'Dosti',
    subMood: 'Wafa',
    hinglishMeaning: 'Dosti ka lafz bolne wale to bohat mil jate hain, magar sachha aur sath nibhane wala dost kismat se milta hai.',
    difficultWords: [
      { word: 'Aam', meaning: 'Sadharan ya aam taur par' }
    ],
    tags: ['dosti', 'yaari', 'wafa', 'sathi']
  },
  {
    id: 'dosti-2',
    linesRoman: [
      'Tere jaisa yaar kahan, kahan aisa yaarana,',
      'Yaad karegi dunya tera mera afsaana.'
    ],
    poetName: 'Majrooh Sultanpuri',
    poetId: 'majrooh',
    mood: 'Dosti',
    subMood: 'Yaarana',
    hinglishMeaning: 'Aisa saccha dost milna mushkil hai; zamana humari dosti aur sath ko misaal bana kar yaad rakhega.',
    difficultWords: [
      { word: 'Afsaana', meaning: 'Dastaan ya kahani' }
    ],
    tags: ['dosti', 'geet', 'majrooh', 'yaar']
  },
  {
    id: 'dosti-3',
    linesRoman: [
      'Meri har khushi me teri shareek-e-hayaat dua hai,',
      'Dost wo hai jo bina bole har dard samajh leta hai.'
    ],
    poetName: 'Nida Fazli',
    poetId: 'nida',
    mood: 'Dosti',
    subMood: 'Hamdard',
    hinglishMeaning: 'Asli dost lafzon ka mohtaaj nahi hota, wo khamoshi me bhi dost ki pareshani bhaap kar sahara ban jata hai.',
    difficultWords: [
      { word: 'Hamdard', meaning: 'Dard baantne wala' }
    ],
    tags: ['dosti', 'nida', 'sathi', 'dua']
  },
  {
    id: 'dosti-4',
    linesRoman: [
      'Dushmano ke teer to seene pe jhele hain magar,',
      'Dost ki ik be-rukhi ne rooh tak chhalni kari.'
    ],
    poetName: 'Bashir Badr',
    poetId: 'bashir',
    mood: 'Dosti',
    subMood: 'Ehsaas-e-Wafa',
    hinglishMeaning: 'Dushman ka waar jhelna aasan hota hai, magar jab apna jigri dost be-rukhi dikhaye to wo zakhm seena cheer deta hai.',
    difficultWords: [
      { word: 'Be-rukhi', meaning: 'Ignore karna ya be-parwahi' }
    ],
    tags: ['dosti', 'bashir', 'zakhm', 'wafa']
  },

  // ==========================================
  // --- KHUDDAARI & ATTITUDE (Self-Respect & Pride) ---
  // ==========================================
  {
    id: 'khuddaari-1',
    linesRoman: [
      'Agar khilaaf hain hone do jaan thodi hai,',
      'Ye sab dhuwan hai koi aasmaan thodi hai.'
    ],
    originalScript: ['اگر خلاف ہیں ہونے دو جان تھوڑی ہے', 'یہ سب دھواں ہے کوئی آسماں تھوڑی ہے'],
    poetName: 'Rahat Indori',
    poetId: 'rahat',
    mood: 'Khuddaari',
    subMood: 'Nidar',
    hinglishMeaning: 'Log agar khilaaf bolte hain to bolne do, ye koi maut thodi hai; dushmanon ki baatein sirf dhuwan hain jo hawa me udd jayengi.',
    difficultWords: [
      { word: 'Khilaaf', meaning: 'Virodh me / Against' },
      { word: 'Dhuwan', meaning: 'Smoke / Asar-heen' }
    ],
    tags: ['khuddaari', 'rahat', 'swag', 'attitude', 'sher']
  },
  {
    id: 'khuddaari-2',
    linesRoman: [
      'Lagegi aag to aayenge ghar kayi zad me,',
      'Yahan pe sirf humara makaan thodi hai.'
    ],
    poetName: 'Rahat Indori',
    poetId: 'rahat',
    mood: 'Khuddaari',
    subMood: 'Bebaaki',
    hinglishMeaning: 'Humein jhukane ki koshish karne wale yaad rakhein, jab aag lagegi to laptein sabko lapet me lengi.',
    difficultWords: [
      { word: 'Zad me', meaning: 'Chapet me / Under danger' }
    ],
    tags: ['khuddaari', 'rahat', 'inquilab', 'fire']
  },
  {
    id: 'khuddaari-3',
    linesRoman: [
      'Hum bhi dariya hain humein apna hunar maloom hai,',
      'Jis taraf bhi chal padenge raasta ho jaayega.'
    ],
    poetName: 'Bashir Badr',
    poetId: 'bashir',
    mood: 'Khuddaari',
    subMood: 'Aatmasamman',
    hinglishMeaning: 'Hum nadi ki tarah behna aur raste banana jaante hain; hum kisi ki mohtaaji ke baghair apna rasta khud tarash lete hain.',
    difficultWords: [
      { word: 'Hunar', meaning: 'Kala ya skill' },
      { word: 'Dariya', meaning: 'Nadi / River' }
    ],
    tags: ['khuddaari', 'bashir', 'confidence', 'swag']
  },
  {
    id: 'khuddaari-4',
    linesRoman: [
      'Usoolon pe jahan aanch aaye takraana zaroori hai,',
      'Jo zinda ho to phir zinda nazar aana zaroori hai.'
    ],
    poetName: 'Waseem Barelvi',
    poetId: 'waseem',
    mood: 'Khuddaari',
    subMood: 'Usool',
    hinglishMeaning: 'Jab aatmasamman aur siddhanton par baat aaye to piche nahi hatna chahiye; agar zinda ho to zameer ko marne mat do.',
    difficultWords: [
      { word: 'Usool', meaning: 'Siddhant / Principles' },
      { word: 'Aanch', meaning: 'Khatra ya garmi' }
    ],
    tags: ['khuddaari', 'waseem', 'zameer', 'usool']
  },

  // ==========================================
  // --- FALSAFA & ZINDAGI (Philosophy & Truth) ---
  // ==========================================
  {
    id: 'falsafa-1',
    linesRoman: [
      'Zindagi ik safar hai suhaana,',
      'Yahan kal kya ho kisne jaana.'
    ],
    poetName: 'Kishore Kumar / Hasrat Jaipuri',
    poetId: 'hasrat',
    mood: 'Falsafa',
    subMood: 'Waqt',
    hinglishMeaning: 'Zindagi ka safar khubsoorat hai agar har pal ko khul kar jiya jaye, kyunki aane wale kal ki khabar kisi ko nahi.',
    difficultWords: [
      { word: 'Suhaana', meaning: 'Manmohak aur pyara' }
    ],
    tags: ['falsafa', 'zindagi', 'safar', 'waqt']
  },
  {
    id: 'falsafa-2',
    linesRoman: [
      'Ghar se masjid hai bohat door chalo yun kar lein,',
      'Kisi rote hue bachhe ko hansaaya jaaye.'
    ],
    poetName: 'Nida Fazli',
    poetId: 'nida',
    mood: 'Falsafa',
    subMood: 'Insaniyat',
    hinglishMeaning: 'Mandir-masjid me jaakar sajda karne se bada dharam kisi dukhi insaan ya bache ke chehre par muskaan laana hai.',
    difficultWords: [
      { word: 'Insaniyat', meaning: 'Manavta' }
    ],
    tags: ['falsafa', 'nida', 'insaniyat', 'bachha', 'khushi']
  },
  {
    id: 'falsafa-3',
    linesRoman: [
      'Ye na thi hamari qismat ki visaal-e-yaar hota,',
      'Agar aur jeete rehte yahi intezaar hota.'
    ],
    poetName: 'Mirza Ghalib',
    poetId: 'ghalib',
    mood: 'Falsafa',
    subMood: 'Taqdeer',
    hinglishMeaning: 'Kismat me mehboob se milna likha hi nahi tha; agar hum sau saal bhi aur jee lete to bas yahi intezar barkarar rehta.',
    difficultWords: [
      { word: 'Visaal-e-yaar', meaning: 'Mehboob se milan' }
    ],
    tags: ['falsafa', 'ghalib', 'taqdeer', 'intezar']
  },
  {
    id: 'falsafa-4',
    linesRoman: [
      'Kuch to majbooriyan rahi hongi,',
      'Yun hi koi bewafa nahi hota.'
    ],
    poetName: 'Bashir Badr',
    poetId: 'bashir',
    mood: 'Falsafa',
    subMood: 'Samajhdaari',
    hinglishMeaning: 'Zindagi me har galti ya bichhadne ke piche koi na koi gehri majboori zaroor hoti hai; bina wajah koi rishta nahi todta.',
    difficultWords: [
      { word: 'Majboori', meaning: 'Laachaari ya pareshaani' }
    ],
    tags: ['falsafa', 'bashir', 'bewafa', 'zindagi']
  },

  // ==========================================
  // --- UMEED & HAUSLA (Hope & Resilience) ---
  // ==========================================
  {
    id: 'umeed-1',
    linesRoman: [
      'Sitaron ke aage jahan aur bhi hain,',
      'Abhi ishq ke imtihaan aur bhi hain.'
    ],
    originalScript: ['ستاروں کے آگے جہاں اور بھی ہیں', 'ابھی عشق کے امتحاں اور بھی ہیں'],
    poetName: 'Allama Iqbal',
    poetId: 'iqbal',
    mood: 'Umeed',
    subMood: 'Afq',
    hinglishMeaning: 'Taaron ke paar abhi aur nayi duniyaayein hain; abhi manzil khatam nahi hui, aage aur imtihaan jeetne hain.',
    difficultWords: [
      { word: 'Imtihaan', meaning: 'Pariksha ya test' },
      { word: 'Jahan', meaning: 'Duniya ya universe' }
    ],
    tags: ['umeed', 'iqbal', 'sitare', 'motivation']
  },
  {
    id: 'umeed-2',
    linesRoman: [
      'Girna nahi gawaara humein gardisho me bhi,',
      'Hum wo hain jo toofan me bhi deep jalate hain.'
    ],
    poetName: 'Rahat Indori',
    poetId: 'rahat',
    mood: 'Umeed',
    subMood: 'Hausla',
    hinglishMeaning: 'Bure waqt me bhi jhukna humein manzoor nahi; hum unme se hain jo tezz aandhi me bhi umeed ka diya jalaye rakhte hain.',
    difficultWords: [
      { word: 'Gardisho', meaning: 'Mushkil waqt / Pareshani' },
      { word: 'Gawaara', meaning: 'Manzoor / Acceptable' }
    ],
    tags: ['umeed', 'rahat', 'toofan', 'deep']
  },
  {
    id: 'umeed-3',
    linesRoman: [
      'Raat kitni bhi gehri aur kaali ho lekin,',
      'Subah ki pehli kiran use cheer hi deti hai.'
    ],
    poetName: 'Faiz Ahmad Faiz',
    poetId: 'faiz',
    mood: 'Umeed',
    subMood: 'Subah-e-Azadi',
    hinglishMeaning: 'Zulm ya dard ki raat kitni bhi lambi kyu na ho, sach aur umeed ka suraj zaroor nikalta hai.',
    difficultWords: [
      { word: 'Kiran', meaning: 'Roshni ki roop-rekha' }
    ],
    tags: ['umeed', 'faiz', 'subah', 'roshni']
  },

  // ==========================================
  // --- SUFIANA & ROOHANIYAT (Mystic & Spiritual) ---
  // ==========================================
  {
    id: 'sufi-1',
    linesRoman: [
      'Bulleya ki jaana main kaun,',
      'Na main momin vich maseetan, na main vich kufr diyan reetan.'
    ],
    originalScript: ['بلھیا کی جاناں میں کون', 'نہ میں مومن وچ مسیتاں'],
    poetName: 'Bulleh Shah',
    poetId: 'bulleh',
    mood: 'Sufiana',
    subMood: 'Roohani Talaash',
    hinglishMeaning: 'Bulleh Shah kehte hain mujhe nahi pata meri hasti kya hai; na mai masjid ka kattar momin hu, na mai kufr ka reeti-riwaj hu; mai to bas ishq-e-ilahi me fana hu.',
    difficultWords: [
      { word: 'Maseetan', meaning: 'Masjid me' },
      { word: 'Kufr', meaning: 'Adharm ya virodh' }
    ],
    tags: ['sufiana', 'bulleh', 'punjabi', 'rooh', 'ishq-e-haqeeqi']
  },
  {
    id: 'sufi-2',
    linesRoman: [
      'Chhap tilak sab chheeni re mose naina milai ke,',
      'Prem bhati ka madva pilaike matwali kar deeni re.'
    ],
    poetName: 'Amir Khusro',
    poetId: 'khusro',
    mood: 'Sufiana',
    subMood: 'Fana Fi Ishq',
    hinglishMeaning: 'Sirf aankhein milakar murshid (Khwaja) ne meri saari pehchan aur ghamand chheen liya, aur ishq ke rang me rang diya.',
    difficultWords: [
      { word: 'Chhap tilak', meaning: 'Bahri pehchan ya shringaar' },
      { word: 'Matwali', meaning: 'Deewani ya mast-malang' }
    ],
    tags: ['sufiana', 'khusro', 'naina', 'khwaja', 'ishq']
  },
  // --- INQILAAB & TEVAR ---
  {
    id: 'inqilaab-1',
    linesRoman: [
      'Ho gayi hai peer parvat si pighalni chahiye,',
      'Is Himalay se koi Ganga nikalni chahiye.'
    ],
    poetName: 'Dushyant Kumar',
    poetId: 'dushyant',
    mood: 'Inqilaab',
    subMood: 'Kranti',
    hinglishMeaning: 'Aam janta ka dukh ab pahaad ban chuka hai; ab is vyavastha se koi naya kranti ka prawah behna chahiye.',
    difficultWords: [
      { word: 'Peer', meaning: 'Dard ya peeda' },
      { word: 'Parvat', meaning: 'Pahaad' }
    ],
    tags: ['inqilaab', 'dushyant', 'ganga', 'kranti', 'peer']
  },
  {
    id: 'inqilaab-2',
    linesRoman: [
      'Sirf hungama khada karna mera maqsad nahi,',
      'Meri koshish hai ki ye surat badalni chahiye.'
    ],
    poetName: 'Dushyant Kumar',
    poetId: 'dushyant',
    mood: 'Inqilaab',
    subMood: 'Badlav',
    hinglishMeaning: 'Kavi ka uddeshya sirf shor machana nahi, balki aam logon ki dasha aur sthiti ko vastav me badalna hai.',
    difficultWords: [
      { word: 'Hungama', meaning: 'Shor ya upadrav' },
      { word: 'Surat', meaning: 'Dasha ya roop' }
    ],
    tags: ['inqilaab', 'dushyant', 'surat', 'badlav']
  },
  {
    id: 'inqilaab-3',
    linesRoman: [
      'Ek shehanshah ne daulat ka sahara le kar,',
      'Hum gareebon ki mohabbat ka udaya hai mazaak.'
    ],
    poetName: 'Sahir Ludhianvi',
    poetId: 'sahir',
    mood: 'Inqilaab',
    subMood: 'Samaji Haqeeqat',
    hinglishMeaning: 'Taj Mahal ke daulat-bhare pradarshan par Sahir ka teekha prahaar ki ameer ne apne pyar ko chatanon me qaid karke gareebon ke saste pyar ko chhota saabit kiya.',
    difficultWords: [
      { word: 'Shehanshah', meaning: 'Mughal samrat (Shah Jahan)' },
      { word: 'Mazaak', meaning: 'Upahaas' }
    ],
    tags: ['sahir', 'inqilaab', 'taj-mahal', 'mohabbat']
  },
  // --- ISHQ & NAZAAKAT ---
  {
    id: 'faraz-1',
    linesRoman: [
      'Ranjish hi sahi dil hi dukhane ke liye aa,',
      'Aa phir se mujhe chhod ke jaane ke liye aa.'
    ],
    poetName: 'Ahmad Faraz',
    poetId: 'faraz',
    mood: 'Ishq',
    subMood: 'Dard-e-Dil',
    hinglishMeaning: 'Chahe dil me narazgi ho ya giley-shikwe, bas ek baar laut aao; dobara chhod kar jaane ke liye hi sahi, tumhara aana hi zindagi hai.',
    difficultWords: [
      { word: 'Ranjish', meaning: 'Narazgi ya gila' },
      { word: 'Dukhane', meaning: 'Takleef pahunchana' }
    ],
    tags: ['faraz', 'ishq', 'ranjish', 'mehdi-hassan']
  },
  {
    id: 'faraz-2',
    linesRoman: [
      'Suna hai log use aankh bhar ke dekhte hain,',
      'So us ke shahar mein kuch din thehar ke dekhte hain.'
    ],
    poetName: 'Ahmad Faraz',
    poetId: 'faraz',
    mood: 'Ishq',
    subMood: 'Deedaar',
    hinglishMeaning: 'Mehboob ke azeem husn ke charche sun kar shayar uske shehar me thoda thehar kar khud us jashn-e-husn ka deedar karna chahta hai.',
    difficultWords: [
      { word: 'Aankh bhar ke', meaning: 'Be-panah shauq se dekhna' },
      { word: 'Thehar ke', meaning: 'Ruk kar' }
    ],
    tags: ['faraz', 'ishq', 'shahar', 'deedaar']
  },
  // --- FALSAFA & ZINDAGI ---
  {
    id: 'nida-1',
    linesRoman: [
      'Kabhi kisi ko mukammal jahan nahi milta,',
      'Kahin zameen to kahin aasmaan nahi milta.'
    ],
    poetName: 'Nida Fazli',
    poetId: 'nidafazli',
    mood: 'Falsafa',
    subMood: 'Haqeeqat-e-Hayat',
    hinglishMeaning: 'Har insaan ki zindagi me koi na koi kami reh jaati hai; kisi ko bhi har cheez poori nahi milti, yahi kudarat ka nizaam hai.',
    difficultWords: [
      { word: 'Mukammal', meaning: 'Poora ya complete' },
      { word: 'Jahan', meaning: 'Duniya' }
    ],
    tags: ['nida', 'falsafa', 'mukammal', 'zindagi']
  },
  {
    id: 'nida-2',
    linesRoman: [
      'Duniya jise kehte hain jaadugari ka khilona hai,',
      'Mil gaya to mitti hai kho gaya to sona hai.'
    ],
    poetName: 'Nida Fazli',
    poetId: 'nidafazli',
    mood: 'Falsafa',
    subMood: 'Khwahish',
    hinglishMeaning: 'Insaan ki aadat hai ki mili hui cheez ki qadar nahi karta aur jo haath se chhoot jaye use sabse anmol samajhta hai.',
    difficultWords: [
      { word: 'Jaadugari', meaning: 'Chhalawa ya illusion' },
      { word: 'Khilona', meaning: 'Toy' }
    ],
    tags: ['nida', 'falsafa', 'mitti', 'sona']
  },
  {
    id: 'bashir-1',
    linesRoman: [
      'Ujale apni yaadon ke hamare saath rehne do,',
      'Na jaane kis gali mein zindagi ki shaam ho jaye.'
    ],
    poetName: 'Dr. Bashir Badr',
    poetId: 'bashir',
    mood: 'Yaadein',
    subMood: 'Safarnaama',
    hinglishMeaning: 'Beete lamhon ki khushboo aur roshni ko sambhal kar rakhein, kyunki zindagi anjaan hai aur kab kahan safar khatam ho jaye kisi ko maloom nahi.',
    difficultWords: [
      { word: 'Ujale', meaning: 'Roshni ya charag' },
      { word: 'Shaam', meaning: 'Ant ya aakhri mod' }
    ],
    tags: ['bashir', 'yaadein', 'ujale', 'zindagi']
  },
  {
    id: 'bashir-2',
    linesRoman: [
      'Dushmani jam kar karo lekin ye gunjaish rahe,',
      'Jab kabhi hum dost ho jayein to sharminda na hon.'
    ],
    poetName: 'Dr. Bashir Badr',
    poetId: 'bashir',
    mood: 'Falsafa',
    subMood: 'Insaniyat',
    hinglishMeaning: 'Dushmani me bhi maryada ki hadd paar na karo, taaki agar kal dosti ka daur aaye to aankh jhukane ki sharam na bache.',
    difficultWords: [
      { word: 'Gunjaish', meaning: 'Gunjayesh ya sambhavna' },
      { word: 'Sharminda', meaning: 'Lajjit' }
    ],
    tags: ['bashir', 'falsafa', 'dushmani', 'sharafat']
  },
  {
    id: 'wasim-1',
    linesRoman: [
      'Apne chehre se jo zahir hai chhupayein kaise,',
      'Teri marzi ke mutabiq nazar aayein kaise.'
    ],
    poetName: 'Wasim Barelvi',
    poetId: 'wasim',
    mood: 'Khuddaari',
    subMood: 'Aatmasamman',
    hinglishMeaning: 'Jo sachai humare andar aur chehre par safai se darj hai use kaise chhipayein; hum kisi aur ki khushi ke liye apna vastavik astitva kaise badal lein.',
    difficultWords: [
      { word: 'Zahir', meaning: 'Jo saaf dikhta ho' },
      { word: 'Mutabiq', meaning: 'Anusaar / According to' }
    ],
    tags: ['wasim', 'khuddari', 'chehra', 'aatmasamman']
  },
  {
    id: 'wasim-2',
    linesRoman: [
      'Aandhiyon ke khilaf chalna hai,',
      'Ye diya hai isko jalna hai.'
    ],
    poetName: 'Wasim Barelvi',
    poetId: 'wasim',
    mood: 'Khuddaari',
    subMood: 'Hausla',
    hinglishMeaning: 'Mushkilon ki aandhiyan chahe kitni bhi tez hon, sach aur aatmasamman ke is diye ko har haal me roshan rehna hai.',
    difficultWords: [
      { word: 'Aandhiyon', meaning: 'Toofanon ke khilaf' },
      { word: 'Diya', meaning: 'Deepak ya aatmasamman' }
    ],
    tags: ['wasim', 'hausla', 'aandhi', 'diya']
  },
  // --- PUNJABI CLASSICS ---
  {
    id: 'amrita-1',
    linesRoman: [
      'Ajj aakhaan Waris Shah nu kithon qabraan vichon bol,',
      'Te ajj kitaab-e-ishq da koi agla varka phol.'
    ],
    poetName: 'Amrita Pritam',
    poetId: 'amrita',
    mood: 'Dard',
    subMood: 'Dard-e-Punjab',
    hinglishMeaning: 'Batware ke lahu aur auraton ke dard ko dekh kar Amrita ji ne Waris Shah ko pukara ki apni mazaar se bol uth aur prem ka naya panna khol.',
    difficultWords: [
      { word: 'Qabraan', meaning: 'Mazaaron vichon' },
      { word: 'Varka', meaning: 'Panna / Page' }
    ],
    tags: ['amrita', 'punjabi', 'waris-shah', 'batwara']
  },
  {
    id: 'shiv-1',
    linesRoman: [
      'Maye ni maye mere geetan de naina vich,',
      'Birhon di radak pave.'
    ],
    poetName: 'Shiv Kumar Batalvi',
    poetId: 'shiv',
    mood: 'Dard',
    subMood: 'Birha',
    hinglishMeaning: 'O meri maa, mere geeton ki aankhon me birha aur judai ki aisi chubhan hai jaise ret ka dard dil ko cheerta ho.',
    difficultWords: [
      { word: 'Birhon', meaning: 'Judai / Separation' },
      { word: 'Radak', meaning: 'Chubhan ya kanta' }
    ],
    tags: ['shiv', 'punjabi', 'birha', 'maa']
  }
];

