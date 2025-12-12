import { clsx } from "clsx";

export default function RoleBadge({ role }: { role: "user" | "admin" }) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium";
  const admin = "border-purple-300 bg-purple-50 text-purple-700";
  const user = "border-gray-200 bg-gray-50 text-gray-700";

  return (
    <span className={clsx(base, role === "admin" ? admin : user)}>
      {role === "admin" ? "Admin" : "User"}
    </span>
  );
}
