import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, HelpCircle, Shield, Play } from 'lucide-react';
import { TerminalLog } from '../types';

export const CyberTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      type: 'system',
      text: '┌──(kali㉿hackverse)-[~]\n└─$ Welcome to Kali CyberShield v2.4 (Interactive Hacker Terminal in Hinglish)',
      timestamp: '00:00:01'
    },
    {
      id: 'init-2',
      type: 'output',
      text: '💡 Type "help" to see available ethical hacking commands (nmap, sqlmap, hashcat, whoami, ping, cat, decode).',
      timestamp: '00:00:02'
    }
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const time = new Date().toLocaleTimeString();
    const newLogs: TerminalLog[] = [
      {
        id: `input-${Date.now()}`,
        type: 'input',
        text: `┌──(kali㉿hackverse)-[~]\n└─$ ${trimmed}`,
        timestamp: time
      }
    ];

    const parts = trimmed.split(' ');
    const base = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    if (base === 'clear' || base === 'cls') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (base === 'help') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `COMMANDS DIRECTORY (Zero to Hero Kali Suite):
  • help                     : Yeh help menu dikhayega
  • nmap [target]            : Port scanning simulator (e.g., nmap 192.168.1.1)
  • sqlmap -u [url]          : Automated SQL injection tester
  • hashcat -m 0 [hash]      : MD5 password hash cracker
  • whoami                   : Current logged in user profile
  • uname -a                 : Linux kernel details
  • cat /etc/passwd          : Read simulated Linux users file
  • ping [host]              : ICMP ping latency check
  • whois [domain]           : Domain OSINT information lookup
  • decode [base64_string]   : Base64 decode tool
  • clear                    : Terminal screen clear karein`,
        timestamp: time
      });
    } else if (base === 'whoami') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: `root (Full Superuser Privileges Granted · Cyber Hunter Profile)`,
        timestamp: time
      });
    } else if (base === 'uname') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Linux kali-hackverse 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 2026.2 x86_64 GNU/Linux`,
        timestamp: time
      });
    } else if (base === 'nmap') {
      const target = arg || '192.168.1.1';
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Starting Nmap 7.94 ( https://nmap.org ) at ${time}
Scanning ${target} [1000 ports]...
PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 8.9p1 (Ubuntu Linux)
80/tcp   open  http          Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl/https     Apache httpd 2.4.52 (TLSv1.3)
3306/tcp open  mysql         MySQL 8.0.35-0ubuntu0.22.04.1
8080/tcp open  http-proxy    Werkzeug httpd 2.2.2 (Python 3.10)

Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds.
💡 HACKER NOTE: Port 8080 aur Port 3306 direct internet par exposed hain — potential SQLi aur Dev endpoints check karo!`,
        timestamp: time
      });
    } else if (base === 'sqlmap') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `[!] Legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal.
[*] testing connection to the target URL
[+] target URL appears to be responsive
[+] heuristics detected that GET parameter 'id' might be injectable (type: boolean-based blind / UNION query)
[+] Parameter: id (GET)
    Type: UNION query
    Title: Generic UNION query (NULL) - 3 columns
    Payload: id=-1 UNION ALL SELECT NULL,version(),user()-- -
[*] fetched database: 'shop_db_prod'
[*] fetched current user: 'root@localhost' (DBA privileges detected!)
🎉 SUCCESS: Parameter vulnerable to SQL Injection!`,
        timestamp: time
      });
    } else if (base === 'hashcat') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'success',
        text: `hashcat (v6.2.6) starting in dictionary attack mode...
Hashes: 1 / 1
Wordlist: /usr/share/wordlists/rockyou.txt (14,341,564 entries)
Speed: 4,821.5 MH/s (utilizing simulated RTX GPU)

21232f297a57a5a743894a0e4a801fc3:admin
Status...........: Cracked
Candidates.#1....: admin -> admin123
Time.Started.....: 0.12 secs
💡 EXPLANATION: MD5 hash '21232f...fc3' was successfully cracked to plaintext 'admin'.`,
        timestamp: time
      });
    } else if (base === 'cat') {
      if (arg.includes('passwd')) {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
prince_thakur:x:1000:1000:Prince Thakur,,,:/home/prince_thakur:/bin/bash
mysql:x:114:120:MySQL Server,,,:/nonexistent:/bin/false
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`,
          timestamp: time
        });
      } else {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `cat: ${arg || 'file'}: No such file or directory. Try: "cat /etc/passwd"`,
          timestamp: time
        });
      }
    } else if (base === 'ping') {
      const host = arg || '8.8.8.8';
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `PING ${host} (${host}) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=117 time=14.2 ms
64 bytes from ${host}: icmp_seq=2 ttl=117 time=13.8 ms
64 bytes from ${host}: icmp_seq=3 ttl=117 time=14.1 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2004ms
rtt min/avg/max/mdev = 13.801/14.033/14.214/0.170 ms`,
        timestamp: time
      });
    } else if (base === 'whois') {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'output',
        text: `Domain Name: ${arg || 'hackverse.cyber'}
Registry Domain ID: 298410294_DOMAIN_CYBER-VRS
Registrar WHOIS Server: whois.cyber-registrar.net
Updated Date: 2026-04-12T08:30:11Z
Creation Date: 2024-01-10T00:00:00Z
Registrant Name: Protected by Cloudflare Privacy Guard
Name Server: NS1.CLOUDFLARE.COM
Name Server: NS2.CLOUDFLARE.COM
DNSSEC: signedDelegation`,
        timestamp: time
      });
    } else if (base === 'decode') {
      try {
        const decoded = atob(arg.trim());
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: `Base64 Decoded Value: "${decoded}"`,
          timestamp: time
        });
      } catch {
        newLogs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `Invalid Base64 string. Example: decode YWRtaW4= (gives admin)`,
          timestamp: time
        });
      }
    } else {
      newLogs.push({
        id: `out-${Date.now()}`,
        type: 'error',
        text: `bash: command not found: "${trimmed}". Type "help" to see available cyber commands.`,
        timestamp: time
      });
    }

    setLogs((prev) => [...prev, ...newLogs]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-[#080B10] rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-[#0D121D] px-4 py-2.5 border-b border-emerald-500/20 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-400" />
          </div>
          <span className="text-zinc-400 font-semibold ml-2 text-[11px] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            kali@hackverse: ~ (Interactive Cyber Terminal)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => executeCommand('help')}
            className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>help</span>
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
            title="Clear Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Screen / Output Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-emerald-900">
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            {log.type === 'input' && (
              <pre className="text-emerald-400 font-bold whitespace-pre-wrap">{log.text}</pre>
            )}
            {log.type === 'output' && (
              <pre className="text-zinc-300 whitespace-pre-wrap">{log.text}</pre>
            )}
            {log.type === 'success' && (
              <pre className="text-emerald-300 whitespace-pre-wrap bg-emerald-950/30 p-2 rounded border border-emerald-800/40">
                {log.text}
              </pre>
            )}
            {log.type === 'error' && (
              <pre className="text-red-400 whitespace-pre-wrap bg-red-950/30 p-2 rounded border border-red-800/40">
                {log.text}
              </pre>
            )}
            {log.type === 'system' && (
              <pre className="text-cyan-300 whitespace-pre-wrap">{log.text}</pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Launch Command Badges */}
      <div className="px-3 py-1.5 bg-[#0a0f18] border-t border-emerald-900/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-zinc-500 font-sans text-[10px] uppercase font-bold shrink-0">
          Quick Run:
        </span>
        {['help', 'nmap 192.168.1.1', 'sqlmap -u shop.com?id=1', 'hashcat -m 0', 'cat /etc/passwd', 'whoami'].map((q) => (
          <button
            key={q}
            onClick={() => executeCommand(q)}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-emerald-950 text-zinc-300 hover:text-emerald-300 border border-zinc-800 hover:border-emerald-700/60 transition-colors shrink-0 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Prompt Form */}
      <div className="bg-[#0b101a] px-4 py-3 border-t border-emerald-500/20 flex items-center gap-2">
        <span className="text-emerald-400 font-bold shrink-0">kali@hackverse:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. nmap 192.168.1.1, whoami, help)..."
          className="flex-1 bg-transparent text-emerald-200 outline-none placeholder:text-zinc-600 font-mono text-xs"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-black font-bold cursor-pointer transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
