import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Send,
  Layers,
  Palette
} from 'lucide-react';
import { TerminalTheme, ExecutionResult } from '../types';

interface TerminalOutputProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClear: () => void;
  theme: TerminalTheme;
  setTheme: (theme: TerminalTheme) => void;
  onSendInteractiveInput?: (val: string) => void;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  result,
  isRunning,
  onClear,
  theme,
  setTheme,
  onSendInteractiveInput
}) => {
  const [interactiveInput, setInteractiveInput] = useState('');

  const getThemeClasses = () => {
    switch (theme) {
      case 'turbo-c':
        return {
          bg: 'bg-[#0000AA]',
          text: 'text-[#FFFF55]',
          border: 'border-yellow-400/40',
          header: 'bg-[#000088] border-yellow-400/30 text-white',
          prompt: 'text-white'
        };
      case 'matrix':
        return {
          bg: 'bg-[#050D08]',
          text: 'text-emerald-400',
          border: 'border-emerald-800/40',
          header: 'bg-[#08170E] border-emerald-900/60 text-emerald-300',
          prompt: 'text-emerald-500'
        };
      case 'monokai':
        return {
          bg: 'bg-[#1E1F1C]',
          text: 'text-[#FD971F]',
          border: 'border-orange-900/40',
          header: 'bg-[#272822] border-orange-950/60 text-[#F8F8F2]',
          prompt: 'text-[#A6E22E]'
        };
      case 'dark':
      default:
        return {
          bg: 'bg-[#0B0F19]',
          text: 'text-slate-100',
          border: 'border-slate-800',
          header: 'bg-[#111726] border-slate-800 text-slate-300',
          prompt: 'text-cyan-400'
        };
    }
  };

  const themeStyle = getThemeClasses();

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interactiveInput.trim() && onSendInteractiveInput) {
      onSendInteractiveInput(interactiveInput);
      setInteractiveInput('');
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border ${themeStyle.border} ${themeStyle.bg} overflow-hidden shadow-xl font-mono`}>
      {/* Terminal Title Bar */}
      <div className={`flex flex-wrap items-center justify-between px-4 py-2.5 ${themeStyle.header} border-b gap-2 text-xs select-none`}>
        <div className="flex items-center gap-2">
          {/* Terminal Traffic Light Dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-1.5 font-bold">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bash Execution Terminal</span>
          </div>
        </div>

        {/* Status & Options */}
        <div className="flex items-center gap-2">
          {/* Execution status badge */}
          {isRunning ? (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Compiling &amp; Running...
            </span>
          ) : result ? (
            result.exitCode === 0 ? (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Exit 0 ({result.executionTimeMs}ms)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/60">
                <AlertOctagon className="w-3 h-3 text-red-400" />
                Exit 1 (Error)
              </span>
            )
          ) : (
            <span className="text-[11px] text-slate-500">Ready to run</span>
          )}

          {/* Theme switch dropdown */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 px-2 py-0.5 rounded-lg text-xs">
            <Palette className="w-3 h-3 text-slate-400" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as TerminalTheme)}
              className="bg-transparent text-[11px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="dark">Modern Dark</option>
              <option value="turbo-c">Turbo C Blue</option>
              <option value="matrix">Matrix Green</option>
              <option value="monokai">Monokai Amber</option>
            </select>
          </div>

          {/* Clear terminal button */}
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Clear terminal screen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="flex-1 p-4 overflow-y-auto text-xs leading-relaxed space-y-2 select-text">
        {/* Linux / GCC Simulated Prompt Header */}
        <div className="text-slate-500 text-[11px] select-none pb-1 border-b border-white/5 flex flex-wrap items-center justify-between gap-1">
          <span>gcc (Ubuntu 11.4.0) -std=c11 -Wall -O2 main.c -o main &amp;&amp; ./main</span>
          {result && (
            <span className="text-[10px] text-slate-600">
              Steps: {result.stepsCount} · Return: {result.exitCode}
            </span>
          )}
        </div>

        {/* Empty state when no run has happened */}
        {!result && !isRunning && (
          <div className="py-12 text-center text-slate-500 select-none space-y-2">
            <TerminalIcon className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
            <div className="text-sm font-bold text-slate-400">
              Terminal Khali Hai — Program Run Karein
            </div>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Upar "Run Program" button dabayein ya keyboard par{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                Ctrl + Enter
              </kbd>{' '}
              press karein.
            </p>
          </div>
        )}

        {/* Running loader */}
        {isRunning && (
          <div className="flex items-center gap-2 py-4 text-cyan-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Compiling source code and executing on virtual CPU...</span>
          </div>
        )}

        {/* Program Stdout */}
        {result && result.stdout && (
          <pre className={`whitespace-pre-wrap font-mono ${themeStyle.text}`}>
            {result.stdout}
          </pre>
        )}

        {/* Program Stderr / Compilation Errors */}
        {result && result.stderr && (
          <div className="mt-2 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <AlertOctagon className="w-4 h-4" />
              <span>Compilation / Runtime Diagnostic:</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] text-red-300">
              {result.stderr}
            </pre>
          </div>
        )}

        {/* Interactive prompt cursor simulation */}
        {result && (
          <div className="pt-2 text-slate-500 text-[11px] flex items-center gap-1">
            <span className={themeStyle.prompt}>$</span>
            <span className="text-slate-400">Process returned {result.exitCode} (0x{result.exitCode.toString(16)})</span>
            <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-pulse ml-1" />
          </div>
        )}
      </div>

      {/* Interactive Stdin Bar */}
      {onSendInteractiveInput && (
        <form
          onSubmit={handleInputSubmit}
          className="px-3 py-2 bg-black/50 border-t border-white/10 flex items-center gap-2"
        >
          <span className="text-cyan-400 text-xs font-bold pl-1">$ stdin &gt;</span>
          <input
            type="text"
            value={interactiveInput}
            onChange={(e) => setInteractiveInput(e.target.value)}
            placeholder="Interactive input daalein (aur Enter dabayein)..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 transition-colors cursor-pointer"
            title="Send interactive input to program"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
};
