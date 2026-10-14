import React, { useState, useMemo } from 'react';
import {
  FileText,
  Code,
  Eye,
  Copy,
  Check,
  Search,
  BookOpen,
  Download,
  RefreshCw,
  Sparkles,
  AlignLeft,
  Sliders,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const COMMON_REGEXES = [
  { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', desc: 'Validates standard user email formats' },
  { name: 'IPv4 Address', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', desc: 'Matches valid IPv4 addresses from 0.0.0.0 to 255.255.255.255' },
  { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', desc: 'At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character' },
  { name: 'URL (HTTP/HTTPS)', pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$', desc: 'Matches web URLs with optional query strings' },
  { name: 'Phone Number (Intl / 10 Digits)', pattern: '^\\+?[1-9]\\d{1,14}$|^[6-9]\\d{9}$', desc: 'Matches standard 10-digit mobile numbers or E.164 international formats' }
];

export const DocuCraftApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'regex' | 'formatter' | 'readme'>('markdown');
  const [copied, setCopied] = useState(false);

  // Markdown State
  const [markdownText, setMarkdownText] = useState(`# Project Overview 🚀

Welcome to **DocuCraft Studio**! This is a live markdown document editor.

## Key Highlights:
- **Instant Preview**: Fast, zero-lag HTML compilation
- **Code Block Support**: Real-time styling
- **Syntax Highlighting**: Previews tables, links, and blockquotes

> "Simplicity is the soul of efficiency." — Austin Freeman

### Sample Function in C:
\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello from DocuCraft!\\n");
    return 0;
}
\`\`\`
`);

  // Regex State
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexTestString, setRegexTestString] = useState(
    'Contact our team at admin@example.com or support@company.org. Invalid email: test@invalid.'
  );

  // Formatter State
  const [formatterInput, setFormatterInput] = useState(
    '<div class="card"><div class="header"><h1>Title</h1></div><div class="content"><p>Messy unformatted HTML code</p></div></div>'
  );
  const [formattedOutput, setFormattedOutput] = useState('');

  // Readme Generator State
  const [readmeName, setReadmeName] = useState('My Awesome Project');
  const [readmeDesc, setReadmeDesc] = useState('High-performance, modern application built with React and TypeScript.');
  const [readmeAuthor, setReadmeAuthor] = useState('Prince Thakur');
  const [readmeLicense, setReadmeLicense] = useState('MIT');
  const [readmeInstallCmd, setReadmeInstallCmd] = useState('npm install');
  const [readmeRunCmd, setReadmeRunCmd] = useState('npm run dev');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert basic markdown to sanitized HTML string
  const renderedHtml = useMemo(() => {
    let raw = markdownText;
    // Headers
    raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-cyan-300 mt-5 mb-2">$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-white mt-2 mb-3">$1</h1>');
    // Blockquote
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 py-1 italic text-slate-300 my-3 bg-slate-900/50 rounded-r">$1</blockquote>');
    // Code blocks
    raw = raw.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, '<pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto my-3"><code>$2</code></pre>');
    // Inline code
    raw = raw.replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-cyan-300">$1</code>');
    // Bold & Italic
    raw = raw.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    raw = raw.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-300">$1</em>');
    // Unordered lists
    raw = raw.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 text-xs my-1">$1</li>');
    // Paragraphs / line breaks
    raw = raw.replace(/\n\n/g, '<p class="my-2 text-xs text-slate-300 leading-relaxed"></p>');
    return raw;
  }, [markdownText]);

  // Regex Match Calculation
  const regexResults = useMemo(() => {
    if (!regexPattern) return { valid: false, matches: [] };
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const matches = Array.from(regexTestString.matchAll(reg));
      return {
        valid: true,
        matches: matches.map((m) => ({
          text: m[0],
          index: m.index,
          groups: m.slice(1)
        }))
      };
    } catch (e: any) {
      return { valid: false, error: e.message, matches: [] };
    }
  }, [regexPattern, regexFlags, regexTestString]);

  // Basic HTML formatter
  const handleFormatCode = () => {
    try {
      let formatted = '';
      let indent = 0;
      const tab = '  ';
      const tokens = formatterInput.replace(/>\s*</g, '><').split(/(?<=<[^>]+>)|(?=<[^>]+>)/g);

      for (const token of tokens) {
        if (!token.trim()) continue;
        if (token.startsWith('</')) {
          indent = Math.max(0, indent - 1);
          formatted += tab.repeat(indent) + token.trim() + '\n';
        } else if (token.startsWith('<') && !token.endsWith('/>') && !token.startsWith('<!')) {
          formatted += tab.repeat(indent) + token.trim() + '\n';
          indent++;
        } else {
          formatted += tab.repeat(indent) + token.trim() + '\n';
        }
      }
      setFormattedOutput(formatted.trim());
    } catch {
      setFormattedOutput(formatterInput);
    }
  };

  // Generated README
  const generatedReadme = useMemo(() => {
    return `# ${readmeName}

[![License: ${readmeLicense}](https://img.shields.io/badge/License-${readmeLicense}-blue.svg)](#license)
[![Made by](https://img.shields.io/badge/Author-${encodeURIComponent(readmeAuthor)}-emerald.svg)](#author)

${readmeDesc}

---

## 🚀 Features
- ⚡ **High Performance**: Optimized for fast startup and minimal memory footprint.
- 📱 **Fully Responsive**: Mobile-first architecture with seamless layout scaling.
- 🔒 **Zero Dependency Core**: Secure, private, and fully client-side capabilities.
- 🎨 **Modern Interface**: Clean slate aesthetic with accessible typography.

---

## 📦 Installation & Setup

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/example/${readmeName.toLowerCase().replace(/\s+/g, '-')}.git

# 2. Navigate to project root
cd ${readmeName.toLowerCase().replace(/\s+/g, '-')}

# 3. Install dependencies
${readmeInstallCmd}

# 4. Start development server
${readmeRunCmd}
\`\`\`

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Build System**: Vite

---

## 📄 License
This project is licensed under the **${readmeLicense} License**.

---

## 👨‍💻 Author
Engineered with ❤️ by **${readmeAuthor}**.`;
  }, [readmeName, readmeDesc, readmeAuthor, readmeLicense, readmeInstallCmd, readmeRunCmd]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <FileText className="w-5 h-5 text-violet-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                DocuCraft Studio
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-950 text-violet-400 border border-violet-800">
                  Documentation
                </span>
              </h1>
              <p className="text-xs text-slate-400">Markdown Studio, Regex Testing Sandbox &amp; README Generator</p>
            </div>
          </div>

          <a
            href="#bcaverse"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Back to Suite
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'markdown', label: 'Live Markdown Previewer', icon: Eye },
            { id: 'regex', label: 'Regex Testing Sandbox', icon: Code },
            { id: 'formatter', label: 'HTML/JSX Formatter', icon: AlignLeft },
            { id: 'readme', label: 'README.md Generator', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'markdown' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Markdown Source (.md)
                </span>
                <button
                  onClick={() => handleCopy(markdownText)}
                  className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Markdown</span>
                </button>
              </div>
              <textarea
                rows={16}
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 outline-none focus:border-violet-500 leading-relaxed resize-none shadow-inner"
              />
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Live HTML Preview
                </span>
                <button
                  onClick={() => handleCopy(renderedHtml)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Rendered HTML'}</span>
                </button>
              </div>

              <div
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 min-h-[360px] max-h-[500px] overflow-y-auto leading-relaxed shadow-inner"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          </div>
        )}

        {activeTab === 'regex' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-violet-400" />
                Regex Pattern Testing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-9 flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-xs text-white">
                  <span className="text-slate-500 font-bold select-none mr-1.5">/</span>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    placeholder="Regular expression pattern..."
                    className="flex-1 bg-transparent outline-none text-emerald-300"
                  />
                  <span className="text-slate-500 font-bold select-none ml-1.5">/</span>
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={regexFlags}
                    onChange={(e) => setRegexFlags(e.target.value)}
                    placeholder="Flags: g, i, m"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-violet-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Test String:</label>
                <textarea
                  rows={4}
                  value={regexTestString}
                  onChange={(e) => setRegexTestString(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 outline-none focus:border-violet-500 leading-relaxed resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Match Results ({regexResults.matches?.length || 0} found):</span>
                  {regexResults.valid ? (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pattern Valid
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Invalid: {regexResults.error}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                  {regexResults.matches?.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono"
                    >
                      <span className="text-emerald-300">"{m.text}"</span>
                      <span className="text-[10px] text-slate-500">Index: {m.index}</span>
                    </div>
                  ))}
                  {regexResults.matches?.length === 0 && (
                    <div className="text-xs text-slate-500 italic p-2">No matches found for current test string.</div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-300 mb-2 block">Quick Pattern Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_REGEXES.map((r) => (
                    <button
                      key={r.name}
                      onClick={() => setRegexPattern(r.pattern)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formatter' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Messy HTML / JSX
                </span>
                <button
                  onClick={handleFormatCode}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Format Indentation</span>
                </button>
              </div>
              <textarea
                rows={14}
                value={formatterInput}
                onChange={(e) => setFormatterInput(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 outline-none focus:border-violet-500 leading-relaxed resize-none shadow-inner"
              />
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Clean Formatted Output
                </span>
                <button
                  onClick={() => handleCopy(formattedOutput || formatterInput)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Clean Code</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed min-h-[320px]">
                {formattedOutput || '// Click "Format Indentation" to beautify code'}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'readme' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Project Metadata
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Project Name:</label>
                  <input
                    type="text"
                    value={readmeName}
                    onChange={(e) => setReadmeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-violet-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Short Tagline / Description:</label>
                  <textarea
                    rows={2}
                    value={readmeDesc}
                    onChange={(e) => setReadmeDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-violet-500 resize-none font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Author Name:</label>
                  <input
                    type="text"
                    value={readmeAuthor}
                    onChange={(e) => setReadmeAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-violet-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Install Command:</label>
                    <input
                      type="text"
                      value={readmeInstallCmd}
                      onChange={(e) => setReadmeInstallCmd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Run Command:</label>
                    <input
                      type="text"
                      value={readmeRunCmd}
                      onChange={(e) => setReadmeRunCmd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-violet-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Generated README.md
                  </span>
                  <button
                    onClick={() => handleCopy(generatedReadme)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy README.md'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed max-h-[460px]">
                  {generatedReadme}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
