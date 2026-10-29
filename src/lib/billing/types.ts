/**
 * CollegeCentre - Billing Provider Abstraction
 */

import type { Subscription, PlanTier, BillingInterval } from "../../types/index.ts";

export interface CreateCheckoutParams {
  userId: string;
  userEmail?: string;
  planSlug: PlanTier;
  billingInterval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
}

export interface CreatePortalParams {
  userId: string;
  returnUrl: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
}

export interface PortalSessionResult {
  portalUrl: string;
}

/**
 * Universal Billing Provider Interface.
 * Can be implemented by Stripe, LemonSqueezy, Razorpay, Paddle, or Mock.
 */
export interface BillingProvider {
  readonly name: string;

  /**
   * Generates a checkout session for upgrading or subscribing
   */
  createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult>;

  /**
   * Generates a customer billing portal session (for card updates, invoice downloads)
   */
  createCustomerPortalSession(params: CreatePortalParams): Promise<PortalSessionResult>;

  /**
   * Retrieves subscription by identifier
   */
  getSubscription(subscriptionId: string): Promise<Subscription | null>;

  /**
   * Cancels a subscription immediately or at period end
   */
  cancelSubscription(subscriptionId: string, atPeriodEnd: boolean): Promise<Subscription>;

  /**
   * Resumes a subscription scheduled for cancellation
   */
  resumeSubscription(subscriptionId: string): Promise<Subscription>;
}
