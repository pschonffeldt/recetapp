"use server";

import "server-only";
import { sql } from "@/app/lib/db";

export type SupportCategory =
  | "bug"
  | "billing"
  | "feature"
  | "account"
  | "other";

export type SupportInboxRow = {
  id: string;
  user_id: string;
  category: SupportCategory;
  subject: string;
  created_at: string; // ISO string
  solved_at: string | null;
  status: "open" | "solved";
  solved_minutes_ago: number | null;

  // helpful for list UI
  user_name: string | null;
  email: string;
  minutes_ago: number; // computed server-side
};

export async function fetchSupportInbox(): Promise<SupportInboxRow[]> {
  const rows = await sql<SupportInboxRow[]>`
    SELECT
      sr.id::text,
      sr.user_id::text,
      sr.category,
      sr.subject,

      -- enum -> text for TS
      COALESCE(
        sr.status::text,
        CASE WHEN sr.solved_at IS NOT NULL THEN 'solved' ELSE 'open' END
      ) AS status,

      (sr.created_at AT TIME ZONE 'UTC')::timestamptz::text AS created_at,

      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE (sr.solved_at AT TIME ZONE 'UTC')::timestamptz::text
      END AS solved_at,

      u.user_name,
      u.email,

      -- minutes since created
      GREATEST(
        0,
        FLOOR(EXTRACT(EPOCH FROM (NOW() - sr.created_at)) / 60)::int
      ) AS minutes_ago,

      -- minutes since solved (nullable)
      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE GREATEST(
          0,
          FLOOR(EXTRACT(EPOCH FROM (NOW() - sr.solved_at)) / 60)::int
        )
      END AS solved_minutes_ago

    FROM public.support_requests sr
    JOIN public.users u ON u.id = sr.user_id

    ORDER BY
      -- open first
      (COALESCE(sr.status, 'open'::support_status) = 'solved'::support_status) ASC,
      sr.created_at DESC

    LIMIT 200
  `;

  return rows;
}

export type SupportMessageDetail = {
  id: string;
  category: SupportCategory;
  subject: string;
  message: string;
  created_at: string;
  solved_at: string | null;

  // user details (subset — expand as needed)
  user_id: string;
  email: string;
  user_name: string | null;
  name: string | null;
  last_name: string | null;
  country: string | null;
  language: string | null;
  gender: string | null;
  date_of_birth: string | null;
  membership_tier: string | null;
  user_role: string | null;
  created_user_at: string | null;
  last_login_at: string | null;
};

export async function fetchSupportMessageById(
  id: string
): Promise<SupportMessageDetail | null> {
  const rows = await sql<SupportMessageDetail[]>`
    SELECT
      sr.id::text,
      sr.category,
      sr.subject,
      sr.message,
      (sr.created_at AT TIME ZONE 'UTC')::timestamptz::text AS created_at,
      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE (sr.solved_at AT TIME ZONE 'UTC')::timestamptz::text
      END AS solved_at,

      u.id::text AS user_id,
      u.email,
      u.user_name,
      u.name,
      u.last_name,
      u.country,
      u.language,
      u.gender,
      CASE
        WHEN u.date_of_birth IS NULL THEN NULL
        ELSE (u.date_of_birth AT TIME ZONE 'UTC')::timestamptz::text
      END AS date_of_birth,
      u.membership_tier::text AS membership_tier,
      u.user_role::text AS user_role,
      (u.created_at AT TIME ZONE 'UTC')::timestamptz::text AS created_user_at,
      CASE
        WHEN u.last_login_at IS NULL THEN NULL
        ELSE (u.last_login_at AT TIME ZONE 'UTC')::timestamptz::text
      END AS last_login_at
    FROM public.support_requests sr
    JOIN public.users u ON u.id = sr.user_id
    WHERE sr.id = ${id}::uuid
    LIMIT 1
  `;
  return rows[0] ?? null;
}
