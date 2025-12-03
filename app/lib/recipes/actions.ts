"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RecipeFormState } from "../action-types";
import { requireUserId } from "../auth-helpers";
import { IncomingIngredientPayload } from "../definitions";
import { toLines, toInt, toMoney } from "../form-helpers";
import { sql } from "../db";
import { RecipeSchema, UpdateRecipeSchema } from "./validation";

/* =============================================================================
 * Recipes — Create / Update / Delete / Review
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
  const rawIngredients = formData.get("ingredientsJson");
  let structuredIngredients: IncomingIngredientPayload[] = [];

  if (typeof rawIngredients === "string" && rawIngredients.trim() !== "") {
    try {
      structuredIngredients = JSON.parse(
        rawIngredients
      ) as IncomingIngredientPayload[];
    } catch (e) {
      console.error("Failed to parse ingredientsJson:", e);
      structuredIngredients = [];
    }
  }

  // Legacy: keep text[] column with ingredient names for existing UI / stats
  const ingredientNames = structuredIngredients.map(
    (ing) => ing.ingredientName
  );

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
    const errors: RecipeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RecipeFormState["errors"];
      (errors[key] ??= []).push(issue.message);
    }
    return { message: "Please correct the errors above.", errors };
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
      return {
        message: "Your session expired—please log in again.",
        errors: {},
      };
    }
    if (msg.includes("invalid input value for enum")) {
      return { message: "Invalid recipe type or difficulty.", errors: {} };
    }
    return { message: "Failed to create recipe.", errors: {} };
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Update an existing recipe for the current user.
 *
 * - Reads structured ingredients (ingredientsJson)
 * - Keeps legacy text[] column in sync
 * - Validates with Zod
 * - Updates DB and redirects back to /dashboard/recipes
 */
export async function updateRecipe(
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return { message: "Missing recipe id.", errors: {} };
  }

  // --- 1) Read structured ingredients from IngredientsEditor ---
  const rawIngredients = formData.get("ingredientsJson");
  let structuredIngredients: IncomingIngredientPayload[] = [];

  if (typeof rawIngredients === "string" && rawIngredients.trim() !== "") {
    try {
      structuredIngredients = JSON.parse(
        rawIngredients
      ) as IncomingIngredientPayload[];
    } catch (e) {
      console.error("Failed to parse ingredientsJson on update:", e);
      structuredIngredients = [];
    }
  }

  // text[] names for legacy column
  const ingredientNames = structuredIngredients.map(
    (ing) => ing.ingredientName
  );

  // --- 2) Validate & normalize with Zod schema ---
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
    equipment: toLines(formData.get("equipment")),
  });

  if (!parsed.success) {
    const errors: RecipeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RecipeFormState["errors"];
      (errors[key] ??= []).push(issue.message);
    }
    return { message: "Please correct the errors above.", errors };
  }

  const d = parsed.data;

  // --- 3) Persist to DB (both text[] + structured jsonb) ---
  try {
    await sql/* sql */ `
      UPDATE public.recipes
      SET
        recipe_name                   = ${d.recipe_name},
        recipe_ingredients            = ${ingredientNames}::text[],
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
      WHERE id = ${id}::uuid
        AND user_id = ${userId}::uuid;
    `;
  } catch (e) {
    console.error("Update recipe failed:", e);
    const msg = (e as any)?.message ?? String(e);

    if (msg.includes("recipes_user_id_fkey")) {
      return {
        message: "Your session expired—please log in again.",
        errors: {},
      };
    }
    if (msg.includes("invalid input value for enum")) {
      return { message: "Invalid recipe type or difficulty.", errors: {} };
    }

    return { message: "Failed to update recipe.", errors: {} };
  }

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Delete a recipe by id (from list views) for the current user.
 * This action **does not redirect** (used by list UI).
 */
export async function deleteRecipe(id: string) {
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
export async function deleteRecipeFromViewer(id: string) {
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
export async function reviewRecipe(id: string) {
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
