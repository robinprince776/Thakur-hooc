import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export const CyberTerminalSimulator: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: '══════════════════════════════════════════════════════════════════════'
    },
    {
      id: 'init-2',
      type: 'system',
      text: '   ⚡ KALI LINUX CYBER WARFARE & SYSTEM SIMULATOR [v2026.4]  '
    },
    {
      id: 'init-3',
      type: 'system',
      text: '   Engineered by Prince Thakur · Authorized Educational Pentest Shell'
    },
    {
      id: 'init-4',
      type: 'system',
      text: '══════════════════════════════════════════════════════════════════════'
    },
    {
      id: 'init-5',
      type: 'output',
      text: 'Type "help" to view all available commands, or click any quick command chip below.'
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const quickCommands = [
    { label: 'nmap -sS target.com', cmd: 'nmap -sS scanme.org' },
    { label: 'cybercell 1930', cmd: 'cybercell 1930' },
    { label: 'param-siddhi --info', cmd: 'param-siddhi --info' },
    { label: 'omnitrix --status', cmd: 'omnitrix --status' },
    { label: 'itact --section 66', cmd: 'itact --section 66' },
    { label: 'ping -c 4 8.8.8.8', cmd: 'ping -c 4 8.8.8.8' },
    { label: 'whois google.com', cmd: 'whois google.com' },
    { label: 'ifconfig', cmd: 'ifconfig' }
  ];

  const executeCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    // Add user input to history
    const userLine: TerminalLine = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: `root@kali:~# ${cmd}`
    };

    const newLines: TerminalLine[] = [userLine];
    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    if (lower === 'help' || lower === 'commands' || lower === '?') {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `AVAILABLE CYBER & SYSTEM COMMANDS:
  nmap -sS <target>    : Execute TCP SYN Stealth Port Scan
  cybercell 1930       : Run Indian Cyber Cell & 1930 helpline emergency protocols
  param-siddhi --info  : Query India's premier PARAM Siddhi-AI Supercomputer specs
  omnitrix --status    : Check Ben 10 Alien Force Omnitrix DNA status & Azmuth core
  itact --section 66   : Display penalties under Information Technology Act 2000
  ping -c 4 <host>     : Send ICMP Echo Request packets
  whois <domain>       : Query domain WHOIS & Autonomous System Number (ASN)
  ifconfig             : Display network interface configurations and IP addresses
  hashcat -m 0 <hash>  : Crack MD5 password hash simulation
  uname -a             : Display Linux Kernel architecture and hostname
  date / uptime        : Check server synchronization
  clear                : Clear terminal screen`
      });
    } else if (lower.startsWith('nmap')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-14 02:40 IST
Initiating SYN Stealth Scan (-sS) [Half-Open Handshake]
Scanning scanme.org (45.33.32.156) [1000 ports]
Discovered open port 22/tcp on 45.33.32.156 (OpenSSH 8.9p1)
Discovered open port 80/tcp on 45.33.32.156 (Apache/2.4.52 HTTP)
Discovered open port 443/tcp on 45.33.32.156 (HTTPS TLSv1.3)
Discovered open port 3306/tcp on 45.33.32.156 (MySQL 8.0.35)

PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.9p1 Ubuntu
80/tcp   open  http     Apache httpd 2.4.52
443/tcp  open  ssl/http Apache httpd 2.4.52 (TLS 1.3)
3306/tcp open  mysql    MySQL Enterprise 8.0.35

Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds
[+] SYN Scan complete: Zero full-handshakes established. Application log footprint minimized.`
      });
    } else if (lower.includes('cybercell') || lower.includes('1930')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'success',
        text: `[!] INDIAN CYBER CRIME COORDINATION CENTRE (I4C) PROTOCOL:
════════════════════════════════════════════════════════════════
Emergency Helpline Number: 1930 (Toll Free, 24x7 Active)
National Reporting Portal: https://cybercrime.gov.in

GOLDEN HOUR CHECKLIST (First 2-3 Hours):
1. Immediately dial 1930 or submit transaction details on portal.
2. Required: 12-digit UTR/RRN Number, Your Bank A/c, Suspect UPI/Account.
3. System (CFCFRMS) auto-triggers debit freeze alert to recipient bank.
4. Obtain formal Acknowledgement Number via SMS.
5. Submit Section 65B certified chat & statement screenshots to local Cyber Cell.

Relevant Laws:
- IT Act 2000 Section 66D: Cheating by personation using computer resource.
- Section 66C: Identity theft & stolen credentials.`
      });
    } else if (lower.includes('param-siddhi') || lower.includes('supercomputer')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `HIGH PERFORMANCE COMPUTING (HPC) CLUSTER TELEMETRY:
════════════════════════════════════════════════════════════════
System Name        : PARAM Siddhi-AI (National Supercomputing Mission)
Headquarters       : C-DAC Pune, India
Peak Performance   : 5.267 PetaFLOPS (Rpeak) / 4.619 PetaFLOPS (Rmax)
Total Operations   : 5.267 × 10^15 Floating Point Operations per Second
Architecture       : NVIDIA DGX SuperPOD (210 Nodes, 1680 A100 GPUs)
Interconnect       : NVIDIA Mellanox HDR 200Gbps InfiniBand
Parallel Framework : OpenMPI 4.1 + CUDA 12.2 + Slurm Workload Manager
Primary Workloads  : Weather Modeling, Genomic Sequencing, Defense AI, Drug Discovery`
      });
    } else if (lower.includes('omnitrix')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'success',
        text: `AZMUTH GALVAN PRIME TELEMETRY MATRIX:
════════════════════════════════════════════════════════════════
Device Model       : Omnitrix Recalibrated [Alien Force Mode]
Firmware           : Level 20 Technology (Galvan Prime Standard)
DNA Database       : 1,000,903 Stored Alien DNA Profiles
Active AF Matrix   : Swampfire, Brainstorm, Humungousaur, Jetray, Echo Echo,
                     Chromastone, Big Chill, Spidermonkey, Goop, Alien X
Core Energy State  : 100% Emerald Plasma
Self-Destruct Code : DEACTIVATED
Voice Command Auth : Prince Thakur [Master Controller]`
      });
    } else if (lower.includes('itact') || lower.includes('section 66')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `INFORMATION TECHNOLOGY ACT, 2000 (AMENDED 2008):
════════════════════════════════════════════════════════════════
Section 66 (Computer Related Offences):
- Dishonestly or fraudulently commits any act referred to in Section 43.
- Punishment: Imprisonment up to 3 Years, or fine up to ₹5,00,000, or both.
- Cognizable & Bailable.

Section 66C (Identity Theft):
- Fraudulently makes use of electronic signature, password, or biometric.
- Punishment: Up to 3 Years + fine up to ₹1,00,000.

Section 66D (Cheating by Personation):
- Cheats by personating someone using computer resource or communication device.
- Punishment: Up to 3 Years + fine up to ₹1,00,000.

Section 66F (Cyber Terrorism):
- Acts with intent to threaten the unity, integrity, security or sovereignty of India.
- Punishment: IMPRISONMENT FOR LIFE (Non-Bailable).`
      });
    } else if (lower.startsWith('ping')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=15.1 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=13.8 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=14.6 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 13.812/14.425/15.102/0.485 ms`
      });
    } else if (lower.startsWith('whois')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `Domain Name: GOOGLE.COM
Registry Domain ID: 2138514_DOMAIN_COM-VRSN
Registrar: MarkMonitor, Inc.
Creation Date: 1997-09-15T04:00:00Z
Registry Expiry Date: 2028-09-14T04:00:00Z
Name Server: NS1.GOOGLE.COM
Name Server: NS2.GOOGLE.COM
Autonomous System: AS15169 Google LLC
Status: clientDeleteProhibited, clientUpdateProhibited`
      });
    } else if (lower === 'ifconfig' || lower === 'ip addr') {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.108  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66b1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:b1  txqueuelen 1000  (Ethernet)
        RX packets 249018  bytes 189283921 (189.2 MB)
        TX packets 140922  bytes 14920392 (14.9 MB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)`
      });
    } else if (lower.startsWith('uname')) {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: `Linux kali-rolling 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 x86_64 GNU/Linux`
      });
    } else if (lower === 'date') {
      newLines.push({
        id: `out-${Date.now()}-1`,
        type: 'output',
        text: new Date().toUTCString()
      });
    } else {
      newLines.push({
        id: `err-${Date.now()}-1`,
        type: 'error',
        text: `bash: ${cmd.split(' ')[0]}: command not recognized in sandbox. Type "help" to view allowed commands.`
      });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#060D08] overflow-hidden shadow-2xl font-mono text-xs text-slate-100 flex flex-col h-[600px]">
      {/* Terminal Title Bar */}
      <div className="bg-[#09150B] px-4 py-2.5 border-b border-[#00FF66]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>
          <span className="text-zinc-500">|</span>
          <span className="text-[#00FF66] font-bold flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>root@kali:~ (Interactive Cyber Sandbox)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-400 hover:text-white border border-zinc-700 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Click Command Chips */}
      <div className="bg-[#040A05] px-4 py-2 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-[#00FF66] shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#00FF66]" /> Click to Run:
        </span>
        {quickCommands.map((qc) => (
          <button
            key={qc.label}
            onClick={() => executeCommand(qc.cmd)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-[#00FF66]/20 border border-zinc-700/80 hover:border-[#00FF66]/60 text-[11px] text-zinc-300 hover:text-[#00FF66] shrink-0 transition-colors cursor-pointer"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen / Output Buffer */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-1.5 leading-relaxed selection:bg-[#00FF66]/30 selection:text-white"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line) => {
          if (line.type === 'input') {
            return (
              <div key={line.id} className="text-[#00FF66] font-bold">
                {line.text}
              </div>
            );
          }
          if (line.type === 'error') {
            return (
              <div key={line.id} className="text-rose-400">
                {line.text}
              </div>
            );
          }
          if (line.type === 'success') {
            return (
              <div key={line.id} className="text-emerald-300 whitespace-pre-wrap">
                {line.text}
              </div>
            );
          }
          if (line.type === 'system') {
            return (
              <div key={line.id} className="text-cyan-400 font-semibold whitespace-pre-wrap">
                {line.text}
              </div>
            );
          }
          return (
            <div key={line.id} className="text-slate-300 whitespace-pre-wrap">
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Command Prompt Input Form */}
      <div className="bg-[#040A05] border-t border-[#00FF66]/20 p-2.5 flex items-center gap-2">
        <span className="text-[#00FF66] font-bold shrink-0">root@kali:~#</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') executeCommand(inputVal);
          }}
          placeholder="Type command (e.g. nmap -sS target, cybercell 1930, param-siddhi, help)..."
          className="flex-1 bg-transparent text-[#00FF66] placeholder:text-zinc-600 outline-none font-mono text-xs"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="px-3 py-1 rounded-lg bg-[#00FF66] hover:bg-[#00DD55] disabled:opacity-30 text-black font-bold text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
        >
          <Play className="w-3 h-3 fill-black" />
          <span>Exec</span>
        </button>
      </div>
    </div>
  );
};
