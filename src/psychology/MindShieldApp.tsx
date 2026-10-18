import React, { useState } from 'react';
import {
  Brain,
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Users,
  Target
} from 'lucide-react';

export interface MindShieldAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const MindShieldApp: React.FC<MindShieldAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'biases' | 'darkux' | 'persuasion' | 'bodylang' | 'simulator' | 'cheatsheet'>('biases');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedRedFlags, setSelectedRedFlags] = useState<number[]>([]);
  const [scenarioSubmitted, setScenarioSubmitted] = useState(false);

  const COGNITIVE_BIASES = [
    {
      id: 'authority',
      name: 'Authority Bias',
      desc: 'Tendency to follow advice or orders from an authority figure without verification.',
      attackUsage: 'Scammer calls claiming to be "CBI / Police Officer" or "CEO" demanding urgent wire transfer or OTP.',
      defense: 'Protocol over Rank: Never act on emergency commands via phone/chat. Always verify via verified internal HR directory.'
    },
    {
      id: 'dunning-kruger',
      name: 'Dunning-Kruger Effect',
      desc: 'Beginners overestimate their competence, while experts doubt their knowledge.',
      attackUsage: 'A developer thinks "I am too smart to get phished," skipping security protocols and clicking malicious links.',
      defense: 'Adopt a Zero-Trust mindset. Even seasoned cybersecurity veterans can be targeted by spear-phishing.'
    },
    {
      id: 'scarcity',
      name: 'Urgency & Scarcity Panic',
      desc: 'When an item or time window is limited, our critical thinking rational circuits shut down.',
      attackUsage: '"Your bank account will be blocked in 15 minutes! Click here to update KYC immediately."',
      defense: 'Golden 10-Minute Rule: Genuine banks never demand instantaneous action via an SMS link. Stop, breathe, and call official care.'
    },
    {
      id: 'social-proof',
      name: 'Social Proof / Herd Mentality',
      desc: 'People assume the actions of others reflect correct behavior for a given situation.',
      attackUsage: 'Fake investment WhatsApp groups with 50 bot members posting "I just doubled my money today!" to lure victims.',
      defense: 'Independent audit: If it looks too good to be true, it is 100% a Ponzi fraud.'
    },
    {
      id: 'sunk-cost',
      name: 'Sunk Cost Fallacy',
      desc: 'Continuing an endeavor once an investment in money, effort, or time has been made.',
      attackUsage: 'Victim loses ₹10,000 in a fake crypto task scam. Scammer says "Pay ₹5,000 more tax to withdraw all ₹15,000."',
      defense: 'Cut losses instantly. Report immediately to 1930 / cybercrime.gov.in.'
    },
    {
      id: 'reciprocity',
      name: 'Reciprocity Bias',
      desc: 'Strong human urge to repay a favor or gift, even if unsolicited.',
      attackUsage: 'Scammer gives a free trial or "exclusive cheat sheet", then asks for login credentials or confidential team docs.',
      defense: 'Beware of unsolicited "free gifts" from unknown contacts on LinkedIn or Discord.'
    }
  ];

  const DARK_UX_PATTERNS = [
    {
      pattern: 'Roach Motel',
      definition: 'Extremely easy to subscribe or get in, nearly impossible to cancel or delete your account.',
      realExample: 'Signing up requires 1 click. Unsubscribing requires calling an international phone number between 2 AM and 4 AM.',
      defenseTip: 'Use virtual privacy cards (one-time cards) or review account deletion policies before signing up.'
    },
    {
      pattern: 'Confirmshaming',
      definition: 'Emotional manipulation to guilt user into choosing what benefits the business.',
      realExample: '"No thanks, I hate saving money and love paying full price!" instead of a simple "Cancel" button.',
      defenseTip: 'Recognize the psychological trigger and reject with zero guilt.'
    },
    {
      pattern: 'Sneak into Basket',
      definition: 'Adding unwanted add-ons or insurance automatically during checkout.',
      realExample: 'Flight booking site auto-checks "Travel Insurance ₹499" and "Priority Baggage ₹350" at final payment stage.',
      defenseTip: 'Always audit the line-item summary right before entering UPI PIN or card CVV.'
    },
    {
      pattern: 'Disguised Ads',
      definition: 'Advertisements designed to look like organic content or system alert buttons.',
      realExample: 'Software download websites displaying four massive fake green "DOWNLOAD HERE" buttons that install adware.',
      defenseTip: 'Hover over the link to verify the destination URL in your browser bottom status bar.'
    },
    {
      pattern: 'Forced Continuity',
      definition: 'Charging recurring subscription after a "Free Trial" with zero renewal warning.',
      realExample: 'App asks for credit card for a 7-day free trial, then bills an annual ₹12,000 non-refundable charge on day 8.',
      defenseTip: 'Immediately cancel recurring subscriptions right after starting the trial period.'
    }
  ];

  const CIALDINI_PRINCIPLES = [
    { rule: 'Reciprocity', insight: 'Give genuine value first before asking. In interviews, offer an insightful solution to an open company problem.' },
    { rule: 'Scarcity', insight: 'Communicate your unique skills and availability respectfully. Deadlines accelerate decision-making.' },
    { rule: 'Authority', insight: 'Establish credibility through verifiable projects, GitHub commits, and certifications (OSCP, AWS).' },
    { rule: 'Consistency', insight: 'Start with small agreements. When a hiring manager agrees on architectural vision, salary alignment follows.' },
    { rule: 'Liking', insight: 'People do business with people they genuinely like. Mirror cadence, show curiosity, and find common ground.' },
    { rule: 'Consensus', insight: 'Reference industry standards and proven case studies rather than presenting isolated opinions.' }
  ];

  const SIMULATION_SCENARIOS = [
    {
      title: 'Targeted Spear-Phishing: HR Payroll Update',
      sender: 'hr-support@company-portal-update.com (Spoofed domain)',
      subject: 'URGENT: Verify Banking Details to avoid October Salary Delay',
      content: 'Dear Employee,\n\nDue to our migration to a new Enterprise Cloud Payroll system, all team members are required to re-verify their direct deposit bank account and PAN card within the next 2 hours.\n\nFailure to complete this verification will result in your salary disbursement being put on hold for 30 business days.\n\nClick the secure link below to update your credentials:\nhttp://internal-payroll.company-portal-update.com/login?token=892389\n\nWarm regards,\nFinance & HR Operations Department',
      redFlags: [
        { id: 0, text: 'Spoofed external domain (company-portal-update.com instead of verified company.com)' },
        { id: 1, text: 'Artificial urgency panic (threatens to withhold salary for 30 days within 2 hours)' },
        { id: 2, text: 'Unsecured HTTP link requesting sensitive banking credentials' },
        { id: 3, text: 'Generic greeting without employee name or employee ID' }
      ]
    },
    {
      title: 'Executive Impersonation (Whaling): CEO Emergency Wire',
      sender: 'ceo.private.desk@gmail.com (Personal free mailbox)',
      subject: 'Confidential: Need quick assistance right now (In meetings)',
      content: 'Hi,\n\nI am currently trapped in an all-day executive board meeting and cannot take calls. We are closing an urgent NDA acquisition and I need you to purchase 5 Apple Gift Cards of ₹10,000 each and email me the redemption codes immediately.\n\nKeep this strictly confidential between us. I will get accounting to reimburse you by 5 PM.\n\nSent from my iPhone',
      redFlags: [
        { id: 0, text: 'Sent from public @gmail.com rather than enterprise email' },
        { id: 1, text: 'Classic "Gift Card / Crypto" non-refundable payment demand' },
        { id: 2, text: 'Excuse for avoiding voice/phone verification ("trapped in meeting")' },
        { id: 3, text: 'Demand for secrecy ("strictly confidential between us")' }
      ]
    }
  ];

  const currentScenario = SIMULATION_SCENARIOS[selectedScenarioIndex];

  const handleToggleRedFlag = (id: number) => {
    if (selectedRedFlags.includes(id)) {
      setSelectedRedFlags(selectedRedFlags.filter((i) => i !== id));
    } else {
      setSelectedRedFlags([...selectedRedFlags, id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">MindShield Lab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  #mindshield · App #41
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cognitive biases, Dark UX defense, Cialdini persuasion principles & social engineering simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-all shadow cursor-pointer"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'biases', label: 'Cognitive Biases', icon: Brain },
            { id: 'darkux', label: 'Dark UX Patterns', icon: Eye },
            { id: 'persuasion', label: 'Cialdini Persuasion', icon: Target },
            { id: 'bodylang', label: 'Interview Body Language', icon: Users },
            { id: 'simulator', label: 'Phishing Red-Flag Sim', icon: AlertTriangle },
            { id: 'cheatsheet', label: 'Negotiation Cheatsheet', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Cognitive Biases Tab */}
        {activeTab === 'biases' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Psychological Vulnerabilities: How Hackers Exploit Human Firmware
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Social engineering does not hack software; it hacks human psychology. Recognizing how internal biases are weaponized allows you to maintain rational situational awareness.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COGNITIVE_BIASES.map((bias) => (
                  <div key={bias.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white">{bias.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Bias
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{bias.desc}</p>
                      <div className="text-xs text-amber-300/90 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded-xl mb-2">
                        ⚠️ <strong>Scam Tactic:</strong> {bias.attackUsage}
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl">
                      🛡️ <strong>Defense:</strong> {bias.defense}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dark UX Patterns Tab */}
        {activeTab === 'darkux' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                Dark UX Patterns & Behavioral Deception
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Commercial apps and deceptive websites exploit micro-interactions to coerce clicks, charge hidden subscriptions, and trap users. Here is how to spot and defeat them.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DARK_UX_PATTERNS.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-cyan-400">{item.pattern}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        Dark Pattern
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{item.definition}</p>
                    <div className="text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <strong>Real-world case:</strong> {item.realExample}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      💡 <strong>Defensive Action:</strong> {item.defenseTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cialdini Persuasion Tab */}
        {activeTab === 'persuasion' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Robert Cialdini's 6 Universal Principles of Ethical Influence
              </h3>
              <p className="text-xs text-slate-400">
                Master these psychological principles for leadership, technical client pitches, salary negotiation, and interview influence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CIALDINI_PRINCIPLES.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">Principle {idx + 1}</span>
                  <h4 className="text-base font-bold text-white">{item.rule}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">{item.insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Body Language Tab */}
        {activeTab === 'bodylang' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                High-Impact Non-Verbal Signals in Tech Interviews
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Over 60% of interpersonal evaluation happens before you write the first line of code.
              </p>

              <div className="space-y-3">
                {[
                  { signal: 'Camera Eye-Contact (Remote)', tip: 'Look at the webcam lens, not the interviewer\'s face on screen, when making key persuasive points.' },
                  { signal: 'Open Posture & Steeple Hands', tip: 'Rest hands on the desk with fingertips touching (steepling) to project calm intellectual confidence.' },
                  { signal: 'The Strategic 2-Second Pause', tip: 'When asked a tough system design question, breathe and pause for 2 seconds before answering. Rushing projects anxiety.' },
                  { signal: 'Active Nodding & Verbal Acknowledgement', tip: 'Demonstrate active listening when the interviewer clarifies architectural requirements.' }
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-emerald-400">{item.signal}</span>
                    <p className="text-xs text-slate-300">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Negative Micro-Behaviors to Avoid
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subconscious stress signals that trigger subconscious hesitation in hiring committees.
              </p>

              <div className="space-y-3">
                {[
                  { signal: 'Neck Touching / Pacifying gestures', tip: 'Touching collarbones or neck signals acute distress. Keep hands visible on table.' },
                  { signal: 'Monotone Voice Velocity', tip: 'Vary vocal pitch and emphasis on high-impact metric achievements (e.g., "reduced latency by 40%").' },
                  { signal: 'Defensive Slouching or Swiveling', tip: 'Swiveling your office chair repeatedly communicates restlessness. Lock the chair tilt.' },
                  { signal: 'Interrupting the Interviewer', tip: 'Always let the question finish entirely, wait 1 second, then begin speaking.' }
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-rose-400">{item.signal}</span>
                    <p className="text-xs text-slate-300">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Phishing Simulator Tab */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase">Scenario {selectedScenarioIndex + 1} of {SIMULATION_SCENARIOS.length}</span>
                  <h3 className="text-base font-bold text-white">{currentScenario.title}</h3>
                </div>
                <div className="flex gap-2">
                  {SIMULATION_SCENARIOS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedScenarioIndex(idx);
                        setSelectedRedFlags([]);
                        setScenarioSubmitted(false);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedScenarioIndex === idx
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Mail Window */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner font-mono text-xs">
                <div className="bg-slate-900 p-3 border-b border-slate-800 space-y-1 text-slate-300">
                  <div><strong>From:</strong> <span className="text-rose-400">{currentScenario.sender}</span></div>
                  <div><strong>Subject:</strong> <span className="text-white font-bold">{currentScenario.subject}</span></div>
                </div>
                <div className="p-4 whitespace-pre-line text-slate-200 leading-relaxed font-sans text-xs">
                  {currentScenario.content}
                </div>
              </div>

              {/* Red-Flag Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white">Identify the Social Engineering Red Flags:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {currentScenario.redFlags.map((flag) => {
                    const isChecked = selectedRedFlags.includes(flag.id);
                    return (
                      <div
                        key={flag.id}
                        onClick={() => handleToggleRedFlag(flag.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-purple-950/40 border-purple-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border ${isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700'}`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span>{flag.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setScenarioSubmitted(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                >
                  Verify Findings
                </button>
                {scenarioSubmitted && (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Great triage! Found {selectedRedFlags.length} of {currentScenario.redFlags.length} red flags.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Negotiation Cheatsheet */}
        {activeTab === 'cheatsheet' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Senior Tech Salary & Scope Negotiation Playbook
              </h3>
              <p className="text-xs text-slate-400">
                Evidence-based phrasing for software engineers and cybersecurity specialists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  situation: 'When asked for current CTC first',
                  response: '"I prefer to focus on the value and scope of this role rather than past compensation. Based on my research and experience in securing multi-cloud microservices, I am targeting ₹24-28 LPA for this role."'
                },
                {
                  situation: 'When receiving the first offer',
                  response: '"Thank you so much for this offer! I am genuinely excited about the team. Give me 48 hours to thoroughly review the total compensation breakdown, ESOPs, and benefits."'
                },
                {
                  situation: 'Negotiating a higher base salary',
                  response: '"Given my recent certification in OSCP and hands-on track record reducing incident triage time by 45%, I was hoping we could bring the fixed base to ₹22 LPA. If we can reach that, I would be thrilled to sign today."'
                },
                {
                  situation: 'Negotiating joining bonus or remote flexibility',
                  response: '"If the budget is rigid on the fixed base, could we explore a one-time sign-on bonus of ₹3 Lakh or written agreement for 2 days remote work flexibility?"'
                }
              ].map((play, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-purple-400 block">{play.situation}</span>
                  <p className="text-xs text-slate-300 italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {play.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
