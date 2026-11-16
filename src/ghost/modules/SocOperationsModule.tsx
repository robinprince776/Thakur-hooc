import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

interface SocAlert {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  sourceIp: string;
  user: string;
  rawEvent: string;
  groundTruth: 'tp' | 'fp';
  rationale: string;
}

const SOC_ALERTS: SocAlert[] = [
  {
    id: 'alrt-brute',
    title: 'Brute Force SSH Login Burst',
    severity: 'High',
    sourceIp: '198.51.100.44',
    user: 'root / admin',
    rawEvent:
      '{ "event": "ssh_auth_fail", "count_60s": 148, "target": "gateway-01", "geo": "External Untrusted", "success_after": false }',
    groundTruth: 'tp',
    rationale:
      'True Positive: 148 automated login attempts against privileged accounts from an untrusted external IP in 60 seconds.',
  },
  {
    id: 'alrt-backup',
    title: 'Nightly Archive Transfer Spike',
    severity: 'Medium',
    sourceIp: '10.24.0.12',
    user: 'svc_backup_cron',
    rawEvent:
      '{ "event": "outbound_s3_sync", "mb_transferred": 820, "schedule": "02:00 UTC daily", "signed_service": true }',
    groundTruth: 'fp',
    rationale:
      'False Positive: Expected scheduled backup job running at 02:00 UTC from a verified internal service account.',
  },
  {
    id: 'alrt-travel',
    title: 'Impossible Travel Session Token',
    severity: 'High',
    sourceIp: '192.0.2.89',
    user: 'priya.finance',
    rawEvent:
      '{ "login_1": "Mumbai 06:10 UTC", "login_2": "Berlin 06:22 UTC", "vpn_matched": false, "mfa_prompt": "denied" }',
    groundTruth: 'tp',
    rationale:
      'True Positive: Login attempts separated by 6,400 km within 12 minutes with no corporate VPN match and MFA denied.',
  },
  {
    id: 'alrt-dns',
    title: 'High-Entropy Subdomain DNS Beacons',
    severity: 'High',
    sourceIp: '10.24.4.55',
    user: 'wkstn-dev-04',
    rawEvent:
      '{ "query": "a9f8c7d2e1b0492.exfil-sim.example", "freq_sec": 5, "txt_record_bytes": 240 }',
    groundTruth: 'tp',
    rationale:
      'True Positive: Automated 5-second periodic high-entropy DNS queries match simulated DNS tunneling C2 behavior.',
  },
];

export const SocOperationsModule: React.FC = () => {
  const triageDecisions = useGhostStore((s) => s.triageDecisions);
  const recordTriage = useGhostStore((s) => s.recordTriage);

  const [selectedId, setSelectedId] = useState(SOC_ALERTS[0].id);
  const activeAlert = SOC_ALERTS.find((a) => a.id === selectedId) || SOC_ALERTS[0];
  const decision = triageDecisions[activeAlert.id];

  const totalTriaged = Object.keys(triageDecisions).length;
  const correctCount = Object.values(triageDecisions).filter((d) => d.correct).length;

  const submitVerdict = (verdict: 'tp' | 'fp') => {
    recordTriage(activeAlert.id, verdict, verdict === activeAlert.groundTruth);
  };

  return (
    <ModuleFrame moduleId="soc">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Alert Queue */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-white">SIEM Triage Queue</span>
            <span className="font-ghost-mono text-[#00FF41]">
              {correctCount}/{totalTriaged} Accurate
            </span>
          </div>

          {SOC_ALERTS.map((a) => {
            const dec = triageDecisions[a.id];
            const isSelected = a.id === selectedId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#00E5FF] bg-[#0F1B2E]'
                    : 'border-slate-800 bg-[#0D1322] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-ghost-mono mb-1">
                  <span className={a.severity === 'High' ? 'text-[#FF003C]' : 'text-amber-300'}>
                    {a.severity} Severity
                  </span>
                  {dec && (
                    <span className={dec.correct ? 'text-[#00FF41]' : 'text-[#FF003C]'}>
                      {dec.correct ? 'VERIFIED' : 'REVIEW'}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">{a.title}</div>
                <div className="text-[11px] font-ghost-mono text-slate-400 mt-1">
                  {a.sourceIp} · {a.user}
                </div>
              </button>
            );
          })}
        </div>

        {/* Alert Inspection & Verdict */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-ghost-mono text-[#FF003C]">Alert ID: {activeAlert.id}</div>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeAlert.title}</h3>
            </div>
            <ShieldAlert className="w-5 h-5 text-[#FF003C] shrink-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-ghost-mono">
            <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
              <div className="text-slate-400">Source IP</div>
              <div className="text-[#00E5FF] mt-0.5">{activeAlert.sourceIp}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
              <div className="text-slate-400">Identity Context</div>
              <div className="text-white mt-0.5">{activeAlert.user}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-ghost-mono text-slate-400 mb-1.5">Raw Telemetry Payload</div>
            <pre className="p-3.5 rounded-lg bg-[#060910] border border-slate-800 font-ghost-mono text-xs text-[#00FF41] whitespace-pre-wrap">
              {activeAlert.rawEvent}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => submitVerdict('tp')}
              className="flex-1 py-3 px-4 min-h-[44px] rounded-xl border border-[#FF003C]/50 bg-[#FF003C]/15 hover:bg-[#FF003C]/25 text-[#FF003C] font-bold text-xs cursor-pointer transition-colors"
            >
              Classify: True Positive (Escalate)
            </button>
            <button
              type="button"
              onClick={() => submitVerdict('fp')}
              className="flex-1 py-3 px-4 min-h-[44px] rounded-xl border border-[#00FF41]/50 bg-[#00FF41]/15 hover:bg-[#00FF41]/25 text-[#00FF41] font-bold text-xs cursor-pointer transition-colors"
            >
              Classify: False Positive (Benign)
            </button>
          </div>

          {decision && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                decision.correct
                  ? 'border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41]'
                  : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
              }`}
            >
              {decision.correct ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold mb-0.5">
                  {decision.correct ? 'Correct Triage (+45 XP)' : 'Misclassified — Review Telemetry'}
                </div>
                <div className="text-slate-200">{activeAlert.rationale}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModuleFrame>
  );
};
