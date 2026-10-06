/**
 * ==========================================================
 * PERSONAL PROFILE & AI ASSISTANT KNOWLEDGE BASE
 * ==========================================================
 * Comprehensive digital identity data including Bio, Skills,
 * Currently Learning, Channels, VIP Club, Resources, and
 * live Gemini AI integration settings.
 */

const DEFAULT_PROFILE_DATA = {
  // --- Personal Information (Ami Ke) ---
  personal: {
    name: "Agent 47",
    nickname: "47",
    title: "Elite Software Operative & Security Architect",
    roles: [
      "Full Stack Operative",
      "AI Systems Architect",
      "Cybersecurity Researcher",
      "Tech Syndicate Leader"
    ],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    status: {
      text: "Active & Classified | Ready for High-Impact Missions",
      available: true
    },
    location: "Global / Encrypted",
    email: "agent47@agency.net",
    shortBio: "Elite software engineer and systems operative turning mission-critical problems into indestructible, high-performance architecture. Precision, clean code, and zero compromises.",
    aboutStory: `Greetings. I operate under the moniker Agent 47 — a precision-focused software engineer and systems architect specializing in high-resilience computing, AI multi-agent workflows, and secure digital platforms.
Over years of deep technical execution, I have architected high-throughput services, built bespoke AI tools, and engineered clean user interfaces with mathematical rigor.

Beyond pure code, I head an exclusive syndicate of tech builders, release mission-grade open-source resources, and advise select operators in my private VIP network. Excellence is not an option; it is the default protocol.`,
    stats: [
      { label: "Missions Completed", value: "47+" },
      { label: "Syndicate Operators", value: "10K+" },
      { label: "Code Audits", value: "150+" },
      { label: "Classified Tools", value: "50+" }
    ],
    socials: [
      { name: "GitHub", url: "https://github.com", icon: "fab fa-github" },
      { name: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin-in" },
      { name: "Email", url: "mailto:agent47@agency.net", icon: "fas fa-envelope" },
      { name: "Telegram", url: "https://t.me", icon: "fab fa-telegram-plane" },
      { name: "YouTube", url: "https://youtube.com", icon: "fab fa-youtube" }
    ]
  },

  // --- Skill Matrix (Ki Ki Pari) ---
  skills: [
    // Frontend (Core & Supporting)
    { id: "sk_1", name: "JavaScript / ES6+", category: "frontend", importance: "core", level: 92, badge: "Advanced", icon: "fab fa-js" },
    { id: "sk_2", name: "React.js / Next.js", category: "frontend", importance: "core", level: 88, badge: "Advanced", icon: "fab fa-react" },
    { id: "sk_3", name: "HTML5 & Modern CSS3", category: "frontend", importance: "core", level: 95, badge: "Expert", icon: "fab fa-html5" },
    { id: "sk_4", name: "Responsive UI & Design Systems", category: "frontend", importance: "secondary", level: 90, badge: "Expert", icon: "fas fa-layer-group" },
    { id: "sk_5", name: "TypeScript", category: "frontend", importance: "core", level: 82, badge: "Proficient", icon: "fas fa-code" },

    // Backend (Core & Supporting)
    { id: "sk_6", name: "Python / FastAPI / Django", category: "backend", importance: "core", level: 88, badge: "Advanced", icon: "fab fa-python" },
    { id: "sk_7", name: "Node.js & Express", category: "backend", importance: "secondary", level: 84, badge: "Proficient", icon: "fab fa-node-js" },
    { id: "sk_8", name: "REST APIs & Architecture", category: "backend", importance: "core", level: 86, badge: "Advanced", icon: "fas fa-network-wired" },
    { id: "sk_9", name: "PostgreSQL & SQL Databases", category: "backend", importance: "core", level: 85, badge: "Proficient", icon: "fas fa-database" },
    { id: "sk_10", name: "MongoDB / NoSQL", category: "backend", importance: "secondary", level: 80, badge: "Proficient", icon: "fas fa-leaf" },

    // Tools & DevOps
    { id: "sk_11", name: "Git & GitHub Workflow", category: "tools", importance: "core", level: 90, badge: "Expert", icon: "fab fa-git-alt" },
    { id: "sk_12", name: "Docker & Containers", category: "tools", importance: "secondary", level: 78, badge: "Intermediate", icon: "fab fa-docker" },
    { id: "sk_13", name: "Linux & Bash Scripting", category: "tools", importance: "secondary", level: 85, badge: "Proficient", icon: "fab fa-linux" },
    { id: "sk_14", name: "CI/CD & Cloud Deployment", category: "tools", importance: "optional", level: 80, badge: "Proficient", icon: "fas fa-cloud-upload-alt" },

    // Soft Skills
    { id: "sk_15", name: "Problem Solving & Logic", category: "soft", importance: "core", level: 95, badge: "Master", icon: "fas fa-lightbulb" },
    { id: "sk_16", name: "Community Leadership & Mentoring", category: "soft", importance: "secondary", level: 92, badge: "Expert", icon: "fas fa-users" },
    { id: "sk_17", name: "Fast Learner & Adaptability", category: "soft", importance: "core", level: 96, badge: "Master", icon: "fas fa-bolt" }
  ],

  // --- Currently Learning Roadmap ---
  learningRoadmap: [
    {
      id: "learn_1",
      title: "Autonomous AI Agents & Multi-Agent Swarms",
      description: "Building production LLM agents using tool calling, vector databases, and agentic workflows.",
      progress: 80,
      badge: "Actively Exploring",
      tags: ["Gemini 1.5", "LangChain", "Vector DB"],
      hoursLogged: 42,
      milestones: [
        { title: "Prompt chaining & system instructions", done: true },
        { title: "Function calling & API tool execution", done: true },
        { title: "Vector store embeddings & RAG pipeline", done: true },
        { title: "Multi-agent autonomous swarm coordination", done: false }
      ]
    },
    {
      id: "learn_2",
      title: "Advanced System Design & Scalable Architectures",
      description: "Mastering distributed caching, message queues (Kafka, RabbitMQ), and microservice resilience.",
      progress: 75,
      badge: "In Progress",
      tags: ["Distributed Systems", "Kafka", "Redis"],
      hoursLogged: 36,
      milestones: [
        { title: "Horizontal scaling & load balancer setups", done: true },
        { title: "Redis caching patterns & cache invalidation", done: true },
        { title: "Message queuing with Kafka event streaming", done: false },
        { title: "Database sharding & replication strategies", done: false }
      ]
    },
    {
      id: "learn_3",
      title: "Next.js 15 & React Server Components Deep Dive",
      description: "Optimizing server rendering pipelines, edge caching, and server actions for zero bundle bloat.",
      progress: 90,
      badge: "Near Completion",
      tags: ["Next.js 15", "RSC", "Turbopack"],
      hoursLogged: 55,
      milestones: [
        { title: "App router & dynamic route parallelization", done: true },
        { title: "Server actions & optimistic UI updates", done: true },
        { title: "Edge runtime middleware & streaming SSR", done: true },
        { title: "Production performance benchmarking (99+ Lighthouse)", done: false }
      ]
    },
    {
      id: "learn_4",
      title: "Rust & High Performance Systems Programming",
      description: "Exploring memory safety, low-level concurrency, and WebAssembly compilation.",
      progress: 45,
      badge: "Getting Started",
      tags: ["Rust", "WASM", "Memory Safety"],
      hoursLogged: 20,
      milestones: [
        { title: "Ownership model & borrow checker rules", done: true },
        { title: "Lifetimes, structs, traits & pattern matching", done: true },
        { title: "Fearless concurrency & multi-threaded actors", done: false },
        { title: "Compile to WebAssembly (WASM) for browser runtime", done: false }
      ]
    }
  ],

  // --- Public Channels & Communities (Kon Channel Ace) ---
  channels: [
    {
      id: "chan_1",
      name: "YouTube Operative Channel",
      handle: "@Agent47Dev",
      description: "Tactical code breakdowns, security blueprints, systems architecture, and engineering masterclasses.",
      members: "15K+ Operatives",
      icon: "fab fa-youtube",
      url: "https://youtube.com",
      color: "#ef4444"
    },
    {
      id: "chan_2",
      name: "Classified Telegram Channel",
      handle: "t.me/agent47dev",
      description: "Daily tactical tech intel, zero-day alerts, mission resources, and architecture dispatches.",
      members: "8.5K+ Operatives",
      icon: "fab fa-telegram-plane",
      url: "https://t.me",
      color: "#229ed9"
    },
    {
      id: "chan_3",
      name: "Discord Syndicate Community",
      handle: "Agent 47's Syndicate",
      description: "Encrypted voice rooms, live pair-engineering, high-velocity code audits, and operative briefings.",
      members: "4.2K+ Members",
      icon: "fab fa-discord",
      url: "https://discord.com",
      color: "#5865f2"
    },
    {
      id: "chan_4",
      name: "GitHub Classified Hub",
      handle: "github.com/agent47",
      description: "Mission-grade starter kits, open-source utilities, and secure engineering repositories.",
      members: "1.2K+ Stars",
      icon: "fab fa-github",
      url: "https://github.com",
      color: "#f1f5f9"
    }
  ],

  // --- VIP Community / Exclusive Club (Kon VIP Ace) ---
  vipCommunity: {
    title: "Agent 47 VIP Syndicate",
    badge: "Classified Access",
    tagline: "Accelerate your trajectory with direct access, private mentoring, and mission-grade software toolkits.",
    description: "An invite-only inner circle for elite engineers, founders, and relentless builders who demand unfair competitive advantages, 1-on-1 architecture reviews, and covert blueprints.",
    priceTag: "Classified / Invite Only",
    joinUrl: "https://t.me",
    perks: [
      "Direct 1-on-1 Comms & Code Audits with Agent 47",
      "Private Syndicate Telegram Channel & Audio Briefings",
      "Early Access to All Classified Source Codes & AI Agents",
      "High-Value Contract & Remote Opportunity Intel Drops",
      "Step-by-step Distributed Architecture Masterclasses"
    ]
  },

  // --- Public Resources & Downloads Hub (Resources) ---
  resources: [
    {
      id: "res_1",
      title: "Full Stack Developer Mastery Roadmap (2026 Edition)",
      description: "A comprehensive, step-by-step guide from zero to senior engineer covering Frontend, Backend, DevOps, and AI.",
      category: "Roadmaps",
      type: "PDF Guide",
      size: "4.2 MB",
      icon: "fas fa-map-signs",
      downloadUrl: "#",
      featured: true
    },
    {
      id: "res_2",
      title: "Clean Code & System Design Cheat Sheet",
      description: "Essential architectural patterns, SOLID principles, and database indexing strategies summarized on 2 pages.",
      category: "Cheat Sheets",
      type: "PDF Document",
      size: "1.8 MB",
      icon: "fas fa-file-pdf",
      downloadUrl: "#",
      featured: true
    },
    {
      id: "res_3",
      title: "FastAPI + Docker Microservice Starter Kit",
      description: "Production-ready backend boilerplate featuring JWT authentication, Alembic migrations, and automated testing.",
      category: "Templates",
      type: "ZIP Boilerplate",
      size: "850 KB",
      icon: "fas fa-file-code",
      downloadUrl: "#",
      featured: true
    },
    {
      id: "res_4",
      title: "Top 100 JavaScript & React Interview Q&A",
      description: "Hand-curated tricky conceptual questions with clear code diagrams and explanations to crack any interview.",
      category: "Interview Prep",
      type: "Notes / MD",
      size: "2.5 MB",
      icon: "fas fa-book-open",
      downloadUrl: "#",
      featured: false
    }
  ],

  // --- Featured Projects ---
  projects: [
    {
      id: "proj_1",
      title: "AI Personal Assistant & Portfolio",
      description: "An interactive digital twin chatbot web application that showcases bio, skills, and portfolio data in real-time.",
      tags: ["JavaScript", "CSS3 Glassmorphism", "Gemini AI"],
      github: "https://github.com",
      demo: "#",
      featured: true
    },
    {
      id: "proj_2",
      title: "Smart Task & Habit Dashboard",
      description: "A comprehensive productivity app with calendar integration, analytics graphs, and localized dark mode UI.",
      tags: ["React", "Tailored CSS", "Chart.js", "Local Storage"],
      github: "https://github.com",
      demo: "#",
      featured: true
    },
    {
      id: "proj_3",
      title: "E-Commerce REST API Engine",
      description: "Scalable backend microservice handling secure JWT authentication, payments, catalog filtering, and order tracking.",
      tags: ["Python", "FastAPI", "PostgreSQL", "Docker"],
      github: "https://github.com",
      demo: "#",
      featured: true
    }
  ],

  // --- Professional Services & Business Solutions (For Clients & Companies) ---
  services: [
    {
      id: "srv_1",
      title: "Full-Stack Web & SaaS Engineering",
      icon: "fas fa-laptop-code",
      badge: "Core Solution",
      description: "End-to-end custom web applications, SaaS dashboards, and client portals built with React/Next.js, Node/Python, and responsive glassmorphic UI.",
      deliverables: ["Custom Web Applications", "Admin Dashboards & Portals", "Database Architecture", "Production Cloud Deployment"],
      turnaround: "1 - 3 Weeks"
    },
    {
      id: "srv_2",
      title: "Autonomous AI Workflows & Custom Bots",
      icon: "fas fa-robot",
      badge: "High Demand",
      description: "Production LLM integrations, multi-agent swarms, tool calling (Gemini/OpenAI), and 24/7 intelligent customer engagement chatbots.",
      deliverables: ["Custom AI Digital Twins", "Customer Support Bots", "Tool-Calling Automations", "Vector Search / RAG Systems"],
      turnaround: "3 - 7 Days"
    },
    {
      id: "srv_3",
      title: "High-Performance Cloud APIs & Microservices",
      icon: "fas fa-server",
      badge: "Enterprise",
      description: "Ultra-fast, secure REST & GraphQL microservices engineered with FastAPI/Node.js, PostgreSQL/Redis, Docker containerization, and zero downtime.",
      deliverables: ["Secure JWT / OAuth Auth", "Microservice Architecture", "Docker & CI/CD Pipelines", "High-Throughput Optimization"],
      turnaround: "1 - 2 Weeks"
    },
    {
      id: "srv_4",
      title: "Code Audit, Security & Architecture Advisory",
      icon: "fas fa-shield-alt",
      badge: "Advisory",
      description: "Comprehensive code reviews, security vulnerability scanning, performance bottleneck elimination, and architectural roadmaps for startups.",
      deliverables: ["Security Hardening", "Speed & Performance Audits", "Clean Architecture Refactoring", "1-on-1 Strategic Consultation"],
      turnaround: "2 - 5 Days"
    }
  ],

  // --- Work & Study Activity Tracker (Real-Time Proof of Work) ---
  workLogs: [
    {
      id: "log_1",
      date: "2026-10-05",
      title: "Mastered Multi-Bot Gemini Architecture & Web Audio Synthesis",
      category: "AI & Full-Stack",
      hours: "4.5 hrs",
      description: "Engineered tri-bot routing (Persona, Omni Voice, Private Copilot), zero-asset Web Audio SFX synthesis, and persistent local storage sync.",
      proofUrl: "https://github.com",
      status: "Completed"
    },
    {
      id: "log_2",
      date: "2026-10-04",
      title: "Docker Containerization & Nginx Reverse Proxy Setup",
      category: "DevOps & Cloud",
      hours: "3.5 hrs",
      description: "Configured multi-stage Docker builds, Nginx security headers, gzip compression, and automated deployment script.",
      proofUrl: "https://github.com",
      status: "Completed"
    },
    {
      id: "log_3",
      date: "2026-10-03",
      title: "Built Real-Time Skills & Interactive CMS Studio",
      category: "Frontend & Architecture",
      hours: "5.0 hrs",
      description: "Crafted dark/light mode toggle, dynamic filters, instant modal CRUD operations, and PIN passcode security lock.",
      proofUrl: "https://github.com",
      status: "Completed"
    }
  ],

  // --- Personal Diary & Reflections Chronicle ---
  diaryEntries: [
    {
      id: "diary_1",
      date: "2026-10-06",
      title: "Focusing on High-Impact Execution & Consistency",
      mood: "🔥 Determined",
      content: "Consistency beats talent every single day. Taking full control of the stack, logging daily progress, and building real-world projects with zero excuses. Every line of code is an investment into freedom.",
      isPublic: true,
      tags: ["Mindset", "Growth", "Coding"]
    },
    {
      id: "diary_2",
      date: "2026-10-05",
      title: "Roadmap to Mastering Multi-Agent Autonomous Systems",
      mood: "🚀 Inspired",
      content: "The landscape of software is rapidly shifting towards agentic workflows. Instead of just writing scripts, building intelligent systems that can reason, verify, and execute tasks autonomously is the real future.",
      isPublic: true,
      tags: ["AI", "Tech", "Future"]
    },
    {
      id: "diary_3",
      date: "2026-10-04",
      title: "Confidential Notes & Personal Reflections",
      mood: "🔒 Private Thoughts",
      content: "This is a private reflection entry. Kept encrypted and visible only in Admin Studio. Personal goals, health habits, and behind-the-scenes thoughts stay locked here.",
      isPublic: false,
      tags: ["Personal", "Life", "Confidential"]
    }
  ],

  // --- AI Knowledge Base & Gemini Settings ---
  aiAssistant: {
    botName: "Agent 47's Persona Clone",
    greeting: "Greetings. I am Agent 47's official AI persona. Ask me about his capabilities, security architecture, learning roadmap, tactical channels, or classified resources.",
    quickPrompts: [
      "Tell me about your background",
      "What are you currently learning?",
      "What services do you offer for business?",
      "How do I join the VIP Syndicate?",
      "Show classified resources",
      "Ki ki skill paro tumi?"
    ],
    knowledgeRules: [
      {
        id: "rule_1",
        keywords: ["bio", "about", "who are you", "who is agent 47", "who is shadman", "introduce", "background", "porichoy", "porichiti", "nijer somporke"],
        response: "Agent 47 is an elite Software Engineer & Systems Architect. He specializes in full-stack architecture, high-resilience services, AI autonomous agents, and cybersecurity research. Precision, clean code, and mission success define his work."
      },
      {
        id: "rule_2",
        keywords: ["skill", "skills", "tech stack", "technologies", "what do you know", "programming", "capabilities", "languages"],
        response: "Agent 47 commands an arsenal of high-grade technologies: 💻 Frontend: JavaScript (ES6+), React.js, Next.js, HTML5/CSS3, TypeScript. ⚙️ Backend: Python (FastAPI, Django), Node.js, REST & GraphQL APIs, PostgreSQL, MongoDB. 🛠️ Tools: Git, Docker, Linux Systems, Cloud Deployment, CI/CD. Explore the 'Capabilities Matrix' for detailed metrics."
      },
      {
        id: "rule_3",
        keywords: ["learning", "study", "roadmap", "currently learning", "studies", "track", "progress", "growth"],
        response: "Agent 47 actively tracks his growth with real-time milestones: 🤖 Autonomous AI Agents & Swarms, 🏗️ Distributed High-Availability Systems (Kafka, Redis), ⚡ Next.js 15 Server Components, and 🦀 Rust Systems Programming. Check the 'Tech Roadmap & Work Tracker' section for live progress and daily study logs."
      },
      {
        id: "rule_4",
        keywords: ["channel", "channels", "youtube", "telegram", "discord", "community", "facebook", "group"],
        response: "Agent 47 operates key syndicate networks: 📺 YouTube (@Agent47Dev, 15K+ Operatives), ✈️ Classified Telegram (t.me/agent47dev, 8.5K+ Operatives), and 💬 Discord Syndicate (4.2K+ Members). Access links are in the 'Tactical Channels' section."
      },
      {
        id: "rule_5",
        keywords: ["vip", "vip club", "premium", "membership", "insider", "mentorship", "private group", "syndicate"],
        response: "The 'Agent 47 VIP Syndicate' is an invite-only inner circle. Perks include direct 1-on-1 comms and code audits with Agent 47, private syndicate audio briefings, early access to classified codebases, and high-value project leads. Check the VIP section to request access."
      },
      {
        id: "rule_6",
        keywords: ["resource", "resources", "file", "download", "pdf", "cheatsheet", "notes", "material"],
        response: "Agent 47 provides mission-ready resources: 🗺️ Full Stack Operative Mastery Roadmap (2026), 📄 Clean Code & System Design Cheat Sheet, and 📦 FastAPI + Docker Starter Boilerplate. Download them directly from the Resources Hub."
      },
      {
        id: "rule_7",
        keywords: ["contact", "hire", "email", "reach", "hire you", "job", "message", "inquiry", "connect"],
        response: "You can transmit an inquiry to Agent 47 via agent47@agency.net, connect via LinkedIn, or send an encrypted message via the Contact terminal at the bottom of this page."
      },
      {
        id: "rule_8",
        keywords: ["who are you", "what can you do", "introduce yourself", "identity", "about bot"],
        response: "I am the official digital AI clone of Agent 47, an elite Software Operative & Security Architect. I can provide comprehensive information regarding technical skills, learning roadmap progress, services, channels, VIP syndicate access, or engineering resources."
      },
      {
        id: "rule_9",
        keywords: ["service", "services", "hire", "business", "freelance", "contract", "client", "custom project", "proposal", "offer"],
        response: "I deliver 4 core business solutions: 🚀 1. Custom Full-Stack Web & SaaS Applications (Next.js/React, Python, Node). 🤖 2. Autonomous AI Agents & Workflows (Gemini/OpenAI automation, customer bots). ⚡ 3. High-Performance Cloud APIs & Microservices (FastAPI, Docker, PostgreSQL). 🛡️ 4. Code Audits, Security & Architecture Consulting. Connect via the Contact section to discuss your project scope!"
      },
      {
        id: "rule_10",
        keywords: ["diary", "thoughts", "notes", "reflection", "personal diary", "journal", "diary entry"],
        response: "I maintain a personal diary documenting real-life insights, daily coding breakthroughs, and mindset reflections. Public reflections are open for everyone in the My Diary section, while private entries remain strictly encrypted under Admin Studio lock!"
      }
    ],
    defaultResponse: "That is a valid inquiry. You can explore this terminal, ask about Agent 47's skills, channels, or VIP syndicate, or reach out via agent47@agency.net."
  }
};

/* ==========================================================
   PROFILE PRESETS: EXECUTIVE BUSINESS VS CYBER OPERATIVE
   ========================================================== */
const BUSINESS_PROFILE_PRESET = {
  personal: {
    name: "Shadman Faiyaz",
    nickname: "Shadman",
    title: "Senior Full-Stack Engineer & AI Solutions Architect",
    roles: [
      "Enterprise Full-Stack Developer",
      "AI Systems & Automation Consultant",
      "Cloud & DevOps Engineer",
      "Technical Solutions Architect"
    ],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    status: {
      text: "Available for High-Impact Client Projects & Enterprise Contracts",
      available: true
    },
    location: "Dhaka, Bangladesh / Remote Worldwide",
    email: "shadman.faiyaz@example.com",
    shortBio: "Senior software engineer delivering robust web platforms, automated AI workflows, and high-performance cloud infrastructure. Focused on measurable business ROI, clean architecture, and rapid delivery.",
    aboutStory: `I am a Senior Software Engineer and AI Solutions Consultant dedicated to helping businesses, tech startups, and founders turn complex operational challenges into high-yielding digital platforms.

With deep experience across modern JavaScript/TypeScript (React, Next.js), Python (FastAPI, Django), scalable databases, and autonomous AI pipelines, I deliver production systems engineered for reliability, security, and exceptional user experience.

Whether building scalable SaaS products from zero to one, integrating intelligent AI agents to automate business processes, or modernizing legacy infrastructure, my philosophy remains constant: precision engineering, transparent communication, and relentless focus on business outcomes.`,
    stats: [
      { label: "Projects Delivered", value: "35+" },
      { label: "Client Satisfaction", value: "100%" },
      { label: "Code Quality Score", value: "99%" },
      { label: "Production Uptime", value: "99.9%" }
    ],
    socials: [
      { name: "GitHub", url: "https://github.com", icon: "fab fa-github" },
      { name: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin-in" },
      { name: "Email", url: "mailto:shadman.faiyaz@example.com", icon: "fas fa-envelope" },
      { name: "Telegram", url: "https://t.me", icon: "fab fa-telegram-plane" },
      { name: "YouTube", url: "https://youtube.com", icon: "fab fa-youtube" }
    ]
  }
};

const CYBER_PROFILE_PRESET = {
  personal: {
    name: "Agent 47",
    nickname: "47",
    title: "Elite Software Operative & Security Architect",
    roles: [
      "Full Stack Operative",
      "AI Systems Architect",
      "Cybersecurity Researcher",
      "Tech Syndicate Leader"
    ],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    status: {
      text: "Active & Classified | Ready for High-Impact Missions",
      available: true
    },
    location: "Global / Encrypted",
    email: "agent47@agency.net",
    shortBio: "Elite software engineer and systems operative turning mission-critical problems into indestructible, high-performance architecture. Precision, clean code, and zero compromises.",
    aboutStory: `Greetings. I operate under the moniker Agent 47 — a precision-focused software engineer and systems architect specializing in high-resilience computing, AI multi-agent workflows, and secure digital platforms.
Over years of deep technical execution, I have architected high-throughput services, built bespoke AI tools, and engineered clean user interfaces with mathematical rigor.

Beyond pure code, I head an exclusive syndicate of tech builders, release mission-grade open-source resources, and advise select operators in my private VIP network. Excellence is not an option; it is the default protocol.`,
    stats: [
      { label: "Missions Completed", value: "47+" },
      { label: "Syndicate Operators", value: "10K+" },
      { label: "Code Audits", value: "150+" },
      { label: "Classified Tools", value: "50+" }
    ],
    socials: [
      { name: "GitHub", url: "https://github.com", icon: "fab fa-github" },
      { name: "LinkedIn", url: "https://linkedin.com", icon: "fab fa-linkedin-in" },
      { name: "Email", url: "mailto:agent47@agency.net", icon: "fas fa-envelope" },
      { name: "Telegram", url: "https://t.me", icon: "fab fa-telegram-plane" },
      { name: "YouTube", url: "https://youtube.com", icon: "fab fa-youtube" }
    ]
  }
};

/* ==========================================================
   SQLITE DATABASE & STORAGE PERSISTENCE ENGINE
   ========================================================== */
const STORAGE_KEY_PROFILE = 'app_user_profile_data';
const STORAGE_KEY_MESSAGES = 'app_contact_messages';
const STORAGE_KEY_PIN = 'app_admin_passcode';
const STORAGE_KEY_GEMINI = 'app_gemini_config';
const STORAGE_KEY_TRIPLE_BOT = 'app_triple_bot_config';

// Global Database State Tracker
window.DATABASE_CONNECTED = false;
window.DATABASE_INFO = { engine: 'Local Cache', status: 'Connecting...' };

/**
 * Checks SQLite backend connection and syncs data bi-directionally
 */
async function syncDatabaseFromBackend() {
  try {
    // 1. Check SQLite Backend Health
    const healthRes = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
    if (healthRes.ok) {
      const healthData = await healthRes.json();
      window.DATABASE_CONNECTED = true;
      window.DATABASE_INFO = healthData.database || { engine: 'SQLite 3', status: 'online' };
      window.dispatchEvent(new CustomEvent('databaseStatusChanged', { detail: window.DATABASE_INFO }));

      // 2. Sync Profile Data from SQLite
      try {
        const profileRes = await fetch('/api/profile', { method: 'GET', cache: 'no-store' });
        if (profileRes.ok) {
          const remoteProfile = await profileRes.json();
          if (remoteProfile && typeof remoteProfile === 'object' && Object.keys(remoteProfile).length > 0) {
            localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(remoteProfile));
            PROFILE_DATA = getProfileData();
            window.dispatchEvent(new Event('profileDataUpdated'));
          }
        }
      } catch (e) {
        console.warn('[DB] Failed to sync remote profile:', e);
      }

      // 3. Sync Messages from SQLite
      try {
        const msgRes = await fetch('/api/messages', { method: 'GET', cache: 'no-store' });
        if (msgRes.ok) {
          const remoteMsgs = await msgRes.json();
          if (Array.isArray(remoteMsgs)) {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(remoteMsgs));
            window.dispatchEvent(new Event('messagesUpdated'));
          }
        }
      } catch (e) {
        console.warn('[DB] Failed to sync remote messages:', e);
      }

      // 4. Sync Bot Config from SQLite
      try {
        const botRes = await fetch('/api/config/bots', { method: 'GET', cache: 'no-store' });
        if (botRes.ok) {
          const remoteBots = await botRes.json();
          if (remoteBots && typeof remoteBots === 'object' && Object.keys(remoteBots).length > 0) {
            localStorage.setItem(STORAGE_KEY_TRIPLE_BOT, JSON.stringify(remoteBots));
          }
        }
      } catch (e) {}

      console.log('⚡ [DB] SQLite Database connected & synchronized successfully.');
      return true;
    }
  } catch (err) {
    window.DATABASE_CONNECTED = false;
    window.DATABASE_INFO = { engine: 'Local Fallback', status: 'Offline' };
    window.dispatchEvent(new CustomEvent('databaseStatusChanged', { detail: window.DATABASE_INFO }));
  }
  return false;
}

