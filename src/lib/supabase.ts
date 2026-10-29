import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isLiveSupabase = Boolean(
  rawUrl &&
    rawKey &&
    !rawUrl.includes("placeholder") &&
    rawUrl.startsWith("http")
);

const supabaseUrl = rawUrl || "https://placeholder.supabase.co";
const supabaseAnonKey = rawKey || "placeholder-anon-key";

// Real client instance
export const realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// Mock Fallback Client for Local Dev & Testing Without Credentials
// ====================================================================

interface MockUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  created_at: string;
}

interface MockSession {
  access_token: string;
  user: MockUser;
}

const STORAGE_USERS_KEY = "cc_mock_users";
const STORAGE_SESSION_KEY = "cc_mock_session";
const STORAGE_PROFILES_KEY = "cc_mock_profiles";
const STORAGE_SOCIAL_KEY = "cc_mock_social_links";
const STORAGE_STUDENT_LINKS_KEY = "cc_mock_student_links";
const STORAGE_PROJECTS_KEY = "cc_mock_projects";
const STORAGE_ACHIEVEMENTS_KEY = "cc_mock_achievements";
const STORAGE_CERTIFICATES_KEY = "cc_mock_certificates";
const STORAGE_RESUMES_KEY = "cc_mock_resumes";
const STORAGE_ANALYTICS_KEY = "cc_mock_analytics";
const STORAGE_COLLEGES_KEY = "cc_mock_colleges_v14";
const STORAGE_COLLEGE_MEMBERS_KEY = "cc_mock_college_members_v14";
const STORAGE_PLANS_KEY = "cc_mock_plans_v15";
const STORAGE_SUBSCRIPTIONS_KEY = "cc_mock_subscriptions_v15";
const STORAGE_ENTITLEMENTS_KEY = "cc_mock_entitlements_v15";
const STORAGE_BILLING_EVENTS_KEY = "cc_mock_billing_events_v15";

