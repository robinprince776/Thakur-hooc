import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const screenshotsDir = path.resolve('public/screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));

// 1. Generate icon-512.png
await sharp(iconSvg)
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'icon-512.png'));
console.log('✓ Created icon-512.png');

// 2. Generate icon-192.png
await sharp(iconSvg)
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, 'icon-192.png'));
console.log('✓ Created icon-192.png');

// 3. Generate apple-touch-icon.png (180x180)
await sharp(iconSvg)
  .resize(180, 180)
  .png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));
console.log('✓ Created apple-touch-icon.png');

// 4. Generate maskable icon (padded by 15% inside a solid gradient background for Android squircle crop safe zone)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="50%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Code bracket & motif -->
    <path d="M190 160 L120 256 L190 352" fill="none" stroke="#ffffff" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M322 160 L392 256 L322 352" fill="none" stroke="#ffffff" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="256" y="278" font-family="sans-serif" font-weight="900" font-size="120" fill="#ffffff" text-anchor="middle" dominant-baseline="central">C</text>
    <circle cx="216" cy="380" r="12" fill="#ffffff"/>
    <circle cx="256" cy="380" r="12" fill="#ffffff" opacity="0.7"/>
    <circle cx="296" cy="380" r="12" fill="#ffffff"/>
  </g>
</svg>`;

await sharp(Buffer.from(maskableSvg))
  .resize(512, 512)
  .png()
  .toFile(path.join(publicDir, 'icon-maskable-512.png'));
console.log('✓ Created icon-maskable-512.png');

await sharp(Buffer.from(maskableSvg))
  .resize(192, 192)
  .png()
  .toFile(path.join(publicDir, 'icon-maskable-192.png'));
console.log('✓ Created icon-maskable-192.png');

// 5. Generate Desktop Screenshot (1280x720) for PWABuilder
const desktopSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bgGrad)"/>
  <!-- Top bar -->
  <rect x="0" y="0" width="1280" height="64" fill="#0f172a" fill-opacity="0.9"/>
  <circle cx="48" cy="32" r="18" fill="#6366f1"/>
  <text x="78" y="38" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">BCA Verse</text>
  <text x="180" y="37" font-family="sans-serif" font-size="13" fill="#a5b4fc">· Logic &amp; C Solver</text>
  <!-- Hero Section -->
  <text x="80" y="160" font-family="sans-serif" font-weight="800" font-size="38" fill="#ffffff">Crack Logic Systems &amp; C Programming</text>
  <text x="80" y="205" font-family="sans-serif" font-weight="600" font-size="24" fill="#818cf8">Step-by-Step in Hinglish · Made by Prince Thakur</text>
  <!-- Card 1 -->
  <rect x="80" y="260" width="350" height="380" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
  <text x="110" y="310" font-family="sans-serif" font-weight="700" font-size="20" fill="#38bdf8">⚡ Number System Solver</text>
  <text x="110" y="350" font-family="sans-serif" font-size="14" fill="#94a3b8">Decimal, Binary, Octal, Hexadecimal</text>
  <text x="110" y="380" font-family="sans-serif" font-size="14" fill="#94a3b8">1's &amp; 2's Complement with step tables</text>
  <rect x="110" y="420" width="290" height="90" rx="12" fill="#0284c7" fill-opacity="0.2" stroke="#0284c7"/>
  <text x="130" y="460" font-family="monospace" font-size="16" fill="#38bdf8">25.625 (10) = 11001.101 (2)</text>
  <text x="130" y="490" font-family="sans-serif" font-size="12" fill="#7dd3fc">Full Division &amp; Multiply steps</text>
  <!-- Card 2 -->
  <rect x="460" y="260" width="350" height="380" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
  <text x="490" y="310" font-family="sans-serif" font-weight="700" font-size="20" fill="#a855f7">💻 45+ C Programs</text>
  <text x="490" y="350" font-family="sans-serif" font-size="14" fill="#94a3b8">Arrays, Pointers, Recursion, Loops</text>
  <text x="490" y="380" font-family="sans-serif" font-size="14" fill="#94a3b8">Line-by-line Hinglish explanation</text>
  <rect x="490" y="420" width="290" height="90" rx="12" fill="#9333ea" fill-opacity="0.2" stroke="#9333ea"/>
  <text x="510" y="460" font-family="monospace" font-size="15" fill="#d8b4fe">#include &lt;stdio.h&gt;</text>
  <text x="510" y="490" font-family="sans-serif" font-size="12" fill="#c084fc">Time: O(n) | Space: O(1)</text>
  <!-- Card 3 -->
  <rect x="840" y="260" width="360" height="380" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="2"/>
  <text x="870" y="310" font-family="sans-serif" font-weight="700" font-size="20" fill="#f59e0b">🔢 Calculator Vault</text>
  <text x="870" y="350" font-family="sans-serif" font-size="14" fill="#94a3b8">Working stealth calculator</text>
  <text x="870" y="380" font-family="sans-serif" font-size="14" fill="#94a3b8">Type PIN 1307 to unlock Secret Chat</text>
  <rect x="870" y="420" width="300" height="90" rx="12" fill="#d97706" fill-opacity="0.2" stroke="#d97706"/>
  <text x="890" y="460" font-family="monospace" font-size="16" fill="#fbbf24">PIN: 1307 = Unlocked</text>
  <text x="890" y="490" font-family="sans-serif" font-size="12" fill="#fde68a">Real-time Presence &amp; Encrypted</text>
</svg>`;

