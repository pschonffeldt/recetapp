"use server";

import "server-only";
import { sql } from "@/app/lib/db";

export type ContactCategory =
  | "support"
  | "feedback"
  | "billing"
  | "bug"
  | "other";

export type ContactInboxRow = {
  id: string;
  category: ContactCategory | string; // keep flexible if DB is TEXT
  subject: string;

  status: "open" | "solved";
  created_at: string;
  solved_at: string | null;

  contact_name: string | null;
  contact_email: string;

  minutes_ago: number;
  solved_minutes_ago: number | null;
};

type FetchContactInboxArgs = {
  query?: string | null;
  status?: "open" | "solved" | null;
  topic?: string | null;
};

export async function fetchContactInbox(
  args: FetchContactInboxArgs = {},
): Promise<{ rows: ContactInboxRow[]; total: number }> {
  const query = (args.query ?? "").trim() || null;
  const status = args.status ?? null;
  const topic = (args.topic ?? "").trim() || null;

  const where = sql`
    WHERE 1=1
      ${
        query
          ? sql`AND (
        sr.subject ILIKE ${"%" + query + "%"}
        OR sr.contact_name ILIKE ${"%" + query + "%"}
        OR sr.contact_email ILIKE ${"%" + query + "%"}
      )`
          : sql``
      }
      ${status ? sql`AND sr.status = ${status}::contact_status` : sql``}
      ${topic ? sql`AND sr.category = ${topic}` : sql``}
  `;

  // total
  const totalRows = await sql<{ total: number }[]>`
    SELECT COUNT(*)::int AS total
    FROM public.public_inbox sr
    ${where}
  `;
  const total = totalRows[0]?.total ?? 0;

  // rows
  const rows = await sql<ContactInboxRow[]>`
    SELECT
      sr.id::text,
      sr.category,
      sr.subject,

      sr.status::text AS status,

      (sr.created_at AT TIME ZONE 'UTC')::timestamptz::text AS created_at,

      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE (sr.solved_at AT TIME ZONE 'UTC')::timestamptz::text
      END AS solved_at,

      sr.contact_name,
      sr.contact_email,

      GREATEST(
        0,
        FLOOR(EXTRACT(EPOCH FROM (NOW() - sr.created_at)) / 60)::int
      ) AS minutes_ago,

      CASE
        WHEN sr.solved_at IS NULL THEN NULL
        ELSE GREATEST(
          0,
          FLOOR(EXTRACT(EPOCH FROM (NOW() - sr.solved_at)) / 60)::int
        )
      END AS solved_minutes_ago

    FROM public.public_inbox sr
    ${where}

    ORDER BY
      (sr.status = 'solved'::contact_status) ASC,
      sr.created_at DESC

    LIMIT 200
  `;

  return { rows, total };
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

export type ContactInboxFilters = {
  query?: string; // subject/name/email
  status?: "" | "open" | "solved";
  topic?: "" | "support" | "feedback" | "billing" | "bug" | "other";
  limit?: number;
};

type ContactInboxRowWithTotal = ContactInboxRow & { total_count: number };

export async function fetchContactInboxFiltered(
  filters: ContactInboxFilters = {},
): Promise<{ rows: ContactInboxRow[]; total: number }> {
  const { query = "", status = "", topic = "", limit = 200 } = filters;

  const rowsWithTotal = await sql<ContactInboxRowWithTotal[]>`
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
      END AS solved_minutes_ago,

      COUNT(*) OVER()::int AS total_count

    FROM public.public_inbox sr
    WHERE
      (
        ${query} = '' OR
        sr.subject ILIKE ('%' || ${query} || '%') OR
        sr.contact_name ILIKE ('%' || ${query} || '%') OR
        sr.contact_email ILIKE ('%' || ${query} || '%')
      )
      AND (
        ${status} = '' OR sr.status::text = ${status}
      )
      AND (
        ${topic} = '' OR sr.category::text = ${topic}
      )

    ORDER BY
      -- open first, then newest
      (sr.status = 'solved'::contact_status) ASC,
      sr.created_at DESC

    LIMIT ${limit}
  `;

  const total = rowsWithTotal[0]?.total_count ?? 0;
  const cleanedRows: ContactInboxRow[] = rowsWithTotal.map(
    ({ total_count, ...r }) => r,
  );

  return { rows: cleanedRows, total };
}
