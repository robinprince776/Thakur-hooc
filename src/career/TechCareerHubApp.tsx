import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Map,
  DollarSign,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Building2,
  Users,
  Compass,
  Sparkles,
  Send,
  Star,
  Check,
  Shield,
  Layers,
  ArrowRight,
  Target
} from 'lucide-react';

export interface TechCareerHubAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const TechCareerHubApp: React.FC<TechCareerHubAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'roadmaps' | 'salary' | 'interview' | 'stories' | 'certs'>('roadmaps');
  const [selectedRoadmap, setSelectedRoadmap] = useState<'soc-pentest' | 'cloud-devsec' | 'fullstack' | 'ai-sec'>('soc-pentest');

  // Interview Simulator State
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [userInterviewAnswer, setUserInterviewAnswer] = useState('');
  const [evalResult, setEvalResult] = useState<{
    score: number;
    feedback: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    showIdeal: boolean;
  } | null>(null);

  // Roadmaps Data
  const ROADMAPS_DATA = {
    'soc-pentest': {
      title: 'Cybersecurity: SOC Analyst to Red Teamer',
      subtitle: 'From zero knowledge to enterprise security operations and offensive penetration testing.',
      duration: '6 Months Full-Time (or 9 Months Part-Time)',
      targetRole: 'Junior SOC Analyst (Tier 1) / Junior Pentester',
      salaryRange: '₹4.5 LPA - ₹18 LPA ($65,000 - $130,000)',
      stages: [
        {
          month: 'Month 1: Computer Systems & Networking Foundation',
          topics: ['TCP/IP Suite, OSI 7-Layers, Subnetting CIDR, Wireshark Packet Analysis', 'Linux CLI mastery (grep, awk, permissions, cron, systemd)', 'Windows Internals (Registry, Event Logs, Active Directory concepts)'],
          milestone: 'Complete OverTheWire Bandit + Network+ syllabus notes',
          badge: 'Foundations'
        },
        {
          month: 'Month 2: Core Defense, SIEM & Threat Hunting',
          topics: ['SIEM fundamentals (Splunk / Elastic / Wazuh)', 'Log Analysis (Apache, Nginx, Linux auth.log, Windows Event ID 4624/4625)', 'MITRE ATT&CK framework mapping & Cyber Kill Chain'],
          milestone: 'Build a home SIEM lab with Wazuh or Splunk free tier',
          badge: 'SOC Tier 1'
        },
        {
          month: 'Month 3: Web Security & OWASP Top 10',
          topics: ['HTTP protocol, Headers, Cookies, CORS, SOP', 'SQL Injection, XSS, CSRF, IDOR, SSRF deep dive', 'Burp Suite Community Edition mastery (Proxy, Repeater, Intruder)'],
          milestone: 'Solve all Apprentice & Practitioner labs on PortSwigger Web Academy',
          badge: 'Web AppSec'
        },
        {
          month: 'Month 4: Active Directory & Network Penetration',
          topics: ['Active Directory enumeration (BloodHound, PowerView)', 'Kerberoasting, AS-REP Roasting, Pass-the-Hash', 'Network scanning with Nmap, privilege escalation basics on Linux/Windows'],
          milestone: 'Root 15 Easy machines on HackTheBox Starting Point & TryHackMe',
          badge: 'Internal Pentest'
        },
        {
          month: 'Month 5: Advanced Defense, EDR & Cloud Security',
          topics: ['AWS IAM & CloudTrail forensics', 'Endpoint Detection & Response (EDR) triage', 'Incident Response Playbooks (Ransomware, Phishing, Data Leakage)'],
          milestone: 'Earn eJPTv2 or CompTIA Security+ certification',
          badge: 'Enterprise Security'
        },
        {
          month: 'Month 6: Interview Drills, Portfolio & Job Applications',
          topics: ['Build a public GitHub security writeup repo', 'Mock technical interviews (packet flow, log triage, OWASP fixes)', 'Targeted applications to MSSPs, Indian SOC hubs, and Big 4'],
          milestone: 'Land first SOC Analyst or Associate Pentester role',
          badge: 'Hired'
        }
      ]
    },
    'cloud-devsec': {
      title: 'Cloud Security & DevSecOps Specialist',
      subtitle: 'Secure modern multi-cloud infrastructures, CI/CD pipelines, and Kubernetes clusters.',
      duration: '6 Months',
      targetRole: 'DevSecOps Engineer / Cloud Security Analyst',
      salaryRange: '₹8 LPA - ₹28 LPA ($90,000 - $160,000)',
      stages: [
        {
          month: 'Month 1: Linux & Cloud Fundamentals (AWS/Azure)',
          topics: ['AWS IAM, VPC, EC2, S3, Security Groups, NACLs', 'Linux automation with Bash & Python scripting', 'Infrastructure as Code (Terraform basics)'],
          milestone: 'Pass AWS Certified Cloud Practitioner / Solutions Architect Assoc.',
          badge: 'Cloud Basics'
        },
        {
          month: 'Month 2: Containerization & Docker Security',
          topics: ['Docker architecture, namespaces, cgroups, rootless containers', 'Vulnerability scanning with Trivy and Grype', 'Dockerfile security best practices and minimal base images'],
          milestone: 'Deploy a hardened multi-container architecture',
          badge: 'Containers'
        },
        {
          month: 'Month 3: Kubernetes (K8s) Security & RBAC',
          topics: ['Kubernetes architecture: API Server, etcd, Kubelet', 'K8s RBAC policies, NetworkPolicies, Pod Security Standards', 'Runtime security with Falco'],
          milestone: 'Complete Killer.sh CKS practice labs',
          badge: 'K8s Defense'
        },
        {
          month: 'Month 4: CI/CD Pipeline Security (DevSecOps)',
          topics: ['GitHub Actions / GitLab CI workflows', 'SAST (Static Analysis with Semgrep / SonarQube)', 'SCA (Dependency scanning with Snyk), Secrets detection (TruffleHog)'],
          milestone: 'Build an automated zero-trust CI/CD security gate',
          badge: 'Pipeline Security'
        },
        {
          month: 'Month 5: Cloud Compliance & Incident Response',
          topics: ['AWS GuardDuty, Security Hub, CloudTrail log analysis', 'Cloud misconfiguration audits (ScoutSuite, Prowler)', 'SOC 2, ISO 27001, and CIS Benchmarks implementation'],
          milestone: 'Run an automated audit on an AWS organization',
          badge: 'Cloud GRC'
        },
        {
          month: 'Month 6: Job Ready Portfolio & Interviews',
          topics: ['Deploy an open-source DevSecOps portfolio repository', 'Present Terraform + GitHub Actions security pipeline to interviewers', 'Target cloud-native scaleups and remote roles'],
          milestone: 'Land DevSecOps / Cloud Security Engineer offer',
          badge: 'Job Offer'
        }
      ]
    },
    'fullstack': {
      title: 'Full-Stack Software Engineer (Modern Web)',
      subtitle: 'From React & TypeScript to high-performance Node.js, databases, and microservices.',
      duration: '6 Months',
      targetRole: 'Full-Stack Developer / Software Engineer',
      salaryRange: '₹6 LPA - ₹35 LPA ($75,000 - $150,000)',
      stages: [
        {
          month: 'Month 1: Advanced JavaScript, TypeScript & DOM',
          topics: ['Async JS, Event Loop, Promises, Closures', 'TypeScript strict typing, generics, utility types', 'Tailwind CSS, responsive design, accessibility (WCAG)'],
          milestone: 'Build 3 interactive TypeScript responsive web apps',
          badge: 'Frontend Core'
        },
        {
          month: 'Month 2: React 19, Hooks & State Architecture',
          topics: ['Custom hooks, context, memoization (useMemo, useCallback)', 'Client routing, state machines, performance profiling', 'Testing with Vitest and React Testing Library'],
          milestone: 'Build a production-grade single page application',
          badge: 'React Pro'
        },
        {
          month: 'Month 3: Backend Node.js, Express & REST/GraphQL',
          topics: ['Node.js runtime, event-driven architecture, streams', 'REST API design standards, error handling, rate limiting', 'JWT auth, OAuth 2.0 PKCE, session management'],
          milestone: 'Build a robust multi-tenant authentication microservice',
          badge: 'Backend'
        },
        {
          month: 'Month 4: Relational & NoSQL Databases',
          topics: ['PostgreSQL schema design, indexing, transactions, ACID', 'Redis caching, pub/sub, session stores', 'ORM/Query builders (Drizzle, Prisma)'],
          milestone: 'Optimize database queries from 500ms down to 10ms',
          badge: 'Databases'
        },
        {
          month: 'Month 5: System Design & Microservices',
          topics: ['Horizontal scaling, load balancers, reverse proxies (Nginx)', 'Message queues (RabbitMQ / Kafka) basics', 'Dockerizing full-stack apps and deploying to cloud'],
          milestone: 'Design a scalable real-time chat / collaborative platform',
          badge: 'Architecture'
        },
        {
          month: 'Month 6: Capstone Project & FAANG/Startup Interviews',
          topics: ['Data Structures & Algorithms (LeetCode 150 top patterns)', 'Live coding interview drills', 'Resume review & cold outreach to CTOs/Founders'],
          milestone: 'Receive Full-Stack Software Engineer job offers',
          badge: 'Full-Stack Pro'
        }
      ]
    },
    'ai-sec': {
      title: 'AI Engineering & LLM Security Specialist',
      subtitle: 'Harness generative AI, prompt engineering, and defend against AI vulnerabilities (OWASP LLM Top 10).',
      duration: '6 Months',
      targetRole: 'AI Application Engineer / AI Security Specialist',
      salaryRange: '₹10 LPA - ₹45 LPA ($110,000 - $210,000)',
      stages: [
        {
          month: 'Month 1: Python, Math & GenAI Foundations',
          topics: ['Python mastery, NumPy, Pandas, Async IO', 'Transformer architecture basics, Tokenization, Embeddings', 'Gemini & OpenAI API integrations with structured JSON outputs'],
          milestone: 'Build an automated AI documentation & summarizer agent',
          badge: 'AI Core'
        },
        {
          month: 'Month 2: Retrieval-Augmented Generation (RAG)',
          topics: ['Vector databases (Chroma, Pinecone, pgvector)', 'Chunking strategies, semantic similarity, re-ranking', 'Hybrid search (BM25 + Dense embeddings)'],
          milestone: 'Build an enterprise RAG assistant over custom PDF docs',
          badge: 'RAG Pro'
        },
        {
          month: 'Month 3: AI Agents & Function Calling',
          topics: ['Tool calling, ReAct framework, multi-agent orchestration', 'LangChain / LlamaIndex / native SDK agent design', 'Human-in-the-loop workflows & state persistence'],
          milestone: 'Deploy an autonomous software testing & bug triage agent',
          badge: 'AI Agents'
        },
        {
          month: 'Month 4: OWASP Top 10 for Large Language Models',
          topics: ['Prompt Injection (Direct & Indirect jailbreaks)', 'Insecure Output Handling (stored XSS via LLM)', 'Model Denial of Service, Data Poisoning, Sensitive Info Disclosure'],
          milestone: 'Build input guardrails using NeMo Guardrails or Llama Guard',
          badge: 'LLM Defense'
        },
        {
          month: 'Month 5: Fine-Tuning & Model Evaluation',
          topics: ['LoRA / QLoRA parameter-efficient fine-tuning', 'Evaluation benchmarks (RAGAS, BLEU, ROUGE, LLM-as-a-Judge)', 'Safety alignment and red-teaming AI systems'],
          milestone: 'Conduct an end-to-end security audit on an AI product',
          badge: 'AI Red Teamer'
        },
        {
          month: 'Month 6: High-Demand AI Industry Roles',
          topics: ['Enterprise AI governance, EU AI Act compliance basics', 'Portfolio showcasing production-safe AI apps', 'Interviews with AI startups and enterprise labs'],
          milestone: 'Secure top-tier AI Engineer / AI Safety role',
          badge: 'AI Specialist'
        }
      ]
    }
  };

  // Salary & Companies Data
  const SALARY_COMPANIES_DATA = [
    {
      role: 'SOC Analyst (Tier 1 / Tier 2)',
      indiaFreshers: '₹4.5 - ₹8 LPA',
      indiaExperienced: '₹10 - ₹22 LPA',
      globalAvg: '$75,000 - $115,000',
      skills: ['SIEM (Splunk/Elastic)', 'Network Log Analysis', 'Wireshark', 'Phishing Triage', 'EDR'],
      topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Mandiant (Google Cloud)', 'TCS Cyber Defense', 'Wipro CyberSOC', 'Deloitte Risk Advisory', 'EY Cyber Hub']
    },
    {
      role: 'Penetration Tester / Ethical Hacker',
      indiaFreshers: '₹6 - ₹12 LPA',
      indiaExperienced: '₹16 - ₹38 LPA',
      globalAvg: '$95,000 - $155,000',
      skills: ['Burp Suite Pro', 'Active Directory Exploitation', 'OWASP Top 10', 'Linux PrivEsc', 'Python/Bash'],
      topCompanies: ['Kroll', 'NCC Group', 'Bishop Fox', 'Rhino Security Labs', 'Razorpay InfoSec', 'CRED Security', 'Quick Heal Technologies']
    },
    {
      role: 'Application Security (AppSec) Engineer',
      indiaFreshers: '₹8 - ₹16 LPA',
      indiaExperienced: '₹22 - ₹50 LPA',
      globalAvg: '$110,000 - $175,000',
      skills: ['Code Review (SAST/DAST)', 'Threat Modeling (STRIDE)', 'DevSecOps', 'Software Architecture', 'Cryptography'],
      topCompanies: ['Flipkart Security', 'Swiggy', 'Zomato', 'Microsoft Security Team', 'Adobe Security', 'Salesforce', 'Amazon InfoSec']
    },
    {
      role: 'Cloud Security / DevSecOps Engineer',
      indiaFreshers: '₹9 - ₹18 LPA',
      indiaExperienced: '₹25 - ₹65 LPA',
      globalAvg: '$120,000 - $190,000',
      skills: ['AWS/Azure Security', 'Kubernetes (CKS)', 'Terraform', 'CI/CD Pipelines', 'Trivy/Falco'],
      topCompanies: ['Google Cloud', 'AWS Security', 'Datadog', 'HashiCorp', 'Uber Engineering', 'PhonePe', 'Jio Platforms']
    },
    {
      role: 'Principal Security Architect / CISO Path',
      indiaFreshers: 'N/A (10+ Yrs Exp)',
      indiaExperienced: '₹60 LPA - ₹1.8 Cr+',
      globalAvg: '$200,000 - $350,000+',
      skills: ['Zero Trust Architecture', 'Enterprise Risk Governance', 'Executive Communication', 'Incident Response Leadership'],
      topCompanies: ['Fortune 500 Banks (HDFC, ICICI, Citi)', 'Tech Giants (Google, Meta, Apple)', 'Global Defense & Aerospace']
    }
  ];

  // Interview Simulator Questions
  const INTERVIEW_QUESTIONS = [
    {
      id: 'q1',
      domain: 'SOC & Incident Response',
      question: 'A critical server is communicating with a known malicious command-and-control (C2) IP address over port 443. What are your immediate containment and investigation steps?',
      expectedKeywords: ['isolate', 'edr', 'quarantine', 'pcap', 'memory dump', 'firewall', 'process', 'parent process', 'hash'],
      idealAnswer: '1) Containment: Immediately isolate the host from the network using EDR without powering off the machine (to preserve volatile RAM). 2) Evidence Collection: Capture volatile memory dump, network connections (`netstat -ano`), running processes, and firewall connection logs. 3) Root Cause Analysis: Identify the process PID initiating the outbound connection, inspect its parent process (e.g. Word spawning PowerShell), check the binary hash on VirusTotal. 4) Remediation & Eradication: Terminate malicious processes, delete persistence registry keys/scheduled tasks, reset user credentials, and update firewall egress rules. 5) Post-Incident: Author an IoC report and create detection rules (YARA / Sigma) in SIEM.'
    },
    {
      id: 'q2',
      domain: 'Web Application Security',
      question: 'How would you defend an application against Broken Object Level Authorization (BOLA/IDOR) in a REST API?',
      expectedKeywords: ['authorization', 'session', 'tenant', 'rbac', 'guid', 'uuid', 'token', 'user id', 'row-level'],
      idealAnswer: '1) Never trust client-supplied identifiers: Do not allow the client request to dictate the owner of a resource (e.g., `/api/documents?id=456`). 2) Contextual Verification: Verify that the authenticated session user (extracted from the JWT or server session) has explicit permission to access the target object ID before querying the database. 3) Row-Level Security (RLS): Implement database-level policies (e.g. in PostgreSQL: `WHERE tenant_id = current_tenant`). 4) Use Unpredictable Identifiers: Use UUIDv4 or encrypted hashes instead of sequential integer IDs (`1, 2, 3`) to eliminate trivial enumeration.'
    },
    {
      id: 'q3',
      domain: 'Behavioral / HR Interview',
      question: 'Tell me about a time you found a critical vulnerability or bug right before a major product release. How did you handle the engineering team?',
      expectedKeywords: ['risk', 'collaborate', 'communication', 'business impact', 'mitigation', 'patch', 'workaround', 'calm'],
      idealAnswer: 'Using the STAR method: 1) Situation: Right before a scheduled feature release, I discovered an unauthenticated API endpoint that leaked customer personal data. 2) Task: My duty was to prevent a security disaster without causing unnecessary panic or alienating the engineering team who worked hard on the release. 3) Action: I scheduled a brief 10-minute huddle with the Lead Engineer and Product Manager. Instead of just blocking the deployment, I brought a working temporary patch and suggested a WAF rate-limiting rule as an emergency stopgap so the launch could proceed safely. 4) Result: The team patched the root cause within 2 hours, the product launched securely on schedule, and engineering appreciated the collaborative approach.'
    }
  ];

  const handleEvaluateAnswer = () => {
    const activeQ = INTERVIEW_QUESTIONS[selectedQuestionIndex];
    const textLower = userInterviewAnswer.toLowerCase();
    
    const matched = activeQ.expectedKeywords.filter((kw) => textLower.includes(kw));
    const missing = activeQ.expectedKeywords.filter((kw) => !textLower.includes(kw));
    
    const scorePct = Math.round((matched.length / activeQ.expectedKeywords.length) * 100);
    
    let feedback = '';
    if (scorePct >= 70) {
      feedback = 'Outstanding technical answer! You covered core defensive principles, operational containment steps, and specific terminology interviewers look for.';
    } else if (scorePct >= 40) {
      feedback = 'Good foundation, but your answer missed a few crucial industry-standard terms and sequential containment procedures. Review the missing keywords.';
    } else {
      feedback = 'Your answer is too brief or lacks key technical specifics. Make sure to structure your answers systematically (Detect -> Contain -> Investigate -> Remediate).';
    }

    setEvalResult({
      score: scorePct,
      feedback,
      matchedKeywords: matched,
      missingKeywords: missing,
      showIdeal: true
    });
  };

  // Success Stories Data
  const SUCCESS_STORIES = [
    {
      name: 'Aman Sharma',
      badge: 'Zero to OSCP in 9 Months',
      from: 'Tier-3 College BCA Graduate (No prior coding experience)',
      to: 'Senior Penetration Tester at US FinTech ($120k Remote)',
      story: 'Started by learning Linux through OverTheWire Bandit and building a local VirtualBox lab. Dedicated 3 hours every single night: 1 hour reading documentation, 2 hours rooting machines on HackTheBox Starting Point. Documented every failed exploit attempt in an Obsidian notebook. Passed OSCP on the very first attempt with 90 points.',
      keyTakeaways: [
        'Consistency over intensity: 3 focused hours daily beat 12 hours once a week.',
        'Always take detailed notes of every command and error message.',
        'Networking fundamentals (TCP/IP, subnetting) made exploit analysis 10x easier.'
      ]
    },
    {
      name: 'Pooja Verma',
      badge: '$35,000+ in Bug Bounties',
      from: 'Electrical Engineering Student',
      to: 'Full-time Bug Bounty Hunter & Security Consultant',
      story: 'Rather than running noisy automated tools that got IP-blocked, she specialized strictly in Business Logic Flaws and IDORs on HackerOne private programs. Found her first $1,500 bounty in an e-commerce checkout flow where negative quantities produced credits.',
      keyTakeaways: [
        'Automated scanners are already run by companies; focus on business logic flaws.',
        'Deep dive into 1 target company for 2 months rather than jumping between 10 sites.',
        'Write polite, professional reports with clear reproduction steps and impact.'
      ]
    },
    {
      name: 'Rahul Sen',
      badge: 'SOC Tier 1 to DevSecOps Lead',
      from: 'Night Shift SOC Analyst (₹3.5 LPA)',
      to: 'Cloud DevSecOps Lead at Indian Unicorn (₹42 LPA)',
      story: 'While working 12-hour night shifts monitoring SIEM alerts, he automated his repetitive alert triage tasks using Python scripts. Learned Docker, AWS IAM, and Terraform on weekends. Transitioned internally to the Cloud Security team and led the company\'s migration to Zero Trust.',
      keyTakeaways: [
        'Automate your daily boring tasks with Python/Bash.',
        'Learn Cloud Security (AWS/Kubernetes) — it is the highest paying security domain.',
        'Never stop after Tier 1 SOC; constantly build tools on GitHub.'
      ]
    }
  ];

  // Certifications Data
  const CERTS_DATA = [
    {
      name: 'CompTIA Security+ (SY0-701)',
      vendor: 'CompTIA',
      costUsd: '$404 (~₹33,500)',
      difficulty: '2.5 / 5 (Moderate)',
      value: 'Gold Standard for Junior SOC / IT Support entry',
      examType: '90 MCQs & Performance-Based Questions (90 mins)',
      bestFor: 'Freshers, career switchers, IT admins entering security',
      prepTime: '2 - 3 Months'
    },
    {
      name: 'eJPTv2 (Junior Pentester)',
      vendor: 'INE Security',
      costUsd: '$249 (~₹20,500)',
      difficulty: '3.0 / 5 (Practical Hands-On)',
      value: 'Most respected entry-level practical hacking cert',
      examType: '48-hour live practical network penetration test',
      bestFor: 'Aspiring penetration testers, bug bounty hunters',
      prepTime: '2 - 3 Months'
    },
    {
      name: 'OSCP (Offensive Security Certified)',
      vendor: 'OffSec (PEN-200)',
      costUsd: '$1,649 (~₹1,37,000)',
      difficulty: '4.8 / 5 (Intense Practical)',
      value: 'Industry benchmark for Penetration Testers & Red Teamers',
      examType: '24-hour live practical hacking + 24-hour professional report',
      bestFor: 'Intermediate ethical hackers seeking high-paying consulting roles',
      prepTime: '6 - 9 Months'
    },
    {
      name: 'AWS Certified Security - Specialty',
      vendor: 'Amazon Web Services',
      costUsd: '$300 (~₹25,000)',
      difficulty: '3.8 / 5 (Technical Cloud)',
      value: 'Unbeatable ROI for Cloud Security & DevSecOps positions',
      examType: '65 scenario-based questions (170 mins)',
      bestFor: 'Cloud engineers, DevSecOps practitioners, AWS architects',
      prepTime: '3 - 4 Months'
    },
    {
      name: 'CISSP (Certified Information Systems Security)',
      vendor: '(ISC)²',
      costUsd: '$749 (~₹62,000)',
      difficulty: '4.5 / 5 (Managerial / Broad)',
      value: 'Mandatory credential for CISOs, Directors & Architects',
      examType: '100-150 adaptive questions (3 hours, requires 5 yrs exp)',
      bestFor: 'Senior security practitioners, security managers, consultants',
      prepTime: '6 - 12 Months'
    }
  ];

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      TechCareer Hub
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      ₹5L - ₹1.5Cr+ Roadmaps
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Career blueprints, interview simulators, global salaries &amp; success roadmaps
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Suite Apps</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'roadmaps', label: '1. 🗺️ 6-Month Roadmaps', icon: Map },
              { id: 'salary', label: '2. 💰 Salary & Companies', icon: DollarSign },
              { id: 'interview', label: '3. 🎯 Interview Simulator', icon: Target },
              { id: 'stories', label: '4. 🏆 Success Stories', icon: Star },
              { id: 'certs', label: '5. 📜 Certifications Guide', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs shadow-cyan-500/10'
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* TAB 1: ROADMAPS */}
        {activeTab === 'roadmaps' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'soc-pentest', label: 'Cybersecurity (SOC & Pentester)' },
                { id: 'cloud-devsec', label: 'Cloud Security & DevSecOps' },
                { id: 'fullstack', label: 'Full-Stack Software Engineer' },
                { id: 'ai-sec', label: 'AI Engineering & LLM Security' }
              ].map((rm) => (
                <button
                  key={rm.id}
                  onClick={() => setSelectedRoadmap(rm.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRoadmap === rm.id
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {rm.label}
                </button>
              ))}
            </div>

            {(() => {
              const current = ROADMAPS_DATA[selectedRoadmap];
              return (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white">{current.title}</h2>
                      <p className="text-xs text-slate-400 mt-1">{current.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                        ⏱️ {current.duration}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        💰 {current.salaryRange}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {current.stages.map((stg, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-cyan-400">{stg.month}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {stg.badge}
                          </span>
                        </div>
                        <ul className="space-y-1 text-slate-300 list-disc list-inside">
                          {stg.topics.map((tp, i) => (
                            <li key={i}>{tp}</li>
                          ))}
                        </ul>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Key Milestone: {stg.milestone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: SALARY & COMPANIES */}
        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8 space-y-2">
              <h2 className="text-2xl font-black text-white">India &amp; Global Compensation Intelligence</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Realistic market salary ranges (CTC) based on verified offers across Indian product firms, MNCs, and US remote roles.
              </p>
            </div>

            <div className="space-y-5">
              {SALARY_COMPANIES_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 text-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{item.role}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-mono">
                        Fresher: <strong className="text-cyan-400">{item.indiaFreshers}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 font-mono border border-emerald-800 font-bold">
                        3-7 Yrs Exp: {item.indiaExperienced}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-blue-950 text-blue-300 font-mono border border-blue-800 font-bold">
                        Global / Remote: {item.globalAvg}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                      <span className="font-bold text-cyan-400 block uppercase text-[10px]">High-Yield Skills Required</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((sk, sIdx) => (
                          <span key={sIdx} className="px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                      <span className="font-bold text-emerald-400 block uppercase text-[10px]">Top Hiring Companies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.topCompanies.map((cp, cIdx) => (
                          <span key={cIdx} className="px-2 py-1 rounded-lg bg-slate-900 text-emerald-300 border border-slate-800 text-[11px] font-medium">
                            {cp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INTERVIEW SIMULATOR */}
        {activeTab === 'interview' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase">AI-Logic Practice</span>
                <h2 className="text-2xl font-black text-white mt-1">Real Technical &amp; HR Interview Simulator</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Type your real response. The evaluator checks for keyword mastery, sequential logic, and reveals the golden answer!
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 font-mono text-xs font-bold">
                Question {selectedQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
              </span>
            </div>

            {/* Question Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {INTERVIEW_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestionIndex(idx);
                    setUserInterviewAnswer('');
                    setEvalResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedQuestionIndex === idx
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Q{idx + 1}: {q.domain}
                </button>
              ))}
            </div>

            {/* Active Question Box */}
            {(() => {
              const activeQ = INTERVIEW_QUESTIONS[selectedQuestionIndex];
              return (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 text-white font-bold text-sm sm:text-base leading-relaxed">
                    &quot;{activeQ.question}&quot;
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5 font-bold">Your Response (Answer as if speaking in an interview):</label>
                    <textarea
                      rows={5}
                      value={userInterviewAnswer}
                      onChange={(e) => setUserInterviewAnswer(e.target.value)}
                      placeholder="Type your structured answer here (e.g. 1. Containment steps, 2. Root cause, 3. Remediation)..."
                      className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                    />
                  </div>

                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={userInterviewAnswer.trim().length === 0}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Evaluate My Answer &amp; Show Ideal Answer</span>
                  </button>

                  {evalResult && (
                    <div className="space-y-5 pt-4 border-t border-slate-800">
                      {/* Evaluation Score */}
                      <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">Response Evaluation Score:</span>
                          <span className={`text-base font-black font-mono ${
                            evalResult.score >= 70 ? 'text-emerald-400' : evalResult.score >= 40 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {evalResult.score} / 100
                          </span>
                        </div>
                        <p className="text-slate-300">{evalResult.feedback}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                            <strong className="block text-emerald-200 mb-1">Matched Core Keywords:</strong>
                            {evalResult.matchedKeywords.length > 0 ? evalResult.matchedKeywords.join(', ') : 'None detected'}
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                            <strong className="block text-slate-300 mb-1">Missing Expected Concepts:</strong>
                            {evalResult.missingKeywords.length > 0 ? evalResult.missingKeywords.join(', ') : 'All key points covered!'}
                          </div>
                        </div>
                      </div>

                      {/* Ideal Answer */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-800/60 space-y-3 text-xs">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                          <Sparkles className="w-4 h-4" />
                          <span>Ideal Benchmark Answer (Industry Gold Standard):</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                          {activeQ.idealAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 4: SUCCESS STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-slate-800 p-6 sm:p-8 space-y-2">
              <h2 className="text-2xl font-black text-white">Real Engineer &amp; Hacker Success Breakdowns</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ordinary students who transitioned into high-paying cybersecurity and software careers. Exactly what they did every day.
              </p>
            </div>

            <div className="space-y-6">
              {SUCCESS_STORIES.map((story, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{story.name}</h3>
                      <p className="text-slate-400">{story.from} &rarr; <span className="text-cyan-400 font-bold">{story.to}</span></p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold text-xs">
                      {story.badge}
                    </span>
                  </div>

                  <p className="text-slate-200 leading-relaxed text-sm bg-slate-850 p-4 rounded-2xl border border-slate-800">
                    &quot;{story.story}&quot;
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="font-bold text-emerald-400 uppercase text-[10px] block">Key Lessons to Emulate:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {story.keyTakeaways.map((tk, tIdx) => (
                        <li key={tIdx}>{tk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATIONS GUIDE */}
        {activeTab === 'certs' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 space-y-2">
              <h2 className="text-2xl font-black text-white">Cybersecurity &amp; Cloud Certification Master Guide</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Objective cost, difficulty, exam type, and career ROI comparison of the world&apos;s leading technical credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CERTS_DATA.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 font-bold">{cert.vendor}</span>
                      <span className="text-emerald-400 font-bold font-mono">{cert.costUsd}</span>
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">{cert.name}</h3>
                    <p className="text-slate-300"><strong className="text-slate-400">Difficulty: </strong>{cert.difficulty}</p>
                    <p className="text-slate-300"><strong className="text-slate-400">Exam Type: </strong>{cert.examType}</p>
                    <p className="text-slate-300"><strong className="text-slate-400">Prep Duration: </strong>{cert.prepTime}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-1.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 text-cyan-300 text-[11px]">
                      <strong>Value: </strong>{cert.value}
                    </div>
                    <p className="text-slate-400 text-[11px] italic">Best for: {cert.bestFor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
