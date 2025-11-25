import {
  RecipeForm,
  IncomingIngredientPayload,
  IngredientUnit,
  AggregatedIngredient,
} from "@/app/lib/definitions";

/**
 * Normalize structured ingredients for a recipe.
 * Handles:
 * - jsonb column already parsed as array
 * - jsonb column as a JSON string
 * - legacy text[] ingredients (fallback)
 */
export function getStructuredIngredientsForRecipe(
  recipe: RecipeForm
): IncomingIngredientPayload[] {
  const raw = (recipe as any).recipe_ingredients_structured;

  // No structured column → fallback to text[]
  if (!raw) {
    const names = recipe.recipe_ingredients ?? [];
    return names.map((name, index) => ({
      ingredientName: name,
      quantity: null,
      unit: null as IngredientUnit | null,
      isOptional: false,
      position: index,
    }));
  }

  // Already parsed array
  if (Array.isArray(raw)) {
    return raw as IncomingIngredientPayload[];
  }

  // JSON string
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as IncomingIngredientPayload[];
      }
    } catch (e) {
      console.error("Failed to parse recipe_ingredients_structured:", e);
    }
  }

  // Fallback if something weird happens
  const names = recipe.recipe_ingredients ?? [];
  return names.map((name, index) => ({
    ingredientName: name,
    quantity: null,
    unit: null as IngredientUnit | null,
    isOptional: false,
    position: index,
  }));
}

/**
 * Aggregate ingredients across many recipes into shopping-list lines.
 * - Groups by (normalized name + unit)
 * - Sums quantities when possible
 * - Tracks how many times an ingredient appears and how many of those were optional
 */
export function aggregateIngredientsForShoppingList(
  recipes: RecipeForm[]
): AggregatedIngredient[] {
  const map = new Map<string, AggregatedIngredient>();

  for (const recipe of recipes) {
    const ingredients = getStructuredIngredientsForRecipe(recipe);

    for (const ing of ingredients) {
      const normalizedName = ing.ingredientName.trim().toLowerCase();
      const unitKey = ing.unit ?? "";
      const key = `${normalizedName}::${unitKey}`;

      const qty = ing.quantity ?? null;

      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          ingredientName: ing.ingredientName,
          unit: ing.unit ?? null,
          totalQuantity: qty,
          occurrences: 1,
          optionalOccurrences: ing.isOptional ? 1 : 0,
        });
      } else {
        existing.occurrences += 1;
        if (ing.isOptional) existing.optionalOccurrences += 1;

        if (qty != null) {
          if (existing.totalQuantity == null) {
            existing.totalQuantity = qty;
          } else {
            existing.totalQuantity += qty;
          }
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.ingredientName.localeCompare(b.ingredientName)
  );
}
