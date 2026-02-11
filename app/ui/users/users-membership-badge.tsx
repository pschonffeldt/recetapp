import { MembershipTier } from "@/app/lib/types/definitions";
import { Badge, BadgeMuted } from "./badge";

type MembershipValue = "free" | "tier1" | "tier2" | "other";

function normalizeTier(input?: MembershipTier | null): MembershipValue {
  if (!input) return "other";
  if (input === "free" || input === "tier1" || input === "tier2") return input;
  return "other";
}

export default function MembershipBadge({
  tier,
}: {
  tier: MembershipTier | null;
}) {
  const value = normalizeTier(tier);

  if (value === "other") return <BadgeMuted>Not set</BadgeMuted>;

  const label =
    value === "free" ? "Free" : value === "tier1" ? "Tier 1" : "Tier 2";

  const cls =
    value === "free"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-indigo-200 bg-indigo-50 text-indigo-700";

  return <Badge className={cls}>{label}</Badge>;
}
