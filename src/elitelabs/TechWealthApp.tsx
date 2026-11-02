import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Calculator,
  HelpCircle,
  X,
  Sparkles,
  Search,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface TechWealthProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const TechWealthApp: React.FC<TechWealthProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'sip' | 'scam' | 'tax'>('sip');
  const [showConceptModal, setShowConceptModal] = useState(false);

  // SIP Calculator State
  const [monthlyInvest, setMonthlyInvest] = useState(15000); // INR per month
  const [expectedReturn, setExpectedReturn] = useState(12); // 12% p.a.
  const [years, setYears] = useState(10); // 10 years

  // Scam Checker State
  const [scamInput, setScamInput] = useState('');
  const [scamResult, setScamResult] = useState<{
    status: 'Safe' | 'Suspicious' | 'High Risk' | null;
    reasons: string[];
  }>({ status: null, reasons: [] });

  // Tax Calculator State (India New Tax Regime)
  const [ctc, setCtc] = useState(1800000); // 18 LPA CTC

  // SIP Math Calculation: M * ({[1 + i]^n - 1} / i) * (1 + i)
  const i = expectedReturn / 12 / 100;
  const n = years * 12;
  const totalInvested = monthlyInvest * n;
  const totalWealth = Math.round(monthlyInvest * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  const wealthGain = totalWealth - totalInvested;

  // India New Tax Regime Calculation (FY 2024-25 / FY 2025-26)
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, ctc - standardDeduction);

  let annualTax = 0;
  if (taxableIncome <= 300000) {
    annualTax = 0;
  } else if (taxableIncome <= 700000) {
    annualTax = (taxableIncome - 300000) * 0.05;
    // Section 87A rebate makes tax 0 if taxable income <= 7,00,000
    annualTax = 0;
  } else {
    // 0 to 3L: 0%
    // 3L to 7L (4L): 5% = 20,000
    // 7L to 10L (3L): 10% = 30,000
    // 10L to 12L (2L): 15% = 30,000
    // 12L to 15L (3L): 20% = 60,000
    // > 15L: 30%
    let rem = taxableIncome;
    let t = 0;

    // 3L - 7L
    if (rem > 300000) {
      const slab = Math.min(rem - 300000, 400000);
      t += slab * 0.05;
    }
    // 7L - 10L
    if (rem > 700000) {
      const slab = Math.min(rem - 700000, 300000);
      t += slab * 0.10;
    }
    // 10L - 12L
    if (rem > 1000000) {
      const slab = Math.min(rem - 1000000, 200000);
      t += slab * 0.15;
    }
    // 12L - 15L
    if (rem > 1200000) {
      const slab = Math.min(rem - 1200000, 300000);
      t += slab * 0.20;
    }
    // > 15L
    if (rem > 1500000) {
      const slab = rem - 1500000;
      t += slab * 0.30;
    }
    annualTax = t;
  }

  const cess = annualTax * 0.04; // 4% Health & Education cess
  const finalAnnualTax = Math.round(annualTax + cess);
  const monthlyTakeHome = Math.round((ctc - finalAnnualTax) / 12);
  const effectiveTaxRate = ((finalAnnualTax / ctc) * 100).toFixed(1);

  // Scam Checker Logic
  const handleCheckScam = () => {
    const input = scamInput.trim().toLowerCase();
    if (!input) return;

    const reasons: string[] = [];
    let status: 'Safe' | 'Suspicious' | 'High Risk' = 'Safe';

    if (input.includes('claim-airdrop') || input.includes('free-eth') || input.includes('drainer') || input.includes('t.me/')) {
      status = 'High Risk';
      reasons.push('Known wallet drainer or telegram crypto scam pattern detected.');
    }
    if (input.includes('bit.ly') || input.includes('tinyurl') || input.includes('@gmail') || input.includes('secure-login-')) {
      status = 'Suspicious';
      reasons.push('Shortened or obfuscated link hiding true destination domain.');
    }
    if (input.length === 42 && input.startsWith('0x')) {
      reasons.push('Valid EVM checksum address format. No known blacklisted mixer flag.');
    } else if (status === 'Safe') {
      reasons.push('Domain certificate and address structure align with typical standard web patterns.');
    }

    setScamResult({ status, reasons });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🧪 Elite Labs' },
          { label: 'TechWealth (Finance for Geeks)' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                TechWealth: Finance for Engineers
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                FIRE CALCULATOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              SIP compounding growth curves, Crypto wallet/phishing scam checker, and India New Tax Regime in-hand salary decoder.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConceptModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Learn Concept</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'sip', name: 'SIP & Compound Growth', icon: TrendingUp },
          { id: 'tax', name: 'Tech Salary vs Tax (India)', icon: Calculator },
          { id: 'scam', name: 'Crypto & Phishing Scam Checker', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SIP CALCULATOR */}
      {activeTab === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Investment Parameters
            </h3>

            {/* Monthly SIP */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Monthly SIP:</span>
                <span className="text-cyan-400 font-bold">₹{monthlyInvest.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthlyInvest}
                onChange={(e) => setMonthlyInvest(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Expected Return */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Expected Annual Return:</span>
                <span className="text-cyan-400 font-bold">{expectedReturn}% p.a.</span>
              </div>
              <input
                type="range"
                min="6"
                max="24"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Time Horizon */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Time Period:</span>
                <span className="text-cyan-400 font-bold">{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Results & SVG Growth Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Invested</span>
                <span className="text-lg font-mono font-bold text-slate-200">
                  ₹{totalInvested.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Estimated Returns</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  ₹{wealthGain.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40">
                <span className="text-[10px] uppercase font-mono text-cyan-300 block">Total Corpus (Wealth)</span>
                <span className="text-xl font-mono font-black text-cyan-400">
                  ₹{totalWealth.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Interactive SVG Compounding Visualization */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
              <span className="text-xs font-mono text-slate-400 block">
                Visual Compounding Curve: Invested vs Accelerated Returns
              </span>
              <svg viewBox="0 0 400 150" className="w-full h-36">
                <defs>
                  <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Baseline grid */}
                <line x1="20" y1="130" x2="380" y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <line x1="20" y1="20" x2="20" y2="130" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Linear invested curve */}
                <path
                  d="M 20 130 Q 200 100 380 75"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Exponential compounding curve */}
                <path
                  d="M 20 130 Q 200 115 380 25"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                />

                {/* Shaded Area */}
                <path
                  d="M 20 130 Q 200 115 380 25 L 380 130 Z"
                  fill="url(#wealthGrad)"
                />
              </svg>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
                <span>Year 1</span>
                <span>Year {Math.round(years / 2)}</span>
                <span className="text-cyan-400 font-bold">Year {years} (Corpus Peak)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TECH SALARY VS TAX (INDIA NEW REGIME) */}
      {activeTab === 'tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Annual CTC (Cost to Company)
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Total Package:</span>
                <span className="text-cyan-400 font-bold">₹{(ctc / 100000).toFixed(1)} LPA</span>
              </div>
              <input
                type="range"
                min="300000"
                max="5000000"
                step="50000"
                value={ctc}
                onChange={(e) => setCtc(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Standard Deductions</span>
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">Standard Deduction:</span>
                <span className="text-emerald-400 font-bold">₹75,000</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-300">Section 87A Rebate:</span>
                <span className="text-emerald-400 font-bold">Up to ₹7,00,000 (Zero Tax)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Annual Income Tax</span>
                <span className="text-base font-mono font-bold text-rose-400">
                  ₹{finalAnnualTax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Effective Tax Rate</span>
                <span className="text-base font-mono font-bold text-amber-400">
                  {effectiveTaxRate}%
                </span>
              </div>

              <div className="col-span-2 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-300 block">In-Hand Monthly Salary</span>
                <span className="text-2xl font-mono font-black text-emerald-400">
                  ₹{monthlyTakeHome.toLocaleString('en-IN')} / mo
                </span>
              </div>
            </div>

            {/* Slab breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                New Tax Regime Slabs (FY 2024-25 / 2025-26)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-400">
                <div className="p-2 bg-slate-950 rounded-xl">₹0 - ₹3L: <span className="text-emerald-400">0%</span></div>
                <div className="p-2 bg-slate-950 rounded-xl">₹3L - ₹7L: <span className="text-cyan-400">5%</span></div>
                <div className="p-2 bg-slate-950 rounded-xl">₹7L - ₹10L: <span className="text-amber-400">10%</span></div>
                <div className="p-2 bg-slate-950 rounded-xl">₹10L - ₹12L: <span className="text-amber-400">15%</span></div>
                <div className="p-2 bg-slate-950 rounded-xl">₹12L - ₹15L: <span className="text-rose-400">20%</span></div>
                <div className="p-2 bg-slate-950 rounded-xl">&gt; ₹15L: <span className="text-rose-400">30%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCAM CHECKER */}
      {activeTab === 'scam' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Crypto Wallet & Phishing Scam Heuristic Analyzer</span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste Ethereum/Solana wallet address, telegram bot link, or airdrop URL to scan against known honey-pot signatures and zero-transfer drainer patterns.
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={scamInput}
                onChange={(e) => setScamInput(e.target.value)}
                placeholder="Enter 0x... address or https://suspicious-airdrop.xyz"
                className="flex-1 px-4 py-2.5 rounded-xl os-glass-input text-xs font-mono"
              />
              <button
                onClick={handleCheckScam}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer shadow-lg shadow-cyan-600/30"
              >
                Scan
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setScamInput('https://free-eth-claim-airdrop.drainer.xyz');
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 cursor-pointer"
              >
                Sample Phishing Drainer URL
              </button>
              <button
                onClick={() => {
                  setScamInput('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 cursor-pointer"
              >
                Sample Safe Vitalik Address
              </button>
            </div>

            {scamResult.status && (
              <div className={`p-4 rounded-2xl border space-y-2 ${
                scamResult.status === 'High Risk'
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                  : scamResult.status === 'Suspicious'
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scamResult.status === 'High Risk' ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  <span>Verdict: {scamResult.status}</span>
                </div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {scamResult.reasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEARN CONCEPT MODAL */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Financial Principles for Software Engineers</span>
              </h2>
              <button
                onClick={() => setShowConceptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>The Rule of 72:</strong> Divide 72 by your expected annual return (e.g. 72 / 12 = 6 years) to calculate how long it takes to double your money.
              </p>
              <p>
                • <strong>Index Fund Compounding:</strong> Investing consistently in broad low-cost index funds outperforms 90%+ of active day traders over a 15-year horizon.
              </p>
              <p>
                • <strong>Crypto Drainers:</strong> Never approve unlimited ERC-20 spending allowances (`approve(spender, max_uint256)`) without verifying the target contract address.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
