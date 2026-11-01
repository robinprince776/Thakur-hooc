import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  BookOpen,
  Layers,
  Terminal,
  Shield,
  Heart,
  Grid,
  Zap,
  Tag
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface GraphNode {
  id: string;
  label: string;
  category: 'Tech & BCA' | 'Cyber Security' | 'Medicine & Pharma' | 'Coding' | 'Civil Services';
  color: string;
  description: string;
  relatedApp?: CurrentAppType;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

const INITIAL_NODES: GraphNode[] = [
  // Tech & Architecture
  { id: 'hardware', label: 'Computer Hardware', category: 'Tech & BCA', color: '#38BDF8', description: 'Von Neumann Architecture, CPU, Motherboard & Buses.', relatedApp: 'pcxray' },
  { id: 'cpu', label: 'CPU & Transistors', category: 'Tech & BCA', color: '#0284C7', description: 'Billions of nano switches processing binary 0 and 1.', relatedApp: 'technagar' },
  { id: 'binary', label: 'Binary Number System', category: 'Tech & BCA', color: '#38BDF8', description: 'Radix 2, 1s/2s Complements, Boolean Logic Gates.', relatedApp: 'bca' },
  { id: 'logic-gates', label: 'Logic Gates & Circuits', category: 'Tech & BCA', color: '#0EA5E9', description: 'AND, OR, NOT, NAND, NOR, XOR truth tables.', relatedApp: 'bca' },

  // Coding & DSA
  { id: 'c-lang', label: 'C Programming', category: 'Coding', color: '#10B981', description: 'Procedural fundamentals, data types, loops & functions.', relatedApp: 'compiler' },
  { id: 'pointers', label: 'Pointers & Memory', category: 'Coding', color: '#059669', description: 'Direct RAM memory addresses, pointer arithmetic.', relatedApp: 'feynman' as CurrentAppType },
  { id: 'dsa', label: 'Data Structures (DSA)', category: 'Coding', color: '#34D399', description: 'Linked Lists, Stacks, Queues, Trees & Graphs.', relatedApp: 'dsa' },
  { id: 'sql', label: 'Relational Database (SQL)', category: 'Coding', color: '#10B981', description: 'Tables, Primary Keys, Foreign Keys, ACID transactions.', relatedApp: 'database' },

  // Networking & Web
  { id: 'networking', label: 'Computer Networks', category: 'Tech & BCA', color: '#F59E0B', description: 'Data communication, topologies & transmission media.', relatedApp: 'netviz' },
  { id: 'osi-model', label: 'OSI 7 Layers', category: 'Tech & BCA', color: '#D97706', description: 'Physical to Application layers communication stack.', relatedApp: 'feynman' as CurrentAppType },
  { id: 'dns-ip', label: 'DNS & IP Routing', category: 'Tech & BCA', color: '#FBBF24', description: 'Domain name resolution and packet postal system.', relatedApp: 'technagar' },

  // Cyber Security
  { id: 'cyber-sec', label: 'Cyber Security', category: 'Cyber Security', color: '#EF4444', description: 'CIA Triad: Confidentiality, Integrity, Availability.', relatedApp: 'cyber' },
  { id: 'linux', label: 'Linux OS & Shell', category: 'Cyber Security', color: '#DC2626', description: 'Bash commands, file permissions, daemon services.', relatedApp: 'linux' },
  { id: 'kali', label: 'Kali Linux Tools', category: 'Cyber Security', color: '#B91C1C', description: 'Nmap, Wireshark, Metasploit, Reconnaissance.', relatedApp: 'cyber' },
  { id: 'crypto', label: 'Cryptography & Ciphers', category: 'Cyber Security', color: '#F87171', description: 'AES-256, RSA, Digital Signatures, 2FA.', relatedApp: 'cryptomaster' },

  // Medicine & Pharma
  { id: 'medicore', label: 'MediCore Pro Desk', category: 'Medicine & Pharma', color: '#14B8A6', description: 'D-Pharma clinical reference, OTC care & drug vault.', relatedApp: 'medicore' },
  { id: 'iv-fluids', label: 'IV Fluids (RL / NS)', category: 'Medicine & Pharma', color: '#0D9488', description: 'Hydration therapy, drip rate formula, cannula sizes.', relatedApp: 'medicore' },
  { id: 'disease-matrix', label: 'Disease & Symptom Matrix', category: 'Medicine & Pharma', color: '#2DD4BF', description: 'Viral, bacterial, metabolic & red flags triage.', relatedApp: 'medicore' },

  // Civil Services
  { id: 'upsc', label: 'UPSC Civil Services', category: 'Civil Services', color: '#A855F7', description: 'GS 1-4 syllabus, constitution, governance & ethics.', relatedApp: 'upsc' }
];

const INITIAL_LINKS: GraphLink[] = [
  // Tech & Hardware links
  { source: 'hardware', target: 'cpu' },
  { source: 'cpu', target: 'binary' },
  { source: 'binary', target: 'logic-gates' },
  { source: 'hardware', target: 'c-lang' },

  // Coding & DSA links
  { source: 'c-lang', target: 'pointers' },
  { source: 'pointers', target: 'dsa' },
  { source: 'dsa', target: 'sql' },

  // Networking links
  { source: 'hardware', target: 'networking' },
  { source: 'networking', target: 'osi-model' },
  { source: 'osi-model', target: 'dns-ip' },
  { source: 'dns-ip', target: 'cyber-sec' },

  // Cyber Security links
  { source: 'cyber-sec', target: 'linux' },
  { source: 'linux', target: 'kali' },
  { source: 'cyber-sec', target: 'crypto' },

  // Medicine & Pharma links
  { source: 'medicore', target: 'iv-fluids' },
  { source: 'medicore', target: 'disease-matrix' },

  // Cross-domain links
  { source: 'c-lang', target: 'cyber-sec' },
  { source: 'crypto', target: 'binary' }
];

export interface NeuroNetAppProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSwitchApp?: (appId: string) => void;
}

