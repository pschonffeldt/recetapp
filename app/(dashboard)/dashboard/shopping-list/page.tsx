// app/(dashboard)/dashboard/shopping-list/page.tsx
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import { notFound } from "next/navigation";
import {
  fetchUserById,
  fetchIngredientsForUser,
  fetchRecipesForUser,
} from "@/app/lib/data";
import { auth } from "@/auth";
import {
  IncomingIngredientPayload,
  IngredientUnit,
  UNIT_LABELS,
} from "@/app/lib/definitions";
import ShoppingListRecipePicker from "@/app/ui/shopping-list/recipe-picker";

export const metadata: Metadata = { title: "Shopping list" };

// --- Helpers --------------------------------------------------

type AggregatedItem = {
  name: string;
  unit: IngredientUnit | null;
  quantity: number | null;
};

function aggregateIngredients(
  ingredients: IncomingIngredientPayload[]
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
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}

function formatAggregatedItem(item: AggregatedItem): string {
  const unitLabel = item.unit ? UNIT_LABELS[item.unit] ?? item.unit : "";
  const qtyPart =
    item.quantity != null
      ? unitLabel
        ? `${item.quantity} ${unitLabel}`
        : String(item.quantity)
      : "";

  return qtyPart ? `${qtyPart} ${item.name}` : item.name;
}

// --- Page -----------------------------------------------------

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ recipes?: string }>;
}) {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) notFound();

  const user = await fetchUserById(id);
  if (!user) notFound();

  // Resolve searchParams Promise (Next 15 style)
  const sp = searchParams ? await searchParams : {};
  const raw = sp.recipes ?? "";

  // NEW: empty or missing `recipes` => "no selection"
  const recipeIds =
    raw.trim().length > 0
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []; // <-- no selection

  // Fetch all recipes for the picker (so the checkboxes always have data)
  const recipes = await fetchRecipesForUser(id);

  // Get structured ingredients only when there are selected recipes
  const rawIngredients =
    recipeIds.length === 0 ? [] : await fetchIngredientsForUser(id, recipeIds);

  // Aggregate + format
  const aggregated = aggregateIngredients(rawIngredients);
  const lines = aggregated.map(formatAggregatedItem);

  const selectedCount = recipeIds.length;
  const hasRecipes = recipes.length > 0;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "Shopping list",
            href: "/dashboard/shopping-list",
            active: true,
          },
        ]}
      />

      <section className="mt-4 space-y-4">
        {/* Top card: context + picker */}
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <h1 className="text-xl font-semibold">Shopping list</h1>

          <p className="mt-1 text-sm text-gray-600">
            {!hasRecipes
              ? "You don't have any recipes yet. Create a recipe to start building a shopping list."
              : selectedCount === 0
              ? "Select one or more recipes below to generate your shopping list."
              : `Based on ${selectedCount} selected recipe${
                  selectedCount > 1 ? "s" : ""
                }.`}
          </p>

          <div className="mt-4">
            <ShoppingListRecipePicker
              recipes={recipes}
              selectedIds={recipeIds}
            />
          </div>
        </div>

        {/* Bottom card: actual list */}
        <div className="rounded-md border bg-white p-4 shadow-sm md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Items
            </h2>
            <p className="text-xs text-gray-500">
              {lines.length === 0
                ? "No items yet"
                : `${lines.length} item${
                    lines.length === 1 ? "" : "s"
                  } in your list`}
            </p>
          </div>

          {lines.length === 0 ? (
            <p className="text-sm text-gray-600">
              {!hasRecipes
                ? "No ingredients found yet. Add some recipes first."
                : "Select recipes above and click “Update shopping list” to generate your items."}
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-gray-900">
              {lines.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
