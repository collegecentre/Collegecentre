import { supabase } from "@/lib/supabase";
import { normalizeUsername } from "@/lib/username";
import type { Profile, SocialLink, StudentLink, Project, Achievement, Certificate, Resume } from "@/types";

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

    // 2. Fetch basic social links
    const { data: socialData } = await supabase
      .from("basic_social_links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("order_index", { ascending: true });

    const socialLinks = (socialData || []) as SocialLink[];

    // 3. Fetch configured student showcase links
    const { data: linksData } = await supabase
      .from("student_links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("order_index", { ascending: true });

    const studentLinks = ((linksData || []) as StudentLink[])
      .filter((l) => l.is_enabled !== false)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

    // 4. Fetch student showcase projects
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .eq("profile_id", profile.id);

    const projects = ((projectsData || []) as Project[])
      .filter((p) => p.is_enabled !== false)
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (a.order_index ?? 0) - (b.order_index ?? 0);
      });

    // 5. Fetch verified student achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*")
      .eq("profile_id", profile.id);

    const achievements = ((achievementsData || []) as Achievement[])
      .filter((a) => a.is_enabled !== false)
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (a.order_index ?? 0) - (b.order_index ?? 0);
      });

    // 6. Fetch verified student certificates
    // 6. Fetch verified student certificates
    const { data: certificatesData } = await supabase
      .from("certificates")
      .select("*")
      .eq("profile_id", profile.id);

    const certificates = ((certificatesData || []) as Certificate[])
      .filter((c) => c.is_enabled !== false)
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        return (a.order_index ?? 0) - (b.order_index ?? 0);
      });

    // 7. Fetch verified student resume (only if profile is public and resume is visible)
    let resume: Resume | null = null;
    if (profile.is_public !== false) {
      const { data: resumeData } = await supabase
        .from("resumes")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (resumeData && (resumeData as Resume).is_visible !== false) {
        resume = resumeData as Resume;
      }
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
