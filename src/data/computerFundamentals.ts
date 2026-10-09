import { FundamentalTopic } from '../types';

export const FUNDAMENTAL_TOPICS: FundamentalTopic[] = [
  // --- UNIT 1 ---
  {
    id: 'intro-and-characteristics',
    title: 'Computer Definition & Core Characteristics',
    unit: 'Unit 1: Introduction & Evolution',
    unitNumber: 1,
    summary: 'Computer ki definition aur uski 6 pramukh visheshatayein (Characteristics) jo exam me 5-mark me puchi jaati hain.',
    hinglishOverview: 'Computer ek electronic device hai jo raw data ko input ke roop me leta hai, instructions (programs) ke anusaar process karta hai aur useful information (output) deta hai. Ye IPO (Input-Process-Output) cycle par kaam karta hai.',
    keyPoints: [
      'Speed: Computers millions of instructions per second (MIPS) execute karte hain.',
      'Accuracy: GIGO (Garbage In, Garbage Out) principle par kaam karta hai. Galat input nahi diya toh result 100% accurate hota hai.',
      'Diligence: Computer kabhi thakta nahi hai (no fatigue, no loss of concentration).',
      'Versatility: Ek hi computer par calculation, gaming, music aur coding sab kiya ja sakta hai.',
      'Storage Capacity: Huge amount of data permanently save kar sakta hai.',
      'No IQ & No Feelings: Computer khud se soch nahi sakta, ise program instructions ki zaroorat hoti hai.'
    ],
    detailedContent: [
      '1. Speed: Computer calculations ko microseconds, nanoseconds, ya picoseconds me perform karta hai.',
      '2. Accuracy: Calculations mathematical level par bilkul precise hoti hain. Error tabhi aata hai jab human input galat ho (GIGO).',
      '3. Diligence: Insaan ghanto kaam karke thak jata hai, par computer lagatar bina kisi error ke lakho calculations kar sakta hai.',
      '4. Versatility: Ek moment par complex mathematical matrix solve kar raha hota hai aur agle hi moment printing command execute karta hai.',
      '5. Memory/Storage: Internal memory (RAM/Cache) aur large secondary storage (HDD/SSD) data retain karte hain.',
      '6. Limitations: Zero IQ (human instructions par dependent), No emotions, electricity requirement.'
    ],
    examVivaQuestions: [
      {
        question: 'What is GIGO in computer terminology?',
        answer: 'GIGO stands for Garbage In, Garbage Out. Agar computer ko galat data input diya jayega toh output bhi galat hi aayega.'
      },
      {
        question: 'What is the IPO cycle?',
        answer: 'Input -> Processing -> Output. Data input devices se aata hai, CPU use process karta hai, aur output device result display karta hai.'
      }
    ],
    importantTags: ['definition', 'characteristics', 'IPO cycle', 'GIGO', 'unit-1']
  },
  {
    id: 'generations-of-computers',
    title: 'Generations of Computers (1st to 5th Generation)',
    unit: 'Unit 1: Introduction & Evolution',
    unitNumber: 1,
    summary: '1st Generation (Vacuum Tubes) se lekar 5th Generation (AI & Quantum) tak ka complete comparative analysis.',
    hinglishOverview: 'Computer Generations hardware technology ke badlaav ko represent karti hain. Pehle bade kamro ke barabar computer hote the (Vacuum Tubes), fir Transistors, ICs, Microprocessors aur ab Artificial Intelligence tak technology pahuch chuki hai.',
    keyPoints: [
      '1st Gen (1940-1956): Vacuum Tubes, Machine Language, Bahut heat aur large size (ENIAC, EDVAC, UNIVAC).',
      '2nd Gen (1956-1963): Transistors, Assembly Language & early Fortran/COBOL, Chhota size aur kam heat (IBM 1401).',
      '3rd Gen (1964-1971): Integrated Circuits (IC - Jack Kilby), High-Level Languages (C, Pascal), Keyboard/Monitor entry (IBM 360).',
      '4th Gen (1971-Present): VLSI & Microprocessors (Intel 4004/8086), PCs, Internet, GUI Operating Systems.',
      '5th Gen (Present & Beyond): ULSI, Artificial Intelligence, Neural Networks, Parallel Processing, Quantum Computing.'
    ],
    comparisonTable: {
      headers: ['Generation', 'Switching Device', 'Primary Memory', 'Programming Language', 'Example Computers'],
      rows: [
        ['1st (1940-56)', 'Vacuum Tubes', 'Magnetic Drums', 'Machine Language (0 & 1)', 'ENIAC, UNIVAC, EDVAC'],
        ['2nd (1956-63)', 'Transistors', 'Magnetic Core', 'Assembly & Early FORTRAN', 'IBM 1401, CDC 1604'],
        ['3rd (1964-71)', 'Integrated Circuits (SSI/MSI)', 'Semiconductor (Early RAM)', 'High-Level (BASIC, Pascal, C)', 'IBM 360, PDP-8'],
        ['4th (1971-Now)', 'VLSI Microprocessors', 'Semiconductor (DRAM/SRAM)', 'C++, Java, Python, SQL', 'Apple II, IBM PC, Intel Core'],
        ['5th (Now & Future)', 'ULSI, AI chips, Quantum', 'Optical, High-speed NVMe', 'Natural Languages, AI Models', 'Supercomputers, AI Servers']
      ]
    },
    detailedContent: [
      '1st Generation: Inme vacuum tubes use hote the jo jaldi garam hokar fuse ho jate the. Sirf 0 aur 1 binary coding chalti thi. Cooling ke liye air conditioning must thi.',
      '2nd Generation: Bell Labs me William Shockley ne transistor banaya. Vacuum tubes ke muqable 100 guna chhota aur kam power consumption.',
      '3rd Generation: Ek silicon chip par hazaro transistors integrate kiye gaye (Integrated Circuit - IC). Operating systems introduce huye.',
      '4th Generation: Single silicon chip par poora CPU (Microprocessor - VLSI / LSI). Personal computers (PCs) aam logo ke ghar tak pahuche.',
      '5th Generation: Ultra Large Scale Integration (ULSI) aur Artificial Intelligence, robotics aur voice recognition.'
    ],
    examVivaQuestions: [
      {
        question: 'Who invented the Integrated Circuit (IC)?',
        answer: 'Jack Kilby (Texas Instruments) and Robert Noyce (Fairchild) invented the Integrated Circuit in 1958.'
      },
      {
        question: 'Which generation introduced the concept of Microprocessor?',
        answer: 'The 4th Generation introduced the microprocessor (VLSI technology, starting with Intel 4004 in 1971).'
      }
    ],
    importantTags: ['generations', 'vacuum-tubes', 'transistors', 'integrated-circuits', 'vlsi', 'unit-1']
  },
  {
    id: 'classification-of-computers',
    title: 'Classification of Computers by Size & Capacity',
    unit: 'Unit 1: Introduction & Evolution',
    unitNumber: 1,
    summary: 'Supercomputers, Mainframe, Minicomputers, aur Microcomputers ke beech ka difference aur unke use cases.',
    hinglishOverview: 'Size, processing speed aur cost ke aadhar par computers ko 4 mukhy category me baanta gaya hai: Supercomputer, Mainframe, Minicomputer, aur Microcomputer.',
    keyPoints: [
      'Supercomputer: World ke sabse fastest aur powerful computers. Weather forecasting, nuclear research, aur space simulation me use hote hain (e.g. PARAM, Summit, Frontier). Measured in FLOPS.',
      'Mainframe: Large organizations (Banks, Airlines, Railways) me hazaro users ke simultaneous transactions process karte hain (e.g. IBM zSeries). High reliability & throughput.',
      'Minicomputer: Medium-sized businesses aur scientific laboratories me use hote hain (e.g. PDP-11, VAX).',
      'Microcomputer: Personal Computers (PCs), Laptops, Tablets, Smartphones. Single-user system jo microprocessor par based hote hain.'
    ],
    detailedContent: [
      '1. Supercomputers: Inka speed FLOPS (Floating Point Operations Per Second) me measure hota hai (PetaFLOPS / ExaFLOPS). Bharat ka pehla supercomputer PARAM 8000 tha (developed by C-DAC under Dr. Vijay Bhatkar).',
      '2. Mainframe Computers: Inhe "Big Iron" bhi kaha jata hai. Bank ke core banking systems me 24x7 bina band huye chalte hain.',
      '3. Minicomputers: Multi-user systems jo 4 se 200 users ko handle kar sakte the.',
      '4. Microcomputers: Desktop, laptop, palmtop jo daily office, education aur entertainment ke liye use hote hain.'
    ],
    examVivaQuestions: [
      {
        question: 'What was the first Supercomputer of India?',
        answer: 'PARAM 8000, developed by C-DAC (Centre for Development of Advanced Computing) in 1991.'
      },
      {
        question: 'What unit measures the performance of a Supercomputer?',
        answer: 'FLOPS (Floating Point Operations Per Second).'
      }
    ],
    importantTags: ['classification', 'supercomputer', 'mainframe', 'microcomputer', 'param', 'unit-1']
  },

  // --- UNIT 2 ---
  {
    id: 'von-neumann-architecture',
    title: 'Von Neumann Architecture & Computer Block Diagram',
    unit: 'Unit 2: Computer Hardware & Architecture',
    unitNumber: 2,
    summary: 'Central Processing Unit (CPU), ALU, CU, Registers aur System Bus ka detailed block diagram aur workflow.',
    hinglishOverview: 'John Von Neumann ne 1945 me modern computer architecture propose kiya jise "Stored Program Concept" kehte hain — jisme program instructions aur data dono same memory me store hote hain.',
    keyPoints: [
      'Input Unit: Keyboard, mouse se data accept karke machine-readable binary (0, 1) me convert karta hai.',
      'Central Processing Unit (CPU - Brain of Computer):',
      '  • ALU (Arithmetic Logic Unit): Sabhi mathematical (+, -, *, /) aur logical (<, >, ==, AND, OR) operations execute karta hai.',
      '  • CU (Control Unit): Computer ka traffic controller. Memory se instruction fetch karta hai, decode karta hai aur sabhi components ko coordinate karta hai.',
      '  • Registers: CPU ke andar ki high-speed temporary storage cells.',
      'Storage / Memory Unit: Primary (RAM/ROM) aur Secondary (HDD/SSD).',
      'Output Unit: Binary results ko human-readable format me display karta hai (Monitor, Printer).'
    ],
    detailedContent: [
      'Workflow of Computer Block Diagram:',
      '1. Fetch: Control Unit memory se next instruction ka address Program Counter (PC) se lekar instruction fetch karta hai.',
      '2. Decode: Instruction ko decode karke pata lagata hai ki kya operation perform karna hai.',
      '3. Execute: Agar calculation hai toh ALU ko data deta hai aur result calculate karta hai.',
      '4. Store: Final result ko Memory ya Register me write-back karta hai.',
      'System Buses:',
      '• Data Bus: Actual data transfer karta hai (Bidirectional).',
      '• Address Bus: Memory locations ka address carry karta hai (Unidirectional from CPU to Memory).',
      '• Control Bus: Timing aur command signals (Read/Write, Clock, Interrupts) bhejta hai.'
    ],
    examVivaQuestions: [
      {
        question: 'What is the role of the Program Counter (PC) register?',
        answer: 'Program Counter (PC) agle execute hone wale instruction ka memory address hold karta hai.'
      },
      {
        question: 'Why is Address Bus unidirectional while Data Bus is bidirectional?',
        answer: 'CPU hamesha memory location ka address specify karta hai (CPU -> Memory), isliye Address Bus unidirectional hai. Par Data read aur write dono hota hai, isliye Data Bus bidirectional hai.'
      }
    ],
    importantTags: ['block-diagram', 'von-neumann', 'cpu', 'alu', 'cu', 'buses', 'unit-2']
  },
  {
    id: 'cpu-registers',
    title: 'CPU Internal Registers & Instruction Cycle',
    unit: 'Unit 2: Computer Hardware & Architecture',
    unitNumber: 2,
    summary: 'PC, MAR, MDR, IR, AC, SP registers ka specific kaam aur Fetch-Decode-Execute instruction cycle.',
    hinglishOverview: 'Registers CPU ke internal high-speed memory slots hote hain. RAM se CPU me aane wala data aur intermediate calculations registers me hi temporary hold hote hain.',
    keyPoints: [
      'PC (Program Counter): Next instruction ka memory address hold karta hai.',
      'MAR (Memory Address Register): Active read/write hone wali memory location ka address hold karta hai.',
      'MDR / MBR (Memory Data Register / Buffer): Memory se padha gaya ya memory me likha jane wala actual data hold karta hai.',
      'IR (Instruction Register): Currently executing instruction ka opcode hold karta hai.',
      'AC (Accumulator): ALU ke mathematical aur logical operations ka temporary result hold karta hai.',
      'SP (Stack Pointer): Stack ke top address ko track karta hai.'
    ],
    detailedContent: [
      'Instruction Cycle Steps:',
      '1. T1: [PC] -> MAR (Program Counter ka address MAR me jata hai)',
      '2. T2: Memory[MAR] -> MDR, PC = PC + 1 (Memory se instruction MDR me aata hai aur PC increment hota hai)',
      '3. T3: MDR -> IR (Instruction IR me transfer hota hai)',
      '4. T4: Decode IR (Control Unit opcode decode karta hai)',
      '5. T5: Execute (ALU operation perform karta hai aur result Accumulator me save hota hai)'
    ],
    examVivaQuestions: [
      {
        question: 'Which is the fastest memory inside a computer?',
        answer: 'CPU Registers are the fastest storage in a computer, running at the full clock speed of the processor.'
      }
    ],
    importantTags: ['registers', 'instruction-cycle', 'pc', 'mar', 'mdr', 'accumulator', 'unit-2']
  },

  // --- UNIT 3 ---
  {
    id: 'memory-hierarchy',
    title: 'Computer Memory Hierarchy (RAM, ROM, Cache, Virtual Memory)',
    unit: 'Unit 3: Memory Organization',
    unitNumber: 3,
    summary: 'Registers, Cache (L1, L2, L3), Primary RAM/ROM, aur Secondary Storage ka complete comparative hierarchy chart.',
    hinglishOverview: 'Memory Hierarchy computer memory ko speed, cost aur capacity ke aadhar par pyramid ke roop me arrange karti hai. Top par fast aur costly memory hoti hai (Registers, Cache), jabki base par slow par cheap large capacity memory hoti hai (HDD, SSD).',
    keyPoints: [
      'Registers: Fastest, lowest capacity (few bytes), CPU ke andar.',
      'Cache Memory: Ultra-fast SRAM, CPU aur RAM ke beech ka buffer (L1, L2, L3 cache). Principle of Locality par work karta hai.',
      'Primary Memory (Main Memory): RAM (Volatile - power off par data loss) & ROM (Non-volatile - BIOS/Firmware).',
      'Secondary Memory: Non-volatile, massive storage (HDD, SSD, NVMe, Flash Drives).',
      'Tertiary / Backup Memory: Magnetic Tapes, Optical Discs (CD/DVD).'
    ],
    comparisonTable: {
      headers: ['Memory Type', 'Speed / Access Time', 'Capacity', 'Cost Per Bit', 'Volatility'],
      rows: [
        ['Registers', '0.5 – 1 ns (Fastest)', 'A few bytes to 1 KB', 'Most Expensive', 'Volatile'],
        ['Cache (L1/L2/L3)', '1 – 10 ns', '512 KB – 64 MB', 'Very High', 'Volatile (SRAM)'],
        ['Main RAM (DRAM)', '15 – 60 ns', '8 GB – 64 GB', 'Moderate', 'Volatile'],
        ['SSD (NVMe / SATA)', '50 – 150 µs', '256 GB – 4 TB', 'Affordable', 'Non-Volatile'],
        ['HDD (Magnetic)', '5 – 15 ms (Slowest)', '1 TB – 16 TB', 'Lowest Cost', 'Non-Volatile']
      ]
    },
    detailedContent: [
      'RAM (Random Access Memory) vs ROM (Read Only Memory):',
      '• RAM Volatile hoti hai (computer band hote hi data khatam). Ye running programs ko hold karti hai.',
      '• SRAM (Static RAM): Flip-flops se banti hai, refresh nahi karni padti, Cache me use hoti hai.',
      '• DRAM (Dynamic RAM): Capacitor aur transistor se banti hai, periodic refresh karni padti hai, Main RAM me use hoti hai.',
      '• ROM Non-volatile hoti hai. Isme system ka bootable firmware (BIOS / UEFI) store hota hai.',
      '• ROM Types: PROM (Programmable), EPROM (Erasable via UV light), EEPROM (Electrically Erasable - e.g. Pen drives, Flash memory).'
    ],
    examVivaQuestions: [
      {
        question: 'What is the difference between SRAM and DRAM?',
        answer: 'SRAM flip-flops se banti hai, fast hoti hai aur refresh nahi karni padti (Cache me use hoti hai). DRAM capacitors se banti hai, slow hoti hai aur bar-bar refresh karni padti hai (Main RAM me use hoti hai).'
      },
      {
        question: 'What is Virtual Memory?',
        answer: 'Virtual memory hard disk ka wo temporary reserved portion hota hai jo RAM full ho jane par RAM ki tarah act karta hai (Paging technique se).'
      }
    ],
    importantTags: ['memory-hierarchy', 'ram', 'rom', 'cache', 'sram', 'dram', 'unit-3']
  },

  // --- UNIT 4 ---
  {
    id: 'input-output-devices',
    title: 'Input & Output Devices & Printer Classifications',
    unit: 'Unit 4: I/O Devices & Interfaces',
    unitNumber: 4,
    summary: 'Keyboard, Mouse, OMR, OCR, MICR, Monitors, and Impact vs Non-Impact Printers detailed comparison.',
    hinglishOverview: 'Input devices human-readable data ko computer binary me convert karte hain, jabki Output devices CPU ke processed binary results ko humans ke samajhne yogya banate hain.',
    keyPoints: [
      'Specialized Input Devices:',
      '  • OMR (Optical Mark Recognition): Objective MCQ answer sheets scan karne ke liye.',
      '  • OCR (Optical Character Recognition): Printed ya handwritten text ko editable digital text me convert karne ke liye.',
      '  • MICR (Magnetic Ink Character Recognition): Bank cheques ke bottom code line (cheque number, bank code) ko scan karne ke liye.',
      '  • Barcode & QR Code Scanners: Optical reflectivity se encoded data read karte hain.',
      'Printer Classifications:',
      '  • Impact Printers: Paper par physically hammer/ribbon strike karte hain (Awaaz zyada hoti hai). E.g. Dot Matrix Printer, Daisy Wheel, Line Printer.',
      '  • Non-Impact Printers: Paper ko bina touch kiye chemical, spray ya laser heat se print karte hain (Fast & Quiet). E.g. Laser Printer (toner powder), Inkjet Printer (liquid ink).'
    ],
    comparisonTable: {
      headers: ['Feature', 'Impact Printers (e.g. Dot Matrix)', 'Non-Impact Printers (e.g. Laser / Inkjet)'],
      rows: [
        ['Printing Method', 'Physical striking on inked ribbon', 'Laser beam heat or ink droplet spray'],
        ['Noise Level', 'Bahut zyada shor (Noisy)', 'Bahut shant (Quiet / Silent)'],
        ['Print Quality', 'Low resolution, pixelated dots', 'High resolution (600 - 2400 DPI)'],
        ['Speed', 'Slow (measured in CPS/LPM)', 'Fast (measured in PPM - Pages Per Minute)'],
        ['Carbon Copies', 'Ban sakti hain (Multicopy feasible)', 'Nahi ban sakti (Single sheet at a time)']
      ]
    },
    detailedContent: [
      'Monitor Display Technologies:',
      '• CRT (Cathode Ray Tube): Purane heavy monitors, electron gun se phosphor glow.',
      '• LCD (Liquid Crystal Display): CCFL backlight ke sath liquid crystals light control karte hain.',
      '• LED (Light Emitting Diode): LCD ka improved version jisme LEDs backlight provide karti hain (energy efficient, thin).',
      '• OLED (Organic LED): Har pixel apni khud ki light emit karta hai (true black contrast).'
    ],
    examVivaQuestions: [
      {
        question: 'Where is MICR primarily used?',
        answer: 'MICR (Magnetic Ink Character Recognition) is primarily used in banking sector for processing bank cheques.'
      },
      {
        question: 'Which printer uses dry toner powder?',
        answer: 'Laser Printers use dry toner powder (carbon particles and plastic resin) fused with heat onto the paper.'
      }
    ],
    importantTags: ['input-devices', 'output-devices', 'printers', 'micr', 'ocr', 'omr', 'unit-4']
  },

  // --- UNIT 5 ---
  {
    id: 'software-and-translators',
    title: 'Computer Software & Language Translators (Compiler vs Interpreter)',
    unit: 'Unit 5: Software & Programming Languages',
    unitNumber: 5,
    summary: 'System Software vs Application Software, Compiler vs Interpreter vs Assembler comparison table.',
    hinglishOverview: 'Hardware bina software ke ek bejaan box hai. Software programs ka collection hota hai jo hardware ko batata hai ki kya aur kaise kaam karna hai.',
    keyPoints: [
      'System Software: Hardware ko manage aur operate karta hai. E.g. Operating System, Device Drivers, Language Translators.',
      'Application Software: User ke specific task ke liye banaya jata hai. E.g. MS Office, Photoshop, Web Browser, VLC Player.',
      'Utility Software: System ki health, maintenance aur security ke liye hota hai. E.g. Antivirus, Disk Defragmenter, Backup software.',
      'Translators (Language Processors):',
      '  • Assembler: Assembly language mnemonic code ko machine code me convert karta hai.',
      '  • Compiler: Poore source code ko ek sath translate karke binary executable (.exe) file banata hai. E.g. GCC, Turbo C.',
      '  • Interpreter: Source code ko line-by-line padhta hai aur turant execute karta hai. E.g. Python, JavaScript.'
    ],
    comparisonTable: {
      headers: ['Feature', 'Compiler (e.g. C, C++)', 'Interpreter (e.g. Python, JS)'],
      rows: [
        ['Translation Unit', 'Entire source code at once', 'Line-by-line execution'],
        ['Intermediate Code', 'Generates Object code / .exe file', 'No object code saved, direct run'],
        ['Execution Speed', 'Fast execution after compilation', 'Slower (translates every time it runs)'],
        ['Error Reporting', 'Saare errors compilation ke end me list karta hai', 'Pehle error par execution turant ruk jata hai'],
        ['Memory Usage', 'Object file store karne ke liye extra memory', 'Kam memory requirement']
      ]
    },
    detailedContent: [
      'Linker vs Loader:',
      '• Linker: Compiler dwara generate kiye gaye alag-alag object files aur library routines ko jodkar single executable file (.exe) banata hai.',
      '• Loader: Executable file ko secondary storage se read karke primary memory (RAM) me load karta hai taaki CPU use execute kar sake.'
    ],
    examVivaQuestions: [
      {
        question: 'What is the main difference between Compiler and Interpreter?',
        answer: 'Compiler poore code ko ek sath scan karke machine code banata hai, jabki Interpreter code ko line-by-line read karke turant execute karta hai.'
      },
      {
        question: 'Is C language compiled or interpreted?',
        answer: 'C is a compiled language. Source code (.c) compiler ke zariye object code (.obj / .o) aur fir linker se executable (.exe) me banta hai.'
      }
    ],
    importantTags: ['software', 'compiler', 'interpreter', 'assembler', 'linker', 'loader', 'unit-5']
  },

  // --- UNIT 6 ---
  {
    id: 'operating-system-basics',
    title: 'Operating System Fundamentals & Process Management',
    unit: 'Unit 6: Operating Systems',
    unitNumber: 6,
    summary: 'OS ke core functions (Memory, Process, File, Device), aur OS types (Batch, Time-sharing, Real-time).',
    hinglishOverview: 'Operating System (OS) user aur computer hardware ke beech ka interface (mediator) hota hai. Ye computer ke sabhi resources (CPU, Memory, Files, I/O devices) ko efficiently manage karta hai.',
    keyPoints: [
      'Core Functions of OS:',
      '  1. Process Management: CPU scheduling, process creation, execution, aur termination.',
      '  2. Memory Management: Allocation aur de-allocation of RAM blocks to programs.',
      '  3. File System Management: Files aur directories ka organization, access permissions.',
      '  4. Device Management: Device drivers ke zariye I/O devices ko coordinate karna.',
      '  5. Security & Protection: User accounts, passwords, virus/malware authorization.',
      'Types of Operating Systems:',
      '  • Batch OS: Similar jobs ko batch me bind karke CPU ko dete the (No user interaction).',
      '  • Multiprogramming OS: Ek sath multiple programs RAM me hote hain taaki CPU idle na baithe.',
      '  • Time-Sharing / Multitasking: Har process ko small time slice (Quantum) diya jata hai (e.g. Unix, Linux, Windows).',
      '  • Real-Time OS (RTOS): Time constraint strict hota hai (Missed deadline = failure). E.g. Missile control, Airbag system.'
    ],
    detailedContent: [
      'Process Lifecycle (5 States):',
      '1. New: Process create ho raha hai.',
      '2. Ready: Process RAM me hai aur CPU milne ka intezar kar raha hai.',
      '3. Running: CPU process ke instructions execute kar raha hai.',
      '4. Waiting / Blocked: I/O operation ya event ka intezar kar raha hai.',
      '5. Terminated: Process execution successfully khatam ho chuka hai.'
    ],
    examVivaQuestions: [
      {
        question: 'What is Time Quantum in OS?',
        answer: 'Time Quantum (Time Slice) wo fixed chhota samay (milliseconds) hota hai jo CPU scheduling me har process ko turn-by-turn milta hai (Round Robin scheduling).'
      },
      {
        question: 'Give an example of a Real-Time Operating System (RTOS).',
        answer: 'VxWorks, QNX, RTLinux used in aircraft flight control and medical equipment.'
      }
    ],
    importantTags: ['operating-system', 'process-states', 'batch-os', 'multitasking', 'rtos', 'unit-6']
  },

  // --- UNIT 7 ---
  {
    id: 'computer-networks-and-internet',
    title: 'Computer Networks, Topologies & OSI 7-Layer Model',
    unit: 'Unit 7: Networks & Internet Architecture',
    unitNumber: 7,
    summary: 'LAN, MAN, WAN, Topologies (Star, Bus, Mesh), Transmission Media, aur OSI Model ki 7 layers.',
    hinglishOverview: 'Computer Network do ya do se zyada computers ka collection hai jo communication channels ke zariye aapas me data aur resources (printers, files, internet) share karne ke liye jude hote hain.',
    keyPoints: [
      'Network by Scale:',
      '  • PAN (Personal Area Network): 10 meters ke andar (Bluetooth, Hotspot).',
      '  • LAN (Local Area Network): Single room, building ya campus (Ethernet, Wi-Fi).',
      '  • MAN (Metropolitan Area Network): Poore city ke scale par (Cable TV network).',
      '  • WAN (Wide Area Network): Country ya globe level par (The Internet).',
      'Network Topologies:',
      '  • Star Topology: Sabhi nodes ek central device (Switch/Hub) se judi hoti hain (Most popular). Agar central switch kharab ho toh poora network down.',
      '  • Bus Topology: Single backbone cable par sabhi nodes connected hoti hain (Terminators at ends). Cable break = network down.',
      '  • Ring Topology: Har computer do padosi computers se juda hota hai (Token passing).',
      '  • Mesh Topology: Har node har doosri node se directly connected hoti hai (Highest reliability, costly cabling).'
    ],
    comparisonTable: {
      headers: ['OSI Layer Number & Name', 'Primary Function', 'Data Unit / Protocol'],
      rows: [
        ['Layer 7: Application', 'User interface, network services access', 'HTTP, FTP, SMTP, DNS'],
        ['Layer 6: Presentation', 'Data format, encryption, compression', 'JPEG, SSL/TLS, ASCII'],
        ['Layer 5: Session', 'Session start, maintain & terminate', 'RPC, NetBIOS, Sockets'],
        ['Layer 4: Transport', 'End-to-end delivery, flow & error control', 'Segments / TCP, UDP'],
        ['Layer 3: Network', 'Logical addressing & routing paths', 'Packets / IP, ICMP, Routers'],
        ['Layer 2: Data Link', 'Physical addressing, framing, error check', 'Frames / MAC Address, Switches'],
        ['Layer 1: Physical', 'Raw bit transmission over physical media', 'Bits / Cables, Hubs, Voltage']
      ]
    },
    detailedContent: [
      'OSI Model 7 Layers yaad rakhne ki Shortcut Mnemonic:',
      '"Please Do Not Throw Sausage Pizza Away"',
      'P - Physical (Layer 1)',
      'D - Data Link (Layer 2)',
      'N - Network (Layer 3)',
      'T - Transport (Layer 4)',
      'S - Session (Layer 5)',
      'P - Presentation (Layer 6)',
      'A - Application (Layer 7)',
      'IPv4 vs IPv6:',
      '• IPv4: 32-bit address hota hai (e.g. 192.168.1.1). Total ~4.3 billion addresses.',
      '• IPv6: 128-bit hexadecimal address hota hai (e.g. 2001:0db8::8a2e). Unlimited address space.'
    ],
    examVivaQuestions: [
      {
        question: 'Which network topology requires the most amount of cabling?',
        answer: 'Mesh Topology requires the maximum cabling because each node is connected to every other node (Formula: n(n-1)/2 cables).'
      },
      {
        question: 'On which layer of OSI model does a Router operate?',
        answer: 'Routers operate on Layer 3: Network Layer (using IP Addresses).'
      }
    ],
    importantTags: ['networking', 'topologies', 'osi-model', 'lan', 'wan', 'ipv4', 'unit-7']
  },

  // --- UNIT 8 ---
  {
    id: 'cyber-security-and-data',
    title: 'Data Storage Units & Cyber Hygiene Basics',
    unit: 'Unit 8: Data Storage & Cyber Security',
    unitNumber: 8,
    summary: 'Bits, Bytes, KB, MB, GB, TB scale chart, ASCII/Unicode standards, aur Virus, Worm, Trojan basics.',
    hinglishOverview: 'Computer data digital format me store hota hai. Yahan memory measurement units aur cyber security ke basic terms samajhte hain jo exams me frequently aate hain.',
    keyPoints: [
      'Data Units Hierarchy:',
      '  • 1 Bit = Binary digit (0 ya 1)',
      '  • 4 Bits = 1 Nibble',
      '  • 8 Bits = 1 Byte (1 character store karta hai)',
      '  • 1024 Bytes = 1 Kilobyte (KB)',
      '  • 1024 KB = 1 Megabyte (MB)',
      '  • 1024 MB = 1 Gigabyte (GB)',
      '  • 1024 GB = 1 Terabyte (TB)',
      '  • 1024 TB = 1 Petabyte (PB)',
      'Cyber Threats:',
      '  • Virus: Program jo doosre files se attach hota hai aur user action par replicate hota hai.',
      '  • Worm: Standalone malware jo bina human interaction ke automatically network par spread hota hai.',
      '  • Trojan Horse: Legitimate software jaisa dikhta hai par secretly backdoor create karta hai.',
      '  • Firewall: Network traffic ko monitor karke unauthorized incoming/outgoing traffic block karta hai.'
    ],
    comparisonTable: {
      headers: ['Threat Type', 'Spread Method', 'Host File Needed?', 'Main Impact'],
      rows: [
        ['Virus', 'User executes infected file', 'Yes (Attaches to .exe/docs)', 'Corrupts or deletes data'],
        ['Worm', 'Network vulnerabilities (Self-replicates)', 'No (Standalone)', 'Consumes network bandwidth & CPU'],
        ['Trojan Horse', 'Disguised as useful software', 'Yes (Wrapper)', 'Creates backdoor for hackers / data theft'],
        ['Ransomware', 'Phishing emails / malicious links', 'Yes', 'Encrypts user files and demands ransom']
      ]
    },
    detailedContent: [
      '1. Bit (Binary Digit): Computer memory ki sabse chhoti unit. Iski value sirf 0 ya 1 ho sakti hai.',
      '2. Nibble: 4 bits ka group 1 nibble kehlata hai (e.g. 1010). Hexadecimal ka 1 digit 1 nibble me fit hota hai.',
      '3. Byte: 8 bits milkar 1 byte banta hai. Computer me 1 character (jaise letter "A") store karne ke liye 1 byte lagti hai.',
      '4. Binary Prefix Rule: Memory calculation me 1024 (2^10) ka multiplier use hota hai: 1024 Bytes = 1 KB, 1024 KB = 1 MB, 1024 MB = 1 GB, 1024 GB = 1 TB.',
      '5. ASCII vs Unicode: ASCII 7-bit/8-bit standard hai jo English characters (128-256) support karta hai. Unicode 16-bit/32-bit (UTF-8) hai jo Hindi, emojis aur world ki sabhi languages encode karta hai.',
      '6. Antivirus & Firewall: Firewall real-time packets inspect karta hai, jabki Antivirus signature database se virus code scan karke isolate ya delete karta hai.'
    ],
    examVivaQuestions: [
      {
        question: 'How many bits are there in 1 Nibble?',
        answer: 'There are 4 bits in 1 Nibble (half a byte).'
      },
      {
        question: 'What is the full form of ASCII?',
        answer: 'American Standard Code for Information Interchange (standard 7-bit / 8-bit code).'
      }
    ],
    importantTags: ['storage-units', 'byte-conversion', 'ascii', 'cyber-security', 'virus-vs-worm', 'unit-8']
  }
];

export const FUNDAMENTAL_UNITS = [
  { id: 'all', label: 'All Units (Complete Notes)' },
  { id: 'unit-1', label: 'Unit 1: Intro & Generations' },
  { id: 'unit-2', label: 'Unit 2: Architecture & CPU' },
  { id: 'unit-3', label: 'Unit 3: Memory Organization' },
  { id: 'unit-4', label: 'Unit 4: I/O & Printers' },
  { id: 'unit-5', label: 'Unit 5: Software & Translators' },
  { id: 'unit-6', label: 'Unit 6: Operating Systems' },
  { id: 'unit-7', label: 'Unit 7: Networks & OSI Model' },
  { id: 'unit-8', label: 'Unit 8: Data & Cyber Basics' }
];
