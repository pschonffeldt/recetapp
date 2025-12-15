/* =============================================================================
 * Account Actions (Profile & Password)
 * =============================================================================
 * - updateUserProfile: update name / user_name / last_name / email
 * - updateUserPassword: change the current user's password
 *
 * Conventions:
 * - All actions require a logged-in user (via auth()).
 * - Designed to be used with useFormState on the client.
 * - Validation happens close to the edge (here), using zod + manual checks.
 * =============================================================================
 */

"use server";

import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sql } from "../db";
import { UpdateUserProfileSchema } from "./validation";
import { requireUserId } from "../auth/helpers";
import { MembershipTier } from "../types/definitions";

/* =============================================================================
 * Types
 * =============================================================================
 */

/**
 * Shared form state for account-related actions.
 * Returned shape is compatible with useFormState.
 */
export type AccountFormState = {
  message: string | null;
  errors: Record<string, string[]>;
  ok: boolean;
  /**
   * Optional hint for callers that a full refresh/revalidation
   * would be a good idea after a successful action.
   */
  shouldRefresh?: boolean;
};

/* =============================================================================
 * Helpers
 * =============================================================================
 */

/**
 * "" | null -> undefined, otherwise trimmed string.
 *
 * Used to distinguish:
 * - user explicitly cleared a field (empty string)  → undefined
 * - field was never present                        → undefined
 * - field has value                                → trimmed string
 */
function toOptional(v: FormDataEntryValue | null): string | undefined {
  const s = (v ?? "").toString().trim();
  return s === "" ? undefined : s;
}

/* =============================================================================
 * Actions
 * =============================================================================
 */

/**
 * Update name / user_name / last_name / email for the current user.
 *
 * - Detects explicitly cleared fields (empty string)
 * - Validates with zod + manual checks for empties
 * - Handles duplicate-email DB errors gracefully
 */
// lib/account/actions.ts (only updateUserProfile)

