// Phase 3 Comprehensive Test Suite
// Verifies Public Profile fetching, Theme Foundation, Privacy, 404s, and SEO Metadata

import { getStudentProfileByUsername } from "../src/lib/profile-service.ts";
import { getProfileTheme, getAllProfileThemes } from "../src/lib/themes.ts";
import { generateMetadata } from "../src/app/[username]/page.tsx";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log("\n=========================================");
console.log("TEST SUITE 1: Profile Themes Architecture");
console.log("=========================================\n");

const themes = getAllProfileThemes();
assert(themes.length >= 4, `Supports standard profile themes (found ${themes.length})`);

const themeIds = ["obsidian", "academic", "cobalt", "terminal"];
for (const id of themeIds) {
  const conf = getProfileTheme(id);
  assert(conf.id === id, `Theme '${id}' configuration loads correctly`);
  assert(Boolean(conf.fontFamily), `Theme '${id}' specifies typography font family (${conf.fontFamily})`);
  assert(Boolean(conf.containerClass), `Theme '${id}' specifies container styling`);
  assert(Boolean(conf.linkCard), `Theme '${id}' specifies link card styling`);
}

// Fallback test
const unknownTheme = getProfileTheme("future-neon-theme");
assert(unknownTheme.id === "obsidian", "Gracefully falls back to 'obsidian' theme for unknown/future theme IDs");

console.log("\n=========================================");
console.log("TEST SUITE 2: Multi-Username Profile Resolution");
console.log("=========================================\n");

async function runProfileTests() {
  // Test 1: Sreehari Profile
  const sreehariData = await getStudentProfileByUsername("sreehari");
  assert(sreehariData !== null, "Loads profile data for 'sreehari'");
  assert(sreehariData.profile.username === "sreehari", "Resolves correct username");
  assert(sreehariData.profile.full_name === "Sreehari Nair", "Resolves full name");
  assert(sreehariData.profile.is_public === true, "Marks profile as public");
  assert(sreehariData.profile.theme === "obsidian", "Sets obsidian theme");
  assert(sreehariData.socialLinks.length >= 4, `Resolves social links (count: ${sreehariData.socialLinks.length})`);
  assert(sreehariData.studentLinks.length >= 3, `Resolves configured showcase links (count: ${sreehariData.studentLinks.length})`);

  // Test 2: Case-insensitivity
  const mixedCaseData = await getStudentProfileByUsername("SreeHari");
  assert(mixedCaseData !== null && mixedCaseData.profile.username === "sreehari", "Resolves username case-insensitively ('SreeHari' -> 'sreehari')");

  // Test 3: Alex Rivera Profile (Cobalt Theme)
  const alexData = await getStudentProfileByUsername("alexrivera");
  assert(alexData !== null, "Loads profile for 'alexrivera'");
  assert(alexData.profile.theme === "cobalt", "Resolves cobalt theme for Alex Rivera");
  assert(alexData.profile.college === "UC Berkeley", "Resolves academic institution");

  // Test 4: Priya Sharma Profile (Academic Theme)
  const priyaData = await getStudentProfileByUsername("priyasharma");
  assert(priyaData !== null, "Loads profile for 'priyasharma'");
  assert(priyaData.profile.theme === "academic", "Resolves academic theme for Priya Sharma");

  // Test 5: Kavya Patel Profile (Terminal Theme)
  const kavyaData = await getStudentProfileByUsername("kavyapatel");
  assert(kavyaData !== null, "Loads profile for 'kavyapatel'");
  assert(kavyaData.profile.theme === "terminal", "Resolves terminal theme for Kavya Patel");

  // Test 6: Private Profile State
  const privateData = await getStudentProfileByUsername("privateuser");
  assert(privateData !== null, "Loads profile for 'privateuser'");
  assert(privateData.profile.is_public === false, "Correctly identifies private profile flag (is_public: false)");

  // Test 7: Nonexistent Username -> 404
  const nonexistent = await getStudentProfileByUsername("nonexistent_unknown_student_999");
  assert(nonexistent === null, "Returns null for nonexistent username (triggers Next.js notFound)");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Dynamic SEO & Open Graph Metadata");
  console.log("=========================================\n");

  const sreehariMeta = await generateMetadata({ params: Promise.resolve({ username: "sreehari" }) });
  assert(typeof sreehariMeta.title === "string" && sreehariMeta.title.includes("Sreehari Nair"), "Generates dynamic page title containing student name");
  assert(sreehariMeta.title.includes("CollegeCentre"), "Page title includes CollegeCentre branding");
  assert(typeof sreehariMeta.description === "string" && sreehariMeta.description.length > 10, "Generates descriptive student meta description");
  assert(sreehariMeta.alternates?.canonical === "https://collegecentre.in/sreehari", "Sets correct canonical URL (https://collegecentre.in/sreehari)");
  assert(sreehariMeta.openGraph?.type === "profile", "Sets OpenGraph type to 'profile'");
  assert(sreehariMeta.openGraph?.url === "https://collegecentre.in/sreehari", "Sets OpenGraph URL tag");

  // Nonexistent metadata fallback
  const nonexistentMeta = await generateMetadata({ params: Promise.resolve({ username: "ghost_user" }) });
  assert(typeof nonexistentMeta.title === "string" && nonexistentMeta.title.includes("Not Found"), "Generates 'Student Not Found' title for missing handles");

  console.log("\n=========================================");
  console.log("🎉 ALL PHASE 3 PROFILE TESTS PASSED!");
  console.log("=========================================\n");
}

runProfileTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
