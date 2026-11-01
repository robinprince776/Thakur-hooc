import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Shield,
  Activity,
  Code2,
  Cpu,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Maximize2,
  Eye,
  Lock,
  Zap,
  Radio,
  Server,
  Terminal,
  Compass,
  CornerDownRight,
  ChevronRight,
  TrendingUp,
  Droplet
} from 'lucide-react';

export interface VisualAtlasAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

type AtlasTab = 'osi' | 'killchain' | 'anatomy' | 'pointers' | 'dsa' | 'physics';

export const VisualAtlasApp: React.FC<VisualAtlasAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<AtlasTab>('osi');

  // ==========================================
  // TAB 1: OSI 7-STOREY SKYSCRAPER STATE
  // ==========================================
  const [selectedFloor, setSelectedFloor] = useState<number>(7);
  const [elevatorFloor, setElevatorFloor] = useState<number>(7);
  const [packetFlowDirection, setPacketFlowDirection] = useState<'down' | 'up' | 'idle'>('idle');

  const osiFloors = [
    {
      level: 7,
      name: 'Application Layer',
      tag: 'Penthouse / User Interface',
      protocols: ['HTTP/3', 'HTTPS', 'DNS', 'SSH', 'WebSockets', 'gRPC'],
      pdu: 'Data',
      encapsulation: 'User raw message + Application header',
      hardware: 'Web Browsers, Gateways, Proxy, API Clients',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgGlow: 'bg-amber-500/10',
      description: 'The penthouse where humans and applications live. Directly interfaces with software to deliver network services.',
      realWorld: 'Entering https://google.com in Chrome creates an HTTP GET request here.'
    },
    {
      level: 6,
      name: 'Presentation Layer',
      tag: 'Translation & Crypto Studio',
      protocols: ['TLS 1.3', 'SSL', 'JSON', 'ASCII', 'JPEG', 'GZIP'],
      pdu: 'Data (Formatted)',
      encapsulation: 'Encrypted & serialized byte payload',
      hardware: 'OS Crypo Subsystems, Serializers',
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgGlow: 'bg-purple-500/10',
      description: 'Translator and encryption studio. Formats, compresses, and encrypts raw data into standardized cross-platform syntax.',
      realWorld: 'TLS wraps HTTP data with AES-256-GCM encryption so eavesdroppers only see gibberish.'
    },
    {
      level: 5,
      name: 'Session Layer',
      tag: 'Meeting Room & Handshake Coordinator',
      protocols: ['NetBIOS', 'RPC', 'PPTP', 'Sockets', 'SIP'],
      pdu: 'Data (Session ID)',
      encapsulation: 'Session Tokens & Sync Checkpoints',
      hardware: 'OS Network Sockets & Session Managers',
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgGlow: 'bg-blue-500/10',
      description: 'The conference manager. Opens, manages, checkpoints, and cleanly terminates dialogues between two communicating ends.',
      realWorld: 'During a VoIP video call, if packets stutter, Session Layer keeps the call connection alive without restarting.'
    },
    {
      level: 4,
      name: 'Transport Layer',
      tag: 'Logistics & Cargo Dispatch',
      protocols: ['TCP (Reliable 3-Way Handshake)', 'UDP (Fast Streaming)', 'QUIC'],
      pdu: 'Segment (TCP) / Datagram (UDP)',
      encapsulation: 'Source Port + Destination Port + Seq/Ack Numbers',
      hardware: 'L4 Load Balancers, OS TCP/IP Stack',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgGlow: 'bg-emerald-500/10',
      description: 'The shipping dispatcher. Breaks data into numbered chunks, handles flow control, retransmits lost packets (TCP), or streams at maximum speed (UDP).',
      realWorld: 'Guarantees bank transaction messages arrive in order without losing a single cent.'
    },
    {
      level: 3,
      name: 'Network Layer',
      tag: 'GPS, Postal Routing & Highways',
      protocols: ['IPv4', 'IPv6', 'ICMP (Ping)', 'BGP', 'OSPF', 'IPSec'],
      pdu: 'Packet',
      encapsulation: 'Source IP + Destination IP + TTL + Protocol ID',
      hardware: 'Routers, L3 Core Switches',
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgGlow: 'bg-cyan-500/10',
      description: 'The global navigation system. Finds the optimal path across thousands of interconnected networks using IP addresses.',
      realWorld: 'When you ping 8.8.8.8, routers across continents inspect the destination IP to hop your packet.'
    },
    {
      level: 2,
      name: 'Data Link Layer',
      tag: 'Local Neighborhood Switchboard',
      protocols: ['Ethernet (802.3)', 'Wi-Fi (802.11)', 'ARP', 'VLAN (802.1Q)'],
      pdu: 'Frame',
      encapsulation: 'Source MAC + Dest MAC + Payload + CRC / FCS Checksum',
      hardware: 'Network Switches, Wi-Fi Access Points, NIC cards',
      color: 'from-indigo-500 to-violet-600',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
      bgGlow: 'bg-indigo-500/10',
      description: 'The local neighborhood postman. Transfers frames between directly adjacent network devices using hardware MAC addresses.',
      realWorld: 'Your laptop talks to your Wi-Fi router via MAC addresses inside your room before reaching the internet.'
    },
    {
      level: 1,
      name: 'Physical Layer',
      tag: 'Underground Cable Vault & Subsea Fiber',
      protocols: ['1000BASE-T', 'Fiber Optics', 'Radio RF (2.4/5GHz)', 'DSL'],
      pdu: 'Bits (0s & 1s)',
      encapsulation: 'Electrical Voltage (+5V/-5V), Light Pulses, Radio Frequencies',
      hardware: 'Cables (Cat6), Transceivers, Antennas, Hubs, Repeaters',
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgGlow: 'bg-rose-500/10',
      description: 'The raw physical earth layer. Transforms digital bits into physical light pulses inside glass fibers or electrical pulses in copper wires.',
      realWorld: 'Subsea fiber optic cables under the Atlantic Ocean pulsing laser beams at 100 Terabits per second.'
    }
  ];

  // Send packet elevator down or up
  const triggerPacketElevator = (dir: 'down' | 'up') => {
    setPacketFlowDirection(dir);
    const target = dir === 'down' ? 1 : 7;
    let curr = dir === 'down' ? 7 : 1;
    setElevatorFloor(curr);
    setSelectedFloor(curr);

    const interval = setInterval(() => {
      if (dir === 'down') {
        curr -= 1;
        if (curr < 1) {
          clearInterval(interval);
          setPacketFlowDirection('idle');
          return;
        }
      } else {
        curr += 1;
        if (curr > 7) {
          clearInterval(interval);
          setPacketFlowDirection('idle');
          return;
        }
      }
      setElevatorFloor(curr);
      setSelectedFloor(curr);
    }, 700);
  };

  // ==========================================
  // TAB 2: CYBER KILL CHAIN ATTACK MAP STATE
  // ==========================================
  const [selectedKillStage, setSelectedKillStage] = useState<number>(1);
  const [killChainSimActive, setKillChainSimActive] = useState<boolean>(false);

  const killChainStages = [
    {
      step: 1,
      title: 'Reconnaissance',
      hackerAction: 'Harvesting email addresses, public social media, Shodan port scanning, DNS enumeration.',
      tools: 'Nmap, Shodan, Whois, Maltego, LinkedIn scraping',
      defense: 'Attack surface monitoring, disabling unnecessary ports, employee anti-phishing training.',
      status: 'Target Profiled',
      severity: 'Low / Information Gathering'
    },
    {
      step: 2,
      title: 'Weaponization',
      hackerAction: 'Pairing an exploit (e.g. CVE zero-day) with a malicious payload inside a trojanized PDF or Office doc.',
      tools: 'Metasploit, Cobalt Strike, msfvenom, Veil-Evasion',
      defense: 'Threat Intelligence feeds, static code analysis, vulnerability patch management.',
      status: 'Payload Crafted',
      severity: 'Medium'
    },
    {
      step: 3,
      title: 'Delivery',
      hackerAction: 'Transmitting weaponized bundle via spear-phishing email, waterhole website, or malicious USB drive.',
      tools: 'Evilginx2, Phishing mailers, Drive-by downloads',
      defense: 'Email gateway filtering (SPF/DKIM/DMARC), sandbox detonation, Web Application Firewall (WAF).',
      status: 'Payload Inbound',
      severity: 'High'
    },
    {
      step: 4,
      title: 'Exploitation',
      hackerAction: 'Triggering malicious code execution on target system (e.g., buffer overflow, macro enabled).',
      tools: 'EternalBlue (MS17-010), Log4j (CVE-2021-44228), Macro scripts',
      defense: 'EDR (Endpoint Detection), Data Execution Prevention (DEP), ASLR memory randomization.',
      status: 'Shell Acquired',
      severity: 'Critical / Breach Point'
    },
    {
      step: 5,
      title: 'Installation',
      hackerAction: 'Establishing persistence on the host via registry run-keys, rootkits, or scheduled cron jobs.',
      tools: 'Registry autostart, DLL Sideloading, Web shells, Scheduled Tasks',
      defense: 'File Integrity Monitoring (FIM), privilege restriction, Windows Defender Application Control.',
      status: 'Backdoor Planted',
      severity: 'Critical'
    },
    {
      step: 6,
      title: 'Command & Control (C2)',
      hackerAction: 'Opening encrypted outbound beacon back to the adversary command server (DNS tunneling or HTTPS).',
      tools: 'Cobalt Strike Beacons, Mythic, Sliver, DNS Cat',
      defense: 'Egress traffic inspection, DNS sinkholing, TLS interception, AI anomaly detection.',
      status: 'Remote Puppet Active',
      severity: 'Critical'
    },
    {
      step: 7,
      title: 'Actions on Objectives',
      hackerAction: 'Lateral movement, database dumps, ransomware encryption, exfiltrating trade secrets.',
      tools: 'Mimikatz (dumping credentials), PsExec, BloodHound, Ransomware locker',
      defense: 'Zero Trust architecture, network segmentation, immutable backups, DLP (Data Loss Prevention).',
      status: 'Exfiltration / Impact',
      severity: 'Catastrophic'
    }
  ];

  // ==========================================
  // TAB 3: MEDICAL INJECTION ANATOMY MAP
  // ==========================================
  const [selectedBodySite, setSelectedBodySite] = useState<string>('deltoid');
  const [bodyFacing, setBodyFacing] = useState<'front' | 'back'>('front');

  const injectionSites: Record<string, {
    name: string;
    route: string;
    angle: number;
    needleGauge: string;
    maxVolume: string;
    safeLandmarks: string;
    dangerZone: string;
    commonDrugs: string[];
    facing: 'front' | 'back' | 'both';
  }> = {
    deltoid: {
      name: 'Deltoid Muscle (Upper Arm)',
      route: 'Intramuscular (IM)',
      angle: 90,
      needleGauge: '22 - 25 Gauge (1 inch)',
      maxVolume: '1.0 - 2.0 mL max in adults',
      safeLandmarks: '2 to 3 finger-widths below the Acromion process, in the center of the inverted triangle.',
      dangerZone: 'Radial Nerve and Deep Brachial Artery lie right below if given too low.',
      commonDrugs: ['Hepatitis B & Tdap Vaccines', 'Flu Vaccine', 'Rabies Dose', 'Vitamin B12'],
      facing: 'both'
    },
    dorsogluteal: {
      name: 'Dorsogluteal / Ventrogluteal (Buttock)',
      route: 'Intramuscular (IM Deep)',
      angle: 90,
      needleGauge: '20 - 22 Gauge (1.5 inch)',
      maxVolume: '3.0 - 4.0 mL in adults',
      safeLandmarks: 'Upper Outer Quadrant of the gluteus medius. Palpate anterior superior iliac spine.',
      dangerZone: 'Sciatic Nerve & Superior Gluteal Artery! Injecting into the inner quadrant can cause permanent foot drop paralysis.',
      commonDrugs: ['Diclofenac Sodium', 'Ceftriaxone (deep antibiotic)', 'Haloperidol', 'Progesterone in oil'],
      facing: 'back'
    },
    vastus: {
      name: 'Vastus Lateralis (Outer Thigh)',
      route: 'Intramuscular (IM)',
      angle: 90,
      needleGauge: '22 - 25 Gauge (1 - 1.25 inch)',
      maxVolume: '2.0 - 3.0 mL (preferred for infants/pediatric)',
      safeLandmarks: 'Middle third of the anterolateral aspect of the thigh, between greater trochanter and lateral femoral condyle.',
      dangerZone: 'Free of major blood vessels and nerves — safest IM site in the human body.',
      commonDrugs: ['Pediatric Immunizations', 'EpiPen (Epinephrine emergency)', 'Self-administered testosterone'],
      facing: 'front'
    },
    abdomen: {
      name: 'Periumbilical Abdomen (Fat Pad)',
      route: 'Subcutaneous (SC)',
      angle: 45,
      needleGauge: '25 - 31 Gauge (short 5/8 to 1/2 inch)',
      maxVolume: '1.0 mL max',
      safeLandmarks: 'Pinch abdominal skin at least 2 inches (5 cm) away from the umbilicus (navel). Rotate injection points.',
      dangerZone: 'Avoid scar tissue, bruises, hard lumps, and injecting directly into rectus abdominis muscle.',
      commonDrugs: ['Regular & Glargine Insulin', 'Enoxaparin / Heparin (anti-coagulant)', 'Semaglutide / GLP-1'],
      facing: 'front'
    },
    median_vein: {
      name: 'Median Cubital Vein (Antecubital Fossa)',
      route: 'Intravenous (IV)',
      angle: 25,
      needleGauge: '18 - 22 Gauge Cannula',
      maxVolume: 'Continuous Drip or Bolus (50 - 1000 mL)',
      safeLandmarks: 'Large superficial vein connecting cephalic and basilic veins in the inner crease of the elbow.',
      dangerZone: 'Brachial Artery and Median Nerve lie directly underneath. Flashback of bright spurting blood indicates arterial puncture!',
      commonDrugs: ['Normal Saline (0.9% NS)', 'Ringer Lactate (RL)', 'IV Ondansetron', 'Emergency IV Push'],
      facing: 'front'
    }
  };

  // ==========================================
  // TAB 4: C POINTERS INTERACTIVE MEMORY GRID
  // ==========================================
  const [targetValue, setTargetValue] = useState<number>(42);
  const [pointerActive, setPointerActive] = useState<boolean>(true);
  const [isDoublePointer, setIsDoublePointer] = useState<boolean>(false);
  const [showMallocBlock, setShowMallocBlock] = useState<boolean>(false);

  // ==========================================
  // TAB 5: CODE & DSA ANIMATOR (BUBBLE SORT)
  // ==========================================
  const initialArray = [64, 34, 25, 12, 22, 11, 90];
  const [arrayBars, setArrayBars] = useState<number[]>([...initialArray]);
  const [sortingState, setSortingState] = useState<{
    i: number;
    j: number;
    swapping: boolean;
    swappedIndices: [number, number] | null;
    isFinished: boolean;
    passNumber: number;
    totalSwaps: number;
  }>({
    i: 0,
    j: 0,
    swapping: false,
    swappedIndices: null,
    isFinished: false,
    passNumber: 1,
    totalSwaps: 0
  });
  const [isSortingRunning, setIsSortingRunning] = useState<boolean>(false);

  const resetSort = () => {
    setIsSortingRunning(false);
    setArrayBars([...initialArray]);
    setSortingState({
      i: 0,
      j: 0,
      swapping: false,
      swappedIndices: null,
      isFinished: false,
      passNumber: 1,
      totalSwaps: 0
    });
  };

  // Single Step of Bubble Sort
  const stepBubbleSort = () => {
    setArrayBars((prev) => {
      const arr = [...prev];
      const n = arr.length;
      let { i, j, passNumber, totalSwaps } = sortingState;

      if (i >= n - 1) {
        setSortingState((s) => ({ ...s, isFinished: true, swapping: false, swappedIndices: null }));
        setIsSortingRunning(false);
        return arr;
      }

      if (j < n - i - 1) {
        let swapped = false;
        let swapPair: [number, number] | null = null;
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
          swapPair = [j, j + 1];
          totalSwaps += 1;
        }

        const nextJ = j + 1;
        if (nextJ >= n - i - 1) {
          // End of this pass
          setSortingState({
            i: i + 1,
            j: 0,
            swapping: swapped,
            swappedIndices: swapPair,
            isFinished: i + 1 >= n - 1,
            passNumber: passNumber + 1,
            totalSwaps
          });
        } else {
          setSortingState({
            i,
            j: nextJ,
            swapping: swapped,
            swappedIndices: swapPair,
            isFinished: false,
            passNumber,
            totalSwaps
          });
        }
      }
      return arr;
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSortingRunning && !sortingState.isFinished) {
      timer = setTimeout(() => {
        stepBubbleSort();
      }, 650);
    }
    return () => clearTimeout(timer);
  }, [isSortingRunning, sortingState]);

  // ==========================================
  // TAB 6: HYDRAULIC PHYSICS & TRANSISTOR LAB
  // ==========================================
  const [voltage, setVoltage] = useState<number>(12); // Volts = Water Height
  const [resistance, setResistance] = useState<number>(4); // Ohms = Pipe Constriction
  const [transistorGate, setTransistorGate] = useState<number>(75); // 0 to 100% Valve Open

  const effectiveResistance = Math.max(0.5, resistance * (100 / Math.max(1, transistorGate)));
  const currentAmps = Number((voltage / effectiveResistance).toFixed(2));
  const powerWatts = Number((voltage * currentAmps).toFixed(1));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">VisualAtlas 2.0</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Interactive Visual Architectures & Physics
                </span>
              </div>
              <p className="text-xs text-slate-400">
                100% SVG & Canvas interactive diagrams: OSI Building, Cyber Kill Chain, Anatomy, Pointers & DSA
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
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-all shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 px-4 py-2 sticky top-[61px] z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('osi')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'osi'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            1. OSI 7-Storey Skyscraper
          </button>

          <button
            onClick={() => setActiveTab('killchain')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'killchain'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 text-rose-400" />
            2. Cyber Kill Chain Attack Map
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'anatomy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            3. Medical Injection Anatomy
          </button>

          <button
            onClick={() => setActiveTab('pointers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pointers'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            4. C Pointers & Memory Grid
          </button>

          <button
            onClick={() => setActiveTab('dsa')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dsa'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4 text-purple-400" />
            5. Code Animator & DSA
          </button>

          <button
            onClick={() => setActiveTab('physics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'physics'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Droplet className="w-4 h-4 text-blue-400" />
            6. Water Pipe & Transistor Lab
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* ========================================================= */}
        {/* TAB 1: OSI 7-STOREY SKYSCRAPER                           */}
        {/* ========================================================= */}
        {activeTab === 'osi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left: The Interactive 7-Storey Building */}
            <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-amber-400" />
                    The 7-Storey OSI Skyscraper
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any floor or use the Packet Elevator to see encapsulation in motion
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerPacketElevator('down')}
                    disabled={packetFlowDirection !== 'idle'}
                    className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Send Down (Encapsulate)</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                  </button>
                  <button
                    onClick={() => triggerPacketElevator('up')}
                    disabled={packetFlowDirection !== 'idle'}
                    className="px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Send Up (Decapsulate)</span>
                    <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
                  </button>
                </div>
              </div>

              {/* Building Architecture Frame */}
              <div className="space-y-2.5">
                {osiFloors.map((floor) => {
                  const isSelected = selectedFloor === floor.level;
                  const hasElevator = elevatorFloor === floor.level;

                  return (
                    <div
                      key={floor.level}
                      onClick={() => setSelectedFloor(floor.level)}
                      className={`relative rounded-xl p-3.5 transition-all duration-300 cursor-pointer border ${
                        isSelected
                          ? `${floor.bgGlow} ${floor.borderColor} shadow-lg ring-1 ring-amber-500/20 scale-[1.01]`
                          : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Elevator Packet Indicator */}
                      {hasElevator && (
                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-8 bg-lime-400 rounded-r-md shadow-lg shadow-lime-400/50 animate-pulse flex items-center justify-center">
                          <div className="w-1 h-4 bg-slate-950 rounded-full" />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Floor Level Badge */}
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm bg-gradient-to-tr ${floor.color} text-white shadow-md`}
                          >
                            L{floor.level}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{floor.name}</span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                PDU: {floor.pdu}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{floor.tag}</p>
                          </div>
                        </div>

                        {/* Protocol Pills */}
                        <div className="hidden sm:flex flex-wrap items-center gap-1.5 justify-end max-w-[240px]">
                          {floor.protocols.slice(0, 3).map((p) => (
                            <span
                              key={p}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700/60"
                            >
                              {p}
                            </span>
                          ))}
                          {floor.protocols.length > 3 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              +{floor.protocols.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Underground Cable Tunnel (Subsea cable foundation) */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-mono text-[11px] text-slate-300">
                    Physical Medium: Atlantic Subsea Fiber Laser & 5GHz RF Spectrum
                  </span>
                </div>
                <span className="font-mono text-cyan-400 text-[11px]">300,000 km/s (Speed of Light)</span>
              </div>
            </div>

            {/* Right: Detailed Floor Inspector */}
            <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
              {(() => {
                const floor = osiFloors.find((f) => f.level === selectedFloor)!;
                return (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold ${floor.textColor}`}>
                            LAYER {floor.level} OF 7
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            Floor Inspector
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1">{floor.name}</h3>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${floor.color} flex items-center justify-center text-white text-lg font-bold shadow-lg`}
                      >
                        L{floor.level}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Role & Function
                        </h4>
                        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                          {floor.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Packet Encapsulation Header
                        </h4>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-amber-300/90 flex items-center gap-2">
                          <CornerDownRight className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>{floor.encapsulation}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Resident Protocols & Standards
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {floor.protocols.map((p) => (
                            <span
                              key={p}
                              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-cyan-500/20"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Hardware & Infrastructure
                        </h4>
                        <p className="text-xs text-slate-300 font-mono bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60">
                          {floor.hardware}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                          <Sparkles className="w-4 h-4" />
                          <span>Real-World Scenario</span>
                        </div>
                        <p className="text-xs text-cyan-100/90 leading-relaxed">{floor.realWorld}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Tip: Memory phrase: "Please Do Not Throw Sausage Pizza Away"</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CYBER KILL CHAIN ATTACK MAP                        */}
        {/* ========================================================= */}
        {activeTab === 'killchain' && (
          <div className="space-y-6 animate-fade-in">
            {/* Attack Chain Visual SVG Pipeline */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-rose-500" />
                    Lockheed Martin Cyber Kill Chain® Radar
                  </h2>
                  <p className="text-xs text-slate-400">
                    7 stages of a high-end targeted cyber intrusion. Interrupting any stage breaks the breach!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setKillChainSimActive(!killChainSimActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      killChainSimActive
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{killChainSimActive ? 'Live Attack Simulation...' : 'Simulate Intrusion Pulse'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Node Radar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {killChainStages.map((stage) => {
                  const isSelected = selectedKillStage === stage.step;
                  const isBreached = killChainSimActive || stage.step <= selectedKillStage;

                  return (
                    <div
                      key={stage.step}
                      onClick={() => setSelectedKillStage(stage.step)}
                      className={`relative p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-rose-950/40 border-rose-500/70 shadow-lg shadow-rose-500/20 scale-105 ring-1 ring-rose-500'
                          : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          0{stage.step}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isBreached ? 'bg-rose-500 shadow-md shadow-rose-500/60 animate-ping' : 'bg-slate-600'
                          }`}
                        />
                      </div>

                      <h4 className="font-bold text-white text-xs mb-1 line-clamp-1">{stage.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block line-clamp-1">
                        {stage.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Attack Vector Line */}
              <div className="relative mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-500"
                  style={{ width: `${(selectedKillStage / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Deep Stage Inspector */}
            {(() => {
              const stage = killChainStages.find((s) => s.step === selectedKillStage)!;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-2xl">
                  {/* Left: Hacker Tactics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-mono font-bold text-sm">
                        0{stage.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                        <span className="text-xs font-mono text-rose-400">Offensive Adversary Activity</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Adversary Tactic & Objective
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed">{stage.hackerAction}</p>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Common Hacker Tooling & Exploits
                      </h4>
                      <p className="text-xs font-mono text-rose-300">{stage.tools}</p>
                    </div>
                  </div>

                  {/* Right: SOC / Blue Team Defense */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-emerald-400">Blue Team Countermeasures</h3>
                        <span className="text-xs font-mono text-emerald-500">Defensive Kill-Switch</span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                      <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        How to Block & Detect This Step
                      </h4>
                      <p className="text-sm text-emerald-100/90 leading-relaxed">{stage.defense}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Stage Threat Severity</span>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {stage.severity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MEDICAL INJECTION ANATOMY MAP                      */}
        {/* ========================================================= */}
        {activeTab === 'anatomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left: Interactive Human Anatomical Silhouette (Pure SVG) */}
            <div className="lg:col-span-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      Clinical Injection Anatomical Map
                    </h2>
                    <p className="text-xs text-slate-400">
                      Click glowing landmarks to inspect needle angle, dangerous nerves, and volume limits
                    </p>
                  </div>

                  {/* Front / Back Toggle */}
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setBodyFacing('front')}
                      className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                        bodyFacing === 'front' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Anterior (Front)
                    </button>
                    <button
                      onClick={() => setBodyFacing('back')}
                      className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                        bodyFacing === 'back' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Posterior (Back)
                    </button>
                  </div>
                </div>

                {/* Human Body SVG Diagram */}
                <div className="relative w-full h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 flex items-center justify-center p-4">
                  <svg
                    viewBox="0 0 240 380"
                    className="w-full h-full max-h-[340px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Head */}
                    <circle cx="120" cy="40" r="24" fill="#334155" stroke="#475569" strokeWidth="2" />
                    {/* Neck */}
                    <rect x="112" y="64" width="16" height="14" fill="#334155" />
                    {/* Torso */}
                    <path
                      d="M 80 78 L 160 78 L 152 190 L 88 190 Z"
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="2"
                    />

                    {/* Arms */}
                    {/* Left Arm (Viewer's left) */}
                    <path
                      d="M 80 78 L 50 160 L 40 240 L 52 242 L 64 165 L 86 92 Z"
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    {/* Right Arm (Viewer's right) */}
                    <path
                      d="M 160 78 L 190 160 L 200 240 L 188 242 L 176 165 L 154 92 Z"
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* Legs */}
                    {/* Left Leg */}
                    <path
                      d="M 90 190 L 84 280 L 80 360 L 100 360 L 112 280 L 116 190 Z"
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    {/* Right Leg */}
                    <path
                      d="M 150 190 L 156 280 L 160 360 L 140 360 L 128 280 L 124 190 Z"
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* CLICKABLE INTERACTIVE INJECTION LANDMARKS */}
                    {/* 1. Deltoid (Shoulder) - Left & Right */}
                    <g
                      className="cursor-pointer group"
                      onClick={() => setSelectedBodySite('deltoid')}
                    >
                      <circle
                        cx="70"
                        cy="96"
                        r={selectedBodySite === 'deltoid' ? 12 : 9}
                        className={`${
                          selectedBodySite === 'deltoid' ? 'fill-emerald-400' : 'fill-emerald-500/70'
                        } transition-all animate-pulse`}
                      />
                      <circle cx="70" cy="96" r="16" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle
                        cx="170"
                        cy="96"
                        r={selectedBodySite === 'deltoid' ? 12 : 9}
                        className={`${
                          selectedBodySite === 'deltoid' ? 'fill-emerald-400' : 'fill-emerald-500/70'
                        } transition-all animate-pulse`}
                      />
                    </g>

                    {/* 2. Dorsogluteal / Ventrogluteal (Buttock) - Visible mostly on Back */}
                    {bodyFacing === 'back' && (
                      <g
                        className="cursor-pointer group"
                        onClick={() => setSelectedBodySite('dorsogluteal')}
                      >
                        <circle
                          cx="100"
                          cy="195"
                          r={selectedBodySite === 'dorsogluteal' ? 14 : 10}
                          className={`${
                            selectedBodySite === 'dorsogluteal' ? 'fill-amber-400' : 'fill-amber-500/80'
                          } transition-all animate-pulse`}
                        />
                        <circle
                          cx="140"
                          cy="195"
                          r={selectedBodySite === 'dorsogluteal' ? 14 : 10}
                          className={`${
                            selectedBodySite === 'dorsogluteal' ? 'fill-amber-400' : 'fill-amber-500/80'
                          } transition-all animate-pulse`}
                        />
                      </g>
                    )}

                    {/* 3. Abdomen (Periumbilical) - Front Only */}
                    {bodyFacing === 'front' && (
                      <g
                        className="cursor-pointer group"
                        onClick={() => setSelectedBodySite('abdomen')}
                      >
                        <circle
                          cx="120"
                          cy="150"
                          r={selectedBodySite === 'abdomen' ? 14 : 10}
                          className={`${
                            selectedBodySite === 'abdomen' ? 'fill-cyan-400' : 'fill-cyan-500/80'
                          } transition-all animate-pulse`}
                        />
                        <circle cx="120" cy="150" r="22" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
                      </g>
                    )}

                    {/* 4. Vastus Lateralis (Thigh) - Front Only */}
                    {bodyFacing === 'front' && (
                      <g
                        className="cursor-pointer group"
                        onClick={() => setSelectedBodySite('vastus')}
                      >
                        <circle
                          cx="88"
                          cy="235"
                          r={selectedBodySite === 'vastus' ? 13 : 9}
                          className={`${
                            selectedBodySite === 'vastus' ? 'fill-purple-400' : 'fill-purple-500/80'
                          } transition-all animate-pulse`}
                        />
                        <circle
                          cx="152"
                          cy="235"
                          r={selectedBodySite === 'vastus' ? 13 : 9}
                          className={`${
                            selectedBodySite === 'vastus' ? 'fill-purple-400' : 'fill-purple-500/80'
                          } transition-all animate-pulse`}
                        />
                      </g>
                    )}

                    {/* 5. Median Cubital Vein (Arm crease) - Front Only */}
                    {bodyFacing === 'front' && (
                      <g
                        className="cursor-pointer group"
                        onClick={() => setSelectedBodySite('median_vein')}
                      >
                        <circle
                          cx="54"
                          cy="160"
                          r={selectedBodySite === 'median_vein' ? 11 : 8}
                          className={`${
                            selectedBodySite === 'median_vein' ? 'fill-rose-400' : 'fill-rose-500/80'
                          } transition-all animate-pulse`}
                        />
                        <circle
                          cx="186"
                          cy="160"
                          r={selectedBodySite === 'median_vein' ? 11 : 8}
                          className={`${
                            selectedBodySite === 'median_vein' ? 'fill-rose-400' : 'fill-rose-500/80'
                          } transition-all animate-pulse`}
                        />
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Skin Layer Needle Angle Cross Section Diagram */}
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-2">
                  <span>Skin Tissue Cross-Section & Insertion Angle</span>
                  <span className="text-emerald-400 font-mono">
                    Target: {injectionSites[selectedBodySite].route} ({injectionSites[selectedBodySite].angle}°)
                  </span>
                </div>

                {/* 4 Tissue Layers SVG */}
                <div className="h-16 w-full rounded-lg overflow-hidden border border-slate-700/60 flex flex-col font-mono text-[9px]">
                  <div className="h-3 bg-amber-200/80 text-amber-950 px-2 flex items-center font-bold">
                    Epidermis (Top Layer)
                  </div>
                  <div className="h-4 bg-orange-300/80 text-orange-950 px-2 flex items-center font-bold">
                    Dermis (10°-15° Intradermal)
                  </div>
                  <div className="h-4 bg-yellow-400/80 text-yellow-950 px-2 flex items-center font-bold">
                    Subcutaneous Fat Pad (45° SC - Insulin)
                  </div>
                  <div className="flex-1 bg-rose-700 text-rose-100 px-2 flex items-center font-bold">
                    Deep Muscle Tissue (90° IM - Vaccines/Antibiotics)
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Clinical Procedure & Safety Card */}
            <div className="lg:col-span-6 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
              {(() => {
                const site = injectionSites[selectedBodySite];
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {site.route} • {site.angle}° ANGLE
                        </span>
                        <h3 className="text-xl font-bold text-white mt-0.5">{site.name}</h3>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                        {site.needleGauge}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-0.5">Max Fluid Volume</span>
                        <span className="text-xs font-mono font-bold text-cyan-300">{site.maxVolume}</span>
                      </div>
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block mb-0.5">Needle Angle</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{site.angle}° Perpendicular</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Anatomical Landmarks & Safe Technique</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{site.safeLandmarks}</p>
                    </div>

                    <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-500/40 space-y-1.5">
                      <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>CRITICAL RED FLAG / DANGER ZONE</span>
                      </h4>
                      <p className="text-xs text-rose-200 leading-relaxed">{site.dangerZone}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Common Administered Medications
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {site.commonDrugs.map((drug) => (
                          <span
                            key={drug}
                            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                          >
                            {drug}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Rule: Always aspirate slightly before IM injection to verify no blood flashback.</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: C POINTERS & MEMORY GRID                           */}
        {/* ========================================================= */}
        {activeTab === 'pointers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                    Interactive C Pointers & Hardware RAM Map
                  </h2>
                  <p className="text-xs text-slate-400">
                    See addresses, dereferencing (*ptr), and memory references with dynamic vector arrows
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setTargetValue((v) => (v === 42 ? 99 : 42))}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold font-mono cursor-pointer"
                  >
                    *ptr = {targetValue === 42 ? 99 : 42}; (Dereference)
                  </button>
                  <button
                    onClick={() => setIsDoublePointer(!isDoublePointer)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold font-mono cursor-pointer"
                  >
                    {isDoublePointer ? 'Hide **pptr' : 'Add Double Pointer (**pptr)'}
                  </button>
                  <button
                    onClick={() => setShowMallocBlock(!showMallocBlock)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold font-mono cursor-pointer"
                  >
                    {showMallocBlock ? 'free(heapPtr)' : 'malloc(Heap Memory)'}
                  </button>
                </div>
              </div>

              {/* Physical Memory Blocks with Pointer SVG Vector Arrow */}
              <div className="relative bg-slate-950 p-6 rounded-xl border border-slate-800 min-h-[220px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Block 1: The Variable 'int x' */}
                  <div className="p-4 rounded-xl bg-slate-900 border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/10 relative">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2 border-b border-slate-800 pb-1">
                      <span>Variable: int x</span>
                      <span>Address: 0x1000</span>
                    </div>
                    <div className="py-4 text-center">
                      <span className="text-3xl font-mono font-bold text-white transition-all">
                        {targetValue}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 text-center">
                      4 Bytes (Stack Memory)
                    </div>
                  </div>

                  {/* Block 2: The Pointer 'int *ptr' */}
                  <div className="p-4 rounded-xl bg-slate-900 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 relative">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-2 border-b border-slate-800 pb-1">
                      <span>Pointer: int *ptr</span>
                      <span>Address: 0x1004</span>
                    </div>
                    <div className="py-4 text-center">
                      <span className="text-2xl font-mono font-bold text-amber-300">
                        0x1000
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 text-center">
                      Stores Address of x →
                    </div>
                  </div>

                  {/* Block 3: Double Pointer 'int **pptr' */}
                  {isDoublePointer ? (
                    <div className="p-4 rounded-xl bg-slate-900 border-2 border-purple-500/60 shadow-lg shadow-purple-500/10 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px] font-mono text-purple-400 mb-2 border-b border-slate-800 pb-1">
                        <span>Pointer: int **pptr</span>
                        <span>Address: 0x1008</span>
                      </div>
                      <div className="py-4 text-center">
                        <span className="text-2xl font-mono font-bold text-purple-300">
                          0x1004
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 text-center">
                        Stores Address of ptr
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 border-dashed flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
                      <span>Address 0x1008</span>
                      <span>(Free RAM Slot)</span>
                    </div>
                  )}

                  {/* Block 4: Dynamic Heap Block */}
                  {showMallocBlock ? (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-2 border-b border-slate-800 pb-1">
                        <span>Heap: int *heap</span>
                        <span>Address: 0x7FFF00</span>
                      </div>
                      <div className="py-4 text-center">
                        <span className="text-2xl font-mono font-bold text-emerald-300">
                          [10, 20, 30]
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 text-center">
                        Allocated with malloc()
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 border-dashed flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
                      <span>Heap Allocation</span>
                      <span>(Click malloc above)</span>
                    </div>
                  )}
                </div>

                {/* SVG Pointer Arrow Overlay */}
                <div className="mt-4 p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="text-amber-400">ptr</span>
                    <span>→ Points to Memory Address →</span>
                    <span className="text-cyan-400">&x (0x1000)</span>
                  </div>
                  <div className="text-slate-300">
                    Value at Target (*ptr): <span className="font-bold text-white">{targetValue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CODE & DSA ANIMATOR (BUBBLE SORT & VARS TRACKER)   */}
        {/* ========================================================= */}
        {activeTab === 'dsa' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Live Code & Sorting Algorithm Animator
                  </h2>
                  <p className="text-xs text-slate-400">
                    Step-by-step visual execution with live "Variables Tracker" (i, j, swaps, conditions)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSortingRunning(!isSortingRunning)}
                    disabled={sortingState.isFinished}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 disabled:opacity-50 cursor-pointer"
                  >
                    {isSortingRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSortingRunning ? 'Pause' : 'Play Sort'}</span>
                  </button>

                  <button
                    onClick={stepBubbleSort}
                    disabled={isSortingRunning || sortingState.isFinished}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Single Step</span>
                  </button>

                  <button
                    onClick={resetSort}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer"
                    title="Reset Array"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Physical Array Visual Bars */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                <div className="h-56 flex items-end justify-center gap-3 sm:gap-5 pb-4 border-b border-slate-800">
                  {arrayBars.map((val, idx) => {
                    const isComparing = idx === sortingState.j || idx === sortingState.j + 1;
                    const isSortedTail = idx >= arrayBars.length - sortingState.i && sortingState.i > 0;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2 flex-1 max-w-[64px] transition-all duration-300"
                      >
                        <span className="font-mono text-xs font-bold text-white">{val}</span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 flex items-center justify-center font-mono text-[10px] font-bold ${
                            isComparing
                              ? 'bg-amber-500 shadow-lg shadow-amber-500/50 scale-105'
                              : isSortedTail || sortingState.isFinished
                              ? 'bg-emerald-500/90 shadow-md shadow-emerald-500/20'
                              : 'bg-cyan-600/80'
                          }`}
                          style={{ height: `${(val / 95) * 160}px` }}
                        >
                          {isComparing ? 'CMP' : ''}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                {/* Live Variables Tracker Panel */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Outer Pass (i)</span>
                    <span className="text-lg font-mono font-bold text-cyan-300">{sortingState.i}</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Inner Index (j)</span>
                    <span className="text-lg font-mono font-bold text-amber-300">{sortingState.j}</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Total Swaps Executed</span>
                    <span className="text-lg font-mono font-bold text-rose-400">{sortingState.totalSwaps}</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block">Status</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        sortingState.isFinished ? 'text-emerald-400' : 'text-slate-300'
                      }`}
                    >
                      {sortingState.isFinished ? '✓ Array Sorted' : 'Comparing Elements'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: HYDRAULIC PHYSICS & TRANSISTOR LAB                 */}
        {/* ========================================================= */}
        {activeTab === 'physics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-400" />
                    Hydraulic Electronics Lab (Water Pipe Analogy)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Understand Voltage (Tank Height), Current (Flow Rate), Resistor (Constriction), and Transistor (Controllable Gate Valve)
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Ohm's Law: V = I × R
                  </span>
                </div>
              </div>

              {/* Interactive Hydraulic Simulation Canvas */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                {/* Visual Pipe & Water Tank System */}
                <div className="relative h-44 bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex items-center px-6">
                  {/* Water Pressure Tank (Voltage) */}
                  <div className="w-24 border-2 border-blue-500/60 rounded-xl overflow-hidden flex flex-col justify-end bg-slate-950 h-36">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-300 flex items-center justify-center font-mono font-bold text-xs text-slate-950"
                      style={{ height: `${(voltage / 24) * 100}%` }}
                    >
                      {voltage}V
                    </div>
                  </div>

                  {/* Flowing Water Pipe with Animated Bubbles */}
                  <div className="flex-1 h-12 bg-slate-800/80 border-y-2 border-slate-700 relative overflow-hidden flex items-center">
                    {/* Animated Bubbles indicating current flow */}
                    <div
                      className="absolute inset-0 flex items-center gap-4 text-cyan-400 text-xs font-mono font-bold whitespace-nowrap animate-water-flow"
                      style={{
                        animationDuration: `${Math.max(0.2, 3 / Math.max(0.1, currentAmps))}s`
                      }}
                    >
                      <span>💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧 ─── 💧</span>
                    </div>

                    {/* Pipe Constriction (Resistor) */}
                    <div
                      className="absolute left-1/3 w-12 bg-amber-500/80 border-2 border-amber-300 flex items-center justify-center text-[10px] font-bold text-slate-950"
                      style={{ height: `${Math.min(100, resistance * 10)}%` }}
                    >
                      {resistance}Ω
                    </div>

                    {/* Transistor Controllable Gate Valve */}
                    <div
                      className="absolute right-1/4 w-8 bg-rose-500/90 border-2 border-rose-300 transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ height: `${100 - transistorGate}%` }}
                    >
                      GATE
                    </div>
                  </div>

                  {/* Water Discharge Basin (Current Out) */}
                  <div className="w-24 h-36 border-2 border-emerald-500/60 rounded-xl bg-slate-950 flex flex-col items-center justify-center p-2 font-mono text-center">
                    <span className="text-[10px] text-slate-400">Current (I)</span>
                    <span className="text-2xl font-bold text-emerald-400">{currentAmps} A</span>
                    <span className="text-[10px] text-slate-500">{powerWatts} Watts</span>
                  </div>
                </div>

                {/* Real-time Sliders for Parameters */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-400 font-bold">1. Voltage (Water Tank Height)</span>
                      <span className="font-mono text-white">{voltage} V</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      value={voltage}
                      onChange={(e) => setVoltage(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">
                      Higher tank = higher gravitational pressure pushing electrons through the wire.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold">2. Resistance (Pipe Squeeze)</span>
                      <span className="font-mono text-white">{resistance} Ω</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={resistance}
                      onChange={(e) => setResistance(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">
                      Narrower pipe = more friction, reducing the flow rate of water/amperes.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-rose-400 font-bold">3. Transistor Valve Opening</span>
                      <span className="font-mono text-white">{transistorGate}% Open</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={transistorGate}
                      onChange={(e) => setTransistorGate(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400">
                      Small base current turns the valve handle, amplifying or choking the massive main pipe flow!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
