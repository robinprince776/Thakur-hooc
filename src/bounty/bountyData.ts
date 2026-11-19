export interface DisclosureStep {
  step: number;
  title: string;
  platform: string;
  duration: string;
  summary: string;
  checklist: string[];
}

export interface ReportCategoryTemplate {
  id: string;
  label: string;
  owaspRef: string;
  defaultSeverity: 'Medium' | 'High' | 'Critical';
  impactSummary: string;
  reproTemplate: string[];
  remediationGuide: string;
}

export interface FreelanceCheckItem {
  id: string;
  platform: 'Upwork' | 'Fiverr' | 'Both';
  title: string;
  detail: string;
}

export interface RateBenchmark {
  role: string;
  indiaHourlyUsd: string;
  usHourlyUsd: string;
  fixedMvpUsd: string;
  tip: string;
}

export interface AtsCheckItem {
  id: string;
  section: 'Format' | 'Keywords' | 'Impact' | 'Links';
  rule: string;
  whyItMatters: string;
}

export interface PaymentRail {
  id: string;
  name: string;
  bestFor: string;
  fees: string;
  settlementTime: string;
  fircSupport: string;
  notes: string;
}

export const BOUNTY_ROADMAP: DisclosureStep[] = [
  {
    step: 1,
    title: 'Understand Program Policy & Safe Harbor',
    platform: 'HackerOne & Bugcrowd',
    duration: 'Week 1',
    summary:
      'Always read the policy page before testing anything. Verify exact in-scope domains, excluded categories, rate limits, and Safe Harbor legal protections.',
    checklist: [
      'Confirm written authorization via a public VDP or Bug Bounty policy',
      'Check out-of-scope assets and avoid third-party hosted services',
      'Use only your own test accounts — never access another user’s data',
    ],
  },
  {
    step: 2,
    title: 'Pick Beginner-Friendly VDP Programs First',
    platform: 'Vulnerability Disclosure Programs',
    duration: 'Weeks 2-4',
    summary:
      'Start with Vulnerability Disclosure Programs (VDPs) that award reputation points and hall-of-fame credits before competing on high-traffic paid programs.',
    checklist: [
      'Target large web apps with broad in-scope product features',
      'Document every finding clearly to build your platform Signal score',
      'Aim for 3 valid triaged reports to unlock private program invites',
    ],
  },
  {
    step: 3,
    title: 'Specialize in One Application Quality Class',
    platform: 'OWASP Web & API Standards',
    duration: 'Months 2-3',
    summary:
      'Top researchers focus deeply on one area—such as broken access control, business logic edge cases, or API authorization—rather than running noisy scanners.',
    checklist: [
      'Study OWASP API Security Top 10 & Web Application Security Verification Standard',
      'Map application roles (guest, member, editor, admin) and verify permission boundaries',
      'Review GraphQL / REST schema consistency and input validation behavior',
    ],
  },
  {
    step: 4,
    title: 'Write Clear, Reproducible Security Reports',
    platform: 'Triage Team Standards',
    duration: 'Ongoing',
    summary:
      'Triagers review dozens of submissions daily. A concise report with clear business impact, minimal test evidence, and a concrete fix gets rewarded faster.',
    checklist: [
      'State exact affected endpoint, user role, and expected vs actual behavior',
      'Attach clean screenshots or redacted HTTP request/response logs',
      'Include a practical code-level remediation recommendation',
    ],
  },
  {
    step: 5,
    title: 'Professional Communication & Retesting',
    platform: 'Security Engineering Collaboration',
    duration: 'Ongoing',
    summary:
      'Treat triage engineers as teammates. Respond politely to severity questions, respect disclosure timelines, and participate in paid retest invitations.',
    checklist: [
      'Never publicly disclose before coordinated remediation and permission',
      'Use CVSS v3.1 metrics objectively when discussing severity',
      'Accept retest requests quickly to earn consistent bonus payouts',
    ],
  },
  {
    step: 6,
    title: 'Scale Into Private Programs & Consulting',
    platform: 'Private Invites & AppSec Freelancing',
    duration: 'Month 6+',
    summary:
      'High signal and clean write-ups unlock private bounty programs with less competition and strengthen your portfolio for AppSec engineering roles.',
    checklist: [
      'Publish authorized disclosed write-ups on your personal blog or GitHub',
      'Track metrics: Signal score, valid report ratio, and response SLAs',
      'Combine bounty experience with freelance secure code review services',
    ],
  },
];

