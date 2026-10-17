import React, { useState, useMemo } from 'react';
import {
  Server,
  ArrowRight,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  Shield,
  Box,
  Cpu
} from 'lucide-react';

export interface ContainersAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const ContainersApp: React.FC<ContainersAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'docker' | 'k8s' | 'hardening'>('docker');

  // Docker State
  const [techStack, setTechStack] = useState<'node' | 'python' | 'go'>('node');
  const [appPort, setAppPort] = useState(3000);
  const [copied, setCopied] = useState(false);

  // K8s State
  const [k8sAppName, setK8sAppName] = useState('web-api');
  const [k8sReplicas, setK8sReplicas] = useState(3);

  const dockerfileCode = useMemo(() => {
    if (techStack === 'node') {
      return `# Multi-Stage Hardened Production Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER nonroot
EXPOSE ${appPort}
CMD ["dist/main.js"]`;
    }
    if (techStack === 'go') {
      return `# Multi-Stage Static Go Binary
FROM golang:1.22-alpine AS builder
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /bin/server .

FROM scratch
COPY --from=builder /bin/server /bin/server
USER 10001:10001
EXPOSE ${appPort}
ENTRYPOINT ["/bin/server"]`;
    }
    return `# Production Python Hardened Dockerfile
FROM python:3.11-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY . .
RUN useradd -u 10001 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE ${appPort}
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:${appPort}", "app:app"]`;
  }, [techStack, appPort]);

  const k8sYamlCode = useMemo(() => {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${k8sAppName}
  labels:
    app: ${k8sAppName}
spec:
  replicas: ${k8sReplicas}
  selector:
    matchLabels:
      app: ${k8sAppName}
  template:
    metadata:
      labels:
        app: ${k8sAppName}
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
      containers:
      - name: ${k8sAppName}
        image: registry.internal.company/${k8sAppName}:v1.0.0
        ports:
        - containerPort: ${appPort}
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: ${appPort}
          initialDelaySeconds: 15
          periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: ${k8sAppName}-svc
spec:
  type: ClusterIP
  selector:
    app: ${k8sAppName}
  ports:
  - port: 80
    targetPort: ${appPort}`;
  }, [k8sAppName, k8sReplicas, appPort]);

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Box className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Docker &amp; K8s Architect
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Cloud Native
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Hardened multi-stage Dockerfile generator &amp; Kubernetes deployment manifests
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

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'docker', label: '1. 🐳 Hardened Dockerfile Generator', icon: Box },
              { id: 'k8s', label: '2. ☸️ Kubernetes YAML Manifests', icon: Server },
              { id: 'hardening', label: '3. 🛡️ Container Security Checklist', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'docker' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Multi-Stage Hardened Dockerfile Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Language / Runtime:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'node', label: 'Node.js 20' },
                      { id: 'python', label: 'Python 3.11' },
                      { id: 'go', label: 'Golang 1.22' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTechStack(t.id as any)}
                        className={`p-2 rounded-xl border font-bold cursor-pointer ${
                          techStack === t.id ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Application Port (EXPOSE):</label>
                  <input
                    type="number"
                    value={appPort}
                    onChange={(e) => setAppPort(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Output Preview */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span>Dockerfile Output</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dockerfileCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
                  {dockerfileCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'k8s' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Production Kubernetes (K8s) Deployment &amp; Service Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Deployment App Name:</label>
                  <input
                    type="text"
                    value={k8sAppName}
                    onChange={(e) => setK8sAppName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Pod Replicas (HA): {k8sReplicas}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={k8sReplicas}
                    onChange={(e) => setK8sReplicas(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                <div className="text-slate-400 border-b border-slate-800 pb-2">Kubernetes YAML (k8s-manifest.yaml)</div>
                <pre className="text-emerald-400 text-[11px] overflow-x-auto leading-relaxed max-h-[350px]">
                  {k8sYamlCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hardening' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">Container Security Best Practices</h2>
            <div className="space-y-3 font-mono">
              {[
                { title: 'Non-Root User Execution', desc: 'Never run containers as root (UID 0). Use distroless or specify `USER nonroot`.' },
                { title: 'Drop Linux Capabilities', desc: 'Add `capabilities.drop: ["ALL"]` in pod security context to stop container escapes.' },
                { title: 'Read-Only Root Filesystem', desc: 'Enforce `readOnlyRootFilesystem: true`. Use ephemeral emptyDir for temporary cache.' },
                { title: 'No Privilege Escalation', desc: 'Set `allowPrivilegeEscalation: false` to disable SUID binary exploits inside the pod.' }
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="font-bold text-cyan-400 font-sans">{c.title}</span>
                  <p className="text-slate-300 font-sans text-[11px]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
