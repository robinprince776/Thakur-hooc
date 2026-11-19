import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Link2,
  Zap,
  Bot,
  GitBranch,
  Send,
  CheckCircle2,
  Terminal,
  Move,
} from 'lucide-react';
import {
  FlowNode,
  FlowEdge,
  FlowNodeKind,
  NODE_CATALOG,
  NodeTemplate,
} from './aiflowData';

interface WorkflowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onChangeNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
  onChangeEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
  onResetDefault: () => void;
}

interface TraceEntry {
  step: number;
  nodeId: string;
  title: string;
  kind: FlowNodeKind;
  durationMs: number;
  payload: Record<string, unknown>;
}

const NODE_WIDTH = 216;
const NODE_HEIGHT = 86;

const KIND_STYLES: Record<
  FlowNodeKind,
  { border: string; bg: string; badgeText: string; dot: string; accent: string }
> = {
  trigger: {
    border: 'border-amber-400/45',
    bg: 'bg-slate-900/90',
    badgeText: 'text-amber-300',
    dot: '#fbbf24',
    accent: 'TRIGGER',
  },
  ai: {
    border: 'border-violet-400/50',
    bg: 'bg-slate-900/90',
    badgeText: 'text-violet-300',
    dot: '#a78bfa',
    accent: 'AI AGENT',
  },
  logic: {
    border: 'border-cyan-400/45',
    bg: 'bg-slate-900/90',
    badgeText: 'text-cyan-300',
    dot: '#22d3ee',
    accent: 'LOGIC',
  },
  action: {
    border: 'border-emerald-400/45',
    bg: 'bg-slate-900/90',
    badgeText: 'text-emerald-300',
    dot: '#34d399',
    accent: 'ACTION',
  },
};

function getKindIcon(kind: FlowNodeKind) {
  switch (kind) {
    case 'trigger':
      return <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
    case 'ai':
      return <Bot className="w-3.5 h-3.5 text-violet-300 shrink-0" />;
    case 'logic':
      return <GitBranch className="w-3.5 h-3.5 text-cyan-300 shrink-0" />;
    case 'action':
      return <Send className="w-3.5 h-3.5 text-emerald-300 shrink-0" />;
  }
}

function getBezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.max(60, Math.abs(x2 - x1) * 0.55);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onChangeNodes,
  onChangeEdges,
  onResetDefault,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pan, setPan] = useState({ x: 18, y: 26 });
  const [zoom, setZoom] = useState(0.92);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [showAddPalette, setShowAddPalette] = useState(false);

  // Dragging state (node drag or canvas pan)
  const dragStateRef = useRef<{
    mode: 'none' | 'pan' | 'node';
    nodeId?: string;
    startClientX: number;
    startClientY: number;
    origX: number;
    origY: number;
  }>({ mode: 'none', startClientX: 0, startClientY: 0, origX: 0, origY: 0 });

  // Test Flow simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeEdgeIds, setActiveEdgeIds] = useState<string[]>([]);
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);
  const [traceLogs, setTraceLogs] = useState<TraceEntry[]>([]);
  const timersRef = useRef<number[]>([]);

  const clearSimulationTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearSimulationTimers();
  }, [clearSimulationTimers]);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-flow-node="true"]') || target.closest('[data-flow-control="true"]')) {
      return;
    }
    setSelectedNodeId(null);
    setConnectFromId(null);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      mode: 'pan',
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: pan.x,
      origY: pan.y,
    };
  };

  const handleNodePointerDown = (e: React.PointerEvent<HTMLDivElement>, node: FlowNode) => {
    e.stopPropagation();
    if (connectFromId && connectFromId !== node.id) {
      // Complete connection from connectFromId -> node.id
      const duplicate = edges.some((ed) => ed.from === connectFromId && ed.to === node.id);
      if (!duplicate) {
        onChangeEdges((prev) => [
          ...prev,
          { id: `e-${Date.now()}`, from: connectFromId, to: node.id, label: 'data' },
        ]);
      }
      setConnectFromId(null);
      setSelectedNodeId(node.id);
      return;
    }

    setSelectedNodeId(node.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      mode: 'node',
      nodeId: node.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: node.x,
      origY: node.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    if (st.mode === 'none') return;

    if (st.mode === 'pan') {
      const dx = e.clientX - st.startClientX;
      const dy = e.clientY - st.startClientY;
      setPan({ x: st.origX + dx, y: st.origY + dy });
    } else if (st.mode === 'node' && st.nodeId) {
      const dx = (e.clientX - st.startClientX) / zoom;
      const dy = (e.clientY - st.startClientY) / zoom;
      const nextX = Math.max(10, Math.round(st.origX + dx));
      const nextY = Math.max(10, Math.round(st.origY + dy));
      onChangeNodes((prev) =>
        prev.map((n) => (n.id === st.nodeId ? { ...n, x: nextX, y: nextY } : n))
      );
    }
  };

  const handlePointerUp = () => {
    dragStateRef.current.mode = 'none';
  };

  const handleAddNode = (tpl: NodeTemplate) => {
    const maxX = nodes.reduce((acc, n) => Math.max(acc, n.x), 40);
    const newNode: FlowNode = {
      id: `n-${Date.now()}`,
      kind: tpl.kind,
      title: tpl.title,
      subtitle: tpl.subtitle,
      provider: tpl.provider,
      x: Math.min(maxX + 60, 920),
      y: 80 + ((nodes.length * 54) % 240),
      samplePayload: tpl.samplePayload,
    };
    onChangeNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setShowAddPalette(false);
  };

  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    onChangeNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    onChangeEdges((prev) =>
      prev.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId)
    );
    setSelectedNodeId(null);
    if (connectFromId === selectedNodeId) setConnectFromId(null);
  };

  const handleDeleteEdge = (edgeId: string) => {
    onChangeEdges((prev) => prev.filter((e) => e.id !== edgeId));
  };

  const runTestFlow = () => {
    if (nodes.length === 0) return;
    clearSimulationTimers();
    setIsRunning(true);
    setCompletedNodeIds([]);
    setActiveNodeId(null);
    setActiveEdgeIds([]);
    setTraceLogs([]);

    // Topological BFS starting from trigger nodes (or nodes with 0 in-degree)
    const inDegree = new Map<string, number>();
    nodes.forEach((n) => inDegree.set(n.id, 0));
    edges.forEach((e) => inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1));

    const roots = nodes.filter((n) => n.kind === 'trigger' || (inDegree.get(n.id) ?? 0) === 0);
    const startQueue = roots.length > 0 ? roots : [nodes[0]];
    const visited = new Set<string>();
    const ordered: FlowNode[] = [];
    const queue = [...startQueue];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (visited.has(curr.id)) continue;
      visited.add(curr.id);
      ordered.push(curr);
      const outgoing = edges.filter((e) => e.from === curr.id);
      outgoing.forEach((edge) => {
        const nextNode = nodes.find((n) => n.id === edge.to);
        if (nextNode && !visited.has(nextNode.id)) queue.push(nextNode);
      });
    }
    // Include any disconnected nodes at the end
    nodes.forEach((n) => {
      if (!visited.has(n.id)) ordered.push(n);
    });

    ordered.forEach((node, index) => {
      const tStart = index * 820;
      const timerId = window.setTimeout(() => {
        setActiveNodeId(node.id);
        const outEdgeIds = edges.filter((e) => e.from === node.id).map((e) => e.id);
        setActiveEdgeIds(outEdgeIds);
        setCompletedNodeIds((prev) => (prev.includes(node.id) ? prev : [...prev, node.id]));
        const simulatedMs = 45 + ((index * 67 + node.title.length * 11) % 190);
        setTraceLogs((prev) => [
          ...prev,
          {
            step: index + 1,
            nodeId: node.id,
            title: node.title,
            kind: node.kind,
            durationMs: simulatedMs,
            payload: node.samplePayload,
          },
        ]);
      }, tStart);
      timersRef.current.push(timerId);
    });

    const endTimer = window.setTimeout(() => {
      setIsRunning(false);
      setActiveNodeId(null);
      setActiveEdgeIds([]);
    }, ordered.length * 820 + 450);
    timersRef.current.push(endTimer);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/75 border border-white/10 rounded-2xl p-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runTestFlow}
            disabled={isRunning || nodes.length === 0}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Running Flow...' : 'Test Flow'}
          </button>

          <button
            type="button"
            onClick={() => setShowAddPalette((v) => !v)}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Node
          </button>

          {selectedNode && (
            <>
              <button
                type="button"
                onClick={() =>
                  setConnectFromId((prev) => (prev === selectedNode.id ? null : selectedNode.id))
                }
                className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  connectFromId === selectedNode.id
                    ? 'bg-violet-500/30 border-violet-400 text-violet-100'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                {connectFromId === selectedNode.id ? 'Tap Target Node...' : 'Connect Output'}
              </button>

              <button
                type="button"
                onClick={handleDeleteSelected}
                className="min-h-[40px] px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.55, Number((z - 0.1).toFixed(2))))}
            title="Zoom Out"
            className="min-h-[40px] min-w-[40px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 tabular-nums px-2 min-w-[52px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.4, Number((z + 0.1).toFixed(2))))}
            title="Zoom In"
            className="min-h-[40px] min-w-[40px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setPan({ x: 18, y: 26 });
              setZoom(0.92);
              onResetDefault();
            }}
            title="Reset Canvas"
            className="min-h-[40px] px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Add Node Palette Drawer */}
      {showAddPalette && (
        <div className="bg-slate-900/90 border border-cyan-400/25 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Select a Trigger, AI, Logic, or Action Node to drop on canvas
            </p>
            <button
              type="button"
              onClick={() => setShowAddPalette(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {NODE_CATALOG.map((tpl) => {
              const st = KIND_STYLES[tpl.kind];
              return (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => handleAddNode(tpl)}
                  className={`text-left p-3 rounded-xl bg-slate-950/75 border ${st.border} hover:bg-slate-800/80 transition`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {getKindIcon(tpl.kind)}
                    <span className={`text-[10px] font-mono font-semibold ${st.badgeText}`}>
                      {st.accent}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{tpl.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{tpl.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Pan & Zoom SVG + HTML Node Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[430px] sm:h-[470px] rounded-2xl border border-white/10 bg-slate-950/90 overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage:
            'radial-gradient(rgba(148, 163, 184, 0.16) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        {/* Canvas Hint */}
        <div
          data-flow-control="true"
          className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-white/10 text-[11px] text-slate-300 pointer-events-none"
        >
          <Move className="w-3.5 h-3.5 text-cyan-300" />
          <span>
            {connectFromId
              ? 'Tap any other node to wire connection'
              : 'Drag nodes to arrange · Drag background to pan · Tap a node to connect'}
          </span>
        </div>

        {/* Transformed Layer */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          }}
        >
          {/* SVG Edges + Animated Glowing Data Dots */}
          <svg
            className="absolute top-0 left-0 overflow-visible pointer-events-none"
            width={1600}
            height={900}
          >
            <defs>
              <filter id="aiflowGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {edges.map((edge) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x + NODE_WIDTH;
              const y1 = fromNode.y + NODE_HEIGHT / 2;
              const x2 = toNode.x;
              const y2 = toNode.y + NODE_HEIGHT / 2;
              const pathD = getBezierPath(x1, y1, x2, y2);
              const isEdgeActive = activeEdgeIds.includes(edge.id);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 - 8;

              return (
                <g key={edge.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isEdgeActive ? '#34d399' : 'rgba(148,163,184,0.42)'}
                    strokeWidth={isEdgeActive ? 3 : 2}
                    strokeDasharray={isEdgeActive ? 'none' : '6 4'}
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      fill={isEdgeActive ? '#6ee7b7' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {edge.label}
                    </text>
                  )}
                  {isEdgeActive && (
                    <circle r="6" fill="#34d399" filter="url(#aiflowGlow)">
                      <animateMotion dur="0.72s" repeatCount="indefinite" path={pathD} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Draggable Flow Nodes */}
          {nodes.map((node) => {
            const st = KIND_STYLES[node.kind];
            const isSelected = selectedNodeId === node.id;
            const isActive = activeNodeId === node.id;
            const isDone = completedNodeIds.includes(node.id);
            const isConnectOrigin = connectFromId === node.id;

            return (
              <div
                key={node.id}
                data-flow-node="true"
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                style={{
                  left: node.x,
                  top: node.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
                className={`absolute rounded-2xl border p-3 backdrop-blur-xl transition-shadow cursor-grab active:cursor-grabbing ${st.bg} ${
                  isActive
                    ? 'border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.38)]'
                    : isConnectOrigin
                    ? 'border-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.35)]'
                    : isSelected
                    ? 'border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.28)]'
                    : st.border
                }`}
              >
                {/* Input Port */}
                <span
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-slate-400"
                  title="Input Port"
                />
                {/* Output Port */}
                <span
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-900 border-2"
                  style={{ borderColor: st.dot }}
                  title="Output Port"
                />

                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getKindIcon(node.kind)}
                    <span className={`text-[10px] font-mono font-semibold tracking-wider ${st.badgeText}`}>
                      {st.accent}
                    </span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono truncate">
                      {node.provider}
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-white truncate">{node.title}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{node.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Connections Manager + Live Execution Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Active Wiring ({edges.length} links)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {nodes.length} nodes
            </span>
          </div>
          {edges.length === 0 ? (
            <p className="text-xs text-slate-400">
              No edges wired yet. Select a node and tap Connect Output.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {edges.map((ed) => {
                const src = nodes.find((n) => n.id === ed.from);
                const dst = nodes.find((n) => n.id === ed.to);
                return (
                  <div
                    key={ed.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5 text-xs"
                  >
                    <span className="text-slate-200 truncate">
                      {src?.title ?? ed.from} <span className="text-cyan-400">→</span>{' '}
                      {dst?.title ?? ed.to}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEdge(ed.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 shrink-0"
                      title="Remove link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Live Execution Payload Trace
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {isRunning
                ? 'Simulating pipeline...'
                : traceLogs.length > 0
                ? `${traceLogs.length} steps OK`
                : 'Press Test Flow to simulate'}
            </span>
          </div>

          {traceLogs.length === 0 ? (
            <div className="h-36 rounded-xl border border-dashed border-white/10 bg-slate-950/50 flex items-center justify-center text-xs text-slate-400 px-4 text-center">
              Click <span className="text-emerald-300 font-semibold mx-1">Test Flow</span> to watch
              glowing payloads travel across your workflow nodes step by step.
            </div>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 font-mono text-[11px]">
              {traceLogs.map((entry) => (
                <div
                  key={`${entry.nodeId}-${entry.step}`}
                  className="p-2.5 rounded-xl bg-slate-950/85 border border-emerald-500/20"
                >
                  <div className="flex items-center justify-between gap-2 text-emerald-300 mb-1">
                    <span className="font-semibold truncate">
                      [{entry.step}] {entry.title}
                    </span>
                    <span className="text-slate-400 tabular-nums shrink-0">
                      200 OK · {entry.durationMs}ms
                    </span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap break-all text-[10.5px]">
                    {JSON.stringify(entry.payload)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
