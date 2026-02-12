// ===== Admin: single user with extra metadata =====

import { sql } from "../db";
import { MembershipTier, UserForm } from "../types/definitions";

type AdminUserRow = UserForm & {
  membership_tier?: UserForm["membership_tier"];
  user_role: string | null;
  created_at: string;
  profile_updated_at: string | null;
  password_changed_at: string | null;
  last_login_at?: string | null;
  recipes_owned_count: number;
  recipes_imported_count: number;
};

/* =============================================================================
 * Users (helpers for forms / admin UI)
 * =============================================================================
 */

/**
 * Fetch a user by id.
 * Helper for forms / admin UI; throws if id is missing.
 */
export async function fetchUserById(id: string) {
  if (!id) throw new Error("fetchUserById: id is required");

  const rows = await sql<UserForm[]>`
    SELECT
      u.id,
      u.name,
      u.user_name,
      u.last_name,
      u.email,
      u.password,
      u.country,
      u.language AS language,
      u.gender,
      -- date_of_birth as text (nullable)
      CASE
        WHEN u.date_of_birth IS NOT NULL
        THEN (u.date_of_birth AT TIME ZONE 'UTC')::timestamptz::text
        ELSE NULL
      END AS date_of_birth,
      u.allergies,
      u.dietary_flags,
      u.height_cm::int AS height_cm,
      u.weight_kg::int  AS weight_kg,
      u.membership_tier,
      u.user_role,
      (u.created_at AT TIME ZONE 'UTC')::timestamptz::text          AS created_at,
      (u.profile_updated_at AT TIME ZONE 'UTC')::timestamptz::text  AS profile_updated_at,
      (u.password_changed_at AT TIME ZONE 'UTC')::timestamptz::text AS password_changed_at,
      (u.last_login_at AT TIME ZONE 'UTC')::timestamptz::text       AS last_login_at
    FROM public.users AS u
    WHERE u.id = ${id}::uuid
    LIMIT 1
  `;

  return rows[0] ?? null;
}

/** Row shape for the admin users list */
export type AdminUserListItem = {
  // User info
  id: string;
  name: string;
  last_name: string | null;
  user_name: string | null;
  email: string;
  country: string | null;
  language: string | null;
  // User type
  user_role: "user" | "admin";
  membership_tier: MembershipTier | null;
  created_at: string;
  // Activity timestamps
  updated_at: string | null;
  password_changed_at: string | null;
  profile_updated_at: string | null;
  last_login_at: string | null;
  // Recipe counts
  owned_recipes_count: number;
  imported_recipes_count: number;
  total_recipes_count: number;
};

export async function fetchUserByIdForAdmin(
  id: string,
): Promise<AdminUserRow | null> {
  if (!id) throw new Error("fetchUserByIdForAdmin: id is required");

  const rows = await sql<AdminUserRow[]>`
    WITH owned AS (
      SELECT r.user_id, COUNT(*)::int AS cnt
      FROM public.recipes r
      WHERE r.user_id IS NOT NULL
      GROUP BY r.user_id
    ),
    imported AS (
      SELECT saver_id, COUNT(*)::int AS cnt
      FROM (
        SELECT UNNEST(r.saved_by_user_ids) AS saver_id
        FROM public.recipes r
        WHERE r.saved_by_user_ids IS NOT NULL
      ) s
      GROUP BY saver_id
    )
    SELECT
      u.id,
      u.name,
      u.user_name,
      u.last_name,
      u.email,
      ''::text AS password,
      u.country,
      u.language,
      u.gender,
      CASE
        WHEN u.date_of_birth IS NOT NULL
        THEN (u.date_of_birth AT TIME ZONE 'UTC')::timestamptz::text
        ELSE NULL
      END AS date_of_birth,
      u.allergies,
      u.dietary_flags,
      u.height_cm,
      u.weight_kg,
      COALESCE(u.membership_tier, 'free')::membership_tier AS membership_tier,
      u.user_role,
      (u.created_at AT TIME ZONE 'UTC')::timestamptz::text          AS created_at,
      (u.profile_updated_at AT TIME ZONE 'UTC')::timestamptz::text  AS profile_updated_at,
      (u.password_changed_at AT TIME ZONE 'UTC')::timestamptz::text AS password_changed_at,
      (u.last_login_at AT TIME ZONE 'UTC')::timestamptz::text       AS last_login_at,
      COALESCE(owned.cnt, 0)::int    AS recipes_owned_count,
      COALESCE(imported.cnt, 0)::int AS recipes_imported_count
    FROM public.users u
    LEFT JOIN owned    ON owned.user_id     = u.id
    LEFT JOIN imported ON imported.saver_id = u.id
    WHERE u.id = ${id}::uuid
    LIMIT 1
  `;

  return rows[0] ?? null;
}

type Filters = {
  query?: string;
  role?: "admin" | "user" | null;
  tier?: "free" | "tier1" | "tier2" | null;
  country?: string | null; // exact match for now (or you can use ILIKE with wildcards)
  language?: string | null; // IMPORTANT: keep as string, do NOT cast user input to enum
};

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export async function fetchAdminUsers(filters: Filters): Promise<{
  rows: AdminUserListItem[];
  total: number;
}> {
  const qRaw = clean(filters.query);
  const q = qRaw ? `%${qRaw.toLowerCase()}%` : null;

  const role = filters.role ?? null;
  const tier = filters.tier ?? null;
  const country = clean(filters.country);
  const language = clean(filters.language);

  const rows = await sql<AdminUserListItem[]> /* sql */ `
    SELECT
      u.id,
      u.name,
      u.last_name,
      u.user_name,
      u.email,
      u.country,
      u.language,
      u.user_role,
      u.membership_tier,
      (u.created_at AT TIME ZONE 'UTC')::timestamptz::text          AS created_at,
      (u.updated_at AT TIME ZONE 'UTC')::timestamptz::text          AS updated_at,
      (u.password_changed_at AT TIME ZONE 'UTC')::timestamptz::text AS password_changed_at,
      (u.profile_updated_at AT TIME ZONE 'UTC')::timestamptz::text  AS profile_updated_at,
      (u.last_login_at AT TIME ZONE 'UTC')::timestamptz::text       AS last_login_at,
      COALESCE(owned.count, 0)::int    AS owned_recipes_count,
      COALESCE(imported.count, 0)::int AS imported_recipes_count,
      (COALESCE(owned.count, 0) + COALESCE(imported.count, 0))::int AS total_recipes_count
    FROM public.users u
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = u.id
    ) AS owned ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE u.id = ANY(r.saved_by_user_ids)
    ) AS imported ON TRUE
    WHERE
      (${q}::text IS NULL OR (
        LOWER(COALESCE(u.name, '')) LIKE ${q}
        OR LOWER(COALESCE(u.last_name, '')) LIKE ${q}
        OR LOWER(COALESCE(u.user_name, '')) LIKE ${q}
        OR LOWER(u.email) LIKE ${q}
      ))
      AND (${role}::text IS NULL OR u.user_role::text = ${role})
      AND (${tier}::text IS NULL OR COALESCE(u.membership_tier::text, '') = ${tier})
      -- Country: safe text compare (case-insensitive)
AND (${country}::text IS NULL OR LOWER(COALESCE(u.country, '')) LIKE LOWER('%' || ${country} || '%'))
      -- Language: DO NOT cast user input to enum. Compare text-to-text.
      AND (${language}::text IS NULL OR COALESCE(u.language::text, '') = ${language})
    ORDER BY u.created_at DESC
    LIMIT 200
  `;

  return { rows, total: rows.length };
}
