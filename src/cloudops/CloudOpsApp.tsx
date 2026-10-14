import React, { useState, useMemo } from 'react';
import {
  Cloud,
  Terminal,
  Cpu,
  Server,
  Layers,
  Copy,
  Check,
  Search,
  FileCode,
  Shield,
  Box,
  ArrowRight,
  GitBranch
} from 'lucide-react';

interface LinuxOneLiner {
  category: 'Performance' | 'Networking' | 'Storage & Memory' | 'Security & Firewall' | 'Logs & Systemd';
  command: string;
  description: string;
}

const LINUX_ONE_LINERS: LinuxOneLiner[] = [
  { category: 'Networking', command: 'sudo ss -tulpn | grep LISTEN', description: 'Show all active listening TCP/UDP ports and associated process names.' },
  { category: 'Networking', command: 'sudo lsof -i :8080', description: 'Find which exact process/PID is occupying port 8080.' },
  { category: 'Networking', command: 'curl -I https://example.com', description: 'Fetch HTTP response headers only without downloading page body.' },
  { category: 'Performance', command: 'top -b -n 1 | head -n 20', description: 'Snapshot top CPU and memory consuming processes non-interactively.' },
  { category: 'Performance', command: 'vmstat 1 5', description: 'Real-time virtual memory, process, and CPU usage report every 1 second.' },
  { category: 'Storage & Memory', command: 'df -h', description: 'Human-readable disk space usage across all mounted filesystems.' },
  { category: 'Storage & Memory', command: 'du -sh * | sort -hr | head -n 10', description: 'List top 10 largest directories and files in current folder.' },
  { category: 'Storage & Memory', command: 'free -m', description: 'Display total, used, and free RAM and Swap in megabytes.' },
  { category: 'Storage & Memory', command: 'sync && echo 3 | sudo tee /proc/sys/vm/drop_caches', description: 'Flush clean pagecache, dentries, and inodes from RAM (memory cleanup).' },
  { category: 'Security & Firewall', command: 'sudo ufw status verbose', description: 'Check status of Uncomplicated Firewall (UFW) and open ports.' },
  { category: 'Security & Firewall', command: 'sudo ufw allow 443/tcp', description: 'Open incoming HTTPS traffic on port 443.' },
  { category: 'Security & Firewall', command: 'find / -perm -4000 -type f 2>/dev/null', description: 'Audit all SUID binaries on system to spot privilege escalation risks.' },
  { category: 'Logs & Systemd', command: 'sudo journalctl -u nginx.service -f -n 100', description: 'Live stream last 100 logs for systemd service (e.g. nginx).' },
  { category: 'Logs & Systemd', command: 'sudo systemctl restart myapp && sudo systemctl status myapp', description: 'Safely restart service and immediately verify active (running) status.' }
];

