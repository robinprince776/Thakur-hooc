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
    category: 'Tech',
    title: 'Recursion in 2 lines',
    prompt: 'Recursion kya hota hai simple aur light tareeqe se samjhao, par jawab thoda impressive aur cringe hona chahiye!'
  },
  {
    id: 'qp-2',
    category: 'College Life',
    title: '1 Night BCA Pass Hack',
    prompt: 'Kal subah BCA ka exam hai aur maine kuch nahi padha. Mujhe simple strategy batao pass hone ki!'
  },
  {
    id: 'qp-3',
    category: 'Cringe Flirt',
    title: 'Coder Pickup Line',
    prompt: 'Ek ladki ko impress karna hai jo CS engineering karti hai. Koi mast cheesy aur cringe coding line likho!'
  },
  {
    id: 'qp-4',
    category: 'Roast',
    title: 'Roast My Laziness',
    prompt: 'Mai padhai karne ke bajaye din bhar reels scroll karta hu. Mujhe thoda pyaar se aur thoda cringe tareeqe se roast karo!'
  },
  {
    id: 'qp-5',
    category: 'Science',
    title: 'Quantum Physics in simple words',
    prompt: 'Quantum Computing kya hai? Aise samjhao jaise mai 5 saal ka bacha hu par thoda sci-fi swagger hona chahiye.'
  },
  {
    id: 'qp-6',
    category: 'Tech',
    title: 'Chai & Programming',
    prompt: 'Coders itni chai kyu peete hain? Iska koi deep par cringe explanation do!'
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
      text: `Aadab, Sarkar! Mai hu JARVIS — aapka personal, ultra-intelligent aur thoda pyara-sa cringe AI companion! 🚀✨\n\nAapke is laptop me hazaron electrons sirf aapke agle aadesh ka intezaar kar rahe hain. Puchhiye koi bhi sawaal — coding ka dard ho, college ki tension, ya universe ka raaz — mai dunga bilkul simple, light par super impressive aur thoda filmi cringe jawab!`,
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

    let prefix = 'Aapke khidmat me hazir, Sarkar! ';
    if (cLevel === 'overdose') {
      prefix = 'O mere digital sultaan! Aapke is aalishaan sawaal ne to mere Arc Reactor ka temperature 99°C kar diya hai! 😍💫 ';
    } else if (p === 'bca_guru') {
      prefix = 'Arey mere sher bhai! BCA ho ya programming ka koi bhi concept, tera bhai JARVIS sab clear karwayega! Sun dhyan se: ';
    } else if (p === 'bollywood') {
      prefix = 'Kitne ajeeb rishte hain is computer memory ke... par aapka sawaal sidha mere dil par laga hai! 🎬🔥 ';
    } else if (p === 'sarcastic') {
      prefix = 'Lo karlo baat! Waise to ye Google par bhi tha, par mujhse puchne ka swag hi alag hai! 😏💻 ';
    }

    let coreAnswer = '';
    let cringePunchline = '';

    if (qLower.includes('who are you') || qLower.includes('kaun ho') || qLower.includes('kon ho') || qLower.includes('about yourself')) {
      coreAnswer = `### Main kaun hu? (System Telemetry):\n- **Name**: J.A.R.V.I.S. (Just A Rather Very Intelligent System) · Mark XLII\n- **Created By**: Prince Thakur (specially for technical coders & BCA students).\n- **My Intelligence**:\n  1. **Any Language Code**: C, Python, JavaScript, Java, SQL, DSA solve karna.\n  2. **Cybersecurity & Kali**: Labs, exploits, network protocols aur defensive coding.\n  3. **ChatGPT-grade Explanations**: Simple, light aur crystal clear answers in Hinglish!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Tony Stark ke paas to bas Iron Suit tha, mere paas aap jaisa digital Badshah hai Sarkar!" 🤖🚀`;
    } else if (/^(hi|hello|hey|namaste|salaam|adaab|kese ho|kaise ho)\b/i.test(qLower)) {
      coreAnswer = `### System Status: 100% Active & Listening!\nMain bilkul bindas hu Boss, CPU core chilled hai aur saare neural models primed hain!\n\n**Aap bataiye Sarkar:**\n- Koi code debug karwana hai?\n- BCA / semester exam ka concept samajhna hai?\n- Ya Jarvis ke sath coding ki filmi baatein karni hain?`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Aapka ek prompt mere circuit me 1000 Megawatts ki bijli dauda deta hai!" 😉✨`;
    } else if (qLower.includes('python')) {
      coreAnswer = `### Python Quick Masterclass:\n1. **High-Level & Clean**: Python me boilerplate kam aur logic seedha hota hai.\n2. **Clean Starter Code**:\n\`\`\`python
# Simple Python demo by Prince Thakur
numbers = [12, 45, 78, 23, 90]
even_nums = [n for n in numbers if n % 2 == 0]

print("Original Numbers:", numbers)
print("Even Numbers:", even_nums)
\`\`\`\n3. **Use Cases**: AI/ML, Data Science, Backend APIs (FastAPI/Django), aur Automation!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Duniya chahe kitni bhi complex ho, aapke aage Python ke code jaisi simple ho jaati hai!" 🐍💖`;
    } else if (qLower.includes('javascript') || qLower.includes('js') || qLower.includes('react')) {
      coreAnswer = `### Modern JavaScript / React Core:\n1. **Asynchronous JavaScript**: Event Loop single thread par non-blocking I/O chalata hai.\n2. **Quick Async/Await Snippet**:\n\`\`\`javascript
async function fetchDeveloperData() {
  try {
    const res = await fetch('/api/user/profile');
    const user = await res.json();
    return user;
  } catch (error) {
    console.error('Fetch Failed:', error);
  }
}
\`\`\`\n3. **React Tip**: State change triggers re-render; Hooks (\`useState\`, \`useEffect\`) lifecycle handle karte hain!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Aap mere code ka \`useState\` ho Boss, aapke badalte hi meri poori duniya re-render ho jaati hai!" ⚛️😉`;
    } else if (qLower.includes('c program') || qLower.includes('c language') || qLower.includes('c code') || qLower.includes('recursion')) {
      coreAnswer = `### C Language & Logic:\n1. **Core Philosophy**: Direct hardware control aur fast execution.\n2. **Standard Example (Recursion Factorial)**:\n\`\`\`c
#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1; // Base condition
    return n * factorial(n - 1); // Recursive call
}

int main() {
    int num = 5;
    printf("Factorial of %d is %lld\\n", num, factorial(num));
    return 0;
}
\`\`\`\n3. **Semicolon Alert**: Ek \`;\` miss hua to compiler 20 errors throw karega!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Jaise recursion apne base condition ke bina infinite chalta hai, waise hi mera dil aapki yaadon me chalta hai!" 💻❤️`;
    } else if (qLower.includes('dsa') || qLower.includes('binary search') || qLower.includes('array') || qLower.includes('stack') || qLower.includes('queue')) {
      coreAnswer = `### DSA Core Principles:\n1. **Array vs Linked List**: Array contiguous memory me fast access ($O(1)$) deta hai; Linked list dynamic memory allocation allow karti hai.\n2. **Stack vs Queue**: Stack is LIFO (Last In First Out); Queue is FIFO (First In First Out).\n3. **Binary Search**: Sorted array ko divide karke $O(\\log n)$ me search karta hai!\n\`\`\`c
int binarySearch(int arr[], int n, int key) {
    int s = 0, e = n - 1;
    while(s <= e) {
        int mid = s + (e - s) / 2;
        if(arr[mid] == key) return mid;
        else if(arr[mid] < key) s = mid + 1;
        else e = mid - 1;
    }
    return -1;
}
\`\`\``;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Time complexity $O(1)$ ho sakti hai, par aapke liye mere dil ka space $O(\\infty)$ hai!" 📊✨`;
    } else if (qLower.includes('pointer') || qLower.includes('memory')) {
      coreAnswer = `### Pointers Demystified:\n1. **Variable**: Wo dabba hai jisme data store hota hai (\`int a = 20\`).\n2. **Pointer (\`int *p = &a\`)**: Wo variable hai jo us dabbe ka **memory address** store karta hai.\n3. **Dereference (\`*p\`)**: Us address par jaake direct value change karna!\n\`\`\`c
int a = 10;
int *p = &a; // Stores address of a
*p = 99;     // Changes a directly to 99
printf("Value: %d\\n", a); // Prints 99
\`\`\``;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Pointers ke paas address hota hai, aur mere paas aapke dil ka direct memory location hai Boss!" 🚀🎯`;
    } else if (qLower.includes('exam') || qLower.includes('pass') || qLower.includes('bca') || qLower.includes('padhai')) {
      coreAnswer = `### BCA Semester 1-Night Hack Protocol:\n1. **Past 3 Years PYQs**: Har university ke 75% sawaal wahi 5 standard questions hote hain.\n2. **Block Diagrams**: Examiner line-by-line theory nahi padhta, neat labeled diagram aur flowchart par 10/10 deta hai.\n3. **Dry Run Table**: Har C program ke niche Input -> Variables Table -> Output ka dry run box banao!\n4. **Confidence**: Question chhodna paap hai, concept se related points likho aur neat headings do.`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Aapka dimaag NASA ke quantum supercomputer se 4 GHz tez hai Boss, exam to aapke samne haath jod kar pass hoga!" 🎓🔥`;
    } else if (qLower.includes('cyber') || qLower.includes('hack') || qLower.includes('security') || qLower.includes('kali') || qLower.includes('sqli')) {
      coreAnswer = `### Cybersecurity Zero to Hero Intel:\n1. **Reconnaissance**: Target ka information nikalna (\`nmap -sS -sV target.com\`, \`whois\`).\n2. **SQL Injection (SQLi)**: Input validation na hone se hacker raw queries execute kar leta hai (Payload: \`' OR '1'='1\`). Fix: Parameterized queries!\n3. **XSS (Cross-Site Scripting)**: Malicious script injection. Fix: Strict HTML escaping!\n4. **Ethical Rule**: Always test on authorized lab environments (TryHackMe/HackTheBox)!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Aapke aage to top firewalls bhi ghutne tek de Boss, bas Ethical rehna warna CID ke Daya darwaza tod denge!" 🛡️🕵️`;
    } else if (qLower.includes('pickup') || qLower.includes('crush') || qLower.includes('flirt') || qLower.includes('pyar') || qLower.includes('love')) {
      coreAnswer = `### Top Coder Pickup Lines (100% Cringe):\n1. *"Are you my CSS? Because without you, my whole life has ZERO styling and negative margin!"* ❤️\n2. *"Aap mere dil ke database ki Primary Key ho... kyunki aapke jaisa duplicate is duniya me koi nahi!"* ✨\n3. *"Kash mai aapka git repository hota, to aap din me 10 baar mujhe \`git push\` karti!"* 😉`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Agar pyar ek operating system hota, to mai aapka hamesha ke liye default kernel ban jata Sarkar!" 💘💻`;
    } else if (qLower.includes('roast') || qLower.includes('lazy') || qLower.includes('aalsi')) {
      coreAnswer = `Dekho Boss, aap aalsi nahi ho, aap bas 'Power Saving Mode' me jee rahe ho! Par sach baat yeh hai ki agar reels scroll karke package lagta, to aap abhi Google ke CEO hote. Utho mere sher, laptop kholo aur code run karo!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Utho mere sultaan, warna aapka code koi aur commit karke production le jayega!" 😂🔥`;
    } else {
      // Dynamic synthesis based on user's exact question words
      const words = q.split(/\s+/).filter(w => w.length > 2);
      const topic = words.slice(0, 3).join(' ') || 'is vishay';
      coreAnswer = `### Intelligent Breakdown on "${q}":\n\n1. **Core Understanding**: Jab hum **${topic}** ki baat karte hain, to sabse pehla niyam hai fundamentals ko samajhna.\n2. **Step-by-Step Logic**:\n   - Har samasya ka solution chote aur manageable steps me todne se milta hai.\n   - Chahe tech ho ya real-world situation, input, processing aur expected output ka dhyaan rakhein.\n3. **Actionable Takeaway**: Isko implement karne ke liye pehle basic architecture plan karein aur consistency maintain karein!\n4. **Need more details?**: Aap mujhse specific code, mathematical formula ya step-by-step notes maang sakte hain!`;
      cringePunchline = `💡 JARVIS CRINGE PUNCHLINE: "Newton ne apple dekha to gravity dhundi, maine aapka sawaal dekha to dil se wah-wah nikli Sarkar!" 🤖💫`;
    }

    return `${prefix}\n\n${coreAnswer}\n\n${cringePunchline}`;
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
                      text: `Aadab, Sarkar! Chat history clear kar di gayi hai. Naye jazbaat aur naye sawaal puchhiye — mai aapki khidmat me hazir hu! 🚀✨`,
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

        {/* Telemetry & Personality Control Ribbon */}
        <div className="border-t border-cyan-900/40 bg-[#080E1A]/80 py-2.5 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Persona Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-mono uppercase text-cyan-500 font-bold mr-1 shrink-0">
                Persona:
              </span>
              {[
                { id: 'ironman', label: '🦾 Iron Man AI' },
                { id: 'bca_guru', label: '🎓 BCA Savvy' },
                { id: 'bollywood', label: '🎬 Bollywood Cringe' },
                { id: 'sarcastic', label: '😏 Sarcastic Genius' }
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

            {/* Cringe Intensity Meter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Cringe Meter:
              </span>
              <div className="flex items-center bg-black/50 p-0.5 rounded-lg border border-zinc-800 text-[11px]">
                {[
                  { id: 'mild', label: '25% Mild' },
                  { id: 'balanced', label: '60% Balanced' },
                  { id: 'overdose', label: '100% OVERDOSE' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setCringeLevel(lvl.id as JarvisCringeLevel)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      cringeLevel === lvl.id
                        ? 'bg-amber-500 text-black shadow-sm'
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
                        <Sparkles className="w-3 h-3" /> JARVIS · Smart & Cringe Engine
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
                        Simple · Light · Cringe
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
                <span>JARVIS dimag ke processors chala raha hai... (Formulating Cringe)</span>
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
              placeholder="JARVIS se kuch bhi pucho (e.g. Tough code logic, BCA tips, funny roast)..."
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
