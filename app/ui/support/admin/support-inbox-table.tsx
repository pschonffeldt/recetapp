"use client";

import type { SupportInboxRow } from "@/app/lib/support/admin-data";
import {
  supportCategoryLabel,
  supportCategoryPillClass,
  supportStatusLabel,
  supportStatusPillClass,
} from "@/app/lib/support/pills";
import { minutesToAgo, timeAgoFromIso } from "@/app/lib/utils/time";
import MarkSolvedButton from "@/app/ui/support/admin/mark-solved-button";
import Link from "next/link";

export default function SupportInboxTable({
  rows,
}: {
  rows: SupportInboxRow[];
}) {
  // ---------- Empty state ----------
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-600">
        No support messages yet.
      </div>
    );
  }

  return (
    <>
      {/* =========================
          Mobile: Cards
          ========================= */}
      <div className="md:hidden space-y-3">
        {rows.map((rows) => {
          const isSolved = rows.status === "solved";

          const solvedAgo =
            typeof rows.solved_minutes_ago === "number"
              ? minutesToAgo(rows.solved_minutes_ago)
              : rows.solved_at
                ? timeAgoFromIso(rows.solved_at)
                : null;

          return (
            <div
              key={rows.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* Top row: subject + pills */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {rows.subject}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {rows.user_name ?? "—"} · {rows.email}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className={supportStatusPillClass(isSolved)}>
                    {supportStatusLabel(isSolved)}
                  </span>
                  <span className={supportCategoryPillClass(rows.category)}>
                    {supportCategoryLabel(rows.category)}
                  </span>
                </div>
              </div>

              {/* Sent */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Sent
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {minutesToAgo(rows.minutes_ago)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(rows.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Resolution */}
                <div
                  className={[
                    "rounded-lg border p-3",
                    isSolved
                      ? "border-emerald-100 bg-emerald-50"
                      : "border-gray-100 bg-gray-50",
                  ].join(" ")}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Resolution
                  </p>

                  {!isSolved ? (
                    <p className="mt-2 text-xs font-medium text-gray-700">
                      Not solved yet
                    </p>
                  ) : (
                    <>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-emerald-800">
                          Solved
                        </p>
                        {solvedAgo ? (
                          <p className="text-xs font-medium text-emerald-700">
                            {solvedAgo}
                          </p>
                        ) : null}
                      </div>
                      {rows.solved_at ? (
                        <p className="mt-1 text-xs text-emerald-800/80">
                          {new Date(rows.solved_at).toLocaleString()}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <Link
                  href={`/admin/support/${rows.id}`}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </Link>

                <MarkSolvedButton id={rows.id} isSolved={isSolved} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================
          Desktop: Table
          ========================= */}
      <div className="hidden md:block rounded-md border border-gray-200 bg-white h-full">
        <div className="w-full h-full overflow-x-auto overflow-y-auto">
          <table className="min-w-[950px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Topic</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Sent</th>
                <th className="px-4 py-3 text-left">Resolution</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {rows.map((rows) => {
                const isSolved = rows.status === "solved";

                const solvedAgo =
                  typeof rows.solved_minutes_ago === "number"
                    ? minutesToAgo(rows.solved_minutes_ago)
                    : rows.solved_at
                      ? timeAgoFromIso(rows.solved_at)
                      : null;

                return (
                  <tr key={rows.id} className="hover:bg-gray-50/70">
                    {/* STATUS */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      <span className={supportStatusPillClass(isSolved)}>
                        {supportStatusLabel(isSolved)}
                      </span>
                    </td>

                    {/* CATEGORY */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      <span className={supportCategoryPillClass(rows.category)}>
                        {supportCategoryLabel(rows.category)}
                      </span>
                    </td>

                    {/* SUBJECT */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {" "}
                      {rows.subject}
                    </td>

                    {/* USER */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {" "}
                      <div className="font-medium">{rows.user_name ?? "—"}</div>
                      <div className="text-xs text-gray-500">{rows.email}</div>
                    </td>

                    {/* SENT */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {" "}
                      <div className="text-xs text-gray-500">
                        {minutesToAgo(rows.minutes_ago)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(rows.created_at).toLocaleString()}
                      </div>
                    </td>

                    {/* RESOLUTION */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {" "}
                      {!isSolved ? (
                        <div className="inline-flex items-center rounded-md border border-red-100 bg-red-50 px-2.5 py-2 text-xs font-medium text-gray-700">
                          Not solved yet
                        </div>
                      ) : (
                        (rows.solved_at ||
                          rows.solved_minutes_ago !== null) && (
                          <div className="rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1">
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

                            {rows.solved_at ? (
                              <div className="text-[11px] text-emerald-800/80">
                                Solved at:{" "}
                                {new Date(rows.solved_at).toLocaleString()}
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 align-middle">
                      {" "}
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/support/${rows.id}`}
                          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </Link>

                        <MarkSolvedButton
                          id={rows.id}
                          isSolved={isSolved}
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
