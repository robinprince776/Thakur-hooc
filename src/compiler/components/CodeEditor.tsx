import React, { useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Code2,
  FileCode,
  Type
} from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  onFormat: () => void;
  onReset: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
  fileName?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onFormat,
  onReset,
  fontSize,
  setFontSize,
  copied,
  onCopy,
  onDownload,
  fileName = 'main.c'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key inserts 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      // Restore cursor position after state update
      setTimeout(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#141A29] border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-mono font-bold">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{fileName}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            {lineCount} lines · {code.length} chars
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-lg text-xs text-slate-300">
            <Type className="w-3 h-3 text-slate-400" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-[11px] font-mono text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>

          {/* Format Code */}
          <button
            onClick={onFormat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
            title="Auto format code indentation"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">Format</span>
          </button>

          {/* Reset Code */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors cursor-pointer"
            title="Reset code to original template"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={onCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-indigo-400" />
            )}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download .c */}
          <button
            onClick={onDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
            title="Download as .c source file"
          >
            <Download className="w-3 h-3 text-cyan-300" />
            <span className="hidden sm:inline">.c</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers Column */}
        <div
          className="select-none py-3 px-2.5 bg-[#0A0E17] text-slate-600 font-mono text-right border-r border-slate-800/80 shrink-0"
          style={{ fontSize: `${fontSize}px`, minWidth: '42px', lineHeight: '1.6' }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 w-full h-full p-3 bg-transparent text-slate-100 font-mono resize-none focus:outline-none overflow-auto whitespace-pre selection:bg-cyan-900/60 selection:text-white"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            tabSize: 4
          }}
          placeholder="// Yahan apna C program likhein..."
        />
      </div>

      {/* Bottom Hint */}
      <div className="px-4 py-1.5 bg-[#0A0E17] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Tab</kbd>
          <span>Indent</span>
          <span>·</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Ctrl+Enter</kbd>
          <span>Run</span>
        </div>
        <div className="text-cyan-400 font-bold hidden sm:inline">
          ANSI C (C99 / C11)
        </div>
      </div>
    </div>
  );
};
