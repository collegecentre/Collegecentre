import { supabase } from "@/lib/supabase";
import { normalizeUsername } from "@/lib/username";
import type { Profile, SocialLink, StudentLink } from "@/types";

export interface StudentProfileData {
  profile: Profile;
  socialLinks: SocialLink[];
  studentLinks: StudentLink[];
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

    return {
      profile,
      socialLinks,
      studentLinks,
    };
  } catch (err) {
    console.error("Failed to load student profile:", err);
    return null;
  }
}
