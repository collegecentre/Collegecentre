import { supabase } from "./supabase.ts";
import type {
  Profile,
  Project,
  Achievement,
  ExploreFilters,
  ExploreStudentCardData,
  ExploreProject,
  ExploreResponse,
} from "../types/index.ts";

/**
 * Searches and filters public discoverable students and technical projects.
 * Strictly enforces that private profiles (is_public = false) and unlisted profiles
 * (is_discoverable = false) are never returned in explore.
 */
export async function getExploreData(
  filters: ExploreFilters = {},
  page: number = 1,
  limit: number = 9
): Promise<ExploreResponse> {
  const {
    query = "",
    college = "",
    course = "",
    graduationYear,
    skill = "",
    category = "",
    location = "",
    section = "all",
  } = filters;

  // 1. Fetch public profiles from database
  const { data: rawProfiles, error: profileError } = await supabase
    .from("profiles")
    .select("*");

  if (profileError || !rawProfiles) {
    console.error("[ExploreService] Failed to fetch profiles:", profileError);
    return createEmptyExploreResponse(page, limit);
  }

  // 2. Fetch enabled projects and achievements to hydrate preview cards
  const { data: rawProjects } = await supabase.from("projects").select("*");
  const { data: rawAchievements } = await supabase.from("achievements").select("*");

  const allProjects = (rawProjects || []) as Project[];
  const allAchievements = (rawAchievements || []) as Achievement[];

  // 3. Strict privacy filtering: MUST be is_public = true AND is_discoverable = true
  const discoverableProfiles = (rawProfiles as Profile[]).filter((p) => {
    return p.is_public !== false && p.is_discoverable !== false;
  });

  const profileMap = new Map<string, Profile>();
  discoverableProfiles.forEach((p) => profileMap.set(p.id, p));

  // 4. Map students into ExploreStudentCardData
  let students: ExploreStudentCardData[] = discoverableProfiles.map((p) => {
    const studentProjects = allProjects.filter(
      (proj) => proj.profile_id === p.id && proj.is_enabled !== false
    );
    const studentAchievements = allAchievements.filter(
      (ach) => ach.profile_id === p.id && ach.is_enabled !== false
    );

    // Pick top project: featured first, then first in order
    const topProject =
      studentProjects.find((proj) => proj.is_featured) || studentProjects[0] || null;

    // Collect skills: profile skills + project technologies
    const skillsSet = new Set<string>(p.skills || []);
    studentProjects.forEach((proj) => {
      (proj.technologies || []).forEach((t) => skillsSet.add(t));
    });

    return {
      id: p.id,
      username: p.username,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      bio: p.bio,
      college: p.show_college_on_profile !== false ? p.college : null,
      college_id: p.college_id || null,
      college_slug: p.college_slug || null,
      show_college_on_profile: p.show_college_on_profile !== false,
      show_in_college_directory: p.show_in_college_directory !== false,
      course: p.course,
      graduation_year: p.graduation_year,
      location: p.location || null,
      category: p.category || "engineering",
      skills: Array.from(skillsSet).slice(0, 6),
      theme: p.theme,
      is_featured: Boolean(p.is_featured),
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

  // 5. Map discoverable projects with author information
  // Note: Projects appear if enabled AND their author is public
  let projects: ExploreProject[] = allProjects
    .filter((proj) => proj.is_enabled !== false)
    .map((proj) => {
      const author = profileMap.get(proj.profile_id);
      return {
        ...proj,
        author: author
          ? {
              username: author.username,
              full_name: author.full_name,
              avatar_url: author.avatar_url,
              college: author.show_college_on_profile !== false ? author.college : null,
            }
          : null,
      };
    })
    .filter((proj) => proj.author !== null); // exclude orphaned or private author projects

  // 6. Collect available filter options for dropdowns across discoverable data
  const collegesSet = new Set<string>();
  const skillsSet = new Set<string>();
  const yearsSet = new Set<number>();
  const categoriesSet = new Set<string>();

  students.forEach((s) => {
    if (s.college) collegesSet.add(s.college);
    if (s.graduation_year) yearsSet.add(s.graduation_year);
    if (s.category) categoriesSet.add(s.category);
    s.skills.forEach((sk) => skillsSet.add(sk));
  });

  projects.forEach((pr) => {
    (pr.technologies || []).forEach((t) => skillsSet.add(t));
  });

  // 7. Apply Search Query across students and projects
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    students = students.filter((s) => {
      const nameMatch = s.full_name?.toLowerCase().includes(q);
      const userMatch = s.username.toLowerCase().includes(q);
      const bioMatch = s.bio?.toLowerCase().includes(q);
      const collegeMatch = s.college?.toLowerCase().includes(q);
      const courseMatch = s.course?.toLowerCase().includes(q);
      const skillMatch = s.skills.some((sk) => sk.toLowerCase().includes(q));
      const topProjMatch = s.top_project?.title.toLowerCase().includes(q);
      return (
        nameMatch ||
        userMatch ||
        bioMatch ||
        collegeMatch ||
        courseMatch ||
        skillMatch ||
        topProjMatch
      );
    });

    projects = projects.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const techMatch = p.technologies?.some((t) => t.toLowerCase().includes(q));
      const authorMatch = p.author?.full_name?.toLowerCase().includes(q);
      return titleMatch || descMatch || techMatch || authorMatch;
    });
  }

  // 8. Apply Dropdown Filters
  if (college) {
    const colLower = college.toLowerCase();
    students = students.filter(
      (s) =>
        s.college?.toLowerCase().includes(colLower) ||
        (s.college_slug && s.college_slug.toLowerCase() === colLower)
    );
    projects = projects.filter(
      (p) => p.author?.college?.toLowerCase().includes(colLower)
    );
  }

  if (course) {
    students = students.filter(
      (s) => s.course?.toLowerCase().includes(course.toLowerCase())
    );
  }

  if (graduationYear) {
    const targetYear = parseInt(String(graduationYear), 10);
    students = students.filter((s) => s.graduation_year === targetYear);
  }

  if (category && category !== "all") {
    students = students.filter(
      (s) => s.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (skill) {
    const skLower = skill.toLowerCase();
    students = students.filter((s) =>
      s.skills.some((sk) => sk.toLowerCase() === skLower)
    );
    projects = projects.filter((p) =>
      p.technologies?.some((t) => t.toLowerCase() === skLower)
    );
  }

  if (location) {
    const locLower = location.toLowerCase();
    students = students.filter((s) =>
      s.location?.toLowerCase().includes(locLower)
    );
  }

  // 9. Apply Section Sorters & Filters
  if (section === "featured") {
    students = students.filter((s) => s.is_featured);
    projects = projects.filter((p) => p.is_featured);
  } else if (section === "popular") {
    students.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    projects.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  } else if (section === "recent") {
    students.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    projects.sort(
      (a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
    );
  } else {
    // Default smart sorting: Featured first, then highest views
    students.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (b.views_count || 0) - (a.views_count || 0);
    });
    projects.sort((a, b) => {
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return (a.order_index ?? 0) - (b.order_index ?? 0);
    });
  }

  const totalStudents = students.length;
  const totalProjects = projects.length;

  // 10. Pagination Slicing
  const startIndex = (page - 1) * limit;
  const paginatedStudents = students.slice(startIndex, startIndex + limit);
  const paginatedProjects = projects.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < Math.max(totalStudents, totalProjects);

  return {
    students: paginatedStudents,
    projects: paginatedProjects,
    totalStudents,
    totalProjects,
    page,
    limit,
    hasMore,
    availableColleges: Array.from(collegesSet).sort(),
    availableSkills: Array.from(skillsSet).sort(),
    availableYears: Array.from(yearsSet).sort((a, b) => a - b),
    availableCategories: Array.from(categoriesSet).sort(),
  };
}

function createEmptyExploreResponse(page: number, limit: number): ExploreResponse {
  return {
    students: [],
    projects: [],
    totalStudents: 0,
    totalProjects: 0,
    page,
    limit,
    hasMore: false,
    availableColleges: [],
    availableSkills: [],
    availableYears: [],
    availableCategories: [],
  };
}
