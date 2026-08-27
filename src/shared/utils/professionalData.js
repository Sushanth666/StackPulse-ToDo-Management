/**
 * Professional Enterprise Dataset for TaskFlow Pro
 * Maps raw JSONPlaceholder items to real-world engineering, product, and DevOps tasks.
 */

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Principal Systems Architect',
    department: 'Core Infrastructure',
    email: 'alex.morgan@enterprise.tech',
    phone: '+1 (415) 892-3101',
    company: 'Enterprise Cloud Systems',
    city: 'San Francisco, CA',
    avatarColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Staff DevOps Engineer',
    department: 'Cloud Reliability & SRE',
    email: 'sarah.chen@enterprise.tech',
    phone: '+1 (206) 555-0144',
    company: 'Enterprise Cloud Systems',
    city: 'Seattle, WA',
    avatarColor: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
  },
  {
    id: 3,
    name: 'Marcus Rodriguez',
    role: 'Lead Backend Engineer',
    department: 'Distributed Services',
    email: 'marcus.rodriguez@enterprise.tech',
    phone: '+1 (512) 555-0182',
    company: 'Enterprise Cloud Systems',
    city: 'Austin, TX',
    avatarColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    id: 4,
    name: 'Elena Rostova',
    role: 'Senior Frontend & UI Specialist',
    department: 'Web Applications',
    email: 'elena.rostova@enterprise.tech',
    phone: '+1 (212) 555-0193',
    company: 'Enterprise Cloud Systems',
    city: 'New York, NY',
    avatarColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'Director of Product Design',
    department: 'Product Experience & UX',
    email: 'david.kim@enterprise.tech',
    phone: '+1 (650) 555-0118',
    company: 'Enterprise Cloud Systems',
    city: 'Palo Alto, CA',
    avatarColor: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  },
  {
    id: 6,
    name: 'Priya Patel',
    role: 'Lead Data Architect',
    department: 'Data Platform & Analytics',
    email: 'priya.patel@enterprise.tech',
    phone: '+1 (617) 555-0177',
    company: 'Enterprise Cloud Systems',
    city: 'Boston, MA',
    avatarColor: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  {
    id: 7,
    name: 'James Wilson',
    role: 'Principal Security Specialist',
    department: 'Cybersecurity & Compliance',
    email: 'james.wilson@enterprise.tech',
    phone: '+1 (703) 555-0165',
    company: 'Enterprise Cloud Systems',
    city: 'Washington, DC',
    avatarColor: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  },
  {
    id: 8,
    name: 'Amina Diallo',
    role: 'QA Automation Lead',
    department: 'Quality Engineering',
    email: 'amina.diallo@enterprise.tech',
    phone: '+1 (312) 555-0155',
    company: 'Enterprise Cloud Systems',
    city: 'Chicago, IL',
    avatarColor: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
  },
  {
    id: 9,
    name: 'Lucas Vance',
    role: 'Senior Systems Engineer',
    department: 'Mobile & Edge Computing',
    email: 'lucas.vance@enterprise.tech',
    phone: '+1 (303) 555-0129',
    company: 'Enterprise Cloud Systems',
    city: 'Denver, CO',
    avatarColor: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
  },
  {
    id: 10,
    name: 'Sophia Taylor',
    role: 'Technical Product Manager',
    department: 'Enterprise Integrations',
    email: 'sophia.taylor@enterprise.tech',
    phone: '+1 (404) 555-0133',
    company: 'Enterprise Cloud Systems',
    city: 'Atlanta, GA',
    avatarColor: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
  },
];

