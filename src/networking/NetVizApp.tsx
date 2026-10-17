import React, { useState, useMemo } from 'react';
import {
  Globe,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Zap,
  Server,
  Play,
  RotateCcw,
  CheckCircle2,
  Lock,
  Search
} from 'lucide-react';

export interface NetVizAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const NetVizApp: React.FC<NetVizAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'osi' | 'tcp' | 'dns' | 'subnet'>('osi');

  // TCP Handshake State
  const [handshakeStep, setHandshakeStep] = useState(0);

  // Subnet Calculator State
  const [ipInput, setIpInput] = useState('192.168.1.10');
  const [cidrMask, setCidrMask] = useState(24);

  const subnetCalc = useMemo(() => {
    const totalHosts = Math.pow(2, 32 - cidrMask);
    const usableHosts = Math.max(0, totalHosts - 2);
    return {
      totalHosts,
      usableHosts,
      subnetMask: cidrMask === 24 ? '255.255.255.0' : cidrMask === 16 ? '255.255.0.0' : cidrMask === 28 ? '255.255.255.240' : '255.255.255.128',
      wildcardMask: cidrMask === 24 ? '0.0.0.255' : '0.0.255.255'
    };
  }, [cidrMask]);

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                      Networking Visualizer
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      OSI &amp; Protocols
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Interactive OSI 7-Layer model, TCP 3-way handshake &amp; DNS resolution
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
              { id: 'osi', label: '1. 🏛️ OSI 7-Layer Model', icon: Layers },
              { id: 'tcp', label: '2. 🤝 TCP 3-Way Handshake', icon: Activity },
              { id: 'dns', label: '3. 🌐 DNS Resolution Flow', icon: Globe },
              { id: 'subnet', label: '4. 🧮 Subnet CIDR Calculator', icon: Server }
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
        {/* TAB 1: OSI MODEL */}
        {activeTab === 'osi' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">The OSI 7-Layer Architectural Stack &amp; Security Threats</h2>
            <div className="space-y-3">
              {[
                { layer: 'Layer 7: Application', pdu: 'Data', protocols: 'HTTP/HTTPS, DNS, SSH, FTP', threat: 'SQLi, XSS, CSRF, Log4j', color: 'text-rose-400' },
                { layer: 'Layer 6: Presentation', pdu: 'Data', protocols: 'TLS/SSL, ASCII, JSON, JPEG', threat: 'SSL Stripping, Encoding bypass', color: 'text-amber-400' },
                { layer: 'Layer 5: Session', pdu: 'Data', protocols: 'RPC, NetBIOS, Sockets, PPTP', threat: 'Session Hijacking, Man-in-the-Middle', color: 'text-yellow-400' },
                { layer: 'Layer 4: Transport', pdu: 'Segment (TCP) / Datagram (UDP)', protocols: 'TCP, UDP, SCTP, QUIC', threat: 'SYN Flood DDoS, Port Scanning', color: 'text-emerald-400' },
                { layer: 'Layer 3: Network', pdu: 'Packet', protocols: 'IPv4, IPv6, ICMP, IPsec, BGP', threat: 'IP Spoofing, Smurf Attack, BGP Hijack', color: 'text-cyan-400' },
                { layer: 'Layer 2: Data Link', pdu: 'Frame', protocols: 'Ethernet (802.3), Wi-Fi (802.11), ARP', threat: 'ARP Poisoning, MAC Flooding, Evil Twin', color: 'text-blue-400' },
                { layer: 'Layer 1: Physical', pdu: 'Bits (Signals)', protocols: 'Fiber optic cables, Cat6, RJ45, Radio waves', threat: 'Wiretapping, Fiber tapping, Cable cutting', color: 'text-purple-400' }
              ].map((l, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className={`font-black text-sm ${l.color}`}>{l.layer}</span>
                    <p className="text-slate-300 font-mono mt-0.5">Protocols: {l.protocols}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                      PDU: {l.pdu}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-bold">
                      Threat: {l.threat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TCP 3-WAY HANDSHAKE */}
        {activeTab === 'tcp' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">TCP 3-Way Handshake Connection Lifecycle</h2>
                <p className="text-xs text-slate-400 mt-1">Reliable, ordered transmission initiation between Client and Server.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHandshakeStep(0)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setHandshakeStep((prev) => Math.min(2, prev + 1))}
                  disabled={handshakeStep === 2}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Next Step &rarr;
                </button>
              </div>
            </div>

            {/* Handshake Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-5 text-xs font-mono">
              <div className="grid grid-cols-2 text-center text-sm font-bold border-b border-slate-700 pb-3">
                <span className="text-cyan-400">Client (192.168.1.50:49210)</span>
                <span className="text-emerald-400">Server (142.250.190.46:443)</span>
              </div>

              {/* Step 1: SYN */}
              <div className={`p-4 rounded-xl border transition-all ${
                handshakeStep >= 0 ? 'bg-cyan-950/40 border-cyan-500 text-white' : 'opacity-30'
              }`}>
                <div className="flex justify-between font-bold">
                  <span>1. SYN (Synchronize)</span>
                  <span className="text-cyan-400">&rarr; Client to Server</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Client proposes Initial Sequence Number (ISN): `Seq = 1000`. Flag: `[SYN]`. Window size: 65535.
                </div>
              </div>

              {/* Step 2: SYN-ACK */}
              <div className={`p-4 rounded-xl border transition-all ${
                handshakeStep >= 1 ? 'bg-emerald-950/40 border-emerald-500 text-white' : 'opacity-30'
              }`}>
                <div className="flex justify-between font-bold">
                  <span>2. SYN-ACK (Synchronize-Acknowledge)</span>
                  <span className="text-emerald-400">&larr; Server to Client</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Server acknowledges client seq (`Ack = 1001`) and sets its own sequence (`Seq = 5000`). Flags: `[SYN, ACK]`.
                </div>
              </div>

              {/* Step 3: ACK */}
              <div className={`p-4 rounded-xl border transition-all ${
                handshakeStep >= 2 ? 'bg-purple-950/40 border-purple-500 text-white' : 'opacity-30'
              }`}>
                <div className="flex justify-between font-bold">
                  <span>3. ACK (Acknowledge - Established)</span>
                  <span className="text-purple-400">&rarr; Client to Server</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-1">
                  Client confirms receipt (`Ack = 5001`, `Seq = 1001`). State becomes `ESTABLISHED`. Data payload transmission begins!
                </div>
              </div>

              {/* Defensive Tip */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-sans">
                🛡️ <strong>Defensive Insight (SYN Flood Attack):</strong> If an attacker sends millions of SYN packets with spoofed IPs without sending the final ACK, the server RAM buffer fills with half-open connections. Modern OS kernels defend against this using <strong>SYN Cookies</strong>, encoding connection state directly inside the ISN without allocating RAM!
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DNS FLOW */}
        {activeTab === 'dns' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Recursive DNS Resolution Path</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { step: '1. Local Browser Cache', desc: 'Checks internal DNS cache in memory (Chrome/Firefox holds DNS records for 60 seconds).' },
                { step: '2. OS Hosts File & Resolver Cache', desc: 'Checks local `/etc/hosts` (Linux/Mac) or `C:\\Windows\\System32\\drivers\\etc\\hosts` (Windows).' },
                { step: '3. Recursive Resolver (ISP or 1.1.1.1)', desc: 'Queries your configured recursive DNS server. If not cached, the recursive resolver walks the hierarchy.' },
                { step: '4. Root Name Servers (.)', desc: '13 global root server IP clusters direct the resolver to the appropriate Top-Level Domain (TLD) servers.' },
                { step: '5. TLD Name Servers (.com / .org)', desc: 'Directs the resolver to the authoritative name servers of the specific domain registrar.' },
                { step: '6. Authoritative Name Server', desc: 'Provides the genuine A record (IPv4: e.g. 142.250.190.46) with a Time-To-Live (TTL).' }
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-cyan-400">{s.step}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUBNET CALCULATOR */}
        {activeTab === 'subnet' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">IPv4 Subnet &amp; CIDR Range Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">IP Address</label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">CIDR Prefix: /{cidrMask}</label>
                  <input
                    type="range"
                    min="16"
                    max="30"
                    value={cidrMask}
                    onChange={(e) => setCidrMask(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Subnet Mask:</span>
                  <span className="text-cyan-400 font-bold">{subnetCalc.subnetMask}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Host Addresses:</span>
                  <span className="text-white">{subnetCalc.totalHosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Usable Hosts Range:</span>
                  <span className="text-emerald-400 font-bold">{subnetCalc.usableHosts.toLocaleString()} IPs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
