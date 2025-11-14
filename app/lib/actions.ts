"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { signIn } from "@/auth";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { UpdateUserProfileSchema } from "./validation";
import { toInt, toLines, toMoney } from "./form-helpers";
import { RecipeFormState } from "./action-types";
import { requireUserId } from "./auth-helpers";

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
  _prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    // NextAuth v5 may throw different shapes; normalize what we show the user
    const e = error as any;

    // Common cases across v5:
    // - e.type === 'CredentialsSignin'
    // - e.name === 'AuthError' && e.type === 'CredentialsSignin'
    // - e.digest may include 'CredentialsSignin'
    const isCredsError =
      e?.type === "CredentialsSignin" ||
      (e?.name === "AuthError" && e?.type === "CredentialsSignin") ||
      (typeof e?.digest === "string" && e.digest.includes("CredentialsSignin"));

    if (isCredsError) return "Invalid credentials.";

    // Unknown error → surface to error boundary/logs (keeps behavior consistent)
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
  // 1) Enforce auth via helper
  const userId = await requireUserId(); // throws if not logged in

  // 2) Validate & normalize
  const parsed = RecipeSchema.safeParse({
    recipe_name: formData.get("recipe_name"),
    recipe_type: formData.get("recipe_type"),
    recipe_ingredients: toLines(formData.get("recipe_ingredients")) ?? [],
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

  try {
    await sql/* sql */ `
      INSERT INTO public.recipes (
        recipe_name, recipe_ingredients, recipe_steps, recipe_type,
        servings, prep_time_min, difficulty, status,
        dietary_flags, allergens, calories_total, estimated_cost_total, equipment,
        user_id
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
        ${userId}::uuid
      );
    `;
  } catch (e) {
    console.error("Create recipe failed:", e);
    const msg = (e as any)?.message ?? String(e);
    // 3) Friendlier DB error surfaces
    if (msg.includes("recipes_user_id_fkey"))
      return {
        message: "Your session expired—please log in again.",
        errors: {},
      };
    if (msg.includes("invalid input value for enum"))
      return { message: "Invalid recipe type or difficulty.", errors: {} };
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
 * Delete a recipe by id (from viewer page) and redirect to recipes index.
 *
 * @param id - Recipe id
 */
// --- Delete from viewer page + redirect back to index ---
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
 * Placeholder for a “review recipe” action.
 * NOTE: Currently performs a DELETE and revalidates the review route.
 * Replace with real review logic when implemented.
 *
 * @param id - Recipe id
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
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    return { message: "You must be signed in.", errors: {} };
  }

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
    return { message: "Please correct the errors below.", errors };
  }

  const d = parsed.data;

  try {
    const rows = await sql/* sql */ `
      UPDATE public.recipes
      SET
        recipe_name          = ${d.recipe_name},
        recipe_type          = ${d.recipe_type}::recipe_type_enum,
        recipe_ingredients   = ${d.recipe_ingredients}::text[],
        recipe_steps         = ${d.recipe_steps}::text[],
        servings             = ${d.servings}::smallint,
        prep_time_min        = ${d.prep_time_min}::smallint,
        difficulty           = ${d.difficulty}::difficulty_enum,
        status               = ${d.status}::status_enum,
        dietary_flags        = ${d.dietary_flags}::text[],
        allergens            = ${d.allergens}::text[],
        calories_total       = ${d.calories_total}::int,
        estimated_cost_total = ${d.estimated_cost_total}::numeric,
        equipment            = ${d.equipment}::text[],
        recipe_updated_at    = now()
      WHERE id = ${d.id}::uuid
        AND user_id = ${userId}::uuid
      RETURNING id;
    `;
    if (!rows.length) {
      return {
        message: "Recipe not found or you don’t have permission.",
        errors: {},
      };
    }
  } catch (e) {
    console.error("Update recipe failed:", e);
    return { message: "Failed to update recipe.", errors: {} };
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

  // Read raw values to detect “user explicitly cleared the field”
  const rawName = formData.get("name");
  const rawLast = formData.get("last_name");
  const rawEmail = formData.get("email");

  // Helper: "" | null -> undefined, otherwise trimmed
  const toOptional = (v: FormDataEntryValue | null) => {
    const s = (v ?? "").toString().trim();
    return s === "" ? undefined : s;
  };

  const candidate = {
    name: toOptional(rawName),
    last_name: toOptional(rawLast),
    email: toOptional(rawEmail),
  };

  // Manual validation to catch explicit blanks (these would have become `undefined`)
  const errors: Record<string, string[]> = {};
  if (rawName !== null && String(rawName).trim() === "") {
    errors.name = ["First name cannot be empty."];
  }
  if (rawLast !== null && String(rawLast).trim() === "") {
    errors.last_name = ["Last name cannot be empty."];
  }
  if (rawEmail !== null && String(rawEmail).trim() === "") {
    errors.email = ["Email cannot be empty."];
  }

  // Zod validation (format checks for email, etc.)
  const parsed = UpdateUserProfileSchema.safeParse(candidate);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] as string) || "_form";
      (errors[key] ??= []).push(issue.message);
    }
  }

  if (Object.keys(errors).length) {
    return { message: "Please correct the errors above.", errors, ok: false };
  }

  const d = parsed.data!;

  // Build dynamic SETs from provided fields
  const sets: any[] = [];
  if (d.name !== undefined) sets.push(sql`name = ${d.name}`);
  if (d.last_name !== undefined) sets.push(sql`last_name = ${d.last_name}`);
  if (d.email !== undefined) sets.push(sql`email = ${d.email}`);

  if (sets.length === 0) {
    // User submitted, but nothing changed → show a gentle error toast
    return { message: "No changes to save.", errors: {}, ok: false };
  }

  // Stamp lifecycle column
  sets.push(sql`profile_updated_at = now()`);

  const setSql =
    sets.length === 1
      ? sets[0]
      : sets.slice(1).reduce((acc, cur) => sql`${acc}, ${cur}`, sets[0]);

  try {
    await sql`UPDATE public.users SET ${setSql} WHERE id = ${userId}::uuid`;
  } catch (e: any) {
    // Postgres duplicate-key on email → clear, field-level error + toast message
    const code = e?.code as string | undefined; // e.g. '23505'
    const constraint = (e?.constraint as string | undefined) || "";
    const msg = String(e?.message || "");

    const emailTaken =
      code === "23505" &&
      (/(users_email_unique|users_email_key)/i.test(constraint) ||
        /duplicate key.*?(users_email_unique|users_email_key)/i.test(msg) ||
        /duplicate key.*email/i.test(msg));

    if (emailTaken) {
      return {
        ok: false,
        message: "That email is already in use.",
        errors: { email: ["That email is already in use."] },
      };
    }

    console.error("updateUserProfile failed:", e);
    return { ok: false, message: "Failed to update profile.", errors: {} };
  }

  // Let RSC bits refresh
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
  if (!password)
    errors.password = [
      "To change your password, fill in both password fields.",
    ];
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

