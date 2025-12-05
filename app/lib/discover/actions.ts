/* =============================================================================
 * Discover Actions
 * =============================================================================
 * - importRecipeFromDiscover: save a public recipe to the current user's list
 *
 * Rules:
 * - Only works for recipes with status = 'public'.
 * - If the user already owns or saved the recipe, we just redirect back.
 * - Uses a saved_by_user_ids uuid[] column on recipes.
 * =============================================================================
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUserId } from "../auth/helpers";
import { sql } from "../db";

/* =============================================================================
 * Types
 * =============================================================================
 */

export type DiscoverOwnershipRow = {
  id: string;
  user_id: string | null;
  saved_by_user_ids: string[] | null;
};

/* =============================================================================
 * Actions
 * =============================================================================
 */

/**
 * Save a public recipe (found via Discover) to the current user's list.
 *
 * - Ensures user is logged in
 * - Ensures recipe exists and is public
 * - If already owned or saved, just redirects back to /dashboard/recipes
 * - Otherwise appends userId to saved_by_user_ids[] and redirects
 */
export async function importRecipeFromDiscover(
  recipeId: string
): Promise<never> {
  const userId = await requireUserId(); // ensure logged in

  // 1) Check that recipe exists and is public
  const rows = await sql<DiscoverOwnershipRow[]>`
    SELECT
      id,
      user_id,
      saved_by_user_ids
    FROM public.recipes
    WHERE id = ${recipeId}::uuid
      AND status = 'public'
    LIMIT 1
  `;

  if (rows.length === 0) {
    throw new Error("Recipe not found or not public");
  }

  const row = rows[0];
  const savedBy = row.saved_by_user_ids ?? [];

  // 2) If the user is already the owner OR has it saved, just go back
  if (row.user_id === userId || savedBy.includes(userId)) {
    revalidatePath("/dashboard/recipes");
    redirect("/dashboard/recipes");
  }

  // 3) Add this user to saved_by_user_ids
  await sql`
    UPDATE public.recipes
    SET saved_by_user_ids = coalesce(saved_by_user_ids, '{}') || ${userId}::uuid
    WHERE id = ${recipeId}::uuid
  `;

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

export async function importRecipeFromDiscoverInline(
  recipeId: string
): Promise<void> {
  const userId = await requireUserId(); // ensure logged in

  // 1) Check that recipe exists and is public
  const rows = await sql<DiscoverOwnershipRow[]>`
    SELECT
      id,
      user_id,
      saved_by_user_ids
    FROM public.recipes
    WHERE id = ${recipeId}::uuid
      AND status = 'public'
    LIMIT 1
  `;

  if (rows.length === 0) {
    throw new Error("Recipe not found or not public");
  }

  const row = rows[0];
  const savedBy = row.saved_by_user_ids ?? [];

  // 2) If the user already owns or saved the recipe, just no-op
  if (row.user_id === userId || savedBy.includes(userId)) {
    // still refresh recipes so badges etc. are up to date
    revalidatePath("/dashboard/recipes");
    revalidatePath("/dashboard/discover");
    return;
  }

  // 3) Add this user to saved_by_user_ids
  await sql`
    UPDATE public.recipes
    SET saved_by_user_ids = coalesce(saved_by_user_ids, '{}') || ${userId}::uuid
    WHERE id = ${recipeId}::uuid
  `;

  // Refresh lists, but **no redirect**
  revalidatePath("/dashboard/recipes");
  revalidatePath("/dashboard/discover");
}
