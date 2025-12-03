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
  PublicRecipeDetail,
} from "./types/definitions";
import {
  type FetchNotificationsResult,
  type IncomingIngredientPayload,
} from "@/app/lib/types/definitions";
import { requireUserId } from "@/app/lib/auth/helpers";
import { parseStructuredIngredients } from "./ingredients";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * ============================================================================
 * Data Access Layer (DAL) for RecetApp
 *
 * Central place for all DB reads:
 * - Dashboard KPIs / cards
 * - Recipe lists + detail + filters
 * - Shopping list helpers (structured ingredients)
 * - Notifications
 * - Release notes + Roadmap
 *
 * Conventions:
 * - All "current user" queries use requireUserId() inside the function.
 * - Helpers that accept userId explicitly are safe to call from server actions
 *   that already resolved the user.
 * - Use postgres.js tagged template (`sql`) everywhere for consistency.
 * ============================================================================
 */

/* =============================================================================
 * Database Client
 * =============================================================================
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const UUID_OID = 2950; // Postgres OID for uuid

/* =============================================================================
 * Pagination constants
 * =============================================================================
 */

/** Single source of truth for recipes pagination — keep UI + queries in sync. */
const RECIPES_PAGE_SIZE = 8;

/** Notifications pagination defaults. */
const NOTIFICATIONS_PAGE_SIZE = 5;
const NOTIFICATIONS_PAGE_SIZE_MAX = 50;

/* =============================================================================
 * Local / helper types
 * =============================================================================
 */

type TypeCountRow = { recipe_type: string | null; count: number };

type LatestRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_created_at: string;
};

/** Row shape for querying only structured ingredients. */
// type RecipeIngredientsRow = {
//   recipe_ingredients_structured: IncomingIngredientPayload[] | string | null;
// };

type RecipeIngredientsRow = {
  recipe_ingredients_structured: unknown;
};

/* =============================================================================
 * Generic helpers
 * =============================================================================
 */

/**
 * Normalize driver result shapes:
 * - @vercel/postgres → result.rows
 * - postgres.js      → result is already an array
 */
function pickRows<T = any>(result: any): T[] {
  return Array.isArray(result) ? result : result?.rows ?? [];
}

/**
 * Build "a AND b AND c" without sql.join.
 * Returns an empty template when there are no parts.
 */
function andAll(parts: any[]) {
  if (parts.length === 0) return sql``;
  const [first, ...rest] = parts;
  return rest.reduce((acc, cur) => sql`${acc} AND ${cur}`, first);
}

/* =============================================================================
 * Revenue
 * =============================================================================
 */

/**
 * Fetch all rows from the `revenue` table.
 *
 * @returns All revenue entries as typed `Revenue[]`.
 * @throws Error when the DB query fails.
 */
