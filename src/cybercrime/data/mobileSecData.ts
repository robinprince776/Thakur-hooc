// Authoritative Mobile Security Reference Data, Telecom DLT Specifications, Android Internals, and Anti-Theft Infrastructure

export interface DltHeaderInfo {
  prefix: string;
  carrier: string;
  circle: string;
  validFormat: string;
  example: string;
  notes: string;
}

export interface AndroidPermissionSpec {
  permission: string;
  protectionLevel: 'Normal' | 'Dangerous' | 'Signature' | 'Special App Access';
  threatDescription: string;
  howTrojansAbuse: string;
  legitUseCases: string;
  recommendedAuditingAction: string;
}

export interface AdbCommandReference {
  command: string;
  category: 'Recon' | 'Forensics' | 'Hardening' | 'Malware Analysis';
  description: string;
  sampleOutput: string;
  threatContext: string;
}

export interface SancharSaathiFeature {
  name: string;
  portalUrl: string;
  purpose: string;
  howItWorks: string;
  userSteps: string[];
}

export interface DeviceHardeningItem {
  id: string;
  category: string;
  title: string;
  importance: 'Critical' | 'High' | 'Medium';
  description: string;
  androidPath: string;
}

export interface ForensicArtifactItem {
  id: string;
  category: 'Telephony & SMS' | 'Contacts & Calls' | 'Browsers & Webview' | 'Messaging & Social' | 'System & Event Logs';
  name: string;
  databaseOrFileName: string;
  absolutePath: string;
  alternativePaths?: string[];
  requiresRoot: boolean;
  format: 'SQLite 3' | 'XML' | 'Text / Ring Buffer' | 'Encrypted SQLite' | 'GZIP Compressed Text' | 'Plaintext Logs';
  primaryTablesOrSections: string[];
  keyInvestigativeFields: { field: string; type: string; purpose: string }[];
  forensicExtractionCommand: string;
  sampleSqlQuery: string;
  forensicValue: string;
  mockSchemaAndRows: {
    columns: string[];
    sampleRows: (string | number)[][];
  };
}

// -------------------------------------------------------------
// 1. TRAI DLT (DISTRIBUTED LEDGER TECHNOLOGY) SMS HEADERS
// -------------------------------------------------------------
export const TRAI_DLT_HEADERS: DltHeaderInfo[] = [
  {
    prefix: 'VK-XXXXXX',
    carrier: 'Vodafone-Idea (V)',
    circle: 'Kolkata (K)',
    validFormat: '2 Alpha prefix + hyphen + 6 Alpha Header',
    example: 'VK-SBIINB',
    notes: 'Approved for State Bank of India transactional alerts dispatched via Vi Kolkata gateway.'
  },
  {
    prefix: 'BZ-XXXXXX',
    carrier: 'Bharat Sanchar Nigam Ltd (B)',
    circle: 'Maharashtra (Z)',
    validFormat: '2 Alpha prefix + hyphen + 6 Alpha Header',
    example: 'BZ-INPOST',
    notes: 'Used for official India Post tracking updates dispatched through BSNL Maharashtra.'
  },
  {
    prefix: 'AX-XXXXXX',
    carrier: 'Airtel (A)',
    circle: 'Delhi NCR (X)',
    validFormat: '2 Alpha prefix + hyphen + 6 Alpha Header',
    example: 'AX-HDFCBK',
    notes: 'Approved HDFC Bank net-banking OTP route through Bharti Airtel Delhi hub.'
  },
  {
    prefix: 'JX-XXXXXX',
    carrier: 'Reliance Jio (J)',
    circle: 'Delhi NCR (X)',
    validFormat: '2 Alpha prefix + hyphen + 6 Alpha Header',
    example: 'JX-ICICIB',
    notes: 'Official ICICI Bank authentication header registered on Jio DLT blockchain.'
  }
];

export const DLT_VULNERABILITY_EXPLANATION = {
  overview: 'The Telecom Regulatory Authority of India (TRAI) mandates blockchain-backed DLT registration for all commercial SMS headers. However, syndicates exploit two primary loopholes:',
  loophole1: 'International SMPP Gateways: Attackers route messages through foreign SMS aggregators that do not enforce Indian DLT scrubbing, injecting arbitrary alphanumeric sender headers.',
  loophole2: 'SIM Box Gateway Farms: Physical hardware racks holding 32 to 128 prepaid SIM cards connected to the GSM network convert internet VoIP smishing packets into direct mobile-to-mobile SMS messages, bypassing regulatory telemarketer scrutiny.',
  loophole3: 'Class 0 / Flash SMS: Attackers mark SMS with TP-PID 0x18. The message bypasses the messaging inbox app entirely and pops up directly over the home screen or active app, creating false authority.'
};

