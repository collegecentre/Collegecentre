import { supabase } from "./supabase.ts";
import { normalizeUsername } from "./username.ts";
import type { Profile, SocialLink, StudentLink, Project, Achievement, Certificate, Resume } from "../types/index.ts";

export interface StudentProfileData {
  profile: Profile;
  socialLinks: SocialLink[];
  studentLinks: StudentLink[];
  projects: Project[];
  achievements: Achievement[];
  certificates: Certificate[];
  resume: Resume | null;
}

/**
 * Fetches public student profile data by username.
 * Supports both real Supabase and in-memory mock client.
 * 
 * Production Security:
 * Strictly isolates private profiles (is_public = false), never returning
 * private projects, achievements, certificates, resume, or links to public visitors.
 * 
 * Performance:
 * Queries all related showcase data concurrently with Promise.all to minimize TTFB.
 */
export async function getStudentProfileByUsername(
  rawUsername: string
): Promise<StudentProfileData | null> {
  const normalized = normalizeUsername(rawUsername);
  if (!normalized) return null;

  try {
    // 1. Fetch profile record
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", normalized)
      .maybeSingle();

    if (profileError || !profileData) {
      return null;
    }

    const profile = profileData as Profile;

    // Security check: Private profiles return only public identity shell
    if (profile.is_public === false) {
      return {
        profile,
        socialLinks: [],
        studentLinks: [],
        projects: [],
        achievements: [],
        certificates: [],
        resume: null,
      };
    }

    // 2. Fetch all related showcase modules concurrently
    const [socialRes, linksRes, projectsRes, achievementsRes, certificatesRes, resumeRes] =
      await Promise.all([
        supabase
          .from("basic_social_links")
          .select("*")
          .eq("profile_id", profile.id)
          .order("order_index", { ascending: true }),

        supabase
          .from("student_links")
          .select("*")
          .eq("profile_id", profile.id)
          .order("order_index", { ascending: true }),

        supabase
          .from("projects")
          .select("*")
          .eq("profile_id", profile.id),

        supabase
          .from("achievements")
          .select("*")
          .eq("profile_id", profile.id),

        supabase
          .from("certificates")
          .select("*")
          .eq("profile_id", profile.id),

        supabase
          .from("resumes")
          .select("*")
          .eq("profile_id", profile.id)
          .maybeSingle(),
      ]);

    const socialLinks = (socialRes.data || []) as SocialLink[];

    const studentLinks = ((linksRes.data || []) as StudentLink[])
      .filter((l) => l.is_enabled !== false)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    const projects = ((projectsRes.data || []) as Project[])
      .filter((p) => p.is_enabled !== false)
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (a.order_index ?? 0) - (b.order_index ?? 0);
      });

    const achievements = ((achievementsRes.data || []) as Achievement[])
      .filter((a) => a.is_enabled !== false)
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (a.order_index ?? 0) - (b.order_index ?? 0);
      });

    const certificates = ((certificatesRes.data || []) as Certificate[])
      .filter((c) => c.is_enabled !== false)
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (a.order_index ?? 0) - (b.order_index ?? 0);
      });

    let resume: Resume | null = null;
    if (resumeRes.data && (resumeRes.data as Resume).is_visible !== false) {
      resume = resumeRes.data as Resume;
    }

    return {
      profile,
      socialLinks,
      studentLinks,
      projects,
      achievements,
      certificates,
      resume,
    };
  } catch (err) {
    console.error("Failed to load student profile:", err);
    return null;
  }
}
