import React, { useState } from 'react';
import {
  Workflow,
  Bot,
  Webhook,
  BookOpen,
  ArrowLeft,
  LayoutGrid,
  Copy,
  Check,
  Send,
  Play,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AGENT_PERSONAS,
  AUTOMATION_BLUEPRINTS,
  DEFAULT_CANVAS_EDGES,
  DEFAULT_CANVAS_NODES,
  FlowEdge,
  FlowNode,
  WEBHOOK_PRESETS,
  AutomationBlueprint,
} from './aiflowData';
import { WorkflowCanvas } from './WorkflowCanvas';

interface AiAutomationLabAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher: () => void;
}

type LabTab = 'builder' | 'agents' | 'webhooks' | 'blueprints';

export const AiAutomationLabApp: React.FC<AiAutomationLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const [activeTab, setActiveTab] = useState<LabTab>('builder');
  const [nodes, setNodes] = useState<FlowNode[]>(DEFAULT_CANVAS_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(DEFAULT_CANVAS_EDGES);
  const [loadedBlueprintTitle, setLoadedBlueprintTitle] = useState<string>(
    'Auto-Reply to Freelance Clients & CRM Sync'
  );

  // Agent Personas state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPersonaCategory, setSelectedPersonaCategory] = useState<string>('All');

  // Webhook Playground state
  const [selectedPresetId, setSelectedPresetId] = useState<'zapier' | 'make' | 'n8n' | 'python'>(
    'zapier'
  );
  const activePreset =
    WEBHOOK_PRESETS.find((p) => p.id === selectedPresetId) ?? WEBHOOK_PRESETS[0];
  const [webhookBody, setWebhookBody] = useState<string>(activePreset.sampleBody);
  const [webhookStatus, setWebhookStatus] = useState<{
    sentAt: string;
    code: number;
    latencyMs: number;
    validJson: boolean;
    response: string;
  } | null>(null);

  // Blueprints filter state
  const [blueprintCategory, setBlueprintCategory] = useState<string>('All');

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      // Fallback ignored in restricted clipboard contexts
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 1800);
  };

  const handleSelectWebhookPreset = (id: 'zapier' | 'make' | 'n8n' | 'python') => {
    setSelectedPresetId(id);
    const next = WEBHOOK_PRESETS.find((p) => p.id === id) ?? WEBHOOK_PRESETS[0];
    setWebhookBody(next.sampleBody);
    setWebhookStatus(null);
  };

  const handleSimulateWebhook = () => {
    let validJson = true;
    try {
      JSON.parse(webhookBody);
    } catch {
      validJson = false;
    }

    const now = new Date();
    const latency = 38 + (webhookBody.length % 95);
    setWebhookStatus({
      sentAt: now.toLocaleTimeString(),
      code: validJson ? activePreset.responseCode : 400,
      latencyMs: latency,
      validJson,
      response: validJson
        ? activePreset.responseBody
        : JSON.stringify(
            {
              error: 'INVALID_JSON_PAYLOAD',
              message: 'Fix JSON syntax in request body before dispatching webhook.',
            },
            null,
            2
          ),
    });
  };

  const handleLoadBlueprintToCanvas = (bp: AutomationBlueprint) => {
    setNodes(bp.nodes.map((n) => ({ ...n })));
    setEdges(bp.edges.map((e) => ({ ...e })));
    setLoadedBlueprintTitle(bp.title);
    setActiveTab('builder');
  };

  const personaCategories = ['All', 'Client Ops', 'Engineering', 'Research', 'Growth', 'Productivity'];
  const filteredPersonas =
    selectedPersonaCategory === 'All'
      ? AGENT_PERSONAS
      : AGENT_PERSONAS.filter((p) => p.category === selectedPersonaCategory);

  const blueprintCategories = ['All', 'Freelancing', 'Job Hunt', 'DevOps', 'Content', 'Security', 'E-Commerce'];
  const filteredBlueprints =
    blueprintCategory === 'All'
      ? AUTOMATION_BLUEPRINTS
      : AUTOMATION_BLUEPRINTS.filter((b) => b.category === blueprintCategory);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 relative overflow-x-hidden">
      {/* Subtle ambient depth backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 14% 12%, rgba(56, 189, 248, 0.14), transparent 36%), radial-gradient(circle at 86% 18%, rgba(139, 92, 246, 0.14), transparent 38%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Top Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/75 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Workflow className="w-4 h-4" />
              <span>AI AUTOMATION & AGENT LAB · LOCAL SANDBOX</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Visual Workflow Studio & No-Code Agent Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Design multi-step automations, copy production AI agent prompts, and simulate Zapier, Make, n8n, & Python webhooks offline.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAppSwitcher}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition whitespace-nowrap shrink-0"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-300" />
              Apps
            </button>
            <button
              type="button"
              onClick={onBackToBca}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-xs font-semibold text-cyan-100 flex items-center gap-2 transition whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'builder', label: 'Workflow Builder', icon: Workflow },
            { id: 'agents', label: `AI Agent Personas (${AGENT_PERSONAS.length})`, icon: Bot },
            { id: 'webhooks', label: 'API & Webhook Playground', icon: Webhook },
            {
              id: 'blueprints',
              label: `Automation Blueprints (${AUTOMATION_BLUEPRINTS.length})`,
              icon: BookOpen,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as LabTab)}
                className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-300' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: VISUAL WORKFLOW BUILDER */}
        {activeTab === 'builder' && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="text-xs text-slate-300">
                Active Pipeline:{' '}
                <span className="font-semibold text-white">{loadedBlueprintTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('blueprints')}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition whitespace-nowrap shrink-0"
              >
                Load another blueprint →
              </button>
            </div>
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onChangeNodes={setNodes}
              onChangeEdges={setEdges}
              onResetDefault={() => {
                setNodes(DEFAULT_CANVAS_NODES);
                setEdges(DEFAULT_CANVAS_EDGES);
                setLoadedBlueprintTitle('Auto-Reply to Freelance Clients & CRM Sync');
              }}
            />
          </section>
        )}

        {/* TAB 2: AI AGENT PERSONAS */}
        {activeTab === 'agents' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {personaCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedPersonaCategory(cat)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                    selectedPersonaCategory === cat
                      ? 'bg-violet-500/25 border-violet-400/50 text-violet-100'
                      : 'bg-slate-900/70 border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPersonas.map((persona) => (
                <article
                  key={persona.id}
                  className="bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-mono text-violet-300">
                          {persona.category} · {persona.modelHint}
                        </p>
                        <h2 className="text-base font-bold text-white mt-0.5">{persona.name}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{persona.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(persona.id, persona.systemPrompt)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-violet-100 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
                      >
                        {copiedId === persona.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Prompt
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{persona.bestFor}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <span className="text-slate-400 block mb-0.5">Expected Input</span>
                        <span className="text-slate-200">{persona.inputFormat}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <span className="text-slate-400 block mb-0.5">Structured Output</span>
                        <span className="text-slate-200">{persona.outputFormat}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-mono text-slate-400 mb-1.5">System Prompt</p>
                      <pre className="p-3 rounded-xl bg-slate-950/90 border border-white/10 text-[11.5px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {persona.systemPrompt}
                      </pre>
                    </div>

                    <div>
                      <p className="text-[11px] font-mono text-slate-400 mb-1.5">
                        Sample Agent Output
                      </p>
                      <pre className="p-3 rounded-xl bg-slate-950/60 border border-emerald-400/15 text-[11px] font-mono text-emerald-200/90 whitespace-pre-wrap max-h-36 overflow-y-auto">
                        {persona.exampleOutput}
                      </pre>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: API & WEBHOOK PLAYGROUND */}
        {activeTab === 'webhooks' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {WEBHOOK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectWebhookPreset(preset.id)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                    selectedPresetId === preset.id
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                      : 'bg-slate-900/70 border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {preset.platform}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Request Builder */}
              <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h2 className="text-base font-bold text-white">{activePreset.platform}</h2>
                    <span className="text-[11px] font-mono text-emerald-300">
                      LOCAL MOCK SIMULATOR · ZERO NETWORK CALLS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{activePreset.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="px-3 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-bold shrink-0 text-center">
                    {activePreset.method}
                  </div>
                  <div className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-xs text-slate-200 overflow-x-auto whitespace-nowrap">
                    {activePreset.endpoint}
                  </div>
                </div>

                <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-nowrap">
                  Header: {activePreset.authHeader}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="aiflow-webhook-body"
                      className="text-xs font-semibold text-slate-300"
                    >
                      JSON Payload Body (Editable)
                    </label>
                    <button
                      type="button"
                      onClick={() => setWebhookBody(activePreset.sampleBody)}
                      className="text-[11px] text-cyan-300 hover:text-cyan-200"
                    >
                      Restore Sample
                    </button>
                  </div>
                  <textarea
                    id="aiflow-webhook-body"
                    value={webhookBody}
                    onChange={(e) => setWebhookBody(e.target.value)}
                    rows={9}
                    spellCheck={false}
                    className="w-full rounded-xl bg-slate-950/95 border border-white/15 focus:border-cyan-400/60 focus:outline-none p-3 font-mono text-xs text-slate-100 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Validates JSON schema & simulates receiver acknowledgement locally.
                  </span>
                  <button
                    type="button"
                    onClick={handleSimulateWebhook}
                    className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Test Webhook
                  </button>
                </div>
              </div>

              {/* Simulated Response & Integration Code */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Simulated Webhook Response
                    </h3>
                    {webhookStatus && (
                      <span
                        className={`text-xs font-mono font-semibold tabular-nums ${
                          webhookStatus.validJson ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        HTTP {webhookStatus.code} · {webhookStatus.latencyMs}ms
                      </span>
                    )}
                  </div>

                  {webhookStatus ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-400 font-mono">
                        Dispatched at {webhookStatus.sentAt} · Content-Type: application/json
                      </p>
                      <pre
                        className={`p-3 rounded-xl border font-mono text-xs whitespace-pre-wrap ${
                          webhookStatus.validJson
                            ? 'bg-slate-950/90 border-emerald-400/25 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-400/30 text-rose-200'
                        }`}
                      >
                        {webhookStatus.response}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-white/10 bg-slate-950/50 text-xs text-slate-400 text-center">
                      Edit the JSON payload on the left and click{' '}
                      <span className="text-emerald-300 font-semibold">Send Test Webhook</span> to
                      inspect the response.
                    </div>
                  )}
                </div>

                <div className="bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Client Trigger Snippet
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleCopy(`snippet-${activePreset.id}`, activePreset.integrationSnippet)}
                      className="min-h-[34px] px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-200 flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
                    >
                      {copiedId === `snippet-${activePreset.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-[11px] text-cyan-100 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {activePreset.integrationSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: AUTOMATION BLUEPRINTS */}
        {activeTab === 'blueprints' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {blueprintCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setBlueprintCategory(cat)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition whitespace-nowrap shrink-0 ${
                    blueprintCategory === cat
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                      : 'bg-slate-900/70 border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBlueprints.map((bp) => (
                <article
                  key={bp.id}
                  className="bg-slate-900/75 border border-white/10 hover:border-cyan-400/35 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between gap-4 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="text-cyan-300">
                        {bp.category} · {bp.difficulty}
                      </span>
                      <span className="text-emerald-300 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {bp.timeSaved}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white leading-snug">{bp.title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">{bp.summary}</p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <Layers className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                      <span className="truncate">{bp.stack}</span>
                    </div>

                    <ol className="space-y-1.5 pt-1 border-t border-white/5">
                      {bp.steps.map((step, idx) => (
                        <li key={idx} className="text-[11.5px] text-slate-300 flex gap-2">
                          <span className="text-cyan-400 font-mono shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLoadBlueprintToCanvas(bp)}
                    className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-100 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Load on Visual Canvas
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
export default AiAutomationLabApp;
