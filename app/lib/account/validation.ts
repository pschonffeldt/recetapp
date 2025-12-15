import { z } from "zod";

const optTrimmed = z.string().trim().optional();

export const UpdateUserProfileSchema = z
  .object({
    // required-ish fields (only validated if provided)
    name: z.string().trim().min(1, "First name is required").optional(),
    user_name: z.string().trim().min(1, "User name is required").optional(),
    last_name: optTrimmed, // allow empty -> action decides
    email: z.string().trim().email("Invalid email").optional(),

    // nullable/optional profile fields ("" allowed to clear)
    country: optTrimmed,
    gender: optTrimmed,

    date_of_birth: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => v === undefined || v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v),
        {
          message: "Use format YYYY-MM-DD",
        }
      ),

    allergies: optTrimmed,
    dietary_flags: optTrimmed,

    height_cm: z
      .string()
      .trim()
      .optional()
      .refine((v) => v === undefined || v === "" || !Number.isNaN(Number(v)), {
        message: "Height must be a number",
      }),

    weight_kg: z
      .string()
      .trim()
      .optional()
      .refine((v) => v === undefined || v === "" || !Number.isNaN(Number(v)), {
        message: "Weight must be a number",
      }),
  })
  .refine((v) => Object.values(v).some((val) => val !== undefined), {
    message: "Nothing to update",
    path: ["_form"],
  });

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
