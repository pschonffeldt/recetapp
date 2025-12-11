import type { MembershipTier } from "@/app/lib/types/definitions";

export const PLAN_LIMITS: Record<MembershipTier, number> = {
  free: 10,
  tier1: 50,
  tier2: 100,
};

export const PLAN_LABEL: Record<MembershipTier, string> = {
  free: "Free plan",
  tier1: "Tier 1",
  tier2: "Tier 2",
};

export const PLAN_PRICING: Record<MembershipTier, string> = {
  free: "$0 / month",
  tier1: "$5 / month",
  tier2: "$12 / month",
};

export function isMembershipTier(value: unknown): value is MembershipTier {
  return value === "free" || value === "tier1" || value === "tier2";
}
