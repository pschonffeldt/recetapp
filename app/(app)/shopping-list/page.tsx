import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchIngredientsForUser } from "@/app/lib/ingredients/data";
import { fetchRecipesForUser } from "@/app/lib/recipes/data";
import { aggregateIngredients } from "@/app/lib/shopping-list/aggregate-ingredients";
import { formatAggregatedItem } from "@/app/lib/shopping-list/format-aggregated-item";
import { fetchUserById } from "@/app/lib/users/data";
import ShoppingListRecipePicker from "@/app/ui/shopping-list/shopping-list-recipe-picker";
import { auth } from "@/auth";

export const metadata: Metadata = { title: "Shopping list" };

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

  // empty or missing `recipes` => "no selection"
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
          { label: "Shopping list", href: "/shopping-list", active: true },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
        {/* LEFT: picker */}
        <section className="mb-10 space-y-4 px-4 md:px-0">
          <div className="rounded-md bg-gray-50 p-4 md:h-[640px] md:p-6">
            <p className="mt-1 text-sm text-gray-600">
              {!hasRecipes
                ? "You don't have any recipes yet. Create a recipe to start building a shopping list."
                : selectedCount === 0
                  ? "Select recipes for your list."
                  : `Based on ${selectedCount} selected recipe${
                      selectedCount > 1 ? "s" : ""
                    }.`}
            </p>

            <div className="mt-4">
              <ShoppingListRecipePicker
                recipes={recipes}
                selectedIds={recipeIds ?? []}
                lines={lines}
              />
            </div>
          </div>
        </section>

        {/* RIGHT: items */}
        <section className="mb-10 space-y-4 px-4 md:px-0">
          <div className="rounded-md border bg-white p-4 shadow-sm md:h-[640px] md:overflow-auto md:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Items
              </h2>
              <p className="text-xs text-gray-500">
                {lines.length === 0
                  ? "No items yet"
                  : `${lines.length} item${lines.length === 1 ? "" : "s"} in your list`}
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
      </div>
    </main>
  );
}
