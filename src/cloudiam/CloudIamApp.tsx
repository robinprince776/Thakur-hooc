import React, { useState, useMemo } from 'react';
import {
  Cloud,
  Shield,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Lock,
  Server
} from 'lucide-react';

export interface CloudIamAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const CloudIamApp: React.FC<CloudIamAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'policy-builder' | 's3-audit' | 'confused-deputy'>('policy-builder');

  // Policy Builder State
  const [service, setService] = useState<'s3' | 'ec2' | 'dynamodb'>('s3');
  const [permissionLevel, setPermissionLevel] = useState<'read' | 'write' | 'admin'>('read');
  const [resourceArn, setResourceArn] = useState('arn:aws:s3:::company-confidential-bucket/*');
  const [copied, setCopied] = useState(false);

  const generatedPolicy = useMemo(() => {
    let actions: string[] = [];
    if (service === 's3') {
      if (permissionLevel === 'read') actions = ['s3:GetObject', 's3:ListBucket'];
      if (permissionLevel === 'write') actions = ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'];
      if (permissionLevel === 'admin') actions = ['s3:*'];
    } else if (service === 'ec2') {
      if (permissionLevel === 'read') actions = ['ec2:DescribeInstances', 'ec2:DescribeSecurityGroups'];
      if (permissionLevel === 'write') actions = ['ec2:StartInstances', 'ec2:StopInstances'];
      if (permissionLevel === 'admin') actions = ['ec2:*'];
    } else {
      if (permissionLevel === 'read') actions = ['dynamodb:GetItem', 'dynamodb:Query'];
      if (permissionLevel === 'write') actions = ['dynamodb:PutItem', 'dynamodb:UpdateItem'];
      if (permissionLevel === 'admin') actions = ['dynamodb:*'];
    }

    const doc = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'EnforceLeastPrivilegeStatement',
          Effect: 'Allow',
          Action: actions,
          Resource: permissionLevel === 'admin' ? '*' : resourceArn
        }
      ]
    };

    return JSON.stringify(doc, null, 2);
  }, [service, permissionLevel, resourceArn]);

  const hasWildcardWarning = permissionLevel === 'admin';

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
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Cloud IAM Architect
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Least-Privilege Engine
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    AWS/Azure IAM policy generator, S3 bucket misconfig auditor &amp; role security
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
              { id: 'policy-builder', label: '1. 🛡️ IAM Policy Builder', icon: Shield },
              { id: 's3-audit', label: '2. 🪣 S3 Bucket Auditor', icon: Cloud },
              { id: 'confused-deputy', label: '3. 🎭 Confused Deputy Defense', icon: Lock }
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
        {/* TAB 1: POLICY BUILDER */}
        {activeTab === 'policy-builder' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">AWS IAM Least-Privilege Policy Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Controls */}
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Cloud Service:</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                  >
                    <option value="s3">Amazon S3 (Simple Storage Service)</option>
                    <option value="ec2">Amazon EC2 (Compute Instances)</option>
                    <option value="dynamodb">Amazon DynamoDB (NoSQL Database)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Access Scope:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'read', label: 'Read-Only' },
                      { id: 'write', label: 'Read/Write' },
                      { id: 'admin', label: 'Admin (*)' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setPermissionLevel(lvl.id as any)}
                        className={`p-2 rounded-xl border font-bold cursor-pointer ${
                          permissionLevel === lvl.id
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Resource ARN:</label>
                  <input
                    type="text"
                    value={resourceArn}
                    onChange={(e) => setResourceArn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs"
                  />
                </div>

                {hasWildcardWarning && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 flex items-start gap-2 text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>⚠️ <strong>Violation of Least Privilege:</strong> Granting `Action: *` or `Resource: *` violates CIS AWS Foundations Benchmark 1.16!</span>
                  </div>
                )}
              </div>

              {/* JSON Policy Output */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2 mb-2">
                    <span>Generated IAM Policy (JSON)</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPolicy);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
                    {generatedPolicy}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: S3 BUCKET AUDIT */}
        {activeTab === 's3-audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">S3 Bucket Hardening Checklist</h2>
            <div className="space-y-3 font-mono">
              {[
                { title: 'Block Public Access (BPA)', status: 'Enabled', desc: 'IgnorePublicAcls, BlockPublicAcls, BlockPublicPolicy, RestrictPublicBuckets.' },
                { title: 'Default Encryption (SSE-KMS)', status: 'Enforced', desc: 'Force AES-256 or customer-managed KMS key. Plaintext uploads rejected.' },
                { title: 'Bucket Versioning & MFA Delete', status: 'Enabled', desc: 'Protects against catastrophic ransomware file destruction.' },
                { title: 'Enforce HTTPS (TLS 1.2+)', status: 'Policy Attached', desc: 'Deny all s3:* requests where `aws:SecureTransport` is false.' }
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">{s.title}</span>
                    <p className="text-slate-400 text-[11px] font-sans mt-0.5">{s.desc}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONFUSED DEPUTY */}
        {activeTab === 'confused-deputy' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">The Confused Deputy Problem &amp; ExternalId</h2>
            <p className="text-slate-300 leading-relaxed">
              When a SaaS third-party vendor requests an IAM Role in your AWS account via `sts:AssumeRole`, an attacker could supply your AWS Account ID to the vendor, tricking the vendor into modifying your resources.
              <strong>Solution:</strong> Always demand a cryptographically random, secret `ExternalId` condition inside the trust policy!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
