// Authoritative CyberCrime Matrix Reference Data, Protocol Specifications, Case Studies, and Legal Provisions

export interface ProtocolSpec {
  name: string;
  rfcOrStandard: string;
  layer: string;
  overview: string;
  vulnerabilityDetails: string;
  packetStructure: { field: string; size: string; purpose: string }[];
  blueTeamCountermeasure: string;
}

export interface CyberCaseStudy {
  id: string;
  title: string;
  victim: string;
  year: number;
  financialOrDataLoss: string;
  attackVector: string;
  timeline: { step: string; timestamp: string; detail: string }[];
  technicalBreakdown: string;
  lessonLearned: string;
}

export interface LegalStatute {
  code: string;
  title: string;
  applicability: string;
  penalty: string;
  bnsEquivalent?: string;
  practicalFilingTip: string;
}

export interface SelfAuditQuestion {
  id: string;
  category: string;
  question: string;
  options: { label: string; scoreImpact: number; advice: string }[];
}

// -------------------------------------------------------------
// 1. SS7 & TELECOM PROTOCOL SPECIFICATIONS
// -------------------------------------------------------------
export const SS7_PROTOCOL_SPECS: ProtocolSpec[] = [
  {
    name: 'MAP_SEND_ROUTING_INFO_FOR_SM (SRI4SM)',
    rfcOrStandard: '3GPP TS 29.002 / ITU-T Q.773',
    layer: 'Application Layer (TCAP / MAP)',
    overview: 'Used by SMS Centers (SMSC) to query the subscriber Home Location Register (HLR) for the current routing address (MSC/VLR) and IMSI.',
    vulnerabilityDetails: 'SS7 assumes all interconnect peers are trustworthy state telcos. Any rogue operator or rented SS7 global title can query any mobile number globally and obtain their IMSI and active MSC address without subscriber knowledge.',
    packetStructure: [
      { field: 'MSISDN', size: 'Variable (BCD)', purpose: 'Subscriber telephone number in E.164 format (+91...)' },
      { field: 'SM-RP-PRI', size: '1 Byte', purpose: 'Short Message Reference Priority indicator' },
      { field: 'ServiceCentreAddress', size: 'Variable', purpose: 'Originating SMS Center global title' },
      { field: 'GMSC Address', size: 'Variable', purpose: 'Gateway MSC routing address' }
    ],
    blueTeamCountermeasure: 'Deploy SS7 SMS Firewall filtering SRI4SM packets from unvetted foreign Global Titles (GTs) that lack roaming bilateral agreements.'
  },
  {
    name: 'MAP_UPDATE_LOCATION (UL)',
    rfcOrStandard: '3GPP TS 29.002',
    layer: 'Mobility Management (MAP)',
    overview: 'Notifies the HLR that a subscriber has moved into a new Visited Location Register (VLR) area.',
    vulnerabilityDetails: 'Attacker injects a fraudulent UpdateLocation request with an attacker-controlled VLR address. The HLR transfers subscriber session pointers, diverting all incoming voice calls and SMS OTPs to the attacker network.',
    packetStructure: [
      { field: 'IMSI', size: '8 Bytes', purpose: 'International Mobile Subscriber Identity' },
      { field: 'Target VLR Number', size: 'Variable', purpose: 'Address of visitor location register where SIM is claimed active' },
      { field: 'HLR Number', size: 'Variable', purpose: 'Destination database storing permanent subscriber profile' },
      { field: 'LMSI', size: '4 Bytes', purpose: 'Local Mobile Station Identity for fast paging' }
    ],
    blueTeamCountermeasure: 'Velocity checks (Impossible Travel Detection: if phone was in Delhi 10 minutes ago, reject UpdateLocation from London) and Home Routing SMS.'
  }
];

