import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/recipes/breadcrumbs";
import { notFound } from "next/navigation";
import {
  fetchUserById,
  fetchAllStructuredIngredientsForUser,
} from "@/app/lib/data";
import { auth } from "@/auth";
import { IncomingIngredientPayload, UNIT_LABELS } from "@/app/lib/definitions";

export const metadata: Metadata = { title: "Shopping list" };

// Helper: aggregate all ingredients across recipes
function aggregateIngredients(items: IncomingIngredientPayload[]) {
  type Aggregated = {
    name: string;
    unitLabel: string | null;
    quantity: number | null;
    hasOptional: boolean;
  };

  const map = new Map<string, Aggregated>();

  for (const ing of items) {
    const name = ing.ingredientName?.trim();
    if (!name) continue;

    const unitLabel = ing.unit ? UNIT_LABELS[ing.unit] ?? ing.unit : null;
    const key = `${name.toLowerCase()}||${unitLabel ?? ""}`;

    const existing = map.get(key) ?? {
      name,
      unitLabel,
      quantity: 0,
      hasOptional: false,
    };

    if (typeof ing.quantity === "number" && !Number.isNaN(ing.quantity)) {
      existing.quantity = (existing.quantity ?? 0) + ing.quantity;
    } else if (existing.quantity === 0) {
      // if we never had a numeric quantity, keep it null
      existing.quantity = null;
    }

    if (ing.isOptional) {
      existing.hasOptional = true;
    }

    map.set(key, existing);
  }

  return Array.from(map.entries())
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .map(([key, value]) => ({ key, ...value }));
}

export default async function Page() {
  const session = await auth();
  const id = (session?.user as any)?.id as string | undefined;
  if (!id) notFound();

  const user = await fetchUserById(id);
  if (!user) notFound();

  // 1) Fetch all structured ingredients for this user
  const rawIngredients = await fetchAllStructuredIngredientsForUser(id);

  // 2) Aggregate them for the shopping list
  const aggregated = aggregateIngredients(rawIngredients);

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

      <section className="mt-6 rounded-md bg-gray-50 p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-4">Shopping list</h1>

        {aggregated.length === 0 ? (
          <p className="text-sm text-gray-600">
            You don&apos;t have any recipes with structured ingredients yet.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {aggregated.map((item) => (
              <li key={item.key} className="flex items-start gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                  aria-hidden="true"
                />
                <span>
                  {item.quantity != null && (
                    <>
                      <strong>{item.quantity}</strong>{" "}
                    </>
                  )}
                  {item.unitLabel && <>{item.unitLabel} </>}
                  {item.name}
                  {item.hasOptional && (
                    <span className="ml-1 text-xs text-gray-500">
                      (includes optional)
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
