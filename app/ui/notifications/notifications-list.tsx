"use client";

import Link from "next/link";
import { useActionState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/app/lib/actions";
import type { AppNotification } from "@/app/lib/definitions";
import { capitalizeFirst } from "@/app/lib/utils";
import { Button } from "../button";

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
          <Button
            className={`mt-4 w-full 
              ${
                !allState
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-blue-400"
              }
            `}
            type="submit"
            aria-disabled={allState?.pending}
            // disabled={allState?.pending}
            disabled={!allState}
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

          const receivedAt = formatDateTime(
            (n as any).publishedAt ?? (n as any).createdAt
          );

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
                  <div className="flex flex-row mt-1 text-lg font-semibold gap-1">
                    <span>Subject:</span>
                    <h3>{n.title}</h3>
                  </div>

                  <div className="border-b mt-2 p-4">
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                      {n.body}
                    </p>
                  </div>
                  {receivedAt && (
                    <p className="mt-2 text-xs text-gray-500">
                      Received {receivedAt}
                    </p>
                  )}
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
              <div className="pt-4 flex justify-end">
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
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} total
        </p>
        <div className="flex gap-2">
          {/* Previous button */}
          <Button
            className={`rounded-md bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50 
              ${
                prevDisabled
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-blue-400"
              }
            `}
          >
            <Link
              prefetch={false}
              aria-disabled={prevDisabled}
              tabIndex={prevDisabled ? -1 : 0}
              href={prevDisabled ? "#" : hrefForPage(page - 1)}
            >
              ← Previous
            </Link>
          </Button>
          {/* Previous button */}
          <Button
            className={`rounded-md bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50 
              ${
                nextDisabled
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-blue-400"
              }
            `}
          >
            <Link
              prefetch={false}
              aria-disabled={nextDisabled}
              tabIndex={nextDisabled ? -1 : 0}
              href={nextDisabled ? "#" : hrefForPage(page + 1)}
            >
              Next →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
