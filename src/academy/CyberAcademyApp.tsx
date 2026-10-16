import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GraduationCap,
  Award,
  Terminal,
  Cpu,
  Globe,
  Lock,
  Key,
  Shield,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Play,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Sliders,
  Send,
  HelpCircle,
  Briefcase,
  Scale
} from 'lucide-react';

export interface CyberAcademyAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const CyberAcademyApp: React.FC<CyberAcademyAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher
}) => {
  const [activeTab, setActiveTab] = useState<
    'ctf' | 'crypto-lab' | 'stego' | 'network-sim' | 'terminal-guide' | 'roadmap' | 'bounty' | 'cyberlaw' | 'interview'
  >('ctf');

  // 1. CTF Practice Arena State
  const CTF_CHALLENGES = [
    {
      id: 'ctf-1',
      title: 'Crypto 101: The Encoded Secret',
      category: 'Cryptography / Encoding',
      difficulty: 'Easy',
      points: 50,
      description: 'An analyst intercepted this string from a suspicious cookie header: ZmxhZ3tiY2Ffc2VjdXJlX2Jhc2U2NH0=. Can you decode it?',
      hint: 'This string ends with = and uses standard Base64 encoding. Use an online or built-in decoder.',
      correctFlag: 'flag{bca_secure_base64}'
    },
    {
      id: 'ctf-2',
      title: 'Ancient Roman Messenger (Caesar Cipher)',
      category: 'Classical Cryptography',
      difficulty: 'Easy',
      points: 75,
      description: 'Julius Caesar sent this encrypted flag with a shift of +3: iodj{fdhvdu_flskhu_ghfrghg}. Find the original plaintext flag.',
      hint: 'Shift each letter backward by 3 positions (e.g. d -> a, i -> f).',
      correctFlag: 'flag{caesar_cipher_decoded}'
    },
    {
      id: 'ctf-3',
      title: 'Hexadecimal Stream Analysis',
      category: 'Data Representation',
      difficulty: 'Medium',
      points: 100,
      description: 'Network packet bytes: 66 6c 61 67 7b 68 65 78 5f 74 6f 5f 61 73 63 69 69 7d. Convert these hex bytes into ASCII characters.',
      hint: 'Each pair of hex characters represents one byte in ASCII (66 = \'f\', 6c = \'l\').',
      correctFlag: 'flag{hex_to_ascii}'
    },
    {
      id: 'ctf-4',
      title: 'The MD5 Hash Crack Challenge',
      category: 'Hashes & Passwords',
      difficulty: 'Medium',
      points: 125,
      description: 'The admin password hash is: 5ebe2294ecd0e0f08eab7690d2a6eefe. One of these 5 common words produced it: ["admin123", "password", "secret", "welcome", "kali"]. Format: flag{<matched_word>}',
      hint: 'Calculate the MD5 hash of each candidate word until you match 5ebe2294ecd0e0f08eab7690d2a6eefe.',
      correctFlag: 'flag{secret}'
    },
    {
      id: 'ctf-5',
      title: 'Binary Bits to Plaintext',
      category: 'Binary Analysis',
      difficulty: 'Medium',
      points: 150,
      description: 'A microcontroller broadcasted these 8-bit bytes: 01100110 01101100 01100001 01100111 01111011 01100010 01101001 01110100 01110011 01111101.',
      hint: 'Convert each 8-bit byte to its decimal value and then corresponding ASCII character.',
      correctFlag: 'flag{bits}'
    }
  ];

  const [submittedFlags, setSubmittedFlags] = useState<Record<string, string>>({});
  const [solvedChallenges, setSolvedChallenges] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('sentinel_ctf_solved');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const totalScore = useMemo(() => {
    return CTF_CHALLENGES.reduce((acc, c) => (solvedChallenges[c.id] ? acc + c.points : acc), 0);
  }, [solvedChallenges]);

  const handleFlagSubmit = (challengeId: string) => {
    const c = CTF_CHALLENGES.find((item) => item.id === challengeId);
    if (!c) return;
    const input = (submittedFlags[challengeId] || '').trim();
    if (input === c.correctFlag) {
      const updated = { ...solvedChallenges, [challengeId]: true };
      setSolvedChallenges(updated);
      try {
        localStorage.setItem('sentinel_ctf_solved', JSON.stringify(updated));
      } catch {}
    } else {
      alert('Incorrect flag! Review the hint and try again.');
    }
  };

  // 2. Crypto Playground State
  const [cipherType, setCipherType] = useState<'caesar' | 'vigenere' | 'rot13' | 'xor'>('caesar');
  const [cryptoInput, setCryptoInput] = useState('CYBER SECURITY IS AWESOME');
  const [caesarShift, setCaesarShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState('KEY');
  const [xorKey, setXorKey] = useState(42);

  const cryptoResult = useMemo(() => {
    const text = cryptoInput;
    if (cipherType === 'caesar') {
      return text.replace(/[a-zA-Z]/g, (c) => {
        const code = c.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + caesarShift) % 26) + base);
      });
    } else if (cipherType === 'rot13') {
      return text.replace(/[a-zA-Z]/g, (c) => {
        const code = c.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + 13) % 26) + base);
      });
    } else if (cipherType === 'vigenere') {
      const cleanKey = vigenereKey.toUpperCase().replace(/[^A-Z]/g, '') || 'A';
      let keyIdx = 0;
      return text.replace(/[a-zA-Z]/g, (c) => {
        const isUpper = c >= 'A' && c <= 'Z';
        const base = isUpper ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIdx % cleanKey.length) - 65;
        keyIdx++;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
      });
    } else if (cipherType === 'xor') {
      return Array.from(text)
        .map((c) => (c.charCodeAt(0) ^ xorKey).toString(16).padStart(2, '0'))
        .join(' ');
    }
    return text;
  }, [cryptoInput, cipherType, caesarShift, vigenereKey, xorKey]);

  // 3. Steganography Canvas Lab
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stegoSecretText, setStegoSecretText] = useState('CONFIDENTIAL_BCA_KEY_2026');
  const [stegoExtractedText, setStegoExtractedText] = useState('');
  const [stegoStatus, setStegoStatus] = useState<string | null>(null);

  // Initialize sample canvas image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, 300, 200);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 200);

    // Decorative circle
    ctx.beginPath();
    ctx.arc(150, 100, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Steganography Carrier', 150, 105);
  }, []);

  // LSB Encode into canvas
  const handleEncodeStego = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Encode secret string with null terminator
    const str = stegoSecretText + '\0';
    let strIdx = 0;
    let bitIdx = 0;

    for (let i = 0; i < data.length && strIdx < str.length; i += 4) {
      const charCode = str.charCodeAt(strIdx);
      const bit = (charCode >> (7 - bitIdx)) & 1;

      // Replace LSB of red channel
      data[i] = (data[i] & ~1) | bit;

      bitIdx++;
      if (bitIdx === 8) {
        bitIdx = 0;
        strIdx++;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setStegoStatus(`Successfully encoded ${stegoSecretText.length} characters into image canvas pixels via LSB!`);
  };

  // LSB Decode from canvas
  const handleDecodeStego = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let result = '';
    let currentChar = 0;
    let bitCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const bit = data[i] & 1;
      currentChar = (currentChar << 1) | bit;
      bitCount++;

      if (bitCount === 8) {
        if (currentChar === 0) break; // null terminator reached
        result += String.fromCharCode(currentChar);
        currentChar = 0;
        bitCount = 0;
        if (result.length > 500) break; // safety cutoff
      }
    }

    setStegoExtractedText(result || 'No hidden LSB message detected.');
  };

  // 4. Network Simulator State
  const [netSimStep, setNetSimStep] = useState(0);
  const [netSimProtocol, setNetSimProtocol] = useState<'tcp' | 'dns' | 'arp'>('tcp');

  const TCP_STEPS = [
    { title: '1. SYN (Client -> Server)', desc: 'Client sends SYN packet with Initial Sequence Number (ISN = 1000). State: SYN_SENT.', flag: 'SYN=1, ACK=0, Seq=1000' },
    { title: '2. SYN-ACK (Server -> Client)', desc: 'Server responds with SYN-ACK, acknowledging client seq (Ack = 1001) and sending own ISN (Seq = 5000). State: SYN_RCVD.', flag: 'SYN=1, ACK=1, Seq=5000, Ack=1001' },
    { title: '3. ACK (Client -> Server)', desc: 'Client acknowledges server sequence (Ack = 5001). Connection is established! State: ESTABLISHED.', flag: 'ACK=1, Seq=1001, Ack=5001' }
  ];

  const DNS_STEPS = [
    { title: '1. Client Cache Query', desc: 'Browser checks local DNS cache and hosts file for target domain.', flag: 'Cache Check' },
    { title: '2. Recursive Resolver Query', desc: 'Resolver (e.g. 8.8.8.8) queries Root Nameserver (.) for the Top Level Domain (.com).', flag: 'Root Query' },
    { title: '3. TLD Nameserver Query', desc: 'Root points to .com TLD server. TLD server returns Authoritative Nameserver (ns1.example.com).', flag: 'TLD Query' },
    { title: '4. Authoritative Answer', desc: 'Authoritative server returns IP address (A record = 93.184.216.34) with TTL.', flag: 'A Record Returned' }
  ];

  const ARP_STEPS = [
    { title: '1. ARP Request Broadcast', desc: 'Device A broadcasts: "Who has IP 192.168.1.1? Tell 192.168.1.105" to FF:FF:FF:FF:FF:FF.', flag: 'Broadcast' },
    { title: '2. ARP Reply Unicast', desc: 'Router with 192.168.1.1 replies unicast with its hardware MAC address: e4:8d:8c:12:34:56.', flag: 'Unicast Reply' },
    { title: '3. ARP Table Cache', desc: 'Device A stores IP-to-MAC mapping in its internal ARP cache table for 10-20 minutes.', flag: 'Cache Updated' }
  ];

  const currentNetSteps = netSimProtocol === 'tcp' ? TCP_STEPS : netSimProtocol === 'dns' ? DNS_STEPS : ARP_STEPS;

  // 5. Termux & Kali Commands
  const [cmdSearch, setCmdSearch] = useState('');
  const LINUX_COMMANDS = [
    { cmd: 'ip a / ifconfig', cat: 'Network', desc: 'Display all network interfaces, assigned IPv4/IPv6 addresses, and subnet masks.' },
    { cmd: 'ss -tulnp / netstat -tulnp', cat: 'Network', desc: 'List all active listening TCP and UDP sockets and associated process PIDs.' },
    { cmd: 'traceroute / tracepath <host>', cat: 'Network', desc: 'Trace network packet route hops from localhost to destination server.' },
    { cmd: 'tcpdump -i eth0 -n -c 50', cat: 'Network', desc: 'Capture first 50 live network packets on interface eth0 in raw form.' },
    { cmd: 'grep -rn "pattern" /var/log/', cat: 'Diagnostics', desc: 'Recursively search directory files with line numbers for matching string.' },
    { cmd: 'find / -perm -4000 -type f 2>/dev/null', cat: 'Security Audit', desc: 'Audit system for SUID (Set User ID) binary executables to check permissions.' },
    { cmd: 'ufw status verbose / iptables -L', cat: 'Firewall', desc: 'Inspect current Linux kernel packet filtering and firewall rules.' },
    { cmd: 'systemctl list-units --type=service', cat: 'System', desc: 'List all active daemon services running in the background.' },
    { cmd: 'pkg update && pkg upgrade', cat: 'Termux', desc: 'Update package repositories and upgrade installed packages in Termux Android.' }
  ];

  const filteredCommands = LINUX_COMMANDS.filter((c) => {
    const q = cmdSearch.toLowerCase();
    return c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q);
  });

  // 6. Indian Cyber Law Reference
  const CYBER_LAWS = [
    { sec: 'Section 43', act: 'IT Act 2000', title: 'Damage to Computer System / Data Theft', penalty: 'Civil compensation up to ₹1 Crore to the victim', desc: 'Extracting data, introducing computer virus, damaging databases, or unauthorized system access without permission.' },
    { sec: 'Section 66', act: 'IT Act 2000', title: 'Computer Related Offences (Hacking)', penalty: 'Imprisonment up to 3 years or fine up to ₹5 Lakh', desc: 'Dishonestly or fraudulently committing any act referred to in Section 43 (unauthorized deletion or alteration of data).' },
    { sec: 'Section 66C', act: 'IT Act 2000', title: 'Identity Theft', penalty: 'Imprisonment up to 3 years and fine up to ₹1 Lakh', desc: 'Fraudulently using the electronic signature, password or unique identification feature of another person.' },
    { sec: 'Section 66D', act: 'IT Act 2000', title: 'Cheating by Personation using Computer', penalty: 'Imprisonment up to 3 years and fine up to ₹1 Lakh', desc: 'Cheating by personating someone else online (phishing scams, fake UPI calls, fake social accounts).' },
    { sec: 'Section 66F', act: 'IT Act 2000', title: 'Cyber Terrorism', penalty: 'Imprisonment for LIFE', desc: 'Attacking critical national information infrastructure, defense systems, or threatening national sovereignty.' },
    { sec: '1930 Helpline', act: 'I4C & MHA', title: 'Citizen Financial Cyber Fraud Reporting (CFCFRMS)', penalty: 'Instant inter-bank fund freeze', desc: '24x7 toll-free emergency helpline (1930) and cybercrime.gov.in portal. Calling within the Golden Hour freezes stolen money in destination accounts.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">CyberAcademy</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  Hands-On Learning Hub
                </span>
              </div>
              <span className="text-xs text-slate-400">Ethical Hacking Practice, Career Roadmap &amp; Legal Cyber Defense</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                Back to BCA Verse
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          {[
            { id: 'ctf', label: 'CTF Practice Arena', icon: Award },
            { id: 'crypto-lab', label: 'Crypto Playground', icon: Lock },
            { id: 'stego', label: 'Steganography Lab', icon: ImageIcon },
            { id: 'network-sim', label: 'Network Simulator', icon: Globe },
            { id: 'terminal-guide', label: 'Termux / Kali Guide', icon: Terminal },
            { id: 'roadmap', label: 'Career Roadmap', icon: Briefcase },
            { id: 'bounty', label: 'Bug Bounty Guide', icon: Shield },
            { id: 'cyberlaw', label: 'Cyber Law India', icon: Scale }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: CTF ARENA */}
        {activeTab === 'ctf' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Self-Contained Ethical CTF Practice Arena</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Solve built-in cryptography, encoding, and forensic puzzles. 100% legal, offline challenge bank.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                    Score: {totalScore} / 500 Pts
                  </div>
                  <div className="text-xs text-slate-400">
                    Solved: <strong className="text-white">{Object.keys(solvedChallenges).length}</strong> / {CTF_CHALLENGES.length}
                  </div>
                </div>
              </div>

              {/* Challenge Cards */}
              <div className="space-y-4">
                {CTF_CHALLENGES.map((c) => {
                  const isSolved = Boolean(solvedChallenges[c.id]);
                  return (
                    <div
                      key={c.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isSolved
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-400">
                            {c.category}
                          </span>
                          <h3 className="font-bold text-white text-sm">{c.title}</h3>
                          {isSolved && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Solved
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-mono font-bold text-amber-400">
                          +{c.points} Pts ({c.difficulty})
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800 mb-3 break-all">
                        {c.description}
                      </p>

                      <div className="text-[11px] text-slate-400 mb-3">
                        <strong className="text-purple-300">Hint: </strong>
                        {c.hint}
                      </div>

                      {/* Flag Submission Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          disabled={isSolved}
                          value={submittedFlags[c.id] || ''}
                          onChange={(e) => setSubmittedFlags((prev) => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder={isSolved ? 'Challenge solved!' : 'flag{...}'}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        />
                        <button
                          disabled={isSolved}
                          onClick={() => handleFlagSubmit(c.id)}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-md"
                        >
                          Submit Flag
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRYPTO PLAYGROUND */}
        {activeTab === 'crypto-lab' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <span>Classical &amp; Symmetric Cipher Playground</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Experiment with Caesar, Vigenère, ROT13, and single-byte XOR substitution ciphers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'caesar', label: 'Caesar (+N)' },
                    { id: 'vigenere', label: 'Vigenère' },
                    { id: 'rot13', label: 'ROT13' },
                    { id: 'xor', label: 'XOR Bitwise' }
                  ].map((cp) => (
                    <button
                      key={cp.id}
                      onClick={() => setCipherType(cp.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        cipherType === cp.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Settings */}
              {cipherType === 'caesar' && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>Shift Amount (Key): {caesarShift}</span>
                    <span>Mod 26 Alphabet</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={caesarShift}
                    onChange={(e) => setCaesarShift(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}

              {cipherType === 'vigenere' && (
                <div className="text-xs space-y-1">
                  <label className="block text-slate-400 font-bold">Polyalphabetic Keyword:</label>
                  <input
                    type="text"
                    value={vigenereKey}
                    onChange={(e) => setVigenereKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
                  />
                </div>
              )}

              {cipherType === 'xor' && (
                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>XOR Secret Byte: {xorKey} (0x{xorKey.toString(16)})</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={255}
                    value={xorKey}
                    onChange={(e) => setXorKey(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Input & Output */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Plaintext Input:</label>
                <textarea
                  rows={3}
                  value={cryptoInput}
                  onChange={(e) => setCryptoInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Ciphertext Output:</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(cryptoResult)}
                    className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs sm:text-sm text-cyan-300 break-all select-all">
                  {cryptoResult}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEGANOGRAPHY LAB */}
        {activeTab === 'stego' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-teal-400" />
                  <span>Least Significant Bit (LSB) Steganography Studio</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conceal secret UTF-8 strings into the lowest bit of image pixels using HTML5 Canvas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Canvas Viewer */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <canvas ref={canvasRef} width={300} height={200} className="rounded-xl shadow-md border border-slate-800 max-w-full" />
                  <span className="text-[11px] text-slate-500 font-mono">300x200 Canvas Carrier Image</span>
                </div>

                {/* Controls */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Secret Text to Hide:</label>
                    <input
                      type="text"
                      value={stegoSecretText}
                      onChange={(e) => setStegoSecretText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-teal-300"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleEncodeStego}
                      className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer transition-colors"
                    >
                      1. Hide Secret into LSB
                    </button>
                    <button
                      onClick={handleDecodeStego}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-colors"
                    >
                      2. Extract Hidden Text
                    </button>
                  </div>

                  {stegoStatus && (
                    <div className="p-3 bg-teal-950/30 border border-teal-800/50 rounded-xl text-teal-300 text-[11px]">
                      {stegoStatus}
                    </div>
                  )}

                  {stegoExtractedText && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-400">Extracted Hidden Message:</span>
                      <div className="font-mono text-sm font-bold text-amber-300 break-all select-all">
                        {stegoExtractedText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NETWORKING SIMULATOR */}
        {activeTab === 'network-sim' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>Interactive Network Protocol Flow Simulator</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Step-by-step visualizer for TCP 3-Way Handshake, DNS Resolution, and ARP broadcast.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'tcp', label: 'TCP 3-Way Handshake' },
                    { id: 'dns', label: 'DNS Resolution Flow' },
                    { id: 'arp', label: 'ARP Resolution' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setNetSimProtocol(p.id as any);
                        setNetSimStep(0);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        netSimProtocol === p.id ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Flow Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Packet Sequence:</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={netSimStep === 0}
                      onClick={() => setNetSimStep((prev) => Math.max(0, prev - 1))}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      disabled={netSimStep === currentNetSteps.length - 1}
                      onClick={() => setNetSimStep((prev) => Math.min(currentNetSteps.length - 1, prev + 1))}
                      className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white cursor-pointer"
                    >
                      Next Step
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentNetSteps.map((s, idx) => {
                    const isCurrent = netSimStep === idx;
                    const isPast = netSimStep > idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setNetSimStep(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                            : isPast
                            ? 'bg-slate-950/80 border-slate-800 opacity-80'
                            : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-xs">{s.title}</span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-cyan-300">
                            {s.flag}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TERMUX & KALI GUIDE */}
        {activeTab === 'terminal-guide' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span>Termux &amp; Linux Defensive Commands Guide</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Essential CLI commands for local system auditing, network diagnostics, and package management.
                  </p>
                </div>

                <input
                  type="text"
                  value={cmdSearch}
                  onChange={(e) => setCmdSearch(e.target.value)}
                  placeholder="Filter commands..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCommands.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400">
                        {item.cat}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(item.cmd)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="font-mono text-cyan-300 font-bold bg-slate-900 p-2 rounded-lg border border-slate-800 break-all select-all">
                      {item.cmd}
                    </div>
                    <p className="text-slate-400 text-[11px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CAREER ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <span>12-Month Zero-to-Hero Cybersecurity Career Roadmap</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Structured syllabus progression from Computer Fundamentals to SOC Analyst and Security Engineer.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { phase: 'Month 1–3: Fundamentals & Networking', focus: 'OSI 7 Layers, TCP/IP, Linux CLI, Bash Scripting, Wireshark packet capture.', certs: 'CompTIA Network+ / Cisco CCNA' },
                  { phase: 'Month 4–6: Defensive Security & SOC', focus: 'SIEM Log Analysis (Splunk / ELK), Incident Response, Endpoint Detection (EDR), Snort IDS/IPS rules.', certs: 'CompTIA Security+ / Blue Team Level 1 (BTL1)' },
                  { phase: 'Month 7–9: Web Security & Ethical Auditing', focus: 'OWASP Top 10, PortSwigger Web Security Academy, Burp Suite community edition, Secure code review.', certs: 'eJPT / CEH Practical' },
                  { phase: 'Month 10–12: Advanced Auditing & Career Launch', focus: 'Privilege escalation, Active Directory defense, Bug bounty reporting, CISSP concepts.', certs: 'OSCP / CompTIA CySA+' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{item.phase}</h3>
                      <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {item.certs}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{item.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BUG BOUNTY GUIDE */}
        {activeTab === 'bounty' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>Responsible Disclosure &amp; Bug Bounty Framework</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Guidelines for legal security research on HackerOne, Bugcrowd, and responsible disclosure portals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-emerald-400">Golden Rules of Legal Hunting:</span>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>Strictly stay inside the target program's specified "In-Scope" domains.</li>
                    <li>Never conduct Denial of Service (DoS) or brute-force floods.</li>
                    <li>Do not view, modify, or exfiltrate private customer personal data (PII).</li>
                    <li>Report the finding promptly through coordinated disclosure channels.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-cyan-400">Report Template Structure:</span>
                  <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                    <li><strong>Summary:</strong> High-level executive overview of the vulnerability.</li>
                    <li><strong>Severity:</strong> CVSS 3.1 rating (Low, Medium, High, Critical).</li>
                    <li><strong>Reproduction Steps:</strong> Clear, step-by-step minimal PoC.</li>
                    <li><strong>Impact:</strong> Business and technical security risk.</li>
                    <li><strong>Remediation:</strong> Concrete code patch advice for engineers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: INDIAN CYBER LAW */}
        {activeTab === 'cyberlaw' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <span>Indian Cyber Law &amp; IT Act 2000 Comprehensive Guide</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Legal provisions, penalties, victim protections, and 1930 National Cyber Helpline procedures.
                </p>
              </div>

              <div className="space-y-3">
                {CYBER_LAWS.map((law, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {law.sec} ({law.act})
                        </span>
                        <h3 className="font-bold text-white text-sm">{law.title}</h3>
                      </div>
                      <span className="font-mono text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-rose-800/40">
                        {law.penalty}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{law.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
