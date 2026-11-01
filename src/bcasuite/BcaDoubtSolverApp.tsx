import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  User,
  ArrowRight
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface BcaDoubtSolverProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  '3nf': `🎯 3NF vs BCNF (Boyce-Codd Normal Form) Breakdown:

1. Third Normal Form (3NF):
- Condition: Table must be in 2NF.
- Rule: No non-prime attribute should be transitively dependent on the Primary Key. (X -> Y: either X is a superkey OR Y is a prime attribute).
- Advantage: Always preserves functional dependencies and is lossless.

2. Boyce-Codd Normal Form (BCNF):
- Stricter version of 3NF.
- Rule: For every functional dependency X -> Y, X MUST be a Super Key (no exceptions!).
- Real-World Analogy: In 3NF, a junior manager can sometimes approve leave if they have specific clearance. In BCNF, ONLY the CEO (Super Key) has the authority to make any decision.

💡 Viva Exam Question: "Can every table in 3NF be decomposed into BCNF while preserving dependencies?"
Answer: No! BCNF decomposition is always lossless, but it may not always preserve all functional dependencies.`,

  'process': `⚡ Process vs Thread in Operating Systems:

1. Process:
- Definition: An executing program in memory.
- Address Space: Has its own isolated virtual memory space (Stack, Heap, Data, Text).
- Creation Cost: Heavyweight. High context switching overhead.
- Communication: Inter-Process Communication (IPC: Pipes, Shared Memory, Sockets).

2. Thread:
- Definition: A lightweight unit of execution within a process.
- Address Space: Shares code section, data section, and OS resources with peer threads, but has its own Program Counter (PC) and Stack.
- Creation Cost: Low overhead. Very fast context switching.

💡 Viva Tip: If one thread crashes due to a segmentation fault, it can crash the entire process! But if one process crashes, other processes remain unharmed.`,

  'astar': `🗺️ How A* Search Algorithm Works (AI):

A* is an informed search algorithm used in game navigation and GPS maps.

1. Evaluation Function:
   f(n) = g(n) + h(n)
   - g(n): Exact cost incurred so far from start node to current node n.
   - h(n): Estimated cost (heuristic) from current node n to goal.
   - f(n): Total estimated cost of path through node n.

2. Optimality Guarantee:
   - If heuristic h(n) is admissible (it never overestimates the actual cost to reach goal), A* is guaranteed to return the OPTIMAL shortest path!

💡 Real-World Example: In Google Maps, g(n) is the actual kilometers driven, and h(n) is the straight-line aerial distance to destination.`,

  'pointers': `💻 C++ Pointers vs References:

1. Pointer (int *ptr = &x):
- Can be NULL: Yes.
- Can be reassigned to another memory address: Yes.
- Has its own memory address (&ptr != &x): Yes (4 or 8 bytes).
- Requires dereferencing (*ptr) to access value.

2. Reference (int &ref = x):
- Can be NULL: NEVER. Must be initialized upon declaration.
- Can be reassigned: No, it permanently aliases the original variable.
- Syntax: Used just like a regular variable without * or &.

💡 Exam Viva Rule: "Pass-by-reference" in C++ is preferred for large objects to avoid copying overhead while keeping clean syntax!`
};

export const BcaDoubtSolverApp: React.FC<BcaDoubtSolverProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste! Main aapka **BCA AI Doubt Solver** hoon. BCA ke kisi bhi subject (Python, Java, C++, OS, DBMS, DAA, AI, Cloud, Math) me koi bhi doubt ho, niche poochhein!`,
      timestamp: Date.now()
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = query.toLowerCase();
      let response = '';

      if (lower.includes('3nf') || lower.includes('bcnf') || lower.includes('normalization')) {
        response = KNOWLEDGE_RESPONSES['3nf'];
      } else if (lower.includes('process') || lower.includes('thread')) {
        response = KNOWLEDGE_RESPONSES['process'];
      } else if (lower.includes('a*') || lower.includes('astar') || lower.includes('heuristic')) {
        response = KNOWLEDGE_RESPONSES['astar'];
      } else if (lower.includes('pointer') || lower.includes('reference')) {
        response = KNOWLEDGE_RESPONSES['pointers'];
      } else {
        response = `📚 **BCA Concept Breakdown for "${query}":**

1. **Definition & Core Concept:**
   - In computer science and BCA syllabus, this topic represents a foundational building block for software architecture and exams.

2. **Key Working Mechanism:**
   - Follows standardized algorithms ensuring predictable time complexity and thread-safe memory isolation.

3. **Viva & Exam Important Point:**
   - Examiner questions often revolve around boundary conditions, edge cases, and comparison with legacy approaches.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">BCA AI Doubt Solver</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Instant Concept & Viva Clarifier
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ask any question from Sem 1 to Sem 6: Python, Java, DBMS, OS, DAA, AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 spring-press cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 spring-press cursor-pointer"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Flow */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        {/* Quick Suggestion Chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            'Explain 3NF vs BCNF',
            'Difference between Process and Thread',
            'How does A* search work',
            'Pointers vs References in C++'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs font-medium transition-all spring-press cursor-pointer flex items-center gap-1"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 mb-4 select-text">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 animate-fade-in ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-3xl shadow-xl leading-relaxed text-xs sm:text-sm ${
                    isUser
                      ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-50 rounded-tr-sm'
                      : 'glass-card border-white/10 text-slate-200 rounded-tl-sm whitespace-pre-wrap font-sans'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse">
              <Bot className="w-4 h-4" />
              <span>AI is thinking & analyzing concept...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-2 rounded-2xl glass-card border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your BCA question (e.g. What is Knapsack in DAA?)..."
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/25 spring-press cursor-pointer disabled:opacity-40"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
};
