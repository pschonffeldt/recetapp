import {
  IncomingIngredientPayload,
  IngredientUnit,
  UNIT_LABELS,
  RecipeForm,
} from "@/app/lib/types/definitions";

/**
 * Safely normalise any unknown value (jsonb, stringified JSON, etc.)
 * into an array of IncomingIngredientPayload.
 */
export function parseStructuredIngredients(
  raw: unknown
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
  const unitLabel = ing.unit ? UNIT_LABELS[ing.unit] ?? ing.unit : "";
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
  list: IncomingIngredientPayload[]
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
    (recipe as any).recipe_ingredients_structured
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
  recipe: RecipeForm
): IncomingIngredientPayload[] {
  // Reuse the shared parser – it already handles:
  // - array of objects
  // - JSON string
  const structured = parseStructuredIngredients(
    (recipe as any).recipe_ingredients_structured
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
