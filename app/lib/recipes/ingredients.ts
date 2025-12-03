import z from "zod";
import { IncomingIngredientPayload, IngredientUnit } from "../definitions";
import { sql } from "../db";

/**
 * Parse and normalize `ingredientsJson` from a FormData payload.
 *
 * - Accepts loosely typed array of objects
 * - Cleans up names, quantities, units, isOptional, position
 * - Returns a flat IncomingIngredientPayload[] and optional error message
 */
export async function parseIngredientsJson(
  formData: FormData
): Promise<{ ingredients: IncomingIngredientPayload[]; error?: string }> {
  const raw = formData.get("ingredientsJson");

  if (typeof raw !== "string" || !raw.trim()) {
    return { ingredients: [], error: undefined };
  }

  try {
    const parsed = JSON.parse(raw) as any[];

    const cleaned: IncomingIngredientPayload[] = [];

    parsed.forEach((item, index) => {
      if (!item) return;

      const name = String(item.ingredientName ?? "").trim();
      if (!name) return;

      let qty: number | null = null;
      if (
        item.quantity !== null &&
        item.quantity !== undefined &&
        item.quantity !== ""
      ) {
        const n = Number(item.quantity);
        if (Number.isFinite(n)) qty = n;
      }

      const rawUnit = item.unit as string | null | undefined;
      const unit =
        rawUnit && rawUnit.length ? (rawUnit as IngredientUnit) : null;

      const isOptional = Boolean(item.isOptional);

      cleaned.push({
        ingredientName: name,
        quantity: qty,
        unit,
        isOptional,
        position: typeof item.position === "number" ? item.position : index,
      });
    });

    return { ingredients: cleaned, error: undefined };
  } catch (e) {
    console.error("parseIngredientsJson failed:", e);
    return {
      ingredients: [],
      error: "Ingredients data is invalid.",
    };
  }
}

/* =============================================================================
 * Ingredients handling
 * =============================================================================
 */

/**
 * Literal list of valid units to validate against.
 * NOTE: currently not enforced in zod (but kept here for future use).
 */
const VALID_INGREDIENT_UNITS: IngredientUnit[] = [
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup_metric",
  "cup_us",
  "fl_oz",
  "pt",
  "qt",
  "gal",
  "pinch",
  "dash",
  "drop",
  "splash",
  "g",
  "kg",
  "oz",
  "lb",
  "mm",
  "cm",
  "in",
  "celsius",
  "fahrenheit",
  "piece",
];

/**
 * Schema for a single structured ingredient payload.
 * (Currently used as a reference; main parsing happens in parseIngredientsJson.)
 */
const IngredientPayloadSchema = z.object({
  ingredientName: z.string().trim().min(1),
  quantity: z.number().nullable(),
  unit: z
    .string()
    .nullable()
    .transform((v) => (v === null ? null : (v as IngredientUnit))),
  isOptional: z.boolean(),
  position: z.number().int().nonnegative(),
});

/** Array-of-ingredients variant (kept for potential direct validation). */
const IngredientsPayloadSchema = z.array(IngredientPayloadSchema);

/**
 * Simple slug helper to normalize ingredient names into URL-safe slugs.
 * Replace with a shared helper if you centralize slugging later.
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Sync structured ingredients with the `recipe_ingredients` join table.
 *
 * Strategy:
 * - Remove all existing rows for the recipe
 * - Upsert each ingredient into `ingredients` by slug
 * - Insert into `recipe_ingredients` with quantities/units/flags
 *
 * NOTE: Currently not exported. Call from create/update flows
 * when you’re ready to fully migrate to the join-table model.
 */
async function syncRecipeIngredients(
  recipeId: string,
  ingredients: IncomingIngredientPayload[]
) {
  // Remove previous structured ingredients
  await sql/* sql */ `
    DELETE FROM public.recipe_ingredients
    WHERE recipe_id = ${recipeId}::uuid
  `;

  if (!ingredients.length) {
    console.log("DEBUG: no ingredients to sync for recipe", recipeId);
    return;
  }

  for (const ing of ingredients) {
    const trimmedName = ing.ingredientName.trim();
    if (!trimmedName) continue;

    const slug = slugify(trimmedName);

    // Upsert ingredient
    const ingredientRows = await sql<{ id: string }[]>/* sql */ `
      INSERT INTO public.ingredients (name, slug)
      VALUES (${trimmedName}, ${slug})
      ON CONFLICT (slug)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `;

    const ingredientId = ingredientRows[0]?.id;
    if (!ingredientId) continue;

    // Link recipe + ingredient
    await sql/* sql */ `
      INSERT INTO public.recipe_ingredients (
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        is_optional,
        position
      )
      VALUES (
        ${recipeId}::uuid,
        ${ingredientId}::uuid,
        ${ing.quantity},
        ${ing.unit},
        ${ing.isOptional},
        ${ing.position}
      )
    `;
  }
}
