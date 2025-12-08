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

// 3) Filters for Discover grid
export type DiscoverRecipeFilters = {
  currentUserId?: string | null; // viewer: hide own recipes
  search?: string | null; // search in recipe_name
  type?: RecipeForm["recipe_type"] | null; // recipe_type filter
  difficulty?: RecipeForm["difficulty"] | null; // difficulty filter
  maxPrep?: number | null; // max prep time in minutes
  sort?: "newest" | "oldest" | "shortest"; // sort mode
};

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

function andAll(parts: any[]) {
  if (parts.length === 0) return sql``;
  const [first, ...rest] = parts;
  return rest.reduce((acc, cur) => sql`${acc} AND ${cur}`, first);
}

/* ========================================================================== */
/* Discover list with filters                                                 */
/* ========================================================================== */

type DiscoverFilters = {
  currentUserId?: string | null;
  search?: string | null;
  type?: RecipeForm["recipe_type"] | null;
  difficulty?: Difficulty | null;
  maxPrep?: number | null;
  sort?: "newest" | "oldest" | "shortest";
};

export async function fetchDiscoverRecipes({
  currentUserId,
  search,
  type,
  difficulty,
  maxPrep,
  sort = "newest",
}: DiscoverFilters): Promise<DiscoverRecipeCard[]> {
  const whereParts: any[] = [sql`r.status = 'public'`];

  if (currentUserId) {
    // don’t show recipes owned by the current user
    whereParts.push(
      sql`(r.user_id IS NULL OR r.user_id <> ${currentUserId}::uuid)`
    );
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    whereParts.push(sql`
      (
        r.recipe_name ILIKE ${term}
        OR EXISTS (
          SELECT 1 FROM unnest(r.recipe_ingredients) AS ing
          WHERE ing ILIKE ${term}
        )
      )
    `);
  }

  if (type) {
    whereParts.push(sql`r.recipe_type = ${type}::recipe_type_enum`);
  }

  if (difficulty) {
    whereParts.push(sql`r.difficulty = ${difficulty}::difficulty_enum`);
  }

  if (maxPrep != null) {
    whereParts.push(
      sql`r.prep_time_min IS NOT NULL AND r.prep_time_min <= ${maxPrep}`
    );
  }

  const whereSql = andAll(whereParts);

  const orderSql =
    sort === "oldest"
      ? sql`r.recipe_created_at ASC`
      : sort === "shortest"
      ? sql`r.prep_time_min ASC NULLS LAST, r.recipe_created_at DESC`
      : sql`r.recipe_created_at DESC`;

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
      u.user_name AS created_by_display_name
    FROM public.recipes r
    LEFT JOIN public.users u ON u.id = r.user_id
    WHERE ${whereSql}
    ORDER BY ${orderSql}
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

/* ========================================================================== */
/* Count for “X community recipes” text                                       */
/* ========================================================================== */

export async function fetchDiscoverCount(
  filters: DiscoverFilters
): Promise<number> {
  const { currentUserId, search, type, difficulty, maxPrep } = filters;

  const whereParts: any[] = [sql`r.status = 'public'`];

  if (currentUserId) {
    whereParts.push(
      sql`(r.user_id IS NULL OR r.user_id <> ${currentUserId}::uuid)`
    );
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    whereParts.push(sql`
      (
        r.recipe_name ILIKE ${term}
        OR EXISTS (
          SELECT 1 FROM unnest(r.recipe_ingredients) AS ing
          WHERE ing ILIKE ${term}
        )
      )
    `);
  }

  if (type) {
    whereParts.push(sql`r.recipe_type = ${type}::recipe_type_enum`);
  }

  if (difficulty) {
    whereParts.push(sql`r.difficulty = ${difficulty}::difficulty_enum`);
  }

  if (maxPrep != null) {
    whereParts.push(
      sql`r.prep_time_min IS NOT NULL AND r.prep_time_min <= ${maxPrep}`
    );
  }

  const whereSql = andAll(whereParts);

  const rows = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM public.recipes r
    WHERE ${whereSql}
  `;

  return rows[0]?.count ?? 0;
}

/** Shape used by the public-recipe viewer */
export type PublicRecipeWithCreator = RecipeForm & {
  created_by_display_name: string | null;
};

/**
 * Fetch a single **public** recipe by id, including the creator’s public name.
 * Used by /dashboard/discover/[id] → ViewerRecipe.
 */
export async function fetchPublicRecipeById(
  id: string
): Promise<PublicRecipeWithCreator | null> {
  const rows = await sql<PublicRecipeWithCreator[]>`
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
      COALESCE(r.dietary_flags, ARRAY[]::text[]) AS dietary_flags,
      COALESCE(r.allergens,     ARRAY[]::text[]) AS allergens,
      r.calories_total,
      r.estimated_cost_total,
      COALESCE(r.equipment,     ARRAY[]::text[]) AS equipment,
      (r.recipe_created_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_created_at,
      (r.recipe_updated_at AT TIME ZONE 'UTC')::timestamptz::text AS recipe_updated_at,
      u.user_name AS created_by_display_name
    FROM public.recipes r
    LEFT JOIN public.users u ON u.id = r.user_id
    WHERE r.id = ${id}::uuid
      AND r.status = 'public'
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) return null;

  // Arrays are already normalized via COALESCE above, but this keeps the type happy
  return {
    ...row,
    recipe_ingredients: row.recipe_ingredients ?? [],
    recipe_steps: row.recipe_steps ?? [],
    equipment: row.equipment ?? [],
    allergens: row.allergens ?? [],
    dietary_flags: row.dietary_flags ?? [],
  };
}
