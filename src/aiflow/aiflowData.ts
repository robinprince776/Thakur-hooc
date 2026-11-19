export type FlowNodeKind = 'trigger' | 'action' | 'logic' | 'ai';

export interface FlowNode {
  id: string;
  kind: FlowNodeKind;
  title: string;
  subtitle: string;
  provider: string;
  x: number;
  y: number;
  samplePayload: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface NodeTemplate {
  kind: FlowNodeKind;
  title: string;
  subtitle: string;
  provider: string;
  samplePayload: Record<string, unknown>;
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  category: 'Client Ops' | 'Engineering' | 'Research' | 'Growth' | 'Productivity';
  modelHint: string;
  bestFor: string;
  inputFormat: string;
  outputFormat: string;
  systemPrompt: string;
  exampleOutput: string;
}

export interface WebhookPreset {
  id: 'zapier' | 'make' | 'n8n' | 'python';
  platform: string;
  endpoint: string;
  method: 'POST';
  authHeader: string;
  description: string;
  sampleBody: string;
  responseCode: number;
  responseBody: string;
  integrationSnippet: string;
}

export interface AutomationBlueprint {
  id: string;
  title: string;
  category: 'Freelancing' | 'Job Hunt' | 'DevOps' | 'Content' | 'E-Commerce' | 'Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stack: string;
  timeSaved: string;
  summary: string;
  steps: string[];
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const NODE_CATALOG: NodeTemplate[] = [
  {
    kind: 'trigger',
    title: 'Webhook Trigger',
    subtitle: 'POST /hooks/catch',
    provider: 'HTTP Webhook',
    samplePayload: { event: 'lead.created', email: 'founder@acme.io', budget: '$2,500' },
  },
  {
    kind: 'trigger',
    title: 'New Email Received',
    subtitle: 'IMAP / Gmail Watch',
    provider: 'Gmail',
    samplePayload: { from: 'client@startup.co', subject: 'Need React SaaS MVP', priority: 'high' },
  },
  {
    kind: 'trigger',
    title: 'Schedule (CRON)',
    subtitle: 'Every 6 hours',
    provider: 'Scheduler',
    samplePayload: { runAt: '2025-05-12T09:00:00Z', timezone: 'Asia/Kolkata' },
  },
  {
    kind: 'trigger',
    title: 'GitHub PR Opened',
    subtitle: 'pull_request.opened',
    provider: 'GitHub',
    samplePayload: { repo: 'techmaster/web', prNumber: 142, filesChanged: 7 },
  },
  {
    kind: 'ai',
    title: 'AI Classifier & Draft',
    subtitle: 'Structured JSON Prompt',
    provider: 'LLM Node',
    samplePayload: { intent: 'qualified_lead', confidence: 0.94, draftReady: true },
  },
  {
    kind: 'logic',
    title: 'Condition Filter',
    subtitle: 'score >= 80 && active',
    provider: 'Router',
    samplePayload: { matched: true, route: 'fast-track', latencyMs: 4 },
  },
  {
    kind: 'action',
    title: 'Send Telegram Alert',
    subtitle: 'Bot API sendMessage',
    provider: 'Telegram',
    samplePayload: { chatId: '@ops_alerts', status: 'delivered', messageId: 8821 },
  },
  {
    kind: 'action',
    title: 'Append Google Sheet',
    subtitle: 'CRM Leads Tab',
    provider: 'Google Sheets',
    samplePayload: { sheet: 'Leads_2025', rowAdded: 418, synced: true },
  },
  {
    kind: 'action',
    title: 'Send Slack / Discord',
    subtitle: 'Incoming Webhook',
    provider: 'Discord',
    samplePayload: { channel: '#engineering-ops', ok: true },
  },
  {
    kind: 'action',
    title: 'Create Notion Task',
    subtitle: 'Database Page Insert',
    provider: 'Notion',
    samplePayload: { pageId: 'ntn_92fa01', status: 'Queued' },
  },
];

export const DEFAULT_CANVAS_NODES: FlowNode[] = [
  {
    id: 'n1',
    kind: 'trigger',
    title: 'New Client Email',
    subtitle: 'Gmail · Subject: Inquiry',
    provider: 'Gmail',
    x: 48,
    y: 120,
    samplePayload: { from: 'alex@cloudscale.dev', subject: 'Need Next.js + Stripe Portal', budget: '$3,200' },
  },
  {
    id: 'n2',
    kind: 'ai',
    title: 'AI Scope & Reply Bot',
    subtitle: 'Extract Budget + Draft Reply',
    provider: 'LLM Node',
    x: 330,
    y: 70,
    samplePayload: { qualified: true, timeline: '3 weeks', replyDraft: 'Hi Alex, I can deliver the Stripe portal...' },
  },
  {
    id: 'n3',
    kind: 'logic',
    title: 'Budget Filter',
    subtitle: 'budget >= $1,500',
    provider: 'Router',
    x: 610,
    y: 70,
    samplePayload: { passed: true, tier: 'High-Value Client' },
  },
  {
    id: 'n4',
    kind: 'action',
    title: 'Log to CRM Sheet',
    subtitle: 'Google Sheets · Pipeline',
    provider: 'Sheets',
    x: 880,
    y: 35,
    samplePayload: { row: 94, status: 'Proposal Sent' },
  },
  {
    id: 'n5',
    kind: 'action',
    title: 'Instant Telegram Ping',
    subtitle: 'Bot Alert w/ Draft Link',
    provider: 'Telegram',
    x: 880,
    y: 195,
    samplePayload: { delivered: true, latencyMs: 142 },
  },
];

export const DEFAULT_CANVAS_EDGES: FlowEdge[] = [
  { id: 'e1', from: 'n1', to: 'n2', label: 'email_body' },
  { id: 'e2', from: 'n2', to: 'n3', label: 'lead_json' },
  { id: 'e3', from: 'n3', to: 'n4', label: 'true' },
  { id: 'e4', from: 'n3', to: 'n5', label: 'notify' },
];

export const AGENT_PERSONAS: AgentPersona[] = [
  {
    id: 'email-reply-bot',
    name: 'Email Reply Bot',
    role: 'Freelance Client Triage & Proposal Responder',
    category: 'Client Ops',
    modelHint: 'Fast Instruction LLM · Temp 0.3',
    bestFor: 'Instant, warm, scope-clarifying replies to inbound client emails without sounding robotic.',
    inputFormat: 'Raw email sender, subject, body, and your base hourly/project rate.',
    outputFormat: 'JSON { intent, estimatedBudget, missingQuestions[], replyText }',
    systemPrompt: `You are an executive freelance operations assistant for a senior full-stack engineer.
Task: Analyze the incoming client email and draft a concise, confident, human reply.

Strict Rules:
1. Never use corporate fluff ("I hope this email finds you well", "synergy", "delighted").
2. Acknowledge 1 specific technical detail from the client's message in sentence one.
3. Ask at most 2 sharp clarifying questions (timeline, existing repo/stack, or target KPI).
4. Offer 2 concrete call slots or a lightweight async Loom walkthrough option.
5. Keep the entire reply under 130 words.
6. Return valid JSON with keys: "intent" ("hot_lead" | "support" | "spam"), "urgency" (1-5), "summary", and "replyBody".`,
    exampleOutput: `{
  "intent": "hot_lead",
  "urgency": 5,
  "summary": "Founder needs a React + Stripe billing portal in 3 weeks.",
  "replyBody": "Hi Alex — building a self-serve Stripe billing portal in React is right in my wheelhouse. Before I send a fixed milestone breakdown, two quick questions: (1) Do you already have Stripe webhooks set up on your backend, or should I handle the webhook sync too? (2) Are you targeting subscriptions only or metered usage billing? Happy to jump on a 15-min call tomorrow at 11 AM or 4 PM EST, or send a 3-min Loom plan."
}`,
  },
  {
    id: 'code-reviewer-bot',
    name: 'Code Reviewer Bot',
    role: 'Automated PR Security, Performance & Edge-Case Auditor',
    category: 'Engineering',
    modelHint: 'Reasoning LLM · Temp 0.1',
    bestFor: 'Running on GitHub Pull Request webhooks to catch SQLi, XSS, N+1 queries, and memory leaks before merge.',
    inputFormat: 'Unified git diff + changed file paths.',
    outputFormat: 'Markdown review grouped by Critical / High / Nitpick with exact line fixes.',
    systemPrompt: `You are a Principal Staff Engineer performing an automated Pull Request security and reliability audit.
Analyze ONLY the provided git diff. Ignore formatting preferences handled by Prettier/ESLint.

Audit Checklist:
1. Security: XSS, SQL/NoSQL injection, hardcoded secrets, missing auth checks, SSRF, unsafe regex (ReDoS).
2. Reliability: Unhandled promise rejections, race conditions, missing AbortController/cleanup in React useEffect, memory leaks.
3. Performance: N+1 database queries, blocking loops, unnecessary re-renders, unindexed filters.

Output Format:
- Verdict: APPROVE | REQUEST_CHANGES
- Findings: For each issue, state [SEVERITY] file:line, explain the concrete failure mode in 1 sentence, and provide a minimal drop-in code patch. If no real issues exist, output "LGTM — no blocking defects found."`,
    exampleOutput: `Verdict: REQUEST_CHANGES

[CRITICAL] src/api/users.ts:44 — Raw template interpolation in SQL query allows SQL injection via req.query.email.
Patch: Use parameterized query: db.query('SELECT id, role FROM users WHERE email = $1', [email]);

[HIGH] src/hooks/useFeed.ts:19 — Missing AbortController cleanup causes state updates on unmounted component during rapid tab switches.`,
  },
  {
    id: 'scraper-summarizer-bot',
    name: 'Scraper & Summarizer Bot',
    role: 'Web Signal Extractor & Structured Digest Compiler',
    category: 'Research',
    modelHint: 'Long-Context LLM · Temp 0.2',
    bestFor: 'Turning scraped job boards, changelog pages, or HackerNews threads into clean Telegram/Notion digests.',
    inputFormat: 'Cleaned HTML/Markdown text from Playwright, Firecrawl, or RSS feed.',
    outputFormat: 'Strict JSON array of top insights with relevance scores and action URLs.',
    systemPrompt: `You are a high-signal technical intelligence extractor.
Given raw scraped web content (job listings, release notes, or news articles), strip all navigation noise, ads, and boilerplate.

Extraction Rules:
1. Identify up to 5 highest-value items matching the user's target criteria.
2. Score each item 1-100 on relevance. Discard anything below 70.
3. For each kept item, extract: title, sourceUrl, keyNumbers (salary, latency, version), 1-sentence takeaway, and recommendedAction.
4. Never hallucinate URLs or metrics not present in the source text. If a field is missing, set it to null.
5. Return ONLY a JSON array.`,
    exampleOutput: `[
  {
    "title": "Remote Full-Stack Engineer (TypeScript/Postgres)",
    "sourceUrl": "https://jobs.example.com/4910",
    "keyNumbers": "$70k-$95k/yr · Async Remote",
    "relevance": 93,
    "takeaway": "Early-stage SaaS hiring a solo TypeScript engineer with Stripe experience.",
    "recommendedAction": "Send tailored Loom + GitHub billing starter link within 2 hours."
  }
]`,
  },
  {
    id: 'bug-triage-agent',
    name: 'Support & Bug Triage Agent',
    role: 'Customer Ticket to Reproducible GitHub Issue Converter',
    category: 'Engineering',
    modelHint: 'Structured Output LLM · Temp 0.1',
    bestFor: 'Converting messy user complaints from Intercom/Discord into clean engineering tickets with severity labels.',
    inputFormat: 'Support message, user browser metadata, optional stack trace.',
    outputFormat: 'JSON { title, severity, component, reproductionSteps[], suspectedRootCause }',
    systemPrompt: `You convert unstructured customer bug reports into engineering-ready GitHub Issues.
Rules:
1. Summarize the failure in a crisp title under 70 characters.
2. Assign severity: P0 (data loss/auth broken), P1 (core workflow blocked), P2 (degraded UX), P3 (cosmetic).
3. Extract clear numbered Steps to Reproduce, Expected Behavior, and Actual Behavior.
4. Separate verified facts from assumptions. Never invent stack traces.
5. Suggest 1-2 likely codebase areas to inspect first.`,
    exampleOutput: `{
  "title": "Invoice PDF export cuts off line items beyond row 12 on mobile Safari",
  "severity": "P2",
  "component": "billing/invoice-print",
  "reproductionSteps": ["Open Invoice Builder on iOS Safari", "Add 14 line items", "Tap Download PDF"],
  "suspectedRootCause": "Print stylesheet missing page-break-inside: avoid on table rows."
}`,
  },
  {
    id: 'content-repurpose-agent',
    name: 'Dev Content Repurposer',
    role: 'GitHub Commit / Changelog to LinkedIn & X Thread Builder',
    category: 'Growth',
    modelHint: 'Creative Technical LLM · Temp 0.6',
    bestFor: 'Turning weekly engineering milestones into authentic build-in-public posts that attract freelance clients.',
    inputFormat: 'PR titles, technical bottleneck solved, before/after metric.',
    outputFormat: '1 LinkedIn breakdown + 1 concise X post with zero cringe hashtags.',
    systemPrompt: `You write authentic technical build-in-public posts for software engineers.
Rules:
1. Lead with a concrete engineering problem + real number (e.g., "Cut query latency from 1.4s to 38ms").
2. Explain the root cause and fix in 3 crisp bullet points.
3. Zero generic motivational cliches, zero rocket emojis, maximum 2 relevant tags.
4. End with one genuine question inviting peer engineers to share their approach.`,
    exampleOutput: `Cut our React list render time from 410ms to 14ms without rewriting the backend.

The culprit: rendering 800 nested glass cards simultaneously on every filter keystroke.

What actually fixed it:
• Swapped full DOM list for windowed virtualization (only 9 visible rows mounted)
• Moved filter state into a granular Zustand selector
• Memoized row height calculations

How are you handling large interactive tables in React this year?`,
  },
  {
    id: 'meeting-action-agent',
    name: 'Meeting-to-Tasks Agent',
    role: 'Call Transcript to SOW Milestones & Notion Tasks',
    category: 'Productivity',
    modelHint: 'Long-Context LLM · Temp 0.2',
    bestFor: 'Transforming client discovery call notes into clear deliverables, owners, and due dates.',
    inputFormat: 'Raw call transcript or bullet notes.',
    outputFormat: 'JSON { decisions[], deliverables[], risks[], followUpEmail }',
    systemPrompt: `You are a technical project manager processing a client discovery call transcript.
Extract:
1. Decisions Confirmed (scope locked in).
2. Action Items with owner ("Client" or "Developer") and target deadline.
3. Scope Creep Risks (requests mentioned casually that are outside initial budget).
4. A 5-line recap email ready to send within 10 minutes of hanging up.`,
    exampleOutput: `{
  "decisions": ["Phase 1 ships with Email/Password + Google OAuth only"],
  "deliverables": [{"owner": "Client", "task": "Share Figma brand palette", "due": "Wednesday"}, {"owner": "Developer", "task": "Deploy staging preview", "due": "Friday"}],
  "risks": ["Client mentioned mobile push notifications — quote separately as Phase 2."]
}`,
  },
];

export const WEBHOOK_PRESETS: WebhookPreset[] = [
  {
    id: 'zapier',
    platform: 'Zapier Webhooks',
    endpoint: 'https://hooks.zapier.com/hooks/catch/1849201/3x9kp2q/',
    method: 'POST',
    authHeader: 'X-Zapier-Signature: sha256=8f91e0c4d21a...',
    description: 'Catch Hook trigger connecting your web app or Stripe events to 6,000+ no-code SaaS actions.',
    sampleBody: JSON.stringify(
      {
        event: 'freelance_lead_submitted',
        client_name: 'Riya Sharma',
        email: 'riya@fintechlab.in',
        project_type: 'Full-Stack Dashboard',
        budget_usd: 2800,
        source: 'portfolio_form',
      },
      null,
      2
    ),
    responseCode: 200,
    responseBody: JSON.stringify(
      {
        status: 'success',
        attempt: '0195a8f1-4c2b-7b02-9a3f-1129c01e4a77',
        id: 'zap_req_994102',
        request_id: '0195a8f1-4c2b-7b02-9a3f-1129c01e4a77',
      },
      null,
      2
    ),
    integrationSnippet: `// Trigger Zapier Catch Hook from Node.js / Frontend Fetch
await fetch("https://hooks.zapier.com/hooks/catch/1849201/3x9kp2q/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: "freelance_lead_submitted",
    client_name: "Riya Sharma",
    budget_usd: 2800
  })
});`,
  },
  {
    id: 'make',
    platform: 'Make (Integromat)',
    endpoint: 'https://hook.eu2.make.com/7a9k2m4p8q1v5w3x9z0b6c4d',
    method: 'POST',
    authHeader: 'X-Make-Apikey: mk_live_91a82e0f...',
    description: 'Visual router scenario webhook ideal for multi-branch error handling, iterators, and array aggregators.',
    sampleBody: JSON.stringify(
      {
        trigger: 'invoice_paid',
        invoice_id: 'INV-2025-042',
        amount: 1450,
        currency: 'USD',
        client_slack: '@sarah_ops',
        generate_receipt: true,
      },
      null,
      2
    ),
    responseCode: 200,
    responseBody: 'Accepted',
    integrationSnippet: `// Trigger Make.com Scenario Webhook with API Key Header
await fetch("https://hook.eu2.make.com/7a9k2m4p8q1v5w3x9z0b6c4d", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Make-Apikey": process.env.MAKE_WEBHOOK_KEY
  },
  body: JSON.stringify({ invoice_id: "INV-2025-042", amount: 1450 })
});`,
  },
  {
    id: 'n8n',
    platform: 'n8n (Self-Hosted)',
    endpoint: 'https://automation.myserver.dev/webhook/job-alert-pipeline',
    method: 'POST',
    authHeader: 'Authorization: Bearer n8n_wh_secret_7741',
    description: 'Open-source, self-hosted workflow automation with zero per-task tax and native JavaScript/Python Code nodes.',
    sampleBody: JSON.stringify(
      {
        source: 'remoteok_scraper',
        role: 'Junior Security Engineer',
        salary_range: '$65k - $85k',
        tags: ['appsec', 'python', 'owasp'],
        apply_url: 'https://boards.example.com/sec-88',
      },
      null,
      2
    ),
    responseCode: 200,
    responseBody: JSON.stringify(
      {
        workflowId: 'wf_job_sniper_04',
        executionId: 'exec_55201',
        message: 'Workflow was started',
        routedTo: ['Telegram Bot', 'Notion Job Tracker'],
      },
      null,
      2
    ),
    integrationSnippet: `// Self-hosted n8n Webhook Call with Bearer Auth
const res = await fetch("https://automation.myserver.dev/webhook/job-alert-pipeline", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + process.env.N8N_WEBHOOK_TOKEN
  },
  body: JSON.stringify({ role: "Junior Security Engineer", tags: ["appsec", "python"] })
});`,
  },
  {
    id: 'python',
    platform: 'Python FastAPI Worker',
    endpoint: 'https://api.mybot.local/v1/webhooks/agent-run',
    method: 'POST',
    authHeader: 'X-HMAC-SHA256: 4b7c2d9f810e6a3b5e1c9d2a...',
    description: 'Direct Python webhook consumer using FastAPI + HMAC signature verification for custom local or VPS agents.',
    sampleBody: JSON.stringify(
      {
        job_id: 'audit_9081',
        repo_url: 'https://github.com/org/checkout-api',
        commit_sha: 'a81f4c2',
        checks: ['dependency_cve', 'secret_scan', 'pr_summary'],
      },
      null,
      2
    ),
    responseCode: 200,
    responseBody: JSON.stringify(
      {
        ok: true,
        queued_job: 'audit_9081',
        hmac_verified: true,
        estimated_seconds: 12,
      },
      null,
      2
    ),
    integrationSnippet: `# Python requests client with HMAC-SHA256 signature
import hmac, hashlib, json, requests

payload = json.dumps({"job_id": "audit_9081", "commit_sha": "a81f4c2"}).encode()
sig = hmac.new(b"your_shared_secret", payload, hashlib.sha256).hexdigest()

r = requests.post(
    "https://api.mybot.local/v1/webhooks/agent-run",
    data=payload,
    headers={"Content-Type": "application/json", "X-HMAC-SHA256": sig},
    timeout=10,
)
print(r.status_code, r.json())`,
  },
];

export const AUTOMATION_BLUEPRINTS: AutomationBlueprint[] = [
  {
    id: 'bp-freelance-autoreply',
    title: 'Auto-Reply to Freelance Clients & CRM Sync',
    category: 'Freelancing',
    difficulty: 'Beginner',
    stack: 'Gmail + AI Classifier + Google Sheets + Telegram',
    timeSaved: '6 hrs/week',
    summary: 'Watches inbound Gmail inquiries, extracts budget & deadline with AI, logs qualified leads to Sheets, and pings your phone with a ready-to-send reply.',
    steps: [
      'Trigger on Gmail label "Client-Lead" or subject keywords (project, quote, hire).',
      'Pass email body to AI Node with the Email Reply Bot prompt to extract budget & draft response.',
      'Filter out spam or under-budget leads; create a Gmail Draft for human 1-click approval.',
      'Append lead details to Google Sheets CRM and push an instant Telegram notification.',
    ],
    nodes: DEFAULT_CANVAS_NODES,
    edges: DEFAULT_CANVAS_EDGES,
  },
  {
    id: 'bp-job-sniper',
    title: 'Scrape Job Boards -> Filtered Telegram Alerts',
    category: 'Job Hunt',
    difficulty: 'Intermediate',
    stack: 'CRON + RSS/Playwright + Dedupe Filter + Telegram',
    timeSaved: '10 hrs/week',
    summary: 'Polls remote engineering & AppSec job feeds every 30 minutes, filters by stack & salary floor, removes already-seen jobs, and fires instant Telegram alerts.',
    steps: [
      'CRON scheduler triggers every 30 minutes.',
      'Fetch JSON/RSS feeds from RemoteOK, WeWorkRemotely, and YC Work at a Startup.',
      'AI Scorer grades match quality (0-100) against your skills (React, Node, AppSec).',
      'Send only 85+ matches to Telegram with direct apply URL and auto-tailored pitch line.',
    ],
    nodes: [
      { id: 'j1', kind: 'trigger', title: 'CRON Every 30m', subtitle: 'Scheduler', provider: 'n8n', x: 40, y: 120, samplePayload: { tick: '09:30 IST' } },
      { id: 'j2', kind: 'action', title: 'Fetch Job Feeds', subtitle: 'RemoteOK + YC RSS', provider: 'HTTP', x: 310, y: 120, samplePayload: { jobsFetched: 42 } },
      { id: 'j3', kind: 'ai', title: 'AI Resume Matcher', subtitle: 'Score >= 85 + Pitch', provider: 'LLM Node', x: 580, y: 120, samplePayload: { matchedJobs: 3, topScore: 94 } },
      { id: 'j4', kind: 'action', title: 'Telegram Job Sniper', subtitle: 'Instant Apply Card', provider: 'Telegram', x: 860, y: 120, samplePayload: { alertsSent: 3 } },
    ],
    edges: [
      { id: 'je1', from: 'j1', to: 'j2', label: 'trigger' },
      { id: 'je2', from: 'j2', to: 'j3', label: 'raw_jobs' },
      { id: 'je3', from: 'j3', to: 'j4', label: 'top_matches' },
    ],
  },
  {
    id: 'bp-pr-security-bot',
    title: 'GitHub PR Security & Code Review Gate',
    category: 'DevOps',
    difficulty: 'Intermediate',
    stack: 'GitHub Webhook + Diff Fetcher + AI Auditor + PR Comment',
    timeSaved: '4 hrs/week',
    summary: 'Automatically audits every new Pull Request for XSS, SQLi, secrets, and memory leaks, posting inline review comments within 20 seconds.',
    steps: [
      'Listen to GitHub pull_request.opened / synchronize webhook.',
      'Download changed file diffs excluding lockfiles and build artifacts.',
      'Run Code Reviewer Bot prompt to detect OWASP flaws and React hook leaks.',
      'Post formatted review comment back to the PR and alert #security on critical issues.',
    ],
    nodes: [
      { id: 'p1', kind: 'trigger', title: 'GitHub PR Opened', subtitle: 'Webhook Event', provider: 'GitHub', x: 40, y: 120, samplePayload: { pr: 218, branch: 'feat/auth' } },
      { id: 'p2', kind: 'ai', title: 'AI Security Auditor', subtitle: 'OWASP + Perf Check', provider: 'LLM Node', x: 330, y: 120, samplePayload: { critical: 1, high: 0 } },
      { id: 'p3', kind: 'logic', title: 'Severity Gate', subtitle: 'critical > 0?', provider: 'Router', x: 610, y: 120, samplePayload: { route: 'block_merge' } },
      { id: 'p4', kind: 'action', title: 'Post PR Comment', subtitle: 'GitHub API', provider: 'GitHub', x: 880, y: 60, samplePayload: { commented: true } },
      { id: 'p5', kind: 'action', title: 'Discord Sec Alert', subtitle: '#appsec-alerts', provider: 'Discord', x: 880, y: 195, samplePayload: { notified: true } },
    ],
    edges: [
      { id: 'pe1', from: 'p1', to: 'p2', label: 'git_diff' },
      { id: 'pe2', from: 'p2', to: 'p3', label: 'findings' },
      { id: 'pe3', from: 'p3', to: 'p4', label: 'always' },
      { id: 'pe4', from: 'p3', to: 'p5', label: 'critical' },
    ],
  },
  {
    id: 'bp-invoice-chaser',
    title: 'Automated Invoice Payment Reminder Engine',
    category: 'Freelancing',
    difficulty: 'Beginner',
    stack: 'CRON + Sheets Tracker + Polite Email Escalator',
    timeSaved: '3 hrs/week',
    summary: 'Checks unpaid freelance invoices daily and dispatches polite, escalating reminders at Day 0, Day +3, and Day +7.',
    steps: [
      'Daily 10 AM CRON reads your Invoice Sheet where Status == "Unpaid".',
      'Calculate overdue days and branch into gentle (Day 3) vs firm (Day 7) templates.',
      'Send email with payment link (Wise/Payoneer/UPI) and log reminder timestamp.',
    ],
    nodes: [
      { id: 'i1', kind: 'trigger', title: 'Daily 10 AM CRON', subtitle: 'Scheduler', provider: 'Make', x: 50, y: 120, samplePayload: { date: '2025-05-12' } },
      { id: 'i2', kind: 'action', title: 'Read Unpaid Rows', subtitle: 'Google Sheets', provider: 'Sheets', x: 330, y: 120, samplePayload: { overdueCount: 2 } },
      { id: 'i3', kind: 'logic', title: 'Overdue Tier Router', subtitle: '3d / 7d / 14d', provider: 'Router', x: 600, y: 120, samplePayload: { tier: 'day_7_polite' } },
      { id: 'i4', kind: 'action', title: 'Send Payment Link', subtitle: 'Gmail SMTP', provider: 'Gmail', x: 870, y: 120, samplePayload: { sentTo: 'billing@client.co' } },
    ],
    edges: [
      { id: 'ie1', from: 'i1', to: 'i2', label: 'query' },
      { id: 'ie2', from: 'i2', to: 'i3', label: 'invoices' },
      { id: 'ie3', from: 'i3', to: 'i4', label: 'remind' },
    ],
  },
  {
    id: 'bp-bounty-recon',
    title: 'Authorized Bug Bounty Scope Change Monitor',
    category: 'Security',
    difficulty: 'Advanced',
    stack: 'CRON + Scope Diff + Subdomain Watch + Telegram',
    timeSaved: '8 hrs/week',
    summary: 'Monitors authorized HackerOne/Bugcrowd program scope JSONs for newly added in-scope domains so you are first to test new assets legally.',
    steps: [
      'Poll public program policy/scope endpoints every 2 hours.',
      'Diff current in-scope asset list against previous snapshot stored in SQLite/JSON.',
      'When a brand-new asset is added, alert Telegram with scope rules & bounty table.',
    ],
    nodes: [
      { id: 'b1', kind: 'trigger', title: 'Every 2h CRON', subtitle: 'Scope Watcher', provider: 'Python', x: 50, y: 120, samplePayload: { programs: 14 } },
      { id: 'b2', kind: 'logic', title: 'JSON Scope Diff', subtitle: 'Detect New Assets', provider: 'Code', x: 340, y: 120, samplePayload: { newAssets: ['beta-api.target.com'] } },
      { id: 'b3', kind: 'action', title: 'Log to Notion Recon', subtitle: 'Target Tracker', provider: 'Notion', x: 640, y: 65, samplePayload: { created: true } },
      { id: 'b4', kind: 'action', title: 'Telegram Priority Alert', subtitle: 'New In-Scope Asset', provider: 'Telegram', x: 640, y: 190, samplePayload: { sent: true } },
    ],
    edges: [
      { id: 'be1', from: 'b1', to: 'b2', label: 'scope_json' },
      { id: 'be2', from: 'b2', to: 'b3', label: 'new_asset' },
      { id: 'be3', from: 'b2', to: 'b4', label: 'alert' },
    ],
  },
  {
    id: 'bp-uptime-incident',
    title: 'Zero-Cost API Uptime & Auto-Recovery Watchdog',
    category: 'DevOps',
    difficulty: 'Beginner',
    stack: 'CRON 5m + Health Check + Status Filter + Discord/SMS',
    timeSaved: '5 hrs/week',
    summary: 'Pings your production endpoints every 5 minutes, verifies HTTP 200 + latency < 1.5s, and fires incident alerts with error payload on downtime.',
    steps: [
      'Ping /api/health every 5 minutes from n8n or GitHub Actions.',
      'Check status !== 200 or latency > 1500ms.',
      'Retry once after 10 seconds to prevent false alarms, then fire Discord/Telegram P1 alert.',
    ],
    nodes: [
      { id: 'u1', kind: 'trigger', title: '5-Min Health Ping', subtitle: 'GET /api/health', provider: 'HTTP', x: 50, y: 120, samplePayload: { status: 502, latencyMs: 3100 } },
      { id: 'u2', kind: 'logic', title: 'Double-Check Retry', subtitle: 'Confirm Outage', provider: 'Router', x: 350, y: 120, samplePayload: { confirmedDown: true } },
      { id: 'u3', kind: 'action', title: 'Fire P1 Incident Alert', subtitle: 'Discord + Telegram', provider: 'Discord', x: 660, y: 120, samplePayload: { incidentId: 'INC-409' } },
    ],
    edges: [
      { id: 'ue1', from: 'u1', to: 'u2', label: 'non_200' },
      { id: 'ue2', from: 'u2', to: 'u3', label: 'confirmed' },
    ],
  },
  {
    id: 'bp-youtube-notes',
    title: 'YouTube Tech Talk -> Structured Notion Notes',
    category: 'Content',
    difficulty: 'Beginner',
    stack: 'Webhook + Transcript Extractor + AI Summarizer + Notion',
    timeSaved: '4 hrs/week',
    summary: 'Paste any 1-hour conference talk URL to automatically extract key architecture patterns, timestamps, and code concepts into your Notion library.',
    steps: [
      'Trigger via Telegram bot command /notes <youtube_url>.',
      'Fetch caption transcript and chunk into sections.',
      'AI extracts architecture takeaways, pitfalls, and key timestamps.',
      'Save formatted page inside your Notion Knowledge Base.',
    ],
    nodes: [
      { id: 'y1', kind: 'trigger', title: 'Telegram /notes Link', subtitle: 'Bot Webhook', provider: 'Telegram', x: 40, y: 120, samplePayload: { url: 'youtu.be/sys-design-01' } },
      { id: 'y2', kind: 'ai', title: 'AI Technical Digest', subtitle: 'Key Takeaways + Code', provider: 'LLM Node', x: 350, y: 120, samplePayload: { bullets: 8, tags: ['Redis', 'Kafka'] } },
      { id: 'y3', kind: 'action', title: 'Create Notion Note', subtitle: 'Knowledge Vault', provider: 'Notion', x: 670, y: 120, samplePayload: { pageUrl: 'notion.so/note-82' } },
    ],
    edges: [
      { id: 'ye1', from: 'y1', to: 'y2', label: 'transcript' },
      { id: 'ye2', from: 'y2', to: 'y3', label: 'markdown' },
    ],
  },
  {
    id: 'bp-client-onboarding',
    title: '1-Click Freelance Client Onboarding Pipeline',
    category: 'Freelancing',
    difficulty: 'Intermediate',
    stack: 'Stripe Paid Webhook + Drive Folder + Notion Portal + Welcome Email',
    timeSaved: '3 hrs/client',
    summary: 'The instant a client pays their deposit invoice, auto-create their Drive asset folder, Notion project tracker, and send a polished kickoff email.',
    steps: [
      'Trigger when Stripe/Wise deposit payment webhook confirms settlement.',
      'Create shared Google Drive folder + Notion milestone dashboard from template.',
      'Send kickoff email containing portal link, onboarding form, and Slack invite.',
    ],
    nodes: [
      { id: 'c1', kind: 'trigger', title: 'Deposit Paid Webhook', subtitle: 'Stripe / Wise', provider: 'Webhook', x: 40, y: 120, samplePayload: { client: 'NovaTech', deposit: '$1,500' } },
      { id: 'c2', kind: 'action', title: 'Provision Notion Portal', subtitle: 'Clone Template', provider: 'Notion', x: 340, y: 65, samplePayload: { portalReady: true } },
      { id: 'c3', kind: 'action', title: 'Send Kickoff Email', subtitle: 'Links + Timeline', provider: 'Gmail', x: 340, y: 195, samplePayload: { sent: true } },
    ],
    edges: [
      { id: 'ce1', from: 'c1', to: 'c2', label: 'provision' },
      { id: 'ce2', from: 'c1', to: 'c3', label: 'welcome' },
    ],
  },
  {
    id: 'bp-github-linkedin',
    title: 'Weekly GitHub Commits -> Build-in-Public Drafts',
    category: 'Content',
    difficulty: 'Beginner',
    stack: 'Weekly CRON + GitHub Commits API + Content Agent + Notion',
    timeSaved: '2 hrs/week',
    summary: 'Every Friday at 6 PM, pulls your merged PRs, synthesizes 1 concrete engineering story, and drops a ready-to-edit LinkedIn draft in Notion.',
    steps: [
      'Friday CRON fetches your last 7 days of merged GitHub PR titles & descriptions.',
      'AI Content Repurposer selects the most interesting technical win.',
      'Saves a concise, non-cringe LinkedIn draft into your Notion Content Queue.',
    ],
    nodes: [
      { id: 'g1', kind: 'trigger', title: 'Friday 6 PM CRON', subtitle: 'Weekly Digest', provider: 'Scheduler', x: 45, y: 120, samplePayload: { commits: 19 } },
      { id: 'g2', kind: 'ai', title: 'Build-in-Public Writer', subtitle: 'Technical Story Draft', provider: 'LLM Node', x: 360, y: 120, samplePayload: { wordCount: 145 } },
      { id: 'g3', kind: 'action', title: 'Save Draft to Notion', subtitle: 'Content Calendar', provider: 'Notion', x: 680, y: 120, samplePayload: { status: 'Ready for Review' } },
    ],
    edges: [
      { id: 'ge1', from: 'g1', to: 'g2', label: 'pr_log' },
      { id: 'ge2', from: 'g2', to: 'g3', label: 'draft' },
    ],
  },
  {
    id: 'bp-cve-digest',
    title: 'Daily CVE & Dependency Security Digest',
    category: 'Security',
    difficulty: 'Intermediate',
    stack: 'CRON + NVD/GitHub Advisory Feed + Stack Filter + Telegram',
    timeSaved: '4 hrs/week',
    summary: 'Filters daily NVD & GitHub Security Advisories exclusively for your tech stack (Node, React, Postgres, Nginx) with CVSS >= 7.5.',
    steps: [
      'Fetch last 24h GitHub Advisory GraphQL/REST feed.',
      'Filter where ecosystem in [npm, pip] and CVSS score >= 7.5.',
      'AI generates 2-line upgrade command & impact summary; push to Telegram.',
    ],
    nodes: [
      { id: 'v1', kind: 'trigger', title: 'Daily 8 AM Advisory Pull', subtitle: 'NVD + GHSA', provider: 'HTTP', x: 40, y: 120, samplePayload: { advisories: 31 } },
      { id: 'v2', kind: 'logic', title: 'CVSS >= 7.5 & Stack Filter', subtitle: 'npm / pip / docker', provider: 'Router', x: 350, y: 120, samplePayload: { matched: 2 } },
      { id: 'v3', kind: 'action', title: 'Send Patch Brief', subtitle: 'Telegram Security', provider: 'Telegram', x: 670, y: 120, samplePayload: { delivered: true } },
    ],
    edges: [
      { id: 've1', from: 'v1', to: 'v2', label: 'raw_cves' },
      { id: 've2', from: 'v2', to: 'v3', label: 'high_cvss' },
    ],
  },
  {
    id: 'bp-abandoned-cart',
    title: 'SaaS Failed Payment Recovery Sequence',
    category: 'E-Commerce',
    difficulty: 'Intermediate',
    stack: 'Stripe invoice.payment_failed + Wait + Smart Retry Email',
    timeSaved: 'Recovers 15-25% churn',
    summary: 'Catches failed subscription renewals, waits 2 hours, and sends a friendly card-update link before revoking user access.',
    steps: [
      'Listen to Stripe invoice.payment_failed webhook.',
      'Verify attempt_count <= 2 and fetch customer billing portal URL.',
      'Send crisp plain-text email with 1-click card update button and log in CRM.',
    ],
    nodes: [
      { id: 's1', kind: 'trigger', title: 'Payment Failed Hook', subtitle: 'Stripe Event', provider: 'Stripe', x: 40, y: 120, samplePayload: { customer: 'cus_91a', amount: '$49' } },
      { id: 's2', kind: 'logic', title: 'Attempt <= 2 Check', subtitle: 'Grace Window', provider: 'Router', x: 350, y: 120, samplePayload: { sendRecovery: true } },
      { id: 's3', kind: 'action', title: 'Send Card Update Link', subtitle: 'Transactional Email', provider: 'Resend', x: 670, y: 120, samplePayload: { delivered: true } },
    ],
    edges: [
      { id: 'se1', from: 's1', to: 's2', label: 'event' },
      { id: 'se2', from: 's2', to: 's3', label: 'recover' },
    ],
  },
  {
    id: 'bp-support-triage',
    title: 'Discord Support Thread -> GitHub Bug Issue',
    category: 'DevOps',
    difficulty: 'Intermediate',
    stack: 'Discord Reaction Trigger + AI Bug Triage + GitHub Issue API',
    timeSaved: '5 hrs/week',
    summary: 'Reacting with a bug icon in Discord sends the thread through the Bug Triage Agent and opens a structured GitHub Issue automatically.',
    steps: [
      'Trigger when maintainer marks a Discord support thread as bug.',
      'Aggregate last 10 messages and pass to Bug Triage Agent.',
      'Open labeled GitHub Issue and reply to the Discord thread with the tracking URL.',
    ],
    nodes: [
      { id: 'd1', kind: 'trigger', title: 'Discord Bug Reaction', subtitle: 'Bot Event', provider: 'Discord', x: 40, y: 120, samplePayload: { threadId: 'th_9921', msgs: 8 } },
      { id: 'd2', kind: 'ai', title: 'AI Bug Triage Agent', subtitle: 'Extract Repro Steps', provider: 'LLM Node', x: 350, y: 120, samplePayload: { severity: 'P2', title: 'PDF cutoff' } },
      { id: 'd3', kind: 'action', title: 'Create GitHub Issue', subtitle: 'Auto-Labeled', provider: 'GitHub', x: 670, y: 120, samplePayload: { issueNumber: 407 } },
    ],
    edges: [
      { id: 'de1', from: 'd1', to: 'd2', label: 'thread' },
      { id: 'de2', from: 'd2', to: 'd3', label: 'issue_json' },
    ],
  },
];
