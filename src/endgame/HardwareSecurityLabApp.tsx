import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  CircuitBoard,
  Binary,
  ArrowLeft,
  LayoutGrid,
  Zap,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Award,
  Info,
} from 'lucide-react';
import { useGamificationStore } from '../store/useGamificationStore';

interface HardwareSecurityLabAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher: () => void;
}

type HardwareTab = 'breadboard' | 'rfid' | 'gpio' | 'firmware';
type PartType = 'wire' | 'resistor' | 'led';

interface BreadboardSlots {
  slotA: PartType | null; // Between 5V Rail and Mid Node
  slotB: PartType | null; // Between Mid Node and GND Rail
  ledPolarity: 'forward' | 'reversed';
}

interface GpioPin {
  pin: number;
  label: string;
  role: 'Power' | 'Ground' | 'GPIO' | 'I2C' | 'SPI' | 'UART' | 'Analog';
  voltage: string;
  desc: string;
  securityNote: string;
}

const PI_PINS: GpioPin[] = [
  { pin: 1, label: '3V3 Power', role: 'Power', voltage: '3.3V DC', desc: 'Regulated 3.3V supply rail for low-power sensors and logic.', securityNote: 'Never short to GND or feed 5V back into this rail.' },
  { pin: 2, label: '5V Power', role: 'Power', voltage: '5.0V DC', desc: 'Direct 5V rail from USB-C input power.', securityNote: 'Never connect 5V directly to a 3.3V Raspberry Pi GPIO input.' },
  { pin: 3, label: 'GPIO 2 (SDA)', role: 'I2C', voltage: '3.3V', desc: 'I2C Data line with built-in 1.8kΩ pull-up resistor.', securityNote: 'Exposed I2C buses on consumer IoT devices can leak EEPROM configuration.' },
  { pin: 4, label: '5V Power', role: 'Power', voltage: '5.0V DC', desc: 'Secondary 5V power supply pin for external hats.', securityNote: 'Use fuse/current protection on external boards.' },
  { pin: 5, label: 'GPIO 3 (SCL)', role: 'I2C', voltage: '3.3V', desc: 'I2C Clock line; also supports hardware wake-from-halt.', securityNote: 'Disable unused I2C interfaces in /boot/config.txt on production units.' },
  { pin: 6, label: 'GND', role: 'Ground', voltage: '0V', desc: 'Common reference ground plane.', securityNote: 'Always share common GND between controller and peripheral logic.' },
  { pin: 7, label: 'GPIO 4 (GPCLK0)', role: 'GPIO', voltage: '3.3V', desc: 'General-purpose I/O & 1-Wire default pin.', securityNote: 'Restrict /dev/gpiomem permissions to non-root hardware groups.' },
  { pin: 8, label: 'GPIO 14 (UART TX)', role: 'UART', voltage: '3.3V', desc: 'Serial console transmit pin.', securityNote: 'CRITICAL: Disable serial root login shell on production IoT hardware.' },
  { pin: 9, label: 'GND', role: 'Ground', voltage: '0V', desc: 'Common ground reference.', securityNote: 'Essential for clean UART/SPI signal integrity.' },
  { pin: 10, label: 'GPIO 15 (UART RX)', role: 'UART', voltage: '3.3V', desc: 'Serial console receive pin.', securityNote: 'Hardware defenders remove debug header pins or lock bootloader UART.' },
  { pin: 11, label: 'GPIO 17', role: 'GPIO', voltage: '3.3V', desc: 'Standard digital GPIO pin (input/output).', securityNote: 'Debounce hardware buttons to prevent glitching.' },
  { pin: 12, label: 'GPIO 18 (PCM_CLK)', role: 'GPIO', voltage: '3.3V', desc: 'Hardware PWM0 & I2S audio clock.', securityNote: 'Hardware PWM drives servos and buzzers reliably.' },
  { pin: 19, label: 'GPIO 10 (MOSI)', role: 'SPI', voltage: '3.3V', desc: 'SPI Master Out Slave In data channel.', securityNote: 'SPI flash chips often store unencrypted firmware unless secure boot is enabled.' },
  { pin: 21, label: 'GPIO 9 (MISO)', role: 'SPI', voltage: '3.3V', desc: 'SPI Master In Slave Out data channel.', securityNote: 'Protect SPI flash with read-out protection and signed firmware images.' },
  { pin: 23, label: 'GPIO 11 (SCLK)', role: 'SPI', voltage: '3.3V', desc: 'SPI Serial Clock line.', securityNote: 'Clock timing consistency prevents bus errors.' },
  { pin: 25, label: 'GND', role: 'Ground', voltage: '0V', desc: 'Ground reference near SPI header.', securityNote: 'Keep SPI return paths short to reduce EMI.' },
];

