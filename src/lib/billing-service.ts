/**
 * CollegeCentre 2.0 - Billing, Monetization & Entitlements Service
 * Phase 15: Premium & Monetization Architecture
 */

import { supabase, DEFAULT_PLANS } from "./supabase.ts";
import type {
  BillingPlan,
  Subscription,
  UserEntitlements,
  EntitlementFeature,
  BillingInterval,
  BillingEvent,
  BillingPlanLimits,
} from "../types/index.ts";
import { billingProvider } from "./billing/index.ts";

const FREE_LIMITS: BillingPlanLimits = {
  max_projects: 5,
  max_achievements: 5,
  max_certificates: 5,
  analytics_days: 7,
};

const PRO_LIMITS: BillingPlanLimits = {
  max_projects: 9999,
  max_achievements: 9999,
  max_certificates: 9999,
  analytics_days: 90,
};

const PRO_FEATURES: Record<EntitlementFeature, boolean> = {
  custom_domain: true,
  advanced_themes: true,
  advanced_customization: true,
  advanced_analytics: true,
  remove_branding: true,
  unlimited_projects: true,
  pro_badge: true,
};

const FREE_FEATURES: Record<EntitlementFeature, boolean> = {
  custom_domain: false,
  advanced_themes: false,
  advanced_customization: false,
  advanced_analytics: false,
  remove_branding: false,
  unlimited_projects: false,
  pro_badge: false,
};

/**
 * Returns available billing plans
 */
export async function getPlans(): Promise<BillingPlan[]> {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return DEFAULT_PLANS as BillingPlan[];
    }

    return data as BillingPlan[];
  } catch {
    return DEFAULT_PLANS as BillingPlan[];
  }
}

/**
 * Returns a specific plan by slug
 */
export async function getPlanBySlug(slug: "free" | "pro"): Promise<BillingPlan | null> {
  const plans = await getPlans();
  return plans.find((p) => p.slug === slug) || null;
}

/**
 * Retrieves the current subscription for a given user profile
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Subscription;
  } catch {
    return null;
  }
}

/**
 * Returns full entitlements for a user (tier, feature flags, limits, subscription)
 */
export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  if (!userId) {
    return {
      tier: "free",
      isPro: false,
      subscription: null,
      features: { ...FREE_FEATURES },
      limits: { ...FREE_LIMITS },
    };
  }

  const subscription = await getUserSubscription(userId);

  // Pro status requires an active or trialing subscription with plan_slug = "pro"
  // Note: Even if cancel_at_period_end is true, the user is Pro until period end
  const isPro =
    !!subscription &&
    subscription.plan_slug === "pro" &&
    (subscription.status === "active" || subscription.status === "trialing");

  return {
    tier: isPro ? "pro" : "free",
    isPro,
    subscription,
    features: isPro ? { ...PRO_FEATURES } : { ...FREE_FEATURES },
    limits: isPro ? { ...PRO_LIMITS } : { ...FREE_LIMITS },
  };
}

/**
 * Checks if a user has access to a specific premium feature
 */
export async function canUse(featureKey: EntitlementFeature, userId?: string): Promise<boolean> {
  if (!userId) return false;
  const entitlements = await getUserEntitlements(userId);
  return entitlements.features[featureKey] === true;
}

/**
 * Returns plan limits for a user
 */
export async function getPlanLimits(userId: string): Promise<BillingPlanLimits> {
  const entitlements = await getUserEntitlements(userId);
  return entitlements.limits;
}

/**
 * Upgrades a user to Pro
 */
export async function upgradeToPro(
  userId: string,
  interval: BillingInterval = "monthly"
): Promise<{ subscription: Subscription }> {
  if (!userId) throw new Error("User ID is required to upgrade.");

  const now = new Date();
  const endDate = new Date(now);
  if (interval === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  const existing = await getUserSubscription(userId);

  let updatedSub: Subscription;
  if (existing) {
    const { data } = await supabase
      .from("subscriptions")
      .update({
        plan_id: "plan_pro",
        plan_slug: "pro",
        status: "active",
        billing_interval: interval,
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
        cancel_at_period_end: false,
        canceled_at: null,
      })
      .eq("id", existing.id);

    updatedSub = data as Subscription;
  } else {
    const newSubData = {
      id: "sub_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      plan_id: "plan_pro",
      plan_slug: "pro",
      status: "active",
      billing_interval: interval,
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
      cancel_at_period_end: false,
      canceled_at: null,
    };

    const { data } = await supabase
      .from("subscriptions")
      .insert([newSubData]);

    updatedSub = data ? (data as Subscription[])[0] : (newSubData as Subscription);
  }

  // Record billing events
  await supabase.from("billing_events").insert([
    {
      id: "bevt_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      event_type: existing ? "subscription.updated" : "subscription.created",
      data: {
        plan: "pro",
        interval,
        amount: interval === "yearly" ? 2499 : 299,
        currency: "INR",
        provider: billingProvider.name,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "bevt_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      event_type: "payment.succeeded",
      data: {
        amount: interval === "yearly" ? 2499 : 299,
        invoice: "inv_" + Date.now().toString(36),
      },
      created_at: new Date().toISOString(),
    },
  ]);

  return { subscription: updatedSub };
}

/**
 * Cancels a subscription. By default cancels at period end to keep service until paid term expires.
 */
export async function cancelSubscription(
  userId: string,
  atPeriodEnd: boolean = true
): Promise<{ subscription: Subscription }> {
  const sub = await getUserSubscription(userId);
  if (!sub) throw new Error("No active subscription found.");

  const { data } = await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: atPeriodEnd,
      canceled_at: new Date().toISOString(),
      ...(atPeriodEnd ? {} : { status: "canceled", plan_slug: "free", plan_id: "plan_free" }),
    })
    .eq("id", sub.id);

  await supabase.from("billing_events").insert([
    {
      id: "bevt_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      event_type: "subscription.canceled",
      data: {
        subscription_id: sub.id,
        at_period_end: atPeriodEnd,
        effective_date: atPeriodEnd ? sub.current_period_end : new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    },
  ]);

  return { subscription: data as Subscription };
}

/**
 * Resumes a subscription that was scheduled to cancel at period end
 */
export async function resumeSubscription(userId: string): Promise<{ subscription: Subscription }> {
  const sub = await getUserSubscription(userId);
  if (!sub) throw new Error("No subscription found to resume.");

  const { data } = await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: false,
      canceled_at: null,
      status: "active",
    })
    .eq("id", sub.id);

  await supabase.from("billing_events").insert([
    {
      id: "bevt_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      event_type: "subscription.updated",
      data: { action: "resumed", subscription_id: sub.id },
      created_at: new Date().toISOString(),
    },
  ]);

  return { subscription: data as Subscription };
}

