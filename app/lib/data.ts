import postgres from "postgres";
import {
  Revenue,
  RecipeField,
  RecipeForm,
  LatestRecipeRaw,
  CardData,
  UserForm,
  DbNotificationRow,
  AppNotification,
  toAppNotification,
  IncomingIngredientPayload,
} from "./definitions";

import { requireUserId } from "@/app/lib/auth-helpers";
import { type FetchNotificationsResult } from "@/app/lib/definitions";

/* ================================
 * Database Client
 * ================================ */
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* ================================
 * Pagination
 * ================================ */

/** Single source of truth for recipes pagination — keep UI + queries in sync. */
const RECIPES_PAGE_SIZE = 8;

/* ================================
 * Local Types (helpers)
 * ================================ */
// Types for the small aggregated queries
type TypeCountRow = { recipe_type: string | null; count: number };
type LatestRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_created_at: string;
};

/* ================================
 * Helper Utilities
 * ================================ */

/**
 * Normalize driver result shapes:
 * - @vercel/postgres → result.rows
 * - postgres.js → result is already an array
 */
function pickRows<T = any>(result: any): T[] {
  // Works for both @vercel/postgres (result.rows) and postgres (result is already an array)
  return Array.isArray(result) ? result : result?.rows ?? [];
}

/** Build "a AND b AND c" without sql.join */
function andAll(parts: any[]) {
  // Build "a AND b AND c" without sql.join
  if (parts.length === 0) return sql``;
  const [first, ...rest] = parts;
  return rest.reduce((acc, cur) => sql`${acc} AND ${cur}`, first);
}

/* =======================================================
 * Revenue
 * ======================================================= */

/**
 * Fetch all revenue rows.
 * @returns Promise<Revenue[]>
 * @throws Error if DB query fails
 */
