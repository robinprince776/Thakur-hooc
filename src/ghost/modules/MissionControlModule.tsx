import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

interface MissionChoice {
  label: string;
  outcome: string;
  isOptimal: boolean;
  nextStep?: number;
}

interface MissionStep {
  prompt: string;
  clue: string;
  choices: MissionChoice[];
}

interface MissionScenario {
  id: string;
  title: string;
  codename: string;
  difficulty: 'Intermediate' | 'Advanced';
  summary: string;
  steps: MissionStep[];
  reportFinding: string;
  reportRecommendation: string;
}

const MISSIONS: MissionScenario[] = [
  {
    id: 'op-dark-web',
    title: 'Operation Dark Web',
    codename: 'Credential Leak Containment',
    difficulty: 'Intermediate',
    summary: 'OSINT monitors flagged company staging credentials circulating on a paste mirror.',
    reportFinding: 'Exposed legacy API key discovered in public CI log snapshot.',
    reportRecommendation: 'Rotate compromised tokens immediately, purge CI artifacts, and enforce secret scanning.',
    steps: [
      {
        prompt: 'Step 1: Telemetry confirms an old staging API key appeared in a public repository snapshot.',
        clue: 'Clue: Audit logs show 14 read queries from IP 185.220.x.x within the last 10 minutes.',
        choices: [
          {
            label: 'Revoke the leaked key immediately and enable IP allowlisting',
            outcome: 'Containment successful. Unauthorized queries now return HTTP 401.',
            isOptimal: true,
            nextStep: 1,
          },
          {
            label: 'Delete the public post without rotating the token',
            outcome: 'Risky: Cached copies still hold the valid key. Better to revoke first.',
            isOptimal: false,
          },
        ],
      },
      {
        prompt: 'Step 2: Prevent future credential leakage across developer commits.',
        clue: 'Clue: Two other microservices still store database URIs in plaintext env files.',
        choices: [
          {
            label: 'Deploy pre-commit secret scanners & migrate secrets to a managed vault',
            outcome: 'Mission Cleared! Zero hardcoded credentials remain in CI pipelines.',
            isOptimal: true,
          },
          {
            label: 'Ask developers manually in chat to be more careful',
            outcome: 'Human reminders alone fail at scale. Automated controls are needed.',
            isOptimal: false,
          },
        ],
      },
    ],
  },
  {
    id: 'phishing-syndicate',
    title: 'The Phishing Syndicate',
    codename: 'DMARC Spoof Neutralization',
    difficulty: 'Intermediate',
    summary: 'Finance staff received urgent invoice emails impersonating the CFO domain.',
    reportFinding: 'Lookalike domain spoofing active due to permissive DMARC p=none policy.',
    reportRecommendation: 'Enforce SPF strict alignment, DKIM signing, and DMARC p=reject with banner alerts.',
    steps: [
      {
        prompt: 'Step 1: Inspect the suspicious email header to verify authenticity.',
        clue: 'Clue: Return-Path shows mail@finance-pay-portal.example while Display From claims CEO.',
        choices: [
          {
            label: 'Quarantine matching emails and block the sender lookalike domain at the gateway',
            outcome: 'Gateway rule deployed. 18 pending inbox deliveries safely quarantined.',
            isOptimal: true,
            nextStep: 1,
          },
          {
            label: 'Click the invoice link inside a corporate admin browser to verify',
            outcome: 'Unsafe! Never open untrusted links outside an isolated sandbox.',
            isOptimal: false,
          },
        ],
      },
      {
        prompt: 'Step 2: Harden domain authentication so future spoofs fail automatically.',
        clue: 'Clue: Current DNS TXT record uses v=DMARC1; p=none.',
        choices: [
          {
            label: 'Upgrade DMARC policy to p=reject with strict DKIM & SPF alignment',
            outcome: 'Mission Cleared! Spoofed messages are now rejected before reaching staff.',
            isOptimal: true,
          },
          {
            label: 'Leave DMARC at p=none to avoid monitoring reports',
            outcome: 'p=none only monitors without blocking forged senders.',
            isOptimal: false,
          },
        ],
      },
    ],
  },
  {
    id: 'ransomware-lockdown',
    title: 'Ransomware Lockdown',
    codename: 'Lateral Movement Isolation',
    difficulty: 'Advanced',
    summary: 'Endpoint EDR detected rapid SMB port probing from a compromised finance workstation.',
    reportFinding: 'East-west SMB enumeration halted before reaching backup storage tier.',
    reportRecommendation: 'Enforce micro-segmentation on port 445 and maintain immutable offline backups.',
    steps: [
      {
        prompt: 'Step 1: Host WKSTN-09 is scanning internal subnet 10.10.2.0/24 on TCP/445.',
        clue: 'Clue: Immutable backups reside on an isolated VLAN.',
        choices: [
          {
            label: 'Network-isolate WKSTN-09 via EDR and snapshot volatile memory for DFIR',
            outcome: 'Host quarantined. Lateral SMB sweep blocked before touching file servers.',
            isOptimal: true,
            nextStep: 1,
          },
          {
            label: 'Reboot the workstation immediately to clear RAM',
            outcome: 'Warning: Rebooting destroys volatile forensic evidence in RAM.',
            isOptimal: false,
          },
        ],
      },
      {
        prompt: 'Step 2: Verify backup integrity and close the lateral vector.',
        clue: 'Clue: Workstations should never initiate direct SMB connections to each other.',
        choices: [
          {
            label: 'Enable host-based firewall peer-to-peer SMB block & verify immutable backups',
            outcome: 'Mission Cleared! Subnet micro-segmented and clean recovery verified.',
            isOptimal: true,
          },
          {
            label: 'Reconnect WKSTN-09 immediately without re-imaging',
            outcome: 'Persistence mechanisms could remain active if not cleanly re-imaged.',
            isOptimal: false,
          },
        ],
      },
    ],
  },
];

