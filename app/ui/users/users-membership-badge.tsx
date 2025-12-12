import { MembershipTier } from "@/app/lib/types/definitions";
import clsx from "clsx";

export default function MembershipBadge({
  tier,
}: {
  tier: MembershipTier | null;
}) {
  if (!tier) {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500">
        Not set
      </span>
    );
  }

  const label =
    tier === "free" ? "Free" : tier === "tier1" ? "Tier 1" : "Tier 2";

  const cls =
    tier === "free"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-indigo-200 bg-indigo-50 text-indigo-700";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        cls
      )}
    >
      {label}
    </span>
  );
}
