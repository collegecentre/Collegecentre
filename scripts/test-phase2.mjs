// Phase 2 Comprehensive Test Suite
// Verifies Username System, Authentication Flow, and Profile/Onboarding Persistence

import { normalizeUsername, validateUsernameFormat } from "../src/lib/username.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("\n=========================================");
console.log("TEST SUITE 1: Username Validation & Rules");
console.log("=========================================\n");

// 1. Normalization
assert(normalizeUsername("  SreeHari_99  ") === "sreehari_99", "Normalizes casing and trims whitespace");

// 2. Reserved usernames
const testReserved = ["admin", "login", "signup", "dashboard", "collegecentre", "api", "auth", "null"];
for (const res of testReserved) {
  const result = validateUsernameFormat(res);
  assert(!result.valid && result.error?.includes("reserved"), `Blocks reserved handle: '${res}'`);
}

// 3. Length checks
const tooShort = validateUsernameFormat("ab");
assert(!tooShort.valid && tooShort.error?.includes("at least 3"), "Rejects username shorter than 3 characters");

const tooLong = validateUsernameFormat("a".repeat(31));
assert(!tooLong.valid && tooLong.error?.includes("30 characters"), "Rejects username longer than 30 characters");

// 4. Allowed and boundary characters
const invalidStart = validateUsernameFormat("-sreehari");
assert(!invalidStart.valid && invalidStart.error?.includes("start or end"), "Rejects leading hyphens/underscores");

const invalidEnd = validateUsernameFormat("sreehari-");
assert(!invalidEnd.valid && invalidEnd.error?.includes("start or end"), "Rejects trailing hyphens/underscores");

const invalidChar = validateUsernameFormat("sree@hari");
assert(!invalidChar.valid && invalidChar.error?.includes("can only contain"), "Rejects special characters like @");

const validHandles = ["sreehari", "john-doe", "sarah_99", "dev-k-2026", "alex123"];
for (const handle of validHandles) {
  const check = validateUsernameFormat(handle);
  assert(check.valid === true, `Accepts valid student handle: '${handle}'`);
}

console.log("\n=========================================");
console.log("TEST SUITE 2: In-Memory / Local Auth & Profiles");
console.log("=========================================\n");

// Test Mock Supabase Store behavior
import { mockSupabase } from "../src/lib/supabase.ts";

async function runAuthTests() {
  // Test SignUp
  const testEmail = `student_${Date.now()}@collegecentre.in`;
  const signUpRes = await mockSupabase.auth.signUp({
    email: testEmail,
    password: "Password123!",
    options: { data: { preferred_username: "teststudent" } }
  });

  assert(signUpRes.data?.user !== null, "SignUp creates new user");
  assert(signUpRes.data?.user?.email === testEmail, "SignUp sets correct user email");
  assert(signUpRes.data?.session !== null, "SignUp establishes active session");

  const userId = signUpRes.data.user.id;

  // Test SignOut
  await mockSupabase.auth.signOut();
  const sessionAfterSignOut = await mockSupabase.auth.getSession();
  assert(sessionAfterSignOut.data.session === null, "SignOut clears session cleanly");

  // Test SignIn with Password
  const signInRes = await mockSupabase.auth.signInWithPassword({
    email: testEmail,
    password: "Password123!"
  });
  assert(signInRes.data?.user?.id === userId, "SignIn with password recovers user identity");

  // Test Google OAuth simulation
  const googleRes = await mockSupabase.auth.signInWithOAuth({
    provider: "google"
  });
  assert(googleRes.data?.url === "/onboarding", "Google OAuth returns redirect url to /onboarding");
  const googleSession = await mockSupabase.auth.getSession();
  assert(googleSession.data.session?.user?.user_metadata?.full_name !== undefined, "Google OAuth sets student profile metadata");

  // Test Profile Creation & Upsert
  const profileData = {
    id: userId,
    username: "sreeharitest",
    full_name: "Sreehari Nair",
    bio: "CS Undergrad building CollegeCentre",
    college: "National Institute of Technology",
    course: "Computer Science and Engineering",
    graduation_year: 2026,
    theme: "obsidian",
    onboarding_completed: true,
    onboarding_step: 7
  };

  const insertProfileRes = await mockSupabase.from("profiles").upsert(profileData);
  assert(insertProfileRes.error === null, "Profile upsert succeeds without errors");

  // Test Social Links Insertion
  const socialLinksData = [
    { profile_id: userId, platform: "github", url: "https://github.com/sreehari", order_index: 0 },
    { profile_id: userId, platform: "linkedin", url: "https://linkedin.com/in/sreehari", order_index: 1 }
  ];
  const insertLinksRes = await mockSupabase.from("basic_social_links").insert(socialLinksData);
  assert(insertLinksRes.error === null, "Social links insert succeeds");

  // Query Profile
  const queriedProfile = await mockSupabase.from("profiles").select("*").eq("username", "sreeharitest").maybeSingle();
  assert(queriedProfile.data?.username === "sreeharitest", "Profiles table can query by unique username");
  assert(queriedProfile.data?.onboarding_completed === true, "Profiles table retains onboarding_completed: true");

  console.log("\n=========================================");
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
  console.log("=========================================\n");
}

runAuthTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
