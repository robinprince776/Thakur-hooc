export type ArsenalOs = 'Windows' | 'Mac' | 'Linux' | 'Android' | 'Web';

export type ArsenalCategoryId =
  | 'file-media'
  | 'system-productivity'
  | 'networking-sharing'
  | 'micro-dev'
  | 'privacy-recovery';

export interface ArsenalTool {
  id: string;
  name: string;
  tagline: string;
  category: ArsenalCategoryId;
  categoryLabel: string;
  description: string;
  os: ArsenalOs[];
  license: string;
  websiteUrl: string;
  githubUrl: string;
  githubLabel?: string;
  howToUse: string;
  quickCommand?: string;
  keywords: string[];
}

export const ARSENAL_CATEGORIES: { id: ArsenalCategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'file-media', label: 'File & Media Converters' },
  { id: 'system-productivity', label: 'System & Productivity' },
  { id: 'networking-sharing', label: 'Networking & Sharing' },
  { id: 'micro-dev', label: 'Micro-Dev & Web Utils' },
  { id: 'privacy-recovery', label: 'Privacy & Recovery' },
];

export const ARSENAL_OS_FILTERS: ('All' | ArsenalOs)[] = [
  'All',
  'Windows',
  'Mac',
  'Linux',
  'Android',
  'Web',
];

