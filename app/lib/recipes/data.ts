/* =============================================================================
 * Recipes — Data Access (queries only)
 * =============================================================================
 * Responsibilities:
 * - Dashboard metrics (revenue + recipe KPIs)
 * - Recipe lists, detail, and owner/saved views
 * - Structured ingredients lookups for shopping lists
 *
 * All reads go through here; writes live in lib/recipes/actions.ts.
 * =============================================================================
 */

"use server";
import "server-only";

import { requireUserId } from "../auth/helpers";
import { sql } from "../db";

export type RecipeListItem = RecipeForm & {
  owner_relationship: "owned" | "imported";
};

import type {
  CardData,
  LatestRecipeRaw,
  RecipeField,
  RecipeForm,
  Revenue,
} from "../types/definitions";

/* =============================================================================
 * Shared constants + row types
 * =============================================================================
 */

/** Single source of truth for recipes pagination — keep UI + queries in sync. */
const RECIPES_PAGE_SIZE = 8;

/** Simple count rows for type breakdowns. */
type TypeCountRow = { recipe_type: string | null; count: number };

/** Compact shape for “latest recipe” sections. */
type LatestRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_created_at: string;
};

/**
 * Full recipe row as it exists in Postgres.
 * Used when we need *all* columns, close to the DB schema.
 */
type DbRecipeRow = {
  id: string;
  user_id: string | null;
  recipe_name: string;
  recipe_type: RecipeForm["recipe_type"];
  difficulty: RecipeForm["difficulty"];
  recipe_ingredients: string[] | null;
  recipe_ingredients_structured: unknown | null;
  recipe_steps: string[] | null;
  equipment: string[] | null;
  allergens: string[] | null;
  dietary_flags: string[] | null;
  servings: number | null;
  prep_time_min: number | null;
  calories_total: number | null;
  estimated_cost_total: string | null;
  status: RecipeForm["status"];
  recipe_created_at: string;
  recipe_updated_at: string | null;
};

/** Local row type for fetchRecipesForUser (same shape as above). */
type RecipeRowForUser = RecipeForm & {
  saved_by_user_ids: string[] | null;
};

/** Minimal shape used specifically by the shopping list picker UI. */
export type ShoppingListRecipe = Pick<RecipeForm, "id" | "recipe_name">;

/* =============================================================================
 * Revenue (demo dashboard)
 * =============================================================================
 */

/**
 * Demo revenue table — used by the starter dashboard widgets.
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
 * Recipes — latest / single recipe detail
 * =============================================================================
 */

/**
 * Latest recipes for the **current user**, newest first.
 * Used by dashboard “latest recipes” section.
 */
export async function fetchLatestRecipes() {
  const userId = await requireUserId();
  const data = await sql<LatestRecipeRaw[]> /* sql */ `
    SELECT
      id,
      recipe_name,
      recipe_created_at,
      recipe_ingredients,
      recipe_steps,
      recipe_type
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
    ORDER BY recipe_created_at DESC
    LIMIT 5
  `;
  return data;
}

/**
 * Fetch a single recipe by id **for the current user**.
 *
 * Returns null when the recipe does not exist or does not belong to the user.
 * Used by the full recipe viewer/editor.
 */
