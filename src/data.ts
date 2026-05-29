import { Project, OperatingPrinciple } from "./types";

export const projects: Project[] = [
  {
    id: "bitcoin-depot",
    title: "Bitcoin Depot / Bitaccess",
    subtitle: "Production fintech engineering",
    role: "Full-stack Product Engineer",
    description: "Fintech product work built for real-world kiosk systems, intensive regulatory compliance, and high-stakes production rollouts.",
    highlights: [
      "Built resilient, state-based regulatory checking rules with json-rules-engine and robust production scripts.",
      "Led high-impact pricing and fees architecture overhaul touching critical customer-facing kiosk screens, state rules, and deployment logistics.",
      "Served as the anchor engineer for major multi-region production rollouts, escalations, and cross-repository debugging.",
      "Constructed custom end-to-end telemetry rules to monitor active kiosk states and prevent transaction drop-offs due to network lag."
    ],
    links: [
      { label: "Bitcoin Depot", url: "https://bitcoindepot.com" }
    ],
    techStack: ["Node.js", "React", "TypeScript", "json-rules-engine", "PostgreSQL", "Shell Scripting", "Docker", "QA Automation"],
    metric: "8,000+",
    metricLabel: "Active Cash Kiosks",
    type: "fintech"
  },
  {
    id: "permipro",
    title: "PermiPro",
    subtitle: "Automating permit application workflows",
    role: "Founding Engineer",
    description: "Built an enterprise-grade municipal workflow portal from absolute scratch, compressing slow multi-party physical processes into simple clicks.",
    highlights: [
      "Designed and implemented the core multi-tenant engine and multi-role authorization layer (Applicant, Inspector, Administrator).",
      "Created highly reactive custom form builder interfaces that support complex conditional paths and real-time validation inputs.",
      "Architected secure, reliable file attachment systems and asynchronous automated PDF reports generation pipeline."
    ],
    links: [
      { label: "Visit PermiPro", url: "https://permipro.io" }
    ],
    techStack: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS", "PDF Generation", "Cloud Workflows"],
    metric: "12x",
    metricLabel: "Processing Speedup",
    type: "startup"
  },
  {
    id: "faceout",
    title: "Faceout",
    subtitle: "Local business digital accelerator",
    role: "Founder & Developer",
    description: "Small Ottawa web studio engineered around helping local independent brands secure high visibility, credibility, and conversion pipelines.",
    highlights: [
      "Formulated a lightweight, ultra-fast reusable components framework to execute bespoke projects in days rather than months.",
      "Consistently achieved perfect 100/100 PageSpeed scores by using static architectures, layout drift prevention, and modern image pipelines.",
      "Authored custom search engine frameworks tailored to regional optimization, boosting local lead generation."
    ],
    links: [
      { label: "Visit Faceout Studio", url: "https://faceout.ca" }
    ],
    techStack: ["Astro", "React", "Tailwind CSS", "SEO optimization", "Cloudflare Pages", "Framer Motion", "Formspree"],
    metric: "100/100",
    metricLabel: "Average PageSpeed",
    type: "agency"
  }
];

export const operatingPrinciples: OperatingPrinciple[] = [
  {
    title: "I like messy workflows.",
    subtitle: "Product ⇄ Operations ⇄ Code",
    description: "The most interesting, profitable, and durable software spans all three domains. I excel at converting untidied compliance manuals and logistical bottlenecks into strict, maintainable system code.",
    iconName: "git-branch",
    caseStudy: {
      problem: "Handling differing, state-by-state maximum transactions and KYC thresholds across US/Canada led to highly fragile code and compliance bottlenecks.",
      solution: "Engineered a dynamic, schema-driven rule interpreter. Refactored hardcoded conditional nested loops into a declarative, decoupled rule state machine.",
      impact: "Eliminated compliance-drift errors and empowered the Operations team to verify, dry-run, and modify transaction logic in minutes without changing code."
    }
  },
  {
    title: "I care about rollouts.",
    subtitle: "Beyond the local dev server",
    description: "Features are only finished when they safely live in production. I build with comprehensive logging, backwards-compatible deployments, and fail-safe recovery configurations.",
    iconName: "rocket",
    caseStudy: {
      problem: "Unreliable regional cellular lines on kiosk cash dispensers caused transaction rollbacks to disconnect, leaving database and physical cash registers out of sync.",
      solution: "Constructed an offline-first transactional log with atomic rollback state controls and event replays.",
      impact: "Zero hardware discrepancy incidences recorded; system errors self-resolve gracefully upon cellular reconnection."
    }
  },
  {
    title: "I stay close to production.",
    subtitle: "Logs, telemetry, and customer reality",
    description: "Excellent code is built on real-world constraints. I study error telemetry, customer friction points, and infrastructure quirks to preemptively engineer preventative controls.",
    iconName: "activity",
    caseStudy: {
      problem: "Intermittent timeouts during peak Saturday traffic spikes caused consumer drop-offs on critical verification flows.",
      solution: "Isolated high-traffic verification endpoints. Integrated distributed caching and restructured relational database indexes to minimize transaction blocks.",
      impact: "Cut peak-load query latency by 82% and flattened customer support queries to near-zero levels."
    }
  }
];

export const educationAndDetails = {
  address: "Ottawa, ON, Canada",
  email: "griffin.leblanc@gmail.com",
  github: "https://github.com/g-88",
  linkedin: "https://www.linkedin.com/in/griffinleblanc",
  resumeUrl: "http://griffinleblanc.ca/resume/griffin-leblanc-resume.pdf"
};
