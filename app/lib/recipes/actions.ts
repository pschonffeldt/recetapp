/* =============================================================================
 * Recipe Actions
 * =============================================================================
 * - createRecipe: create a new recipe for the current user
 * - updateRecipe: update an existing recipe
 * - deleteRecipe: delete from list views (no redirect in the action)
 * - deleteRecipeFromViewer: delete from detail page + redirect
 * - reviewRecipe: placeholder review logic (currently a delete)
 *
 * Notes:
 * - All actions are server-only and work with useFormState on the client.
 * - Validation is done with Zod (RecipeSchema / UpdateRecipeSchema).
 * - Ingredients are stored both as:
 *   - text[] (legacy / simple views / stats)
 *   - jsonb (structured ingredients)
 * =============================================================================
 */

"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodIssue } from "zod";

import { sql } from "../db";
import { RecipeFormState } from "../forms/state";
import { requireUserId } from "../auth/helpers";
import type { IncomingIngredientPayload } from "../types/definitions";
import { toLines, toInt, toMoney } from "../forms/helpers";
import { RecipeSchema, UpdateRecipeSchema } from "./validation";

/* =============================================================================
 * Types
 * =============================================================================
 */

type RecipeFormErrors = RecipeFormState["errors"];

/* =============================================================================
 * Helpers
 * =============================================================================
 */

/**
 * Extract and parse structured ingredients from the form.
 * Reads `ingredientsJson` (stringified array of IncomingIngredientPayload).
 */
function parseStructuredIngredients(
  formData: FormData
): IncomingIngredientPayload[] {
  const raw = formData.get("ingredientsJson");

  if (typeof raw !== "string" || raw.trim() === "") return [];

  try {
    return JSON.parse(raw) as IncomingIngredientPayload[];
  } catch (e) {
    console.error("Failed to parse ingredientsJson:", e);
    return [];
  }
}

/** Map structured ingredient payloads to plain ingredient name strings. */
function toIngredientNames(ingredients: IncomingIngredientPayload[]): string[] {
  return ingredients.map((ing) => ing.ingredientName);
}

/** Convert Zod issues into the RecipeFormState["errors"] shape. */
function mapZodErrorsToFormErrors(issues: ZodIssue[]): RecipeFormErrors {
  const errors: RecipeFormErrors = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof RecipeFormErrors;
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}

/** Small helper to build a RecipeFormState with message + errors. */
function recipeFormError(
  message: string,
  errors: RecipeFormErrors = {}
): RecipeFormState {
  return { message, errors };
}

/* =============================================================================
 * Actions
 * =============================================================================
 */

/**
 * Create a new recipe for the current user.
 *
 * - Reads structured ingredients (ingredientsJson) from IngredientsEditor
 * - Derives legacy text[] ingredient names
 * - Validates with Zod
 * - Inserts into DB
 * - Revalidates and redirects to /dashboard/recipes on success
 */