export async function fetchRevenue() {
  try {
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

/* =============================================================================
 * Recipes — Latest / single / dashboard cards
 * =============================================================================
 */

// Minimal shape used by the shopping list UI
export type ShoppingListRecipe = Pick<RecipeForm, "id" | "recipe_name">;

/**
 * Latest recipes for the **current user**, newest first.
 * Used by dashboard “latest” section.
 */
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

/**
 * Full recipe row used by viewer / editor.
 * Mirrors the Postgres schema closely.
 */
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

/**
 * Fetch a single recipe by id **for the current user**.
 * Returns null when the recipe does not exist or does not belong to the user.
 */
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

/* =============================================================================
 * Dashboard KPIs / Cards
 * =============================================================================
 */

/**
 * High-level dashboard card data for recipes:
 * - totalRecipes
 * - avgIngredients per recipe
 * - mostRecurringCategory (recipe_type)
 * - totalIngredients (distinct ingredient names)
 */
export async function fetchCardData(): Promise<CardData> {
  const userId = await requireUserId();

  try {
    // Total recipes created by user
    const totalRecipesPromise = sql/* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    // Average number of ingredients per recipe
    const avgIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(AVG(CARDINALITY(r.recipe_ingredients)), 0)::float AS avg_count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    // Most common recipe_type for the user
    const topCategoryPromise = sql/* sql */ `
      SELECT r.recipe_type, COUNT(*)::int AS c
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid AND r.recipe_type IS NOT NULL
      GROUP BY r.recipe_type
      ORDER BY c DESC, r.recipe_type ASC
      LIMIT 1
    `;

    // Distinct ingredient names across all recipes
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

/**
 * “Recipe card data” with a bit more detail:
 * - total recipes
 * - recipes created in the last 7 days
 * - type breakdown (counts per recipe_type)
 * - topType
 * - latest recipe
 */
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

/* =============================================================================
 * Recipes — Filtered list, paging, basic lists, by-id
 * =============================================================================
 */

type SortCol = "name" | "date" | "type";
type SortDir = "asc" | "desc";

/**
 * Fetch a filtered, paginated recipe list for the **current user**.
 *
 * Supports two calling styles:
 *  - (query: string, page?: number, opts?: { type, sort, order })
 *  - ({ query?, type?, sort?, order?, page? })
 *
 * This is the main query backing the recipes table UI.
 */
type FetchFilteredArgs = {
  userId: string;
  query: string;
  page: number;
  sort: "name" | "date" | "type";
  order: "asc" | "desc";
  type: string;
};

type SortKey = "name" | "date" | "type";
type SortOrder = "asc" | "desc";

export async function fetchFilteredRecipes(
  userId: string,
  query: string,
  currentPage: number,
  options: { sort: SortKey; order: SortOrder; type: string | null }
): Promise<RecipeForm[]> {
  let { sort, order, type } = options;
  const searchTerm = `%${query}%`;
  const offset = (currentPage - 1) * RECIPES_PAGE_SIZE;

  // 👇 extra guard: treat "" as no filter
  const effectiveType = type && type.trim().length > 0 ? type : null;

  const rows = await sql<RecipeRowWithSavedBy[]>`
    SELECT
      id,
      user_id,
      recipe_name,
      recipe_type,
      difficulty,
      recipe_ingredients,
      recipe_ingredients_structured,
      recipe_steps,
      equipment,
      allergens,
      dietary_flags,
      servings,
      prep_time_min,
      calories_total,
      estimated_cost_total,
      status,
      recipe_created_at,
      recipe_updated_at,
      saved_by_user_ids
    FROM public.recipes r
    WHERE
      (
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
      )
      AND (
        ${searchTerm} = '%%'
        OR r.recipe_name ILIKE ${searchTerm}
      )
      AND (
        ${effectiveType}::recipe_type_enum IS NULL
        OR r.recipe_type = ${effectiveType}::recipe_type_enum
      )
    ORDER BY
      CASE WHEN ${sort} = 'name' THEN r.recipe_name END ${
    order === "asc" ? sql`ASC` : sql`DESC`
  },
      CASE WHEN ${sort} = 'date' THEN r.recipe_created_at END ${
    order === "asc" ? sql`ASC` : sql`DESC`
  },
      CASE WHEN ${sort} = 'type' THEN r.recipe_type END ${
    order === "asc" ? sql`ASC` : sql`DESC`
  }
    LIMIT ${RECIPES_PAGE_SIZE} OFFSET ${offset}
  `;

  return rows.map(({ saved_by_user_ids, ...r }) => ({
    ...r,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
  }));
}

/**
 * Count total recipes matching the SAME filters as fetchFilteredRecipes.
 * This is used for pagination (total rows).
 *
 * Keeping it in sync with the list query prevents pagination drift.
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
 * Compute total pages for recipes given the same filters as the list query.
 *
 * Accepts:
 *  - string: treated as the free-text search
 *  - { query?: string; type?: string }
 *
 * Uses RECIPES_PAGE_SIZE to compute Math.ceil(count / size).
 */

export async function fetchRecipesPages({
  query,
  type,
  userId,
}: {
  query: string;
  type: string | null;
  userId: string;
}): Promise<number> {
  const searchTerm = `%${query}%`;

  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM public.recipes r
    WHERE
      (
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
      )
      AND (
        ${searchTerm} = '%%'
        OR r.recipe_name ILIKE ${searchTerm}
      )
      AND (
        ${type}::recipe_type_enum IS NULL      
        OR r.recipe_type = ${type}::recipe_type_enum
      )
  `;

  const count = rows[0]?.count ?? 0;
  return Math.ceil(count / RECIPES_PAGE_SIZE);
}

/**
 * Fetch a minimal list of recipes (id, name, type) ordered by name.
 * Useful for select dropdowns, multiselects, etc.
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

/**
 * Fetch a recipe by id for the **current user**, returning a shape
 * designed for the RecipeForm UI.
 *
 * Null when not found / unauthorized.
 */
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

/**
 * Fetch a user by id.
 * Helper for forms / admin UI; throws if id is missing.
 */
export async function fetchUserById(id: string) {
  if (!id) throw new Error("fetchUserById: id is required");
  const rows = await sql<UserForm[]>`
    SELECT id, name, user_name, last_name, email, password, country, language
    FROM public.users
    WHERE id = ${id}::uuid
  `;
  return rows[0] ?? null;
}

/**
 * Fetch a specific recipe by id **for the current owner**.
 * Similar to fetchRecipeById but always resolves user via requireUserId().
 */

// Row type used when we also select saved_by_user_ids
type RecipeRowWithSavedBy = RecipeForm & {
  saved_by_user_ids: string[] | null;
};

export async function fetchRecipeByIdForOwner(
  recipeId: string,
  userId: string
): Promise<RecipeForm | null> {
  const rows = await sql<RecipeRowWithSavedBy[]>`
    SELECT
      id,
      user_id,
      recipe_name,
      recipe_type,
      difficulty,
      recipe_ingredients,
      recipe_ingredients_structured,
      recipe_steps,
      equipment,
      allergens,
      dietary_flags,
      servings,
      prep_time_min,
      calories_total,
      estimated_cost_total,
      status,
      recipe_created_at,
      recipe_updated_at,
      saved_by_user_ids
    FROM public.recipes r
    WHERE
      r.id = ${recipeId}::uuid
      AND (
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
      )
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const { saved_by_user_ids, ...r } = rows[0];

  return {
    ...r,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
  };
}

// Local row type for this query only
type RecipeRowForUser = RecipeForm & {
  saved_by_user_ids: string[] | null;
};

export async function fetchRecipesForUser(
  userId: string
): Promise<RecipeForm[]> {
  console.log("fetchRecipesForUser userId =", userId); // TEMP debug log

  const rows = await sql<RecipeRowForUser[]>`
    SELECT
      id,
      user_id,
      recipe_name,
      recipe_type,
      difficulty,
      recipe_ingredients,
      recipe_ingredients_structured,
      recipe_steps,
      equipment,
      allergens,
      dietary_flags,
      servings,
      prep_time_min,
      calories_total,
      estimated_cost_total,
      status,
      recipe_created_at,
      recipe_updated_at,
      saved_by_user_ids
    FROM public.recipes r
    WHERE
      r.user_id = ${userId}::uuid
      OR ${userId}::uuid = ANY(r.saved_by_user_ids)
    ORDER BY r.recipe_created_at DESC
  `;

  console.log("fetchRecipesForUser rows length =", rows.length); // TEMP debug

  return rows.map(({ saved_by_user_ids, ...r }) => ({
    ...r,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
  }));
}

/* =============================================================================
 * Shopping list / Structured ingredients
 * =============================================================================
 */

/**
 * Legacy helper: fetch all structured ingredients for a user.
 *
 * NOTE: This function is tolerant to two storage formats:
 *  - JSON array already deserialized by postgres.js
 *  - JSON string stored in the column
 */
export async function fetchAllStructuredIngredientsForUser(
  userId: string
): Promise<IncomingIngredientPayload[]> {
  const rows = await sql<RecipeIngredientsRow[]>/* sql */ `
    SELECT recipe_ingredients_structured
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
  `;

  const result: IncomingIngredientPayload[] = [];

  for (const row of rows) {
    const raw = row.recipe_ingredients_structured;
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

/**
 * Normalize whatever comes from recipe_ingredients_structured
 * into a plain array of IncomingIngredientPayload.
 *
 * - Accepts: null/undefined, already-parsed arrays, or JSON strings.
 * - Fails soft and returns [] on parse errors or unexpected shapes.
 */
function normalizeStructuredIngredients(
  raw: unknown
): IncomingIngredientPayload[] {
  if (!raw) return [];

  // Already parsed JSON array
  if (Array.isArray(raw)) {
    return raw as IncomingIngredientPayload[];
  }

  // Stringified JSON
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as IncomingIngredientPayload[];
      }
    } catch (e) {
      console.error("Failed to parse recipe_ingredients_structured:", e);
    }
  }

  return [];
}

/**
 * Fetch all structured ingredients for a user.
 *
 * If `recipeIds` is provided, only those recipes are included.
 * This is the main entry point for the shopping list aggregation:
 * it returns a flat list of ingredients ready to be grouped/merged by the UI.
 */
export async function fetchIngredientsForUser(
  userId: string,
  recipeIds?: string[]
): Promise<IncomingIngredientPayload[]> {
  const rows = await sql<RecipeIngredientsRow[]>`
    SELECT recipe_ingredients_structured
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
    ${
      recipeIds && recipeIds.length > 0
        ? sql`AND id IN ${sql(recipeIds)}`
        : sql``
    }
  `;

  const all: IncomingIngredientPayload[] = [];

  for (const row of rows) {
    const parsed = parseStructuredIngredients(
      row.recipe_ingredients_structured
    );
    if (parsed.length > 0) {
      all.push(...parsed);
    }
  }

  return all;
}

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

/* =============================================================================
 * Release notes + Roadmap
 * =============================================================================
 */

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

/**
 * Fetch all release notes, newest first.
 * Used by the /release-notes page.
 */
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

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    releasedAt: r.released_at,
  }));
}

