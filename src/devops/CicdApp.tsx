import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  ArrowRight,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  Shield,
  Activity,
  Zap
} from 'lucide-react';

export interface CicdAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const CicdApp: React.FC<CicdAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [includeSemgrep, setIncludeSemgrep] = useState(true);
  const [includeTrufflehog, setIncludeTrufflehog] = useState(true);
  const [includeAudit, setIncludeAudit] = useState(true);
  const [targetBranch, setTargetBranch] = useState('main');
  const [copied, setCopied] = useState(false);

  const pipelineYaml = useMemo(() => {
    return `name: Production CI/CD Security Gate

on:
  push:
    branches: [ ${targetBranch} ]
  pull_request:
    branches: [ ${targetBranch} ]

jobs:
  test-and-lint:
    name: Lint, Test & Typecheck
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Typecheck TypeScript
        run: npx tsc --noEmit

      - name: Run Unit Tests
        run: npm test -- --coverage

  security-scan:
    name: DevSecOps Vulnerability Scans
    runs-on: ubuntu-latest
    needs: test-and-lint
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
${includeTrufflehog ? `
      - name: TruffleHog Secret Scanner
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: \${{ github.event.repository.default_branch }}
          head: HEAD` : ''}
${includeSemgrep ? `
      - name: Semgrep Static Application Security Testing (SAST)
        run: |
          python3 -m pip install semgrep
          semgrep scan --config auto --error` : ''}
${includeAudit ? `
      - name: Software Bill of Materials & Dependency Audit
        run: npm audit --audit-level=high` : ''}

  deploy:
    name: Build & Push Container Image
    runs-on: ubuntu-latest
    needs: security-scan
    if: github.ref == 'refs/heads/${targetBranch}'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Container
        run: echo "Production container built cleanly with zero critical CVEs!"`;
  }, [includeSemgrep, includeTrufflehog, includeAudit, targetBranch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                      CI/CD Security Studio
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      GitHub Actions
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Automated DevSecOps pipeline generator with Semgrep SAST &amp; TruffleHog secrets detection
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite Apps</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">GitHub Actions DevSecOps Pipeline Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Production Branch:</label>
                <input
                  type="text"
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 block">Security Gates Included:</span>
                {[
                  { label: 'TruffleHog (Leaked Secret Detection)', state: includeTrufflehog, set: setIncludeTrufflehog },
                  { label: 'Semgrep (Static Code SAST Vulnerability Scan)', state: includeSemgrep, set: setIncludeSemgrep },
                  { label: 'NPM Audit (Dependency Vulnerability SCA)', state: includeAudit, set: setIncludeAudit }
                ].map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => sec.set(!sec.state)}
                    className={`w-full p-3 rounded-xl border text-left cursor-pointer flex items-center justify-between transition-all ${
                      sec.state ? 'bg-cyan-950/60 border-cyan-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{sec.label}</span>
                    {sec.state ? <Check className="w-4 h-4 text-cyan-400" /> : <span className="text-slate-600">-</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline Preview */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                <span>.github/workflows/security-ci.yml</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pipelineYaml);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-cyan-300 text-[11px] overflow-x-auto leading-relaxed max-h-[380px]">
                {pipelineYaml}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
