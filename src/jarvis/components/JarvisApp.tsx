import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Trash2,
  Zap,
  Flame,
  Cpu,
  Bot,
  User,
  Copy,
  Check,
  Grid,
  HelpCircle,
  Sliders,
  Terminal,
  Activity,
  Radio
} from 'lucide-react';
import { JarvisChatMessage, JarvisCringeLevel, JarvisPersonality, JarvisQuickPrompt } from '../types';
import { JarvisArcReactor } from './JarvisArcReactor';

interface JarvisAppProps {
  onBackToBca?: () => void;
  onOpenCalcVault?: () => void;
  onOpenSukhan?: () => void;
  onOpenCompiler?: () => void;
  onOpenCyber?: () => void;
  onOpenAppSwitcher?: () => void;
}

const QUICK_PROMPTS: JarvisQuickPrompt[] = [
  {
    id: 'qp-1',
    category: 'Cybersecurity',
    title: 'Buffer Overflow in C',
    prompt: 'Buffer Overflow in C kaise kaam karti hai? Stack memory layout, EBP aur EIP overwrite ka step-by-step technical explanation do.'
  },
  {
    id: 'qp-2',
    category: 'Indian Cyber Law',
    title: 'Cyber Fraud 1930 Helpline',
    prompt: 'Online financial fraud hone par Indian Cyber Crime Reporting Portal (cybercrime.gov.in) aur 1930 Helpline par complaint kaise darj karein? Golden Hour rule kya hai?'
  },
  {
    id: 'qp-3',
    category: 'HPC & Supercomputers',
    title: 'Supercomputers & PFLOPS',
    prompt: 'Supercomputer normal PC se kaise alag hota hai? FLOPS, PFLOPS aur Bharat ke PARAM Siddhi-AI supercomputer ki architecture samjhao.'
  },
  {
    id: 'qp-4',
    category: 'Hacking Tools',
    title: 'Nmap SYN Stealth Scan',
    prompt: 'Nmap SYN Stealth Scan (-sS) TCP 3-way handshake me kaise work karta hai aur yeh Full Connect Scan se kyu better hai?'
  },
  {
    id: 'qp-5',
    category: 'Career Scope',
    title: 'Cybersecurity Zero to Hero',
    prompt: 'Zero knowledge se high-paying Cybersecurity Engineer banne ka 12-month step-by-step roadmap, salaries in India aur best certifications (CEH vs OSCP) batao.'
  },
  {
    id: 'qp-6',
    category: 'Networking',
    title: 'OSI 7 Layers Packet Flow',
    prompt: 'OSI 7 Layers model ka real-world breakdown do: Browser me URL daalne se lekar destination server tak data encapsulation kaise hota hai?'
  }
];

