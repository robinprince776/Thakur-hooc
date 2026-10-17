import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Layers,
  HelpCircle
} from 'lucide-react';

export interface GitFlowAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const GitFlowApp: React.FC<GitFlowAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'rebase-merge' | 'cherry-pick' | 'reflog' | 'cheatsheet'>('rebase-merge');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">GitFlow Lab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  #gitflow · App #40
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visual Interactive Rebase vs Merge, Cherry-Pick, Reflog Disaster Recovery & Git Bisect
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
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            { id: 'rebase-merge', label: 'Rebase vs Merge Visualizer', icon: GitMerge },
            { id: 'cherry-pick', label: 'Cherry-Pick Simulator', icon: GitCommit },
            { id: 'reflog', label: 'Reflog Disaster Recovery', icon: RotateCcw },
            { id: 'cheatsheet', label: 'Pro Git Commands (50+)', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
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
        {activeTab === 'rebase-merge' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Git Merge */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">Strategy A</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                  git merge feature
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Non-Destructive Merge Commit</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Creates a new merge commit combining history. Non-destructive and preserves complete historical context and commit dates.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-slate-400">*   commit 89b1c7f (HEAD -&gt; main) Merge branch 'feature'</div>
                <div className="text-indigo-400">|\</div>
                <div className="text-indigo-400">| * commit d4e2a10 Add authentication middleware</div>
                <div className="text-indigo-400">| * commit c8f1b99 Create user login form</div>
                <div className="text-slate-400">* | commit a1b2c3d Update README</div>
                <div className="text-slate-400">|/</div>
                <div className="text-slate-400">* commit 0f9e8d7 Initial setup</div>
              </div>

              <div className="text-[11px] text-emerald-400">
                ✓ Best for public open-source repos & long-lived collaborative branches.
              </div>
            </div>

            {/* Git Rebase */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">Strategy B</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                  git rebase main
                </span>
              </div>
              <h3 className="text-base font-bold text-white">Linear History Fast-Forward</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Replays your feature branch commits onto the tip of main. Yields a perfectly flat, clean linear commit log with zero clutter.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-cyan-400">* commit 9e7f6a5 (HEAD -&gt; feature) Add authentication middleware</div>
                <div className="text-cyan-400">* commit 4b3c2d1 Create user login form</div>
                <div className="text-slate-400">* commit a1b2c3d (main) Update README</div>
                <div className="text-slate-400">* commit 0f9e8d7 Initial setup</div>
              </div>

              <div className="text-[11px] text-amber-400">
                ⚠️ Golden Rule: Never rebase commits that you have already pushed to a shared public branch!
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cherry-pick' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Interactive Cherry-Pick Simulator</h3>
              <p className="text-xs text-slate-400">
                Apply a specific commit from one branch onto another without merging the entire branch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-indigo-400 font-bold">Scenario: Hotfix Extraction</span>
              <p className="text-xs text-slate-300">
                You fixed a critical payment bug in a massive experimental branch (commit <code className="text-cyan-300 font-mono">c789def</code>).
                You want only that specific commit on production main without bringing in unfinished experimental code.
              </p>

              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                <code className="text-xs font-mono text-emerald-400">git checkout main && git cherry-pick c789def</code>
                <button
                  onClick={() => copyToClipboard('git checkout main && git cherry-pick c789def')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5 transition-all"
                >
                  {copiedCmd === 'git checkout main && git cherry-pick c789def' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reflog' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Git Reflog (Disaster Recovery)</h3>
              <p className="text-xs text-slate-400">
                Accidentally deleted your branch with <code className="text-rose-400 font-mono">git branch -D</code> or did a bad <code className="text-rose-400 font-mono">git reset --hard</code>?
                Reflog tracks every single HEAD pointer movement locally!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-500"># Run this to inspect your local history:</div>
              <div className="text-white">$ git reflog</div>
              <div className="text-indigo-400">7f3a19b HEAD@&#123;0&#125;: reset: moving to HEAD~1</div>
              <div className="text-emerald-400">8b2c45e HEAD@&#123;1&#125;: commit: Critical production security patch</div>
              <div className="text-slate-400">1a9d82f HEAD@&#123;2&#125;: checkout: moving from dev to main</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-white">How to restore the deleted commit:</span>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <code className="text-xs font-mono text-cyan-400">git checkout -b recovered-branch 8b2c45e</code>
                <button
                  onClick={() => copyToClipboard('git checkout -b recovered-branch 8b2c45e')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white flex items-center gap-1.5 transition-all"
                >
                  {copiedCmd === 'git checkout -b recovered-branch 8b2c45e' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Nothing is ever truly lost in Git until the garbage collector runs (typically 30-90 days)!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cheatsheet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Stash Uncommitted Work',
                cmd: 'git stash push -m "work in progress" && git stash pop',
                desc: 'Safely shelve dirty working directory without committing.'
              },
              {
                title: 'Interactive Rebase (Squash Commits)',
                cmd: 'git rebase -i HEAD~3',
                desc: 'Clean up ugly "fix typo", "test" commits into a single clean commit before PR.'
              },
              {
                title: 'Binary Search for Bugs (Git Bisect)',
                cmd: 'git bisect start && git bisect bad && git bisect good v1.0.0',
                desc: 'Automated binary search through commit history to find which exact commit introduced a bug.'
              },
              {
                title: 'Undo Last Commit Keeping Changes',
                cmd: 'git reset --soft HEAD~1',
                desc: 'Uncommits the changes but leaves files staged and untouched.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block">{item.title}</span>
                <p className="text-xs text-slate-300">{item.desc}</p>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <code className="text-xs font-mono text-indigo-300 truncate">{item.cmd}</code>
                  <button
                    onClick={() => copyToClipboard(item.cmd)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-white flex items-center gap-1 transition-all shrink-0 ml-2"
                  >
                    {copiedCmd === item.cmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
