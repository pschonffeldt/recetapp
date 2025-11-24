"use client";

import { useEffect, useState } from "react";
import type { IngredientUnit, RecipeIngredient } from "@/app/lib/definitions";
import { UNIT_LABELS, ALL_UNITS } from "@/app/lib/definitions";

type DraftIngredient = {
  id: string; // local ID just for React
  ingredientName: string;
  quantity: string; // keep as string in UI
  unit: IngredientUnit | "";
  isOptional: boolean;
};

type Props = {
  /** Existing ingredients (for edit form); empty for create */
  initial?: RecipeIngredient[];
};

export default function IngredientsEditor({ initial = [] }: Props) {
  const [rows, setRows] = useState<DraftIngredient[]>([]);

  // Hydrate from server data
  useEffect(() => {
    if (!initial.length) {
      setRows([
        {
          id: crypto.randomUUID(),
          ingredientName: "",
          quantity: "",
          unit: "",
          isOptional: false,
        },
      ]);
      return;
    }

    setRows(
      initial.map((ri) => ({
        id: ri.id,
        ingredientName: ri.ingredientName,
        quantity: ri.quantity != null ? String(ri.quantity) : "",
        unit: (ri.unit ?? "") as IngredientUnit | "",
        isOptional: ri.isOptional,
      }))
    );
  }, [initial]);

  const updateRow = (id: string, patch: Partial<DraftIngredient>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ingredientName: "",
        quantity: "",
        unit: "",
        isOptional: false,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) =>
      prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)
    );
  };

  // Serialize for server
  const serialized = JSON.stringify(
    rows
      .filter((r) => r.ingredientName.trim().length > 0)
      .map((r, index) => ({
        ingredientName: r.ingredientName.trim(),
        quantity: r.quantity.trim() === "" ? null : Number(r.quantity.trim()),
        unit: r.unit || null,
        isOptional: r.isOptional,
        position: index,
      }))
  );

  return (
    <>
      {/* Hidden field that the server action will read */}
      <input type="hidden" name="ingredientsJson" value={serialized} />

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Ingredients</label>

        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div
              key={row.id}
              className="grid gap-2 rounded-md border border-gray-200 p-2 sm:grid-cols-[2fr,1fr,1fr,auto]"
            >
              {/* Ingredient name */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Ingredient</span>
                <input
                  type="text"
                  className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                  placeholder="e.g. Tomato"
                  value={row.ingredientName}
                  onChange={(e) =>
                    updateRow(row.id, { ingredientName: e.target.value })
                  }
                  required={idx === 0}
                />
              </div>

              {/* Quantity */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Qty</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                  placeholder="e.g. 2"
                  value={row.quantity}
                  onChange={(e) =>
                    updateRow(row.id, { quantity: e.target.value })
                  }
                />
              </div>

              {/* Unit */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Unit</span>
                <select
                  className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                  value={row.unit}
                  onChange={(e) =>
                    updateRow(row.id, {
                      unit: e.target.value as IngredientUnit | "",
                    })
                  }
                >
                  <option value="">—</option>
                  {ALL_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {UNIT_LABELS[u]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional + Remove */}
              <div className="flex flex-col items-end justify-between gap-1 sm:items-center sm:justify-center">
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={row.isOptional}
                    onChange={(e) =>
                      updateRow(row.id, { isOptional: e.target.checked })
                    }
                  />
                  Optional
                </label>

                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="text-xs text-red-600 hover:underline"
                  disabled={rows.length <= 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-2 rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          + Add ingredient
        </button>
      </div>
    </>
  );
}
