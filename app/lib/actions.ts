"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import bcrypt from "bcrypt";
import {
  UpdateUserPasswordSchema,
  UpdateUserProfileSchema,
} from "./validation";
import { toInt, toLines, toMoney } from "./form-helpers";
import { RecipeFormState } from "./action-types";

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
    equipment: toLines(formData.get("recipe_equipment")),
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

/**
 * Update an existing user.
 * - Validates input with Zod (including UUID id)
 * - Casts to proper Postgres types
 * - Revalidates and redirects to /dashboard/recipes on success
 *
 * @param _prev    - Unused previous state (kept for server action signature)
 * @param formData - FormData from the recipe edit form
 */

/**
 * Accepts optional fields; if a field is absent/blank, we don't touch it.
 * - Name/Last name/Country/Language: non-empty string when present
 * - Email: valid email when present
 * - Password: min 6 when present (hashed before saving)
 */

// "" | null -> undefined, otherwise trimmed string
const toOptional = (v: FormDataEntryValue | null) => {
  const s = (v ?? "").toString().trim();
  return s === "" ? undefined : s;
};

/** Update name / last_name / email only */
export async function updateUserProfile(
  _prev: {
    message: string | null;
    errors: Record<string, string[]>;
    ok: boolean;
  },
  formData: FormData
) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return { message: "Unauthorized.", errors: {}, ok: false };

  const candidate = {
    name: toOptional(formData.get("name")),
    last_name: toOptional(formData.get("last_name")),
    email: toOptional(formData.get("email")),
  };

  const parsed = UpdateUserProfileSchema.safeParse(candidate);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] as string) || "_form";
      (errors[key] ??= []).push(issue.message);
    }
    return { message: "Please correct the errors above.", errors, ok: false };
  }

  const d = parsed.data;

  // Build dynamic SET list from provided fields
  const sets: any[] = [];
  if (d.name !== undefined) sets.push(sql`name = ${d.name}`);
  if (d.last_name !== undefined) sets.push(sql`last_name = ${d.last_name}`);
  if (d.email !== undefined) sets.push(sql`email = ${d.email}`);

  if (sets.length === 0) {
    // Nothing to update
    return { message: null, errors: {}, ok: true, shouldRefresh: false };
  }

  // Stamp profile_updated_at when something changed
  sets.push(sql`profile_updated_at = now()`);

  const setSql =
    sets.length === 1
      ? sets[0]
      : sets.slice(1).reduce((acc, cur) => sql`${acc}, ${cur}`, sets[0]);

  try {
    await sql`UPDATE public.users SET ${setSql} WHERE id = ${userId}::uuid`;
  } catch (e) {
    console.error("updateUserProfile failed:", e);
    return { message: "Failed to update profile.", errors: {}, ok: false };
  }

  // Allow UI that reads user from RSC to refresh (e.g., header, page)
  revalidatePath("/dashboard/account");

  return { message: null, errors: {}, ok: true, shouldRefresh: true };
}

/** Update password only */
export async function updateUserPassword(
  _prev: {
    message: string | null;
    errors: Record<string, string[]>;
    ok: boolean;
  },
  formData: FormData
) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return { ok: false, message: "Unauthorized.", errors: {} };

  const password = toOptional(formData.get("password"));
  const confirm = toOptional(formData.get("confirm_password"));

  const errors: Record<string, string[]> = {};
  if (!password) errors.password = ["Password is required."];
  if (!confirm) errors.confirm_password = ["Confirm password is required."];
  if (password && password.length < 6) errors.password = ["Min 6 characters."];
  if (password && confirm && password !== confirm)
    errors.confirm_password = ["Passwords do not match."];

  if (Object.keys(errors).length) {
    return { ok: false, message: "Please correct the errors.", errors };
  }

  const hash = await bcrypt.hash(password!, 10);

  try {
    await sql`
      UPDATE public.users
      SET password = ${hash}, password_changed_at = now()
      WHERE id = ${userId}::uuid
    `;
  } catch (e) {
    console.error("updateUserPassword failed:", e);
    return { ok: false, message: "Failed to update password.", errors: {} };
  }

  // Optional: if using NextAuth sessions DB, invalidate others here.
  // (You can skip if using JWT without a session store.)
  return { ok: true, message: null, errors: {} };
}