// -------------------------------------------------------------
// 2. EMAIL PROTOCOL SUITE (SPF, DKIM, DMARC, BIMI)
// -------------------------------------------------------------
export const EMAIL_SECURITY_STANDARDS = {
  spf: {
    rfc: 'RFC 7208',
    title: 'Sender Policy Framework (SPF)',
    mechanisms: [
      { prefix: 'ip4:x.x.x.x/24', desc: 'Authorizes explicit IPv4 range to dispatch email on behalf of domain.' },
      { prefix: 'include:_spf.google.com', desc: 'Recursively includes authorized IP records from third-party vendor (e.g. Google Workspace).' },
      { prefix: '-all (HardFail)', desc: 'Strict mode: Any IP not listed is definitively rejected as counterfeit.' },
      { prefix: '~all (SoftFail)', desc: 'Permissive mode: Unlisted IPs are tagged with questionable header and routed to spam.' },
      { prefix: '+all (Pass All)', desc: 'FATAL MISCONFIGURATION: Authorizes any server in the world to spoof this domain.' }
    ],
    limitations: 'SPF only validates the Return-Path (RFC 5321.MailFrom), NOT the visible header From: address displayed to users in Gmail or Outlook!'
  },
  dkim: {
    rfc: 'RFC 6376',
    title: 'DomainKeys Identified Mail (DKIM)',
    overview: 'Employs asymmetric cryptography (RSA-2048 or Ed25519) to sign specified email headers and body contents.',
    headerFields: [
      { tag: 'v=1', desc: 'DKIM specification version.' },
      { tag: 'a=rsa-sha256', desc: 'Cryptographic hashing and signing algorithm.' },
      { tag: 'd=company.com', desc: 'Signing domain whose public key is fetched from DNS.' },
      { tag: 's=selector1', desc: 'Selector pointing to specific DNS TXT record (selector1._domainkey.company.com).' },
      { tag: 'bh=...', desc: 'Base64 encoded SHA-256 digest of email body.' },
      { tag: 'b=...', desc: 'RSA digital signature of selected headers and body hash.' }
    ]
  },
  dmarc: {
    rfc: 'RFC 7489',
    title: 'Domain-based Message Authentication, Reporting & Conformance (DMARC)',
    overview: 'Bridges SPF and DKIM by enforcing Identifier Alignment with the visible From: header and defining enforcement policies.',
    policies: [
      { policy: 'p=none', action: 'Monitoring Only', desc: 'No enforcement. Receivers accept spoofed emails and dispatch aggregate XML telemetry.' },
      { policy: 'p=quarantine', action: 'Spam Routing', desc: 'Receivers drop unaligned emails into Spam / Junk folder.' },
      { policy: 'p=reject', action: 'Immediate Rejection (550)', desc: 'Receivers bounce spoofed messages at SMTP connection level. Gold standard.' }
    ]
  },
  bimi: {
    title: 'Brand Indicators for Message Identification (BIMI)',
    overview: 'Requires DMARC at p=reject or p=quarantine (pct=100) + Verified Mark Certificate (VMC) from DigiCert/Entrust to render verified official brand logo in Gmail/Apple Mail.'
  }
};

