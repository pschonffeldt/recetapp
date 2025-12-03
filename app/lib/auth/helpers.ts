import { auth } from "@/auth";

/** Require a signed-in user and return their id. */
export async function requireUserId() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) throw new Error("Unauthorized");
  return id;
}

/** Get the current session role ("user" | "admin"); defaults to "user". */
export async function getSessionRole(): Promise<"user" | "admin"> {
  const session = await auth();
  return ((session?.user as any)?.user_role ?? "user") as "user" | "admin";
}

/** Throw if the current user is not an admin. */
export async function requireAdmin() {
  const role = await getSessionRole();
  if (role !== "admin") throw new Error("Forbidden");
}

/** Return true if the current user can manage notifications (admin). */
export async function canManageNotifications(): Promise<boolean> {
  return (await getSessionRole()) === "admin";
}

/** Throw if the current user cannot manage notifications. */
export async function requireCanManageNotifications() {
  if (!(await canManageNotifications())) throw new Error("Forbidden");
}
