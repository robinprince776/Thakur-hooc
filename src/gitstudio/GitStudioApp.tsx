import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  AlertTriangle,
  RotateCcw,
  Terminal,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Code
} from 'lucide-react';

interface GitEmergency {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  problem: string;
  solutionSteps: string[];
  exactCommand: string;
}

const GIT_EMERGENCIES: GitEmergency[] = [
  {
    id: 'e-1',
    title: 'Accidentally Committed to "main" Instead of a Feature Branch',
    severity: 'High',
    problem: 'You made commits directly on main branch without creating a feature branch first.',
    solutionSteps: [
      'Create and switch to a new feature branch (it retains your recent commits).',
      'Switch back to main.',
      'Reset main back to where it was before your recent commits.'
    ],
    exactCommand: `git branch feature-my-feature
git reset --hard origin/main
git checkout feature-my-feature`
  },
  {
    id: 'e-2',
    title: 'Undo Last Commit But Keep All File Changes',
    severity: 'Medium',
    problem: 'You committed too early or forgot to include a file, and want to uncommit without losing code.',
    solutionSteps: [
      'Perform a soft reset to HEAD~1.',
      'All your edited files remain safely staged in your working directory.',
      'Make necessary adjustments, then commit again.'
    ],
    exactCommand: `git reset --soft HEAD~1`
  },
  {
    id: 'e-3',
    title: 'Discard All Local Uncommitted Changes (Scrap Everything)',
    severity: 'High',
    problem: 'Your experimental code is completely broken and you want to restore the clean state of the last commit.',
    solutionSteps: [
      'Restore all tracked files back to HEAD.',
      'Clean all untracked files and directories forcefully.'
    ],
    exactCommand: `git restore .
git clean -fd`
  },
  {
    id: 'e-4',
    title: 'Fix "Detached HEAD" State',
    severity: 'Medium',
    problem: 'You checked out a specific commit hash rather than a branch name and now commits are orphaned.',
    solutionSteps: [
      'Create a new branch from your current detached position to save your progress.',
      'Switch cleanly to that branch.'
    ],
    exactCommand: `git checkout -b temp-save-branch
git status`
  },
  {
    id: 'e-5',
    title: 'Resolve Merge Conflicts Step-by-Step',
    severity: 'High',
    problem: 'Git merge paused with "<<<<<<< HEAD ======= >>>>>>> branch" conflict markers in files.',
    solutionSteps: [
      'Run git status to see the list of unmerged files.',
      'Open each file, remove conflict markers and keep the desired code.',
      'Stage the resolved files and finalize the merge.'
    ],
    exactCommand: `git status
# (Edit conflict files manually)
git add .
git commit -m "Merge resolved"`
  },
  {
    id: 'e-6',
    title: 'Temporarily Stash Unfinished Work to Switch Branches',
    severity: 'Low',
    problem: 'Git won\'t let you checkout another branch because you have uncommitted changes.',
    solutionSteps: [
      'Push your changes onto the hidden Git stash stack.',
      'Checkout your target branch and do what you need.',
      'Return to your branch and pop your stashed changes back.'
    ],
    exactCommand: `git stash push -m "WIP feature"
git checkout main
# (When returning)
git checkout feature-branch
git stash pop`
  }
];

const GIT_CHEAT_SHEET = [
  { category: 'Branching', cmd: 'git checkout -b <branch-name>', desc: 'Create and immediately switch to a new branch.' },
  { category: 'Branching', cmd: 'git branch -d <branch-name>', desc: 'Safely delete a local branch that has been merged.' },
  { category: 'Branching', cmd: 'git branch -D <branch-name>', desc: 'Force delete a local branch even if unmerged.' },
  { category: 'History', cmd: 'git log --oneline --graph --decorate --all', desc: 'Visual ASCII branch tree of entire commit history.' },
  { category: 'History', cmd: 'git diff HEAD~1 HEAD', desc: 'Inspect exact line diff introduced by the last commit.' },
  { category: 'Remotes', cmd: 'git remote -v', desc: 'List all configured remote repository URLs.' },
  { category: 'Remotes', cmd: 'git fetch origin --prune', desc: 'Sync remote branches and prune deleted remote refs locally.' },
  { category: 'Advanced', cmd: 'git cherry-pick <commit-hash>', desc: 'Apply the changes from a single specific commit onto current branch.' },
  { category: 'Advanced', cmd: 'git rebase -i HEAD~3', desc: 'Interactive rebase to squash, edit, or reorder the last 3 commits.' }
];

