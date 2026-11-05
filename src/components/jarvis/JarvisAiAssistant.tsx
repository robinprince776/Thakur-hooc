import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Key,
  Trash2,
  Volume2,
  VolumeX,
  Zap,
  ArrowRight,
  Shield,
  Compass,
  Cpu,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ttsService } from '../../services/voiceService';

export interface JarvisMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actionTaken?: string;
  timestamp: number;
}

interface JarvisAiAssistantProps {
  currentApp: string;
  onNavigateApp: (appId: string) => void;
  onStartQuiz?: (trackId?: string) => void;
  onToggleTheme?: (theme?: 'dark' | 'light') => void;
  onOpenRoadmap?: () => void;
}

const QUICK_ACTIONS = [
  { label: '🗺️ Show My Roadmap', prompt: 'Show my Zero-to-Hero learning roadmap' },
  { label: '🧮 Open Calculator', prompt: 'Open Calculator CalcVault' },
  { label: '📝 Start C Programming Quiz', prompt: 'Start C programming quiz exam' },
  { label: '🐧 Launch Linux Terminal', prompt: 'Take me to Linux & Kali mastery' },
  { label: '🛡️ Open Cyber Lab', prompt: 'Open CyberShield defensive lab' },
  { label: '🌐 Explain OSI 7 Layers', prompt: 'Explain the 7 layers of OSI model in Hinglish with mnemonic' },
];

export const JarvisAiAssistant: React.FC<JarvisAiAssistantProps> = ({
  currentApp,
  onNavigateApp,
  onStartQuiz,
  onToggleTheme,
  onOpenRoadmap,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<JarvisMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-1',
        role: 'assistant',
        content: `Greetings! I am **JARVIS**, your AGI University Assistant & OS Co-Pilot.\n\nI can directly execute actions in this app (like *"Open Calculator"*, *"Start C Programming Quiz"*, or *"Show Roadmap"*) and answer questions across Computer Science, Coding, and Cybersecurity in Hinglish. What shall we conquer today?`,
        timestamp: Date.now(),
      },
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch {
      return '';
    }
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem('jarvis_chat_history', JSON.stringify(messages.slice(-20)));
    } catch {}
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSaveApiKey = (key: string) => {
    const clean = key.trim();
    setCustomApiKey(clean);
    try {
      if (clean) {
        localStorage.setItem('gemini_api_key', clean);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch {}
    setShowKeyModal(false);
  };

  const executeAction = (action: any) => {
    if (!action || !action.type) return;

    if (action.type === 'NAVIGATE' && action.targetApp) {
      if (action.targetApp === 'roadmap' && onOpenRoadmap) {
        onOpenRoadmap();
      } else {
        onNavigateApp(action.targetApp);
      }
    } else if (action.type === 'START_QUIZ') {
      if (onStartQuiz) {
        onStartQuiz(action.quizTrack || 'c-prog');
      } else {
        onNavigateApp('exam');
      }
    } else if (action.type === 'OPEN_ROADMAP') {
      if (onOpenRoadmap) {
        onOpenRoadmap();
      } else {
        onNavigateApp('roadmap');
      }
    } else if (action.type === 'SET_THEME' && onToggleTheme) {
      onToggleTheme(action.theme);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');
    const userMsg: JarvisMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          history: historyPayload,
          userApiKey: customApiKey,
          currentApp,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "I've processed your command, Boss!";

      // Execute app actions immediately if returned by model
      if (data.action) {
        executeAction(data.action);
      }

      const botMsg: JarvisMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: replyText,
        actionTaken: data.action?.type ? `${data.action.type}: ${data.action.targetApp || data.action.quizTrack || ''}` : undefined,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Voice read aloud if toggled
      if (speechEnabled) {
        // Strip markdown stars for speech
        const cleanSpeech = replyText.replace(/[*#_`]/g, '');
        ttsService.speak(cleanSpeech);
      }
    } catch (err: any) {
      console.warn('JARVIS client call error:', err);
      // Fallback response
      const fallbackReply = `Network latency detected, Boss. I can still help you navigate! Try typing "Open Calculator", "Start C Quiz", or "Show Roadmap".`;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `init_${Date.now()}`,
        role: 'assistant',
        content: `Chat history refreshed! How can I assist you with your computer science studies or app navigation?`,
        timestamp: Date.now(),
      },
    ]);
    try {
      localStorage.removeItem('jarvis_chat_history');
    } catch {}
  };

  return (
    <>
      {/* 🔮 FLOATING JARVIS AI BUTTON (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-cyan-400/40 backdrop-blur-xl"
            title="Open JARVIS AI University Co-Pilot"
          >
            {/* Animated Glowing Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-75 blur-xs group-hover:opacity-100 transition animate-pulse pointer-events-none" />

            <div className="relative flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center border border-cyan-400 text-cyan-300">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="tracking-wider uppercase font-black font-mono text-[11px] text-cyan-100">
                JARVIS AI
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </button>
        </div>
      )}

      {/* 🚀 JARVIS CHAT PANEL / MODAL */}
      {isOpen && (
        <div
          className={`fixed z-[100] transition-all duration-300 ease-out flex flex-col ${
            isMinimized
              ? 'bottom-4 right-4 w-72 h-14 rounded-2xl bg-slate-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-2xl'
              : 'bottom-4 right-4 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] backdrop-blur-2xl overflow-hidden'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-black text-white tracking-wider font-mono">
                    J.A.R.V.I.S AGI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  OS Co-Pilot · Action Capable
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                  speechEnabled
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={speechEnabled ? 'Mute voice read aloud' : 'Enable voice read aloud'}
              >
                {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setShowKeyModal(true)}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                title="Close JARVIS"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body & Chat Messages (Shown only when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap break-words ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-600/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
                        }`}
                      >
                        {m.content}

                        {m.actionTaken && (
                          <div className="mt-2 pt-2 border-t border-cyan-500/30 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>Action executed: {m.actionTaken}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 font-mono px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                      <Sparkles className="w-3 h-3 animate-spin" />
                    </div>
                    <span className="font-mono text-[11px] text-cyan-300 animate-pulse">
                      JARVIS is computing action...
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="px-3 py-1.5 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto flex items-center gap-2 no-scrollbar">
                {QUICK_ACTIONS.map((qa, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(qa.prompt)}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-[10px] font-medium text-cyan-200 hover:text-white transition cursor-pointer whitespace-nowrap active:scale-95"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask concept, or say 'Open Calculator', 'Start Quiz'..."
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-md shadow-cyan-600/20 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* API Key Modal Overlay */}
          {showKeyModal && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-5 flex flex-col justify-between animate-fade-in text-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Key className="w-4 h-4" />
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider">
                      Gemini API Key Settings
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Enter your Google Gemini API Key for direct custom model access. If left empty, JARVIS uses the high-performance server key with intelligent fallback.
                </p>

                <input
                  type="password"
                  defaultValue={customApiKey}
                  id="gemini-key-input"
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const inputEl = document.getElementById('gemini-key-input') as HTMLInputElement;
                    handleSaveApiKey(inputEl ? inputEl.value : '');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
