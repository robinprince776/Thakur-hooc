import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Search,
  Folder,
  FileText,
  Lock,
  Unlock,
  Activity
} from 'lucide-react';

export interface LinuxMasteryAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const LinuxMasteryApp: React.FC<LinuxMasteryAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'visualizer' | 'permissions' | 'kali-tools'>('terminal');

  // Interactive Terminal State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string; isError?: boolean }>>([
    { cmd: 'uname -a', output: 'Linux kali 6.1.0-kali7-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1 x86_64 GNU/Linux' },
    { cmd: 'whoami', output: 'kali' },
    { cmd: 'cat /etc/os-release | grep PRETTY', output: 'PRETTY_NAME="Kali GNU/Linux Rolling"' },
    { cmd: 'help', output: 'Available Commands: ls, cat, grep, pwd, chmod, netstat, ps, whoami, id, uname, clear, help' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;
    setTerminalInput('');

    if (raw.toLowerCase() === 'clear') {
      setTerminalHistory([]);
      return;
    }

    let output = '';
    let isError = false;
    const lower = raw.toLowerCase();

    if (lower === 'ls' || lower === 'ls -la' || lower === 'ls -l') {
      output = `total 24
drwxr-xr-x 4 kali kali 4096 Oct 17 09:30 .
drwxr-xr-x 3 root root 4096 Oct 17 08:00 ..
-rw-r--r-- 1 kali kali  320 Oct 17 09:12 notes.txt
-rwxr-xr-x 1 kali kali 1024 Oct 17 09:15 backup.sh
-rw------- 1 kali kali  512 Oct 17 09:20 id_rsa
drwxr-xr-x 2 kali kali 4096 Oct 17 09:25 ctf_challenges`;
    } else if (lower.startsWith('cat ')) {
      const target = raw.substring(4).trim();
      if (target === 'notes.txt') {
        output = `CyberSecurity Checklist:\n1. Verify file permissions with ls -la\n2. Inspect open ports with netstat -tulpn\n3. Never run untrusted scripts as root!`;
      } else if (target === 'backup.sh') {
        output = `#!/bin/bash\necho "Running safe automated backup..."\ntar -czf /tmp/backup.tar.gz /home/kali/notes.txt`;
      } else if (target === 'id_rsa') {
        output = `-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAA... [PROTECTED PERMISSION 600]`;
      } else {
        output = `cat: ${target}: No such file or directory`;
        isError = true;
      }
    } else if (lower.includes('grep')) {
      output = `Matching lines:\n-rwxr-xr-x 1 kali kali 1024 backup.sh\nnotes.txt: 1. Verify file permissions with ls -la`;
    } else if (lower === 'pwd') {
      output = '/home/kali';
    } else if (lower === 'whoami') {
      output = 'kali';
    } else if (lower === 'id') {
      output = 'uid=1000(kali) gid=1000(kali) groups=1000(kali),27(sudo),100(users)';
    } else if (lower === 'uname' || lower === 'uname -a') {
      output = 'Linux kali 6.1.0-kali7-amd64 #1 SMP Debian x86_64 GNU/Linux';
    } else if (lower.includes('netstat')) {
      output = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      512/sshd            
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      789/mysqld          
tcp6       0      0 :::80                   :::*                    LISTEN      1024/apache2`;
    } else if (lower.includes('ps')) {
      output = `UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 08:00 ?        00:00:01 /sbin/init
kali       512     1  0 08:15 ?        00:00:00 /usr/sbin/sshd -D
kali      1420   512  0 09:30 pts/0    00:00:00 -bash`;
    } else if (lower.startsWith('chmod')) {
      output = `Permission modified successfully for target file.`;
    } else if (lower === 'help') {
      output = `Built-in simulated commands:\n  ls [-la]       List directory files and permissions\n  cat <file>     Display contents (notes.txt, backup.sh, id_rsa)\n  grep <pattern> Search for text patterns\n  pwd            Print working directory\n  whoami / id    Display current user credentials and group IDs\n  netstat -tulpn Display listening TCP/UDP ports\n  ps aux         Display active processes\n  chmod <mode>   Change file permissions\n  clear          Clear the terminal screen`;
    } else {
      output = `bash: ${raw.split(' ')[0]}: command not found. Type 'help' to see valid commands.`;
      isError = true;
    }

    setTerminalHistory((prev) => [...prev, { cmd: raw, output, isError }]);
  };

  // Interactive Permissions Calculator State
  const [userPerms, setUserPerms] = useState({ r: true, w: true, x: true });
  const [groupPerms, setGroupPerms] = useState({ r: true, w: false, x: true });
  const [otherPerms, setOtherPerms] = useState({ r: true, w: false, x: false });

  const octalValue = useMemo(() => {
    const calc = (p: { r: boolean; w: boolean; x: boolean }) => (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
    return `${calc(userPerms)}${calc(groupPerms)}${calc(otherPerms)}`;
  }, [userPerms, groupPerms, otherPerms]);

  const symbolicValue = useMemo(() => {
    const fmt = (p: { r: boolean; w: boolean; x: boolean }) => `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`;
    return `-${fmt(userPerms)}${fmt(groupPerms)}${fmt(otherPerms)}`;
  }, [userPerms, groupPerms, otherPerms]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Linux &amp; Kali Mastery
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      CLI &amp; Core Internals
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Interactive terminal simulator, command diagrams &amp; permissions matrix
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite Apps</span>
            </button>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'terminal', label: '1. 💻 Terminal Shell', icon: Terminal },
              { id: 'visualizer', label: '2. 🔍 Command Diagrams', icon: Activity },
              { id: 'permissions', label: '3. 🔐 Permissions Calculator', icon: Lock },
              { id: 'kali-tools', label: '4. 🐉 Kali Toolchains', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: TERMINAL SHELL */}
        {activeTab === 'terminal' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-xs text-slate-400">kali@virtual-lab: ~</span>
              </div>
              <button
                onClick={() => setTerminalHistory([])}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>

            {/* Terminal Window */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 font-mono text-xs text-slate-200 min-h-[420px] max-h-[550px] overflow-y-auto space-y-3 border border-slate-800/80">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <span>kali@lab:~$</span>
                    <span className="text-white">{item.cmd}</span>
                  </div>
                  <pre className={`whitespace-pre-wrap leading-relaxed text-[11px] ${
                    item.isError ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {item.output}
                  </pre>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Command Input Form */}
            <form onSubmit={handleCommandSubmit} className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-mono">
                <span className="text-cyan-400 font-bold shrink-0">kali@lab:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type command (e.g. ls -la, cat notes.txt, netstat, ps aux)..."
                  className="w-full bg-transparent text-white focus:outline-none"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Execute
              </button>
            </form>

            {/* Quick Command Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
              <span className="text-slate-400 font-bold">Try Quick Commands:</span>
              {['ls -la', 'cat notes.txt', 'netstat -tulpn', 'ps aux', 'id', 'help'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setTerminalInput(cmd);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono cursor-pointer"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: COMMAND DIAGRAMS */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white">Visual Breakdown of Core Linux Commands</h2>
              <p className="text-xs text-slate-400">
                Visualizing how pipes, redirects, file descriptors (stdin/stdout/stderr), and file structures interact in the Linux kernel.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Visual 1: Pipes & Grep */}
                <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    cat /var/log/auth.log | grep -i &quot;failed password&quot; | wc -l
                  </div>
                  <div className="flex items-center gap-2 py-3 overflow-x-auto text-[11px] font-mono">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                      <span className="text-slate-400 block text-[9px]">Process 1</span>
                      <strong className="text-white">cat auth.log</strong>
                      <span className="text-cyan-400 block text-[9px]">stdout (FD 1)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                      <span className="text-slate-400 block text-[9px]">Pipe |</span>
                      <strong className="text-emerald-400">grep -i</strong>
                      <span className="text-emerald-300 block text-[9px]">filtered stream</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
                      <span className="text-slate-400 block text-[9px]">Process 3</span>
                      <strong className="text-amber-400">wc -l</strong>
                      <span className="text-amber-300 block text-[9px]">Line Count</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Linux pipes `|` connect the Standard Output (FD 1) of the preceding command directly into the Standard Input (FD 0) of the succeeding command in RAM without writing temporary files to disk!
                  </p>
                </div>

                {/* Visual 2: File Descriptors */}
                <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    find / -perm -4000 2&gt;/dev/null
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex justify-between">
                      <span>File Descriptor 0 (stdin)</span>
                      <span className="text-cyan-400">Keyboard / Input Stream</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex justify-between">
                      <span>File Descriptor 1 (stdout)</span>
                      <span className="text-emerald-400">Normal Terminal Display</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 flex justify-between">
                      <span>File Descriptor 2 (stderr)</span>
                      <span className="text-rose-400">Redirected to `/dev/null` (Bit Bucket)</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Adding `2&gt;/dev/null` discards all &quot;Permission Denied&quot; error messages, displaying only SUID binaries the current user can actually read.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERMISSIONS CALCULATOR */}
        {activeTab === 'permissions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Interactive Linux Permissions &amp; Octal Calculator</h2>
            <p className="text-xs text-slate-400">
              Toggle read, write, and execute bits across User, Group, and Others to see octal (`755`) and symbolic (`rwxr-xr-x`) representations.
            </p>

            {/* Display Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Octal Notation</span>
                <div className="text-3xl font-black text-cyan-400 font-mono">chmod {octalValue}</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Symbolic Representation</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">{symbolicValue}</div>
              </div>
            </div>

            {/* Interactive Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              {/* User Permissions */}
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                <span className="font-bold text-cyan-400 block uppercase">User (Owner)</span>
                {[
                  { key: 'r' as const, label: 'Read (4)', active: userPerms.r },
                  { key: 'w' as const, label: 'Write (2)', active: userPerms.w },
                  { key: 'x' as const, label: 'Execute (1)', active: userPerms.x }
                ].map((perm) => (
                  <button
                    key={perm.key}
                    onClick={() => setUserPerms((prev) => ({ ...prev, [perm.key]: !prev[perm.key] }))}
                    className={`w-full p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between ${
                      perm.active ? 'bg-cyan-950 border-cyan-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{perm.label}</span>
                    {perm.active ? <Check className="w-4 h-4 text-cyan-400" /> : <span className="text-slate-600">-</span>}
                  </button>
                ))}
              </div>

              {/* Group Permissions */}
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                <span className="font-bold text-emerald-400 block uppercase">Group</span>
                {[
                  { key: 'r' as const, label: 'Read (4)', active: groupPerms.r },
                  { key: 'w' as const, label: 'Write (2)', active: groupPerms.w },
                  { key: 'x' as const, label: 'Execute (1)', active: groupPerms.x }
                ].map((perm) => (
                  <button
                    key={perm.key}
                    onClick={() => setGroupPerms((prev) => ({ ...prev, [perm.key]: !prev[perm.key] }))}
                    className={`w-full p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between ${
                      perm.active ? 'bg-emerald-950 border-emerald-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{perm.label}</span>
                    {perm.active ? <Check className="w-4 h-4 text-emerald-400" /> : <span className="text-slate-600">-</span>}
                  </button>
                ))}
              </div>

              {/* Others Permissions */}
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                <span className="font-bold text-amber-400 block uppercase">Others (Public)</span>
                {[
                  { key: 'r' as const, label: 'Read (4)', active: otherPerms.r },
                  { key: 'w' as const, label: 'Write (2)', active: otherPerms.w },
                  { key: 'x' as const, label: 'Execute (1)', active: otherPerms.x }
                ].map((perm) => (
                  <button
                    key={perm.key}
                    onClick={() => setOtherPerms((prev) => ({ ...prev, [perm.key]: !prev[perm.key] }))}
                    className={`w-full p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between ${
                      perm.active ? 'bg-amber-950 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{perm.label}</span>
                    {perm.active ? <Check className="w-4 h-4 text-amber-400" /> : <span className="text-slate-600">-</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KALI TOOLCHAINS */}
        {activeTab === 'kali-tools' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Kali Linux Professional Toolchain Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {[
                { name: 'Nmap', cat: 'Reconnaissance', desc: 'Network mapper, port scanner, service detection, and NSE script engine.' },
                { name: 'Wireshark', cat: 'Packet Analysis', desc: 'Live network packet dissection, protocol inspection, and TLS stream decryptor.' },
                { name: 'Burp Suite', cat: 'Web Security', desc: 'HTTP proxy, repeater, intruder, and vulnerability scanning framework.' },
                { name: 'Ghidra / Radare2', cat: 'Reverse Engineering', desc: 'NSA open-source decompiler for x86, ARM, and MIPS binaries.' },
                { name: 'Volatility', cat: 'Digital Forensics', desc: 'RAM memory dump extraction, process tree analysis, and DLL injection detection.' },
                { name: 'John the Ripper / Hashcat', cat: 'Password Recovery', desc: 'High-speed GPU hash auditing for dictionary and rule-based tests.' }
              ].map((tool, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{tool.name}</span>
                    <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">{tool.cat}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
