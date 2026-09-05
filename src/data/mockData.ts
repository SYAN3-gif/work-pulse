import { Job, Application, UserProfile, NotificationItem, Conversation, OperationalPhase } from '../types/job';

export const APP_LOGO_URL = 'https://i.postimg.cc/0j2WB2My/file-00000000f9b881f98a78ea5ef2895998.png';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alexandre Morgan',
  email: 'alex.morgan@workpulse.io',
  phone: '+1 (555) 382-9104',
  headline: 'Senior Full-Stack & Cloud Engineer • React, Node.js, Python, AWS',
  location: 'San Francisco, CA',
  userLatitude: 37.7749,
  userLongitude: -122.4194,
  bio: 'Full-stack software engineer with 7+ years of experience building high-scale SaaS web platforms, distributed cloud services, and AI-driven workflow engines. Passionate about performant frontend UX, robust system architecture, and product velocity.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces&q=80',
  resumeFileName: 'Alex_Morgan_Senior_Engineer_2026.pdf',
  resumeLastUpdated: 'Updated yesterday',
  skills: [
    'React', 'TypeScript', 'Node.js', 'Python', 'Next.js', 'Tailwind CSS',
    'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'System Design', 'CI/CD'
  ],
  skillsDetailed: [
    { name: 'TypeScript & React', level: 'Expert' },
    { name: 'Node.js & Python', level: 'Expert' },
    { name: 'System Design & Distributed Systems', level: 'Advanced' },
    { name: 'AWS & Docker / Kubernetes', level: 'Advanced' },
    { name: 'PostgreSQL & Database Optimization', level: 'Advanced' },
    { name: 'LLM & AI Integration (Gemini, Claude)', level: 'Advanced' },
    { name: 'GraphQL & WebSockets', level: 'Intermediate' }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Staff Frontend Engineer',
      company: 'Veloce Cloud Systems',
      period: '2023 - Present',
      location: 'San Francisco, CA',
      description: 'Led a team of 8 engineers architecting real-time collaboration dashboards. Reduced initial page load times by 42% and standardized TypeScript micro-frontends.',
      achievements: [
        'Cut bundle size by 35% through dynamic code-splitting and asset optimization',
        'Introduced end-to-end automated visual regression testing pipeline'
      ]
    },
    {
      id: 'exp-2',
      role: 'Senior Software Engineer',
      company: 'Kinetic Data Labs',
      period: '2020 - 2023',
      location: 'San Francisco, CA',
      description: 'Built high-throughput data visualizers and streaming event pipelines handling 15M+ events per day with React, WebSockets, and Node microservices.',
      achievements: [
        'Maintained 99.99% uptime for real-time telemetry dashboards',
        'Mentored 4 junior engineers into mid-level positions'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      year: '2016 - 2020',
      fieldOfStudy: 'Computer Science & Software Engineering',
      gpa: '3.85 / 4.0'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      year: '2024'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Linux Foundation / CNCF',
      year: '2023'
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'French', proficiency: 'Fluent' },
    { language: 'Spanish', proficiency: 'Conversational' }
  ],
  preferredJobTitles: ['Senior Full-Stack Engineer', 'Staff Frontend Architect', 'Tech Lead'],
  preferredLocations: ['San Francisco, CA', 'Remote', 'New York, NY', 'London, UK'],
  expectedSalaryMin: 140000,
  expectedSalaryMax: 210000,
  openToRemote: true,
  workAuthorization: 'Authorized to work in US (Citizen / Green Card)',
  noticePeriod: '2 weeks',
  yearsOfExperience: 7,
  portfolioUrl: 'https://alexmorgan.dev',
  githubUrl: 'https://github.com/alexmorgan-code',
  linkedinUrl: 'https://linkedin.com/in/alexmorgan-dev'
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack Engineer (AI Applications)',
    company: 'Anthropic Labs',
    companyId: 'ent-anthropic',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    location: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    salaryMin: 165000,
    salaryMax: 210000,
    currency: 'USD',
    experienceLevel: 'Senior',
    department: 'Engineering',
    postedAt: '2 hours ago',
    description: 'We are seeking an experienced Senior Full-Stack Engineer to architect next-generation AI interface experiences, real-time agentic execution workbenches, and secure backend microservices.',
    requirements: [
      '5+ years of production experience with TypeScript, React, and Node.js or Python',
      'Hands-on experience with LLM integration (Gemini, Claude, or OpenAI APIs)',
      'Strong grasp of async streaming protocols, WebSockets, and state synchronization',
      'Demonstrated expertise in scalable database design and cloud hosting'
    ],
    responsibilities: [
      'Architect interactive agent workspaces and streaming visualization tools',
      'Collaborate with AI researchers to deploy production inference interfaces',
      'Mentor junior engineers and champion code quality through rigorous reviews'
    ],
    benefits: [
      'Comprehensive health, dental, and optical insurance',
      '$4,000 annual personal learning stipend',
      'Flexible home office budget ($2,500)',
      'Unlimited PTO with mandatory 3-week minimum'
    ],
    matchScore: 97,
    applicantsCount: 38,
    featured: true,
    urgent: true,
    status: 'active'
  },
  {
    id: 'job-2',
    title: 'Staff Frontend Engineer - Design Systems',
    company: 'Stripe',
    companyId: 'ent-stripe',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop&q=80',
    location: 'Remote',
    latitude: 37.7765,
    longitude: -122.3920,
    workplaceType: 'Remote',
    jobType: 'Full-time',
    salaryMin: 180000,
    salaryMax: 235000,
    currency: 'USD',
    experienceLevel: 'Lead',
    department: 'Design Technology',
    postedAt: '5 hours ago',
    description: 'Build and evolve the global UI component libraries powering financial infrastructure for the internet. You will craft accessible, high-performance UI primitives used by millions of merchants worldwide.',
    requirements: [
      '6+ years of specialized web UI development with deep CSS/TypeScript fluency',
      'Experience leading multi-brand design systems at scale',
      'Obsession with 60fps animations, keyboard navigation, and WCAG AA compliance'
    ],
    responsibilities: [
      'Lead architecture of our open-source tokenized design system',
      'Bridge product designers and 200+ frontend engineers across 12 countries',
      'Conduct automated accessibility and visual regression testing'
    ],
    benefits: [
      '100% remote flexibility worldwide',
      'Generous equity package with early exercise options',
      'Mental health concierge & wellness allowances'
    ],
    matchScore: 94,
    applicantsCount: 72,
    featured: true,
    status: 'active'
  },
  {
    id: 'job-3',
    title: 'Product Engineering Lead',
    company: 'Notion',
    companyId: 'ent-notion',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&q=80',
    location: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    salaryMin: 175000,
    salaryMax: 220000,
    currency: 'USD',
    experienceLevel: 'Senior',
    department: 'Product',
    postedAt: '1 day ago',
    description: 'Help invent the future of workplace computing. Work at the intersection of text editors, databases, and multi-user canvas collaboration.',
    requirements: [
      'Deep mastery of modern JavaScript/TypeScript and client state caching',
      'Experience with offline-first client architecture and Conflict-free Replicated Data Types (CRDTs)',
      'Proven track record delivering delightful user experiences'
    ],
    responsibilities: [
      'Develop real-time block editing primitives and canvas elements',
      'Partner closely with Product Designers and Researchers',
      'Drive performance benchmarks across web, desktop, and mobile shells'
    ],
    benefits: [
      'Annual company offsites in Europe and Japan',
      'Commuter benefits and 401(k) matching up to 5%',
      'Catered lunch daily at modern Manhattan campus'
    ],
    matchScore: 89,
    applicantsCount: 45,
    status: 'active'
  },
  {
    id: 'job-4',
    title: 'Senior Cloud & DevOps Architect',
    company: 'Datadog',
    companyId: 'ent-datadog',
    companyLogo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop&q=80',
    location: 'Austin, TX',
    latitude: 30.2672,
    longitude: -97.7431,
    workplaceType: 'On-site',
    jobType: 'Full-time',
    salaryMin: 155000,
    salaryMax: 195000,
    currency: 'USD',
    experienceLevel: 'Senior',
    department: 'Infrastructure',
    postedAt: '2 days ago',
    description: 'Manage massive Kubernetes clusters and multi-region telemetry ingestion backbones operating across AWS, GCP, and Azure.',
    requirements: [
      'Extensive Kubernetes, Terraform, and Go/Python scripting skills',
      'High-scale network routing and zero-trust security architecture',
      'Experience on-call for Tier-1 mission critical platforms'
    ],
    responsibilities: [
      'Manage automated failover across three global cloud providers',
      'Optimize multi-million dollar cloud infrastructure compute efficiency',
      'Strengthen SOC2 Type II compliance and hardening protocols'
    ],
    benefits: [
      'Competitive base + high liquidity RSU equity',
      'Relocation assistance package up to $10,000',
      'Top-tier medical coverage'
    ],
    matchScore: 82,
    applicantsCount: 29,
    status: 'active'
  },
  {
    id: 'job-5',
    title: 'Lead Mobile UI/UX Engineer (Flutter & Dart)',
    company: 'Revolut',
    companyId: 'ent-revolut',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&h=120&fit=crop&q=80',
    location: 'London, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    salaryMin: 110000,
    salaryMax: 145000,
    currency: 'GBP',
    experienceLevel: 'Lead',
    department: 'Mobile Apps',
    postedAt: '3 days ago',
    description: 'Oversee the next version of our cross-platform mobile finance ecosystem built on Flutter and Dart, supporting 30M+ active retail and business users.',
    requirements: [
      'Deep fluency in Dart, Flutter state management (Bloc/Riverpod), and platform channels',
      'Background in fintech, payments security, or biometric auth integration',
      'Expertise in smooth 120Hz mobile interaction and animations'
    ],
    responsibilities: [
      'Refactor core payment flows to decrease transaction drop-offs',
      'Ensure zero downtime through modular CI/CD and progressive rollouts',
      'Direct our mobile QA testing strategy and device matrix testing'
    ],
    benefits: [
      'Hybrid allowance with Central London flagship office access',
      'Private health insurance (Bupa)',
      'Cycle to work scheme & gym memberships'
    ],
    matchScore: 88,
    applicantsCount: 63,
    status: 'active'
  },
  {
    id: 'job-6',
    title: 'Senior Backend Engineer (Distributed Systems)',
    company: 'Figma',
    companyId: 'ent-figma',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&h=120&fit=crop&q=80',
    location: 'Remote',
    latitude: 37.7749,
    longitude: -122.4194,
    workplaceType: 'Remote',
    jobType: 'Full-time',
    salaryMin: 170000,
    salaryMax: 215000,
    currency: 'USD',
    experienceLevel: 'Senior',
    department: 'Infrastructure',
    postedAt: '3 days ago',
    description: 'Power real-time multiplayer document synchronization, WebAssembly binary compilation services, and global asset distribution.',
    requirements: [
      'Solid command of Rust, C++, or Go for low-latency memory management',
      'Understanding of distributed consensus protocols (Raft, Paxos)',
      'Experience optimizing cloud storage for petabyte-scale graphics files'
    ],
    responsibilities: [
      'Scale real-time multiplayer synchronization servers globally',
      'Reduce p99 latency on vector graphic render requests below 15ms',
      'Architect resilient microservices running with zero packet loss'
    ],
    benefits: [
      'Work from anywhere in the Americas or Western Europe',
      'Generous parental leave (up to 20 weeks fully paid)',
      'Annual home tech stipend and ergonomic setup'
    ],
    matchScore: 85,
    applicantsCount: 91,
    featured: true,
    status: 'active'
  },
  {
    id: 'job-7',
    title: 'AI Prompt & Evaluation Engineer',
    company: 'OpenAI Research',
    companyId: 'ent-openai',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&h=120&fit=crop&q=80',
    location: 'San Francisco, CA',
    latitude: 37.7620,
    longitude: -122.4150,
    workplaceType: 'On-site',
    jobType: 'Full-time',
    salaryMin: 190000,
    salaryMax: 250000,
    currency: 'USD',
    experienceLevel: 'Senior',
    department: 'AI Safety & Alignment',
    postedAt: '4 days ago',
    description: 'Design rigorous evaluation suites, synthetic data loops, and safety red-teaming pipelines for next-gen reasoning models.',
    requirements: [
      'Degree in Computer Science, Linguistics, or Cognitive Science',
      'Deep experience evaluating and fine-tuning frontier foundation models',
      'Strong Python tooling skills with PyTorch or JAX familiarity'
    ],
    responsibilities: [
      'Create multi-step reasoning benchmarks across coding, logic, and math',
      'Collaborate with human-in-the-loop reviewers to validate ground truth',
      'Publish findings on model robustness and adversarial defenses'
    ],
    benefits: [
      'Premier health insurance with 100% employer paid premiums',
      'Aggressive equity package with regular liquidity events',
      'Full daily catering and artisanal barista on site'
    ],
    matchScore: 91,
    applicantsCount: 114,
    status: 'active'
  },
  {
    id: 'job-8',
    title: 'Junior Frontend Developer (React & TypeScript)',
    company: 'Shopify Growth',
    companyId: 'ent-shopify',
    companyLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop&q=80',
    location: 'Toronto, Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    workplaceType: 'Remote',
    jobType: 'Full-time',
    salaryMin: 85000,
    salaryMax: 105000,
    currency: 'CAD',
    experienceLevel: 'Entry-level',
    department: 'Merchant Solutions',
    postedAt: '1 week ago',
    description: 'An outstanding entry point for enthusiastic engineers wanting to build consumer-facing commerce widgets and store themes.',
    requirements: [
      '1+ years building modern web apps with React, HTML5, and CSS3',
      'Solid understanding of Git, component life cycles, and REST APIs',
      'Eagerness to learn and thrive in an inclusive, fast-paced mentorship environment'
    ],
    responsibilities: [
      'Implement responsive storefront components used by global merchants',
      'Write comprehensive unit tests with Vitest and React Testing Library',
      'Participate in design critiques and sprint retrospectives'
    ],
    benefits: [
      'Direct 1-on-1 mentorship with Staff Software Engineers',
      'Dedicated learning days every second Friday',
      'Remote home office setup allowance'
    ],
    matchScore: 78,
    applicantsCount: 180,
    status: 'active'
  },
  {
    id: 'job-9',
    title: 'Staff AI Platform Engineer',
    company: 'Anthropic Labs',
    companyId: 'ent-anthropic',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    location: 'San Jose, CA',
    latitude: 37.3382,
    longitude: -121.8863,
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    salaryMin: 185000,
    salaryMax: 240000,
    currency: 'USD',
    experienceLevel: 'Lead',
    department: 'AI Infrastructure',
    postedAt: '1 day ago',
    description: 'Architect low-latency GPU cluster orchestration and distributed checkpointing services for large-scale training pipelines in our Silicon Valley campus.',
    requirements: [
      'Proven background in distributed systems, CUDA, or high-performance networking',
      'Experience managing multi-node Kubernetes clusters with InfiniBand',
      'Strong command of Python, Go, or Rust'
    ],
    responsibilities: [
      'Scale compute infrastructure to 10,000+ accelerators',
      'Build automated health monitoring and failover loops'
    ],
    benefits: [
      'Full family medical, dental, and optical insurance',
      'High liquidity equity grants',
      'Silicon Valley commuter coach transit pass'
    ],
    matchScore: 93,
    applicantsCount: 41,
    featured: true,
    status: 'active'
  },
  {
    id: 'job-10',
    title: 'Senior Cloud Solutions Architect',
    company: 'Datadog',
    companyId: 'ent-datadog',
    companyLogo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop&q=80',
    location: 'Oakland, CA',
    latitude: 37.8044,
    longitude: -122.2712,
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    salaryMin: 160000,
    salaryMax: 205000,
    currency: 'USD',
    experienceLevel: 'Senior',
    department: 'Customer Engineering',
    postedAt: '3 days ago',
    description: 'Partner with top Bay Area enterprise clients to design scalable observability, container telemetry, and log streaming architectures.',
    requirements: [
      '5+ years cloud architecture on AWS, Azure, or GCP',
      'Hands-on experience with Terraform, container security, and SIEM',
      'Excellent presentation and whiteboarding skills'
    ],
    responsibilities: [
      'Design mission-critical observability solutions for Fortune 500 customers',
      'Bridge engineering and enterprise product teams'
    ],
    benefits: [
      'Flexible Oakland/SF hybrid schedule',
      'Catered lunches & wellness subsidy',
      'Comprehensive 401(k) matching'
    ],
    matchScore: 89,
    applicantsCount: 34,
    status: 'active'
  }
];


