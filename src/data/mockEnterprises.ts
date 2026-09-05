import { Enterprise } from '../types/job';

export const INITIAL_ENTERPRISES: Enterprise[] = [
  {
    id: 'ent-stripe',
    name: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop&q=80',
    headline: 'Financial infrastructure for the internet millions of companies use to scale.',
    industry: 'FinTech & Payments',
    headquarters: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    size: '8,000+ employees',
    founded: '2010',
    website: 'https://stripe.com',
    description: 'Stripe builds financial and economic infrastructure for the internet. Businesses of every size—from new startups to public companies—use our software to accept payments and manage their businesses online.',
    verified: true,
    followerCount: 24800,
    isFollowing: true,
    perks: [
      'Comprehensive medical, dental, and vision coverage',
      'Flexible remote and hybrid workplace options',
      'Generous parental leave and family support stipends',
      'Annual continuous education and book budgets',
      'Commuter allowances and ergonomic equipment setup'
    ],
    techStack: ['TypeScript', 'Ruby', 'React', 'Go', 'AWS', 'Kubernetes', 'Kafka'],
    cultureHighlights: [
      'Written culture with deep intellectual rigor and transparent memos',
      'Customer-centric product velocity and craft excellence',
      'High ownership teams with distributed autonomy'
    ],
    announcements: [
      {
        id: 'ann-stripe-1',
        enterpriseId: 'ent-stripe',
        title: 'Spring 2026 Engineering Blitz: 50+ Global Positions Open',
        category: 'Hiring Blitz',
        content: 'We are expanding our core payment API and developer tooling engineering organizations across North America and Europe. Openings range from Staff Full-Stack to Distributed Infrastructure Leads.',
        date: '2 hours ago',
        authorName: 'Sarah Jenkins',
        authorRole: 'Head of Global Tech Talent',
        pinned: true,
        linkUrl: '#jobs',
        linkText: 'Explore Open Positions',
        likesCount: 142
      },
      {
        id: 'ann-stripe-2',
        enterpriseId: 'ent-stripe',
        title: 'Tech Talk: Next-Generation Real-Time Settlement Engine',
        category: 'Tech Talk',
        content: 'Join our principal architects on Thursday for an interactive deep-dive into how Stripe handles over 500,000 financial state mutations per second with sub-10ms latency.',
        date: 'Yesterday',
        authorName: 'Michael Chen',
        authorRole: 'Principal Platform Engineer',
        pinned: false,
        linkUrl: 'https://stripe.com',
        linkText: 'Reserve Virtual Pass',
        likesCount: 89
      }
    ]
  },
  {
    id: 'ent-anthropic',
    name: 'Anthropic Labs',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop&q=80',
    headline: 'AI safety and research company dedicated to building reliable, interpretable AI systems.',
    industry: 'Artificial Intelligence',
    headquarters: 'San Francisco, CA',
    latitude: 37.7790,
    longitude: -122.4100,
    size: '600+ employees',
    founded: '2021',
    website: 'https://anthropic.com',
    description: 'Anthropic is an AI safety and research company that’s working to build reliable, beneficial, and steerable artificial intelligence systems.',
    verified: true,
    followerCount: 39500,
    isFollowing: true,
    perks: [
      'Top-tier equity compensation and competitive market base',
      'Cutting-edge compute clusters and H100 access',
      'Daily chef-catered lunches and wellness stipends',
      'Full healthcare coverage including mental wellness therapy'
    ],
    techStack: ['Python', 'PyTorch', 'TypeScript', 'React', 'Rust', 'CUDA', 'GCP'],
    cultureHighlights: [
      'Rigorous scientific and empirical methodology',
      'Deep focus on AI safety, alignment, and societal impact',
      'Collaborative, low-ego research environment'
    ],
    announcements: [
      {
        id: 'ann-anthropic-1',
        enterpriseId: 'ent-anthropic',
        title: 'Expanding Our Human-AI Interaction & Frontend Engineering Division',
        category: 'Hiring Blitz',
        content: 'We are actively recruiting Senior Frontend and Interaction Designers to build next-generation interfaces for steerable Claude systems and interactive research consoles.',
        date: '3 hours ago',
        authorName: 'David Kalu',
        authorRole: 'Director of AI Talent',
        pinned: true,
        linkUrl: '#jobs',
        linkText: 'View AI Roles',
        likesCount: 215
      },
      {
        id: 'ann-anthropic-2',
        enterpriseId: 'ent-anthropic',
        title: 'New Frontier Model Safety Paper Published',
        category: 'Company Milestone',
        content: 'Our alignment team released our findings on scalable oversight and mechanistic interpretability. Thank you to the broader research community for feedback.',
        date: '3 days ago',
        authorName: 'Dr. Amanda Reyes',
        authorRole: 'Safety Research Lead',
        pinned: false,
        linkUrl: 'https://anthropic.com',
        linkText: 'Read Whitepaper',
        likesCount: 168
      }
    ]
  },
  {
    id: 'ent-datadog',
    name: 'Datadog',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop&q=80',
    headline: 'The essential observability, monitoring, and security platform for cloud applications.',
    industry: 'Cloud Infrastructure & Monitoring',
    headquarters: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    size: '5,000+ employees',
    founded: '2010',
    website: 'https://datadoghq.com',
    description: 'Datadog is an observability service for cloud-scale applications, providing monitoring of servers, databases, tools, and services through a SaaS-based data analytics platform.',
    verified: true,
    followerCount: 18200,
    isFollowing: false,
    perks: [
      'Comprehensive 401(k) matching and financial planning',
      'Flexible time off and paid volunteer days',
      'Commuter reimbursement and NYC office amenities',
      'Gym passes and wellness reimbursement'
    ],
    techStack: ['Go', 'Python', 'React', 'TypeScript', 'PostgreSQL', 'Kafka', 'Kubernetes'],
    cultureHighlights: [
      'Extreme scale engineering solving trillions of telemetry events daily',
      'Open-source contribution programs',
      'Continuous learning and cross-office exchange'
    ],
    announcements: [
      {
        id: 'ann-datadog-1',
        enterpriseId: 'ent-datadog',
        title: 'New York Tech Hub Expansion: 25+ Infrastructure Engineering Roles',
        category: 'Hiring Blitz',
        content: 'Join our NYC HQ teams scaling high-throughput time-series databases and real-time anomaly detection pipelines.',
        date: '5 hours ago',
        authorName: 'Rachel Green',
        authorRole: 'Senior Technical Recruiter',
        pinned: true,
        linkUrl: '#jobs',
        linkText: 'Check NYC Positions',
        likesCount: 64
      }
    ]
  },
  {
    id: 'ent-figma',
    name: 'Figma',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop&q=80',
    headline: 'Where teams design, prototype, and build collaborative software together.',
    industry: 'Design & Collaboration Tools',
    headquarters: 'San Francisco, CA',
    latitude: 37.7810,
    longitude: -122.4000,
    size: '1,500+ employees',
    founded: '2012',
    website: 'https://figma.com',
    description: 'Figma connects everyone in the software design process so teams can deliver better products, faster. Free, collaborative design and prototyping tool for the browser.',
    verified: true,
    followerCount: 31200,
    isFollowing: true,
    perks: [
      'Design & creative stipend for art, crafts, and home studio',
      'Generous parental leave and fertility support',
      'Remote-friendly team options across US and Europe',
      'Full health, dental, and vision with 100% premium coverage'
    ],
    techStack: ['TypeScript', 'C++', 'WebAssembly', 'React', 'Rust', 'WebGL'],
    cultureHighlights: [
      'Obsessive focus on craftsmanship, graphics fidelity, and real-time collaboration',
      'Playful and creative work environment',
      'User-first product intuition'
    ],
    announcements: [
      {
        id: 'ann-figma-1',
        enterpriseId: 'ent-figma',
        title: 'Config 2026 Speaker Submissions & Engineering Keynotes Open',
        category: 'Tech Talk',
        content: 'We are accepting proposal abstracts for our upcoming annual conference. Come share how your team pushes web performance boundaries.',
        date: '1 day ago',
        authorName: 'Dylan Field',
        authorRole: 'CEO & Co-founder',
        pinned: true,
        linkUrl: 'https://figma.com',
        linkText: 'Learn More',
        likesCount: 310
      }
    ]
  },
  {
    id: 'ent-veloce',
    name: 'Veloce Cloud Systems',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop&q=80',
    headline: 'Ultra-low latency edge cloud compute and distributed serverless streaming.',
    industry: 'Cloud Infrastructure & Edge Compute',
    headquarters: 'San Francisco, CA',
    latitude: 37.7650,
    longitude: -122.4200,
    size: '450+ employees',
    founded: '2020',
    website: 'https://velocecloud.io',
    description: 'Veloce powers edge computing runtimes and zero-cold-start serverless environments across 300+ global edge locations.',
    verified: true,
    followerCount: 9400,
    isFollowing: false,
    perks: [
      'Flexible remote schedule with yearly global offsites',
      'Home office ergonomic budget ($2,500)',
      'Unlimited book, course, and conference attendance stipends',
      'Comprehensive medical and pension matches'
    ],
    techStack: ['Rust', 'Zig', 'TypeScript', 'Linux eBPF', 'Docker', 'React'],
    cultureHighlights: [
      'Performance obsession and microsecond profiling',
      'Radical candor and peer code reviews',
      'Async-first work communication'
    ],
    announcements: [
      {
        id: 'ann-veloce-1',
        enterpriseId: 'ent-veloce',
        title: 'Announcing Series B Funding & Global Edge Scaling Blitz',
        category: 'Company Milestone',
        content: 'Veloce has closed $48M in Series B financing to accelerate our worldwide edge node deployments. Hiring across distributed systems, kernel engineering, and frontend tooling.',
        date: '4 days ago',
        authorName: 'Marcus Vance',
        authorRole: 'Founder & CEO',
        pinned: true,
        linkUrl: '#jobs',
        linkText: 'View Series B Roles',
        likesCount: 178
      }
    ]
  }
];
