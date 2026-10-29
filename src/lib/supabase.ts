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
        return {
          eq(field: string, value: any) {
            queryFilter = { field, value };
            return this;
          },
          async maybeSingle() {
            await new Promise((r) => setTimeout(r, 100));
            if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, []);
              const found = queryFilter.field
                ? profiles.find((p) => p[queryFilter.field!] === queryFilter.value)
                : profiles[0] || null;
              return { data: found || null, error: null };
            }
            return { data: null, error: null };
          },
          async single() {
            await new Promise((r) => setTimeout(r, 100));
            if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, []);
              const found = queryFilter.field
                ? profiles.find((p) => p[queryFilter.field!] === queryFilter.value)
                : profiles[0] || null;
              if (!found) return { data: null, error: { message: "Row not found", code: "PGRST116" } };
              return { data: found, error: null };
            }
            return { data: null, error: null };
          },
          async then(resolve: any) {
            await new Promise((r) => setTimeout(r, 100));
            if (table === "basic_social_links") {
              const links = getStored<any[]>(STORAGE_SOCIAL_KEY, []);
              const filtered = queryFilter.field
                ? links.filter((l) => l[queryFilter.field!] === queryFilter.value)
                : links;
              resolve({ data: filtered, error: null });
            } else if (table === "profiles") {
              const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, []);
              resolve({ data: profiles, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          },
        };
      },

      async insert(rows: any | any[]) {
        await new Promise((r) => setTimeout(r, 200));
        const list = Array.isArray(rows) ? rows : [rows];

        if (table === "profiles") {
          const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, []);
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
          const links = getStored<any[]>(STORAGE_SOCIAL_KEY, []);
          list.forEach((item) => {
            links.push({
              id: "link_" + Math.random().toString(36).substring(2, 9),
              ...item,
              created_at: new Date().toISOString(),
            });
          });
          setStored(STORAGE_SOCIAL_KEY, links);
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
                await new Promise((r) => setTimeout(r, 200));
                if (table === "profiles") {
                  const profiles = getStored<any[]>(STORAGE_PROFILES_KEY, []);
                  const idx = profiles.findIndex((p) => p[field] === value);
                  if (idx > -1) {
                    profiles[idx] = { ...profiles[idx], ...updates, updated_at: new Date().toISOString() };
                    setStored(STORAGE_PROFILES_KEY, profiles);
                    resolve({ data: profiles[idx], error: null });
                  } else {
                    resolve({ data: null, error: { message: "Profile not found to update" } });
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
                }
                resolve({ error: null });
              },
            };
          },
        };
      },
    };
  },
};

/**
 * Universal Supabase Client
 * Uses real Supabase client when configured, otherwise uses reliable mock fallback.
 */
export const supabase = (isLiveSupabase ? realSupabase : (mockSupabase as any));
