"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";

import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/lib/notifications/actions";
import type { AppNotification } from "@/app/lib/types/definitions";
import { capitalizeFirst } from "@/app/lib/utils/format";
import { formatDateTime } from "@/app/lib/utils/format-date";
import { Button } from "../general/button";

/* =============================================================================
 * Client-only date formatter (prevents hydration mismatch)
 * =============================================================================
 */

function useClientDateTime(value?: string | null) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!value) {
      setText("");
      return;
    }

    const formatted = formatDateTime(value); // client-only formatting
    setText(formatted || "");
  }, [value]);

  return text;
}

function ReceivedAt({ iso }: { iso?: string | null }) {
  const txt = useClientDateTime(iso);

  // Server renders "", client fills in after mount. No mismatch.
  if (!iso) return null;

  return (
    <p className="mt-2 text-xs text-gray-500" suppressHydrationWarning>
      Received {txt || "—"}
    </p>
  );
}

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
    } as any,
  );

  const [allState, markAll] = useActionState(
    markAllNotificationsRead as any,
    {
      ok: false,
      message: null,
    } as any,
  );

  // true if there is at least one unread notification
  const hasUnread = useMemo(
    () => items.some((n) => n.status === "unread"),
    [items],
  );

  // --- Pagination helpers (URLSearchParams) ---
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const hrefForPage = (p: number) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.set("page", String(p));
    return `${pathname}?${sp.toString()}`;
  };

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Your notifications</h2>

        <form action={markAll}>
          <Button
            className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
            type="submit"
            aria-disabled={!hasUnread || allState?.pending}
            disabled={!hasUnread || allState?.pending}
          >
            {allState?.pending ? "Marking…" : "Mark all as read"}
          </Button>
        </form>
      </div>

      {/* Notification list mapper */}
      <ul className="space-y-4">
        {items.map((n) => {
          const isBroadcast = n.userId == null;
          const isUnread = n.status === "unread" && !isBroadcast;

          const receivedIso = (n as any).publishedAt ?? (n as any).createdAt;

          return (
            <li key={n.id} className="rounded-md border bg-white p-4">
              {/* Message / notification container */}
              <div className="flex items-start gap-3">
                {/* Message / notification content */}
                <div className="flex-1">
                  {/* Kind of message / notification */}
                  <div className="flex w-full items-end gap-2">
                    <span className="text-sm tracking-wide text-gray-500">
                      Notification type:
                    </span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-black">
                      {capitalizeFirst(n.kind)}
                    </span>

                    <div className="ml-auto flex items-center gap-2">
                      {isUnread && (
                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex flex-row gap-1 text-lg font-semibold">
                    <span>Subject:</span>
                    <h3>{n.title}</h3>
                  </div>

                  <div className="mt-2 border-b p-4">
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                      {n.body}
                    </p>
                  </div>

                  <ReceivedAt iso={receivedIso} />

                  {/* If there is a URL, display button */}
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
              </div>

              {/* Mark read button */}
              <div className="flex justify-end pt-4">
                {isUnread && (
                  <form action={markOne} className="shrink-0">
                    <input type="hidden" name="id" value={n.id} />
                    <Button
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
                      type="submit"
                      aria-disabled={oneState?.pending}
                      disabled={oneState?.pending}
                    >
                      {oneState?.pending ? "Marking…" : "Mark read"}
                    </Button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total
        </p>

        <div className="flex gap-2">
          <Link
            prefetch={false}
            aria-disabled={prevDisabled}
            tabIndex={prevDisabled ? -1 : 0}
            href={prevDisabled ? "#" : hrefForPage(page - 1)}
            className={[
              "rounded-md bg-blue-600 px-3 py-2 text-sm text-white",
              prevDisabled
                ? "pointer-events-none opacity-50"
                : "hover:bg-blue-400",
            ].join(" ")}
          >
            ← Previous
          </Link>

          <Link
            prefetch={false}
            aria-disabled={nextDisabled}
            tabIndex={nextDisabled ? -1 : 0}
            href={nextDisabled ? "#" : hrefForPage(page + 1)}
            className={[
              "rounded-md bg-blue-600 px-3 py-2 text-sm text-white",
              nextDisabled
                ? "pointer-events-none opacity-50"
                : "hover:bg-blue-400",
            ].join(" ")}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}
