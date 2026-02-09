import { auth } from "@/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Future-proof roles:
 * - keep "user" and "admin" as known literals
 * - allow any other string later without refactors
 */
export type SessionUserRole = "user" | "admin" | (string & {});

type RequireOptions = {
  callbackUrl?: string; // used for /login?callbackUrl=...
  redirectTo?: string; // used when logged-in but unauthorized
};

/** Make TS understand this never returns (redirect throws). */
function redirectToLogin(callbackUrl?: string): never {
  const url = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";
  return redirect(url);
}

/** Always use the server signature (Session | null). */
async function getSession(): Promise<Session | null> {
  return (await auth()) as Session | null;
}

/** Require a signed-in user and return the session. */
export async function requireSession(
  options?: RequireOptions,
): Promise<Session> {
  const session = await getSession();
  if (!session?.user) redirectToLogin(options?.callbackUrl);
  return session; // now TS knows session is Session here
}

/** Require a signed-in user and return their user id. */
export async function requireUserId(options?: RequireOptions): Promise<string> {
  const session = await requireSession(options);
  const id = (session.user as any)?.id as string | undefined;
  if (!id) redirectToLogin(options?.callbackUrl);
  return id; // now TS knows id is string here
}

/** Get the role from a provided session or from the current session. */
export async function getSessionRole(
  session?: Session | null,
): Promise<SessionUserRole> {
  const s = session ?? (await getSession());
  return ((s?.user as any)?.user_role ?? "user") as SessionUserRole;
}

/** Require one of these roles (returns session + role + userId). */
export async function requireRole(
  allowed: readonly SessionUserRole[],
  options?: RequireOptions,
): Promise<{ session: Session; role: SessionUserRole; userId: string }> {
  const session = await requireSession(options);
  const role = await getSessionRole(session);

  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) redirectToLogin(options?.callbackUrl);

  if (!allowed.includes(role)) {
    return redirect(options?.redirectTo ?? "/dashboard");
  }

  return { session, role, userId };
}

/** Convenience helper: admin-only. */
export async function requireAdmin(options?: RequireOptions) {
  return requireRole(["admin"], options);
}
