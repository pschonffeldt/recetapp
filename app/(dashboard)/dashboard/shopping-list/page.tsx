// app/dashboard/shopping-list/page.tsx
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

  // --- NEW: resolve searchParams Promise safely ---
  const sp = searchParams ? await searchParams : {};
  const raw = sp.recipes;
  const recipeIds =
    raw && raw.trim().length > 0
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined; // undefined = “all recipes”

  // Fetch all recipes for the picker
  const recipes = await fetchRecipesForUser(id);

  // Get structured ingredients for this user (optionally filtered by recipes)
  const rawIngredients = await fetchIngredientsForUser(id, recipeIds);

  // Aggregate + format
  const aggregated = aggregateIngredients(rawIngredients);
  const lines = aggregated.map(formatAggregatedItem);

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

      <section className="mt-4 rounded-md bg-gray-50 p-6">
        <h1 className="mb-4 text-xl font-semibold">Shopping list</h1>

        <ShoppingListRecipePicker
          recipes={recipes}
          selectedIds={recipeIds ?? []}
        />

        {lines.length === 0 ? (
          <p className="text-sm text-gray-600">
            No ingredients found yet. Add some recipes first, or select recipes
            to include.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-gray-900">
            {lines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
