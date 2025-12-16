"use server";

import { auth } from "@/auth";
import { sql } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

export async function setSupportSolved(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.user_role as string | undefined;

  if (!userId || role !== "admin") {
    return { ok: false, message: "Unauthorized.", errors: {} };
  }

  const id = formData.get("id")?.toString();
  const solvedRaw = formData.get("solved")?.toString();
  const solved = solvedRaw === "true";

  if (!id) return { ok: false, message: "Missing message id.", errors: {} };

  try {
    await sql`
      UPDATE public.support_requests
      SET
        status = ${solved ? "solved" : "open"}::support_status,
        solved_at = ${solved ? sql`NOW()` : sql`NULL`},
        solved_by = ${solved ? sql`${userId}::uuid` : sql`NULL`},
        updated_at = NOW()
      WHERE id = ${id}::uuid
    `;

    revalidatePath("/dashboard/admin/support");
    revalidatePath(`/dashboard/admin/support/${id}`);

    return {
      ok: true,
      message: solved ? "Marked as solved." : "Marked as unsolved.",
      errors: {},
    };
  } catch (e) {
    console.error("setSupportSolved failed:", e);
    return {
      ok: false,
      message: "Failed to update support message.",
      errors: {},
    };
  }
}
