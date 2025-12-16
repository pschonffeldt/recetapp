"use client";

import Link from "next/link";
import { setSupportSolved } from "@/app/lib/support/admin-actions";
import type { SupportInboxRow } from "@/app/lib/support/admin-data";
import { minutesToAgo } from "@/app/lib/utils/time";

function categoryPill(category: string) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  switch (category) {
    case "billing":
      return `${base} bg-amber-50 text-amber-800 border-amber-200`;
    case "bug":
      return `${base} bg-red-50 text-red-800 border-red-200`;
    case "feature":
      return `${base} bg-indigo-50 text-indigo-800 border-indigo-200`;
    case "account":
      return `${base} bg-emerald-50 text-emerald-800 border-emerald-200`;
    default:
      return `${base} bg-gray-50 text-gray-800 border-gray-200`;
  }
}

export default function SupportInboxTable({
  rows,
}: {
  rows: SupportInboxRow[];
}) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Subject</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Sent</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => {
            const isSolved = !!r.solved_at;
            return (
              <tr key={r.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                      isSolved
                        ? "bg-gray-50 text-gray-700 border-gray-200"
                        : "bg-blue-50 text-blue-700 border-blue-200",
                    ].join(" ")}
                  >
                    {isSolved ? "Solved" : "Unsolved"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className={categoryPill(r.category)}>{r.category}</span>
                </td>

                <td className="px-4 py-3 font-medium text-gray-900">
                  {r.subject}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  <div className="font-medium">{r.user_name ?? "—"}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  <div className="text-xs text-gray-500">
                    {minutesToAgo(r.minutes_ago)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/admin/support/${r.id}`}
                      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </Link>

                    <form action={setSupportSolved}>
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="solved"
                        value={String(!isSolved)}
                      />
                      <button
                        type="submit"
                        className={[
                          "rounded-md px-3 py-1.5 text-xs font-medium",
                          isSolved
                            ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            : "bg-blue-600 text-white hover:bg-blue-700",
                        ].join(" ")}
                      >
                        {isSolved ? "Mark unsolved" : "Mark solved"}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td
                className="px-4 py-10 text-center text-sm text-gray-600"
                colSpan={6}
              >
                No support messages yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
