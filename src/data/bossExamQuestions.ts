import { ExamQuestion } from '../components/gamification/FinalBossExamEngine';

export interface ExamTrackInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  passingScore: number;
  durationMinutes: number;
  xpReward: number;
  badgeReward: string;
  questions: ExamQuestion[];
}

export const BOSS_EXAM_TRACKS: ExamTrackInfo[] = [
  {
    id: 'c-mastery-boss',
    title: 'C Programming Grand Master',
    description: 'Comprehensive evaluation of C architecture: Pointers, Memory Allocation, Structures, Bitwise operations, and File I/O.',
    category: 'Computer Science',
    passingScore: 70,
    durationMinutes: 15,
    xpReward: 350,
    badgeReward: 'C Master Certified',
    questions: [
      {
        id: 'c-q1',
        topic: 'Pointers & Memory',
        question: 'What is the exact outcome of executing `int *p = (int*)malloc(sizeof(int)); free(p); *p = 20;`?',
        options: [
          'Memory leak occurs because free does not zero out memory',
          'Undefined behavior due to accessing a dangling pointer',
          'Compilation error because p is no longer an lvalue',
          'Operating system allocates a new memory block at the same address'
        ],
        correctIndex: 1,
        explanation: 'After `free(p)`, the pointer `p` becomes dangling. Dereferencing or assigning through it produces undefined behavior and may cause memory corruption or a segmentation fault.'
      },
      {
        id: 'c-q2',
        topic: 'Operator Precedence',
        question: 'In C, what is the value of `*p++` compared to `(*p)++` when `p` points to an integer array element?',
        options: [
          '`*p++` increments the value pointed to; `(*p)++` increments the address',
          '`*p++` returns `*p` and increments pointer `p`; `(*p)++` increments the value at `*p`',
          'Both expressions have identical semantics and side effects',
          '`*p++` increments both pointer and value simultaneously'
        ],
        correctIndex: 1,
        explanation: 'Due to postfix `++` binding tightly but evaluating after the value is read: `*p++` reads `*p` then increments `p`, while `(*p)++` increments the integer value stored at `p`.'
      },
      {
        id: 'c-q3',
        topic: 'Memory Management',
        question: 'How does `calloc(n, size)` differ fundamentally from `malloc(n * size)`?',
        options: [
          'calloc allocates on the stack, while malloc allocates on heap',
          'calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized',
          'malloc checks for integer overflow during multiplication, while calloc does not',
          'calloc is thread-safe by standard definition whereas malloc is not'
        ],
        correctIndex: 1,
        explanation: '`calloc` clears the memory block to all zero bytes and guards against multiplication overflow during size calculation.'
      },
      {
        id: 'c-q4',
        topic: 'Preprocessor & Macros',
        question: 'Given `#define SQUARE(x) x * x`, what will `SQUARE(2 + 3)` evaluate to in standard C?',
        options: [
          '25',
          '11 (2 + 3 * 2 + 3)',
          'Compilation error due to missing parenthesis',
          '15'
        ],
        correctIndex: 1,
        explanation: 'Macro replacement is textual: `2 + 3 * 2 + 3` = `2 + 6 + 3` = 11. Proper defensive macro definitions require `#define SQUARE(x) ((x) * (x))`.'
      },
      {
        id: 'c-q5',
        topic: 'Data Alignment',
        question: 'In a 64-bit architecture, what is typically `sizeof(struct { char a; int b; double c; })` with default alignment padding?',
        options: [
          '13 bytes',
          '16 bytes (1 + 3 pad + 4 + 8)',
          '24 bytes',
          '8 bytes'
        ],
        correctIndex: 1,
        explanation: 'char requires 1 byte + 3 padding bytes to align `int` (4 bytes) at offset 4, followed by `double` (8 bytes) at offset 8, totalling 1 + 3 + 4 + 8 = 16 bytes.'
      },
      {
        id: 'c-q6',
        topic: 'Storage Classes',
        question: 'What is the scope and lifetime of a variable declared as `static int counter = 0;` inside a function body?',
        options: [
          'Global scope, program lifetime',
          'Block (local) scope, program lifetime',
          'Block scope, function invocation lifetime',
          'File scope, stack lifetime'
        ],
        correctIndex: 1,
        explanation: 'Static local variables have block scope (only visible within that function) but persistent program lifetime (retaining value between calls).'
      },
      {
        id: 'c-q7',
        topic: 'String Handling',
        question: 'Why is `strncpy` considered risky if the destination buffer is smaller than or equal to source length?',
        options: [
          'It always crashes with SIGSEGV',
          'It does not append a null-terminator `\\0` if source exceeds or equals specified count',
          'It copies backwards causing buffer underflows',
          'It frees the destination memory automatically'
        ],
        correctIndex: 1,
        explanation: 'If `strncpy` exhausts `n` bytes before finding a null byte in `src`, it leaves `dest` without a null terminator, risking unbounded reads later.'
      },
      {
        id: 'c-q8',
        topic: 'Bitwise Logic',
        question: 'Which C bitwise expression checks whether an integer `n > 0` is a power of 2?',
        options: [
          '`(n & (n - 1)) == 0`',
          '`(n | (n - 1)) == n`',
          '`(n ^ (n - 1)) == 0`',
          '`(n << 1) == n`'
        ],
        correctIndex: 0,
        explanation: 'A power of 2 in binary has exactly one set bit (e.g. 1000). Subtracting 1 flips all lower bits (0111). Performing bitwise AND yields 0.'
      },
      {
        id: 'c-q9',
        topic: 'File I/O',
        question: 'What is the return value of `fread(buf, sizeof(int), 10, fp)` when only 6 integers are read before EOF?',
        options: [
          'EOF (-1)',
          '24 (number of bytes read)',
          '6 (number of full elements read)',
          '0'
        ],
        correctIndex: 2,
        explanation: '`fread` returns the number of whole objects of the specified size successfully read, which is 6 in this case.'
      },
      {
        id: 'c-q10',
        topic: 'Function Pointers',
        question: 'How do you correctly declare a pointer `fp` to a function taking two `int` parameters and returning `void`?',
        options: [
          '`void *fp(int, int);`',
          '`void (*fp)(int, int);`',
          '`(void*) fp(int, int);`',
          '`void fp*(int, int);`'
        ],
        correctIndex: 1,
        explanation: 'Parentheses around `(*fp)` are mandatory; without them `void *fp(int, int);` declares a function `fp` returning a `void*` pointer.'
      },
      {
        id: 'c-q11',
        topic: 'Const Correctness',
        question: 'What does `const char * const ptr` enforce?',
        options: [
          'Only the data pointed to is read-only',
          'Only the pointer variable is read-only',
          'Both the pointer address and the characters pointed to are immutable',
          'Pointer can be reallocated using realloc'
        ],
        correctIndex: 2,
        explanation: 'The first `const` binds to `char` (immutable data), while the second `const` binds to `ptr` (immutable pointer address).'
      },
      {
        id: 'c-q12',
        topic: 'Recursion & Stack',
        question: 'What primary risk exists with deep recursive functions without tail-call optimization in C?',
        options: [
          'Deadlock on thread mutexes',
          'Call stack overflow (Stack Overflow)',
          'Garbage collector stalls',
          'Integer overflow in program counter'
        ],
        correctIndex: 1,
        explanation: 'Each recursive call pushes a stack frame (parameters, local variables, return address). Deep recursion exhausts stack segment memory, causing stack overflow.'
      },
      {
        id: 'c-q13',
        topic: 'Structures & Unions',
        question: 'What distinguishes a `union` from a `struct` in memory footprint?',
        options: [
          'A union allocates separate non-overlapping memory for each member',
          'All union members share the exact same starting memory address; size equals largest member size',
          'A union cannot hold primitive integer types',
          'A union stores its members on the heap automatically'
        ],
        correctIndex: 1,
        explanation: 'A union allocates memory sized to its largest member, and all members overlap at the same base memory address.'
      },
      {
        id: 'c-q14',
        topic: 'Volatile Keyword',
        question: 'What is the purpose of declaring a variable as `volatile` in embedded or systems C?',
        options: [
          'Instructs compiler to keep variable exclusively in CPU registers',
          'Prevents compiler optimization from caching the value, forcing reads from memory each time',
          'Guarantees thread-safe atomic access without mutexes',
          'Marks variable as constant across translation units'
        ],
        correctIndex: 1,
        explanation: '`volatile` tells the compiler that the variable can be modified externally (e.g. hardware registers, interrupt service routine), prohibiting optimization elision.'
      },
      {
        id: 'c-q15',
        topic: 'Data Types',
        question: 'What is guaranteed by C99 `uint32_t` from `<stdint.h>`?',
        options: [
          'At least 32 bits, but can be 64 bits on x86_64',
          'Exactly 32 unsigned bits with no padding bits',
          'Fastest unsigned integer with at least 32 bits',
          'Signed two\'s complement 32-bit integer'
        ],
        correctIndex: 1,
        explanation: 'Exact-width integer types such as `uint32_t` specify an unsigned integer with precisely 32 bits and 0 padding bits.'
      },
      {
        id: 'c-q16',
        topic: 'Dynamic Memory',
        question: 'What occurs if `realloc(ptr, 0)` is invoked in legacy standard C?',
        options: [
          'It expands the buffer by 0 bytes and returns the original pointer',
          'It deallocates the block equivalent to `free(ptr)` and returns NULL',
          'It triggers a memory allocation fault',
          'It clears all bytes to zeroes'
        ],
        correctIndex: 1,
        explanation: 'Calling `realloc(ptr, 0)` with a valid pointer frees the memory block and returns NULL (or an implementation-defined zero-sized pointer).'
      },
      {
        id: 'c-q17',
        topic: 'Array Indexing',
        question: 'Why does `3[arr]` compile and execute identically to `arr[3]` in C?',
        options: [
          'It is an extension of modern GCC/Clang compilers only',
          'Array subscript operator `a[b]` is defined as `*(a + b)`, which is commutative `*(b + a)`',
          'The parser reorders numeric literals to the back automatically',
          'It accesses the 3rd column of a multidimensional matrix'
        ],
        correctIndex: 1,
        explanation: 'In C standard pointer arithmetic, `arr[i]` expands to `*(arr + i)`. Addition is commutative, so `*(3 + arr)` equals `3[arr]`.'
      },
      {
        id: 'c-q18',
        topic: 'Linkage',
        question: 'What effect does declaring a global variable with `static` at file scope have on its linkage?',
        options: [
          'Gives it external linkage so other `.c` files can access it via extern',
          'Gives it internal linkage, restricting visibility exclusively to that translation unit',
          'Prevents the variable from being loaded into the data segment',
          'Makes the variable thread-local'
        ],
        correctIndex: 1,
        explanation: 'File-scope `static` enforces internal linkage, shielding the symbol from the linker and preventing name collisions across translation units.'
      },
      {
        id: 'c-q19',
        topic: 'Error Handling',
        question: 'Which header and global variable are standard for inspecting system call failure codes in C?',
        options: [
          '`<sys/error.h>` and `errcode`',
          '`<errno.h>` and `errno`',
          '`<stdlib.h>` and `exit_status`',
          '`<signal.h>` and `sigerr`'
        ],
        correctIndex: 1,
        explanation: '`<errno.h>` provides `errno`, set by system calls and library functions upon encountering an error condition.'
      },
      {
        id: 'c-q20',
        topic: 'Compilation Pipeline',
        question: 'In standard C toolchains, what is the correct order of compilation phases?',
        options: [
          'Assembler -> Preprocessor -> Compiler -> Linker',
          'Preprocessor -> Compiler (Syntactic/Semantic) -> Assembler -> Linker',
          'Compiler -> Preprocessor -> Linker -> Loader',
          'Linker -> Preprocessor -> Assembler -> Optimizer'
        ],
        correctIndex: 1,
        explanation: 'The compilation pipeline executes: Preprocessing (macro & include expansion) -> Compilation to Assembly -> Assembly to Object Machine Code -> Linking into final executable binary.'
      }
    ]
  },
  {
    id: 'cyber-defense-boss',
    title: 'Cybersecurity Sentinel Expert',
    description: 'Advanced assessment covering Network Security, Cryptography, Identity Protocols, Mobile Forensics, and Attack Mitigations.',
    category: 'Cyber Defense',
    passingScore: 70,
    durationMinutes: 15,
    xpReward: 400,
    badgeReward: 'Sentinel Shield Certified',
    questions: [
      {
        id: 'sec-q1',
        topic: 'Network Attacks',
        question: 'Which vulnerability in GSM/UMTS signaling allows unauthorized location tracking and SMS interception?',
        options: [
          'BGP Hijacking',
          'SS7 (Signaling System No. 7) protocol trust flaw',
          'DNS Cache Poisoning',
          'ARP Spoofing'
        ],
        correctIndex: 1,
        explanation: 'SS7 lacks cryptographic authentication between telecom carrier nodes, enabling attackers to send spoofed routing updates, intercept OTP SMS, or locate subscribers.'
      },
      {
        id: 'sec-q2',
        topic: 'Authentication & MFA',
        question: 'Why are SMS-based OTPs considered significantly less secure than FIDO2/WebAuthn hardware tokens?',
        options: [
          'SMS is blocked by default on modern enterprise firewalls',
          'SMS is susceptible to SIM swapping, SS7 routing abuse, and phishing reverse proxies',
          'FIDO2 uses unencrypted Bluetooth channels',
          'SMS codes require public internet gateways while FIDO2 does not'
        ],
        correctIndex: 1,
        explanation: 'SMS OTPs can be intercepted via SIM-swap social engineering, SS7 exploits, or relayed in real-time by reverse proxy tools like Evilginx. FIDO2 binds to origin domain cryptographically.'
      },
      {
        id: 'sec-q3',
        topic: 'Email Defense',
        question: 'What is the role of DMARC when combined with SPF and DKIM?',
        options: [
          'Encrypts email body text using PGP automatically',
          'Specifies recipient policy (none/quarantine/reject) and provides reporting on SPF/DKIM alignment failures',
          'Generates TLS certificates for inbound mail transfer agents',
          'Scans email attachments for zero-day macro exploits'
        ],
        correctIndex: 1,
        explanation: 'DMARC establishes domain alignment between "From" header and SPF/DKIM validations, and specifies an enforcement policy (p=reject or quarantine) with telemetry reports.'
      },
      {
        id: 'sec-q4',
        topic: 'Android Forensics',
        question: 'Under Android Linux directory structure, where is the standard SMS/MMS SQLite database file located on rooted devices?',
        options: [
          '`/system/etc/telephony/sms.db`',
          '`/data/data/com.android.providers.telephony/databases/mmssms.db`',
          '`/storage/emulated/0/Android/data/sms.db`',
          '`/proc/net/cellular/messages.log`'
        ],
        correctIndex: 1,
        explanation: 'Android telephony provider stores SMS and MMS conversations in the SQLite database `/data/data/com.android.providers.telephony/databases/mmssms.db`.'
      },
      {
        id: 'sec-q5',
        topic: 'Web Security',
        question: 'Which HTTP response header effectively defends against Cross-Site Scripting (XSS) by restricting permissible resource loading domains?',
        options: [
          'Strict-Transport-Security (HSTS)',
          'Content-Security-Policy (CSP)',
          'X-Frame-Options',
          'Access-Control-Allow-Origin'
        ],
        correctIndex: 1,
        explanation: 'CSP instructs the browser which script, style, image, and connect origins are trustworthy, severely curbing arbitrary inline script injection.'
      },
      {
        id: 'sec-q6',
        topic: 'Cryptography',
        question: 'Why should passwords NEVER be hashed with simple SHA-256 or MD5, even with a salt?',
        options: [
          'SHA-256 produces variable length output which causes buffer overflows',
          'Modern GPUs can compute billions of SHA-256 hashes per second, making offline brute-force trivial',
          'SHA-256 hash output is reversible using mathematical division',
          'Salts are stripped by web application firewalls'
        ],
        correctIndex: 1,
        explanation: 'General-purpose cryptographic hashes like SHA-256 are engineered for raw speed. Dedicated password hashing functions (Argon2id, bcrypt, scrypt) enforce tunable computational and memory cost.'
      },
      {
        id: 'sec-q7',
        topic: 'Threat Intelligence',
        question: 'In the MITRE ATT&CK framework, what stage follows Initial Access and Execution in an intrusion lifecycle?',
        options: [
          'Exfiltration',
          'Persistence and Privilege Escalation',
          'Impact and Ransom Deployment',
          'Reconnaissance'
        ],
        correctIndex: 1,
        explanation: 'Once attackers gain initial access and execute code, their priority is establishing persistence (maintaining foothold across reboots) and escalating privileges.'
      },
      {
        id: 'sec-q8',
        topic: 'Transport Layer Security',
        question: 'What critical defense does TLS 1.3 provide by mandating Diffie-Hellman Ephemeral (DHE/ECDHE)?',
        options: [
          'Perfect Forward Secrecy (PFS)',
          'Hardware biometric validation',
          'Automatic IP address anonymization',
          'Zero-latency packet compression'
        ],
        correctIndex: 0,
        explanation: 'Ephemeral key exchange ensures that past recorded sessions cannot be decrypted in the future even if the server\'s private long-term certificate key is later compromised.'
      },
      {
        id: 'sec-q9',
        topic: 'Application Security',
        question: 'What is the most definitive architectural remediation for SQL Injection?',
        options: [
          'Blacklisting single quotes and double dashes in user input',
          'Parameterized queries (Prepared Statements) separating code from user input',
          'Using client-side regex input filters',
          'Base64 encoding all query parameters'
        ],
        correctIndex: 1,
        explanation: 'Parameterized queries compile SQL structure first and treat input strictly as parameter literals, rendering injection syntax inert.'
      },
      {
        id: 'sec-q10',
        topic: 'Zero Trust Architecture',
        question: 'What is the core premise of NIST SP 800-207 Zero Trust Architecture?',
        options: [
          'Trust all packets originating behind the internal corporate subnet perimeter',
          'Never trust, always verify: assume breach and authenticate every request contextually',
          'Rely exclusively on VPN gateways without microsegmentation',
          'Eliminate public cloud providers in favor of on-premise hardware'
        ],
        correctIndex: 1,
        explanation: 'Zero Trust eliminates implicit trust based on network location; every identity, device, and request must be authenticated, authorized, and continuously validated.'
      },
      {
        id: 'sec-q11',
        topic: 'Mobile Security',
        question: 'What does APK Certificate Pinning prevent in mobile applications?',
        options: [
          'Battery drain caused by background services',
          'Man-in-the-Middle (MitM) inspection using user-installed root CA certificates',
          'Decompilation by JADX or Ghidra',
          'Dynamic memory hooking with Frida'
        ],
        correctIndex: 1,
        explanation: 'SSL/TLS Pinning hardcodes the server\'s public key or certificate inside the app, rejecting arbitrary proxy CA certificates installed on the device.'
      },
      {
        id: 'sec-q12',
        topic: 'Incident Response',
        question: 'During an active Ransomware incident, what is the immediate first containment priority?',
        options: [
          'Pay the threat actors via cryptocurrency immediately',
          'Isolate affected host machines from the local network (disconnect Ethernet/WiFi) to halt lateral movement',
          'Format and reinstall all servers without preserving memory or logs',
          'Send mass notification emails to all customers'
        ],
        correctIndex: 1,
        explanation: 'Network isolation stops active lateral propagation (e.g. via PsExec, SMB, WMI) and prevents command-and-control communication while preserving volatile memory for forensics.'
      },
      {
        id: 'sec-q13',
        topic: 'Buffer Overflows',
        question: 'Which compiler defense mechanism places a canary value before the stack return address to detect buffer overflows?',
        options: [
          'Address Space Layout Randomization (ASLR)',
          'Stack Canaries (Stack Smashing Protection / -fstack-protector)',
          'Data Execution Prevention (DEP / NX bit)',
          'Control Flow Integrity (CFI)'
        ],
        correctIndex: 1,
        explanation: 'Stack canaries insert a randomized guard word before the return address; if overwritten by a buffer overflow, the compiler detects corruption and terminates the process.'
      },
      {
        id: 'sec-q14',
        topic: 'Identity & Access',
        question: 'In OAuth 2.0 and OpenID Connect (OIDC), what token is designated specifically to confirm user identity attributes to the client app?',
        options: [
          'Access Token',
          'ID Token (JWT format)',
          'Refresh Token',
          'Authorization Code'
        ],
        correctIndex: 1,
        explanation: 'The ID Token in OIDC is a cryptographically signed JWT containing user claims (sub, email, name, exp), whereas Access Tokens are meant for API authorization.'
      },
      {
        id: 'sec-q15',
        topic: 'Cross-Site Request Forgery',
        question: 'What modern cookie attribute effectively mitigates most CSRF attacks without requiring custom anti-CSRF tokens?',
        options: [
          '`HttpOnly`',
          '`SameSite=Lax` or `SameSite=Strict`',
          '`Secure`',
          '`Domain=.local`'
        ],
        correctIndex: 1,
        explanation: '`SameSite=Lax` or `Strict` prevents the browser from sending session cookies along with cross-site third-party requests, defusing traditional CSRF vectors.'
      },
      {
        id: 'sec-q16',
        topic: 'Forensics',
        question: 'In order of forensic volatility (RFC 3227), which evidence source must be captured first?',
        options: [
          'Hard drive contents and swap space',
          'Registers and cache / Volatile RAM',
          'Archival backup tapes',
          'Network cabling topology'
        ],
        correctIndex: 1,
        explanation: 'Order of volatility states that the most fleeting data (CPU registers, cache, followed by main system RAM) disappears upon power loss and must be acquired before disk.'
      },
      {
        id: 'sec-q17',
        topic: 'Social Engineering',
        question: 'What is "Quishing" in contemporary cyber threat terminology?',
        options: [
          'Quantum computing decryption attack',
          'Phishing attacks utilizing malicious QR codes to bypass email spam filters',
          'Query-based SQL injection via GraphQL',
          'Voice deepfake extortion over VoIP'
        ],
        correctIndex: 1,
        explanation: 'Quishing is QR-code phishing, embedding malicious URLs inside images to evade standard email text-inspection scanners.'
      },
      {
        id: 'sec-q18',
        topic: 'Cloud Security',
        question: 'Under the Cloud Shared Responsibility Model, what is the customer responsible for in an Infrastructure-as-a-Service (IaaS) deployment?',
        options: [
          'Physical datacenter perimeter security and hypervisor maintenance',
          'Guest OS patching, firewall rules, application code, and data encryption',
          'Cooling systems and UPS power supply',
          'Hardware replacement for faulty server blades'
        ],
        correctIndex: 1,
        explanation: 'In IaaS (e.g. AWS EC2, GCP Compute Engine), the cloud provider manages physical hardware and virtualization, while the tenant manages OS configuration, patches, firewall rules, and data.'
      },
      {
        id: 'sec-q19',
        topic: 'Cryptanalysis',
        question: 'What is a Birthday Attack primarily used for against cryptographic systems?',
        options: [
          'Cracking AES-256 by brute-forcing private keys',
          'Finding hash collisions in $O(2^{n/2})$ time instead of $O(2^n)$',
          'DDoS attack targeting domain registrar DNS servers',
          'Spoofing timestamp certificates in NTP'
        ],
        correctIndex: 1,
        explanation: 'Based on the birthday paradox, finding two distinct inputs that produce identical hash outputs requires approximately $2^{n/2}$ evaluations rather than $2^n$.'
      },
      {
        id: 'sec-q20',
        topic: 'Defensive Architecture',
        question: 'What does the Principle of Least Privilege (PoLP) dictate in system design?',
        options: [
          'Giving all users root access to simplify troubleshooting',
          'Granting every user, process, and system only the minimum permissions necessary to perform authorized duties',
          'Restricting application code to a single thread',
          'Disabling all external inbound network connections entirely'
        ],
        correctIndex: 1,
        explanation: 'PoLP minimizes potential blast radius: if an identity or process is compromised, the attacker only inherits the minimal permissions granted to that specific actor.'
      }
    ]
  }
];