// -------------------------------------------------------------
// 2. ANDROID ARCHITECTURE & DANGEROUS PERMISSIONS MATRIX
// -------------------------------------------------------------
export const ANDROID_PERMISSIONS_MATRIX: AndroidPermissionSpec[] = [
  {
    permission: 'android.permission.BIND_ACCESSIBILITY_SERVICE',
    protectionLevel: 'Special App Access',
    threatDescription: 'Designed for disabled users (screen readers). Grants full visibility of screen DOM elements, user input fields, and the power to simulate taps and gestures.',
    howTrojansAbuse: 'The ultimate Android backdoor. Malware reads bank balances, captures passwords, bypasses 2FA by reading OTPs off the screen, and clicks "Confirm" on funds transfers automatically.',
    legitUseCases: 'TalkBack, screen magnifiers, voice access tools.',
    recommendedAuditingAction: 'Inspect Settings > Accessibility > Downloaded Apps. Revoke any unfamiliar utility (flashlights, cleaners, PDF viewers) immediately!'
  },
  {
    permission: 'android.permission.SYSTEM_ALERT_WINDOW',
    protectionLevel: 'Special App Access',
    threatDescription: 'Permits an application to draw overlay windows on top of any active application.',
    howTrojansAbuse: 'Overlay Attack (Clickjacking): When the user launches a genuine banking app (e.g. YONO or HDFC Mobile), the Trojan instantly overlays a pixel-perfect fake login screen on top, capturing credentials.',
    legitUseCases: 'Facebook Messenger chat heads, Truecaller caller ID popups, video picture-in-picture.',
    recommendedAuditingAction: 'Settings > Apps > Special App Access > Display over other apps. Disable for untrusted utilities.'
  },
  {
    permission: 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
    protectionLevel: 'Special App Access',
    threatDescription: 'Permits an application to intercept, read, and dismiss all system notifications from all apps.',
    howTrojansAbuse: 'Reads incoming banking SMS OTPs and WhatsApp verification codes directly from notifications without requesting READ_SMS.',
    legitUseCases: 'Smartwatch companion apps (Garmin, Galaxy Wearable).',
    recommendedAuditingAction: 'Settings > Apps > Special App Access > Notification Access. Restrict strictly to wearable companions.'
  },
  {
    permission: 'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
    protectionLevel: 'Normal',
    threatDescription: 'Exempts an application from Android Doze Mode and background execution limits.',
    howTrojansAbuse: 'Keeps C2 socket connections, keyloggers, and GPS beacons running 24/7 even when phone is locked in standby.',
    legitUseCases: 'Navigation apps, alarm clocks, fitness trackers.',
    recommendedAuditingAction: 'Settings > Battery > Battery Usage > Unrestricted apps.'
  },
  {
    permission: 'android.permission.READ_SMS & RECEIVE_SMS',
    protectionLevel: 'Dangerous',
    threatDescription: 'Allows app to read stored SMS inbox and intercept incoming text messages.',
    howTrojansAbuse: 'Extracts 6-digit banking and email verification codes and forwards them to attacker C2 servers.',
    legitUseCases: 'Default SMS apps (Google Messages, Samsung Messages).',
    recommendedAuditingAction: 'Google Play policy strictly restricts this permission. Never grant this to flashlight, calculator, or game apps!'
  }
];

// -------------------------------------------------------------
// 3. ADVANCED ADB FORENSIC COMMANDS REFERENCE
// -------------------------------------------------------------
export const ADB_COMMANDS_REFERENCE: AdbCommandReference[] = [
  {
    command: 'adb devices -l',
    category: 'Recon',
    description: 'Lists all connected USB/Wi-Fi debugging targets with hardware model, product code, and device serial.',
    sampleOutput: 'RF8N90XYZ12 device product:e3qxxx model:SM_S928B device:e3q transport_id:1',
    threatContext: 'Verifies whether device is paired. If paired with an untrusted host, the host possesses full command execution authority.'
  },
  {
    command: 'adb shell pm list packages -3',
    category: 'Malware Analysis',
    description: 'Filters and outputs only third-party user-installed packages, skipping system bloatware.',
    sampleOutput: 'package:com.whatsapp\npackage:com.sbi.lotus\npackage:com.hidden.flashlight.pro',
    threatContext: 'Rapidly identifies trojans disguised under innocent names.'
  },
  {
    command: 'adb shell dumpsys package <package_name>',
    category: 'Forensics',
    description: 'Outputs complete package manifest, requested permissions, granted permissions, signatures, and install timestamps.',
    sampleOutput: 'requestedPermissions:\n  android.permission.READ_SMS: granted=true\n  android.permission.BIND_ACCESSIBILITY_SERVICE: granted=true',
    threatContext: 'Reveals exactly which high-risk permissions a suspected malicious app obtained.'
  },
  {
    command: 'adb shell dumpsys accessibility',
    category: 'Malware Analysis',
    description: 'Dumps all currently active accessibility services registered and listening to screen events.',
    sampleOutput: 'Installed: Service[com.trojan/.AccessibilityService, feedbackType=FEEDBACK_GENERIC, flags=FLAG_REPORT_VIEW_IDS]',
    threatContext: 'Immediate proof of a keylogger or overlay Trojan listening to the UI hierarchy.'
  },
  {
    command: 'adb shell screencap -p /sdcard/sc.png && adb pull /sdcard/sc.png',
    category: 'Forensics',
    description: 'Captures hardware framebuffer directly to file without showing any visual indicator or notification to phone user.',
    sampleOutput: '/sdcard/sc.png: 1 file pulled, 0 skipped. 28.4 MB/s (3412098 bytes in 0.114s)',
    threatContext: 'Attackers exploit this during Juice Jacking to photograph user banking apps, chats, and private media.'
  },
  {
    command: 'adb shell pm revoke <package_name> <permission>',
    category: 'Hardening',
    description: 'Remotely strips dangerous permissions from an app via ADB shell.',
    sampleOutput: 'Success',
    threatContext: 'Used by digital forensics investigators to disarm active malware before full uninstallation.'
  },
  {
    command: 'adb shell getprop ro.crypto.state',
    category: 'Hardening',
    description: 'Queries hardware encryption status of Android user data partition.',
    sampleOutput: 'encrypted (File-Based Encryption - FBE with AES-256-XTS)',
    threatContext: 'Confirms cryptographic privacy of stored data against chip-off physical extraction.'
  }
];

