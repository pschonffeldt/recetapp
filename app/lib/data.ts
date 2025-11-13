import postgres from "postgres";
import {
  Revenue,
  RecipeField,
  RecipeForm,
  LatestRecipeRaw,
  CardData,
  UserForm,
} from "./definitions";
import { requireUserId } from "@/app/lib/auth-helpers";

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
  try {
    const data = await sql<LatestRecipeRaw[]>`
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest recipes.");
  }
}

/* =======================================================
 * Dashboard KPI
 * Fetch dashboard KPI card data (counts + totals by status).
 * Note: Split into parallel queries for demonstration purposes.
 * @returns Promise<{ numberOfCustomers: number; numberOfInvoices: number; totalPaidInvoices: string; totalPendingInvoices: string; }>
 * ======================================================= */

export async function fetchCardData(): Promise<CardData> {
  const userId = await requireUserId();
  try {
    const totalRecipesPromise = sql/* sql */ `
      SELECT COUNT(*)::int AS count
      FROM public.recipes
      WHERE user_id = ${userId}::uuid
    `;

    const avgIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(AVG(CARDINALITY(recipe_ingredients)), 0)::float AS avg_count
      FROM public.recipes
      WHERE user_id = ${userId}::uuid
    `;

    const topCategoryPromise = sql/* sql */ `
      SELECT recipe_type, COUNT(*)::int AS c
      FROM public.recipes
      WHERE user_id = ${userId}::uuid AND recipe_type IS NOT NULL
      GROUP BY recipe_type
      ORDER BY c DESC
      LIMIT 1
    `;

    const totalIngredientsPromise = sql/* sql */ `
      SELECT COALESCE(COUNT(DISTINCT TRIM(LOWER(ing))), 0)::int AS count
      FROM (
        SELECT UNNEST(recipe_ingredients) AS ing
        FROM public.recipes
        WHERE user_id = ${userId}::uuid AND recipe_ingredients IS NOT NULL
      ) AS t
    `;

    const [totalRecipesRes, avgIngrRes, topCatRes, totalIngrRes] =
      await Promise.all([
        totalRecipesPromise,
        avgIngredientsPromise,
        topCategoryPromise,
        totalIngredientsPromise,
      ]);

    const totalRecipes = Number(totalRecipesRes?.[0]?.count ?? 0);
    const avgIngredients = Number(avgIngrRes?.[0]?.avg_count ?? 0);
    const mostRecurringCategory =
      (topCatRes?.[0]?.recipe_type as string) ?? "—";
    const totalIngredients = Number(totalIngrRes?.[0]?.count ?? 0);

    return {
      totalRecipes,
      avgIngredients,
      mostRecurringCategory,
      totalIngredients,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe card data.");
  }
}

export async function fetchRecipeCardData() {
  const userId = await requireUserId();
  try {
    const totalRecipesPromise = sql`
      SELECT COUNT(*)::int AS count FROM public.recipes
      WHERE user_id = ${userId}::uuid
    `;

    const recentRecipesPromise = sql`
      SELECT COUNT(*)::int AS count
      FROM public.recipes
      WHERE user_id = ${userId}::uuid
        AND recipe_created_at >= NOW() - INTERVAL '7 days'
    `;

    const typesBreakdownPromise = sql<TypeCountRow[]>`
      SELECT recipe_type, COUNT(*)::int AS count
      FROM public.recipes
      WHERE user_id = ${userId}::uuid
      GROUP BY recipe_type
      ORDER BY count DESC
    `;

    const latestRecipePromise = sql<LatestRecipeRow[]>`
      SELECT id, recipe_name, recipe_created_at
      FROM public.recipes
      WHERE user_id = ${userId}::uuid
      ORDER BY recipe_created_at DESC
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
  } catch (error) {
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
  const userId = await requireUserId();

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

  const offset = (page - 1) * RECIPES_PAGE_SIZE;

  const predicates: any[] = [
    sql`user_id = ${userId}::uuid`, // <-- ALWAYS scope to owner
  ];

  if (searchQuery) {
    const pat = `%${searchQuery}%`;
    const nameLike = sql`recipe_name ILIKE ${pat}`;
    const ingredientsLike = sql`EXISTS (SELECT 1 FROM unnest(recipe_ingredients) AS ing WHERE ing ILIKE ${pat})`;
    const stepsLike = sql`EXISTS (SELECT 1 FROM unnest(recipe_steps)       AS st  WHERE st  ILIKE ${pat})`;
    const typeLike = sql`recipe_type::text ILIKE ${pat}`;
    predicates.push(
      sql`(${nameLike} OR ${ingredientsLike} OR ${stepsLike} OR ${typeLike})`
    );
  }

  if (type) predicates.push(sql`recipe_type = ${type}`);

  const whereSql = sql`WHERE ${andAll(predicates)}`;

  const sortCol =
    sort === "name"
      ? sql`recipe_name`
      : sort === "type"
      ? sql`recipe_type`
      : sql`recipe_created_at`;
  const dir = order === "asc" ? sql`ASC` : sql`DESC`;

  const result = await sql/* sql */ `
    SELECT id, recipe_name, recipe_ingredients, recipe_steps, recipe_created_at, recipe_type, difficulty, recipe_updated_at
    FROM public.recipes
    ${whereSql}
    ORDER BY ${sortCol} ${dir}
    LIMIT ${RECIPES_PAGE_SIZE} OFFSET ${offset}
  `;
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
  const userId = await requireUserId();
  const searchQuery = params.query ?? "";
  const type = params.type ?? "";

  const parts: any[] = [sql`recipes.user_id = ${userId}::uuid`];

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

  if (type) parts.push(sql`recipes.recipe_type = ${type}`);

  const whereSql = sql`WHERE ${andAll(parts)}`;

  const totalRes = await sql<{ count: number }[]>/* sql */ `
    SELECT COUNT(*)::int AS count
    FROM public.recipes AS recipes
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

  const parts: any[] = [sql`recipes.user_id = ${userId}::uuid`];

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
  if (type) parts.push(sql`recipes.recipe_type = ${type}`);

  const whereSql = sql`WHERE ${andAll(parts)}`;

  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM public.recipes AS recipes
    ${whereSql}
  `;
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
 * Notifications
 * ======================================================= */

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
