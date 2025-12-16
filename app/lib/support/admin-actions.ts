"use server";

import { sql } from "@/app/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function isAdmin(session: any) {
  return (session?.user as any)?.user_role === "admin";
}

export async function setSupportSolved(formData: FormData) {
  const session = await auth();
  const adminId = (session?.user as any)?.id as string | undefined;
  if (!adminId || !isAdmin(session)) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  const solved = formData.get("solved")?.toString() === "true";
  if (!id) throw new Error("Missing id");

  if (solved) {
    await sql`
      UPDATE public.support_requests
      SET solved_at = NOW(),
          solved_by = ${adminId}::uuid,
          updated_at = NOW()
      WHERE id = ${id}::uuid
    `;
  } else {
    await sql`
      UPDATE public.support_requests
      SET solved_at = NULL,
          solved_by = NULL,
          updated_at = NOW()
      WHERE id = ${id}::uuid
    `;
  }

  revalidatePath("/dashboard/admin/support");
  revalidatePath(`/dashboard/admin/support/${id}`);
}