const ARDUINO_PINS: GpioPin[] = [
  { pin: 1, label: '5V', role: 'Power', voltage: '5.0V DC', desc: 'Regulated 5V output from onboard voltage regulator.', securityNote: 'Always use a 220Ω–330Ω resistor in series with LEDs.' },
  { pin: 2, label: '3.3V', role: 'Power', voltage: '3.3V DC', desc: '50mA regulated 3.3V output for RFID/Wi-Fi modules.', securityNote: 'Exceeding 50mA draw can brown-out the microcontroller.' },
  { pin: 3, label: 'GND', role: 'Ground', voltage: '0V', desc: 'Circuit ground reference.', securityNote: 'Direct 5V-to-GND bridge causes immediate short-circuit damage.' },
  { pin: 4, label: 'A0 (ADC)', role: 'Analog', voltage: '0-5V', desc: '10-bit Analog-to-Digital Converter (0–1023).', securityNote: 'Sanitize noisy analog sensor readings before triggering actuators.' },
  { pin: 5, label: 'A4 (SDA)', role: 'I2C', voltage: '5V', desc: 'I2C Data line for OLED screens & RTC modules.', securityNote: 'Use logic-level shifters when pairing with 3.3V sensors.' },
  { pin: 6, label: 'A5 (SCL)', role: 'I2C', voltage: '5V', desc: 'I2C Clock line.', securityNote: 'Avoid unauthenticated I2C sensor spoofing in safety-critical loops.' },
  { pin: 7, label: 'D0 (RX)', role: 'UART', voltage: '5V', desc: 'Hardware Serial Receive connected to USB bridge.', securityNote: 'Disconnect external peripherals on D0/D1 during firmware flashing.' },
  { pin: 8, label: 'D1 (TX)', role: 'UART', voltage: '5V', desc: 'Hardware Serial Transmit.', securityNote: 'Do not print secret keys or debug tokens over serial in production.' },
  { pin: 9, label: 'D9 (PWM~)', role: 'GPIO', voltage: '5V', desc: '8-bit PWM output pin.', securityNote: 'Use transistor drivers for high-current motors or relays.' },
  { pin: 10, label: 'D10 (SS)', role: 'SPI', voltage: '5V', desc: 'SPI Slave Select (used by RC522 RFID readers).', securityNote: 'Verify SPI chip-select timing when multiplexing peripherals.' },
  { pin: 11, label: 'D11 (MOSI)', role: 'SPI', voltage: '5V', desc: 'SPI Master Out Slave In.', securityNote: 'Lock ATmega fuse bits to prevent unauthorized flash readout.' },
  { pin: 12, label: 'D13 (LED/SCK)', role: 'SPI', voltage: '5V', desc: 'SPI Clock & onboard status LED.', securityNote: 'Great for heartbeat status without leaking sensitive telemetry.' },
];

interface FirmwareRegion {
  id: string;
  offset: string;
  hex: string;
  ascii: string;
  label: string;
  risk: 'Safe' | 'Info' | 'Warning';
  explanation: string;
}

