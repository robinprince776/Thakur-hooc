import React, { useState } from 'react';
import { Maximize2, Minimize2, ZoomIn, Info, Eye } from 'lucide-react';

interface ChapterIllustrationProps {
  chapterId: number;
  className?: string;
  allowZoom?: boolean;
}

export const ChapterIllustration: React.FC<ChapterIllustrationProps> = ({
  chapterId,
  className = '',
  allowZoom = true
}) => {
  const [selectedCallout, setSelectedCallout] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Render SVG illustrations matching each chapter's educational metaphor
  const renderIllustration = () => {
    switch (chapterId) {
      // Chapter 1: Ajeeb Machine (Insaan vs Computer)
      case 1:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ch1-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="100%" stopColor="#1C2541" />
              </linearGradient>
              <linearGradient id="ch1-screen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
            </defs>
            <rect width="600" height="320" rx="20" fill="url(#ch1-bg)" />

            {/* Title Bar */}
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 1: THE CORE DIFFERENCE (INSAAN VS MACHINE)
            </text>

            {/* Left side: Human brain / Remote control */}
            <g transform="translate(60, 48)">
              <rect x="0" y="0" width="160" height="195" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="80" cy="52" r="30" fill="#0284C7" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="2" />
              <text x="80" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="26">👦</text>
              <text x="80" y="105" textAnchor="middle" fill="#BAE6FD" fontSize="13" fontWeight="bold">Aarav (Human)</text>
              <text x="80" y="125" textAnchor="middle" fill="#94A3B8" fontSize="10">Thinks &amp; Decides Intent</text>
              <rect x="25" y="145" width="110" height="32" rx="8" fill="#0284C7" />
              <text x="80" y="165" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Gives Order 🎮</text>
            </g>

            {/* Flow Arrow with Instructions */}
            <g transform="translate(235, 125)">
              <path d="M 0 20 L 110 20" stroke="#38BDF8" strokeWidth="4" strokeDasharray="8 4" />
              <polygon points="120,20 105,12 105,28" fill="#38BDF8" />
              <rect x="15" y="-18" width="90" height="24" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
              <text x="60" y="-2" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">Instructions ⚡</text>
            </g>

            {/* Right side: Computer Monitor & Lightning execution */}
            <g transform="translate(365, 42)">
              <rect x="0" y="0" width="175" height="145" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
              <rect x="10" y="10" width="155" height="105" rx="8" fill="url(#ch1-screen)" />
              <circle cx="87" cy="52" r="22" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2" />
              <text x="87" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="22">🤖</text>
              <text x="87" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Byte (Follower)</text>
              <rect x="72" y="145" width="30" height="22" fill="#334155" />
              <rect x="47" y="167" width="80" height="8" rx="4" fill="#475569" />
              <rect x="12" y="188" width="150" height="26" rx="8" fill="#065F46" stroke="#10B981" strokeWidth="1" />
              <text x="87" y="205" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="bold">Speed: 300 Cr Op/Sec</text>
            </g>

            {/* Caption banner at bottom */}
            <rect x="40" y="265" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="287" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 Formula: Insaan = Sochne Wala (Brain) | Computer = Tez Order Follower (Muscles)
            </text>
          </svg>
        );

      // Chapter 2: Byte Ke Ghar Ka Tour (The PC City)
      case 2:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 2: PC CITY (COMPUTER KE ANDAR KA GHAR)
            </text>

            {/* Green Motherboard Base Plate */}
            <rect x="40" y="45" width="520" height="225" rx="14" fill="#064E3B" stroke="#10B981" strokeWidth="2" />
            <path d="M 60 65 L 540 65 M 60 155 L 540 155 M 60 245 L 540 245" stroke="#047857" strokeWidth="1" strokeDasharray="4 4" />

            {/* 1. CPU - The Manager */}
            <g transform="translate(60, 75)">
              <rect x="0" y="0" width="105" height="110" rx="12" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
              <text x="52" y="40" textAnchor="middle" fill="#38BDF8" fontSize="26">👔</text>
              <text x="52" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">CPU</text>
              <text x="52" y="86" textAnchor="middle" fill="#93C5FD" fontSize="10">The Manager</text>
              <text x="52" y="100" textAnchor="middle" fill="#64748B" fontSize="8">Calculates &amp; Decides</text>
            </g>

            {/* 2. RAM - Study Table */}
            <g transform="translate(185, 75)">
              <rect x="0" y="0" width="105" height="110" rx="12" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" />
              <text x="52" y="40" textAnchor="middle" fill="#F59E0B" fontSize="26">📖</text>
              <text x="52" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">RAM</text>
              <text x="52" y="86" textAnchor="middle" fill="#FCD34D" fontSize="10">Study Table</text>
              <text x="52" y="100" textAnchor="middle" fill="#64748B" fontSize="8">Active Tasks</text>
            </g>

            {/* 3. Storage (SSD) - Steel Almari */}
            <g transform="translate(310, 75)">
              <rect x="0" y="0" width="105" height="110" rx="12" fill="#1E293B" stroke="#EC4899" strokeWidth="3" />
              <text x="52" y="40" textAnchor="middle" fill="#EC4899" fontSize="26">🗄️</text>
              <text x="52" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">SSD / ROM</text>
              <text x="52" y="86" textAnchor="middle" fill="#F472B6" fontSize="10">Steel Almari</text>
              <text x="52" y="100" textAnchor="middle" fill="#64748B" fontSize="8">Permanent Files</text>
            </g>

            {/* 4. GPU - The Artist */}
            <g transform="translate(435, 75)">
              <rect x="0" y="0" width="105" height="110" rx="12" fill="#1E293B" stroke="#A855F7" strokeWidth="3" />
              <text x="52" y="40" textAnchor="middle" fill="#A855F7" fontSize="26">🎨</text>
              <text x="52" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">GPU</text>
              <text x="52" y="86" textAnchor="middle" fill="#D8B4FE" fontSize="10">Drawing Artist</text>
              <text x="52" y="100" textAnchor="middle" fill="#64748B" fontSize="8">3D &amp; Games</text>
            </g>

            {/* Motherboard Highway Label */}
            <rect x="120" y="210" width="360" height="34" rx="8" fill="#0F172A" stroke="#10B981" strokeWidth="1" />
            <text x="300" y="232" textAnchor="middle" fill="#34D399" fontSize="11" fontWeight="bold">
              Motherboard = The Glowing Highway connecting all hardware! 🛣️
            </text>
          </svg>
        );

      // Chapter 3: Bite Ki Batein (0 aur 1 ka Khel)
      case 3:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 3: BINARY WORLD (8 SWITCHES = 1 BYTE = 'A')
            </text>

            {/* 8 Bits Switch Row */}
            <g transform="translate(45, 55)">
              {[
                { bit: '0', state: 'OFF', color: '#64748B' },
                { bit: '1', state: 'ON', color: '#10B981' },
                { bit: '0', state: 'OFF', color: '#64748B' },
                { bit: '0', state: 'OFF', color: '#64748B' },
                { bit: '0', state: 'OFF', color: '#64748B' },
                { bit: '0', state: 'OFF', color: '#64748B' },
                { bit: '0', state: 'OFF', color: '#64748B' },
                { bit: '1', state: 'ON', color: '#10B981' }
              ].map((sw, idx) => (
                <g key={idx} transform={`translate(${idx * 65}, 0)`}>
                  <rect x="0" y="0" width="55" height="92" rx="10" fill="#1E293B" stroke={sw.color} strokeWidth="2" />
                  <circle cx="27" cy="30" r="14" fill={sw.state === 'ON' ? '#10B981' : '#334155'} />
                  <text x="27" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">{sw.bit}</text>
                  <text x="27" y="65" textAnchor="middle" fill={sw.color} fontSize="10" fontWeight="bold">{sw.state}</text>
                  <text x="27" y="80" textAnchor="middle" fill="#94A3B8" fontSize="8">Bit {7 - idx}</text>
                </g>
              ))}
            </g>

            {/* Translation Box */}
            <g transform="translate(80, 175)">
              <rect x="0" y="0" width="440" height="110" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <text x="220" y="28" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="bold">
                BINARY TO HUMAN ALPHABET
              </text>
              <text x="220" y="65" textAnchor="middle" fill="#38BDF8" fontSize="22" fontWeight="black" fontFamily="monospace">
                01000001 (Binary) = 65 (Decimal) = 'A'
              </text>
              <text x="220" y="95" textAnchor="middle" fill="#34D399" fontSize="11">
                Har Photo, Gaana aur WhatsApp message isi 0 aur 1 se banta hai! 🎵 📸
              </text>
            </g>
          </svg>
        );

      // Chapter 4: Jagaane Wala Button (Booting, BIOS & OS)
      case 4:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 4: BOOTING PROCESS (JAGAANE WALA BUTTON)
            </text>

            <g transform="translate(40, 60)">
              {/* Step 1: Power Button */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="115" height="175" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="57" y="42" textAnchor="middle" fontSize="30">⚡</text>
                <text x="57" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">1. Power On</text>
                <rect x="10" y="95" width="95" height="50" rx="6" fill="#0F172A" />
                <text x="57" y="115" textAnchor="middle" fill="#FCD34D" fontSize="9">Current jumps</text>
                <text x="57" y="130" textAnchor="middle" fill="#FCD34D" fontSize="9">into Motherboard</text>
              </g>

              {/* Arrow */}
              <path d="M 125 85 L 145 85" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow)" />

              {/* Step 2: BIOS / UEFI */}
              <g transform="translate(150, 0)">
                <rect x="0" y="0" width="125" height="175" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🛠️</text>
                <text x="62" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">2. BIOS / POST</text>
                <rect x="10" y="95" width="105" height="65" rx="6" fill="#0F172A" />
                <text x="62" y="115" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold">Hardware Check</text>
                <text x="62" y="130" textAnchor="middle" fill="#94A3B8" fontSize="8">RAM OK? CPU OK?</text>
                <text x="62" y="145" textAnchor="middle" fill="#10B981" fontSize="8">BEEP! All Clean ✅</text>
              </g>

              {/* Arrow */}
              <path d="M 285 85 L 305 85" stroke="#38BDF8" strokeWidth="3" />

              {/* Step 3: Bootloader */}
              <g transform="translate(310, 0)">
                <rect x="0" y="0" width="115" height="175" rx="14" fill="#1E293B" stroke="#A855F7" strokeWidth="2" />
                <text x="57" y="42" textAnchor="middle" fontSize="30">🗝️</text>
                <text x="57" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">3. Bootloader</text>
                <rect x="10" y="95" width="95" height="50" rx="6" fill="#0F172A" />
                <text x="57" y="115" textAnchor="middle" fill="#D8B4FE" fontSize="9">Finds OS from</text>
                <text x="57" y="130" textAnchor="middle" fill="#D8B4FE" fontSize="9">SSD &amp; loads to RAM</text>
              </g>

              {/* Arrow */}
              <path d="M 435 85 L 455 85" stroke="#A855F7" strokeWidth="3" />

              {/* Step 4: Operating System */}
              <g transform="translate(460, 0)">
                <rect x="0" y="0" width="115" height="175" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="57" y="42" textAnchor="middle" fontSize="30">🖥️</text>
                <text x="57" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">4. OS Wakeup</text>
                <rect x="10" y="95" width="95" height="50" rx="6" fill="#0F172A" />
                <text x="57" y="115" textAnchor="middle" fill="#A7F3D0" fontSize="9">Windows / Mac</text>
                <text x="57" y="130" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">Desktop Ready!</text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 Jagaane wala (BIOS) aur poora din chalane wala (OS) dono alag-alag hote hain!
            </text>
          </svg>
        );

      // Chapter 5: Machine Ki Language (Recipe & Algorithm)
      case 5:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 5: ALGORITHM = RECIPE (STEP-BY-STEP INSTRUCTIONS)
            </text>

            {/* Bad Instruction vs Good Instruction */}
            <g transform="translate(45, 55)">
              {/* Bad instruction */}
              <rect x="0" y="0" width="235" height="190" rx="16" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
              <text x="117" y="35" textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="bold">
                ❌ Insaan ki Bhasha: "Paani La Do"
              </text>
              <rect x="15" y="55" width="205" height="115" rx="10" fill="#450A0A" />
              <text x="117" y="80" textAnchor="middle" fill="#FCA5A5" fontSize="11">🤖 Byte is Confused:</text>
              <text x="117" y="105" textAnchor="middle" fill="#F87171" fontSize="10">"Glass kahan hai?"</text>
              <text x="117" y="125" textAnchor="middle" fill="#F87171" fontSize="10">"Kitna paani? Thanda ya garam?"</text>
              <text x="117" y="150" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold">
                💥 ERROR 404: Instruction Missing!
              </text>
            </g>

            <g transform="translate(320, 55)">
              {/* Good recipe algorithm */}
              <rect x="0" y="0" width="235" height="190" rx="16" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
              <text x="117" y="35" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="bold">
                ✅ Algorithm (Step-by-Step Recipe)
              </text>
              <rect x="15" y="55" width="205" height="115" rx="10" fill="#064E3B" />
              <text x="25" y="80" fill="#A7F3D0" fontSize="10" fontWeight="bold">1. Kitchen me jao</text>
              <text x="25" y="100" fill="#A7F3D0" fontSize="10" fontWeight="bold">2. Kaanch ka glass uthao</text>
              <text x="25" y="120" fill="#A7F3D0" fontSize="10" fontWeight="bold">3. 200ml paani bharo</text>
              <text x="25" y="140" fill="#A7F3D0" fontSize="10" fontWeight="bold">4. Table pe laakar rakho</text>
              <text x="117" y="158" textAnchor="middle" fill="#34D399" fontSize="10" fontWeight="black">
                ✨ SUCCESS: Task Finished 100%!
              </text>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 Programming = Computer ko ek aisi recipe dena jisme ek bhi galti na ho!
            </text>
          </svg>
        );

      // Chapter 6: Duniya Ka Bada Shehar (IP & DNS)
      case 6:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 6: INTERNET HIGHWAY (IP ADDRESS &amp; DNS PHONEBOOK)
            </text>

            {/* Aarav's Home (IP Address) */}
            <g transform="translate(40, 60)">
              <rect x="0" y="0" width="130" height="170" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <text x="65" y="45" textAnchor="middle" fill="#38BDF8" fontSize="32">🏠</text>
              <text x="65" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Aarav Ka Phone</text>
              <rect x="15" y="95" width="100" height="24" rx="6" fill="#0F172A" />
              <text x="65" y="111" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold">IP: 192.168.1.5</text>
              <text x="65" y="145" textAnchor="middle" fill="#94A3B8" fontSize="10">Sends "google.com"</text>
            </g>

            {/* DNS Tower (Phonebook) */}
            <g transform="translate(235, 55)">
              <rect x="0" y="0" width="130" height="180" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <text x="65" y="42" textAnchor="middle" fill="#F59E0B" fontSize="32">📖</text>
              <text x="65" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">DNS Phonebook</text>
              <text x="65" y="95" textAnchor="middle" fill="#FCD34D" fontSize="10">Translates Name</text>
              <path d="M 20 110 L 110 110" stroke="#475569" strokeWidth="1" />
              <text x="65" y="130" textAnchor="middle" fill="#94A3B8" fontSize="9">google.com ➡️</text>
              <text x="65" y="152" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">142.250.190.46</text>
            </g>

            {/* Destination Server */}
            <g transform="translate(430, 60)">
              <rect x="0" y="0" width="130" height="170" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
              <text x="65" y="45" textAnchor="middle" fill="#10B981" fontSize="32">🏢</text>
              <text x="65" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Google Server</text>
              <rect x="15" y="95" width="100" height="24" rx="6" fill="#0F172A" />
              <text x="65" y="111" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">IP: 142.250.190.46</text>
              <text x="65" y="145" textAnchor="middle" fill="#94A3B8" fontSize="10">Returns Webpage ⚡</text>
            </g>

            {/* Connecting Roads & Postman Router */}
            <path d="M 170 145 L 235 145" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 3" />
            <path d="M 365 145 L 430 145" stroke="#10B981" strokeWidth="3" strokeDasharray="6 3" />
            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              📬 Router = Daakiya | IP = Ghar Ka Pata | DNS = Phonebook jo naam ko number banati hai!
            </text>
          </svg>
        );

      // Chapter 7: Darwaze Aur Chowkidaar (Ports & Firewall)
      case 7:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 7: PORTS &amp; FIREWALL (DARWAZE AUR CHOWKIDAAR)
            </text>

            {/* The Computer Fortress */}
            <rect x="45" y="55" width="330" height="195" rx="16" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <text x="210" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">
              🖥️ Computer Fortress (65,535 Doors)
            </text>

            {/* Door 80: HTTP */}
            <g transform="translate(65, 105)">
              <rect x="0" y="0" width="80" height="120" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              <text x="40" y="32" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">Port 80</text>
              <text x="40" y="55" textAnchor="middle" fill="#94A3B8" fontSize="9">Web HTTP</text>
              <rect x="10" y="75" width="60" height="25" rx="4" fill="#0284C7" />
              <text x="40" y="91" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">OPEN ✅</text>
            </g>

            {/* Door 443: HTTPS */}
            <g transform="translate(170, 105)">
              <rect x="0" y="0" width="80" height="120" rx="8" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
              <text x="40" y="32" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="bold">Port 443</text>
              <text x="40" y="55" textAnchor="middle" fill="#94A3B8" fontSize="9">Secure SSL</text>
              <rect x="10" y="75" width="60" height="25" rx="4" fill="#059669" />
              <text x="40" y="91" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">SAFE 🔒</text>
            </g>

            {/* Door 22: SSH */}
            <g transform="translate(275, 105)">
              <rect x="0" y="0" width="80" height="120" rx="8" fill="#0F172A" stroke="#EF4444" strokeWidth="2" />
              <text x="40" y="32" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">Port 22</text>
              <text x="40" y="55" textAnchor="middle" fill="#94A3B8" fontSize="9">Remote SSH</text>
              <rect x="10" y="75" width="60" height="25" rx="4" fill="#DC2626" />
              <text x="40" y="91" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">LOCKED ⛔</text>
            </g>

            {/* Firewall Guard Robot */}
            <g transform="translate(405, 65)">
              <rect x="0" y="0" width="150" height="175" rx="16" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <text x="75" y="45" textAnchor="middle" fill="#F59E0B" fontSize="36">🛡️</text>
              <text x="75" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">FIREWALL</text>
              <text x="75" y="98" textAnchor="middle" fill="#FCD34D" fontSize="10">The Chowkidaar</text>
              <rect x="15" y="120" width="120" height="34" rx="8" fill="#D97706" />
              <text x="75" y="141" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">ID Check Mandatory 👮</text>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              🚪 Ports = Darwaze | 🛡️ Firewall = Guard jo gair-kanooni traffic ko rokata hai!
            </text>
          </svg>
        );

      // Chapter 8: HTTP vs HTTPS vs VPN
      case 8:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 8: SURAKSHA KA ANTHAR (HTTP vs HTTPS vs VPN)
            </text>

            {/* 1. HTTP - Postcard */}
            <g transform="translate(40, 55)">
              <rect x="0" y="0" width="150" height="190" rx="14" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
              <text x="75" y="42" textAnchor="middle" fill="#EF4444" fontSize="32">✉️</text>
              <text x="75" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">HTTP</text>
              <text x="75" y="95" textAnchor="middle" fill="#F87171" fontSize="10">Khuli Chithi (Postcard)</text>
              <rect x="12" y="115" width="126" height="55" rx="8" fill="#450A0A" />
              <text x="75" y="138" textAnchor="middle" fill="#FCA5A5" fontSize="9">Raste me koi bhi</text>
              <text x="75" y="154" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="bold">chori se padh sakta hai!</text>
            </g>

            {/* 2. HTTPS - Steel Lockbox */}
            <g transform="translate(225, 55)">
              <rect x="0" y="0" width="150" height="190" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
              <text x="75" y="42" textAnchor="middle" fill="#10B981" fontSize="32">🔒</text>
              <text x="75" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">HTTPS</text>
              <text x="75" y="95" textAnchor="middle" fill="#34D399" fontSize="10">Taala Laga Sandook</text>
              <rect x="12" y="115" width="126" height="55" rx="8" fill="#064E3B" />
              <text x="75" y="138" textAnchor="middle" fill="#A7F3D0" fontSize="9">TLS Encryption Se</text>
              <text x="75" y="154" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">Data 100% Locked!</text>
            </g>

            {/* 3. VPN - Underground Tunnel */}
            <g transform="translate(410, 55)">
              <rect x="0" y="0" width="150" height="190" rx="14" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
              <text x="75" y="42" textAnchor="middle" fill="#8B5CF6" fontSize="32">🚇</text>
              <text x="75" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">VPN</text>
              <text x="75" y="95" textAnchor="middle" fill="#C4B5FD" fontSize="10">Gupt Surang (Tunnel)</text>
              <rect x="12" y="115" width="126" height="55" rx="8" fill="#2E1065" />
              <text x="75" y="138" textAnchor="middle" fill="#DDD6FE" fontSize="9">IP &amp; Location Chhupi</text>
              <text x="75" y="154" textAnchor="middle" fill="#A78BFA" fontSize="9" fontWeight="bold">Koi dekh nahi sakta!</text>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              🔑 Hamesha check karein: URL me "https://" aur 🔒 green lock icon zaroori hai!
            </text>
          </svg>
        );

      // Chapter 9: Raat Ko Hamla (5 Malware Monsters)
      case 9:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 9: CYBER ATTACKS KE 5 SHAYTAAN (KNOW YOUR ENEMIES)
            </text>

            <g transform="translate(25, 55)">
              {[
                { name: 'Phishing', icon: '🎣', color: '#F59E0B', desc: 'Nakli Postman jo lalach dekar OTP maange' },
                { name: 'Virus', icon: '🦠', color: '#EF4444', desc: 'File me lagi bimari jo doosro me faile' },
                { name: 'Worm', icon: '🐛', color: '#A855F7', desc: 'Bina help khud taaron me daudta hai' },
                { name: 'Trojan', icon: '🎁', color: '#EC4899', desc: 'Pyara gift jisme chhupa hua spy hacker' },
                { name: 'Ransomware', icon: '🔐', color: '#DC2626', desc: 'Files lock karke paise maangne wala chor' }
              ].map((m, idx) => (
                <g key={idx} transform={`translate(${idx * 110}, 0)`}>
                  <rect x="0" y="0" width="102" height="190" rx="14" fill="#1E293B" stroke={m.color} strokeWidth="2" />
                  <text x="51" y="42" textAnchor="middle" fontSize="30">{m.icon}</text>
                  <text x="51" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">{m.name}</text>
                  <rect x="8" y="90" width="86" height="85" rx="8" fill="#0F172A" />
                  <text x="51" y="112" textAnchor="middle" fill={m.color} fontSize="9" fontWeight="bold">DANGER!</text>
                  <text x="51" y="132" textAnchor="middle" fill="#CBD5E1" fontSize="8">{m.desc.substring(0, 18)}</text>
                  <text x="51" y="148" textAnchor="middle" fill="#CBD5E1" fontSize="8">{m.desc.substring(18, 38)}</text>
                </g>
              ))}
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#FCA5A5" fontSize="11" fontWeight="600">
              ⚠️ Golden Rule: Anjaan links, free prize SMS aur suspicious attachments pe KABHI click mat karo!
            </text>
          </svg>
        );

      // Chapter 10: Police Ki Training (IDS, IPS, WAF, Honeypot, Sandbox)
      case 10:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 10: CYBER POLICE ACADEMY (DEFENSE TOOLS)
            </text>

            <g transform="translate(25, 55)">
              {[
                { name: 'IDS', icon: '📡', title: 'Radar Eye', desc: 'Dekhta hai kaun ghusa', color: '#38BDF8' },
                { name: 'IPS', icon: '🛑', title: 'Interceptor', desc: 'Turant raste me rokta hai', color: '#EF4444' },
                { name: 'WAF', icon: '🥋', title: 'Website Bodyguard', desc: 'Fake requests ko filter kare', color: '#10B981' },
                { name: 'Honeypot', icon: '🍯', title: 'Sweet Fake Trap', desc: 'Hacker ko phansane ka jaal', color: '#F59E0B' },
                { name: 'Sandbox', icon: '🧪', title: 'Safe Glass Dome', desc: 'Khatarnak virus test room', color: '#A855F7' }
              ].map((tool, idx) => (
                <g key={idx} transform={`translate(${idx * 110}, 0)`}>
                  <rect x="0" y="0" width="102" height="190" rx="14" fill="#1E293B" stroke={tool.color} strokeWidth="2" />
                  <text x="51" y="42" textAnchor="middle" fontSize="30">{tool.icon}</text>
                  <text x="51" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">{tool.name}</text>
                  <text x="51" y="90" textAnchor="middle" fill={tool.color} fontSize="9">{tool.title}</text>
                  <rect x="8" y="105" width="86" height="70" rx="8" fill="#0F172A" />
                  <text x="51" y="132" textAnchor="middle" fill="#CBD5E1" fontSize="8">{tool.desc.substring(0, 18)}</text>
                  <text x="51" y="148" textAnchor="middle" fill="#CBD5E1" fontSize="8">{tool.desc.substring(18, 38)}</text>
                </g>
              ))}
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              🛡️ Security = Sirf taala nahi, balki Dekhna (IDS) + Rokna (IPS) + Phansana (Honeypot)!
            </text>
          </svg>
        );

      // Chapter 11: Taale Aur Chabiyan (Cryptography & 2FA)
      case 11:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 11: CRYPTOGRAPHY (ENCRYPTION &amp; 2FA)
            </text>

            <g transform="translate(30, 55)">
              {/* Symmetric */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🗝️</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Symmetric</text>
                <text x="62" y="90" textAnchor="middle" fill="#38BDF8" fontSize="9">1 Same Key</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#93C5FD" fontSize="8">Dono side ek hi chabi</text>
                <text x="62" y="145" textAnchor="middle" fill="#93C5FD" fontSize="8">(Lock bhi, Unlock bhi)</text>
              </g>

              {/* Asymmetric */}
              <g transform="translate(138, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🔑🗝️</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Asymmetric</text>
                <text x="62" y="90" textAnchor="middle" fill="#10B981" fontSize="9">Public + Private</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#A7F3D0" fontSize="8">Public key taale lagati,</text>
                <text x="62" y="145" textAnchor="middle" fill="#A7F3D0" fontSize="8">Private key kholti hai</text>
              </g>

              {/* Hash */}
              <g transform="translate(276, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🧬</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Hash Fingerprint</text>
                <text x="62" y="90" textAnchor="middle" fill="#F59E0B" fontSize="9">One-Way SHA256</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#FDE68A" fontSize="8">Data badla toh</text>
                <text x="62" y="145" textAnchor="middle" fill="#FDE68A" fontSize="8">fingerprint turant badla</text>
              </g>

              {/* 2FA */}
              <g transform="translate(414, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#A855F7" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🔐📱</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">2-Factor (2FA)</text>
                <text x="62" y="90" textAnchor="middle" fill="#A855F7" fontSize="9">Do Mazboot Taale</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#E9D5FF" fontSize="8">Password + Phone OTP</text>
                <text x="62" y="145" textAnchor="middle" fill="#E9D5FF" fontSize="8">Chor kabhi na khole!</text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 Hamesha har account pe 2FA (Two Factor Authentication) on rakhein!
            </text>
          </svg>
        );

      // Chapter 12: Coding School (Variables, Loops, Functions, If/Else)
      case 12:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 12: CODING KE 4 BASIC PILLARS
            </text>

            <g transform="translate(30, 55)">
              {/* Variable */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">📦</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Variable</text>
                <text x="62" y="90" textAnchor="middle" fill="#38BDF8" fontSize="9">Naam Wala Dabba</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#93C5FD" fontSize="8" fontFamily="monospace">age = 15;</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Value store karne ke liye</text>
              </g>

              {/* Loop */}
              <g transform="translate(138, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🔄</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Loop</text>
                <text x="62" y="90" textAnchor="middle" fill="#F59E0B" fontSize="9">Baar-Baar Kaam</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#FDE68A" fontSize="8" fontFamily="monospace">for (1 to 100)</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Repeat automatically</text>
              </g>

              {/* Function */}
              <g transform="translate(276, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🧁</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Function</text>
                <text x="62" y="90" textAnchor="middle" fill="#10B981" fontSize="9">Reusable Recipe</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#A7F3D0" fontSize="8" fontFamily="monospace">makeChai()</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Ek baar banao, roz chalao</text>
              </g>

              {/* If / Else */}
              <g transform="translate(414, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#EC4899" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🔀</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">If / Else</text>
                <text x="62" y="90" textAnchor="middle" fill="#EC4899" fontSize="9">Choraaha (Decision)</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#F472B6" fontSize="8" fontFamily="monospace">if (rain) umbrella;</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Shart dekh kar faisla</text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 Bas in chaar cheezon se poori duniya ke apps, games aur websites bante hain!
            </text>
          </svg>
        );

      // Chapter 13: Badi Company Ka Architecture (Frontend, Backend, DB, Docker)
      case 13:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 13: BIG TECH ARCHITECTURE (RESTAURANT MODEL)
            </text>

            <g transform="translate(30, 55)">
              {/* Frontend */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🛍️</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Frontend</text>
                <text x="62" y="90" textAnchor="middle" fill="#38BDF8" fontSize="9">Dukaan Ka Showroom</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#93C5FD" fontSize="8">HTML / CSS / React</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Jo customer dekhta hai</text>
              </g>

              {/* Backend */}
              <g transform="translate(138, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🍳</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Backend</text>
                <text x="62" y="90" textAnchor="middle" fill="#F59E0B" fontSize="9">Bawarchikhana (Kitchen)</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#FDE68A" fontSize="8">Node.js / Python</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Logic &amp; Processing</text>
              </g>

              {/* Database */}
              <g transform="translate(276, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🗄️</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Database</text>
                <text x="62" y="90" textAnchor="middle" fill="#10B981" fontSize="9">Pantry / Godown</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#A7F3D0" fontSize="8">PostgreSQL / Mongo</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Saara samaan surakshit</text>
              </g>

              {/* Docker */}
              <g transform="translate(414, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🐳</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Docker</text>
                <text x="62" y="90" textAnchor="middle" fill="#38BDF8" fontSize="9">Cargo Container</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#BAE6FD" fontSize="8">Pack once, run</text>
                <text x="62" y="148" textAnchor="middle" fill="#BAE6FD" fontSize="8">everywhere safely!</text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 Badi company = Ek bada restaurant jisme har department ka apna role fix hai!
            </text>
          </svg>
        );

      // Chapter 14: Photo Kahan Jaati Hai? (SQL vs NoSQL)
      case 14:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 14: DATABASE GODOWN (SQL VS NOSQL &amp; BACKUP)
            </text>

            <g transform="translate(45, 55)">
              {/* SQL (Strict Table) */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="235" height="190" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="117" y="35" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold">
                  📊 SQL Database (Relational)
                </text>
                <rect x="15" y="55" width="205" height="115" rx="8" fill="#0F172A" />
                <text x="117" y="80" textAnchor="middle" fill="#BAE6FD" fontSize="11" fontWeight="bold">
                  Excel Jaisi Strict Almari
                </text>
                <text x="117" y="105" textAnchor="middle" fill="#94A3B8" fontSize="10">Rows aur Columns fix hain</text>
                <text x="117" y="125" textAnchor="middle" fill="#94A3B8" fontSize="10">Primary Key = Unique Roll No</text>
                <text x="117" y="150" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">
                  Examples: MySQL, PostgreSQL
                </text>
              </g>

              {/* NoSQL (Flexible Documents) */}
              <g transform="translate(275, 0)">
                <rect x="0" y="0" width="235" height="190" rx="16" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="117" y="35" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="bold">
                  📁 NoSQL Database (Flexible)
                </text>
                <rect x="15" y="55" width="205" height="115" rx="8" fill="#0F172A" />
                <text x="117" y="80" textAnchor="middle" fill="#A7F3D0" fontSize="11" fontWeight="bold">
                  Khule Folder Jaisa Dabba
                </text>
                <text x="117" y="105" textAnchor="middle" fill="#94A3B8" fontSize="10">Jo document chaho daal do</text>
                <text x="117" y="125" textAnchor="middle" fill="#94A3B8" fontSize="10">Photos, Posts, Messages store</text>
                <text x="117" y="150" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold">
                  Examples: MongoDB, Firestore
                </text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💾 Backup Rule: Hamesha doosre kamre (cloud) me doosri copy zaroori hai!
            </text>
          </svg>
        );

      // Chapter 15: Bijli Kya Hai? (Voltage & Transistors)
      case 15:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 15: PHYSICS KA JAADU (BIJLI = PAANI | TRANSISTOR = NALKA)
            </text>

            {/* Left: Water Tank (Voltage) */}
            <g transform="translate(50, 55)">
              <rect x="0" y="0" width="140" height="185" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <text x="70" y="42" textAnchor="middle" fontSize="32">🚰</text>
              <text x="70" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">Voltage</text>
              <text x="70" y="95" textAnchor="middle" fill="#38BDF8" fontSize="10">Water Pressure</text>
              <rect x="15" y="115" width="110" height="50" rx="6" fill="#0C4A6E" />
              <text x="70" y="138" textAnchor="middle" fill="#BAE6FD" fontSize="9">Jitni unchi tanki,</text>
              <text x="70" y="152" textAnchor="middle" fill="#BAE6FD" fontSize="9">utna tej pressure!</text>
            </g>

            {/* Middle: Pipe Flow (Current) */}
            <g transform="translate(230, 55)">
              <rect x="0" y="0" width="140" height="185" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
              <text x="70" y="42" textAnchor="middle" fontSize="32">🌊</text>
              <text x="70" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">Current</text>
              <text x="70" y="95" textAnchor="middle" fill="#10B981" fontSize="10">Flow of Water</text>
              <rect x="15" y="115" width="110" height="50" rx="6" fill="#064E3B" />
              <text x="70" y="138" textAnchor="middle" fill="#A7F3D0" fontSize="9">Taar me kitne</text>
              <text x="70" y="152" textAnchor="middle" fill="#A7F3D0" fontSize="9">electrons daud rahe hain!</text>
            </g>

            {/* Right: Transistor (The Micro Switch) */}
            <g transform="translate(410, 55)">
              <rect x="0" y="0" width="140" height="185" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
              <text x="70" y="42" textAnchor="middle" fontSize="32">⚡</text>
              <text x="70" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">Transistor</text>
              <text x="70" y="95" textAnchor="middle" fill="#F59E0B" fontSize="10">Nano Switch (On/Off)</text>
              <rect x="15" y="115" width="110" height="50" rx="6" fill="#78350F" />
              <text x="70" y="138" textAnchor="middle" fill="#FDE68A" fontSize="9">1 Chip = 1,000 Cr</text>
              <text x="70" y="152" textAnchor="middle" fill="#FDE68A" fontSize="9">Switches on Silicon!</text>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#FEF08A" fontSize="11" fontWeight="600">
              💡 1,000 Crore nano switches milkar on-off karke har video aur game chalate hain!
            </text>
          </svg>
        );

      // Chapter 16: Machine Seekhne Lagi (AI & Neural Networks)
      case 16:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 16: AI KA DIMAAG (HOW MACHINES LEARN)
            </text>

            <g transform="translate(40, 55)">
              {/* 1. Traditional vs ML */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="160" height="190" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="80" y="42" textAnchor="middle" fontSize="30">👶</text>
                <text x="80" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Baby Trial &amp; Error</text>
                <text x="80" y="95" textAnchor="middle" fill="#38BDF8" fontSize="10">Learning From Mistakes</text>
                <rect x="12" y="115" width="136" height="55" rx="8" fill="#0F172A" />
                <text x="80" y="138" textAnchor="middle" fill="#93C5FD" fontSize="9">Bachha girta hai, seekhta hai</text>
                <text x="80" y="152" textAnchor="middle" fill="#93C5FD" fontSize="9">Data se weights adjust hote</text>
              </g>

              {/* 2. Neural Network */}
              <g transform="translate(180, 0)">
                <rect x="0" y="0" width="160" height="190" rx="14" fill="#1E293B" stroke="#A855F7" strokeWidth="2" />
                <text x="80" y="42" textAnchor="middle" fontSize="30">🧠</text>
                <text x="80" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Neural Network</text>
                <text x="80" y="95" textAnchor="middle" fill="#A855F7" fontSize="10">Dimaag Ki Naqal</text>
                <rect x="12" y="115" width="136" height="55" rx="8" fill="#0F172A" />
                <text x="80" y="138" textAnchor="middle" fill="#D8B4FE" fontSize="9">Billions of interconnected</text>
                <text x="80" y="152" textAnchor="middle" fill="#D8B4FE" fontSize="9">mathematical neurons</text>
              </g>

              {/* 3. LLM Word Prediction */}
              <g transform="translate(360, 0)">
                <rect x="0" y="0" width="160" height="190" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="80" y="42" textAnchor="middle" fontSize="30">💬</text>
                <text x="80" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">LLM (ChatGPT/AI)</text>
                <text x="80" y="95" textAnchor="middle" fill="#10B981" fontSize="10">Next Word Predictor</text>
                <rect x="12" y="115" width="136" height="55" rx="8" fill="#0F172A" />
                <text x="80" y="138" textAnchor="middle" fill="#A7F3D0" fontSize="9">"Main kal school..."</text>
                <text x="80" y="152" textAnchor="middle" fill="#34D399" fontSize="9" fontWeight="bold">➡️ "jaunga!" (Predicted)</text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              💡 AI jadoo nahi hai, wo lakho kitabo ko padhkar agla shabd guess karne wali machine hai!
            </text>
          </svg>
        );

      // Chapter 17: Saal 2050 (Future World)
      case 17:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="bold" letterSpacing="1">
              CHAPTER 17: SAAL 2050 (FUTURE KI 4 SHAKTIYAN)
            </text>

            <g transform="translate(30, 55)">
              {/* IoT */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🌐</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">IoT</text>
                <text x="62" y="90" textAnchor="middle" fill="#38BDF8" fontSize="9">Internet of Things</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#93C5FD" fontSize="8">Smart Bulb, AC, Car</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Sab internet se baatein kare</text>
              </g>

              {/* AR / VR */}
              <g transform="translate(138, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#A855F7" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🥽</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">AR / VR</text>
                <text x="62" y="90" textAnchor="middle" fill="#A855F7" fontSize="9">Digital Reality</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#D8B4FE" fontSize="8">Hologram Classes</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Virtual World simulation</text>
              </g>

              {/* Blockchain */}
              <g transform="translate(276, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🔗</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Blockchain</text>
                <text x="62" y="90" textAnchor="middle" fill="#F59E0B" fontSize="9">Immutable Ledger</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#FDE68A" fontSize="8">Aisa digital register</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Jisko koi badal na sake</text>
              </g>

              {/* Robotics */}
              <g transform="translate(414, 0)">
                <rect x="0" y="0" width="125" height="190" rx="14" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                <text x="62" y="42" textAnchor="middle" fontSize="30">🦾</text>
                <text x="62" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">Robotics</text>
                <text x="62" y="90" textAnchor="middle" fill="#10B981" fontSize="9">Machines with Hands</text>
                <rect x="8" y="105" width="109" height="70" rx="8" fill="#0F172A" />
                <text x="62" y="130" textAnchor="middle" fill="#A7F3D0" fontSize="8">Surgeries &amp; Mars rovers</text>
                <text x="62" y="148" textAnchor="middle" fill="#94A3B8" fontSize="8">Insaan ke saathi</text>
              </g>
            </g>

            <rect x="40" y="260" width="520" height="34" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
            <text x="300" y="282" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="600">
              🚀 Future = Sab kuch connected hoga, aur insaan ki creativity sabse badi power hogi!
            </text>
          </svg>
        );

      // Chapter 18: Grand Finale (14 Doors of TechNagar)
      case 18:
        return (
          <svg viewBox="0 0 600 320" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="320" rx="20" fill="#0B132B" />
            <text x="300" y="28" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="bold">
              🏆 GRAND FINALE: 14 DOORS OF TECHNAGAR UNLOCKED!
            </text>

            {/* 14 Glowing Power Nodes */}
            <g transform="translate(50, 48)">
              {[
                'Algorithm', 'Hardware', 'Networking', 'Security', 'Coding', 'Web Tech', 'Database',
                'Physics', 'AI / ML', 'Future IoT', 'Operating Sys', 'Mathematics', 'Tech History', 'Ethics'
              ].map((door, idx) => {
                const row = Math.floor(idx / 7);
                const col = idx % 7;
                return (
                  <g key={idx} transform={`translate(${col * 72}, ${row * 85})`}>
                    <rect x="0" y="0" width="64" height="70" rx="10" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
                    <circle cx="32" cy="24" r="12" fill="#065F46" stroke="#34D399" strokeWidth="1" />
                    <text x="32" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="12">⚡</text>
                    <text x="32" y="52" textAnchor="middle" fill="#E2E8F0" fontSize="8" fontWeight="bold">{door}</text>
                    <text x="32" y="64" textAnchor="middle" fill="#34D399" fontSize="7">DOOR {idx + 1}</text>
                  </g>
                );
              })}
            </g>

            {/* Victory Badge */}
            <rect x="40" y="235" width="520" height="65" rx="14" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
            <text x="300" y="260" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold">
              🎉 REAL ENGINEER WAHI JO KABHI SEEKHNA NA CHHODE!
            </text>
            <text x="300" y="280" textAnchor="middle" fill="#A7F3D0" fontSize="11">
              Aarav 👦 &amp; Byte 🤖: "Technology Badalti Rahegi, Par Curiosity Hamesha Zinda Rehti Hai!"
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Container with Glass and Cyber borders */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 shadow-2xl bg-slate-950/95 aspect-[16/9] w-full transition-all">
        {renderIllustration()}

        {/* Action Overlay */}
        {allowZoom && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 backdrop-blur-md transition-all cursor-pointer shadow-lg text-xs flex items-center gap-1"
              title="Expand picture full screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px] font-bold">Bada Dekhein</span>
            </button>
          </div>
        )}
      </div>

      {/* Expanded Modal View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border border-cyan-500/40 p-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                  🖼️ Educational Diagram · Chapter {chapterId}
                </span>
                <span className="text-xs text-slate-400">Crisp Vector · 100% Offline</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900">
              {renderIllustration()}
            </div>

            <p className="text-center text-xs text-slate-400 mt-3 font-mono">
              💡 Har visual metaphor beginner-friendly concepts ko crystal clear explain karta hai.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
