/* =============================================================================
 * Discover — Public Recipes
 * =============================================================================
 * - Card list for /dashboard/discover
 * - Public recipe detail for /dashboard/discover/[id]
 * =============================================================================
 */

"use server";

import "server-only";

import { sql } from "../db";
import type {
  RecipeForm,
  PublicRecipeDetail,
  Difficulty,
} from "../types/definitions";

// How many cards per page on Discover
const DISCOVER_PAGE_SIZE = 9;

/* =============================================================================
 * Types
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
  created_by_display_name: string | null;
  recipe_created_at: string;
  saved_by_count: number;
};

// 2) Internal row shape for the SQL query
export type DiscoverRecipeRow = {
  id: string;
  recipe_name: string;
  recipe_type: RecipeForm["recipe_type"];
  difficulty: RecipeForm["difficulty"];
  recipe_ingredients: string[] | null;
  servings: number | null;
  prep_time_min: number | null;
  recipe_created_at: string | Date;
  created_by_display_name: string | null;
  saved_by_count: number;
};

// 3) Filters for Discover grid / count
export type DiscoverFilters = {
  currentUserId?: string | null;
  search?: string | null;
  type?: RecipeForm["recipe_type"] | null;
  difficulty?: Difficulty | null;
  maxPrep?: number | null;
  sort?: "newest" | "oldest" | "shortest";
  page?: number;
};

/* ========================================================================== */
/* Shared WHERE-clause helper                                                 */
/* ========================================================================== */

/**
 * Builds the WHERE fragments for both the list and count queries
 * so they always stay in sync.
 */
function buildDiscoverWhere({
  currentUserId,
  search,
  type,
  difficulty,
  maxPrep,
}: Omit<DiscoverFilters, "sort" | "page">) {
  const hasSearch = !!search && search.trim().length > 0;
  const searchTerm = hasSearch ? `%${search!.trim()}%` : null;

  return sql`
    r.status = 'public'
    ${
      currentUserId
        ? sql`AND (r.user_id IS NULL OR r.user_id <> ${currentUserId}::uuid)`
        : sql``
    }
    ${
      hasSearch
        ? sql`AND (
              r.recipe_name ILIKE ${searchTerm}
              OR EXISTS (
                SELECT 1 FROM unnest(r.recipe_ingredients) AS ing
                WHERE ing ILIKE ${searchTerm}
              )
            )`
        : sql``
    }
    ${type ? sql`AND r.recipe_type = ${type}::recipe_type_enum` : sql``}
    ${
      difficulty
        ? sql`AND r.difficulty = ${difficulty}::difficulty_enum`
        : sql``
    }
    ${
      maxPrep != null
        ? sql`AND r.prep_time_min IS NOT NULL AND r.prep_time_min <= ${maxPrep}`
        : sql``
    }
  `;
}

/* ========================================================================== */
/* Discover list with filters + pagination                                    */
/* ========================================================================== */

export async function fetchDiscoverRecipes({
  currentUserId,
  search,
  type,
  difficulty,
  maxPrep,
  sort = "newest",
  page = 1,
}: DiscoverFilters): Promise<DiscoverRecipeCard[]> {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * DISCOVER_PAGE_SIZE;

  // Build shared WHERE fragment (status/public + filters)
  const whereSql = buildDiscoverWhere({
    currentUserId,
    search,
    type,
    difficulty,
    maxPrep,
  });

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
      u.user_name AS created_by_display_name,
      cardinality(r.saved_by_user_ids) AS saved_by_count
    FROM public.recipes r
    LEFT JOIN public.users u ON u.id = r.user_id
    WHERE ${whereSql}
    ORDER BY
      ${
        sort === "oldest"
          ? sql`r.recipe_created_at ASC`
          : sort === "shortest"
          ? sql`r.prep_time_min ASC NULLS LAST, r.recipe_created_at DESC`
          : sql`r.recipe_created_at DESC`
      }
    LIMIT ${DISCOVER_PAGE_SIZE}
    OFFSET ${offset}
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
    saved_by_count: r.saved_by_count ?? 0,
  }));
}

/* ========================================================================== */
/* Count + pages for “X community recipes” + pagination                       */
/* ========================================================================== */

export async function fetchDiscoverPages(
  filters: Omit<DiscoverFilters, "sort" | "page">
): Promise<{ pages: number; total: number }> {
  const whereSql = buildDiscoverWhere(filters);

  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM public.recipes r
    LEFT JOIN public.users u ON u.id = r.user_id
    WHERE ${whereSql}
  `;

  const total = rows[0]?.count ?? 0;
  const pages = total === 0 ? 0 : Math.ceil(total / DISCOVER_PAGE_SIZE);

  return { pages, total };
}

/* ========================================================================== */
/* Single public recipe (viewer)                                              */
/* ========================================================================== */

/** Shape used by the public-recipe viewer (kept for reference / typing) */
export type PublicRecipeWithCreator = RecipeForm & {
  created_by_display_name: string | null;
};

/**
 * Fetch a single **public** recipe by id, including the creator’s public name.
 * Used by /dashboard/discover/[id] → ViewerRecipe.
 */
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
