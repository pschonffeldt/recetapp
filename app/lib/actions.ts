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
import { requireAdmin, requireUserId } from "./auth-helpers";

import type {
  IngredientUnit,
  IncomingIngredientPayload,
  RecipeForm,
} from "@/app/lib/definitions";

/**
 * =============================================================================
 * Server Actions (RSC) for RecetApp
 *
 * Contains all write operations:
 * - Auth (sign-in, sign-up)
 * - Recipes (create / update / delete / review)
 * - Account: profile + password
 * - Notifications: mark read, create
 * - Ingredients helpers (structured ingredients sync)
 *
 * Conventions:
 * - All auth-protected actions call requireUserId() / requireAdmin() inside.
 * - Use zod for validation close to the action.
 * - Keep DB writes here; reads live in data.ts.
 * =============================================================================
 */

/* =============================================================================
 * Database Client
 * =============================================================================
 */

/** Postgres client (uses POSTGRES_URL with SSL required). */
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* =============================================================================
 * Zod Schemas (Validation)
 * =============================================================================
 *
 * Keep form/data validation centralized here so it’s easy to evolve.
 */

/** Enum for recipe visibility. */
const StatusEnum = z.enum(["private", "public"]);

/** Enum for recipe difficulty. */
const DifficultyEnum = z.enum(["easy", "medium", "hard"]);

/**
 * Base recipe schema used for create/update.
 * `id` is added by UpdateRecipeSchema when needed.
 */
const RecipeSchema = z.object({
  recipe_name: z.string().min(1, "Recipe name is required"),
  recipe_type: z.enum(["breakfast", "lunch", "dinner", "dessert", "snack"]),

  recipe_ingredients: z.array(z.string().min(1)).optional().default([]),

  recipe_steps: z.array(z.string().min(1)).min(1, "Enter at least one step"),

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

  // numeric as string
  estimated_cost_total: z.string().nullable().default(null),

  equipment: z.array(z.string().min(1)).default([]),
});

/** Recipe schema for updates (adds id). */
const UpdateRecipeSchema = RecipeSchema.extend({
  id: z.string().uuid("Invalid recipe id"),
});

/* =============================================================================
 * Auth — Sign in
 * =============================================================================
 */

/**
 * Attempt to sign in using NextAuth credentials provider.
 *
 * Returns a user-friendly string on known auth errors; throws otherwise.
 */
export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    const e = error as any;

    // Normalize all the “credentials sign in failed” shapes from NextAuth v5
    const isCredsError =
      e?.type === "CredentialsSignin" ||
      (e?.name === "AuthError" && e?.type === "CredentialsSignin") ||
      (typeof e?.digest === "string" && e.digest.includes("CredentialsSignin"));

    if (isCredsError) return "Invalid credentials.";

    // Unknown error → bubble up to error boundary/logs
    throw error;
  }
}

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

/* =============================================================================
 * User Profile & Password
 * =============================================================================
 */

/**
 * Helper: "" | null -> undefined, otherwise trimmed string.
 * Used to distinguish “user cleared field” vs “field absent”.
 */
const toOptional = (v: FormDataEntryValue | null) => {
  const s = (v ?? "").toString().trim();
  return s === "" ? undefined : s;
};

