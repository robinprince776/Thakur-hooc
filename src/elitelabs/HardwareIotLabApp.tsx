import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Zap,
  HelpCircle,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Layers
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface HardwareIotLabProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

interface PinInfo {
  number: number;
  name: string;
  type: 'GPIO' | 'Power' | 'Ground' | 'I2C' | 'SPI' | 'UART';
  description: string;
}

const RPI_PINS: PinInfo[] = [
  { number: 1, name: '3.3V Power', type: 'Power', description: 'Constant 3.3V DC power supply (max 50mA)' },
  { number: 2, name: '5V Power', type: 'Power', description: 'Direct 5V power bus from USB-C input' },
  { number: 3, name: 'GPIO 2 (SDA1)', type: 'I2C', description: 'I2C Serial Data line with 1.8k pull-up' },
  { number: 4, name: '5V Power', type: 'Power', description: 'Second 5V power rail for high-current peripherals' },
  { number: 5, name: 'GPIO 3 (SCL1)', type: 'I2C', description: 'I2C Serial Clock line with 1.8k pull-up' },
  { number: 6, name: 'Ground', type: 'Ground', description: '0V Reference ground plane' },
  { number: 7, name: 'GPIO 4 (GPCLK0)', type: 'GPIO', description: 'General Purpose Clock output 0' },
  { number: 8, name: 'GPIO 14 (TXD)', type: 'UART', description: 'UART serial transmit data line' },
  { number: 9, name: 'Ground', type: 'Ground', description: 'Ground pin for return signals' },
  { number: 10, name: 'GPIO 15 (RXD)', type: 'UART', description: 'UART serial receive data line' },
  { number: 19, name: 'GPIO 10 (MOSI)', type: 'SPI', description: 'SPI Master Out Slave In line' },
  { number: 21, name: 'GPIO 9 (MISO)', type: 'SPI', description: 'SPI Master In Slave Out line' },
  { number: 23, name: 'GPIO 11 (SCLK)', type: 'SPI', description: 'SPI Serial Clock bus' }
];

