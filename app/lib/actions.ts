"use server";

/* ================================
 * Imports
 * ================================ */
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

/* ================================
 * Database Client
 * - Uses POSTGRES_URL with SSL required
 * ================================ */
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* =======================================================
 * Zod Schemas (Validation)
 * - Keep all form/data validation centralized here
 * ======================================================= */

/** Recipe form schema used for create/update (id added later for updates) */
const RecipeSchema = z.object({
  recipe_name: z.string().min(1, "Recipe name is required"),
  recipe_type: z.enum(["breakfast", "lunch", "dinner", "dessert", "snack"]),
  recipe_ingredients: z
    .array(z.string().min(1))
    .min(1, "Enter at least one ingredient"),
  recipe_steps: z.array(z.string().min(1)).min(1, "Enter at least one step"),
});

/* Update recipe schema (RecipeSchema + id) */
const UpdateRecipeSchema = RecipeSchema.extend({
  id: z.string().uuid("Invalid recipe id"),
});

/* =======================================================
 * Types
 * ======================================================= */

/** UI state returned by invoice actions on validation errors */
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/** UI state returned by recipe actions on validation errors */
export type RecipeFormState = {
  message: string | null;
  errors: {
    recipe_name?: string[];
    recipe_type?: string[];
    recipe_ingredients?: string[];
    recipe_steps?: string[];
  };
};

/* =======================================================
 * Auth
 * ======================================================= */

/**
 * Attempt to sign in using NextAuth credentials provider.
 * Returns a user-friendly string on known auth errors; throws otherwise.
 *
 * @param prevState - Unused previous state (kept for server action signature)
 * @param formData  - FormData containing credentials (e.g., email/password)
 * @returns string | undefined
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    // Unknown error: surface it to the error boundary/logs
    throw error;
  }
}

/* =======================================================
 * Recipes — Create / Update / Delete / Review
 * ======================================================= */

/**
 * Utility: Convert a textarea’s newline-separated value into a clean string[].
 * - Trims whitespace
 * - Drops blank lines
 *
 * @param v - Raw FormDataEntryValue
 * @returns string[]
 */
function splitLinesToArray(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Create a new recipe.
 * - Validates input with Zod (name, type, ingredients[], steps[])
 * - Inserts into DB
 * - Revalidates and redirects to /dashboard/recipes on success
 *
 * @param _prevState - Unused previous state (kept for server action signature)
 * @param formData   - FormData from the recipe form
 */
export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  // 1) Validate form fields
  const parsed = RecipeSchema.safeParse({
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: splitLinesToArray(formData.get("recipe_ingredients")),
    recipe_steps: splitLinesToArray(formData.get("recipe_steps")),
  });

  // 2) Early return on validation errors
  if (!parsed.success) {
    const errors: RecipeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RecipeFormState["errors"];
      (errors[key] ??= []).push(issue.message);
    }
    return { message: "Please correct the errors below.", errors };
  }

  // 3) Insert into DB
  try {
    const { recipe_name, recipe_type, recipe_ingredients, recipe_steps } =
      parsed.data;
    await sql`
      INSERT INTO recipes (recipe_name, recipe_ingredients, recipe_steps, recipe_type)
      VALUES (${recipe_name}, ${recipe_ingredients}, ${recipe_steps}, ${recipe_type})
    `;
  } catch (err) {
    console.error("Create recipe failed:", err);
    return { message: "Failed to create recipe.", errors: {} };
  }

  // 4) Revalidate and redirect
  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Delete a recipe by id (from list views).
 * - Revalidates recipes page
 *
 * @param id - Recipe id
 */
export async function deleteRecipe(id: string) {
  await sql`DELETE FROM recipes WHERE id = ${id}`;
  revalidatePath("/dashboard/recipes");
}

/**
 * Delete a recipe by id (from viewer page) and redirect to recipes index.
 *
 * @param id - Recipe id
 */
export async function deleteRecipeFromViewer(id: string) {
  await sql`DELETE FROM recipes WHERE id = ${id}`;
  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

/**
 * Placeholder for a “review recipe” action.
 * NOTE: Currently performs a DELETE and revalidates the review route.
 * Replace with real review logic when implemented.
 *
 * @param id - Recipe id
 */
export async function reviewRecipe(id: string) {
  await sql`DELETE FROM recipes WHERE id = ${id}`;
  revalidatePath(`/dashboard/recipes/${id}/review`);
}

/** Local alias: same behavior as splitLinesToArray (kept for clarity below) */
const splitLines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Update an existing recipe.
 * - Validates input with Zod (including UUID id)
 * - Casts to proper Postgres types
 * - Revalidates and redirects to /dashboard/recipes on success
 *
 * @param _prev    - Unused previous state (kept for server action signature)
 * @param formData - FormData from the recipe edit form
 */
export async function updateRecipe(
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  // 1) Validate form fields
  const parsed = UpdateRecipeSchema.safeParse({
    id: formData.get("id"),
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: splitLines(formData.get("recipe_ingredients")),
    recipe_steps: splitLines(formData.get("recipe_steps")),
  });

  // 2) Early return on validation errors
  if (!parsed.success) {
    const errors: RecipeFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof RecipeFormState["errors"];
      (errors[key] ??= []).push(issue.message);
    }
    // If only id fails, surface a top-level message
    if (
      !errors.recipe_name &&
      !errors.recipe_type &&
      !errors.recipe_ingredients &&
      !errors.recipe_steps
    ) {
      return { message: "Invalid recipe id.", errors };
    }
    return { message: "Please correct the errors below.", errors };
  }

  // 3) Persist changes
  const { id, recipe_name, recipe_type, recipe_ingredients, recipe_steps } =
    parsed.data;

  try {
    await sql`
      UPDATE recipes
      SET
        recipe_name        = ${recipe_name},
        recipe_type        = ${recipe_type}::recipe_type_enum,
        recipe_ingredients = ${recipe_ingredients}::text[],
        recipe_steps       = ${recipe_steps}::text[]
      WHERE id = ${id};
    `;
  } catch (e) {
    console.error("Update recipe failed:", e);
    return {
      message:
        e instanceof Error
          ? `Failed to update recipe: ${e.message}`
          : "Failed to update recipe.",
      errors: {},
    };
  }

  // 4) Revalidate and redirect
  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}