/**
 * Update name / last_name / email for the current user.
 *
 * - Detects explicitly cleared fields (empty string)
 * - Validates with zod + some manual checks
 * - Handles duplicate-email DB errors gracefully
 */
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
  const rawUserName = formData.get("user_name");
  const rawLast = formData.get("last_name");
  const rawEmail = formData.get("email");

  const candidate = {
    name: toOptional(rawName),
    user_name: toOptional(rawUserName),
    last_name: toOptional(rawLast),
    email: toOptional(rawEmail),
  };

  // Manual validation to catch explicit blanks
  const errors: Record<string, string[]> = {};
  if (rawName !== null && String(rawName).trim() === "") {
    errors.name = ["First name cannot be empty."];
  }
  if (rawUserName !== null && String(rawUserName).trim() === "") {
    errors.user_name = ["User name cannot be empty."];
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
  if (d.user_name !== undefined) sets.push(sql`user_name = ${d.user_name}`);
  if (d.last_name !== undefined) sets.push(sql`last_name = ${d.last_name}`);
  if (d.email !== undefined) sets.push(sql`email = ${d.email}`);

  if (sets.length === 0) {
    // User submitted, but nothing changed → show a gentle message
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

/**
 * Update password only for the current user.
 *
 * - Requires both password + confirm
 * - Enforces min length 6
 * - Hashes with bcrypt before saving
 */
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
  return { ok: true, message: null, errors: {} };
}

/* =============================================================================
 * Signup
 * =============================================================================
 */

const SignupSchema = z
  .object({
    name: z.string().trim().min(1, "First name is required"),
    user_name: z.string().trim().min(1, "User name is required"),
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

/**
 * Create a new user account and auto sign-in.
 *
 * - Validates with zod
 * - Checks email uniqueness (soft check + DB unique index)
 * - Hashes password
 * - Inserts user and then signs them in
 */
export async function createAccount(_prev: any, formData: FormData) {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    user_name: formData.get("user_name"),
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

  const { name, user_name, last_name, email, password } = parsed.data;

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
      INSERT INTO public.users (name, user_name, last_name, email, password, password_changed_at)
      VALUES (${name},${user_name}, ${last_name}, ${email}, ${hash}, NOW())
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
      redirectTo: "/dashboard",
    });

    // Fallback: if for any reason no redirect occurred, force it.
    redirect("/dashboard");
  } catch {
    // If sign-in fails, send them to login with a success hint.
    redirect("/login?signup=success");
  }

  // Unreachable after redirect; kept for completeness.
  return { ok: true, message: null, errors: {}, userId } as const;
}

export type SignupResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
  userId?: string;
};

/* =============================================================================
 * Notifications — Actions
 * =============================================================================
 */

/** Small shared result shape for notification actions. */
type ActionResult = { ok: boolean; message: string | null };

/**
 * Mark a single notification as read for the current user.
 */
export async function markNotificationRead(
  _prev: ActionResult | undefined,
  formData: FormData
) {
  const userId = await requireUserId();
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return { ok: false, message: "Missing notification id." };
  }

  try {
    await sql/* sql */ `
      UPDATE public.notifications
      SET status = 'read'::notification_status
      WHERE id = ${id}::uuid
        AND user_id = ${userId}::uuid  -- only *this* user's notification
    `;

    revalidatePath("/dashboard/notifications");
    return { ok: true, message: null };
  } catch (e) {
    console.error("markNotificationRead failed:", e);
    return { ok: false, message: "Failed to mark notification as read." };
  }
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllNotificationsRead(
  _prev: ActionResult | undefined,
  _formData: FormData
) {
  const userId = await requireUserId();

  try {
    await sql/* sql */ `
      UPDATE public.notifications
      SET status = 'read'::notification_status
      WHERE user_id = ${userId}::uuid
        AND status = 'unread'::notification_status
    `;

    revalidatePath("/dashboard/notifications");
    return { ok: true, message: null };
  } catch (e) {
    console.error("markAllNotificationsRead failed:", e);
    return { ok: false, message: "Failed to mark all notifications as read." };
  }
}

/**
 * Schema for creating a new notification from the admin UI.
 */
const NewNotificationSchema = z
  .object({
    // null = broadcast, UUID string = specific user
    userId: z
      .string()
      .uuid({ message: "Must be a valid user id" })
      .nullable()
      .optional(),

    title: z.string().trim().min(1, "Title is required"),
    body: z.string().trim().min(1, "Body is required"),

    kind: z.enum(["system", "maintenance", "feature", "message"]),
    level: z.enum(["info", "success", "warning", "error"]),

    linkUrl: z.string().url("Must be a valid URL").optional(),

    // "on" / null / boolean → boolean
    publishNow: z.coerce.boolean().optional().default(true),

    // Raw value from <input type="datetime-local" name="publishAt">
    publishAt: z.preprocess(
      (v) => {
        // disabled -> FormData.get(...) === null
        if (v == null) return undefined;
        if (typeof v !== "string") return undefined;

        const t = v.trim();
        if (!t) return undefined; // empty string = not set

        // keep the raw value; we'll parse later
        return t;
      },
      // Only validate when there *is* a value
      z
        .string()
        .refine((v) => !Number.isNaN(Date.parse(v)), {
          message: "Must be a valid date/time",
        })
        .optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.publishNow && !data.publishAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishAt"],
        message: "Pick a date/time or enable 'Publish now'",
      });
    }
  });

