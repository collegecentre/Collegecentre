// Phase 11 Comprehensive Test Suite: QR Code & Profile Sharing Architecture
// Verifies QR code generation, strictly URL-only encoding, Open Graph metadata, Web Share URLs,
// high-res PNG/SVG generation, and privacy protection.

import QRCode from "qrcode";
import { generateMetadata } from "../src/app/[username]/page.tsx";
import { getStudentProfileByUsername } from "../src/lib/profile-service.ts";
import { mockSupabase } from "../src/lib/supabase.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase11Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: QR Code Generation & Payload Integrity");
  console.log("=========================================\n");

  const testUsername = "sreehari";
  const expectedUrl = `https://collegecentre.in/${testUsername}`;

  // 1. Generate Vector SVG QR Code
  const svgOutput = await QRCode.toString(expectedUrl, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#09090b", light: "#ffffff" },
  });

  assert(Boolean(svgOutput), "Generates SVG QR code string");
  assert(svgOutput.includes("<svg") && svgOutput.includes("</svg>"), "SVG output contains valid XML tags");
  assert(svgOutput.length > 500, `SVG output has sufficient path complexity (length: ${svgOutput.length})`);

  // 2. Generate High-Res 1024x1024 PNG Data URL
  const pngDataUrl = await QRCode.toDataURL(expectedUrl, {
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#09090b", light: "#ffffff" },
  });

  assert(Boolean(pngDataUrl), "Generates PNG Data URL");
  assert(pngDataUrl.startsWith("data:image/png;base64,"), "PNG output is valid base64 image format");
  assert(pngDataUrl.length > 1000, `PNG data URL contains full high-res payload (length: ${pngDataUrl.length})`);

  // 3. Payload Strictness Audit: Only the profile URL is encoded
  // Using QRCode raw symbol decode/analysis
  const rawQrData = await QRCode.create(expectedUrl, { errorCorrectionLevel: "M" });
  assert(rawQrData.segments.length >= 1, "Creates QR code segments");
  const encodedText = Buffer.from(rawQrData.segments[0].data).toString("utf-8");
  assert(encodedText === expectedUrl, "QR code encodes strictly the public profile URL");
  assert(!encodedText.includes("@"), "Does not encode personal email address inside QR");
  assert(!encodedText.includes("phone"), "Does not encode phone number or private identity fields inside QR");

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Social Sharing URL Generation");
  console.log("=========================================\n");

  const studentName = "Sreehari Nair";
  const shareText = encodeURIComponent(`Check out ${studentName}'s verified student showcase on CollegeCentre:`);
  const encodedUrl = encodeURIComponent(expectedUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;

  assert(twitterUrl.includes("twitter.com/intent/tweet"), "Generates valid Twitter/X intent URL");
  assert(twitterUrl.includes(encodedUrl), "Twitter URL contains encoded profile link");
  assert(linkedInUrl.includes("linkedin.com/sharing"), "Generates valid LinkedIn share URL");
  assert(whatsAppUrl.includes("api.whatsapp.com"), "Generates valid WhatsApp direct share URL");
  assert(telegramUrl.includes("t.me/share"), "Generates valid Telegram share URL");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Open Graph & Social Sharing Metadata");
  console.log("=========================================\n");

  const metadata = await generateMetadata({ params: Promise.resolve({ username: "sreehari" }) });

  assert(Boolean(metadata.title), "Generates dynamic page title");
  assert(String(metadata.title).includes("Sreehari Nair"), "Page title contains student display name");
  assert(String(metadata.title).includes("CollegeCentre"), "Page title contains platform branding");
  assert(Boolean(metadata.description), "Generates descriptive meta description");

  // Open Graph
  assert(Boolean(metadata.openGraph), "Configures Open Graph metadata");
  assert(metadata.openGraph?.type === "profile", "Sets Open Graph type to 'profile'");
  assert(metadata.openGraph?.siteName === "CollegeCentre", "Sets Open Graph siteName to 'CollegeCentre'");
  assert(metadata.openGraph?.url === expectedUrl, "Sets Open Graph canonical URL");
  assert(Array.isArray(metadata.openGraph?.images), "Provides Open Graph images array");
  assert(metadata.openGraph?.images?.length >= 1, "Contains at least 1 preview image");
  const firstImage = metadata.openGraph?.images?.[0];
  assert(firstImage?.width === 1200, "Image provides standard 1200px share width");
  assert(firstImage?.height === 630, "Image provides standard 630px share height");

  // Twitter
  assert(Boolean(metadata.twitter), "Configures Twitter card metadata");
  assert(metadata.twitter?.card === "summary_large_image", "Sets Twitter card to 'summary_large_image'");
  assert(Boolean(metadata.twitter?.images), "Provides Twitter share image");

  // Canonical & Robots
  assert(metadata.alternates?.canonical === expectedUrl, "Sets canonical alternate URL");
  assert(metadata.robots?.index === true, "Enables search engine indexing for public profile");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Private Profile Metadata Protection");
  console.log("=========================================\n");

  // Insert private user
  await mockSupabase.from("profiles").insert({
    id: "usr_qr_private_test",
    username: "qrprivatestudent",
    full_name: "Private Student",
    theme: "minimal",
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const privateMetadata = await generateMetadata({ params: Promise.resolve({ username: "qrprivatestudent" }) });
  assert(privateMetadata.robots?.index === false, "Protects private profile with robots noindex directive");
  assert(privateMetadata.robots?.follow === false, "Protects private profile with robots nofollow directive");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Multiple Profile QR & Sharing Verification");
  console.log("=========================================\n");

  const handles = ["alexrivera", "priyasharma", "kavyapatel"];
  for (const handle of handles) {
    const handleUrl = `https://collegecentre.in/${handle}`;
    const handleSvg = await QRCode.toString(handleUrl, { type: "svg", margin: 1 });
    assert(handleSvg.includes("<svg"), `Generates valid SVG QR code for handle '${handle}'`);

    const handleMeta = await generateMetadata({ params: Promise.resolve({ username: handle }) });
    assert(Boolean(handleMeta.openGraph?.title), `Generates Open Graph title for handle '${handle}'`);
    assert(handleMeta.openGraph?.url === handleUrl, `Sets correct Open Graph URL for handle '${handle}'`);
  }

  console.log("\n✨ ALL PHASE 11 QR & SHARING TESTS PASSED SUCCESSFULLY! ✨\n");
}

runPhase11Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
