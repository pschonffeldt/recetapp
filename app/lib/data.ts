/* ============================================
 * Data Access Layer (Postgres via postgres.js)
 * Centralized queries for dashboard, invoices,
 * and recipes.
 * ============================================ */

import postgres from "postgres";
import {
  RecipesTable,
  Revenue,
  RecipeField,
  RecipeForm,
  LatestRecipeRaw,
  CardData,
  UserForm,
  User,
} from "./definitions";

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
  try {
    // Dashboard widget: intentional fixed limit (not tied to RECIPES_PAGE_SIZE).
    // If you need a different count, change 5 here or add a parameter.
    const data = await sql<LatestRecipeRaw[]>`
      SELECT
        id,
        recipe_name,
        recipe_created_at,
        recipe_ingredients,
        recipe_steps,
        recipe_type
      FROM recipes
      ORDER BY recipe_created_at DESC
      LIMIT 5  -- intentional fixed limit for dashboard widget
    `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest recipes.");
  }
}

/**
 * Fetch dashboard KPI card data (counts + totals by status).
 * Note: Split into parallel queries for demonstration purposes.
 * @returns Promise<{ numberOfCustomers: number; numberOfInvoices: number; totalPaidInvoices: string; totalPendingInvoices: string; }>
 */
export async function fetchCardData(): Promise<CardData> {
  try {
    // Kick off all four queries in parallel for performance
    // 1) Total recipes
    const totalRecipesPromise = sql/* sql */ `
      SELECT COUNT(*)::int AS count
      FROM recipes
    `;

    // 2) Average ingredients per recipe
    const avgIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(AVG(CARDINALITY(recipe_ingredients)), 0)::float AS avg_count
      FROM recipes
    `;

    // 3) Most recurring category
    const topCategoryPromise = sql/* sql */ `
      SELECT recipe_type, COUNT(*)::int AS c
      FROM recipes
      WHERE recipe_type IS NOT NULL
      GROUP BY recipe_type
      ORDER BY c DESC
      LIMIT 1
    `;

    // 4) Total unique ingredients across all recipes
    const totalIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(COUNT(DISTINCT TRIM(LOWER(ing))), 0)::int AS count
      FROM (
        SELECT UNNEST(recipe_ingredients) AS ing
        FROM recipes
        WHERE recipe_ingredients IS NOT NULL
      ) AS t
    `;

    // 5) Wait for all results
    const [totalRecipesRes, avgIngrRes, topCatRes, totalIngrRes] =
      await Promise.all([
        totalRecipesPromise,
        avgIngredientsPromise,
        topCategoryPromise,
        totalIngredientsPromise,
      ]);

    // 6) Defensive reads & normalization
    const totalRecipes = Number(totalRecipesRes?.[0]?.count ?? 0);
    const avgIngredients = Number(avgIngrRes?.[0]?.avg_count ?? 0);
    const mostRecurringCategory =
      (topCatRes?.[0]?.recipe_type as string) ?? "—";
    const totalIngredients = Number(totalIngrRes?.[0]?.count ?? 0);

    // 7) Return consolidated card data
    return {
      totalRecipes,
      avgIngredients,
      mostRecurringCategory,
      totalIngredients,
    };
  } catch (error) {
    // 8) Error handling
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe card data.");
  }
}

export async function fetchRecipeCardData() {
  try {
    // 1) Run four aggregated queries in parallel
    const totalRecipesPromise = sql`SELECT COUNT(*)::int AS count FROM recipes`;

    const recentRecipesPromise = sql`SELECT COUNT(*)::int AS count
          FROM recipes
          WHERE recipe_created_at >= NOW() - INTERVAL '7 days'`;

    const typesBreakdownPromise = sql<TypeCountRow[]>`
        SELECT recipe_type, COUNT(*)::int AS count
        FROM recipes
        GROUP BY recipe_type
        ORDER BY count DESC`;

    const latestRecipePromise = sql<LatestRecipeRow[]>`
        SELECT id, recipe_name, recipe_created_at
        FROM recipes
        ORDER BY recipe_created_at DESC
        LIMIT 1`;

    // 2) Await all results
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

    // 3) Normalize numbers
    const numberOfRecipes = Number(totalRecipesRes?.[0]?.count ?? 0);
    const recipesLast7Days = Number(recentRecipesRes?.[0]?.count ?? 0);

    // 4) Map breakdown to a friendly shape
    const types = (typesBreakdownRes ?? []).map((r) => ({
      type: r.recipe_type ?? "Unknown",
      count: r.count ?? 0,
    }));

    // 5) Compute top type (if any)
    const topType = types.length ? types[0] : null;

    // 6) Pick latest recipe (if any)
    const latest = latestRecipeRes?.[0]
      ? {
          id: latestRecipeRes[0].id,
          name: latestRecipeRes[0].recipe_name,
          createdAt: latestRecipeRes[0].recipe_created_at,
        }
      : null;

    // 7) Return consolidated object
    return {
      numberOfRecipes,
      recipesLast7Days,
      types, // array: [{ type: 'Dessert', count: 12 }, ...]
      topType, // most common type or null
      latest, // { id, name, createdAt } or null
    };
  } catch (error) {
    // 8) Error handling
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe card data.");
  }
}

