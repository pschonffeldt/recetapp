"use server";

import { sql } from "@/app/lib/db";

export type ActionResult = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

export async function setContactSolved(formData: FormData) {
  const id = formData.get("id");
  const solved = formData.get("solved") === "true";

  if (!id || typeof id !== "string") {
    return { ok: false, message: "Invalid id." };
  }

  try {
    if (solved) {
      await sql`
        UPDATE public.public_inbox
        SET
          status = 'solved'::contact_status,
          solved_at = NOW(),
          updated_at = NOW()
        WHERE id = ${id}::uuid
      `;
    } else {
      await sql`
        UPDATE public.public_inbox
        SET
          status = 'open'::contact_status,
          solved_at = NULL,
          updated_at = NOW()
        WHERE id = ${id}::uuid
      `;
    }

    return { ok: true };
  } catch (e) {
    console.error("setContactSolved failed:", e);
    return {
      ok: false,
      message: "Failed to update contact message.",
    };
  }
}
