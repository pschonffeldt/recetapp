"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ShoppingListRecipe } from "@/app/lib/data";
import { Button } from "../button";

type Props = {
  recipes: ShoppingListRecipe[];
  /** Parsed from ?recipes=… on the server */
  selectedIds: string[];
};

export default function ShoppingListRecipePicker({
  recipes,
  selectedIds,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If there are selectedIds in the URL, use those.
  // Otherwise default to "all recipes selected".
  // Default: ONLY what comes from the URL (or nothing)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(selectedIds ?? [])
  );

  useEffect(() => {
    const fromUrl = searchParams.get("recipes");

    // If there's no ?recipes= in the URL, treat it as "no selection"
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

  const allSelected = recipes.length > 0 && selected.size === recipes.length;

  const toggleAll = () => {
    setSelected(
      allSelected ? new Set<string>() : new Set(recipes.map((r) => r.id))
    );
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
    router.replace(`/dashboard/shopping-list${qs ? `?${qs}` : ""}`);
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
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-gray-800">
            Recipes to include
          </h2>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            {allSelected ? "Clear selection" : "Select all"}
          </button>
        </div>
        <ul className="mt-2 max-h-60 space-y-1 overflow-auto text-sm p-1">
          {recipes.map((r) => (
            <li key={r.id} className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selected.has(r.id)}
                  onChange={() => toggleOne(r.id)}
                />
                <span className="text-gray-800">{r.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          type="button"
          onClick={applyFilter}
        >
          Update shopping list
        </Button>
      </div>
    </div>
  );
}
