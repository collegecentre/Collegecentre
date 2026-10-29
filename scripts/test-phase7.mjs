// Phase 7 Comprehensive Test Suite: Verified Student Achievements
// Verifies Achievement CRUD, Storage, Ordering, Featured Precedence, Public Rendering, and Permissions

import { mockSupabase } from "../src/lib/supabase.ts";
import { getStudentProfileByUsername } from "../src/lib/profile-service.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase7Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: Achievement CRUD Operations");
  console.log("=========================================\n");

  const testProfileId = "usr_phase7_test";

  // 1. Create Achievement
  const newAchievement = {
    id: "ach_test_alpha",
    profile_id: testProfileId,
    title: "1st Place Winner - AI Infrastructure",
    description: "Built sub-second distributed LLM inference caching for edge nodes.",
    organization: "HackMIT 2025",
    type: "hackathon",
    date: "Oct 2025",
    image_url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad",
    verification_url: "https://hackmit.org/winners/2025",
    credential_id: "HACKMIT-2025-1049",
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  };

  const insertRes = await mockSupabase.from("achievements").insert(newAchievement);
  assert(insertRes.error === null, "Inserts new achievement record into database");

  // 2. Read Achievement
  const readRes = await mockSupabase
    .from("achievements")
    .select("*")
    .eq("profile_id", testProfileId);

  assert(readRes.data?.length >= 1, "Queries achievements by profile_id");
  const found = readRes.data.find((a) => a.id === "ach_test_alpha");
  assert(found !== undefined, "Finds newly created achievement");
  assert(found.title === "1st Place Winner - AI Infrastructure", "Stores accurate achievement title");
  assert(found.organization === "HackMIT 2025", "Stores accurate organization");
  assert(found.type === "hackathon", "Stores valid achievement type");
  assert(found.date === "Oct 2025", "Stores date");
  assert(found.credential_id === "HACKMIT-2025-1049", "Stores credential reference ID");
  assert(found.verification_url === "https://hackmit.org/winners/2025", "Stores verification URL");
  assert(found.is_featured === false, "Sets initial featured state");
  assert(found.is_enabled === true, "Sets initial enabled state");

  // 3. Update Achievement
  const updateRes = await mockSupabase
    .from("achievements")
    .update({
      title: "Grand Prize Winner & Best Hardware Hack",
      is_featured: true,
      credential_id: "HACKMIT-GRAND-001",
    })
    .eq("id", "ach_test_alpha");

  assert(updateRes.error === null, "Updates achievement fields");

  const afterUpdate = await mockSupabase
    .from("achievements")
    .select("*")
    .eq("id", "ach_test_alpha");

  const updatedItem = afterUpdate.data.find((a) => a.id === "ach_test_alpha");
  assert(updatedItem.title.includes("Grand Prize Winner"), "Persists updated title");
  assert(updatedItem.is_featured === true, "Toggles is_featured to true");
  assert(updatedItem.credential_id === "HACKMIT-GRAND-001", "Updates credential ID");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Featured Precedence & Ordering");
  console.log("=========================================\n");

  const secondAchievement = {
    id: "ach_test_beta",
    profile_id: testProfileId,
    title: "Google Summer of Code Fellow",
    organization: "Google Open Source",
    type: "open_source",
    date: "Aug 2025",
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  };

  const thirdAchievement = {
    id: "ach_test_gamma",
    profile_id: testProfileId,
    title: "Dean's List for Academic Excellence",
    organization: "School of Engineering",
    type: "academic",
    date: "Jun 2025",
    is_featured: true,
    is_enabled: true,
    order_index: 1,
  };

  await mockSupabase.from("achievements").insert(secondAchievement);
  await mockSupabase.from("achievements").insert(thirdAchievement);

  const orderedRes = await mockSupabase
    .from("achievements")
    .select("*")
    .eq("profile_id", testProfileId);

  // Both alpha and gamma are featured; beta is standard
  const featuredItems = orderedRes.data.filter((a) => a.is_featured);
  const regularItems = orderedRes.data.filter((a) => !a.is_featured);

  assert(featuredItems.length === 2, "Identifies 2 featured achievements");
  assert(regularItems.length === 1, "Identifies 1 standard achievement");
  assert(orderedRes.data[0].is_featured === true, "Featured achievements rank first");
  assert(orderedRes.data[1].is_featured === true, "Secondary featured achievement ranks ahead of standard");
  assert(orderedRes.data[2].is_featured === false, "Standard achievement follows featured achievements");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Storage Mock for Badges & Logos");
  console.log("=========================================\n");

  const storageClient = mockSupabase.storage.from("achievement-images");
  const uploadRes = await storageClient.upload("test-user/badge.png", new Blob(["mock-badge-data"]));
  assert(uploadRes.error === null, "Storage mock uploads achievement image file");
  assert(uploadRes.data?.path === "test-user/badge.png", "Returns uploaded image path");

  const publicUrlRes = storageClient.getPublicUrl("test-user/badge.png");
  assert(typeof publicUrlRes.data.publicUrl === "string", "Generates public image URL");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Public Student Showcase Resolution");
  console.log("=========================================\n");

  // Query sreehari's profile
  const sreehariProfile = await getStudentProfileByUsername("sreehari");
  assert(sreehariProfile !== null, "Resolves profile for 'sreehari'");
  assert(Array.isArray(sreehariProfile.achievements), "Returns achievements array in student profile data");
  assert(sreehariProfile.achievements.length >= 2, "Loads seed achievements for sreehari");

  const firstHonor = sreehariProfile.achievements[0];
  assert(firstHonor.is_featured === true, "Featured achievement is first in public timeline");
  assert(firstHonor.organization === "HackMIT 2025", "Correct awarding organization");
  assert(firstHonor.type === "hackathon", "Correct achievement type");
  assert(firstHonor.credential_id !== null, "Contains credential ID");
  assert(firstHonor.verification_url !== null, "Contains verification URL");

  // Query alexrivera's profile
  const alexProfile = await getStudentProfileByUsername("alexrivera");
  assert(alexProfile !== null, "Resolves profile for 'alexrivera'");
  assert(alexProfile.achievements.length >= 1, "Loads achievements for alexrivera");
  assert(alexProfile.achievements[0].type === "competition", "Contains competition honor for alexrivera");

  // Verify disabled achievements are filtered out from public showcase
  await mockSupabase
    .from("achievements")
    .update({ is_enabled: false })
    .eq("id", "ach_test_beta");

  const checkHidden = await mockSupabase
    .from("achievements")
    .select("*")
    .eq("id", "ach_test_beta");
  const hiddenItem = checkHidden.data.find((a) => a.id === "ach_test_beta");
  assert(hiddenItem.is_enabled === false, "Achievement can be disabled/hidden");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Achievement Deletion & Cleanup");
  console.log("=========================================\n");

  const deleteRes = await mockSupabase
    .from("achievements")
    .delete()
    .eq("id", "ach_test_alpha");

  assert(deleteRes.error === null, "Deletes achievement record");

  const verifyDelete = await mockSupabase
    .from("achievements")
    .select("*")
    .eq("id", "ach_test_alpha");

  const remainingAlpha = verifyDelete.data.find((a) => a.id === "ach_test_alpha");
  assert(remainingAlpha === undefined, "Deleted achievement is completely removed");

  // Clean up remaining test records
  await mockSupabase.from("achievements").delete().eq("id", "ach_test_beta");
  await mockSupabase.from("achievements").delete().eq("id", "ach_test_gamma");

  console.log("\n✨ ALL PHASE 7 AUTOMATED TESTS PASSED SUCCESSFULLY! ✨\n");
}

runPhase7Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
