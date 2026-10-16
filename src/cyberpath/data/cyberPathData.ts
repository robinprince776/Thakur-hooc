// CyberPath Master Learning Hub - Comprehensive Educational & Defensive Data

export interface ThinkScenario {
  id: string;
  sector: string;
  title: string;
  attackerGoal: string;
  scenarioDescription: string;
  eli5Description: string;
  question: string;
  options: {
    id: string;
    text: string;
    isOptimal: boolean;
    feedback: string;
  }[];
  defenseStrategy: {
    title: string;
    principles: string[];
    technicalRemediation: string;
  };
}

export interface BreachCaseStudy {
  id: string;
  name: string;
  year: number;
  target: string;
  impact: string;
  whatHappened: string;
  rootCause: string;
  howToPrevent: string;
  eli5Summary: string;
  lessonsLearned: string[];
}

export interface DeepConcept {
  id: string;
  category: 'Cryptography' | 'Memory & Systems' | 'Network Protocols' | 'Web Architecture' | 'Malware Analysis' | 'Cloud & ZTA' | 'Supply Chain & Ethics';
  title: string;
  tagline: string;
  eli5: string;
  technicalDetails: string;
  keyTakeaways: string[];
  realWorldExample: string;
  defensiveChecklist: string[];
}

export interface InterviewQA {
  id: string;
  domain: 'SOC Analyst' | 'Pentester' | 'AppSec' | 'Cloud Security' | 'Network Security' | 'GRC & Laws';
  question: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  answer: string;
  eli5Answer: string;
  keyPoints: string[];
  sampleFollowUp: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CertItem {
  id: string;
  name: string;
  organization: string;
  tier: 'Foundational' | 'Associate' | 'Professional' | 'Expert';
  costUsd: string;
  costInr: string;
  examFormat: string;
  prerequisites: string;
  valueRating: number; // 1-5
  idealRole: string;
  studyTime: string;
  syllabusHighlights: string[];
}

export interface CyberLawSection {
  section: string;
  act: string;
  title: string;
  description: string;
  penalty: string;
  bailable: boolean;
  ethicalHackerAdvice: string;
}

// ─────────────────────────────────────────────────────────────
// 1. 20+ THINK LIKE AN ATTACKER SCENARIOS
// ─────────────────────────────────────────────────────────────
export const THINK_SCENARIOS: ThinkScenario[] = [
  {
    id: 'sc-1',
    sector: 'Banking & Fintech',
    title: 'Mobile Banking API Account Takeover',
    attackerGoal: 'Transfer funds without having the victim\'s multi-factor authentication token.',
    scenarioDescription: 'A mobile banking app has an endpoint /api/v1/user/transfer that takes source_account, dest_account, and amount. The developers assumed that because the user logged in with MFA on the mobile app, subsequent API calls do not need re-verification.',
    eli5Description: 'Chor ne dekha ki bank ka darwaza khula hai aur guard sirf main gate pe khada hai, andar ke kamro me koi tala nahi hai.',
    question: 'Attacker ke perspective se tum sabse pehle kaunsa vulnerability test karoge?',
    options: [
      {
        id: 'opt-1',
        text: 'IDOR / Broken Object Level Authorization (source_account ko victim ke account ID se badalna)',
        isOptimal: true,
        feedback: 'Sahi pakde! BOLA/IDOR API vulnerabilities me #1 rank pe hai. Agar backend session user aur source_account match nahi karta, toh seedha fund drain ho sakta hai.'
      },
      {
        id: 'opt-2',
        text: 'SQL Injection payload daal kar database dump karna',
        isOptimal: false,
        feedback: 'Possible hai par modern ORMs me prepared statements default hote hain. Pehle logical flaw (BOLA/IDOR) check karna sabse fast aur stealthy hota hai.'
      },
      {
        id: 'opt-3',
        text: 'Server pe brute-force attack chalana',
        isOptimal: false,
        feedback: 'Galat rasta. Brute force se WAF alert ho jayega aur IP block ho jayegi.'
      }
    ],
    defenseStrategy: {
      title: 'Contextual Session Authorization & Step-Up Auth',
      principles: [
        'Source account kabhi client input se trust mat karo; JWT/Session token ke authenticated user identity se bind karo.',
        'Critical actions (money transfer, password change) ke liye Step-Up MFA (biometric ya OTP confirmation) enforce karo.',
        'Strict rate-limiting and anomaly detection algorithms implement karo.'
      ],
      technicalRemediation: 'Backend me: `const userAccount = await db.getAccountForUser(req.session.userId); if (userAccount.id !== req.body.sourceAccount) throw new ForbiddenException();`'
    }
  },
  {
    id: 'sc-2',
    sector: 'Healthcare & Hospital',
    title: 'Emergency Room Medical Device Ransomware Threat',
    attackerGoal: 'Lock hospital patient telemetry servers and demand cryptocurrency ransom.',
    scenarioDescription: 'Hospital network me 100+ infusion pumps, MRI consoles, aur Windows 7 legacy monitors ek hi flat Wi-Fi subnet pe connected hain jisme doctors aur visitors bhi connect hote hain.',
    eli5Description: 'Hospital ke critical machines aur guest Wi-Fi ek hi wire se jude hain, koi deewar beech me nahi hai.',
    question: 'Attacker kaise hospital ke patient monitors tak pahunchega?',
    options: [
      {
        id: 'opt-1',
        text: 'Guest Wi-Fi se subnet scan karke unpatched legacy SMB (EternalBlue) exploit karna',
        isOptimal: true,
        feedback: 'Bilkul sahi! Flat networks me lateral movement bahut aasaan hota hai. Agar guest Wi-Fi aur medical VLAN alag nahi hain toh disaster hai.'
      },
      {
        id: 'opt-2',
        text: 'Doctor ke stethoscope me chip lagana',
        isOptimal: false,
        feedback: 'Ye Hollywood film ka script hai, real-world attack network exposure pe depend karta hai.'
      },
      {
        id: 'opt-3',
        text: 'Hospital ke website pe DDoS attack karna',
        isOptimal: false,
        feedback: 'DDoS se website down hogi par internal ICU devices tak access nahi milega.'
      }
    ],
    defenseStrategy: {
      title: 'Zero Trust Network Micro-segmentation & Medical IoT Isolation',
      principles: [
        'Medical Devices ke liye alag isolated VLAN banao with strict 802.1X network access control.',
        'Legacy systems ko air-gap karo ya strictly firewalled jump-box ke peeche rakho.',
        'Guest Wi-Fi ko public internet gateway se seedha route karo without any internal LAN route.'
      ],
      technicalRemediation: 'Firewall rules enforce karo: Drop all traffic from Guest_VLAN to MedDevice_VLAN. Restrict SMB port 445 globally.'
    }
  },
  {
    id: 'sc-3',
    sector: 'E-Commerce',
    title: 'Flash Sale Race Condition (Double Spend)',
    attackerGoal: 'Ek coupon code ko simultaneous requests bhej kar multiple times use karna.',
    scenarioDescription: 'Ek e-commerce store $50 ka discount coupon deta hai jo single-use hona chahiye. Checkout endpoint coupon validate karta hai aur phir 200ms baad coupon status ko used mark karta hai.',
    eli5Description: 'Dukan pe ek ticket se ek hi chocolate milni thi, par 10 dost ek sath 1 second me ticket dikha ke 10 chocolate le gaye kyunki dukan wale ne ticket cancel karne me der kardi.',
    question: 'Attacker is 200ms ke gap ko kaise exploit karega?',
    options: [
      {
        id: 'opt-1',
        text: 'Concurrent parallel HTTP requests (HTTP/2 multiplexing) ek saath send karega',
        isOptimal: true,
        feedback: 'Correct! Isko TOCTOU (Time of Check to Time of Use) Race Condition bolte hain. Dono requests simultaneous check pass kar leti hain!'
      },
      {
        id: 'opt-2',
        text: 'Cart me 500 items add karega',
        isOptimal: false,
        feedback: 'Items badhane se coupon validation timing par koi farak nahi padega.'
      },
      {
        id: 'opt-3',
        text: 'SSL certificate ko decrypt karega',
        isOptimal: false,
        feedback: 'TLS encryption todna computationally impossible hai; issue backend database concurrency logic me hai.'
      }
    ],
    defenseStrategy: {
      title: 'Atomic Database Transactions & Distributed Mutex Locks',
      principles: [
        'Database transactions me `SELECT FOR UPDATE` ya atomic conditional update (`UPDATE coupons SET used = true WHERE id = ? AND used = false`) use karo.',
        'Redis distributed lock (Redlock) se coupon code ko processing ke waqt lock karo.',
        'Idempotency keys enforce karo per order request.'
      ],
      technicalRemediation: 'SQL: `UPDATE coupons SET is_redeemed = true WHERE code = ? AND is_redeemed = false;` Check rows affected == 1.'
    }
  },
  {
    id: 'sc-4',
    sector: 'Human Resources (HR)',
    title: 'Malicious Resume Upload to Cloud Storage',
    attackerGoal: 'HR recruiter ke computer pe access paana ya internal cloud bucket compromise karna.',
    scenarioDescription: 'Company career portal pe applicants ko resume (.pdf, .docx) upload karne ko bola jata hai. File sidha Amazon S3 bucket me store hoti hai aur public URL ban jata hai.',
    eli5Description: 'Ghar ke postbox me koi bina check kiye suspicious parcel daal raha hai aur security guard bina dekhe ghar ke andar deliver kar raha hai.',
    question: 'Attacker is upload functionality ko kaise abuse kar sakta hai?',
    options: [
      {
        id: 'opt-1',
        text: 'Polyglot file (.pdf ke andar embedded executable/macro ya SVG XSS) upload karna',
        isOptimal: true,
        feedback: 'Spot on! Agar server file extension sirf MIME type header se check karta hai, toh attacker malware ya SVG XSS inject kar sakta hai.'
      },
      {
        id: 'opt-2',
        text: 'File ka naam 10,000 characters lamba karna',
        isOptimal: false,
        feedback: 'Ye sirf buffer error ya validation rejection dega, execution access nahi.'
      },
      {
        id: 'opt-3',
        text: 'Resume me white font me text likhna',
        isOptimal: false,
        feedback: 'Ye ATS parser trick hai, koi technical cybersecurity breach nahi.'
      }
    ],
    defenseStrategy: {
      title: 'Content Disarm & Reconstruction (CDR) and Sandboxed Storage',
      principles: [
        'Client-supplied file extensions par bharosa mat karo; magic bytes verify karo.',
        'Uploaded files ko asynchronous antivirus engine (ClamAV) me scan karo.',
        'S3 bucket ko private rakho aur presigned URL with short expiry use karo. Serving headers me `Content-Disposition: attachment` enforce karo.'
      ],
      technicalRemediation: 'File storage header: `Content-Type: application/octet-stream; Content-Disposition: attachment; filename="resume.pdf"` to prevent inline browser execution.'
    }
  },
  {
    id: 'sc-5',
    sector: 'SaaS & Cloud',
    title: 'Multi-Tenant Cloud Data Leakage',
    attackerGoal: 'Company A ka user ban kar Company B ka confidential database data read karna.',
    scenarioDescription: 'Ek CRM software cloud pe hazaron companies ko serve karta hai. Database me ek single `leads` table hai jisme `organization_id` column hai.',
    eli5Description: 'Ek hotel me sabhi kamro ki chabi master key ban gayi, koi bhi guest doosre guest ka kamra khol sakta hai.',
    question: 'Attacker kaise doosri company ka data extract karega?',
    options: [
      {
        id: 'opt-1',
        text: 'API request payload me `organization_id` parameter tamper karke',
        isOptimal: true,
        feedback: 'Exactly! Tenant isolation vulnerability. Agar backend query me `WHERE organization_id = req.user.orgId` hard-enforced nahi hai, toh data leak hoga.'
      },
      {
        id: 'opt-2',
        text: 'AWS ke data center pe physical visit karna',
        isOptimal: false,
        feedback: 'AWS data centers military-grade security follow karte hain.'
      },
      {
        id: 'opt-3',
        text: 'Browser cookies delete karna',
        isOptimal: false,
        feedback: 'Cookies delete karne se sirf apna session expire hoga.'
      }
    ],
    defenseStrategy: {
      title: 'Row-Level Security (RLS) & Scope Enforcement',
      principles: [
        'PostgreSQL Row-Level Security (RLS) use karo taaki database layer khud restrict kare.',
        'Never trust client supplied tenant IDs.',
        'Automated multi-tenant test suites build karo to verify isolation.'
      ],
      technicalRemediation: 'Postgres RLS: `ALTER TABLE leads ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON leads USING (tenant_id = current_setting(\'app.current_tenant_id\'));`'
    }
  },
  {
    id: 'sc-6',
    sector: 'Critical Infrastructure',
    title: 'Water Treatment Plant Remote Access Compromise',
    attackerGoal: 'Water purification chemicals (sodium hydroxide) ke levels manipulate karna.',
    scenarioDescription: 'Plant operators work from home karne ke liye TeamViewer remote desktop software use kar rahe the with a weak shared password and without two-factor authentication.',
    eli5Description: 'Pani saaf karne wali factory ka computer kisi ne bina password security ke internet pe chhod diya.',
    question: 'Attacker ke liye sabse common entry point kya tha?',
    options: [
      {
        id: 'opt-1',
        text: 'Credential stuffing attack on internet-exposed Remote Desktop / TeamViewer',
        isOptimal: true,
        feedback: 'True story (Oldsmar Florida water facility 2021). Unmonitored remote access tool without MFA was hijacked.'
      },
      {
        id: 'opt-2',
        text: 'Physical pipes me magnetic sensor lagana',
        isOptimal: false,
        feedback: 'Physical pipes cyber attack entry point nahi the.'
      },
      {
        id: 'opt-3',
        text: 'Plant manager ke email pe spam newsletter bhejna',
        isOptimal: false,
        feedback: 'Newsletter spam se SCADA control nahi milta.'
      }
    ],
    defenseStrategy: {
      title: 'Purdue Model ICS Isolation & Mandatory Hardware MFA',
      principles: [
        'OT (Operational Technology) networks ko IT networks se completely isolate karo with industrial firewalls.',
        'Third-party remote desktop software (TeamViewer, AnyDesk) ICS machines pe strictly ban karo.',
        'Hardware interlocks (physical cutoff switches) implement karo jo chemical levels exceed hone par automatically trip ho jayein.'
      ],
      technicalRemediation: 'Enforce hardware-level safety valves that reject PLC commands outside 6.5–8.5 pH limits regardless of software instructions.'
    }
  },
  {
    id: 'sc-7',
    sector: 'Telecom & SMS',
    title: 'SIM Swapping for Crypto Wallet Hijack',
    attackerGoal: 'Victim ka phone number apne control me lena taaki SMS OTP bypass ho sake.',
    scenarioDescription: 'Attacker victim ki personal info (DOB, Aadhaar last digits) OSINT se collect karta hai aur telecom customer support ko call karke bolta hai "Mera phone kho gaya hai, naya SIM activate karo".',
    eli5Description: 'Chor ne telecom dukaan wale ko jhooth bol kar aapka mobile number apne naye SIM pe transfer karwa liya.',
    question: 'SMS-based 2FA me sabse badi kamzori kya hai?',
    options: [
      {
        id: 'opt-1',
        text: 'Telecom social engineering vulnerability aur unencrypted SS7 network protocol',
        isOptimal: true,
        feedback: 'Bilkul! SMS authentication insecure hai kyunki telecom support staff easily fool ho sakte hain aur SS7 protocol me interception possible hai.'
      },
      {
        id: 'opt-2',
        text: 'SMS me character limit 160 hoti hai',
        isOptimal: false,
        feedback: 'Character limit security flaw nahi hai.'
      },
      {
        id: 'opt-3',
        text: 'SMS bhejne me paise lagte hain',
        isOptimal: false,
        feedback: 'Cost security vulnerability nahi hai.'
      }
    ],
    defenseStrategy: {
      title: 'Phishing-Resistant FIDO2 WebAuthn & Hardware Security Keys',
      principles: [
        'SMS 2FA ko replace karo FIDO2 / YubiKey hardware tokens ya Authenticator apps (TOTP) se.',
        'Telecom provider par mandatory verbal PIN / SIM Lock password set karo.',
        'High value accounts (Crypto, Email) ko phone number recovery se disconnect karo.'
      ],
      technicalRemediation: 'Implement Passkeys / WebAuthn API in authentication flows: `navigator.credentials.create({ publicKey: options })`'
    }
  },
  {
    id: 'sc-8',
    sector: 'Automotive & IoT',
    title: 'Smart Car Remote CAN Bus Injection',
    attackerGoal: 'Running car ka steering ya brakes remotely control karna.',
    scenarioDescription: 'Connected car me cellular modem hai jo infotainment system se connected hai. Infotainment system aur engine CAN bus ek hi gateway controller se connected hain.',
    eli5Description: 'Car ke music system ke internet se judne ki wajah se chor ne car ke brakes ko control kar liya.',
    question: 'Attacker vehicle ke safe components se critical safety system tak kaise pahuchega?',
    options: [
      {
        id: 'opt-1',
        text: 'Infotainment OS compromise karke CAN bus gateway filter bypass karna',
        isOptimal: true,
        feedback: 'Famous Jeep Cherokee hack (Miller & Valasek 2015). Cellular modem exploit se CAN gateway tak commands bheje gaye.'
      },
      {
        id: 'opt-2',
        text: 'Car ke tyre me sensor puncture karna',
        isOptimal: false,
        feedback: 'TPMS sensor se engine control nahi milta.'
      },
      {
        id: 'opt-3',
        text: 'Car ke windshield wiper par magnet lagana',
        isOptimal: false,
        feedback: 'Purely physical superstition, cyber vector nahi hai.'
      }
    ],
    defenseStrategy: {
      title: 'Hardware CAN Gateway Separation & Cryptographic Message Authentication',
      principles: [
        'Infotainment aur Safety Critical CAN networks ke beech physical unidirectional data diode ya HSM firewall lagao.',
        'SecOC (Secure Onboard Communication) use karo with AES-128 MAC on all critical CAN bus frames.',
        'OTA firmware updates ko public key digital signature se verify karo before flashing.'
      ],
      technicalRemediation: 'AUTOSAR SecOC implementation: CAN message id 0x120 (Brakes) requires 64-bit cryptographic freshness counter + CMAC signature.'
    }
  }
];

// ─────────────────────────────────────────────────────────────
// 2. 10 FAMOUS BREACHES CASE STUDIES
// ─────────────────────────────────────────────────────────────
export const FAMOUS_BREACHES: BreachCaseStudy[] = [
  {
    id: 'case-1',
    name: 'WannaCry Ransomware Pandemic',
    year: 2017,
    target: 'National Health Service (NHS UK), FedEx, Telefonica (200,000+ computers in 150 countries)',
    impact: '$4 Billion in estimated damages, hospital surgeries cancelled, ambulances diverted.',
    whatHappened: 'A wormable ransomware infected unpatched Windows systems via the EternalBlue exploit (CVE-2017-0143) targeting the SMBv1 network protocol on port 445.',
    rootCause: 'Microsoft had released security patch MS17-010 two months earlier, but thousands of organizations had not patched legacy systems or disabled ancient SMBv1 protocols.',
    howToPrevent: 'Strict vulnerability and patch management cycle, disabling obsolete legacy protocols (SMBv1), and blocking port 445 at the perimeter firewall.',
    eli5Summary: 'Ek purana darwaza (SMBv1) jiska lock kharab tha, company ne lock change karne ka update nahi lagaya, aur virus pure hospital me fail gaya.',
    lessonsLearned: [
      'Vulnerability scanning must trigger automated patching within 7–14 days for critical severity CVEs.',
      'Disable SMBv1 globally across the enterprise domain.',
      'Marcus Hutchins discovered the "killswitch domain", stopping the malware propagation.'
    ]
  },
  {
    id: 'case-2',
    name: 'Equifax Data Breach',
    year: 2017,
    target: 'Equifax Credit Bureau (147 Million consumers)',
    impact: '$1.4 Billion in legal penalties and settlement costs, sensitive SSNs, names, DOBs, and addresses leaked.',
    whatHappened: 'Attackers leveraged an unpatched Apache Struts parser vulnerability (CVE-2017-5638) in the online dispute portal to execute arbitrary commands and query backend databases.',
    rootCause: 'Patch notification was sent internally but the specific system was overlooked; internal database traffic was not encrypted, and SSL certificate on network inspection tools had expired months prior.',
    howToPrevent: 'Automated Software Composition Analysis (SCA) to detect vulnerable libraries, active certificate monitoring, and strict network segmentation for sensitive credit data.',
    eli5Summary: 'Ek software library ka hole pata tha par kisi ne update nahi kiya. Sath me security camera ka certificate expire ho gaya tha isliye kisine chor ko aate nahi dekha.',
    lessonsLearned: [
      'Maintain an accurate Software Bill of Materials (SBOM) for all running web applications.',
      'Monitor and automate SSL/TLS certificates on security inspection devices (TLS decryptors).',
      'Database access from web tier should use strictly scoped microservices, never direct unrestricted SQL queries.'
    ]
  },
  {
    id: 'case-3',
    name: 'Target Point-of-Sale (PoS) Breach',
    year: 2013,
    target: 'Target Corporation (40 Million payment cards, 70 Million customer records)',
    impact: '$202 Million cost, CEO and CIO resigned, massive customer trust deficit.',
    whatHappened: 'Attackers sent a phishing email to an HVAC (air conditioning) refrigeration vendor (Fazio Mechanical) to steal their vendor portal credentials, then laterally moved into Target\'s corporate network and PoS terminals.',
    rootCause: 'HVAC vendor portal was not isolated from the payment card environment (flat network); FireEye security tool triggered alerts for malware installation but the SOC team ignored the alarms.',
    howToPrevent: 'Strict network micro-segmentation separating third-party vendor networks from the PCI-DSS Cardholder Data Environment (CDE), with mandatory MFA for all vendor access.',
    eli5Summary: 'AC repair karne wale contractor ka password chori hua, aur kyunki uske pass poore office ka access tha, chor payment counters tak pahunch gaya.',
    lessonsLearned: [
      'Third-party vendors must have zero access to the Cardholder Data Environment (PCI-DSS).',
      'Alert fatigue can be fatal: security alerts must be triaged with clear escalation playbooks.',
      'Endpoint Detection and Response (EDR) must automatically isolate infected memory-scraping hosts.'
    ]
  },
  {
    id: 'case-4',
    name: 'Sony Pictures Cyber Attack',
    year: 2014,
    target: 'Sony Pictures Entertainment',
    impact: 'Unreleased movies leaked, executive emails published, thousands of corporate hard drives wiped.',
    whatHappened: 'Lazarus Group nation-state threat actor gained access via spear-phishing, spent months mapping the Active Directory network, and deployed Shamoon-like wiper malware.',
    rootCause: 'Plaintext passwords in documents titled "passwords.xlsx", lack of internal network monitoring, and absent multi-factor authentication on administrative tools.',
    howToPrevent: 'Enterprise Password Vaults (PAM like CyberArk/HashiCorp Vault), behavioral anomaly detection, and robust off-site immutable backups.',
    eli5Summary: 'Sony ke sabhi passwords ek simple Excel sheet me likhe hue the. Phishing se ghusne ke baad unhone saara data churaya aur computers ko format kar diya.',
    lessonsLearned: [
      'Never store credentials in unencrypted spreadsheets or network shares.',
      'Active Directory security auditing (BloodHound style) to detect privilege escalation paths.',
      'Incident response plans must account for catastrophic destructive wiper events.'
    ]
  },
  {
    id: 'case-5',
    name: 'SolarWinds Supply Chain Insertion',
    year: 2020,
    target: 'SolarWinds Orion Platform (18,000 public and private organizations including US Treasury, Homeland Security)',
    impact: 'Unprecedented espionage access into top global Fortune 500 networks and government departments.',
    whatHappened: 'Nobelium (APT29) infiltrated the software build environment of SolarWinds and modified source code to inject the SUNBURST backdoor into legitimate digitally signed DLL updates.',
    rootCause: 'Build pipeline lacked cryptographic reproducibility and multi-factor isolation; build servers had outbound internet access enabling payload injection during compile time.',
    howToPrevent: 'Reproducible builds, SLSA (Supply-chain Levels for Software Artifacts) framework compliance, and complete isolation of continuous integration build runners.',
    eli5Summary: 'Chor ne software banne wali factory (build pipeline) ke andar ghus kar naye software update me apna backdoor chipka diya, jisko sabhi ne genuine samajh kar install kar liya.',
    lessonsLearned: [
      'Signatures are only as trustworthy as the build pipeline that produces them.',
      'Build infrastructure must be ephemeral, air-gapped, and audited with two-person review.',
      'Inspect outbound DNS queries from management appliances (SUNBURST used DGA DNS domains).'
    ]
  },
  {
    id: 'case-6',
    name: 'Capital One AWS SSRF Cloud Breach',
    year: 2019,
    target: 'Capital One Financial Corporation (106 Million card applications)',
    impact: '$80 Million regulatory fine, $190 Million class action settlement.',
    whatHappened: 'A former cloud employee exploited a Server-Side Request Forgery (SSRF) flaw in a misconfigured open-source ModSecurity WAF running on an EC2 instance to query the AWS Instance Metadata Service (IMDS).',
    rootCause: 'The EC2 instance was assigned an overly permissive IAM role with `s3:ListAllMyBuckets` and `s3:GetObject` permissions across sensitive customer credit buckets.',
    howToPrevent: 'Migrate to AWS IMDSv2 (requires session token headers, defeating simple SSRF), enforce Least Privilege IAM policies, and encrypt data with customer-managed KMS keys.',
    eli5Summary: 'Server ke ek chote se bug (SSRF) ka fayda utha kar attacker ne cloud metadata se AWS chabi nikali, aur kyunki chabi ke paas saare buckets ka access tha, sabhi files download kar li.',
    lessonsLearned: [
      'Enforce IMDSv2 globally to block SSRF requests from accessing IAM credentials.',
      'Never give wildcard `*` permissions to cloud roles attached to internet-facing compute.',
      'Encrypt cloud objects with dedicated KMS keys and audit CloudTrail event spikes.'
    ]
  },
  {
    id: 'case-7',
    name: 'Uber MFA Fatigue Breach',
    year: 2022,
    target: 'Uber Internal Systems (Slack, AWS, GCP, HackerOne reports, Google Drive)',
    impact: 'Attacker accessed internal administrative dashboards, source code, and security vulnerability reports.',
    whatHappened: 'A teenager threat actor (Lapsus$) bought stolen credentials of an external contractor on the dark web, then sent repeated MFA push notifications to the contractor\'s phone at night (MFA fatigue/push bombing) until the tired victim accepted.',
    rootCause: 'Lack of FIDO2 Number Matching, hardcoded PowerShell scripts on internal network shares containing plain domain admin credentials to Thycotic PAM.',
    howToPrevent: 'FIDO2 / WebAuthn hardware keys (phishing and push-bomb resistant), automated scanning for hardcoded secrets on file shares, and immediate privileged session revocation.',
    eli5Summary: 'Chor ne raat ke 2 baje contractor ke phone pe 50 baar "Accept Login?" ka pop-up bheja. Pareshan hoke usne accept dabaya, aur andar jaa kar scripts me admin password mil gaya.',
    lessonsLearned: [
      'Simple push notifications for MFA are obsolete; require Number Matching or FIDO2 tokens.',
      'Secrets sprawl (scripts with hardcoded admin passwords) is the quickest path to domain compromise.',
      'Zero Trust means internal network access must never grant immediate access to PAM consoles.'
    ]
  },
  {
    id: 'case-8',
    name: 'Colonial Pipeline Ransomware Shutdown',
    year: 2021,
    target: 'Colonial Pipeline (Supplies 45% of East Coast US gasoline and jet fuel)',
    impact: 'Pipeline halted for 6 days, gas stations ran out of fuel, $4.4 Million ransom paid.',
    whatHappened: 'DarkSide ransomware gang gained access to the internal network using a single compromised password found on the dark web for an inactive legacy VPN account.',
    rootCause: 'The legacy VPN account did not have multi-factor authentication (MFA) enabled and was never decommissioned after its lifecycle ended.',
    howToPrevent: 'Mandatory enterprise-wide MFA on all remote access gateways, automated orphan account lifecycle offboarding, and IT/OT air-gapped segregation.',
    eli5Summary: 'Ek purana bhool gaya account jisme 2-Factor Authentication nahi laga tha, uska leaked password use karke attackers ne company ka billing software lock kar diya.',
    lessonsLearned: [
      'Every single internet-facing portal must enforce MFA without exception.',
      'Deprovision inactive and orphaned employee/contractor accounts automatically.',
      'Billing/IT systems must not force the shutdown of critical physical operational pipelines.'
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// 3. 99% DEEP CONCEPTS (ELI5 + TECHNICAL)
// ─────────────────────────────────────────────────────────────
export const DEEP_CONCEPTS: DeepConcept[] = [
  {
    id: 'dc-1',
    category: 'Cryptography',
    title: 'TLS 1.3 Handshake & Perfect Forward Secrecy (PFS)',
    tagline: 'Why recording encrypted internet traffic today won\'t let anyone decrypt it tomorrow.',
    eli5: 'Socho tum aur tumhara dost har phone call pe ek nayi aisi chabi banate ho jo call khatam hote hi gayab ho jati hai. Agar koi police ya chor tumhari pichli calls record bhi kar le aur saalo baad tumhara main password chura bhi le, toh bhi wo pichli calls nahi sun sakta.',
    technicalDetails: 'TLS 1.3 reduces the handshake to 1-RTT (Round Trip Time). It completely removes weak cipher suites (RC4, 3DES, CBC mode) and static RSA key exchange. Instead, it mandates Ephemeral Diffie-Hellman (ECDHE with X25519 or P-256). The private keys are generated randomly in RAM for each session and wiped immediately after key agreement, establishing Perfect Forward Secrecy.',
    keyTakeaways: [
      'Static RSA key exchange allowed anyone with the server private key to decrypt historical pcaps.',
      'PFS ensures compromise of long-term server keys does not compromise past session keys.',
      'TLS 1.3 encrypts the server certificate, preventing passive eavesdroppers from seeing which SNI host is being visited.'
    ],
    realWorldExample: 'Cloudflare and Google migrated 100% of HTTPS traffic to TLS 1.3 with PFS to neutralize bulk surveillance programs.',
    defensiveChecklist: [
      'Disable TLS 1.0, 1.1, and all static RSA key exchanges on web servers.',
      'Enable strict HSTS with `max-age=31536000; includeSubDomains; preload`.',
      'Deploy modern cipher suites: `TLS_AES_256_GCM_SHA384` and `TLS_CHACHA20_POLY1305_SHA256`.'
    ]
  },
  {
    id: 'dc-2',
    category: 'Memory & Systems',
    title: 'Stack Canaries, ASLR & DEP (The Memory Trinity)',
    tagline: 'How modern operating systems prevent buffer overflow exploits from executing shellcode.',
    eli5: 'Pehle zamane me agar program me memory overflow hoti thi toh chor apna script chala leta tha. Aaj OS 3 pehre-daar lagata hai: 1) Canary: Ek choti chidiya (random number) jo mar jaye toh system band ho jata hai. 2) ASLR: Har baar ghar ke kamro ka address badal dena taaki chor ko pata na chale code kahan hai. 3) DEP: Padhne wale kagaz pe bomb phootne se mana karna (Data execution block).',
    technicalDetails: 'Buffer overflows attempt to overwrite the function Return Address (EIP/RIP) to hijack instruction execution. Defense Trinity: 1) Stack Canary: GCC inserts a random value (`__stack_chk_guard`) between the local buffer and return pointer. Before returning, the value is checked; if altered, `__stack_chk_fail` terminates the process. 2) ASLR (Address Space Layout Randomization): Randomizes memory offsets of the stack, heap, and libraries (libc). 3) DEP/NX (Data Execution Prevention / No-Execute bit): Marks stack and heap pages as non-executable, preventing injected shellcode execution.',
    keyTakeaways: [
      'Without ASLR and DEP, exploiting a basic `strcpy()` buffer overflow was trivial.',
      'Attackers invented Return-Oriented Programming (ROP) to bypass DEP by reusing existing binary snippets ("gadgets").',
      'Modern mitigation adds Control Flow Guard (CFG) and Intel CET (Shadow Stack) to stop ROP.'
    ],
    realWorldExample: 'iOS and Android enforce hardened kernels with PAN (Privileged Access Never), ASLR, and PAC (Pointer Authentication Codes) to stop zero-click jailbreak exploits.',
    defensiveChecklist: [
      'Compile C/C++ with `-fstack-protector-strong -D_FORTIFY_SOURCE=2 -fPIE -pie -Wl,-z,relro,-z,now`.',
      'Never use banned C library functions (`gets`, `strcpy`, `sprintf`, `strcat`); use bounded alternatives (`snprintf`, `strncpy`).',
      'Adopt memory-safe languages like Rust or Go for modern system development.'
    ]
  },
  {
    id: 'dc-3',
    category: 'Web Architecture',
    title: 'Same-Origin Policy (SOP), CORS & Secure Cookie Architecture',
    tagline: 'The browser security boundary that stops malicious websites from stealing your bank session.',
    eli5: 'Agar tum `facebook.com` pe logged in ho aur sath me ek hacker website `fakegame.com` kholte ho, toh hacker website tumhare Facebook messages kyu nahi padh sakti? Same-Origin Policy ki wajah se! Browser dono ke beech aisi deewar banata hai jise koi cross nahi kar sakta jab tak Facebook explicitly allow na kare.',
    technicalDetails: 'An Origin is defined by `Protocol + Domain + Port`. Under SOP, JavaScript running in one origin cannot access the DOM or read HTTP responses from another origin. Cross-Origin Resource Sharing (CORS) is a relaxation mechanism using HTTP headers (`Access-Control-Allow-Origin`). Cookies protect sessions using 3 flags: `HttpOnly` (blocks JavaScript `document.cookie` reading, stopping XSS session theft), `Secure` (only transmitted over HTTPS), and `SameSite=Strict/Lax` (prevents browser from attaching cookies on third-party cross-site requests, mitigating CSRF).',
    keyTakeaways: [
      'CORS is not a security feature to protect client browsers; it is a mechanism to relax SOP for trusted servers.',
      '`Access-Control-Allow-Origin: *` with `Allow-Credentials: true` is an invalid and dangerous misconfiguration.',
      '`SameSite=Lax` is now standard in modern browsers, reducing naive CSRF attacks drastically.'
    ],
    realWorldExample: 'A vulnerable CORS configuration on a cryptocurrency trading platform once allowed an external site to read user balances via an authenticated background GET request.',
    defensiveChecklist: [
      'Set all session cookies with `HttpOnly; Secure; SameSite=Strict; Path=/; Priority=High`.',
      'Never reflect the incoming `Origin` header dynamically in `Access-Control-Allow-Origin` without strict whitelist validation.',
      'Implement strict Content Security Policy (CSP) with nonce-based script whitelisting.'
    ]
  },
  {
    id: 'dc-4',
    category: 'Network Protocols',
    title: 'DNS Tunneling & BGP Hijacking',
    tagline: 'How data can be smuggled through port 53 and how entire countries route internet traffic through rogue nations.',
    eli5: 'Socho office me internet band hai aur sirf telephone directory (DNS) dekhne ki permission hai. Agar tum directory wale ko code word me secret message bhejo aur wo answer me document bhej de, toh ise DNS Tunneling kehte hain. Aur agar chor road ke signboards badal kar saara traffic apne ghar se nikalwaye, toh ise BGP Hijacking kehte hain.',
    technicalDetails: 'DNS Tunneling encodes non-DNS protocols (HTTP, SSH, file data) inside DNS queries (e.g. `base64data.attacker-c2.com`). Firewalls allow port 53 UDP traffic freely, enabling command-and-control (C2) or exfiltration. BGP (Border Gateway Protocol) determines the best routing path between Autonomous Systems (AS). Because classic BGP does not verify ownership of IP prefixes, a rogue ISP can broadcast false routes, stealing traffic intended for banks, crypto services, or governments.',
    keyTakeaways: [
      'DNS Tunneling can be detected via entropy analysis of subdomain names, high request volume, and excessive TXT record queries.',
      'RPKI (Resource Public Key Infrastructure) cryptographically signs BGP route announcements to prevent hijacking.',
      'DNS-over-HTTPS (DoH) encrypts recursive queries, blinding traditional perimeter DNS inspection.'
    ],
    realWorldExample: 'In 2018, attackers used BGP hijacking against Amazon Route 53 to redirect traffic meant for MyEtherWallet to a phishing site, stealing $150,000 in minutes.',
    defensiveChecklist: [
      'Deploy DNS firewalls with machine-learning threat detection for high-entropy domain queries.',
      'Implement RPKI Route Origin Validation (ROV) on all border BGP routers.',
      'Restrict internal clients from querying external DNS directly; force all lookups through monitored internal recursive resolvers.'
    ]
  },
  {
    id: 'dc-5',
    category: 'Cloud & ZTA',
    title: 'Zero Trust Architecture (ZTA) & The 6 Core Pillars',
    tagline: 'Moving from "Castle and Moat" perimeter security to continuous verification of every transaction.',
    eli5: 'Purana tarika tha: Ghar ke bahar bada gate laga do, jo andar aa gaya use family member maan lo. Naya tarika (Zero Trust) hai: Chahe koi ghar ke andar bhi ho, har kamre me biometric lock hoga, har minute check hoga ki wo kaun hai, aur bina permission koi kisi aur kamre me nahi ja sakta.',
    technicalDetails: 'Perimeter firewalls assume that internal network traffic is trustworthy. Zero Trust operates under the axiom "Assume Breach". The 6 Pillars of NIST SP 800-207 Zero Trust Architecture: 1) Identity: Continuous authentication (MFA, behavioral biometrics). 2) Device: Health and compliance attestation (EDR running, OS patched). 3) Network: Micro-segmentation with software-defined perimeters. 4) Application: Context-aware access proxies (e.g. Google BeyondCorp). 5) Data: Encryption at rest and in transit, dynamic tagging. 6) Infrastructure: Immutable declarative infrastructure as code.',
    keyTakeaways: [
      'VPNs provide broad network-level access, violating the Principle of Least Privilege.',
      'Zero Trust Network Access (ZTNA) grants application-specific access without placing the device on the corporate network.',
      'Continuous evaluation ensures that if a device contracts malware mid-session, active tokens are revoked instantly.'
    ],
    realWorldExample: 'Google transitioned to BeyondCorp following the 2009 Operation Aurora nation-state attack, completely eliminating internal corporate VPNs.',
    defensiveChecklist: [
      'Eliminate legacy site-to-site VPNs in favor of identity-aware proxies (Cloudflare Access, Tailscale ZTNA).',
      'Require device health checks (TPM attestation, active EDR) before authorizing SSO sessions.',
      'Enforce micro-segmentation so database servers only accept connections from verified application service accounts.'
    ]
  },
  {
    id: 'dc-6',
    category: 'Malware Analysis',
    title: 'Static vs Dynamic Analysis, Sandboxing & YARA Rules',
    tagline: 'How reverse engineers safely dissect malicious binaries and author detection signatures.',
    eli5: 'Ek doctor kisi virus ko do tarike se check karta hai: 1) Microscope ke neeche dekhna (Static Analysis - bina chalaaye structure padhna). 2) Chuhe pe try karke dekhna ki kya asar hota hai (Dynamic Analysis - isolated box me run karke behaviour dekhna). Aur YARA rule virus ka fingerprint signature hai.',
    technicalDetails: 'Static Analysis examines the binary without execution: calculating cryptographic hashes (SHA-256, SSDEEP fuzzy hashes), extracting strings, inspecting PE headers (Imports, Exports, Section entropy for UPX/packers), and disassembling via Ghidra/IDA Pro. Dynamic Analysis runs the malware in an instrumented sandbox (Cuckoo, Any.Run) while monitoring API calls, registry modifications, network sockets, and process injections. YARA allows defenders to classify malware using boolean logic on strings, hex patterns, and PE metadata.',
    keyTakeaways: [
      'Packers and crypters disguise static signatures; memory dumping during dynamic execution reveals the unpacked payload.',
      'Malware authors use anti-VM and anti-debugging tricks (checking CPU cores, screen resolution, MAC addresses).',
      'YARA rules enable threat intelligence feeds to match binary variants across the entire enterprise.'
    ],
    realWorldExample: 'Researchers identified the Stuxnet rootkit by analyzing anomalous export functions and signed Realtek certificates inside the static PE structure.',
    defensiveChecklist: [
      'Never open untrusted attachments on host workstations; route through cloud detonation sandboxes.',
      'Deploy YARA scanners across endpoint file systems to detect unauthorized executables.',
      'Use memory analysis tools (Volatility) to capture process hollowing and in-memory DLL injection.'
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// 4. CERTIFICATION ROADMAP COMPARISON
// ─────────────────────────────────────────────────────────────
export const CERT_ROADMAP: CertItem[] = [
  {
    id: 'cert-1',
    name: 'CompTIA Security+',
    organization: 'CompTIA (SY0-701)',
    tier: 'Foundational',
    costUsd: '$404',
    costInr: '₹33,500',
    examFormat: 'Multiple choice & Performance-Based Questions (90 mins)',
    prerequisites: 'Basic networking and operating system knowledge (Network+ recommended)',
    valueRating: 5,
    idealRole: 'Junior SOC Analyst, Security Coordinator, Systems Administrator',
    studyTime: '2–3 Months',
    syllabusHighlights: [
      'Threats, Attacks & Vulnerabilities',
      'Security Architecture & Tooling',
      'Implementation of Cryptography & PKI',
      'Operations & Incident Response Playbooks',
      'Governance, Risk & Compliance (GRC)'
    ]
  },
  {
    id: 'cert-2',
    name: 'eLearnSecurity Junior Penetration Tester (eJPTv2)',
    organization: 'INE Security',
    tier: 'Associate',
    costUsd: '$249',
    costInr: '₹20,500',
    examFormat: '100% Hands-on practical lab exam (48 hours)',
    prerequisites: 'Basic TCP/IP, Linux command line, fundamentals of ethical hacking',
    valueRating: 5,
    idealRole: 'Entry-level Penetration Tester, Vulnerability Assessment Analyst',
    studyTime: '2–3 Months',
    syllabusHighlights: [
      'Active & Passive Network Reconnaissance',
      'Host Assessment & Vulnerability Scanning',
      'Web Application Penetration Testing Fundamentals',
      'Network Sniffing & Credential Harvesting',
      'Exploitation & Post-Exploitation Basics'
    ]
  },
  {
    id: 'cert-3',
    name: 'Offensive Security Certified Professional (OSCP)',
    organization: 'OffSec (PEN-200)',
    tier: 'Professional',
    costUsd: '$1,649',
    costInr: '₹1,37,000',
    examFormat: '24-hour live practical hacking exam + 24-hour documentation report',
    prerequisites: 'Strong Linux/Windows administration, Python/Bash scripting, web vulnerability mastery',
    valueRating: 5,
    idealRole: 'Senior Penetration Tester, Red Team Operator, Security Consultant',
    studyTime: '6–9 Months',
    syllabusHighlights: [
      'Active Directory Domain Exploitation (Kerberoasting, BloodHound, Pass-the-Hash)',
      'Custom Exploit Modification & Buffer Overflows',
      'Linux and Windows Privilege Escalation',
      'Client-side Attacks and Port Redirection / Tunneling',
      'Comprehensive Professional Pentest Reporting'
    ]
  },
  {
    id: 'cert-4',
    name: 'Certified Information Systems Security Professional (CISSP)',
    organization: '(ISC)²',
    tier: 'Expert',
    costUsd: '$749',
    costInr: '₹62,000',
    examFormat: 'Computer Adaptive Testing (CAT) - 100-150 Questions (3 hours)',
    prerequisites: '5 years of cumulative paid work experience in 2 or more of the 8 CISSP domains',
    valueRating: 5,
    idealRole: 'Chief Information Security Officer (CISO), Security Architect, IT Director',
    studyTime: '6–12 Months',
    syllabusHighlights: [
      'Security & Risk Management',
      'Asset Security & Data Classification',
      'Security Architecture & Engineering',
      'Communication & Network Security',
      'Identity & Access Management (IAM)',
      'Security Operations & Software Development Security'
    ]
  },
  {
    id: 'cert-5',
    name: 'AWS Certified Security - Specialty',
    organization: 'Amazon Web Services (SCS-C02)',
    tier: 'Professional',
    costUsd: '$300',
    costInr: '₹25,000',
    examFormat: '65 Questions (170 mins)',
    prerequisites: 'AWS Solutions Architect Associate or equivalent 2 years cloud experience',
    valueRating: 4.8,
    idealRole: 'Cloud Security Engineer, DevSecOps Specialist, Cloud Architect',
    studyTime: '3–4 Months',
    syllabusHighlights: [
      'Threat Detection and Incident Response (GuardDuty, Security Hub)',
      'Security Logging and Monitoring (CloudTrail, CloudWatch Logs)',
      'Infrastructure Security & WAF rules',
      'Identity and Access Management (IAM Least Privilege, SCPs)',
      'Data Protection & KMS Envelope Encryption'
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// 5. INDIAN CYBER LAWS & IT ACT 2000 REFERENCE
// ─────────────────────────────────────────────────────────────
export const INDIAN_CYBER_LAWS: CyberLawSection[] = [
  {
    section: 'Section 43',
    act: 'Information Technology Act, 2000',
    title: 'Penalty and Compensation for Damage to Computer System',
    description: 'Bina permission kisi computer, system, network ya database ko access karna, copy karna, virus introduce karna, ya system ko disrupt karna.',
    penalty: 'Victim ko damage compensation up to ₹1 Crore (Civil Liability).',
    bailable: true,
    ethicalHackerAdvice: 'Kisi bhi system par testing karne se pehle written Scope of Work (SOW) aur Non-Disclosure Agreement (NDA) sign karwayein. "Authorized Testing" ka proof hona mandatory hai.'
  },
  {
    section: 'Section 66',
    act: 'Information Technology Act, 2000',
    title: 'Computer Related Offences (Hacking)',
    description: 'Agar koi Section 43 me specified kaam dishonest ya fraudulent intention ke saath kare.',
    penalty: 'Up to 3 saal ki imprisonment ya ₹5 Lakh tak ka fine, ya dono.',
    bailable: true,
    ethicalHackerAdvice: 'Kabhi bhi public live website par bina permission automated scanners (sqlmap, nmap aggressive, nikto) mat chalao. Logs me IP record hoti hai aur Section 66 attract ho sakta hai.'
  },
  {
    section: 'Section 66C',
    act: 'Information Technology Act, 2000',
    title: 'Punishment for Identity Theft',
    description: 'Kisi doosre vyakti ke electronic signature, password, biometric ya digital identity credentials ka dishonest use karna.',
    penalty: 'Up to 3 saal ki imprisonment aur ₹1 Lakh tak ka fine.',
    bailable: true,
    ethicalHackerAdvice: 'CTF ya lab me mila password sirf us test environment tak simit rakhein. Kisi real account ya personal credentials ke sath match karne ki koshish legal offence hai.'
  },
  {
    section: 'Section 66D',
    act: 'Information Technology Act, 2000',
    title: 'Punishment for Cheating by Personation using Computer Resource',
    description: 'Computer resource ke zariye fake identity bana kar (phishing, spoofed email, fake banking portal) logon ko cheat karna.',
    penalty: 'Up to 3 saal ki jail aur ₹1 Lakh tak ka fine.',
    bailable: true,
    ethicalHackerAdvice: 'Security awareness training ke liye phishing campaigns conduct karte waqt HR aur Management ka explicit written approval mandatory hota hai.'
  },
  {
    section: 'Section 66E',
    act: 'Information Technology Act, 2000',
    title: 'Violation of Privacy',
    description: 'Kisi vyakti ke private body parts ya private moments ko bina consent capture, publish ya transmit karna.',
    penalty: 'Up to 3 saal imprisonment ya ₹2 Lakh fine ya dono.',
    bailable: true,
    ethicalHackerAdvice: 'Webcam ya smart home security audit me camera streams access hone par screenshot lena strictly prohibited hai; sirf metadata aur configuration proof report me include karein.'
  },
  {
    section: '1930 Helpline',
    act: 'National Cyber Crime Reporting Portal (MHA)',
    title: 'Citizen Financial Cyber Fraud Reporting System',
    description: 'Financial cyber fraud (UPI fraud, fake credit card calls, net-banking unauthorized transfer) hone ke golden hours (within 2-4 hours) me 1930 par call karke transaction freeze karwayi ja sakti hai.',
    penalty: 'Victim support mechanism (freezing stolen funds in beneficiary bank account).',
    bailable: false,
    ethicalHackerAdvice: 'Apne aas-paas kisi ke sath online financial fraud ho toh sabse pehle 1930 dial karwayein ya `cybercrime.gov.in` par transaction reference number ke sath complain register karein.'
  }
];

// ─────────────────────────────────────────────────────────────
// 6. 300+ INTERVIEW Q&A SAMPLES (Curated Top High-Yield)
// ─────────────────────────────────────────────────────────────
export const INTERVIEW_QA_BANK: InterviewQA[] = [
  {
    id: 'i-1',
    domain: 'SOC Analyst',
    question: 'What happens when a user types "https://google.com" and presses Enter? Explain from a security perspective.',
    difficulty: 'Intermediate',
    answer: 'The browser checks HSTS cache to avoid plaintext HTTP. 1) DNS resolution queries local cache -> hosts file -> recursive resolver. Attacker vectors: DNS spoofing/poisoning. 2) TCP 3-way handshake (SYN, SYN-ACK, ACK) on port 443. Attacker vectors: SYN flood. 3) TLS 1.3 handshake: ClientHello with supported ciphers and key share -> ServerHello with chosen cipher and certificate -> Server verifies CA chain -> Session keys generated via Diffie-Hellman. 4) Encrypted HTTP GET request transmitted with cookies (evaluated against SOP/CORS). 5) Server response parsed; CSP, X-Frame-Options, HSTS headers applied.',
    eli5Answer: 'Browser pehle phonebook (DNS) me address dhundhta hai, phir server se hath milata hai (TCP), secret code me baat shuru karta hai (TLS), aur web page lock ke sath load hota hai.',
    keyPoints: [
      'HSTS prevents SSL stripping attacks.',
      'TLS certificate validation checks expiry, revocation (OCSP/CRL), and CA trust chain.',
      'Security headers dictate how the browser executes scripts and renders iframes.'
    ],
    sampleFollowUp: 'If the SSL certificate is invalid, why should you never click "Proceed Anyway"?'
  },
  {
    id: 'i-2',
    domain: 'SOC Analyst',
    question: 'How do you differentiate between a True Positive and a False Positive alert in a SIEM?',
    difficulty: 'Beginner',
    answer: '1) Verify the Alert Context: Identify the triggered rule, severity, timestamp, and source/destination IP addresses. 2) Cross-reference Asset Criticality: Is the source a domain controller, developer machine, or guest Wi-Fi? 3) Correlate with Other Telemetry: Check EDR logs for suspicious child processes (e.g. `word.exe` spawning `powershell.exe`), firewall egress spikes, or proxy connections to newly registered domains. 4) Threat Intelligence: Check destination IPs on VirusTotal, AbuseIPDB. 5) User Interview: Verify with the user if they executed the authorized administrative script. If malicious intent/indicator is verified, it is a True Positive; if legitimate business activity triggered an overly broad rule, it is a False Positive.',
    eli5Answer: 'Jaise ghar ka smoke detector jalte hue khane ke dhuen se baja (False Positive) ya sach me aag lagne se baja (True Positive). SOC analyst check karta hai ki aag sach me lagi hai ya sirf toast jal gaya hai.',
    keyPoints: [
      'Never close an alert without documented triage notes and evidence.',
      'A true positive requires immediate containment (host isolation, credential reset).',
      'Consistent false positives should be tuned in the SIEM detection engineering backlog.'
    ],
    sampleFollowUp: 'What metrics are used to measure SOC efficiency? (MTTD - Mean Time to Detect, MTTR - Mean Time to Respond).'
  },
  {
    id: 'i-3',
    domain: 'AppSec',
    question: 'Explain the difference between Stored XSS, Reflected XSS, and DOM-based XSS.',
    difficulty: 'Intermediate',
    answer: '1) Stored XSS: Malicious payload is permanently saved in the application database (e.g., comments, profiles) and served to every visiting user. Most dangerous because no user trickery is needed. 2) Reflected XSS: Payload is embedded in a link (query param) and reflected back in the immediate HTTP response without being saved (e.g., search error message). Requires social engineering the victim into clicking the link. 3) DOM-based XSS: The vulnerability exists purely in client-side JavaScript. The payload never travels to the backend server. It is read from a source (e.g. `location.hash`) and passed to an unsafe execution sink (e.g. `eval()`, `document.write()`, `innerHTML`).',
    eli5Answer: 'Stored XSS: Paani ki tanki me zeher daal diya, sabko milega. Reflected XSS: Kisi ek glass me zeher ghol ke samne wale ko pilaya. DOM XSS: Ghar ke andar aane ke baad glass khud chemical se react kar gaya.',
    keyPoints: [
      'Stored XSS has the highest blast radius.',
      'DOM XSS cannot be blocked by WAFs because the payload never reaches server logs.',
      'Defense: Context-aware HTML/JS output encoding, CSP, and safe DOM APIs (`textContent` instead of `innerHTML`).'
    ],
    sampleFollowUp: 'Can a Content Security Policy (CSP) completely prevent XSS?'
  },
  {
    id: 'i-4',
    domain: 'Pentester',
    question: 'What is the difference between Privilege Escalation (Vertical vs Horizontal)? Provide an example of each.',
    difficulty: 'Beginner',
    answer: '1) Horizontal Privilege Escalation: A user accesses resources or functions belonging to another user with the SAME privilege level. Example: User A (Student ID 101) modifies the URL from `/profile?id=101` to `/profile?id=102` and views User B\'s personal grades (classic IDOR). 2) Vertical Privilege Escalation: A user with low privileges gains access to functionalities reserved for higher privileged roles. Example: A standard employee modifies their role cookie from `role=user` to `role=admin`, or exploits an SUID binary on Linux to gain `root` shell access.',
    eli5Answer: 'Horizontal: Apne barabar wale room mate ki almari khol lena (same level). Vertical: Peon ka seedha CEO ke cabin me baith kar sign kar dena (higher level).',
    keyPoints: [
      'Horizontal escalation relies on broken object-level authorization (BOLA).',
      'Vertical escalation exploits broken function-level authorization or OS kernel bugs.',
      'Defense: Enforce RBAC/ABAC at the server layer; never trust client-side role claims.'
    ],
    sampleFollowUp: 'How do you check for SUID binaries in Linux? (`find / -perm -4000 -type f 2>/dev/null`)'
  },
  {
    id: 'i-5',
    domain: 'Cloud Security',
    question: 'What is the AWS Shared Responsibility Model, and where do most breaches occur?',
    difficulty: 'Intermediate',
    answer: 'AWS is responsible for "Security OF the Cloud" (physical data centers, hardware, hypervisors, foundational networking, facility security). The Customer is responsible for "Security IN the Cloud" (customer data, IAM credentials, OS patches on EC2, firewall/security group configurations, database encryption, application code). Gartner states that through 2025, over 99% of cloud security failures will be the customer\'s fault (misconfigured S3 buckets, overly permissive IAM roles, leaked API keys on GitHub).',
    eli5Answer: 'AWS ne ek majboot building banayi aur lock laga diya (Security of Cloud). Lekin kamre ka tala lagana, darwaza khula na chhodna aur chabi sambhalna aapka kaam hai (Security in Cloud).',
    keyPoints: [
      'IaaS gives maximum customer responsibility; SaaS minimizes it.',
      'Misconfigured IAM roles with `AdministratorAccess` are the primary threat vector.',
      'Use AWS Organizations Service Control Policies (SCPs) to establish hard guardrails.'
    ],
    sampleFollowUp: 'How do you prevent developers from committing AWS access keys to public GitHub repositories?'
  }
];

// ─────────────────────────────────────────────────────────────
// 7. WEEKLY QUIZ QUESTIONS (Randomizable 20-Question Bank)
// ─────────────────────────────────────────────────────────────
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    category: 'Network Security',
    question: 'Which flag in a TCP header is used to initiate a connection during the 3-way handshake?',
    options: ['ACK', 'FIN', 'SYN', 'RST'],
    correctIndex: 2,
    explanation: 'SYN (Synchronize) is the first packet sent by the client to initialize sequence numbers.'
  },
  {
    id: 'q-2',
    category: 'Cryptography',
    question: 'Which password hashing algorithm includes a configurable work factor (cost) to slow down brute force attacks?',
    options: ['MD5', 'SHA-256', 'bcrypt', 'Base64'],
    correctIndex: 2,
    explanation: 'bcrypt uses a salt and configurable cost rounds (e.g. 12), making GPU brute-force prohibitively expensive.'
  },
  {
    id: 'q-3',
    category: 'Web Security',
    question: 'What cookie attribute prevents client-side JavaScript from reading `document.cookie`, neutralizing XSS session theft?',
    options: ['SameSite=Strict', 'Secure', 'HttpOnly', 'Domain'],
    correctIndex: 2,
    explanation: 'HttpOnly instructs the browser that the cookie should not be accessible via DOM Document.cookie API.'
  },
  {
    id: 'q-4',
    category: 'Threat Modeling',
    question: 'In the STRIDE threat modeling framework, what does the "R" stand for?',
    options: ['Reconnaissance', 'Repudiation', 'Redundancy', 'Revocation'],
    correctIndex: 1,
    explanation: 'Repudiation refers to an attacker denying having performed an action without the system being able to prove otherwise.'
  },
  {
    id: 'q-5',
    category: 'Cloud Security',
    question: 'Which AWS service prevents SSRF metadata attacks on EC2 by requiring a PUT session token header?',
    options: ['IMDSv1', 'IMDSv2', 'AWS Shield', 'VPC Flow Logs'],
    correctIndex: 1,
    explanation: 'IMDSv2 requires `X-aws-ec2-metadata-token`, which simple SSRF vulnerabilities cannot forge.'
  },
  {
    id: 'q-6',
    category: 'Memory Security',
    question: 'What is the purpose of Address Space Layout Randomization (ASLR)?',
    options: [
      'To encrypt the hard disk partitions',
      'To randomize memory positions of key data areas (stack, heap, libraries)',
      'To increase CPU clock speed',
      'To monitor network packets'
    ],
    correctIndex: 1,
    explanation: 'ASLR randomizes memory addresses so attackers cannot reliably jump to specific exploit functions.'
  },
  {
    id: 'q-7',
    category: 'Indian Cyber Law',
    question: 'Which section of the Indian IT Act 2000 specifically deals with Identity Theft (stealing passwords or digital signatures)?',
    options: ['Section 43', 'Section 65', 'Section 66C', 'Section 67'],
    correctIndex: 2,
    explanation: 'Section 66C covers identity theft and imposes up to 3 years imprisonment.'
  },
  {
    id: 'q-8',
    category: 'Web Security',
    question: 'Which technique is the primary, bulletproof defense against SQL Injection in relational databases?',
    options: [
      'Blacklisting single quotes',
      'Prepared Statements / Parameterized Queries',
      'Base64 encoding all inputs',
      'Limiting input length to 10 characters'
    ],
    correctIndex: 1,
    explanation: 'Parameterized queries ensure the database treats inputs strictly as data, never as executable code.'
  }
];

// ─────────────────────────────────────────────────────────────
// 8. 30-DAY BOOTCAMP STRUCTURED SYLLABUS
// ─────────────────────────────────────────────────────────────
export interface BootcampDay {
  day: number;
  phase: 'Phase 1: Foundations' | 'Phase 2: Defensive Tooling' | 'Phase 3: Web Security' | 'Phase 4: Blue Team & Certs';
  title: string;
  duration: string;
  topics: string[];
  practicalTask: string;
}

export const BOOTCAMP_30_DAYS: BootcampDay[] = [
  {
    day: 1,
    phase: 'Phase 1: Foundations',
    title: 'Networking 101: IP, Subnets & OSI Model',
    duration: '30 mins',
    topics: ['OSI 7 Layers vs TCP/IP 4 Layers', 'IPv4 Addressing & CIDR Notation', 'Private IP ranges (RFC 1918)'],
    practicalTask: 'Run `ip a` and `traceroute google.com` in your terminal and map each hop.'
  },
  {
    day: 2,
    phase: 'Phase 1: Foundations',
    title: 'TCP Handshake & Port Scanning Concepts',
    duration: '30 mins',
    topics: ['SYN, SYN-ACK, ACK handshake', 'Common ports (21, 22, 53, 80, 443, 3389)', 'How firewalls drop vs reject'],
    practicalTask: 'Inspect TCP flags in Wireshark or view the animated simulator in Module 2.'
  },
  {
    day: 3,
    phase: 'Phase 1: Foundations',
    title: 'Linux CLI Essentials for Security',
    duration: '30 mins',
    topics: ['File permissions (chmod, chown, SUID)', 'grep, sed, awk log parsing', 'Systemctl and process management'],
    practicalTask: 'Search for all `.conf` files modified in the last 24 hours on Linux.'
  },
  {
    day: 4,
    phase: 'Phase 1: Foundations',
    title: 'Home Lab Setup: VirtualBox & Kali',
    duration: '30 mins',
    topics: ['Hypervisors (Type 1 vs Type 2)', 'Host-only vs NAT network adapters', 'Installing Kali Linux cleanly'],
    practicalTask: 'Configure a VirtualBox VM with an isolated host-only network.'
  },
  {
    day: 5,
    phase: 'Phase 1: Foundations',
    title: 'Cryptography: Hashing vs Encryption',
    duration: '30 mins',
    topics: ['One-way hashes (SHA-256, bcrypt)', 'Symmetric AES-GCM', 'Salting passwords against rainbow tables'],
    practicalTask: 'Calculate SHA-256 of your name and see how changing 1 letter changes all 64 characters (Avalanche Effect).'
  },
  {
    day: 10,
    phase: 'Phase 2: Defensive Tooling',
    title: 'HTTP Security Headers & Cookies',
    duration: '30 mins',
    topics: ['CSP (Content Security Policy)', 'HSTS (HTTP Strict Transport Security)', 'HttpOnly, Secure, SameSite'],
    practicalTask: 'Audit security headers on your favorite bank website using browser DevTools Network tab.'
  },
  {
    day: 15,
    phase: 'Phase 3: Web Security',
    title: 'SQL Injection: Flaws & Prepared Statements',
    duration: '30 mins',
    topics: ['SQL syntax break-out', 'In-band vs Blind SQLi', 'Prepared statements code implementation'],
    practicalTask: 'Test the Visual SQLi simulator and inspect how parameters prevent execution.'
  },
  {
    day: 20,
    phase: 'Phase 3: Web Security',
    title: 'Cross-Site Scripting (XSS) & Context Encoding',
    duration: '30 mins',
    topics: ['Stored vs Reflected vs DOM XSS', 'Session cookie theft', 'Context-aware HTML entity encoding'],
    practicalTask: 'Explain why `innerHTML` is dangerous compared to `textContent` in modern JS.'
  },
  {
    day: 25,
    phase: 'Phase 4: Blue Team & Certs',
    title: 'SOC Operations & Log Analysis',
    duration: '30 mins',
    topics: ['SIEM architecture', 'Detecting brute force in auth.log', 'Incident containment playbooks'],
    practicalTask: 'Parse sample web server logs and identify IP addresses making 404 scans.'
  },
  {
    day: 30,
    phase: 'Phase 4: Blue Team & Certs',
    title: 'Career Roadmap & Certification Plan',
    duration: '30 mins',
    topics: ['Security+ vs eJPT vs OSCP', 'Building a GitHub security portfolio', 'Responsible Disclosure ethics'],
    practicalTask: 'Draft your 6-month cybersecurity learning schedule and register for TryHackMe.'
  }
];
