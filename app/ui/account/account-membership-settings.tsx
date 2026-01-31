"use client";

import { PLAN_PRICING } from "@/app/lib/membership/plans";
import type { MembershipTier, UserForm } from "@/app/lib/types/definitions";
import { APP } from "@/app/lib/utils/app";
import { useToast } from "@/app/ui/toast/toast-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { inter } from "../branding/branding-fonts";
import { Button } from "../general/button";

type Props = {
  user: UserForm;
  libraryCount: number;
};

const PLAN_LIMITS: Record<MembershipTier, number> = {
  free: 10,
  tier1: 50,
  tier2: 100,
};

const PLAN_LABEL: Record<MembershipTier, string> = {
  free: "Free plan",
  tier1: "Tier 1",
  tier2: "Tier 2",
};

const PLAN_HELP: Record<MembershipTier, string> = {
  free: `Great for getting started and trying ${APP.legalName} with up to ${PLAN_LIMITS.free} recipes (${PLAN_PRICING.free}).`,
  tier1: `For more serious cooking: more space for your recipes and imports (up to ${PLAN_LIMITS.tier1} recipes) for ${PLAN_PRICING.tier1}.`,
  tier2: `For power users and meal planners: even more room for your recipes and imports (up to ${PLAN_LIMITS.tier2} recipes) for ${PLAN_PRICING.tier2}.`,
};

// Used to compare which tier is “higher”
const PLAN_ORDER: MembershipTier[] = ["free", "tier1", "tier2"];

export default function EditAccountMembershipForm({
  user,
  libraryCount,
}: Props) {
  const router = useRouter();
  const { push } = useToast();

  const currentTier: MembershipTier =
    (user.membership_tier as MembershipTier) ?? "free";

  // Tier currently being previewed / targeted
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(currentTier);

  // Current plan pill
  const currentLabel = PLAN_LABEL[currentTier];
  const currentMax = PLAN_LIMITS[currentTier];

  const pillClass =
    currentTier === "free"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-indigo-50 text-indigo-700 border-indigo-200";

  // Selected / preview plan
  const selectedLabel = PLAN_LABEL[selectedTier];
  const selectedMax = PLAN_LIMITS[selectedTier];
  const selectedHelp = PLAN_HELP[selectedTier];

  const viewingCurrent = selectedTier === currentTier;

  const currentIndex = PLAN_ORDER.indexOf(currentTier);
  const selectedIndex = PLAN_ORDER.indexOf(selectedTier);

  const isDowngrade = currentTier !== "free" && selectedIndex < currentIndex; // paid → lower
  const isUpgrade = selectedIndex > currentIndex;

  const ctaLabel = isDowngrade ? "Downgrade plan" : "Upgrade plan";

  // All selectable plans (we’ll decide what to do on click)
  const upgradeOptions: MembershipTier[] = ["free", "tier1", "tier2"];

  const handleUpgradeClick = () => {
    const currentIndex = PLAN_ORDER.indexOf(currentTier);
    const selectedIndex = PLAN_ORDER.indexOf(selectedTier);

    // Same plan → just show a gentle warning
    if (selectedIndex === currentIndex) {
      push({
        variant: "warning",
        title: "Already on this plan",
        message: "Select a higher tier to upgrade your membership.",
      });
      return;
    }

    // Lower plan → future downgrade flow
    if (selectedIndex < currentIndex) {
      push({
        variant: "info",
        title: "Downgrade not available yet",
        message:
          "Downgrades will be handled in a dedicated flow in a future update.",
      });
      return;
    }

    // Safety check: don’t let them pick a plan that can't fit their current library
    if (libraryCount > selectedMax) {
      push({
        variant: "error",
        title: "Plan limit exceeded",
        message: `You currently have ${libraryCount} recipes, but ${PLAN_LABEL[selectedTier]} allows up to ${selectedMax}.`,
      });
      return;
    }

    // Upgrade → go to payment page, passing from/to tiers
    router.push(
      `/payments/membership-payment?from=${currentTier}&to=${selectedTier}`,
    );
  };

  return (
    <section className="mt-6 rounded-md bg-gray-50 p-4 md:p-6">
      <h2 className={`${inter.className} mb-2 text-xl md:text-2xl`}>
        Membership
      </h2>

      {/* Current plan pill */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-600">Current plan:</span>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${pillClass}`}
        >
          {currentLabel}
        </span>
        <span className="text-xs text-gray-500">
          (up to {currentMax} recipes)
        </span>
      </div>

      {/* Context / preview box – driven by selectedTier */}
      <div className="mt-2 rounded-md border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
        <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
          {viewingCurrent ? "Current plan details" : "Selected plan preview"}
        </p>

        <p className="font-medium">{selectedLabel}</p>
        <p className="mt-1">{selectedHelp}</p>

        <p className="mt-2">
          You currently have{" "}
          <span className="font-semibold">{libraryCount}</span> recipes in your
          library (including your own recipes and imported ones).
        </p>

        <p className="mt-1">
          This plan allows up to{" "}
          <span className="font-semibold">{selectedMax}</span> recipes.
        </p>

        {!viewingCurrent && (
          <p className="mt-2 text-gray-600">
            You&apos;d be moving from{" "}
            <span className="font-semibold">
              {PLAN_LABEL[currentTier]} (up to {currentMax})
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {selectedLabel} (up to {selectedMax})
            </span>
            .
          </p>
        )}

        {libraryCount > selectedMax && (
          <p className="mt-2 text-sm font-medium text-red-600">
            Note: you currently have more recipes than this plan allows. You
            would need to reduce your library below {selectedMax} recipes to
            switch to this plan.
          </p>
        )}

        {viewingCurrent && currentTier === "free" && (
          <p className="mt-2 text-gray-600">
            When you&apos;re ready, select a higher tier to see how your limits
            will change and start the upgrade flow.
          </p>
        )}
      </div>

      {/* Plan selector + CTA */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label
            htmlFor="targetPlan"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Choose plan to preview / upgrade
          </label>
          <select
            id="targetPlan"
            className="block w-full max-w-xs rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as MembershipTier)}
          >
            {upgradeOptions.map((tier) => (
              <option key={tier} value={tier}>
                {PLAN_LABEL[tier]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Changing this will update the plan details above. The actual switch
            only starts after you click{" "}
            <span className="font-semibold">{ctaLabel}</span>.
          </p>
        </div>

        <Button type="button" onClick={handleUpgradeClick}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
