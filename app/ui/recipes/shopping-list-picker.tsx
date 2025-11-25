"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RecipeLite = {
  id: string;
  recipe_name: string;
};

type Props = {
  recipes: RecipeLite[];
};

export default function ShoppingListPicker({ recipes }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === recipes.length) {
      setSelected([]);
    } else {
      setSelected(recipes.map((r) => r.id));
    }
  };

  const goToShoppingList = () => {
    if (selected.length === 0) return;
    const params = new URLSearchParams();
    params.set("recipes", selected.join(","));
    router.push(`/dashboard/shopping-list?${params.toString()}`);
  };

  const disabled = selected.length === 0;

  if (recipes.length === 0) {
    return null; // nothing to pick
  }

  return (
    <section className="mb-6 rounded-md bg-gray-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Build a shopping list
          </h2>
          <p className="text-xs text-gray-600">
            Select one or more recipes and generate a combined shopping list.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
          >
            {selected.length === recipes.length
              ? "Clear selection"
              : "Select all"}
          </button>

          <button
            type="button"
            onClick={goToShoppingList}
            disabled={disabled}
            className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Create shopping list
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map((r) => {
          const checked = selected.includes(r.id);
          return (
            <label
              key={r.id}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={checked}
                onChange={() => toggle(r.id)}
              />
              <span className="truncate">{r.recipe_name}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
