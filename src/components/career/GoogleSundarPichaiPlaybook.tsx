import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Building2,
  Users,
  Compass,
  ArrowRight,
  Target,
  Brain,
  Cpu,
  Shield,
  Layers,
  Clock,
  Quote,
  Star,
  Zap,
  BarChart2,
  Check,
  RotateCcw
} from 'lucide-react';

export interface GoogleSundarPichaiPlaybookProps {
  onBack?: () => void;
  onOpenApp?: (appId: string) => void;
}

interface DiagnosticQuestion {
  id: number;
  question: string;
  scenario: string;
  options: {
    text: string;
    score: number;
    feedback: string;
  }[];
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: 'Distributed System Tradeoff: Low Latency vs Strong Consistency',
    scenario: 'You are designing the Google Workspace real-time collaborative document sync engine across 6 continents.',
    options: [
      {
        text: 'Enforce synchronous 2-phase commit across all global data centers for absolute consistency.',
        score: 1,
        feedback: 'Too slow for real-time collaboration. Cross-continental latency will cause unbearable typing lag.'
      },
      {
        text: 'Use Operational Transformation / CRDT with local optimistic updates and asynchronous Paxos consensus.',
        score: 3,
        feedback: 'Google-Tier! Optimistic client updates give 0ms UI lag while distributed conflict resolution guarantees eventual convergence.'
      },
      {
        text: 'Rely on a single primary database in US-Central and route all global writes through it.',
        score: 0,
        feedback: 'Single point of failure and high latency for international users. Violates Google SRE principles.'
      }
    ]
  },
  {
    id: 2,
    question: 'P0 Incident Management: System Failure During Global Rollout',
    scenario: 'During the rollout of a critical Chrome browser security patch, crash rates in APAC jump by 3.4%.',
    options: [
      {
        text: 'Immediately pause global rollout, trigger canary rollback to last known stable, and open an incident war room.',
        score: 3,
        feedback: 'Exact Google SRE Protocol! Stop the blast radius immediately before investigating root cause.'
      },
      {
        text: 'Keep deploying to Europe and US while senior developers quickly debug APAC logs.',
        score: 0,
        feedback: 'Dangerous. Letting a flawed build spread exponentially multiplies user damage and brand trust erosion.'
      },
      {
        text: 'Send an email to affected users advising them to reboot their systems.',
        score: 0,
        feedback: 'Unacceptable engineering behavior for Tier-1 infrastructure.'
      }
    ]
  },
  {
    id: 3,
    question: 'Product Prioritization: 10% Incremental vs 10x Moonshot',
    scenario: 'Sundar Pichai famously championed Google Chrome when Microsoft IE dominated 70%+ of the browser market.',
    options: [
      {
        text: 'Build an incremental IE toolbar that adds minor search conveniences without building an engine.',
        score: 1,
        feedback: 'Safe but defensive. You will remain subservient to the host platform.'
      },
      {
        text: 'Build a multi-process, V8-powered open-source browser from scratch designed for web apps, not just documents.',
        score: 3,
        feedback: 'Sundar Pichai Playbook! Chrome revolutionized web performance via multi-process isolation and V8 JIT compilation.'
      },
      {
        text: 'Acquire smaller browser startups and rebrand them without core engine changes.',
        score: 1,
        feedback: 'Surface-level strategy that lacks technological moat.'
      }
    ]
  },
  {
    id: 4,
    question: 'Engineering Leadership: Conflicting Senior Architect Opinions',
    scenario: 'Two Principal Engineers strongly disagree on whether to adopt gRPC or GraphQL for the next generation internal microservice mesh.',
    options: [
      {
        text: 'Mandate a 2-week time-boxed prototype benchmark on real production telemetry comparing throughput, CPU, and serialization overhead.',
        score: 3,
        feedback: 'Data-driven decision making! In God we trust, all others must bring data.'
      },
      {
        text: 'Pick the technology proposed by the engineer with higher seniority.',
        score: 0,
        feedback: 'Promotes hierarchy over engineering excellence.'
      },
      {
        text: 'Let each team choose whatever they want with zero company-wide standardization.',
        score: 1,
        feedback: 'Creates massive operational fragmentation and increases cross-team latency.'
      }
    ]
  },
  {
    id: 5,
    question: 'AI & Machine Learning Infrastructure Scalability',
    scenario: 'Your team is integrating a large generative AI model into a search query pipeline receiving 100,000 queries per second.',
    options: [
      {
        text: 'Run the full 70B parameter model synchronously on every single incoming raw request.',
        score: 0,
        feedback: 'Infrastructure cost and GPU memory bottlenecks will cause complete cluster collapse.'
      },
      {
        text: 'Implement multi-tier routing: semantic cache -> distilled fast model for simple queries -> speculative decoding -> asynchronous streaming.',
        score: 3,
        feedback: 'Master-level architecture! Multi-tier inference routing reduces GPU load by 80% while keeping p99 latency under 200ms.'
      },
      {
        text: 'Limit AI responses only to users in North America during off-peak hours.',
        score: 1,
        feedback: 'Defeats the purpose of a global, high-availability platform.'
      }
    ]
  },
  {
    id: 6,
    question: 'Sundar Pichai Core Philosophy: Team Psychological Safety',
    scenario: 'Project Aristotle (Google’s famous study on high-performing teams) revealed the #1 factor in successful engineering organizations.',
    options: [
      {
        text: 'Hiring only competitive individuals with the highest individual competitive programming rankings.',
        score: 1,
        feedback: 'Incorrect. Raw individual IQ without collaboration leads to toxic friction.'
      },
      {
        text: 'Psychological safety: An environment where team members feel safe to take risks, ask questions, and admit mistakes without fear.',
        score: 3,
        feedback: 'Spot On! Google Project Aristotle confirmed psychological safety is the bedrock of innovation.'
      },
      {
        text: 'Strict 14-hour workdays and continuous performance ranking quotas.',
        score: 0,
        feedback: 'Leads to burnout, high attrition, and low-quality code.'
      }
    ]
  }
];

