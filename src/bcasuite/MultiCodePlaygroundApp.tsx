import React, { useState } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  FileCode,
  Sliders,
  Cpu,
  Layers,
  HelpCircle,
  Zap,
  CornerDownRight
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface MultiCodePlaygroundProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

type SupportedLanguage = 'python' | 'java' | 'cpp' | 'javascript';

const STARTER_CODES: Record<SupportedLanguage, string> = {
  python: `# Python 3.12 - Interactive BCA Playground
def fibonacci_series(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

n = 8
result = fibonacci_series(n)
print(f"Generated first {n} Fibonacci numbers:")
print(result)
print(f"Sum of series: {sum(result)}")`,

  java: `// Java 21 - Object Oriented Demo
public class Main {
    public static void main(String[] args) {
        System.out.println("=== BCA Java Execution Engine ===");
        int[] scores = {92, 85, 96, 78, 88};
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        double average = (double) sum / scores.length;
        System.out.printf("Processed %d exams | Average: %.2f%%%n", scores.length, average);
    }
}`,

  cpp: `// C++20 - Standard Template Library
#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    cout << "=== C++20 STL Engine ===" << endl;
    vector<int> numbers = {10, 25, 30, 45, 50};
    int total = accumulate(numbers.begin(), numbers.end(), 0);
    
    cout << "Array Size: " << numbers.size() << endl;
    cout << "Accumulated Total: " << total << endl;
    return 0;
}`,

  javascript: `// Modern ES6+ Web Execution
const students = [
  { name: "Priyanshu", sem: 4, cgpa: 9.2 },
  { name: "Aarav", sem: 2, cgpa: 8.8 },
  { name: "Riya", sem: 6, cgpa: 9.5 }
];

const honors = students.filter(s => s.cgpa >= 9.0);
console.log("=== High Achievers ===");
console.table(honors);
console.log("Total Honors Students:", honors.length);`
};

export const MultiCodePlaygroundApp: React.FC<MultiCodePlaygroundProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(STARTER_CODES.python);
  const [output, setOutput] = useState<string>('Press "Run Code" to compile and execute.');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionStats, setExecutionStats] = useState<{ timeMs: number; memoryKb: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(STARTER_CODES[lang]);
    setOutput(`Switched environment to ${lang.toUpperCase()}. Click Run to execute.`);
    setExecutionStats(null);
    setAiExplanation(null);
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput('Compiling and allocating runtime container...');

    setTimeout(() => {
      setIsExecuting(false);
      const startTime = performance.now();

      if (language === 'javascript') {
        const logs: string[] = [];
        const originalLog = console.log;
        const originalTable = console.table;

        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
        console.table = (data) => logs.push(JSON.stringify(data, null, 2));

        try {
          // Safe evaluation for demonstration
          const fn = new Function(code);
          fn();
          setOutput(logs.length > 0 ? logs.join('\n') : 'Code executed with zero stdout.');
        } catch (err: any) {
          setOutput(`[Runtime Error]: ${err.message}`);
        } finally {
          console.log = originalLog;
          console.table = originalTable;
        }
      } else if (language === 'python') {
        setOutput(`[Python 3.12.2 Output]\nGenerated first 8 Fibonacci numbers:\n[0, 1, 1, 2, 3, 5, 8, 13]\nSum of series: 33\n\nProcess finished with exit code 0`);
      } else if (language === 'java') {
        setOutput(`[OpenJDK 21.0.2 VM]\n=== BCA Java Execution Engine ===\nProcessed 5 exams | Average: 87.80%\n\nBuild Successful (Total time: 0.12s)`);
      } else if (language === 'cpp') {
        setOutput(`[GCC 13.2.0]\n=== C++20 STL Engine ===\nArray Size: 5\nAccumulated Total: 160\n\nProcess returned 0 (0x0)`);
      }

      const elapsed = Number((performance.now() - startTime + Math.random() * 8 + 12).toFixed(1));
      setExecutionStats({
        timeMs: elapsed,
        memoryKb: Math.floor(Math.random() * 400 + 1200)
      });
    }, 450);
  };

  const handleExplainCode = () => {
    setIsExplaining(true);
    setTimeout(() => {
      setIsExplaining(false);
      setAiExplanation(
        `💡 AI Step-by-Step Logic Breakdown:
1. Entry & Architecture: The code establishes clean data definitions with idiomatic ${language.toUpperCase()} conventions.
2. Iterative Logic: Uses linear iteration O(n) avoiding unnecessary recursive stack allocations.
3. Memory Footprint: Standard stack allocations with minimal heap fragmentation.
4. Viva Exam Tip: Examiner will frequently ask about time vs space trade-offs—be prepared to explain how dynamic programming avoids overlapping subproblems!`
      );
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">Multi-Language Code Playground</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Python · Java · C++ · JavaScript
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-browser compiler simulation, stdout console, and instant AI tutor explanations
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

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
          <div className="rounded-3xl glass-card border-white/10 flex flex-col h-[520px] overflow-hidden">
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {(['python', 'java', 'cpp', 'javascript'] as SupportedLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all uppercase font-mono cursor-pointer spring-press ${
                      language === lang
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setCode(STARTER_CODES[language])}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Reset to Starter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Input Textarea */}
            <div className="flex-1 relative bg-slate-950/90 font-mono text-xs sm:text-sm p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-cyan-300 resize-none focus:outline-none leading-relaxed select-text"
              />
            </div>

            {/* Execution Trigger Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={isExecuting}
                  onClick={handleRunCode}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 spring-press cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                </button>

                <button
                  onClick={handleExplainCode}
                  disabled={isExplaining}
                  className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 spring-press cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Explain Code (AI)</span>
                </button>
              </div>

              {executionStats && (
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
                  <span>⏱️ {executionStats.timeMs}ms</span>
                  <span>💾 {executionStats.memoryKb}KB</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Output Terminal & AI Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Terminal Console */}
          <div className="rounded-3xl glass-card border-white/10 overflow-hidden flex flex-col h-[340px]">
            <div className="px-4 py-2 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-300">Terminal stdout</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="flex-1 bg-slate-950 p-4 font-mono text-xs overflow-y-auto leading-relaxed select-text space-y-2">
              <div className="text-slate-500 flex items-center gap-1.5">
                <span>user@bca-sandbox:~$</span>
                <span className="w-2 h-4 bg-emerald-400 animate-cursor-blink" />
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
            </div>
          </div>

          {/* AI Explanation Card */}
          {aiExplanation && (
            <div className="p-4 rounded-3xl bg-purple-950/30 border border-purple-500/40 shadow-xl space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Code Analysis & Exam Viva Notes</span>
              </div>
              <p className="text-xs text-purple-100/90 font-sans leading-relaxed whitespace-pre-wrap">
                {aiExplanation}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
