import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Building2,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface PlacementPrepProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const PlacementPrepApp: React.FC<PlacementPrepProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'aptitude' | 'hr'>('companies');
  const [selectedCompany, setSelectedCompany] = useState<string>('TCS');
  const [expandedAptitudeId, setExpandedAptitudeId] = useState<number | null>(null);

  const companyData: Record<string, { role: string; rounds: string[]; hotTopics: string[]; questions: string[] }> = {
    TCS: {
      role: 'Ninja / Digital Associate Engineer',
      rounds: ['TCS NQT (Foundation + Advanced Coding)', 'Technical Interview', 'HR & Managerial Round'],
      hotTopics: ['C Programming', 'Arrays & Strings', 'DBMS Joins', 'OOP in Java/Python', 'Basic Cloud'],
      questions: [
        'Write a program to find the second highest element in an array without sorting.',
        'Explain the difference between Primary Key, Candidate Key, and Unique Key.',
        'What happens when you type a URL into a browser address bar and press Enter?',
        'How does Java handle Garbage Collection and Memory Leaks?'
      ]
    },
    Infosys: {
      role: 'Systems Engineer / Specialist Programmer',
      rounds: ['Online Assessment (Reasoning, Verbal, Pseudocode, Puzzle)', 'Technical Interview', 'HR Round'],
      hotTopics: ['Pseudocode Tracing', 'Recursion', 'Time Complexity', 'SQL Queries', 'SDLC Models'],
      questions: [
        'Reverse a linked list using iterative and recursive approaches.',
        'What is method overloading vs method overriding? Give real-world examples.',
        'Explain Deadlock in OS and the four Coffman conditions.',
        'Write an SQL query to find the Nth highest salary using DENSE_RANK().'
      ]
    },
    Wipro: {
      role: 'Project Engineer (Elite NLTH)',
      rounds: ['Aptitude + Essay Writing + Coding', 'Technical + HR Combo Interview'],
      hotTopics: ['String Manipulation', 'Basic DSA', 'Operating System Basics', 'Networking OSI Layers'],
      questions: [
        'Explain TCP 3-Way Handshake with SYN, SYN-ACK, ACK packet exchange.',
        'What are ACID properties in Database Management Systems?',
        'Differentiate between Process and Thread with context switching costs.',
        'Write a program to check if two given strings are Anagrams of each other.'
      ]
    },
    Accenture: {
      role: 'Associate Software Engineer (ASE)',
      rounds: ['Cognitive & Technical Assessment', 'Coding Round', 'Communication Assessment', 'HR Interview'],
      hotTopics: ['MS Office & Cloud Basics', 'Network Security', 'HTML/CSS/JS', 'Logical Reasoning'],
      questions: [
        'Explain the concept of REST APIs and status codes (200, 400, 404, 500).',
        'What is Normalization? Explain up to 3NF with an example.',
        'How does public key cryptography work in SSL/TLS certificates?',
        'What are the advantages of Microservices architecture over Monolithic?'
      ]
    }
  };

  const aptitudeQuestions = [
    {
      id: 1,
      category: 'Quantitative',
      question: 'A can complete a project in 12 days and B in 24 days. Working together, in how many days will they finish the project?',
      answer: '8 Days',
      formula: 'Work per day: 1/12 + 1/24 = 3/24 = 1/8. Therefore total days = 8.'
    },
    {
      id: 2,
      category: 'Logical Reasoning',
      question: 'In a code language, SYSTEM is written as SYSMET. How will FRACTION be written?',
      answer: 'ARFCNOIT',
      formula: 'Pattern: The word is split into two halves, and each half is reversed independently.'
    },
    {
      id: 3,
      category: 'Quantitative',
      question: 'A train 180 meters long crosses a pole in 9 seconds. What is the speed of the train in km/h?',
      answer: '72 km/h',
      formula: 'Speed = Distance / Time = 180m / 9s = 20 m/s. Convert to km/h: 20 * (18/5) = 72 km/h.'
    }
  ];

  const hrQuestions = [
    {
      question: 'Tell me about yourself (60-Second Pitch)',
      tip: 'Use the Present-Past-Future formula: 1) What you study right now (BCA Final Year, key skills), 2) Highlight projects you built, 3) Why this company aligns with your career goals.'
    },
    {
      question: 'Why should we hire you as a BCA fresher over B.Tech graduates?',
      tip: 'Highlight hands-on practical focus: "BCA has given me direct, intensive software development training with continuous coding, database administration, and web architecture from day one."'
    },
    {
      question: 'Where do you see yourself in 3 to 5 years?',
      tip: 'Express ambition to grow technically into a Senior Full-Stack or Cloud Solutions Engineer while taking ownership of end-to-end production systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">BCA Placement Prep Hub</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  TCS · Infosys · Wipro · Accenture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Company recruitment patterns, aptitude problem solvers, and winning HR interview scripts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 spring-press cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 spring-press cursor-pointer"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-4 py-2 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all spring-press cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'companies'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Top IT Companies</span>
          </button>

          <button
            onClick={() => setActiveTab('aptitude')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all spring-press cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'aptitude'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Aptitude & Reasoning</span>
          </button>

          <button
            onClick={() => setActiveTab('hr')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all spring-press cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hr'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>3. HR Round Winning Formulas</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: COMPANIES */}
        {activeTab === 'companies' && (
          <div className="space-y-6 animate-fade-in">
            {/* Company Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['TCS', 'Infosys', 'Wipro', 'Accenture'].map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedCompany(comp)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all spring-press cursor-pointer ${
                    selectedCompany === comp
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'glass-card border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>

            {/* Selected Company Details */}
            {(() => {
              const comp = companyData[selectedCompany];
              return (
                <div className="p-6 rounded-3xl glass-card border-white/10 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-white">{selectedCompany} Placement Guide</h2>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        Target Role: {comp.role}
                      </span>
                    </div>
                  </div>

                  {/* Recruitment Rounds */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Recruitment Process Rounds:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {comp.rounds.map((round, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs text-slate-200 flex items-center gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{round}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hot Technical Topics */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Frequently Tested Topics:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {comp.hotTopics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Most Asked Technical Questions */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Frequently Asked Technical Questions:
                    </h3>
                    <div className="space-y-2">
                      {comp.questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-200 font-sans flex items-start gap-2.5"
                        >
                          <span className="text-emerald-400 font-mono font-bold">Q{idx + 1}:</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: APTITUDE */}
        {activeTab === 'aptitude' && (
          <div className="space-y-4 animate-fade-in">
            {aptitudeQuestions.map((q) => {
              const isExpanded = expandedAptitudeId === q.id;
              return (
                <div key={q.id} className="p-5 rounded-3xl glass-card border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {q.category}
                    </span>
                    <button
                      onClick={() => setExpandedAptitudeId(isExpanded ? null : q.id)}
                      className="text-xs text-cyan-400 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Solution' : 'View Solution'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-white">{q.question}</p>

                  {isExpanded && (
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5 font-mono text-xs animate-fade-in">
                      <div className="text-emerald-400 font-bold">Correct Answer: {q.answer}</div>
                      <div className="text-slate-400 leading-relaxed">Step-by-Step Logic: {q.formula}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: HR ROUND */}
        {activeTab === 'hr' && (
          <div className="space-y-4 animate-fade-in">
            {hrQuestions.map((hr, idx) => (
              <div key={idx} className="p-5 rounded-3xl glass-card border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <span>{idx + 1}.</span>
                  <span>"{hr.question}"</span>
                </h3>
                <p className="text-xs text-slate-200 bg-slate-950/70 p-3 rounded-2xl border border-white/5 leading-relaxed">
                  💡 <strong>Winning Strategy & Key Points:</strong> {hr.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