export const REPORT_TEMPLATES: ReportCategoryTemplate[] = [
  {
    id: 'access-control',
    label: 'Broken Object Level Authorization (IDOR)',
    owaspRef: 'OWASP A01:2021 · Broken Access Control',
    defaultSeverity: 'High',
    impactSummary:
      'An authenticated user can read or modify resource records belonging to another account by substituting an object identifier without server-side ownership verification.',
    reproTemplate: [
      'Create two personal test accounts (Account A and Account B) on the authorized staging/in-scope environment.',
      'In Account A, create a private resource and note its assigned resource identifier.',
      'Sign in as Account B and request the same resource endpoint referencing Account A’s identifier.',
      'Observe that the API returns HTTP 200 with Account A’s resource fields instead of HTTP 403 Forbidden.',
    ],
    remediationGuide:
      'Enforce server-side ownership checks on every object read/write query (e.g., WHERE id = $1 AND owner_id = $authenticatedUserId) and use non-sequential UUIDs as defense-in-depth.',
  },
  {
    id: 'output-encoding',
    label: 'Improper Output Encoding (Reflected / Stored UI)',
    owaspRef: 'OWASP A03:2021 · Injection / Output Handling',
    defaultSeverity: 'Medium',
    impactSummary:
      'User-supplied input is rendered into the document without context-appropriate HTML encoding, which could allow untrusted markup to execute in another user’s browser session.',
    reproTemplate: [
      'Navigate to the affected profile or search form using your own test account.',
      'Submit a benign HTML formatting marker (such as a harmless bold tag) in the vulnerable input field.',
      'Reload the viewing page and inspect the rendered DOM in browser DevTools.',
      'Observe that raw HTML tags are interpreted as markup rather than escaped plain text.',
    ],
    remediationGuide:
      'Use framework auto-escaping (React JSX text nodes, parameterized templates), sanitize rich text with a strict allowlist library (e.g., DOMPurify), and deploy a restrictive Content-Security-Policy header.',
  },
  {
    id: 'query-parameterization',
    label: 'Unparameterized Database Query Handling',
    owaspRef: 'OWASP A03:2021 · Data Layer Validation',
    defaultSeverity: 'Critical',
    impactSummary:
      'Dynamic string concatenation in backend query filters allows untrusted input to alter query semantics or reveal internal database error details.',
    reproTemplate: [
      'Locate the filtering or sorting parameter on the authorized in-scope endpoint.',
      'Send a malformed character input using a test account and observe the HTTP response.',
      'Confirm that the server returns a verbose database syntax error or unexpected result count rather than rejecting invalid types.',
    ],
    remediationGuide:
      'Replace string-concatenated queries with prepared statements / parameterized ORM queries, validate sort columns against an explicit allowlist, and disable verbose database error messages in production.',
  },
  {
    id: 'business-logic',
    label: 'Business Logic & Workflow Validation Flaw',
    owaspRef: 'OWASP A04:2021 · Insecure Design',
    defaultSeverity: 'High',
    impactSummary:
      'Missing server-side state validation permits completing a multi-step checkout, coupon, or quota workflow outside its intended limits.',
    reproTemplate: [
      'Initiate the multi-step workflow (e.g., promo redemption or plan upgrade) on a test account.',
      'Verify whether the final confirmation API independently validates quantities, prices, and prior step states.',
      'Observe that submitting a negative quantity or replaying the confirmation step bypasses client-side restrictions.',
    ],
    remediationGuide:
      'Enforce all pricing, quota, and state-transition checks authoritatively on the server inside an atomic database transaction with idempotency keys.',
  },
  {
    id: 'session-auth',
    label: 'Session Management & Token Lifecycle Issue',
    owaspRef: 'OWASP A07:2021 · Identification & Authentication',
    defaultSeverity: 'Medium',
    impactSummary:
      'Active session tokens remain valid after password reset or explicit sign-out, extending the exposure window if a device is shared or lost.',
    reproTemplate: [
      'Sign in to a test account across two browser sessions and note the active session token.',
      'Trigger a password change or "Sign out of all devices" from Session 1.',
      'Attempt to call an authenticated API endpoint from Session 2.',
      'Observe that Session 2 continues receiving authenticated responses.',
    ],
    remediationGuide:
      'Rotate session identifiers on privilege changes, maintain a server-side token revocation list or short-lived access tokens paired with rotating refresh tokens, and set HttpOnly, Secure, SameSite cookie flags.',
  },
  {
    id: 'data-exposure',
    label: 'Excessive Data Exposure in API Response',
    owaspRef: 'OWASP API3:2023 · Property Level Authorization',
    defaultSeverity: 'Medium',
    impactSummary:
      'An API endpoint serializes full internal database models to the client, returning sensitive metadata fields that are not displayed in the UI.',
    reproTemplate: [
      'Open browser DevTools Network tab while viewing a standard public or team directory page.',
      'Inspect the JSON payload returned by the backend profile endpoint.',
      'Observe internal fields (such as private email, internal flags, or account tokens) present in the raw JSON response.',
    ],
    remediationGuide:
      'Use explicit DTO / response serializers that project only the fields required by the client view, and add automated schema snapshot tests for public endpoints.',
  },
];

