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
import { RecipeForm } from "./definitions";

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

// visibility & difficulty
const StatusEnum = z.enum(["private", "public"]);
const DifficultyEnum = z.enum(["easy", "medium", "hard"]);

const RecipeSchema = z.object({
  recipe_name: z.string().min(1, "Recipe name is required"),
  recipe_type: z.enum(["breakfast", "lunch", "dinner", "dessert", "snack"]),

  recipe_ingredients: z
    .array(z.string().min(1))
    .min(1, "Enter at least one ingredient"),
  recipe_steps: z.array(z.string().min(1)).min(1, "Enter at least one step"),

  // NEW — no `optional()` here; we use defaults so undefined never escapes
  servings: z
    .number()
    .int()
    .min(1, "Must be 1 or greater")
    .nullable()
    .default(null),
  prep_time_min: z
    .number()
    .int()
    .min(0, "Must be 0 or greater")
    .nullable()
    .default(null),
  difficulty: DifficultyEnum.nullable().default(null),
  status: StatusEnum.default("private"),
  dietary_flags: z.array(z.string().min(1)).default([]),
  allergens: z.array(z.string().min(1)).default([]),
  calories_total: z
    .number()
    .int()
    .min(0, "Must be 0 or greater")
    .nullable()
    .default(null),
  estimated_cost_total: z.string().nullable().default(null), // numeric as string
  equipment: z.array(z.string().min(1)).default([]),
});

const UpdateRecipeSchema = RecipeSchema.extend({
  id: z.string().uuid("Invalid recipe id"),
});

/* =======================================================
 * Types
 * ======================================================= */

/** UI state returned by recipe actions on validation errors */
export type RecipeFormState = {
  message: string | null;
  errors: Partial<Record<keyof RecipeForm, string[]>>;
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
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const parsed = RecipeSchema.safeParse({
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: toLines(formData.get("recipe_ingredients")),
    recipe_steps: toLines(formData.get("recipe_steps")),
    servings: toInt(formData.get("servings")),
    prep_time_min: toInt(formData.get("prep_time_min")),
    difficulty: (formData.get("difficulty") as string | null) ?? null,
    status: (formData.get("status") as string) ?? "private",
    dietary_flags: toLines(formData.get("dietary_flags")),
    allergens: toLines(formData.get("allergens")),
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
    return { message: "Please correct the errors below.", errors };
  }

  const d = parsed.data;

  try {
    await sql`
      INSERT INTO recipes (
        recipe_name, recipe_ingredients, recipe_steps, recipe_type,
        servings, prep_time_min, difficulty, status,
        dietary_flags, allergens, calories_total, estimated_cost_total, equipment
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
        ${d.equipment}::text[]
      );
    `;
  } catch (err) {
    console.error("Create recipe failed:", err);
    return { message: "Failed to create recipe.", errors: {} };
  }

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
  const parsed = UpdateRecipeSchema.safeParse({
    id: formData.get("id"),

    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: toLines(formData.get("recipe_ingredients")),
    recipe_steps: toLines(formData.get("recipe_steps")),

    servings: toInt(formData.get("servings")),
    prep_time_min: toInt(formData.get("prep_time_min")),
    difficulty: (formData.get("difficulty") as string | null) ?? null,
    status: (formData.get("status") as string) ?? "private",
    dietary_flags: toLines(formData.get("dietary_flags")),
    allergens: toLines(formData.get("allergens")),
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
    // Surface ID-only failures nicely
    if (Object.keys(errors).length === 1 && errors.id) {
      return { message: "Invalid recipe id.", errors };
    }
    return { message: "Please correct the errors below.", errors };
  }

  const d = parsed.data;

  try {
    await sql`
      UPDATE recipes
      SET
        recipe_name        = ${d.recipe_name},
        recipe_type        = ${d.recipe_type}::recipe_type_enum,
        recipe_ingredients = ${d.recipe_ingredients}::text[],
        recipe_steps       = ${d.recipe_steps}::text[],

        servings           = ${d.servings}::smallint,
        prep_time_min      = ${d.prep_time_min}::smallint,
        difficulty         = ${d.difficulty}::difficulty_enum,
        status             = ${d.status}::status_enum,
        dietary_flags      = ${d.dietary_flags}::text[],
        allergens          = ${d.allergens}::text[],
        calories_total     = ${d.calories_total}::int,
        estimated_cost_total = ${d.estimated_cost_total}::numeric,
        equipment          = ${d.equipment}::text[]
      WHERE id = ${d.id}::uuid;
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

  revalidatePath("/dashboard/recipes");
  redirect("/dashboard/recipes");
}

// Parse a number input -> number | null
const toInt = (v: FormDataEntryValue | null) =>
  v == null || v === "" ? null : Number(v);

// Keep money as string (DB numeric comes/goes as string)
const toMoney = (v: FormDataEntryValue | null) =>
  v == null || v === "" ? null : String(v);

// Split textarea (supports newline OR comma), trim & dedupe
const toLines = (v: FormDataEntryValue | null) => {
  const arr = String(v ?? "")
    .split(/\r?\n|,/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(arr));
};
