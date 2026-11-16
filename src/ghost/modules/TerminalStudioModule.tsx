import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

interface FsNode {
  type: 'dir' | 'file';
  content?: string;
}

const INITIAL_FS: Record<string, FsNode> = {
  '/home/analyst': { type: 'dir' },
  '/home/analyst/readme.txt': {
    type: 'file',
    content: 'GHOST PROTOCOL ISOLATED SANDBOX\nExplore /var/log, /etc/ufw, or decode indicators with base64 -d.',
  },
  '/home/analyst/encoded_ioc.txt': {
    type: 'file',
    content: 'aHR0cHM6Ly9iZWFjb24tZGVmZW5zZS1jaGVjay5leGFtcGxlL2F1ZGl0',
  },
  '/var': { type: 'dir' },
  '/var/log': { type: 'dir' },
  '/var/log/auth.log': {
    type: 'file',
    content:
      'Nov 16 06:41:02 gateway sshd[912]: Failed password for invalid user admin from 198.51.100.44 port 55210\nNov 16 06:41:04 gateway sshd[912]: Failed password for invalid user root from 198.51.100.44 port 55218\nNov 16 06:42:11 gateway sshd[940]: Accepted publickey for analyst from 10.24.0.8 port 49122\nNov 16 06:43:05 gateway ufw[101]: [UFW BLOCK] SRC=198.51.100.44 DPT=22 PROTO=TCP',
  },
  '/var/log/nginx-access.log': {
    type: 'file',
    content:
      '10.24.0.18 - - [16/Nov/2026:06:50:01] "GET /api/health HTTP/1.1" 200 42\n203.0.113.77 - - [16/Nov/2026:06:51:12] "GET /admin/config.bak HTTP/1.1" 403 188\n203.0.113.77 - - [16/Nov/2026:06:51:15] "GET /.env HTTP/1.1" 403 188',
  },
  '/etc': { type: 'dir' },
  '/etc/hosts': {
    type: 'file',
    content: '127.0.0.1 localhost\n10.24.0.10 gateway.internal\n10.24.0.20 api-sandbox.internal\n10.24.0.30 db-vault.internal',
  },
  '/etc/ufw': { type: 'dir' },
  '/etc/ufw/rules.conf': {
    type: 'file',
    content: 'DEFAULT_INPUT=DROP\nALLOW TCP 443 FROM ANY\nLIMIT TCP 22 FROM 10.24.0.0/24',
  },
};

const QUICK_CMDS = [
  'help',
  'ls -la',
  'cd /var/log',
  'cat /var/log/auth.log',
  'grep 403 /var/log/nginx-access.log',
  'base64 -d /home/analyst/encoded_ioc.txt',
  'nmap 10.24.0.10',
  'iptables -L',
];

const SUPPORTED_BASE_CMDS = [
  'help', 'ls', 'cd', 'pwd', 'cat', 'grep', 'wc', 'base64', 'nmap', 'netstat', 'iptables', 'dig', 'sha256sum', 'mkdir', 'touch', 'whoami', 'date', 'clear',
];

