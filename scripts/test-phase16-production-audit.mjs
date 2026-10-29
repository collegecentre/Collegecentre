/**
 * CollegeCentre 2.0 - Phase 16 Production Hardening & Launch Audit Suite
 */

import fs from "fs";
import path from "path";
import {
  sanitizeText,
  isSafeUrl,
  sanitizeUrl,
  validateFileUpload,
  checkRateLimit,
} from "../src/lib/security.ts";
import { getStudentProfileByUsername } from "../src/lib/profile-service.ts";
import { logger } from "../src/lib/logger.ts";
import sitemap from "../src/app/sitemap.ts";
import robots from "../src/app/robots.ts";
import { GET as healthCheckGet } from "../src/app/api/health/route.ts";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failed++;
  }
}

async function runAudit() {
  console.log("\n========================================================");
  console.log("  CollegeCentre 2.0 - Phase 16 Production Hardening Audit ");
  console.log("========================================================\n");

  try {
    // ---------------------------------------------------------
    // 1. SECURITY & XSS SANITIZATION
    // ---------------------------------------------------------
    console.log("AUDIT 1: Input Sanitization & XSS Mitigation");
    const rawXss = "<script>alert('pwned')</script>Hello <b>World</b> <img src=x onerror=alert(1)>";
    const cleaned = sanitizeText(rawXss);
    assert(!cleaned.includes("<script>"), "sanitizeText strips <script> tags");
    assert(!cleaned.includes("onerror"), "sanitizeText strips HTML attributes and event handlers");
    assert(cleaned.includes("Hello World"), "sanitizeText preserves clean textual content");

    assert(isSafeUrl("https://github.com/torvalds") === true, "isSafeUrl accepts valid HTTPS URL");
    assert(isSafeUrl("mailto:alex@collegecentre.in") === true, "isSafeUrl accepts valid mailto: link");
    assert(isSafeUrl("javascript:alert(document.cookie)") === false, "isSafeUrl rejects dangerous javascript: URI");
    assert(isSafeUrl("data:text/html,<script>alert(1)</script>") === false, "isSafeUrl rejects malicious data: URI");
    assert(isSafeUrl("//evil.com/phishing") === false, "isSafeUrl rejects protocol-relative redirect attack");

    const fixedUrl = sanitizeUrl("linkedin.com/in/alexrivera");
    assert(fixedUrl === "https://linkedin.com/in/alexrivera", "sanitizeUrl auto-prefixes HTTPS for bare domains");
    assert(sanitizeUrl("javascript:void(0)") === null, "sanitizeUrl drops malicious protocols to null");

    // ---------------------------------------------------------
    // 2. STORAGE VALIDATION & EXTENSION SPOOFING
    // ---------------------------------------------------------
    console.log("\nAUDIT 2: Storage Upload Limits & Extension Spoofing Protection");
    const validPdf = { name: "alex_resume.pdf", size: 1024 * 500, type: "application/pdf" };
    const pdfCheck = validateFileUpload(validPdf, {
      allowedMimeTypes: ["application/pdf"],
      maxSizeBytes: 10 * 1024 * 1024,
    });
    assert(pdfCheck.valid === true, "Permits valid 500KB PDF resume upload");

    const oversizedFile = { name: "large.pdf", size: 15 * 1024 * 1024, type: "application/pdf" };
    const sizeCheck = validateFileUpload(oversizedFile, {
      allowedMimeTypes: ["application/pdf"],
      maxSizeBytes: 10 * 1024 * 1024,
    });
    assert(sizeCheck.valid === false, "Rejects file exceeding 10MB limit");

    const spoofedFile = { name: "invoice.pdf.exe", size: 1024 * 100, type: "application/pdf" };
    const spoofCheck = validateFileUpload(spoofedFile, {
      allowedMimeTypes: ["application/pdf"],
      maxSizeBytes: 10 * 1024 * 1024,
    });
    assert(spoofCheck.valid === false, "Detects and blocks executable extension spoofing (.exe)");

    // ---------------------------------------------------------
    // 3. RATE LIMITING & ABUSE PREVENTION
    // ---------------------------------------------------------
    console.log("\nAUDIT 3: Rate Limiting & Throttling");
    const testKey = "test_client_ip_" + Date.now();
    for (let i = 0; i < 5; i++) {
      checkRateLimit(testKey, 5, 5000);
    }
    const throttled = checkRateLimit(testKey, 5, 5000);
    assert(throttled.allowed === false, "Rate limiter blocks requests exceeding threshold");
    assert(throttled.remaining === 0, "Rate limiter reports 0 remaining quota");

    // ---------------------------------------------------------
    // 4. PRIVATE DATA ISOLATION (SECURITY AUDIT)
    // ---------------------------------------------------------
    console.log("\nAUDIT 4: Private Student Data Isolation");
    const publicProfile = await getStudentProfileByUsername("alexrivera");
    assert(publicProfile !== null, "Successfully loaded public showcase for 'alexrivera'");
    assert(publicProfile.projects.length > 0, "Public profile exposes public projects");

    // Private profile isolation test
    const privateProfile = await getStudentProfileByUsername("privateuser");
    assert(privateProfile !== null, "Loaded profile shell for 'privateuser'");
    assert(privateProfile.profile.is_public === false, "'privateuser' profile is_public flag is false");
    assert(privateProfile.projects.length === 0, "Private profile strictly isolates projects (returns empty array)");
    assert(privateProfile.achievements.length === 0, "Private profile strictly isolates achievements");
    assert(privateProfile.certificates.length === 0, "Private profile strictly isolates certificates");
    assert(privateProfile.resume === null, "Private profile strictly isolates resume (returns null)");

    // ---------------------------------------------------------
    // 5. OBSERVABILITY & HEALTH CHECK API
    // ---------------------------------------------------------
    console.log("\nAUDIT 5: Observability & System Health API");
    const healthResponse = await healthCheckGet();
    const healthData = await healthResponse.json();
    assert(healthResponse.status === 200, "Health check endpoint returns HTTP 200");
    assert(healthData.status === "healthy", "Health status is 'healthy'");
    assert(healthData.version === "2.0.0", "Reports correct application version 2.0.0");
    assert(typeof healthData.latencyMs === "number", "Reports database/service latency measurement");

    // ---------------------------------------------------------
    // 6. SEO SITEMAP & ROBOTS SPECIFICATION
    // ---------------------------------------------------------
    console.log("\nAUDIT 6: Dynamic SEO Sitemap & Robots Configuration");
    const siteMapEntries = await sitemap();
    assert(Array.isArray(siteMapEntries) && siteMapEntries.length >= 7, `Generated sitemap with ${siteMapEntries.length} routes`);
    const hasExploreInSitemap = siteMapEntries.some((e) => e.url.includes("/explore"));
    const hasPricingInSitemap = siteMapEntries.some((e) => e.url.includes("/pricing"));
    const hasPrivacyInSitemap = siteMapEntries.some((e) => e.url.includes("/privacy"));
    assert(hasExploreInSitemap && hasPricingInSitemap && hasPrivacyInSitemap, "Sitemap indexes core discovery, pricing and legal pages");

    const robotsRules = robots();
    assert(robotsRules.rules.allow === "/", "robots.txt allows root indexing");
    assert(robotsRules.rules.disallow.includes("/dashboard/"), "robots.txt protects authenticated dashboard from indexing");
    assert(robotsRules.rules.disallow.includes("/api/"), "robots.txt protects internal APIs from indexing");

    // ---------------------------------------------------------
    // 7. PRODUCTION ERROR BOUNDARIES & LEGAL COMPLIANCE
    // ---------------------------------------------------------
    console.log("\nAUDIT 7: Error Boundaries, Legal Pages & Security Config");
    assert(fs.existsSync("src/app/error.tsx"), "Route error boundary (src/app/error.tsx) exists");
    assert(fs.existsSync("src/app/global-error.tsx"), "Root layout global error boundary exists");
    assert(fs.existsSync("src/app/not-found.tsx"), "Custom 404 handler exists");
    assert(fs.existsSync("src/app/privacy/page.tsx"), "Privacy Policy page exists");
    assert(fs.existsSync("src/app/terms/page.tsx"), "Terms of Service page exists");
    assert(fs.existsSync("src/app/contact/page.tsx"), "Contact & Support page exists");
    assert(fs.existsSync("docs/production-deployment.md"), "Production deployment & rollback guide exists");
    assert(fs.existsSync("supabase/migrations/20261029000012_phase16_production_hardening.sql"), "Phase 16 production hardening migration exists");

    const nextConfigContent = fs.readFileSync("next.config.mjs", "utf8");
    assert(nextConfigContent.includes("poweredByHeader: false"), "next.config.mjs disables x-powered-by header");
    assert(nextConfigContent.includes("Strict-Transport-Security"), "next.config.mjs configures HSTS security header");
    assert(nextConfigContent.includes("X-Frame-Options"), "next.config.mjs configures clickjacking defense");

  } catch (err) {
    console.error("Audit suite error:", err);
    failed++;
  }

  console.log("\n========================================================");
  console.log(`  Audit Summary: ${passed} PASSED | ${failed} FAILED`);
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