export async function fetchRevenue() {
  try {
    // 1) Query all rows from "revenue"
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    // 2) Return as-is (typed)
    return data;
  } catch (error) {
    // 3) Bubble up a friendly error after logging
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

/* =======================================================
 * Recipes — Latest / Cards for Dashboard
 * ======================================================= */

export async function fetchLatestRecipes() {
  const userId = await requireUserId();
  const data = await sql<LatestRecipeRaw[]>/* sql */ `
    SELECT id, recipe_name, recipe_created_at, recipe_ingredients, recipe_steps, recipe_type
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
    ORDER BY recipe_created_at DESC
    LIMIT 5
  `;
  return data;
}

// Full recipe row used by viewer / editor
export type DbRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_ingredients: string[] | null;
  recipe_ingredients_structured: any | null;
  recipe_steps: string[] | null;
  recipe_type: string | null;
  servings: number | null;
  prep_time_min: number | null;
  difficulty: string | null;
  status: string | null;
  dietary_flags: string[] | null;
  allergens: string[] | null;
  calories_total: number | null;
  estimated_cost_total: number | null;
  equipment: string[] | null;
  recipe_created_at: Date;
  recipe_updated_at: Date | null;
  user_id: string;
};

export async function getRecipeById(id: string): Promise<DbRecipeRow | null> {
  const userId = await requireUserId();

  const rows = await sql<DbRecipeRow[]>/* sql */ `
    SELECT
      r.id,
      r.recipe_name,
      r.recipe_ingredients,
      r.recipe_ingredients_structured,
      r.recipe_steps,
      r.recipe_type,
      r.servings,
      r.prep_time_min,
      r.difficulty,
      r.status,
      r.dietary_flags,
      r.allergens,
      r.calories_total,
      r.estimated_cost_total,
      r.equipment,
      r.recipe_created_at,
      r.recipe_updated_at,
      r.user_id
    FROM public.recipes AS r
    WHERE r.id = ${id}::uuid
      AND r.user_id = ${userId}::uuid
    LIMIT 1
  `;

  return rows[0] ?? null;
}

/* =======================================================
 * Dashboard KPI
 * Fetch dashboard KPI card data (counts + totals by status).
 * Note: Split into parallel queries for demonstration purposes.
 * @returns Promise<{ numberOfCustomers: number; numberOfInvoices: number; totalPaidInvoices: string; totalPendingInvoices: string; }>
 * ======================================================= */
// Card tiles on the dashboard
export async function fetchCardData(): Promise<CardData> {
  const userId = await requireUserId();

  try {
    const totalRecipesPromise = sql/* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    const avgIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(AVG(CARDINALITY(r.recipe_ingredients)), 0)::float AS avg_count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    const topCategoryPromise = sql/* sql */ `
      SELECT r.recipe_type, COUNT(*)::int AS c
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid AND r.recipe_type IS NOT NULL
      GROUP BY r.recipe_type
      ORDER BY c DESC, r.recipe_type ASC
      LIMIT 1
    `;

    const totalIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(COUNT(DISTINCT TRIM(LOWER(ing))), 0)::int AS count
      FROM (
        SELECT UNNEST(r.recipe_ingredients) AS ing
        FROM public.recipes r
        WHERE r.user_id = ${userId}::uuid AND r.recipe_ingredients IS NOT NULL
      ) AS t
    `;

    const [totalRecipesRes, avgIngrRes, topCatRes, totalIngrRes] =
      await Promise.all([
        totalRecipesPromise,
        avgIngredientsPromise,
        topCategoryPromise,
        totalIngredientsPromise,
      ]);

    return {
      totalRecipes: Number(totalRecipesRes?.[0]?.count ?? 0),
      avgIngredients: Number(avgIngrRes?.[0]?.avg_count ?? 0),
      mostRecurringCategory:
        (topCatRes?.[0]?.recipe_type as string | null) ?? "—",
      totalIngredients: Number(totalIngrRes?.[0]?.count ?? 0),
    };
  } catch (e) {
    console.error("Database Error (fetchCardData):", e);
    throw new Error("Failed to fetch recipe card data.");
  }
}

// “Recipe card data” (counts, last 7 days, breakdown, latest)
export async function fetchRecipeCardData() {
  const userId = await requireUserId();

  try {
    const totalRecipesPromise = sql/* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    const recentRecipesPromise = sql/* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
        AND r.recipe_created_at >= NOW() - INTERVAL '7 days'
    `;

    const typesBreakdownPromise = sql<TypeCountRow[]>/* sql */ `
      SELECT r.recipe_type, COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
      GROUP BY r.recipe_type
      ORDER BY count DESC, r.recipe_type ASC
    `;

    const latestRecipePromise = sql<LatestRecipeRow[]>/* sql */ `
      SELECT r.id, r.recipe_name, r.recipe_created_at
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
      ORDER BY r.recipe_created_at DESC, r.id DESC
      LIMIT 1
    `;

    const [
      totalRecipesRes,
      recentRecipesRes,
      typesBreakdownRes,
      latestRecipeRes,
    ] = await Promise.all([
      totalRecipesPromise,
      recentRecipesPromise,
      typesBreakdownPromise,
      latestRecipePromise,
    ]);

    const numberOfRecipes = Number(totalRecipesRes?.[0]?.count ?? 0);
    const recipesLast7Days = Number(recentRecipesRes?.[0]?.count ?? 0);

    const types = (typesBreakdownRes ?? []).map((r) => ({
      type: r.recipe_type ?? "Unknown",
      count: r.count ?? 0,
    }));

    const topType = types.length ? types[0] : null;

    const latest = latestRecipeRes?.[0]
      ? {
          id: latestRecipeRes[0].id,
          name: latestRecipeRes[0].recipe_name,
          createdAt: latestRecipeRes[0].recipe_created_at,
        }
      : null;

    return { numberOfRecipes, recipesLast7Days, types, topType, latest };
  } catch (e) {
    console.error("Database Error (fetchRecipeCardData):", e);
    throw new Error("Failed to fetch recipe card data.");
  }
}

/* =======================================================
 * Recipes — Filtered List, Paging, Single, List
 * ======================================================= */

type SortCol = "name" | "date" | "type";
type SortDir = "asc" | "desc";

export async function fetchFilteredRecipes(
  arg1:
    | string
    | {
        query?: string;
        type?: string;
        sort?: SortCol;
        order?: SortDir;
        page?: number;
      },
  pageMaybe?: number,
  opts: { type?: string; sort?: SortCol; order?: SortDir } = {}
) {
  const userId = await requireUserId();

  // Normalize args
  let searchQuery = "";
  let page = 1;
  let type = "";
  let sort: SortCol = "date";
  let order: SortDir = "desc";

  if (typeof arg1 === "string") {
    searchQuery = arg1 ?? "";
    page = pageMaybe ?? 1;
    type = opts.type ?? "";
    sort = opts.sort ?? "date";
    order = opts.order ?? "desc";
  } else {
    searchQuery = arg1.query ?? "";
    page = arg1.page ?? 1;
    type = arg1.type ?? "";
    sort = arg1.sort ?? "date";
    order = arg1.order ?? "desc";
  }

  // Clamp page
  page = Number.isFinite(page) && page > 0 ? page : 1;
  const offset = (page - 1) * RECIPES_PAGE_SIZE;

  // WHERE predicates (seed with owner)
  const predicates: any[] = [sql`r.user_id = ${userId}::uuid`];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;
    const nameLike = sql`r.recipe_name ILIKE ${pat}`;
    const ingredientsLike = sql`EXISTS (SELECT 1 FROM unnest(r.recipe_ingredients) AS ing WHERE ing ILIKE ${pat})`;
    const stepsLike = sql`EXISTS (SELECT 1 FROM unnest(r.recipe_steps)       AS st  WHERE st  ILIKE ${pat})`;
    const typeLike = sql`r.recipe_type::text ILIKE ${pat}`;
    predicates.push(
      sql`(${nameLike} OR ${ingredientsLike} OR ${stepsLike} OR ${typeLike})`
    );
  }

  if (type) {
    // exact match (enum)
    predicates.push(sql`r.recipe_type = ${type}`);
  }

  const whereSql = sql`WHERE ${andAll(predicates)}`;

  // Sort mapping
  const sortCol =
    sort === "name"
      ? sql`r.recipe_name`
      : sort === "type"
      ? sql`r.recipe_type`
      : sql`r.recipe_created_at`; // "date"

  const dir = order === "asc" ? sql`ASC` : sql`DESC`;

  const rows = await sql/* sql */ `
    SELECT
      r.id,
      r.recipe_name,
      r.recipe_ingredients,
      r.recipe_steps,
      r.recipe_created_at,
      r.recipe_type,
      r.difficulty,
      r.recipe_updated_at
    FROM public.recipes AS r
    ${whereSql}
    ORDER BY ${sortCol} ${dir} NULLS LAST
    LIMIT ${RECIPES_PAGE_SIZE} OFFSET ${offset}
  `;

  return pickRows(rows);
}