export async function getRecipeById(id: string): Promise<DbRecipeRow | null> {
  const userId = await requireUserId();

  const rows = await sql<DbRecipeRow[]> /* sql */ `
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

/**
 * Fetch a recipe by id for the **current user**, returning a shape
 * designed for the RecipeForm UI (arrays are always `string[]`).
 *
 * Returns null when not found / unauthorized.
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

export type RecipeForEdit = RecipeForm & {
  saved_by_count: number;
};

export async function fetchRecipeForEdit(
  id: string,
): Promise<RecipeForEdit | null> {
  const userId = await requireUserId();

  const rows = await sql<RecipeForEdit[]>`
    SELECT
      r.id,
      r.recipe_name,
      r.recipe_type,
      r.recipe_ingredients,
      r.recipe_ingredients_structured,
      r.recipe_steps,
      r.equipment,
      r.allergens,
      r.dietary_flags,
      r.servings,
      r.prep_time_min,
      r.difficulty,
      r.status,
      r.calories_total,
      r.estimated_cost_total,
      (r.recipe_created_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_created_at,
      (r.recipe_updated_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_updated_at,
      COALESCE(cardinality(r.saved_by_user_ids), 0)::int AS saved_by_count
    FROM public.recipes r
    WHERE r.id = ${id}::uuid AND r.user_id = ${userId}::uuid
    LIMIT 1;
  `;

  const r = rows[0];
  if (!r) return null;

  // keep arrays non-null, same as fetchRecipeById
  return {
    ...r,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
  };
}

/**
 * Fetch a recipe by id where the caller is either the **owner** OR
 * has the recipe in `saved_by_user_ids`.
 *
 * Used by the Discover → “import / view” flows.
 */

/** Recipe row plus `saved_by_user_ids` for “owner OR saved” views. */
export type RecipeWithOwner = RecipeForm & {
  user_id: string;
  saved_by_count?: number | null;
};

type RecipeRowWithSavedBy = RecipeForm & {
  user_id: string;
  saved_by_user_ids: string[] | null;
};

export async function fetchRecipeByIdForOwner(
  recipeId: string,
  userId: string,
): Promise<RecipeWithOwner | null> {
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
      AND r.user_id = ${userId}::uuid  -- edit page: only owner can edit
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const { saved_by_user_ids, ...r } = rows[0];
  const saved_by_count = saved_by_user_ids ? saved_by_user_ids.length : 0;

  return {
    ...r,
    saved_by_count,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
  };
}

/* =============================================================================
 * Dashboard KPIs / cards
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
    const totalRecipesPromise = sql<{ count: number }[]> /* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    // Average number of ingredients per recipe
    const avgIngredientsPromise = sql /* sql */ `
      SELECT COALESCE(AVG(CARDINALITY(r.recipe_ingredients)), 0)::float AS avg_count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    // Most common recipe_type for the user
    const topCategoryPromise = sql /* sql */ `
      SELECT r.recipe_type, COUNT(*)::int AS c
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid AND r.recipe_type IS NOT NULL
      GROUP BY r.recipe_type
      ORDER BY c DESC, r.recipe_type ASC
      LIMIT 1
    `;

    // Distinct ingredient names across all recipes
    const totalIngredientsPromise = sql /* sql */ `
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
    const totalRecipesPromise = sql /* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
    `;

    const recentRecipesPromise = sql /* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
        AND r.recipe_created_at >= NOW() - INTERVAL '7 days'
    `;

    const typesBreakdownPromise = sql<TypeCountRow[]> /* sql */ `
      SELECT r.recipe_type, COUNT(*)::int AS count
      FROM public.recipes r
      WHERE r.user_id = ${userId}::uuid
      GROUP BY r.recipe_type
      ORDER BY count DESC, r.recipe_type ASC
    `;

    const latestRecipePromise = sql<LatestRecipeRow[]> /* sql */ `
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
 * Recipe lists / filtering / pagination
 * =============================================================================
 */

// All sort keys supported by the UI
export type SortKey =
  | "name"
  | "date"
  | "type"
  | "difficulty"
  | "owner"
  | "time"
  | "visibility";

type SortOrder = "asc" | "desc";

/**
 * Fetch a filtered, paginated list of recipes for a given user.
 *
 * Includes recipes they **own** and recipes they’ve **saved**.
 * This powers the main recipes table UI.
 */
export async function fetchFilteredRecipes(
  query: string,
  currentPage: number,
  {
    sort,
    order,
    type,
    userId,
  }: {
    sort: SortKey;
    order: SortOrder;
    type: string | null;
    userId: string;
  },
): Promise<RecipeListItem[]> {
  const offset = (currentPage - 1) * RECIPES_PAGE_SIZE;
  const searchQuery = query.trim();

  type Row = RecipeForm & {
    user_id: string;
  };

  const hasSearch = searchQuery.length > 0;
  const searchTerm = `%${searchQuery}%`;

  // Expression used for "owner" sort (owned vs imported)
  const ownerExpr = sql`CASE WHEN r.user_id = ${userId}::uuid THEN 0 ELSE 1 END`;

  // Decide which column/expression to sort by
  const sortExpr =
    sort === "name"
      ? sql`r.recipe_name`
      : sort === "type"
        ? sql`r.recipe_type`
        : sort === "difficulty"
          ? sql`r.difficulty`
          : sort === "time"
            ? sql`r.prep_time_min`
            : sort === "visibility"
              ? sql`r.status`
              : sort === "owner"
                ? ownerExpr
                : sql`r.recipe_created_at`; // default = date

  const directionSql = order === "asc" ? sql`ASC` : sql`DESC`;

  const rows = await sql<Row[]>`
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
      recipe_updated_at
    FROM public.recipes r
    WHERE
      (
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
      )
      AND (
        ${!hasSearch}
        OR r.recipe_name ILIKE ${searchTerm}
        OR r.recipe_type::text ILIKE ${searchTerm}
        OR EXISTS (
          SELECT 1
          FROM unnest(r.recipe_ingredients) AS ing
          WHERE ing ILIKE ${searchTerm}
        )
        OR EXISTS (
          SELECT 1
          FROM unnest(r.recipe_steps) AS st
          WHERE st ILIKE ${searchTerm}
        )
      )
      AND (
        ${type}::recipe_type_enum IS NULL
        OR r.recipe_type = ${type}::recipe_type_enum
      )
    ORDER BY
      ${sortExpr} ${directionSql},
      r.recipe_created_at DESC  -- stable tiebreaker
    LIMIT ${RECIPES_PAGE_SIZE}
    OFFSET ${offset}
  `;

  return rows.map((r) => ({
    ...r,
    recipe_ingredients: r.recipe_ingredients ?? [],
    recipe_steps: r.recipe_steps ?? [],
    equipment: r.equipment ?? [],
    allergens: r.allergens ?? [],
    dietary_flags: r.dietary_flags ?? [],
    owner_relationship: r.user_id === userId ? "owned" : "imported",
  }));
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
 * Fetch all recipes accessible to a user (owned OR saved),
 * ordered by newest first.
 *
 * Used by the Discover → “save/import” flows and the shopping list picker.
 */
export async function fetchRecipesForUser(
  userId: string,
): Promise<RecipeForm[]> {
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
 * Compute the total number of recipes for **pagination**, matching the
 * same filters as `fetchFilteredRecipes`.
 */
export async function fetchRecipesPages({
  query,
  type,
  userId,
}: {
  query: string;
  type: string | null;
  userId: string;
}): Promise<{ pages: number; total: number }> {
  const searchQuery = query.trim();
  const hasSearch = searchQuery.length > 0;
  const searchTerm = `%${searchQuery}%`;

  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM public.recipes r
    WHERE
      (
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
      )
      AND (
        ${!hasSearch}
        OR r.recipe_name ILIKE ${searchTerm}
        OR r.recipe_type::text ILIKE ${searchTerm}
        OR EXISTS (
          SELECT 1
          FROM unnest(r.recipe_ingredients) AS ing
          WHERE ing ILIKE ${searchTerm}
        )
        OR EXISTS (
          SELECT 1
          FROM unnest(r.recipe_steps) AS st
          WHERE st ILIKE ${searchTerm}
        )
      )
      AND (
        ${type}::recipe_type_enum IS NULL
        OR r.recipe_type = ${type}::recipe_type_enum
      )
  `;

  const total = rows[0]?.count ?? 0;
  const pages = Math.ceil(total / RECIPES_PAGE_SIZE) || 1;

  return { pages, total };
}

/**
 * Count total recipes matching filters for the **current user**.
 *
 * This is older logic used by some dashboards and only counts recipes
 * the user **owns** (does NOT include `saved_by_user_ids`).
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

  const totalRes = await sql<{ count: number }[]> /* sql */ `
    SELECT COUNT(*)::int AS count
    FROM public.recipes AS r
    ${whereSql}
  `;

  const rows = pickRows<{ count: number }>(totalRes);
  return rows[0]?.count ?? 0;
}

/* =============================================================================
 * Generic helpers (internal)
 * =============================================================================
 */

/**
 * Normalize driver result shapes:
 * - @vercel/postgres → result.rows
 * - postgres.js      → result is already an array
 */
function pickRows<T = any>(result: any): T[] {
  return Array.isArray(result) ? result : (result?.rows ?? []);
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

/** Row used by the viewer: RecipeForm + user_id + saved_by_count for visibility UI */
export type RecipeViewerItem = RecipeForm & {
  user_id: string;
  saved_by_count: number;
};

export async function fetchRecipeByIdForOwnerOrSaved(
  id: string,
  userId: string,
): Promise<RecipeViewerItem | null> {
  const rows = await sql<RecipeViewerItem[]>`
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
      COALESCE(CARDINALITY(r.saved_by_user_ids), 0) AS saved_by_count
    FROM public.recipes r
    WHERE
      r.id = ${id}::uuid
      AND (
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
      )
    LIMIT 1
  `;

  return rows[0] ?? null;
}

/**
 * Total recipes in a user's library (owned + imported).
 * Used for membership limits.
 */
export async function fetchRecipeLibraryCount(userId: string): Promise<number> {
  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM public.recipes r
    WHERE
      r.user_id = ${userId}::uuid
      OR ${userId}::uuid = ANY(r.saved_by_user_ids)
  `;

  return rows[0]?.count ?? 0;
}

/** Simple aggregate counts for a user’s recipe library (owned vs imported). */
export async function fetchRecipeCountsForUser(userId: string): Promise<{
  owned: number;
  imported: number;
}> {
  const rows = await sql<{ owned: number; imported: number }[]>`
    SELECT
      COALESCE(
        COUNT(*) FILTER (WHERE r.user_id = ${userId}::uuid),
        0
      )::int AS owned,
      COALESCE(
        COUNT(*) FILTER (
          WHERE ${userId}::uuid = ANY(r.saved_by_user_ids)
            AND (r.user_id IS NULL OR r.user_id <> ${userId}::uuid)
        ),
        0
      )::int AS imported
    FROM public.recipes r
  `;

  const row = rows[0];
  return {
    owned: row?.owned ?? 0,
    imported: row?.imported ?? 0,
  };
}