/**
 * Simulates a payment failure (card decline, expired card, bank rejection)
 */
export async function simulatePaymentFailure(userId: string): Promise<{ subscription: Subscription }> {
  const sub = await getUserSubscription(userId);
  if (!sub) throw new Error("No subscription found.");

  const { data } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
    })
    .eq("id", sub.id);

  await supabase.from("billing_events").insert([
    {
      id: "bevt_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      event_type: "payment.failed",
      data: {
        reason: "Simulated card charge failure / insufficient funds",
        retry_count: 1,
      },
      created_at: new Date().toISOString(),
    },
  ]);

  return { subscription: data as Subscription };
}

/**
 * Simulates payment recovery after a user retries or updates payment method
 */
export async function simulatePaymentRecovery(userId: string): Promise<{ subscription: Subscription }> {
  const sub = await getUserSubscription(userId);
  if (!sub) throw new Error("No subscription found.");

  const { data } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
    })
    .eq("id", sub.id);

  await supabase.from("billing_events").insert([
    {
      id: "bevt_" + Math.random().toString(36).substring(2, 9),
      profile_id: userId,
      event_type: "payment.succeeded",
      data: {
        recovery: true,
        invoice: "inv_recovery_" + Date.now().toString(36),
      },
      created_at: new Date().toISOString(),
    },
  ]);

  return { subscription: data as Subscription };
}

/**
 * Server-side authorization check before persisting premium configuration.
 * Prevents client-side manipulation of custom domains, pro themes, or branding removal.
 */
export async function authorizeFeatureUpdate(
  userId: string,
  feature: EntitlementFeature,
  payload?: any
): Promise<{ authorized: boolean; error?: string }> {
  const entitlements = await getUserEntitlements(userId);

  if (!entitlements.isPro && !entitlements.features[feature]) {
    return {
      authorized: false,
      error: `Action restricted. Feature '${feature}' requires a CollegeCentre Pro subscription.`,
    };
  }

  // Pro theme payload validation
  if (feature === "advanced_themes" && payload?.theme) {
    const PRO_THEMES = ["creative", "obsidian", "cobalt", "terminal"];
    if (PRO_THEMES.includes(payload.theme) && !entitlements.isPro) {
      return {
        authorized: false,
        error: `Theme '${payload.theme}' is a Pro theme. Upgrade to use.`,
      };
    }
  }

  return { authorized: true };
}

/**
 * Updates personal custom domain with validation and server-side authorization
 */
export async function updateCustomDomain(
  userId: string,
  domain: string | null
): Promise<{ success: boolean; custom_domain?: string | null; error?: string }> {
  const auth = await authorizeFeatureUpdate(userId, "custom_domain");
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  if (domain !== null && domain.trim() !== "") {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
      return {
        success: false,
        error: "Invalid domain format. Example: alexrivera.dev or portfolio.mydomain.com",
      };
    }

    if (cleanDomain.includes("collegecentre.in") || cleanDomain.includes("localhost")) {
      return {
        success: false,
        error: "Cannot use internal system domains as custom domain.",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ custom_domain: cleanDomain })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, custom_domain: cleanDomain };
  } else {
    // Clearing custom domain
    const { error } = await supabase
      .from("profiles")
      .update({ custom_domain: null })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, custom_domain: null };
  }
}

/**
 * Toggles CollegeCentre branding watermark removal on public profile
 */
export async function updateBrandingToggle(
  userId: string,
  removeBranding: boolean
): Promise<{ success: boolean; remove_branding?: boolean; error?: string }> {
  if (removeBranding) {
    const auth = await authorizeFeatureUpdate(userId, "remove_branding");
    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ remove_branding: removeBranding })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, remove_branding: removeBranding };
}

/**
 * Returns billing and invoice activity for a user
 */
export async function getBillingEvents(userId: string): Promise<BillingEvent[]> {
  try {
    const { data } = await supabase
      .from("billing_events")
      .select("*")
      .eq("profile_id", userId);

    if (!data) return [];
    return (data as BillingEvent[]).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch {
    return [];
  }
}
