import React, { useState } from 'react';
import { CheckCircle2, Terminal, Play } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

interface VmTask {
  id: string;
  title: string;
  instruction: string;
  expectedCmd: string;
  hint: string;
  simulatedOutput: string;
}

const VM_TASKS: VmTask[] = [
  {
    id: 'vm-ports',
    title: 'Task 01: Audit Listening Local Ports',
    instruction: 'List all listening TCP/UDP sockets on this mock Kali audit VM using ss.',
    expectedCmd: 'ss -tuln',
    hint: 'Try running: ss -tuln',
    simulatedOutput:
      'Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port\ntcp    LISTEN  0       128      127.0.0.1:5432       0.0.0.0:*\ntcp    LISTEN  0       128      0.0.0.0:22           0.0.0.0:*\ntcp    LISTEN  0       511      0.0.0.0:443          0.0.0.0:*',
  },
  {
    id: 'vm-ufw',
    title: 'Task 02: Verify Host Firewall Status',
    instruction: 'Check active UFW firewall rules to ensure default incoming traffic is denied.',
    expectedCmd: 'sudo ufw status',
    hint: 'Try running: sudo ufw status',
    simulatedOutput:
      'Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing)\n\nTo                         Action      From\n--                         ------      ----\n443/tcp                    ALLOW IN    Anywhere\n22/tcp                     LIMIT IN    10.24.0.0/24',
  },
  {
    id: 'vm-perms',
    title: 'Task 03: Inspect Shadow File Permissions',
    instruction: 'Verify that /etc/shadow is strictly restricted to root read-only.',
    expectedCmd: 'ls -l /etc/shadow',
    hint: 'Try running: ls -l /etc/shadow',
    simulatedOutput: '-rw-r----- 1 root shadow 1428 Nov 16 06:40 /etc/shadow  [SECURE: No world-read bit]',
  },
  {
    id: 'vm-hash',
    title: 'Task 04: Verify Forensic Package Checksum',
    instruction: 'Compute the SHA-256 integrity digest of agent-patch.tar.gz before deployment.',
    expectedCmd: 'sha256sum agent-patch.tar.gz',
    hint: 'Try running: sha256sum agent-patch.tar.gz',
    simulatedOutput:
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  agent-patch.tar.gz\n[OK] Signature matches trusted release manifest.',
  },
];

export const VirtualCyberRangeModule: React.FC = () => {
  const completedVmTasks = useGhostStore((s) => s.completedVmTasks);
  const completeVmTask = useGhostStore((s) => s.completeVmTask);

  const [cmdInput, setCmdInput] = useState('');
  const [vmScreen, setVmScreen] = useState<Array<{ cmd: string; out: string; ok: boolean }>>([
    {
      cmd: 'uname -a',
      out: 'Linux ghost-kali-defense 6.8.0-sandbox #1 SMP x86_64 GNU/Linux (Isolated Audit VM)',
      ok: true,
    },
  ]);

  const executeVmCommand = (rawCmd?: string) => {
    const cmd = (rawCmd ?? cmdInput).trim();
    if (!cmd) return;
    setCmdInput('');

    const matchedTask = VM_TASKS.find((t) => t.expectedCmd.toLowerCase() === cmd.toLowerCase());
    if (matchedTask) {
      completeVmTask(matchedTask.id, 60);
      setVmScreen((prev) => [
        ...prev,
        {
          cmd,
          out: `${matchedTask.simulatedOutput}\n\n[MISSION CHECKPOINT] ${matchedTask.title} verified (+60 XP)`,
          ok: true,
        },
      ]);
      return;
    }

    if (cmd === 'clear') {
      setVmScreen([]);
      return;
    }

    if (cmd === 'help') {
      setVmScreen((prev) => [
        ...prev,
        {
          cmd,
          out: 'Available VM audit commands:\n  ss -tuln\n  sudo ufw status\n  ls -l /etc/shadow\n  sha256sum agent-patch.tar.gz\n  clear',
          ok: true,
        },
      ]);
      return;
    }

    setVmScreen((prev) => [
      ...prev,
      {
        cmd,
        out: `bash: "${cmd}" is not part of the guided audit objectives. Type "help" or click a task quick-fill.`,
        ok: false,
      },
    ]);
  };

  return (
    <ModuleFrame
      moduleId="range"
      onResetLocal={() =>
        setVmScreen([
          {
            cmd: 'uname -a',
            out: 'Linux ghost-kali-defense 6.8.0-sandbox #1 SMP x86_64 GNU/Linux (Isolated Audit VM)',
            ok: true,
          },
        ])
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Guided Exercise Checklist */}
        <div className="space-y-3">
          {VM_TASKS.map((task) => {
            const done = completedVmTasks.includes(task.id);
            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border ${
                  done ? 'border-[#00FF41]/40 bg-[#00FF41]/5' : 'border-slate-800 bg-[#0D1322]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">{task.title}</span>
                  {done && <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">{task.instruction}</p>
                <button
                  type="button"
                  onClick={() => executeVmCommand(task.expectedCmd)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-ghost-mono text-[#00E5FF] cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Run: {task.expectedCmd}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Mock Kali VM Screen */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#060910] flex flex-col overflow-hidden min-h-[420px]">
          <div className="px-4 py-2.5 bg-[#0E1525] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-ghost-mono text-slate-200">
              <Terminal className="w-4 h-4 text-[#00FF41]" />
              <span>analyst@ghost-kali-vm:~/audit-range</span>
            </div>
            <span className="text-[11px] font-ghost-mono text-[#00E5FF]">
              {completedVmTasks.length} / {VM_TASKS.length} Hardened
            </span>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto font-ghost-mono text-xs">
            {vmScreen.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="text-[#00FF41]">
                  <span className="text-[#00E5FF]">analyst@kali:~$</span> {item.cmd}
                </div>
                <pre
                  className={`whitespace-pre-wrap leading-relaxed ${
                    item.ok ? 'text-slate-200' : 'text-[#FF003C]'
                  }`}
                >
                  {item.out}
                </pre>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#0B101B] border-t border-slate-800 flex items-center gap-2">
            <span className="text-xs font-ghost-mono text-[#00FF41] shrink-0">$</span>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeVmCommand()}
              placeholder="Type guided audit command (e.g. ss -tuln)..."
              className="flex-1 bg-transparent text-xs sm:text-sm font-ghost-mono text-white placeholder-slate-500 focus:outline-none min-h-[40px]"
            />
            <button
              type="button"
              onClick={() => executeVmCommand()}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#00FF41] hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
            >
              Execute
            </button>
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
