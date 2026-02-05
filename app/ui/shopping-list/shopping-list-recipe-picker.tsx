"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../general/button";
import ShoppingListActions from "./shopping-list-actions";
import { ShoppingListRecipe } from "@/app/lib/recipes/data";

type Props = {
  recipes: ShoppingListRecipe[];
  selectedIds: string[]; // parsed from ?recipes=… on the server
  lines: string[]; // aggregated + formatted items from the server
};

export default function ShoppingListRecipePicker({
  recipes,
  selectedIds,
  lines,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(selectedIds ?? []),
  );

  useEffect(() => {
    const fromUrl = searchParams.get("recipes");

    if (!fromUrl) {
      setSelected(new Set());
      return;
    }

    const ids = fromUrl
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setSelected(new Set(ids));
  }, [searchParams]);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set<string>(recipes.map((r) => r.id)));
  };

  const unSelectAll = () => {
    // 1) Clear local selection state (all checkboxes)
    setSelected(new Set<string>());

    // 2) Clear ?recipes=… from the URL so the server returns an empty list
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    sp.delete("recipes");

    const qs = sp.toString();
    router.replace(`/shopping-list${qs ? `?${qs}` : ""}`);
  };

  const applyFilter = () => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    const ids = Array.from(selected);

    if (ids.length === 0) {
      sp.delete("recipes");
    } else {
      sp.set("recipes", ids.join(","));
    }

    const qs = sp.toString();
    router.replace(`/shopping-list${qs ? `?${qs}` : ""}`);
  };

  if (recipes.length === 0) {
    return (
      <div className="mb-4 rounded-md border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-600">
        You don&apos;t have any recipes yet. Create some recipes to build a
        shopping list.
      </div>
    );
  }

  return (
    <div className="min-h-20">
      <div className="mb-4 rounded-md border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 border-b p-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-gray-800">
            Recipes to include
          </h2>

          {/* Mobile: 2-col grid. sm+: row */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-2">
            <Button
              className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-500 disabled:opacity-50 sm:w-auto sm:min-w-[120px]"
              type="button"
              onClick={selectAll}
            >
              Select all
            </Button>

            <Button
              className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-500 disabled:opacity-50 sm:w-auto sm:min-w-[120px]"
              type="button"
              onClick={unSelectAll}
            >
              Clear all
            </Button>
          </div>
        </div>

        <ul className="mt-2 min-h-80 max-h-160 space-y-1 overflow-auto p-1 text-sm">
          {recipes.map((r) => (
            <li key={r.id} className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selected.has(r.id)}
                  onChange={() => toggleOne(r.id)}
                />
                <span className="text-gray-800">{r.recipe_name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom actions: Update + Copy + Export PDF */}
      <div className="mt-4 space-y-2 sm:mt-3 sm:flex sm:items-center sm:justify-end sm:gap-2 sm:space-y-0">
        <Button
          className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm text-white hover:bg-blue-500 disabled:opacity-50 sm:w-auto"
          type="button"
          onClick={applyFilter}
        >
          Update shopping list
        </Button>

        <ShoppingListActions
          recipes={recipes}
          selectedIds={selectedIds}
          lines={lines}
        />
      </div>
    </div>
  );
}
