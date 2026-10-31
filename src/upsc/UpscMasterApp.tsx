import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers,
  Lightbulb,
  Search,
  Sparkles,
  Target,
  Clock,
  ArrowRight,
  TrendingUp,
  Bookmark,
  ExternalLink,
  Shield,
  Star,
  Users
} from 'lucide-react';

export interface UpscMasterAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSwitchApp?: (appId: string) => void;
}

export const UpscMasterApp: React.FC<UpscMasterAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSwitchApp
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'syllabus' | 'booklist' | 'mains' | 'roadmap' | 'quiz'>('blueprint');
  const [selectedGs, setSelectedGs] = useState<'gs1' | 'gs2' | 'gs3' | 'gs4'>('gs1');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizReview, setShowQuizReview] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Prelims PYQ Mock Questions
  const pyqQuestions = [
    {
      id: 1,
      subject: 'Polity & Constitution',
      question: 'Which one of the following suggested that the Governor should be an eminent person from outside the State and should be a detached figure without intense political links?',
      options: [
        'First Administrative Reforms Commission (1966)',
        'Rajamannar Committee (1969)',
        'Sarkaria Commission (1983)',
        'National Commission to Review the Working of the Constitution (2000)'
      ],
      correct: 2,
      explanation: 'Sarkaria Commission on Centre-State Relations (1983) recommended that the Governor should be an eminent person from outside the state, a detached figure without active political involvement in recent past.'
    },
    {
      id: 2,
      subject: 'Economy',
      question: 'With reference to the Indian economy, what does "Core Inflation" indicate?',
      options: [
        'Inflation in food articles and energy goods',
        'Overall headline inflation calculated via WPI',
        'Headline inflation excluding volatile components like food and fuel',
        'Inflation solely measured using GDP deflator'
      ],
      correct: 2,
      explanation: 'Core Inflation measures underlying long-term inflation by stripping out transitory and volatile price changes in food and fuel/energy commodities.'
    },
    {
      id: 3,
      subject: 'Environment & Ecology',
      question: 'Which of the following National Parks is unique in being a swamp with floating vegetation that supports a rich biodiversity (Phumdis)?',
      options: [
        'Bhitarkanika National Park',
        'Keibul Lamjao National Park',
        'Keoladeo Ghana National Park',
        'Sultanpur National Park'
      ],
      correct: 1,
      explanation: 'Keibul Lamjao National Park in Loktak Lake, Manipur, is the world’s only floating national park characterized by "Phumdis" (floating biomass), home to the endangered Sangai brow-antlered deer.'
    },
    {
      id: 4,
      subject: 'Modern Indian History',
      question: 'With reference to 8th August 1942 in Indian history, which one of the following statements is correct?',
      options: [
        'The Quit India Resolution was adopted by the AICC at Bombay.',
        'The Viceroy’s Executive Council was expanded to include more Indians.',
        'Congress ministries resigned in seven provinces.',
        'Cripps proposed an Indian Union with Dominion status after WWII.'
      ],
      correct: 0,
      explanation: 'On August 8, 1942, Mahatma Gandhi launched the Quit India Movement with his historic "Do or Die" call at the Gowalia Tank Maidan (August Kranti Maidan) in Bombay.'
    },
    {
      id: 5,
      subject: 'Ethics & Governance (GS-4)',
      question: 'According to the Nolan Committee, which of the following is NOT one of the 7 Principles of Public Life?',
      options: [
        'Selflessness',
        'Accountability',
        'Secrecy',
        'Openness'
      ],
      correct: 2,
      explanation: 'The Nolan Committee Principles are Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, and Leadership. Secrecy is the opposite of Openness!'
    }
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (showQuizReview) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCalculateScore = () => {
    let score = 0;
    pyqQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        score += 2;
      } else if (userAnswers[idx] !== undefined) {
        score -= 0.66; // UPSC negative marking
      }
    });
    setQuizScore(Math.round(score * 100) / 100);
    setShowQuizReview(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizScore(null);
    setShowQuizReview(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 border border-orange-400/30">
            <Award className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                UPSC CSE Civil Services Navigator
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IAS · IPS · IFS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Complete Preparation Architecture, Syllabus, Standard Booklist & Answer Writing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">All Apps</span>
            </button>
          )}
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Main Hub
            </button>
          )}
        </div>
      </header>

      {/* Navigation Pills Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-5">
        <div className="p-1.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-1 overflow-x-auto scrollbar-none shadow-xl">
          {[
            { id: 'blueprint', label: '1. Exam Blueprint', icon: Target },
            { id: 'syllabus', label: '2. Detailed Syllabus', icon: Layers },
            { id: 'booklist', label: '3. Standard Booklist', icon: BookOpen },
            { id: 'mains', label: '4. Mains Answer Mastery', icon: FileText },
            { id: 'roadmap', label: '5. 12-Month Plan & CSAT', icon: Calendar },
            { id: 'quiz', label: '6. Prelims PYQ Simulator', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-6">
        {/* TAB 1: EXAM BLUEPRINT */}
        {activeTab === 'blueprint' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-amber-950/20 border border-amber-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  UPSC CSE 3-Stage Selection Process
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  India’s Most Prestigious Civil Services Examination
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Every year 10-12 lakh aspirants appear for ~1,000 top civil administration vacancies (IAS, IPS, IFS, IRS, IA&AS).
                  Success demands systematic coverage, multi-dimensional conceptual clarity, and disciplined daily answer writing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-mono">STAGE 1</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">Qualifying / Screening</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Preliminary Examination</h3>
                  <p className="text-xs text-slate-400">Objective Multiple Choice (OMR). 400 total marks.</p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5 font-mono">
                    <li>• GS Paper I: 100 Qs (200 M) - Cutoff (~85-95)</li>
                    <li>• CSAT Paper II: 80 Qs (200 M) - 33% Qualifying</li>
                    <li>• Negative Marking: 1/3rd (0.66 per wrong Q)</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400 font-mono">STAGE 2</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">Rank Deciding</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Mains Examination</h3>
                  <p className="text-xs text-slate-400">Subjective Descriptive written papers. 1750 marks.</p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5 font-mono">
                    <li>• 1 Essay Paper (250 M)</li>
                    <li>• 4 General Studies Papers (1000 M)</li>
                    <li>• 2 Optional Papers (500 M)</li>
                    <li>• 2 Qualifying Languages (Hindi/Regional + Eng)</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 font-mono">STAGE 3</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">Final Hurdle</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Personality Test (Interview)</h3>
                  <p className="text-xs text-slate-400">Dholpur House, New Delhi interview board. 275 marks.</p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5 font-mono">
                    <li>• Detailed Application Form (DAF) scrutiny</li>
                    <li>• Ethical dilemma handling & mental alert</li>
                    <li>• Leadership, integrity, and diplomatic tone</li>
                    <li>• Total Grand Merit: 2025 Marks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rank Distribution & Cutoff Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Recent Final Selection Cutoff Score Trends (Out of 2025)</span>
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-800/40">
                    <span className="text-slate-300">General Category</span>
                    <span className="text-amber-400 font-bold">950 - 965 Marks (~47%)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-800/40">
                    <span className="text-slate-300">EWS Category</span>
                    <span className="text-amber-400 font-bold">915 - 930 Marks (~45%)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-800/40">
                    <span className="text-slate-300">OBC Category</span>
                    <span className="text-amber-400 font-bold">910 - 925 Marks (~45%)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-800/40">
                    <span className="text-slate-300">SC / ST Category</span>
                    <span className="text-amber-400 font-bold">880 - 900 Marks (~44%)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Takeaway: Getting just 50% marks in UPSC Mains + Interview guarantees a top 50 All India Rank!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Top Golden Rules for First Attempt Success</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Limit Resources:</strong> 1 standard book 10 times is 100x better than 10 books 1 time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Daily Answer Writing:</strong> Don't wait to complete the syllabus. Start writing 2 answers daily after 3 months.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Syllabus Memorization:</strong> Learn the exact keywords of GS 1 to 4 by heart so you can tag current affairs effortlessly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Solve 50+ Prelims Mock Papers:</strong> Master intelligent elimination technique and time management.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SYLLABUS */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'gs1', label: 'GS-1: Heritage, History, Geo & Society' },
                { id: 'gs2', label: 'GS-2: Governance, Constitution & IR' },
                { id: 'gs3', label: 'GS-3: Economy, S&T, Environment & Security' },
                { id: 'gs4', label: 'GS-4: Ethics, Integrity & Aptitude' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedGs(item.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedGs === item.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {selectedGs === 'gs1' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-amber-300">Indian Heritage & Culture + History</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Art & Culture:</strong> Temple architecture (Nagara, Dravida, Vesara), classical dances, Bhakti & Sufi traditions, cave art (Ajanta, Ellora).</li>
                    <li>• <strong>Modern Indian History:</strong> 1757 to 1947, 1857 Revolt, socio-religious reform movements, Indian National Congress phases (Moderates, Extremists, Gandhian era).</li>
                    <li>• <strong>Freedom Struggle:</strong> Non-Cooperation, Civil Disobedience, Quit India, role of women, tribal and peasant uprisings.</li>
                    <li>• <strong>Post-Independence Consolidation:</strong> Reorganization of states, integration of princely states, tribal policies, green revolution.</li>
                    <li>• <strong>World History:</strong> Industrial revolution, World Wars, colonization & decolonization, Russian & French revolutions.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-amber-300">Geography of World & Indian Society</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Physical Geography:</strong> Plate tectonics, earthquakes, volcanism, cyclones, El Niño/La Niña, Indian Monsoon mechanism.</li>
                    <li>• <strong>Distribution of Key Natural Resources:</strong> South Asia, Africa, minerals, petroleum, water scarcity.</li>
                    <li>• <strong>Salient Features of Indian Society:</strong> Diversity, secularism, caste hierarchy and contemporary dynamics, communalism, regionalism.</li>
                    <li>• <strong>Role of Women & Women's Organizations:</strong> Self-Help Groups (SHGs), patriarchy, gender budgeting.</li>
                    <li>• <strong>Urbanization:</strong> Problems and remedies (slums, solid waste management, traffic congestion, smart cities).</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedGs === 'gs2' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-cyan-300">Polity, Constitution & Governance</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Constitutional Framework:</strong> Preamble, Fundamental Rights (Art 12-35), DPSP (Art 36-51), Basic Structure Doctrine (Kesavananda Bharati case).</li>
                    <li>• <strong>Union & State Executive:</strong> President, Governor powers, Prime Minister, Union Council of Ministers, ordinance making.</li>
                    <li>• <strong>Parliament & State Legislatures:</strong> Functioning, conduct of business, Parliamentary Committees, anti-defection law (10th Schedule).</li>
                    <li>• <strong>Judiciary:</strong> Supreme Court, Judicial Review, Public Interest Litigation (PIL), collegium system vs NJAC, pending cases reform.</li>
                    <li>• <strong>Statutory & Regulatory Bodies:</strong> Election Commission, CAG, UPSC, Finance Commission, NITI Aayog, CBI, ED.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-cyan-300">Social Justice & International Relations</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Welfare Schemes:</strong> Vulnerable sections (SC/ST, disabled, elderly, transgender persons), health and education infrastructure.</li>
                    <li>• <strong>Poverty & Hunger:</strong> Multidimensional Poverty Index, National Food Security Act, POSHAN Abhiyaan.</li>
                    <li>• <strong>Civil Services Role in Democracy:</strong> Administrative reforms, Mission Karmayogi, Citizen Charters, RTI Act.</li>
                    <li>• <strong>India & Neighborhood Relations:</strong> India-China LAC, India-Pakistan, Bangladesh, Sri Lanka, Nepal (Neighborhood First policy).</li>
                    <li>• <strong>Bilateral & Global Groupings:</strong> QUAD, BRICS, SCO, G20, UN Security Council reforms, WTO, Indo-Pacific dynamics.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedGs === 'gs3' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-300">Economy, Agriculture & Infrastructure</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Indian Economy & Mobilization of Resources:</strong> GDP growth, inflation targeting (MPC), monetary vs fiscal policy, tax reforms (GST).</li>
                    <li>• <strong>Inclusive Growth:</strong> Financial inclusion (PMJDY, UPI), employment generation, gig economy.</li>
                    <li>• <strong>Agriculture & Food Security:</strong> MSP (Minimum Support Price), PDS system, micro-irrigation, fertilizer subsidies, GM crops.</li>
                    <li>• <strong>Supply Chain & Food Processing:</strong> Cold storage, mega food parks, contract farming.</li>
                    <li>• <strong>Infrastructure:</strong> Roads, railways, ports, energy transition (renewable solar, hydrogen mission), PM Gati Shakti.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-300">Science & Tech, Environment & Internal Security</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Science & Technology:</strong> AI, Quantum Computing, Space missions (Gaganyaan, Chandrayaan, Aditya-L1), biotechnology (CRISPR-Cas9).</li>
                    <li>• <strong>Environment & Climate Change:</strong> UNFCCC COP summits, Paris Agreement, Net Zero 2070, Wildlife Protection Act, biodiversity loss.</li>
                    <li>• <strong>Disaster Management:</strong> NDMA guidelines, flood mitigation, urban heat islands, Sendai Framework.</li>
                    <li>• <strong>Internal Security:</strong> Left Wing Extremism (Naxalism), Northeast insurgency, terrorism financing, Money Laundering (PMLA).</li>
                    <li>• <strong>Cyber Security & Border Management:</strong> Coastal security, illegal migration, drone warfare, cyber attacks on critical infrastructure.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedGs === 'gs4' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-purple-300">Section A: Ethics & Human Interface</h3>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Ethics in Public & Private Life:</strong> Conscience as a source of moral guidance, moral philosophies (Deontology vs Utilitarianism vs Virtue Ethics).</li>
                    <li>• <strong>Emotional Intelligence (EI):</strong> Concepts, emotional self-regulation, empathy in public governance.</li>
                    <li>• <strong>Attitude & Moral Conviction:</strong> Social influence, persuasion principles, reducing prejudices.</li>
                    <li>• <strong>Contributions of Thinkers:</strong> Gandhi (Trusteeship, Talisman), Socrates, Plato, Aristotle, Swami Vivekananda, Ambedkar, Kant.</li>
                    <li>• <strong>Probity in Governance:</strong> Anti-corruption mechanisms, Lokpal, Whistleblowers protection, code of conduct vs code of ethics.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-purple-300">Section B: Ethical Case Studies (120 Marks)</h3>
                  <p className="text-xs text-slate-400">
                    6 real-life administrative dilemmas where the officer must balance law, human compassion, political pressure, and institutional integrity.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5 space-y-1.5 text-xs">
                    <span className="font-bold text-purple-200">Framework to solve any Case Study:</span>
                    <p className="text-slate-300 font-mono text-[11px]">
                      1. Identify core ethical dilemma (e.g. Rule of Law vs Human Dignity)<br />
                      2. List key stakeholders (Self, public, marginalized, government)<br />
                      3. Enumerate options (Pros & Cons of each)<br />
                      4. Pick optimum course with moral justification & constitutional values
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STANDARD BOOKLIST */}
        {activeTab === 'booklist' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">The Ultimate Definitive UPSC CSE Booklist</h3>
                <p className="text-xs text-slate-400">Standard, vetted books trusted by toppers (AIR 1 to 100)</p>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by subject or author..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none w-48 sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { subject: 'Indian Polity', title: 'Indian Polity by M. Laxmikanth', badge: 'Must Read Bible', desc: 'Cover cover-to-cover at least 6-8 times. Solve chapter-end MCQs.' },
                { subject: 'Modern History', title: 'A Brief History of Modern India (Spectrum) by Rajiv Ahir', badge: 'Concise & High Yield', desc: 'Detailed coverage of freedom struggle, Governor Generals, and movements.' },
                { subject: 'Ancient & Medieval', title: 'Old NCERTs (RS Sharma & Satish Chandra) + Tamil Nadu Class 11', badge: 'Conceptual Base', desc: 'Focus on administrative terms, temple styles, and socio-economic life.' },
                { subject: 'Art & Culture', title: 'Indian Art and Culture by Nitin Singhania', badge: 'Visual & Tabular', desc: 'Combine with NCERT Class 11 Fine Arts (An Introduction to Indian Art).' },
                { subject: 'Geography', title: 'NCERTs Class 11 & 12 + Certificate Physical & Human Geography by GC Leong', badge: 'Diagram Heavy', desc: 'Essential for physical geography concepts, climatic zones, and mapping.' },
                { subject: 'Economy', title: 'Indian Economy by Vivek Singh / Ramesh Singh + Mrunal Patel Handouts', badge: 'Core Concepts', desc: 'Focus on Banking, Money supply, Balance of Payments, Budget & Survey.' },
                { subject: 'Environment', title: 'Environment by Shankar IAS Academy / PMFIAS', badge: 'High Weightage', desc: 'National parks, Ramsar sites, IUCN Red list status, Wildlife Protection Act.' },
                { subject: 'Ethics (GS-4)', title: 'Lexicon for Ethics, Integrity & Aptitude / DK Balaji IAS', badge: 'Case Studies', desc: 'Definitions with real administrative examples, moral quotes, and diagrams.' },
                { subject: 'Current Affairs', title: 'The Hindu or The Indian Express (Daily) + Monthly Compilations', badge: 'Daily Habit', desc: 'Read editorials actively with an analytical perspective; make crisp digital notes.' }
              ]
                .filter(b => !searchFilter || b.subject.toLowerCase().includes(searchFilter.toLowerCase()) || b.title.toLowerCase().includes(searchFilter.toLowerCase()))
                .map((book, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-amber-400 font-bold">{book.subject}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-white/5 font-semibold">
                          {book.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{book.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{book.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Standard UPSC Reference</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: MAINS ANSWER MASTERY */}
        {activeTab === 'mains' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Mains Scoring Formula (1750 Marks)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How High Scorers Structure GS Answers (10-Marker & 15-Marker)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                An examiner checks ~50 copies per day and spends only 2-3 minutes on your answer.
                Clean headings, bullet points, flowcharts, data points, and constitutional articles make your answer visually irresistible!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-amber-400">1. Introduction (15-20%)</span>
                  <p className="text-xs text-slate-300">
                    Never write a generic intro. Use either:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• Exact constitutional Article/Supreme Court ruling</li>
                    <li>• Hard fact/data (NITI Aayog / RBI / NFHS-5)</li>
                    <li>• Crisp definition of key terms in question</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-cyan-400">2. Body: P.E.S.T.L.E (70%)</span>
                  <p className="text-xs text-slate-300">
                    Break answer into multi-dimensional sub-headings:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• <strong>P</strong>olitical / Institutional issues</li>
                    <li>• <strong>E</strong>conomic & Financial feasibility</li>
                    <li>• <strong>S</strong>ocial & Cultural impact</li>
                    <li>• <strong>T</strong>echnological solutions & <strong>L</strong>egal aspects</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-emerald-400">3. Way Forward / Conclusion</span>
                  <p className="text-xs text-slate-300">
                    Always end on an optimistic, forward-looking note:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• Connect to UN Sustainable Development Goals (SDGs)</li>
                    <li>• Quote committee recommendations (e.g. 2nd ARC)</li>
                    <li>• Constitutional vision / Amrit Kaal 2047</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Model Question & Topper's Template */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 font-mono">SAMPLE GS-2 MODEL QUESTION</span>
                <span className="text-xs text-slate-400">10 Marks · 150 Words</span>
              </div>
              <h3 className="text-base font-bold text-white">
                "The Governor's office in India was intended to act as a bridge between the Centre and the States, but has increasingly become an arena of partisan conflict. Critically examine."
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3 font-mono text-xs text-slate-300">
                <div className="text-amber-300 font-bold">• IDEAL INTRODUCTION:</div>
                <p className="pl-3 border-l-2 border-amber-500 text-slate-300">
                  Article 153 mandates a Governor for each state. While Dr. B.R. Ambedkar visualized the Governor as an impartial constitutional umpire, recent friction over reserving bills (Article 200) and discretionary powers (Article 163) has raised federal concerns.
                </p>

                <div className="text-cyan-300 font-bold">• CORE CONCERNS (CRITICAL EXAMINATION):</div>
                <ul className="pl-3 border-l-2 border-cyan-500 space-y-1 text-slate-300">
                  <li>1. <strong>Delay in Assent to Bills:</strong> Indefinite withholding of state legislation (Tamil Nadu & Kerala Governor disputes).</li>
                  <li>2. <strong>Discretion in hung assemblies:</strong> Partisan invocation of Article 356 and timing in inviting leaders to form government (Shamsher Singh case).</li>
                  <li>3. <strong>Appointment as Chancellors:</strong> Tussles with state universities regarding Vice-Chancellor appointments.</li>
                </ul>

                <div className="text-emerald-300 font-bold">• WAY FORWARD & JUDICIAL PRONOUNCEMENTS:</div>
                <ul className="pl-3 border-l-2 border-emerald-500 space-y-1 text-slate-300">
                  <li>• <strong>Sarkaria Commission (1983):</strong> Governor must be detached, eminent personality from outside state.</li>
                  <li>• <strong>Punchhi Commission (2010):</strong> Governor should be removed only through a state legislature impeachment process.</li>
                  <li>• <strong>BP Singhal (2010):</strong> Cannot remove Governor arbitrarily with change of regime at Centre.</li>
                  <li>• <strong>Conclusion:</strong> Restoring constitutional morality and healthy cooperative federalism is vital for India's democratic fabric.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 12-MONTH PLAN & CSAT */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Phase-by-Phase Execution
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                12-Month Battle-Tested Study Timeline
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                Civil services preparation is a marathon, not a sprint. Follow this rigorous 4-phase framework to finish the syllabus 2 times before Prelims!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-amber-400 font-mono">MONTHS 1 - 3</span>
                  <h4 className="text-sm font-bold text-white">Foundation & NCERTs</h4>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• Class 6-12 NCERTs (Hist, Geo, Polity, Eco)</li>
                    <li>• Start reading The Hindu / IE daily</li>
                    <li>• Finalize Optional subject choice</li>
                    <li>• Learn syllabus keywords by heart</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">MONTHS 4 - 7</span>
                  <h4 className="text-sm font-bold text-white">Standard Books + Optional</h4>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• Laxmikanth, Spectrum, Shankar IAS, GC Leong</li>
                    <li>• Complete 70% of Optional syllabus</li>
                    <li>• Begin 2 answer writing per day</li>
                    <li>• Consolidate short revision notes</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-orange-400 font-mono">MONTHS 8 - 10</span>
                  <h4 className="text-sm font-bold text-white">Mains Test Series & Ethics</h4>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• Full length GS 1, 2, 3, 4 answer writing</li>
                    <li>• Solve 30+ GS-4 Case Studies</li>
                    <li>• Write 6 full Essay tests (250 M)</li>
                    <li>• Economic Survey & Union Budget notes</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 font-mono">MONTHS 11 - 12</span>
                  <h4 className="text-sm font-bold text-white">Prelims Drill & CSAT</h4>
                  <ul className="text-xs text-slate-400 space-y-1 font-mono">
                    <li>• Exclusively Prelims focused mode</li>
                    <li>• Solve 40-50 Full Mock Tests with analysis</li>
                    <li>• CSAT practice 1 hour daily (avoid disqualification!)</li>
                    <li>• Revise maps, wildlife sanctuaries & facts</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily 8-Hour Timetable Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Ideal 8-Hour Daily Routine for an Aspirant</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                  <span className="font-bold text-amber-300">07:00 - 09:00 AM (2h)</span>
                  <p className="text-slate-300">Newspaper reading & Daily Editorial notes</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                  <span className="font-bold text-cyan-300">10:00 - 01:00 PM (3h)</span>
                  <p className="text-slate-300">Core Static GS Slot (Polity / Economy / History)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                  <span className="font-bold text-purple-300">03:00 - 05:30 PM (2.5h)</span>
                  <p className="text-slate-300">Optional Subject deep study & paper practice</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
                  <span className="font-bold text-emerald-300">07:00 - 08:30 PM (1.5h)</span>
                  <p className="text-slate-300">Answer Writing / MCQs & Day's Revision</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PRELIMS PYQ SIMULATOR */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Interactive Examination Simulator
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    UPSC Prelims GS-1 High Yield Quiz
                  </h2>
                  <p className="text-xs text-slate-300">
                    Real exam standard questions with negative marking (+2 for correct, -0.66 for incorrect).
                  </p>
                </div>

                {quizScore !== null && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <span className="text-[10px] text-amber-300 font-mono uppercase">Calculated Score</span>
                    <div className="text-2xl font-black text-amber-400">{quizScore} / 10</div>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-4 pt-2">
                {pyqQuestions.map((q, qIdx) => {
                  const selected = userAnswers[qIdx];
                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-amber-400 font-bold">QUESTION {qIdx + 1} · {q.subject}</span>
                        {showQuizReview && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            selected === q.correct
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {selected === q.correct ? 'Correct (+2)' : selected !== undefined ? 'Incorrect (-0.66)' : 'Unattempted (0)'}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-white leading-relaxed">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selected === optIdx;
                          let btnStyle = 'bg-slate-900 border-white/5 text-slate-300 hover:bg-slate-800';

                          if (showQuizReview) {
                            if (optIdx === q.correct) {
                              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isOptionSelected && optIdx !== q.correct) {
                              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                            }
                          } else if (isOptionSelected) {
                            btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-mono shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {showQuizReview && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-white/5 text-xs text-slate-300 space-y-1">
                          <span className="font-bold text-amber-300">Explanation & Elimination Note:</span>
                          <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  Reset Quiz
                </button>

                {!showQuizReview ? (
                  <button
                    onClick={handleCalculateScore}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-xs font-bold text-white transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    Submit & Evaluate Answers
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold">
                    Review mode active. Inspect explanations above.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
