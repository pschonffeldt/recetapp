import { auth } from "@/auth";
import { redirect } from "next/navigation";

type SessionUserRole = "user" | "admin";

/** Require a signed-in user and return their id. */
export async function requireUserId() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;

  if (!id) redirect("/login");

  return id;
}

/** Get the current session role; defaults to "user". */
export async function getSessionRole(): Promise<SessionUserRole> {
  const session = await auth();
  return ((session?.user as any)?.user_role ?? "user") as SessionUserRole;
}

/** Redirect if the current user is not an admin. */
export async function requireAdmin() {
  const role = await getSessionRole();
  if (role !== "admin") redirect("/dashboard");
}

/** Return true if the current user can manage notifications (admin). */
export async function canManageNotifications(): Promise<boolean> {
  return (await getSessionRole()) === "admin";
}

/** Redirect if the current user cannot manage notifications. */
export async function requireCanManageNotifications() {
  if (!(await canManageNotifications())) redirect("/dashboard");
}