// -------------------------------------------------------------
// 4. SANCHAR SAATHI & GOVERNMENT ANTI-THEFT INITIATIVES
// -------------------------------------------------------------
export const SANCHAR_SAATHI_MODULES: SancharSaathiFeature[] = [
  {
    name: 'CEIR (Central Equipment Identity Register)',
    portalUrl: 'ceir.sancharsaathi.gov.in',
    purpose: 'Blocks stolen/lost mobile phones across all telecom networks in India and aids police tracing.',
    howItWorks: 'Every mobile has unique 15-digit IMEI. When blocked on CEIR, the IMEI is added to a centralized national EIR blacklist. Even if a thief formats the phone or inserts a new SIM card (Jio/Airtel/Vi/BSNL), the network rejects connection and generates a real-time tower triangulation alert to police.',
    userSteps: [
      'File police complaint / online loss report and get NCR / FIR number.',
      'Block lost SIM card and obtain duplicate SIM with same phone number from telecom store (needed for OTP).',
      'Visit ceir.gov.in > Request for Blocking Lost/Stolen Mobile.',
      'Enter IMEI 1, IMEI 2, purchase invoice, police report copy, and identity proof.',
      'Phone is blocked nationally within 24 hours. When found, use "Unblock Found Mobile" to restore service.'
    ]
  },
  {
    name: 'TAFCOP (Telecom Analytics for Fraud Management)',
    portalUrl: 'tafcop.sancharsaathi.gov.in',
    purpose: 'Allows any citizen to check how many mobile numbers are registered in their name using their Aadhaar/ID.',
    howItWorks: 'Searches carrier KYC databases across all Indian LSAs. Helps identify fraudulent SIM cards issued by rogue agents using your documents.',
    userSteps: [
      'Visit tafcop.sancharsaathi.gov.in and enter your active mobile number.',
      'Enter OTP received.',
      'Review all numbers linked to your identity. If any number is unfamiliar, check "Not My Number" and submit report.',
      'Telecom company investigates and deactivates the unauthorized SIM.'
    ]
  },
  {
    name: 'Chakshu (Reporting Suspected Fraud Communication)',
    portalUrl: 'sancharsaathi.gov.in/sfc',
    purpose: 'Reporting malicious calls, SMS, and WhatsApp messages related to KYC expiration, electricity cut, lottery, or sextortion.',
    howItWorks: 'Aggregates threat intelligence for the Indian Cyber Crime Coordination Centre (I4C). Telecommunication service providers cancel connections and seize IMEIs of repeat offenders.',
    userSteps: [
      'Take screenshot of phishing SMS / WhatsApp conversation.',
      'Visit Chakshu portal > Report Suspected Fraud Communication.',
      'Select category (e.g. Bank KYC / Electricity / Fake Job / Sextortion).',
      'Upload screenshot and suspect phone number/alphanumeric header.'
    ]
  }
];

// -------------------------------------------------------------
// 5. MASTER 10-FACTOR DEVICE HARDENING CHECKLIST
// -------------------------------------------------------------
export const DEVICE_HARDENING_ITEMS: DeviceHardeningItem[] = [
  {
    id: 'sim_pin',
    category: 'Telecom & Hardware',
    title: 'Enable Physical SIM PIN Lock',
    importance: 'Critical',
    description: 'Sets a 4-digit PIN required upon phone boot or when SIM is inserted into any device. Prevents thieves from swapping your SIM to another phone to receive banking OTPs.',
    androidPath: 'Settings > Security & Privacy > More Security Settings > SIM card lock > Lock SIM card.'
  },
  {
    id: 'usb_debug',
    category: 'Hardware Ports',
    title: 'Disable Developer Options & USB Debugging',
    importance: 'Critical',
    description: 'Neutralizes Juice Jacking at public airport charging kiosks and prevents unauthorized ADB access without passcode.',
    androidPath: 'Settings > Developer options > Toggle OFF.'
  },
  {
    id: 'lockscreen_notifications',
    category: 'Privacy',
    title: 'Hide Sensitive Content on Lock Screen',
    importance: 'High',
    description: 'Prevents strangers from seeing 6-digit OTPs on your lock screen while phone is unattended.',
    androidPath: 'Settings > Notifications > Lock screen notifications > Hide content.'
  },
  {
    id: 'auto_wifi_join',
    category: 'Wireless Security',
    title: 'Disable Auto-Join Open Wi-Fi Networks',
    importance: 'High',
    description: 'Stops your smartphone from automatically associating with malicious Wi-Fi Pineapples (Evil Twin APs) advertising "Starbucks_Free_WiFi" or "Airport_WiFi".',
    androidPath: 'Settings > Wi-Fi > Advanced / Network preferences > Turn off Auto-connect.'
  },
  {
    id: 'accessibility_audit',
    category: 'OS Permissions',
    title: 'Audit Downloaded Accessibility Services',
    importance: 'Critical',
    description: 'Ensure only trusted screen readers have Accessibility privileges. Revoke any flashlight, scanner, or utility tools.',
    androidPath: 'Settings > Accessibility > Downloaded apps.'
  },
  {
    id: 'find_my_device',
    category: 'Anti-Theft',
    title: 'Turn on Google Find My Device (Offline Network)',
    importance: 'High',
    description: 'Enables encrypted Bluetooth proximity tracking so your phone can be located by nearby Android devices even when disconnected from internet or powered off.',
    androidPath: 'Settings > Google > Find My Device > Find your offline devices > High traffic / All areas.'
  },
  {
    id: 'install_unknown_apps',
    category: 'App Security',
    title: 'Block "Install Unknown Apps" for WhatsApp & Chrome',
    importance: 'Critical',
    description: 'Prevents malicious APKs received via WhatsApp chats or malicious browser downloads from installing without explicit warning.',
    androidPath: 'Settings > Apps > Special App Access > Install unknown apps > Toggle OFF for all apps.'
  },
  {
    id: 'screen_pinning',
    category: 'Physical Privacy',
    title: 'Enable App Pinning (Guided Access)',
    importance: 'Medium',
    description: 'Locks the phone to a single application when handing your phone to a stranger (e.g. to make an emergency call) so they cannot snoop into photos or banking apps.',
    androidPath: 'Settings > Security & Privacy > More Security Settings > App pinning.'
  }
];

