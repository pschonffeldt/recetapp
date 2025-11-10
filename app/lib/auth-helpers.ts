import { auth } from "@/auth";

export async function requireUserId() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) throw new Error("Unauthorized");
  return id;
}
