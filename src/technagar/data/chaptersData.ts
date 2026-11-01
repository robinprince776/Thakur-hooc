import { Chapter, SeasonInfo } from '../types';

export const SEASONS_DATA: SeasonInfo[] = [
  {
    id: 1,
    title: 'Season 1: Computer Ki Duniya',
    tagline: 'Hardware, CPU, 0 & 1, Booting aur Algorithm',
    chapterCount: 5,
    color: 'from-blue-600 to-cyan-500',
    icon: 'Cpu'
  },
  {
    id: 2,
    title: 'Season 2: Internet Ka Jaal',
    tagline: 'IP Address, Router, DNS, Ports aur HTTPS',
    chapterCount: 3,
    color: 'from-cyan-600 to-teal-500',
    icon: 'Globe'
  },
  {
    id: 3,
    title: 'Season 3: Security Ki Police Station',
    tagline: 'Virus, Malware, Firewall, Encryption aur 2FA',
    chapterCount: 3,
    color: 'from-emerald-600 to-lime-500',
    icon: 'ShieldCheck'
  },
  {
    id: 4,
    title: 'Season 4: Coding Ki School',
    tagline: 'Variables, Loops, Functions, Frontend aur Docker',
    chapterCount: 2,
    color: 'from-amber-600 to-orange-500',
    icon: 'Code2'
  },
  {
    id: 5,
    title: 'Season 5: Database Ka Godown',
    tagline: 'SQL, NoSQL, Primary Keys aur Cloud Backups',
    chapterCount: 1,
    color: 'from-purple-600 to-indigo-500',
    icon: 'Database'
  },
  {
    id: 6,
    title: 'Season 6: Physics Ka Jadugar',
    tagline: 'Voltage, Current, Transistors aur Silicon Magic',
    chapterCount: 1,
    color: 'from-yellow-500 to-amber-600',
    icon: 'Zap'
  },
  {
    id: 7,
    title: 'Season 7: AI Ka Dimaag',
    tagline: 'Machine Learning, Neural Networks aur LLM',
    chapterCount: 1,
    color: 'from-rose-600 to-pink-500',
    icon: 'Brain'
  },
  {
    id: 8,
    title: 'Season 8: Future Ki Duniya & Grand Finale',
    tagline: 'IoT, Blockchain, Robotics aur TechNagar Rescue',
    chapterCount: 2,
    color: 'from-fuchsia-600 to-purple-600',
    icon: 'Rocket'
  }
];