export const HardwareIotLabApp: React.FC<HardwareIotLabProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'pinout' | 'breadboard' | 'flipper'>('pinout');
  const [showConceptModal, setShowConceptModal] = useState(false);

  // Selected Pin State
  const [selectedPin, setSelectedPin] = useState<PinInfo>(RPI_PINS[2]);

  // Virtual Breadboard Circuit State
  const [hasBattery, setHasBattery] = useState(true);
  const [hasResistor, setHasResistor] = useState(true);
  const [hasLed, setHasLed] = useState(true);
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);

  // Flipper Zero demo state
  const [activeFrequency, setActiveFrequency] = useState<'rfid' | 'nfc' | 'subghz' | 'ir'>('rfid');

  // Breadboard circuit calculation
  const isCircuitComplete = hasBattery && hasLed && isSwitchClosed;
  const isLedBurnedOut = isCircuitComplete && !hasResistor;
  const isLedGlowing = isCircuitComplete && hasResistor;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🧪 Elite Labs' },
          { label: 'Hardware & IoT Lab' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Hardware & IoT Lab
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EMBEDDED SYSTEMS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive 40-pin GPIO pinouts, virtual breadboard circuit sandbox, and Flipper Zero wireless frequencies.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConceptModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Learn Concept</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'pinout', name: 'Raspberry Pi GPIO Pinout', icon: Cpu },
          { id: 'breadboard', name: 'Virtual Breadboard Sandbox', icon: Zap },
          { id: 'flipper', name: 'Flipper Zero Signals (RFID / NFC)', icon: Radio }
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

      {/* TAB 1: PINOUT VIEWER */}
      {activeTab === 'pinout' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Raspberry Pi 4 40-Pin Header Layout</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Click pin to inspect</span>
            </div>

            {/* Pin Grid Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {RPI_PINS.map((pin) => {
                const isSelected = selectedPin.number === pin.number;
                const typeColors: Record<string, string> = {
                  Power: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
                  Ground: 'bg-slate-900 border-slate-700 text-slate-300',
                  I2C: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
                  SPI: 'bg-purple-950/60 border-purple-500/40 text-purple-300',
                  UART: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
                  GPIO: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                };

                return (
                  <button
                    key={pin.number}
                    onClick={() => setSelectedPin(pin)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      typeColors[pin.type]
                    } ${isSelected ? 'ring-2 ring-white scale-102 shadow-lg' : 'hover:scale-101 opacity-80 hover:opacity-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold">PIN {pin.number}</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-black/40">{pin.type}</span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1 truncate">{pin.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Pin Details */}
          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Pin Technical Datasheet
            </span>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-black text-cyan-400">
                  PIN #{selectedPin.number}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedPin.type}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{selectedPin.name}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedPin.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono space-y-1">
                <div>Max Output Voltage: 3.3V DC (Do NOT inject 5V into GPIO)</div>
                <div>Default State: High-impedance input with internal pull-up/down</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIRTUAL BREADBOARD SANDBOX */}
      {activeTab === 'breadboard' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Interactive Breadboard Circuit Sandbox</span>
            </h3>
            <p className="text-xs text-slate-400">
              Toggle components into the circuit. Ohm's Law (V = IR): Connecting an LED directly to a 9V source without a 220Ω resistor causes overcurrent burnout!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circuit Canvas Simulation */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center">
                {/* Visual LED */}
                <div
                  className={`w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center font-bold text-xs ${
                    isLedBurnedOut
                      ? 'bg-rose-950 border-2 border-rose-500 text-rose-300 animate-pulse'
                      : isLedGlowing
                      ? 'bg-emerald-500 shadow-2xl shadow-emerald-400 text-slate-950 scale-110'
                      : 'bg-slate-800 text-slate-500 border border-slate-600'
                  }`}
                >
                  {isLedBurnedOut ? '💥 BURNED' : isLedGlowing ? '✨ GLOWING' : 'OFF'}
                </div>
              </div>

              {/* Status Alert */}
              {isLedBurnedOut ? (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Burnout Warning: Excessive current (I &gt; 40mA)! Add a 220Ω resistor.</span>
                </div>
              ) : isLedGlowing ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Safe Circuit: V = 9V, R = 220Ω, Current ≈ 20mA. LED is glowing safely.</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  Circuit Open. Close the switch to complete the loop.
                </div>
              )}
            </div>

            {/* Component Switches */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Circuit Components Toggle
              </span>

              <div
                onClick={() => setHasBattery(!hasBattery)}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-850"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">9V DC Battery Source</h4>
                  <p className="text-[10px] text-slate-400">Electromotive power supply</p>
                </div>
                {hasBattery ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
              </div>

              <div
                onClick={() => setHasResistor(!hasResistor)}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-850"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">220Ω Current-Limiting Resistor</h4>
                  <p className="text-[10px] text-slate-400">Protects semiconductor junction</p>
                </div>
                {hasResistor ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
              </div>

              <div
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-850"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">Push Button Switch</h4>
                  <p className="text-[10px] text-slate-400">Completes the electrical path</p>
                </div>
                {isSwitchClosed ? <ToggleRight className="w-6 h-6 text-cyan-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLIPPER ZERO CONCEPTS */}
      {activeTab === 'flipper' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Wireless Frequencies & Signal Protocols</span>
            </h3>
            <p className="text-xs text-slate-400">
              Educational analysis of multi-tool protocols: 125kHz RFID access cards, 13.56MHz NFC smart cards, and 433MHz Sub-1GHz radio transmissions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'rfid', label: '125 kHz RFID', desc: 'EM4100 / HID Prox cards' },
              { id: 'nfc', label: '13.56 MHz NFC', desc: 'Mifare Classic / NTAG215' },
              { id: 'subghz', label: '433 MHz Sub-1GHz', desc: 'Gate remotes & weather stations' },
              { id: 'ir', label: 'Infrared (IR)', desc: '38 kHz NEC TV & AC protocols' }
            ].map((freq) => (
              <button
                key={freq.id}
                onClick={() => setActiveFrequency(freq.id as any)}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeFrequency === freq.id
                    ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{freq.label}</div>
                <div className="text-[10px] text-slate-400">{freq.desc}</div>
              </button>
            ))}
          </div>

          {/* Frequency Insight */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
              Frequency Protocol Specifications
            </span>
            {activeFrequency === 'rfid' && (
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p>• <strong>Low Frequency (125 kHz):</strong> Magnetic induction powers the passive coil in the badge.</p>
                <p>• <strong>Data Encoding:</strong> Manchester or Biphase encoding transmitting a 26-bit to 37-bit Facility Code + Card ID.</p>
                <p>• <strong>Vulnerability:</strong> Traditional 125kHz badges have NO mutual authentication; any reader can read the UID.</p>
              </div>
            )}
            {activeFrequency === 'nfc' && (
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p>• <strong>High Frequency (13.56 MHz):</strong> ISO/IEC 14443 Type A/B smart cards and Apple/Google Pay tokens.</p>
                <p>• <strong>Security:</strong> Supports AES-128 cryptographic handshakes (Mifare DESFire) to prevent simple UID cloning.</p>
              </div>
            )}
            {activeFrequency === 'subghz' && (
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p>• <strong>Sub-1GHz (300 MHz - 928 MHz):</strong> Used for long-range ISM band garage remotes, IoT sensors, and pagers.</p>
                <p>• <strong>Modulation:</strong> AM (ASK/OOK) and FM (FSK) with Keeloq rolling code algorithms.</p>
              </div>
            )}
            {activeFrequency === 'ir' && (
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <p>• <strong>Infrared Pulse (940nm Wavelength):</strong> Pulsed at 36-40kHz carrier frequency to prevent ambient light interference.</p>
                <p>• <strong>Decoders:</strong> NEC, RC-5, and Sony SIRC pulse-distance demodulation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEARN CONCEPT MODAL */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Embedded Hardware Principles</span>
              </h2>
              <button
                onClick={() => setShowConceptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>GPIO Voltage Levels:</strong> Raspberry Pi operates on 3.3V TTL logic. Connecting a 5V sensor directly will permanently damage the SoC.
              </p>
              <p>
                • <strong>Pull-Up vs Pull-Down:</strong> Floating input pins pick up ambient electromagnetic noise. Internal resistors tie the line to VCC or GND.
              </p>
              <p>
                • <strong>I2C vs SPI:</strong> I2C uses 2 wires (SDA, SCL) and supports 127 devices with addressing. SPI uses 4 wires and is faster for displays.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
