import {
  IncomingIngredientPayload,
  IngredientUnit,
} from "@/app/lib/types/definitions";

export type AggregatedItem = {
  name: string;
  unit: IngredientUnit | null;
  quantity: number | null;
};

export function aggregateIngredients(
  ingredients: IncomingIngredientPayload[],
): AggregatedItem[] {
  const map = new Map<string, AggregatedItem>();

  for (const ing of ingredients) {
    // Skip optional items for now
    if (ing.isOptional) continue;

    const name = ing.ingredientName.trim();
    const unit = ing.unit ?? null;
    const hasQty = typeof ing.quantity === "number";

    const key = `${name.toLowerCase()}|${unit ?? ""}|${hasQty ? "q" : "noq"}`;

    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        name,
        unit,
        quantity: hasQty ? ing.quantity! : null,
      });
    } else if (hasQty && existing.quantity != null) {
      existing.quantity += ing.quantity!;
    } else if (!hasQty) {
      existing.quantity = null;
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}
