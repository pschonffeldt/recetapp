/* ============================================
 * Data Access Layer (Postgres via postgres.js)
 * - Centralized queries for dashboard, invoices,
 *   customers, and recipes.
 * ============================================ */

import postgres from "postgres";
import {
  RecipesTable,
  Revenue,
  RecipeField,
  RecipeForm,
  LatestRecipeRaw,
} from "./definitions";
import { formatCurrency } from "./utils";

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

/* =======================================================
 * Invoices — Latest, Cards, Filtering, Pagination, Single
 * ======================================================= */

/**
 * Fetch the last 5 invoices sorted by date (desc), joined with customer.
 * Formats amount for UI display.
 * @returns Promise<Array<{ amount: string; name: string; image_url: string; email: string; id: string }>>
 */

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
export async function fetchCardData() {
  try {
    // These are intentionally separated to demonstrate Promise.all:
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    // Defensive conversions from text to number:
    const numberOfInvoices = Number(data[0][0].count ?? "0");
    const numberOfCustomers = Number(data[1][0].count ?? "0");

    // Format totals for UI:
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
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
export async function fetchRecipeById(id: string) {
  try {
    const rows = await sql<RecipeForm[]>`
      SELECT
        id,
        recipe_name,
        recipe_ingredients,
        recipe_steps,
        recipe_type
      FROM recipes
      WHERE id = ${id};
    `;

    return rows[0] ?? null; // return a single recipe or null
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch recipe.");
  }
}
