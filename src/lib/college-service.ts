/**
 * CollegeCentre - College Profiles & Campus Directory Service
 */

import { supabase } from "./supabase.ts";
import type {
  College,
  CollegeMember,
  CollegeProfileData,
  CollegeDirectoryFilters,
  ExploreStudentCardData,
  ExploreProject,
  Achievement,
  CollegeEventPlaceholder,
  CollegeClubPlaceholder,
} from "@/types";
import { DEFAULT_COLLEGE_EVENTS, DEFAULT_COLLEGE_CLUBS } from "./supabase.ts";

/**
 * Fetches college details by slug
 */
export async function getCollegeBySlug(slug: string): Promise<College | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as College;
}

/**
 * Fetches all public colleges
 */
export async function getAllColleges(): Promise<College[]> {
  const { data, error } = await supabase
    .from("colleges")
    .select("*");

  if (error || !data) {
    return [];
  }

  return data as College[];
}

/**
 * Checks if a user is an authorized college administrator or owner
 */
export async function isCollegeAdmin(userId: string, collegeId: string): Promise<boolean> {
  if (!userId || !collegeId) return false;

  const { data: member } = await supabase
    .from("college_members")
    .select("*")
    .eq("college_id", collegeId)
    .eq("profile_id", userId)
    .maybeSingle();

  if (!member) return false;

  return member.status === "active" && (member.role === "owner" || member.role === "admin");
}

/**
 * Loads rich college profile data with directory students, projects, achievements, and placeholders
 */