await sharp(Buffer.from(desktopSvg))
  .resize(1280, 720)
  .png()
  .toFile(path.join(screenshotsDir, 'desktop.png'));
console.log('✓ Created screenshots/desktop.png');

// 6. Generate Mobile Screenshot (720x1280) for PWABuilder
const mobileSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
  <defs>
    <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="cardGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bgGradM)"/>
  <!-- Top bar -->
  <rect x="0" y="0" width="720" height="90" fill="#0f172a" fill-opacity="0.95"/>
  <circle cx="60" cy="45" r="24" fill="#6366f1"/>
  <text x="100" y="52" font-family="sans-serif" font-weight="700" font-size="26" fill="#ffffff">BCA Verse</text>
  <!-- Content -->
  <text x="40" y="160" font-family="sans-serif" font-weight="800" font-size="34" fill="#ffffff">Crack Logic Systems</text>
  <text x="40" y="205" font-family="sans-serif" font-weight="800" font-size="34" fill="#818cf8">&amp; C Programming</text>
  <text x="40" y="250" font-family="sans-serif" font-weight="500" font-size="18" fill="#94a3b8">Step-by-Step in Hinglish for BCA</text>
  <!-- Card 1 -->
  <rect x="40" y="300" width="640" height="240" rx="24" fill="url(#cardGradM)" stroke="#334155" stroke-width="2"/>
  <text x="70" y="350" font-family="sans-serif" font-weight="700" font-size="22" fill="#38bdf8">⚡ Number System Solver</text>
  <text x="70" y="390" font-family="sans-serif" font-size="16" fill="#94a3b8">Decimal, Binary, Octal, Hex, Point conversion</text>
  <rect x="70" y="420" width="580" height="90" rx="14" fill="#0284c7" fill-opacity="0.2"/>
  <text x="100" y="475" font-family="monospace" font-size="20" fill="#38bdf8">25.625 (10) = 11001.101 (2)</text>
  <!-- Card 2 -->
  <rect x="40" y="580" width="640" height="240" rx="24" fill="url(#cardGradM)" stroke="#334155" stroke-width="2"/>
  <text x="70" y="630" font-family="sans-serif" font-weight="700" font-size="22" fill="#a855f7">💻 45+ C Programs Library</text>
  <text x="70" y="670" font-family="sans-serif" font-size="16" fill="#94a3b8">Tested, ready-to-compile source code</text>
  <rect x="70" y="700" width="580" height="90" rx="14" fill="#9333ea" fill-opacity="0.2"/>
  <text x="100" y="755" font-family="monospace" font-size="20" fill="#d8b4fe">int main() { printf("Hello BCA"); }</text>
  <!-- Card 3 -->
  <rect x="40" y="860" width="640" height="240" rx="24" fill="url(#cardGradM)" stroke="#334155" stroke-width="2"/>
  <text x="70" y="910" font-family="sans-serif" font-weight="700" font-size="22" fill="#f59e0b">🔢 Calculator Vault</text>
  <text x="70" y="950" font-family="sans-serif" font-size="16" fill="#94a3b8">Stealth mode with Secret PIN 1307</text>
  <rect x="70" y="980" width="580" height="90" rx="14" fill="#d97706" fill-opacity="0.2"/>
  <text x="100" y="1035" font-family="monospace" font-size="20" fill="#fbbf24">PIN: 1307 = Unlock Secret Chat</text>
</svg>`;

await sharp(Buffer.from(mobileSvg))
  .resize(720, 1280)
  .png()
  .toFile(path.join(screenshotsDir, 'mobile.png'));
console.log('✓ Created screenshots/mobile.png');

console.log('All PWA assets successfully generated!');
