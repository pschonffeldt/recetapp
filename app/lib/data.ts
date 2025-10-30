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

/**
 * Fetch a paginated list of recipes matching a query across:
 * - recipe_name, recipe_type
 * - ingredients (unnest on text[])
 * - steps (unnest on text[])
 *
 * @param query       - Search string for filter
 * @param currentPage - 1-based page index
 * @returns Promise<RecipesTable[]>
 */
export async function fetchFilteredRecipes(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const q = `%${query}%`;

  // Build WHERE clause only if query exists to avoid full-table ILIKEs:
  const where = query
    ? sql`
        WHERE
          recipes.recipe_name ILIKE ${q} OR
          recipes.recipe_type::text ILIKE ${q} OR
          EXISTS (SELECT 1 FROM unnest(recipes.recipe_ingredients) ing WHERE ing ILIKE ${q}) OR
          EXISTS (SELECT 1 FROM unnest(recipes.recipe_steps) st WHERE st ILIKE ${q})
      `
    : sql``;

  const rows = await sql<RecipesTable[]>`
    SELECT
      recipes.id,
      recipes.recipe_name,
      recipes.recipe_ingredients,
      recipes.recipe_steps,
      recipes.recipe_created_at,
      recipes.recipe_type
    FROM recipes
    ${where}
    ORDER BY recipes.recipe_created_at DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
  `;

  return rows;
}

/**
 * Compute total pages for recipes given a filter query.
 *
 * @param query - Search string for filter
 * @returns Promise<number> totalPages
 */
export async function fetchRecipesPages(query: string) {
  if (!query) {
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM recipes;
    `;
    return Math.ceil(count / ITEMS_PER_PAGE);
  }

  const q = `%${query}%`;
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM recipes
    WHERE
      recipes.recipe_name ILIKE ${q} OR
      recipes.recipe_type::text ILIKE ${q} OR
      EXISTS (SELECT 1 FROM unnest(recipes.recipe_ingredients) ing WHERE ing ILIKE ${q}) OR
      EXISTS (SELECT 1 FROM unnest(recipes.recipe_steps) st WHERE st ILIKE ${q});
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

/**
 * Fetch a single recipe by id.
 *
 * @param id - Recipe id (UUID)
 * @returns Promise<RecipeForm | null>
 */
// export async function fetchRecipeById(id: string) {
//   try {
//     const rows = await sql<RecipeForm[]>`
//       SELECT
//         id,
//         recipe_name,
//         recipe_ingredients,
//         recipe_steps,
//         recipe_type
//       FROM recipes
//       WHERE id = ${id};
//     `;

//     return rows[0] ?? null;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch recipe.");
//   }
// }

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
