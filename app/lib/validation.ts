import { z } from "zod";

/** Profile fields (any subset allowed) */
export const UpdateUserProfileSchema = z
  .object({
    name: z.string().min(1, "First name is required").optional(),
    last_name: z.string().min(1, "Last name is required").optional(),
    email: z.string().email("Invalid email").optional(),
  })
  // avoid empty payloads (optional)
  .refine(
    (v) =>
      v.name !== undefined ||
      v.last_name !== undefined ||
      v.email !== undefined,
    { message: "Nothing to update", path: ["_form"] }
  );

/** Password change (both are required and must match) */
export const UpdateUserPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((v) => v.password === v.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type UpdateUserPasswordInput = z.infer<typeof UpdateUserPasswordSchema>;
