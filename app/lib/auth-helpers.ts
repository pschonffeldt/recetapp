import { auth } from "@/auth";

export async function requireUserId() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) throw new Error("Unauthorized");
  return id;
}

export async function getSessionRole(): Promise<"user" | "admin"> {
  const session = await auth();
  return ((session?.user as any)?.user_role ?? "user") as "user" | "admin";
}

export async function requireAdmin() {
  const role = await getSessionRole();
  if (role !== "admin") throw new Error("Forbidden");
}
