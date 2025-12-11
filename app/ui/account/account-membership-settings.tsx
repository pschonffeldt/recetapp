"use client";

import { useState } from "react";
import type { UserForm, MembershipTier } from "@/app/lib/types/definitions";
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
  free: `Great for getting started and trying RecetApp with up to ${PLAN_LIMITS.free} recipes.`,
  tier1: `For more serious cooking: more space for your recipes and imports (up to ${PLAN_LIMITS.tier1} recipes).`,
  tier2: `For power users and meal planners: even more room for your recipes and imports (up to ${PLAN_LIMITS.tier2} recipes).`,
};

export default function EditAccountMembershipForm({
  user,
  libraryCount,
}: Props) {
  const currentTier: MembershipTier =
    (user.membership_tier as MembershipTier) ?? "free";

  // What the user is previewing / targeting
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(currentTier);

  // Current plan (pill)
  const currentLabel = PLAN_LABEL[currentTier];
  const currentMax = PLAN_LIMITS[currentTier];

  const pillClass =
    currentTier === "free"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-indigo-50 text-indigo-700 border-indigo-200";

  // Selected/previewed plan (context box)
  const selectedLabel = PLAN_LABEL[selectedTier];
  const selectedMax = PLAN_LIMITS[selectedTier];
  const selectedHelp = PLAN_HELP[selectedTier];

  const viewingCurrent = selectedTier === currentTier;

  // Allowed targets
  const upgradeOptions: MembershipTier[] =
    currentTier === "free" ? ["free", "tier1", "tier2"] : ["tier1", "tier2"];

  const canUpgrade =
    selectedTier !== currentTier && upgradeOptions.includes(selectedTier);

  const handleUpgradeClick = () => {
    if (!canUpgrade) return;
    // TODO: hook into Stripe / checkout / billing flow
    console.log("Upgrade flow would start for plan:", selectedTier);
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
            will change and start the upgrade.
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
            Changing this will update the plan details above. The upgrade only
            starts after you click{" "}
            <span className="font-semibold">Upgrade plan</span>.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleUpgradeClick}
          disabled={!canUpgrade}
        >
          Upgrade plan
        </Button>
      </div>
    </section>
  );
}