export const GitStudioApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emergencies' | 'pipeline' | 'cheatsheet'>('emergencies');
  const [copied, setCopied] = useState(false);

  // Search
  const [emergencySearch, setEmergencySearch] = useState('');
  const [cheatSearch, setCheatSearch] = useState('');

  // Pipeline Builder State
  const [lang, setLang] = useState('node');
  const [includeLint, setIncludeLint] = useState(true);
  const [includeTest, setIncludeTest] = useState(true);
  const [includeDocker, setIncludeDocker] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedPipeline = useMemo(() => {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup ${lang === 'node' ? 'Node.js' : lang === 'python' ? 'Python' : 'Go'}
        uses: actions/setup-${lang === 'node' ? 'node@v4' : lang === 'python' ? 'python@v5' : 'go@v5'}
        with:
          ${lang === 'node' ? "node-version: '20'\n          cache: 'npm'" : lang === 'python' ? "python-version: '3.11'\n          cache: 'pip'" : "go-version: '1.22'"}

      - name: Install Dependencies
        run: ${lang === 'node' ? 'npm ci' : lang === 'python' ? 'pip install -r requirements.txt' : 'go mod download'}${
          includeLint
            ? `

      - name: Code Quality & Linting
        run: ${lang === 'node' ? 'npm run lint --if-present' : lang === 'python' ? 'flake8 .' : 'golangci-lint run'}`
            : ''
        }${
          includeTest
            ? `

      - name: Run Test Suite
        run: ${lang === 'node' ? 'npm test --if-present' : lang === 'python' ? 'pytest' : 'go test -v ./...'}`
            : ''
        }

      - name: Compile / Build
        run: ${lang === 'node' ? 'npm run build --if-present' : lang === 'python' ? 'python -m compileall .' : 'go build -o app .'}${
          includeDocker
            ? `

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Container Image
        run: docker build -t myapp:\${{ github.sha }} .`
            : ''
        }`;
  }, [lang, includeLint, includeTest, includeDocker]);

  const filteredEmergencies = useMemo(() => {
    return GIT_EMERGENCIES.filter(
      (e) =>
        e.title.toLowerCase().includes(emergencySearch.toLowerCase()) ||
        e.problem.toLowerCase().includes(emergencySearch.toLowerCase())
    );
  }, [emergencySearch]);

  const filteredCheatSheet = useMemo(() => {
    return GIT_CHEAT_SHEET.filter(
      (c) =>
        c.cmd.toLowerCase().includes(cheatSearch.toLowerCase()) ||
        c.desc.toLowerCase().includes(cheatSearch.toLowerCase())
    );
  }, [cheatSearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <GitBranch className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Git &amp; CI/CD Command Studio
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
                  Version Control
                </span>
              </h1>
              <p className="text-xs text-slate-400">Emergency Undo Assistant, Merge Solver &amp; Actions Builder</p>
            </div>
          </div>

          <a
            href="#bcaverse"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Back to Suite
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'emergencies', label: 'Git Conflict & Undo Assistant', icon: RotateCcw },
            { id: 'pipeline', label: 'GitHub Actions Pipeline Builder', icon: Terminal },
            { id: 'cheatsheet', label: 'Git Daily Workflow Cheat-Sheet', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'emergencies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={emergencySearch}
                  onChange={(e) => setEmergencySearch(e.target.value)}
                  placeholder="Search emergency (e.g. undo, detached)..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEmergencies.map((em) => (
                <div
                  key={em.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          em.severity === 'High'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        {em.severity} Urgency
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">{em.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{em.problem}</p>

                    <div className="space-y-1 pt-1 text-[11px] text-slate-400">
                      <strong className="text-slate-300 block mb-1">Resolution Steps:</strong>
                      {em.solutionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <pre className="font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                        {em.exactCommand}
                      </pre>
                      <button
                        onClick={() => handleCopy(em.exactCommand)}
                        className="p-1.5 text-slate-400 hover:text-white shrink-0 ml-2 cursor-pointer"
                        title="Copy command"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Workflow Parameters
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Runtime Language:</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="node">Node.js (JavaScript / TypeScript)</option>
                    <option value="python">Python 3 (pytest / flake8)</option>
                    <option value="go">Go / Golang</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeLint}
                      onChange={(e) => setIncludeLint(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Include Automated Linter Step</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeTest}
                      onChange={(e) => setIncludeTest(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Include Unit Test Runner Step</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeDocker}
                      onChange={(e) => setIncludeDocker(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Build Container Image with Docker Buildx</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    .github/workflows/main.yml
                  </span>
                  <button
                    onClick={() => handleCopy(generatedPipeline)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Workflow'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-amber-200 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed max-h-[460px]">
                  {generatedPipeline}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <div className="space-y-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cheatSearch}
                onChange={(e) => setCheatSearch(e.target.value)}
                placeholder="Search commands (e.g. cherry-pick, rebase)..."
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCheatSheet.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-700 mb-2 inline-block">
                      {item.category}
                    </span>
                    <p className="text-xs text-slate-300 mb-3">{item.desc}</p>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <code className="font-mono text-xs text-emerald-300 truncate select-all">{item.cmd}</code>
                    <button
                      onClick={() => handleCopy(item.cmd)}
                      className="p-1.5 text-slate-400 hover:text-white shrink-0 ml-2 cursor-pointer"
                      title="Copy command"
                    >
                      <Copy className="w-3.5 h-3.5" />
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