export async function updateUserProfile(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return { message: "Unauthorized.", errors: {}, ok: false };

  // keep empty string ("") so optional fields can be cleared
  const toOptionalKeepEmpty = (
    v: FormDataEntryValue | null
  ): string | undefined => {
    if (v === null) return undefined;
    return v.toString().trim(); // may be ""
  };

  const csvToTextArray = (s: string): string[] =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const rawName = formData.get("name");
  const rawUserName = formData.get("user_name");
  const rawLast = formData.get("last_name");
  const rawEmail = formData.get("email");
  const rawCountry = formData.get("country");
  const rawGender = formData.get("gender");
  const rawDob = formData.get("date_of_birth");
  const rawAllergies = formData.get("allergies");
  const rawDietaryFlags = formData.get("dietary_flags");
  const rawHeight = formData.get("height_cm");
  const rawWeight = formData.get("weight_kg");

  const candidate = {
    name: toOptionalKeepEmpty(rawName),
    user_name: toOptionalKeepEmpty(rawUserName),
    last_name: toOptionalKeepEmpty(rawLast),
    email: toOptionalKeepEmpty(rawEmail),
    country: toOptionalKeepEmpty(rawCountry),
    gender: toOptionalKeepEmpty(rawGender),
    date_of_birth: toOptionalKeepEmpty(rawDob),
    allergies: toOptionalKeepEmpty(rawAllergies),
    dietary_flags: toOptionalKeepEmpty(rawDietaryFlags),
    height_cm: toOptionalKeepEmpty(rawHeight),
    weight_kg: toOptionalKeepEmpty(rawWeight),
  };

  // Manual validation for required-ish fields (only if present in form submit)
  const errors: Record<string, string[]> = {};
  if (rawName !== null && String(rawName).trim() === "") {
    errors.name = ["First name cannot be empty."];
  }
  if (rawUserName !== null && String(rawUserName).trim() === "") {
    errors.user_name = ["User name cannot be empty."];
  }
  if (rawEmail !== null && String(rawEmail).trim() === "") {
    errors.email = ["Email cannot be empty."];
  }

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
  const sets: any[] = [];

  // Required / primary fields
  if (d.name !== undefined) sets.push(sql`name = ${d.name}`);
  if (d.user_name !== undefined) sets.push(sql`user_name = ${d.user_name}`);
  if (d.last_name !== undefined) sets.push(sql`last_name = ${d.last_name}`);
  if (d.email !== undefined) sets.push(sql`email = ${d.email}`);

  // Nullable text fields ("" clears -> NULL)
  if (d.country !== undefined) {
    sets.push(
      d.country === "" ? sql`country = NULL` : sql`country = ${d.country}`
    );
  }
  if (d.gender !== undefined) {
    sets.push(d.gender === "" ? sql`gender = NULL` : sql`gender = ${d.gender}`);
  }

  // date_of_birth: "" clears -> NULL, else cast to date
  if (d.date_of_birth !== undefined) {
    sets.push(
      d.date_of_birth === ""
        ? sql`date_of_birth = NULL`
        : sql`date_of_birth = ${d.date_of_birth}::date`
    );
  }

  // allergies / dietary_flags (store as text[]). "" clears -> NULL
  if (d.allergies !== undefined) {
    if (d.allergies === "") {
      sets.push(sql`allergies = NULL`);
    } else {
      const arr = csvToTextArray(d.allergies);
      sets.push(sql`allergies = ${arr}::text[]`);
    }
  }

  if (d.dietary_flags !== undefined) {
    if (d.dietary_flags === "") {
      sets.push(sql`dietary_flags = NULL`);
    } else {
      const arr = csvToTextArray(d.dietary_flags);
      sets.push(sql`dietary_flags = ${arr}::text[]`);
    }
  }

  const toIntOrNull = (s: string) => {
    const cleaned = s.replace(",", ".").trim();
    if (cleaned === "") return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? Math.round(n) : null;
  };

  if (d.height_cm !== undefined) {
    if (d.height_cm === "") sets.push(sql`height_cm = NULL`);
    else sets.push(sql`height_cm = ${toIntOrNull(d.height_cm)}`);
  }

  if (d.weight_kg !== undefined) {
    if (d.weight_kg === "") sets.push(sql`weight_kg = NULL`);
    else sets.push(sql`weight_kg = ${toIntOrNull(d.weight_kg)}`);
  }

  if (sets.length === 0) {
    return { message: "No changes to save.", errors: {}, ok: false };
  }

  sets.push(sql`profile_updated_at = now()`);

  const setSql =
    sets.length === 1
      ? sets[0]
      : sets.slice(1).reduce((acc, cur) => sql`${acc}, ${cur}`, sets[0]);

  try {
    await sql`UPDATE public.users SET ${setSql} WHERE id = ${userId}::uuid`;
  } catch (e: any) {
    const code = e?.code as string | undefined;
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

  revalidatePath("/dashboard/account");
  return { message: null, errors: {}, ok: true, shouldRefresh: true };
}

type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const MEMBERSHIP_LIMITS: Record<MembershipTier, number> = {
  free: 10,
  tier1: 50,
  tier2: 100,
};

export async function updateUserMembership(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const targetId = formData.get("id")?.toString();
    const membership = formData.get("membership_tier")?.toString();

    if (!targetId || targetId !== userId) {
      return {
        ok: false,
        message: "You can only update your own membership.",
        errors: {},
      };
    }

    if (membership !== "free" && membership !== "tier1") {
      return {
        ok: false,
        message: "Invalid membership tier.",
        errors: { membership_tier: ["Please choose a valid plan."] },
      };
    }

    const tier = membership as MembershipTier;

    // Enforce limits on downgrade
    const [{ count }] = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM public.recipes r
      WHERE
        r.user_id = ${userId}::uuid
        OR ${userId}::uuid = ANY(r.saved_by_user_ids)
    `;
    const libraryCount = count ?? 0;
    const maxAllowed = MEMBERSHIP_LIMITS[tier];

    if (libraryCount > maxAllowed) {
      return {
        ok: false,
        message: `You currently have ${libraryCount} recipes in your library. The ${
          tier === "free" ? "Free" : "Tier 1"
        } plan allows up to ${maxAllowed}.`,
        errors: {
          membership_tier: [
            "Reduce your recipes or choose a higher tier to downgrade.",
          ],
        },
      };
    }

    await sql`
      UPDATE public.users
      SET membership_tier = ${tier}::membership_tier,
          updated_at = NOW()
      WHERE id = ${userId}::uuid
    `;

    return { ok: true, message: null, errors: {} };
  } catch (err) {
    console.error("updateUserMembership error:", err);
    return {
      ok: false,
      message: "Something went wrong updating your membership.",
      errors: {},
    };
  }
}

/**
 * Update password only for the current user.
 *
 * - Requires both password + confirm
 * - Enforces min length 6
 * - Hashes with bcrypt before saving
 */
export async function updateUserPassword(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    return { ok: false, message: "Unauthorized.", errors: {} };
  }

  const password = toOptional(formData.get("password"));
  const confirm = toOptional(formData.get("confirm_password"));

  const errors: Record<string, string[]> = {};

  if (!password) {
    errors.password = [
      "To change your password, fill in both password fields.",
    ];
  }
  if (!confirm) {
    errors.confirm_password = ["Confirm password is required."];
  }
  if (password && password.length < 6) {
    errors.password = ["Min 6 characters."];
  }
  if (password && confirm && password !== confirm) {
    errors.confirm_password = ["Passwords do not match."];
  }

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