export const CHAPTERS_DATA: Chapter[] = [
  // --- SEASON 1: Computer Ki Duniya ---
  {
    id: 1,
    seasonId: 1,
    seasonTitle: 'Season 1: Computer Ki Duniya',
    chapterNumber: 1,
    title: 'Ajeeb Machine',
    tagline: 'Kya computer sach me khud se sochta hai?',
    icon: 'Laptop',
    conceptTags: ['Hardware Basics', 'Instructions', 'Automation'],
    dialogues: [
      {
        id: '1-1',
        char: 'Aarav',
        text: 'Dadaji ye table par kya rakha hai? Screen pe cartoon chal raha hai... kya ye machine khud soch sakti hai?',
        mood: 'curious'
      },
      {
        id: '1-2',
        char: 'Byte',
        text: 'Arey Aarav! Namaste! Main hoon Byte, tumhare computer ka nanha robot dost. Aur tumhara sawal bahut mast hai!',
        mood: 'happy'
      },
      {
        id: '1-3',
        char: 'Aarav',
        text: 'Arre baap re! Tum to baat bhi karte ho! Matlab tum sach me insano ki tarah sochte ho?',
        mood: 'shocked'
      },
      {
        id: '1-4',
        char: 'Byte',
        text: 'Haan bhai, main sochta hoon... par sirf tab jab mujhe order do. Main khud se ek panna bhi nahi palat sakta!',
        mood: 'explaining'
      },
      {
        id: '1-5',
        char: 'Aarav',
        text: 'Order? Kaisa order? Jaise Mummy mujhe bolti hai dudh piyo?',
        mood: 'curious'
      },
      {
        id: '1-6',
        char: 'Byte',
        text: 'Bilkul waisa hi! Computer koi jaadugar nahi hai. Tum mouse hilate ho ya key dabate ho, tab main unhe follow karta hoon. Bas itna farq hai ki main 1 second me 300 crore orders follow kar leta hoon!',
        mood: 'heroic'
      }
    ],
    lesson: 'Computer smart nahi hota. Wo instructions follow karta hai. Bas bahut tez follow karta hai.',
    realWorldAnalogy: 'Jaise remote control car: chalti bahut tez hai, par handle tumhare haath me hota hai.'
  },
  {
    id: 2,
    seasonId: 1,
    seasonTitle: 'Season 1: Computer Ki Duniya',
    chapterNumber: 2,
    title: 'Byte Ke Ghar Ka Tour',
    tagline: 'Computer ke cabinet ke andar rehta kaun hai?',
    icon: 'Cpu',
    conceptTags: ['CPU', 'RAM', 'Storage', 'GPU', 'Motherboard'],
    dialogues: [
      {
        id: '2-1',
        char: 'Aarav',
        text: 'Byte, tumhare is kaale dabbe (cabinet) ke andar kaun-kaun rehta hai? Tumhara koi parivaar hai kya?',
        mood: 'curious'
      },
      {
        id: '2-2',
        char: 'Byte',
        text: 'Aao tumhe apne shehar TechNagar ki sair karata hoon! Yahan sabka apna ek pakka kaam hai:',
        mood: 'explaining'
      },
      {
        id: '2-3',
        char: 'Byte',
        text: 'CPU — Ye humara Manager hai, jo saare faisle leta hai. RAM — Ye study table hai jahan abhi khuli hui kitaabein (apps) rakhi hain.',
        mood: 'explaining'
      },
      {
        id: '2-4',
        char: 'Aarav',
        text: 'Aur wo baki cheezein jo maine pichhle saal save ki thi?',
        mood: 'curious'
      },
      {
        id: '2-5',
        char: 'Byte',
        text: 'Wo SSD/Hard Disk me hai — yaani tumhari badi almari! GPU — humara Drawing Artist hai jo 3D games aur video banata hai.',
        mood: 'happy'
      },
      {
        id: '2-6',
        char: 'Byte',
        text: 'Aur Motherboard — wo poore shehar ki pakki sadak hai jisse ye sab ek doosre se judte hain!',
        mood: 'heroic'
      }
    ],
    lesson: 'Computer = ek chhota shehar. Har part ka apna kaam.',
    realWorldAnalogy: 'Manager (CPU) + Study Table (RAM) + Almari (Storage) + Artist (GPU) + Sadakein (Motherboard).'
  },
  {
    id: 3,
    seasonId: 1,
    seasonTitle: 'Season 1: Computer Ki Duniya',
    chapterNumber: 3,
    title: 'Bite Ki Batein',
    tagline: '0 aur 1 ka jaadu: Text, Photos aur Videos kaise bante hain?',
    icon: 'Binary',
    conceptTags: ['Binary', 'Bits', 'Bytes', 'ASCII', 'Unicode'],
    dialogues: [
      {
        id: '3-1',
        char: 'Aarav',
        text: 'Byte! Meri ma’am ne school me bataya ki computer sirf 0 aur 1 samajhta hai. Bas 0 aur 1 se poora computer chalta hai?',
        mood: 'shocked'
      },
      {
        id: '3-2',
        char: 'Byte',
        text: 'Haan dost! Ek dum sach. Ek switch socho: Off hai to 0, On hai to 1. Is akele switch ko "Bit" kehte hain.',
        mood: 'explaining'
      },
      {
        id: '3-3',
        char: 'Aarav',
        text: 'Par mere WhatsApp pe to main "A" likhta hoon, "Hello" likhta hoon, photo bhejta hoon!',
        mood: 'curious'
      },
      {
        id: '3-4',
        char: 'Byte',
        text: 'Yahi to maza hai! Jab 8 switches milte hain, to banta hai "1 Byte". Humne rule banaya: letter A = 65 (01000001). Letter B = 66.',
        mood: 'explaining'
      },
      {
        id: '3-5',
        char: 'Byte',
        text: 'Har photo, gaana, WhatsApp emoji sab 0 aur 1 ka khel hai. ASCII aur Unicode se akshar numbers me badal jaate hain!',
        mood: 'happy'
      }
    ],
    lesson: 'Computer sirf 0 aur 1 samajhta hai. Baaki sab uska tarjuma (translation) hai.',
    realWorldAnalogy: 'Jaise Morse code me sirf dot (.) aur dash (-) se poori kahani bhedi ja sakti hai.'
  },
  {
    id: 4,
    seasonId: 1,
    seasonTitle: 'Season 1: Computer Ki Duniya',
    chapterNumber: 4,
    title: 'Jagaane Wala Button',
    tagline: 'Power button dabate hi parde ke peeche kya hota hai?',
    icon: 'Power',
    conceptTags: ['Booting', 'BIOS/UEFI', 'Operating System', 'Kernel'],
    dialogues: [
      {
        id: '4-1',
        char: 'Aarav',
        text: 'Byte, jab main computer ka button dabata hoon, to 10-15 second ghoomne wala chakra kyun aata hai? Wo aalas karta hai kya?',
        mood: 'curious'
      },
      {
        id: '4-2',
        char: 'Byte',
        text: 'Hahaha! Wo aalas nahi, subah ki exercise kar raha hota hai! Isko "Booting" kehte hain.',
        mood: 'happy'
      },
      {
        id: '4-3',
        char: 'Byte',
        text: 'Sabse pehle BIOS uthta hai. Wo dekhta hai: Keyboard theek hai? RAM lagi hai? Screen judi hai? Sab theek to bolta hai ALL CLEAR!',
        mood: 'explaining'
      },
      {
        id: '4-4',
        char: 'Aarav',
        text: 'Achha! Phir Windows ya Mac kab aate hain?',
        mood: 'curious'
      },
      {
        id: '4-5',
        char: 'Byte',
        text: 'BIOS bolta hai: "Chalo Operating System saab (Windows/Linux/Mac), aao gaadi chalao!" Phir OS aakar poora shehar sambhalta hai.',
        mood: 'heroic'
      }
    ],
    lesson: 'Computer ko jagaane wala (BIOS) aur chalane wala (OS) alag hota hai.',
    realWorldAnalogy: 'Jaise gaadi me self-starter engine ko jagata hai, par steering driver ke haath me hoti hai.'
  },
  {
    id: 5,
    seasonId: 1,
    seasonTitle: 'Season 1: Computer Ki Duniya',
    chapterNumber: 5,
    title: 'Machine Ki Language Seekhna',
    tagline: 'Algorithm kya hai? Computer ko baat kaise samjhayein?',
    icon: 'FileCode',
    conceptTags: ['Algorithm', 'Programming', 'Step-by-Step Logic'],
    dialogues: [
      {
        id: '5-1',
        char: 'Aarav',
        text: 'Byte, agar main computer se bolun: "Mujhe ek glass paani la do", to wo la dega kya?',
        mood: 'curious'
      },
      {
        id: '5-2',
        char: 'Byte',
        text: 'Wo bolega: "Glass kahan hai? Kitna paani? Thanda ya garam? Paani lene ke liye pair kahan se laun?" Computer ko seedhi baatein samajh nahi aati!',
        mood: 'explaining'
      },
      {
        id: '5-3',
        char: 'Aarav',
        text: 'Arre baap re! Matlab use har chhoti cheez samjhani padegi?',
        mood: 'shocked'
      },
      {
        id: '5-4',
        char: 'Byte',
        text: 'Haan! Step 1: Kitchen jao. Step 2: Glass uthao. Step 3: Nalka kholo. Step 4: Glass bharo. Is step-by-step recipe ko Programming me "Algorithm" kehte hain.',
        mood: 'heroic'
      }
    ],
    lesson: 'Computer ko recipe (Algorithm) chahiye. Bina recipe, wo kuch nahi karta.',
    realWorldAnalogy: 'Jaise Maggi banane ki recipe: bina step follow kiye Maggi nahi ban sakti.'
  },

  // --- SEASON 2: Internet Ka Jaal ---
  {
    id: 6,
    seasonId: 2,
    seasonTitle: 'Season 2: Internet Ka Jaal',
    chapterNumber: 6,
    title: 'Duniya Ka Bada Shehar',
    tagline: 'Mera message America kaise pahuncha? IP aur DNS ka raaz.',
    icon: 'Globe',
    conceptTags: ['IP Address', 'Router', 'DNS', 'Packets'],
    dialogues: [
      {
        id: '6-1',
        char: 'Aarav',
        text: 'Byte, maine WhatsApp par "Hi" likha aur America me baithe Chachu ko 1 second me mil gaya! Ye rasta kaun dikhata hai?',
        mood: 'shocked'
      },
      {
        id: '6-2',
        char: 'Byte',
        text: 'Sun Aarav, internet ek vishal sadak ka jaal hai. Har computer ka apna ek address hota hai, jise IP Address kehte hain — jaise tumhare ghar ka number!',
        mood: 'explaining'
      },
      {
        id: '6-3',
        char: 'Byte',
        text: 'Tumhare ghar ka Router = Daakiya (Postman). Wo chithi ko sahi sadak par daalta hai.',
        mood: 'happy'
      },
      {
        id: '6-4',
        char: 'Aarav',
        text: 'Aur google.com kya hai? Wo to koi number nahi lagta!',
        mood: 'curious'
      },
      {
        id: '6-5',
        char: 'Byte',
        text: 'DNS ek phonebook hai! Tum google.com yaad rakhte ho, DNS use number (142.250.190.46) me badalta hai taaki computer wahan pahunch sake!',
        mood: 'heroic'
      }
    ],
    lesson: 'Internet = galiyon ka jaal. IP = pata. DNS = phonebook.',
    realWorldAnalogy: 'Jaise mobile contacts: tum "Mummy" par click karte ho, par phone unka 10 digit number dial karta hai.'
  },
  {
    id: 7,
    seasonId: 2,
    seasonTitle: 'Season 2: Internet Ka Jaal',
    chapterNumber: 7,
    title: 'Darwaze Aur Chowkidaar',
    tagline: 'Ports kya hain aur Firewall kisse rokti hai?',
    icon: 'DoorClosed',
    conceptTags: ['Ports', 'Firewall', 'Security Guard', 'Port 80/443'],
    dialogues: [
      {
        id: '7-1',
        char: 'Aarav',
        text: 'Byte, agar computer me sab kuch internet se juda hai, to koi bhi mere computer me ghus sakta hai kya?',
        mood: 'shocked'
      },
      {
        id: '7-2',
        char: 'Byte',
        text: 'Ghus to sakta hai... agar darwaza khula ho! Computer me darwazon ko "Ports" kehte hain. Kul 65,535 darwaze hote hain!',
        mood: 'explaining'
      },
      {
        id: '7-3',
        char: 'Byte',
        text: 'Port 80 aur 443 se websites aati hain, Port 22 se secret command aati hai. Aur bahar khada hota hai ek tagda guard — FIREWALL!',
        mood: 'heroic'
      },
      {
        id: '7-4',
        char: 'Aarav',
        text: 'Firewall kya karta hai? Aag lagata hai kya?',
        mood: 'curious'
      },
      {
        id: '7-5',
        char: 'Byte',
        text: 'Nahi! Wo aane wale har packet ki ID check karta hai: "Tum kaun ho? Valid ticket hai kya?" Gair-kanooni cheezon ko wahi danda maar ke bhaga deta hai!',
        mood: 'happy'
      }
    ],
    lesson: 'Har cheez ke darwaze (Ports) hote hain. Firewall = chowkidaar.',
    realWorldAnalogy: 'Society ka main gate: guard aane wale har delivery boy ki entry check karta hai.'
  },
  {
    id: 8,
    seasonId: 2,
    seasonTitle: 'Season 2: Internet Ka Jaal',
    chapterNumber: 8,
    title: 'Chithi, Sandook Aur Chhupa Naam',
    tagline: 'HTTP vs HTTPS aur VPN ki gupt surang.',
    icon: 'Lock',
    conceptTags: ['HTTP', 'HTTPS', 'TLS/SSL', 'VPN'],
    dialogues: [
      {
        id: '8-1',
        char: 'Aarav',
        text: 'Byte, jab mera message taar me daud raha hota hai, to beech me koi chor use padh nahi sakta?',
        mood: 'curious'
      },
      {
        id: '8-2',
        char: 'Byte',
        text: 'Agar website sirf HTTP ho, to wo ek khuli chithi (postcard) jaisi hai! Raste ka koi bhi aadmi use padh sakta hai.',
        mood: 'shocked'
      },
      {
        id: '8-3',
        char: 'Aarav',
        text: 'Arre nahi! Phir mera password to chori ho jayega!',
        mood: 'shocked'
      },
      {
        id: '8-4',
        char: 'Byte',
        text: 'Isliye hum use karte hain HTTPS! (S ka matlab Secure). Wo chithi ko ek mazboot sandook me band karke taala (TLS) laga deta hai. Chabi sirf receiver ke paas hoti hai!',
        mood: 'heroic'
      },
      {
        id: '8-5',
        char: 'Byte',
        text: 'Aur VPN? VPN to poori sadak ke neeche ek "Gupt Surang" bana deta hai taaki kisi ko pata na chale tum kahan ja rahe ho!',
        mood: 'explaining'
      }
    ],
    lesson: 'Internet pe khuli chithi mat bhejo. HTTPS = taala. VPN = surang.',
    realWorldAnalogy: 'Khula postcard (HTTP) vs Coded Sealed Envelope (HTTPS) vs Gupt Tunnel (VPN).'
  },

  // --- SEASON 3: Security Ki Police Station ---
  {
    id: 9,
    seasonId: 3,
    seasonTitle: 'Season 3: Security Ki Police Station',
    chapterNumber: 9,
    title: 'Raat Ko Hamla',
    tagline: 'Virus, Phishing, Worm, Trojan aur Ransomware ka sach.',
    icon: 'ShieldAlert',
    conceptTags: ['Phishing', 'Virus', 'Worm', 'Trojan', 'Ransomware'],
    dialogues: [
      {
        id: '9-1',
        char: 'Aarav',
        text: 'Byte! Kal raat ko mujhe message aaya: "Aapne 1 Crore jeeta hai, link pe click karo!" Maine click karne ki sochi...',
        mood: 'curious'
      },
      {
        id: '9-2',
        char: 'Byte',
        text: 'Khabardar Aarav! Wo Phishing tha — yaani nakli postman jo tumhe lalach de kar tumhara password churaana chahta tha!',
        mood: 'shocked'
      },
      {
        id: '9-3',
        char: 'Byte',
        text: 'Cyber crime ki duniya me kai shaitan hain: Virus = file me lagi bimari jo doosri file ko bimaar karti hai.',
        mood: 'explaining'
      },
      {
        id: '9-4',
        char: 'Byte',
        text: 'Worm = bina permission khud taaron me failta hai. Trojan = pyara sa tohfa jisme chhupa hua jahar hota hai!',
        mood: 'explaining'
      },
      {
        id: '9-5',
        char: 'Byte',
        text: 'Aur Ransomware sabse ganda chor hai — tumhari saari photos lock karke paise maangta hai!',
        mood: 'shocked'
      }
    ],
    lesson: 'Har hacker alag hota hai. Har attack ka naam hai. Anjaan link pe kabhi click mat karo.',
    realWorldAnalogy: 'Anjaan aadmi se toffee mat lo: candy ke bhes me khatra ho sakta hai.'
  },
  {
    id: 10,
    seasonId: 3,
    seasonTitle: 'Season 3: Security Ki Police Station',
    chapterNumber: 10,
    title: 'Police Ki Training',
    tagline: 'Hacker ko pakadne wale tools: IDS, IPS, WAF aur Honeypot.',
    icon: 'Shield',
    conceptTags: ['IDS', 'IPS', 'WAF', 'Honeypot', 'White Hat'],
    dialogues: [
      {
        id: '10-1',
        char: 'Aarav',
        text: 'Byte, agar itne saare shaitan hain, to humari computer police unhe kaise pakadti hai?',
        mood: 'curious'
      },
      {
        id: '10-2',
        char: 'Byte',
        text: 'Humare paas hai Cyber Command Force! IDS (Intrusion Detection) = CCTV camera jo chor ko dekhta hai.',
        mood: 'explaining'
      },
      {
        id: '10-3',
        char: 'Byte',
        text: 'IPS (Intrusion Prevention) = Commando jo dekhte hi darwaza band kar deta hai. WAF = Website ka personal bodyguard!',
        mood: 'heroic'
      },
      {
        id: '10-4',
        char: 'Aarav',
        text: 'Aur wo "Honeypot" kya hota hai? Meetha shehad?',
        mood: 'curious'
      },
      {
        id: '10-5',
        char: 'Byte',
        text: 'Bilkul! Wo ek nakli gaon (fake server) hai jahan meetha lalach hota hai. Chor wahan ghusta hai aur police use gher leti hai! Is police ko White Hat Hacker kehte hain.',
        mood: 'happy'
      }
    ],
    lesson: 'Security = dekhna (IDS) + rokna (IPS) + phansana (Honeypot). Sirf taala lagana kaafi nahi.',
    realWorldAnalogy: 'CCTV Camera (IDS) + Automatic Barrier (IPS) + Fake Trap House (Honeypot).'
  },
  {
    id: 11,
    seasonId: 3,
    seasonTitle: 'Season 3: Security Ki Police Station',
    chapterNumber: 11,
    title: 'Taale Aur Chabiyan',
    tagline: 'Symmetric, Asymmetric, Hash aur 2FA ki takat.',
    icon: 'Key',
    conceptTags: ['Symmetric', 'Asymmetric', 'Hashing', '2FA'],
    dialogues: [
      {
        id: '11-1',
        char: 'Aarav',
        text: 'Byte, Papa ke phone pe jab wo bank kholte hain, to password ke baad ek OTP bhi aata hai. Wo do baar kyu maangta hai?',
        mood: 'curious'
      },
      {
        id: '11-2',
        char: 'Byte',
        text: 'Isko 2FA (Two-Factor Authentication) bolte hain — yaani ghar ke main door pe do alag-alag taale!',
        mood: 'explaining'
      },
      {
        id: '11-3',
        char: 'Byte',
        text: 'Ek taala tumhare dimaag ka (Password), aur doosra taala tumhare haath ka phone (OTP). Chor password chura bhi le, phone kaise layega?',
        mood: 'heroic'
      },
      {
        id: '11-4',
        char: 'Byte',
        text: 'Aur Encryption me: Symmetric = ek chabi se band aur khulna. Asymmetric = do chabi (Public jo sab dekhein, Private jo sirf tumhare paas ho).',
        mood: 'explaining'
      },
      {
        id: '11-5',
        char: 'Byte',
        text: 'Aur Hash kya hai? Digital Fingerprint! Ek akshar bhi badla to fingerprint poora badal jayega!',
        mood: 'happy'
      }
    ],
    lesson: 'Encryption = sandook + chabi. 2FA = do taale. Hash = fingerprint.',
    realWorldAnalogy: 'Tijori ka password + Phone par aane wala OTP = Chor kabhi nahi khol payega.'
  },

  // --- SEASON 4: Coding Ki School ---
  {
    id: 12,
    seasonId: 4,
    seasonTitle: 'Season 4: Coding Ki School',
    chapterNumber: 12,
    title: 'Coding Ka Pehla Din',
    tagline: 'Variables, Loops, Functions aur Bugs ki kahani.',
    icon: 'Code2',
    conceptTags: ['Variable', 'Loop', 'Function', 'If-Else', 'Bug'],
    dialogues: [
      {
        id: '12-1',
        char: 'Aarav',
        text: 'Byte, mujhe bhi programmer banna hai! Par coding me itne ajeeb shabd kyun hote hain?',
        mood: 'curious'
      },
      {
        id: '12-2',
        char: 'Byte',
        text: 'Arey bohot aasan hai Aarav! 5 cheezein samajh lo, tum aadhi coding seekh gaye:',
        mood: 'happy'
      },
      {
        id: '12-3',
        char: 'Byte',
        text: '1. Variable = Ek dabba jisme samaan rakhte ho (jaise score = 10).\n2. If-Else = Raasta chunna (agar baarish ho to chhata lo, warna mat lo).',
        mood: 'explaining'
      },
      {
        id: '12-4',
        char: 'Byte',
        text: '3. Loop = Ek hi kaam baar-baar karna (100 baar uthak-baithak).\n4. Function = Ek pakki recipe (jaise chai banane ka method).',
        mood: 'explaining'
      },
      {
        id: '12-5',
        char: 'Byte',
        text: 'Aur jab recipe me thoda namak zyada ho jaye, to use "Bug" (keeda/galti) kehte hain, jise theek karna Debugging kehlata hai!',
        mood: 'heroic'
      }
    ],
    lesson: 'Coding = machine se baat. Saaf instructions do. Variable = dabba, Loop = baar-baar, Bug = galti.',
    realWorldAnalogy: 'Kitchen ke masale ke dabbe (Variables) + Roti sekne ka cycle (Loop).'
  },
  {
    id: 13,
    seasonId: 4,
    seasonTitle: 'Season 4: Coding Ki School',
    chapterNumber: 13,
    title: 'Badi Company Ka Andar',
    tagline: 'Frontend, Backend, Database aur Docker kaise milkar chalte hain?',
    icon: 'Boxes',
    conceptTags: ['Frontend', 'Backend', 'Database', 'Agile', 'Docker'],
    dialogues: [
      {
        id: '13-1',
        char: 'Aarav',
        text: 'Byte, Swiggy ya Zomato pe jab main pizza order karta hoon, to parde ke peeche kitne log kaam karte hain?',
        mood: 'curious'
      },
      {
        id: '13-2',
        char: 'Byte',
        text: 'Ek poori fauj! Frontend = Dukaan ka sundar counter (jo buttons aur photos tum phone pe dekhte ho).',
        mood: 'explaining'
      },
      {
        id: '13-3',
        char: 'Byte',
        text: 'Backend = Pichla Godown jahan order calculate hota hai aur payment verify hoti hai. Database = Almari jahan menu aur price likhi hai.',
        mood: 'explaining'
      },
      {
        id: '13-4',
        char: 'Byte',
        text: 'Aur Docker kya hai? Ek safe tiffin box jisme poori app pack ho jaati hai, taaki kisi bhi computer me bina nakhre ke chal sake!',
        mood: 'heroic'
      }
    ],
    lesson: 'Badi company = kai log + kai dabbe + ek system. Frontend = counter, Backend = godown, Docker = pack dabba.',
    realWorldAnalogy: 'Restaurant ka front table (Frontend) + Chef ka kitchen (Backend) + Ration store (Database).'
  },

  // --- SEASON 5: Database Ka Godown ---
  {
    id: 14,
    seasonId: 5,
    seasonTitle: 'Season 5: Database Ka Godown',
    chapterNumber: 14,
    title: 'Photo Kahan Jaati Hai?',
    tagline: 'SQL, NoSQL, Tables aur Primary Key ka raaz.',
    icon: 'Database',
    conceptTags: ['SQL', 'NoSQL', 'Primary Key', 'Backup'],
    dialogues: [
      {
        id: '14-1',
        char: 'Aarav',
        text: 'Byte, maine 2 saal pehle birthday ki photo upload ki thi, wo aaj bhi ek click me kaise mil jaati hai?',
        mood: 'curious'
      },
      {
        id: '14-2',
        char: 'Byte',
        text: 'Kyunki wo Database ke pakke register me darj hai! SQL = School ka attendance register (jisme Roll No, Naam, Marks ki pakki table hoti hai).',
        mood: 'explaining'
      },
      {
        id: '14-3',
        char: 'Byte',
        text: 'NoSQL = Ek flexible jhola jisme alag-alag size ka samaan bina table ke daal sakte ho.',
        mood: 'explaining'
      },
      {
        id: '14-4',
        char: 'Byte',
        text: 'Primary Key = Tumhara Aadhaar Card ya Roll No. Ek number se pata chal jata hai ki ye photo sirf Aarav ki hi hai!',
        mood: 'heroic'
      },
      {
        id: '14-5',
        char: 'Byte',
        text: 'Aur agar computer kharab ho jaye? Isliye hum Backup rakhte hain — doosre kamre (Cloud) me doosri copy!',
        mood: 'happy'
      }
    ],
    lesson: 'Database = almari. Har cheez ka label (Primary Key) hota hai. Hamesha Backup rakho.',
    realWorldAnalogy: 'Library ka catalogue card: book number se 10 second me kitaab mil jaati hai.'
  },

  // --- SEASON 6: Physics Ka Jadugar ---
  {
    id: 15,
    seasonId: 6,
    seasonTitle: 'Season 6: Physics Ka Jadugar',
    chapterNumber: 15,
    title: 'Bijli Kya Hai?',
    tagline: 'Voltage, Current aur Transistor: Paani se CPU tak ka safar.',
    icon: 'Zap',
    conceptTags: ['Voltage', 'Current', 'Transistor', 'Silicon'],
    dialogues: [
      {
        id: '15-1',
        char: 'Aarav',
        text: 'Byte, taar me to sirf bijli hoti hai... Bijli se video game kaise chal gaya? Bijli me game kahan chhupa hota hai?',
        mood: 'shocked'
      },
      {
        id: '15-2',
        char: 'Byte',
        text: 'Waah Aarav! Tum Einstein jaise sawal poochh rahe ho! Bijli ko paani ki tarah socho:',
        mood: 'happy'
      },
      {
        id: '15-3',
        char: 'Byte',
        text: 'Voltage = Tanki ka pressure (dhaara kitni zor se nikal rahi hai). Current = Kitna paani pipe me beh raha hai.',
        mood: 'explaining'
      },
      {
        id: '15-4',
        char: 'Byte',
        text: 'Aur Transistor? Ek nanha sa paani ka nalka (switch)! Ek CPU me aise 1,000 Crore nanhe switch hote hain jo ret (Silicon) se bante hain!',
        mood: 'heroic'
      },
      {
        id: '15-5',
        char: 'Aarav',
        text: '1,000 Crore switch ek choti ungli jitni chip me? Yaani switches on-off karke hum sab bana sakte hain?',
        mood: 'curious'
      },
      {
        id: '15-6',
        char: 'Byte',
        text: 'Haan bhai! On-Off, On-Off = 0 aur 1. Yahi hai physics ka sabse bada jaadu!',
        mood: 'happy'
      }
    ],
    lesson: 'Bijli = paani. Transistor = chhota switch, bada jaadu. 1,000 Crore switch milkar CPU bante hain.',
    realWorldAnalogy: 'Ghar ka light switch: bas waisa hi switch par baalon se bhi 1,000 guna chhota.'
  },

  // --- SEASON 7: AI Ka Dimaag ---
  {
    id: 16,
    seasonId: 7,
    seasonTitle: 'Season 7: AI Ka Dimaag',
    chapterNumber: 16,
    title: 'Machine Seekhne Lagi',
    tagline: 'Machine Learning, Neural Networks aur ChatGPT ka raaz.',
    icon: 'Brain',
    conceptTags: ['Machine Learning', 'Neural Network', 'LLM', 'Overfitting'],
    dialogues: [
      {
        id: '16-1',
        char: 'Aarav',
        text: 'Byte, ChatGPT to sab kuch likh deta hai! Meri kavita, maths ke sawal... kya uske paas asli dimaag aa gaya?',
        mood: 'shocked'
      },
      {
        id: '16-2',
        char: 'Byte',
        text: 'Nahi Aarav, use bolte hain Artificial Intelligence! Wo dimaag nahi, par seekhne ki zabardast machine hai.',
        mood: 'explaining'
      },
      {
        id: '16-3',
        char: 'Byte',
        text: 'Machine Learning me hum use 10 Lakh billi ki photos dikhate hain: "Dekho, iske kaan aise hain, moochhein aisi hain."',
        mood: 'explaining'
      },
      {
        id: '16-4',
        char: 'Byte',
        text: 'Neural Network = insaan ke dimaag ke taaron (neurons) ki naqal. Aur LLM (ChatGPT) ne internet ki lakho kitaabein padhi hain aur predict karta hai ki agli line kya aani chahiye!',
        mood: 'heroic'
      },
      {
        id: '16-5',
        char: 'Byte',
        text: 'Par jab machine bina samjhe sirf ratta maar leti hai, to use hum "Overfitting" bolte hain — jaise exam me rattafication!',
        mood: 'happy'
      }
    ],
    lesson: 'AI = bachche jaisi. Galti karke aur data dekhkar seekhti hai. Rattafication nahi, patterns pehchanti hai.',
    realWorldAnalogy: 'Chhota bachha: baar-baar kutte aur billi ko dekhkar unme farq samajh leta hai.'
  },

  // --- SEASON 8: Future Ki Duniya ---
  {
    id: 17,
    seasonId: 8,
    seasonTitle: 'Season 8: Future Ki Duniya & Grand Finale',
    chapterNumber: 17,
    title: 'Saal 2050',
    tagline: 'IoT, AR/VR, Blockchain aur Robotics ki aane wali duniya.',
    icon: 'Sparkles',
    conceptTags: ['IoT', 'AR/VR', 'Blockchain', 'Robotics'],
    dialogues: [
      {
        id: '17-1',
        char: 'Aarav',
        text: 'Byte! Saal 2050 me jab main bada ho jaunga, to duniya kaisi dikhegi?',
        mood: 'curious'
      },
      {
        id: '17-2',
        char: 'Byte',
        text: 'Aarav, tab sab kuch aapas me baat kar raha hoga! IoT (Internet of Things) = tumhara pankha, fridge aur shoes internet se jude honge.',
        mood: 'explaining'
      },
      {
        id: '17-3',
        char: 'Byte',
        text: 'AR/VR = Chashma lagate hi tum Mars planet par tehal rahe hoge! Blockchain = Ek aisa digital register jiska panna koi badal nahi sakta.',
        mood: 'heroic'
      },
      {
        id: '17-4',
        char: 'Byte',
        text: 'Aur Robotics = Machines jo insaan ki madad karengi — surgery me, jungle bachane me aur aag bujhane me!',
        mood: 'happy'
      }
    ],
    lesson: 'Future = sab kuch connected. Naye tools aayenge, par sochne ki takat humesha insaan ke paas rahegi.',
    realWorldAnalogy: 'Jaise aaj ka smartphone: 30 saal pehle ghadi, radio, TV aur camera alag the, aaj ek pocket me hain.'
  },

  // --- FINAL CHAPTER: TECH NAGAR Ko Bachana ---
  {
    id: 18,
    seasonId: 8,
    seasonTitle: 'Season 8: Future Ki Duniya & Grand Finale',
    chapterNumber: 18,
    title: 'FINAL CHAPTER — TECH NAGAR Ko Bachana',
    tagline: '14 Darwaze kholo aur ban jao asali Engineer!',
    icon: 'Trophy',
    conceptTags: ['Grand Finale', '14 Doors', 'Lifelong Learner', 'True Engineer'],
    dialogues: [
      {
        id: '18-1',
        char: 'Byte',
        text: 'ALERT! ALERT! TechNagar ka main power grid down ho gaya hai! Andhera chha raha hai!',
        mood: 'shocked'
      },
      {
        id: '18-2',
        char: 'Aarav',
        text: 'Byte! Ab kya karein? Hum TechNagar ko kaise bachayein?',
        mood: 'shocked'
      },
      {
        id: '18-3',
        char: 'Byte',
        text: 'Aarav, ab tumhari baari hai! 14 doors kholo: Algorithm, Hardware, Networking, Security, Coding, Web, Database, Physics, AI, Future Tech, OS, Math, History aur Ethics!',
        mood: 'heroic'
      },
      {
        id: '18-4',
        char: 'Aarav',
        text: '(Aarav ne saare concepts yaad karke ek-ek switch on kiya... aur poore shehar me roshni wapas jal gayi!) Byte, kya ab main sab kuch jaan gaya?',
        mood: 'curious'
      },
      {
        id: '18-5',
        char: 'Byte',
        text: 'Nahi mere pyare bhai! Technology me seekhna kabhi khatam nahi hota. Real Engineer wahi hai jo har din kuch naya seekhta hai. Chal, agla safar shuru karein!',
        mood: 'happy'
      }
    ],
    lesson: 'Real Engineer wahi jo kabhi seekhna na chhode. Technology badalti rahegi, curiosity zinda rehni chahiye!',
    realWorldAnalogy: 'Suraj har din nayi subah lata hai: har subah ek naya sawal aur naya sabak seekho.'
  }
];