export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Full-Stack Engineer (AI Applications)',
    company: 'Anthropic Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    location: 'San Francisco, CA',
    appliedDate: 'Yesterday, 4:15 PM',
    stage: 'interview',
    salary: '$165,000 - $210,000',
    appliedWithResume: 'Alex_Morgan_Senior_Engineer_2026.pdf',
    matchScore: 97,
    notes: 'Technical screen passed with glowing feedback. Virtual onsite scheduled with the Lead AI Architect.',
    interviewDate: 'Tomorrow at 2:00 PM PST',
    nextStep: 'System Design & Real-Time Sync Interview (60 min)',
    applicantName: 'Alexandre Morgan',
    applicantEmail: 'alex.morgan@workpulse.io',
    applicantRole: 'Senior Full-Stack Engineer'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Staff Frontend Engineer - Design Systems',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop&q=80',
    location: 'Remote',
    appliedDate: '3 days ago',
    stage: 'screening',
    salary: '$180,000 - $235,000',
    appliedWithResume: 'Alex_Morgan_Senior_Engineer_2026.pdf',
    matchScore: 94,
    notes: 'Recruiter reached out on LinkedIn. Portfolio reviewed by Head of Design Engineering.',
    nextStep: 'Awaiting recruiter call feedback',
    applicantName: 'Alexandre Morgan',
    applicantEmail: 'alex.morgan@workpulse.io',
    applicantRole: 'Senior Full-Stack Engineer'
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'Product Engineering Lead',
    company: 'Notion',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&q=80',
    location: 'New York, NY',
    appliedDate: 'May 28, 2026',
    stage: 'applied',
    salary: '$175,000 - $220,000',
    appliedWithResume: 'Alex_Morgan_Senior_Engineer_2026.pdf',
    matchScore: 89,
    notes: 'Submitted via 1-Click Apply with portfolio link.',
    nextStep: 'Application undergoing hiring manager resume review',
    applicantName: 'Alexandre Morgan',
    applicantEmail: 'alex.morgan@workpulse.io',
    applicantRole: 'Senior Full-Stack Engineer'
  },
  {
    id: 'app-4',
    jobId: 'job-6',
    jobTitle: 'Senior Backend Engineer (Distributed Systems)',
    company: 'Figma',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&h=120&fit=crop&q=80',
    location: 'Remote',
    appliedDate: 'May 20, 2026',
    stage: 'offer',
    salary: '$170,000 - $215,000',
    appliedWithResume: 'Alex_Morgan_Senior_Engineer_2026.pdf',
    matchScore: 85,
    notes: 'Official Offer letter received! Base: $195,000 + $60k RSUs/yr. Decision deadline in 5 days.',
    nextStep: 'Review benefits summary and compensation package',
    applicantName: 'Alexandre Morgan',
    applicantEmail: 'alex.morgan@workpulse.io',
    applicantRole: 'Senior Full-Stack Engineer'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Interview Confirmed • Anthropic Labs',
    message: 'Your Technical System Design round with Senior Architect Maya Lin has been scheduled for tomorrow at 2:00 PM PST.',
    timestamp: '10 minutes ago',
    category: 'interview',
    read: false,
    actionLabel: 'View Meeting Link',
    actionTarget: 'interview-1',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80'
  },
  {
    id: 'notif-2',
    title: 'New Recruiter Message • Stripe',
    message: 'Sarah Jenkins sent you a message: "Hi Alex, we were deeply impressed by your design system open-source projects..."',
    timestamp: '45 minutes ago',
    category: 'message',
    read: false,
    actionLabel: 'Reply in Chat',
    actionTarget: 'chat-stripe',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop&q=80'
  },
  {
    id: 'notif-3',
    title: 'AI Match Alert (97% Fit)',
    message: 'A new role matching your skills in React, TypeScript, and Generative AI was just published by Anthropic Labs.',
    timestamp: '2 hours ago',
    category: 'ai_match',
    read: false,
    actionLabel: '1-Click Apply',
    actionTarget: 'job-1',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80'
  },
  {
    id: 'notif-4',
    title: 'Application Viewed by Notion',
    message: 'The hiring team at Notion viewed your application and downloaded your resume.',
    timestamp: '5 hours ago',
    category: 'application',
    read: true,
    actionLabel: 'View Status',
    actionTarget: 'app-3',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&q=80'
  },
  {
    id: 'notif-5',
    title: 'Offer Letter Received! • Figma',
    message: 'Congratulations! Figma has generated an official job offer for Senior Backend Engineer.',
    timestamp: '1 day ago',
    category: 'application',
    read: true,
    actionLabel: 'Review Offer',
    actionTarget: 'app-4',
    companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&h=120&fit=crop&q=80'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantName: 'Sarah Jenkins',
    participantRole: 'Lead Technical Recruiter',
    participantCompany: 'Stripe',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face&q=80',
    unreadCount: 1,
    lastMessage: 'Let me know if Friday at 11:00 AM PST works for an introductory call!',
    lastMessageTime: '11:42 AM',
    jobTitle: 'Staff Frontend Engineer - Design Systems',
    messages: [
      {
        id: 'msg-1',
        senderId: 'sarah-stripe',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face&q=80',
        text: 'Hi Alex! I came across your GitHub repository on micro-frontends and design tokens. Your work aligns remarkably well with what our Core UI team is building at Stripe.',
        timestamp: '10:15 AM',
        isRecruiter: true
      },
      {
        id: 'msg-2',
        senderId: 'user-alex',
        senderName: 'Alexandre Morgan',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces&q=80',
        text: 'Thanks so much for reaching out, Sarah! I have been following Stripe’s UI component engineering closely. I’d love to connect and learn more about the team goals.',
        timestamp: '10:30 AM',
        isRecruiter: false
      },
      {
        id: 'msg-3',
        senderId: 'sarah-stripe',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face&q=80',
        text: 'Let me know if Friday at 11:00 AM PST works for an introductory call! Here is the overview deck as well.',
        timestamp: '11:42 AM',
        isRecruiter: true,
        attachment: {
          name: 'Stripe_Design_Systems_Team_Charter.pdf',
          size: '3.4 MB'
        }
      }
    ]
  },
  {
    id: 'conv-2',
    participantName: 'David Kalu',
    participantRole: 'Engineering Manager',
    participantCompany: 'Anthropic Labs',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80',
    unreadCount: 0,
    lastMessage: 'The interview link for tomorrow is set. Looking forward to our deep dive!',
    lastMessageTime: 'Yesterday',
    jobTitle: 'Senior Full-Stack Engineer (AI Applications)',
    messages: [
      {
        id: 'msg-4',
        senderId: 'david-anthropic',
        senderName: 'David Kalu',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80',
        text: 'Alex, great job on the technical screening round. Your approach to WebSocket backpressure and streaming markdown parsing was top tier.',
        timestamp: 'Yesterday 3:00 PM',
        isRecruiter: true
      },
      {
        id: 'msg-5',
        senderId: 'david-anthropic',
        senderName: 'David Kalu',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&q=80',
        text: 'The interview link for tomorrow is set. Looking forward to our deep dive!',
        timestamp: 'Yesterday 3:45 PM',
        isRecruiter: true
      }
    ]
  },
  {
    id: 'conv-3',
    participantName: 'Elena Rostova',
    participantRole: 'Head of People Operations',
    participantCompany: 'Figma',
    participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face&q=80',
    unreadCount: 0,
    lastMessage: 'We have sent over the formal offer packet! Let us know when you would like to hop on a call to review.',
    lastMessageTime: 'May 20',
    jobTitle: 'Senior Backend Engineer',
    messages: [
      {
        id: 'msg-6',
        senderId: 'elena-figma',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face&q=80',
        text: 'We have sent over the formal offer packet! Let us know when you would like to hop on a call to review.',
        timestamp: 'May 20 4:10 PM',
        isRecruiter: true
      }
    ]
  }
];

