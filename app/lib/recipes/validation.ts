/* =============================================================================
 * Recipe Validation (Zod Schemas)
 * =============================================================================
 * - StatusEnum, DifficultyEnum: enums mirroring DB enums
 * - RecipeSchema: base schema for create/update forms (no id)
 * - UpdateRecipeSchema: extends RecipeSchema with id
 *
 * Notes:
 * - Use RecipeSchema / UpdateRecipeSchema in server actions.
 * - Use RecipeFormValues / RecipeUpdateValues for TypeScript types in UI.
 * =============================================================================
 */

import { z } from "zod";

/* =============================================================================
 * Enums
 * =============================================================================
 */

/** Enum for recipe visibility. */
export const StatusEnum = z.enum(["private", "public"]);

/** Enum for recipe difficulty. */
export const DifficultyEnum = z.enum(["easy", "medium", "hard"]);

/* =============================================================================
 * Schemas
 * =============================================================================
 */

/**
 * Base recipe schema used for create/update.
 * `id` is added by UpdateRecipeSchema when needed.
 */
export const RecipeSchema = z.object({
  recipe_name: z.string().min(1, "Recipe name is required"),
  recipe_type: z.enum(["breakfast", "lunch", "dinner", "dessert", "snack"]),

  recipe_ingredients: z.array(z.string().min(1)).optional().default([]),

  recipe_steps: z.array(z.string().min(1)).min(1, "Enter at least one step"),

  servings: z
    .number()
    .int()
    .min(1, "Must be 1 or greater")
    .nullable()
    .default(null),

  prep_time_min: z
    .number()
    .int()
    .min(0, "Must be 0 or greater")
    .nullable()
    .default(null),

  difficulty: DifficultyEnum.nullable().default(null),
  status: StatusEnum.default("private"),

  dietary_flags: z.array(z.string().min(1)).default([]),
  allergens: z.array(z.string().min(1)).default([]),

  calories_total: z
    .number()
    .int()
    .min(0, "Must be 0 or greater")
    .nullable()
    .default(null),

  // numeric as string (handled by toMoney before hitting DB)
  estimated_cost_total: z
    .number()
    .min(0, "Must be 0 or greater")
    .nullable()
    .default(null),

  equipment: z.array(z.string().min(1)).default([]),
});

/** Recipe schema for updates (adds id). */
export const UpdateRecipeSchema = RecipeSchema.extend({
  id: z.string().uuid("Invalid recipe id"),
});

/* =============================================================================
 * Types
 * =============================================================================
 */

export type RecipeFormValues = z.infer<typeof RecipeSchema>;
export type RecipeUpdateValues = z.infer<typeof UpdateRecipeSchema>;
