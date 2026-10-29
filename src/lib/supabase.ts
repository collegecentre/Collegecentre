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

export const DEFAULT_PROFILES: any[] = [
  {
    id: "usr_sreehari",
    username: "sreehari",
    full_name: "Sreehari Nair",
    avatar_url: "",
    bio: "Building CollegeCentre 2.0. Distributed systems, web platform architecture, and developer productivity tools.",
    college: "National Institute of Technology",
    course: "Computer Science & Engineering",
    graduation_year: 2026,
    theme: "obsidian",
    is_public: true,
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
    college: "UC Berkeley",
    course: "B.S. EECS & Robotics",
    graduation_year: 2026,
    theme: "cobalt",
    is_public: true,
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
    course: "M.S. Artificial Intelligence & HCI",
    graduation_year: 2025,
    theme: "academic",
    is_public: true,
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
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
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
    onboarding_completed: true,
    onboarding_step: 7,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-10-29T00:00:00Z",
  },
];

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
];

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

    return {
      select(_columns = "*") {
        const queryObj = {
          eq(field: string, value: any) {
            queryFilter = { field, value };
            return this;
          },
          order(_field: string, _options?: { ascending?: boolean }) {
            return this;
          },
          async maybeSingle() {
            await new Promise((r) => setTimeout(r, 60));
            if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
              const found = queryFilter.field
                ? profiles.find((p) => {
                    const val = p[queryFilter.field!];
                    if (typeof val === "string" && typeof queryFilter.value === "string") {
                      return val.toLowerCase() === queryFilter.value.toLowerCase();
                    }
                    return val === queryFilter.value;
                  })
                : profiles[0] || null;
              return { data: found || null, error: null };
            } else if (table === "projects") {
              const projects = getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
              const found = queryFilter.field
                ? projects.find((p) => p[queryFilter.field!] === queryFilter.value)
                : projects[0] || null;
              return { data: found || null, error: null };
            }
            return { data: null, error: null };
          },
          async single() {
            await new Promise((r) => setTimeout(r, 60));
            if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
              const found = queryFilter.field
                ? profiles.find((p) => {
                    const val = p[queryFilter.field!];
                    if (typeof val === "string" && typeof queryFilter.value === "string") {
                      return val.toLowerCase() === queryFilter.value.toLowerCase();
                    }
                    return val === queryFilter.value;
                  })
                : profiles[0] || null;
              if (!found) return { data: null, error: { message: "Row not found", code: "PGRST116" } };
              return { data: found, error: null };
            } else if (table === "projects") {
              const projects = getStored<any[]>(STORAGE_PROJECTS_KEY, DEFAULT_PROJECTS);
              const found = queryFilter.field
                ? projects.find((p) => p[queryFilter.field!] === queryFilter.value)
                : projects[0] || null;
              if (!found) return { data: null, error: { message: "Project not found", code: "PGRST116" } };
              return { data: found, error: null };
            }
            return { data: null, error: null };
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
              let list = queryFilter.field
                ? projects.filter((p) => p[queryFilter.field!] === queryFilter.value)
                : projects;
              // Sort by is_featured DESC, order_index ASC
              list.sort((a, b) => {
                if (a.is_featured !== b.is_featured) {
                  return a.is_featured ? -1 : 1;
                }
                return (a.order_index ?? 0) - (b.order_index ?? 0);
              });
              resolve({ data: list, error: null });
            } else if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, DEFAULT_PROFILES);
              resolve({ data: profiles, error: null });
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
          let publicUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80";
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