// Auto-run sync on DOM load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { syncDatabaseFromBackend(); });
  } else {
    syncDatabaseFromBackend();
  }
}

function getProfileData() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROFILE_DATA,
        ...parsed,
        personal: { ...DEFAULT_PROFILE_DATA.personal, ...(parsed.personal || {}) },
        services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_PROFILE_DATA.services,
        workLogs: Array.isArray(parsed.workLogs) ? parsed.workLogs : DEFAULT_PROFILE_DATA.workLogs,
        diaryEntries: Array.isArray(parsed.diaryEntries) ? parsed.diaryEntries : DEFAULT_PROFILE_DATA.diaryEntries,
        learningRoadmap: Array.isArray(parsed.learningRoadmap) ? parsed.learningRoadmap : DEFAULT_PROFILE_DATA.learningRoadmap,
        vipCommunity: { ...DEFAULT_PROFILE_DATA.vipCommunity, ...(parsed.vipCommunity || {}) },
        aiAssistant: { ...DEFAULT_PROFILE_DATA.aiAssistant, ...(parsed.aiAssistant || {}) }
      };
    }
  } catch (e) {
    console.error('Error loading profile data from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROFILE_DATA));
}

function applyProfilePreset(presetKey) {
  const current = getProfileData();
  if (presetKey === 'business') {
    current.personal = { ...current.personal, ...BUSINESS_PROFILE_PRESET.personal };
  } else if (presetKey === 'cyber') {
    current.personal = { ...current.personal, ...CYBER_PROFILE_PRESET.personal };
  }
  saveProfileData(current);
  return current;
}
window.applyProfilePreset = applyProfilePreset;

function saveProfileData(newData) {
  try {
    // 1. Save locally for instant UI update
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newData));
    PROFILE_DATA = getProfileData();
    window.dispatchEvent(new Event('profileDataUpdated'));

    // 2. Asynchronously persist to SQLite Database
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    }).then(res => {
      if (res.ok) {
        console.log('✅ [DB] Profile changes saved to SQLite Database.');
      }
    }).catch(err => {
      console.warn('[DB] SQLite save failed, preserved in local storage:', err);
    });

    return true;
  } catch (e) {
    console.error('Error saving profile data:', e);
    return false;
  }
}

