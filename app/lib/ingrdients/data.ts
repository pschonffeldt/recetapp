/* =============================================================================
 * Shopping list / structured ingredients
 * =============================================================================
 */

import { sql } from "../db";
import { IncomingIngredientPayload } from "../types/definitions";
import {
  IngredientUnit,
  RecipeForm,
  UNIT_LABELS,
} from "@/app/lib/types/definitions";

/** Row shape when we only care about the structured ingredients JSON. */
type RecipeIngredientsRow = {
  recipe_ingredients_structured: unknown;
};

/**
 * Legacy helper: fetch all structured ingredients for a user.
 *
 * NOTE: This function is tolerant to two storage formats:
 *  - JSON array already deserialized by postgres.js
 *  - JSON string stored in the column
 */
export async function fetchAllStructuredIngredientsForUser(
  userId: string,
): Promise<IncomingIngredientPayload[]> {
  const rows = await sql<RecipeIngredientsRow[]> /* sql */ `
    SELECT recipe_ingredients_structured
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
  `;

  const result: IncomingIngredientPayload[] = [];

  for (const row of rows) {
    const raw = row.recipe_ingredients_structured;
    if (!raw) continue;

    // Case 1: column already deserialized as array
    if (Array.isArray(raw)) {
      for (const ing of raw) {
        if (ing && typeof (ing as any).ingredientName === "string") {
          result.push(ing as IncomingIngredientPayload);
        }
      }
      continue;
    }

    // Case 2: stored as JSON string
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const ing of parsed) {
            if (ing && typeof (ing as any).ingredientName === "string") {
              result.push(ing as IncomingIngredientPayload);
            }
          }
        }
      } catch (e) {
        console.error(
          "Failed to parse recipe_ingredients_structured for user %s:",
          userId,
          e,
        );
      }
    }
  }

  return result;
}

/**
 * Fetch all structured ingredients for a user.
 *
 * If `recipeIds` is provided, only those recipes are included.
 * This is the main entry point for the shopping list aggregation:
 * it returns a flat list of ingredients ready to be grouped/merged by the UI.
 */
export async function fetchIngredientsForUser(
  userId: string,
  recipeIds?: string[],
): Promise<IncomingIngredientPayload[]> {
  const rows = await sql<RecipeIngredientsRow[]>`
    SELECT recipe_ingredients_structured
    FROM public.recipes
    WHERE user_id = ${userId}::uuid
    ${
      recipeIds && recipeIds.length > 0
        ? sql`AND id IN ${sql(recipeIds)}`
        : sql``
    }
  `;

  const all: IncomingIngredientPayload[] = [];

  for (const row of rows) {
    const parsed = parseStructuredIngredients(
      row.recipe_ingredients_structured,
    );
    if (parsed.length > 0) {
      all.push(...parsed);
    }
  }

  return all;
}

/**
 * Safely normalise any unknown value (jsonb, stringified JSON, etc.)
 * into an array of IncomingIngredientPayload.
 */
export function parseStructuredIngredients(
  raw: unknown,
): IncomingIngredientPayload[] {
  if (!raw) return [];

  // Case 1: already an array of objects (jsonb → JS)
  if (Array.isArray(raw)) {
    return raw
      .map(normalizeOne)
      .filter((x): x is IncomingIngredientPayload => x !== null);
  }

  // Case 2: stringified JSON
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map(normalizeOne)
          .filter((x): x is IncomingIngredientPayload => x !== null);
      }
    } catch (e) {
      console.error("Failed to parse structured ingredients JSON:", e);
    }
  }

  return [];
}

function normalizeOne(raw: any): IncomingIngredientPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const ingredientName =
    typeof raw.ingredientName === "string" ? raw.ingredientName.trim() : "";

  if (!ingredientName) return null;

  const quantity = typeof raw.quantity === "number" ? raw.quantity : null;

  const unit = (raw.unit ?? null) as IngredientUnit | null;

  const isOptional = Boolean(raw.isOptional);
  const position = typeof raw.position === "number" ? raw.position : 0;

  return {
    ingredientName,
    quantity,
    unit,
    isOptional,
    position,
  };
}

/** Turn a single ingredient into a human-readable label. */
export function formatIngredient(ing: IncomingIngredientPayload): string {
  const unitLabel = ing.unit ? (UNIT_LABELS[ing.unit] ?? ing.unit) : "";
  const qtyPart =
    ing.quantity != null
      ? unitLabel
        ? `${ing.quantity} ${unitLabel}`
        : String(ing.quantity)
      : "";

  const base = qtyPart
    ? `${qtyPart} ${ing.ingredientName}`
    : ing.ingredientName;

  return ing.isOptional ? `${base} (optional)` : base;
}

/**
 * Build the list of display strings from a payload array.
 * (Sorted by position.)
 */
export function buildIngredientLinesFromPayload(
  list: IncomingIngredientPayload[],
): string[] {
  if (!list || list.length === 0) return [];
  return [...list]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(formatIngredient);
}

/**
 * Convenience helper: given a RecipeForm, prefer the structured
 * ingredients; fall back to the legacy text[].
 */
export function buildIngredientLines(recipe: RecipeForm): string[] {
  const structured = parseStructuredIngredients(
    // recipe_ingredients_structured can be array | string | null
    (recipe as any).recipe_ingredients_structured,
  );

  if (!structured.length) {
    return recipe.recipe_ingredients ?? [];
  }

  return buildIngredientLinesFromPayload(structured);
}

/**
 * Build the initial list of ingredients for the editor component.
 * - Prefer structured json/jsonb
 * - Fallback to legacy text[] (recipe_ingredients)
 */
export function buildInitialIngredientsForEditor(
  recipe: RecipeForm,
): IncomingIngredientPayload[] {
  // Reuse the shared parser – it already handles:
  // - array of objects
  // - JSON string
  const structured = parseStructuredIngredients(
    (recipe as any).recipe_ingredients_structured,
  );

  if (structured.length > 0) {
    return structured;
  }

  // Fallback: legacy text[] → minimal structured shape
  return (recipe.recipe_ingredients ?? []).map((name, index) => ({
    ingredientName: name,
    quantity: null,
    unit: null,
    isOptional: false,
    position: index,
  }));
}
