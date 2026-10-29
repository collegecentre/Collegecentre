/**
 * CollegeCentre - Billing Provider Factory
 */

import { MockBillingProvider } from "./mock-provider.ts";
import type { BillingProvider } from "./types.ts";

export * from "./types.ts";
export * from "./mock-provider.ts";

// Default to Mock Billing Provider.
// Can be substituted with StripeBillingProvider or LemonSqueezyBillingProvider via environment variable
export const billingProvider: BillingProvider = new MockBillingProvider();
