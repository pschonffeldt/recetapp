/* =============================================================================
 * Auth Actions
 * =============================================================================
 * - authenticate: sign in via NextAuth credentials provider
 * - createAccount: sign up + auto sign-in
 *
 * Conventions:
 * - Server-only file (`"use server"`).
 * - Designed to be used with useFormState on the client.
 * - Validation with zod close to the edge.
 * =============================================================================
 */

"use server";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sql } from "../db";

/* =============================================================================
 * Types
 * =============================================================================
 */

/**
 * Shared result shape for the signup flow.
 * Returned shape is compatible with useFormState.
 */
export type SignupResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
  userId?: string;
};

/* =============================================================================
 * Schemas
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

/* =============================================================================
 * Actions
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
): Promise<string | undefined> {
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

/**
 * Create a new user account and auto sign-in.
 *
 * - Validates with zod
 * - Checks email uniqueness (soft check + DB unique index)
 * - Hashes password
 * - Inserts user and then signs them in
 */
export async function createAccount(
  _prev: SignupResult,
  formData: FormData
): Promise<SignupResult> {
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
    SELECT 1 FROM public.users WHERE LOWER(email) = ${email} LIMIT 1
  `;
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
      INSERT INTO public.users
        (name, user_name, last_name, email, password, password_changed_at)
      VALUES
        (${name}, ${user_name}, ${last_name}, ${email}, ${hash}, NOW())
      RETURNING id
    `;
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

  // Unreachable after redirect; kept for completeness / typing.
  return { ok: true, message: null, errors: {}, userId } as SignupResult;
}
