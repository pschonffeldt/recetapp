"use client";

import Link from "next/link";
import { useActionState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/app/lib/actions";
import type { AppNotification } from "@/app/lib/definitions";

type Props = {
  items: AppNotification[];
  total: number;
  page: number;
  pageSize: number;
};

export default function NotificationsList({
  items,
  total,
  page,
  pageSize,
}: Props) {
  const [oneState, markOne] = useActionState(
    markNotificationRead as any,
    {
      ok: false,
      message: null,
    } as any
  );

  const [allState, markAll] = useActionState(
    markAllNotificationsRead as any,
    {
      ok: false,
      message: null,
    } as any
  );

  // --- Pagination helpers (URLSearchParams) ---
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const hrefForPage = (p: number) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.set("page", String(p));
    // keep any existing filters like ?only=…&status=…
    return `${pathname}?${sp.toString()}`;
  };

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your notifications</h2>

        <form action={markAll}>
          <button
            className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black/80 disabled:opacity-50"
            type="submit"
            aria-disabled={allState?.pending}
            disabled={allState?.pending}
          >
            {allState?.pending ? "Marking…" : "Mark all as read"}
          </button>
        </form>
      </div>

      <ul className="space-y-3">
        {items.map((n) => {
          const isBroadcast = n.userId == null;
          const isUnread = n.status === "unread" && !isBroadcast;

          return (
            <li key={n.id} className="rounded-md border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase tracking-wide text-gray-500">
                      {n.kind}
                    </span>

                    {isUnread && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                        Unread
                      </span>
                    )}

                    {isBroadcast && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">
                        Broadcast
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 text-lg font-semibold">{n.title}</h3>

                  <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                    {n.body}
                  </p>

                  {n.linkUrl && (
                    <a
                      href={n.linkUrl}
                      className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Learn more →
                    </a>
                  )}
                </div>

                {/* Mark read button: only for personal notifications */}
                {!isBroadcast && isUnread && (
                  <form action={markOne} className="shrink-0">
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
                      type="submit"
                      aria-disabled={oneState?.pending}
                      disabled={oneState?.pending}
                    >
                      {oneState?.pending ? "Marking…" : "Mark read"}
                    </button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total
        </p>
        <div className="flex gap-2">
          <Link
            prefetch={false}
            aria-disabled={prevDisabled}
            tabIndex={prevDisabled ? -1 : 0}
            href={prevDisabled ? "#" : hrefForPage(page - 1)}
            className={`rounded-md border px-3 py-2 text-sm ${
              prevDisabled
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            ← Previous
          </Link>
          <Link
            prefetch={false}
            aria-disabled={nextDisabled}
            tabIndex={nextDisabled ? -1 : 0}
            href={nextDisabled ? "#" : hrefForPage(page + 1)}
            className={`rounded-md border px-3 py-2 text-sm ${
              nextDisabled
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}
