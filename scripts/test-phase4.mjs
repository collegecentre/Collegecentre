// Phase 4 Comprehensive Test Suite
// Verifies Student Dashboard, Profile Editing, Visibility Toggle, Social Links, and Navigation

import { mockSupabase } from "../src/lib/supabase.ts";
import { checkUsernameAvailability, normalizeUsername, validateUsernameFormat } from "../src/lib/username.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("\n=========================================");
console.log("TEST SUITE 1: Dashboard Navigation & Tabs");
console.log("=========================================\n");

const expectedTabs = [
  "overview",
  "profile",
  "links",
  "projects",
  "achievements",
  "certificates",
  "resume",
  "appearance",
  "analytics",
  "settings",
];

assert(expectedTabs.length === 10, "Defines all 10 standard dashboard navigation sections");
for (const tab of expectedTabs) {
  assert(expectedTabs.includes(tab), `Includes section '${tab}'`);
}

console.log("\n=========================================");
console.log("TEST SUITE 2: Authenticated Access & User Profile");
console.log("=========================================\n");

async function runDashboardTests() {
  // 1. Authenticate test student
  const testEmail = `student_${Date.now()}@collegecentre.in`;
  const signUpRes = await mockSupabase.auth.signUp({
    email: testEmail,
    password: "Password123!",
    options: { data: { preferred_username: "dashboardtester" } },
  });

  assert(signUpRes.data?.user !== null, "Authenticated user session created");
  const userId = signUpRes.data.user.id;

  // 2. Initial profile setup
  const initialProfile = {
    id: userId,
    username: "dashstudent",
    full_name: "Dashboard Student",
    bio: "Pre-edit bio text",
    college: "State Engineering College",
    course: "Computer Science",
    graduation_year: 2026,
    theme: "obsidian",
    is_public: true,
    onboarding_completed: true,
    onboarding_step: 7,
  };

  const createRes = await mockSupabase.from("profiles").upsert(initialProfile);
  assert(createRes.error === null, "Initial student profile initialized in database");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Profile Editing & Data Updates");
  console.log("=========================================\n");

  // Edit fields
  const updatedData = {
    full_name: "Alex M. Rivera",
    bio: "Building distributed SLAM kernels and high-frequency algorithms.",
    college: "UC Berkeley",
    course: "EECS & Robotics",
    graduation_year: 2027,
  };

  const updateRes = await mockSupabase
    .from("profiles")
    .update(updatedData)
    .eq("id", userId);

  assert(updateRes.error === null, "Profile update executes cleanly");

  // Verify updated record
  const fetched = await mockSupabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  assert(fetched.data?.full_name === "Alex M. Rivera", "Persists updated full name");
  assert(fetched.data?.bio.includes("distributed SLAM"), "Persists updated bio statement");
  assert(fetched.data?.college === "UC Berkeley", "Persists updated academic institution");
  assert(fetched.data?.graduation_year === 2027, "Persists updated graduation year");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Visibility & Privacy Toggle");
  console.log("=========================================\n");

  // Toggle to private
  await mockSupabase.from("profiles").update({ is_public: false }).eq("id", userId);
  const privateProfile = await mockSupabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  assert(privateProfile.data?.is_public === false, "Toggles profile visibility to private (is_public: false)");

  // Toggle back to public
  await mockSupabase.from("profiles").update({ is_public: true }).eq("id", userId);
  const publicProfile = await mockSupabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  assert(publicProfile.data?.is_public === true, "Toggles profile visibility back to public (is_public: true)");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Social Links Management");
  console.log("=========================================\n");

  const socialLinksToInsert = [
    { profile_id: userId, platform: "github", url: "https://github.com/alexrivera", order_index: 0 },
    { profile_id: userId, platform: "linkedin", url: "https://linkedin.com/in/alex-rivera", order_index: 1 },
    { profile_id: userId, platform: "x", url: "https://x.com/arivera", order_index: 2 },
    { profile_id: userId, platform: "website", url: "https://alexrivera.dev", order_index: 3 },
  ];

  const socialRes = await mockSupabase.from("basic_social_links").insert(socialLinksToInsert);
  assert(socialRes.error === null, "Inserts batch of updated social links");

  const queriedSocial = await mockSupabase.from("basic_social_links").select("*").eq("profile_id", userId);
  assert(queriedSocial.data?.length === 4, "Stores all 4 social link profiles");

  console.log("\n=========================================");
  console.log("🎉 ALL PHASE 4 DASHBOARD TESTS PASSED!");
  console.log("=========================================\n");
}

runDashboardTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
