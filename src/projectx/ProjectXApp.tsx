import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Shield,
  Zap,
  Lock,
  Unlock,
  Radio,
  Eye,
  Cpu,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export interface ProjectXAppProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
}

interface CommandLog {
  id: number;
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export const ProjectXApp: React.FC<ProjectXAppProps> = ({
  onBackToHub,
  onOpenAppSwitcher
}) => {
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: 1, text: '[+] PROJECT-X CLASSIFIED AGENT WORKSTATION INITIALIZED', type: 'success' },
    { id: 2, text: '[+] SECURITY CLEARANCE: LEVEL 5 (GOD-TIER ARCHITECT)', type: 'output' },
    { id: 3, text: 'Type "help" to view all available cyber intelligence tools.', type: 'output' }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [matrixRain, setMatrixRain] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLogs: CommandLog[] = [
      ...logs,
      { id: Date.now(), text: `root@project-x:~# ${raw}`, type: 'input' }
    ];

    switch (cmd) {
      case 'help':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `AVAILABLE CYBER COMMANDS:
  • help                - Show this intelligence directive
  • nmap <target>       - Perform port security scan (e.g., nmap 192.168.1.1)
  • matrix              - Toggle digital green matrix rain
  • cat flag.txt        - Read classified root operational flag
  • decode <text>       - Base64 / Hex decryptor tool
  • whoami              - View agent profile and cryptographic clearance
  • ping <host>         - Measure latency packets
  • scan                - Quick network vulnerability radar
  • clear               - Clear current terminal console`
        });
        break;

      case 'nmap':
        const target = args[0] || '192.168.1.1';
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-01
Scanning ${target} [65535 ports]...
PORT     STATE SERVICE       REASON
22/tcp   open  ssh           OpenSSH 9.3p1 (Ubuntu)
80/tcp   open  http          nginx 1.24.0
443/tcp  open  https         TLSv1.3 ECDHE-RSA-AES256-GCM
8080/tcp open  http-proxy    Proxy Service Active
Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds.`
        });
        break;

      case 'matrix':
        setMatrixRain((prev) => !prev);
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: `[+] Matrix Digital Rain ${!matrixRain ? 'ACTIVATED' : 'DEACTIVATED'}.`
        });
        break;

      case 'cat':
        if (args[0] === 'flag.txt') {
          newLogs.push({
            id: Date.now() + 1,
            type: 'success',
            text: `FLAG{BCA_VERSE_SUPREME_ARCHITECT_OMNITRIX_1307_BYTE}\nCongratulations Agent! You have unlocked the deepest classified level of the ecosystem.`
          });
        } else {
          newLogs.push({
            id: Date.now() + 1,
            type: 'error',
            text: `cat: ${args[0] || 'file'}: No such file or directory`
          });
        }
        break;

      case 'decode':
        const textToDecode = args.join(' ');
        try {
          const decoded = atob(textToDecode);
          newLogs.push({
            id: Date.now() + 1,
            type: 'success',
            text: `[DECODED RESULT]: ${decoded}`
          });
        } catch {
          newLogs.push({
            id: Date.now() + 1,
            type: 'output',
            text: `Decoded ASCII: ${textToDecode.split('').map((c) => c.charCodeAt(0).toString(16)).join(' ')} (Hexdump)`
          });
        }
        break;

      case 'whoami':
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: `USER: root (Prince Thakur)
ROLE: Supreme System Architect
SYSTEM: Project-X Quantum Kernel 6.12.0
IP: 127.0.0.1 (Loopback Fortress)
STATUS: Unrestricted Access Granted`
        });
        break;

      case 'ping':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `PING ${args[0] || 'google.com'} (142.250.190.46): 56 data bytes
64 bytes from 142.250.190.46: icmp_seq=0 ttl=117 time=4.12 ms
64 bytes from 142.250.190.46: icmp_seq=1 ttl=117 time=3.98 ms
64 bytes from 142.250.190.46: icmp_seq=2 ttl=117 time=4.05 ms
--- ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss`
        });
        break;

      case 'scan':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `[!] RADAR SCAN COMPLETED:
• Firewall status: ACTIVE (0 breached ports)
• TLS Handshake: TLS 1.3 Strict
• Encryption Cipher: AES-GCM-256
• Zero-Day Vulnerabilities: 0 DETECTED. Fortress Secure.`
        });
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      default:
        newLogs.push({
          id: Date.now() + 1,
          type: 'error',
          text: `bash: ${cmd}: command not found. Type "help" to see valid commands.`
        });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col relative select-none pb-12">
      {/* Matrix Green Digital Background */}
      {matrixRain && (
        <div
          className="fixed inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(#10B981 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {/* Terminal Top Window Frame */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-emerald-500/40 px-4 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>PROJECT-X :: CLASSIFIED CYBER LAB</span>
            <span className="px-2 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ROOT SHELL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMatrixRain(!matrixRain)}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer"
          >
            Matrix: {matrixRain ? 'ON' : 'OFF'}
          </button>

          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
            >
              Apps
            </button>
          )}

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-md"
            >
              Exit Vault
            </button>
          )}
        </div>
      </header>

      {/* Terminal Output Body */}
      <main
        onClick={() => inputRef.current?.focus()}
        className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 overflow-y-auto space-y-3 cursor-text text-xs sm:text-sm select-text"
      >
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
          <p className="font-bold">⚡ WELCOME TO PROJECT-X ADVANCED CYBER LAB</p>
          <p className="text-[11px] text-emerald-500">
            Interactive Linux/Kali root emulator with packet inspection, hexdump and port scanner.
          </p>
        </div>

        {/* Command History */}
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`leading-relaxed whitespace-pre-wrap ${
                log.type === 'input'
                  ? 'text-cyan-300 font-bold'
                  : log.type === 'error'
                  ? 'text-rose-400'
                  : log.type === 'success'
                  ? 'text-emerald-300 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>

        {/* Command Input Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
          <span className="text-emerald-400 font-bold shrink-0">root@project-x:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-hidden font-mono caret-emerald-400"
            autoFocus
            placeholder="Type 'help'..."
          />
        </form>

        <div ref={bottomRef} />
      </main>
    </div>
  );
};
