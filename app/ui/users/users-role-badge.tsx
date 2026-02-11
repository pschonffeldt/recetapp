import { Badge } from "./badge";

type RoleValue = "admin" | "user" | "other";

function normalizeRole(input?: string | null): RoleValue {
  const r = (input ?? "").trim().toLowerCase();
  if (r === "admin") return "admin";
  if (r === "user") return "user";
  return "other";
}

export default function RoleBadge({ role }: { role?: string | null }) {
  const value = normalizeRole(role);

  const cls =
    value === "admin"
      ? "border-purple-300 bg-purple-50 text-purple-700"
      : value === "user"
        ? "border-gray-200 bg-gray-50 text-gray-700"
        : "border-gray-200 bg-gray-50 text-gray-700";

  const label =
    value === "other" ? "Other" : value === "admin" ? "Admin" : "User";

  return <Badge className={cls}>{label}</Badge>;
}
