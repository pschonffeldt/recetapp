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
import { UpdateUserProfileSchema } from "../validation";

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
export async function updateUserProfile(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    return { message: "Unauthorized.", errors: {}, ok: false };
  }

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
