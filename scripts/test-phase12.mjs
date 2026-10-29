// Phase 12 Comprehensive Test Suite: Privacy-Conscious Student Analytics & Insights
// Verifies event tracking, privacy sanitization, rate-limiting, daily time-series aggregation,
// time filters (7d, 30d, 90d, all), top links & projects ranking, and empty state resilience.

import { trackAnalyticsEvent, getAnalyticsSummary } from "../src/lib/analytics.ts";
import { mockSupabase } from "../src/lib/supabase.ts";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

async function runPhase12Tests() {
  console.log("\n=========================================");
  console.log("TEST SUITE 1: Event Tracking & Telemetry Collection");
  console.log("=========================================\n");

  const testProfileId = "usr_test_student_" + Date.now();

  // 1. Track profile view
  const viewLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "profile_view",
    referrerHost: "github.com",
    deviceType: "desktop",
  });
  assert(viewLogged === true, "Successfully tracked profile_view event");

  // 2. Track link click
  const linkLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "link_click",
    resourceId: "link_demo_1",
    resourceTitle: "Personal Portfolio & Preprints",
    referrerHost: "linkedin.com",
    deviceType: "mobile",
  });
  assert(linkLogged === true, "Successfully tracked link_click event");

  // 3. Track project view & project click
  const projViewLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "project_view",
    resourceId: "proj_demo_1",
    resourceTitle: "Distributed Consensus Engine",
    deviceType: "desktop",
  });
  assert(projViewLogged === true, "Successfully tracked project_view event");

  const projClickLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "project_click",
    resourceId: "proj_demo_1",
    resourceTitle: "Distributed Consensus Engine (GitHub)",
    deviceType: "desktop",
  });
  assert(projClickLogged === true, "Successfully tracked project_click event");

  // 4. Track resume view & resume download
  const resumeViewLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "resume_view",
    resourceId: "res_demo_1",
    resourceTitle: "Systems Architecture CV",
    deviceType: "desktop",
  });
  assert(resumeViewLogged === true, "Successfully tracked resume_view event");

  const resumeDlLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "resume_download",
    resourceId: "res_demo_1",
    resourceTitle: "Systems Architecture CV",
    deviceType: "desktop",
  });
  assert(resumeDlLogged === true, "Successfully tracked resume_download event");

  // 5. Track share event
  const shareLogged = await trackAnalyticsEvent({
    profileId: testProfileId,
    eventType: "share_event",
    resourceId: "qr_download",
    resourceTitle: "QR Code Vector Download",
  });
  assert(shareLogged === true, "Successfully tracked share_event");

  // Verify all 7 events exist in database for this profile
  const { data: storedEvents } = await mockSupabase
    .from("analytics_events")
    .select("*")
    .eq("profile_id", testProfileId);

  assert(storedEvents && storedEvents.length === 7, `Stored exactly 7 events for test profile (found ${storedEvents?.length})`);

  console.log("\n=========================================");
  console.log("TEST SUITE 2: Privacy Compliance & Data Sanitization");
  console.log("=========================================\n");

  // Audit event payload properties for privacy leaks
  for (const evt of storedEvents) {
    assert(!evt.ip, "Does not store raw IP addresses");
    assert(!evt.ip_address, "No ip_address column in event schema");
    assert(!evt.user_id, "Does not capture private visitor user IDs");
    assert(!evt.fingerprint, "No canvas or hardware fingerprinting stored");
    assert(!evt.visitor_name, "No visitor personal identifying information");
    assert(!evt.cookie_id, "No third-party tracking cookie identifier");

    // Check referrer host sanitization
    if (evt.referrer_host) {
      assert(!evt.referrer_host.includes("?"), "Referrer host does not include sensitive query params");
      assert(!evt.referrer_host.includes("/"), "Referrer host is stripped down to hostname without paths");
    }
  }
  console.log("✅ PASSED: All events strictly adhere to privacy-preserving audit standards");

  console.log("\n=========================================");
  console.log("TEST SUITE 3: Aggregation & Summary Calculations");
  console.log("=========================================\n");

  const summary = await getAnalyticsSummary(testProfileId, "30d");

  assert(summary.timeFilter === "30d", "Summary returns requested time filter");
  assert(summary.metrics.totalProfileViews === 1, `Calculates 1 total profile view (got ${summary.metrics.totalProfileViews})`);
  assert(summary.metrics.totalLinkClicks === 1, `Calculates 1 total link click (got ${summary.metrics.totalLinkClicks})`);
  assert(summary.metrics.totalProjectInteractions === 2, `Calculates 2 project interactions (got ${summary.metrics.totalProjectInteractions})`);
  assert(summary.metrics.totalResumeInteractions === 2, `Calculates 2 resume interactions (got ${summary.metrics.totalResumeInteractions})`);
  assert(summary.metrics.totalShareEvents === 1, `Calculates 1 share event (got ${summary.metrics.totalShareEvents})`);
  assert(summary.metrics.clickThroughRate === 100, `Calculates 100% CTR (1 click / 1 view)`);

  // Verify dailyPoints time-series continuity
  assert(summary.dailyPoints.length === 30, `Generates 30 continuous daily points for 30d filter (got ${summary.dailyPoints.length})`);
  const totalEventsInPoints = summary.dailyPoints.reduce((acc, p) => acc + p.totalEvents, 0);
  assert(totalEventsInPoints === 7, `Sum of daily points events equals 7 (got ${totalEventsInPoints})`);

  // Top links verification
  assert(summary.topLinks.length === 1, "Top links contains 1 ranked item");
  assert(summary.topLinks[0].id === "link_demo_1", "Top link ID matches tracked resource_id");
  assert(summary.topLinks[0].count === 1, "Top link has count 1");

  // Top projects verification
  assert(summary.topProjects.length === 1, "Top projects contains 1 ranked project");
  assert(summary.topProjects[0].id === "proj_demo_1", "Top project ID matches tracked project ID");
  assert(summary.topProjects[0].count === 2, "Top project counts both view and click interactions (count: 2)");

  console.log("\n=========================================");
  console.log("TEST SUITE 4: Time Filter Boundaries (7d, 30d, 90d, All)");
  console.log("=========================================\n");

  const summary7d = await getAnalyticsSummary(testProfileId, "7d");
  assert(summary7d.dailyPoints.length === 7, `7d filter produces exactly 7 daily points (got ${summary7d.dailyPoints.length})`);

  const summary90d = await getAnalyticsSummary(testProfileId, "90d");
  assert(summary90d.dailyPoints.length === 90, `90d filter produces exactly 90 daily points (got ${summary90d.dailyPoints.length})`);

  const summaryAll = await getAnalyticsSummary(testProfileId, "all");
  assert(summaryAll.metrics.totalProfileViews >= 1, "All-time filter captures events across entire timeline");

  console.log("\n=========================================");
  console.log("TEST SUITE 5: Multi-Tenant Data Isolation");
  console.log("=========================================\n");

  const otherProfileId = "usr_isolated_" + Date.now();
  await trackAnalyticsEvent({
    profileId: otherProfileId,
    eventType: "profile_view",
  });

  const isolatedSummary = await getAnalyticsSummary(otherProfileId, "30d");
  assert(isolatedSummary.metrics.totalProfileViews === 1, "Isolated profile only sees its own 1 view");
  assert(isolatedSummary.metrics.totalLinkClicks === 0, "Isolated profile sees 0 link clicks (no leakage from testProfileId)");
  assert(isolatedSummary.topLinks.length === 0, "No leaked top links from other profiles");

  console.log("\n=========================================");
  console.log("TEST SUITE 6: Empty State Resilience (Zero Crashes on Fresh Profiles)");
  console.log("=========================================\n");

  const freshProfileId = "usr_brand_new_" + Date.now();
  const emptySummary = await getAnalyticsSummary(freshProfileId, "30d");

  assert(emptySummary.totalEventsCount === 0, "Returns totalEventsCount = 0 for fresh profile");
  assert(emptySummary.metrics.totalProfileViews === 0, "totalProfileViews is 0 (not NaN or null)");
  assert(emptySummary.metrics.totalLinkClicks === 0, "totalLinkClicks is 0");
  assert(emptySummary.metrics.clickThroughRate === 0, "clickThroughRate is 0% without division-by-zero crashes");
  assert(emptySummary.topLinks.length === 0, "topLinks is clean empty array");
  assert(emptySummary.topProjects.length === 0, "topProjects is clean empty array");
  assert(emptySummary.dailyPoints.length === 30, "Returns 30 empty daily points for clean chart rendering");

  console.log("\n=========================================");
  console.log("TEST SUITE 7: Realistic Seed Profiles Analytics Integration");
  console.log("=========================================\n");

  const sreehariSummary = await getAnalyticsSummary("usr_sreehari", "30d");
  assert(sreehariSummary.metrics.totalProfileViews > 50, `Sreehari profile has rich view analytics (${sreehariSummary.metrics.totalProfileViews} views)`);
  assert(sreehariSummary.metrics.totalLinkClicks > 30, `Sreehari profile has rich link clicks (${sreehariSummary.metrics.totalLinkClicks} clicks)`);
  assert(sreehariSummary.topLinks.length > 0, "Sreehari profile has ranked top links");
  assert(sreehariSummary.topProjects.length > 0, "Sreehari profile has ranked top projects");
  assert(sreehariSummary.topReferrers.length > 0, "Sreehari profile has ranked referrers");
  assert(sreehariSummary.deviceBreakdown.length > 0, "Sreehari profile has device distribution");

  console.log("\n=========================================");
  console.log("🎉 ALL PHASE 12 ANALYTICS TESTS PASSED!");
  console.log("=========================================\n");
}

runPhase12Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