/**
 * Count total recipes matching the SAME filters as fetchFilteredRecipes.
 * Accepts:
 *  - query?: string (preferred)
 *  - type?: string  (exact match)
 *
 * Keeping this in sync with the list query prevents pagination drift.
 */
export async function fetchRecipesTotal(params: {
  query?: string;
  type?: string;
}) {
  const userId = await requireUserId();
  const searchQuery = params.query ?? "";
  const type = params.type ?? "";

  const parts: any[] = [sql`r.user_id = ${userId}::uuid`];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;
    parts.push(sql`
      (
        r.recipe_name ILIKE ${pat}
        OR r.recipe_type::text ILIKE ${pat}
        OR EXISTS (SELECT 1 FROM unnest(r.recipe_ingredients) AS ing WHERE ing ILIKE ${pat})
        OR EXISTS (SELECT 1 FROM unnest(r.recipe_steps)       AS st  WHERE st  ILIKE ${pat})
      )
    `);
  }

  if (type) parts.push(sql`r.recipe_type = ${type}`);

  const whereSql = sql`WHERE ${andAll(parts)}`;

  const totalRes = await sql<{ count: number }[]>/* sql */ `
    SELECT COUNT(*)::int AS count
    FROM public.recipes AS r
    ${whereSql}
  `;

  const rows = pickRows<{ count: number }>(totalRes);
  return rows[0]?.count ?? 0;
}

/**
 * Compute total pages for recipes given a filter query.
 *
 * @param query - Search string for filter
 * @returns Promise<number> totalPages
 */
/**
 * Compute total pages for recipes given the same filters as the list query.
 *
 * Accepts:
 *  - string: treated as the free-text search
 *  - { query?: string; type?: string }
 *
 * Uses RECIPES_PAGE_SIZE to compute Math.ceil(count / size).
 */
