/* =============================================================================
 * Notification Actions
 * =============================================================================
 * - markNotificationRead: mark a single notification as read
 * - markAllNotificationsRead: mark all notifications as read for current user
 * - createNotification: admin-only; create personal or broadcast notifications
 *
 * Notes:
 * - All actions are designed for use with useFormState on the client.
 * - Uses a small shared ActionResult type for simple success/error messaging.
 * =============================================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin, requireUserId } from "../auth/helpers";
import { sql } from "../db";

/* =============================================================================
 * Types
 * =============================================================================
 */

/** Small shared result shape for notification actions. */
export type ActionResult = {
  ok: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
  id?: string;
};

/* =============================================================================
 * Schemas
 * =============================================================================
 */

/**
 * Schema for creating a new notification from the admin UI.
 */
const NewNotificationSchema = z
  .object({
    // null = broadcast, UUID string = specific user
    userId: z
      .string()
      .uuid({ message: "Must be a valid user id" })
      .nullable()
      .optional(),

    title: z.string().trim().min(1, "Title is required"),
    body: z.string().trim().min(1, "Body is required"),

    kind: z.enum([
      "announcement",
      "maintenance",
      "support",
      "alert",
      "compliance",
    ]),
    level: z.enum(["info", "success", "warning", "error"]),

    linkUrl: z.string().url("Must be a valid URL").optional(),

    // "on" / null / boolean → boolean
    publishNow: z.coerce.boolean().optional().default(true),

    // Raw value from <input type="datetime-local" name="publishAt">
    publishAt: z.preprocess(
      (v) => {
        // disabled -> FormData.get(...) === null
        if (v == null) return undefined;
        if (typeof v !== "string") return undefined;

        const t = v.trim();
        if (!t) return undefined; // empty string = not set

        // keep the raw value; we'll parse later
        return t;
      },
      // Only validate when there *is* a value
      z
        .string()
        .refine((v) => !Number.isNaN(Date.parse(v)), {
          message: "Must be a valid date/time",
        })
        .optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.publishNow && !data.publishAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishAt"],
        message: "Pick a date/time or enable 'Publish now'",
      });
    }
  });

/* =============================================================================
 * Actions
 * =============================================================================
 */

/**
 * Mark a single notification as read for the current user.
 */
export async function markNotificationRead(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return { ok: false, message: "Missing notification id." };
  }

  try {
    await sql/* sql */ `
      UPDATE public.notifications
      SET status = 'read'::notification_status
      WHERE id = ${id}::uuid
        AND user_id = ${userId}::uuid  -- only *this* user's notification
    `;

    revalidatePath("/dashboard/notifications");
    return { ok: true, message: null };
  } catch (e) {
    console.error("markNotificationRead failed:", e);
    return { ok: false, message: "Failed to mark notification as read." };
  }
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllNotificationsRead(): Promise<ActionResult> {
// _prev: ActionResult | undefined,
// _formData: FormData
  const userId = await requireUserId();

  try {
    await sql/* sql */ `
      UPDATE public.notifications
      SET status = 'read'::notification_status
      WHERE user_id = ${userId}::uuid
        AND status = 'unread'::notification_status
    `;

    revalidatePath("/dashboard/notifications");
    return { ok: true, message: null };
  } catch (e) {
    console.error("markAllNotificationsRead failed:", e);
    return { ok: false, message: "Failed to mark all notifications as read." };
  }
}

/**
 * Admin-only action to create a new notification.
 *
 * - Supports personal (userId) and broadcast notifications
 * - Handles linkUrl, publishNow / publishAt scheduling
 * - Sets initial status: personal = unread, broadcast = read
 */
export async function createNotification(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const audience = formData.get("audience");
  const rawUserId = formData.get("userId");

  // Decide who this is for: broadcast vs specific user
  const userId =
    audience === "broadcast"
      ? null
      : typeof rawUserId === "string" && rawUserId.trim().length > 0
      ? rawUserId.trim()
      : null;

  // Normalize linkUrl: empty string -> undefined
  const rawLinkUrl = formData.get("linkUrl");
  const linkUrl =
    typeof rawLinkUrl === "string" && rawLinkUrl.trim().length > 0
      ? rawLinkUrl.trim()
      : undefined;

  const parsed = NewNotificationSchema.safeParse({
    userId,
    title: formData.get("title"),
    body: formData.get("body"),
    kind: formData.get("kind"),
    level: formData.get("level"),
    linkUrl,
    publishNow: formData.get("publishNow"),
    publishAt: formData.get("publishAt"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const k = (issue.path[0] as string) || "_form";
      (errors[k] ??= []).push(issue.message);
    }
    return { ok: false, message: "Fix errors and try again.", errors };
  }

  const d = parsed.data;

  // Scheduling rule:
  // - If a publishAt date is provided -> schedule for that date
  // - Else -> publish now
  const publishedAt = d.publishAt ? new Date(d.publishAt) : new Date();

  // Normalize values for SQL (no `undefined`)
  const userIdParam: string | null = d.userId ?? null;
  const linkUrlParam: string | null = d.linkUrl ?? null;

  // Decide initial status: personal = unread, broadcast = read
  const initialStatus: "unread" | "read" = d.userId ? "unread" : "read";

  try {
    const result = await sql/* sql */ `
      INSERT INTO public.notifications (
        user_id,
        title,
        body,
        kind,
        level,
        link_url,
        status,
        published_at
      )
      VALUES (
        ${userIdParam},
        ${d.title},
        ${d.body},
        ${d.kind}::notification_kind,
        ${d.level}::notification_level,
        ${linkUrlParam},
        ${initialStatus}::notification_status,
        ${publishedAt}
      )
      RETURNING id
    `;

    // Depending on your postgres client typing, this might be any[]
    const id = (result as any)[0]?.id ?? (result as any).rows?.[0]?.id;

    return { ok: true, message: null, id };
  } catch (e) {
    console.error("createNotification failed:", e);
    return { ok: false, message: "Failed to create notification." };
  }
}