export async function createRecipe(
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  // 1) Enforce auth
  const userId = await requireUserId();

  // 2) Read structured ingredients coming from IngredientsEditor
  const structuredIngredients = parseStructuredIngredients(formData);
  const ingredientNames = toIngredientNames(structuredIngredients);

  // 3) Validate & normalize main recipe fields
  const parsed = RecipeSchema.safeParse({
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: ingredientNames,
    recipe_steps: toLines(formData.get("recipe_steps")) ?? [],
    servings: toInt(formData.get("servings")),
    prep_time_min: toInt(formData.get("prep_time_min")),
    difficulty: (formData.get("difficulty") as string | null) ?? null,
    status: (formData.get("status") as string) ?? "private",
    dietary_flags: toLines(formData.get("dietary_flags")) ?? [],
    allergens: toLines(formData.get("allergens")) ?? [],
    calories_total: toInt(formData.get("calories_total")),
    estimated_cost_total: toMoney(formData.get("estimated_cost_total")),
    equipment:
      toLines(formData.get("equipment") ?? formData.get("recipe_equipment")) ??
      [],
  });

  if (!parsed.success) {
    return recipeFormError(
      "Please correct the errors above.",
      mapZodErrorsToFormErrors(parsed.error.issues)
    );
  }

  const d = parsed.data;

  // Serialize structured ingredients once, with a clear null fallback
  const structuredJson =
    structuredIngredients.length > 0
      ? JSON.stringify(structuredIngredients)
      : null;

  // 4) Persist to DB
  try {
    await sql/* sql */ `
      INSERT INTO public.recipes (
        recipe_name,
        recipe_ingredients,
        recipe_steps,
        recipe_type,
        servings,
        prep_time_min,
        difficulty,
        status,
        dietary_flags,
        allergens,
        calories_total,
        estimated_cost_total,
        equipment,
        user_id,
        recipe_ingredients_structured
      ) VALUES (
        ${d.recipe_name},
        ${d.recipe_ingredients}::text[],
        ${d.recipe_steps}::text[],
        ${d.recipe_type}::recipe_type_enum,
        ${d.servings}::smallint,
        ${d.prep_time_min}::smallint,
        ${d.difficulty}::difficulty_enum,
        ${d.status}::status_enum,
        ${d.dietary_flags}::text[],
        ${d.allergens}::text[],
        ${d.calories_total}::int,
        ${d.estimated_cost_total}::numeric,
        ${d.equipment}::text[],
        ${userId}::uuid,
        ${structuredJson}::jsonb
      );
    `;
  } catch (e) {
    console.error("Create recipe failed:", e);
    const msg = (e as any)?.message ?? String(e);

    if (msg.includes("recipes_user_id_fkey")) {
      return recipeFormError("Your session expired—please log in again.", {});
    }
    if (msg.includes("invalid input value for enum")) {
      return recipeFormError("Invalid recipe type or difficulty.", {});
    }
    return recipeFormError("Failed to create recipe.", {});
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Update an existing recipe for the current user.
 *
 * - Reads structured ingredients (ingredientsJson)
 * - Keeps legacy text[] column in sync
 * - Validates with Zod (UpdateRecipeSchema)
 * - Updates DB and redirects back to /dashboard/recipes
 */
export async function updateRecipe(
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return recipeFormError("Missing recipe id.");
  }

  // 1) Read structured ingredients from IngredientsEditor
  const structuredIngredients = parseStructuredIngredients(formData);
  const ingredientNames = toIngredientNames(structuredIngredients);

  // 2) Validate & normalize with Zod schema
  const parsed = UpdateRecipeSchema.safeParse({
    id,
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: ingredientNames,
    recipe_steps: toLines(formData.get("recipe_steps")) ?? [],
    servings: toInt(formData.get("servings")),
    prep_time_min: toInt(formData.get("prep_time_min")),
    difficulty: (formData.get("difficulty") as string | null) ?? null,
    status: (formData.get("status") as string) ?? "private",
    dietary_flags: toLines(formData.get("dietary_flags")) ?? [],
    allergens: toLines(formData.get("allergens")) ?? [],
    calories_total: toInt(formData.get("calories_total")),
    estimated_cost_total: toMoney(formData.get("estimated_cost_total")),
    equipment: toLines(formData.get("equipment")),
  });

  if (!parsed.success) {
    return recipeFormError(
      "Please correct the errors above.",
      mapZodErrorsToFormErrors(parsed.error.issues)
    );
  }

  const d = parsed.data;

  // 3) Persist to DB (both text[] + structured jsonb)
  try {
    await sql/* sql */ `
      UPDATE public.recipes
      SET
        recipe_name                   = ${d.recipe_name},
        recipe_ingredients            = ${d.recipe_ingredients}::text[],
        recipe_ingredients_structured = ${
          structuredIngredients.length > 0
            ? JSON.stringify(structuredIngredients)
            : null
        }::jsonb,
        recipe_steps                  = ${d.recipe_steps}::text[],
        recipe_type                   = ${d.recipe_type}::recipe_type_enum,
        servings                      = ${d.servings}::smallint,
        prep_time_min                 = ${d.prep_time_min}::smallint,
        difficulty                    = ${d.difficulty}::difficulty_enum,
        status                        = ${d.status}::status_enum,
        dietary_flags                 = ${d.dietary_flags}::text[],
        allergens                     = ${d.allergens}::text[],
        calories_total                = ${d.calories_total}::int,
        estimated_cost_total          = ${d.estimated_cost_total}::numeric,
        equipment                     = ${d.equipment}::text[]
      WHERE id = ${d.id}::uuid
        AND user_id = ${userId}::uuid;
    `;
  } catch (e) {
    console.error("Update recipe failed:", e);
    const msg = (e as any)?.message ?? String(e);

    if (msg.includes("recipes_user_id_fkey")) {
      return recipeFormError("Your session expired—please log in again.", {});
    }
    if (msg.includes("invalid input value for enum")) {
      return recipeFormError("Invalid recipe type or difficulty.", {});
    }

    return recipeFormError("Failed to update recipe.", {});
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Delete a recipe by id (from list views) for the current user.
 * This action **does not redirect** (used by list UI).
 */
export async function deleteRecipe(id: string): Promise<void> {
  const userId = await requireUserId();
  const rows = await sql/* sql */ `
    DELETE FROM public.recipes
    WHERE id = ${id}::uuid
      AND user_id = ${userId}::uuid
    RETURNING id
  `;

  if (!rows.length) {
    // nothing matched: either not found or not owned by user
    throw new Error(
      "Recipe not found or you don’t have permission to delete it."
    );
  }

  revalidatePath("/dashboard/recipes");
}

/**
 * Delete a recipe by id (from viewer page) for the current user
 * and redirect to recipes index.
 */
export async function deleteRecipeFromViewer(id: string): Promise<never> {
  const userId = await requireUserId();
  const rows = await sql/* sql */ `
    DELETE FROM public.recipes
    WHERE id = ${id}::uuid
      AND user_id = ${userId}::uuid
    RETURNING id
  `;

  if (!rows.length) {
    throw new Error(
      "Recipe not found or you don’t have permission to delete it."
    );
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Placeholder “review recipe” action.
 *
 * NOTE: Currently performs a DELETE and revalidates the review route.
 * Replace with real review logic when implemented.
 */
export async function reviewRecipe(id: string): Promise<void> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return;

  await sql/* sql */ `
    DELETE FROM public.recipes
    WHERE id = ${id}::uuid AND user_id = ${userId}::uuid
    RETURNING id
  `;

  revalidatePath(`/dashboard/recipes/${id}/review`);
}

/**
 * Removes imported recipe from recipe list.
 */
export async function removeRecipeFromLibrary(recipeId: string) {
  const userId = await requireUserId();

  await sql`
    UPDATE public.recipes
    SET saved_by_user_ids = array_remove(saved_by_user_ids, ${userId}::uuid)
    WHERE id = ${recipeId}::uuid
  `;

  // Refresh list + viewer
  revalidatePath("/dashboard/recipes");
  revalidatePath(`/dashboard/recipes/${recipeId}/viewer`);

  // Send user back to their recipes
  redirect("/dashboard/recipes");
}