// -------------------------------------------------------------
// 6. ANDROID FORENSIC ARTIFACTS INVESTIGATION REGISTRY
// -------------------------------------------------------------
export const FORENSIC_ARTIFACTS: ForensicArtifactItem[] = [
  {
    id: 'sms_mmssms',
    category: 'Telephony & SMS',
    name: 'SMS & MMS Telephony Provider Database',
    databaseOrFileName: 'mmssms.db',
    absolutePath: '/data/data/com.android.providers.telephony/databases/mmssms.db',
    alternativePaths: [
      '/data/user/0/com.android.providers.telephony/databases/mmssms.db',
      '/data/data/com.google.android.apps.messaging/databases/bugle_db (Google Messages)'
    ],
    requiresRoot: true,
    format: 'SQLite 3',
    primaryTablesOrSections: ['sms', 'pdu', 'threads', 'canonical_addresses', 'words'],
    keyInvestigativeFields: [
      { field: '_id', type: 'INTEGER', purpose: 'Primary sequence key for message' },
      { field: 'address', type: 'TEXT', purpose: 'Phone number or DLT sender ID (e.g. VK-SBIINB)' },
      { field: 'date', type: 'INTEGER (Epoch ms)', purpose: 'Timestamp when device received message' },
      { field: 'date_sent', type: 'INTEGER (Epoch ms)', purpose: 'Timestamp when carrier SMSC dispatched message' },
      { field: 'read', type: 'INTEGER (0/1)', purpose: '0 = unread, 1 = read (proves if victim opened OTP)' },
      { field: 'type', type: 'INTEGER', purpose: '1=Inbox, 2=Sent, 3=Draft, 4=Outbox, 5=Failed' },
      { field: 'body', type: 'TEXT', purpose: 'Full plaintext message content (links, OTPs, scam text)' },
      { field: 'service_center', type: 'TEXT', purpose: 'SMSC phone number (proves originating telecom circle)' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/data/com.android.providers.telephony/databases/mmssms.db /sdcard/mmssms.db && chmod 666 /sdcard/mmssms.db'" && adb pull /sdcard/mmssms.db ./evidence/`,
    sampleSqlQuery: `SELECT _id, address, datetime(date/1000, 'unixepoch', 'localtime') AS received_time, read, body, service_center FROM sms WHERE body LIKE '%OTP%' OR body LIKE '%http%' ORDER BY date DESC LIMIT 20;`,
    forensicValue: 'Essential in financial fraud investigations. Proves exact moment when smishing links were received, whether banking OTPs were read/intercepted, and exposes spoofed alphanumeric sender headers.',
    mockSchemaAndRows: {
      columns: ['_id', 'address', 'received_time', 'type', 'read', 'body', 'service_center'],
      sampleRows: [
        [1042, 'VK-SBIINB', '2024-10-18 10:41:12', '1 (Inbox)', '1 (Read)', 'Dear Customer, your SBI account will be blocked today due to pending KYC. Update PAN: https://sbi-kyc-verify.top/login', '+919822000000'],
        [1043, 'AX-HDFCBK', '2024-10-18 10:44:05', '1 (Inbox)', '1 (Read)', '730195 is your secret OTP for fund transfer of Rs 45,000 to Beneficiary Rohit. Do not share with anyone.', '+919890051914'],
        [1044, '+919876543210', '2024-10-18 10:45:20', '2 (Sent)', '1 (Read)', 'Bhai paise bhej diye check kar', '+919822000000']
      ]
    }
  },
  {
    id: 'contacts_database',
    category: 'Contacts & Calls',
    name: 'Contacts & People Provider Database',
    databaseOrFileName: 'contacts2.db',
    absolutePath: '/data/data/com.android.providers.contacts/databases/contacts2.db',
    alternativePaths: [
      '/data/user/0/com.android.providers.contacts/databases/contacts2.db'
    ],
    requiresRoot: true,
    format: 'SQLite 3',
    primaryTablesOrSections: ['contacts', 'raw_contacts', 'data', 'mimetypes', 'accounts'],
    keyInvestigativeFields: [
      { field: 'display_name', type: 'TEXT', purpose: 'Full name assigned to contact' },
      { field: 'data1', type: 'TEXT', purpose: 'Phone number or email address depending on mimetype' },
      { field: 'mimetype', type: 'TEXT', purpose: 'vnd.android.cursor.item/phone_v2 or email_v2' },
      { field: 'last_time_contacted', type: 'INTEGER (Epoch ms)', purpose: 'Last interaction timestamp' },
      { field: 'times_contacted', type: 'INTEGER', purpose: 'Frequency of interactions' },
      { field: 'account_name', type: 'TEXT', purpose: 'Sync account (e.g. victim@gmail.com, WhatsApp)' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/data/com.android.providers.contacts/databases/contacts2.db /sdcard/contacts2.db && chmod 666 /sdcard/contacts2.db'" && adb pull /sdcard/contacts2.db ./evidence/`,
    sampleSqlQuery: `SELECT raw_contacts.display_name, data.data1 AS phone_or_email, mimetypes.mimetype, datetime(raw_contacts.last_time_contacted/1000, 'unixepoch', 'localtime') AS last_interaction FROM data JOIN raw_contacts ON data.raw_contact_id = raw_contacts._id JOIN mimetypes ON data.mimetype_id = mimetypes._id WHERE mimetypes.mimetype IN ('vnd.android.cursor.item/phone_v2', 'vnd.android.cursor.item/email_v2') ORDER BY raw_contacts.display_name ASC;`,
    forensicValue: 'Critical in Instant Loan Harassment Apps & Spyware cases. Proves which contacts were exfiltrated by the Trojan and identifies communication with known cybercrime syndicate handler numbers.',
    mockSchemaAndRows: {
      columns: ['display_name', 'phone_or_email', 'mimetype', 'times_contacted', 'account_name'],
      sampleRows: [
        ['Papa Personal', '+919811122233', 'phone_v2', 84, 'aarav.sharma@gmail.com'],
        ['Mummy Jio', '+919822233344', 'phone_v2', 61, 'aarav.sharma@gmail.com'],
        ['Electricity Officer (Scam)', '+919876543210', 'phone_v2', 3, 'com.whatsapp'],
        ['College Admin BCA', 'admin@bca.edu.in', 'email_v2', 12, 'aarav.sharma@gmail.com']
      ]
    }
  },
  {
    id: 'call_log_database',
    category: 'Contacts & Calls',
    name: 'Call History & Telephony CallLog Database',
    databaseOrFileName: 'calllog.db',
    absolutePath: '/data/data/com.android.providers.contacts/databases/calllog.db',
    alternativePaths: [
      '/data/user/0/com.android.providers.contacts/databases/calllog.db',
      '/data/data/com.google.android.dialer/databases/dialer.db'
    ],
    requiresRoot: true,
    format: 'SQLite 3',
    primaryTablesOrSections: ['calls', 'voicemail_status'],
    keyInvestigativeFields: [
      { field: 'number', type: 'TEXT', purpose: 'Incoming or outgoing telephone number' },
      { field: 'date', type: 'INTEGER (Epoch ms)', purpose: 'Call connection initiation timestamp' },
      { field: 'duration', type: 'INTEGER (Seconds)', purpose: 'Duration of connected audio call' },
      { field: 'type', type: 'INTEGER', purpose: '1=Incoming, 2=Outgoing, 3=Missed, 4=Voicemail, 5=Rejected, 6=Blocked' },
      { field: 'geocoded_location', type: 'TEXT', purpose: 'Geographical circle (e.g. Delhi, Kolkata, Mumbai)' },
      { field: 'subscription_id', type: 'INTEGER', purpose: 'Identifies which physical SIM slot was used (SIM 1 vs SIM 2)' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/data/com.android.providers.contacts/databases/calllog.db /sdcard/calllog.db && chmod 666 /sdcard/calllog.db'" && adb pull /sdcard/calllog.db ./evidence/`,
    sampleSqlQuery: `SELECT number, datetime(date/1000, 'unixepoch', 'localtime') AS call_time, duration || ' sec' AS duration, CASE type WHEN 1 THEN 'INCOMING' WHEN 2 THEN 'OUTGOING' WHEN 3 THEN 'MISSED' WHEN 5 THEN 'REJECTED' ELSE 'OTHER' END AS direction, geocoded_location FROM calls ORDER BY date DESC LIMIT 20;`,
    forensicValue: 'Establishes caller timeline. Proves whether the victim was actively speaking with a scammer (vishing/social engineering) at the exact moment a fraudulent money transfer was executed.',
    mockSchemaAndRows: {
      columns: ['number', 'call_time', 'duration', 'direction', 'geocoded_location'],
      sampleRows: [
        ['+919876543210', '2024-10-18 10:39:15', '342 sec (5m 42s)', 'INCOMING', 'Mewat, Haryana'],
        ['+919811122233', '2024-10-18 09:12:00', '48 sec', 'OUTGOING', 'Delhi NCR'],
        ['+1800112211', '2024-10-17 18:04:30', '0 sec', 'MISSED', 'Toll Free']
      ]
    }
  },
  {
    id: 'chrome_history',
    category: 'Browsers & Webview',
    name: 'Google Chrome Web History & Downloads Database',
    databaseOrFileName: 'History',
    absolutePath: '/data/data/com.android.chrome/app_chrome/Default/History',
    alternativePaths: [
      '/data/user/0/com.android.chrome/app_chrome/Default/History',
      '/data/data/org.mozilla.firefox/files/mozilla/*.default/places.sqlite (Firefox)',
      '/data/data/com.sec.android.app.sbrowser/app_sbrowser/Default/History (Samsung Internet)'
    ],
    requiresRoot: true,
    format: 'SQLite 3',
    primaryTablesOrSections: ['urls', 'visits', 'downloads', 'downloads_url_chains', 'keyword_search_terms'],
    keyInvestigativeFields: [
      { field: 'url', type: 'TEXT', purpose: 'Full visited URL including GET query parameters and tokens' },
      { field: 'title', type: 'TEXT', purpose: 'HTML title of visited page' },
      { field: 'visit_count', type: 'INTEGER', purpose: 'Total number of visits to this URL' },
      { field: 'last_visit_time', type: 'INTEGER (WebKit Microseconds)', purpose: 'Microseconds since Jan 1, 1601 UTC' },
      { field: 'target_path', type: 'TEXT (downloads table)', purpose: 'Local storage path of downloaded APK / payload' },
      { field: 'received_bytes', type: 'INTEGER (downloads table)', purpose: 'Size of downloaded binary payload' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/data/com.android.chrome/app_chrome/Default/History /sdcard/Chrome_History && chmod 666 /sdcard/Chrome_History'" && adb pull /sdcard/Chrome_History ./evidence/`,
    sampleSqlQuery: `SELECT title, url, visit_count, datetime((last_visit_time/1000000)-11644473600, 'unixepoch', 'localtime') AS visit_time FROM urls WHERE url LIKE '%.top%' OR url LIKE '%.xyz%' OR url LIKE '%login%' ORDER BY last_visit_time DESC LIMIT 25;`,
    forensicValue: 'Direct evidence of phishing navigation. Links the smishing SMS link to browser navigation, proves if victim landed on a fake credential harvesting portal, and tracks malicious APK downloads.',
    mockSchemaAndRows: {
      columns: ['title', 'url', 'visit_count', 'converted_visit_time'],
      sampleRows: [
        ['SBI YONO - Secure NetBanking Portal', 'https://sbi-kyc-verify.top/login.php?ref=sms_1042', 2, '2024-10-18 10:42:01'],
        ['Download Flashlight Pro v3.4.1 APK', 'https://fastapkdownload.xyz/files/torch_v3.apk', 1, '2024-10-18 10:43:18'],
        ['Google Search: Is sbi-kyc-verify legit?', 'https://www.google.com/search?q=is+sbi-kyc-verify+legit', 1, '2024-10-18 10:46:00']
      ]
    }
  },
  {
    id: 'android_browser_history',
    category: 'Browsers & Webview',
    name: 'Stock Android Browser & WebView Database',
    databaseOrFileName: 'history.db',
    absolutePath: '/data/data/com.android.browser/databases/history.db',
    alternativePaths: [
      '/data/data/com.android.browser/databases/browser2.db',
      '/data/user/0/com.android.browser/databases/history.db',
      '/data/data/com.google.android.webview/databases/webview.db'
    ],
    requiresRoot: true,
    format: 'SQLite 3',
    primaryTablesOrSections: ['history', 'bookmarks', 'searches', 'thumbnails'],
    keyInvestigativeFields: [
      { field: '_id', type: 'INTEGER', purpose: 'Sequential unique identifier for browsing record' },
      { field: 'url', type: 'TEXT', purpose: 'Full URL accessed by the default Android browser' },
      { field: 'title', type: 'TEXT', purpose: 'Title of the web document loaded in browser window' },
      { field: 'date', type: 'INTEGER (Epoch ms)', purpose: 'Timestamp when victim navigated to URL' },
      { field: 'visits', type: 'INTEGER', purpose: 'Number of times user re-visited the destination' },
      { field: 'bookmark', type: 'INTEGER (0/1)', purpose: 'Flags whether page was bookmarked by victim' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/data/com.android.browser/databases/history.db /sdcard/history.db && chmod 666 /sdcard/history.db'" && adb pull /sdcard/history.db ./evidence/`,
    sampleSqlQuery: `SELECT _id, title, url, datetime(date/1000, 'unixepoch', 'localtime') AS visit_time, visits FROM history WHERE url LIKE '%http%' ORDER BY date DESC LIMIT 20;`,
    forensicValue: 'Essential when investigating AOSP, custom ROMs, or in-app WebViews. Proves if a smishing link was opened via default stock browser and uncovers spoofed netbanking and lottery pages.',
    mockSchemaAndRows: {
      columns: ['_id', 'title', 'url', 'visit_time', 'visits'],
      sampleRows: [
        [301, 'Electricity Bill Payment - Power Portal', 'http://electricity-bill-discount.online/pay', '2024-10-18 10:42:15', 3],
        [302, 'Claim Lottery Prize Rs. 25,00,000 KBC', 'http://kbc-lucky-winner-2024.club/claim', '2024-10-17 19:15:30', 1],
        [303, 'National Scholarship Portal Login', 'https://scholarships.gov.in', '2024-10-16 14:02:10', 8]
      ]
    }
  },
  {
    id: 'packages_xml',
    category: 'System & Event Logs',
    name: 'Package Manager System Registry',
    databaseOrFileName: 'packages.xml',
    absolutePath: '/data/system/packages.xml',
    alternativePaths: [
      '/data/system/packages.list (Package Name, UID, debuggable flag, data dir)'
    ],
    requiresRoot: true,
    format: 'XML',
    primaryTablesOrSections: ['<package>', '<perms>', '<sigs>', '<shared-user>'],
    keyInvestigativeFields: [
      { field: 'name', type: 'Attribute', purpose: 'Unique Android application package identifier (e.g. com.trojan.app)' },
      { field: 'codePath', type: 'Attribute', purpose: 'Filesystem location of base.apk (e.g. /data/app/~~.../base.apk)' },
      { field: 'it (Install Time)', type: 'Hex Epoch ms', purpose: 'Precise timestamp when APK was first installed' },
      { field: 'ut (Update Time)', type: 'Hex Epoch ms', purpose: 'Timestamp when app was last updated' },
      { field: 'userId', type: 'Integer', purpose: 'Linux UID sandboxing identifier (e.g. 10182)' },
      { field: '<item name="..."/>', type: 'Child Tags', purpose: 'Explicit list of granted runtime and install permissions' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/system/packages.xml /sdcard/packages.xml && chmod 666 /sdcard/packages.xml'" && adb pull /sdcard/packages.xml ./evidence/`,
    sampleSqlQuery: `grep -B 2 -A 10 'com.flashlight.superbright.pro' packages.xml`,
    forensicValue: 'Definitively proves when an unauthorized or sideloaded APK was installed, which user installed it, and confirms which high-risk permissions (SMS, Accessibility, Camera) were active.',
    mockSchemaAndRows: {
      columns: ['package_name', 'userId', 'install_time', 'granted_permissions'],
      sampleRows: [
        ['com.flashlight.superbright.pro', '10214', '2024-10-18 10:43:45', 'READ_SMS, BIND_ACCESSIBILITY_SERVICE, SYSTEM_ALERT_WINDOW'],
        ['com.whatsapp', '10156', '2023-01-14 16:22:10', 'READ_CONTACTS, CAMERA, RECORD_AUDIO'],
        ['com.sbi.lotus', '10190', '2023-05-20 11:15:02', 'ACCESS_FINE_LOCATION, USE_BIOMETRIC']
      ]
    }
  },
  {
    id: 'whatsapp_db',
    category: 'Messaging & Social',
    name: 'WhatsApp Messenger Encrypted & Decrypted Databases',
    databaseOrFileName: 'msgstore.db / wa.db',
    absolutePath: '/data/data/com.whatsapp/databases/msgstore.db',
    alternativePaths: [
      '/sdcard/Android/media/com.whatsapp/WhatsApp/Databases/msgstore.db.crypt14 (External Backup)',
      '/data/data/com.whatsapp/files/key (AES Decryption Key - 158 bytes)'
    ],
    requiresRoot: true,
    format: 'Encrypted SQLite',
    primaryTablesOrSections: ['messages', 'chat', 'jid', 'message_media', 'message_link'],
    keyInvestigativeFields: [
      { field: 'key_remote_jid', type: 'TEXT', purpose: 'Sender/Receiver phone number with country code (e.g. 919876543210@s.whatsapp.net)' },
      { field: 'data', type: 'TEXT', purpose: 'Decrypted message body (threat messages, payment links, fake job offers)' },
      { field: 'timestamp', type: 'INTEGER (Epoch ms)', purpose: 'Timestamp message was created / dispatched' },
      { field: 'received_timestamp', type: 'INTEGER (Epoch ms)', purpose: 'Timestamp message was received by target client' },
      { field: 'media_wa_type', type: 'INTEGER', purpose: '0=Text, 1=Image, 2=Audio, 3=Video, 9=Document/APK' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp /data/data/com.whatsapp/databases/msgstore.db /sdcard/msgstore.db && chmod 666 /sdcard/msgstore.db'" && adb pull /sdcard/msgstore.db ./evidence/`,
    sampleSqlQuery: `SELECT jid.raw_string AS sender, datetime(messages.timestamp/1000, 'unixepoch', 'localtime') AS sent_time, messages.text_data FROM message messages JOIN chat ON messages.chat_row_id = chat._id JOIN jid ON chat.jid_row_id = jid._id WHERE messages.text_data LIKE '%http%' OR messages.text_data LIKE '%INR%' ORDER BY messages.timestamp DESC LIMIT 20;`,
    forensicValue: 'Documents extortion threats, illegal digital arrest scams, part-time job fraud coordination, and shares of weaponized APK payloads sent directly to victim.',
    mockSchemaAndRows: {
      columns: ['sender_jid', 'message_timestamp', 'media_type', 'message_text'],
      sampleRows: [
        ['919988776655@s.whatsapp.net', '2024-10-18 10:20:00', 'Text', 'Part-time Work From Home! Earn Rs. 5000 daily by liking YouTube videos. Click to join HR group.'],
        ['919876543210@s.whatsapp.net', '2024-10-18 10:43:00', 'Document (.apk)', 'Sir install this SBI official update app to resolve KYC immediately: update.apk']
      ]
    }
  },
  {
    id: 'logcat_radio',
    category: 'System & Event Logs',
    name: 'Radio & Baseband Logcat Ring Buffer',
    databaseOrFileName: 'logcat -b radio',
    absolutePath: 'Memory Ring Buffer (/dev/log/radio or /dev/socket/logd)',
    alternativePaths: [
      '/data/misc/rild/ (Radio Interface Layer daemon logs)'
    ],
    requiresRoot: false,
    format: 'Text / Ring Buffer',
    primaryTablesOrSections: ['RIL_REQUEST_SEND_SMS', 'UNSOL_RESPONSE_NEW_SMS', 'RIL_REQUEST_SIGNAL_STRENGTH', 'RIL_UNSOL_ON_USSD'],
    keyInvestigativeFields: [
      { field: 'Timestamp', type: 'String', purpose: 'Month-Day Hour:Min:Sec.Microsecond' },
      { field: 'PID / TID', type: 'Integer', purpose: 'Process and Thread ID of Radio Daemon (rild)' },
      { field: 'Tag', type: 'String', purpose: 'RILJ, RILC, GsmSMSDispatcher, CdmaInboundSmsHandler' },
      { field: 'Raw PDU', type: 'Hex String', purpose: 'Raw 3GPP SMS Protocol Data Unit containing raw bytes' }
    ],
    forensicExtractionCommand: `adb logcat -d -b radio > ./evidence/logcat_radio_dump.txt`,
    sampleSqlQuery: `grep -E 'GsmSMSDispatcher|RIL_REQUEST_SEND_SMS|NEW_SMS' logcat_radio_dump.txt`,
    forensicValue: 'Reconstructs cellular layer actions in memory. Proves if a trojan sent unauthorized premium SMS in the background without launching the messaging app UI, and detects SIM card state changes.',
    mockSchemaAndRows: {
      columns: ['timestamp', 'tag', 'process_id', 'event_message'],
      sampleRows: [
        ['10-18 10:41:11.890', 'RILJ', '2104', '[UNSOL_RESPONSE_NEW_SMS] pdu: 0791919822000000040BA09198222333440000420181011421004A...'],
        ['10-18 10:41:12.102', 'GsmSMSDispatcher', '2104', 'Dispatched SMS to: com.android.providers.telephony (success)'],
        ['10-18 10:44:02.441', 'RILC', '1802', 'RIL_REQUEST_SIGNAL_STRENGTH: rssi=18 (good signal), ber=99']
      ]
    }
  },
  {
    id: 'dropbox_logs',
    category: 'System & Event Logs',
    name: 'Android DropBox Service System & Crash Logs',
    databaseOrFileName: 'DropBoxManager Logs',
    absolutePath: '/data/system/dropbox/',
    alternativePaths: [
      '/data/tombstones/ (Native Crash Memory Dumps)',
      '/data/anr/traces.txt (Application Not Responding Stack Traces)'
    ],
    requiresRoot: true,
    format: 'GZIP Compressed Text',
    primaryTablesOrSections: ['data_app_crash', 'system_server_crash', 'SYSTEM_TOMBSTONE', 'SYSTEM_REBOOT'],
    keyInvestigativeFields: [
      { field: 'Tag', type: 'String', purpose: 'Log event type (e.g. data_app_crash@1729248234000.txt)' },
      { field: 'Timestamp', type: 'Epoch ms in filename', purpose: 'Time event occurred before phone crashed or rebooted' },
      { field: 'Package Name', type: 'Header String', purpose: 'App identifier associated with fatal crash or exploit attempt' },
      { field: 'Stack Trace', type: 'Text / Registers', purpose: 'Memory registers and faulting instructions' }
    ],
    forensicExtractionCommand: `adb shell "su -c 'cp -r /data/system/dropbox /sdcard/dropbox_logs && chmod -R 666 /sdcard/dropbox_logs'" && adb pull /sdcard/dropbox_logs ./evidence/`,
    sampleSqlQuery: `dumpsys dropbox --print data_app_crash`,
    forensicValue: 'Captures crash records when a zero-day exploit or aggressive memory corruption occurs during malware privilege escalation. Proves malicious execution even if malware attempts to delete its own files.',
    mockSchemaAndRows: {
      columns: ['tag_file', 'timestamp', 'process_name', 'cause'],
      sampleRows: [
        ['data_app_crash@1729248225000.txt.gz', '2024-10-18 10:43:45', 'com.flashlight.superbright.pro', 'SIGSEGV (SEGV_MAPERR) in libnative-exploit.so'],
        ['system_app_anr@1729248240000.txt.gz', '2024-10-18 10:44:00', 'com.android.phone', 'Input dispatching timed out (Binder thread exhaustion)'],
        ['SYSTEM_TOMBSTONE@1729248255000.txt.gz', '2024-10-18 10:44:15', 'zygote64', 'Crash backtrace recorded at /data/tombstones/tombstone_01']
      ]
    }
  }
];

