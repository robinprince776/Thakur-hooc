import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Shield,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw,
  Hash,
  Activity,
  CheckCircle2
} from 'lucide-react';

export interface CryptoMasterAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const CryptoMasterApp: React.FC<CryptoMasterAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'avalanche' | 'rsa' | 'pqc'>('avalanche');

  // Avalanche Effect State
  const [avalancheInput, setAvalancheInput] = useState('Hello World');
  const [currentHash, setCurrentHash] = useState('');
  const [referenceHash, setReferenceHash] = useState('');

  const computeSha256 = async (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  useEffect(() => {
    computeSha256(avalancheInput).then(setCurrentHash);
    computeSha256('Hello World').then(setReferenceHash);
  }, [avalancheInput]);

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text text-transparent">
                      CryptoMaster &amp; PQC
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      Post-Quantum Ready
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Avalanche effect visualizer, RSA math playground &amp; Post-Quantum Kyber
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
              { id: 'avalanche', label: '1. 🌊 Hash Avalanche Effect', icon: Hash },
              { id: 'rsa', label: '2. 🔑 RSA Prime Math Playground', icon: Lock },
              { id: 'pqc', label: '3. ⚛️ Post-Quantum Cryptography', icon: Sparkles }
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
        {/* TAB 1: AVALANCHE EFFECT */}
        {activeTab === 'avalanche' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">SHA-256 Avalanche Effect Visualizer</h2>
            <p className="text-xs text-slate-400">
              A strict cryptographic hash property: changing even a single bit in the plaintext input must unpredictably randomize roughly 50% of the output bits!
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Modify Input Text (Try changing 1 letter):</label>
                <input
                  type="text"
                  value={avalancheInput}
                  onChange={(e) => setAvalancheInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Hashes Comparison */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Current 256-Bit SHA Output:</span>
                  <div className="text-emerald-400 font-bold break-all text-sm mt-0.5">{currentHash}</div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Reference (&quot;Hello World&quot;):</span>
                  <div className="text-slate-400 break-all text-sm mt-0.5">{referenceHash}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RSA MATH */}
        {activeTab === 'rsa' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">RSA Public-Key Generation (Trapdoor Function)</h2>
            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 text-xs font-mono">
              <div className="space-y-2 text-slate-300">
                <div>1. Select 2 distinct secret prime numbers: <span className="text-cyan-400">p = 61, q = 53</span></div>
                <div>2. Compute Modulus: <span className="text-white">n = p * q = 61 * 53 = 3233</span> (Public Key Part)</div>
                <div>3. Compute Euler&apos;s Totient: <span className="text-white">&phi;(n) = (p-1)*(q-1) = 60 * 52 = 3120</span></div>
                <div>4. Choose Public Exponent: <span className="text-emerald-400">e = 17</span> (Coprime to 3120)</div>
                <div>5. Calculate Private Exponent d: <span className="text-rose-400">d = 2753</span> (Where (d * e) % &phi;(n) = 1)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-sans text-xs">
                💡 <strong>Trapdoor Math:</strong> Multiplying two large 2048-bit prime numbers takes milliseconds. Factoring the resulting 4096-bit composite number back into $p$ and $q$ takes billions of years on classical computers!
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PQC */}
        {activeTab === 'pqc' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">Post-Quantum Cryptography (NIST FIPS 203/204)</h2>
            <p className="text-slate-300 leading-relaxed">
              Shor&apos;s algorithm on future quantum computers will solve prime factorization and discrete logarithms in polynomial time, breaking RSA and Elliptic Curve (ECC) ciphers.
              NIST has officially standardized Lattice-Based Cryptography: <strong>ML-KEM (CRYSTALS-Kyber)</strong> for quantum-resistant key exchanges and <strong>ML-DSA (CRYSTALS-Dilithium)</strong> for digital signatures!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