/* =======================================================
 * Recipes — Filtered List, Paging, Single, List
 * ======================================================= */

type SortCol = "name" | "date" | "type";
type SortDir = "asc" | "desc";

/**
 * Fetch paginated, filtered, and sorted recipes.
 *
 * Accepts either:
 *  - an object with:
 *      - query?: string  (preferred)  → free-text search across name/ingredients/steps/type
 *      - type?: string   (exact match on recipe_type)
 *      - sort?: "name" | "date" | "type"
 *      - order?: "asc" | "desc"
 *      - page?: number   (1-based)
 *
 * Notes:
 *  - Uses RECIPES_PAGE_SIZE for LIMIT/OFFSET.
 *  - WHERE clause mirrors the logic used by the count function to prevent pagination drift.
 */
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
  // -----------------------------
  // 1) Normalize inputs
  //    - Support both object and string overloads.
  //    - Prefer `query`.
  //    - Provide stable defaults for sort/order/page/type.
  // -----------------------------
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
    // Preferred object form
    searchQuery = arg1.query ?? "";
    page = arg1.page ?? 1;
    type = arg1.type ?? "";
    sort = arg1.sort ?? "date";
    order = arg1.order ?? "desc";
  }

  // -----------------------------
  // 2) Paging setup
  // Paging: assumes page >= 1 (callers must clamp).
  // A negative/zero page would yield a negative OFFSET. Postgres treats negative OFFSET ~ 0,
  // but behavior can vary by driver. Always clamp at the caller before invoking this function.
  // -----------------------------

  const offset = (page - 1) * RECIPES_PAGE_SIZE;

  // -----------------------------
  // 3) Build WHERE predicates
  //    - If free-text exists, OR across:
  //        • recipe_name ILIKE
  //        • ingredients[] (UNNEST + ILIKE via EXISTS)
  //        • steps[] (UNNEST + ILIKE via EXISTS)
  //        • recipe_type::text ILIKE (handles enum types)
  //    - Optionally AND an exact recipe_type filter.
  /**
   * ...
   * @param type Exact match on recipe_type (expects canonical enum value or normalized string).
   */
  // -----------------------------
  const predicates: any[] = [];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;

    const nameLike = sql`recipe_name ILIKE ${pat}`;
    const ingredientsLike = sql`EXISTS (
      SELECT 1 FROM unnest(recipe_ingredients) AS ing
      WHERE ing ILIKE ${pat}
    )`;
    const stepsLike = sql`EXISTS (
      SELECT 1 FROM unnest(recipe_steps) AS st
      WHERE st ILIKE ${pat}
    )`;
    // Include type in the free-text search (casts ENUM → text)
    // This is *search*, not the exact filter above.
    const typeLike = sql`recipe_type::text ILIKE ${pat}`;
    // Group all ORs into one predicate to be ANDed later
    predicates.push(
      sql`(${nameLike} OR ${ingredientsLike} OR ${stepsLike} OR ${typeLike})`
    );
  }

  // Exact type filter:
  // NOTE: `type` must be a canonical value.
  // If `recipe_type` is a Postgres ENUM, this expects a valid enum literal.
  // If it's a text/varchar column, callers must pass a normalized canonical string.
  if (type) {
    // type filter expects canonical enum value
    predicates.push(sql`recipe_type = ${type}`);
  }

  // Compose final WHERE using AND across all predicates
  const whereSql = predicates.length ? sql`WHERE ${andAll(predicates)}` : sql``;

  // -----------------------------
  // 4) ORDER BY composition
  //    - Map human-friendly sort key → actual column.
  //    - Default to creation date.
  // -----------------------------
  const sortCol =
    sort === "name"
      ? sql`recipe_name`
      : sort === "type"
      ? sql`recipe_type`
      : sql`recipe_created_at`;
  const dir = order === "asc" ? sql`ASC` : sql`DESC`;

  // -----------------------------
  // 5) Final query with LIMIT/OFFSET
  // -----------------------------
  const result = await sql/* sql */ `
    SELECT id, recipe_name, recipe_ingredients, recipe_steps, recipe_created_at, recipe_type, difficulty, recipe_updated_at
    FROM recipes
    ${whereSql}
    ORDER BY ${sortCol} ${dir}
    LIMIT ${RECIPES_PAGE_SIZE} OFFSET ${offset}
  `;

  // -----------------------------
  // 6) Normalize driver result shape (postgres.js vs @vercel/postgres)
  // -----------------------------
  return pickRows(result);
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
  // 1) Normalize inputs; prefer `query``
  const searchQuery = params.query ?? "";
  const type = params.type ?? "";

  // 2) Build WHERE parts identical to the list query
  const parts: any[] = [];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;

    const nameLike = sql`recipes.recipe_name ILIKE ${pat}`;
    const ingredientsLike = sql`EXISTS (
      SELECT 1 FROM unnest(recipes.recipe_ingredients) AS ing
      WHERE ing ILIKE ${pat}
    )`;
    const stepsLike = sql`EXISTS (
      SELECT 1 FROM unnest(recipes.recipe_steps) AS st
      WHERE st ILIKE ${pat}
    )`;
    const typeLike = sql`recipes.recipe_type::text ILIKE ${pat}`; // search, not exact

    // Single OR block (to be ANDed with exact type if provided)
    parts.push(
      sql`(${nameLike} OR ${ingredientsLike} OR ${stepsLike} OR ${typeLike})`
    );
  }

  if (type) {
    // Exact equality on recipe_type:
    // - ENUM: expects a valid enum literal
    // - TEXT: callers must pass a canonical normalized value
    parts.push(sql`recipes.recipe_type = ${type}`); // type filter expects canonical enum value
  }

  // 3) Combine predicates with AND; empty if no filters provided
  const whereSql = parts.length ? sql`WHERE ${andAll(parts)}` : sql``;

  // 4) COUNT(*) of filtered rows
  const totalRes = await sql<{ count: number }[]>/* sql */ `
    SELECT COUNT(*)::int AS count
    FROM recipes
    ${whereSql}
  `;

  // 5) Normalize and return count safely (0 if no row returned)
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
  // 1) Normalize inputs; prefer `query`
  const searchQuery = typeof arg === "string" ? arg : arg.query ?? "";
  const type = typeof arg === "string" ? "" : arg.type ?? "";

  // 2) Fast-path: no filters → simple table count
  if (!searchQuery && !type) {
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM recipes;
    `;
    return Math.ceil(count / RECIPES_PAGE_SIZE);
  }

  // 3) Build WHERE predicates (identical to list and total)
  const parts: any[] = [];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;
    parts.push(sql`
      (
        recipes.recipe_name ILIKE ${pat}
        OR recipes.recipe_type::text ILIKE ${pat}
        OR EXISTS (SELECT 1 FROM unnest(recipes.recipe_ingredients) AS ing WHERE ing ILIKE ${pat})
        OR EXISTS (SELECT 1 FROM unnest(recipes.recipe_steps)       AS st  WHERE st  ILIKE ${pat})
      )
    `);
  }

  if (type) {
    // Exact type filter — expects canonical enum value / normalized string.
    parts.push(sql`recipes.recipe_type = ${type}`);
  }

  // 4) Compose final WHERE (AND all parts)
  const whereSql =
    parts.length === 0
      ? sql``
      : sql`WHERE ${parts
          .slice(1)
          .reduce((acc, cur) => sql`${acc} AND ${cur}`, parts[0])}`;

  // 5) Count matching rows and convert to total pages using the shared page size
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM recipes
    ${whereSql};
  `;

  return Math.ceil(count / RECIPES_PAGE_SIZE);
}

