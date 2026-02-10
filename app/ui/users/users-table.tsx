import { fetchAdminUsers } from "@/app/lib/recipes/data";
import { formatDate, formatDateTime } from "@/app/lib/utils/format-date";
import Link from "next/link";
import RecipesSummaryCell from "./user-recipes-summary-cell";
import ActivityCell from "./users-activity-cell";
import MembershipBadge from "./users-membership-badge";
import RoleBadge from "./users-role-badge";

export default async function AdminUsersTable() {
  const users = await fetchAdminUsers();
  const isEmpty = users.length === 0;

  return (
    <>
      {/* =========================
          Mobile: Cards
         ========================= */}
      <div className="md:hidden p-4 space-y-3">
        {isEmpty ? (
          <div className="w-full rounded-md border border-gray-200 bg-white p-4 text-gray-500">
            No users found.
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="font-medium">
                {u.name} {u.last_name}
              </p>
              {u.user_name && (
                <p className="text-xs text-gray-500">@{u.user_name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{u.email}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                <MembershipBadge tier={u.membership_tier} />
                <RoleBadge role={u.user_role} />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Recipes:{" "}
                <span className="font-semibold">{u.total_recipes_count}</span>{" "}
                <span className="text-[11px] text-gray-500">
                  (own {u.owned_recipes_count} · imported{" "}
                  {u.imported_recipes_count})
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Joined{" "}
                <time dateTime={u.created_at}>{formatDate(u.created_at)}</time>
              </p>

              <div className="mt-1 space-y-0.5 text-[11px] text-gray-500">
                <p>
                  Updated: {u.updated_at ? formatDateTime(u.updated_at) : "—"}
                </p>
                <p>
                  Password:{" "}
                  {u.password_changed_at
                    ? formatDateTime(u.password_changed_at)
                    : "—"}
                </p>
                <p>
                  Profile:{" "}
                  {u.profile_updated_at
                    ? formatDateTime(u.profile_updated_at)
                    : "—"}
                </p>
                <p>
                  Last login:{" "}
                  {u.last_login_at ? formatDateTime(u.last_login_at) : "—"}
                </p>
              </div>

              <div className="mt-2 flex justify-end">
                <Link
                  href={`/admin/users/${u.id}`}
                  className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================
          Desktop: Table
         ========================= */}
      <div className="hidden md:block rounded-md border border-gray-200 bg-white h-full">
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <table className="min-w-[950px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
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
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none"
                  >
                    <td className="whitespace-normal py-3 pl-6 pr-3 align-middle">
                      <p className="font-medium">
                        {u.name} {u.last_name}
                      </p>
                      {u.user_name && (
                        <p className="text-xs text-gray-500">@{u.user_name}</p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <span className="text-sm text-gray-700">{u.email}</span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {u.country ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {u.language ?? "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <MembershipBadge tier={u.membership_tier} />
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <RoleBadge role={u.user_role} />
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <RecipesSummaryCell
                        owned={u.owned_recipes_count}
                        imported={u.imported_recipes_count}
                        total={u.total_recipes_count}
                      />
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-gray-600 align-middle">
                      <time dateTime={u.created_at}>
                        {formatDate(u.created_at)}
                      </time>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 align-middle">
                      <ActivityCell
                        updated_at={u.updated_at}
                        password_changed_at={u.password_changed_at}
                        last_login_at={u.last_login_at}
                      />
                    </td>

                    <td className="whitespace-nowrap py-3 pl-3 pr-6 align-middle">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${u.id}`}
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
        </div>
      </div>
    </>
  );
}
