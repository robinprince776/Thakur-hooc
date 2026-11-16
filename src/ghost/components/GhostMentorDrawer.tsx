import React, { useState, useRef, useEffect } from 'react';
import { Shield, Send, X, Sparkles, Lock, Trash2 } from 'lucide-react';
import { GhostModuleId } from '../../store/useGhostStore';
import { GHOST_MODULES } from '../ghostModulesMeta';

interface GhostMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GhostMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeModuleId: GhostModuleId;
}

const GHOST_HINTS: Record<GhostModuleId, string[]> = {
  command: [
    'How do SOC teams prioritize threat levels?',
    'Explain how simulated attack arcs relate to geo-IP telemetry.',
  ],
  academy: [
    'Which foundational skill should I master before SIEM triage?',
    'Why does networking precede web defense?',
  ],
  missions: [
    'Give me a Socratic hint for Operation Dark Web without spoiling it.',
    'How do defenders verify phishing infrastructure safely?',
  ],
  range: [
    'Why do we check listening ports with ss or netstat first?',
    'What does UFW default deny incoming protect against?',
  ],
  terminal: [
    'Explain how grep helps filter large auth logs quickly.',
    'Why verify file integrity with sha256sum?',
  ],
  network: [
    'Walk me through the TCP 3-way handshake conceptually.',
    'How does a stateful firewall inspect SYN packets?',
  ],
  websec: [
    'Why do parameterized queries neutralize SQL injection?',
    'How does Content-Security-Policy mitigate XSS impact?',
  ],
  forensics: [
    'What are magic bytes and why ignore file extensions?',
    'What clues hide inside image EXIF metadata?',
  ],
  threatintel: [
    'How is MITRE ATT&CK used by defensive analysts?',
    'What makes a strong Indicator of Compromise (IOC)?',
  ],
  soc: [
    'How do I distinguish a True Positive from a False Positive?',
    'Give me a triage checklist for brute-force alerts.',
  ],
  aisec: [
    'Why are LLMs vulnerable to indirect prompt injection?',
    'How do defenders spot synthetic audio artifacts?',
  ],
  vault: [
    'Explain Zero Trust architecture in plain language.',
    'What makes an effective incident response summary?',
  ],
  progression: [
    'What skills define a Principal Threat Hunter?',
    'How should I structure daily defensive lab practice?',
  ],
  portfolio: [
    'How should I write remediation steps for executives?',
    'What sections belong in a professional Security Assessment Report?',
  ],
};

export const GhostMentorDrawer: React.FC<GhostMentorDrawerProps> = ({
  isOpen,
  onClose,
  activeModuleId,
}) => {
  const activeMeta = GHOST_MODULES.find((m) => m.id === activeModuleId);
  const [messages, setMessages] = useState<GhostMessage[]>([
    {
      id: 'ghost-welcome',
      role: 'assistant',
      content:
        'I am **GHOST**, your defensive security mentor. I do not generate malware, exploits, or direct quiz answers — instead, I help you reason through protocols, telemetry, and mitigation design like a senior SOC architect. What concept are you analyzing?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (textOverride?: string) => {
    const query = (textOverride ?? input).trim();
    if (!query || isLoading) return;

    setInput('');
    const userMsg: GhostMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: historyPayload,
          currentApp: `ghost:${activeMeta?.title || activeModuleId}`,
          persona: 'ghost',
        }),
      });

      const data = await res.json();
      const reply =
        data?.reply ||
        'Focus on the trust boundary and telemetry evidence first. Look at what changed between baseline and anomaly.';

      setMessages((prev) => [
        ...prev,
        {
          id: `g-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `g-err-${Date.now()}`,
          role: 'assistant',
          content:
            'Mentor relay offline — examine the sandbox evidence panel and verify assumptions against least-privilege and defense-in-depth principles.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const suggested = GHOST_HINTS[activeModuleId] || GHOST_HINTS.command;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
      />
      <aside className="relative w-full max-w-md h-full bg-[#0A0E17] border-l border-[#00E5FF]/30 flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0D1322]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/40 flex items-center justify-center text-[#00FF41]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                GHOST Mentor
              </h3>
              <p className="text-[11px] font-ghost-mono text-[#00E5FF]">
                Defensive Socratic Guide · {activeMeta?.shortTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    id: `reset-${Date.now()}`,
                    role: 'assistant',
                    content: 'Session reset. Which defensive concept or anomaly would you like a hint on?',
                    timestamp: Date.now(),
                  },
                ])
              }
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close GHOST Mentor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Policy Notice */}
        <div className="px-4 py-2 bg-[#00FF41]/5 border-b border-[#00FF41]/20 flex items-center gap-2 text-[11px] text-[#00FF41] font-ghost-mono">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Defense-only guardrail active: No exploits or malware generation.</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/35 text-slate-100'
                    : 'bg-[#101729] border border-slate-800 text-slate-200'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-xs font-ghost-mono text-[#00E5FF] px-2">
              GHOST is analyzing telemetry...
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Socratic Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#0C1220] flex flex-wrap gap-1.5">
          {suggested.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="text-left px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:border-[#00E5FF]/50 text-[11px] text-slate-300 hover:text-[#00E5FF] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 inline mr-1 text-[#00E5FF]" />
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-800 bg-[#0A0E17] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask GHOST for a defensive hint..."
            className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#111827] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#00E5FF] hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Ask</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
