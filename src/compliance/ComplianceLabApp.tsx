import React, { useState, useMemo } from 'react';
import {
  Shield,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Building,
  Lock,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

export interface ComplianceLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  standard: 'IT_ACT' | 'GDPR' | 'SOC2' | 'ISO27001' | 'HIPAA';
  description: string;
  penaltyOrRisk: string;
  completed: boolean;
}

export const ComplianceLabApp: React.FC<ComplianceLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeStandard, setActiveStandard] = useState<'ALL' | 'IT_ACT' | 'GDPR' | 'SOC2' | 'ISO27001' | 'HIPAA'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'itact-1',
      category: 'Data Protection & Hacking',
      title: 'Section 43 & 66: Unauthorized Access Prevention',
      standard: 'IT_ACT',
      description: 'Implement multi-factor authentication and role-based access to prevent unauthorized data download or tampering.',
      penaltyOrRisk: 'Up to 3 years imprisonment and ₹5 Lakh fine under Indian IT Act.',
      completed: true
    },
    {
      id: 'itact-2',
      category: 'Identity & Fraud',
      title: 'Section 66C & 66D: Identity Theft & Cheating by Personation',
      standard: 'IT_ACT',
      description: 'Password hashing with Argon2/bcrypt, secure session tokens, and strict phishing protections.',
      penaltyOrRisk: 'Mandatory criminal liability up to 3 years imprisonment.',
      completed: true
    },
    {
      id: 'itact-3',
      category: 'Incident Reporting',
      title: 'CERT-In 6-Hour Mandatory Cybersecurity Incident Reporting',
      standard: 'IT_ACT',
      description: 'Organizations must report ransomware, data leaks, and server compromise to CERT-In within 6 hours of discovery.',
      penaltyOrRisk: 'Section 70B(7) criminal penalty up to 1 year imprisonment.',
      completed: false
    },
    {
      id: 'gdpr-1',
      category: 'User Rights',
      title: 'Article 17: Right to Erasure ("Right to be Forgotten")',
      standard: 'GDPR',
      description: 'Automated workflow allowing EU citizens to completely delete their account and associated database records.',
      penaltyOrRisk: 'Fines up to €20 Million or 4% of worldwide annual turnover.',
      completed: false
    },
    {
      id: 'gdpr-2',
      category: 'Consent & Cookies',
      title: 'Article 6 & 7: Explicit Cookie & Tracking Consent',
      standard: 'GDPR',
      description: 'No tracking cookies can be placed before explicit opt-in banner approval.',
      penaltyOrRisk: 'High regulatory scrutiny and severe fines from EU Data Protection Authorities.',
      completed: true
    },
    {
      id: 'soc2-1',
      category: 'Security & Access',
      title: 'CC6.1 - CC6.3: Logical Access Controls & Least Privilege',
      standard: 'SOC2',
      description: 'Strict IAM policies, quarterly access reviews, and termination checklist revoking all employee API keys.',
      penaltyOrRisk: 'Loss of enterprise customer trust and failure of SOC 2 Type II audit.',
      completed: false
    },
    {
      id: 'soc2-2',
      category: 'Continuous Monitoring',
      title: 'CC7.2: Vulnerability Management & Patch Automation',
      standard: 'SOC2',
      description: 'Automated dependency scanning (Dependabot/Snyk) and high-severity CVE patching within 14 days.',
      penaltyOrRisk: 'Qualified audit opinion from independent auditor.',
      completed: true
    },
    {
      id: 'iso-1',
      category: 'Information Security',
      title: 'A.8.24: Cryptographic Controls & Key Lifecycle',
      standard: 'ISO27001',
      description: 'Encryption in transit (TLS 1.3) and at rest (AES-256) with AWS KMS / HashiCorp Vault key rotation.',
      penaltyOrRisk: 'Non-conformity finding on ISO/IEC 27001:2022 surveillance audit.',
      completed: true
    },
    {
      id: 'hipaa-1',
      category: 'Healthcare Privacy',
      title: 'ePHI Data Encryption & Business Associate Agreement (BAA)',
      standard: 'HIPAA',
      description: 'Protected health information must never be logged in plain text or transmitted across unencrypted channels.',
      penaltyOrRisk: 'OCR penalties up to $50,000 per violation up to $1.9 Million per year.',
      completed: false
    }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const filteredItems = useMemo(() => {
    return checklist.filter((item) => {
      const matchStandard = activeStandard === 'ALL' || item.standard === activeStandard;
      const matchSearch =
        item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.category.toLowerCase().includes(searchFilter.toLowerCase());
      return matchStandard && matchSearch;
    });
  }, [checklist, activeStandard, searchFilter]);

  const stats = useMemo(() => {
    const total = checklist.length;
    const done = checklist.filter((c) => c.completed).length;
    const pct = Math.round((done / total) * 100);
    return { total, done, pct };
  }, [checklist]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">ComplianceLab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  #compliance · App #37
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Indian IT Act 2000, GDPR, SOC 2 Type II, ISO 27001:2022 & HIPAA Audit Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 mt-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Frameworks' },
              { id: 'IT_ACT', label: 'Indian IT Act 2000' },
              { id: 'GDPR', label: 'EU GDPR' },
              { id: 'SOC2', label: 'SOC 2 Type II' },
              { id: 'ISO27001', label: 'ISO 27001' },
              { id: 'HIPAA', label: 'HIPAA' }
            ].map((std) => (
              <button
                key={std.id}
                onClick={() => setActiveStandard(std.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeStandard === std.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {std.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search laws, controls..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Readiness Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div>
            <span className="text-xs text-slate-400 block mb-1">Overall Audit Readiness</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-emerald-400">{stats.pct}%</span>
              <span className="text-xs text-slate-400">({stats.done} of {stats.total} Controls Verified)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <span className="text-xs text-slate-400 block mb-1">National Helpline (India)</span>
            <div className="text-lg font-bold text-cyan-400 font-mono">1930 / cybercrime.gov.in</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Immediate freeze of defrauded banking funds within golden hour (first 2-4 hours).
            </p>
          </div>

          <div className="border-l border-slate-800 pl-4">
            <span className="text-xs text-slate-400 block mb-1">Audit Mandate</span>
            <div className="text-sm font-bold text-amber-400">CERT-In 6-Hour Incident Rule</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Failure to notify CERT-In results in direct penal prosecution under Section 70B.
            </p>
          </div>
        </div>

        {/* Checklist Cards */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-900/40 border-amber-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCheck(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-600 bg-slate-800/80 text-transparent hover:border-emerald-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.standard}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{item.category}</span>
                    </div>

                    <h4 className={`text-sm font-bold ${item.completed ? 'text-slate-300' : 'text-white'}`}>
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                    <div className="text-[11px] text-amber-400/90 flex items-center gap-1.5 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span><strong>Consequence:</strong> {item.penaltyOrRisk}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 font-bold ${
                    item.completed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.completed ? 'Compliant' : 'Action Required'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
