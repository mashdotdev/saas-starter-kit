"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

interface BillingClientProps {
  plan: string;
  orgId: string;
  hasSubscription: boolean;
}

export default function BillingClient({
  plan,
  orgId,
  hasSubscription,
}: BillingClientProps) {
  const [loading, setLoading] = useState(false);

  const checkout = trpc.billing.checkout.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  const portal = trpc.billing.portal.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  async function handleUpgrade() {
    if (!orgId) return;
    setLoading(true);
    try {
      await checkout.mutateAsync({ orgId });
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    if (!orgId) return;
    setLoading(true);
    try {
      await portal.mutateAsync({ orgId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="rounded-lg border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Current plan
            </p>
            <p className="text-xl font-heading uppercase text-white tracking-tight">
              {plan}
            </p>
          </div>
          <span
            className={cn(
              "text-xs px-2.5 py-1 rounded-full font-mono uppercase tracking-wider",
              plan === "pro"
                ? "bg-brand-orange/20 text-brand-orange"
                : "bg-white/10 text-white/50",
            )}
          >
            {plan === "pro" ? "Active" : "Free tier"}
          </span>
        </div>

        {plan === "free" && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-sm text-white/50 mb-4">
              Upgrade to Pro for unlimited AI requests, priority support, and
              advanced features.
            </p>
            <button
              onClick={handleUpgrade}
              disabled={loading || !orgId}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wider",
                "bg-brand-orange text-white transition-opacity",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {loading ? "Loading…" : "Upgrade to Pro"}
            </button>
          </div>
        )}

        {plan !== "free" && hasSubscription && (
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={handlePortal}
              disabled={loading}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium border border-white/20",
                "text-white/70 hover:text-white hover:border-white/40 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {loading ? "Loading…" : "Manage subscription"}
            </button>
          </div>
        )}
      </div>

      {!orgId && (
        <p className="text-xs text-white/30">
          No organization found. Create one to manage billing.
        </p>
      )}
    </div>
  );
}
