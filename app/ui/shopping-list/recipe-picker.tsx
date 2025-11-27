"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ShoppingListRecipe } from "@/app/lib/data";
import { Button } from "../button";
import { useToast } from "../toast/toast-provider";

const APP_URL = "https://recetapp-mu.vercel.app/";

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

  // Use toast provider
  const { push } = useToast();

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(selectedIds ?? [])
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
    router.replace(`/dashboard/shopping-list${qs ? `?${qs}` : ""}`);
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

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API not available");
      push({
        variant: "error",
        message: "Clipboard is not available in this browser.",
      });
      return;
    }

    // Recipes that are currently applied (from the URL / server)
    const appliedIds = selectedIds ?? [];
    const appliedRecipes = recipes.filter((r) => appliedIds.includes(r.id));

    const recipeLines =
      appliedRecipes.length > 0 ? appliedRecipes.map((r) => `- ${r.name}`) : [];

    const ingredientLines =
      lines.length > 0 ? lines.map((line) => `- ${line}`) : [];

    const sections: string[] = [];
    sections.push("Shopping list");

    if (recipeLines.length > 0) {
      sections.push("\nRecipes:\n" + recipeLines.join("\n"));
    }

    if (ingredientLines.length > 0) {
      sections.push("\nIngredients:\n" + ingredientLines.join("\n"));
    }

    // Footer with branding + URL
    sections.push("", "Generated with RecetApp", `Try it here: ${APP_URL}`);

    const text = sections.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      push({
        variant: "success",
        message: "Shopping list copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy shopping list:", err);
      push({
        variant: "error",
        message: "Could not copy shopping list. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-20">
      <div className="mb-4 rounded-md border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2 border-b p-2">
          <h2 className="text-sm font-medium text-gray-800">
            Recipes to include
          </h2>
          <div className="flex flex-row gap-2">
            <Button
              className="rounded-md bg-blue-600 px-3 py-4 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
              type="button"
              onClick={selectAll}
            >
              Select all
            </Button>
            <Button
              className="rounded-md bg-blue-600 px-3 py-4 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
              type="button"
              onClick={unSelectAll}
            >
              Clear selection and list
            </Button>
          </div>
        </div>
        <ul className="mt-2 min-h-80 max-h-160 space-y-1 overflow-auto text-sm p-1">
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
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <Button
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          type="button"
          onClick={applyFilter}
        >
          Update shopping list
        </Button>

        <Button
          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          type="button"
          onClick={handleCopy}
          disabled={selectedIds.length === 0 || lines.length === 0}
        >
          Copy list
        </Button>
      </div>
    </div>
  );
}
