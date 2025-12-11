import Link from "next/link";
import clsx from "clsx";
import { formatDateToLocal } from "@/app/lib/utils/format";
import {
  fetchAdminUsers,
  type AdminUserListItem,
} from "@/app/lib/recipes/data";
import type { MembershipTier } from "@/app/lib/types/definitions";

function RoleBadge({ role }: { role: "user" | "admin" }) {
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

function MembershipBadge({ tier }: { tier: MembershipTier | null }) {
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

function RecipesSummaryCell({
  owned,
  imported,
  total,
}: {
  owned: number;
  imported: number;
  total: number;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{total}</span>
      <span className="text-xs text-gray-500">
        own {owned} · imported {imported}
      </span>
    </div>
  );
}

function ActivityCell({
  updated_at,
  password_changed_at,
  profile_updated_at,
}: {
  updated_at: string | null;
  password_changed_at: string | null;
  profile_updated_at: string | null;
}) {
  return (
    <div className="flex flex-col text-xs text-gray-500">
      <span>Updated: {updated_at ? formatDateToLocal(updated_at) : "—"}</span>
      <span>
        Password:{" "}
        {password_changed_at ? formatDateToLocal(password_changed_at) : "—"}
      </span>
      <span>
        Profile:{" "}
        {profile_updated_at ? formatDateToLocal(profile_updated_at) : "—"}
      </span>
    </div>
  );
}

export default async function AdminUsersTable() {
  const users = await fetchAdminUsers();
  const isEmpty = users.length === 0;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Desktop table */}
          <table className="mt-4 hidden w-full table-auto text-gray-900 md:table">
            <thead className="text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 sm:pl-6">User</th>
                <th className="px-3 py-5 font-medium">Email</th>
                <th className="px-3 py-5 font-medium">Country</th>
                <th className="px-3 py-5 font-medium">Language</th>
                <th className="px-3 py-5 font-medium">Membership</th>
                <th className="px-3 py-5 font-medium">Role</th>
                <th className="px-3 py-5 font-medium">Recipes</th>
                <th className="px-3 py-5 font-medium">Created</th>
                <th className="px-3 py-5 font-medium">Activity</th>
                <th className="px-3 py-5 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {isEmpty ? (
                // If no users :(
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  // If there are users :)
                  <tr
                    key={u.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    {/* User name + username */}
                    <td className="whitespace-normal py-3 pl-6 pr-3 align-middle">
                      <p className="font-medium">
                        {u.name} {u.last_name}
                      </p>
                      {u.user_name && (
                        <p className="text-xs text-gray-500">@{u.user_name}</p>
                      )}
                    </td>

                    {/* Email */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <span className="text-sm text-gray-700">{u.email}</span>
                    </td>

                    {/* Country */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {u.country ?? "—"}
                    </td>

                    {/* Language */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {u.language ?? "—"}
                    </td>

                    {/* Membership */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <MembershipBadge tier={u.membership_tier} />
                    </td>

                    {/* Role */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <RoleBadge role={u.user_role} />
                    </td>

                    {/* Recipes */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <RecipesSummaryCell
                        owned={u.owned_recipes_count}
                        imported={u.imported_recipes_count}
                        total={u.total_recipes_count}
                      />
                    </td>

                    {/* Created at */}
                    <td className="whitespace-nowrap px-3 py-3 text-gray-600 align-middle">
                      <time dateTime={u.created_at}>
                        {formatDateToLocal(u.created_at)}
                      </time>
                    </td>

                    {/* Activity */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <ActivityCell
                        updated_at={u.updated_at}
                        password_changed_at={u.password_changed_at}
                        profile_updated_at={u.profile_updated_at}
                      />
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap py-3 pl-3 pr-6 align-middle">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/users/${u.id}`}
                          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden">
            {isEmpty ? (
              // If no users :(
              <div className="w-full rounded-md bg-white p-4 text-gray-500">
                No users found.
              </div>
            ) : (
              users.map((u) => (
                // If there are users :)
                <div
                  key={u.id}
                  className="mb-2 w-full rounded-md bg-white p-4 text-sm"
                >
                  {/* Name + username + email */}
                  <p className="font-medium">
                    {u.name} {u.last_name}
                  </p>
                  {u.user_name && (
                    <p className="text-xs text-gray-500">@{u.user_name}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{u.email}</p>

                  {/* Badges: membership + role */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <MembershipBadge tier={u.membership_tier} />
                    <RoleBadge role={u.user_role} />
                  </div>

                  {/* Recipes summary */}
                  <p className="mt-2 text-xs text-gray-500">
                    Recipes:{" "}
                    <span className="font-semibold">
                      {u.total_recipes_count}
                    </span>{" "}
                    <span className="text-[11px] text-gray-500">
                      (own {u.owned_recipes_count} · imported{" "}
                      {u.imported_recipes_count})
                    </span>
                  </p>

                  {/* Activity snapshot */}
                  <div className="mt-1 space-y-0.5 text-[11px] text-gray-500">
                    <p>
                      Updated:{" "}
                      {u.updated_at ? formatDateToLocal(u.updated_at) : "—"}
                    </p>
                    <p>
                      Password:{" "}
                      {u.password_changed_at
                        ? formatDateToLocal(u.password_changed_at)
                        : "—"}
                    </p>
                    <p>
                      Profile:{" "}
                      {u.profile_updated_at
                        ? formatDateToLocal(u.profile_updated_at)
                        : "—"}
                    </p>
                  </div>

                  {/* Joined date */}
                  <p className="mt-2 text-xs text-gray-500">
                    Joined{" "}
                    <time dateTime={u.created_at}>
                      {formatDateToLocal(u.created_at)}
                    </time>
                  </p>

                  {/* Actions */}
                  <div className="mt-2 flex justify-end">
                    <Link
                      href={`/dashboard/admin/users/${u.id}`}
                      className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
