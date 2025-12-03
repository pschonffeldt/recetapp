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
import type { RecipeForm, PublicRecipeDetail } from "../types/definitions";

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
