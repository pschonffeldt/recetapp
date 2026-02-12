"use client";

import { Badge } from "../users/badge";

type OwnerValue = "owned" | "imported" | "other";

function normalizeOwner(input?: string | null): OwnerValue {
  const v = (input ?? "").trim().toLowerCase();
  if (v === "owned") return "owned";
  if (v === "imported") return "imported";
  return "other";
}

export default function OwnershipBadge({
  owner,
}: {
  owner: "owned" | "imported" | string | null | undefined;
}) {
  const value = normalizeOwner(owner);

  const cls =
    value === "owned"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : value === "imported"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-gray-50 text-gray-700";

  const label =
    value === "owned"
      ? "Created by you"
      : value === "imported"
        ? "Imported"
        : "—";

  return <Badge className={cls}>{label}</Badge>;
}
