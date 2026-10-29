"use client";

import React, { useState } from "react";
import { Check, Sparkles, X, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { upgradeToPro } from "@/lib/billing-service";
import type { BillingInterval } from "@/types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  userId?: string;
  onSuccess?: () => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
  featureName,
  userId,
  onSuccess,
}: UpgradeModalProps) {
  const [interval, setInterval] = useState<BillingInterval>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!userId) {
      setError("Please log in to upgrade your account.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await upgradeToPro(userId, interval);
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to initiate upgrade. Please try again.");
      setLoading(false);
    }
  };

  const proPerks = [
    "Connect your personal custom domain (alexrivera.dev)",
    "Unlock curated Pro themes (Creative, Cobalt, Obsidian, Terminal)",
    "Bespoke accent colors & profile layout variations",
    "Full 90-day & all-time traffic analytics with referrers",
    "Remove CollegeCentre footer watermark",
    "Unlimited projects, achievements & certificates",
    "Verified Pro badge across public showcase & campus directory",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Close upgrade dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            CollegeCentre Pro
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {featureName ? `Unlock ${featureName}` : "Elevate Your Engineering Showcase"}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Professional tools, personal branding, and verified credibility for serious builders.
        </p>

        {/* Interval Selector */}
        <div className="mt-5 flex items-center justify-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
              interval === "monthly"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            Monthly (₹299/mo)
          </button>
          <button
            type="button"
            onClick={() => setInterval("yearly")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5 ${
              interval === "yearly"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            <span>Annual (₹2,499/yr)</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              SAVE 30%
            </span>
          </button>
        </div>

        {/* Feature List */}
        <div className="mt-5 space-y-2.5">
          {proPerks.map((perk, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
              <div className="mt-0.5 rounded-full p-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{perk}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={handleUpgrade}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activating Pro...</span>
              </>
            ) : (
              <>
                <span>
                  Upgrade to Pro &bull; {interval === "yearly" ? "₹2,499 / year" : "₹299 / month"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cancel anytime with 1 click &bull; Keep free features forever</span>
          </div>
        </div>
      </div>
    </div>
  );
}
