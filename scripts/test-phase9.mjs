// Phase 9 Comprehensive Test Suite: Student Resume Showcase & Management
// Verifies Resume CRUD, Replace, Storage, Visibility Boundaries, and Public Profile Resolution

import { mockSupabase, DEFAULT_RESUMES } from "../src/lib/supabase.ts";
import { getStudentProfileByUsername } from "../src/lib/profile-service.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase9Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: Resume Upload & Creation");
  console.log("=========================================\n");

  const testProfileId = "usr_phase9_test";

  // 1. Create / Upload Resume
  const newResume = {
    id: "res_test_alpha",
    profile_id: testProfileId,
    file_path: "usr_phase9_test/johndoe_resume_2026.pdf",
    file_url: "https://placeholder.supabase.co/storage/v1/object/public/resumes/usr_phase9_test/johndoe_resume_2026.pdf",
    file_name: "John_Doe_Software_Engineer_CV.pdf",
    file_size: 215040, // 210 KB
    title: "Software Engineer & Cloud Systems CV",
    is_visible: true,
    uploaded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const insertRes = await mockSupabase.from("resumes").insert(newResume);
  assert(insertRes.error === null, "Inserts new resume record into database");

  // 2. Read Resume by profile_id
  const readRes = await mockSupabase
    .from("resumes")
    .select("*")
    .eq("profile_id", testProfileId)
    .single();

  assert(readRes.error === null, "Queries resume by profile_id with single()");
  assert(readRes.data?.id === "res_test_alpha", "Finds newly created resume record");
  assert(readRes.data?.file_name === "John_Doe_Software_Engineer_CV.pdf", "Stores accurate file name");
  assert(readRes.data?.file_size === 215040, "Stores accurate file size in bytes");
  assert(readRes.data?.title === "Software Engineer & Cloud Systems CV", "Stores custom display title");
  assert(readRes.data?.is_visible === true, "Defaults visibility to true");
  assert(readRes.data?.file_url.includes(".pdf"), "Stores verified PDF file URL");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Replace Resume File");
  console.log("=========================================\n");

  const replacedFilePath = "usr_phase9_test/johndoe_v2_resume.pdf";
  const replacedFileUrl = "https://placeholder.supabase.co/storage/v1/object/public/resumes/usr_phase9_test/johndoe_v2_resume.pdf";
  const replacedFileName = "John_Doe_Updated_Resume_2026.pdf";
  const replacedSize = 256000;

  const replaceRes = await mockSupabase
    .from("resumes")
    .update({
      file_path: replacedFilePath,
      file_url: replacedFileUrl,
      file_name: replacedFileName,
      file_size: replacedSize,
      updated_at: new Date().toISOString(),
    })
    .eq("profile_id", testProfileId);

  assert(replaceRes.error === null, "Executes resume file replacement update");

  const verifyReplace = await mockSupabase
    .from("resumes")
    .select("*")
    .eq("profile_id", testProfileId)
    .single();

  assert(verifyReplace.data?.file_name === replacedFileName, "Persists replaced file name");
  assert(verifyReplace.data?.file_size === replacedSize, "Persists updated file size");
  assert(verifyReplace.data?.file_path === replacedFilePath, "Persists updated storage file path");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Title Customization");
  console.log("=========================================\n");

  const updatedTitle = "Full Stack Engineer & Distributed Systems Lead";
  const updateTitleRes = await mockSupabase
    .from("resumes")
    .update({ title: updatedTitle })
    .eq("profile_id", testProfileId);

  assert(updateTitleRes.error === null, "Executes resume title update");

  const verifyTitle = await mockSupabase
    .from("resumes")
    .select("*")
    .eq("profile_id", testProfileId)
    .single();

  assert(verifyTitle.data?.title === updatedTitle, "Persists updated display title");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Visibility & Privacy Boundary");
  console.log("=========================================\n");

  // 1. Toggle visibility off
  const hideRes = await mockSupabase
    .from("resumes")
    .update({ is_visible: false })
    .eq("profile_id", testProfileId);

  assert(hideRes.error === null, "Toggles resume visibility to false");

  const verifyHidden = await mockSupabase
    .from("resumes")
    .select("*")
    .eq("profile_id", testProfileId)
    .single();

  assert(verifyHidden.data?.is_visible === false, "Resume is_visible is false in database");

  // 2. Toggle visibility on
  await mockSupabase
    .from("resumes")
    .update({ is_visible: true })
    .eq("profile_id", testProfileId);

  const verifyVisible = await mockSupabase
    .from("resumes")
    .select("*")
    .eq("profile_id", testProfileId)
    .single();

  assert(verifyVisible.data?.is_visible === true, "Resume is_visible restored to true");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Supabase Storage Mock");
  console.log("=========================================\n");

  const storageUpload = await mockSupabase.storage
    .from("resumes")
    .upload("usr_phase9_test/resume_upload_test.pdf", { sample: "binary" });

  assert(storageUpload.error === null, "Storage mock uploads resume PDF successfully");
  assert(storageUpload.data?.path.includes("resume_upload_test.pdf"), "Returns valid storage file path");

  const storageUrl = mockSupabase.storage
    .from("resumes")
    .getPublicUrl("usr_phase9_test/resume_upload_test.pdf");

  assert(storageUrl.data?.publicUrl.includes("usr_phase9_test"), "Generates valid public URL for resume");

  console.log("\n=========================================");
  console.log("TEST SUITE 6: Public Profile Showcase Resolution");
  console.log("=========================================\n");

  // 1. Public user 'sreehari' should return populated resume
  const sreehariProfile = await getStudentProfileByUsername("sreehari");
  assert(sreehariProfile !== null, "Resolves profile data for 'sreehari'");
  assert("resume" in sreehariProfile, "Includes 'resume' property in StudentProfileData");
  assert(sreehariProfile.resume !== null, "Loads seed resume for sreehari");
  assert(sreehariProfile.resume?.file_name.includes(".pdf"), "Resume has valid PDF file name");
  assert(sreehariProfile.resume?.file_size > 0, "Resume has valid file size");
  assert(sreehariProfile.resume?.is_visible === true, "Resume visibility is true");

  // 2. Public user 'alexrivera' should return populated resume
  const alexProfile = await getStudentProfileByUsername("alexrivera");
  assert(alexProfile !== null, "Resolves profile data for 'alexrivera'");
  assert(alexProfile.resume !== null, "Loads seed resume for alexrivera");
  assert(alexProfile.resume?.title.includes("Robotics"), "Alex's resume title matches domain");

  // 3. User with hidden resume should NOT expose resume on public profile
  await mockSupabase
    .from("resumes")
    .update({ is_visible: false })
    .eq("profile_id", "usr_alex");

  const alexHidden = await getStudentProfileByUsername("alexrivera");
  assert(alexHidden.resume === null, "Public profile returns null for resume when is_visible is false");

  // Restore alex's visibility
  await mockSupabase
    .from("resumes")
    .update({ is_visible: true })
    .eq("profile_id", "usr_alex");

  // 4. Private profile should NEVER expose resume
  const testPrivateProfile = {
    id: "usr_private_resume_test",
    username: "privatestudent",
    full_name: "Private Student",
    theme: "obsidian",
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await mockSupabase.from("profiles").insert(testPrivateProfile);
  await mockSupabase.from("resumes").insert({
    id: "res_priv",
    profile_id: "usr_private_resume_test",
    file_path: "usr_private_resume_test/doc.pdf",
    file_url: "https://example.com/doc.pdf",
    file_name: "Secret.pdf",
    file_size: 100000,
    is_visible: true,
  });

  const privateResolved = await getStudentProfileByUsername("privatestudent");
  assert(privateResolved !== null, "Resolves private student data container");
  assert(privateResolved.resume === null, "Private profile strictly returns null for resume to protect privacy");

  console.log("\n=========================================");
  console.log("TEST SUITE 7: Resume Deletion & State Cleanup");
  console.log("=========================================\n");

  const deleteRes = await mockSupabase
    .from("resumes")
    .delete()
    .eq("profile_id", testProfileId);

  assert(deleteRes.error === null, "Executes resume deletion");

  const verifyDelete = await mockSupabase
    .from("resumes")
    .select("*")
    .eq("profile_id", testProfileId)
    .maybeSingle();

  assert(verifyDelete.data === null, "Deleted resume is no longer returned in database");

  console.log("\n✨ ALL PHASE 9 AUTOMATED TESTS PASSED SUCCESSFULLY! ✨\n");
}

runPhase9Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