export const PROFESSIONAL_TASKS = [
  // 1-25: Architecture, Backend, Cloud
  { title: 'Implement OAuth2 PKCE Authorization Code Flow for SSO integration', category: 'Security', priority: 'urgent' },
  { title: 'Migrate core transactional database from MySQL 5.7 to PostgreSQL 16', category: 'Database', priority: 'high' },
  { title: 'Optimize Redis distributed cache invalidation policy for session storage', category: 'Backend', priority: 'medium' },
  { title: 'Configure Kubernetes HPA autoscaling policies for traffic spike handling', category: 'DevOps', priority: 'high' },
  { title: 'Conduct SOC2 Type II compliance audit on customer data encryption at rest', category: 'Security', priority: 'urgent' },
  { title: 'Design RESTful API rate-limiting gateway using Token Bucket algorithm', category: 'Backend', priority: 'high' },
  { title: 'Establish Prometheus alerting rules and Grafana dashboards for latency SLOs', category: 'DevOps', priority: 'medium' },
  { title: 'Refactor monolithic payment webhook listeners into asynchronous SQS consumers', category: 'Architecture', priority: 'high' },
  { title: 'Implement gRPC transport layer between microservices for sub-millisecond RPC', category: 'Backend', priority: 'medium' },
  { title: 'Set up Terraform infrastructure-as-code modules for multi-region AWS deployment', category: 'DevOps', priority: 'urgent' },
  { title: 'Audit third-party npm dependencies for CVE vulnerabilities and transitive exploits', category: 'Security', priority: 'high' },
  { title: 'Build automated CI/CD canary deployment pipeline with ArgoCD and GitHub Actions', category: 'DevOps', priority: 'urgent' },
  { title: 'Integrate Elasticsearch cluster for real-time full-text log analytics indexing', category: 'Database', priority: 'medium' },
  { title: 'Implement distributed tracing with OpenTelemetry and Jaeger instrumentation', category: 'DevOps', priority: 'medium' },
  { title: 'Create GraphQL federation schema unifying user, billing, and inventory services', category: 'Architecture', priority: 'high' },
  { title: 'Configure Cloudflare WAF custom firewall rules blocking suspicious DDoS patterns', category: 'Security', priority: 'urgent' },
  { title: 'Develop idempotent retry queue with exponential backoff for failed Stripe charges', category: 'Backend', priority: 'urgent' },
  { title: 'Perform load testing with k6 simulating 25,000 concurrent checkout sessions', category: 'QA', priority: 'high' },
  { title: 'Optimize PostgreSQL execution plans by adding partial indexes on active tenants', category: 'Database', priority: 'medium' },
  { title: 'Implement zero-downtime database schema migration strategy with Liquibase', category: 'Database', priority: 'high' },
  { title: 'Configure AWS Secrets Manager automatic rotation for RDS master credentials', category: 'Security', priority: 'urgent' },
  { title: 'Set up automated database backup verification and disaster recovery drill', category: 'DevOps', priority: 'high' },
  { title: 'Refactor legacy authentication middleware into stateless JWT verification filters', category: 'Backend', priority: 'medium' },
  { title: 'Implement event-driven audit logging pipeline using Apache Kafka topics', category: 'Architecture', priority: 'high' },
  { title: 'Configure VPC peering connections and transit gateway routing tables', category: 'DevOps', priority: 'medium' },

  // 26-50: Frontend, UI/UX, Mobile
  { title: 'Upgrade React components to latest concurrent mode with Suspense boundaries', category: 'Frontend', priority: 'medium' },
  { title: 'Implement dark/light theme accessibility audit ensuring WCAG 2.1 AA compliance', category: 'Design', priority: 'medium' },
  { title: 'Optimize client-side bundle size reducing first contentful paint by 42%', category: 'Performance', priority: 'high' },
  { title: 'Develop responsive data grid with virtualized scrolling for 100k rows', category: 'Frontend', priority: 'high' },
  { title: 'Integrate WebSockets client for real-time collaborative document editing', category: 'Frontend', priority: 'urgent' },
  { title: 'Build interactive analytical charts using Canvas and SVG acceleration', category: 'Frontend', priority: 'medium' },
  { title: 'Refactor form state management using schema-driven Zod runtime validation', category: 'Frontend', priority: 'medium' },
  { title: 'Implement progressive web app (PWA) offline service worker caching', category: 'Frontend', priority: 'medium' },
  { title: 'Create unified Figma design system component tokens library for web and mobile', category: 'Design', priority: 'high' },
  { title: 'Conduct usability testing sessions for new enterprise customer onboarding wizard', category: 'Product', priority: 'high' },
  { title: 'Implement drag-and-drop workflow canvas with undo/redo history stack', category: 'Frontend', priority: 'high' },
  { title: 'Configure CSP (Content Security Policy) headers preventing XSS attacks', category: 'Security', priority: 'urgent' },
  { title: 'Optimize image asset delivery pipeline with AVIF and WebP dynamic transcoding', category: 'Performance', priority: 'medium' },
  { title: 'Add multi-language localization (i18n) support for 12 international regions', category: 'Frontend', priority: 'medium' },
  { title: 'Implement keyboard shortcut navigation and focus trap for modal dialogs', category: 'Accessibility', priority: 'medium' },
  { title: 'Design mobile-optimized responsive navigation drawer and gesture controls', category: 'Design', priority: 'medium' },
  { title: 'Integrate Sentry error tracking with sourcemap upload during Vite build pipeline', category: 'DevOps', priority: 'high' },
  { title: 'Create reusable compound UI components: Combobox, Tooltips, and Popovers', category: 'Frontend', priority: 'medium' },
  { title: 'Add micro-interaction animations using CSS hardware acceleration transitions', category: 'Design', priority: 'low' },
  { title: 'Conduct cross-browser compatibility matrix verification on Safari, Chrome, Firefox', category: 'QA', priority: 'medium' },
  { title: 'Implement client-side query caching and deduplication layer', category: 'Frontend', priority: 'high' },
  { title: 'Design high-converting pricing tiers comparison table and modal', category: 'Product', priority: 'high' },
  { title: 'Build customer feedback collection widget with screenshot annotation tool', category: 'Product', priority: 'medium' },
  { title: 'Implement zero-layout-shift skeleton loaders across all primary route views', category: 'Frontend', priority: 'medium' },
  { title: 'Optimize web fonts loading strategy using preload and font-display swap', category: 'Performance', priority: 'low' },

  // 51-75: API, Integration, Data
  { title: 'Implement webhook subscription dispatcher with HMAC signature verification', category: 'API', priority: 'urgent' },
  { title: 'Build automated PDF report generation service using headless Chromium workers', category: 'Backend', priority: 'medium' },
  { title: 'Integrate SendGrid transactional email templates with delivery telemetry', category: 'Integration', priority: 'medium' },
  { title: 'Implement CSV data import pipeline with background validation and error reports', category: 'Data', priority: 'high' },
  { title: 'Configure Apache Kafka dead-letter queues for unprocessable message recovery', category: 'Architecture', priority: 'urgent' },
  { title: 'Design multi-tenant data isolation model with Row-Level Security policies', category: 'Database', priority: 'urgent' },
  { title: 'Build real-time notification service using Server-Sent Events (SSE)', category: 'Backend', priority: 'high' },
  { title: 'Create automated Swagger / OpenAPI 3.1 interactive developer documentation', category: 'API', priority: 'medium' },
  { title: 'Implement GraphQL schema depth and complexity limiting middleware', category: 'Security', priority: 'high' },
  { title: 'Configure Amazon S3 presigned URL generation for secure direct client uploads', category: 'Cloud', priority: 'high' },
  { title: 'Build scheduled cron reconciliation engine verifying Stripe ledger accounts', category: 'Backend', priority: 'urgent' },
  { title: 'Migrate legacy Redis single instance to 3-node Sentinel high-availability cluster', category: 'DevOps', priority: 'high' },
  { title: 'Implement IP geolocation lookup service with in-memory MaxMind database', category: 'Backend', priority: 'low' },
  { title: 'Build customer export pipeline allowing full GDPR data portability download', category: 'Compliance', priority: 'high' },
  { title: 'Set up automated ETL pipeline streaming analytics into Snowflake data warehouse', category: 'Data', priority: 'high' },
  { title: 'Implement distributed locking mechanism using Redlock algorithm', category: 'Backend', priority: 'high' },
  { title: 'Integrate Slack and Microsoft Teams notification incoming webhooks', category: 'Integration', priority: 'medium' },
  { title: 'Configure DNSSEC and SSL/TLS certificate auto-renewal with Let’s Encrypt', category: 'Security', priority: 'urgent' },
  { title: 'Implement biometric WebAuthn / FIDO2 passwordless login authentication', category: 'Security', priority: 'high' },
  { title: 'Build asynchronous batch email delivery worker with rate-limit throttling', category: 'Backend', priority: 'medium' },
  { title: 'Set up multi-region S3 cross-region replication for critical asset backups', category: 'Cloud', priority: 'high' },
  { title: 'Implement data retention policy script purging inactive tenant logs after 90 days', category: 'Database', priority: 'medium' },
  { title: 'Create developer sandbox environment with anonymized production schema seed', category: 'DevOps', priority: 'medium' },
  { title: 'Build custom webhook retry exponential backoff simulator for partner testing', category: 'API', priority: 'medium' },
  { title: 'Configure CloudWatch custom metrics for real-time payment gateway error rate', category: 'DevOps', priority: 'high' },

  // 76-100: Security, QA, Performance
  { title: 'Conduct automated penetration testing identifying OWASP Top 10 vulnerabilities', category: 'Security', priority: 'urgent' },
  { title: 'Implement end-to-end Cypress regression test suite across checkout journeys', category: 'QA', priority: 'high' },
  { title: 'Set up SonarQube static code quality analysis and test coverage threshold gates', category: 'DevOps', priority: 'high' },
  { title: 'Audit IAM roles and enforce Principle of Least Privilege across AWS accounts', category: 'Security', priority: 'urgent' },
  { title: 'Build automated chaos engineering experiment testing pod crash resilience', category: 'QA', priority: 'medium' },
  { title: 'Configure NGINX reverse proxy with Brotli compression and HTTP/3 support', category: 'Performance', priority: 'high' },
  { title: 'Implement rate-limiting headers (X-RateLimit-Remaining) in API responses', category: 'API', priority: 'medium' },
  { title: 'Set up automated visual regression testing with Percy on pull requests', category: 'QA', priority: 'medium' },
  { title: 'Conduct database query index optimization reducing 99th percentile response time', category: 'Performance', priority: 'high' },
  { title: 'Implement Content Security Policy reporting endpoint collecting inline violations', category: 'Security', priority: 'medium' },
  { title: 'Build automated mock API server for third-party integration test decoupling', category: 'QA', priority: 'medium' },
  { title: 'Configure Docker multi-stage builds reducing container image footprint by 65%', category: 'DevOps', priority: 'medium' },
  { title: 'Implement secrets scanning in git pre-commit hooks preventing credential leaks', category: 'Security', priority: 'urgent' },
  { title: 'Set up synthetic user monitoring simulating global login journeys every 5 minutes', category: 'DevOps', priority: 'high' },
  { title: 'Perform memory leak profiling on high-throughput Node.js microservices', category: 'Performance', priority: 'high' },
  { title: 'Configure automated pull request preview environments in Kubernetes namespace', category: 'DevOps', priority: 'high' },
  { title: 'Implement customer data anonymization utilities for staging test environments', category: 'Security', priority: 'high' },
  { title: 'Build cross-region failover DNS routing policy using AWS Route53 Health Checks', category: 'DevOps', priority: 'urgent' },
  { title: 'Audit session cookie security flags (SameSite=Strict, HttpOnly, Secure)', category: 'Security', priority: 'urgent' },
  { title: 'Write comprehensive integration tests for multi-currency conversion module', category: 'QA', priority: 'high' },
  { title: 'Implement response payload streaming for large CSV and JSON export endpoints', category: 'Performance', priority: 'medium' },
  { title: 'Set up PagerDuty escalation policies and on-call rotation schedules for SRE team', category: 'DevOps', priority: 'high' },
  { title: 'Conduct quarterly disaster recovery failover drill to backup AWS region', category: 'DevOps', priority: 'urgent' },
  { title: 'Implement client-side error boundary reporting with stack trace aggregation', category: 'Frontend', priority: 'medium' },
  { title: 'Create automated database health-check scripts monitoring connection pools', category: 'Database', priority: 'high' },
];