export const CloudOpsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docker' | 'k8s' | 'linux' | 'cicd'>('docker');
  const [copied, setCopied] = useState(false);

  // Docker State
  const [selectedStack, setSelectedStack] = useState<'node' | 'react' | 'python' | 'go'>('node');
  const [includeCompose, setIncludeCompose] = useState(true);
  const [includeDb, setIncludeDb] = useState<'postgres' | 'mongo' | 'redis' | 'none'>('postgres');

  // K8s State
  const [k8sAppName, setK8sAppName] = useState('techmaster-api');
  const [k8sReplicas, setK8sReplicas] = useState(3);
  const [k8sPort, setK8sPort] = useState(3000);
  const [k8sImage, setK8sImage] = useState('ghcr.io/org/app:v1.0.0');

  // Linux Search
  const [linuxSearch, setLinuxSearch] = useState('');
  const [linuxCategory, setLinuxCategory] = useState('All');

  // CI/CD State
  const [ciRunner, setCiRunner] = useState<'github' | 'gitlab'>('github');
  const [ciLang, setCiLang] = useState('node');
  const [ciDockerBuild, setCiDockerBuild] = useState(true);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Dockerfile
  const dockerfileCode = useMemo(() => {
    if (selectedStack === 'node') {
      return `# Multi-Stage Production Dockerfile for Node.js
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
CMD ["node", "dist/server.js"]`;
    }

    if (selectedStack === 'react') {
      return `# Multi-Stage Dockerfile for React SPA + Nginx
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx Web Server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]`;
    }

    if (selectedStack === 'python') {
      return `# Production Dockerfile for Python FastAPI
FROM python:3.11-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim AS runner
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PATH="/root/.local/bin:$PATH"
COPY --from=builder /root/.local /root/.local
COPY . .
RUN useradd -m -u 1001 appuser
USER appuser
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`;
    }

    return `# Production Dockerfile for Go (Golang)
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

FROM scratch
WORKDIR /
COPY --from=builder /app/main /main
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
USER 10001:10001
ENTRYPOINT ["/main"]`;
  }, [selectedStack]);

  // Generate docker-compose.yml
  const composeCode = useMemo(() => {
    let dbService = '';
    if (includeDb === 'postgres') {
      dbService = `
  postgres:
    image: postgres:16-alpine
    container_name: db_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret_password
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data`;
    } else if (includeDb === 'mongo') {
      dbService = `
  mongo:
    image: mongo:7-jammy
    container_name: db_mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db`;
    } else if (includeDb === 'redis') {
      dbService = `
  redis:
    image: redis:7-alpine
    container_name: db_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data`;
    }

    return `version: '3.8'

services:
  web:
    build: .
    container_name: ${selectedStack}_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://admin:secret_password@postgres:5432/appdb
    depends_on:${includeDb !== 'none' ? `\n      - ${includeDb}` : ' []'}
${dbService}

volumes:${includeDb === 'postgres' ? '\n  pgdata:' : includeDb === 'mongo' ? '\n  mongodata:' : includeDb === 'redis' ? '\n  redisdata:' : ''}`;
  }, [selectedStack, includeDb]);

  // Generate K8s YAML
  const k8sManifest = useMemo(() => {
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
      containers:
      - name: ${k8sAppName}
        image: ${k8sImage}
        ports:
        - containerPort: ${k8sPort}
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: ${k8sPort}
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: ${k8sPort}
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
  - protocol: TCP
    port: 80
    targetPort: ${k8sPort}`;
  }, [k8sAppName, k8sReplicas, k8sPort, k8sImage]);

  // Generate CI/CD YAML
  const cicdCode = useMemo(() => {
    if (ciRunner === 'github') {
      return `name: Production CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint --if-present

      - name: Run Unit Tests
        run: npm test --if-present

      - name: Build Application
        run: npm run build${
          ciDockerBuild
            ? `

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Container Image
        run: docker build -t myapp:\${{ github.sha }} .`
            : ''
        }`;
    }

    return `# GitLab CI/CD Pipeline (.gitlab-ci.yml)
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

lint_and_test:
  image: node:20-alpine
  stage: test
  script:
    - npm ci
    - npm run lint --if-present
    - npm test --if-present

build_job:
  image: node:20-alpine
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/`;
  }, [ciRunner, ciLang, ciDockerBuild]);

  const filteredLinuxCommands = useMemo(() => {
    return LINUX_ONE_LINERS.filter((item) => {
      const matchCat = linuxCategory === 'All' || item.category === linuxCategory;
      const matchSearch =
        item.command.toLowerCase().includes(linuxSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(linuxSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [linuxCategory, linuxSearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Cloud className="w-5 h-5 text-cyan-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                CloudOps Shell
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  DevOps Playbook
                </span>
              </h1>
              <p className="text-xs text-slate-400">Docker, Kubernetes &amp; Linux Infrastructure Automation</p>
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

      {/* Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'docker', label: 'Docker & Compose Generator', icon: Box },
            { id: 'k8s', label: 'Kubernetes YAML Studio', icon: Layers },
            { id: 'linux', label: 'Linux One-Liner Cheat-Sheet', icon: Terminal },
            { id: 'cicd', label: 'CI/CD Pipeline Builder', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
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
        {activeTab === 'docker' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Box className="w-4 h-4 text-cyan-400" />
                  Stack Configuration
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Application Stack:</label>
                  <select
                    value={selectedStack}
                    onChange={(e) => setSelectedStack(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="node">Node.js Express / NestJS (Multi-Stage)</option>
                    <option value="react">React / Vite SPA + Nginx Alpine</option>
                    <option value="python">Python FastAPI / Flask (Uvicorn)</option>
                    <option value="go">Go (Golang) Microservice (Scratch)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Attached Database / Cache:</label>
                  <select
                    value={includeDb}
                    onChange={(e) => setIncludeDb(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="postgres">PostgreSQL 16 (Relational DB)</option>
                    <option value="mongo">MongoDB 7 (Document DB)</option>
                    <option value="redis">Redis 7 (In-Memory Cache)</option>
                    <option value="none">None (Standalone API)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                    <input
                      type="checkbox"
                      checked={includeCompose}
                      onChange={(e) => setIncludeCompose(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span>Include docker-compose.yml configuration</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Dockerfile (Production Multi-Stage)
                  </span>
                  <button
                    onClick={() => handleCopy(dockerfileCode)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Dockerfile'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-200 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed max-h-[300px]">
                  {dockerfileCode}
                </pre>
              </div>

              {includeCompose && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      docker-compose.yml
                    </span>
                    <button
                      onClick={() => handleCopy(composeCode)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Compose</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed max-h-[260px]">
                    {composeCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'k8s' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Pod &amp; Service Config
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">App Name:</label>
                  <input
                    type="text"
                    value={k8sAppName}
                    onChange={(e) => setK8sAppName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Docker Image:</label>
                  <input
                    type="text"
                    value={k8sImage}
                    onChange={(e) => setK8sImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Replicas:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={k8sReplicas}
                      onChange={(e) => setK8sReplicas(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Container Port:</label>
                    <input
                      type="number"
                      value={k8sPort}
                      onChange={(e) => setK8sPort(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    kubernetes-manifest.yaml
                  </span>
                  <button
                    onClick={() => handleCopy(k8sManifest)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Manifest'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-200 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed max-h-[460px]">
                  {k8sManifest}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'linux' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Networking', 'Performance', 'Storage & Memory', 'Security & Firewall', 'Logs & Systemd'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setLinuxCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        linuxCategory === cat
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={linuxSearch}
                  onChange={(e) => setLinuxSearch(e.target.value)}
                  placeholder="Search Linux commands..."
                  className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLinuxCommands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-cyan-400 border border-slate-700 mb-2 inline-block">
                      {cmd.category}
                    </span>
                    <p className="text-xs text-slate-300 mb-3">{cmd.description}</p>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <code className="font-mono text-xs text-emerald-300 truncate select-all">{cmd.command}</code>
                    <button
                      onClick={() => handleCopy(cmd.command)}
                      className="p-1.5 text-slate-400 hover:text-white shrink-0 ml-2"
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

        {activeTab === 'cicd' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  Pipeline Settings
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">CI/CD Platform:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCiRunner('github')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        ciRunner === 'github'
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      GitHub Actions
                    </button>
                    <button
                      onClick={() => setCiRunner('gitlab')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        ciRunner === 'gitlab'
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      GitLab CI (.yml)
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input type="checkbox" defaultChecked className="rounded accent-cyan-500" />
                    <span>Run Linter &amp; Syntax Analysis</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input type="checkbox" defaultChecked className="rounded accent-cyan-500" />
                    <span>Run Automated Unit Tests</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={ciDockerBuild}
                      onChange={(e) => setCiDockerBuild(e.target.checked)}
                      className="rounded accent-cyan-500"
                    />
                    <span>Build &amp; Tag Docker Container Image</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    {ciRunner === 'github' ? '.github/workflows/deploy.yml' : '.gitlab-ci.yml'}
                  </span>
                  <button
                    onClick={() => handleCopy(cicdCode)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Workflow'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-200 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed max-h-[460px]">
                  {cicdCode}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
