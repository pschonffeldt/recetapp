/* =============================================================================
 * Discover recipes
 * =============================================================================
 */

"use server";

import { redirect } from "next/navigation";
import { requireUserId } from "../auth-helpers";
import { sql } from "../db";
import { revalidatePath } from "next/cache";

export async function importRecipeFromDiscover(recipeId: string) {
  const userId = await requireUserId(); // ensure logged in

  type OwnershipRow = {
    id: string;
    user_id: string | null;
    saved_by_user_ids: string[] | null;
  };

  // 1) Check that recipe exists and is public
  const rows = await sql<OwnershipRow[]>`
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