export const CATEGORY_SUBTASK_TEMPLATES = {
  Security: [
    'Static code vulnerability analysis & SAST check',
    'Review OWASP Top 10 compliance',
    'Implement encryption key rotation & secrets audit',
    'Security team peer sign-off',
  ],
  Database: [
    'Design normalized schema & migration script',
    'Benchmark index performance with EXPLAIN ANALYZE',
    'Verify automated point-in-time backup recovery',
  ],
  DevOps: [
    'Update Dockerfile multi-stage build configuration',
    'Configure CI/CD automated test & lint pipeline',
    'Deploy canary pods to staging Kubernetes cluster',
    'Configure Prometheus & Grafana alert rules',
  ],
  Frontend: [
    'Build responsive UI component with design system tokens',
    'Write unit & interaction tests with Jest/Testing Library',
    'Audit WCAG 2.1 AA accessibility & keyboard navigation',
  ],
  Backend: [
    'Implement REST controller endpoints with validation',
    'Write integration tests for edge cases & auth failure',
    'Optimize caching layer with Redis TTL strategy',
  ],
  Architecture: [
    'Draft Architecture Decision Record (ADR-042)',
    'Conduct system throughput & latency load tests',
    'Review zero-downtime rolling migration plan',
  ],
  QA: [
    'Write end-to-end Cypress regression suite',
    'Execute exploratory cross-browser test matrix',
    'Document bug reproduction steps and severity matrix',
  ],
  Design: [
    'Create high-fidelity Figma component prototypes',
    'Validate token hierarchy with design system team',
    'Conduct usability testing session with internal users',
  ],
  Product: [
    'Define acceptance criteria & user story map',
    'Align engineering milestones with Q3 roadmap',
    'Set up PostHog / Mixpanel event analytics schema',
  ],
  API: [
    'Publish OpenAPI / Swagger 3.0 specification',
    'Implement rate-limiting & JWT token verification',
    'Verify backward compatibility with legacy v1 clients',
  ],
  Performance: [
    'Profile CPU & memory allocation benchmarks',
    'Optimize slow database queries and N+1 lookups',
    'Configure CDN edge caching & gzip compression',
  ],
};

