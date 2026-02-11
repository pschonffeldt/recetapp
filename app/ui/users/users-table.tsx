import { fetchAdminUsers } from "@/app/lib/recipes/data";
import { formatDate, formatDateTime } from "@/app/lib/utils/format-date";
import Link from "next/link";
import RecipesSummaryCell from "./user-recipes-summary-cell";
import ActivityCell from "./users-activity-cell";
import CountryBadge from "./users-country-badge";
import LanguageBadge from "./users-language-badge";
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
          users.map((users) => (
            <div
              key={users.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="font-medium">
                {users.name} {users.last_name}
              </p>
              {users.user_name && (
                <p className="text-xs text-gray-500">@{users.user_name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{users.email}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                <MembershipBadge tier={users.membership_tier} />
                <RoleBadge role={users.user_role} />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Recipes:{" "}
                <span className="font-semibold">
                  {users.total_recipes_count}
                </span>{" "}
                <span className="text-[11px] text-gray-500">
                  (own {users.owned_recipes_count} · imported{" "}
                  {users.imported_recipes_count})
                </span>
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Joined{" "}
                <time dateTime={users.created_at}>
                  {formatDate(users.created_at)}
                </time>
              </p>

              <div className="mt-1 space-y-0.5 text-[11px] text-gray-500">
                <p>
                  Updated:{" "}
                  {users.updated_at ? formatDateTime(users.updated_at) : "—"}
                </p>
                <p>
                  Password:{" "}
                  {users.password_changed_at
                    ? formatDateTime(users.password_changed_at)
                    : "—"}
                </p>
                <p>
                  Profile:{" "}
                  {users.profile_updated_at
                    ? formatDateTime(users.profile_updated_at)
                    : "—"}
                </p>
                <p>
                  Last login:{" "}
                  {users.last_login_at
                    ? formatDateTime(users.last_login_at)
                    : "—"}
                </p>
              </div>

              <div className="mt-2 flex justify-end">
                <Link
                  href={`/admin/users/${users.id}`}
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
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Language</th>
                <th className="px-4 py-3 text-left">Membership</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Recipes</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isEmpty ? (
                <tr className="hover:bg-gray-50/70">
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((users) => (
                  <tr key={users.id} className="hover:bg-gray-50/70">
                    {/* USER */}
                    <td className="whitespace-normal py-3 pl-6 pr-3 align-middle text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {users.name} {users.last_name}
                      </p>
                      {users.user_name && (
                        <p className="text-xs text-gray-500">
                          @{users.user_name}
                        </p>
                      )}
                    </td>

                    {/* EMAIL */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      {users.email}
                    </td>

                    {/* COUNTRY */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      {/* {users.country ?? "—"} */}
                      <CountryBadge country={users.country} />
                    </td>

                    {/* LANGUAGE */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      {/* {users.language ?? "—"} */}
                      <LanguageBadge language={users.language} />
                    </td>

                    {/* MEMBERSHIP */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      <MembershipBadge tier={users.membership_tier} />
                    </td>

                    {/* ROLE */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      <RoleBadge role={users.user_role} />
                    </td>

                    {/* RECIPES */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      <RecipesSummaryCell
                        owned={users.owned_recipes_count}
                        imported={users.imported_recipes_count}
                        total={users.total_recipes_count}
                      />
                    </td>

                    {/* JOINED */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      <div className="text-xs text-gray-500">
                        {formatDate(users.created_at)}
                      </div>
                    </td>

                    {/* ACTIVITY */}
                    <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                      <ActivityCell
                        updated_at={users.updated_at}
                        password_changed_at={users.password_changed_at}
                        last_login_at={users.last_login_at}
                      />
                    </td>

                    {/* ACTIONS */}
                    <td className="whitespace-nowrap py-3 pl-3 pr-6 align-middle text-sm text-gray-600">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${users.id}`}
                          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
