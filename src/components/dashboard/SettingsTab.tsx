"use client";

import * as React from "react";
import {
  Sparkles,
  Globe,
  ShieldCheck,
  Check,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Calendar,
  CreditCard,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  EyeOff,
  Flame,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import {
  getUserEntitlements,
  getUserSubscription,
  getBillingEvents,
  updateCustomDomain,
  updateBrandingToggle,
  cancelSubscription,
  resumeSubscription,
  simulatePaymentFailure,
  simulatePaymentRecovery,
} from "@/lib/billing-service";
import type { Profile, UserEntitlements, Subscription, BillingEvent } from "@/types";

interface SettingsTabProps {
  profile: Profile;
  onProfileUpdated?: (updated: Profile) => void;
}

export function SettingsTab({ profile, onProfileUpdated }: SettingsTabProps) {
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(true);
  const [entitlements, setEntitlements] = React.useState<UserEntitlements | null>(null);
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [billingEvents, setBillingEvents] = React.useState<BillingEvent[]>([]);

  // Custom domain form state
  const [domainInput, setDomainInput] = React.useState(profile.custom_domain || "");
  const [domainLoading, setDomainLoading] = React.useState(false);

  // Branding toggle state
  const [removeBranding, setRemoveBranding] = React.useState(profile.remove_branding || false);
  const [brandingLoading, setBrandingLoading] = React.useState(false);

  // Upgrade Modal state
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);
  const [upgradeFeature, setUpgradeFeature] = React.useState<string | undefined>(undefined);

  // Cancellation confirm dialog
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelLoading, setCancelLoading] = React.useState(false);

  // Payment simulation state
  const [simLoading, setSimLoading] = React.useState(false);

  const loadBillingData = React.useCallback(async () => {
    try {
      const [ents, sub, events] = await Promise.all([
        getUserEntitlements(profile.id),
        getUserSubscription(profile.id),
        getBillingEvents(profile.id),
      ]);
      setEntitlements(ents);
      setSubscription(sub);
      setBillingEvents(events);
    } catch (err) {
      console.error("Error loading billing details:", err);
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  React.useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  React.useEffect(() => {
    setDomainInput(profile.custom_domain || "");
    setRemoveBranding(profile.remove_branding || false);
  }, [profile.custom_domain, profile.remove_branding]);

  const handleSaveDomain = async () => {
    if (!entitlements?.isPro) {
      setUpgradeFeature("Custom Personal Domain");
      setUpgradeOpen(true);
      return;
    }

    setDomainLoading(true);
    const result = await updateCustomDomain(profile.id, domainInput.trim() || null);
    setDomainLoading(false);

    if (!result.success) {
      toast({
        title: "Domain Error",
        description: result.error || "Unable to update custom domain.",
        variant: "error",
      });
      return;
    }

    toast({
      title: "Domain Configured",
      description: result.custom_domain
        ? `Personal domain '${result.custom_domain}' attached to your showcase.`
        : "Custom domain disconnected.",
      variant: "default",
    });

    if (onProfileUpdated) {
      onProfileUpdated({
        ...profile,
        custom_domain: result.custom_domain || null,
      });
    }
  };

  const handleToggleBranding = async (checked: boolean) => {
    if (checked && !entitlements?.isPro) {
      setUpgradeFeature("Remove CollegeCentre Branding");
      setUpgradeOpen(true);
      return;
    }

    setBrandingLoading(true);
    const result = await updateBrandingToggle(profile.id, checked);
    setBrandingLoading(false);

    if (!result.success) {
      toast({
        title: "Branding Update Failed",
        description: result.error || "Could not change branding preference.",
        variant: "error",
      });
      return;
    }

    setRemoveBranding(checked);
    toast({
      title: checked ? "Watermark Removed" : "Watermark Enabled",
      description: checked
        ? "CollegeCentre badge is now hidden on your public profile."
        : "CollegeCentre badge will appear in your profile footer.",
      variant: "default",
    });

    if (onProfileUpdated) {
      onProfileUpdated({
        ...profile,
        remove_branding: checked,
      });
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      await cancelSubscription(profile.id, true);
      toast({
        title: "Subscription Scheduled for Cancellation",
        description: "Your Pro perks remain active until the end of your current paid billing period.",
        variant: "default",
      });
      setCancelDialogOpen(false);
      await loadBillingData();
    } catch (err: any) {
      toast({
        title: "Cancellation Failed",
        description: err.message || "Unable to cancel subscription.",
        variant: "error",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setCancelLoading(true);
    try {
      await resumeSubscription(profile.id);
      toast({
        title: "Subscription Resumed",
        description: "Your Pro subscription will automatically renew at the end of the billing period.",
        variant: "default",
      });
      await loadBillingData();
    } catch (err: any) {
      toast({
        title: "Resume Failed",
        description: err.message || "Unable to resume subscription.",
        variant: "error",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSimulateFailure = async () => {
    setSimLoading(true);
    try {
      await simulatePaymentFailure(profile.id);
      toast({
        title: "Payment Failure Simulated",
        description: "Subscription status is now Past Due. Test retry recovery below.",
        variant: "warning",
      });
      await loadBillingData();
    } catch (err: any) {
      toast({ title: "Simulation Error", description: err.message, variant: "error" });
    } finally {
      setSimLoading(false);
    }
  };

  const handleSimulateRecovery = async () => {
    setSimLoading(true);
    try {
      await simulatePaymentRecovery(profile.id);
      toast({
        title: "Payment Recovered",
        description: "Subscription has been restored to Active status.",
        variant: "default",
      });
      await loadBillingData();
    } catch (err: any) {
      toast({ title: "Recovery Error", description: err.message, variant: "error" });
    } finally {
      setSimLoading(false);
    }
  };

  const isPro = entitlements?.isPro || false;
  const isPastDue = subscription?.status === "past_due";
  const isCancelingAtPeriodEnd = subscription?.cancel_at_period_end === true;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Settings & Subscription
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your showcase tier, personal custom domain, branding controls, and billing activity.
        </p>
      </div>

      {/* 2. Current Plan Overview Card */}
      <Card className="p-6 md:p-8 relative overflow-hidden border-border/80 shadow-xs">
        {isPro && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Current Plan
              </span>
              {isPro ? (
                <Badge
                  variant="default"
                  className="bg-indigo-600 hover:bg-indigo-600 text-white gap-1 px-2.5 py-0.5 text-xs font-semibold shadow-xs"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Pro Member</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs px-2.5 py-0.5">
                  Free Builder
                </Badge>
              )}

              {subscription && (
                <Badge
                  variant="outline"
                  className={
                    subscription.status === "active"
                      ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                      : subscription.status === "past_due"
                      ? "border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                      : "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                  }
                >
                  {subscription.status.toUpperCase()}
                </Badge>
              )}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              {isPro ? "CollegeCentre Pro" : "Free Forever Tier"}
            </h3>

            <p className="text-sm text-muted-foreground max-w-xl">
              {isPro
                ? isCancelingAtPeriodEnd
                  ? `Your Pro subscription is set to expire on ${new Date(
                      subscription?.current_period_end || ""
                    ).toLocaleDateString()}. You will revert to the Free tier after that date.`
                  : `Next billing date: ${new Date(
                      subscription?.current_period_end || ""
                    ).toLocaleDateString()} (${
                      subscription?.billing_interval === "yearly" ? "₹2,499 / year" : "₹299 / month"
                    }).`
                : "You are on the essential student plan. Upgrade anytime for personal custom domains, advanced analytics, and curated themes."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isPro ? (
              <Button
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
                onClick={() => {
                  setUpgradeFeature("CollegeCentre Pro");
                  setUpgradeOpen(true);
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : isCancelingAtPeriodEnd ? (
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleResumeSubscription}
                disabled={cancelLoading}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Resume Subscription</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
                onClick={() => setCancelDialogOpen(true)}
              >
                <span>Cancel Subscription</span>
              </Button>
            )}
          </div>
        </div>

        {/* Past Due Warning Alert */}
        {isPastDue && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                Payment failure detected. Your Pro perks are temporarily paused until payment is settled.
              </span>
            </div>
            <Button
              size="sm"
              variant="default"
              className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shrink-0"
              onClick={handleSimulateRecovery}
              disabled={simLoading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simLoading ? "animate-spin" : ""}`} />
              <span>Retry Payment</span>
            </Button>
          </div>
        )}

        {/* Feature comparison list for current tier */}
        <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {isPro ? "Unlimited technical projects" : "Up to 5 engineering projects"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{isPro ? "90-day & all-time traffic stats" : "7-day analytics overview"}</span>
          </div>
          <div className="flex items-center gap-2">
            {isPro ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            )}
            <span className={isPro ? "text-foreground font-medium" : ""}>
              Personal custom domain
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isPro ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            )}
            <span className={isPro ? "text-foreground font-medium" : ""}>
              Curated Pro themes
            </span>
          </div>
        </div>

        {/* Simulation Sandbox Controls (For Testing & Verification) */}
        {isPro && (
          <div className="mt-6 pt-4 border-t border-dashed border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <span className="font-medium text-foreground">
              Billing Sandbox Tools:
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={handleSimulateFailure}
                disabled={simLoading || isPastDue}
                className="text-xs"
              >
                Simulate Payment Failure
              </Button>
              {isPastDue && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleSimulateRecovery}
                  disabled={simLoading}
                  className="text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                >
                  Simulate Payment Recovery
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* 3. Custom Domain Configuration (Pro Gated) */}
      <Card className="p-6 md:p-8 space-y-5 border-border/80">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-foreground">
                Personal Custom Domain
              </h3>
              {!isPro && (
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-500 border-indigo-500/30">
                  Pro Feature
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Connect your own personal domain (e.g. <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">alexrivera.dev</code> or <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">portfolio.mydomain.com</code>) to make your showcase completely your own.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="e.g. alexrivera.dev"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              disabled={domainLoading}
              className="font-mono text-sm"
            />
          </div>
          <Button
            variant={isPro ? "default" : "outline"}
            onClick={handleSaveDomain}
            disabled={domainLoading}
            className={!isPro ? "gap-1.5 text-indigo-500 hover:text-indigo-600 border-indigo-500/30" : ""}
          >
            {!isPro && <Lock className="w-3.5 h-3.5" />}
            <span>{isPro ? "Save Domain" : "Unlock with Pro"}</span>
          </Button>
        </div>

        {/* DNS Configuration Helper instructions */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            DNS Configuration Instructions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Record Type</span>
              <span className="font-mono font-semibold text-foreground">CNAME</span>
            </div>
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Host / Name</span>
              <span className="font-mono font-semibold text-foreground">@ or portfolio</span>
            </div>
            <div className="p-2.5 rounded-lg bg-background border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Value / Target</span>
              <span className="font-mono font-semibold text-foreground">cname.collegecentre.in</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. White-label Showcase Branding Removal (Pro Gated) */}
      <Card className="p-6 md:p-8 space-y-4 border-border/80">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-foreground">
                White-label Profile
              </h3>
              {!isPro && (
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-500 border-indigo-500/30">
                  Pro Feature
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Hide the &quot;Powered by CollegeCentre&quot; badge from the footer of your public showcase page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={removeBranding}
              onCheckedChange={handleToggleBranding}
              disabled={brandingLoading}
            />
          </div>
        </div>
      </Card>

      {/* 5. Invoices & Billing Activity */}
      <Card className="p-6 md:p-8 space-y-4 border-border/80">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                Billing Activity & Invoices
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              A transparent record of every transaction, tier change, and renewal.
            </p>
          </div>
        </div>

        {billingEvents.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-xl">
            No billing transactions recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden bg-background">
            {billingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      evt.event_type === "payment.succeeded"
                        ? "bg-emerald-500"
                        : evt.event_type === "payment.failed"
                        ? "bg-rose-500"
                        : "bg-indigo-500"
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-foreground capitalize">
                      {evt.event_type.replace(".", " ")}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {evt.data?.amount ? `₹${evt.data.amount}` : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {evt.data?.invoice && (
                    <span className="font-mono text-[11px]">{evt.data.invoice}</span>
                  )}
                  <span>{new Date(evt.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        featureName={upgradeFeature}
        userId={profile.id}
        onSuccess={() => {
          toast({
            title: "Welcome to Pro!",
            description: "Your CollegeCentre Pro account is now active with full capabilities.",
            variant: "default",
          });
          loadBillingData();
        }}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel CollegeCentre Pro?"
        description="Are you sure you want to cancel? You will keep your Pro benefits until the end of your billing cycle. After that, custom domain and Pro themes will be paused."
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Pro"
        variant="destructive"
        isLoading={cancelLoading}
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
}