export const FREELANCE_CHECKLIST: FreelanceCheckItem[] = [
  {
    id: 'fc-1',
    platform: 'Upwork',
    title: 'Outcome-Driven Profile Headline (Not Just Stack Names)',
    detail:
      'Instead of "React & Node Developer", write "Full-Stack TypeScript Engineer | SaaS MVPs, Stripe Billing & Fast APIs".',
  },
  {
    id: 'fc-2',
    platform: 'Both',
    title: 'First 2 Lines Hook Client Pain Point',
    detail:
      'Upwork search previews only show the first ~180 characters. Lead with measurable client outcomes (speed, conversions, reliability).',
  },
  {
    id: 'fc-3',
    platform: 'Fiverr',
    title: '3-Tier Productized Gig Packages (Starter / Growth / Scale)',
    detail:
      'Package fixed deliverables cleanly: Bug Fix Audit ($95), Full Feature Module ($350), Production MVP Sprint ($1,200+).',
  },
  {
    id: 'fc-4',
    platform: 'Upwork',
    title: '3 Live Portfolio Case Studies with Metrics & Screenshots',
    detail:
      'Include architecture diagram, problem solved, live demo link, and concrete metrics (e.g., "Reduced load time by 62%").',
  },
  {
    id: 'fc-5',
    platform: 'Both',
    title: '60-Second Loom Video Introduction',
    detail:
      'Clear audio, friendly confidence, and a quick screen walkthrough of one real project doubles client reply rates.',
  },
  {
    id: 'fc-6',
    platform: 'Upwork',
    title: 'Proposal Rule: Reference 2 Specific Details from Job Post',
    detail:
      'Never send generic copy-paste walls of text. Start with a 2-sentence custom plan + 1 smart clarifying question.',
  },
  {
    id: 'fc-7',
    platform: 'Both',
    title: 'Clear Milestone Schedule & Scope Boundary Clause',
    detail:
      'Split projects into 30% kickoff, 40% staging preview, and 30% final handover to eliminate payment risk and scope creep.',
  },
];

export const RATE_BENCHMARKS: RateBenchmark[] = [
  {
    role: 'Frontend Engineer (React / Next.js / Tailwind)',
    indiaHourlyUsd: '$18 – $35 / hr',
    usHourlyUsd: '$65 – $120 / hr',
    fixedMvpUsd: '$1,200 – $3,500',
    tip: 'Charge by milestone value for dashboards & landing pages rather than low hourly rates.',
  },
  {
    role: 'Full-Stack SaaS Engineer (TS / Node / Postgres)',
    indiaHourlyUsd: '$25 – $50 / hr',
    usHourlyUsd: '$85 – $150 / hr',
    fixedMvpUsd: '$2,500 – $7,500',
    tip: 'Bundle Auth + Billing + Admin Dashboard as a 3-week fixed MVP sprint.',
  },
  {
    role: 'AI Automation & Workflow Specialist (n8n / Zapier / APIs)',
    indiaHourlyUsd: '$30 – $60 / hr',
    usHourlyUsd: '$90 – $160 / hr',
    fixedMvpUsd: '$800 – $3,000',
    tip: 'Anchor pricing to weekly hours saved for the client’s operations team.',
  },
  {
    role: 'AppSec Reviewer & Secure Code Consultant',
    indiaHourlyUsd: '$35 – $70 / hr',
    usHourlyUsd: '$110 – $200 / hr',
    fixedMvpUsd: '$1,500 – $5,000',
    tip: 'Deliver an executive PDF security audit + retest pass after the team patches issues.',
  },
];

