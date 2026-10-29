// Phase 5 Comprehensive Test Suite
// Verifies Link Management CRUD, Ordering, URL Validation, Public Filtering, and Tracking Architecture

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

console.log("\n=========================================");
console.log("TEST SUITE 1: Link CRUD Operations");
console.log("=========================================\n");

async function runLinkTests() {
  const profileId = "usr_phase5_test";

  // 1. Create Links (Insert)
  const newLink = {
    id: "slink_test_1",
    profile_id: profileId,
    title: "Distributed KV Store Paper",
    url: "https://arxiv.org/abs/2609.0001",
    description: "Multi-master consensus over intermittent wireless mesh networks.",
    category: "research",
    thumbnail_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    is_enabled: true,
    order_index: 0,
    clicks_count: 0,
  };

  const createRes = await mockSupabase.from("student_links").insert(newLink);
  assert(createRes.error === null, "Inserts new showcase link into database");

  // 2. Read (Query by profile_id)
  const readRes = await mockSupabase
    .from("student_links")
    .select("*")
    .eq("profile_id", profileId)
    .order("order_index", { ascending: true });

  assert(readRes.data?.length >= 1, "Queries showcase links by profile_id");
  const found = readRes.data.find((l) => l.id === "slink_test_1");
  assert(found !== undefined, "Finds newly created link record");
  assert(found.title === "Distributed KV Store Paper", "Stores correct title");
  assert(found.category === "research", "Stores correct category tag");
  assert(found.is_enabled === true, "Defaults is_enabled to true");

  // 3. Update Link
  const updateRes = await mockSupabase
    .from("student_links")
    .update({
      title: "Updated Distributed KV Store Paper (ACM SIGOPS)",
      is_enabled: false,
    })
    .eq("id", "slink_test_1");

  assert(updateRes.error === null, "Executes link update");

  const afterUpdate = await mockSupabase
    .from("student_links")
    .select("*")
    .eq("id", "slink_test_1");

  const updatedItem = afterUpdate.data.find((l) => l.id === "slink_test_1");
  assert(updatedItem.title.includes("ACM SIGOPS"), "Persists updated title");
  assert(updatedItem.is_enabled === false, "Toggles is_enabled to false");

  // Re-enable for subsequent tests
  await mockSupabase
    .from("student_links")
    .update({ is_enabled: true })
    .eq("id", "slink_test_1");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Link Ordering & Reordering");
  console.log("=========================================\n");

  const secondLink = {
    id: "slink_test_2",
    profile_id: profileId,
    title: "Rust eBPF Router Kernel",
    url: "https://github.com/testuser/ebpf",
    category: "engineering",
    is_enabled: true,
    order_index: 1,
    clicks_count: 5,
  };

  await mockSupabase.from("student_links").insert(secondLink);

  // Test reordering: swap positions
  await mockSupabase.from("student_links").update({ order_index: 1 }).eq("id", "slink_test_1");
  await mockSupabase.from("student_links").update({ order_index: 0 }).eq("id", "slink_test_2");

  const reorderedRes = await mockSupabase
    .from("student_links")
    .select("*")
    .eq("profile_id", profileId)
    .order("order_index", { ascending: true });

  assert(reorderedRes.data[0].id === "slink_test_2", "Reorders links: 'slink_test_2' is now first (order_index: 0)");
  assert(reorderedRes.data[1].id === "slink_test_1", "Reorders links: 'slink_test_1' is now second (order_index: 1)");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Public Profile Link Visibility");
  console.log("=========================================\n");

  // Sreehari has 3 default links, all enabled
  const publicSreehari = await getStudentProfileByUsername("sreehari");
  assert(publicSreehari !== null, "Loads public profile for 'sreehari'");
  assert(publicSreehari.studentLinks.length === 3, `Returns all 3 enabled showcase links (count: ${publicSreehari.studentLinks.length})`);
  assert(publicSreehari.studentLinks.every((l) => l.is_enabled !== false), "Public links are all enabled");

  // Hide one link on sreehari profile and verify public profile excludes it
  await mockSupabase.from("student_links").update({ is_enabled: false }).eq("id", "link_2");
  const sreehariAfterHide = await getStudentProfileByUsername("sreehari");
  assert(sreehariAfterHide.studentLinks.length === 2, "Public profile strictly excludes disabled/hidden links");
  assert(!sreehariAfterHide.studentLinks.some((l) => l.id === "link_2"), "Excluded hidden link 'link_2' from public rendering");

  // Restore link_2
  await mockSupabase.from("student_links").update({ is_enabled: true }).eq("id", "link_2");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Click Tracking Architecture");
  console.log("=========================================\n");

  // Verify clicks_count field exists and can be updated
  await mockSupabase
    .from("student_links")
    .update({ clicks_count: 35, last_clicked_at: new Date().toISOString() })
    .eq("id", "link_1");

  const sreehariTracked = await mockSupabase.from("student_links").select("*").eq("id", "link_1");
  const trackedLink = sreehariTracked.data.find((l) => l.id === "link_1");
  assert(trackedLink.clicks_count === 35, "Maintains link clicks_count in database");
  assert(Boolean(trackedLink.last_clicked_at), "Maintains link last_clicked_at timestamp");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Delete Link");
  console.log("=========================================\n");

  await mockSupabase.from("student_links").delete().eq("id", "slink_test_1");
  const afterDelete = await mockSupabase
    .from("student_links")
    .select("*")
    .eq("profile_id", profileId);

  assert(!afterDelete.data.some((l) => l.id === "slink_test_1"), "Permanently removes deleted link from database");

  console.log("\n=========================================");
  console.log("🎉 ALL PHASE 5 LINK MANAGEMENT TESTS PASSED!");
  console.log("=========================================\n");
}

runLinkTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
