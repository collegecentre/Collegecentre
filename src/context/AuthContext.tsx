"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

interface AuthContextType {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any | null>(null);
  const [session, setSession] = React.useState<any | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchProfile = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.warn("Could not fetch profile:", error.message);
      }
      setProfile(data || null);
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setProfile(null);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: any) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = React.useCallback(
    async (email: string, password: string, metadata?: Record<string, any>) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: metadata || {} },
        });

        if (error) return { error };

        if (data.session) {
          setSession(data.session);
          setUser(data.user);
        }
        return { error: null };
      } catch (err: any) {
        return { error: err };
      }
    },
    []
  );

  const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }, [fetchProfile]);

  const signInWithGoogle = React.useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) return { error };
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  }, []);

  const resetPassword = React.useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }, []);

  const updatePassword = React.useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }, []);

  const refreshProfile = React.useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const value = React.useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      updatePassword,
      signOut,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      signUp,
      signIn,
      signInWithGoogle,
      resetPassword,
      updatePassword,
      signOut,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
