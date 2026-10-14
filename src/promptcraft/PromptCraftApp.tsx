import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Search,
  BookOpen,
  DollarSign,
  Cpu,
  Layers,
  Wand2,
  FileCode,
  Shield,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  title: string;
  category: 'Coding' | 'Debugging' | 'Writing' | 'Analysis' | 'Learning';
  tags: string[];
  description: string;
  prompt: string;
}

const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: 'p-1',
    title: 'Senior Code Reviewer & Performance Auditor',
    category: 'Coding',
    tags: ['code-review', 'performance', 'security'],
    description: 'Reviews code line-by-line for memory leaks, edge cases, algorithmic complexity, and idiomatic standards.',
    prompt: `You are a Senior Principal Software Architect and Security Auditor.
Review the following code thoroughly:
[PASTE CODE HERE]

Structure your feedback as:
1. Executive Summary: Overall quality score (1-10) and architecture verdict.
2. Critical Bugs & Edge Cases: Missing null checks, memory leaks, concurrency issues, boundary violations.
3. Performance & Complexity: Current Time/Space complexity vs optimal solution ($O(N)$ vs $O(1)$).
4. Security Review: Injection vectors, input sanitization, safe standard compliance.
5. Refactored Production Code: Clean, commented, production-grade rewrite.`
  },
  {
    id: 'p-2',
    title: 'Defensive Security & Threat Modeling Expert',
    category: 'Analysis',
    tags: ['cybersecurity', 'threat-model', 'stride'],
    description: 'Generates STRIDE threat models and defensive mitigation architectures for an application.',
    prompt: `Act as a Lead Cybersecurity Engineer and Threat Modeling Specialist.
I am designing a system with the following architecture:
[DESCRIBE SYSTEM / ARCHITECTURE]

Please provide:
1. STRIDE Threat Analysis (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
2. Attack Surface Assessment: Exposed entry points, authentication mechanisms, data flows.
3. Prioritized Mitigation Roadmap: Immediate quick-wins vs long-term defense-in-depth implementations.
4. Security Checklist: Essential HTTP headers, TLS configurations, and access control policies.`
  },
  {
    id: 'p-3',
    title: 'C & Systems Programming Debugger',
    category: 'Debugging',
    tags: ['c-programming', 'pointers', 'memory'],
    description: 'Diagnoses Segmentation Faults, Valgrind memory leaks, and pointer arithmetic errors.',
    prompt: `You are a Systems Programming specialist in C and Linux Kernel development.
My C program has a bug or segmentation fault:
[PASTE C CODE AND ERROR LOGS / COMPILER WARNINGS]

Please explain:
1. Exact Root Cause: Step-by-step memory diagram of Stack/Heap at the moment of failure.
2. Why the compiler or runtime allowed this condition (e.g., dangling pointer, buffer overflow, uninitialized variable).
3. The minimal fix to prevent crashes.
4. Valgrind / GDB debugging commands to verify the resolution.`
  },
  {
    id: 'p-4',
    title: 'Full-Stack REST API Architect',
    category: 'Coding',
    tags: ['api-design', 'rest', 'architecture'],
    description: 'Designs clean, idempotent RESTful APIs with OpenAPI specs and error schemas.',
    prompt: `You are an API Design Architect following RESTful principles and RFC specifications.
Design the API endpoints for:
[DESCRIBE BUSINESS USE CASE / FEATURE]

Provide:
1. Resource URIs: Pluralized nouns, nested relationships, and HTTP methods (GET, POST, PUT, PATCH, DELETE).
2. Status Codes: Exact HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).
3. Request / Response JSON Schemas: Type annotations, validation constraints, and pagination patterns.
4. Standard Error Format: RFC 7807 Problem Details JSON format.`
  },
  {
    id: 'p-5',
    title: 'Docker & Multi-Stage Container Architect',
    category: 'Coding',
    tags: ['docker', 'devops', 'optimization'],
    description: 'Crafts lightweight, secure multi-stage Dockerfiles with non-root users.',
    prompt: `Act as a Senior DevOps and Container Security Specialist.
Create an optimized production Dockerfile and docker-compose.yml for:
[SPECIFY RUNTIME, FRAMEWORK & DATABASE, e.g. Node.js + PostgreSQL]

Requirements:
1. Multi-stage build to minimize image size (e.g. build stage vs slim/alpine production runner).
2. Non-root user for container security.
3. Proper layer caching (copy package files before source files).
4. HEALTHCHECK instruction and signal handling for graceful shutdown.
5. .dockerignore recommendations.`
  },
  {
    id: 'p-6',
    title: 'DSA Problem Solver & Time Complexity Optimizer',
    category: 'Learning',
    tags: ['dsa', 'leetcode', 'interview'],
    description: 'Breaks down tough LeetCode/algorithm problems from brute-force to optimal.',
    prompt: `Act as a Staff Software Engineer and Competitive Programming Coach.
Solve this algorithmic problem:
[PASTE PROBLEM STATEMENT & CONSTRAINTS]

Structure your response:
1. Intuition & Pattern Recognition: Which algorithmic paradigm applies (Two Pointers, Sliding Window, Monotonic Stack, DP, Graph)?
2. Brute Force Approach: Simple intuition, Time: $O(...)$, Space: $O(...)$.
3. Optimal Solution: Clear step-by-step logical breakthrough.
4. Clean Implementation in C++ / Python / Java with inline comments.
5. Dry Run Table: Trace inputs step-by-step with variables.
6. Edge Cases: Empty input, negative numbers, extreme scale constraints.`
  },
  {
    id: 'p-7',
    title: 'SQL Query Optimizer & Indexing Specialist',
    category: 'Coding',
    tags: ['sql', 'database', 'indexing'],
    description: 'Rewrites slow queries, analyzes EXPLAIN plans, and suggests composite indexes.',
    prompt: `You are a Principal Database Administrator specializing in PostgreSQL/MySQL.
Analyze this slow query and table schema:
[PASTE QUERY AND TABLE SCHEMAS]

Provide:
1. Query Performance Bottlenecks: Full table scans, inefficient JOINs, non-SARGable WHERE clauses.
2. Optimized Query Rewrite: Subquery elimination, CTE optimization, EXISTS vs IN.
3. Recommended Indexes: Specific CREATE INDEX statements (B-Tree, Hash, GIN) with column ordering rationale.
4. Expected EXPLAIN execution plan improvement.`
  },
  {
    id: 'p-8',
    title: 'Technical Documentation & Architecture Decision Record (ADR)',
    category: 'Writing',
    tags: ['documentation', 'adr', 'engineering'],
    description: 'Generates professional Architecture Decision Records (ADRs) for technical teams.',
    prompt: `Act as a Principal Engineer writing an Architecture Decision Record (ADR).
Decision context:
[DESCRIBE THE TECHNICAL CHOICE / TRADE-OFF, e.g., Choosing PostgreSQL vs MongoDB]

Follow this standard ADR format:
- Title: ADR-[Number]: [Short Title]
- Status: Accepted / Proposed
- Context: What is the problem, business drivers, and technical constraints?
- Decision: What architectural choice was selected?
- Alternatives Considered: Comparison matrix with pros/cons.
- Consequences: Positive outcomes, negative trade-offs, and mitigation strategies.`
  },
  {
    id: 'p-9',
    title: 'Regex Generator & Step-by-Step Explainer',
    category: 'Coding',
    tags: ['regex', 'pattern-matching', 'validation'],
    description: 'Creates robust regular expressions with lookahead/lookbehind and test cases.',
    prompt: `Act as a Regular Expression (Regex) Expert.
Create a regex to validate/extract:
[DESCRIBE PATTERN REQUIREMENTS, e.g., International Phone Numbers with Country Code]

Provide:
1. The Regex Pattern (PCRE / JavaScript compliant).
2. Token-by-Token Breakdown: Explain what each symbol, group, and quantifier does.
3. Flags to use: (g, i, m, s, u).
4. Test Cases Matrix: 5 valid examples and 5 invalid examples with rejection reasons.`
  },
  {
    id: 'p-10',
    title: 'Technical Viva & Exam Revision Coach',
    category: 'Learning',
    tags: ['exams', 'viva', 'bca-btech'],
    description: 'Simulates tough viva questions with concise, high-scoring answers.',
    prompt: `Act as a Strict University Professor conducting a viva examination for Computer Science.
Subject / Topic:
[SPECIFY TOPIC, e.g., Operating Systems: Paging and Virtual Memory]

Generate:
1. 5 High-Probability Viva Questions (ranging from foundational to trick edge-cases).
2. Model Answers for each question: Concise (under 3 sentences), accurate, using exact technical keywords.
3. The "Gotcha" trap examiners look for in candidate answers.`
  }
];

