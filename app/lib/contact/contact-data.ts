"use server";

import "server-only";
import { sql } from "@/app/lib/db";

export type ContactCategory =
  | "bug"
  | "billing"
  | "feature"
  | "account"
  | "other";

export type ContactInboxRow = {
  id: string;
  category: ContactCategory | string; // keep flexible since DB column is TEXT
  subject: string;

  status: "open" | "solved";
  created_at: string; // ISO-ish text
  solved_at: string | null;

  contact_name: string;
  contact_email: string;

  minutes_ago: number;
  solved_minutes_ago: number | null;
};

export async function fetchContactInbox(): Promise<ContactInboxRow[]> {
  const rows = await sql<ContactInboxRow[]>`
    SELECT
      sr.id::text,
      sr.category,
      sr.subject,

      -- status enum -> text for TS
      sr.status::text AS status,

      (sr.created_at AT TIME ZONE 'UTC')::timestamptz::text AS created_at,

      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE (sr.solved_at AT TIME ZONE 'UTC')::timestamptz::text
      END AS solved_at,

      sr.contact_name,
      sr.contact_email,

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

    FROM public.public_inbox sr

    ORDER BY
      -- open first, then newest
      (sr.status = 'solved'::contact_status) ASC,
      sr.created_at DESC

    LIMIT 200
  `;

  return rows;
}

export type ContactMessageDetail = {
  id: string;
  category: ContactCategory | string; // DB is TEXT, keep flexible
  subject: string;
  message: string;

  status: "open" | "solved";

  contact_name: string;
  contact_email: string;

  created_at: string;
  updated_at: string;
  solved_at: string | null;
  solved_by: string | null;
};

export async function fetchContactMessageById(
  id: string,
): Promise<ContactMessageDetail | null> {
  const rows = await sql<ContactMessageDetail[]>`
    SELECT
      sr.id::text,
      sr.category,
      sr.subject,
      sr.message,

      sr.status::text AS status,

      sr.contact_name,
      sr.contact_email,

      (sr.created_at AT TIME ZONE 'UTC')::timestamptz::text AS created_at,
      (sr.updated_at AT TIME ZONE 'UTC')::timestamptz::text AS updated_at,

      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE (sr.solved_at AT TIME ZONE 'UTC')::timestamptz::text
      END AS solved_at,

      sr.solved_by::text AS solved_by

    FROM public.public_inbox sr
    WHERE sr.id = ${id}::uuid
    LIMIT 1
  `;

  return rows[0] ?? null;
}
