"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/ui/general/button";
import { RECIPE_TYPES, DIFFICULTY } from "@/app/lib/types/definitions";
import { RecipeFormState } from "@/app/lib/forms/state";
import IngredientsEditor from "@/app/ui/recipes/recipes-ingredients-editor";
import { createRecipe } from "@/app/lib/recipes/actions";
import { capitalizeFirst } from "@/app/lib/utils/format";

export default function RecipeForm() {
  const initialState: RecipeFormState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRecipe, initialState);

  return (
    <form action={formAction} className="pb-12">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Recipe name */}
        <div className="mb-4">
          <label
            htmlFor="recipe_name"
            className="mb-2 block text-sm font-medium"
          >
            Recipe name
          </label>
          <div className="relative">
            <input
              id="recipe_name"
              name="recipe_name"
              type="text"
              placeholder="e.g., Sandwich de palta"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
              aria-describedby="recipe_name-error"
            />
          </div>
          <div id="recipe_name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.recipe_name?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Type */}
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
            defaultValue=""
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base"
            aria-describedby="recipe_type-error"
          >
            <option value="" disabled>
              Select a type
            </option>
            {RECIPE_TYPES.map((t) => (
              <option key={t} value={t}>
                {capitalizeFirst(t)}
              </option>
            ))}
          </select>
          <div id="recipe_type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.recipe_type?.map((e) => (
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
            defaultValue=""
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

        {/* Visibility / Status */}
        <div className="mb-4">
          <span className="mb-1 block text-sm font-medium">Visibility</span>
          <p className="mb-2 text-xs text-gray-500">
            Choose who can see this recipe. You can change this later from the
            edit page.
          </p>

          <div className="space-y-1 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="private"
                defaultChecked
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
            {state.errors?.status?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Structured ingredients editor */}
        <IngredientsEditor initial={[]} />

        {/* Steps (one per line) */}
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
            rows={6}
            placeholder={
              "Cortar pan\nTostar pan\nMoler palta\nAgregar sal a gusto\nPoner palta en pan"
            }
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
            aria-describedby="recipe_steps-error"
          />
          <div id="recipe_steps-error" aria-live="polite" aria-atomic="true">
            {state.errors?.recipe_steps?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Equipment (one per line) */}
        <div className="mb-4">
          <label htmlFor="equipment" className="mb-2 block text-sm font-medium">
            Equipment (one per line)
          </label>
          <textarea
            id="equipment"
            name="equipment"
            rows={6}
            placeholder={"Horno\nSartén\nCuchillo\nTabla para picar"}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
            aria-describedby="equipment-error"
          />
          <div id="equipment-error" aria-live="polite" aria-atomic="true">
            {state.errors?.equipment?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Allergens (one per line) */}
        <div className="mb-4">
          <label htmlFor="allergens" className="mb-2 block text-sm font-medium">
            Allergens (one per line)
          </label>
          <textarea
            id="allergens"
            name="allergens"
            rows={6}
            placeholder={"Gluten\nMilk\nNuts\nEgg"}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
            aria-describedby="allergens-error"
          />
          <div id="allergens-error" aria-live="polite" aria-atomic="true">
            {state.errors?.allergens?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Dietary flags (one per line) */}
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
            rows={6}
            placeholder={"Vegetarian\nVegan\nGluten free\nPescatarian"}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
            aria-describedby="dietary_flags-error"
          />
          <div id="dietary_flags-error" aria-live="polite" aria-atomic="true">
            {state.errors?.dietary_flags?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* Servings, prep time, calories & cost */}
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
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
              placeholder="e.g. 6 servings"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
              aria-describedby="servings-error"
            />
            <div id="servings-error" aria-live="polite" aria-atomic="true">
              {state.errors?.servings?.map((e) => (
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
              placeholder="e.g. 25 minutes"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
              aria-describedby="prep_time_min-error"
            />
            <div id="prep_time_min-error" aria-live="polite" aria-atomic="true">
              {state.errors?.prep_time_min?.map((e) => (
                <p className="mt-2 text-sm text-red-500" key={e}>
                  {e}
                </p>
              ))}
            </div>
          </div>

          {/* Calories (total) */}
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
              placeholder="e.g. 5000 Kcal"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
              aria-describedby="calories_total-error"
            />
            <div
              id="calories_total-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.calories_total?.map((e) => (
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
              placeholder="e.g. $20"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
              aria-describedby="estimated_cost_total-error"
            />
            <div
              id="estimated_cost_total-error"
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.estimated_cost_total?.map((e) => (
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
          href="/recipes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Discard
        </Link>
        <Button type="submit">Create Recipe</Button>
      </div>

      {state.message && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