/* =======================================================
 * Signup
 * ======================================================= */

const SignupSchema = z
  .object({
    name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().optional().default(""),
    email: z
      .string()
      .email()
      .transform((e) => e.toLowerCase().trim()),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(8),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export async function createAccount(_prev: any, formData: FormData) {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] as string) || "_form";
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, message: "Fix errors and try again.", errors };
  }

  const { name, last_name, email, password } = parsed.data;

  // UX check (unique index still guarantees at DB level)
  const existing = await sql/* sql */ `
    SELECT 1 FROM public.users WHERE LOWER(email) = ${email} LIMIT 1`;
  if (existing.length) {
    return {
      ok: false,
      message: "Email is already registered.",
      errors: { email: ["Email already in use"] },
    };
  }

  const hash = await bcrypt.hash(password, 10);

  // Create user
  let userId: string | null = null;
  try {
    const rows = await sql<{ id: string }[]>/* sql */ `
      INSERT INTO public.users (name, last_name, email, password, password_changed_at)
      VALUES (${name}, ${last_name}, ${email}, ${hash}, NOW())
      RETURNING id`;
    userId = rows[0]?.id ?? null;
  } catch (e: any) {
    const msg = String(e?.message || e);
    return {
      ok: false,
      message: msg.includes("users_email_unique_idx")
        ? "Email already in use."
        : "Failed to create account.",
      errors: {},
    };
  }

  // Auto sign-in + redirect
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // NextAuth will redirect on the server
    });

    // Fallback: if for any reason no redirect occurred, force it.
    redirect("/dashboard");
  } catch {
    // If sign-in fails, send them to login with a success hint.
    redirect("/login?signup=success");
  }

  // Unreachable after redirect; keep for type completeness if this action is reused.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return { ok: true, message: null, errors: {}, userId } as const;
}

export type SignupResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
  userId?: string;
};

/* ================================
 * Notifications — Actions
 * ================================ */

export async function markNotificationRead(_prev: any, formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");

  if (!id) return { ok: false, message: "Missing id" };

  await sql/* sql */ `
    UPDATE public.notifications
    SET status = 'read'::notification_status
    WHERE id = ${id}::uuid
      AND user_id = ${userId}::uuid
  `;

  // Update header badge + page list
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
  return { ok: true, message: null };
}

export async function markAllNotificationsRead() {
  const userId = await requireUserId();

  await sql/* sql */ `
    UPDATE public.notifications
    SET status = 'read'::notification_status
    WHERE user_id = ${userId}::uuid
      AND status = 'unread'::notification_status
  `;

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
  return { ok: true, message: null };
}