export const ATS_CHECKLIST: AtsCheckItem[] = [
  {
    id: 'ats-1',
    section: 'Format',
    rule: 'Single-column layout, standard fonts (Inter / Calibri), zero tables or skill-bar graphics',
    whyItMatters:
      'Legacy ATS parsers scramble multi-column PDFs and ignore progress-bar graphics completely.',
  },
  {
    id: 'ats-2',
    section: 'Impact',
    rule: 'Use Action Verb + Tech Stack + Quantified Result (XYZ Formula) on every bullet',
    whyItMatters:
      'Example: "Engineered virtualized React dashboard with Zustand, cutting render latency from 410ms to 18ms for 12k records."',
  },
  {
    id: 'ats-3',
    section: 'Keywords',
    rule: 'Mirror exact technical terms from the Job Description naturally in Skills & Experience',
    whyItMatters:
      'Recruiters filter candidates by exact skill strings (TypeScript, PostgreSQL, REST APIs, OWASP, Docker).',
  },
  {
    id: 'ats-4',
    section: 'Links',
    rule: 'Include clickable GitHub, Live Demo, and LinkedIn URLs at the top header',
    whyItMatters:
      'Hiring managers spend under 15 seconds on first pass — one working demo link beats 10 buzzwords.',
  },
  {
    id: 'ats-5',
    section: 'Format',
    rule: 'Keep to 1 page for 0-5 years experience; export as selectable text PDF (never scanned image)',
    whyItMatters:
      'Clean 1-page resumes communicate prioritization and make technical interviews easier to steer.',
  },
];

export const PAYMENT_RAILS: PaymentRail[] = [
  {
    id: 'skydo',
    name: 'Skydo (India Export Specialists)',
    bestFor: 'Indian freelancers receiving $1,000+ USD/EUR/GBP wires from US/EU clients',
    fees: 'Flat $19 – $29 per wire · Zero FX markup (live mid-market rate)',
    settlementTime: '24 – 48 hours to Indian bank account',
    fircSupport: 'Instant automated FIRA / FIRC PDF for every payment (0 extra cost)',
    notes: 'Gives you local US ACH / UK / EU receiving account details so clients pay via free local transfer.',
  },
  {
    id: 'wise',
    name: 'Wise Business',
    bestFor: 'Small-to-mid recurring retainers ($200 – $3,000) across 40+ currencies',
    fees: '~0.6% – 1.2% transparent fee at mid-market exchange rate',
    settlementTime: 'Minutes to 24 hours via IMPS/NEFT',
    fircSupport: 'e-FIRC available via partner bank email request',
    notes: 'Widely trusted by US & European startups; fast setup and predictable fee calculator.',
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    bestFor: 'Direct marketplace payouts (Upwork, Fiverr, HackerOne, Bugcrowd)',
    fees: 'Up to 2% FX conversion fee on INR withdrawal',
    settlementTime: '1 – 3 business days',
    fircSupport: 'Downloadable FIRC / payment certificate inside dashboard',
    notes: 'Native integration with major freelance and bug bounty platforms makes it a reliable backup rail.',
  },
  {
    id: 'swift-firc',
    name: 'Direct Bank Wire + LUT / GST Compliance Note',
    bestFor: 'Enterprise contracts & Indian IT service exports (Section 44ADA awareness)',
    fees: 'Bank SWIFT fee ($20–$40) + FX spread (negotiate with RM)',
    settlementTime: '2 – 5 business days',
    fircSupport: 'Request e-FIRA from your bank branch using Purpose Code P0802 (Software Consultancy)',
    notes:
      'Educational overview only: Indian software exporters crossing GST threshold typically file a zero-rated LUT and retain FIRC certificates. Always consult a qualified Chartered Accountant.',
  },
];
