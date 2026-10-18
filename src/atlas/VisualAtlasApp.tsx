import React, { useState } from 'react';
import {
  Layers,
  Globe,
  Shield,
  Cpu,
  Cloud,
  Brain,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Server,
  Database,
  Code2,
  Box,
  Terminal,
  Activity
} from 'lucide-react';

export interface VisualAtlasAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const VisualAtlasApp: React.FC<VisualAtlasAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeCategory, setActiveCategory] = useState<'network' | 'cyber' | 'prog' | 'cloud' | 'psych'>('network');

  // Selected Node State for dynamic details
  const [selectedNode, setSelectedNode] = useState<{
    title: string;
    category: string;
    protocolOrConcept: string;
    description: string;
    interviewQuestion: string;
    bestPractices: string;
  }>({
    title: 'Layer 7: Application Layer',
    category: 'Networking',
    protocolOrConcept: 'HTTP/3, HTTPS, DNS, SSH, WebSockets',
    description: 'Closest layer to the end user. Interfaces directly with user applications, browsers, and API endpoints.',
    interviewQuestion: 'Q: What is the difference between Layer 4 and Layer 7 Load Balancing?\nA: Layer 4 operates on IP/Port (TCP/UDP) with low latency. Layer 7 inspects HTTP headers, cookies, and URLs for smart routing and SSL termination.',
    bestPractices: 'Always enforce TLS 1.3, strict Content Security Policy (CSP), and HTTP Strict Transport Security (HSTS).'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">VisualAtlas</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  #atlas · Interactive Mind Maps & Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Clickable system diagrams: OSI Stack, Cyber Kill Chain, C Pointer Memory & K8s Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-all shadow cursor-pointer"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'network', label: '1. Networking: OSI & TCP Handshake', icon: Globe },
            { id: 'cyber', label: '2. Cyber: Kill Chain & MITRE Matrix', icon: Shield },
            { id: 'prog', label: '3. Programming: C Memory & Pointers', icon: Code2 },
            { id: 'cloud', label: '4. Cloud: Docker vs VM & K8s Control Plane', icon: Cloud },
            { id: 'psych', label: '5. Psychology: Communication & Threat Loop', icon: Brain }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
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

      {/* Main Content: Split Grid (Interactive Diagram Left + Live Inspector Right) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Diagram Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Interactive Architectural Diagram (Click Any Node)
            </span>
            <span className="text-[11px] text-slate-400">Click node to inspect</span>
          </div>

          {/* 1. Networking Diagram */}
          {activeCategory === 'network' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              {[
                { layer: 7, name: 'Application', proto: 'HTTP/3, DNS, SSH, WebSockets', desc: 'Direct software interface for end-user web applications.' },
                { layer: 6, name: 'Presentation', proto: 'TLS 1.3, JSON, UTF-8, Gzip', desc: 'Syntax negotiation, encryption, compression, and data translation.' },
                { layer: 5, name: 'Session', proto: 'RPC, Sockets, NetBIOS, PPTP', desc: 'Maintains, synchronizes, and terminates active network connections.' },
                { layer: 4, name: 'Transport', proto: 'TCP (Reliable SYN-ACK), UDP (Speed)', desc: 'Port addressing (0-65535), segment segmentation, flow and congestion control.' },
                { layer: 3, name: 'Network', proto: 'IPv4, IPv6, BGP, OSPF, ICMP', desc: 'Logical IP addressing, routing tables, and packet routing across networks.' },
                { layer: 2, name: 'Data Link', proto: 'Ethernet, ARP, MAC Addressing, VLAN', desc: 'Physical addressing (MAC), frames, switch forwarding, and collisions.' },
                { layer: 1, name: 'Physical', proto: 'Fiber Optic, Cat6a, Wi-Fi 6E, Bits (0/1)', desc: 'Raw electrical, optical, and radio bit transmissions over physical media.' }
              ].map((l) => (
                <div
                  key={l.layer}
                  onClick={() =>
                    setSelectedNode({
                      title: `Layer ${l.layer}: ${l.name} Layer`,
                      category: 'Networking',
                      protocolOrConcept: l.proto,
                      description: l.desc,
                      interviewQuestion: `Q: What occurs when a packet travels through Layer ${l.layer} (${l.name})?\nA: Data encapsulation adds the Layer ${l.layer} header containing addressing metadata (${l.proto}) before handing it to Layer ${l.layer - 1 || 'wire'}.`,
                      bestPractices: `Ensure Layer ${l.layer} firewalls and MTU boundaries are aligned across all network hops.`
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedNode.title.includes(l.name)
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-cyan-600/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                      L{l.layer}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{l.name} Layer</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{l.proto}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* 2. Cyber Kill Chain Diagram */}
          {activeCategory === 'cyber' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2.5">
              {[
                { stage: '1. Reconnaissance', tactic: 'OSINT, DNS, LinkedIn, Shodan', defense: 'Minimize attack surface, enforce DNS privacy, remove public employee org charts.' },
                { stage: '2. Weaponization', tactic: 'Coupling exploit with benign PDF/DOCX', defense: 'Strict email sandboxing, disabling Office macros, endpoint threat prevention.' },
                { stage: '3. Delivery', tactic: 'Spear-phishing email or malvertising', defense: 'DMARC, SPF, anti-spoofing mail gates, employee phishing drills.' },
                { stage: '4. Exploitation', tactic: 'Buffer overflow or zero-day trigger', defense: 'Regular vulnerability patching, memory-safe languages, ASLR/DEP enforcement.' },
                { stage: '5. Installation', tactic: 'Web shell, persistence registry keys', defense: 'Immutable read-only filesystems, EDR monitoring autorun keys.' },
                { stage: '6. Command & Control (C2)', tactic: 'Encrypted beaconing over HTTPS / DNS tunneling', defense: 'Egress traffic filtering, DNS query frequency analysis, threat intel feeds.' },
                { stage: '7. Actions on Objectives', tactic: 'Data exfiltration or ransomware encryption', defense: 'Air-gapped offline backups, row-level encryption, Zero-Trust network segmentation.' }
              ].map((k, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedNode({
                      title: `Kill Chain Stage: ${k.stage}`,
                      category: 'Cybersecurity',
                      protocolOrConcept: `Threat Vector: ${k.tactic}`,
                      description: `Attacker objective during this phase: execute ${k.tactic} while avoiding detection.`,
                      interviewQuestion: `Q: At which Kill Chain stage is defensive intervention cheapest and most effective?\nA: Reconnaissance & Delivery. Stopping an adversary before payload execution prevents lateral network compromise.`,
                      bestPractices: k.defense
                    })
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedNode.title.includes(k.stage)
                      ? 'bg-rose-950/40 border-rose-400 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{k.stage}</h4>
                    <p className="text-[11px] text-slate-400">Tactic: {k.tactic}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    Defend
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 3. Programming: C Memory & Pointers */}
          {activeCategory === 'prog' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 font-mono text-xs">
              {[
                { segment: 'Stack Memory (High Address: 0x7FFF...)', usage: 'Local variables, function stack frames, return pointers. Automatically deallocated.', color: 'border-emerald-500 text-emerald-300' },
                { segment: 'Heap Memory (Dynamic malloc/free)', usage: 'Dynamically allocated via malloc(size). Must be manually freed to avoid memory leaks.', color: 'border-cyan-500 text-cyan-300' },
                { segment: 'BSS & Data Segment', usage: 'Uninitialized (BSS) and initialized global/static variables initialized at program startup.', color: 'border-indigo-500 text-indigo-300' },
                { segment: 'Text Segment (Code: 0x0040...)', usage: 'Compiled machine instructions (read-only executable). Write attempts trigger SIGSEGV.', color: 'border-purple-500 text-purple-300' }
              ].map((m, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedNode({
                      title: m.segment,
                      category: 'C Programming & OS Memory',
                      protocolOrConcept: 'Memory Layout of a C Program',
                      description: m.usage,
                      interviewQuestion: 'Q: What happens if a recursive function never terminates in C?\nA: It pushes infinite stack frames until it crosses stack limits, resulting in a fatal Stack Overflow crash.',
                      bestPractices: 'Always check if malloc() returned NULL, and set pointers to NULL after calling free() to eliminate dangling pointers.'
                    })
                  }
                  className={`p-4 rounded-xl border bg-slate-950 cursor-pointer transition-all ${m.color} ${
                    selectedNode.title.includes(m.segment.slice(0, 10)) ? 'ring-2 ring-cyan-400' : ''
                  }`}
                >
                  <div className="font-bold">{m.segment}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">{m.usage}</div>
                </div>
              ))}
            </div>
          )}

          {/* 4. Cloud: Docker vs VM & K8s Architecture */}
          {activeCategory === 'cloud' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              {[
                { name: 'K8s Control Plane: kube-apiserver', role: 'Central REST gateway. Authenticates and coordinates all cluster operations.', type: 'Master Component' },
                { name: 'K8s Storage: etcd (Raft)', role: 'Distributed high-availability key-value store containing entire cluster state.', type: 'Consistency Store' },
                { name: 'K8s Brain: kube-scheduler', role: 'Assigns unscheduled pods to optimal worker nodes based on CPU/RAM affinity.', type: 'Orchestrator' },
                { name: 'Node Agent: kubelet', role: 'Runs on every worker node. Ensures containers are running and healthy inside Pods.', type: 'Worker Daemon' },
                { name: 'Container Engine vs Hypervisor', role: 'Containers share Host Linux Kernel via cgroups/namespaces (Milliseconds startup vs minutes for VMs).', type: 'Virtualization' }
              ].map((c, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedNode({
                      title: c.name,
                      category: 'Cloud & Containers',
                      protocolOrConcept: c.type,
                      description: c.role,
                      interviewQuestion: 'Q: What happens if etcd crashes in a Kubernetes cluster?\nA: The existing workloads keep running on nodes, but the cluster cannot create new pods, scale, or handle node failures until etcd quorum recovers.',
                      bestPractices: 'Run etcd with an odd number of nodes (3 or 5) across multiple availability zones with daily snapshot backups.'
                    })
                  }
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.name}</h4>
                    <p className="text-[11px] text-slate-400">{c.role}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 5. Psychology & Human Communication */}
          {activeCategory === 'psych' && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              {[
                { stage: '1. Shannon-Weaver Communication Model', desc: 'Sender encodes message -> Transmits via channel -> Receiver decodes through internal noise filters.' },
                { stage: '2. The Amygdala Hijack (Fight/Flight)', desc: 'Under perceived threat or urgency, the emotional limbic system overrides prefrontal cortex rational logic.' },
                { stage: '3. Cognitive Load Theory', desc: 'Working memory can hold only 4-7 chunks of info. Complex architecture must be modularized into clean abstractions.' }
              ].map((p, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedNode({
                      title: p.stage,
                      category: 'Human Psychology',
                      protocolOrConcept: 'Cognitive Mechanism',
                      description: p.desc,
                      interviewQuestion: 'Q: How do scammers exploit the Amygdala Hijack?\nA: By injecting extreme artificial panic ("Account blocked in 15 mins"), forcing the victim to bypass logical evaluation.',
                      bestPractices: 'Implement institutional cooling-off periods and mandatory dual-approval for all high-value transactions.'
                    })
                  }
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <h4 className="text-xs font-bold text-purple-300">{p.stage}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Node Inspector / Knowledge Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Node Deep Dive Inspector
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Live Inspector
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sticky top-24">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{selectedNode.category}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedNode.title}</h3>
              <p className="text-xs font-mono text-slate-400 mt-1">{selectedNode.protocolOrConcept}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300">Architectural Description:</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {selectedNode.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Real Interview Question & Ideal Answer:
              </span>
              <div className="text-xs text-slate-200 leading-relaxed bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl whitespace-pre-line font-mono text-[11px]">
                {selectedNode.interviewQuestion}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Industry Best Practices:
              </span>
              <p className="text-xs text-emerald-300/90 leading-relaxed bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl">
                {selectedNode.bestPractices}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
