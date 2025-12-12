import Link from "next/link";
import { formatDateToLocal } from "@/app/lib/utils/format";
import { fetchAdminUsers } from "@/app/lib/recipes/data";
import ActivityCell from "./users-activity-cell";
import RecipesSummaryCell from "./user-recipes-summary-cell";
import MembershipBadge from "./users-membership-badge";
import RoleBadge from "./users-role-badge";

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
                <th className="px-3 py-5 font-medium">Joined</th>
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

                    {/* Joined */}
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
                        last_login_at={u.last_login_at}
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

                  {/* Joined date */}
                  <p className="mt-2 text-xs text-gray-500">
                    Joined{" "}
                    <time dateTime={u.created_at}>
                      {formatDateToLocal(u.created_at)}
                    </time>
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
                    <p>
                      Last login:{" "}
                      {u.last_login_at
                        ? formatDateToLocal(u.last_login_at)
                        : "—"}
                    </p>
                  </div>

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