export const NeuroNetApp: React.FC<NeuroNetAppProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSwitchApp
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>(() => {
    try {
      const saved = localStorage.getItem('neuronet_custom_nodes');
      return saved ? JSON.parse(saved) : INITIAL_NODES;
    } catch {
      return INITIAL_NODES;
    }
  });

  const [links] = useState<GraphLink[]>(INITIAL_LINKS);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Custom node modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCategory, setNewCategory] = useState<GraphNode['category']>('Tech & BCA');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Position coordinates state on canvas
  const nodePositions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  // Initialize node layout in a distributed circle
  useEffect(() => {
    const width = 800;
    const height = 550;
    const count = nodes.length;

    nodes.forEach((node, i) => {
      if (!nodePositions.current.has(node.id)) {
        const angle = (i / count) * 2 * Math.PI;
        const radius = 180 + (i % 3) * 40;
        nodePositions.current.set(node.id, {
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    });
  }, [nodes]);

  // Canvas Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Deep space galactic radial aura
      const nebula = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      nebula.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      nebula.addColorStop(0.5, 'rgba(8, 14, 26, 0.98)');
      nebula.addColorStop(1, '#030712');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Cosmic background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let s = 0; s < 40; s++) {
        const sx = ((s * 137.5) % width);
        const sy = ((s * 223.7) % height);
        ctx.fillRect(sx, sy, (s % 3 === 0) ? 2 : 1, (s % 3 === 0) ? 2 : 1);
      }

      // Draw subtle cyber grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Links
      links.forEach((link) => {
        const srcPos = nodePositions.current.get(link.source);
        const tgtPos = nodePositions.current.get(link.target);

        if (srcPos && tgtPos) {
          const isHighlighted =
            selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

          ctx.beginPath();
          ctx.moveTo(srcPos.x, srcPos.y);
          ctx.lineTo(tgtPos.x, tgtPos.y);
          ctx.strokeStyle = isHighlighted ? 'rgba(56, 189, 248, 0.8)' : 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = isHighlighted ? 2.5 : 1;
          ctx.stroke();
        }
      });

      // Simple physics attraction / repulsion dampening
      nodes.forEach((node) => {
        const pos = nodePositions.current.get(node.id);
        if (!pos) return;

        // Pull slightly toward center
        const dx = width / 2 - pos.x;
        const dy = height / 2 - pos.y;
        pos.vx += dx * 0.0005;
        pos.vy += dy * 0.0005;

        // Dampen velocity
        pos.vx *= 0.95;
        pos.vy *= 0.95;

        pos.x += pos.vx;
        pos.y += pos.vy;

        // Clamp edges
        pos.x = Math.max(40, Math.min(width - 40, pos.x));
        pos.y = Math.max(40, Math.min(height - 40, pos.y));

        // Draw Node
        const isSelected = selectedNode?.id === node.id;
        const isMatch =
          !searchQuery ||
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Outer glow circle
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 24, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isSelected ? 16 : 12, 0, 2 * Math.PI);
        ctx.fillStyle = isMatch ? node.color : '#334155';
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Node Label
        ctx.font = isSelected ? 'bold 12px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isSelected ? '#38BDF8' : isMatch ? '#E2E8F0' : '#64748B';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + 24);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [nodes, links, selectedNode, searchQuery]);

  // Click on Canvas to select node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    let clicked: GraphNode | null = null;
    nodes.forEach((node) => {
      const pos = nodePositions.current.get(node.id);
      if (pos) {
        const dist = Math.hypot(pos.x - clickX, pos.y - clickY);
        if (dist <= 25) {
          clicked = node;
        }
      }
    });

    setSelectedNode(clicked);
  };

  // Add Custom Node
  const handleAddNode = () => {
    if (!newLabel.trim()) return;

    const id = `custom_${Date.now()}`;
    const newNode: GraphNode = {
      id,
      label: newLabel.trim(),
      category: newCategory,
      color: '#A855F7',
      description: newDesc.trim() || 'User custom node in personal knowledge base.'
    };

    const updated = [...nodes, newNode];
    setNodes(updated);
    try {
      localStorage.setItem('neuronet_custom_nodes', JSON.stringify(updated));
    } catch {}

    setNewLabel('');
    setNewDesc('');
    setShowAddModal(false);
    setSelectedNode(newNode);
  };

  const categories = ['All', 'Tech & BCA', 'Coding', 'Cyber Security', 'Medicine & Pharma', 'Civil Services'];

  const filteredNodes = nodes.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesQuery = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans select-none relative pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-cyan-500/30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                NeuroNet: Second Brain Knowledge Graph
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                Dynamic Nodes
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive synaptic map connecting all 46+ apps, concepts and notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </button>

          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              Apps
            </button>
          )}

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              Main Hub
            </button>
          )}
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Left: Interactive Canvas View */}
        <div className="flex-1 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col">
          {/* Controls bar */}
          <div className="p-3 bg-slate-900/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search node (e.g. Linux, Pointers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-hidden w-full placeholder:text-slate-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* HTML5 Canvas */}
          <div className="flex-1 relative min-h-[420px] sm:min-h-[500px]">
            <canvas
              ref={canvasRef}
              width={800}
              height={550}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-crosshair"
            />
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-400 font-mono">
              💡 Tap any node to inspect connections &amp; launch module
            </div>
          </div>
        </div>

        {/* Right: Node Dossier / Inspector Drawer */}
        <div className="w-full lg:w-80 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl flex flex-col justify-between space-y-4">
          {selectedNode ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedNode.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: #{selectedNode.id}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{selectedNode.label}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                  {selectedNode.description}
                </p>
              </div>

              {/* Connected Links */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono text-slate-400 font-bold block">
                  Connected Synapses:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {links
                    .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
                    .map((l, idx) => {
                      const otherId = l.source === selectedNode.id ? l.target : l.source;
                      const otherNode = nodes.find((n) => n.id === otherId);
                      return (
                        <button
                          key={idx}
                          onClick={() => otherNode && setSelectedNode(otherNode)}
                          className="px-2 py-1 rounded-lg bg-slate-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono hover:bg-slate-800 cursor-pointer"
                        >
                          → {otherNode?.label || otherId}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Launch Module Button */}
              {selectedNode.relatedApp && (
                <div className="pt-4">
                  <button
                    onClick={() => {
                      if (onSwitchApp && selectedNode.relatedApp) {
                        onSwitchApp(selectedNode.relatedApp);
                      } else if (selectedNode.relatedApp) {
                        window.location.hash = `#${selectedNode.relatedApp}`;
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 cursor-pointer"
                  >
                    <span>Launch {selectedNode.relatedApp.toUpperCase()} App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-300">Koi Node Selected Nahi Hai</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Graph me kisi bhi node pe tap karein uske concepts, notes aur connected apps dekhne ke liye.
              </p>
            </div>
          )}

          {/* Quick Node Directory */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Knowledge Base: {filteredNodes.length} Topics
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1">
              {filteredNodes.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-xs text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{n.label}</span>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Custom Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Naya Knowledge Node Add Karein</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Topic Name:</label>
                <input
                  type="text"
                  placeholder="E.g. Graph Algorithms, Neural Networks..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-hidden"
                >
                  <option value="Tech & BCA">Tech &amp; BCA</option>
                  <option value="Coding">Coding</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Medicine & Pharma">Medicine &amp; Pharma</option>
                  <option value="Civil Services">Civil Services</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes / Description:</label>
                <textarea
                  rows={3}
                  placeholder="Key concepts or practical notes..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNode}
                disabled={!newLabel.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold cursor-pointer disabled:opacity-40"
              >
                Save to Brain 🧠
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
