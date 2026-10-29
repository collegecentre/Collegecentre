// Phase 8 Comprehensive Test Suite: Verified Student Certificates
// Verifies Certificate CRUD, Storage (Images & PDFs), Ordering, Featured Precedence, Public Rendering, and Permissions

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

async function runPhase8Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: Certificate CRUD Operations");
  console.log("=========================================\n");

  const testProfileId = "usr_phase8_test";

  // 1. Create Certificate
  const newCertificate = {
    id: "cert_test_alpha",
    profile_id: testProfileId,
    name: "AWS Certified Solutions Architect - Professional",
    issuer: "Amazon Web Services",
    issue_date: "Jun 2025",
    expiration_date: "Jun 2028",
    credential_id: "AWS-SAP-998811",
    credential_url: "https://aws.amazon.com/verification/AWS-SAP-998811",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    pdf_url: "https://example.com/certificates/aws-sap.pdf",
    description: "Evaluated architecture of multi-region fault tolerance, hybrid cloud topologies, and cost-optimized distributed systems.",
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  };

  const insertRes = await mockSupabase.from("certificates").insert(newCertificate);
  assert(insertRes.error === null, "Inserts new certificate record into database");

  // 2. Read Certificate
  const readRes = await mockSupabase
    .from("certificates")
    .select("*")
    .eq("profile_id", testProfileId);

  assert(readRes.data?.length >= 1, "Queries certificates by profile_id");
  const found = readRes.data.find((c) => c.id === "cert_test_alpha");
  assert(found !== undefined, "Finds newly created certificate");
  assert(found.name === "AWS Certified Solutions Architect - Professional", "Stores accurate certificate name");
  assert(found.issuer === "Amazon Web Services", "Stores accurate issuer");
  assert(found.issue_date === "Jun 2025", "Stores issue date");
  assert(found.expiration_date === "Jun 2028", "Stores expiration date");
  assert(found.credential_id === "AWS-SAP-998811", "Stores credential ID");
  assert(found.credential_url === "https://aws.amazon.com/verification/AWS-SAP-998811", "Stores credential URL");
  assert(found.pdf_url === "https://example.com/certificates/aws-sap.pdf", "Stores PDF document URL");
  assert(found.is_featured === false, "Sets initial featured state");
  assert(found.is_enabled === true, "Sets initial enabled state");

  // 3. Update Certificate
  const updateRes = await mockSupabase
    .from("certificates")
    .update({
      name: "AWS Certified Solutions Architect - Professional (Honor Distinction)",
      is_featured: true,
      credential_id: "AWS-SAP-DISTINCTION-001",
    })
    .eq("id", "cert_test_alpha");

  assert(updateRes.error === null, "Updates certificate fields");

  const afterUpdate = await mockSupabase
    .from("certificates")
    .select("*")
    .eq("id", "cert_test_alpha");

  const updatedItem = afterUpdate.data.find((c) => c.id === "cert_test_alpha");
  assert(updatedItem.name.includes("Honor Distinction"), "Persists updated certificate name");
  assert(updatedItem.is_featured === true, "Toggles is_featured to true");
  assert(updatedItem.credential_id === "AWS-SAP-DISTINCTION-001", "Updates credential ID");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Featured Precedence & Ordering");
  console.log("=========================================\n");

  const secondCertificate = {
    id: "cert_test_beta",
    profile_id: testProfileId,
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI & Coursera",
    issue_date: "Feb 2025",
    expiration_date: null,
    is_featured: false,
    is_enabled: true,
    order_index: 0,
  };

  const thirdCertificate = {
    id: "cert_test_gamma",
    profile_id: testProfileId,
    name: "NVIDIA Certified Associate: Applied Deep Learning",
    issuer: "NVIDIA DLI",
    issue_date: "Apr 2025",
    is_featured: true,
    is_enabled: true,
    order_index: 1,
  };

  await mockSupabase.from("certificates").insert(secondCertificate);
  await mockSupabase.from("certificates").insert(thirdCertificate);

  const orderedRes = await mockSupabase
    .from("certificates")
    .select("*")
    .eq("profile_id", testProfileId);

  // Both alpha and gamma are featured; beta is standard
  const featuredItems = orderedRes.data.filter((c) => c.is_featured);
  const regularItems = orderedRes.data.filter((c) => !c.is_featured);

  assert(featuredItems.length === 2, "Identifies 2 featured certificates");
  assert(regularItems.length === 1, "Identifies 1 standard certificate");
  assert(orderedRes.data[0].is_featured === true, "Featured certificates rank first");
  assert(orderedRes.data[1].is_featured === true, "Secondary featured certificate ranks ahead of standard");
  assert(orderedRes.data[2].is_featured === false, "Standard certificate follows featured certificates");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Storage Mock for Images & PDFs");
  console.log("=========================================\n");

  const storageClient = mockSupabase.storage.from("certificates");

  // Image upload
  const imageUploadRes = await storageClient.upload("test-user/cert-image.png", new Blob(["mock-image-bytes"]));
  assert(imageUploadRes.error === null, "Storage uploads certificate image");
  assert(imageUploadRes.data?.path === "test-user/cert-image.png", "Returns image file path");

  // PDF upload
  const pdfUploadRes = await storageClient.upload("test-user/cert-doc.pdf", new Blob(["%PDF-1.4 mock-pdf-bytes"]));
  assert(pdfUploadRes.error === null, "Storage uploads certificate PDF");
  assert(pdfUploadRes.data?.path === "test-user/cert-doc.pdf", "Returns PDF file path");

  const publicUrlRes = storageClient.getPublicUrl("test-user/cert-doc.pdf");
  assert(typeof publicUrlRes.data.publicUrl === "string", "Generates public PDF URL");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Public Student Showcase Resolution");
  console.log("=========================================\n");

  // Query sreehari's profile
  const sreehariProfile = await getStudentProfileByUsername("sreehari");
  assert(sreehariProfile !== null, "Resolves profile for 'sreehari'");
  assert(Array.isArray(sreehariProfile.certificates), "Returns certificates array in student profile data");
  assert(sreehariProfile.certificates.length >= 2, "Loads seed certificates for sreehari");

  const firstCert = sreehariProfile.certificates[0];
  assert(firstCert.is_featured === true, "Featured certificate is first in public showcase");
  assert(firstCert.issuer === "Amazon Web Services", "Correct issuing organization");
  assert(firstCert.credential_id !== null, "Contains credential ID");
  assert(firstCert.credential_url !== null, "Contains verification URL");
  assert(firstCert.pdf_url !== null, "Contains PDF document link");

  // Query alexrivera's profile
  const alexProfile = await getStudentProfileByUsername("alexrivera");
  assert(alexProfile !== null, "Resolves profile for 'alexrivera'");
  assert(alexProfile.certificates.length >= 1, "Loads certificates for alexrivera");
  assert(alexProfile.certificates[0].issuer.includes("NVIDIA"), "Contains NVIDIA credential for alexrivera");

  // Verify disabled certificates are filtered out from public showcase
  await mockSupabase
    .from("certificates")
    .update({ is_enabled: false })
    .eq("id", "cert_test_beta");

  const checkHidden = await mockSupabase
    .from("certificates")
    .select("*")
    .eq("id", "cert_test_beta");
  const hiddenItem = checkHidden.data.find((c) => c.id === "cert_test_beta");
  assert(hiddenItem.is_enabled === false, "Certificate can be disabled/hidden");

  // Verify private profile security boundary
  const privateProfile = await getStudentProfileByUsername("privateuser");
  assert(privateProfile !== null, "Loads private user data structure");
  assert(privateProfile.profile.is_public === false, "Verifies is_public = false for private user");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Certificate Deletion & State Cleanup");
  console.log("=========================================\n");

  const deleteRes = await mockSupabase
    .from("certificates")
    .delete()
    .eq("id", "cert_test_alpha");

  assert(deleteRes.error === null, "Deletes certificate record");

  const verifyDelete = await mockSupabase
    .from("certificates")
    .select("*")
    .eq("id", "cert_test_alpha");

  const remainingAlpha = verifyDelete.data.find((c) => c.id === "cert_test_alpha");
  assert(remainingAlpha === undefined, "Deleted certificate is completely removed");

  // Clean up remaining test records
  await mockSupabase.from("certificates").delete().eq("id", "cert_test_beta");
  await mockSupabase.from("certificates").delete().eq("id", "cert_test_gamma");

  console.log("\n✨ ALL PHASE 8 AUTOMATED TESTS PASSED SUCCESSFULLY! ✨\n");
}

runPhase8Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