// -------------------------------------------------------------
// 3. REAL-WORLD CASE STUDIES & FORENSIC TIMELINES
// -------------------------------------------------------------
export const CASE_STUDIES: CyberCaseStudy[] = [
  {
    id: 'jack-dorsey',
    title: 'Jack Dorsey (Twitter CEO) SIM Swap Incident',
    victim: 'Jack Dorsey / Twitter Inc.',
    year: 2019,
    financialOrDataLoss: 'Compromise of official account with 4.2M followers; unauthorized offensive tweets broadcasted.',
    attackVector: 'Carrier Social Engineering + SIM Swap (AT&T store bypass)',
    timeline: [
      { step: 'Reconnaissance', timestamp: 'Day 0', detail: 'Chuckling Squad hackers identified Dorsey phone number tied to Twitter SMS short-code dispatch.' },
      { step: 'Carrier Bribery/Deception', timestamp: 'Day 1 - 14:15', detail: 'Hackers called AT&T customer care / visited retail branch pretending to be Dorsey with lost phone, executing unauthorized SIM swap.' },
      { step: 'Deregistration', timestamp: 'Day 1 - 14:18', detail: 'Dorsey physical smartphone showed "No Service".' },
      { step: 'Execution via Cloudhopper', timestamp: 'Day 1 - 14:22', detail: 'Attackers dispatched text messages to Twitter SMS gateway (40404), which automatically published tweets to his profile without entering account password.' },
      { step: 'Containment', timestamp: 'Day 1 - 15:00', detail: 'Twitter engineering revoked Cloudhopper SMS posting permissions globally for all accounts.' }
    ],
    technicalBreakdown: 'The account was not hacked through a database password breach. The vulnerability was reliance on an unauthenticated SMS gateway (Cloudhopper) paired with telecom SIM swap vulnerability.',
    lessonLearned: 'Decouple critical services from SMS. Never use telephone numbers as identity authenticators for privileged administrative accounts.'
  },
  {
    id: 'metro-bank-ss7',
    title: 'UK Metro Bank SS7 Cyber Heist',
    victim: 'Metro Bank Customers (United Kingdom)',
    year: 2019,
    financialOrDataLoss: 'Millions of British Pounds drained from customer savings accounts.',
    attackVector: 'Commercial SS7 Signaling Network Exploitation',
    timeline: [
      { step: 'Phishing Credentials', timestamp: 'Phase 1', detail: 'Cybercrime gang obtained banking usernames and static passwords via Dridex malware.' },
      { step: 'SS7 Interconnect Lease', timestamp: 'Phase 2', detail: 'Attackers purchased access to SS7 signaling network via an overseas telecom provider.' },
      { step: 'Rerouting OTP Traffic', timestamp: 'Phase 3', detail: 'Dispatched SS7 MAP UpdateLocation signals to reroute customers SMS traffic through attacker rogue gateway.' },
      { step: 'Funds Exfiltration', timestamp: 'Phase 4', detail: 'Transferred funds via faster payments while real customers were asleep and unaware of missing SMS.' }
    ],
    technicalBreakdown: 'Attackers exploited the 40-year-old lack of authentication in SS7 inter-carrier routing. No physical SIM swap was performed; the carrier network itself was manipulated in real time.',
    lessonLearned: 'Banks must discontinue SMS-based OTPs for wire transfer authorization and mandate in-app FIDO2 cryptographic tokens.'
  },
  {
    id: 'jamtara-mewat-syndicate',
    title: 'Jamtara & Mewat Mobile Fraud Syndicates',
    victim: 'Thousands of Indian Bank Customers (SBI, PNB, HDFC)',
    year: 2022,
    financialOrDataLoss: 'Over ₹150+ Crore aggregated annualized losses.',
    attackVector: 'Phishing SMS + Remote Access Trojan APK (AnyDesk/TeamViewer/Custom APK) + UPI Redirection',
    timeline: [
      { step: 'Bulk Smishing Blast', timestamp: 'T+0', detail: 'Syndicate uses SIM Boxes with forged Aadhaar SIMs to send bulk "Electricity Cut / KYC Update" SMS.' },
      { step: 'Call Center Social Engineering', timestamp: 'T+10m', detail: 'Victim calls number; scammer guides victim to install "SBI_Support.apk" from WhatsApp link.' },
      { step: 'Accessibility Overlay', timestamp: 'T+15m', detail: 'Trojan requests Accessibility Service permissions, hiding screen while entering banking app.' },
      { step: 'UPI Auto-Debit Drain', timestamp: 'T+18m', detail: 'Funds transferred via multi-layered mule bank accounts across 4 states within 120 seconds.' }
    ],
    technicalBreakdown: 'Combines psychological panic (power cut tonight), side-loaded APK abusing Android Accessibility permissions, and pre-purchased mule bank accounts.',
    lessonLearned: 'Indian Department of Telecommunications launched the Chakshu and CEIR portals to dismantle these automated SIM box arrays.'
  }
];

// -------------------------------------------------------------
// 4. INDIAN CYBER LAWS & STATUTORY PLAYBOOK (IT ACT & BNS)
// -------------------------------------------------------------
export const LEGAL_PROVISIONS: LegalStatute[] = [
  {
    code: 'IT Act 2000 · Section 66C',
    title: 'Punishment for Identity Theft',
    applicability: 'Fraudulently or dishonestly making use of electronic signature, password or any other unique identification feature (e.g. SIM swap, stolen OTP, spoofed biometric).',
    penalty: 'Imprisonment up to 3 years AND fine up to ₹1,00,000.',
    bnsEquivalent: 'Bharatiya Nyaya Sanhita (BNS) Section 318(4) - Cheating by Personation',
    practicalFilingTip: 'Attach telecom CDR (Call Detail Record), SMS logs showing time of service disconnection, and bank transaction statements to substantiate identity takeover.'
  },
  {
    code: 'IT Act 2000 · Section 66D',
    title: 'Cheating by Personation using Computer Resource',
    applicability: 'Cheating by personating any individual or institution via phone, email, voice clone, or computer system (e.g., Deepfake CEO call, spoofed bank executive).',
    penalty: 'Imprisonment up to 3 years AND fine up to ₹1,00,000.',
    bnsEquivalent: 'BNS Section 319 - Cheating by Personation',
    practicalFilingTip: 'Save audio recording of synthetic voice call, caller number, and UPI transaction IDs immediately.'
  },
  {
    code: 'IT Act 2000 · Section 43',
    title: 'Penalty & Compensation for Damage to Computer System',
    applicability: 'Accessing, downloading, introducing computer contaminants, viruses, Trojans (RAT), or disrupting access without owner authorization.',
    penalty: 'Civil compensation up to ₹1 Crore payable directly to victim.',
    practicalFilingTip: 'Request Cyber Cell to seize device memory dump under Section 80 of IT Act for digital forensic preservation.'
  },
  {
    code: 'IT Act 2000 · Section 66F',
    title: 'Punishment for Cyber Terrorism',
    applicability: 'Attacking critical national infrastructure, telecom SS7 routing hubs, or financial transmission backbones threatening national sovereignty.',
    penalty: 'Life Imprisonment (Non-bailable).',
    practicalFilingTip: 'Invoked by State Cyber Police / National Cyber Crime Coordination Centre (I4C) when syndicate targets banking grids.'
  }
];

