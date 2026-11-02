import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  HelpCircle,
  X,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ArrowRight,
  Key
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface OnionRoutingProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const OnionRoutingApp: React.FC<OnionRoutingProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'tor' | 'pgp'>('tor');
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Tor Circuit Simulator Step (0=Origin, 1=Guard, 2=Middle, 3=Exit, 4=Destination)
  const [circuitStep, setCircuitStep] = useState(0);

  // PGP State
  const [pgpText, setPgpText] = useState('Secret Message: Meet at rendezvous coordinates.');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [cipherText, setCipherText] = useState('');

  const handleNextHop = () => {
    setCircuitStep((prev) => (prev < 4 ? prev + 1 : 0));
  };

  const handlePgpEncrypt = () => {
    setIsEncrypted(true);
    setCipherText(
      '-----BEGIN PGP MESSAGE-----\nVersion: OpenPGP.js v5.1.0\n\nwcbE2N790v18PxsBA/9F8wR+3A7kK8l0LzJq9q4T0mN+...\n=G7xQ\n-----END PGP MESSAGE-----'
    );
  };

  const handlePgpDecrypt = () => {
    setIsEncrypted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🚀 Next-Gen Labs' },
          { label: 'Onion Routing & Dark Web Concepts' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Educational Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Educational & Academic Simulation Only:</strong> This module illustrates cryptography and onion routing mechanisms. It does not provide real access to hidden services or external networks.
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold shrink-0">Safe Sandbox</span>
      </div>

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Onion Routing & Cryptographic Privacy Lab
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                TOR & PGP ARCHITECTURE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Layered encryption peeling across 3-relay Tor circuits, perfect forward secrecy, and PGP asymmetric key exchanges.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplainModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Explain this Lab</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'tor', name: 'Tor 3-Hop Circuit Peeling', icon: Lock },
          { id: 'pgp', name: 'PGP Public/Private Key Exchange', icon: Key }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TOR CIRCUIT SIMULATOR */}
      {activeTab === 'tor' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Layered Onion Peeling Mechanism (Guard &rarr; Middle &rarr; Exit)</span>
            </h3>
            <p className="text-xs text-slate-400">
              The client wraps data in 3 layers of AES encryption. As the packet traverses each relay, that relay peels only its own layer using its symmetric key.
            </p>
          </div>

          {/* 5-Stage Circuit Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            {/* Stage 0: Client */}
            <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              circuitStep === 0
                ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 border-white/5 text-slate-400'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold">1. Origin Client</h4>
              <p className="text-[10px] font-mono text-cyan-400">3 Layers Encrypted</p>
            </div>

            {/* Stage 1: Guard Relay */}
            <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              circuitStep === 1
                ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 border-white/5 text-slate-400'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold">2. Guard Relay</h4>
              <p className="text-[10px] font-mono text-purple-300">Knows IP: Client &rarr; Middle</p>
            </div>

            {/* Stage 2: Middle Relay */}
            <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              circuitStep === 2
                ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 border-white/5 text-slate-400'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold">3. Middle Relay</h4>
              <p className="text-[10px] font-mono text-amber-300">Knows IP: Guard &rarr; Exit</p>
            </div>

            {/* Stage 3: Exit Relay */}
            <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              circuitStep === 3
                ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 border-white/5 text-slate-400'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Unlock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold">4. Exit Relay</h4>
              <p className="text-[10px] font-mono text-rose-300">Peels Final Layer</p>
            </div>

            {/* Stage 4: Destination Server */}
            <div className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              circuitStep === 4
                ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/60 border-white/5 text-slate-400'
            }`}>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold">5. Web Destination</h4>
              <p className="text-[10px] font-mono text-emerald-300">Sees Exit Relay IP</p>
            </div>
          </div>

          {/* Hop Progress Explanation Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
              Circuit Step {circuitStep + 1} of 5:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              {circuitStep === 0 && 'Client encrypts payload with Key_Exit, then Key_Middle, then Key_Guard. Packet contains 3 concentric shells.'}
              {circuitStep === 1 && 'Guard Relay receives packet, decrypts outer layer with Key_Guard. Discovers packet must be forwarded to Middle Relay. Cannot read inner payload.'}
              {circuitStep === 2 && 'Middle Relay receives packet from Guard Relay, peels second layer with Key_Middle. Discovers packet must go to Exit Relay. Does not know client origin.'}
              {circuitStep === 3 && 'Exit Relay peels final layer with Key_Exit. Obtains the plaintext HTTP request. Destination website only sees Exit Relay IP address.'}
              {circuitStep === 4 && 'Target website receives request from Exit node. The entire connection chain is complete; no single relay knew both origin and destination!'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleNextHop}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Step Next Hop & Peel Layer &rarr;</span>
            </button>

            <button
              onClick={() => setCircuitStep(0)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PGP ASYMMETRIC ENCRYPTION */}
      {activeTab === 'pgp' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Pretty Good Privacy (PGP) Asymmetric Cryptography</span>
            </h3>
            <p className="text-xs text-slate-400">
              Encrypt with recipient's Public Key; decrypt ONLY with recipient's Private Key.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-300 block">
                Plaintext Message:
              </label>
              <textarea
                value={pgpText}
                onChange={(e) => setPgpText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl os-glass-input text-xs font-mono"
              />
              <button
                onClick={handlePgpEncrypt}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white cursor-pointer shadow-md shadow-cyan-600/30 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypt with Recipient Public Key</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-mono text-slate-300 block">
                Encrypted Armored Ciphertext:
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-cyan-400 h-28 overflow-y-auto no-scrollbar">
                {isEncrypted ? cipherText : 'Message not yet encrypted.'}
              </div>
              {isEncrypted && (
                <button
                  onClick={handlePgpDecrypt}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Decrypt with Private Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EXPLAIN MODAL */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Privacy & Anonymity Network Principles</span>
              </h2>
              <button
                onClick={() => setShowExplainModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>Why 3 Hops?</strong> If there was only 1 relay (like a basic VPN), that single relay knows who you are AND where you are going. With 3 hops, Guard only knows origin, Middle knows relays, and Exit only knows destination.
              </p>
              <p>
                • <strong>Exit Node Vulnerability:</strong> While the connection between you and the exit node is encrypted, traffic from the exit node to the destination website is plaintext unless HTTPS is used.
              </p>
              <p>
                • <strong>Timing Attacks:</strong> Adversaries monitoring both the entrance guard node and exit node simultaneously can correlate packet traffic volume to deanonymize users.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