const FIRMWARE_HEX_ROWS: FirmwareRegion[] = [
  {
    id: 'hdr',
    offset: '0x00000000',
    hex: '7F 45 4C 46 01 01 01 00 00 00 00 00 00 00 00 00',
    ascii: '.ELF............',
    label: 'ELF Magic Header (7F 45 4C 46)',
    risk: 'Info',
    explanation:
      'Every Linux/embedded ELF binary starts with magic bytes 0x7F "ELF". Byte 0x04 = 01 indicates 32-bit ARM/MIPS; Byte 0x05 = 01 indicates Little-Endian.',
  },
  {
    id: 'sqfs',
    offset: '0x00004000',
    hex: '68 73 71 73 14 00 00 00 A2 6B 19 67 00 00 02 00',
    ascii: 'hsqs.....k.g....',
    label: 'SquashFS Filesystem Signature (hsqs)',
    risk: 'Info',
    explanation:
      'Bytes "hsqs" (little-endian SquashFS) mark the start of a compressed read-only root filesystem commonly found in routers and IP cameras.',
  },
  {
    id: 'cfg',
    offset: '0x00008120',
    hex: '55 41 52 54 5F 44 45 42 55 47 3D 31 0A 00 00 00',
    ascii: 'UART_DEBUG=1....',
    label: 'Hardcoded Debug Flag Enabled',
    risk: 'Warning',
    explanation:
      'ASCII string "UART_DEBUG=1" reveals that a developer left the serial debug console turned on in a release image. Remediation: strip debug flags in CI release builds.',
  },
  {
    id: 'cred',
    offset: '0x00008140',
    hex: '64 65 66 61 75 6C 74 5F 70 69 6E 3D 30 30 30 30',
    ascii: 'default_pin=0000',
    label: 'Static Factory PIN in Plaintext',
    risk: 'Warning',
    explanation:
      'Plaintext factory credentials embedded in firmware affect every shipped unit. Remediation: provision unique per-device random secrets during manufacturing.',
  },
  {
    id: 'sig',
    offset: '0x0000FF00',
    hex: '53 49 47 5F 45 43 44 53 41 5F 50 32 35 36 5F 4F',
    ascii: 'SIG_ECDSA_P256_O',
    label: 'Signed Boot Verification Block',
    risk: 'Safe',
    explanation:
      'Hardware Secure Boot verifies an ECDSA P-256 signature against a public key fused in OTP memory before running the firmware image.',
  },
];