// -------------------------------------------------------------
// 5. STEP-BY-STEP INCIDENT RESPONSE PROTOCOL
// -------------------------------------------------------------
export const INCIDENT_RESPONSE_PLAYBOOK = {
  goldenHourActions: [
    {
      minute: '0 - 5 Min',
      title: 'Dial 1930 Cyber Fraud Helpline',
      action: 'Call the Citizen Financial Cyber Fraud Reporting Management System (1930). Report transaction ID, debit bank, and beneficiary account. Police freeze funds at nodal banks before cash withdrawal at ATM.'
    },
    {
      minute: '5 - 15 Min',
      title: 'Block Telecom Number & Freeze Net-Banking',
      action: 'Borrow any phone, call your telecom provider (Jio 198, Airtel 121, Vi 199), report SIM Swap, and place an emergency SIM freeze. Log into net-banking and freeze UPI IDs / debit cards.'
    },
    {
      minute: '15 - 30 Min',
      title: 'File Formal e-FIR on cybercrime.gov.in',
      action: 'Upload screenshot of bank SMS, call log, transaction UTR number, and suspect mobile number on the National Cyber Crime Reporting Portal under "Financial Fraud".'
    },
    {
      minute: '30 - 60 Min',
      title: 'Notify Home Bank Branch in Writing',
      action: 'Submit a physical letter with FIR acknowledgement copy under RBI Zero Liability Policy (RBI/2017-18/15 DBR.No.Leg.BC.78/09.07.005/2017-18). If reported within 3 days, customer has zero liability for unauthorized electronic banking transactions.'
    }
  ]
};

// -------------------------------------------------------------
// 6. THREAT SELF-AUDIT QUESTIONS (RISK CALCULATOR)
// -------------------------------------------------------------
export const SELF_AUDIT_QUESTIONS: SelfAuditQuestion[] = [
  {
    id: 'q1',
    category: 'Authentication',
    question: 'How do you receive 2FA codes for your primary email and bank accounts?',
    options: [
      { label: 'SMS text message to my phone number', scoreImpact: 35, advice: 'CRITICAL: Switch immediately to TOTP apps (Aegis, 2FAS, Google Authenticator) or hardware YubiKeys.' },
      { label: 'In-app push notifications or Authenticator App', scoreImpact: 10, advice: 'GOOD: Resistant to SIM Swap attacks.' },
      { label: 'Hardware FIDO2 Security Key (YubiKey / Titan)', scoreImpact: 0, advice: 'EXCELLENT: Maximum protection against SIM swap and advanced phishing.' }
    ]
  },
  {
    id: 'q2',
    category: 'Telecom Hardening',
    question: 'Have you requested a verbal Port-Freeze PIN / Password with your telecom operator?',
    options: [
      { label: 'No, never set a carrier verbal PIN', scoreImpact: 30, advice: 'Call customer support and request a verbal password required before any SIM replacement or port-out.' },
      { label: 'Yes, my carrier account requires a verbal security passcode', scoreImpact: 0, advice: 'EXCELLENT: Prevents rogue carrier reps from swapping your SIM without your verbal code.' }
    ]
  },
  {
    id: 'q3',
    category: 'Social Media & OSINT',
    question: 'Are your pet names, birthday, childhood school, and family photos publicly visible online?',
    options: [
      { label: 'Yes, public Instagram / Facebook profiles', scoreImpact: 25, advice: 'HIGH RISK: Attackers easily harvest these to bypass security recovery questions. Set profiles to private.' },
      { label: 'Private profiles, but I occasionally post personal milestones', scoreImpact: 10, advice: 'Moderate: Never use real life facts for banking password recovery questions.' },
      { label: 'Completely private, and I use random passwords for security questions', scoreImpact: 0, advice: 'EXCELLENT OPSEC discipline.' }
    ]
  },
  {
    id: 'q4',
    category: 'Family Verification',
    question: 'Do you and your family have an agreed offline emergency codeword to detect AI voice clones?',
    options: [
      { label: 'No, we have no safe word', scoreImpact: 20, advice: 'Agree on a secret family keyword today (e.g., favorite fruit, secret word) that AI voice clones cannot know.' },
      { label: 'Yes, we have an established secret challenge question/code', scoreImpact: 0, advice: 'EXCELLENT: Neutralizes emergency hospital/accident deepfake audio scams.' }
    ]
  }
];