export async function fetchRecipesPages(
  arg: string | { query?: string; type?: string }
) {
  const userId = await requireUserId();
  const searchQuery = typeof arg === "string" ? arg : arg.query ?? "";
  const type = typeof arg === "string" ? "" : arg.type ?? "";

  const parts: any[] = [sql`r.user_id = ${userId}::uuid`];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;
    parts.push(sql`
      (
        r.recipe_name ILIKE ${pat}
        OR r.recipe_type::text ILIKE ${pat}
        OR EXISTS (SELECT 1 FROM unnest(r.recipe_ingredients) AS ing WHERE ing ILIKE ${pat})
        OR EXISTS (SELECT 1 FROM unnest(r.recipe_steps)       AS st  WHERE st  ILIKE ${pat})
      )
    `);
  }

  if (type) parts.push(sql`r.recipe_type = ${type}`);

  const whereSql = sql`WHERE ${andAll(parts)}`;

  const res = await sql<{ count: number }[]>/* sql */ `
    SELECT COUNT(*)::int AS count
    FROM public.recipes AS r
    ${whereSql}
  `;

  const count = pickRows<{ count: number }>(res)[0]?.count ?? 0;
  return Math.ceil(count / RECIPES_PAGE_SIZE);
}

/**
 * Fetch a minimal list of recipes (id, name, type) ordered by name.
 * Useful for select dropdowns.
 * @returns Promise<RecipeField[]>
 */
export async function fetchRecipes() {
  const userId = await requireUserId();
  try {
    const recipes = await sql<RecipeField[]>`
      SELECT id, recipe_name, recipe_type
      FROM public.recipes
      WHERE user_id = ${userId}::uuid
      ORDER BY recipe_name ASC
    `;
    return recipes;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all recipes.");
  }
}

export async function fetchRecipeById(id: string) {
  const userId = await requireUserId();
  try {
    const rows = await sql<RecipeForm[]>`
      SELECT
        id,
        recipe_name,
        recipe_ingredients,
        recipe_steps,
        recipe_type,
        servings,
        prep_time_min,
        difficulty,
        status,
        COALESCE(dietary_flags, ARRAY[]::text[]) AS dietary_flags,
        COALESCE(allergens,     ARRAY[]::text[]) AS allergens,
        calories_total,
        estimated_cost_total,
        COALESCE(equipment,     ARRAY[]::text[]) AS equipment,
        recipe_ingredients_structured,
        (recipe_created_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_created_at,
        (recipe_updated_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_updated_at
      FROM public.recipes
      WHERE id = ${id}::uuid AND user_id = ${userId}::uuid
      LIMIT 1;
    `;
    return rows[0] ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe.");
  }
}

export async function fetchUserById(id: string) {
  if (!id) throw new Error("fetchUserById: id is required");
  const rows = await sql<UserForm[]>`
    SELECT id, name, last_name, email, password, country, language
    FROM public.users
    WHERE id = ${id}::uuid
  `;
  return rows[0] ?? null;
}

/* =======================================================
 * Specific recipe and scope by owner.
 * ======================================================= */
export async function fetchRecipeByIdForOwner(
  id: string
): Promise<RecipeForm | null> {
  const userId = await requireUserId();

  const rows = await sql<RecipeForm[]>`
    SELECT
      id,
      recipe_name,
      recipe_ingredients,
      recipe_ingredients_structured,
      recipe_steps,
      recipe_type,
      servings,
      prep_time_min,
      difficulty,
      status,
      COALESCE(dietary_flags, ARRAY[]::text[]) AS dietary_flags,
      COALESCE(allergens,     ARRAY[]::text[]) AS allergens,
      calories_total,
      estimated_cost_total,
      COALESCE(equipment,     ARRAY[]::text[]) AS equipment,
      (recipe_created_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_created_at,
      (recipe_updated_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_updated_at
    FROM public.recipes
    WHERE id = ${id}::uuid AND user_id = ${userId}::uuid
    LIMIT 1;
  `;

  return rows[0] ?? null;
}

/* =======================================================
 * Shopping list
 * ======================================================= */