export const HardwareSecurityLabApp: React.FC<HardwareSecurityLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const { addXp, unlockBadge, xp } = useGamificationStore();
  const [activeTab, setActiveTab] = useState<HardwareTab>('breadboard');
  const [xpNotice, setXpNotice] = useState<string | null>(null);

  // Breadboard state
  const [slots, setSlots] = useState<BreadboardSlots>({
    slotA: null,
    slotB: null,
    ledPolarity: 'forward',
  });
  const [selectedPart, setSelectedPart] = useState<PartType>('resistor');
  const [dragPart, setDragPart] = useState<PartType | null>(null);

  // RFID comparison state
  const [rfidStage, setRfidStage] = useState<'lf125' | 'mifare' | 'desfire'>('lf125');

  // GPIO Explorer state
  const [boardType, setBoardType] = useState<'pi' | 'arduino'>('pi');
  const pins = boardType === 'pi' ? PI_PINS : ARDUINO_PINS;
  const [selectedPin, setSelectedPin] = useState<GpioPin>(PI_PINS[7]);

  // Firmware hex inspector state
  const [selectedHex, setSelectedHex] = useState<FirmwareRegion>(FIRMWARE_HEX_ROWS[0]);
  const [inspectedHexIds, setInspectedHexIds] = useState<Record<string, boolean>>({ hdr: true });

  const awardHardwareXp = (amount: number, label: string, activityId: string) => {
    const res = addXp(amount, label, activityId);
    if (res.added) {
      setXpNotice(`+${amount} XP · ${label}`);
      window.setTimeout(() => setXpNotice(null), 2600);
    }
  };

  // Evaluate virtual circuit
  const evaluateCircuit = () => {
    const { slotA, slotB, ledPolarity } = slots;
    if (!slotA && !slotB) {
      return { status: 'open' as const, title: 'Open Circuit', detail: 'Place a 220Ω Resistor and an LED across Slot A and Slot B to complete the path from 5V to GND.' };
    }
    if (!slotA || !slotB) {
      return { status: 'open' as const, title: 'Incomplete Path', detail: 'Both Slot A (5V → Mid) and Slot B (Mid → GND) need components for current to flow.' };
    }
    if (slotA === 'wire' && slotB === 'wire') {
      return { status: 'short' as const, title: 'SHORT CIRCUIT DETECTED (5V → GND)', detail: 'Direct wire bridge between 5V and GND creates near-zero resistance! Real hardware would trip polyfuse or burn traces.' };
    }
    if ((slotA === 'led' && slotB === 'wire') || (slotA === 'wire' && slotB === 'led')) {
      return { status: 'short' as const, title: 'OVERCURRENT BURNOUT (No Resistor!)', detail: 'Connecting an LED directly across 5V without a current-limiting resistor (~220Ω) draws excessive current and destroys the diode.' };
    }
    if ((slotA === 'resistor' && slotB === 'led') || (slotA === 'led' && slotB === 'resistor')) {
      if (ledPolarity === 'reversed') {
        return { status: 'reversed' as const, title: 'Reverse-Biased LED (No Light)', detail: 'An LED is a diode — current only flows from Anode (+) to Cathode (-). Flip LED polarity to forward-bias it.' };
      }
      return { status: 'lit' as const, title: 'SAFE CIRCUIT ACTIVE (~13.6 mA)', detail: 'Current flows safely through the 220Ω resistor (Vdrop ≈ 3.0V) and illuminates the LED (Vf ≈ 2.0V) cleanly.' };
    }
    if (slotA === 'resistor' && slotB === 'resistor') {
      return { status: 'safe_dim' as const, title: 'Resistive Load Only (No LED)', detail: 'Safe 440Ω series resistance (~11.3 mA), no short circuit, but add an LED in one slot to observe output.' };
    }
    return { status: 'safe_dim' as const, title: 'Resistive Path Ready', detail: 'Current is limited safely by the resistor (~22.7 mA). Swap the wire for an LED to test output illumination.' };
  };

  const circuit = evaluateCircuit();

  const placeInSlot = (slotKey: 'slotA' | 'slotB', part: PartType) => {
    const next = { ...slots, [slotKey]: part };
    setSlots(next);
    const hasResistorAndLed =
      (next.slotA === 'resistor' && next.slotB === 'led') ||
      (next.slotA === 'led' && next.slotB === 'resistor');
    if (hasResistorAndLed && next.ledPolarity === 'forward') {
      awardHardwareXp(120, 'Built Safe Breadboard LED Circuit', 'hw_breadboard_safe');
      unlockBadge('hardware_sentinel');
    }
  };

  const handleBoardSwitch = (nextBoard: 'pi' | 'arduino') => {
    setBoardType(nextBoard);
    setSelectedPin(nextBoard === 'pi' ? PI_PINS[7] : ARDUINO_PINS[0]);
  };

  const handleInspectHex = (row: FirmwareRegion) => {
    setSelectedHex(row);
    const next = { ...inspectedHexIds, [row.id]: true };
    setInspectedHexIds(next);
    if (Object.keys(next).length === FIRMWARE_HEX_ROWS.length) {
      awardHardwareXp(100, 'Completed Firmware Hex Dump Inspection', 'hw_firmware_hex');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 relative overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(245, 158, 11, 0.14), transparent 36%), radial-gradient(circle at 86% 18%, rgba(6, 182, 212, 0.14), transparent 38%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/75 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
              <CircuitBoard className="w-4 h-4" />
              <span>HARDWARE &amp; IOT SECURITY LAB · VISUAL CIRCUIT SANDBOX</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Physical Devices, Breadboards, GPIO, RFID &amp; Firmware Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Move beyond pure software: test virtual circuits safely, explore Raspberry Pi/Arduino pinouts, inspect RFID defense concepts, and read firmware hex dumps.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-amber-300 tabular-nums">
              <Award className="w-3.5 h-3.5" />
              <span>{xp.toLocaleString()} XP</span>
            </div>
            <button
              type="button"
              onClick={onOpenAppSwitcher}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-amber-300" />
              Apps
            </button>
            <button
              type="button"
              onClick={onBackToBca}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-xs font-semibold text-amber-100 flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </header>

        {xpNotice && (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{xpNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'breadboard', label: 'Interactive Breadboard', icon: Zap },
            { id: 'rfid', label: 'RFID & NFC Security', icon: Radio },
            { id: 'gpio', label: 'GPIO Pinout Explorer', icon: Cpu },
            { id: 'firmware', label: 'Firmware Hex Dump', icon: Binary },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as HardwareTab)}
                className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-500/20 border-amber-400/50 text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* TAB 1: INTERACTIVE VIRTUAL BREADBOARD */}
        {activeTab === 'breadboard' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Component Tray */}
            <div className="lg:col-span-4 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <div>
                <h2 className="text-base font-bold text-white">Component Tray</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drag any part onto Slot A or Slot B (or select a part and tap a slot).
                </p>
              </div>

              <div className="space-y-2.5">
                {(
                  [
                    {
                      id: 'resistor' as PartType,
                      name: '220Ω Resistor',
                      spec: 'Limits LED current to ~13.6mA safely',
                      accent: 'border-amber-400/40 text-amber-300',
                    },
                    {
                      id: 'led' as PartType,
                      name: '5mm Cyan LED',
                      spec: 'Forward Voltage 2.0V · Polarized Diode',
                      accent: 'border-cyan-400/40 text-cyan-300',
                    },
                    {
                      id: 'wire' as PartType,
                      name: 'Jumper Wire (0Ω)',
                      spec: 'Direct copper path — beware short circuits!',
                      accent: 'border-rose-400/40 text-rose-300',
                    },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDragPart(item.id)}
                    onDragEnd={() => setDragPart(null)}
                    onClick={() => setSelectedPart(item.id)}
                    className={`p-3.5 rounded-xl border cursor-grab active:cursor-grabbing transition ${
                      selectedPart === item.id
                        ? `bg-slate-800/90 ${item.accent}`
                        : 'bg-slate-950/75 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">DRAG / TAP</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.spec}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSlots((prev) => ({
                      ...prev,
                      ledPolarity: prev.ledPolarity === 'forward' ? 'reversed' : 'forward',
                    }))
                  }
                  className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-200 text-xs font-semibold transition cursor-pointer"
                >
                  LED Polarity: {slots.ledPolarity === 'forward' ? 'Forward (+ → -)' : 'Reversed (- → +)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSlots({ slotA: null, slotB: null, ledPolarity: 'forward' })}
                  className="min-h-[40px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Virtual Breadboard Canvas */}
            <div className="lg:col-span-8 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold text-white">Virtual Breadboard (5V DC Supply)</h2>
                <span
                  className={`text-xs font-mono font-bold ${
                    circuit.status === 'lit'
                      ? 'text-emerald-300'
                      : circuit.status === 'short'
                      ? 'text-rose-400'
                      : 'text-amber-300'
                  }`}
                >
                  {circuit.title}
                </span>
              </div>

              {/* Interactive SVG Circuit Board */}
              <div className="rounded-2xl bg-slate-950/90 border border-white/10 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* 5V Rail */}
                  <div className="p-4 rounded-xl bg-rose-950/35 border border-rose-500/35 text-center space-y-1">
                    <span className="text-xs font-mono font-bold text-rose-300">+5V VCC RAIL</span>
                    <p className="text-[11px] text-slate-400">USB Regulated Supply</p>
                  </div>

                  {/* Drop Zone A */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dragPart && placeInSlot('slotA', dragPart)}
                    onClick={() => placeInSlot('slotA', selectedPart)}
                    className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition min-h-[104px] flex flex-col items-center justify-center gap-1.5 ${
                      circuit.status === 'short'
                        ? 'border-rose-500 bg-rose-950/40'
                        : slots.slotA
                        ? 'border-cyan-400/60 bg-slate-900'
                        : 'border-slate-700 hover:border-amber-400/60 bg-slate-900/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">SLOT A (5V → NODE)</span>
                    <span className="text-xs font-bold text-white uppercase">
                      {slots.slotA ? slots.slotA : `Tap or Drop ${selectedPart}`}
                    </span>
                  </div>

                  {/* Drop Zone B */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dragPart && placeInSlot('slotB', dragPart)}
                    onClick={() => placeInSlot('slotB', selectedPart)}
                    className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition min-h-[104px] flex flex-col items-center justify-center gap-1.5 ${
                      circuit.status === 'short'
                        ? 'border-rose-500 bg-rose-950/40'
                        : slots.slotB
                        ? 'border-cyan-400/60 bg-slate-900'
                        : 'border-slate-700 hover:border-amber-400/60 bg-slate-900/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">SLOT B (NODE → GND)</span>
                    <span className="text-xs font-bold text-white uppercase">
                      {slots.slotB ? slots.slotB : `Tap or Drop ${selectedPart}`}
                    </span>
                  </div>
                </div>

                {/* Visual Current / Short-Circuit Feedback SVG */}
                <div className="mt-5 rounded-xl bg-slate-900/80 border border-white/10 p-4">
                  <svg viewBox="0 0 600 110" className="w-full h-24">
                    <line
                      x1="40"
                      y1="55"
                      x2="560"
                      y2="55"
                      stroke={
                        circuit.status === 'short'
                          ? '#fb7185'
                          : circuit.status === 'lit'
                          ? '#22d3ee'
                          : '#475569'
                      }
                      strokeWidth={circuit.status === 'short' ? 4 : 3}
                      strokeDasharray={circuit.status === 'open' ? '6 6' : 'none'}
                    />
                    {/* 5V terminal */}
                    <circle cx="40" cy="55" r="14" fill="#881337" stroke="#fb7185" strokeWidth="2" />
                    <text x="40" y="59" textAnchor="middle" fill="#fecdd3" fontSize="10" fontFamily="monospace">
                      5V
                    </text>

                    {/* GND terminal */}
                    <circle cx="560" cy="55" r="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
                    <text x="560" y="59" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                      GND
                    </text>

                    {/* Animated electron flow when safe circuit is lit */}
                    {circuit.status === 'lit' && (
                      <>
                        <circle r="5" fill="#22d3ee">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path="M 55 55 L 545 55" />
                        </circle>
                        <circle cx="300" cy="55" r="24" fill="rgba(34,211,238,0.22)" />
                        <circle cx="300" cy="55" r="13" fill="#22d3ee" />
                        <text x="300" y="96" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="monospace">
                          LED ILLUMINATED · 13.6 mA SAFE FLOW
                        </text>
                      </>
                    )}

                    {/* Short-circuit spark burst animation */}
                    {circuit.status === 'short' && (
                      <g>
                        <polygon
                          points="300,20 310,44 336,40 315,58 330,82 302,68 280,86 288,59 264,45 290,44"
                          fill="#f43f5e"
                          opacity="0.9"
                        >
                          <animate
                            attributeName="opacity"
                            values="1;0.35;1"
                            dur="0.45s"
                            repeatCount="indefinite"
                          />
                        </polygon>
                        <text x="300" y="102" textAnchor="middle" fill="#fda4af" fontSize="11" fontFamily="monospace">
                          SHORT CIRCUIT / OVERCURRENT TRIP!
                        </text>
                      </g>
                    )}

                    {circuit.status !== 'lit' && circuit.status !== 'short' && (
                      <text x="300" y="96" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                        {circuit.title}
                      </text>
                    )}
                  </svg>
                </div>

                {/* Diagnostic Box */}
                <div
                  className={`mt-4 p-4 rounded-xl border text-xs flex items-start gap-3 ${
                    circuit.status === 'short'
                      ? 'bg-rose-950/45 border-rose-500/40 text-rose-100'
                      : circuit.status === 'lit'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                      : 'bg-slate-900/70 border-white/10 text-slate-300'
                  }`}
                >
                  {circuit.status === 'short' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : circuit.status === 'lit' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{circuit.title}</p>
                    <p className="mt-0.5 leading-relaxed opacity-90">{circuit.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: RFID & NFC ACCESS SECURITY (CONCEPTUAL) */}
        {activeTab === 'rfid' && (
          <section className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'lf125', label: '125 kHz LF Proximity (Unencrypted UID)' },
                { id: 'mifare', label: '13.56 MHz MIFARE Classic (Legacy Flaw)' },
                { id: 'desfire', label: 'MIFARE DESFire EV3 (AES-128 Defense)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setRfidStage(s.id as 'lf125' | 'mifare' | 'desfire');
                    if (s.id === 'desfire') {
                      awardHardwareXp(80, 'Reviewed RFID/NFC Access Card Defense', 'hw_rfid_defense');
                    }
                  }}
                  className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    rfidStage === s.id
                      ? 'bg-amber-500/20 border-amber-400/50 text-white'
                      : 'bg-slate-900/70 border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Visual RF Coupling Diagram */}
              <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <h2 className="text-base font-bold text-white">
                  RF Inductive Coupling &amp; Authentication Architecture
                </h2>
                <div className="rounded-xl bg-slate-950/90 border border-white/10 p-5">
                  <svg viewBox="0 0 600 175" className="w-full h-44">
                    {/* Reader Box */}
                    <rect x="20" y="38" width="150" height="96" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                    <text x="95" y="75" textAnchor="middle" fill="#e0f2fe" fontSize="12" fontWeight="bold">
                      Door Reader
                    </text>
                    <text x="95" y="96" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="monospace">
                      {rfidStage === 'lf125' ? '125 kHz RF Field' : '13.56 MHz NFC'}
                    </text>
                    <text x="95" y="114" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      Powers passive coil
                    </text>

                    {/* RF Waves */}
                    <path d="M 190 86 Q 230 50, 270 86 T 350 86 T 415 86" fill="none" stroke={rfidStage === 'desfire' ? '#34d399' : '#f59e0b'} strokeWidth="2.5" strokeDasharray="5 5" />
                    <circle r="5" fill={rfidStage === 'desfire' ? '#34d399' : '#fbbf24'}>
                      <animateMotion dur="1.6s" repeatCount="indefinite" path="M 185 86 L 420 86" />
                    </circle>
                    <text x="300" y="50" textAnchor="middle" fill={rfidStage === 'desfire' ? '#6ee7b7' : '#fcd34d'} fontSize="10" fontFamily="monospace">
                      {rfidStage === 'lf125'
                        ? 'Plaintext Static UID Broadcast'
                        : rfidStage === 'mifare'
                        ? 'Legacy 48-bit Crypto1 Handshake'
                        : 'Mutual AES-128 Challenge-Response'}
                    </text>

                    {/* Access Card Box */}
                    <rect x="430" y="38" width="150" height="96" rx="14" fill="#0f172a" stroke={rfidStage === 'desfire' ? '#34d399' : '#f59e0b'} strokeWidth="2" />
                    <text x="505" y="75" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                      Access Badge
                    </text>
                    <text x="505" y="96" textAnchor="middle" fill={rfidStage === 'desfire' ? '#6ee7b7' : '#fcd34d'} fontSize="10" fontFamily="monospace">
                      {rfidStage === 'lf125' ? 'EM4100 / HID Prox' : rfidStage === 'mifare' ? 'MIFARE Classic' : 'DESFire EV3'}
                    </text>
                    <text x="505" y="114" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      {rfidStage === 'desfire' ? 'Secure Element + AES' : 'Static / Weak Cipher'}
                    </text>
                  </svg>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                  {rfidStage === 'lf125' && (
                    <p>
                      <strong className="text-amber-300">Why 125 kHz LF cards are vulnerable:</strong> When powered by any 125 kHz reader coil, legacy proximity badges immediately broadcast a fixed, unencrypted serial number (UID) with zero cryptographic challenge. Because there is no mutual authentication, physical security audits classify 125 kHz badges as high-risk for unauthorized badge duplication.
                    </p>
                  )}
                  {rfidStage === 'mifare' && (
                    <p>
                      <strong className="text-amber-300">The MIFARE Classic Crypto1 Flaw (Concept):</strong> Introduced in 1994, MIFARE Classic relied on a proprietary 48-bit stream cipher (Crypto1) and a weak pseudo-random number generator (PRNG). Academic cryptographers proved the keystream can be recovered quickly offline, making MIFARE Classic unsuitable for modern building access or transit cards.
                    </p>
                  )}
                  {rfidStage === 'desfire' && (
                    <p>
                      <strong className="text-emerald-300">Modern Defense (DESFire EV3 / SEOS / Mobile NFC):</strong> Reader and card perform mutual AES-128 challenge-response authentication with fresh random nonces every tap, diversified per-card keys, and encrypted sector payloads — neutralizing static UID replay completely.
                    </p>
                  )}
                </div>
              </div>

              {/* CISO Physical Access Hardening Checklist */}
              <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="text-sm font-bold text-white">Physical Security Hardening Checklist</h3>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="p-3 rounded-xl bg-slate-950/75 border border-white/5">
                    <strong className="text-white block mb-0.5">1. Retire 125 kHz &amp; MIFARE Classic</strong>
                    Migrate building readers to AES-128 authenticated standards (MIFARE DESFire EV2/EV3, HID iCLASS SEOS, or Apple/Google Wallet NFC).
                  </li>
                  <li className="p-3 rounded-xl bg-slate-950/75 border border-white/5">
                    <strong className="text-white block mb-0.5">2. Use Diversified Per-Badge Keys</strong>
                    Never share one static master key across all employee cards; derive unique card keys using NIST CMAC key diversification.
                  </li>
                  <li className="p-3 rounded-xl bg-slate-950/75 border border-white/5">
                    <strong className="text-white block mb-0.5">3. Encrypt Reader-to-Controller Wiring</strong>
                    Replace unencrypted legacy Wiegand wires inside walls with OSDP v2 (AES-128 supervised serial protocol).
                  </li>
                  <li className="p-3 rounded-xl bg-slate-950/75 border border-white/5">
                    <strong className="text-white block mb-0.5">4. Require Badge + PIN on Server Rooms</strong>
                    Enforce multi-factor physical access for data centers and network closets.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: GPIO PINOUT EXPLORER */}
        {activeTab === 'gpio' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBoardSwitch('pi')}
                className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  boardType === 'pi'
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-white'
                    : 'bg-slate-900/70 border-white/10 text-slate-300'
                }`}
              >
                Raspberry Pi Header (3.3V Logic)
              </button>
              <button
                type="button"
                onClick={() => handleBoardSwitch('arduino')}
                className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  boardType === 'arduino'
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-white'
                    : 'bg-slate-900/70 border-white/10 text-slate-300'
                }`}
              >
                Arduino Uno Header (5V Logic)
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Pin Grid */}
              <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                <p className="text-xs text-slate-400 mb-3">
                  Click any header pin to inspect electrical function, voltage limit, and hardware security considerations.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {pins.map((p) => {
                    const active = selectedPin.pin === p.pin && selectedPin.label === p.label;
                    const roleColor =
                      p.role === 'Power'
                        ? 'text-rose-300 border-rose-500/30'
                        : p.role === 'Ground'
                        ? 'text-slate-300 border-slate-600/40'
                        : p.role === 'UART'
                        ? 'text-amber-300 border-amber-500/35'
                        : p.role === 'SPI'
                        ? 'text-violet-300 border-violet-500/35'
                        : p.role === 'I2C'
                        ? 'text-cyan-300 border-cyan-500/35'
                        : 'text-emerald-300 border-emerald-500/30';

                    return (
                      <button
                        key={`${p.pin}-${p.label}`}
                        type="button"
                        onClick={() => setSelectedPin(p)}
                        className={`min-h-[46px] px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition cursor-pointer ${
                          active
                            ? 'bg-cyan-500/20 border-cyan-400 text-white'
                            : `bg-slate-950/80 hover:bg-slate-900 ${roleColor}`
                        }`}
                      >
                        <span className="text-xs font-mono font-bold truncate">
                          #{p.pin} {p.label}
                        </span>
                        <span className="text-[10px] font-mono opacity-80 shrink-0">{p.role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pin Detail Panel */}
              <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-300">
                    PIN #{selectedPin.pin} · {selectedPin.role}
                  </span>
                  <span className="text-xs font-mono text-amber-300">{selectedPin.voltage}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedPin.label}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedPin.desc}
                </p>
                <div className="p-4 rounded-xl bg-amber-950/35 border border-amber-500/30 space-y-1">
                  <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Hardware Security &amp; Electrical Safety
                  </p>
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    {selectedPin.securityNote}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: FIRMWARE ANALYSIS BASICS (HEX DUMP) */}
        {activeTab === 'firmware' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  Mock Router Firmware Hex Dump (`router_v2.bin`)
                </h2>
                <span className="text-xs font-mono text-cyan-300 tabular-nums">
                  {Object.keys(inspectedHexIds).length}/{FIRMWARE_HEX_ROWS.length} inspected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Select any memory offset row to understand magic headers, filesystems, debug artifacts, and secure boot signatures.
              </p>

              <div className="space-y-2 font-mono text-xs overflow-x-auto">
                {FIRMWARE_HEX_ROWS.map((row) => {
                  const active = selectedHex.id === row.id;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => handleInspectHex(row)}
                      className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        active
                          ? 'bg-cyan-500/15 border-cyan-400/60 text-white'
                          : 'bg-slate-950/85 border-white/10 hover:border-white/25 text-slate-300'
                      }`}
                    >
                      <span className="text-cyan-400 shrink-0">{row.offset}</span>
                      <span className="text-[11px] text-slate-200 truncate">{row.hex}</span>
                      <span
                        className={`shrink-0 text-[11px] font-bold ${
                          row.risk === 'Warning'
                            ? 'text-amber-300'
                            : row.risk === 'Safe'
                            ? 'text-emerald-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {row.ascii}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/75 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300">{selectedHex.offset}</span>
                <span
                  className={
                    selectedHex.risk === 'Warning'
                      ? 'text-amber-300 font-bold'
                      : selectedHex.risk === 'Safe'
                      ? 'text-emerald-300 font-bold'
                      : 'text-slate-300'
                  }
                >
                  {selectedHex.risk.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{selectedHex.label}</h3>
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-cyan-200 break-all">
                {selectedHex.hex}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedHex.explanation}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
export default HardwareSecurityLabApp;
