/**
 * CollegeCentre 2.0 - Mock Billing Provider Implementation
 * Phase 15: Clean Decoupled Billing Provider
 */

import type {
  BillingProvider,
  CreateCheckoutParams,
  CreatePortalParams,
  CheckoutSessionResult,
  PortalSessionResult,
} from "./types.ts";
import type { Subscription } from "../../types/index.ts";
import { supabase } from "../supabase.ts";

export class MockBillingProvider implements BillingProvider {
  readonly name = "mock_provider";

  async createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    await new Promise((r) => setTimeout(r, 100));

    const sessionId = "cs_mock_" + Math.random().toString(36).substring(2, 10);
    const checkoutUrl = `${params.successUrl}?session_id=${sessionId}&plan=${params.planSlug}&interval=${params.billingInterval}`;

    return {
      sessionId,
      checkoutUrl,
    };
  }

  async createCustomerPortalSession(params: CreatePortalParams): Promise<PortalSessionResult> {
    await new Promise((r) => setTimeout(r, 100));

    return {
      portalUrl: `${params.returnUrl}?portal=open`,
    };
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .maybeSingle();

    return data as Subscription | null;
  }

  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean): Promise<Subscription> {
    const updates: Partial<Subscription> = {
      cancel_at_period_end: atPeriodEnd,
      canceled_at: new Date().toISOString(),
      ...(atPeriodEnd ? {} : { status: "canceled" }),
    };

    const { data } = await supabase
      .from("subscriptions")
      .update(updates)
      .eq("id", subscriptionId);

    return data as Subscription;
  }

  async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    const { data } = await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: false,
        canceled_at: null,
        status: "active",
      })
      .eq("id", subscriptionId);

    return data as Subscription;
  }
}
