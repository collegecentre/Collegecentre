// Phase 14 Comprehensive Test Suite: College Profiles, Campus Networks, Student Associations & RBAC
// Verifies:
// 1. College creation & slug resolution
// 2. Student association with colleges
// 3. Student privacy controls (hide college on profile, hide from campus directory, private profile exclusion)
// 4. College verification architecture (unverified vs pending vs verified, domain validation)
// 5. College roles & RBAC (owner, admin, student, strict prohibition against college admins modifying student personal profiles)
// 6. Campus directory filtering (course, graduation year, skills, search query)
// 7. Campus projects & achievements discovery
// 8. Campus events & clubs placeholders

import {
  getCollegeBySlug,
  getAllColleges,
  getCollegeProfileData,
  associateStudentWithCollege,
  updateStudentCollegePrivacy,
  isCollegeAdmin,
  updateCollegeProfile,
  createCollege,
  requestCollegeVerification,
  attemptAdminUpdateStudentProfile,
} from "../src/lib/college-service.ts";
import { mockSupabase } from "../src/lib/supabase.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase14Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: College Creation & Slug Retrieval");
  console.log("=========================================\n");

  const nit = await getCollegeBySlug("nit-calicut");
  assert(nit !== null, "Retrieves college by slug 'nit-calicut'");
  assert(nit.name === "National Institute of Technology Calicut", "College name is accurate");
  assert(nit.short_name === "NIT Calicut", "College short name is accurate");
  assert(nit.verification_status === "verified", "NIT Calicut has verified status");
  assert(nit.verified_domain === "nitc.ac.in", "Verified domain is nitc.ac.in");

  const berkeley = await getCollegeBySlug("uc-berkeley");
  assert(berkeley !== null, "Retrieves college by slug 'uc-berkeley'");
  assert(berkeley.verification_status === "verified", "UC Berkeley has verified status");
  assert(berkeley.verified_domain === "berkeley.edu", "Verified domain is berkeley.edu");

  const allColleges = await getAllColleges();
  assert(allColleges.length >= 5, "Discovers all seeded colleges across the network");

  // Create a new college community
  const newColRes = await createCollege(
    {
      name: "International Institute of Information Technology",
      slug: "iiit-hyderabad",
      short_name: "IIIT-H",
      location: "Hyderabad, India",
      website: "https://www.iiit.ac.in",
      description: "Autonomous university focused on research in computer science and robotics.",
    },
    "usr_sreehari"
  );

  assert(newColRes.data !== undefined, "Successfully creates new college");
  assert(newColRes.data.slug === "iiit-hyderabad", "Created college has correct normalized slug");
  assert(newColRes.data.verification_status === "unverified", "New college defaults to 'unverified'");

  // Verify creator was assigned owner role
  const isOwner = await isCollegeAdmin("usr_sreehari", newColRes.data.id);
  assert(isOwner === true, "Creator is granted owner role in college_members");

  // Duplicate slug prevention
  const dupColRes = await createCollege(
    {
      name: "Duplicate College",
      slug: "nit-calicut",
    },
    "usr_alex"
  );
  assert(dupColRes.error !== undefined, "Prevents duplicate college slug creation");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Student Association with College");
  console.log("=========================================\n");

  // Associate test student with college
  const assocRes = await associateStudentWithCollege("usr_kavya", nit.id, {
    showOnProfile: true,
    showInDirectory: true,
  });
  assert(assocRes.success === true, "Successfully associates student with college");

  // Verify profile updated
  const { data: updatedProfile } = await mockSupabase
    .from("profiles")
    .select("*")
    .eq("id", "usr_kavya")
    .single();

  assert(updatedProfile.college_id === nit.id, "Profile college_id updated");
  assert(updatedProfile.college_slug === "nit-calicut", "Profile college_slug updated");
  assert(updatedProfile.show_college_on_profile === true, "Profile show_college_on_profile set to true");
  assert(updatedProfile.show_in_college_directory === true, "Profile show_in_college_directory set to true");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Student Privacy & Directory Exclusion Controls");
  console.log("=========================================\n");

  // Verify secretbuilder (show_in_college_directory=false) is excluded from NIT directory
  const nitData = await getCollegeProfileData("nit-calicut");
  assert(nitData !== null, "Loads NIT Calicut profile data");

  const foundSecretInDirectory = nitData.students.some((s) => s.username === "secretbuilder");
  assert(
    !foundSecretInDirectory,
    "Student with show_in_college_directory=false is strictly EXCLUDED from campus directory"
  );

  // Verify private user (is_public=false) is excluded from directory
  const foundPrivateInDirectory = nitData.students.some((s) => s.username === "privateuser");
  assert(
    !foundPrivateInDirectory,
    "Private profile (is_public=false) is strictly EXCLUDED from campus directory"
  );

  // Verify unlisted user (is_discoverable=false) is excluded from directory
  const foundUnlistedInDirectory = nitData.students.some((s) => s.username === "devinhidden");
  assert(
    !foundUnlistedInDirectory,
    "Unlisted profile (is_discoverable=false) is strictly EXCLUDED from campus directory"
  );

  // Test toggling student college privacy
  const privRes = await updateStudentCollegePrivacy("usr_sreehari", {
    show_college_on_profile: false,
    show_in_college_directory: false,
  });
  assert(privRes.success === true, "Student can update college privacy preferences");

  const nitDataAfterPrivacy = await getCollegeProfileData("nit-calicut");
  const foundSreehariInDirectory = nitDataAfterPrivacy.students.some((s) => s.username === "sreehari");
  assert(
    !foundSreehariInDirectory,
    "Student is immediately excluded from directory when show_in_college_directory is set to false"
  );

  // Restore for subsequent tests
  await updateStudentCollegePrivacy("usr_sreehari", {
    show_college_on_profile: true,
    show_in_college_directory: true,
  });

  console.log("\n=========================================");
  console.log("TEST SUITE 4: College Verification Architecture");
  console.log("=========================================\n");

  const unverifiedCol = await getCollegeBySlug("community-tech-collective");
  assert(unverifiedCol !== null, "Retrieves community tech collective");
  assert(
    unverifiedCol.verification_status === "unverified",
    "Unverified community college is NOT claimed as verified"
  );
  assert(unverifiedCol.verified_domain === null, "Unverified college has null verified domain");

  // Non-admin cannot request verification
  const unauthVerif = await requestCollegeVerification(
    unverifiedCol.id,
    "usr_kavya",
    "communitytech.dev"
  );
  assert(unauthVerif.success === false, "Non-admin cannot request college verification");

  // Owner can request verification
  await mockSupabase.from("college_members").insert({
    college_id: unverifiedCol.id,
    profile_id: "usr_alex",
    role: "owner",
    status: "active",
    show_in_directory: true,
  });

  const authVerif = await requestCollegeVerification(
    unverifiedCol.id,
    "usr_alex",
    "communitytech.dev"
  );
  assert(authVerif.success === true, "College owner can request official verification");

  const { data: pendingCol } = await mockSupabase
    .from("colleges")
    .select("*")
    .eq("id", unverifiedCol.id)
    .single();

  assert(pendingCol.verification_status === "pending", "Status successfully transitioned to 'pending'");
  assert(pendingCol.verified_domain === "communitytech.dev", "Verified domain queued for audit");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: College Roles, RBAC & Security Boundaries");
  console.log("=========================================\n");

  // Sreehari is owner of NIT Calicut
  const sreehariIsAdmin = await isCollegeAdmin("usr_sreehari", nit.id);
  assert(sreehariIsAdmin === true, "Identifies college owner as college administrator");

  // Priya is a student at Stanford, not an admin of NIT
  const priyaIsAdmin = await isCollegeAdmin("usr_priya", nit.id);
  assert(priyaIsAdmin === false, "Identifies regular student as non-admin");

  // College admin can update college description
  const updateRes = await updateCollegeProfile(nit.id, "usr_sreehari", {
    description: "Updated description for National Institute of Technology Calicut.",
  });
  assert(updateRes.data !== undefined, "College admin can update college information");

  // Non-admin CANNOT update college description
  const unauthUpdateRes = await updateCollegeProfile(nit.id, "usr_priya", {
    description: "Malicious update attempt.",
  });
  assert(unauthUpdateRes.error !== undefined, "Non-admin is BLOCKED from modifying college profile");

  // CRITICAL SECURITY REQUIREMENT:
  // College admins CANNOT edit students' personal profiles
  const studentProfileTamper = await attemptAdminUpdateStudentProfile(
    "usr_sreehari", // admin of NIT
    "usr_alex",     // student profile
    { full_name: "Tampered Name" }
  );
  assert(
    studentProfileTamper.allowed === false,
    "College admin is STRICTLY BLOCKED from modifying student personal profiles"
  );

  console.log("\n=========================================");
  console.log("TEST SUITE 6: Campus Directory Filtering & Search");
  console.log("=========================================\n");

  // Filter by course
  const nitCsStudents = await getCollegeProfileData("nit-calicut", {
    course: "Computer Science & Engineering",
  });
  assert(nitCsStudents.students.length > 0, "Returns students filtered by course");
  assert(
    nitCsStudents.students.every((s) => s.course === "Computer Science & Engineering"),
    "All filtered students match the selected course"
  );

  // Filter by graduation year
  const nitGrad2026 = await getCollegeProfileData("nit-calicut", {
    graduationYear: 2026,
  });
  assert(nitGrad2026.students.length > 0, "Returns students graduating in 2026");
  assert(
    nitGrad2026.students.every((s) => Number(s.graduation_year) === 2026),
    "All filtered students match graduation year 2026"
  );

  // Filter by skill
  const nitRustStudents = await getCollegeProfileData("nit-calicut", {
    skill: "Rust",
  });
  assert(nitRustStudents.students.length > 0, "Returns students with skill 'Rust'");
  assert(
    nitRustStudents.students.some((s) => s.skills.includes("Rust")),
    "Student card includes filtered skill"
  );

  // Search by student name
  const nitSearch = await getCollegeProfileData("nit-calicut", {
    query: "Sreehari",
  });
  assert(nitSearch.students.length === 1, "Finds student by query 'Sreehari'");
  assert(nitSearch.students[0].username === "sreehari", "Search matches exact student");

  console.log("\n=========================================");
  console.log("TEST SUITE 7: Campus Projects & Achievements Discovery");
  console.log("=========================================\n");

  const berkeleyData = await getCollegeProfileData("uc-berkeley");
  assert(berkeleyData.projects.length > 0, "Discovers campus projects for UC Berkeley");
  const slamProject = berkeleyData.projects.find((p) => p.title.includes("SLAM"));
  assert(slamProject !== undefined, "Finds SLAM Quadrotor project");
  assert(slamProject.author.username === "alexrivera", "Project author has correct username credit");
  assert(slamProject.author.college !== null, "Project author has college affiliation");

  assert(berkeleyData.achievements.length > 0, "Discovers campus student achievements");
  const acmFinalist = berkeleyData.achievements.find((a) => a.profile_id === "usr_alex");
  assert(acmFinalist !== undefined, "Finds student achievement for UC Berkeley");

  console.log("\n=========================================");
  console.log("TEST SUITE 8: Campus Events & Clubs Placeholders");
  console.log("=========================================\n");

  assert(nitData.events.length > 0, "NIT Calicut has curated campus events");
  assert(nitData.events[0].title.includes("Ragam Hack"), "Includes flagship campus hackathon");
  assert(nitData.events[0].category === "hackathon", "Event has category metadata");
  assert(nitData.events[0].rsvp_count > 0, "Event includes participant interest count");

  assert(nitData.clubs.length > 0, "NIT Calicut has curated student guilds");
  assert(nitData.clubs.some((c) => c.name.includes("Tinkerer")), "Includes Tinkerer's Lab & Systems Guild");
  assert(nitData.clubs.some((c) => c.name.includes("FOSS")), "Includes FOSS Cell Calicut");
  assert(nitData.clubs[0].member_count > 0, "Club includes member count");
  assert(nitData.clubs[0].lead !== undefined, "Club includes lead credit");

  console.log("\n=========================================");
  console.log("🎉 ALL PHASE 14 COLLEGE PROFILES & CAMPUS TESTS PASSED!");
  console.log("=========================================\n");
}

runPhase14Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
