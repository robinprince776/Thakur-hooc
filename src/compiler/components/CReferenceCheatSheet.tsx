import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, Terminal } from 'lucide-react';

export const CReferenceCheatSheet: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySnippet = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const sections = [
    {
      title: 'Format Specifiers (printf / scanf)',
      items: [
        { name: '%d / %i', desc: 'Signed Decimal Integer (e.g. 10, -5)', code: 'printf("%d", 25);' },
        { name: '%f', desc: 'Floating point number (e.g. 3.14159)', code: 'printf("%.2f", 3.14);' },
        { name: '%lf', desc: 'Double precision float', code: 'scanf("%lf", &num);' },
        { name: '%c', desc: 'Single character (e.g. \'A\')', code: 'printf("%c", \'Z\');' },
        { name: '%s', desc: 'String (null-terminated char array)', code: 'printf("%s", "Namaste");' },
        { name: '%p', desc: 'Pointer memory address in hex', code: 'printf("%p", &a);' }
      ]
    },
    {
      title: 'Standard Header Files',
      items: [
        { name: '#include <stdio.h>', desc: 'Standard I/O (printf, scanf, puts, getchar)', code: '#include <stdio.h>' },
        { name: '#include <math.h>', desc: 'Math functions (sqrt, pow, abs, sin, cos)', code: '#include <math.h>' },
        { name: '#include <string.h>', desc: 'String operations (strlen, strcpy, strcmp)', code: '#include <string.h>' },
        { name: '#include <stdlib.h>', desc: 'Memory allocation, exit, rand', code: '#include <stdlib.h>' }
      ]
    },
    {
      title: 'Common C Code Snippets',
      items: [
        {
          name: 'For Loop',
          desc: '1 se N tak ginti print karne ke liye',
          code: 'for (int i = 1; i <= n; i++) {\n    printf("%d ", i);\n}'
        },
        {
          name: 'Pointer Syntax',
          desc: 'Address-of operator & aur dereference operator *',
          code: 'int a = 10;\nint *p = &a;\n*p = 20; // a ki value 20 ho gayi'
        },
        {
          name: 'If-Else Statement',
          desc: 'Conditional branching',
          code: 'if (num > 0) {\n    printf("Positive");\n} else {\n    printf("Negative or Zero");\n}'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141A29] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">C Language Quick Syntax Reference</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">BCA &amp; C Fundamentals</span>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5 text-xs">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="font-bold text-cyan-300 text-xs uppercase tracking-wider font-mono border-b border-slate-800 pb-1">
              {sec.title}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sec.items.map((item, i) => {
                const itemKey = `${idx}-${i}`;
                return (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-1.5"
                  >
                    <div>
                      <div className="font-mono font-bold text-amber-300 text-xs">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-black/40 px-2 py-1 rounded border border-white/5 font-mono text-[11px] text-slate-200">
                      <span className="truncate pr-2">{item.code.split('\n')[0]}</span>
                      <button
                        onClick={() => copySnippet(item.code, itemKey)}
                        className="text-slate-400 hover:text-cyan-300 p-0.5 transition-colors cursor-pointer shrink-0"
                        title="Copy syntax"
                      >
                        {copiedKey === itemKey ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
