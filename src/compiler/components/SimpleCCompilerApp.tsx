import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Square,
  Sparkles,
  Terminal as TerminalIcon,
  HardDrive,
  BookOpen,
  ArrowRight,
  Download,
  Copy,
  Check,
  Grid,
  Heart,
  ChevronDown,
  Layers,
  Wand2,
  Cpu,
  Calculator as CalcIcon,
  Shield,
  FileCode,
  RotateCcw
} from 'lucide-react';
import { SukhanPenIcon } from '../../sukhan/components/SukhanPenIcon';
import { C_TEMPLATES } from '../data/cTemplates';
import { CInterpreter } from '../engine/cInterpreter';
import { CTemplate, ExecutionResult, TerminalTheme } from '../types';
import { CodeEditor } from './CodeEditor';
import { TerminalOutput } from './TerminalOutput';
import { MemoryWatcher } from './MemoryWatcher';
import { CReferenceCheatSheet } from './CReferenceCheatSheet';

interface SimpleCCompilerAppProps {
  onBackToBca?: () => void;
  onOpenCalcVault?: () => void;
  onOpenSukhan?: () => void;
  onOpenAppSwitcher?: () => void;
}

export const SimpleCCompilerApp: React.FC<SimpleCCompilerAppProps> = ({
  onBackToBca,
  onOpenCalcVault,
  onOpenSukhan,
  onOpenAppSwitcher
}) => {
  // Current active template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('hello_world');
  const [code, setCode] = useState<string>(C_TEMPLATES[0].code);
  const [stdinInput, setStdinInput] = useState<string>(C_TEMPLATES[0].defaultInput || '');

  // Right pane tab: 'terminal' | 'stdin' | 'memory' | 'cheatsheet' | 'ai-explain'
  const [rightTab, setRightTab] = useState<'terminal' | 'stdin' | 'memory' | 'cheatsheet' | 'ai-explain'>('terminal');

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Editor settings
  const [fontSize, setFontSize] = useState<number>(14);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>('dark');
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Code Explanation state
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch template
  const handleSelectTemplate = (template: CTemplate) => {
    setSelectedTemplateId(template.id);
    setCode(template.code);
    setStdinInput(template.defaultInput || '');
    setExecutionResult(null);
    setAiExplanation(null);
    showToast(`Loaded: ${template.title}`);
  };

  // Run C Program
  const handleRunProgram = useCallback(() => {
    setIsRunning(true);
    setRightTab('terminal');

    // Run asynchronously to allow UI to render running indicator
    setTimeout(() => {
      try {
        const interpreter = new CInterpreter(code, stdinInput);
        const result = interpreter.run();
        setExecutionResult(result);
      } catch (err: any) {
        setExecutionResult({
          stdout: '',
          stderr: `Execution Crash: ${err.message || String(err)}`,
          exitCode: 1,
          executionTimeMs: 0,
          variables: [],
          stepsCount: 0
        });
      } finally {
        setIsRunning(false);
      }
    }, 40);
  }, [code, stdinInput]);

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunProgram();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunProgram]);

  // Code Formatter (auto-indent)
  const handleFormatCode = () => {
    const rawLines = code.split('\n');
    let indent = 0;
    const formatted = rawLines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('}') || trimmed.startsWith(');')) {
        indent = Math.max(0, indent - 1);
      }

      const padded = '    '.repeat(indent) + trimmed;

      if (trimmed.endsWith('{')) {
        indent++;
      }

      return padded;
    });

    setCode(formatted.join('\n'));
    showToast('Code Auto-Formatted!');
  };

  // Reset Code
  const handleResetCode = () => {
    const cur = C_TEMPLATES.find((t) => t.id === selectedTemplateId);
    if (cur) {
      setCode(cur.code);
      setStdinInput(cur.defaultInput || '');
      setExecutionResult(null);
      showToast('Code Reset ho gaya!');
    }
  };

  // Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .c File
  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/x-csrc' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplateId || 'program'}.c`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded .c file!');
  };

  // Interactive input from terminal
  const handleSendInteractiveInput = (val: string) => {
    const nextStdin = stdinInput ? `${stdinInput} ${val}` : val;
    setStdinInput(nextStdin);

    // Re-run with updated stdin
    setIsRunning(true);
    setTimeout(() => {
      try {
        const interpreter = new CInterpreter(code, nextStdin);
        const result = interpreter.run();
        setExecutionResult(result);
      } finally {
        setIsRunning(false);
      }
    }, 30);
  };

  // AI Explain / Analyze Code
  const handleExplainCode = async () => {
    setRightTab('ai-explain');
    setIsExplaining(true);
    setAiExplanation(null);

    try {
      const response = await fetch('/api/compiler/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          error: executionResult?.stderr || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data.explanation);
      } else {
        // Fallback local explanation
        generateLocalExplanation();
      }
    } catch {
      generateLocalExplanation();
    } finally {
      setIsExplaining(false);
    }
  };

  const generateLocalExplanation = () => {
    // Smart local code analysis
    const lines = code.split('\n');
    let summary = `### C Code Analysis & Step-by-Step Logic\n\n`;
    summary += `**Program Size**: ${lines.length} lines of standard C code.\n\n`;

    if (code.includes('main()')) {
      summary += `1. **int main()**: Yeh entry point hai jahan se C runtime execution shuru karta hai.\n`;
    }
    if (code.includes('printf(')) {
      summary += `2. **printf() Functions**: Screen par output ya messages print karta hai.\n`;
    }
    if (code.includes('scanf(')) {
      summary += `3. **scanf() Functions**: User se keyboard input lene ke liye address-of \`&\` operator use karta hai.\n`;
    }
    if (code.includes('for (') || code.includes('while (')) {
      summary += `4. **Loops**: Program mein iteration / loops use kiye gaye hain repetitive kaam karne ke liye.\n`;
    }
    if (code.includes('int *') || code.includes('&')) {
      summary += `5. **Pointers & Memory**: Direct memory address access aur pointer dereferencing use hui hai.\n`;
    }

    if (executionResult?.stderr) {
      summary += `\n**Error Resolution Tip**:\n\`${executionResult.stderr}\`\nCheck karein ki semicolon \`;\` miss to nahi hua aur variables declare kiye gaye hain.`;
    } else {
      summary += `\n**Status**: Code syntax clean hai aur successfully compile ho raha hai!`;
    }

    setAiExplanation(summary);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Application Navigation Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-[#0B0F1A] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 font-mono font-black text-lg border border-cyan-400/40">
            C
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Simple C Compiler</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold hidden xs:inline">
                  v2.0
                </span>
              </h1>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="hidden sm:inline">Code, Compile, Execute</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-cyan-400 font-semibold">Made by Prince Thakur</span>
            </div>
          </div>
        </div>

        {/* Center: Template Dropdown */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sample Code:</span>
          <div className="relative">
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                const tmpl = C_TEMPLATES.find((t) => t.id === e.target.value);
                if (tmpl) handleSelectTemplate(tmpl);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#141A29] border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer pr-8 appearance-none"
            >
              {C_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.title} ({tmpl.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Controls: Run Button & App Switcher */}
        <div className="flex items-center gap-2">
          {/* Big Green Run Button */}
          <button
            onClick={handleRunProgram}
            disabled={isRunning}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-slate-700 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-950/40 active:scale-95'
            }`}
            title="Compile & Run C Program (Ctrl+Enter)"
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Program</span>
              </>
            )}
          </button>

          {/* AI Explain Button */}
          <button
            onClick={handleExplainCode}
            disabled={isExplaining}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-200 text-xs font-semibold transition-colors cursor-pointer"
            title="AI Code Explainer & Error Fixer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Explain</span>
          </button>

          {/* 4-Apps Suite Switcher */}
          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141A29] hover:bg-[#1a2337] border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              title="Switch between BCA Verse, CalcVault, SUKHAN & C Compiler"
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Apps Suite</span>
            </button>
          )}

          {/* Quick Exit to BCA Verse */}
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Return to BCA Verse"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Template Selector Bar */}
      <div className="lg:hidden px-3 py-2 bg-[#0E131F] border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 text-[11px] shrink-0">Sample:</span>
        <select
          value={selectedTemplateId}
          onChange={(e) => {
            const tmpl = C_TEMPLATES.find((t) => t.id === e.target.value);
            if (tmpl) handleSelectTemplate(tmpl);
          }}
          className="flex-1 px-2.5 py-1 rounded-lg bg-[#141A29] border border-slate-700 text-xs text-slate-200 focus:outline-none"
        >
          {C_TEMPLATES.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id}>
              {tmpl.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleExplainCode}
          className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-bold shrink-0"
        >
          AI Explain
        </button>
      </div>

      {/* Main Workspace Grid (Left: Code Editor, Right: Output / Tabs) */}
      <main className="flex-1 p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Code Editor (7 cols on desktop) */}
        <div className="lg:col-span-7 h-[50vh] lg:h-[calc(100vh-8.5rem)] flex flex-col min-h-0">
          <CodeEditor
            code={code}
            onChange={setCode}
            onFormat={handleFormatCode}
            onReset={handleResetCode}
            fontSize={fontSize}
            setFontSize={setFontSize}
            copied={copied}
            onCopy={handleCopyCode}
            onDownload={handleDownloadCode}
            fileName={`${selectedTemplateId}.c`}
          />
        </div>

        {/* RIGHT COLUMN: Terminal & Tools (5 cols on desktop) */}
        <div className="lg:col-span-5 h-[50vh] lg:h-[calc(100vh-8.5rem)] flex flex-col min-h-0 space-y-2">
          {/* Right Pane Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#0E131F] border border-slate-800 rounded-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setRightTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                rightTab === 'terminal'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Terminal Output</span>
            </button>

            <button
              onClick={() => setRightTab('stdin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                rightTab === 'stdin'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Stdin Input</span>
              {stdinInput && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setRightTab('memory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                rightTab === 'memory'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Variables</span>
              {executionResult?.variables && executionResult.variables.length > 0 && (
                <span className="text-[10px] px-1 rounded bg-black/40 text-cyan-200">
                  {executionResult.variables.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setRightTab('cheatsheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                rightTab === 'cheatsheet'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>C Reference</span>
            </button>

            <button
              onClick={() => setRightTab('ai-explain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                rightTab === 'ai-explain'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>AI Explainer</span>
            </button>
          </div>

          {/* Right Pane Tab Content */}
          <div className="flex-1 min-h-0">
            {rightTab === 'terminal' && (
              <TerminalOutput
                result={executionResult}
                isRunning={isRunning}
                onClear={() => setExecutionResult(null)}
                theme={terminalTheme}
                setTheme={setTerminalTheme}
                onSendInteractiveInput={handleSendInteractiveInput}
              />
            )}

            {rightTab === 'stdin' && (
              <div className="flex flex-col h-full bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 font-mono">
                      Standard Input (stdin)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Jab program `scanf()` call karega, to yeh input supply kiya jayega.
                    </p>
                  </div>
                  <button
                    onClick={() => setStdinInput('')}
                    className="text-xs text-slate-400 hover:text-amber-400 cursor-pointer"
                  >
                    Clear Input
                  </button>
                </div>

                <textarea
                  value={stdinInput}
                  onChange={(e) => setStdinInput(e.target.value)}
                  placeholder="Yahan test inputs daalein (space ya new line se separate karein)..."
                  className="flex-1 w-full mt-3 p-3 bg-[#0A0E17] text-slate-100 font-mono text-xs rounded-xl border border-slate-800/80 resize-none focus:outline-none focus:border-cyan-500/50"
                />

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Udaharan: 25 30 ya multi-line inputs</span>
                  <button
                    onClick={handleRunProgram}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Run With This Stdin ➔
                  </button>
                </div>
              </div>
            )}

            {rightTab === 'memory' && (
              <MemoryWatcher variables={executionResult?.variables || []} />
            )}

            {rightTab === 'cheatsheet' && <CReferenceCheatSheet />}

            {rightTab === 'ai-explain' && (
              <div className="flex flex-col h-full bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-purple-200">
                      C Code Assistant &amp; Explainer
                    </h3>
                  </div>
                  <button
                    onClick={handleExplainCode}
                    disabled={isExplaining}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isExplaining ? 'Analyzing...' : 'Re-Analyze'}
                  </button>
                </div>

                <div className="flex-1 mt-3 overflow-y-auto text-xs leading-relaxed space-y-3 text-slate-300 select-text">
                  {isExplaining ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                      <div className="text-xs font-semibold text-purple-300">
                        Analyzing C AST, Syntax &amp; Logic...
                      </div>
                    </div>
                  ) : aiExplanation ? (
                    <div className="whitespace-pre-wrap font-sans text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {aiExplanation}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500 space-y-2">
                      <Sparkles className="w-8 h-8 mx-auto text-purple-500/40" />
                      <div className="text-xs font-semibold text-slate-400">
                        Code Analysis Ready
                      </div>
                      <p className="text-[11px] max-w-xs mx-auto">
                        Upar "Re-Analyze" button dabayein code ka step-by-step logic aur runtime check karne ke liye.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom App Suite Bar & Creator Watermark */}
      <footer className="h-10 px-4 bg-[#0B0F1A] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>Made by Prince Thakur</span>
          </div>
          <span className="text-slate-600">·</span>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            All 4 Apps Integrated &amp; Offline Functional
          </span>
        </div>

        {/* Quick Suite Jumpers */}
        <div className="flex items-center gap-2 text-xs">
          {onOpenSukhan && (
            <button
              onClick={onOpenSukhan}
              className="flex items-center gap-1 text-[11px] text-[#C6A66B] hover:underline cursor-pointer"
            >
              <SukhanPenIcon size={12} />
              <span>SUKHAN</span>
            </button>
          )}

          {onOpenCalcVault && (
            <button
              onClick={onOpenCalcVault}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              <CalcIcon className="w-3 h-3" />
              <span>CalcVault</span>
            </button>
          )}

          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:underline cursor-pointer"
            >
              <Cpu className="w-3 h-3" />
              <span>BCA Verse</span>
            </button>
          )}
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-14 right-6 z-50 px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-200 shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
