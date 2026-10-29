/**
 * CollegeCentre 2.0 - Phase 15 Automated Test Suite
 * Monetization, Subscription Billing Abstraction, Entitlements & Feature Gating
 */

import {
  getPlans,
  getPlanBySlug,
  getUserSubscription,
  getUserEntitlements,
  canUse,
  upgradeToPro,
  cancelSubscription,
  resumeSubscription,
  simulatePaymentFailure,
  simulatePaymentRecovery,
  authorizeFeatureUpdate,
  updateCustomDomain,
  updateBrandingToggle,
  getBillingEvents,
} from "../src/lib/billing-service.ts";
import { billingProvider } from "../src/lib/billing/index.ts";
import { supabase } from "../src/lib/supabase.ts";

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

async function runTests() {
  console.log("\n========================================================");
  console.log("  CollegeCentre 2.0 - Phase 15 Monetization Test Suite  ");
  console.log("========================================================\n");

  try {
    // ---------------------------------------------------------
    // TEST 1: Plans Configuration & Limits
    // ---------------------------------------------------------
    console.log("TEST 1: Plans Configuration & Pricing Limits");
    const plans = await getPlans();
    assert(Array.isArray(plans) && plans.length >= 2, "Retrieved available plans from database");

    const freePlan = await getPlanBySlug("free");
    assert(freePlan !== null, "Found Free tier plan configuration");
    assert(freePlan.price_monthly === 0 && freePlan.price_yearly === 0, "Free plan has ₹0 cost forever");
    assert(freePlan.limits.max_projects === 5, "Free plan allows up to 5 engineering projects");
    assert(freePlan.limits.analytics_days === 7, "Free plan provides 7 days analytics");

    const proPlan = await getPlanBySlug("pro");
    assert(proPlan !== null, "Found Pro tier plan configuration");
    assert(proPlan.price_monthly === 299 && proPlan.price_yearly === 2499, "Pro plan configured at ₹299/mo and ₹2499/yr");
    assert(proPlan.limits.max_projects >= 9999, "Pro plan has unlimited project capacity");
    assert(proPlan.limits.analytics_days === 90, "Pro plan has extended 90-day traffic analytics");

    // ---------------------------------------------------------
    // TEST 2: Free User Entitlements Gating
    // ---------------------------------------------------------
    console.log("\nTEST 2: Free User Entitlements & Initial State");
    const freeUser = "usr_sreehari";
    const freeEnts = await getUserEntitlements(freeUser);
    assert(freeEnts.tier === "free", "Free user tier is 'free'");
    assert(freeEnts.isPro === false, "Free user isPro flag is false");
    assert(freeEnts.features.custom_domain === false, "Free user cannot use custom domain");
    assert(freeEnts.features.remove_branding === false, "Free user cannot remove CollegeCentre branding");
    assert(freeEnts.features.advanced_themes === false, "Free user cannot use curated pro themes");

    const canDomainFree = await canUse("custom_domain", freeUser);
    assert(canDomainFree === false, "canUse('custom_domain') returns false for Free user");

    // ---------------------------------------------------------
    // TEST 3: Pro User Entitlements
    // ---------------------------------------------------------
    console.log("\nTEST 3: Pro User Entitlements & Capabilities");
    const proUser = "usr_alex";
    const proEnts = await getUserEntitlements(proUser);
    assert(proEnts.tier === "pro", "Pro user tier is 'pro'");
    assert(proEnts.isPro === true, "Pro user isPro flag is true");
    assert(proEnts.features.custom_domain === true, "Pro user can connect custom domain");
    assert(proEnts.features.remove_branding === true, "Pro user can white-label showcase");
    assert(proEnts.features.advanced_themes === true, "Pro user can use curated pro themes");
    assert(proEnts.features.advanced_analytics === true, "Pro user has extended analytics");

    const canDomainPro = await canUse("custom_domain", proUser);
    assert(canDomainPro === true, "canUse('custom_domain') returns true for Pro user");

    // ---------------------------------------------------------
    // TEST 4: Server-Side Authorization Protection
    // ---------------------------------------------------------
    console.log("\nTEST 4: Server-Side Feature Authorization Protection");
    // Free user attempts to set custom domain
    const freeDomainAttempt = await updateCustomDomain(freeUser, "sreehari.dev");
    assert(freeDomainAttempt.success === false, "Server blocks Free user from configuring custom domain");

    // Free user attempts to remove branding
    const freeBrandingAttempt = await updateBrandingToggle(freeUser, true);
    assert(freeBrandingAttempt.success === false, "Server blocks Free user from toggling remove_branding");

    // Free user attempts to apply pro theme
    const freeThemeAuth = await authorizeFeatureUpdate(freeUser, "advanced_themes", { theme: "creative" });
    assert(freeThemeAuth.authorized === false, "Server rejects Free user from activating Pro theme");

    // Pro user attempts invalid domain format
    const invalidDomainAttempt = await updateCustomDomain(proUser, "invalid_domain");
    assert(invalidDomainAttempt.success === false, "Domain validator rejects malformed domain syntax");

    // Pro user configures valid domain
    const validDomainAttempt = await updateCustomDomain(proUser, "alexrivera.dev");
    assert(validDomainAttempt.success === true, "Pro user successfully configures custom domain");
    assert(validDomainAttempt.custom_domain === "alexrivera.dev", "Custom domain saved to profile");

    // Pro user toggles remove branding
    const validBrandingAttempt = await updateBrandingToggle(proUser, true);
    assert(validBrandingAttempt.success === true, "Pro user successfully enables remove_branding");

    // ---------------------------------------------------------
    // TEST 5: Subscription Lifecycle (Upgrade, Cancel, Resume)
    // ---------------------------------------------------------
    console.log("\nTEST 5: Subscription Lifecycle (Upgrade, Cancel, Resume)");
    // Upgrade free user to Pro yearly
    const upgradeRes = await upgradeToPro(freeUser, "yearly");
    assert(upgradeRes.subscription.plan_slug === "pro", "User upgraded to 'pro'");
    assert(upgradeRes.subscription.billing_interval === "yearly", "Billing interval is 'yearly'");
    assert(upgradeRes.subscription.status === "active", "Upgraded subscription status is 'active'");

    // Verify entitlements after upgrade
    const upgradedEnts = await getUserEntitlements(freeUser);
    assert(upgradedEnts.isPro === true, "Entitlements refreshed: isPro is true");
    assert(upgradedEnts.features.custom_domain === true, "Custom domain entitlement unlocked");

    // Custom domain now succeeds for newly upgraded user
    const newlyUnlockedDomain = await updateCustomDomain(freeUser, "sreehari.me");
    assert(newlyUnlockedDomain.success === true, "Upgraded user can now attach personal custom domain");

    // Cancel subscription at period end
    const cancelRes = await cancelSubscription(freeUser, true);
    assert(cancelRes.subscription.cancel_at_period_end === true, "Subscription cancel_at_period_end is true");
    assert(cancelRes.subscription.canceled_at !== null, "Cancellation timestamp recorded");

    // Verify entitlements during cancellation grace period
    const cancelPeriodEnts = await getUserEntitlements(freeUser);
    assert(cancelPeriodEnts.isPro === true, "User retains Pro perks until end of paid billing period");

    // Resume subscription
    const resumeRes = await resumeSubscription(freeUser);
    assert(resumeRes.subscription.cancel_at_period_end === false, "Subscription resumed: cancel_at_period_end is false");
    assert(resumeRes.subscription.status === "active", "Subscription restored to active");

    // ---------------------------------------------------------
    // TEST 6: Payment Failure & Recovery Simulation
    // ---------------------------------------------------------
    console.log("\nTEST 6: Payment Failure & Recovery Simulation");
    const failRes = await simulatePaymentFailure(freeUser);
    assert(failRes.subscription.status === "past_due", "Subscription status changed to 'past_due'");

    const pastDueEnts = await getUserEntitlements(freeUser);
    assert(pastDueEnts.isPro === false, "Pro perks paused while subscription is past_due");

    const recoveryRes = await simulatePaymentRecovery(freeUser);
    assert(recoveryRes.subscription.status === "active", "Subscription recovered back to 'active'");

    const recoveredEnts = await getUserEntitlements(freeUser);
    assert(recoveredEnts.isPro === true, "Pro perks restored after successful payment retry");

    // ---------------------------------------------------------
    // TEST 7: Billing Events & Invoices Audit
    // ---------------------------------------------------------
    console.log("\nTEST 7: Billing Audit Trail & Invoices");
    const events = await getBillingEvents(freeUser);
    assert(events.length >= 3, `Recorded ${events.length} billing audit events`);
    const hasPaymentSuccess = events.some((e) => e.event_type === "payment.succeeded");
    const hasPaymentFail = events.some((e) => e.event_type === "payment.failed");
    assert(hasPaymentSuccess, "Audit log contains 'payment.succeeded' events");
    assert(hasPaymentFail, "Audit log contains 'payment.failed' event");

    // ---------------------------------------------------------
    // TEST 8: Billing Provider Abstraction
    // ---------------------------------------------------------
    console.log("\nTEST 8: Billing Provider Abstraction");
    assert(billingProvider.name === "mock_provider", "Billing provider abstraction is active (mock_provider)");
    const checkout = await billingProvider.createCheckoutSession({
      userId: "test_usr",
      planSlug: "pro",
      billingInterval: "monthly",
      successUrl: "https://collegecentre.in/dashboard?success=true",
      cancelUrl: "https://collegecentre.in/pricing?canceled=true",
    });
    assert(checkout.sessionId.startsWith("cs_mock_"), "Generated universal checkout session ID");
    assert(checkout.checkoutUrl.includes("plan=pro"), "Universal checkout URL contains plan metadata");

    const portal = await billingProvider.createCustomerPortalSession({
      userId: "test_usr",
      returnUrl: "https://collegecentre.in/dashboard?tab=settings",
    });
    assert(portal.portalUrl.includes("portal=open"), "Universal customer portal session created");

  } catch (error) {
    console.error("Unhandled test execution error:", error);
    failed++;
  }

  console.log("\n========================================================");
  console.log(`  Summary: ${passed} PASSED | ${failed} FAILED`);
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