export const TerminalStudioModule: React.FC = () => {
  const terminalHistory = useGhostStore((s) => s.terminalHistory);
  const addTerminalEntry = useGhostStore((s) => s.addTerminalEntry);
  const clearTerminal = useGhostStore((s) => s.clearTerminal);
  const addGhostXp = useGhostStore((s) => s.addGhostXp);

  const [cwd, setCwd] = useState('/home/analyst');
  const [fs, setFs] = useState<Record<string, FsNode>>(INITIAL_FS);
  const [input, setInput] = useState('');
  const [historyIdx, setHistoryIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const resolvePath = (target: string): string => {
    if (!target || target === '~') return '/home/analyst';
    if (target === '..') {
      const parts = cwd.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/') || '/';
    }
    if (target.startsWith('/')) return target.replace(/\/+$/, '') || '/';
    return (cwd === '/' ? '' : cwd) + '/' + target.replace(/^\.\//, '');
  };

  const runCommand = (raw?: string) => {
    const cmd = (raw ?? input).trim();
    if (!cmd) return;
    setInput('');
    setHistoryIdx(-1);

    const parts = cmd.split(/\s+/);
    const base = parts[0].toLowerCase();

    if (base === 'clear') {
      clearTerminal();
      return;
    }

    let output = '';

    switch (base) {
      case 'help':
        output = [
          'GHOST Shell v2.0 — Simulated Defensive Filesystem & Audit Tools:',
          '  Navigation:  pwd, ls [-la], cd <dir>, mkdir <dir>, touch <file>',
          '  Inspection:  cat <file>, grep <term> <file>, wc -l <file>',
          '  Decoding:    base64 -d <file>, sha256sum <file>',
          '  Network:     nmap <10.24.x>, netstat -tuln, iptables -L, dig <host>',
          '  Tips:        Press TAB to autocomplete commands or paths; Up/Down for history.',
        ].join('\n');
        break;

      case 'pwd':
        output = cwd;
        break;

      case 'whoami':
        output = 'analyst (role: soc-defensive-operator, sandbox: isolated)';
        break;

      case 'date':
        output = new Date().toUTCString();
        break;

      case 'cd': {
        const targetPath = resolvePath(parts[1] || '~');
        const node = fs[targetPath];
        if (targetPath === '/' || (node && node.type === 'dir')) {
          setCwd(targetPath);
          output = `Directory changed -> ${targetPath}`;
        } else {
          output = `cd: ${parts[1] || ''}: No such directory`;
        }
        break;
      }

      case 'ls': {
        const dirArg = parts.find((p) => !p.startsWith('-') && p !== 'ls');
        const targetDir = dirArg ? resolvePath(dirArg) : cwd;
        const prefix = targetDir === '/' ? '/' : targetDir + '/';
        const children = Object.keys(fs)
          .filter((k) => k.startsWith(prefix) && !k.slice(prefix.length).includes('/'))
          .map((k) => {
            const name = k.slice(prefix.length);
            const node = fs[k];
            return node.type === 'dir'
              ? `drwxr-xr-x  2 analyst soc  4096  ${name}/`
              : `-rw-r--r--  1 analyst soc   ${String((node.content?.length || 16)).padStart(3, ' ')}  ${name}`;
          });
        output = children.length ? children.join('\n') : '(empty directory)';
        break;
      }

      case 'mkdir': {
        if (!parts[1]) {
          output = 'Usage: mkdir <directory_name>';
        } else {
          const p = resolvePath(parts[1]);
          setFs((prev) => ({ ...prev, [p]: { type: 'dir' } }));
          output = `Created directory: ${p}`;
        }
        break;
      }

      case 'touch': {
        if (!parts[1]) {
          output = 'Usage: touch <filename>';
        } else {
          const p = resolvePath(parts[1]);
          setFs((prev) => ({ ...prev, [p]: prev[p] || { type: 'file', content: '' } }));
          output = `Created file: ${p}`;
        }
        break;
      }

      case 'cat': {
        const p = resolvePath(parts[1] || '');
        const node = fs[p];
        if (!parts[1]) output = 'Usage: cat <filepath>';
        else if (node && node.type === 'file') output = node.content || '(empty file)';
        else output = `cat: ${parts[1]}: No such file in sandbox`;
        break;
      }

      case 'grep': {
        const term = parts[1];
        const fileArg = parts[2];
        if (!term || !fileArg) {
          output = 'Usage: grep <search-term> <filepath>';
        } else {
          const p = resolvePath(fileArg);
          const node = fs[p];
          if (!node || node.type !== 'file') {
            output = `grep: ${fileArg}: No such file in sandbox`;
          } else {
            const matches = (node.content || '')
              .split('\n')
              .filter((line) => line.toLowerCase().includes(term.toLowerCase()));
            output = matches.length ? matches.join('\n') : `(no matches for "${term}")`;
          }
        }
        break;
      }

      case 'wc': {
        const fileArg = parts[parts.length - 1];
        const p = resolvePath(fileArg);
        const node = fs[p];
        if (!node || node.type !== 'file') {
          output = `wc: ${fileArg}: No such file`;
        } else {
          const text = node.content || '';
          const lines = text ? text.split('\n').length : 0;
          const words = text.trim() ? text.trim().split(/\s+/).length : 0;
          output = `  ${lines} lines   ${words} words   ${text.length} bytes   ${fileArg}`;
        }
        break;
      }

      case 'base64': {
        const flag = parts[1];
        const fileArg = parts[2];
        if (flag === '-d' && fileArg) {
          const p = resolvePath(fileArg);
          const node = fs[p];
          if (!node || node.type !== 'file') {
            output = `base64: ${fileArg}: No such file`;
          } else {
            try {
              const decoded = atob((node.content || '').trim());
              output = `Decoded IOC Payload:\n  ${decoded}`;
              addGhostXp(20, 'Decoded Base64 Sandbox Artifact', 'term-base64');
            } catch {
              output = 'base64: invalid base64 input';
            }
          }
        } else {
          output = 'Usage: base64 -d <filepath>';
        }
        break;
      }

      case 'iptables':
        output = [
          'Chain INPUT (policy DROP)',
          'target     prot opt source               destination',
          'ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:443',
          'LIMIT      tcp  --  10.24.0.0/24         anywhere             tcp dpt:22 (max 5/min)',
          'DROP       all  --  198.51.100.44        anywhere             /* Blocked SSH scanner */',
        ].join('\n');
        break;

      case 'nmap': {
        const target = parts[1] || '10.24.0.10';
        if (!target.startsWith('10.24.') && target !== 'localhost' && target !== '127.0.0.1') {
          output =
            '[POLICY GUARD] External targets are disabled. Simulated nmap only inspects internal lab range 10.24.0.0/24.';
        } else {
          output = [
            `Starting Simulated Educational Port Audit against ${target} (Sandbox)`,
            'PORT     STATE    SERVICE   DEFENSE NOTE',
            '22/tcp   filtered ssh       Rate-limited to 10.24.0.0/24 via UFW',
            '443/tcp  open     https     TLS 1.3 enforced with HSTS',
            '5432/tcp closed   postgres  Bound strictly to loopback interface',
          ].join('\n');
          addGhostXp(15, 'Terminal Network Audit', `term-nmap-${target}`);
        }
        break;
      }

      case 'netstat':
        output = [
          'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
          'tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN',
          'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN',
          'tcp        0      0 10.24.0.10:22           0.0.0.0:*               LISTEN',
        ].join('\n');
        break;

      case 'dig': {
        const host = parts[1] || 'gateway.internal';
        output = `; <<>> Simulated Sandbox DiG <<>> ${host}\n;; ANSWER SECTION:\n${host}.   300   IN   A   10.24.0.10\n;; TXT SPF Check: v=spf1 -all (Hard fail enforced)`;
        break;
      }

      case 'sha256sum': {
        const fileArg = parts[1] || 'readme.txt';
        const p = resolvePath(fileArg);
        output = fs[p]
          ? `4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce  ${p}`
          : `sha256sum: ${fileArg}: File not found`;
        break;
      }

      default:
        output = `ghostsh: command "${base}" not found in educational sandbox. Type "help" for valid commands.`;
    }

    addTerminalEntry(cmd, output);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;
      const parts = trimmed.split(/\s+/);
      if (parts.length === 1) {
        const match = SUPPORTED_BASE_CMDS.find((c) => c.startsWith(parts[0].toLowerCase()));
        if (match) setInput(match + ' ');
      } else {
        const last = parts[parts.length - 1];
        const allPaths = Object.keys(fs);
        const matchPath = allPaths.find((p) => p.includes(last));
        if (matchPath) {
          parts[parts.length - 1] = matchPath;
          setInput(parts.join(' '));
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const cmds = terminalHistory.map((h) => h.cmd);
      const nextIdx = Math.min(cmds.length - 1, historyIdx + 1);
      if (cmds[cmds.length - 1 - nextIdx]) {
        setHistoryIdx(nextIdx);
        setInput(cmds[cmds.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx <= 0) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        const cmds = terminalHistory.map((h) => h.cmd);
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmds[cmds.length - 1 - nextIdx] || '');
      }
    }
  };

  return (
    <ModuleFrame
      moduleId="terminal"
      onResetLocal={() => {
        setCwd('/home/analyst');
        setFs(INITIAL_FS);
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {QUICK_CMDS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => runCommand(q)}
              className="px-3 py-2 min-h-[38px] rounded-lg border border-slate-700 bg-[#0D1322] hover:border-[#00E5FF] text-xs font-ghost-mono text-[#00E5FF] cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#060910] overflow-hidden flex flex-col h-[470px]">
          <div className="px-4 py-2.5 bg-[#0E1525] border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-ghost-mono text-slate-200 truncate">
              <Terminal className="w-4 h-4 text-[#00FF41] shrink-0" />
              <span className="truncate">analyst@ghost-os:{cwd}</span>
            </div>
            <span className="text-[11px] font-ghost-mono text-slate-400 shrink-0 hidden sm:inline">
              TAB autocomplete · Up/Down history
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-ghost-mono text-xs">
            {terminalHistory.map((entry) => (
              <div key={entry.id} className="space-y-1">
                <div className="text-[#00FF41]">
                  <span className="text-[#00E5FF]">analyst@ghost-os:{cwd}$</span> {entry.cmd}
                </div>
                <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                  {entry.output}
                </pre>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 bg-[#0B101B] border-t border-slate-800 flex items-center gap-2">
            <span className="text-xs font-ghost-mono text-[#00FF41] shrink-0">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Enter command (e.g. "cd /var/log", "base64 -d /home/analyst/encoded_ioc.txt")...'
              className="flex-1 bg-transparent text-xs sm:text-sm font-ghost-mono text-white placeholder-slate-500 focus:outline-none min-h-[40px]"
            />
            <button
              type="button"
              onClick={() => runCommand()}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
            >
              Run
            </button>
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
