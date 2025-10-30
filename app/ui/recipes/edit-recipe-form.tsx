"use client";

import { useActionState } from "react";
import { updateRecipe, type RecipeFormState } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import { capitalizeFirst } from "@/app/lib/utils";
import { RECIPE_TYPES, RecipeForm } from "@/app/lib/definitions";

// initial state with strong typing
const initialState: RecipeFormState = { message: null, errors: {} };

export default function EditRecipeForm({ recipe }: { recipe: RecipeForm }) {
  const [state, formAction] = useActionState(updateRecipe, initialState);

  return (
    <form action={formAction}>
      {/* Recipe form fields */}
      <input type="hidden" name="id" value={recipe.id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Base stats */}
        <div>
          {/* Recipe name */}
          <div className="mb-4">
            <label
              htmlFor="recipe_name"
              className="mb-2 block text-sm font-medium"
            >
              Recipe name
            </label>
            <input
              id="recipe_name"
              name="recipe_name"
              type="text"
              defaultValue={recipe.recipe_name}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              aria-describedby="recipe_name-error"
            />
            <div id="recipe_name-error" aria-live="polite" aria-atomic="true">
              {state.errors.recipe_name?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Recipe type */}
          <div className="mb-4">
            <label
              htmlFor="recipe_type"
              className="mb-2 block text-sm font-medium"
            >
              Type
            </label>
            <select
              id="recipe_type"
              name="recipe_type"
              defaultValue={recipe.recipe_type}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
              aria-describedby="recipe_type-error"
            >
              {RECIPE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {capitalizeFirst(t)}
                </option>
              ))}
            </select>
            <div id="recipe_type-error" aria-live="polite" aria-atomic="true">
              {state.errors.recipe_type?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Recipe ingredients */}
          <div className="mb-4">
            <label
              htmlFor="recipe_ingredients"
              className="mb-2 block text-sm font-medium"
            >
              Ingredients (one per line)
            </label>
            <textarea
              id="recipe_ingredients"
              name="recipe_ingredients"
              rows={5}
              defaultValue={recipe.recipe_ingredients.join("\n")}
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="recipe_ingredients-error"
            />
            <div
              id="recipe_ingredients-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors.recipe_ingredients?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Recipe steps */}
          <div className="mb-4">
            <label
              htmlFor="recipe_steps"
              className="mb-2 block text-sm font-medium"
            >
              Steps (one per line)
            </label>
            <textarea
              id="recipe_steps"
              name="recipe_steps"
              rows={5}
              defaultValue={recipe.recipe_steps.join("\n")}
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="recipe_steps-error"
            />
            <div id="recipe_steps-error" aria-live="polite" aria-atomic="true">
              {state.errors.recipe_steps?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Equipment (array: one per line) */}
          <div className="mb-4">
            <label
              htmlFor="equipment"
              className="mb-2 block text-sm font-medium"
            >
              Equipment (one per line)
            </label>
            <textarea
              id="equipment"
              name="equipment"
              rows={4}
              defaultValue={(recipe.equipment ?? []).join("\n")}
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="equipment-error"
            />
            <div id="equipment-error" aria-live="polite" aria-atomic="true">
              {state.errors.equipment?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Allergens (array: one per line) */}
          <div className="mb-4">
            <label
              htmlFor="allergens"
              className="mb-2 block text-sm font-medium"
            >
              Allergens (one per line)
            </label>
            <textarea
              id="allergens"
              name="allergens"
              rows={4}
              defaultValue={(recipe.allergens ?? []).join("\n")}
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="allergens-error"
            />
            <div id="allergens-error" aria-live="polite" aria-atomic="true">
              {state.errors.allergens?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Dietary flags (array: one per line) */}
          <div className="mb-4">
            <label
              htmlFor="dietary_flags"
              className="mb-2 block text-sm font-medium"
            >
              Dietary flags (one per line)
            </label>
            <textarea
              id="dietary_flags"
              name="dietary_flags"
              rows={4}
              defaultValue={(recipe.dietary_flags ?? []).join("\n")}
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="dietary_flags-error"
            />
            <div id="dietary_flags-error" aria-live="polite" aria-atomic="true">
              {state.errors.dietary_flags?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
        </div>
        {/* Other stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {/* Servings */}
          <div className="mb-4">
            <label
              htmlFor="servings"
              className="mb-2 block text-sm font-medium"
            >
              Servings
            </label>
            <input
              id="servings"
              name="servings"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              defaultValue={recipe.servings ?? ""}
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="servings-error"
            />
            <div id="servings-error" aria-live="polite" aria-atomic="true">
              {state.errors.servings?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Prep time (minutes) */}
          <div className="mb-4">
            <label
              htmlFor="prep_time_min"
              className="mb-2 block text-sm font-medium"
            >
              Prep time (minutes)
            </label>
            <input
              id="prep_time_min"
              name="prep_time_min"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={recipe.prep_time_min ?? ""} // null-safe
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="prep_time_min-error"
            />
            <div id="prep_time_min-error" aria-live="polite" aria-atomic="true">
              {state.errors.prep_time_min?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="calories_total"
              className="mb-2 block text-sm font-medium"
            >
              Calories (total)
            </label>
            <input
              id="calories_total"
              name="calories_total"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={recipe.calories_total ?? ""} // number | ""
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="calories_total-error"
            />
            <div
              id="calories_total-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors.calories_total?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
          {/* Estimated cost (total) */}
          <div className="mb-4">
            <label
              htmlFor="estimated_cost_total"
              className="mb-2 block text-sm font-medium"
            >
              Estimated cost (total)
            </label>
            <input
              id="estimated_cost_total"
              name="estimated_cost_total"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              defaultValue={recipe.estimated_cost_total ?? ""} // string | ""
              className="block w-full rounded-md border border-gray-200 p-2 text-sm"
              aria-describedby="estimated_cost_total-error"
            />
            <div
              id="estimated_cost_total-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors.estimated_cost_total?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/recipes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Discard Changes
        </Link>
        <Button type="submit">Save Changes</Button>
      </div>

      {/* Global message */}
      {state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </form>
  );
}
