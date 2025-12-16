"use server";

import { sql } from "@/app/lib/db";
import { requireUserId } from "@/app/lib/auth/helpers";
import { z } from "zod";

type State = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const Schema = z.object({
  category: z.enum(["bug", "billing", "feature", "account", "other"]),
  subject: z
    .string()
    .trim()
    .min(3, "Subject is too short.")
    .max(120, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Please add more detail.")
    .max(5000, "Message is too long."),
});

export async function createSupportRequest(
  _prev: State,
  formData: FormData
): Promise<State> {
  const userId = await requireUserId();

  const parsed = Schema.safeParse({
    category: formData.get("category"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] as string) || "_form";
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, message: "Please fix the errors.", errors };
  }

  try {
    const { category, subject, message } = parsed.data;
    await sql`
      INSERT INTO public.support_requests (user_id, category, subject, message)
      VALUES (${userId}::uuid, ${category}, ${subject}, ${message})
    `;
    return { ok: true, message: null, errors: {} };
  } catch (e) {
    console.error("createSupportRequest failed:", e);
    return {
      ok: false,
      message: "Failed to send support request.",
      errors: {},
    };
  }
}
