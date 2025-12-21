"use client";

import { useActionState } from "react";
import { Button } from "@/app/ui/general/button";
import Link from "next/link";
import { DIFFICULTY, RECIPE_TYPES } from "@/app/lib/types/definitions";
import { RecipeFormState } from "@/app/lib/forms/state";
import IngredientsEditor from "@/app/ui/recipes/recipes-ingredients-editor";
import { buildInitialIngredientsForEditor } from "@/app/lib/ingredients";
import { updateRecipe } from "@/app/lib/recipes/actions";
import { capitalizeFirst } from "@/app/lib/utils/format";
import { RecipeWithOwner } from "@/app/lib/recipes/data";

// initial state with strong typing
const initialState: RecipeFormState = { message: null, errors: {} };

export default function EditRecipeForm({
  recipe,
}: {
  recipe: RecipeWithOwner;
}) {
  const [state, formAction] = useActionState(updateRecipe, initialState);

  const initialIngredients = buildInitialIngredientsForEditor(recipe);
  // const savedByCount = recipe.saved_by_count ?? 0;
  // const isPublic = recipe.status === "public";

  return (
    <form action={formAction} className="pb-12">
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
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base"
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
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base"
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

          {/* Difficulty */}
          <div className="mb-4">
            <label
              htmlFor="difficulty"
              className="mb-2 block text-sm font-medium"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={recipe.difficulty}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base"
              aria-describedby="difficulty-error"
            >
              <option value="" disabled>
                Select a difficulty
              </option>
              {DIFFICULTY.map((t) => (
                <option key={t} value={t}>
                  {capitalizeFirst(t)}
                </option>
              ))}
            </select>
            <div id="difficulty-error" aria-live="polite" aria-atomic="true">
              {state.errors?.difficulty?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>

          {/* Visibility (status) */}
          <div className="mb-4">
            <span className="mb-2 block text-sm font-medium">Visibility</span>

            <p className="text-xs text-gray-500">
              Public recipes can appear in Discover and be saved by other cooks.
              Switching back to private hides this recipe from Discover, but it
              doesn&apos;t remove it from anyone who already saved it.
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  defaultChecked={recipe.status !== "public"}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className="font-medium">Private</span>{" "}
                  <span className="text-gray-500">
                    (only you can see this recipe)
                  </span>
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="public"
                  defaultChecked={recipe.status === "public"}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  <span className="font-medium">Public</span>{" "}
                  <span className="text-gray-500">
                    (shared with the community in Discover)
                  </span>
                </span>
              </label>
            </div>

            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors.status?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>

          {/* Structured Ingredients editor */}
          <div className="mb-4">
            <IngredientsEditor initial={initialIngredients} />

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
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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

          {/* Equipment */}
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
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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

          {/* Allergens */}
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
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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

          {/* Dietary flags */}
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
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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
              defaultValue={recipe.servings ?? "e.g. 6 servings"}
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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
              defaultValue={recipe.prep_time_min ?? "e.g. 25 minutes"}
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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

          {/* Calories */}
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
              defaultValue={recipe.calories_total ?? "e.g. 5000 Kcal"}
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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
              defaultValue={recipe.estimated_cost_total ?? "e.g. $20"}
              className="block w-full rounded-md border border-gray-200 p-2 text-base"
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

      <div className="mt-6 flex justify-center gap-4 px-6 lg:justify-end lg:px-0">
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