export const ARSENAL_TOOLS: ArsenalTool[] = [
  // ==========================================================
  // CATEGORY 1: FILE & MEDIA CONVERTERS (Everyday Magic)
  // ==========================================================
  {
    id: 'handbrake',
    name: 'HandBrake',
    tagline: 'Video Compressor',
    category: 'file-media',
    categoryLabel: 'File & Media Converters',
    description:
      'Badi video files (4K/1080p MP4, MKV) ko bina visible quality kharaab kiye 60–80% chhota karta hai.',
    os: ['Windows', 'Mac', 'Linux'],
    license: 'GPL-2.0',
    websiteUrl: 'https://handbrake.fr/',
    githubUrl: 'https://github.com/HandBrake/HandBrake',
    howToUse:
      'App open karke badi video drag-and-drop karo. Preset me "Fast 1080p30" ya Video tab me RF 22-24 select karo, phir Start Encode dabao—file size turant kam ho jayega.',
    keywords: ['video', 'compress', 'mp4', 'mkv', 'transcode', 'h264', 'h265', 'shrink', 'media'],
  },
  {
    id: 'stirling-pdf',
    name: 'Stirling PDF',
    tagline: 'Web-Based PDF Tool',
    category: 'file-media',
    categoryLabel: 'File & Media Converters',
    description:
      'PDF merge, split, compress, OCR, password remove, aur edit karne ka self-hosted / web Swiss-army knife.',
    os: ['Web', 'Windows', 'Mac', 'Linux'],
    license: 'GPL-3.0',
    websiteUrl: 'https://www.stirlingpdf.com/',
    githubUrl: 'https://github.com/Stirling-Tools/Stirling-PDF',
    howToUse:
      'Desktop app ya Docker container run karke browser UI kholo. Merge, Split, Compress ya Unlock PDF tool select karo aur file drop karo—data 100% aapke system par local process hota hai.',
    quickCommand: 'docker run -d -p 8080:8080 frooodle/s-pdf:latest',
    keywords: ['pdf', 'merge', 'split', 'password', 'remove', 'unlock', 'compress', 'ocr', 'edit', 'document'],
  },
  {
    id: 'squoosh',
    name: 'Squoosh',
    tagline: 'Image Compressor by Google',
    category: 'file-media',
    categoryLabel: 'File & Media Converters',
    description:
      'Photos aur UI assets ko WebP / AVIF / MozJPEG me compress kare live split-screen quality comparison ke saath.',
    os: ['Web'],
    license: 'Apache-2.0',
    websiteUrl: 'https://squoosh.app/',
    githubUrl: 'https://github.com/GoogleChromeLabs/squoosh',
    howToUse:
      'Browser me squoosh.app kholo aur image drop karo. Right side me WebP ya AVIF codec select karke Quality slider adjust karo, aur split slider se clarity check karke download dabao.',
    keywords: ['image', 'photo', 'compress', 'webp', 'avif', 'png', 'jpg', 'google', 'resize'],
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    tagline: 'The God of Media',
    category: 'file-media',
    categoryLabel: 'File & Media Converters',
    description:
      'Command line se kisi bhi video, audio, GIF, ya presentation frames/PDF slide deck ko cut, convert aur extract karne ka ultra-fast engine.',
    os: ['Windows', 'Mac', 'Linux'],
    license: 'LGPL / GPL',
    websiteUrl: 'https://ffmpeg.org/',
    githubUrl: 'https://github.com/FFmpeg/FFmpeg',
    howToUse:
      'Install ke baad terminal me `ffmpeg -i input.mp4 -vcodec libx265 -crf 28 out.mp4` chalao. Audio extract (`-vn -acodec mp3`) ya PDF/Image slides se lecture video banane ke liye flags swap karo.',
    quickCommand: 'ffmpeg -i input.mp4 -vcodec libx265 -crf 28 compressed.mp4',
    keywords: ['ffmpeg', 'video', 'audio', 'mp3', 'mp4', 'cli', 'convert', 'trim', 'cut', 'pdf', 'slides', 'extract'],
  },
  {
    id: 'localsend',
    name: 'LocalSend',
    tagline: 'Airdrop Alternative',
    category: 'file-media',
    categoryLabel: 'File & Media Converters',
    description:
      'Bina internet ya cloud upload ke phone aur PC ke beech local Wi-Fi par full-speed encrypted files transfer karta hai.',
    os: ['Windows', 'Mac', 'Linux', 'Android'],
    license: 'MIT',
    websiteUrl: 'https://localsend.org/',
    githubUrl: 'https://github.com/localsend/localsend',
    howToUse:
      'Dono devices par app install karo, same Wi-Fi se connect karo, aur file select karke send dabao.',
    keywords: ['airdrop', 'transfer', 'share', 'wifi', 'offline', 'android', 'pc', 'phone', 'cross-platform'],
  },
  {
    id: '7zip',
    name: '7-Zip',
    tagline: 'File Extractor & Archiver',
    category: 'file-media',
    categoryLabel: 'File & Media Converters',
    description:
      'ZIP, RAR, TAR aur 7z archives ko high compression ratio aur AES-256 encryption ke saath extract/pack karta hai.',
    os: ['Windows', 'Linux'],
    license: 'LGPL-2.1',
    websiteUrl: 'https://www.7-zip.org/',
    githubUrl: 'https://github.com/ip7z/7zip',
    howToUse:
      'Install karne ke baad kisi bhi `.zip`, `.rar`, ya `.7z` file par right-click karke "7-Zip → Extract Here" chuno. Archive lock karne ke liye "Add to archive" me AES-256 password set karo.',
    keywords: ['zip', 'rar', '7z', 'extract', 'unzip', 'compress', 'archive', 'password'],
  },

  // ==========================================================
  // CATEGORY 2: SYSTEM & PRODUCTIVITY (PC/Laptop Fast)
  // ==========================================================
  {
    id: 'everything',
    name: 'Everything',
    tagline: 'Instant Windows File Search',
    category: 'system-productivity',
    categoryLabel: 'System & Productivity',
    description:
      'Windows ki slow default search se 100x fast file finder—millions of NTFS files ko typing ke saath milliseconds me dhoondhta hai.',
    os: ['Windows'],
    license: 'Freeware / MIT SDK',
    websiteUrl: 'https://www.voidtools.com/',
    githubUrl: 'https://github.com/voidtools/Everything_SDK',
    githubLabel: 'GitHub SDK',
    howToUse:
      'Install karke open karo—NTFS index 2 second me ready ho jayega. Ab search bar me filename ya `*.pdf` / `ext:mp4` type karte hi poori PC drive ke results instant dikhenge.',
    keywords: ['search', 'windows', 'fast', 'files', 'ntfs', 'find', 'index', 'productivity'],
  },
  {
    id: 'sharex',
    name: 'ShareX',
    tagline: 'Screen Recorder & Screenshot Pro',
    category: 'system-productivity',
    categoryLabel: 'System & Productivity',
    description:
      'Lightweight free screen recorder, scrolling screenshot capture, OCR text copier aur instant image annotator.',
    os: ['Windows'],
    license: 'GPL-3.0',
    websiteUrl: 'https://getsharex.com/',
    githubUrl: 'https://github.com/ShareX/ShareX',
    howToUse:
      'System tray icon ya `Ctrl+PrintScreen` dabakar area select karo. Built-in editor se arrows/blur lagao aur After Capture Tasks me auto-save ya clipboard copy enable karo.',
    keywords: ['screenshot', 'screen', 'recorder', 'gif', 'ocr', 'annotate', 'capture', 'windows'],
  },
  {
    id: 'rufus',
    name: 'Rufus',
    tagline: 'Bootable USB Drive Creator',
    category: 'system-productivity',
    categoryLabel: 'System & Productivity',
    description:
      'Windows, Ubuntu, ya Kali Linux ISO se tezi se clean aur reliable bootable USB pendrive banata hai.',
    os: ['Windows'],
    license: 'GPL-3.0',
    websiteUrl: 'https://rufus.ie/',
    githubUrl: 'https://github.com/pbatard/rufus',
    howToUse:
      'Pendrive PC me lagao aur Rufus kholo. Device chuno, "SELECT" dabakar OS `.iso` file pick karo, Partition scheme (GPT/UEFI) verify karke START dabao.',
    keywords: ['usb', 'bootable', 'iso', 'windows', 'linux', 'install', 'pendrive', 'flash'],
  },
  {
    id: 'bleachbit',
    name: 'BleachBit',
    tagline: 'Open-Source System Cleaner',
    category: 'system-productivity',
    categoryLabel: 'System & Productivity',
    description:
      'CCleaner ka bloat-free open-source alternative jo browser cache, temp junk, logs saaf karke disk space aur privacy bachata hai.',
    os: ['Windows', 'Linux'],
    license: 'GPL-3.0',
    websiteUrl: 'https://www.bleachbit.org/',
    githubUrl: 'https://github.com/bleachbit/bleachbit',
    howToUse:
      'Left sidebar me Browser Cache, System Temp, aur Trash checkboxes tick karo. Pehle "Preview" dabakar exact MB/GB dekh lo, phir "Clean" click karke safely junk delete karo.',
    keywords: ['cleaner', 'junk', 'cache', 'temp', 'disk', 'free space', 'ccleaner', 'privacy'],
  },
  {
    id: 'autohotkey',
    name: 'AutoHotkey',
    tagline: 'Keyboard Shortcuts & Macros',
    category: 'system-productivity',
    categoryLabel: 'System & Productivity',
    description:
      'Custom keyboard shortcuts, text expanders, aur repetitive PC workflow automation scripts likhne ka lightweight scripting tool.',
    os: ['Windows'],
    license: 'GPL-2.0',
    websiteUrl: 'https://www.autohotkey.com/',
    githubUrl: 'https://github.com/AutoHotkey/AutoHotkey',
    howToUse:
      'Install ke baad ek `.ahk` script file banao (jaise `::@gm::name@gmail.com` text snippet ya shortcut remap), save karke double-click se run karo—shortcuts har app me kaam karenge.',
    quickCommand: '::@sig::Best regards, Priyanshu',
    keywords: ['macro', 'shortcuts', 'automation', 'hotkey', 'keyboard', 'remap', 'windows', 'script'],
  },
  {
    id: 'ventoy',
    name: 'Ventoy',
    tagline: 'Multi-OS Bootable USB',
    category: 'system-productivity',
    categoryLabel: 'System & Productivity',
    description:
      'Ek hi pendrive ko baar-baar format kiye bina usme multiple OS (Windows, Kali, Ubuntu, Rescue ISOs) copy-paste karke boot karo.',
    os: ['Windows', 'Linux'],
    license: 'GPL-3.0',
    websiteUrl: 'https://www.ventoy.net/',
    githubUrl: 'https://github.com/ventoy/Ventoy',
    howToUse:
      'Ventoy2Disk chalakar USB ko ek baar format karo. Ab normal pendrive ki tarah jitni chaho `.iso` files copy-paste kar do—PC boot karte hi menu me sabhi OS dikh jayenge.',
    keywords: ['ventoy', 'usb', 'multiboot', 'iso', 'windows', 'linux', 'pendrive', 'rescue'],
  },

  // ==========================================================
  // CATEGORY 3: NETWORKING & SHARING (No Cloud Needed)
  // ==========================================================
  {
    id: 'syncthing',
    name: 'Syncthing',
    tagline: 'Private P2P Cloud Sync',
    category: 'networking-sharing',
    categoryLabel: 'Networking & Sharing',
    description:
      'Google Drive/OneDrive ki tarah aapke phone, laptop aur PC ke beech zero-server encrypted real-time folder sync.',
    os: ['Windows', 'Mac', 'Linux', 'Android'],
    license: 'MPL-2.0',
    websiteUrl: 'https://syncthing.net/',
    githubUrl: 'https://github.com/syncthing/syncthing',
    howToUse:
      'Phone aur PC par Syncthing install karo aur Device ID QR code se dono ko pair karo. Kisi folder ko "Share" me tick karo—dono devices ke beech files auto-sync hoti rahengi.',
    keywords: ['sync', 'cloud', 'p2p', 'backup', 'android', 'pc', 'folder', 'private', 'notes'],
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    tagline: 'Ads-Free Open Torrent Client',
    category: 'networking-sharing',
    categoryLabel: 'Networking & Sharing',
    description:
      'Clean, bloatware-free aur ads-free BitTorrent client jisme built-in search, sequential download aur IP bind support hai.',
    os: ['Windows', 'Mac', 'Linux'],
    license: 'GPL-2.0',
    websiteUrl: 'https://www.qbittorrent.org/',
    githubUrl: 'https://github.com/qbittorrent/qBittorrent',
    howToUse:
      'Install karke magnet link paste karo ya `.torrent` file open karo, destination folder choose karke OK dabao. Large Linux ISO downloads ke liye speed limit aur queue set kar sakte ho.',
    keywords: ['torrent', 'download', 'iso', 'p2p', 'ads-free', 'magnet', 'client'],
  },
  {
    id: 'filezilla',
    name: 'FileZilla',
    tagline: 'Fast FTP / SFTP Client',
    category: 'networking-sharing',
    categoryLabel: 'Networking & Sharing',
    description:
      'Servers, VPS ya hosting par FTP, FTPS aur encrypted SFTP protocol se files upload/download karne ka classic dual-pane client.',
    os: ['Windows', 'Mac', 'Linux'],
    license: 'GPL-2.0',
    websiteUrl: 'https://filezilla-project.org/',
    githubUrl: 'https://svn.filezilla-project.org/filezilla/FileZilla3/trunk/',
    githubLabel: 'Official Repo',
    howToUse:
      'Top Quickconnect bar me Host (`sftp://ip-address`), Username, Password aur Port (`22`) daalkar Quickconnect dabao. Left side se right server panel me files drag-drop karo.',
    keywords: ['ftp', 'sftp', 'ssh', 'server', 'upload', 'hosting', 'vps', 'transfer'],
  },
  {
    id: 'tailscale',
    name: 'Tailscale',
    tagline: 'Zero-Config Private Mesh VPN',
    category: 'networking-sharing',
    categoryLabel: 'Networking & Sharing',
    description:
      'WireGuard par bana zero-config mesh VPN jo aapke ghar ke PC, laptop, phone aur cloud VPS ko ek private network me jodta hai.',
    os: ['Windows', 'Mac', 'Linux', 'Android', 'Web'],
    license: 'BSD-3-Clause',
    websiteUrl: 'https://tailscale.com/',
    githubUrl: 'https://github.com/tailscale/tailscale',
    howToUse:
      'Har device par Tailscale install karke same account se login karo. Har device ko ek static `100.x.y.z` private IP mil jayega—bina router port-forwarding ke SSH, RDP ya localhost apps access karo.',
    keywords: ['vpn', 'wireguard', 'mesh', 'remote', 'ssh', 'rdp', 'private', 'network', 'android'],
  },

  // ==========================================================
  // CATEGORY 4: MICRO-DEV & WEB UTILS (For Coders)
  // ==========================================================
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    tagline: 'Hand-Drawn Whiteboard & Diagrams',
    category: 'micro-dev',
    categoryLabel: 'Micro-Dev & Web Utils',
    description:
      'System architecture, flowcharts aur wireframes hand-drawn aesthetic me banana aur live collaborate karne ka fastest whiteboard.',
    os: ['Web', 'Windows', 'Mac', 'Linux'],
    license: 'MIT',
    websiteUrl: 'https://excalidraw.com/',
    githubUrl: 'https://github.com/excalidraw/excalidraw',
    howToUse:
      'excalidraw.com kholkar boxes, arrows aur labels draw karo. File → Save se `.excalidraw` source rakho ya PNG/SVG export karke README, docs aur presentations me embed karo.',
    keywords: ['whiteboard', 'diagram', 'architecture', 'flowchart', 'sketch', 'draw', 'system design'],
  },
  {
    id: 'json-crack',
    name: 'JSON Crack',
    tagline: 'Visual JSON Graph Explorer',
    category: 'micro-dev',
    categoryLabel: 'Micro-Dev & Web Utils',
    description:
      'Complex aur nested JSON, YAML, CSV payloads ko instant interactive visual node tree / graph me convert karta hai.',
    os: ['Web'],
    license: 'Apache-2.0',
    websiteUrl: 'https://jsoncrack.com/editor',
    githubUrl: 'https://github.com/AykutSarac/jsoncrack.com',
    howToUse:
      'Left panel me API response ya raw JSON paste karo—right canvas par interactive tree map auto-render ho jayega. Nodes collapse karo, search karo aur PNG export lo.',
    keywords: ['json', 'yaml', 'graph', 'tree', 'visualizer', 'api', 'parser', 'debug'],
  },
  {
    id: 'carbon',
    name: 'Carbon',
    tagline: 'Beautiful Code Screenshots',
    category: 'micro-dev',
    categoryLabel: 'Micro-Dev & Web Utils',
    description:
      'Syntax-highlighted aur macOS-frame wale aesthetic code screenshots create karne ka developer favorite tool.',
    os: ['Web'],
    license: 'MIT',
    websiteUrl: 'https://carbon.now.sh/',
    githubUrl: 'https://github.com/carbon-app/carbon',
    howToUse:
      'carbon.now.sh par apna code snippet paste karo, language aur color theme (Dracula/Nord) chuno, background aur padding set karke PNG/SVG Export dabao.',
    keywords: ['code', 'screenshot', 'image', 'snippet', 'linkedin', 'twitter', 'highlight'],
  },
  {
    id: 'regex101',
    name: 'Regex101',
    tagline: 'Interactive Regex Debugger',
    category: 'micro-dev',
    categoryLabel: 'Micro-Dev & Web Utils',
    description:
      'Regular expressions ko live test, optimize aur har token ka English breakdown dekhne ka sabse accurate debugger.',
    os: ['Web'],
    license: 'MIT / Open Web Tool',
    websiteUrl: 'https://regex101.com/',
    githubUrl: 'https://github.com/firasdib/Regex101',
    howToUse:
      'Left me language Flavor (ECMAScript/JS ya Python) chuno. Top input me pattern aur niche Test String likho—right Explanation box har capture group ka exact kaam bata dega.',
    keywords: ['regex', 'regular expression', 'pattern', 'match', 'debug', 'validation', 'coder'],
  },
  {
    id: 'caniuse',
    name: 'Can I use',
    tagline: 'Browser Compatibility Matrix',
    category: 'micro-dev',
    categoryLabel: 'Micro-Dev & Web Utils',
    description:
      'Koi CSS property ya modern Web API Chrome, Firefox, Safari aur Android browsers me chalti hai ya nahi—turant check karo.',
    os: ['Web'],
    license: 'CC-BY-4.0',
    websiteUrl: 'https://caniuse.com/',
    githubUrl: 'https://github.com/Fyrd/caniuse',
    howToUse:
      'Search bar me feature ka naam type karo (jaise `backdrop-filter`, `has()`, ya `WebGPU`). Green/Red grid me har desktop aur mobile browser version ka exact support dikh jayega.',
    keywords: ['css', 'html', 'javascript', 'browser', 'support', 'compatibility', 'web', 'frontend'],
  },

  // ==========================================================
  // CATEGORY 5: PRIVACY & RECOVERY
  // ==========================================================
  {
    id: 'cryptomator',
    name: 'Cryptomator',
    tagline: 'Zero-Knowledge Cloud Encryption',
    category: 'privacy-recovery',
    categoryLabel: 'Privacy & Recovery',
    description:
      'Google Drive, Dropbox ya OneDrive me upload hone se pehle har file aur filename ko client-side AES-256 se encrypt karta hai.',
    os: ['Windows', 'Mac', 'Linux', 'Android'],
    license: 'GPL-3.0',
    websiteUrl: 'https://cryptomator.org/',
    githubUrl: 'https://github.com/cryptomator/cryptomator',
    howToUse:
      '"Add Vault" dabakar apna Google Drive/local folder chuno aur strong password set karo. Jab vault unlock karoge toh ek virtual drive khulegi—usme daali har file auto-encrypt hokar cloud jayegi.',
    keywords: ['encrypt', 'encryption', 'aes', 'google drive', 'cloud', 'privacy', 'vault', 'android'],
  },
  {
    id: 'testdisk',
    name: 'TestDisk / PhotoRec',
    tagline: 'Deleted Data & Partition Recovery',
    category: 'privacy-recovery',
    categoryLabel: 'Privacy & Recovery',
    description:
      'Accidentally deleted photos, documents aur corrupt USB/SSD partitions ko deep sector scan se recover karne ka battle-tested toolkit.',
    os: ['Windows', 'Mac', 'Linux'],
    license: 'GPL-2.0',
    websiteUrl: 'https://www.cgsecurity.org/wiki/TestDisk',
    githubUrl: 'https://github.com/cgsecurity/testdisk',
    howToUse:
      'Lost partition fix karne ke liye `testdisk` ya deleted photos/PDFs nikalne ke liye `photorec` run karo. Source drive select karke recovered files hamesha KISI ALAG drive par save karo.',
    quickCommand: 'photorec /d ./recovered_files',
    keywords: ['recover', 'recovery', 'deleted', 'photos', 'files', 'partition', 'usb', 'forensics', 'sd card'],
  },
  {
    id: 'eraser',
    name: 'Eraser',
    tagline: 'Permanent File Shredder',
    category: 'privacy-recovery',
    categoryLabel: 'Privacy & Recovery',
    description:
      'Sensitive files aur free disk space par random cryptographic passes overwrite karke undelete/forensic recovery ko impossible banata hai.',
    os: ['Windows'],
    license: 'GPL-3.0',
    websiteUrl: 'https://eraser.heidi.ie/',
    githubUrl: 'https://sourceforge.net/projects/eraser/',
    githubLabel: 'Source Repo',
    howToUse:
      'Sensitive file par right-click → "Eraser → Erase" chuno, ya app me Gutmann / DoD overwrite schedule add karo. Purani hard drive ya laptop bechne se pehle "Erase Unused Space" chalao.',
    keywords: ['shred', 'delete', 'permanent', 'wipe', 'privacy', 'secure erase', 'windows', 'recovery impossible'],
  },
];
