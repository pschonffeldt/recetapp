// app/dashboard/shopping-list/page.tsx
import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchUserById, fetchIngredientsForUser } from "@/app/lib/data";
import { auth } from "@/auth";
import {
  IncomingIngredientPayload,
  IngredientUnit,
  UNIT_LABELS,
} from "@/app/lib/definitions";

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

    // Key by name + unit + “has quantity or not”
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
      // keep as “no quantity” entry
      existing.quantity = null;
    }
  }

  // Sort alphabetically for nicer UX
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
  searchParams?: { recipes?: string };
}) {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) notFound();

  const user = await fetchUserById(id);
  if (!user) notFound();

  // Read ?recipes=<id1>,<id2>,<id3>
  const raw = searchParams?.recipes;
  const recipeIds =
    raw && raw.trim().length > 0
      ? raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined; // undefined = “all recipes”

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