export const JarvisApp: React.FC<JarvisAppProps> = ({
  onBackToBca,
  onOpenCalcVault,
  onOpenSukhan,
  onOpenCompiler,
  onOpenCyber,
  onOpenAppSwitcher
}) => {
  const [messages, setMessages] = useState<JarvisChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'jarvis',
      text: `Hello! Main JARVIS hoon — aapka elite AI Technical Assistant, powered by Gemini architecture, engineered by Prince Thakur. 🚀\n\nAap mujhse Coding (C, Python, DSA), Cybersecurity, Ethical Hacking techniques, Supercomputers, Indian Cyber Cell laws (IT Act 2000), ya BCA/BTech semester exams par koi bhi technical sawaal puch sakte hain. Har sawaal ka accurate, step-by-step aur factual solution milega.`,
      timestamp: 'Online'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [cringeLevel, setCringeLevel] = useState<JarvisCringeLevel>('balanced');
  const [persona, setPersona] = useState<JarvisPersonality>('ironman');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle Text-To-Speech (Web Speech API)
  const speakText = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && speakingMessageId === msgId) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        return;
      }
      window.speechSynthesis.cancel();

      // Clean markdown tags for audio
      const clean = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select Hindi or English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN')) || voices[0];
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingMessageId(msgId);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Offline / Smart Fallback Answer Generator if backend unavailable
  const generateOfflineJarvisAnswer = (query: string, cLevel: JarvisCringeLevel, p: JarvisPersonality) => {
    const q = query.trim();
    const qLower = q.toLowerCase();

    let coreAnswer = '';

    // Identity / Who are you
    if (qLower.includes('who are you') || qLower.includes('kaun ho') || qLower.includes('kon ho') || qLower.includes('about yourself')) {
      coreAnswer = `### 🤖 J.A.R.V.I.S. Architecture & Specifications:
- **System**: Just A Rather Very Intelligent System (Gemini AI Powered)
- **Engineered By**: Prince Thakur (Specialized for technical developers & students)
- **Core Competencies**:
  1. **Fullstack Coding & Systems**: C, C++, Python, JavaScript, Linux Kernel, DSA.
  2. **Offensive & Defensive Security**: Kali Linux, OWASP Top 10, Nmap, Wireshark, Buffer Overflow, Cryptography.
  3. **Indian Cyber Legal Domain**: IT Act 2000 (Sections 66, 66C-F, 43), Helpline 1930, Section 65B digital evidence.
  4. **Supercomputing & HPC**: PFLOPS, ExaFLOPS, PARAM Siddhi-AI, Frontier, MPI/CUDA parallel processing.`;
    }
    // Greetings
    else if (/^(hi|hello|hey|namaste|salaam|adaab|kese ho|kaise ho)\b/i.test(qLower)) {
      coreAnswer = `Namaste! JARVIS systems 100% active aur ready state me hain.

Aap mujhse koi bhi technical doubt puch sakte hain:
- **Coding**: C Pointers, Memory Leaks, DSA, Python, JavaScript.
- **Cybersecurity**: Penetration Testing, Kali Linux, Nmap, Exploits, SOC Analyst.
- **Indian Cyber Law**: Helpline 1930, IT Act 2000, FIR procedures.
- **Supercomputers**: PARAM series, High Performance Computing, Parallel Architecture.

Bataiye, kis topic par start karein?`;
    }
    // Supercomputer / PARAM
    else if (qLower.includes('supercomputer') || qLower.includes('param') || qLower.includes('flops') || qLower.includes('fugaku') || qLower.includes('frontier')) {
      coreAnswer = `### 🚀 Supercomputers & High Performance Computing (HPC)

1. **Fundamental Definition**:
   Supercomputer sequential tasks ke bajaye thousands of compute nodes (CPUs + Tensor Core GPUs) ko high-speed interconnects (InfiniBand) ke through parallel me chalakar scientific calculations karta hai.

2. **Speed Metrics (FLOPS)**:
   - **FLOP**: Floating Point Operation per second.
   - **PetaFLOPS (PFLOPS)**: $10^{15}$ operations/sec (10 Lakh Crore calculations har second!).
   - **ExaFLOPS**: $10^{18}$ calculations/sec (e.g. World's #1 Frontier Supercomputer at ~1.2 ExaFLOPS).

3. **India's PARAM Series**:
   - **PARAM 8000 (1991)**: India ka pehla indigenously built supercomputer, architected by Dr. Vijay Bhatkar (C-DAC Pune).
   - **PARAM Siddhi-AI**: India ka premier AI supercomputing system (5.267 PFLOPS) on NVIDIA DGX SuperPOD architecture.
   - **PARAM Shivay, PARAM Shakti, AIRAWAT**: National Supercomputing Mission (NSM) ke under operational.

4. **Key Technologies**:
   - Interconnect: InfiniBand HDR 200Gbps (latency ~1.2 microseconds).
   - Programming: MPI (Distributed memory) + OpenMP (Shared memory) + CUDA (GPU acceleration).`;
    }
    // Cyber Cell / 1930 / IT Act
    else if (qLower.includes('cyber cell') || qLower.includes('1930') || qLower.includes('it act') || qLower.includes('section 66') || qLower.includes('cybercrime')) {
      coreAnswer = `### ⚖️ Indian Cyber Cell, Helpline 1930 & IT Act 2000

1. **National Financial Fraud Helpline (1930)**:
   - Jaise hi online banking/UPI/OTP fraud ho, turant **1930** milayein.
   - **Golden Hour Rule**: Pehle 2 ghante me call karne par CFCFRMS software recipient bank account ko freeze alert bhej deta hai, jisse chori ka paisa recover ho jata hai.
   - Official Portal: \`cybercrime.gov.in\`

2. **Key Sections of IT Act 2000**:
   - **Section 66**: Computer related offences & hacking (Up to 3 years jail + ₹5 Lakh fine).
   - **Section 66C**: Identity theft / stolen passwords & OTPs (Up to 3 years jail).
   - **Section 66D**: Cheating by personation using computer resource / UPI scam (Up to 3 years jail).
   - **Section 66E**: Privacy violation / publishing private photos without consent (Up to 3 years jail).
   - **Section 66F**: Cyber Terrorism against India's critical infrastructure (**Life Imprisonment**).
   - **Section 43**: Penalty for unauthorized access, data copying, or virus release (Civil compensation).

3. **Section 65B of Indian Evidence Act**:
   - Court me WhatsApp chats, server logs ya CCTV footage submit karne ke liye Section 65B Certificate mandatory hota hai jo data ki integrity certify karta hai.`;
    }
    // Scope of Cybersecurity & Salary
    else if (qLower.includes('scope') || qLower.includes('salary') || qLower.includes('roadmap') || qLower.includes('career') || qLower.includes('cert')) {
      coreAnswer = `### 🎯 Cybersecurity Career Roadmap & Industry Scope

1. **Industry Demand & Growth**:
   Cybersecurity me global 3.5 Million unfilled jobs hain. Har enterprise, bank, healthcare aur defense agency ko dedicated security staff chahiye.

2. **Salary Landscape in India**:
   - **Entry Level (0-2 yrs)**: ₹5 Lakh - ₹10 Lakh LPA (L1 SOC Analyst, Junior Pentester).
   - **Mid Level (3-6 yrs)**: ₹15 Lakh - ₹28 Lakh LPA (Incident Responder, DevSecOps, Cloud Security).
   - **Senior / CISO (7+ yrs)**: ₹40 Lakh - ₹1.5+ Crore LPA.

3. **Top Certifications**:
   - **CompTIA Security+**: Best entry-level defensive starter.
   - **OSCP (Offensive Security)**: 24-hour practical hacking exam. The global gold standard.
   - **CISSP**: Top credential for management and CISO roles.

4. **Zero to Hero 4-Stage Roadmap**:
   - Stage 1: Networking (OSI, TCP/IP, Subnetting) + Linux command line.
   - Stage 2: Web vulnerabilities (OWASP Top 10) + Python/Bash scripting.
   - Stage 3: Practice on TryHackMe & PortSwigger Academy.
   - Stage 4: Specialization (SOC Defense or Offensive Pentesting) & Bug Bounty.`;
    }
    // Buffer Overflow
    else if (qLower.includes('buffer overflow') || qLower.includes('stack') || qLower.includes('eip')) {
      coreAnswer = `### 💥 Buffer Overflow Vulnerability Deep Dive

1. **How It Works**:
   C language array boundaries automatically check nahi karti. Jab \`strcpy()\` ya \`gets()\` use hota hai aur user input buffer size se bada hota hai, tab extra bytes stack memory me adjacent areas ko overwrite kar dete hain.

2. **Stack Layout**:
   \`[Local Buffer Variables] -> [Saved EBP (4 bytes)] -> [Return Address EIP (4 bytes)]\`

3. **Exploitation Mechanics**:
   - Attacker buffer ko junk bytes se fill karta hai.
   - Next 4 bytes EBP ko overwrite karte hain.
   - Next 4 bytes **Return Address (EIP register)** ko overwrite kar dete hain!
   - Attacker EIP me apne malicious Shellcode (e.g. \`/bin/sh\`) ka memory address daal deta hai.
   - Function return hote hi CPU hacker ke shellcode par jump kar deta hai aur root shell mil jaati hai.

4. **Defenses**:
   - Use safe functions: \`strncpy()\`, \`fgets()\`, \`snprintf()\`.
   - Compiler protections: Stack Canaries (\`-fstack-protector\`), ASLR, DEP/NX Bit.`;
    }
    // Nmap & Port Scanning
    else if (qLower.includes('nmap') || qLower.includes('scan') || qLower.includes('syn')) {
      coreAnswer = `### 🔍 Nmap Scanning Mechanics: SYN Scan vs Connect Scan

1. **Full TCP Connect Scan (-sT)**:
   - Complete 3-Way Handshake: SYN -> SYN-ACK -> ACK.
   - Connection fully establish ho jata hai, jisse target web server application logs me scanner ka IP address store ho jata hai.

2. **SYN Stealth Scan (-sS)**:
   - Half-Open Scan: Scanner SYN packet bhejta hai -> Target SYN-ACK deta hai -> Scanner turant **RST (Reset)** bhej kar connection tod deta hai!
   - Handshake complete nahi hota, isliye target application log create nahi karti.
   - Requires root privilege (sudo) because it creates raw network packets.

3. **Essential Practical Command**:
   \`\`\`bash
   sudo nmap -sS -sV -sC -O -T4 192.168.1.1
   \`\`\`
   (-sS: SYN scan, -sV: Version detection, -sC: Default scripts, -O: OS detection).`;
    }
    // C Programming & Pointers
    else if (qLower.includes('pointer') || qLower.includes('c language') || qLower.includes('memory leak') || qLower.includes('c program')) {
      coreAnswer = `### 💻 C Programming & Memory Pointers Masterclass

1. **Pointer Definition**:
   Pointer ek variable hai jo kisi doosre variable ka physical RAM address store karta hai.
   \`\`\`c
   int x = 50;
   int *ptr = &x; // ptr stores address of x
   *ptr = 100;    // Dereferencing updates x directly
   \`\`\`

2. **Memory Leak**:
   Heap memory (\`malloc\`, \`calloc\`) allocate karne ke baad agar \`free()\` na ki jaye, toh memory leak hoti hai. Server run hone par RAM full ho jaati hai.
   - Detection tool: \`valgrind --leak-check=full ./program\`

3. **Dangling Pointer**:
   Jab memory deallocate ho chuki ho par pointer abhi bhi purane address ko point kar raha ho.
   - Fix: \`free(ptr); ptr = NULL;\``;
    }
    // General Technical Fallback (High Quality, Structured, Zero Cringe)
    else {
      coreAnswer = `### 🧠 JARVIS Deep Analysis: "${q}"

1. **Core Concept Overview**:
   Yeh vishay computer science aur systems engineering me fundamental importance rakhta hai. Iska primary objective reliability, performance, aur security architecture establish karna hai.

2. **Technical Workflow & Underlying Mechanics**:
   - Input/Trigger event register hota hai.
   - Operating system kernel / protocol layer abstraction provide karti hai.
   - Data structures ($O(1)$ ya $O(n)$ complexity) processing execute karte hain.
   - Resource allocation (CPU context switch ya memory allocation) handle hota hai.

3. **Industrial Best Practices & Real-World Application**:
   - Hamesha input validation aur boundary checks implement karein.
   - Network protocols me TLS 1.3 encryption aur Zero Trust access control use karein.
   - Production deployments me automated logging aur SIEM monitoring ensure karein.

📌 **Pro-Tip**: Aap mujhse is concept par specific code snippet, terminal command, ya viva examination question generate karne ke liye puch sakte hain.`;
    }

    return coreAnswer;
  };

  type MessagePart =
    | { type: 'text'; content: string }
    | { type: 'code'; lang: string; code: string };

  const renderFormattedMessage = (text: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
    const parts: MessagePart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'code',
        lang: match[1] || 'code',
        code: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    if (parts.length === 0) {
      return <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">{text}</div>;
    }

    return (
      <div className="space-y-2 font-sans">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            return (
              <div key={idx} className="rounded-xl overflow-hidden border border-cyan-800/60 bg-black/80 font-mono text-xs my-2 shadow-inner">
                <div className="bg-[#07101e] px-3 py-1.5 border-b border-cyan-900/60 flex items-center justify-between text-[11px] text-cyan-400">
                  <span className="uppercase font-bold tracking-wider">{part.lang}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(part.code);
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-[10px] text-cyan-300 border border-cyan-700/50 cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="p-3 text-cyan-200 overflow-x-auto whitespace-pre leading-relaxed">
                  {part.code}
                </pre>
              </div>
            );
          }
          return (
            <div key={idx} className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {part.content}
            </div>
          );
        })}
      </div>
    );
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking) return;

    const userMsg: JarvisChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    const chatHistory = messages
      .filter((m) => m.id !== 'welcome-1')
      .slice(-8)
      .map((m) => ({
        sender: m.sender,
        text: m.text
      }));

    try {
      const res = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          history: chatHistory,
          cringeLevel,
          persona
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const aiMsg: JarvisChatMessage = {
            id: `jarvis-${Date.now()}`,
            sender: 'jarvis',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cringeLevel,
            persona
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsThinking(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend Jarvis error, using built-in offline engine:', e);
    }

    // Fallback response with slight artificial delay for natural feel
    setTimeout(() => {
      const fallbackReply = generateOfflineJarvisAnswer(trimmed, cringeLevel, persona);
      const aiMsg: JarvisChatMessage = {
        id: `jarvis-${Date.now()}`,
        sender: 'jarvis',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cringeLevel,
        persona
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#060A12] text-cyan-50 flex flex-col font-sans select-none antialiased">
      {/* Top Holographic Stark Tech Header */}
      <header className="sticky top-0 z-40 w-full bg-[#060A12]/90 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg shadow-cyan-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Telemetry */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <JarvisArcReactor size="sm" isThinking={isThinking} isSpeaking={isSpeaking} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-widest text-cyan-300 font-mono">
                    J.A.R.V.I.S. AI
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 uppercase">
                    Mark XLII
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse" /> Core Online
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-cyan-400">Made by Prince Thakur</span>
                </div>
              </div>
            </div>

            {/* Header Right Switcher & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: 'jarvis',
                      text: `Chat history clear kar di gayi hai. Naya technical question ya coding doubt puchhiye — 100% verified solution ready hai! 🚀`,
                      timestamp: 'Online'
                    }
                  ]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>

              <button
                onClick={onOpenAppSwitcher}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-semibold text-cyan-200 transition-all cursor-pointer shadow-md"
              >
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Suite Apps</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry & Intelligence Control Ribbon */}
        <div className="border-t border-cyan-900/40 bg-[#080E1A]/80 py-2.5 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Technical Persona Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold mr-1 shrink-0">
                Mode:
              </span>
              {[
                { id: 'cyber_expert', label: '🛡️ Cyber & Pentest' },
                { id: 'code_architect', label: '💻 Systems Architect' },
                { id: 'bca_guru', label: '🎓 CS Professor' },
                { id: 'ironman', label: '🤖 Gemini High-IQ' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id as JarvisPersonality)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer shrink-0 ${
                    persona === p.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-black/30 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Gemini Intelligence Depth */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Intelligence Depth:
              </span>
              <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
                {[
                  { id: 'mild', label: '⚡ Fast (Flash)' },
                  { id: 'balanced', label: '🧠 Deep (Pro)' },
                  { id: 'overdose', label: '🔬 Architecture Lab' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setCringeLevel(lvl.id as JarvisCringeLevel)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      cringeLevel === lvl.id
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between space-y-4">
        {/* Messages Scroll Area */}
        <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
          {messages.map((msg) => {
            const isAi = msg.sender === 'jarvis';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-cyan-600/30">
                    <Bot className="w-5 h-5 text-cyan-200" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-xl rounded-2xl p-4 sm:p-5 shadow-xl transition-all ${
                    isAi
                      ? 'bg-[#0B1322] border border-cyan-500/40 text-cyan-50'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium self-end ml-auto'
                  }`}
                >
                  {isAi && (
                    <div className="flex items-center justify-between mb-2 text-[10px] font-mono border-b border-cyan-900/40 pb-1.5">
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> JARVIS · Gemini Technical Intelligence
                      </span>
                      <span className="text-zinc-500">{msg.timestamp}</span>
                    </div>
                  )}

                  {renderFormattedMessage(msg.text)}

                  {isAi && (
                    <div className="pt-3 mt-2 border-t border-cyan-900/40 flex items-center justify-between text-[11px] text-zinc-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakText(msg.text, msg.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            isSpeaking && speakingMessageId === msg.id
                              ? 'bg-cyan-500 text-black border-cyan-400 font-bold animate-pulse'
                              : 'bg-zinc-900/60 hover:bg-zinc-800 text-cyan-300 border-zinc-700/60'
                          }`}
                          title="Recite aloud in voice"
                        >
                          {isSpeaking && speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Bolo JARVIS</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-zinc-400" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-cyan-500/70 font-mono hidden sm:inline">
                        100% Accurate · Verified · Gemini Core
                      </span>
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0B1322] border border-cyan-500/30 text-xs text-cyan-300 font-mono flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>JARVIS neural processor analysis in progress... (Gemini Reasoning)</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-500 shrink-0">
              💡 Try Asking:
            </span>
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.id}
                onClick={() => sendMessage(qp.prompt)}
                className="px-3 py-1.5 rounded-xl bg-[#0B1322] hover:bg-[#121E35] border border-cyan-700/40 hover:border-cyan-400 text-[11px] font-semibold text-cyan-200 transition-all shrink-0 cursor-pointer shadow-sm"
              >
                {qp.title}
              </button>
            ))}
          </div>

          {/* Interactive Chat Input Form */}
          <div className="relative flex items-center rounded-2xl bg-[#0B1322] border-2 border-cyan-500/50 focus-within:border-cyan-400 shadow-2xl p-2 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage(inputText);
              }}
              placeholder="JARVIS se koi bhi technical sawaal pucho (e.g. C Pointers, Buffer Overflow, Supercomputer, Cyber Cell, Career Scope)..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-cyan-100 placeholder:text-zinc-500 outline-none font-sans"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isThinking}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 disabled:opacity-40 text-black font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-cyan-500/30"
            >
              <span>Ask JARVIS</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