/**
 * Fetch roadmap items and group them by status:
 * - planned
 * - in_progress
 * - shipped
 *
 * Items are ordered by (status, order_index, created_at).
 */
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
    ORDER BY created_at DESC
  `;

  const planned: RoadmapItem[] = [];
  const inProgress: RoadmapItem[] = [];
  const shipped: RoadmapItem[] = [];

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

/* =============================================================================
 * Discover recipes
 * =============================================================================
 */

// 1) Shape used by the Discover UI cards
export type DiscoverRecipeCard = {
  id: string;
  recipe_name: string;
  recipe_type: RecipeForm["recipe_type"];
  difficulty: RecipeForm["difficulty"];
  recipe_ingredients: string[] | null;
  servings: number | null;
  prep_time_min: number | null;
  created_by_display_name: string | null; // from users.user_name
  recipe_created_at: string;
};

// 2) Internal row shape for the SQL query
type DiscoverRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_type: RecipeForm["recipe_type"];
  difficulty: RecipeForm["difficulty"];
  recipe_ingredients: string[] | null;
  servings: number | null;
  prep_time_min: number | null;
  recipe_created_at: string | Date;
  created_by_display_name: string | null; // users.user_name
};

// 3) List of public recipes for Discover grid
export async function fetchDiscoverRecipes(
  currentUserId?: string | null
): Promise<DiscoverRecipeCard[]> {
  const rows = await sql<DiscoverRecipeRow[]>`
    SELECT
      r.id,
      r.recipe_name,
      r.recipe_type,
      r.recipe_ingredients,
      r.difficulty,
      r.servings,
      r.prep_time_min,
      r.recipe_created_at,
      u.user_name AS created_by_display_name  -- from users.user_name
    FROM public.recipes r
    LEFT JOIN public.users u ON u.id = r.user_id
    WHERE r.status = 'public'
      ${
        currentUserId
          ? sql`AND (r.user_id IS NULL OR r.user_id <> ${currentUserId}::uuid)`
          : sql``
      }
    ORDER BY r.recipe_created_at DESC
  `;

  return rows.map((r) => ({
    id: r.id,
    recipe_name: r.recipe_name,
    recipe_type: r.recipe_type,
    recipe_ingredients: r.recipe_ingredients,
    difficulty: r.difficulty,
    servings: r.servings,
    prep_time_min: r.prep_time_min,
    created_by_display_name: r.created_by_display_name,
    recipe_created_at:
      typeof r.recipe_created_at === "string"
        ? r.recipe_created_at
        : r.recipe_created_at.toISOString(),
  }));
}

// 4) Single public recipe, used on Discover detail page
export async function fetchPublicRecipeById(
  id: string
): Promise<PublicRecipeDetail | null> {
  const rows = await sql<PublicRecipeDetail[]>`
    SELECT
      r.id,
      r.user_id,
      r.recipe_name,
      r.recipe_type,
      r.difficulty,
      r.recipe_ingredients,
      r.recipe_ingredients_structured,
      r.recipe_steps,
      r.equipment,
      r.allergens,
      r.dietary_flags,
      r.servings,
      r.prep_time_min,
      r.calories_total,
      r.estimated_cost_total,
      r.status,
      r.recipe_created_at,
      r.recipe_updated_at,
      u.user_name AS created_by_display_name
    FROM public.recipes r
    LEFT JOIN public.users u ON u.id = r.user_id
    WHERE r.id = ${id}::uuid
      AND r.status = 'public'
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const r = rows[0];

  return {
    ...r,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
  };
}
