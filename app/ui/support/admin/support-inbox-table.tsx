"use client";

import Link from "next/link";
import type { SupportInboxRow } from "@/app/lib/support/admin-data";
import { minutesToAgo, timeAgoFromIso } from "@/app/lib/utils/time";
import {
  supportCategoryLabel,
  supportCategoryPillClass,
  supportStatusLabel,
  supportStatusPillClass,
} from "@/app/lib/support/pills";
import MarkSolvedButton from "@/app/ui/support/admin/mark-solved-button";

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
            // ✅ status is the source of truth now
            const isSolved = r.status === "solved";

            // ✅ prefer minutes-from-query, fallback to solved_at
            const solvedAgo =
              typeof r.solved_minutes_ago === "number"
                ? minutesToAgo(r.solved_minutes_ago)
                : r.solved_at
                ? timeAgoFromIso(r.solved_at)
                : null;

            return (
              <tr key={r.id} className="hover:bg-gray-50/70">
                {/* STATUS */}
                <td className="px-4 py-3">
                  <span className={supportStatusPillClass(isSolved)}>
                    {supportStatusLabel(isSolved)}
                  </span>
                </td>

                {/* CATEGORY */}
                <td className="px-4 py-3">
                  <span className={supportCategoryPillClass(r.category)}>
                    {supportCategoryLabel(r.category)}
                  </span>
                </td>

                {/* SUBJECT */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {r.subject}
                </td>

                {/* USER */}
                <td className="px-4 py-3 text-gray-700">
                  <div className="font-medium">{r.user_name ?? "—"}</div>
                  <div className="text-xs text-gray-500">{r.email}</div>
                </td>

                {/* SENT + SOLVED */}
                <td className="px-4 py-3 text-gray-700">
                  <div className="text-xs text-gray-500">
                    {minutesToAgo(r.minutes_ago)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                  </div>

                  {isSolved &&
                    (r.solved_at || r.solved_minutes_ago !== null) && (
                      <div className="mt-2 rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-emerald-800">
                            Solved
                          </span>
                          {solvedAgo ? (
                            <span className="text-xs font-medium text-emerald-700">
                              {solvedAgo}
                            </span>
                          ) : null}
                        </div>

                        {r.solved_at ? (
                          <div className="mt-1 text-[11px] text-emerald-800/80">
                            {new Date(r.solved_at).toLocaleString()}
                          </div>
                        ) : null}
                      </div>
                    )}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/admin/support/${r.id}`}
                      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </Link>

                    <MarkSolvedButton id={r.id} isSolved={isSolved} size="sm" />
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