export const DEFAULT_PROFILES: any[] = [
  {
    id: "usr_sreehari",
    username: "sreehari",
    full_name: "Sreehari Nair",
    avatar_url: "",
    bio: "Building CollegeCentre 2.0. Distributed systems, web platform architecture, and developer productivity tools.",
    college: "National Institute of Technology Calicut",
    college_id: "col_nit",
    college_slug: "nit-calicut",
    show_college_on_profile: true,
    show_in_college_directory: true,
    course: "Computer Science & Engineering",
    graduation_year: 2026,
    theme: "obsidian",
    is_public: true,
    is_discoverable: true,
    location: "Bengaluru, India",
    category: "engineering",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Rust", "PostgreSQL"],
    is_featured: true,
    views_count: 189,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_alex",
    username: "alexrivera",
    full_name: "Alex Rivera",
    avatar_url: "",
    bio: "Building visual SLAM kernels for autonomous aerial drones and low-latency ROS2 nodes. ACM SIGGRAPH & HackMIT finalist.",
    college: "University of California, Berkeley",
    college_id: "col_berkeley",
    college_slug: "uc-berkeley",
    show_college_on_profile: true,
    show_in_college_directory: true,
    course: "B.S. EECS & Robotics",
    graduation_year: 2026,
    theme: "cobalt",
    is_public: true,
    is_discoverable: true,
    location: "Berkeley, CA",
    category: "engineering",
    skills: ["C++20", "ROS2", "CUDA", "OpenCV", "Jetson Orin"],
    is_featured: true,
    views_count: 142,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_priya",
    username: "priyasharma",
    full_name: "Priya Sharma",
    avatar_url: "",
    bio: "Researching multimodal foundation models and interactive latency constraints. NeurIPS 2025 Workshop Author.",
    college: "Stanford University",
    college_id: "col_stanford",
    college_slug: "stanford-university",
    show_college_on_profile: true,
    show_in_college_directory: true,
    course: "M.S. Artificial Intelligence & HCI",
    graduation_year: 2025,
    theme: "academic",
    is_public: true,
    is_discoverable: true,
    location: "Stanford, CA",
    category: "research",
    skills: ["PyTorch", "HuggingFace", "FastAPI", "React", "KaTeX"],
    is_featured: true,
    views_count: 165,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_kavya",
    username: "kavyapatel",
    full_name: "Kavya Patel",
    avatar_url: "",
    bio: "Kernel hacker, eBPF observer, and rustaceans lead at GT Systems Lab.",
    college: "Georgia Institute of Technology",
    course: "B.S. Computer Science & Systems",
    graduation_year: 2027,
    theme: "terminal",
    is_public: true,
    is_discoverable: true,
    location: "Atlanta, GA",
    category: "engineering",
    skills: ["Rust", "eBPF", "Linux Kernel", "XDP", "Tokio"],
    is_featured: false,
    views_count: 98,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_elena",
    username: "elenarostova",
    full_name: "Elena Rostova",
    avatar_url: "",
    bio: "Designing accessible spatial interfaces and micro-interactions. Winner Apple Design Award 2025.",
    college: "Carnegie Mellon University",
    college_id: "col_cmu",
    college_slug: "cmu",
    show_college_on_profile: true,
    show_in_college_directory: true,
    course: "M.Des Human-Computer Interaction",
    graduation_year: 2025,
    theme: "creative",
    is_public: true,
    is_discoverable: true,
    location: "Pittsburgh, PA",
    category: "design",
    skills: ["Figma", "Design Systems", "Three.js", "Tailwind CSS", "React"],
    is_featured: true,
    views_count: 210,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-10T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_marcus",
    username: "marcuschen",
    full_name: "Marcus Chen",
    avatar_url: "",
    bio: "Building high-throughput telemetry pipelines and database storage engines in Zig and Go.",
    college: "University of Waterloo",
    course: "B.S. Software Engineering",
    graduation_year: 2026,
    theme: "developer",
    is_public: true,
    is_discoverable: true,
    location: "Waterloo, Canada",
    category: "engineering",
    skills: ["Zig", "Go", "PostgreSQL", "Kafka", "Distributed Systems"],
    is_featured: false,
    views_count: 115,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-15T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_ananya",
    username: "ananyarao",
    full_name: "Ananya Rao",
    avatar_url: "",
    bio: "Simulating hypersonic boundary layer turbulence with GPU clusters and OpenFOAM.",
    college: "IIT Madras",
    course: "B.Tech Aerospace Engineering",
    graduation_year: 2025,
    theme: "academic",
    is_public: true,
    is_discoverable: true,
    location: "Chennai, India",
    category: "research",
    skills: ["Python", "CUDA", "C++", "OpenFOAM", "Fluid Dynamics"],
    is_featured: false,
    views_count: 125,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-20T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_hidden",
    username: "devinhidden",
    full_name: "Devin Hidden",
    avatar_url: "",
    bio: "Systems programmer at Harvard. Prefers unlisted portfolio.",
    college: "Harvard University",
    course: "A.B. Computer Science",
    graduation_year: 2026,
    theme: "minimal",
    is_public: true,
    is_discoverable: false,
    location: "Cambridge, MA",
    category: "engineering",
    skills: ["C", "Assembly", "Operating Systems"],
    is_featured: false,
    views_count: 40,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-10-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_private",
    username: "privateuser",
    full_name: "Jordan Lee",
    avatar_url: "",
    bio: "Quantum algorithms and condensed matter physics researcher.",
    college: "MIT",
    course: "Physics & Quantum Computation",
    graduation_year: 2026,
    theme: "obsidian",
    is_public: false,
    is_discoverable: false,
    location: "Boston, MA",
    category: "research",
    skills: ["Python", "Qiskit", "Physics"],
    is_featured: false,
    views_count: 12,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "usr_hidden_dir",
    username: "secretbuilder",
    full_name: "Secret Builder",
    avatar_url: "",
    bio: "Stealth compiler optimization research. Low profile.",
    college: "National Institute of Technology Calicut",
    college_id: "col_nit",
    college_slug: "nit-calicut",
    course: "B.Tech Computer Science",
    graduation_year: 2026,
    theme: "minimal",
    is_public: true,
    is_discoverable: true,
    show_college_on_profile: false,
    show_in_college_directory: false,
    location: "Kozhikode, India",
    category: "engineering",
    skills: ["LLVM", "C++", "Compilers"],
    is_featured: false,
    views_count: 50,
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
];

export const DEFAULT_COLLEGES: any[] = [
  {
    id: "col_nit",
    slug: "nit-calicut",
    name: "National Institute of Technology Calicut",
    short_name: "NIT Calicut",
    logo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop",
    description: "An Institute of National Importance fostering engineering excellence, research, and open-source systems innovation.",
    location: "Kozhikode, Kerala, India",
    website: "https://www.nitc.ac.in",
    verification_status: "verified",
    verified_at: "2026-01-15T00:00:00Z",
    verified_domain: "nitc.ac.in",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "col_berkeley",
    slug: "uc-berkeley",
    name: "University of California, Berkeley",
    short_name: "UC Berkeley",
    logo_url: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop",
    description: "World-renowned public research university leading breakthroughs in computing, robotics, and scientific discovery.",
    location: "Berkeley, CA, USA",
    website: "https://berkeley.edu",
    verification_status: "verified",
    verified_at: "2026-02-01T00:00:00Z",
    verified_domain: "berkeley.edu",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "col_stanford",
    slug: "stanford-university",
    name: "Stanford University",
    short_name: "Stanford",
    logo_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=400&fit=crop",
    description: "Pioneering institution at the intersection of technology, human-centered computing, and entrepreneurial impact.",
    location: "Stanford, CA, USA",
    website: "https://stanford.edu",
    verification_status: "verified",
    verified_at: "2026-02-10T00:00:00Z",
    verified_domain: "stanford.edu",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "col_cmu",
    slug: "cmu",
    name: "Carnegie Mellon University",
    short_name: "CMU",
    logo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&h=400&fit=crop",
    description: "Global leader in computer science, robotics, and human-computer interaction design.",
    location: "Pittsburgh, PA, USA",
    website: "https://www.cmu.edu",
    verification_status: "verified",
    verified_at: "2026-03-01T00:00:00Z",
    verified_domain: "cmu.edu",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "col_community",
    slug: "community-tech-collective",
    name: "Community Tech Collective",
    short_name: "CTC",
    logo_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
    banner_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=400&fit=crop",
    description: "Student-initiated open tech cohort and builder incubator.",
    location: "Austin, TX, USA",
    website: "https://communitytech.dev",
    verification_status: "unverified",
    verified_at: null,
    verified_domain: null,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
];

export const DEFAULT_COLLEGE_MEMBERS: any[] = [
  {
    id: "mem_1",
    college_id: "col_nit",
    profile_id: "usr_sreehari",
    role: "owner",
    status: "active",
    show_in_directory: true,
    joined_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "mem_2",
    college_id: "col_berkeley",
    profile_id: "usr_alex",
    role: "admin",
    status: "active",
    show_in_directory: true,
    joined_at: "2026-01-10T00:00:00Z",
  },
  {
    id: "mem_3",
    college_id: "col_stanford",
    profile_id: "usr_priya",
    role: "student",
    status: "active",
    show_in_directory: true,
    joined_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "mem_4",
    college_id: "col_cmu",
    profile_id: "usr_elena",
    role: "student",
    status: "active",
    show_in_directory: true,
    joined_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "mem_hidden",
    college_id: "col_nit",
    profile_id: "usr_hidden_dir",
    role: "student",
    status: "active",
    show_in_directory: false,
    joined_at: "2026-03-01T00:00:00Z",
  },
];

export const DEFAULT_COLLEGE_EVENTS: Record<string, any[]> = {
  col_nit: [
    {
      id: "evt_1",
      title: "Ragam Hack 2026: Systems & AI Invitational",
      date: "Nov 14-16, 2026",
      time: "09:00 AM IST",
      location: "Main Auditorium & Computing Center",
      category: "hackathon",
      description: "Annual 36-hour flagship hackathon bringing together 400+ student engineers across distributed infrastructure and applied ML.",
      rsvp_count: 248,
    },
    {
      id: "evt_2",
      title: "Open Source Demo Day & Research Showcase",
      date: "Dec 05, 2026",
      time: "02:00 PM IST",
      location: "East Campus Innovation Hub",
      category: "demo_day",
      description: "Student builders demo open-source frameworks, low-level compilers, and production applications built this semester.",
      rsvp_count: 134,
    },
  ],
  col_berkeley: [
    {
      id: "evt_3",
      title: "CalHacks 13.0: Frontier Autonomous Systems",
      date: "Nov 20-22, 2026",
      time: "10:00 AM PST",
      location: "Pauley Ballroom, ASUC",
      category: "hackathon",
      description: "The world's largest collegiate hackathon hosted by UC Berkeley students.",
      rsvp_count: 512,
    },
  ],
  col_stanford: [
    {
      id: "evt_4",
      title: "Stanford AI & Reasoning Symposium 2026",
      date: "Dec 01, 2026",
      time: "01:30 PM PST",
      location: "Gates Computer Science Building",
      category: "symposium",
      description: "Undergraduate and graduate researchers present findings on cognitive benchmarks and foundation model interpretability.",
      rsvp_count: 310,
    },
  ],
};

export const DEFAULT_PLANS: any[] = [
  {
    id: "plan_free",
    slug: "free",
    name: "Free Builder",
    description: "Essential portfolio capabilities for every ambitious student. Free forever.",
    price_monthly: 0,
    price_yearly: 0,
    currency: "INR",
    features: [
      "Public student showcase",
      "Configurable links & social icons",
      "Up to 5 engineering projects",
      "Up to 5 verified honors",
      "Certificates & PDF resume",
      "Standard themes (Minimal, Developer, Academic)",
      "QR code sharing",
      "7-day analytics overview",
    ],
    limits: {
      max_projects: 5,
      max_achievements: 5,
      max_certificates: 5,
      analytics_days: 7,
    },
    is_active: true,
  },
  {
    id: "plan_pro",
    slug: "pro",
    name: "CollegeCentre Pro",
    description: "Custom domain, advanced analytics, custom colors, and priority builder presence.",
    price_monthly: 299,
    price_yearly: 2499,
    currency: "INR",
    features: [
      "Connect your personal custom domain (yourname.dev)",
      "Advanced curated themes (Creative, Cobalt, Obsidian, Terminal)",
      "Custom theme accents, layouts, and button aesthetics",
      "Full 90-day & all-time traffic analytics with referrers",
      "Remove CollegeCentre footer watermark",
      "Unlimited projects, honors & certificates",
      "Verified Pro badge on showcase & campus directory",
    ],
    limits: {
      max_projects: 9999,
      max_achievements: 9999,
      max_certificates: 9999,
      analytics_days: 90,
    },
    is_active: true,
  },
];

export const DEFAULT_SUBSCRIPTIONS: any[] = [
  {
    id: "sub_alex",
    profile_id: "usr_alex",
    plan_id: "plan_pro",
    plan_slug: "pro",
    status: "active",
    billing_interval: "yearly",
    current_period_start: "2026-01-01T00:00:00Z",
    current_period_end: "2027-01-01T00:00:00Z",
    cancel_at_period_end: false,
    canceled_at: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
  {
    id: "sub_sreehari",
    profile_id: "usr_sreehari",
    plan_id: "plan_free",
    plan_slug: "free",
    status: "active",
    billing_interval: "monthly",
    current_period_start: "2026-09-01T00:00:00Z",
    current_period_end: "2026-11-01T00:00:00Z",
    cancel_at_period_end: false,
    canceled_at: null,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
];

export const DEFAULT_ENTITLEMENTS: any[] = [
  { id: "ent_1", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "custom_domain", is_enabled: true },
  { id: "ent_2", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "advanced_themes", is_enabled: true },
  { id: "ent_3", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "advanced_customization", is_enabled: true },
  { id: "ent_4", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "advanced_analytics", is_enabled: true },
  { id: "ent_5", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "remove_branding", is_enabled: true },
  { id: "ent_6", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "unlimited_projects", is_enabled: true },
  { id: "ent_7", profile_id: "usr_alex", subscription_id: "sub_alex", feature_key: "pro_badge", is_enabled: true },
];

export const DEFAULT_BILLING_EVENTS: any[] = [
  {
    id: "bevt_1",
    profile_id: "usr_alex",
    event_type: "subscription.created",
    data: { plan: "pro", interval: "yearly", amount: 2499, currency: "INR" },
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "bevt_2",
    profile_id: "usr_alex",
    event_type: "payment.succeeded",
    data: { amount: 2499, invoice: "inv_2026_001" },
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const DEFAULT_COLLEGE_CLUBS: Record<string, any[]> = {
  col_nit: [
    {
      id: "clb_1",
      name: "Tinkerer's Lab & Systems Guild",
      category: "engineering",
      member_count: 140,
      description: "Student-run innovation lab building hardware, operating systems, and kernel modules.",
      lead: "Aditya Menon",
    },
    {
      id: "clb_2",
      name: "FOSS Cell Calicut",
      category: "open_source",
      member_count: 280,
      description: "Promoting free and open-source software culture, Linux kernel contributions, and open-web standards.",
      lead: "Sneha Nair",
    },
    {
      id: "clb_3",
      name: "Association of Computing Machinery (ACM)",
      category: "research",
      member_count: 195,
      description: "Organizing algorithmic problem solving, competitive programming, and research reading groups.",
      lead: "Karthik R.",
    },
  ],
  col_berkeley: [
    {
      id: "clb_4",
      name: "Cal Robotics & Drone Lab",
      category: "engineering",
      member_count: 220,
      description: "Autonomous quadrotors, visual SLAM development, and collegiate robotics competition team.",
      lead: "Alex Rivera",
    },
  ],
  col_stanford: [
    {
      id: "clb_5",
      name: "Stanford Cognitive AI Collective",
      category: "research",
      member_count: 180,
      description: "Interdisciplinary research community working on neuro-symbolic reasoning and model benchmarks.",
      lead: "Priya Sharma",
    },
  ],
};


export const DEFAULT_SOCIAL_LINKS: any[] = [
  { id: "sl_1", profile_id: "usr_sreehari", platform: "github", url: "https://github.com/sreehari", order_index: 0 },
  { id: "sl_2", profile_id: "usr_sreehari", platform: "linkedin", url: "https://linkedin.com/in/sreehari", order_index: 1 },
  { id: "sl_3", profile_id: "usr_sreehari", platform: "x", url: "https://x.com/sreehari", order_index: 2 },
  { id: "sl_4", profile_id: "usr_sreehari", platform: "website", url: "https://sreehari.dev", order_index: 3 },
  { id: "sl_5", profile_id: "usr_sreehari", platform: "instagram", url: "https://instagram.com/sreehari", order_index: 4 },

  { id: "sl_6", profile_id: "usr_alex", platform: "github", url: "https://github.com/arivera", order_index: 0 },
  { id: "sl_7", profile_id: "usr_alex", platform: "linkedin", url: "https://linkedin.com/in/alex-rivera", order_index: 1 },
  { id: "sl_8", profile_id: "usr_alex", platform: "x", url: "https://x.com/alexrivera", order_index: 2 },
  { id: "sl_9", profile_id: "usr_alex", platform: "website", url: "https://alexrivera.me", order_index: 3 },

  { id: "sl_10", profile_id: "usr_priya", platform: "github", url: "https://github.com/priyasharma", order_index: 0 },
  { id: "sl_11", profile_id: "usr_priya", platform: "linkedin", url: "https://linkedin.com/in/priya-sharma", order_index: 1 },
  { id: "sl_12", profile_id: "usr_priya", platform: "website", url: "https://priyasharma.ai", order_index: 2 },

  { id: "sl_13", profile_id: "usr_kavya", platform: "github", url: "https://github.com/kavyapatel", order_index: 0 },
  { id: "sl_14", profile_id: "usr_kavya", platform: "x", url: "https://x.com/kavyapatel", order_index: 1 },
  { id: "sl_15", profile_id: "usr_kavya", platform: "website", url: "https://kavyasystems.org", order_index: 2 },
];

export const DEFAULT_STUDENT_LINKS: any[] = [
  {
    id: "link_1",
    profile_id: "usr_sreehari",
    title: "CollegeCentre 2.0 Engineering Architecture RFC",
    url: "https://github.com/collegecentre/rfc",
    description: "Deep dive into the distributed architecture, SSR profile engine, and Next.js design tokens.",
    category: "engineering",
    is_enabled: true,
    order_index: 0,
    clicks_count: 34,
  },
  {
    id: "link_2",
    profile_id: "usr_sreehari",
    title: "Technical Writing & Engineering Preprints",
    url: "https://sreehari.dev/writing",
    description: "Articles on TypeScript compiler internals and low-latency database connection pooling.",
    category: "writing",
    is_enabled: true,
    order_index: 1,
    clicks_count: 12,
  },
  {
    id: "link_3",
    profile_id: "usr_sreehari",
    title: "Resume & Academic Transcripts",
    url: "https://sreehari.dev/resume.pdf",
    description: "Updated CV with academic coursework, research papers, and technical project stack.",
    category: "portfolio",
    is_enabled: true,
    order_index: 2,
    clicks_count: 48,
  },
  {
    id: "link_4",
    profile_id: "usr_alex",
    title: "Real-Time Visual SLAM Quadrotor Demo",
    url: "https://github.com/arivera/vslam-drone",
    description: "Open-source trajectory estimator running at 90fps on onboard Jetson Orin.",
    category: "engineering",
    is_enabled: true,
    order_index: 0,
    clicks_count: 29,
  },
  {
    id: "link_5",
    profile_id: "usr_alex",
    title: "Berkeley EECS Capstone Research Paper",
    url: "https://arxiv.org",
    description: "Multi-agent coordination under intermittent wireless mesh conditions.",
    category: "research",
    is_enabled: true,
    order_index: 1,
    clicks_count: 17,
  },
  {
    id: "link_6",
    profile_id: "usr_priya",
    title: "Interactive Latency & Reasoning Benchmarks",
    url: "https://github.com/priyasharma/latency-bench",
    description: "Benchmarking user friction and cognitive perception during token-streamed agent reasoning.",
    category: "research",
    is_enabled: true,
    order_index: 0,
    clicks_count: 45,
  },
  {
    id: "link_7",
    profile_id: "usr_priya",
    title: "Substack: The Human-AI Interface",
    url: "https://substack.com/@priyasharma",
    description: "Bi-weekly essays on cognitive ergonomies and direct manipulation interfaces.",
    category: "writing",
    is_enabled: true,
    order_index: 1,
    clicks_count: 22,
  },
  {
    id: "link_8",
    profile_id: "usr_kavya",
    title: "Zero-Copy eBPF Packet Filter in Rust",
    url: "https://github.com/kavyapatel/ebpf-router",
    description: "Kernel bypass routing module processing 10Gbps at sub-microsecond latency.",
    category: "engineering",
    is_enabled: true,
    order_index: 0,
    clicks_count: 31,
  },
];

export const DEFAULT_PROJECTS: any[] = [
  {
    id: "proj_1",
    profile_id: "usr_sreehari",
    title: "CollegeCentre 2.0 Core Platform",
    description: "High-performance student identity and showcase platform. Features full SSR profile rendering, sub-100ms hydration, customizable design tokens, and distributed Postgres RLS security policies.",
    cover_image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    github_url: "https://github.com/collegecentre/platform",
    demo_url: "https://collegecentre.in",
    video_url: "https://youtube.com/watch?v=demo",
    start_date: "2026-08",
    end_date: "2026-10",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "proj_2",
    profile_id: "usr_sreehari",
    title: "Distributed Raft Key-Value Store",
    description: "Fault-tolerant log-structured merge key-value engine written in modern Rust. Features multi-raft group sharding, lease reads, and p99 read latency under 0.8ms.",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    technologies: ["Rust", "Tokio", "gRPC", "RocksDB", "Raft"],
    github_url: "https://github.com/sreehari/raft-kv",
    demo_url: "https://sreehari.dev/projects/raft-kv",
    start_date: "2026-01",
    end_date: "2026-06",
    is_featured: false,
    is_enabled: true,
    order_index: 1,
  },
  {
    id: "proj_3",
    profile_id: "usr_alex",
    title: "Real-Time Visual SLAM Quadrotor",
    description: "Autonomous aerial trajectory estimation running onboard Jetson Orin at 90fps. Overcomes GPS-denied indoor obstacle fields with GPU-accelerated optical flow.",
    cover_image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
    technologies: ["C++20", "ROS2", "CUDA", "OpenCV", "Jetson Orin"],
    github_url: "https://github.com/arivera/vslam-drone",
    demo_url: "https://alexrivera.me/vslam",
    video_url: "https://youtube.com/watch?v=drone-demo",
    start_date: "2025-09",
    end_date: "2026-04",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "proj_4",
    profile_id: "usr_priya",
    title: "Interactive Cognitive Latency Benchmark",
    description: "Human-computer interaction research platform measuring cognitive perception threshold and agent trust during token streaming and tool calls.",
    cover_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    technologies: ["PyTorch", "HuggingFace", "FastAPI", "React", "KaTeX"],
    github_url: "https://github.com/priyasharma/latency-bench",
    demo_url: "https://priyasharma.ai/latency",
    start_date: "2025-10",
    end_date: "2026-03",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "proj_5",
    profile_id: "usr_kavya",
    title: "Zero-Copy eBPF Packet Filter",
    description: "Linux kernel bypass routing module processing 10Gbps line-rate ingress with custom eBPF XDP maps and atomic ring buffers in Rust.",
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    technologies: ["Rust", "eBPF", "Linux Kernel", "XDP", "BCC"],
    github_url: "https://github.com/kavyapatel/ebpf-router",
    demo_url: "https://kavyasystems.org/ebpf",
    start_date: "2026-02",
    end_date: "2026-07",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "proj_6",
    profile_id: "usr_elena",
    title: "Aura Spatial Design Tokens",
    description: "Design token engine for glassmorphic and accessible spatial computing interfaces with automatic WCAG AAA contrast compensation.",
    cover_image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    technologies: ["Figma", "Design Systems", "Three.js", "Tailwind CSS"],
    github_url: "https://github.com/elenarostova/aura-tokens",
    demo_url: "https://aura-design.cmu.edu",
    video_url: "https://youtube.com/watch?v=aura-demo",
    start_date: "2025-11",
    end_date: "2026-05",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "proj_7",
    profile_id: "usr_marcus",
    title: "Chronos Log-Structured Storage",
    description: "High-throughput append-only storage engine written in Zig with SIMD-accelerated index lookups and zero-copy compaction.",
    cover_image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    technologies: ["Zig", "SIMD", "Storage Engines", "Distributed Systems"],
    github_url: "https://github.com/marcuschen/chronos-engine",
    demo_url: "https://chronos.waterloo.dev",
    start_date: "2026-01",
    end_date: "2026-06",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "proj_8",
    profile_id: "usr_ananya",
    title: "TurbGPU Hypersonic Boundary Simulation",
    description: "GPU-parallelized finite volume solver for 3D compressible Navier-Stokes equations under Mach 6 atmospheric re-entry conditions.",
    cover_image_url: "https://images.unsplash.com/photo-1517976487588-34863013890f?w=800&q=80",
    technologies: ["CUDA", "C++", "OpenFOAM", "Python", "Fluid Dynamics"],
    github_url: "https://github.com/ananyarao/turb-gpu",
    demo_url: "https://aerolab.iitm.ac.in/turbgpu",
    start_date: "2025-08",
    end_date: "2026-04",
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  },
];

export const DEFAULT_ACHIEVEMENTS: any[] = [
  {
    id: "ach_1",
    profile_id: "usr_sreehari",
    title: "1st Place Winner - Systems & Infrastructure",
    description: "Architected a zero-downtime distributed consensus engine that survived continuous 60% packet drop rates across geo-distributed nodes.",
    organization: "HackMIT 2025",
    type: "hackathon",
    date: "Oct 2025",
    image_url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80",
    verification_url: "https://hackmit.org/winners/2025",
    credential_id: "HACKMIT-2025-1049",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "ach_2",
    profile_id: "usr_sreehari",
    title: "Google Summer of Code Fellow",
    description: "Implemented asynchronous disk I/O and atomic batching routines in the Apache Arrow DataFusion query planner.",
    organization: "Google Open Source",
    type: "open_source",
    date: "Aug 2025",
    image_url: null,
    verification_url: "https://summerofcode.withgoogle.com/archive/2025/projects/sreehari",
    credential_id: "GSOC-2025-ARW",
    is_featured: false,
    is_enabled: true,
    order_index: 1,
  },
  {
    id: "ach_3",
    profile_id: "usr_alex",
    title: "ACM SIGGRAPH Student Research Finalist",
    description: "Selected in top 10 international student research papers for GPU-accelerated spatial depth estimation on autonomous quadrotors.",
    organization: "ACM SIGGRAPH",
    type: "competition",
    date: "Aug 2025",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80",
    verification_url: "https://s2025.siggraph.org/src",
    credential_id: "SIGGRAPH-SRC-882",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "ach_4",
    profile_id: "usr_priya",
    title: "NeurIPS Workshop Best Paper Award",
    description: "Honored for empirical user models analyzing human latency tolerance during continuous multi-agent token streaming.",
    organization: "NeurIPS Foundation",
    type: "award",
    date: "Dec 2025",
    image_url: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=80",
    verification_url: "https://neurips.cc/awards/2025",
    credential_id: "NEURIPS-W-2025-04",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "ach_5",
    profile_id: "usr_kavya",
    title: "Linux Foundation Systems Mentee",
    description: "Contributed 12 patch sets to upstream BPF network filter routing subsystem in Linux kernel v6.12.",
    organization: "The Linux Foundation",
    type: "open_source",
    date: "Jul 2025",
    image_url: null,
    verification_url: "https://mentorship.lfx.linuxfoundation.org/mentees",
    credential_id: "LFX-2025-KERNEL",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
];

export const DEFAULT_CERTIFICATES: any[] = [
  {
    id: "cert_1",
    profile_id: "usr_sreehari",
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    issue_date: "May 2025",
    expiration_date: "May 2028",
    credential_id: "AWS-SAA-839210",
    credential_url: "https://aws.amazon.com/verification/AWS-SAA-839210",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
    pdf_url: "https://example.com/certificates/aws-saa-sreehari.pdf",
    description: "Demonstrated architecture of resilient, fault-tolerant, and decoupled distributed cloud services on AWS.",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "cert_2",
    profile_id: "usr_sreehari",
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI & Coursera",
    issue_date: "Feb 2025",
    expiration_date: null,
    credential_id: "COURSERA-DL-9941",
    credential_url: "https://coursera.org/verify/specialization/COURSERA-DL-9941",
    image_url: null,
    pdf_url: null,
    description: "Mastered neural networks, backpropagation optimization, CNN architectures, sequence models, and transformer mechanisms.",
    is_featured: false,
    is_enabled: true,
    order_index: 1,
  },
  {
    id: "cert_3",
    profile_id: "usr_alex",
    name: "NVIDIA Certified Associate: Applied Deep Learning",
    issuer: "NVIDIA Deep Learning Institute",
    issue_date: "Apr 2025",
    expiration_date: "Apr 2027",
    credential_id: "NV-ADL-2025-412",
    credential_url: "https://nvidia.com/dli/verify/NV-ADL-2025-412",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
    pdf_url: null,
    description: "CUDA accelerated tensor operations and vision model optimization for real-time edge embedded systems.",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "cert_4",
    profile_id: "usr_priya",
    name: "Human-Centered AI & Safety Certification",
    issuer: "Stanford Center for Professional Development",
    issue_date: "Mar 2025",
    expiration_date: null,
    credential_id: "SCPD-HCAI-772",
    credential_url: "https://scpd.stanford.edu/verify/SCPD-HCAI-772",
    image_url: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&q=80",
    pdf_url: null,
    description: "Formal methods for evaluating alignment, interactive latency constraints, and transparent model safety.",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
  {
    id: "cert_5",
    profile_id: "usr_kavya",
    name: "Linux Foundation Certified System Administrator (LFCS)",
    issuer: "The Linux Foundation",
    issue_date: "Jan 2025",
    expiration_date: "Jan 2028",
    credential_id: "LFCS-2025-0914",
    credential_url: "https://training.linuxfoundation.org/verify/LFCS-2025-0914",
    image_url: null,
    pdf_url: null,
    description: "Kernel module configuration, eBPF routing, storage management, and advanced Linux system diagnostics.",
    is_featured: true,
    is_enabled: true,
    order_index: 0,
  },
];

export const DEFAULT_RESUMES: any[] = [
  {
    id: "res_sreehari",
    profile_id: "usr_sreehari",
    file_path: "usr_sreehari/sreehari_nair_resume_2026.pdf",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    file_name: "Sreehari_Nair_Systems_Engineer.pdf",
    file_size: 284160,
    title: "Software Engineer & Distributed Systems CV",
    is_visible: true,
    uploaded_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-15T10:00:00Z",
  },
  {
    id: "res_alex",
    profile_id: "usr_alex",
    file_path: "usr_alex/alex_rivera_robotics_cv.pdf",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    file_name: "Alex_Rivera_EECS_Robotics.pdf",
    file_size: 345088,
    title: "Robotics & Embedded Systems Resume",
    is_visible: true,
    uploaded_at: "2026-02-18T14:30:00Z",
    updated_at: "2026-02-18T14:30:00Z",
  },
  {
    id: "res_priya",
    profile_id: "usr_priya",
    file_path: "usr_priya/priya_sharma_ai_resume.pdf",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    file_name: "Priya_Sharma_AI_Research.pdf",
    file_size: 298120,
    title: "AI Research & NLP Engineer Resume",
    is_visible: true,
    uploaded_at: "2026-01-20T09:15:00Z",
    updated_at: "2026-01-20T09:15:00Z",
  },
];

function createSeedAnalyticsEvents(): any[] {
  const events: any[] = [];
  const now = Date.now();
  const dayMs = 86400000;

  const referrers = ["github.com", "linkedin.com", "x.com", "direct", "google.com", "news.ycombinator.com"];
  const referrerWeights = [0.4, 0.3, 0.15, 0.1, 0.03, 0.02];
  const devices = ["desktop", "mobile", "tablet"];
  const deviceWeights = [0.65, 0.3, 0.05];

  function pickWeighted(items: string[], weights: number[]): string {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (r <= sum) return items[i];
    }
    return items[0];
  }

  // 1. Profile Views for usr_sreehari (past 30 days)
  for (let day = 29; day >= 0; day--) {
    const dayTimestamp = now - day * dayMs;
    const viewsCount = Math.floor(3 + ((30 - day) * 0.15) + (day % 4));
    for (let v = 0; v < viewsCount; v++) {
      const eventTime = new Date(dayTimestamp + Math.floor(Math.random() * 80000000)).toISOString();
      events.push({
        id: `evt_view_${day}_${v}`,
        profile_id: "usr_sreehari",
        event_type: "profile_view",
        referrer_host: pickWeighted(referrers, referrerWeights),
        device_type: pickWeighted(devices, deviceWeights),
        created_at: eventTime,
      });
    }
  }

  // 2. Link Clicks for usr_sreehari
  const linksData = [
    { id: "link_1", title: "CollegeCentre 2.0 Engineering Architecture RFC", count: 34 },
    { id: "link_3", title: "Resume & Academic Transcripts", count: 48 },
    { id: "link_2", title: "Technical Writing & Engineering Preprints", count: 12 },
  ];

  linksData.forEach((ld) => {
    for (let i = 0; i < ld.count; i++) {
      const day = Math.floor(Math.random() * 28);
      events.push({
        id: `evt_lc_${ld.id}_${i}`,
        profile_id: "usr_sreehari",
        event_type: "link_click",
        resource_id: ld.id,
        resource_title: ld.title,
        referrer_host: pickWeighted(referrers, referrerWeights),
        device_type: pickWeighted(devices, deviceWeights),
        created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
      });
    }
  });

  // 3. Project Views and Clicks for usr_sreehari
  for (let i = 0; i < 28; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_pv_1_${i}`,
      profile_id: "usr_sreehari",
      event_type: "project_view",
      resource_id: "proj_1",
      resource_title: "CollegeCentre 2.0 Core Platform",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  for (let i = 0; i < 19; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_pc_1_${i}`,
      profile_id: "usr_sreehari",
      event_type: "project_click",
      resource_id: "proj_1",
      resource_title: "CollegeCentre 2.0 Core Platform - Live Demo",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  for (let i = 0; i < 16; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_pv_2_${i}`,
      profile_id: "usr_sreehari",
      event_type: "project_view",
      resource_id: "proj_2",
      resource_title: "Distributed Raft Key-Value Store",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  for (let i = 0; i < 9; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_pc_2_${i}`,
      profile_id: "usr_sreehari",
      event_type: "project_click",
      resource_id: "proj_2",
      resource_title: "Distributed Raft Key-Value Store - GitHub Repo",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  // 4. Resume Interactions for usr_sreehari
  for (let i = 0; i < 22; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_rv_${i}`,
      profile_id: "usr_sreehari",
      event_type: "resume_view",
      resource_id: "res_sreehari",
      resource_title: "Software & Systems Architecture Resume",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  for (let i = 0; i < 16; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_rd_${i}`,
      profile_id: "usr_sreehari",
      event_type: "resume_download",
      resource_id: "res_sreehari",
      resource_title: "Software & Systems Architecture Resume",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  // 5. Share events for usr_sreehari
  const shareActions = ["qr_download", "copy_url", "web_share", "linkedin_share"];
  for (let i = 0; i < 11; i++) {
    const day = Math.floor(Math.random() * 28);
    const action = shareActions[i % shareActions.length];
    events.push({
      id: `evt_sh_${i}`,
      profile_id: "usr_sreehari",
      event_type: "share_event",
      resource_id: action,
      resource_title: `Share Event (${action})`,
      referrer_host: "direct",
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  // 6. Light seed data for usr_alex
  for (let i = 0; i < 35; i++) {
    const day = Math.floor(Math.random() * 28);
    events.push({
      id: `evt_alex_view_${i}`,
      profile_id: "usr_alex",
      event_type: "profile_view",
      referrer_host: pickWeighted(referrers, referrerWeights),
      device_type: pickWeighted(devices, deviceWeights),
      created_at: new Date(now - day * dayMs - Math.floor(Math.random() * 50000000)).toISOString(),
    });
  }

  return events;
}

export const DEFAULT_ANALYTICS_EVENTS: any[] = createSeedAnalyticsEvents();

const inMemoryStore = new Map<string, string>();

function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    const raw = inMemoryStore.get(key);
    return raw ? JSON.parse(raw) : defaultValue;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  const json = JSON.stringify(value);
  if (typeof window === "undefined") {
    inMemoryStore.set(key, json);
    return;
  }
  try {
    localStorage.setItem(key, json);
  } catch {
    // Ignore storage quota errors
  }
}

function removeStored(key: string): void {
  if (typeof window === "undefined") {
    inMemoryStore.delete(key);
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

const authListeners: Array<(event: string, session: MockSession | null) => void> = [];

function notifyAuth(event: string, session: MockSession | null) {
  authListeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (e) {
      console.error("Auth listener error:", e);
    }
  });
}

export const mockSupabase = {
  auth: {
    async signUp({ email, password: _password, options }: { email: string; password?: string; options?: any }) {
      await new Promise((r) => setTimeout(r, 400));
      const users = getStored<MockUser[]>(STORAGE_USERS_KEY, []);
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        return { data: { user: null, session: null }, error: { message: "User already registered with this email." } };
      }

      const newUser: MockUser = {
        id: "usr_" + Math.random().toString(36).substring(2, 11),
        email,
        user_metadata: options?.data || {},
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      setStored(STORAGE_USERS_KEY, users);

      const session: MockSession = {
        access_token: "mock_jwt_" + Math.random().toString(36),
        user: newUser,
      };
      setStored(STORAGE_SESSION_KEY, session);
      notifyAuth("SIGNED_IN", session);

      return { data: { user: newUser, session }, error: null };
    },

    async signInWithPassword({ email, password: _password }: { email: string; password?: string }) {
      await new Promise((r) => setTimeout(r, 400));
      const users = getStored<MockUser[]>(STORAGE_USERS_KEY, []);
      let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      // If user doesn't exist in mock mode, create them automatically for smooth testing
      if (!user) {
        user = {
          id: "usr_" + Math.random().toString(36).substring(2, 11),
          email,
          user_metadata: {},
          created_at: new Date().toISOString(),
        };
        users.push(user);
        setStored(STORAGE_USERS_KEY, users);
      }

      const session: MockSession = {
        access_token: "mock_jwt_" + Math.random().toString(36),
        user,
      };
      setStored(STORAGE_SESSION_KEY, session);
      notifyAuth("SIGNED_IN", session);

      return { data: { user, session }, error: null };
    },

    async signInWithOAuth({ provider }: { provider: string }) {
      await new Promise((r) => setTimeout(r, 500));
      const mockEmail = `student_${Math.random().toString(36).substring(2, 7)}@collegecentre.in`;
      const users = getStored<MockUser[]>(STORAGE_USERS_KEY, []);
      const user: MockUser = {
        id: "usr_google_" + Math.random().toString(36).substring(2, 9),
        email: mockEmail,
        user_metadata: { full_name: "Google Student", avatar_url: "" },
        created_at: new Date().toISOString(),
      };
      users.push(user);
      setStored(STORAGE_USERS_KEY, users);

      const session: MockSession = {
        access_token: "mock_oauth_jwt_" + Math.random().toString(36),
        user,
      };
      setStored(STORAGE_SESSION_KEY, session);
      notifyAuth("SIGNED_IN", session);

      return { data: { url: "/onboarding", provider }, error: null };
    },

    async resetPasswordForEmail(_email: string) {
      await new Promise((r) => setTimeout(r, 400));
      return { data: {}, error: null };
    },

    async updateUser(updates: { password?: string; data?: any }) {
      await new Promise((r) => setTimeout(r, 300));
      const session = getStored<MockSession | null>(STORAGE_SESSION_KEY, null);
      if (!session) return { data: { user: null }, error: { message: "Not authenticated" } };

      if (updates.data) {
        session.user.user_metadata = { ...session.user.user_metadata, ...updates.data };
        setStored(STORAGE_SESSION_KEY, session);
      }
      return { data: { user: session.user }, error: null };
    },

    async signOut() {
      await new Promise((r) => setTimeout(r, 200));
      removeStored(STORAGE_SESSION_KEY);
      notifyAuth("SIGNED_OUT", null);
      return { error: null };
    },

    async getSession() {
      const session = getStored<MockSession | null>(STORAGE_SESSION_KEY, null);
      return { data: { session }, error: null };
    },

    async getUser() {
      const session = getStored<MockSession | null>(STORAGE_SESSION_KEY, null);
      return { data: { user: session?.user || null }, error: null };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      authListeners.push(callback);
      // Immediately invoke with current state
      const current = getStored<MockSession | null>(STORAGE_SESSION_KEY, null);
      callback(current ? "INITIAL_SESSION" : "NO_SESSION", current);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const idx = authListeners.indexOf(callback);
              if (idx > -1) authListeners.splice(idx, 1);
            },
          },
        },
      };
    },
  },

  from(table: string) {
    let queryFilter: { field?: string; value?: any } = {};
    const queryFilters: Array<{ op: "eq" | "gte" | "lte"; field: string; value: any }> = [];

    return {
      select(_columns = "*") {
        const queryObj = {
          eq(field: string, value: any) {
            queryFilter = { field, value };
            queryFilters.push({ op: "eq", field, value });
            return this;
          },
          gte(field: string, value: any) {
            queryFilters.push({ op: "gte", field, value });
            return this;
          },
          lte(field: string, value: any) {
            queryFilters.push({ op: "lte", field, value });
            return this;
          },
          order(_field: string, _options?: { ascending?: boolean }) {
            return this;
          },
          _matchItem(item: any) {
            if (queryFilters.length > 0) {
              for (const f of queryFilters) {
                const val = item[f.field];
                if (f.op === "eq") {
                  if (typeof val === "string" && typeof f.value === "string") {
                    if (val.toLowerCase() !== f.value.toLowerCase()) return false;
                  } else if (val !== f.value) {
                    return false;
                  }
                } else if (f.op === "gte") {
                  if (val < f.value) return false;
                } else if (f.op === "lte") {
                  if (val > f.value) return false;
                }
              }
              return true;
            }
            if (queryFilter.field) {
              const val = item[queryFilter.field];
              if (typeof val === "string" && typeof queryFilter.value === "string") {
                return val.toLowerCase() === queryFilter.value.toLowerCase();
              }
              return val === queryFilter.value;
            }
            return true;
          },

          _getTableRows() {
            if (table === "profiles") return getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
            if (table === "projects") return getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
            if (table === "achievements") return getStored<any[]>(STORAGE_ACHIEVEMENTS_KEY, DEFAULT_ACHIEVEMENTS);
            if (table === "certificates") return getStored<any[]>(STORAGE_CERTIFICATES_KEY, DEFAULT_CERTIFICATES);
            if (table === "resumes") return getStored<any[]>(STORAGE_RESUMES_KEY, DEFAULT_RESUMES);
            if (table === "colleges") return getStored<any[]>(STORAGE_COLLEGES_KEY, DEFAULT_COLLEGES);
            if (table === "college_members") return getStored<any[]>(STORAGE_COLLEGE_MEMBERS_KEY, DEFAULT_COLLEGE_MEMBERS);
            if (table === "basic_social_links") return getStored<any[]>(STORAGE_SOCIAL_KEY, DEFAULT_SOCIAL_LINKS);
            if (table === "student_links" || table === "links") return getStored<any[]>(STORAGE_STUDENT_LINKS_KEY, DEFAULT_STUDENT_LINKS);
            if (table === "analytics_events") return getStored<any[]>(STORAGE_ANALYTICS_KEY, DEFAULT_ANALYTICS_EVENTS);
            if (table === "plans") return getStored<any[]>(STORAGE_PLANS_KEY, DEFAULT_PLANS);
            if (table === "subscriptions") return getStored<any[]>(STORAGE_SUBSCRIPTIONS_KEY, DEFAULT_SUBSCRIPTIONS);
            if (table === "entitlements") return getStored<any[]>(STORAGE_ENTITLEMENTS_KEY, DEFAULT_ENTITLEMENTS);
            if (table === "billing_events") return getStored<any[]>(STORAGE_BILLING_EVENTS_KEY, DEFAULT_BILLING_EVENTS);
            return [];
          },

          async maybeSingle() {
            await new Promise((r) => setTimeout(r, 60));
            const list = this._getTableRows();
            const found = list.find((item) => this._matchItem(item));
            return { data: found || null, error: null };
          },

          async single() {
            await new Promise((r) => setTimeout(r, 60));
            const list = this._getTableRows();
            const found = list.find((item) => this._matchItem(item));
            if (!found) return { data: null, error: { message: "Row not found", code: "PGRST116" } };
            return { data: found, error: null };
          },
          async then(resolve: any) {
            await new Promise((r) => setTimeout(r, 60));
            if (table === "basic_social_links") {
              const links = getStored<any[]>(STORAGE_SOCIAL_KEY, DEFAULT_SOCIAL_LINKS);
              const filtered = queryFilter.field
                ? links.filter((l) => l[queryFilter.field!] === queryFilter.value)
                : links;
              resolve({ data: filtered, error: null });
            } else if (table === "student_links" || table === "links") {
              const links = getStored<any[]>(STORAGE_STUDENT_LINKS_KEY, DEFAULT_STUDENT_LINKS);
              let list = queryFilter.field
                ? links.filter((l) => l[queryFilter.field!] === queryFilter.value)
                : links;
              // Sort by order_index
              list.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
              resolve({ data: list, error: null });
            } else if (table === "projects") {
              const projects = getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
              let list = projects.filter((p) => {
                if (queryFilters.length > 0) {
                  for (const f of queryFilters) {
                    if (f.op === "eq" && p[f.field] !== f.value) return false;
                    if (f.op === "gte" && p[f.field] < f.value) return false;
                    if (f.op === "lte" && p[f.field] > f.value) return false;
                  }
                  return true;
                }
                if (queryFilter.field) {
                  return p[queryFilter.field] === queryFilter.value;
                }
                return true;
              });
              // Sort by is_featured DESC, order_index ASC
              list.sort((a, b) => {
                if (a.is_featured !== b.is_featured) {
                  return a.is_featured ? -1 : 1;
                }
                return (a.order_index ?? 0) - (b.order_index ?? 0);
              });
              resolve({ data: list, error: null });
            } else if (table === "achievements") {
              const achievements = getStored<any[]>(STORAGE_ACHIEVEMENTS_KEY, DEFAULT_ACHIEVEMENTS);
              let list = queryFilter.field
                ? achievements.filter((a) => a[queryFilter.field!] === queryFilter.value)
                : achievements;
              // Sort by is_featured DESC, order_index ASC
              list.sort((a, b) => {
                if (a.is_featured !== b.is_featured) {
                  return a.is_featured ? -1 : 1;
                }
                return (a.order_index ?? 0) - (b.order_index ?? 0);
              });
              resolve({ data: list, error: null });
            } else if (table === "certificates") {
              const certificates = getStored<any[]>(STORAGE_CERTIFICATES_KEY, DEFAULT_CERTIFICATES);
              let list = queryFilter.field
                ? certificates.filter((c) => c[queryFilter.field!] === queryFilter.value)
                : certificates;
              // Sort by is_featured DESC, order_index ASC
              list.sort((a, b) => {
                if (a.is_featured !== b.is_featured) {
                  return a.is_featured ? -1 : 1;
                }
                return (a.order_index ?? 0) - (b.order_index ?? 0);
              });
              resolve({ data: list, error: null });
            } else if (table === "resumes") {
              const resumes = getStored<any[]>(STORAGE_RESUMES_KEY, DEFAULT_RESUMES);
              let list = queryFilter.field
                ? resumes.filter((r) => r[queryFilter.field!] === queryFilter.value)
                : resumes;
              resolve({ data: list, error: null });
            } else if (table === "analytics_events") {
              const events = getStored<any[]>(STORAGE_ANALYTICS_KEY, DEFAULT_ANALYTICS_EVENTS);
              let list = events.filter((e) => {
                for (const f of queryFilters) {
                  const val = e[f.field];
                  if (f.op === "eq") {
                    if (val !== f.value) return false;
                  } else if (f.op === "gte") {
                    if (val < f.value) return false;
                  } else if (f.op === "lte") {
                    if (val > f.value) return false;
                  }
                }
                return true;
              });
              list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              resolve({ data: list, error: null });
            } else if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
              let list = profiles.filter((p) => {
                if (queryFilters.length > 0) {
                  for (const f of queryFilters) {
                    if (f.op === "eq") {
                      if (p[f.field] !== f.value) return false;
                    } else if (f.op === "gte") {
                      if (p[f.field] < f.value) return false;
                    } else if (f.op === "lte") {
                      if (p[f.field] > f.value) return false;
                    }
                  }
                  return true;
                }
                if (queryFilter.field) {
                  const val = p[queryFilter.field];
                  if (typeof val === "string" && typeof queryFilter.value === "string") {
                    return val.toLowerCase() === queryFilter.value.toLowerCase();
                  }
                  return val === queryFilter.value;
                }
                return true;
              });
              resolve({ data: list, error: null });
            } else if (table === "colleges") {
              const colleges = getStored<any[]>(STORAGE_COLLEGES_KEY, DEFAULT_COLLEGES);
              let list = colleges.filter((c) => {
                if (queryFilters.length > 0) {
                  for (const f of queryFilters) {
                    if (f.op === "eq" && c[f.field] !== f.value) return false;
                  }
                  return true;
                }
                if (queryFilter.field) {
                  const val = c[queryFilter.field];
                  if (typeof val === "string" && typeof queryFilter.value === "string") {
                    return val.toLowerCase() === queryFilter.value.toLowerCase();
                  }
                  return val === queryFilter.value;
                }
                return true;
              });
              resolve({ data: list, error: null });
            } else if (table === "college_members") {
              const members = getStored<any[]>(STORAGE_COLLEGE_MEMBERS_KEY, DEFAULT_COLLEGE_MEMBERS);
              let list = members.filter((m) => {
                if (queryFilters.length > 0) {
                  for (const f of queryFilters) {
                    if (f.op === "eq" && m[f.field] !== f.value) return false;
                  }
                  return true;
                }
                if (queryFilter.field) {
                  return m[queryFilter.field] === queryFilter.value;
                }
                return true;
              });
              resolve({ data: list, error: null });
            } else if (table === "plans" || table === "subscriptions" || table === "entitlements" || table === "billing_events") {
              const rows = this._getTableRows();
              const list = rows.filter((r) => this._matchItem(r));
              resolve({ data: list, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          },
        };
        return queryObj;
      },

      async insert(rows: any | any[]) {
        await new Promise((r) => setTimeout(r, 100));
        const list = Array.isArray(rows) ? rows : [rows];

        if (table === "profiles") {
          const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
          list.forEach((row) => {
            const idx = profiles.findIndex((p) => p.id === row.id || p.username === row.username);
            if (idx > -1) {
              profiles[idx] = { ...profiles[idx], ...row, updated_at: new Date().toISOString() };
            } else {
              profiles.push({
                ...row,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          });
          setStored(STORAGE_PROFILES_KEY, profiles);
          return { data: list, error: null };
        }

        if (table === "basic_social_links") {
          const links = getStored<any[]>(STORAGE_SOCIAL_KEY, DEFAULT_SOCIAL_LINKS);
          list.forEach((item) => {
            links.push({
              id: item.id || "link_" + Math.random().toString(36).substring(2, 9),
              ...item,
              created_at: new Date().toISOString(),
            });
          });
          setStored(STORAGE_SOCIAL_KEY, links);
          return { data: list, error: null };
        }

        if (table === "student_links" || table === "links") {
          const links = getStored<any[]>(STORAGE_STUDENT_LINKS_KEY, DEFAULT_STUDENT_LINKS);
          list.forEach((item) => {
            const existingIdx = links.findIndex((l) => l.id && l.id === item.id);
            if (existingIdx > -1) {
              links[existingIdx] = {
                ...links[existingIdx],
                ...item,
                updated_at: new Date().toISOString(),
              };
            } else {
              links.push({
                id: item.id || "slink_" + Math.random().toString(36).substring(2, 9),
                is_enabled: item.is_enabled ?? true,
                order_index: item.order_index ?? links.length,
                clicks_count: item.clicks_count ?? 0,
                ...item,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          });
          setStored(STORAGE_STUDENT_LINKS_KEY, links);
          return { data: list, error: null };
        }

        if (table === "projects") {
          const projects = getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
          list.forEach((item) => {
            const existingIdx = projects.findIndex((p) => p.id && p.id === item.id);
            if (existingIdx > -1) {
              projects[existingIdx] = {
                ...projects[existingIdx],
                ...item,
                updated_at: new Date().toISOString(),
              };
            } else {
              projects.push({
                id: item.id || "proj_" + Math.random().toString(36).substring(2, 9),
                technologies: item.technologies || [],
                is_featured: item.is_featured ?? false,
                is_enabled: item.is_enabled ?? true,
                order_index: item.order_index ?? projects.length,
                ...item,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          });
          setStored(STORAGE_PROJECTS_KEY, projects);
          return { data: list, error: null };
        }

        if (table === "achievements") {
          const achievements = getStored<any[]>(STORAGE_ACHIEVEMENTS_KEY, DEFAULT_ACHIEVEMENTS);
          list.forEach((item) => {
            const existingIdx = achievements.findIndex((a) => a.id && a.id === item.id);
            if (existingIdx > -1) {
              achievements[existingIdx] = {
                ...achievements[existingIdx],
                ...item,
                updated_at: new Date().toISOString(),
              };
            } else {
              achievements.push({
                id: item.id || "ach_" + Math.random().toString(36).substring(2, 9),
                type: item.type || "other",
                is_featured: item.is_featured ?? false,
                is_enabled: item.is_enabled ?? true,
                order_index: item.order_index ?? achievements.length,
                ...item,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          });
          setStored(STORAGE_ACHIEVEMENTS_KEY, achievements);
          return { data: list, error: null };
        }

        if (table === "certificates") {
          const certificates = getStored<any[]>(STORAGE_CERTIFICATES_KEY, DEFAULT_CERTIFICATES);
          list.forEach((item) => {
            const existingIdx = certificates.findIndex((c) => c.id && c.id === item.id);
            if (existingIdx > -1) {
              certificates[existingIdx] = {
                ...certificates[existingIdx],
                ...item,
                updated_at: new Date().toISOString(),
              };
            } else {
              certificates.push({
                id: item.id || "cert_" + Math.random().toString(36).substring(2, 9),
                is_featured: item.is_featured ?? false,
                is_enabled: item.is_enabled ?? true,
                order_index: item.order_index ?? certificates.length,
                ...item,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          });
          setStored(STORAGE_CERTIFICATES_KEY, certificates);
          return { data: list, error: null };
        }

        if (table === "resumes") {
          const resumes = getStored<any[]>(STORAGE_RESUMES_KEY, DEFAULT_RESUMES);
          list.forEach((item) => {
            const existingIdx = resumes.findIndex(
              (r) => (r.id && r.id === item.id) || (item.profile_id && r.profile_id === item.profile_id)
            );
            if (existingIdx > -1) {
              resumes[existingIdx] = {
                ...resumes[existingIdx],
                ...item,
                updated_at: new Date().toISOString(),
              };
            } else {
              resumes.push({
                id: item.id || "res_" + Math.random().toString(36).substring(2, 9),
                is_visible: item.is_visible ?? true,
                file_size: item.file_size || 0,
                ...item,
                uploaded_at: item.uploaded_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
          });
          setStored(STORAGE_RESUMES_KEY, resumes);
          return { data: list, error: null };
        }

        if (table === "analytics_events") {
          const events = getStored<any[]>(STORAGE_ANALYTICS_KEY, DEFAULT_ANALYTICS_EVENTS);
          list.forEach((item) => {
            const newEvent = {
              id: item.id || "evt_" + Math.random().toString(36).substring(2, 10),
              created_at: item.created_at || new Date().toISOString(),
              ...item,
            };
            events.push(newEvent);

            if (newEvent.event_type === "link_click" && newEvent.resource_id) {
              const links = getStored<any[]>(STORAGE_STUDENT_LINKS_KEY, DEFAULT_STUDENT_LINKS);
              const targetLink = links.find((l) => l.id === newEvent.resource_id);
              if (targetLink) {
                targetLink.clicks_count = (targetLink.clicks_count || 0) + 1;
                targetLink.last_clicked_at = newEvent.created_at;
                setStored(STORAGE_STUDENT_LINKS_KEY, links);
              }
            }
          });
          setStored(STORAGE_ANALYTICS_KEY, events);
          return { data: list, error: null };
        }

        if (table === "colleges") {
          const colleges = getStored<any[]>(STORAGE_COLLEGES_KEY, DEFAULT_COLLEGES);
          list.forEach((item) => {
            const existingIdx = colleges.findIndex((c) => c.id === item.id || c.slug === item.slug);
            if (existingIdx > -1) {
              colleges[existingIdx] = {
                ...colleges[existingIdx],
                ...item,
                updated_at: new Date().toISOString(),
              };
              item.id = colleges[existingIdx].id;
            } else {
              const newCol = {
                id: item.id || "col_" + Math.random().toString(36).substring(2, 9),
                verification_status: item.verification_status || "unverified",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...item,
              };
              item.id = newCol.id;
              colleges.push(newCol);
            }
          });
          setStored(STORAGE_COLLEGES_KEY, colleges);
          return { data: list, error: null };
        }

        if (table === "college_members") {
          const members = getStored<any[]>(STORAGE_COLLEGE_MEMBERS_KEY, DEFAULT_COLLEGE_MEMBERS);
          list.forEach((item) => {
            const existingIdx = members.findIndex(
              (m) => m.id === item.id || (m.college_id === item.college_id && m.profile_id === item.profile_id)
            );
            if (existingIdx > -1) {
              members[existingIdx] = {
                ...members[existingIdx],
                ...item,
              };
              item.id = members[existingIdx].id;
            } else {
              const newMem = {
                id: item.id || "mem_" + Math.random().toString(36).substring(2, 9),
                role: item.role || "student",
                status: item.status || "active",
                show_in_directory: item.show_in_directory ?? true,
                joined_at: new Date().toISOString(),
                ...item,
              };
              item.id = newMem.id;
              members.push(newMem);
            }
          });
          setStored(STORAGE_COLLEGE_MEMBERS_KEY, members);
          return { data: list, error: null };
        }

        if (table === "subscriptions") {
          const subs = getStored<any[]>(STORAGE_SUBSCRIPTIONS_KEY, DEFAULT_SUBSCRIPTIONS);
          list.forEach((item) => {
            const existingIdx = subs.findIndex((s) => s.id === item.id || s.profile_id === item.profile_id);
            if (existingIdx > -1) {
              subs[existingIdx] = { ...subs[existingIdx], ...item, updated_at: new Date().toISOString() };
              item.id = subs[existingIdx].id;
            } else {
              const newSub = {
                id: item.id || "sub_" + Math.random().toString(36).substring(2, 9),
                status: item.status || "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...item,
              };
              item.id = newSub.id;
              subs.push(newSub);
            }
          });
          setStored(STORAGE_SUBSCRIPTIONS_KEY, subs);
          return { data: list, error: null };
        }

        if (table === "entitlements") {
          const ents = getStored<any[]>(STORAGE_ENTITLEMENTS_KEY, DEFAULT_ENTITLEMENTS);
          list.forEach((item) => {
            const existingIdx = ents.findIndex((e) => e.id === item.id || (e.profile_id === item.profile_id && e.feature_key === item.feature_key));
            if (existingIdx > -1) {
              ents[existingIdx] = { ...ents[existingIdx], ...item };
              item.id = ents[existingIdx].id;
            } else {
              const newEnt = {
                id: item.id || "ent_" + Math.random().toString(36).substring(2, 9),
                created_at: new Date().toISOString(),
                ...item,
              };
              item.id = newEnt.id;
              ents.push(newEnt);
            }
          });
          setStored(STORAGE_ENTITLEMENTS_KEY, ents);
          return { data: list, error: null };
        }

        if (table === "billing_events") {
          const events = getStored<any[]>(STORAGE_BILLING_EVENTS_KEY, DEFAULT_BILLING_EVENTS);
          list.forEach((item) => {
            const newEvt = {
              id: item.id || "bevt_" + Math.random().toString(36).substring(2, 9),
              created_at: item.created_at || new Date().toISOString(),
              ...item,
            };
            item.id = newEvt.id;
            events.push(newEvt);
          });
          setStored(STORAGE_BILLING_EVENTS_KEY, events);
          return { data: list, error: null };
        }

        return { data: list, error: null };
      },

      async upsert(rows: any | any[], _options?: any) {
        return this.insert(rows);
      },

      update(updates: any) {
        return {
          eq(field: string, value: any) {
            return {
              async then(resolve: any) {
                await new Promise((r) => setTimeout(r, 100));
                if (table === "profiles") {
                  const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
                  const idx = profiles.findIndex((p) => p[field] === value);
                  if (idx > -1) {
                    profiles[idx] = { ...profiles[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_PROFILES_KEY, profiles);
                    resolve({ data: profiles[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Profile not found to update" } });
                  }
                } else if (table === "student_links" || table === "links") {
                  const links = getStored<any[]>(STORAGE_STUDENT_LINKS_KEY, DEFAULT_STUDENT_LINKS);
                  const idx = links.findIndex((l) => l[field] === value);
                  if (idx > -1) {
                    links[idx] = { ...links[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_STUDENT_LINKS_KEY, links);
                    resolve({ data: links[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Link not found to update" } });
                  }
                } else if (table === "projects") {
                  const projects = getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
                  const idx = projects.findIndex((p) => p[field] === value);
                  if (idx > -1) {
                    projects[idx] = { ...projects[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_PROJECTS_KEY, projects);
                    resolve({ data: projects[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Project not found to update" } });
                  }
                } else if (table === "achievements") {
                  const achievements = getStored<any[]>(STORAGE_ACHIEVEMENTS_KEY, DEFAULT_ACHIEVEMENTS);
                  const idx = achievements.findIndex((a) => a[field] === value);
                  if (idx > -1) {
                    achievements[idx] = { ...achievements[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_ACHIEVEMENTS_KEY, achievements);
                    resolve({ data: achievements[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Achievement not found to update" } });
                  }
                } else if (table === "certificates") {
                  const certificates = getStored<any[]>(STORAGE_CERTIFICATES_KEY, DEFAULT_CERTIFICATES);
                  const idx = certificates.findIndex((c) => c[field] === value);
                  if (idx > -1) {
                    certificates[idx] = { ...certificates[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_CERTIFICATES_KEY, certificates);
                    resolve({ data: certificates[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Certificate not found to update" } });
                  }
                } else if (table === "resumes") {
                  const resumes = getStored<any[]>(STORAGE_RESUMES_KEY, DEFAULT_RESUMES);
                  const idx = resumes.findIndex((r) => r[field] === value);
                  if (idx > -1) {
                    resumes[idx] = { ...resumes[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_RESUMES_KEY, resumes);
                    resolve({ data: resumes[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Resume not found to update" } });
                  }
                } else if (table === "colleges") {
                  const colleges = getStored<any[]>(STORAGE_COLLEGES_KEY, DEFAULT_COLLEGES);
                  const idx = colleges.findIndex((c) => c[field] === value);
                  if (idx > -1) {
                    colleges[idx] = { ...colleges[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_COLLEGES_KEY, colleges);
                    resolve({ data: colleges[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "College not found to update" } });
                  }
                } else if (table === "college_members") {
                  const members = getStored<any[]>(STORAGE_COLLEGE_MEMBERS_KEY, DEFAULT_COLLEGE_MEMBERS);
                  const idx = members.findIndex((m) => m[field] === value);
                  if (idx > -1) {
                    members[idx] = { ...members[idx], ...updates };
                    setStored(STORAGE_COLLEGE_MEMBERS_KEY, members);
                    resolve({ data: members[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "College member not found to update" } });
                  }
                } else if (table === "subscriptions") {
                  const subs = getStored<any[]>(STORAGE_SUBSCRIPTIONS_KEY, DEFAULT_SUBSCRIPTIONS);
                  const idx = subs.findIndex((s) => s[field] === value);
                  if (idx > -1) {
                    subs[idx] = { ...subs[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_SUBSCRIPTIONS_KEY, subs);
                    resolve({ data: subs[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Subscription not found to update" } });
                  }
                } else if (table === "entitlements") {
                  const ents = getStored<any[]>(STORAGE_ENTITLEMENTS_KEY, DEFAULT_ENTITLEMENTS);
                  const idx = ents.findIndex((e) => e[field] === value);
                  if (idx > -1) {
                    ents[idx] = { ...ents[idx], ...updates };
                    setStored(STORAGE_ENTITLEMENTS_KEY, ents);
                    resolve({ data: ents[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Entitlement not found to update" } });
                  }
                } else {
                  resolve({ data: null, error: null });
                }
              },
            };
          },
        };
      },

      delete() {
        return {
          eq(field: string, value: any) {
            return {
              async then(resolve: any) {
                if (table === "basic_social_links") {
                  const links = getStored<any[]>(STORAGE_SOCIAL_KEY, []);
                  const remaining = links.filter((l) => l[field] !== value);
                  setStored(STORAGE_SOCIAL_KEY, remaining);
                } else if (table === "student_links" || table === "links") {
                  const links = getStored<any[]>(STORAGE_STUDENT_LINKS_KEY, DEFAULT_STUDENT_LINKS);
                  const remaining = links.filter((l) => l[field] !== value);
                  setStored(STORAGE_STUDENT_LINKS_KEY, remaining);
                } else if (table === "projects") {
                  const projects = getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
                  const remaining = projects.filter((p) => p[field] !== value);
                  setStored(STORAGE_PROJECTS_KEY, remaining);
                } else if (table === "achievements") {
                  const achievements = getStored<any[]>(STORAGE_ACHIEVEMENTS_KEY, DEFAULT_ACHIEVEMENTS);
                  const remaining = achievements.filter((a) => a[field] !== value);
                  setStored(STORAGE_ACHIEVEMENTS_KEY, remaining);
                } else if (table === "certificates") {
                  const certificates = getStored<any[]>(STORAGE_CERTIFICATES_KEY, DEFAULT_CERTIFICATES);
                  const remaining = certificates.filter((c) => c[field] !== value);
                  setStored(STORAGE_CERTIFICATES_KEY, remaining);
                } else if (table === "resumes") {
                  const resumes = getStored<any[]>(STORAGE_RESUMES_KEY, DEFAULT_RESUMES);
                  const remaining = resumes.filter((r) => r[field] !== value);
                  setStored(STORAGE_RESUMES_KEY, remaining);
                } else if (table === "analytics_events") {
                  const events = getStored<any[]>(STORAGE_ANALYTICS_KEY, DEFAULT_ANALYTICS_EVENTS);
                  const remaining = events.filter((e) => e[field] !== value);
                  setStored(STORAGE_ANALYTICS_KEY, remaining);
                } else if (table === "colleges") {
                  const colleges = getStored<any[]>(STORAGE_COLLEGES_KEY, DEFAULT_COLLEGES);
                  const remaining = colleges.filter((c) => c[field] !== value);
                  setStored(STORAGE_COLLEGES_KEY, remaining);
                } else if (table === "college_members") {
                  const members = getStored<any[]>(STORAGE_COLLEGE_MEMBERS_KEY, DEFAULT_COLLEGE_MEMBERS);
                  const remaining = members.filter((m) => m[field] !== value);
                  setStored(STORAGE_COLLEGE_MEMBERS_KEY, remaining);
                }
                resolve({ error: null });
              },
            };
          },
        };
      },
    };
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(filePath: string, file: any, _options?: any) {
          await new Promise((r) => setTimeout(r, 120));
          let publicUrl =
            bucket === "resumes" || filePath.endsWith(".pdf")
              ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80";
          if (typeof window !== "undefined" && file instanceof Blob) {
            publicUrl = URL.createObjectURL(file);
          }
          return {
            data: { path: filePath, fullPath: `${bucket}/${filePath}`, publicUrl },
            error: null,
          };
        },
        getPublicUrl(filePath: string) {
          return {
            data: {
              publicUrl:
                filePath.startsWith("http") || filePath.startsWith("blob:") || filePath.startsWith("data:")
                  ? filePath
                  : `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${filePath}`,
            },
          };
        },
        async remove(_filePaths: string[]) {
          return { data: null, error: null };
        },
      };
    },
  },
};

/**
 * Universal Supabase Client
 * Uses real Supabase client when configured, otherwise uses reliable mock fallback.
 */
export const supabase = (isLiveSupabase ? realSupabase : (mockSupabase as any));