export async function getCollegeProfileData(
  slug: string,
  filters?: CollegeDirectoryFilters,
  currentUserId?: string
): Promise<CollegeProfileData | null> {
  const college = await getCollegeBySlug(slug);
  if (!college) return null;

  // 1. Fetch all members and student profiles
  const [membersRes, profilesRes, projectsRes, achievementsRes] = await Promise.all([
    supabase.from("college_members").select("*").eq("college_id", college.id),
    supabase.from("profiles").select("*"),
    supabase.from("projects").select("*").eq("is_enabled", true),
    supabase.from("achievements").select("*").eq("is_enabled", true),
  ]);

  const members: CollegeMember[] = (membersRes.data || []) as CollegeMember[];
  const allProfiles: any[] = profilesRes.data || [];
  const allProjects: any[] = projectsRes.data || [];
  const allAchievements: any[] = achievementsRes.data || [];

  // Determine current user membership
  let currentUserMembership: CollegeMember | null = null;
  if (currentUserId) {
    currentUserMembership = members.find((m) => m.profile_id === currentUserId) || null;
  }

  // Map member privacy overrides by profile_id
  const memberPrivacyMap = new Map<string, CollegeMember>();
  members.forEach((m) => {
    memberPrivacyMap.set(m.profile_id, m);
  });

  // 2. Identify students associated with this college
  // Conditions:
  // - college_id matches college.id OR college_slug matches college.slug OR member of college
  // - profile.is_public !== false
  // - profile.is_discoverable !== false
  // - profile.show_in_college_directory !== false
  // - If member entry exists, member.show_in_directory !== false
  const collegeProfiles = allProfiles.filter((p) => {
    const isMember = memberPrivacyMap.has(p.id);
    const matchesCollege =
      p.college_id === college.id ||
      (p.college_slug && p.college_slug.toLowerCase() === college.slug.toLowerCase()) ||
      (p.college && college.name && p.college.toLowerCase().includes(college.short_name?.toLowerCase() || college.name.toLowerCase()));

    if (!isMember && !matchesCollege) return false;

    // Strict privacy checks
    if (p.is_public === false) return false;
    if (p.is_discoverable === false) return false;
    if (p.show_in_college_directory === false) return false;

    const memberEntry = memberPrivacyMap.get(p.id);
    if (memberEntry && memberEntry.show_in_directory === false) return false;

    return true;
  });

  // Collect available filter options before query filtering
  const coursesSet = new Set<string>();
  const yearsSet = new Set<number>();
  const skillsSet = new Set<string>();

  collegeProfiles.forEach((p) => {
    if (p.course) coursesSet.add(p.course.trim());
    if (p.graduation_year) yearsSet.add(Number(p.graduation_year));
    if (Array.isArray(p.skills)) {
      p.skills.forEach((s: string) => skillsSet.add(s.trim()));
    }
  });

  // 3. Apply directory filters
  let filteredProfiles = [...collegeProfiles];

  if (filters?.query) {
    const q = filters.query.toLowerCase().trim();
    filteredProfiles = filteredProfiles.filter((p) => {
      const name = (p.full_name || "").toLowerCase();
      const username = (p.username || "").toLowerCase();
      const bio = (p.bio || "").toLowerCase();
      const course = (p.course || "").toLowerCase();
      const skills = Array.isArray(p.skills) ? p.skills.join(" ").toLowerCase() : "";
      return (
        name.includes(q) ||
        username.includes(q) ||
        bio.includes(q) ||
        course.includes(q) ||
        skills.includes(q)
      );
    });
  }

  if (filters?.course && filters.course !== "all") {
    filteredProfiles = filteredProfiles.filter((p) => p.course === filters.course);
  }

  if (filters?.graduationYear && filters.graduationYear !== "all") {
    const targetYear = Number(filters.graduationYear);
    filteredProfiles = filteredProfiles.filter((p) => Number(p.graduation_year) === targetYear);
  }

  if (filters?.skill && filters.skill !== "all") {
    filteredProfiles = filteredProfiles.filter(
      (p) => Array.isArray(p.skills) && p.skills.some((s: string) => s.toLowerCase() === filters.skill!.toLowerCase())
    );
  }

  // Map student cards with top artifact previews
  const students: ExploreStudentCardData[] = filteredProfiles.map((p) => {
    const studentProjects = allProjects.filter((proj) => proj.profile_id === p.id);
    const studentAchievements = allAchievements.filter((ach) => ach.profile_id === p.id);
    const topProject = studentProjects.find((proj) => proj.is_featured) || studentProjects[0] || null;

    return {
      id: p.id,
      username: p.username,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      bio: p.bio,
      college: p.show_college_on_profile !== false ? (p.college || college.name) : null,
      college_id: college.id,
      college_slug: college.slug,
      show_college_on_profile: p.show_college_on_profile !== false,
      show_in_college_directory: p.show_in_college_directory !== false,
      course: p.course,
      graduation_year: p.graduation_year,
      location: p.location,
      category: p.category || "engineering",
      skills: Array.isArray(p.skills) ? p.skills : [],
      theme: p.theme || "minimal",
      is_featured: !!p.is_featured,
      views_count: p.views_count || 0,
      projects_count: studentProjects.length,
      achievements_count: studentAchievements.length,
      top_project: topProject
        ? {
            id: topProject.id,
            title: topProject.title,
            description: topProject.description,
            technologies: topProject.technologies || [],
            github_url: topProject.github_url,
            demo_url: topProject.demo_url,
            cover_image_url: topProject.cover_image_url,
          }
        : null,
      created_at: p.created_at,
    };
  });

  // 4. Resolve public projects authored by students in this college
  const studentIdsSet = new Set(collegeProfiles.map((p) => p.id));
  const projects: ExploreProject[] = allProjects
    .filter((proj) => studentIdsSet.has(proj.profile_id))
    .map((proj) => {
      const author = allProfiles.find((p) => p.id === proj.profile_id);
      return {
        ...proj,
        author: author
          ? {
              username: author.username,
              full_name: author.full_name,
              avatar_url: author.avatar_url,
              college: author.show_college_on_profile !== false ? (author.college || college.name) : null,
            }
          : null,
      };
    });

  // 5. Resolve public achievements
  const achievements: Achievement[] = allAchievements.filter((ach) =>
    studentIdsSet.has(ach.profile_id)
  );

  // 6. Resolve Events and Clubs placeholders
  const events: CollegeEventPlaceholder[] = (DEFAULT_COLLEGE_EVENTS[college.id] ||
    DEFAULT_COLLEGE_EVENTS["col_nit"] ||
    []) as CollegeEventPlaceholder[];

  const clubs: CollegeClubPlaceholder[] = (DEFAULT_COLLEGE_CLUBS[college.id] ||
    DEFAULT_COLLEGE_CLUBS["col_nit"] ||
    []) as CollegeClubPlaceholder[];

  return {
    college,
    stats: {
      totalStudents: collegeProfiles.length,
      totalProjects: projects.length,
      totalAchievements: achievements.length,
      verifiedStudents: collegeProfiles.filter((p) => Boolean(p.is_verified)).length,
    },
    students,
    projects,
    achievements,
    events,
    clubs,
    currentUserMembership,
    availableCourses: Array.from(coursesSet).sort(),
    availableYears: Array.from(yearsSet).sort((a, b) => a - b),
    availableSkills: Array.from(skillsSet).sort(),
  };
}

/**
 * Connects/associates a student profile with a college
 */