/**
 * Admin-only action to create a new notification.
 *
 * - Supports personal (userId) and broadcast notifications
 * - Handles linkUrl, publishNow / publishAt scheduling
 * - Sets initial status: personal = unread, broadcast = read
 */
export async function createNotification(
  _prev:
    | { ok: boolean; message: string | null; errors?: Record<string, string[]> }
    | undefined,
  formData: FormData
) {
  await requireAdmin();

  const audience = formData.get("audience");
  const rawUserId = formData.get("userId");

  // Decide who this is for: broadcast vs specific user
  const userId =
    audience === "broadcast"
      ? null
      : typeof rawUserId === "string" && rawUserId.trim().length > 0
      ? rawUserId.trim()
      : null;

  // Normalize linkUrl: empty string -> undefined
  const rawLinkUrl = formData.get("linkUrl");
  const linkUrl =
    typeof rawLinkUrl === "string" && rawLinkUrl.trim().length > 0
      ? rawLinkUrl.trim()
      : undefined;

  const parsed = NewNotificationSchema.safeParse({
    userId,
    title: formData.get("title"),
    body: formData.get("body"),
    kind: formData.get("kind"),
    level: formData.get("level"),
    linkUrl,
    publishNow: formData.get("publishNow"),
    publishAt: formData.get("publishAt"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const k = (issue.path[0] as string) || "_form";
      (errors[k] ??= []).push(issue.message);
    }
    return { ok: false, message: "Fix errors and try again.", errors };
  }

  const d = parsed.data;

  // Scheduling rule:
  // - If a publishAt date is provided -> schedule for that date
  // - Else -> publish now
  const publishedAt = d.publishAt ? new Date(d.publishAt) : new Date();

  // Normalize values for SQL (no `undefined`)
  const userIdParam: string | null = d.userId ?? null;
  const linkUrlParam: string | null = d.linkUrl ?? null;

  // Decide initial status: personal = unread, broadcast = read
  const initialStatus: "unread" | "read" = d.userId ? "unread" : "read";

  try {
    // Cast `sql` to any JUST for this call so TS stops complaining
    const result = await (sql as any)/* sql */ `
      INSERT INTO public.notifications (
        user_id,
        title,
        body,
        kind,
        level,
        link_url,
        status,
        published_at
      )
      VALUES (
        ${userIdParam},
        ${d.title},
        ${d.body},
        ${d.kind}::notification_kind,
        ${d.level}::notification_level,
        ${linkUrlParam},
        ${initialStatus}::notification_status,
        ${publishedAt}
      )
      RETURNING id
    `;

    const id = (result as any).rows?.[0]?.id as string | undefined;

    return { ok: true, message: null, id };
  } catch (e) {
    console.error("createNotification failed:", e);
    return { ok: false, message: "Failed to create notification." };
  }
}

/* =============================================================================
 * Ingredients handling
 * =============================================================================
 */

/**
 * Literal list of valid units to validate against.
 * NOTE: currently not enforced in zod (but kept here for future use).
 */
const VALID_INGREDIENT_UNITS: IngredientUnit[] = [
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup_metric",
  "cup_us",
  "fl_oz",
  "pt",
  "qt",
  "gal",
  "pinch",
  "dash",
  "drop",
  "splash",
  "g",
  "kg",
  "oz",
  "lb",
  "mm",
  "cm",
  "in",
  "celsius",
  "fahrenheit",
  "piece",
];

/**
 * Schema for a single structured ingredient payload.
 * (Currently used as a reference; main parsing happens in parseIngredientsJson.)
 */
const IngredientPayloadSchema = z.object({
  ingredientName: z.string().trim().min(1),
  quantity: z.number().nullable(),
  unit: z
    .string()
    .nullable()
    .transform((v) => (v === null ? null : (v as IngredientUnit))),
  isOptional: z.boolean(),
  position: z.number().int().nonnegative(),
});

/** Array-of-ingredients variant (kept for potential direct validation). */
const IngredientsPayloadSchema = z.array(IngredientPayloadSchema);

/**
 * Parse and normalize `ingredientsJson` from a FormData payload.
 *
 * - Accepts loosely typed array of objects
 * - Cleans up names, quantities, units, isOptional, position
 * - Returns a flat IncomingIngredientPayload[] and optional error message
 */
export async function parseIngredientsJson(
  formData: FormData
): Promise<{ ingredients: IncomingIngredientPayload[]; error?: string }> {
  const raw = formData.get("ingredientsJson");

  if (typeof raw !== "string" || !raw.trim()) {
    return { ingredients: [], error: undefined };
  }

  try {
    const parsed = JSON.parse(raw) as any[];

    const cleaned: IncomingIngredientPayload[] = [];

    parsed.forEach((item, index) => {
      if (!item) return;

      const name = String(item.ingredientName ?? "").trim();
      if (!name) return;

      let qty: number | null = null;
      if (
        item.quantity !== null &&
        item.quantity !== undefined &&
        item.quantity !== ""
      ) {
        const n = Number(item.quantity);
        if (Number.isFinite(n)) qty = n;
      }

      const rawUnit = item.unit as string | null | undefined;
      const unit =
        rawUnit && rawUnit.length ? (rawUnit as IngredientUnit) : null;

      const isOptional = Boolean(item.isOptional);

      cleaned.push({
        ingredientName: name,
        quantity: qty,
        unit,
        isOptional,
        position: typeof item.position === "number" ? item.position : index,
      });
    });

    return { ingredients: cleaned, error: undefined };
  } catch (e) {
    console.error("parseIngredientsJson failed:", e);
    return {
      ingredients: [],
      error: "Ingredients data is invalid.",
    };
  }
}

/**
 * Simple slug helper to normalize ingredient names into URL-safe slugs.
 * Replace with a shared helper if you centralize slugging later.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Sync structured ingredients with the `recipe_ingredients` join table.
 *
 * Strategy:
 * - Remove all existing rows for the recipe
 * - Upsert each ingredient into `ingredients` by slug
 * - Insert into `recipe_ingredients` with quantities/units/flags
 *
 * NOTE: Currently not exported. Call from create/update flows
 * when you’re ready to fully migrate to the join-table model.
 */
async function syncRecipeIngredients(
  recipeId: string,
  ingredients: IncomingIngredientPayload[]
) {
  // Remove previous structured ingredients
  await sql/* sql */ `
    DELETE FROM public.recipe_ingredients
    WHERE recipe_id = ${recipeId}::uuid
  `;

  if (!ingredients.length) {
    console.log("DEBUG: no ingredients to sync for recipe", recipeId);
    return;
  }

  for (const ing of ingredients) {
    const trimmedName = ing.ingredientName.trim();
    if (!trimmedName) continue;

    const slug = slugify(trimmedName);

    // Upsert ingredient
    const ingredientRows = await sql<{ id: string }[]>/* sql */ `
      INSERT INTO public.ingredients (name, slug)
      VALUES (${trimmedName}, ${slug})
      ON CONFLICT (slug)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    const ingredientId = ingredientRows[0]?.id;
    if (!ingredientId) continue;

    // Link recipe + ingredient
    await sql/* sql */ `
      INSERT INTO public.recipe_ingredients (
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        is_optional,
        position
      )
      VALUES (
        ${recipeId}::uuid,
        ${ingredientId}::uuid,
        ${ing.quantity},
        ${ing.unit},
        ${ing.isOptional},
        ${ing.position}
      )
    `;
  }
}

/* =============================================================================
 * Discover recipes
 * =============================================================================
 */

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
