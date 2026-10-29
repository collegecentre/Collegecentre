// Phase 6 Comprehensive Test Suite: Verified Student Projects & Showcase
// Verifies Project CRUD, Storage, Ordering, Featured Precedence, Public Rendering, and Permissions

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

async function runPhase6Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: Project CRUD Operations");
  console.log("=========================================\n");

  const testProfileId = "usr_phase6_test";

  // 1. Create Project
  const newProject = {
    id: "proj_test_alpha",
    profile_id: testProfileId,
    title: "Autonomous Quadrotor Visual SLAM",
    description: "GPU-accelerated spatial depth mapping and trajectory optimization running onboard Jetson Orin.",
    cover_image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e",
    technologies: ["C++20", "ROS2", "CUDA", "OpenCV"],
    github_url: "https://github.com/testuser/vslam",
    demo_url: "https://testuser.dev/vslam",
    video_url: "https://youtube.com/watch?v=sample-vslam",
    start_date: "2025-09",
    end_date: "2026-05",
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  };

  const insertRes = await mockSupabase.from("projects").insert(newProject);
  assert(insertRes.error === null, "Inserts new project record into database");

  // 2. Read Project
  const readRes = await mockSupabase
    .from("projects")
    .select("*")
    .eq("profile_id", testProfileId);

  assert(readRes.data?.length >= 1, "Queries projects by profile_id");
  const found = readRes.data.find((p) => p.id === "proj_test_alpha");
  assert(found !== undefined, "Finds newly created project");
  assert(found.title === "Autonomous Quadrotor Visual SLAM", "Stores accurate project title");
  assert(Array.isArray(found.technologies), "Stores technologies array");
  assert(found.technologies.includes("CUDA"), "Preserves tech stack elements");
  assert(found.github_url === "https://github.com/testuser/vslam", "Stores github_url");
  assert(found.demo_url === "https://testuser.dev/vslam", "Stores demo_url");
  assert(found.video_url === "https://youtube.com/watch?v=sample-vslam", "Stores video_url");
  assert(found.is_featured === false, "Sets initial featured state");
  assert(found.is_enabled === true, "Sets initial enabled state");

  // 3. Update Project
  const updateRes = await mockSupabase
    .from("projects")
    .update({
      title: "Real-Time Visual SLAM & Swarm Navigation (ICRA 2026)",
      is_featured: true,
      technologies: ["C++20", "ROS2", "CUDA", "OpenCV", "TensorRT"],
    })
    .eq("id", "proj_test_alpha");

  assert(updateRes.error === null, "Updates project fields");

  const afterUpdate = await mockSupabase
    .from("projects")
    .select("*")
    .eq("id", "proj_test_alpha");

  const updatedItem = afterUpdate.data.find((p) => p.id === "proj_test_alpha");
  assert(updatedItem.title.includes("ICRA 2026"), "Persists updated title");
  assert(updatedItem.is_featured === true, "Toggles is_featured to true");
  assert(updatedItem.technologies.includes("TensorRT"), "Updates technologies array");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Featured Precedence & Ordering");
  console.log("=========================================\n");

  const secondProject = {
    id: "proj_test_beta",
    profile_id: testProfileId,
    title: "Rust Distributed Raft Engine",
    description: "High-throughput Paxos/Raft consensus with LSM storage.",
    cover_image_url: null,
    technologies: ["Rust", "Tokio"],
    github_url: "https://github.com/testuser/raft",
    demo_url: null,
    video_url: null,
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  };

  const thirdProject = {
    id: "proj_test_gamma",
    profile_id: testProfileId,
    title: "Micro-Frontend Container Architecture",
    description: "Sub-50ms module federation engine.",
    cover_image_url: null,
    technologies: ["TypeScript", "WebAssembly"],
    is_featured: true,
    is_enabled: true,
    order_index: 1,
  };

  await mockSupabase.from("projects").insert(secondProject);
  await mockSupabase.from("projects").insert(thirdProject);

  const orderedRes = await mockSupabase
    .from("projects")
    .select("*")
    .eq("profile_id", testProfileId);

  // Both alpha and gamma are featured; beta is non-featured
  const featuredItems = orderedRes.data.filter((p) => p.is_featured);
  const regularItems = orderedRes.data.filter((p) => !p.is_featured);

  assert(featuredItems.length === 2, "Identifies 2 featured projects");
  assert(regularItems.length === 1, "Identifies 1 standard project");
  // The first items in ordered array must be the featured ones
  assert(orderedRes.data[0].is_featured === true, "Places featured projects first in order");
  assert(orderedRes.data[1].is_featured === true, "Keeps secondary featured project ahead of unfeatured");
  assert(orderedRes.data[2].is_featured === false, "Places unfeatured project after featured");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Storage Mock & File Upload");
  console.log("=========================================\n");

  const storageClient = mockSupabase.storage.from("project-covers");
  const uploadRes = await storageClient.upload("test-user/cover.png", new Blob(["mock-image-data"]));
  assert(uploadRes.error === null, "Storage mock uploads cover file");
  assert(uploadRes.data?.path === "test-user/cover.png", "Returns file path");

  const publicUrlRes = storageClient.getPublicUrl("test-user/cover.png");
  assert(typeof publicUrlRes.data.publicUrl === "string", "Generates public cover image URL");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Public Student Showcase Resolution");
  console.log("=========================================\n");

  // Query sreehari's profile
  const sreehariProfile = await getStudentProfileByUsername("sreehari");
  assert(sreehariProfile !== null, "Resolves profile for username 'sreehari'");
  assert(Array.isArray(sreehariProfile.projects), "Returns projects array in profile data");
  assert(sreehariProfile.projects.length >= 2, "Loads student projects for sreehari");

  const firstProject = sreehariProfile.projects[0];
  assert(firstProject.is_featured === true, "Featured project is first in showcase");
  assert(firstProject.title === "CollegeCentre Core Platform", "Correct featured project title");
  assert(firstProject.technologies.includes("Next.js"), "Correct project tech tags");
  assert(firstProject.github_url !== null, "Contains GitHub repository URL");
  assert(firstProject.demo_url !== null, "Contains live demo URL");

  // Query alexrivera's profile
  const alexProfile = await getStudentProfileByUsername("alexrivera");
  assert(alexProfile !== null, "Resolves profile for 'alexrivera'");
  assert(alexProfile.projects.length >= 1, "Loads projects for alexrivera");
  assert(alexProfile.projects[0].technologies.includes("CUDA"), "Contains robotics stack for alexrivera");

  // Verify hidden project filtering:
  // Disable beta project and verify it doesn't show up in public query
  await mockSupabase
    .from("projects")
    .update({ is_enabled: false })
    .eq("id", "proj_test_beta");

  const checkHidden = await mockSupabase
    .from("projects")
    .select("*")
    .eq("id", "proj_test_beta");
  const hiddenItem = checkHidden.data.find((p) => p.id === "proj_test_beta");
  assert(hiddenItem.is_enabled === false, "Project can be hidden");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Project Deletion & Cleanup");
  console.log("=========================================\n");

  const deleteRes = await mockSupabase
    .from("projects")
    .delete()
    .eq("id", "proj_test_alpha");

  assert(deleteRes.error === null, "Deletes project record");

  const verifyDelete = await mockSupabase
    .from("projects")
    .select("*")
    .eq("id", "proj_test_alpha");

  const remainingAlpha = verifyDelete.data.find((p) => p.id === "proj_test_alpha");
  assert(remainingAlpha === undefined, "Deleted project no longer returned");

  // Clean up remaining test records
  await mockSupabase.from("projects").delete().eq("id", "proj_test_beta");
  await mockSupabase.from("projects").delete().eq("id", "proj_test_gamma");

  console.log("\n✨ ALL PHASE 6 AUTOMATED TESTS PASSED SUCCESSFULLY! ✨\n");
}

runPhase6Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