/**
 * Maps a raw JSONPlaceholder todo item to a professional enterprise task.
 */
export function getProfessionalTodo(rawItem) {
  const id = Number(rawItem.id) || 1;
  const index = (id - 1) % PROFESSIONAL_TASKS.length;
  const template = PROFESSIONAL_TASKS[index];

  // Calculate realistic due date: range from -2 days (overdue) to +12 days
  const offsetDays = ((id * 3) % 15) - 2;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + offsetDays);

  const userId = ((id - 1) % 10) + 1;
  const user = TEAM_MEMBERS.find((u) => u.id === userId) || TEAM_MEMBERS[0];

  const cat = rawItem.category || template.category;
  const categoryTemplates = CATEGORY_SUBTASK_TEMPLATES[cat] || CATEGORY_SUBTASK_TEMPLATES.Frontend;
  
  const subtasks = rawItem.subtasks && Array.isArray(rawItem.subtasks)
    ? rawItem.subtasks
    : categoryTemplates.slice(0, 3).map((stTitle, stIndex) => ({
        id: `st-${id}-${stIndex + 1}`,
        title: stTitle,
        completed: Boolean(rawItem.completed) || stIndex === 0,
      }));

  return {
    ...rawItem,
    id: id,
    title: rawItem.title?.startsWith('Custom:') ? rawItem.title.replace('Custom:', '') : template.title,
    category: cat,
    priority: rawItem.priority || template.priority,
    dueDate: rawItem.dueDate || dueDate.toISOString().split('T')[0],
    userId: userId,
    assignedUser: user,
    completed: Boolean(rawItem.completed),
    subtasks: subtasks,
    createdAt: rawItem.createdAt || new Date(Date.now() - id * 3600000).toISOString(),
  };
}

export function getUserProfile(userId) {
  const uid = Number(userId) || 1;
  return TEAM_MEMBERS.find((u) => u.id === uid) || {
    id: uid,
    name: `Team Member #${uid}`,
    role: 'Software Engineer',
    department: 'Engineering',
    email: `member${uid}@enterprise.tech`,
    phone: '+1 (555) 0100',
    company: 'Enterprise Cloud Systems',
    city: 'San Francisco, CA',
    avatarColor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  };
}