function resetProfileData() {
  localStorage.removeItem(STORAGE_KEY_PROFILE);
  PROFILE_DATA = JSON.parse(JSON.stringify(DEFAULT_PROFILE_DATA));
  window.dispatchEvent(new Event('profileDataUpdated'));

  fetch('/api/profile/reset', { method: 'POST' }).catch(() => {});
  return PROFILE_DATA;
}

function getAdminPasscode() {
  return localStorage.getItem(STORAGE_KEY_PIN) || '1234';
}

function setAdminPasscode(newPin, currentPin = null) {
  try {
    localStorage.setItem(STORAGE_KEY_PIN, newPin);

    // Persist to SQLite
    fetch('/api/auth/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_pin: currentPin || getAdminPasscode(), new_pin: newPin })
    }).catch(() => {});

    return true;
  } catch (e) {
    console.error('Error saving passcode:', e);
    return false;
  }
}

function getTripleBotConfig() {
  const legacy = getGeminiConfig();
  const defaultCfg = {
    bot1Persona: {
      name: "BioBot (Personal Clone)",
      apiKey: legacy.apiKey || "",
      model: legacy.model || "gemini-1.5-flash",
      enabled: true
    },
    bot2Public: {
      name: "Omni AI (Public Voice Bot)",
      apiKey: legacy.apiKey || "",
      model: legacy.model || "gemini-1.5-flash",
      enabled: true
    },
    bot3Private: {
      name: "Master Copilot (Admin Only)",
      apiKey: legacy.apiKey || "",
      model: legacy.model || "gemini-1.5-flash",
      enabled: true
    }
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRIPLE_BOT);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        bot1Persona: { ...defaultCfg.bot1Persona, ...(parsed.bot1Persona || {}) },
        bot2Public: { ...defaultCfg.bot2Public, ...(parsed.bot2Public || {}) },
        bot3Private: { ...defaultCfg.bot3Private, ...(parsed.bot3Private || {}) }
      };
    }
  } catch (e) {}

  return defaultCfg;
}

function saveTripleBotConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY_TRIPLE_BOT, JSON.stringify(cfg));
    if (cfg.bot1Persona) {
      saveGeminiConfig(cfg.bot1Persona);
    }

    // Persist to SQLite
    fetch('/api/config/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg)
    }).catch(() => {});

    return true;
  } catch (e) {
    return false;
  }
}

function getGeminiConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GEMINI);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    apiKey: "",
    model: "gemini-1.5-flash",
    enabled: true
  };
}

function saveGeminiConfig(cfg) {
  try {
    localStorage.setItem(STORAGE_KEY_GEMINI, JSON.stringify(cfg));
    return true;
  } catch (e) {
    return false;
  }
}

function getMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveMessage(msg) {
  try {
    const msgs = getMessages();
    const newMsg = {
      id: 'msg_' + Date.now(),
      date: new Date().toISOString(),
      read: false,
      ...msg
    };
    msgs.unshift(newMsg);
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(msgs));
    window.dispatchEvent(new Event('messagesUpdated'));

    // Transmit to SQLite database backend
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: msg.name,
        email: msg.email,
        message: msg.message,
        date: newMsg.date
      })
    }).then(res => res.json()).then(resData => {
      if (resData && resData.data) {
        console.log('✅ [DB] Contact message permanently written to SQLite Database:', resData.data.id);
      }
    }).catch(err => {
      console.warn('[DB] Remote message transmission failed, preserved in local storage:', err);
    });

    return newMsg;
  } catch (e) {
    return null;
  }
}

function deleteMessage(msgId) {
  const msgs = getMessages().filter(m => m.id !== msgId);
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(msgs));
  window.dispatchEvent(new Event('messagesUpdated'));

  // Delete from SQLite
  fetch('/api/messages/' + encodeURIComponent(msgId), {
    method: 'DELETE'
  }).catch(() => {});

  return msgs;
}

function markMessageRead(msgId, isRead = true) {
  const msgs = getMessages().map(m => m.id === msgId ? { ...m, read: isRead } : m);
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(msgs));
  window.dispatchEvent(new Event('messagesUpdated'));

  // Update in SQLite
  fetch('/api/messages/' + encodeURIComponent(msgId) + '/read', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: isRead })
  }).catch(() => {});

  return msgs;
}

let PROFILE_DATA = getProfileData();