export async function fetchAllStructuredIngredientsForUser(
  userId: string
): Promise<IncomingIngredientPayload[]> {
  const rows = await sql<
    { recipe_ingredients_structured: unknown }[]
  >/* sql */ `
    SELECT recipe_ingredients_structured
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
  `;

  const result: IncomingIngredientPayload[] = [];

  for (const row of rows) {
    const raw = (row as any).recipe_ingredients_structured;
    if (!raw) continue;

    // Case 1: column already deserialized as array
    if (Array.isArray(raw)) {
      for (const ing of raw) {
        if (ing && typeof (ing as any).ingredientName === "string") {
          result.push(ing as IncomingIngredientPayload);
        }
      }
      continue;
    }

    // Case 2: stored as JSON string
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const ing of parsed) {
            if (ing && typeof (ing as any).ingredientName === "string") {
              result.push(ing as IncomingIngredientPayload);
            }
          }
        }
      } catch (e) {
        console.error(
          "Failed to parse recipe_ingredients_structured for user %s:",
          userId,
          e
        );
      }
    }
  }

  return result;
}

/* =======================================================
 * Notifications
 * ======================================================= */

// ensure `sql` is already defined in this module as your postgres.js client

// Users for notification dropdown
export type NotificationUserOption = {
  id: string;
  name: string;
  lastName: string;
  email: string;
};

export async function fetchNotificationUsers(): Promise<
  NotificationUserOption[]
> {
  const rows = await sql<
    {
      id: string;
      name: string;
      last_name: string;
      email: string;
    }[]
  >/* sql */ `
    SELECT id, name, last_name, email
    FROM public.users
    ORDER BY last_name, name
  `;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    lastName: r.last_name,
    email: r.email,
  }));
}

// Unread count (personal-only; broadcasts are not “readable”)
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

const NOTIFICATIONS_PAGE_SIZE = 5;
const NOTIFICATIONS_PAGE_SIZE_MAX = 50;

export async function fetchNotifications(opts?: {
  page?: number;
  pageSize?: number; // default 10
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

  // status filters
  const personalStatusSqlAliased =
    status === "any"
      ? sql`TRUE`
      : sql`n.status = ${status}::notification_status`;

  const personalStatusSqlBare =
    status === "any" ? sql`TRUE` : sql`status = ${status}::notification_status`;

  // 👇 NEW kind filters
  const kindSqlAliased =
    kind === "all" ? sql`TRUE` : sql`n.kind = ${kind}::notification_kind`;

  const kindSqlBare =
    kind === "all" ? sql`TRUE` : sql`kind = ${kind}::notification_kind`;

  // publish window guards
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

  // Compose union
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

  // Total for pagination (also respects status, kind, published_at)
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

/* =======================================================
 * Release notes + Roadmap
 * ======================================================= */
export type ReleaseNote = {
  id: string;
  title: string;
  body: string;
  releasedAt: string;
};

export type RoadmapStatus = "planned" | "in_progress" | "shipped";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string | null;
  status: RoadmapStatus;
  orderIndex: number;
};

export type RoadmapGrouped = {
  planned: RoadmapItem[];
  inProgress: RoadmapItem[];
  shipped: RoadmapItem[];
};

/** Fetch all release notes, newest first */
export async function fetchReleaseNotes(): Promise<ReleaseNote[]> {
  const rows = await sql<
    {
      id: string;
      title: string;
      body: string;
      released_at: string;
    }[]
  >/* sql */ `
    SELECT id, title, body, released_at
    FROM public.release_notes
    ORDER BY released_at DESC, created_at DESC
  `;

  // rows is already an array – no .rows
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    releasedAt: r.released_at,
  }));
}

/** Fetch roadmap items grouped by status */
export async function fetchRoadmapGrouped(): Promise<RoadmapGrouped> {
  const rows = await sql<
    {
      id: string;
      title: string;
      description: string | null;
      status: RoadmapStatus;
      order_index: number | null;
    }[]
  >/* sql */ `
    SELECT id, title, description, status, order_index
    FROM public.roadmap_items
    ORDER BY status, order_index, created_at
  `;

  const planned: RoadmapItem[] = [];
  const inProgress: RoadmapItem[] = [];
  const shipped: RoadmapItem[] = [];

  // rows is an array, so just for-of over it
  for (const r of rows) {
    const item: RoadmapItem = {
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      orderIndex: r.order_index ?? 0,
    };

    if (r.status === "planned") planned.push(item);
    else if (r.status === "in_progress") inProgress.push(item);
    else shipped.push(item);
  }

  return { planned, inProgress, shipped };
}

/* =======================================================
 * Shopping list
 * ======================================================= */
