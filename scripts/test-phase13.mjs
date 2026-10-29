// Phase 13 Comprehensive Test Suite: Explore & Student Network Discovery
// Verifies Search across students & projects, multi-criteria Filtering (College, Course, Year, Skill, Category, Location),
// Strict Privacy & Discoverability Enforcement (is_public=false and is_discoverable=false excluded),
// Sections (featured, popular, recent), Project Discovery with Author metadata, and Pagination.

import { getExploreData } from "../src/lib/explore-service.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase13Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: Search Across Student Profiles & Projects");
  console.log("=========================================\n");

  // 1. Search by student name
  const nameSearch = await getExploreData({ query: "Sreehari" });
  assert(nameSearch.students.length >= 1, "Finds student by full name 'Sreehari'");
  assert(nameSearch.students.some((s) => s.username === "sreehari"), "Includes '@sreehari' in results");

  // 2. Search by student handle
  const handleSearch = await getExploreData({ query: "alexrivera" });
  assert(handleSearch.students.length >= 1, "Finds student by handle 'alexrivera'");
  assert(handleSearch.students[0].username === "alexrivera", "Returns exact username match");

  // 3. Search by technology / skill
  const skillSearch = await getExploreData({ query: "PyTorch" });
  assert(skillSearch.students.length >= 1, "Finds student by skill 'PyTorch'");
  assert(skillSearch.students.some((s) => s.username === "priyasharma"), "Includes Priya Sharma (AI researcher)");

  // 4. Search by project title
  const projectSearch = await getExploreData({ query: "eBPF" });
  assert(projectSearch.projects.length >= 1, "Finds project by query 'eBPF'");
  assert(projectSearch.projects.some((p) => p.title.includes("eBPF")), "Returns eBPF project");

  // 5. Search by university
  const collegeSearch = await getExploreData({ query: "Berkeley" });
  assert(collegeSearch.students.some((s) => s.college?.includes("Berkeley")), "Finds students by college 'Berkeley'");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Multi-Criteria Filtering Architecture");
  console.log("=========================================\n");

  // 1. Filter by College
  const nitFilter = await getExploreData({ college: "National Institute of Technology" });
  assert(nitFilter.students.length >= 1, "Filters students by college 'NIT'");
  assert(nitFilter.students.every((s) => s.college?.includes("National Institute of Technology")), "All returned students belong to NIT");

  // 2. Filter by Discipline Category
  const designFilter = await getExploreData({ category: "design" });
  assert(designFilter.students.length >= 1, "Filters students by category 'design'");
  assert(designFilter.students.every((s) => s.category === "design"), "All returned students are in 'design'");
  assert(designFilter.students.some((s) => s.username === "elenarostova"), "Includes Elena Rostova");

  const researchFilter = await getExploreData({ category: "research" });
  assert(researchFilter.students.every((s) => s.category === "research"), "Filters by category 'research'");

  // 3. Filter by Graduation Year
  const year2025 = await getExploreData({ graduationYear: 2025 });
  assert(year2025.students.length >= 1, "Filters students by graduation year 2025");
  assert(year2025.students.every((s) => s.graduation_year === 2025), "All returned students graduate in 2025");

  // 4. Filter by specific Skill
  const zigFilter = await getExploreData({ skill: "Zig" });
  assert(zigFilter.students.length >= 1, "Filters students by skill 'Zig'");
  assert(zigFilter.students.some((s) => s.username === "marcuschen"), "Includes Marcus Chen for Zig");
  assert(zigFilter.projects.some((p) => p.technologies.includes("Zig")), "Includes Zig project");

  // 5. Filter by Location (voluntarily provided)
  const locFilter = await getExploreData({ location: "Pittsburgh" });
  assert(locFilter.students.length >= 1, "Filters students by location 'Pittsburgh'");
  assert(locFilter.students[0].username === "elenarostova", "Matches Elena in Pittsburgh");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Strict Privacy & Discoverability Enforcement");
  console.log("=========================================\n");

  // 1. Verify private profile is NEVER included
  const allExplore = await getExploreData({}, 1, 50);
  const foundPrivate = allExplore.students.find((s) => s.username === "privateuser");
  assert(!foundPrivate, "Private profile 'privateuser' (is_public=false) is EXCLUDED from explore");

  // 2. Verify unlisted discoverability profile is NEVER included
  const foundHidden = allExplore.students.find((s) => s.username === "devinhidden");
  assert(!foundHidden, "Unlisted profile 'devinhidden' (is_discoverable=false) is EXCLUDED from explore");

  // 3. Search specifically for unlisted profile handle - MUST STILL RETURN 0
  const hiddenSearch = await getExploreData({ query: "devinhidden" });
  assert(hiddenSearch.students.length === 0, "Direct search for unlisted handle returns 0 results");

  // 4. Search specifically for private user - MUST STILL RETURN 0
  const privateSearch = await getExploreData({ query: "privateuser" });
  assert(privateSearch.students.length === 0, "Direct search for private user returns 0 results");

  console.log("✅ PASSED: Both is_public=false and is_discoverable=false profiles are completely excluded");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Discovery Sections (Featured, Popular, Newest)");
  console.log("=========================================\n");

  // 1. Featured Section
  const featuredExplore = await getExploreData({ section: "featured" });
  assert(featuredExplore.students.length >= 1, "Returns featured students");
  assert(featuredExplore.students.every((s) => s.is_featured === true), "All students in featured section have is_featured=true");
  assert(featuredExplore.projects.every((p) => p.is_featured === true), "All projects in featured section have is_featured=true");

  // 2. Popular Section (Ordered by view activity)
  const popularExplore = await getExploreData({ section: "popular" });
  assert(popularExplore.students.length >= 2, "Returns popular students list");
  for (let i = 0; i < popularExplore.students.length - 1; i++) {
    const curr = popularExplore.students[i].views_count || 0;
    const next = popularExplore.students[i + 1].views_count || 0;
    assert(curr >= next, `Students ordered by views descending (${curr} >= ${next})`);
  }

  // 3. Recent / Newest Section
  const recentExplore = await getExploreData({ section: "recent" });
  assert(recentExplore.students.length >= 2, "Returns recent students list");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Technical Project Discovery & Author Metadata");
  console.log("=========================================\n");

  const projectDiscovery = await getExploreData({}, 1, 10);
  assert(projectDiscovery.projects.length >= 5, `Discovers ${projectDiscovery.projects.length} technical projects`);

  for (const proj of projectDiscovery.projects) {
    assert(Boolean(proj.id), "Project has unique id");
    assert(Boolean(proj.title), `Project '${proj.title}' has title`);
    assert(Boolean(proj.description), `Project '${proj.title}' has description`);
    assert(Array.isArray(proj.technologies) && proj.technologies.length > 0, `Project '${proj.title}' has technologies stack`);
    assert(Boolean(proj.author), `Project '${proj.title}' has author credit`);
    assert(Boolean(proj.author.username), `Project '${proj.title}' author has username (@${proj.author.username})`);
    assert(Boolean(proj.author.college), `Project '${proj.title}' author has college context (${proj.author.college})`);
  }
  console.log("✅ PASSED: All discovered projects contain verified author metadata and technical stacks");

  console.log("\n=========================================");
  console.log("TEST SUITE 6: Pagination & Cursor Limits");
  console.log("=========================================\n");

  // Page 1 with limit 3
  const page1 = await getExploreData({}, 1, 3);
  assert(page1.students.length === 3, "Page 1 returns exactly 3 students");
  assert(page1.hasMore === true, "Page 1 signals hasMore = true");

  // Page 2 with limit 3
  const page2 = await getExploreData({}, 2, 3);
  assert(page2.students.length >= 1, "Page 2 returns next student batch");
  assert(page1.students[0].id !== page2.students[0].id, "Page 2 returns distinct students from Page 1");

  console.log("\n=========================================");
  console.log("TEST SUITE 7: Empty Search Resilience");
  console.log("=========================================\n");

  const emptySearch = await getExploreData({ query: "completely_nonexistent_handle_12345" });
  assert(emptySearch.students.length === 0, "Returns 0 students for nonexistent search");
  assert(emptySearch.projects.length === 0, "Returns 0 projects for nonexistent search");
  assert(emptySearch.totalStudents === 0, "totalStudents is 0");
  assert(emptySearch.totalProjects === 0, "totalProjects is 0");

  console.log("\n=========================================");
  console.log("TEST SUITE 8: Available Filter Metadata Aggregation");
  console.log("=========================================\n");

  assert(allExplore.availableColleges.length >= 4, `Aggregated ${allExplore.availableColleges.length} distinct colleges`);
  assert(allExplore.availableSkills.length >= 10, `Aggregated ${allExplore.availableSkills.length} distinct technical skills`);
  assert(allExplore.availableYears.length >= 2, `Aggregated graduation years (${allExplore.availableYears.join(", ")})`);
  assert(allExplore.availableCategories.length >= 3, `Aggregated categories (${allExplore.availableCategories.join(", ")})`);

  console.log("\n=========================================");
  console.log("🎉 ALL PHASE 13 EXPLORE & DISCOVERY TESTS PASSED!");
  console.log("=========================================\n");
}

runPhase13Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
