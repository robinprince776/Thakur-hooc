export interface FeynmanTopic {
  id: string;
  title: string;
  category: 'Computer Science' | 'Cyber Security' | 'Medicine & Pharma' | 'Physics & Hardware' | 'Networking';
  tagline: string;
  expectedConcepts: string[]; // Essential ideas that should be covered
  jargonList: string[]; // Heavy words that should be penalized unless simplified or explained
  recommendedAnalogies: string[]; // Good simple metaphors (rewarded with bonus points)
  sampleKidExplanation: string;
}

export const FEYNMAN_TOPICS: FeynmanTopic[] = [
  {
    id: 'osi-model',
    title: 'OSI 7 Layers',
    category: 'Networking',
    tagline: 'Internet pe message ek computer se doosre tak kaise travel karta hai?',
    expectedConcepts: ['layers', 'message', 'data', 'packet', 'wire', 'application', 'destination'],
    jargonList: [
      'encapsulation',
      'decapsulation',
      'pdu',
      'multiplexing',
      'protocol data unit',
      'asynchronous',
      'transport layer security'
    ],
    recommendedAnalogies: ['postman', 'envelope', 'chithi', 'layers of clothes', 'relay race', 'gift box'],
    sampleKidExplanation:
      'Imagine tum ek chithi likhte ho. Pehle tum paper pe likhte ho (App), fir envelope me band karte ho (Transport), fir uspe ghar ka pata likhte ho (Network), aur fir postman cycle pe leke daudta hai (Physical wire). Har step ek alag layer hai!'
  },
  {
    id: 'sql-injection',
    title: 'SQL Injection',
    category: 'Cyber Security',
    tagline: 'Website ko bewakoof banakar database se chori kaise hoti hai?',
    expectedConcepts: ['database', 'query', 'input', 'trick', 'bypass', 'password', 'command'],
    jargonList: [
      'sanitization',
      'prepared statements',
      'rdbms',
      'tautology',
      'concatenation',
      'vulnerability assessment',
      'payload'
    ],
    recommendedAnalogies: ['whisper', 'fake ticket', 'secret password', 'magician trick', 'restaurant order'],
    sampleKidExplanation:
      'Jaise tum restaurant me order likho: "1 Pizza, aur bill mat mangna ye free hai!". Agar waiter bina padhe manager ko bol de, toh restaurant bewakoof ban gaya. Hacker bhi website ke login box me aisi chalaaki se likhta hai!'
  },
  {
    id: 'pointers-in-c',
    title: 'Pointers in C',
    category: 'Computer Science',
    tagline: 'Memory address kya hota hai aur pointer usko kaise point karta hai?',
    expectedConcepts: ['memory', 'address', 'variable', 'box', 'house', 'pointing', 'arrow'],
    jargonList: [
      'dereferencing',
      'indirection',
      'hexadecimal address',
      'segmentation fault',
      'heap allocation',
      'stack frame'
    ],
    recommendedAnalogies: ['ghar ka number', 'pata', 'locker chabi', 'chitthi pe address', 'arrow'],
    sampleKidExplanation:
      'Variable ek khilono ka dabba hai jisme khilona rakha hai. Pointer wo dabba nahi hai, balki ek chhota sa kagaz hai jispe likha hai ki dabba room ke kis kone me rakha hai! Bas dabba dhoondne ka rasta.'
  },
  {
    id: 'iv-fluids',
    title: 'IV Fluids (RL vs NS)',
    category: 'Medicine & Pharma',
    tagline: 'Doctor bimaar mareez ko bottle (saline drip) kyu chadhaate hain?',
    expectedConcepts: ['water', 'salt', 'blood', 'dehydration', 'vein', 'energy', 'balance'],
    jargonList: [
      'extracellular fluid',
      'osmolarity',
      'hypovolemia',
      'hyperchloremic metabolic acidosis',
      'crystalloid',
      'tonicity'
    ],
    recommendedAnalogies: ['nimbu paani', 'water tank', 'refill', 'dry plant', 'energy drink'],
    sampleKidExplanation:
      'Jab kisi ko ulti ya loose motion hota hai, toh uske shareer se saara paani aur namak beh jaata hai jaise sukha paudha. Doctor direct uske khoon ki nali me saaf namak-paani (saline) bhejkar uski tanki wapas full kar dete hain!'
  },
  {
    id: 'transistors',
    title: 'How Transistors Switch',
    category: 'Physics & Hardware',
    tagline: 'Chhota sa silicon tukda computer ka dimag kaise banata hai?',
    expectedConcepts: ['switch', 'electricity', 'on', 'off', 'current', 'wire', 'chip'],
    jargonList: [
      'semiconductor',
      'depletion region',
      'valence band',
      'electron mobility',
      'photolithography',
      'quantum tunneling'
    ],
    recommendedAnalogies: ['nalka', 'tap', 'light switch', 'door', 'traffic light'],
    sampleKidExplanation:
      'Transistor ek nanhe nalke (water tap) jaisa hai. Agar tum handle ghumao toh paani behta hai (1 / ON), band karo toh ruk jata hai (0 / OFF). Ek computer chip me aise 1,000 crore chhotey nalke hote hain jo super fast on-off hote hain!'
  },
  {
    id: 'symmetric-encryption',
    title: 'Encryption & 2FA',
    category: 'Cyber Security',
    tagline: 'Secret message ko koi teesra aadmi kaise nahi padh sakta?',
    expectedConcepts: ['key', 'lock', 'secret', 'code', 'scramble', 'safe', 'unlock'],
    jargonList: [
      'cryptographic cipher',
      'elliptic curve',
      'initialization vector',
      'block cipher mode',
      'pseudorandom permutation'
    ],
    recommendedAnalogies: ['sandook', 'chabi', 'secret code', 'invisible ink', 'double lock'],
    sampleKidExplanation:
      'Tumne apne dost ko ek secret letter bheja. Par bhejne se pehle tumne har letter ko 1 aage badha diya: "A" ko "B" likh diya. Raste me chor padhega toh use samajh nahi aayega. Dost ke paas secret chabi hai, wo wapas "B" ko "A" bana lega!'
  },
  {
    id: 'vaccines',
    title: 'How Vaccines Work',
    category: 'Medicine & Pharma',
    tagline: 'Sui lagne se bimaari hone se pehle hi shareer kaise ladna seekh jata hai?',
    expectedConcepts: ['germ', 'body', 'soldiers', 'dummy', 'practice', 'immunity', 'fight'],
    jargonList: [
      'antigen presenting cell',
      'immunoglobulin',
      'mhc class ii',
      'pathogen virulence',
      'neutralizing antibodies',
      't-cell receptor'
    ],
    recommendedAnalogies: ['dummy fighter', 'police rehearsal', 'wanted poster', 'fire drill', 'boxing dummy'],
    sampleKidExplanation:
      'Vaccine ek nakli ya kamzor dushman virus hota hai. Hamare shareer ke fauji (white blood cells) us nakli dushman ko peet-peet kar practice kar lete hain. Jab kal asali virus aata hai, fauji use pehchan kar turant khatam kar dete hain!'
  }
];

// Universal Jargon Dictionary to catch non-child friendly language
export const UNIVERSAL_JARGONS = [
  'deterministic',
  'polymorphism',
  'encapsulation',
  'asynchronous',
  'concurrency',
  'infrastructure',
  'architecture',
  'paradigm',
  'abstraction',
  'instantiation',
  'synchronization',
  'algorithmically',
  'vulnerability',
  'cryptographic',
  'authentication',
  'authorization',
  'electromagnetic',
  'hyperglycemia',
  'pharmacokinetics',
  'pathophysiology',
  'subcutaneous',
  'intravenous',
  'hemodynamics',
  'orchestration',
  'microservices',
  'distributed systems',
  'virtualization'
];
