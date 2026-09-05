import { Enterprise } from '../types/job';

export const INITIAL_ENTERPRISES: Enterprise[] = [
  {
    id: 'ent-anthropic',
    name: 'Anthropic Labs',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=400&fit=crop&q=80',
    headline: 'AI Research & Safety Company Building Reliable, Interpretable, and Steerable AI',
    industry: 'Artificial Intelligence & Machine Learning',
    headquarters: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    size: '500 - 1,000 employees',
    founded: '2021',
    website: 'https://anthropic.com',
    description: 'Anthropic is an AI safety and research company dedicated to building frontier foundation models and agentic computing interfaces. We conduct cutting-edge research in interpretability, alignment, and scalable supervision.',
    verified: true,
    perks: [
      'Comprehensive medical, dental, and vision with 100% premium coverage',
      '$4,000 annual personal learning & conference budget',
      'Flexible hybrid schedule (2-3 days in SF office)',
      'Relocation assistance up to $15,000 for qualifying engineers',
      'Unlimited PTO with mandatory annual minimum'
    ],
    techStack: ['Python', 'TypeScript', 'React', 'PyTorch', 'JAX', 'Kubernetes', 'AWS/GCP'],
    cultureHighlights: [
      'Research-first intellectual rigor',
      'Safety and alignment at the core of all releases',
      'Flat collaborative engineering hierarchy'
    ],
    followerCount: 2430,
    isFollowing: true,
    announcements: [
      {
        id: 'ann-ant-1',
        enterpriseId: 'ent-anthropic',
        title: '📢 Q3 Engineering Hiring Blitz: 25+ New Roles in San Francisco & Hybrid',
        category: 'Hiring Blitz',
        content: 'We are expanding our AI Applications and Frontend Architecture groups! If you love streaming token renderers, agentic collaboration workbenches, or distributed inference caching, we are actively interviewing across all levels.',
        date: '2 days ago',
        authorName: 'Sarah Lin',
        authorRole: 'Head of Technical Recruiting',
        pinned: true,
        linkUrl: '#jobs',
        linkText: 'View Open Roles',
        likesCount: 142
      },
      {
        id: 'ann-ant-2',
        enterpriseId: 'ent-anthropic',
        title: '🚀 Virtual Engineering Open House: Building High-Throughput Agentic UIs',
        category: 'Tech Talk',
        content: 'Join our Staff Frontend & Systems Engineers this Thursday at 5 PM PST for a technical walkthrough on building sub-10ms streaming LLM interfaces and state synchronization algorithms.',
        date: '5 days ago',
        authorName: 'Alex Thorne',
        authorRole: 'VP of Engineering',
        pinned: false,
        linkUrl: 'https://workpulse.io/webinar/anthropic',
        linkText: 'Register for Livestream',
        likesCount: 89
      },
      {
        id: 'ann-ant-3',
        enterpriseId: 'ent-anthropic',
        title: '🌿 Sustainability Milestone: Achieving 100% Clean Energy Compute Across Research Clusters',
        category: 'Company Milestone',
        content: 'We are proud to announce that all frontier training runs and production inference clusters are now powered by 100% certified renewable energy infrastructure.',
        date: '2 weeks ago',
        authorName: 'Elena Rostova',
        authorRole: 'Infrastructure Operations Lead',
        pinned: false,
        likesCount: 215
      }
    ]
  },
  {
    id: 'ent-stripe',
    name: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&h=400&fit=crop&q=80',
    headline: 'Financial Infrastructure for the Internet',
    industry: 'FinTech & Payments Infrastructure',
    headquarters: 'San Francisco, CA & Dublin, Ireland',
    latitude: 37.7765,
    longitude: -122.3920,
    size: '7,000+ employees',
    founded: '2010',
    website: 'https://stripe.com',
    description: 'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size—from new startups to public companies—use our software to accept payments and manage their businesses online.',
    verified: true,
    perks: [
      'Work from anywhere: 100% remote-first engineering culture',
      'Competitive equity compensation with biannual liquidity windows',
      'Annual $2,500 home workstation upgrade stipend',
      '16-24 weeks fully paid parental leave worldwide'
    ],
    techStack: ['Ruby', 'TypeScript', 'React', 'Go', 'Java', 'Sorbet', 'Kafka', 'AWS'],
    cultureHighlights: [
      'Documented culture: write clear proposals before coding',
      'Obsession with developer experience and precision APIs',
      'Global remote parity'
    ],
    followerCount: 5120,
    isFollowing: false,
    announcements: [
      {
        id: 'ann-str-1',
        enterpriseId: 'ent-stripe',
        title: '🌐 Open-Sourcing Our Next-Gen Multi-Platform Design System Tokens',
        category: 'Product Launch',
        content: 'Today we are open-sourcing our core token engine and React UI accessibility primitives powering Stripe Dashboard and checkout flows across 130+ currencies.',
        date: '3 days ago',
        authorName: 'Marcus Vance',
        authorRole: 'Design Engineering Director',
        pinned: true,
        linkUrl: 'https://github.com/stripe',
        linkText: 'Check GitHub Repo',
        likesCount: 310
      },
      {
        id: 'ann-str-2',
        enterpriseId: 'ent-stripe',
        title: '💼 Global Remote Engineering Compensation Bands Updated for 2026',
        category: 'Workplace & Culture',
        content: 'We have updated our remote salary tiers across North America and Europe to align with top-of-market technology benchmarks, including enhanced 401(k) and pension matching.',
        date: '1 week ago',
        authorName: 'Rachel Green',
        authorRole: 'Chief People Officer',
        pinned: false,
        likesCount: 184
      }
    ]
  },
  {
    id: 'ent-notion',
    name: 'Notion',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=400&fit=crop&q=80',
    headline: 'The Connected Workspace for Notes, Docs, Wikis, and Projects',
    industry: 'Productivity Software & Collaboration',
    headquarters: 'New York, NY & San Francisco, CA',
    latitude: 40.7128,
    longitude: -74.0060,
    size: '800 - 1,200 employees',
    founded: '2016',
    website: 'https://notion.so',
    description: 'Notion combines everyday work apps into one. It is an all-in-one workspace where you can write, plan, collaborate, and get organized. With built-in AI intelligence, Notion helps teams move faster.',
    verified: true,
    perks: [
      'Gourmet daily lunch and culinary snacks at NY & SF offices',
      'Annual team offsites in Kyoto, Lisbon, and Vancouver',
      'Complete wellness concierge & mental health coaching',
      'Comprehensive 401(k) matching up to 5%'
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Rust', 'CRDTs'],
    cultureHighlights: [
      'Craftsmanship, curiosity, and beautiful software aesthetics',
      'Small, autonomous squads with high product ownership',
      'Kindness and candid peer reviews'
    ],
    followerCount: 3890,
    isFollowing: true,
    announcements: [
      {
        id: 'ann-not-1',
        enterpriseId: 'ent-notion',
        title: '🎉 Notion AI 3.0 Launch: Multi-Page Reasoning and Autonomous Workflows',
        category: 'Product Launch',
        content: 'We are thrilled to roll out Notion AI 3.0 to over 40 million users worldwide. Huge congratulations to our product and machine learning teams who made this possible!',
        date: 'Yesterday',
        authorName: 'Kenji Sato',
        authorRole: 'Product Lead',
        pinned: true,
        likesCount: 420
      },
      {
        id: 'ann-not-2',
        enterpriseId: 'ent-notion',
        title: '🏢 Expanding Manhattan Tech Hub: Welcoming 50 New Engineers to SoHo Campus',
        category: 'Company Milestone',
        content: 'Our brand new engineering floor in SoHo is officially open! Features include dedicated acoustic focus pods, maker spaces, and a rooftop collaboration garden.',
        date: '4 days ago',
        authorName: 'Maya Patel',
        authorRole: 'Site Director NYC',
        pinned: false,
        likesCount: 165
      }
    ]
  },
  {
    id: 'ent-datadog',
    name: 'Datadog',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&h=400&fit=crop&q=80',
    headline: 'Cloud Monitoring as a Service: Observe Every Layer of Your Modern Stack',
    industry: 'Cloud Infrastructure & Telemetry',
    headquarters: 'Austin, TX & New York, NY',
    latitude: 30.2672,
    longitude: -97.7431,
    size: '5,000+ employees',
    founded: '2010',
    website: 'https://datadoghq.com',
    description: 'Datadog is an observability service for cloud-scale applications, providing monitoring of servers, databases, tools, and services through a SaaS-based data analytics platform.',
    verified: true,
    perks: [
      'Relocation assistance package up to $10,000 for Austin or NYC',
      'Stock Purchase Plan (ESPP) with generous discount',
      'Tuition reimbursement & professional cert sponsorship',
      'Comprehensive family medical coverage'
    ],
    techStack: ['Go', 'Python', 'Kubernetes', 'Terraform', 'Kafka', 'PostgreSQL', 'React'],
    cultureHighlights: [
      'High-scale distributed systems challenges',
      'Data-driven engineering decisions',
      'Inclusive global community'
    ],
    followerCount: 2950,
    isFollowing: false,
    announcements: [
      {
        id: 'ann-dd-1',
        enterpriseId: 'ent-datadog',
        title: '⚡ Ingesting 25 Trillion Events Daily: How Our Infrastructure Scales Across 3 Clouds',
        category: 'Tech Talk',
        content: 'Read our latest architectural deep-dive into how we maintain 99.999% reliability across multi-cloud failover zones during global peak traffic.',
        date: '3 days ago',
        authorName: 'David Chen',
        authorRole: 'Chief Technology Officer',
        pinned: true,
        linkUrl: 'https://datadoghq.com/blog',
        linkText: 'Read Architectural Whitepaper',
        likesCount: 278
      }
    ]
  },
  {
    id: 'ent-revolut',
    name: 'Revolut',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&h=400&fit=crop&q=80',
    headline: 'One App for All Things Money Across 40+ Countries',
    industry: 'FinTech & Digital Banking',
    headquarters: 'London, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    size: '8,000+ employees',
    founded: '2015',
    website: 'https://revolut.com',
    description: 'Revolut is building the world’s first truly global financial superapp. In 2015, Revolut launched in the UK offering money transfer and exchange. Today, more than 40 million customers around the world use dozens of Revolut products.',
    verified: true,
    perks: [
      'Central London Canary Wharf flagship campus with gym and barista',
      'Private health insurance (Bupa Platinum tier)',
      'Cycle to work scheme and London transit commuter subsidies',
      'International transfer bonus allowances'
    ],
    techStack: ['Dart', 'Flutter', 'Java', 'Kotlin', 'GCP', 'PostgreSQL'],
    cultureHighlights: [
      'Rapid delivery and high-velocity product sprints',
      'Global customer obsession',
      'High ownership and clear meritocracy'
    ],
    followerCount: 3410,
    isFollowing: false,
    announcements: [
      {
        id: 'ann-rev-1',
        enterpriseId: 'ent-revolut',
        title: '🇬🇧 London FinTech Hub Expansion: 40 Open Engineering Seats in Canary Wharf',
        category: 'Hiring Blitz',
        content: 'We are growing our Mobile Core & International Settlements teams right in London. Enjoy hybrid flexibility with access to our modern Canary Wharf offices.',
        date: '5 days ago',
        authorName: 'Oliver Sterling',
        authorRole: 'Head of Engineering Talent',
        pinned: true,
        likesCount: 198
      }
    ]
  },
  {
    id: 'ent-figma',
    name: 'Figma',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1400&h=400&fit=crop&q=80',
    headline: 'How Teams Design, Prototype, and Build Products Together',
    industry: 'Design & Collaboration Tools',
    headquarters: 'Remote / San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
    size: '1,500+ employees',
    founded: '2012',
    website: 'https://figma.com',
    description: 'Figma is the leading collaborative design platform on the web. It brings teams together in real time across brainstorming, UI design, vector graphics, and developer handoff.',
    verified: true,
    perks: [
      'Remote-first: work from anywhere across North America and Europe',
      '20 weeks fully paid parental leave',
      'Annual $3,000 continuous education and tech conference fund',
      'Comprehensive wellness and mental fitness subscriptions'
    ],
    techStack: ['Rust', 'WebAssembly', 'TypeScript', 'React', 'C++', 'Go', 'AWS'],
    cultureHighlights: [
      'Uncompromising dedication to visual precision and craft',
      'Deep respect for engineers and designers co-creating',
      'Low-latency performance optimization'
    ],
    followerCount: 6800,
    isFollowing: true,
    announcements: [
      {
        id: 'ann-fig-1',
        enterpriseId: 'ent-figma',
        title: '🎨 Config 2026 Announced: Join 15,000 Creators Live or Virtually',
        category: 'Company Milestone',
        content: 'Config 2026 call for speakers is now officially open! We are looking for talks on WebAssembly performance, AI design agents, and distributed multiplayer state engines.',
        date: '1 week ago',
        authorName: 'Dylan Field',
        authorRole: 'CEO & Co-founder',
        pinned: true,
        likesCount: 540
      }
    ]
  },
  {
    id: 'ent-openai',
    name: 'OpenAI Research',
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&h=400&fit=crop&q=80',
    headline: 'Creating Safe Artificial General Intelligence that Benefits All of Humanity',
    industry: 'Frontier AI Research & Systems',
    headquarters: 'San Francisco, CA',
    latitude: 37.7620,
    longitude: -122.4150,
    size: '1,500 - 2,500 employees',
    founded: '2015',
    website: 'https://openai.com',
    description: 'OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.',
    verified: true,
    perks: [
      'Industry-leading compensation & regular equity liquidity',
      '100% employer paid medical, dental, and vision for employees & dependents',
      'Chef-prepared daily breakfast, lunch, and dinner on campus',
      'Generous parental leave and fertility support'
    ],
    techStack: ['Python', 'PyTorch', 'Kubernetes', 'Azure', 'TypeScript', 'Rust'],
    cultureHighlights: [
      'High agency and exceptional problem solvers',
      'Mission-critical focus on safety and alignment',
      'World-class compute resources'
    ],
    followerCount: 8900,
    isFollowing: true,
    announcements: [
      {
        id: 'ann-oai-1',
        enterpriseId: 'ent-openai',
        title: '🔬 Next-Gen Reasoning Benchmark Results Published with Open Safety Suites',
        category: 'Tech Talk',
        content: 'We have published full evaluation metrics and automated red-teaming datasets for community validation.',
        date: '4 days ago',
        authorName: 'Ilya Sutskever Alumni Lab',
        authorRole: 'Research Alignment',
        pinned: true,
        likesCount: 680
      }
    ]
  },
  {
    id: 'ent-shopify',
    name: 'Shopify Growth',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=400&fit=crop&q=80',
    headline: 'Making Commerce Better for Everyone Everywhere',
    industry: 'E-Commerce Infrastructure',
    headquarters: 'Toronto, Canada & Remote',
    latitude: 43.6532,
    longitude: -79.3832,
    size: '10,000+ employees',
    founded: '2006',
    website: 'https://shopify.com',
    description: 'Shopify provides trusted tools to start, grow, market, and manage a retail business of any size. Making commerce better for everyone so businesses can focus on what they do best.',
    verified: true,
    perks: [
      'Digital by Default: complete remote work freedom',
      'Flex-hours and bi-weekly learning Fridays',
      'Generous wellness and ergonomic home office budgets',
      'Comprehensive parental and mental health support'
    ],
    techStack: ['Ruby on Rails', 'TypeScript', 'React', 'React Native', 'GraphQL', 'MySQL'],
    cultureHighlights: [
      'Digital by default and high autonomy',
      'Founder mindset across every team',
      'Constant experimentation and learning'
    ],
    followerCount: 3100,
    isFollowing: false,
    announcements: [
      {
        id: 'ann-shp-1',
        enterpriseId: 'ent-shopify',
        title: '🍁 Digital by Default 2026: Remote Work Stipends and Global Developer Grants',
        category: 'Workplace & Culture',
        content: 'We are expanding our global developer grants for open-source contributors and remote engineers across Canada, US, and Europe.',
        date: '6 days ago',
        authorName: 'Claire Tremblay',
        authorRole: 'VP Engineering Culture',
        pinned: false,
        likesCount: 145
      }
    ]
  }
];
