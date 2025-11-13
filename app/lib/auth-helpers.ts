import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type SessionUser = { id: string };

export async function requireUserId(
  opts: { redirectTo?: string } = {}
): Promise<string> {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (id) return id;

  if (opts.redirectTo) {
    // Great for server actions/pages that should bounce to login
    redirect(opts.redirectTo);
  }
  throw new Error("Unauthorized");
}

/** If you ever need more than just the id */
export async function requireSession(
  opts: { redirectTo?: string } = {}
): Promise<SessionUser> {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (id) return { id };
  if (opts.redirectTo) redirect(opts.redirectTo);
  throw new Error("Unauthorized");
}

/** Tiny guard for owner checks in actions/data */
export function isOwner(
  ownerId: string | null | undefined,
  userId: string
): boolean {
  return !!ownerId && ownerId === userId;
}