export const PromptCraftApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'estimator' | 'optimizer' | 'library'>('generator');
  const [selectedRole, setSelectedRole] = useState('Code Reviewer');
  const [taskDomain, setTaskDomain] = useState('Backend Systems');
  const [outputFormat, setOutputFormat] = useState('Markdown with Code Blocks');
  const [targetAudience, setTargetAudience] = useState('Senior Engineers');
  const [additionalConstraints, setAdditionalConstraints] = useState('No fluff, direct code examples, include edge-case analysis');
  const [copied, setCopied] = useState(false);

  // Estimator state
  const [calcText, setCalcText] = useState(
    'You are a senior full-stack software engineer. Explain the difference between process and thread in Linux kernel, including virtual memory mapping, task_struct, and clone() system call.'
  );

  // Optimizer state
  const [rawPrompt, setRawPrompt] = useState('write a python script to download images from a website');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');

  // Library filter
  const [libraryFilter, setLibraryFilter] = useState('All');
  const [librarySearch, setLibrarySearch] = useState('');

  // Generated System Prompt
  const generatedSystemPrompt = useMemo(() => {
    return `### SYSTEM ROLE INSTRUCTION:
You are an elite ${selectedRole} specializing in ${taskDomain}.

### TARGET AUDIENCE & TONE:
Communicate authoritatively for ${targetAudience}. Deliver accurate, direct, production-grade solutions without unnecessary conversational pleasantries.

### OUTPUT FORMAT:
${outputFormat}

### MANDATORY CONSTRAINTS:
1. ${additionalConstraints}
2. Always highlight time & space complexity ($O(N)$, $O(1)$) where applicable.
3. Point out subtle edge cases, concurrency hazards, and potential security considerations.
4. Use standard modern conventions and verified code practices.`;
  }, [selectedRole, taskDomain, outputFormat, targetAudience, additionalConstraints]);

  // Token calculations
  const tokenStats = useMemo(() => {
    const chars = calcText.length;
    const words = calcText.trim() ? calcText.trim().split(/\s+/).length : 0;
    // Heuristic: ~4 chars per token for English text + punctuation overhead
    const estimatedTokens = Math.max(0, Math.ceil(chars / 3.8));

    // Pricing per 1M tokens (approx current rates)
    const gpt4oCost = (estimatedTokens / 1_000_000) * 5.0; // $5/1M
    const claudeSonnetCost = (estimatedTokens / 1_000_000) * 3.0; // $3/1M
    const geminiFlashCost = (estimatedTokens / 1_000_000) * 0.15; // $0.15/1M
    const geminiProCost = (estimatedTokens / 1_000_000) * 1.25; // $1.25/1M

    return {
      chars,
      words,
      tokens: estimatedTokens,
      gpt4oCost,
      claudeSonnetCost,
      geminiFlashCost,
      geminiProCost
    };
  }, [calcText]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptimize = () => {
    if (!rawPrompt.trim()) return;
    const opt = `Act as an Expert Software Engineer and Automation Specialist.
Goal: Create a robust, production-grade script to: "${rawPrompt.trim()}".

Requirements:
1. Language & Libraries: Use modern, idiomatic libraries with error handling (requests/httpx, BeautifulSoup, or async aiohttp).
2. Robustness:
   - Handle HTTP 4xx/5xx status codes, network timeouts, and SSL verification.
   - Respect robots.txt and implement rate-limiting/delays to prevent IP bans.
   - Sanitize file names to avoid directory traversal or OS filename conflicts.
3. Code Structure:
   - Provide a modular, callable function with type hints and docstrings.
   - Include a \`__main__\` block with clear usage example.
4. Output: Provide the complete code in a Markdown block followed by instructions on required dependencies.`;
    setOptimizedPrompt(opt);
  };

  const filteredLibrary = useMemo(() => {
    return PROMPT_LIBRARY.filter((item) => {
      const matchesCat = libraryFilter === 'All' || item.category === libraryFilter;
      const matchesSearch =
        item.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.description.toLowerCase().includes(librarySearch.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(librarySearch.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [libraryFilter, librarySearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* App Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-cyan-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                PromptCraft Pro
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  AI Studio
                </span>
              </h1>
              <p className="text-xs text-slate-400">Professional LLM Prompt Engineering &amp; Cost Lab</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#bcaverse"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Back to Suite
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'generator', label: 'System Prompt Generator', icon: Wand2 },
            { id: 'estimator', label: 'Token & Cost Estimator', icon: DollarSign },
            { id: 'optimizer', label: 'Prompt Optimizer', icon: Layers },
            { id: 'library', label: 'Prompt Library (30+)', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  Role &amp; Parameters
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Specialist Role:
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option>Code Reviewer &amp; Performance Auditor</option>
                    <option>Pentester &amp; Offensive Security Researcher</option>
                    <option>Senior DevOps &amp; Cloud Infrastructure Architect</option>
                    <option>Data Analyst &amp; Visualization Specialist</option>
                    <option>University CS Professor &amp; Viva Examiner</option>
                    <option>Database Administrator &amp; Query Optimizer</option>
                    <option>Technical Documentation Writer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Technical Domain:
                  </label>
                  <input
                    type="text"
                    value={taskDomain}
                    onChange={(e) => setTaskDomain(e.target.value)}
                    placeholder="e.g. Linux Kernel, Node.js, OWASP Web Security"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Target Audience:
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option>Senior Engineers &amp; Tech Leads</option>
                    <option>BCA / BTech Computer Science Students</option>
                    <option>Product Managers &amp; Stakeholders</option>
                    <option>Bug Bounty Hunters &amp; Pentesters</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Output Format:
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option>Markdown with Code Blocks &amp; Bullet Points</option>
                    <option>Structured JSON Schema with Types</option>
                    <option>Step-by-Step Tutorial with Dry Run Table</option>
                    <option>Architecture Decision Record (ADR) Format</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Custom Constraints &amp; Directives:
                  </label>
                  <textarea
                    rows={3}
                    value={additionalConstraints}
                    onChange={(e) => setAdditionalConstraints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 resize-none font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex-1 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Generated System Prompt
                  </span>
                  <button
                    onClick={() => handleCopyText(generatedSystemPrompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>

                <div className="flex-1 p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 whitespace-pre-wrap leading-relaxed select-text overflow-y-auto max-h-[480px]">
                  {generatedSystemPrompt}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>
                    Paste this directly into the <strong>System Instruction</strong> field of Gemini, Claude, or ChatGPT to get 10x more accurate and structured technical answers.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estimator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Characters</span>
                <div className="text-2xl font-black text-white mt-1">{tokenStats.chars.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Word Count</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">{tokenStats.words.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Approx Tokens</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">~{tokenStats.tokens.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Context Usage</span>
                <div className="text-2xl font-black text-blue-400 mt-1">
                  {((tokenStats.tokens / 128000) * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-3">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Input Prompt or Code to Estimate:</span>
                  <button
                    onClick={() => setCalcText('')}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Clear Text
                  </button>
                </label>
                <textarea
                  rows={10}
                  value={calcText}
                  onChange={(e) => setCalcText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500 leading-relaxed resize-none shadow-inner"
                  placeholder="Paste your prompt, markdown, or code here..."
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Model Cost Comparison (Input)
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">Google Gemini 2.5 Flash</div>
                        <div className="text-[10px] text-slate-400">$0.15 / 1M tokens (Ultra Low Cost)</div>
                      </div>
                      <div className="font-mono font-bold text-emerald-400">
                        ${tokenStats.geminiFlashCost.toFixed(6)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">Google Gemini Pro</div>
                        <div className="text-[10px] text-slate-400">$1.25 / 1M tokens (Deep Reasoning)</div>
                      </div>
                      <div className="font-mono font-bold text-cyan-400">
                        ${tokenStats.geminiProCost.toFixed(6)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">Claude 3.5 Sonnet</div>
                        <div className="text-[10px] text-slate-400">$3.00 / 1M tokens</div>
                      </div>
                      <div className="font-mono font-bold text-blue-400">
                        ${tokenStats.claudeSonnetCost.toFixed(6)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div>
                        <div className="font-bold text-white">OpenAI GPT-4o</div>
                        <div className="text-[10px] text-slate-400">$5.00 / 1M tokens</div>
                      </div>
                      <div className="font-mono font-bold text-purple-400">
                        ${tokenStats.gpt4oCost.toFixed(6)}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 <em>Pro-Tip:</em> Token heuristic uses standard Byte-Pair Encoding averages (~3.8 to 4 chars per token). Exact tokenizer output may vary slightly by model vocab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'optimizer' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Prompt Structure Optimizer
              </h2>
              <p className="text-xs text-slate-300">
                Convert a basic one-line request into an exhaustive, context-rich multi-shot prompt with error handling, constraints, and standard format guidelines.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder="Enter raw prompt, e.g. 'write a python script to scrape data'..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 font-sans"
                />
                <button
                  onClick={handleOptimize}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Optimize</span>
                </button>
              </div>

              {optimizedPrompt && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Optimized Production Prompt:</span>
                    <button
                      onClick={() => handleCopyText(optimizedPrompt)}
                      className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
                    {optimizedPrompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Coding', 'Debugging', 'Writing', 'Analysis', 'Learning'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLibraryFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      libraryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search prompts by keyword..."
                  className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLibrary.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-slate-700">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.tags.map((t) => (
                          <span key={t} className="text-[9px] text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">Ready to Copy</span>
                    <button
                      onClick={() => handleCopyText(item.prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
