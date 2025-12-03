/* =============================================================================
 * Notifications — Data Access
 * =============================================================================
 * - Users for notification audience dropdown
 * - Unread count badge
 * - Paginated notification list for the current user
 * =============================================================================
 */

"use server";

import "server-only";

import { sql } from "../db";
import { requireUserId } from "../auth/helpers";

import type { DbNotificationRow, AppNotification } from "../types/definitions";
import {
  toAppNotification,
  type FetchNotificationsResult,
} from "../types/definitions";

/* =============================================================================
 * Pagination
 * =============================================================================
 */

/** Notifications pagination defaults. */
const NOTIFICATIONS_PAGE_SIZE = 5;
const NOTIFICATIONS_PAGE_SIZE_MAX = 50;

/* =============================================================================
 * Notifications
 * =============================================================================
 */

export type NotificationUserOption = {
  id: string;
  name: string;
  lastName: string;
  email: string;
};

/**
 * Fetch users for the notifications “recipient” dropdown.
 * Sorted by last_name, name for nicer UX.
 */
export async function fetchNotificationUsers(): Promise<
  NotificationUserOption[]
> {
  const rows = await sql<
    {
      id: string;
      name: string;
      user_name: string;
      last_name: string;
      email: string;
    }[]
  >/* sql */ `
    SELECT id, name, user_name, last_name, email
    FROM public.users
    ORDER BY last_name, name
  `;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    user_name: r.user_name,
    lastName: r.last_name,
    email: r.email,
  }));
}

/**
 * Unread personal notifications count for the **current user**.
 * Broadcasts are intentionally excluded from the “unread” count.
 */
export async function fetchUnreadCount() {
  const userId = await requireUserId();
  const rows = await sql<{ c: number }[]>/* sql */ `
    SELECT COUNT(*)::int AS c
    FROM public.notifications
    WHERE user_id = ${userId}::uuid
      AND status = 'unread'::notification_status
      AND (published_at IS NULL OR published_at <= now())
  `;
  return rows[0]?.c ?? 0;
}

/**
 * Fetch notifications for the **current user**, with:
 * - Pagination (page, pageSize)
 * - Filters: only (all | personal | broadcasts), status, kind
 * - Publish window guard: respects published_at <= now()
 *
 * Returns:
 * - items: mapped to `AppNotification` using toAppNotification
 * - total: total items matching filters (for pagination)
 * - page / pageSize: echo inputs for convenience
 */
export async function fetchNotifications(opts?: {
  page?: number;
  pageSize?: number; // default 5
  only?: "all" | "personal" | "broadcasts"; // default "all"
  status?: "unread" | "read" | "archived" | "any"; // default "any"
  kind?: "all" | "system" | "maintenance" | "feature" | "message";
}): Promise<FetchNotificationsResult> {
  const userId = await requireUserId();

  const page = Math.max(1, opts?.page ?? 1);
  const rawPageSize = opts?.pageSize ?? NOTIFICATIONS_PAGE_SIZE;
  const pageSize = Math.min(
    NOTIFICATIONS_PAGE_SIZE_MAX,
    Math.max(1, rawPageSize)
  );
  const offset = (page - 1) * pageSize;
  const only = opts?.only ?? "all";
  const status = opts?.status ?? "any";
  const kind = opts?.kind ?? "all";

  // Status filters (aliased vs bare used in subqueries)
  const personalStatusSqlAliased =
    status === "any"
      ? sql`TRUE`
      : sql`n.status = ${status}::notification_status`;

  const personalStatusSqlBare =
    status === "any" ? sql`TRUE` : sql`status = ${status}::notification_status`;

  // Kind filters (aliased vs bare)
  const kindSqlAliased =
    kind === "all" ? sql`TRUE` : sql`n.kind = ${kind}::notification_kind`;

  const kindSqlBare =
    kind === "all" ? sql`TRUE` : sql`kind = ${kind}::notification_kind`;

  // Publish window guards (aliased vs bare)
  const publishGuardAliased = sql/* sql */ `
    (n.published_at IS NULL OR n.published_at <= now())
  `;

  const publishGuardBare = sql/* sql */ `
    (published_at IS NULL OR published_at <= now())
  `;

  // Base sources
  const personalSql = sql/* sql */ `
    SELECT n.*
    FROM public.notifications AS n
    WHERE n.user_id = ${userId}::uuid
      AND ${personalStatusSqlAliased}
      AND ${kindSqlAliased}
      AND ${publishGuardAliased}
  `;

  const broadcastSql = sql/* sql */ `
    SELECT n.*
    FROM public.notifications AS n
    WHERE n.user_id IS NULL
      AND ${kindSqlAliased}
      AND ${publishGuardAliased}
  `;

  // Compose union depending on "only" flag
  const unionSql =
    only === "personal"
      ? personalSql
      : only === "broadcasts"
      ? broadcastSql
      : sql/* sql */ `${personalSql} UNION ALL ${broadcastSql}`;

  // Page of rows
  const rows = await sql<DbNotificationRow[]>/* sql */ `
    SELECT *
    FROM (${unionSql}) AS u
    ORDER BY COALESCE(u.published_at, u.created_at) DESC, u.id DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  // Total for pagination (respects status, kind, published_at, only)
  const [{ count: total }] = await sql<{ count: number }[]>/* sql */ `
    SELECT (
      CASE
        WHEN ${only} = 'personal' THEN
          (SELECT COUNT(*)::int
             FROM public.notifications
            WHERE user_id = ${userId}::uuid
              AND ${personalStatusSqlBare}
              AND ${kindSqlBare}
              AND ${publishGuardBare})
        WHEN ${only} = 'broadcasts' THEN
          (SELECT COUNT(*)::int
             FROM public.notifications
            WHERE user_id IS NULL
              AND ${kindSqlBare}
              AND ${publishGuardBare})
        ELSE
          (
            (SELECT COUNT(*)::int
               FROM public.notifications
              WHERE user_id = ${userId}::uuid
                AND ${personalStatusSqlBare}
                AND ${kindSqlBare}
                AND ${publishGuardBare})
            +
            (SELECT COUNT(*)::int
               FROM public.notifications
              WHERE user_id IS NULL
                AND ${kindSqlBare}
                AND ${publishGuardBare})
          )
      END
    ) AS count
  `;

  const items: AppNotification[] = rows.map(toAppNotification);

  return { items, total, page, pageSize };
}