export async function associateStudentWithCollege(
  profileId: string,
  collegeId: string,
  options?: {
    showOnProfile?: boolean;
    showInDirectory?: boolean;
    role?: "student" | "moderator";
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: college } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", collegeId)
      .maybeSingle();

    if (!college) {
      return { success: false, error: "Target college not found." };
    }

    // 1. Update Profile
    const showCollege = options?.showOnProfile ?? true;
    const showDirectory = options?.showInDirectory ?? true;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        college: college.name,
        college_id: college.id,
        college_slug: college.slug,
        show_college_on_profile: showCollege,
        show_in_college_directory: showDirectory,
      })
      .eq("id", profileId);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 2. Insert or update college_members
    await supabase.from("college_members").insert({
      college_id: college.id,
      profile_id: profileId,
      role: options?.role || "student",
      status: "active",
      show_in_directory: showDirectory,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to associate college." };
  }
}

/**
 * Updates student's college privacy settings
 */
export async function updateStudentCollegePrivacy(
  profileId: string,
  options: {
    show_college_on_profile?: boolean;
    show_in_college_directory?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        ...(options.show_college_on_profile !== undefined && {
          show_college_on_profile: options.show_college_on_profile,
        }),
        ...(options.show_in_college_directory !== undefined && {
          show_in_college_directory: options.show_in_college_directory,
        }),
      })
      .eq("id", profileId);

    if (profileError) return { success: false, error: profileError.message };

    if (options.show_in_college_directory !== undefined) {
      await supabase
        .from("college_members")
        .update({ show_in_directory: options.show_in_college_directory })
        .eq("profile_id", profileId);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update college privacy." };
  }
}

/**
 * Updates college details (Restricted to college admin/owner)
 */
export async function updateCollegeProfile(
  collegeId: string,
  adminUserId: string,
  updates: Partial<College>
): Promise<{ data?: College; error?: string }> {
  const isAdmin = await isCollegeAdmin(adminUserId, collegeId);
  if (!isAdmin) {
    return { error: "Unauthorized: Only verified college administrators can update this profile." };
  }

  // Prevent changing verification_status directly via regular edit
  const safeUpdates = { ...updates };
  delete safeUpdates.verification_status;
  delete safeUpdates.verified_at;

  const { data, error } = await supabase
    .from("colleges")
    .update(safeUpdates)
    .eq("id", collegeId);

  if (error) return { error: error.message };
  return { data: data as College };
}

/**
 * Creates a new college community (Unverified by default)
 */
export async function createCollege(
  data: {
    name: string;
    slug: string;
    short_name?: string;
    location?: string;
    website?: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
  },
  creatorUserId: string
): Promise<{ data?: College; error?: string }> {
  if (!data.name || !data.slug) {
    return { error: "College name and slug are required." };
  }

  const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

  // Check slug availability
  const existing = await getCollegeBySlug(cleanSlug);
  if (existing) {
    return { error: `College slug '${cleanSlug}' is already taken.` };
  }

  const collegePayload: Partial<College> = {
    slug: cleanSlug,
    name: data.name.trim(),
    short_name: data.short_name?.trim() || null,
    location: data.location?.trim() || null,
    website: data.website?.trim() || null,
    description: data.description?.trim() || null,
    logo_url: data.logo_url || null,
    banner_url: data.banner_url || null,
    verification_status: "unverified",
  };

  const { data: inserted, error } = await supabase
    .from("colleges")
    .insert(collegePayload);

  if (error || !inserted) {
    return { error: error?.message || "Failed to create college." };
  }

  const createdCollege = (Array.isArray(inserted) ? inserted[0] : inserted) as College;

  // Make creator the college owner
  if (creatorUserId) {
    await supabase.from("college_members").insert({
      college_id: createdCollege.id,
      profile_id: creatorUserId,
      role: "owner",
      status: "active",
      show_in_directory: true,
    });
  }

  return { data: createdCollege };
}

/**
 * Requests official college verification
 */
export async function requestCollegeVerification(
  collegeId: string,
  adminUserId: string,
  institutionalDomain: string
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = await isCollegeAdmin(adminUserId, collegeId);
  if (!isAdmin) {
    return { success: false, error: "Only a college owner or administrator can request official verification." };
  }

  if (!institutionalDomain || !institutionalDomain.includes(".")) {
    return { success: false, error: "A valid institutional domain (e.g. university.edu) is required." };
  }

  const { error } = await supabase
    .from("colleges")
    .update({
      verification_status: "pending",
      verified_domain: institutionalDomain.trim().toLowerCase(),
    })
    .eq("id", collegeId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * SECURITY GUARD:
 * Enforces that college administrators cannot edit student personal profiles without authorization.
 */
export async function attemptAdminUpdateStudentProfile(
  adminUserId: string,
  targetStudentId: string,
  _updates: any
): Promise<{ allowed: boolean; error?: string }> {
  // Personal profile updates are only permitted if the actor is the user themselves
  if (adminUserId !== targetStudentId) {
    return {
      allowed: false,
      error: "Security Violation: College administrators cannot modify student personal profiles.",
    };
  }
  return { allowed: true };
}