export const GoogleSundarPichaiPlaybook: React.FC<GoogleSundarPichaiPlaybookProps> = ({
  onBack,
  onOpenApp
}) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'routine' | 'architecture' | 'diagnostic' | 'quotes'>('principles');

  // Diagnostic State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedDiagnostic, setSubmittedDiagnostic] = useState(false);

  const calculateScore = () => {
    let total = 0;
    Object.entries(selectedAnswers).forEach(([qId, optIdx]) => {
      const q = DIAGNOSTIC_QUESTIONS.find((item) => item.id === Number(qId));
      if (q && q.options[optIdx]) {
        total += q.options[optIdx].score;
      }
    });
    return total;
  };

  const maxScore = DIAGNOSTIC_QUESTIONS.length * 3;
  const currentScore = calculateScore();
  const percentage = Math.round((currentScore / maxScore) * 100);

  const getTierBadge = () => {
    if (percentage >= 85) {
      return {
        title: 'Google L7+ Principal Architect & VP Ready',
        desc: 'Exceptional systems thinking, strategic calm, and master-level resilience mindset aligned with Sundar Pichai’s playbook.',
        color: 'from-amber-400 to-emerald-400',
        badge: 'Top 1% Engineering Leadership'
      };
    }
    if (percentage >= 65) {
      return {
        title: 'Google L5/L6 Senior / Staff Software Engineer',
        desc: 'Strong engineering fundamentals, high-scale architectural intuition, and solid cross-functional execution.',
        color: 'from-blue-400 to-indigo-400',
        badge: 'FAANG Staff Ready'
      };
    }
    return {
      title: 'Aspiring FAANG Engineering Leader',
      desc: 'Solid foundation, but review Google SRE resilience, Operational Transformation, and psychological safety principles.',
      color: 'from-purple-400 to-pink-400',
      badge: 'Core Foundation Builder'
    };
  };

  const tier = getTierBadge();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Go Back"
              >
                <Compass className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-sm">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black tracking-tight text-white">
                    Sundar Pichai & FAANG Playbook
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Google Executive Edition
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Engineering Leadership, 10x Product Architecture & Billion-User Scaling
                </p>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Billion-Scale Architecture</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950 px-4 py-8 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>From Chennai IIT Kharagpur to Google CEO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            The Architectural Mindset Behind Chrome, Android & Google AI
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            Explore the exact product instincts, SRE scaling frameworks, deep-work schedules, and leadership principles that powered Sundar Pichai’s rise from Product Manager to CEO of Alphabet.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'principles', label: 'FAANG Principles', icon: Layers },
              { id: 'routine', label: '24h Deep-Work Routine', icon: Clock },
              { id: 'architecture', label: 'Google System Design', icon: Cpu },
              { id: 'diagnostic', label: 'Executive Diagnostic', icon: Target },
              { id: 'quotes', label: 'Sundar Quotes', icon: Quote }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        {/* TAB 1: FAANG Principles */}
        {activeTab === 'principles' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-blue-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  1. The 10x Rule over 10% Incrementalism
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  When you try to do something 10% better, you compete directly with everyone else on existing terms. When you aim for 10x better, you are forced to rethink the entire foundational architecture from first principles.
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  Case Study: Google Chrome was designed with individual process isolation per tab so one crashed script never brings down the whole browser.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-emerald-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  2. SRE & Error Budget Philosophy
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  100% uptime is the wrong target for virtually everything. An Error Budget allows engineering teams to maximize product innovation velocity as long as reliability stays within the SLO (e.g., 99.99%).
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  Principle: If you are not consuming your error budget, you are launching new features too slowly.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  3. Quiet Diplomacy & Unblocking Others
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Pichai rose through Google not by aggressive shouting, but by making other teams succeed. When Android, Chrome, and Search had competing roadmaps, he quietly synthesized consensus around the user experience.
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  Rule: "A person who is happy is not because everything is right in life, he is happy because of his attitude towards everything."
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl hover:border-purple-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  4. AI-First Pivot: Foundational Infrastructure
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  In 2016, Sundar famously transformed Google from "Mobile-First" to "AI-First". This required custom silicon (TPUs), distributed training meshes (Pathways), and generative transformer research (Gemini).
                </p>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  Vision: AI will be more profound for humanity than electricity or fire. Build the platforms that democratize it.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 24h Routine */}
        {activeTab === 'routine' && (
          <div className="space-y-4 animate-fade-in max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-blue-400 shrink-0" />
              <p className="text-xs text-blue-200 leading-relaxed">
                Sundar Pichai’s daily cadence is famously deliberate. He avoids reactive morning email panic and focuses on deep context accumulation before making irreversible decisions.
              </p>
            </div>

            {[
              {
                time: '6:30 AM - 8:30 AM',
                title: 'Context Gathering & Deep Quiet Reading',
                desc: 'English breakfast tea, omelet, and thorough reading of physical Wall Street Journal and technical whitepapers. Zero device push notifications.',
                category: 'Mindset & Clarity',
                badgeColor: 'bg-emerald-500/20 text-emerald-300'
              },
              {
                time: '9:00 AM - 11:30 AM',
                title: 'High-Leverage Product Architecture Deep-Dives',
                desc: 'Reviewing Chrome, Search, and Gemini system design proposals. Pushing back on superficial complexity; asking "What is the 10x user value here?"',
                category: 'System Architecture',
                badgeColor: 'bg-blue-500/20 text-blue-300'
              },
              {
                time: '12:00 PM - 1:30 PM',
                title: 'Lunch Walk & Informal Cross-Pollination',
                desc: 'Pichai is famous for taking walking meetings across the Googleplex campus in Mountain View. Moving physically frees subconscious problem-solving.',
                category: 'Cognitive Reset',
                badgeColor: 'bg-amber-500/20 text-amber-300'
              },
              {
                time: '2:00 PM - 4:30 PM',
                title: 'Unblocking Leaders & Strategic Alignment',
                desc: '1-on-1s with Google Fellows and SVPs. Listening 80% of the time, asking probing questions 20% of the time. Resolving resource friction.',
                category: 'Organizational Multiplier',
                badgeColor: 'bg-purple-500/20 text-purple-300'
              },
              {
                time: '6:30 PM - 9:30 PM',
                title: 'Family, Cricket & Mental Detachment',
                desc: 'Spending evening with family, following test cricket matches, and deliberate disconnection to allow subconscious memory consolidation.',
                category: 'Sustainable Peak Output',
                badgeColor: 'bg-rose-500/20 text-rose-300'
              }
            ].map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">{slot.time}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${slot.badgeColor}`}>
                      {slot.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{slot.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{slot.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Google Architecture Visualizer */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">Google Spanner</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Globally distributed NewSQL database that provides external consistency at global scale using GPS atomic clocks (TrueTime API) to bound clock drift to under 7ms.
                </p>
                <div className="text-[10px] font-mono text-blue-400 bg-blue-950/50 p-2 rounded-lg">
                  ACID transactions across continents without locking the entire planet.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Borg (Ancestor of K8s)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google’s large-scale cluster management system running hundreds of thousands of jobs across thousands of machines. Inspired Kubernetes and modern container orchestration.
                </p>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 p-2 rounded-lg">
                  Sub-second task preemption, quota allocation, and zero downtime rolling deploys.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">BeyondCorp Zero Trust</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminated corporate VPNs. Every request from every employee or microservice is dynamically authenticated, encrypted, and authorized based on device state and context.
                </p>
                <div className="text-[10px] font-mono text-amber-400 bg-amber-950/50 p-2 rounded-lg">
                  No trusted internal network perimeter. Perimeter is dead; identity is the firewall.
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/40 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Billion-User Architectural Checklist</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Stateless compute layers with auto-scaling groups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Client-side optimistic UI with eventual sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>gRPC protobuf payload serialization over JSON</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Circuit breakers on every downstream network dependency</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: Executive Diagnostic Test */}
        {activeTab === 'diagnostic' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">
                FAANG System Design & Leadership Readiness Diagnostic
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                6 real-world scenarios evaluating your system architecture, SRE crisis response, and executive decision frameworks.
              </p>
            </div>

            <div className="space-y-4">
              {DIAGNOSTIC_QUESTIONS.map((q) => {
                const selectedOpt = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono font-bold flex items-center justify-center">
                        {q.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{q.question}</h4>
                    </div>
                    <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      Scenario: {q.scenario}
                    </p>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx })}
                            className={`w-full text-left p-3 rounded-xl text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                              isChosen
                                ? 'bg-blue-600/30 border border-blue-400 text-white font-medium'
                                : 'bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isChosen ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                            }`}>
                              {isChosen && <Check className="w-3 h-3 text-white" />}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback if submitted */}
                    {submittedDiagnostic && selectedOpt !== undefined && (
                      <div className={`p-3 rounded-xl text-xs border ${
                        q.options[selectedOpt].score === 3
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      }`}>
                        <strong>Review:</strong> {q.options[selectedOpt].feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit & Score */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <p className="text-xs text-slate-400">
                  Answered: {Object.keys(selectedAnswers).length} of {DIAGNOSTIC_QUESTIONS.length}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {submittedDiagnostic && (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setSubmittedDiagnostic(false);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setSubmittedDiagnostic(true)}
                  disabled={Object.keys(selectedAnswers).length < DIAGNOSTIC_QUESTIONS.length}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs shadow-lg shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed transition-all"
                >
                  Evaluate FAANG Readiness
                </button>
              </div>
            </div>

            {/* Results Banner */}
            {submittedDiagnostic && (
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 shadow-2xl animate-fade-in space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                      {tier.badge}
                    </span>
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    {percentage}% ({currentScore}/{maxScore})
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Sundar Pichai Quotes */}
        {activeTab === 'quotes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {[
              {
                quote: "Wear your failure as a badge of honor. If you don't fail sometimes, you are not being ambitious enough.",
                context: "On Moonshot Engineering at Google I/O"
              },
              {
                quote: "It is always good to work with people who make you feel insecure about yourself. That way, you will constantly push your limits.",
                context: "Advice to students at IIT Kharagpur"
              },
              {
                quote: "A core duty of a leader is not only to achieve success yourself, but to make sure the people around you are positioned to win.",
                context: "On Team Leadership & Empowerment"
              },
              {
                quote: "In technology, you have to be willing to disrupt your own best products before someone else does it for you.",
                context: "On the transition to Generative AI"
              }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <Quote className="w-6 h-6 text-blue-400/60" />
                <p className="text-sm font-medium text-white italic leading-relaxed">
                  "{item.quote}"
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  — {item.context}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
