import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Command,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertCircle,
  Languages
} from 'lucide-react';
import { voiceService, VoiceState } from '../services/voiceService';

interface JarvisVoiceAssistantProps {
  onNavigateApp?: (appId: string) => void;
  onNavigate?: (appId: string) => void;
  currentApp?: string;
  onOpenNavigator?: () => void;
  onToggleStealth?: () => void;
  onToggleTheme?: () => void;
  onOpenProfile?: () => void;
  onOpenNotes?: () => void;
  onOpenSkillTree?: () => void;
  onOpenQuiz?: () => void;
}

export const JarvisVoiceAssistant: React.FC<JarvisVoiceAssistantProps> = ({
  onNavigateApp,
  onNavigate,
  currentApp,
  onOpenNavigator,
  onToggleStealth,
  onToggleTheme,
  onOpenProfile,
  onOpenNotes,
  onOpenSkillTree,
  onOpenQuiz
}) => {
  const navigateTarget = onNavigateApp || onNavigate || (() => {});
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Ready for voice command');
  const [transcript, setTranscript] = useState<string>('');
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<'en-IN' | 'hi-IN' | 'en-US'>('en-IN');
  const [speechFeedbackEnabled, setSpeechFeedbackEnabled] = useState(true);
  const isSupported = voiceService.getIsSupported();

  // Register commands on mount
  useEffect(() => {
    // Cyber & Labs
    voiceService.registerCommand({
      id: 'cmd_cyber',
      keywords: ['cyber', 'cyber lab', 'security lab', 'hack', 'kali', 'defense'],
      description: 'Navigates to Cyber Security Suite & Shield',
      category: 'navigation',
      execute: () => navigateTarget('cyber'),
      responseVoice: 'Opening Cybersecurity Lab.'
    });

    voiceService.registerCommand({
      id: 'cmd_crimematrix',
      keywords: ['crime matrix', 'cyber crime', 'ss7', 'sim swap', 'ransomware'],
      description: 'Navigates to CyberCrime Matrix & Threat Intel',
      category: 'navigation',
      execute: () => navigateTarget('crimematrix'),
      responseVoice: 'Opening CyberCrime Matrix and threat intelligence.'
    });

    voiceService.registerCommand({
      id: 'cmd_mobilesec',
      keywords: ['mobile security', 'forensics', 'mobile sec', 'android logs'],
      description: 'Navigates to Mobile Security & Forensic Artifacts',
      category: 'navigation',
      execute: () => navigateTarget('mobilesec'),
      responseVoice: 'Opening Mobile Security and Forensic Lab.'
    });

    voiceService.registerCommand({
      id: 'cmd_compiler',
      keywords: ['compiler', 'c program', 'c compiler', 'code runner'],
      description: 'Opens C Compiler and verified programs',
      category: 'navigation',
      execute: () => navigateTarget('compiler'),
      responseVoice: 'Opening C Programming Compiler.'
    });

    voiceService.registerCommand({
      id: 'cmd_exam',
      keywords: ['start exam', 'exam', 'mock test', 'test', 'quiz'],
      description: 'Opens BCA Exam Simulator & Boss Challenges',
      category: 'navigation',
      execute: () => navigateTarget('exam'),
      responseVoice: 'Opening Exam Simulator and Boss Challenges.'
    });

    voiceService.registerCommand({
      id: 'cmd_myquiz',
      keywords: ['my quiz', 'quiz notes', 'active recall'],
      description: 'Opens My Quiz personalized active recall',
      category: 'navigation',
      execute: () => navigateTarget('myquiz'),
      responseVoice: 'Opening My Quiz Active Recall studio.'
    });

    voiceService.registerCommand({
      id: 'cmd_navigator',
      keywords: ['technavigator', 'navigator', 'search', 'command palette'],
      description: 'Opens TechNavigator Command Palette',
      category: 'navigation',
      execute: () => onOpenNavigator?.(),
      responseVoice: 'Opening TechNavigator command palette.'
    });

    voiceService.registerCommand({
      id: 'cmd_profile',
      keywords: ['profile', 'my progress', 'xp', 'level', 'achievements', 'badges'],
      description: 'Opens Profile Dashboard 2.0 & Gamification Hub',
      category: 'navigation',
      execute: () => onOpenProfile?.(),
      responseVoice: 'Displaying your Profile and XP Progress Dashboard.'
    });

    voiceService.registerCommand({
      id: 'cmd_notes',
      keywords: ['notes', 'my notes', 'offline notes', 'knowledge vault'],
      description: 'Opens Smart Notes & Knowledge Vault',
      category: 'navigation',
      execute: () => onOpenNotes?.(),
      responseVoice: 'Opening your Smart Notes vault.'
    });

    voiceService.registerCommand({
      id: 'cmd_stealth',
      keywords: ['stealth', 'panic', 'hide', 'emergency'],
      description: 'Toggles Stealth Panic Mode',
      category: 'system',
      execute: () => onToggleStealth?.(),
      responseVoice: 'Toggling stealth mode.'
    });

    voiceService.registerCommand({
      id: 'cmd_theme',
      keywords: ['toggle theme', 'dark mode', 'light mode', 'change theme'],
      description: 'Toggles Dark / Light Glassmorphism theme',
      category: 'system',
      execute: () => onToggleTheme?.(),
      responseVoice: 'Toggling application theme.'
    });

    voiceService.registerCommand({
      id: 'cmd_home',
      keywords: ['home', 'go home', 'dashboard', 'verse'],
      description: 'Returns to main BCA Verse Portal',
      category: 'navigation',
      execute: () => navigateTarget('bca'),
      responseVoice: 'Returning to BCA Verse Home.'
    });

    voiceService.registerCommand({
      id: 'cmd_dsa',
      keywords: ['dsa', 'data structures', 'algorithms', 'sorting'],
      description: 'Opens DSA Lab & Algorithm Visualizer',
      category: 'navigation',
      execute: () => navigateTarget('dsa'),
      responseVoice: 'Opening Data Structures and Algorithms Lab.'
    });

    voiceService.registerCommand({
      id: 'cmd_linux',
      keywords: ['linux', 'terminal', 'bash', 'shell'],
      description: 'Opens Linux Mastery Terminal simulator',
      category: 'navigation',
      execute: () => navigateTarget('linux'),
      responseVoice: 'Opening Linux Mastery Terminal.'
    });

    // Hook listeners
    voiceService.setCallbacks(
      (state, text) => {
        setVoiceState(state);
        if (text) setStatusMessage(text);
      },
      (trans, finalStatus) => {
        setTranscript(trans);
        setIsFinal(finalStatus);
      }
    );

    return () => {
      voiceService.cancelSpeech();
      voiceService.stopListening();
    };
  }, [onNavigateApp, onOpenNavigator, onToggleStealth, onToggleTheme, onOpenProfile, onOpenNotes, onNavigate, onOpenSkillTree, onOpenQuiz]);

  // Silence TTS immediately when active app or route changes
  useEffect(() => {
    voiceService.cancelSpeech();
    voiceService.stopListening();
  }, [currentApp]);

  const toggleListening = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (voiceState === 'listening') {
      voiceService.stopListening();
    } else {
      setTranscript('');
      setIsFinal(false);
      voiceService.startListening(selectedLang);
    }
  };

  return (
    <>
      {/* Floating Microphone Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-mono">
        {/* Floating Quick Action Pill */}
        <button
          onClick={toggleListening}
          aria-label="J.A.R.V.I.S Voice Control"
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-xl border ${
            voiceState === 'listening'
              ? 'bg-rose-500/30 border-rose-400 text-rose-300 ring-4 ring-rose-500/30 scale-105'
              : voiceState === 'speaking'
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 ring-4 ring-cyan-500/30'
              : 'bg-slate-900/80 hover:bg-slate-800/90 border-cyan-500/40 text-cyan-400 hover:border-cyan-400 shadow-cyan-950/40'
          }`}
        >
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Mic Icon with Live State */}
          <div className="relative">
            {voiceState === 'listening' ? (
              <Mic className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : voiceState === 'speaking' ? (
              <Volume2 className="w-5 h-5 text-cyan-400 animate-bounce" />
            ) : (
              <Mic className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            )}
            {voiceState === 'listening' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>

          <span className="text-xs font-bold tracking-wider hidden sm:inline text-white">
            {voiceState === 'listening'
              ? 'Listening...'
              : voiceState === 'processing'
              ? 'Processing...'
              : voiceState === 'speaking'
              ? 'Speaking...'
              : 'J.A.R.V.I.S'}
          </span>

          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold">
            Voice
          </span>
        </button>

        {/* Voice HUD Dialog / Modal Drawer */}
        {isOpen && (
          <div className="w-[340px] sm:w-[380px] bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-slate-100 animate-in fade-in slide-in-from-bottom-4 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">J.A.R.V.I.S Voice Control</h4>
                  <p className="text-[10px] text-cyan-400">Intelligent Digital Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Speech Feedback Toggle */}
                <button
                  onClick={() => setSpeechFeedbackEnabled(!speechFeedbackEnabled)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    speechFeedbackEnabled
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={speechFeedbackEnabled ? 'Voice feedback ON' : 'Voice feedback MUTED'}
                >
                  {speechFeedbackEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between mb-3 bg-black/40 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-cyan-400" /> Dialect:
              </span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'en-IN', label: 'Hinglish' },
                  { id: 'hi-IN', label: 'हिन्दी' },
                  { id: 'en-US', label: 'English' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setSelectedLang(lang.id as any);
                      if (voiceState === 'listening') {
                        voiceService.stopListening();
                        setTimeout(() => voiceService.startListening(lang.id as any), 150);
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      selectedLang === lang.id
                        ? 'bg-cyan-500 text-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualizer Waveform Animation */}
            <div className="h-14 bg-black/60 rounded-2xl border border-slate-800/80 flex items-center justify-center gap-1.5 px-4 overflow-hidden relative mb-3">
              {voiceState === 'listening' ? (
                <>
                  <div className="w-1.5 bg-rose-500 rounded-full animate-bounce h-8" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 bg-amber-400 rounded-full animate-bounce h-12" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 bg-cyan-400 rounded-full animate-bounce h-10" style={{ animationDelay: '300ms' }} />
                  <div className="w-1.5 bg-blue-500 rounded-full animate-bounce h-7" style={{ animationDelay: '100ms' }} />
                  <div className="w-1.5 bg-emerald-400 rounded-full animate-bounce h-11" style={{ animationDelay: '250ms' }} />
                  <div className="w-1.5 bg-purple-500 rounded-full animate-bounce h-8" style={{ animationDelay: '200ms' }} />
                  <span className="absolute bottom-1 right-2 text-[9px] text-rose-400 animate-pulse font-bold">● LISTENING</span>
                </>
              ) : voiceState === 'speaking' ? (
                <>
                  <div className="w-1.5 bg-cyan-400 rounded-full animate-pulse h-10" />
                  <div className="w-1.5 bg-blue-400 rounded-full animate-pulse h-6" />
                  <div className="w-1.5 bg-teal-400 rounded-full animate-pulse h-9" />
                  <span className="absolute bottom-1 right-2 text-[9px] text-cyan-400 font-bold">SYNTHESIZING AUDIO</span>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                    <span>{statusMessage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recognized Speech Text Display */}
            <div className="bg-black/50 p-3 rounded-xl border border-slate-800 min-h-[50px] mb-3 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Live Transcript:</span>
              <p className="text-xs text-cyan-300 font-semibold italic">
                {transcript || (voiceState === 'listening' ? 'Speak now...' : 'Click "Start Listening" below to speak')}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={toggleListening}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all shadow-lg ${
                  voiceState === 'listening'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950'
                }`}
              >
                {voiceState === 'listening' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{voiceState === 'listening' ? 'Stop Listening' : 'Start Listening'}</span>
              </button>
            </div>

            {/* Quick Command Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Supported Voice Commands:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  'Open Cyber Lab',
                  'Start Exam',
                  'Show My Progress',
                  'Open C Compiler',
                  'My Notes',
                  'Toggle Stealth',
                  'Open TechNavigator'
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      voiceService.executeCommand(sample);
                    }}
                    className="px-2 py-1 rounded-lg bg-black/40 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-[10px] text-slate-300 hover:text-cyan-300 transition-all text-left"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {!isSupported && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/50 border border-amber-600/50 text-[10px] text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Web Speech recognition is unsupported in this browser. You can click any sample command above to execute directly!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