export const OPERATIONAL_PHASES: OperationalPhase[] = [
  {
    number: 1,
    title: 'User Authentication',
    subtitle: 'Role-Based Access & Security',
    icon: 'Lock',
    targetTab: 'auth',
    seekerFocus: 'Sign up with resume parsing, 2FA security, multi-role profile switching.',
    adminFocus: 'Admin role verification, access control, audit logs, and session management.'
  },
  {
    number: 2,
    title: 'Profile Setup',
    subtitle: 'Professional Persona & Resume',
    icon: 'UserCheck',
    targetTab: 'profile',
    seekerFocus: 'Skills catalog, work experience, verified credentials, portfolio links, and preferred salary.',
    adminFocus: 'Candidate profile verification, skill taxonomy tagging, and talent directory indexing.'
  },
  {
    number: 3,
    title: 'Personal Dashboard',
    subtitle: 'Unified Command Center',
    icon: 'LayoutDashboard',
    targetTab: 'dashboard',
    seekerFocus: 'Key performance metrics, live status pipeline, recommended jobs, and interview calendar.',
    adminFocus: 'Company recruiting funnel, applicant influx metrics, team velocity, and position quotas.'
  },
  {
    number: 4,
    title: 'Job Search & Management',
    subtitle: 'Discovery & Smart Filtering',
    icon: 'Search',
    targetTab: 'jobs',
    seekerFocus: 'Location radius filters, remote/hybrid switches, salary ranges, and bookmarking.',
    adminFocus: 'Post new positions, edit live listings, manage department quotas, and toggle visibility.'
  },
  {
    number: 5,
    title: 'Application Process',
    subtitle: '1-Click Apply & Custom Submissions',
    icon: 'Send',
    targetTab: 'jobs',
    seekerFocus: 'Instant one-click application using saved resume, tailored cover letters, screening answers.',
    adminFocus: 'Configure custom job questionnaires, required documentation, and automated acknowledgments.'
  },
  {
    number: 6,
    title: 'Application Tracking',
    subtitle: 'Kanban & Pipeline Progression',
    icon: 'GitPullRequest',
    targetTab: 'applications',
    seekerFocus: 'Real-time stage tracking (Applied → Screening → Interview → Offer), notes, and deadlines.',
    adminFocus: 'Recruiter CRM board, drag-and-drop candidate progression, scorecards, and hiring decisions.'
  },
  {
    number: 7,
    title: 'Messaging & Communication',
    subtitle: 'Direct Recruiter & Candidate Chat',
    icon: 'MessageSquare',
    targetTab: 'messages',
    seekerFocus: 'Direct messaging with hiring managers, instant interview rescheduling, and attachments.',
    adminFocus: 'Recruiter message inbox, automated outreach templates, candidate scheduling sync.'
  },
  {
    number: 8,
    title: 'Real-Time Notifications',
    subtitle: 'Instant Alerts & Updates',
    icon: 'Bell',
    targetTab: 'notifications',
    seekerFocus: 'Instant push alerts for interview invites, application views, offer letters, and job matches.',
    adminFocus: 'Candidate submission alerts, hiring manager feedback reminders, broadcast announcements.'
  },
  {
    number: 9,
    title: 'System Administration',
    subtitle: 'Enterprise Control & Moderation',
    icon: 'ShieldCheck',
    targetTab: 'admin',
    seekerFocus: 'Data privacy controls, export application history, account deletion compliance.',
    adminFocus: 'Global user management, job post moderation, platform logs, RBAC permissions, and metrics.'
  },
  {
    number: 10,
    title: 'Advanced AI Features',
    subtitle: 'Intelligence & Career Automation',
    icon: 'Sparkles',
    targetTab: 'ai_suite',
    seekerFocus: 'AI Resume Score Analyzer, tailored cover letter writer, match breakdown, and interview coach.',
    adminFocus: 'AI Candidate ranking, automated resume parsing & scoring, job description enhancer.'
  }
];

export const CITIES_LIST = [
  'All Locations',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Singapore',
  'Tokyo, Japan',
  'Remote'
];
