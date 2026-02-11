"use client";

import { formatDate } from "@/app/lib/utils/format-date";
import Link from "next/link";
import RecipesSummaryCell from "./user-recipes-summary-cell";
import ActivityCell from "./users-activity-cell";
import CountryBadge from "./users-country-badge";
import LanguageBadge from "./users-language-badge";
import MembershipBadge from "./users-membership-badge";
import RoleBadge from "./users-role-badge";
import { AdminUserListItem } from "@/app/lib/users/data";

export default function AdminUsersTableView({
  users,
}: {
  users: AdminUserListItem[];
}) {
  const isEmpty = users.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-md border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-600">
        No users found.
      </div>
    );
  }

  return (
    <>
      {/* =========================
          Mobile: Cards
         ========================= */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-medium">
              {user.name} {user.last_name}
            </p>
            {user.user_name ? (
              <p className="text-xs text-gray-500">@{user.user_name}</p>
            ) : null}
            <p className="mt-1 text-xs text-gray-500">{user.email}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              <MembershipBadge tier={user.membership_tier} />
              <RoleBadge role={user.user_role} />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Recipes:{" "}
              <span className="font-semibold">{user.total_recipes_count}</span>{" "}
              <span className="text-[11px] text-gray-500">
                (own {user.owned_recipes_count} · imported{" "}
                {user.imported_recipes_count})
              </span>
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Joined{" "}
              <time dateTime={user.created_at}>
                {formatDate(user.created_at)}
              </time>
            </p>

            <div className="mt-1 space-y-0.5 text-[11px] text-gray-500">
              <ActivityCell
                updated_at={user.updated_at}
                password_changed_at={user.password_changed_at}
                last_login_at={user.last_login_at}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <Link
                href={`/admin/users/${user.id}`}
                className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70">
                  {/* USER */}
                  <td className="whitespace-normal py-3 pl-6 pr-3 align-middle">
                    <p className="font-medium text-gray-900">
                      {user.name} {user.last_name}
                    </p>
                    {user.user_name ? (
                      <p className="text-xs text-gray-500">@{user.user_name}</p>
                    ) : null}
                  </td>

                  {/* EMAIL */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle text-sm text-gray-600">
                    {user.email}
                  </td>

                  {/* COUNTRY */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <CountryBadge country={user.country} />
                  </td>

                  {/* LANGUAGE */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <LanguageBadge language={user.language} />
                  </td>

                  {/* MEMBERSHIP */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <MembershipBadge tier={user.membership_tier} />
                  </td>

                  {/* ROLE */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <RoleBadge role={user.user_role} />
                  </td>

                  {/* RECIPES */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <RecipesSummaryCell
                      owned={user.owned_recipes_count}
                      imported={user.imported_recipes_count}
                      total={user.total_recipes_count}
                    />
                  </td>

                  {/* JOINED */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <div className="text-xs text-gray-500">
                      {formatDate(user.created_at)}
                    </div>
                  </td>

                  {/* ACTIVITY */}
                  <td className="whitespace-nowrap px-3 py-3 align-middle">
                    <ActivityCell
                      updated_at={user.updated_at}
                      password_changed_at={user.password_changed_at}
                      last_login_at={user.last_login_at}
                    />
                  </td>

                  {/* ACTIONS */}
                  <td className="whitespace-nowrap py-3 pl-3 pr-6 align-middle">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
