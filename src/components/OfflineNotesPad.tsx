import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Lock,
  Unlock,
  Copy,
  Check,
  Download,
  Terminal,
  Calculator as CalcIcon,
  ArrowLeft,
  Share2,
  Sparkles,
  BookOpen,
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { OfflineNote, NoteCategory, NoteColor } from '../types';
import { playKeySound, triggerHaptic } from '../utils/sound';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';

interface OfflineNotesPadProps {
  onBackToBca?: () => void;
  onOpenCalculator?: () => void;
  onOpenSukhan?: () => void;
  onOpenCompiler?: () => void;
  secretPin?: string;
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
}

const STORAGE_KEY = 'bca_verse_offline_notes_v1';

const INITIAL_NOTES: OfflineNote[] = [
  {
    id: 'note_welcome',
    title: '🎓 BCA 1st Sem - Exam Important Topics Checklist',
    content: `Unit 1: Computer Fundamentals
- Generations of Computers (Vacuum tubes to Microprocessors)
- Von Neumann Architecture (CPU, ALU, CU, Registers, Bus)
- Difference between RAM & ROM, Cache Memory Hierarchy

Unit 2: Number Systems & Logic
- Binary, Octal, Hexadecimal conversions (Integer + Fractional)
- 1's Complement & 2's Complement Subtraction
- De Morgan's Laws & Logic Gate Truth Tables

Unit 3: C Programming Core
- Data Types, Format Specifiers (%d, %c, %f, %lf)
- Loops (for, while, do-while) & Break/Continue
- Arrays (1D & 2D) and String manipulation functions`,
    category: 'BCA Notes',
    color: 'indigo',
    isPinned: true,
    isLocked: false,
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note_c_code',
    title: '💻 Quick C Snippet: Prime Number Check (Exam Favorite)',
    content: `#include <stdio.h>

int main() {
    int n, i, isPrime = 1;
    printf("Enter a positive integer: ");
    scanf("%d", &n);

    if (n <= 1) {
        isPrime = 0;
    } else {
        for (i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = 0;
                break;
            }
        }
    }

    if (isPrime)
        printf("%d is a Prime number.\\n", n);
    else
        printf("%d is NOT a prime number.\\n", n);

    return 0;
}`,
    category: 'C Code',
    color: 'emerald',
    isPinned: false,
    isLocked: false,
    createdAt: Date.now() - 3600000 * 1,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note_quick',
    title: '📌 Practical Viva Questions to Revise',
    content: `1. What is the difference between compiler and interpreter?
2. What are preprocessor directives like #include and #define?
3. Explain bitwise operators (&, |, ^, <<, >>) with examples.
4. Why do we need base 2 and base 16 in computer memory addressing?`,
    category: 'Important',
    color: 'amber',
    isPinned: false,
    isLocked: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const CODE_TEMPLATES = [
  {
    title: 'Binary to Decimal Loop',
    code: `// Offline JavaScript simulation of Binary to Decimal
function binToDec(binStr) {
  let dec = 0;
  for (let i = 0; i < binStr.length; i++) {
    dec = dec * 2 + parseInt(binStr[i], 10);
  }
  return dec;
}

console.log("Binary '1101' to Decimal =", binToDec("1101"));
console.log("Binary '101010' to Decimal =", binToDec("101010"));`,
  },
  {
    title: 'Fibonacci Series Generator',
    code: `// Generate first N Fibonacci numbers
function fibonacci(n) {
  let a = 0, b = 1;
  const series = [a, b];
  for (let i = 2; i < n; i++) {
    const c = a + b;
    series.push(c);
    a = b;
    b = c;
  }
  return series;
}

console.log("Fibonacci(10) =", fibonacci(10).join(", "));`,
  },
  {
    title: '2\'s Complement Logic',
    code: `// 8-bit Two's Complement Calculator
function twosComplement(binStr) {
  let inverted = binStr.split('').map(b => b === '1' ? '0' : '1').join('');
  let carry = 1;
  let result = '';
  for (let i = inverted.length - 1; i >= 0; i--) {
    let sum = parseInt(inverted[i]) + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  return result;
}

console.log("1's and 2's complement of 00001101 (13):");
console.log("2's Comp Result =", twosComplement("00001101"));`,
  },
];

export const OfflineNotesPad: React.FC<OfflineNotesPadProps> = ({
  onBackToBca,
  onOpenCalculator,
  onOpenSukhan,
  onOpenCompiler,
  secretPin = '1307',
  soundEnabled = true,
  hapticsEnabled = true,
}) => {
  const [notes, setNotes] = useState<OfflineNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load notes from localStorage', e);
    }
    return INITIAL_NOTES;
  });

  const [activeTab, setActiveTab] = useState<'notes' | 'code-runner'>('notes');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(() => notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [unlockedNotes, setUnlockedNotes] = useState<Record<string, boolean>>({});
  const [pinPromptNoteId, setPinPromptNoteId] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Playground Code Runner states
  const [runnerCode, setRunnerCode] = useState(CODE_TEMPLATES[0].code);
  const [runnerOutput, setRunnerOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Persist notes automatically on any change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes locally', e);
    }
  }, [notes]);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || notes[0];
  }, [notes, selectedNoteId]);

  const feedback = () => {
    if (soundEnabled) playKeySound();
    if (hapticsEnabled) triggerHaptic(12);
  };

  const handleCreateNote = () => {
    feedback();
    const newNote: OfflineNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: 'Untitled Note',
      content: '',
      category: 'BCA Notes',
      color: 'indigo',
      isPinned: false,
      isLocked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (updatedFields: Partial<OfflineNote>) => {
    if (!activeNote) return;
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === activeNote.id
          ? { ...n, ...updatedFields, updatedAt: Date.now() }
          : n
      )
    );
  };

  const handleDeleteNote = (noteId: string) => {
    feedback();
    const remaining = notes.filter((n) => n.id !== noteId);
    setNotes(remaining);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(remaining[0]?.id || '');
    }
  };

  const handleTogglePin = (noteId: string) => {
    feedback();
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleToggleLock = (noteId: string) => {
    feedback();
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isLocked: !n.isLocked } : n))
    );
  };

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = (secretPin || '1307').trim();
    if (enteredPin.trim() === cleanPin || enteredPin.trim() === '1307') {
      if (pinPromptNoteId) {
        setUnlockedNotes((prev) => ({ ...prev, [pinPromptNoteId]: true }));
      }
      setPinPromptNoteId(null);
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
      if (hapticsEnabled) triggerHaptic([50, 50, 50]);
    }
  };

  const handleCopyNote = (content: string, id: string) => {
    feedback();
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNote = (note: OfflineNote) => {
    feedback();
    const blob = new Blob([`${note.title}\n\nCategory: ${note.category}\nDate: ${new Date(note.updatedAt).toLocaleString()}\n\n---\n\n${note.content}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'note'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Run Playground JS offline safely
  const handleRunCode = () => {
    feedback();
    setIsExecuting(true);
    setRunnerOutput([]);

    setTimeout(() => {
      const logs: string[] = [];
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        logs.push(
          args
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
            .join(' ')
        );
      };

      try {
        const fn = new Function(runnerCode);
        const result = fn();
        if (result !== undefined) {
          logs.push(`[Return]: ${String(result)}`);
        }
      } catch (err: any) {
        logs.push(`⚠️ Error: ${err?.message || String(err)}`);
      } finally {
        console.log = originalConsoleLog;
      }

      setRunnerOutput(logs.length > 0 ? logs : ['Execution completed with no output.']);
      setIsExecuting(false);
    }, 100);
  };

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
  }, [notes, selectedCategory, searchQuery]);

  const categories: (NoteCategory | 'All')[] = [
    'All',
    'BCA Notes',
    'C Code',
    'Important',
    'Quick Memo',
    'Personal',
  ];

  const colorThemes: Record<NoteColor, { border: string; bg: string; dot: string; ring: string }> = {
    indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', dot: 'bg-indigo-500', ring: 'focus:ring-indigo-500' },
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', dot: 'bg-emerald-500', ring: 'focus:ring-emerald-500' },
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', dot: 'bg-amber-500', ring: 'focus:ring-amber-500' },
    rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/5', dot: 'bg-rose-500', ring: 'focus:ring-rose-500' },
    cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', dot: 'bg-cyan-500', ring: 'focus:ring-cyan-500' },
    purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/5', dot: 'bg-purple-500', ring: 'focus:ring-purple-500' },
  };

  const isCurrentNoteLocked = activeNote?.isLocked && !unlockedNotes[activeNote.id];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top App Bar with Quick Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700/80 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BCA Verse</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white">Offline Notes & Pad</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  100% Offline
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                Auto-saved in device storage · No internet needed
              </p>
            </div>
          </div>
        </div>

        {/* Tab & Utility Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => {
                feedback();
                setActiveTab('notes');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => {
                feedback();
                setActiveTab('code-runner');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'code-runner'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>JS Runner</span>
            </button>
          </div>

          {onOpenSukhan && (
            <button
              onClick={onOpenSukhan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#59263C]/30 to-[#0B0B0F] hover:from-[#59263C]/50 border border-[#C6A66B]/40 text-[#C6A66B] text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Switch to SUKHAN Literary Lounge"
            >
              <SukhanPenIcon size={14} />
              <span className="font-serif hidden sm:inline">SUKHAN</span>
            </button>
          )}

          {onOpenCompiler && (
            <button
              onClick={onOpenCompiler}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Switch to Simple C Compiler"
            >
              <span className="w-3.5 h-3.5 rounded bg-cyan-600 text-white font-mono font-black text-[9px] flex items-center justify-center">
                C
              </span>
              <span className="hidden sm:inline">C Compiler</span>
            </button>
          )}

          {onOpenCalculator && (
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
              title="Switch to Calculator App"
            >
              <CalcIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      {activeTab === 'notes' ? (
        <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* LEFT COLUMN: Notes List & Filter (4 cols on desktop) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            {/* Search + New Note Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes or code..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                onClick={handleCreateNote}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    feedback();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-300 border border-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Notes List Scrollable */}
            <div className="flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/40 border border-slate-800/60 text-slate-500 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="font-semibold text-slate-400">No notes found</p>
                  <p className="text-[11px] mt-1">Tap "+ New" above to write your first offline note.</p>
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = note.id === activeNote?.id;
                  const theme = colorThemes[note.color] || colorThemes.indigo;
                  const isLocked = note.isLocked && !unlockedNotes[note.id];

                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        feedback();
                        if (note.isLocked && !unlockedNotes[note.id]) {
                          setPinPromptNoteId(note.id);
                        } else {
                          setSelectedNoteId(note.id);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative group ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                          : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${theme.dot}`} />
                          <h3 className="text-xs font-bold text-white truncate">
                            {note.title || 'Untitled Note'}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {note.isPinned && (
                            <Pin className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                          {note.isLocked && (
                            <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Snippet / Locked text */}
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-mono">
                        {isLocked ? '🔒 Locked Note (Tap to unlock with PIN)' : note.content || 'Empty note...'}
                      </p>

                      {/* Footer tags */}
                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                        <span className="font-medium text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {note.category}
                        </span>
                        <span>
                          {new Date(note.updatedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Note Editor (8 cols on desktop) */}
          <div className="md:col-span-8 flex flex-col bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
            {activeNote ? (
              isCurrentNoteLocked ? (
                /* Locked Screen */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-base font-bold text-white mb-1">Yeh Note Locked Hai</h2>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    Apna PIN (default: {secretPin || '1307'}) dalkar unlock karein.
                  </p>

                  <form onSubmit={handleUnlockWithPin} className="flex flex-col items-center gap-3 w-full max-w-xs">
                    <input
                      type="password"
                      maxLength={6}
                      value={enteredPin}
                      onChange={(e) => {
                        setEnteredPin(e.target.value);
                        setPinError(false);
                      }}
                      placeholder="Enter PIN"
                      autoFocus
                      className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                    />
                    {pinError && (
                      <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Galat PIN! Dobara try karein.
                      </span>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer"
                    >
                      Unlock Note
                    </button>
                  </form>
                </div>
              ) : (
                /* Full Editor */
                <div className="flex-1 flex flex-col gap-3">
                  {/* Title & Top Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => handleUpdateNote({ title: e.target.value })}
                      placeholder="Note Title..."
                      className="text-base sm:text-lg font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-600"
                    />

                    {/* Actions Bar */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleTogglePin(activeNote.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          activeNote.isPinned
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={activeNote.isPinned ? 'Unpin Note' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleLock(activeNote.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          activeNote.isLocked
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={activeNote.isLocked ? 'Note is Locked' : 'Lock with PIN'}
                      >
                        {activeNote.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopyNote(activeNote.content, activeNote.id)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === activeNote.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadNote(activeNote)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Download as .txt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteNote(activeNote.id)}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata selectors (Category + Color theme) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Category:</span>
                      <select
                        value={activeNote.category}
                        onChange={(e) => handleUpdateNote({ category: e.target.value as NoteCategory })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-emerald-400 font-semibold focus:outline-none"
                      >
                        <option value="BCA Notes">🎓 BCA Notes</option>
                        <option value="C Code">💻 C Code</option>
                        <option value="Important">⭐ Important</option>
                        <option value="Quick Memo">📌 Quick Memo</option>
                        <option value="Personal">🔒 Personal</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Color:</span>
                      {(['indigo', 'emerald', 'amber', 'rose', 'cyan', 'purple'] as NoteColor[]).map((c) => (
                        <button
                          key={c}
                          onClick={() => handleUpdateNote({ color: c })}
                          className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                            colorThemes[c].dot
                          } ${activeNote.color === c ? 'scale-125 ring-2 ring-white/60' : 'opacity-60 hover:opacity-100'}`}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Formatting Quick Inserts */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-y border-slate-800/80 text-[11px] text-slate-400 scrollbar-none">
                    <button
                      onClick={() => handleUpdateNote({ content: `${activeNote.content}\n\n### Heading` })}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                    >
                      + Heading
                    </button>
                    <button
                      onClick={() => handleUpdateNote({ content: `${activeNote.content}\n• ` })}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                    >
                      • Bullet
                    </button>
                    <button
                      onClick={() => handleUpdateNote({ content: `${activeNote.content}\n[ ] ` })}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                    >
                      [ ] Checkbox
                    </button>
                    <button
                      onClick={() => handleUpdateNote({ content: `${activeNote.content}\n\`\`\`c\n// Code here\n\`\`\`\n` })}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                    >
                      &lt;/&gt; Code block
                    </button>
                    <button
                      onClick={() => handleUpdateNote({ content: `${activeNote.content}\n[${new Date().toLocaleTimeString()}]: ` })}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                    >
                      ⏰ Time
                    </button>
                  </div>

                  {/* Main Text Area */}
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => handleUpdateNote({ content: e.target.value })}
                    placeholder="Apne study notes, C programming concepts, ya personal memo likhein..."
                    className="flex-1 w-full min-h-[300px] sm:min-h-[420px] bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-xs sm:text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-y leading-relaxed"
                  />

                  {/* Editor Bottom Status */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Saved in phone storage</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>{activeNote.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0} words</span>
                      <span>{activeNote.content.length} characters</span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <FileText className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-semibold text-slate-400">No Note Selected</p>
                <p className="text-xs mt-1">Select a note from the left sidebar or create a new one.</p>
                <button
                  onClick={handleCreateNote}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Create Note
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SECOND TAB: Offline JavaScript & Logic Code Runner */
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Offline Code Playground & Scratchpad</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bina internet ke JavaScript code aur BCA logic algorithms test karein.
              </p>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-400">Sample:</span>
              <select
                onChange={(e) => {
                  const idx = parseInt(e.target.value, 10);
                  if (CODE_TEMPLATES[idx]) setRunnerCode(CODE_TEMPLATES[idx].code);
                }}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-semibold focus:outline-none"
              >
                {CODE_TEMPLATES.map((tmpl, idx) => (
                  <option key={idx} value={idx}>
                    {tmpl.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[420px]">
            {/* Code Input */}
            <div className="flex flex-col bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Editor (JavaScript)</span>
                </span>
                <button
                  onClick={() => setRunnerCode('')}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              </div>

              <textarea
                value={runnerCode}
                onChange={(e) => setRunnerCode(e.target.value)}
                placeholder="// Write JavaScript code here..."
                className="flex-1 w-full bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-indigo-500/50 resize-y leading-relaxed min-h-[280px]"
                spellCheck={false}
              />

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setRunnerCode(CODE_TEMPLATES[0].code)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Template</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isExecuting ? 'Running...' : 'Run Code Offline'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-300">Terminal Output</span>
                </div>
                <button
                  onClick={() => setRunnerOutput([])}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              </div>

              <div className="flex-1 bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 font-mono text-xs text-slate-200 overflow-y-auto min-h-[280px] max-h-[460px] space-y-1">
                {runnerOutput.length === 0 ? (
                  <p className="text-slate-600 italic">
                    Press "Run Code Offline" to see instant execution output here...
                  </p>
                ) : (
                  runnerOutput.map((out, idx) => (
                    <div
                      key={idx}
                      className={`leading-relaxed ${
                        out.startsWith('⚠️') ? 'text-rose-400 font-bold' : 'text-emerald-400'
                      }`}
                    >
                      {out}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global In-app Pin Prompt Modal for Locked Note */}
      {pinPromptNoteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Locked Note</h3>
            <p className="text-xs text-slate-400 mb-4">
              Apna Secret PIN enter karein:
            </p>

            <form onSubmit={handleUnlockWithPin} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                placeholder="PIN (1307)"
                className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
              {pinError && (
                <p className="text-[11px] text-rose-400 font-semibold">Galat PIN! Dubara koshish karein.</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPinPromptNoteId(null);
                    setEnteredPin('');
                    setPinError(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
