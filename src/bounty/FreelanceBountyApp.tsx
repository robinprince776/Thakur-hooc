import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Briefcase,
  FileCheck2,
  Receipt,
  ArrowLeft,
  LayoutGrid,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Calculator,
  Printer,
  CheckSquare,
  Square,
  Globe,
  Sparkles,
} from 'lucide-react';
import {
  ATS_CHECKLIST,
  BOUNTY_ROADMAP,
  FREELANCE_CHECKLIST,
  PAYMENT_RAILS,
  RATE_BENCHMARKS,
  REPORT_TEMPLATES,
} from './bountyData';

interface FreelanceBountyAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher: () => void;
}

type EmpireTab = 'bounty' | 'freelance' | 'resume' | 'invoicing';

interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const FreelanceBountyApp: React.FC<FreelanceBountyAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const [activeTab, setActiveTab] = useState<EmpireTab>('bounty');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // TAB 1: Bug Bounty Report Generator State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(REPORT_TEMPLATES[0].id);
  const [reportTarget, setReportTarget] = useState<string>('staging-app.example.com');
  const [reportEndpoint, setReportEndpoint] = useState<string>('/api/v1/projects/{id}');
  const [reportSeverity, setReportSeverity] = useState<'Medium' | 'High' | 'Critical'>('High');
  const [reportNotes, setReportNotes] = useState<string>(
    'Verified using two personal test accounts under the published Safe Harbor policy.'
  );

  // TAB 2: Freelancing Playbook State
  const [checkedFreelance, setCheckedFreelance] = useState<Record<string, boolean>>({});
  const [propClientName, setPropClientName] = useState<string>('Alex');
  const [propProjectType, setPropProjectType] = useState<string>('React + Node.js SaaS Dashboard');
  const [propPainPoint, setPropPainPoint] = useState<string>(
    'slow table rendering and missing Stripe subscription sync'
  );
  const [propTimeline, setPropTimeline] = useState<string>('2 weeks');
  const [propRate, setPropRate] = useState<string>('$2,200 fixed milestone');

  // India vs US Pricing Calculator State
  const [calcHours, setCalcHours] = useState<number>(40);
  const [calcMarket, setCalcMarket] = useState<'india' | 'us'>('us');
  const [calcLevel, setCalcLevel] = useState<'junior' | 'mid' | 'senior'>('mid');
  const [usdToInr, setUsdToInr] = useState<number>(85);

  // TAB 3: Resume & LinkedIn Showcase Generator State
  const [checkedAts, setCheckedAts] = useState<Record<string, boolean>>({});
  const [projName, setProjName] = useState<string>('TechMaster Arena & Workflow Studio');
  const [projRepo, setProjRepo] = useState<string>('https://github.com/username/techmaster-os');
  const [projStack, setProjStack] = useState<string>('React, TypeScript, Zustand, Tailwind CSS, Express');
  const [projProblem, setProjProblem] = useState<string>(
    'Engineers needed a zero-lag browser sandbox to practice debugging and design automated workflows.'
  );
  const [projMetric, setProjMetric] = useState<string>(
    'Virtualized 75+ challenges with react-window and cut filter render times below 16ms'
  );

  // TAB 4: Invoice Generator State
  const [invoiceNo, setInvoiceNo] = useState<string>('INV-2025-001');
  const [invoiceDate, setInvoiceDate] = useState<string>(
    () => new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
  const [fromName, setFromName] = useState<string>('Your Name · Full-Stack Engineering');
  const [fromEmail, setFromEmail] = useState<string>('hello@yourportfolio.dev');
  const [fromAddress, setFromAddress] = useState<string>('Bengaluru, India · Export of Services (LUT)');
  const [toName, setToName] = useState<string>('Acme Cloud Labs Inc.');
  const [toEmail, setToEmail] = useState<string>('accounts@acmecloud.io');
  const [toAddress, setToAddress] = useState<string>('San Francisco, CA, USA');
  const [paymentDetails, setPaymentDetails] = useState<string>(
    'Wise / Skydo USD ACH · Account: XXXX-8921 · Routing: 026073150 · Purpose Code: P0802'
  );
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: 'li-1', description: 'Milestone 1: Architecture, Auth & Core UI Implementation', qty: 1, rate: 1200 },
    { id: 'li-2', description: 'Milestone 2: API Integration, Performance Optimization & QA', qty: 1, rate: 950 },
  ]);

  const activeTemplate =
    REPORT_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? REPORT_TEMPLATES[0];

  const handleCopy = (key: string, text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      // Ignore restricted clipboard environments
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 1800);
  };

  // Generated Markdown Bug Report (clean responsible disclosure format)
  const generatedBugReport = useMemo(() => {
    const steps = activeTemplate.reproTemplate
      .map((s, idx) => `${idx + 1}. ${s}`)
      .join('\n');

    return `# Security Disclosure Report: ${activeTemplate.label}

- **Program Target:** \`${reportTarget}\`
- **Affected Endpoint / Component:** \`${reportEndpoint}\`
- **Suggested Severity:** ${reportSeverity}
- **Classification:** ${activeTemplate.owaspRef}
- **Authorization:** Tested strictly within published program scope & Safe Harbor guidelines.

## 1. Executive Summary & Impact
${activeTemplate.impactSummary}

## 2. Steps to Reproduce (Test Accounts Only)
${steps}

## 3. Environment & Verification Notes
${reportNotes}

## 4. Recommended Remediation
${activeTemplate.remediationGuide}

---
*Submitted responsibly for coordinated triage and remediation. Happy to assist with verification retesting once patched.*`;
  }, [activeTemplate, reportTarget, reportEndpoint, reportSeverity, reportNotes]);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([generatedBugReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${activeTemplate.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Generated Freelance Proposal
  const generatedProposal = useMemo(() => {
    return `Hi ${propClientName},

I read through your brief for the ${propProjectType} — specifically your goal of fixing ${propPainPoint}. I have shipped similar production apps and can help you get this live cleanly within ${propTimeline}.

Proposed 3-Step Execution Plan:
1. Technical Audit & Architecture Spec (Day 1-2): Review your current repo/requirements and lock in deliverables so there are zero surprises.
2. Core Build & Staging Preview (Mid-Sprint): Deliver working staging builds every 48 hours with short Loom progress walkthroughs.
3. QA, Performance Pass & Handover (Final Days): Automated checks, clean documentation, and smooth production deployment.

Investment: ${propRate} (split into clear milestones).

Quick question before we jump on a 15-min kickoff call: do you already have a Figma file or staging repo ready, or would you like me to propose the initial UI layout too?

Best regards,
[Your Name] · Portfolio & GitHub: ${projRepo}`;
  }, [propClientName, propProjectType, propPainPoint, propTimeline, propRate, projRepo]);

  // Pricing Calculator Math
  const pricingSummary = useMemo(() => {
    const hourlyMap = {
      india: { junior: 18, mid: 32, senior: 55 },
      us: { junior: 55, mid: 95, senior: 145 },
    };
    const rate = hourlyMap[calcMarket][calcLevel];
    const subtotalUsd = rate * calcHours;
    const valueAnchoredUsd = Math.round(subtotalUsd * 1.25);
    const inrEstimate = Math.round(subtotalUsd * usdToInr);
    const depositUsd = Math.round(subtotalUsd * 0.35);
    return { rate, subtotalUsd, valueAnchoredUsd, inrEstimate, depositUsd };
  }, [calcHours, calcMarket, calcLevel, usdToInr]);

  // Generated LinkedIn Showcase & Resume Bullets
  const generatedShowcase = useMemo(() => {
    return `Just shipped ${projName} (${projStack}).

The problem I wanted to solve:
${projProblem}

Key engineering outcome:
• ${projMetric}
• Built with modular TypeScript architecture, strict type safety, and responsive mobile ergonomics
• Zero external bloat — fast client-side state & clean UX

Code & architecture breakdown: ${projRepo}

Would love feedback from fellow engineers — what performance bottleneck did you solve this week?
#SoftwareEngineering #TypeScript #BuildInPublic`;
  }, [projName, projStack, projProblem, projMetric, projRepo]);

  const generatedResumeBullets = useMemo(() => {
    return `• Engineered ${projName} using ${projStack}; ${projMetric.charAt(0).toLowerCase()}${projMetric.slice(1)}.
• Designed modular state management and reusable UI primitives to address ${projProblem.charAt(0).toLowerCase()}${projProblem.slice(1)}
• Published clean repository documentation and live deployment (${projRepo}), demonstrating end-to-end product ownership.`;
  }, [projName, projStack, projMetric, projProblem, projRepo]);

  // Invoice Totals
  const currencySymbol =
    currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';

  const invoiceSubtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0),
    [lineItems]
  );
  const invoiceTax = useMemo(
    () => (invoiceSubtotal * Math.max(0, taxPercent)) / 100,
    [invoiceSubtotal, taxPercent]
  );
  const invoiceTotal = Math.max(0, invoiceSubtotal + invoiceTax - Math.max(0, discountAmount));

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: `li-${Date.now()}`, description: 'Additional Engineering Deliverable', qty: 1, rate: 400 },
    ]);
  };

  const updateLineItem = (
    id: string,
    field: 'description' | 'qty' | 'rate',
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  // Pure client-side PDF print via hidden iframe (no window.open!)
  const handlePrintInvoicePdf = () => {
    const rowsHtml = lineItems
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;">${escapeHtml(item.description)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;">${item.qty}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;">${currencySymbol}${item.rate.toFixed(2)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${currencySymbol}${(item.qty * item.rate).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(invoiceNo)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 36px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 18px; margin-bottom: 24px; }
    .title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0; }
    .meta { text-align: right; font-size: 13px; color: #334155; }
    .grid { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 28px; font-size: 13px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
    th { text-align: left; padding: 10px 8px; background: #f1f5f9; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; }
    .totals { width: 280px; margin-left: auto; font-size: 13px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
    .grand { border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 800; }
    .footer { margin-top: 36px; padding-top: 14px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">INVOICE</h1>
      <div style="font-size:13px;color:#475569;margin-top:4px;">${escapeHtml(fromName)}</div>
    </div>
    <div class="meta">
      <div><strong>Invoice #:</strong> ${escapeHtml(invoiceNo)}</div>
      <div><strong>Issue Date:</strong> ${escapeHtml(invoiceDate)}</div>
      <div><strong>Due Date:</strong> ${escapeHtml(dueDate)}</div>
      <div><strong>Currency:</strong> ${escapeHtml(currency)}</div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="label">From</div>
      <div><strong>${escapeHtml(fromName)}</strong></div>
      <div>${escapeHtml(fromEmail)}</div>
      <div>${escapeHtml(fromAddress)}</div>
    </div>
    <div style="text-align:right;">
      <div class="label">Bill To</div>
      <div><strong>${escapeHtml(toName)}</strong></div>
      <div>${escapeHtml(toEmail)}</div>
      <div>${escapeHtml(toAddress)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right;">Qty</th>
        <th style="text-align:right;">Rate</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>${currencySymbol}${invoiceSubtotal.toFixed(2)}</span></div>
    <div class="totals-row"><span>Tax (${taxPercent}%)</span><span>${currencySymbol}${invoiceTax.toFixed(2)}</span></div>
    ${discountAmount > 0 ? `<div class="totals-row"><span>Discount</span><span>-${currencySymbol}${discountAmount.toFixed(2)}</span></div>` : ''}
    <div class="totals-row grand"><span>Total Due</span><span>${currencySymbol}${invoiceTotal.toFixed(2)}</span></div>
  </div>

  <div class="footer">
    <div class="label">Payment Instructions</div>
    <div>${escapeHtml(paymentDetails)}</div>
  </div>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      window.setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        window.setTimeout(() => {
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 1500);
      }, 250);
    }
  };

  const completedFreelanceCount = Object.values(checkedFreelance).filter(Boolean).length;
  const completedAtsCount = Object.values(checkedAts).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 relative overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(16, 185, 129, 0.14), transparent 36%), radial-gradient(circle at 88% 16%, rgba(245, 158, 11, 0.13), transparent 38%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/75 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
              <Briefcase className="w-4 h-4" />
              <span>THE FREELANCE & BOUNTY EMPIRE · 100% LEGAL MONETIZATION STUDIO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Career Monetization, Authorized Bug Bounty & Global Invoicing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Turn engineering and security skills into legal income: HackerOne/Bugcrowd playbooks, Upwork proposals, ATS resumes, and instant PDF invoices.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAppSwitcher}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition whitespace-nowrap shrink-0"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-300" />
              Apps
            </button>
            <button
              type="button"
              onClick={onBackToBca}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-xs font-semibold text-emerald-100 flex items-center gap-2 transition whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'bounty', label: 'Bug Bounty Mastery', icon: ShieldCheck },
            { id: 'freelance', label: 'Freelancing Playbook', icon: Briefcase },
            { id: 'resume', label: 'Resume & LinkedIn', icon: FileCheck2 },
            { id: 'invoicing', label: 'Payment & Invoicing', icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as EmpireTab)}
                className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: BUG BOUNTY MASTERY (LEGAL) */}
        {activeTab === 'bounty' && (
          <section className="space-y-6">
            {/* 6-Step Legal Roadmap */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  HackerOne & Bugcrowd Authorized Disclosure Roadmap
                </h2>
                <span className="text-xs font-mono text-emerald-300">
                  Authorized Scope Only · Safe Harbor First
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BOUNTY_ROADMAP.map((item) => (
                  <article
                    key={item.step}
                    className="bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-300">
                        STEP 0{item.step} · {item.duration}
                      </span>
                      <span className="text-slate-400">{item.platform}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
                    <ul className="space-y-1.5 pt-2 border-t border-white/5">
                      {item.checklist.map((c, idx) => (
                        <li key={idx} className="text-[11.5px] text-slate-300 flex gap-2">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            {/* Professional Bug Report Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div>
                  <p className="text-[11px] font-mono text-emerald-300">TRIAGE-READY FORMATTER</p>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    Responsible Disclosure Report Generator
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a weakness class to generate a clean, executive Markdown report ready for HackerOne or Bugcrowd submission.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Finding Category
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => {
                        setSelectedTemplateId(e.target.value);
                        const found = REPORT_TEMPLATES.find((t) => t.id === e.target.value);
                        if (found) setReportSeverity(found.defaultSeverity);
                      }}
                      className="w-full min-h-[42px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    >
                      {REPORT_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Authorized Target Domain
                      </label>
                      <input
                        type="text"
                        value={reportTarget}
                        onChange={(e) => setReportTarget(e.target.value)}
                        className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Suggested Severity
                      </label>
                      <select
                        value={reportSeverity}
                        onChange={(e) =>
                          setReportSeverity(e.target.value as 'Medium' | 'High' | 'Critical')
                        }
                        className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Affected Endpoint / Feature
                    </label>
                    <input
                      type="text"
                      value={reportEndpoint}
                      onChange={(e) => setReportEndpoint(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Environment & Test Notes
                    </label>
                    <textarea
                      rows={3}
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      className="w-full rounded-xl bg-slate-950 border border-white/15 p-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Markdown Report Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy('bug-report', generatedBugReport)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
                    >
                      {copiedKey === 'bug-report' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied Markdown
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Markdown
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadMarkdown}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download .md
                    </button>
                  </div>
                </div>

                <pre className="flex-1 p-4 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto">
                  {generatedBugReport}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: FREELANCING PLAYBOOK */}
        {activeTab === 'freelance' && (
          <section className="space-y-6">
            {/* Upwork/Fiverr Optimization Checklist + India vs US Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Profile Checklist */}
              <div className="lg:col-span-6 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Upwork & Fiverr Profile Checklist
                    </h2>
                    <p className="text-xs text-slate-400">
                      Complete these high-leverage optimizations before sending proposals.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 tabular-nums shrink-0">
                    {completedFreelanceCount}/{FREELANCE_CHECKLIST.length} done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {FREELANCE_CHECKLIST.map((item) => {
                    const checked = !!checkedFreelance[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setCheckedFreelance((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                          checked
                            ? 'bg-emerald-500/10 border-emerald-400/35'
                            : 'bg-slate-950/70 border-white/5 hover:border-white/15'
                        }`}
                      >
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{item.title}</span>
                            <span className="text-[10px] font-mono text-amber-300">
                              · {item.platform}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-400 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* India vs US Pricing Calculator */}
              <div className="lg:col-span-6 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-300" />
                  <h2 className="text-base font-bold text-white">
                    India vs US Freelance Pricing Calculator
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Client Market
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCalcMarket('india')}
                        className={`min-h-[40px] rounded-xl border text-xs font-semibold transition ${
                          calcMarket === 'india'
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-100'
                            : 'bg-slate-950 border-white/10 text-slate-300'
                        }`}
                      >
                        India / APAC
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcMarket('us')}
                        className={`min-h-[40px] rounded-xl border text-xs font-semibold transition ${
                          calcMarket === 'us'
                            ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-100'
                            : 'bg-slate-950 border-white/10 text-slate-300'
                        }`}
                      >
                        US / EU Global
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Experience Tier
                    </label>
                    <select
                      value={calcLevel}
                      onChange={(e) => setCalcLevel(e.target.value as 'junior' | 'mid' | 'senior')}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    >
                      <option value="junior">Junior / Early Portfolio</option>
                      <option value="mid">Mid-Level / Independent Builder</option>
                      <option value="senior">Senior / Architect Specialist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Estimated Project Hours: <span className="text-white font-mono">{calcHours}h</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={200}
                      step={5}
                      value={calcHours}
                      onChange={(e) => setCalcHours(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      USD → INR Exchange Rate
                    </label>
                    <input
                      type="number"
                      min={60}
                      max={120}
                      value={usdToInr}
                      onChange={(e) => setUsdToInr(Math.max(1, Number(e.target.value) || 85))}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {/* Output KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/85 border border-white/10">
                    <p className="text-[11px] text-slate-400">Benchmark Rate</p>
                    <p className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                      ${pricingSummary.rate}/h
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/85 border border-emerald-400/25">
                    <p className="text-[11px] text-slate-400">Base Quote</p>
                    <p className="text-lg font-bold text-emerald-300 font-mono tabular-nums mt-0.5">
                      ${pricingSummary.subtotalUsd.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/85 border border-amber-400/25">
                    <p className="text-[11px] text-slate-400">Fixed Value Quote</p>
                    <p className="text-lg font-bold text-amber-300 font-mono tabular-nums mt-0.5">
                      ${pricingSummary.valueAnchoredUsd.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/85 border border-white/10">
                    <p className="text-[11px] text-slate-400">Est. INR Payout</p>
                    <p className="text-base font-bold text-cyan-300 font-mono tabular-nums mt-1">
                      ₹{pricingSummary.inrEstimate.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-400">
                  Suggested 35% upfront kickoff deposit:{' '}
                  <span className="text-white font-mono font-semibold">
                    ${pricingSummary.depositUsd.toLocaleString()}
                  </span>{' '}
                  before writing line one of production code.
                </p>

                {/* Role Benchmark Table */}
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/90 text-[11px] text-slate-400 font-mono">
                      <tr>
                        <th className="p-2.5">Role</th>
                        <th className="p-2.5">India Rate</th>
                        <th className="p-2.5">US/EU Rate</th>
                        <th className="p-2.5">Fixed MVP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {RATE_BENCHMARKS.map((row) => (
                        <tr key={row.role} className="bg-slate-900/40">
                          <td className="p-2.5 font-medium text-white">{row.role}</td>
                          <td className="p-2.5 font-mono text-slate-300 whitespace-nowrap">
                            {row.indiaHourlyUsd}
                          </td>
                          <td className="p-2.5 font-mono text-emerald-300 whitespace-nowrap">
                            {row.usHourlyUsd}
                          </td>
                          <td className="p-2.5 font-mono text-amber-300 whitespace-nowrap">
                            {row.fixedMvpUsd}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Client Proposal Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
                <h2 className="text-base font-bold text-white">Client Proposal Generator</h2>
                <p className="text-xs text-slate-400">
                  Customize 5 fields to generate a sharp, non-generic Upwork / cold outreach pitch.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={propClientName}
                      onChange={(e) => setPropClientName(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Scope / Stack
                    </label>
                    <input
                      type="text"
                      value={propProjectType}
                      onChange={(e) => setPropProjectType(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Specific Problem Mentioned in Brief
                    </label>
                    <input
                      type="text"
                      value={propPainPoint}
                      onChange={(e) => setPropPainPoint(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Timeline
                      </label>
                      <input
                        type="text"
                        value={propTimeline}
                        onChange={(e) => setPropTimeline(e.target.value)}
                        className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Quote / Budget
                      </label>
                      <input
                        type="text"
                        value={propRate}
                        onChange={(e) => setPropRate(e.target.value)}
                        className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Ready-to-Send Proposal
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopy('proposal', generatedProposal)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
                  >
                    {copiedKey === 'proposal' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Proposal
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950/90 border border-white/10 font-sans text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {generatedProposal}
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: RESUME & LINKEDIN OPTIMIZER */}
        {activeTab === 'resume' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* ATS Resume Checklist */}
              <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">ATS-Friendly Resume Audit</h2>
                    <p className="text-xs text-slate-400">
                      Pass automated recruiter screens on the first try.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 tabular-nums shrink-0">
                    {completedAtsCount}/{ATS_CHECKLIST.length} passed
                  </span>
                </div>

                <div className="space-y-2.5">
                  {ATS_CHECKLIST.map((item) => {
                    const checked = !!checkedAts[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setCheckedAts((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                          checked
                            ? 'bg-emerald-500/10 border-emerald-400/35'
                            : 'bg-slate-950/70 border-white/5 hover:border-white/15'
                        }`}
                      >
                        {checked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-cyan-300 uppercase">
                            {item.section}
                          </span>
                          <p className="text-xs font-semibold text-white">{item.rule}</p>
                          <p className="text-[11.5px] text-slate-400 leading-relaxed">
                            {item.whyItMatters}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GitHub-to-LinkedIn Project Showcase Generator */}
              <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <h2 className="text-base font-bold text-white">
                    GitHub-to-LinkedIn Showcase & STAR Bullet Generator
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      GitHub / Live URL
                    </label>
                    <input
                      type="text"
                      value={projRepo}
                      onChange={(e) => setProjRepo(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tech Stack
                    </label>
                    <input
                      type="text"
                      value={projStack}
                      onChange={(e) => setProjStack(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Problem Solved
                    </label>
                    <input
                      type="text"
                      value={projProblem}
                      onChange={(e) => setProjProblem(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Quantified Result / Metric
                    </label>
                    <input
                      type="text"
                      value={projMetric}
                      onChange={(e) => setProjMetric(e.target.value)}
                      className="w-full min-h-[40px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Output 1: LinkedIn Post */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">
                      LinkedIn Project Showcase Post
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('linkedin-post', generatedShowcase)}
                      className="min-h-[34px] px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-100 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'linkedin-post' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Post
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 font-sans text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {generatedShowcase}
                  </pre>
                </div>

                {/* Output 2: ATS Resume Bullets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-300">
                      ATS Resume Project Bullets
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('resume-bullets', generatedResumeBullets)}
                      className="min-h-[34px] px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'resume-bullets' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Bullets
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 font-sans text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {generatedResumeBullets}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: PAYMENT & INVOICING */}
        {activeTab === 'invoicing' && (
          <section className="space-y-6">
            {/* International Payment Rails Guide */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-300" />
                <h2 className="text-sm sm:text-base font-bold text-white">
                  International Payment Rails Guide (Receiving USD / EUR / GBP in India)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PAYMENT_RAILS.map((rail) => (
                  <article
                    key={rail.id}
                    className="bg-slate-900/75 border border-white/10 rounded-2xl p-4 backdrop-blur-xl space-y-2.5"
                  >
                    <h3 className="text-sm font-bold text-white">{rail.name}</h3>
                    <p className="text-[11.5px] text-emerald-300">{rail.bestFor}</p>
                    <div className="space-y-1 text-[11px] text-slate-300 pt-2 border-t border-white/5">
                      <p>
                        <span className="text-slate-400">Fees:</span> {rail.fees}
                      </p>
                      <p>
                        <span className="text-slate-400">Speed:</span> {rail.settlementTime}
                      </p>
                      <p>
                        <span className="text-slate-400">FIRC / FIRA:</span> {rail.fircSupport}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{rail.notes}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Interactive Invoice Generator with Print/Save PDF */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Form Inputs */}
              <div className="lg:col-span-6 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-white">Interactive Invoice Builder</h2>
                    <p className="text-xs text-slate-400">
                      Generate a clean client invoice and export to PDF right from your browser.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrintInvoicePdf}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    Download / Print PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Invoice #</label>
                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-2.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP' | 'INR')}
                      className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-2.5 text-xs font-mono text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <p className="text-[11px] font-mono text-emerald-300">FROM (YOUR DETAILS)</p>
                    <input
                      type="text"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="Your Name / Studio"
                      className="w-full min-h-[36px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                    />
                    <input
                      type="email"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full min-h-[36px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={fromAddress}
                      onChange={(e) => setFromAddress(e.target.value)}
                      placeholder="Address / LUT Note"
                      className="w-full min-h-[36px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-white/5">
                    <p className="text-[11px] font-mono text-cyan-300">BILL TO (CLIENT)</p>
                    <input
                      type="text"
                      value={toName}
                      onChange={(e) => setToName(e.target.value)}
                      placeholder="Client Company"
                      className="w-full min-h-[36px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                    />
                    <input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="Client Email"
                      className="w-full min-h-[36px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      placeholder="Client Address"
                      className="w-full min-h-[36px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">Line Items</p>
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="min-h-[34px] px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-emerald-300 flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {lineItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Deliverable description"
                          className="col-span-6 min-h-[38px] rounded-lg bg-slate-950 border border-white/10 px-2.5 text-xs text-white"
                        />
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            updateLineItem(item.id, 'qty', Math.max(1, Number(e.target.value) || 1))
                          }
                          aria-label="Quantity"
                          className="col-span-2 min-h-[38px] rounded-lg bg-slate-950 border border-white/10 px-2 text-xs font-mono text-white text-right"
                        />
                        <input
                          type="number"
                          min={0}
                          value={item.rate}
                          onChange={(e) =>
                            updateLineItem(item.id, 'rate', Math.max(0, Number(e.target.value) || 0))
                          }
                          aria-label="Rate"
                          className="col-span-3 min-h-[38px] rounded-lg bg-slate-950 border border-white/10 px-2 text-xs font-mono text-white text-right"
                        />
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          aria-label="Remove item"
                          className="col-span-1 min-h-[38px] rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tax (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Discount ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Payment Instructions (Wise / Skydo / Bank)
                  </label>
                  <input
                    type="text"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="w-full min-h-[38px] rounded-xl bg-slate-950 border border-white/15 px-3 text-xs text-white"
                  />
                </div>
              </div>

              {/* Live Paper Preview */}
              <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-950">INVOICE</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{fromName}</p>
                    </div>
                    <div className="text-right text-xs text-slate-700 space-y-0.5 font-mono">
                      <p className="font-bold text-slate-950">{invoiceNo}</p>
                      <p>Issued: {invoiceDate}</p>
                      <p>Due: {dueDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        From
                      </p>
                      <p className="font-semibold text-slate-900">{fromName}</p>
                      <p className="text-slate-600">{fromEmail}</p>
                      <p className="text-slate-600">{fromAddress}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Bill To
                      </p>
                      <p className="font-semibold text-slate-900">{toName}</p>
                      <p className="text-slate-600">{toEmail}</p>
                      <p className="text-slate-600">{toAddress}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">
                          <th className="p-2 text-left">Description</th>
                          <th className="p-2 text-right">Qty</th>
                          <th className="p-2 text-right">Rate</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {lineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="p-2 text-slate-800">{item.description}</td>
                            <td className="p-2 text-right font-mono tabular-nums">{item.qty}</td>
                            <td className="p-2 text-right font-mono tabular-nums">
                              {currencySymbol}
                              {item.rate.toFixed(2)}
                            </td>
                            <td className="p-2 text-right font-mono font-semibold tabular-nums">
                              {currencySymbol}
                              {(item.qty * item.rate).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="w-56 ml-auto space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums">
                        {currencySymbol}
                        {invoiceSubtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax ({taxPercent}%)</span>
                      <span className="font-mono tabular-nums">
                        {currencySymbol}
                        {invoiceTax.toFixed(2)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Discount</span>
                        <span className="font-mono tabular-nums">
                          -{currencySymbol}
                          {discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-slate-950 border-t-2 border-slate-900 pt-2">
                      <span>Total Due</span>
                      <span className="font-mono tabular-nums">
                        {currencySymbol}
                        {invoiceTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-600">
                  <p className="font-bold uppercase tracking-wider text-[10px] text-slate-500 mb-1">
                    Payment Instructions
                  </p>
                  <p>{paymentDetails}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
export default FreelanceBountyApp;
