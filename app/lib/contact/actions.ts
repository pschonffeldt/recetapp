"use server";

import { sql } from "@/app/lib/db";
import { z } from "zod";

type State = {
  ok: boolean;
  message: string | null;
  errors: Record<string, string[]>;
};

const Schema = z.object({
  contact_name: z
    .string()
    .trim()
    .min(2, "Name is too short.")
    .max(120, "Name is too long."),
  contact_email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email."),
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

  // honeypot (optional but recommended)
  company: z.string().optional(),
});

export async function createContactRequest(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const parsed = Schema.safeParse({
    contact_name: formData.get("name"),
    contact_email: formData.get("email"),
    category: formData.get("category") ?? formData.get("topic"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    company: formData.get("company") ?? undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = (issue.path[0] as string) || "_form";
      (errors[key] ??= []).push(issue.message);
    }
    return { ok: false, message: "Please fix the errors.", errors };
  }

  // spam bot trap
  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return { ok: false, message: "Invalid submission.", errors: {} };
  }

  try {
    const { contact_name, contact_email, category, subject, message } =
      parsed.data;

    await sql`
      INSERT INTO public.public_inbox (
        contact_name,
        contact_email,
        category,
        subject,
        message,
        status
      )
      VALUES (
        ${contact_name},
        ${contact_email},
        ${category},
        ${subject},
        ${message},
        'open'::contact_status
      )
    `;

    return { ok: true, message: "Message sent.", errors: {} };
  } catch (e) {
    console.error("createContactRequest failed:", e);
    return {
      ok: false,
      message: "Failed to send message.",
      errors: {},
    };
  }
}