/**
 * Fetch a minimal list of recipes (id, name, type) ordered by name.
 * Useful for select dropdowns.
 * @returns Promise<RecipeField[]>
 */
export async function fetchRecipes() {
  try {
    // 1) Query minimal fields ordered by name
    const recipes = await sql<RecipeField[]>`
      SELECT
        id,
        recipe_name,
        recipe_type
      FROM recipes
      ORDER BY recipe_name ASC
    `;

    // 2) Return as-is
    return recipes;
  } catch (err) {
    // 3) Error handling
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all recipes.");
  }
}

export async function fetchRecipeById(id: string) {
  try {
    // 1) Fetch a single recipe by UUID (with COALESCE for arrays)
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
        COALESCE(dietary_flags, ARRAY[]::text[])   AS dietary_flags,
        COALESCE(allergens,     ARRAY[]::text[])   AS allergens,
        calories_total,
        estimated_cost_total,                       -- comes back as string
        COALESCE(equipment,     ARRAY[]::text[])   AS equipment,
        (recipe_created_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_created_at,
        (recipe_updated_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_updated_at
      FROM public.recipes
      WHERE id = ${id}::uuid;
    `;

    // 2) Return first row (or null if not found)
    return rows[0] ?? null;
  } catch (error) {
    // 3) Error handling
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