export const MissionControlModule: React.FC = () => {
  const completedMissions = useGhostStore((s) => s.completedMissions);
  const completeMission = useGhostStore((s) => s.completeMission);

  const [selectedMissionId, setSelectedMissionId] = useState(MISSIONS[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [finished, setFinished] = useState(false);

  const mission = MISSIONS.find((m) => m.id === selectedMissionId) || MISSIONS[0];
  const currentStep = mission.steps[stepIndex];

  const selectMission = (id: string) => {
    setSelectedMissionId(id);
    setStepIndex(0);
    setFeedback(null);
    setFinished(false);
  };

  const handleChoose = (choice: MissionChoice) => {
    setFeedback({ text: choice.outcome, ok: choice.isOptimal });
    if (choice.isOptimal) {
      if (typeof choice.nextStep === 'number') {
        setTimeout(() => {
          setStepIndex(choice.nextStep!);
          setFeedback(null);
        }, 900);
      } else {
        setFinished(true);
        completeMission(mission.id, {
          title: `Incident Report: ${mission.title}`,
          scope: mission.codename,
          severity: mission.difficulty === 'Advanced' ? 'High' : 'Medium',
          findings: [mission.reportFinding],
          recommendation: mission.reportRecommendation,
          sourceModule: 'missions',
        });
      }
    }
  };

  return (
    <ModuleFrame
      moduleId="missions"
      onResetLocal={() => {
        setStepIndex(0);
        setFeedback(null);
        setFinished(false);
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Mission Selector */}
        <div className="space-y-3">
          {MISSIONS.map((m) => {
            const done = completedMissions.includes(m.id);
            const active = m.id === selectedMissionId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMission(m.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'border-[#00E5FF] bg-[#0F1B2E]'
                    : 'border-slate-800 bg-[#0D1322] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-ghost-mono mb-1">
                  <span className="text-[#00E5FF]">{m.difficulty}</span>
                  {done && <span className="text-[#00FF41]">CLEARED</span>}
                </div>
                <div className="text-sm font-bold text-white">{m.title}</div>
                <div className="text-xs text-slate-400 mt-1">{m.codename}</div>
              </button>
            );
          })}
        </div>

        {/* Active Investigation */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-ghost-mono text-[#00E5FF]">{mission.codename}</div>
              <h3 className="text-lg font-bold text-white mt-0.5">{mission.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => selectMission(mission.id)}
              className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Restart Mission"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{mission.summary}</p>

          {!finished ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 space-y-2">
                <div className="text-sm font-semibold text-white">{currentStep.prompt}</div>
                <div className="text-xs font-ghost-mono text-[#00FF41]">{currentStep.clue}</div>
              </div>

              <div className="space-y-2.5">
                {currentStep.choices.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChoose(c)}
                    className="w-full text-left p-3.5 min-h-[44px] rounded-xl border border-slate-700 bg-slate-900/90 hover:border-[#00E5FF] text-xs sm:text-sm text-slate-100 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <span>{c.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-[#00FF41]/10 border border-[#00FF41]/35 space-y-2">
              <div className="flex items-center gap-2 text-[#00FF41] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Mission Complete — +150 XP &amp; Assessment Report Saved</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Report added to your Portfolio Studio: <strong>{mission.reportRecommendation}</strong>
              </p>
            </div>
          )}

          {feedback && (
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-center gap-2.5 ${
                feedback.ok
                  ? 'border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41]'
                  : 'border-[#FF003C]/40 bg-[#FF003C]/10 text-[#FF003C]'
              }`}
            >
              {feedback.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      </div>
    </ModuleFrame>
  );
};
