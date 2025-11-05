"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/ui/button";
import { createRecipe, RecipeFormState } from "@/app/lib/actions";
import { capitalizeFirst } from "@/app/lib/utils";
import { RECIPE_TYPES, DIFFICULTY } from "@/app/lib/definitions";

// Dropdown of meal type:
// const RECIPE_TYPES = [
//   "breakfast",
//   "lunch",
//   "dinner",
//   "dessert",
//   "snack",
// ] as const;

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

        {/* Ingredients (one per line) */}
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
            placeholder={"Pan\nPalta\nSal"}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
            aria-describedby="recipe_ingredients-error"
          />
          <div
            id="recipe_ingredients-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.recipe_ingredients?.map((e) => (
              <p className="mt-2 text-sm text-red-500" key={e}>
                {e}
              </p>
            ))}
          </div>
        </div>

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
          <label
            htmlFor="recipe_equipment"
            className="mb-2 block text-sm font-medium"
          >
            Equipment (one per line)
          </label>
          <textarea
            id="recipe_equipment"
            name="recipe_equipment"
            rows={6}
            placeholder={"Horno\nSartén\nCuchillo\nTabla para picar"}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-base placeholder:text-gray-500"
            aria-describedby="recipe_equipment-error"
          />
          <div
            id="recipe_equipment-error"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.errors?.recipe_steps?.map((e) => (
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
        {/* Input for servings, prep time, caloreis & cost */}
        <div className="grid gap-4 md:grid-cols-4  sm:grid-cols-2">
          {/* Servings */}
          <div className="mb-4">
            <label
              htmlFor="dietary_flags"
              className="mb-2 block text-sm font-medium"
            >
              Servings
            </label>
            <input
              id="servings"
              name="servings"
              placeholder={""}
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
              placeholder={""}
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
              placeholder={""}
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
              placeholder={""}
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

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/recipes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Discard
        </Link>
        <Button type="submit">Create Recipe</Button>
      </div>

      {/* Top-level form error */}
      {state.message && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
