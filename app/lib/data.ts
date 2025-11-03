/* ============================================
 * Data Access Layer (Postgres via postgres.js)
 * - Centralized queries for dashboard, invoices,
 *    recipes.
 * ============================================ */

import postgres from "postgres";
import {
  RecipesTable,
  Revenue,
  RecipeField,
  RecipeForm,
  LatestRecipeRaw,
  CardData,
} from "./definitions";

/* ================================
 * Database Client
 * ================================ */
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* ================================
 * Pagination
 * ================================ */

/** Items per page used by listings */
const ITEMS_PER_PAGE = 8;

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
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestRecipes() {
  try {
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
      LIMIT 5
    `;

    // No amount/currency formatting needed for recipes
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

// Types for the small aggregated queries
type TypeCountRow = { recipe_type: string | null; count: number };
type LatestRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_created_at: string;
};

export async function fetchRecipeCardData() {
  try {
    // Run in parallel
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

    // Defensive reads
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

    return {
      numberOfRecipes,
      recipesLast7Days,
      types, // array: [{ type: 'Dessert', count: 12 }, ...]
      topType, // most common type or null
      latest, // { id, name, createdAt } or null
    };
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

function pickRows<T = any>(result: any): T[] {
  // Works for both @vercel/postgres (result.rows) and postgres (result is already an array)
  return Array.isArray(result) ? result : result?.rows ?? [];
}

function andAll(parts: any[]) {
  // Build "a AND b AND c" without sql.join
  if (parts.length === 0) return sql``;
  const [first, ...rest] = parts;
  return rest.reduce((acc, cur) => sql`${acc} AND ${cur}`, first);
}

export async function fetchFilteredRecipes(
  arg1:
    | string
    | {
        q?: string;
        type?: string;
        sort?: SortCol;
        order?: SortDir;
        page?: number;
      },
  pageMaybe?: number,
  opts: { type?: string; sort?: SortCol; order?: SortDir } = {}
) {
  // Normalize inputs
  let q = "";
  let page = 1;
  let type = "";
  let sort: SortCol = "date";
  let order: SortDir = "desc";

  if (typeof arg1 === "string") {
    q = arg1 ?? "";
    page = pageMaybe ?? 1;
    type = opts.type ?? "";
    sort = opts.sort ?? "date";
    order = opts.order ?? "desc";
  } else {
    q = arg1.q ?? "";
    page = arg1.page ?? 1;
    type = arg1.type ?? "";
    sort = arg1.sort ?? "date";
    order = arg1.order ?? "desc";
  }

  const PAGE_SIZE = 10;
  const offset = (page - 1) * PAGE_SIZE;

  // WHERE
  const predicates: any[] = [];

  // 🔎 FULL-TEXT-ish search across name + arrays (+ type)
  if (q) {
    const pat = "%" + q + "%";

    const nameLike = sql`recipe_name ILIKE ${pat}`;
    // ingredients is text[]: unnest and ILIKE each element
    const ingredientsLike = sql`EXISTS (
    SELECT 1 FROM unnest(recipe_ingredients) AS ing
    WHERE ing ILIKE ${pat}
  )`;
    // steps is text[] as well
    const stepsLike = sql`EXISTS (
    SELECT 1 FROM unnest(recipe_steps) AS st
    WHERE st ILIKE ${pat}
  )`;
    // if recipe_type is an enum, cast to text
    const typeLike = sql`recipe_type::text ILIKE ${pat}`;

    // group ORs for the search block
    predicates.push(
      sql`(${nameLike} OR ${ingredientsLike} OR ${stepsLike} OR ${typeLike})`
    );
  }

  // existing single-value filter (keeps working)
  if (type) predicates.push(sql`recipe_type = ${type}`);

  const whereSql = predicates.length ? sql`WHERE ${andAll(predicates)}` : sql``;

  // ORDER BY
  const sortCol =
    sort === "name"
      ? sql`recipe_name`
      : sort === "type"
      ? sql`recipe_type`
      : sql`recipe_created_at`;
  const dir = order === "asc" ? sql`ASC` : sql`DESC`;

  const result = await sql/* sql */ `
    SELECT id, recipe_name, recipe_ingredients, recipe_steps, recipe_created_at, recipe_type
    FROM recipes
    ${whereSql}
    ORDER BY ${sortCol} ${dir}
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `;

  return pickRows(result);
}

export async function fetchRecipesTotal(params: { q?: string; type?: string }) {
  const { q = "", type = "" } = params;
  const predicates: any[] = [];
  if (q) predicates.push(sql`recipe_name ILIKE ${"%" + q + "%"}`);
  if (type) predicates.push(sql`recipe_type = ${type}`);
  const whereSql = predicates.length ? sql`WHERE ${andAll(predicates)}` : sql``;

  const totalRes =
    await sql/* sql */ `SELECT COUNT(*)::int AS count FROM recipes ${whereSql}`;
  const rows = pickRows<{ count: number }>(totalRes);
  return rows[0]?.count ?? 0;
}

/**
 * Compute total pages for recipes given a filter query.
 *
 * @param query - Search string for filter
 * @returns Promise<number> totalPages
 */

export async function fetchRecipesPages(
  arg: string | { q?: string; type?: string }
) {
  const q = typeof arg === "string" ? arg : arg.q ?? "";
  const type = typeof arg === "string" ? "" : arg.type ?? "";

  // same page size you use to fetch the list
  const ITEMS_PER_PAGE = 10;

  // no filters: simple fast count
  if (!q && !type) {
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM recipes;
    `;
    return Math.ceil(count / ITEMS_PER_PAGE);
  }

  // build WHERE = (search across fields) AND (optional exact type)
  const parts: any[] = [];

  if (q) {
    const pat = `%${q}%`;
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
    parts.push(sql`recipes.recipe_type = ${type}`);
  }

  // combine with AND, without sql.join (works on all dialect shapes)
  const whereSql =
    parts.length === 0
      ? sql``
      : sql`WHERE ${parts
          .slice(1)
          .reduce((acc, cur) => sql`${acc} AND ${cur}`, parts[0])}`;

  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM recipes
    ${whereSql};
  `;

  return Math.ceil(count / ITEMS_PER_PAGE);
}

/**
 * Fetch a minimal list of recipes (id, name, type) ordered by name.
 * Useful for select dropdowns.
 * @returns Promise<RecipeField[]>
 */
export async function fetchRecipes() {
  try {
    const recipes = await sql<RecipeField[]>`
      SELECT
        id,
        recipe_name,
        recipe_type
      FROM recipes
      ORDER BY recipe_name ASC
    `;

    return recipes;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all recipes.");
  }
}

export async function fetchRecipeById(id: string) {
  try {
    const rows = await sql<RecipeForm[]>`
      SELECT
        id,
        recipe_name,
        recipe_ingredients,
        recipe_steps,
        recipe_type,

        -- NEW
        servings,
        prep_time_min,
        difficulty,
        status,
        COALESCE(dietary_flags, ARRAY[]::text[])   AS dietary_flags,
        COALESCE(allergens,     ARRAY[]::text[])   AS allergens,
        calories_total,
        estimated_cost_total,                       -- comes back as string
        COALESCE(equipment,     ARRAY[]::text[])   AS equipment
      FROM public.recipes
      WHERE id = ${id}::uuid;
    `;

    return rows[0] ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe.");
  }
}
